import { SectionContent } from '../../../../types/book';

export const CH06_02_SPHERES: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '6',
  chapterTitleKo: '제6장 3차원 형상과 교차 검사 (Shapes)',
  sectionNumber: '6.2',
  sectionTitle: 'Spheres',
  sectionTitleKo: '6.2 구(Sphere)의 해석적 교차 검사 (Spheres)',
  originalUrl: 'https://pbr-book.org/4ed/Shapes/Spheres.html',
  prevSection: {
    id: 'ch06-01',
    title: '6.1 기본 Shape 인터페이스 설계',
  },
  nextSection: {
    id: 'ch06-03',
    title: '6.3 원기둥(Cylinder)',
  },
  summary: {
    keyTakeaways: [
      '구(Sphere)는 컴퓨터 그래픽스에서 2차 방정식의 근의 공식(Quadratic Formula)을 통해 해석적(Analytic)으로 가장 정밀하게 교차점을 구할 수 있는 기본 형상입니다.',
      '광선 방정식 p(t) = o + td를 구의 음함수 방정식 x² + y² + z² - r² = 0에 대입하면 at² + bt + c = 0 형태의 2차 방정식이 유도됩니다.',
      '판별식 D = b² - 4ac의 부호에 따라 광선이 구를 통과하는지(D > 0), 접하는지(D = 0), 빗나가는지(D < 0) 단 한 번의 연산으로 판정합니다.',
      'pbrt의 구 모델은 단순한 완전 구뿐만 아니라 z축 높이(zMin, zMax)와 방위각(phiMax)으로 자른 부분 구(Partial Sphere)를 지원하며, 표면 편미분(∂p/∂u, ∂p/∂v)으로부터 정확한 표면 법선과 텍스처 좌표를 계산합니다.'
    ],
    prerequisites: [
      '고교 수학 2차 방정식의 근의 공식 및 판별식 (D = b² - 4ac)',
      '구면좌표계 (Spherical Coordinates: 반지름 r, 극각 theta, 방위각 phi)',
      '3차원 벡터의 내적과 크기 계산'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.2.1 구의 수학적 정의와 2차 방정식 교차 유도',
      titleEn: '6.2.1 Ray–Sphere Intersection Formulation'
    },
    {
      type: 'paragraph',
      textKo: '원점 중심, 반지름 $r$을 갖는 구의 음함수(Implicit equation)는 다음과 같습니다:',
      textEn: 'An implicit representation of a sphere centered at the origin of radius r is:'
    },
    {
      type: 'equation',
      tex: 'x^2 + y^2 + z^2 - r^2 = 0',
      explanationKo: '원점에 위치한 반지름 r인 구의 음함수 표기법'
    },
    {
      type: 'paragraph',
      textKo: '광선의 매개변수 방정식 $p(t) = o + t d$의 각 성분 $x(t) = o_x + t d_x$, $y(t) = o_y + t d_y$, $z(t) = o_z + t d_z$를 구의 방정식에 대입하여 전개하면, 매개변수 $t$에 관한 친숙한 2차 방정식 $a t^2 + b t + c = 0$이 도출됩니다:',
      textEn: 'Substituting the parametric ray equation p(t) = o + td into the sphere equation yields a quadratic equation in t:'
    },
    {
      type: 'equation',
      tex: 'a t^2 + b t + c = 0',
      explanationKo: '광선-구 교차 2차 방정식'
    },
    {
      type: 'paragraph',
      textKo: '여기서 각 계수 $a, b, c$는 광선의 원점 $o$와 방향 $d$의 성분 곱과 벡터 내적으로 완벽히 정의됩니다:',
      textEn: 'where the coefficients a, b, and c are given by:'
    },
    {
      type: 'equation',
      tex: 'a = d_x^2 + d_y^2 + d_z^2 = \\mathbf{d} \\cdot \\mathbf{d}, \\quad b = 2(d_x o_x + d_y o_y + d_z o_z) = 2(\\mathbf{o} \\cdot \\mathbf{d}), \\quad c = o_x^2 + o_y^2 + o_z^2 - r^2 = \\mathbf{o} \\cdot \\mathbf{o} - r^2',
      explanationKo: '2차 방정식 계수 a, b, c'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '판별식 D = b² - 4ac의 기하학적 의미',
      summary: '판별식 D = b² - 4ac의 기하학적 의미',
      points: [
        {
          title: '핵심 원리와 메커니즘',
          content: '중학교 수학 시간에 배운 2차 방정식의 판별식 $D = b^2 - 4ac$가 3D 그래픽스에서는 어떻게 쓰일까요?\n\n1. **$D < 0$ (음수)**: 실근이 없음 $\\rightarrow$ 광선이 허공을 갈라 구를 완전히 빗나감! 즉시 교차 실패 반환\n2. **$D = 0$ (영)**: 중근 $\\rightarrow$ 광선이 구의 가장자리를 아슬아슬하게 스치는 접선(Tangent)\n3. **$D > 0$ (양수)**: 서로 다른 두 실근 $\\rightarrow$ 광선이 구를 뚫고 들어가 앞면($t_0$)과 뒷면($t_1$) 두 점에서 관통!\n\n이 판별식 덕분에 컴퓨터는 무거운 삼각함수를 일절 쓰지 않고 단순 곱셈과 뺄셈 4번만으로 광선이 구에 닿았는지 0.000001초 만에 알아챕니다.'
        }
      ]
    },
    {
      type: 'figure',
      id: 'fig-6-5',
      number: 'Figure 6.5',
      title: 'Geometry of ray–sphere intersection',
      titleKo: '광선과 구의 기하학적 교차 관계',
      src: '/books/pbrt-4ed/images/pha06f05.svg',
      captionKo: 'Figure 6.5: 광선과 구의 기하학적 교차 관계. 판별식 D의 부호에 따라 두 교점, 접점, 불일치가 결정됩니다.',
      captionEn: 'Figure 6.5: Geometry of ray–sphere intersection. The ray intersects the sphere at two points t0 and t1, touches it tangentially, or misses entirely.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.2.2 부분 구(Partial Spheres)와 매개변수화 (u, v)',
      titleEn: '6.2.2 Partial Spheres and Parametrization'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt의 구는 단순한 공 형태에 머무르지 않고, 지구본의 북극/남극을 잘라내거나($z_{\\min}, z_{\\max}$) 수박 조각처럼 각도를 오려낸($\\phi_{\\max}$) **부분 구(Partial Sphere)**를 완벽하게 지원합니다.',
      textEn: 'pbrt supports partial spheres, which are clipped in z between zMin and zMax, and clipped in azimuth up to phiMax.'
    },
    {
      type: 'figure',
      id: 'fig-6-6',
      number: 'Figure 6.6',
      title: 'Sphere parametrization',
      titleKo: '구면 매개변수화',
      src: '/books/pbrt-4ed/images/pha06f06.svg',
      captionKo: 'Figure 6.6: 구면 매개변수화. 극각 theta(위도)와 방위각 phi(경도)를 2차원 텍스처 좌표 (u, v)로 사상합니다.',
      captionEn: 'Figure 6.6: Sphere parametrization. Points on the sphere are parameterized by latitude theta and longitude phi.'
    },
    {
      type: 'paragraph',
      textKo: '교차점 $p = (x, y, z)$가 구해지면, 역삼각함수를 이용해 경도 방위각 $\\phi$와 위도 극각 $\\theta$를 추출하고, 이를 $[0, 1]$ 정규화 텍스처 좌표 $(u, v)$로 변환합니다:',
      textEn: 'Given an intersection point p, the spherical coordinates phi and theta are obtained via:'
    },
    {
      type: 'equation',
      tex: '\\phi = \\operatorname{atan2}(y, x), \\quad \\theta = \\arccos\\left(\\operatorname{Clamp}(z / r, -1, 1)\\right)',
      explanationKo: '교차점으로부터 구면 각도 (phi, theta) 유도'
    },
    {
      type: 'equation',
      tex: 'u = \\frac{\\phi}{\\phi_{\\max}}, \\quad v = \\frac{\\theta - \\theta_{\\min}}{\\theta_{\\max} - \\theta_{\\min}}',
      explanationKo: '정규화 텍스처 좌표 (u, v) 사상'
    },
    {
      type: 'figure',
      id: 'fig-6-7',
      number: 'Figure 6.7',
      title: 'Partial sphere clipped by zMin and zMax planes',
      titleKo: 'z축 절단 평면(zMin, zMax)에 의해 위아래가 잘려 나간 부분 구의 기하 구조',
      src: '/books/pbrt-4ed/images/pha06f07.svg',
      captionKo: 'Figure 6.7: z축 절단 평면(zMin, zMax)에 의해 위아래가 잘려 나간 부분 구의 기하 구조.',
      captionEn: 'Figure 6.7: Partial sphere clipped by zMin and zMax planes.'
    },
    {
      type: 'figure',
      id: 'fig-6-9',
      number: 'Figure 6.9',
      title: 'Partial sphere swept through an azimuthal angle phiMax',
      titleKo: '방위각 phiMax로 인해 파이 조각처럼 측면이 잘려 나간 부분 구',
      src: '/books/pbrt-4ed/images/pha06f09.svg',
      captionKo: 'Figure 6.9: 방위각 phiMax로 인해 파이 조각처럼 측면이 잘려 나간 부분 구.',
      captionEn: 'Figure 6.9: Partial sphere swept through an azimuthal angle phiMax.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.2.3 표면 편미분 벡터와 법선(Normal) 계산',
      titleEn: '6.2.3 Differential Geometry and Surface Normals'
    },
    {
      type: 'paragraph',
      textKo: '물체 표면의 반사 및 조명을 계산하려면 충돌 지점의 **표면 법선 벡터($\\mathbf{n}$)**와 텍스처 변화율을 나타내는 **편미분 벡터($\\partial p/\\partial u, \\partial p/\\partial v$)**가 필수적입니다.',
      textEn: 'To shade an intersection, the differential area vectors dp/du and dp/dv and the surface normal must be computed.'
    },
    {
      type: 'figure',
      id: 'fig-6-12',
      number: 'Figure 6.12',
      title: 'Surface partial derivatives dp/du and dp/dv on a sphere and the resulting outward surface normal',
      titleKo: '구 표면에서의 편미분 벡터 dp/du, dp/dv와 표면 법선 벡터 n',
      src: '/books/pbrt-4ed/images/pha06f12.svg',
      captionKo: 'Figure 6.12: 구 표면에서의 편미분 벡터 dp/du, dp/dv와 표면 법선 벡터 n. 두 편미분 벡터의 외적으로 수직 법선이 결정됩니다.',
      captionEn: 'Figure 6.12: Surface partial derivatives dp/du and dp/dv on a sphere and the resulting outward surface normal.'
    },
    {
      type: 'paragraph',
      textKo: '구의 매개변수 방정식 $x = r \\sin\\theta \\cos\\phi, y = r \\sin\\theta \\sin\\phi, z = r \\cos\\theta$를 $u, v$로 편미분하면 다음과 같은 아름다운 편미분 벡터를 얻을 수 있습니다:',
      textEn: 'Differentiating the parametric equations with respect to u and v yields the tangent vectors:'
    },
    {
      type: 'equation',
      tex: '\\frac{\\partial p}{\\partial u} = \\left(-\\phi_{\\max} y, \\; \\phi_{\\max} x, \\; 0\\right)^T',
      explanationKo: '방위각 u 방향 편미분 접선 벡터'
    },
    {
      type: 'equation',
      tex: '\\mathbf{n} = \\frac{\\frac{\\partial p}{\\partial u} \\times \\frac{\\partial p}{\\partial v}}{\\left\\|\\frac{\\partial p}{\\partial u} \\times \\frac{\\partial p}{\\partial v}\\right\\|} = \\frac{p}{\\|p\\|} = \\frac{p}{r}',
      explanationKo: '구 표면의 외향 법선 벡터 (원점 기준 위치 벡터와 방향 일치)'
    },
    {
      type: 'figure',
      id: 'fig-spheres-render',
      number: 'Rendering spheres',
      title: 'A collection of complete and partial spheres rendered with pbrt-v4, demonstrating accurate intersection and differential geometry',
      titleKo: 'pbrt-v4로 렌더링한 다양한 크기, 절단 각도, 재질의 구(Spheres) 집합 씬',
      src: '/books/pbrt-4ed/images/spheres.png',
      captionKo: 'pbrt-v4로 렌더링한 다양한 크기, 절단 각도, 재질의 구(Spheres) 집합 씬.',
      captionEn: 'A collection of complete and partial spheres rendered with pbrt-v4, demonstrating accurate intersection and differential geometry.'
    }
  ]
};
