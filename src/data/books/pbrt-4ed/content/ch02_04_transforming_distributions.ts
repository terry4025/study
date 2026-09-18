import { SectionContent } from '../../../../types/book';

export const CH02_04_TRANSFORMING_DISTRIBUTIONS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '2',
  chapterTitleKo: '제2장 몬테카를로 적분 (Monte Carlo Integration)',
  sectionNumber: '2.4',
  sectionTitle: 'Transforming between Distributions',
  sectionTitleKo: '2.4 다차원 확률 분포 간 변환 (Transforming Distributions)',
  originalUrl: 'https://pbr-book.org/4ed/Monte_Carlo_Integration/Transforming_between_Distributions.html',
  prevSection: {
    id: 'ch02-03',
    title: '2.3 역변환 방법을 이용한 확률 샘플링',
  },
  nextSection: {
    id: 'ch03-01',
    title: '3.1 3차원 좌표계의 원리',
  },
  summary: {
    keyTakeaways: [
      '확률 변수를 어떤 함수로 변환($Y = f(X)$)할 때, 변환된 공간의 확률 밀도 $p_y(y)$는 도함수의 역수 절대값 $|dx/dy|$에 비례하여 압축되거나 팽창합니다.',
      '다차원 공간 변환에서는 야코비안 행렬식(Jacobian Determinant $|J_T|$)이 공간의 국소적 면적/부피 왜곡 비율을 계산해 줍니다: $p_y(y) = p_x(x) / |J_T(x)|$.',
      '극좌표계($(r, \\theta) \\to (x, y)$)의 야코비안은 $r$이므로, 원판(Disk) 위에서 균일한 점을 얻으려면 반지름 $r$에 비례하게 샘플링해야 중심부에 점이 뭉치지 않습니다.',
      '서로 종속된 다차원 결합 확률 분포 $p(x, y)$는 주변 확률 밀도 $p(y) = \\int p(x, y) dx$를 먼저 1차원 샘플링한 뒤, 조건부 확률 밀도 $p(x \\mid y)$를 순차 샘플링하는 분할 정복(Marginal-Conditional Decomposition)으로 완벽히 해결합니다.'
    ],
    prerequisites: [
      '다변수 미적분학의 편미분(Partial Derivative)과 행렬식(Determinant)',
      '2.3절 역변환 방법 및 조건부 확률의 기본 정의'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: '2.3절에서 우리는 균일 난수 $\\xi \\sim U(0, 1)$를 누적분포함수의 역함수 $P^{-1}$에 통과시켜 원하는 1차원 확률 분포를 얻는 역변환 방법을 배웠습니다.  \n' +
        '이제 한 걸음 더 나아가, **이미 특정 확률 분포 $p_x(x)$를 따르고 있는 확률 변수 $X$를 임의의 다차원 변환 함수 $Y = T(X)$에 통과시켰을 때, 변환된 변수 $Y$의 확률 밀도 함수 $p_y(y)$가 어떻게 변하는지** 그 일반적인 수학적 법칙을 규명해 보겠습니다.',
      textEn: 'In describing the inversion method, we generated samples according to a target distribution by transforming uniform random variables. Now we consider the general problem: given a random variable X with PDF p_x(x), what is the resulting PDF p_y(y) when X is transformed by an arbitrary function Y = T(X)?'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1차원 확률 변수의 변환 공식 (1D Transformation)',
      titleEn: '1D Transformation of Random Variables'
    },
    {
      type: 'paragraph',
      textKo: '단조 증가하는 1차원 함수 $y = f(x)$를 생각해 봅시다. $Y$의 누적 분포 함수 $P_y(y)$는 다음과 같이 전개됩니다:  \n$$P_y(y) = \\Pr\\{Y \\le y\\} = \\Pr\\{f(X) \\le y\\} = \\Pr\\{X \\le f^{-1}(y)\\} = P_x(f^{-1}(y))$$  \n' +
        '이 식의 양변을 $y$에 대해 미분하면, 연쇄 법칙(Chain Rule)에 의해 변환된 확률 밀도 함수 $p_y(y)$를 얻을 수 있습니다:  \n$$p_y(y) = \\frac{d P_y(y)}{dy} = \\frac{d P_x(f^{-1}(y))}{dy} = \\left( \\frac{df}{dx} \\right)^{-1} p_x(x) = \\left| \\frac{dx}{dy} \\right| p_x(f^{-1}(y))$$  \n' +
        '이 공식의 물리적 직관은 명쾌합니다: **함수의 기울기 $df/dx$가 가파를수록 공간이 넓게 팽창하므로 확률 밀도는 그에 반비례하여 옅어지고, 기울기가 완만할수록 표본들이 좁은 공간에 빽빽하게 모여 확률 밀도가 짙어진다**는 것입니다.',
      textEn: 'For a monotonically increasing function y = f(x), P_y(y) = Pr{Y <= y} = Pr{X <= f^{-1}(y)} = P_x(f^{-1}(y)). Differentiating with respect to y yields p_y(y) = |df/dx|^{-1} p_x(x) = |dx/dy| p_x(f^{-1}(y)). Intuitively, where the transformation stretches space, probability density dilutes, and where it compresses space, density concentrates.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.4.1 다차원 공간 변환과 야코비안 행렬식 (Transformation in Multiple Dimensions)',
      titleEn: '2.4.1 Transformation in Multiple Dimensions'
    },
    {
      type: 'paragraph',
      textKo: '이 원리를 2차원 평면이나 3차원 입체 공간 같은 $d$차원 공간 변환 $Y = T(X)$로 확장하면, 단순한 도함수 대신 다변수 함수의 모든 편도함수들을 격자 행렬로 모아놓은 **야코비안 행렬(Jacobian Matrix $J_T$)의 행렬식(Determinant)**이 등장합니다:  \n$$p_y(y) = \\frac{p_x(x)}{|J_T(x)|}$$  \n' +
        '여기서 야코비안 행렬 $J_T$는 변환 함수 $T$의 성분별 편미분으로 구성됩니다:  \n$$J_T = \\begin{pmatrix} \\frac{\\partial T_1}{\\partial x_1} & \\cdots & \\frac{\\partial T_1}{\\partial x_d} \\\\ \\vdots & \\ddots & \\vdots \\\\ \\frac{\\partial T_d}{\\partial x_1} & \\cdots & \\frac{\\partial T_d}{\\partial x_d} \\end{pmatrix}$$  \n' +
        '야코비안의 행렬식 $|J_T|$의 기하학적 의미는 **"변환 전의 아주 미세한 미소 면적 $dx_1 \\dots dx_d$가 변환 후의 공간에서 몇 배의 면적(부피)으로 늘어나는가?"를 나타내는 국소 면적 팽창 계수**입니다.',
      textEn: 'In d dimensions, the density transformation generalizes using the Jacobian matrix J_T: p_y(y) = p_x(x) / |J_T(x)|, where |J_T| is the absolute value of the determinant of J_T. Geometrically, |J_T| represents the local volume expansion factor of the transformation.'
    },
    {
      type: 'subheading',
      level: 4,
      titleKo: '실전 예제: 2차원 극좌표계 변환 (Polar Coordinates)',
      titleEn: 'Polar Coordinates Example'
    },
    {
      type: 'paragraph',
      textKo: '반지름 $r$과 회전각 $\\theta$로 표현되는 2차원 극좌표 $(r, \\theta)$를 직교 데카르트 좌표 $(x, y)$로 바꾸는 변환식을 봅시다:  \n$$x = r \\cos \\theta, \\quad y = r \\sin \\theta$$  \n' +
        '이 변환의 야코비안 행렬은 다음과 같습니다:  \n$$J_T = \\begin{pmatrix} \\frac{\\partial x}{\\partial r} & \\frac{\\partial x}{\\partial \\theta} \\\\ \\frac{\\partial y}{\\partial r} & \\frac{\\partial y}{\\partial \\theta} \\end{pmatrix} = \\begin{pmatrix} \\cos \\theta & -r \\sin \\theta \\\\ \\sin \\theta & r \\cos \\theta \\end{pmatrix}$$  \n' +
        '행렬식을 계산해 보면:  \n$$|J_T| = r \\cos^2 \\theta - (-r \\sin^2 \\theta) = r(\\cos^2 \\theta + \\sin^2 \\theta) = r$$  \n' +
        '따라서 두 좌표계 간의 확률 밀도 관계는 다음과 같습니다:  \n$$p(x, y) = \\frac{p(r, \\theta)}{r} \\iff p(r, \\theta) = r \\cdot p(x, y)$$  \n' +
        '이 공식은 그래픽스에서 엄청나게 중요합니다! 원판(Disk) 위에 균일하게 점을 흩뿌리고 싶다면($p(x, y) = \\text{const}$), 반지름 $r$을 균일하게 뽑으면 절대 안 되고, **반지름에 정비례하도록 $p(r) \\propto r$로 뽑아야 중심부에 점이 몰리지 않고 고르게 퍼진다**는 사실을 수학적으로 완벽히 설명해 줍니다.',
      textEn: 'For the 2D polar transformation x = r cos theta, y = r sin theta, the Jacobian determinant is |J_T| = r. Thus p(x, y) = p(r, theta) / r, or p(r, theta) = r * p(x, y). This rigorously proves why uniform disk sampling requires a radial density proportional to r, preventing artificial clustering near the origin.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 미적분/기하 콕콕',
      title: '야코비안(Jacobian) 행렬식이 면적 왜곡을 바로잡는 원리',
      summary: '도화지를 잡아 늘렸을 때 물감의 농도(확률 밀도)가 옅어지는 현상의 수학적 모델링',
      points: [
        {
          title: '적분 변수 변환(Change of Variables)의 핵심',
          content: '고등학교 때 배운 치환적분 $\\int f(g(x)) g\'(x) dx$에서 $g\'(x)$ 역할을 다차원으로 확대한 것이 바로 야코비안 행렬식 $|J_T|$입니다.'
        },
        {
          title: '3차원 구면 좌표계(Spherical Coordinates)의 야코비안',
          content: '방향 벡터 $(x, y, z)$를 고도각 $\\theta$와 방위각 $\\phi$로 변환할 때의 야코비안은 $|J_T| = r^2 \\sin \\theta$ 입니다. 따라서 천구(Sky)나 구면에서 균일하게 광선을 쏘려면 항상 $\\sin \\theta$ 가중치를 곱해 적도 부근을 더 넓게 표본 추출해야 합니다.'
        }
      ],
      tags: ['야코비안', 'Jacobian', '좌표 변환', '극좌표', '구면 기하']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.4.2 다차원 결합 확률 분포의 분할 정복 샘플링 (Multidimensional Transformations)',
      titleEn: '2.4.2 Sampling with Multidimensional Transformations'
    },
    {
      type: 'paragraph',
      textKo: '이제 2차원 평면 위에서 서로 얽혀 있는(독립이 아닌) 임의의 결합 확률 분포 $p(x, y)$에서 표본 쌍 $(X, Y)$를 뽑아내는 일반 알고리즘을 구축해 봅시다.  \n' +
        '핵심 전략은 확률론의 **주변 확률(Marginal Distribution)**과 **조건부 확률(Conditional Distribution)**을 이용한 아름다운 **분할 정복(Divide and Conquer)**입니다:  \n\n' +
        '1. **주변 확률 밀도(Marginal PDF $p(y)$) 계산**: $x$에 대해 적분을 수행하여 $x$ 성분을 지워버리고(적분 소거), $y$ 혼자만의 평균 확률 밀도를 구합니다:  \n$$p(y) = \\int p(x, y) dx$$  \n' +
        '2. **1단계 $Y$ 샘플링**: $p(y)$는 완벽한 1차원 함수이므로, 2.3절의 1차원 역변환 방법(`SampleLinear` 등)을 이용해 첫 번째 난수 $u_1$으로 $Y$를 먼저 뽑아냅니다!  \n' +
        '3. **조건부 확률 밀도(Conditional PDF $p(x \\mid y)$) 계산**: 방금 확정된 $Y$ 값을 조건으로 걸어 $x$만의 1차원 확률 밀도를 구합니다:  \n$$p(x \\mid y) = \\frac{p(x, y)}{p(y)}$$  \n' +
        '4. **2단계 $X$ 샘플링**: 두 번째 난수 $u_0$를 사용하여 조건부 분포 $p(x \\mid Y)$에서 1차원 역변환으로 최종 $X$를 뽑아냅니다!',
      textEn: 'To sample from an arbitrary 2D joint density p(x, y) where x and y are dependent, we use marginal-conditional decomposition. 1. Compute marginal density p(y) = integral p(x, y) dx. 2. Draw sample Y ~ p(y) using 1D inversion. 3. Form conditional density p(x | y) = p(x, y) / p(y). 4. Draw sample X ~ p(x | Y) conditioned on the sampled Y using a second 1D inversion.'
    },
    {
      type: 'subheading',
      level: 4,
      titleKo: '실전 2D 예제: 쌍선형 함수 샘플링 (Bilinear Function)',
      titleEn: 'Sampling the Bilinear Function'
    },
    {
      type: 'paragraph',
      textKo: '단위 정사각형 $[0, 1]^2$의 네 모서리 값 $w_0, w_1, w_2, w_3$ 사이를 선형 보간하는 쌍선형(Bilinear) 함수를 이 2단계 기법으로 샘플링해 보겠습니다:  \n$$f(x, y) = (1 - x)(1 - y)w_0 + x(1 - y)w_1 + (1 - x)y w_2 + xy w_3$$  \n' +
        '1. $x$에 대해 먼저 적분하여 주변 분포 $p(y)$를 구하면, $y$에 대한 단순 선형 함수가 됩니다:  \n$$p(y) \\propto (1 - y)(w_0 + w_1) + y(w_2 + w_3)$$  \n따라서 `SampleLinear()`를 호출하여 $y$를 먼저 깔끔하게 뽑아냅니다!  \n' +
        '2. 그 다음, 확정된 $y$를 대입한 조건부 분포 $p(x \\mid y)$ 역시 $x$에 대한 1차원 선형 함수가 되므로, 다시 한번 `SampleLinear()`를 호출하여 $x$를 뽑아냅니다!',
      textEn: 'Consider sampling the bilinear function interpolating four corner weights w_i on [0, 1]^2. Integrating out x yields a marginal density p(y) that is linear in y, sampled using SampleLinear(). The conditional density p(x | y) is then also a 1D linear function in x, which is subsequently sampled using SampleLinear().'
    },
    {
      type: 'code',
      chunkName: '<<Bilinear Sampling Functions>>=',
      language: 'cpp',
      code: `// 2D 쌍선형 보간 함수로부터 표본 (x, y)를 순차적으로 추출하는 함수
Point2f SampleBilinear(Point2f u, pstd::span<const Float> w) {
    Point2f p;
    // 1단계: 주변 확률 분포 p(y)를 이용해 y를 먼저 1차원 선형 샘플링
    p.y = SampleLinear(u[1], w[0] + w[1], w[2] + w[3]);

    // 2단계: 결정된 y 값을 바탕으로 조건부 분포 p(x|y)에서 x를 선형 샘플링
    p.x = SampleLinear(u[0], Lerp(p.y, w[0], w[2]), Lerp(p.y, w[1], w[3]));

    return p;
}

// 추출된 점 p = (x, y)를 원래의 난수 u = (u0, u1)로 되돌리는 역함수
Point2f InvertBilinearSample(Point2f p, pstd::span<const Float> w) {
    return {
        InvertLinearSample(p.x, Lerp(p.y, w[0], w[2]), Lerp(p.y, w[1], w[3])),
        InvertLinearSample(p.y, w[0] + w[1], w[2] + w[3])
    };
}`,
      explanationKo: '놀랍도록 우아한 코드입니다! 복잡해 보이는 2D 곡면 확률 분포가, 단 두 줄의 1차원 선형 샘플러(SampleLinear)의 순차적 조합만으로 오차 없이 정확하게 샘플링됩니다.'
    },
    {
      type: 'paragraph',
      textKo: '축하합니다! 이것으로 **제2장 몬테카를로 적분(Monte Carlo Integration)**의 모든 수학적 이론과 알고리즘(기초 확률론, 분산 감소, 다중 중요도 샘플링, 역변환 기법, 다차원 야코비안 변환)을 완벽하게 마스터했습니다!  \n\n' +
        '이제 우리는 어떤 난해한 빛의 물리 방정식이 닥쳐와도 두려움 없이 컴퓨터로 시뮬레이션할 수 있는 막강한 수학적 무기를 갖추었습니다.  \n' +
        '이어지는 **제3장 기하학과 3차원 변환(Geometry and Transformations)**에서는, 3차원 가상 세계를 컴퓨터 메모리 속에 정밀하게 세우는 점(Point), 벡터(Vector), 법선(Normal), 광선(Ray), 바운딩 박스(Bounding Box), 4x4 변환 행렬의 세계로 당당하게 진입하겠습니다.',
      textEn: 'Congratulations! This concludes Chapter 2: Monte Carlo Integration. We have mastered probability theory, variance reduction, Multiple Importance Sampling, the inversion method, and multidimensional Jacobian transformations. In Chapter 3: Geometry and Transformations, we build the mathematical foundations of 3D space: points, vectors, normals, rays, bounding boxes, and 4x4 transformation matrices.'
    }
  ]
};
