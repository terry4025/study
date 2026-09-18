import { SectionContent } from '../../../../types/book';

export const CH02_03_INVERSION_METHOD: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '2',
  chapterTitleKo: '제2장 몬테카를로 적분 (Monte Carlo Integration)',
  sectionNumber: '2.3',
  sectionTitle: 'Sampling Using the Inversion Method',
  sectionTitleKo: '2.3 역변환 방법을 이용한 확률 샘플링 (The Inversion Method)',
  originalUrl: 'https://pbr-book.org/4ed/Monte_Carlo_Integration/Sampling_Using_the_Inversion_Method.html',
  prevSection: {
    id: 'ch02-02',
    title: '2.2 샘플링 효율성 향상 기법',
  },
  nextSection: {
    id: 'ch02-04',
    title: '2.4 다차원 확률 분포 간 변환',
  },
  summary: {
    keyTakeaways: [
      '역변환 방법(Inversion Method)은 컴퓨터가 생성하는 균일 난수 $\\xi \\sim U(0, 1)$를 누적분포함수의 역함수 $P^{-1}(\\xi)$에 대입하여, 원하는 임의의 확률밀도함수(PDF)를 따르는 난수를 만들어내는 근본적인 기법입니다.',
      '이산 사건(Discrete Case): 가중치들의 누적합(CDF) 막대를 세워두고 난수 $\\xi$가 어느 막대 구간에 떨어지는지 이진 탐색($O(\\log n)$)이나 별칭 테이블(Alias Method, $O(1)$)로 빠르게 찾아냅니다.',
      '연속 사건(Continuous Case): $p(x)$를 적분하여 누적분포함수 $P(x)$를 구한 뒤, 방정식 $\\xi = P(x)$를 $x$에 대해 풀어 $x = P^{-1}(\\xi)$ 공식을 유도합니다.',
      '선형 보간 함수 $f(x) = (1-x)a + xb$와 같은 빈출 패턴에 대해 수치적으로 안정적인 `SampleLinear()` 전용 샘플링 함수를 제공합니다.'
    ],
    prerequisites: [
      '누적분포함수(CDF)와 확률밀도함수(PDF)의 미적분 관계',
      '역함수(Inverse Function)의 개념 및 이진 탐색(Binary Search)'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: '2.2절에서 우리는 피적분 함수 $f(x)$와 닮은 모양의 확률 밀도 함수 $p(x)$를 골라 샘플링하면 분산이 극적으로 줄어든다는 것을 배웠습니다.  \n' +
        '하지만 실제 프로그래밍을 할 때 컴퓨터의 난수 생성기(`rand()`, `std::mt19937` 등)는 오직 **$0$과 $1$ 사이의 균일한 난수 $\\xi \\sim U(0, 1)$** 하나만을 뿜어낼 뿐입니다.  \n' +
        '그렇다면 이 단순한 균일 난수 $\\xi$를 가지고, 어떻게 우리가 원하는 특정한 모양의 확률 밀도 함수 $p(x)$를 정밀하게 따르는 표본 $X$로 둔갑시킬 수 있을까요?  \n' +
        '그 마법 같은 해답이 바로 **역변환 방법 (Inversion Method)**입니다.',
      textEn: 'While importance sampling reduces variance when samples match target PDFs, pseudo-random number generators only generate uniform random variables xi ~ U(0, 1). The inversion method is the fundamental mathematical tool that transforms uniform random numbers into samples from arbitrary probability distributions.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.3.1 이산 확률 변수의 역변환 샘플링 (Discrete Case)',
      titleEn: '2.3.1 Discrete Case'
    },
    {
      type: 'paragraph',
      textKo: '먼저 동전이나 주사위, 또는 씬에 배치된 여러 개의 조명들처럼 유한한 개수의 선택지가 있는 **이산 확률 변수(Discrete Case)**부터 살펴보겠습니다.  \n' +
        '각 사건 $i$가 일어날 확률을 $p_i$라고 하면, 모든 확률의 합은 $1$입니다:  \n$$\\sum_{i=1}^n p_i = 1$$  \n' +
        '이 확률들을 앞에서부터 차례대로 누적해서 쌓아 올린 것이 바로 **이산 누적 분포 함수(Discrete CDF $P_i$)**입니다:  \n$$P_i = \\sum_{j=1}^i p_j \\quad (P_0 = 0, \\; P_n = 1)$$',
      textEn: 'Consider discrete events with probabilities p_i summing to 1. The discrete cumulative distribution function (CDF) is given by P_i = sum_{j=1}^i p_j, with P_0 = 0 and P_n = 1.'
    },
    {
      type: 'figure',
      id: 'fig:discrete-pdf-cdf',
      number: 'Figure 2.3 & 2.4',
      title: 'Discrete PMF and CDF',
      titleKo: '이산 확률 질량 함수(PMF)와 누적 분포 함수(CDF)',
      src: '/books/pbrt-4ed/images/discrete-cdf.svg',
      captionKo: '왼쪽의 개별 확률 막대(PMF)들을 왼쪽부터 벽돌처럼 차례대로 쌓아 올리면, 오른쪽처럼 $0$부터 $1$까지 계단식으로 우상향하는 누적 분포 함수(CDF)가 완성됩니다. 막대가 넓을수록 계단의 높이가 더 가파르게 상승합니다.',
      captionEn: 'Figure 2.3 & 2.4: A discrete probability mass function (PMF) for four events, and its corresponding cumulative distribution function (CDF) formed by accumulating probabilities from 0 to 1.'
    },
    {
      type: 'figure',
      id: 'fig:discrete-inversion',
      number: 'Figure 2.5',
      title: 'Sampling via Inversion Method',
      titleKo: '역변환 방법을 이용한 이산 사건 선택 과정',
      src: '/books/pbrt-4ed/images/discrete-inversion.svg',
      captionKo: '균일 난수 $\\xi \\in [0, 1)$를 세로축에 무작위 화살표로 쏩니다. 그리고 화살표가 CDF 계단에 부딪히는 지점에서 아래(가로축)로 수선을 내리면 해당하는 사건 인덱스 $i$가 자동으로 결정됩니다! 누적 확률 구간 $[P_{i-1}, P_i)$이 넓은 사건일수록 화살표에 맞을 확률이 정확히 $p_i$만큼 정비례하여 커집니다.',
      captionEn: 'Figure 2.5: To sample from the distribution using the inversion method, draw a uniform random number xi in [0, 1), locate which step of the CDF contains xi such that P_{i-1} <= xi < P_i, and return the corresponding event index i.'
    },
    {
      type: 'code',
      chunkName: '<<SampleDiscrete Function>>=',
      language: 'cpp',
      code: `// 정규화되지 않은 가중치 배열에서 확률적으로 인덱스를 뽑는 pbrt 핵심 함수
template <typename Float>
int SampleDiscrete(pstd::span<const Float> weights, Float u,
                   Float *pmf = nullptr, Float *uRemap = nullptr) {
    if (weights.empty()) {
        if (pmf) *pmf = 0;
        return -1;
    }
    // 1. 전체 가중치의 합 계산
    Float sumWeights = 0;
    for (Float w : weights)
        sumWeights += w;

    // 2. 균일 난수 u를 전체 가중치 스케일로 확장
    Float up = u * sumWeights;
    if (up == sumWeights)
        up = std::nextafter(up, -Float(Infinity));

    // 3. 누적합을 순회하며 난수 up가 속한 구간(offset) 찾기
    int offset = 0;
    Float sum = 0;
    while (sum + weights[offset] <= up) {
        sum += weights[offset++];
        DCHECK_LT(offset, weights.size());
    }

    // 4. 해당 원소가 뽑힐 확률(pmf)과 남은 난수 재활용 값(uRemap) 반환
    if (pmf) *pmf = weights[offset] / sumWeights;
    if (uRemap) *uRemap = std::min((up - sum) / weights[offset], OneMinusepsilon);

    return offset;
}`,
      explanationKo: 'SampleDiscrete()는 가중치들의 합이 1이 아니어도(비정규화 상태) 자동으로 전체 합을 구해 인덱스를 뽑아줍니다. 특히 uRemap은 구간 내부에서 쓰이고 남은 정밀도 난수를 다시 [0, 1)로 정규화하여 다음 셰이딩 연산에 공짜로 재활용할 수 있게 해주는 고성능 기법입니다.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 자료구조/알고리즘 콕콕',
      title: '선형 탐색 O(N) vs 이진 탐색 O(log N) vs 별칭 테이블 O(1)',
      summary: '수만 개의 조명 중에서 1개를 초고속으로 골라내는 컴퓨터 알고리즘의 진화',
      points: [
        {
          title: '이진 탐색(Binary Search): std::upper_bound',
          content: '가중치 원소가 수만 개(예: 거대한 도시 야경의 가로등 5만 개)일 때 선형 루프를 돌면 너무 느립니다. CDF가 이미 단조 증가(오름차순 정렬) 상태라는 점을 이용해 이진 탐색을 돌리면 단 $\\approx 16$번의 비교($O(\\log N)$)만으로 빛의 속도로 전등을 찾아냅니다.'
        },
        {
          title: '보커의 별칭 테이블(Walker\'s Alias Method): O(1)',
          content: '테이블을 한 번 전처리해 두면, 이진 탐색조차 거치지 않고 **단 한 번의 배열 인덱싱($O(1)$)**만으로 어떤 복잡한 이산 확률 분포도 상수 시간에 즉시 뽑아낼 수 있습니다. pbrt는 대규모 광원 샘플링에 이 별칭 방식을 탑재하고 있습니다.'
        }
      ],
      tags: ['이진 탐색', '별칭 테이블', 'Alias Method', 'O(1) 샘플링', '자료구조']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.3.2 연속 확률 변수의 역변환 샘플링 (Continuous Case)',
      titleEn: '2.3.2 Continuous Case'
    },
    {
      type: 'paragraph',
      textKo: '이산 사건에서 막대의 개수를 무한대로 늘리고 두께를 0으로 극한을 취하면 **연속 확률 변수 (Continuous Case)**의 역변환 방법이 자연스럽게 유도됩니다.  \n' +
        '연속 확률 밀도 함수 $p(x)$가 주어졌을 때, 3단계 레시피는 다음과 같습니다:  \n\n' +
        '1. **누적 분포 함수(CDF) 계산**: PDF를 적분하여 누적 분포 함수 $P(x)$를 구합니다:  \n$$P(x) = \\int_{-\\infty}^x p(t) dt$$  \n' +
        '2. **균일 난수 $\\xi$ 설정**: 구간 $[0, 1)$에서 균일 난수 $\\xi \\sim U(0, 1)$를 하나 뽑아 방정식 $\\xi = P(X)$를 세웁니다.  \n' +
        '3. **역함수 풀이 (Inversion)**: 방정식을 $X$에 대해 풀어 역함수를 구합니다!  \n$$X = P^{-1}(\\xi)$$',
      textEn: 'For continuous distributions, the inversion method follows a 3-step recipe: 1. Integrate the PDF to compute the CDF: P(x) = integral_{-infinity}^x p(t) dt. 2. Draw a uniform random sample xi ~ U(0, 1) and set xi = P(X). 3. Invert the CDF to obtain X = P^{-1}(xi).'
    },
    {
      type: 'paragraph',
      textKo: '이 간단한 공식이 왜 항상 참인지 수학적으로 증명해 보겠습니다:  \n' +
        '새롭게 만들어진 확률 변수 $X = P^{-1}(\\xi)$가 어떤 값 $x$ 이하일 확률은 다음과 같습니다:  \n$$\\Pr\\{X \\le x\\} = \\Pr\\{P^{-1}(\\xi) \\le x\\}$$  \n' +
        '$P(x)$는 확률의 누적이므로 항상 단조 증가(Monotonically increasing) 함수입니다. 따라서 양변에 $P$를 씌워도 부등호 방향이 바뀌지 않습니다:  \n$$\\Pr\\{P^{-1}(\\xi) \\le x\\} = \\Pr\\{\\xi \\le P(x)\\}$$  \n' +
        '그런데 $\\xi$는 구간 $[0, 1)$에서 균일하게 분포하므로, $\\xi$가 어떤 값 $y$ 이하일 확률은 그냥 $y$ 자신입니다($\\Pr\\{\\xi \\le y\\} = y$).  \n' +
        '따라서:  \n$$\\Pr\\{\\xi \\le P(x)\\} = P(x)$$  \n' +
        '결과적으로 $X$의 누적 분포 함수가 정확히 우리가 원했던 $P(x)$가 됨이 수학적으로 완벽히 증명되었습니다!',
      textEn: 'Proof that X has CDF P(x): Pr{X <= x} = Pr{P^{-1}(xi) <= x}. Because P is monotonically increasing, applying P to both sides yields Pr{xi <= P(x)}. Since xi is uniformly distributed on [0, 1), Pr{xi <= y} = y. Therefore, Pr{xi <= P(x)} = P(x), rigorously proving that X precisely follows the desired distribution.'
    },
    {
      type: 'subheading',
      level: 4,
      titleKo: '구체적 실전 예제: 선형 램프 함수 샘플링 (Sampling a Linear Function)',
      titleEn: 'Sampling a Linear Function'
    },
    {
      type: 'paragraph',
      textKo: '실제 그래픽스에서 자주 쓰이는 구간 $[0, 1]$에서의 선형 보간 함수를 직접 역변환해 봅시다:  \n$$f(x) = (1 - x)a + xb \\quad (a, b \\ge 0)$$  \n' +
        '1. 먼저 함수의 전체 넓이를 구해 정규화 상수를 구합니다:  \n$$c = \\int_0^1 ((1 - x)a + xb) dx = \\frac{a + b}{2}$$  \n' +
        '2. 정규화된 확률 밀도 함수(PDF)는 다음과 같습니다:  \n$$p(x) = \\frac{f(x)}{c} = \\frac{2((1 - x)a + xb)}{a + b}$$  \n' +
        '3. 누적 분포 함수(CDF)를 적분으로 구합니다:  \n$$P(x) = \\int_0^x p(t) dt = \\frac{2ax + (b - a)x^2}{a + b}$$  \n' +
        '4. $\\xi = P(x)$를 놓고 2차 방정식의 근의 공식을 풀어 $x$에 대해 정리하면:  \n$$x = \\frac{u(a + b)}{a + \\sqrt{(1 - u)a^2 + u b^2}}$$  \n이 수식을 C++ 코드로 옮긴 것이 바로 아래의 `SampleLinear()` 함수입니다:',
      textEn: 'Consider sampling the linear function f(x) = (1 - x)a + xb on [0, 1]. Integrating yields c = (a + b)/2, giving PDF p(x) = 2((1 - x)a + xb) / (a + b). Integrating the PDF yields the quadratic CDF P(x) = (2ax + (b - a)x^2) / (a + b). Inverting xi = P(x) using the quadratic formula provides a closed-form sampling recipe implemented in SampleLinear().'
    },
    {
      type: 'code',
      chunkName: '<<SampleLinear Function>>=',
      language: 'cpp',
      code: `// 구간 [0, 1]에서 선형 함수를 역변환 기법으로 정확히 샘플링하는 함수
inline Float SampleLinear(Float u, Float a, Float b) {
    if (a == 0 && b == 0)
        return u;
    // 부동소수점 오차로 인한 분모 0 문제를 방지하는 수치적으로 안정적인 폼
    Float x = u * (a + b) / (a + std::sqrt(Lerp(u, a * a, b * b)));
    return std::min(x, OneMinusEpsilon);
}`,
      explanationKo: 'SampleLinear()는 근의 공식을 그대로 쓰면 a=b일 때 분모가 0이 되는 부정형(0/0) 수치 불안정성을 영리한 대수적 변형으로 완전히 극복한 고성능 함수입니다.'
    },
    {
      type: 'paragraph',
      textKo: '이제 우리는 1차원 수직선 위에서 어떤 형태의 확률 분포라도 균일 난수를 이용해 자유자재로 뽑아낼 수 있게 되었습니다!  \n' +
        '하지만 실제 3D 렌더링 공간은 2차원 평면(카메라 렌즈, 디스크)과 3차원 입체 공간(구면, 반구면 방향)으로 이루어져 있습니다.  \n' +
        '다음 2.4절에서는 다차원 공간에서 확률 분포를 서로 변환하고 샘플링하는 **야코비안(Jacobian) 행렬식과 다차원 역변환 기법(Transforming between Distributions)**을 배우겠습니다.',
      textEn: 'Having mastered 1D inversion, Section 2.4 extends this theory to multiple dimensions, introducing Jacobian determinants and marginal-conditional decompositions for sampling disks, spheres, and hemispheres.'
    }
  ]
};
