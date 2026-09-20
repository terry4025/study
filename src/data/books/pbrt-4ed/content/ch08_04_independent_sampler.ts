import type { SectionContent } from '../../../../types/book';

export const CH08_04_INDEPENDENT_SAMPLER: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "8",
  "chapterTitleKo": "제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)",
  "sectionNumber": "8.4",
  "sectionTitle": "Independent Sampler",
  "sectionTitleKo": "8.4 독립 랜덤 샘플러 (Independent Sampler)",
  "originalUrl": "https://pbr-book.org/4ed/Sampling_and_Reconstruction/Independent_Sampler.html",
  "prevSection": {
    "id": "ch08-03",
    "title": "8.3 샘플러 인터페이스"
  },
  "nextSection": {
    "id": "ch08-05",
    "title": "8.5 계층화 샘플러 (Stratified Sampler)"
  },
  "summary": {
    "keyTakeaways": [
      "IndependentSampler는 독립 균일 표본이라는 수학적 모델을 의사난수 생성기로 근사하는 단순한 샘플러입니다.",
      "pbrt-v4는 초경량이면서도 뛰어난 통계적 균일성을 자랑하는 PCG32 의사난수 생성기를 내부 엔진으로 채택했습니다.",
      "별도의 층화 표를 저장하지 않아 상태가 작고 다양한 차원에서 사용할 수 있습니다. 유한 정밀도·생성기 주기·인덱스 범위는 존재하며, 이론적인 독립 표본과 완전히 같지는 않습니다.",
      "단점: 샘플들이 무작위로 뭉치거나(Clumping) 듬성듬성 비는 현상이 발생하여, 오차 수렴 속도가 $O(1/\\sqrt{N})$에 머물고 노이즈가 심합니다."
    ],
    "prerequisites": [
      "8장 8.3 Sampler 추상 인터페이스",
      "2장 2.1 몬테카를로 적분 기초와 독립 항등 분포(IID) 난수",
      "컴퓨터공학: 선형 합동 생성기(LCG)와 PCG 난수 알고리즘"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "8.4.1 IndependentSampler의 구현과 PCG32 난수 엔진",
      "titleEn": "8.4.1 Implementation and the PCG32 Random Number Engine",
      "id": "ch08-04-b1"
    },
    {
      "type": "paragraph",
      "textKo": "IndependentSampler는 층화나 저불일치 제약 없이 RNG에서 값을 차례로 얻습니다. 설명에서는 독립 균일 표본으로 모델링하지만 실제 의사난수는 유한 상태의 결정적인 수열입니다. 이름의 “독립”을 수학적으로 무한한 완전 독립의 증명으로 받아들이지 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-04-b2"
    },
    {
      "type": "paragraph",
      "textKo": "PBRT의 RNG는 PCG 계열 의사난수 생성기를 사용합니다. 상태 갱신과 출력 변환을 조합해 효율적으로 통계적 품질을 얻는 방식입니다. 암호학적으로 안전한 난수 생성기라는 뜻은 아니므로 비밀번호·인증 토큰에 사용하는 기능과 구분합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch08-04-b3"
    },
    {
      "type": "code",
      "chunkName": "<<IndependentSampler Class Definition>>=",
      "language": "cpp",
      "code": "class IndependentSampler {\n  public:\n    <<>>        IndependentSampler(int samplesPerPixel, int seed = 0)\n           : samplesPerPixel(samplesPerPixel), seed(seed) {}\n       static IndependentSampler *Create(const ParameterDictionary &parameters,\n                                    const FileLoc *loc, Allocator alloc);\n       PBRT_CPU_GPU\n       static constexpr const char *Name() { return \"IndependentSampler\"; }\n       int SamplesPerPixel() const { return samplesPerPixel; }\n       void StartPixelSample(Point2i p, int sampleIndex, int dimension) {\n           rng.SetSequence(Hash(p, seed));\n           rng.Advance(sampleIndex * 65536ull + dimension);\n       }\n       Float Get1D() { return rng.Uniform<Float>(); }\n       Point2f Get2D() { return {rng.Uniform<Float>(), rng.Uniform<Float>()}; }\n       Point2f GetPixel2D() { return Get2D(); }\n       Sampler Clone(Allocator alloc);\n       std::string ToString() const;\n  private:\n    <<>>        int samplesPerPixel, seed;\n       RNG rng;\n};",
      "explanationKo": "첨부 원문의 실제 구현입니다. 멤버 seed와 픽셀 좌표로 수열을 정하고 sampleIndex와 dimension으로 진행 위치를 조절합니다. 이전 예제의 지역 seed가 초기화되지 않은 자기 자신을 참조하던 오류를 제거했습니다.",
      "provenance": "source-excerpt",
      "id": "ch08-04-b4"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "같은 표본과 같은 최종 이미지의 차이",
      "summary": "같은 표본과 같은 최종 이미지의 차이",
      "points": [
        {
          "title": "핵심 설명",
          "content": "같은 생성기·시드·표본 배정이면 같은 난수 수열을 재현할 수 있어 디버깅에 유용합니다. 다만 병렬 누적 순서나 하드웨어의 부동소수점 연산이 다르면 최종 이미지 비트까지 같다고 보장할 수는 없습니다. 진짜 난수도 기록해 재생할 수 있으므로 재현 자체가 논리적으로 불가능한 것은 아닙니다."
        }
      ],
      "tags": [
        "의사난수",
        "PRNG",
        "PCG32",
        "재현성",
        "디버깅"
      ],
      "id": "ch08-04-b5"
    }
  ],
  "audit": {
    "checkedSourceSha256": "7a235335ee02468b1481120a3d928389495ea7002e5a3d33eaf511b2ed0cebac",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "8.4 Independent Sampler"
    ],
    "sourceFigures": [],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
