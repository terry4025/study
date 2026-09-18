import { SectionContent } from '../../../../types/book';

export const CH08_02_SAMPLING_AND_INTEGRATION: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '8',
  chapterTitleKo: '제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)',
  sectionNumber: '8.2',
  sectionTitle: 'Sampling and Integration',
  sectionTitleKo: '8.2 샘플링과 수치 적분 (Sampling and Integration)',
  originalUrl: 'https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_and_Integration.html',
  prevSection: {
    id: 'ch08-01',
    title: '8.1 샘플링 이론과 앨리어싱',
  },
  nextSection: {
    id: 'ch08-03',
    title: '8.3 샘플러 인터페이스 (Sampling Interface)',
  },
  summary: {
    keyTakeaways: [
      '레이 트레이서에서 픽셀 색상을 계산하는 본질적인 목표는 연속 신호를 완전 복원(Reconstruction)하는 것이 아니라, 픽셀 영역 위에서 필터 함수와 곱해진 입사광의 적분값(Integration)을 구하는 것입니다.',
      '규칙적인 격자 샘플링은 나이퀴스트 주파수 이상의 신호를 영구적인 앨리어싱 왜곡(모아레 무늬)으로 변질시키지만, 확률적 몬테카를로 샘플링은 이를 인간의 눈에 훨씬 덜 거슬리는 고주파 노이즈(Noise)로 치환합니다.',
      '샘플링 패턴의 품질을 평가하는 두 가지 절대적인 기둥은 주파수 영역의 파워 스펙트럼 밀도(PSD, Power Spectral Density)와 공간 영역의 별-불일치도(Star Discrepancy $D_N^*$)입니다.',
      '콕스마-흘라브카(Koksma-Hlawka) 부등식 $|\\text{Error}| \\le V(f) \\cdot D_N^*(P)$은 수치 적분의 오차가 피적분 함수의 변동성(Total Variation $V(f)$)과 샘플 점 집합의 불일치도($D_N^*$)의 곱으로 엄격하게 제한됨을 증명합니다.',
      '준몬테카를로(QMC, Quasi-Monte Carlo) 방식은 불일치도가 $O((\\log N)^s / N)$으로 극도로 낮은 결정론적 저불일치 수열(Low-Discrepancy Sequences)을 사용하여, 전통적인 순수 무작위 몬테카를로의 $O(1/\\sqrt{N})$ 속도를 훨씬 능가하는 초고속 수렴을 달성합니다.'
    ],
    prerequisites: [
      '8장 8.1 푸리에 변환과 나이퀴스트-섀넌 샘플링 정리',
      '2장 2.1 몬테카를로 적분의 기댓값과 분산 ($O(1/\\sqrt{N})$ 수렴 속도)',
      '해석학: 리만-스틸체스 적분과 함수의 유계 변동(Bounded Variation)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.2.1 신호 복원 vs 수치 적분의 근본적 차이',
      titleEn: '8.2.1 Signal Reconstruction versus Numerical Integration'
    },
    {
      type: 'paragraph',
      textKo: '고전 신호 처리(Signal Processing)에서 샘플링의 목표는 이산적인 샘플들로부터 원래의 연속 아날로그 함수 $f(x)$를 오차 없이 복원(Reconstruction)하는 것이었습니다. 그러나 컴퓨터 그래픽스의 렌더링 파이프라인에서 우리가 풀고자 하는 문제는 다릅니다. 우리는 연속된 센서 표면 전체에 도달하는 복잡한 입사광 $L(p, \\omega)$과 픽셀 필터 가중치 $w(p)$를 곱한 가중 적분값(Weighted Integral)을 구하고자 합니다:',
      textEn: 'In classical signal processing, the goal of sampling is to reconstruct the continuous signal. In rendering, however, the goal is almost always numerical integration: computing the average radiance over a pixel weighted by a filter function.'
    },
    {
      type: 'equation',
      tex: 'I = \\iint_{\\text{pixel}} L(x, y) w(x, y) dx dy',
      explanationKo: '픽셀 측정 방정식: 픽셀 영역 위에서 필름 평면에 도달하는 연속 입사광 $L(x, y)$와 픽셀 재구성 필터 $w(x, y)$의 2차원 적분입니다.'
    },
    {
      type: 'paragraph',
      textKo: '나이퀴스트 정리에 따르면 날카로운 폴리곤 실루엣이나 무한대의 주파수를 갖는 신호는 유한한 샘플링으로 완벽히 복원할 수 없습니다. 하지만 르베그 적분(Lebesgue Integration) 관점에서 볼 때, 날카로운 불연속 경계선은 측도 0(Measure Zero)을 가지므로 적분값 자체는 항상 명확한 유한값으로 수렴합니다. 즉, 완벽한 신호 복원은 불가능할지라도, **정확한 적분값(평균 색상)을 추정하는 것은 완벽하게 가능**합니다!',
      textEn: 'While step discontinuities have infinite frequency spectra that make exact reconstruction impossible, they have measure zero and thus do not prevent accurate numerical integration.'
    },
    {
      type: 'figure',
      id: 'fig-08-16',
      number: 'Figure 8.16',
      title: 'Sampling patterns: Regular, Random, and Stratified with power spectra',
      titleKo: '샘플링 패턴 비교: 규칙적 격자, 완전 무작위, 계층화 샘플링과 파워 스펙트럼',
      src: '/books/pbrt-4ed/images/pha08f16.svg',
      captionKo: '그림 8.16: (위) 공간 영역에서의 점 분포. (아래) 주파수 영역에서의 파워 스펙트럼. 규칙적 격자(Regular)는 스펙트럼에 강력한 임펄스 스파이크들이 박혀 있어 앨리어싱을 유발합니다. 완전 무작위(Random)는 스파이크는 없지만 스펙트럼 전체에 백색 잡음이 깔립니다. 계층화(Stratified)는 중심 주변의 저주파 잡음이 억제되어 렌더링 분산을 크게 낮춥니다.',
      captionEn: 'Figure 8.16: Spatial point distributions and their power spectra for regular, random, and stratified patterns. Stratification significantly suppresses energy near the DC origin.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.2.2 샘플링 패턴의 품질을 평가하는 수학적 도구',
      titleEn: '8.2.2 Mathematical Tools for Evaluating Sampling Patterns'
    },
    {
      type: 'paragraph',
      textKo: '어떤 샘플링 방식이 렌더링에 가장 적합한지를 객관적으로 검증하기 위해 연구자들은 두 가지 정밀한 수학적 척도를 사용합니다: 주파수 영역의 **파워 스펙트럼 밀도(Power Spectral Density)**와 공간 영역의 **불일치도(Discrepancy)**입니다.',
      textEn: 'Two primary mathematical frameworks are used to evaluate sampling quality: Fourier power spectral density in the frequency domain, and discrepancy in the spatial domain.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1. 파워 스펙트럼 밀도 (PSD)와 방사형 평균',
      titleEn: '1. Power Spectral Density and Radial Average'
    },
    {
      type: 'paragraph',
      textKo: '$N$개의 샘플 점 집합 $P = \\{x_1, x_2, \\dots, x_N\\}$에 대한 파워 스펙트럼 밀도 $P(\\omega)$는 다음과 같이 정의됩니다:',
      textEn: 'The power spectral density P(omega) of a point set evaluates how energy is distributed across frequencies:'
    },
    {
      type: 'equation',
      tex: 'P(\\omega) = \\frac{1}{N} \\left| \\sum_{j=1}^{N} e^{-i 2\\pi \\omega \\cdot x_j} \\right|^2',
      explanationKo: '파워 스펙트럼 밀도(PSD): 각 샘플 점들의 복소 지수 기저 위상 합의 제곱 크기입니다. 특정 주파수 $\\omega$에 규칙적인 반복 구조가 존재하면 $P(\\omega)$ 값이 비정상적으로 치솟게 됩니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-17',
      number: 'Figure 8.17',
      title: 'Radial average and anisotropy profiles of sampling patterns',
      titleKo: '샘플링 패턴의 주파수 방사형 평균(Radial Mean)과 이방성(Anisotropy) 그래프',
      src: '/books/pbrt-4ed/images/pha08f17.svg',
      captionKo: '그림 8.17: 주파수 스펙트럼을 반지름 $r$에 따라 동심원상으로 적분한 방사형 평균 곡선입니다. 이상적인 청색 잡음(Blue Noise)은 $r=0$ 근처(저주파)에서 에너지가 0에 가깝다가, 나이퀴스트 한계 이후 급격히 완만한 고주파 고원을 형성하며 이방성(방향에 따른 왜곡)이 0에 수렴합니다.',
      captionEn: 'Figure 8.17: Radial power spectrum profiles. Ideal blue noise exhibits zero low-frequency power with minimal directional anisotropy.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '2. 불일치도 (Discrepancy)와 콕스마-흘라브카 부등식',
      titleEn: '2. Discrepancy and the Koksma-Hlawka Inequality'
    },
    {
      type: 'paragraph',
      textKo: '공간 영역에서 샘플들이 단위 사각/입방 영역 $[0, 1]^s$에 얼마나 고르고 균등하게 분포되어 있는지를 측정하는 기하학적 척도가 바로 **별-불일치도(Star Discrepancy, $D_N^*$)**입니다. 임의의 원점을 포함하는 축정렬 상자 $B = [0, v_1) \\times \\dots \\times [0, v_s)$에 대해, 실제 상자 부피 $\\text{Vol}(B)$와 상자 안에 떨어진 샘플 개수의 비율 사이의 최대 편차를 구합니다:',
      textEn: 'Star discrepancy measures how uniformly sample points cover the unit domain by comparing the fraction of points inside arbitrary sub-boxes against their actual volume:'
    },
    {
      type: 'equation',
      tex: 'D_N^*(P) = \\sup_{B \\in \\mathcal{J}^*} \\left| \\frac{\\#(P \\cap B)}{N} - \\text{Vol}(B) \\right|',
      explanationKo: '별-불일치도 정의: $\\#(P \\cap B)$는 상자 $B$ 내부에 포함된 샘플 점의 개수입니다. 모든 가능한 상자 $B$에 대해 이 차이의 상한(Supremum)을 취한 것이 불일치도이며, 이 값이 0에 가까울수록 샘플들이 공간을 완벽하게 균등 분할하고 있음을 뜻합니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-18',
      number: 'Figure 8.18',
      title: 'Measuring discrepancy using sub-boxes in unit square',
      titleKo: '단위 정사각형 내부의 임의 상자 $B$를 통한 불일치도 측정 원리',
      src: '/books/pbrt-4ed/images/pha08f18.svg',
      captionKo: '그림 8.18: 좌하단 원점에서 출발하는 임의의 사각형 $B$의 면적이 $0.35$인데, 전체 100개의 점 중 정확히 35개의 점이 상자 안에 들어있다면 불일치 오차는 0입니다. 점들이 한쪽으로 쏠리면 이 편차가 커지며 수치 적분 오차가 증가합니다.',
      captionEn: 'Figure 8.18: Evaluating discrepancy by testing arbitrary boxes rooted at the origin against the point fraction.'
    },
    {
      type: 'paragraph',
      textKo: '불일치도가 컴퓨터 그래픽스에서 이토록 중요한 이유는 수치해석학의 위대한 정리인 **콕스마-흘라브카 부등식(Koksma-Hlawka Inequality)** 덕분입니다:',
      textEn: 'The significance of discrepancy is established by the Koksma-Hlawka inequality, which bounds numerical integration error:'
    },
    {
      type: 'equation',
      tex: '\\left| \\frac{1}{N} \\sum_{i=1}^{N} f(x_i) - \\int_{[0, 1]^s} f(x) dx \\right| \\le V(f) \\cdot D_N^*(P)',
      explanationKo: '콕스마-흘라브카 부등식: 수치 적분의 오차 절댓값은 피적분 함수의 변동성(Hardy-Krause 의미의 전변동 $V(f)$)과 샘플 점 집합의 별-불일치도 $D_N^*(P)$의 곱보다 항상 작거나 같습니다.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: 'QMC(준몬테카를로)가 순수 랜덤보다 압도적으로 우월한 이유',
      summary: '왜 현대 영화 렌더러들은 C++의 rand()나 단순 무작위 난수를 버리고 저불일치 수열(QMC)을 쓸까요?',
      points: [
        {
          title: '순수 몬테카를로(MC)의 한계 O(1/√N)',
          content: '주사위를 무작위로 굴리면 샘플들이 우연히 한곳에 뭉치고 빈 공간이 생깁니다. 오차를 절반으로 줄이려면 샘플을 4배, 10분의 1로 줄이려면 100배나 더 쏴야 합니다(O(1/√N) 수렴).'
        },
        {
          title: '준몬테카를로(QMC)의 기적: 거의 O(1/N) 수렴!',
          content: '저불일치 수열(Halton, Sobol)은 점들이 서로를 밀어내듯 수학적으로 정교하게 배치되어 불일치도가 O((log N)^s / N)으로 떨어집니다. 1차원에서는 오차가 1/N에 비례하여 줄어들어, 단 100개의 샘플만으로도 순수 랜덤 10,000개 수준의 극강의 선명함을 뽑아냅니다!'
        }
      ],
      tags: ['QMC', '준몬테카를로', '불일치도', '수치적분', '수렴속도']
    },
    {
      type: 'figure',
      id: 'fig-08-19',
      number: 'Figure 8.19',
      title: 'Integration error convergence: Random vs Stratified vs QMC',
      titleKo: '적분 오차 수렴 속도 비교: 순수 랜덤($O(N^{-0.5})$) 대 저불일치 QMC($O(N^{-1})$)',
      src: '/books/pbrt-4ed/images/pha08f19.svg',
      captionKo: '그림 8.19: 로그-로그 스케일에서의 샘플 수에 따른 적분 오차 수렴 곡선입니다. 순수 랜덤(Random, 파란 선)의 기울기가 $-0.5$($1/\\sqrt{N}$)에 머무는 반면, 정교한 저불일치 수열(QMC, 주황/초록 선)은 기울기가 $-1$($1/N$)에 육박하여 수십 배 적은 샘플로 노이즈 없는 깨끗한 이미지를 렌더링합니다.',
      captionEn: 'Figure 8.19: Convergence rates of Monte Carlo vs Quasi-Monte Carlo. QMC achieves nearly O(1/N) convergence for smooth functions, far outperforming random sampling.'
    }
  ]
};
