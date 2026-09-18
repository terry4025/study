export type Theme = 'light' | 'dark' | 'sepia';
export type LabKind = 'derivative' | 'integral' | 'diffuse' | 'transmittance' | 'sampling' | 'lights' | 'roulette' | 'queues' | 'texture';
export type Block = {
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
    kind: 'original' | 'legacy' | 'correction';
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
