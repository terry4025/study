import { SectionContent } from '../../../../types/book';

export const CH03_08_SPHERICAL_GEOMETRY: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.8',
  sectionTitle: 'Spherical Geometry',
  sectionTitleKo: '3.8 구면 기하학과 방향 표현 (Spherical Geometry)',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html',
  prevSection: {
    id: 'ch03-07',
    title: '3.7 바운딩 박스 (Bounding Boxes & AABB)',
  },
  nextSection: {
    id: 'ch03-09',
    title: '3.9 3차원 변환과 행렬 (Transformations)',
  },
  summary: {
    keyTakeaways: [
      '평면에서의 각도(Radian)가 단위 원 둘레의 호의 길이이듯, 3차원 공간에서의 **입체각(Solid Angle, 스테라디안 sr)**은 단위 구(Unit Sphere) 표면적에 투영된 영역의 넓이입니다. 전체 구의 입체각은 $4\\pi$ sr, 반구는 $2\\pi$ sr입니다.',
      '구면 좌표계(Spherical Coordinates)는 극각 $\\theta \\in [0, \\pi]$와 방위각 $\\phi \\in [0, 2\\pi]$로 3D 방향을 나타내며, 미소 입체각은 $d\\omega = \\sin\\theta\\,d\\theta\\,d\\phi$로 계산됩니다.',
      '구면 삼각형(Spherical Triangle)의 면적은 지라르(Girard)의 정리에 의해 세 내각의 합에서 $\\pi$를 뺀 초과 각도 $A = a + b + c - \\pi$로 놀랍도록 우아하게 구해집니다.',
      '**옥타헤드럴 인코딩(Octahedral Encoding)**은 3D 단위 방향 벡터를 정팔면체 투영을 통해 왜곡이 거의 없는 2D 정사각형 평면으로 1:1 매핑하여, 메모리를 절약하고 텍스처 패킹 효율을 극대화합니다.',
      '**방향 원뿔(`DirectionCone`)**은 중심축 $\\mathbf{w}$와 최대 확산각 $\\cos\\theta_{max}$로 3차원 방향들의 집합을 감싸는 바운딩 볼륨으로, 클러스터 셰이딩 및 광원 컬링에서 핵심 역할을 수행합니다.'
    ],
    prerequisites: [
      '3.3절 3차원 벡터 및 내적/외적',
      '고등학교 삼각함수와 미적분학의 중적분 개념'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '3.8 구면 기하학 (Spherical Geometry)',
      titleEn: '3.8 Spherical Geometry'
    },
    {
      type: 'paragraph',
      textKo: '렌더링 알고리즘에서 빛의 산란과 반사, 카메라 시선 방향, 광원의 방출 각도를 다룰 때 3차원 공간의 "방향(Direction)"을 수학적으로 엄밀하게 표현하는 것은 필수적입니다. 단위 구(Unit Sphere) $S^2$ 상의 기하학인 구면 기하학은 이러한 렌더링 방정식의 뼈대를 형성합니다.',
      textEn: 'Directions in 3D space are naturally represented as points on the unit sphere $S^2$. Spherical geometry is fundamental to physically based rendering, as it underpins the representation of light scattering, camera viewing directions, and illumination integrals.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.8.1 각도와 입체각 (Angles and Solid Angles)',
      titleEn: '3.8.1 Angles and Solid Angles'
    },
    {
      type: 'paragraph',
      textKo: '2차원 평면에서 각도(라디안, Radians)는 반지름이 1인 단위 원(Unit Circle)의 둘레에서 특정 각도가 잘라내는 호의 길이(Arc Length)로 정의됩니다(그림 3.12). 전체 원의 둘레 길이는 $2\\pi$이므로 한 바퀴는 $2\\pi$ 라디안입니다.',
      textEn: 'In 2D, an angle is defined as the length of the arc subtended by the angle on a unit circle (Figure 3.12). The total circumference of a circle is $2\\pi$, so there are $2\\pi$ radians in a full circle.'
    },
    {
      type: 'figure',
      id: 'fig-3-12',
      number: 'Figure 3.12',
      captionKo: '그림 3.12: 2차원 평면 각도의 정의: 단위 원의 둘레에서 두 광선이 잘라내는 호의 길이가 바로 라디안(Radian) 각도입니다.',
      captionEn: 'Figure 3.12: The definition of an angle in 2D: the length of the arc subtended on the unit circle.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f12.svg',
    },
    {
      type: 'paragraph',
      textKo: '이 개념을 3차원 공간으로 확장한 것이 바로 **입체각(Solid Angle, 기호 $\\omega$ 또는 $\\Omega$)**입니다. 입체각의 단위는 **스테라디안(Steradian, sr)**이며, 반지름이 1인 단위 구(Unit Sphere)의 표면에 어떤 3차원 물체나 각도가 투영되었을 때 생기는 구면 영역의 넓이로 엄밀하게 정의됩니다(그림 3.13). 반지름이 1인 전체 구의 겉넓이는 $4\\pi r^2 = 4\\pi$이므로, 3차원 전방위 공간의 총 입체각은 정확히 $4\\pi$ sr이며, 평면 위의 반구(Hemisphere)는 $2\\pi$ sr입니다.',
      textEn: 'Solid angles extend the concept of angles to 3D. The solid angle subtended by an object is defined as the area of its projection onto the unit sphere (Figure 3.13). The unit of solid angle is the steradian (sr). Since the surface area of a unit sphere is $4\\pi$, there are $4\\pi$ steradians in the entire sphere, and $2\\pi$ steradians in a hemisphere.'
    },
    {
      type: 'figure',
      id: 'fig-3-13',
      number: 'Figure 3.13',
      captionKo: '그림 3.13: 3차원 입체각(Solid Angle)의 정의: 물체가 원점에 대해 이루는 3차원 원뿔 모양의 시야가 단위 구 표면에 투영된 구면 면적이 바로 입체각(단위: 스테라디안 sr)입니다.',
      captionEn: 'Figure 3.13: The definition of a solid angle in 3D: the projected area of an object on the unit sphere.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f13.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.8.2 구면 좌표계 (Spherical Coordinates)',
      titleEn: '3.8.2 Spherical Coordinates'
    },
    {
      type: 'paragraph',
      textKo: '3차원 공간의 단위 방향 벡터는 $z$축으로부터 아래로 기울어진 극각(Polar/Zenith Angle) $\\theta \\in [0, \\pi]$와, $xy$ 평면상에서 $x$축으로부터 회전한 방위각(Azimuthal Angle) $\\phi \\in [0, 2\\pi]$ 두 개의 각도로 표현할 수 있습니다(그림 3.14).',
      textEn: 'Spherical coordinates represent a direction using a polar angle $\\theta \\in [0, \\pi]$ from the $+z$ axis and an azimuthal angle $\\phi \\in [0, 2\\pi]$ around the $+z$ axis in the $xy$ plane (Figure 3.14).'
    },
    {
      type: 'figure',
      id: 'fig-3-14',
      number: 'Figure 3.14',
      captionKo: '그림 3.14: 구면 좌표계 $(\\theta, \\phi)$: $z$축으로부터의 각도 $\\theta$와 $x$축 기준의 회전각 $\\phi$를 통해 3차원 방향 벡터를 표현합니다.',
      captionEn: 'Figure 3.14: Spherical coordinates $(\\theta, \\phi)$ define a direction using polar angle $\\theta$ and azimuthal angle $\\phi$.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f14.svg',
    },
    {
      type: 'paragraph',
      textKo: '구면 좌표계 $(\\theta, \\phi)$로부터 3차원 데카르트 직교 단위 벡터 $\\mathbf{v} = (x, y, z)$로의 변환 공식은 삼각함수를 통해 직관적으로 도출됩니다:',
      textEn: 'The Cartesian components $(x, y, z)$ of a unit vector given its spherical coordinates are:'
    },
    {
      type: 'equation',
      tex: 'x = \\sin\\theta \\cos\\phi, \\quad y = \\sin\\theta \\sin\\phi, \\quad z = \\cos\\theta'
    },
    {
      type: 'figure',
      id: 'fig-3-15',
      number: 'Figure 3.15',
      captionKo: '그림 3.15: 미소 입체각 $d\\omega$: 극각 $d\\theta$와 방위각 $d\\phi$로 둘러싸인 구면 사각형의 가로 길이는 위도에 비례하여 줄어들기 때문에 $\\sin\\theta\\,d\\phi$가 되고, 세로 길이는 $d\\theta$가 되어, 미소 면적은 $d\\omega = \\sin\\theta\\,d\\theta\\,d\\phi$가 됩니다.',
      captionEn: 'Figure 3.15: Differential solid angle $d\\omega = \\sin\\theta\\,d\\theta\\,d\\phi$. The area of the differential patch on the unit sphere has width $\\sin\\theta\\,d\\phi$ and height $d\\theta$.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f15.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.8.3 구면 삼각형과 면적 (Spherical Triangles)',
      titleEn: '3.8.3 Spherical Triangles'
    },
    {
      type: 'paragraph',
      textKo: '단위 구면 위의 세 점을 대원(Great Circle, 구의 중심을 지나는 평면으로 자른 원) 호로 연결하여 만든 도형을 구면 삼각형(Spherical Triangle)이라고 부릅니다. 일반 평면 삼각형의 내각의 합은 항상 $180^\\circ(\\pi)$이지만, 구면 삼각형은 볼록한 곡면 위에 있으므로 내각의 합이 항상 $\\pi$보다 큽니다!',
      textEn: 'A spherical triangle is formed by connecting three points on the unit sphere with arcs of great circles (Figure 3.16). Unlike planar triangles, the sum of angles of a spherical triangle always exceeds $\\pi$.'
    },
    {
      type: 'figure',
      id: 'fig-3-16',
      number: 'Figure 3.16',
      captionKo: '그림 3.16: 단위 구면 위의 구면 삼각형: 세 변 $\\widehat{AB}, \\widehat{BC}, \\widehat{CA}$는 대원의 호이며, 세 꼭짓점에서의 내각을 각각 $\\alpha, \\beta, \\gamma$라 합니다.',
      captionEn: 'Figure 3.16: A spherical triangle on the unit sphere formed by great circle arcs.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f16.svg',
    },
    {
      type: 'paragraph',
      textKo: '지라르의 정리(Girard\'s Theorem)에 따르면, 단위 구면상에서 구면 삼각형의 면적(즉, 삼각형이 차지하는 입체각 $A$)은 세 내각의 합에서 $\\pi$를 뺀 구면 과잉(Spherical Excess)과 정확히 같습니다:',
      textEn: 'According to Girard\'s Theorem, the area $A$ of a spherical triangle on the unit sphere is simply its spherical excess:'
    },
    {
      type: 'equation',
      tex: 'A = \\alpha + \\beta + \\gamma - \\pi'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.8.4 옥타헤드럴 인코딩 (Octahedral Encoding)',
      titleEn: '3.8.4 Octahedral Encoding'
    },
    {
      type: 'paragraph',
      textKo: '3차원 단위 방향 벡터 $(x, y, z)$를 2차원 평면 좌표 $(u, v) \\in [0, 1]^2$로 압축하여 저장하는 것은 GPU 메모리와 텍스처 대역폭을 극적으로 절약하는 최신 그래픽스 기술입니다. 고전적인 $(\\theta, \\phi)$ 구면 매핑은 북극과 남극 근처에서 심각한 면적 왜곡(특이점 찌그러짐)이 발생합니다. pbrt는 정팔면체(Octahedron)의 8개 삼각형 면을 정사각형 평면으로 펼쳐 매핑하는 **옥타헤드럴 인코딩(`OctahedralVector`)**을 사용합니다(그림 3.17 ~ 3.19).',
      textEn: 'Octahedral encoding maps 3D unit vectors to a 2D square parameter space $[0, 1]^2$ with minimal distortion by projecting onto an octahedron and unfolding it (Figures 3.17–3.19).'
    },
    {
      type: 'figure',
      id: 'fig-3-17',
      number: 'Figure 3.17',
      captionKo: '그림 3.17: 정팔면체를 평면 정사각형으로 펼치는 전개 과정: 구면의 방향 벡터를 정팔면체 표면에 정사영한 뒤, 다이아몬드 형태로 펼쳐 2차원 사각 영역으로 매핑합니다.',
      captionEn: 'Figure 3.17: Unfolding an octahedron into a 2D diamond and square parameter space.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f17.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.8.5 방향 원뿔 (Direction Cones)',
      titleEn: '3.8.5 Direction Cones'
    },
    {
      type: 'paragraph',
      textKo: '3D 공간의 박스를 `Bounds3`로 감싸듯, 여러 방향들의 묶음(Solid Angles)을 감싸는 바운딩 볼륨으로 **방향 원뿔(`DirectionCone`)**을 사용합니다. 중심 방향 벡터 $\\mathbf{w}$와 최대 확산 각도의 코사인 값 $\\cos\\theta_{max}$로 정의되며, 복합 광원 클러스터링이나 보이지 않는 빛의 조기 제거(Culling)에 결정적입니다.',
      textEn: 'DirectionCone bounds a set of directions on the unit sphere, defined by a central axis vector $\\mathbf{w}$ and a maximum spread angle cosine $\\cos\\theta_{max}$.'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<DirectionCone Definition>>=',
      code: `class DirectionCone {
  public:
    DirectionCone() = default;
    DirectionCone(Vector3f w, Float cosTheta)
        : w(Normalize(w)), cosTheta(cosTheta) {}

    bool IsEmpty() const { return cosTheta == Infinity; }
    static DirectionCone EntireSphere() { return DirectionCone(Vector3f(0, 0, 1), -1); }

    Vector3f w;
    Float cosTheta = Infinity;
};

// 특정 방향 w가 원뿔 안에 포함되는지 판별
bool Inside(const DirectionCone &d, Vector3f w) {
    return !d.IsEmpty() && Dot(d.w, Normalize(w)) >= d.cosTheta;
}`
    }
  ]
};
