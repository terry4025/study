import type { SectionContent } from '../../../../types/book';

export const CH08_01_SAMPLING_THEORY: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "8",
  "chapterTitleKo": "제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)",
  "sectionNumber": "8.1",
  "sectionTitle": "Sampling Theory",
  "sectionTitleKo": "8.1 샘플링 이론과 앨리어싱 (Sampling Theory)",
  "originalUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
  "prevSection": {
    "id": "ch07-03",
    "title": "7.3 BVH(계층적 바운딩 볼륨) 트리 구조"
  },
  "nextSection": {
    "id": "ch08-02",
    "title": "8.2 샘플링과 수치 적분 (Sampling and Integration)"
  },
  "summary": {
    "keyTakeaways": [
      "렌더러의 최종 출력물은 이산적인 2D 픽셀 격자이지만, 장면에서 필름 평면으로 들어오는 입사 방사휘도(Radiance)는 시공간에 걸쳐 연속적인 아날로그 함수입니다.",
      "푸리에 변환(Fourier Transform)은 공간 영역(Spatial Domain)의 신호를 주파수 성분(Frequency Domain)으로 분해하여, 어떤 주파수 성분이 신호에 포함되어 있는지를 수학적으로 분석합니다.",
      "공간 영역에서의 이상적인 샘플링은 신호에 디락 델타 빗(Shah / Comb 함수 III)을 곱하는 것이며, 이는 주파수 영역에서 신호의 스펙트럼이 무한히 주기적으로 복제되는 합성곱(Convolution) 결과를 낳습니다.",
      "신호가 어떤 주파수보다 높은 성분을 갖지 않는 대역 제한 신호이고 이상적인 규칙적 샘플링과 복원을 가정할 때, 샘플링 주파수를 최고 주파수의 2배보다 높게 잡으면($f_s > 2f_{\\max}$) 복원이 가능합니다. 경계값에 정확히 맞추면 위상 등에 따라 정보가 사라질 수 있으므로, 초보 단계에서는 엄격한 부등식과 대역 제한 조건을 함께 기억하세요.",
      "샘플링 레이트가 나이퀴스트 기준에 미달하면 복제된 스펙트럼들이 서로 겹쳐(Overlap) 고주파 신호가 가짜 저주파 신호로 둔갑하는 앨리어싱(Aliasing, 모아레 현상)이 발생합니다.",
      "날카로운 경계에는 높은 주파수 성분이 있어 유한한 점 표본만으로 정확한 복원이 어렵습니다. 적절한 필터링과 표본 배치로 오차를 줄여야 합니다. 독립적인 무작위 표본은 규칙적인 무늬를 덜 드러나게 할 수 있지만 자동으로 청색 잡음이 되지는 않습니다. 청색 잡음은 낮은 주파수의 오차 성분을 억제하도록 표본 사이의 관계를 설계한 경우와 구분해 배웁니다."
    ],
    "prerequisites": [
      "고교 수학: 삼각함수, 오일러 공식 ($e^{i\\theta} = \\cos\\theta + i\\sin\\theta$)",
      "미적분학: 이상적분(Improper Integral), 합성곱(Convolution)",
      "4장 방사측정학: 필름 평면의 복사조도(Irradiance)와 센서 응답. 여기서 복사조도의 단위는 W/m²이며 시각 감도를 반영한 조도(lx)와 다릅니다."
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.1.1 주파수 영역(Frequency Domain)과 푸리에 변환",
      "titleEn": "8.1.1 The Frequency Domain and the Fourier Transform",
      "id": "ch08-01-b1"
    },
    {
      "type": "paragraph",
      "textKo": "렌더링을 진행할 때 카메라 센서나 필름의 각 픽셀은 연속적인 빛의 분포를 이산적인 단 하나의 색상 값으로 축약합니다. 만약 체커보드 패턴이나 가느다란 블라인드 창살이 카메라에서 멀어져 픽셀 크기보다 훨씬 촘촘해지면, 화면에는 기괴한 물결무늬(모아레 패턴, Moiré Pattern)나 자글자글 튀는 계단 현상(Jaggies)이 발생합니다. 이 현상을 컴퓨터 과학에서는 앨리어싱(Aliasing)이라고 부릅니다.",
      "textEn": "Although the output of a renderer is a 2D grid of pixels, the incoming radiance is a continuous function. When continuous functions change faster than the sampling rate, artifacts such as moiré patterns and jaggies appear, which is known as aliasing.",
      "id": "ch08-01-b2"
    },
    {
      "type": "paragraph",
      "textKo": "푸리에 변환은 적절한 함수 공간과 수렴 조건 아래에서 신호를 주파수 성분으로 표현합니다. 익숙한 함수에서는 사인·코사인 파동을 여러 비중으로 합쳐 원래 모양을 설명한다고 생각할 수 있습니다. 모든 임의의 함수가 보통 의미의 적분으로 표현되거나, 모든 점에서 오차 없이 복원된다는 뜻은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-01-b3"
    },
    {
      "type": "figure",
      "id": "fig-08-01",
      "number": "Figure 8.1",
      "title": "Original Figure 8.1",
      "titleKo": "원문 그림 8.1",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-1.png",
      "captionKo": "그림 8.1 · 함수의 몇 지점에서 값을 얻고 그 표본으로 연속 함수를 근사 복원합니다. 특정 대역 제한·표본 수·복원 조건을 만족할 때만 원래 함수와 정확히 같아집니다. 사인파 분해 그림이 아닙니다.",
      "captionEn": "Figure 8.1: (a) By taking a set of point samples of f left-parenthesis x right-parenthesis (indicated by dots), we determine the value of the function at those positions. (b) The sample values can be used to reconstruct a function ModifyingAbove f With tilde left-parenthesis x right-parenthesis that is an approximation to f left-parenthesis x right-parenthesis . The sampling theorem, introduced in Section 8.1.3 , makes a precise statement about the conditions on f left-parenthesis x right-parenthesis , the number of samples taken, and the reconstruction technique used under which ModifyingAbove f With tilde left-parenthesis x right-parenthesis is exactly the same as f left-parenthesis x right-parenthesis . The fact that the original function can sometimes be reconstructed exactly from point samples alone is remarkable.",
      "width": 998,
      "height": 269,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "1차원 공간 함수 $f(x)$에 대한 연속 푸리에 변환 $F(\\omega)$와 그 역변환(Inverse Fourier Transform)은 다음과 같이 정의됩니다:",
      "textEn": "The continuous 1D Fourier transform F(omega) and its inverse are defined as follows:",
      "id": "ch08-01-b5"
    },
    {
      "type": "equation",
      "tex": "F(\\omega) = \\int_{-\\infty}^{\\infty} f(x) e^{-i 2\\pi \\omega x} dx",
      "explanationKo": "푸리에 변환 공식: 공간 함수 $f(x)$에 복소 지수 함수 $e^{-i 2\\pi \\omega x}$를 곱해 전체 공간에 대해 적분합니다. 여기서 $\\omega$는 주파수(단위 거리당 진동 횟수, cycles/unit)입니다.",
      "id": "ch08-01-b6"
    },
    {
      "type": "equation",
      "tex": "f(x) = \\int_{-\\infty}^{\\infty} F(\\omega) e^{i 2\\pi \\omega x} d\\omega",
      "explanationKo": "역변환은 조건에 맞는 함수의 공간 표현을 되찾습니다. 불연속점에서의 값과 수렴의 의미는 별도 조건을 요구합니다. 수치 계산에서는 표본 수와 유한 정밀도로 인한 오차도 고려해야 합니다.",
      "id": "ch08-01-b7"
    },
    {
      "type": "figure",
      "id": "fig-08-02",
      "number": "Figure 8.2",
      "title": "Original Figure 8.2",
      "titleKo": "원문 그림 8.2",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-2.png",
      "captionKo": "그림 8.2 · 저주파 함수와 고주파 함수의 비교입니다. 같은 거리 안에서 더 빠르게 변하는 쪽이 높은 주파수를 포함합니다.",
      "captionEn": "Figure 8.2: (a) Low-frequency function and (b) high-frequency function. Roughly speaking, the higher frequency a function is, the more quickly it varies over a given region.",
      "width": 998,
      "height": 265,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-03",
      "number": "Figure 8.3",
      "title": "Original Figure 8.3",
      "titleKo": "원문 그림 8.3",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-3.png",
      "captionKo": "그림 8.3 · 그림 8.2 함수들의 주파수 영역 표현입니다. 각 주파수 성분이 공간 함수에 얼마나 기여하는지 나타냅니다.",
      "captionEn": "Figure 8.3: Frequency Space Representations of the Functions in Figure 8.2 . The graphs show the contribution of each frequency omega to each of the functions in the spatial domain.",
      "width": 998,
      "height": 272,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-04",
      "number": "Figure 8.4",
      "title": "Original Figure 8.4",
      "titleKo": "원문 그림 8.4",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-4.png",
      "captionKo": "그림 8.4 · 함수와 샤 함수를 곱하면 각 표본값을 가중치로 가진 디락 델타 열을 얻습니다. 이상적인 점 샘플링의 수학적 표현입니다.",
      "captionEn": "Figure 8.4: Formalizing the Sampling Process. (a) The function f left-parenthesis x right-parenthesis is multiplied by (b) the shah function upper I upper I upper I Subscript upper T Baseline left-parenthesis x right-parenthesis , giving (c) an infinite sequence of scaled delta functions that represent its value at each sample point.",
      "width": 998,
      "height": 266,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-05",
      "number": "Figure 8.5",
      "title": "Original Figure 8.5",
      "titleKo": "원문 그림 8.5",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-5.png",
      "captionKo": "그림 8.5 · 표본마다 크기를 조절한 삼각형 복원 필터를 놓고 모두 더하면, 원래 함수를 근사하는 연속 함수를 얻습니다.",
      "captionEn": "Figure 8.5: The sum of instances of the triangle reconstruction filter, shown with dashed lines, gives the reconstructed approximation to the original function, shown with a solid line.",
      "width": 998,
      "height": 254,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.1.2 이상적인 샘플링과 샤(Shah) 함수",
      "titleEn": "8.1.2 Ideal Sampling and the Shah Function",
      "id": "ch08-01-b12"
    },
    {
      "type": "paragraph",
      "textKo": "수학적으로 \"연속적인 함수에서 일정한 간격 $T$마다 점을 콕콕 찍어 샘플을 추출한다\"는 행위는 어떻게 표현할 수 있을까요? 이를 위해 물리학과 신호 처리 분야에서는 디락 델타 함수(Dirac Delta Function, $\\delta(x)$)들이 빗(Comb)처럼 무한히 늘어선 샤 함수(Shah Function, 기호 $\\text{III}$)를 사용합니다.",
      "textEn": "Mathematically, sampling a continuous signal at regular intervals T can be modeled by multiplying the signal with a train of Dirac delta functions, called the Shah or comb function III_T(x).",
      "id": "ch08-01-b13"
    },
    {
      "type": "figure",
      "id": "fig-08-06",
      "number": "Figure 8.6",
      "title": "Original Figure 8.6",
      "titleKo": "원문 그림 8.6",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-6.png",
      "captionKo": "그림 8.6 · 함수의 푸리에 변환 F와 샤 함수의 합성곱은 F의 복사본을 주파수축에 반복해서 배치합니다.",
      "captionEn": "Figure 8.6: The Convolution of upper F left-parenthesis omega right-parenthesis and the Shah Function. The result is infinitely many copies of upper F .",
      "width": 998,
      "height": 224,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "이상적인 샘플링은 각 표본의 위치에 그 함수값을 가중치로 가진 디락 델타를 놓은 분포로 나타냅니다. 디락 델타는 한 점의 높이가 무한대인 보통 함수라기보다, 적분할 때 그 점의 값을 집어내는 수학적 도구입니다. 아래 식은 저장된 표본 배열과 연속 함수의 관계를 설명하는 모델입니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-01-b15"
    },
    {
      "type": "equation",
      "tex": "f_s(x) = f(x) \\cdot \\text{III}_T(x) = \\sum_{n=-\\infty}^{\\infty} f(nT) \\delta(x - nT)",
      "explanationKo": "이상적인 샘플링 모델: 연속 신호 $f(x)$와 샤 함수의 곱셈으로 표현된 샘플링 결과입니다.",
      "id": "ch08-01-b16"
    },
    {
      "type": "paragraph",
      "textKo": "신호 처리의 가장 위대한 발견 중 하나인 합성곱 정리(Convolution Theorem)에 따르면, **공간 영역에서의 두 함수의 곱셈은 주파수 영역에서 두 함수의 푸리에 변환의 합성곱(Convolution)과 일치**합니다. 놀랍게도 샤 함수의 푸리에 변환은 또 다른 샤 함수입니다:",
      "textEn": "By the convolution theorem, multiplication in the spatial domain corresponds to convolution in the frequency domain. The Fourier transform of a Shah function III_T(x) is another Shah function with spacing 1/T:",
      "id": "ch08-01-b17"
    },
    {
      "type": "equation",
      "tex": "\\mathcal{F}\\{\\text{III}_T(x)\\} = \\frac{1}{T} \\text{III}_{1/T}(\\omega) = \\frac{1}{T} \\sum_{k=-\\infty}^{\\infty} \\delta\\left(\\omega - \\frac{k}{T}\\right)",
      "explanationKo": "샤 함수의 푸리에 변환: 주기 $T$인 샤 함수를 주파수 변환하면, 주파수 간격이 $1/T$인 새로운 샤 함수가 됩니다.",
      "id": "ch08-01-b18"
    },
    {
      "type": "paragraph",
      "id": "fig-08-07",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "figure",
      "id": "fig-08-08",
      "number": "Figure 8.8",
      "title": "Original Figure 8.8",
      "titleKo": "원문 그림 8.8",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-8.png",
      "captionKo": "그림 8.8 · 표본 간격이 너무 넓으면 스펙트럼 복사본이 겹칩니다. 이후 복원해도 고주파 정보가 낮은 주파수의 잘못된 정보로 섞입니다.",
      "captionEn": "Figure 8.8: (a) When the sampling rate is too low, the copies of the function’s spectrum overlap, resulting in (b) aliasing when reconstruction is performed.",
      "width": 998,
      "height": 264,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-09",
      "number": "Figure 8.9",
      "title": "Original Figure 8.9",
      "titleKo": "원문 그림 8.9",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-9.png",
      "captionKo": "그림 8.9 · 1+cos(4πx²)를 0.125 간격으로 뽑아 sinc로 복원한 예입니다. 빠른 진동이 충분히 샘플링되지 않아 더 느린 잘못된 진동으로 나타납니다.",
      "captionEn": "Figure 8.9: Aliasing from Point Sampling the Function 1 plus cosine left-parenthesis 4 pi x squared right-parenthesis . (a) The function. (b) The reconstructed function from sampling it with samples spaced 0.125 units apart and performing perfect reconstruction with the sinc filter. Aliasing causes the high-frequency information in the original function to be lost and to reappear as lower-frequency error.",
      "width": 998,
      "height": 283,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-10",
      "number": "Figure 8.10",
      "title": "Original Figure 8.10",
      "titleKo": "원문 그림 8.10",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-10.png",
      "captionKo": "그림 8.10 · 폭이 5픽셀인 영상의 연속 좌표 범위는 [0,5)입니다. 정수 픽셀 d의 중심은 연속 좌표 d+1/2에 해당합니다.",
      "captionEn": "Figure 8.10: Pixels in an image can be addressed with either discrete or continuous coordinates. A discrete image five pixels wide covers the continuous pixel range left-bracket 0 comma 5 right-parenthesis . A particular discrete pixel d ’s coordinate in the continuous representation is d plus 1 slash 2 .",
      "width": 998,
      "height": 113,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.1.3 나이퀴스트-섀넌 정리와 앨리어싱(Aliasing)",
      "titleEn": "8.1.3 The Nyquist-Shannon Theorem and Aliasing",
      "id": "ch08-01-b23"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 결정적인 질문이 생깁니다: \"과연 언제나 샘플들로부터 원본 신호를 100% 완벽하게 복원할 수 있을까?\" 이에 대한 해답을 제시한 것이 바로 디지털 통신의 아버지 클로드 섀넌(Claude Shannon)과 해리 나이퀴스트(Harry Nyquist)의 **나이퀴스트-섀넌 샘플링 정리**입니다.",
      "textEn": "Can any signal always be reconstructed perfectly from discrete samples? The Nyquist-Shannon sampling theorem provides the definitive criterion.",
      "id": "ch08-01-b24"
    },
    {
      "type": "figure",
      "id": "fig-08-11",
      "number": "Figure 8.11",
      "title": "Original Figure 8.11",
      "titleKo": "원문 그림 8.11",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-11.png",
      "captionKo": "그림 8.11 · 계단 함수를 유한한 간격으로 샘플링하고 sinc로 복원하면 경계 주위에서 진동하는 링잉이 나타납니다. 원문에서는 이를 깁스 현상과 연결해 설명합니다.",
      "captionEn": "Figure 8.11: Illustration of the Gibbs Phenomenon. When a function has not been sampled at the Nyquist rate and the set of aliased samples is reconstructed with the sinc filter, the reconstructed function will have “ringing” artifacts, where it oscillates around the true function. Here a 1D step function (dashed line) has been sampled with a sample spacing of 0.125 . When reconstructed with the sinc, the ringing appears (solid line).",
      "width": 998,
      "height": 269,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "샘플 간격과 표현 가능한 주파수",
      "summary": "샘플 간격과 표현 가능한 주파수",
      "points": [
        {
          "title": "핵심 설명",
          "content": "최고 주파수가 20,000회/초로 제한된 신호를 이상적으로 복원하려면 초당 40,000회보다 높은 규칙적 샘플링을 고려합니다. 실제 필터에는 전이 구간이 필요하므로 여유를 둡니다. 다만 특정 오디오 표준의 수치가 단순히 “10%를 더해서 정해졌다”고 설명할 수는 없습니다. 렌더링에서는 날카로운 경계가 높은 주파수를 포함하므로 필터링과 표본 배치를 함께 다뤄야 합니다."
        }
      ],
      "tags": [
        "나이퀴스트",
        "섀넌정리",
        "푸리에변환",
        "CD음질",
        "앨리어싱"
      ],
      "id": "ch08-01-b26"
    },
    {
      "type": "figure",
      "id": "fig-08-12",
      "number": "Figure 8.12",
      "title": "Original Figure 8.12",
      "titleKo": "원문 그림 8.12",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-12.png",
      "captionKo": "그림 8.12 · 샘플링 간격 0.125에서 표현할 수 없는 높은 주파수를 함수에서 먼저 제거한 모습입니다. 원래 세부 정보는 줄지만, 대역이 제한된 새 함수는 조건에 맞게 샘플링·복원할 수 있습니다.",
      "captionEn": "Figure 8.12: Graph of the function 1 plus cosine left-parenthesis 4 pi x squared right-parenthesis convolved with a filter that removes frequencies beyond the Nyquist limit for a sampling rate of upper T equals 0.125 . High-frequency detail has been removed from the function, so that the new function can at least be sampled and reconstructed without aliasing.",
      "width": 998,
      "height": 296,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-13",
      "number": "Figure 8.13",
      "title": "Original Figure 8.13",
      "titleKo": "원문 그림 8.13",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-13.png",
      "captionKo": "그림 8.13 · 간격 T=1의 지터링 표본에 대한 파워 스펙트럼 밀도입니다.",
      "captionEn": "Figure 8.13: Graph of the PSD of jittered samples with upper T equals 1 , as given by Equation ( 8.7 ).",
      "width": 998,
      "height": 306,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-08-14",
      "number": "Figure 8.14",
      "title": "Original Figure 8.14",
      "titleKo": "원문 그림 8.14",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-14.png",
      "captionKo": "그림 8.14 · 규칙적 표본과 지터링 표본이 신호의 파워 스펙트럼에 미치는 영향을 비교합니다. 빨강은 표본화된 스펙트럼, 파랑은 원래 함수, 점선 상자는 복원 필터 범위를 나타냅니다.",
      "captionEn": "Figure 8.14: The Effect of Jittered Sampling on Aliasing. (a) The power spectral density of a function that cannot be perfectly reconstructed with regularly spaced samples at a rate upper T equals 1 . (b) The PSD from sampling the function with a shah function with upper T equals 1 (red), which is given by the convolution of their PSDs. The original function is shown in blue and the extent of the ideal reconstruction filter is shown with dashed lines. (c) The PSD from jittered sampling (red), which is given by convolving script upper P Subscript f with Equation ( 8.7 ). (The original function is again in blue and the perfect reconstruction filter is indicated by the dashed box.)",
      "width": 998,
      "height": 277,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.1.4 안티앨리어싱의 비밀: 규칙적 왜곡을 무작위 노이즈로!",
      "titleEn": "8.1.4 Antialiasing and the Power of Blue Noise",
      "id": "ch08-01-b30"
    },
    {
      "type": "paragraph",
      "textKo": "렌더링에서 앨리어싱을 줄이는 방법은 무작위화만이 아닙니다. 샘플 수를 늘리거나 배치를 개선하고, 가능한 경우 샘플링 전에 적절한 필터를 적용합니다. 가시성처럼 사전 필터링하기 어려운 함수에서는 불규칙한 표본 배치가 규칙적인 왜곡을 덜 드러나게 하는 데 도움이 됩니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-01-b31"
    },
    {
      "type": "paragraph",
      "textKo": "독립 무작위 표본은 격자처럼 규칙적인 앨리어싱을 확률적인 오차로 바꿀 수 있지만, 그 오차가 자동으로 고주파에만 모이지는 않습니다. 청색 잡음 표본은 낮은 주파수 오차를 억제하도록 표본 사이 관계를 설계합니다. 지터링·독립 난수·청색 잡음은 구분해야 하며 결과는 피적분 함수와 필터에도 영향을 받습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-01-b32"
    },
    {
      "type": "figure",
      "id": "fig-08-white-noise",
      "number": "Figure 8.15",
      "title": "Original Figure 8.15",
      "titleKo": "원문 그림 8.15",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-15.png",
      "captionKo": "그림 8.15 · 256×256 픽셀에 백색 잡음과 청색 잡음 특성의 값을 배치한 비교입니다. 표본점 그림 자체가 아니라 잡음 영상입니다. 청색 잡음 표 제공: Christoph Peters.",
      "captionEn": "Figure 8.15: 256 times 256 pixels with (a) values distributed with white noise characteristics, and (b) with blue noise. (Blue noise table courtesy of Christoph Peters.)",
      "width": 998,
      "height": 1674,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "id": "fig-08-blue-noise",
      "textKo": "같은 원문 그림의 중복·부분 번호 표기를 정리했습니다. 해당 그림의 비교 상태와 설명은 앞서 표시한 원문 그림 8.15에서 확인합니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "id": "ch08-01-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch08-01-source-figure-8-7",
      "number": "Figure 8.7",
      "title": "Original Figure 8.7",
      "titleKo": "원문 그림 8.7",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-7.png",
      "captionKo": "그림 8.7 · 서로 겹치지 않는 반복 스펙트럼에 적절한 상자 함수를 곱하면 가운데 원래 스펙트럼을 선택할 수 있습니다.",
      "captionEn": "Figure 8.7: Multiplying (a) a series of copies of upper F left-parenthesis omega right-parenthesis by (b) the appropriate box function yields (c) the original spectrum.",
      "width": 998,
      "height": 222,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "237c390cd7ebdda6e0f00c13425d8d108088536cf0839111fae5d598dbf74a9e",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "8.1 Sampling Theory",
      "8.1.1  The Frequency Domain and the Fourier Transform",
      "8.1.2  Ideal Sampling and Reconstruction",
      "8.1.3  Aliasing",
      "8.1.4  Understanding Pixels",
      "8.1.5  Sampling and Aliasing in Rendering",
      "Sources of Aliasing",
      "Adaptive Sampling",
      "Prefiltering",
      "8.1.6  Spectral Analysis of Sampling Patterns"
    ],
    "sourceFigures": [
      "8.1",
      "8.2",
      "8.3",
      "8.4",
      "8.5",
      "8.6",
      "8.7",
      "8.8",
      "8.9",
      "8.10",
      "8.11",
      "8.12",
      "8.13",
      "8.14",
      "8.15"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
