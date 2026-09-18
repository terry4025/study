import type { Lesson } from '../reader/types.js';
import type { ChapterMeta, SectionContent } from '../types/book.js';
export interface SourceEntry {
    number: string;
    chapter: string;
    chapterTitle: string;
    title: string;
    url: string;
    lessonId: string;
    coverage: 'legacy-note' | 'reading-guide';
    review: 'pending' | 'reviewed' | 'needs-correction';
}
export interface BookCard {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    coverLines: string[];
    sourceUrl: string;
    status: 'available' | 'planned';
}
export interface BookPackage extends BookCard {
    scope: string;
    lessons: Lesson[];
    glossary: { term: string; english: string; text: string; lesson: string }[];
    outline: SourceEntry[];
    chapterResources?: Record<string, { title: string; url: string }[]>;
    legacy?: {
        toc: ChapterMeta[];
        load: () => Promise<Record<string, SectionContent>>;
        adapt: (id: string, source: SectionContent) => Lesson;
    };
}
export interface RegisteredBook { card: BookCard; load?: () => Promise<BookPackage>; }
