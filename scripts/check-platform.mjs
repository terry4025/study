#!/usr/bin/env node
/** Structural/regression checks. These do NOT certify source fidelity or completeness. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';
import katex from 'katex';
const root=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'gyeol-platform-'));
const require=createRequire(import.meta.url);let assertions=0;
function check(condition,message){assert.ok(condition,message);assertions++;}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
class MemoryStorage {
 data=new Map(); fail=false;
 getItem(k){return this.data.get(k)??null;}
 setItem(k,v){if(this.fail)throw new Error('quota');this.data.set(k,String(v));}
 removeItem(k){this.data.delete(k);}
 clear(){this.data.clear();}
 key(i){return [...this.data.keys()][i]??null;}
 get length(){return this.data.size;}
}
try{
 fs.writeFileSync(path.join(temp,'package.json'),'{"type":"commonjs"}');
 for(const source of walk(path.join(root,'src'))){
  const relative=path.relative(path.join(root,'src'),source);
  if(!/\.(ts|json)$/.test(source)||source.endsWith('.d.ts'))continue;
  const output=path.join(temp,relative.replace(/\.ts$/,'.js'));
  fs.mkdirSync(path.dirname(output),{recursive:true});
  if(source.endsWith('.json'))fs.copyFileSync(source,output);
  else fs.writeFileSync(output,ts.transpileModule(fs.readFileSync(source,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText);
 }
 const {pbrtBook}=require(path.join(temp,'platform/pbrt.js'));
 const {Repository}=require(path.join(temp,'reader/repository.js'));
 const {Store,STORAGE_KEY,emptyProgress,validateProgress}=require(path.join(temp,'reader/store.js'));
 const {books,resolveBook}=require(path.join(temp,'platform/registry.js'));
 const repo=new Repository(pbrtBook);
 check(books.length===6,'six shelf slots');
 check(books.filter(b=>b.load).length===1,'planned books are not fake courses');
 check(!resolveBook('not-a-book'),'unknown book must not resolve to PBRT');
 check(pbrtBook.outline.length===105,'official numbered section inventory');
 const counts=[6,4,11,6,4,8,3,8,9,5,4,6,4,3,3,5,5,7,4];
 [...Array.from({length:16},(_,i)=>String(i+1)),'A','B','C'].forEach((c,i)=>check(pbrtBook.outline.filter(e=>e.chapter===c).length===counts[i],`chapter ${c} section count`));
 check(repo.metas.length===137,'50 existing + 32 original + 55 reading guides');
 check(new Set(pbrtBook.outline.map(e=>e.number)).size===105,'no duplicate source numbers');
 check(new Set(pbrtBook.outline.map(e=>e.lessonId)).size===105,'one unique destination for each source section');
 check(pbrtBook.lessons.filter(l=>l.kind==='reading-guide').length===55,'55 short new reading guides');
 const warnings=[];let mathCount=0,quizCount=0,figureCount=0;
 for(const e of pbrtBook.outline){check(repo.has(e.lessonId),e.number+' destination exists');check(new URL(e.url).hostname==='pbr-book.org','primary source URL');check(e.review==='pending','do not mark guide coverage as editorial certification');}
 for(const meta of repo.metas){
  const l=await repo.get(meta.id);check(!!l,meta.id+' loads');
  check(l.blocks.length>0,l.id+' not empty');
  check(new Set(l.blocks.map(b=>b.id)).size===l.blocks.length,l.id+' unique block IDs');
  for(const prerequisite of l.prerequisites)check(repo.has(prerequisite),l.id+' prerequisite '+prerequisite);
  for(const b of l.blocks){
   if(b.type==='equation'){mathCount++;try{katex.renderToString(b.tex,{throwOnError:true,trust:false,strict:'ignore',output:'mathml'});}catch(e){warnings.push(l.id+'/'+b.id+': '+e.message);}}
   if(b.type==='quiz'){quizCount++;check(Number.isInteger(b.answer)&&b.answer>=0&&b.answer<b.options.length,l.id+' valid quiz');check(new Set(b.options).size===b.options.length,l.id+' distinct options');}
   if(b.type==='figure'){figureCount++;check(fs.existsSync(path.join(root,'public',b.src)),l.id+' image exists');check(!b.verified,'unreviewed legacy figure must be labeled');}
  }
 }
 check((await repo.get('missing'))===null,'unknown lesson must not fall back');
 const fake={...pbrtBook,id:'test-book',outline:[],legacy:undefined,lessons:[{...pbrtBook.lessons[0],title:'Distinct test-book course'}]};
 const isolated=new Repository(fake);
 check(isolated.metas.length===1,'second book does not import PBRT course');
 check((await isolated.get(fake.lessons[0].id)).title==='Distinct test-book course','same lesson ID in separate books is safe');
 check((await isolated.get('ch01-01'))===null,'no PBRT fallback in another book');
 const memory=new MemoryStorage(),old={...emptyProgress(),lastLesson:'ch03-07',completed:['ch03-07'],notes:{'ch03-07:p1':{lessonId:'ch03-07',blockId:'p1',text:'보존할 메모',updated:'2026-09-18'}}};
 const oldBytes=JSON.stringify(old);memory.setItem(STORAGE_KEY,oldBytes);
 const pbrt=new Store(memory,'pbrt-4ed'),other=new Store(memory,'test-book');
 check(pbrt.value.lastLesson==='ch03-07','migrate existing PBRT last position');
 check(pbrt.value.notes['ch03-07:p1'].text==='보존할 메모','preserve existing notes');
 check(memory.getItem(STORAGE_KEY)===oldBytes,'old bytes preserved after migration');
 check(other.value.lastLesson===null&&other.value.completed.length===0,'old global data never migrates to another book');
 other.toggle('completed','ch03-07');other.note({lessonId:'ch03-07',blockId:'p1',text:'다른 책의 메모',updated:'now'});
 check(new Store(memory,'pbrt-4ed').value.notes['ch03-07:p1'].text==='보존할 메모','book-scoped writes');
 pbrt.value.lastLesson='read-09-01';pbrt.save();check(new Store(memory,'pbrt-4ed').value.lastLesson==='read-09-01','new scope wins over old key');
 const before=other.export();assert.throws(()=>other.restore(pbrt.export()));assertions++;check(other.export()===before,'cross-book import leaves state untouched');
 const imported=new Store(new MemoryStorage(),'pbrt-4ed');imported.restore(pbrt.export());check(imported.value.lastLesson==='read-09-01','scoped backup roundtrip');
 imported.restore(oldBytes);check(imported.value.lastLesson==='ch03-07','PBRT accepts old unscoped v2 backup');
 assert.throws(()=>other.restore(oldBytes));assertions++;
 const corrupt=new MemoryStorage(),key=STORAGE_KEY+'.book.pbrt-4ed';corrupt.setItem(key,'broken');const recovered=new Store(corrupt,'pbrt-4ed');recovered.save();
 check([...corrupt.data.entries()].some(([k,v])=>k.includes('.recovery.')&&v==='broken'),'corrupt bytes backed up before replacement');
 const quota=new MemoryStorage();quota.setItem(key,'broken');quota.fail=true;const blocked=new Store(quota,'pbrt-4ed');blocked.save();check(quota.getItem(key)==='broken','quota failure cannot destroy corrupt original');
 const hostile=JSON.parse('{"version":2,"notes":{"__proto__":{"lessonId":"x","blockId":"y","text":"x"}},"completed":["constructor","safe"],"settings":{"fontSize":999}}');
 const clean=validateProgress(hostile);check(clean.completed.length===1&&clean.settings.fontSize===24&&!Object.hasOwn(clean.notes,'__proto__'),'validate imported identifiers and bounds');
 check(Math.abs(.8*.5-.4)<1e-12,'transmittance example');check(Math.abs(.25*(2/.25)+.75*(6/.75)-8)<1e-12,'light-selection weighting example');
 check(Math.abs((1-.5)*(1-1/3)*(1-.25)-.25)<1e-12,'reservoir example');
 if(warnings.length)throw new Error(warnings.join('\n'));
 console.log(JSON.stringify({assertions,books:books.length,numberedSections:105,loadedLessons:repo.metas.length,shortReadingGuides:55,displayEquations:mathCount,quizzes:quizCount,displayFigures:figureCount,errors:[],notice:'Structure, math syntax and state isolation only. NOT whole-book editorial certification.'},null,2));
}finally{fs.rmSync(temp,{recursive:true,force:true});}
