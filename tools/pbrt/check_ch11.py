#!/usr/bin/env python3
"""Integrity only; this does not certify translation correctness or full coverage."""
from pathlib import Path
import hashlib,json,re
D=Path(__file__).resolve().parents[2]/'translations/pbrt/ch11'
m=json.loads((D/'source-manifest.json').read_text(encoding='utf8'))
total={'translated':0,'references':0,'notes':0,'footnotes':0}
for key,meta in m.items():
 data=json.loads((D/(key+'.ko.json')).read_text(encoding='utf8'))
 sha=hashlib.sha256(json.dumps(data,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
 if sha!=meta['canonical_translation_sha256']:raise ValueError('Translation hash mismatch: '+key+' actual='+sha)
 translated=data['translations'];refs=data.get('preserved_reference_ids',[])
 if set(translated)&set(refs) or set(translated)|set(refs)!={f'u{i:04d}' for i in range(meta['units'])}:raise ValueError('Unit coverage mismatch: '+key)
 if len(refs)!=len(set(refs)):raise ValueError('Duplicate references')
 for uid,text in translated.items():
  if not re.fullmatch(r'u\d{4}',uid) or not text.strip():raise ValueError('Empty/invalid unit')
 for note in data.get('notes',[]):
  if note['after'] not in translated or not note['title'].strip() or not note['text'].strip():raise ValueError('Invalid note')
 for field,value in [('translated',len(translated)),('references',len(refs)),('notes',len(data.get('notes',[]))),('footnotes',len(data.get('footnotes',[])))]:total[field]+=value
if total!={'translated':254,'references':48,'notes':22,'footnotes':6}:raise ValueError(total)
print(json.dumps({'passed':True,'chapter':11,'pages':len(m),**total}))
