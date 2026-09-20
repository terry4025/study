#!/usr/bin/env python3
"""Rebuild reviewed PBRT 1–8 figure crops from the user-supplied source ZIP.

No network requests are made. PDF SHA-256 values and crop rectangles come from
`docs/pbrt-audit/figure-provenance.json`. Existing output is never silently
overwritten; use --replace to retain a backup and replace it.
"""
from __future__ import annotations
import argparse, hashlib, json, shutil, tempfile, zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
import fitz
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
PROVENANCE=ROOT/"docs/pbrt-audit/figure-provenance.json"
DEFAULT_OUT=ROOT/"public/books/pbrt-4ed/reviewed-images"
MAX_MEMBER=100_000_000
MAX_ARCHIVE=1_500_000_000

def digest(raw:bytes)->str:return hashlib.sha256(raw).hexdigest()

def open_source(path:Path)->zipfile.ZipFile:
    z=zipfile.ZipFile(path); infos=z.infolist(); names=[i.filename for i in infos]
    if len(names)!=len(set(names)) or len(names)>5000:
        z.close(); raise ValueError("Duplicate or excessive ZIP entries")
    if sum(i.file_size for i in infos)>MAX_ARCHIVE:
        z.close(); raise ValueError("Source ZIP is too large")
    for info in infos:
        p=PurePosixPath(info.filename)
        if p.is_absolute() or ".." in p.parts or info.file_size>MAX_MEMBER:
            z.close(); raise ValueError("Unsafe source member: "+info.filename)
    return z

def read_member(z:zipfile.ZipFile,name:str,expected:str)->bytes:
    raw=z.read(name); actual=digest(raw)
    if actual!=expected: raise ValueError(f"Source PDF snapshot differs: {name} ({actual})")
    return raw

def build(source:Path,out:Path,replace:bool)->dict:
    rows=json.loads(PROVENANCE.read_text(encoding="utf-8"))
    if not isinstance(rows,list) or not rows: raise ValueError("Figure provenance is missing or invalid")
    if out.exists() and not replace:
        raise ValueError("Output already exists; use --replace to keep a backup and replace it")
    out.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".reviewed-images-",dir=out.parent) as td, open_source(source) as z:
        stage=Path(td)/"reviewed-images"; stage.mkdir(); cache={}
        for row in rows:
            image=row.get("image"); pdf_name=row.get("archive_pdf"); expected=row.get("pdf_sha256"); parts=row.get("parts")
            if not isinstance(image,str) or not image.endswith(".png") or "/" in image or "\\" in image:
                raise ValueError("Unsafe output image name")
            if not isinstance(pdf_name,str) or not isinstance(expected,str) or not isinstance(parts,list) or not parts:
                raise ValueError("Incomplete figure provenance for "+str(image))
            raw=cache.get(pdf_name)
            if raw is None: raw=read_member(z,pdf_name,expected); cache[pdf_name]=raw
            images=[]
            with fitz.open(stream=raw,filetype="pdf") as pdf:
                for part in parts:
                    page_no=int(part["page"]); rect=fitz.Rect(part["rect"])
                    if page_no<1 or page_no>len(pdf) or not pdf[page_no-1].rect.contains(rect):
                        raise ValueError(f"Invalid crop for {image}")
                    pix=pdf[page_no-1].get_pixmap(matrix=fitz.Matrix(2.4,2.4),clip=rect,alpha=False)
                    images.append(Image.frombytes("RGB",(pix.width,pix.height),pix.samples))
            gap=16
            canvas=Image.new("RGB",(max(i.width for i in images),sum(i.height for i in images)+gap*(len(images)-1)),"white")
            y=0
            for im in images:
                canvas.paste(im,((canvas.width-im.width)//2,y)); y+=im.height+gap
            canvas.save(stage/image,optimize=True)
        generated=sorted(p.name for p in stage.iterdir() if p.is_file())
        expected_names=sorted(str(r["image"]) for r in rows)
        if generated!=expected_names: raise ValueError("Generated figure inventory differs from provenance")
        backup=None
        if out.exists():
            backup=out.with_name(out.name+".backup-"+datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")); out.rename(backup)
        try: shutil.move(str(stage),str(out))
        except BaseException:
            if backup and not out.exists(): backup.rename(out)
            raise
    return {"generated":len(rows),"output":str(out),"backup":str(backup) if backup else None}

def main()->None:
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("source",type=Path,help="User-supplied PBRT source ZIP")
    p.add_argument("--out",type=Path,default=DEFAULT_OUT)
    p.add_argument("--replace",action="store_true")
    a=p.parse_args()
    try:
        print(json.dumps(build(a.source.expanduser().resolve(),a.out.expanduser().resolve(),a.replace),ensure_ascii=False,indent=2))
    except (OSError,ValueError,KeyError,TypeError,zipfile.BadZipFile) as e:
        p.exit(1,"Stopped without discarding existing reviewed images: "+str(e)+"\n")
if __name__=="__main__": main()
