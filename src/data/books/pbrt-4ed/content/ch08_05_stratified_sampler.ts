import { SectionContent } from '../../../../types/book';

export const CH08_05_STRATIFIED_SAMPLER: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '8',
  chapterTitleKo: '제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)',
  sectionNumber: '8.5',
  sectionTitle: 'Stratified Sampler',
  sectionTitleKo: '8.5 계층화 샘플러 (Stratified Sampler)',
  originalUrl: 'https://pbr-book.org/4ed/Sampling_and_Reconstruction/Stratified_Sampler.html',
  prevSection: {
    id: 'ch08-04',
    title: '8.4 독립 랜덤 샘플러',
  },
  nextSection: {
    id: 'ch08-06',
    title: '8.6 Halton 저불일치 샘플러 (Halton Sampler)',
  },
  summary: {
    keyTakeaways: [
      '계층화 샘플링(Stratified Sampling)은 샘플링 영역을 여러 개의 겹치지 않는 하위 영역(Strata)으로 쪼갠 뒤, 각 영역마다 정확히 정해진 개수(보통 1개)의 샘플을 지터링(Jittering)하여 추출하는 기법입니다.',
      '샘플들이 한곳으로 뭉치거나 거대한 빈 구멍이 생기는 것을 원천 봉쇄하여, 순수 랜덤 샘플링에 비해 분산(노이즈)을 극적으로 감소시킵니다.',
      '차원의 저주(Curse of Dimensionality): 10차원 공간에서 각 축을 4등분만 해도 픽셀당 $4^{10} \\approx 100만$ 개의 샘플이 필요해지는 폭발적 샘플 증가 문제가 발생합니다.',
      '라틴 초입방체 샘플링(LHS, Latin Hypercube Sampling / N-Rooks): 체스의 룩(Rook)들이 서로를 공격하지 못하도록 행과 열에 단 하나씩만 배치하는 원리를 고차원 무작위 순열(Random Permutation)로 구현하여, 단 $N$개의 샘플만으로 모든 1D 프로젝션의 완벽한 계층화를 보장합니다.'
    ],
    prerequisites: [
      '8장 8.1 앨리어싱과 무작위 샘플링',
      '8장 8.4 독립 랜덤 샘플러(IndependentSampler)',
      '확률 통계: 조건부 분산과 분산 감소 기법(Variance Reduction)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.5.1 계층화(Stratification)와 지터링(Jittering)',
      titleEn: '8.5.1 Stratification and Jittering'
    },
    {
      type: 'paragraph',
      textKo: '순수 무작위 샘플링(백색 잡음)의 가장 큰 결함은 샘플들이 우연히 뭉치는 덩어리(Clustering)와 텅 빈 공간(Void)이 발생한다는 점입니다. 이 문제를 해결하는 가장 자연스러운 직관은 "영역을 균등한 격자 조각들로 미리 쪼개놓고, 각 조각 안에서 딱 1개씩만 무작위로 뽑자!"라는 발상입니다. 이를 **계층화 샘플링(Stratified Sampling)** 또는 **지터링(Jittering)**이라고 부릅니다.',
      textEn: 'Stratified sampling subdivides the sampling domain into non-overlapping sub-regions (strata) and places a single randomly jittered sample inside each stratum.'
    },
    {
      type: 'figure',
      id: 'fig-08-22',
      number: 'Figure 8.22',
      title: 'Random sampling versus stratified jittered sampling in 2D',
      titleKo: '2차원 공간에서의 순수 랜덤 샘플링과 계층화 지터링 샘플링의 비교',
      src: '/books/pbrt-4ed/images/pha08f22.svg',
      captionKo: '그림 8.22: (왼쪽) 순수 무작위 샘플링: 점들이 제멋대로 뭉쳐 덩어리와 빈 구멍이 생깁니다. (오른쪽) 계층화 샘플링: 2차원 공간을 $4 \\times 4 = 16$개의 격자로 분할하고 각 칸 안에서 난수를 1개씩 뽑았습니다. 완벽한 무작위성을 유지하면서도 점들이 전체 영역에 훨씬 균일하게 퍼집니다.',
      captionEn: 'Figure 8.22: (Left) Completely random samples exhibit clumping and gaps. (Right) Stratified samples place one sample per grid cell, ensuring much more uniform coverage.'
    },
    {
      type: 'paragraph',
      textKo: '$n_x \\times n_y$ 격자에서 $(i, j)$번째 칸에 들어가는 지터링된 2차원 샘플 좌표는 다음과 같은 단순한 공식으로 계산됩니다:',
      textEn: 'For an nx by ny grid, the sample in cell (i, j) is computed by:'
    },
    {
      type: 'equation',
      tex: 'x_{i, j} = \\frac{i + \\xi_x}{n_x}, \\quad y_{i, j} = \\frac{j + \\xi_y}{n_y} \\quad (0 \\le i < n_x, \\; 0 \\le j < n_y)',
      explanationKo: '지터링 좌표 공식: $\\xi_x, \\xi_y$는 $[0, 1)$ 범위의 독립 난수입니다. 격자 셀의 좌하단 인덱스에 난수를 더한 뒤 전체 격자 수로 나누어 정규화합니다.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.5.2 차원의 저주(Curse of Dimensionality)와 한계',
      titleEn: '8.5.2 The Curse of Dimensionality'
    },
    {
      type: 'paragraph',
      textKo: '2차원 픽셀 영역에서는 $4 \\times 4 = 16$개나 $8 \\times 8 = 64$개로 나누면 완벽하게 동작합니다. 하지만 카메라 렌즈(2D), 시간(1D), 빛 산란(2D), 광원 위치(2D) 등 렌더링에 필요한 총 차원이 10차원에 달하면 심각한 수학적 재앙이 닥칩니다. 각 차원을 고작 4개 구간으로만 쪼개도 필요한 총 샘플 수가 무려 $4^{10} = 1,048,576$개(100만 개 이상!)로 폭증합니다. 픽셀 하나당 100만 개의 광선을 쏘는 것은 물리적으로 불가능합니다.',
      textEn: 'While effective in 2D, naive stratification suffers from the curse of dimensionality: stratifying a 10D space into just 4 bins per axis requires 4^10 over one million samples per pixel.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.5.3 라틴 초입방체 샘플링 (Latin Hypercube Sampling / N-Rooks)',
      titleEn: '8.5.3 Latin Hypercube Sampling (N-Rooks Algorithm)'
    },
    {
      type: 'paragraph',
      textKo: '차원의 저주를 우아하게 격파하기 위해 개발된 알고리즘이 바로 **라틴 초입방체 샘플링(LHS, Latin Hypercube Sampling)**, 일명 **N-룩스(N-Rooks) 알고리즘**입니다.',
      textEn: 'Latin Hypercube Sampling (LHS), also known as the N-rooks method, solves the curse of dimensionality by ensuring 1D stratification across any number of dimensions using only N total samples.'
    },
    {
      type: 'figure',
      id: 'fig-08-24',
      number: 'Figure 8.24',
      title: 'Latin Hypercube Sampling (N-Rooks placement)',
      titleKo: '라틴 초입방체 샘플링(N-Rooks)의 체스 룩 배치 원리',
      src: '/books/pbrt-4ed/images/pha08f24.svg',
      captionKo: '그림 8.24: 체스판 위에 $N$개의 룩(Rook)을 놓을 때, 어떤 룩도 같은 행이나 같은 열에 놓이지 않도록 배치합니다. 각 행과 각 열마다 정확히 단 하나의 샘플만 존재하므로, $x$축이나 $y$축으로 정사영(Projection)을 내렸을 때 1차원 구간들이 완벽하게 균등 분할됩니다.',
      captionEn: 'Figure 8.24: In Latin hypercube sampling, N samples are placed such that no two share the same row or column (like non-attacking rooks on a chessboard).'
    },
    {
      type: 'code',
      chunkName: '<<Generate Latin Hypercube Samples>>=',
      language: 'cpp',
      code: `void LatinHypercube(Float *samples, int nSamples, int nDim, RNG &rng) {
    Float invNSamples = 1.0f / nSamples;
    // 1. 대각선 상에 균등하게 N개의 샘플 생성
    for (int i = 0; i < nSamples; ++i) {
        for (int j = 0; j < nDim; ++j) {
            Float sj = (i + rng.Uniform<Float>()) * invNSamples;
            samples[nDim * i + j] = std::min(sj, OneMinusEpsilon);
        }
    }
    // 2. 각 차원마다 인덱스를 무작위 셔플(Fisher-Yates Shuffle)
    for (int j = 0; j < nDim; ++j) {
        for (int i = 0; i < nSamples; ++i) {
            int other = i + rng.Uniform<uint32_t>(nSamples - i);
            std::swap(samples[nDim * i + j], samples[nDim * other + j]);
        }
    }
}`,
      explanationKo: '라틴 초입방체 샘플링의 C++ 핵심 알고리즘입니다. N개의 샘플을 대각선 상에 균일 지터링하여 생성한 후, 각 차원 축별로 피셔-예이츠 셔플(Fisher-Yates Shuffle)을 수행하여 샘플들을 무작위 순열로 교차 짝짓기합니다. 단 N개의 샘플만으로 모든 차원의 1D 프로젝션 균일성을 달성합니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-26',
      number: 'Figure 8.26',
      title: 'Comparison of 1D projections: Random versus Latin Hypercube',
      titleKo: '1차원 프로젝션 비교: 순수 무작위 대 라틴 초입방체 샘플링',
      src: '/books/pbrt-4ed/images/pha08f26.svg',
      captionKo: '그림 8.26: 순수 무작위 샘플링(위)은 축에 투영했을 때 샘플들이 서로 뭉치고 커다란 빈틈이 생기지만, 라틴 초입방체 샘플링(아래)은 축에 투영했을 때 모든 칸에 정확히 1개씩 완벽하게 균등 배치됩니다.',
      captionEn: 'Figure 8.26: Projecting samples to a 1D axis reveals that Latin Hypercube samples are perfectly stratified across each dimension individually.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '피셔-예이츠 셔플(Fisher-Yates Shuffle)의 마법',
      summary: 'N개의 원소를 O(N) 시간에 완벽하게 공평한 무작위 순열로 섞는 컴퓨터 과학의 불후의 명작!',
      points: [
        {
          title: '어설픈 std::random_shuffle의 편향 버그',
          content: '초보자들은 i번째 원소와 [0, N-1] 전체 중 무작위 원소를 맞바꾸는 실수를 자주 범합니다. 이는 N^N가지 경우의 수가 생겨 N!으로 나누어떨어지지 않아 심각한 확률 편향(Bias)이 발생합니다.'
        },
        {
          title: '엄밀한 O(N) 피셔-예이츠 알고리즘',
          content: 'i번째 원소를 뽑을 때 반드시 [i, N-1] 구간의 아직 선택되지 않은 원소와만 교환합니다. 정확히 N!가지의 모든 순열이 1/N!의 완전 동일한 확률로 생성되는 완벽한 비편향 알고리즘입니다.'
        }
      ],
      tags: ['피셔예이츠', '순열셔플', '알고리즘', '라틴초입방체', 'N-Rooks']
    }
  ]
};
