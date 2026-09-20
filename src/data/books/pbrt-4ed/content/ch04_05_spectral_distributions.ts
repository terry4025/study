import type { SectionContent } from '../../../../types/book';

export const CH04_05_SPECTRAL_DISTRIBUTIONS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "4",
  "chapterTitleKo": "제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)",
  "sectionNumber": "4.5",
  "sectionTitle": "Representing Spectral Distributions",
  "sectionTitleKo": "4.5 파장별 스펙트럼 표현과 C++ 설계 (Spectral Distributions)",
  "originalUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Representing_Spectral_Distributions.html",
  "prevSection": {
    "id": "ch04-04",
    "title": "4.4 광원 방출 메커니즘과 흑체 복사"
  },
  "nextSection": {
    "id": "ch04-06",
    "title": "4.6 인간의 시각과 RGB/XYZ 색 공간"
  },
  "summary": {
    "keyTakeaways": [
      "현실 세계의 빛과 물질은 단순한 RGB 세 숫자가 아니라, 가시광선 파장($360\\text{ nm} \\sim 830\\text{ nm}$) 전반에 걸쳐 연속적으로 변화하는 복잡한 **분광 파워 분포(Spectral Power Distribution, SPD)**를 갖습니다.",
      "Spectrum은 TaggedPointer로 구체적인 스펙트럼 타입을 선택합니다. 정적 타입별 코드와 GPU 호환성에 이점이 있지만 분기·메모리 접근 비용이 없어지는 것은 아닙니다.",
      "스펙트럼 표현 클래스는 상수 스펙트럼(`ConstantSpectrum`), 1nm 단위 조밀 배열(`DenselySampledSpectrum`), 구분적 선형 보간(`PiecewiseLinearSpectrum`), 흑체 복사(`BlackbodySpectrum`) 등으로 모듈화되어 있습니다.",
      "기본 설정은 여러 파장 표본을 한 경로에서 함께 계산합니다. 파장에 따라 굴절 방향이 달라지면 주 파장만 남기고 선택 확률을 보정합니다. 유한 표본에는 여전히 노이즈가 있습니다."
    ],
    "prerequisites": [
      "C++ 템플릿 및 메모리 구조 (람다식, 포인터, 다형성)",
      "분광학 기초 (빛의 파장, 가시광선 대역 $360 \\sim 830\\text{ nm}$)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "4.5 스펙트럼 분포의 표현과 pbrt C++ 아키텍처",
      "titleEn": "4.5 Representing Spectral Distributions",
      "id": "ch04-05-b1"
    },
    {
      "type": "paragraph",
      "textKo": "현실 세계에 존재하는 빛의 방출과 물질의 반사 스펙트럼은 매우 복잡하고 정교합니다. 앞서 살펴본 흑체 복사나 형광등의 불연속 방전 스펙트럼뿐만 아니라, 그림 4.16에서 볼 수 있는 노란 레몬 껍질의 반사율 곡선처럼 자연계의 물질들은 파장별로 매우 독특한 분광 반응을 나타냅니다. 따라서 물리 기반 렌더러가 이러한 스펙트럼을 수치 오차와 표본 오차를 고려해 다루려면 정밀하면서도 컴퓨터 메모리와 연산 속도 면에서 효율적인 스펙트럼 표현 체계를 갖추어야 합니다.",
      "textEn": "Spectral distributions in the real world can be complex; Figure 4.16 shows a graph of the spectral distribution of the reflectance of lemon skin. In order to render images of scenes that include a variety of complex spectra, a renderer must have efficient and accurate representations of spectral distributions.",
      "id": "ch04-05-b2"
    },
    {
      "type": "figure",
      "id": "fig-4-16",
      "number": "Figure 4.16",
      "title": "Original Figure 4.16",
      "titleKo": "원문 그림 4.16",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-16.png",
      "captionKo": "그림 4.16 · 레몬 껍질의 파장별 반사 분포입니다. 눈에 보이는 하나의 색도 파장마다 서로 다른 반사율로 나타낼 수 있습니다.",
      "captionEn": "Figure 4.16: Spectral Distribution of Reflection from Lemon Skin.",
      "width": 998,
      "height": 337,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Representing_Spectral_Distributions.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "pbrt의 Spectrum 인터페이스와 TaggedPointer",
      "titleEn": "The Spectrum Interface",
      "id": "ch04-05-b4"
    },
    {
      "type": "paragraph",
      "textKo": "PBRT의 계산 범위는 360~830nm로 정해져 있습니다. 가시광의 경계를 모든 사람과 모든 관찰 조건에 대해 정확하게 이 범위라고 정의하는 것은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-05-b5"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt-v4에서는 다양한 형태의 스펙트럼 클래스들을 아우르는 최상위 인터페이스로 `Spectrum`을 제공합니다. 특히 눈여겨볼 점은 pbrt가 C++의 고전적인 순수 가상 함수(`virtual`) 대신 **`TaggedPointer`**라는 혁신적인 래퍼 구조체를 채택했다는 사실입니다:",
      "textEn": "Spectrum inherits from TaggedPointer, which handles the details of runtime polymorphism. TaggedPointer associates a unique integer identifier with each type, avoiding virtual function overhead.",
      "id": "ch04-05-b6"
    },
    {
      "type": "code",
      "chunkName": "<<Spectrum Interface>>=",
      "language": "cpp",
      "code": "// util/spectrum.h 내의 Spectrum 인터페이스 선언\nclass Spectrum : public TaggedPointer<\n    ConstantSpectrum,\n    DenselySampledSpectrum,\n    PiecewiseLinearSpectrum,\n    RGBAlbedoSpectrum,\n    RGBUnboundedSpectrum,\n    RGBIlluminantSpectrum,\n    BlackbodySpectrum> {\npublic:\n    using TaggedPointer::TaggedPointer;\n\n    // 특정 파장 lambda에서의 스펙트럼 함수값 반환\n    PBRT_CPU_GPU\n    Float operator()(Float lambda) const {\n        auto op = [&](auto ptr) { return (*ptr)(lambda); };\n        return Dispatch(op);\n    }\n\n    // 장면 광원 샘플링을 위한 최대값 상한 반환\n    PBRT_CPU_GPU\n    Float MaxValue() const {\n        auto op = [&](auto ptr) { return ptr->MaxValue(); };\n        return Dispatch(op);\n    }\n};",
      "provenance": "teaching",
      "id": "ch04-05-b7"
    },
    {
      "type": "concept-tip",
      "badge": "⚡ C++ 엔진 성능 비결",
      "title": "TaggedPointer도 비용이 있는 선택입니다",
      "summary": "TaggedPointer도 비용이 있는 선택입니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "타입 태그로 구체적인 스펙트럼 구현을 골라 호출합니다. 컴파일러가 각 경우를 인라인할 여지가 있고 GPU 코드와도 맞지만, 분기 예측 실패나 캐시 미스가 사라진다고 보장할 수 없습니다. 태그의 비트 수와 주소 표현은 실제 포인터 구현·플랫폼 조건을 확인합니다."
        }
      ],
      "tags": [
        "TaggedPointer",
        "C++ 성능 최적화",
        "vtable 제거"
      ],
      "id": "ch04-05-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "다양한 스펙트럼 구현 클래스들",
      "titleEn": "Spectrum Implementations",
      "id": "ch04-05-b9"
    },
    {
      "type": "concept-tip",
      "badge": "📦 pbrt 스펙트럼 4대 구현체",
      "title": "📦 pbrt-v4 핵심 스펙트럼 구현 클래스 4종 비교",
      "summary": "상수, 1nm 조밀 샘플, 선형 보간, 흑체 복사 스펙트럼의 쓰임새",
      "points": [
        {
          "title": "1. ConstantSpectrum",
          "content": "모든 파장에 대해 고정된 상수값(예: 반사율 0.0)을 반환하는 가장 단순한 스펙트럼입니다."
        },
        {
          "title": "2. DenselySampledSpectrum",
          "content": "360nm ~ 830nm 범위를 1nm 간격으로 촘촘하게 471개의 Float 배열로 저장합니다. 계산 비용이 큰 복잡한 스펙트럼을 미리 계산해 두고 룩업 테이블로 초고속 조회할 때 사용됩니다."
        },
        {
          "title": "3. PiecewiseLinearSpectrum",
          "content": "임의의 파장-반사율 샘플 쌍들 사이를 선형 보간(Linear Interpolation)하는 가장 실용적이고 유연한 스펙트럼 표현입니다."
        },
        {
          "title": "4. BlackbodySpectrum",
          "content": "온도 T를 받아 플랑크 법칙 공식을 즉석에서 해석적으로 계산하는 고정밀 흑체 스펙트럼입니다."
        }
      ],
      "tags": [
        "스펙트럼구현",
        "선형보간",
        "흑체스펙트럼"
      ],
      "id": "ch04-05-b10"
    },
    {
      "type": "paragraph",
      "id": "fig-piecewise-linear",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "히어로 파장 샘플링 (Hero Wavelength Spectral Sampling)",
      "titleEn": "SampledSpectrum and SampledWavelengths",
      "id": "ch04-05-b12"
    },
    {
      "type": "paragraph",
      "textKo": "파장 표본의 수를 늘리면 스펙트럼 적분의 분산을 줄일 수 있지만 각 경로의 연산 비용도 늘어납니다. PBRT의 기본 설정은 네 파장을 함께 계산하는 절충을 사용합니다. 굴절처럼 방향이 파장마다 달라지는 경우에는 보조 파장을 종료하고 주 파장으로 경로를 선택하며, 확률 보정을 해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-05-b13"
    },
    {
      "type": "figure",
      "id": "fig-4-17",
      "number": "Figure 4.17",
      "title": "Original Figure 4.17",
      "titleKo": "원문 그림 4.17",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-17.png",
      "captionKo": "그림 4.17 · PiecewiseLinearSpectrum은 파장과 값의 표본 쌍을 저장하고 그 사이를 직선으로 이어 연속적인 분포를 정의합니다.",
      "captionEn": "Figure 4.17: PiecewiseLinearSpectrum defines a spectral distribution using a set of sample values left-parenthesis lamda Subscript i Baseline comma v Subscript i Baseline right-parenthesis . A continuous distribution is then defined by linearly interpolating between them.",
      "width": 998,
      "height": 280,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Representing_Spectral_Distributions.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "074c75786c0d6c4d72516252d7797d3c0013409a8623977728d1a2d6805e36e7",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "4.5 Representing Spectral Distributions",
      "4.5.1  Spectrum Interface",
      "4.5.2  General Spectral Distributions",
      "4.5.3  Embedded Spectral Data",
      "4.5.4  Sampled Spectral Distributions",
      "SampledSpectrum",
      "SampledWavelengths",
      "Discussion"
    ],
    "sourceFigures": [
      "4.16",
      "4.17"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
