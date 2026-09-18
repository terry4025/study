import { SectionContent } from '../../../../types/book';

export const CH08_06_HALTON_SAMPLER: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '8',
  chapterTitleKo: '제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)',
  sectionNumber: '8.6',
  sectionTitle: 'Halton Sampler',
  sectionTitleKo: '8.6 Halton 저불일치 샘플러 (Halton Sampler)',
  originalUrl: 'https://pbr-book.org/4ed/Sampling_and_Reconstruction/Halton_Sampler.html',
  prevSection: {
    id: 'ch08-05',
    title: '8.5 계층화 샘플러',
  },
  nextSection: {
    id: 'ch08-07',
    title: '8.7 Sobol 저불일치 샘플러 (Sobol’ Samplers)',
  },
  summary: {
    keyTakeaways: [
      'Halton 수열은 준몬테카를로(QMC) 렌더링에서 가장 대표적인 저불일치 수열(Low-Discrepancy Sequence)로, 반전 라디칼 함수(Van der Corput Radical Inverse)를 기반으로 작동합니다.',
      '기저 반전 함수 $\\Phi_b(n)$은 정수 $n$을 $b$진법으로 표현한 뒤, 소수점을 기준으로 자릿수를 거울처럼 뒤집어(Mirror) 항상 기존 점들 사이의 가장 거대한 빈 공간(Maximum Void)의 정중앙에 새 점을 배치합니다.',
      '다차원 할튼 수열은 서로소인 소수(Coprime Primes: 2, 3, 5, 7, 11...)를 각 차원의 기저로 사용하여 무한 차원의 저불일치 점들을 생성합니다.',
      '고차원 상관관계 결함(Correlation Artifacts): 기저 소수가 커지면 점들이 사선으로 줄지어 나타나는 결함이 생기며, pbrt는 자릿수 순열을 섞어주는 스크램블링(Scrambling)으로 이를 완벽하게 해결합니다.'
    ],
    prerequisites: [
      '8장 8.2 별-불일치도(Star Discrepancy)와 QMC 이론',
      '정수론: $b$진법 자릿수 전개 및 서로소(Coprime) 소수 기저'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.6.1 반전 라디칼 함수 (Van der Corput Radical Inverse)',
      titleEn: '8.6.1 The Van der Corput Radical Inverse'
    },
    {
      type: 'paragraph',
      textKo: '1935년 네덜란드의 수학자 요하네스 반 데르 코르푸트(Johannes van der Corput)는 1차원 공간을 가장 완벽하게 균등하게 채우는 기적의 수열을 고안했습니다. 그 핵심 원리는 매우 단순하면서도 경이롭습니다: **"정수의 자릿수를 거울에 비추듯 거꾸로 뒤집는 것"**입니다.',
      textEn: 'In 1935, Johannes van der Corput constructed a low-discrepancy sequence in [0, 1) by inverting the base-b digit representation of integers around the decimal point.'
    },
    {
      type: 'paragraph',
      textKo: '임의의 양의 정수 $n$을 기저 $b$ 진법으로 표기하면 다음과 같이 전개할 수 있습니다:',
      textEn: 'Any integer n can be expressed in base b as a polynomial in powers of b:'
    },
    {
      type: 'equation',
      tex: 'n = \\sum_{i=0}^{M} a_i b^i = a_M b^M + \\dots + a_1 b + a_0 \\quad (0 \\le a_i < b)',
      explanationKo: '정수의 b진법 표현: $a_i$는 $b$진법에서의 각 자릿수 계수입니다.'
    },
    {
      type: 'paragraph',
      textKo: '이 정수의 자릿수 $a_i$들을 소수점 아래로 그대로 반전(Radical Inverse)시켜 $[0, 1)$ 범위의 실수 $\\Phi_b(n)$을 만듭니다:',
      textEn: 'The radical inverse function Phi_b(n) reflects these digits across the radix point into [0, 1):'
    },
    {
      type: 'equation',
      tex: '\\Phi_b(n) = \\sum_{i=0}^{M} a_i b^{-(i+1)} = 0.a_0 a_1 a_2 \\dots a_M \\; (\\text{base } b)',
      explanationKo: '반전 라디칼 함수 공식: 1의 자리 숫자 $a_0$가 $b^{-1}$의 자리로 가고, $b$의 자리 숫자 $a_1$이 $b^{-2}$의 자리로 이동합니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-27',
      number: 'Figure 8.27',
      title: 'Van der Corput sequence for base 2 filling the largest voids',
      titleKo: '기저 2 반전 라디칼 수열이 가장 큰 빈 공간(Void)을 채워나가는 과정',
      src: '/books/pbrt-4ed/images/pha08f27.svg',
      captionKo: '그림 8.27: 2진수 반전 라디칼 수열의 진행 과정. 1 ($1_2 \\to 0.1_2 = 1/2$), 2 ($10_2 \\to 0.01_2 = 1/4$), 3 ($11_2 \\to 0.11_2 = 3/4$), 4 ($100_2 \\to 0.001_2 = 1/8$)... 새롭게 추가되는 점은 기존에 찍혀 있던 점들 사이의 가장 넓은 빈틈 정중앙에 칼같이 꽂히며 균일성을 유지합니다.',
      captionEn: 'Figure 8.27: The base-2 van der Corput sequence successively bisects the largest remaining intervals.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.6.2 다차원 할튼 수열 (The Halton Sequence)',
      titleEn: '8.6.2 The Halton Sequence'
    },
    {
      type: 'paragraph',
      textKo: '1960년 존 할튼(John Halton)은 반 데르 코르푸트의 1차원 수열을 임의의 고차원 공간으로 확장했습니다. 각 차원 $d$마다 서로 나누어떨어지지 않는 서로소(Coprime) 소수들($b_1=2, b_2=3, b_3=5, b_4=7, b_5=11, \\dots$)을 기저로 지정하여 다차원 점 $x_n$을 만듭니다:',
      textEn: 'The Halton sequence extends the van der Corput construction to arbitrary dimensions by pairing distinct prime bases for each coordinate axis:'
    },
    {
      type: 'equation',
      tex: 'x_n = \\Big( \\Phi_{p_1}(n), \\; \\Phi_{p_2}(n), \\; \\Phi_{p_3}(n), \\; \\dots, \\; \\Phi_{p_d}(n) \\Big)',
      explanationKo: '다차원 할튼 수열 공식: 1차원은 기저 2, 2차원은 기저 3, 3차원은 기저 5 등 서로 다른 소수 기저를 사용하여 점들의 독립성과 균일성을 보장합니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-28',
      number: 'Figure 8.28',
      title: '2D Halton points using bases 2 and 3',
      titleKo: '기저 2와 기저 3을 사용한 2차원 할튼 점들의 분포 (N=256)',
      src: '/books/pbrt-4ed/images/pha08f28.svg',
      captionKo: '그림 8.28: 기저 2와 3으로 생성된 256개의 할튼 점들. 순수 랜덤과 달리 점들이 뭉치거나 텅 빈 공간 없이 2차원 평면 전체를 매우 고르고 균일하게 덮고 있습니다.',
      captionEn: 'Figure 8.28: 2D Halton point set using prime bases (2, 3) for N = 256 samples, displaying high spatial uniformity.'
    },
    {
      type: 'figure',
      id: 'fig-08-29',
      number: 'Figure 8.29',
      title: 'Power spectrum of Halton sequence showing blue-noise-like characteristics',
      titleKo: '할튼 수열의 주파수 파워 스펙트럼과 저주파 억제 특성',
      src: '/books/pbrt-4ed/images/pha08f29.svg',
      captionKo: '그림 8.29: 할튼 수열의 파워 스펙트럼. 중심부(저주파)의 에너지가 강하게 억제되어 있어 렌더링 시 노이즈가 눈에 잘 띄지 않는 우수한 특성을 보입니다.',
      captionEn: 'Figure 8.29: The Fourier power spectrum of the Halton sequence, showing strong low-frequency attenuation.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.6.3 고차원 상관관계 왜곡과 스크램블링(Scrambling)',
      titleEn: '8.6.3 High-Dimensional Correlation and Scrambling'
    },
    {
      type: 'paragraph',
      textKo: '할튼 수열은 저차원에서는 환상적으로 동작하지만, 15차원이나 20차원 이상으로 올라가 소수 기저가 커지면(예: 71, 73) 심각한 결함이 드러납니다. 소수가 크면 초반 수십 개의 샘플에서 $1/b$ 크기의 거대한 띠(Stripes)가 형성되어 점들이 한쪽 사선으로 줄지어 늘어서는 상관관계(Correlation) 왜곡이 발생합니다.',
      textEn: 'When large prime bases are paired in high dimensions, the initial samples can exhibit striking correlation lines, degrading convergence.'
    },
    {
      type: 'figure',
      id: 'fig-08-30',
      number: 'Figure 8.30',
      title: 'High-dimensional correlation lines between large prime bases',
      titleKo: '큰 소수 기저 쌍(예: 29와 31)에서 발생하는 사선 줄무늬 상관관계 결함',
      src: '/books/pbrt-4ed/images/pha08f30.svg',
      captionKo: '그림 8.30: 스크램블링 없는 표준 할튼 수열에서 큰 소수 기저를 사용할 때 발생하는 치명적인 사선 뭉침 현상. 점들이 공간을 고르게 덮지 못하고 몇 개의 직선 위에 갇혀 버립니다.',
      captionEn: 'Figure 8.30: Correlated lines between coordinates with large prime bases (e.g., 29 and 31) in unscrambled Halton sequences.'
    },
    {
      type: 'figure',
      id: 'fig-08-31',
      number: 'Figure 8.31',
      title: 'Scrambled Halton points eliminating high-dimensional correlation',
      titleKo: '순열 스크램블링(Scrambling)을 적용하여 고차원 줄무늬를 완벽히 파괴한 결과',
      src: '/books/pbrt-4ed/images/pha08f31.svg',
      captionKo: '그림 8.31: 각 자릿수 $a_i$에 대해 무작위 순열 치환 $\\pi(a_i)$를 적용하는 스크램블링(Scrambling)을 가한 결과. 사선 줄무늬가 거짓말처럼 사라지고 완벽한 균일 점 분포가 복원됩니다.',
      captionEn: 'Figure 8.31: Applying digit permutations (Faure/Owen scrambling) breaks the linear correlations, restoring optimal uniformity.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.6.4 실전 렌더링 성능 벤치마크 (Dragon Scene MSE)',
      titleEn: '8.6.4 Practical Rendering Benchmark on the Dragon Scene'
    },
    {
      type: 'figure',
      id: 'fig-08-dragon-mse',
      number: 'Figure 8.32',
      title: 'MSE convergence curve comparing Halton, Sobol, and Random on Dragon scene',
      titleKo: '스탠퍼드 용(Dragon) 씬에서의 샘플러별 평균 제곱 오차(MSE) 수렴 속도 비교',
      src: '/books/pbrt-4ed/images/mse-dragon-halton.svg',
      captionKo: '그림 8.32: 샘플 수 증가에 따른 렌더링 오차(MSE) 수렴 그래프. 스크램블된 할튼 샘플러(Halton)와 소볼(Sobol) 샘플러가 순수 무작위(Independent) 샘플러보다 훨씬 가파른 기울기로 오차를 감소시킵니다.',
      captionEn: 'Figure 8.32: Mean squared error convergence on the Dragon scene: QMC samplers (Halton, Sobol) achieve superior error reduction compared to independent random sampling.'
    },
    {
      type: 'figure',
      id: 'fig-08-dragon-render',
      number: 'Figure 8.33',
      title: 'Visual rendering comparison on the Stanford Dragon scene',
      titleKo: '스탠퍼드 용 씬의 실제 렌더링 화질 비교 (16 spp)',
      src: '/books/pbrt-4ed/images/samplers-dragon-figure.png',
      captionKo: '그림 8.33: 픽셀당 16개 샘플(16 spp) 조건에서 렌더링한 용 모델. 독립 랜덤 샘플러는 몸체 전반에 자글자글한 노이즈가 심하지만, 할튼 샘플러는 부드럽고 선명한 반사광을 표현합니다.',
      captionEn: 'Figure 8.33: Visual comparison at 16 spp. Independent sampling produces noisy highlights, whereas low-discrepancy Halton sampling resolves specular highlights smoothly.'
    }
  ]
};
