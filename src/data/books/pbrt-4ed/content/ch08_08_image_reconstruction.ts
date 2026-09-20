import type { SectionContent } from '../../../../types/book';

export const CH08_08_IMAGE_RECONSTRUCTION: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "8",
  "chapterTitleKo": "제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)",
  "sectionNumber": "8.8",
  "sectionTitle": "Image Reconstruction",
  "sectionTitleKo": "8.8 픽셀 재구성 필터링 (Image Reconstruction)",
  "originalUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
  "prevSection": {
    "id": "ch08-07",
    "title": "8.7 Sobol 저불일치 샘플러"
  },
  "nextSection": {
    "id": "ch09-01",
    "title": "9.1 BSDF 표면 반사 인터페이스 (BSDF Representation)"
  },
  "summary": {
    "keyTakeaways": [
      "이미지 재구성은 주변 표본의 빛 기여를 필터와 센서 응답에 맞추어 모으는 과정입니다. 방사휘도와 사람의 시감도로 가중한 휘도는 구분합니다.",
      "상자 필터는 범위 안에 같은 가중치를 주는 저렴한 방법입니다. 주파수 응답의 단점이 있지만 항상 심한 앨리어싱이 생기거나 최종 렌더링에 쓸 수 없는 것은 아닙니다.",
      "필터 설계의 3대 딜레마: 블러링(Blurring, 세부 디테일 소실), 링잉(Ringing, 날카로운 경계선 주변에 후광이 생기는 오버슈트 현상), 앨리어싱(Aliasing).",
      "미첼–네트라발리 필터는 B,C로 모양을 조절하는 3차 필터 계열입니다. B=C=1/3은 흐림과 링잉을 절충하는 선택이며 모든 영상에서 최적이라는 증명은 아닙니다.",
      "란초스(Lanczos / Windowed Sinc) 필터는 이론상 이상적인 신호 복원기인 싱크(Sinc) 함수에 윈도우를 씌워 유한한 반경 안에서 극도로 날카롭고 선명한 이미지를 재구성합니다."
    ],
    "prerequisites": [
      "8장 8.1 푸리에 변환과 이상적인 싱크 복원 필터",
      "8장 8.2 픽셀 가중 적분 공식",
      "수학: 3차 스플라인(Cubic Splines)과 연속성($C^0, C^1$)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.8.1 이미지 재구성 필터링의 수학적 원리",
      "titleEn": "8.8.1 Mathematical Principles of Image Reconstruction",
      "id": "ch08-08-b1"
    },
    {
      "type": "paragraph",
      "textKo": "픽셀 주변의 표본을 필터 가중치로 모으면 아래와 같은 정규화 가중평균을 생각할 수 있습니다. 이는 같은 표본 밀도를 가정한 직관적 식입니다. 비균일하게 표본을 뽑는 구현에서는 실제 샘플링 밀도의 보정이 필요하며, PBRT의 필터 샘플링·Film 누적 방식도 함께 확인해야 합니다. 분모가 0인 경우도 별도로 처리합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-08-b2"
    },
    {
      "type": "equation",
      "tex": "I(x_p, y_p) = \\frac{\\sum_{i} w(x_i - x_p, \\; y_i - y_p) \\cdot L(x_i, y_i)}{\\sum_{i} w(x_i - x_p, \\; y_i - y_p)}",
      "explanationKo": "L은 여기서 표본이 제공하는 빛 기여를 간단히 나타냅니다. 필터의 유효 범위 안에 있는 표본을 합하며 음수 가중치를 가진 필터에서는 상쇄와 분모의 처리에도 주의합니다. 모든 샘플러의 비편향 추정량을 이 비율 식 하나로 대체하지 않습니다.",
      "id": "ch08-08-b3"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.8.2 필터 설계의 3대 딜레마 (블러링, 링잉, 앨리어싱)",
      "titleEn": "8.8.2 The Filter Dilemma: Blurring, Ringing, and Aliasing",
      "id": "ch08-08-b4"
    },
    {
      "type": "paragraph",
      "textKo": "이상적인 수학적 필터를 정의할 수는 있지만, 유한한 계산 비용·선명도·링잉·앨리어싱을 동시에 모두 최적으로 만드는 실용 필터는 없습니다. 목적에 맞게 절충합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-08-b5"
    },
    {
      "type": "figure",
      "id": "fig-08-49",
      "number": "Figure 8.49",
      "title": "Original Figure 8.49",
      "titleKo": "원문 그림 8.49",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-49.png",
      "captionKo": "그림 8.49 · 필터 반경은 원점에서 유효 범위 끝까지 거리입니다. 그림처럼 대칭이면 전체 지지 구간의 폭은 반경의 두 배입니다.",
      "captionEn": "Figure 8.49: The extent of filters in pbrt is specified in terms of each one’s radius from the origin to its cutoff point. The support of a filter is its total nonzero extent, here equal to twice its radius.",
      "width": 998,
      "height": 298,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-50",
      "number": "Figure 8.50",
      "title": "Original Figure 8.50",
      "titleKo": "원문 그림 8.50",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-50.png",
      "captionKo": "그림 8.50 · 필터 함수와 셀 중앙에서 만든 구간별 상수 샘플링 분포입니다. 정확한 f를 근사 PDF p로 나누면 표본별 f/p가 크게 달라질 수 있어, FilterSampler는 평가에도 같은 구간별 상수 근사를 사용합니다.",
      "captionEn": "Figure 8.50: Filter function f left-parenthesis x right-parenthesis and a piecewise-constant sampling distribution p left-parenthesis x right-parenthesis found by evaluating it at the center of each cell, as is done by the FilterSampler . If filter positions are found by sampling from p left-parenthesis x right-parenthesis and contributions are weighted using the ratio f left-parenthesis x right-parenthesis slash p left-parenthesis x right-parenthesis , then different samples may have very different contributions. For example, the two points shown have a 10 times difference in their f left-parenthesis x right-parenthesis slash p left-parenthesis x right-parenthesis values. This variation in filter weights can lead to variance in images and therefore the FilterSampler uses the same piecewise-constant approximation of f left-parenthesis x right-parenthesis for evaluation as is used for sampling.",
      "width": 998,
      "height": 270,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-51",
      "number": "Figure 8.51",
      "title": "Original Figure 8.51",
      "titleKo": "원문 그림 8.51",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-51.png",
      "captionKo": "그림 8.51 · 상자와 삼각 필터의 그래프입니다. 계산이 저렴하고 구현하기 쉬워 다른 필터의 기준으로도 유용합니다.",
      "captionEn": "Figure 8.51: Graphs of the (a) box filter and (b) triangle filter. Although neither of these is a particularly good filter, they are both computationally efficient, easy to implement, and good baselines for evaluating other filters.",
      "width": 998,
      "height": 286,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-52",
      "number": "Figure 8.52",
      "title": "Original Figure 8.52",
      "titleKo": "원문 그림 8.52",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-52.png",
      "captionKo": "그림 8.52 · 상자 필터로 계단과 점점 빨라지는 사인파를 복원합니다. 계단에는 잘 맞지만 빠른 사인파에는 좋지 않은 결과를 냅니다.",
      "captionEn": "Figure 8.52: The box filter reconstructing (a) a step function and (b) a sinusoidal function with increasing frequency as x increases. This filter does well with the step function, as expected, but does an extremely poor job with the sinusoidal function.",
      "width": 998,
      "height": 690,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.8.3 미첼–네트라발리 필터와 매개변수",
      "titleEn": "8.8.3 The Mitchell-Netravali Filter: The Golden Standard",
      "id": "ch08-08-b10"
    },
    {
      "type": "paragraph",
      "textKo": "미첼–네트라발리 필터는 두 매개변수 B와 C로 표현하는 조각별 3차 다항식 계열입니다. 매개변수에 따라 흐림, 링잉, 선명도가 달라집니다. 아래 식은 표준화한 좌표에서의 표현이며, 실제 필터 반경에 맞춘 좌표 변환이 별도로 필요합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-08-b11"
    },
    {
      "type": "equation",
      "tex": "w(x) = \\frac{1}{6} \\begin{cases} (12 - 9B - 6C)|x|^3 + (-18 + 12B + 6C)|x|^2 + (6 - 2B), & |x| < 1 \\\\ (-B - 6C)|x|^3 + (6B + 30C)|x|^2 + (-12B - 48C)|x| + (8B + 24C), & 1 \\le |x| < 2 \\\\ 0, & |x| \\ge 2 \\end{cases}",
      "explanationKo": "매개변수 B,C에 따른 필터 계열의 식입니다. 음수 로브의 유무와 구간은 매개변수에 따라 다릅니다. B=C=1/3인 경우에도 1부터2까지의 전체 구간이 모두 음수인 것은 아닙니다.",
      "id": "ch08-08-b12"
    },
    {
      "type": "figure",
      "id": "fig-08-53",
      "number": "Figure 8.53",
      "title": "Original Figure 8.53",
      "titleKo": "원문 그림 8.53",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-53.png",
      "captionKo": "그림 8.53 · 가우시안과 B=C=1/3인 미첼 필터의 그래프입니다. 가우시안은 부드럽고 미첼의 음수 로브는 경계를 더 선명하게 보이게 할 수 있습니다.",
      "captionEn": "Figure 8.53: Graphs of (a) the Gaussian filter and (b) the Mitchell filter with upper B equals one-third and upper C equals one-third , each with a width of 2. The Gaussian gives images that tend to be a bit blurry, while the negative lobes of the Mitchell filter help to accentuate and sharpen edges in final images.",
      "width": 998,
      "height": 296,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-54",
      "number": "Figure 8.54",
      "title": "Original Figure 8.54",
      "titleKo": "원문 그림 8.54",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-54.png",
      "captionKo": "그림 8.54 · 미첼 필터로 계단·사인파를 복원한 예입니다. 계단의 링잉을 작게 유지하고, 표본 부족 앨리어싱이 지배하기 전까지 사인파를 잘 표현합니다.",
      "captionEn": "Figure 8.54: The Mitchell–Netravali Filter Used to Reconstruct the Example Functions. It does a good job with both of these functions, (a) introducing minimal ringing with the step function and (b) accurately representing the sinusoid until aliasing from undersampling starts to dominate.",
      "width": 998,
      "height": 671,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.8.4 윈도우드 싱크 (Windowed Sinc / Lanczos) 필터",
      "titleEn": "8.8.4 Windowed Sinc and the Lanczos Filter",
      "id": "ch08-08-b15"
    },
    {
      "type": "paragraph",
      "textKo": "이상적인 sinc 필터는 무한한 지지 범위를 가지며 꼬리의 크기는 대략 $1/|x|$로 감소합니다. “감쇠하지 않는다”가 아니라 유한 거리에서 정확히 0으로 끝나지 않는다는 뜻입니다. 창 함수를 곱하고 범위를 제한하면 유한한 계산으로 근사할 수 있지만, 이상적인 주파수 차단 특성도 달라집니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-08-b16"
    },
    {
      "type": "equation",
      "tex": "w_{\\text{Lanczos}}(x) = \\text{sinc}(x) \\cdot \\text{sinc}\\left(\\frac{x}{\\tau}\\right) = \\frac{\\sin(\\pi x)}{\\pi x} \\cdot \\frac{\\sin(\\pi x / \\tau)}{\\pi x / \\tau} \\quad (|x| < \\tau)",
      "explanationKo": "표준적인 Lanczos 창의 교육용 표현입니다. |x|≥τ에서 0으로 둡니다. PBRT의 WindowedSinc는 반경과 tau를 따로 받으므로 이 식의 반경과 같은 것으로 무조건 바꾸면 안 됩니다. x=0에서는 극한값 1을 사용합니다.",
      "id": "ch08-08-b17"
    },
    {
      "type": "figure",
      "id": "fig-08-55",
      "number": "Figure 8.55",
      "title": "Original Figure 8.55",
      "titleKo": "원문 그림 8.55",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-55.png",
      "captionKo": "그림 8.55 · 잘라낸 sinc 함수와 Lanczos 창, 그리고 그 둘을 곱한 필터입니다. 주파수를 완벽히 잘라내는 이상적인 필터와 동일하지 않습니다.",
      "captionEn": "Figure 8.55: Graphs of the Sinc Filter. (a) The sinc function, truncated after three cycles (blue line) and the Lanczos windowing function (red line). (b) The product of these two functions, as implemented in the LanczosSincFilter .",
      "width": 998,
      "height": 318,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-56",
      "number": "Figure 8.56",
      "title": "Original Figure 8.56",
      "titleKo": "원문 그림 8.56",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-56.png",
      "captionKo": "그림 8.56 · τ=3의 windowed sinc로 계단과 사인파를 복원합니다. 계단에서는 링잉이 남지만 무한 sinc보다 줄고, 사인파에서는 좋은 결과를 보입니다.",
      "captionEn": "Figure 8.56: Results of Using the Windowed Sinc Filter to Reconstruct the Example Functions. Here, tau equals 3 . (a) Like the infinite sinc, it suffers from ringing with the step function, although there is much less ringing in the windowed version. (b) The filter does quite well with the sinusoid, however.",
      "width": 998,
      "height": 671,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "필터는 목표와 장면에 맞추어 고릅니다",
      "summary": "필터는 목표와 장면에 맞추어 고릅니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "같은 장면·샘플 수·표시 크기에서 경계의 링잉, 미세 무늬, 흐림을 비교하세요. 상자는 저렴하고 단순하며, 가우시안은 부드러움을, 미첼이나 windowed sinc는 선명도와 다른 절충을 제공합니다. 특정 렌더러의 기본값을 확인하지 않고 같다고 단정하거나 한 필터를 절대로 쓰지 말라고 할 필요는 없습니다."
        }
      ],
      "tags": [
        "미첼필터",
        "란초스필터",
        "이미지재구성",
        "안티앨리어싱",
        "픽셀필터"
      ],
      "id": "ch08-08-b20"
    },
    {
      "type": "subheading",
      "id": "ch08-08-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch08-08-source-figure-8-48",
      "number": "Figure 8.48",
      "title": "Original Figure 8.48",
      "titleKo": "원문 그림 8.48",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-48.png",
      "captionKo": "그림 8.48 · 왕관 영상의 상자·가우시안·미첼 복원 필터 비교입니다. 이 예제에서는 미첼이 선명하고 가우시안은 흐리며 상자는 경계 계단이 두드러집니다. 모델 제공: Martin Lubich.",
      "captionEn": "Figure 8.48: The pixel reconstruction filter used to convert the image samples into pixel values can have a noticeable effect on the character of the final image. Here, we see enlargements of a region of the imperial crown model, filtered with (a) the box filter, (b) Gaussian filter, and (c) Mitchell–Netravali filter. Note that the Mitchell filter gives the sharpest image, while the Gaussian blurs it. The box filter is the least desirable, since it allows high-frequency aliasing to leak into the final image. (Note the stair-step pattern along bright gold edges, for example.) (Crown model courtesy of Martin Lubich.)",
      "width": 998,
      "height": 595,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "291d0085da163fe22c51bd5e722511fb6c0a0c4623b405a34294969014e20bdf",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "8.8 Image Reconstruction",
      "8.8.1  Filter Interface",
      "8.8.2  FilterSampler",
      "8.8.3  Box Filter",
      "8.8.4  Triangle Filter",
      "8.8.5  Gaussian Filter",
      "8.8.6  Mitchell Filter",
      "8.8.7  Windowed Sinc Filter"
    ],
    "sourceFigures": [
      "8.48",
      "8.49",
      "8.50",
      "8.51",
      "8.52",
      "8.53",
      "8.54",
      "8.55",
      "8.56"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
