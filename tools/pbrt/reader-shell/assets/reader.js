'use strict';
(() => {
  const prefix='pbrt-uploaded-ch09-v1:', root=document.documentElement;
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(prefix+key)||'null')??fallback;}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(prefix+key,JSON.stringify(value));return true;}catch{return false;}};
  const toast=(text)=>{const n=document.getElementById('toast');n.textContent=text;n.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>n.classList.remove('show'),2300);};
  const defaults={size:18,mode:'ko',dark:false,help:true};
  const v=read('settings',{});const cfg={...defaults,...(v&&typeof v==='object'&&!Array.isArray(v)?v:{})};
  cfg.size=Math.min(26,Math.max(15,Number(cfg.size)||18));
  if(!['ko','both','en'].includes(cfg.mode))cfg.mode='ko';
  const mode=document.getElementById('lang-mode'),help=document.getElementById('notes-toggle');
  const apply=()=>{root.style.setProperty('--font',cfg.size+'px');root.dataset.mode=cfg.mode;root.dataset.theme=cfg.dark?'dark':'light';root.classList.toggle('hide-help',!cfg.help);mode.value=cfg.mode;help.checked=cfg.help;document.getElementById('theme').setAttribute('aria-pressed',String(!!cfg.dark));};
  apply();
  mode.addEventListener('change',()=>{cfg.mode=mode.value;apply();write('settings',cfg);});
  help.addEventListener('change',()=>{cfg.help=help.checked;apply();write('settings',cfg);});
  for(const [id,step] of [['font-up',1],['font-down',-1]])document.getElementById(id).addEventListener('click',()=>{cfg.size=Math.max(15,Math.min(26,cfg.size+step));apply();write('settings',cfg);toast('본문 '+cfg.size+'px');});
  document.getElementById('theme').addEventListener('click',()=>{cfg.dark=!cfg.dark;apply();write('settings',cfg);});
  const sidebar=document.getElementById('sidebar'),toggle=document.getElementById('toc-toggle');
  function close(){sidebar.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',()=>{const show=sidebar.classList.toggle('open');toggle.setAttribute('aria-expanded',String(show));});
  document.addEventListener('click',ev=>{if(sidebar.classList.contains('open')&&!sidebar.contains(ev.target)&&!toggle.contains(ev.target))close();});
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){close();toggle.focus();}if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'){ev.preventDefault();if(matchMedia('(max-width:760px)').matches){sidebar.classList.add('open');toggle.setAttribute('aria-expanded','true');}document.getElementById('q').focus();}});
  document.addEventListener('click',ev=>{
    const a=ev.target.closest('a.codecarat');if(!a)return;
    const id=(a.getAttribute('href')||'').slice(1),target=document.getElementById(id);
    if(!target)return;ev.preventDefault();const open=target.classList.toggle('show');a.setAttribute('aria-expanded',String(open));
  });
  document.querySelectorAll('.footnote-marker').forEach(b=>b.addEventListener('click',()=>{
    let n=b.closest('[data-tu]');let found=null;
    while(n&&!found){n=n.nextElementSibling;if(n?.classList.contains('translation-footnote'))found=n;else if(n?.matches('[data-tu]')&&!n.classList.contains('translator-note'))break;}
    if(found)found.scrollIntoView({block:'center',behavior:'instant'});else toast('이 절의 원문 주석 상자에서 설명을 확인하세요.');
  }));
  let loaded=null,delay;
  function loadSearch(){if(loaded)return loaded;loaded=new Promise((resolve,reject)=>{
    if(Array.isArray(window.PBRT_TRANSLATION_SEARCH)){resolve(window.PBRT_TRANSLATION_SEARCH);return;}
    const s=document.createElement('script');s.src='assets/search-index.js';s.onload=()=>resolve(window.PBRT_TRANSLATION_SEARCH||[]);s.onerror=()=>{loaded=null;reject(new Error('검색 색인 파일을 열 수 없습니다. ZIP을 모두 풀었는지 확인하세요.'));};document.head.append(s);
  });return loaded;}
  const q=document.getElementById('q'),out=document.getElementById('search-results');let request=0;
  q.addEventListener('input',()=>{clearTimeout(delay);const seq=++request;delay=setTimeout(async()=>{
    const query=q.value.trim().toLocaleLowerCase('ko');out.replaceChildren();if(query.length<2)return;
    out.textContent='검색 중…';try{const data=await loadSearch();if(seq!==request)return;
      const found=data.filter(x=>(x.text+' '+x.title).toLocaleLowerCase('ko').includes(query));out.replaceChildren();
      const count=document.createElement('p');count.textContent=found.length?found.length+'개 문단 · 최대 20개 표시':'검색 결과가 없습니다.';out.append(count);
      for(const row of found.slice(0,20)){const a=document.createElement('a');a.href=row.page+'#'+row.anchor;
        const title=document.createElement('strong');title.textContent=row.title;const text=document.createElement('small');
        const p=row.text.toLocaleLowerCase('ko').indexOf(query);text.textContent=(p>38?'…':'')+row.text.slice(Math.max(0,p-38),Math.max(0,p-38)+115)+'…';a.append(title,text);out.append(a);}
    }catch(e){out.textContent=e.message;}
  },130);});
  const page=document.body.dataset.page;
  let armed=false,scrollTimer;
  window.addEventListener('scroll',()=>{if(!armed)return;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>write('position:'+page,window.scrollY),300);},{passive:true});
  window.addEventListener('load',()=>{
    if(!location.hash){const y=read('position:'+page,0);if(Number.isFinite(y)&&y>0)setTimeout(()=>{window.scrollTo(0,y);armed=true;},150);else armed=true;}else armed=true;
    if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target){let p=target.parentElement;while(p){if(p.classList.contains('collapse'))p.classList.add('show');p=p.parentElement;}target.scrollIntoView({block:'start'});}}
  });
  const marker='/books/pbrt-4ed/translation/ch09/';const pos=location.pathname.indexOf(marker);
  if(pos>=0&&/^https?:$/.test(location.protocol)){const a=document.getElementById('back-app');a.hidden=false;a.href=location.pathname.slice(0,pos+1)+'?book=pbrt-4ed';}
})();
