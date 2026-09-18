import { SectionContent } from '../../../../types/book';

export const CH01_05_USING_AND_UNDERSTANDING: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '1',
  chapterTitleKo: '제1장 소개 (Introduction)',
  sectionNumber: '1.5',
  sectionTitle: 'Using and Understanding the Code',
  sectionTitleKo: '1.5 코드 이해 및 활용 가이드 (Using and Understanding the Code)',
  originalUrl: 'https://pbr-book.org/4ed/Introduction/Using_and_Understanding_the_Code.html',
  prevSection: {
    id: 'ch01-04',
    title: '1.4 이 책을 효율적으로 공부하는 법',
  },
  nextSection: {
    id: 'ch01-06',
    title: '1.6 물리 기반 렌더링의 간략한 역사',
  },
  summary: {
    keyTakeaways: [
      'pbrt-v4는 최신 C++20 표준으로 작성되었으며, CPU와 GPU(CUDA/OptiX)에서 동일한 소스 코드로 실행되도록 설계되었습니다.',
      '표준 라이브러리(std)가 GPU 디바이스 코드에서 동작하지 않는 한계를 극복하기 위해 pstd 네임스페이스로 vector, optional, span 등을 재구현했습니다.',
      '초당 수천만 번 호출되는 렌더링 루프에서 가상 함수(vtable) 비용을 없애기 위해 64비트 포인터의 남는 비트를 활용하는 TaggedPointer 기반 동적 디스패치를 적용했습니다.',
      '메모리 할당 병목을 없애기 위해 범용 new/delete 대신 다형성 메모리 리소스(std::pmr) 기반의 아레나 할당자(Arena Allocator)를 사용합니다.',
      '렌더링 중 씬 데이터는 100% 불변(Read-only)으로 취급되어 뮤텍스(Mutex) 락 경합 없이 멀티코어 선형 확장을 달성합니다.'
    ],
    prerequisites: [
      'C++20 기본 문법 및 템플릿(Template) 기초',
      'CPU 캐시 지역성(Spatial & Temporal Locality) 및 메모리 레이아웃',
      '가상 함수 테이블(vtable)과 동적 바인딩 원리'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: 'pbrt 소스 코드는 공식 웹사이트(pbrt.org)와 깃허브(GitHub)에서 자유롭게 다운로드받을 수 있습니다. 웹사이트에는 추가적인 문서와 최신 컴파일 지침, 그리고 본 도서에 실린 모든 예제 씬 파일들이 함께 제공됩니다.  \n' +
        'pbrt는 현대적인 C++20 표준으로 작성되었습니다. 그러나 난해한 템플릿 메타프로그래밍이나 과도하게 복잡한 C++ 특화 문법을 최대한 절제하여, C++ 고급 전문가가 아닌 일반 프로그래머나 학생들도 코드를 명쾌하게 읽고 이해할 수 있도록 심혈을 기울였습니다.',
      textEn: 'The pbrt source code distribution is available from pbrt.org. The website also includes additional documentation, current compilation instructions, and scene files for all of the images in the book. pbrt is written in C++, but we have tried to make it accessible to non-C++ experts by limiting the use of advanced features like template metaprogramming. Readers with experience with C-like languages should find the code readable.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.1 소스 코드 디렉터리 구성 (Source Code Organization)',
      titleEn: '1.5.1 Source Code Organization'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt 프로젝트의 핵심 소스 코드는 배포판의 `src/` 디렉터리 아래에 체계적으로 모여 있습니다.  \n' +
        '- `src/pbrt/`: 시스템의 가장 중심이 되는 14대 기본 인터페이스(Shape, Material, Light 등)와 전역 헤더(`pbrt.h`, `options.h`)가 위치합니다.  \n' +
        '- `src/pbrt/cpu/`: CPU 전용 렌더링 경로, 멀티스레드 병렬화 루프(`ParallelFor`), CPU 전용 적분기들이 구현되어 있습니다.  \n' +
        '- `src/pbrt/gpu/`: 엔비디아 GPU(CUDA/OptiX) 가속 렌더링 파이프라인과 커널 실행 인프라가 담겨 있습니다.  \n' +
        '- `src/pbrt/wavefront/`: GPU의 수만 개 스레드를 100% 가동하기 위한 웨이브프론트(Wavefront) 패스 트레이서가 구현되어 있습니다.  \n' +
        '- `src/pbrt/util/`: 3D 벡터 수학, 메모리 할당자, 이미지 입출력(EXR, PNG), 저불일치 난수 생성기, 그리고 커스텀 표준 컨테이너(`pstd`)가 포함되어 있습니다.  \n' +
        '- `src/pbrt/cmd/`: 최종 실행 파일인 `pbrt` 렌더러 CLI, 단위 테스트 실행기 `pbrt_test`, 이미지 후처리 도구 `imgtool`의 `main()` 소스들이 들어 있습니다.',
      textEn: 'The source code used for building pbrt is under the src directory in the pbrt distribution. The src/pbrt directory contains implementations of the fundamental interfaces and core headers. Subdirectories include cpu/ for CPU-specific rendering, gpu/ for CUDA and OptiX GPU code, wavefront/ for the wavefront path tracer, util/ for math and utilities, and cmd/ for executables like pbrt, pbrt_test, and imgtool.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.2 명명 규칙과 수학적 표기법 (Naming Conventions)',
      titleEn: '1.5.2 Naming Conventions'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt는 일관된 코드 스타일을 유지합니다. 클래스와 일반 함수는 첫 글자를 대문자로 쓰는 **카멜 표기법(CamelCase)**을 따릅니다(예: `SurfaceInteraction`, `EvaluatePixelSample`).  \n' +
        '특히 그래픽스 수식과의 1:1 대응을 위해 수학적 변수명을 적극 활용합니다:  \n' +
        '- 점(Point)은 $p$, 벡터(Vector)는 $v$, 표면 법선(Normal)은 $n$  \n' +
        '- 광선이 나아가는 방향(Direction) 벡터는 그리스 문자 $\\omega$(오메가)에서 따온 $w$, 입사광 방향은 $w_i$, 반사/출사광 방향은 $w_o$  \n' +
        '- 빛의 파장(Wavelength)은 $\\lambda$(람다), 빛의 세기(Radiance)는 $L$',
      textEn: 'Functions and classes are generally named using Camel case (e.g., SurfaceInteraction). We also try to match mathematical notation in naming: for example, we use variables like p for points, v for vectors, n for normals, and w for direction vectors (corresponding to omega in formulas).'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.3 포인터 vs 참조자 사용 원칙 (Pointer or Reference?)',
      titleEn: '1.5.3 Pointer or Reference?'
    },
    {
      type: 'paragraph',
      textKo: 'C++에서 함수에 객체를 넘길 때 포인터(`*`)와 참조자(`&`)를 언제 선택해야 할까요? pbrt는 명확한 철학을 지킵니다:  \n' +
        '1. **참조자(`const T &` 또는 `T &`)**: 전달되는 객체가 **절대로 `nullptr`일 수 없고**, 수명이 보장되는 경우에 사용합니다. 함수 내부에서 유효성 검사를 할 필요가 없어 코드가 간결하고 안전합니다.  \n' +
        '2. **포인터(`T *`)**: 인자가 **선택적(Optional)**이어서 `nullptr`가 전달될 수 있거나, 호출자가 반환값을 받지 않기를 원할 때(`nullptr` 전달로 생략) 명시적으로 포인터를 사용합니다.',
      textEn: 'C++ provides both pointers and references. In pbrt, references are used when an object is definitely non-null and will not be modified (or is an in-out parameter), while pointers are used when nullptr is a valid value, indicating an optional parameter.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.4 추상화와 하드웨어 효율성의 조화 (Abstraction vs Efficiency)',
      titleEn: '1.5.4 Abstraction versus Efficiency'
    },
    {
      type: 'paragraph',
      textKo: '소프트웨어 설계에서 가장 큰 딜레마는 깔끔한 객체 지향 추상화(Abstraction)와 하드웨어의 극단적인 실행 효율성(Efficiency) 사이의 균형입니다.  \n' +
        '광선 추적기는 1초에 수천만 개의 작은 기하 도형과 교차 검사를 수행해야 합니다. 만약 도형마다 픽셀마다 너무 잘게 쪼개진 가상 함수 호출을 거치게 만들면 컴파일러 인라인 최적화가 깨지고 CPU 파이프라인이 멈춥니다. pbrt는 개념적으로 의미가 있는 큰 단위에서만 명확한 인터페이스 추상화를 도입하고, 반복되는 연산 루프 내부에서는 군더더기 없는 직접 호출 구조를 취하여 가독성과 속도라는 두 마리 토끼를 모두 잡았습니다.',
      textEn: 'One of the primary tensions in software design is making a reasonable trade-off between clean abstraction and runtime efficiency. In ray tracing, fine-grained abstractions can impose significant overhead due to indirect function calls and missed inlining opportunities. pbrt balances these by maintaining clean interfaces at algorithmic boundaries while optimizing inner computational loops.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.5 CPU/GPU 통합 표준 라이브러리: pstd',
      titleEn: '1.5.5 pstd'
    },
    {
      type: 'paragraph',
      textKo: 'C++ 표준 라이브러리(`std::vector`, `std::optional`, `std::span` 등)는 훌륭하지만, 엔비디아 GPU의 CUDA 디바이스 커널 안에서는 직접 동작하지 않습니다. GPU 메모리 할당 정책과 예외 처리(Exception) 메커니즘이 CPU와 완전히 다르기 때문입니다.  \n' +
        '이를 해결하기 위해 pbrt는 `src/pbrt/util/pstd.h` 안에 표준 라이브러리의 핵심 컨테이너들을 **`pstd::` 네임스페이스**로 자체 재구현했습니다. `pstd`의 모든 함수와 컨테이너에는 `PBRT_CPU_GPU` 매크로가 붙어 있어, 동일한 C++ 소스 코드가 단 한 줄의 수정도 없이 CPU 스레드와 GPU CUDA 스레드 양쪽에서 모두 완벽하게 컴파일되고 동작합니다!',
      textEn: 'We have reimplemented a subset of the C++ standard library in the pstd namespace; this was necessary because the standard C++ library cannot be called from GPU device code. By providing pstd implementations decorated with PBRT_CPU_GPU, pbrt allows the exact same geometric and container code to execute seamlessly on both CPU and GPU.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.6 메모리 아레나와 PMR 할당자 (Allocators)',
      titleEn: '1.5.6 Allocators'
    },
    {
      type: 'paragraph',
      textKo: '렌더링 도중 씬을 구성할 때 수백만 개의 삼각형, 재질, 텍스처 객체들이 동적으로 생성됩니다. 이때 OS의 기본 `new`와 `delete`를 무분별하게 호출하면 메모리가 잘게 파편화(Fragmentation)되고 힙 관리자 오버헤드로 인해 시스템이 극도로 느려집니다.  \n' +
        'pbrt는 C++17에 도입된 **다형성 메모리 리소스(PMR, Polymorphic Memory Resources)** 표준을 채택하여 커스텀 할당자를 정의합니다:',
      textEn: 'Almost all dynamic memory allocation for the objects that represent the scene in pbrt is performed using a memory allocator based on std::pmr::polymorphic_allocator. This avoids heap fragmentation and lock contention associated with standard malloc and new.'
    },
    {
      type: 'code',
      chunkName: '<<Define Allocator>>=',
      language: 'cpp',
      code: `// C++17/20 표준 다형성 할당자를 기반으로 한 pbrt 전용 Allocator 정의
using Allocator = pstd::pmr::polymorphic_allocator<std::byte>;`,
      explanationKo: 'Allocator는 메모리 할당 전략을 자유롭게 교체할 수 있는 추상화 인터페이스입니다. 씬을 로딩할 때는 연속된 메모리 블록에서 순차적으로 공간을 잘라주는 초고속 아레나 할당자(Arena Allocator)를 연결하여 메모리 단편화를 0으로 만듭니다.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 메모리 관리 콕콕',
      title: '아레나 할당자(Arena Allocator)의 경이로운 성능 비결',
      summary: '개별 free()를 수백만 번 부르는 대신, 프레임이 끝날 때 메모리 풀 통째로 날리기',
      points: [
        {
          title: '포인터 덧셈만으로 끝나는 O(1) 초고속 할당',
          content: 'OS 기본 malloc은 빈 메모리 블록(Free List)을 뒤지고 병합하느라 상당한 연산이 듭니다. 아레나 할당자는 거대한 메모리 덩어리를 하나 받아두고, 요청이 올 때마다 현재 오프셋 포인터를 앞으로 전진(Bump Allocation)시키기만 하므로 1나노초도 걸리지 않습니다.'
        },
        {
          title: '개별 해제 비용 0 (Zero-Cost Deallocation)',
          content: '수백만 개의 임시 객체들을 일일이 delete하지 않고, 렌더링이나 타일 작업이 끝났을 때 아레나의 오프셋 포인터를 0으로 되돌려버리면 모든 객체가 한 번에 즉시 반환됩니다. 메모리 누수 위험이 원천 차단됩니다.'
        }
      ],
      tags: ['메모리 할당자', 'Arena Allocator', 'PMR', '성능 최적화']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.7 초고속 다형성: TaggedPointer vs 가상 함수 테이블 (Dynamic Dispatch)',
      titleEn: '1.5.7 Dynamic Dispatch'
    },
    {
      type: 'paragraph',
      textKo: 'PBRT 제4판의 가장 혁신적인 엔지니어링 개선 중 하나는 **가상 함수(`virtual`)의 전면적 퇴출과 `TaggedPointer` 도입**입니다.  \n' +
        '기존 C++ 가상 함수는 두 가지 심각한 문제를 야기합니다:  \n' +
        '1. **객체 메모리 낭비**: 클래스마다 숨겨진 8바이트 vtable 포인터가 붙어 수억 개의 프리미티브를 다룰 때 수 기가바이트의 메모리가 낭비됩니다.  \n' +
        '2. **GPU 실행 불가**: vtable은 CPU 호스트 프로세스의 가상 메모리 주소를 가리키므로, GPU 디바이스 메모리로 복사했을 때 포인터가 깨져 GPU에서 실행할 수 없습니다.',
      textEn: 'Virtual functions are generally not used for dynamic dispatch with polymorphic types in pbrt-v4. First, in C++, an instance of an object that inherits from an abstract base class includes a hidden 8-byte pointer to a vtable, bloating millions of small primitives. Second, virtual function tables store host memory addresses that are invalid in GPU device memory.'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt는 현대 64비트 x86_64 및 ARM64 아키텍처가 실제로는 하위 48비트 정도의 가상 주소만 사용한다는 점에 착안했습니다. **상위 미사용 비트에 1바이트 타입 태그(Type Tag)를 압축 저장하는 `TaggedPointer`**를 자체 구현하여, 단 8바이트 크기 안에 실제 객체 주소와 타입 정보(예: 0=Sphere, 1=Triangle, 2=Disk)를 동시에 담아냈습니다.  \n메서드 호출 시에는 거대한 가상 함수 테이블을 헤매는 대신 단순한 `switch(tag)` 문을 통해 인라인 최적화가 가능한 직접 함수 호출로 분기합니다. 이 덕분에 CPU 캐시 효율이 극대화되고, GPU에서도 동일한 디스패치 코드가 완벽하게 고속 실행됩니다.',
      textEn: 'pbrt utilizes TaggedPointer, which packs a type tag into the unused upper bits of a 64-bit pointer. Method invocations are resolved using a simple switch statement over the type tags, allowing compiler inlining, drastically improving CPU instruction cache locality, and executing seamlessly on GPU hardware.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.8 코드 최적화 철학 (Code Optimization)',
      titleEn: '1.5.8 Code Optimization'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt 제작진은 저수준의 꼼수(Micro-optimization)보다는 **우아하고 올바른 알고리즘 선택과 데이터 지향 설계(Data-Oriented Design)**를 통한 최적화를 최우선으로 삼았습니다.  \n' +
        '현대 하드웨어는 CPU 연산 속도에 비해 RAM 메모리에서 데이터를 가져오는 속도(Memory Latency)가 수백 배 느립니다. 따라서 캐시 미스(Cache Miss)를 줄이고 데이터를 연속된 메모리에 오밀조밀하게 모아두는 캐시 친화적 자료구조 설계가 그 어떤 저수준 어셈블리 튜닝보다 훨씬 거대한 속도 향상을 가져옵니다.',
      textEn: 'We have tried to make pbrt efficient through the use of well-chosen algorithms and cache-friendly data layouts rather than through low-level micro-optimizations. For both CPUs and GPUs, memory latency is a major bottleneck; keeping frequently accessed data compact and contiguous is far more impactful than clever assembly hacks.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.9 디버깅과 로깅 시스템 (Debugging and Logging)',
      titleEn: '1.5.9 Debugging and Logging'
    },
    {
      type: 'paragraph',
      textKo: '화면의 수백만 개 픽셀 중 단 하나의 픽셀에서 몇 시간 만에 크래시가 나는 버그는 그래픽스 프로그래머의 가장 큰 악몽입니다. pbrt는 이를 손쉽게 잡을 수 있는 강력한 디버깅 도구들을 기본 제공합니다:  \n\n' +
        '- **단위 테스트 (`pbrt_test`)**: 기하학 교차 공식, 수학 변환, 스펙트럼 변환 등 모든 핵심 모듈을 검증하는 GoogleTest 기반 단위 테스트 스위트.  \n' +
        '- **결정론적 단일 픽셀 디버깅 (`--debugstart x,y,sample`)**: 크래시 발생 시 "Rendering failed at pixel (16, 27) sample 821"과 같은 위치가 출력되며, 다음 실행 시 해당 픽셀과 샘플 번호로 정확히 점프하여 VSCode나 GDB 디버거로 즉시 중단점(Breakpoint)을 잡을 수 있습니다.  \n' +
        '- **모든 클래스의 `ToString()` 구현**: 복잡한 객체 상태를 콘솔에 한눈에 출력할 수 있도록 전 클래스에 직렬화 문자열 함수 제공.',
      textEn: 'Debugging a renderer can be challenging. pbrt includes a comprehensive suite of unit tests (pbrt_test), rich assertions, deterministic single-pixel debugging via --debugstart <x,y,sample>, and ToString() methods for all major data structures to simplify inspection in debuggers.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.10 병렬 처리와 스레드 안전성 (Parallelism and Thread Safety)',
      titleEn: '1.5.10 Parallelism and Thread Safety'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt가 수십 개의 멀티코어 CPU에서 완벽한 선형 속도 향상(Linear Speedup)을 달성할 수 있는 가장 근본적인 비결은 **"렌더링 중 씬 데이터의 100% 읽기 전용(Read-Only Immutability)"** 원칙입니다.  \n' +
        '씬 파싱과 BVH 가속 구조 생성이 끝나고 나면, 렌더링 루프가 도는 동안 기하 형상, 재질, 텍스처, 조명 데이터는 단 한 바이트도 수정되지 않습니다. 모든 스레드가 락(Mutex)을 걸 필요 없이 마음껏 메모리를 읽을 수 있습니다.  \n' +
        '상태 변경이 필요한 유일한 요소인 난수 샘플러(`Sampler`)와 임시 메모리(`ScratchBuffer`)는 각 스레드마다 독립된 스레드 로컬(ThreadLocal) 인스턴스를 부여하여, 스레드 간 충돌을 100% 원천 봉쇄했습니다.',
      textEn: 'During rendering, the vast majority of data is read-only (scene description, BVH, textures). Concurrent read access by multiple threads incurs zero lock contention. Classes that require state modification (Sampler and ScratchBuffer) are allocated per-thread, achieving flawless parallel scalability.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.5.11 시스템 확장과 버그 리포트 (Extending and Bugs)',
      titleEn: '1.5.11 Extending the System'
    },
    {
      type: 'paragraph',
      textKo: '이 책과 pbrt의 최종 목표는 독자가 새로운 렌더링 아이디어를 마음껏 구현하고 실험할 수 있는 최고의 놀이터가 되는 것입니다. 새로운 알고리즘을 구현했다면 부록 C.4를 참고하여 빌드에 추가할 수 있습니다.  \n혹시 시스템에서 버그를 발견하셨다면 깃허브 저장소(GitHub issues)에 재현 가능한 최소 씬 파일과 함께 이슈를 등록해 주시면 소스 코드 업데이트에 반영됩니다.',
      textEn: 'One of our goals was to make it easy for researchers and developers to experiment with new ideas. If you implement new features or encounter bugs, please consult Appendix C.4 and submit reproducible bug reports to the pbrt GitHub repository.'
    },
    {
      type: 'paragraph',
      textKo: '이제 소프트웨어 공학적 토대와 구현 기법까지 탄탄히 무장했습니다. 제1장의 대미를 장식하는 마지막 1.6절에서는, 1970년대 컴퓨터 그래픽스의 태동기부터 영화 <그래비티>, <알리타: 배틀 엔젤>에 이르기까지 **물리 기반 렌더링이 어떻게 시각 효과 혁명을 이끌어왔는지 그 위대한 역사(A Brief History of Physically Based Rendering)**를 살펴보겠습니다.',
      textEn: 'Having mastered the software engineering foundations of pbrt, Section 1.6 concludes the chapter with a fascinating journey through the history of physically based rendering, from early academic breakthroughs to modern Hollywood visual effects masterpieces like Gravity and Alita: Battle Angel.'
    }
  ]
};
