#!/usr/bin/env node
/** Online TOC/link mapping check. Not a translation/meaning checker. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base='https://pbr-book.org/4ed/contents';
const normalize=url=>decodeURIComponent(new URL(url,base).pathname).replace(/\.html$/,'').replace(/\/$/,'');
const response=await fetch(base,{signal:AbortSignal.timeout(25000)});
if(!response.ok)throw new Error('Official TOC HTTP '+response.status);
const html=await response.text();
const entries=new Map();
for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
 const text=m[2].replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
 const number=text.match(/^(\d+\.\d+|[ABC]\.\d+)\s/);
 if(number)entries.set(number[1],normalize(m[1]));
}
assert.equal(entries.size,105,'Official numbered TOC size changed or parser needs revision.');
const local=JSON.parse(fs.readFileSync('src/platform/pbrt-outline.json','utf8'));
const differences=local.filter(e=>entries.get(e.number)!==normalize(e.url)).map(e=>({number:e.number,local:normalize(e.url),official:entries.get(e.number)}));
console.log(JSON.stringify({numberedEntries:entries.size,checkedAt:new Date().toISOString(),differences,scope:'TOC destination mapping only; content/figures not certified'},null,2));
assert.equal(differences.length,0,'Source URL mapping differs from official TOC.');
