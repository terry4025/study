import { SectionContent } from '../../../../types/book';

export const CH01_03_SYSTEM_OVERVIEW: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '1',
  chapterTitleKo: '제1장 소개 (Introduction)',
  sectionNumber: '1.3',
  sectionTitle: 'pbrt: System Overview',
  sectionTitleKo: '1.3 pbrt 시스템 전체 개요 (System Overview)',
  originalUrl: 'https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html',
  prevSection: {
    id: 'ch01-02',
    title: '1.2 사실적 렌더링과 광선 추적 알고리즘',
  },
  nextSection: {
    id: 'ch01-04',
    title: '1.4 이 책을 효율적으로 공부하는 법',
  },
  summary: {
    keyTakeaways: [
      'pbrt는 객체 지향(OOP) 기법을 철저히 따라 소수의 추상 기본 타입(Shape, Material, Light, Camera, Integrator 등)을 중심으로 모듈화되어 있습니다.',
      '실행 흐름은 3단계(씬 파싱 -> BVH 가속 구조 구축 -> 멀티스레드 2D 타일 렌더링 루프)로 명확히 분리됩니다.',
      'main() 함수는 옵션 파싱 후 InitPBRT()로 시스템을 초기화하고, 파서가 만든 씬을 렌더링한 뒤 CleanupPBRT()로 자원을 안전하게 회수합니다.',
      'ImageTileIntegrator는 전체 이미지를 16×16 크기의 타일로 쪼개어 멀티스레드로 병렬 처리하며, 스레드 전용 메모리(ScratchBuffer)를 사용하여 동적 할당 병목을 제거합니다.',
      'RandomWalkIntegrator는 광선이 물체와 부딪힐 때마다 구면 무작위 방향으로 광선을 재귀 반사시키는 순수 몬테카를로 기법으로 렌더링 방정식(Rendering Equation)을 계산합니다.'
    ],
    prerequisites: [
      'C++ 클래스 상속과 순수 가상 함수(Pure Virtual Function) 인터페이스',
      '멀티스레드 병렬 프로그래밍 기초 (작업 분할, 스레드 로컬 스토리지 TLS)',
      '재귀 함수(Recursion) 및 몬테카를로 확률 샘플링 기초'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: 'pbrt는 표준적인 객체 지향(Object-Oriented) 소프트웨어 공학 원칙을 철저히 따라 설계되었습니다. 시스템의 핵심적인 개념들마다 **추상 기본 클래스(Abstract Base Class)**가 정의되어 있으며, 개별 알고리즘이나 물체 형상(구, 삼각형 등)은 이 기본 클래스를 상속받는 하위 클래스로 구현됩니다.  \n예를 들어, 씬의 기하학적 형태를 담당하는 `Shape` 클래스는 자신의 바운딩 박스(Bounding Box)를 계산해 주는 메서드와, 주어진 광선과 충돌하는지 검사하는 인터페이스를 반드시 구현해야 합니다. 이렇게 잘 정의된 인터페이스 덕분에 시스템의 나머지 부분들은 구체적인 하위 클래스가 구(Sphere)인지, 거대한 3D 메시(Triangle Mesh)인지 신경 쓰지 않고 동일한 방식으로 투명하게 다룰 수 있습니다.',
      textEn: 'pbrt is structured using standard object-oriented techniques: for each of a number of fundamental types, the system specifies an interface that implementations of that type must fulfill. For example, pbrt requires the implementation of a particular shape that represents geometry in a scene to provide a set of methods including one that returns the shape\'s bounding box, and another that tests for intersection with a given ray. In turn, the majority of the system can be implemented in terms of these abstract interfaces, without needing to know details of the implementations of specific shapes.'
    },
    {
      type: 'paragraph',
      textKo: '새로운 렌더링 기능(예: 새로운 모양, 새로운 재질, 새로운 조명 모델 등)을 pbrt에 추가하는 것은 매우 직관적입니다. 단순히 해당 추상 인터페이스를 상속받는 새로운 C++ 클래스를 작성하고 컴파일하기만 하면 됩니다. 기존 핵심 코드를 한 줄도 수정할 필요가 없습니다.  \n이러한 확장성 덕분에 pbrt는 전 세계 유수의 컴퓨터 그래픽스 연구실과 스탠퍼드 대학교 CS348b 강의 등에서 학생들이 새로운 알고리즘을 실험하고 발전시키는 최고의 베이스캠프로 널리 활용되어 왔습니다.',
      textEn: 'Adding a new shape, material, or light to pbrt is easy: a new class that implements the appropriate interface is written and added to the build. There is no need to modify any existing code. This design has made pbrt a popular platform for research and education: students in courses like Stanford\'s CS348b have added numerous advanced rendering capabilities to pbrt.'
    },
    {
      type: 'figure',
      id: 'fig:competition-snow',
      number: 'Figure 1.13',
      title: 'Night Snow Render in pbrt',
      titleKo: '스탠퍼드 렌더링 대회 우승작: 밤의 눈 풍경 (Night Snow)',
      src: '/books/pbrt-4ed/images/nightsnow.png',
      captionKo: '기욤 퐁생(Guillaume Poncin)과 프라모드 샤르마(Pramod Sharma)가 pbrt를 다양하게 확장하여 스탠퍼드 CS348b 렌더링 대회에서 1위를 차지한 명작입니다. 나뭇가지 위에 쌓인 수많은 미세 눈송이 형상과 가로등 불빛이 대기 중에 산란하는 볼륨 효과를 물리 기반으로 사실감 넘치게 계산해 냈습니다.',
      captionEn: 'Figure 1.13: Guillaume Poncin and Pramod Sharma extended pbrt in numerous ways, implementing a number of complex rendering algorithms, to make this prize-winning image for Stanford\'s CS348b rendering competition. The tree geometry was generated with an L-system, snow accumulation was simulated, and volumetric scattering was implemented for the streetlamp light.'
    },
    {
      type: 'figure',
      id: 'fig:ice-cave',
      number: 'Figure 1.14',
      title: 'Ice Cave Render in pbrt',
      titleKo: '스탠퍼드 렌더링 대회 대상 수상작: 얼음 동굴 (Ice Cave)',
      src: '/books/pbrt-4ed/images/icecave.png',
      captionKo: '에이브 데이비스(Abe Davis), 데이비드 제이콥스(David Jacobs), 백종민(Jongmin Baek)이 2009년 스탠퍼드 CS348b 대회에서 대상을 수상한 환상적인 얼음 동굴 렌더링입니다. 고드름 형성 물리 시뮬레이션, 얼음 내부의 빛 산란(서브서피스 스캐터링), 파장별 빛의 굴절(분산, Dispersion)을 pbrt 플러그인 형태로 직접 구현하여 렌더링했습니다.',
      captionEn: 'Figure 1.14: Abe Davis, David Jacobs, and Jongmin Baek rendered this amazing image of an ice cave to take the grand prize in the 2009 Stanford CS348b rendering competition. They first implemented a simulation of the physical process of icicle formation, then implemented subsurface scattering and dispersion in ice.'
    },
    {
      type: 'figure',
      id: 'fig:cotton-candy',
      number: 'Figure 1.15',
      title: 'Cotton Candy Render in pbrt',
      titleKo: '스탠퍼드 렌더링 대회 대상 수상작: 찻잔 속 솜사탕 (Cotton Candy)',
      src: '/books/pbrt-4ed/images/cotton_candy.png',
      captionKo: '멍천린(Chenlin Meng), 휴버트 테오(Hubert Teo), 주지런(Jiren Zhu)이 2018년 스탠퍼드 CS348b 대회에서 대상을 받은 작품입니다. 수만 올의 미세한 설탕 섬유 커브(Curves)와 설탕 내부 다중 산란을 시뮬레이션하여 입안에서 사르르 녹을 듯한 극상의 질감을 완벽히 재현했습니다.',
      captionEn: 'Figure 1.15: Chenlin Meng, Hubert Teo, and Jiren Zhu rendered this tasty-looking image of cotton candy in a teacup to win the grand prize in the 2018 Stanford CS348b rendering competition. They modeled the cotton candy with multiple scattering simulated through thousands of sugar fiber curves.'
    },
    {
      type: 'figure',
      id: 'fig:imperial-crown',
      number: 'Figure 1.16',
      title: 'Austrian Imperial Crown Render',
      titleKo: '오스트리아 황실 왕관 (Austrian Imperial Crown)',
      src: '/books/pbrt-4ed/images/crown.png',
      captionKo: '마르틴 루비히(Martin Lubich)가 블렌더(Blender)로 정밀 모델링한 오스트리아 황실 왕관입니다. 수백만 개의 삼각형 메시, 정교한 금 세공 표면, 다이아몬드 및 진주 보석의 내부 전반사 반사광을 물리 기반으로 시뮬레이션하여 실물과 구별할 수 없는 수준의 시각적 디테일을 보여줍니다.',
      captionEn: 'Figure 1.16: Martin Lubich modeled this scene of the Austrian Imperial Crown using Blender. The crown consists of millions of triangles and complex microfacet materials, demonstrating pbrt\'s scalability with complex real-world production assets.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.3.1 실행의 3단계 라이프사이클 (Phases of Execution)',
      titleEn: '1.3.1 Phases of Execution'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt가 사용자의 컴퓨터에서 실행되면, 개념적으로 크게 **세 가지 단계(Three Phases of Execution)**를 순차적으로 거치며 이미지를 만들어냅니다:  \n\n1. **씬 파일 파싱 (Scene Description Parsing)**: 사용자가 지정한 `.pbrt` 텍스트 파일을 읽어 토큰화하고, 파일에 적힌 카메라 설정, 조명 종류, 물체 좌표 및 재질 선언문들을 메모리 상의 구조체로 적재합니다.  \n2. **씬 구성 및 가속 구조 빌드 (Preprocessing & Scene Construction)**: 파싱된 원시 데이터를 실제 렌더링에 최적화된 기하학적 프리미티브(Primitive)와 가속 구조(BVH, Bounding Volume Hierarchy)로 변환합니다.  \n3. **메인 렌더링 루프 (Main Rendering Loop)**: 실제 빛과 광선을 계산하는 단계입니다. 컴퓨터의 전체 CPU 코어를 풀가동하여 수억~수십억 개의 광선을 추적하며, 렌더링 시간의 대부분(95% 이상)이 바로 이 단계에서 소요됩니다.',
      textEn: 'pbrt can be conceptually divided into three phases of execution. First, it parses the scene description file, creating a BasicScene that stores the scene specification. Second, it converts the scene specification into geometric primitives and other objects that are used during rendering. In the third phase, the main rendering loop executes. This phase is where pbrt usually spends the majority of its execution time.'
    },
    {
      type: 'paragraph',
      textKo: '첫 번째 파싱 단계의 결과물은 `BasicScene` 클래스의 인스턴스입니다. 이 클래스는 씬에 등장하는 모든 물체와 광원, 카메라, 필름 설정들을 단순한 파라미터 사전(Key-Value Dictionary) 형태로 담고 있습니다.  \n두 번째 단계에서는 이 파라미터들을 읽어 실제 C++ 객체들을 생성합니다. 수백만 개의 삼각형들은 메모리에 최적화된 연속 버퍼로 올라가고, 광선 충돌 검사를 초고속으로 수행하기 위한 공간 분할 트리(BVH)가 멀티스레드로 빌드됩니다. 빌드가 완료되면 씬은 하나의 거대한 집합체 프리미티브(`Primitive aggregate`)로 묶이며, 모든 광원들은 `std::vector<Light>` 배열로 준비됩니다.',
      textEn: 'The result of the parsing phase is an instance of the BasicScene class, which stores the scene specification using generic parameter dictionaries. In the second phase, these representations are converted into actual C++ objects: geometric shapes, materials, area lights, cameras, and so on. An acceleration data structure like a bounding volume hierarchy is built over the scene\'s primitives, and all lights are collected into an array.'
    },
    {
      type: 'paragraph',
      textKo: '마지막 세 번째 단계에서는 **적분기(Integrator)** 객체의 `Render()` 메서드가 호출됩니다. Integrator는 카메라에서 출발한 광선들이 씬의 가속 구조와 충돌하는 위치를 찾고, 광원과 재질의 물리 법칙에 따라 반사 및 굴절되는 빛의 양(Radiance)을 누적하여 디지털 필름(Film)에 기록합니다. 계산이 모두 끝나면 필름 객체는 최종 이미지를 PNG나 EXR 파일 형식으로 디스크에 저장합니다.',
      textEn: 'In the third phase, the main rendering loop executes. The Integrator::Render() method is called. It simulates the propagation of light through the scene, generating samples that are recorded in an image Film. Once rendering is complete, the film writes the image to an output file.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.3.2 pbrt의 main() 함수 구현 (pbrt\'s main() Function)',
      titleEn: '1.3.2 pbrt\'s main() Function'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt 실행 파일의 진입점인 `main()` 함수는 소스 코드 트리의 `cmd/pbrt.cpp` 파일에 정의되어 있습니다. 약 150줄 남짓의 비교적 간결한 함수이며, 커맨드 라인 인자(옵션) 처리와 시스템 초기화/종료라는 정돈된 책임을 맡고 있습니다.',
      textEn: 'The main() function for the pbrt executable is defined in the file cmd/pbrt.cpp in the directory that holds the implementations of various command-line utilities. It is only a hundred and fifty or so lines of code, much of it devoted to processing command-line arguments and related bookkeeping.'
    },
    {
      type: 'code',
      chunkName: '<<main program>>=',
      language: 'cpp',
      code: `int main(int argc, char *argv[]) {
    // 1. 커맨드 라인 인자를 C++ 문자열 벡터로 변환
    std::vector<std::string> args = GetCommandLineArguments(argc, argv);

    // 2. 명령행 옵션 파싱 (PBRTOptions 구조체 채우기)
    PBRTOptions options;
    std::vector<std::string> filenames;
    <<Process command-line arguments>>

    // 3. pbrt 전역 시스템 초기화
    InitPBRT(options);

    // 4. 씬 파일 파싱 및 렌더링 실행
    if (filenames.empty()) {
        pbrt::Parser parser(new BasicSceneBuilder);
        parser.Parse(stdin);
    } else {
        for (const std::string &fn : filenames) {
            pbrt::Parser parser(new BasicSceneBuilder);
            parser.ParseFile(fn);
        }
    }

    // 5. 시스템 정리 및 자원 반환
    CleanupPBRT();
    return 0;
}`,
      explanationKo: 'pbrt 실행의 뼈대입니다. GetCommandLineArguments()로 인자를 받고, InitPBRT()로 스레드 풀과 메모리 풀을 준비한 뒤, 파서가 씬을 읽어 렌더링을 지시하고, 마지막에 CleanupPBRT()로 안전하게 뒷정리를 마칩니다.'
    },
    {
      type: 'paragraph',
      textKo: '이 구조에서 주목할 점은 `InitPBRT(options)`와 `CleanupPBRT()`의 쌍(Pair) 구조입니다. 현대 소프트웨어 공학에서 필수적인 **RAII(Resource Acquisition Is Initialization)** 철학을 반영하여, 실행 시작 시 스레드 풀, 부동소수점 예외 처리 플래그, GPU 컨텍스트 등을 안전하게 초기화하고, 작업이 끝나면 메모리 누수 없이 깨끗하게 모든 시스템 자원을 해제합니다.',
      textEn: 'InitPBRT() initializes the system based on the provided options, creating the thread pool, setting up floating-point exception handling, and initializing GPU contexts if needed. Correspondingly, CleanupPBRT() shuts down worker threads and frees allocated resources before the program exits.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 아키텍처 콕콕',
      title: '왜 전역 변수 대신 체계적인 Init/Cleanup 함수를 둘까?',
      summary: '대규모 그래픽스 엔진과 라이브러리 설계에서 생명주기 관리(Lifecycle Management)의 중요성',
      points: [
        {
          title: '스레드 풀과 싱글톤의 순서 의존성 제거',
          content: 'C++에서 전역 정적 객체(Static Global)는 소멸 순서가 보장되지 않아 프로그램 종료 시 세그멘테이션 오류(Segmentation Fault)를 일으키기 쉽습니다. Init/Cleanup 함수를 명시적으로 호출하면 자원 생성과 해제 순서를 100% 완벽히 통제할 수 있습니다.'
        },
        {
          title: '라이브러리(lib) 임베딩 유연성',
          content: 'pbrt는 단독 실행 파일(CLI)뿐 아니라 다른 3D 소프트웨어(Maya, Blender 등)의 플러그인 동적 라이브러리(DLL)로도 탑재될 수 있습니다. 이때 호스트 프로그램이 원할 때 Init과 Cleanup을 호출하여 렌더러를 껐다 켤 수 있어야 합니다.'
        }
      ],
      tags: ['C++20', '소프트웨어 아키텍처', '생명주기 관리', 'RAII']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.3.3 Integrator 추상 기본 인터페이스 (Integrator Interface)',
      titleEn: '1.3.3 Integrator Interface'
    },
    {
      type: 'paragraph',
      textKo: 'CPU 기반 렌더링 경로에서 빛의 수송(Light Transport)을 시뮬레이션하는 모든 알고리즘 클래스는 `Integrator` 추상 기본 클래스를 상속받습니다. 이 클래스는 `src/pbrt/cpu/integrator.h`에 선언되어 있습니다.',
      textEn: 'In the CPU rendering path, an instance of a class that implements the Integrator interface simulates light transport in the scene to render the image. The Integrator interface is declared in the file cpu/integrator.h.'
    },
    {
      type: 'code',
      chunkName: '<<Integrator Interface>>=',
      language: 'cpp',
      code: `class Integrator {
  public:
    // 생성자: 씬 전체를 대표하는 단일 가속 구조 프리미티브와 광원 목록을 받음
    Integrator(Primitive aggregate, std::vector<Light> lights)
        : aggregate(aggregate), lights(lights) {
        // 무한 원거리 환경광(Infinite Lights) 별도 필터링
        for (const auto &light : lights)
            if (light.Is<InfiniteLight>())
                infiniteLights.push_back(light.Cast<InfiniteLight>());
    }
    virtual ~Integrator() = default;

    // 메인 렌더링 순수 가상 함수: 하위 클래스가 반드시 구현해야 함
    virtual void Render() = 0;

    // 광선과 씬의 가장 가까운 교차점 찾기 (가속 구조 쿼리)
    pstd::optional<ShapeIntersection> Intersect(const Ray &ray, Float tMax = Infinity) const;

    // 두 지점 사이에 장애물이 있는지 여부만 빠르게 검사 (그림자 광선용)
    bool IntersectP(const Ray &ray, Float tMax = Infinity) const;

  protected:
    Primitive aggregate;
    std::vector<Light> lights;
    std::vector<InfiniteLight> infiniteLights;
};`,
      explanationKo: '모든 렌더러의 어머니가 되는 기본 인터페이스입니다. Render() 순수 가상 함수를 선언하여 실제 알고리즘을 하위 클래스에 위임하고, 광선 교차 검사를 위한 편리한 헬퍼 메서드(Intersect, IntersectP)를 제공합니다.'
    },
    {
      type: 'paragraph',
      textKo: '기본 `Integrator` 생성자는 씬에 존재하는 모든 기하학적 형상을 아우르는 단 하나의 `Primitive aggregate`와 광원 목록(`lights`)을 인자로 받습니다.  \n여기서 `aggregate`는 수십만 개의 개별 메쉬를 담고 있는 가속 트리(BVH)입니다. `Intersect()` 메서드는 이 가속 구조를 탐색하여 광선과 가장 먼저 충돌하는 표면의 교차 정보(`ShapeIntersection`)를 반환합니다. 반면 `IntersectP()`의 뒤에 붙은 `P`는 **술어(Predicate)**를 의미하며, 물체 정보 대신 "빛이 가로막혔는가? (true/false)"만을 초고속으로 검사하여 그림자 판정에 사용됩니다.',
      textEn: 'The base Integrator constructor takes a single Primitive that represents all the geometric objects in the scene, and a vector of Light pointers. The aggregate primitive usually holds a bounding volume hierarchy that accelerates intersection tests. Intersect() finds the closest intersection along a ray, while IntersectP() only tests whether any intersection exists along the ray up to tMax, which is much faster and useful for shadow rays.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.3.4 ImageTileIntegrator와 메인 렌더링 루프 (ImageTileIntegrator and Main Rendering Loop)',
      titleEn: '1.3.4 ImageTileIntegrator and the Main Rendering Loop'
    },
    {
      type: 'paragraph',
      textKo: '대부분의 렌더링 알고리즘은 전체 이미지를 작은 2D 타일 단위로 쪼개어 독립적으로 계산할 수 있습니다. pbrt는 이 공통 기능을 별도의 중간 기반 클래스인 `ImageTileIntegrator`로 묶어 코드 중복을 방지했습니다.',
      textEn: 'Before implementing a basic integrator that simulates light transport to render an image, we will define an intermediate base class, ImageTileIntegrator, that handles decomposing the image into small rectangular tiles and rendering them concurrently using multiple CPU cores.'
    },
    {
      type: 'code',
      chunkName: '<<ImageTileIntegrator Definition>>=',
      language: 'cpp',
      code: `class ImageTileIntegrator : public Integrator {
  public:
    ImageTileIntegrator(Camera camera, Sampler sampler, Primitive aggregate,
                        std::vector<Light> lights)
        : Integrator(aggregate, lights), camera(camera), samplerPrototype(sampler) {}

    // 타일 분할 및 멀티스레드 병렬 실행 루프 구현
    void Render();

    // 개별 픽셀 샘플을 평가하는 순수 가상 메서드 (하위 클래스 구현)
    virtual void EvaluatePixelSample(Point2i pPixel, int sampleIndex,
                                     Sampler sampler, ScratchBuffer &scratchBuffer) = 0;

  protected:
    Camera camera;
    Sampler samplerPrototype;
};`,
      explanationKo: 'ImageTileIntegrator는 Camera와 Sampler 프로토타입을 관리하며, Render() 함수 안에서 병렬 타일 루프를 실행합니다. 하위 클래스는 단지 EvaluatePixelSample()만 구현하면 자동으로 고성능 멀티스레드 렌더러가 됩니다.'
    },
    {
      type: 'paragraph',
      textKo: '`ImageTileIntegrator::Render()`의 실제 구현을 들여다보면, 최신 멀티스레드 CPU 아키텍처의 장점을 극대화하기 위한 두 가지 핵심 기법이 녹아 있습니다:  \n\n1. **스레드 로컬 스토리지 (ThreadLocal ScratchBuffer)**: 렌더링 도중에는 엄청난 양의 임시 객체가 생성되었다가 사라집니다. 만약 매 광선마다 `new/delete`나 `malloc/free`를 부르면 OS의 메모리 힙 락(Lock) 경합 때문에 멀티코어 성능이 급격히 떨어집니다. pbrt는 스레드마다 미리 확보된 고속 선형 메모리 버퍼(`ScratchBuffer`)를 제공하여 동적 할당 오버헤드를 0으로 만듭니다.  \n2. **점진적 파동 렌더링 (Wave Rendering)**: 전체 샘플 수(`spp`)를 한 번에 다 계산하지 않고, 1개 샘플 파동, 2개 샘플 파동, 4개, 8개... 처럼 기하급수적으로 크기를 늘려가며 화면 전체를 훑습니다. 덕분에 사용자는 렌더링이 100% 끝나기를 기다릴 필요 없이, 실행 직후부터 점진적으로 선명해지는 이미지를 실시간으로 눈으로 확인할 수 있습니다.',
      textEn: 'The Render() method allocates a ThreadLocal ScratchBuffer for each worker thread, eliminating dynamic memory allocation contention. Furthermore, it renders the image in waves with exponentially increasing sample counts, allowing quick visual feedback of the image progress before all samples are completed.'
    },
    {
      type: 'code',
      chunkName: '<<ImageTileIntegrator::Render>>=',
      language: 'cpp',
      code: `void ImageTileIntegrator::Render() {
    // 1. 각 작업자 스레드 전용 스크래치 메모리와 독립 샘플러 준비
    ThreadLocal<ScratchBuffer> scratchBuffers([]() { return ScratchBuffer(); });
    ThreadLocal<Sampler> samplers([this]() { return samplerPrototype.Clone(); });

    Bounds2i pixelBounds = camera.GetFilm().PixelBounds();
    int spp = samplerPrototype.SamplesPerPixel();
    ProgressReporter progress(int64_t(spp) * pixelBounds.Area(), "Rendering");

    // 2. 파동(Wave) 단위 점진적 렌더링 진행
    int waveStart = 0, waveEnd = 1, nextWaveSize = 1;
    while (waveStart < spp) {
        // 2D 이미지 영역을 16x16 타일들로 분할하여 멀티스레드로 병렬 실행
        ParallelFor2D(pixelBounds, [&](Bounds2i tileBounds) {
            ScratchBuffer &scratchBuffer = scratchBuffers.Get();
            Sampler &sampler = samplers.Get();

            for (Point2i pPixel : tileBounds) {
                for (int sampleIndex = waveStart; sampleIndex < waveEnd; ++sampleIndex) {
                    sampler.StartPixelSample(pPixel, sampleIndex);
                    EvaluatePixelSample(pPixel, sampleIndex, sampler, scratchBuffer);
                }
            }
        });

        // 다음 파동 크기 2배 확장 (최대 64개 단위)
        waveStart = waveEnd;
        waveEnd = std::min(spp, waveEnd + nextWaveSize);
        nextWaveSize = std::min(2 * nextWaveSize, 64);
    }

    camera.GetFilm().WriteImage();
}`,
      explanationKo: 'ParallelFor2D()를 통해 전체 이미지를 16×16 크기의 사각형 타일로 쪼개어 스레드 풀에 분배합니다. 각 타일 내부에서는 픽셀들을 순회하며 EvaluatePixelSample()을 호출합니다.'
    },
    {
      type: 'figure',
      id: 'fig:task-time-distribution',
      number: 'Figure 1.17',
      title: 'Histogram of Time Spent Rendering Each Tile',
      titleKo: '타일별 렌더링 소요 시간 분포 히스토그램 (Workload Imbalance)',
      src: '/books/pbrt-4ed/images/pha01f17.svg',
      captionKo: '모아나 섬(Moana Island) 씬을 렌더링할 때 각 타일(Tile)을 계산하는 데 걸린 시간의 히스토그램입니다. 텅 빈 하늘 배경 타일은 눈 깜짝할 사이에 끝나지만, 수천만 개의 야자수 잎사귀와 복잡한 지형이 겹친 타일은 100배 이상의 시간이 걸립니다. pbrt의 타일 기반 동적 작업 큐는 이러한 부하 불균형(Workload Imbalance)을 자동으로 흡수하여 모든 CPU 코어가 쉬지 않고 일하도록 보장합니다.',
      captionEn: 'Figure 1.17: Histogram of time spent rendering each 16x16 tile for a complex scene. Simple background tiles take very little time, while tiles with rich vegetation and complex geometry take orders of magnitude longer. pbrt\'s dynamic tile scheduler smoothly load-balances these uneven workloads.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.3.5 RayIntegrator 구현 (RayIntegrator Implementation)',
      titleEn: '1.3.5 RayIntegrator Implementation'
    },
    {
      type: 'paragraph',
      textKo: '`RayIntegrator`는 `ImageTileIntegrator`를 상속받아, 카메라에서 픽셀을 통과하는 광선(Ray)을 쏘아 샘플을 계산하는 전형적인 카메라 중심 광선 추적기의 공통 파이프라인을 완성합니다.',
      textEn: 'RayIntegrator extends ImageTileIntegrator and provides an implementation of EvaluatePixelSample() that is suitable for all integrators that generate rays from the camera into the scene.'
    },
    {
      type: 'figure',
      id: 'fig:main-render-loop-classes',
      number: 'Figure 1.18',
      title: 'Class Relationships for EvaluatePixelSample',
      titleKo: 'RayIntegrator의 픽셀 샘플 평가 시 주요 클래스 협력 관계도',
      src: '/books/pbrt-4ed/images/pha01f18.svg',
      captionKo: 'Sampler(샘플러)가 무작위 난수들을 공급하면, Camera(카메라)가 광선(Ray)을 쏘아내고, RayIntegrator의 Li() 메서드가 씬과의 충돌 및 빛의 반사를 추적하여 방사휘도(Radiance)를 계산한 뒤, 최종적으로 Film(필름)에 필터 가중치를 곱해 픽셀 색상으로 기록하는 유기적 데이터 흐름입니다.',
      captionEn: 'Figure 1.18: Class relationships and data flow during RayIntegrator::EvaluatePixelSample(). The Sampler provides random sample points, the Camera generates rays, the Li() method simulates light transport, and the Film accumulates the weighted radiance into pixels.'
    },
    {
      type: 'code',
      chunkName: '<<RayIntegrator::EvaluatePixelSample>>=',
      language: 'cpp',
      code: `void RayIntegrator::EvaluatePixelSample(Point2i pPixel, int sampleIndex,
                                      Sampler sampler, ScratchBuffer &scratchBuffer) {
    // 1. 파장(Wavelength) 샘플링: 빛의 스펙트럼(색상) 결정
    Float lu = sampler.Get1D();
    SampledWavelengths lambda = camera.GetFilm().SampleWavelengths(lu);

    // 2. 픽셀 내 위치 및 셔터 시간 샘플링 (카메라 샘플 생성)
    Filter filter = camera.GetFilm().GetFilter();
    CameraSample cameraSample = GetCameraSample(sampler, pPixel, filter);

    // 3. 카메라로부터 씬으로 발사되는 광선 미분(RayDifferential) 생성
    pstd::optional<CameraRayDifferential> cameraRay =
        camera.GenerateRayDifferential(cameraSample, lambda);

    SampledSpectrum L(0.);
    VisibleSurface visibleSurface;
    if (cameraRay) {
        // 4. 안티에일리어싱을 위해 광선의 퍼짐 폭(미분) 스케일링
        Float rayDiffScale = std::max<Float>(.125f, 1 / std::sqrt((Float)sampler.SamplesPerPixel()));
        cameraRay->ray.ScaleDifferentials(rayDiffScale);

        // 5. 핵심 알고리즘 호출: 가상 함수 Li()를 통해 광선이 담아온 빛(Radiance) 계산!
        bool initializeVisibleSurface = camera.GetFilm().UsesVisibleSurface();
        L = cameraRay->weight * Li(cameraRay->ray, lambda, sampler, scratchBuffer,
                                   initializeVisibleSurface ? &visibleSurface : nullptr);
    }

    // 6. 계산된 빛의 양을 디지털 필름의 픽셀에 누적
    camera.GetFilm().AddSample(pPixel, L, lambda, &visibleSurface, cameraSample.filterWeight);
}`,
      explanationKo: 'EvaluatePixelSample()은 픽셀 하나를 완성하는 정밀한 6단계 파이프라인입니다. 하위 적분기 클래스는 오직 순수 가상 함수인 Li()만 구현하면, 카메라 모델이나 필름 필터링을 신경 쓸 필요 없이 광선이 싣고 오는 빛의 계산에만 집중할 수 있습니다.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.3.6 가장 단순한 패스 트레이서: 무작위 행보 적분기 (Random Walk Integrator)',
      titleEn: '1.3.6 Random Walk Integrator'
    },
    {
      type: 'paragraph',
      textKo: '이제 렌더러의 모든 기반 구조가 준비되었으므로, 빛을 실제로 계산하는 최초의 완전한 적분기 클래스인 `RandomWalkIntegrator`를 살펴볼 차례입니다.  \n이 클래스는 1.2절에서 소개했던 **렌더링 방정식(Rendering Equation)**을 풀기 위해, 가장 단순한 몬테카를로 **무작위 행보(Random Walk)** 알고리즘을 사용합니다. 광선이 표면에 부딪히면, 표면에서 나가는 빛($L_o$)은 자체 발광하는 빛($L_e$)과 주변에서 들어온 빛($L_i$)이 반사된 빛의 합으로 주어집니다:  \n$$L_o(p, \\omega_o) = L_e(p, \\omega_o) + \\int_{S^2} f(p, \\omega_o, \\omega_i) L_i(p, \\omega_i) |\\cos \\theta_i| d\\omega_i$$',
      textEn: 'Now we are ready to implement a complete integrator. The RandomWalkIntegrator estimates the light transport equation using a simple Monte Carlo random walk: at each surface intersection, it stochastically samples a direction leaving the surface, evaluates the surface scattering function, and recursively traces a ray in that direction.'
    },
    {
      type: 'code',
      chunkName: '<<RandomWalkIntegrator::LiRandomWalk>>=',
      language: 'cpp',
      code: `SampledSpectrum RandomWalkIntegrator::LiRandomWalk(
    RayDifferential ray, SampledWavelengths &lambda, Sampler sampler,
    ScratchBuffer &scratchBuffer, int depth) const {
    
    // 1. 광선과 씬의 충돌 검사
    pstd::optional<ShapeIntersection> si = Intersect(ray);
    if (!si) {
        // 아무것도 맞지 않았다면 무한 원거리 환경광(하늘 등)의 빛을 반환
        SampledSpectrum Le(0.f);
        for (Light light : infiniteLights)
            Le += light.Le(ray, lambda);
        return Le;
    }

    SurfaceInteraction &isect = si->intr;
    Vector3f wo = -ray.d;

    // 2. 부딪힌 표면 자체가 발광체(전등, 모닥불 등)라면 자체 방출광(Le) 획득
    SampledSpectrum Le = isect.Le(wo, lambda);

    // 3. 기저 조건: 최대 재귀 깊이(maxDepth)에 도달하면 탐색 중단
    if (depth == maxDepth)
        return Le;

    // 4. 표면의 양방향 산란 분포 함수(BSDF, 재질 특성) 획득
    BSDF bsdf = isect.GetBSDF(ray, lambda, camera, scratchBuffer, sampler);
    if (!bsdf)
        return Le;

    // 5. 몬테카를로 샘플링: 구면 전체 방향 중 무작위 방향 하나(wp)를 균일하게 추출
    Point2f u = sampler.Get2D();
    Vector3f wp = SampleUniformSphere(u);

    // 6. BSDF 반사율과 입사각 코사인(|cos theta|) 평가
    SampledSpectrum fcos = bsdf.f(wo, wp) * AbsDot(wp, isect.shading.n);
    if (!fcos)
        return Le;

    // 7. 재귀 호출(Recursion): 새로운 광선을 쏘아 들어온 빛(Li)을 구하고 확률 밀도(PDF = 1/(4*pi))로 나눔
    ray = isect.SpawnRay(wp);
    Float pdf = 1.0f / (4 * Pi);
    return Le + fcos * LiRandomWalk(ray, lambda, sampler, scratchBuffer, depth + 1) / pdf;
}`,
      explanationKo: '놀랍도록 직관적인 몬테카를로 재귀 알고리즘입니다! 광선이 물체에 닿을 때마다 무작위 방향으로 반사 광선을 다시 쏘고(SpawnRay), 반환된 빛의 세기에 재질 반사율(bsdf.f)과 입사각(cos)을 곱해 더해줍니다. 이것이 바로 영화 CG와 최신 게임 그래픽을 지탱하는 물리 기반 렌더링의 핵심 동작 원리입니다.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 수학/알고리즘 콕콕',
      title: '몬테카를로 적분과 Random Walk의 한계와 극복',
      summary: '왜 순수한 RandomWalkIntegrator는 노이즈가 심하고, 고급 패스 트레이서(PathIntegrator)가 필요할까?',
      points: [
        {
          title: '무작위 탐색의 비효율성 (작은 광원 문제)',
          content: '방 안에서 조그만 백열전구 하나가 켜져 있을 때, 표면에서 동서남북 완전히 무작위로 광선을 쏘면 광선이 저 작은 전구에 명중할 확률은 극히 희박합니다. 대부분의 광선은 어두운 벽만 헤매다 끝나므로 화면에 거친 점박이 노이즈(Noise)가 발생합니다.'
        },
        {
          title: '중요도 샘플링(Importance Sampling)과 차세대 적분기',
          content: '이 책의 14장에서 배울 진짜 패스 트레이서(PathIntegrator)는 무작정 무작위로 쏘지 않고, 광원이 있는 방향으로 의도적으로 광선을 유도하는 **차세대 이벤트 추정(Next Event Estimation)**과 **다중 중요도 샘플링(MIS)** 기법을 결합하여 동일한 계산량 대비 50배 이상 깨끗하고 아름다운 이미지를 완성합니다.'
        }
      ],
      tags: ['몬테카를로', '적분론', '확률론', '중요도 샘플링', '알고리즘 최적화']
    },
    {
      type: 'paragraph',
      textKo: '지금까지 우리는 pbrt가 어떻게 객체 지향적으로 구성되어 있는지, 커맨드 라인 실행부터 2D 타일 병렬 처리, 그리고 가장 원초적인 무작위 행보 적분기(RandomWalkIntegrator)까지 전체 렌더링 시스템의 골격을 모두 살펴보았습니다.  \n다음 1.4절에서는 이 방대한 지식의 숲에서 길을 잃지 않고, 독자의 배경지식과 목표에 맞춰 **이 책을 가장 효율적으로 독파하는 맞춤형 학습 로드맵(How to Proceed through This Book)**을 안내합니다.',
      textEn: 'We have now seen how pbrt is structured using object-oriented principles, from main() command-line invocation to parallel tile decomposition and the basic RandomWalkIntegrator. The next section, Section 1.4, discusses how best to proceed through the rest of the book depending on your background and interests.'
    }
  ]
};
