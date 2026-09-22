#!/usr/bin/env python3
"""Import aggregate PBRT MT artifacts as source-aligned per-page translation JSON.

Reviewed manual pages are never overwritten. This script only reshapes generated
data; it does not claim independent linguistic review.
"""
from __future__ import annotations
import argparse,json,re,shutil
from pathlib import Path

REVIEWED={"07-03","08-01","08-06"}

def load_chapter(root:Path,ch:str)->dict:
    candidates=[root/f"{ch}.json",root/f"ch{ch}"/f"{ch}.json"]
    for p in candidates:
        if p.is_file():return json.loads(p.read_text(encoding="utf8"))
    matches=list(root.rglob(f"{ch}.json"))
    if len(matches)!=1:raise ValueError(f"Expected one aggregate {ch}.json under {root}, got {matches}")
    return json.loads(matches[0].read_text(encoding="utf8"))

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--input",type=Path,required=True)
    p.add_argument("--repo",type=Path,default=Path("."))
    p.add_argument("--chapters",nargs="+",required=True)
    a=p.parse_args();root=a.input.resolve();repo=a.repo.resolve()
    imported=[]
    for ch in a.chapters:
        if not re.fullmatch(r"0[2-8]",ch):raise ValueError("Only chapters 02-08 are accepted")
        data=load_chapter(root,ch)
        if data.get("schema")!=1 or data.get("chapter")!=ch or not isinstance(data.get("pages"),dict):
            raise ValueError("Unsupported aggregate chapter: "+ch)
        dest=repo/f"translations/pbrt/ch{ch}";dest.mkdir(parents=True,exist_ok=True)
        for key,page in data["pages"].items():
            if not re.fullmatch(ch+r"-(?:\d{2}|reading|exercises)",key):raise ValueError("Unexpected page key: "+key)
            if key in REVIEWED:
                existing=dest/f"{key}.ko.json"
                if not existing.is_file():raise ValueError("Reviewed override missing: "+str(existing))
                continue
            translations=page.get("translations");refs=page.get("preserved_reference_ids",[]);n=page.get("source_units")
            expected={f"u{i:04d}" for i in range(n)}
            if not isinstance(translations,dict) or set(translations)|set(refs)!=expected or set(translations)&set(refs):
                raise ValueError("Coverage mismatch: "+key)
            out={
                "translations":translations,
                "preserved_reference_ids":refs,
                "footnotes":page.get("footnotes",[]),
                "notes":[],
                "source_path":page["path"].removesuffix(".html"),
                "source_units":n,
                "translation_method":page.get("translation_method","NLLB first pass")
            }
            (dest/f"{key}.ko.json").write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
            imported.append(key)
    print(json.dumps({"imported":len(imported),"pages":imported},ensure_ascii=False))
if __name__=="__main__":main()
