import type { BookDefinition, LessonMeta } from './types.js';
import { Repository, type SearchHit } from './repository.js';

export interface BookEntry { definition: BookDefinition; repository: Repository; }
export interface BookSearchHit extends SearchHit { bookId: string; bookTitle: string; }
const validId = (s: string) => /^[a-z0-9][a-z0-9._-]{0,79}$/.test(s) && !['constructor','prototype','__proto__'].includes(s);

/** Registry: the UI depends on this contract, never on PBRT's content modules. */
export class Library {
    private entries = new Map<string, BookEntry>();
    register(definition: BookDefinition, repository = new Repository([], undefined, [])): this {
        if (!validId(definition.id)) throw new Error(`Invalid book ID: ${definition.id}`);
        if (this.entries.has(definition.id)) throw new Error(`Duplicate book ID: ${definition.id}`);
        if (definition.status === 'planned' && repository.metas.length) throw new Error('Planned books cannot expose lessons. Change the book status first.');
        for (const url of [definition.sourceUrl, definition.rights.url].filter(Boolean)) {
            if (!/^https?:\/\//.test(url!)) throw new Error('Book source links must use HTTP(S).');
        }
        this.entries.set(definition.id,{ definition,repository });
        return this;
    }
    /** Replace a planned slot without changing the reader. Published book IDs
     * cannot be renamed here because that needs an explicit progress migration. */
    replace(slotId: string, definition: BookDefinition, repository: Repository): this {
        const old=this.get(slotId);
        if(!old) throw new Error(`Unknown slot: ${slotId}`);
        if(old.definition.status==='available'&&definition.id!==slotId) throw new Error('Published book IDs are stable. Migrate records before renaming.');
        if(definition.id!==slotId&&this.entries.has(definition.id)) throw new Error('Replacement ID already registered');
        new Library().register(definition,repository); // validate before mutation
        this.entries=new Map([...this.entries].map(([id,value])=>id===slotId?[definition.id,{definition,repository}]:[id,value]));
        return this;
    }
    get books(): BookEntry[] { return [...this.entries.values()]; }
    get(id: string): BookEntry | undefined { return this.entries.get(id); }
    resolveLesson(bookId: string, lessonId: string): { bookId: string; meta: LessonMeta } | undefined {
        // Explicit cross-book references use bookId::lessonId. Bare IDs stay local
        // except for shared foundations. Never search an arbitrary other book.
        const separator = lessonId.indexOf('::');
        if (separator !== -1) {
            const target = lessonId.slice(0,separator), id = lessonId.slice(separator+2);
            const meta = this.get(target)?.repository.meta(id);
            return meta ? { bookId:target, meta } : undefined;
        }
        const meta = this.get(bookId)?.repository.meta(lessonId);
        if (meta) return { bookId,meta };
        for (const entry of this.books.filter(x => x.definition.role === 'foundation')) {
            const shared = entry.repository.meta(lessonId);
            if (shared) return { bookId:entry.definition.id,meta:shared };
        }
        return undefined;
    }
    coverage(bookId: string) {
        const entry = this.get(bookId);
        const sections = entry?.definition.outline?.flatMap(ch => ch.sections) || [];
        const count = (predicate: (s: typeof sections[number]) => boolean) => sections.filter(predicate).length;
        return {
            sections: sections.length,
            legacyNotes: count(s => s.coverage === 'legacy-note' && !!s.lessonId && !!entry?.repository.has(s.lessonId)),
            guides: count(s => s.coverage === 'companion-guide' && !!s.lessonId && !!entry?.repository.has(s.lessonId)),
            sourceOnly: count(s => !s.lessonId || !entry?.repository.has(s.lessonId)),
            sourceReviewed: count(s => s.review === 'source-reviewed'),
            // No implicit inference from lesson existence or learner progress.
            fullTranslation: false,
        };
    }
    async search(query: string, bookId?: string): Promise<{ hits:BookSearchHit[]; warnings:string[] }> {
        const entries = (bookId ? [this.get(bookId)].filter((x):x is BookEntry => !!x) : this.books)
            .filter(x => x.definition.status === 'available');
        const groups = await Promise.all(entries.map(async entry => {
            try {
                const hits = await entry.repository.search(query);
                return { hits:hits.map(h => ({...h,bookId:entry.definition.id,bookTitle:entry.definition.title})),
                    warnings:entry.repository.warnings.map(w => `${entry.definition.title}: ${w}`) };
            } catch { return { hits:[], warnings:[`${entry.definition.title}: 검색할 수 없는 자료가 있습니다.`] }; }
        }));
        return { hits:groups.flatMap(x=>x.hits).slice(0,100), warnings:[...new Set(groups.flatMap(x=>x.warnings))] };
    }
}
