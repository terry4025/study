export const STORE_KEY='cs-reader:v2';
export const REVISION='reader-2026-09-18';
export interface Position{block:string;offset:number;ratio:number;revision:string;}
export interface Store{version:2;theme:'paper'|'night';size:number;width:'normal'|'wide';compare:boolean;last:string;completed:string[];bookmarks:string[];notes:Record<string,string>;answers:Record<string,number>;positions:Record<string,Position>;}
export function defaults():Store{return {version:2,theme:'paper',size:18,width:'normal',compare:false,last:'ch00-01',completed:[],bookmarks:[],notes:{},answers:{},positions:{}};}
const validId=(s:unknown):s is string=>typeof s==='string'&&/^ch\d{2}-\d{2}$/.test(s);
const obj=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export function sanitizeStore(raw:unknown):Store{
 const d=defaults();if(!obj(raw)||raw.version!==2)return d;
 d.theme=raw.theme==='night'?'night':'paper';d.size=typeof raw.size==='number'&&Number.isFinite(raw.size)?clamp(raw.size,16,24):18;
 d.width=raw.width==='wide'?'wide':'normal';d.compare=raw.compare===true;d.last=validId(raw.last)?raw.last:d.last;
 for(const k of ['completed','bookmarks'] as const)if(Array.isArray(raw[k]))d[k]=[...new Set(raw[k].filter(validId))].slice(0,500);
 if(obj(raw.notes))for(const [k,v]of Object.entries(raw.notes))if(validId(k)&&typeof v==='string')d.notes[k]=v.slice(0,20000);
 if(obj(raw.answers))for(const [k,v]of Object.entries(raw.answers))if(/^ch\d{2}-\d{2}-q\d+$/.test(k)&&typeof v==='number'&&Number.isInteger(v)&&v>=0&&v<=20)d.answers[k]=v;
 if(obj(raw.positions))for(const [k,v]of Object.entries(raw.positions))if(validId(k)&&obj(v)&&typeof v.block==='string'&&typeof v.offset==='number'&&Number.isFinite(v.offset)&&typeof v.ratio==='number'&&Number.isFinite(v.ratio))d.positions[k]={block:v.block.slice(0,100),offset:clamp(v.offset,-2000,2000),ratio:clamp(v.ratio,0,1),revision:typeof v.revision==='string'?v.revision:''};
 return d;
}
export function readStore():Store{try{const saved=localStorage.getItem(STORE_KEY);if(saved)return sanitizeStore(JSON.parse(saved));const d=defaults(),old=localStorage.getItem('cs_current_sec');if(validId(old))d.last=old;if(localStorage.getItem('cs_theme')==='dark'||localStorage.getItem('cs_dark_mode')==='true')d.theme='night';const size=Number(localStorage.getItem('cs_font_size'));if(Number.isFinite(size)&&size>=16&&size<=24)d.size=size;d.compare=localStorage.getItem('cs_reading_mode')==='bilingual';return d;}catch{return defaults();}}
export function writeStore(s:Store):boolean{try{localStorage.setItem(STORE_KEY,JSON.stringify(s));return true;}catch{return false;}}
export function exportStore(s:Store):void{const u=URL.createObjectURL(new Blob([JSON.stringify(s,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=`cs-reader-notes-${new Date().toISOString().slice(0,10)}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);}
