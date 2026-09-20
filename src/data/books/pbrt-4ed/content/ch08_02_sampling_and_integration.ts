import type { SectionContent } from '../../../../types/book';

export const CH08_02_SAMPLING_AND_INTEGRATION: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "8",
  "chapterTitleKo": "제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)",
  "sectionNumber": "8.2",
  "sectionTitle": "Sampling and Integration",
  "sectionTitleKo": "8.2 샘플링과 수치 적분 (Sampling and Integration)",
  "originalUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_and_Integration.html",
  "prevSection": {
    "id": "ch08-01",
    "title": "8.1 샘플링 이론과 앨리어싱"
  },
  "nextSection": {
    "id": "ch08-03",
    "title": "8.3 샘플러 인터페이스 (Sampling Interface)"
  },
  "summary": {
    "keyTakeaways": [
      "레이 트레이서에서 픽셀 색상을 계산하는 본질적인 목표는 연속 신호를 완전 복원(Reconstruction)하는 것이 아니라, 픽셀 영역 위에서 필터 함수와 곱해진 입사광의 적분값(Integration)을 구하는 것입니다.",
      "무작위 표본은 규칙적인 앨리어싱 패턴을 확률적 오차로 바꿀 수 있습니다. 오차가 자동으로 고주파에만 놓이거나 언제나 눈에 덜 띄는 것은 아닙니다.",
      "파워 스펙트럼과 불일치도는 표본 배치를 분석하는 서로 다른 도구입니다. 이것만으로 모든 장면에서의 품질 순위를 정하지는 않습니다.",
      "콕스마–흘라브카 부등식은 Hardy–Krause 변동이 유한한 함수에 대해 적분 오차를 $V(f)D_N^*$로 제한합니다. 여기서 변동은 확률변수의 분산과 다릅니다.",
      "저불일치 표본은 적절한 함수에서 무작위 표본보다 빠르게 수렴할 수 있습니다. 차원, 함수의 매끄러움, 불연속, 상수와 로그 인자가 영향을 주므로 모든 렌더링에서 1/N 수렴을 보장하지 않습니다."
    ],
    "prerequisites": [
      "8장 8.1 푸리에 변환과 나이퀴스트-섀넌 샘플링 정리",
      "2장 2.1 몬테카를로 적분의 기댓값과 분산 ($O(1/\\sqrt{N})$ 수렴 속도)",
      "해석학: 리만-스틸체스 적분과 함수의 유계 변동(Bounded Variation)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.2.1 신호 복원 vs 수치 적분의 근본적 차이",
      "titleEn": "8.2.1 Signal Reconstruction versus Numerical Integration",
      "id": "ch08-02-b1"
    },
    {
      "type": "paragraph",
      "textKo": "고전 신호 처리(Signal Processing)에서 샘플링의 목표는 이산적인 샘플들로부터 원래의 연속 아날로그 함수 $f(x)$를 오차 없이 복원(Reconstruction)하는 것이었습니다. 그러나 컴퓨터 그래픽스의 렌더링 파이프라인에서 우리가 풀고자 하는 문제는 다릅니다. 우리는 연속된 센서 표면 전체에 도달하는 복잡한 입사광 $L(p, \\omega)$과 픽셀 필터 가중치 $w(p)$를 곱한 가중 적분값(Weighted Integral)을 구하고자 합니다:",
      "textEn": "In classical signal processing, the goal of sampling is to reconstruct the continuous signal. In rendering, however, the goal is almost always numerical integration: computing the average radiance over a pixel weighted by a filter function.",
      "id": "ch08-02-b2"
    },
    {
      "type": "equation",
      "tex": "I = \\iint_{\\text{pixel}} L(x, y) w(x, y) dx dy",
      "explanationKo": "픽셀 측정 방정식: 픽셀 영역 위에서 필름 평면에 도달하는 연속 입사광 $L(x, y)$와 픽셀 재구성 필터 $w(x, y)$의 2차원 적분입니다.",
      "id": "ch08-02-b3"
    },
    {
      "type": "paragraph",
      "textKo": "나이퀴스트 정리에 따르면 날카로운 폴리곤 실루엣이나 무한대의 주파수를 갖는 신호는 유한한 샘플링으로 완벽히 복원할 수 없습니다. 하지만 르베그 적분(Lebesgue Integration) 관점에서 볼 때, 날카로운 불연속 경계선은 측도 0(Measure Zero)을 가지므로 적분값 자체는 항상 명확한 유한값으로 수렴합니다. 즉, 완벽한 신호 복원은 불가능할지라도, **정확한 적분값(평균 색상)을 추정하는 것은 완벽하게 가능**합니다!",
      "textEn": "While step discontinuities have infinite frequency spectra that make exact reconstruction impossible, they have measure zero and thus do not prevent accurate numerical integration.",
      "id": "ch08-02-b4"
    },
    {
      "type": "figure",
      "id": "fig-08-16",
      "number": "Figure 8.16",
      "title": "Original Figure 8.16",
      "titleKo": "원문 그림 8.16",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-16.png",
      "captionKo": "그림 8.16 · 지터링한 256점과 포아송 원판 분포의 256점입니다. 후자는 무작위성을 유지하면서 두 점이 너무 가까워지지 않도록 제약합니다.",
      "captionEn": "Figure 8.16: 256 sample points distributed using (a) a jittered distribution, and (b) a Poisson disk distribution. Poisson disk point sets combine some randomness in the locations of the points with some structure from no two of them being too close together.",
      "width": 998,
      "height": 448,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_and_Integration.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.2.2 샘플링 패턴의 품질을 평가하는 수학적 도구",
      "titleEn": "8.2.2 Mathematical Tools for Evaluating Sampling Patterns",
      "id": "ch08-02-b6"
    },
    {
      "type": "paragraph",
      "textKo": "어떤 샘플링 방식이 렌더링에 가장 적합한지를 객관적으로 검증하기 위해 연구자들은 두 가지 정밀한 수학적 척도를 사용합니다: 주파수 영역의 **파워 스펙트럼 밀도(Power Spectral Density)**와 공간 영역의 **불일치도(Discrepancy)**입니다.",
      "textEn": "Two primary mathematical frameworks are used to evaluate sampling quality: Fourier power spectral density in the frequency domain, and discrepancy in the spatial domain.",
      "id": "ch08-02-b7"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1. 파워 스펙트럼 밀도 (PSD)와 방사형 평균",
      "titleEn": "1. Power Spectral Density and Radial Average",
      "id": "ch08-02-b8"
    },
    {
      "type": "paragraph",
      "textKo": "$N$개의 샘플 점 집합 $P = \\{x_1, x_2, \\dots, x_N\\}$에 대한 파워 스펙트럼 밀도 $P(\\omega)$는 다음과 같이 정의됩니다:",
      "textEn": "The power spectral density P(omega) of a point set evaluates how energy is distributed across frequencies:",
      "id": "ch08-02-b9"
    },
    {
      "type": "equation",
      "tex": "P(\\omega) = \\frac{1}{N} \\left| \\sum_{j=1}^{N} e^{-i 2\\pi \\omega \\cdot x_j} \\right|^2",
      "explanationKo": "이 정규화 방식의 유한 점 집합 스펙트럼입니다. 영주파수에서 값은 N이므로, 청색 잡음의 저주파 억제를 설명할 때에는 이 DC 성분을 제외해야 합니다. 단일 표본 집합의 스펙트럼과 확률적 평균 스펙트럼도 구분합니다.",
      "id": "ch08-02-b10"
    },
    {
      "type": "figure",
      "id": "fig-08-17",
      "number": "Figure 8.17",
      "title": "Original Figure 8.17",
      "titleKo": "원문 그림 8.17",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-17.png",
      "captionKo": "그림 8.17 · 지터링과 포아송 원판 표본의 파워 스펙트럼 밀도입니다. 각 영상의 중앙이 영주파수와 DC 스파이크 위치입니다.",
      "captionEn": "Figure 8.17: PSDs of (a) jittered and (b) Poisson disk–distributed sample points. The origin with the central spike is at the center of each image.",
      "width": 998,
      "height": 410,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_and_Integration.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "2. 불일치도 (Discrepancy)와 콕스마-흘라브카 부등식",
      "titleEn": "2. Discrepancy and the Koksma-Hlawka Inequality",
      "id": "ch08-02-b12"
    },
    {
      "type": "paragraph",
      "textKo": "공간 영역에서 샘플들이 단위 사각/입방 영역 $[0, 1]^s$에 얼마나 고르고 균등하게 분포되어 있는지를 측정하는 기하학적 척도가 바로 **별-불일치도(Star Discrepancy, $D_N^*$)**입니다. 임의의 원점을 포함하는 축정렬 상자 $B = [0, v_1) \\times \\dots \\times [0, v_s)$에 대해, 실제 상자 부피 $\\text{Vol}(B)$와 상자 안에 떨어진 샘플 개수의 비율 사이의 최대 편차를 구합니다:",
      "textEn": "Star discrepancy measures how uniformly sample points cover the unit domain by comparing the fraction of points inside arbitrary sub-boxes against their actual volume:",
      "id": "ch08-02-b13"
    },
    {
      "type": "equation",
      "tex": "D_N^*(P) = \\sup_{B \\in \\mathcal{J}^*} \\left| \\frac{\\#(P \\cap B)}{N} - \\text{Vol}(B) \\right|",
      "explanationKo": "원점에 붙은 모든 축정렬 상자에 대해, 표본 비율과 부피의 차이의 상한을 구합니다. 한 상자의 차이가 0이어도 전체 별-불일치도가 0인 것은 아닙니다.",
      "id": "ch08-02-b14"
    },
    {
      "type": "figure",
      "id": "fig-08-18",
      "number": "Figure 8.18",
      "title": "Original Figure 8.18",
      "titleKo": "원문 그림 8.18",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-18.png",
      "captionKo": "그림 8.18 · 지터링과 포아송 원판 표본의 파워 스펙트럼을 반지름별로 평균한 결과입니다.",
      "captionEn": "Figure 8.18: Radially averaged PSDs of (a) jittered and (b) Poisson disk–distributed sample points.",
      "width": 998,
      "height": 307,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_and_Integration.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "불일치도가 컴퓨터 그래픽스에서 이토록 중요한 이유는 수치해석학의 위대한 정리인 **콕스마-흘라브카 부등식(Koksma-Hlawka Inequality)** 덕분입니다:",
      "textEn": "The significance of discrepancy is established by the Koksma-Hlawka inequality, which bounds numerical integration error:",
      "id": "ch08-02-b16"
    },
    {
      "type": "equation",
      "tex": "\\left| \\frac{1}{N} \\sum_{i=1}^{N} f(x_i) - \\int_{[0, 1]^s} f(x) dx \\right| \\le V(f) \\cdot D_N^*(P)",
      "explanationKo": "V(f)는 Hardy–Krause 의미의 변동이며 유한해야 이 상한이 유용합니다. 렌더링의 불연속 함수에서는 이 조건이나 상한의 실용성을 확인해야 합니다. 확률적인 분산 상한으로 해석하지 않습니다.",
      "id": "ch08-02-b17"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "QMC가 유리한 경우와 한계",
      "summary": "QMC가 유리한 경우와 한계",
      "points": [
        {
          "title": "핵심 설명",
          "content": "저불일치 점은 영역을 비교적 고르게 덮어 적분 오차를 줄입니다. 하지만 “100개로 무작위 10,000개와 같은 품질”이라는 고정 환산은 없습니다. 함수와 차원에 따라 효과가 다릅니다. 결정론적 QMC 자체에는 무작위 추정량의 비편향성 개념을 그대로 적용할 수 없습니다. 적절히 무작위화하여 각 표본의 주변 분포를 균일하게 유지하면 비편향 추정과 반복 실행을 통한 오차 평가를 함께 고려할 수 있습니다."
        }
      ],
      "tags": [
        "QMC",
        "준몬테카를로",
        "불일치도",
        "수치적분",
        "수렴속도"
      ],
      "id": "ch08-02-b18"
    },
    {
      "type": "figure",
      "id": "fig-08-19",
      "number": "Figure 8.19",
      "title": "Original Figure 8.19",
      "titleKo": "원문 그림 8.19",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-19.png",
      "captionKo": "그림 8.19 · 네 표본 중 하나가 0.3×0.3 상자 안에 있습니다. 표본이 추정한 면적 0.25와 실제 면적 0.09의 차이는 0.16입니다. 이것은 이 상자의 편차이며 전체 불일치도는 모든 대상 상자의 상한을 봅니다.",
      "captionEn": "Figure 8.19: The discrepancy of a box (shaded) given a set of 2D sample points in left-bracket 0 comma 1 right-parenthesis squared . One of the four sample points is inside the box, so this set of points would estimate the box’s area to be 1 slash 4 . The true area of the box is 0.3 times 0.3 equals .09 , so the discrepancy for this particular box is .25 minus .09 equals .16 . In general, we are interested in finding the maximum discrepancy of all possible boxes (or some other shape).",
      "width": 998,
      "height": 363,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_and_Integration.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "5c8199119ef6d78e101a865be02fb9ed065dd0f4bba0fbdfa9d181fbb8c46bff",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "8.2 Sampling and Integration",
      "8.2.1  Fourier Analysis of Variance",
      "8.2.2  Low Discrepancy and Quasi Monte Carlo"
    ],
    "sourceFigures": [
      "8.16",
      "8.17",
      "8.18",
      "8.19"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
