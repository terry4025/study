import type { SectionContent } from '../../../../types/book';

export const CH01_04_HOW_TO_PROCEED: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "1",
  "chapterTitleKo": "제1장 소개 (Introduction)",
  "sectionNumber": "1.4",
  "sectionTitle": "How to Proceed through This Book",
  "sectionTitleKo": "1.4 이 책을 효율적으로 공부하는 법 (How to Proceed)",
  "originalUrl": "https://pbr-book.org/4ed/Introduction/How_to_Proceed_through_This_Book.html",
  "prevSection": {
    "id": "ch01-03",
    "title": "1.3 pbrt 시스템 전체 개요"
  },
  "nextSection": {
    "id": "ch01-05",
    "title": "1.5 코드 이해 및 활용 가이드"
  },
  "summary": {
    "keyTakeaways": [
      "이 책은 1장부터 순서대로 읽는 것을 기본 전제로 집필되었지만, 고도로 모듈화된 객체 지향 구조 덕분에 관심 분야에 따라 유연하게 건너뛰며 읽을 수 있습니다.",
      "책 전체는 4개 핵심 파트(1부: 기초 수학/물리, 2부: 기하학과 카메라, 3부: 재질과 빛 산란, 4부: 광선 추적 적분 알고리즘 및 GPU 가속)로 구성되어 있습니다.",
      "연습문제의 ①·②·③은 원서의 대략적인 작업량 구분이며, 각각 1~2시간·10~20시간·40시간 이상을 제시합니다.",
      "제목에 별표(*)가 붙은 절은 심화 내용(Advanced Topics)이므로 처음 완독할 때는 가볍게 건너뛰어도 좋습니다."
    ],
    "prerequisites": [
      "컴퓨터 그래픽스와 C++ 기초 개념",
      "장기적인 대규모 기술 서적 독파를 위한 학습 전략"
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "textKo": "우리는 이 책을 처음부터 끝까지 순서대로 읽는다는 가정하에 집필했습니다. 아직 소개되지 않은 개념이나 인터페이스를 미리 언급(Forward Reference)하는 일을 최대한 줄이고자 노력했으며, 독자가 특정 페이지를 읽을 때 그 이전까지의 내용들은 이미 숙지하고 있다고 가정합니다.  \n다만 일부 절(Section)은 고도로 전문적인 심화 내용을 깊이 있게 다루고 있으므로, 처음 1독을 하실 때는 가볍게 건너뛰셔도 좋습니다. 이러한 심화 절들은 제목 옆에 **별표(\\*)** 표시가 되어 있어 쉽게 식별할 수 있습니다.",
      "textEn": "We have written this book assuming it will be read in roughly front-to-back order. We have tried to minimize the number of forward references to ideas and interfaces that have not yet been introduced, but we do assume that the reader is acquainted with the previous content at any particular point in the text. Some sections go into depth about advanced topics that some readers may wish to skip over, particularly on first reading; each advanced section is identified by an asterisk in its title.",
      "id": "ch01-04-b1"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 학습 로드맵 콕콕",
      "title": "먼저 큰 흐름을 잡고 세부를 읽기",
      "summary": "먼저 큰 흐름을 잡고 세부를 읽기",
      "points": [
        {
          "title": "핵심 설명",
          "content": "점·광선·스펙트럼 자료형과 주요 인터페이스, 적분기 호출 흐름을 알면 관심 있는 부분을 먼저 읽기 쉽습니다. 특정 인터페이스의 입력·출력 역할을 이해한 뒤 세부 유도를 나중에 돌아와 읽어도 됩니다. 이것만으로 책의 일정 비율을 이해했다고 계산할 근거는 없습니다."
        }
      ],
      "tags": [
        "공부법",
        "소프트웨어 모듈화",
        "탑다운 학습",
        "그래픽스 입문"
      ],
      "id": "ch01-04-b2"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "책의 4대 핵심 구성 (The Four Parts of the Book)",
      "titleEn": "The Four Parts of the Book",
      "id": "ch01-04-b3"
    },
    {
      "type": "paragraph",
      "textKo": "본서는 크게 **4개의 주요 파트(총 16개 챕터)**로 나뉩니다:  \n\n1. **제1부: 시스템의 기초 토대 (Chapters 2~4 - Foundations)**:  \n   - **제2장 (몬테카를로 적분)**: 확률을 이용해 복잡한 적분을 푸는 컴퓨터 수학의 기초.  \n   - **제3장 (기하학과 변환)**: 점(Point), 벡터(Vector), 광선(Ray), 바운딩 박스(Bounding Box), 4x4 행렬 변환.  \n   - **제4장 (방사측정학과 색상)**: 빛의 물리적 단위(W, lm, cd)와 파장 스펙트럼(`SampledSpectrum`), 인간 시각 인지 및 색 공간(Color Space).  \n\n2. **제2부: 이미지 형성과 기하 표현 (Chapters 5~8 - Geometry & Image Formation)**:  \n   - **제5장 (카메라와 필름)**: 핀홀, 투시, 피사계 심도(DoF)를 가진 실제 물리 렌즈 카메라 모델과 센서 필름.  \n   - **제6장 (형상과 교차 검사)**: 구, 원반, 원기둥, 삼각형 메시(Triangle Mesh)와의 광선 충돌 방정식.  \n   - **제7장 (가속 구조 BVH)**: 수천만 개의 폴리곤 중 광선과 닿지 않는 교차하지 않을 후보들을 건너뛰는 바운딩 볼륨 계층 트리.  \n   - **제8장 (샘플러)**: 앨리어싱(계단 현상)을 방지하고 몬테카를로 오차를 줄이는 저불일치(Low-Discrepancy) 난수 생성기.  \n\n3. **제3부: 빛과 표면 산란 (Chapters 9~12 - Scattering and Illumination)**:  \n   - **제9장 (표면 반사 모델)**: 디퓨즈, 거울, 미세면(Microfacet) 반사 분포 함수(BSDF).  \n   - **제10장 (재질과 텍스처)**: 플라스틱, 유리, 금속, 피부, 그리고 공간적 색상 변화를 주는 텍스처 매핑.  \n   - **제11장 (매질 속 볼륨 산란)**: 안개, 연기, 구름 속에서 빛이 흡수되고 산란되는 참여 매질(Participating Media).  \n   - **제12장 (광원)**: 점 광원, 방향성 햇빛, 면적 광원(Area Light), 360도 HDRI 무한 환경광(Image-Based Lighting).  \n\n4. **제4부: 광선 수송 알고리즘과 하드웨어 가속 (Chapters 13~16 - Light Transport & GPU)**:  \n   - **제13~14장 (패스 트레이싱과 첨단 몬테카를로)**: 다음 사건 추정(NEE), 다중 중요도 샘플링(MIS), 볼륨 패스 트레이싱.  \n   - **제15장 (웨이브프론트 GPU 렌더러)**: CPU/GPU 공통 자료형과 여러 알고리즘을 재사용하며 엔비디아 GPU(CUDA/OptiX)에서 초고속으로 광선을 추적하는 최신 GPU 아키텍처.  \n   - **제16장 (회고와 프로젝트 과제)**: 전체 시스템 설계 철학 회고 및 대형 도전 프로젝트 주제들.",
      "textEn": "The remainder of this book is divided into four main parts of a few chapters each. First, Chapters 2 through 4 introduce the foundations of the system (Monte Carlo integration, geometric classes, radiometric units, and color spectra). The second part covers image formation and geometry representation: Chapter 5 (Cameras), Chapter 6 (Shapes), Chapter 7 (Acceleration structures like BVH), and Chapter 8 (Samplers). The third part covers light scattering: Chapter 9 (Surface reflection models), Chapter 10 (Materials and textures), Chapter 11 (Participating media and volume scattering), and Chapter 12 (Light sources). The last part brings all ideas together: Chapters 13 and 14 implement advanced light transport algorithms, Chapter 15 describes a high-performance GPU wavefront renderer, and Chapter 16 presents system design retrospectives and advanced project ideas.",
      "id": "ch01-04-b4"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.4.1 챕터별 연습 문제 (The Exercises)",
      "titleEn": "1.4.1 The Exercises",
      "id": "ch01-04-b5"
    },
    {
      "type": "paragraph",
      "textKo": "원서는 연습문제를 예상 작업량에 따라 세 단계로 나눕니다. ①은 약 1~2시간, ②는 수업 과제로 적절한 약 10~20시간의 읽기·구현 작업, ③은 보통 40시간 이상 걸리는 기말 프로젝트 수준입니다. 이는 독자의 배경과 구현 범위에 따른 추정이며, ③이 모두 미해결 연구 문제라는 뜻은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-04-b6"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.4.2 고화질 이미지와 온라인 뷰어 (Viewing the Images)",
      "titleEn": "1.4.2 Viewing the Images",
      "id": "ch01-04-b7"
    },
    {
      "type": "paragraph",
      "textKo": "책 전반에 걸쳐 다양한 렌더링 알고리즘 간의 품질 차이를 비교하는 비교 이미지들이 풍부하게 실려 있습니다. 종이 인쇄본에서도 최대한 차이가 눈에 띄도록 조판했으나, 미세한 노이즈 차이나 고명암비(HDR, High Dynamic Range)의 생생한 빛은 종이 인쇄의 한계를 뛰어넘는 최신 디스플레이에서 비로소 진가를 발휘합니다.  \n이에 따라 저자들은 책에 실린 그림에 사용한 렌더링 결과물을 온라인에서 확인할 수 있도록 제공했습니다. 모든 파일의 저장 형식이 EXR이라는 뜻은 아닙니다. 예를 들어 본문의 그림 1.1은 웹 브라우저에서 `pbr-book.org/4ed/fig/1.1` 주소로 접속하면 마우스 휠로 확대하고 픽셀 값을 직접 찍어보며 비교할 수 있습니다.",
      "textEn": "Figures throughout the book compare the results of rendering the same scene using different algorithms. We have made all of the rendered images available online at pbr-book.org/4ed/fig/<number>. Readers can view them on high-dynamic-range displays and use interactive viewers to pan, zoom, and inspect individual pixel exposures.",
      "id": "ch01-04-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.4.3 무료 온라인 공개판 (The Online Edition)",
      "titleEn": "1.4.3 The Online Edition",
      "id": "ch01-04-b9"
    },
    {
      "type": "paragraph",
      "textKo": "원서는 온라인 판과 추가 자료의 존재를 안내합니다. 온라인에는 종이책에서 생략한 구현이나 보충 설명이 있을 수 있습니다. 그러나 웹사이트를 무료로 읽을 수 있다는 사실과 영구 제공·모든 형식의 자유로운 재배포는 다릅니다. 이 앱에서는 첨부된 원문 파일의 실제 범위를 기준으로 연결합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-04-b10"
    },
    {
      "type": "paragraph",
      "textKo": "이제 학습 로드맵을 머릿속에 담았으니, 다음 1.5절에서는 실제 pbrt C++17 소스 코드가 디렉터리별로 어떻게 구성되어 있고, 메모리 할당(Allocator)과 타입 디스패처(TaggedPointer), 멀티스레드 안전성 같은 **고성능 시스템 프로그래밍 기법**을 어떻게 적용했는지 깊이 있게 파헤쳐 보겠습니다.",
      "textEn": "With the roadmap in mind, Section 1.5 delves into the practical aspects of using and understanding the pbrt C++20 codebase, covering directory organization, custom allocators, tagged pointers, and thread-safety conventions.",
      "id": "ch01-04-b11"
    }
  ],
  "audit": {
    "checkedSourceSha256": "f1b28d3d3de8568fb55719fea911627974c77cb7af96a4456486e09fff6da856",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "1.4 How to Proceed through This Book",
      "1.4.1  The Exercises",
      "1.4.2  Viewing the Images",
      "1.4.3  The Online Edition"
    ],
    "sourceFigures": [],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
