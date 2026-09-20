import type { SectionContent } from '../../../../types/book';

export const CH06_01_BASIC_SHAPE_INTERFACE: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "6",
  "chapterTitleKo": "제6장 3차원 형상과 교차 검사 (Shapes)",
  "sectionNumber": "6.1",
  "sectionTitle": "Basic Shape Interface",
  "sectionTitleKo": "6.1 기본 Shape 인터페이스 설계 (Basic Shape Interface)",
  "originalUrl": "https://pbr-book.org/4ed/Shapes/Basic_Shape_Interface.html",
  "prevSection": {
    "id": "ch05-04",
    "title": "5.4 디지털 필름과 이미징 파이프라인"
  },
  "nextSection": {
    "id": "ch06-02",
    "title": "6.2 구(Sphere)의 해석적 교차 검사"
  },
  "summary": {
    "keyTakeaways": [
      "Shape는 형상의 경계·교차·면적·샘플링에 대한 공통 인터페이스입니다. PBRT 4판은 TaggedPointer 기반 디스패치를 사용합니다.",
      "형상을 안전하게 포함하는 AABB와 법선 방향들을 포함하는 원뿔을 제공합니다. 반드시 수학적으로 가장 작은 바운드만 반환해야 하는 것은 아닙니다.",
      "슬랩(Slab) 교차 검사 알고리즘은 3차원 상자를 X, Y, Z 세 축 방향의 평행 평면 슬랩으로 분해하여 단 몇 번의 곱셈과 역수 연산만으로 초고속 충돌 검사를 수행합니다.",
      "Shape의 핵심 메서드인 Intersect()는 광선과의 교차 여부뿐만 아니라 충돌 표면의 위치, 법선, 편미분, 텍스처 좌표를 담은 ShapeIntersection을 반환하며, IntersectP()는 그림자 광선 전용 불리언(True/False) 검사를 수행합니다."
    ],
    "prerequisites": [
      "3.6절 광선의 파라메트릭 방정식 (p(t) = o + t d)",
      "3.7절 축 정렬 바운딩 박스 (AABB 및 슬랩 이론)",
      "3.8절 구면 기하학과 방향 원뿔 (DirectionCone)",
      "C++20 TaggedPointer 기반 정적/동적 다형성 설계"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.1 Shape 클래스의 추상화와 기하학적 역할",
      "titleEn": "6.1 The Shape Interface",
      "id": "ch06-01-b1"
    },
    {
      "type": "paragraph",
      "textKo": "물리 기반 렌더러의 핵심 루프는 **\"카메라에서 쏘아 올린 광선이 3차원 가상 세계의 어떤 물체와 가장 먼저 부딪히는가?\"**를 찾는 것입니다. 씬(Scene)에는 수억 개의 삼각형뿐만 아니라 완전한 수학적 매끄러움을 자랑하는 구(Sphere), 원기둥(Cylinder), 원판(Disk), 머리카락을 표현하는 3차 베지어 곡선(Curve) 등 다양한 형상이 존재합니다.",
      "textEn": "The core of any ray tracer is computing ray-primitive intersections. A scene may contain a diverse collection of geometric shapes: triangle meshes, spheres, cylinders, disks, bilinear patches, and spline curves for hair and fur. The Shape class defines the uniform interface through which the ray tracer queries all geometric properties and intersection tests.",
      "id": "ch06-01-b2"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "Shape 인터페이스는 왜 필요한가?",
      "summary": "Shape 인터페이스는 왜 필요한가?",
      "points": [
        {
          "title": "핵심 원리와 메커니즘",
          "content": "게임이나 렌더러를 만들 때 구(Sphere)와 삼각형(Triangle)은 수학 공식이 완전히 다릅니다. 구는 2차 방정식 근의 공식으로 풀고, 삼각형은 세 점의 무게중심 좌표로 풉니다.\n하지만 렌더링 엔진 전체가 \"이 물체가 구인지, 삼각형인지\" if-else 문으로 일일이 분기한다면 코드는 누더기가 되고 확장이 불가능해집니다.\nShape 인터페이스는 \"어떤 형태든 상관없이, 광선을 쏘면 충돌 지점(t)과 표면 법선(n)을 내놓아라!\"라는 표준 규격을 정의하여 시스템의 결합도를 완벽히 분리합니다."
        }
      ],
      "id": "ch06-01-b3"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.1.1 바운딩 박스와 법선 바운드 (Bounds)",
      "titleEn": "6.1.1 Spatial and Normal Bounds",
      "id": "ch06-01-b4"
    },
    {
      "type": "paragraph",
      "textKo": "복잡한 물체와 광선의 교차 검사는 연산 비용이 매우 큽니다. 따라서 광선이 물체 근처에도 오지 않았다면 애초에 교차 검사를 시도조차 하지 않는 것이 성능의 핵심입니다. 이를 위해 모든 Shape는 렌더링 공간 기준의 축 정렬 바운딩 박스(`Bounds3f`)를 필수적으로 반환해야 합니다.",
      "textEn": "Geometric intersection tests are computationally expensive. Bounding volumes allow the ray tracer to quickly reject rays that have no chance of intersecting an object. Each Shape must therefore provide a Bounds3f bounding box in rendering space.",
      "id": "ch06-01-b5"
    },
    {
      "type": "code",
      "chunkName": "<<pbrt-v4 Shape>>=",
      "explanationKo": "pbrt-v4 Shape 인터페이스의 바운딩 쿼리 메서드 선언",
      "language": "cpp",
      "code": "class Shape : public TaggedPointer<Sphere, Cylinder, Disk,\n                                   Triangle, BilinearPatch, Curve> {\n  public:\n    using TaggedPointer::TaggedPointer;\n    Bounds3f Bounds() const;\n    DirectionCone NormalBounds() const;\n    Float Area() const;\n    // 교차·샘플링 메서드는 아래에서 다룹니다.\n};",
      "provenance": "teaching",
      "id": "ch06-01-b6"
    },
    {
      "type": "paragraph",
      "textKo": "NormalBounds는 표면의 법선 방향들을 감싸는 원뿔입니다. 평평한 단면의 법선은 반구 전체가 아니라 한 방향입니다. 빛을 내보내는 방향 범위는 이 법선과 광원의 방출 모델·양면 여부를 함께 고려하여 구합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-01-b7"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.1.2 슬랩(Slab) 기법을 이용한 초고속 광선-상자 교차 검사",
      "titleEn": "6.1.2 Ray–Bounds Intersection via Slabs",
      "id": "ch06-01-b8"
    },
    {
      "type": "paragraph",
      "textKo": "축 정렬 바운딩 박스(AABB)와의 교차 검사는 컴퓨터 그래픽스 역사상 가장 빈번하게 호출되는 연산 중 하나입니다. pbrt는 직관적이면서도 하드웨어 파이프라인에 최적화된 **슬랩(Slab)** 알고리즘을 사용합니다.",
      "textEn": "Ray–bounding box intersection is one of the most frequently executed routines in a ray tracer. The slab method treats a 3D box as the intersection of three pairs of parallel infinite planes (slabs).",
      "id": "ch06-01-b9"
    },
    {
      "type": "figure",
      "id": "fig-6-1",
      "number": "Figure 6.1",
      "title": "Original Figure 6.1",
      "titleKo": "원문 그림 6.1",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-1.png",
      "captionKo": "그림 6.1 · 각 축의 슬랩을 광선이 지나는 t 구간을 구하고 교집합을 차례로 좁힙니다. 모든 축에서 겹치는 구간이 광선이 박스 안에 있는 범위입니다.",
      "captionEn": "Figure 6.1: Intersecting a Ray with an Axis-Aligned Bounding Box. We compute intersection points with each slab in turn, progressively narrowing the parametric interval. Here, in 2D, the intersection of the x and y extents along the ray (thick segment) gives the extent where the ray is inside the box.",
      "width": 998,
      "height": 403,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Basic_Shape_Interface.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "슬랩이란 축에 수직인 두 개의 무한 평면 사이 공간을 말합니다. 광선 $p(t) = o + td$가 $x$축 슬랩 평면 $x = x_0, x = x_1$과 만나는 거리 $t$는 매우 단순한 1차 방정식으로 유도됩니다:",
      "textEn": "A slab is the region between two parallel planes. The intersection t values for the slab bounded by x = x0 and x = x1 are given by elementary substitution:",
      "id": "ch06-01-b11"
    },
    {
      "type": "equation",
      "tex": "o_x + t d_x = x_0 \\implies t_0 = \\frac{x_0 - o_x}{d_x}, \\quad t_1 = \\frac{x_1 - o_x}{d_x}",
      "explanationKo": "슬랩 평면과의 매개변수 거리 t 유도 공식",
      "id": "ch06-01-b12"
    },
    {
      "type": "paragraph",
      "textKo": "각 축에서 광선의 허용 t 구간을 구해 현재 [0,tMax]와 교집합을 취합니다. 최종 시작값이 끝값보다 크면 교차가 없습니다. 방향 성분이 0일 때 무한대와 0×∞=NaN이 생길 수 있어, 원문은 비교 순서와 보수적인 오차 보정까지 세심하게 처리합니다. t는 단위 방향에서만 거리와 같습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-01-b13"
    },
    {
      "type": "figure",
      "id": "fig-6-2",
      "number": "Figure 6.2",
      "title": "Original Figure 6.2",
      "titleKo": "원문 그림 6.2",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-2.png",
      "captionKo": "그림 6.2 · x가 일정한 두 평면이 하나의 슬랩을 만듭니다. 광선이 평행하지 않으면 near와 far의 두 t 값으로 통과 범위를 구합니다. 평행한 경우는 별도 처리가 필요합니다.",
      "captionEn": "Figure 6.2: Intersecting a Ray with an Axis-Aligned Slab. The two planes shown here are described by x equals c for constant values c . The normal of each plane is left-parenthesis 1 comma 0 comma 0 right-parenthesis . Unless the ray is parallel to the planes, it will intersect the slab twice, at parametric positions t Subscript normal n normal e normal a normal r and t Subscript normal f normal a normal r .",
      "width": 998,
      "height": 406,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Basic_Shape_Interface.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "id": "fig-6-3",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.1.3 광선-형상 교차 인터페이스: Intersect() vs IntersectP()",
      "titleEn": "6.1.3 Ray Intersection Methods",
      "id": "ch06-01-b16"
    },
    {
      "type": "paragraph",
      "textKo": "Shape 클래스는 용도에 따라 서로 다른 두 가지 교차 검사 메서드를 제공합니다.",
      "textEn": "The Shape interface provides two distinct intersection routines tailored to different rendering tasks:",
      "id": "ch06-01-b17"
    },
    {
      "type": "code",
      "chunkName": "<<Shape>>=",
      "explanationKo": "Shape의 정밀 교차와 그림자 가시성 교차 인터페이스",
      "language": "cpp",
      "code": "// 1. 가장 가까운 충돌 지점의 모든 물리적 정보(법선, 텍스처 좌표, 편미분) 반환\npstd::optional<ShapeIntersection> Shape::Intersect(\n    const Ray &ray, Float tMax = Infinity) const;\n\n// 2. 그림자 광선 전용: 장애물 존재 여부만 빠르게 판별 (True / False)\nbool Shape::IntersectP(const Ray &ray, Float tMax = Infinity) const;",
      "provenance": "teaching",
      "id": "ch06-01-b18"
    },
    {
      "type": "paragraph",
      "textKo": "Intersect는 가장 가까운 유효 교차의 t와 SurfaceInteraction을 반환합니다. IntersectP는 교차가 하나라도 있는지만 묻는 검사로, 그림자나 가림 질의에 유용합니다. 구체 형상에 따라 정밀 교차 함수를 재사용할 수도 있고 일부 계산을 생략할 수도 있으므로 일정한 3~5배 속도 차이를 보장하지 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-01-b19"
    }
  ],
  "audit": {
    "checkedSourceSha256": "0c69ab924a77a43ca14f9e442416fd10d95a305b30d10a11bfb799892f5f97d7",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "6.1 Basic Shape Interface",
      "6.1.1  Bounding",
      "6.1.2  Ray–Bounds Intersections",
      "6.1.3  Intersection Tests",
      "6.1.4  Intersection Coordinate Spaces",
      "6.1.5  Sidedness",
      "6.1.6  Area",
      "6.1.7  Sampling"
    ],
    "sourceFigures": [
      "6.1",
      "6.2"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
