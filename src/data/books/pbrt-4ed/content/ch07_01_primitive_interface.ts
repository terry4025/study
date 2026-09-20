import type { SectionContent } from '../../../../types/book';

export const CH07_01_PRIMITIVE_INTERFACE: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "7",
  "chapterTitleKo": "제7장 가속 구조 BVH (Intersection Acceleration)",
  "sectionNumber": "7.1",
  "sectionTitle": "Primitive Interface and Geometric Primitives",
  "sectionTitleKo": "7.1 기본 프리미티브 인터페이스와 기하 프리미티브",
  "originalUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives.html",
  "prevSection": {
    "id": "ch06-08",
    "title": "6.8 부동소수점 반올림 오차 엄밀 제어"
  },
  "nextSection": {
    "id": "ch07-02",
    "title": "7.2 집합체 구조(Aggregates)"
  },
  "summary": {
    "keyTakeaways": [
      "Shape가 기하학적 형태(점, 법선, 교차점)만을 순수하게 정의한다면, Primitive는 여기에 물리적 재질(Material), 빛 방출(Emission), 참여 매질(Medium)의 물리적 옷을 입혀 가상 세계의 완전한 물체를 완성합니다.",
      "GeometricPrimitive는 단일 Shape와 Material을 결합하며, 텍스처 투명도를 처리하기 위한 알파 테스팅(Alpha Testing) 메커니즘을 내장합니다.",
      "확률적 알파 검사는 α의 확률로 교차를 받아들이며, 반복 표본으로 경계를 표현합니다. 유한 샘플에서는 노이즈가 남으며 모든 앨리어싱을 자동 제거하지 않습니다.",
      "TransformedPrimitive는 컴퓨터 그래픽스 최고의 메모리 압축 기술인 오브젝트 인스턴싱(Object Instancing)을 담당합니다. 메모리에는 단 2,400만 개의 삼각형만 올려두고 좌표 변환 행렬만 복사하여 31억 개 삼각형에 달하는 거대한 숲(Landscape 씬)을 렌더링합니다.",
      "AnimatedPrimitive는 카메라 셔터가 열려 있는 동안 시간에 따라 변환(Transform)되는 동적 물체를 감싸며, 모션 블러 광선 추적을 자연스럽게 지원합니다."
    ],
    "prerequisites": [
      "6장 6.1 기본 Shape 인터페이스 (Bounds3f, Intersect, IntersectP)",
      "3장 3.9 3차원 변환 행렬과 아핀 변환 (Transform, AnimatedTransform)",
      "2장 2.1 몬테카를로 적분과 확률 밀도 기초"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.1.1 Primitive 인터페이스의 역할과 추상화",
      "titleEn": "7.1.1 The Primitive Interface",
      "id": "ch07-01-b1"
    },
    {
      "type": "paragraph",
      "textKo": "제6장에서 다룬 `Shape` 클래스들은 3차원 공간에서 물체의 기하학적 특성(경계 상자, 광선 교차, 표면 미분)만을 전담했습니다. 그러나 실제 씬(Scene)을 구성하기 위해서는 형상만으로는 부족합니다. 광선이 구나 삼각형에 부딪혔을 때, 그 표면이 **거친 플라스틱인지, 투명한 유리인지, 아니면 스스로 빛을 뿜는 조명인지**를 나타내는 물리적 속성이 결합되어야 합니다.",
      "textEn": "The classes described in the last chapter focus exclusively on representing geometric properties of 3D objects. Although the Shape interface provides a convenient abstraction for geometric operations such as intersection and bounding, it is not sufficiently expressive to fully describe an object in a scene. For example, it is necessary to bind material properties to each shape in order to specify its appearance.",
      "id": "ch07-01-b2"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "Shape와 Primitive는 왜 엄격히 분리되어 있는가?",
      "summary": "기하 연산(충돌)과 물리 셰이딩(재질)의 관심사를 분리하여 모듈성과 메모리 효율을 극대화하는 소프트웨어 아키텍처",
      "points": [
        {
          "title": "관심사의 완벽한 분리 (Separation of Concerns)",
          "content": "하나의 삼각 메시(Shape)는 순수한 정점 배열(Point3f)과 인덱스만 가집니다. 여기에 쇠 재질을 붙이면 강철 검이 되고, 나무 재질을 붙이면 목검이 됩니다. Shape에 재질 포인터를 직접 박아 넣으면 재질이 다른 동일 형태 물체를 매번 중복 복제해야 하므로 메모리가 낭비됩니다."
        },
        {
          "title": "가속 구조(BVH)의 일관된 다루기",
          "content": "가속 구조인 BVH는 개별 삼각형(Shape)뿐만 아니라, 수천만 개의 인스턴스 숲(`TransformedPrimitive`)이나 다른 서브 BVH(`Aggregate`)까지도 똑같이 하나의 상자로 감싸야 합니다. `Primitive` 인터페이스는 이 모든 것을 단일한 규격으로 통일해 줍니다."
        }
      ],
      "id": "ch07-01-b3"
    },
    {
      "type": "paragraph",
      "textKo": "PBRT 4판의 Primitive 인터페이스는 TaggedPointer를 사용해 구현을 고릅니다. Bounds, Intersect, IntersectP라는 공통 질의를 제공하며, 단일 형상뿐 아니라 가속 구조와 인스턴스도 같은 방식으로 다룰 수 있습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-01-b4"
    },
    {
      "type": "code",
      "chunkName": "<<Primitive Interface Definition>>=",
      "language": "cpp",
      "code": "class Primitive : public TaggedPointer<SimplePrimitive, GeometricPrimitive,\n    TransformedPrimitive, AnimatedPrimitive, BVHAggregate, KdTreeAggregate> {\n  public:\n    using TaggedPointer::TaggedPointer;\n    Bounds3f Bounds() const;\n    pstd::optional<ShapeIntersection> Intersect(const Ray &ray, Float tMax = Infinity) const;\n    bool IntersectP(const Ray &ray, Float tMax = Infinity) const;\n};",
      "explanationKo": "Primitive의 인터페이스는 Shape와 거의 유사해 보이지만, 반환되는 ShapeIntersection 내부의 SurfaceInteraction에 유효한 Material과 광원(AreaLight) 정보가 완벽하게 바인딩되어 나온다는 결정적인 차이가 있습니다.",
      "provenance": "teaching",
      "id": "ch07-01-b5"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.1.2 GeometricPrimitive와 확률적 알파 테스팅",
      "titleEn": "7.1.2 GeometricPrimitive and Stochastic Alpha Testing",
      "id": "ch07-01-b6"
    },
    {
      "type": "paragraph",
      "textKo": "GeometricPrimitive는 Shape, Material, 발광 표면의 Light, MediumInterface, 선택적인 알파 텍스처를 연결합니다. 가리키는 객체들을 반드시 이 객체가 단독 소유한다는 뜻은 아닙니다. 여기의 발광 인터페이스 이름은 Emission이 아니라 Light입니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-01-b7"
    },
    {
      "type": "paragraph",
      "textKo": "특히 나뭇잎이나 옷감, 철조망처럼 복잡한 미세 윤곽을 가진 물체는 모든 잎맥을 수천만 개의 폴리곤으로 모델링하기 어렵기 때문에, 단순한 사각형 평면 위에 **투명도 텍스처(Alpha Texture)**를 입혀서 렌더링합니다. 이때 광선이 평면과 교차했을 때 해당 지점의 알파 값이 투명하다면 광선은 그냥 뚫고 지나가야 합니다.",
      "textEn": "Objects such as leaves, chain-link fences, and fabric often rely on alpha masking textures rather than dense geometric meshes.",
      "id": "ch07-01-b8"
    },
    {
      "type": "paragraph",
      "textKo": "과거 실시간 렌더러나 구형 레이 트레이서는 알파 값이 0.5 이상이면 불투명, 미만이면 투명으로 딱딱하게 끊어버리는 **고정 임계값(Fixed Threshold)** 방식을 썼습니다. 하지만 이 방식은 나뭇잎 모서리가 칼로 오려낸 것처럼 자글거리는 심각한 앨리어싱(Aliasing)을 유발하고, 나뭇잎 크기가 원래보다 쪼그라드는 왜곡을 만듭니다.",
      "textEn": "Traditional renderers often use a fixed threshold (e.g., 0.5) for alpha tests, leading to severe aliasing and silhouette shrinkage.",
      "id": "ch07-01-b9"
    },
    {
      "type": "figure",
      "id": "fig-7-1",
      "number": "Figure 7.1",
      "title": "Original Figure 7.1",
      "titleKo": "원문 그림 7.1",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-1.png",
      "captionKo": "그림 7.1 · 알파 텍스처로 표현한 가지를 고정 임계값과 확률적 검사로 비교합니다. 임계값 1을 쓰면 가늘어지고 가장자리가 거칠어지지만 확률적 검사는 표본을 모았을 때 더 부드럽게 표현합니다.",
      "captionEn": "Figure 7.1: Comparison of Stochastic Alpha Testing to Using a Fixed Threshold. (a) Example scene: the two fir branches are modeled using a single quadrilateral with an alpha texture. (b) If a fixed threshold is used for the alpha test, the shape is not faithfully reproduced. Here a threshold of 1 was used, leading to shrinkage and jagged edges. (c) If a stochastic alpha test is used, the result is a smoother and more realistic transition.",
      "width": 998,
      "height": 937,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt는 이를 해결하기 위해 **확률적 알파 테스팅(Stochastic Alpha Testing)**을 도입했습니다. 광선이 충돌한 지점의 알파 값 $\\alpha(u, v) \\in [0, 1]$에 대해, $[0, 1)$ 범위의 균등 난수 $\\xi$를 뽑아 다음 조건을 검사합니다:",
      "textEn": "pbrt addresses this through stochastic alpha testing, evaluating intersection probabilistically based on a uniform random sample xi:",
      "id": "ch07-01-b11"
    },
    {
      "type": "equation",
      "tex": "\\text{Hit 인정 여부} = \\begin{cases} \\text{True (표면 충돌)}, & \\text{if } \\xi < \\alpha(u, v) \\\\ \\text{False (광선 투과)}, & \\text{otherwise} \\end{cases}",
      "explanationKo": "알파 값이 0.7(70% 불투명)이라면 70%의 광선은 표면에 충돌하여 나뭇잎 색상을 반사하고, 30%의 광선은 나뭇잎을 그대로 관통하여 뒷배경을 비춥니다.",
      "id": "ch07-01-b12"
    },
    {
      "type": "paragraph",
      "textKo": "이 방법은 반복 샘플의 평균으로 알파의 효과를 표현합니다. 각 샘플에서는 교차를 받아들이거나 무시하므로 노이즈가 있습니다. 샘플 수·알파 필터링·상관관계에 따라 품질이 달라지고, 모든 반투명 물리 현상을 이 이진 선택만으로 재현하는 것은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-01-b13"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.1.3 TransformedPrimitive와 오브젝트 인스턴싱 (Object Instancing)",
      "titleEn": "7.1.3 TransformedPrimitive and Object Instancing",
      "id": "ch07-01-b14"
    },
    {
      "type": "paragraph",
      "textKo": "컴퓨터 그래픽스에서 숲이나 도시, 잔디밭처럼 동일한 물체가 수천수만 개 반복 배치되는 장면을 렌더링할 때, 모든 나무의 삼각형들을 일일이 메모리에 복사해 넣으면 수백 기가바이트의 메모리가 필요하여 컴퓨터가 즉시 다운됩니다.",
      "textEn": "Scenes featuring forests, cities, or crowds contain vast amounts of repeated geometry that would exhaust system memory if stored redundantly.",
      "id": "ch07-01-b15"
    },
    {
      "type": "paragraph",
      "textKo": "`TransformedPrimitive`는 **오브젝트 인스턴싱(Object Instancing)**의 핵심 클래스입니다. 메모리에는 단 하나의 정밀한 나무 모델(`Primitive`)만을 올려두고, 각각의 나무 인스턴스는 단지 서로 다른 **3D 아핀 변환 행렬(`renderFromPrimitive`)**만을 가볍게 참조합니다.",
      "textEn": "TransformedPrimitive implements object instancing by wrapping a shared primitive with a transformation from primitive space to rendering space.",
      "id": "ch07-01-b16"
    },
    {
      "type": "figure",
      "id": "fig-7-2",
      "number": "Figure 7.2",
      "title": "Original Figure 7.2",
      "titleKo": "원문 그림 7.2",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-2.png",
      "captionKo": "그림 7.2 · 인스턴싱으로 고유 삼각형 약 2,400만 개를 재사용해 총 31억 삼각형 수준의 장면을 표현했습니다. 장면 제공: Laubwerk.",
      "captionEn": "Figure 7.2: This outdoor scene makes heavy use of instancing as a mechanism for compressing the scene’s description. There are only 24 million unique triangles in the scene, although, thanks to object reuse through instancing, the total geometric complexity is 3.1 billion triangles. (Scene courtesy of Laubwerk.)",
      "width": 998,
      "height": 563,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "광선을 역변환(Inverse Transform)하는 수학의 지혜",
      "summary": "수억 개의 물체 정점을 일일이 월드로 변환하는 대신, 광선 하나를 물체의 로컬 공간으로 역변환하여 충돌 검사하는 천재적 트릭",
      "points": [
        {
          "title": "정점 변환의 비극 vs 광선 역변환의 기적",
          "content": "나무 1그루가 100만 개 삼각형으로 구성되어 있고 숲에 1,000그루가 있다면, 정점을 월드로 변환하려면 $100만 \\times 1000 = 10억$번의 행렬 곱셈이 필요합니다. 게다가 10억 개의 새로운 3D 정점을 저장할 수십 기가바이트 메모리가 증발합니다."
        },
        {
          "title": "광선 $O + td$ 단 1개만 역변환!",
          "content": "pbrt는 나무 정점은 손끝 하나 건드리지 않습니다! 대신 날아가는 광선 $r$에 나무의 역행렬 $M^{-1}$을 곱해 나무의 로컬 공간으로 보낸 뒤, 원래 있던 100만 개짜리 공용 BVH 상자 하나와 교차 검사를 수행합니다. 교차가 성공하면 충돌 위치만 다시 원래 월드로 $M$을 곱해 되돌려놓습니다!"
        }
      ],
      "id": "ch07-01-b18"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.1.4 AnimatedPrimitive와 4차원 모션 블러",
      "titleEn": "7.1.4 AnimatedPrimitive and Motion Blur",
      "id": "ch07-01-b19"
    },
    {
      "type": "paragraph",
      "textKo": "물체가 빠른 속도로 움직이거나 회전할 때, 카메라 셔터가 열려 있는 시간 $t \\in [t_0, t_1]$ 동안 잔상이 남는 현상을 **모션 블러(Motion Blur)**라고 합니다. pbrt의 `AnimatedPrimitive`는 제3장에서 배운 `AnimatedTransform`(쿼터니언 구면 선형 보간 SLERP 및 이동 행렬 보간)을 소유합니다.",
      "textEn": "When objects move rapidly during camera exposure, motion blur occurs. AnimatedPrimitive incorporates an AnimatedTransform to model dynamic transformations over time.",
      "id": "ch07-01-b20"
    },
    {
      "type": "paragraph",
      "textKo": "AnimatedPrimitive는 ray.time의 변환을 평가하고 광선을 객체 공간으로 옮겨 교차 검사합니다. 여러 시각의 표본을 적절한 노출 가중치로 모으면 모션 블러를 추정합니다. 샘플 수가 유한하면 시간적 샘플링 오차가 남습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-01-b21"
    }
  ],
  "audit": {
    "checkedSourceSha256": "2b97c5c428992b4e8897ccfafdd85c895d0fb9190942970e9df894c71ec91258",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "7.1 Primitive Interface and Geometric Primitives",
      "7.1.1  Geometric Primitives",
      "7.1.2  Object Instancing and Primitives in Motion"
    ],
    "sourceFigures": [
      "7.1",
      "7.2"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
