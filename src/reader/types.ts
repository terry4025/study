export type Theme = 'light' | 'dark' | 'sepia';
export type LabKind = 'derivative' | 'integral' | 'diffuse' | 'transmittance' | 'sampling' | 'lights' | 'roulette' | 'queues' | 'texture';
export type Block = {
    type: 'rich'; id: string; html: string; text: string; role?: 'body' | 'note'; heading?: string;
} | {
    type: 'paragraph';
    id: string;
    text: string;
    english?: string;
} | {
    type: 'heading';
    id: string;
    text: string;
    level?: 2 | 3 | 4;
} | {
    type: 'equation';
    id: string;
    tex: string;
    explanation?: string;
    terms?: [
        string,
        string
    ][];
} | {
    type: 'aside';
    id: string;
    title: string;
    text: string;
    tone?: 'note' | 'warning';
} | {
    type: 'code';
    id: string;
    code: string;
    language: string;
    title: string;
    explanation?: string;
    provenance: 'teaching' | 'legacy-unverified';
} | {
    type: 'figure';
    id: string;
    src: string;
    title: string;
    caption: string;
    verified: boolean;
} | {
    type: 'quiz';
    id: string;
    question: string;
    options: string[];
    answer: number;
    feedback: string;
} | {
    type: 'lab';
    id: string;
    kind: LabKind;
    title: string;
} | {
    type: 'unknown';
    id: string;
    label: string;
};
export interface Reference {
    title: string;
    url: string;
    role: 'background' | 'further-reading';
}
export interface Lesson {
    id: string;
    chapter: string;
    chapterTitle: string;
    title: string;
    deck: string;
    kind: 'original' | 'legacy' | 'correction' | 'guide' | 'translation';
    sourceSection?: string;
    review?: 'draft' | 'editorial-check' | 'source-reviewed';
    minutes: number;
    goals: string[];
    prerequisites: string[];
    blocks: Block[];
    references: Reference[];
    notice?: string;
}
export type LessonMeta = Pick<Lesson, 'id' | 'chapter' | 'chapterTitle' | 'title' | 'deck' | 'kind' | 'minutes'>;
export interface Chapter {
    id: string;
    title: string;
    subtitle: string;
    lessons: LessonMeta[];
}
export interface Settings {
    theme: Theme;
    fontSize: number;
    lineHeight: number;
    measure: 'normal' | 'wide';
    englishNotes: boolean;
    hints: boolean;
}
export interface Position {
    block: string;
    offset: number;
    y: number;
}
export interface Note {
    lessonId: string;
    blockId: string;
    text: string;
    updated: string;
}
export interface Progress {
    version: 2;
    settings: Settings;
    lastLesson: string | null;
    completed: string[];
    bookmarks: string[];
    positions: Record<string, Position>;
    notes: Record<string, Note>;
    answers: Record<string, number>;
}

/** A book is a content provider, not a hard-coded screen. Foundation courses are
 * shared resources and do not consume one of the six planned book slots. */
export interface SourceSection {
    id: string;
    chapter: string;
    number: string;
    title: string;
    titleKo: string;
    url: string;
    lessonId?: string;
    coverage: 'legacy-note' | 'companion-guide' | 'source-only' | 'translated-draft';
    review: 'unreviewed' | 'editorial-check' | 'source-reviewed';
}
export interface SourceChapter {
    id: string;
    title: string;
    titleKo: string;
    sections: SourceSection[];
    resources: Reference[];
}
export interface BookDefinition {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    authors: string[];
    edition: string;
    role: 'book' | 'foundation';
    status: 'available' | 'planned';
    sourceUrl?: string;
    rights: { status: 'original' | 'permission-required' | 'unverified'; label: string; url?: string };
    outline?: SourceChapter[];
    glossary?: { term: string; english: string; text: string; lesson?: string }[];
}
export type BookProgress = Omit<Progress, 'version' | 'settings'> & {
    sourceRead: string[];
    quizAttempts: Record<string, { selected: number; attempts: number; correct: boolean; updated: string }>;
};
export interface PlatformProgress {
    version: 3;
    settings: Settings;
    activeBookId: string;
    books: Record<string, BookProgress>;
    /** Retains fields in imported future/older data which are not understood. */
    preserved?: Record<string, unknown>;
}
