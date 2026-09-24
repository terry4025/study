#!/usr/bin/env python3
"""Generate source-aligned Korean translation drafts for PBRT chapters 1-8 and appendices A-C.

The script downloads only official PBRT HTML pages at runtime; it never commits or
bundles the English source. Bibliography entries after a References heading remain
in the original language for identification. Inline math/code/link placeholders are
preserved and validated.
"""
from __future__ import annotations
import argparse, copy, hashlib, json, re, time
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup, NavigableString
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

BASE = "https://pbr-book.org/4ed/"
MODEL = "Helsinki-NLP/opus-mt-en-ko"

GROUPS = {
"01":[("01-00","Introduction",5),("01-01","Introduction/Literate_Programming",16),("01-02","Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm",65),("01-03","Introduction/pbrt_System_Overview",96),("01-04","Introduction/How_to_Proceed_through_This_Book",19),("01-05","Introduction/Using_and_Understanding_the_Code",65),("01-06","Introduction/A_Brief_History_of_Physically_Based_Rendering",36),("01-reading","Introduction/Further_Reading",76),("01-exercises","Introduction/Exercises",2)],
"02":[("02-00","Monte_Carlo_Integration",5),("02-01","Monte_Carlo_Integration/Monte_Carlo_Basics",61),("02-02","Monte_Carlo_Integration/Improving_Efficiency",72),("02-03","Monte_Carlo_Integration/Sampling_Using_the_Inversion_Method",36),("02-04","Monte_Carlo_Integration/Transforming_between_Distributions",36),("02-reading","Monte_Carlo_Integration/Further_Reading",45),("02-exercises","Monte_Carlo_Integration/Exercises",4)],
"03":[("03-00","Geometry_and_Transformations",2),("03-01","Geometry_and_Transformations/Coordinate_Systems",10),("03-02","Geometry_and_Transformations/n-Tuple_Base_Classes",26),("03-03","Geometry_and_Transformations/Vectors",47),("03-04","Geometry_and_Transformations/Points",10),("03-05","Geometry_and_Transformations/Normals",6),("03-06","Geometry_and_Transformations/Rays",17),("03-07","Geometry_and_Transformations/Bounding_Boxes",31),("03-08","Geometry_and_Transformations/Spherical_Geometry",88),("03-09","Geometry_and_Transformations/Transformations",86),("03-10","Geometry_and_Transformations/Applying_Transformations",41),("03-11","Geometry_and_Transformations/Interactions",30),("03-reading","Geometry_and_Transformations/Further_Reading",42),("03-exercises","Geometry_and_Transformations/Exercises",5)],
"04":[("04-00","Radiometry,_Spectra,_and_Color",4),("04-01","Radiometry,_Spectra,_and_Color/Radiometry",70),("04-02","Radiometry,_Spectra,_and_Color/Working_with_Radiometric_Integrals",25),("04-03","Radiometry,_Spectra,_and_Color/Surface_Reflection",29),("04-04","Radiometry,_Spectra,_and_Color/Light_Emission",38),("04-05","Radiometry,_Spectra,_and_Color/Representing_Spectral_Distributions",66),("04-06","Radiometry,_Spectra,_and_Color/Color",154),("04-reading","Radiometry,_Spectra,_and_Color/Further_Reading",77),("04-exercises","Radiometry,_Spectra,_and_Color/Exercises",5)],
"05":[("05-00","Cameras_and_Film",6),("05-01","Cameras_and_Film/Camera_Interface",52),("05-02","Cameras_and_Film/Projective_Camera_Models",69),("05-03","Cameras_and_Film/Spherical_Camera",13),("05-04","Cameras_and_Film/Film_and_Imaging",147),("05-reading","Cameras_and_Film/Further_Reading",85),("05-exercises","Cameras_and_Film/Exercises",10)],
"06":[("06-00","Shapes",3),("06-01","Shapes/Basic_Shape_Interface",56),("06-02","Shapes/Spheres",97),("06-03","Shapes/Cylinders",30),("06-04","Shapes/Disks",27),("06-05","Shapes/Triangle_Meshes",181),("06-06","Shapes/Bilinear_Patches",102),("06-07","Shapes/Curves",66),("06-08","Shapes/Managing_Rounding_Error",242),("06-reading","Shapes/Further_Reading",142),("06-exercises","Shapes/Exercises",21)],
"07":[("07-00","Primitives_and_Intersection_Acceleration",5),("07-01","Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives",40),("07-02","Primitives_and_Intersection_Acceleration/Aggregates",7),("07-03","Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies",130),("07-reading","Primitives_and_Intersection_Acceleration/Further_Reading",169),("07-exercises","Primitives_and_Intersection_Acceleration/Exercises",14)],
"08":[("08-00","Sampling_and_Reconstruction",4),("08-01","Sampling_and_Reconstruction/Sampling_Theory",104),("08-02","Sampling_and_Reconstruction/Sampling_and_Integration",60),("08-03","Sampling_and_Reconstruction/Sampling_Interface",17),("08-04","Sampling_and_Reconstruction/Independent_Sampler",7),("08-05","Sampling_and_Reconstruction/Stratified_Sampler",25),("08-06","Sampling_and_Reconstruction/Halton_Sampler",84),("08-07","Sampling_and_Reconstruction/Sobol_Samplers",102),("08-08","Sampling_and_Reconstruction/Image_Reconstruction",78),("08-reading","Sampling_and_Reconstruction/Further_Reading",146),("08-exercises","Sampling_and_Reconstruction/Exercises",6)],
"A":[("A-00","Sampling_Algorithms",2),("A-01","Sampling_Algorithms/The_Alias_Method",25),("A-02","Sampling_Algorithms/Reservoir_Sampling",16),("A-03","Sampling_Algorithms/The_Rejection_Method",9),("A-04","Sampling_Algorithms/Sampling_1D_Functions",74),("A-05","Sampling_Algorithms/Sampling_Multidimensional_Functions",107),("A-reading","Sampling_Algorithms/Further_Reading",35),("A-exercises","Sampling_Algorithms/Exercises",4)],
"B":[("B-00","Utilities",2),("B-01","Utilities/System_Startup,_Cleanup,_and_Options",7),("B-02","Utilities/Mathematical_Infrastructure",182),("B-03","Utilities/User_Interaction",60),("B-04","Utilities/Containers_and_Memory_Management",70),("B-05","Utilities/Images",102),("B-06","Utilities/Parallelism",105),("B-07","Utilities/Statistics",24),("B-reading","Utilities/Further_Reading",49),("B-exercises","Utilities/Exercises",5)],
"C":[("C-00","Processing_the_Scene_Description",7),("C-01","Processing_the_Scene_Description/Tokenizing_and_Parsing",22),("C-02","Processing_the_Scene_Description/Managing_the_Scene_Description",77),("C-03","Processing_the_Scene_Description/BasicScene_and_Final_Object_Creation",17),("C-04","Processing_the_Scene_Description/Adding_New_Object_Implementations",6),("C-reading","Processing_the_Scene_Description/Further_Reading",8),("C-exercises","Processing_the_Scene_Description/Exercises",5)]
}
BATCHES={"ch02":["02"],"ch03":["03"],"ch04":["04"],"ch05":["05"],"ch06":["06"],"ch07":["07"],"ch08":["08"]}

def norm(s:str)->str: return re.sub(r"\s+"," ",s).strip()

def extract_units(source:str):
    soup=BeautifulSoup(source,"lxml"); roots=soup.select(".pretext-layout-root"); units=[]
    for root in roots:
        for el in root.select("h1,h2,h3,h4,p,li,figcaption"):
            if el.find_parent(["p","li","figcaption"]) or el.find_parent(class_="fragmentcode"): continue
            if not norm(el.get_text(" ",strip=True)): continue
            clone=copy.deepcopy(el); tokens=[]
            for t in list(clone.find_all(["svg","tt","code","a","span"])):
                if clone not in t.parents: continue
                if not (t.name in ["svg","tt","code","a"] or "fragmentname" in t.get("class",[])): continue
                if t.find_parent(["svg","tt","code","a"]) is not None: continue
                if not norm(t.get_text()): continue
                label=t.find("title").get_text() if t.name=="svg" and t.find("title") else t.get_text(" ",strip=True)
                tokens.append({"label":norm(label)})
                t.replace_with(NavigableString("{{"+str(len(tokens)-1)+"}}"))
            text=norm(clone.get_text(" ",strip=True))
            units.append({"id":f"u{len(units):04d}","tag":el.name,"text":text,"tokens":tokens,
                          "source_hash":hashlib.sha256(text.encode()).hexdigest()})
    footnotes=[]
    for b in soup.select(".footnote-button[title]"):
        t=norm(b.get("title",""))
        if t: footnotes.append(t)
    return units, footnotes

def split_plain(text, tokenizer, limit=260):
    if not text.strip(): return [text]
    if len(tokenizer(text,add_special_tokens=False).input_ids)<=limit: return [text]
    parts=re.split(r"(?<=[.!?])\s+|(?<=;)\s+",text)
    out=[]; cur=""
    for part in parts:
        candidate=(cur+" "+part).strip()
        if cur and len(tokenizer(candidate,add_special_tokens=False).input_ids)>limit:
            out.append(cur);cur=part
        else: cur=candidate
    if cur: out.append(cur)
    final=[]
    for part in out:
        if len(tokenizer(part,add_special_tokens=False).input_ids)<=limit: final.append(part);continue
        words=part.split();cur=""
        for w in words:
            cand=(cur+" "+w).strip()
            if cur and len(tokenizer(cand,add_special_tokens=False).input_ids)>limit:
                final.append(cur);cur=w
            else:cur=cand
        if cur:final.append(cur)
    return final

def translate_batch(texts, tokenizer, model):
    translated=[]
    for start in range(0,len(texts),12):
        batch=texts[start:start+12]
        enc=tokenizer(batch,return_tensors="pt",padding=True,truncation=True,max_length=320)
        with torch.inference_mode():
            out=model.generate(**enc,max_new_tokens=420,num_beams=1)
        translated.extend(tokenizer.batch_decode(out,skip_special_tokens=True))
    return translated

def clean_ko(s:str)->str:
    replacements={
      "몬테 카를로":"몬테카를로","확률 밀도 함수":"확률밀도함수","방사 휘도":"방사휘도",
      "레이 트레이싱":"광선 추적","레이 트레이서":"광선 추적기","경계 박스":"바운딩 박스",
      "텍스쳐":"텍스처","샘플러":"샘플러","통합기":"적분기","프리미티브":"프리미티브",
      "스펙트럼 분포":"스펙트럼 분포","렌더":"렌더링"
    }
    for a,b in replacements.items():s=s.replace(a,b)
    return norm(s)

def translate_preserving(text, tokenizer, model):
    chunks=re.split(r"(\{\{\d+\}\})",text)
    plain=[c for c in chunks if c and not re.fullmatch(r"\{\{\d+\}\}",c)]
    tasks=[]; shape=[]
    for p in plain:
        parts=split_plain(p,tokenizer);shape.append(len(parts));tasks.extend(parts)
    ko=translate_batch(tasks,tokenizer,model) if tasks else []
    it=iter(ko); piter=iter(shape); result=[]
    for c in chunks:
        if not c:continue
        if re.fullmatch(r"\{\{\d+\}\}",c):result.append(c)
        else:
            n=next(piter);result.append(" ".join(clean_ko(next(it)) for _ in range(n)))
    return norm(" ".join(result).replace(" } }","}}").replace("{ {","{{"))

def fetch(path):
    url=urljoin(BASE,path)
    for attempt in range(5):
        r=requests.get(url,timeout=45,headers={"User-Agent":"PBRT-personal-study-translation/1.0"})
        if r.ok:return r.text,r.url
        time.sleep(2**attempt)
    r.raise_for_status()

def existing_override(repo:Path,key:str):
    # Only these source-unit-exact pages have manually reviewed overrides.
    if key not in {"07-03","08-01","08-06"}:
        return None
    chapter_dir = "ch" + key.split("-", 1)[0]
    p = repo / f"translations/pbrt/{chapter_dir}/{key}.ko.json"
    if p.is_file():
        d=json.loads(p.read_text(encoding="utf8"))
        if isinstance(d.get("translations"),dict):return d
    return None

def main():
    ap=argparse.ArgumentParser();ap.add_argument("--batch",choices=BATCHES,required=True)
    ap.add_argument("--out",type=Path,required=True);ap.add_argument("--repo",type=Path,default=Path("."))
    a=ap.parse_args();a.out.mkdir(parents=True,exist_ok=True)
    tokenizer=AutoTokenizer.from_pretrained(MODEL);model=AutoModelForSeq2SeqLM.from_pretrained(MODEL)
    model.eval();torch.set_num_threads(max(1,min(4,torch.get_num_threads())))
    report={"model":MODEL,"batch":a.batch,"pages":[],"translated":0,"references_preserved":0,"footnotes":0}
    for chapter in BATCHES[a.batch]:
        chapter_out={"schema":1,"chapter":chapter,"model":MODEL,"pages":{}}
        for key,path,expected in GROUPS[chapter]:
            source,final_url=fetch(path);units,footnotes=extract_units(source)
            if len(units)!=expected:raise RuntimeError(f"{key}: expected {expected} units, got {len(units)} from {final_url}")
            override=existing_override(a.repo,key)
            translations={};preserved=[];ref_seen=False
            for u in units:
                if u["text"].strip().lower()=="references":
                    translations[u["id"]]="참고문헌";ref_seen=True;continue
                if ref_seen:
                    preserved.append(u["id"]);continue
                if override and u["id"] in override.get("translations",{}):
                    translations[u["id"]]=override["translations"][u["id"]]
                else:
                    translations[u["id"]]=translate_preserving(u["text"],tokenizer,model)
                if sorted(re.findall(r"\{\{\d+\}\}",translations[u["id"]]))!=sorted(re.findall(r"\{\{\d+\}\}",u["text"])):
                    raise RuntimeError(f"{key}/{u['id']}: placeholder mismatch")
            ko_foot=[translate_preserving(x,tokenizer,model) for x in footnotes]
            page={"path":path+".html","source_url":final_url,"source_units":len(units),
                  "translations":translations,"preserved_reference_ids":preserved,"footnotes":ko_foot,
                  "translation_method":"NLLB first pass + checked manual overrides when available"}
            chapter_out["pages"][key]=page
            report["pages"].append({"key":key,"units":len(units),"translated":len(translations),"preserved":len(preserved),"footnotes":len(ko_foot)})
            report["translated"]+=len(translations);report["references_preserved"]+=len(preserved);report["footnotes"]+=len(ko_foot)
            print(json.dumps(report["pages"][-1],ensure_ascii=False),flush=True)
        (a.out/f"{chapter}.json").write_text(json.dumps(chapter_out,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    (a.out/f"report-{a.batch}.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
if __name__=="__main__":main()
