import type { SectionContent } from '../../../../types/book';

export const CH01_06_HISTORY: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "1",
  "chapterTitleKo": "제1장 소개 (Introduction)",
  "sectionNumber": "1.6",
  "sectionTitle": "A Brief History of Physically Based Rendering",
  "sectionTitleKo": "1.6 물리 기반 렌더링의 간략한 역사 (A Brief History of PBR)",
  "originalUrl": "https://pbr-book.org/4ed/Introduction/A_Brief_History_of_Physically_Based_Rendering.html",
  "prevSection": {
    "id": "ch01-05",
    "title": "1.5 코드 이해 및 활용 가이드"
  },
  "nextSection": {
    "id": "ch02-01",
    "title": "2.1 몬테카를로 적분의 기초 원리"
  },
  "summary": {
    "keyTakeaways": [
      "블린의 법칙은 성능 향상을 더 복잡한 장면에 사용하는 경향을 설명하며, 일정한 한 시간의 렌더링 시간을 보장하는 법칙은 아닙니다.",
      "학술 연구의 황금기: 1980년 휘티드(Whitted)의 광선 추적, 1984년 쿡(Cook)의 분산 광선 추적, 1986년 카지야(Kajiya)의 렌더링 방정식, 1997년 에릭 비치(Eric Veach)의 다중 중요도 샘플링(MIS)이 PBR의 수학적 뼈대를 완성했습니다.",
      "제작용 렌더링에서 물리 기반 경로 추적의 활용이 크게 확대되었지만, 모든 스튜디오가 모든 다른 기법을 완전히 없앤 것은 아닙니다.",
      "가속 구조와 일관된 빛 전달 모델은 복잡한 장면에 유용하지만, 광선 추적 전체가 항상 O(log N)이며 다른 방식보다 우월하다는 보장은 없습니다."
    ],
    "prerequisites": [
      "컴퓨터 그래픽스 발전사 및 래스터화(Rasterization) vs 광선 추적(Ray Tracing) 개념",
      "알고리즘 시간 복잡도 (O(N) vs O(log N))"
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "textKo": "1970년대 컴퓨터 그래픽스의 태동기에는 눈앞에 놓인 가장 시급한 문제를 해결하는 것이 급선무였습니다. 3차원 공간 속에서 다른 물체에 가려진 면을 어떻게 판별할 것인가(은면 제거, Hidden-Surface Removal), 그리고 컴퓨터 화면에 매끄러운 곡면 음영(구로 셰이딩, 퐁 셰이딩)을 어떻게 띄울 것인가가 주된 연구 과제였습니다. 당시에는 컴퓨터의 메모리가 수 킬로바이트(KB) 수준에 불과하고 프로세서 연산 속도가 극도로 느렸기 때문에, 빛의 정밀한 물리적 법칙을 컴퓨터로 시뮬레이션한다는 것은 꿈조차 꿀 수 없었습니다.",
      "textEn": "Through the early years of computer graphics in the 1970s, the most important problems to solve were basic ones: how to represent 3D objects, how to determine which parts of them were visible, and how to shade them. Computational resources were scarce: computers had small memories, processors were slow, and simple, non-physically based algorithms were used to make images.",
      "id": "ch01-06-b1"
    },
    {
      "type": "paragraph",
      "textKo": "블린의 법칙은 컴퓨터가 빨라지면 렌더링 시간을 줄이기보다 더 복잡한 장면과 효과에 계산 자원을 쓰는 경향을 가리키는 관찰입니다. 프레임당 시간이 물리적으로 항상 한 시간으로 고정된다는 법칙은 아닙니다. 실제 시간은 장면·품질 목표·알고리즘·하드웨어에 따라 달라집니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-06-b2"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 역사/상식 콕콕",
      "title": "알고리즘·하드웨어·품질 목표의 관계",
      "summary": "알고리즘·하드웨어·품질 목표의 관계",
      "points": [
        {
          "title": "핵심 설명",
          "content": "하드웨어 성능이 늘어도 요구하는 장면 복잡도와 품질이 함께 늘 수 있습니다. 알고리즘의 점근적 비용은 큰 입력을 이해하는 데 중요하지만, 실제 비용에는 상수·메모리 접근·표본 수가 함께 영향을 줍니다. 서로 다른 일을 하는 렌더러를 빅오 하나만으로 우열 비교하지 않습니다."
        }
      ],
      "tags": [
        "블린의 법칙",
        "컴퓨터 그래픽스 역사",
        "하드웨어 발전",
        "컴퓨팅 복잡도"
      ],
      "id": "ch01-06-b3"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.6.1 학술 연구의 위대한 여정 (Research Milestones)",
      "titleEn": "1.6.1 Research",
      "id": "ch01-06-b4"
    },
    {
      "type": "paragraph",
      "textKo": "물리 법칙에 기반한 렌더링 접근법이 본격적으로 학계의 주목을 받기 시작한 것은 1980년대 초반이었습니다.  \n\n1. **1980년: 터너 휘티드(Turner Whitted)의 재귀적 광선 추적**  \n   빛의 반사와 굴절, 선명한 그림자를 재귀적 광선 탐색으로 시뮬레이션하여 그래픽스 역사상 최초로 거울처럼 비치는 구와 투명한 유리구슬 이미지를 선보였습니다.  \n\n2. **1981년: 쿡-토런스(Cook-Torrance) 미세면 반사 모델**  \n   물리학의 광학 이론을 컴퓨터 그래픽스에 최초로 성공적으로 이식한 모델입니다. 금속 표면의 미세한 거칠기(Microfacets)와 비스듬히 볼수록 빛이 강하게 반사되는 프레넬(Fresnel) 법칙을 정밀한 수식으로 정립했습니다.  \n\n3. **1984년: 라디오시티(Radiosity)와 분산 광선 추적(Distributed Ray Tracing)**  \n   고랄(Goral) 등은 열복사 전달 이론을 차용하여 벽과 벽 사이에 빛이 은은하게 번지는 상호 반사(Diffuse Interreflection)를 계산하는 라디오시티 기법을 발표했습니다. 같은 해 로버트 쿡(Robert Cook) 등은 확률적 몬테카를로 샘플링을 광선에 접목하여 부드러운 그림자(Soft Shadow), 피사계 심도(아웃포커싱), 모션 블러(Motion Blur)를 자연스럽게 표현해 냈습니다.  \n\n4. **1986년: 제임스 카지야(James Kajiya)의 렌더링 방정식(Rendering Equation)**  \n   컴퓨터 그래픽스의 단일 논문 중 가장 위대한 논문으로 꼽히는 명저입니다. 카지야는 산재해 있던 모든 빛의 전파 현상을 하나의 우아한 적분 방정식으로 통합 정립하고, 마르코프 체인과 몬테카를로 기법을 이용한 **패스 트레이싱(Path Tracing)** 알고리즘을 탄생시켰습니다.  \n\n5. **1997년: 에릭 비치(Eric Veach)의 박사 학위 논문 (스탠퍼드 대학교)**  \n   에릭 비치는 몬테카를로 빛 수송 이론을 비약적으로 발전시켰습니다. 서로 다른 샘플링 전략을 최적의 가중치로 융합하여 분산을 획기적으로 낮추는 **다중 중요도 샘플링(MIS, Multiple Importance Sampling)**과 메트로폴리스 광선 수송(MLT), 양방향 패스 트레이싱(BDPT)을 수학적으로 완벽히 증명했습니다. 비치의 이론은 오늘날 모든 상용 렌더러의 표준 핵심 엔진이 되었습니다.",
      "textEn": "Physically based approaches to rendering started to be seriously considered by graphics researchers in the early 1980s. Whitted (1980) introduced recursive ray tracing. Cook and Torrance (1981) introduced a microfacet-based specular reflection model grounded in physics. In 1984, Goral et al. introduced radiosity, and Cook, Porter, and Carpenter introduced distributed ray tracing. Shortly afterward, Kajiya (1986) published the rendering equation and path tracing. A crucial breakthrough came in 1997 with Eric Veach's Stanford Ph.D. dissertation, which introduced multiple importance sampling (MIS), bidirectional path tracing, and Metropolis light transport, establishing the mathematical foundations of modern rendering.",
      "id": "ch01-06-b5"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "1.6.2 할리우드 영화 산업과 대전환 (The Production Revolution)",
      "titleEn": "1.6.2 Production",
      "id": "ch01-06-b6"
    },
    {
      "type": "paragraph",
      "textKo": "1980~1990년대 초기 컴퓨터 애니메이션 영화 제작(픽사의 《토이 스토리》 등)에서는 광선 추적 대신 **REYES 알고리즘 기반의 래스터화(Rasterization) 렌더러(대표적으로 픽사의 RenderMan)**가 업계를 완벽히 지배했습니다.  \n당시 워크스테이션 컴퓨터의 RAM 메모리는 고작 32MB~128MB 수준이었습니다. 거대한 씬 전체를 메모리에 올려두고 광선을 자유자재로 쏘아대는 광선 추적은 메모리 부족으로 도저히 불가능했습니다. 반면 REYES 래스터화 엔진은 지오메트리를 작은 타일 단위로 잘게 쪼개어 화면에 투영한 뒤 메모리에서 즉시 지워버리는 방식으로 적은 메모리에서도 영화급 장면을 렌더링할 수 있었습니다.",
      "textEn": "In the 1980s and 1990s, production rendering for film was dominated by rasterization-based architectures, most notably the REYES algorithm implemented in Pixar's RenderMan. Computers at the time had very limited RAM (tens or hundreds of megabytes), making it impossible to store entire production scenes in memory for ray tracing. REYES streamed geometric primitives in pipeline stages, operating efficiently within strict memory limits.",
      "id": "ch01-06-b7"
    },
    {
      "type": "figure",
      "id": "fig:gravity-shot",
      "number": "Figure 1.21",
      "title": "Original Figure 1.21",
      "titleKo": "원문 그림 1.21",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-21.png",
      "captionKo": "그림 1.21 · 영화 Gravity의 물리 기반 렌더링 예입니다. 볼륨 산란과 많은 비등방성 금속 표면, 전역 조명을 Arnold로 처리했습니다. 이미지 제공: Warner Bros., Framestore.",
      "captionEn": "Figure 1.21: Gravity (2013) featured spectacular computer-generated imagery of a realistic space environment with volumetric scattering and large numbers of anisotropic metal surfaces. The image was generated using Arnold, a physically based rendering system that accounts for global illumination. Image courtesy of Warner Bros. and Framestore.",
      "width": 998,
      "height": 486,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/A_Brief_History_of_Physically_Based_Rendering.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "2000년대 이후 메모리와 계산 성능, 샘플링·재질·가속 구조가 함께 발전하면서 제작용 경로 추적의 활용이 크게 늘었습니다. 원서는 Arnold, Hyperion, Manuka 등과 제작 현장의 변화를 소개합니다. 이것을 모든 스튜디오가 다른 방식과 보조 작업을 완전히 버렸다는 뜻으로 읽어서는 안 됩니다. 실제 제작은 다양한 도구와 기법을 결합합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-06-b9"
    },
    {
      "type": "figure",
      "id": "fig:alita-shot",
      "number": "Figure 1.22",
      "title": "Original Figure 1.22",
      "titleKo": "원문 그림 1.22",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-22.png",
      "captionKo": "그림 1.22 · Alita: Battle Angel의 물리 기반 렌더링 예입니다. 이미지: Weta Digital. © 2018 Twentieth Century Fox Film Corporation. All Rights Reserved.",
      "captionEn": "Figure 1.22: This image from Alita: Battle Angel (2019) was also rendered using a physically based rendering system. Image by Weta Digital, © 2018 Twentieth Century Fox Film Corporation. All Rights Reserved.",
      "width": 998,
      "height": 549,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/A_Brief_History_of_Physically_Based_Rendering.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 알고리즘 콕콕",
      "title": "광선 추적이 복잡한 조명에 유용한 이유",
      "summary": "광선 추적이 복잡한 조명에 유용한 이유",
      "points": [
        {
          "title": "핵심 설명",
          "content": "가속 구조는 광선과 만날 가능성이 없는 물체를 건너뛰게 합니다. 하지만 BVH의 가까운 교차점 탐색은 일반적으로 O(log N)이 보장되지 않으며 겹침이 심하면 많은 노드를 방문합니다. 래스터화도 가시성 제거 등 여러 최적화를 사용합니다. 경로 추적의 실용성은 간접 조명·반사·굴절 등을 공통 경로 모델로 다루는 편의와 샘플링·메모리 기술의 발전을 함께 봐야 합니다."
        }
      ],
      "tags": [
        "알고리즘 복잡도",
        "빅오 표기법",
        "BVH 가속",
        "래스터화 vs 레이트레이싱"
      ],
      "id": "ch01-06-b11"
    },
    {
      "type": "paragraph",
      "textKo": "이제 우리는 1970년대의 단순한 점과 선에서 시작하여, 수학과 물리, 소프트웨어 공학, 하드웨어 발전이 씨실과 날실로 엮여 오늘의 경이로운 물리 기반 렌더링 세계를 완성해 낸 거대한 서사를 모두 목격했습니다.  \n이것으로 **제1장 소개(Introduction)**의 모든 여정을 성공적으로 마쳤습니다!  \n\n이어지는 **제2장 몬테카를로 적분(Monte Carlo Integration)**에서는, 컴퓨터가 어떻게 무작위 주사위를 굴려 우주의 가장 복잡한 물리 적분 방정식들을 오차 없이 아름답게 풀어내는지, 그 눈부신 확률 컴퓨터 수학의 세계로 본격적으로 뛰어들겠습니다.",
      "textEn": "We have now seen how physically based rendering evolved from early academic breakthroughs in the 1980s into the universal standard across the visual computing world today. This concludes Chapter 1: Introduction. In Chapter 2: Monte Carlo Integration, we dive into the beautiful mathematical theory of probability that empowers computers to solve complex light transport integrals using random sampling.",
      "id": "ch01-06-b12"
    }
  ],
  "audit": {
    "checkedSourceSha256": "b8b1f98196a50dd2e116909b280d2b773bb3759ffbc80eee944eb471f1d54698",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "1.6 A Brief History of Physically Based Rendering",
      "1.6.1  Research",
      "1.6.2  Production"
    ],
    "sourceFigures": [
      "1.21",
      "1.22"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
