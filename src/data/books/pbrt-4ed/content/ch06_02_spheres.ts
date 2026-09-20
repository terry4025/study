import type { SectionContent } from '../../../../types/book';

export const CH06_02_SPHERES: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "6",
  "chapterTitleKo": "제6장 3차원 형상과 교차 검사 (Shapes)",
  "sectionNumber": "6.2",
  "sectionTitle": "Spheres",
  "sectionTitleKo": "6.2 구(Sphere)의 해석적 교차 검사 (Spheres)",
  "originalUrl": "https://pbr-book.org/4ed/Shapes/Spheres.html",
  "prevSection": {
    "id": "ch06-01",
    "title": "6.1 기본 Shape 인터페이스 설계"
  },
  "nextSection": {
    "id": "ch06-03",
    "title": "6.3 원기둥(Cylinder)"
  },
  "summary": {
    "keyTakeaways": [
      "구(Sphere)는 컴퓨터 그래픽스에서 2차 방정식의 근의 공식(Quadratic Formula)을 통해 해석적(Analytic)으로 가장 정밀하게 교차점을 구할 수 있는 기본 형상입니다.",
      "광선 방정식 p(t) = o + td를 구의 음함수 방정식 x² + y² + z² - r² = 0에 대입하면 at² + bt + c = 0 형태의 2차 방정식이 유도됩니다.",
      "무한 직선과 완전한 구의 교차 후보는 판별식으로 구합니다. 광선의 유효 t 범위와 부분 구의 높이·각도 제한, 반올림 오차를 추가로 검사해야 합니다.",
      "pbrt의 구 모델은 단순한 완전 구뿐만 아니라 z축 높이(zMin, zMax)와 방위각(phiMax)으로 자른 부분 구(Partial Sphere)를 지원하며, 표면 편미분(∂p/∂u, ∂p/∂v)으로부터 정확한 표면 법선과 텍스처 좌표를 계산합니다."
    ],
    "prerequisites": [
      "고교 수학 2차 방정식의 근의 공식 및 판별식 (D = b² - 4ac)",
      "구면좌표계 (Spherical Coordinates: 반지름 r, 극각 theta, 방위각 phi)",
      "3차원 벡터의 내적과 크기 계산"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.2.1 구의 수학적 정의와 2차 방정식 교차 유도",
      "titleEn": "6.2.1 Ray–Sphere Intersection Formulation",
      "id": "ch06-02-b1"
    },
    {
      "type": "paragraph",
      "textKo": "원점 중심, 반지름 $r$을 갖는 구의 음함수(Implicit equation)는 다음과 같습니다:",
      "textEn": "An implicit representation of a sphere centered at the origin of radius r is:",
      "id": "ch06-02-b2"
    },
    {
      "type": "equation",
      "tex": "x^2 + y^2 + z^2 - r^2 = 0",
      "explanationKo": "원점에 위치한 반지름 r인 구의 음함수 표기법",
      "id": "ch06-02-b3"
    },
    {
      "type": "paragraph",
      "textKo": "광선의 매개변수 방정식 $p(t) = o + t d$의 각 성분 $x(t) = o_x + t d_x$, $y(t) = o_y + t d_y$, $z(t) = o_z + t d_z$를 구의 방정식에 대입하여 전개하면, 매개변수 $t$에 관한 친숙한 2차 방정식 $a t^2 + b t + c = 0$이 도출됩니다:",
      "textEn": "Substituting the parametric ray equation p(t) = o + td into the sphere equation yields a quadratic equation in t:",
      "id": "ch06-02-b4"
    },
    {
      "type": "equation",
      "tex": "a t^2 + b t + c = 0",
      "explanationKo": "광선-구 교차 2차 방정식",
      "id": "ch06-02-b5"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 각 계수 $a, b, c$는 광선의 원점 $o$와 방향 $d$의 성분 곱과 벡터 내적으로 완벽히 정의됩니다:",
      "textEn": "where the coefficients a, b, and c are given by:",
      "id": "ch06-02-b6"
    },
    {
      "type": "equation",
      "tex": "a = d_x^2 + d_y^2 + d_z^2 = \\mathbf{d} \\cdot \\mathbf{d}, \\quad b = 2(d_x o_x + d_y o_y + d_z o_z) = 2(\\mathbf{o} \\cdot \\mathbf{d}), \\quad c = o_x^2 + o_y^2 + o_z^2 - r^2 = \\mathbf{o} \\cdot \\mathbf{o} - r^2",
      "explanationKo": "2차 방정식 계수 a, b, c",
      "id": "ch06-02-b7"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "실근은 후보이며 최종 광선 교차는 아닙니다",
      "summary": "실근은 후보이며 최종 광선 교차는 아닙니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "D<0이면 실근이 없고, D=0이면 접점 후보 하나, D>0이면 두 후보가 있습니다. 두 근이 모두 음수이면 광선의 뒤쪽이므로 앞쪽 교차는 없습니다. 부분 구의 클리핑과 tMax도 검사합니다. 부동소수점에서는 판별식과 근 계산의 오차를 다뤄야 하므로 근의 공식만으로 모든 경계 문제가 해결되지 않습니다."
        }
      ],
      "id": "ch06-02-b8"
    },
    {
      "type": "figure",
      "id": "fig-6-5",
      "number": "Figure 6.5",
      "title": "Original Figure 6.5",
      "titleKo": "원문 그림 6.5",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-5.png",
      "captionKo": "그림 6.5 · 구형 광원이 보이는 방향 범위를 중심 방향 ωc와 반각 θmax의 원뿔로 감쌉니다. 외부 관찰점에서는 sinθmax가 구의 반경을 중심까지 거리로 나눈 값입니다.",
      "captionEn": "Figure 6.5: To sample points on a spherical light source, we can uniformly sample within the cone of directions around a central vector omega Subscript normal c with an angular spread of up to theta Subscript normal m normal a normal x . Trigonometry can be used to derive the value of sine theta Subscript normal m normal a normal x , r slash StartAbsoluteValue normal p Subscript normal c Baseline minus normal p Subscript Baseline EndAbsoluteValue .",
      "width": 998,
      "height": 201,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Spheres.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.2.2 부분 구(Partial Spheres)와 매개변수화 (u, v)",
      "titleEn": "6.2.2 Partial Spheres and Parametrization",
      "id": "ch06-02-b10"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt의 구는 단순한 공 형태에 머무르지 않고, 지구본의 북극/남극을 잘라내거나($z_{\\min}, z_{\\max}$) 수박 조각처럼 각도를 오려낸($\\phi_{\\max}$) **부분 구(Partial Sphere)**를 완벽하게 지원합니다.",
      "textEn": "pbrt supports partial spheres, which are clipped in z between zMin and zMax, and clipped in azimuth up to phiMax.",
      "id": "ch06-02-b11"
    },
    {
      "type": "figure",
      "id": "fig-6-6",
      "number": "Figure 6.6",
      "title": "Original Figure 6.6",
      "titleKo": "원문 그림 6.6",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-6.png",
      "captionKo": "그림 6.6 · 구의 반경, 중심까지의 거리, 샘플링한 방향각 θ로 삼각형을 구성합니다. 각도 γ와 cosα를 구해 해당 방향의 구면 표본 위치를 찾습니다.",
      "captionEn": "Figure 6.6: Geometric Setting for Computing the Sampled Point on the Sphere Corresponding to a Sampled Angle theta . Consider the triangle shown here. The lengths of two sides are known: one is the radius of the sphere r and the other is d Subscript normal c , the distance from the reference point to the center of the sphere. We also know one angle, theta . Given these, we first solve for the angle gamma before finding cosine alpha .",
      "width": 998,
      "height": 201,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Spheres.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "atan2로 얻은 φ가 음수이면 2π를 더해 [0,2π)로 맞춥니다. 높이·방위각 제한을 검사한 뒤 u,v를 구합니다. 극각 θ는 위도 자체가 아니라 +z축에서 잰 각도입니다. 반지름과 매개변수 범위가 퇴화한 경우도 별도로 처리해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-02-b13"
    },
    {
      "type": "equation",
      "tex": "\\phi = \\operatorname{atan2}(y, x), \\quad \\theta = \\arccos\\left(\\operatorname{Clamp}(z / r, -1, 1)\\right)",
      "explanationKo": "교차점으로부터 구면 각도 (phi, theta) 유도",
      "id": "ch06-02-b14"
    },
    {
      "type": "equation",
      "tex": "u = \\frac{\\phi}{\\phi_{\\max}}, \\quad v = \\frac{\\theta - \\theta_{\\min}}{\\theta_{\\max} - \\theta_{\\min}}",
      "explanationKo": "정규화 텍스처 좌표 (u, v) 사상",
      "id": "ch06-02-b15"
    },
    {
      "type": "paragraph",
      "id": "fig-6-7",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "id": "fig-6-9",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.2.3 표면 편미분 벡터와 법선(Normal) 계산",
      "titleEn": "6.2.3 Differential Geometry and Surface Normals",
      "id": "ch06-02-b18"
    },
    {
      "type": "paragraph",
      "textKo": "물체 표면의 반사 및 조명을 계산하려면 충돌 지점의 **표면 법선 벡터($\\mathbf{n}$)**와 텍스처 변화율을 나타내는 **편미분 벡터($\\partial p/\\partial u, \\partial p/\\partial v$)**가 필수적입니다.",
      "textEn": "To shade an intersection, the differential area vectors dp/du and dp/dv and the surface normal must be computed.",
      "id": "ch06-02-b19"
    },
    {
      "type": "paragraph",
      "id": "fig-6-12",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "textKo": "구의 매개변수 방정식 $x = r \\sin\\theta \\cos\\phi, y = r \\sin\\theta \\sin\\phi, z = r \\cos\\theta$를 $u, v$로 편미분하면 다음과 같은 아름다운 편미분 벡터를 얻을 수 있습니다:",
      "textEn": "Differentiating the parametric equations with respect to u and v yields the tangent vectors:",
      "id": "ch06-02-b21"
    },
    {
      "type": "equation",
      "tex": "\\frac{\\partial p}{\\partial u} = \\left(-\\phi_{\\max} y, \\; \\phi_{\\max} x, \\; 0\\right)^T",
      "explanationKo": "방위각 u 방향 편미분 접선 벡터",
      "id": "ch06-02-b22"
    },
    {
      "type": "equation",
      "tex": "\\mathbf{n} = \\frac{\\frac{\\partial p}{\\partial u} \\times \\frac{\\partial p}{\\partial v}}{\\left\\|\\frac{\\partial p}{\\partial u} \\times \\frac{\\partial p}{\\partial v}\\right\\|} = \\frac{p}{\\|p\\|} = \\frac{p}{r}",
      "explanationKo": "객체 공간의 완전한 구에서 외향 법선은 p/r입니다. 매개변수 접벡터의 외적 부호는 u,v 정의와 순서에 따라 달라지므로 방향 설정·reverseOrientation·변환의 손잡이성을 반영합니다. 극점에서는 접벡터 외적이 퇴화할 수 있습니다.",
      "id": "ch06-02-b23"
    },
    {
      "type": "paragraph",
      "id": "fig-spheres-render",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "id": "ch06-02-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch06-02-source-figure-6-3",
      "number": "Figure 6.3",
      "title": "Original Figure 6.3",
      "titleKo": "원문 그림 6.3",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-3.png",
      "captionKo": "그림 6.3 · 구는 물체 공간 원점을 중심으로 반경 r을 갖습니다. 최대 방위각 φ 등의 범위를 제한해 부분 구를 만들 수 있습니다.",
      "captionEn": "Figure 6.3: Basic Setting for the Sphere Shape. It has a radius of r and is centered at the object space origin. A partial sphere may be described by specifying a maximum phi value.",
      "width": 998,
      "height": 559,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Spheres.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-02-source-figure-6-4",
      "number": "Figure 6.4",
      "title": "Original Figure 6.4",
      "titleKo": "원문 그림 6.4",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-4.png",
      "captionKo": "그림 6.4 · 부분 구와 완전한 구의 예입니다. 텍스처가 uv 매개변수화를 보여 주며 완전한 구의 극점에는 좌표 특이점이 있습니다.",
      "captionEn": "Figure 6.4: Two Spheres. On the left is a partial sphere (with z Subscript normal m normal a normal x Baseline less-than r and phi Subscript normal m normal a normal x Baseline less-than 2 pi ) and on the right is a complete sphere. Note that the texture image used shows the left-parenthesis u comma v right-parenthesis parameterization of the shape; the singularity at one of the poles is visible in the complete sphere.",
      "width": 998,
      "height": 618,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Spheres.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "2d5f7ee28034b96eb21447faf3565d0f9a6de85b0837606942319a5351248508",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "6.2 Spheres",
      "6.2.1  Bounding",
      "6.2.2  Intersection Tests",
      "6.2.3  Surface Area",
      "6.2.4  Sampling"
    ],
    "sourceFigures": [
      "6.3",
      "6.4",
      "6.5",
      "6.6"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
