import type { SectionContent } from '../../../../types/book';

export const CH07_02_AGGREGATES: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "7",
  "chapterTitleKo": "제7장 가속 구조 BVH (Intersection Acceleration)",
  "sectionNumber": "7.2",
  "sectionTitle": "Aggregates",
  "sectionTitleKo": "7.2 집합체 구조와 공간 분할 가속 기본",
  "originalUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Aggregates.html",
  "prevSection": {
    "id": "ch07-01",
    "title": "7.1 기본 프리미티브 인터페이스와 기하 프리미티브"
  },
  "nextSection": {
    "id": "ch07-03",
    "title": "7.3 BVH(계층적 바운딩 볼륨) 트리 구조"
  },
  "summary": {
    "keyTakeaways": [
      "Aggregate는 수천만 개의 Primitive들을 내부에 품고 있으면서, 외부 렌더러에게는 마치 단 하나의 Primitive인 것처럼 동작하는 컴포짓(Composite) 패턴의 컨테이너입니다.",
      "모든 프리미티브를 검사하는 기본 방법은 광선당 O(N)번의 형상 질의를 합니다. 전체 비용은 광선 수와 각 검사 비용에 따라 달라집니다.",
      "가속 구조는 빗나간 넓은 영역을 건너뛰어 평균 비용을 줄입니다. 겹침과 장면·광선 분포에 따라 많은 노드를 방문할 수 있어 일반적인 최악 O(log N) 보장은 없습니다.",
      "공간 분할(Spatial Partitioning, 예: Kd-트리)은 3차원 공간을 겹치지 않는 셀로 분할하며 물체가 여러 방에 중복 속할 수 있는 반면, 물체 분할(Object Partitioning, 예: BVH)은 물체들을 묶어 상자로 감싸므로 상자끼리는 겹치지만 물체 중복이 없습니다.",
      "Kd-Tree(k-d 트리)는 축정렬 평면으로 공간을 적응형 재귀 분할하는 대표적인 공간 분할 가속 구조로, 앞쪽 공간부터 뒤쪽 공간으로 엄밀한 순차적 광선 순회(Ray Traversal)가 가능합니다."
    ],
    "prerequisites": [
      "7장 7.1 기본 프리미티브 인터페이스 (Primitive, GeometricPrimitive)",
      "6장 6.1 슬랩(Slab) AABB 상자 교차 검사 기법",
      "컴퓨터공학 자료구조: 이진 탐색 트리(BST)와 시간 복잡도 O(log N)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.2.1 $O(N)$ 선형 탐색의 파멸과 가속 구조의 절대적 필요성",
      "titleEn": "7.2.1 The Need for Acceleration Structures",
      "id": "ch07-02-b1"
    },
    {
      "type": "paragraph",
      "textKo": "물리 기반 렌더러가 화면을 렌더링할 때 발사하는 광선의 수는 상상을 초월합니다. $4\\text{K}$ 해상도($3840 \\times 2160 \\approx 8.3 \\times 10^6$ 픽셀)에서 노이즈를 없애기 위해 픽셀당 1,024개의 샘플 광선을 쏘고, 각 광선이 반사·굴절되어 5번 튕긴다면 씬에 발사되는 총 광선의 수는 **약 400억 개($4 \\times 10^{10}$)**에 달합니다.",
      "textEn": "A physically based renderer traces billions of rays for high-resolution images. For a 4K image with 1024 samples per pixel and multiple bounces, tens of billions of rays are evaluated.",
      "id": "ch07-02-b2"
    },
    {
      "type": "paragraph",
      "textKo": "만약 씬에 1,000만 개($10^7$)의 삼각형이 존재할 때 아무런 가속 구조 없이 단순히 모든 삼각형을 루프로 돌며 검사하는 **선형 탐색(Linear Search, $O(N)$)**을 사용한다면 어떻게 될까요?",
      "textEn": "If a scene containing 10 million triangles were tested naively against every ray using linear search, the computational cost would be catastrophic.",
      "id": "ch07-02-b3"
    },
    {
      "type": "equation",
      "tex": "\\text{총 교차 검사 횟수} = 4 \\times 10^{10} \\text{ (광선 수)} \\times 10^7 \\text{ (삼각형 수)} = 4 \\times 10^{17} \\text{ 회}",
      "explanationKo": "초당 10억(10^9) 번의 삼각형 교차 검사를 처리하는 슈퍼컴퓨터를 동원해도 4억 초, 즉 무려 12.6년 동안 컴퓨터를 켜놓아야 단 한 장의 사진이 완성됩니다!",
      "id": "ch07-02-b4"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "BVH는 정렬 배열의 이진 탐색과 다릅니다",
      "summary": "BVH는 정렬 배열의 이진 탐색과 다릅니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "이진 탐색은 한 비교에서 한쪽 절반만 선택합니다. BVH에서는 양쪽 상자를 광선이 모두 통과할 수 있어 둘 다 방문할 수 있습니다. 트리 깊이가 log₂N 정도여도 총 방문 노드 수가 반드시 그 수와 같지는 않습니다. 좋은 바운드와 분할이 실제 방문량을 줄입니다."
        }
      ],
      "id": "ch07-02-b5"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.2.2 Aggregate 인터페이스와 컴포짓 패턴",
      "titleEn": "7.2.2 The Aggregate Interface",
      "id": "ch07-02-b6"
    },
    {
      "type": "paragraph",
      "textKo": "Aggregate는 여러 Primitive를 하나의 Primitive처럼 다루는 역할을 뜻합니다. PBRT 4판에서는 BVHAggregate와 KdTreeAggregate 같은 구체 타입을 Primitive의 태그 목록에 넣습니다. 아래는 개념을 설명하는 인터페이스 형태이며, Aggregate라는 가상 기반 클래스를 원문이 그대로 선언한 것은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-02-b7"
    },
    {
      "type": "code",
      "chunkName": "<<Aggregate Definition>>=",
      "language": "cpp",
      "code": "// 원문 구조의 핵심: 구체 집합체도 Primitive 태그 목록에 포함됩니다.\n// 외부 코드는 집합체의 내부 자료구조를 알 필요가 없습니다.\nBounds3f bounds = scenePrimitive.Bounds();\nauto hit = scenePrimitive.Intersect(ray, tMax);",
      "explanationKo": "외부 렌더러 루프에서는 이 객체가 단 하나의 구(Sphere)인지, 아니면 내부에 5억 개의 삼각형을 품은 거대한 BVH 트리인지 알 필요가 전혀 없습니다. 그저 최상위 Aggregate.Intersect(ray)를 한 번 호출하기만 하면 됩니다.",
      "provenance": "teaching",
      "id": "ch07-02-b8"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.2.3 가속 구조의 두 거두: 공간 분할 vs 물체 분할",
      "titleEn": "7.2.3 Spatial Partitioning vs Object Partitioning",
      "id": "ch07-02-b9"
    },
    {
      "type": "paragraph",
      "textKo": "3D 컴퓨터 그래픽스 역사상 수많은 가속 알고리즘이 제안되었지만, 오늘날 영화 및 게임 산업의 모든 레이 트레이서는 근본적으로 다음의 두 가지 접근법 중 하나로 귀결됩니다.",
      "textEn": "Ray-tracing acceleration structures fall into two fundamental paradigms: spatial partitioning and object partitioning.",
      "id": "ch07-02-b10"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "공간 분할과 물체 분할",
      "summary": "공간 분할과 물체 분할",
      "points": [
        {
          "title": "핵심 설명",
          "content": "공간 분할은 겹치지 않는 셀을 만들지만 하나의 물체 참조가 여러 셀에 들어갈 수 있습니다. 앞쪽부터 순회하더라도 찾은 교차점이 현재 셀의 구간 안에 있는지 확인해야 뒤쪽을 안전하게 건너뜁니다. 이 절의 물체 분할 BVH는 각 프리미티브를 한 리프에 넣지만 상자끼리는 겹칠 수 있습니다. 공간 분할 BVH 등 다른 변형도 있으므로 모든 구현을 두 극단 중 하나로 고정하지 않습니다."
        }
      ],
      "id": "ch07-02-b11"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.2.4 Kd-Tree 가속 구조 (KdTreeAggregate)",
      "titleEn": "7.2.4 The Kd-Tree Accelerator",
      "id": "ch07-02-b12"
    },
    {
      "type": "paragraph",
      "textKo": "Kd-tree는 축정렬 평면으로 공간을 두 셀로 나눕니다. 분할 축과 위치는 구현의 비용 모델에 따라 선택하며 반드시 x,y,z를 번갈아 선택하는 것은 아닙니다. 원문의 이 절은 개괄이고 상세한 구현은 별도 소스에 있습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-02-b13"
    },
    {
      "type": "paragraph",
      "textKo": "광선이 날아갈 때, 광선 진입점부터 탈출점까지 겹치는 셀들을 앞쪽부터 순서대로 방문하는 **깊이우선 순회 스택(Traversal Stack)**을 유지합니다. 만약 앞쪽 셀에서 이미 유효한 교차점을 찾았다면, 그 교차 거리 $t$보다 뒤쪽에 있는 모든 셀은 방문을 생략하고 즉시 반환할 수 있다는 강력한 조기 종료(Early Termination) 장점을 지닙니다.",
      "textEn": "Kd-tree traversal visits nodes strictly in front-to-back order along the ray, enabling optimal early termination.",
      "id": "ch07-02-b14"
    }
  ],
  "audit": {
    "checkedSourceSha256": "041483f38ca0e8ac72562accd75c9dfcc7e7a1d666bc03f76862c55d9f73410b",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "7.2 Aggregates"
    ],
    "sourceFigures": [],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
