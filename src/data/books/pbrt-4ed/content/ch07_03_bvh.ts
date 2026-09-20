import type { SectionContent } from '../../../../types/book';

export const CH07_03_BVH: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "7",
  "chapterTitleKo": "제7장 가속 구조 BVH (Intersection Acceleration)",
  "sectionNumber": "7.3",
  "sectionTitle": "Bounding Volume Hierarchies",
  "sectionTitleKo": "7.3 BVH(계층적 바운딩 볼륨) 트리 구조와 순회 최적화",
  "originalUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
  "prevSection": {
    "id": "ch07-02",
    "title": "7.2 집합체 구조와 공간 분할 가속 기본"
  },
  "nextSection": {
    "id": "ch08-01",
    "title": "8.1 샘플링 이론과 앨리어싱 (Sampling Theory)"
  },
  "summary": {
    "keyTakeaways": [
      "BVH(Bounding Volume Hierarchy, 바운딩 볼륨 계층)는 물체들을 계층적인 축정렬 바운딩 박스(AABB) 트리로 감싸는 물체 분할(Object Partitioning) 가속 구조입니다.",
      "이 절의 물체 분할 BVH에서는 한 프리미티브를 여러 리프에 중복 배정하지 않아 노드 수의 상한을 구하기 쉽습니다. 모든 BVH 변형이 이 규칙을 따르거나, 큰 장면에서 메모리 문제가 전혀 없다는 뜻은 아닙니다.",
      "분할 축은 프리미티브 중심점들의 바운딩 박스(Centroid Bounds) 중 가장 긴 축(Maximum Extent)을 기준으로 선택합니다.",
      "SAH(Surface Area Heuristic, 표면적 휴리스틱)는 광선 분포에 대한 단순화된 가정 아래 상자의 표면적 비율로 방문 확률을 근사하고, 후보 분할의 예상 검사 비용을 비교하는 모델입니다. 선택한 후보 중 비용이 낮은 분할을 찾는 것이며 모든 실제 광선에 대한 전역 최적해를 보장하지 않습니다.",
      "HLBVH(계층적 선형 BVH)는 3차원 좌표를 1차원 모턴 코드(Morton Code, Z-순서 곡선)로 변환한 후 $O(N)$ 기수 정렬(Radix Sort)을 적용하여 멀티코어/GPU에서 극초고속으로 트리를 병렬 구축합니다.",
      "LinearBVH는 포인터 추적(Pointer Chasing)을 줄이고 캐시 지역성을 개선하기 위해, 트리를 전위 순회(Pre-order) 순서의 1차원 배열로 평탄화하고 노드 크기를 정확히 32바이트로 패킹하여 64바이트 캐시 라인당 2개씩 캐싱되도록 설계되었습니다.",
      "광선 순회는 재귀 대신 배열 스택으로 다음에 방문할 노드를 기억합니다. 가까울 것으로 예상되는 자식을 먼저 검사하면, 가장 가까운 교차점을 찾을 때 거리 상한을 줄여 뒤쪽 후보를 제외할 수 있습니다. 다만 첫 교차점에서 항상 종료하지는 않습니다. 가려짐 여부만 묻는 검사는 한 번의 유효한 교차로 종료할 수 있습니다."
    ],
    "prerequisites": [
      "7장 7.1 Primitive 인터페이스 및 GeometricPrimitive",
      "7장 7.2 선형 탐색의 한계와 집합체(Aggregate) 기본 개념",
      "3장 3.7 바운딩 박스(AABB)의 정의와 6장 형상 교차 검사의 기초",
      "자료구조: 이진 트리(Binary Tree), 전위 순회(Pre-order Traversal), 기수 정렬(Radix Sort)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.3.1 BVH의 기본 구조와 트리 분할 전략",
      "titleEn": "7.3.1 BVH Construction and Partitioning Strategies",
      "id": "ch07-03-b1"
    },
    {
      "type": "paragraph",
      "textKo": "바운딩 볼륨 계층(BVH, Bounding Volume Hierarchy)은 컴퓨터 그래픽스와 물리 시뮬레이션에서 3차원 형상 교차 검사를 가속하기 위해 가장 널리 사용되는 트리 기반 가속 구조입니다. BVH는 씬의 모든 프리미티브를 감싸는 하나의 거대한 루트 바운딩 박스에서 시작하여, 프리미티브들의 집합을 두 개의 하위 집합으로 재귀적으로 분할해 나가는 이진 트리(Binary Tree) 형태를 갖습니다.",
      "textEn": "A Bounding Volume Hierarchy (BVH) is an approach for ray intersection acceleration based on geometric primitives bounded by simple shapes. The primitives are partitioned into two disjoint subsets, and their bounding boxes are stored in the child nodes of a binary tree.",
      "id": "ch07-03-b2"
    },
    {
      "type": "figure",
      "id": "fig-07-03",
      "number": "Figure 7.3",
      "title": "Original Figure 7.3",
      "titleKo": "원문 그림 7.3",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-3.png",
      "captionKo": "그림 7.3 · 구와 정삼각형을 가까운 한 그룹으로 묶고 가느다란 삼각형은 다른 그룹으로 둔 BVH입니다. 부모 바운딩 박스는 자식의 모든 프리미티브를 감쌉니다. 기존 노트의 ‘구 세 개’ 설명은 이 그림과 맞지 않습니다.",
      "captionEn": "Figure 7.3: Bounding Volume Hierarchy for a Simple Scene. (a) A small collection of primitives, with bounding boxes shown by dashed lines. The primitives are aggregated based on proximity; here, the sphere and the equilateral triangle are bounded by another bounding box before being bounded by a bounding box that encompasses the entire scene (both shown in solid lines). (b) The corresponding bounding volume hierarchy. The root node holds the bounds of the entire scene. Here, it has two children, one storing a bounding box that encompasses the sphere and equilateral triangle (that in turn has those primitives as its children) and the other storing the bounding box that holds the skinny triangle.",
      "width": 998,
      "height": 264,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "BVH의 핵심적인 장점은 공간 분할(Spatial Subdivision, 예: 그리드나 Kd-트리)과 달리 물체 분할(Object Partitioning) 방식을 취한다는 점입니다. 공간 분할에서는 커다란 삼각형 하나가 여러 개의 공간 셀에 걸쳐 존재할 수 있어서 트리의 여러 리프 노드에 중복 참조되고, 이로 인해 트리의 노드 수가 기하급수적으로 폭증하거나 광선이 동일한 삼각형과 중복 교차 검사를 수행하는 문제가 발생합니다. 여기서 다루는 물체 분할 이진 BVH에서는 각 프리미티브를 한 리프에 배정합니다. 리프가 $L$개이고 내부 노드마다 자식이 둘이면 전체 노드는 $2L-1$개입니다. 비어 있지 않은 리프에 여러 프리미티브를 담을 수 있으므로 $L$은 $N$ 이하이며, 전체 노드는 최대 $2N-1$개입니다. 예를 들어 프리미티브 4개를 두 개씩 두 리프에 넣으면 루트까지 총 3개 노드입니다.",
      "textEn": "Unlike spatial partitioning schemes, each primitive in a BVH appears only once in the hierarchy. This bounds the total number of nodes in a binary BVH to at most 2N - 1 for N primitives, preventing memory explosion.",
      "id": "ch07-03-b4"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "중심점 바운딩 박스(Centroid Bounds)와 최장 축 분할",
      "titleEn": "Centroid Bounds and Maximum Extent Axis",
      "id": "ch07-03-b5"
    },
    {
      "type": "paragraph",
      "textKo": "BVH 트리를 구축할 때 각 단계마다 가장 먼저 해야 할 일은 분할 대상이 되는 프리미티브들의 중심점(Centroid)들을 감싸는 바운딩 박스(`centroidBounds`)를 계산하는 것입니다. 프리미티브 자체의 바운딩 박스 전체를 사용하는 대신 중심점들의 범위를 구하는 이유는, 한 물체의 중심점이 분할 평면의 어느 쪽에 위치하는지에 따라 좌우 자식으로 명확하게 배정하기 위함입니다.",
      "textEn": "To build a BVH, the centroid bounding box of all primitives in the current node is first computed. The maximum extent axis of this centroid bounds is then selected as the splitting axis.",
      "id": "ch07-03-b6"
    },
    {
      "type": "figure",
      "id": "fig-07-04",
      "number": "Figure 7.4",
      "title": "Original Figure 7.4",
      "titleKo": "원문 그림 7.4",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-4.png",
      "captionKo": "그림 7.4 · 바운딩 박스 중심점들의 범위가 가장 긴 축을 선택합니다. 원문의 이 2차원 예에서는 x가 아니라 y축의 범위가 가장 큽니다.",
      "captionEn": "Figure 7.4: Choosing the Axis along which to Partition Primitives. The BVHAggregate chooses an axis along which to partition the primitives based on which axis has the largest range of the centroids of the primitives’ bounding boxes. Here, in two dimensions, their extent is largest along the y axis (filled points on the axes), so the primitives will be partitioned in y .",
      "width": 998,
      "height": 409,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "chunkName": "<<BVHBuildNode Definition and Centroid Bounds>>=",
      "language": "cpp",
      "code": "struct BVHPrimitiveInfo {\n    BVHPrimitiveInfo() = default;\n    BVHPrimitiveInfo(size_t primitiveIndex, const Bounds3f &bounds)\n        : primitiveIndex(primitiveIndex),\n          bounds(bounds),\n          centroid(.5f * bounds.pMin + .5f * bounds.pMax) {}\n\n    size_t primitiveIndex;\n    Bounds3f bounds;\n    Point3f centroid;\n};\n\n// 분할 축 선택: 중심점 바운즈의 가장 긴 축\nBounds3f centroidBounds;\nfor (const auto &pi : primitiveInfo)\n    centroidBounds = Union(centroidBounds, pi.centroid);\nint dim = centroidBounds.MaxDimension();",
      "explanationKo": "BVH 빌드 단계에서 각 프리미티브의 원본 인덱스, 3차원 바운즈, 그리고 바운즈의 중심점(Centroid)을 구조체로 관리합니다. 이후 중심점 바운즈의 MaxDimension()을 호출하여 x, y, z 중 가장 폭이 넓은 축을 분할 축(dim)으로 결정합니다.",
      "provenance": "teaching",
      "id": "ch07-03-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "고전적 분할 알고리즘 비교: Middle vs EqualCounts",
      "titleEn": "Comparison of Traditional Partitioning: Middle vs EqualCounts",
      "id": "ch07-03-b9"
    },
    {
      "type": "paragraph",
      "textKo": "분할 축이 결정되면, 해당 축을 따라 프리미티브들을 두 그룹으로 어떻게 나눌 것인가에 대한 전략이 필요합니다. 고전적으로 널리 쓰이던 두 가지 간단한 방식은 다음과 같습니다:",
      "textEn": "Once the axis is chosen, primitives must be partitioned. Two simple approaches are Middle partitioning (dividing at the spatial midpoint) and EqualCounts partitioning (dividing into equal subsets).",
      "id": "ch07-03-b10"
    },
    {
      "type": "figure",
      "id": "fig-07-05",
      "number": "Figure 7.5",
      "title": "Original Figure 7.5",
      "titleKo": "원문 그림 7.5",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-5.png",
      "captionKo": "그림 7.5 · 중심점 범위의 중간에서 나누는 방법이 잘 맞는 분포와, 큰 중첩을 만드는 분포를 비교합니다. 다른 분할 위치를 고르면 더 작고 겹치지 않는 자식 박스를 얻을 수 있습니다.",
      "captionEn": "Figure 7.5: Splitting Primitives Based on the Midpoint of Centroids on an Axis. (a) For some distributions of primitives, such as the one shown here, splitting based on the midpoint of the centroids along the chosen axis (thick vertical line) works well. (The bounding boxes of the two resulting primitive groups are shown with dashed lines.) (b) For distributions like this one, the midpoint is a suboptimal choice; the two resulting bounding boxes overlap substantially. (c) If the same group of primitives from (b) is instead split along the line shown here, the resulting bounding boxes are smaller and do not overlap at all, leading to better performance when rendering.",
      "width": 998,
      "height": 891,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "자료구조의 딜레마: 완전 균형 트리가 항상 최선이 아닌 이유",
      "summary": "컴퓨터공학 알고리즘 시험에서는 트리의 좌우 자식 개수가 정확히 같은 완전 균형 이진 트리(Balanced Tree)가 최고라고 배우지만, 광선 추적 가속 구조에서는 정반대입니다!",
      "points": [
        {
          "title": "EqualCounts의 함정 (공간 낭비)",
          "content": "물체 개수를 50:50으로 정확히 나누면 트리의 깊이는 이상적인 O(log N)이 됩니다. 하지만 왼쪽 끝에 있는 찻잔과 오른쪽 끝에 있는 주전자가 같은 바운딩 박스로 묶이면서 엄청나게 거대한 빈 상자가 생깁니다. 광선은 이 거대한 빈 상자와 불필요하게 계속 충돌하게 됩니다."
        },
        {
          "title": "기하학적 밀집도 보존의 중요성",
          "content": "차라리 한쪽 노드에 90개의 찻잔 파편이 옹기종기 모여 있고, 다른 쪽 노드에 10개의 주전자 부품이 모여 있도록 불균형하게 나누더라도, 두 바운딩 박스가 서로 겹치지 않고 팽팽하게 물체를 감싸는 것이 광선 탐색에 수십 배 유리합니다."
        }
      ],
      "tags": [
        "자료구조",
        "트리균형",
        "바운딩볼륨",
        "공간분할"
      ],
      "id": "ch07-03-b12"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.3.2 표면적 휴리스틱 (SAH: Surface Area Heuristic)",
      "titleEn": "7.3.2 The Surface Area Heuristic",
      "id": "ch07-03-b13"
    },
    {
      "type": "paragraph",
      "textKo": "단순한 휴리스틱의 한계를 극복하기 위해 제안된 것이 바로 표면적 휴리스틱(SAH, Surface Area Heuristic)입니다. SAH는 순수 기하학적 확률 이론(Geometric Probability Theory)에 기반하여, \"어떤 광선이 바운딩 박스를 지나갈 때 하위 노드와 교차할 확률\"을 정확한 수식으로 모델링하고 이 비용을 최소화하는 분할 위치를 찾아냅니다.",
      "textEn": "The Surface Area Heuristic (SAH) provides a principled model for tree construction based on geometric probability: the probability that a ray hitting a bounding volume will also hit a sub-volume is proportional to the ratio of their surface areas.",
      "id": "ch07-03-b14"
    },
    {
      "type": "figure",
      "id": "fig-07-06",
      "number": "Figure 7.6",
      "title": "Original Figure 7.6",
      "titleKo": "원문 그림 7.6",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-6.png",
      "captionKo": "그림 7.6 · SAH에서 사용하는 광선 분포 가정 아래, 부모 A를 지난 광선이 자식 B 또는 C를 지날 확률을 각각 표면적 비율 sB/sA, sC/sA로 근사합니다. 두 사건은 상호 배타적이지 않을 수 있습니다.",
      "captionEn": "Figure 7.6: If a node of the bounding hierarchy with surface area s Subscript upper A is split into two children with surface areas s Subscript upper B and s Subscript upper C , the probabilities that a ray passing through upper A also passes through upper B and upper C are given by s Subscript upper B Baseline slash s Subscript upper A and s Subscript upper C Baseline slash s Subscript upper A , respectively.",
      "width": 998,
      "height": 210,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "SAH는 단순화한 광선 분포에서 자식 상자를 방문할 확률을 표면적 비율로 근사합니다. 두 자식 상자의 영역이 겹치므로 두 확률을 더한 값이 1일 필요는 없습니다. 실제 카메라·반사 광선의 분포는 이 가정과 다를 수 있습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-03-b16"
    },
    {
      "type": "equation",
      "tex": "C(A, B) = c_t + \\frac{S_A}{S_N} \\sum_{i \\in A} c_i + \\frac{S_B}{S_N} \\sum_{j \\in B} c_j",
      "explanationKo": "SAH 비용 함수: $c_t$는 부모 노드를 방문하여 자식들의 상자 충돌을 검사하는 순회 비용(Traversal Cost)이며, $S_A/S_N$과 $S_B/S_N$은 각 자식 노드에 광선이 충돌할 기하학적 확률입니다. $\\sum c_i$는 해당 자식 노드에 속한 프리미티브들과의 교차 검사 비용입니다.",
      "id": "ch07-03-b17"
    },
    {
      "type": "paragraph",
      "textKo": "일반적으로 모든 프리미티브와의 교차 검사 비용이 동일한 상수 $c_{isect}$라고 가정하면, 자식 $A$에 $N_A$개의 물체가 있고 자식 $B$에 $N_B$개의 물체가 있을 때의 비용 함수는 다음과 같이 단순화됩니다:",
      "textEn": "Assuming uniform intersection cost c_isect for all primitives, the cost simplifies to:",
      "id": "ch07-03-b18"
    },
    {
      "type": "equation",
      "tex": "C(A, B) = c_t + \\frac{S_A}{S_N} N_A c_{isect} + \\frac{S_B}{S_N} N_B c_{isect}",
      "explanationKo": "교차 비용을 1로 정한 상대 비용 모델입니다. 첨부 PBRT 4판의 이 구축 코드에서는 순회 비용을 0.5로 사용합니다. 최적의 비율을 모든 하드웨어에 보장하는 상수는 아닙니다.",
      "id": "ch07-03-b19"
    },
    {
      "type": "paragraph",
      "textKo": "만약 노드를 더 이상 쪼개지 않고 $N$개의 프리미티브를 가진 리프 노드(Leaf Node)로 그대로 남겨둔다면, 그 리프 노드의 광선 검사 비용은 다음과 같습니다:",
      "textEn": "If the node is not split and left as a leaf containing N primitives, the cost is simply:",
      "id": "ch07-03-b20"
    },
    {
      "type": "equation",
      "tex": "C_{\\text{leaf}} = N \\cdot c_{isect}",
      "explanationKo": "리프 노드 비용: 광선이 이 노드에 도달했을 때 내부의 모든 $N$개 프리미티브와 무조건 교차 검사를 수행해야 하므로 총 비용은 $N \\cdot c_{isect}$가 됩니다.",
      "id": "ch07-03-b21"
    },
    {
      "type": "paragraph",
      "textKo": "빌더는 선택한 분할 축의 버킷 경계 후보들을 비교합니다. 최솟값이 리프 비용보다 작을 때 분할하며, 리프의 허용 프리미티브 수 제한 때문에 분할해야 하는 경우도 있습니다. 중심점 범위가 퇴화한 경우 등 별도 조건도 있으므로 단순한 비용 부등식 하나가 모든 결정을 설명하지는 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-03-b22"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "버킷팅(Bucket Partitioning)을 통한 $O(N)$ 최적 분할 탐색",
      "titleEn": "Bucket Partitioning for O(N) Split Evaluation",
      "id": "ch07-03-b23"
    },
    {
      "type": "paragraph",
      "textKo": "엄밀한 SAH를 계산하려면 프리미티브들을 축을 따라 완전히 정렬한 후 $N-1$개의 가능한 모든 분할면을 일일이 검사해야 하므로, 매 단계마다 $O(N \\log N)$의 정렬 비용이 듭니다. 수백만 개의 폴리곤을 가진 씬에서는 빌드 시간이 지나치게 길어집니다. 이를 해결하기 위해 pbrt는 균일한 개수(보통 12개)의 버킷(Buckets)으로 공간을 양자화하는 버킷팅 최적화(Bucket Partitioning)를 사용합니다.",
      "textEn": "Instead of exhaustively sorting all primitives at O(N log N) per node, pbrt partitions the centroid extent into a small number of buckets (e.g., 12) and maps each primitive into a bucket in O(N) time.",
      "id": "ch07-03-b24"
    },
    {
      "type": "figure",
      "id": "fig-07-07",
      "number": "Figure 7.7",
      "title": "Original Figure 7.7",
      "titleKo": "원문 그림 7.7",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-7.png",
      "captionKo": "그림 7.7 · 중심점을 선택 축의 버킷에 배치하고 각 버킷 경계를 후보 분할로 평가합니다. 표면적 휴리스틱 비용이 가장 작은 후보를 고릅니다.",
      "captionEn": "Figure 7.7: Choosing a Splitting Plane with the Surface Area Heuristic for BVHs. The projected extent of primitive bounds centroids is projected onto the chosen split axis. Each primitive is placed in a bucket along the axis based on the centroid of its bounds. The implementation then estimates the cost for splitting the primitives using the planes at each of the bucket boundaries (solid vertical lines); whichever one gives the minimum cost per the surface area heuristic is selected.",
      "width": 998,
      "height": 315,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "chunkName": "<<Evaluate SAH Cost Using Buckets>>=",
      "language": "cpp",
      "code": "constexpr int nBuckets = 12;\nstruct BVHBucketInfo {\n    int count = 0;\n    Bounds3f bounds;\n};\nBVHBucketInfo buckets[nBuckets];\n\n// 1. 각 프리미티브를 해당하는 버킷에 O(N)으로 배치\nfor (size_t i = 0; i < nPrimitives; ++i) {\n    int b = nBuckets * centroidBounds.Offset(prims[i].centroid)[dim];\n    if (b == nBuckets) b = nBuckets - 1;\n    buckets[b].count++;\n    buckets[b].bounds = Union(buckets[b].bounds, prims[i].bounds);\n}\n\n// 2. 앞뒤 누적 면적으로 11개 분할면의 SAH 비용 평가\nFloat cost[nBuckets - 1];\n// 전방 누적(Forward Sweep)과 후방 누적(Backward Sweep)으로 O(B)만에 min cost 도출",
      "explanationKo": "프리미티브들의 중심점을 정규화하여 12개의 버킷 중 하나에 인덱싱합니다. 전체 프리미티브를 단 한 번만 순회(O(N))하여 버킷을 채운 후, 11개 경계면에 대한 비용을 전방/후방 누적 면적 계산으로 O(B)에 처리하여 전체 빌드 속도를 수십 배 끌어올립니다.",
      "provenance": "teaching",
      "id": "ch07-03-b26"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.3.3 HLBVH: 모턴 코드와 초고속 병렬 빌드",
      "titleEn": "7.3.3 Hierarchical Linear Bounding Volume Hierarchies",
      "id": "ch07-03-b27"
    },
    {
      "type": "paragraph",
      "textKo": "SAH 버킷팅이 매우 훌륭하지만, 영화 렌더링에 등장하는 1억 개 이상의 삼각형 메시나 털(Hair), 나뭇잎 등의 복잡한 씬에서는 여전히 수십 초에서 수 분의 빌드 시간이 걸릴 수 있습니다. 특히 GPU나 64코어 이상의 고성능 CPU 환경에서는 트리 구축의 병렬화(Parallelization)가 핵심 과제입니다. 이를 해결하기 위해 pbrt는 모턴 코드(Morton Code)를 활용한 HLBVH(Hierarchical Linear BVH) 알고리즘을 탑재했습니다.",
      "textEn": "For massive scenes with millions of triangles, standard top-down SAH can still be slow to build. Hierarchical Linear Bounding Volume Hierarchies (HLBVH) use Morton codes and radix sort to construct trees in parallel with high efficiency.",
      "id": "ch07-03-b28"
    },
    {
      "type": "figure",
      "id": "fig-07-08",
      "number": "Figure 7.8",
      "title": "Original Figure 7.8",
      "titleKo": "원문 그림 7.8",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-8.png",
      "captionKo": "그림 7.8 · 좌표 비트를 섞어 만든 모턴 인덱스 순서대로 점을 연결하면 계층적인 Z자 경로가 나타납니다.",
      "captionEn": "Figure 7.8: The Order That Points Are Visited along the Morton Curve. Coordinate values along the x and y axes are shown in binary. If we connect the integer coordinate points in the order of their Morton indices, we see that the Morton curve visits the points along a hierarchical “z”-shaped path.",
      "width": 998,
      "height": 268,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "모턴 코드는 3차원 상의 정규화된 부동소수점 좌표 $[0, 1]^3$을 각 축당 10비트(총 30비트 정수) 또는 21비트(총 63비트 정수)로 양자화한 뒤, 세 축의 비트를 하나씩 번갈아가며 인터리빙(Bit Interleaving)하여 생성합니다:",
      "textEn": "To compute a Morton code, floating-point coordinates in [0, 1] are quantized to integers, and their bits are interleaved:",
      "id": "ch07-03-b30"
    },
    {
      "type": "equation",
      "tex": "\\operatorname{Morton}(x,y,z)=\\sum_{i=0}^{9}\\bigl(x_i2^{3i}+y_i2^{3i+1}+z_i2^{3i+2}\\bigr)",
      "explanationKo": "첨부 원문 EncodeMorton3의 축 비트 배치입니다. 다른 관례도 가능하지만 같은 구현 안에서 인코딩과 분할 축 해석을 일치시켜야 합니다.",
      "id": "ch07-03-b31"
    },
    {
      "type": "figure",
      "id": "fig-07-09",
      "number": "Figure 7.9",
      "title": "Original Figure 7.9",
      "titleKo": "원문 그림 7.9",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-9.png",
      "captionKo": "그림 7.9 · 모턴 코드의 높은 비트는 큰 공간 분할을, 낮은 비트는 더 작은 분할을 나타냅니다. 그림의 비트 순서에서는 가장 높은 y 비트가 위·아래 절반을 나눕니다.",
      "captionEn": "Figure 7.9: Implications of the Morton Encoding. The values of various bits in the Morton value indicate the region of space that the corresponding coordinate lies in. (a) In 2D, the high bit of the Morton-coded value of a point’s coordinates defines a splitting plane along the middle of the y axis. If the high bit is set, the point is above the plane. (b) Similarly, the second-highest bit of the Morton value splits the x axis in the middle. (c) If the high y bit is 1 and the high x bit is 0, then the point must lie in the shaded region. (d) The second-from-highest y bit splits the y axis into four regions.",
      "width": 998,
      "height": 582,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-07-10",
      "number": "Figure 7.10",
      "title": "Original Figure 7.10",
      "titleKo": "원문 그림 7.10",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-10.png",
      "captionKo": "그림 7.10 · 중심점을 격자 셀에 모으고 정렬된 모턴 인덱스의 연속 구간마다 작은 LBVH 트리를 만듭니다.",
      "captionEn": "Figure 7.10: Primitive Clusters for LBVH Treelets. Primitive centroids are clustered in a uniform grid over their bounds. An LBVH is created for each cluster of primitives within a cell that are in contiguous sections of the sorted Morton index values.",
      "width": 998,
      "height": 285,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "기수 정렬의 비용은 키 길이와 패스 수에 달립니다",
      "summary": "기수 정렬의 비용은 키 길이와 패스 수에 달립니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "고정 길이 정수 키에서는 일정한 비트 묶음씩 안정적인 계수 정렬을 수행할 수 있어 O(k(N+B))입니다. k와 버킷 수 B를 고정하면 N에 대해 선형입니다. 첨부 원문의 30비트 모턴 키 정렬은 패스당 6비트, 5패스를 사용합니다. 정해진 초 단위 실행 시간을 모든 CPU/GPU에 보장하지는 않습니다."
        }
      ],
      "tags": [
        "기수정렬",
        "알고리즘",
        "모턴코드",
        "시간복잡도"
      ],
      "id": "ch07-03-b34"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.3.4 순회 가속을 위한 컴팩트 BVH: LinearBVH와 32바이트 노드",
      "titleEn": "7.3.4 Compact BVH for Traversal: Linear BVH and 32-Byte Nodes",
      "id": "ch07-03-b35"
    },
    {
      "type": "paragraph",
      "textKo": "배열로 평탄화하면 노드들을 연속 배치하여 포인터 저장과 불규칙한 메모리 접근을 줄일 수 있습니다. 첫 자식을 다음 원소에 두는 방식으로 자식 정보도 줄입니다. 캐시 미스가 사라지거나 실행 시간의 특정 비율을 항상 절약한다는 보장은 없습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-03-b36"
    },
    {
      "type": "figure",
      "id": "fig-07-11",
      "number": "Figure 7.11",
      "title": "Original Figure 7.11",
      "titleKo": "원문 그림 7.11",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-11.png",
      "captionKo": "그림 7.11 · BVH를 깊이 우선 순서로 배열에 놓으면 첫 자식은 부모 바로 다음에 있습니다. 두 번째 자식은 저장한 오프셋으로 찾습니다. 리프에는 자식이 없습니다.",
      "captionEn": "Figure 7.11: Linear Layout of a BVH in Memory. The nodes of the BVH (left) are stored in memory in depth-first order (right). Therefore, for any interior node of the tree (A and B in this example), the first child is found immediately after the parent node in memory. The second child is found via an offset pointer, represented here by lines with arrows. Leaf nodes of the tree (D, E, and C) have no children.",
      "width": 998,
      "height": 160,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "chunkName": "<<LinearBVHNode Representation - Exactly 32 Bytes>>=",
      "language": "cpp",
      "code": "struct alignas(32) LinearBVHNode {\n    Bounds3f bounds; // 6 floats (xMin, xMax, yMin, yMax, zMin, zMax) = 24 bytes\n    union {\n        int primitivesOffset;   // 리프 노드: 프리미티브 배열의 시작 인덱스 (4 bytes)\n        int secondChildOffset;  // 내부 노드: 두 번째 자식 노드의 배열 오프셋 (4 bytes)\n    };\n    uint16_t nPrimitives;       // 리프 노드: 프리미티브 개수 (0이면 내부 노드) (2 bytes)\n    uint8_t axis;               // 내부 노드: 분할 축 (0=x, 1=y, 2=z) (1 byte)\n    uint8_t pad[1];             // 32바이트 정렬을 위한 패딩 (1 byte)\n};\n// 24 + 4 + 2 + 1 + 1 = 정확히 32 Bytes!",
      "explanationKo": "LinearBVHNode 구조체의 바이트 단위 패킹 설계입니다. AABB 바운즈가 24바이트를 차지하고, 공용체(Union)와 메타데이터가 8바이트를 차지하여 정확히 32바이트가 됩니다. 현대 x86/ARM CPU의 캐시 라인 크기(64 Bytes)에 정확히 2개의 노드가 완벽하게 정렬되어 들어가므로 캐시 미스를 극한으로 줄입니다.",
      "provenance": "teaching",
      "id": "ch07-03-b38"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "정렬은 캐시 경계 교차를 줄이는 장치입니다",
      "summary": "정렬은 캐시 경계 교차를 줄이는 장치입니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "Float가32비트인 원문의 배치에서 노드 크기는32바이트입니다. 64바이트 캐시 라인을 사용하는 시스템에서는 정렬된 노드 두 개를 한 라인에 담을 수 있습니다. 부모와 첫 자식이 항상 같은 라인인 것은 아니며, 모든 CPU의 캐시 라인 크기와 Float 설정이 같은 것도 아닙니다."
        }
      ],
      "tags": [
        "컴퓨터구조",
        "CPU캐시",
        "메모리정렬",
        "캐시라인",
        "최적화"
      ],
      "id": "ch07-03-b39"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.3.5 스택 기반 비재귀 광선 순회(Traversal) 알고리즘",
      "titleEn": "7.3.5 Non-recursive Stack-based Traversal Algorithm",
      "id": "ch07-03-b40"
    },
    {
      "type": "paragraph",
      "textKo": "첨부 구현은 배열 스택 64칸을 사용해 방문할 노드를 저장합니다. 이것만으로 임의 BVH의 깊이가 수학적으로64이하라고 증명되지는 않습니다. 입력 범위와 구축 조건을 검토하고 일반화한 구현에서는 경계 검사나 충분한 저장 공간을 고려해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-03-b41"
    },
    {
      "type": "paragraph",
      "textKo": "광선 방향의 부호로 가까울 것으로 예상되는 자식을 먼저 방문합니다. 자식 상자가 겹칠 수 있으므로 정확한 전역 거리 순서는 아닙니다. 더 가까운 교차를 찾을 때마다 tMax를 줄이고, 남은 후보를 끝까지 안전하게 검사해야 최단 교차를 반환할 수 있습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch07-03-b42"
    },
    {
      "type": "code",
      "chunkName": "<<BVHAggregate::Intersect Traversal Loop>>=",
      "language": "cpp",
      "code": "pstd::optional<ShapeIntersection>\nBVHAggregate::Intersect(const Ray &ray, Float tMax) const {\n    pstd::optional<ShapeIntersection> si;\n    Vector3f invDir(1 / ray.d.x, 1 / ray.d.y, 1 / ray.d.z);\n    int dirIsNeg[3] = {int(invDir.x < 0), int(invDir.y < 0),\n                       int(invDir.z < 0)};\n    int toVisitOffset = 0, currentNodeIndex = 0;\n       int nodesToVisit[64];\n       while (true) {\n           const LinearBVHNode *node = &nodes[currentNodeIndex];\n           if (node->bounds.IntersectP(ray.o, ray.d, tMax, invDir, dirIsNeg)) {\n                  if (node->nPrimitives > 0) {\n                      for (int i = 0; i < node->nPrimitives; ++i) {\n                             pstd::optional<ShapeIntersection> primSi =\n                                    primitives[node->primitivesOffset + i].Intersect(ray, tMax);\n                                if (primSi) {\n                                    si = primSi;\n                                    tMax = si->tHit;\n                                }\n                         }\n                         if (toVisitOffset == 0) break;\n                         currentNodeIndex = nodesToVisit[--toVisitOffset];\n                  } else {\n                      if (dirIsNeg[node->axis]) {\n                            nodesToVisit[toVisitOffset++] = currentNodeIndex + 1;\n                            currentNodeIndex = node->secondChildOffset;\n                         } else {\n                            nodesToVisit[toVisitOffset++] = node->secondChildOffset;\n                            currentNodeIndex = currentNodeIndex + 1;\n                         }\n                  }\n              } else {\n                  if (toVisitOffset == 0) break;\n                  currentNodeIndex = nodesToVisit[--toVisitOffset];\n              }\n       }\n    return si;\n}",
      "explanationKo": "첨부 PBRT 원문의 해당 코드 조각을 복원했습니다. 주변 타입·함수·매크로 선언을 포함하는 PBRT 코드 문맥에서 읽는 발췌이며, 단독 실행 프로그램은 아닙니다.",
      "provenance": "source-excerpt",
      "id": "ch07-03-b43"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7.3.6 성능 분석 및 프로덕션 씬 실전 사례",
      "titleEn": "7.3.6 Performance Analysis and Real-world Production Scenes",
      "id": "ch07-03-b44"
    },
    {
      "type": "paragraph",
      "textKo": "실제 영화 및 게임 프로덕션 환경에서 BVH의 품질과 성능은 어떻게 측정될까요? pbrt 연구팀은 복잡한 조명과 복잡한 기하학 구조를 가진 다양한 실전 씬에서 BVH 노드 방문 횟수와 교차 검사 횟수를 정밀 측정했습니다.",
      "textEn": "The effectiveness of BVH acceleration can be visualized through node visit heatmaps and evaluated on complex production scenes.",
      "id": "ch07-03-b45"
    },
    {
      "type": "figure",
      "id": "fig-07-12",
      "number": "Figure 7.12",
      "title": "Original Figure 7.12",
      "titleKo": "원문 그림 7.12",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-12.png",
      "captionKo": "그림 7.12 · Kroken 장면의 픽셀별 BVH 방문 수와 삼각형 교차 검사 수입니다. 복잡한 부분뿐 아니라 축정렬 박스로 촘촘히 감싸기 어려운 형상 주변에서도 검사 수가 늘 수 있습니다. 장면 제공: Angelo Ferretti.",
      "captionEn": "Figure 7.12: Visualization of BVH Performance with the Kroken Scene. (a) Number of BVH nodes visited when tracing the camera ray at each pixel for the scene shown in Figure 1.1 . Not only are more nodes visited in geometrically complex regions of the scene such as the rug, but objects that are not accurately bounded by axis-aligned bounding boxes such as the support under the bottom shelf lead to many nodes being visited. (b) Number of ray–triangle intersection tests performed for the camera ray at each pixel. The BVH is effective at limiting the number of intersection tests even in highly complex regions of the scene like the rug. However, objects that are poorly fit by axis-aligned bounding boxes lead to many intersection tests for rays in their vicinity. (Kroken scene courtesy of Angelo Ferretti.)",
      "width": 998,
      "height": 1208,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-07-13",
      "number": "Figure 7.13",
      "title": "Original Figure 7.13",
      "titleKo": "원문 그림 7.13",
      "src": "/books/pbrt-4ed/reviewed-images/figure-7-13.png",
      "captionKo": "그림 7.13 · 모아나 섬 장면의 BVH 방문·삼각형 교차 검사 수입니다. 윤곽 경계나 여러 물체 옆을 지나야 하는 광선에서 방문 수가 많고, 복잡한 나무·지면에서는 교차 검사가 늘어납니다. 장면 제공: Walt Disney Animation Studios.",
      "captionEn": "Figure 7.13: Visualization of BVH Performance with the Moana Island Scene. (a) Number of BVH nodes visited when tracing the camera ray at each pixel for the scene shown in Figure 1.4 . As with the Kroken scene, silhouette edges and regions where the ray passes by many objects before finding an intersection see the most nodes visited. (b) Number of ray–triangle intersection tests performed for the camera ray at each pixel. The most geometrically complex trees and the detailed ground cover on the beach require the most intersection tests. (Scene courtesy of Walt Disney Animation Studios.)",
      "width": 998,
      "height": 923,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "분할 알고리즘별 종합 성능 벤치마크 요약",
      "titleEn": "Summary Benchmark Comparison of Partitioning Methods",
      "id": "ch07-03-b48"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt에 구현된 네 가지 BVH 분할 알고리즘의 빌드 시간, 렌더링 시간, 메모리 사용량의 트레이드오프는 다음과 같이 정리할 수 있습니다:",
      "textEn": "The trade-offs among the four BVH construction algorithms in pbrt are summarized below:",
      "id": "ch07-03-b49"
    },
    {
      "type": "concept-tip",
      "badge": "📊 알고리즘 종합 비교",
      "title": "구축 비용과 추적 비용을 함께 측정합니다",
      "summary": "구축 비용과 추적 비용을 함께 측정합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "SAH는 좋은 추적 품질을 노리며, HLBVH는 모턴 키로 하위 트리를 빠르게 만들고 상위 연결에 SAH를 적용합니다. Middle과 EqualCounts는 단순한 대안입니다. 어떤 방식도 모든 장면·하드웨어에서 항상 가장 빠르지는 않습니다. 전체 렌더 시간, 재구축 빈도, 메모리와 광선 방문량을 함께 비교합니다."
        }
      ],
      "tags": [
        "BVH",
        "SAH",
        "HLBVH",
        "벤치마크",
        "성능최적화"
      ],
      "id": "ch07-03-b50"
    }
  ],
  "audit": {
    "checkedSourceSha256": "4ad642673d1c48ccbc27b340f14dfb78f3464375ab64df0783c676c2e3201ae4",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "7.3 Bounding Volume Hierarchies",
      "7.3.1  BVH Construction",
      "7.3.2  The Surface Area Heuristic",
      "7.3.3  Linear Bounding Volume Hierarchies",
      "7.3.4  Compact BVH for Traversal",
      "7.3.5  Bounding and Intersection Tests"
    ],
    "sourceFigures": [
      "7.3",
      "7.4",
      "7.5",
      "7.6",
      "7.7",
      "7.8",
      "7.9",
      "7.10",
      "7.11",
      "7.12",
      "7.13"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
