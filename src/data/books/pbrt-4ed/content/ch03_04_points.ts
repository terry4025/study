import { SectionContent } from '../../../../types/book';

export const CH03_04_POINTS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.4',
  sectionTitle: 'Points',
  sectionTitleKo: '3.4 점 (Point): 3차원 공간 속 위치 모델링',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/Points.html',
  prevSection: {
    id: 'ch03-03',
    title: '3.3 벡터 (Vector): 3차원 방향과 연산',
  },
  nextSection: {
    id: 'ch03-05',
    title: '3.5 법선 벡터 (Normals): 표면 미분 기하학',
  },
  summary: {
    keyTakeaways: [
      '점(Point)은 2차원 또는 3차원 공간에서 0차원의 "위치(Position)"를 나타내는 기하학적 요소입니다.',
      '겉으로는 벡터와 동일하게 $(x, y, z)$ 성분으로 표현되지만, 점은 방향성이 없고 원점 대비 절대적 위치를 뜻하므로 허용되는 연산 규칙이 완전히 다릅니다.',
      '아핀 기하학(Affine Geometry)의 연산 규칙을 C++ 타입 시스템에 엄격히 반영하여, 두 점의 뺄셈($p_1 - p_2$)은 점이 아니라 두 위치 사이의 변위인 `Vector3`를 반환하도록 설계되었습니다.',
      '두 점 사이의 거리 계산(`Distance`, `DistanceSquared`)은 두 점의 차이 벡터를 구한 뒤 그 벡터의 길이를 측정하는 방식으로 우아하게 환원됩니다.'
    ],
    prerequisites: [
      '3.1절 아핀 공간과 프레임 개념',
      '3.2절 `Tuple3` 기본 템플릿 구조와 연산자 오버로딩',
      '3.3절 `Vector3` 클래스'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '3.4 점 (Points)',
      titleEn: '3.4 Points'
    },
    {
      type: 'paragraph',
      textKo: '점(Point)은 2차원 또는 3차원 공간에서 크기가 없는 0차원의 "특정한 위치(Location)"를 나타냅니다. pbrt의 `Point2` 및 `Point3` 클래스는 주어진 좌표계에 대한 $x, y, z$ 좌표 성분값을 사용하여 점을 자연스럽게 표현합니다. 비록 벡터와 동일한 내부 표현을 공유하지만, 점은 "위치"를 나타내는 반면 벡터는 "방향과 변위"를 나타낸다는 본질적인 차이로 인해 프로그램 내에서 취급되는 방식이 크게 다릅니다. 본문에서는 점을 기호 $p$로 표기합니다.',
      textEn: 'A point is a zero-dimensional location in 2D or 3D space. The Point2 and Point3 classes in pbrt represent points in the obvious way: using $x$, $y$, $z$ (in 3D) coordinates with respect to a coordinate system. Although the same representation is used for vectors, the fact that a point represents a position whereas a vector represents a direction leads to a number of important differences in how they are treated. Points are denoted in text by $p$.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 C++ 타입 시스템의 묘미: 왜 Tuple3의 operator-를 숨겼을까?',
      summary: '💡 C++ 타입 시스템의 묘미: 왜 Tuple3의 operator-를 숨겼을까?',
      points: [
        {
          title: '핵심 설명',
          content: '부모 클래스 `Tuple3`는 두 튜플을 빼면 당연히 동일한 자식 타입(`Point3 - Point3 = Point3`)을 반환하도록 기본 구현되어 있습니다.\\n\\n하지만 수학적으로 **두 위치(점)를 빼면 그 결과는 두 점 사이의 방향과 거리를 뜻하는 "벡터(Vector)"**가 되어야 합니다! 만약 점을 뺐는데 점이 나온다면 그래픽스 연산에서 심각한 의미론적 오류가 발생합니다.\\n\\n따라서 `Point3` 클래스는 `using Tuple3::operator-`를 고의로 생략하고, `Point3 - Point3 -> Vector3`를 반환하는 전용 연산자를 직접 오버로딩하여 C++ 컴파일러가 기하학적 정합성을 스스로 보장하게 만들었습니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Point3 Definition>>=',
      code: `template <typename T>
class Point3 : public Tuple3<Point3, T> {
  public:
    using Tuple3<Point3, T>::x;
    using Tuple3<Point3, T>::y;
    using Tuple3<Point3, T>::z;
    using Tuple3<Point3, T>::HasNaN;
    using Tuple3<Point3, T>::operator+;
    using Tuple3<Point3, T>::operator+=;
    using Tuple3<Point3, T>::operator*;
    using Tuple3<Point3, T>::operator*=;

    Point3() = default;
    PBRT_CPU_GPU
    Point3(T x, T y, T z) : Tuple3<pbrt::Point3, T>(x, y, z) {}

    PBRT_CPU_GPU
    Point3<T> operator-() const { return {-x, -y, -z}; }

    template <typename U>
    explicit Point3(Point3<U> p)
        : Tuple3<pbrt::Point3, T>(T(p.x), T(p.y), T(p.z)) {}

    template <typename U>
    explicit Point3(Vector3<U> v)
        : Tuple3<pbrt::Point3, T>(T(v.x), T(v.y), T(v.z)) {}

    // 점에 벡터를 더하여 새로운 위치(Point3)를 얻는 연산자
    template <typename U>
    auto operator+(Vector3<U> v) const -> Point3<decltype(T{} + U{})> {
        return {x + v.x, y + v.y, z + v.z};
    }
    template <typename U>
    Point3<T> &operator+=(Vector3<U> v) {
        x += v.x; y += v.y; z += v.z;
        return *this;
    }

    // 점에 벡터를 빼서 반대 방향 위치(Point3)를 얻는 연산자
    template <typename U>
    auto operator-(Vector3<U> v) const -> Point3<decltype(T{} - U{})> {
        return {x - v.x, y - v.y, z - v.z};
    }
    template <typename U>
    Point3<T> &operator-=(Vector3<U> v) {
        x -= v.x; y -= v.y; z -= v.z;
        return *this;
    }

    // 두 점 사이의 변위 벡터(Vector3)를 구하는 뺄셈 연산자
    template <typename U>
    auto operator-(Point3<U> p) const -> Vector3<decltype(T{} - U{})> {
        return {x - p.x, y - p.y, z - p.z};
    }
};

// 자주 쓰이는 타입 별칭
using Point3f = Point3<Float>;
using Point3i = Point3<int>;`
    },
    {
      type: 'paragraph',
      textKo: '어떤 점에 벡터를 더하면 해당 벡터의 방향과 크기만큼 위치를 이동(오프셋)시킨 새로운 점을 얻게 됩니다. 반대로 그림 3.7에 나와 있듯이 두 점 사이의 뺄셈($p\' - p$)을 수행하면, $p$에서 시작하여 $p\'$을 향해 뻗어나가는 변위 벡터 $\\mathbf{v}$를 얻을 수 있습니다.',
      textEn: 'There are certain Point3 methods that either return or take a Vector3. For instance, one can add a vector to a point, offsetting it in the given direction to obtain a new point. Alternately, one can subtract one point from another, obtaining the vector between them, as shown in Figure 3.7.'
    },
    {
      type: 'figure',
      id: 'fig-3-7',
      number: 'Figure 3.7',
      captionKo: '그림 3.7: 두 점 사이의 벡터 구하기: 벡터 $\\mathbf{v} = p\' - p$는 두 점 $p\'$과 $p$의 각 좌표 성분별 뺄셈을 통해 얻어지며, $p$에서 $p\'$으로 향하는 방향과 거리를 완벽하게 나타냅니다.',
      captionEn: 'Figure 3.7: Obtaining the Vector between Two Points. The vector $\\mathbf{v} = p\' - p$ is given by the component-wise subtraction of the points $p\'$ and $p$.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f07.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.4.1 두 점 사이의 거리 계산 (Distance between Points)',
      titleEn: '3.4.1 Distance between Points'
    },
    {
      type: 'paragraph',
      textKo: '3차원 공간에서 두 점 사이의 유클리드 거리는 먼저 두 점을 빼서 둘 사이의 변위 벡터를 구한 뒤, 그 벡터의 길이를 구함으로써 직관적이고 우아하게 계산할 수 있습니다:',
      textEn: 'The distance between two points can be computed by subtracting them to compute the vector between them and then finding the length of that vector.'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Point3 Inline Functions>>=',
      code: `template <typename T>
auto Distance(Point3<T> p1, Point3<T> p2) {
    return Length(p1 - p2);
}

template <typename T>
auto DistanceSquared(Point3<T> p1, Point3<T> p2) {
    return LengthSquared(p1 - p2);
}`
    },
    {
      type: 'paragraph',
      textKo: '광선 추적 알고리즘에서는 광선이 표면과 만나는 충돌점까지의 거리를 비교하거나 반경 검색을 할 때, 제곱근 연산의 비용을 절감하기 위해 `DistanceSquared()`를 광범위하게 사용합니다.',
      textEn: 'The squared distance between two points can be similarly computed using LengthSquared().'
    }
  ]
};
