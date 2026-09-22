#!/usr/bin/env python3
"""Import aggregate PBRT MT artifacts as source-aligned per-page translation JSON.

Reviewed manual pages are never overwritten. This script only reshapes generated
data; it does not claim independent linguistic review.
"""
from __future__ import annotations
import argparse,json,re,shutil
from pathlib import Path

REVIEWED={"07-03","08-01","08-06"}
PATH_TO_KEY={
"Monte_Carlo_Integration.html":"02-00",
"Monte_Carlo_Integration/Monte_Carlo_Basics.html":"02-01",
"Monte_Carlo_Integration/Improving_Efficiency.html":"02-02",
"Monte_Carlo_Integration/Sampling_Using_the_Inversion_Method.html":"02-03",
"Monte_Carlo_Integration/Transforming_between_Distributions.html":"02-04",
"Monte_Carlo_Integration/Further_Reading.html":"02-reading",
"Monte_Carlo_Integration/Exercises.html":"02-exercises",
"Geometry_and_Transformations.html":"03-00",
"Geometry_and_Transformations/Coordinate_Systems.html":"03-01",
"Geometry_and_Transformations/n-Tuple_Base_Classes.html":"03-02",
"Geometry_and_Transformations/Vectors.html":"03-03",
"Geometry_and_Transformations/Points.html":"03-04",
"Geometry_and_Transformations/Normals.html":"03-05",
"Geometry_and_Transformations/Rays.html":"03-06",
"Geometry_and_Transformations/Bounding_Boxes.html":"03-07",
"Geometry_and_Transformations/Spherical_Geometry.html":"03-08",
"Geometry_and_Transformations/Transformations.html":"03-09",
"Geometry_and_Transformations/Applying_Transformations.html":"03-10",
"Geometry_and_Transformations/Interactions.html":"03-11",
"Geometry_and_Transformations/Further_Reading.html":"03-reading",
"Geometry_and_Transformations/Exercises.html":"03-exercises",
}

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
        seen_keys=set()
        for artifact_key,page in data["pages"].items():
            if not re.fullmatch(ch+r"-(?:\d{2}|reading|exercises)",artifact_key):raise ValueError("Unexpected page key: "+artifact_key)
            key=PATH_TO_KEY.get(page.get("path"),artifact_key)
            if key in seen_keys:raise ValueError("Duplicate remapped page key: "+key)
            seen_keys.add(key)
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
