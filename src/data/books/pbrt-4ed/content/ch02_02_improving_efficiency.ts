import { SectionContent } from '../../../../types/book';

export const CH02_02_IMPROVING_EFFICIENCY: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '2',
  chapterTitleKo: '제2장 몬테카를로 적분 (Monte Carlo Integration)',
  sectionNumber: '2.2',
  sectionTitle: 'Improving Efficiency',
  sectionTitleKo: '2.2 샘플링 효율성 향상 기법 (Improving Efficiency)',
  originalUrl: 'https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency.html',
  prevSection: {
    id: 'ch02-01',
    title: '2.1 몬테카를로 적분의 기초 원리',
  },
  nextSection: {
    id: 'ch02-03',
    title: '2.3 역변환 방법을 이용한 확률 샘플링',
  },
  summary: {
    keyTakeaways: [
      '계층화 샘플링(Stratified Sampling)은 적분 영역을 여러 구획(Strata)으로 나누고 구획마다 균등하게 표본을 뽑아, 표본이 한곳에 뭉치는 현상을 방지하고 분산을 크게 낮춥니다.',
      '중요도 샘플링(Importance Sampling)은 피적분 함수 $f(x)$의 형태와 유사한 확률 밀도 함수 $p(x)$를 설계하여 표본을 집중 배치함으로써 오차를 극적으로 줄입니다. ($p(x) \\propto f(x)$일 때 분산은 0에 도달)',
      '다중 중요도 샘플링(MIS, Multiple Importance Sampling)은 조명과 재질(BSDF)처럼 서로 상충하는 날카로운 피크를 가진 복합 적분을 균형 휴리스틱(Balance Heuristic) 가중치로 최적 융합하는 튜링상급 핵심 기법입니다.',
      '러시안 룰렛(Russian Roulette)은 빛의 기여도가 미미한 광선 경로를 확률적으로 안전하게 조기 종료시키면서도, 살아남은 광선의 가중치를 보정하여 $100\\%$ 비편향(Unbiased)을 유지하는 기법입니다.'
    ],
    prerequisites: [
      '2.1절 몬테카를로 추정량 및 분산 공식',
      '확률 밀도 함수(PDF)의 개념과 기댓값 연산'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: '2.1절에서 보았듯이 순수한 몬테카를로 적분의 오차 수렴 속도는 $O(1/\\sqrt{N})$에 불과합니다. 노이즈를 절반으로 줄이려면 무려 4배의 연산 시간과 샘플이 필요합니다. 컴퓨터의 계산 자원은 유한하므로, 단순히 무식하게 샘플 수 $N$만 무한정 늘리는 것은 좋은 공학적 해결책이 될 수 없습니다.  \n' +
        '다행히도 영리한 컴퓨터 과학자들은 샘플 수 $N$을 늘리지 않고도 **분산(Variance $V$) 자체를 극적으로 깎아내리는 분산 감소(Variance Reduction)** 기법들을 발전시켜 왔습니다. 본 절에서는 현대 렌더러의 성능을 비약적으로 끌어올린 4가지 핵심 기법을 살펴봅니다.',
      textEn: 'Because standard Monte Carlo error decreases only as O(N^{-1/2}), simply increasing the sample count N is computationally expensive. Fortunately, variance reduction techniques reduce the variance of the estimator itself, delivering dramatically cleaner images with fewer samples.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.2.1 계층화 샘플링 (Stratified Sampling)',
      titleEn: '2.2.1 Stratified Sampling'
    },
    {
      type: 'paragraph',
      textKo: '순수한 독립 무작위 샘플링(Pure Random Sampling)의 가장 큰 약점은 **"표본의 뭉침 현상(Clustering)"**입니다. 주사위를 던지다 보면 우연히 같은 숫자가 연속해서 나오듯, 무작위로 점을 찍다 보면 어떤 구역에는 점들이 다닥다닥 뭉치고 어떤 구역은 텅 비어버리는 불균형이 발생합니다.  \n' +
        '**계층화 샘플링(Stratified Sampling)**은 적분 구간 $\\Lambda$를 겹치지 않는 $n$개의 작은 하위 구획(Strata) $\\Lambda_1, \\dots, \\Lambda_n$으로 균등하게 바둑판처럼 쪼갠 뒤, **각 구획마다 정확히 $n_i$개(보통 1개)의 표본을 골고루 배치**하는 방식입니다.',
      textEn: 'A classic variance reduction technique is stratified sampling. Pure independent random sampling often suffers from sample clustering, where some areas are over-sampled and others are left empty. Stratified sampling subdivides the integration domain into n nonoverlapping strata and draws samples within each stratum.'
    },
    {
      type: 'figure',
      id: 'fig:bunny-stratified-comparison',
      number: 'Figure 2.1',
      title: 'Independent Random Sampling vs Stratified Sampling',
      titleKo: '독립 무작위 샘플링 vs 계층화 샘플링 노이즈 비교 (스탠퍼드 버니)',
      src: '/books/pbrt-4ed/images/bunny-stratified.png',
      captionKo: '동일한 샘플 수(64 spp)를 사용했을 때의 결과 비교입니다. (a) 순수 무작위 샘플링은 광선 방향이 우연히 한곳에 뭉쳐 토끼 표면에 거친 자갈 같은 점박이 노이즈가 발생하지만, (b) 계층화 샘플링은 방향 공간을 균등한 구획으로 나누어 골고루 광선을 쏘아 보냄으로써 훨씬 매끄럽고 깨끗한 그림자와 반사광을 완성합니다.',
      captionEn: 'Figure 2.1: Variance is higher and the image noisier when independent random sampling is used than when a stratified distribution of sample directions is used instead. (Bunny model courtesy of Stanford Computer Graphics Laboratory.)'
    },
    {
      type: 'paragraph',
      textKo: '1차원 구간 $[0, 1)$에서 계층화 표본을 추출하는 공식은 매우 단순합니다:  \n$$X_i = \\frac{i + \\xi_i}{n} \\quad (i = 0, 1, \\dots, n - 1)$$  \n여기서 $\\xi_i \\sim U(0, 1)$는 각 구획 안에서 무작위 오프셋을 주는 균일 난수입니다.  \n' +
        '수학적으로 증명하면, 계층화 추정량의 분산은 언제나 독립 무작위 추정량의 분산보다 작거나 같습니다:  \n$$V[F_{\\text{stratified}}] \\le V[F_{\\text{independent}}]$$  \n계층화 샘플링은 함수가 전체적으로 완만하게 변하는 저주파수 변동(Low-frequency variation)에 의한 오차를 완벽히 제거해 줍니다.',
      textEn: 'In 1D, drawing a stratified sample is as simple as X_i = (i + xi_i) / n, where xi_i is a uniform random offset in [0, 1). Mathematically, the variance of the stratified estimator is strictly less than or equal to that of independent sampling, eliminating variance caused by low-frequency variation across strata.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 알고리즘 콕콕',
      title: '비둘기집 원리와 샘플 뭉침 방지 (Clustering Prevention)',
      summary: '왜 계층화 샘플링은 공짜 점심처럼 분산을 깎아줄까?',
      points: [
        {
          title: '균일성의 보장 (Space-Filling Property)',
          content: '모든 구획에 최소 1개의 샘플이 강제로 들어가므로, 적분 영역의 그 어떤 부분도 소외되지 않고 균일하게 정보가 수집됩니다.'
        },
        {
          title: '고차원에서의 한계 (차원의 저주 재등장)',
          content: '계층화는 2D 화면 픽셀(16개 타일 = $4 \\times 4$)에서는 마법처럼 작동하지만, 6차원 적분에서 차원당 고작 2개씩만 구획을 나눠도 $2^6 = 64$개의 샘플이 필요하고, 차원당 4개면 $4^6 = 4,096$개가 필요합니다. 따라서 고차원 렌더링에서는 8장에서 배울 **준난수(Quasi-Monte Carlo / 저불일치 수열)** 기법으로 진화하게 됩니다.'
        }
      ],
      tags: ['계층화 샘플링', 'Stratified', '분산 감소', '샘플 분배']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.2.2 중요도 샘플링 (Importance Sampling)',
      titleEn: '2.2.2 Importance Sampling'
    },
    {
      type: 'paragraph',
      textKo: '몬테카를로 추정량의 공식 $F_N = \\frac{1}{N} \\sum \\frac{f(X_i)}{p(X_i)}$을 다시 한번 유심히 살펴봅시다.  \n' +
        '만약 우리가 표본을 추출하는 확률 밀도 함수 $p(x)$를 피적분 함수 $f(x)$의 모양과 완벽하게 똑같아지도록(비례하도록) 설계할 수 있다면 어떻게 될까요?  \n$$p(x) = c \\cdot f(x) \\quad \\left( \\text{단, } c = \\frac{1}{\\int f(x) dx} \\right)$$  \n' +
        '이 이상적인 $p(x)$를 추정량 공식에 대입하면:  \n$$\\frac{f(X_i)}{p(X_i)} = \\frac{f(X_i)}{c \\cdot f(X_i)} = \\frac{1}{c} = \\int f(x) dx$$  \n' +
        '모든 표본의 평가값이 항상 똑같은 상수($1/c$)가 되어버립니다! 따라서 **추정량의 분산은 마법처럼 정확히 0**이 됩니다! 즉, 단 1개의 샘플만 뽑아도 완벽한 참값을 맞추게 됩니다.',
      textEn: 'Importance sampling exploits the property that if the PDF p(x) is exactly proportional to f(x), then f(X_i)/p(X_i) is constant, and the variance of the estimator drops to zero! While finding the exact normalization constant c = 1 / integral f(x) dx is impossible (since that is the integral we want to compute), choosing a PDF that is approximately proportional to f(x) drastically reduces variance.'
    },
    {
      type: 'figure',
      id: 'fig:importance-sampling-gaussian',
      number: 'Figure 2.2',
      title: 'Importance Sampling a Gaussian Function',
      titleKo: '가우시안 함수에 대한 단계별 중요도 샘플링과 PDF 근사',
      src: '/books/pbrt-4ed/images/piecewise-gaussian-pdf.svg',
      captionKo: '가우시안(정규분포) 종 모양 함수를 적분할 때, 균일 샘플링을 쓰면 값이 거의 0인 양쪽 꼬리 부분에서 수많은 계산 낭비가 일어납니다. 대신 함수의 중심 봉우리와 유사한 계단식(Piecewise-constant) PDF를 만들어 샘플을 봉우리 중심에 집중시키면, 동일한 샘플 수 대비 분산이 1/10 이하로 급감합니다.',
      captionEn: 'Figure 2.2: (a) A narrow Gaussian function that is close to zero over most of the domain. (b) A piecewise-constant step PDF that approximates the Gaussian shape. (c) Sampling from this PDF concentrates samples where the function value is large, dramatically reducing variance.'
    },
    {
      type: 'paragraph',
      textKo: '**중요도 샘플링의 주의점**:  \n' +
        '중요도 샘플링은 양날의 검입니다. 만약 잘못된 PDF를 선택하여, **함수 값 $f(x)$는 매우 큰데 $p(x)$가 0에 가까운 영역**이 존재한다면, 분모가 극도로 작아져 $f(x)/p(x)$ 값이 수천~수만으로 폭증하게 됩니다. 이것이 렌더링 화면에 뜬금없이 번쩍이는 하얀 점, 즉 **파이어플라이(Fireflies)** 현상의 수학적 원인입니다. 따라서 $p(x)$는 항상 $f(x)$가 큰 곳을 절대 놓치지 않도록 너그럽고 안전하게 설계해야 합니다.',
      textEn: 'Caution with importance sampling: if a poorly chosen PDF is near zero where f(x) is large, the ratio f(x)/p(x) explodes, causing massive variance spikes. In rendering, this manifests as bright speckles known as "fireflies". The PDF must adequately cover all regions where the integrand is significant.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.2.3 다중 중요도 샘플링 (Multiple Importance Sampling, MIS)',
      titleEn: '2.2.3 Multiple Importance Sampling'
    },
    {
      type: 'paragraph',
      textKo: '실제 렌더링에서는 적분해야 할 식이 단일 함수가 아니라 **두 개 이상의 함수가 곱해진 형태**인 경우가 대부분입니다:  \n$$I = \\int f_a(x) f_b(x) dx$$  \n가장 대표적인 예가 **[조명의 빛 방출 $L_i$] $\\times$ [표면의 반사율 BSDF $f_r$]**의 곱입니다.  \n' +
        '문제는 조명도 매우 작고 날카롭고(예: 조그만 할로겐 전구), 표면도 매끄러운 거울이나 금속처럼 반사율이 특정 방향으로만 날카롭게 솟아 있을 때 발생합니다.  \n' +
        '- 조명에 맞춰 샘플링($p_a$)하면 거울 반사각을 놓쳐 노이즈 폭발!  \n' +
        '- 거울 반사각에 맞춰 샘플링($p_b$)하면 작은 전구를 맞추지 못해 노이즈 폭발!  \n' +
        '어느 한쪽 분포만 따라가서는 절대로 깨끗한 이미지를 얻을 수 없습니다.',
      textEn: 'In rendering, integrands are frequently the product of multiple functions: integral f_a(x) f_b(x) dx, most commonly [incident light L_i] * [surface BSDF f_r]. When both a light source (e.g., small intense lamp) and a surface BSDF (e.g., glossy metal) have sharp directional peaks, neither sampling the light alone nor the BSDF alone succeeds.'
    },
    {
      type: 'paragraph',
      textKo: '1995년 스탠퍼드 대학교의 **에릭 비치(Eric Veach)**는 이 난제를 영구적으로 해결하는 역사적 논문을 발표했습니다. 바로 **다중 중요도 샘플링(MIS, Multiple Importance Sampling)**입니다.  \n' +
        '서로 다른 $n$개의 샘플링 전략 $p_1, \\dots, p_n$에서 각각 $n_i$개의 표본 $X_{i, j}$를 뽑은 뒤, 특별히 고안된 **가중치 함수 $w_i(x)$**를 곱해 가중합을 계산합니다:  \n$$F = \\sum_{i=1}^n \\frac{1}{n_i} \\sum_{j=1}^{n_i} w_i(X_{i, j}) \\frac{f(X_{i, j})}{p_i(X_{i, j})}$$  \n' +
        '추정량이 비편향이 되기 위한 유일한 조건은 $f(x) \\ne 0$인 곳에서 가중치들의 합이 $1$이어야 한다는 것뿐입니다:  \n$$\\sum_{i=1}^n w_i(x) = 1$$',
      textEn: 'Eric Veach introduced Multiple Importance Sampling (MIS) in 1995. Samples are drawn from n different sampling distributions p_i, combined using weighting functions w_i(x) such that sum w_i(x) = 1 wherever f(x) != 0, ensuring unbiasedness while combining the strengths of all sampling strategies.'
    },
    {
      type: 'paragraph',
      textKo: '에릭 비치는 수학적으로 최적에 가까운 두 가지 가중치 휴리스틱을 증명했습니다:  \n\n' +
        '1. **균형 휴리스틱 (Balance Heuristic)**:  \n' +
        '$$w_i(x) = \\frac{n_i p_i(x)}{\\sum_j n_j p_j(x)}$$  \n' +
        '각 샘플 전략의 확률 비율 그대로 가중치를 매기는 방식입니다. 수학적으로 어떤 가중치 함수보다도 분산 증가율이 작다는 것이 엄밀히 증명되어 있습니다.  \n\n' +
        '2. **거듭제곱 휴리스틱 (Power Heuristic)**:  \n' +
        '$$w_i(x) = \\frac{(n_i p_i(x))^\\beta}{\\sum_j (n_j p_j(x))^\\beta} \\quad (\\text{보통 } \\beta = 2)$$  \n' +
        '확률 밀도에 제곱($\\beta = 2$)을 취하여, 상대적으로 확률이 낮은 열세인 샘플 전략의 기여도를 더욱 과감하게 0으로 눌러버림으로써 분산을 더욱 드라마틱하게 낮춥니다.',
      textEn: 'Veach derived the provably near-optimal Balance Heuristic: w_i(x) = n_i p_i(x) / sum n_j p_j(x). He also introduced the Power Heuristic with exponent beta (typically beta = 2): w_i(x) = (n_i p_i(x))^beta / sum (n_j p_j(x))^beta, which sharpens weights and further reduces variance in practice.'
    },
    {
      type: 'code',
      chunkName: '<<Multiple Importance Sampling Functions>>=',
      language: 'cpp',
      code: `// 균형 휴리스틱 (Balance Heuristic): 2개 분포 결합
inline Float BalanceHeuristic(int nf, Float fPdf, int ng, Float gPdf) {
    return (nf * fPdf) / (nf * fPdf + ng * gPdf);
}

// 거듭제곱 휴리스틱 (Power Heuristic, beta = 2): 실무 표준
inline Float PowerHeuristic(int nf, Float fPdf, int ng, Float gPdf) {
    Float f = nf * fPdf, g = ng * gPdf;
    return (f * f) / (f * f + g * g);
}`,
      explanationKo: 'pbrt에서 1초에 수천만 번 실행되는 가장 유명한 유틸리티 함수입니다. 빛 샘플링 PDF와 BSDF 샘플링 PDF를 넘겨주면, 제곱 비를 계산하여 두 전략의 장점만을 취합하는 최적의 가중치를 단 3줄로 반환합니다.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.2.4 러시안 룰렛 (Russian Roulette)',
      titleEn: '2.2.4 Russian Roulette'
    },
    {
      type: 'paragraph',
      textKo: '광선 추적 시뮬레이션에서 광선은 물체 표면을 맞고 튕겨 나가기를 반복합니다. 만약 광선이 10번, 20번 튕겨 어두운 구석으로 들어갔다면, 그 광선이 최종 이미지에 기여할 빛의 양은 거의 $0$에 수렴합니다.  \n' +
        '그렇다고 해서 특정 깊이(예: 5번)에서 광선을 일괄적으로 강제 종료해 버리면, 실내 조명이나 유리구슬 내부의 빛이 사라져 화면이 어두워지는 **편향(Bias)**이 생깁니다.  \n' +
        '**러시안 룰렛(Russian Roulette)**은 계산 효율을 극대화하면서도 **수학적 비편향성(Unbiasedness)을 100% 지켜내는 놀라운 확률 기법**입니다.',
      textEn: 'In recursive path tracing, rays bounce repeatedly through the scene. Rays that have bounced many times often carry negligible radiance. Simply truncating them at a fixed depth introduces dark systematic bias. Russian roulette provides a mechanism to terminate rays probabilistically with zero bias.'
    },
    {
      type: 'paragraph',
      textKo: '러시안 룰렛의 규칙은 다음과 같습니다:  \n' +
        '1. 임의의 종료 확률 $q \\in (0, 1)$를 정합니다. (계속 진행할 확률은 $1 - q$)  \n' +
        '2. 주사위를 굴려 확률 $q$로 광선을 즉시 중단하고 **0을 반환**합니다.  \n' +
        '3. 운 좋게 살아남은 확률 $(1 - q)$의 광선은 계속 전진시키되, 그 광선이 가져온 빛의 값에 **보정 가중치 $\\frac{1}{1 - q}$를 곱해 증폭**시킵니다!  \n\n' +
        '이 새로운 추정량의 기댓값을 계산해 보면:  \n$$E[F_{\\text{rr}}] = (1 - q) \\cdot \\left( \\frac{F}{1 - q} \\right) + q \\cdot 0 = F$$  \n' +
        '확률 $(1 - q)$와 분모의 $(1 - q)$가 완벽하게 약분되어, **원래 적분값 $F$가 손실 없이 100% 온전히 보존**됩니다! 죽을 확률만큼 살아남은 자에게 보상을 몰아줌으로써 전체 평균을 일정하게 유지하는 것입니다.',
      textEn: 'With termination probability q, Russian roulette terminates evaluation and returns 0. With probability (1 - q), evaluation continues, but the result is scaled by 1 / (1 - q). The expected value is E[F_rr] = (1 - q) * (F / (1 - q)) + q * 0 = F. The factor (1 - q) cancels exactly, preserving the true expected value without any bias.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 게임이론/최적화 콕콕',
      title: '러시안 룰렛이 전체 시스템의 효율성을 폭발시키는 원리',
      summary: '개별 광선의 분산은 약간 늘어나지만, 연산 시간을 대폭 아껴 해머슬리 효율을 극대화',
      points: [
        {
          title: '어두운 광선은 과감하게 죽인다',
          content: '표면 반사율(알베도)이 $0.1$처럼 어두운 물체에 부딪힌 광선은 살아남아 봤자 기여도가 미미합니다. 계속 진행할 확률 $(1 - q)$를 물체의 반사율에 비례하게 설정하면, 영양가 없는 광선들을 컴퓨터가 알아서 싹 정리합니다.'
        },
        {
          title: '시간당 분산 감소의 법칙 (Efficiency Metric)',
          content: '러시안 룰렛 자체는 분산($V$)을 약간 증가시킵니다. 그러나 불필요한 광선 계산을 건너뜀으로써 실행 시간($T$)을 5배, 10배나 단축시킵니다! 따라서 2.1절에서 배웠던 효율성 공식 $\\epsilon = 1 / (V \\cdot T)$에 의해, 남는 CPU 시간 동안 다른 픽셀 샘플을 훨씬 많이 계산할 수 있어 최종 이미지 품질이 대폭 향상됩니다.'
        }
      ],
      tags: ['러시안 룰렛', '비편향 조기 종료', '효율성 최적화', '광선 추적 기법']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2.2.5 스플리팅 (Splitting: 표본 분기)',
      titleEn: '2.2.5 Splitting'
    },
    {
      type: 'paragraph',
      textKo: '러시안 룰렛이 불필요한 광선을 쳐내는 기법이라면, **스플리팅(Splitting)**은 반대로 분산이 너무 커서 노이즈가 심할 것으로 예상되는 중요한 지점에서 **광선을 여러 가닥으로 쪼개어(Branching) 샘플링하는 기법**입니다.  \n' +
        '예를 들어 픽셀 하나를 평가할 때, 카메라 광선은 1개만 쏘더라도 표면에 부딪힌 지점에서 여러 조명들을 향해 그림자 광선(Shadow Ray)을 4개, 8개씩 분기시켜 쏘아 보내면, 비싼 카메라 광선 생성 비용을 재활용하면서도 조명 그림자 노이즈를 매우 효율적으로 잠재울 수 있습니다.',
      textEn: 'While Russian roulette reduces the number of samples, splitting increases sample count in high-variance dimensions of multidimensional integrals. For instance, a single camera ray may branch into multiple shadow rays at a surface intersection, efficiently amortizing camera ray traversal costs over multiple light evaluations.'
    },
    {
      type: 'paragraph',
      textKo: '이제 우리는 계층화, 중요도 샘플링, MIS, 러시안 룰렛, 스플리팅이라는 물리 기반 렌더링의 5대 무기를 완벽하게 손에 넣었습니다!  \n' +
        '하지만 한 가지 근본적인 의문이 남습니다: **"우리가 원하는 임의의 확률 밀도 함수 $p(x)$가 주어졌을 때, 컴퓨터는 어떻게 그 분포를 따르는 난수를 실제로 만들어낼 수 있을까?"**  \n' +
        '이어지는 2.3절에서는 컴퓨터 난수 생성의 마법인 **역변환 샘플링 방법(Sampling Using the Inversion Method)**을 배우겠습니다.',
      textEn: 'Having mastered variance reduction techniques, Section 2.3 addresses the practical challenge: given a target PDF p(x), how can a computer algorithm generate random samples that strictly follow that distribution? This is solved by the Inversion Method.'
    }
  ]
};
