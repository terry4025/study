import { SectionContent } from '../../../../types/book';

export const CH03_06_RAYS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.6',
  sectionTitle: 'Rays',
  sectionTitleKo: '3.6 광선 (Ray): 빛의 이동 경로와 파라메트릭 방정식',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/Rays.html',
  prevSection: {
    id: 'ch03-05',
    title: '3.5 법선 벡터 (Normal): 표면의 수직 방향',
  },
  nextSection: {
    id: 'ch03-07',
    title: '3.7 바운딩 박스 (Bounding Boxes & AABB)',
  },
  summary: {
    keyTakeaways: [
      '광선(Ray)은 시작점(원점 $o$)과 진행 방향(방향 벡터 $\\mathbf{d}$)으로 정의되는 반직선(Semi-infinite Line)입니다.',
      '광선 위의 임의의 점은 파라메트릭 방정식 $r(t) = o + t\\mathbf{d} \\; (0 \\le t < \\infty)$로 표현되며, C++의 함수 호출 연산자 `operator()(Float t)`를 오버로딩하여 수학 수식처럼 직관적으로 위치를 계산합니다.',
      '현대 렌더링 엔진의 광선은 단순한 기하학적 직선을 넘어, 애니메이션 모션 블러를 위한 시간 정보(`time`)와 안개/연기/액체 등 볼륨 렌더링을 위한 매질(`medium`) 정보를 함께 운반합니다.',
      '광선 미분(`RayDifferential`)은 주 광선 외에 인접 픽셀로 향하는 보조 광선 2개를 함께 추적하여, 물체 표면에 투영된 픽셀의 발자국(Footprint) 크기를 계산함으로써 텍스처 앨리어싱(계단 현상)을 제거하는 핵심 기술입니다.'
    ],
    prerequisites: [
      '3.4절 점(`Point3f`) 및 3.3절 벡터(`Vector3f`)',
      '직선의 매개변수(Parametric) 방정식'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '3.6 광선 (Rays)',
      titleEn: '3.6 Rays'
    },
    {
      type: 'paragraph',
      textKo: '광선(Ray) $r$은 시작 원점 $o$와 진행 방향 벡터 $\\mathbf{d}$로 규정되는 반직선(Semi-infinite Line)입니다(그림 3.8 참조). pbrt는 원점 표현에 `Point3f`를 사용하고 방향 벡터 표현에 `Vector3f`를 사용하여 `Ray` 클래스를 모델링합니다. 렌더링 연산에서는 정수형 광선이 전혀 필요하지 않으므로 부동소수점(`Float`) 타입 전용으로 정의됩니다.',
      textEn: 'A ray $r$ is a semi-infinite line specified by its origin $o$ and direction $\\mathbf{d}$; see Figure 3.8. pbrt represents Rays using a Point3f for the origin and a Vector3f for the direction; there is no need for non-Float-based rays in pbrt.'
    },
    {
      type: 'figure',
      id: 'fig-3-8',
      number: 'Figure 3.8',
      captionKo: '그림 3.8: 광선은 시작 원점 $o$와 방향 벡터 $\\mathbf{d}$에 의해 정의되는 3차원 반직선입니다.',
      captionEn: 'Figure 3.8: A ray is a semi-infinite line defined by its origin $o$ and its direction vector $\\mathbf{d}$.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f08.svg',
    },
    {
      type: 'paragraph',
      textKo: '광선의 매개변수(Parametric) 형태는 스칼라 매개변수 $t$의 함수로 표현되며, 광선이 지나가는 3차원 공간 속 점들의 궤적을 나타냅니다:',
      textEn: 'The parametric form of a ray expresses it as a function of a scalar value $t$, giving the set of points that the ray passes through:'
    },
    {
      type: 'equation',
      tex: 'r(t) = o + t\\mathbf{d} \\quad (0 \\le t < \\infty)'
    },
    {
      type: 'paragraph',
      textKo: '`Ray` 클래스는 이 $r(t)$ 수학 표기법을 코드에서 직관적으로 재현할 수 있도록 함수 호출 연산자 `operator()(Float t)`를 오버로딩합니다. 따라서 `Point3f p = r(1.7f);`와 같이 쓰면 광선이 시작점에서 $t = 1.7$만큼 전진했을 때의 정확한 충돌 지점 좌표를 손쉽게 구할 수 있습니다.',
      textEn: 'The Ray class overloads the function application operator for rays in order to match the $r(t)$ notation in Equation (3.4).'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Ray Definition>>=',
      code: `class Ray {
  public:
    Ray() = default;
    Ray(Point3f o, Vector3f d, Float time = 0.f, Medium medium = nullptr)
        : o(o), d(d), time(time), medium(medium) {}

    Point3f operator()(Float t) const { return o + d * t; }

    PBRT_CPU_GPU
    bool HasNaN() const { return (o.HasNaN() || d.HasNaN()); }

    // 광선의 핵심 멤버 변수 (접근 편의를 위해 public 공개)
    Point3f o;
    Vector3f d;
    Float time = 0;
    Medium medium = nullptr;
};`
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 time과 medium 필드가 왜 광선에 필요할까?',
      summary: '💡 time과 medium 필드가 왜 광선에 필요할까?',
      points: [
        {
          title: '핵심 설명',
          content: '1. **시간 필드 (`time`)**: 현실 세계 카메라는 셔터가 열려 있는 동안 물체가 움직이면 잔상(모션 블러, Motion Blur)이 생깁니다. 렌더러가 사실적인 모션 블러를 시뮬레이션하려면 각 광선마다 자신이 발사된 특정 시점($time \\\\in [0, 1]$)을 기억하고 있어야 해당 시점의 움직이는 물체 위치와 교차 검사를 할 수 있습니다.\\n\\n2. **매질 필드 (`medium`)**: 빛은 진공이나 맑은 공기뿐만 아니라 짙은 안개, 담배 연기, 우유, 탁한 물속을 통과하기도 합니다(참여 매질, Participating Media). 광선이 어떤 매질 속에서 이동 중인지를 알아야 매질에 의한 빛의 흡수(Absorption)와 산란(Scattering) 감쇠를 물리적으로 정확하게 계산할 수 있습니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.6.1 광선 미분 (Ray Differentials)',
      titleEn: '3.6.1 Ray Differentials'
    },
    {
      type: 'paragraph',
      textKo: '텍스처 매핑에서 화면에 발생하는 지글거리는 계단 현상(앨리어싱, Aliasing)을 완벽하게 제거하려면, 단일 광선 하나만으로는 부족합니다. 화면 필름 평면에서 한 픽셀이 차지하는 3D 표면 상의 영역 크기(풋프린트, Footprint)를 알아야 적절한 텍스처 밉맵(Mipmap) 해상도를 선택할 수 있기 때문입니다. pbrt는 이를 해결하기 위해 `Ray`를 상속받은 `RayDifferential` 클래스를 사용합니다.',
      textEn: 'To be able to perform better antialiasing with the texture functions defined in Chapter 10, pbrt makes use of the RayDifferential class, which is a subclass of Ray that contains additional information about two auxiliary rays.'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<RayDifferential Definition>>=',
      code: `class RayDifferential : public Ray {
  public:
    RayDifferential() = default;
    RayDifferential(Point3f o, Vector3f d, Float time = 0.f, Medium medium = nullptr)
        : Ray(o, d, time, medium) {}
    explicit RayDifferential(const Ray &ray) : Ray(ray) {}

    void ScaleDifferentials(Float s) {
        rxOrigin = o + (rxOrigin - o) * s;
        ryOrigin = o + (ryOrigin - o) * s;
        rxDirection = d + (rxDirection - d) * s;
        ryDirection = d + (ryDirection - d) * s;
    }

    bool hasDifferentials = false;
    Point3f rxOrigin, ryOrigin;       // x축, y축 방향으로 1픽셀 오프셋된 보조 광선 원점
    Vector3f rxDirection, ryDirection; // x축, y축 보조 광선 방향 벡터
};`
    },
    {
      type: 'paragraph',
      textKo: '`RayDifferential`은 주 광선(Primary Ray) 외에 필름 평면에서 가로($x$)와 세로($y$)로 인접한 픽셀로 발사되는 두 개의 보조 광선(`rx`, `ry`) 정보를 함께 담고 있습니다. 카메라가 픽셀당 여러 개의 샘플 광선(Super-sampling)을 쏠 때, 실제 샘플 간의 간격은 1픽셀보다 좁아집니다. 이때 `ScaleDifferentials(s)` 메서드를 호출하여 보조 광선들의 간격을 축소해 주면 텍스처가 과도하게 흐려지는(Blurry) 부작용 없이 극도로 선명하고 정밀한 앤티앨리어싱을 구현할 수 있습니다.',
      textEn: 'These extra rays represent camera rays offset by one sample in the x and y direction from the main ray on the film plane... The ScaleDifferentials() method takes care of this, given an estimated sample spacing of s.'
    }
  ]
};
