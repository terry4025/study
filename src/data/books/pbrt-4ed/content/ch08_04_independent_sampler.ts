import { SectionContent } from '../../../../types/book';

export const CH08_04_INDEPENDENT_SAMPLER: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '8',
  chapterTitleKo: '제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)',
  sectionNumber: '8.4',
  sectionTitle: 'Independent Sampler',
  sectionTitleKo: '8.4 독립 랜덤 샘플러 (Independent Sampler)',
  originalUrl: 'https://pbr-book.org/4ed/Sampling_and_Reconstruction/Independent_Sampler.html',
  prevSection: {
    id: 'ch08-03',
    title: '8.3 샘플러 인터페이스',
  },
  nextSection: {
    id: 'ch08-05',
    title: '8.5 계층화 샘플러 (Stratified Sampler)',
  },
  summary: {
    keyTakeaways: [
      'IndependentSampler(독립 랜덤 샘플러)는 각 샘플 차원을 서로 완전히 독립적인 의사난수(PRNG)로 생성하는 가장 단순하고 직관적인 샘플러입니다.',
      'pbrt-v4는 초경량이면서도 뛰어난 통계적 균일성을 자랑하는 PCG32 의사난수 생성기를 내부 엔진으로 채택했습니다.',
      '장점: 메모리 소비가 거의 없고, 차원의 수나 샘플 수에 어떠한 제약도 없으며, 통계적 비편향성(Unbiased)을 엄격하게 보장합니다.',
      '단점: 샘플들이 무작위로 뭉치거나(Clumping) 듬성듬성 비는 현상이 발생하여, 오차 수렴 속도가 $O(1/\\sqrt{N})$에 머물고 노이즈가 심합니다.'
    ],
    prerequisites: [
      '8장 8.3 Sampler 추상 인터페이스',
      '2장 2.1 몬테카를로 적분 기초와 독립 항등 분포(IID) 난수',
      '컴퓨터공학: 선형 합동 생성기(LCG)와 PCG 난수 알고리즘'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.4.1 IndependentSampler의 구현과 PCG32 난수 엔진',
      titleEn: '8.4.1 Implementation and the PCG32 Random Number Engine'
    },
    {
      type: 'paragraph',
      textKo: '`IndependentSampler`는 몬테카를로 적분의 교과서적인 정의를 그대로 구현한 클래스입니다. 이전 샘플이 어디에 찍혔는지, 다른 차원의 값이 무엇인지에 전혀 구애받지 않고, 매번 호출될 때마다 완전히 독립된 균일 난수(Uniform Random Number)를 추출합니다.',
      textEn: 'The IndependentSampler is the simplest sampler in pbrt. It generates each sample value independently of all others using a high-quality pseudo-random number generator.'
    },
    {
      type: 'paragraph',
      textKo: '과거 C 표준 라이브러리의 `rand()`나 단순한 선형 합동 생성기(LCG)는 고차원 공간에서 점들이 특정 평면에 줄지어 나타나는 격자 결함(Marsaglia Effect)이 있었습니다. 이를 극복하기 위해 pbrt-v4는 멜리사 오닐(Melissa O\'Neill) 교수가 개발한 **PCG32(Permuted Congruential Generator)** 난수 생성기를 탑재했습니다. PCG32는 64비트 내부 상태를 LCG로 갱신한 뒤 순열 치환(Permutation)을 적용하여, 암호학적 수준에 준하는 뛰어난 통계적 무작위성을 단 몇 줄의 비트 연산으로 달성합니다.',
      textEn: 'pbrt uses the PCG32 pseudo-random number generator, which combines a 64-bit linear congruential step with an output permutation function to provide exceptional statistical quality and fast execution.'
    },
    {
      type: 'code',
      chunkName: '<<IndependentSampler Class Definition>>=',
      language: 'cpp',
      code: `class IndependentSampler : public Sampler {
  public:
    IndependentSampler(int samplesPerPixel, uint64_t seed = 0)
        : samplesPerPixel(samplesPerPixel), rng(seed) {}

    int SamplesPerPixel() const override { return samplesPerPixel; }

    void StartPixelSample(Point2i pPixel, int sampleIndex, int dimension) override {
        // 픽셀 좌표와 샘플 인덱스를 해시하여 재현 가능한 독립 시드 설정
        uint64_t seed = Hash(pPixel, sampleIndex, seed);
        rng.SetSequence(seed);
    }

    Float Get1D() override { return rng.Uniform<Float>(); }
    Point2f Get2D() override { return {rng.Uniform<Float>(), rng.Uniform<Float>()}; }
    Point2f GetPixel2D() override { return Get2D(); }

    std::unique_ptr<Sampler> Clone(int seed) override {
        return std::make_unique<IndependentSampler>(samplesPerPixel, seed);
    }

  private:
    int samplesPerPixel;
    PCG32 rng;
};`,
      explanationKo: 'IndependentSampler의 전체 구현입니다. Get1D()와 Get2D()는 단순히 rng.Uniform<Float>()을 호출하여 [0, 1) 범위의 부동소수점을 반환합니다. 픽셀 좌표와 샘플 인덱스를 해시하여 시드를 설정하므로, 씬 전체를 언제 렌더링해도 결정론적으로 동일한 결과를 얻을 수 있습니다.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '의사난수(PRNG)의 결정론적 재현성(Reproducibility)',
      summary: '왜 게임과 렌더링 엔진에서는 진짜 우주 방사선 난수가 아닌 가짜 난수(의사난수)를 목숨 걸고 사용할까요?',
      points: [
        {
          title: '버그 재현과 디버깅의 생명선',
          content: '만약 렌더링할 때마다 하드웨어 진짜 난수(TRNG)를 쓴다면, 1,000만 번의 픽셀 중 딱 1개 픽셀에서 발생한 NaN 버그나 크래시를 개발자가 다시는 재현할 수 없습니다. 시드(Seed) 값만 같으면 100% 동일한 수열을 뿜어내는 의사난수가 필수입니다.'
        },
        {
          title: '타일 기반 병렬 렌더링의 독립성',
          content: '화면을 수천 개의 타일로 쪼개어 멀티스레드로 렌더링할 때, 어떤 스레드가 먼저 끝나더라도 픽셀 좌표 해시 시드를 사용하면 항상 동일한 렌더링 결과물이 나옵니다.'
        }
      ],
      tags: ['의사난수', 'PRNG', 'PCG32', '재현성', '디버깅']
    }
  ]
};
