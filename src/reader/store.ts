import type { Progress, Settings, Position, Note } from './types.js';
export const STORAGE_KEY = 'gyeol.reader.v2';
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
export class Store {
    value: Progress = emptyProgress();
    warning = '';
    private blocked = false;
    constructor(private storage?: Storage) {
        let raw: string | null = null;
        try {
            raw = storage?.getItem(STORAGE_KEY) || null;
            if (raw) {
                this.value = validateProgress(JSON.parse(raw));
                return;
            }
            const theme = storage?.getItem('cs_theme');
            if (theme === 'dark' || theme === 'sepia')
                this.value.settings.theme = theme;
            else if (storage?.getItem('cs_dark_mode') === 'true')
                this.value.settings.theme = 'dark';
            const fs = Number(storage?.getItem('cs_font_size'));
            if (fs)
                this.value.settings.fontSize = bounded(fs, 16, 24, 18);
            const old = storage?.getItem('cs_current_sec');
            if (safeId(old))
                this.value.lastLesson = old;
        }
        catch {
            this.warning = '저장된 기록을 읽지 못해 기본 설정으로 열었습니다.';
            if (raw && storage) {
                try {
                    storage.setItem(STORAGE_KEY + '.recovery.' + Date.now(), raw);
                    this.warning += ' 기존 저장값을 복구용 별도 키에 보관했습니다.';
                }
                catch {
                    this.blocked = true;
                    this.warning += ' 기존 값 보존을 위해 자동 저장을 중지했습니다. 기록을 파일로 내보내세요.';
                }
            }
        }
    }
    save(): void { if (this.blocked)
        return; try {
        this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.value));
    }
    catch {
        this.warning = '브라우저 저장 공간에 기록하지 못했습니다. 설정에서 기록 파일을 내보내 보관하세요.';
    } }
    setSettings(s: Partial<Settings>): void { this.value.settings = validateProgress({ ...this.value, settings: { ...this.value.settings, ...s } }).settings; this.save(); }
    toggle(list: 'completed' | 'bookmarks', id: string): void { const a = this.value[list]; this.value[list] = a.includes(id) ? a.filter(x => x !== id) : [...a, id]; this.save(); }
    position(id: string, p: Position): void { if (safeId(id))
        this.value.positions[id] = p; this.save(); }
    note(note: Note): void { const id = `${note.lessonId}:${note.blockId}`; if (note.text.trim())
        this.value.notes[id] = { ...note, text: note.text.slice(0, 20000) };
    else
        delete this.value.notes[id]; this.save(); }
    restore(text: string): void { if (text.length > 2000000)
        throw new Error('기록 파일은 2MB 이하만 불러올 수 있습니다.'); this.value = validateProgress(JSON.parse(text)); this.blocked = false; this.save(); }
    export(): string { return JSON.stringify(this.value, null, 2); }
}
