import type { SectionContent } from '../../../../types/book';

export const CH06_08_MANAGING_ROUNDING_ERROR: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "6",
  "chapterTitleKo": "제6장 3차원 형상과 교차 검사 (Shapes)",
  "sectionNumber": "6.8",
  "sectionTitle": "Managing Rounding Error",
  "sectionTitleKo": "6.8 부동소수점 반올림 오차의 엄밀한 제어 (Managing Rounding Error)",
  "originalUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
  "prevSection": {
    "id": "ch06-07",
    "title": "6.7 곡선과 모발/실 렌더링 (Curves)"
  },
  "nextSection": {
    "id": "ch07-01",
    "title": "7.1 기본 프리미티브 인터페이스"
  },
  "summary": {
    "keyTakeaways": [
      "컴퓨터의 32비트 단정밀도(Float32)는 유한한 가수부 비트로 인해 연산마다 반올림 오차(Rounding Error)가 발생하며, 이는 광선이 방금 출발한 표면과 다시 부딪히는 자가 교차(Self-Intersection) 및 검은 그림자 여드름(Shadow Acne)의 근본 원인입니다.",
      "기존 그래픽스는 광선 원점을 표면 법선 방향으로 \"대충 0.001만큼 띄우는(Ray Epsilon)\" 주먹구구식 편법을 썼지만, 이는 씬의 크기가 극단적으로 크거나 미세할 때 심각한 아티팩트와 빛 누수(Light Leaking)를 유발합니다.",
      "pbrt 제4판은 고전 수치해석학의 감마 에러 바운딩 이론(\\gamma_n = \\frac{n\\epsilon_m}{1 - n\\epsilon_m})을 기하학 파이프라인 전체에 체계적으로 적용했습니다.",
      "형상별 반올림 오차 상한을 계산해 자기 교차를 줄입니다. 분석의 가정, 장면의 퇴화 형상과 구현 조건까지 넘어선 모든 입력의 완전한 정확성을 보장하는 것은 아닙니다."
    ],
    "prerequisites": [
      "IEEE 754 부동소수점 표준 (부호, 지수부, 가수부 구조)",
      "머신 엡실론 (Machine Epsilon: Float32에서 2^-24 ≈ 1.192 × 10^-7)",
      "1.5절 부동소수점 오차와 NaN 기초"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.8.1 부동소수점의 비극: 자가 교차와 그림자 여드름",
      "titleEn": "6.8.1 The Self-Intersection Problem",
      "id": "ch06-08-b1"
    },
    {
      "type": "paragraph",
      "textKo": "빛이 벽에 닿아 반사될 때, 렌더러는 충돌 지점 $p$에서 반사 방향 $d$로 새로운 2차 광선(Secondary Ray)을 발사합니다. 수학적으로는 광선 원점이 표면 위에 있으므로 반사 광선은 표면 앞쪽으로 날아가야 마땅합니다.",
      "textEn": "When a ray strikes a surface and bounces, a secondary ray is spawned at the intersection point p in reflection direction d. Mathematically, the origin lies precisely on the surface and should proceed forward.",
      "id": "ch06-08-b2"
    },
    {
      "type": "paragraph",
      "id": "fig-6-36",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "textKo": "그러나 컴퓨터의 IEEE 754 부동소수점은 실수를 완벽하게 저장하지 못하고 반올림합니다. 이 미세한 오차 때문에 계산된 점 $p$가 표면의 바깥이 아니라 **표면의 아주 미세한 안쪽(두께 내부)**에 맺힐 수 있습니다. 그 결과, 새로 발사된 광선이 $t \\approx 0.000001$ 거리에서 방금 출발한 자기 자신의 표면과 즉각 충돌하여 빛을 차단당하고 시커먼 얼룩(그림자 여드름)을 만들어냅니다.",
      "textEn": "Because of floating-point rounding error, the computed intersection point may lie beneath the actual geometric surface. When a shadow or reflection ray is traced, it immediately hits the surface again at t ≈ 0, producing black shadow acne artifacts across the image.",
      "id": "ch06-08-b4"
    },
    {
      "type": "concept-tip",
      "badge": "⚠️ 부동소수점 주의",
      "title": "\"대충 0.001 띄우기 (Ray Epsilon)\" 편법의 한계와 재앙",
      "summary": "\"대충 0.001 띄우기 (Ray Epsilon)\" 편법의 한계와 재앙",
      "points": [
        {
          "title": "핵심 원리와 메커니즘",
          "content": "많은 초보자나 레거시 엔진은 이를 해결하기 위해 `p + 0.001f * normal`처럼 고정된 상수를 더해 광선을 허공에 살짝 띄워서 발사합니다.\n하지만 건축 모델링(1km 크기)에서는 $0.001$이 너무 작아서 여전히 검은 점이 생기고, 반대로 곤충의 눈이나 1mm 나사(0.001m 크기)를 렌더링할 때는 $0.001$ 띄우기가 물체 전체보다 커서 **빛이 물체를 통과해 뒤로 새어나가는(Light Leaking)** 끔찍한 물리적 오류가 발생합니다!\npbrt-v4는 이 주먹구구식 상수를 완전히 폐기하고, 수치해석학의 수학적 오차 바운딩을 도입했습니다."
        }
      ],
      "id": "ch06-08-b5"
    },
    {
      "type": "paragraph",
      "id": "fig-6-37",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.8.2 감마 오차 바운딩 이론 (Gamma Error Bounds)",
      "titleEn": "6.8.2 Forward Error Analysis and Gamma Bounds",
      "id": "ch06-08-b7"
    },
    {
      "type": "paragraph",
      "textKo": "최근접 반올림 등 표준 오차 모델에서 단위 반올림오차 u와 n*u<1을 전제로 γₙ=n*u/(1−n*u)를 사용합니다. 이 값이 임의의 덧셈·뺄셈 전체 결과의 상대오차 상한이라는 뜻은 아닙니다. 상쇄가 있는 내적은 항들의 절댓값 합에 γ를 곱하는 등 실제 식에 맞는 분석이 필요합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-08-b8"
    },
    {
      "type": "equation",
      "tex": "\\gamma_n=\\frac{nu}{1-nu},\\qquad u=2^{-24}\\approx5.96046448\\times10^{-8},\\qquad nu<1",
      "explanationKo": "연속 n회 부동소수점 연산의 최대 오차 상한 계수 gamma_n",
      "id": "ch06-08-b9"
    },
    {
      "type": "figure",
      "id": "fig-6-38",
      "number": "Figure 6.38",
      "title": "Original Figure 6.38",
      "titleKo": "원문 그림 6.38",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-38.png",
      "captionKo": "그림 6.38 · 그림자 광선의 원점을 너무 조금 옮기면 자기 표면과 잘못 충돌하고, 너무 많이 옮기면 진짜 가림 물체를 건너뜁니다. 장면 전체에 고정 epsilon 하나를 쓰는 방식의 문제입니다.",
      "captionEn": "Figure 6.38: Geometric Settings for Rounding-Error Issues That Can Cause Visible Errors in Images. The incident ray on the left intersects the surface. On the left, the computed intersection point (black circle) is slightly below the surface and a too-low “epsilon” offsetting the origin of the shadow ray leads to an incorrect self-intersection, as the shadow ray origin (white circle) is still below the surface; thus the light is incorrectly determined to be occluded. On the right, a too-high “epsilon” causes a valid intersection to be missed as the ray’s origin is past the occluding surface.",
      "width": 998,
      "height": 269,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "예를 들어 내적 같은 합의 계산 오차는 각 항의 크기를 이용한 절대오차 상한으로 표현할 수 있습니다. 단정밀도에서 1과 그다음 수의 간격 2⁻²³과, 최근접 반올림의 단위 반올림오차 2⁻²⁴를 구분해야 합니다. 오버플로·언더플로와 비표준 최적화에서는 가정을 다시 확인합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-08-b11"
    },
    {
      "type": "equation",
      "tex": "\\left|\\operatorname{fl}\\!\\left(\\sum_{i=1}^{n}a_i b_i\\right)-\\sum_{i=1}^{n}a_i b_i\\right|\\le\\gamma_n\\sum_{i=1}^{n}|a_i b_i|",
      "explanationKo": "표준 부동소수점 내적 오차 모델의 예입니다. 정확한 연산 순서와 FMA 사용 등에 맞춰 상한의 계수를 선택해야 합니다. 음수인 계산값에 (1±γ)를 곱한 구간이 항상 올바르다는 기존 식은 제거했습니다.",
      "id": "ch06-08-b12"
    },
    {
      "type": "figure",
      "id": "fig-6-39",
      "number": "Figure 6.39",
      "title": "Original Figure 6.39",
      "titleKo": "원문 그림 6.39",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-39.png",
      "captionKo": "그림 6.39 · 표면 아래로 계산된 교차점에서 비스듬한 광선을 만들면 원점에서 먼 곳에서 잘못 재교차할 수 있습니다. 작은 t만 버리는 방법으로는 충분하지 않을 수 있습니다.",
      "captionEn": "Figure 6.39: If the computed intersection point (filled circle) is below the surface and the spawned ray is oblique, incorrect reintersections may occur some distance from the ray origin (open circle). If a minimum t value along the ray is used to discard nearby intersections, a relatively large t Subscript normal m normal i normal n is needed to handle oblique rays well.",
      "width": 998,
      "height": 165,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-6-40",
      "number": "Figure 6.40",
      "title": "Original Figure 6.40",
      "titleKo": "원문 그림 6.40",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-40.png",
      "captionKo": "그림 6.40 · 최근접 반올림에서 정상 범위의 실수 결과와 표현 가능한 인접 부동소수점 사이의 오차는 그 간격의 절반 이내입니다. 연산별 IEEE 조건과 오버플로 등 예외는 따로 고려합니다.",
      "captionEn": "Figure 6.40: The IEEE standard specifies that floating-point calculations must be implemented as if the calculation was performed with infinite-precision real numbers and then rounded to the nearest representable float. Here, an infinite-precision result in the real numbers is denoted by a filled dot, with the representable floats around it denoted by ticks on a number line. We can see that the error introduced by rounding to the nearest float, delta , can be no more than half the spacing between floats.",
      "width": 998,
      "height": 98,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.8.3 보수적 오차 상자 기반의 SpawnRay() 안전 광선 발사",
      "titleEn": "6.8.3 Robust Ray Spawning",
      "id": "ch06-08-b15"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt-v4는 교차 검사를 마칠 때마다 단순한 점 좌표뿐만 아니라, 그 점의 3차원 오차 반경 벡터 $\\mathbf{p}_{\\text{error}} = (|\\delta x|, |\\delta y|, |\\delta z|)$를 함께 산출합니다. 그리고 새로운 광선을 발사할 때, 이 오차 상자의 바깥쪽 평면으로 광선 시작점을 **표면 법선 방향에 맞춰 정확히 밀어냅니다(SpawnRay)**.",
      "textEn": "Rather than returning a single point, pbrt associates an error vector pError with every SurfaceInteraction. When spawning a new ray, the origin is shifted along the normal just enough to strictly clear the bounding error box.",
      "id": "ch06-08-b16"
    },
    {
      "type": "figure",
      "id": "fig-6-41",
      "number": "Figure 6.41",
      "title": "Original Figure 6.41",
      "titleKo": "원문 그림 6.41",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-41.png",
      "captionKo": "그림 6.41 · near·far의 오차 범위가 겹치면 단순한 부등식 판정이 실제 교차를 놓칠 수 있습니다. far를 보수적으로 늘려 불필요한 추가 검사보다 교차 누락을 피하는 쪽을 택합니다.",
      "captionEn": "Figure 6.41: If the error bounds of the computed t Subscript normal m normal i normal n and t Subscript normal m normal a normal x values overlap, the comparison t Subscript normal m normal i normal n Baseline less-than t Subscript normal m normal a normal x may not indicate if a ray hit a bounding box. It is better to conservatively return true in this case than to miss an intersection. Extending t Subscript normal m normal a normal x by twice its error bound ensures that the comparison is conservative.",
      "width": 998,
      "height": 85,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-6-43",
      "number": "Figure 6.43",
      "title": "Original Figure 6.43",
      "titleKo": "원문 그림 6.43",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-43.png",
      "captionKo": "그림 6.43 · 계산된 교차점의 각 축 절대 오차로 작은 상자를 만듭니다. 보수적인 오차 경계라면 실제 교차점은 그 상자 안에 있습니다.",
      "captionEn": "Figure 6.43: Shape intersection algorithms in pbrt compute an intersection point, shown here in the 2D setting with a filled circle. The absolute error in this point is bounded by delta Subscript x and delta Subscript y , giving a small box around the point. Because these bounds are conservative, we know that the actual intersection point on the surface (open circle) must lie somewhere within the box.",
      "width": 998,
      "height": 276,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-6-44",
      "number": "Figure 6.44",
      "title": "Original Figure 6.44",
      "titleKo": "원문 그림 6.44",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-44.png",
      "captionKo": "그림 6.44 · 처음 계산한 교차점을 이용해 다시 교차를 계산하면 점을 실제 표면에 더 가깝게 붙일 수 있습니다. 처음 점의 오차 때문에 정확한 원래 교차 위치와는 약간 달라질 수 있습니다.",
      "captionEn": "Figure 6.44: Reintersection to Improve the Accuracy of the Computed Intersection Point. Given a ray and a surface, an initial intersection point has been computed with the ray equation (filled circle). This point may be fairly inaccurate due to rounding error but can be used as the origin for a second ray–shape intersection. The intersection point computed from this second intersection (open circle) is much closer to the surface, though it may be shifted from the true intersection point due to error in the first computed intersection.",
      "width": 998,
      "height": 205,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-6-45",
      "number": "Figure 6.45",
      "title": "Original Figure 6.45",
      "titleKo": "원문 그림 6.45",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-45.png",
      "captionKo": "그림 6.45 · 교차점의 오차 상자 밖에 놓이도록 법선 방향으로 충분히 이동한 두 후보 원점을 구합니다. 새 광선의 방향에 맞는 쪽을 골라 자기 표면과의 잘못된 재교차를 막습니다.",
      "captionEn": "Figure 6.45: Given a computed intersection point (filled circle) with surface normal (arrow) and error bounds (rectangle), we compute two planes offset along the normal that are offset just far enough so that they do not intersect the error bounds. The points on these planes along the normal from the computed intersection point give us the origins for spawned rays (open circles); one of the two is selected based on the ray direction so that the spawned ray will not pass through the error bounding box. By construction, such rays cannot incorrectly reintersect the actual surface (thick line).",
      "width": 998,
      "height": 284,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-6-46",
      "number": "Figure 6.46",
      "title": "Original Figure 6.46",
      "titleKo": "원문 그림 6.46",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-46.png",
      "captionKo": "그림 6.46 · 원점을 옮기는 계산도 반올림되므로 다시 오차 상자 안으로 들어갈 수 있습니다. 각 좌표를 바깥쪽의 다음 표현 가능한 부동소수점으로 한 단계 옮겨 이를 피합니다.",
      "captionEn": "Figure 6.46: The rounded value of the offset point p+offset computed in OffsetRayOrigin() may end up in the interior of the error box rather than on its boundary, which in turn introduces the risk of incorrect self-intersections if the rounded point is on the wrong side of the surface. Advancing each coordinate of the computed point one floating-point value away from p ensures that it is outside of the error box.",
      "width": 998,
      "height": 190,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "id": "ch06-08-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch06-08-source-figure-6-42",
      "number": "Figure 6.42",
      "title": "Original Figure 6.42",
      "titleKo": "원문 그림 6.42",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-42.png",
      "captionKo": "그림 6.42 · 멀리 있는 구의 교차 판별식을 보통 식으로 계산하면 경계 교차를 놓치거나 텍스처가 흔들릴 수 있습니다. 더 정확한 판별식이 이런 오류를 줄입니다. 그림의 거리 수치는 해당 실험의 결과입니다.",
      "captionEn": "Figure 6.42: The Effect of Reducing the Error in the Computation of the Discriminant for Ray–Sphere Intersection. Unit sphere, viewed using an orthographic projection with a camera 400 units away. (a) If the quadratic discriminant is computed in the usual fashion, numeric error causes intersections at the edges to be missed. In the found intersections, the inaccuracy is evident in the wobble of the textured lines. (b) With the more precise formulation described in this section, the sphere is rendered correctly. (With the improved discriminant, such a sphere can be translated as far as 7,500 or so units from an orthographic camera and still be rendered accurately.)",
      "width": 998,
      "height": 1073,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Managing_Rounding_Error.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "d4ff5033dfc47d3e236394040dea7c9c81071cdcda557aff94d2b9669dc4fa5e",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "6.8 Managing Rounding Error",
      "6.8.1  Floating-Point Arithmetic",
      "Floating-Point Representation",
      "Arithmetic Operations",
      "Utility Routines",
      "Error Propagation",
      "Running Error Analysis",
      "6.8.2  Conservative Ray–Bounds Intersections",
      "6.8.3  Accurate Quadratic Discriminants",
      "6.8.4  Robust Triangle Intersections",
      "6.8.5  Bounding Intersection Point Error",
      "Reprojection: Quadrics",
      "Parametric Evaluation: Triangles",
      "Parametric Evaluation: Bilinear Patches",
      "Parametric Evaluation: Curves",
      "Effect of Transformations",
      "6.8.6  Robust Spawned Ray Origins",
      "6.8.7  Avoiding Intersections behind Ray Origins",
      "Triangles",
      "Bilinear Patches",
      "6.8.8  Discussion"
    ],
    "sourceFigures": [
      "6.38",
      "6.39",
      "6.40",
      "6.41",
      "6.42",
      "6.43",
      "6.44",
      "6.45",
      "6.46"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
