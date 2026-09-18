import { SectionContent } from '../../../../types/book';

export const CH08_03_SAMPLING_INTERFACE: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '8',
  chapterTitleKo: '제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)',
  sectionNumber: '8.3',
  sectionTitle: 'Sampling Interface',
  sectionTitleKo: '8.3 샘플러 인터페이스 (Sampling Interface)',
  originalUrl: 'https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Interface.html',
  prevSection: {
    id: 'ch08-02',
    title: '8.2 샘플링과 수치 적분',
  },
  nextSection: {
    id: 'ch08-04',
    title: '8.4 독립 랜덤 샘플러 (Independent Sampler)',
  },
  summary: {
    keyTakeaways: [
      'Sampler는 렌더링 파이프라인의 모든 확률적 결정(픽셀 위치, 피사계 심도 렌즈 위치, 모션 블러 시간, 재질 반사 방향, 광원 샘플링)에 필요한 고품질 난수 스트림을 공급하는 핵심 모듈입니다.',
      '각 픽셀 샘플은 단순히 2D 점 하나가 아니라, 수십 차원에 달하는 고차원 적분 공간의 한 점($[0, 1)^d$)을 나타내는 고차원 샘플 벡터(Sample Vector)입니다.',
      'Sampler 클래스는 `Get1D()`, `Get2D()`, `GetPixel2D()`, `StartPixelSample()` 등의 직관적인 메서드를 통해 차원별 샘플을 순차적으로 제공합니다.',
      '현대 멀티코어 렌더링을 위해 `Clone(seed)` 메서드를 제공하여, 각 작업 스레드가 락(Lock) 경합 없이 독립적인 샘플 스트림을 생성하도록 보장합니다.'
    ],
    prerequisites: [
      '8장 8.2 몬테카를로 적분과 샘플링 패턴 평가',
      '5장 5.1 가상 카메라 모델과 픽셀 샘플링',
      'C++20: 가상 함수 다형성 vs 태그 디스패치(Tag Dispatch)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.3.1 Sampler의 역할과 고차원 샘플 벡터',
      titleEn: '8.3.1 Role of the Sampler and High-Dimensional Sample Vectors'
    },
    {
      type: 'paragraph',
      textKo: '초보자들은 흔히 "샘플러"라고 하면 픽셀 사각형 안에서 광선이 뚫고 지나갈 2차원 좌표 $(x, y)$만 뽑아주는 도구라고 생각하기 쉽습니다. 그러나 실제 물리 기반 렌더러에서 샘플러가 해결해야 하는 문제는 훨씬 거대합니다. 카메라의 셔터가 열려 있는 시간($t$), 렌즈 조리개 위의 위치 $(u_l, v_l)$, 픽셀 필름 위치 $(u_p, v_p)$, 반사 재질의 산란 방향 $(u_s, v_s)$, 광원의 임의 위치 $(u_e, v_e)$, 빛의 파장($\\lambda$) 등 광선 하나를 추적하는 데 수십 개의 난수 차원이 필요합니다.',
      textEn: 'A Sampler in pbrt is responsible not just for generating 2D image coordinates, but for generating samples across a high-dimensional domain: camera shutter time, lens apertures, BSDF scattering, light sources, and spectral wavelengths.'
    },
    {
      type: 'figure',
      id: 'fig-08-21',
      number: 'Figure 8.21',
      title: 'High-dimensional sample space for rendering a single pixel',
      titleKo: '단일 픽셀을 렌더링하기 위한 고차원 샘플 벡터 공간의 구조',
      src: '/books/pbrt-4ed/images/pha08f21.svg',
      captionKo: '그림 8.21: 픽셀당 $N$개의 샘플이 있을 때, 각 샘플은 수십 개의 차원($d_1, d_2, \\dots, d_m$)으로 이루어진 거대한 행렬을 형성합니다. 좋은 샘플러는 첫 번째 차원(픽셀 위치)뿐만 아니라, 모든 차원 간의 2D 프로젝션에서도 샘플들이 뭉치지 않고 고르게 분포하도록 설계되어야 합니다.',
      captionEn: 'Figure 8.21: The array of sample values for a single pixel. Each pixel sample is a high-dimensional vector whose components determine time, lens, position, reflection, and illumination.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.3.2 Sampler 추상 기본 클래스 설계',
      titleEn: '8.3.2 The Sampler Abstract Base Class'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt 제4판의 `Sampler` 클래스는 C++20 기반으로 설계되어 다양한 샘플링 알고리즘(독립 난수, 계층화, 할튼, 소볼 등)을 단일한 인터페이스로 캡슐화합니다:',
      textEn: 'The Sampler base class defines the unified interface across all sampling algorithms in pbrt:'
    },
    {
      type: 'code',
      chunkName: '<<Sampler Interface Definition>>=',
      language: 'cpp',
      code: `class Sampler {
  public:
    virtual ~Sampler() = default;

    // 픽셀당 샘플 개수 반환
    virtual int SamplesPerPixel() const = 0;

    // 특정 픽셀의 n번째 샘플 생성 준비
    virtual void StartPixelSample(Point2i pPixel, int sampleIndex, int dimension = 0) = 0;

    // 1차원 균일 난수 [0, 1) 획득
    virtual Float Get1D() = 0;

    // 2차원 균일 난수 [0, 1)^2 획득 (렌즈, 반사 방향 등)
    virtual Point2f Get2D() = 0;

    // 픽셀 영역 내부의 서브픽셀 샘플 위치 획득
    virtual Point2f GetPixel2D() = 0;

    // 스레드별 독립 복제본 생성
    virtual std::unique_ptr<Sampler> Clone(int seed) = 0;
};`,
      explanationKo: 'Sampler의 핵심 인터페이스입니다. StartPixelSample()로 특정 픽셀의 샘플 인덱스를 지정한 후, Get1D()와 Get2D()를 연이어 호출하면 자동으로 다음 차원의 난수들이 차례대로 공급됩니다. Clone()은 멀티스레드 렌더링 시 스레드 간 락 경합 없이 복제본을 생성합니다.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '멀티스레딩과 Clone(seed) 패턴의 중요성',
      summary: '수십 개의 CPU 코어가 동시에 렌더링할 때 난수 생성기를 어떻게 다루어야 할까요?',
      points: [
        {
          title: '글로벌 싱글톤 PRNG의 끔찍한 락 경합',
          content: '만약 모든 스레드가 단 하나의 전역 rand() 함수나 뮤텍스로 보호된 샘플러를 공유한다면, 초당 수억 번의 락 획득 시도로 인해 CPU 코어가 100개라도 1개 코어 수준으로 속도가 추락합니다.'
        },
        {
          title: 'Clone(seed)을 통한 완벽한 스레드 격리',
          content: 'pbrt는 렌더링 시작 시 메인 샘플러에서 스레드 개수만큼 독립된 Sampler 복제본을 Clone()하여 스레드 로컬 메모리에 넘깁니다. 각 스레드는 락이 전혀 없는 100% 무경합 상태로 최고 속도로 실행됩니다.'
        }
      ],
      tags: ['멀티스레딩', '디자인패턴', 'Clone', '난수생성', '동시성']
    }
  ]
};
