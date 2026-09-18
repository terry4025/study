import { SectionContent } from '../../../../types/book';

export const CH02_01_MONTE_CARLO_BASICS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '2',
  chapterTitleKo: '제2장 몬테카를로 적분 (Monte Carlo Integration)',
  sectionNumber: '2.1',
  sectionTitle: 'Monte Carlo: Basics',
  sectionTitleKo: '2.1 몬테카를로 적분의 기초 원리 (Monte Carlo: Basics)',
  originalUrl: 'https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics.html',
  prevSection: {
    id: 'ch01-06',
    title: '1.6 물리 기반 렌더링의 간략한 역사',
  },
  nextSection: {
    id: 'ch02-02',
    title: '2.2 샘플링 효율성 향상 기법',
  },
  summary: {
    keyTakeaways: [
      '몬테카를로 적분은 무작위 난수(Random Sampling)를 이용하여 수식으로 직접 풀 수 없는 복잡한 고차원 적분의 근사치를 구하는 컴퓨터 수치해석 기법입니다.',
      '몬테카를로 추정량(Estimator) $F_N = \\frac{1}{N} \\sum_{i=1}^N \\frac{f(X_i)}{p(X_i)}$ 은 수학적으로 기댓값이 원래 적분값과 정확히 일치하는 비편향(Unbiased) 추정량입니다.',
      '전통적인 수치적분(사다리꼴 공식, 심슨 공식)은 차원이 늘어날 때마다 연산량이 기하급수적으로 폭증하는 "차원의 저주(Curse of Dimensionality, $O(N^{-1/d})$)"에 빠지지만, 몬테카를로는 차원 수와 무관하게 언제나 $O(N^{-1/2})$ 속도로 수렴합니다.',
      '오차(표준편차)가 표본 수의 제곱근에 반비례($\\sigma \\propto 1/\\sqrt{N}$)하므로, 렌더링 노이즈를 절반(1/2)으로 줄이기 위해서는 샘플 수를 4배 늘려야 합니다.'
    ],
    prerequisites: [
      '고등학교 미적분학의 정적분 개념',
      '기초 확률론 (확률변수, 기댓값, 분산, 확률밀도함수 PDF)'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: '몬테카를로 적분(Monte Carlo Integration)은 **무작위성(Randomization)**을 핵심 도구로 삼는 강력한 수치해석 알고리즘입니다. 컴퓨터 그래픽스에서 물리 기반 렌더링의 심장부를 이루는 렌더링 방정식(Rendering Equation)은 수식으로 직접 적분하기가 사실상 불가능합니다. 하지만 컴퓨터가 무작위 주사위를 굴려 확률적으로 표본을 추출하면, 놀랍도록 단순한 사칙연산의 평균만으로 복잡한 우주의 빛 적분을 정확하게 풀어낼 수 있습니다.  \n본격적인 적분 알고리즘으로 들어가기에 앞서, 본 절에서는 몬테카를로 적분의 든든한 뼈대가 되는 핵심 확률론 개념들을 차근차근 짚어보겠습니다.',
      textEn: 'Because Monte Carlo integration is based on randomization, we will start this chapter with a brief review of ideas from probability theory. The rendering equation at the heart of physically based rendering cannot be integrated analytically, but by using random sampling, computers can approximate complex integrals through simple sample averages.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.1.1 확률론 기초 복습 (Background and Probability Review)',
      titleEn: '2.1.1 Background and Probability Review'
    },
    {
      type: 'paragraph',
      textKo: '**확률 변수(Random Variable $X$)**는 어떤 무작위적인 시행에 의해 결정되는 값을 말합니다. 일반적으로 대문자($X, Y$)로 표기하며, 그 확률 변수가 가질 수 있는 구체적인 실현값들은 소문자($x$)나 첨자($X_i$)로 표기합니다.',
      textEn: 'A random variable X is a value chosen by some random process. We will generally use capital letters to denote random variables, with individual values denoted by lowercase letters or indexed variables X_i.'
    },
    {
      type: 'paragraph',
      textKo: '확률 변수는 크게 두 가지로 나뉩니다:  \n' +
        '1. **이산 확률 변수 (Discrete Random Variable)**: 유한하거나 셀 수 있는 값들 중 하나를 갖습니다. 가장 친숙한 예는 주사위 던지기입니다. 주사위의 결과는 집합 $\\{1, 2, 3, 4, 5, 6\\}$ 중 하나이며, 각 면이 나올 확률은 $p_i = 1/6$ 입니다. 모든 사건의 확률 합은 항상 1입니다:  \n$$\\sum_{i=1}^6 p_i = 1$$  \n' +
        '2. **연속 확률 변수 (Continuous Random Variable)**: 어떤 연속된 구간(실수 전체, 단위 구면 위의 방향 등) 내의 임의의 값을 갖습니다. 렌더링에서 광선이 튕겨 나갈 3차원 방향($\\omega$)이나 표면의 위치($p$)는 모두 연속 확률 변수입니다.',
      textEn: 'Random variables can be discrete or continuous. A roll of a die is a discrete random variable with events from {1, 2, 3, 4, 5, 6}, each having probability p_i = 1/6, summing to 1. Continuous random variables take on values over continuous domains, such as directions on the unit sphere or positions on a 3D surface.'
    },
    {
      type: 'paragraph',
      textKo: '두 확률 변수 $X$와 $Y$가 서로에게 아무런 영향을 미치지 않을 때 두 변수는 **독립(Independent)**이라고 부릅니다. 독립 변수의 결합 확률(Joint Probability)은 각각의 확률의 곱과 같습니다:  \n$$p(x, y) = p(x) p(y)$$  \n' +
        '반면, 한 사건의 발생이 다른 사건에 영향을 미치는 경우를 **종속(Dependent)**이라고 합니다. 예를 들어 검은 공 2개와 흰 공 1개가 든 주머니에서 공을 하나 꺼낸 뒤 다시 넣지 않고 두 번째 공을 꺼낼 때, 첫 번째 결과는 두 번째 공의 확률을 바꿉니다. 이때는 **조건부 확률(Conditional Probability)**을 사용하여 결합 확률을 정의합니다:  \n$$p(x, y) = p(x) p(y \\mid x)$$',
      textEn: 'Two random variables are independent if the probability of one does not affect the probability of the other, so p(x, y) = p(x) p(y). For dependent variables, one\'s probability affects the other\'s, governed by conditional probability: p(x, y) = p(x) p(y | x).'
    },
    {
      type: 'paragraph',
      textKo: '컴퓨터 그래픽스에서 가장 기본이 되는 중요한 확률 변수는 **표준 균일 확률 변수(Canonical Uniform Random Variable $\\xi$)**입니다. 이 변수는 구간 $[0, 1)$ 사이의 임의의 실수 값을 완벽하게 균일한 확률로 가집니다. 컴퓨터의 난수 생성기(`sampler.Get1D()`, `sampler.Get2D()`)가 뿜어내는 기본 값이 바로 이 $\\xi$입니다.  \n' +
        '예를 들어 씬에 여러 개의 광선 조명이 있을 때, 각 조명의 밝기 비율에 따라 구간 $[0, 1)$을 쪼개어 놓으면, 단 하나의 균일 난수 $\\xi$만으로도 밝은 전등을 더 자주 샘플링하도록 손쉽게 분기시킬 수 있습니다.',
      textEn: 'A particularly important random variable is the canonical uniform random variable, written as xi. This variable takes on values uniformly in the range [0, 1). Standard pseudo-random number generators provide samples of xi, which can then be mapped to sample lights or surface reflection directions.'
    },
    {
      type: 'paragraph',
      textKo: '**누적 분포 함수 (Cumulative Distribution Function, CDF $P(x)$)**는 확률 변수 $X$가 특정 값 $x$ 이하일 확률로 정의됩니다:  \n$$P(x) = \\Pr\\{X \\le x\\}$$  \n' +
        '주사위 예시에서 $P(2) = 2/6 = 1/3$ 입니다. 1 또는 2가 나올 확률이기 때문입니다.  \n' +
        '연속 확률 변수에서는 특정 한 점 $x$가 정확히 뽑힐 확률은 사실상 0입니다. 따라서 연속 변수에서는 확률의 밀도를 나타내는 **확률 밀도 함수 (Probability Density Function, PDF $p(x)$)**를 사용합니다. PDF는 누적 분포 함수 CDF의 미분으로 정의됩니다:  \n$$p(x) = \\frac{d P(x)}{dx}$$  \n' +
        'PDF는 반드시 $0$ 이상이어야 하며($p(x) \\ge 0$), 정의역 전체를 적분하면 반드시 $1$이 되어야 합니다:  \n$$\\int p(x) dx = 1$$  \n' +
        '구간 $[a, b]$ 사이에서 값이 뽑힐 확률은 PDF를 해당 구간만큼 적분하여 구합니다:  \n$$\\Pr\\{a \\le X \\le b\\} = \\int_a^b p(x) dx = P(b) - P(a)$$',
      textEn: 'The cumulative distribution function (CDF) P(x) is the probability that a value is less than or equal to x: P(x) = Pr{X <= x}. The probability density function (PDF) p(x) is the derivative of the CDF: p(x) = dP(x)/dx. PDFs are nonnegative and integrate to 1 over their domain. Integrating the PDF over an interval [a, b] gives the probability that a sample falls in that range: Pr{a <= X <= b} = integral_a^b p(x) dx = P(b) - P(a).'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.1.2 기댓값과 분산 (Expected Values and Variance)',
      titleEn: '2.1.2 Expected Values and Variance'
    },
    {
      type: 'paragraph',
      textKo: '함수 $f(x)$에 대한 확률 변수 $X$의 **기댓값 (Expected Value $E[f(X)]$)**은 해당 확률 분포 하에서 함수 값이 가질 것으로 기대되는 이론적 평균값입니다:  \n$$E_p[f(x)] = \\int f(x) p(x) dx$$  \n' +
        '이산 확률 변수라면 적분 대신 가중합이 됩니다:  \n$$E[X] = \\sum_{i} x_i p_i$$',
      textEn: 'The expected value E_p[f(x)] of a function f with respect to a probability distribution p is defined as the average value of f over the distribution: E[f(x)] = integral f(x) p(x) dx, or E[X] = sum x_i p_i for discrete random variables.'
    },
    {
      type: 'paragraph',
      textKo: '간단한 예로, 구간 $[0, \\pi]$에서 균일한 확률 분포($p(x) = 1/\\pi$)를 가질 때 $\\cos(x)$ 함수의 기댓값을 구해봅시다:  \n$$E[\\cos(x)] = \\int_0^\\pi \\cos(x) \\frac{1}{\\pi} dx = \\frac{1}{\\pi} [\\sin(x)]_0^\\pi = \\frac{1}{\\pi}(0 - 0) = 0$$  \n코사인 그래프를 그려보면 $0$부터 $\\pi/2$까지는 양수이고, $\\pi/2$부터 $\\pi$까지는 정확히 대칭인 음수이므로, 무작위로 뽑은 코사인 값들의 평균이 0이 되는 것은 너무나 당연하고 직관적인 결과입니다.',
      textEn: 'As an example, consider the expected value of cos(x) on [0, pi] with a uniform PDF p(x) = 1/pi: E[cos(x)] = integral_0^pi cos(x) (1/pi) dx = 0. Symmetrical positive and negative areas cancel each other out, giving an intuitive expectation of zero.'
    },
    {
      type: 'paragraph',
      textKo: '기댓값은 대단히 유용한 **선형성(Linearity)**을 지니고 있습니다:  \n\n' +
        '1. 상수 배수의 분리:  \n$$E[a f(X)] = a E[f(X)]$$  \n' +
        '2. 합의 선형성: 여러 함수의 합의 기댓값은 각각의 기댓값의 합과 같다!  \n$$E\\left[ \\sum_{i} f_i(X) \\right] = \\sum_{i} E[f_i(X)]$$  \n' +
        '3. 독립 확률 변수 간의 곱: $X$와 $Y$가 독립이라면 곱의 기댓값은 각각의 기댓값의 곱과 같다!  \n$$E[f(X) g(Y)] = E[f(X)] E[g(Y)]$$',
      textEn: 'Expected values exhibit fundamental linear properties: E[a f(X)] = a E[f(X)], E[sum f_i(X)] = sum E[f_i(X)], and for independent random variables, E[f(X) g(Y)] = E[f(X)] E[g(Y)].'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.1.3 몬테카를로 추정량 (The Monte Carlo Estimator)',
      titleEn: '2.1.3 The Monte Carlo Estimator'
    },
    {
      type: 'paragraph',
      textKo: '이제 몬테카를로 적분의 가장 위대한 핵심 정의에 도달했습니다. 우리가 계산하고자 하는 임의의 1차원 정적분이 다음과 같다고 해봅시다:  \n$$I = \\int_a^b f(x) dx$$  \n' +
        '구간 $[a, b]$에서 균일하게 독립적으로 뽑은 $N$개의 표본 $X_1, X_2, \\dots, X_N$이 주어졌을 때, **몬테카를로 추정량(Monte Carlo Estimator $F_N$)**은 다음과 같이 정의됩니다:  \n$$F_N = \\frac{b - a}{N} \\sum_{i=1}^N f(X_i)$$  \n' +
        '이 식의 의미는 너무나 직관적입니다: **"함수의 높이들을 무작위로 여러 군데 찍어서 평균 높이를 구한 뒤, 밑변의 길이 $(b - a)$를 곱해 직사각형의 넓이로 적분값을 근사한다!"**는 것입니다.',
      textEn: 'We can now define the Monte Carlo estimator to approximate an integral I = integral_a^b f(x) dx. Given N independent uniform random samples X_i in [a, b], the Monte Carlo estimator is F_N = (b - a)/N sum_{i=1}^N f(X_i). Intuitively, it takes the average sampled function height and multiplies it by the domain width.'
    },
    {
      type: 'paragraph',
      textKo: '이 추정량이 수학적으로 진짜 올바른 적분값으로 수렴하는지 기댓값을 계산해 보겠습니다:  \n$$\\begin{aligned} E[F_N] &= E\\left[ \\frac{b - a}{N} \\sum_{i=1}^N f(X_i) \\right] \\\\ &= \\frac{b - a}{N} \\sum_{i=1}^N E[f(X_i)] \\\\ &= \\frac{b - a}{N} \\sum_{i=1}^N \\int_a^b f(x) \\frac{1}{b - a} dx \\\\ &= \\frac{1}{N} \\sum_{i=1}^N \\int_a^b f(x) dx \\\\ &= \\int_a^b f(x) dx = I \\end{aligned}$$  \n' +
        '놀랍게도 추정량의 기댓값이 우리가 구하려는 정적분 값 $I$와 완벽하게 일치합니다! 이렇게 기댓값이 참값과 정확히 일치하는 추정량을 통계학에서 **비편향 추정량(Unbiased Estimator)**이라고 부릅니다.',
      textEn: 'Taking the expectation shows that E[F_N] = I. Because the expected value of the estimator equals the true integral value, the Monte Carlo estimator is unbiased.'
    },
    {
      type: 'paragraph',
      textKo: '여기서 균일 분포라는 제약을 풀어, 임의의 확률 밀도 함수 $p(x)$를 따르는 표본들을 사용할 수 있도록 일반화해 보겠습니다:  \n$$F_N = \\frac{1}{N} \\sum_{i=1}^N \\frac{f(X_i)}{p(X_i)}$$  \n' +
        '이 일반화된 추정량의 유일한 조건은 **$f(x) \\ne 0$인 모든 구간에서 $p(x) > 0$이어야 한다**는 것뿐입니다.  \n' +
        '이 일반식 역시 기댓값을 구해보면:  \n$$E[F_N] = \\frac{1}{N} \\sum_{i=1}^N \\int \\frac{f(x)}{p(x)} p(x) dx = \\frac{1}{N} \\sum_{i=1}^N \\int f(x) dx = \\int f(x) dx$$  \n분모의 $p(x)$와 적분식의 $p(x)$가 서로 마법처럼 상쇄되면서 언제나 완벽한 비편향성을 유지합니다!  \n' +
        '우리가 앞서 1.3.6절의 `RandomWalkIntegrator` 코드에서 구면 샘플링 시 $(1 / (4\\pi))$로 나누어주었던 이유가 바로 여기에 있습니다. 단위 구면 전체의 면적이 $4\\pi$이므로, 구면에서 균일하게 방향을 뽑을 때의 PDF가 $p(\\omega) = \\frac{1}{4\\pi}$ 이기 때문입니다.',
      textEn: 'The restriction to uniform variables can be generalized for any PDF p(x): F_N = 1/N sum_{i=1}^N f(X_i) / p(X_i), as long as p(x) > 0 wherever f(x) != 0. Taking the expectation reveals that p(x) in the denominator cancels with the integral measure, maintaining strict unbiasedness. This explains the 1/(4*pi) factor in RandomWalkIntegrator, as uniform spherical sampling has p(omega) = 1/(4*pi).'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 수학/알고리즘 콕콕',
      title: '차원의 저주(Curse of Dimensionality)를 박살 내는 몬테카를로의 기적',
      summary: '왜 수치해석 교과서의 사다리꼴 공식이나 심슨 공식을 버리고 무작위 난수를 쓸까?',
      points: [
        {
          title: '전통 수치적분의 치명적 한계: O(N^(-1/d))',
          content: '사다리꼴 공식(Trapezoidal rule)이나 심슨 공식(Simpson\'s rule) 같은 전통적 결정론적 수치적분은 1차원에서는 $O(N^{-2})$로 대단히 빠릅니다. 하지만 차원이 $d$차원으로 늘어나면 격자 그리드를 채워야 하므로 오차 수렴율이 $O(N^{-1/d})$로 곤두박질칩니다. 광선 추적은 픽셀(2D) + 렌즈(2D) + 시간(1D) + 반사각(2D) 등 기본 7~10차원 적분입니다! 10차원에서 차원당 고작 4개의 격자점만 찍으려 해도 $4^{10} \\approx 100만$ 개의 광선이 필요합니다!'
        },
        {
          title: '몬테카를로의 기적: 차원과 무관한 O(N^(-1/2))',
          content: '몬테카를로 적분의 오차 수렴 속도는 적분 공간이 1차원이든, 10차원이든, 100차원이든 **차원 수 $d$와 완전히 무관하게 언제나 $O(N^{-1/2}) = O(1/\\sqrt{N})$**로 일정합니다. 이것이 바로 고차원 물리 시뮬레이션과 현대 영화 렌더러가 오직 몬테카를로 적분만을 사용하는 절대적 이유입니다.'
        }
      ],
      tags: ['차원의 저주', '몬테카를로 적분', '빅오 표기법', '수치해석', '고차원 적분']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.1.4 몬테카를로 추정량의 오차와 분산 (Error in Monte Carlo Estimators)',
      titleEn: '2.1.4 Error in Monte Carlo Estimators'
    },
    {
      type: 'paragraph',
      textKo: '몬테카를로 추정량이 무한히 많은 샘플을 뽑았을 때 참값으로 수렴한다는 사실만으로는 충분하지 않습니다. 실무에서는 **"유한한 $N$개의 샘플을 뽑았을 때 발생하는 오차(노이즈)의 크기가 얼마인가?"**가 훨씬 중요합니다.  \n이 오차의 척도가 바로 **분산 (Variance $V[X]$)**입니다.',
      textEn: 'Showing that the Monte Carlo estimator converges to the right answer is not enough; its rate of convergence and the expected variance for finite N samples are crucial in practice.'
    },
    {
      type: 'paragraph',
      textKo: '분산은 확률 변수가 기댓값(평균)으로부터 얼마나 멀리 흩어져 있는지를 나타내는 제곱 편차의 기댓값입니다:  \n$$V[f(X)] = E\\left[ (f(X) - E[f(X)])^2 \\right] = E[f(X)^2] - (E[f(X)])^2$$  \n' +
        '분산의 중요한 성질은 다음과 같습니다:  \n' +
        '1. $V[a f(X)] = a^2 V[f(X)]$ (상수는 제곱으로 튀어나온다)  \n' +
        '2. 독립인 두 변수 $X, Y$에 대해: $V[f(X) + g(Y)] = V[f(X)] + V[g(Y)]$ (독립 변수의 분산은 단순히 더해진다)',
      textEn: 'Variance measures the expected squared deviation from the mean: V[f(X)] = E[(f(X) - E[f(X)])^2] = E[f(X)^2] - (E[f(X)])^2. For independent variables, variances add linearly: V[f(X) + g(Y)] = V[f(X)] + V[g(Y)], and V[a f(X)] = a^2 V[f(X)].'
    },
    {
      type: 'paragraph',
      textKo: '이 성질을 이용해 $N$개 독립 표본으로 이루어진 몬테카를로 추정량 $F_N$의 분산을 계산해보면 놀라운 결과를 얻게 됩니다:  \n$$\\begin{aligned} V[F_N] &= V\\left[ \\frac{1}{N} \\sum_{i=1}^N \\frac{f(X_i)}{p(X_i)} \\right] \\\\ &= \\frac{1}{N^2} \\sum_{i=1}^N V\\left[ \\frac{f(X_i)}{p(X_i)} \\right] \\\\ &= \\frac{1}{N} V\\left[ \\frac{f(X)}{p(X)} \\right] \\end{aligned}$$  \n' +
        '즉, **추정량의 분산은 표본 수 $N$에 정확히 반비례하여 선형적으로 감소**합니다!  \n' +
        '우리가 실제 눈으로 인지하는 노이즈의 진폭, 즉 **표준 오차 (Standard Error $\\sigma[F_N]$)**는 분산의 제곱근입니다:  \n$$\\sigma[F_N] = \\sqrt{V[F_N]} = \\frac{\\sigma}{\\sqrt{N}}$$  \n' +
        '따라서 몬테카를로의 오차 수렴 속도는 **$O(N^{-1/2}) = O(1/\\sqrt{N})$**가 됩니다.',
      textEn: 'Computing the variance of F_N reveals V[F_N] = 1/N * V[f(X)/p(X)]. Variance decreases linearly with N. Standard error, the standard deviation of the estimate, is sigma[F_N] = sigma / sqrt(N), proving the characteristic O(N^{-1/2}) error convergence rate of Monte Carlo.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 상식 콕콕',
      title: '렌더링 노이즈를 절반으로 줄이려면 왜 4배의 시간이 걸릴까?',
      summary: '그래픽스 엔지니어와 3D 아티스트를 괴롭히는 1/sqrt(N)의 법칙',
      points: [
        {
          title: '노이즈 50% 감소 = 샘플 수 400% 필요',
          content: '표준 오차 공식이 $\\sigma \\propto 1/\\sqrt{N}$ 이기 때문에, 분모의 오차를 $1/2$로 깎으려면 루트 안의 $N$이 **$4$배**가 되어야 합니다. 화면의 지글거리는 노이즈를 $1/10$ 수준으로 완전히 없애려면 샘플 수를 무려 **$100$배** 늘려야 합니다!'
        },
        {
          title: '무작정 샘플만 늘리는 것은 하수(下手)다',
          content: '컴퓨터 시간을 100배씩 태울 수는 없습니다. 바로 이 때문에 똑똑한 그래픽스 연구자들은 샘플 수($N$)를 무작정 늘리는 대신, 분자의 분산($V[f/p]$) 자체를 줄이는 기술인 **중요도 샘플링(Importance Sampling)**과 **다중 중요도 샘플링(MIS)**을 발명했습니다. 이것이 다음 2.2절에서 배울 핵심 주제입니다.'
        }
      ],
      tags: ['렌더링 노이즈', '표준 오차', '1/sqrt(N)', '중요도 샘플링', '수렴 속도']
    },
    {
      type: 'paragraph',
      textKo: '두 개의 서로 다른 몬테카를로 알고리즘이 있을 때, 어느 쪽이 더 우수한 알고리즘인지 어떻게 공정하게 비교할 수 있을까요?  \n단순히 노이즈가 적다고 해서 좋은 것이 아닙니다. 노이즈를 줄이느라 알고리즘이 100배 느리게 돈다면 실격입니다. 제임스 해머슬리(Hammersley)와 핸스컴(Handscomb)은 **효율성 척도 (Efficiency Metric $\\epsilon[F]$)**를 제안했습니다:  \n$$\\epsilon[F] = \\frac{1}{V[F] \\cdot T[F]}$$  \n여기서 $V[F]$는 추정량의 분산이고, $T[F]$는 해당 계산을 수행하는 데 걸린 실제 실행 시간(초)입니다. 분산과 실행 시간의 곱이 작을수록 효율성 $\\epsilon$은 커집니다. 이 수치는 샘플 수 $N$에 영향을 받지 않는 고유한 알고리즘의 우수성을 완벽히 대변합니다.',
      textEn: 'To compare different Monte Carlo estimators, Hammersley and Handscomb defined an efficiency metric: epsilon[F] = 1 / (V[F] * T[F]), where V[F] is variance and T[F] is execution time. Because variance decreases linearly with sample count and running time increases linearly with sample count, their product is independent of N, providing an objective comparison metric.'
    },
    {
      type: 'paragraph',
      textKo: '마지막으로 **편향(Bias)**과 **평균 제곱 오차 (Mean Squared Error, MSE)**의 관계를 살펴보겠습니다.  \n어떤 추정량의 기댓값이 참값 $I$와 다를 때 그 차이를 편향(Bias $\\beta$)이라고 부릅니다:  \n$$\\beta[F] = E[F] - I$$  \n' +
        '실제 추정량과 참값 사이의 총체적인 평균 오차를 측정하는 가장 표준적인 척도는 **평균 제곱 오차(MSE)**이며, 수학적으로 다음과 같이 분산과 편향의 제곱의 합으로 분해됩니다:  \n$$\\text{MSE}[F] = E[(F - I)^2] = V[F] + \\beta[F]^2$$  \n' +
        '비편향 추정량($\\beta = 0$)이라면 MSE는 단순히 분산과 같아집니다. pbrt 배포판에 포함된 `imgtool` 유틸리티는 고화질 기준 이미지(Reference Image)와 렌더링된 이미지 간의 픽셀별 오차를 바로 이 MSE 공식으로 정밀하게 측정하여 알고리즘의 품질을 검증합니다.',
      textEn: 'An estimator is biased if its expected value differs from the true integral by bias beta[F] = E[F] - I. The mean squared error (MSE) combines variance and squared bias: MSE[F] = E[(F - I)^2] = V[F] + beta[F]^2. For unbiased estimators, MSE equals variance. The imgtool utility computes an image\'s MSE relative to a ground-truth reference.'
    },
    {
      type: 'paragraph',
      textKo: '이것으로 몬테카를로 적분의 기초 수학과 추정량의 원리를 모두 다졌습니다!  \n다음 2.2절에서는 노이즈를 획기적으로 줄여주는 현대 물리 기반 렌더링의 세련된 마법들—**계층화 샘플링(Stratified Sampling), 중요도 샘플링(Importance Sampling), 그리고 에릭 비치의 전설적인 다중 중요도 샘플링(MIS)**의 세계로 나아가겠습니다.',
      textEn: 'With the mathematical foundations in place, Section 2.2 explores sophisticated variance reduction techniques that dramatically reduce image noise: Stratified Sampling, Importance Sampling, and Eric Veach\'s Multiple Importance Sampling (MIS).'
    }
  ]
};
