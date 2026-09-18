#!/usr/bin/env node
/** Local, read-only checks using the project's own installed TypeScript/KaTeX.
 * No network requests. Passing is NOT a full translation or expert review. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';
import katex from 'katex';
const root=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'gyeol-library-check-'));
fs.writeFileSync(path.join(temp, 'package.json'), JSON.stringify({type: 'commonjs'}));
const require=createRequire(import.meta.url),errors=[],warnings=[],tests=[];
const test=(name,fn)=>{try{fn();tests.push(name)}catch(e){errors.push(name+': '+e.message)}};
const walk=dir=>fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]):[];
function compile(file){const out=path.join(temp,path.relative(path.join(root,'src'),file).replace(/\.ts$/,'.js'));const r=ts.transpileModule(fs.readFileSync(file,'utf8'),{reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}});for(const d of r.diagnostics||[])if(d.category===ts.DiagnosticCategory.Error)errors.push(ts.flattenDiagnosticMessageText(d.messageText,'\n'));fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,r.outputText)}
class MemoryStorage{map=new Map();get length(){return this.map.size}key(i){return [...this.map.keys()][i]||null}getItem(k){return this.map.get(k)||null}setItem(k,v){this.map.set(k,String(v))}removeItem(k){this.map.delete(k)}clear(){this.map.clear()}}
try {
 const configPath=ts.findConfigFile(root,ts.sys.fileExists,'tsconfig.json');
 if(configPath){const config=ts.readConfigFile(configPath,ts.sys.readFile);const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,path.dirname(configPath));const program=ts.createProgram(parsed.fileNames,{...parsed.options,noEmit:true});for(const d of [...parsed.errors,...ts.getPreEmitDiagnostics(program)])if(d.category===ts.DiagnosticCategory.Error)errors.push(ts.flattenDiagnosticMessageText(d.messageText,'\n'));}
 for(const file of [...walk(path.join(root,'src/reader')),...walk(path.join(root,'src/data'))].filter(f=>f.endsWith('.ts')&&!f.endsWith('.d.ts')))compile(file);
 const {createLibrary}=require(path.join(temp,'reader/books/index.js'));
 const {Repository}=require(path.join(temp,'reader/repository.js'));
 const {Library}=require(path.join(temp,'reader/library.js'));
 const {Store,emptyProgress,STORAGE_KEY,LEGACY_STORAGE_KEY}=require(path.join(temp,'reader/store.js'));
 const {pbrtGuides}=require(path.join(temp,'reader/books/pbrt/guides.js'));
 const {curriculum}=require(path.join(temp,'reader/curriculum.js'));
 const {SECTIONS_MAP}=require(path.join(temp,'data/sections.js'));
 const {PBRT_TOC}=require(path.join(temp,'data/books/pbrt-4ed/toc.js'));
 const {BOOKS}=require(path.join(temp,'data/books.js'));
 const library=createLibrary(PBRT_TOC,async()=>SECTIONS_MAP,BOOKS),book=library.get('pbrt-4ed'),all=[...curriculum,...pbrtGuides];
 test('six books and separate foundations',()=>{assert.equal(library.books.filter(b=>b.definition.role==='book').length,6);assert.equal(library.books.filter(b=>b.definition.role==='foundation').length,1)});
 test('105 canonical source sections',()=>assert.equal(library.coverage('pbrt-4ed').sections,105));
 test('55 companions, no missing source mappings',()=>{assert.equal(pbrtGuides.length,55);assert.equal(library.coverage('pbrt-4ed').sourceOnly,0);for(const s of book.definition.outline.flatMap(c=>c.sections))assert.ok(book.repository.has(s.lessonId),s.id)});
 test('unique new IDs and resolvable prerequisites',()=>{assert.equal(new Set(all.map(l=>l.id)).size,all.length);for(const entry of library.books)for(const l of entry.repository.originals.values())for(const id of l.prerequisites)assert.ok(library.resolveLesson(entry.definition.id,id),l.id+': '+id)});
 let equations=0,quizzes=0,labs=0;
 test('nonlegacy formulas and quizzes',()=>{for(const l of all){const ids=new Set();for(const b of l.blocks){assert.ok(!ids.has(b.id));ids.add(b.id);if(b.type==='equation'){equations++;katex.renderToString(b.tex,{throwOnError:true,trust:false,output:'mathml',strict:'ignore'})}if(b.type==='quiz'){quizzes++;assert.ok(Number.isInteger(b.answer)&&b.answer>=0&&b.answer<b.options.length)}if(b.type==='lab')labs++;for(const k of ['text','explanation','feedback'])if(typeof b[k]==='string')for(const m of b[k].matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g))katex.renderToString(m[1]||m[2],{throwOnError:true,trust:false,output:'mathml',strict:'ignore'});}}});
 let oldEquations=0,oldFigures=0;
 for(const [id,source] of Object.entries(SECTIONS_MAP)){
  if(!source||!Array.isArray(source.blocks)){errors.push('Invalid legacy content '+id);continue}
  for(const [i,b] of source.blocks.entries()){
   if(b.type==='equation'){oldEquations++;try{katex.renderToString(b.tex,{throwOnError:true,trust:false,output:'mathml',strict:'ignore'})}catch(e){warnings.push(id+'/'+i+': legacy formula '+e.message)}}
   if(b.type==='figure'){oldFigures++;if(b.src.startsWith('/books/')&&!fs.existsSync(path.join(root,'public',b.src.slice(1))))warnings.push(id+'/'+i+': missing local image '+b.src)}
  }
 }
 for(const meta of book.repository.metas)if(!await book.repository.get(meta.id))errors.push('Missing lesson '+meta.id);
 const mem=new MemoryStorage(),old=emptyProgress();old.completed=['math-03','guide-10-01'];old.lastLesson='math-03';old.notes['math-03:p']={lessonId:'math-03',blockId:'p',text:'보존할 메모',updated:''};mem.setItem(LEGACY_STORAGE_KEY,JSON.stringify(old));const store=new Store(mem);
 test('v2 migration keeps existing course IDs and shared notes',()=>{assert.ok(store.forBook('foundations').completed.includes('math-03'));assert.ok(store.forBook('pbrt-4ed').completed.includes('guide-10-01'));assert.equal(store.forBook('foundations').notes['math-03:p'].text,'보존할 메모');assert.ok(mem.getItem(LEGACY_STORAGE_KEY))});
 test('same IDs remain independent across books',()=>{store.selectBook('fixture-a');store.toggle('completed','same');store.note({lessonId:'same',blockId:'p',text:'A',updated:''});store.answer('same:q',0,true);store.selectBook('fixture-b');assert.equal(store.book.completed.length,0);assert.equal(store.book.answers['same:q'],undefined);store.note({lessonId:'same',blockId:'p',text:'B',updated:''});assert.equal(store.forBook('fixture-a').notes['same:p'].text,'A')});
 test('import/export and invalid version are non-destructive',()=>{const saved=store.export();assert.throws(()=>store.restore('{"version":99}'));assert.equal(store.export(),saved);store.restore(saved);assert.ok([...mem.map.keys()].some(k=>k.startsWith(STORAGE_KEY+'.before-import.')))});
 test('source review does not follow learner completion',()=>{assert.equal(library.coverage('pbrt-4ed').sourceReviewed,0);assert.equal(library.coverage('pbrt-4ed').fullTranslation,false)});
 const invariants=await require(path.join(root,'tests/platform-invariants.cjs'))({load:file=>require(path.join(temp,file)),katex});
 const result={passed:tests.length+invariants.passed,tests,independentInvariants:invariants,errors,warnings,typescriptVersion:ts.version,katexVersion:katex.version,nonlegacyLessons:all.length,newGuides:pbrtGuides.length,equations,quizzes,labs,legacyLessons:Object.keys(SECTIONS_MAP).length,legacyEquations:oldEquations,legacyFigures:oldFigures,pbrtCoverage:library.coverage('pbrt-4ed'),notice:'This checks structure, rendering and state invariants, NOT full source fidelity, independent technical review, image meanings or rights clearance.'};
 console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
} catch(e){console.error(e);process.exitCode=1;}finally{fs.rmSync(temp,{recursive:true,force:true});}
