#!/usr/bin/env node
/** Run in the actual study repository: node scripts/check-reader.mjs
 * Checks the new course and inventories legacy display issues; it does NOT
 * certify translation fidelity or license clearance. Uses existing dependencies.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import ts from 'typescript';
import katex from 'katex';

const root=process.cwd();
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'gyeol-reader-check-'));
fs.writeFileSync(path.join(temp, 'package.json'), JSON.stringify({type: 'commonjs'}));
const require=createRequire(import.meta.url);
const errors=[], warnings=[];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
function compile(file){
 const relative=path.relative(path.join(root,'src'),file).replace(/\.ts$/,'.js');
 const result=ts.transpileModule(fs.readFileSync(file,'utf8'),{reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}});
 for(const d of result.diagnostics||[])if(d.category===ts.DiagnosticCategory.Error)errors.push(ts.flattenDiagnosticMessageText(d.messageText,'\n'));
 const output=path.join(temp,relative);fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,result.outputText);
}
try{
 const sources=[...walk(path.join(root,'src/data')),...walk(path.join(root,'src/reader'))].filter(p=>p.endsWith('.ts')&&!p.endsWith('.d.ts'));
 for(const file of sources)compile(file);
 const {curriculum}=require(path.join(temp,'reader/curriculum.js'));
 const ids=new Set(curriculum.map(l=>l.id));
 if(ids.size!==curriculum.length)errors.push('Duplicate lesson IDs');
 let equations=0,quizzes=0,labs=0;
 for(const lesson of curriculum){
  for(const id of lesson.prerequisites)if(!ids.has(id))errors.push(`${lesson.id}: missing prerequisite ${id}`);
  const blockIds=new Set();
  for(const block of lesson.blocks){
   if(blockIds.has(block.id))errors.push(`${lesson.id}: duplicate block ${block.id}`);blockIds.add(block.id);
   if(block.type==='equation'){equations++;try{katex.renderToString(block.tex,{throwOnError:true,trust:false,output:'mathml',strict:'ignore'});}catch(e){errors.push(`${lesson.id}/${block.id}: ${e.message}`);}}
   if(block.type==='quiz'){quizzes++;if(!Number.isInteger(block.answer)||block.answer<0||block.answer>=block.options.length)errors.push(`${lesson.id}: invalid quiz answer`);}
   if(block.type==='lab')labs++;
  }
 }
 const {SECTIONS_MAP}=require(path.join(temp,'data/sections.js'));
 let legacyEquations=0,legacyFigures=0;
 const supported=new Set(['paragraph','subheading','equation','code','figure','concept-tip']);
 for(const [id,lesson]of Object.entries(SECTIONS_MAP))for(const [i,block]of lesson.blocks.entries()){
  if(!supported.has(block.type))warnings.push(`${id}/${i}: unrecognized legacy type ${block.type}`);
  if(block.type==='equation'){legacyEquations++;try{katex.renderToString(block.tex,{throwOnError:true,trust:false,output:'mathml',strict:'ignore'});}catch(e){warnings.push(`${id}/${i}: legacy equation: ${e.message}`);}}
  if(block.type==='figure'){legacyFigures++;if(block.src.startsWith('/')&&!fs.existsSync(path.join(root,'public',block.src.slice(1))))warnings.push(`${id}/${i}: missing image ${block.src}`);}
 }
 console.log(JSON.stringify({newLessons:curriculum.length,equations,quizzes,labs,legacyLessons:Object.keys(SECTIONS_MAP).length,legacyEquations,legacyFigures,errors,warnings,notice:'Legacy source/English/caption fidelity has NOT been certified.'},null,2));
 if(errors.length)process.exitCode=1;
}catch(e){console.error(e);process.exitCode=1;}
finally{fs.rmSync(temp,{recursive:true,force:true});}
