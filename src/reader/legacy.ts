import type { Block, Lesson } from './types.js';
import type { SectionContent } from '../types/book.js';
const tidy = (s: string) => s.replace(/^제\d+장\s*/, '').replace(/^\d+\.\d+\s*/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
const chapterNames: Record<string, string> = { '1': '렌더링의 첫걸음', '2': '몬테카를로 적분', '3': '기하학과 변환', '4': '빛의 양과 색', '5': '카메라와 필름', '6': '형상과 교차 검사', '7': '가속 구조', '8': '샘플링과 복원' };
const notices: Record<string, string> = {
    'ch02-01': '정정: N의 제곱근에 반비례하는 표준오차는 독립 표본·유한 분산 등의 조건을 전제로 합니다. 차원이 높아져도 실제 계산 비용이나 분산이 같다는 뜻은 아닙니다. 전통적 수치적분의 차수도 방법과 매끄러움 조건에 따라 다릅니다.',
    'ch04-01': '정정: Radiance(방사휘도, W/(m²·sr))와 Luminance(휘도, cd/m²)는 다른 물리량입니다. 무편광·형광 배제 등은 모델링 가정이지 자연의 절대 법칙이 아닙니다. 센서는 입사광을 면적·방향·시간·파장에 대해 적분하고 응답을 반영합니다. 최종 RGB가 방사휘도 하나에 언제나 정확히 비례한다고 단정하지 않습니다.',
    'ch05-02': '안내: 래스터 좌표는 픽셀 격자와 연결되지만 샘플 위치는 실수 좌표일 수 있습니다. 얇은 렌즈는 피사계 심도를 근사하는 모델이지 모든 실제 렌즈 현상의 완전한 재현이 아닙니다. 그림의 번호·의미 연결은 별도 대조가 필요합니다.',
    'ch07-03': '정정: 일반적인 물체 분할 이진 BVH에서 N개 프리미티브의 노드 수는 최대 2N−1입니다. 리프에 여러 프리미티브가 들어가면 더 적습니다. 가장 긴 축 분할이 겹침을 언제나 최소화하거나 배열 배치가 캐시 미스를 제거하지는 않습니다. 설명용 코드와 실제 4판 구현은 별도 확인이 필요합니다.',
    'ch08-01': '정정: 그림 번호·파일·캡션의 매핑에 불일치가 발견되어 기존 캡션을 기본적으로 숨겼습니다. 독립 무작위 샘플링이 자동으로 청색 잡음을 만드는 것은 아닙니다. 샘플링 정리의 경계 조건과 대역 제한을 함께 확인해야 합니다.'
};
const cleanText = (s: string) => s.replace(/\\n/g, '\n');
function revisedText(id: string, value: string): string {
    let s = cleanText(value);
    if (id === 'ch04-01') {
        s = s.replace(/휘도\/방사도|방사도\/휘도/g, '방사휘도')
            .replace(/(?<!방사)휘도\(Radiance/g, '방사휘도(Radiance')
            .replace(/조도\/복사도|복사도 \/ 조도/g, '복사조도')
            .replace(/5대 공리/g, '5가지 모델링 가정').replace(/절대 법칙/g, '모델링 가정');
    }
    if (id === 'ch07-03')
        s = s.replace('리프 노드의 개수는 정확히 $N$개, 내부 노드의 개수는 $N-1$개로', '리프마다 프리미티브 하나를 저장하는 경우 리프는 $N$개, 내부 노드는 $N-1$개이며, 일반적으로는').replace('캐시 미스를 박멸하기 위해', '캐시 지역성을 개선하기 위해');
    return s;
}
function triangleCorrection(): Lesson {
    const id = 'ch06-05';
    const blocks: Block[] = [
        { type: 'heading', id: id + '-correction', text: '정정 · 다른 알고리즘으로 바꿔 설명하지 않습니다' },
        { type: 'paragraph', id: id + '-b1', text: '기존 노트는 묄러–트룸보어를 이 절의 핵심 교차 구현처럼 설명했습니다. PBRT 4판의 주된 광선–삼각형 교차 설명은 좌표를 바꾸고 에지 함수를 계산하는 견고한 방법을 다룹니다. 아래는 차이를 이해하기 위한 독자적인 기초 해설이며, 원문의 전체 번역이나 코드 재현이 아닙니다. 기존 소스 파일은 그대로 보존합니다.' },
        { type: 'heading', id: id + '-b2', text: '삼각형을 빗맞히는 것이 왜 문제가 될까' },
        { type: 'paragraph', id: id + '-b3', text: '두 삼각형을 붙여 사각형을 만들었다고 생각해 보세요. 광선이 공유 모서리를 정확히 지난다면 적어도 한 삼각형과 만났다고 판정해야 합니다. 부동소수점 계산 때문에 두 삼각형 모두 바깥이라고 판단하면 면 사이에 실제로는 없는 틈이 생깁니다. 수학적 식이 맞는 것과 컴퓨터에서 경계를 일관되게 판정하는 것은 다른 문제입니다.' },
        { type: 'heading', id: id + '-b4', text: '광선에 맞추어 좌표계를 바꾸는 생각' },
        { type: 'paragraph', id: id + '-b5', text: '검사하기 쉬운 방향으로 광선과 삼각형을 함께 옮겨 놓으면, 투영된 평면에서 점이 세 변의 어느 쪽에 있는지 판단할 수 있습니다. 에지 함수는 그 방향을 부호로 알려 주는 계산입니다. 예를 들어 평면의 (0,0), (2,0), (0,2)가 만드는 삼각형에서 (0.5,0.5)는 세 변 안쪽에 있습니다. 경계의 작은 오차를 어떻게 처리하는지는 별도 수치 분석이 필요합니다.' },
        { type: 'equation', id: id + '-b5eq', tex: 'E(a,b,p)=(b_x-a_x)(p_y-a_y)-(b_y-a_y)(p_x-a_x)', explanation: '2차원 변 a→b와 점 p의 방향 관계를 보는 독립 교육용 식입니다. 삼각형 꼭짓점 순서를 일관되게 정해야 부호를 비교할 수 있습니다.' },
        { type: 'heading', id: id + '-b6', text: '무게중심 좌표는 섞는 비율입니다' },
        { type: 'paragraph', id: id + '-b7', text: '삼각형 내부의 점은 세 꼭짓점의 가중 평균으로 나타낼 수 있습니다. 가중치가 각각 0.5, 0.25, 0.25이면 첫 꼭짓점의 영향을 절반, 나머지를 각각 1/4씩 반영합니다. 이 비율로 텍스처 좌표나 정점 법선을 보간할 수 있습니다. 보간한 법선은 필요에 따라 다시 정규화합니다.' },
        { type: 'equation', id: id + '-b8', tex: String.raw `p=b_0p_0+b_1p_1+b_2p_2,\qquad b_0+b_1+b_2=1`, explanation: '내부 점에서는 세 가중치가 모두 0 이상입니다. 꼭짓점과 모서리는 일부 가중치가 0인 경계 경우입니다.' },
        { type: 'aside', id: id + '-b9', title: '묄러–트룸보어는 별도의 관련 알고리즘입니다', text: '관련 기초 지식으로 학습할 수 있지만 실제 PBRT 4판의 해당 주 구현과 같은 것으로 표시하지 않습니다. 축약 코드를 원본이라고 표시하거나 경계·퇴화·반올림 처리를 생략한 채 100% 정확하다고 주장하지 않습니다.', tone: 'warning' },
        { type: 'quiz', id: id + '-quiz', question: '두 삼각형의 공유 모서리를 지나는 광선에서 특히 확인할 것은?', options: ['두 삼각형이 모두 교차를 놓치는 틈이 생기는지', '항상 가장 긴 변수 이름을 쓰는지', 'UV 이미지의 파일 크기만'], answer: 0, feedback: '공유 경계에서 일관된 판정이 필요합니다. 식의 모양뿐 아니라 부동소수점 계산과 경계 조건을 함께 검증합니다.' }
    ];
    return { id, chapter: '6', chapterTitle: '형상과 교차 검사', title: '삼각 메시 · 정정 해설', deck: '공유 모서리와 수치 안정성부터 다시 이해합니다.', kind: 'correction', minutes: 10, goals: ['원문의 핵심 구현과 관련 알고리즘 구분', '무게중심 좌표의 의미 이해'], prerequisites: ['math-05', 'math-08'], blocks, references: [{ title: 'PBRT 4판 · Triangle Meshes 원문', url: 'https://pbr-book.org/4ed/Shapes/Triangle_Meshes', role: 'further-reading' }], notice: '이 화면은 발견된 알고리즘 불일치를 바로잡는 독자 해설입니다. 기존 번역 파일은 삭제하거나 덮어쓰지 않았습니다.' };
}
export function adaptLegacy(id: string, source: SectionContent): Lesson {
    if (id === 'ch06-05')
        return triangleCorrection();
    const blocks: Block[] = source.blocks.map((block, index) => {
        const key = ('id' in block && block.id) || `${id}-b${index + 1}`;
        const text = (s: string) => revisedText(id, s);
        switch (block.type) {
            case 'paragraph': return { type: 'paragraph', id: key, text: text(block.textKo), english: cleanText(block.textEn) };
            case 'subheading': return { type: 'heading', id: key, text: text(block.titleKo), level: block.level };
            case 'equation': return { type: 'equation', id: key, tex: block.tex, explanation: block.explanationKo ? text(block.explanationKo) : undefined };
            case 'code': return { type: 'code', id: key, code: block.code, language: block.language, title: block.chunkName, explanation: block.explanationKo ? text(block.explanationKo) : undefined, provenance: 'legacy-unverified' };
            case 'figure': return { type: 'figure', id: key, src: block.src, title: block.titleKo, caption: text(block.captionKo), verified: false };
            case 'concept-tip': return { type: 'aside', id: key, title: text(block.title.replace(/[💡🔬🎯📊]/gu, '')), text: [block.summary, ...block.points.map(p => `**${p.title}**\n\n${p.content}`)].map(text).join('\n\n') };
            default: return { type: 'unknown', id: key, label: String((block as {
                    type?: string;
                }).type || '이름 없는 블록') };
        }
    });
    let goals = source.summary.keyTakeaways.map(x => revisedText(id, x));
    if (id === 'ch02-01')
        goals = goals.map(x => x.includes('차원의 저주') ? '독립 표본과 유한 분산을 전제로 몬테카를로 표준오차는 표본 수의 제곱근에 반비례합니다. 수렴 지수가 차원에 직접 의존하지 않아도 분산과 계산 비용은 달라질 수 있습니다.' : x);
    if (id === 'ch08-01')
        goals = goals.map(x => x.includes('청색 잡음') ? '날카로운 경계의 고주파 성분은 앨리어싱을 유발합니다. 무작위 표본과 청색 잡음 표본은 같지 않으며 적절한 필터와 표본 배치를 함께 고려합니다.' : x);
    return { id, chapter: source.chapterNumber, chapterTitle: chapterNames[source.chapterNumber] || tidy(source.chapterTitleKo), title: tidy(source.sectionTitleKo), deck: `${source.sectionNumber} · 보존한 한국어 학습 노트`, kind: 'legacy', minutes: Math.max(5, Math.ceil(JSON.stringify(source.blocks).length / 1900)), goals, prerequisites: [], blocks, references: [{ title: '출처에서 실제 원문 읽기', url: source.originalUrl, role: 'further-reading' }], notice: notices[id] || '기존 한국어 학습 노트를 보존했습니다. 전체 원문 대조가 완료된 자료는 아니며, 영어 필드·코드·그림 캡션의 원문 일치 여부는 별도 검수가 필요합니다.' };
}
