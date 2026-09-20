import type { SectionContent } from '../../../../types/book';

export const CH06_07_CURVES: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "6",
  "chapterTitleKo": "제6장 3차원 형상과 교차 검사 (Shapes)",
  "sectionNumber": "6.7",
  "sectionTitle": "Curves",
  "sectionTitleKo": "6.7 곡선과 모발/실 렌더링 (Curves)",
  "originalUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
  "prevSection": {
    "id": "ch06-06",
    "title": "6.6 쌍선형 패치 곡면(Bilinear Patches)"
  },
  "nextSection": {
    "id": "ch06-08",
    "title": "6.8 부동소수점 반올림 오차 엄밀 제어"
  },
  "summary": {
    "keyTakeaways": [
      "곡선(Curve) 프리미티브는 영화와 애니메이션에서 10만 가닥 이상의 인간의 머리카락, 동물의 털(Fur), 잔디, 직물의 옷감 실을 사실적으로 렌더링하는 데 필수적입니다.",
      "각 곡선 세그먼트는 4개의 제어점(Control Points)으로 정의되는 3차 베지어 스플라인(Cubic Bézier Spline) 곡선으로 표현되며, 양 끝점의 두께(width0, width1)를 부드럽게 가변할 수 있습니다.",
      "Flat, Ribbon, Cylinder는 곡선의 폭과 셰이딩 방향을 구성하는 방식입니다. Cylinder 방식도 실제 튜브와의 정확한 교차를 모두 푸는 모델은 아닙니다.",
      "교차 검사는 베지어 곡선의 재귀적 분할(Subdivision)과 바운딩 실린더 교차 검사를 결합하여 수치적으로 매우 안정적이고 빠르게 수행됩니다."
    ],
    "prerequisites": [
      "3차 베지어 곡선 (Cubic Bézier Curve)과 번스타인 다항식 (Bernstein Polynomials)",
      "재귀적 드 카스텔조(de Casteljau) 분할 알고리즘",
      "프레네-세레(Frenet-Serret) 프레임과 곡선 접선 벡터"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.7.1 3차 베지어 곡선(Cubic Bézier Curve)의 수학적 표현",
      "titleEn": "6.7.1 Bézier Spline Representation",
      "id": "ch06-07-b1"
    },
    {
      "type": "paragraph",
      "textKo": "인간의 머리카락 한 올이나 동물의 모피 털은 수많은 작은 원통을 일일이 이어 붙이기에는 데이터가 너무 비대해집니다. pbrt는 4개의 3D 제어점 $c_0, c_1, c_2, c_3$과 번스타인 다항식(Bernstein Polynomial) 기저 함수를 사용하는 **3차 베지어 스플라인** 곡선으로 부드러운 헤어를 모델링합니다.",
      "textEn": "Rendering hair, fur, and cloth fibers with explicit polygonal meshes is prohibitively expensive. pbrt represents curves using cubic Bézier splines defined by four control points c0, c1, c2, c3.",
      "id": "ch06-07-b2"
    },
    {
      "type": "equation",
      "tex": "p(u) = \\sum_{i=0}^3 B_{i,3}(u) c_i = (1 - u)^3 c_0 + 3 u (1 - u)^2 c_1 + 3 u^2 (1 - u) c_2 + u^3 c_3",
      "explanationKo": "3차 베지어 곡선의 매개변수 방정식",
      "id": "ch06-07-b3"
    },
    {
      "type": "figure",
      "id": "fig-6-33",
      "number": "Figure 6.33",
      "title": "Original Figure 6.33",
      "titleKo": "원문 그림 6.33",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-33.png",
      "captionKo": "그림 6.33 · 베지어 제어점으로 얻은 바운딩 박스와, 시작·끝을 잇는 방향을 축에 맞추어 회전한 뒤 얻은 박스를 비교합니다. 두 번째가 곡선을 더 빽빽하게 감쌀 수 있습니다.",
      "captionEn": "Figure 6.33: 2D Bounding Boxes of a Bézier Curve. (a) Bounding box computed using the curve’s control points as given. (b) The effect of rotating the curve so that the vector from its first to last control point is aligned with the x axis before computing bounds. The resulting bounding box is a much tighter fit.",
      "width": 998,
      "height": 212,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.7.2 세 가지 곡선 유형: Flat, Ribbon, Cylinder",
      "titleEn": "6.7.2 Curve Types",
      "id": "ch06-07-b5"
    },
    {
      "type": "paragraph",
      "textKo": "용도와 연산 비용에 따라 세 가지 서로 다른 지오메트리 방식을 선택할 수 있습니다:",
      "textEn": "pbrt supports three types of curve primitives:",
      "id": "ch06-07-b6"
    },
    {
      "type": "figure",
      "id": "fig-6-34",
      "number": "Figure 6.34",
      "title": "Original Figure 6.34",
      "titleKo": "원문 그림 6.34",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-34.png",
      "captionKo": "그림 6.34 · 광선 좌표계에서 원점은 (0,0,0), 방향은 +z입니다. xy 원점이 곡선 구간의 2차원 바운딩 박스 밖이면 교차할 수 없습니다.",
      "captionEn": "Figure 6.34: Ray–Curve Bounds Test. In the ray coordinate system, the ray’s origin is at left-parenthesis 0 comma 0 comma 0 right-parenthesis and its direction is aligned with the plus z axis. Therefore, if the 2D point left-parenthesis x comma y right-parenthesis equals left-parenthesis 0 comma 0 right-parenthesis is outside the x y bounding box of the curve segment, then it is impossible that the ray intersects the curve.",
      "width": 998,
      "height": 161,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "곡선 형상은 목적에 맞는 근사입니다",
      "summary": "곡선 형상은 목적에 맞는 근사입니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "Flat은 검사 광선에 맞춘 평평한 띠, Ribbon은 지정 법선을 고려한 띠, Cylinder는 원통 같은 셰이딩 법선을 쓰는 방식입니다. Flat과 Cylinder는 실제 변형된 원통의 편리한 근사로, 원문도 참 원통을 기준으로 하면 약간의 편향이 있을 수 있다고 설명합니다. 굵은 튜브의 정확한 실루엣과 가림이 필요하면 모델 선택을 검토해야 합니다."
        }
      ],
      "id": "ch06-07-b8"
    },
    {
      "type": "figure",
      "id": "fig-6-35",
      "number": "Figure 6.35",
      "title": "Original Figure 6.35",
      "titleKo": "원문 그림 6.35",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-35.png",
      "captionKo": "그림 6.35 · 곡선 구간 끝점의 경계를 에지 함수로 검사합니다. 후보 점이 구간 바깥쪽이면 거절하고, 그 위치를 포함하는 이웃 구간이 있다면 그쪽에서 처리하게 합니다.",
      "captionEn": "Figure 6.35: Curve Segment Boundaries. The intersection test for a segment of a larger curve computes edge functions for the lines that are perpendicular to the segment endpoints (dashed lines). If a potential intersection point (solid dot) is on the other side of the edge than the segment, it is rejected; another curve segment (if present on that side) should account for this intersection instead.",
      "width": 998,
      "height": 99,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "id": "fig-curves-render",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "id": "ch06-07-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch06-07-source-figure-6-29",
      "number": "Figure 6.29",
      "title": "Original Figure 6.29",
      "titleKo": "원문 그림 6.29",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-29.png",
      "captionKo": "그림 6.29 · 3차 베지어 곡선은 네 제어점으로 정의합니다. u=0과 u=1에서 각각 첫 번째와 마지막 제어점을 통과합니다.",
      "captionEn": "Figure 6.29: A cubic Bézier curve is defined by four control points, normal p Subscript Baseline Subscript i . The curve normal p Subscript Baseline left-parenthesis u right-parenthesis , defined in Equation ( 6.16 ), passes through the first and last control points at u equals 0 and u equals 1 , respectively.",
      "width": 998,
      "height": 188,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-07-source-figure-6-30",
      "number": "Figure 6.30",
      "title": "Original Figure 6.30",
      "titleKo": "원문 그림 6.30",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-30.png",
      "captionKo": "그림 6.30 · 1차원 베지어 곡선에 폭을 주어 Curve의 표면을 만듭니다. 각 지점에서 곡선에 수직인 방향으로 폭의 절반씩 펼칩니다.",
      "captionEn": "Figure 6.30: Basic Geometry of the Curve Shape. A 1D Bézier curve is offset by half of the specified width in both the directions orthogonal to the curve at each point along it. The resulting area represents the curve’s surface.",
      "width": 998,
      "height": 88,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-07-source-figure-6-31",
      "number": "Figure 6.31",
      "title": "Original Figure 6.31",
      "titleKo": "원문 그림 6.31",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-31.png",
      "captionKo": "그림 6.31 · 100만 개 이상의 Curve로 털을 표현한 토끼입니다. 기능을 보여 주기 위해 실제보다 긴 털을 사용했습니다. 기본 메시 제공: Stanford Computer Graphics Laboratory.",
      "captionEn": "Figure 6.31: Furry Bunny. Bunny model with over one million Curve shapes used to model fur. Here, we have used unrealistically long curves to better show off the Curve ’s capabilities, giving an unrealistically shaggy bunny. (Underlying bunny mesh courtesy of the Stanford Computer Graphics Laboratory.)",
      "width": 998,
      "height": 748,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-07-source-figure-6-32",
      "number": "Figure 6.32",
      "title": "Original Figure 6.32",
      "titleKo": "원문 그림 6.32",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-32.png",
      "captionKo": "그림 6.32 · 세 Curve 유형입니다. flat은 접근 광선을 향하는 평평한 띠, cylinder는 유사한 교차 형상에 원통처럼 보이는 셰이딩 법선을 적용한 유형, ribbon은 양끝에서 정한 방향을 사이에서 보간하는 띠입니다.",
      "captionEn": "Figure 6.32: The Three Types of Curves That the Curve Shape Can Represent. On the top is a flat curve that is always oriented to be perpendicular to a ray approaching it. The middle is a variant of this curve where the shading normal is set so that the curve appears to be cylindrical. On the bottom is a ribbon, which has a fixed orientation at its starting and ending points; intermediate orientations are smoothly interpolated between them.",
      "width": 998,
      "height": 521,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-07-source-figure-6-36",
      "number": "Figure 6.36",
      "title": "Original Figure 6.36",
      "titleKo": "원문 그림 6.36",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-36.png",
      "captionKo": "그림 6.36 · 충분히 세분한 베지어 곡선의 일부분을 시작·끝을 잇는 선분으로 근사합니다. 실제 세분 후에는 거의 직선이므로 그림보다 근사 오차가 작은 경우가 많습니다.",
      "captionEn": "Figure 6.36: Approximation of a Cubic Bézier Curve with a Linear Segment. For this part of the ray–curve intersection test, we approximate the Bézier with a linear segment (dashed line) passing through its starting and ending points. (In practice, after being subdivided, the curve will be already nearly linear, so the error is less than this figure suggests.)",
      "width": 998,
      "height": 78,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-07-source-figure-6-37",
      "number": "Figure 6.37",
      "title": "Original Figure 6.37",
      "titleKo": "원문 그림 6.37",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-37.png",
      "captionKo": "그림 6.37 · 점에서 직선의 가장 가까운 점으로 향하는 벡터는 직선에 수직입니다. 이 성질과 투영을 이용해 직선 위 최단거리 지점의 매개변수를 구합니다.",
      "captionEn": "Figure 6.37: (a) Given an infinite line and a point normal p , the vector from the point to the closest point on the line, normal p prime , is then perpendicular to the line. (b) Because this vector is perpendicular, we can compute the distance from the first point of the line to the point of closest approach, normal p prime , as d equals double-vertical-bar normal p Subscript Baseline minus normal p 0 double-vertical-bar cosine theta .",
      "width": 998,
      "height": 268,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Curves.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "4776ac3a30f20f246bf8e09ee716b5bcb5dee1c5a5ffa7eb489471af1e4f5b4d",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "6.7 Curves",
      "6.7.1  Bounding Curves",
      "6.7.2  Intersection Tests"
    ],
    "sourceFigures": [
      "6.29",
      "6.30",
      "6.31",
      "6.32",
      "6.33",
      "6.34",
      "6.35",
      "6.36",
      "6.37"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
