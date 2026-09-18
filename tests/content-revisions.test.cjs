/** Pure unit/integration-fixture tests, not a full-book content audit.
 * Usage: PBRT_TEST_BUILD=<compiled reader root> node --test tests/content-revisions.test.cjs
 */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const build=process.env.PBRT_TEST_BUILD;
if(!build)throw new Error('Set PBRT_TEST_BUILD to the tsc CommonJS output directory.');
const {normalizeLegacyText}=require(path.join(build,'reader/legacy-text.js'));
const {REVISIONS,reviseLegacyContent}=require(path.join(build,'reader/content-revisions.js'));
const {adaptLegacy,blockText}=require(path.join(build,'reader/repository.js'));
const R=String.raw;
function source(section='ch02-01',blocks=[],goals=[]){
 const [chapter,number]=section.slice(2).split('-').map(Number);
 return {bookId:'pbrt-4ed',chapterNumber:String(chapter),chapterTitleKo:'테스트',sectionNumber:`${chapter}.${number}`,sectionTitle:'Fixture',sectionTitleKo:'검사 예제',originalUrl:'https://pbr-book.org/4ed/contents',summary:{keyTakeaways:goals},blocks};
}
const paragraph=textKo=>({type:'paragraph',textKo,textEn:'Stored English note'});

test('preserves n-prefixed TeX commands with and without delimiters',()=>{
 for(const text of [R`$\nu + \nabla f + x\neq y + \neg P$`,R`\nu \nabla \ne \neq \notin`])assert.equal(normalizeLegacyText(text),text);
});
test('repairs only unambiguous prose line breaks',()=>{
 assert.equal(normalizeLegacyText(R`첫 줄\n둘째 줄\n- 항목`),'첫 줄\n둘째 줄\n- 항목');
 assert.equal(normalizeLegacyText(R`one\nNext`),R`one\nNext`);
});
test('preserves literal escapes inside code and math',()=>{
 for(const text of ['`print("\\n")`','```cpp\nprint("\\n");\n```',R`$$\begin{matrix}a\\n\end{matrix}$$`,R`\(\nu\) and \[\nabla f\]`])assert.equal(normalizeLegacyText(text),text);
});
test('normalization is idempotent and preserves real line breaks',()=>{
 const text=R`이름\n$\nu$\n다음`+'\n끝';
 assert.equal(normalizeLegacyText(normalizeLegacyText(text)),normalizeLegacyText(text));
});
test('partial corrections are scoped to PBRT, never another book',()=>{
 const s=source('ch02-01',[paragraph('무작위로 뽑은 코사인 값들의 평균이 0이 되는 것은 너무나 당연하고 직관적인 결과입니다.')]);
 s.bookId='future-book';assert.equal(reviseLegacyContent('ch02-01',s).source,s);
});
test('a source excerpt is corrected without mutating the input',()=>{
 const s=source('ch02-01',[paragraph('무작위로 뽑은 코사인 값들의 평균이 0이 되는 것은 너무나 당연하고 직관적인 결과입니다.')]);
 const before=JSON.stringify(s),result=reviseLegacyContent('ch02-01',s);
 assert.equal(JSON.stringify(s),before);assert.equal(result.changes.length,1);
 assert.match(result.source.blocks[0].textKo,/매번 정확히 0이라는 뜻이 아닙니다/);
 assert.match(result.source.blocks[0].textEn,/not a verified translation/);
});
test('rules do not alter an English note or executable code by matching text',()=>{
 const match=REVISIONS[0].match;
 const s=source('ch02-01',[{type:'code',chunkName:'sample',language:'cpp',code:match}, {type:'paragraph',textKo:'유지',textEn:match}]);
 assert.equal(reviseLegacyContent('ch02-01',s).changes.length,0);
});
test('all rule IDs are unique and all individual rules are idempotent on a matching field fixture',()=>{
 assert.equal(new Set(REVISIONS.map(r=>r.id)).size,REVISIONS.length);
 for(const rule of REVISIONS){
  const s=source(rule.section);
  s[rule.field]=rule.match; // Algorithm-only fixture; not evidence of source coverage.
  const once=reviseLegacyContent(rule.section,s),twice=reviseLegacyContent(rule.section,once.source);
  assert(once.changes.some(c=>c.id===rule.id),rule.id);
  assert.equal(twice.changes.length,0,rule.id);
  assert.deepEqual(twice.source,once.source,rule.id);
 }
});
test('nonmatching text stays unchanged rather than being replaced fuzzily',()=>{
 const s=source('ch07-03',[paragraph('이미 다른 방식으로 교정한 설명')]);
 assert.deepEqual(reviseLegacyContent('ch07-03',s).source,s);
});
test('normal transformations: API restrictions are not numerical impossibility',()=>{
 const s=source('ch03-05',[paragraph('그러나 수학적으로 법선은 점에 더해질 수 없으며, 두 법선 사이의 외적은 기하학적으로 정의되지 않습니다.')]);
 assert.match(reviseLegacyContent('ch03-05',s).source.blocks[0].textKo,/타입마다 허용할/);
});
test('adapter keeps equation blocks and IDs while protecting LaTeX',()=>{
 const s=source('ch04-01',[{...paragraph(R`$\nu+\nabla f$`),id:'stable-id'},{type:'equation',tex:R`\nu=1`}]);
 const lesson=adaptLegacy('ch04-01',s);
 assert.equal(lesson.blocks[0].id,'stable-id');assert.equal(lesson.blocks[0].text,R`$\nu+\nabla f$`);
 assert.equal(lesson.blocks[1].type,'equation');assert.equal(lesson.blocks[1].tex,R`\nu=1`);
});
test('triangle correction no longer discards all existing lesson blocks',()=>{
 const rawCode='int vertexIndices[6] = {0,1,2,0,2,3};';
 const s=source('ch06-05',[{...paragraph('원래의 관련 기초 설명'),id:'ch06-05-b1'},{type:'code',chunkName:'example',code:rawCode,language:'cpp'},{type:'equation',tex:'A=bh/2'}]);
 const lesson=adaptLegacy('ch06-05',s);
 assert(lesson.blocks.some(b=>b.type==='paragraph'&&b.text==='원래의 관련 기초 설명'));
 assert(lesson.blocks.some(b=>b.type==='code'&&b.code===rawCode));
 assert(lesson.blocks.some(b=>b.type==='equation'&&b.tex==='A=bh/2'));
 assert(lesson.blocks.some(b=>b.id==='ch06-05-b1')); // current correction anchor preserved
 assert.equal(new Set(lesson.blocks.map(b=>b.id)).size,lesson.blocks.length);
 assert.match(lesson.notice,/미완료/);
});
test('unknown blocks remain observable instead of being silently dropped',()=>{
 const lesson=adaptLegacy('ch03-01',source('ch03-01',[{type:'unknown-future-type'}]));
 assert.equal(lesson.blocks[0].type,'unknown');assert.equal(blockText(lesson.blocks[0]),'unknown-future-type');
});
test('worked sampling-boundary counterexample',()=>{
 for(let n=0;n<8;n++)assert(Math.abs(Math.sin(2*Math.PI*(n/2)))<1e-12);
 assert.equal(Math.cos(0),1); // one sample need not equal the mean of cos on [0,pi]
});
test('worked BVH counterexample and Monte Carlo standard error ratio',()=>{
 const primitives=4,leaves=2,nodes=2*leaves-1;
 assert.equal(nodes,3);assert(nodes<2*primitives-1);
 assert.equal((1/Math.sqrt(400))/(1/Math.sqrt(100)),0.5);
});
test('indexed vertices do not universally save three times the memory',()=>{
 const unshared=2*3*3*4,shared=4*3*4+2*3*4;
 assert.equal(unshared,shared); // two triangles, four positions, 32-bit indices
});

test('known mismapped triangle figures are quarantined, not reintroduced as evidence',()=>{
 const s=source('ch06-05',[{type:'figure',id:'fig-6-19',number:'Figure 6.19',title:'Unverified',titleKo:'잘못 연결된 도판',src:'/books/pbrt-4ed/images/pha06f19.svg',captionKo:'잘못 연결된 설명',captionEn:'Unverified'}]);
 const lesson=adaptLegacy('ch06-05',s);
 assert(!lesson.blocks.some(b=>b.type==='figure'));
 assert(lesson.blocks.some(b=>b.id==='ch06-05-legacy-fig-6-19'&&b.type==='aside'&&b.tone==='warning'));
 assert.equal(s.blocks[0].type,'figure');
});

test('multi-book Repository keeps explicitly supplied lessons and custom adapter', async()=>{
 const {Repository}=require(path.join(build,'reader/repository.js'));
 const own={id:'own',chapter:'B',chapterTitle:'Other book',title:'Custom',deck:'Original',kind:'original',minutes:1,goals:[],prerequisites:[],blocks:[],references:[]};
 const supplied=source('ch06-05',[paragraph('다른 책 본문')]);supplied.bookId='other-book';
 const toc=[{id:'ch06',number:'6',title:'Test',titleKo:'Test',sections:[{id:'ch06-05',number:'6.5',title:'Topic',titleKo:'Topic',isAvailable:true}]}];
 const repository=new Repository(toc,async()=>({'ch06-05':supplied}),[own],(id)=>({...own,id}));
 assert.equal(await repository.get('own'),own);
 assert.equal(repository.has('math-01'),false);
 assert.equal((await repository.get('ch06-05')).title,'Custom');
});
test('default adapter does not apply PBRT-only corrections to another book',()=>{
 for(const id of ['ch04-01','ch06-05']){
  const s=source(id,[{...paragraph('휘도(Radiance): 다른 책 원본'),id:'keep-id'}]);s.bookId='other-book';
  const l=adaptLegacy(id,s);
  assert.equal(l.kind,'legacy');assert.equal(l.blocks.length,1);
  assert.equal(l.blocks[0].text,'휘도(Radiance): 다른 책 원본');assert.equal(l.blocks[0].id,'keep-id');
 }
});
test('multi-book search retains supplied lessons after a legacy-load failure',async()=>{
 const {Repository}=require(path.join(build,'reader/repository.js'));
 const own={id:'own',chapter:'B',chapterTitle:'Other book',title:'Needle',deck:'Original',kind:'original',minutes:1,goals:[],prerequisites:[],blocks:[{type:'paragraph',id:'p',text:'needle'}],references:[]};
 const toc=[{id:'ch01',number:'1',title:'Test',titleKo:'Test',sections:[{id:'old',number:'1.1',title:'Old',titleKo:'Old',isAvailable:true}]}];
 const repository=new Repository(toc,async()=>{throw new Error('intentional fixture');},[own]);
 const hits=await repository.search('needle');assert(hits.some(hit=>hit.lesson.id==='own'));assert.equal(repository.warnings.length,1);
});
