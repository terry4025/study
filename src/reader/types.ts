import type { ContentBlock } from '../types/book';

export type LabKind = 'derivative' | 'integral' | 'transmittance' | 'sampling';
export type StudyBlock = ContentBlock | { type: 'checkpoint'; question: string; choices: string[]; answer: number; feedback: string } | { type: 'lab'; kind: LabKind };
export interface Lesson {
  id: string;
  number: string;
  chapter: number;
  title: string;
  subtitle: string;
  goal: string;
  prerequisites: string[];
  source: string;
  provenance: 'legacy' | 'original' | 'correction';
  blocks: StudyBlock[];
  notice?: string;
}
export interface Chapter { number: number; title: string; subtitle: string; description: string; }
export interface Draft {
  chapter: number; section: number; title: string; topic: string; source: string;
  goal: string; intuition: string; explanation: string; example: string;
  tex?: string; symbols?: string; caution: string;
  question: string; choices: string[]; answer: number; feedback: string;
  prerequisites?: string[]; lab?: LabKind;
}
export function makeLesson(d: Draft): Lesson {
  const heading = (titleKo: string): ContentBlock => ({ type: 'subheading', level: 2, titleKo });
  const paragraph = (textKo: string): ContentBlock => ({ type: 'paragraph', textKo, textEn: '' });
  const blocks: StudyBlock[] = [
    heading('먼저, 익숙한 장면에서'), paragraph(d.intuition),
    heading('한 단계씩 이해하기'), paragraph(d.explanation),
    heading('숫자와 예제로 확인하기'), paragraph(d.example),
  ];
  if (d.tex) blocks.push(heading('수식을 말로 읽으면'), { type: 'equation', tex: d.tex, explanationKo: d.symbols });
  if (d.lab) blocks.push({ type: 'lab', kind: d.lab });
  blocks.push(heading('여기서 오해하지 않기'), paragraph(d.caution), {
    type: 'checkpoint', question: d.question, choices: d.choices, answer: d.answer, feedback: d.feedback,
  });
  return {
    id: `ch${String(d.chapter).padStart(2, '0')}-${String(d.section).padStart(2, '0')}`,
    number: `${d.chapter}.${d.section}`, chapter: d.chapter, title: d.title, subtitle: d.topic,
    goal: d.goal, prerequisites: d.prerequisites || ['ch00-01', 'ch00-02', 'ch00-05'],
    source: d.source, provenance: 'original', blocks,
  };
}
export const CHAPTERS: Chapter[] = [
  {number:0,title:'수학 준비실',subtitle:'Start with the basics',description:'미분·적분을 몰라도 괜찮습니다. 숫자, 방향, 변화, 합계부터 시작합니다.'},
  {number:1,title:'렌더링의 첫걸음',subtitle:'Introduction',description:'책과 코드의 관계, 광선 추적, 렌더러의 큰 그림.'},
  {number:2,title:'무작위로 합계 구하기',subtitle:'Monte Carlo Integration',description:'확률과 표본을 이용해 복잡한 빛의 합을 추정합니다.'},
  {number:3,title:'공간을 표현하는 방법',subtitle:'Geometry and Transformations',description:'점과 벡터, 법선, 광선, 좌표 변환을 다룹니다.'},
  {number:4,title:'빛을 숫자로 나타내기',subtitle:'Radiometry, Spectra, and Color',description:'빛의 양과 방향, 파장, 색의 관계를 이해합니다.'},
  {number:5,title:'카메라와 이미지',subtitle:'Cameras and Film',description:'3차원 장면이 픽셀에 기록되는 과정을 살펴봅니다.'},
  {number:6,title:'광선과 물체의 만남',subtitle:'Shapes',description:'다양한 형상과 광선의 교차점을 계산합니다.'},
  {number:7,title:'더 빠르게 물체 찾기',subtitle:'Intersection Acceleration',description:'BVH와 공간 탐색으로 불필요한 계산을 줄입니다.'},
  {number:8,title:'샘플에서 이미지로',subtitle:'Sampling and Reconstruction',description:'샘플링, 노이즈, 앨리어싱과 픽셀 복원.'},
  {number:9,title:'표면은 빛을 어떻게 돌려줄까',subtitle:'Reflection Models',description:'종이, 거울, 금속, 유리, 머리카락의 차이를 이해합니다.'},
  {number:10,title:'물체에 무늬와 재질 입히기',subtitle:'Textures and Materials',description:'텍스처 좌표와 필터링, 재질의 역할을 연결합니다.'},
  {number:11,title:'안개 속을 지나는 빛',subtitle:'Volume Scattering',description:'흡수, 산란, 투과율과 매질을 다룹니다.'},
  {number:12,title:'장면을 밝히는 조명',subtitle:'Light Sources',description:'점광원부터 하늘까지, 빛을 고르고 계산하는 방법.'},
  {number:13,title:'빛의 길을 따라 이미지 만들기',subtitle:'Surface Light Transport',description:'렌더링 방정식에서 패스 트레이싱까지 이어갑니다.'},
  {number:14,title:'공기와 내부까지 렌더링하기',subtitle:'Volume Light Transport',description:'공간 속 산란과 여러 겹 재질의 빛 전달.'},
  {number:15,title:'GPU가 함께 일하는 방법',subtitle:'Wavefront Rendering',description:'작업 큐, 병렬 처리와 메모리 설계를 배웁니다.'},
  {number:16,title:'배운 것을 하나의 시스템으로',subtitle:'Retrospective and the Future',description:'설계 선택을 돌아보고 작은 렌더러 프로젝트로 마무리합니다.'},
];
