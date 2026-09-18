import { SectionContent } from '../../../../types/book';

export const CH04_01_RADIOMETRY: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '4',
  chapterTitleKo: '제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)',
  sectionNumber: '4.1',
  sectionTitle: 'Radiometry',
  sectionTitleKo: '4.1 방사측정학의 기초와 4대 물리량 (Radiometry)',
  originalUrl: 'https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry.html',
  prevSection: {
    id: 'ch03-11',
    title: '3.11 광선-표면 상호작용 구조체',
  },
  nextSection: {
    id: 'ch04-02',
    title: '4.2 광학 적분 다루기',
  },
  summary: {
    keyTakeaways: [
      '방사측정학(Radiometry)은 빛의 에너지 전파와 반사를 수학적으로 정량화하는 학문이며, 컴퓨터 그래픽스는 계산의 실용성을 위해 빛을 파동이나 양자가 아닌 직진하는 입자 흐름으로 가정하는 **기하 광학(Geometric Optics)** 모델을 기반으로 합니다.',
      '기하 광학 렌더링의 5대 대전제는 **선형성(Linearity)**, **에너지 보존(Energy Conservation)**, **무편광(No Polarization)**, **파장 간 독립성(No Fluorescence)**, 그리고 시간이 지나도 에너지 분포가 변하지 않는 **정상 상태(Steady State)**입니다.',
      '방사측정학의 4대 핵심 물리량은 **에너지($Q$, 줄 J)**로부터 미분 극한을 취해 유도됩니다: **방사속(Flux $\\Phi$, 와트 W)** $\\to$ **조도/복사도(Irradiance $E$, $\\text{W/m}^2$)** $\\to$ **방사강도(Intensity $I$, $\\text{W/sr}$)** $\\to$ **방사도(Radiance $L$, $\\text{W/(m}^2\\cdot\\text{sr)})$**.',
      '**휘도/방사도($L$, Radiance)**는 빛이 이동하는 광선(Ray)을 따라 진공/공기 중에서 거리에 관계없이 **일정하게 보존(Conservation of Radiance)**되므로, 광선 추적(Ray Tracing) 알고리즘이 추적하고 계산하는 가장 근본적인 물리량입니다.'
    ],
    prerequisites: [
      '미적분학 기초 (미소 단위 면적 $dA$, 미소 시간 $dt$, 극한)',
      '3차원 기하학 (입체각 $\\omega$, 표면 법선 벡터 $\\mathbf{n}$, 코사인 각도 $\\cos\\theta$)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '4.1 방사측정학의 기본 개념 (Radiometry)',
      titleEn: '4.1 Radiometry'
    },
    {
      type: 'paragraph',
      textKo: '방사측정학(Radiometry)은 공간 속에서 빛의 전파(Propagation)와 물체 표면에서의 반사(Reflection)를 정량적으로 기술하기 위한 일련의 개념과 수학적 도구들을 제공합니다. 이 방사측정학적 원리들은 이 책의 나머지 전반에 걸쳐 사용될 모든 렌더링 알고리즘 유도의 근본적인 기초가 됩니다. 흥미롭게도 방사측정학은 원래 빛의 엄밀한 파동 물리학적 제1원리로부터 유도된 것이 아니라, 공간을 가로질러 흐르는 무수한 입자들의 흐름이라는 추상화 모델을 바탕으로 정립되었습니다. 비록 맥스웰 방정식과의 연결 고리가 증명되면서 현대 물리학적 토대를 단단히 다졌지만, 빛의 편광(Polarization) 같은 특성은 이 기본 프레임워크에 자연스럽게 녹아들지 않습니다.',
      textEn: 'Radiometry provides a set of ideas and mathematical tools to describe light propagation and reflection. It forms the basis of the derivation of the rendering algorithms that will be used throughout the rest of this book. Interestingly enough, radiometry was not originally derived from first principles using the physics of light but was built on an abstraction of light based on particles flowing through space. As such, effects like polarization of light do not naturally fit into this framework, although connections have since been made between radiometry and Maxwell’s equations, giving radiometry a solid basis in physics.'
    },
    {
      type: 'paragraph',
      textKo: '방사 전달(Radiative Transfer)은 복사 에너지의 전달 과정을 현상학적으로 연구하는 분야입니다. 이 학문은 방사측정학 원리에 기반하며 **기하 광학(Geometric Optics)** 수준에서 작동합니다. 기하 광학에서는 빛의 파장보다 훨씬 거대한 물체와 빛이 상호작용하는 거시적 특성만을 다루는 것으로 충분합니다. 물론 파동 광학 모델의 회절이나 간섭 현상을 접목하기도 하지만, 기본적으로 방사 전달의 추상화된 언어로 변환되어 표현됩니다.',
      textEn: 'Radiative transfer is the phenomenological study of the transfer of radiant energy. It is based on radiometric principles and operates at the geometric optics level, where macroscopic properties of light suffice to describe how light interacts with objects much larger than the light’s wavelength. It is not uncommon to incorporate phenomena from wave optics models of light, but these results need to be expressed in the language of radiative transfer’s basic abstractions.'
    },
    {
      type: 'paragraph',
      textKo: '원자 수준에서 빛의 상호작용을 다루려면 양자역학이 필요하지만, 다행히도 컴퓨터 그래픽스의 렌더링 문제를 해결할 때 양자역학적 원리를 직접 시뮬레이션할 필요는 없으므로 엄청난 계산 복잡성을 피할 수 있습니다.',
      textEn: 'At an even finer level of detail, quantum mechanics is needed to describe light’s interaction with atoms. Fortunately, direct simulation of quantum mechanical principles is unnecessary for solving rendering problems in computer graphics, so the intractability of such an approach is avoided.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 컴공 기초 콕콕: 컴퓨터 그래픽스가 복잡한 파동 물리학 대신 기하 광학을 택한 이유',
      summary: '왜 게임과 영화 CG에서는 맥스웰 방정식 대신 광선(Ray)을 쏠까?',
      points: [
        {
          title: '스케일의 차이 (Scale)',
          content: '가시광선의 파장은 약 380~780 나노미터($10^{-9}\\text{m}$)에 불과합니다. 반면 3D 게임이나 영화 장면에 등장하는 캐릭터, 가구, 벽면은 밀리미터($10^{-3}\\text{m}$)에서 미터($\\text{m}$) 단위입니다. 즉, 물체의 크기가 빛 파장보다 수백만 배나 크기 때문에 파동 특성(회절, 간섭)을 무시하고 **빛이 직선으로 나아가는 입자 광선(Ray)**이라고 가정해도 사람 눈으로 구별할 수 없는 완벽히 사실적인 영상을 만들 수 있습니다.'
        },
        {
          title: '계산 복잡도의 절벽',
          content: '방 안의 맥스웰 전자기파 방정식을 공간 격자(FDTD)로 풀려면 슈퍼컴퓨터로도 며칠이 걸립니다. 하지만 기하 광학의 광선 추적(Ray Tracing)을 쓰면 초당 수천만 개의 광선 교차 검사만으로 실시간 렌더링이 가능해집니다.'
        }
      ],
      tags: ['기하 광학', '방사측정학', '컴퓨터 그래픽스']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: 'pbrt가 전제하는 기하 광학의 5대 가정',
      titleEn: 'Basic Assumptions of Geometric Optics'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt 시스템 전반에 걸쳐 암묵적으로 전제되는 빛의 거동에 관한 5가지 핵심 가정은 다음과 같습니다:',
      textEn: 'In pbrt, we will assume that geometric optics is an adequate model for the description of light and light scattering. This leads to a few basic assumptions about the behavior of light that will be used implicitly throughout the system:'
    },
    {
      type: 'concept-tip',
      badge: '🔬 기하 광학 5대 공리',
      title: '🔬 기하 광학의 5대 물리적 가정과 렌더링 의미',
      summary: 'pbrt 렌더러가 전제하는 빛의 5가지 절대 법칙',
      points: [
        {
          title: '1. 선형성 (Linearity)',
          content: '광학 시스템에 둘 이상의 광원 입력이 주어졌을 때 발생하는 전체 효과는 각 입력이 단독으로 작용했을 때의 효과를 단순 합산한 것과 완벽히 같습니다. 비선형 광학 현상은 초고에너지 레이저 실험 등에서만 관측되므로 렌더링에서는 선형 중첩 원리가 성립합니다.'
        },
        {
          title: '2. 에너지 보존 법칙 (Energy Conservation)',
          content: '빛이 물체 표면에서 반사되거나 매질 내부에서 산란될 때, 산란된 빛 에너지의 총합은 최초 입사된 에너지보다 결코 커질 수 없습니다.'
        },
        {
          title: '3. 무편광 가정 (No Polarization)',
          content: '인간의 눈은 편광 선글라스나 특수 카메라 없이는 편광을 인지하지 못합니다. 따라서 pbrt는 자연광처럼 여러 편광이 무작위로 뒤섞여 평균화된 무편광 빛만을 다루며, 파장(Wavelength $\\lambda$)만을 고려합니다.'
        },
        {
          title: '4. 형광 및 인광 배제 (No Fluorescence / Phosphorescence)',
          content: '특정 파장의 빛이 흡수된 후 다른 파장의 빛으로 방출되거나(형광), 시간차를 두고 서서히 방출되는(인광) 현상을 배제하여 각 파장의 빛 거동을 서로 완전히 독립적으로 계산합니다.'
        },
        {
          title: '5. 정상 상태 가정 (Steady State)',
          content: '장면 속의 빛은 방출과 반사를 거쳐 이미 우주적 속도로 평형 상태에 도달했다고 가정합니다. 즉, 찰나의 시간 동안 공간 내의 휘도(Radiance) 분포는 시간에 따라 변하지 않습니다.'
        }
      ],
      tags: ['기하광학', '선형성', '에너지보존']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '방사측정학의 4대 기본 물리량',
      titleEn: 'The Four Central Radiometric Quantities'
    },
    {
      type: 'paragraph',
      textKo: '3차원 렌더링의 핵심이 되는 4대 방사측정학 물리량은 **에너지(Energy)**, **방사속(Flux)**, **조도/방출도(Irradiance / Radiant Exitance)**, **방사강도(Intensity)**, 그리고 **방사도/휘도(Radiance)**입니다. 이들은 근본 물리량인 에너지로부터 시간, 면적, 방향에 대한 미분 극한을 차례로 취함으로써 유도됩니다.',
      textEn: 'There are four radiometric quantities that are central to rendering: flux, irradiance / radiant exitance, intensity, and radiance. They can each be derived from energy by successively taking limits over time, area, and directions. All of these radiometric quantities are in general wavelength dependent.'
    },
    {
      type: 'paragraph',
      textKo: '모든 논의의 출발점은 **방사 에너지(Radiant Energy, $Q$)**이며, 단위는 **줄(Joule, $\\text{J}$)**입니다. 광원은 광자(Photon)들을 방출하며, 파장이 $\\lambda$인 단일 광자가 지닌 에너지는 플랑크 상수를 통해 다음과 같이 결정됩니다:',
      textEn: 'Our starting point is energy, which is measured in joules (J). Sources of illumination emit photons, each of which is at a particular wavelength and carries a particular amount of energy. A photon at wavelength $\\lambda$ carries energy'
    },
    {
      type: 'equation',
      tex: 'e = \\frac{h c}{\\lambda}'
    },
    {
      type: 'paragraph',
      textKo: '여기서 $c$는 진공 중의 빛의 속도($299,792,458\\text{ m/s}$)이고, $h$는 플랑크 상수($h \\approx 6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$)입니다.',
      textEn: 'where $c$ is the speed of light, $299,792,458\\text{ m/s}$, and $h$ is Planck’s constant, $h \\approx 6.626 \\times 10^{-34}\\text{ m}^2\\text{kg/s}$.'
    },
    {
      type: 'subheading',
      level: 4,
      titleKo: '1. 방사속 / 일률 (Radiant Flux / Power, $\\Phi$)',
      titleEn: 'Flux'
    },
    {
      type: 'paragraph',
      textKo: '에너지는 특정 시간 동안 수행된 일의 총량입니다. 그러나 렌더링의 정상 상태 가정 하에서는 임의의 "순간"에 흐르는 빛을 측정하는 데 관심이 있습니다. **방사속(Radiant Flux, $\\Phi$)**은 단위 시간당 특정 표면이나 공간 영역을 통과하는 빛 에너지의 총량(일률, Power)을 의미하며, 미소 시간 $dt$에 대한 미소 에너지 $dQ$의 극한으로 정의됩니다:',
      textEn: 'Energy measures work over some period of time, though under the steady-state assumption generally used in rendering, we are mostly interested in measuring light at an instant. Radiant flux, also known as power, is the total amount of energy passing through a surface or region of space per unit time. Radiant flux can be found by taking the limit of differential energy per differential time:'
    },
    {
      type: 'equation',
      tex: '\\Phi = \\lim_{\\Delta t \\to 0} \\frac{\\Delta Q}{\\Delta t} = \\frac{dQ}{dt}'
    },
    {
      type: 'paragraph',
      textKo: '방사속의 단위는 초당 줄($\\text{J/s}$)이며, 일반적으로 **와트(Watt, $\\text{W}$)**로 표기합니다. 예를 들어 어떤 광원이 1시간 동안 $200,000\\text{ J}$의 에너지를 균일하게 방출했다면, 이 광원의 방사속은 $200,000 / 3600 \\approx 55.6\\text{ W}$가 됩니다. 역으로 방사속 $\\Phi(t)$를 시간에 대해 적분하면 방출된 총 에너지 $Q$를 구할 수 있습니다.',
      textEn: 'Its units are joules/second (J/s), or more commonly, watts (W). For example, given a light that emitted $Q = 200,000\\text{ J}$ over the course of an hour, if the same amount of energy was emitted at all times over the hour, we can find that the light source’s flux was 55.6 W.'
    },
    {
      type: 'figure',
      id: 'fig-4-1',
      number: 'Figure 4.1',
      captionKo: '그림 4.1: 점광원에서 방출되는 방사속(Flux $\\Phi$)은 광원을 둘러싼 가상의 구면을 통과하는 전체 에너지 흐름률로 측정됩니다. 바깥쪽 큰 구면의 국소 단위 면적을 통과하는 에너지는 안쪽 작은 구면보다 적지만, 큰 구면의 전체 표면적이 그만큼 넓기 때문에 두 구면 전체를 통과하는 총 방사속은 완벽히 동일합니다.',
      captionEn: 'Figure 4.1: Flux from a point light source measured by the total amount of energy passing through imaginary spheres around the light. Note that the total amount of flux measured on either of the two spheres is the same—although less energy is passing through any local part of the large sphere than the small sphere, the greater area of the large sphere means that the total flux is the same.',
      title: '방사속 측정 다이어그램',
      titleKo: '방사속(Flux)',
      src: '/books/pbrt-4ed/images/pha04f01.svg',
    },
    {
      type: 'subheading',
      level: 4,
      titleKo: '2. 복사도 / 조도 (Irradiance $E$) 및 방출도 (Radiant Exitance $M$)',
      titleEn: 'Irradiance and Radiant Exitance'
    },
    {
      type: 'paragraph',
      textKo: '방사속을 현실적으로 측정하려면 광자가 통과하는 "면적(Area)"이 주어져야 합니다. 유한한 면적 $A$에 도달하는 단위 면적당 방사속의 밀도를 $E = \\Phi / A$로 정의할 수 있습니다. 이때 표면에 **도착(입사)하는 방사속의 면적 밀도를 조도(Irradiance, $E$)**라고 부르고, 표면에서 **떠나는(방출되는) 방사속의 면적 밀도를 방출도(Radiant Exitance, $M$)**라고 구분합니다. 두 물리량 모두 단위는 $\\text{W/m}^2$입니다.',
      textEn: 'Any measurement of flux requires an area over which photons per time is being measured. Given a finite area $A$, we can define the average density of power over the area by $E = \\Phi / A$. This quantity is either irradiance (E), the area density of flux arriving at a surface, or radiant exitance (M), the area density of flux leaving a surface. These measurements have units of $\\text{W/m}^2$.'
    },
    {
      type: 'paragraph',
      textKo: '점 $p$에서의 국소 조도와 방출도는 미소 면적 $dA$에 대한 미소 방사속 $d\\Phi$의 극한으로 엄밀하게 정의됩니다:',
      textEn: 'More generally, we can define irradiance and radiant exitance by taking the limit of differential power per differential area at a point $p$:'
    },
    {
      type: 'equation',
      tex: 'E(p) = \\frac{d\\Phi}{dA}, \\quad M(p) = \\frac{d\\Phi}{dA}'
    },
    {
      type: 'paragraph',
      textKo: '그림 4.1에서 점광원이 모든 방향으로 동일한 방사속 $\\Phi$를 방출할 때, 반지름이 $r$인 구면의 표면적은 $4\\pi r^2$이므로 구면 위의 임의의 점에서의 조도는 $E = \\frac{\\Phi}{4\\pi r^2}$가 됩니다. 이것이 바로 빛을 비출 때 **거리의 제곱에 반비례하여 어두워지는 거리 역제곱 법칙(Inverse-Square Law)**의 수학적 근원입니다.',
      textEn: 'This fact explains why the amount of energy received from a light at a point falls off with the squared distance from the light: $E = \\Phi / (4\\pi r^2)$.'
    },
    {
      type: 'figure',
      id: 'fig-4-2',
      number: 'Figure 4.2',
      captionKo: '그림 4.2: 람베르트 코사인 법칙의 기하학적 유도. 빛이 표면에 수직으로 입사할 때(왼쪽) 면적 $A_1 = A$에 에너지가 집중되지만, 각도 $\\theta$만큼 비스듬히 입사할 때(오른쪽) 빛이 퍼지는 표면적 $A_2$는 $A / \\cos\\theta$로 넓어집니다. 따라서 단위 면적당 받는 조도 $E$는 $\\cos\\theta$에 비례하여 감소합니다.',
      captionEn: 'Figure 4.2: The irradiance equation helps understand the origin of Lambert’s law. If light shines directly down on a surface, the area receiving light $A_1 = A$. If light is at angle $\\theta$, the area receiving flux $A_2$ is roughly $A / \\cos\\theta$, so irradiance is proportional to $\\cos\\theta$.',
      title: '람베르트 코사인 법칙 유도',
      titleKo: '조도와 람베르트 법칙',
      src: '/books/pbrt-4ed/images/pha04f02.svg',
    },
    {
      type: 'subheading',
      level: 4,
      titleKo: '3. 방사강도 (Radiant Intensity, $I$)',
      titleEn: 'Intensity'
    },
    {
      type: 'paragraph',
      textKo: '이제 공간상의 한 점에서 광선들이 사방으로 뻗어나가는 각도별 분포를 고려해 봅시다. 크기가 없는 이상적인 점광원(Point Light)이 단위 구의 중심에 놓여 있을 때, 방출되는 방사속의 **입체각(Solid Angle, $\\omega$)당 각밀도**를 **방사강도(Intensity, $I$)**라고 합니다. 단위는 **스테라디안당 와트($\\text{W/sr}$)**입니다:',
      textEn: 'Consider now an infinitesimal light source emitting photons. Intensity, denoted by $I$, is the angular density of emitted power; it has units $\\text{W/sr}$. More generally we are interested in taking the limit of a differential cone of directions:'
    },
    {
      type: 'equation',
      tex: 'I = \\lim_{\\Delta\\omega \\to 0} \\frac{\\Delta\\Phi}{\\Delta\\omega} = \\frac{d\\Phi}{d\\omega}'
    },
    {
      type: 'paragraph',
      textKo: '전체 방향의 입체각 집합 $\\Omega$에 대해 방사강도를 적분하면 점광원이 방출하는 총 방사속(Power)을 복원할 수 있습니다: $\\Phi = \\int_\\Omega I(\\omega) d\\omega$. 방사강도는 빛의 방향 분포를 설명하지만, 크기가 0인 이상적인 점광원에 대해서만 수학적으로 정의될 수 있는 한계를 지닙니다.',
      textEn: 'Given intensity as a function of direction $I(\\omega)$, we can integrate over a finite set of directions $\\Omega$ to recover the power: $\\Phi = \\int_\\Omega I(\\omega) d\\omega$.'
    },
    {
      type: 'subheading',
      level: 4,
      titleKo: '4. 방사도 / 휘도 (Radiance, $L$)',
      titleEn: 'Radiance'
    },
    {
      type: 'paragraph',
      textKo: '3D 컴퓨터 그래픽스 렌더링에서 **가장 중요하고 결정적인 물리량은 바로 방사도(휘도, Radiance, $L$)**입니다. 조도(Irradiance)는 한 점에 도달하는 면적당 전력을 알려주지만 어느 방향에서 빛이 왔는지 구별하지 못하며, 방사강도(Intensity)는 방향별 전력은 알려주지만 면적을 고려하지 못합니다. **방사도는 이 두 개념을 결합하여, 단위 투영 면적(Projected Area) 및 단위 입체각(Solid Angle)당 흐르는 방사속**을 측정합니다:',
      textEn: 'The final, and most important, radiometric quantity is radiance, $L$. Radiance measures irradiance or radiant exitance with respect to solid angles. It is defined by differential flux per unit projected area, per unit solid angle:'
    },
    {
      type: 'equation',
      tex: 'L(p, \\omega) = \\frac{d^2\\Phi}{dA^\\perp \\, d\\omega} = \\frac{d^2\\Phi}{dA \\cos\\theta \\, d\\omega}'
    },
    {
      type: 'paragraph',
      textKo: '여기서 $dA^\\perp = dA \\cos\\theta$는 광선 방향 $\\omega$에 수직인 가상 평면으로 투영된 미소 면적입니다(그림 4.3). 방사도의 단위는 **$\\text{W/(m}^2 \\cdot \\text{sr)}$**입니다.',
      textEn: 'where $dA^\\perp$ is the projected area of $dA$ on a hypothetical surface perpendicular to $\\omega$.'
    },
    {
      type: 'figure',
      id: 'fig-4-3',
      number: 'Figure 4.3',
      captionKo: '그림 4.3: 방사도(Radiance $L$)의 기하학적 정의. 표면 위의 미소 면적 $dA$와 표면 법선 $\\mathbf{n}$이 있고, 입사 광선 방향 $\\omega$와의 사잇각이 $\\theta$일 때, 광선 방향에 수직인 투영 면적 $dA^\\perp = dA \\cos\\theta$와 미소 입체각 $d\\omega$에 흐르는 빛의 밀도로 측정됩니다.',
      captionEn: 'Figure 4.3: Radiance is flux density per unit area, per unit solid angle. $dA^\\perp$ is the projected area of $dA$ on a surface perpendicular to direction $\\omega$.',
      title: '방사도(Radiance)의 정의',
      titleKo: '방사도(Radiance)',
      src: '/books/pbrt-4ed/images/pha04f03.svg',
    },
    {
      type: 'concept-tip',
      badge: '🎯 렌더링 핵심 통찰',
      title: '🎯 왜 레이 트레이싱의 주인공은 조도가 아니라 휘도(Radiance)일까?',
      summary: '방사도(Radiance)가 지닌 놀라운 물리적 보존 성질',
      points: [
        {
          title: '진공/공기 중 방사도 불변의 법칙 (Invariance along Rays)',
          content: '빛이 장애물이나 산란 매질이 없는 자유 공간을 날아갈 때, **광선을 따라 측정되는 방사도 $L$은 거리에 관계없이 완벽히 일정(Constant)**합니다! 달빛이나 밤하늘의 별을 볼 때, 물체가 멀어진다고 해서 표면의 단위 면적당 눈에 들어오는 "표면 밝기(휘도)" 자체가 어두워지지는 않습니다(단지 물체의 겉보기 크기인 입체각이 작아져서 총 도달 에너지가 줄어들 뿐입니다).'
        },
        {
          title: '카메라 픽셀 센서와의 완벽한 일치',
          content: '카메라 센서의 각 픽셀이나 우리 망막의 시세포는 특정 면적($dA$)과 렌즈 조리개가 이루는 특정 입체각($d\\omega$)을 통해 들어오는 빛을 기록합니다. 즉, 카메라 센서가 최종적으로 기록하는 이미지의 RGB 값은 센서에 맺히는 **방사도(Radiance)**에 정확히 비례합니다. 따라서 광선 추적기는 카메라로부터 광선을 쏘아 그 광선을 타고 거꾸로 들어오는 방사도를 계산하는 것입니다.'
        }
      ],
      tags: ['방사도 불변성', '광선 추적', '센서 렌더링']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '입사 방사도($L_i$)와 출사 방사도($L_o$)',
      titleEn: 'Incident and Exitant Radiance Functions'
    },
    {
      type: 'paragraph',
      textKo: '물체 표면 경계면에서는 빛의 굴절, 반사, 흡수로 인해 방사도 함수 $L$이 불연속적입니다. 거울 표면 바로 바깥쪽과 안쪽의 빛 세기는 완전히 다를 수밖에 없습니다. 따라서 pbrt는 표면의 한 점 $p$에서 도달하는 빛인 **입사 방사도($L_i(p, \\omega)$)**와 표면을 떠나 반사·방출되는 빛인 **출사 방사도($L_o(p, \\omega)$)**를 엄격하게 구분하여 기술합니다.',
      textEn: 'When light interacts with surfaces in the scene, the radiance function $L$ is generally not continuous across surface boundaries. We prefer to solve this ambiguity by making a distinction between radiance arriving at the point ($L_i(p, \\omega)$) and radiance leaving that point ($L_o(p, \\omega)$).'
    },
    {
      type: 'figure',
      id: 'fig-4-4',
      number: 'Figure 4.4',
      captionKo: '그림 4.4: 입사 방사도 $L_i(p, \\omega)$와 출사 방사도 $L_o(p, \\omega)$의 표기 관례. 두 경우 모두 방향 벡터 $\\omega$는 계산의 일관성을 위해 점 $p$로부터 바깥쪽을 향하도록(pointing away from $p$) 정의됩니다.',
      captionEn: 'Figure 4.4: The incident radiance function $L_i(p, \\omega)$ describes incoming light at point $p$, and $L_o(p, \\omega)$ describes outgoing light. In both cases, $\\omega$ points away from $p$.',
      title: '입사 및 출사 방사도 함수',
      titleKo: '입사 vs 출사 방사도',
      src: '/books/pbrt-4ed/images/pha04f04.svg',
    },
    {
      type: 'paragraph',
      textKo: '매질이나 표면이 없는 자유 공간(Free space) 속에서는 빛의 방사도가 연속적이므로, 한 점에서 나가는 빛은 다음 충돌 지점에 도달하는 입사광과 방향만 반대일 뿐 크기는 동일합니다:',
      textEn: 'At a point in space where there is no surface, $L$ is continuous, so $L_i(p, \\omega) = L_o(p, -\\omega)$. In other words, $L_i$ and $L_o$ only differ by a direction reversal.'
    },
    {
      type: 'equation',
      tex: 'L_i(p, \\omega) = L_o(p, -\\omega)'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '방사측정학(Radiometry)과 광도학(Photometry)의 대응 관계',
      titleEn: 'Photometry and Luminance'
    },
    {
      type: 'paragraph',
      textKo: '방사측정학이 모든 파장의 전자기파 에너지를 객관적인 물리량으로 다룬다면, **광도학(Photometry)**은 **인간의 시각 시스템(망막)이 인지하는 밝기 감도**를 반영한 학문입니다. 인간의 눈은 모든 파장의 빛에 균일하게 반응하지 않으며, 녹색 계열(약 $555\\text{ nm}$)에 가장 민감하고 파란색이나 붉은색 끝단에는 상대적으로 둔감합니다. 이러한 인간 시각의 상대적 감도 곡선을 **시감도 함수(Spectral Response Curve, $V(\\lambda)$)**라고 부릅니다.',
      textEn: 'Photometry is the study of visible electromagnetic radiation in terms of its perception by the human visual system. Each spectral radiometric quantity can be converted to its corresponding photometric quantity by integrating against the spectral response curve $V(\\lambda)$.'
    },
    {
      type: 'paragraph',
      textKo: '방사도(Radiance, $L_\\lambda$)에 인간의 시감도 곡선 $V(\\lambda)$를 가중 적분하여 인간이 실제로 느끼는 시각적 밝기를 나타낸 광도학 물리량을 **휘도(Luminance, $Y$)**라고 부르며, 단위는 **칸델라 매 제곱미터($\\text{cd/m}^2$)** 또는 **니트(nit)**입니다:',
      textEn: 'Luminance measures how bright a spectral power distribution appears to a human observer. We will denote luminance by $Y$; it is related to spectral radiance by:'
    },
    {
      type: 'equation',
      tex: 'Y = 683 \\int_{360}^{830} V(\\lambda) L_\\lambda \\, d\\lambda'
    },
    {
      type: 'paragraph',
      textKo: '방사측정학의 순수 물리량과 인간 시각을 반영한 광도학 물리량의 1:1 대응 관계는 다음 표와 같이 깔끔하게 정리됩니다:',
      textEn: 'All the radiometric quantities have photometric equivalents, summarized in the table below:'
    },
    {
      type: 'concept-tip',
      badge: '📊 방사측정학 vs 광도학 대응표',
      title: '📊 방사측정학(물리)과 광도학(인간 시각)의 6대 물리량 1:1 완벽 대응표',
      summary: '순수 물리 에너지와 인간의 눈이 느끼는 빛의 1:1 번역기',
      points: [
        {
          title: '에너지 (Energy)',
          content: '• **방사측정학**: 방사 에너지 $Q$ (줄, J)\n• **광도학**: 광도 에너지 $Q_v$ (탈보트, Talbot = lm·s)'
        },
        {
          title: '단위 시간당 에너지 (Power)',
          content: '• **방사측정학**: 방사속 $\\Phi$ (와트, W)\n• **광도학**: 광속 $\\Phi_v$ (루멘, lm)'
        },
        {
          title: '단위 입체각당 일률 (Angular Density)',
          content: '• **방사측정학**: 방사강도 $I$ (W/sr)\n• **광도학**: 광도 $I_v$ (칸델라, cd)'
        },
        {
          title: '도착하는 단위 면적당 일률 (Arrival Density)',
          content: '• **방사측정학**: 복사도 / 조도 $E$ (W/m²)\n• **광도학**: 조도 $E_v$ (럭스, lx)'
        },
        {
          title: '떠나는 단위 면적당 일률 (Leaving Density)',
          content: '• **방사측정학**: 방출도 $M$ (W/m²)\n• **광도학**: 광속발산도 $M_v$ (럭스, lx)'
        },
        {
          title: '단위 투영면적·입체각당 일률 (Directional Density)',
          content: '• **방사측정학**: 방사도 / 휘도 $L$ (W/(m²·sr))\n• **광도학**: 휘도 $Y$ (칸델라 매 제곱미터, cd/m² 또는 nit)'
        }
      ],
      tags: ['방사측정학', '광도학', '물리량대응', '단위정리']
    }
  ]
};
