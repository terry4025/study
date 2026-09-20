import type { SectionContent } from '../../../../types/book';

export const CH03_05_NORMALS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "3",
  "chapterTitleKo": "제3장 기하학과 3차원 변환 (Geometry & Transformations)",
  "sectionNumber": "3.5",
  "sectionTitle": "Normals",
  "sectionTitleKo": "3.5 법선 벡터 (Normal): 표면의 수직 방향",
  "originalUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Normals.html",
  "prevSection": {
    "id": "ch03-04",
    "title": "3.4 점 (Point): 3차원 공간 속 위치 모델링"
  },
  "nextSection": {
    "id": "ch03-06",
    "title": "3.6 광선 (Ray): 빛의 이동 경로와 파라메트릭 방정식"
  },
  "summary": {
    "keyTakeaways": [
      "표면 법선(Surface Normal)은 3차원 공간에서 물체 표면의 특정 위치에 엄밀히 수직(Perpendicular)인 기하학적 벡터입니다.",
      "법선은 표면 접벡터와 수직을 유지하도록 변환합니다. 가역인 선형 부분 M에 대해 역전치 M⁻ᵀ를 사용하며, 순수 회전에서는 M⁻ᵀ=M입니다.",
      "용어상의 주의점: \"법선(Normal)\"이라고 해서 항상 길이가 1로 정규화(Normalized)되어 있음을 의미하지는 않습니다. 필요에 따라 명시적으로 `Normalize()`를 호출해야 합니다.",
      "`FaceForward(n, v)`는 렌더링에서 광선이 물체 표면의 앞면 혹은 뒷면 중 어디에서 입사했는지에 따라 법선 벡터를 같은 반구 방향으로 정렬(반전)해 주는 필수 유틸리티입니다."
    ],
    "prerequisites": [
      "3.3절 벡터 연산과 내적/외적",
      "미분기하학 기초: 표면의 접평면(Tangent Plane)과 수직 벡터"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "3.5 법선 벡터 (Normals)",
      "titleEn": "3.5 Normals",
      "id": "ch03-05-b1"
    },
    {
      "type": "paragraph",
      "textKo": "표면 법선(Surface Normal, 또는 단순히 법선)은 물체 표면의 특정 위치에 수직(Orthogonal)인 벡터입니다. 수학적으로 법선은 해당 위치에서 표면에 접하는 임의의 평행하지 않은 두 접벡터(Tangent Vectors)의 외적(Cross Product)으로 엄밀하게 정의할 수 있습니다. 겉으로 보기에 법선은 일반 벡터와 거의 똑같아 보이지만, 두 개체를 명확하게 구분하는 것은 그래픽스 엔진 설계에서 매우 중요합니다. 법선은 특정한 표면과의 기하학적 상대 관계에 의해 정의되기 때문에, 3차원 기하학 변환(특히 비균등 크기 조절)을 적용할 때 일반 방향 벡터와 완전히 다르게 동작하기 때문입니다(이 차이는 3.10절에서 자세히 증명합니다).",
      "textEn": "A surface normal (or just normal) is a vector that is perpendicular to a surface at a particular position. It can be defined as the cross product of any two nonparallel vectors that are tangent to the surface at a point. Although normals are superficially similar to vectors, it is important to distinguish between the two of them: because normals are defined in terms of their relationship to a particular surface, they behave differently than vectors in some situations, particularly when applying transformations. (That difference is discussed in Section 3.10.)",
      "id": "ch03-05-b2"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "늘어난 표면에도 법선은 수직이어야 합니다",
      "summary": "늘어난 표면에도 법선은 수직이어야 합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "비균등 스케일링에서 접벡터와 법선에 같은 행렬을 적용하면 일반적으로 수직 관계가 깨집니다. 선형 부분 M이 가역이면 M⁻ᵀ를 법선에 적용하여 수직성을 유지합니다. 회전이나 특정 축 방향 같은 경우에는 같은 방식으로 변환해도 맞을 수 있으므로 “모든 경우에 달라진다”는 말은 피합니다. 결과를 단위 법선으로 쓸 때는 다시 정규화합니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "PBRT"
      ],
      "id": "ch03-05-b3"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Normal3 Definition>>=",
      "code": "template <typename T>\nclass Normal3 : public Tuple3<Normal3, T> {\n  public:\n    using Tuple3<Normal3, T>::x;\n    using Tuple3<Normal3, T>::y;\n    using Tuple3<Normal3, T>::z;\n    using Tuple3<Normal3, T>::HasNaN;\n    using Tuple3<Normal3, T>::operator+;\n    using Tuple3<Normal3, T>::operator*;\n    using Tuple3<Normal3, T>::operator*=;\n\n    Normal3() = default;\n    PBRT_CPU_GPU\n    Normal3(T x, T y, T z) : Tuple3<pbrt::Normal3, T>(x, y, z) {}\n\n    template <typename U>\n    PBRT_CPU_GPU explicit Normal3<T>(Normal3<U> v)\n        : Tuple3<pbrt::Normal3, T>(T(v.x), T(v.y), T(v.z)) {}\n\n    template <typename U>\n    explicit Normal3<T>(Vector3<U> v)\n        : Tuple3<pbrt::Normal3, T>(T(v.x), T(v.y), T(v.z)) {}\n};\n\nusing Normal3f = Normal3<Float>;",
      "provenance": "teaching",
      "id": "ch03-05-b4"
    },
    {
      "type": "paragraph",
      "textKo": "Normal3는 Vector3와 비슷한 세 성분 연산을 제공하지만, 변환 규칙이 다른 타입입니다. PBRT의 타입 인터페이스는 법선을 점에 더하거나 두 법선의 외적을 직접 구하는 연산을 제공하지 않습니다. 세 성분을 가진 방향들을 벡터로 해석하여 외적을 계산할 수 없다는 일반적인 수학 명제는 아닙니다. 법선이라는 이름도 길이가 1임을 보장하지 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-05-b5"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.5.1 FaceForward 유틸리티 함수",
      "titleEn": "3.5.1 The FaceForward Utility Function",
      "id": "ch03-05-b6"
    },
    {
      "type": "paragraph",
      "textKo": "렌더링을 구현하다 보면, 표면에서 출발하는 반사 광선이나 시선 벡터와 동일한 반구(Hemisphere)를 향하도록 표면 법선의 방향을 반전시켜야 하는 경우가 매우 빈번합니다. 예를 들어 얇은 잎사귀나 유리 표면의 양면을 렌더링할 때, 광선이 뒷면에서 들어왔다면 법선도 반대편을 바라보도록 뒤집어주어야 정확한 셰이딩 계산이 가능합니다. `FaceForward()` 함수는 이 간결하지만 필수적인 연산을 캡슐화합니다:",
      "textEn": "One new operation to implement comes from the fact that it is often necessary to flip a surface normal so it lies in the same hemisphere as a given vector—for example, the surface normal that lies in the same hemisphere as a ray leaving a surface is frequently needed. The FaceForward() utility function encapsulates this small computation.",
      "id": "ch03-05-b7"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Normal3 Inline Functions>>=",
      "code": "template <typename T>\nNormal3<T> FaceForward(Normal3<T> n, Vector3<T> v) {\n    return (Dot(n, v) < 0.f) ? -n : n;\n}",
      "provenance": "teaching",
      "id": "ch03-05-b8"
    },
    {
      "type": "paragraph",
      "textKo": "내적 $\\mathbf{n} \\cdot \\mathbf{v} < 0$이라는 것은 두 벡터가 서로 반대 반구를 향하고 있다는 뜻(둔각, $90^\\circ$ 초과)이므로 법선 $-\\mathbf{n}$을 반환하고, 그렇지 않으면 원래 법선 $\\mathbf{n}$을 그대로 유지합니다.",
      "textEn": "FaceForward flips n if it points away from v (i.e. Dot(n, v) < 0).",
      "id": "ch03-05-b9"
    }
  ],
  "audit": {
    "checkedSourceSha256": "b75a32d8af1cea2eb38642b2780dc062afc9da806082daf2ed28e07a5733b61d",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "3.5 Normals"
    ],
    "sourceFigures": [],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
