import type { SectionContent } from '../../../../types/book';

export const CH08_05_STRATIFIED_SAMPLER: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "8",
  "chapterTitleKo": "제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)",
  "sectionNumber": "8.5",
  "sectionTitle": "Stratified Sampler",
  "sectionTitleKo": "8.5 계층화 샘플러 (Stratified Sampler)",
  "originalUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Stratified_Sampler.html",
  "prevSection": {
    "id": "ch08-04",
    "title": "8.4 독립 랜덤 샘플러"
  },
  "nextSection": {
    "id": "ch08-06",
    "title": "8.6 Halton 저불일치 샘플러 (Halton Sampler)"
  },
  "summary": {
    "keyTakeaways": [
      "계층화 샘플링(Stratified Sampling)은 샘플링 영역을 여러 개의 겹치지 않는 하위 영역(Strata)으로 쪼갠 뒤, 각 영역마다 정확히 정해진 개수(보통 1개)의 샘플을 지터링(Jittering)하여 추출하는 기법입니다.",
      "각 층의 표본 수를 보장해 큰 뭉침을 줄일 수 있습니다. 임의의 하위 영역에 빈틈이 없거나 모든 함수에서 분산이 극적으로 감소한다는 뜻은 아닙니다.",
      "차원의 저주(Curse of Dimensionality): 10차원 공간에서 각 축을 4등분만 해도 픽셀당 $4^{10} \\approx 100만$ 개의 샘플이 필요해지는 폭발적 샘플 증가 문제가 발생합니다.",
      "라틴 초입방체 샘플링(LHS, Latin Hypercube Sampling / N-Rooks): 체스의 룩(Rook)들이 서로를 공격하지 못하도록 행과 열에 단 하나씩만 배치하는 원리를 고차원 무작위 순열(Random Permutation)로 구현하여, 단 $N$개의 샘플만으로 모든 1D 프로젝션의 완벽한 계층화를 보장합니다."
    ],
    "prerequisites": [
      "8장 8.1 앨리어싱과 무작위 샘플링",
      "8장 8.4 독립 랜덤 샘플러(IndependentSampler)",
      "확률 통계: 조건부 분산과 분산 감소 기법(Variance Reduction)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.5.1 계층화(Stratification)와 지터링(Jittering)",
      "titleEn": "8.5.1 Stratification and Jittering",
      "id": "ch08-05-b1"
    },
    {
      "type": "paragraph",
      "textKo": "영역을 겹치지 않는 작은 부분으로 나누고 각 부분에서 정해진 수의 표본을 뽑는 것이 층화입니다. 각 칸의 중앙 대신 임의의 위치로 조금 움직이는 것을 지터링이라고 부릅니다. 지터링은 층화 구현에 사용할 수 있지만 두 단어가 모든 상황에서 같은 뜻은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-05-b2"
    },
    {
      "type": "figure",
      "id": "fig-08-22",
      "number": "Figure 8.22",
      "title": "Original Figure 8.22",
      "titleKo": "원문 그림 8.22",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-22.png",
      "captionKo": "그림 8.22 · 픽셀 위치·시간·렌즈 위치를 각각 낮은 차원에서 층화한 뒤 무작위로 짝짓습니다. 모든 차원을 동시에 격자로 나누지 않아도 각 부분 공간의 층화 이점을 얻습니다.",
      "captionEn": "Figure 8.22: We can generate a good sample pattern that reaps the benefits of stratification without requiring all the sampling dimensions to be stratified simultaneously. Here, we have split left-parenthesis x comma y right-parenthesis image position, time t , and left-parenthesis u comma v right-parenthesis lens position into independent strata with four regions each. Each is sampled independently, and then a time sample and a lens sample are randomly associated with each image sample. We retain the benefits of stratification in each stratification domain without having to exponentially increase the total number of samples.",
      "width": 998,
      "height": 337,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Stratified_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "$n_x \\times n_y$ 격자에서 $(i, j)$번째 칸에 들어가는 지터링된 2차원 샘플 좌표는 다음과 같은 단순한 공식으로 계산됩니다:",
      "textEn": "For an nx by ny grid, the sample in cell (i, j) is computed by:",
      "id": "ch08-05-b4"
    },
    {
      "type": "equation",
      "tex": "x_{i, j} = \\frac{i + \\xi_x}{n_x}, \\quad y_{i, j} = \\frac{j + \\xi_y}{n_y} \\quad (0 \\le i < n_x, \\; 0 \\le j < n_y)",
      "explanationKo": "지터링 좌표 공식: $\\xi_x, \\xi_y$는 $[0, 1)$ 범위의 독립 난수입니다. 격자 셀의 좌하단 인덱스에 난수를 더한 뒤 전체 격자 수로 나누어 정규화합니다.",
      "id": "ch08-05-b5"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.5.2 차원의 저주(Curse of Dimensionality)와 한계",
      "titleEn": "8.5.2 The Curse of Dimensionality",
      "id": "ch08-05-b6"
    },
    {
      "type": "paragraph",
      "textKo": "각 차원을 4등분한 완전 격자에는 10차원에서 $4^{10}=1,048,576$개의 칸이 생깁니다. 칸마다 한 번 계산하려면 그만큼의 표본이 필요해 비용이 커집니다. 계산 자체가 물리적으로 불가능한 것은 아닙니다. 렌더링에서는 중요한 낮은 차원 투영을 잘 층화하는 방법을 사용하여 비용과 품질의 균형을 잡습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-05-b7"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.5.3 라틴 초입방체 샘플링 (Latin Hypercube Sampling / N-Rooks)",
      "titleEn": "8.5.3 Latin Hypercube Sampling (N-Rooks Algorithm)",
      "id": "ch08-05-b8"
    },
    {
      "type": "paragraph",
      "textKo": "라틴 초입방체 표본은 각 1차원 축에 투영했을 때 N개의 구간에 하나씩 놓이도록 배치합니다. 2차원에서는 같은 행·열에 룩을 하나씩 놓는 비유로 설명할 수 있습니다. 모든 2차원·고차원 결합 영역까지 같은 정도로 층화하거나 차원의 저주를 없애는 것은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-05-b9"
    },
    {
      "type": "figure",
      "id": "fig-08-24",
      "number": "Figure 8.24",
      "title": "Original Figure 8.24",
      "titleKo": "원문 그림 8.24",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-24.png",
      "captionKo": "그림 8.24 · 독립 무작위, 지터링하지 않은 규칙적 배치, 층화 지터링의 비교입니다. 규칙적 배치는 고르게 놓여도 앨리어싱을 키울 수 있고, 지터링은 이를 덜 규칙적인 오차로 바꿉니다.",
      "captionEn": "Figure 8.24: Three 2D Sampling Patterns. (a) The independent uniform pattern is an ineffective pattern, with many clumps of samples that leave large sections of the image poorly sampled. (b) An unjittered pattern is better distributed but can exacerbate aliasing artifacts. (c) A stratified jittered pattern turns aliasing from the unjittered pattern into high-frequency noise while generally maintaining the benefits of stratification. (See Figure 8.26 for a danger of jittering, however.)",
      "width": 998,
      "height": 383,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Stratified_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "chunkName": "교육용 예제 · LatinHypercube (4판 StratifiedSampler 원문 구현 아님)",
      "language": "cpp",
      "code": "void LatinHypercube(Float *samples, int nSamples, int nDim, RNG &rng) {\n    if (!samples || nSamples <= 0 || nDim <= 0) return;\n    // 호출자는 nSamples * nDim개를 저장할 충분한 버퍼를 제공해야 합니다.\n    Float invNSamples = 1.0f / nSamples;\n    // 1. 대각선 상에 균등하게 N개의 샘플 생성\n    for (int i = 0; i < nSamples; ++i) {\n        for (int j = 0; j < nDim; ++j) {\n            Float sj = (i + rng.Uniform<Float>()) * invNSamples;\n            samples[nDim * i + j] = std::min(sj, OneMinusEpsilon);\n        }\n    }\n    // 2. 각 차원마다 인덱스를 무작위 셔플(Fisher-Yates Shuffle)\n    for (int j = 0; j < nDim; ++j) {\n        for (int i = 0; i < nSamples; ++i) {\n            int other = i + rng.Uniform<uint32_t>(nSamples - i);\n            std::swap(samples[nDim * i + j], samples[nDim * other + j]);\n        }\n    }\n}",
      "explanationKo": "라틴 초입방체 개념을 보여 주는 교육용 코드입니다. 매 차원에서 각 구간을 한 번 선택한 뒤 균일 순열로 짝짓습니다. PBRT 4판의 StratifiedSampler 전체 원문 구현을 그대로 옮긴 것은 아닙니다.",
      "provenance": "teaching",
      "id": "ch08-05-b11"
    },
    {
      "type": "figure",
      "id": "fig-08-26",
      "number": "Figure 8.26",
      "title": "Original Figure 8.26",
      "titleKo": "원문 그림 8.26",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-26.png",
      "captionKo": "그림 8.26 · 층화의 불리한 경우입니다. 2차원에서는 칸마다 하나씩 있어도 한 축으로 투영하면 최대 2n개의 표본이 거의 같은 곳에 몰릴 수 있습니다. 그림에서는 8개의 x 값이 가깝습니다.",
      "captionEn": "Figure 8.26: A Worst-Case Situation for Stratified Sampling. In an n times n 2D pattern, up to 2 n of the points may project to essentially the same point on one of the axes. When “unlucky” patterns like this are generated, the quality of the results computed with them usually suffers. (Here, 8 of the samples have nearly the same x value.)",
      "width": 998,
      "height": 417,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Stratified_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "피셔–예이츠 셔플의 균일성",
      "summary": "피셔–예이츠 셔플의 균일성",
      "points": [
        {
          "title": "핵심 설명",
          "content": "현재 위치 i에서 아직 선택하지 않은 [i,N−1] 중 하나를 균일하게 골라 교환하면 각 순열을 같은 확률로 얻습니다. 매번 전체 [0,N−1]에서 바꾸는 순진한 방식은 일반적으로 편향됩니다. 이것을 표준 라이브러리의 특정 셔플 함수 자체가 항상 잘못됐다는 설명으로 바꾸면 안 됩니다. 난수의 정수 구간 샘플링도 균일해야 합니다."
        }
      ],
      "tags": [
        "피셔예이츠",
        "순열셔플",
        "알고리즘",
        "라틴초입방체",
        "N-Rooks"
      ],
      "id": "ch08-05-b13"
    },
    {
      "type": "subheading",
      "id": "ch08-05-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch08-05-source-figure-8-23",
      "number": "Figure 8.23",
      "title": "Original Figure 8.23",
      "titleKo": "원문 그림 8.23",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-23.png",
      "captionKo": "그림 8.23 · 초점이 흐려진 보라색 구에서 독립 표본과 층화 표본을 비교합니다. 렌즈와 영상 표본을 층화한 경우 이 예제의 MSE가 3배 줄었습니다.",
      "captionEn": "Figure 8.23: Effect of Sampling Patterns in Rendering a Purple Sphere with Defocus Blur. (a) A high-quality reference image of a blurry sphere. (b) An image generated with independent random sampling without stratification. (c) An image generated with the same number of samples, but with the StratifiedSampler , which stratified both the image and, more importantly for this image, the lens samples. Stratification gives a substantial improvement and a 3 times reduction in mean squared error.",
      "width": 998,
      "height": 1087,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Stratified_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch08-05-source-figure-8-25",
      "number": "Figure 8.25",
      "title": "Original Figure 8.25",
      "titleKo": "원문 그림 8.25",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-25.png",
      "captionKo": "그림 8.25 · 지평선으로 갈수록 촘촘해지는 체커보드를 256 spp 기준 영상, 지터 없는 1 spp, 지터링 1 spp와 4 spp로 비교합니다. 표본 수와 위치가 앨리어싱의 모양에 영향을 줍니다.",
      "captionEn": "Figure 8.25: Comparison of Image Sampling Methods with a Checkerboard Texture. This is a difficult image to render well, since the checkerboard’s frequency with respect to the pixel spacing tends toward infinity as we approach the horizon. (a) A reference image, rendered with 256 samples per pixel, showing something close to an ideal result. (b) An image rendered with one sample per pixel, with no jittering. Note the jaggy artifacts at the edges of checks in the foreground. Notice also the artifacts in the distance where the checker function goes through many cycles between samples; as expected from the signal processing theory presented earlier, that detail reappears incorrectly as lower-frequency aliasing. (c) The result of jittering the image samples, still with just one sample per pixel. The regular aliasing of the second image has been replaced by less objectionable noise artifacts. (d) The result of four jittered samples per pixel is still inferior to the reference image but is substantially better than the previous result.",
      "width": 998,
      "height": 252,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Stratified_Sampler.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "6039133a3f6d33210b9d18c16b7cd83060e4c51519a9ca5bfbf46a7b6d15611f",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "8.5 Stratified Sampler"
    ],
    "sourceFigures": [
      "8.22",
      "8.23",
      "8.24",
      "8.25",
      "8.26"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
