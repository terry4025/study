import { SectionContent } from '../../../../types/book';

export const CH07_03_BVH: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '7',
  chapterTitleKo: '제7장 가속 구조 BVH (Intersection Acceleration)',
  sectionNumber: '7.3',
  sectionTitle: 'Bounding Volume Hierarchies',
  sectionTitleKo: '7.3 BVH(계층적 바운딩 볼륨) 트리 구조와 순회 최적화',
  originalUrl: 'https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html',
  prevSection: {
    id: 'ch07-02',
    title: '7.2 집합체 구조와 공간 분할 가속 기본',
  },
  nextSection: {
    id: 'ch08-01',
    title: '8.1 샘플링 이론과 앨리어싱 (Sampling Theory)',
  },
  summary: {
    keyTakeaways: [
      'BVH(Bounding Volume Hierarchy, 바운딩 볼륨 계층)는 물체들을 계층적인 축정렬 바운딩 박스(AABB) 트리로 감싸는 물체 분할(Object Partitioning) 가속 구조입니다.',
      '각 기하 프리미티브는 트리 전체에서 오직 단 하나의 리프 노드에만 정확히 속하므로, 공간 분할 구조(Kd-트리)처럼 물체 쪼개짐(Primitive Splitting)이나 메모리 폭발 문제가 전혀 발생하지 않습니다.',
      '분할 축은 프리미티브 중심점들의 바운딩 박스(Centroid Bounds) 중 가장 긴 축(Maximum Extent)을 기준으로 선택합니다.',
      'SAH(Surface Area Heuristic, 표면적 휴리스틱)는 기하학적 확률 이론(Crofton 공식)에 기반하여 광선이 바운딩 박스를 관통할 확률이 표면적에 비례함을 이용해 최적의 분할 지점을 계산하는 비용 모델입니다.',
      'HLBVH(계층적 선형 BVH)는 3차원 좌표를 1차원 모턴 코드(Morton Code, Z-순서 곡선)로 변환한 후 $O(N)$ 기수 정렬(Radix Sort)을 적용하여 멀티코어/GPU에서 극초고속으로 트리를 병렬 구축합니다.',
      'LinearBVH는 포인터 추적(Pointer Chasing)으로 인한 캐시 미스를 박멸하기 위해, 트리를 전위 순회(Pre-order) 순서의 1차원 배열로 평탄화하고 노드 크기를 정확히 32바이트로 패킹하여 64바이트 캐시 라인당 2개씩 캐싱되도록 설계되었습니다.',
      '광선 순회(Traversal)는 함수 재귀 호출 오버헤드를 없애기 위해 64개 깊이의 로컬 스택을 사용하며, 광선의 진행 방향 부호에 따라 앞쪽 자식 노드를 먼저 방문하여 탐색을 조기 종료(Early Termination)합니다.'
    ],
    prerequisites: [
      '7장 7.1 Primitive 인터페이스 및 GeometricPrimitive',
      '7장 7.2 선형 탐색의 한계와 집합체(Aggregate) 기본 개념',
      '6장 6.1 축정렬 바운딩 박스(AABB)와 슬랩(Slab) 교차 검사 알고리즘',
      '자료구조: 이진 트리(Binary Tree), 전위 순회(Pre-order Traversal), 기수 정렬(Radix Sort)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.3.1 BVH의 기본 구조와 트리 분할 전략',
      titleEn: '7.3.1 BVH Construction and Partitioning Strategies'
    },
    {
      type: 'paragraph',
      textKo: '바운딩 볼륨 계층(BVH, Bounding Volume Hierarchy)은 컴퓨터 그래픽스와 물리 시뮬레이션에서 3차원 형상 교차 검사를 가속하기 위해 가장 널리 사용되는 트리 기반 가속 구조입니다. BVH는 씬의 모든 프리미티브를 감싸는 하나의 거대한 루트 바운딩 박스에서 시작하여, 프리미티브들의 집합을 두 개의 하위 집합으로 재귀적으로 분할해 나가는 이진 트리(Binary Tree) 형태를 갖습니다.',
      textEn: 'A Bounding Volume Hierarchy (BVH) is an approach for ray intersection acceleration based on geometric primitives bounded by simple shapes. The primitives are partitioned into two disjoint subsets, and their bounding boxes are stored in the child nodes of a binary tree.'
    },
    {
      type: 'figure',
      id: 'fig-07-03',
      number: 'Figure 7.3',
      title: 'Simple scene with a bounding volume hierarchy',
      titleKo: '단순한 구 3개 씬의 계층적 바운딩 볼륨(BVH) 트리 구성',
      src: '/books/pbrt-4ed/images/pha07f03.svg',
      captionKo: '그림 7.3: 3차원 공간상의 구체 3개(A, B, C)를 감싸는 BVH 트리입니다. 루트 노드는 A, B, C 전체를 감싸는 바운딩 박스를 가지며, 왼쪽 자식은 B와 C를 감싸고 오른쪽 자식은 단일 객체 A를 감쌉니다. 광선이 바운딩 박스와 충돌하지 않으면 그 내부의 모든 자식 노드는 즉시 건너뛸 수 있습니다.',
      captionEn: 'Figure 7.3: A simple scene with a bounding volume hierarchy. The root node bounds all three spheres; its left child bounds spheres B and C, while the right child bounds sphere A.'
    },
    {
      type: 'paragraph',
      textKo: 'BVH의 핵심적인 장점은 공간 분할(Spatial Subdivision, 예: 그리드나 Kd-트리)과 달리 물체 분할(Object Partitioning) 방식을 취한다는 점입니다. 공간 분할에서는 커다란 삼각형 하나가 여러 개의 공간 셀에 걸쳐 존재할 수 있어서 트리의 여러 리프 노드에 중복 참조되고, 이로 인해 트리의 노드 수가 기하급수적으로 폭증하거나 광선이 동일한 삼각형과 중복 교차 검사를 수행하는 문제가 발생합니다. 반면 BVH에서는 모든 프리미티브가 정확히 단 하나의 리프 노드에만 속하므로, $N$개의 프리미티브가 주어졌을 때 리프 노드의 개수는 정확히 $N$개, 내부 노드의 개수는 $N-1$개로 트리의 총 노드 수가 $2N-1$개로 엄격하게 상한선이 고정됩니다.',
      textEn: 'Unlike spatial partitioning schemes, each primitive in a BVH appears only once in the hierarchy. This bounds the total number of nodes in a binary BVH to at most 2N - 1 for N primitives, preventing memory explosion.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '중심점 바운딩 박스(Centroid Bounds)와 최장 축 분할',
      titleEn: 'Centroid Bounds and Maximum Extent Axis'
    },
    {
      type: 'paragraph',
      textKo: 'BVH 트리를 구축할 때 각 단계마다 가장 먼저 해야 할 일은 분할 대상이 되는 프리미티브들의 중심점(Centroid)들을 감싸는 바운딩 박스(`centroidBounds`)를 계산하는 것입니다. 프리미티브 자체의 바운딩 박스 전체를 사용하는 대신 중심점들의 범위를 구하는 이유는, 한 물체의 중심점이 분할 평면의 어느 쪽에 위치하는지에 따라 좌우 자식으로 명확하게 배정하기 위함입니다.',
      textEn: 'To build a BVH, the centroid bounding box of all primitives in the current node is first computed. The maximum extent axis of this centroid bounds is then selected as the splitting axis.'
    },
    {
      type: 'figure',
      id: 'fig-07-04',
      number: 'Figure 7.4',
      title: 'Choosing the partition axis based on centroid bounds extent',
      titleKo: '중심점 바운딩 박스의 최장 축을 기준으로 한 분할 축 선택',
      src: '/books/pbrt-4ed/images/pha07f04.svg',
      captionKo: '그림 7.4: 프리미티브들의 중심점(점)들을 감싸는 바운딩 박스(점선)의 $x$축 길이와 $y$축 길이를 비교하여, 더 긴 축(여기서는 $x$축)을 분할 축으로 선정합니다. 이렇게 하면 공간이 가로세로 균형 있게 분할되어 바운딩 박스들의 중첩 면적이 최소화됩니다.',
      captionEn: 'Figure 7.4: Choosing the partition axis based on the extent of the bounding box of primitive centroids. The axis with the maximum extent (here x) is chosen to keep bounding boxes well-proportioned.'
    },
    {
      type: 'code',
      chunkName: '<<BVHBuildNode Definition and Centroid Bounds>>=',
      language: 'cpp',
      code: `struct BVHPrimitiveInfo {
    BVHPrimitiveInfo() = default;
    BVHPrimitiveInfo(size_t primitiveIndex, const Bounds3f &bounds)
        : primitiveIndex(primitiveIndex),
          bounds(bounds),
          centroid(.5f * bounds.pMin + .5f * bounds.pMax) {}

    size_t primitiveIndex;
    Bounds3f bounds;
    Point3f centroid;
};

// 분할 축 선택: 중심점 바운즈의 가장 긴 축
Bounds3f centroidBounds;
for (const auto &pi : primitiveInfo)
    centroidBounds = Union(centroidBounds, pi.centroid);
int dim = centroidBounds.MaxDimension();`,
      explanationKo: 'BVH 빌드 단계에서 각 프리미티브의 원본 인덱스, 3차원 바운즈, 그리고 바운즈의 중심점(Centroid)을 구조체로 관리합니다. 이후 중심점 바운즈의 MaxDimension()을 호출하여 x, y, z 중 가장 폭이 넓은 축을 분할 축(dim)으로 결정합니다.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '고전적 분할 알고리즘 비교: Middle vs EqualCounts',
      titleEn: 'Comparison of Traditional Partitioning: Middle vs EqualCounts'
    },
    {
      type: 'paragraph',
      textKo: '분할 축이 결정되면, 해당 축을 따라 프리미티브들을 두 그룹으로 어떻게 나눌 것인가에 대한 전략이 필요합니다. 고전적으로 널리 쓰이던 두 가지 간단한 방식은 다음과 같습니다:',
      textEn: 'Once the axis is chosen, primitives must be partitioned. Two simple approaches are Middle partitioning (dividing at the spatial midpoint) and EqualCounts partitioning (dividing into equal subsets).'
    },
    {
      type: 'figure',
      id: 'fig-07-05',
      number: 'Figure 7.5',
      title: 'Midpoint partition versus Equal counts partition',
      titleKo: '중간 좌표 분할(Middle)과 동일 개수 분할(EqualCounts)의 비교',
      src: '/books/pbrt-4ed/images/pha07f05.svg',
      captionKo: '그림 7.5: (위) 중간 좌표 분할(Middle)은 중심점 바운즈의 정중앙 평면을 기준으로 나눕니다. 물체들이 한쪽에 쏠려 있으면 트리가 극심하게 불균형해질 수 있습니다. (아래) 동일 개수 분할(EqualCounts)은 개수를 절반($N/2$)씩 정확히 나눕니다. 트리의 깊이는 항상 $\\log_2 N$으로 완벽히 균형을 이루지만, 공간적으로 멀리 떨어진 물체들이 같은 상자에 묶여 빈 공간(Dead Space)이 커지고 상자 간 중첩이 심해집니다.',
      captionEn: 'Figure 7.5: (Top) Middle partitioning splits primitives at the midpoint of the centroid bounds, which can yield highly unbalanced trees. (Bottom) EqualCounts partitions primitives into two equal-sized subsets, ensuring a balanced tree but potentially creating overlapping bounding boxes.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '자료구조의 딜레마: 완전 균형 트리가 항상 최선이 아닌 이유',
      summary: '컴퓨터공학 알고리즘 시험에서는 트리의 좌우 자식 개수가 정확히 같은 완전 균형 이진 트리(Balanced Tree)가 최고라고 배우지만, 광선 추적 가속 구조에서는 정반대입니다!',
      points: [
        {
          title: 'EqualCounts의 함정 (공간 낭비)',
          content: '물체 개수를 50:50으로 정확히 나누면 트리의 깊이는 이상적인 O(log N)이 됩니다. 하지만 왼쪽 끝에 있는 찻잔과 오른쪽 끝에 있는 주전자가 같은 바운딩 박스로 묶이면서 엄청나게 거대한 빈 상자가 생깁니다. 광선은 이 거대한 빈 상자와 불필요하게 계속 충돌하게 됩니다.'
        },
        {
          title: '기하학적 밀집도 보존의 중요성',
          content: '차라리 한쪽 노드에 90개의 찻잔 파편이 옹기종기 모여 있고, 다른 쪽 노드에 10개의 주전자 부품이 모여 있도록 불균형하게 나누더라도, 두 바운딩 박스가 서로 겹치지 않고 팽팽하게 물체를 감싸는 것이 광선 탐색에 수십 배 유리합니다.'
        }
      ],
      tags: ['자료구조', '트리균형', '바운딩볼륨', '공간분할']
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.3.2 표면적 휴리스틱 (SAH: Surface Area Heuristic)',
      titleEn: '7.3.2 The Surface Area Heuristic'
    },
    {
      type: 'paragraph',
      textKo: '단순한 휴리스틱의 한계를 극복하기 위해 제안된 것이 바로 표면적 휴리스틱(SAH, Surface Area Heuristic)입니다. SAH는 순수 기하학적 확률 이론(Geometric Probability Theory)에 기반하여, "어떤 광선이 바운딩 박스를 지나갈 때 하위 노드와 교차할 확률"을 정확한 수식으로 모델링하고 이 비용을 최소화하는 분할 위치를 찾아냅니다.',
      textEn: 'The Surface Area Heuristic (SAH) provides a principled model for tree construction based on geometric probability: the probability that a ray hitting a bounding volume will also hit a sub-volume is proportional to the ratio of their surface areas.'
    },
    {
      type: 'figure',
      id: 'fig-07-06',
      number: 'Figure 7.6',
      title: 'Surface area splitting and ray hitting probability',
      titleKo: '표면적 분할과 광선 충돌 확률의 기하학적 원리',
      src: '/books/pbrt-4ed/images/pha07f06.svg',
      captionKo: '그림 7.6: 부모 볼륨 $A$를 관통하는 임의의 무작위 광선(Random Rays)이 주어졌을 때, 그 광선이 내부의 자식 볼륨 $B$도 함께 관통할 조건부 확률(Conditional Probability)은 크로프톤(Crofton)의 기하 확률 정리에 의해 두 볼륨의 표면적 비율 $S_B / S_A$와 정확히 일치합니다.',
      captionEn: 'Figure 7.6: The probability that a ray passing through convex volume A also passes through an internal convex volume B is given by the ratio of their surface areas, S_B / S_A.'
    },
    {
      type: 'paragraph',
      textKo: '어떤 부모 노드 $N$을 두 개의 자식 노드 $A$와 $B$로 분할한다고 가정해 봅시다. 부모 노드를 관통하는 광선이 $A$와 충돌할 확률은 $P(A) = S_A / S_N$이며, $B$와 충돌할 확률은 $P(B) = S_B / S_N$입니다. 이때 발생하는 예상 비용(Expected Cost)은 다음과 같은 수식으로 정의됩니다:',
      textEn: 'Assuming a parent node N with surface area S_N is partitioned into children A and B, the expected cost of ray traversal through N is given by the cost function:'
    },
    {
      type: 'equation',
      tex: 'C(A, B) = c_t + \\frac{S_A}{S_N} \\sum_{i \\in A} c_i + \\frac{S_B}{S_N} \\sum_{j \\in B} c_j',
      explanationKo: 'SAH 비용 함수: $c_t$는 부모 노드를 방문하여 자식들의 상자 충돌을 검사하는 순회 비용(Traversal Cost)이며, $S_A/S_N$과 $S_B/S_N$은 각 자식 노드에 광선이 충돌할 기하학적 확률입니다. $\\sum c_i$는 해당 자식 노드에 속한 프리미티브들과의 교차 검사 비용입니다.'
    },
    {
      type: 'paragraph',
      textKo: '일반적으로 모든 프리미티브와의 교차 검사 비용이 동일한 상수 $c_{isect}$라고 가정하면, 자식 $A$에 $N_A$개의 물체가 있고 자식 $B$에 $N_B$개의 물체가 있을 때의 비용 함수는 다음과 같이 단순화됩니다:',
      textEn: 'Assuming uniform intersection cost c_isect for all primitives, the cost simplifies to:'
    },
    {
      type: 'equation',
      tex: 'C(A, B) = c_t + \\frac{S_A}{S_N} N_A c_{isect} + \\frac{S_B}{S_N} N_B c_{isect}',
      explanationKo: '단순화된 SAH 비용: 노드 순회 비용 $c_t$에, 자식 $A$와 자식 $B$의 면적 비율 가중치를 곱한 프리미티브 개수 합산입니다. pbrt에서는 기본값으로 $c_t = 1/8$, $c_{isect} = 1$ 비율을 주로 사용합니다.'
    },
    {
      type: 'paragraph',
      textKo: '만약 노드를 더 이상 쪼개지 않고 $N$개의 프리미티브를 가진 리프 노드(Leaf Node)로 그대로 남겨둔다면, 그 리프 노드의 광선 검사 비용은 다음과 같습니다:',
      textEn: 'If the node is not split and left as a leaf containing N primitives, the cost is simply:'
    },
    {
      type: 'equation',
      tex: 'C_{\\text{leaf}} = N \\cdot c_{isect}',
      explanationKo: '리프 노드 비용: 광선이 이 노드에 도달했을 때 내부의 모든 $N$개 프리미티브와 무조건 교차 검사를 수행해야 하므로 총 비용은 $N \\cdot c_{isect}$가 됩니다.'
    },
    {
      type: 'paragraph',
      textKo: '따라서 SAH 빌더는 가능한 모든 분할 위치 중 $\\min C(A, B)$를 찾은 뒤, 이 최솟값이 $C_{\\text{leaf}}$보다 작을 때만 실제로 분할을 수행합니다. 만약 아무리 잘 쪼개도 $C(A, B) \\ge C_{\\text{leaf}}$라면, 알고리즘은 분할을 멈추고 해당 노드를 즉시 리프 노드로 확정합니다(자연스러운 조기 종료 조건).',
      textEn: 'A split is only performed if min C(A, B) < C_leaf; otherwise, recursive subdivision stops and a leaf node is created.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '버킷팅(Bucket Partitioning)을 통한 $O(N)$ 최적 분할 탐색',
      titleEn: 'Bucket Partitioning for O(N) Split Evaluation'
    },
    {
      type: 'paragraph',
      textKo: '엄밀한 SAH를 계산하려면 프리미티브들을 축을 따라 완전히 정렬한 후 $N-1$개의 가능한 모든 분할면을 일일이 검사해야 하므로, 매 단계마다 $O(N \\log N)$의 정렬 비용이 듭니다. 수백만 개의 폴리곤을 가진 씬에서는 빌드 시간이 지나치게 길어집니다. 이를 해결하기 위해 pbrt는 균일한 개수(보통 12개)의 버킷(Buckets)으로 공간을 양자화하는 버킷팅 최적화(Bucket Partitioning)를 사용합니다.',
      textEn: 'Instead of exhaustively sorting all primitives at O(N log N) per node, pbrt partitions the centroid extent into a small number of buckets (e.g., 12) and maps each primitive into a bucket in O(N) time.'
    },
    {
      type: 'figure',
      id: 'fig-07-07',
      number: 'Figure 7.7',
      title: 'Choosing split plane with SAH buckets',
      titleKo: 'SAH 버킷팅을 이용한 최적 분할 평면 탐색 기법',
      src: '/books/pbrt-4ed/images/pha07f07.svg',
      captionKo: '그림 7.7: 프리미티브 중심점 범위를 12개의 균일한 버킷으로 나눕니다. 각 프리미티브를 해당 버킷에 집어넣어 버킷별 바운딩 박스와 개수를 누적한 뒤, 버킷 사이의 11개 경계 평면에 대해 앞뒤 누적 면적($S_A, S_B$)을 스위핑(Sweep)하여 단 $O(B)$ 시간에 SAH 비용이 가장 낮은 최적 평면을 골라냅니다.',
      captionEn: 'Figure 7.7: The bounding box of centroids is divided into buckets (here 12). Primitives are binned, and the SAH cost is evaluated at each bucket boundary using prefix and suffix area sweeps.'
    },
    {
      type: 'code',
      chunkName: '<<Evaluate SAH Cost Using Buckets>>=',
      language: 'cpp',
      code: `constexpr int nBuckets = 12;
struct BVHBucketInfo {
    int count = 0;
    Bounds3f bounds;
};
BVHBucketInfo buckets[nBuckets];

// 1. 각 프리미티브를 해당하는 버킷에 O(N)으로 배치
for (size_t i = 0; i < nPrimitives; ++i) {
    int b = nBuckets * centroidBounds.Offset(prims[i].centroid)[dim];
    if (b == nBuckets) b = nBuckets - 1;
    buckets[b].count++;
    buckets[b].bounds = Union(buckets[b].bounds, prims[i].bounds);
}

// 2. 앞뒤 누적 면적으로 11개 분할면의 SAH 비용 평가
Float cost[nBuckets - 1];
// 전방 누적(Forward Sweep)과 후방 누적(Backward Sweep)으로 O(B)만에 min cost 도출`,
      explanationKo: '프리미티브들의 중심점을 정규화하여 12개의 버킷 중 하나에 인덱싱합니다. 전체 프리미티브를 단 한 번만 순회(O(N))하여 버킷을 채운 후, 11개 경계면에 대한 비용을 전방/후방 누적 면적 계산으로 O(B)에 처리하여 전체 빌드 속도를 수십 배 끌어올립니다.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.3.3 HLBVH: 모턴 코드와 초고속 병렬 빌드',
      titleEn: '7.3.3 Hierarchical Linear Bounding Volume Hierarchies'
    },
    {
      type: 'paragraph',
      textKo: 'SAH 버킷팅이 매우 훌륭하지만, 영화 렌더링에 등장하는 1억 개 이상의 삼각형 메시나 털(Hair), 나뭇잎 등의 복잡한 씬에서는 여전히 수십 초에서 수 분의 빌드 시간이 걸릴 수 있습니다. 특히 GPU나 64코어 이상의 고성능 CPU 환경에서는 트리 구축의 병렬화(Parallelization)가 핵심 과제입니다. 이를 해결하기 위해 pbrt는 모턴 코드(Morton Code)를 활용한 HLBVH(Hierarchical Linear BVH) 알고리즘을 탑재했습니다.',
      textEn: 'For massive scenes with millions of triangles, standard top-down SAH can still be slow to build. Hierarchical Linear Bounding Volume Hierarchies (HLBVH) use Morton codes and radix sort to construct trees in parallel with high efficiency.'
    },
    {
      type: 'figure',
      id: 'fig-07-08',
      number: 'Figure 7.8',
      title: 'Morton space-filling curve order in 2D and 3D',
      titleKo: '2차원 및 3차원 모턴 공간 채움 곡선(Z-Order Curve)',
      src: '/books/pbrt-4ed/images/pha07f08.svg',
      captionKo: '그림 7.8: 2차원 공간에서 모턴 곡선은 알파벳 \'Z\' 모양을 반복하며 공간을 촘촘히 채워나갑니다(Z-order curve). 3차원에서도 마찬가지로 3차원 좌표 $(x, y, z)$의 이진수 비트들을 교대로 끼워 넣어(Bit Interleaving) 1차원 정수로 변환하며, 1차원 정수 상에서 값이 가까운 두 물체는 3차원 공간에서도 매우 가깝다는 공간적 지역성(Spatial Locality)을 완벽하게 유지합니다.',
      captionEn: 'Figure 7.8: The Morton space-filling curve (Z-order curve) maps multi-dimensional coordinates to 1D integers while preserving spatial locality.'
    },
    {
      type: 'paragraph',
      textKo: '모턴 코드는 3차원 상의 정규화된 부동소수점 좌표 $[0, 1]^3$을 각 축당 10비트(총 30비트 정수) 또는 21비트(총 63비트 정수)로 양자화한 뒤, 세 축의 비트를 하나씩 번갈아가며 인터리빙(Bit Interleaving)하여 생성합니다:',
      textEn: 'To compute a Morton code, floating-point coordinates in [0, 1] are quantized to integers, and their bits are interleaved:'
    },
    {
      type: 'equation',
      tex: '\\text{MortonCode}(x, y, z) = \\sum_{i=0}^{9} \\left( x_i \\cdot 2^{3i+2} + y_i \\cdot 2^{3i+1} + z_i \\cdot 2^{3i} \\right)',
      explanationKo: '모턴 코드 비트 인터리빙 수식: $x, y, z$의 $i$번째 비트들이 최종 정수에서 각각 $3i+2, 3i+1, 3i$ 자리에 교대로 배치됩니다. 최상위 비트들은 공간의 가장 거대한 8등분 영역(Octree 분할)을 결정하고, 하위 비트로 갈수록 미세한 하위 영역을 결정합니다.'
    },
    {
      type: 'figure',
      id: 'fig-07-09',
      number: 'Figure 7.9',
      title: 'Morton bit encoding and spatial hierarchy',
      titleKo: '모턴 비트 부호화와 공간적 계층 구조의 대응 관계',
      src: '/books/pbrt-4ed/images/pha07f09.svg',
      captionKo: '그림 7.9: 모턴 코드의 앞자리 비트들(접두사, Prefix)은 상위 옥트리(Octree) 노드에 대응됩니다. 비트가 일치하는 물체들은 동일한 공간 영역에 속하므로, 모턴 코드를 정렬하는 것만으로 공간 전체를 계층적으로 정렬하는 효과를 얻게 됩니다.',
      captionEn: 'Figure 7.9: The prefix bits of a Morton code correspond to spatial octree subdivisions. Sorting Morton codes naturally clusters primitives that are spatially close.'
    },
    {
      type: 'figure',
      id: 'fig-07-10',
      number: 'Figure 7.10',
      title: 'Uniform grid clusters for LBVH treelets',
      titleKo: 'HLBVH의 균일 그리드 클러스터와 하위 트리렛(Treelets) 병렬 구축',
      src: '/books/pbrt-4ed/images/pha07f10.svg',
      captionKo: '그림 7.10: HLBVH는 30비트 모턴 코드의 상위 12비트를 기준으로 씬을 $2^{12} = 4096$개의 균일 클러스터(Treelet)로 분할합니다. 모턴 코드가 정렬되어 있으므로 각 클러스터의 시작과 끝은 이진 탐색으로 즉시 찾아지며, 각 CPU 코어가 4096개의 하위 트리렛을 완벽하게 독립적으로 병렬 구축(SAH 빌드)할 수 있습니다.',
      captionEn: 'Figure 7.10: HLBVH clusters primitives using the high bits of their Morton codes into treelets, which can be constructed concurrently across worker threads.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '기수 정렬(Radix Sort)과 비트 인터리빙의 마법',
      summary: '왜 수천만 개의 물체를 정렬하는데 std::sort 대신 기수 정렬(Radix Sort)을 사용할까요?',
      points: [
        {
          title: '비교 기반 정렬 O(N log N)의 벽 파괴',
          content: 'C++ 표준 라이브러리의 std::sort나 퀵소트는 물체끼리 크기를 비교해야 하므로 아무리 빨라도 O(N log N)입니다. N이 1,000만 개일 때 비교 연산만 수억 번이 발생합니다.'
        },
        {
          title: '30비트 정수 기수 정렬의 경이로운 속도',
          content: '모턴 코드는 30비트 부호없는 정수입니다. 이를 10비트(0~1023)씩 3번에 걸쳐 계수 정렬(Counting Sort)하는 기수 정렬(Radix Sort)을 적용하면 시간 복잡도가 정확히 O(N)으로 떨어집니다. GPU나 멀티스레드 SIMD 명령어로 1초도 안 되는 시간에 수천만 개의 정렬이 완료됩니다.'
        }
      ],
      tags: ['기수정렬', '알고리즘', '모턴코드', '시간복잡도']
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.3.4 순회 가속을 위한 컴팩트 BVH: LinearBVH와 32바이트 노드',
      titleEn: '7.3.4 Compact BVH for Traversal: Linear BVH and 32-Byte Nodes'
    },
    {
      type: 'paragraph',
      textKo: '트리가 성공적으로 구축되었더라도, 전통적인 C++ 방식처럼 포인터(`BVHBuildNode *children[2]`)로 연결된 동적 힙 객체 트리 구조를 그대로 순회하면 심각한 성능 저하가 발생합니다. 힙 메모리 곳곳에 흩어진 노드들을 포인터로 쫓아가는 과정(Pointer Chasing)에서 현대 CPU의 L1/L2/L3 캐시 미스(Cache Miss)가 끝없이 발생하여, CPU 연산 코어는 놀고 메모리 컨트롤러(DRAM)에서 데이터를 기다리느라 렌더링 시간의 80% 이상을 낭비하게 됩니다.',
      textEn: 'Traversing pointer-based tree nodes causes severe cache misses due to pointer chasing. pbrt flattens the tree into a contiguous 1D array using a depth-first layout with fixed 32-byte nodes.'
    },
    {
      type: 'figure',
      id: 'fig-07-11',
      number: 'Figure 7.11',
      title: 'Linear BVH depth-first flat memory layout',
      titleKo: 'Linear BVH의 전위 순회(Depth-First) 기반 1차원 연속 메모리 평탄화',
      src: '/books/pbrt-4ed/images/pha07f11.svg',
      captionKo: '그림 7.11: 트리의 계층 구조를 전위 깊이 우선 순회(Pre-order Depth-First Traversal) 순서로 1차원 연속 배열(`LinearBVHNode[]`)에 직렬화합니다. 이 구조에서 어떤 내부 노드의 바로 첫 번째 자식 노드는 배열의 바로 다음 위치(Index + 1)에 무조건 배치되므로 첫 번째 자식 포인터는 아예 저장할 필요가 없으며, 두 번째 자식의 인덱스 오프셋(`secondChildOffset`) 하나만 보관하면 됩니다.',
      captionEn: 'Figure 7.11: Linear BVH node layout in memory. The first child of an interior node is immediately adjacent in array memory (index + 1), while the offset to the second child is explicitly stored.'
    },
    {
      type: 'code',
      chunkName: '<<LinearBVHNode Representation - Exactly 32 Bytes>>=',
      language: 'cpp',
      code: `struct alignas(32) LinearBVHNode {
    Bounds3f bounds; // 6 floats (xMin, xMax, yMin, yMax, zMin, zMax) = 24 bytes
    union {
        int primitivesOffset;   // 리프 노드: 프리미티브 배열의 시작 인덱스 (4 bytes)
        int secondChildOffset;  // 내부 노드: 두 번째 자식 노드의 배열 오프셋 (4 bytes)
    };
    uint16_t nPrimitives;       // 리프 노드: 프리미티브 개수 (0이면 내부 노드) (2 bytes)
    uint8_t axis;               // 내부 노드: 분할 축 (0=x, 1=y, 2=z) (1 byte)
    uint8_t pad[1];             // 32바이트 정렬을 위한 패딩 (1 byte)
};
// 24 + 4 + 2 + 1 + 1 = 정확히 32 Bytes!`,
      explanationKo: 'LinearBVHNode 구조체의 바이트 단위 패킹 설계입니다. AABB 바운즈가 24바이트를 차지하고, 공용체(Union)와 메타데이터가 8바이트를 차지하여 정확히 32바이트가 됩니다. 현대 x86/ARM CPU의 캐시 라인 크기(64 Bytes)에 정확히 2개의 노드가 완벽하게 정렬되어 들어가므로 캐시 미스를 극한으로 줄입니다.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '하드웨어 아키텍처와 32바이트 정렬(Cache Line Optimization)',
      summary: '소프트웨어 알고리즘의 시간 복잡도가 같아도, 캐시 라인 정렬 여부에 따라 실제 하드웨어 실행 속도는 3~5배 이상 차이가 납니다!',
      points: [
        {
          title: '64바이트 캐시 라인(Cache Line)이란?',
          content: 'CPU는 메모리(RAM)에서 데이터를 읽어올 때 바이트 단위로 가져오지 않고, 항상 64바이트 덩어리(Cache Line) 단위로 L1 캐시에 적재합니다. 만약 구조체 크기가 36바이트나 40바이트처럼 애매하면 하나의 노드가 두 개의 캐시 라인 경계에 걸쳐버려 메모리 접근이 2배로 늘어납니다.'
        },
        {
          title: 'alignas(32)와 공용체(Union)의 미학',
          content: 'LinearBVHNode는 정확히 32바이트로 설계되어, 한 번의 64바이트 캐시 라인 로드로 부모 노드와 바로 인접한 첫 번째 자식 노드가 동시에 캐시에 들어옵니다! 또한 내부 노드에는 프리미티브가 없고 리프 노드에는 자식이 없다는 점을 활용해 union으로 메모리를 공유하여 낭비를 제로화했습니다.'
        }
      ],
      tags: ['컴퓨터구조', 'CPU캐시', '메모리정렬', '캐시라인', '최적화']
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.3.5 스택 기반 비재귀 광선 순회(Traversal) 알고리즘',
      titleEn: '7.3.5 Non-recursive Stack-based Traversal Algorithm'
    },
    {
      type: 'paragraph',
      textKo: '선형 BVH 배열이 완성되면, 광선과 씬의 충돌 검사는 비재귀적(Non-recursive) 반복문으로 수행됩니다. 재귀 함수 호출(Recursive Call)은 함수 호출 프레임 푸시/팝 오버헤드와 스택 오버플로우 위험이 있으므로, 크기가 64인 고정 크기 로컬 스택(`int nodesToVisit[64]`)을 함수 내부에 선언하여 순회를 제어합니다. BVH 트리의 최대 깊이는 64를 넘지 않으므로 동적 메모리 할당 없이 초고속으로 동작합니다.',
      textEn: 'Ray traversal in the Linear BVH is implemented iteratively using a fixed-size local stack of 64 node offsets, completely eliminating the overhead of recursive function calls.'
    },
    {
      type: 'paragraph',
      textKo: '순회 시 가장 중요한 최적화는 광선의 진행 방향에 따른 자식 방문 순서 결정(Directional Traversal Order)입니다. 광선 방향 벡터의 해당 분할 축 성분이 음수(`dirIsNeg[axis]`)라면, 공간적으로 뒤쪽에 있는 자식을 스택에 먼저 넣고(나중에 방문), 앞쪽에 있는 자식을 먼저 검사합니다. 이렇게 하면 광선과 가까운 물체부터 먼저 검사하게 되므로, 조기에 가장 가까운 교차점($t_{\\max}$)이 확정되어 뒤쪽에 있는 수많은 바운딩 박스들을 교차 검사 없이 통째로 스킵할 수 있습니다.',
      textEn: 'Based on whether the ray direction is negative along the split axis, the closer child is traversed first, allowing early termination and shrinking tMax to prune far away nodes.'
    },
    {
      type: 'code',
      chunkName: '<<BVHAggregate::Intersect Traversal Loop>>=',
      language: 'cpp',
      code: `bool BVHAggregate::Intersect(const Ray &ray, SurfaceInteraction *isect) const {
    if (!nodes) return false;
    Vector3f invDir(1 / ray.d.x, 1 / ray.d.y, 1 / ray.d.z);
    int dirIsNeg[3] = {invDir.x < 0, invDir.y < 0, invDir.z < 0};
    
    int toVisitOffset = 0, currentNodeIndex = 0;
    int nodesToVisit[64];

    while (true) {
        const LinearBVHNode *node = &nodes[currentNodeIndex];
        // 1. 슬랩 알고리즘으로 AABB 교차 검사
        if (node->bounds.IntersectP(ray, invDir, dirIsNeg)) {
            if (node->nPrimitives > 0) {
                // 리프 노드: 내부의 프리미티브들과 교차 검사
                for (int i = 0; i < node->nPrimitives; ++i)
                    primitives[node->primitivesOffset + i]->Intersect(ray, isect);
                if (toVisitOffset == 0) break;
                currentNodeIndex = nodesToVisit[--toVisitOffset];
            } else {
                // 내부 노드: 광선 방향에 따라 가까운 자식을 먼저 순회
                if (dirIsNeg[node->axis]) {
                    nodesToVisit[toVisitOffset++] = currentNodeIndex + 1;
                    currentNodeIndex = node->secondChildOffset;
                } else {
                    nodesToVisit[toVisitOffset++] = node->secondChildOffset;
                    currentNodeIndex = currentNodeIndex + 1;
                }
            }
        } else {
            if (toVisitOffset == 0) break;
            currentNodeIndex = nodesToVisit[--toVisitOffset];
        }
    }
    return isect->hit;
}`,
      explanationKo: '고정 크기 로컬 스택(nodesToVisit)을 사용하는 비재귀 BVH 순회 루프입니다. 광선의 역방향 벡터(invDir)와 사전 계산된 부호(dirIsNeg)를 활용해 AABB 상자 교차를 초고속으로 판정하고, 더 가까운 자식을 현재 노드로 유지하면서 먼 자식만 스택에 푸시합니다.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '7.3.6 성능 분석 및 프로덕션 씬 실전 사례',
      titleEn: '7.3.6 Performance Analysis and Real-world Production Scenes'
    },
    {
      type: 'paragraph',
      textKo: '실제 영화 및 게임 프로덕션 환경에서 BVH의 품질과 성능은 어떻게 측정될까요? pbrt 연구팀은 복잡한 조명과 복잡한 기하학 구조를 가진 다양한 실전 씬에서 BVH 노드 방문 횟수와 교차 검사 횟수를 정밀 측정했습니다.',
      textEn: 'The effectiveness of BVH acceleration can be visualized through node visit heatmaps and evaluated on complex production scenes.'
    },
    {
      type: 'figure',
      id: 'fig-07-12',
      number: 'Figure 7.12',
      title: 'Kroken scene node visit heatmap and traversal cost',
      titleKo: '크로켄(Kroken) 씬의 BVH 노드 방문 횟수 히트맵 시각화',
      src: '/books/pbrt-4ed/images/pha07f12.svg',
      captionKo: '그림 7.12: 노르웨이 해안 지형을 묘사한 크로켄(Kroken) 씬에서 픽셀당 광선이 방문한 BVH 노드의 개수를 히트맵으로 시각화한 결과입니다. 물체의 윤곽선이나 깊이가 복잡한 영역일수록 탐색 비용이 높아지지만, SAH 최적화를 통해 대부분의 영역에서 로그 시간 $O(\\log N)$ 이하의 안정적인 방문 횟수를 유지합니다.',
      captionEn: 'Figure 7.12: Heatmap showing the number of BVH node visits per pixel in the Kroken scene. SAH-optimized trees maintain low average traversal depths across complex geometric silhouettes.'
    },
    {
      type: 'figure',
      id: 'fig-07-13',
      number: 'Figure 7.13',
      title: 'Moana Island scene BVH performance and scale breakdown',
      titleKo: '디즈니 모아나 아일랜드(Moana Island) 씬의 극한 규모 BVH 성능',
      src: '/books/pbrt-4ed/images/pha07f13.svg',
      captionKo: '그림 7.13: 월트 디즈니 애니메이션 스튜디오가 오픈소스로 공개한 모아나 아일랜드(Moana Island) 씬입니다. 수억 개의 나뭇잎, 모래 알갱이, 복잡한 인스턴싱이 포함된 극한의 기하 복잡도 속에서도, 계층적 선형 BVH(HLBVH)와 2단계 인스턴싱 BVH를 결합하여 수십 기가바이트의 메모리 한도 내에서 실시간에 준하는 고성능 패스 트레이싱을 가능하게 만듭니다.',
      captionEn: 'Figure 7.13: The Disney Moana Island scene showcases the extreme scalability of BVH architectures. Using HLBVH and two-level instance hierarchies, billions of instanced primitives are rendered efficiently within memory budgets.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '분할 알고리즘별 종합 성능 벤치마크 요약',
      titleEn: 'Summary Benchmark Comparison of Partitioning Methods'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt에 구현된 네 가지 BVH 분할 알고리즘의 빌드 시간, 렌더링 시간, 메모리 사용량의 트레이드오프는 다음과 같이 정리할 수 있습니다:',
      textEn: 'The trade-offs among the four BVH construction algorithms in pbrt are summarized below:'
    },
    {
      type: 'concept-tip',
      badge: '📊 알고리즘 종합 비교',
      title: 'BVH 빌드 알고리즘 4종 총정리',
      summary: '상황과 워크플로우에 따라 가장 적합한 BVH 빌드 방식을 선택해야 합니다.',
      points: [
        {
          title: 'SAH (Surface Area Heuristic, 표면적 휴리스틱)',
          content: '가장 이상적인 렌더링 성능을 제공합니다. 렌더링 시간이 긴 최종 프로덕션 렌더링(Final Frame)에 무조건 권장됩니다. 빌드 시간이 다소 걸리지만 렌더링 시 광선 순회 속도가 가장 빠릅니다.'
        },
        {
          title: 'HLBVH (Hierarchical Linear BVH, 계층적 선형 BVH)',
          content: '모턴 코드와 기수 정렬을 사용해 CPU 멀티코어로 병렬 구축합니다. 빌드 속도가 SAH보다 최대 5~10배 빠르며, 인터랙티브 뷰포트 렌더링이나 복잡한 동적 씬(Dynamic Scenes)에 적합합니다.'
        },
        {
          title: 'Middle (중간 좌표 분할)',
          content: '가장 단순한 분할 방식입니다. 구현이 쉽고 빌드가 빠르지만, 트리가 한쪽으로 치우쳐 렌더링 속도가 현저히 떨어질 수 있습니다.'
        },
        {
          title: 'EqualCounts (동일 개수 분할)',
          content: '항상 완전 이진 트리를 보장하지만 공간적 겹침이 심합니다. 기하학적 분포가 매우 균일한 특수 씬 외에는 실전에서 거의 쓰이지 않습니다.'
        }
      ],
      tags: ['BVH', 'SAH', 'HLBVH', '벤치마크', '성능최적화']
    }
  ]
};
