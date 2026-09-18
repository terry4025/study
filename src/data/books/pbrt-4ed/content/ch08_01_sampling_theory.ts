import { SectionContent } from '../../../../types/book';

export const CH08_01_SAMPLING_THEORY: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '8',
  chapterTitleKo: '제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)',
  sectionNumber: '8.1',
  sectionTitle: 'Sampling Theory',
  sectionTitleKo: '8.1 샘플링 이론과 앨리어싱 (Sampling Theory)',
  originalUrl: 'https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory.html',
  prevSection: {
    id: 'ch07-03',
    title: '7.3 BVH(계층적 바운딩 볼륨) 트리 구조',
  },
  nextSection: {
    id: 'ch08-02',
    title: '8.2 샘플링과 수치 적분 (Sampling and Integration)',
  },
  summary: {
    keyTakeaways: [
      '렌더러의 최종 출력물은 이산적인 2D 픽셀 격자이지만, 장면에서 필름 평면으로 들어오는 입사 방사휘도(Radiance)는 시공간에 걸쳐 연속적인 아날로그 함수입니다.',
      '푸리에 변환(Fourier Transform)은 공간 영역(Spatial Domain)의 신호를 주파수 성분(Frequency Domain)으로 분해하여, 어떤 주파수 성분이 신호에 포함되어 있는지를 수학적으로 분석합니다.',
      '공간 영역에서의 이상적인 샘플링은 신호에 디락 델타 빗(Shah / Comb 함수 III)을 곱하는 것이며, 이는 주파수 영역에서 신호의 스펙트럼이 무한히 주기적으로 복제되는 합성곱(Convolution) 결과를 낳습니다.',
      '신호가 어떤 주파수보다 높은 성분을 갖지 않는 대역 제한 신호이고 이상적인 규칙적 샘플링과 복원을 가정할 때, 샘플링 주파수를 최고 주파수의 2배보다 높게 잡으면($f_s > 2f_{\\max}$) 복원이 가능합니다. 경계값에 정확히 맞추면 위상 등에 따라 정보가 사라질 수 있으므로, 초보 단계에서는 엄격한 부등식과 대역 제한 조건을 함께 기억하세요.',
      '샘플링 레이트가 나이퀴스트 기준에 미달하면 복제된 스펙트럼들이 서로 겹쳐(Overlap) 고주파 신호가 가짜 저주파 신호로 둔갑하는 앨리어싱(Aliasing, 모아레 현상)이 발생합니다.',
      '날카로운 경계에는 높은 주파수 성분이 있어 유한한 점 표본만으로 정확한 복원이 어렵습니다. 적절한 필터링과 표본 배치로 오차를 줄여야 합니다. 독립적인 무작위 표본은 규칙적인 무늬를 덜 드러나게 할 수 있지만 자동으로 청색 잡음이 되지는 않습니다. 청색 잡음은 낮은 주파수의 오차 성분을 억제하도록 표본 사이의 관계를 설계한 경우와 구분해 배웁니다.'
    ],
    prerequisites: [
      '고교 수학: 삼각함수, 오일러 공식 ($e^{i\\theta} = \\cos\\theta + i\\sin\\theta$)',
      '미적분학: 이상적분(Improper Integral), 합성곱(Convolution)',
      '4장 방사측정학: 필름 평면의 복사조도(Irradiance)와 센서 응답. 여기서 복사조도의 단위는 W/m²이며 시각 감도를 반영한 조도(lx)와 다릅니다.'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.1.1 주파수 영역(Frequency Domain)과 푸리에 변환',
      titleEn: '8.1.1 The Frequency Domain and the Fourier Transform'
    },
    {
      type: 'paragraph',
      textKo: '렌더링을 진행할 때 카메라 센서나 필름의 각 픽셀은 연속적인 빛의 분포를 이산적인 단 하나의 색상 값으로 축약합니다. 만약 체커보드 패턴이나 가느다란 블라인드 창살이 카메라에서 멀어져 픽셀 크기보다 훨씬 촘촘해지면, 화면에는 기괴한 물결무늬(모아레 패턴, Moiré Pattern)나 자글자글 튀는 계단 현상(Jaggies)이 발생합니다. 이 현상을 컴퓨터 과학에서는 앨리어싱(Aliasing)이라고 부릅니다.',
      textEn: 'Although the output of a renderer is a 2D grid of pixels, the incoming radiance is a continuous function. When continuous functions change faster than the sampling rate, artifacts such as moiré patterns and jaggies appear, which is known as aliasing.'
    },
    {
      type: 'paragraph',
      textKo: '앨리어싱의 수학적 본질을 이해하려면 프랑스의 수학자 조제프 푸리에(Joseph Fourier)가 창시한 푸리에 변환(Fourier Transform)을 살펴보아야 합니다. 푸리에 변환은 공간이나 시간에 따라 변하는 임의의 함수 $f(x)$를 다양한 주파수와 위상을 가진 사인(Sine) 및 코사인(Cosine) 파동들의 합으로 완벽하게 분해합니다.',
      textEn: 'To analyze aliasing rigorously, we use the Fourier transform, which represents a spatial or temporal function f(x) as a weighted sum of sines and cosines across all frequencies.'
    },
    {
      type: 'figure',
      id: 'fig-08-01',
      number: 'Figure 8.1',
      title: 'A simple spatial signal and its decomposition into sine waves',
      titleKo: '공간 영역 신호와 푸리에 사인파 성분들의 분해',
      src: '/books/pbrt-4ed/images/pha08f01.svg',
      captionKo: '그림 8.1: 복잡한 1차원 신호(맨 위)는 서로 다른 진폭과 주파수를 가진 순수 정현파(Sine waves)들의 선형 결합으로 정확하게 분해될 수 있습니다. 각 파동의 진동수가 높을수록 신호의 급격한 변화(에지, 세부 디테일)를 나타냅니다.',
      captionEn: 'Figure 8.1: A spatial signal can be decomposed into an infinite sum of sinusoidal basis functions of varying frequencies and amplitudes.'
    },
    {
      type: 'paragraph',
      textKo: '1차원 공간 함수 $f(x)$에 대한 연속 푸리에 변환 $F(\\omega)$와 그 역변환(Inverse Fourier Transform)은 다음과 같이 정의됩니다:',
      textEn: 'The continuous 1D Fourier transform F(omega) and its inverse are defined as follows:'
    },
    {
      type: 'equation',
      tex: 'F(\\omega) = \\int_{-\\infty}^{\\infty} f(x) e^{-i 2\\pi \\omega x} dx',
      explanationKo: '푸리에 변환 공식: 공간 함수 $f(x)$에 복소 지수 함수 $e^{-i 2\\pi \\omega x}$를 곱해 전체 공간에 대해 적분합니다. 여기서 $\\omega$는 주파수(단위 거리당 진동 횟수, cycles/unit)입니다.'
    },
    {
      type: 'equation',
      tex: 'f(x) = \\int_{-\\infty}^{\\infty} F(\\omega) e^{i 2\\pi \\omega x} d\\omega',
      explanationKo: '푸리에 역변환 공식: 주파수 영역의 스펙트럼 $F(\\omega)$에 기저 파동 $e^{i 2\\pi \\omega x}$를 곱해 적분하면 본래의 공간 신호 $f(x)$가 한 치의 오차도 없이 완벽하게 복원됩니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-02',
      number: 'Figure 8.2',
      title: 'Fourier transform of a box function is a sinc function',
      titleKo: '상자 함수(Box function)의 푸리에 변환: 싱크 함수(Sinc function)',
      src: '/books/pbrt-4ed/images/pha08f02.svg',
      captionKo: '그림 8.2: 공간 영역에서 직사각형 모양을 갖는 상자 함수(Box function, 왼쪽)를 푸리에 변환하면, 주파수 영역에서는 중앙에 거대한 로브(Main Lobe)가 있고 양옆으로 파도가 치는 싱크 함수($\\text{sinc}(x) = \\frac{\\sin(\\pi x)}{\\pi x}$, 오른쪽)가 나타납니다. 상자의 날카로운 모서리를 표현하기 위해 무한히 높은 고주파 진동이 끝없이 이어집니다.',
      captionEn: 'Figure 8.2: The Fourier transform of a spatial box function is a sinc function, exhibiting infinite frequency lobes required to represent the sharp discontinuities.'
    },
    {
      type: 'figure',
      id: 'fig-08-03',
      number: 'Figure 8.3',
      title: 'Fourier transform pairs: Gaussian and Triangle functions',
      titleKo: '대표적인 푸리에 변환 쌍: 가우시안과 삼각 함수',
      src: '/books/pbrt-4ed/images/pha08f03.svg',
      captionKo: '그림 8.3: 가우시안 함수(Gaussian)는 푸리에 변환을 해도 똑같이 가우시안 형태를 유지합니다(가우시안의 우아한 자기유사성). 공간에서 폭이 좁은 뾰족한 가우시안은 주파수 영역에서는 매우 넓게 퍼지며, 반대로 공간에서 완만한 가우시안은 주파수 영역에서 좁게 압축됩니다.',
      captionEn: 'Figure 8.3: The Fourier transform of a Gaussian function is another Gaussian, demonstrating the inverse relationship between spatial extent and frequency bandwidth.'
    },
    {
      type: 'figure',
      id: 'fig-08-04',
      number: 'Figure 8.4',
      title: 'Spatial dilation versus frequency contraction',
      titleKo: '공간 영역 확장과 주파수 영역 압축의 상반 관계',
      src: '/books/pbrt-4ed/images/pha08f04.svg',
      captionKo: '그림 8.4: 공간 영역에서 신호가 가로로 2배 넓어지면($f(x/2)$), 주파수 영역에서는 주파수가 절반으로 줄어들어 중심 쪽으로 2배 압축됩니다. 반대로 물체의 경계선이 아주 칼처럼 날카로워지면 주파수 영역에서는 무한대까지 스펙트럼이 폭발적으로 확장됩니다.',
      captionEn: 'Figure 8.4: Scaling a function in the spatial domain by a factor scales its frequency representation by the reciprocal.'
    },
    {
      type: 'figure',
      id: 'fig-08-05',
      number: 'Figure 8.5',
      title: '2D Fourier transform example on an image',
      titleKo: '2차원 이미지와 2차원 푸리에 주파수 스펙트럼',
      src: '/books/pbrt-4ed/images/pha08f05.svg',
      captionKo: '그림 8.5: 2차원 이미지(왼쪽)의 푸리에 스펙트럼(오른쪽)입니다. 중앙의 밝은 점은 이미지의 평균 밝기(직류 성분, DC component)이며, 중심에서 멀어질수록 고주파(대비가 강한 에지, 질감)를 나타냅니다.',
      captionEn: 'Figure 8.5: A 2D image and its corresponding magnitude spectrum in the frequency domain.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.1.2 이상적인 샘플링과 샤(Shah) 함수',
      titleEn: '8.1.2 Ideal Sampling and the Shah Function'
    },
    {
      type: 'paragraph',
      textKo: '수학적으로 "연속적인 함수에서 일정한 간격 $T$마다 점을 콕콕 찍어 샘플을 추출한다"는 행위는 어떻게 표현할 수 있을까요? 이를 위해 물리학과 신호 처리 분야에서는 디락 델타 함수(Dirac Delta Function, $\\delta(x)$)들이 빗(Comb)처럼 무한히 늘어선 샤 함수(Shah Function, 기호 $\\text{III}$)를 사용합니다.',
      textEn: 'Mathematically, sampling a continuous signal at regular intervals T can be modeled by multiplying the signal with a train of Dirac delta functions, called the Shah or comb function III_T(x).'
    },
    {
      type: 'figure',
      id: 'fig-08-06',
      number: 'Figure 8.6',
      title: 'The Shah function (Dirac comb) with period T',
      titleKo: '주기 $T$를 갖는 샤(Shah) 함수 (디락 빗, Dirac Comb)',
      src: '/books/pbrt-4ed/images/pha08f06.svg',
      captionKo: '그림 8.6: 샤 함수 $\\text{III}_T(x) = \\sum_{n=-\infty}^\\infty \\delta(x - nT)$는 간격 $T$마다 무한대의 높이와 면적 1을 갖는 임펄스(Impulse) 스파이크가 솟아 있는 형태입니다.',
      captionEn: 'Figure 8.6: The Shah function III_T(x) is an infinite sequence of equally spaced Dirac delta impulses separated by interval T.'
    },
    {
      type: 'paragraph',
      textKo: '연속 신호 $f(x)$에 샤 함수 $\\text{III}_T(x)$를 곱하면, $nT$ 지점이 아닌 모든 곳의 값은 0이 되고 오직 $nT$ 위치에서의 함숫값 $f(nT)$만 남는 이산 샘플 열이 완성됩니다:',
      textEn: 'Multiplying f(x) by III_T(x) yields the ideally sampled signal:'
    },
    {
      type: 'equation',
      tex: 'f_s(x) = f(x) \\cdot \\text{III}_T(x) = \\sum_{n=-\\infty}^{\\infty} f(nT) \\delta(x - nT)',
      explanationKo: '이상적인 샘플링 모델: 연속 신호 $f(x)$와 샤 함수의 곱셈으로 표현된 샘플링 결과입니다.'
    },
    {
      type: 'paragraph',
      textKo: '신호 처리의 가장 위대한 발견 중 하나인 합성곱 정리(Convolution Theorem)에 따르면, **공간 영역에서의 두 함수의 곱셈은 주파수 영역에서 두 함수의 푸리에 변환의 합성곱(Convolution)과 일치**합니다. 놀랍게도 샤 함수의 푸리에 변환은 또 다른 샤 함수입니다:',
      textEn: 'By the convolution theorem, multiplication in the spatial domain corresponds to convolution in the frequency domain. The Fourier transform of a Shah function III_T(x) is another Shah function with spacing 1/T:'
    },
    {
      type: 'equation',
      tex: '\\mathcal{F}\\{\\text{III}_T(x)\\} = \\frac{1}{T} \\text{III}_{1/T}(\\omega) = \\frac{1}{T} \\sum_{k=-\\infty}^{\\infty} \\delta\\left(\\omega - \\frac{k}{T}\\right)',
      explanationKo: '샤 함수의 푸리에 변환: 주기 $T$인 샤 함수를 주파수 변환하면, 주파수 간격이 $1/T$인 새로운 샤 함수가 됩니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-07',
      number: 'Figure 7.7 in Ch8',
      title: 'Convolution of spectra: periodic replication of the signal spectrum',
      titleKo: '스펙트럼의 합성곱: 주파수 스펙트럼의 무한 주기 복제',
      src: '/books/pbrt-4ed/images/pha08f07.svg',
      captionKo: '그림 8.7: 원본 신호의 스펙트럼 $F(\\omega)$가 간격 $1/T$의 샤 함수와 합성곱되면서, 주파수 축을 따라 $1/T$ 간격마다 $F(\\omega)$의 쌍둥이 복제본들이 무한히 반복되어 찍혀 나옵니다.',
      captionEn: 'Figure 8.7: Convolving the original spectrum F(omega) with the frequency Shah function produces infinitely repeated copies spaced by 1/T.'
    },
    {
      type: 'figure',
      id: 'fig-08-08',
      number: 'Figure 8.8',
      title: 'Ideal reconstruction using a box filter in frequency domain (sinc in space)',
      titleKo: '주파수 영역 상자 필터를 통한 이상적 신호 복원 (공간의 싱크 필터)',
      src: '/books/pbrt-4ed/images/pha08f08.svg',
      captionKo: '그림 8.8: 샘플링된 신호에서 원본을 복원하려면, 주파수 영역에서 중앙의 원본 스펙트럼 하나만 남기고 양옆으로 복제된 스펙트럼들을 싹둑 잘라내는 저주파 통과 필터(Low-pass filter, 상자 필터)를 곱해주면 됩니다. 주파수 영역의 상자 필터는 공간 영역에서는 싱크(Sinc) 필터에 해당합니다.',
      captionEn: 'Figure 8.8: Multiplying the replicated spectrum by an ideal low-pass box filter isolates the central spectrum, exactly reconstructing the original continuous function.'
    },
    {
      type: 'figure',
      id: 'fig-08-09',
      number: 'Figure 8.9',
      title: 'Spatial domain sinc interpolation reconstructing continuous curve',
      titleKo: '공간 영역 싱크 보간을 통한 연속 곡선의 완벽한 복원',
      src: '/books/pbrt-4ed/images/pha08f09.svg',
      captionKo: '그림 8.9: 각 샘플 지점마다 싱크 함수를 배치하고 이들을 모두 더하면(Sinc Interpolation), 놀랍게도 샘플들 사이의 부드러운 연속 곡선이 오차 없이 100% 되살아납니다.',
      captionEn: 'Figure 8.9: Summing sinc functions centered at each sample point perfectly reconstructs the original band-limited continuous curve.'
    },
    {
      type: 'figure',
      id: 'fig-08-10',
      number: 'Figure 8.10',
      title: 'Imperfect reconstruction with non-ideal filters',
      titleKo: '비이상적인 필터(삼각, 가우시안)로 복원할 때의 근사 오차',
      src: '/books/pbrt-4ed/images/pha08f10.svg',
      captionKo: '그림 8.10: 무한히 넓은 지지대를 갖는 싱크 필터 대신 좁은 삼각 필터나 가우시안 필터를 사용하면 복제된 스펙트럼의 일부 잔재가 누출되거나 고주파가 깎여 블러링(Blurring)이 발생합니다.',
      captionEn: 'Figure 8.10: Using practical finite-support filters leads to either slight blurring or post-aliasing leakage.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.1.3 나이퀴스트-섀넌 정리와 앨리어싱(Aliasing)',
      titleEn: '8.1.3 The Nyquist-Shannon Theorem and Aliasing'
    },
    {
      type: 'paragraph',
      textKo: '여기서 결정적인 질문이 생깁니다: "과연 언제나 샘플들로부터 원본 신호를 100% 완벽하게 복원할 수 있을까?" 이에 대한 해답을 제시한 것이 바로 디지털 통신의 아버지 클로드 섀넌(Claude Shannon)과 해리 나이퀴스트(Harry Nyquist)의 **나이퀴스트-섀넌 샘플링 정리**입니다.',
      textEn: 'Can any signal always be reconstructed perfectly from discrete samples? The Nyquist-Shannon sampling theorem provides the definitive criterion.'
    },
    {
      type: 'figure',
      id: 'fig-08-11',
      number: 'Figure 8.11',
      title: 'Spectral overlap when sampling frequency is below the Nyquist rate',
      titleKo: '나이퀴스트 주기보다 느리게 샘플링했을 때의 스펙트럼 겹침(Aliasing)',
      src: '/books/pbrt-4ed/images/pha08f11.svg',
      captionKo: '그림 8.11: 만약 샘플링 간격 $T$가 너무 넓으면, 주파수 축에서 복제본 간격 $1/T$가 좁아져 이웃한 스펙트럼들이 서로 침범하여 겹쳐버립니다(Overlap). 이때 겹쳐진 고주파 에너지는 저주파 영역으로 뚫고 들어와 복원 필터로도 절대 분리할 수 없는 가짜 저주파 신호(Alias)로 변질됩니다.',
      captionEn: 'Figure 8.11: When sampling below the Nyquist rate, adjacent spectral copies overlap. High frequencies disguise themselves as spurious low frequencies (aliasing).'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '나이퀴스트-섀넌 정리: CD 음질이 왜 하필 44.1kHz일까?',
      summary: '우리가 듣는 음악 CD 음질(44.1kHz)과 컴퓨터 그래픽스 안티앨리어싱의 수학 원리는 100% 동일합니다!',
      points: [
        {
          title: '인간의 가청 주파수 한계 (20kHz)',
          content: '인간의 귀는 공기의 진동수가 20,000Hz (20kHz)를 넘어가면 전혀 들을 수 없습니다. 즉 인간이 들을 수 있는 소리의 최대 주파수 f_max는 20kHz입니다.'
        },
        {
          title: '나이퀴스트 공식: f_s >= 2 * f_max',
          content: '소리를 디지털로 샘플링할 때 왜곡(앨리어싱) 없이 저장하려면 최소 2배인 40kHz 이상으로 초당 샘플을 채취해야 합니다. 여기에 오디오 아날로그 필터의 완만한 감쇠 여유 마진(10%)을 더해 탄생한 전 세계 표준이 바로 44,100Hz (44.1kHz)입니다!'
        },
        {
          title: '컴퓨터 그래픽스의 비극: 무한대 주파수',
          content: '오디오는 마이크에 저주파 통과 아날로그 필터를 달아 20kHz 이상을 잘라낼 수 있습니다. 하지만 3D 그래픽스에서는 구나 삼각형이 허공과 만나는 날카로운 윤곽선(Silhouette)이 수학적으로 무한대의 주파수(f_max = ∞)를 갖습니다! 따라서 아무리 픽셀을 촘촘히 쪼개도 나이퀴스트 조건을 완벽히 만족하는 것은 원천적으로 불가능합니다.'
        }
      ],
      tags: ['나이퀴스트', '섀넌정리', '푸리에변환', 'CD음질', '앨리어싱']
    },
    {
      type: 'figure',
      id: 'fig-08-12',
      number: 'Figure 8.12',
      title: 'High frequency sine wave sampled below Nyquist frequency appears as lower frequency',
      titleKo: '고주파 사인파를 엉성하게 샘플링하면 전혀 엉뚱한 저주파 파동으로 둔갑',
      src: '/books/pbrt-4ed/images/pha08f12.svg',
      captionKo: '그림 8.12: 파란색의 빠른 진동(고주파 신호)을 나이퀴스트 주기보다 느리게 샘플링하면(빨간 점들), 점들을 이었을 때 전혀 엉뚱한 완만한 파도(빨간 점선, 가짜 저주파 파동)가 그려집니다. 영화에서 빠르게 회전하는 마차 바퀴나 헬리콥터 프로펠러가 거꾸로 천천히 도는 것처럼 보이는 왜건 휠 효과(Wagon-wheel effect)가 대표적인 앨리어싱입니다.',
      captionEn: 'Figure 8.12: Sampling a high-frequency sine wave too sparsely produces sample values identical to those from a completely different lower-frequency wave.'
    },
    {
      type: 'figure',
      id: 'fig-08-13',
      number: 'Figure 8.13',
      title: 'Moiré fringes on a high frequency zone plate test pattern',
      titleKo: '동심원 존 플레이트(Zone Plate) 패턴에서 발생하는 모아레 무늬',
      src: '/books/pbrt-4ed/images/pha08f13.svg',
      captionKo: '그림 8.13: 중심에서 멀어질수록 줄무늬가 촘촘해지는 동심원 패턴을 균일한 픽셀로 렌더링하면, 외곽에서 나이퀴스트 한계를 넘어서면서 본래 존재하지 않는 복잡한 기하학적 간섭 무늬(Moiré fringes)가 화면을 뒤덮습니다.',
      captionEn: 'Figure 8.13: Aliasing on a concentric circular chirp pattern manifests as large-scale moiré rings.'
    },
    {
      type: 'figure',
      id: 'fig-08-14',
      number: 'Figure 8.14',
      title: 'Checkerboard rendering showing aliasing and antialiasing',
      titleKo: '지평선으로 멀어지는 체커보드 씬의 앨리어싱과 안티앨리어싱 비교',
      src: '/books/pbrt-4ed/images/pha08f14.svg',
      captionKo: '그림 8.14: (왼쪽) 픽셀당 1개의 광선만 규칙적으로 쏜 결과. 지평선 근처에서 격자가 뭉개져 끔찍한 모아레 물결이 발생합니다. (오른쪽) 픽셀당 여러 개의 샘플을 확률적으로 분산 배치하여 필터링한 안티앨리어싱 결과. 지평선이 부드러운 중성 회색(Neutral Gray)으로 수렴합니다.',
      captionEn: 'Figure 8.14: (Left) 1 sample per pixel exhibits severe moiré artifacts. (Right) Antialiased rendering correctly converges to smooth average tones near the horizon.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.1.4 안티앨리어싱의 비밀: 규칙적 왜곡을 무작위 노이즈로!',
      titleEn: '8.1.4 Antialiasing and the Power of Blue Noise'
    },
    {
      type: 'paragraph',
      textKo: '컴퓨터 그래픽스에서 물체의 경계면이 무한대의 주파수를 가지므로 앨리어싱을 100% 없애는 것은 불가능하다면, 현대 레이 트레이서는 이 문제를 어떻게 극복할까요? 해답은 바로 **"규칙성을 파괴하는 무작위성(Randomness)"**에 있습니다.',
      textEn: 'Since geometric discontinuities have infinite frequency bandwidth, perfect antialiasing is impossible. Instead, ray tracers replace structured moiré artifacts with high-frequency noise using stochastic sampling.'
    },
    {
      type: 'paragraph',
      textKo: '격자 모양으로 반듯하게 광선을 쏘면 인간의 뇌와 눈은 미세한 줄무늬와 모아레 패턴을 즉각적으로 포착하여 극심한 불쾌감을 느낍니다. 하지만 광선의 위치를 무작위로 지터링(Jittering)하여 흐트러뜨리면, 규칙적인 앨리어싱 패턴이 부드러운 고주파 노이즈(Noise)로 치환됩니다. 인간의 시각 시스템(HVS, Human Visual System)은 고주파 노이즈에 훨씬 관대하기 때문에 렌더링 품질이 극적으로 개선됩니다.',
      textEn: 'The human visual system is exquisitely sensitive to regular patterns but quite tolerant of high-frequency random noise. Stochastic sampling transforms aliasing into noise.'
    },
    {
      type: 'figure',
      id: 'fig-08-white-noise',
      number: 'Figure 8.15a',
      title: 'White Noise spectrum and spatial sample distribution',
      titleKo: '백색 잡음(White Noise)의 공간 분포와 평탄한 주파수 스펙트럼',
      src: '/books/pbrt-4ed/images/white-noise.png',
      captionKo: '그림 8.15a: 완전 무작위 난수로 샘플을 뽑는 백색 잡음(White Noise)입니다. 점들이 제멋대로 뭉쳐 덩어리(Clumping)가 생기고 빈 구멍이 발생합니다. 주파수 스펙트럼을 보면 저주파부터 고주파까지 모든 주파수 에너지가 균일하게 평탄하여, 이미지에 얼룩덜룩한 저주파 노이즈가 고스란히 남게 됩니다.',
      captionEn: 'Figure 8.15a: White noise samples exhibit clumping and gaps, resulting in a flat Fourier spectrum that includes objectionable low frequencies.'
    },
    {
      type: 'figure',
      id: 'fig-08-blue-noise',
      number: 'Figure 8.15b',
      title: 'Blue Noise spectrum showing low frequency void',
      titleKo: '청색 잡음(Blue Noise)의 푸아송 디스크 분포와 저주파 공백 스펙트럼',
      src: '/books/pbrt-4ed/images/blue-noise.png',
      captionKo: '그림 8.15b: 샘플들 사이에 최소 안전 거리를 보장하는 청색 잡음(Blue Noise / Poisson Disk)입니다. 점들이 매우 균일하면서도 규칙적인 줄무늬가 없습니다. 주파수 스펙트럼의 중심(저주파 영역)이 새까맣게 비어 있고(Low-frequency Void) 오직 고주파 영역에만 에너지가 집중되어 있어, 인간의 눈에는 노이즈가 거의 보이지 않는 마법 같은 시각 품질을 선사합니다.',
      captionEn: 'Figure 8.15b: Blue noise samples maintain minimum mutual distances. Its power spectrum exhibits a central dark hole with zero low-frequency energy, making noise nearly imperceptible to human eyes.'
    }
  ]
};
