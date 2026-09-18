import React, { memo, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import katex from 'katex';
import type { Lesson, StudyBlock, LabKind } from './types';

const paths:Record<string,ReactNode>={
 book:<><path d="M3 4h6a4 4 0 0 1 3 1 4 4 0 0 1 3-1h6v15h-6a4 4 0 0 0-3 1 4 4 0 0 0-3-1H3z"/><path d="M12 5v15"/></>,
 search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
 close:<path d="m6 6 12 12M18 6 6 18"/>,
 arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,
 back:<path d="M20 12H4m6-6-6 6 6 6"/>,
 menu:<path d="M4 6h16M4 12h16M4 18h16"/>,
 bookmark:<path d="M6 3h12v18l-6-4-6 4z"/>,
 note:<><path d="M5 3h14v18H5zM9 7h6M9 11h6M9 15h4"/></>,
 settings:<><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/></>,
 check:<path d="m5 12 4 4L19 6"/>,
 external:<><path d="M14 3h7v7m0-7L10 14M10 4H4v16h16v-6"/></>,
 focus:<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5"/>,
 chevron:<path d="m9 5 7 7-7 7"/>,
 copy:<><path d="M8 8h12v13H8zM4 16H3V3h13v1"/></>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>,
 moon:<path d="M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z"/>,
};
export function Icon({name,className=''}:{name:string;className?:string}){return <svg className={`icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.book}</svg>;}
export function Dialog({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:ReactNode;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null), id=useId();
 useEffect(()=>{const el=ref.current;const previous=document.activeElement as HTMLElement|null;el?.showModal();return()=>{el?.close();previous?.focus();};},[]);
 return <dialog ref={ref} className={`dialog ${wide?'dialog-wide':''}`} aria-labelledby={id} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
  <div className="dialog-body"><header className="dialog-head"><h2 id={id}>{title}</h2><button className="icon-button" aria-label="닫기" onClick={onClose}><Icon name="close"/></button></header>{children}</div>
 </dialog>;
}
export const MathView=memo(function MathView({tex,display=false}:{tex:string;display?:boolean}){
 const result=useMemo(()=>{try{return {html:katex.renderToString(tex,{displayMode:display,throwOnError:true,trust:false,maxExpand:1000,output:'htmlAndMathml',strict:'ignore'})};}catch(e){return {error:e instanceof Error?e.message:'수식 오류'};}},[tex,display]);
 if('error'in result)return <span className="math-error" role="note" title={result.error}>수식 표기 확인 필요: <code>{tex}</code></span>;
 return <span className={display?'display-math':'inline-math'} dangerouslySetInnerHTML={{__html:result.html!}}/>;
});
function Inline({text}:{text:string}){
 const parts=text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\*\*[\s\S]+?\*\*|`[^`]+?`)/g);
 return <>{parts.map((part,i)=>{
  if(part.startsWith('$$')&&part.endsWith('$$')&&part.length>4)return <MathView key={i} tex={part.slice(2,-2)} display/>;
  if(part.startsWith('$')&&part.endsWith('$')&&part.length>2)return <MathView key={i} tex={part.slice(1,-1)}/>;
  if(part.startsWith('**')&&part.endsWith('**')&&part.length>4)return <strong key={i}><Inline text={part.slice(2,-2)}/></strong>;
  if(part.startsWith('`')&&part.endsWith('`')&&part.length>2)return <code key={i}>{part.slice(1,-1)}</code>;
  return <React.Fragment key={i}>{part.replace(/\\n(?![A-Za-z])/g,'\n')}</React.Fragment>;
 })}</>;
}
export const RichText=memo(function RichText({text}:{text:string}){
 return <div className="prose">{text.split(/\n\s*\n/).filter(t=>t.trim()).map((p,i)=>{
 const lines=p.trim().split('\n');
 if(lines.every(l=>/^\s*[-*]\s/.test(l)))return <ul key={i}>{lines.map((l,j)=><li key={j}><Inline text={l.replace(/^\s*[-*]\s/,'')}/></li>)}</ul>;
 if(lines.every(l=>/^\s*\d+\.\s/.test(l)))return <ol key={i}>{lines.map((l,j)=><li key={j}><Inline text={l.replace(/^\s*\d+\.\s/,'')}/></li>)}</ol>;
 if(p.trim().startsWith('>'))return <blockquote key={i}><Inline text={p.replace(/^>\s?/gm,'')}/></blockquote>;
 return <p key={i}><Inline text={p}/></p>;
 })}</div>;
});
function CopyButton({value}:{value:string}){
 const [status,setStatus]=useState('복사');
 return <button className="text-button" onClick={async()=>{try{await navigator.clipboard.writeText(value);setStatus('복사됨');}catch{setStatus('직접 선택해 복사해 주세요');}}}><Icon name="copy"/><span aria-live="polite">{status}</span></button>;
}
export const blockAnchor=(id:string,i:number)=>`${id}-b${i}`;
function Checkpoint({block,saved,onAnswer}:{block:Extract<StudyBlock,{type:'checkpoint'}>;saved:number|undefined;onAnswer:(n:number)=>void}){
 const [choice,setChoice]=useState<number|undefined>(saved);const checked=choice!==undefined&&saved===choice;
 return <section className="checkpoint" aria-label="이해 확인 문제"><div className="eyebrow">CHECK YOUR UNDERSTANDING</div><h3>{block.question}</h3>
 <div className="choices">{block.choices.map((c,i)=><button key={i} className={`choice ${choice===i?'selected':''} ${checked&&i===block.answer?'correct':''}`} aria-pressed={choice===i} onClick={()=>setChoice(i)}><span>{String.fromCharCode(65+i)}</span>{c}</button>)}</div>
 <button className="button primary" disabled={choice===undefined} onClick={()=>{if(choice!==undefined)onAnswer(choice);}}>답 확인하기 <Icon name="arrow"/></button>
 {checked&&<div className={`feedback ${saved===block.answer?'right':'retry'}`} aria-live="polite"><strong>{saved===block.answer?'잘 이해하셨어요.':'다시 생각해 볼까요?'}</strong><p>{block.feedback}</p><p className="muted">다른 답을 골라 다시 확인할 수 있습니다.</p></div>}
 </section>;
}
export function Lab({kind}:{kind:LabKind}){
 const id=useId();const [value,setValue]=useState(kind==='derivative'?0.5:kind==='integral'?8:kind==='sampling'?64:1);const [seed,setSeed]=useState(21);
 const samples=useMemo(()=>{let s=seed;return Array.from({length:2048},()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296;});},[seed]);
 const n=Math.round(value);let title='',description='',label='',result:ReactNode=null,graphic:ReactNode=null,min=1,max=64,step=1;
 if(kind==='derivative'){
  title='간격을 줄여 변화율 보기';description='f(x)=x², x=2에서 비교합니다. 한 점에 가까워지는 두 점의 기울기를 관찰하세요.';label='입력 간격 h';min=0.01;max=1;step=0.01;
  result=<><span>두 점의 평균 변화율</span><strong>{(4+value).toFixed(2)}</strong><small>정확한 미분값 4에 가까워집니다.</small></>;
  const x=(t:number)=>25+t*110,y=(t:number)=>180-t*t*16;
  graphic=<svg viewBox="0 0 420 200" role="img" aria-label="제곱 함수와 두 점을 지나는 선"><path d="M25 15V180H405" className="plot-axis"/><path d={`M${Array.from({length:70},(_,i)=>{const t=i/20;return `${x(t)},${y(t)}`;}).join(' L')}`} className="plot-line"/><path d={`M${x(2)},${y(2)} L${x(2+value)},${y(2+value)}`} className="plot-secant"/><circle cx={x(2)} cy={y(2)} r="5" className="plot-dot"/><circle cx={x(2+value)} cy={y(2+value)} r="5" className="plot-dot"/></svg>;
 }else if(kind==='integral'){
  title='작은 직사각형들을 더해 보기';description='0~1 구간의 f(x)=x²를 왼쪽 끝값으로 계산합니다. 조각 수를 늘려 근사가 어떻게 달라지는지 보세요.';label='조각 수 N';min=2;max=64;
  const sum=Array.from({length:n},(_,i)=>(i/n)**2/n).reduce((a,b)=>a+b,0);
  result=<><span>직사각형 넓이의 합</span><strong>{sum.toFixed(5)}</strong><small>정확한 적분값 1/3 ≈ 0.33333</small></>;
  graphic=<svg viewBox="0 0 420 200" role="img" aria-label="제곱 함수 아래의 왼쪽 직사각형 합"><path d="M25 15V180H405" className="plot-axis"/>{Array.from({length:n},(_,i)=><rect key={i} x={25+370*i/n} y={180-155*(i/n)**2} width={370/n} height={155*(i/n)**2} className="plot-rect"/>)}<path d={`M${Array.from({length:41},(_,i)=>`${25+370*i/40},${180-155*(i/40)**2}`).join(' L')}`} className="plot-line"/></svg>;
 }else if(kind==='transmittance'){
  title='안개를 지나는 거리 바꿔 보기';description='균일한 매질의 소멸 계수를 0.7/m로 고정했습니다. 산란되어 새로 들어오는 빛은 계산하지 않는 직진 투과 실험입니다.';label='이동 거리 (m)';min=0;max=5;step=0.1;
  const t=Math.exp(-0.7*value);result=<><span>직진하며 남은 비율</span><strong>{(t*100).toFixed(1)}%</strong><small>T = exp(-0.7 × {value.toFixed(1)})</small></>;
  graphic=<div className="transmittance-meter" role="img" aria-label={`직진 투과율 ${(t*100).toFixed(1)}퍼센트`}><div style={{width:`${t*100}%`}}/></div>;
 }else{
  title='표본으로 적분값 추정하기';description='0~1의 균일 표본에서 x²를 평균냅니다. 표본을 늘려도 한 시행의 오차가 항상 감소하지는 않습니다.';label='표본 수 N';min=16;max=2048;step=16;
  const estimate=samples.slice(0,n).reduce((a,x)=>a+x*x,0)/n;result=<><span>표본 평균</span><strong>{estimate.toFixed(5)}</strong><small>정확한 값 0.33333 · 절대 오차 {Math.abs(estimate-1/3).toFixed(5)}</small></>;
  graphic=<svg viewBox="0 0 420 130" role="img" aria-label="단위 구간에서 고른 무작위 표본"><path d="M15 110H405" className="plot-axis"/>{samples.slice(0,Math.min(n,160)).map((x,i)=><circle key={i} cx={15+x*390} cy={20+(i%8)*10} r="2.5" className="plot-dot"/>)}</svg>;
 }
 return <section className="lab" aria-label={title}><div className="eyebrow">작은 실험실</div><h3>{title}</h3><p>{description}</p><div className="lab-grid"><div>{graphic}</div><output className="lab-output" htmlFor={id}>{result}</output></div><label htmlFor={id}>{label}<span>{kind==='derivative'?value.toFixed(2):kind==='transmittance'?value.toFixed(1):n}</span></label><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e=>setValue(Number(e.target.value))}/>{kind==='sampling'&&<button className="text-button" onClick={()=>setSeed(s=>s+1)}>다른 난수 시드로 다시 보기</button>}</section>;
}
export function ReadingBlocks({lesson,compare,answers,onAnswer,onZoom}:{lesson:Lesson;compare:boolean;answers:Record<string,number>;onAnswer:(key:string,n:number)=>void;onZoom:(src:string,title:string)=>void}){
 return <div className="reading-blocks">{lesson.blocks.map((b,i)=>{
 const id=blockAnchor(lesson.id,i);let node:ReactNode;
 switch(b.type){
  case 'subheading':{const H=b.level===4?'h4':b.level===3?'h3':'h2';node=<H className="section-heading">{b.titleKo}</H>;break;}
  case 'paragraph':node=<><RichText text={b.textKo}/>{compare&&b.textEn&&<details className="english-reference" open><summary>기존 영문 참고 · 원문 일치 미검수</summary><div lang="en"><RichText text={b.textEn}/></div></details>}</>;break;
  case 'equation':node=<div className="equation"><MathView tex={b.tex} display/>{b.explanationKo&&<div className="equation-explanation"><span>기호 읽기</span><RichText text={b.explanationKo}/></div>}</div>;break;
  case 'code':node=<section className="code-block"><header><span>{b.chunkName}</span><CopyButton value={b.code}/></header>{lesson.provenance==='legacy'&&<p className="code-notice">기존 수록 예제 · PBRT 원본과의 일치 여부는 미검수</p>}<pre tabIndex={0} aria-label="코드 예제"><code>{b.code}</code></pre>{b.explanationKo&&<div className="code-explanation"><RichText text={b.explanationKo}/></div>}</section>;break;
  case 'figure':node=<figure className="book-figure"><button className="figure-button" onClick={()=>onZoom(b.src,b.titleKo)} aria-label={`${b.number} 그림 확대`}><img loading="lazy" src={b.src} alt={b.titleKo} onError={e=>{e.currentTarget.classList.add('image-unavailable');e.currentTarget.alt='그림을 불러오지 못했습니다. 원문 링크에서 확인해 주세요.';}}/><span><Icon name="focus"/>확대</span></button><figcaption><span className="figure-number">{b.number}</span><details><summary>기존 캡션 보기 · 그림 매핑 검수 대기</summary><RichText text={b.captionKo}/></details><a href={lesson.source} target="_blank" rel="noopener noreferrer">공식 원문에서 그림 확인 <Icon name="external"/></a></figcaption></figure>;break;
  case 'concept-tip':node=<details className="concept"><summary><span>더 쉽게</span>{b.title.replace(/^(?:💡|🎯|🔬|📊)\s*/u,'')}</summary><div>{b.summary!==b.title&&<RichText text={b.summary}/>} {b.points.map((p,j)=><section key={j}><h4>{p.title}</h4><RichText text={p.content}/></section>)}</div></details>;break;
  case 'checkpoint':node=<Checkpoint key={id} block={b} saved={answers[`${lesson.id}-q${i}`]} onAnswer={n=>onAnswer(`${lesson.id}-q${i}`,n)}/>;break;
  case 'lab':node=<Lab key={id} kind={b.kind}/>;break;
  default:{const unexpected:never=b;node=<p className="notice error">지원되지 않은 콘텐츠 블록입니다: {JSON.stringify(unexpected)}</p>;}
 }
 return <section className={`reading-block block-${b.type}`} id={id} key={id} data-block-index={i}>{node}</section>;
 })}</div>;
}
