import type { SectionContent } from '../../../../types/book';

export const CH06_03_CYLINDERS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "6",
  "chapterTitleKo": "제6장 3차원 형상과 교차 검사 (Shapes)",
  "sectionNumber": "6.3",
  "sectionTitle": "Cylinders",
  "sectionTitleKo": "6.3 원기둥(Cylinder) 모델과 교차 검사 (Cylinders)",
  "originalUrl": "https://pbr-book.org/4ed/Shapes/Cylinders.html",
  "prevSection": {
    "id": "ch06-02",
    "title": "6.2 구(Sphere)의 해석적 교차 검사"
  },
  "nextSection": {
    "id": "ch06-04",
    "title": "6.4 원판(Disk)"
  },
  "summary": {
    "keyTakeaways": [
      "원기둥(Cylinder)은 z축을 중심축으로 하는 2차 곡면으로, 음함수 방정식 x² + y² - r² = 0을 만족합니다.",
      "광선과의 교차 검사는 x와 y 성분만을 고려한 2D 2차 방정식으로 환원되므로 구보다 계산량이 더 적습니다.",
      "해석적으로 구한 두 교점 t0, t1 중 z축 유효 높이 구간 [zMin, zMax] 및 방위각 [0, phiMax] 내에 들어오는 가장 가까운 점을 최종 교차점으로 선택합니다.",
      "변환 전 객체 공간의 원기둥 옆면 법선은 (x/r,y/r,0)입니다. 상하 뚜껑은 이 형상에 자동으로 포함되지 않고, 변환 후 법선에는 역전치와 방향 보정을 적용합니다."
    ],
    "prerequisites": [
      "6.2절 2차 방정식 근의 공식과 판별식",
      "원통 좌표계 (Cylindrical Coordinates: r, phi, z)",
      "3차원 선분 클리핑 기법"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.3.1 원기둥의 수학적 방정식과 2D 2차 방정식 유도",
      "titleEn": "6.3.1 Ray–Cylinder Intersection",
      "id": "ch06-03-b1"
    },
    {
      "type": "paragraph",
      "textKo": "$z$축을 중심축으로 두고 반지름이 $r$인 무한 원기둥의 음함수 방정식은 매우 단순합니다. $z$ 좌표와 무관하게 $xy$ 평면상의 거리가 항상 $r$이어야 하므로 다음과 같습니다:",
      "textEn": "An infinite cylinder centered on the z axis with radius r has the simple implicit equation:",
      "id": "ch06-03-b2"
    },
    {
      "type": "equation",
      "tex": "x^2 + y^2 - r^2 = 0",
      "explanationKo": "z축 중심 무한 원기둥의 음함수 표기법",
      "id": "ch06-03-b3"
    },
    {
      "type": "paragraph",
      "textKo": "광선 방정식 $x(t) = o_x + t d_x$, $y(t) = o_y + t d_y$를 대입하면, $z$ 성분이 빠진 2차 방정식 $a t^2 + b t + c = 0$이 도출됩니다:",
      "textEn": "Substituting the ray equations for x and y gives a quadratic equation where the z components do not appear:",
      "id": "ch06-03-b4"
    },
    {
      "type": "equation",
      "tex": "a = d_x^2 + d_y^2, \\quad b = 2(d_x o_x + d_y o_y), \\quad c = o_x^2 + o_y^2 - r^2",
      "explanationKo": "원기둥 교차 방정식 계수 a, b, c",
      "id": "ch06-03-b5"
    },
    {
      "type": "paragraph",
      "id": "fig-6-13",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.3.2 높이 제한(zMin, zMax)과 방위각(phiMax) 판정",
      "titleEn": "6.3.2 Height Clipping and Azimuthal Bounds",
      "id": "ch06-03-b7"
    },
    {
      "type": "paragraph",
      "textKo": "a=dₓ²+dᵧ²가 0이면 광선이 원기둥 축과 나란하므로 일반적인 2차 근 공식으로 나누지 않습니다. a>0인 경우 근을 구해 [0,tMax] 범위, zMin~zMax, 방위각 제한을 확인합니다. PBRT의 Cylinder는 옆면을 나타내며 뚜껑은 별도 형상입니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-03-b8"
    },
    {
      "type": "paragraph",
      "id": "fig-6-14",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "textKo": "첫 번째 근 $t_0$가 높이 제한에 걸려 탈락하더라도, 뒤쪽 표면인 두 번째 근 $t_1$이 유효 높이 구간에 들어온다면 $t_1$이 유효한 교차점으로 승격됩니다.",
      "textEn": "If the first intersection t0 is outside the height bounds, t1 may still lie within the valid interval.",
      "id": "ch06-03-b10"
    },
    {
      "type": "paragraph",
      "id": "fig-6-15",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.3.3 편미분과 수평 방사 법선 벡터",
      "titleEn": "6.3.3 Differential Geometry",
      "id": "ch06-03-b12"
    },
    {
      "type": "paragraph",
      "textKo": "변환과 방향 반전을 적용하기 전, 원기둥 옆면의 외향 법선은 아래와 같습니다. 회전·스케일 이후의 렌더링 공간 법선이 언제나 z성분0이라는 뜻은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-03-b13"
    },
    {
      "type": "equation",
      "tex": "\\mathbf{n} = \\left(\\frac{x}{r}, \\; \\frac{y}{r}, \\; 0\\right)^T",
      "explanationKo": "원기둥 표면 법선 벡터",
      "id": "ch06-03-b14"
    },
    {
      "type": "paragraph",
      "id": "fig-cylinders-render",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "id": "ch06-03-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch06-03-source-figure-6-7",
      "number": "Figure 6.7",
      "title": "Original Figure 6.7",
      "titleKo": "원문 그림 6.7",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-7.png",
      "captionKo": "그림 6.7 · 원기둥은 물체 공간 z축을 따라 정한 높이 구간과 반경 r을 갖습니다. 방위각 범위를 제한해 부분 원기둥을 만들 수 있습니다.",
      "captionEn": "Figure 6.7: Basic Setting for the Cylinder Shape. The cylinder has a radius of r and covers a range along the z axis. A partial cylinder may be swept by specifying a maximum phi value.",
      "width": 998,
      "height": 439,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Cylinders.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-03-source-figure-6-8",
      "number": "Figure 6.8",
      "title": "Original Figure 6.8",
      "titleKo": "원문 그림 6.8",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-8.png",
      "captionKo": "그림 6.8 · 부분 원기둥과 전체 둘레를 가진 원기둥입니다. 이 Shape의 옆면과 별도로 붙이는 뚜껑은 구분합니다.",
      "captionEn": "Figure 6.8: Two Cylinders. A partial cylinder is on the left, and a complete cylinder is on the right.",
      "width": 998,
      "height": 617,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Cylinders.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "21a4da2bc40ba2aa8516481070c4494ef450d631265fd94654603dfc49799636",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "6.3 Cylinders",
      "6.3.1  Area and Bounding",
      "6.3.2  Intersection Tests",
      "6.3.3  Sampling"
    ],
    "sourceFigures": [
      "6.7",
      "6.8"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
