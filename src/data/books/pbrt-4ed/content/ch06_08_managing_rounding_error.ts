import { SectionContent } from '../../../../types/book';

export const CH06_08_MANAGING_ROUNDING_ERROR: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '6',
  chapterTitleKo: '제6장 3차원 형상과 교차 검사 (Shapes)',
  sectionNumber: '6.8',
  sectionTitle: 'Managing Rounding Error',
  sectionTitleKo: '6.8 부동소수점 반올림 오차의 엄밀한 제어 (Managing Rounding Error)',
  originalUrl: 'https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html',
  prevSection: {
    id: 'ch06-07',
    title: '6.7 곡선과 모발/실 렌더링 (Curves)',
  },
  nextSection: {
    id: 'ch07-01',
    title: '7.1 기본 프리미티브 인터페이스',
  },
  summary: {
    keyTakeaways: [
      '컴퓨터의 32비트 단정밀도(Float32)는 유한한 가수부 비트로 인해 연산마다 반올림 오차(Rounding Error)가 발생하며, 이는 광선이 방금 출발한 표면과 다시 부딪히는 자가 교차(Self-Intersection) 및 검은 그림자 여드름(Shadow Acne)의 근본 원인입니다.',
      '기존 그래픽스는 광선 원점을 표면 법선 방향으로 "대충 0.001만큼 띄우는(Ray Epsilon)" 주먹구구식 편법을 썼지만, 이는 씬의 크기가 극단적으로 크거나 미세할 때 심각한 아티팩트와 빛 누수(Light Leaking)를 유발합니다.',
      'pbrt 제4판은 고전 수치해석학의 감마 에러 바운딩 이론(\\gamma_n = \\frac{n\\epsilon_m}{1 - n\\epsilon_m})을 기하학 파이프라인 전체에 체계적으로 적용했습니다.',
      '구, 삼각형 등 각 형상과의 교차점에서 계산된 반올림 오차의 최대 상한선을 수학적으로 바운딩하여, 표면 여드름을 영구 박멸하고 완벽한 물리적 신뢰성을 달성했습니다.'
    ],
    prerequisites: [
      'IEEE 754 부동소수점 표준 (부호, 지수부, 가수부 구조)',
      '머신 엡실론 (Machine Epsilon: Float32에서 2^-24 ≈ 1.192 × 10^-7)',
      '1.5절 부동소수점 오차와 NaN 기초'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.8.1 부동소수점의 비극: 자가 교차와 그림자 여드름',
      titleEn: '6.8.1 The Self-Intersection Problem'
    },
    {
      type: 'paragraph',
      textKo: '빛이 벽에 닿아 반사될 때, 렌더러는 충돌 지점 $p$에서 반사 방향 $d$로 새로운 2차 광선(Secondary Ray)을 발사합니다. 수학적으로는 광선 원점이 표면 위에 있으므로 반사 광선은 표면 앞쪽으로 날아가야 마땅합니다.',
      textEn: 'When a ray strikes a surface and bounces, a secondary ray is spawned at the intersection point p in reflection direction d. Mathematically, the origin lies precisely on the surface and should proceed forward.'
    },
    {
      type: 'figure',
      id: 'fig-6-36',
      number: 'Figure 6.36',
      title: 'Rounding error causing an intersection point to fall below the geometric surface, leading to erroneous self-intersection',
      titleKo: '부동소수점 반올림 오차로 인해 교차점 p가 표면 살짝 안쪽(뒤편)에 생성되어, 새로 발사된 광선이 자기 자신과 부딪히는 자가 교차(Self-Intersection) 참사',
      src: '/books/pbrt-4ed/images/pha06f36.svg',
      captionKo: 'Figure 6.36: 부동소수점 반올림 오차로 인해 교차점 p가 표면 살짝 안쪽(뒤편)에 생성되어, 새로 발사된 광선이 자기 자신과 부딪히는 자가 교차(Self-Intersection) 참사.',
      captionEn: 'Figure 6.36: Rounding error causing an intersection point to fall below the geometric surface, leading to erroneous self-intersection.'
    },
    {
      type: 'paragraph',
      textKo: '그러나 컴퓨터의 IEEE 754 부동소수점은 실수를 완벽하게 저장하지 못하고 반올림합니다. 이 미세한 오차 때문에 계산된 점 $p$가 표면의 바깥이 아니라 **표면의 아주 미세한 안쪽(두께 내부)**에 맺힐 수 있습니다. 그 결과, 새로 발사된 광선이 $t \\approx 0.000001$ 거리에서 방금 출발한 자기 자신의 표면과 즉각 충돌하여 빛을 차단당하고 시커먼 얼룩(그림자 여드름)을 만들어냅니다.',
      textEn: 'Because of floating-point rounding error, the computed intersection point may lie beneath the actual geometric surface. When a shadow or reflection ray is traced, it immediately hits the surface again at t ≈ 0, producing black shadow acne artifacts across the image.'
    },
    {
      type: 'concept-tip',
      badge: '⚠️ 부동소수점 주의',
      title: '"대충 0.001 띄우기 (Ray Epsilon)" 편법의 한계와 재앙',
      summary: '"대충 0.001 띄우기 (Ray Epsilon)" 편법의 한계와 재앙',
      points: [
        {
          title: '핵심 원리와 메커니즘',
          content: '많은 초보자나 레거시 엔진은 이를 해결하기 위해 `p + 0.001f * normal`처럼 고정된 상수를 더해 광선을 허공에 살짝 띄워서 발사합니다.\n하지만 건축 모델링(1km 크기)에서는 $0.001$이 너무 작아서 여전히 검은 점이 생기고, 반대로 곤충의 눈이나 1mm 나사(0.0001m 크기)를 렌더링할 때는 $0.001$ 띄우기가 물체 전체보다 커서 **빛이 물체를 통과해 뒤로 새어나가는(Light Leaking)** 끔찍한 물리적 오류가 발생합니다!\npbrt-v4는 이 주먹구구식 상수를 완전히 폐기하고, 수치해석학의 수학적 오차 바운딩을 도입했습니다.'
        }
      ]
    },
    {
      type: 'figure',
      id: 'fig-6-37',
      number: 'Figure 6.37',
      title: 'Light leak and missing shadows caused by fixed epsilon ray offsetting at sharp corners and thin surfaces',
      titleKo: '고정 엡실론(Fixed Epsilon) 오프셋으로 인해 모서리나 얇은 표면에서 빛이 누수되는 기하학적 결함',
      src: '/books/pbrt-4ed/images/pha06f37.svg',
      captionKo: 'Figure 6.37: 고정 엡실론(Fixed Epsilon) 오프셋으로 인해 모서리나 얇은 표면에서 빛이 누수되는 기하학적 결함.',
      captionEn: 'Figure 6.37: Light leak and missing shadows caused by fixed epsilon ray offsetting at sharp corners and thin surfaces.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.8.2 감마 오차 바운딩 이론 (Gamma Error Bounds)',
      titleEn: '6.8.2 Forward Error Analysis and Gamma Bounds'
    },
    {
      type: 'paragraph',
      textKo: '수치해석학의 거장 니콜라스 하이엄(Nicholas Higham)의 오차 분석 이론에 따르면, 연속된 $n$번의 부동소수점 곱셈과 덧셈 연산 후 누적되는 최대 상대 오차는 **감마 계수 $\\gamma_n$**으로 엄밀하게 상한선(Upper Bound)을 그을 수 있습니다.',
      textEn: 'Using forward error analysis developed by Higham, the accumulated error after n successive floating-point operations can be bounded using the gamma notation:'
    },
    {
      type: 'equation',
      tex: '\\gamma_n = \\frac{n \\epsilon_m}{1 - n \\epsilon_m}, \\quad \\text{where } \\epsilon_m = 2^{-24} \\approx 1.192 \\times 10^{-7} \\; (\\text{Float32})',
      explanationKo: '연속 n회 부동소수점 연산의 최대 오차 상한 계수 gamma_n'
    },
    {
      type: 'figure',
      id: 'fig-6-38',
      number: 'Figure 6.38',
      title: 'Interval of uncertainty around a floating-point number represented by gamma bounds',
      titleKo: '단일 부동소수점 수 주변의 불확실성 간격 [a - delta, a + delta]',
      src: '/books/pbrt-4ed/images/pha06f38.svg',
      captionKo: 'Figure 6.38: 단일 부동소수점 수 주변의 불확실성 간격 [a - delta, a + delta].',
      captionEn: 'Figure 6.38: Interval of uncertainty around a floating-point number represented by gamma bounds.'
    },
    {
      type: 'paragraph',
      textKo: '실제 참값 $v$와 컴퓨터가 계산한 부동소수점 값 $\\tilde{v}$ 사이에는 항상 다음 부등식이 100% 보장됩니다:',
      textEn: 'The true value v satisfies the guaranteed bound:'
    },
    {
      type: 'equation',
      tex: '(1 - \\gamma_n) \\tilde{v} \\le v \\le (1 + \\gamma_n) \\tilde{v}',
      explanationKo: '엄밀한 참값의 불확실성 구간'
    },
    {
      type: 'figure',
      id: 'fig-6-39',
      number: 'Figure 6.39',
      title: 'Error propagation and catastrophic cancellation during quadratic equation solving',
      titleKo: '2차 방정식 근의 공식에서 뺄셈 시 발생하는 재앙적 상쇄(Catastrophic Cancellation)와 오차 전파',
      src: '/books/pbrt-4ed/images/pha06f39.svg',
      captionKo: 'Figure 6.39: 2차 방정식 근의 공식에서 뺄셈 시 발생하는 재앙적 상쇄(Catastrophic Cancellation)와 오차 전파.',
      captionEn: 'Figure 6.39: Error propagation and catastrophic cancellation during quadratic equation solving.'
    },
    {
      type: 'figure',
      id: 'fig-6-40',
      number: 'Figure 6.40',
      title: '3D bounding box of uncertainty enclosing the true intersection point',
      titleKo: '참 교차점 주위를 감싸는 3차원 보수적 직육면체 오차 상자(Error Box)',
      src: '/books/pbrt-4ed/images/pha06f40.svg',
      captionKo: 'Figure 6.40: 참 교차점 주위를 감싸는 3차원 보수적 직육면체 오차 상자(Error Box).',
      captionEn: 'Figure 6.40: 3D bounding box of uncertainty enclosing the true intersection point.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.8.3 보수적 오차 상자 기반의 SpawnRay() 안전 광선 발사',
      titleEn: '6.8.3 Robust Ray Spawning'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt-v4는 교차 검사를 마칠 때마다 단순한 점 좌표뿐만 아니라, 그 점의 3차원 오차 반경 벡터 $\\mathbf{p}_{\\text{error}} = (|\\delta x|, |\\delta y|, |\\delta z|)$를 함께 산출합니다. 그리고 새로운 광선을 발사할 때, 이 오차 상자의 바깥쪽 평면으로 광선 시작점을 **표면 법선 방향에 맞춰 정확히 밀어냅니다(SpawnRay)**.',
      textEn: 'Rather than returning a single point, pbrt associates an error vector pError with every SurfaceInteraction. When spawning a new ray, the origin is shifted along the normal just enough to strictly clear the bounding error box.'
    },
    {
      type: 'figure',
      id: 'fig-6-41',
      number: 'Figure 6.41',
      title: 'Offsetting the spawned ray origin strictly outside the bounding box of uncertainty along the normal vector',
      titleKo: '오차 상자(Error Box)의 경계면을 엄밀히 벗어나도록 법선 방향으로 광선 원점을 안전하게 오프셋하는 SpawnRay 메커니즘',
      src: '/books/pbrt-4ed/images/pha06f41.svg',
      captionKo: 'Figure 6.41: 오차 상자(Error Box)의 경계면을 엄밀히 벗어나도록 법선 방향으로 광선 원점을 안전하게 오프셋하는 SpawnRay 메커니즘.',
      captionEn: 'Figure 6.41: Offsetting the spawned ray origin strictly outside the bounding box of uncertainty along the normal vector.'
    },
    {
      type: 'figure',
      id: 'fig-6-43',
      number: 'Figure 6.43',
      title: 'Error behavior for grazing-angle rays intersecting planar boundaries',
      titleKo: '광선과 평면의 스치는 각도(Grazing Angle)에서의 오차 확대 양상',
      src: '/books/pbrt-4ed/images/pha06f43.svg',
      captionKo: 'Figure 6.43: 광선과 평면의 스치는 각도(Grazing Angle)에서의 오차 확대 양상.',
      captionEn: 'Figure 6.43: Error behavior for grazing-angle rays intersecting planar boundaries.'
    },
    {
      type: 'figure',
      id: 'fig-6-44',
      number: 'Figure 6.44',
      title: 'Safe offset evaluation near triangle edges and shared vertices',
      titleKo: '삼각형 모서리와 정점 부근에서의 안전 거리 클리핑',
      src: '/books/pbrt-4ed/images/pha06f44.svg',
      captionKo: 'Figure 6.44: 삼각형 모서리와 정점 부근에서의 안전 거리 클리핑.',
      captionEn: 'Figure 6.44: Safe offset evaluation near triangle edges and shared vertices.'
    },
    {
      type: 'figure',
      id: 'fig-6-45',
      number: 'Figure 6.45',
      title: 'Visual comparison of ad-hoc ray epsilon artifacts versus robust error-bounded ray spawning in pbrt-v4',
      titleKo: '전통적인 엡실론 편법 vs pbrt-v4의 엄밀한 감마 오차 바운드 비교',
      src: '/books/pbrt-4ed/images/pha06f45.svg',
      captionKo: 'Figure 6.45: 전통적인 엡실론 편법 vs pbrt-v4의 엄밀한 감마 오차 바운드 비교.',
      captionEn: 'Figure 6.45: Visual comparison of ad-hoc ray epsilon artifacts versus robust error-bounded ray spawning in pbrt-v4.'
    },
    {
      type: 'figure',
      id: 'fig-6-46',
      number: 'Figure 6.46',
      title: 'Extreme-scale scene rendering flawlessly without shadow acne or light leaks',
      titleKo: '나노미터 크기부터 수백 킬로미터 거대 씬까지 여드름과 빛 누수 없이 완벽히 렌더링되는 결과',
      src: '/books/pbrt-4ed/images/pha06f46.svg',
      captionKo: 'Figure 6.46: 나노미터 크기부터 수백 킬로미터 거대 씬까지 여드름과 빛 누수 없이 완벽히 렌더링되는 결과.',
      captionEn: 'Figure 6.46: Extreme-scale scene rendering flawlessly without shadow acne or light leaks.'
    }
  ]
};
