import { SectionContent } from '../../../../types/book';

export const CH07_02_AGGREGATES: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '7',
  chapterTitleKo: '제7장 가속 구조 BVH (Intersection Acceleration)',
  sectionNumber: '7.2',
  sectionTitle: 'Aggregates',
  sectionTitleKo: '7.2 집합체 구조와 공간 분할 가속 기본',
  originalUrl: 'https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Aggregates.html',
  prevSection: {
    id: 'ch07-01',
    title: '7.1 기본 프리미티브 인터페이스와 기하 프리미티브',
  },
  nextSection: {
    id: 'ch07-03',
    title: '7.3 BVH(계층적 바운딩 볼륨) 트리 구조',
  },
  summary: {
    keyTakeaways: [
      'Aggregate는 수천만 개의 Primitive들을 내부에 품고 있으면서, 외부 렌더러에게는 마치 단 하나의 Primitive인 것처럼 동작하는 컴포짓(Composite) 패턴의 컨테이너입니다.',
      '선형 전수 탐색(Brute-Force)의 악몽: 광선 하나를 쏠 때마다 씬의 모든 N개 삼각형과 충돌 검사를 하면 O(N)의 시간 복잡도가 발생하여, 수천만 폴리곤 씬의 렌더링에 수십 년이 소요됩니다.',
      '가속 구조(Acceleration Structures)는 이 탐색 비용을 O(log N)으로 비약적으로 단축시켜, 1억 개의 삼각형 속에서도 단 20~30번의 상자 검사만으로 가장 가까운 교차점을 찾아냅니다.',
      '공간 분할(Spatial Partitioning, 예: Kd-트리)은 3차원 공간을 겹치지 않는 셀로 분할하며 물체가 여러 방에 중복 속할 수 있는 반면, 물체 분할(Object Partitioning, 예: BVH)은 물체들을 묶어 상자로 감싸므로 상자끼리는 겹치지만 물체 중복이 없습니다.',
      'Kd-Tree(k-d 트리)는 축정렬 평면으로 공간을 적응형 재귀 분할하는 대표적인 공간 분할 가속 구조로, 앞쪽 공간부터 뒤쪽 공간으로 엄밀한 순차적 광선 순회(Ray Traversal)가 가능합니다.'
    ],
    prerequisites: [
      '7장 7.1 기본 프리미티브 인터페이스 (Primitive, GeometricPrimitive)',
      '6장 6.1 슬랩(Slab) AABB 상자 교차 검사 기법',
      '컴퓨터공학 자료구조: 이진 탐색 트리(BST)와 시간 복잡도 O(log N)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.2.1 $O(N)$ 선형 탐색의 파멸과 가속 구조의 절대적 필요성',
      titleEn: '7.2.1 The Need for Acceleration Structures'
    },
    {
      type: 'paragraph',
      textKo: '물리 기반 렌더러가 화면을 렌더링할 때 발사하는 광선의 수는 상상을 초월합니다. $4\\text{K}$ 해상도($3840 \\times 2160 \\approx 8.3 \\times 10^6$ 픽셀)에서 노이즈를 없애기 위해 픽셀당 1,024개의 샘플 광선을 쏘고, 각 광선이 반사·굴절되어 5번 튕긴다면 씬에 발사되는 총 광선의 수는 **약 400억 개($4 \\times 10^{10}$)**에 달합니다.',
      textEn: 'A physically based renderer traces billions of rays for high-resolution images. For a 4K image with 1024 samples per pixel and multiple bounces, tens of billions of rays are evaluated.'
    },
    {
      type: 'paragraph',
      textKo: '만약 씬에 1,000만 개($10^7$)의 삼각형이 존재할 때 아무런 가속 구조 없이 단순히 모든 삼각형을 루프로 돌며 검사하는 **선형 탐색(Linear Search, $O(N)$)**을 사용한다면 어떻게 될까요?',
      textEn: 'If a scene containing 10 million triangles were tested naively against every ray using linear search, the computational cost would be catastrophic.'
    },
    {
      type: 'equation',
      tex: '\\text{총 교차 검사 횟수} = 4 \\times 10^{10} \\text{ (광선 수)} \\times 10^7 \\text{ (삼각형 수)} = 4 \\times 10^{17} \\text{ 회}',
      explanationKo: '초당 10억(10^9) 번의 삼각형 교차 검사를 처리하는 슈퍼컴퓨터를 동원해도 4억 초, 즉 무려 12.6년 동안 컴퓨터를 켜놓아야 단 한 장의 사진이 완성됩니다!'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '사전에서 단어 찾기: $O(N)$ 전수 조사 vs $O(\\log N)$ 이진 탐색',
      summary: '사전 1페이지부터 끝까지 다 넘겨보는 멍청한 방법 대신, 가운데를 딱 펼쳐서 절반씩 날려버리는 이진 탐색의 마법',
      points: [
        {
          title: '선형 탐색 $O(N)$의 비극',
          content: '10만 단어가 든 영어 사전에서 단어 하나를 찾기 위해 첫 단어 `a`부터 `zoo`까지 10만 개를 한 장씩 넘겨보는 것과 같습니다. 단어가 1,000만 개로 늘어나면 찾는 시간도 100배로 정직하게 늘어납니다.'
        },
        {
          title: '계층적 트리 탐색 $O(\\log N)$의 기적',
          content: '공간을 상자 속의 상자로 반씩 쪼개어 놓으면, 광선이 큰 상자를 빗맞는 순간 그 안에 든 수백만 개의 삼각형을 단 한 번의 연산으로 통째로 쓰레기통에 버릴 수 있습니다! $1,000만$개의 삼각형도 $\\log_2(10^7) \\approx 24$번의 상자 비교만으로 목표 삼각형을 낚아챕니다.'
        }
      ]
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.2.2 Aggregate 인터페이스와 컴포짓 패턴',
      titleEn: '7.2.2 The Aggregate Interface'
    },
    {
      type: 'paragraph',
      textKo: '`Aggregate`는 수많은 자식 `Primitive`들을 보관하면서 스스로도 `Primitive` 인터페이스를 상속받는 **컴포짓 디자인 패턴(Composite Pattern)**으로 설계되었습니다.',
      textEn: 'The Aggregate class is an abstract base class for primitives that contain other primitives, implementing the composite pattern.'
    },
    {
      type: 'code',
      chunkName: '<<Aggregate Definition>>=',
      language: 'cpp',
      code: `class Aggregate : public Primitive {
  public:
    // 내부에 저장된 자식 프리미티브들의 전체 목록 반환
    virtual pstd::span<const Primitive *const> Primitives() const = 0;
};`,
      explanationKo: '외부 렌더러 루프에서는 이 객체가 단 하나의 구(Sphere)인지, 아니면 내부에 5억 개의 삼각형을 품은 거대한 BVH 트리인지 알 필요가 전혀 없습니다. 그저 최상위 Aggregate.Intersect(ray)를 한 번 호출하기만 하면 됩니다.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.2.3 가속 구조의 두 거두: 공간 분할 vs 물체 분할',
      titleEn: '7.2.3 Spatial Partitioning vs Object Partitioning'
    },
    {
      type: 'paragraph',
      textKo: '3D 컴퓨터 그래픽스 역사상 수많은 가속 알고리즘이 제안되었지만, 오늘날 영화 및 게임 산업의 모든 레이 트레이서는 근본적으로 다음의 두 가지 접근법 중 하나로 귀결됩니다.',
      textEn: 'Ray-tracing acceleration structures fall into two fundamental paradigms: spatial partitioning and object partitioning.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '공간 분할(Spatial Partitioning) vs 물체 분할(Object Partitioning) 전격 비교',
      summary: '건물을 겹치지 않는 격자 방으로 쪼갤 것인가(Kd-Tree), 아니면 가구들을 상자에 담아 포장할 것인가(BVH)?',
      points: [
        {
          title: '공간 분할 (Kd-Tree, Grid, Octree)',
          content: '3차원 공간 자체를 경계면으로 싹둑 자릅니다. 방과 방 사이는 절대 겹치지 않습니다. 따라서 광선이 출발할 때 가장 가까운 방부터 순서대로 방문할 수 있어, 첫 번째 방에서 충돌이 일어나면 즉시 탐색을 끝낼 수 있습니다. 하지만 방 경계선에 걸친 긴 물체(예: 긴 막대기, 대각선 삼각형)는 여러 방에 중복 저장되어 메모리가 폭발할 위험이 있습니다.'
        },
        {
          title: '물체 분할 (BVH - Bounding Volume Hierarchy)',
          content: '물체들을 그룹으로 묶어 상자(AABB)로 감쌉니다. 모든 삼각형은 오직 단 하나의 상자(Leaf)에만 들어가므로 메모리 사용량이 완벽하게 예측 가능합니다. 하지만 인접한 두 상자가 공간적으로 서로 겹칠 수 있어, 광선이 두 상자 모두를 통과해야 할 수도 있습니다. 오늘날 하드웨어 레이 트레이싱(RTX, Metal Ray Tracing)은 100% BVH 방식을 표준으로 채택하고 있습니다.'
        }
      ]
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.2.4 Kd-Tree 가속 구조 (KdTreeAggregate)',
      titleEn: '7.2.4 The Kd-Tree Accelerator'
    },
    {
      type: 'paragraph',
      textKo: '`KdTreeAggregate`는 3차원 공간을 $X, Y, Z$ 축에 수직인 평면으로 번갈아 자르면서 공간을 재귀적으로 2분할하는 이진 트리입니다. 물체의 분포 밀도가 높은 곳은 잘게 쪼개고, 텅 빈 허공은 커다란 하나의 방으로 남겨두는 **적응형 공간 분할(Adaptive Spatial Partitioning)**을 수행합니다.',
      textEn: 'The kd-tree accelerator recursively splits spatial regions along axis-aligned planes, adapting cell sizes to primitive density.'
    },
    {
      type: 'paragraph',
      textKo: '광선이 날아갈 때, 광선 진입점부터 탈출점까지 겹치는 셀들을 앞쪽부터 순서대로 방문하는 **깊이우선 순회 스택(Traversal Stack)**을 유지합니다. 만약 앞쪽 셀에서 이미 유효한 교차점을 찾았다면, 그 교차 거리 $t$보다 뒤쪽에 있는 모든 셀은 방문을 생략하고 즉시 반환할 수 있다는 강력한 조기 종료(Early Termination) 장점을 지닙니다.',
      textEn: 'Kd-tree traversal visits nodes strictly in front-to-back order along the ray, enabling optimal early termination.'
    }
  ]
};
