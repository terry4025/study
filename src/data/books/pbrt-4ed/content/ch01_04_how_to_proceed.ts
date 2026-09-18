import { SectionContent } from '../../../../types/book';

export const CH01_04_HOW_TO_PROCEED: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '1',
  chapterTitleKo: '제1장 소개 (Introduction)',
  sectionNumber: '1.4',
  sectionTitle: 'How to Proceed through This Book',
  sectionTitleKo: '1.4 이 책을 효율적으로 공부하는 법 (How to Proceed)',
  originalUrl: 'https://pbr-book.org/4ed/Introduction/How_to_Proceed_through_This_Book.html',
  prevSection: {
    id: 'ch01-03',
    title: '1.3 pbrt 시스템 전체 개요',
  },
  nextSection: {
    id: 'ch01-05',
    title: '1.5 코드 이해 및 활용 가이드',
  },
  summary: {
    keyTakeaways: [
      '이 책은 1장부터 순서대로 읽는 것을 기본 전제로 집필되었지만, 고도로 모듈화된 객체 지향 구조 덕분에 관심 분야에 따라 유연하게 건너뛰며 읽을 수 있습니다.',
      '책 전체는 4개 핵심 파트(1부: 기초 수학/물리, 2부: 기하학과 카메라, 3부: 재질과 빛 산란, 4부: 광선 추적 적분 알고리즘 및 GPU 가속)로 구성되어 있습니다.',
      '각 챕터 끝의 연습 문제는 1단계(기본 개념 확인), 2단계(실무 구현 프로젝트), 3단계(논문급 연구 과제)의 3단계 난이도로 구분됩니다.',
      '제목에 별표(*)가 붙은 절은 심화 내용(Advanced Topics)이므로 처음 완독할 때는 가볍게 건너뛰어도 좋습니다.'
    ],
    prerequisites: [
      '컴퓨터 그래픽스와 C++ 기초 개념',
      '장기적인 대규모 기술 서적 독파를 위한 학습 전략'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: '우리는 이 책을 처음부터 끝까지 순서대로 읽는다는 가정하에 집필했습니다. 아직 소개되지 않은 개념이나 인터페이스를 미리 언급(Forward Reference)하는 일을 최대한 줄이고자 노력했으며, 독자가 특정 페이지를 읽을 때 그 이전까지의 내용들은 이미 숙지하고 있다고 가정합니다.  \n다만 일부 절(Section)은 고도로 전문적인 심화 내용을 깊이 있게 다루고 있으므로, 처음 1독을 하실 때는 가볍게 건너뛰셔도 좋습니다. 이러한 심화 절들은 제목 옆에 **별표(\\*)** 표시가 되어 있어 쉽게 식별할 수 있습니다.',
      textEn: 'We have written this book assuming it will be read in roughly front-to-back order. We have tried to minimize the number of forward references to ideas and interfaces that have not yet been introduced, but we do assume that the reader is acquainted with the previous content at any particular point in the text. Some sections go into depth about advanced topics that some readers may wish to skip over, particularly on first reading; each advanced section is identified by an asterisk in its title.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 학습 로드맵 콕콕',
      title: '1,600페이지 분량의 그래픽스 바이블 완독 전략',
      summary: '나무에 매몰되지 않고 숲을 먼저 보는 탑다운(Top-down) 독서법',
      points: [
        {
          title: '최소 필수 개념만 쥐고 전진하기',
          content: 'Point3f, Ray, SampledSpectrum 같은 기본 수학 클래스와 Table 1.1의 14개 핵심 인터페이스, 그리고 Integrator의 Li() 렌더 루프만 이해하면 시스템의 80%를 파악한 것입니다. 카메라의 세부 투영 행렬 유도 공식이나 복잡한 미적분 증명에 발목을 잡히지 마세요.'
        },
        {
          title: '인터페이스 블랙박스(Black Box) 활용',
          content: 'pbrt는 모든 컴포넌트가 추상 인터페이스로 격리되어 있습니다. "Camera::GenerateRayDifferential()이 픽셀 샘플을 광선으로 바꿔준다"는 사실만 알면, 카메라 내부 코드를 몰라도 13장, 14장의 고급 렌더링 알고리즘을 얼마든지 재미있게 공부할 수 있습니다.'
        }
      ],
      tags: ['공부법', '소프트웨어 모듈화', '탑다운 학습', '그래픽스 입문']
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '책의 4대 핵심 구성 (The Four Parts of the Book)',
      titleEn: 'The Four Parts of the Book'
    },
    {
      type: 'paragraph',
      textKo: '본서는 크게 **4개의 주요 파트(총 16개 챕터)**로 나뉩니다:  \n\n' +
        '1. **제1부: 시스템의 기초 토대 (Chapters 2~4 - Foundations)**:  \n' +
        '   - **제2장 (몬테카를로 적분)**: 확률을 이용해 복잡한 적분을 푸는 컴퓨터 수학의 기초.  \n' +
        '   - **제3장 (기하학과 변환)**: 점(Point), 벡터(Vector), 광선(Ray), 바운딩 박스(Bounding Box), 4x4 행렬 변환.  \n' +
        '   - **제4장 (방사측정학과 색상)**: 빛의 물리적 단위(W, lm, cd)와 파장 스펙트럼(`SampledSpectrum`), 인간 시각 인지 및 색 공간(Color Space).  \n\n' +
        '2. **제2부: 이미지 형성과 기하 표현 (Chapters 5~8 - Geometry & Image Formation)**:  \n' +
        '   - **제5장 (카메라와 필름)**: 핀홀, 투시, 피사계 심도(DoF)를 가진 실제 물리 렌즈 카메라 모델과 센서 필름.  \n' +
        '   - **제6장 (형상과 교차 검사)**: 구, 원반, 원기둥, 삼각형 메시(Triangle Mesh)와의 광선 충돌 방정식.  \n' +
        '   - **제7장 (가속 구조 BVH)**: 수천만 개의 폴리곤 중 광선과 닿지 않는 99.9%를 즉시 쳐내는 바운딩 볼륨 계층 트리.  \n' +
        '   - **제8장 (샘플러)**: 앨리어싱(계단 현상)을 방지하고 몬테카를로 오차를 줄이는 저불일치(Low-Discrepancy) 난수 생성기.  \n\n' +
        '3. **제3부: 빛과 표면 산란 (Chapters 9~12 - Scattering and Illumination)**:  \n' +
        '   - **제9장 (표면 반사 모델)**: 디퓨즈, 거울, 미세면(Microfacet) 반사 분포 함수(BSDF).  \n' +
        '   - **제10장 (재질과 텍스처)**: 플라스틱, 유리, 금속, 피부, 그리고 공간적 색상 변화를 주는 텍스처 매핑.  \n' +
        '   - **제11장 (매질 속 볼륨 산란)**: 안개, 연기, 구름 속에서 빛이 흡수되고 산란되는 참여 매질(Participating Media).  \n' +
        '   - **제12장 (광원)**: 점 광원, 방향성 햇빛, 면적 광원(Area Light), 360도 HDRI 무한 환경광(Image-Based Lighting).  \n\n' +
        '4. **제4부: 광선 수송 알고리즘과 하드웨어 가속 (Chapters 13~16 - Light Transport & GPU)**:  \n' +
        '   - **제13~14장 (패스 트레이싱과 첨단 몬테카를로)**: 차세대 이벤트 추정(NEE), 다중 중요도 샘플링(MIS), 볼륨 패스 트레이싱.  \n' +
        '   - **제15장 (웨이브프론트 GPU 렌더러)**: CPU와 100% 동일한 수학 클래스를 공유하며 엔비디아 GPU(CUDA/OptiX)에서 초고속으로 광선을 추적하는 최신 GPU 아키텍처.  \n' +
        '   - **제16장 (회고와 프로젝트 과제)**: 전체 시스템 설계 철학 회고 및 대형 도전 프로젝트 주제들.',
      textEn: 'The remainder of this book is divided into four main parts of a few chapters each. First, Chapters 2 through 4 introduce the foundations of the system (Monte Carlo integration, geometric classes, radiometric units, and color spectra). The second part covers image formation and geometry representation: Chapter 5 (Cameras), Chapter 6 (Shapes), Chapter 7 (Acceleration structures like BVH), and Chapter 8 (Samplers). The third part covers light scattering: Chapter 9 (Surface reflection models), Chapter 10 (Materials and textures), Chapter 11 (Participating media and volume scattering), and Chapter 12 (Light sources). The last part brings all ideas together: Chapters 13 and 14 implement advanced light transport algorithms, Chapter 15 describes a high-performance GPU wavefront renderer, and Chapter 16 presents system design retrospectives and advanced project ideas.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.4.1 챕터별 연습 문제 (The Exercises)',
      titleEn: '1.4.1 The Exercises'
    },
    {
      type: 'paragraph',
      textKo: '각 장의 마지막에는 독자가 방금 배운 개념을 스스로 검증하고 손으로 직접 코드를 짜볼 수 있는 다양한 연습 문제가 수록되어 있습니다. 모든 문제는 난이도에 따라 **3단계 레벨**로 분류됩니다:  \n\n' +
        '- **Level 1 (★☆☆ - 기본 개념 점검)**: 몇 시간 안에 해결할 수 있는 가벼운 문제들입니다. 새로운 기능을 기존 클래스에 소규모로 추가하거나, 본문의 수식을 손으로 직접 증명하고 확인해 보는 문제입니다.  \n' +
        '- **Level 2 (★★☆ - 실무 개발 프로젝트)**: 며칠에서 몇 주에 걸쳐 집중해야 하는 상당한 규모의 프로젝트입니다. 새로운 형태의 도형(Shape)이나 복잡한 셰이딩 재질, 새로운 적분 알고리즘을 시스템에 완전히 새로운 모듈로 통합하는 과제입니다. 대학 학부/대학원의 과제물로 아주 적합합니다.  \n' +
        '- **Level 3 (★★★ - 논문급 연구 과제)**: 아직 학계나 산업계에서도 정답이 완전히 밝혀지지 않은 최신 연구 주제나 석사 학위 논문 주제에 버금가는 도전 과제입니다.',
      textEn: 'At the end of each chapter you will find exercises related to the material covered in that chapter. Each exercise is marked as one of three levels of difficulty: Level 1 (requiring only a few hours to solve, checking fundamental concepts), Level 2 (substantial projects requiring days or weeks, implementing new shapes or algorithms), and Level 3 (open-ended research topics suitable for a master\'s thesis or a SIGGRAPH publication).'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.4.2 고화질 이미지와 온라인 뷰어 (Viewing the Images)',
      titleEn: '1.4.2 Viewing the Images'
    },
    {
      type: 'paragraph',
      textKo: '책 전반에 걸쳐 다양한 렌더링 알고리즘 간의 품질 차이를 비교하는 비교 이미지들이 풍부하게 실려 있습니다. 종이 인쇄본에서도 최대한 차이가 눈에 띄도록 조판했으나, 미세한 노이즈 차이나 고명암비(HDR, High Dynamic Range)의 생생한 빛은 종이 인쇄의 한계를 뛰어넘는 최신 디스플레이에서 비로소 진가를 발휘합니다.  \n이에 따라 저자들은 책에 실린 모든 렌더링 결과물을 온라인에 고해상도 무손실 EXR 포맷으로 공개해 두었습니다. 예를 들어 본문의 그림 1.1은 웹 브라우저에서 `pbr-book.org/4ed/fig/1.1` 주소로 접속하면 마우스 휠로 확대하고 픽셀 값을 직접 찍어보며 비교할 수 있습니다.',
      textEn: 'Figures throughout the book compare the results of rendering the same scene using different algorithms. We have made all of the rendered images available online at pbr-book.org/4ed/fig/<number>. Readers can view them on high-dynamic-range displays and use interactive viewers to pan, zoom, and inspect individual pixel exposures.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.4.3 무료 온라인 공개판 (The Online Edition)',
      titleEn: '1.4.3 The Online Edition'
    },
    {
      type: 'paragraph',
      textKo: '2023년 11월 1일부터 본 도서의 전체 전문(Full Text)이 `pbr-book.org/4ed` 웹사이트에 전 세계 모든 학생과 연구자들을 위해 **100% 무료로 영구 공개**되었습니다.  \n온라인 에디션에는 지면의 물리적 한계(종이책 페이지 제한)로 인해 종이책에는 아쉽게 실리지 못했던 풍부한 보충 자료들이 함께 포함되어 있습니다. 예를 들어 특수 카메라 모델, kd-트리 공간 가속 구조의 전체 소스 코드, 그리고 양방향 패스 트레이싱(BDPT)과 메트로폴리스 광선 수송(MLT)을 다룬 보너스 챕터까지 자유롭게 탐색할 수 있습니다.',
      textEn: 'The full contents of this book are freely available online at pbr-book.org/4ed. The online edition includes additional content that could not be included in the printed book due to page constraints, such as kd-tree acceleration structures and bidirectional light transport algorithms.'
    },
    {
      type: 'paragraph',
      textKo: '이제 학습 로드맵을 머릿속에 담았으니, 다음 1.5절에서는 실제 pbrt C++20 소스 코드가 디렉터리별로 어떻게 구성되어 있고, 메모리 할당(Allocator)과 타입 디스패처(TaggedPointer), 멀티스레드 안전성 같은 **고성능 시스템 프로그래밍 기법**을 어떻게 적용했는지 깊이 있게 파헤쳐 보겠습니다.',
      textEn: 'With the roadmap in mind, Section 1.5 delves into the practical aspects of using and understanding the pbrt C++20 codebase, covering directory organization, custom allocators, tagged pointers, and thread-safety conventions.'
    }
  ]
};
