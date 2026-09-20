import type { SectionContent } from '../../../../types/book';

export const CH02_03_INVERSION_METHOD: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "2",
  "chapterTitleKo": "제2장 몬테카를로 적분 (Monte Carlo Integration)",
  "sectionNumber": "2.3",
  "sectionTitle": "Sampling Using the Inversion Method",
  "sectionTitleKo": "2.3 역변환 방법을 이용한 확률 샘플링 (The Inversion Method)",
  "originalUrl": "https://pbr-book.org/4ed/Monte_Carlo_Integration/Sampling_Using_the_Inversion_Method.html",
  "prevSection": {
    "id": "ch02-02",
    "title": "2.2 샘플링 효율성 향상 기법"
  },
  "nextSection": {
    "id": "ch02-04",
    "title": "2.4 다차원 확률 분포 간 변환"
  },
  "summary": {
    "keyTakeaways": [
      "역변환 방법(Inversion Method)은 컴퓨터가 생성하는 균일 난수 $\\xi \\sim U(0, 1)$를 누적분포함수의 역함수 $P^{-1}(\\xi)$에 대입하여, 원하는 임의의 확률밀도함수(PDF)를 따르는 난수를 만들어내는 근본적인 기법입니다.",
      "이산 역변환은 누적확률 구간에서 표본이 속하는 곳을 찾습니다. CDF 이진 탐색과 별칭 방법은 서로 다른 구현이며, 별칭 방법은 전처리 후 상수 시간 표본 생성을 제공합니다.",
      "연속 사건(Continuous Case): $p(x)$를 적분하여 누적분포함수 $P(x)$를 구한 뒤, 방정식 $\\xi = P(x)$를 $x$에 대해 풀어 $x = P^{-1}(\\xi)$ 공식을 유도합니다.",
      "선형 보간 함수 $f(x) = (1-x)a + xb$와 같은 빈출 패턴에 대해 수치적으로 안정적인 `SampleLinear()` 전용 샘플링 함수를 제공합니다."
    ],
    "prerequisites": [
      "누적분포함수(CDF)와 확률밀도함수(PDF)의 미적분 관계",
      "역함수(Inverse Function)의 개념 및 이진 탐색(Binary Search)"
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "textKo": "컴퓨터의 의사난수 엔진은 유한한 범위의 정수를 생성하는 경우가 많습니다. 예를 들어 rand()나 mt19937 자체가 언제나 0~1 실수를 직접 반환하는 것은 아닙니다. 렌더러는 이를 바탕으로 [0,1)의 균일 실수 표본을 구성합니다. 역변환 방법은 이 균일 표본을 원하는 분포의 CDF 역변환에 통과시키는 방법입니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch02-03-b1"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "2.3.1 이산 확률 변수의 역변환 샘플링 (Discrete Case)",
      "titleEn": "2.3.1 Discrete Case",
      "id": "ch02-03-b2"
    },
    {
      "type": "paragraph",
      "textKo": "먼저 동전이나 주사위, 또는 씬에 배치된 여러 개의 조명들처럼 유한한 개수의 선택지가 있는 **이산 확률 변수(Discrete Case)**부터 살펴보겠습니다.  \n각 사건 $i$가 일어날 확률을 $p_i$라고 하면, 모든 확률의 합은 $1$입니다:  \n$$\\sum_{i=1}^n p_i = 1$$  \n이 확률들을 앞에서부터 차례대로 누적해서 쌓아 올린 것이 바로 **이산 누적 분포 함수(Discrete CDF $P_i$)**입니다:  \n$$P_i = \\sum_{j=1}^i p_j \\quad (P_0 = 0, \\; P_n = 1)$$",
      "textEn": "Consider discrete events with probabilities p_i summing to 1. The discrete cumulative distribution function (CDF) is given by P_i = sum_{j=1}^i p_j, with P_0 = 0 and P_n = 1.",
      "id": "ch02-03-b3"
    },
    {
      "type": "figure",
      "id": "fig:discrete-pdf-cdf",
      "number": "Figure 2.3",
      "title": "Original Figure 2.3",
      "titleKo": "원문 그림 2.3",
      "src": "/books/pbrt-4ed/reviewed-images/figure-2-3.png",
      "captionKo": "그림 2.3 · 네 사건의 확률질량함수(PMF)입니다. 각 막대 높이가 사건의 확률이고 전체 합은 1입니다.",
      "captionEn": "Figure 2.3: A PMF for Four Events, Each with a Probability p Subscript i . The sum of their probabilities sigma-summation Underscript i Endscripts p Subscript i is necessarily 1.",
      "width": 998,
      "height": 231,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Monte_Carlo_Integration/Sampling_Using_the_Inversion_Method.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig:discrete-inversion",
      "number": "Figure 2.5",
      "title": "Original Figure 2.5",
      "titleKo": "원문 그림 2.5",
      "src": "/books/pbrt-4ed/reviewed-images/figure-2-5.png",
      "captionKo": "그림 2.5 · 역변환 샘플링에서는 [0,1)의 균일 난수를 세로축에 놓고 해당 CDF 구간을 찾습니다. i번째 구간의 길이가 pᵢ이므로 그 사건이 pᵢ의 확률로 선택됩니다.",
      "captionEn": "Figure 2.5: To use the inversion method to draw a sample from the distribution described by the PMF in Figure 2.3 , a canonical uniform random variable is plotted on the vertical axis. By construction, the horizontal extension of xi Subscript will intersect the box representing the i th outcome with probability p Subscript i . If the corresponding event is chosen for a set of random variables xi Subscript , then the resulting distribution of events will be distributed according to the PMF.",
      "width": 998,
      "height": 240,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Monte_Carlo_Integration/Sampling_Using_the_Inversion_Method.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "chunkName": "<<SampleDiscrete Function>>=",
      "language": "cpp",
      "code": "// 정규화되지 않은 가중치 배열에서 확률적으로 인덱스를 뽑는 pbrt 핵심 함수\ntemplate <typename Float>\nint SampleDiscrete(pstd::span<const Float> weights, Float u,\n                   Float *pmf = nullptr, Float *uRemap = nullptr) {\n    if (weights.empty()) {\n        if (pmf) *pmf = 0;\n        return -1;\n    }\n    // 1. 전체 가중치의 합 계산\n    Float sumWeights = 0;\n    for (Float w : weights)\n        sumWeights += w;\n\n    if (!(sumWeights > 0)) { if (pmf) *pmf = 0; return -1; }\n    // 2. 균일 난수 u를 전체 가중치 스케일로 확장\n    Float up = u * sumWeights;\n    if (up == sumWeights)\n        up = std::nextafter(up, -Float(Infinity));\n\n    // 3. 누적합을 순회하며 난수 up가 속한 구간(offset) 찾기\n    int offset = 0;\n    Float sum = 0;\n    while (sum + weights[offset] <= up) {\n        sum += weights[offset++];\n        DCHECK_LT(offset, weights.size());\n    }\n\n    // 4. 해당 원소가 뽑힐 확률(pmf)과 남은 난수 재활용 값(uRemap) 반환\n    if (pmf) *pmf = weights[offset] / sumWeights;\n    if (uRemap) *uRemap = std::min((up - sum) / weights[offset], OneMinusEpsilon);\n\n    return offset;\n}",
      "explanationKo": "이 예제는 가중치가 유한하고 음수가 아니어야 합니다. 합이 0이면 유효한 가중 분포가 없으므로 실패를 반환합니다. SampleDiscrete()는 가중치들의 합이 1이 아니어도(비정규화 상태) 자동으로 전체 합을 구해 인덱스를 뽑아줍니다. 특히 uRemap은 구간 내부에서 쓰이고 남은 정밀도 난수를 다시 [0, 1)로 정규화하여 다음 셰이딩 연산에 공짜로 재활용할 수 있게 해주는 고성능 기법입니다.",
      "provenance": "teaching",
      "id": "ch02-03-b6"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 자료구조/알고리즘 콕콕",
      "title": "선형 탐색 O(N) vs 이진 탐색 O(log N) vs 별칭 테이블 O(1)",
      "summary": "수만 개의 조명 중에서 1개를 초고속으로 골라내는 컴퓨터 알고리즘의 진화",
      "points": [
        {
          "title": "이진 탐색(Binary Search): std::upper_bound",
          "content": "가중치 원소가 수만 개(예: 거대한 도시 야경의 가로등 5만 개)일 때 선형 루프를 돌면 너무 느립니다. CDF가 이미 단조 증가(오름차순 정렬) 상태라는 점을 이용해 이진 탐색을 돌리면 단 $\\approx 16$번의 비교($O(\\log N)$)만으로 빛의 속도로 전등을 찾아냅니다."
        },
        {
          "title": "보커의 별칭 테이블(Walker's Alias Method): O(1)",
          "content": "테이블을 한 번 전처리해 두면, 이진 탐색조차 거치지 않고 **단 한 번의 배열 인덱싱($O(1)$)**만으로 어떤 복잡한 이산 확률 분포도 상수 시간에 즉시 뽑아낼 수 있습니다. pbrt는 대규모 광원 샘플링에 이 별칭 방식을 탑재하고 있습니다."
        }
      ],
      "tags": [
        "이진 탐색",
        "별칭 테이블",
        "Alias Method",
        "O(1) 샘플링",
        "자료구조"
      ],
      "id": "ch02-03-b7"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "2.3.2 연속 확률 변수의 역변환 샘플링 (Continuous Case)",
      "titleEn": "2.3.2 Continuous Case",
      "id": "ch02-03-b8"
    },
    {
      "type": "paragraph",
      "textKo": "이산 사건에서 막대의 개수를 무한대로 늘리고 두께를 0으로 극한을 취하면 **연속 확률 변수 (Continuous Case)**의 역변환 방법이 자연스럽게 유도됩니다.  \n연속 확률 밀도 함수 $p(x)$가 주어졌을 때, 3단계 레시피는 다음과 같습니다:  \n\n1. **누적 분포 함수(CDF) 계산**: PDF를 적분하여 누적 분포 함수 $P(x)$를 구합니다:  \n$$P(x) = \\int_{-\\infty}^x p(t) dt$$  \n2. **균일 난수 $\\xi$ 설정**: 구간 $[0, 1)$에서 균일 난수 $\\xi \\sim U(0, 1)$를 하나 뽑아 방정식 $\\xi = P(X)$를 세웁니다.  \n3. **역함수 풀이 (Inversion)**: 방정식을 $X$에 대해 풀어 역함수를 구합니다!  \n$$X = P^{-1}(\\xi)$$",
      "textEn": "For continuous distributions, the inversion method follows a 3-step recipe: 1. Integrate the PDF to compute the CDF: P(x) = integral_{-infinity}^x p(t) dt. 2. Draw a uniform random sample xi ~ U(0, 1) and set xi = P(X). 3. Invert the CDF to obtain X = P^{-1}(xi).",
      "id": "ch02-03-b9"
    },
    {
      "type": "paragraph",
      "textKo": "이 간단한 공식이 왜 항상 참인지 수학적으로 증명해 보겠습니다:  \n새롭게 만들어진 확률 변수 $X = P^{-1}(\\xi)$가 어떤 값 $x$ 이하일 확률은 다음과 같습니다:  \n$$\\Pr\\{X \\le x\\} = \\Pr\\{P^{-1}(\\xi) \\le x\\}$$  \n$P(x)$는 확률의 누적이므로 항상 단조 비감소(Monotonically nondecreasing) 함수입니다. 따라서 양변에 $P$를 씌워도 부등호 방향이 바뀌지 않습니다:  \n$$\\Pr\\{P^{-1}(\\xi) \\le x\\} = \\Pr\\{\\xi \\le P(x)\\}$$  \n그런데 $\\xi$는 구간 $[0, 1)$에서 균일하게 분포하므로, $\\xi$가 어떤 값 $y$ 이하일 확률은 그냥 $y$ 자신입니다($\\Pr\\{\\xi \\le y\\} = y$).  \n따라서:  \n$$\\Pr\\{\\xi \\le P(x)\\} = P(x)$$  \n결과적으로 $X$의 누적 분포 함수가 정확히 우리가 원했던 $P(x)$가 됨이 확인됩니다. 평평한 구간이나 점프가 있는 CDF에는 보통의 일대일 역함수 대신 일반화된 역함수를 사용하고 경계의 규약을 정해야 합니다.",
      "textEn": "Proof that X has CDF P(x): Pr{X <= x} = Pr{P^{-1}(xi) <= x}. Because P is monotonically increasing, applying P to both sides yields Pr{xi <= P(x)}. Since xi is uniformly distributed on [0, 1), Pr{xi <= y} = y. Therefore, Pr{xi <= P(x)} = P(x), rigorously proving that X precisely follows the desired distribution.",
      "id": "ch02-03-b10"
    },
    {
      "type": "subheading",
      "level": 4,
      "titleKo": "구체적 실전 예제: 선형 램프 함수 샘플링 (Sampling a Linear Function)",
      "titleEn": "Sampling a Linear Function",
      "id": "ch02-03-b11"
    },
    {
      "type": "paragraph",
      "textKo": "실제 그래픽스에서 자주 쓰이는 구간 $[0, 1]$에서의 선형 보간 함수를 직접 역변환해 봅시다:  \n$$f(x) = (1 - x)a + xb \\quad (a, b \\ge 0,\\ a+b>0)$$  \n1. 먼저 함수의 전체 넓이를 구해 정규화 상수를 구합니다:  \n$$c = \\int_0^1 ((1 - x)a + xb) dx = \\frac{a + b}{2}$$  \n2. 정규화된 확률 밀도 함수(PDF)는 다음과 같습니다:  \n$$p(x) = \\frac{f(x)}{c} = \\frac{2((1 - x)a + xb)}{a + b}$$  \n3. 누적 분포 함수(CDF)를 적분으로 구합니다:  \n$$P(x) = \\int_0^x p(t) dt = \\frac{2ax + (b - a)x^2}{a + b}$$  \n4. $\\xi = P(x)$를 놓고 2차 방정식의 근의 공식을 풀어 $x$에 대해 정리하면:  \n$$x = \\frac{u(a + b)}{a + \\sqrt{(1 - u)a^2 + u b^2}}$$  \n이 수식을 C++ 코드로 옮긴 것이 바로 아래의 `SampleLinear()` 함수입니다:",
      "textEn": "Consider sampling the linear function f(x) = (1 - x)a + xb on [0, 1]. Integrating yields c = (a + b)/2, giving PDF p(x) = 2((1 - x)a + xb) / (a + b). Integrating the PDF yields the quadratic CDF P(x) = (2ax + (b - a)x^2) / (a + b). Inverting xi = P(x) using the quadratic formula provides a closed-form sampling recipe implemented in SampleLinear().",
      "id": "ch02-03-b12"
    },
    {
      "type": "code",
      "chunkName": "<<SampleLinear Function>>=",
      "language": "cpp",
      "code": "// 독립 학습용 구현: 원서의 전체 API가 아니라 경계 처리를 보여 줍니다.\ninline Float SampleLinear(Float u, Float a, Float b) {\n    DCHECK(a >= 0 && b >= 0 && u >= 0 && u < 1);\n    if (a == 0 && b == 0) return u; // 영 함수: 균일 표본으로 정한 fallback\n    if (u == 0) return 0;           // a=0인 경우의 0/0 방지\n    Float x = u * (a + b) / (a + std::sqrt(Lerp(u, a * a, b * b)));\n    return std::min(x, OneMinusEpsilon);\n}",
      "explanationKo": "SampleLinear()는 근의 공식을 그대로 쓰면 a=b일 때 분모가 0이 되는 부정형(0/0) a=b에서의 차를 피하는 형태를 사용합니다. 별도로 a=0,u=0의 경계와 가중치 합이 0인 입력도 처리해야 합니다.",
      "provenance": "teaching",
      "id": "ch02-03-b13"
    },
    {
      "type": "paragraph",
      "textKo": "이제 우리는 1차원 수직선 위에서 어떤 형태의 확률 분포라도 균일 난수를 이용해 자유자재로 뽑아낼 수 있게 되었습니다!  \n하지만 실제 3D 렌더링 공간은 2차원 평면(카메라 렌즈, 디스크)과 3차원 입체 공간(구면, 반구면 방향)으로 이루어져 있습니다.  \n다음 2.4절에서는 다차원 공간에서 확률 분포를 서로 변환하고 샘플링하는 **야코비안(Jacobian) 행렬식과 다차원 역변환 기법(Transforming between Distributions)**을 배우겠습니다.",
      "textEn": "Having mastered 1D inversion, Section 2.4 extends this theory to multiple dimensions, introducing Jacobian determinants and marginal-conditional decompositions for sampling disks, spheres, and hemispheres.",
      "id": "ch02-03-b14"
    },
    {
      "type": "subheading",
      "id": "ch02-03-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch02-03-source-figure-2-4",
      "number": "Figure 2.4",
      "title": "Original Figure 2.4",
      "titleKo": "원문 그림 2.4",
      "src": "/books/pbrt-4ed/reviewed-images/figure-2-4.png",
      "captionKo": "그림 2.4 · 그림 2.3의 확률을 앞에서부터 누적한 이산 CDF입니다. i번째 높이는 처음부터 i번째 사건까지의 확률 합입니다.",
      "captionEn": "Figure 2.4: A Discrete CDF, Corresponding to the PMF in Figure 2.3 . Each column’s height is given by the PMF for the event that it represents plus the sum of the PMFs for the previous events, upper P Subscript i Baseline equals sigma-summation Underscript j equals 1 Overscript i Endscripts p Subscript j .",
      "width": 998,
      "height": 237,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Monte_Carlo_Integration/Sampling_Using_the_Inversion_Method.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "e9a8d77f82ee35435a1976cbb8d6c5fe2f0698887977d8bb69aa765b33e34e7a",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "2.3 Sampling Using the Inversion Method",
      "2.3.1  Discrete Case",
      "2.3.2  Continuous Case",
      "Sampling a Linear Function"
    ],
    "sourceFigures": [
      "2.3",
      "2.4",
      "2.5"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
