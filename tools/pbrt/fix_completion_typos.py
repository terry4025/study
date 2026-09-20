#!/usr/bin/env python3
"""Apply two explicitly reviewed serialization/editorial corrections only."""
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[2]
FIXES = [
 ('translations/pbrt/ch08/08-07.ko.json', '다음 관계가 주어지면,\n",', '다음 관계가 주어지면,",'),
 ('translations/pbrt/chA/A-05.ko.json', 'A.5 多차원 함수 샘플링', 'A.5 다차원 함수 샘플링'),
]
changed=[]
for name, old, new in FIXES:
    path=ROOT/name
    text=path.read_text(encoding='utf-8')
    if old in text:
        if text.count(old)!=1: raise ValueError('Ambiguous correction: '+name)
        replacement=text.replace(old,new,1)
        json.loads(replacement)
        path.write_text(replacement,encoding='utf-8')
        changed.append(name)
    else:
        if new not in text: raise ValueError('Unexpected source version: '+name)
        json.loads(text)
print(json.dumps({'changed':changed},ensure_ascii=False))
