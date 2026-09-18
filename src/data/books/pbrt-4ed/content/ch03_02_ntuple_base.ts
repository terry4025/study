import { SectionContent } from '../../../../types/book';

export const CH03_02_NTUPLE_BASE: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.2',
  sectionTitle: 'n-Tuple Base Classes',
  sectionTitleKo: '3.2 n-튜플 기본 클래스와 C++ CRTP 템플릿 설계',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/n-Tuple_Base_Classes.html',
  prevSection: {
    id: 'ch03-01',
    title: '3.1 3차원 좌표계와 아핀 공간',
  },
  nextSection: {
    id: 'ch03-03',
    title: '3.3 벡터 (Vector): 3차원 방향과 연산',
  },
  summary: {
    keyTakeaways: [
      '2차원 및 3차원 기하학 개체(벡터, 점, 법선)는 공통적으로 성분별 덧셈, 뺄셈, 스칼라 곱셈 등의 연산을 공유하므로, 코드 중복을 없애기 위해 기본 템플릿 클래스 `Tuple2`와 `Tuple3`를 도입합니다.',
      'C++의 고급 템플릿 기법인 **CRTP(Curiously Recurring Template Pattern, 기묘한 재귀 템플릿 패턴)**를 사용하여, 부모 템플릿인 `Tuple3`가 파생 클래스(예: `Vector3`, `Point3`)의 타입을 템플릿 템플릿 인자로 전달받아 파생 클래스 타입 자체를 반환하도록 설계되었습니다.',
      '수학적 기본 단위에서는 전통적인 객체지향 캡슐화(`getX()`, `setX()`)를 버리고 멤버 변수 `x, y, z`를 `public`으로 공개하여 코드 가독성과 접근 직관성을 극대화했습니다.',
      '`operator+` 연산자는 `decltype(T{} + U{})`를 활용하여 C++ 표준 산술 타입 승격(Type Promotion) 규칙을 그대로 따르므로, 정수 벡터와 실수 벡터 간의 연산 결과를 올바른 실수 벡터 타입으로 자연스럽게 생성합니다.'
    ],
    prerequisites: [
      'C++ 템플릿(Templates) 및 연산자 오버로딩 기초',
      '부동소수점 NaN(Not a Number)의 개념과 디버깅'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '3.2 n-튜플 기본 클래스 (n-Tuple Base Classes)',
      titleEn: '3.2 n-Tuple Base Classes'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt는 2차원 및 3차원의 점, 벡터, 법선 벡터 등을 표현하기 위해 여러 다양한 데이터 타입을 정의합니다. 이 클래스들은 각자 고유한 기하학적 의미와 제약 조건을 가지고 있지만, 성분별 덧셈, 뺄셈, 스칼라 곱셈 및 나눗셈과 같은 수많은 공통적인 산술 연산들을 공유합니다. 이러한 코드의 불필요한 중복을 방지하기 위해, pbrt는 파생 클래스들에게 풍부한 기능을 상속해 주는 템플릿 기반 클래스인 `Tuple2`와 `Tuple3`를 제공합니다.',
      textEn: 'pbrt defines a number of classes to represent two- and three-dimensional points, vectors, and normal vectors. While each of these classes has distinct geometric semantics, they also share many common operations, such as component-wise addition and subtraction, scalar multiplication and division, and so on. To avoid duplicating code across these classes, pbrt provides template base classes, Tuple2 and Tuple3, that provide this functionality to their derived classes.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 컴공 고급 테크닉: CRTP(Curiously Recurring Template Pattern)란?',
      summary: '💡 컴공 고급 테크닉: CRTP(Curiously Recurring Template Pattern)란?',
      points: [
        {
          title: '핵심 설명',
          content: 'C++에서 가상 함수(`virtual`)를 통한 다형성은 런타임에 vtable 포인터를 거쳐야 하므로 수억 번 호출되는 3D 벡터 연산에 엄청난 성능 저하(오버헤드)를 유발합니다.\\n\\nCRTP는 **컴파일 타임에 정적 다형성**을 달성하는 기법입니다:\\n```cpp\\ntemplate <template <typename> class Child, typename T>\\nclass Tuple3 { ... };\\n\\n// 파생 클래스가 자기 자신을 부모 템플릿의 인자로 넘김!\\nclass Vector3 : public Tuple3<Vector3, Float> { ... };\\n```\\n이렇게 하면 부모 클래스인 `Tuple3` 안에서 덧셈 연산자를 정의할 때, 부모 타입(`Tuple3`)이 아니라 **실제 자식 타입(`Vector3`)을 반환값으로 즉시 리턴**할 수 있습니다. 가상 함수 비용 없이 컴파일 타임 인라이닝과 엄격한 타입 안전성을 동시에 확보하는 현대 C++의 강력한 패턴입니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    },
    {
      type: 'paragraph',
      textKo: '아래는 3차원 튜플 기본 클래스인 `Tuple3`의 전체 선언입니다. 이 클래스는 두 개의 템플릿 매개변수를 가집니다. 첫 번째는 자신을 상속받을 파생 클래스를 나타내는 템플릿 템플릿 매개변수 `Child`이며, 두 번째는 성분들의 원소 데이터 타입(예: `Float`, `int`)을 지정하는 `T`입니다.',
      textEn: 'Here is the definition of the Tuple3 base class. It is parameterized by both a template template parameter Child, which represents the derived class, and a type T, which is the type of the components of the tuple:'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Tuple3 Definition>>=',
      code: `template <template <typename> class Child, typename T>
class Tuple3 {
  public:
    // Tuple3 Public Methods
    Tuple3() = default;
    Tuple3(T x, T y, T z) : x(x), y(y), z(z) { DCHECK(!HasNaN()); }

    bool HasNaN() const { return IsNaN(x) || IsNaN(y) || IsNaN(z); }

    T operator[](int i) const {
        DCHECK(i >= 0 && i <= 2);
        if (i == 0) return x;
        if (i == 1) return y;
        return z;
    }
    T &operator[](int i) {
        DCHECK(i >= 0 && i <= 2);
        if (i == 0) return x;
        if (i == 1) return y;
        return z;
    }

    template <typename U>
    auto operator+(Child<U> c) const -> Child<decltype(T{} + U{})> {
        return {x + c.x, y + c.y, z + c.z};
    }

    template <typename U>
    Child<T> &operator+=(Child<U> c) {
        x += c.x; y += c.y; z += c.z;
        return static_cast<Child<T> &>(*this);
    }

    template <typename U>
    auto operator*(U s) const -> Child<decltype(T{} * U{})> {
        return {x * s, y * s, z * s};
    }

    template <typename U>
    Child<T> &operator*=(U s) {
        DCHECK(!IsNaN(s));
        x *= s; y *= s; z *= s;
        return static_cast<Child<T> &>(*this);
    }

    template <typename U>
    auto operator/(U d) const -> Child<decltype(T{} / U{})> {
        DCHECK_NE(d, 0);
        return {x / d, y / d, z / d};
    }

    PBRT_CPU_GPU
    Child<T> operator-() const { return {-x, -y, -z}; }

    // Tuple3 Public Members
    T x{}, y{}, z{};
};`
    },
    {
      type: 'paragraph',
      textKo: '기본 생성자에서 $(x, y, z)$ 값은 각 타입의 기본값(0)으로 자동 초기화됩니다. 사용자가 직접 세 성분값을 제공하는 생성자에서는 `DCHECK(!HasNaN())` 매크로를 호출하여 부동소수점의 "숫자가 아님(NaN, Not a Number)" 오류가 침투하지 않았는지 엄격하게 검증합니다. 릴리스 최적화 빌드에서는 이 매크로가 완전히 제거되어 런타임 오버헤드가 전혀 발생하지 않습니다. NaN은 그래픽스 연산에서 거의 확실한 치명적 버그를 뜻하므로, 발생한 즉시 조기에 포착하는 것이 디버깅에 결정적입니다.',
      textEn: 'By default, the $(x, y, z)$ values are set to zero, although the user of the class can optionally supply values for each of the components. If the user does supply values, the constructor checks that none of them has the floating-point "not a number" (NaN) value using the DCHECK() macro. When compiled in optimized mode, this macro disappears from the compiled code, saving the expense of verifying this case.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 객체지향 설계의 실용적 타협: 캡슐화 vs 퍼블릭 멤버',
      summary: '💡 객체지향 설계의 실용적 타협: 캡슐화 vs 퍼블릭 멤버',
      points: [
        {
          title: '핵심 설명',
          content: '전통적인 OOP(객체지향 프로그래밍) 강의에서는 모든 멤버 변수를 `private`으로 감추고 `getX()`, `setX()` 게터/세터를 만드는 것이 미덕이라고 가르칩니다.\\n\\n하지만 수학적 튜플이나 3D 벡터는 그 자체로 $(x, y, z)$ 데이터의 투명한 묶음입니다. 여기에 접근자 메서드를 강제하면 수천 줄의 셰이딩 및 교차 검사 코드에서 `v.getX() * n.getY()`와 같이 코드가 극도로 장황해질 뿐, 얻을 수 있는 설계적 이점(정보 은닉)이 전무합니다. pbrt 제작진은 실용적인 엔지니어링 관점에서 `x, y, z`를 직접 노출하는 직관적이고 간결한 설계를 채택했습니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    },
    {
      type: 'paragraph',
      textKo: '성분별 배열 인덱싱을 지원하기 위해 `operator[]` 연산자가 `const` 버전과 비-`const` 버전 두 가지로 제공됩니다. 비-`const` 버전은 참조(`T&`)를 반환하므로 `v[0] = 5.0f;`와 같이 루프 문 안에서 성분을 직관적으로 수정할 수 있습니다.',
      textEn: 'The tuple classes also provide a C++ operator to index into the components so that, given an instance v, v[0] == v.x and so forth. If the tuple type is non-const, then indexing returns a reference, allowing components of the tuple to be set.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.2.1 연산자 오버로딩과 타입 승격 규칙',
      titleEn: '3.2.1 Operator Overloading and Type Promotion'
    },
    {
      type: 'paragraph',
      textKo: '`Tuple3`의 산술 연산자 구현 코드는 매우 정교하게 작성되어 있습니다. 예를 들어 두 개의 3-튜플을 더하는 덧셈 연산자(`operator+`)를 살펴보겠습니다:',
      textEn: 'We can now turn to the implementation of arithmetic operations that operate on the values stored in a tuple. Their code is fairly dense. For example, here is the method that adds together two three-tuples of some type:'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Tuple3 Public Methods>>+=',
      code: `template <typename U>
auto operator+(Child<U> c) const -> Child<decltype(T{} + U{})> {
    return {x + c.x, y + c.y, z + c.z};
}`
    },
    {
      type: 'paragraph',
      textKo: '이 구현에는 주목해야 할 중요한 컴공 설계 원칙들이 담겨 있습니다. 첫째, 매개변수 타입이 `Tuple3`가 아닌 `Child<U>`로 제한되어 있습니다. 만약 매개변수를 부모 타입인 `Tuple3`로 받았다면 `Vector3 + Point3`와 같이 수학적으로 말이 안 되는 덧셈이 암묵적으로 허용되는 끔찍한 버그가 발생했을 것입니다. 오직 동일한 파생 클래스끼리만 덧셈이 허용됩니다.',
      textEn: 'There are a few things to note in the implementation of operator+. By virtue of being a template method based on another type U, it supports adding two elements of the same Child template type, though they may use different types for storing their components (T and U in the code here). However, because the base type of the method\'s parameter is Child, it is only possible to add two values of the same child type using this method.'
    },
    {
      type: 'paragraph',
      textKo: '둘째, 함수의 후행 반환 형식(Trailing Return Type)인 `-> Child<decltype(T{} + U{})>`는 C++의 표준 산술 타입 승격(Type Promotion) 규칙을 완벽하게 따릅니다. 예를 들어 정수 성분을 가진 `Vector3<int>`와 실수 성분을 가진 `Vector3<float>`를 더하면, `int + float`의 결과 타입인 `float`가 자동으로 계산되어 `Vector3<float>`가 정확히 반환됩니다.',
      textEn: 'Finally, the component type of the returned type is determined based on the type of an expression adding values of types T and U. Thus, this method follows C++\'s standard type promotion rules: if a Vector3 that stored integer values is added to one that stores Floats, the result is a Vector3 storing Floats.'
    },
    {
      type: 'paragraph',
      textKo: '`Tuple2` 및 `Tuple3` 클래스는 이 외에도 렌더링 파이프라인 전반에서 유용하게 쓰이는 풍부한 보조 유틸리티 함수들을 제공합니다:',
      textEn: 'The full list of capabilities provided by Tuple2 and Tuple3 is:'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 Tuple이 제공하는 핵심 수학 유틸리티 요약',
      summary: '💡 Tuple이 제공하는 핵심 수학 유틸리티 요약',
      points: [
        {
          title: '핵심 설명',
          content: '- `Abs(a)`: 각 성분의 절댓값 튜플 반환\\n- `Ceil(a)`, `Floor(a)`: 각 성분을 가장 가까운 정수로 올림/내림한 튜플 반환\\n- `Lerp(t, a, b)`: 두 튜플 간의 선형 보간 $(1-t)a + tb$ 계산\\n- `FMA(a, b, c)`: 하드웨어 가속 FMA(Fused Multiply-Add)를 적용한 $a \\\\times b + c$ 고정밀 성분별 연산\\n- `Min(a, b)`, `Max(a, b)`: 두 튜플의 성분별 최소/최댓값\\n- `MinComponentValue(a)`, `MaxComponentValue(a)`: 튜플 내부 성분 중 가장 작거나 큰 스칼라 값\\n- `MinComponentIndex(a)`, `MaxComponentIndex(a)`: 가장 작거나 큰 성분의 인덱스(0, 1, 2)\\n- `Permute(a, p)`: 지정된 순서대로 성분의 위치를 재배열한 튜플 반환\\n- `HProd(a)`: 모든 성분의 수평 곱($x \\\\times y \\\\times z$) 계산'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    }
  ]
};
