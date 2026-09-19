"""Render supplied-source translations. Local only: never fetches book text."""
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString
import json,copy,re,html,shutil,hashlib
from urllib.parse import urljoin,urldefrag,urlparse
import argparse, tempfile, zipfile, collections, sys
import fitz
parser=argparse.ArgumentParser(description='Build the chapter 10 reader from the supplied PBRT source ZIP. No network requests.')
parser.add_argument('archive',type=Path)
parser.add_argument('--out',type=Path,default=Path('build/pbrt-ch10'))
args=parser.parse_args()
TARGET=args.out.expanduser().resolve()
if TARGET.exists(): parser.error('Output already exists; choose a new directory to preserve existing files.')
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'translations/pbrt/ch10'
BASE=Path(__file__).resolve().parent/'reader-shell'
MANIFEST=json.loads((DATA/'source-manifest.json').read_text(encoding='utf8'))
PROVENANCE=json.loads((DATA/'figure-provenance.json').read_text(encoding='utf8'))
TEMP=tempfile.TemporaryDirectory(prefix='pbrt-build-')
O=Path(TEMP.name);OUT=O/'release/reader/ch10';OUT.mkdir(parents=True)
(O/'figures').mkdir()
def canonical(value):
    return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def source_units(source):
    soup=BeautifulSoup(source,'lxml');roots=soup.select('.pretext-layout-root');units=[]
    norm=lambda text:re.sub(r'\s+',' ',text).strip()
    for root in roots:
        for el in root.select('h1,h2,h3,h4,p,li,figcaption'):
            if el.find_parent(['p','li','figcaption']) or el.find_parent(class_='fragmentcode'):continue
            if not norm(el.get_text(' ',strip=True)):continue
            uid=f'u{len(units):04d}';el['data-tu']=uid;clone=copy.deepcopy(el);tokens=[]
            for t in list(clone.find_all(['svg','tt','code','a','span'])):
                if clone not in t.parents:continue
                if not (t.name in ['svg','tt','code','a'] or 'fragmentname' in t.get('class',[])):continue
                if t.find_parent(['svg','tt','code','a']) is not None:continue
                if not norm(t.get_text()):continue
                label=t.find('title').get_text() if t.name=='svg' and t.find('title') else t.get_text(' ',strip=True)
                tokens.append({'html':str(t),'label':norm(label)})
                t.replace_with(NavigableString('{{'+str(len(tokens)-1)+'}}'))
            text=norm(clone.get_text(' ',strip=True))
            units.append({'id':uid,'tag':el.name,'text':text,'tokens':tokens,'original_html':str(el),'source_hash':hashlib.sha256(text.encode()).hexdigest()})
    return {'title':soup.title.get_text() if soup.title else '', 'units':units,'tagged_roots':[str(r) for r in roots]}
with zipfile.ZipFile(args.archive) as archive:
    if len(archive.namelist())!=len(set(archive.namelist())):raise ValueError('Duplicate ZIP entries are not accepted.')
    def checked_member(name,sha):
        info=archive.getinfo(name)
        if info.file_size>100_000_000:raise ValueError('Source member exceeds size limit: '+name)
        raw=archive.read(info)
        if hashlib.sha256(raw).hexdigest()!=sha:raise ValueError('Source snapshot differs: '+name)
        return raw
    for key,meta in MANIFEST.items():
        raw=checked_member(meta['archive_html'],meta['source_sha256'])
        src=source_units(raw.decode('utf8'))
        src.update(path=meta['path'],source_sha256=meta['source_sha256'])
        ko=json.loads((DATA/(key+'.ko.json')).read_text(encoding='utf8'))
        if hashlib.sha256(canonical(ko)).hexdigest()!=meta['canonical_translation_sha256']:raise ValueError('Translation differs from reviewed snapshot: '+key)
        ids={u['id'] for u in src['units']};kept=set(ko.get('preserved_reference_ids',[]))
        if len(ids)!=meta['units'] or ids!=set(ko['translations'])|kept:raise ValueError('Translation unit coverage mismatch: '+key)
        for u in src['units']:
            if u['id'] in kept:continue
            expected=collections.Counter(re.findall(r'\{\{(\d+)\}\}',u['text']))
            actual=collections.Counter(re.findall(r'\{\{(\d+)\}\}',ko['translations'][u['id']]))
            if expected!=actual:raise ValueError('Inline token mismatch: '+key+'/'+u['id'])
        (O/(key+'.source.json')).write_text(json.dumps(src,ensure_ascii=False),encoding='utf8')
        (O/(key+'.ko.json')).write_text(json.dumps(ko,ensure_ascii=False),encoding='utf8')
    for meta in MANIFEST.values():
        name=Path(meta['archive_pdf']).name
        crops=[p for p in PROVENANCE if p['pdf']==name]
        if not crops:continue
        raw=checked_member(meta['archive_pdf'],meta['pdf_sha256'])
        with fitz.open(stream=raw,filetype='pdf') as doc:
            for f in crops:
                doc[f['page']-1].get_pixmap(matrix=fitz.Matrix(2.4,2.4),clip=fitz.Rect(f['rect']),alpha=False).save(O/'figures'/f['image'])
KEYS=['10-00','10-01','10-02','10-03','10-04','10-05','10-reading','10-exercises']
TITLES=['텍스처와 재질','텍스처 샘플링과 안티앨리어싱','텍스처 좌표 생성','텍스처 인터페이스와 기본 텍스처','이미지 텍스처','재질 인터페이스와 구현','추가 읽기와 참고문헌','연습문제']
SOURCES={key:json.loads((O/(key+'.source.json')).read_text(encoding='utf8')) for key in KEYS}
URLS={urljoin('https://pbr-book.org/4ed/',v['path']).removesuffix('.html'):key+'.html' for key,v in SOURCES.items()}
shutil.copytree(BASE/'assets',OUT/'assets',dirs_exist_ok=True)
for p in (OUT/'assets').glob('figure-9-*.png'):p.unlink()
(OUT/'assets/distributions-teaching.svg').unlink(missing_ok=True)
for p in (O/'figures').glob('*.png'):shutil.copy2(p,OUT/'assets'/p.name)
css=(BASE/'assets/reader.css').read_text(encoding='utf8')+'''\n.translation .pretext-layout-root{max-width:100%;min-width:0;width:auto}.translation .row{display:block;max-width:100%}.translation .displaymath{overflow:auto;white-space:nowrap}.translation [data-tu]{scroll-margin-top:90px}.source-reference{font-size:13px;line-height:1.8;color:var(--muted)}.chapter-switch{display:block;margin:15px 0;font-size:12px}.translation .footnote-button{border:0;padding:0;background:transparent}.translation-footnote strong{display:block}.translation .fragmentname .fragmentname{display:inline;border:0;padding:0;background:none}.translation figure .translator-note{display:block}.translation .book-figure [data-tu]{margin:15px 0 0}.translation .source-math{max-width:100%;height:auto}.translation .displaymath .source-math{max-width:none}.translation .displaymath span{white-space:normal}.translation p{word-break:keep-all;overflow-wrap:anywhere}\n'''
(OUT/'assets/reader.css').write_text(css,encoding='utf8')
js=(BASE/'assets/reader.js').read_text(encoding='utf8').replace('pbrt-uploaded-ch09-v1:','pbrt-uploaded-ch10-v1:').replace('/translation/ch09/','/translation/ch10/')
(OUT/'assets/reader.js').write_text(js,encoding='utf8')
search=[];counts=[]
def append_html(el,s):
 f=BeautifulSoup(s,'html.parser')
 for n in list(f.contents):el.append(n)
def translate_unit(u,k):
 text=k['translations'][u['id']]
 return re.sub(r'\{\{(\d+)\}\}',lambda m:u['tokens'][int(m[1])]['html'],html.escape(text))
def shell(key,title):
 s=BeautifulSoup((BASE/'template.html').read_text(encoding='utf8'),'lxml')
 s.title.string=f'{title} · PBRT 10장 한국어 본문';s.body['data-page']=key
 s.select_one('.eyebrow').string='CHAPTER 10';s.select_one('.sidebar h2').string='텍스처와 재질'
 s.select_one('.toc-home').string='10장 소개 · 번역 범위'
 toc=s.select_one('.chapter-toc');toc.clear();toc['aria-label']='10장 목차'
 for i,(k,t) in enumerate(zip(KEYS,TITLES)):
  a=s.new_tag('a',href=k+'.html',attrs={'class':'toc-link'+(' active' if k==key else '')})
  if k==key:a['aria-current']='page'
  a.append(s.new_tag('span'));a.span.string=('10장' if i==0 else f'10.{i}' if i<6 else '더 읽기' if i==6 else '연습')
  b=s.new_tag('b');b.string=t;a.append(b);toc.append(a)
 s.select_one('#q')['placeholder']='텍스처, 미분, 노멀…'
 art=s.select_one('#article');art.clear()
 outline=s.select_one('.section-outline');outline.clear();summary=s.new_tag('summary');summary.string='이 절 안에서 이동';outline.append(summary)
 footer=s.select_one('.page-footer');footer.clear()
 for n in list(s.select('.end-notice')):n.decompose()
 notice=s.new_tag('p',attrs={'class':'end-notice'});notice.string='Matt Pharr, Wenzel Jakob, Greg Humphreys · Physically Based Rendering, 4th ed. 첨부 원문을 기반으로 한 개인 학습 번역입니다. 원문 코드·수식과 학습 도움·정정 역주를 구분합니다. 모든 문장에 대한 독립 전문 감수가 완료된 것은 아닙니다.';art.parent.append(notice)
 return s
def finalize(s,key):
 for e in s.select('#article .lang-ko [id]'):
  if e.name!='svg' and e.find_parent('svg') is None:e.attrs.pop('id',None)
 for i,svg in enumerate(s.select('#article svg')):
  ids={el['id']:f'{key}-svg{i}-{el["id"]}' for el in svg.find_all(attrs={'id':True})}
  if svg.get('id'):ids[svg['id']]=f'{key}-svg{i}-{svg["id"]}'
  for el in [svg,*svg.find_all()]:
   if el.get('id') in ids:el['id']=ids[el['id']]
   for a in ['href','xlink:href']:
    if el.get(a,'').startswith('#') and el[a][1:] in ids:el[a]='#'+ids[el[a][1:]]
   if el.get('aria-labelledby'):el['aria-labelledby']=' '.join(ids.get(x,x) for x in el['aria-labelledby'].split())
  svg['class']=['source-math'];svg['focusable']='false'
 for el in list(s.select('#article script,#article style,#article iframe,#article object,#article embed')):el.decompose()
 for el in s.select('#article *'):
  for attr in list(el.attrs):
   if attr.lower().startswith('on'):del el[attr]
  if el.name not in ['svg','path','g','use','rect','line','polyline','polygon','circle','text'] and el.has_attr('style'):del el['style']
  if el.name=='a':
   href=el.get('href','')
   if not href:continue
   if href.lower().startswith(('javascript:','data:','file:')):el.attrs.pop('href',None);continue
   if href.startswith('#'):continue
   base=urljoin('https://pbr-book.org/4ed/',SOURCES[key]['path']);url=urljoin(base,href);bare,frag=urldefrag(url)
   target=URLS.get(bare.removesuffix('.html'))
   el['href']=target+('#'+frag if frag else '') if target else url
   if not target:el['target']='_blank';el['rel']='noopener noreferrer'
 seen_ids=set()
 for e in s.select('[id]'):
  ident=e['id']
  if ident in seen_ids:
   n=2
   while f'{ident}-duplicate-{n}' in seen_ids:n+=1
   e['id']=f'{ident}-duplicate-{n}'
  seen_ids.add(e['id'])
 for a in s.select('#article a.codecarat'):
  a['aria-label']='참조 코드 펼치기';a['aria-expanded']='false'
 return str(s)
for key,title in zip(KEYS,TITLES):
 src=SOURCES[key]; ko=json.loads((O/(key+'.ko.json')).read_text(encoding='utf8'));s=shell(key,title);art=s.select_one('#article')
 body=BeautifulSoup(''.join(src['tagged_roots']),'lxml')
 preserved=set(ko.get('preserved_reference_ids',[]));foot=ko.get('footnotes',[]);foot_index=0
 note_by={}
 for note in ko.get('notes',[]):note_by.setdefault(note['after'],[]).append(note)
 for u in src['units']:
  el=body.select_one('[data-tu="'+u['id']+'"]')
  if el is None:raise ValueError(('missing source node',key,u['id']))
  marker=body.new_tag('span',attrs={'class':'unit-anchor','id':'tu-'+u['id']});el.insert_before(marker)
  foot_in=list(el.select('.footnote-button'))
  el['data-source-hash']=u['source_hash']
  el['data-translation-state']='reference-preserved' if u['id'] in preserved else 'translated'
  if u['id'] not in preserved:
   original=''.join(str(c) for c in el.contents)
   el.clear();kr=body.new_tag('span',attrs={'class':'lang-ko','lang':'ko'});append_html(kr,translate_unit(u,ko));en=body.new_tag('span',attrs={'class':'lang-en','lang':'en'});append_html(en,original);el.append(kr);el.append(en)
   for b in el.select('.footnote-button'):b['class']=['footnote-marker'];b['title']='원문 주석: 아래 상자 참고';b['aria-label']='원문 주석'
   search.append({'page':key+'.html','anchor':'tu-'+u['id'],'title':title,'text':kr.get_text(' ',strip=True)})
  else:el['class']=el.get('class',[])+['source-reference']
  tail=el
  for b in foot_in:
   if foot_index>=len(foot):raise ValueError(('missing footnote',key))
   note=body.new_tag('aside',attrs={'class':'translation-footnote'});strong=body.new_tag('strong');strong.string='원문 주석 '+str(foot_index+1);note.append(strong);note.append(NavigableString(foot[foot_index]));tail.insert_after(note);tail=note;foot_index+=1
  for n in note_by.get(u['id'],[]):
   correction=any(x in n['title'] for x in ['정정','오타','주의','조건','비율 방향','구분'])
   note=body.new_tag('aside',attrs={'class':'translator-note '+('source-correction' if correction else 'beginner')})
   label=body.new_tag('div',attrs={'class':'note-label'});label.string='정정·적용 조건 역주' if correction else '초보자 학습 도움';note.append(label)
   h=body.new_tag('h4');h.string=n['title'];note.append(h);p=body.new_tag('p');p.string=n['text'];note.append(p);tail.insert_after(note);tail=note
 if foot_index!=len(foot):raise ValueError(('unused footnotes',key))
 for cap in list(body.find_all('figcaption')):
  u=next((u for u in src['units'] if u['id']==cap.get('data-tu')),None)
  if not u:continue
  num=int(re.search(r'Figure\s+10\.(\d+)',u['text'])[1]);parent=cap.find_parent(class_='figure')
  if not parent:raise ValueError(('figure wrapper',key,num))
  fig=body.new_tag('figure',attrs={'class':'book-figure','id':f'figure-10-{num}'})
  im=body.new_tag('img',src=f'assets/figure-10-{num}.png',attrs={'class':'restored-figure','alt':f'그림 10.{num}: 첨부 원문 PDF의 정적 화면','loading':'lazy'});fig.append(im)
  cap.extract();anchor=body.new_tag('span',attrs={'class':'unit-anchor','id':'tu-'+u['id']});fig.append(anchor);fig.append(cap)
  credit=body.new_tag('p',attrs={'class':'figure-credit'});credit.string='첨부 원문 PDF에서 추출한 정적 화면입니다. 대화형 그림의 다른 보기·확대 기능은 포함하지 않습니다.';fig.append(credit)
  for n in list(parent.select('.translator-note')):fig.append(n.extract())
  parent.replace_with(fig)
 for b in list(body.select('button.yojeri')):b.decompose()
 for root in body.select('.pretext-layout-root'):
  for c in list(root.contents):art.append(c.extract())
 for i,h in enumerate(art.find_all(['h3','h4'])):
  if h.find_parent(class_='translator-note'):continue
  sid=f'sub-{i}';h['id']=sid;a=s.new_tag('a',href='#'+sid);a.string=h.select_one('.lang-ko').get_text(' ',strip=True) if h.select_one('.lang-ko') else h.get_text(' ',strip=True);s.select_one('.section-outline').append(a)
 s.select_one('.source-link')['href']=urljoin('https://pbr-book.org/4ed/',src['path']).removesuffix('.html')
 idx=KEYS.index(key)
 for k,t in [(KEYS[idx-1],TITLES[idx-1])] if idx else []:
  a=s.new_tag('a',href=k+'.html');a.string='← '+t;s.select_one('.page-footer').append(a)
 if idx<len(KEYS)-1:
  a=s.new_tag('a',href=KEYS[idx+1]+'.html');a.string=TITLES[idx+1]+' →';s.select_one('.page-footer').append(a)
 text=finalize(s,key);(OUT/(key+'.html')).write_text(text,encoding='utf8')
 counts.append({'page':key,'text_units':len(src['units']),'translated':len(ko['translations']),'references_preserved':len(preserved),'source_footnotes':len(foot),'editor_notes':len(ko.get('notes',[])),'source_sha256':src['source_sha256']})
s=shell('index','텍스처와 재질 · 10장 번역');s.select_one('.section-outline').decompose();s.select_one('.source-link')['href']='https://pbr-book.org/4ed/Textures_and_Materials';art=s.select_one('#article')
append_html(art,'<section class="intro"><div class="eyebrow">SOURCE-ALIGNED TRANSLATION / 10</div><h1>무늬에서 재질까지.</h1><p class="lead">원문 문단·수식·코드에 대응하는 한국어 본문입니다. 필요한 기초 설명과 원문의 표기 문제는 별도 상자에 담았습니다.</p><a class="start-button" href="10-00.html">10장 읽기 시작 →</a></section><div class="scope-stats"><div><strong>10.1—10.5</strong><span>전체 절 · 도입부 포함</span></div><div><strong>373 + 5</strong><span>본문 단위 + 원문 주석</span></div><div><strong>24</strong><span>첨부 PDF 그림</span></div></div><div class="scope-card"><h2>이번 번역 범위</h2><p>10장 도입부와 10.1~10.5, 추가 읽기 설명, 연습문제를 번역했습니다. 참고문헌 103개 항목은 문헌 검색을 위해 원어로 보존했습니다. 1~8장 전체 검수와 11~16장·부록 번역은 이 결과물의 완료 범위에 포함되지 않습니다.</p><p>번역 초안의 문단·토큰 누락과 렌더링을 검사했으나, 독립 전문 감수 완료를 의미하지 않습니다.</p></div>')
for key,title in zip(KEYS,TITLES):append_html(art,f'<a class="chapter-item" href="{key}.html"><span>{html.escape(key)}</span><div><h3>{html.escape(title)}</h3><p>한국어 · 첨부 영문 · 한/영 대조</p></div><b>→</b></a>')
(OUT/'index.html').write_text(str(s),encoding='utf8');(OUT/'assets/search-index.js').write_text('window.PBRT_TRANSLATION_SEARCH='+json.dumps(search,ensure_ascii=False)+';',encoding='utf8')
(O/'release/coverage.json').write_text(json.dumps({'chapter':10,'pages':counts,'source':'user-supplied archive','translated_units':sum(c['translated'] for c in counts),'footnotes':sum(c['source_footnotes'] for c in counts),'references_preserved':sum(c['references_preserved'] for c in counts),'notes':sum(c['editor_notes'] for c in counts),'review':'source-aligned-translation-draft; no independent expert review'},ensure_ascii=False,indent=2),encoding='utf8')
shutil.copy2(O/'release/coverage.json',OUT/'coverage.json')
TARGET.parent.mkdir(parents=True,exist_ok=True)
shutil.copytree(OUT,TARGET)
TEMP.cleanup()
print('Built chapter 10:', TARGET)
