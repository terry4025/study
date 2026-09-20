import type { SectionContent } from '../../../../types/book';

export const CH03_09_TRANSFORMATIONS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "3",
  "chapterTitleKo": "제3장 기하학과 3차원 변환 (Geometry & Transformations)",
  "sectionNumber": "3.9",
  "sectionTitle": "Transformations",
  "sectionTitleKo": "3.9 3차원 동차 변환 행렬 (Transformations)",
  "originalUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Transformations.html",
  "prevSection": {
    "id": "ch03-08",
    "title": "3.8 구면 기하학과 방향 표현"
  },
  "nextSection": {
    "id": "ch03-10",
    "title": "3.10 변환 적용과 법선 벡터의 역전치 변환"
  },
  "summary": {
    "keyTakeaways": [
      "3차원 공간의 선형 변환(회전, 확대축소)과 아핀 이동(평행이동)을 하나의 통합된 행렬 곱셈으로 처리하기 위해 4차원 **동차 좌표계(Homogeneous Coordinates)**를 도입합니다.",
      "동차 좌표계에서 점은 $w=1$, 벡터는 $w=0$으로 표현됩니다. $w=0$ 덕분에 벡터에 변환 행렬을 곱할 때 평행이동 성분이 자동으로 소거되어 방향성만 유지됩니다.",
      "Transform에는 정방향 행렬과 역행렬 저장 공간이 있습니다. 역행렬이 없는 특이 행렬은 별도로 처리하며, 이미 구한 역변환은 두 저장 행렬을 바꾸어 재사용합니다.",
      "행렬식(Determinant)이 음수($\\det(M) < 0$)이면 공간이 반전(Reflection)되어 왼손 좌표계와 오른손 좌표계가 서로 뒤바뀌므로, 표면 앞뒤 판정(Face-forward)을 위해 `SwapsHandedness()` 검사가 필수적입니다.",
      "`LookAt(pos, look, up)` 변환은 카메라의 3D 위치, 시선 목표점, 상단 업 벡터를 받아 월드 공간을 카메라 뷰 공간(원점 위치, $+z$ 방향 시선)으로 정렬하는 렌더러의 핵심 뷰 행렬을 생성합니다."
    ],
    "prerequisites": [
      "선형대수학: 4x4 행렬 곱셈, 역행렬, 행렬식(Determinant)",
      "3.1절 좌표계 및 아핀 공간"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "3.9 3차원 변환 (Transformations)",
      "titleEn": "3.9 Transformations",
      "id": "ch03-09-b1"
    },
    {
      "type": "paragraph",
      "textKo": "변환(Transformation)은 3차원 공간의 점과 벡터를 다른 점과 벡터로 매핑하는 수학적 함수입니다. 기하학적으로 변환은 모델의 위치 이동(Translation), 크기 조절(Scaling), 회전(Rotation)뿐 아니라, 3차원 월드 공간에서 카메라의 시선 공간으로의 좌표계 변경(Look-At Viewing), 원근 투영(Perspective Projection)에 이르기까지 렌더링 시스템 전반에 걸쳐 사용됩니다.",
      "textEn": "A transformation is a function that maps points to points and vectors to vectors. Transformations are used in computer graphics to place objects in a scene, animate them, transform them between coordinate systems, and project 3D scenes onto 2D image planes.",
      "id": "ch03-09-b2"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.9.1 동차 좌표계 (Homogeneous Coordinates)",
      "titleEn": "3.9.1 Homogeneous Coordinates",
      "id": "ch03-09-b3"
    },
    {
      "type": "paragraph",
      "textKo": "3차원 공간에서 회전과 확대축소는 $3 \\times 3$ 행렬 곱셈으로 표현할 수 있지만, 평행이동(Translation)은 단순한 덧셈이므로 $3 \\times 3$ 행렬 곱셈만으로는 표현할 수 없습니다. 컴퓨터 그래픽스는 이 문제를 해결하기 위해 4번째 가상 차원 $w$를 추가한 **동차 좌표계(Homogeneous Coordinates)**를 사용합니다.",
      "textEn": "While rotation and scaling can be represented by 3x3 matrices, translation requires addition. To represent all affine transformations uniformly as matrix multiplications, computer graphics uses 4D homogeneous coordinates.",
      "id": "ch03-09-b4"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "💡 동차 좌표계에서 점(w=1)과 벡터(w=0)의 우아한 마법",
      "summary": "💡 동차 좌표계에서 점(w=1)과 벡터(w=0)의 우아한 마법",
      "points": [
        {
          "title": "핵심 설명",
          "content": "4차원 동차 벡터 $[x, y, z, w]^T$에 4x4 아핀 변환 행렬을 곱하면:\n$$\n\\begin{bmatrix}\nm_{00} & m_{01} & m_{02} & t_x \\\\\nm_{10} & m_{11} & m_{12} & t_y \\\\\nm_{20} & m_{21} & m_{22} & t_z \\\\\n0 & 0 & 0 & 1\n\\end{bmatrix}\n\\begin{bmatrix} x \\\\ y \\\\ z \\\\ w \\end{bmatrix}\n$$\n- **점 ($w = 1$일 때)**: 마지막 열의 평행이동 성분 $t_x, t_y, t_z$가 $1$과 곱해져 더해집니다! $\\rightarrow$ 위치가 올바르게 이동됨.\n- **벡터 ($w = 0$일 때)**: 마지막 열의 평행이동 성분이 $0$과 곱해져 완전히 소거됩니다! $\\rightarrow$ 벡터는 위치가 없으므로 평행이동에 영향을 받지 않고 회전/스케일만 적용됨.\n\n이처럼 $w$ 성분 하나만으로 점과 벡터의 본질적 차이가 기계적으로 완벽하게 유지됩니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "PBRT"
      ],
      "id": "ch03-09-b5"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.9.2 Transform 클래스 설계",
      "titleEn": "3.9.2 Transform Class Definition",
      "id": "ch03-09-b6"
    },
    {
      "type": "paragraph",
      "textKo": "Transform은 정방향 행렬 m과 역변환용 mInv를 저장합니다. 모든 행렬이 가역인 것은 아닙니다. 원문은 Inverse의 선택적 반환값을 확인하고, 특이 행렬이면 역행렬 저장 공간에 NaN을 넣습니다. 역변환이 필요한 곳에는 가역인 변환을 사용해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-09-b7"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Transform Definition>>=",
      "code": "class Transform {\n  public:\n    Transform() = default;\n    Transform(const SquareMatrix<4> &matrix) : m(matrix) {\n        auto inv = pbrt::Inverse(matrix);\n        if (inv) mInv = *inv;\n        else {\n            Float nan = std::numeric_limits<Float>::quiet_NaN();\n            for (int i = 0; i < 4; ++i)\n                for (int j = 0; j < 4; ++j) mInv[i][j] = nan;\n        }\n    }\n    Transform(const SquareMatrix<4> &m, const SquareMatrix<4> &mInv)\n        : m(m), mInv(mInv) {}\n\n    friend Transform Inverse(const Transform &t) {\n        return Transform(t.mInv, t.m);\n    }\n\n    bool SwapsHandedness() const;\n\n  private:\n    SquareMatrix<4> m, mInv;\n};",
      "provenance": "teaching",
      "id": "ch03-09-b8"
    },
    {
      "type": "paragraph",
      "textKo": "광선 추적 엔진에서는 표면 충돌점에서 계산된 물리량을 월드 공간과 로컬 오브젝트 공간 사이에서 끊임없이 왕복 변환해야 합니다. 만약 매번 런타임에 $4 \\times 4$ 행렬의 역행렬을 계산한다면 막대한 수치해석 비용이 소모됩니다. 따라서 pbrt는 생성 시점에 역행렬을 미리 계산해 두고, `Inverse(t)` 호출 시 단순히 두 행렬의 위치를 맞바꾼 새로운 `Transform` 객체를 $O(1)$로 즉시 반환합니다.",
      "textEn": "Because ray tracers frequently transform rays and surfaces back and forth between coordinate spaces, storing both m and mInv allows computing inverses in O(1) time without repeated numerical matrix inversion.",
      "id": "ch03-09-b9"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.9.3 기본 변환 연산 (평행이동, 스케일링, 회전)",
      "titleEn": "3.9.3 Basic Transformations (Translation, Scale, Rotation)",
      "id": "ch03-09-b10"
    },
    {
      "type": "paragraph",
      "textKo": "평행이동(Translation)은 점의 위치에 변위 오프셋 $(\\Delta x, \\Delta y, \\Delta z)$를 더해주는 변환입니다(그림 3.25).",
      "textEn": "Translation moves points by an offset vector $(\\Delta x, \\Delta y, \\Delta z)$ (Figure 3.25).",
      "id": "ch03-09-b11"
    },
    {
      "type": "figure",
      "id": "fig-3-25",
      "number": "Figure 3.25",
      "title": "Original Figure 3.25",
      "titleKo": "원문 그림 3.25",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-25.png",
      "captionKo": "그림 3.25 · 2차원 점 좌표에 Δx, Δy를 더하면 그만큼 평행이동합니다.",
      "captionEn": "Figure 3.25: Translation in 2D. Adding offsets normal upper Delta x and normal upper Delta y to a point’s coordinates correspondingly changes its position in space.",
      "width": 998,
      "height": 246,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Transformations.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "회전(Rotation)은 지정된 축을 중심으로 물체를 각도 $\\theta$만큼 회전시킵니다(그림 3.26, 그림 3.27).",
      "textEn": "Rotation rotates points and vectors around a given axis by an angle $\\theta$ (Figure 3.26 and Figure 3.27).",
      "id": "ch03-09-b13"
    },
    {
      "type": "figure",
      "id": "fig-3-26",
      "number": "Figure 3.26",
      "title": "Original Figure 3.26",
      "titleKo": "원문 그림 3.26",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-26.png",
      "captionKo": "그림 3.26 · x축 회전에서는 x 성분이 유지되고 yz 평면의 성분들이 회전합니다. 회전 방향은 그림의 좌표계와 보는 방향을 기준으로 읽어야 합니다.",
      "captionEn": "Figure 3.26: Clockwise rotation by an angle theta about the x axis leaves the x coordinate unchanged. The y and z axes are mapped to the vectors given by the dashed lines; y and z coordinates move accordingly.",
      "width": 998,
      "height": 306,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Transformations.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-3-27",
      "number": "Figure 3.27",
      "title": "Original Figure 3.27",
      "titleKo": "원문 그림 3.27",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-27.png",
      "captionKo": "그림 3.27 · 임의 축에 수직인 평면에서 두 기저 벡터를 만들고 그 평면 안에서 회전하면, 임의 축 회전을 구성할 수 있습니다. 각 좌표축에 이를 적용해 회전 행렬의 성분을 얻습니다.",
      "captionEn": "Figure 3.27: A vector bold v can be rotated around an arbitrary axis bold a by constructing a coordinate system left-parenthesis normal p Subscript Baseline comma bold v bold 1 comma bold v bold 2 right-parenthesis in the plane perpendicular to the axis that passes through bold v ’s end point and rotating the vectors bold v bold 1 and bold v bold 2 about normal p Subscript . Applying this rotation to the axes of the coordinate system left-parenthesis 1 comma 0 comma 0 right-parenthesis , left-parenthesis 0 comma 1 comma 0 right-parenthesis , and left-parenthesis 0 comma 0 comma 1 right-parenthesis gives the general rotation matrix for this rotation.",
      "width": 998,
      "height": 335,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Transformations.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.9.4 Look-At 뷰 변환 (The Look-at Transformation)",
      "titleEn": "3.9.4 The Look-at Transformation",
      "id": "ch03-09-b16"
    },
    {
      "type": "paragraph",
      "textKo": "가상 카메라의 위치와 시야를 설정할 때 가장 널리 사용되는 변환이 바로 `LookAt`입니다. 카메라의 3차원 위치(`pos`), 카메라가 바라보고 있는 대상 지점(`look`), 그리고 위쪽 방향을 가리키는 업 벡터(`up`) 세 가지 파라미터로부터, 월드 공간을 카메라 기준 좌표계(원점에 카메라 위치, $+z$ 방향으로 시선 전개)로 정렬하는 변환 행렬을 구축합니다(그림 3.28).",
      "textEn": "The Look-at transformation constructs a viewing matrix from a camera position, a look-at target point, and an up vector (Figure 3.28).",
      "id": "ch03-09-b17"
    },
    {
      "type": "figure",
      "id": "fig-3-28",
      "number": "Figure 3.28",
      "title": "Original Figure 3.28",
      "titleKo": "원문 그림 3.28",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-28.png",
      "captionKo": "그림 3.28 · 카메라 위치, 바라보는 점, 위쪽 방향으로 look-at 변환을 정합니다. PBRT 카메라 공간에서는 원점의 카메라가 +z를 바라보고 +y가 위를 향합니다.",
      "captionEn": "Figure 3.28: Given a camera position, the position being looked at from the camera, and an “up” direction, the look-at transformation describes a transformation from a left-handed viewing coordinate system where the camera is at the origin looking down the plus z axis, and the plus y axis is along the up direction.",
      "width": 998,
      "height": 199,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Transformations.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Transform Function Definitions>>+=",
      "code": "Transform LookAt(Point3f pos, Point3f look, Vector3f up) {\n    SquareMatrix<4> worldFromCamera;\n    // 카메라 원점을 pos로 평행이동\n    worldFromCamera[0][3] = pos.x;\n    worldFromCamera[1][3] = pos.y;\n    worldFromCamera[2][3] = pos.z;\n    worldFromCamera[3][3] = 1;\n\n    // 카메라 기준 세 기저 벡터 구성\n    CHECK_NE(look, pos);\n    Vector3f dir = Normalize(look - pos);\n    CHECK_GT(LengthSquared(Cross(up, dir)), 0);\n    Vector3f right = Normalize(Cross(up, dir));\n    Vector3f newUp = Cross(dir, right);\n\n    worldFromCamera[0][0] = right.x;\n    worldFromCamera[1][0] = right.y;\n    worldFromCamera[2][0] = right.z;\n    worldFromCamera[3][0] = 0;\n\n    worldFromCamera[0][1] = newUp.x;\n    worldFromCamera[1][1] = newUp.y;\n    worldFromCamera[2][1] = newUp.z;\n    worldFromCamera[3][1] = 0;\n\n    worldFromCamera[0][2] = dir.x;\n    worldFromCamera[1][2] = dir.y;\n    worldFromCamera[2][2] = dir.z;\n    worldFromCamera[3][2] = 0;\n\n    auto cameraFromWorld = Inverse(worldFromCamera);\n    CHECK(cameraFromWorld);\n    return Transform(*cameraFromWorld, worldFromCamera);\n}",
      "provenance": "teaching",
      "id": "ch03-09-b19"
    }
  ],
  "audit": {
    "checkedSourceSha256": "cfdee743d796d7eded399a1303884b8bd659e1f775b70d4424b5faef3736ec36",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "3.9 Transformations",
      "3.9.1  Homogeneous Coordinates",
      "3.9.2  Transform Class Definition",
      "3.9.3  Basic Operations",
      "3.9.4  Translations",
      "3.9.5  Scaling",
      "3.9.6 x , y , and z Axis Rotations",
      "3.9.7  Rotation around an Arbitrary Axis",
      "3.9.8  Rotating One Vector to Another",
      "3.9.9  The Look-at Transformation"
    ],
    "sourceFigures": [
      "3.25",
      "3.26",
      "3.27",
      "3.28"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
