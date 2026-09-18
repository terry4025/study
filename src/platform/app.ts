import { books, resolveBook } from './registry.js';
import type { BookPackage, RegisteredBook } from './types.js';
import { Store } from '../reader/store.js';
const el = <K extends keyof HTMLElementTagNameMap>(tag:K, cls='', text='') => {
    const n=document.createElement(tag);n.className=cls;n.textContent=text;return n;
};
const action=(label:string,run:()=>void,cls='button secondary')=>{const b=el('button',cls,label);b.type='button';b.onclick=run;return b;};
const external=(label:string,url:string)=>{const a=el('a','source-link',label+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
function storage():Storage|undefined { try{return window.localStorage;}catch{return undefined;} }
export function createPlatform(host:HTMLElement):()=>void {
    const abort=new AbortController();let disposed=false,token=0,readerCleanup:(()=>void)|undefined;
    let mounted='',screen='';
    const cache=new Map<string,Promise<BookPackage>>();
    function navigate(book?:string,view='book',section?:string){
        const u=new URL(location.href);u.search='';u.hash='';
        if(book)u.searchParams.set('book',book);
        u.searchParams.set('view',book?view:'library');
        if(section)u.searchParams.set('sec',section);
        history.pushState({},'',u);void route();
    }
    function frame(title:string,subtitle:string){
        const shell=el('div','reader-app platform-app'),header=el('header','app-header');
        header.append(action('결 STUDY',()=>navigate(),'brand'),el('span','header-nav','여섯 권의 개인 서재'));
        const main=el('main','library platform-library');main.id='main-content';
        const hero=el('section','platform-intro');hero.append(el('p','eyebrow','LEARN AT YOUR OWN PACE'),el('h1','',title),el('p','intro-description',subtitle));
        main.append(hero);shell.append(header,main);host.replaceChildren(shell);document.title=title+' · 결 스터디';return main;
    }
    function shelf(){
        const main=frame('한 권씩, 깊이 있게.','읽던 책을 이어가거나, 다음 배움의 자리를 골라보세요.');
        const grid=el('div','shelf-grid');
        for(const registered of books){const book=registered.card;
            const card=el('article','shelf-card'),cover=el('div','shelf-cover');cover.setAttribute('aria-hidden','true');
            cover.append(el('small','',book.id==='pbrt-4ed'?'01 / RENDERING':'READING DESK'),el('strong','',book.coverLines.join('\n')),el('span','',book.subtitle));
            const text=el('div','shelf-copy');text.append(el('p','eyebrow',book.status==='available'?'학습 자료 제공 · 검수 진행 중':'추가 예정'),el('h2','',book.title),el('p','muted',book.description));
            if(book.status==='available'){
                const store=new Store(storage(),book.id);
                const last=store.value.lastLesson;
                text.append(action(last?'이어 읽기 →':'책 펼치기 →',()=>navigate(book.id,'book',last||undefined),'button primary'));
                text.append(action('목차·자료 상태',()=>navigate(book.id,'outline'),'text-button'));
                if(store.warning)text.append(el('p','preview-notice',store.warning));
            }else text.append(action('예정 도서 정보',()=>navigate(book.id),'button secondary'));
            card.append(cover,text);grid.append(card);
        }
        main.append(grid,el('p','platform-footnote','준비된 자료, 원문 대조 상태, 내가 읽은 기록은 서로 다르게 관리합니다. 예정 도서에는 아직 학습 내용을 넣지 않았습니다.'));
    }
    function planned(book:RegisteredBook){
        const main=frame(book.card.title,'아직 수업을 제공하지 않는 예정 도서입니다.');
        main.append(el('p','',book.card.subtitle),el('p','muted',book.card.description),el('p','preview-notice','다른 책의 수업을 이 책의 내용인 것처럼 표시하지 않습니다.'));
        if(book.card.sourceUrl)main.append(external('공식 사이트',book.card.sourceUrl));
        main.append(action('전체 서재로',()=>navigate(),'button primary'));
    }
    function outline(book:BookPackage){
        const main=frame(book.title+' · 원문 학습 지도','원문에 무엇이 있는지와 앱에 어떤 자료가 있는지를 구분해 살펴보세요.');
        const store=new Store(storage(),book.id);
        const intro=el('div','coverage-summary');
        const notes=book.outline.filter(e=>e.coverage==='legacy-note').length;
        intro.append(el('strong','',`${book.outline.length}개 번호 있는 절 · ${notes}개 기존 노트 · ${book.outline.length-notes}개 읽기 안내`),el('p','muted',book.scope));
        main.append(intro);
        const tools=el('div','outline-tools');
        const label=el('label','','절 번호·주제 검색'),input=el('input','search-input');input.type='search';input.placeholder='예: 9.6, microfacet, 유리';label.append(input);
        const count=el('p','muted');count.setAttribute('aria-live','polite');
        tools.append(label,action('이 책의 수업 목차',()=>navigate(book.id)),action('전체 서재',()=>navigate()));main.append(tools,count);
        const warning=el('p','preview-notice',store.warning);warning.setAttribute('role','status');const list=el('div','source-outline');main.append(warning,list);
        function render(){
            const q=input.value.trim().toLocaleLowerCase();list.replaceChildren();
            const rows=book.outline.filter(e=>(e.number+' '+e.title+' '+e.chapterTitle).toLocaleLowerCase().includes(q));
            count.textContent=`${rows.length}개 절 표시 · 원문 읽음 ${book.outline.filter(e=>store.value.completed.includes('source:'+e.number)).length}/${book.outline.length}`;
            for(const chapter of [...new Set(rows.map(e=>e.chapter))]){
                const entries=rows.filter(e=>e.chapter===chapter),group=el('section','source-chapter');
                group.append(el('h2','',`${chapter} · ${entries[0].chapterTitle}`));
                for(const e of entries){
                    const row=el('article','source-row'),name=el('div','source-name');
                    name.append(el('strong','',`${e.number} ${e.title}`),el('p','source-status',(e.coverage==='legacy-note'?'기존 노트':'짧은 원문 읽기 안내')+' · '+({pending:'상세 원문 대조 미완료',reviewed:'명시된 범위 검수 완료','needs-correction':'수정 필요'}[e.review])));
                    const controls=el('div','source-controls');
                    controls.append(action(e.coverage==='legacy-note'?'노트 읽기':'읽기 안내',()=>navigate(book.id,'book',e.lessonId),'text-button'),external('공식 원문',e.url));
                    const read=el('label','source-read','원문 읽음 '),check=el('input');check.type='checkbox';check.checked=store.value.completed.includes('source:'+e.number);check.setAttribute('aria-label',e.number+' 원문 읽음');
                    check.onchange=()=>{store.toggle('completed','source:'+e.number);if(store.warning)warning.textContent=store.warning;count.textContent=`${rows.length}개 절 표시 · 원문 읽음 ${book.outline.filter(x=>store.value.completed.includes('source:'+x.number)).length}/${book.outline.length}`;};
                    read.append(check);controls.append(read);row.append(name,controls);group.append(row);
                }
                const more=el('div','chapter-resources');
                for(const resource of book.chapterResources?.[chapter] || []) more.append(external(resource.title,resource.url));
                if(more.childElementCount)group.append(more);list.append(group);
            }
            if(!rows.length)list.append(el('p','empty-state','일치하는 절이 없습니다. 검색어를 바꿔보세요.'));
        }
        input.oninput=render;render();
    }
    async function route(){
        const params=new URLSearchParams(location.search);
        const id=params.get('book') || (params.has('sec')?'pbrt-4ed':'');
        const next=params.get('view')==='outline'?'outline':'reader';
        if(readerCleanup && id===mounted && next===screen && id) return;
        const ticket=++token;readerCleanup?.();readerCleanup=undefined;mounted=id;screen=next;
        if(!id){shelf();window.scrollTo(0,0);return;}
        const registered=resolveBook(id);
        if(!registered){const main=frame('등록되지 않은 책입니다.','주소를 확인하거나 서재에서 책을 선택하세요.');main.append(action('전체 서재',()=>navigate()));return;}
        if(!registered.load){planned(registered);window.scrollTo(0,0);return;}
        frame('책을 여는 중입니다.','학습 자료를 불러옵니다.');
        try{
            if(!cache.has(id))cache.set(id,registered.load().catch(e=>{cache.delete(id);throw e;}));
            const book=await cache.get(id)!;
            if(disposed||ticket!==token)return;
            if(book.id!==id)throw new Error('등록된 책과 로드한 콘텐츠가 다릅니다.');
            if(next==='outline'){outline(book);window.scrollTo(0,0);return;}
            const [{Repository},{createReader}]=await Promise.all([import('../reader/repository.js'),import('../reader/app.js')]);
            if(disposed||ticket!==token)return;
            readerCleanup=createReader(host,new Repository(book),{shelf:()=>navigate(),outline:()=>navigate(book.id,'outline')});
        }catch(error){
            if(disposed||ticket!==token)return;
            const main=frame('책을 불러오지 못했습니다.',error instanceof Error?error.message:'자료를 확인해 주세요.');
            main.append(action('다시 시도',()=>{mounted='';void route();}),action('전체 서재',()=>navigate()));
        }
    }
    window.addEventListener('popstate',()=>void route(),{signal:abort.signal});void route();
    return ()=>{disposed=true;token++;abort.abort();readerCleanup?.();host.replaceChildren();};
}
