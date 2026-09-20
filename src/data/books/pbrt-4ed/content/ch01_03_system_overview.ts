import type { SectionContent } from '../../../../types/book';

export const CH01_03_SYSTEM_OVERVIEW: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "1",
  "chapterTitleKo": "제1장 소개 (Introduction)",
  "sectionNumber": "1.3",
  "sectionTitle": "pbrt: System Overview",
  "sectionTitleKo": "1.3 pbrt 시스템 전체 개요 (System Overview)",
  "originalUrl": "https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html",
  "prevSection": {
    "id": "ch01-02",
    "title": "1.2 사실적 렌더링과 광선 추적 알고리즘"
  },
  "nextSection": {
    "id": "ch01-04",
    "title": "1.4 이 책을 효율적으로 공부하는 법"
  },
  "summary": {
    "keyTakeaways": [
      "pbrt는 역할별 인터페이스로 모듈화하며, CPU 가상 함수와 CPU/GPU 공통 TaggedPointer 디스패치를 목적에 맞게 함께 사용합니다.",
      "실행 흐름은 3단계(씬 파싱 -> BVH 가속 구조 구축 -> 멀티스레드 2D 타일 렌더링 루프)로 명확히 분리됩니다.",
      "main() 함수는 옵션 파싱 후 InitPBRT()로 시스템을 초기화하고, 파서가 만든 씬을 렌더링한 뒤 CleanupPBRT()로 자원을 안전하게 회수합니다.",
      "ImageTileIntegrator는 이미지를 타일로 나누어 병렬 처리하고, 스레드별 ScratchBuffer와 샘플러를 사용해 임시 메모리·상태 공유 비용을 줄입니다.",
      "RandomWalkIntegrator는 광선이 물체와 부딪힐 때마다 구면 무작위 방향으로 광선을 재귀 반사시키는 순수 몬테카를로 기법으로 렌더링 방정식(Rendering Equation)을 계산합니다."
    ],
    "prerequisites": [
      "C++ 클래스 상속과 순수 가상 함수(Pure Virtual Function) 인터페이스",
      "멀티스레드 병렬 프로그래밍 기초 (작업 분할, 스레드 로컬 스토리지 TLS)",
      "재귀 함수(Recursion) 및 몬테카를로 확률 샘플링 기초"
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "textKo": "pbrt는 Shape, Material, Light, Camera, Integrator처럼 역할이 분명한 인터페이스를 중심으로 구성됩니다. 개념적인 인터페이스와 C++의 가상 기반 클래스는 같은 말이 아닙니다. CPU 적분기는 상속과 가상 함수를 사용하지만, 여러 CPU/GPU 공통 인터페이스는 TaggedPointer 기반의 타입 선택을 사용합니다. 호출자는 각 구현의 세부 표현을 몰라도 공통 연산을 사용할 수 있습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-03-b1"
    },
    {
      "type": "paragraph",
      "textKo": "새 형상이나 재질을 추가할 때는 필요한 인터페이스 메서드를 구현하고, 타입 목록과 객체 생성·장면 파싱 등의 등록 지점을 갱신해야 합니다. 새 클래스를 상속하고 컴파일하는 것만으로 기존 코드를 전혀 수정하지 않아도 된다는 뜻은 아닙니다. 이러한 모듈화는 렌더링 연구와 학습에서 알고리즘을 바꾸기 쉽게 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-03-b2"
    },
    {
      "type": "figure",
      "id": "fig:competition-snow",
      "number": "Figure 1.13",
      "title": "Original Figure 1.13",
      "titleKo": "원문 그림 1.13",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-13.png",
      "captionKo": "그림 1.13 · Guillaume Poncin과 Pramod Sharma의 렌더링 경진대회 작품입니다. L-system 나무, 발광 후처리, 메타볼 눈과 눈 내부의 산란 등 여러 구현을 PBRT에 추가했습니다.",
      "captionEn": "Figure 1.13: Guillaume Poncin and Pramod Sharma extended pbrt in numerous ways, implementing a number of complex rendering algorithms, to make this prize-winning image for Stanford’s CS348b rendering competition. The trees are modeled procedurally with L-systems, a glow image processing filter increases the apparent realism of the lights on the tree, snow was modeled procedurally with metaballs, and a subsurface scattering algorithm gave the snow its realistic appearance by accounting for the effect of light that travels beneath the snow for some distance before leaving it.",
      "width": 998,
      "height": 764,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig:ice-cave",
      "number": "Figure 1.14",
      "title": "Original Figure 1.14",
      "titleKo": "원문 그림 1.14",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-14.png",
      "captionKo": "그림 1.14 · Abe Davis, David Jacobs, Jongmin Baek의 얼음 동굴 작품입니다. 빙하 형성과 침식을 시뮬레이션하고 볼륨 포톤 매핑으로 내부 산란을 계산했습니다. 푸른색은 얼음의 파장별 흡수에서 나옵니다.",
      "captionEn": "Figure 1.14: Abe Davis, David Jacobs, and Jongmin Baek rendered this amazing image of an ice cave to take the grand prize in the 2009 Stanford CS348b rendering competition. They first implemented a simulation of the physical process of glaciation, the process where snow falls, melts, and refreezes over the course of many years, forming stratified layers of ice. They then simulated erosion of the ice due to melted water runoff before generating a geometric model of the ice. Scattering of light inside the volume was simulated with volumetric photon mapping; the blue color of the ice is entirely due to modeling the wavelength-dependent absorption of light in the ice volume.",
      "width": 998,
      "height": 1008,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig:cotton-candy",
      "number": "Figure 1.15",
      "title": "Original Figure 1.15",
      "titleKo": "원문 그림 1.15",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-15.png",
      "captionKo": "그림 1.15 · Chenlin Meng, Hubert Teo, Jiren Zhu의 솜사탕 작품입니다. 여러 겹의 곡선으로 외곽을 만들고 중심에는 참여 매질을 넣어 내부 산란을 효율적으로 모델링했습니다.",
      "captionEn": "Figure 1.15: Chenlin Meng, Hubert Teo, and Jiren Zhu rendered this tasty-looking image of cotton candy in a teacup to win the grand prize in the 2018 Stanford CS348b rendering competition. They modeled the cotton candy with multiple layers of curves and then filled the center with a participating medium to efficiently model scattering in its interior.",
      "width": 998,
      "height": 581,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig:imperial-crown",
      "number": "Figure 1.16",
      "title": "Original Figure 1.16",
      "titleKo": "원문 그림 1.16",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-16.png",
      "captionKo": "그림 1.16 · Martin Lubich가 Blender로 모델링한 오스트리아 왕관입니다. 약 350만 삼각형과 측정 스펙트럼을 쓰는 면광원 6개로 이루어졌습니다. 원문에 기록된 비교는 1,280 spp에서 과거 4코어 CPU의 73시간과 해당 GPU 환경의 184초입니다. 일반적인 성능 보장이 아닙니다.",
      "captionEn": "Figure 1.16: Martin Lubich modeled this scene of the Austrian Imperial Crown using Blender ; it was originally rendered using LuxRender, which started out as a fork of the pbrt-v1 codebase. The crown consists of approximately 3.5 million triangles that are illuminated by six area light sources with emission spectra based on measured data from a real-world light source. It was originally rendered with 1280 samples per pixel in 73 hours of computation on a quad-core CPU. On a modern GPU, pbrt renders this scene at the same sampling rate in 184 seconds.",
      "width": 998,
      "height": 1399,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.3.1 실행의 3단계 라이프사이클 (Phases of Execution)",
      "titleEn": "1.3.1 Phases of Execution",
      "id": "ch01-03-b7"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt가 사용자의 컴퓨터에서 실행되면, 개념적으로 크게 **세 가지 단계(Three Phases of Execution)**를 순차적으로 거치며 이미지를 만들어냅니다:  \n\n1. **씬 파일 파싱 (Scene Description Parsing)**: 사용자가 지정한 `.pbrt` 텍스트 파일을 읽어 토큰화하고, 파일에 적힌 카메라 설정, 조명 종류, 물체 좌표 및 재질 선언문들을 메모리 상의 구조체로 적재합니다.  \n2. **씬 구성 및 가속 구조 빌드 (Preprocessing & Scene Construction)**: 파싱된 원시 데이터를 실제 렌더링에 최적화된 기하학적 프리미티브(Primitive)와 가속 구조(BVH, Bounding Volume Hierarchy)로 변환합니다.  \n3. **메인 렌더링 루프 (Main Rendering Loop)**: 실제 빛과 광선을 계산하는 단계입니다. 컴퓨터의 전체 CPU 코어를 풀가동하여 수억~수십억 개의 광선을 추적하며, 렌더링 시간의 상당 부분이 바로 이 단계에서 소요됩니다.",
      "textEn": "pbrt can be conceptually divided into three phases of execution. First, it parses the scene description file, creating a BasicScene that stores the scene specification. Second, it converts the scene specification into geometric primitives and other objects that are used during rendering. In the third phase, the main rendering loop executes. This phase is where pbrt usually spends the majority of its execution time.",
      "id": "ch01-03-b8"
    },
    {
      "type": "paragraph",
      "textKo": "첫 번째 파싱 단계의 결과물은 `BasicScene` 클래스의 인스턴스입니다. 이 클래스는 씬에 등장하는 모든 물체와 광원, 카메라, 필름 설정들을 단순한 파라미터 사전(Key-Value Dictionary) 형태로 담고 있습니다.  \n두 번째 단계에서는 이 파라미터들을 읽어 실제 C++ 객체들을 생성합니다. 수백만 개의 삼각형들은 메모리에 최적화된 연속 버퍼로 올라가고, 광선 충돌 검사를 초고속으로 수행하기 위한 물체 집합을 분할하는 계층(BVH)가 멀티스레드로 빌드됩니다. 빌드가 완료되면 씬은 하나의 거대한 집합체 프리미티브(`Primitive aggregate`)로 묶이며, 모든 광원들은 `std::vector<Light>` 배열로 준비됩니다.",
      "textEn": "The result of the parsing phase is an instance of the BasicScene class, which stores the scene specification using generic parameter dictionaries. In the second phase, these representations are converted into actual C++ objects: geometric shapes, materials, area lights, cameras, and so on. An acceleration data structure like a bounding volume hierarchy is built over the scene's primitives, and all lights are collected into an array.",
      "id": "ch01-03-b9"
    },
    {
      "type": "paragraph",
      "textKo": "마지막 세 번째 단계에서는 **적분기(Integrator)** 객체의 `Render()` 메서드가 호출됩니다. Integrator는 카메라에서 출발한 광선들이 씬의 가속 구조와 충돌하는 위치를 찾고, 광원과 재질의 물리 법칙에 따라 반사 및 굴절되는 빛의 양(Radiance)을 누적하여 디지털 필름(Film)에 기록합니다. 계산이 모두 끝나면 필름 객체는 최종 이미지를 PNG나 EXR 파일 형식으로 디스크에 저장합니다.",
      "textEn": "In the third phase, the main rendering loop executes. The Integrator::Render() method is called. It simulates the propagation of light through the scene, generating samples that are recorded in an image Film. Once rendering is complete, the film writes the image to an output file.",
      "id": "ch01-03-b10"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.3.2 pbrt의 main() 함수 구현 (pbrt's main() Function)",
      "titleEn": "1.3.2 pbrt's main() Function",
      "id": "ch01-03-b11"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt 실행 파일의 진입점인 `main()` 함수는 소스 코드 트리의 `cmd/pbrt.cpp` 파일에 정의되어 있습니다. 약 150줄 남짓의 비교적 간결한 함수이며, 커맨드 라인 인자(옵션) 처리와 시스템 초기화/종료라는 정돈된 책임을 맡고 있습니다.",
      "textEn": "The main() function for the pbrt executable is defined in the file cmd/pbrt.cpp in the directory that holds the implementations of various command-line utilities. It is only a hundred and fifty or so lines of code, much of it devoted to processing command-line arguments and related bookkeeping.",
      "id": "ch01-03-b12"
    },
    {
      "type": "code",
      "chunkName": "<<main program>>=",
      "language": "cpp",
      "code": "int main(int argc, char *argv[]) {\n    // 1. 커맨드 라인 인자를 C++ 문자열 벡터로 변환\n    std::vector<std::string> args = GetCommandLineArguments(argc, argv);\n\n    // 2. 명령행 옵션 파싱 (PBRTOptions 구조체 채우기)\n    PBRTOptions options;\n    std::vector<std::string> filenames;\n    <<Process command-line arguments>>\n\n    // 3. pbrt 전역 시스템 초기화\n    InitPBRT(options);\n\n    // 4. 씬 파일 파싱 및 렌더링 실행\n    if (filenames.empty()) {\n        pbrt::Parser parser(new BasicSceneBuilder);\n        parser.Parse(stdin);\n    } else {\n        for (const std::string &fn : filenames) {\n            pbrt::Parser parser(new BasicSceneBuilder);\n            parser.ParseFile(fn);\n        }\n    }\n\n    // 5. 시스템 정리 및 자원 반환\n    CleanupPBRT();\n    return 0;\n}",
      "explanationKo": "pbrt 실행의 뼈대입니다. GetCommandLineArguments()로 인자를 받고, InitPBRT()로 스레드 풀과 메모리 풀을 준비한 뒤, 파서가 씬을 읽어 렌더링을 지시하고, 마지막에 CleanupPBRT()로 안전하게 뒷정리를 마칩니다.",
      "provenance": "teaching",
      "id": "ch01-03-b13"
    },
    {
      "type": "paragraph",
      "textKo": "InitPBRT와 CleanupPBRT는 시스템 자원의 초기화·정리를 명시적으로 짝지은 함수입니다. 함수 두 개를 호출하는 것 자체가 RAII는 아닙니다. RAII는 객체의 생성과 소멸에 자원 수명을 연결하여 예외나 조기 반환 때도 정리되게 하는 C++ 기법입니다. 명시적 정리 방식에서는 실패 경로와 호출 순서도 따로 관리해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-03-b14"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 아키텍처 콕콕",
      "title": "초기화·정리 순서와 객체 수명",
      "summary": "초기화·정리 순서와 객체 수명",
      "points": [
        {
          "title": "핵심 설명",
          "content": "전역 객체들의 초기화와 파괴 순서에는 번역 단위와 정의 방식에 따른 제약이 있습니다. 시스템에서 명시적으로 순서를 관리하면 의존성을 이해하기 쉬워지지만, 예외·조기 종료·중복 호출까지 자동으로 안전해지는 것은 아닙니다. 실제 자원 소유권과 정리 경로를 함께 확인해야 합니다."
        }
      ],
      "tags": [
        "C++17",
        "소프트웨어 아키텍처",
        "생명주기 관리",
        "RAII"
      ],
      "id": "ch01-03-b15"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.3.3 Integrator 추상 기본 인터페이스 (Integrator Interface)",
      "titleEn": "1.3.3 Integrator Interface",
      "id": "ch01-03-b16"
    },
    {
      "type": "paragraph",
      "textKo": "CPU 기반 렌더링 경로에서 빛의 수송(Light Transport)을 시뮬레이션하는 모든 알고리즘 클래스는 `Integrator` 추상 기본 클래스를 상속받습니다. 이 클래스는 `src/pbrt/cpu/integrator.h`에 선언되어 있습니다.",
      "textEn": "In the CPU rendering path, an instance of a class that implements the Integrator interface simulates light transport in the scene to render the image. The Integrator interface is declared in the file cpu/integrator.h.",
      "id": "ch01-03-b17"
    },
    {
      "type": "code",
      "chunkName": "<<Integrator Interface>>=",
      "language": "cpp",
      "code": "class Integrator {\n  public:\n    // 생성자: 씬 전체를 대표하는 단일 가속 구조 프리미티브와 광원 목록을 받음\n    Integrator(Primitive aggregate, std::vector<Light> lights)\n        : aggregate(aggregate), lights(lights) {\n        // 무한 원거리 환경광(Infinite Lights) 별도 필터링\n        for (const auto &light : lights)\n            if (light.Is<InfiniteLight>())\n                infiniteLights.push_back(light.Cast<InfiniteLight>());\n    }\n    virtual ~Integrator() = default;\n\n    // 메인 렌더링 순수 가상 함수: 하위 클래스가 반드시 구현해야 함\n    virtual void Render() = 0;\n\n    // 광선과 씬의 가장 가까운 교차점 찾기 (가속 구조 쿼리)\n    pstd::optional<ShapeIntersection> Intersect(const Ray &ray, Float tMax = Infinity) const;\n\n    // 두 지점 사이에 장애물이 있는지 여부만 빠르게 검사 (그림자 광선용)\n    bool IntersectP(const Ray &ray, Float tMax = Infinity) const;\n\n  protected:\n    Primitive aggregate;\n    std::vector<Light> lights;\n    std::vector<InfiniteLight> infiniteLights;\n};",
      "explanationKo": "모든 렌더러의 어머니가 되는 기본 인터페이스입니다. Render() 순수 가상 함수를 선언하여 실제 알고리즘을 하위 클래스에 위임하고, 광선 교차 검사를 위한 편리한 헬퍼 메서드(Intersect, IntersectP)를 제공합니다.",
      "provenance": "teaching",
      "id": "ch01-03-b18"
    },
    {
      "type": "paragraph",
      "textKo": "기본 `Integrator` 생성자는 씬에 존재하는 모든 기하학적 형상을 아우르는 단 하나의 `Primitive aggregate`와 광원 목록(`lights`)을 인자로 받습니다.  \n여기서 `aggregate`는 수십만 개의 개별 메쉬를 담고 있는 가속 트리(BVH)입니다. `Intersect()` 메서드는 이 가속 구조를 탐색하여 광선과 가장 먼저 충돌하는 표면의 교차 정보(`ShapeIntersection`)를 반환합니다. 반면 `IntersectP()`의 뒤에 붙은 `P`는 **술어(Predicate)**를 의미하며, 물체 정보 대신 \"빛이 가로막혔는가? (true/false)\"만을 초고속으로 검사하여 그림자 판정에 사용됩니다.",
      "textEn": "The base Integrator constructor takes a single Primitive that represents all the geometric objects in the scene, and a vector of Light pointers. The aggregate primitive usually holds a bounding volume hierarchy that accelerates intersection tests. Intersect() finds the closest intersection along a ray, while IntersectP() only tests whether any intersection exists along the ray up to tMax, which is much faster and useful for shadow rays.",
      "id": "ch01-03-b19"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.3.4 ImageTileIntegrator와 메인 렌더링 루프 (ImageTileIntegrator and Main Rendering Loop)",
      "titleEn": "1.3.4 ImageTileIntegrator and the Main Rendering Loop",
      "id": "ch01-03-b20"
    },
    {
      "type": "paragraph",
      "textKo": "대부분의 렌더링 알고리즘은 전체 이미지를 작은 2D 타일 단위로 쪼개어 독립적으로 계산할 수 있습니다. pbrt는 이 공통 기능을 별도의 중간 기반 클래스인 `ImageTileIntegrator`로 묶어 코드 중복을 방지했습니다.",
      "textEn": "Before implementing a basic integrator that simulates light transport to render an image, we will define an intermediate base class, ImageTileIntegrator, that handles decomposing the image into small rectangular tiles and rendering them concurrently using multiple CPU cores.",
      "id": "ch01-03-b21"
    },
    {
      "type": "code",
      "chunkName": "<<ImageTileIntegrator Definition>>=",
      "language": "cpp",
      "code": "class ImageTileIntegrator : public Integrator {\n  public:\n    ImageTileIntegrator(Camera camera, Sampler sampler, Primitive aggregate,\n                        std::vector<Light> lights)\n        : Integrator(aggregate, lights), camera(camera), samplerPrototype(sampler) {}\n\n    // 타일 분할 및 멀티스레드 병렬 실행 루프 구현\n    void Render();\n\n    // 개별 픽셀 샘플을 평가하는 순수 가상 메서드 (하위 클래스 구현)\n    virtual void EvaluatePixelSample(Point2i pPixel, int sampleIndex,\n                                     Sampler sampler, ScratchBuffer &scratchBuffer) = 0;\n\n  protected:\n    Camera camera;\n    Sampler samplerPrototype;\n};",
      "explanationKo": "ImageTileIntegrator는 Camera와 Sampler 프로토타입을 관리하며, Render() 함수 안에서 병렬 타일 루프를 실행합니다. 하위 클래스는 단지 EvaluatePixelSample()만 구현하면 자동으로 고성능 멀티스레드 렌더러가 됩니다.",
      "provenance": "teaching",
      "id": "ch01-03-b22"
    },
    {
      "type": "paragraph",
      "textKo": "`ImageTileIntegrator::Render()`의 실제 구현을 들여다보면, 최신 멀티스레드 CPU 아키텍처의 장점을 극대화하기 위한 두 가지 핵심 기법이 녹아 있습니다:  \n\n1. **스레드 로컬 스토리지 (ThreadLocal ScratchBuffer)**: 렌더링 도중에는 엄청난 양의 임시 객체가 생성되었다가 사라집니다. 만약 매 광선마다 `new/delete`나 `malloc/free`를 부르면 OS의 메모리 힙 락(Lock) 경합 때문에 멀티코어 성능이 급격히 떨어집니다. pbrt는 스레드마다 미리 확보된 고속 선형 메모리 버퍼(`ScratchBuffer`)를 제공하여 반복적인 할당의 비용을 줄입니다. 버퍼 확장과 객체 초기화 등의 비용까지 없어지는 것은 아닙니다.  \n2. **점진적 파동 렌더링 (Wave Rendering)**: 전체 샘플 수(`spp`)를 한 번에 다 계산하지 않고, 1개 샘플 파동, 2개 샘플 파동, 4개, 8개... 처럼 기하급수적으로 크기를 늘려가며 화면 전체를 훑습니다. 덕분에 사용자는 렌더링이 100% 끝나기를 기다릴 필요 없이, 실행 직후부터 점진적으로 선명해지는 이미지를 실시간으로 눈으로 확인할 수 있습니다.",
      "textEn": "The Render() method allocates a ThreadLocal ScratchBuffer for each worker thread, eliminating dynamic memory allocation contention. Furthermore, it renders the image in waves with exponentially increasing sample counts, allowing quick visual feedback of the image progress before all samples are completed.",
      "id": "ch01-03-b23"
    },
    {
      "type": "code",
      "chunkName": "<<ImageTileIntegrator::Render>>=",
      "language": "cpp",
      "code": "void ImageTileIntegrator::Render() {\n    // 1. 각 작업자 스레드 전용 스크래치 메모리와 독립 샘플러 준비\n    ThreadLocal<ScratchBuffer> scratchBuffers([]() { return ScratchBuffer(); });\n    ThreadLocal<Sampler> samplers([this]() { return samplerPrototype.Clone(); });\n\n    Bounds2i pixelBounds = camera.GetFilm().PixelBounds();\n    int spp = samplerPrototype.SamplesPerPixel();\n    ProgressReporter progress(int64_t(spp) * pixelBounds.Area(), \"Rendering\");\n\n    // 2. 파동(Wave) 단위 점진적 렌더링 진행\n    int waveStart = 0, waveEnd = 1, nextWaveSize = 1;\n    while (waveStart < spp) {\n        // 2D 이미지 영역을 16x16 타일들로 분할하여 멀티스레드로 병렬 실행\n        ParallelFor2D(pixelBounds, [&](Bounds2i tileBounds) {\n            ScratchBuffer &scratchBuffer = scratchBuffers.Get();\n            Sampler &sampler = samplers.Get();\n\n            for (Point2i pPixel : tileBounds) {\n                for (int sampleIndex = waveStart; sampleIndex < waveEnd; ++sampleIndex) {\n                    sampler.StartPixelSample(pPixel, sampleIndex);\n                    EvaluatePixelSample(pPixel, sampleIndex, sampler, scratchBuffer);\n                }\n            }\n        });\n\n        // 다음 파동 크기 2배 확장 (최대 64개 단위)\n        waveStart = waveEnd;\n        waveEnd = std::min(spp, waveEnd + nextWaveSize);\n        nextWaveSize = std::min(2 * nextWaveSize, 64);\n    }\n\n    camera.GetFilm().WriteImage();\n}",
      "explanationKo": "ParallelFor2D()를 통해 전체 이미지를 16×16 크기의 사각형 타일로 쪼개어 스레드 풀에 분배합니다. 각 타일 내부에서는 픽셀들을 순회하며 EvaluatePixelSample()을 호출합니다.",
      "provenance": "teaching",
      "id": "ch01-03-b24"
    },
    {
      "type": "figure",
      "id": "fig:task-time-distribution",
      "number": "Figure 1.17",
      "title": "Original Figure 1.17",
      "titleKo": "원문 그림 1.17",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-17.png",
      "captionKo": "그림 1.17 · 그림 1.11 장면의 타일별 렌더링 시간 분포입니다. 실행 시간이 넓게 퍼져 있어 위치마다 필요한 계산량이 다름을 보여 줍니다. 첨부 도표 축에는 밀리초가 표시되어 있으므로 원문 캡션의 초 단위 표현과 구분합니다.",
      "captionEn": "Figure 1.17: Histogram of Time Spent Rendering Each Tile for the Scene in Figure 1.11 . The horizontal axis measures time in seconds. Note the wide variation in execution time, illustrating that different parts of the image required substantially different amounts of computation.",
      "width": 998,
      "height": 448,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.3.5 RayIntegrator 구현 (RayIntegrator Implementation)",
      "titleEn": "1.3.5 RayIntegrator Implementation",
      "id": "ch01-03-b26"
    },
    {
      "type": "paragraph",
      "textKo": "`RayIntegrator`는 `ImageTileIntegrator`를 상속받아, 카메라에서 픽셀을 통과하는 광선(Ray)을 쏘아 샘플을 계산하는 전형적인 카메라 중심 광선 추적기의 공통 파이프라인을 완성합니다.",
      "textEn": "RayIntegrator extends ImageTileIntegrator and provides an implementation of EvaluatePixelSample() that is suitable for all integrators that generate rays from the camera into the scene.",
      "id": "ch01-03-b27"
    },
    {
      "type": "figure",
      "id": "fig:main-render-loop-classes",
      "number": "Figure 1.18",
      "title": "Original Figure 1.18",
      "titleKo": "원문 그림 1.18",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-18.png",
      "captionKo": "그림 1.18 · Sampler가 표본을 공급하고 Camera가 광선을 만들며 Li()가 방사휘도를 구합니다. Film은 표본과 그 빛의 기여를 이미지에 누적합니다.",
      "captionEn": "Figure 1.18: Class Relationships for RayIntegrator::EvaluatePixelSample() ’s computation. The Sampler provides sample values for each image sample to be taken. The Camera turns a sample into a corresponding ray from the film plane, and the Li() method computes the radiance along that ray arriving at the film. The sample and its radiance are passed to the Film , which stores their contribution in an image.",
      "width": 998,
      "height": 262,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "chunkName": "<<RayIntegrator::EvaluatePixelSample>>=",
      "language": "cpp",
      "code": "void RayIntegrator::EvaluatePixelSample(Point2i pPixel, int sampleIndex,\n                                      Sampler sampler, ScratchBuffer &scratchBuffer) {\n    // 1. 파장(Wavelength) 샘플링: 빛의 스펙트럼(색상) 결정\n    Float lu = sampler.Get1D();\n    SampledWavelengths lambda = camera.GetFilm().SampleWavelengths(lu);\n\n    // 2. 픽셀 내 위치 및 셔터 시간 샘플링 (카메라 샘플 생성)\n    Filter filter = camera.GetFilm().GetFilter();\n    CameraSample cameraSample = GetCameraSample(sampler, pPixel, filter);\n\n    // 3. 카메라로부터 씬으로 발사되는 광선 미분(RayDifferential) 생성\n    pstd::optional<CameraRayDifferential> cameraRay =\n        camera.GenerateRayDifferential(cameraSample, lambda);\n\n    SampledSpectrum L(0.);\n    VisibleSurface visibleSurface;\n    if (cameraRay) {\n        // 4. 안티에일리어싱을 위해 광선의 퍼짐 폭(미분) 스케일링\n        Float rayDiffScale = std::max<Float>(.125f, 1 / std::sqrt((Float)sampler.SamplesPerPixel()));\n        cameraRay->ray.ScaleDifferentials(rayDiffScale);\n\n        // 5. 핵심 알고리즘 호출: 가상 함수 Li()를 통해 광선이 담아온 빛(Radiance) 계산!\n        bool initializeVisibleSurface = camera.GetFilm().UsesVisibleSurface();\n        L = cameraRay->weight * Li(cameraRay->ray, lambda, sampler, scratchBuffer,\n                                   initializeVisibleSurface ? &visibleSurface : nullptr);\n    }\n\n    // 6. 계산된 빛의 양을 디지털 필름의 픽셀에 누적\n    camera.GetFilm().AddSample(pPixel, L, lambda, &visibleSurface, cameraSample.filterWeight);\n}",
      "explanationKo": "EvaluatePixelSample()은 픽셀 하나를 완성하는 정밀한 6단계 파이프라인입니다. 하위 적분기 클래스는 오직 순수 가상 함수인 Li()만 구현하면, 카메라 모델이나 필름 필터링을 신경 쓸 필요 없이 광선이 싣고 오는 빛의 계산에만 집중할 수 있습니다.",
      "provenance": "teaching",
      "id": "ch01-03-b29"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.3.6 가장 단순한 패스 트레이서: 무작위 행보 적분기 (Random Walk Integrator)",
      "titleEn": "1.3.6 Random Walk Integrator",
      "id": "ch01-03-b30"
    },
    {
      "type": "paragraph",
      "textKo": "이제 렌더러의 모든 기반 구조가 준비되었으므로, 빛을 실제로 계산하는 최초의 완전한 적분기 클래스인 `RandomWalkIntegrator`를 살펴볼 차례입니다.  \n이 클래스는 1.2절에서 소개했던 **렌더링 방정식(Rendering Equation)**을 풀기 위해, 가장 단순한 몬테카를로 **무작위 행보(Random Walk)** 알고리즘을 사용합니다. 광선이 표면에 부딪히면, 표면에서 나가는 빛($L_o$)은 자체 발광하는 빛($L_e$)과 주변에서 들어온 빛($L_i$)이 반사된 빛의 합으로 주어집니다:  \n$$L_o(p, \\omega_o) = L_e(p, \\omega_o) + \\int_{S^2} f(p, \\omega_o, \\omega_i) L_i(p, \\omega_i) |\\cos \\theta_i| d\\omega_i$$",
      "textEn": "Now we are ready to implement a complete integrator. The RandomWalkIntegrator estimates the light transport equation using a simple Monte Carlo random walk: at each surface intersection, it stochastically samples a direction leaving the surface, evaluates the surface scattering function, and recursively traces a ray in that direction.",
      "id": "ch01-03-b31"
    },
    {
      "type": "code",
      "chunkName": "<<RandomWalkIntegrator::LiRandomWalk>>=",
      "language": "cpp",
      "code": "SampledSpectrum RandomWalkIntegrator::LiRandomWalk(\n    RayDifferential ray, SampledWavelengths &lambda, Sampler sampler,\n    ScratchBuffer &scratchBuffer, int depth) const {\n    \n    // 1. 광선과 씬의 충돌 검사\n    pstd::optional<ShapeIntersection> si = Intersect(ray);\n    if (!si) {\n        // 아무것도 맞지 않았다면 무한 원거리 환경광(하늘 등)의 빛을 반환\n        SampledSpectrum Le(0.f);\n        for (Light light : infiniteLights)\n            Le += light.Le(ray, lambda);\n        return Le;\n    }\n\n    SurfaceInteraction &isect = si->intr;\n    Vector3f wo = -ray.d;\n\n    // 2. 부딪힌 표면 자체가 발광체(전등, 모닥불 등)라면 자체 방출광(Le) 획득\n    SampledSpectrum Le = isect.Le(wo, lambda);\n\n    // 3. 기저 조건: 최대 재귀 깊이(maxDepth)에 도달하면 탐색 중단\n    if (depth == maxDepth)\n        return Le;\n\n    // 4. 표면의 양방향 산란 분포 함수(BSDF, 재질 특성) 획득\n    BSDF bsdf = isect.GetBSDF(ray, lambda, camera, scratchBuffer, sampler);\n    if (!bsdf)\n        return Le;\n\n    // 5. 몬테카를로 샘플링: 구면 전체 방향 중 무작위 방향 하나(wp)를 균일하게 추출\n    Point2f u = sampler.Get2D();\n    Vector3f wp = SampleUniformSphere(u);\n\n    // 6. BSDF 반사율과 입사각 코사인(|cos theta|) 평가\n    SampledSpectrum fcos = bsdf.f(wo, wp) * AbsDot(wp, isect.shading.n);\n    if (!fcos)\n        return Le;\n\n    // 7. 재귀 호출(Recursion): 새로운 광선을 쏘아 들어온 빛(Li)을 구하고 확률 밀도(PDF = 1/(4*pi))로 나눔\n    ray = isect.SpawnRay(wp);\n    Float pdf = 1.0f / (4 * Pi);\n    return Le + fcos * LiRandomWalk(ray, lambda, sampler, scratchBuffer, depth + 1) / pdf;\n}",
      "explanationKo": "놀랍도록 직관적인 몬테카를로 재귀 알고리즘입니다! 광선이 물체에 닿을 때마다 무작위 방향으로 반사 광선을 다시 쏘고(SpawnRay), 반환된 빛의 세기에 재질 반사율(bsdf.f)과 입사각(cos)을 곱해 더해줍니다. 이것이 바로 영화 CG와 최신 게임 그래픽을 지탱하는 물리 기반 렌더링의 핵심 동작 원리입니다.",
      "provenance": "teaching",
      "id": "ch01-03-b32"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 수학/알고리즘 콕콕",
      "title": "무작위 행보의 한계와 개선",
      "summary": "무작위 행보의 한계와 개선",
      "points": [
        {
          "title": "핵심 설명",
          "content": "균일하게 방향을 뽑으면 작은 광원을 놓치는 경우가 많아 분산이 커질 수 있습니다. 13장의 표면 경로 추적기는 광원 샘플링, BSDF 샘플링, MIS 등을 결합합니다. 14장은 매질까지 확장합니다. NEE는 ‘다음 사건 추정’이며 세대가 더 최신이라는 뜻이 아닙니다. 성능 향상률은 장면과 계산 조건에 따라 달라집니다."
        }
      ],
      "tags": [
        "몬테카를로",
        "적분론",
        "확률론",
        "중요도 샘플링",
        "알고리즘 최적화"
      ],
      "id": "ch01-03-b33"
    },
    {
      "type": "paragraph",
      "textKo": "지금까지 우리는 pbrt가 어떻게 객체 지향적으로 구성되어 있는지, 커맨드 라인 실행부터 2D 타일 병렬 처리, 그리고 가장 원초적인 무작위 행보 적분기(RandomWalkIntegrator)까지 전체 렌더링 시스템의 골격을 모두 살펴보았습니다.  \n다음 1.4절에서는 이 방대한 지식의 숲에서 길을 잃지 않고, 독자의 배경지식과 목표에 맞춰 **이 책을 가장 효율적으로 독파하는 맞춤형 학습 로드맵(How to Proceed through This Book)**을 안내합니다.",
      "textEn": "We have now seen how pbrt is structured using object-oriented principles, from main() command-line invocation to parallel tile decomposition and the basic RandomWalkIntegrator. The next section, Section 1.4, discusses how best to proceed through the rest of the book depending on your background and interests.",
      "id": "ch01-03-b34"
    },
    {
      "type": "subheading",
      "id": "ch01-03-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch01-03-source-figure-1-19",
      "number": "Figure 1.19",
      "title": "Original Figure 1.19",
      "titleKo": "원문 그림 1.19",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-19.png",
      "captionKo": "그림 1.19 · RandomWalkIntegrator로 렌더링한 Watercolor 장면입니다. 완전 정반사 계열을 처리하지 못해 유리잔이 검고, 8,192 spp에서도 벽과 의자 아래에 잡음이 남습니다. 장면 제공: Angelo Ferretti.",
      "captionEn": "Figure 1.19: A View of the Watercolor Scene, Rendered with the RandomWalkIntegrator . Because the RandomWalkIntegrator does not handle perfectly specular surfaces, the two glasses on the table are black. Furthermore, even with the 8,192 samples per pixel used to render this image, the result is still peppered with high-frequency noise. (Note, for example, the far wall and the base of the chair.) (Scene courtesy of Angelo Ferretti.)",
      "width": 998,
      "height": 1329,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch01-03-source-figure-1-20",
      "number": "Figure 1.20",
      "title": "Original Figure 1.20",
      "titleKo": "원문 그림 1.20",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-20.png",
      "captionKo": "그림 1.20 · Watercolor 장면을 32 spp로 비교합니다. RandomWalkIntegrator보다 개선된 몬테카를로 기법을 쓰는 PathIntegrator가 비슷한 계산량에서 더 좋은 결과를 냅니다. 원문 예제에서는 평균제곱오차가 54.5배 감소했습니다.",
      "captionEn": "Figure 1.20: Watercolor Scene Rendered Using 32 Samples per Pixel. (a) Rendered using the RandomWalkIntegrator . (b) Rendered using the PathIntegrator , which follows the same general approach but uses more sophisticated Monte Carlo techniques. The PathIntegrator gives a substantially better image for roughly the same amount of work, with 54.5 times reduction in mean squared error.",
      "width": 998,
      "height": 1401,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/pbrt_System_Overview.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "f10b5c1ba95f56191de976a297ad423cf1676066be2285c03afcb5d9873fc3f5",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "1.3 pbrt: System Overview",
      "1.3.1  Phases of Execution",
      "1.3.2 pbrt ’s main() Function",
      "1.3.3  Integrator Interface",
      "1.3.4  ImageTileIntegrator and the\nMain Rendering Loop",
      "1.3.5  RayIntegrator Implementation",
      "1.3.6  Random Walk Integrator"
    ],
    "sourceFigures": [
      "1.13",
      "1.14",
      "1.15",
      "1.16",
      "1.17",
      "1.18",
      "1.19",
      "1.20"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
