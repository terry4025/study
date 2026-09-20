import type { SectionContent } from '../../../../types/book';

export const CH03_10_APPLYING_TRANSFORMATIONS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "3",
  "chapterTitleKo": "제3장 기하학과 3차원 변환 (Geometry & Transformations)",
  "sectionNumber": "3.10",
  "sectionTitle": "Applying Transformations",
  "sectionTitleKo": "3.10 변환 적용과 법선 벡터의 역전치 변환",
  "originalUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Applying_Transformations.html",
  "prevSection": {
    "id": "ch03-09",
    "title": "3.9 3차원 동차 변환 행렬"
  },
  "nextSection": {
    "id": "ch03-11",
    "title": "3.11 광선-표면 상호작용 구조체 (Interactions)"
  },
  "summary": {
    "keyTakeaways": [
      "점에 투영 변환을 적용할 때 변환된 동차 성분 w로 나눕니다. w=0인 점은 유한한 3차원 점으로 되돌릴 수 없으므로 별도 처리가 필요합니다.",
      "벡터(Vector)는 위치가 없으므로 4번째 행과 열의 평행이동 성분을 무시하고 $3 \\times 3$ 부분 행렬로만 곱하여 방향과 크기만 변환합니다.",
      "**컴공 그래픽스 최대의 핵심 증명: 법선의 역전치 변환 ($M^{-T}$)**: 물체에 비균등 스케일링이 적용될 때, 표면 법선이 변형된 접평면과 직교성($\\mathbf{n} \\cdot \\mathbf{t} = 0$)을 영구히 보존하려면 원래 변환 행렬 $M$이 아니라 **역행렬의 전치 행렬 $M^{-T} = (M^{-1})^T$**을 곱해야만 합니다.",
      "축 정렬 바운딩 박스(AABB)에 회전이나 변환을 가하면 더 이상 좌표축에 정렬되지 않으므로, 박스의 8개 꼭짓점(Corners)을 모두 변환한 뒤 이들을 완벽히 감싸는 새로운 최소-최대 AABB를 생성합니다."
    ],
    "prerequisites": [
      "3.9절 4x4 동차 변환 행렬 및 역행렬",
      "3.5절 법선 벡터와 표면 접평면",
      "선형대수학: 전치 행렬(Transpose)과 역행렬(Inverse)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "3.10 변환 적용 (Applying Transformations)",
      "titleEn": "3.10 Applying Transformations",
      "id": "ch03-10-b1"
    },
    {
      "type": "paragraph",
      "textKo": "`Transform` 클래스가 정의된 후, 이제 이를 3차원 점, 벡터, 법선, 광선, 바운딩 박스 등 다양한 기하학적 요소들에 실제로 적용하는 연산자들을 살펴볼 차례입니다. `operator()`를 오버로딩하여 `p_transformed = t(p);`와 같이 마치 수학 함수를 적용하듯 직관적으로 코드를 작성할 수 있습니다.",
      "textEn": "Now that the Transform class has been defined, we can define methods to apply transformations to points, vectors, normals, rays, and bounding boxes.",
      "id": "ch03-10-b2"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.10.1 점의 변환과 원근 나눗셈",
      "titleEn": "3.10.1 Points",
      "id": "ch03-10-b3"
    },
    {
      "type": "paragraph",
      "textKo": "점 $p$에 $4 \\times 4$ 변환 행렬 $M$을 적용할 때, 점의 동차 좌표 $w$는 1로 설정됩니다. 일반적인 아핀 변환에서는 변환 후 $w$ 성분이 여전히 1이지만, 카메라 투영 변환(원근 투영)에서는 $w$ 성분이 1이 아닌 값으로 바뀝니다. 따라서 변환된 좌표를 유클리드 3차원 공간으로 되돌리기 위해 $w$ 성분으로 나누어주는 원근 나눗셈(Perspective Division)을 수행합니다:",
      "textEn": "When transforming a point $p$, we set its homogeneous coordinate $w = 1$. While affine transformations leave $w = 1$, projective transformations (such as perspective projection) change $w$. Thus, we divide by $w$ to recover the 3D Cartesian coordinates:",
      "id": "ch03-10-b4"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Transform Inline Methods>>+=",
      "code": "template <typename T>\nPBRT_CPU_GPU Point3<T> Transform::operator()(Point3<T> p) const {\n    T xp = m[0][0] * p.x + m[0][1] * p.y + m[0][2] * p.z + m[0][3];\n    T yp = m[1][0] * p.x + m[1][1] * p.y + m[1][2] * p.z + m[1][3];\n    T zp = m[2][0] * p.x + m[2][1] * p.y + m[2][2] * p.z + m[2][3];\n    T wp = m[3][0] * p.x + m[3][1] * p.y + m[3][2] * p.z + m[3][3];\n    if (wp == 1)\n        return Point3<T>(xp, yp, zp);\n    else\n        return Point3<T>(xp, yp, zp) / wp;\n}",
      "provenance": "teaching",
      "id": "ch03-10-b5"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.10.2 벡터의 변환",
      "titleEn": "3.10.2 Vectors",
      "id": "ch03-10-b6"
    },
    {
      "type": "paragraph",
      "textKo": "아핀 변환의 방향 벡터에는 w=0을 대응시켜 상위 3×3 선형 부분을 적용합니다. 일반적인 원근 투영에서 한 위치의 접벡터를 변환하는 문제는 위치에 의존하는 미분을 요구할 수 있으므로, 이 공식을 모든 투영 변환의 방향 계산으로 일반화하지 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-10-b7"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Transform Inline Methods>>+=",
      "code": "template <typename T>\nPBRT_CPU_GPU Vector3<T> Transform::operator()(Vector3<T> v) const {\n    return Vector3<T>(\n        m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z,\n        m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z,\n        m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z);\n}",
      "provenance": "teaching",
      "id": "ch03-10-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.10.3 법선 벡터의 변환과 역전치 행렬 (M^{-T})",
      "titleEn": "3.10.3 Normals",
      "id": "ch03-10-b9"
    },
    {
      "type": "paragraph",
      "textKo": "컴퓨터 그래픽스에서 가장 유명하고 중요한 수학적 원리 중 하나는 **\"표면 법선 벡터는 일반 벡터와 같은 행렬로 변환해서는 안 된다\"**는 사실입니다. 그림 3.29는 원을 세로 방향으로 $1/2$배 압축했을 때 발생하는 기하학적 문제를 극명하게 보여줍니다.",
      "textEn": "One of the most important geometric subtleties in computer graphics is that surface normal vectors must not be transformed by the same matrix used for points and vectors (Figure 3.29).",
      "id": "ch03-10-b10"
    },
    {
      "type": "figure",
      "id": "fig-3-29",
      "number": "Figure 3.29",
      "title": "Original Figure 3.29",
      "titleKo": "원문 그림 3.29",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-29.png",
      "captionKo": "그림 3.29 · 원을 y방향으로 절반 줄일 때 법선을 일반 방향 벡터처럼 줄이면 표면과의 수직 관계가 깨집니다. 올바른 역전치 변환은 그 수직 관계를 유지합니다.",
      "captionEn": "Figure 3.29: Transforming Surface Normals. (a) Original circle, with the normal at a point indicated by an arrow. (b) When scaling the circle to be half as tall in the y direction, simply treating the normal as a direction and scaling it in the same manner gives a normal that is no longer perpendicular to the surface. (c) A properly transformed normal.",
      "width": 998,
      "height": 165,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Applying_Transformations.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "역전치는 수직 관계를 보존합니다",
      "summary": "역전치는 수직 관계를 보존합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "가역인 M에 대해 t′=Mt, n′=M⁻ᵀn이라 두면 (n′)ᵀt′=nᵀM⁻¹Mt=nᵀt=0입니다. 이것이 수직성 보존의 증명입니다. 수직성만 요구하면 n′에 0 아닌 배율을 곱해도 되므로 유일한 벡터 길이를 정하는 조건은 아닙니다. 단위 법선이 필요하면 마지막에 정규화합니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "선형대수학",
        "PBRT"
      ],
      "id": "ch03-10-b12"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Transform Inline Methods>>+=",
      "code": "template <typename T>\nPBRT_CPU_GPU Normal3<T> Transform::operator()(Normal3<T> n) const {\n    // mInv의 전치 행렬(Transpose of mInv = M^{-T})을 곱함!\n    return Normal3<T>(\n        mInv[0][0] * n.x + mInv[1][0] * n.y + mInv[2][0] * n.z,\n        mInv[0][1] * n.x + mInv[1][1] * n.y + mInv[2][1] * n.z,\n        mInv[0][2] * n.x + mInv[1][2] * n.y + mInv[2][2] * n.z);\n}",
      "provenance": "teaching",
      "id": "ch03-10-b13"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.10.4 광선과 바운딩 박스의 변환",
      "titleEn": "3.10.4 Rays and Bounding Boxes",
      "id": "ch03-10-b14"
    },
    {
      "type": "paragraph",
      "textKo": "아핀 변환에서는 원점은 점으로, 방향은 벡터로 변환하면 광선의 같은 t에 해당하는 위치가 변환됩니다. 방향을 다시 정규화하면 t의 척도도 맞춰야 합니다. 실제 PBRT의 광선 변환은 반올림 오차를 고려한 원점 오프셋과 tMax 조정도 수행하므로, 이 두 연산만이 전체 구현은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-10-b15"
    },
    {
      "type": "paragraph",
      "textKo": "아핀 변환된 박스를 감싸는 AABB는 여덟 꼭짓점을 변환한 뒤 성분별 최솟값·최댓값을 구하면 얻습니다. 결과는 변환된 박스의 상계이며, 원래 박스 내부 물체 자체의 가장 타이트한 경계는 아닐 수 있습니다. 특이점이나 w=0을 가로지르는 일반 투영에는 이 설명을 그대로 적용하지 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-10-b16"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Transform Inline Methods>>+=",
      "code": "template <typename T>\nBounds3<T> Transform::operator()(const Bounds3<T> &b) const {\n    const Transform &M = *this;\n    Bounds3<T> ret(M(Point3<T>(b.pMin.x, b.pMin.y, b.pMin.z)));\n    ret = Union(ret, M(Point3<T>(b.pMax.x, b.pMin.y, b.pMin.z)));\n    ret = Union(ret, M(Point3<T>(b.pMin.x, b.pMax.y, b.pMin.z)));\n    ret = Union(ret, M(Point3<T>(b.pMin.x, b.pMin.y, b.pMax.z)));\n    ret = Union(ret, M(Point3<T>(b.pMin.x, b.pMax.y, b.pMax.z)));\n    ret = Union(ret, M(Point3<T>(b.pMax.x, b.pMax.y, b.pMin.z)));\n    ret = Union(ret, M(Point3<T>(b.pMax.x, b.pMin.y, b.pMax.z)));\n    ret = Union(ret, M(Point3<T>(b.pMax.x, b.pMax.y, b.pMax.z)));\n    return ret;\n}",
      "provenance": "teaching",
      "id": "ch03-10-b17"
    }
  ],
  "audit": {
    "checkedSourceSha256": "4a40be4aec9e46aa5c51d560bfee9f94566009283775a01bce7222c713dff469",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "3.10 Applying Transformations",
      "3.10.1  Points",
      "3.10.2  Vectors",
      "3.10.3  Normals",
      "3.10.4  Rays",
      "3.10.5  Bounding Boxes",
      "3.10.6  Composition of Transformations",
      "3.10.7  Transformations and Coordinate System Handedness",
      "3.10.8  Vector Frames"
    ],
    "sourceFigures": [
      "3.29"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
