import type { SectionContent } from '../../../../types/book';

export const CH03_07_BOUNDING_BOXES: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "3",
  "chapterTitleKo": "제3장 기하학과 3차원 변환 (Geometry & Transformations)",
  "sectionNumber": "3.7",
  "sectionTitle": "Bounding Boxes",
  "sectionTitleKo": "3.7 바운딩 박스 (Bounding Boxes & AABB)",
  "originalUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Bounding_Boxes.html",
  "prevSection": {
    "id": "ch03-06",
    "title": "3.6 광선 (Rays)"
  },
  "nextSection": {
    "id": "ch03-08",
    "title": "3.8 구면 기하학 (Spherical Geometry)"
  },
  "summary": {
    "keyTakeaways": [
      "바운딩 박스(Bounding Box, AABB)는 복잡한 3D 물체를 감싸는 가장 단순한 직육면체 상자입니다.",
      "좌표축(X, Y, Z)에 평행하게 정렬되어 있어, 단 두 개의 점(최솟점 pMin, 최댓점 pMax)만으로 전체 영역을 표현할 수 있습니다.",
      "두 박스의 교집합(Intersect)은 각 축별로 \"최솟값 중 최댓값\"과 \"최댓값 중 최솟값\"을 구하는 매우 직관적인 원리로 계산됩니다.",
      "바운딩 박스를 먼저 검사해 빗나간 영역의 비싼 형상 검사를 생략합니다. 성능 이득은 장면과 가속 구조에 따라 다릅니다."
    ],
    "prerequisites": [
      "3차원 좌표계와 점(Point3)의 기본 개념",
      "C++ 템플릿(template <typename T>) 문법 기초"
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "textKo": "3D 그래픽스 및 렌더링 시스템의 수많은 핵심 알고리즘은 **\"좌표축과 나란하게 정렬된 직사각형 공간(Axis-Aligned Bounding Box, 줄여서 AABB)\"**을 다루는 데서 출발합니다. 예를 들어, pbrt 시스템이 멀티스레드로 이미지를 빠르게 병렬 렌더링할 때는 화면 전체를 독립적으로 계산 가능한 2D 사각형 타일들로 잘게 쪼갭니다. 또한 제7장에서 배울 **가속 구조(BVH, Bounding Volume Hierarchy)**에서는 복잡한 3차원 물체들을 감싸는 3D 박스들을 만들어 광선과의 충돌 검사 횟수를 기하급수적으로 줄입니다.",
      "textEn": "Many parts of the system operate on axis-aligned regions of space. For example, multi-threading in pbrt is implemented by subdividing the image into 2D rectangular tiles that can be processed independently, and the bounding volume hierarchy in Section 7.3 uses 3D boxes to bound geometric primitives in the scene.",
      "id": "ch03-07-b1"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "싼 검사로 비싼 검사를 줄입니다",
      "summary": "싼 검사로 비싼 검사를 줄입니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "광선이 물체 전체를 감싸는 박스를 빗나가면 그 안의 삼각형도 모두 빗나갑니다. AABB는 축마다 구간을 비교하는 방식으로 검사할 수 있습니다. 실제 성능은 박스의 겹침 정도와 데이터·연산 비용에 따라 달라집니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "AABB",
        "알고리즘 최적화"
      ],
      "id": "ch03-07-b2"
    },
    {
      "type": "paragraph",
      "textKo": "Bounds2와 Bounds3는 각각 2차원과 3차원의 축정렬 영역을 나타내는 템플릿입니다. 원소 타입은 정수 또는 실수 등으로 고를 수 있습니다. 두 구현은 유사하지만 Bounds2가 Bounds3를 상속하는 것은 아닙니다. 여기서는 3차원 연산을 중심으로 설명합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-07-b3"
    },
    {
      "type": "figure",
      "id": "fig:bbox-extent",
      "number": "Figure 3.9",
      "title": "Original Figure 3.9",
      "titleKo": "원문 그림 3.9",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-9.png",
      "captionKo": "그림 3.9 · 축정렬 바운딩 박스는 최소·최대 점 두 개만 저장해 표현합니다. 다른 꼭짓점은 각 축의 최소·최대 값을 조합해 얻습니다.",
      "captionEn": "Figure 3.9: An Axis-Aligned Bounding Box. The Bounds2 and Bounds3 classes store only the coordinates of the minimum and maximum points of the box; the other box corners are implicit in this representation.",
      "width": 998,
      "height": 183,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Bounding_Boxes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "두 바운딩 박스의 교집합 구하기 (Intersection)",
      "titleEn": "Intersection of Two Bounding Boxes",
      "id": "ch03-07-b5"
    },
    {
      "type": "paragraph",
      "textKo": "두 개의 바운딩 박스가 3차원 공간에서 서로 겹치는 영역(교집합, Intersection) 역시 또 하나의 축 정렬 바운딩 박스가 됩니다. 이 교집합 박스의 좌표는 아주 우아하고 단순한 규칙으로 구할 수 있습니다: **\"두 박스의 최솟값 좌표(pMin)들 중 더 큰 값(Max)\"**을 새 최솟값으로 삼고, **\"두 박스의 최댓값 좌표(pMax)들 중 더 작은 값(Min)\"**을 새 최댓값으로 삼으면 됩니다. 아래의 [그림 3.10]을 보면 눈으로 단번에 이해할 수 있습니다.",
      "textEn": "The intersection of two bounding boxes can be found by computing the maximum of their two respective minimum coordinates and the minimum of their maximum coordinates. (See Figure 3.10.)",
      "id": "ch03-07-b6"
    },
    {
      "type": "figure",
      "id": "fig:bbox-intersection",
      "number": "Figure 3.10",
      "title": "Original Figure 3.10",
      "titleKo": "원문 그림 3.10",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-10.png",
      "captionKo": "그림 3.10 · 두 박스의 교집합은 최소점 성분끼리의 최댓값과 최대점 성분끼리의 최솟값으로 구합니다. 축별 범위가 뒤집히면 빈 교집합입니다.",
      "captionEn": "Figure 3.10: Intersection of Two Bounding Boxes. Given two bounding boxes with pMin and pMax points denoted by open circles, the bounding box of their area of intersection (shaded region) has a minimum point (lower left filled circle) with coordinates given by the maximum of the coordinates of the minimum points of the two boxes in each dimension. Similarly, its maximum point (upper right filled circle) is given by the minimums of the boxes’ maximum coordinates.",
      "width": 998,
      "height": 249,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Bounding_Boxes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 직관적 비유로 이해하기",
      "title": "왜 최솟값은 Max()를 쓰고, 최댓값은 Min()을 쓸까요?",
      "summary": "친구와의 \"약속 시간 정하기\"를 생각해보면 평생 잊어버리지 않습니다!",
      "points": [
        {
          "title": "약속 시간 겹치는 구간 찾기",
          "content": "내가 되는 시간: [오후 1시 ~ 오후 6시], 친구가 되는 시간: [오후 3시 ~ 오후 8시]. 둘 다 만날 수 있는 겹치는 시간은? 늦게 시작하는 사람 기준인 오후 3시(Max(1, 3))부터, 먼저 가야 하는 사람 기준인 오후 6시(Min(6, 8))까지입니다! 즉, 교집합의 시작점은 최댓값(Max)이고, 끝점은 최솟값(Min)입니다."
        },
        {
          "title": "3차원 공간으로의 확장",
          "content": "AABB는 X축, Y축, Z축이 서로 수직으로 독립적이므로, X축 시간 겹치기, Y축 시간 겹치기, Z축 시간 겹치기를 각각 따로 계산해 묶어주기만 하면 끝납니다."
        }
      ],
      "tags": [
        "수학적 직관",
        "알고리즘 발상법"
      ],
      "id": "ch03-07-b8"
    },
    {
      "type": "code",
      "chunkName": "<<Bounds3 Inline Functions>>+=",
      "language": "cpp",
      "code": "template <typename T>\nBounds3<T> Intersect(const Bounds3<T> &b1, const Bounds3<T> &b2) {\n    Bounds3<T> b;\n    b.pMin = Max(b1.pMin, b2.pMin);\n    b.pMax = Min(b1.pMax, b2.pMax);\n    return b;\n}",
      "explanationKo": "코드 구현은 단 4줄로 끝납니다. C++ 템플릿 덕분에 float뿐 아니라 int 등 어떤 수치형 데이터에도 동일하게 동작합니다. b1과 b2의 각 좌표 축 성분별로 Max와 Min을 적용하여 새로운 바운딩 박스 b를 반환합니다.",
      "chunkUpRef": "Union() 함수",
      "chunkDownRef": "Overlaps() 함수",
      "provenance": "teaching",
      "id": "ch03-07-b9"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 한 가지 주의할 점이 있습니다. 만약 두 바운딩 박스가 실제로는 전혀 겹치지 않는다면 어떻게 될까요? 이 함수를 그대로 실행하면 계산 결과에서 `pMin`의 특정 좌표 축 성분이 `pMax`보다 커지는 현상이 발생합니다(예: $pMin.x > pMax.x$). 즉 유효하지 않은(Invalid) 박스가 만들어집니다. 따라서 두 박스가 실제로 겹쳤는지 확인할 때는 뒤이어 살펴볼 `Overlaps()` 함수나 유효성 검사 함수를 함께 사용합니다.",
      "textEn": "Note that if the two bounding boxes do not overlap, this function will return a box where pMin has coordinates that are greater than the corresponding coordinates of pMax.",
      "id": "ch03-07-b10"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "두 바운딩 박스의 합집합 구하기 (Union)",
      "titleEn": "Union of Two Bounding Boxes",
      "id": "ch03-07-b11"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 Union은 두 박스의 집합론적 합집합 자체가 아니라, 그 합집합을 모두 포함하는 가장 작은 축정렬 박스를 반환합니다. 떨어진 박스 사이의 빈 공간도 포함될 수 있습니다. BVH의 상위 노드가 하위 노드의 모든 물체를 감싸도록 만들 때 사용합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-07-b12"
    },
    {
      "type": "figure",
      "id": "fig:bbox-union",
      "number": "Figure 3.11",
      "title": "Original Figure 3.11",
      "titleKo": "원문 그림 3.11",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-11.png",
      "captionKo": "그림 3.11 · 점과 박스 사이 거리에서는 각 축에서 박스 바깥으로 벗어난 양을 구합니다. 그 축 범위 안에 있으면 거리는 0이며, 축별 거리의 제곱을 더하면 최단거리의 제곱입니다.",
      "captionEn": "Figure 3.11: Computing the Squared Distance from a Point to an Axis-Aligned Bounding Box. We first find the distance from the point to the box in each dimension. Here, the point represented by an empty circle on the upper left is above to the left of the box, so its x and y distances are respectively pMin.x - p.x and pMin.y - p.y . The other point represented by an empty circle is to the right of the box but overlaps its extent in the y dimension, giving it respective distances of p.x - pMax.x and zero. The logic in Bounds3::DistanceSquared() computes these distances by finding the maximum of zero and the distances to the minimum and maximum points in each dimension.",
      "width": 998,
      "height": 192,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Bounding_Boxes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "chunkName": "<<Bounds3 Inline Functions>>+=",
      "language": "cpp",
      "code": "template <typename T>\nBounds3<T> Union(const Bounds3<T> &b1, const Bounds3<T> &b2) {\n    Bounds3<T> ret;\n    ret.pMin = Min(b1.pMin, b2.pMin);\n    ret.pMax = Max(b1.pMax, b2.pMax);\n    return ret;\n}\n\n// 점 p 하나를 기존 바운딩 박스 b에 추가하여 확장하는 오버로딩 버전\ntemplate <typename T>\nBounds3<T> Union(const Bounds3<T> &b, Point3<T> p) {\n    Bounds3<T> ret;\n    ret.pMin = Min(b.pMin, p);\n    ret.pMax = Max(b.pMax, p);\n    return ret;\n}",
      "explanationKo": "합집합(Union)은 모든 것을 포함해야 하므로 가장 바깥쪽 경계를 택합니다. 따라서 최솟점 pMin끼리는 더 작은 값 Min()을 취하고, 최댓점 pMax끼리는 더 큰 값 Max()를 취합니다.",
      "chunkUpRef": "Bounding Box 선언부",
      "chunkDownRef": "Intersect() 함수",
      "provenance": "teaching",
      "id": "ch03-07-b14"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "점 포함 여부 및 유용한 유틸리티 함수들",
      "titleEn": "Other Useful Bounding Box Operations",
      "id": "ch03-07-b15"
    },
    {
      "type": "paragraph",
      "textKo": "바운딩 박스 클래스는 이 밖에도 렌더러 개발에 필수적인 다양한 편의 메서드를 제공합니다. 예를 들어 어떤 점 `p`가 바운딩 박스 내부에 들어있는지 확인하는 `Inside()` 함수는 점의 각 성분이 `[pMin, pMax]` 범위 안에 있는지만 간단히 확인합니다.",
      "textEn": "We can determine if a point is inside a bounding box by checking if its coordinates are all within the ranges defined by the box extents.",
      "id": "ch03-07-b16"
    },
    {
      "type": "code",
      "chunkName": "<<Bounds3 Public Methods>>+=",
      "language": "cpp",
      "code": "template <typename T>\nbool Inside(Point3<T> p, const Bounds3<T> &b) {\n    return (p.x >= b.pMin.x && p.x <= b.pMax.x &&\n            p.y >= b.pMin.y && p.y <= b.pMax.y &&\n            p.z >= b.pMin.z && p.z <= b.pMax.z);\n}\n\n// 박스의 가로, 세로, 높이 대각선 벡터를 구하는 메서드\nVector3<T> Diagonal() const { \n    return pMax - pMin; \n}",
      "explanationKo": "Inside 함수는 점 p가 3차원 축 각각에 대해 pMin과 pMax 사이에 쏙 들어가는지 검사합니다. Diagonal()은 대각선 벡터를 반환하여 박스의 부피(Volume)나 표면적(Surface Area)을 구할 때 기반이 됩니다.",
      "provenance": "teaching",
      "id": "ch03-07-b17"
    }
  ],
  "audit": {
    "checkedSourceSha256": "a766d2d091286ad98e308be2f76c2573beb19b0eaa05f2d238705d9262de0057",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "3.7 Bounding Boxes"
    ],
    "sourceFigures": [
      "3.9",
      "3.10",
      "3.11"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
