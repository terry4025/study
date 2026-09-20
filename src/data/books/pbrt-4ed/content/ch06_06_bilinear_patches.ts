import type { SectionContent } from '../../../../types/book';

export const CH06_06_BILINEAR_PATCHES: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "6",
  "chapterTitleKo": "제6장 3차원 형상과 교차 검사 (Shapes)",
  "sectionNumber": "6.6",
  "sectionTitle": "Bilinear Patches",
  "sectionTitleKo": "6.6 쌍선형 패치 곡면 (Bilinear Patches)",
  "originalUrl": "https://pbr-book.org/4ed/Shapes/Bilinear_Patches.html",
  "prevSection": {
    "id": "ch06-05",
    "title": "6.5 삼각 메시와 묄러-트룸보어 알고리즘"
  },
  "nextSection": {
    "id": "ch06-07",
    "title": "6.7 곡선과 모발/실 렌더링(Curves)"
  },
  "summary": {
    "keyTakeaways": [
      "쌍선형 패치(Bilinear Patch)는 4개의 3D 제어점(p00, p01, p10, p11) 사이를 2차원 매개변수 (u, v)로 선형 보간하여 형성되는 괘면(Ruled Surface)입니다.",
      "4개의 점이 동일 평면상에 있지 않더라도 매끄러운 3차원 비틀린 곡면을 만들 수 있어, 건축 지붕 구조물이나 유기적 표면 모델링에 효과적입니다.",
      "원문의 교차기는 패치와 광선의 조건을 정리해 한 매개변수의 2차 방정식 후보를 구하고, 나머지 매개변수와 t를 검사합니다. 일반적인 뉴턴 반복의 수렴을 보장한다는 뜻은 아닙니다.",
      "pbrt-v4는 쌍선형 패치 메시(BilinearPatchMesh)를 지원하여 사각형 폴리곤(Quad Mesh) 데이터를 삼각형 분할 없이 자연스러운 곡면으로 렌더링합니다."
    ],
    "prerequisites": [
      "쌍선형 보간법 (Bilinear Interpolation: 2D 그리드 보간)",
      "괘면(Ruled Surface)의 기하학적 정의",
      "2차 방정식 근의 공식"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.6.1 쌍선형 패치의 기하학적 정의",
      "titleEn": "6.6.1 Bilinear Patch Formulation",
      "id": "ch06-06-b1"
    },
    {
      "type": "paragraph",
      "textKo": "3차원 공간에 4개의 점 $p_{00}, p_{01}, p_{10}, p_{11}$이 주어졌을 때, 각 모서리를 잇는 직선들을 마주 보며 선형 보간(Linear Interpolation)하면 부드럽게 비틀린 3차원 사각 곡면이 형성됩니다. 이를 **쌍선형 패치(Bilinear Patch)**라고 부릅니다.",
      "textEn": "Given four control points p00, p01, p10, and p11 in 3D, a bilinear patch is defined by interpolating linearly between them in parameter space (u, v) in [0, 1]^2.",
      "id": "ch06-06-b2"
    },
    {
      "type": "equation",
      "tex": "p(u, v) = (1 - u)(1 - v) p_{00} + (1 - u) v p_{01} + u (1 - v) p_{10} + u v p_{11}",
      "explanationKo": "쌍선형 패치 매개변수 곡면 방정식",
      "id": "ch06-06-b3"
    },
    {
      "type": "figure",
      "id": "fig-6-27",
      "number": "Figure 6.27",
      "title": "Original Figure 6.27",
      "titleKo": "원문 그림 6.27",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-27.png",
      "captionKo": "그림 6.27 · 쌍선형 패치의 uv에서 균일하게 뽑아도 실제 면적에서는 밀도가 달라질 수 있습니다. 면적을 근사해 보정한 표본은 패치 위에 더 고르게 놓입니다.",
      "captionEn": "Figure 6.27: Nonuniform Sample Distribution from Uniform Parametric Sampling. (a) When a bilinear patch is sampled uniformly in left-parenthesis u comma v right-parenthesis , the sample points are denser close to pairs of nearby vertices. (b) When using an approximate equal-area distribution, the points are more uniformly distributed over the patch.",
      "width": 998,
      "height": 224,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Bilinear_Patches.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "괘면(Ruled Surface)이란?",
      "summary": "괘면(Ruled Surface)이란?",
      "points": [
        {
          "title": "핵심 원리와 메커니즘",
          "content": "쌍선형 패치는 곡면이지만, 놀랍게도 $u$를 고정하고 $v$를 움직이거나 $v$를 고정하고 $u$를 움직이면 **완벽한 직선(Straight Line)**이 됩니다!\n직선을 연속적으로 움직여서 만든 곡면을 수학에서 **괘면(Ruled Surface)**이라고 부릅니다. 감자칩(쌍곡 포물면)이나 쿨링 타워가 대표적인 예입니다."
        }
      ],
      "id": "ch06-06-b5"
    },
    {
      "type": "figure",
      "id": "fig-6-28",
      "number": "Figure 6.28",
      "title": "Original Figure 6.28",
      "titleKo": "원문 그림 6.28",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-28.png",
      "captionKo": "그림 6.28 · 그림 6.27 패치의 미소 면적 |∂p/∂u×∂p/∂v|입니다. 정확한 쌍선형 함수는 아니지만 쌍선형 근사가 오차가 작고 샘플링하기 쉽습니다.",
      "captionEn": "Figure 6.28: Plot of differential area double-vertical-bar partial-differential normal p slash partial-differential u times partial-differential normal p slash partial-differential v double-vertical-bar in parametric space for the bilinear patch shown in Figure 6.27 . Although the differential area is not a bilinear function, a bilinear fit to it has low error and is easy to draw samples from.",
      "width": 998,
      "height": 453,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Bilinear_Patches.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.6.2 광선-쌍선형 패치 교차 검사 알고리즘",
      "titleEn": "6.6.2 Ray–Patch Intersection",
      "id": "ch06-06-b7"
    },
    {
      "type": "paragraph",
      "textKo": "원문은 광선과 패치의 관계를 평면들의 교차 조건으로 정리하고 u에 관한 2차식을 구합니다. 실근 후보마다 v와 t를 계산해 유효 영역을 검사합니다. 퇴화하거나 접힌 패치는 별도 주의가 필요합니다. 임의의 제어점 네 개가 언제나 매끄럽고 비특이적인 표면을 만드는 것은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-06-b8"
    },
    {
      "type": "paragraph",
      "id": "fig-6-29",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "id": "fig-6-30",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "id": "fig-blps-render",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "id": "ch06-06-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch06-06-source-figure-6-22",
      "number": "Figure 6.22",
      "title": "Original Figure 6.22",
      "titleKo": "원문 그림 6.22",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-22.png",
      "captionKo": "그림 6.22 · 네 꼭짓점이 한 평면에 있을 필요가 없는 쌍선형 패치 두 개입니다. 다양한 단순 곡면을 표현할 수 있습니다.",
      "captionEn": "Figure 6.22: Two Bilinear Patches. The bilinear patch is defined by four vertices that are not necessarily planar. It is able to represent a variety of simple curved surfaces.",
      "width": 998,
      "height": 618,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Bilinear_Patches.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-06-source-figure-6-23",
      "number": "Figure 6.23",
      "title": "Original Figure 6.23",
      "titleKo": "원문 그림 6.23",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-23.png",
      "captionKo": "그림 6.23 · 광선은 하나의 쌍선형 패치와 한 번 또는 두 번 만날 수 있습니다.",
      "captionEn": "Figure 6.23: Ray–Bilinear Patch Intersections. Rays may intersect a bilinear patch either once or two times.",
      "width": 998,
      "height": 368,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Bilinear_Patches.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-06-source-figure-6-24",
      "number": "Figure 6.24",
      "title": "Original Figure 6.24",
      "titleKo": "원문 그림 6.24",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-24.png",
      "captionKo": "그림 6.24 · 쌍선형 패치에서 u를 고정하면 서로 마주 보는 두 변을 잇는 선형 함수가 됩니다.",
      "captionEn": "Figure 6.24: Fixing the u parameter of a bilinear patch gives a linear function between two opposite edges of the patch.",
      "width": 998,
      "height": 355,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Bilinear_Patches.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-06-source-figure-6-25",
      "number": "Figure 6.25",
      "title": "Original Figure 6.25",
      "titleKo": "원문 그림 6.25",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-25.png",
      "captionKo": "그림 6.25 · 두 직선을 각각 포함하는 평행한 평면을 만들면 그 평면 사이 거리로 두 직선의 최단거리를 구할 수 있습니다. 평행선 등 퇴화 경우는 따로 다룹니다.",
      "captionEn": "Figure 6.25: The minimum distance between two lines can be computed by finding two parallel planes that contain each line and then computing the distance between them.",
      "width": 998,
      "height": 215,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Bilinear_Patches.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-06-source-figure-6-26",
      "number": "Figure 6.26",
      "title": "Original Figure 6.26",
      "titleKo": "원문 그림 6.26",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-26.png",
      "captionKo": "그림 6.26 · 이미지에 따라 밝기가 달라지는 발광 패치입니다. uv 균일 샘플링보다 이미지 밝기 분포를 따르는 샘플링이 같은 광선 수에서 더 좋은 결과를 냅니다. 이 장면의 MSE는 2.28배 개선됐습니다. 토끼 모델 제공: Stanford Computer Graphics Laboratory.",
      "captionEn": "Figure 6.26: Area Sampling Accounting for Image-Based Emission. For a scene with an emissive bilinear patch where the amount of emission varies across the patch based on an image, (a) uniformly sampling in the patch’s left-parenthesis u comma v right-parenthesis parametric space leads to high variance since some samples have much higher contributions than others. (b) Sampling according to the image’s distribution of brightness gives a significantly better result for the same number of rays. Here, MSE is improved by a factor of 2.28 times . (Bunny model courtesy of the Stanford Computer Graphics Laboratory.)",
      "width": 998,
      "height": 668,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Bilinear_Patches.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "c1eb54267d72d88d4bbea21b087b590f2ccafbd401492cdc736a3d6ed4fecbd0",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "6.6 Bilinear Patches",
      "6.6.1  Intersection Tests",
      "6.6.2  Sampling"
    ],
    "sourceFigures": [
      "6.22",
      "6.23",
      "6.24",
      "6.25",
      "6.26",
      "6.27",
      "6.28"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
