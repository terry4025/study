import type { Lesson, Block, Settings, Note } from './types.js';
import { Repository } from './repository.js';
import { Library, type BookEntry } from './library.js';
import { Store } from './store.js';
import { element as el, button, prose, inline, math, externalLink } from './text.js';
import { createLab } from './labs.js';
import { glossary } from './glossary.js';
const modeLabel = (kind: Lesson['kind']) => kind === 'legacy' ? '기존 학습 노트' : kind === 'correction' ? '정정 해설' : kind === 'guide' ? '원문 읽기 길잡이' : '독자 입문 강의';
const cleanTitle = (s: string) => s.replace(/^\d+\.\d+\s*/, '').replace(/\s*\([^)]*\)$/, '');
/** Injectable browser boundary for isolated rendering tests. Production callers
 * omit this argument and use native URL, History and LocalStorage. */
export interface ReaderEnvironment {
    location: Pick<Location,'href'|'search'|'hash'>;
    history: Pick<History,'pushState'|'replaceState'>;
    storage?: Storage;
}
export function createReader(host: HTMLElement, catalog: Library, environment?: ReaderEnvironment): () => void {
    const location = environment?.location || window.location;
    const history = environment?.history || window.history;
    const abort = new AbortController();
    const signal = abort.signal;
    let storage: Storage | undefined;
    try {
        storage = environment ? environment.storage : window.localStorage;
    }
    catch { }
    const store = new Store(storage);
    let activeEntry = catalog.get(store.value.activeBookId) || catalog.books.find(x => x.definition.status === 'available');
    if (!activeEntry) throw new Error('최소 한 개의 학습 자료를 등록해 주세요.');
    let repo: Repository = activeEntry.repository;
    const bookId = () => activeEntry!.definition.id;
    let current: Lesson | null = null, routeToken = 0, observer: IntersectionObserver | null = null;
    let scrollTimer: number | undefined, searchTimer: number | undefined, toastTimer: number | undefined, destroyed = false;
    const shell = el('div', 'reader-app');
    const header = el('header', 'app-header');
    const view = el('div', 'app-view');
    const toast = el('div', 'toast');
    toast.setAttribute('role', 'status');
    toast.hidden = true;
    shell.append(header, view, toast);
    host.replaceChildren(shell);
    let activeDialog: HTMLDialogElement | null = null;
    function inform(text: string) { toast.textContent = text; toast.hidden = false; window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.hidden = true, 4500); }
    function saveFeedback() { if (store.warning)
        inform(store.warning); }
    function applySettings() {
        const s = store.value.settings;
        document.documentElement.dataset.readerTheme = s.theme;
        shell.style.setProperty('--reader-size', `${s.fontSize}px`);
        shell.style.setProperty('--reader-leading', String(s.lineHeight));
        shell.style.setProperty('--reader-measure', s.measure === 'wide' ? '840px' : '720px');
        shell.classList.toggle('hide-hints', !s.hints);
        shell.classList.toggle('show-english', s.englishNotes);
    }
    applySettings();
    const brand = button('결', () => goLibrary(), 'brand');
    brand.setAttribute('aria-label', '결 스터디 서재로');
    brand.append(el('span', 'brand-en', 'STUDY'));
    const nav = el('nav', 'header-nav');
    nav.setAttribute('aria-label', '주요 메뉴');
    nav.append(button('서재', () => goLibrary(), 'nav-button'), button('학습 기록', () => openHistory(), 'nav-button'));
    const tools = el('div', 'header-tools');
    const searchButton = button('검색', () => openSearch(), 'search-trigger');
    searchButton.append(el('kbd', '', 'Ctrl K'));
    tools.append(searchButton, button('용어', () => openGlossary(), 'nav-button'), button('읽기 설정', () => openSettings(), 'nav-button settings-trigger'));
    const skip = el('a', 'skip-link', '본문으로 건너뛰기');
    skip.href = '#main-content';
    header.append(skip, brand, nav, tools);
    function modal(title: string, className = ''): {
        dialog: HTMLDialogElement;
        body: HTMLElement;
        close: () => void;
    } {
        activeDialog?.close();
        const previous = document.activeElement as HTMLElement | null;
        const d = el('dialog', `reader-dialog ${className}`);
        const top = el('div', 'dialog-head');
        const heading = el('h2', '', title);
        heading.id = 'dialog-title';
        d.setAttribute('aria-labelledby', heading.id);
        const close = () => d.close();
        const x = button('×', close, 'icon-button');
        x.setAttribute('aria-label', '닫기');
        top.append(heading, x);
        const body = el('div', 'dialog-body');
        d.append(top, body);
        shell.append(d);
        activeDialog = d;
        document.body.classList.add('dialog-open');
        d.addEventListener('close', () => { if (activeDialog === d) {
            activeDialog = null;
            document.body.classList.remove('dialog-open');
        } d.remove(); if (previous?.isConnected)
            previous.focus(); });
        d.addEventListener('click', event => { if (event.target === d) {
            const r = d.getBoundingClientRect();
            if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)
                close();
        } });
        d.showModal();
        return { dialog: d, body, close };
    }
    function recordPosition() {
        if (!current)
            return;
        const blocks = Array.from(view.querySelectorAll<HTMLElement>('[data-block-id]'));
        let target = view.querySelector<HTMLElement>('#lesson-title');
        for (const b of blocks) {
            if (b.getBoundingClientRect().top <= 120)
                target = b;
            else
                break;
        }
        if (target)
            store.position(current.id, { block: target.id, offset: target.getBoundingClientRect().top - 88, y: window.scrollY });
    }
    function restorePosition(id: string, anchor?: string) {
        const p = store.book.positions[id];
        const owner=bookId();
        const key = anchor || p?.block;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (destroyed || current?.id !== id || bookId()!==owner)
                return;
            const target = key ? document.getElementById(key) : null;
            if (target) {
                const top = target.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: Math.max(0, top - 88 - (anchor ? 0 : (p?.offset || 0))), behavior: 'instant' });
                if (anchor) {
                    target.tabIndex = -1;
                    target.focus({ preventScroll: true });
                }
            }
            else
                window.scrollTo({ top: anchor ? 0 : p?.y || 0, behavior: 'instant' });
        }));
    }
    function routeTo(url: URL) {
        recordPosition(); activeDialog?.close(); window.clearTimeout(scrollTimer);
        history.pushState({}, '', url); void renderRoute();
    }
    function navigate(id: string, anchor?: string, targetBook = bookId()) {
        const resolved = catalog.resolveLesson(targetBook,id);
        const url = new URL(location.href); url.search = '';
        url.searchParams.set('book',resolved?.bookId || targetBook);
        url.searchParams.set('sec',resolved?.meta.id || id); url.hash=anchor || ''; routeTo(url);
    }
    function goLibrary() { const url=new URL(location.href); url.search='?view=library'; url.hash=''; routeTo(url); }
    function goBook(id = bookId()) { const url=new URL(location.href); url.search=''; url.searchParams.set('book',id); url.hash=''; routeTo(url); }
    function linkBook(id:string,title:string,className=''): HTMLAnchorElement {
        const a=el('a',className,title); a.href=`?book=${encodeURIComponent(id)}`;
        a.addEventListener('click',e=>{if(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();goBook(id);}});return a;
    }
    function linkLesson(id: string, title: string, className = '', anchor?: string, targetBook = bookId()): HTMLAnchorElement {
        const resolved=catalog.resolveLesson(targetBook,id), owner=resolved?.bookId||targetBook, lessonId=resolved?.meta.id||id;
        const a = el('a', className, title);
        a.href = `?book=${encodeURIComponent(owner)}&sec=${encodeURIComponent(lessonId)}${anchor ? '#' + encodeURIComponent(anchor) : ''}`;
        a.addEventListener('click', e => { if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
            e.preventDefault(); navigate(lessonId, anchor, owner);
        } }); return a;
    }
    function originalBadge(): HTMLElement { return el('span', 'kind-label', '독자 집필 · 원문 번역 아님'); }
    function progressText() { const done = store.book.completed.filter(x => repo.has(x)).length; return `${done} / ${repo.metas.length} 수업 읽음`; }
    function library() {
        current=null; observer?.disconnect(); document.title='결 스터디 · 서재';
        const main=el('main','library'); main.id='main-content'; main.tabIndex=-1;
        const top=el('section','library-intro'), intro=el('div','intro-copy');
        intro.append(el('p','eyebrow','YOUR PERSONAL LIBRARY'),el('h1','','깊이 읽고,\n서로 연결하기.'),el('p','intro-description','한 권에서 배운 기초가 다음 책의 출발점이 됩니다.\n읽기 기록과 메모는 책마다 따로, 기초 개념은 함께.'));
        const stats=el('div','intro-index');
        const books=catalog.books.filter(x=>x.definition.role==='book');
        const available=books.filter(x=>x.definition.status==='available');
        stats.append(el('span','eyebrow','A GROWING COLLECTION'),el('p','progress-counter',`${String(books.length).padStart(2,'0')}권의 서재`),el('p','muted',`${available.length}권 학습 자료 제공 · ${books.length-available.length}권 준비 예정`));
        top.append(intro,stats);main.append(top);
        const lastEntry=catalog.get(store.value.activeBookId),lastId=lastEntry&&store.forBook(lastEntry.definition.id).lastLesson;
        if(lastEntry&&lastId&&lastEntry.repository.has(lastId)) {
            const resume=el('section','resume-strip'); resume.append(el('div','',lastEntry.definition.title+' · '+lastEntry.repository.meta(lastId)!.title),linkLesson(lastId,'이어 읽기 →','button primary',undefined,lastEntry.definition.id));main.append(resume);
        }
        const grid=el('section','shelf-grid');grid.setAttribute('aria-label','책 목록');
        books.forEach((entry,index)=>{
            const b=entry.definition,card=el('article','shelf-card'+(b.status==='planned'?' planned':''));
            const cover=el('div','shelf-cover');cover.setAttribute('aria-hidden','true');
            cover.append(el('span','eyebrow',`VOLUME ${String(index+1).padStart(2,'0')}`),el('strong','',b.title),el('span','cover-edition',b.edition));
            const copy=el('div','shelf-copy');copy.append(el('p','kind-label',b.status==='planned'?'준비 예정':'학습 동반자 · 완역 아님'),el('h2','',b.title),el('p','muted',b.subtitle));
            if(b.status==='available') {
                const cov=catalog.coverage(b.id),read=store.forBook(b.id).completed.filter(id=>entry.repository.has(id)).length;
                copy.append(el('p','shelf-status',`${cov.sections}개 원문 절 안내 · ${read}개 수업 읽음`));
            } else copy.append(el('p','shelf-status','본문 미등록 · 학습 진도 없음'));
            copy.append(linkBook(b.id,b.status==='available'?'책 펼치기 →':'준비 상태 보기','button '+(b.status==='available'?'primary':'secondary')));
            card.append(cover,copy);grid.append(card);
        });main.append(grid);
        const shared=el('section','shared-foundations');shared.append(el('p','eyebrow','BEFORE YOU BEGIN'),el('h2','','수학과 코드, 함께 쓰는 기초'));
        for(const entry of catalog.books.filter(x=>x.definition.role==='foundation'))shared.append(el('p','muted',entry.definition.description),linkBook(entry.definition.id,`${entry.repository.metas.length}개 공통 기초 수업 →`,'button secondary'));
        shared.append(el('p','muted','공통 준비실은 여섯 권의 책 수에 포함하지 않습니다.'));main.append(shared);
        main.append(el('footer','library-footer','결 스터디 · 이 브라우저에 기록 저장 · 계정/기기 간 자동 동기화 없음'));
        view.replaceChildren(main);window.scrollTo({top:0,behavior:'instant'});
    }
    function bookOverview() {
        current=null;observer?.disconnect(); const entry=activeEntry!,b=entry.definition;
        document.title=b.title+' · 결 스터디';const main=el('main','library book-overview');main.id='main-content';main.tabIndex=-1;
        main.append(button('← 전체 서재',goLibrary,'text-button'));
        const head=el('header','book-overview-head');head.append(el('p','eyebrow',b.role==='foundation'?'SHARED FOUNDATIONS':'READING COMPANION'),el('h1','',b.title),el('p','book-subtitle',b.subtitle),el('p','book-description',b.description));
        if(b.authors.length)head.append(el('p','muted',b.authors.join(' · ')+' / '+b.edition));
        main.append(head);
        if(b.status==='planned') {
            main.append(el('section','preview-notice','이 책은 아직 학습 본문이 없습니다. 제목을 눌러도 다른 책의 내용이나 임의의 예제를 대신 표시하지 않습니다.'));
            if(b.sourceUrl)main.append(externalLink('도서 공식 사이트 확인',b.sourceUrl));
            main.append(el('p','muted',b.rights.label));view.replaceChildren(main);window.scrollTo(0,0);return;
        }
        const actions=el('div','book-actions');const last=store.book.lastLesson&&repo.meta(store.book.lastLesson),first=repo.metas[0];
        if(last||first)actions.append(linkLesson((last||first)!.id,last?'이어 읽기 →':'첫 수업 읽기 →','button primary'));
        if(b.role==='book')actions.append(linkBook('foundations','미분·적분 기초부터','button secondary'));
        actions.append(button('기록 보기',openHistory,'button secondary'));main.append(actions,el('p','progress-counter small-counter',progressText()));
        if(b.outline?.length)main.append(sourceOutline(entry));
        const sections=el('section','course-contents');sections.id='course-contents';
        const sh=el('div','section-heading');sh.append(el('h2','','앱에서 읽는 학습 자료'),el('span','muted',`${repo.metas.length}개 수업 · 원문 절 개수와는 다른 수치`));sections.append(sh);
        for(const ch of repo.chapters) {
            const d=el('details','chapter-row');d.open=repo.chapters[0]===ch;
            const sum=el('summary');sum.append(el('span','chapter-number',ch.id==='0'?'00':ch.id.padStart(2,'0')),el('span','chapter-name',ch.title),el('span','chapter-count',`${ch.lessons.length} 수업`),el('span','chevron','+'));d.append(sum,el('p','chapter-subtitle',ch.subtitle));
            const list=el('div','chapter-lessons');for(const m of ch.lessons){const a=linkLesson(m.id,m.title,'lesson-row');a.prepend(el('span','lesson-state',store.book.completed.includes(m.id)?'✓':'—'));a.append(el('span','lesson-meta',modeLabel(m.kind)));list.append(a);}d.append(list);sections.append(d);
        }main.append(sections);
        const rights=el('details','scope-note');rights.append(el('summary','','자료 범위와 이용 조건'),el('p','',b.rights.label));
        if(b.rights.url)rights.append(externalLink('이용 조건 원문',b.rights.url));
        rights.append(el('p','','로컬 해설이 있거나 읽음으로 표시했다고 원문 번역·정확성 검수가 완료되는 것은 아닙니다.'));main.append(rights);
        view.replaceChildren(main);window.scrollTo({top:0,behavior:'instant'});
    }
    function sourceOutline(entry:BookEntry): HTMLElement {
        const b=entry.definition,cov=catalog.coverage(b.id),panel=el('section','source-outline');panel.id='source-outline';
        panel.append(el('div','eyebrow','THE SOURCE / READING MAP'),el('h2','','원문 목차와 학습 현황'));
        const stats=el('div','coverage-stats');
        for(const [value,label] of [[cov.sections,'번호가 붙은 원문 절'],[cov.legacyNotes,'기존 노트 연결'],[cov.guides,'독자 길잡이 연결'],[cov.sourceReviewed,'원문 대조 검수 완료']] as const){const item=el('div');item.append(el('strong','',String(value)),el('span','',label));stats.append(item);}panel.append(stats);
        panel.append(el('p','preview-notice','원문 전체의 완역본이 아닙니다. 길잡이는 원문을 읽기 위한 준비 설명이며 모든 수식 유도·코드 구현을 대신하지 않습니다. 기존 노트는 미검수 상태를 유지합니다.'));
        if(cov.sourceOnly)panel.append(el('p','muted',`${cov.sourceOnly}개 절은 이 실행 환경에 로컬 자료가 연결되지 않았습니다. 공식 원문으로 열 수 있습니다.`));
        const readStatus=el('p','source-read-count');const refresh=()=>readStatus.textContent=`직접 표시한 원문 읽기: ${store.book.sourceRead.filter(id=>b.outline!.some(ch=>ch.sections.some(s=>s.id===id))).length} / ${cov.sections}절`;
        refresh();panel.append(readStatus);
        if(b.sourceUrl)panel.append(externalLink('공식 전체 목차 · 서문과 색인 포함',b.sourceUrl));
        for(const ch of b.outline||[]) {
            const details=el('details','source-chapter');details.open=ch.id==='9';
            details.append(el('summary','',`${ch.id} · ${ch.titleKo} (${ch.sections.length})`));
            for(const section of ch.sections){const row=el('div','source-row');row.dataset.sourceSection=section.id;
                const name=el('div','source-name');name.append(el('strong','',section.number+' '+section.titleKo),el('small','muted',section.title));
                const status=section.review==='source-reviewed'?'원문 대조 검수 완료':section.coverage==='legacy-note'?'기존 노트 · 대조 필요':'독자 길잡이 · 완역 아님';name.append(el('span','kind-label',status));row.append(name);
                const controls=el('div','source-actions');if(section.lessonId&&repo.has(section.lessonId))controls.append(linkLesson(section.lessonId,section.coverage==='legacy-note'?'노트 열기':'길잡이 열기','text-link'));
                controls.append(externalLink('원문 ↗',section.url));
                const read=button('',()=>{store.toggle('sourceRead',section.id);update();refresh();saveFeedback();},'source-read-button');
                function update(){const yes=store.book.sourceRead.includes(section.id);read.textContent=yes?'원문 읽음 ✓':'원문 읽음 표시';read.setAttribute('aria-pressed',String(yes));read.setAttribute('aria-label',section.number+' '+read.textContent);}update();controls.append(read);row.append(controls);details.append(row);
            }
            const links=el('div','chapter-resources');if(ch.sections[0])links.append(externalLink('장 도입부',ch.sections[0].url.slice(0,ch.sections[0].url.lastIndexOf('/'))));for(const r of ch.resources)links.append(externalLink(r.title,r.url));details.append(links);panel.append(details);
        }
        return panel;
    }
    function tocContent(id: string, close?: () => void): HTMLElement { const list = el('div', 'toc-list'); for (const ch of repo.chapters) {
        const d = el('details', 'toc-chapter');
        d.open = ch.lessons.some(m => m.id === id);
        const sum = el('summary');
        sum.append(el('span', 'toc-number', ch.id === '0' ? '기초' : ch.id), el('span', '', ch.title));
        d.append(sum);
        for (const m of ch.lessons) {
            const a = linkLesson(m.id, m.title, 'toc-lesson');
            if (m.id === id) {
                a.classList.add('active');
                a.setAttribute('aria-current', 'page');
            }
            if (store.book.completed.includes(m.id))
                a.append(el('span', 'toc-done', '✓'));
            if (close)
                a.addEventListener('click', close);
            d.append(a);
        }
        list.append(d);
    } return list; }
    function openToc() { const { body, close } = modal('학습 목차', 'toc-dialog'); body.append(tocContent(current?.id || '', close)); }
    function reader(l: Lesson) {
        current = l;
        store.book.lastLesson = l.id;
        store.save();
        document.title = `${l.title} · 결 스터디`;
        observer?.disconnect();
        const workspace = el('div', 'workspace');
        const sidebar = el('aside', 'reader-sidebar');
        sidebar.setAttribute('aria-label', '책 전체 목차');
        const sh = el('div', 'sidebar-head');
        sh.append(el('span', 'eyebrow', 'READING / '+bookId()), el('h2', '', activeEntry!.definition.title), button('← 책 목차로', () => goBook(), 'text-button'), button('전체 서재',goLibrary,'text-button'));
        sidebar.append(sh, tocContent(l.id), el('p', 'sidebar-progress', progressText()));
        const main = el('main', 'reader-main');
        main.id = 'main-content';
        main.tabIndex = -1;
        const top = el('div', 'reading-toolbar');
        const bc = el('div', 'reading-breadcrumb');
        bc.append(button('목차', openToc, 'button secondary mobile-toc'), el('span', '', l.chapter === '0' ? '준비 코스' : /^[A-Z]$/.test(l.chapter) ? `부록 ${l.chapter}` : `제${l.chapter}장`), el('span', 'crumb-divider', '/'), el('span', '', l.chapterTitle));
        top.append(bc);
        const bookMark = button('', () => { store.toggle('bookmarks', l.id); updateBookmark(); saveFeedback(); }, 'text-button bookmark-button');
        function updateBookmark() { const yes = store.book.bookmarks.includes(l.id); bookMark.textContent = yes ? '저장됨 ✓' : '나중에 읽기 +'; bookMark.setAttribute('aria-pressed', String(yes)); }
        updateBookmark();
        top.append(bookMark);
        main.append(top);
        const article = el('article', 'reading-article');
        const title = el('header', 'lesson-header');
        title.append(el('p', 'eyebrow', l.chapter === '0' ? 'FOUNDATIONS' : `CHAPTER ${l.chapter.padStart(2, '0')}`));
        const h1 = el('h1', '', cleanTitle(l.title));
        h1.id = 'lesson-title';
        title.append(h1, el('p', 'lesson-deck', l.deck));
        const meta = el('div', 'lesson-byline');
        meta.append(l.kind === 'original' ? originalBadge() : el('span', 'kind-label', modeLabel(l.kind)), el('span', '', `학습 예상 ${l.minutes}분 · 개인차 있음`));
        title.append(meta);
        article.append(title);
        if (l.notice) {
            const d = el('details', 'editorial-notice');
            d.open = l.kind === 'correction' || ['ch02-01', 'ch04-01', 'ch05-02', 'ch07-03', 'ch08-01'].includes(l.id);
            d.append(el('summary', '', '자료 상태와 정정 사항'), prose(l.notice));
            article.append(d);
        }
        if (l.prerequisites.length) {
            const pre = el('div', 'prerequisite-strip');
            pre.append(el('span', '', '먼저 알아두면 좋아요'));
            for (const id of l.prerequisites) {
                const m = catalog.resolveLesson(bookId(),id)?.meta;
                if (m)
                    pre.append(linkLesson(id, m.title, 'prerequisite-link'));
            }
            article.append(pre);
        }
        const goals = el('details', 'learning-goals');
        goals.append(el('summary', '', '이 수업에서 이해할 것'));
        const ul = el('ul');
        l.goals.forEach(g => { const li = el('li'); li.append(inline(g)); ul.append(li); });
        goals.append(ul);
        article.append(goals);
        const headings: {
            id: string;
            text: string;
        }[] = [];
        const seen = new Set<string>();
        for (const b of l.blocks) {
            let id = b.id;
            if (seen.has(id))
                id += '-' + seen.size;
            seen.add(id);
            const n = renderBlock({ ...b, id }, l);
            n.id = id;
            n.dataset.blockId = id;
            article.append(n);
            if (b.type === 'heading')
                headings.push({ id, text: b.text });
        }
        const sources = el('section', 'lesson-sources');
        sources.append(el('h2', '', '더 깊게 읽기'));
        sources.append(el('p', 'muted', (l.kind === 'original' || l.kind === 'guide') ? '이 수업은 독자적인 입문 해설입니다. 아래 자료는 배경 학습과 원문 접근을 위한 링크이며, 문단별 번역 대응을 의미하지 않습니다.' : '보존한 노트의 참고 출처입니다. 영어 노트가 실제 원문과 일치하는지 이 링크에서 대조하세요.'));
        for (const s of l.references)
            sources.append(externalLink(s.title, s.url));
        article.append(sources);
        const complete = el('div', 'complete-panel');
        const done = button('', () => { store.toggle('completed', l.id); updateDone(); updateSidebarProgress(); saveFeedback(); }, 'button primary');
        function updateDone() { const yes = store.book.completed.includes(l.id); done.textContent = yes ? '읽음 표시 취소' : '이 수업 읽음으로 표시 ✓'; done.setAttribute('aria-pressed', String(yes)); }
        updateDone();
        complete.append(el('p', '', '읽었다는 기록은 직접 남깁니다. 이해가 부족한 부분은 메모하고 다시 돌아오세요.'), done);
        article.append(complete);
        const idx = repo.metas.findIndex(m => m.id === l.id), prev = repo.metas[idx - 1], next = repo.metas[idx + 1];
        const pager = el('nav', 'lesson-pager');
        pager.setAttribute('aria-label', '수업 이동');
        if (prev) {
            const a = linkLesson(prev.id, '', 'pager-link');
            a.append(el('small', '', '← 이전 수업'), el('strong', '', prev.title));
            pager.append(a);
        }
        else
            pager.append(el('span'));
        if (next) {
            const a = linkLesson(next.id, '', 'pager-link next');
            a.append(el('small', '', '다음 수업 →'), el('strong', '', next.title));
            pager.append(a);
        }
        else
            pager.append(button('코스를 돌아보며 서재로 →', () => goLibrary(), 'button secondary'));
        article.append(pager);
        main.append(article);
        const rail = el('aside', 'reader-rail');
        rail.setAttribute('aria-label', '현재 수업 길잡이');
        rail.append(el('p', 'eyebrow', 'IN THIS LESSON'));
        const mini = el('nav', 'mini-toc');
        for (const h of headings) {
            const a = el('a', '', h.text);
            a.href = '#' + encodeURIComponent(h.id);
            a.addEventListener('click', event => { event.preventDefault(); jump(h.id); });
            mini.append(a);
        }
        rail.append(mini, button('이 수업에 메모 +', () => openNote(l.id, 'lesson-title'), 'text-button'), button('기초 용어 찾아보기', () => openGlossary(), 'text-button'));
        const readingProgress = el('div', 'reading-progress');
        readingProgress.append(el('span', 'reading-progress-fill'));
        workspace.append(sidebar, main, rail, readingProgress);
        view.replaceChildren(workspace);
        const targets = headings.map(h => document.getElementById(h.id)).filter((x): x is HTMLElement => !!x);
        observer = new IntersectionObserver(entries => { for (const ent of entries)
            if (ent.isIntersecting) {
                mini.querySelectorAll('a').forEach(a => a.classList.toggle('current', a.hash === '#' + encodeURIComponent(ent.target.id)));
            } }, { rootMargin: '-80px 0px -65% 0px', threshold: 0 });
        targets.forEach(t => observer?.observe(t));
    }
    function updateSidebarProgress() { view.querySelectorAll('.sidebar-progress').forEach(x => x.textContent = progressText()); const a = view.querySelector<HTMLAnchorElement>('a.toc-lesson.active'); if (a && current) {
        a.querySelector('.toc-done')?.remove();
        if (store.book.completed.includes(current.id))
            a.append(el('span', 'toc-done', '✓'));
    } }
    function jump(id: string) { const target = document.getElementById(id); if (!target)
        return; recordPosition(); history.replaceState({}, '', '#' + encodeURIComponent(id)); target.scrollIntoView({ block: 'start', behavior: 'instant' }); target.tabIndex = -1; target.focus({ preventScroll: true }); }
    function renderBlock(b: Block, l: Lesson): HTMLElement {
        const container = el('section', 'content-block');
        switch (b.type) {
            case 'heading': {
                container.classList.add('heading-block');
                container.append(el(b.level === 3 ? 'h3' : b.level === 4 ? 'h4' : 'h2', '', b.text));
                break;
            }
            case 'paragraph': {
                container.classList.add('paragraph-block');
                container.append(prose(b.text));
                const nb = button('+', () => openNote(l.id, b.id), 'paragraph-note');
                nb.setAttribute('aria-label', '이 문단에 메모');
                container.append(nb);
                if (b.english) {
                    const d = el('details', 'english-note');
                    d.append(el('summary', '', '영어 노트 · 실제 원문 일치 미검수'), prose(b.english));
                    container.append(d);
                }
                break;
            }
            case 'equation': {
                container.classList.add('equation-block');
                container.append(math(b.tex, true));
                if (b.explanation)
                    container.append(prose(b.explanation));
                if (b.terms?.length) {
                    const dl = el('dl', 'symbol-guide');
                    for (const [t, d] of b.terms)
                        dl.append(el('dt', '', t), el('dd', '', d));
                    container.append(dl);
                }
                break;
            }
            case 'aside': {
                container.classList.add('aside-block');
                if (b.tone === 'warning')
                    container.classList.add('warning-aside');
                else
                    container.classList.add('optional-hint');
                const d = el('details');
                d.open = b.tone === 'warning';
                d.append(el('summary', '', b.title), prose(b.text));
                container.append(d);
                break;
            }
            case 'code': {
                container.classList.add('code-block');
                const top = el('div', 'code-caption');
                top.append(el('span', '', b.title), el('span', 'code-provenance', b.provenance === 'teaching' ? '독립 학습용 예제' : '기존 코드 · 원문 일치 미검수'));
                const copy = button('복사', () => { if (navigator.clipboard)
                    void navigator.clipboard.writeText(b.code).then(() => inform('코드를 복사했습니다.')).catch(() => inform('복사 권한이 없습니다. 코드를 선택해 복사하세요.'));
                else
                    inform('이 환경에서는 자동 복사를 지원하지 않습니다. 코드를 선택해 복사하세요.'); }, 'text-button');
                top.append(copy);
                const pre = el('pre');
                pre.tabIndex = 0;
                pre.append(el('code', '', b.code));
                container.append(top, pre);
                if (b.explanation)
                    container.append(prose(b.explanation));
                break;
            }
            case 'figure': {
                container.classList.add('figure-block');
                const figure = el('figure');
                const image = el('img');
                const raw = b.src;
                image.src = raw.startsWith('/books/') ? new URL('books/' + raw.slice(7), document.baseURI).href : raw;
                image.alt = b.verified ? b.title : '보존된 그림 · 원문 매핑 미검수';
                image.loading = 'lazy';
                image.decoding = 'async';
                image.width = 1000;
                image.height = 600;
                image.addEventListener('error', () => { image.hidden = true; figure.prepend(el('p', 'figure-failure', '그림 파일을 불러오지 못했습니다. 원본 경로와 출처를 확인해 주세요.')); });
                const zoom = button('그림 확대 ↗', () => { const { body } = modal('그림 확대', 'figure-dialog'); const img = image.cloneNode() as HTMLImageElement; img.loading = 'eager'; body.append(img, el('p', 'muted', '기존 그림의 번호·설명 일치는 아직 검수되지 않았습니다.')); }, 'text-button');
                const caption = el('figcaption');
                caption.append(el('span', 'kind-label', b.verified ? '그림' : '그림 연결 · 대조 필요'), zoom);
                if (b.verified)
                    caption.append(prose(b.caption));
                else {
                    const d = el('details', 'legacy-caption');
                    d.append(el('summary', '', '기존 캡션 확인 · 내용이 맞지 않을 수 있습니다'), prose(b.caption));
                    caption.append(d);
                }
                figure.append(image, caption);
                if(b.verified)container.append(figure);
                else {const disclosure=el('details','unreviewed-figure');disclosure.append(el('summary','','보존된 그림 열기 · 번호와 내용 대조 필요'),el('p','muted','이 그림이 해당 문단에 맞는지는 검수되지 않았습니다. 정확한 대응은 수업 아래 원문에서 확인하세요.'),figure);container.append(disclosure);}
                break;
            }
            case 'quiz': {
                container.classList.add('quiz-block');
                container.append(el('p', 'eyebrow', 'CHECK YOUR UNDERSTANDING'), el('h3', '', b.question));
                const form = el('form');
                const fs = el('fieldset');
                fs.append(el('legend', 'sr-only', b.question));
                b.options.forEach((option, i) => { const label = el('label', 'quiz-option'); const input = el('input'); input.type = 'radio'; input.name = b.id; input.value = String(i); input.checked = (store.book.answers[`${l.id}:${b.id}`] ?? store.book.answers[b.id]) === i; label.append(input, el('span', '', option)); fs.append(label); });
                form.append(fs);
                const submit = el('button', 'button secondary', '선택한 답 확인');
                submit.type = 'submit';
                const feedback = el('div', 'quiz-feedback');
                feedback.setAttribute('role', 'status');
                feedback.hidden = true;
                form.addEventListener('submit', event => { event.preventDefault(); const checked = form.querySelector<HTMLInputElement>('input:checked'); feedback.hidden = false; if (!checked) {
                    feedback.textContent = '답 하나를 먼저 선택해 주세요.';
                    return;
                } const answer = Number(checked.value); store.answer(`${l.id}:${b.id}`,answer,answer === b.answer); feedback.classList.toggle('correct', answer === b.answer); feedback.replaceChildren(el('strong', '', answer === b.answer ? '맞았습니다.' : '다시 생각해 봅시다.'), prose(b.feedback)); saveFeedback(); });
                form.append(submit, feedback);
                container.append(form);
                break;
            }
            case 'lab':
                container.classList.add('lab-block');
                container.append(el('p', 'eyebrow', 'TRY IT YOURSELF'), el('h3', '', b.title), createLab(b.kind));
                break;
            case 'unknown':
                container.classList.add('unsupported-block');
                container.append(el('p', '', `표시되지 않은 콘텐츠 유형: ${b.label}. 조용히 누락하지 않고 검수 대상으로 표시합니다.`));
                break;
            default: {
                const never: never = b;
                throw new Error(`Unhandled block ${String(never)}`);
            }
        }
        return container;
    }
    async function renderRoute() {
        const token=++routeToken;observer?.disconnect();
        const params=new URLSearchParams(location.search);let owner=params.get('book'),id=params.get('sec');
        if(params.get('view')==='library'||(!owner&&!id)){library();return;}
        // Backward compatibility only for the previously shipped PBRT URL format.
        if(!owner&&id) owner='pbrt-4ed';
        let entry=owner?catalog.get(owner):undefined;
        if(!entry){current=null;view.replaceChildren(errorView('등록되지 않은 책입니다.','주소의 책 ID를 확인하세요. 다른 책을 대신 열지 않습니다.'));return;}
        if(id){const resolved=catalog.resolveLesson(entry.definition.id,id);if(resolved&&resolved.bookId!==entry.definition.id){entry=catalog.get(resolved.bookId)!;id=resolved.meta.id;const u=new URL(location.href);u.searchParams.set('book',entry.definition.id);u.searchParams.set('sec',id);history.replaceState({},'',u);}}
        activeEntry=entry;repo=entry.repository;store.selectBook(entry.definition.id);
        if(!id){bookOverview();return;}
        current=null;
        if(entry.definition.status==='planned'){view.replaceChildren(errorView('이 책의 본문은 준비 중입니다.','아직 등록된 수업이 없습니다.'));return;}
        view.replaceChildren(el('main','loading-page','수업을 불러오고 있습니다…'));
        try {
            const lesson=await repo.get(id);if(destroyed||token!==routeToken)return;
            if(!lesson){view.replaceChildren(errorView('이 수업을 찾을 수 없습니다.','주소를 확인하거나 책 목차에서 다른 수업을 선택하세요.'));return;}
            reader(lesson);let anchor:string|undefined;try{anchor=location.hash?decodeURIComponent(location.hash.slice(1)):undefined;}catch{}
            restorePosition(lesson.id,anchor);
        }catch {if(destroyed||token!==routeToken)return;view.replaceChildren(errorView('기존 수업을 불러오지 못했습니다.','콘텐츠 파일 또는 네트워크를 확인하세요. 독자 길잡이와 공통 기초는 계속 읽을 수 있습니다.'));
            view.querySelector('main')?.append(button('다시 불러오기',()=>void renderRoute(),'button secondary'));}
    }
    function errorView(title: string, message: string): HTMLElement { const m = el('main', 'error-page'); m.id = 'main-content'; m.append(el('p', 'eyebrow', 'READING DESK'), el('h1', '', title), el('p', '', message), button('서재로 돌아가기', () => goLibrary(), 'button primary'), linkLesson('math-01', '기초 수업 읽기', 'button secondary',undefined,'foundations')); return m; }
    function openSearch() {
        const { body, dialog, close } = modal('본문 검색', 'search-dialog');
        const label = el('label', 'sr-only', '찾을 단어나 코드');
        label.htmlFor = 'fulltext-search';
        const input = el('input', 'search-input');
        input.id = 'fulltext-search';
        input.type = 'search';
        input.placeholder = '미분, 확률밀도, BSDF, 코드…';
        const hint = el('p', 'search-help', '한국어·영어 노트·수식·코드를 함께 찾습니다. ↑↓ 이동 · Enter 열기');
        const results = el('div', 'search-results');
        const status = el('p', 'search-status');
        status.setAttribute('role', 'status');
        const scope=el('select','search-scope');scope.setAttribute('aria-label','검색 범위');
        const allOption=el('option','','전체 학습 자료');allOption.value='';const bookOption=el('option','',activeEntry!.definition.title+' 안에서');bookOption.value=bookId();scope.append(allOption,bookOption);
        body.append(label, input, scope, hint, status, results);
        let seq = 0;
        let selected = -1;
        input.addEventListener('input', () => { window.clearTimeout(searchTimer); const request = ++seq; const q = input.value.trim(); selected = -1; if (!q) {
            status.textContent = '';
            results.replaceChildren();
            return;
        } status.textContent = '본문을 찾는 중입니다…'; searchTimer = window.setTimeout(async () => { try {
            const {hits,warnings} = await catalog.search(q,scope.value||undefined);
            if (!dialog.open || seq !== request)
                return;
            results.replaceChildren();
            status.textContent = hits.length ? `${hits.length}개 결과 · 선택하면 해당 문단으로 이동합니다.` : '일치하는 내용을 찾지 못했습니다.';
            if(warnings.length)status.append(el('span','search-warning',' 일부 자료 제외: '+warnings.join(' ')));
            for (const hit of hits) {
                const a = linkLesson(hit.lesson.id, '', 'search-result', hit.blockId,hit.bookId);
                a.append(el('small', '', `${hit.bookTitle} · ${modeLabel(hit.lesson.kind)}`), el('strong', '', hit.lesson.title), el('span', '', hit.excerpt));
                results.append(a);
            }
        }
        catch {
            if (seq === request)
                status.textContent = '기존 콘텐츠 검색에 실패했습니다. 연결 상태를 확인한 뒤 다시 검색하세요.';
        } }, 160); });
        scope.addEventListener('change',()=>input.dispatchEvent(new Event('input')));
        input.addEventListener('keydown', e => { const links = Array.from(results.querySelectorAll<HTMLAnchorElement>('a')); if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!links.length)
                return;
            selected = Math.max(0, Math.min(links.length - 1, selected + (e.key === 'ArrowDown' ? 1 : -1)));
            links.forEach((a, i) => a.classList.toggle('selected', i === selected));
            links[selected].scrollIntoView({ block: 'nearest' });
        } if (e.key === 'Enter' && links.length) {
            e.preventDefault();
            links[Math.max(0, selected)].click();
            close();
        } });
        input.focus();
    }
    function openGlossary() {
        const { body, close } = modal('기초 용어', 'glossary-dialog');
        const input = el('input', 'search-input');
        input.type = 'search';
        input.placeholder = '한국어 또는 영어 용어';
        input.setAttribute('aria-label', '용어 검색');
        const list = el('div', 'glossary-list');
        const terms=[...glossary,...(activeEntry!.definition.glossary||[])];
        body.append(el('p', 'muted', `공통 기초와 현재 책의 용어 ${terms.length}개를 함께 찾습니다. 기존 사전 데이터는 삭제하지 않았습니다.`), input, list);
        function draw() { const query = input.value.toLowerCase(); const found = terms.filter(g => (g.term + ' ' + g.english + ' ' + g.text).toLowerCase().includes(query)); list.replaceChildren(); if (!found.length)
            list.append(el('p', 'empty-state', '일치하는 용어가 없습니다.')); for (const g of found) {
            const item = el('section', 'glossary-entry');
            item.append(el('h3', '', g.term), el('small', 'muted', g.english), prose(g.text));
            if(g.lesson&&catalog.resolveLesson(bookId(),g.lesson))item.append(linkLesson(g.lesson, '관련 설명으로 →', 'text-link'));
            list.append(item);
        } }
        input.addEventListener('input', draw);
        draw();
        input.focus();
    }
    function openNote(lessonId:string,blockId:string,owner=bookId()) {
        const {body,close}=modal('읽으며 남긴 생각','note-dialog');const key=`${lessonId}:${blockId}`,existing=store.forBook(owner).notes[key];
        body.append(el('p','muted',(catalog.get(owner)?.definition.title||owner)+' · '+(catalog.get(owner)?.repository.meta(lessonId)?.title||lessonId)));
        const label=el('label','','어디까지 이해했고, 무엇이 궁금한가요?'),textarea=el('textarea','note-input');textarea.value=existing?.text||'';textarea.maxLength=20000;textarea.rows=8;label.append(textarea);
        const save=button('메모 저장',()=>{store.note({lessonId,blockId,text:textarea.value,updated:new Date().toISOString()},owner);close();inform('메모를 저장했습니다.');saveFeedback();},'button primary');
        body.append(label,el('p','muted','책별로 이 브라우저에 저장합니다. 다른 기기로 옮기려면 전체 기록을 내보내세요.'),save);textarea.focus();
    }
    function openHistory() {
        const {body}=modal('책별 학습 기록','history-dialog');body.append(el('p','muted','읽음 표시와 원문 읽기, 퀴즈 시도는 다른 기록입니다. 번역 검수 완료를 의미하지 않습니다.'));
        let any=false;
        for(const [owner,progress] of Object.entries(store.value.books)) {
            if(!progress.completed.length&&!progress.bookmarks.length&&!Object.keys(progress.notes).length&&!progress.sourceRead.length&&!Object.keys(progress.quizAttempts).length)continue;
            any=true;const entry=catalog.get(owner),group=el('section','record-section');
            group.append(el('h3','',entry?.definition.title||`등록되지 않은 책 (${owner})`),el('p','muted',`수업 읽음 ${progress.completed.length} · 원문 읽음 ${progress.sourceRead.length} · 답안 제출 ${Object.values(progress.quizAttempts).reduce((n,q)=>n+q.attempts,0)}회`));
            for(const [title,ids] of [['나중에 읽기',progress.bookmarks],['읽은 수업',progress.completed]] as const) {
                if(!ids.length)continue;group.append(el('h4','',title));
                for(const id of ids){const meta=entry?.repository.meta(id);group.append(meta?linkLesson(id,meta.title,'saved-lesson',undefined,owner):el('p','muted',`${id} · 자료 미등록, 기록은 보존됨`));}
            }
            for(const note of Object.values(progress.notes).sort((a,b)=>b.updated.localeCompare(a.updated))) {
                const card=el('article','note-card'),meta=entry?.repository.meta(note.lessonId);
                card.append(meta?linkLesson(note.lessonId,meta.title,'text-link',note.blockId,owner):el('span','muted',note.lessonId),el('p','note-plain',note.text),button('편집',()=>openNote(note.lessonId,note.blockId,owner),'text-button'));group.append(card);
            }body.append(group);
        }
        if(!any)body.append(el('p','empty-state','아직 남긴 기록이 없습니다. 수업 마지막에서 읽음 표시를 하거나 메모를 남겨보세요.'));
        body.append(button('모든 책 기록 내보내기',exportProgress,'button secondary'));
    }
    function exportProgress() { const blob = new Blob([store.export()], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = el('a'); a.href = url; a.download = `gyeol-progress-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); inform('학습 기록 파일을 만들었습니다.'); }
    function openSettings() {
        const { body, close } = modal('읽기 설정', 'settings-dialog');
        const theme = el('fieldset', 'settings-group');
        theme.append(el('legend', '', '화면'));
        for (const [id, name] of [['light', '밝게'], ['sepia', '종이'], ['dark', '어둡게']] as const) {
            const b = button(name, () => { store.setSettings({ theme: id }); applySettings(); theme.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); saveFeedback(); }, 'theme-choice');
            b.setAttribute('aria-pressed', String(store.value.settings.theme === id));
            theme.append(b);
        }
        body.append(theme);
        function slider(title: string, key: 'fontSize' | 'lineHeight', min: number, max: number, step: number) { const label = el('label', 'settings-slider'); const output = el('output', '', String(store.value.settings[key])); const input = el('input'); input.type = 'range'; input.min = String(min); input.max = String(max); input.step = String(step); input.value = String(store.value.settings[key]); input.setAttribute('aria-label', title); input.addEventListener('input', () => { output.value = input.value; store.setSettings({ [key]: Number(input.value) }); applySettings(); }); label.append(el('span', '', title), output, input); body.append(label); }
        slider('본문 글자 크기', 'fontSize', 16, 24, 1);
        slider('줄 간격', 'lineHeight', 1.6, 2.2, 0.1);
        const width = el('label', 'settings-check');
        const sel = el('select');
        sel.setAttribute('aria-label', '본문 너비');
        for (const [id, name] of [['normal', '기본 너비'], ['wide', '넓게 읽기']]) {
            const option = el('option', '', name);
            option.value = id;
            sel.append(option);
        }
        sel.value = store.value.settings.measure;
        sel.addEventListener('change', () => { store.setSettings({ measure: sel.value === 'wide' ? 'wide' : 'normal' }); applySettings(); });
        width.append(el('span', '', '본문 너비'), sel);
        body.append(width);
        for (const [key, title, desc] of [['hints', '쉬운 보충 설명', '비유와 기초 설명을 펼칠 수 있게 합니다. 주의 사항은 숨기지 않습니다.'], ['englishNotes', '기존 영어 노트 표시', '실제 원문과의 일치가 검수된 영어가 아닙니다. 정확한 원문은 출처에서 확인하세요.']] as const) {
            const label = el('label', 'settings-check');
            const c = el('input');
            c.type = 'checkbox';
            c.checked = store.value.settings[key];
            c.addEventListener('change', () => { store.setSettings({ [key]: c.checked }); applySettings(); });
            const t = el('span', '', title);
            t.append(el('small', '', desc));
            label.append(t, c);
            body.append(label);
        }
        const data = el('section', 'settings-data');
        data.append(el('h3', '', '기록 보관'), el('p', 'muted', '읽기 위치·메모·답안·설정은 이 브라우저에 저장됩니다. 계정 동기화는 하지 않습니다.'));
        data.append(button('기록 내보내기', exportProgress, 'button secondary'));
        const label = el('label', 'button secondary file-label', '기록 불러오기');
        const file = el('input');
        file.type = 'file';
        file.accept = '.json,application/json';
        file.setAttribute('aria-label', '학습 기록 JSON 파일 선택');
        label.append(file);
        const status = el('p', 'import-status');
        status.setAttribute('role', 'status');
        data.append(label, status);
        file.addEventListener('change', async () => { data.querySelector('.confirm-import')?.remove(); const f = file.files?.[0]; if (!f)
            return; try {
            if (f.size > 5000000)
                throw new Error('5MB 이하의 기록만 불러올 수 있습니다.');
            const text = await f.text();
            const trial = new Store();
            trial.restore(text);
            status.textContent = `${Object.keys(trial.value.books).length}개 자료의 기록 · ${Object.values(trial.value.books).reduce((n,b)=>n+b.completed.length,0)}개 읽기 표시. 기존 전체 기록은 백업 후 대체됩니다.`;
            data.querySelector('.confirm-import')?.remove();
            const confirm = button('현재 기록을 대체하여 불러오기', () => { try { recordPosition(); store.restore(text); current=null; applySettings(); close(); goLibrary(); inform('기록을 불러왔습니다.'); saveFeedback(); } catch(e){status.textContent=e instanceof Error?e.message:'백업을 만들지 못해 복원을 중단했습니다.';} }, 'button primary confirm-import');
            data.append(confirm);
        }
        catch (e) {
            status.textContent = e instanceof Error ? e.message : '기록 파일을 읽지 못했습니다.';
        } });
        body.append(data);
    }
    window.addEventListener('popstate', () => { recordPosition(); void renderRoute(); }, { signal });
    window.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
    } }, { signal });
    window.addEventListener('scroll', () => { if (!current)
        return; window.clearTimeout(scrollTimer); scrollTimer = window.setTimeout(recordPosition, 250); const article = view.querySelector<HTMLElement>('.reading-article'); const fill = view.querySelector<HTMLElement>('.reading-progress-fill'); if (article && fill) {
        const top = article.getBoundingClientRect().top + scrollY;
        const max = Math.max(1, article.offsetHeight - innerHeight + 100);
        fill.style.width = Math.max(0, Math.min(100, (scrollY - top) / max * 100)) + '%';
    } }, { passive: true, signal });
    window.addEventListener('pagehide', recordPosition, { signal });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden')
        recordPosition(); }, { signal });
    void renderRoute();
    if (store.warning)
        inform(store.warning);
    return () => { recordPosition(); destroyed = true; routeToken++; abort.abort(); observer?.disconnect(); activeDialog?.close(); clearTimeout(scrollTimer); clearTimeout(searchTimer); clearTimeout(toastTimer); host.replaceChildren(); document.body.classList.remove('dialog-open'); };
}
