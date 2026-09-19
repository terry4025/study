#!/usr/bin/env python3
"""Build source-aligned chapter 12, or the cumulative native chapters 9–12.

Never downloads book content. Requires the user's original source ZIP. With
--ch09-ch10, the existing chapter 11 builder also imports the earlier bundle.
All generated data goes into a staging directory; existing output is backed up
only after a complete successful build when --replace is explicitly requested.
"""
from __future__ import annotations
import argparse
import collections
import hashlib
import html
import json
import re
import shutil
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urldefrag

import fitz
from bs4 import BeautifulSoup, NavigableString
from PIL import Image
import prepare_native as core
from source_units import source_units

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'translations/pbrt/ch12'
BASE_URL = 'https://pbr-book.org/4ed/'


def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def file_digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def canonical(value) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf8')


def encode(value) -> bytes:
    return json.dumps(value, ensure_ascii=False, separators=(',', ':')).encode('utf8')


def checked_member(archive, name: str, checksum: str) -> bytes:
    raw = core.member(archive, name)
    if digest(raw) != checksum:
        raise ValueError('Source snapshot differs: ' + name)
    return raw


def build_articles(source: Path, stage: Path, data: Path = DATA):
    manifest = json.loads((data / 'source-manifest.json').read_text(encoding='utf8'))
    provenance = json.loads((data / 'figure-provenance.json').read_text(encoding='utf8'))
    figures = stage / 'figures12'
    figures.mkdir()
    articles = {}
    routes = {urljoin(BASE_URL, m['path']).removesuffix('.html'): key for key, m in manifest.items()}
    with core.safe_zip(source) as archive:
        for figure in provenance:
            if not re.fullmatch(r'figure-12-\d+\.png', figure['image']):
                raise ValueError('Unsafe figure file name')
            parts = []
            for item in figure['parts']:
                meta = next(m for m in manifest.values() if Path(m['archive_pdf']).name == item['pdf'])
                raw = checked_member(archive, meta['archive_pdf'], meta['pdf_sha256'])
                with fitz.open(stream=raw, filetype='pdf') as pdf:
                    page = pdf[item['page'] - 1]
                    rect = fitz.Rect(item['rect'])
                    if rect.is_empty or not page.rect.contains(rect):
                        raise ValueError('Invalid figure rectangle: ' + figure['image'])
                    pix = page.get_pixmap(matrix=fitz.Matrix(2.4, 2.4), clip=rect, alpha=False)
                    parts.append(Image.frombytes('RGB', (pix.width, pix.height), pix.samples))
            if not parts:
                raise ValueError('Empty figure: ' + figure['image'])
            result = Image.new('RGB', (max(p.width for p in parts), sum(p.height for p in parts) + 16*(len(parts)-1)), 'white')
            y = 0
            for image in parts:
                result.paste(image, ((result.width - image.width)//2, y))
                y += image.height + 16
            result.save(figures / figure['image'])
        for key, meta in manifest.items():
            original = checked_member(archive, meta['archive_html'], meta['source_sha256']).decode('utf8')
            src = source_units(original)
            ko = json.loads((data / (key + '.ko.json')).read_text(encoding='utf8'))
            if digest(canonical(ko)) != meta['canonical_translation_sha256']:
                raise ValueError('Translation snapshot differs: ' + key)
            units = src['units']
            ids = {u['id'] for u in units}
            keep = set(ko.get('preserved_reference_ids', []))
            if (len(ids) != meta['units'] or ids != set(ko['translations']) | keep
                    or keep & set(ko['translations']) or len(ko['translations']) != meta['translated']):
                raise ValueError('Source coverage mismatch: ' + key)
            body = BeautifulSoup('<article>' + ''.join(src['tagged_roots']) + '</article>', 'lxml')
            before_code = [c.get_text() for c in body.select('.fragmentcode')]
            notes = collections.defaultdict(list)
            for note in ko.get('notes', []):
                if note['after'] not in ids:
                    raise ValueError('Unknown note target: ' + key)
                notes[note['after']].append(note)
            footnotes = ko.get('footnotes', [])
            foot_index = 0
            # Keep the PDF image outside its caption's bilingual spans. For a
            # figure embedded in a paragraph, lift its static image out first.
            lifted = collections.defaultdict(list)
            for caption in list(body.find_all('figcaption')):
                match = re.search(r'Figure\s+12\.(\d+)', caption.get_text(' ', strip=True))
                if not match:
                    continue
                number = int(match[1])
                wrapper = caption.find_parent(class_='figure')
                if wrapper is None:
                    raise ValueError('Missing figure wrapper: ' + key)
                figure = body.new_tag('figure', attrs={'class': 'book-figure', 'id': f'figure-12-{number}'})
                figure.append(body.new_tag('img', src=f'assets/figure-12-{number}.png',
                                          alt=f'그림 12.{number}: 첨부 PDF에 보이는 정적 상태', loading='lazy'))
                parent_unit = wrapper.find_parent(attrs={'data-tu': True})
                if parent_unit:
                    label = body.new_tag('figcaption')
                    label.string = f'그림 12.{number} · 설명은 앞의 번역 문단에 포함되어 있습니다.'
                    figure.append(label)
                    lifted[parent_unit['data-tu']].append(figure)
                    wrapper.decompose()
                else:
                    figure.append(caption.extract())
                    wrapper.replace_with(figure)
                credit = body.new_tag('p', attrs={'class': 'figure-credit'})
                credit.string = '첨부 PDF에서 복원한 정적 그림입니다. 비교 그림의 탭·슬라이더와 다른 상태를 모두 재현한 것은 아닙니다.'
                figure.append(credit)
            for unit in units:
                el = body.select_one('[data-tu="' + unit['id'] + '"]')
                if el is None:
                    raise ValueError('Missing source DOM unit: ' + key + '/' + unit['id'])
                foot_count = len(BeautifulSoup(unit['original_html'], 'lxml').select('.footnote-button'))
                el['data-source-hash'] = unit['source_hash']
                el['data-translation-state'] = 'reference-preserved' if unit['id'] in keep else 'translated'
                if unit['id'] not in keep:
                    translated = ko['translations'][unit['id']]
                    pattern = r'\{\{(\d+)\}\}'
                    if collections.Counter(re.findall(pattern, translated)) != collections.Counter(re.findall(pattern, unit['text'])):
                        raise ValueError('Math/code/reference token mismatch: ' + key + '/' + unit['id'])
                    rendered = re.sub(pattern, lambda m: unit['tokens'][int(m[1])]['html'], html.escape(translated))
                    original_markup = ''.join(str(c) for c in el.contents)
                    el.clear()
                    for cls, lang, markup in [('lang-ko', 'ko', rendered), ('lang-en', 'en', original_markup)]:
                        span = body.new_tag('span', attrs={'class': cls, 'lang': lang})
                        core.add_markup(span, markup)
                        el.append(span)
                tail = el
                for figure in lifted[unit['id']]:
                    tail.insert_after(figure)
                    tail = figure
                for _ in range(foot_count):
                    if foot_index >= len(footnotes):
                        raise ValueError('Missing original footnote: ' + key)
                    note = body.new_tag('aside', attrs={'class': 'translation-footnote'})
                    title = body.new_tag('strong')
                    title.string = '원문 주석'
                    note.append(title)
                    note.append(NavigableString(footnotes[foot_index]))
                    foot_index += 1
                    tail.insert_after(note)
                    tail = note
                for item in notes[unit['id']]:
                    correction = any(word in item['title'] for word in ['정정', '조건', '주의', '구분', '경험칙'])
                    note = body.new_tag('aside', attrs={'class': 'translator-note ' + ('source-correction' if correction else 'beginner')})
                    title = body.new_tag('h4')
                    title.string = ('정정·조건 역주 · ' if correction else '학습 도움 · ') + item['title']
                    note.append(title)
                    text = body.new_tag('p')
                    text.string = item['text']
                    note.append(text)
                    tail.insert_after(note)
                    tail = note
            if foot_index != len(footnotes):
                raise ValueError('Unused original footnote: ' + key)
            if before_code != [c.get_text() for c in body.select('.fragmentcode')]:
                raise ValueError('Original code changed: ' + key)
            # Original source URLs become native routes where a translation is
            # available; unknown destinations keep their official source link.
            page_url = urljoin(BASE_URL, meta['path'])
            for link in body.select('a[href]'):
                href = link['href']
                if href.startswith('#'):
                    continue
                absolute, fragment = urldefrag(urljoin(page_url, href))
                target = routes.get(absolute.removesuffix('.html'))
                if target:
                    link['href'] = target + '.html' + ('#' + fragment if fragment else '')
            articles[key] = (body.article, page_url.removesuffix('.html'), figures, meta)
    return articles


def append_chapter(source: Path, target: Path, stage: Path, data: Path = DATA):
    catalog_path = target / 'catalog.json'
    if catalog_path.exists():
        catalog = json.loads(catalog_path.read_text(encoding='utf8'))
        if catalog.get('schema') != 1 or catalog.get('bookId') != 'pbrt-4ed':
            raise ValueError('Unsupported existing native catalog')
    else:
        catalog = {'schema': 1, 'bookId': 'pbrt-4ed', 'translationReview': 'draft', 'lessons': []}
    if any(row['id'].startswith('translation-12-') for row in catalog['lessons']):
        raise ValueError('Chapter 12 already exists; rebuild into a fresh directory rather than silently replacing it.')
    articles = build_articles(source, stage, data)
    core.CHAPTERS['12'] = '광원'
    known = set(articles) | {r['id'].removeprefix('translation-') for r in catalog['lessons']}
    lessons_dir = target / 'lessons'
    lessons_dir.mkdir(parents=True, exist_ok=True)
    metrics = []
    for key, (article, url, assets, meta) in articles.items():
        lesson = core.native_lesson(key, article, url, assets, target, known)
        lesson['prerequisites'] = ['math-03', 'math-04', 'math-06']
        raw = encode(lesson)
        relative = 'lessons/' + lesson['id'] + '.json'
        if (target / relative).exists():
            raise ValueError('Existing lesson file: ' + relative)
        (target / relative).write_bytes(raw)
        record = {k: lesson[k] for k in ['id', 'chapter', 'chapterTitle', 'title', 'deck', 'kind', 'minutes', 'sourceSection']}
        record.update(file=relative, sha256=digest(raw), search=[{'id': b['id'], 'text': b['text']} for b in lesson['blocks']])
        catalog['lessons'].append(record)
        metrics.append({'page': key, 'sourceUnits': meta['units'], 'translated': meta['translated'],
                        'blocks': len(lesson['blocks']), 'bytes': len(raw),
                        'codeBlocks': len(article.select('.fragmentcode'))})
    def order(row):
        key = row['id'].removeprefix('translation-')
        return (int(key[:2]), int(key[3:]) if key[3:].isdigit() else 90 if key.endswith('reading') else 99)
    catalog['lessons'].sort(key=order)
    if len({r['id'] for r in catalog['lessons']}) != len(catalog['lessons']):
        raise ValueError('Duplicate lesson IDs')
    catalog_path.write_bytes(encode(catalog))
    payloads = [json.loads(p.read_text(encoding='utf8')) for p in sorted(data.glob('12-*.ko.json'))]
    report = {'chapter': 12, 'sourceArchiveSha256': file_digest(source), 'pages': metrics,
              'translatedUnits': sum(len(p['translations']) for p in payloads),
              'preservedReferences': sum(len(p.get('preserved_reference_ids', [])) for p in payloads),
              'sourceFootnotes': sum(len(p.get('footnotes', [])) for p in payloads),
              'separateNotes': sum(len(p.get('notes', [])) for p in payloads),
              'figures': len(json.loads((data / 'figure-provenance.json').read_text(encoding='utf8'))),
              'independentExpertReview': False, 'wholeBookComplete': False}
    (target / 'chapter-12-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    return report


def prepare(source: Path, out: Path, prior_bundle: Path | None = None,
            existing: Path | None = None, replace: bool = False, data: Path = DATA):
    if prior_bundle and existing:
        raise ValueError('Choose --ch09-ch10 or --existing-native, not both.')
    if out.exists() and not replace:
        raise ValueError('Output exists; --replace is required to back it up and replace it.')
    if existing and (not existing.is_dir() or not (existing / 'catalog.json').is_file()):
        raise ValueError('Existing native directory has no catalog.json')
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='.pbrt12-', dir=out.parent) as temp:
        stage = Path(temp)
        result = stage / 'native'
        if prior_bundle:
            core.prepare(source, prior_bundle, result)
        elif existing:
            if any(p.is_symlink() for p in existing.rglob('*')):
                raise ValueError('Existing native directory must not contain symbolic links.')
            shutil.copytree(existing, result)
        else:
            result.mkdir()
        report = append_chapter(source, result, stage, data)
        backup = None
        if out.exists():
            backup = out.with_name(out.name + '.backup-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ'))
            out.rename(backup)
        try:
            shutil.move(str(result), str(out))
        except BaseException:
            if backup and not out.exists():
                backup.rename(out)
            raise
        print(json.dumps({'output': str(out), 'chapter12': report, 'backup': str(backup) if backup else None}, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--out', type=Path, default=ROOT / 'public/books/pbrt-4ed/native')
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--ch09-ch10', type=Path, help='Earlier translation ZIP; rebuilds native chapters 9–12 together.')
    group.add_argument('--existing-native', type=Path, help='Existing chapters 9–11 native directory; preserves it and adds chapter 12.')
    parser.add_argument('--replace', action='store_true')
    args = parser.parse_args()
    resolve = lambda value: value.expanduser().resolve() if value else None
    prepare(resolve(args.source), resolve(args.out), resolve(args.ch09_ch10), resolve(args.existing_native), args.replace)


if __name__ == '__main__':
    main()
