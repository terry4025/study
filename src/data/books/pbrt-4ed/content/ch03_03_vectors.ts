import type { SectionContent } from '../../../../types/book';

export const CH03_03_VECTORS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "3",
  "chapterTitleKo": "제3장 기하학과 3차원 변환 (Geometry & Transformations)",
  "sectionNumber": "3.3",
  "sectionTitle": "Vectors",
  "sectionTitleKo": "3.3 벡터 (Vector): 3차원 방향과 연산",
  "originalUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Vectors.html",
  "prevSection": {
    "id": "ch03-02",
    "title": "3.2 n-튜플 기본 클래스와 C++ CRTP 템플릿 설계"
  },
  "nextSection": {
    "id": "ch03-04",
    "title": "3.4 점 (Point): 3차원 공간 속 위치 모델링"
  },
  "summary": {
    "keyTakeaways": [
      "벡터(Vector)는 공간에서의 절대적인 위치가 없으며, 오로지 \"방향(Direction)\"과 \"크기(Magnitude)\"만을 나타내는 기하학적 개체입니다.",
      "내적(Dot Product) $\\mathbf{v} \\cdot \\mathbf{w} = |\\mathbf{v}||\\mathbf{w}|\\cos\\theta$ 은 두 벡터 사이의 각도 계산과 정사영(Projection) 길이를 구하는 데 사용되며, 그램-슈미트(Gram-Schmidt) 직교화를 통해 수직 벡터 $\\mathbf{v}_\\perp$를 추출할 수 있습니다.",
      "외적(Cross Product) $\\mathbf{v} \\times \\mathbf{w}$ 은 3차원에서 두 벡터 모두에 수직인 새로운 벡터를 생성하며, 그 크기는 두 벡터가 이루는 평행사변형의 넓이 $|\\mathbf{v}||\\mathbf{w}|\\sin\\theta$ 와 같습니다. pbrt는 부동소수점 오차를 최소화하기 위해 고정밀 `DifferenceOfProducts` 함수를 사용하여 외적을 계산합니다.",
      "단 하나의 정규화된 벡터 $\\mathbf{v}_1$이 주어졌을 때, 이에 완벽히 수직인 정규직교기저(ONB) $\\mathbf{v}_2, \\mathbf{v}_3$를 분기문 없이 수치적으로 매우 안정적으로 구성하는 `CoordinateSystem()` 알고리즘(Duff et al. 2017)을 제공합니다."
    ],
    "prerequisites": [
      "3.2절 n-튜플 기본 클래스 (`Tuple2`, `Tuple3`)",
      "선형대수학: 벡터의 내적(Dot Product)과 외적(Cross Product), 정규직교기저(ONB)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "3.3 벡터 (Vectors)",
      "titleEn": "3.3 Vectors",
      "id": "ch03-03-b1"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt는 앞서 살펴본 2차원 및 3차원 튜플 기본 클래스를 상속받아 2D 및 3D 벡터 클래스를 정의합니다. 두 벡터 타입 모두 내부 성분의 데이터 타입을 자유롭게 지정할 수 있는 템플릿으로 작성되어 있어, 정수형(`int`)과 부동소수점(`Float`) 벡터를 필요에 따라 손쉽게 인스턴스화할 수 있습니다.",
      "textEn": "pbrt provides both 2D and 3D vector classes that are based on the corresponding two- and three-dimensional tuple classes. Both vector types are themselves parameterized by the type of the underlying vector element, thus making it easy to instantiate vectors of both integer and floating-point types.",
      "id": "ch03-03-b2"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Vector3 Definition>>=",
      "code": "template <typename T>\nclass Vector3 : public Tuple3<Vector3, T> {\n  public:\n    using Tuple3<Vector3, T>::x;\n    using Tuple3<Vector3, T>::y;\n    using Tuple3<Vector3, T>::z;\n\n    Vector3() = default;\n    Vector3(T x, T y, T z) : Tuple3<pbrt::Vector3, T>(x, y, z) {}\n\n    template <typename U>\n    explicit Vector3(Vector3<U> v)\n        : Tuple3<pbrt::Vector3, T>(T(v.x), T(v.y), T(v.z)) {}\n\n    template <typename U>\n    explicit Vector3(Point3<U> p);\n\n    template <typename U>\n    explicit Vector3(Normal3<U> n);\n};\n\n// 널리 사용되는 벡터 타입의 별칭(Type Aliases)\nusing Vector3f = Vector3<Float>;\nusing Vector3i = Vector3<int>;",
      "provenance": "teaching",
      "id": "ch03-03-b3"
    },
    {
      "type": "paragraph",
      "textKo": "`Vector3` 클래스는 다른 타입의 벡터를 받는 변환 생성자뿐만 아니라, 나중에 정의할 `Point3`(점)와 `Normal3`(법선)를 벡터로 명시적으로 형변환할 수 있는 생성자를 제공합니다. 이러한 명시적(`explicit`) 생성자는 의도치 않은 암묵적 형변환으로 인해 발생할 수 있는 버그를 컴파일 타임에 원천 차단합니다.",
      "textEn": "Vector3 provides a few constructors, including a default constructor and one that allows specifying each component value directly. There is also a constructor that takes a Vector3 with a different element type... In addition, Vector3 provides constructors that allow converting instances of Point3 and Normal3 to Vector3s.",
      "id": "ch03-03-b4"
    },
    {
      "type": "figure",
      "id": "fig-3-3",
      "number": "Figure 3.3",
      "title": "Original Figure 3.3",
      "titleKo": "원문 그림 3.3",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-3.png",
      "captionKo": "그림 3.3 · 두 벡터의 합은 두 벡터가 만드는 평행사변형의 대각선입니다. 더하는 순서를 바꾸어도 같은 결과를 얻습니다.",
      "captionEn": "Figure 3.3: (a) Vector addition: bold v plus bold w . (b) Notice that the sum bold v plus bold w forms the diagonal of the parallelogram formed by bold v and bold w , which shows the commutativity of vector addition: bold v plus bold w equals bold w plus bold v .",
      "width": 998,
      "height": 217,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Vectors.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.3.1 벡터의 크기와 정규화 (Vector Length and Normalization)",
      "titleEn": "3.3.1 Vector Length and Normalization",
      "id": "ch03-03-b6"
    },
    {
      "type": "paragraph",
      "textKo": "벡터의 길이의 제곱을 구하는 `LengthSquared()`와 실제 유클리드 길이를 구하는 `Length()` 함수는 다음과 같이 정의됩니다. 그래픽스에서는 두 벡터의 길이를 단순 비교하거나 정규화 여부를 판별할 때, 제곱근(`std::sqrt`) 연산 비용을 아끼기 위해 `LengthSquared()`를 자주 활용합니다:",
      "textEn": "The squared length of a vector and its Euclidean length are computed by LengthSquared() and Length():",
      "id": "ch03-03-b7"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Vector Inline Functions>>+=",
      "code": "template <typename T>\nPBRT_CPU_GPU inline auto LengthSquared(Vector3<T> v) {\n    return Sqr(v.x) + Sqr(v.y) + Sqr(v.z);\n}\n\ntemplate <typename T>\nPBRT_CPU_GPU inline auto Length(Vector3<T> v) {\n    using std::sqrt;\n    return sqrt(LengthSquared(v));\n}\n\n// 길이가 1인 단위 벡터로 만드는 정규화(Normalize) 함수\ntemplate <typename T>\nPBRT_CPU_GPU inline auto Normalize(Vector3<T> v) {\n    return v / Length(v);\n}",
      "provenance": "teaching",
      "id": "ch03-03-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.3.2 내적과 외적 (Dot and Cross Products)",
      "titleEn": "3.3.2 Dot and Cross Products",
      "id": "ch03-03-b9"
    },
    {
      "type": "paragraph",
      "textKo": "두 3차원 벡터 $\\mathbf{v}$와 $\\mathbf{w}$의 **내적(Dot Product, 스칼라곱)**은 각 성분의 곱을 모두 더한 값으로 정의됩니다:",
      "textEn": "The dot product of two vectors $\\mathbf{v}$ and $\\mathbf{w}$ is the sum of the products of their corresponding components:",
      "id": "ch03-03-b10"
    },
    {
      "type": "equation",
      "tex": "\\mathbf{v} \\cdot \\mathbf{w} = v_x w_x + v_y w_y + v_z w_z",
      "id": "ch03-03-b11"
    },
    {
      "type": "paragraph",
      "textKo": "내적은 기하학적으로 두 벡터의 크기와 그 사잇각 $\\theta$의 코사인 값의 곱과 같습니다: $\\mathbf{v} \\cdot \\mathbf{w} = |\\mathbf{v}||\\mathbf{w}|\\cos\\theta$. 만약 두 벡터가 모두 길이가 1인 단위 벡터라면 내적 값은 단순히 $\\cos\\theta$가 됩니다.",
      "textEn": "The dot product can also be defined geometrically: $\\mathbf{v} \\cdot \\mathbf{w} = ||\\mathbf{v}|| ||\\mathbf{w}|| \\cos\\theta$, where $\\theta$ is the angle between them.",
      "id": "ch03-03-b12"
    },
    {
      "type": "figure",
      "id": "fig-3-4",
      "number": "Figure 3.4",
      "title": "Original Figure 3.4",
      "titleKo": "원문 그림 3.4",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-4.png",
      "captionKo": "그림 3.4 · 벡터의 뺄셈을 그림으로 표현합니다. 두 벡터 끝점 사이의 차이와 평행사변형의 대각선을 이용해 뺄셈의 방향을 확인할 수 있습니다.",
      "captionEn": "Figure 3.4: (a) Vector subtraction. (b) If we consider the parallelogram formed by two vectors, the diagonals are given by bold w minus bold v (dashed line) and negative bold v minus bold w (not shown).",
      "width": 998,
      "height": 270,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Vectors.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "Gram–Schmidt 과정은 벡터에서 다른 방향으로의 투영을 빼 수직 성분을 구합니다. `v - Dot(v,w)*w` 형태는 w가 단위 벡터일 때입니다. v와 w가 평행하면 결과가 0이므로 정규 직교 기저를 만들 때는 별도 처리가 필요합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-03-b14"
    },
    {
      "type": "equation",
      "tex": "\\mathbf{v}_\\perp = \\mathbf{v} - (\\mathbf{v} \\cdot \\hat{\\mathbf{w}})\\hat{\\mathbf{w}}",
      "id": "ch03-03-b15"
    },
    {
      "type": "figure",
      "id": "fig-3-5",
      "number": "Figure 3.5",
      "title": "Original Figure 3.5",
      "titleKo": "원문 그림 3.5",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-5.png",
      "captionKo": "그림 3.5 · 단위 벡터 ŵ에 v를 정사영한 vₒ는 ŵ와 평행합니다. 원래 벡터에서 투영을 뺀 v−vₒ는 ŵ에 수직입니다.",
      "captionEn": "Figure 3.5: The orthogonal projection of a vector bold v onto a normalized vector ModifyingAbove bold w With bold caret gives a vector bold v Subscript normal o that is parallel to ModifyingAbove bold w With bold caret . The difference vector, bold v minus bold v Subscript normal o , shown here as a dashed line, is perpendicular to ModifyingAbove bold w With bold caret .",
      "width": 998,
      "height": 182,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Vectors.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "또 다른 핵심 연산인 **외적(Cross Product, 벡터곱)** $\\mathbf{v} \\times \\mathbf{w}$은 3차원 공간에서 두 벡터 모두에 수직인 새로운 벡터를 만들어냅니다. 성분별 계산 공식은 다음과 같습니다:",
      "textEn": "The cross product is another useful operation for 3D vectors. Given two vectors in 3D, the cross product $\\mathbf{v} \\times \\mathbf{w}$ is a vector that is perpendicular to both of them:",
      "id": "ch03-03-b17"
    },
    {
      "type": "equation",
      "tex": "(\\mathbf{v} \\times \\mathbf{w})_x = v_y w_z - v_z w_y, \\quad (\\mathbf{v} \\times \\mathbf{w})_y = v_z w_x - v_x w_z, \\quad (\\mathbf{v} \\times \\mathbf{w})_z = v_x w_y - v_y w_x",
      "id": "ch03-03-b18"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "가까운 두 곱의 차이는 정확도에 주의합니다",
      "summary": "가까운 두 곱의 차이는 정확도에 주의합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "a*b와 c*d가 거의 같으면 각각 반올림된 값을 뺄 때 상대 오차가 커질 수 있습니다. DifferenceOfProducts는 FMA 등을 이용해 곱에서 생긴 오차를 보상합니다. 실수 연산을 모든 입력에서 오차 없이 수행한다는 뜻은 아닙니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "PBRT"
      ],
      "id": "ch03-03-b19"
    },
    {
      "type": "figure",
      "id": "fig-3-6",
      "number": "Figure 3.6",
      "title": "Original Figure 3.6",
      "titleKo": "원문 그림 3.6",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-6.png",
      "captionKo": "그림 3.6 · 두 변 벡터의 외적 길이는 평행사변형의 넓이입니다. 밑변 길이와 높이의 곱은 두 벡터 길이와 사이각의 사인 값을 곱한 것과 같습니다.",
      "captionEn": "Figure 3.6: The area of a parallelogram with edges given by vectors bold v bold 1 and bold v bold 2 is equal to double-vertical-bar bold v bold 1 double-vertical-bar h . From Equation ( 3.3 ), the length of the cross product of bold v bold 1 and bold v bold 2 is equal to the product of the two vector lengths times the sine of the angle between them—the parallelogram area.",
      "width": 998,
      "height": 262,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Vectors.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.3.3 단일 벡터로부터 직교 좌표계 생성 (Coordinate System from a Vector)",
      "titleEn": "3.3.3 Coordinate System from a Vector",
      "id": "ch03-03-b21"
    },
    {
      "type": "paragraph",
      "textKo": "표면 셰이딩이나 몬테카를로 난수 반구 샘플링을 수행할 때, 단 하나의 단위 법선 벡터 $\\mathbf{v}_1$만이 주어진 상태에서 이에 수직인 로컬 직교 좌표계(정규직교기저 ONB) $\\mathbf{v}_2, \\mathbf{v}_3$를 구축해야 하는 경우가 매우 빈번합니다. pbrt는 Duff et al. (2017)의 최신 논문에 기반한 수치적으로 극도로 안정적인 알고리즘을 구현하여 사용합니다:",
      "textEn": "We will sometimes find it useful to construct a local coordinate system given only a single normalized 3D vector. To do so, we must find two additional normalized vectors such that all three vectors are mutually perpendicular.",
      "id": "ch03-03-b22"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Vector3 Inline Functions>>+=",
      "code": "template <typename T>\nvoid CoordinateSystem(Vector3<T> v1, Vector3<T> *v2, Vector3<T> *v3) {\n    Float sign = pstd::copysign(Float(1), v1.z);\n    Float a = -1 / (sign + v1.z);\n    Float b = v1.x * v1.y * a;\n    *v2 = Vector3<T>(1 + sign * Sqr(v1.x) * a, sign * b, -sign * v1.x);\n    *v3 = Vector3<T>(b, sign + Sqr(v1.y) * a, -v1.y);\n}",
      "provenance": "teaching",
      "id": "ch03-03-b23"
    }
  ],
  "audit": {
    "checkedSourceSha256": "1a3dedf0654bb6e8ff7cda73e15b4da633258280648dad251588c388a09a9fee",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "3.3 Vectors",
      "3.3.1  Normalization and Vector Length",
      "3.3.2  Dot and Cross Product",
      "3.3.3  Coordinate System from a Vector"
    ],
    "sourceFigures": [
      "3.3",
      "3.4",
      "3.5",
      "3.6"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
