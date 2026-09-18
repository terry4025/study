import { SECTIONS_MAP } from '../data/sections';
import type { SectionContent, ContentBlock } from '../types/book';
import { FOUNDATIONS } from './foundations';
import { CH09_10 } from './chapters09-10';
import { CH11_12 } from './chapters11-12';
import { CH13_16 } from './chapters13-16';
import { makeLesson, CHAPTERS, type Lesson, type StudyBlock } from './types';
export { CHAPTERS };
export function cleanTitle(s:string):string { return s.replace(/^\d+\.\d+\s*/, '').trim(); }
function terminology(s:string):string {
  return s.replace(/휘도\/방사도/g,'방사휘도').replace(/방사도\/휘도/g,'방사휘도')
    .replace(/휘도\(Radiance/g,'방사휘도(Radiance').replace(/입사 휘도/g,'입사 방사휘도')
    .replace(/조도\/복사도/g,'복사조도').replace(/복사도 \/ 조도/g,'복사조도')
    .replace(/5가지 절대 법칙/g,'5가지 모델링 가정').replace(/5대 공리/g,'5가지 가정')
    .replace(/캐시 미스를 박멸하기 위해/g,'캐시 지역성을 개선하기 위해');
}
function legacyLesson(id:string, original:SectionContent):Lesson {
  const s:SectionContent=JSON.parse(JSON.stringify(original));
  const blocks=s.blocks.map((b):ContentBlock=> {
    if(b.type==='paragraph')return {...b,textKo:terminology(b.textKo)};
    if(b.type==='figure')return {...b,captionKo:terminology(b.captionKo),titleKo:terminology(b.titleKo)};
    if(b.type==='equation')return {...b,explanationKo:b.explanationKo&&terminology(b.explanationKo)};
    if(b.type==='concept-tip')return {...b,title:terminology(b.title),summary:terminology(b.summary),points:b.points.map(p=>({title:terminology(p.title),content:terminology(p.content)}))};
    return b;
  });
  if(id==='ch07-03')for(const b of blocks)if(b.type==='paragraph'&&b.textKo.includes('리프 노드의 개수는 정확히'))b.textKo='PBRT의 물체 분할 BVH에서는 각 프리미티브가 한 리프에 속합니다. 리프마다 프리미티브를 정확히 하나씩 저장하는 비어 있지 않은 이진 BVH라면 N개 프리미티브에 리프 N개, 내부 노드 N-1개가 있습니다. 한 리프에 여러 프리미티브를 저장할 수 있으므로 일반적으로 총 노드 수는 정확히 2N-1이 아니라 최대 2N-1입니다. 이 상한은 프리미티브를 중복 배치하지 않는 해당 구조에 대한 설명입니다.';
  const notices:Record<string,string>={
    'ch02-01':'조건 보완: 독립 표본과 유한한 분산에서 표준오차가 N의 제곱근에 반비례합니다. 비편향성에는 기여가 있는 곳을 샘플링할 수 있는 분포와 올바른 확률 보정이 필요합니다. 차원이 달라도 실제 계산 난이도가 같다는 뜻은 아닙니다.',
    'ch04-01':'용어·가정 보완: Radiance는 방사휘도, Luminance는 휘도, Irradiance는 복사조도로 구분합니다. 무편광·형광 배제·정상 상태는 PBRT의 모델링 가정이며 자연의 절대 법칙이 아닙니다.',
    'ch07-03':'노드 수 설명 정정: 프리미티브 하나를 리프 하나에 저장할 때만 2N-1개가 됩니다. 여러 프리미티브를 한 리프에 담는 PBRT 구조에서는 상한입니다.',
    'ch08-01':'검수 안내: 기존 그림의 파일·번호·캡션 매핑은 전수 확인되지 않았습니다. 그림을 공식 원문에서 함께 확인하세요. 대역 제한과 적절한 샘플링·복원 조건 없이 완벽한 복원을 보장할 수는 없습니다.',
  };
  if(id==='ch02-01')for(const b of blocks)if(b.type==='paragraph'&&b.textKo.includes('언제나')&&b.textKo.includes('차원'))b.textKo=b.textKo.replace('언제나','독립 표본과 유한한 분산이라는 조건에서');
  return {id,number:s.sectionNumber,chapter:Number(s.chapterNumber),title:cleanTitle(s.sectionTitleKo),subtitle:s.sectionTitle,goal:terminology(s.summary.keyTakeaways[0]||''),prerequisites:['ch00-01','ch00-02','ch00-03','ch00-04','ch00-05','ch00-06'],source:s.originalUrl,provenance:'legacy',blocks,notice:notices[id]||'기존 학습 해설을 보존했습니다. 전체 문장·그림·코드의 원문 대조 검수는 아직 완료되지 않았습니다.'};
}
const triangle=makeLesson({chapter:6,section:5,title:'삼각 메시와 경계에 틈이 없는 교차 검사',topic:'Triangle Meshes · corrected learning note',source:'https://pbr-book.org/4ed/Shapes/Triangle_Meshes',goal:'PBRT 4판의 삼각형 교차 구현을 다른 입문 알고리즘과 구별합니다.',prerequisites:['ch00-02','ch03-06'],intuition:'바닥을 삼각형 두 개로 나눴을 때, 정확히 두 삼각형의 경계에 닿은 광선이 둘 다 빗나갔다고 계산되면 바닥에 틈이 보입니다. 삼각형 내부인지 판단하는 것뿐 아니라, 계산 오차가 있어도 공유 경계를 일관되게 다루는 것이 중요합니다.',explanation:'메시는 정점 배열과 각 삼각형의 정점 인덱스를 공유하여 같은 위치를 반복 저장하지 않도록 구성할 수 있습니다. 메모리 절약 비율은 정점 공유 정도와 속성·인덱스 크기에 따라 달라집니다.\n\nPBRT 4판의 중심 광선–삼각형 교차 구현은 광선을 기준으로 좌표를 변환하고, 투영된 삼각형의 에지 함수로 내부 여부를 판정합니다. 모호한 경우의 정밀도와 교차 거리의 오차도 다룹니다. 무게중심 좌표는 교점의 정점별 가중치이며 텍스처 좌표나 셰이딩 법선을 보간하는 데 사용할 수 있습니다.\n\n묄러–트룸보어는 광선 방정식과 삼각형의 매개변수 표현을 연립해 푸는 유용한 별도 입문 알고리즘입니다. 하지만 이를 해당 PBRT 4판 절의 중심 구현으로 소개하던 기존 설명은 바로잡았습니다. 원래 콘텐츠 파일은 저장소에 보존되어 있으며 이 정정 해설이 리더에서 대신 표시됩니다.',example:'교점의 가중치가 (0.2,0.3,0.5)이면 합은 1입니다. 정점의 텍스처 u값이 (0,1,0)이라면 보간된 u는 0.2×0+0.3×1+0.5×0=0.3입니다. 법선을 보간한 경우에는 길이를 다시 정규화해야 할 수 있습니다.',tex:String.raw`p=b_0p_0+b_1p_1+b_2p_2,\qquad b_0+b_1+b_2=1`,symbols:'p₀,p₁,p₂는 꼭짓점입니다. b₀,b₁,b₂는 그 꼭짓점에 배정한 가중치입니다. 비퇴화 삼각형 내부에서는 각 가중치가 음수가 아닙니다.',caution:'짧은 교차 코드가 모든 입력에서 100% 정확하다고 보장할 수는 없습니다. 거의 평행한 광선, 매우 작은 삼각형, 공유 경계와 반올림 오차를 따로 검사해야 합니다. 이 정정 노트는 원문의 전체 구현·유도에 대한 완역이 아닙니다.',question:'공유 경계에 닿은 광선을 두 삼각형이 모두 놓치면?',choices:['표면에 틈처럼 보이는 오류가 생길 수 있다','항상 정상이다','텍스처 해상도만 높아진다'],answer:0,feedback:'경계의 수치적 일관성이 중요한 이유입니다. 좌표 변환과 에지 함수, 오차 처리를 함께 검토해야 합니다.'});
triangle.provenance='correction';
triangle.notice='기존 6.5절의 중심 알고리즘 설명을 정정한 독자 학습 노트입니다. 원문에 없는 캡션을 공식 그림 설명처럼 표시하지 않습니다.';
const legacy=Object.entries(SECTIONS_MAP).map(([id,s])=>id==='ch06-05'?triangle:legacyLesson(id,s));
export const LESSONS:Lesson[]=[...FOUNDATIONS,...legacy,...CH09_10,...CH11_12,...CH13_16].sort((a,b)=>a.chapter-b.chapter||Number(a.number.split('.')[1])-Number(b.number.split('.')[1]));
export const LESSON_MAP=Object.fromEntries(LESSONS.map(l=>[l.id,l])) as Record<string,Lesson>;
export const MAIN_LESSONS=LESSONS.filter(l=>l.chapter>0);
export function blockText(b:StudyBlock):string {
  switch(b.type){
    case 'paragraph':return `${b.textKo} ${b.textEn}`;
    case 'subheading':return `${b.titleKo} ${b.titleEn||''}`;
    case 'figure':return `${b.titleKo} ${b.captionKo}`;
    case 'code':return `${b.chunkName} ${b.code} ${b.explanationKo||''}`;
    case 'equation':return `${b.tex} ${b.explanationKo||''}`;
    case 'concept-tip':return `${b.title} ${b.summary} ${b.points.map(p=>`${p.title} ${p.content}`).join(' ')}`;
    case 'checkpoint':return `${b.question} ${b.choices.join(' ')} ${b.feedback}`;
    case 'lab':return '';
    default:{const n:never=b;throw new Error(`Unknown block: ${JSON.stringify(n)}`);}
  }
}
export interface SearchResult{lesson:Lesson;block:number;snippet:string;}
const index=LESSONS.map(lesson=>({lesson,title:`${lesson.number} ${lesson.title} ${lesson.subtitle}`.toLocaleLowerCase(),blocks:lesson.blocks.map(blockText)}));
export function searchLessons(query:string):SearchResult[]{
  const q=query.trim().toLocaleLowerCase();if(!q)return [];const out:SearchResult[]=[];
  for(const e of index){const i=e.blocks.findIndex(t=>t.toLocaleLowerCase().includes(q));if(e.title.includes(q)||i>=0){const raw=i>=0?e.blocks[i]:e.lesson.goal;const p=Math.max(0,raw.toLocaleLowerCase().indexOf(q)-38);out.push({lesson:e.lesson,block:Math.max(0,i),snippet:(p?'…':'')+raw.slice(p,p+150).replace(/\s+/g,' ')+(raw.length>p+150?'…':'')});}if(out.length===40)break;}return out;
}
