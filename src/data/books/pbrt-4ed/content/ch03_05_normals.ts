import { SectionContent } from '../../../../types/book';

export const CH03_05_NORMALS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.5',
  sectionTitle: 'Normals',
  sectionTitleKo: '3.5 법선 벡터 (Normal): 표면의 수직 방향',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/Normals.html',
  prevSection: {
    id: 'ch03-04',
    title: '3.4 점 (Point): 3차원 공간 속 위치 모델링',
  },
  nextSection: {
    id: 'ch03-06',
    title: '3.6 광선 (Ray): 빛의 이동 경로와 파라메트릭 방정식',
  },
  summary: {
    keyTakeaways: [
      '표면 법선(Surface Normal)은 3차원 공간에서 물체 표면의 특정 위치에 엄밀히 수직(Perpendicular)인 기하학적 벡터입니다.',
      '겉보기에는 일반 벡터와 같아 보이지만, 법선은 "표면 접평면(Tangent Plane)과의 수직 관계"로 정의되는 미분 기하학적 개체이므로, 3차원 변환(특히 비균등 스케일링)을 적용할 때 일반 벡터와 완전히 다르게 변환되어야 합니다.',
      '용어상의 주의점: "법선(Normal)"이라고 해서 항상 길이가 1로 정규화(Normalized)되어 있음을 의미하지는 않습니다. 필요에 따라 명시적으로 `Normalize()`를 호출해야 합니다.',
      '`FaceForward(n, v)`는 렌더링에서 광선이 물체 표면의 앞면 혹은 뒷면 중 어디에서 입사했는지에 따라 법선 벡터를 같은 반구 방향으로 정렬(반전)해 주는 필수 유틸리티입니다.'
    ],
    prerequisites: [
      '3.3절 벡터 연산과 내적/외적',
      '미분기하학 기초: 표면의 접평면(Tangent Plane)과 수직 벡터'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '3.5 법선 벡터 (Normals)',
      titleEn: '3.5 Normals'
    },
    {
      type: 'paragraph',
      textKo: '표면 법선(Surface Normal, 또는 단순히 법선)은 물체 표면의 특정 위치에 수직(Orthogonal)인 벡터입니다. 수학적으로 법선은 해당 위치에서 표면에 접하는 임의의 평행하지 않은 두 접벡터(Tangent Vectors)의 외적(Cross Product)으로 엄밀하게 정의할 수 있습니다. 겉으로 보기에 법선은 일반 벡터와 거의 똑같아 보이지만, 두 개체를 명확하게 구분하는 것은 그래픽스 엔진 설계에서 매우 중요합니다. 법선은 특정한 표면과의 기하학적 상대 관계에 의해 정의되기 때문에, 3차원 기하학 변환(특히 비균등 크기 조절)을 적용할 때 일반 방향 벡터와 완전히 다르게 동작하기 때문입니다(이 차이는 3.10절에서 자세히 증명합니다).',
      textEn: 'A surface normal (or just normal) is a vector that is perpendicular to a surface at a particular position. It can be defined as the cross product of any two nonparallel vectors that are tangent to the surface at a point. Although normals are superficially similar to vectors, it is important to distinguish between the two of them: because normals are defined in terms of their relationship to a particular surface, they behave differently than vectors in some situations, particularly when applying transformations. (That difference is discussed in Section 3.10.)'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 컴공 상식: 왜 법선(Normal)을 일반 벡터로 다루면 안 될까?',
      summary: '💡 컴공 상식: 왜 법선(Normal)을 일반 벡터로 다루면 안 될까?',
      points: [
        {
          title: '핵심 설명',
          content: '원을 $x$축 방향으로 2배 늘려 타원을 만든다고 상상해 보세요.\\n- 원 위의 접벡터는 $x$축 방향으로 늘어나며 기울기가 완만해집니다.\\n- 하지만 만약 표면 수직 법선 벡터를 접벡터와 똑같이 $x$축으로 2배 늘려버리면, **변형된 타원 표면과의 수직성($\\\\mathbf{n} \\\\cdot \\\\mathbf{t} = 0$)이 완전히 깨져버립니다!**\\n\\n법선 벡터가 변형 후에도 표면에 항상 수직을 유지하려면, 일반 변환 행렬 $M$이 아니라 **역행렬의 전치 행렬($M^{-T}$)**을 곱해주어야만 합니다. pbrt가 `Normal3` 타입을 별도로 둔 이유가 바로 이 변환 규칙의 오류를 원천 차단하기 위함입니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Normal3 Definition>>=',
      code: `template <typename T>
class Normal3 : public Tuple3<Normal3, T> {
  public:
    using Tuple3<Normal3, T>::x;
    using Tuple3<Normal3, T>::y;
    using Tuple3<Normal3, T>::z;
    using Tuple3<Normal3, T>::HasNaN;
    using Tuple3<Normal3, T>::operator+;
    using Tuple3<Normal3, T>::operator*;
    using Tuple3<Normal3, T>::operator*=;

    Normal3() = default;
    PBRT_CPU_GPU
    Normal3(T x, T y, T z) : Tuple3<pbrt::Normal3, T>(x, y, z) {}

    template <typename U>
    PBRT_CPU_GPU explicit Normal3<T>(Normal3<U> v)
        : Tuple3<pbrt::Normal3, T>(T(v.x), T(v.y), T(v.z)) {}

    template <typename U>
    explicit Normal3<T>(Vector3<U> v)
        : Tuple3<pbrt::Normal3, T>(T(v.x), T(v.y), T(v.z)) {}
};

using Normal3f = Normal3<Float>;`
    },
    {
      type: 'paragraph',
      textKo: '`Normal3`의 구현은 `Vector3`와 매우 유사합니다. 벡터와 마찬가지로 세 개의 성분 $x, y, z$로 표현되며, 성분별 덧셈과 뺄셈, 스칼라 곱셈, 정규화 연산을 지원합니다. 그러나 수학적으로 법선은 점에 더해질 수 없으며, 두 법선 사이의 외적은 기하학적으로 정의되지 않습니다. 또한 서양 수학 용어의 다의성으로 인해 혼란스러울 수 있는데, **"법선(Normal)"이라고 해서 그 크기가 반드시 1로 정규화(Normalized)되어 있는 것은 아닙니다**.',
      textEn: 'The implementations of Normal3s and Vector3s are very similar. Like vectors, normals are represented by three components x, y, and z; they can be added and subtracted to compute new normals; and they can be scaled and normalized. However, a normal cannot be added to a point, and one cannot take the cross product of two normals. Note that, in an unfortunate turn of terminology, normals are not necessarily normalized.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.5.1 FaceForward 유틸리티 함수',
      titleEn: '3.5.1 The FaceForward Utility Function'
    },
    {
      type: 'paragraph',
      textKo: '렌더링을 구현하다 보면, 표면에서 출발하는 반사 광선이나 시선 벡터와 동일한 반구(Hemisphere)를 향하도록 표면 법선의 방향을 반전시켜야 하는 경우가 매우 빈번합니다. 예를 들어 얇은 잎사귀나 유리 표면의 양면을 렌더링할 때, 광선이 뒷면에서 들어왔다면 법선도 반대편을 바라보도록 뒤집어주어야 정확한 셰이딩 계산이 가능합니다. `FaceForward()` 함수는 이 간결하지만 필수적인 연산을 캡슐화합니다:',
      textEn: 'One new operation to implement comes from the fact that it is often necessary to flip a surface normal so it lies in the same hemisphere as a given vector—for example, the surface normal that lies in the same hemisphere as a ray leaving a surface is frequently needed. The FaceForward() utility function encapsulates this small computation.'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Normal3 Inline Functions>>=',
      code: `template <typename T>
Normal3<T> FaceForward(Normal3<T> n, Vector3<T> v) {
    return (Dot(n, v) < 0.f) ? -n : n;
}`
    },
    {
      type: 'paragraph',
      textKo: '내적 $\\mathbf{n} \\cdot \\mathbf{v} < 0$이라는 것은 두 벡터가 서로 반대 반구를 향하고 있다는 뜻(둔각, $90^\\circ$ 초과)이므로 법선 $-\\mathbf{n}$을 반환하고, 그렇지 않으면 원래 법선 $\\mathbf{n}$을 그대로 유지합니다.',
      textEn: 'FaceForward flips n if it points away from v (i.e. Dot(n, v) < 0).'
    }
  ]
};
