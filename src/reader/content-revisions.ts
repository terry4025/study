import type { SectionContent } from '../types/book.js';

/** Targeted corrections to the user's existing notes, not a book translation.
 * Rules operate on identified fields, preserve the input and all block IDs,
 * and expose applied changes for review. They never mark a chapter complete.
 * Do not turn this into a global replacement of mathematical terminology.
 */
export interface Revision {
    id: string;
    section: string;
    field: string;
    match: string;
    replacement: string;
    whole?: boolean;
}
export interface AppliedRevision { id: string; path: string; }
const R = String.raw;
export const REVISIONS: readonly Revision[] = [
    {
        id: 'mc-expected-not-exact-sample', section: 'ch02-01', field: 'textKo',
        match: '무작위로 뽑은 코사인 값들의 평균이 0이 되는 것은 너무나 당연하고 직관적인 결과입니다.',
        replacement: '따라서 기댓값은 0입니다. 이것은 무작위로 몇 번 뽑은 값들의 평균이 매번 정확히 0이라는 뜻이 아닙니다. 유한한 표본의 평균은 흔들릴 수 있으며, 독립 표본을 충분히 모으면 0에 가까워집니다.'
    },
    {
        id: 'mc-unbiased-conditions', section: 'ch02-01', field: 'keyTakeaways',
        match: '은 수학적으로 기댓값이 원래 적분값과 정확히 일치하는 비편향(Unbiased) 추정량입니다.',
        replacement: '은 적분이 존재하고, 실제로 p에서 표본을 뽑으며, 기여가 있는 영역을 p가 빠뜨리지 않는 등의 조건 아래 비편향 추정량입니다. 비편향은 반복 실험의 평균이 참값과 같다는 뜻이지 한 번의 결과가 정확하다는 뜻은 아닙니다.'
    },
    {
        id: 'mc-rate-summary', section: 'ch02-01', field: 'keyTakeaways',
        match: '차원의 저주(Curse of Dimensionality', whole: true,
        replacement: R`격자 방식은 축마다 m개 점을 쓰면 d차원에서 m^d개 점이 필요합니다. 독립·동일 분포 표본의 분산이 유한할 때 몬테카를로 표준오차는 $1/\sqrt{N}$에 비례합니다. 이 지수에 d가 없어도 분산과 표본당 계산 비용은 문제에 따라 달라집니다.`
    },
    {
        id: 'quadrature-orders', section: 'ch02-01', field: 'content',
        match: '사다리꼴 공식(Trapezoidal rule)이나 심슨 공식', whole: true,
        replacement: R`격자를 촘촘히 만들면 보통 더 정확해지지만, 방법과 함수의 매끄러움에 따라 속도가 다릅니다. 충분히 매끄러운 1차원 함수에서 간격 h인 합성 사다리꼴 공식은 보통 $O(h^2)$, 합성 심슨 공식은 $O(h^4)$ 오차를 갖습니다. 두 방법을 모두 같은 차수로 쓰면 안 됩니다. 각 축에 m개 점을 두는 단순한 d차원 격자는 $m^d$개 점을 필요로 합니다. 예를 들어 10차원에서 축마다 4개면 $4^{10}=1,048,576$개입니다. 다차원 오차율을 모든 방법에 공통인 하나의 식으로 단정하지 않습니다.`
    },
    {
        id: 'quadrature-heading', section: 'ch02-01', field: 'title',
        match: '전통 수치적분의 치명적 한계: O(N^(-1/d))',
        replacement: '격자점 수와 수치적분 오차의 차이'
    },
    {
        id: 'mc-rate-body', section: 'ch02-01', field: 'content',
        match: '몬테카를로 적분의 오차 수렴 속도는 적분 공간이', whole: true,
        replacement: R`같은 분포에서 독립적으로 뽑은 표본의 기여를 Y라고 하고, 그 분산이 유한하다고 합시다. N개 평균의 분산은 $\operatorname{Var}(Y)/N$이고 표준오차는 $\sigma_Y/\sqrt{N}$입니다. N을 네 배로 늘리면 표준오차가 절반이 됩니다. 수렴 지수는 차원 수를 직접 포함하지 않지만, 차원이 바뀌면 $\sigma_Y$와 한 표본의 계산 비용이 커질 수 있습니다. 표본끼리 의존하거나 분산이 무한하면 이 계산을 그대로 적용할 수 없습니다.`
    },
    {
        id: 'noise-reduction-not-elimination', section: 'ch02-01', field: 'content',
        match: '노이즈를 $1/10$ 수준으로 완전히 없애려면',
        replacement: '같은 표본 분포에서 표준오차를 $1/10$ 수준으로 줄이려면(0으로 없앤다는 뜻은 아닙니다)'
    },
    {
        id: 'normals-api-not-math-impossibility', section: 'ch03-05', field: 'textKo',
        match: '그러나 수학적으로 법선은 점에 더해질 수 없으며, 두 법선 사이의 외적은 기하학적으로 정의되지 않습니다.',
        replacement: '다만 PBRT의 타입 설계에서는 법선을 일반적인 위치 이동 벡터와 구분하여, 점에 법선을 더하거나 두 Normal3를 외적하는 연산을 제공하지 않습니다. 이것은 좌표 세 성분으로 외적 계산 자체를 할 수 없다는 뜻이 아니라, 타입마다 허용할 기하학적 의미를 제한한 설계입니다.'
    },
    {
        id: 'radiometric-densities', section: 'ch04-01', field: 'keyTakeaways',
        match: '방사측정학의 4대 핵심 물리량은', whole: true,
        replacement: R`방사속은 단위 시간당 에너지입니다. 복사조도는 받는 면적당 방사속이고, 방사강도는 방향의 넓이인 입체각당 방사속입니다. 둘을 차례로 미분해 얻는 사슬로 생각하면 안 됩니다. 방사휘도는 투영 면적과 입체각을 함께 기준으로 한 밀도이며 단위는 $\mathrm{W}/(\mathrm{m}^2\,\mathrm{sr})$입니다.`
    },
    {
        id: 'radiance-invariance-conditions', section: 'ch04-01', field: 'keyTakeaways',
        match: '거리에 관계없이 **일정하게 보존', whole: true,
        replacement: '굴절률이 일정하고 흡수·산란·방출이 없는 경로에서는 광선을 따라 방사휘도가 일정합니다. 안개나 흡수성 매질에서도 언제나 일정한 것은 아닙니다. 방사휘도(Radiance)와 인간의 시감도를 반영한 휘도(Luminance)는 다른 물리량입니다.'
    },
    {
        id: 'sensor-integrates-light', section: 'ch04-01', field: 'content',
        match: '카메라 센서가 최종적으로 기록하는 이미지의 RGB 값은', whole: true,
        replacement: '센서 한 칸은 한 방향의 방사휘도 하나만 읽는 것이 아닙니다. 일정한 면적에 여러 방향과 파장에서 들어오는 빛을 노출 시간 동안 모으고, 센서의 파장별 반응도 반영합니다. 예를 들어 같은 빛이라도 노출 시간이 두 배면 선형·비포화 조건에서 모이는 신호가 두 배가 될 수 있습니다. 이후 색 변환과 톤 매핑까지 거친 최종 RGB가 방사휘도 하나에 언제나 정확히 비례한다고 말할 수는 없습니다.'
    },
    {
        id: 'polarization-model-assumption', section: 'ch04-01', field: 'content',
        match: '인간의 눈은 편광 선글라스나 특수 카메라 없이는', whole: true,
        replacement: '이 모델은 편광 상태를 별도로 추적하지 않는 단순화를 사용합니다. 편광은 반사·투과되는 빛의 양에 영향을 줄 수 있으므로, 사람이 편광 방향을 직접 구별하기 어렵다는 이유만으로 영상에 영향이 없다고 결론 내릴 수 없습니다. 현실의 모든 광학 현상이 아니라 선택한 모델의 적용 범위로 이해합니다.'
    },
    {
        id: 'raster-continuous-coordinates', section: 'ch05-02', field: 'textKo',
        match: '모니터의 정수 픽셀 격자 좌표계',
        replacement: '픽셀 격자를 기준으로 정의한 연속 좌표계입니다. 픽셀 번호는 정수이지만 광선 샘플 위치는 10.25처럼 소수일 수 있습니다'
    },
    {
        id: 'thin-lens-approximation', section: 'ch05-02', field: 'keyTakeaways',
        match: '얇은 렌즈 모델(Thin Lens Model)은', whole: true,
        replacement: '얇은 렌즈 모델은 유한한 조리개를 통해 초점이 맞는 평면 밖의 물체가 흐려지는 피사계 심도를 설명합니다. 조리개는 빛이 통과하는 구멍이고, 초점면은 같은 점에서 출발한 광선들이 선명하게 모이는 기준면입니다. 실제 렌즈의 모든 수차·회절·복잡한 렌즈 구성을 완전히 재현하는 모델은 아닙니다.'
    },
    {
        id: 'mesh-memory-is-conditional', section: 'ch06-05', field: 'keyTakeaways',
        match: '메모리를 3배 이상 절약합니다.',
        replacement: '중복 저장을 줄입니다. 절약 비율은 정점 공유 정도, 인덱스 크기, 함께 저장하는 법선·UV 등에 따라 달라지며 항상 3배 이상은 아닙니다.'
    },
    {
        id: 'mesh-code-not-verbatim', section: 'ch06-05', field: 'chunkName',
        match: '<<pbrt-v4 TriangleMesh>>=',
        replacement: '교육용 축약 예제 · 원본 PBRT TriangleMesh 구현 아님'
    },
    {
        id: 'mesh-code-explanation', section: 'ch06-05', field: 'explanationKo',
        match: 'pbrt-v4 TriangleMesh의 효율적인 정점/인덱스 버퍼 구조',
        replacement: '정점 배열과 인덱스 배열의 역할을 보여 주는 축약 예제입니다. 실제 PBRT 4판은 공유 버퍼와 포인터 등의 구현 세부를 추가로 사용하므로 이 예제를 원본 구현으로 복사해서는 안 됩니다.'
    },
    {
        id: 'triangle-robustness', section: 'ch06-05', field: 'content',
        match: '조건을 만족하면 단 10~15줄의 C++ 코드로 삼각형 충돌이 100% 완벽하게 처리됩니다.',
        replacement: '이 조건들은 기본적인 내부 판정만 설명합니다. 평행한 광선, 넓이가 0인 삼각형, 공유 모서리와 부동소수점 오차를 추가로 다루어야 하므로, 짧은 예제만으로 모든 입력에서 교차가 정확하다고 보장할 수 없습니다.'
    },
    {
        id: 'bvh-node-bound', section: 'ch07-03', field: 'textKo',
        match: '리프 노드의 개수는 정확히 $N$개, 내부 노드의 개수는 $N-1$개로 트리의 총 노드 수가 $2N-1$개로 엄격하게 상한선이 고정됩니다.',
        replacement: R`리프가 L개인 완전한 이진 분할 트리의 총 노드는 $2L-1$개입니다. 비어 있지 않은 리프에 하나 이상의 프리미티브가 들어가므로 $L\le N$이고, 따라서 노드 수는 최대 $2N-1$개입니다. 각 리프에 정확히 하나씩 저장할 때만 그 상한에 도달합니다. 예를 들어 프리미티브 4개를 두 리프에 2개씩 저장하면 루트를 포함해 노드는 3개이지 7개가 아닙니다.`
    },
    {
        id: 'bvh-cache-not-zero', section: 'ch07-03', field: 'keyTakeaways',
        match: '캐시 미스를 박멸하기 위해',
        replacement: '캐시 지역성을 개선하기 위해(캐시 미스가 0이 된다는 뜻은 아닙니다)'
    },
    {
        id: 'sampling-boundary-summary', section: 'ch08-01', field: 'keyTakeaways',
        match: '나이퀴스트-섀넌(Nyquist-Shannon)', whole: true,
        replacement: R`대역 제한된 신호의 최고 주파수를 $f_{\max}$라고 할 때, 경계에서의 정보 손실을 피하는 기본 조건은 $f_s>2f_{\max}$입니다. 이상적인 샘플과 복원 필터 등의 가정도 필요합니다. 정확히 두 배인 경계는 위상과 경계 성분을 별도로 검토해야 하므로 무조건 완벽한 복원을 보장하지 않습니다.`
    },
    {
        id: 'sampling-not-all-blue-noise', section: 'ch08-01', field: 'keyTakeaways',
        match: '고주파 노이즈(특히 청색 잡음', whole: true,
        replacement: '날카로운 경계는 높은 주파수 성분을 포함합니다. 샘플 위치의 규칙성을 줄이면 반복 무늬 형태의 오차를 완화할 수 있지만, 무작위 표본이 자동으로 청색 잡음이 되지는 않습니다. 청색 잡음은 저주파 성분을 억제한 분포의 특성이며 표본 배치와 필터링을 구분해서 봅니다.'
    },
    {
        id: 'sampling-no-invented-cd-history', section: 'ch08-01', field: 'content',
        match: '여기에 오디오 아날로그 필터의 완만한 감쇠 여유 마진(10%)', whole: true,
        replacement: R`샘플링 주파수가 최고 주파수의 정확히 두 배일 때의 반례를 보겠습니다. 1Hz 사인파 $s(t)=\sin(2\pi t)$를 2Hz로, 즉 $t=0,0.5,1,1.5$에서 재면 값이 모두 0입니다. 이 점들만으로는 진폭을 복원할 수 없습니다. 기본 설명에는 $f_s>2f_{\max}$와 대역 제한 조건을 함께 씁니다. 특정 오디오 규격의 역사적 선택 이유를 단순한 '10% 추가' 계산으로 단정하지 않습니다.`
    },
    {
        id: 'sampling-heading-not-ge2', section: 'ch08-01', field: 'title',
        match: '나이퀴스트 공식: f_s >= 2 * f_max',
        replacement: '샘플링 경계 조건: 정확히 두 배를 무조건 안전하다고 보지 않기'
    },
    {
        id: 'stochastic-noise-qualification', section: 'ch08-01', field: 'textKo',
        match: '격자 모양으로 반듯하게 광선을 쏘면 인간의 뇌와 눈은', whole: true,
        replacement: '규칙적인 샘플 배치는 장면의 반복 무늬와 맞물려 눈에 띄는 오차를 만들 수 있습니다. 표본 위치를 흔들거나 무작위화하면 그 반복성을 줄일 수 있습니다. 다만 독립 무작위 표본에는 저주파 오차도 남을 수 있으며, 지터링만 했다고 모든 오차가 고주파로 바뀌는 것은 아닙니다. 표본 수·분포·재구성 필터를 함께 고려합니다.'
    }
];

export const REVISION_SOURCE_URLS: Record<string, string> = {
    'ch02-01': 'https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics',
    'ch03-05': 'https://pbr-book.org/4ed/Geometry_and_Transformations/Normals',
    'ch04-01': 'https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry',
    'ch05-02': 'https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models',
    'ch06-05': 'https://pbr-book.org/4ed/Shapes/Triangle_Meshes',
    'ch07-03': 'https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies',
    'ch08-01': 'https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory'
};

/** No fuzzy matching: revised prose is only used when an identified old passage
 * occurs in the right section and field. A missing match must be reviewed, not
 * silently interpreted as a successfully checked or completed section.
 */
export function reviseLegacyContent(id: string, source: SectionContent): {
    source: SectionContent; changes: AppliedRevision[];
} {
    if (source.bookId !== 'pbrt-4ed') return { source, changes: [] };
    const rules = REVISIONS.filter(rule => rule.section === id);
    const changes: AppliedRevision[] = [];
    function visit(value: unknown, field: string, path: string): unknown {
        if (typeof value === 'string') {
            let text = value;
            for (const rule of rules) {
                if (field === rule.field && text.includes(rule.match)) {
                    text = rule.whole ? rule.replacement : text.replace(rule.match, rule.replacement);
                    changes.push({ id: rule.id, path });
                }
            }
            return text;
        }
        if (Array.isArray(value)) return value.map((item, index) => visit(item, field, `${path}[${index}]`));
        if (value && typeof value === 'object') {
            const original = value as Record<string, unknown>;
            const result = Object.fromEntries(Object.entries(original).map(([key, item]) => [key, visit(item, key, path ? `${path}.${key}` : key)]));
            if (original.type === 'paragraph' && result.textKo !== original.textKo && typeof original.textEn === 'string') {
                result.textEn = 'Editorial correction: the Korean teaching note was revised. Consult the source link for the original English; this note is not a verified translation.';
            }
            return result;
        }
        return value;
    }
    return { source: visit(source, '', '') as SectionContent, changes };
}
