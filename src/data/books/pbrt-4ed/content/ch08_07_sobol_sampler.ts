import type { SectionContent } from '../../../../types/book';

export const CH08_07_SOBOL_SAMPLER: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "8",
  "chapterTitleKo": "제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)",
  "sectionNumber": "8.7",
  "sectionTitle": "Sobol’ Samplers",
  "sectionTitleKo": "8.7 Sobol 저불일치 샘플러와 디지털 네트 (Sobol’ Samplers)",
  "originalUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
  "prevSection": {
    "id": "ch08-06",
    "title": "8.6 Halton 저불일치 샘플러"
  },
  "nextSection": {
    "id": "ch08-08",
    "title": "8.8 픽셀 재구성 필터링 (Image Reconstruction)"
  },
  "summary": {
    "keyTakeaways": [
      "Sobol’ 수열은 2진 생성 행렬을 사용하는 저불일치 구성입니다. 여러 구현과 무작위화 방식이 있으며 모든 장면에서 하나가 가장 좋은 것은 아닙니다.",
      "$(0,m,2)$-네트인 2차원 점 집합은 면적 $2^{-m}$인 정렬된 2진 기본 구간마다 정확히 한 점을 포함합니다. 모든 임의 직사각형이나 고차원 Sobol’ 수열의 모든 2차원 투영에 자동으로 적용되는 보장은 아닙니다.",
      "Sobol’ 좌표는 정수 비트와 방향 수의 XOR로 효율적으로 구성할 수 있습니다. 실제 비용에는 비트 순회와 무작위화 등이 포함됩니다.",
      "ZSobolSampler는 모턴 기반의 픽셀·표본 인덱싱과 무작위화를 사용해 영상 공간 오차의 분포를 개선합니다. 픽셀 간 상관관계를 모두 제거하거나 항상 최고 성능을 보장하는 방식은 아닙니다."
    ],
    "prerequisites": [
      "8장 8.6 반전 라디칼 함수와 Halton 수열",
      "이산수학: 유한체(Galois Field GF(2))와 비트 XOR 연산",
      "컴퓨터공학: 2진수 비트 연산(Bitwise Operations)과 캐시 라인"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.7.1 디지털 네트(Digital Nets)와 (0, m, 2)-시퀀스",
      "titleEn": "8.7.1 Digital Nets and (0, m, 2)-Sequences",
      "id": "ch08-07-b1"
    },
    {
      "type": "paragraph",
      "textKo": "Sobol’ 수열은 2진 생성 행렬로 다차원 점을 구성합니다. 먼저 $(0,m,2)$-네트의 예를 보면, $2^m$개 점이 정렬된 2진 기본 직사각형에 골고루 배치되는 의미를 이해할 수 있습니다. “어떤 사각형에도 한 점”이 아니라, 정해진 면적과 정렬 조건을 만족하는 기본 구간에 대한 성질입니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-07-b2"
    },
    {
      "type": "figure",
      "id": "fig-08-34",
      "number": "Figure 8.34",
      "title": "Original Figure 8.34",
      "titleKo": "원문 그림 8.34",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-34.png",
      "captionKo": "그림 8.34 · Sobol’ 수열의 첫 네 차원에 대한 생성 행렬입니다. 규칙적인 비트 구조를 보여 줍니다.",
      "captionEn": "Figure 8.34: Generator matrices for the first four dimensions of the Sobol’ sequence. Note their regular structure.",
      "width": 998,
      "height": 849,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-35",
      "number": "Figure 8.35",
      "title": "Original Figure 8.35",
      "titleKo": "원문 그림 8.35",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-35.png",
      "captionKo": "그림 8.35 · 해당 2진 기본 구간마다 표본 하나가 놓이는 점 배치입니다. 임의로 이동한 모든 직사각형에 대한 보장은 아닙니다.",
      "captionEn": "Figure 8.35: A sampling pattern that has a single sample in all the base-2 elementary intervals.",
      "width": 998,
      "height": 705,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "소볼 수열의 $n$번째 샘플의 $j$번째 차원 좌표 $x_{n, j}$는 정수 $n$의 2진수 비트들과 사전 계산된 방향 벡터(Direction Vectors, $v_{i, j}$)들의 **비트 XOR($\\oplus$) 연산**으로 단숨에 계산됩니다:",
      "textEn": "A Sobol’ coordinate is evaluated by XOR-summing direction vectors according to the binary digits of the sample index n:",
      "id": "ch08-07-b5"
    },
    {
      "type": "equation",
      "tex": "x_{n, j} = n_0 v_{0, j} \\oplus n_1 v_{1, j} \\oplus n_2 v_{2, j} \\oplus \\dots \\oplus n_{31} v_{31, j}",
      "explanationKo": "방향 수를 정수 비트열로 표현한 개념식입니다. XOR로 얻은 고정소수점 비트열을 [0,1)의 수로 바꾸어 좌표를 얻습니다. 필요한 비트 수와 반복문은 구현에 따라 다르며 루프가 없다는 뜻은 아닙니다.",
      "id": "ch08-07-b6"
    },
    {
      "type": "figure",
      "id": "fig-08-36",
      "number": "Figure 8.36",
      "title": "Original Figure 8.36",
      "titleKo": "원문 그림 8.36",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-36.png",
      "captionKo": "그림 8.36 · Sobol’의 4·5번째 차원에서 첫 256점을 그린 투영입니다. 이 투영은 고르게 분포하지 않으며 모든 기본 구간에서 층화되지도 않습니다. 기존 노트의 ‘고차원에서도 결함 없음’과 반대되는 사례입니다.",
      "captionEn": "Figure 8.36: Plot of the first 256 points from dimensions 4 and 5 of the Sobol’ sequence. The 2D projection of these two dimensions is not well distributed and is not stratified over elementary intervals.",
      "width": 998,
      "height": 438,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.7.2 디지털 수열의 무작위화: 오웬 스크램블링(Owen Scrambling)",
      "titleEn": "8.7.2 Randomization and Owen Scrambling",
      "id": "ch08-07-b8"
    },
    {
      "type": "paragraph",
      "textKo": "결정론적 저불일치 점은 무작위화를 통해 규칙적인 흔적을 줄이고 오차를 통계적으로 다룰 수 있습니다. 오웬 스크램블링은 자릿수의 앞부분에 따라 달라지는 중첩 순열을 사용하며 적절한 네트 성질을 유지합니다. 이것만으로 모든 픽셀 오차가 이상적인 청색 잡음이 되는 것은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-07-b9"
    },
    {
      "type": "figure",
      "id": "fig-08-39",
      "number": "Figure 8.39",
      "title": "Original Figure 8.39",
      "titleKo": "원문 그림 8.39",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-39.png",
      "captionKo": "그림 8.39 · 초기 64개의 2차원 Sobol’ 점을 16개씩 색으로 구분했습니다. 이웃 픽셀에 그룹을 배정하면 각 그룹과 합쳐진 그룹의 좋은 배치를 함께 이용할 수 있습니다.",
      "captionEn": "Figure 8.39: The First 64 2D Sobol’ Points, Colored in Sets of 16. If four adjacent pixels each use one of these sets for sampling, then each would not only have well-distributed points individually, but the points collectively would be decorrelated due to being from a left-parenthesis 0 comma 2 right-parenthesis -sequence.",
      "width": 998,
      "height": 284,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-40",
      "number": "Figure 8.40",
      "title": "Original Figure 8.40",
      "titleKo": "원문 그림 8.40",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-40.png",
      "captionKo": "그림 8.40 · 4×4 영상에서 픽셀당 2표본을 모턴 순서로 배정하는 예입니다. 모턴 인덱스가 6인 픽셀 (2,1)은 표본 인덱스 12와 13을 사용합니다.",
      "captionEn": "Figure 8.40: Allocating Sobol’ Samples in Morton Curve Order. With a 4 times 4 pixel image rendered using 2 samples per pixel, we can take the full set of 2 times 4 times 4 Sobol’ samples and then allocate segments of samples to pixels according to their Morton indices. For example, pixel left-parenthesis 2 comma 1 right-parenthesis has Morton index 6, so it uses samples with indices 12 and 13.",
      "width": 998,
      "height": 343,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.7.3 pbrt-v4의 혁신: ZSobolSampler와 모턴 비트 인터리빙",
      "titleEn": "8.7.3 The ZSobolSampler and Morton Bit Interleaving",
      "id": "ch08-07-b12"
    },
    {
      "type": "paragraph",
      "textKo": "ZSobolSampler는 픽셀 위치의 모턴 인덱스와 표본 인덱스를 이용하고 이를 계층적으로 재배열하여 Sobol’ 점을 배정합니다. 목표 중 하나는 이웃 픽셀의 오차가 보기 좋은 주파수 분포를 갖게 하는 것입니다. 상관관계를 무조건 없애는 것이 아니라 유용하게 설계하는 것과 구분해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-07-b13"
    },
    {
      "type": "figure",
      "id": "fig-08-46",
      "number": "Figure 8.46",
      "title": "Original Figure 8.46",
      "titleKo": "원문 그림 8.46",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-46.png",
      "captionKo": "그림 8.46 · 두 2차원 함수에서 Sobol’과 오웬 스크램블링의 오차를 비교합니다. 매끄러운 가우시안에서는 특히 2의 거듭제곱 표본 수에서 이득이 크고, 회전 체커보드에서는 같은 정도의 수렴 차수 개선은 나타나지 않습니다.",
      "captionEn": "Figure 8.46: Error When Integrating Simple 2D Functions with Sobol’ Samples. (a) Sobol’ sampling exhibits lower error and a faster asymptotic rate of convergence than independent sampling does. For a smooth function like the Gaussian, Owen scrambling the sample points gives an even better rate of convergence, especially at power-of-two numbers of sample points. (b) Using Sobol’ points is also effective for the rotated checkerboard function. Owen scrambling gives a further benefit, though without the substantial improvement in rate of convergence that was seen with the Gaussian.",
      "width": 998,
      "height": 950,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-47",
      "number": "Figure 8.47",
      "title": "Original Figure 8.47",
      "titleKo": "원문 그림 8.47",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-47.png",
      "captionKo": "그림 8.47 · 그림 8.32 장면에서 할튼과 여러 Sobol’ 샘플러의 MSE를 비교합니다. 이 장면에서는 비슷한 정도로 효과적입니다.",
      "captionEn": "Figure 8.47: Log–Log Plot of MSE When Rendering the Scene in Figure 8.32 with Low-Discrepancy Samplers. For this scene, both the Halton and Sobol’ samplers are similarly effective.",
      "width": 998,
      "height": 520,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "id": "fig-08-dragon-zsobol",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "비트 연산으로 만드는 표본",
      "summary": "비트 연산으로 만드는 표본",
      "points": [
        {
          "title": "핵심 설명",
          "content": "기저가 2이면 방향 수의 조합을 XOR와 시프트로 표현하기 편합니다. 그래도 사용하는 비트 순회, 메모리 접근, 스크램블링 비용이 남습니다. 이 특성만으로 AVX나 GPU에서 분기 없이 완벽히 병렬화되거나 나노초 성능이 보장되지는 않습니다."
        }
      ],
      "tags": [
        "소볼수열",
        "비트연산",
        "XOR",
        "디지털네트",
        "하드웨어최적화"
      ],
      "id": "ch08-07-b17"
    },
    {
      "type": "subheading",
      "id": "ch08-07-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch08-07-source-figure-8-37",
      "number": "Figure 8.37",
      "title": "Original Figure 8.37",
      "titleKo": "원문 그림 8.37",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-37.png",
      "captionKo": "그림 8.37 · 낮은 표본 수의 SobolSampler에서 저차원 투영 구조 때문에 생길 수 있는 체커보드 모양 오류입니다. Killeroo 모델 제공: headus/Rezard.",
      "captionEn": "Figure 8.37: Scene Rendered Using the SobolSampler at a Low Sampling Rate. With that sampler, these sorts of checkerboard patterns can result due to structure in the lower-dimensional projections of the form shown in Figure 8.36 . (Killeroo model courtesy of headus/Rezard.)",
      "width": 998,
      "height": 644,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch08-07-source-figure-8-38",
      "number": "Figure 8.38",
      "title": "Original Figure 8.38",
      "titleKo": "원문 그림 8.38",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-38.png",
      "captionKo": "그림 8.38 · PaddedSobolSampler와 ZSobolSampler를 1 spp로 비교합니다. 전체 오차량이 같아도 두 번째는 청색 잡음 특성 때문에 더 좋아 보입니다. 용 모델 제공: Stanford Computer Graphics Laboratory.",
      "captionEn": "Figure 8.38: The Benefit of Blue Noise with Padded Sobol’ Points. (a) Rendered using the PaddedSobolSampler . (b) Rendered with the ZSobolSampler . Both images are rendered using 1 sample per pixel and have the same overall error, but the second image looks much better thanks to a blue noise distribution of error. (Dragon model courtesy of the Stanford Computer Graphics Laboratory.)",
      "width": 998,
      "height": 733,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch08-07-source-figure-8-41",
      "number": "Figure 8.41",
      "title": "Original Figure 8.41",
      "titleKo": "원문 그림 8.41",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-41.png",
      "captionKo": "그림 8.41 · 모턴 인덱스에 순열을 적용하지 않고 배정하면 영상에 규칙적 구조가 남습니다. 그림 8.38의 순열 적용 결과와 비교합니다. 용 모델 제공: Stanford Computer Graphics Laboratory.",
      "captionEn": "Figure 8.41: If a regular Morton curve without permutations is used to allocate Sobol’ indices in pixels, visible structure will be present in the rendered image. (Compare with Figure 8.38 (b) where such a permutation is used.) (Dragon model courtesy of the Stanford Computer Graphics Laboratory.)",
      "width": 998,
      "height": 683,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch08-07-source-figure-8-42",
      "number": "Figure 8.42",
      "title": "Original Figure 8.42",
      "titleKo": "원문 그림 8.42",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-42.png",
      "captionKo": "그림 8.42 · 모턴 인덱스를 4진 자릿수로 해석해 순열을 적용합니다. 큰 블록의 방문 순서를 바꾸고 블록 안의 순서도 바꾸되 공간적인 계층 구조는 유지합니다.",
      "captionEn": "Figure 8.42: If pixels’ Morton indices are interpreted as base-4 numbers and their digits are randomly permuted, the resulting curve is still spatially coherent. (a) Applying the permutation shown to the first base-4 digit for a 4 times 4 pixel image causes the 2 times 2 blocks of pixels to be visited in a different order than the usual Morton curve. (b) If the second base-4 digit is also permuted (here with different permutations for each 2 times 2 block, not shown), then the pixels within each block are also visited in different orders.",
      "width": 998,
      "height": 254,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch08-07-source-figure-8-43",
      "number": "Figure 8.43",
      "title": "Original Figure 8.43",
      "titleKo": "원문 그림 8.43",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-43.png",
      "captionKo": "그림 8.43 · Sobol’ 표본의 무작위화 방식별 파워 스펙트럼입니다. 자릿수 순열만으로는 제한적인 이득이 있고, 빠른 또는 해시 기반 오웬 스크램블링은 더 크게 개선합니다.",
      "captionEn": "Figure 8.43: Power Spectral Density of the Sobol’ Point Set. (a) Unscrambled, (b) scrambled using random digit permutations, (c) scrambled using the FastOwenScrambler , (d) scrambled using hashed Owen scrambling. The unscrambled Sobol’ points have a remarkably bad power spectral density (PSD) and random digit permutations are of only slight benefit. Owen scrambling greatly improves the PSD.",
      "width": 998,
      "height": 747,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch08-07-source-figure-8-44",
      "number": "Figure 8.44",
      "title": "Original Figure 8.44",
      "titleKo": "원문 그림 8.44",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-44.png",
      "captionKo": "그림 8.44 · 4×4 층화 표본을 길쭉한 광원에 매핑하면 짧은 방향의 층화가 크게 도움이 되지 않을 수 있습니다. Sobol’ 표본은 이런 변형 뒤에도 더 고른 배치를 유지할 수 있습니다.",
      "captionEn": "Figure 8.44: (a) Transforming a 4 times 4 stratified sampling pattern to points on a long and thin quadrilateral light source effectively gives fewer than 16 well-distributed samples; stratification in the vertical direction is not helpful. (b) Samples from the Sobol’ sequence remain well distributed even after this transformation.",
      "width": 998,
      "height": 132,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch08-07-source-figure-8-45",
      "number": "Figure 8.45",
      "title": "Original Figure 8.45",
      "titleKo": "원문 그림 8.45",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-45.png",
      "captionKo": "그림 8.45 · 피사계 심도에서 여러 샘플러를 16 spp로 비교합니다. 층화의 MSE를 1로 놓으면 할튼 1.44, PaddedSobol 0.96, Sobol 0.64, ZSobol 0.84입니다. 이 특정 예제의 결과이지 고정적인 순위는 아닙니다.",
      "captionEn": "Figure 8.45: Comparisons of the Halton and Various Sobol’ Samplers for Rendering Depth of Field. Mean squared error is reported normalized to that of the stratified sampler. (a) An image rendered using the StratifiedSampler (normalized MSE 1), (b) an image rendered using the HaltonSampler (normalized MSE 1.44), (c) an image rendered using the PaddedSobolSampler (normalized MSE 0.96), (d) an image rendered using the SobolSampler (normalized MSE 0.64), and (e) an image rendered using the ZSobolSampler (normalized MSE 0.84). All the low-discrepancy samplers use hashed Owen scrambling for randomization and 16 samples per pixel.",
      "width": 998,
      "height": 1088,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "42fc09d43732215adb1327d2c8170cbe911e5ea321cbe2ff63d3a862d66af398",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "8.7 Sobol’ Samplers",
      "8.7.1  Stratification over Elementary Intervals",
      "8.7.2  Randomization and Scrambling",
      "8.7.3  Sobol’ Sample Generation",
      "8.7.4  Global Sobol’ Sampler",
      "8.7.5  Padded Sobol’ Sampler",
      "8.7.6  Blue Noise Sobol’ Sampler",
      "8.7.7  Evaluation"
    ],
    "sourceFigures": [
      "8.34",
      "8.35",
      "8.36",
      "8.37",
      "8.38",
      "8.39",
      "8.40",
      "8.41",
      "8.42",
      "8.43",
      "8.44",
      "8.45",
      "8.46",
      "8.47"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
