import { SectionContent } from '../../../../types/book';

export const CH06_06_BILINEAR_PATCHES: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '6',
  chapterTitleKo: '제6장 3차원 형상과 교차 검사 (Shapes)',
  sectionNumber: '6.6',
  sectionTitle: 'Bilinear Patches',
  sectionTitleKo: '6.6 쌍선형 패치 곡면 (Bilinear Patches)',
  originalUrl: 'https://pbr-book.org/4ed/Shapes/Bilinear_Patches.html',
  prevSection: {
    id: 'ch06-05',
    title: '6.5 삼각 메시와 묄러-트룸보어 알고리즘',
  },
  nextSection: {
    id: 'ch06-07',
    title: '6.7 곡선과 모발/실 렌더링(Curves)',
  },
  summary: {
    keyTakeaways: [
      '쌍선형 패치(Bilinear Patch)는 4개의 3D 제어점(p00, p01, p10, p11) 사이를 2차원 매개변수 (u, v)로 선형 보간하여 형성되는 괘면(Ruled Surface)입니다.',
      '4개의 점이 동일 평면상에 있지 않더라도 매끄러운 3차원 비틀린 곡면을 만들 수 있어, 건축 지붕 구조물이나 유기적 표면 모델링에 효과적입니다.',
      '광선과의 교차 검사는 매개변수 u에 관한 2차 방정식을 유도하여 해석적으로 해를 구하거나 수치적 뉴턴-랩슨(Newton-Raphson) 기법으로 엄밀하게 풀어냅니다.',
      'pbrt-v4는 쌍선형 패치 메시(BilinearPatchMesh)를 지원하여 사각형 폴리곤(Quad Mesh) 데이터를 삼각형 분할 없이 자연스러운 곡면으로 렌더링합니다.'
    ],
    prerequisites: [
      '쌍선형 보간법 (Bilinear Interpolation: 2D 그리드 보간)',
      '괘면(Ruled Surface)의 기하학적 정의',
      '2차 방정식 근의 공식'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.6.1 쌍선형 패치의 기하학적 정의',
      titleEn: '6.6.1 Bilinear Patch Formulation'
    },
    {
      type: 'paragraph',
      textKo: '3차원 공간에 4개의 점 $p_{00}, p_{01}, p_{10}, p_{11}$이 주어졌을 때, 각 모서리를 잇는 직선들을 마주 보며 선형 보간(Linear Interpolation)하면 부드럽게 비틀린 3차원 사각 곡면이 형성됩니다. 이를 **쌍선형 패치(Bilinear Patch)**라고 부릅니다.',
      textEn: 'Given four control points p00, p01, p10, and p11 in 3D, a bilinear patch is defined by interpolating linearly between them in parameter space (u, v) in [0, 1]^2.'
    },
    {
      type: 'equation',
      tex: 'p(u, v) = (1 - u)(1 - v) p_{00} + (1 - u) v p_{01} + u (1 - v) p_{10} + u v p_{11}',
      explanationKo: '쌍선형 패치 매개변수 곡면 방정식'
    },
    {
      type: 'figure',
      id: 'fig-6-27',
      number: 'Figure 6.27',
      title: 'Geometry of a bilinear patch defined by four control points',
      titleKo: '4개의 제어점 p00, p01, p10, p11과 매개변수 u, v에 의해 생성되는 쌍선형 패치 곡면',
      src: '/books/pbrt-4ed/images/pha06f27.svg',
      captionKo: 'Figure 6.27: 4개의 제어점 p00, p01, p10, p11과 매개변수 u, v에 의해 생성되는 쌍선형 패치 곡면.',
      captionEn: 'Figure 6.27: Geometry of a bilinear patch defined by four control points.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '괘면(Ruled Surface)이란?',
      summary: '괘면(Ruled Surface)이란?',
      points: [
        {
          title: '핵심 원리와 메커니즘',
          content: '쌍선형 패치는 곡면이지만, 놀랍게도 $u$를 고정하고 $v$를 움직이거나 $v$를 고정하고 $u$를 움직이면 **완벽한 직선(Straight Line)**이 됩니다!\n직선을 연속적으로 움직여서 만든 곡면을 수학에서 **괘면(Ruled Surface)**이라고 부릅니다. 감자칩(쌍곡 포물면)이나 쿨링 타워가 대표적인 예입니다.'
        }
      ]
    },
    {
      type: 'figure',
      id: 'fig-6-28',
      number: 'Figure 6.28',
      title: 'The ruling lines of a bilinear patch showing straight lines along constant u and v parameter lines',
      titleKo: '쌍선형 패치 표면을 이루는 직선 룰링(Rulings) 라인들',
      src: '/books/pbrt-4ed/images/pha06f28.svg',
      captionKo: 'Figure 6.28: 쌍선형 패치 표면을 이루는 직선 룰링(Rulings) 라인들.',
      captionEn: 'Figure 6.28: The ruling lines of a bilinear patch showing straight lines along constant u and v parameter lines.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.6.2 광선-쌍선형 패치 교차 검사 알고리즘',
      titleEn: '6.6.2 Ray–Patch Intersection'
    },
    {
      type: 'paragraph',
      textKo: '광선 $o + td$와 쌍선형 패치의 교차점 $p(u, v)$는 3개의 미지수 $(t, u, v)$를 포함합니다. pbrt는 투영 변환을 통해 광선을 원점으로 정렬한 뒤, $v$를 $u$에 관한 식으로 소거하여 최종적으로 $u$에 관한 2차 방정식을 도출합니다.',
      textEn: 'Intersecting a ray with a bilinear patch requires solving o + td = p(u, v) for t, u, and v. By transforming the ray into canonical space, v can be eliminated to yield a quadratic equation in u.'
    },
    {
      type: 'figure',
      id: 'fig-6-29',
      number: 'Figure 6.29',
      title: 'Projective coordinate setup for ray–bilinear patch intersection',
      titleKo: '투영 좌표계에서 광선과 패치 모서리의 교차 기하',
      src: '/books/pbrt-4ed/images/pha06f29.svg',
      captionKo: 'Figure 6.29: 투영 좌표계에서 광선과 패치 모서리의 교차 기하.',
      captionEn: 'Figure 6.29: Projective coordinate setup for ray–bilinear patch intersection.'
    },
    {
      type: 'figure',
      id: 'fig-6-30',
      number: 'Figure 6.30',
      title: 'Handling boundary and singularity cases in bilinear patch intersections',
      titleKo: '패치 모서리가 접히거나 자체 교차할 때의 특이점(Singularity) 처리',
      src: '/books/pbrt-4ed/images/pha06f30.svg',
      captionKo: 'Figure 6.30: 패치 모서리가 접히거나 자체 교차할 때의 특이점(Singularity) 처리.',
      captionEn: 'Figure 6.30: Handling boundary and singularity cases in bilinear patch intersections.'
    },
    {
      type: 'figure',
      id: 'fig-blps-render',
      number: 'Rendering blps',
      title: 'Rendered bilinear patch surfaces in pbrt-v4 showing smooth curvature across quad elements',
      titleKo: 'pbrt-v4로 렌더링한 쌍선형 패치 메시(Bilinear Patches) 씬',
      src: '/books/pbrt-4ed/images/blps.png',
      captionKo: 'pbrt-v4로 렌더링한 쌍선형 패치 메시(Bilinear Patches) 씬.',
      captionEn: 'Rendered bilinear patch surfaces in pbrt-v4 showing smooth curvature across quad elements.'
    }
  ]
};
