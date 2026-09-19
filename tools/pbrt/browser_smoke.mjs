/** Real localhost + native History/LocalStorage; synthetic lessons only.
 * Runs against an already-built dist and restores its original native folder. */
import { chromium } from 'playwright';
import { promises as fs } from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const dir=path.join(root,'books/pbrt-4ed/native');
const backup=dir+'.smoke-backup';
let existed=false,server,browser;const checks=[];
async function check(name,fn){await fn();checks.push(name);console.log('PASS',name);}
const fixture=(n)=>({id:`translation-11-${90+n}`,chapter:'11',chapterTitle:'테스트 자료',title:`통합 검사 수업 ${n}`,deck:'검사용 합성 자료 — 번역 본문이 아닙니다.',kind:'translation',review:'draft',minutes:1,goals:[],prerequisites:[],references:[],blocks:[{type:'rich',id:`smoke-${n}-body`,html:`<p><span class="lang-ko">검사전용검색어 가나다 ${n}</span><span class="lang-en">English test ${n}</span></p>`,text:`검사전용검색어 가나다 ${n}`},{type:'rich',id:`smoke-${n}-code`,html:`<div><a class="codecarat" role="button" href="#smoke-${n}-expand" aria-controls="smoke-${n}-expand" aria-expanded="false">코드 펼치기</a><div class="collapse" id="smoke-${n}-expand"><pre>int n = ${n};</pre></div><img src="books/pbrt-4ed/native/assets/check.svg" alt="검사용 도형"></div>`,text:'코드 펼치기'}]});
try{
 try{await fs.access(backup);throw new Error('Backup already exists: '+backup);}catch(e){if(e.code!=='ENOENT')throw e;}
 try{await fs.access(dir);await fs.rename(dir,backup);existed=true;}catch(e){if(e.code!=='ENOENT')throw e;}
 await fs.mkdir(path.join(dir,'lessons'),{recursive:true});await fs.mkdir(path.join(dir,'assets'),{recursive:true});
 await fs.writeFile(path.join(dir,'assets/check.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="80"><rect width="400" height="80" fill="gray"/></svg>');
 const metas=[];
 for(const n of [1,2]){const l=fixture(n),raw=JSON.stringify(l),file=`lessons/${l.id}.json`;await fs.writeFile(path.join(dir,file),raw);const {blocks,goals,prerequisites,references,review,...meta}=l;metas.push({...meta,file,sha256:createHash('sha256').update(raw).digest('hex'),search:blocks.map(b=>({id:b.id,text:b.text}))});}
 await fs.writeFile(path.join(dir,'catalog.json'),JSON.stringify({schema:1,bookId:'pbrt-4ed',lessons:metas}));
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
 server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const f=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!f.startsWith(root+path.sep))throw Error('path');res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.statusCode=404;res.end('Not found');}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'/?book=pbrt-4ed&sec=translation-11-91');await page.locator('#smoke-1-body').waitFor();
 await check('native lesson fetched and rendered',async()=>assert.match(await page.locator('#smoke-1-body').innerText(),/검사전용검색어/));
 await check('code expand and collapse',async()=>{const a=page.locator('#smoke-1-code a');await a.click();assert.equal(await a.getAttribute('aria-expanded'),'true');await a.click();assert.equal(await a.getAttribute('aria-expanded'),'false');});
 await check('shared memo save',async()=>{await page.locator('#smoke-1-body .paragraph-note').click();await page.locator('.note-input').fill('로컬 통합 검사 메모');await page.getByRole('button',{name:'메모 저장',exact:true}).click();});
 await page.locator('.bookmark-button').click();await page.locator('.complete-panel button').click();
 await check('records persist after actual page reload',async()=>{await page.reload();await page.locator('#smoke-1-body').waitFor();assert.equal(await page.locator('.bookmark-button').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.complete-panel button').getAttribute('aria-pressed'),'true');const vals=await page.evaluate(()=>Object.values(localStorage));assert(vals.some(x=>x.includes('로컬 통합 검사 메모')));});
 await check('native bilingual mode',async()=>{await page.getByRole('button',{name:'읽기 설정',exact:true}).click();await page.getByRole('checkbox',{name:/영문 함께 보기/}).check();await page.keyboard.press('Escape');assert.equal(await page.locator('#smoke-1-body .lang-en').isVisible(),true);});
 await check('source text search and navigation',async()=>{await page.keyboard.press('Control+k');await page.locator('.search-input').fill('검사전용검색어');await page.locator('.search-result').first().waitFor();const hits=await page.locator('.search-results').innerText();assert.match(hits,/통합 검사 수업/);await page.keyboard.press('Escape');});
 await check('real browser history',async()=>{await page.locator('a[href*="sec=translation-11-92"]').first().click();await page.locator('#smoke-2-body').waitFor();await page.goBack();await page.locator('#smoke-1-body').waitFor();});
 await check('reading size and four responsive widths',async()=>{await page.getByRole('button',{name:'읽기 설정',exact:true}).click();const input=page.getByRole('slider',{name:'글자 크기'});await input.fill('24');await input.dispatchEvent('input');await page.keyboard.press('Escape');for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);}});
 await check('no runtime errors',async()=>assert.deepEqual(errors,[]));
 await fs.writeFile('native-browser-smoke-result.json',JSON.stringify({passed:true,environment:'built app on real localhost; native storage/history; synthetic lessons',checks},null,2));
}finally{await browser?.close();if(server)await new Promise(r=>server.close(r));await fs.rm(dir,{recursive:true,force:true});if(existed)await fs.rename(backup,dir);}
