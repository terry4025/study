import { SectionContent } from '../../../../types/book';

export const CH08_07_SOBOL_SAMPLER: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '8',
  chapterTitleKo: '제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)',
  sectionNumber: '8.7',
  sectionTitle: 'Sobol’ Samplers',
  sectionTitleKo: '8.7 Sobol 저불일치 샘플러와 디지털 네트 (Sobol’ Samplers)',
  originalUrl: 'https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sobol_Samplers.html',
  prevSection: {
    id: 'ch08-06',
    title: '8.6 Halton 저불일치 샘플러',
  },
  nextSection: {
    id: 'ch08-08',
    title: '8.8 픽셀 재구성 필터링 (Image Reconstruction)',
  },
  summary: {
    keyTakeaways: [
      'Sobol’ 수열은 모든 차원에서 오직 기저 2($b=2$)만을 사용하는 $(t, s)$-디지털 시퀀스로, 현대 프로덕션 렌더러에서 사실상 표준(de facto standard)으로 군림하는 최강의 샘플러입니다.',
      '$(0, m, 2)$-네트 특성: $2^m$개의 점 집합은 면적이 $2^{-m}$인 어떠한 2진 기본 직사각형(가로 $2^{-a} \\times$ 세로 $2^{-b}$, $a+b=m$)으로 영역을 쪼개더라도, 각 직사각형 안에 정확히 단 1개의 점만 존재하는 기적적인 균일성을 보장합니다.',
      '소볼 수열은 생성 행렬(Generator Matrices)과 방향 벡터(Direction Vectors)를 비트 XOR($\\oplus$) 연산하여 생성되므로, CPU/GPU 하드웨어에서 나노초 단위로 초고속 실행됩니다.',
      'pbrt 제4판의 혁신인 ZSobolSampler는 모턴(Morton) Z-순서 곡선과 소볼 수열을 결합하여, 픽셀 간 시각적 상관관계를 방지하고 캐시 친화적인 메모리 접근을 유지하면서 최고의 렌더링 수렴 속도를 제공합니다.'
    ],
    prerequisites: [
      '8장 8.6 반전 라디칼 함수와 Halton 수열',
      '이산수학: 유한체(Galois Field GF(2))와 비트 XOR 연산',
      '컴퓨터공학: 2진수 비트 연산(Bitwise Operations)과 캐시 라인'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.7.1 디지털 네트(Digital Nets)와 (0, m, 2)-시퀀스',
      titleEn: '8.7.1 Digital Nets and (0, m, 2)-Sequences'
    },
    {
      type: 'paragraph',
      textKo: '러시아의 저명한 수학자 일리야 소볼(Ilya M. Sobol\')은 1967년 기저 2진법($b=2$)만을 활용하여 다차원 공간을 극한으로 균등 분할하는 디지털 네트(Digital Net) 이론을 정립했습니다. 소볼 수열의 가장 위대한 특성은 **어떤 2진 직사각형(Elementary Interval)을 잡더라도 샘플이 정확히 1개씩 존재한다**는 $(0, m, 2)$-네트 법칙입니다.',
      textEn: 'The Sobol’ sequence is a (0, s)-sequence in base 2. A digital net of 2^m samples guarantees that every elementary interval of area 2^-m contains exactly one sample.'
    },
    {
      type: 'figure',
      id: 'fig-08-34',
      number: 'Figure 8.34',
      title: 'Elementary intervals in 2D with area 2^-4 = 1/16',
      titleKo: '면적이 $2^{-4} = 1/16$인 다양한 형태의 2차원 기본 2진 직사각형들',
      src: '/books/pbrt-4ed/images/pha08f34.svg',
      captionKo: '그림 8.34: $2^4 = 16$개의 소볼 점이 있을 때, 가로로 길쭉한 직사각형($1/16 \\times 1$), 정사각형($1/4 \\times 1/4$), 세로로 홀쭉한 직사각형($1 \\times 1/16$) 등 면적이 $1/16$인 모든 가능한 2진 분할 영역마다 정확히 단 하나의 샘플만 들어차게 됩니다.',
      captionEn: 'Figure 8.34: Elementary intervals of volume 2^-4 = 1/16 in the unit square. In a (0, 4, 2)-net, every such interval contains exactly one sample point.'
    },
    {
      type: 'figure',
      id: 'fig-08-35',
      number: 'Figure 8.35',
      title: 'Sobol points perfectly stratifying all elementary intervals',
      titleKo: '모든 기본 직사각형을 완벽하게 1개씩 채우는 소볼 점들의 기적적인 배치',
      src: '/books/pbrt-4ed/images/pha08f35.svg',
      captionKo: '그림 8.35: 16개의 소볼 점들이 단위 정사각형 위에 놓인 모습. 1차원 $x$축이나 $y$축으로 투영해도 16등분 균일하고, 2차원의 어떤 $2^a \\times 2^b$ 격자를 들이대도 단 하나의 빈틈이나 중복 없이 1:1로 매칭됩니다.',
      captionEn: 'Figure 8.35: A 16-point (0, 4, 2)-net: sample points are simultaneously stratified across all horizontal, vertical, and square subdivisions.'
    },
    {
      type: 'paragraph',
      textKo: '소볼 수열의 $n$번째 샘플의 $j$번째 차원 좌표 $x_{n, j}$는 정수 $n$의 2진수 비트들과 사전 계산된 방향 벡터(Direction Vectors, $v_{i, j}$)들의 **비트 XOR($\\oplus$) 연산**으로 단숨에 계산됩니다:',
      textEn: 'A Sobol’ coordinate is evaluated by XOR-summing direction vectors according to the binary digits of the sample index n:'
    },
    {
      type: 'equation',
      tex: 'x_{n, j} = n_0 v_{0, j} \\oplus n_1 v_{1, j} \\oplus n_2 v_{2, j} \\oplus \\dots \\oplus n_{31} v_{31, j}',
      explanationKo: '소볼 좌표 계산 수식: $n_i$는 인덱스 $n$의 $i$번째 2진 비트(0 또는 1)이며, $\\oplus$는 비트별 배타적 논리합(XOR)입니다. 부동소수점 나눗셈이나 루프 없이 하드웨어 비트 명령어로 극도로 빠르게 계산됩니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-36',
      number: 'Figure 8.36',
      title: '2D Sobol point set with 256 samples',
      titleKo: '256개의 점으로 구성된 2차원 소볼 점 집합',
      src: '/books/pbrt-4ed/images/pha08f36.svg',
      captionKo: '그림 8.36: 256개의 소볼 점들. 할튼 수열과 달리 큰 소수를 쓰지 않고 오직 2진 비트 연산만으로 작동하므로 고차원에서도 사선 줄무늬 결함이 생기지 않습니다.',
      captionEn: 'Figure 8.36: A 256-point Sobol’ set in 2D, demonstrating uniform distribution across multiple scales.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.7.2 디지털 수열의 무작위화: 오웬 스크램블링(Owen Scrambling)',
      titleEn: '8.7.2 Randomization and Owen Scrambling'
    },
    {
      type: 'paragraph',
      textKo: '소볼 수열은 순수한 수학적 결정론적(Deterministic) 수열이므로, 모든 픽셀에서 동일한 소볼 수열을 그대로 쓰면 화면 전체에 계단 현상과 격자 아티팩트가 그대로 보존됩니다. 따라서 각 픽셀마다 소볼 수열의 우수한 $(0, m, 2)$-네트 특성은 100% 보존하면서 위치를 무작위화하는 기술이 필요합니다. 아티 오웬(Art Owen) 교수가 제안한 **오웬 스크램블링(Owen Scrambling)**은 비트 트리(Binary Tree) 구조에서 재귀적으로 비트를 반전시켜 이상적인 청색 잡음(Blue Noise) 특성을 완성합니다.',
      textEn: 'Owen scrambling applies random permutations to the binary digits of Sobol’ points while preserving the net properties, transforming the point set into a randomized low-discrepancy pattern.'
    },
    {
      type: 'figure',
      id: 'fig-08-39',
      number: 'Figure 8.39',
      title: 'Power spectrum of Owen scrambled Sobol points',
      titleKo: '오웬 스크램블링을 거친 소볼 수열의 파워 스펙트럼',
      src: '/books/pbrt-4ed/images/pha08f39.svg',
      captionKo: '그림 8.39: 오웬 스크램블링된 소볼 수열의 푸리에 스펙트럼. 중심부(저주파)가 완벽하게 비어 있는 이상적인 청색 잡음(Blue Noise) 형태를 띠며, 렌더링 시 노이즈를 인간의 눈에 거의 보이지 않는 초미세 입자로 흩뿌립니다.',
      captionEn: 'Figure 8.39: Fourier spectrum of Owen-scrambled Sobol’ points exhibiting superior blue-noise characteristics.'
    },
    {
      type: 'figure',
      id: 'fig-08-40',
      number: 'Figure 8.40',
      title: 'Visual rendering of Killeroo with Owen scrambled Sobol sampler',
      titleKo: '오웬 스크램블드 소볼 샘플러로 렌더링한 킬러루(Killeroo) 모델',
      src: '/books/pbrt-4ed/images/killeroo-sobol-checkerboard.png',
      captionKo: '그림 8.40: 바닥의 체커보드와 킬러루 모델에 맺힌 부드러운 그림자와 앰비언트 오클루전이 모아레 현상 없이 완벽하고 매끄럽게 렌더링됩니다.',
      captionEn: 'Figure 8.40: Killeroo rendered with Owen-scrambled Sobol’ sampling, showing crisp geometry without aliasing.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.7.3 pbrt-v4의 혁신: ZSobolSampler와 모턴 비트 인터리빙',
      titleEn: '8.7.3 The ZSobolSampler and Morton Bit Interleaving'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt 제4판에 새롭게 도입된 `ZSobolSampler`는 7장에서 다룬 모턴 코드(Morton Code, Z-순서 곡선)와 소볼 수열을 융합한 최첨단 샘플러입니다. 픽셀 좌표 $(x, y)$의 비트와 샘플 인덱스의 비트를 인터리빙하여 단일한 소볼 시퀀스로 매핑함으로써, 이웃 픽셀 간의 시각적 노이즈 상관관계를 파괴하고 CPU 캐시 국소성을 극대화합니다.',
      textEn: 'The ZSobolSampler combines the 2D pixel coordinates and the sample index into a single Morton index, providing cache-friendly access and high-quality blue-noise distribution across screen space.'
    },
    {
      type: 'figure',
      id: 'fig-08-46',
      number: 'Figure 8.46',
      title: 'Screen space noise distribution: Independent vs ZSobolSampler',
      titleKo: '화면 공간 노이즈 분포 비교: 독립 랜덤 샘플러 대 ZSobolSampler',
      src: '/books/pbrt-4ed/images/pha08f46.png',
      captionKo: '그림 8.46: (왼쪽) 독립 랜덤 샘플러는 화면 전체에 굵은 얼룩(저주파 노이즈)이 뭉쳐 보입니다. (오른쪽) ZSobolSampler는 노이즈가 고주파 모래알처럼 미세하게 쪼개져 픽셀 필터에 의해 즉시 매끄럽게 지워집니다.',
      captionEn: 'Figure 8.46: Comparison of screen-space noise: Independent sampling exhibits low-frequency splotches, whereas ZSobol produces uniform high-frequency blue noise.'
    },
    {
      type: 'figure',
      id: 'fig-08-47',
      number: 'Figure 8.47',
      title: 'Pixel error heatmap across the image plane',
      titleKo: '필름 평면 전반의 픽셀별 오차 히트맵 비교',
      src: '/books/pbrt-4ed/images/pha08f47.png',
      captionKo: '그림 8.47: 픽셀 오차 히트맵. ZSobolSampler는 복잡한 기하학과 그림자 에지 영역에서도 현저히 낮은 오차율(파란색 영역 증가)을 자랑합니다.',
      captionEn: 'Figure 8.47: Error heatmap across the film plane showing significantly lower variance with ZSobol.'
    },
    {
      type: 'figure',
      id: 'fig-08-dragon-zsobol',
      number: 'Figure 8.48',
      title: 'Dragon rendering without permutations showing correlation artifacts',
      titleKo: '순열 치환이 없는 소볼 샘플러의 드래곤 렌더링 (상관관계 결함 발생)',
      src: '/books/pbrt-4ed/images/samplers-dragon-zsobol-nopermute.png',
      captionKo: '그림 8.48: 순열 스크램블링을 껐을 때 발생하는 미세한 규칙적 구조 결함. pbrt-v4는 비트 치환 순열(Permutation)을 기본 적용하여 이러한 아티팩트를 원천 박멸합니다.',
      captionEn: 'Figure 8.48: Visual artifacts on the Dragon scene when permutations are omitted from the digital net.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '소볼(Sobol\')과 2진수 비트 연산의 궁합',
      summary: '왜 소볼 수열이 현대 컴퓨터 하드웨어(CPU/GPU)에서 압도적인 속도를 낼까요?',
      points: [
        {
          title: '부동소수점 나눗셈 제로화',
          content: '할튼 수열은 3, 5, 7, 11 등 소수로 나누어야 하므로 무거운 나눗셈 연산이 필요합니다. 반면 소볼 수열은 기저가 2이므로, 비트 시프트(<<, >>)와 비트 XOR(^) 연산만으로 모든 난수를 나노초 단위로 뽑아냅니다.'
        },
        {
          title: 'SIMD와 GPU 하드웨어 가속',
          content: '소볼 수열의 방향 벡터 곱셈은 32비트 정수 비트 연산이므로, 현대 AVX-512나 GPU 워프(Warp) 단위에서 분기 없이 완벽하게 병렬화됩니다.'
        }
      ],
      tags: ['소볼수열', '비트연산', 'XOR', '디지털네트', '하드웨어최적화']
    }
  ]
};
