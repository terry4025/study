#!/usr/bin/env python3
"""Validate Git-tracked PBRT review/translation source without generated local assets."""
from pathlib import Path
from collections import Counter
import hashlib, json, re

ROOT=Path(__file__).resolve().parents[2]

def canonical(value):
    return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()

report={"chapters":{},"legacySections":0,"reviewedFigures":0,"additionalDrafts":[]}

for chapter in range(13,17):
    folder=ROOT/f"translations/pbrt/ch{chapter}"
    manifest=json.loads((folder/"source-manifest.json").read_text(encoding="utf-8"))
    totals=Counter()
    for key,meta in manifest.items():
        data=json.loads((folder/f"{key}.ko.json").read_text(encoding="utf-8"))
        assert hashlib.sha256(canonical(data)).hexdigest()==meta["canonical_translation_sha256"], key+" payload"
        translated=data["translations"]; refs=data.get("preserved_reference_ids",[])
        expected={f"u{i:04d}" for i in range(meta["units"])}
        assert set(translated)|set(refs)==expected and not set(translated)&set(refs), key+" coverage"
        for uid,text in translated.items():
            assert re.fullmatch(r"u\d{4}",uid) and isinstance(text,str) and text.strip(), key+" unit"
        totals.update(pages=1,translated=len(translated),references=len(refs),notes=len(data.get("notes",[])),footnotes=len(data.get("footnotes",[])))
    report["chapters"][str(chapter)]=dict(totals)

for path in [
    ROOT/"translations/pbrt/ch07/07-03.ko.json",
    ROOT/"translations/pbrt/ch08/08-01.ko.json",
    ROOT/"translations/pbrt/ch08/08-06.ko.json",
]:
    data=json.loads(path.read_text(encoding="utf-8"))
    assert isinstance(data.get("translations"),dict) and data["translations"], str(path)
    for uid,text in data["translations"].items():
        assert re.fullmatch(r"u\d{4}",uid) and isinstance(text,str) and text.strip(), str(path)
    report["additionalDrafts"].append(path.relative_to(ROOT).as_posix())

sections=json.loads((ROOT/"docs/pbrt-audit/sections.json").read_text(encoding="utf-8"))
assert len(sections)==50
assert all(x.get("status")=="editorial-pass" and x.get("fullTranslation") is False and x.get("independentExpertReview") is False for x in sections)
report["legacySections"]=len(sections)

changes=json.loads((ROOT/"docs/pbrt-audit/changes.json").read_text(encoding="utf-8"))
assert isinstance(changes,list) and len(changes)>0

figures=json.loads((ROOT/"docs/pbrt-audit/figure-provenance.json").read_text(encoding="utf-8"))
assert len(figures)==228
names=[x["image"] for x in figures]
assert len(names)==len(set(names))
for row in figures:
    assert re.fullmatch(r"figure-\d+-\d+\.png",row["image"])
    assert re.fullmatch(r"[0-9a-f]{64}",row["pdf_sha256"])
    assert isinstance(row.get("parts"),list) and row["parts"]

report["reviewedFigures"]=len(figures)
report["passed"]=True
print(json.dumps(report,ensure_ascii=False,indent=2))
