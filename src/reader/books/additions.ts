import type { BookEntry } from '../library.js';
/** Add the next five books here. Each module supplies its own lessons, glossary,
 * source/rights metadata and optional source outline. UI components stay unchanged.
 * slotId: ostep / csapp / ddia / planned-05 / planned-06.
 * See docs/MULTIBOOK_GUIDE.md for a self-authored minimal example. */
export const bookAdditions: (BookEntry & { slotId: string })[] = [];
