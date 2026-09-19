#!/usr/bin/env python3
"""One-time reviewed integration patch. Only named source files are changed.
This script is idempotent and refuses an incompatible working tree."""
from pathlib import Path
import subprocess,json
ROOT=Path(__file__).resolve().parents[2]
patch=ROOT/'tools/pbrt/native-integration.patch'
def run(*args,check=True):return subprocess.run(['git',*args],cwd=ROOT,check=check)
if run('apply','--reverse','--check',str(patch),check=False).returncode:
 run('apply','--check',str(patch));run('apply',str(patch))
# Correct two known copy/transport differences back to the checked local text.
fixes=[('11-02','u0033','두 번째 항를','두 번째 항을'),('11-04','u0024','{{3}}는 항상 전부 필요한 것은 아닙니다.','광선 위의 {{3}}는 항상 전부 필요한 것은 아닙니다.')]
for file,unit,old,new in fixes:
 p=ROOT/f'translations/pbrt/ch11/{file}.ko.json';d=json.loads(p.read_text(encoding='utf8'));text=d['translations'][unit]
 if new not in text and old in text:d['translations'][unit]=text.replace(old,new);p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Native reader integration applied (or already present).')
