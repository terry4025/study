import { SectionContent } from '../../../../types/book';

export const CH04_05_SPECTRAL_DISTRIBUTIONS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '4',
  chapterTitleKo: '제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)',
  sectionNumber: '4.5',
  sectionTitle: 'Representing Spectral Distributions',
  sectionTitleKo: '4.5 파장별 스펙트럼 표현과 C++ 설계 (Spectral Distributions)',
  originalUrl: 'https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Representing_Spectral_Distributions.html',
  prevSection: {
    id: 'ch04-04',
    title: '4.4 광원 방출 메커니즘과 흑체 복사',
  },
  nextSection: {
    id: 'ch04-06',
    title: '4.6 인간의 시각과 RGB/XYZ 색 공간',
  },
  summary: {
    keyTakeaways: [
      '현실 세계의 빛과 물질은 단순한 RGB 세 숫자가 아니라, 가시광선 파장($360\\text{ nm} \\sim 830\\text{ nm}$) 전반에 걸쳐 연속적으로 변화하는 복잡한 **분광 파워 분포(Spectral Power Distribution, SPD)**를 갖습니다.',
      'pbrt-v4는 전통적인 C++의 무거운 가상 함수(`virtual`) 대신, 고성능 **`TaggedPointer`**를 도입하여 CPU 캐시 미스와 간접 점프 오버헤드 없이 스펙트럼 다형성을 초고속으로 디스패치합니다.',
      '스펙트럼 표현 클래스는 상수 스펙트럼(`ConstantSpectrum`), 1nm 단위 조밀 배열(`DenselySampledSpectrum`), 구분적 선형 보간(`PiecewiseLinearSpectrum`), 흑체 복사(`BlackbodySpectrum`) 등으로 모듈화되어 있습니다.',
      '**히어로 파장 샘플링(Hero Wavelength Sampling)** 기법은 단 하나의 광선(Ray)을 따라 4개의 연관 파장을 묶어 동시에 추적함으로써, 프리즘 분산 효과를 노이즈 없이 완벽하게 시뮬레이션합니다.'
    ],
    prerequisites: [
      'C++ 템플릿 및 메모리 구조 (람다식, 포인터, 다형성)',
      '분광학 기초 (빛의 파장, 가시광선 대역 $360 \\sim 830\\text{ nm}$)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '4.5 스펙트럼 분포의 표현과 pbrt C++ 아키텍처',
      titleEn: '4.5 Representing Spectral Distributions'
    },
    {
      type: 'paragraph',
      textKo: '현실 세계에 존재하는 빛의 방출과 물질의 반사 스펙트럼은 매우 복잡하고 정교합니다. 앞서 살펴본 흑체 복사나 형광등의 불연속 방전 스펙트럼뿐만 아니라, 그림 4.16에서 볼 수 있는 노란 레몬 껍질의 반사율 곡선처럼 자연계의 물질들은 파장별로 매우 독특한 분광 반응을 나타냅니다. 따라서 물리 기반 렌더러가 이러한 스펙트럼을 오차 없이 다루려면 정밀하면서도 컴퓨터 메모리와 연산 속도 면에서 효율적인 스펙트럼 표현 체계를 갖추어야 합니다.',
      textEn: 'Spectral distributions in the real world can be complex; Figure 4.16 shows a graph of the spectral distribution of the reflectance of lemon skin. In order to render images of scenes that include a variety of complex spectra, a renderer must have efficient and accurate representations of spectral distributions.'
    },
    {
      type: 'figure',
      id: 'fig-4-16',
      number: 'Figure 4.16',
      captionKo: '그림 4.16: 레몬 껍질 표면의 파장별 반사율(SPD) 곡선. $400\\text{ nm} \\sim 500\\text{ nm}$(청색광) 대역은 거의 전부 흡수되어 반사율이 $10\\%$ 미만이지만, $550\\text{ nm}$ 이상(녹색 및 적색광)부터 반사율이 $70\\%$ 이상으로 치솟아 인간의 눈에 선명한 노란색으로 인지됩니다.',
      captionEn: 'Figure 4.16: Spectral distribution of the reflectance of lemon skin. It absorbs blue light strongly and reflects red and green, creating its yellow appearance.',
      title: '레몬 껍질 반사 스펙트럼',
      titleKo: '레몬 껍질 분광 반사율',
      src: '/books/pbrt-4ed/images/pha04f16.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: 'pbrt의 Spectrum 인터페이스와 TaggedPointer',
      titleEn: 'The Spectrum Interface'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt는 인간의 눈으로 감지할 수 있는 가시광선의 파장 범위를 나노미터($\\text{nm}$) 단위의 상수로 정의합니다: $\\lambda_{\\min} = 360\\text{ nm}$, $\\lambda_{\\max} = 830\\text{ nm}$.',
      textEn: 'We start by defining constants for the range of visible wavelengths in nanometers: $\\lambda_{\\min} = 360\\text{ nm}$, $\\lambda_{\\max} = 830\\text{ nm}$.'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt-v4에서는 다양한 형태의 스펙트럼 클래스들을 아우르는 최상위 인터페이스로 `Spectrum`을 제공합니다. 특히 눈여겨볼 점은 pbrt가 C++의 고전적인 순수 가상 함수(`virtual`) 대신 **`TaggedPointer`**라는 혁신적인 래퍼 구조체를 채택했다는 사실입니다:',
      textEn: 'Spectrum inherits from TaggedPointer, which handles the details of runtime polymorphism. TaggedPointer associates a unique integer identifier with each type, avoiding virtual function overhead.'
    },
    {
      type: 'code',
      chunkName: '<<Spectrum Interface>>=',
      language: 'cpp',
      code: `// util/spectrum.h 내의 Spectrum 인터페이스 선언
class Spectrum : public TaggedPointer<
    ConstantSpectrum,
    DenselySampledSpectrum,
    PiecewiseLinearSpectrum,
    RGBAlbedoSpectrum,
    RGBUnboundedSpectrum,
    RGBIlluminantSpectrum,
    BlackbodySpectrum> {
public:
    using TaggedPointer::TaggedPointer;

    // 특정 파장 lambda에서의 스펙트럼 함수값 반환
    PBRT_CPU_GPU
    Float operator()(Float lambda) const {
        auto op = [&](auto ptr) { return (*ptr)(lambda); };
        return Dispatch(op);
    }

    // 장면 광원 샘플링을 위한 최대값 상한 반환
    PBRT_CPU_GPU
    Float MaxValue() const {
        auto op = [&](auto ptr) { return ptr->MaxValue(); };
        return Dispatch(op);
    }
};`
    },
    {
      type: 'concept-tip',
      badge: '⚡ C++ 엔진 성능 비결',
      title: '⚡ 왜 pbrt는 C++ virtual 가상 함수 대신 TaggedPointer를 쓸까?',
      summary: '초당 수천만 번 호출되는 광선 추적 루프에서 가상 테이블(vtable)이 치명적인 이유',
      points: [
        {
          title: '가상 테이블(vtable)의 캐시 미스와 분기 예측 실패',
          content: '전통적인 C++의 `virtual` 함수는 객체 헤더의 vtable 포인터를 읽어 점프해야 합니다. 하지만 렌더러에서는 광선마다 재질과 스펙트럼 타입이 제각각이어서 CPU의 분기 예측기(Branch Predictor)가 번번이 빗나가고, L1 명령어 캐시 미스가 발생하여 심각한 성능 저하가 일어납니다.'
        },
        {
          title: 'TaggedPointer와 C++17 람다 컴파일러 인라인',
          content: '64비트 포인터의 미사용 상위 16비트에 4비트 정수 태그를 심어두고, `switch-case`로 직접 디스패치합니다. 컴파일러는 각 타입별 호출 코드를 완벽하게 **인라인(Inlining)** 확장할 수 있으며, GPU(CUDA/OptiX) 환경에서도 가상 테이블 없이 네이티브 기계어로 완벽하게 동작합니다.'
        }
      ],
      tags: ['TaggedPointer', 'C++ 성능 최적화', 'vtable 제거']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '다양한 스펙트럼 구현 클래스들',
      titleEn: 'Spectrum Implementations'
    },
    {
      type: 'concept-tip',
      badge: '📦 pbrt 스펙트럼 4대 구현체',
      title: '📦 pbrt-v4 핵심 스펙트럼 구현 클래스 4종 비교',
      summary: '상수, 1nm 조밀 샘플, 선형 보간, 흑체 복사 스펙트럼의 쓰임새',
      points: [
        {
          title: '1. ConstantSpectrum',
          content: '모든 파장에 대해 고정된 상수값(예: 반사율 0.0)을 반환하는 가장 단순한 스펙트럼입니다.'
        },
        {
          title: '2. DenselySampledSpectrum',
          content: '360nm ~ 830nm 범위를 1nm 간격으로 촘촘하게 471개의 Float 배열로 저장합니다. 계산 비용이 큰 복잡한 스펙트럼을 미리 계산해 두고 룩업 테이블로 초고속 조회할 때 사용됩니다.'
        },
        {
          title: '3. PiecewiseLinearSpectrum',
          content: '임의의 파장-반사율 샘플 쌍들 사이를 선형 보간(Linear Interpolation)하는 가장 실용적이고 유연한 스펙트럼 표현입니다.'
        },
        {
          title: '4. BlackbodySpectrum',
          content: '온도 T를 받아 플랑크 법칙 공식을 즉석에서 해석적으로 계산하는 고정밀 흑체 스펙트럼입니다.'
        }
      ],
      tags: ['스펙트럼구현', '선형보간', '흑체스펙트럼']
    },
    {
      type: 'figure',
      id: 'fig-piecewise-linear',
      number: 'Figure (Linear)',
      captionKo: '그림: 구분적 선형 스펙트럼(PiecewiseLinearSpectrum)의 보간 원리. 불규칙한 파장 샘플 데이터가 주어졌을 때, 이분 검색(Binary Search)으로 해당 구간을 찾아 두 점 사이를 직선으로 매끄럽게 연결하여 연속적인 분광값을 산출합니다.',
      captionEn: 'Figure: Piecewise linear spectral representation linearly interpolates between arbitrary wavelength samples.',
      title: '구분적 선형 스펙트럼',
      titleKo: '구분적 선형 스펙트럼',
      src: '/books/pbrt-4ed/images/piecewise-linear-spectrum.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '히어로 파장 샘플링 (Hero Wavelength Spectral Sampling)',
      titleEn: 'SampledSpectrum and SampledWavelengths'
    },
    {
      type: 'paragraph',
      textKo: '과거의 스펙트럼 렌더러들은 단일 파장만을 추적하여 엄청난 몬테카를로 노이즈에 시달리거나, 광선 하나마다 수십 개의 파장을 루프로 돌며 계산하여 렌더링 속도가 끔찍하게 느렸습니다. pbrt-v4는 이 문제를 해결하기 위해 현대 렌더링 연구의 금자탑인 **히어로 파장 샘플링(Hero Wavelength Sampling)** 기법을 전면 도입했습니다.',
      textEn: 'pbrt uses Hero Wavelength Sampling to efficiently evaluate spectral distributions. A single "hero" wavelength is chosen according to a sampling distribution, and secondary wavelengths are spaced uniformly from it.'
    },
    {
      type: 'figure',
      id: 'fig-4-17',
      number: 'Figure 4.17',
      captionKo: '그림 4.17: 히어로 파장 샘플링(Hero Wavelength Sampling)의 원리. 먼저 하나의 주 파장(Hero Wavelength $\\lambda_0$)을 무작위로 추출한 뒤, 나머지 보조 파장들($\\lambda_1, \\lambda_2, \\lambda_3$)을 가시광선 대역에 걸쳐 일정한 간격으로 회전 배치합니다. 이 4개의 파장은 최신 CPU의 128비트/256비트 SIMD(AVX) 벡터 레지스터에 담겨 단 1클록에 병렬 연산됩니다.',
      captionEn: 'Figure 4.17: Hero wavelength sampling: One primary wavelength is sampled, and additional wavelengths are deterministically spaced across the visible range, evaluated in parallel via SIMD.',
      title: '히어로 파장 샘플링',
      titleKo: '히어로 파장 샘플링',
      src: '/books/pbrt-4ed/images/pha04f17.svg',
    }
  ]
};
