import { SectionContent } from '../../../../types/book';

export const CH06_07_CURVES: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '6',
  chapterTitleKo: '제6장 3차원 형상과 교차 검사 (Shapes)',
  sectionNumber: '6.7',
  sectionTitle: 'Curves',
  sectionTitleKo: '6.7 곡선과 모발/실 렌더링 (Curves)',
  originalUrl: 'https://pbr-book.org/4ed/Shapes/Curves.html',
  prevSection: {
    id: 'ch06-06',
    title: '6.6 쌍선형 패치 곡면(Bilinear Patches)',
  },
  nextSection: {
    id: 'ch06-08',
    title: '6.8 부동소수점 반올림 오차 엄밀 제어',
  },
  summary: {
    keyTakeaways: [
      '곡선(Curve) 프리미티브는 영화와 애니메이션에서 10만 가닥 이상의 인간의 머리카락, 동물의 털(Fur), 잔디, 직물의 옷감 실을 사실적으로 렌더링하는 데 필수적입니다.',
      '각 곡선 세그먼트는 4개의 제어점(Control Points)으로 정의되는 3차 베지어 스플라인(Cubic Bézier Spline) 곡선으로 표현되며, 양 끝점의 두께(width0, width1)를 부드럽게 가변할 수 있습니다.',
      '곡선의 기하 형태로는 카메라를 항상 바라보는 평평한 리본(Flat Ribbon), 표면 법선을 갖는 리본(Ribbon), 그리고 완전한 3D 원통형 튜브(Cylinder)를 지원합니다.',
      '교차 검사는 베지어 곡선의 재귀적 분할(Subdivision)과 바운딩 실린더 교차 검사를 결합하여 수치적으로 매우 안정적이고 빠르게 수행됩니다.'
    ],
    prerequisites: [
      '3차 베지어 곡선 (Cubic Bézier Curve)과 번스타인 다항식 (Bernstein Polynomials)',
      '재귀적 드 카스텔조(de Casteljau) 분할 알고리즘',
      '프레네-세레(Frenet-Serret) 프레임과 곡선 접선 벡터'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.7.1 3차 베지어 곡선(Cubic Bézier Curve)의 수학적 표현',
      titleEn: '6.7.1 Bézier Spline Representation'
    },
    {
      type: 'paragraph',
      textKo: '인간의 머리카락 한 올이나 동물의 모피 털은 수많은 작은 원통을 일일이 이어 붙이기에는 데이터가 너무 비대해집니다. pbrt는 4개의 3D 제어점 $c_0, c_1, c_2, c_3$과 번스타인 다항식(Bernstein Polynomial) 기저 함수를 사용하는 **3차 베지어 스플라인** 곡선으로 부드러운 헤어를 모델링합니다.',
      textEn: 'Rendering hair, fur, and cloth fibers with explicit polygonal meshes is prohibitively expensive. pbrt represents curves using cubic Bézier splines defined by four control points c0, c1, c2, c3.'
    },
    {
      type: 'equation',
      tex: 'p(u) = \\sum_{i=0}^3 B_{i,3}(u) c_i = (1 - u)^3 c_0 + 3 u (1 - u)^2 c_1 + 3 u^2 (1 - u) c_2 + u^3 c_3',
      explanationKo: '3차 베지어 곡선의 매개변수 방정식'
    },
    {
      type: 'figure',
      id: 'fig-6-33',
      number: 'Figure 6.33',
      title: 'Geometry of a cubic Bézier curve segment with varying thickness',
      titleKo: '4개의 제어점 c0, c1, c2, c3과 폭(width0, width1)을 갖는 베지어 곡선 세그먼트',
      src: '/books/pbrt-4ed/images/pha06f33.svg',
      captionKo: 'Figure 6.33: 4개의 제어점 c0, c1, c2, c3과 폭(width0, width1)을 갖는 베지어 곡선 세그먼트.',
      captionEn: 'Figure 6.33: Geometry of a cubic Bézier curve segment with varying thickness.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.7.2 세 가지 곡선 유형: Flat, Ribbon, Cylinder',
      titleEn: '6.7.2 Curve Types'
    },
    {
      type: 'paragraph',
      textKo: '용도와 연산 비용에 따라 세 가지 서로 다른 지오메트리 방식을 선택할 수 있습니다:',
      textEn: 'pbrt supports three types of curve primitives:'
    },
    {
      type: 'figure',
      id: 'fig-6-34',
      number: 'Figure 6.34',
      title: 'Comparison between flat ribbon curves that face the ray and 3D cylindrical tube curves',
      titleKo: '평면 리본(Flat Ribbon)과 원통형 튜브(Cylinder) 곡선 단면의 기하학적 비교',
      src: '/books/pbrt-4ed/images/pha06f34.svg',
      captionKo: 'Figure 6.34: 평면 리본(Flat Ribbon)과 원통형 튜브(Cylinder) 곡선 단면의 기하학적 비교.',
      captionEn: 'Figure 6.34: Comparison between flat ribbon curves that face the ray and 3D cylindrical tube curves.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '10만 가닥 머리카락을 렌더링하는 Flat Ribbon의 지혜',
      summary: '10만 가닥 머리카락을 렌더링하는 Flat Ribbon의 지혜',
      points: [
        {
          title: '핵심 원리와 메커니즘',
          content: '1. **Flat (평면 리본)**: 굵기가 머리카락 수준으로 매우 가늘 때는 원통의 둥근 옆면을 아무리 정밀하게 계산해도 눈으로 구분할 수 없습니다! 따라서 광선을 항상 수직으로 마주 보도록 빌보드(Billboard)처럼 회전하는 얇은 종이 띠로 취급하여 렌더링 속도를 극대화합니다.\n2. **Cylinder (3D 원통형 튜브)**: 밧줄이나 굵은 전선처럼 가까이서 클로즈업할 때 완전한 원통형 3차원 볼륨을 생성합니다.\n3. **Ribbon (표면 리본)**: 나뭇잎 줄기나 잔디처럼 표면 고유의 법선 방향을 따라 평평하게 눕는 곡선입니다.'
        }
      ]
    },
    {
      type: 'figure',
      id: 'fig-6-35',
      number: 'Figure 6.35',
      title: 'Recursive subdivision of a Bézier curve to accelerate intersection tests',
      titleKo: '베지어 곡선의 재귀적 분할과 바운딩 박스 테스팅',
      src: '/books/pbrt-4ed/images/pha06f35.svg',
      captionKo: 'Figure 6.35: 베지어 곡선의 재귀적 분할과 바운딩 박스 테스팅.',
      captionEn: 'Figure 6.35: Recursive subdivision of a Bézier curve to accelerate intersection tests.'
    },
    {
      type: 'figure',
      id: 'fig-curves-render',
      number: 'Rendering curves',
      title: 'Three types of curve geometries rendered in pbrt-v4 showing ribbons, tubes, and tapered fibers',
      titleKo: 'pbrt-v4로 렌더링한 다양한 두께와 꼬임을 지닌 베지어 곡선(Curves) 씬',
      src: '/books/pbrt-4ed/images/threecurves.png',
      captionKo: 'pbrt-v4로 렌더링한 다양한 두께와 꼬임을 지닌 베지어 곡선(Curves) 씬.',
      captionEn: 'Three types of curve geometries rendered in pbrt-v4 showing ribbons, tubes, and tapered fibers.'
    }
  ]
};
