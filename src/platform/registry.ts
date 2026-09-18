import type { RegisteredBook } from './types.js';
export const books: RegisteredBook[] = [
    { card: {id:'pbrt-4ed',title:'물리 기반 렌더링',subtitle:'PBRT · 제4판 학습 동반자',description:'수학 기초부터 빛·재질·GPU까지. 기존 노트와 독자 해설을 원문에 연결합니다.',coverLines:['빛을','이해하는','시간'],sourceUrl:'https://pbr-book.org/4ed/contents',status:'available'},load:()=>import('./pbrt.js').then(m=>m.pbrtBook) },
    { card: {id:'ostep',title:'운영체제',subtitle:'Operating Systems: Three Easy Pieces',description:'기존 서재에 등록된 예정 도서입니다. 수록 판본과 학습 범위는 추가할 때 확정합니다.',coverLines:['컴퓨터가','함께 일하는','방법'],sourceUrl:'https://pages.cs.wisc.edu/~remzi/OSTEP/',status:'planned'} },
    { card: {id:'csapp',title:'컴퓨터 시스템',subtitle:"Computer Systems: A Programmer's Perspective",description:'기존 서재에 등록된 예정 도서입니다. 아직 수업을 제공하지 않습니다.',coverLines:['코드 아래','숨겨진','시스템'],sourceUrl:'https://csapp.cs.cmu.edu/',status:'planned'} },
    { card: {id:'ddia',title:'데이터 중심 애플리케이션',subtitle:'Designing Data-Intensive Applications',description:'기존 서재에 등록된 예정 도서입니다. 판본은 추가 시 확정합니다.',coverLines:['데이터를','믿고 쓰는','설계'],sourceUrl:'https://dataintensive.net/',status:'planned'} },
    { card: {id:'planned-04',title:'추가 도서 · 04',subtitle:'도서 미지정',description:'사용자가 정할 다음 책의 자리입니다. 내용과 원문 주소를 임의로 채우지 않습니다.',coverLines:['다음','배움의','자리'],sourceUrl:'',status:'planned'} },
    { card: {id:'planned-05',title:'추가 도서 · 05',subtitle:'도서 미지정',description:'총 여섯 권을 위한 서재입니다. 실제 책이 정해지면 새 패키지를 연결합니다.',coverLines:['또 다른','배움의','자리'],sourceUrl:'',status:'planned'} }
];
export function resolveBook(id:string) { return books.find(b=>b.card.id===id); }
