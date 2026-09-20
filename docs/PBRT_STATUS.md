# PBRT study content status

Updated: 2026-09-20

This repository keeps reviewed study notes and source-aligned translation drafts separate.

## Integrated app content

- Chapters 1–8: all 50 existing Korean study-note sections received a first-pass editorial audit and direct corrections. These remain abridged study notes, not full translations.
- Chapters 9–12: source-aligned Korean translation data and the native-reader integration already existed before this sync.
- Chapters 13–16: source-aligned Korean translation drafts, manifests, figure provenance, and generation/checking tools are included by the latest reviewed snapshot.
- The app/reader fixes from the reviewed snapshot are included as source changes.

Large generated native lesson/figure data is intentionally local-build output rather than a Git-tracked textbook copy. Use the provided local generation tools with the source ZIP supplied by the user.

## Additional drafts preserved in Git

The later source-aligned drafts for 7.3, 8.1, and 8.6 are stored under:
- `translations/pbrt/ch07/07-03.ko.json`
- `translations/pbrt/ch08/08-01.ko.json`
- `translations/pbrt/ch08/08-06.ko.json`

They are preserved as draft data and are **not** presented as completing all of chapters 1–8.

## Still not claimed complete

- A no-omission full translation of chapters 1–8.
- Full appendix A–C translation in the currently available files.
- Independent expert mathematical/technical review of every translated sentence.
- User-machine Windows browser validation of every page.

See `docs/PBRT_FINAL_REVIEW.md` and `docs/pbrt-audit/` for the detailed audit scope.
