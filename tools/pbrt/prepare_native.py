#!/usr/bin/env python3
"""Build native study lessons from the user-supplied source and prior translations.
No network requests. Original app data/notes are never changed. Generated files
are installed atomically; an existing different output is backed up with --replace.
"""
from __future__ import annotations
import argparse, collections, copy, hashlib, html, json, re, shutil, tempfile, zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from urllib.parse import urljoin, urlsplit, unquote
from bs4 import BeautifulSoup, NavigableString, Tag
import fitz
from PIL import Image
from source_units import source_units
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'translations/pbrt/ch11'
NAMES={'11-00':'Volume_Scattering','11-01':'Volume_Scattering_Processes','11-02':'Transmittance','11-03':'Phase_Functions','11-04':'Media','11-reading':'Further_Reading','11-exercises':'Exercises'}
CHAPTERS={'09':'반사 모델','10':'텍스처와 재질','11':'볼륨 산란'}
BASE_URL='https://pbr-book.org/4ed/'
SCHEMA=1

def digest(raw:bytes)->str:return hashlib.sha256(raw).hexdigest()
def dump(obj):return json.dumps(obj,ensure_ascii=False,separators=(',',':'))
def canonical(obj):return json.dumps(obj,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def member(z:zipfile.ZipFile,name:str)->bytes:
    info=z.getinfo(name)
    if info.file_size>60_000_000:raise ValueError('Oversized source member: '+name)
    return z.read(info)
def safe_zip(path):
    z=zipfile.ZipFile(path)
    names=z.namelist()
    if len(names)!=len(set(names)) or len(names)>5000:raise ValueError('Duplicate/excessive ZIP entries')
    if sum(x.file_size for x in z.infolist())>1_500_000_000:raise ValueError('Oversized ZIP')
    return z

def add_markup(tag,markup):
    fragment=BeautifulSoup(markup,'html.parser')
    for child in list(fragment.contents):tag.append(child)

def build_ch11(source_archive:Path,stage:Path):
    """Return source-aligned HTML articles and locally restored figure images."""
    manifest=json.loads((DATA/'source-manifest.json').read_text(encoding='utf8'))
    provenance=json.loads((DATA/'figure-provenance.json').read_text(encoding='utf8'))
    articles={};figures=stage/'figures11';figures.mkdir()
    with safe_zip(source_archive) as z:
        for figure in provenance:
            images=[]
            for part in figure['parts']:
                meta=next(x for x in manifest.values() if Path(x['archive_pdf']).name==part['pdf'])
                raw=member(z,meta['archive_pdf'])
                if digest(raw)!=meta['pdf_sha256']:raise ValueError('PDF snapshot differs: '+part['pdf'])
                with fitz.open(stream=raw,filetype='pdf') as pdf:
                    p=pdf[part['page']-1];rect=fitz.Rect(part['rect'])
                    if not p.rect.contains(rect):raise ValueError('Invalid figure rectangle')
                    pix=p.get_pixmap(matrix=fitz.Matrix(2.4,2.4),clip=rect,alpha=False)
                    images.append(Image.frombytes('RGB',(pix.width,pix.height),pix.samples))
            result=Image.new('RGB',(max(i.width for i in images),sum(i.height for i in images)+16*(len(images)-1)),'white');y=0
            for image in images:result.paste(image,((result.width-image.width)//2,y));y+=image.height+16
            result.save(figures/figure['image'])
        for key,name in NAMES.items():
            meta=manifest[key];raw=member(z,meta['archive_html'])
            if digest(raw)!=meta['source_sha256']:raise ValueError('HTML snapshot differs: '+key)
            source=source_units(raw.decode('utf8'))
            ko=json.loads((DATA/(key+'.ko.json')).read_text(encoding='utf8'))
            if digest(canonical(ko))!=meta['canonical_translation_sha256']:raise ValueError('Translation snapshot differs: '+key)
            keep=set(ko.get('preserved_reference_ids',[]));units=source['units'];ids={u['id'] for u in units}
            if ids!=set(ko['translations'])|keep or len(ids)!=meta['units']:raise ValueError('Missing/extra units: '+key)
            body=BeautifulSoup('<article>'+''.join(source['tagged_roots'])+'</article>','lxml')
            # Lift figures nested in a translation unit before replacing that unit.
            nested={}
            for caption in list(body.find_all('figcaption')):
                number=re.search(r'Figure\s+11\.(\d+)',caption.get_text(' ',strip=True))
                if not number:continue
                n=int(number[1]);wrapper=caption.find_parent(class_='figure')
                if wrapper is None:raise ValueError('Missing figure wrapper')
                fig=body.new_tag('figure',attrs={'class':'book-figure','id':f'figure-11-{n}'})
                im=body.new_tag('img',src=f'assets/figure-11-{n}.png',alt=f'그림 11.{n}: 첨부 PDF의 해당 그림',loading='lazy')
                fig.append(im)
                parent_unit=wrapper.find_parent(attrs={'data-tu':True})
                if parent_unit:
                    label=body.new_tag('figcaption');label.string=f'그림 11.{n} · 설명은 앞의 번역 문단에 포함되어 있습니다.';fig.append(label)
                    nested.setdefault(parent_unit['data-tu'],[]).append(fig)
                    wrapper.decompose()
                else:
                    fig.append(caption.extract());wrapper.replace_with(fig)
                credit=body.new_tag('p',attrs={'class':'figure-credit'});credit.string='첨부 PDF에서 복원한 그림. 여러 페이지로 나뉜 비교 그림은 원래 순서대로 함께 표시합니다. 대화형 조작은 포함하지 않습니다.';fig.append(credit)
            notes=collections.defaultdict(list)
            for note in ko.get('notes',[]):notes[note['after']].append(note)
            footnotes=ko.get('footnotes',[]);foot_index=0
            for unit in units:
                el=body.select_one('[data-tu="'+unit['id']+'"]')
                if el is None:raise ValueError('Missing DOM unit: '+key+'/'+unit['id'])
                foot_count=len(BeautifulSoup(unit['original_html'],'lxml').select('.footnote-button'))
                el['data-source-hash']=unit['source_hash'];el['data-translation-state']='reference-preserved' if unit['id'] in keep else 'translated'
                if unit['id'] not in keep:
                    translated=ko['translations'][unit['id']]
                    if collections.Counter(re.findall(r'\{\{(\d+)\}\}',translated))!=collections.Counter(re.findall(r'\{\{(\d+)\}\}',unit['text'])):raise ValueError('Changed math/code tokens: '+key+'/'+unit['id'])
                    rendered=re.sub(r'\{\{(\d+)\}\}',lambda m:unit['tokens'][int(m[1])]['html'],html.escape(translated))
                    original=''.join(str(c) for c in el.contents);el.clear()
                    for cls,lang,markup in [('lang-ko','ko',rendered),('lang-en','en',original)]:
                        span=body.new_tag('span',attrs={'class':cls,'lang':lang});add_markup(span,markup);el.append(span)
                tail=el
                for fig in nested.get(unit['id'],[]):tail.insert_after(fig);tail=fig
                for _ in range(foot_count):
                    if foot_index>=len(footnotes):raise ValueError('Missing footnote: '+key)
                    note=body.new_tag('aside',attrs={'class':'translation-footnote'});title=body.new_tag('strong');title.string='원문 주석';note.append(title);note.append(NavigableString(footnotes[foot_index]));foot_index+=1
                    tail.insert_after(note);tail=note
                for item in notes[unit['id']]:
                    correction=any(s in item['title'] for s in ['정정','조건','주의','구분'])
                    note=body.new_tag('aside',attrs={'class':'translator-note '+('source-correction' if correction else 'beginner')})
                    h=body.new_tag('h4');h.string=('정정·조건 역주 · ' if correction else '학습 도움 · ')+item['title'];note.append(h)
                    p=body.new_tag('p');p.string=item['text'];note.append(p);tail.insert_after(note);tail=note
            if foot_index!=len(footnotes):raise ValueError('Unused source footnotes: '+key)
            source_url=urljoin(BASE_URL,meta['path'].removesuffix('.html'))
            before=BeautifulSoup(''.join(source['tagged_roots']),'lxml').select('.fragmentcode')
            after=body.select('.fragmentcode')
            if [c.get_text() for c in before]!=[c.get_text() for c in after]:raise ValueError('Changed original code: '+key)
            articles[key]=(body.article,source_url,figures,meta)
    return articles

HTML_TAGS=set('p div span h1 h2 h3 h4 h5 h6 a code tt pre b strong i em u s sub sup br hr ul ol li dl dt dd figure figcaption aside blockquote table thead tbody tr th td details summary img'.split())
SVG_TAGS=set('svg g path use defs title desc rect line polygon polyline circle ellipse text tspan clippath'.split())
DROP=set('script style iframe object embed form input button textarea select option link meta base foreignobject animate animatetransform set audio video source'.split())
SVG_ATTRS=set('xmlns xmlns:xlink viewbox width height x y x1 y1 x2 y2 cx cy r rx ry d points transform fill stroke stroke-width stroke-linecap stroke-linejoin fill-rule clip-rule preserveaspectratio'.split())

def clean_tree(soup:BeautifulSoup,prefix:str,asset_root:Path,chapter:str,page:str,out:Path,source_url:str,known_pages:set[str]):
    """Sanitize HTML, disambiguate IDs, and rewrite local assets/internal routes."""
    for tag in list(soup.find_all()):
        if tag.parent is None:continue
        name=tag.name.lower()
        if name in ['html','body']:continue
        if name in DROP:tag.decompose();continue
        if name not in HTML_TAGS|SVG_TAGS:tag.unwrap();continue
        is_svg=name in SVG_TAGS or tag.find_parent('svg') is not None
        attrs={}
        for key,value in tag.attrs.items():
            k=key.lower()
            if k in ['id','class','title','lang','role','aria-label','aria-labelledby','aria-hidden','aria-expanded','aria-controls','data-tu','data-source-hash','data-translation-state'] or (is_svg and k in SVG_ATTRS):attrs[key]=value
            elif k in ['href','xlink:href','src','alt','loading','colspan','rowspan']:attrs[key]=value
            elif k=='style' and is_svg and re.fullmatch(r'vertical-align:\s*-?[\d.]+(?:ex|em|px);?',str(value)):attrs[key]=value
        tag.attrs=attrs
    for i,svg in enumerate(soup.find_all('svg')):
        ids={e['id']:f'{prefix}svg{i}-{e["id"]}' for e in svg.find_all(attrs={'id':True})}
        for e in [svg,*svg.find_all()]:
            if e.get('id') in ids:e['id']=ids[e['id']]
            for attr in ['href','xlink:href']:
                h=e.get(attr,'')
                if h.startswith('#') and h[1:] in ids:e[attr]='#'+ids[h[1:]]
            if e.get('aria-labelledby'):e['aria-labelledby']=' '.join(ids.get(x,x) for x in e['aria-labelledby'].split())
    seen=set();anchor_map={}
    for e in soup.find_all(attrs={'id':True}):
        if e.name=='svg' or e.find_parent('svg'):continue
        old=e['id'];base=prefix+old;new=base;i=1
        while new in seen:i+=1;new=base+'-duplicate-'+str(i)
        seen.add(new);anchor_map.setdefault(old,new);e['id']=new
    for image in soup.find_all('img'):
        raw=image.get('src','');p=PurePosixPath(unquote(raw));parts=p.parts
        if raw.startswith(('https:','http:','data:','//')) or '..' in parts:raise ValueError('Unexpected image source: '+raw)
        local=asset_root/Path(*parts[1:]) if parts and parts[0]=='assets' else asset_root/Path(*parts)
        local=local.resolve()
        if not local.is_relative_to(asset_root.resolve()) or not local.is_file():raise ValueError('Missing figure: '+str(local))
        suffix=local.suffix.lower()
        if suffix not in ['.png','.jpg','.jpeg','.svg','.webp']:raise ValueError('Unsupported figure type')
        dest=out/'assets'/chapter/local.name;dest.parent.mkdir(parents=True,exist_ok=True)
        if dest.exists() and digest(dest.read_bytes())!=digest(local.read_bytes()):raise ValueError('Asset collision')
        if suffix=='.svg':
            svg=BeautifulSoup(local.read_text(encoding='utf8'),'xml')
            if svg.find(['script','foreignObject']) or re.search(r'\son\w+\s*=',str(svg)):raise ValueError('Unsafe external SVG')
        shutil.copy2(local,dest)
        image['src']=f'books/pbrt-4ed/native/assets/{chapter}/{local.name}';image['loading']='lazy';image.attrs.pop('width',None);image.attrs.pop('height',None)
        if suffix!='.svg':
            with Image.open(local) as size_image:image['width']=str(size_image.width);image['height']=str(size_image.height)
    for a in soup.find_all(['a','use']):
        attr='href' if a.has_attr('href') else 'xlink:href' if a.has_attr('xlink:href') else None
        if not attr:continue
        href=a[attr]
        if not isinstance(href,str) or re.search(r'[\x00-\x20]',href):a.attrs.pop(attr,None);continue
        if a.name=='use':
            if not href.startswith('#'):a.attrs.pop(attr,None)
            continue
        if href.startswith('#'):a[attr]='#'+anchor_map.get(unquote(href[1:]),prefix+unquote(href[1:]));continue
        parts=urlsplit(href);file=Path(parts.path).name
        stem=file.removesuffix('.html')
        if not parts.scheme and stem in known_pages:
            fragment='#tx'+stem+'--'+unquote(parts.fragment) if parts.fragment else ''
            a[attr]='?book=pbrt-4ed&sec=translation-'+stem+fragment
        else:
            absolute=urljoin(source_url+'.html',href)
            if urlsplit(absolute).scheme not in ['https','http']:a.attrs.pop(attr,None);continue
            a[attr]=absolute;a['target']='_blank';a['rel']='noopener noreferrer'
    for a in soup.select('a.codecarat'):
        a['aria-label']='참조 코드 펼치기';a['aria-expanded']='false'
        if a.get('href','').startswith('#'):a['aria-controls']=a['href'][1:]
    return soup

def boundaries(node):
    for child in list(node.children):
        if not isinstance(child,Tag):continue
        classes=set(child.get('class',[]))
        if child.name in {'p','h1','h2','h3','h4','h5','h6','ul','ol','dl','figure','aside','blockquote','table','pre','details'} or classes & {'displaymath','fragmentname','fragmentcode'}:
            if child.get_text(strip=True) or child.find(['img','svg']):yield child
        elif child.name=='span' and child.get('id'):yield child
        else:yield from boundaries(child)

def native_lesson(page,article,source_url,assets,out,known_pages):
    ch=page[:2];prefix='tx'+page+'--'
    before_code=[c.get_text() for c in article.select('.fragmentcode')]
    raw=BeautifulSoup(str(article),'lxml')
    clean_tree(raw,prefix,assets,ch,page,out,source_url,known_pages)
    art=raw.find('article') or raw.body
    title_tag=art.find(['h1','h2']);title=(title_tag.select_one('.lang-ko') or title_tag).get_text(' ',strip=True) if title_tag else page
    if page.endswith('reading'):title='추가 읽기와 참고문헌'
    if page.endswith('exercises'):title='연습문제'
    blocks=[];seen=set()
    for idx,node in enumerate(boundaries(art)):
        u=node.get('data-tu') or (node.select_one('[data-tu]') or {}).get('data-tu')
        block_id=prefix+(u or 'b'+str(idx+1));unique=block_id;n=1
        while unique in seen:n+=1;unique=block_id+'-'+str(n)
        seen.add(unique)
        for e in [node,*node.select('[data-tu]')]:
            if e.get('data-tu') and not e.get('id'):e['id']=prefix+e['data-tu']+'-source'
        text=node.get_text(' ',strip=True)
        role='note' if 'translator-note' in node.get('class',[]) else 'body'
        block={'type':'rich','id':unique,'html':str(node),'text':text,'role':role}
        if node.name in ['h1','h2','h3','h4']:
            block['heading']=(node.select_one('.lang-ko') or node).get_text(' ',strip=True)
        blocks.append(block)
    after_code=[c.get_text() for block in blocks for c in BeautifulSoup(block['html'],'lxml').select('.fragmentcode')]
    if before_code!=after_code:raise ValueError('Code blocks changed during native import: '+page)
    if not blocks:raise ValueError('Empty native lesson')
    lesson={'id':'translation-'+page,'chapter':str(int(ch)),'chapterTitle':CHAPTERS[ch],'title':title,
      'deck':page.replace('-','.')+' · 첨부 원문 대응 번역 본문', 'kind':'translation','sourceSection':str(int(ch))+'.'+str(int(page[3:])) if page[3:].isdigit() and int(page[3:]) else None,
      'review':'draft','minutes':max(3,round(sum(len(b['text']) for b in blocks)/750)),
      'goals':['원문 본문과 수식·코드를 연결해 읽기','별도 학습 도움과 정정 역주를 구분하기'],
      'prerequisites':['math-03','math-04'] if ch=='11' else [],'blocks':blocks,
      'references':[{'title':'PBRT 4판 · 공식 원문','url':source_url,'role':'further-reading'}],
      'notice':'첨부 원문에 대응하는 한국어 번역입니다. 그림·수식·코드를 보존하며 추가 설명과 정정 역주를 구분합니다. 독립 전문 감수 완료나 책 전체 번역 완료를 뜻하지 않습니다.'}
    return lesson

def prepare(source:Path,bundle:Path,out:Path,replace=False):
    if out.exists() and not replace:raise ValueError('Output exists; use --replace to preserve a backup and replace it.')
    out.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='.native-',dir=out.parent) as temp:
        stage=Path(temp);result=stage/'native';(result/'lessons').mkdir(parents=True)
        old=stage/'prior';old.mkdir()
        with safe_zip(bundle) as z:
            for name in z.namelist():
                parts=PurePosixPath(name).parts
                if '..' in parts or PurePosixPath(name).is_absolute():raise ValueError('Unsafe bundle path')
                if '/reader/ch09/' not in '/'+name and '/reader/ch10/' not in '/'+name:continue
                if name.endswith('/'):continue
                if Path(name).suffix.lower() not in ['.html','.png','.jpg','.jpeg','.svg','.webp']:continue
                rel=name.split('/reader/',1)[1] if '/reader/' in name else name.split('reader/',1)[1]
                dst=old/rel;dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(member(z,name))
        articles={}
        for ch in ['09','10']:
            chapter_root=old/('ch'+ch)
            for page in sorted(chapter_root.glob(ch+'-*.html')):
                if page.stem.endswith('index'):continue
                soup=BeautifulSoup(page.read_text(encoding='utf8'),'lxml');art=soup.select_one('#article')
                if not art:raise ValueError('Missing translated article: '+page.name)
                link=soup.select_one('.source-link');url=link.get('href',BASE_URL+'contents') if link else BASE_URL+'contents'
                articles[page.stem]=(art,url,chapter_root/'assets',{})
        if not articles or not any(k.startswith('09-') for k in articles) or not any(k.startswith('10-') for k in articles):raise ValueError('Prior bundle must contain both chapters 9 and 10')
        articles.update(build_ch11(source,stage))
        records=[];metrics=[]
        def order(k):return (int(k[:2]),int(k[3:]) if k[3:].isdigit() else 90 if k.endswith('reading') else 99)
        for page in sorted(articles,key=order):
            article,url,assets,meta=articles[page]
            lesson=native_lesson(page,article,url,assets,result,set(articles))
            raw=dump(lesson).encode();file='lessons/'+lesson['id']+'.json';(result/file).write_bytes(raw)
            record={k:lesson[k] for k in ['id','chapter','chapterTitle','title','deck','kind','minutes','sourceSection']}
            record.update(file=file,sha256=digest(raw),search=[{'id':b['id'],'text':b['text']} for b in lesson['blocks']]);records.append(record)
            metrics.append({'page':page,'blocks':len(lesson['blocks']),'bytes':len(raw),'codeBlocks':sum(len(BeautifulSoup(b['html'],'lxml').select('.fragmentcode')) for b in lesson['blocks']),**({'translated':meta['translated'],'sourceUnits':meta['units']} if meta else {})})
        catalog={'schema':SCHEMA,'bookId':'pbrt-4ed','translationReview':'draft','lessons':records}
        (result/'catalog.json').write_text(dump(catalog),encoding='utf8')
        (result/'build-report.json').write_text(json.dumps({'pages':metrics,'source_archive_sha256':digest(source.read_bytes()),'prior_bundle_sha256':digest(bundle.read_bytes()),'newChapter':'11','sourceReviewed':False},ensure_ascii=False,indent=2),encoding='utf8')
        backup=None
        if out.exists():
            backup=out.with_name(out.name+'.backup-'+datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ'));out.rename(backup)
        try:shutil.move(str(result),str(out))
        except BaseException:
            if backup and not out.exists():backup.rename(out)
            raise
        print(dump({'output':str(out),'lessons':len(records),'backup':str(backup) if backup else None}))

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--source',type=Path,required=True);p.add_argument('--ch09-ch10',type=Path,required=True);p.add_argument('--out',type=Path,default=ROOT/'public/books/pbrt-4ed/native');p.add_argument('--replace',action='store_true')
    a=p.parse_args();prepare(a.source.expanduser().resolve(),a.ch09_ch10.expanduser().resolve(),a.out.expanduser().resolve(),a.replace)
