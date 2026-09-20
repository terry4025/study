#!/usr/bin/env python3
"""Build actual chapters 13–16 from the supplied archive; no network requests.
Existing native data can be copied in to form chapters 9–16. Never overwrites it.
"""
from __future__ import annotations
import argparse,collections,hashlib,html,json,re,shutil,tempfile,zipfile
from pathlib import Path
from urllib.parse import urljoin,urldefrag
from bs4 import BeautifulSoup,NavigableString
from PIL import Image
import fitz
import prepare_native as core
from source_units import source_units
ROOT=Path(__file__).resolve().parents[2]
CHAPTERS={'13':'빛 전달 I · 표면 반사','14':'빛 전달 II · 볼륨 렌더링','15':'GPU 웨이브프런트 렌더링','16':'회고와 앞으로의 과제'}
BASE='https://pbr-book.org/4ed/'
def encode(x):return json.dumps(x,ensure_ascii=False,separators=(',',':')).encode()
def canonical(x):return json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def sha(x):return hashlib.sha256(x).hexdigest()
def checked(z,name,checksum):
 raw=core.member(z,name)
 if sha(raw)!=checksum:raise ValueError('첨부 원문 체크섬 불일치: '+name)
 return raw
TABLE_WORDS={'Peak single-precision TFLOPS':'최대 단정밀도 TFLOPS','Peak memory bandwidth':'최대 메모리 대역폭','Concurrently executing threads':'동시에 실행하는 스레드','Maximum available threads':'최대 사용 가능 스레드','thread':'원문 중복 행: thread','(data)':'(데이터)', 'Scene':'장면','Time':'시간','Efficiency':'효율','MSE':'평균제곱오차 (MSE)','Processors':'프로세서 수','Peak TFLOPS':'최대 TFLOPS','Memory Bandwidth':'메모리 대역폭','Memory bandwidth':'메모리 대역폭','Concurrent threads':'동시 스레드','Concurrent Threads':'동시 스레드','Maximum threads':'최대 스레드','Maximum Threads':'최대 스레드','Registers':'레지스터','L1 cache':'L1 캐시','L2 cache':'L2 캐시','L3 cache':'L3 캐시','None':'없음','none':'없음'}
def restore_tables(body):
 """Translate labels only; numeric entries, SVGs and original table stay intact."""
 count=0
 for table in list(body.find_all('table')):
  if table.find_parent(class_='fragmentcode'):continue
  if table.find_parent(['svg']):continue
  original=BeautifulSoup(str(table),'html.parser').table
  for cell in table.select('th,td'):
   if cell.find(['svg','table','code','tt']):
    for textnode in list(cell.find_all(string=True)):
     if textnode.parent.name in ['tt','code'] or textnode.find_parent('svg'):continue
     textnode.replace_with(str(textnode).replace('operations per cycle and thread','주기·스레드당 연산 수'))
    continue
   text=' '.join(cell.get_text(' ',strip=True).split())
   if text in TABLE_WORDS:cell.clear();cell.append(TABLE_WORDS[text]);continue
   mapping=[('Threads per processor','프로세서당 스레드'),('Concurrent threads per processor','프로세서당 동시 스레드'),('Maximum threads per processor','프로세서당 최대 스레드'),('FLOPs per cycle per thread','주기·스레드당 FLOP'),('FLOPs per clock per thread','클록·스레드당 FLOP'),('Register storage','레지스터 저장 공간'),('Memory bandwidth','메모리 대역폭'),('Peak computation','최대 연산량')]
   for a,b in mapping:
    if a.casefold()==text.casefold():cell.clear();cell.append(b);break
  table['class']=table.get('class',[])+['lang-ko','source-data-table']
  original['class']=original.get('class',[])+['lang-en','source-data-table'];table.insert_after(original);count+=1
 return count

def build_chapter(z,ch,stage,target,routes,known):
 data=ROOT/f'translations/pbrt/ch{ch}';manifest=json.loads((data/'source-manifest.json').read_text(encoding='utf8'));provenance=json.loads((data/'figure-provenance.json').read_text(encoding='utf8'))
 assets=stage/('figures'+ch);assets.mkdir()
 # Open each PDF once. Only checked rectangles from the supplied snapshot are used.
 groups=collections.defaultdict(list)
 for f in provenance:groups[f['archive_pdf']].append(f)
 for name,figures in groups.items():
  checksum=figures[0]['pdf_sha256'];raw=checked(z,name,checksum)
  with fitz.open(stream=raw,filetype='pdf') as pdf:
   for f in figures:
    if not re.fullmatch('figure-'+ch+r'-\d+\.png',f['image']):raise ValueError('Unsafe figure name')
    ims=[]
    for part in f['parts']:
     page=pdf[part['page']-1];rect=fitz.Rect(part['rect'])
     if rect.is_empty or not page.rect.contains(rect):raise ValueError('Invalid PDF crop')
     pix=page.get_pixmap(matrix=fitz.Matrix(2,2),clip=rect,alpha=False);ims.append(Image.frombytes('RGB',(pix.width,pix.height),pix.samples))
    im=Image.new('RGB',(max(x.width for x in ims),sum(x.height for x in ims)+12*(len(ims)-1)),'white');y=0
    for p in ims:im.paste(p,((im.width-p.width)//2,y));y+=p.height+12
    im.save(assets/f['image'],compress_level=2)
 results=[];stats=[]
 for key,meta in sorted(manifest.items()):
  src=source_units(checked(z,meta['archive_html'],meta['source_sha256']).decode('utf8'));ko=json.loads((data/f'{key}.ko.json').read_text(encoding='utf8'))
  if sha(canonical(ko))!=meta['canonical_translation_sha256']:raise ValueError('번역 체크섬 불일치: '+key)
  keep=set(ko.get('preserved_reference_ids',[]));ids={u['id'] for u in src['units']}
  if keep&set(ko['translations']) or ids!=set(ko['translations'])|keep or len(ids)!=meta['units']:raise ValueError('Missing/duplicate source units: '+key)
  body=BeautifulSoup('<article>'+''.join(src['tagged_roots'])+'</article>','lxml');code_before=[c.get_text() for c in body.select('.fragmentcode')];lifted=collections.defaultdict(list)
  for caption in list(body.find_all('figcaption')):
   match=re.search(r'Figure\s+'+ch+r'\.(\d+)',caption.get_text(' ',strip=True))
   if not match:continue
   n=match[1];wrapper=caption.find_parent(class_='figure')
   if wrapper is None:raise ValueError('Missing figure wrapper: '+key)
   if not (assets/f'figure-{ch}-{n}.png').exists():raise ValueError('Missing source figure: '+key+'/'+n)
   fig=body.new_tag('figure',attrs={'class':'book-figure','id':f'figure-{ch}-{n}'})
   fig.append(body.new_tag('img',src=f'assets/figure-{ch}-{n}.png',alt=f'그림 {ch}.{n} · 첨부 PDF에 보이는 정적 상태'))
   ancestor=wrapper.find_parent(attrs={'data-tu':True})
   if ancestor:
    fc=body.new_tag('figcaption');fc.string=f'그림 {ch}.{n} · 원문 설명은 앞의 번역 문단에 포함되어 있습니다.';fig.append(fc);lifted[ancestor['data-tu']].append(fig);wrapper.decompose()
   else:fig.append(caption.extract());wrapper.replace_with(fig)
   credit=body.new_tag('p',attrs={'class':'figure-credit'});credit.string='첨부 PDF의 정적 그림입니다. 원문의 탭·슬라이더와 모든 비교 상태를 재현한 것은 아닙니다.';fig.append(credit)
  notes=collections.defaultdict(list)
  for note in ko.get('notes',[]):
   if note['after'] not in ids:raise ValueError('Unknown note target')
   notes[note['after']].append(note)
  fi=0;foot=ko.get('footnotes',[])
  for u in src['units']:
   el=body.select_one('[data-tu="'+u['id']+'"]')
   if el is None:raise ValueError('Missing source DOM node: '+key+'/'+u['id'])
   fc=len(BeautifulSoup(u['original_html'],'lxml').select('.footnote-button'));el['data-source-hash']=u['source_hash'];el['data-translation-state']='reference-preserved' if u['id'] in keep else 'translated'
   if u['id'] not in keep:
    text=ko['translations'][u['id']];pattern=r'\{\{(\d+)\}\}'
    if collections.Counter(re.findall(pattern,text))!=collections.Counter(re.findall(pattern,u['text'])):raise ValueError('Changed math/code tokens: '+key+'/'+u['id'])
    markup=re.sub(pattern,lambda m:u['tokens'][int(m[1])]['html'],html.escape(text));original=''.join(str(c) for c in el.contents);el.clear()
    for cls,lang,value in [('lang-ko','ko',markup),('lang-en','en',original)]:
     span=body.new_tag('span',attrs={'class':cls,'lang':lang});core.add_markup(span,value);el.append(span)
   tail=el
   for fig in lifted[u['id']]:tail.insert_after(fig);tail=fig
   for _ in range(fc):
    if fi>=len(foot):raise ValueError('Missing source footnote: '+key)
    note=body.new_tag('aside',attrs={'class':'translation-footnote'});title=body.new_tag('strong');title.string='원문 주석';note.append(title);note.append(NavigableString(foot[fi]));fi+=1;tail.insert_after(note);tail=note
   for item in notes[u['id']]:
    correction=any(t in item['title'] for t in ['정정','오타','조건','주의','구분'])
    note=body.new_tag('aside',attrs={'class':'translator-note '+('source-correction' if correction else 'beginner')});h4=body.new_tag('h4');h4.string=('정정·조건 역주 · ' if correction else '학습 도움 · ')+item['title'];note.append(h4);p=body.new_tag('p');p.string=item['text'];note.append(p);tail.insert_after(note);tail=note
  if fi!=len(foot):raise ValueError('Unused source footnotes: '+key)
  tables=restore_tables(body)
  if code_before!=[c.get_text() for c in body.select('.fragmentcode')]:raise ValueError('Original code changed: '+key)
  url=urljoin(BASE,meta['path'])
  for link in body.select('a[href]'):
   href=link['href']
   if href.startswith('#'):continue
   dest,frag=urldefrag(urljoin(url,href));page=routes.get(dest.removesuffix('.html'))
   if page:link['href']=page+'.html'+('#'+frag if frag else '')
  core.CHAPTERS.update(CHAPTERS)
  lesson=core.native_lesson(key,body.article,url.removesuffix('.html'),assets,target,known);lesson['prerequisites']=['math-03','math-04','math-06'] if ch!='16' else []
  raw=encode(lesson);file='lessons/'+lesson['id']+'.json';(target/file).write_bytes(raw)
  row={k:lesson[k] for k in ['id','chapter','chapterTitle','title','deck','kind','minutes','sourceSection']};row.update(file=file,sha256=sha(raw),search=[{'id':b['id'],'text':b['text']} for b in lesson['blocks']]);results.append(row)
  stats.append({'page':key,'sourceUnits':len(ids),'translated':len(ko['translations']),'references':len(keep),'footnotes':len(foot),'notes':len(ko.get('notes',[])),'codeBlocks':len(code_before),'tables':tables,'blocks':len(lesson['blocks'])});print('Built',key,len(raw),flush=True)
 return results,stats

def prepare(source,out,existing=None):
 if out.exists():raise ValueError('Output exists; a fresh directory is required.')
 if existing and (not existing.is_dir() or not (existing/'catalog.json').is_file()):raise ValueError('Invalid previous native data')
 out.parent.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory(prefix='.pbrt-final-',dir=out.parent) as tmp:
  stage=Path(tmp);target=stage/'native'
  if existing:
   if any(p.is_symlink() for p in existing.rglob('*')):raise ValueError('Symlink refused')
   shutil.copytree(existing,target)
  else:(target/'lessons').mkdir(parents=True)
  cat=json.loads((target/'catalog.json').read_text(encoding='utf8')) if (target/'catalog.json').exists() else {'schema':1,'bookId':'pbrt-4ed','translationReview':'draft','lessons':[]}
  if cat.get('schema')!=1 or cat.get('bookId')!='pbrt-4ed':raise ValueError('Invalid prior catalog')
  for row in cat['lessons']:
   if row['file']!='lessons/'+row['id']+'.json' or sha((target/row['file']).read_bytes())!=row['sha256']:raise ValueError('Prior lesson checksum mismatch')
   if row['chapter'] in CHAPTERS:raise ValueError('Chapters 13–16 already exist; refusing to replace')
  routes={};known={r['id'].removeprefix('translation-') for r in cat['lessons']}
  for ch in CHAPTERS:
   m=json.loads((ROOT/f'translations/pbrt/ch{ch}/source-manifest.json').read_text(encoding='utf8'))
   routes.update({urljoin(BASE,v['path']).removesuffix('.html'):k for k,v in m.items()});known.update(m)
  report=[]
  with core.safe_zip(source) as archive:
   for ch in CHAPTERS:
    rows,stats=build_chapter(archive,ch,stage,target,routes,known);cat['lessons'].extend(rows);report.extend(stats)
  def order(row):
   k=row['id'].removeprefix('translation-');return(int(k[:2]),int(k[3:]) if k[3:].isdigit() else 90 if k.endswith('reading') else 99)
  cat['lessons'].sort(key=order)
  if len({r['id'] for r in cat['lessons']})!=len(cat['lessons']):raise ValueError('Duplicate lesson IDs')
  (target/'catalog.json').write_bytes(encode(cat));(target/'chapter-13-16-report.json').write_text(json.dumps({'pages':report,'independentExpertReview':False,'appendicesTranslated':False},ensure_ascii=False,indent=2),encoding='utf8');target.rename(out)
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--source',required=True,type=Path);p.add_argument('--existing-native',type=Path);p.add_argument('--out',required=True,type=Path);a=p.parse_args()
 try:prepare(a.source.resolve(),a.out.absolute(),a.existing_native.resolve() if a.existing_native else None)
 except (ValueError,OSError,KeyError,TypeError) as e:p.exit(1,str(e)+'\n')
