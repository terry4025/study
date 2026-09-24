#!/usr/bin/env python3
from __future__ import annotations
import json, re, copy
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup, NavigableString
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

BASE="https://pbr-book.org/4ed/"
MODEL="Helsinki-NLP/opus-mt-tc-big-en-ko"
SAMPLES=[
 ("03-03","Geometry_and_Transformations/Vectors","u0038"),
 ("03-08","Geometry_and_Transformations/Spherical_Geometry","u0024"),
 ("04-06","Radiometry,_Spectra,_and_Color/Color","u0119"),
 ("05-02","Cameras_and_Film/Projective_Camera_Models","u0064"),
 ("06-02","Shapes/Spheres","u0001"),
 ("06-07","Shapes/Curves","u0001"),
 ("06-08","Shapes/Managing_Rounding_Error","u0128"),
 ("07-01","Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives","u0001"),
 ("08-07","Sampling_and_Reconstruction/Sobol_Samplers","u0001"),
 ("08-reading","Sampling_and_Reconstruction/Further_Reading","u0036"),
]
def norm(s): return re.sub(r"\s+"," ",s).strip()
def units(html):
 s=BeautifulSoup(html,"lxml"); out=[]
 for root in s.select(".pretext-layout-root"):
  for el in root.select("h1,h2,h3,h4,p,li,figcaption"):
   if el.find_parent(["p","li","figcaption"]) or el.find_parent(class_="fragmentcode"):continue
   if not norm(el.get_text(" ",strip=True)):continue
   clone=copy.deepcopy(el); toks=[]
   for t in list(clone.find_all(["svg","tt","code","a","span"])):
    if clone not in t.parents:continue
    if not (t.name in ["svg","tt","code","a"] or "fragmentname" in t.get("class",[])):continue
    if t.find_parent(["svg","tt","code","a"]) is not None:continue
    if not norm(t.get_text()):continue
    toks.append(t.get_text(" ",strip=True));t.replace_with(NavigableString(f"ZXQ{len(toks)-1}QXZ"))
   out.append(norm(clone.get_text(" ",strip=True)))
 return out
tok=AutoTokenizer.from_pretrained(MODEL)
model=AutoModelForSeq2SeqLM.from_pretrained(MODEL);model.eval()
result=[]
for key,path,uid in SAMPLES:
 html=requests.get(urljoin(BASE,path),timeout=30).text
 text=units(html)[int(uid[1:])]
 enc=tok([text],return_tensors="pt",truncation=True,max_length=512)
 out=model.generate(**enc,max_new_tokens=600,num_beams=4)
 ko=tok.batch_decode(out,skip_special_tokens=True)[0]
 result.append({"key":key,"uid":uid,"source":text,"opus":ko})
Path("mt-quality-comparison.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf8")
print(json.dumps({"samples":len(result),"model":MODEL},ensure_ascii=False))
