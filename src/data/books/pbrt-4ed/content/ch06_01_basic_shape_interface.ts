import { SectionContent } from '../../../../types/book';

export const CH06_01_BASIC_SHAPE_INTERFACE: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '6',
  chapterTitleKo: '제6장 3차원 형상과 교차 검사 (Shapes)',
  sectionNumber: '6.1',
  sectionTitle: 'Basic Shape Interface',
  sectionTitleKo: '6.1 기본 Shape 인터페이스 설계 (Basic Shape Interface)',
  originalUrl: 'https://pbr-book.org/4ed/Shapes/Basic_Shape_Interface.html',
  prevSection: {
    id: 'ch05-04',
    title: '5.4 디지털 필름과 이미징 파이프라인',
  },
  nextSection: {
    id: 'ch06-02',
    title: '6.2 구(Sphere)의 해석적 교차 검사',
  },
  summary: {
    keyTakeaways: [
      'Shape 인터페이스는 구, 삼각형, 원기둥 등 모든 3D 기하학적 형상이 반드시 구현해야 하는 공통 순수 가상/동적 다형성 계약(Contract)입니다.',
      '모든 형상은 자신을 감싸는 최소 크기의 축 정렬 바운딩 박스(AABB, Bounds3f)와 표면 법선의 분산 각도를 나타내는 법선 원뿔(DirectionCone)을 제공해야 합니다.',
      '슬랩(Slab) 교차 검사 알고리즘은 3차원 상자를 X, Y, Z 세 축 방향의 평행 평면 슬랩으로 분해하여 단 몇 번의 곱셈과 역수 연산만으로 초고속 충돌 검사를 수행합니다.',
      'Shape의 핵심 메서드인 Intersect()는 광선과의 교차 여부뿐만 아니라 충돌 표면의 위치, 법선, 편미분, 텍스처 좌표를 담은 ShapeIntersection을 반환하며, IntersectP()는 그림자 광선 전용 불리언(True/False) 검사를 수행합니다.'
    ],
    prerequisites: [
      '3.6절 광선의 파라메트릭 방정식 (p(t) = o + t d)',
      '3.7절 축 정렬 바운딩 박스 (AABB 및 슬랩 이론)',
      '3.8절 구면 기하학과 방향 원뿔 (DirectionCone)',
      'C++20 TaggedPointer 기반 정적/동적 다형성 설계'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.1 Shape 클래스의 추상화와 기하학적 역할',
      titleEn: '6.1 The Shape Interface'
    },
    {
      type: 'paragraph',
      textKo: '물리 기반 렌더러의 핵심 루프는 **"카메라에서 쏘아 올린 광선이 3차원 가상 세계의 어떤 물체와 가장 먼저 부딪히는가?"**를 찾는 것입니다. 씬(Scene)에는 수억 개의 삼각형뿐만 아니라 완전한 수학적 매끄러움을 자랑하는 구(Sphere), 원기둥(Cylinder), 원판(Disk), 머리카락을 표현하는 3차 베지어 곡선(Curve) 등 다양한 형상이 존재합니다.',
      textEn: 'The core of any ray tracer is computing ray-primitive intersections. A scene may contain a diverse collection of geometric shapes: triangle meshes, spheres, cylinders, disks, bilinear patches, and spline curves for hair and fur. The Shape class defines the uniform interface through which the ray tracer queries all geometric properties and intersection tests.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: 'Shape 인터페이스는 왜 필요한가?',
      summary: 'Shape 인터페이스는 왜 필요한가?',
      points: [
        {
          title: '핵심 원리와 메커니즘',
          content: '게임이나 렌더러를 만들 때 구(Sphere)와 삼각형(Triangle)은 수학 공식이 완전히 다릅니다. 구는 2차 방정식 근의 공식으로 풀고, 삼각형은 세 점의 무게중심 좌표로 풉니다.\n하지만 렌더링 엔진 전체가 "이 물체가 구인지, 삼각형인지" if-else 문으로 일일이 분기한다면 코드는 누더기가 되고 확장이 불가능해집니다.\nShape 인터페이스는 "어떤 형태든 상관없이, 광선을 쏘면 충돌 지점(t)과 표면 법선(n)을 내놓아라!"라는 표준 규격을 정의하여 시스템의 결합도를 완벽히 분리합니다.'
        }
      ]
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.1.1 바운딩 박스와 법선 바운드 (Bounds)',
      titleEn: '6.1.1 Spatial and Normal Bounds'
    },
    {
      type: 'paragraph',
      textKo: '복잡한 물체와 광선의 교차 검사는 연산 비용이 매우 큽니다. 따라서 광선이 물체 근처에도 오지 않았다면 애초에 교차 검사를 시도조차 하지 않는 것이 성능의 핵심입니다. 이를 위해 모든 Shape는 렌더링 공간 기준의 축 정렬 바운딩 박스(`Bounds3f`)를 필수적으로 반환해야 합니다.',
      textEn: 'Geometric intersection tests are computationally expensive. Bounding volumes allow the ray tracer to quickly reject rays that have no chance of intersecting an object. Each Shape must therefore provide a Bounds3f bounding box in rendering space.'
    },
    {
      type: 'code',
      chunkName: '<<pbrt-v4 Shape>>=',
      explanationKo: 'pbrt-v4 Shape 인터페이스의 바운딩 쿼리 메서드 선언',
      language: 'cpp',
      code: `class Shape {
  public:
    // 형상을 빈틈없이 감싸는 3D AABB 바운딩 박스 반환
    virtual Bounds3f Bounds() const = 0;

    // 표면 법선 벡터들의 분산 범위를 감싸는 방향 원뿔(DirectionCone) 반환
    virtual DirectionCone NormalBounds() const {
        return DirectionCone::EntireSphere(); // 기본값: 사방 전방위
    }

    // 표면적(Surface Area) 계산
    virtual Float Area() const = 0;
};`
    },
    {
      type: 'paragraph',
      textKo: '또한 pbrt 제4판은 물체의 공간적 크기뿐만 아니라 **표면 법선(Normal)의 분포 각도**를 원뿔 모양으로 감싸는 `NormalBounds()`를 도입했습니다. 만약 어떤 광원이 평평한 벽면이라면 법선은 앞쪽 반구($2\\pi\\text{ sr}$)만을 향하므로, 뒤편에 있는 관찰자에게는 빛을 전혀 비출 수 없음을 교차 검사 전에 즉시 판별(Culling)할 수 있습니다.',
      textEn: 'In addition to spatial extents, shapes can bound the range of their surface normals using a DirectionCone. This normal bounding is particularly valuable for light source culling: if an emissive surface faces away from a point, it cannot contribute illumination.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.1.2 슬랩(Slab) 기법을 이용한 초고속 광선-상자 교차 검사',
      titleEn: '6.1.2 Ray–Bounds Intersection via Slabs'
    },
    {
      type: 'paragraph',
      textKo: '축 정렬 바운딩 박스(AABB)와의 교차 검사는 컴퓨터 그래픽스 역사상 가장 빈번하게 호출되는 연산 중 하나입니다. pbrt는 직관적이면서도 하드웨어 파이프라인에 최적화된 **슬랩(Slab)** 알고리즘을 사용합니다.',
      textEn: 'Ray–bounding box intersection is one of the most frequently executed routines in a ray tracer. The slab method treats a 3D box as the intersection of three pairs of parallel infinite planes (slabs).'
    },
    {
      type: 'figure',
      id: 'fig-6-1',
      number: 'Figure 6.1',
      title: 'Ray–box intersection in 2D with two slabs',
      titleKo: '슬랩(Slab) 교차 검사의 기하학적 원리',
      src: '/books/pbrt-4ed/images/pha06f01.svg',
      captionKo: 'Figure 6.1: 슬랩(Slab) 교차 검사의 기하학적 원리. 광선이 3쌍의 축 정렬 평행 평면을 차례대로 통과하면서 유효 구간 $[t_{\\min}, t_{\\max}]$의 교집합을 좁혀나갑니다.',
      captionEn: 'Figure 6.1: Ray–box intersection in 2D with two slabs. The ray enters the box at the maximum of the entry t values and exits at the minimum of the exit t values.'
    },
    {
      type: 'paragraph',
      textKo: '슬랩이란 축에 수직인 두 개의 무한 평면 사이 공간을 말합니다. 광선 $p(t) = o + td$가 $x$축 슬랩 평면 $x = x_0, x = x_1$과 만나는 거리 $t$는 매우 단순한 1차 방정식으로 유도됩니다:',
      textEn: 'A slab is the region between two parallel planes. The intersection t values for the slab bounded by x = x0 and x = x1 are given by elementary substitution:'
    },
    {
      type: 'equation',
      tex: 'o_x + t d_x = x_0 \\implies t_0 = \\frac{x_0 - o_x}{d_x}, \\quad t_1 = \\frac{x_1 - o_x}{d_x}',
      explanationKo: '슬랩 평면과의 매개변수 거리 t 유도 공식'
    },
    {
      type: 'paragraph',
      textKo: '세 축($x, y, z$) 각각에 대해 들어오는 거리 $t_{\\text{near}}$와 나가는 거리 $t_{\\text{far}}$를 구한 뒤, **"가장 늦게 들어온 시간($\\max(t_{\\text{near}})$)"**과 **"가장 먼저 빠져나간 시간($\\min(t_{\\text{far}})$)"**을 비교합니다. 들어온 시간이 나간 시간보다 앞선다면($t_0 \\le t_1$), 광선은 반드시 상자 내부를 관통한 것입니다.',
      textEn: 'By computing the intersection interval for each of the three slabs and taking their set intersection, the interval [t0, t1] representing the ray segment inside the box is obtained. If t0 > t1, the ray misses the box.'
    },
    {
      type: 'figure',
      id: 'fig-6-2',
      number: 'Figure 6.2',
      title: 'Geometric configuration of a ray intersecting a single slab, illustrating entry and exit points',
      titleKo: '광선 방향 성분이 0에 가까울 때의 슬랩 교차 판정',
      src: '/books/pbrt-4ed/images/pha06f02.svg',
      captionKo: 'Figure 6.2: 광선 방향 성분이 0에 가까울 때의 슬랩 교차 판정. IEEE 754 부동소수점 무한대($\\pm\\infty$) 연산 규칙에 의해 조건문 분기 없이도 올바른 결과가 도출됩니다.',
      captionEn: 'Figure 6.2: Geometric configuration of a ray intersecting a single slab, illustrating entry and exit points.'
    },
    {
      type: 'figure',
      id: 'fig-6-3',
      number: 'Figure 6.3',
      title: 'Efficient ray–box intersection using precomputed reciprocal ray direction and direction sign bits',
      titleKo: '광선 역방향 벡터(invDir)를 미리 캐싱하여 나눗셈을 곱셈으로 대체하는 SIMD 친화적 최적화 구조',
      src: '/books/pbrt-4ed/images/pha06f03.svg',
      captionKo: 'Figure 6.3: 광선 역방향 벡터(invDir)를 미리 캐싱하여 나눗셈을 곱셈으로 대체하는 SIMD 친화적 최적화 구조.',
      captionEn: 'Figure 6.3: Efficient ray–box intersection using precomputed reciprocal ray direction and direction sign bits.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.1.3 광선-형상 교차 인터페이스: Intersect() vs IntersectP()',
      titleEn: '6.1.3 Ray Intersection Methods'
    },
    {
      type: 'paragraph',
      textKo: 'Shape 클래스는 용도에 따라 서로 다른 두 가지 교차 검사 메서드를 제공합니다.',
      textEn: 'The Shape interface provides two distinct intersection routines tailored to different rendering tasks:'
    },
    {
      type: 'code',
      chunkName: '<<Shape>>=',
      explanationKo: 'Shape의 정밀 교차와 그림자 가시성 교차 인터페이스',
      language: 'cpp',
      code: `// 1. 가장 가까운 충돌 지점의 모든 물리적 정보(법선, 텍스처 좌표, 편미분) 반환
pstd::optional<ShapeIntersection> Shape::Intersect(
    const Ray &ray, Float tMax = Infinity) const;

// 2. 그림자 광선 전용: 장애물 존재 여부만 빠르게 판별 (True / False)
bool Shape::IntersectP(const Ray &ray, Float tMax = Infinity) const;`
    },
    {
      type: 'paragraph',
      textKo: '`Intersect()`는 카메라 시선 광선이나 표면 반사 광선처럼 **빛의 색상과 셰이딩을 실제로 계산해야 하는 광선**을 위한 것입니다. 교차점의 정확한 3차원 위치, 표면 기하 법선($n$), 텍스처 좌표($(u, v)$), 표면 곡률과 편미분($\\partial p/\\partial u, \\partial p/\\partial v$)을 담은 `SurfaceInteraction` 객체를 완벽히 조립하여 반환합니다.\n반면 `IntersectP()`는 조명에서 비추는 그림자 광선(Shadow Ray)처럼 **"빛이 가려졌는가, 아닌가"**만 알면 되는 경우에 사용되며, 부가적인 기하 구조체를 일절 생성하지 않아 최대 3~5배 이상 빠르게 연산됩니다.',
      textEn: 'Intersect() returns full differential geometry at the hit point packaged into a SurfaceInteraction, essential for shading. IntersectP() is an optimized predicate test used for shadow rays where only visibility needs to be tested.'
    }
  ]
};
