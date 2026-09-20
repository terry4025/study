import type { SectionContent } from '../../../../types/book';

export const CH01_05_USING_AND_UNDERSTANDING: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "1",
  "chapterTitleKo": "제1장 소개 (Introduction)",
  "sectionNumber": "1.5",
  "sectionTitle": "Using and Understanding the Code",
  "sectionTitleKo": "1.5 코드 이해 및 활용 가이드 (Using and Understanding the Code)",
  "originalUrl": "https://pbr-book.org/4ed/Introduction/Using_and_Understanding_the_Code.html",
  "prevSection": {
    "id": "ch01-04",
    "title": "1.4 이 책을 효율적으로 공부하는 법"
  },
  "nextSection": {
    "id": "ch01-06",
    "title": "1.6 물리 기반 렌더링의 간략한 역사"
  },
  "summary": {
    "keyTakeaways": [
      "pbrt-v4는 최신 C++17 표준으로 작성되었으며, CPU와 GPU(CUDA/OptiX)에서 동일한 소스 코드로 실행되도록 설계되었습니다.",
      "표준 라이브러리(std)가 GPU 디바이스 코드에서 동작하지 않는 한계를 극복하기 위해 pstd 네임스페이스로 vector, optional, span 등을 재구현했습니다.",
      "초당 수천만 번 호출되는 렌더링 루프에서 가상 함수(vtable) 비용을 없애기 위해 64비트 포인터의 남는 비트를 활용하는 TaggedPointer 기반 동적 디스패치를 적용했습니다.",
      "메모리 할당 병목을 없애기 위해 범용 new/delete 대신 다형성 메모리 리소스(std::pmr) 기반의 아레나 할당자(Arena Allocator)를 사용합니다.",
      "많은 장면 데이터는 읽기 전용으로 공유하지만, 샘플러·임시 버퍼·출력 누적처럼 변하는 상태는 별도의 소유권과 동기화 규칙이 필요합니다."
    ],
    "prerequisites": [
      "C++17 기본 문법 및 템플릿(Template) 기초",
      "CPU 캐시 지역성(Spatial & Temporal Locality) 및 메모리 레이아웃",
      "가상 함수 테이블(vtable)과 동적 바인딩 원리"
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "textKo": "pbrt 소스 코드는 공식 웹사이트(pbrt.org)와 깃허브(GitHub)에서 자유롭게 다운로드받을 수 있습니다. 웹사이트에는 추가적인 문서와 최신 컴파일 지침, 그리고 본 도서에 실린 모든 예제 씬 파일들이 함께 제공됩니다.  \npbrt는 현대적인 C++17 표준으로 작성되었습니다. 그러나 난해한 템플릿 메타프로그래밍이나 과도하게 복잡한 C++ 특화 문법을 최대한 절제하여, C++ 고급 전문가가 아닌 일반 프로그래머나 학생들도 코드를 명쾌하게 읽고 이해할 수 있도록 심혈을 기울였습니다.",
      "textEn": "The pbrt source code distribution is available from pbrt.org. The website also includes additional documentation, current compilation instructions, and scene files for all of the images in the book. pbrt is written in C++, but we have tried to make it accessible to non-C++ experts by limiting the use of advanced features like template metaprogramming. Readers with experience with C-like languages should find the code readable.",
      "id": "ch01-05-b1"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.1 소스 코드 디렉터리 구성 (Source Code Organization)",
      "titleEn": "1.5.1 Source Code Organization",
      "id": "ch01-05-b2"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt 프로젝트의 핵심 소스 코드는 배포판의 `src/` 디렉터리 아래에 체계적으로 모여 있습니다.  \n- `src/pbrt/`: 시스템의 가장 중심이 되는 14대 기본 인터페이스(Shape, Material, Light 등)와 전역 헤더(`pbrt.h`, `options.h`)가 위치합니다.  \n- `src/pbrt/cpu/`: CPU 전용 렌더링 경로, 멀티스레드 병렬화 루프(`ParallelFor`), CPU 전용 적분기들이 구현되어 있습니다.  \n- `src/pbrt/gpu/`: 엔비디아 GPU(CUDA/OptiX) 가속 렌더링 파이프라인과 커널 실행 인프라가 담겨 있습니다.  \n- `src/pbrt/wavefront/`: GPU의 수만 개 스레드를 100% 가동하기 위한 웨이브프론트(Wavefront) 패스 트레이서가 구현되어 있습니다.  \n- `src/pbrt/util/`: 3D 벡터 수학, 메모리 할당자, 이미지 입출력(EXR, PNG), 저불일치 난수 생성기, 그리고 커스텀 표준 컨테이너(`pstd`)가 포함되어 있습니다.  \n- `src/pbrt/cmd/`: 최종 실행 파일인 `pbrt` 렌더러 CLI, 단위 테스트 실행기 `pbrt_test`, 이미지 후처리 도구 `imgtool`의 `main()` 소스들이 들어 있습니다.",
      "textEn": "The source code used for building pbrt is under the src directory in the pbrt distribution. The src/pbrt directory contains implementations of the fundamental interfaces and core headers. Subdirectories include cpu/ for CPU-specific rendering, gpu/ for CUDA and OptiX GPU code, wavefront/ for the wavefront path tracer, util/ for math and utilities, and cmd/ for executables like pbrt, pbrt_test, and imgtool.",
      "id": "ch01-05-b3"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.2 명명 규칙과 수학적 표기법 (Naming Conventions)",
      "titleEn": "1.5.2 Naming Conventions",
      "id": "ch01-05-b4"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt는 일관된 코드 스타일을 유지합니다. 클래스와 일반 함수는 첫 글자를 대문자로 쓰는 **카멜 표기법(CamelCase)**을 따릅니다(예: `SurfaceInteraction`, `EvaluatePixelSample`).  \n특히 그래픽스 수식과의 1:1 대응을 위해 수학적 변수명을 적극 활용합니다:  \n- 점(Point)은 $p$, 벡터(Vector)는 $v$, 표면 법선(Normal)은 $n$  \n- 광선이 나아가는 방향(Direction) 벡터는 그리스 문자 $\\omega$(오메가)에서 따온 $w$, 입사광 방향은 $w_i$, 반사/출사광 방향은 $w_o$  \n- 빛의 파장(Wavelength)은 $\\lambda$(람다), 빛의 세기(Radiance)는 $L$",
      "textEn": "Functions and classes are generally named using Camel case (e.g., SurfaceInteraction). We also try to match mathematical notation in naming: for example, we use variables like p for points, v for vectors, n for normals, and w for direction vectors (corresponding to omega in formulas).",
      "id": "ch01-05-b5"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.3 포인터 vs 참조자 사용 원칙 (Pointer or Reference?)",
      "titleEn": "1.5.3 Pointer or Reference?",
      "id": "ch01-05-b6"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt의 관례에서는 함수가 인자를 완전히 새 값으로 초기화하는 출력 대상으로 쓰면 포인터, 내부 상태 일부를 바꾸면 참조, 변경하지 않으면 const 참조를 사용합니다. 예외적으로 인자가 없거나 사용하지 않음을 nullptr로 나타내야 할 때는 포인터를 씁니다. 참조를 썼다는 사실만으로 수명과 유효성이 자동으로 보장되지는 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-05-b7"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.4 추상화와 하드웨어 효율성의 조화 (Abstraction vs Efficiency)",
      "titleEn": "1.5.4 Abstraction versus Efficiency",
      "id": "ch01-05-b8"
    },
    {
      "type": "paragraph",
      "textKo": "소프트웨어 설계에서 가장 큰 딜레마는 깔끔한 객체 지향 추상화(Abstraction)와 하드웨어의 극단적인 실행 효율성(Efficiency) 사이의 균형입니다.  \n광선 추적기는 1초에 수천만 개의 작은 기하 도형과 교차 검사를 수행해야 합니다. 만약 도형마다 픽셀마다 너무 잘게 쪼개진 가상 함수 호출을 거치게 만들면 컴파일러 인라인 최적화가 깨지고 CPU 파이프라인이 멈춥니다. pbrt는 개념적으로 의미가 있는 큰 단위에서만 명확한 인터페이스 추상화를 도입하고, 반복되는 연산 루프 내부에서는 군더더기 없는 직접 호출 구조를 취하여 가독성과 속도라는 두 마리 토끼를 모두 잡았습니다.",
      "textEn": "One of the primary tensions in software design is making a reasonable trade-off between clean abstraction and runtime efficiency. In ray tracing, fine-grained abstractions can impose significant overhead due to indirect function calls and missed inlining opportunities. pbrt balances these by maintaining clean interfaces at algorithmic boundaries while optimizing inner computational loops.",
      "id": "ch01-05-b9"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.5 CPU/GPU 통합 표준 라이브러리: pstd",
      "titleEn": "1.5.5 pstd",
      "id": "ch01-05-b10"
    },
    {
      "type": "paragraph",
      "textKo": "CPU와 GPU에서 공유할 코드에는 표준 라이브러리 기능을 그대로 사용할 수 없는 경우가 있습니다. pbrt는 필요한 컨테이너와 보조 기능 일부를 pstd 네임스페이스로 제공합니다. 이식성 문제는 기능과 컴파일 환경마다 다르므로 ‘std 전체가 GPU에서 불가능’하거나 ‘모든 pstd 함수가 두 장치에서 무조건 실행 가능’하다고 일반화하지 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-05-b11"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.6 메모리 아레나와 PMR 할당자 (Allocators)",
      "titleEn": "1.5.6 Allocators",
      "id": "ch01-05-b12"
    },
    {
      "type": "paragraph",
      "textKo": "렌더링 도중 씬을 구성할 때 수백만 개의 삼각형, 재질, 텍스처 객체들이 동적으로 생성됩니다. 이때 OS의 기본 `new`와 `delete`를 무분별하게 호출하면 메모리가 잘게 파편화(Fragmentation)되고 힙 관리자 오버헤드로 인해 시스템이 극도로 느려집니다.  \npbrt는 C++17에 도입된 **다형성 메모리 리소스(PMR, Polymorphic Memory Resources)** 표준을 채택하여 커스텀 할당자를 정의합니다:",
      "textEn": "Almost all dynamic memory allocation for the objects that represent the scene in pbrt is performed using a memory allocator based on std::pmr::polymorphic_allocator. This avoids heap fragmentation and lock contention associated with standard malloc and new.",
      "id": "ch01-05-b13"
    },
    {
      "type": "code",
      "chunkName": "<<Define Allocator>>=",
      "language": "cpp",
      "code": "// C++17/20 표준 다형성 할당자를 기반으로 한 pbrt 전용 Allocator 정의\nusing Allocator = pstd::pmr::polymorphic_allocator<std::byte>;",
      "explanationKo": "Allocator는 메모리 할당 전략을 자유롭게 교체할 수 있는 추상화 인터페이스입니다. 씬을 로딩할 때는 연속된 메모리 블록에서 순차적으로 공간을 잘라주는 초고속 아레나 할당자(Arena Allocator)를 연결하여 메모리 단편화를 0으로 만듭니다.",
      "provenance": "teaching",
      "id": "ch01-05-b14"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 메모리 관리 콕콕",
      "title": "아레나 할당자의 장점과 주의점",
      "summary": "아레나 할당자의 장점과 주의점",
      "points": [
        {
          "title": "핵심 설명",
          "content": "큰 블록 안에서 위치를 이동하며 할당하면 작은 객체를 반복해서 할당하는 비용을 줄일 수 있습니다. 하지만 블록 확장·정렬·초기화 비용은 남고, 필요한 소멸자 실행이나 오래 살아야 할 객체의 수명도 관리해야 합니다. 포인터만 되돌린다고 모든 자원 누수가 자동으로 사라지는 것은 아닙니다."
        }
      ],
      "tags": [
        "메모리 할당자",
        "Arena Allocator",
        "PMR",
        "성능 최적화"
      ],
      "id": "ch01-05-b15"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.7 초고속 다형성: TaggedPointer vs 가상 함수 테이블 (Dynamic Dispatch)",
      "titleEn": "1.5.7 Dynamic Dispatch",
      "id": "ch01-05-b16"
    },
    {
      "type": "paragraph",
      "textKo": "PBRT 4판은 여러 CPU/GPU 공통 인터페이스에서 TaggedPointer 기반 동적 디스패치를 사용합니다. 객체마다 가상 함수 포인터를 저장하는 비용을 줄이고, CPU와 GPU 코드의 함수 주소가 서로 다른 문제를 다루기 위한 선택입니다. 가상 함수를 전부 없앤 것은 아니며 CPU 적분기 등에는 남아 있습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-05-b17"
    },
    {
      "type": "paragraph",
      "textKo": "TaggedPointer는 지원 환경에서 사용할 수 있는 포인터 비트와 타입 정보를 한 값으로 묶고, 타입 태그에 따라 구체적인 함수를 호출합니다. 사용 가능한 주소 비트와 태그 폭은 구현과 플랫폼의 전제입니다. 모든 64비트 CPU가 늘 하위 48비트만 쓰거나 태그가 항상 한 바이트라는 보편 규칙은 아닙니다. 이 방법도 실제 호출 비용과 최적화 결과를 측정해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-05-b18"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.8 코드 최적화 철학 (Code Optimization)",
      "titleEn": "1.5.8 Code Optimization",
      "id": "ch01-05-b19"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt 제작진은 저수준의 꼼수(Micro-optimization)보다는 **우아하고 올바른 알고리즘 선택과 데이터 지향 설계(Data-Oriented Design)**를 통한 최적화를 최우선으로 삼았습니다.  \n현대 하드웨어는 CPU 연산 속도에 비해 RAM 메모리에서 데이터를 가져오는 속도(Memory Latency)가 수백 배 느립니다. 따라서 캐시 미스(Cache Miss)를 줄이고 데이터를 연속된 메모리에 오밀조밀하게 모아두는 캐시 친화적 자료구조 설계가 그 어떤 저수준 어셈블리 튜닝보다 훨씬 거대한 속도 향상을 가져옵니다.",
      "textEn": "We have tried to make pbrt efficient through the use of well-chosen algorithms and cache-friendly data layouts rather than through low-level micro-optimizations. For both CPUs and GPUs, memory latency is a major bottleneck; keeping frequently accessed data compact and contiguous is far more impactful than clever assembly hacks.",
      "id": "ch01-05-b20"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.9 디버깅과 로깅 시스템 (Debugging and Logging)",
      "titleEn": "1.5.9 Debugging and Logging",
      "id": "ch01-05-b21"
    },
    {
      "type": "paragraph",
      "textKo": "화면의 수백만 개 픽셀 중 단 하나의 픽셀에서 몇 시간 만에 크래시가 나는 버그는 그래픽스 프로그래머의 가장 큰 악몽입니다. pbrt는 이를 손쉽게 잡을 수 있는 강력한 디버깅 도구들을 기본 제공합니다:  \n\n- **단위 테스트 (`pbrt_test`)**: 기하학 교차 공식, 수학 변환, 스펙트럼 변환 등 모든 핵심 모듈을 검증하는 GoogleTest 기반 단위 테스트 스위트.  \n- **결정론적 단일 픽셀 디버깅 (`--debugstart x,y,sample`)**: 크래시 발생 시 \"Rendering failed at pixel (16, 27) sample 821\"과 같은 위치가 출력되며, 다음 실행 시 해당 픽셀과 샘플 번호로 정확히 점프하여 VSCode나 GDB 디버거로 즉시 중단점(Breakpoint)을 잡을 수 있습니다.  \n- **모든 클래스의 `ToString()` 구현**: 복잡한 객체 상태를 콘솔에 한눈에 출력할 수 있도록 전 클래스에 직렬화 문자열 함수 제공.",
      "textEn": "Debugging a renderer can be challenging. pbrt includes a comprehensive suite of unit tests (pbrt_test), rich assertions, deterministic single-pixel debugging via --debugstart <x,y,sample>, and ToString() methods for all major data structures to simplify inspection in debuggers.",
      "id": "ch01-05-b22"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.10 병렬 처리와 스레드 안전성 (Parallelism and Thread Safety)",
      "titleEn": "1.5.10 Parallelism and Thread Safety",
      "id": "ch01-05-b23"
    },
    {
      "type": "paragraph",
      "textKo": "렌더링 중 장면과 텍스처 등 많은 데이터는 읽기 전용으로 공유됩니다. 그러나 저수준 수학 자료형, ScratchBuffer, RNG, Sampler 등이 동시에 수정돼도 안전하다는 뜻은 아닙니다. 샘플러와 임시 버퍼는 스레드별로 분리하고, 광원의 Preprocess처럼 공유 상태를 바꾸는 작업은 호출 시점을 관리합니다. 픽셀 누적 등 다른 변경 상태도 있으므로 전체 데이터가 100% 불변이거나 선형 속도 향상이 보장되지는 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-05-b24"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.5.11 시스템 확장과 버그 리포트 (Extending and Bugs)",
      "titleEn": "1.5.11 Extending the System",
      "id": "ch01-05-b25"
    },
    {
      "type": "paragraph",
      "textKo": "이 책과 pbrt의 최종 목표는 독자가 새로운 렌더링 아이디어를 마음껏 구현하고 실험할 수 있는 최고의 놀이터가 되는 것입니다. 새로운 알고리즘을 구현했다면 부록 C.4를 참고하여 빌드에 추가할 수 있습니다.  \n혹시 시스템에서 버그를 발견하셨다면 깃허브 저장소(GitHub issues)에 재현 가능한 최소 씬 파일과 함께 이슈를 등록해 주시면 소스 코드 업데이트에 반영됩니다.",
      "textEn": "One of our goals was to make it easy for researchers and developers to experiment with new ideas. If you implement new features or encounter bugs, please consult Appendix C.4 and submit reproducible bug reports to the pbrt GitHub repository.",
      "id": "ch01-05-b26"
    },
    {
      "type": "paragraph",
      "textKo": "이제 소프트웨어 공학적 토대와 구현 기법까지 탄탄히 무장했습니다. 제1장의 대미를 장식하는 마지막 1.6절에서는, 1970년대 컴퓨터 그래픽스의 태동기부터 영화 <그래비티>, <알리타: 배틀 엔젤>에 이르기까지 **물리 기반 렌더링이 어떻게 시각 효과 혁명을 이끌어왔는지 그 위대한 역사(A Brief History of Physically Based Rendering)**를 살펴보겠습니다.",
      "textEn": "Having mastered the software engineering foundations of pbrt, Section 1.6 concludes the chapter with a fascinating journey through the history of physically based rendering, from early academic breakthroughs to modern Hollywood visual effects masterpieces like Gravity and Alita: Battle Angel.",
      "id": "ch01-05-b27"
    }
  ],
  "audit": {
    "checkedSourceSha256": "860c96f80c671291fa08d74da2f5ba2ee7e4c5f4b8f1a4e73ed2a3e0e7aeb4d0",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "1.5 Using and Understanding the Code",
      "1.5.1  Source Code Organization",
      "1.5.2  Naming Conventions",
      "1.5.3  Pointer or Reference?",
      "1.5.4  Abstraction versus Efficiency",
      "1.5.5  pstd",
      "1.5.6  Allocators",
      "1.5.7  Dynamic Dispatch",
      "1.5.8  Code Optimization",
      "1.5.9  Debugging and Logging",
      "1.5.10  Parallelism and Thread Safety",
      "1.5.11  Extending the System",
      "1.5.12  Bugs"
    ],
    "sourceFigures": [],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
