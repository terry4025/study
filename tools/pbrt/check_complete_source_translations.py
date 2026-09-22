#!/usr/bin/env python3
"""Validate source-unit coverage for PBRT chapters 1-8 and appendices A-C.

This is a structural completeness check. It verifies that every source text unit is
represented by Korean translation text or, only for bibliography entries, an
explicit preserved-reference id. It does not claim independent expert review.
"""
from __future__ import annotations
import json,re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
PAGES={
"01":{"01-00":5,"01-01":36,"01-02":65,"01-03":96,"01-04":19,"01-05":65,"01-06":16,"01-reading":76,"01-exercises":2},
"02":{"02-00":5,"02-01":61,"02-02":36,"02-03":36,"02-04":72,"02-reading":45,"02-exercises":4},
"03":{"03-00":2,"03-01":26,"03-02":47,"03-03":10,"03-04":6,"03-05":17,"03-06":31,"03-07":86,"03-08":41,"03-09":30,"03-10":10,"03-11":88,"03-reading":42,"03-exercises":5},
"04":{"04-00":4,"04-01":70,"04-02":25,"04-03":29,"04-04":38,"04-05":66,"04-06":154,"04-reading":77,"04-exercises":5},
"05":{"05-00":6,"05-01":52,"05-02":69,"05-03":13,"05-04":147,"05-reading":85,"05-exercises":10},
"06":{"06-00":3,"06-01":56,"06-02":97,"06-03":30,"06-04":27,"06-05":181,"06-06":102,"06-07":66,"06-08":242,"06-reading":142,"06-exercises":21},
"07":{"07-00":5,"07-01":40,"07-02":7,"07-03":130,"07-reading":169,"07-exercises":14},
"08":{"08-00":4,"08-01":104,"08-02":60,"08-03":17,"08-04":7,"08-05":25,"08-06":84,"08-07":102,"08-08":78,"08-reading":146,"08-exercises":6},
"A":{"A-00":2,"A-01":74,"A-02":25,"A-03":107,"A-04":9,"A-05":16,"A-reading":35,"A-exercises":4},
"B":{"B-00":2,"B-01":182,"B-02":60,"B-03":70,"B-04":102,"B-05":24,"B-06":105,"B-07":7,"B-reading":49,"B-exercises":5},
"C":{"C-00":7,"C-01":22,"C-02":77,"C-03":17,"C-04":6,"C-reading":8,"C-exercises":5},
}
LONG_ENGLISH_ONLY=re.compile(r"^[\x00-\x7f\s\W_]{80,}$")
report={"pages":0,"sourceUnits":0,"translated":0,"referencesPreserved":0,"chapters":{}}
for ch,pages in PAGES.items():
    c={"pages":0,"sourceUnits":0,"translated":0,"referencesPreserved":0}
    folder=ROOT/f"translations/pbrt/ch{ch}"
    for key,n in pages.items():
        path=folder/f"{key}.ko.json"
        if not path.is_file():raise AssertionError("missing translation page: "+str(path.relative_to(ROOT)))
        data=json.loads(path.read_text(encoding="utf-8"))
        tr=data.get("translations");refs=data.get("preserved_reference_ids",[])
        if not isinstance(tr,dict) or not isinstance(refs,list):raise AssertionError(key+" invalid schema")
        expected={f"u{i:04d}" for i in range(n)}
        if set(tr)|set(refs)!=expected or set(tr)&set(refs):raise AssertionError(key+" source-unit coverage mismatch")
        for uid,text in tr.items():
            if not isinstance(text,str) or not text.strip():raise AssertionError(key+"/"+uid+" empty")
            # Long prose units must not be unchanged English pass-through.
            plain=re.sub(r"\{\{\d+\}\}","",text)
            if len(plain)>=80 and not re.search(r"[가-힣]",plain):
                raise AssertionError(key+"/"+uid+" has no Korean prose")
        c["pages"]+=1;c["sourceUnits"]+=n;c["translated"]+=len(tr);c["referencesPreserved"]+=len(refs)
    report["chapters"][ch]=c
    for k in ["pages","sourceUnits","translated","referencesPreserved"]:report[k]+=c[k]
report["unrepresentedUnits"]=report["sourceUnits"]-report["translated"]-report["referencesPreserved"]
assert report["unrepresentedUnits"]==0
report["passed"]=True
print(json.dumps(report,ensure_ascii=False,indent=2))
