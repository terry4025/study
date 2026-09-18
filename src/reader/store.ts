import type { Progress, Settings, Position, Note, BookProgress, PlatformProgress } from './types.js';
export const STORAGE_KEY = 'gyeol.library.v3';
export const LEGACY_STORAGE_KEY = 'gyeol.reader.v2';
const defaults: Settings = { theme: 'light', fontSize: 18, lineHeight: 1.9, measure: 'normal', englishNotes: false, hints: true };
export const emptyProgress = (): Progress => ({ version: 2, settings: { ...defaults }, lastLesson: null, completed: [], bookmarks: [], positions: {}, notes: {}, answers: {} });
const plain = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const safeId = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_.:-]{1,180}$/.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
const ids = (v: unknown): string[] => Array.isArray(v) ? [...new Set(v.filter(safeId))].slice(0, 20000) : [];
const bounded = (v: unknown, min: number, max: number, fallback: number) => typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback;
export function validateProgress(value: unknown): Progress {
    if (!plain(value) || value.version !== 2)
        throw new Error('지원하지 않는 학습 기록 형식입니다.');
    const p = emptyProgress();
    const s = plain(value.settings) ? value.settings : {};
    p.settings = { theme: s.theme === 'dark' || s.theme === 'sepia' ? s.theme : 'light', fontSize: bounded(s.fontSize, 16, 24, 18), lineHeight: bounded(s.lineHeight, 1.6, 2.2, 1.9), measure: s.measure === 'wide' ? 'wide' : 'normal', englishNotes: s.englishNotes === true, hints: s.hints !== false };
    p.lastLesson = safeId(value.lastLesson) ? value.lastLesson : null;
    p.completed = ids(value.completed);
    p.bookmarks = ids(value.bookmarks);
    if (plain(value.positions))
        for (const [id, v] of Object.entries(value.positions).slice(0, 20000))
            if (safeId(id) && plain(v) && safeId(v.block))
                p.positions[id] = { block: v.block, offset: bounded(v.offset, -5000, 5000, 0), y: bounded(v.y, 0, 1e7, 0) };
    if (plain(value.notes))
        for (const [id, v] of Object.entries(value.notes).slice(0, 3000))
            if (safeId(id) && plain(v) && safeId(v.lessonId) && safeId(v.blockId) && typeof v.text === 'string' && v.text.length <= 20000)
                p.notes[id] = { lessonId: v.lessonId, blockId: v.blockId, text: v.text, updated: typeof v.updated === 'string' ? v.updated.slice(0, 40) : '' };
    if (plain(value.answers))
        for (const [id, v] of Object.entries(value.answers).slice(0, 20000))
            if (safeId(id) && Number.isInteger(v) && typeof v === 'number' && v >= 0 && v < 20)
                p.answers[id] = v;
    return p;
}
export const emptyBookProgress = (): BookProgress => ({ lastLesson: null, completed: [], bookmarks: [], positions: {}, notes: {}, answers: {}, sourceRead: [], quizAttempts: {} });
export const emptyPlatformProgress = (): PlatformProgress => ({ version: 3, settings: { ...defaults }, activeBookId: 'pbrt-4ed', books: {} });
function validateBook(value: unknown): BookProgress {
    if (!plain(value)) throw new Error('잘못된 책별 기록입니다.');
    const old = validateProgress({ ...value, version: 2, settings: defaults });
    const { version: _v, settings: _s, ...fields } = old;
    const b: BookProgress = { ...fields, sourceRead: ids(value.sourceRead), quizAttempts: {} };
    if (plain(value.quizAttempts)) for (const [id,v] of Object.entries(value.quizAttempts).slice(0,20000)) {
        if (safeId(id) && plain(v) && typeof v.selected === 'number' && Number.isInteger(v.selected) && v.selected >= 0 && v.selected < 20)
            b.quizAttempts[id] = { selected: v.selected, attempts: Math.floor(bounded(v.attempts, 1, 100000, 1)), correct: v.correct === true, updated: typeof v.updated === 'string' ? v.updated.slice(0,40) : '' };
    }
    return b;
}
export function migrateV2(value: unknown): PlatformProgress {
    const old = validateProgress(value), p = emptyPlatformProgress();
    p.settings = old.settings;
    const book = (id: string) => p.books[id] ||= emptyBookProgress();
    const owner = (id: string) => id.startsWith('math-') ? 'foundations' : 'pbrt-4ed';
    for (const id of old.completed) book(owner(id)).completed.push(id);
    for (const id of old.bookmarks) book(owner(id)).bookmarks.push(id);
    for (const [id,v] of Object.entries(old.positions)) book(owner(id)).positions[id] = v;
    for (const [id,v] of Object.entries(old.notes)) book(owner(v.lessonId)).notes[id] = v;
    for (const [id,v] of Object.entries(old.answers)) book(owner(id)).answers[id] = v;
    if (old.lastLesson) { p.activeBookId = owner(old.lastLesson); book(p.activeBookId).lastLesson = old.lastLesson; }
    // Keep the original payload in the export as an additional migration recovery path.
    p.preserved = { migratedV2: value };
    return p;
}
export function validatePlatform(value: unknown): PlatformProgress {
    if (!plain(value)) throw new Error('지원하지 않는 기록 파일입니다.');
    if (value.version === 2) return migrateV2(value);
    if (value.version !== 3) throw new Error('지원하지 않는 학습 기록 버전입니다. 원본 파일을 보관하세요.');
    if (!plain(value.books) || !safeId(value.activeBookId)) throw new Error('책별 기록 또는 현재 책 ID가 올바르지 않습니다.');
    const p = emptyPlatformProgress();
    p.settings = validateProgress({ version: 2, settings: value.settings }).settings;
    p.activeBookId = value.activeBookId;
    if (Object.keys(value.books).length > 200) throw new Error('책 기록은 최대 200개까지 지원합니다.');
    for (const [id,b] of Object.entries(value.books)) if (safeId(id)) p.books[id] = validateBook(b);
    if (plain(value.preserved)) p.preserved = value.preserved;
    const topKnown=new Set(['version','settings','activeBookId','books','preserved']);
    const extra=Object.fromEntries(Object.entries(value).filter(([key])=>!topKnown.has(key)));
    const bookKnown=new Set(['lastLesson','completed','bookmarks','positions','notes','answers','sourceRead','quizAttempts']);
    const extraBooks=Object.fromEntries(Object.entries(value.books).map(([id,b])=>[id,plain(b)?Object.fromEntries(Object.entries(b).filter(([key])=>!bookKnown.has(key))):b]).filter(([,b])=>plain(b)&&Object.keys(b).length));
    if(Object.keys(extra).length||Object.keys(extraBooks).length)p.preserved={...p.preserved,unrecognizedTopLevel:extra,unrecognizedBookFields:extraBooks};
    return p;
}
export class Store {
    value: PlatformProgress = emptyPlatformProgress();
    warning = '';
    private blocked = false;
    constructor(private storage?: Storage) {
        if (!storage) this.warning = '이 환경에서는 브라우저 저장을 사용할 수 없습니다. 탭을 닫기 전에 기록을 내보내세요.';
        let raw: string | null = null;
        try {
            raw = storage?.getItem(STORAGE_KEY) || null;
            if (raw) { this.value = validatePlatform(JSON.parse(raw)); return; }
            const old = storage?.getItem(LEGACY_STORAGE_KEY);
            if (old) { this.value = migrateV2(JSON.parse(old)); return; }
            const theme = storage?.getItem('cs_theme');
            if (theme === 'dark' || theme === 'sepia') this.value.settings.theme = theme;
            else if (storage?.getItem('cs_dark_mode') === 'true') this.value.settings.theme = 'dark';
            const fs = Number(storage?.getItem('cs_font_size'));
            if (fs) this.value.settings.fontSize = bounded(fs,16,24,18);
            const oldSection = storage?.getItem('cs_current_sec');
            if (safeId(oldSection)) this.book.lastLesson = oldSection;
        } catch {
            this.warning = '저장값을 해석하지 못했습니다. 원래 기록은 삭제하지 않았습니다.';
            if (raw && storage) {
                try { storage.setItem(STORAGE_KEY+'.recovery.'+Date.now(),raw); }
                catch { this.blocked = true; this.warning += ' 복구 사본 저장도 실패하여 자동 저장을 중지했습니다.'; }
            }
        }
    }
    get book(): BookProgress { return this.forBook(this.value.activeBookId); }
    get settings(): Settings { return this.value.settings; }
    forBook(id: string): BookProgress {
        if (!safeId(id)) throw new Error('잘못된 책 ID');
        return this.value.books[id] ||= emptyBookProgress();
    }
    selectBook(id: string): void { this.forBook(id); this.value.activeBookId = id; this.save(); }
    save(): void {
        if (this.blocked) return;
        try { this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.value)); }
        catch { this.warning = '브라우저 저장 공간에 기록하지 못했습니다. 전체 기록을 파일로 내보내세요.'; }
    }
    setSettings(s: Partial<Settings>): void {
        this.value.settings = validateProgress({ version: 2, settings: { ...this.settings,...s } }).settings;
        this.save();
    }
    toggle(list: 'completed' | 'bookmarks' | 'sourceRead', id: string): void {
        if (!safeId(id)) return;
        const a=this.book[list]; this.book[list]=a.includes(id)?a.filter(x=>x!==id):[...a,id]; this.save();
    }
    position(id: string, p: Position): void { if (safeId(id)) this.book.positions[id]=p; this.save(); }
    note(note: Note, bookId = this.value.activeBookId): void {
        if (!safeId(note.lessonId) || !safeId(note.blockId)) return;
        const b=this.forBook(bookId), id=`${note.lessonId}:${note.blockId}`;
        if (note.text.trim()) b.notes[id]={...note,text:note.text.slice(0,20000)}; else delete b.notes[id];
        this.save();
    }
    answer(id: string, selected: number, correct: boolean): void {
        if (!safeId(id) || !Number.isInteger(selected) || selected<0 || selected>=20) return;
        const old=this.book.quizAttempts[id];
        this.book.answers[id]=selected;
        this.book.quizAttempts[id]={ selected, attempts:(old?.attempts||0)+1, correct, updated:new Date().toISOString() };
        this.save();
    }
    restore(text: string): void {
        if (new TextEncoder().encode(text).length>5000000) throw new Error('기록 파일은 5MB 이하만 불러올 수 있습니다.');
        const incoming=validatePlatform(JSON.parse(text));
        // Failure to make a recovery copy aborts a destructive replace.
        if (this.storage) this.storage.setItem(STORAGE_KEY+'.before-import.'+Date.now(),JSON.stringify(this.value));
        this.value=incoming; this.blocked=false; this.save();
    }
    export(): string { return JSON.stringify(this.value,null,2); }
}
