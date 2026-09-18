import { SectionContent } from '../../../../types/book';

export const CH03_03_VECTORS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.3',
  sectionTitle: 'Vectors',
  sectionTitleKo: '3.3 벡터 (Vector): 3차원 방향과 연산',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/Vectors.html',
  prevSection: {
    id: 'ch03-02',
    title: '3.2 n-튜플 기본 클래스와 C++ CRTP 템플릿 설계',
  },
  nextSection: {
    id: 'ch03-04',
    title: '3.4 점 (Point): 3차원 공간 속 위치 모델링',
  },
  summary: {
    keyTakeaways: [
      '벡터(Vector)는 공간에서의 절대적인 위치가 없으며, 오로지 "방향(Direction)"과 "크기(Magnitude)"만을 나타내는 기하학적 개체입니다.',
      '내적(Dot Product) $\\mathbf{v} \\cdot \\mathbf{w} = |\\mathbf{v}||\\mathbf{w}|\\cos\\theta$ 은 두 벡터 사이의 각도 계산과 정사영(Projection) 길이를 구하는 데 사용되며, 그램-슈미트(Gram-Schmidt) 직교화를 통해 수직 벡터 $\\mathbf{v}_\\perp$를 추출할 수 있습니다.',
      '외적(Cross Product) $\\mathbf{v} \\times \\mathbf{w}$ 은 3차원에서 두 벡터 모두에 수직인 새로운 벡터를 생성하며, 그 크기는 두 벡터가 이루는 평행사변형의 넓이 $|\\mathbf{v}||\\mathbf{w}|\\sin\\theta$ 와 같습니다. pbrt는 부동소수점 오차를 최소화하기 위해 고정밀 `DifferenceOfProducts` 함수를 사용하여 외적을 계산합니다.',
      '단 하나의 정규화된 벡터 $\\mathbf{v}_1$이 주어졌을 때, 이에 완벽히 수직인 정규직교기저(ONB) $\\mathbf{v}_2, \\mathbf{v}_3$를 분기문 없이 수치적으로 매우 안정적으로 구성하는 `CoordinateSystem()` 알고리즘(Duff et al. 2017)을 제공합니다.'
    ],
    prerequisites: [
      '3.2절 n-튜플 기본 클래스 (`Tuple2`, `Tuple3`)',
      '선형대수학: 벡터의 내적(Dot Product)과 외적(Cross Product), 정규직교기저(ONB)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '3.3 벡터 (Vectors)',
      titleEn: '3.3 Vectors'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt는 앞서 살펴본 2차원 및 3차원 튜플 기본 클래스를 상속받아 2D 및 3D 벡터 클래스를 정의합니다. 두 벡터 타입 모두 내부 성분의 데이터 타입을 자유롭게 지정할 수 있는 템플릿으로 작성되어 있어, 정수형(`int`)과 부동소수점(`Float`) 벡터를 필요에 따라 손쉽게 인스턴스화할 수 있습니다.',
      textEn: 'pbrt provides both 2D and 3D vector classes that are based on the corresponding two- and three-dimensional tuple classes. Both vector types are themselves parameterized by the type of the underlying vector element, thus making it easy to instantiate vectors of both integer and floating-point types.'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Vector3 Definition>>=',
      code: `template <typename T>
class Vector3 : public Tuple3<Vector3, T> {
  public:
    using Tuple3<Vector3, T>::x;
    using Tuple3<Vector3, T>::y;
    using Tuple3<Vector3, T>::z;

    Vector3() = default;
    Vector3(T x, T y, T z) : Tuple3<pbrt::Vector3, T>(x, y, z) {}

    template <typename U>
    explicit Vector3(Vector3<U> v)
        : Tuple3<pbrt::Vector3, T>(T(v.x), T(v.y), T(v.z)) {}

    template <typename U>
    explicit Vector3(Point3<U> p);

    template <typename U>
    explicit Vector3(Normal3<U> n);
};

// 널리 사용되는 벡터 타입의 별칭(Type Aliases)
using Vector3f = Vector3<Float>;
using Vector3i = Vector3<int>;`
    },
    {
      type: 'paragraph',
      textKo: '`Vector3` 클래스는 다른 타입의 벡터를 받는 변환 생성자뿐만 아니라, 나중에 정의할 `Point3`(점)와 `Normal3`(법선)를 벡터로 명시적으로 형변환할 수 있는 생성자를 제공합니다. 이러한 명시적(`explicit`) 생성자는 의도치 않은 암묵적 형변환으로 인해 발생할 수 있는 버그를 컴파일 타임에 원천 차단합니다.',
      textEn: 'Vector3 provides a few constructors, including a default constructor and one that allows specifying each component value directly. There is also a constructor that takes a Vector3 with a different element type... In addition, Vector3 provides constructors that allow converting instances of Point3 and Normal3 to Vector3s.'
    },
    {
      type: 'figure',
      id: 'fig-3-3',
      number: 'Figure 3.3',
      captionKo: '그림 3.3: (a) 벡터 덧셈: $\\mathbf{u}$의 종점에 $\\mathbf{v}$의 시점을 맞추어 연결하면 합성 벡터 $\\mathbf{u} + \\mathbf{v}$가 형성됩니다. (b) 벡터 뺄셈: $\\mathbf{u} - \\mathbf{v}$는 $\\mathbf{v}$의 종점에서 $\\mathbf{u}$의 종점으로 향하는 벡터와 동일합니다.',
      captionEn: 'Figure 3.3: (a) Vector addition: $\\mathbf{u} + \\mathbf{v}$ is formed by placing the tail of $\\mathbf{v}$ at the head of $\\mathbf{u}$. (b) Vector subtraction: $\\mathbf{u} - \\mathbf{v}$ is the vector from the head of $\\mathbf{v}$ to the head of $\\mathbf{u}$.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f03.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.3.1 벡터의 크기와 정규화 (Vector Length and Normalization)',
      titleEn: '3.3.1 Vector Length and Normalization'
    },
    {
      type: 'paragraph',
      textKo: '벡터의 길이의 제곱을 구하는 `LengthSquared()`와 실제 유클리드 길이를 구하는 `Length()` 함수는 다음과 같이 정의됩니다. 그래픽스에서는 두 벡터의 길이를 단순 비교하거나 정규화 여부를 판별할 때, 제곱근(`std::sqrt`) 연산 비용을 아끼기 위해 `LengthSquared()`를 자주 활용합니다:',
      textEn: 'The squared length of a vector and its Euclidean length are computed by LengthSquared() and Length():'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Vector Inline Functions>>+=',
      code: `template <typename T>
PBRT_CPU_GPU inline auto LengthSquared(Vector3<T> v) {
    return Sqr(v.x) + Sqr(v.y) + Sqr(v.z);
}

template <typename T>
PBRT_CPU_GPU inline auto Length(Vector3<T> v) {
    using std::sqrt;
    return sqrt(LengthSquared(v));
}

// 길이가 1인 단위 벡터로 만드는 정규화(Normalize) 함수
template <typename T>
PBRT_CPU_GPU inline auto Normalize(Vector3<T> v) {
    return v / Length(v);
}`
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.3.2 내적과 외적 (Dot and Cross Products)',
      titleEn: '3.3.2 Dot and Cross Products'
    },
    {
      type: 'paragraph',
      textKo: '두 3차원 벡터 $\\mathbf{v}$와 $\\mathbf{w}$의 **내적(Dot Product, 스칼라곱)**은 각 성분의 곱을 모두 더한 값으로 정의됩니다:',
      textEn: 'The dot product of two vectors $\\mathbf{v}$ and $\\mathbf{w}$ is the sum of the products of their corresponding components:'
    },
    {
      type: 'equation',
      tex: '\\mathbf{v} \\cdot \\mathbf{w} = v_x w_x + v_y w_y + v_z w_z'
    },
    {
      type: 'paragraph',
      textKo: '내적은 기하학적으로 두 벡터의 크기와 그 사잇각 $\\theta$의 코사인 값의 곱과 같습니다: $\\mathbf{v} \\cdot \\mathbf{w} = |\\mathbf{v}||\\mathbf{w}|\\cos\\theta$. 만약 두 벡터가 모두 길이가 1인 단위 벡터라면 내적 값은 단순히 $\\cos\\theta$가 됩니다.',
      textEn: 'The dot product can also be defined geometrically: $\\mathbf{v} \\cdot \\mathbf{w} = ||\\mathbf{v}|| ||\\mathbf{w}|| \\cos\\theta$, where $\\theta$ is the angle between them.'
    },
    {
      type: 'figure',
      id: 'fig-3-4',
      number: 'Figure 3.4',
      captionKo: '그림 3.4: 두 벡터의 내적: 단위 벡터 $\\hat{\\mathbf{w}}$에 대한 임의의 벡터 $\\mathbf{v}$의 정사영(Projection) 길이는 정확히 두 벡터의 내적 $\\mathbf{v} \\cdot \\hat{\\mathbf{w}}$과 일치합니다.',
      captionEn: 'Figure 3.4: The dot product of a vector $\\mathbf{v}$ and a unit vector $\\hat{\\mathbf{w}}$ is equal to the length of the projection of $\\mathbf{v}$ onto $\\hat{\\mathbf{w}}$.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f04.svg',
    },
    {
      type: 'paragraph',
      textKo: '내적의 정사영 성질을 이용하면 임의의 벡터 $\\mathbf{v}$에서 다른 벡터 $\\mathbf{w}$와 평행한 성분을 제거하여, $\\mathbf{w}$에 엄밀히 수직인 성분 $\\mathbf{v}_\\perp$만을 추출하는 **그램-슈미트(Gram-Schmidt) 직교화**를 수행할 수 있습니다:',
      textEn: 'The Gram-Schmidt process uses the projection property of the dot product to compute an orthogonal vector $\\mathbf{v}_\\perp$:'
    },
    {
      type: 'equation',
      tex: '\\mathbf{v}_\\perp = \\mathbf{v} - (\\mathbf{v} \\cdot \\hat{\\mathbf{w}})\\hat{\\mathbf{w}}'
    },
    {
      type: 'figure',
      id: 'fig-3-5',
      number: 'Figure 3.5',
      captionKo: '그림 3.5: 그램-슈미트 직교화: 단위 벡터 $\\hat{\\mathbf{w}}$ 방향으로의 평행 성분 $(\\mathbf{v} \\cdot \\hat{\\mathbf{w}})\\hat{\\mathbf{w}}$을 원래 벡터 $\\mathbf{v}$에서 빼주면, $\\hat{\\mathbf{w}}$에 완벽히 수직인 잔여 벡터 $\\mathbf{v}_\\perp$가 남습니다.',
      captionEn: 'Figure 3.5: The Gram-Schmidt process computes the component of $\\mathbf{v}$ that is perpendicular to a unit vector $\\hat{\\mathbf{w}}$ by subtracting its parallel component.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f05.svg',
    },
    {
      type: 'paragraph',
      textKo: '또 다른 핵심 연산인 **외적(Cross Product, 벡터곱)** $\\mathbf{v} \\times \\mathbf{w}$은 3차원 공간에서 두 벡터 모두에 수직인 새로운 벡터를 만들어냅니다. 성분별 계산 공식은 다음과 같습니다:',
      textEn: 'The cross product is another useful operation for 3D vectors. Given two vectors in 3D, the cross product $\\mathbf{v} \\times \\mathbf{w}$ is a vector that is perpendicular to both of them:'
    },
    {
      type: 'equation',
      tex: '(\\mathbf{v} \\times \\mathbf{w})_x = v_y w_z - v_z w_y, \\quad (\\mathbf{v} \\times \\mathbf{w})_y = v_z w_x - v_x w_z, \\quad (\\mathbf{v} \\times \\mathbf{w})_z = v_x w_y - v_y w_x'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 수치 해석적 안정성: DifferenceOfProducts의 비밀',
      summary: '💡 수치 해석적 안정성: DifferenceOfProducts의 비밀',
      points: [
        {
          title: '핵심 설명',
          content: '부동소수점 연산에서 $a \\\\times b - c \\\\times d$와 같은 곱셈의 차는 두 곱한 값이 서로 매우 비슷할 때 치명적인 **자릿수 소실(Catastrophic Cancellation)** 오차를 유발합니다.\\n\\n과거 pbrt 구버전에서는 이 오차로 인해 광선-표면 교차 계산에서 렌더링 결함(아티팩트)이 발생하여 외적 연산만 부득이하게 `double` 정밀도로 강제 변환하곤 했습니다. 하지만 4판에서는 Kahan의 FMA(Fused Multiply-Add) 기법을 기반으로 한 `DifferenceOfProducts()` 함수를 도입하여, 단정밀도(`float`) 연산만으로도 오차 없이 정확한 외적을 계산하도록 혁신했습니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    },
    {
      type: 'figure',
      id: 'fig-3-6',
      number: 'Figure 3.6',
      captionKo: '그림 3.6: 벡터 $\\mathbf{v}_1$과 $\\mathbf{v}_2$가 이루는 평행사변형의 넓이는 밑변 $|\\mathbf{v}_1|$과 높이 $h = |\\mathbf{v}_2|\\sin\\theta$의 곱인 $|\\mathbf{v}_1 \\times \\mathbf{v}_2|$와 정확히 일치합니다.',
      captionEn: 'Figure 3.6: The area of a parallelogram with edges given by vectors $\\mathbf{v}_1$ and $\\mathbf{v}_2$ is equal to $|\\mathbf{v}_1| h = ||\\mathbf{v}_1 \\times \\mathbf{v}_2||$.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f06.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.3.3 단일 벡터로부터 직교 좌표계 생성 (Coordinate System from a Vector)',
      titleEn: '3.3.3 Coordinate System from a Vector'
    },
    {
      type: 'paragraph',
      textKo: '표면 셰이딩이나 몬테카를로 난수 반구 샘플링을 수행할 때, 단 하나의 단위 법선 벡터 $\\mathbf{v}_1$만이 주어진 상태에서 이에 수직인 로컬 직교 좌표계(정규직교기저 ONB) $\\mathbf{v}_2, \\mathbf{v}_3$를 구축해야 하는 경우가 매우 빈번합니다. pbrt는 Duff et al. (2017)의 최신 논문에 기반한 수치적으로 극도로 안정적인 알고리즘을 구현하여 사용합니다:',
      textEn: 'We will sometimes find it useful to construct a local coordinate system given only a single normalized 3D vector. To do so, we must find two additional normalized vectors such that all three vectors are mutually perpendicular.'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Vector3 Inline Functions>>+=',
      code: `template <typename T>
void CoordinateSystem(Vector3<T> v1, Vector3<T> *v2, Vector3<T> *v3) {
    Float sign = pstd::copysign(Float(1), v1.z);
    Float a = -1 / (sign + v1.z);
    Float b = v1.x * v1.y * a;
    *v2 = Vector3<T>(1 + sign * Sqr(v1.x) * a, sign * b, -sign * v1.x);
    *v3 = Vector3<T>(b, sign + Sqr(v1.y) * a, -v1.y);
}`
    }
  ]
};
