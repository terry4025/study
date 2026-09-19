#!/usr/bin/env python3
"""Structural checks, not an independent linguistic or scientific review."""
from pathlib import Path
import hashlib, json, math, re
ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'translations/pbrt/ch12'
def check(data=DATA):
    manifest = json.loads((data/'source-manifest.json').read_text(encoding='utf8'))
    expected_keys = {f'12-{i:02d}' for i in range(7)} | {'12-reading','12-exercises'}
    assert set(manifest) == expected_keys, 'Unexpected chapter scope'
    totals = dict(units=0,translated=0,references=0,notes=0,footnotes=0)
    for key, meta in manifest.items():
        payload = json.loads((data/(key+'.ko.json')).read_text(encoding='utf8'))
        canonical = json.dumps(payload,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
        assert hashlib.sha256(canonical).hexdigest()==meta['canonical_translation_sha256'], key+': payload differs'
        translated=payload['translations']; refs=payload.get('preserved_reference_ids',[])
        expected={f'u{i:04d}' for i in range(meta['units'])}
        assert len(translated)==meta['translated'] and len(refs)==len(set(refs)), key
        assert not set(translated)&set(refs) and set(translated)|set(refs)==expected, key+': coverage'
        for uid,text in translated.items():
            assert isinstance(text,str) and text.strip() and re.fullmatch(r'u\d{4}',uid),key
            remainder=re.sub(r'\{\{\d+\}\}','',text)
            assert '{{' not in remainder and '}}' not in remainder,key+': malformed token'
        for note in payload.get('notes',[]):
            assert note['after'] in expected and note['title'].strip() and note['text'].strip(),key
        assert all(isinstance(x,str) and x.strip() for x in payload.get('footnotes',[])),key
        for field in ['source_sha256','pdf_sha256','canonical_translation_sha256']:
            assert re.fullmatch(r'[0-9a-f]{64}',meta[field]),key
        totals['units']+=len(expected); totals['translated']+=len(translated); totals['references']+=len(refs)
        totals['notes']+=len(payload.get('notes',[])); totals['footnotes']+=len(payload.get('footnotes',[]))
    provenance=json.loads((data/'figure-provenance.json').read_text(encoding='utf8'))
    assert len(provenance)==33 and {p['image'] for p in provenance}=={f'figure-12-{i}.png' for i in range(1,34)}
    pdfs={Path(m['archive_pdf']).name for m in manifest.values()}
    for figure in provenance:
        assert figure['parts']
        for part in figure['parts']:
            assert part['pdf'] in pdfs and isinstance(part['page'],int) and part['page']>0
            r=part['rect']; assert len(r)==4 and all(isinstance(x,(int,float)) and math.isfinite(x) for x in r)
            assert 0<=r[0]<r[2] and 0<=r[1]<r[3]
    assert totals=={'units':429,'translated':374,'references':55,'notes':39,'footnotes':2},totals
    return {'passed':True,'chapter':12,'pages':9,'figures':33,**totals}
if __name__=='__main__':print(json.dumps(check(),ensure_ascii=False))
