import { SectionContent } from '../../../../types/book';

export const CH01_06_HISTORY: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '1',
  chapterTitleKo: '제1장 소개 (Introduction)',
  sectionNumber: '1.6',
  sectionTitle: 'A Brief History of Physically Based Rendering',
  sectionTitleKo: '1.6 물리 기반 렌더링의 간략한 역사 (A Brief History of PBR)',
  originalUrl: 'https://pbr-book.org/4ed/Introduction/A_Brief_History_of_Physically_Based_Rendering.html',
  prevSection: {
    id: 'ch01-05',
    title: '1.5 코드 이해 및 활용 가이드',
  },
  nextSection: {
    id: 'ch02-01',
    title: '2.1 몬테카를로 적분의 기초 원리',
  },
  summary: {
    keyTakeaways: [
      '블린의 법칙(Blinn\'s Law): 컴퓨터 하드웨어가 1,000배 빨라져도 프레임당 렌더링 시간은 언제나 약 1시간으로 유지됩니다. 컴퓨터가 빨라진 만큼 예술가들이 더 거대하고 정교한 물리 시뮬레이션을 요구하기 때문입니다.',
      '학술 연구의 황금기: 1980년 휘티드(Whitted)의 광선 추적, 1984년 쿡(Cook)의 분산 광선 추적, 1986년 카지야(Kajiya)의 렌더링 방정식, 1997년 에릭 비치(Eric Veach)의 다중 중요도 샘플링(MIS)이 PBR의 수학적 뼈대를 완성했습니다.',
      '산업계의 대전환(The Great Convergence): 과거 메모리 부족(수 MB)으로 인해 래스터화(REYES)를 썼던 할리우드 영화계는 2010년대에 이르러 전 세계 모든 주요 스튜디오(디즈니, 픽사, 소니, 웨타 등)가 순수 몬테카를로 패스 트레이싱으로 완전히 전환했습니다.',
      '광선 추적이 승리한 이유: 지오메트리가 수십억 개로 폭증할 때, 래스터화의 O(N) 전수 조사보다 BVH 가속 구조를 활용한 광선 추적의 O(log N) 탐색 복잡도가 압도적으로 유리했기 때문입니다.'
    ],
    prerequisites: [
      '컴퓨터 그래픽스 발전사 및 래스터화(Rasterization) vs 광선 추적(Ray Tracing) 개념',
      '알고리즘 시간 복잡도 (O(N) vs O(log N))'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: '1970년대 컴퓨터 그래픽스의 태동기에는 눈앞에 놓인 가장 시급한 문제를 해결하는 것이 급선무였습니다. 3차원 공간 속에서 다른 물체에 가려진 면을 어떻게 판별할 것인가(은면 제거, Hidden-Surface Removal), 그리고 컴퓨터 화면에 매끄러운 곡면 음영(구로 셰이딩, 퐁 셰이딩)을 어떻게 띄울 것인가가 주된 연구 과제였습니다. 당시에는 컴퓨터의 메모리가 수 킬로바이트(KB) 수준에 불과하고 프로세서 연산 속도가 극도로 느렸기 때문에, 빛의 정밀한 물리적 법칙을 컴퓨터로 시뮬레이션한다는 것은 꿈조차 꿀 수 없었습니다.',
      textEn: 'Through the early years of computer graphics in the 1970s, the most important problems to solve were basic ones: how to represent 3D objects, how to determine which parts of them were visible, and how to shade them. Computational resources were scarce: computers had small memories, processors were slow, and simple, non-physically based algorithms were used to make images.'
    },
    {
      type: 'paragraph',
      textKo: '컴퓨터 하드웨어가 눈부시게 발전하고 메모리 가격이 저렴해지면서 그래픽스 연구자들은 점차 더 정교한 계산을 시도할 수 있게 되었습니다. 그러나 컴퓨터 그래픽스의 선구자인 짐 블린(Jim Blinn)은 흥미로운 관찰을 남겼습니다:  \n\n' +
        '> **"컴퓨터가 아무리 빨라져도, 한 프레임을 렌더링하는 데 걸리는 시간은 언제나 약 1시간 안팎으로 일정하다."**  \n' +
        '> — **블린의 법칙 (Blinn\'s Law)**  \n\n' +
        '컴퓨터가 10배, 1,000배 빨라지면 렌더링이 1초 만에 끝나는 것이 아니라, 아티스트와 감독들이 컴퓨터가 감당할 수 있는 한계치까지 폴리곤 수를 수천만 개로 늘리고, 미세 먼지와 볼륨 안개, 복잡한 털(Fur)과 옷감 시뮬레이션을 때려 넣기 때문입니다. 즉, 시각 예술가들이 꿈꾸는 현실과 컴퓨터 하드웨어 성능 사이에는 언제나 건강한 긴장감이 존재합니다.',
      textEn: 'As computers have become more capable and less expensive, it has become possible to consider more computationally intensive approaches to rendering. However, Jim Blinn observed that as computers become faster, rendering times per frame tend to remain roughly constant (typically about an hour per frame for production animation). Blinn\'s law captures the dynamic that artists and directors continually increase the visual complexity of scenes to match growing computational capabilities.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 역사/상식 콕콕',
      title: '블린의 법칙(Blinn\'s Law)과 컴퓨팅 파워의 역설',
      summary: '하드웨어가 빨라질수록 소프트웨어 엔지니어가 더 깊은 물리와 수학을 고민해야 하는 이유',
      points: [
        {
          title: '컴퓨팅 성능이 한계치를 돌파할 때 생기는 변화',
          content: '과거에는 빛이 대기 중에 산란하는 볼륨 현상을 가짜 2D 포그 텍스처로 덧칠했습니다. 하지만 컴퓨터가 수천 배 빨라진 오늘날에는 빛의 파장별 산란 미적분 방정식을 직접 풀어야만 관객들의 눈높이를 만족시킬 수 있습니다.'
        },
        {
          title: '알고리즘의 점근적 효율성(Asymptotics)',
          content: '하드웨어가 아무리 발전해도 $O(N)$ 알고리즘과 $O(\\log N)$ 알고리즘의 격차는 결코 메워지지 않습니다. 씬의 데이터가 테라바이트 단위로 커질수록, 주먹구구식 꼼수보다 물리 법칙에 기반한 몬테카를로 광선 추적이 진가를 발휘하게 됩니다.'
        }
      ],
      tags: ['블린의 법칙', '컴퓨터 그래픽스 역사', '하드웨어 발전', '컴퓨팅 복잡도']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.6.1 학술 연구의 위대한 여정 (Research Milestones)',
      titleEn: '1.6.1 Research'
    },
    {
      type: 'paragraph',
      textKo: '물리 법칙에 기반한 렌더링 접근법이 본격적으로 학계의 주목을 받기 시작한 것은 1980년대 초반이었습니다.  \n\n' +
        '1. **1980년: 터너 휘티드(Turner Whitted)의 재귀적 광선 추적**  \n' +
        '   빛의 반사와 굴절, 선명한 그림자를 재귀적 광선 탐색으로 시뮬레이션하여 그래픽스 역사상 최초로 거울처럼 비치는 구와 투명한 유리구슬 이미지를 선보였습니다.  \n\n' +
        '2. **1981년: 쿡-토런스(Cook-Torrance) 미세면 반사 모델**  \n' +
        '   물리학의 광학 이론을 컴퓨터 그래픽스에 최초로 성공적으로 이식한 모델입니다. 금속 표면의 미세한 거칠기(Microfacets)와 비스듬히 볼수록 빛이 강하게 반사되는 프레넬(Fresnel) 법칙을 정밀한 수식으로 정립했습니다.  \n\n' +
        '3. **1984년: 라디오시티(Radiosity)와 분산 광선 추적(Distributed Ray Tracing)**  \n' +
        '   고랄(Goral) 등은 열복사 전달 이론을 차용하여 벽과 벽 사이에 빛이 은은하게 번지는 상호 반사(Diffuse Interreflection)를 계산하는 라디오시티 기법을 발표했습니다. 같은 해 로버트 쿡(Robert Cook) 등은 확률적 몬테카를로 샘플링을 광선에 접목하여 부드러운 그림자(Soft Shadow), 피사계 심도(아웃포커싱), 모션 블러(Motion Blur)를 자연스럽게 표현해 냈습니다.  \n\n' +
        '4. **1986년: 제임스 카지야(James Kajiya)의 렌더링 방정식(Rendering Equation)**  \n' +
        '   컴퓨터 그래픽스의 단일 논문 중 가장 위대한 논문으로 꼽히는 명저입니다. 카지야는 산재해 있던 모든 빛의 전파 현상을 하나의 우아한 적분 방정식으로 통합 정립하고, 마르코프 체인과 몬테카를로 기법을 이용한 **패스 트레이싱(Path Tracing)** 알고리즘을 탄생시켰습니다.  \n\n' +
        '5. **1997년: 에릭 비치(Eric Veach)의 박사 학위 논문 (스탠퍼드 대학교)**  \n' +
        '   에릭 비치는 몬테카를로 빛 수송 이론을 비약적으로 발전시켰습니다. 서로 다른 샘플링 전략을 최적의 가중치로 융합하여 분산을 획기적으로 낮추는 **다중 중요도 샘플링(MIS, Multiple Importance Sampling)**과 메트로폴리스 광선 수송(MLT), 양방향 패스 트레이싱(BDPT)을 수학적으로 완벽히 증명했습니다. 비치의 이론은 오늘날 모든 상용 렌더러의 표준 핵심 엔진이 되었습니다.',
      textEn: 'Physically based approaches to rendering started to be seriously considered by graphics researchers in the early 1980s. Whitted (1980) introduced recursive ray tracing. Cook and Torrance (1981) introduced a microfacet-based specular reflection model grounded in physics. In 1984, Goral et al. introduced radiosity, and Cook, Porter, and Carpenter introduced distributed ray tracing. Shortly afterward, Kajiya (1986) published the rendering equation and path tracing. A crucial breakthrough came in 1997 with Eric Veach\'s Stanford Ph.D. dissertation, which introduced multiple importance sampling (MIS), bidirectional path tracing, and Metropolis light transport, establishing the mathematical foundations of modern rendering.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '1.6.2 할리우드 영화 산업과 대전환 (The Production Revolution)',
      titleEn: '1.6.2 Production'
    },
    {
      type: 'paragraph',
      textKo: '1980~1990년대 초기 컴퓨터 애니메이션 영화 제작(픽사의 《토이 스토리》 등)에서는 광선 추적 대신 **REYES 알고리즘 기반의 래스터화(Rasterization) 렌더러(대표적으로 픽사의 RenderMan)**가 업계를 완벽히 지배했습니다.  \n' +
        '당시 워크스테이션 컴퓨터의 RAM 메모리는 고작 32MB~128MB 수준이었습니다. 거대한 씬 전체를 메모리에 올려두고 광선을 자유자재로 쏘아대는 광선 추적은 메모리 부족으로 도저히 불가능했습니다. 반면 REYES 래스터화 엔진은 지오메트리를 작은 타일 단위로 잘게 쪼개어 화면에 투영한 뒤 메모리에서 즉시 지워버리는 방식으로 적은 메모리에서도 영화급 장면을 렌더링할 수 있었습니다.',
      textEn: 'In the 1980s and 1990s, production rendering for film was dominated by rasterization-based architectures, most notably the REYES algorithm implemented in Pixar\'s RenderMan. Computers at the time had very limited RAM (tens or hundreds of megabytes), making it impossible to store entire production scenes in memory for ray tracing. REYES streamed geometric primitives in pipeline stages, operating efficiently within strict memory limits.'
    },
    {
      type: 'figure',
      id: 'fig:gravity-shot',
      number: 'Figure 1.21',
      title: 'Gravity (2013) Movie Render',
      titleKo: '영화 《그래비티(Gravity, 2013)》의 아놀드(Arnold) 렌더링 장면',
      src: '/books/pbrt-4ed/images/gravity.png',
      captionKo: '알폰소 쿠아론 감독의 영화 《그래비티》는 프레임스토어(Framestore)가 순수 물리 기반 패스 트레이서인 아놀드(Arnold)를 사용하여 시각 효과를 완성했습니다. 대기권 밖 우주 공간에서 지구 대기광의 산란과 우주복, 우주 정거장의 복잡한 금속 표면 반사를 완벽한 물리 법칙으로 추적하여 아카데미 시각효과상을 수상했습니다.',
      captionEn: 'Figure 1.21: Gravity (2013) featured spectacular computer-generated imagery of a realistic space environment with volumetric scattering and large numbers of anisotropic metal surfaces. The image was rendered with the Arnold physically based ray tracer by Framestore.'
    },
    {
      type: 'paragraph',
      textKo: '하지만 2000년대 후반에 접어들며 컴퓨터 메모리가 수십 기가바이트(GB)로 커지고 멀티코어 CPU가 대중화되면서 거대한 지각 변동이 일어났습니다.  \n' +
        '마르코스 파하르도(Marcos Fajardo)가 개발한 순수 몬테카를로 레이트레이서 **아놀드(Arnold)**가 소니 픽처스 이미지웍스의 《몬스터 하우스(2006)》, 《하늘에서 음식이 내린다면(2009)》에 전면 도입되어 경이로운 시각적 리얼리즘을 입증했습니다.  \n\n' +
        '이후 2010년대에 이르러 전 세계 모든 주요 스튜디오는 30년간 써오던 래스터화 파이프라인을 완전히 버리고 순수 물리 기반 패스 트레이싱으로 대전환(The Great Convergence)을 마쳤습니다:  \n' +
        '- **픽사(Pixar)**: 기존 REYES 렌더맨을 완전히 폐기하고 물리 기반 광선 추적 엔진인 RenderMan RIS로 전면 재작성 (《도리를 찾아서》 등)  \n' +
        '- **월트 디즈니 애니메이션 스튜디오**: 자체 순수 패스 트레이서 하이페리온(Hyperion) 개발 (《빅 히어로》, 《모아나》)  \n' +
        '- **웨타 디지털(Weta Digital)**: 독자적 물리 기반 렌더러 마누카(Manuka) 구축 (《혹성탈출》 시리즈, 《알리타: 배틀 엔젤》, 《아바타: 물의 길》)',
      textEn: 'In the late 2000s and 2010s, a historic transition occurred across the film visual effects and animation industries. Driven by Marcos Fajardo\'s Arnold renderer at Sony Pictures Imageworks, studios realized that Monte Carlo path tracing produced vastly superior images with less artist setup time. Pixar completely re-engineered RenderMan from REYES to RIS path tracing, Disney developed the Hyperion path tracer, and Weta Digital built the Manuka renderer.'
    },
    {
      type: 'figure',
      id: 'fig:alita-shot',
      number: 'Figure 1.22',
      title: 'Alita: Battle Angel (2019) Movie Render',
      titleKo: '영화 《알리타: 배틀 엔젤(Alita: Battle Angel, 2019)》',
      src: '/books/pbrt-4ed/images/alita.png',
      captionKo: '웨타 디지털(Weta Digital)의 물리 기반 렌더러 마누카(Manuka)로 렌더링된 알리타의 정밀 클로즈업 샷입니다. 수억 개의 정밀 피부 모공, 인간의 홍채 내부 섬유 구조와 각막의 복잡한 굴절, 미세 솜털 하나하나를 물리 기반 광선 추적으로 완벽히 구현하여 불쾌한 골짜기(Uncanny Valley)를 극복했습니다.',
      captionEn: 'Figure 1.22: This image from Alita: Battle Angel (2019) was rendered using Weta Digital\'s Manuka physically based rendering system, simulating millions of hair strands, skin pores, and internal eye scattering with physical fidelity.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 알고리즘 콕콕',
      title: '왜 래스터화(O(N)) 대신 광선 추적(O(log N))이 영화계를 정복했을까?',
      summary: '지오메트리 복잡도 폭증 시대에 알고리즘 빅오(Big-O) 표기법이 증명한 필연적 승리',
      points: [
        {
          title: '래스터화의 한계: 폴리곤 수에 비례하는 O(N) 비용',
          content: '래스터화(Rasterization)는 씬에 존재하는 모든 삼각형을 화면에 투영해야 하므로, 폴리곤이 1억 개면 1억 번의 루프를 돌아야 합니다. 영화 씬의 디테일이 급증하자 래스터화는 감당할 수 없는 병목에 부딪혔습니다.'
        },
        {
          title: '광선 추적의 승리: BVH 계층 트리의 O(log N) 탐색',
          content: '광선 추적은 바운딩 볼륨 계층(BVH) 트리를 타고 내려가므로 삼각형이 1,000배(10억 개) 늘어나도 트리 깊이는 불과 몇 단계($\\log_2 N$) 늘어날 뿐입니다. 또한 사실적인 그림자, 간접 반사광, 흐린 유리, 모션 블러를 단일 수학 모델로 통일할 수 있다는 점이 압도적인 생산성 우위를 가져왔습니다.'
        }
      ],
      tags: ['알고리즘 복잡도', '빅오 표기법', 'BVH 가속', '래스터화 vs 레이트레이싱']
    },
    {
      type: 'paragraph',
      textKo: '이제 우리는 1970년대의 단순한 점과 선에서 시작하여, 수학과 물리, 소프트웨어 공학, 하드웨어 발전이 씨실과 날실로 엮여 오늘의 경이로운 물리 기반 렌더링 세계를 완성해 낸 거대한 서사를 모두 목격했습니다.  \n' +
        '이것으로 **제1장 소개(Introduction)**의 모든 여정을 성공적으로 마쳤습니다!  \n\n' +
        '이어지는 **제2장 몬테카를로 적분(Monte Carlo Integration)**에서는, 컴퓨터가 어떻게 무작위 주사위를 굴려 우주의 가장 복잡한 물리 적분 방정식들을 오차 없이 아름답게 풀어내는지, 그 눈부신 확률 컴퓨터 수학의 세계로 본격적으로 뛰어들겠습니다.',
      textEn: 'We have now seen how physically based rendering evolved from early academic breakthroughs in the 1980s into the universal standard across the visual computing world today. This concludes Chapter 1: Introduction. In Chapter 2: Monte Carlo Integration, we dive into the beautiful mathematical theory of probability that empowers computers to solve complex light transport integrals using random sampling.'
    }
  ]
};
