import { SectionContent } from '../../../../types/book';

export const CH03_07_BOUNDING_BOXES: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.7',
  sectionTitle: 'Bounding Boxes',
  sectionTitleKo: '3.7 바운딩 박스 (Bounding Boxes & AABB)',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/Bounding_Boxes.html',
  prevSection: {
    id: 'ch03-06',
    title: '3.6 광선 (Rays)',
  },
  nextSection: {
    id: 'ch03-08',
    title: '3.8 구면 기하학 (Spherical Geometry)',
  },
  summary: {
    keyTakeaways: [
      '바운딩 박스(Bounding Box, AABB)는 복잡한 3D 물체를 감싸는 가장 단순한 직육면체 상자입니다.',
      '좌표축(X, Y, Z)에 평행하게 정렬되어 있어, 단 두 개의 점(최솟점 pMin, 최댓점 pMax)만으로 전체 영역을 표현할 수 있습니다.',
      '두 박스의 교집합(Intersect)은 각 축별로 "최솟값 중 최댓값"과 "최댓값 중 최솟값"을 구하는 매우 직관적인 원리로 계산됩니다.',
      '레이 트레이싱에서 수백만 개의 폴리곤을 일일이 검사하지 않고, 바운딩 박스를 먼저 검사함으로써 렌더링 성능을 수천 배 향상시킵니다.'
    ],
    prerequisites: [
      '3차원 좌표계와 점(Point3)의 기본 개념',
      'C++ 템플릿(template <typename T>) 문법 기초'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: '3D 그래픽스 및 렌더링 시스템의 수많은 핵심 알고리즘은 **"좌표축과 나란하게 정렬된 직사각형 공간(Axis-Aligned Bounding Box, 줄여서 AABB)"**을 다루는 데서 출발합니다. 예를 들어, pbrt 시스템이 멀티스레드로 이미지를 빠르게 병렬 렌더링할 때는 화면 전체를 독립적으로 계산 가능한 2D 사각형 타일들로 잘게 쪼갭니다. 또한 제7장에서 배울 **가속 구조(BVH, Bounding Volume Hierarchy)**에서는 복잡한 3차원 물체들을 감싸는 3D 박스들을 만들어 광선과의 충돌 검사 횟수를 기하급수적으로 줄입니다.',
      textEn: 'Many parts of the system operate on axis-aligned regions of space. For example, multi-threading in pbrt is implemented by subdividing the image into 2D rectangular tiles that can be processed independently, and the bounding volume hierarchy in Section 7.3 uses 3D boxes to bound geometric primitives in the scene.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '왜 복잡한 물체를 그냥 검사하지 않고 "바운딩 박스"로 감쌀까요?',
      summary: '컴퓨터 그래픽스 성능 최적화의 제1원칙: "비싼 연산은 되도록 하지 마라!"',
      points: [
        {
          title: '비용의 차이 (삼각형 vs 박스)',
          content: '정교한 캐릭터 모델 하나에는 수십만~수백만 개의 삼각형이 쓰입니다. 광선이 날아갈 때마다 수백만 개의 삼각형과 일일이 교차 계산을 하면 화면 1장을 그리는 데 며칠이 걸립니다. 하지만 모델 전체를 감싸는 직육면체(바운딩 박스)는 덧셈과 나눗셈 몇 번이면 광선이 빗나갔는지 즉시 판별할 수 있습니다!'
        },
        {
          title: '축 정렬(Axis-Aligned)의 위력',
          content: '박스가 회전되어 있지 않고 X, Y, Z 축에 딱 맞춰 나란히 놓여 있기 때문에, 3차원 문제를 1차원 수직선 3개(X축, Y축, Z축)의 독립적인 구간 검사로 쪼개어 극도로 단순하게 풀 수 있습니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'AABB', '알고리즘 최적화']
    },
    {
      type: 'paragraph',
      textKo: 'pbrt에서는 이러한 영역을 표현하기 위해 `Bounds2`와 `Bounds3`라는 템플릿 클래스를 제공합니다. 두 클래스 모두 좌표를 저장할 데이터 타입 `T`를 템플릿 인자로 받습니다(예를 들어 실수 좌표는 `float`, 화면 픽셀 좌표는 `int`를 사용합니다). 2차원 사각형인 `Bounds2`는 실질적으로 3차원인 `Bounds3`의 하위 집합이므로, 여기서는 핵심인 `Bounds3`를 중심으로 살펴보겠습니다.',
      textEn: 'The Bounds2 and Bounds3 template classes are used to represent the extent of these sorts of regions. Both are parameterized by a type T that is used to represent the coordinates of their extents. As with the earlier vector math types, we will focus here on the 3D variant, Bounds3, since Bounds2 is effectively a subset of it.'
    },
    {
      type: 'figure',
      id: 'fig:bbox-extent',
      number: 'Figure 3.9',
      title: 'Bounding Box Representation',
      titleKo: '두 점(pMin, pMax)으로 정의되는 바운딩 박스',
      src: '/books/pbrt-4ed/images/pha03f09.svg',
      captionKo: '축 정렬 바운딩 박스(AABB)는 공간 속 가장 작은 좌표를 갖는 모서리 점 pMin과, 가장 큰 좌표를 갖는 대각선 반대편 모서리 점 pMax 단 두 개로 공간의 직육면체 범위를 완벽하게 정의합니다.',
      captionEn: 'A bounding box can be specified by two points, pMin and pMax, that denote opposite corners of the box.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '두 바운딩 박스의 교집합 구하기 (Intersection)',
      titleEn: 'Intersection of Two Bounding Boxes'
    },
    {
      type: 'paragraph',
      textKo: '두 개의 바운딩 박스가 3차원 공간에서 서로 겹치는 영역(교집합, Intersection) 역시 또 하나의 축 정렬 바운딩 박스가 됩니다. 이 교집합 박스의 좌표는 아주 우아하고 단순한 규칙으로 구할 수 있습니다: **"두 박스의 최솟값 좌표(pMin)들 중 더 큰 값(Max)"**을 새 최솟값으로 삼고, **"두 박스의 최댓값 좌표(pMax)들 중 더 작은 값(Min)"**을 새 최댓값으로 삼으면 됩니다. 아래의 [그림 3.10]을 보면 눈으로 단번에 이해할 수 있습니다.',
      textEn: 'The intersection of two bounding boxes can be found by computing the maximum of their two respective minimum coordinates and the minimum of their maximum coordinates. (See Figure 3.10.)'
    },
    {
      type: 'figure',
      id: 'fig:bbox-intersection',
      number: 'Figure 3.10',
      title: 'Intersection of Two Bounding Boxes',
      titleKo: '두 바운딩 박스의 교집합 (Intersection)',
      src: '/books/pbrt-4ed/images/pha03f10.svg',
      captionKo: '두 개의 바운딩 박스가 주어졌을 때(빈 원으로 표시된 각 박스의 pMin과 pMax 모서리 점), 이 둘이 겹치는 회색 영역의 교집합 바운딩 박스는 각 축마다 두 박스의 최솟값 점 중 더 큰 좌표(좌측 하단의 채워진 원)를 pMin으로 갖고, 두 박스의 최댓값 점 중 더 작은 좌표(우측 상단의 채워진 원)를 pMax로 갖습니다.',
      captionEn: 'Figure 3.10: Intersection of Two Bounding Boxes. Given two bounding boxes with pMin and pMax points denoted by open circles, the bounding box of their area of intersection (shaded region) has a minimum point (lower left filled circle) with coordinates given by the maximum of the coordinates of the minimum points of the two boxes in each dimension. Similarly, its maximum point (upper right filled circle) is given by the minimums of the boxes’ maximum coordinates.'
    },
    {
      type: 'concept-tip',
      badge: '💡 직관적 비유로 이해하기',
      title: '왜 최솟값은 Max()를 쓰고, 최댓값은 Min()을 쓸까요?',
      summary: '친구와의 "약속 시간 정하기"를 생각해보면 평생 잊어버리지 않습니다!',
      points: [
        {
          title: '약속 시간 겹치는 구간 찾기',
          content: '내가 되는 시간: [오후 1시 ~ 오후 6시], 친구가 되는 시간: [오후 3시 ~ 오후 8시]. 둘 다 만날 수 있는 겹치는 시간은? 늦게 시작하는 사람 기준인 오후 3시(Max(1, 3))부터, 먼저 가야 하는 사람 기준인 오후 6시(Min(6, 8))까지입니다! 즉, 교집합의 시작점은 최댓값(Max)이고, 끝점은 최솟값(Min)입니다.'
        },
        {
          title: '3차원 공간으로의 확장',
          content: 'AABB는 X축, Y축, Z축이 서로 수직으로 독립적이므로, X축 시간 겹치기, Y축 시간 겹치기, Z축 시간 겹치기를 각각 따로 계산해 묶어주기만 하면 끝납니다.'
        }
      ],
      tags: ['수학적 직관', '알고리즘 발상법']
    },
    {
      type: 'code',
      chunkName: '<<Bounds3 Inline Functions>>+=',
      language: 'cpp',
      code: `template <typename T>
Bounds3<T> Intersect(const Bounds3<T> &b1, const Bounds3<T> &b2) {
    Bounds3<T> b;
    b.pMin = Max(b1.pMin, b2.pMin);
    b.pMax = Min(b1.pMax, b2.pMax);
    return b;
}`,
      explanationKo: '코드 구현은 단 4줄로 끝납니다. C++ 템플릿 덕분에 float뿐 아니라 int 등 어떤 수치형 데이터에도 동일하게 동작합니다. b1과 b2의 각 좌표 축 성분별로 Max와 Min을 적용하여 새로운 바운딩 박스 b를 반환합니다.',
      chunkUpRef: 'Union() 함수',
      chunkDownRef: 'Overlaps() 함수'
    },
    {
      type: 'paragraph',
      textKo: '여기서 한 가지 주의할 점이 있습니다. 만약 두 바운딩 박스가 실제로는 전혀 겹치지 않는다면 어떻게 될까요? 이 함수를 그대로 실행하면 계산 결과에서 `pMin`의 특정 좌표 축 성분이 `pMax`보다 커지는 현상이 발생합니다(예: $pMin.x > pMax.x$). 즉 유효하지 않은(Invalid) 박스가 만들어집니다. 따라서 두 박스가 실제로 겹쳤는지 확인할 때는 뒤이어 살펴볼 `Overlaps()` 함수나 유효성 검사 함수를 함께 사용합니다.',
      textEn: 'Note that if the two bounding boxes do not overlap, this function will return a box where pMin has coordinates that are greater than the corresponding coordinates of pMax.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '두 바운딩 박스의 합집합 구하기 (Union)',
      titleEn: 'Union of Two Bounding Boxes'
    },
    {
      type: 'paragraph',
      textKo: '교집합과 반대로, 두 개의 바운딩 박스를 **모두 감싸는 가장 작은 새로운 바운딩 박스(합집합, Union)**를 구하는 연산도 빈번히 사용됩니다. 이는 BVH 트리 같은 공간 분할 자료구조를 아래에서 위로(Bottom-Up) 구축할 때 필수적인 연산입니다.',
      textEn: 'It is also frequently necessary to compute a bounding box that encompasses two bounding boxes, or a bounding box and a point.'
    },
    {
      type: 'figure',
      id: 'fig:bbox-union',
      number: 'Figure 3.11',
      title: 'Union of Two Bounding Boxes',
      titleKo: '두 바운딩 박스의 합집합 (Union)',
      src: '/books/pbrt-4ed/images/pha03f11.svg',
      captionKo: '두 개의 바운딩 박스를 모두 포함하는 가장 작은 바운딩 박스(점선)는, 두 박스의 최솟값 중 더 작은 값(Min)을 새 pMin으로 삼고, 최댓값 중 더 큰 값(Max)을 새 pMax로 삼습니다. 교집합과 정반대의 Min/Max 조합입니다.',
      captionEn: 'Figure 3.11: Union of Two Bounding Boxes. The bounding box encompassing two boxes has a minimum point determined by the minimums of the two boxes’ minimum points and a maximum point given by the maximums of their maximum points.'
    },
    {
      type: 'code',
      chunkName: '<<Bounds3 Inline Functions>>+=',
      language: 'cpp',
      code: `template <typename T>
Bounds3<T> Union(const Bounds3<T> &b1, const Bounds3<T> &b2) {
    Bounds3<T> ret;
    ret.pMin = Min(b1.pMin, b2.pMin);
    ret.pMax = Max(b1.pMax, b2.pMax);
    return ret;
}

// 점 p 하나를 기존 바운딩 박스 b에 추가하여 확장하는 오버로딩 버전
template <typename T>
Bounds3<T> Union(const Bounds3<T> &b, Point3<T> p) {
    Bounds3<T> ret;
    ret.pMin = Min(b.pMin, p);
    ret.pMax = Max(b.pMax, p);
    return ret;
}`,
      explanationKo: '합집합(Union)은 모든 것을 포함해야 하므로 가장 바깥쪽 경계를 택합니다. 따라서 최솟점 pMin끼리는 더 작은 값 Min()을 취하고, 최댓점 pMax끼리는 더 큰 값 Max()를 취합니다.',
      chunkUpRef: 'Bounding Box 선언부',
      chunkDownRef: 'Intersect() 함수'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '점 포함 여부 및 유용한 유틸리티 함수들',
      titleEn: 'Other Useful Bounding Box Operations'
    },
    {
      type: 'paragraph',
      textKo: '바운딩 박스 클래스는 이 밖에도 렌더러 개발에 필수적인 다양한 편의 메서드를 제공합니다. 예를 들어 어떤 점 `p`가 바운딩 박스 내부에 들어있는지 확인하는 `Inside()` 함수는 점의 각 성분이 `[pMin, pMax]` 범위 안에 있는지만 간단히 확인합니다.',
      textEn: 'We can determine if a point is inside a bounding box by checking if its coordinates are all within the ranges defined by the box extents.'
    },
    {
      type: 'code',
      chunkName: '<<Bounds3 Public Methods>>+=',
      language: 'cpp',
      code: `template <typename T>
bool Inside(Point3<T> p, const Bounds3<T> &b) {
    return (p.x >= b.pMin.x && p.x <= b.pMax.x &&
            p.y >= b.pMin.y && p.y <= b.pMax.y &&
            p.z >= b.pMin.z && p.z <= b.pMax.z);
}

// 박스의 가로, 세로, 높이 대각선 벡터를 구하는 메서드
Vector3<T> Diagonal() const { 
    return pMax - pMin; 
}`,
      explanationKo: 'Inside 함수는 점 p가 3차원 축 각각에 대해 pMin과 pMax 사이에 쏙 들어가는지 검사합니다. Diagonal()은 대각선 벡터를 반환하여 박스의 부피(Volume)나 표면적(Surface Area)을 구할 때 기반이 됩니다.'
    }
  ]
};
