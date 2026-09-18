import type { Block, Chapter, Lesson, LessonMeta } from './types.js';
import type { BookPackage } from '../platform/types.js';
export interface SearchHit { lesson: LessonMeta; blockId: string; excerpt: string; }
export class Repository {
    readonly originals: Map<string, Lesson>;
    readonly metas: LessonMeta[];
    readonly chapters: Chapter[];
    private loaded?: Promise<Record<string, import('../types/book.js').SectionContent>>;
    private cache = new Map<string, Lesson>();
    constructor(readonly book: BookPackage) {
        const originalIds = book.lessons.map(l => l.id);
        if (new Set(originalIds).size !== originalIds.length) throw new Error('Duplicate lesson IDs: ' + book.id);
        this.originals = new Map(book.lessons.map(l => [l.id, l]));
        const old = book.legacy?.toc.flatMap(ch => ch.sections.filter(s => s.isAvailable).map(s => ({
            id:s.id, chapter:ch.number, chapterTitle:ch.titleKo.replace(/^제\d+장\s*/, '').replace(/\s*\([^)]*\)$/, ''),
            title:s.titleKo.replace(/^\d+\.\d+\s*/, ''), deck:s.number+' · 보존한 학습 노트', kind:'legacy' as const, minutes:0
        }))) || [];
        const rank = (id:string) => /^\d+$/.test(id) ? Number(id) : 100 + id.charCodeAt(0);
        this.metas = [...book.lessons.filter(l=>l.chapter==='0'), ...old, ...book.lessons.filter(l=>l.chapter!=='0')]
            .map(({id,chapter,chapterTitle,title,deck,kind,minutes})=>({id,chapter,chapterTitle,title,deck,kind,minutes}))
            .sort((a,b)=>rank(a.chapter)-rank(b.chapter));
        if(new Set(this.metas.map(m=>m.id)).size!==this.metas.length) throw new Error('Content ID collision: '+book.id);
        this.chapters = [...new Set(this.metas.map(m=>m.chapter))].map(id=>({id,
            title:this.metas.find(m=>m.chapter===id)!.chapterTitle,
            subtitle:id==='0'?'공통 기초 · 필요한 만큼 먼저 읽기':'학습 노트·독자 해설·원문 읽기 안내',
            lessons:this.metas.filter(m=>m.chapter===id)}));
    }
    has(id:string):boolean { return this.metas.some(m=>m.id===id); }
    meta(id:string):LessonMeta|undefined { return this.metas.find(m=>m.id===id); }
    async get(id:string):Promise<Lesson|null> {
        if(this.originals.has(id)) return this.originals.get(id)!;
        if(this.cache.has(id)) return this.cache.get(id)!;
        if(!this.has(id)||!this.book.legacy) return null;
        const legacy=this.book.legacy;
        this.loaded ??= legacy.load().catch(e=>{this.loaded=undefined;throw e;});
        const raw=(await this.loaded)[id];
        if(!raw) return null;
        const lesson=legacy.adapt(id,raw); this.cache.set(id,lesson); return lesson;
    }
    async search(query:string):Promise<SearchHit[]> {
        const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
        if(!terms.length) return [];
        const hits:SearchHit[]=[];
        for(const meta of this.metas){
            const lesson=await this.get(meta.id); if(!lesson) continue;
            const title=lesson.title.toLocaleLowerCase();
            if(terms.every(t=>title.includes(t))) hits.push({lesson:meta,blockId:'lesson-title',excerpt:lesson.deck});
            for(const b of lesson.blocks.filter(b=>terms.every(t=>blockText(b).toLocaleLowerCase().includes(t)||title.includes(t))).slice(0,3)){
                const text=blockText(b), start=Math.max(0,text.toLocaleLowerCase().indexOf(terms[0])-32);
                hits.push({lesson:meta,blockId:b.id,excerpt:(start?'…':'')+text.slice(start,start+170)+(text.length>start+170?'…':'')});
            }
        }
        return hits.slice(0,60);
    }
}
export function blockText(b: Block): string {
    switch (b.type) {
        case 'paragraph': return b.text + ' ' + (b.english || '');
        case 'heading': return b.text;
        case 'aside': return b.title + ' ' + b.text;
        case 'equation': return b.tex + ' ' + (b.explanation || '') + ' ' + (b.terms || []).flat().join(' ');
        case 'code': return b.title + ' ' + b.code + ' ' + (b.explanation || '');
        case 'figure': return b.title + ' ' + b.caption;
        case 'quiz': return b.question + ' ' + b.options.join(' ');
        case 'lab': return b.title;
        case 'unknown': return b.label;
    }
}
