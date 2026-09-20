import type { SectionContent } from '../../../../types/book';

export const CH08_06_HALTON_SAMPLER: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "8",
  "chapterTitleKo": "제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)",
  "sectionNumber": "8.6",
  "sectionTitle": "Halton Sampler",
  "sectionTitleKo": "8.6 Halton 저불일치 샘플러 (Halton Sampler)",
  "originalUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Halton_Sampler.html",
  "prevSection": {
    "id": "ch08-05",
    "title": "8.5 계층화 샘플러"
  },
  "nextSection": {
    "id": "ch08-07",
    "title": "8.7 Sobol 저불일치 샘플러 (Sobol’ Samplers)"
  },
  "summary": {
    "keyTakeaways": [
      "Halton 수열은 준몬테카를로(QMC) 렌더링에서 가장 대표적인 저불일치 수열(Low-Discrepancy Sequence)로, 반전 라디칼 함수(Van der Corput Radical Inverse)를 기반으로 작동합니다.",
      "반전 라디칼은 정수의 b진 자릿수를 소수점 아래로 뒤집어 점을 만듭니다. 임의의 기저에서 항상 현재 가장 큰 빈틈의 정중앙을 선택하는 탐색 알고리즘은 아닙니다.",
      "차원마다 다른 소수 기저를 사용해 다차원 점을 구성합니다. 수학적 구성의 확장 가능성과 실제 구현의 최대 지원 차원은 구분합니다.",
      "큰 소수 기저와 적은 표본에서 상관관계가 두드러질 수 있습니다. 자릿수 스크램블링은 이를 완화하지만 모든 함수·표본 수에서 오류를 완전히 없애지는 않습니다."
    ],
    "prerequisites": [
      "8장 8.2 별-불일치도(Star Discrepancy)와 QMC 이론",
      "정수론: $b$진법 자릿수 전개 및 서로소(Coprime) 소수 기저"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.6.1 반전 라디칼 함수 (Van der Corput Radical Inverse)",
      "titleEn": "8.6.1 The Van der Corput Radical Inverse",
      "id": "ch08-06-b1"
    },
    {
      "type": "paragraph",
      "textKo": "반 데르 코르푸트 수열의 핵심은 정수의 자릿수를 소수점 아래로 반전하는 것입니다. 이 구조로 일정 개수의 점을 모았을 때 구간을 고르게 채우는 성질을 얻습니다. 아래에서는 그 구성 방법을 숫자로 확인합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-06-b2"
    },
    {
      "type": "paragraph",
      "textKo": "임의의 양의 정수 $n$을 기저 $b$ 진법으로 표기하면 다음과 같이 전개할 수 있습니다:",
      "textEn": "Any integer n can be expressed in base b as a polynomial in powers of b:",
      "id": "ch08-06-b3"
    },
    {
      "type": "equation",
      "tex": "n = \\sum_{i=0}^{M} a_i b^i = a_M b^M + \\dots + a_1 b + a_0 \\quad (0 \\le a_i < b)",
      "explanationKo": "정수의 b진법 표현: $a_i$는 $b$진법에서의 각 자릿수 계수입니다.",
      "id": "ch08-06-b4"
    },
    {
      "type": "paragraph",
      "textKo": "이 정수의 자릿수 $a_i$들을 소수점 아래로 그대로 반전(Radical Inverse)시켜 $[0, 1)$ 범위의 실수 $\\Phi_b(n)$을 만듭니다:",
      "textEn": "The radical inverse function Phi_b(n) reflects these digits across the radix point into [0, 1):",
      "id": "ch08-06-b5"
    },
    {
      "type": "equation",
      "tex": "\\Phi_b(n) = \\sum_{i=0}^{M} a_i b^{-(i+1)} = 0.a_0 a_1 a_2 \\dots a_M \\; (\\text{base } b)",
      "explanationKo": "반전 라디칼 함수 공식: 1의 자리 숫자 $a_0$가 $b^{-1}$의 자리로 가고, $b$의 자리 숫자 $a_1$이 $b^{-2}$의 자리로 이동합니다.",
      "id": "ch08-06-b6"
    },
    {
      "type": "figure",
      "id": "fig-08-27",
      "number": "Figure 8.27",
      "title": "Original Figure 8.27",
      "titleKo": "원문 그림 8.27",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-27.png",
      "captionKo": "그림 8.27 · 2차원 Halton의 초기 216점과 Hammersley의 초기 256점입니다. 정수의 비트 반전 과정을 단계별로 그린 그림은 아닙니다.",
      "captionEn": "Figure 8.27: The First Points of Two Low-Discrepancy Sequences in 2D. (a) Halton (216 points), (b) Hammersley (256 points).",
      "width": 998,
      "height": 413,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Halton_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.6.2 다차원 할튼 수열 (The Halton Sequence)",
      "titleEn": "8.6.2 The Halton Sequence",
      "id": "ch08-06-b8"
    },
    {
      "type": "paragraph",
      "textKo": "1960년 존 할튼(John Halton)은 반 데르 코르푸트의 1차원 수열을 임의의 고차원 공간으로 확장했습니다. 각 차원 $d$마다 서로 나누어떨어지지 않는 서로소(Coprime) 소수들($b_1=2, b_2=3, b_3=5, b_4=7, b_5=11, \\dots$)을 기저로 지정하여 다차원 점 $x_n$을 만듭니다:",
      "textEn": "The Halton sequence extends the van der Corput construction to arbitrary dimensions by pairing distinct prime bases for each coordinate axis:",
      "id": "ch08-06-b9"
    },
    {
      "type": "equation",
      "tex": "x_n = \\Big( \\Phi_{p_1}(n), \\; \\Phi_{p_2}(n), \\; \\Phi_{p_3}(n), \\; \\dots, \\; \\Phi_{p_d}(n) \\Big)",
      "explanationKo": "차원마다 서로 다른 소수 기저의 반전 라디칼을 사용합니다. 이는 결정론적인 점 배치이며 좌표들의 확률적 독립을 보장한다는 뜻은 아닙니다.",
      "id": "ch08-06-b10"
    },
    {
      "type": "figure",
      "id": "fig-08-28",
      "number": "Figure 8.28",
      "title": "Original Figure 8.28",
      "titleKo": "원문 그림 8.28",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-28.png",
      "captionKo": "그림 8.28 · 높은 소수 기저인 29와 31의 할튼 좌표 투영에서 나타나는 규칙적 구조와 스크램블링의 효과를 비교합니다.",
      "captionEn": "Figure 8.28: Plot of Halton Sample Values with and without Scrambling. (a) In higher dimensions, projections of sample values start to exhibit regular structure. Here, points from the dimensions left-parenthesis normal upper Phi 29 left-parenthesis a right-parenthesis comma normal upper Phi 31 left-parenthesis a right-parenthesis right-parenthesis are shown. (b) Scrambled sequences based on Equation ( 8.20 ) break up this structure by permuting the digits of sample indices.",
      "width": 998,
      "height": 413,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Halton_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-29",
      "number": "Figure 8.29",
      "title": "Original Figure 8.29",
      "titleKo": "원문 그림 8.29",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-29.png",
      "captionKo": "그림 8.29 · 할튼 표본의 스크램블링 방식별 파워 스펙트럼 비교입니다. 단순 자릿수 순열에도 일부 스파이크가 남지만 오웬 스크램블링은 높은 주파수 분포를 더 고르게 만듭니다.",
      "captionEn": "Figure 8.29: Power Spectra of Points Generated by the HaltonSampler . (a) Using no randomization, with substantial variation in power at the higher frequencies. (b) Using random digit scrambling, which improves the regularity of the PSD but still contains some spikes. (c) Using Owen scrambling, which gives near unit power at the higher frequencies, making it especially effective for antialiasing and integration.",
      "width": 998,
      "height": 826,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Halton_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.6.3 고차원 상관관계 왜곡과 스크램블링(Scrambling)",
      "titleEn": "8.6.3 High-Dimensional Correlation and Scrambling",
      "id": "ch08-06-b13"
    },
    {
      "type": "paragraph",
      "textKo": "할튼 수열에서 큰 소수 기저를 사용하면 적은 수의 초기 표본에 상관관계나 띠 모양이 두드러질 수 있습니다. 문제가 시작되는 차원이 언제나 15나 20으로 고정된 것은 아닙니다. 기저, 표본 개수, 스크램블링 방식과 사용하는 투영에 따라 달라집니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-06-b14"
    },
    {
      "type": "figure",
      "id": "fig-08-30",
      "number": "Figure 8.30",
      "title": "Original Figure 8.30",
      "titleKo": "원문 그림 8.30",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-30.png",
      "captionKo": "그림 8.30 · 체커보드에서 층화 1 spp와 스크램블링하지 않은 할튼 1 spp를 비교합니다. 할튼이 더 먼 무늬를 표현해도 오차의 규칙적인 구조가 눈에 거슬릴 수 있습니다.",
      "captionEn": "Figure 8.30: Comparison of the Stratified Sampler to a Low-Discrepancy Sampler Based on Halton Points on the Image Plane. (a) The stratified sampler with a single sample per pixel and (b) the Halton sampler with a single sample per pixel and no scrambling. Note that although the Halton pattern is able to reproduce the checker pattern farther toward the horizon than the stratified pattern, there is a regular structure to the error that is visually distracting; it does not turn aliasing into less objectionable noise as well as jittering does.",
      "width": 998,
      "height": 311,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Halton_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-31",
      "number": "Figure 8.31",
      "title": "Original Figure 8.31",
      "titleKo": "원문 그림 8.31",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-31.png",
      "captionKo": "그림 8.31 · 가우시안과 회전한 체커보드 적분의 MSE입니다. 매끄러운 함수와 불연속 함수에서 샘플러의 수렴 이점이 다르며, 층이 무늬보다 작아지면 층화의 이점이 나타납니다.",
      "captionEn": "Figure 8.31: Mean Squared Error When Integrating Two Simple 2D Functions. Both are plotted using a log–log scale so that the asymptotic convergence rate can be seen from the slopes of the lines. For the stratified sampler, only square n times n stratifications are plotted. (a) With the smooth Gaussian function shown, the Halton sampler has a higher asymptotic rate of convergence than both stratified and independent sampling. Its performance is particularly good for sample counts of 2 Superscript i Baseline 3 Superscript i for integer i . (b) With the rotated checkerboard, stratified sampling is initially no better than independent sampling since the strata are not aligned with the checks. However, once the strata start to become smaller than the checks (around 256 samples), its asymptotic rate of convergence improves.",
      "width": 998,
      "height": 675,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Halton_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.6.4 실전 렌더링 성능 벤치마크 (Dragon Scene MSE)",
      "titleEn": "8.6.4 Practical Rendering Benchmark on the Dragon Scene",
      "id": "ch08-06-b17"
    },
    {
      "type": "figure",
      "id": "fig-08-dragon-mse",
      "number": "Figure 8.32",
      "title": "Original Figure 8.32",
      "titleKo": "원문 그림 8.32",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-32.png",
      "captionKo": "그림 8.32 · 피사계 심도, 카메라 이동, 환경광의 여러 번 산란을 포함한 샘플러 평가 장면입니다. 수십 차원의 적분이 필요합니다. 용 모델 제공: Stanford Computer Graphics Laboratory.",
      "captionEn": "Figure 8.32: Test Scene for Sampler Evaluation. This scene requires integrating a function of tens of dimensions, including defocus blur, a moving camera, and multiply scattered illumination from an environment map light source. (Dragon model courtesy of the Stanford Computer Graphics Laboratory.)",
      "width": 998,
      "height": 684,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Halton_Sampler.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-dragon-render",
      "number": "Figure 8.33",
      "title": "Original Figure 8.33",
      "titleKo": "원문 그림 8.33",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-33.png",
      "captionKo": "그림 8.33 · 그림 8.32 장면에서 표본 수와 MSE의 로그 그래프입니다. 이 예제에서는 할튼이 독립·층화 표본보다 낮은 오차와 조금 더 빠른 수렴을 보입니다.",
      "captionEn": "Figure 8.33: Log–Log Plot of MSE versus Number of Samples for the Scene in Figure 8.32 . The Halton sampler gives consistently lower error than both the independent and stratified samplers and converges at a slightly higher rate.",
      "width": 998,
      "height": 329,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Halton_Sampler.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "f78b32456ab05692796f6ab0fc8b705d2cef0586ae030c94514c81f71127da8c",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "8.6 Halton Sampler",
      "8.6.1  Hammersley and Halton Points",
      "8.6.2  Randomization via Scrambling",
      "8.6.3  Halton Sampler Implementation",
      "8.6.4  Evaluation"
    ],
    "sourceFigures": [
      "8.27",
      "8.28",
      "8.29",
      "8.30",
      "8.31",
      "8.32",
      "8.33"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
