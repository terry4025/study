#!/usr/bin/env python3
"""Check committed Korean payloads; this is not a linguistic/full-book audit."""
from pathlib import Path
import hashlib, json, re
ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'translations/pbrt/ch10'
manifest = json.loads((DATA / 'source-manifest.json').read_text(encoding='utf8'))
totals = {'translated': 0, 'references': 0, 'notes': 0, 'footnotes': 0}
for key, meta in manifest.items():
    data = json.loads((DATA / (key + '.ko.json')).read_text(encoding='utf8'))
    canonical = json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()
    assert hashlib.sha256(canonical).hexdigest() == meta['canonical_translation_sha256'], key + ': translation payload differs'
    translated = data['translations']
    refs = data.get('preserved_reference_ids', [])
    assert len(translated) == meta['translated'], key
    assert not set(translated) & set(refs), key + ': overlapping states'
    expected = {f'u{i:04d}' for i in range(meta['units'])}
    assert set(translated) | set(refs) == expected, key + ': missing or unknown unit'
    assert len(refs) == len(set(refs)), key
    for uid, text in translated.items():
        assert re.fullmatch(r'u\d{4}', uid) and isinstance(text, str) and text.strip(), key
        assert not re.search(r'\{\{[^0-9}]', text), key + ': malformed placeholder'
    for note in data.get('notes', []):
        assert note['after'] in expected and note['title'].strip() and note['text'].strip(), key
    totals['translated'] += len(translated)
    totals['references'] += len(refs)
    totals['notes'] += len(data.get('notes', []))
    totals['footnotes'] += len(data.get('footnotes', []))
assert totals == {'translated': 373, 'references': 103, 'notes': 28, 'footnotes': 5}, totals
print(json.dumps({'passed': True, 'pages': len(manifest), **totals}, ensure_ascii=False))
