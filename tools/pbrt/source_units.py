from bs4 import BeautifulSoup, NavigableString
import copy,re,hashlib

def source_units(source):
    soup=BeautifulSoup(source,'lxml')
    roots=soup.select('.pretext-layout-root');units=[]
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
