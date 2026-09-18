import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import katex from 'katex';

// Compile only repository-owned TypeScript data modules for the content checks.
const require=createRequire(import.meta.url), cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 const mod={exports:{}};cache.set(file,mod);
 const source=fs.readFileSync(file,'utf8');
 const output=ts.transpileModule(source,{fileName:file,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
 const localRequire=id=>id.startsWith('.')?load(path.resolve(path.dirname(file),id.endsWith('.ts')?id:id+'.ts')):require(id);
 vm.runInThisContext(`(function(require,module,exports){${output}\n})`,{filename:file})(localRequire,mod,mod.exports);
 return mod.exports;
}
const {LESSONS,LESSON_MAP,MAIN_LESSONS,CHAPTERS,searchLessons}=load('src/reader/catalog.ts');
const {defaults,sanitizeStore,readStore,writeStore,STORE_KEY}=load('src/reader/storage.ts');
const {SECTIONS_MAP}=load('src/data/sections.ts');
assert.equal(LESSONS.length,95,'95 lessons including six foundations');
assert.equal(MAIN_LESSONS.length,89);
assert.equal(CHAPTERS.length,17);
assert.equal(new Set(LESSONS.map(l=>l.id)).size,95,'unique lesson identifiers');
assert.equal(Object.keys(SECTIONS_MAP).length,50);
for(const id of Object.keys(SECTIONS_MAP))assert.ok(LESSON_MAP[id],`preserve ${id}`);
for(const [c,count]of [[0,6],[9,9],[10,5],[11,4],[12,6],[13,4],[14,3],[15,3],[16,5]])assert.equal(LESSONS.filter(l=>l.chapter===c).length,count,`chapter ${c}`);
const supported=new Set(['paragraph','subheading','figure','code','concept-tip','equation','checkpoint','lab']);
const warnings=[], perChapter={};let math=0,questions=0,figures=0;
for(const l of LESSONS){
 assert.ok(l.title&&l.goal&&l.blocks.length,`nonempty ${l.id}`);
 assert.equal(new URL(l.source).protocol,'https:');assert.equal(new URL(l.source).hostname,'pbr-book.org');
 for(const p of l.prerequisites)assert.ok(LESSON_MAP[p],`${l.id}: missing prerequisite ${p}`);
 perChapter[l.chapter]=(perChapter[l.chapter]||0)+1;
 if(l.provenance!=='legacy')assert.ok(l.blocks.filter(b=>b.type==='paragraph').map(b=>b.textKo).join('').length>450,`${l.id}: not a placeholder`);
 for(const [i,b]of l.blocks.entries()){
  assert.ok(supported.has(b.type),`${l.id}:${i}: unsupported block`);
  if(b.type==='checkpoint'){questions++;assert.ok(Number.isInteger(b.answer)&&b.answer>=0&&b.answer<b.choices.length);assert.ok(b.feedback.length>10);}
  if(b.type==='equation'){
   try{assert.ok(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(b.tex),'escaped control character');katex.renderToString(b.tex,{throwOnError:true,trust:false,strict:'ignore'});math++;}
   catch(e){if(l.provenance==='legacy')warnings.push({id:l.id,block:i,kind:'legacy-equation',detail:String(e.message)});else throw e;}
  }
  if(b.type==='figure'){figures++;if(!fs.existsSync(path.join('public',b.src)))warnings.push({id:l.id,block:i,kind:'missing-legacy-image',src:b.src});}
 }
}
assert.equal(questions,46,'45 new lessons plus triangle correction');
assert.equal(LESSON_MAP['ch06-05'].provenance,'correction');
assert.ok(LESSON_MAP['ch06-05'].blocks.some(b=>b.type==='paragraph'&&b.textKo.includes('에지 함수')));
assert.ok(LESSON_MAP['ch07-03'].blocks.some(b=>b.type==='paragraph'&&b.textKo.includes('최대 2N-1')));
assert.ok(searchLessons('가상 사건').some(r=>r.lesson.id==='ch11-04'),'body-only query');
assert.ok(searchLessons('weight = 1').some(r=>r.lesson.id==='ch13-03'),'code search');
assert.equal(searchLessons('qzxnomatch123987').length,0);
const invalid=sanitizeStore({version:2,size:100,theme:'unknown',last:'../../bad',completed:['ch00-01','ch00-01','bad'],notes:{'bad':'x','ch00-01':'n'},positions:{'ch00-01':{block:'a',offset:Infinity,ratio:0,revision:''}}});
assert.equal(invalid.size,24);assert.equal(invalid.theme,'paper');assert.equal(invalid.last,'ch00-01');assert.deepEqual(invalid.completed,['ch00-01']);assert.equal(Object.keys(invalid.positions).length,0);
const data=new Map();globalThis.localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
data.set('cs_current_sec','ch03-07');data.set('cs_theme','dark');assert.equal(readStore().last,'ch03-07');assert.equal(readStore().theme,'night');assert.equal(data.get('cs_current_sec'),'ch03-07');
assert.ok(writeStore(defaults()));assert.ok(data.has(STORE_KEY));data.set(STORE_KEY,'invalid json');assert.equal(readStore().last,'ch00-01');
globalThis.localStorage={getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('quota');}};assert.equal(readStore().size,18);assert.equal(writeStore(defaults()),false);
const report={lessons:LESSONS.length,mainLessons:MAIN_LESSONS.length,originalChapterSections:39,foundations:6,checkpoints:questions,validStandaloneEquations:math,legacyFigures:figures,perChapter,warnings,scope:'Structural and rendering checks, not a full semantic or copyright clearance audit.'};
fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/content-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
console.log('PASS: catalog, original equations, prerequisites, checkpoints, content search, storage validation and migration');
