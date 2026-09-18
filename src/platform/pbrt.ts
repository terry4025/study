import type { BookPackage, SourceEntry } from './types.js';
import type { Lesson } from '../reader/types.js';
import { PBRT_TOC } from '../data/books/pbrt-4ed/toc';
import { curriculum } from '../reader/curriculum.js';
import { glossary } from '../reader/glossary.js';
import { adaptLegacy } from '../reader/legacy.js';
import rawOutline from './pbrt-outline.json';
import readings from './pbrt-readings.json';
const outline: SourceEntry[] = rawOutline.map(e=>({...e,coverage:e.coverage==='legacy-note'?'legacy-note':'reading-guide',review:'pending'}));
const guides:Lesson[]=readings.map((r,index)=>{
    const entry=outline.find(e=>e.number===r.number)!;
    if(!entry)throw new Error('Missing outline entry: '+r.number);
    const id=entry.lessonId;
    // Alternate the answer position; never grade by displayed order assumptions.
    const reversed=index%2===1;
    return {id,chapter:entry.chapter,chapterTitle:entry.chapterTitle,title:r.number+' · '+r.title,
        deck:'원문 전에 읽는 짧은 안내 · 독립 예제와 확인 문제',kind:'reading-guide',minutes:4,
        goals:[r.title+'의 핵심 구분을 설명하기','작은 예제를 계산하고 원문에서 구현 조건 찾기'],
        prerequisites:entry.chapter==='C'?['math-08']:['math-05','math-06','math-08'],
        notice:'원문 전체 번역이나 해당 절의 모든 내용을 다룬 수업이 아닙니다. 핵심 개념을 준비하는 독자 안내입니다. 상세 수식·증명·구현은 아래 공식 원문에서 이어 읽으세요.',
        references:[{title:'PBRT 4판 '+entry.number+' 공식 원문',url:entry.url,role:'further-reading'}],
        blocks:[
            {type:'heading',id:id+'-idea',text:'먼저 잡을 생각'},
            {type:'paragraph',id:id+'-concept',text:r.concept},
            {type:'heading',id:id+'-example',text:'작은 예제로 확인하기'},
            {type:'paragraph',id:id+'-worked',text:r.worked},
            {type:'quiz',id:id+'-quiz',question:r.question,options:reversed?[...r.options].reverse():r.options,answer:reversed?1:0,feedback:r.feedback},
            {type:'aside',id:id+'-next',title:'공식 원문으로 이어 읽기',text:'위의 개념과 예제는 출발점입니다. 출처를 열고 입력·출력·가정·예외를 표시해 보세요. 원문 학습 지도에서 실제로 읽은 절을 직접 체크할 수 있습니다. 이 안내를 읽었다고 원문 읽음이나 검수 완료로 자동 처리하지 않습니다.'}
        ]};
});
export const pbrtBook:BookPackage={
    id:'pbrt-4ed',title:'물리 기반 렌더링',subtitle:'PBRT · 제4판 학습 동반자',
    description:'수학 준비 수업, 보존한 학습 노트, 독자 입문 강의, 원문 읽기 안내를 함께 사용합니다.',
    coverLines:['빛을','이해하는','시간'],sourceUrl:'https://pbr-book.org/4ed/contents',status:'available',
    scope:'기존 1~8장 노트와 독자 입문 강의를 보존합니다. 9~16장 및 부록 A~C의 각 절에는 짧은 독자 읽기 안내와 예제를 연결했습니다. 공식 목차의 번호 있는 105개 절을 추적하지만, 이는 105개 절의 완역·상세 해설 완료를 뜻하지 않습니다. 기존 노트의 전수 대조는 미완료이며, 원문 연습문제와 더 읽을거리는 공식 사이트로 연결합니다.',
    lessons:[...curriculum,...guides],glossary,outline,
    chapterResources:Object.fromEntries([...new Set(outline.map(e=>e.chapter))].map(chapter=>{
        const source=outline.find(e=>e.chapter===chapter)!.url;
        const base=source.slice(0,source.lastIndexOf('/'));
        return [chapter,[{title:'원서의 더 읽을거리',url:base+'/Further_Reading'},...(chapter==='16'?[]:[{title:'원서 연습문제',url:base+'/Exercises'}])]];
    })),
    legacy:{toc:PBRT_TOC,load:()=>import('../data/sections').then(m=>m.SECTIONS_MAP),adapt:adaptLegacy}
};
