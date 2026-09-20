#!/usr/bin/env python3
"""Integrity checks for this local package. Not an independent language audit."""
from pathlib import Path
from collections import Counter
import json,hashlib,re,sys
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[2]
N=ROOT/'public/books/pbrt-4ed/native'
report={'chapters':{},'nativeLessons':0,'assets':set(),'legacySections':0,'legacyFigures':0,'unresolvedLocalAnchors':[]}
cat=json.loads((N/'catalog.json').read_text(encoding='utf8'));seen=set()
for m in cat['lessons']:
 assert m['id'] not in seen, m['id'];seen.add(m['id']);raw=(N/m['file']).read_bytes()
 assert hashlib.sha256(raw).hexdigest()==m['sha256'], m['id']+' checksum'
 l=json.loads(raw);assert l['id']==m['id'];assert [b['id'] for b in l['blocks']]==[x['id'] for x in m['search']]
 soup=BeautifulSoup(''.join(b['html'] for b in l['blocks']),'lxml')
 ids=[x['id'] for x in soup.select('[id]')];assert len(ids)==len(set(ids)),m['id']+' duplicate DOM ID'
 for use in soup.find_all('use'):
  h=use.get('href') or use.get('xlink:href','');assert h.startswith('#') and h[1:] in ids,m['id']+' broken SVG reference '+h
 assert not soup.select('script,iframe,object,embed'),m['id']+' unsafe node'
 for img in soup.find_all('img'):
  f=(ROOT/'public'/img['src'].lstrip('/')).resolve();assert f.is_relative_to((ROOT/'public').resolve()) and f.is_file(),str(f);report['assets'].add(str(f.relative_to(ROOT)))
 for a in soup.select('a[href^="#"]'):
  if a['href'][1:] not in ids and a['href'][1:] not in [b['id'] for b in l['blocks']]: report['unresolvedLocalAnchors'].append({'lesson':m['id'],'href':a['href']})
 report['nativeLessons']+=1
for ch in range(13,17):
 d=ROOT/f'translations/pbrt/ch{ch}';man=json.loads((d/'source-manifest.json').read_text());c=Counter()
 for key,meta in man.items():
  t=json.loads((d/f'{key}.ko.json').read_text());canonical=json.dumps(t,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode();assert hashlib.sha256(canonical).hexdigest()==meta['canonical_translation_sha256'],key
  translated=t['translations'];refs=t.get('preserved_reference_ids',[]);ids={f'u{i:04d}' for i in range(meta['units'])};assert set(translated)|set(refs)==ids and not set(translated)&set(refs),key
  c.update(pages=1,translated=len(translated),references=len(refs),notes=len(t.get('notes',[])),footnotes=len(t.get('footnotes',[])))
 report['chapters'][str(ch)]=dict(c)
sections=json.loads((ROOT/'docs/pbrt-audit/sections.json').read_text());assert len(sections)==50
report['legacySections']=len(sections)
for s in sections:
 assert s['status']=='editorial-pass' and not s['fullTranslation'] and not s['independentExpertReview']
report['legacyFigures']=len(list((ROOT/'public/books/pbrt-4ed/reviewed-images').glob('*.png')))
report['assets']=len(report['assets']);report['passed']=True
print(json.dumps(report,ensure_ascii=False,indent=2))
