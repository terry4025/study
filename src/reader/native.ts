import type { Block, Lesson, LessonMeta } from './types.js';
import type { Library } from './library.js';
import { element } from './text.js';

/** Imported textbook content is data. No scripts, network fonts, forms or
 * arbitrary HTML callbacks from the supplied archive are ever executed. */
export type RichBlock = Extract<Block, { type: 'rich' }>;
const htmlTags = new Set('p div span h1 h2 h3 h4 h5 h6 a code tt pre b strong i em u s sub sup br hr ul ol li dl dt dd figure figcaption aside blockquote table thead tbody tr th td details summary img'.split(' '));
const svgTags = new Set('svg g path use defs title desc rect line polygon polyline circle ellipse text tspan clippath'.split(' '));
const dropTags = new Set('script style iframe object embed form input button textarea select option link meta base foreignobject animate animatetransform set audio video source'.split(' '));
const commonAttrs = new Set('id class title lang role aria-label aria-labelledby aria-hidden aria-expanded aria-controls data-tu data-source-hash data-translation-state'.split(' '));
const svgAttrs = new Set('xmlns xmlns:xlink viewbox width height x y x1 y1 x2 y2 cx cy r rx ry d points transform fill stroke stroke-width stroke-linecap stroke-linejoin fill-rule clip-rule preserveaspectratio'.split(' '));
const validId = (s: unknown): s is string => typeof s === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,180}$/.test(s) && !['__proto__','constructor','prototype'].includes(s);
const isRecord = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const hasString = (x: unknown, limit = 20000): x is string => typeof x === 'string' && x.length <= limit;

export function sanitizeTranslation(markup: string): DocumentFragment {
    const t = document.createElement('template');
    t.innerHTML = markup;
    const assetBase = new URL('books/pbrt-4ed/native/assets/', document.baseURI);
    for (const e of [...t.content.querySelectorAll('*')]) {
        if (!t.content.contains(e)) continue;
        const tag = e.localName.toLowerCase();
        if (dropTags.has(tag)) { e.remove(); continue; }
        if (!htmlTags.has(tag) && !svgTags.has(tag)) { e.replaceWith(...e.childNodes); continue; }
        const svg = e.namespaceURI === 'http://www.w3.org/2000/svg';
        for (const a of [...e.attributes]) {
            const name = a.name.toLowerCase(), value = a.value;
            let keep = commonAttrs.has(name) || svg && svgAttrs.has(name);
            if (name === 'style') keep = svg && /^vertical-align:\s*-?[\d.]+(?:ex|em|px);?$/.test(value);
            if (name === 'href' || name === 'xlink:href') {
                keep = false;
                if (tag === 'use') keep = /^#[^\s<>]+$/.test(value);
                else if (tag === 'a') {
                    if (/^#[^\s<>]*$/.test(value)) keep = true;
                    else try {
                        const url = new URL(value, document.baseURI);
                        keep = ['https:','http:'].includes(url.protocol) && !url.username && !url.password;
                        if (keep && url.origin !== location.origin) { e.setAttribute('target','_blank'); e.setAttribute('rel','noopener noreferrer'); }
                    } catch { /* invalid URL */ }
                }
            }
            if (name === 'src' && tag === 'img') {
                keep = false;
                try {
                    const url = new URL(value, document.baseURI);
                    keep = url.origin === assetBase.origin && url.pathname.startsWith(assetBase.pathname) && /\.(?:png|jpe?g|svg|webp)$/i.test(url.pathname) && !url.search;
                    if (keep) e.setAttribute('src', url.href);
                } catch { /* invalid image URL */ }
            }
            if (tag === 'img' && ['alt','loading','width','height'].includes(name)) keep = true;
            if (['colspan','rowspan'].includes(name)) keep = /^\d{1,3}$/.test(value);
            if (['fill','stroke'].includes(name)) keep = /^(?:none|currentColor|transparent|#[\da-f]{3,8}|[a-z]+)$/i.test(value);
            if (!keep) e.removeAttribute(a.name);
        }
        if (tag === 'a') {
            const href=e.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('?')) {
                const url=new URL(href,document.baseURI);
                if(url.origin!==location.origin){e.setAttribute('target','_blank');e.setAttribute('rel','noopener noreferrer');}
            }
        }
        if (tag === 'img') { e.setAttribute('loading','lazy'); e.setAttribute('decoding','async'); }
    }
    return t.content;
}

export function renderTranslationBlock(b: RichBlock, navigate: (id: string, anchor?: string) => void): HTMLElement {
    const n=element('div','native-rich');
    n.append(sanitizeTranslation(b.html));
    if (b.role === 'note' && n.querySelector('.beginner')) n.classList.add('optional-hint');
    for (const image of n.querySelectorAll('img')) image.addEventListener('error',()=>{
        image.hidden=true;
        const p=element('p','native-asset-error','그림 파일을 찾지 못했습니다. 원문 가져오기를 다시 실행해 주세요.');
        image.after(p);
    },{once:true});
    n.addEventListener('click',event=>{
        const target = event.target instanceof Element ? event.target.closest('a') : null;
        if (!target) return;
        const href=target.getAttribute('href') || '';
        if (target.classList.contains('codecarat') && href.startsWith('#')) {
            const node=document.getElementById(decodeURIComponent(href.slice(1)));
            if(node?.closest('.native-rich')) {
                event.preventDefault(); const expanded=node.classList.toggle('show');
                target.setAttribute('aria-expanded',String(expanded));
            }
            return;
        }
        if (href.startsWith('?')) {
            const url=new URL(href,document.baseURI), id=url.searchParams.get('sec');
            if(url.searchParams.get('book')==='pbrt-4ed' && id?.startsWith('translation-')) {event.preventDefault();navigate(id,decodeURIComponent(url.hash.slice(1))||undefined);}
        } else if(href.startsWith('#')) {
            const node=document.getElementById(decodeURIComponent(href.slice(1)));
            if(node?.closest('.native-rich')) {
                event.preventDefault();
                for(let p:Element|null=node;p;p=p.parentElement)if(p.classList.contains('collapse'))p.classList.add('show');
                node.scrollIntoView({block:'start'});
            }
        }
    });
    return n;
}

interface ImportedMeta extends LessonMeta {
    file:string;sha256:string;sourceSection?:string;
    search:{id:string;text:string}[];
}
export interface ImportResult { loaded:number; warning?:string; }
function parseRecord(value: unknown): ImportedMeta {
    if(!isRecord(value)||!validId(value.id)||!String(value.id).startsWith('translation-')||value.kind!=='translation'||!hasString(value.chapter,4)||!hasString(value.chapterTitle,200)||!hasString(value.title,500)||!hasString(value.deck,2000)||!Number.isFinite(value.minutes)||Number(value.minutes)<0||!hasString(value.file,200)||value.file!==`lessons/${value.id}.json`||!hasString(value.sha256,64)||!/^[\da-f]{64}$/.test(value.sha256)||!Array.isArray(value.search)||value.search.length>10000)throw new Error('번역 목록 형식이 올바르지 않습니다.');
    const ids=new Set<string>();
    for(const item of value.search) {
        if(!isRecord(item)||!validId(item.id)||!hasString(item.text,300000)||ids.has(item.id))throw new Error('번역 검색 색인 형식이 올바르지 않습니다.');
        ids.add(item.id);
    }
    if(value.sourceSection!=null&&(!hasString(value.sourceSection,20)||!^(?:\\d+|[A-C])\\.\\d+$/.test(value.sourceSection)))throw new Error('원문 절 번호가 올바르지 않습니다.');
    return value as unknown as ImportedMeta;
}
export function validateNativeLesson(value: unknown, meta: ImportedMeta): Lesson {
    if(!isRecord(value)||value.id!==meta.id||value.chapter!==meta.chapter||value.kind!=='translation'||!hasString(value.title,500)||!hasString(value.deck,2000)||!Array.isArray(value.blocks)||value.blocks.length>10000||!Array.isArray(value.goals)||!value.goals.every(x=>hasString(x,3000))||!Array.isArray(value.prerequisites)||!value.prerequisites.every(validId)||!Array.isArray(value.references))throw new Error('번역 본문 형식이 올바르지 않습니다.');
    const ids=new Set<string>();
    for(const block of value.blocks) {
        if(!isRecord(block)||block.type!=='rich'||!validId(block.id)||ids.has(block.id)||!hasString(block.html,12_000_000)||!hasString(block.text,300000))throw new Error('번역 블록이 손상되었거나 중복되었습니다.');
        if(block.heading!=null&&!hasString(block.heading,1000))throw new Error('소제목 형식 오류');
        ids.add(block.id);
    }
    if(ids.size!==meta.search.length||meta.search.some(x=>!ids.has(x.id)))throw new Error('본문과 검색 색인의 버전이 다릅니다.');
    for(const ref of value.references)if(!isRecord(ref)||!hasString(ref.title,2000)||!hasString(ref.url,3000)||!/^https?:\/\//.test(ref.url))throw new Error('원문 링크 오류');
    return value as unknown as Lesson;
}

/** Register lightweight metadata/search first. Math-heavy lesson HTML is fetched
 * only when opened. A failed file fetch is retryable and never hides other books. */
export async function attachNativeTranslations(library: Library, signal?: AbortSignal, fetcher: typeof fetch = fetch): Promise<ImportResult> {
    const entry=library.get('pbrt-4ed'); if(!entry)return {loaded:0};
    const base=new URL('books/pbrt-4ed/native/', document.baseURI);
    const response=await fetcher(new URL('catalog.json',base),{signal,cache:'no-cache'});
    if(response.status===404)return {loaded:0,warning:'번역 본문 파일이 아직 연결되지 않았습니다. 통합 패키지의 public 폴더가 함께 있는지 확인해 주세요.'};
    if(!response.ok)throw new Error(`번역 목록을 읽지 못했습니다 (HTTP ${response.status}).`);
    const text=await response.text();if(text.length>6_000_000)throw new Error('번역 목록이 너무 큽니다.');
    const data:unknown=JSON.parse(text);
    if(!isRecord(data)||data.schema!==1||data.bookId!=='pbrt-4ed'||!Array.isArray(data.lessons)||data.lessons.length>300)throw new Error('지원하지 않는 번역 목록입니다.');
    const metas=data.lessons.map(parseRecord),unique=new Set(metas.map(x=>x.id));
    if(unique.size!==metas.length||metas.some(m=>entry.repository.has(m.id)))throw new Error('번역 수업 ID가 중복됩니다.');
    if(signal?.aborted)throw new DOMException('Aborted','AbortError');
    // Validate the complete manifest before any registry mutation.
    for(const meta of metas)entry.repository.registerLazy(meta,async()=>{
        const r=await fetcher(new URL(meta.file,base),{signal,cache:'no-cache'});
        if(!r.ok)throw new Error(`번역 본문을 읽지 못했습니다 (HTTP ${r.status}).`);
        const content=await r.arrayBuffer();if(content.byteLength>32_000_000)throw new Error('본문 파일이 너무 큽니다.');
        if(globalThis.crypto?.subtle){
            const digest=await crypto.subtle.digest('SHA-256',content);
            const sha=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
            if(sha!==meta.sha256)throw new Error('번역 파일의 체크섬이 목록과 다릅니다. 가져오기 결과를 확인해 주세요.');
        }
        return validateNativeLesson(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(content)),meta);
    },meta.search);
    const bySection=new Map(metas.filter(m=>m.sourceSection).map(m=>[m.sourceSection!,m.id]));
    entry.definition.outline=entry.definition.outline?.map(ch=>({...ch,sections:ch.sections.map(s=>bySection.has(s.number)?{...s,lessonId:bySection.get(s.number),coverage:'translated-draft' as const,review:'unreviewed' as const}:s)}));
    return {loaded:metas.length};
}
