import type { SectionContent } from '../../../../types/book';

export const CH08_03_SAMPLING_INTERFACE: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "8",
  "chapterTitleKo": "제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)",
  "sectionNumber": "8.3",
  "sectionTitle": "Sampling Interface",
  "sectionTitleKo": "8.3 샘플러 인터페이스 (Sampling Interface)",
  "originalUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Interface.html",
  "prevSection": {
    "id": "ch08-02",
    "title": "8.2 샘플링과 수치 적분"
  },
  "nextSection": {
    "id": "ch08-04",
    "title": "8.4 독립 랜덤 샘플러 (Independent Sampler)"
  },
  "summary": {
    "keyTakeaways": [
      "Sampler는 렌더링 파이프라인의 모든 확률적 결정(픽셀 위치, 피사계 심도 렌즈 위치, 모션 블러 시간, 재질 반사 방향, 광원 샘플링)에 필요한 고품질 난수 스트림을 공급하는 핵심 모듈입니다.",
      "각 픽셀 샘플은 단순히 2D 점 하나가 아니라, 수십 차원에 달하는 고차원 적분 공간의 한 점($[0, 1)^d$)을 나타내는 고차원 샘플 벡터(Sample Vector)입니다.",
      "Sampler 클래스는 `Get1D()`, `Get2D()`, `GetPixel2D()`, `StartPixelSample()` 등의 직관적인 메서드를 통해 차원별 샘플을 순차적으로 제공합니다.",
      "Sampler Clone(Allocator)은 별도의 상태를 가진 샘플러를 복제합니다. 복제의 목적과 시드·픽셀·차원에 따른 표본 배정은 구분합니다."
    ],
    "prerequisites": [
      "8장 8.2 몬테카를로 적분과 샘플링 패턴 평가",
      "5장 5.1 가상 카메라 모델과 픽셀 샘플링",
      "C++20: 가상 함수 다형성 vs 태그 디스패치(Tag Dispatch)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.3.1 Sampler의 역할과 고차원 샘플 벡터",
      "titleEn": "8.3.1 Role of the Sampler and High-Dimensional Sample Vectors",
      "id": "ch08-03-b1"
    },
    {
      "type": "paragraph",
      "textKo": "초보자들은 흔히 \"샘플러\"라고 하면 픽셀 사각형 안에서 광선이 뚫고 지나갈 2차원 좌표 $(x, y)$만 뽑아주는 도구라고 생각하기 쉽습니다. 그러나 실제 물리 기반 렌더러에서 샘플러가 해결해야 하는 문제는 훨씬 거대합니다. 카메라의 셔터가 열려 있는 시간($t$), 렌즈 조리개 위의 위치 $(u_l, v_l)$, 픽셀 필름 위치 $(u_p, v_p)$, 반사 재질의 산란 방향 $(u_s, v_s)$, 광원의 임의 위치 $(u_e, v_e)$, 빛의 파장($\\lambda$) 등 광선 하나를 추적하는 데 수십 개의 난수 차원이 필요합니다.",
      "textEn": "A Sampler in pbrt is responsible not just for generating 2D image coordinates, but for generating samples across a high-dimensional domain: camera shutter time, lens apertures, BSDF scattering, light sources, and spectral wavelengths.",
      "id": "ch08-03-b2"
    },
    {
      "type": "figure",
      "id": "fig-08-21",
      "number": "Figure 8.21",
      "title": "Original Figure 8.21",
      "titleKo": "원문 그림 8.21",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-21.png",
      "captionKo": "그림 8.21 · 영상 표본 하나는 고차원 점에 대응합니다. 첫 두 차원은 픽셀 내부 위치, 다음 차원들은 시간·렌즈 위치, 이후 차원들은 빛 전달의 확률적 선택에 쓰입니다.",
      "captionEn": "Figure 8.21: Samplers generate a d -dimensional sample point for each of the image samples taken to generate the final image. Here, the pixel left-parenthesis 3 comma 8 right-parenthesis is being sampled, and there are two image samples in the pixel area. The first two dimensions of the sample give the left-parenthesis x comma y right-parenthesis offset of the sample within the pixel, and the next three dimensions determine the time and lens position of the corresponding camera ray. Subsequent dimensions are used by the Monte Carlo light transport algorithms implemented in pbrt ’s Integrator s.",
      "width": 998,
      "height": 207,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Interface.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.3.2 Sampler 인터페이스와 태그 포인터",
      "titleEn": "8.3.2 The Sampler Abstract Base Class",
      "id": "ch08-03-b4"
    },
    {
      "type": "paragraph",
      "textKo": "PBRT 4판의 Sampler는 TaggedPointer로 여러 구체적인 샘플러를 감쌉니다. 가상 함수를 둔 추상 기본 클래스를 모든 샘플러가 상속하는 구조가 아닙니다. 아래는 첨부 원문에서 조각을 펼친 인터페이스이며, Clone은 새 시드가 아니라 Allocator를 받습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-03-b5"
    },
    {
      "type": "code",
      "chunkName": "<<Sampler Interface Definition>>=",
      "language": "cpp",
      "code": "class Sampler : public TaggedPointer<<<>>  IndependentSampler, StratifiedSampler, HaltonSampler, PaddedSobolSampler,\n        SobolSampler, ZSobolSampler, MLTSampler\n        > {\n  public:\n    <<>>        using TaggedPointer::TaggedPointer;\n\n       static Sampler Create(const std::string &name,\n                                   const ParameterDictionary &parameters,\n                                   Point2i fullResolution, const FileLoc *loc,\n                                   Allocator alloc);\n       int SamplesPerPixel() const;\n       void StartPixelSample(Point2i p, int sampleIndex, int dimension = 0);\n       Float Get1D();\n       Point2f Get2D();\n       Point2f GetPixel2D();\n       Sampler Clone(Allocator alloc = {});\n       std::string ToString() const;\n};",
      "explanationKo": "첨부 4판 인터페이스의 코드 조각입니다. Get1D와 Get2D는 다음 차원의 값을 얻고, StartPixelSample은 픽셀·표본 인덱스·시작 차원을 지정합니다. Clone(Allocator)은 구체적인 구현을 복제합니다.",
      "provenance": "source-excerpt",
      "id": "ch08-03-b6"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "공유 난수 상태와 스레드별 상태",
      "summary": "공유 난수 상태와 스레드별 상태",
      "points": [
        {
          "title": "핵심 설명",
          "content": "여러 스레드가 하나의 변경 가능한 난수 상태를 공유하면 동기화나 실행 순서의 영향을 고려해야 합니다. 별도 샘플러 상태를 쓰면 이 경합을 줄일 수 있습니다. 다만 전체 렌더러에서 모든 경합이 사라지거나 복제 자체가 통계적인 독립성을 보증하는 것은 아닙니다. 픽셀과 표본 인덱스에 대한 결정적인 표본 배정도 필요합니다."
        }
      ],
      "tags": [
        "멀티스레딩",
        "디자인패턴",
        "Clone",
        "난수생성",
        "동시성"
      ],
      "id": "ch08-03-b7"
    },
    {
      "type": "subheading",
      "id": "ch08-03-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch08-03-source-figure-8-20",
      "number": "Figure 8.20",
      "title": "Original Figure 8.20",
      "titleKo": "원문 그림 8.20",
      "src": "/books/pbrt-4ed/reviewed-images/figure-8-20.png",
      "captionKo": "그림 8.20 · 두 샘플러로 각각 8 spp를 사용한 장면입니다. 잘 설계된 표본 배치가 바닥 그림자와 광택 반사 등에서 더 좋은 결과를 냅니다. Killeroo 모델 제공: headus/Rezard.",
      "captionEn": "Figure 8.20: Scene rendered with (a) a relatively ineffective sampler and (b) a carefully designed sampler, using the same number of samples for each. The improvement in image quality, ranging from the shadow on the floor to the quality of the glossy reflections, is noticeable. Both images are rendered with 8 samples per pixel. (Killeroo model courtesy of headus/Rezard.)",
      "width": 998,
      "height": 1585,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Interface.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "4227998f8b9286bddcd61f10003eb7a5c5b8faa3c8e636e32eb71a8ae2c686dc",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "8.3 Sampling Interface"
    ],
    "sourceFigures": [
      "8.20",
      "8.21"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
