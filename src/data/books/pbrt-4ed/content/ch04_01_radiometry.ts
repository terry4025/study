import type { SectionContent } from '../../../../types/book';

export const CH04_01_RADIOMETRY: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "4",
  "chapterTitleKo": "제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)",
  "sectionNumber": "4.1",
  "sectionTitle": "Radiometry",
  "sectionTitleKo": "4.1 방사측정학의 기초와 4대 물리량 (Radiometry)",
  "originalUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry.html",
  "prevSection": {
    "id": "ch03-11",
    "title": "3.11 광선-표면 상호작용 구조체"
  },
  "nextSection": {
    "id": "ch04-02",
    "title": "4.2 광학 적분 다루기"
  },
  "summary": {
    "keyTakeaways": [
      "방사측정학(Radiometry)은 빛의 에너지 전파와 반사를 수학적으로 정량화하는 학문이며, 컴퓨터 그래픽스는 계산의 실용성을 위해 빛을 파동이나 양자가 아닌 직진하는 입자 흐름으로 가정하는 **기하 광학(Geometric Optics)** 모델을 기반으로 합니다.",
      "PBRT는 선형성·수동 산란의 에너지 보존·무편광·형광 배제·정상 상태 등을 모델링 가정으로 사용합니다. 현실의 모든 광학 현상에 성립하는 절대 법칙 묶음은 아닙니다.",
      "에너지 Q(J)를 시간으로 나누는 극한이 방사속 Φ(W)입니다. 방사속을 면적에 대해 나누면 복사조도/방사출사도(W/m²), 입체각에 대해 나누면 방사강도(W/sr), 투영 면적과 입체각에 대해 나누면 방사휘도(W/(m²·sr))를 얻습니다.",
      "흡수·산란·방출이 없고 굴절률이 일정한 공간에서는 같은 광선을 따라 방사휘도가 유지됩니다. 매질과 경계면에서는 별도의 빛 전달 계산이 필요합니다."
    ],
    "prerequisites": [
      "미적분학 기초 (미소 단위 면적 $dA$, 미소 시간 $dt$, 극한)",
      "3차원 기하학 (입체각 $\\omega$, 표면 법선 벡터 $\\mathbf{n}$, 코사인 각도 $\\cos\\theta$)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "4.1 방사측정학의 기본 개념 (Radiometry)",
      "titleEn": "4.1 Radiometry",
      "id": "ch04-01-b1"
    },
    {
      "type": "paragraph",
      "textKo": "방사측정학(Radiometry)은 공간 속에서 빛의 전파(Propagation)와 물체 표면에서의 반사(Reflection)를 정량적으로 기술하기 위한 일련의 개념과 수학적 도구들을 제공합니다. 이 방사측정학적 원리들은 이 책의 나머지 전반에 걸쳐 사용될 모든 렌더링 알고리즘 유도의 근본적인 기초가 됩니다. 흥미롭게도 방사측정학은 원래 빛의 엄밀한 파동 물리학적 제1원리로부터 유도된 것이 아니라, 공간을 가로질러 흐르는 무수한 입자들의 흐름이라는 추상화 모델을 바탕으로 정립되었습니다. 비록 맥스웰 방정식과의 연결 고리가 증명되면서 현대 물리학적 토대를 단단히 다졌지만, 빛의 편광(Polarization) 같은 특성은 이 기본 프레임워크에 자연스럽게 녹아들지 않습니다.",
      "textEn": "Radiometry provides a set of ideas and mathematical tools to describe light propagation and reflection. It forms the basis of the derivation of the rendering algorithms that will be used throughout the rest of this book. Interestingly enough, radiometry was not originally derived from first principles using the physics of light but was built on an abstraction of light based on particles flowing through space. As such, effects like polarization of light do not naturally fit into this framework, although connections have since been made between radiometry and Maxwell’s equations, giving radiometry a solid basis in physics.",
      "id": "ch04-01-b2"
    },
    {
      "type": "paragraph",
      "textKo": "방사 전달(Radiative Transfer)은 복사 에너지의 전달 과정을 현상학적으로 연구하는 분야입니다. 이 학문은 방사측정학 원리에 기반하며 **기하 광학(Geometric Optics)** 수준에서 작동합니다. 기하 광학에서는 빛의 파장보다 훨씬 거대한 물체와 빛이 상호작용하는 거시적 특성만을 다루는 것으로 충분합니다. 물론 파동 광학 모델의 회절이나 간섭 현상을 접목하기도 하지만, 기본적으로 방사 전달의 추상화된 언어로 변환되어 표현됩니다.",
      "textEn": "Radiative transfer is the phenomenological study of the transfer of radiant energy. It is based on radiometric principles and operates at the geometric optics level, where macroscopic properties of light suffice to describe how light interacts with objects much larger than the light’s wavelength. It is not uncommon to incorporate phenomena from wave optics models of light, but these results need to be expressed in the language of radiative transfer’s basic abstractions.",
      "id": "ch04-01-b3"
    },
    {
      "type": "paragraph",
      "textKo": "원자 수준에서 빛의 상호작용을 다루려면 양자역학이 필요하지만, 다행히도 컴퓨터 그래픽스의 렌더링 문제를 해결할 때 양자역학적 원리를 직접 시뮬레이션할 필요는 없으므로 엄청난 계산 복잡성을 피할 수 있습니다.",
      "textEn": "At an even finer level of detail, quantum mechanics is needed to describe light’s interaction with atoms. Fortunately, direct simulation of quantum mechanical principles is unnecessary for solving rendering problems in computer graphics, so the intractability of such an approach is avoided.",
      "id": "ch04-01-b4"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "왜 광선 모델을 사용하나요?",
      "summary": "왜 광선 모델을 사용하나요?",
      "points": [
        {
          "title": "핵심 설명",
          "content": "파장 규모의 전자기장을 장면 전체에서 직접 계산하는 대신, 더 큰 규모에서 빛의 이동·반사·산란을 기술하면 실용적인 계산이 가능합니다. 기하 광학에는 회절·간섭·편광 등을 다루는 한계가 있으며, 모든 실제 영상을 오차 없이 재현한다는 뜻은 아닙니다."
        }
      ],
      "tags": [
        "기하 광학",
        "방사측정학",
        "컴퓨터 그래픽스"
      ],
      "id": "ch04-01-b5"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "pbrt가 전제하는 기하 광학의 5대 가정",
      "titleEn": "Basic Assumptions of Geometric Optics",
      "id": "ch04-01-b6"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt 시스템 전반에 걸쳐 암묵적으로 전제되는 빛의 거동에 관한 5가지 핵심 가정은 다음과 같습니다:",
      "textEn": "In pbrt, we will assume that geometric optics is an adequate model for the description of light and light scattering. This leads to a few basic assumptions about the behavior of light that will be used implicitly throughout the system:",
      "id": "ch04-01-b7"
    },
    {
      "type": "concept-tip",
      "badge": "🔬 기하 광학 5대 공리",
      "title": "이 렌더러가 채택하는 모델링 가정",
      "summary": "이 렌더러가 채택하는 모델링 가정",
      "points": [
        {
          "title": "핵심 설명",
          "content": "여러 광원의 기여를 더하는 선형 모델, 입사보다 많은 에너지를 만들어 내지 않는 수동 산란, 편광 상태를 따로 추적하지 않는 무편광 근사, 파장 사이 에너지 교환인 형광의 배제, 각 장면 시각에서 안정된 빛 분포를 구하는 정상 상태를 사용합니다. 이런 가정을 넘는 현상은 해당 물리량과 방정식을 확장해야 합니다. 정상 상태라고 장면의 움직임이나 모션 블러까지 금지되는 것은 아닙니다."
        }
      ],
      "tags": [
        "기하광학",
        "선형성",
        "에너지보존"
      ],
      "id": "ch04-01-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "방사측정학의 4대 기본 물리량",
      "titleEn": "The Four Central Radiometric Quantities",
      "id": "ch04-01-b9"
    },
    {
      "type": "paragraph",
      "textKo": "에너지에서 출발해 렌더링에 중요한 네 종류의 밀도를 정의합니다. 방사속, 복사조도·방사출사도, 방사강도, 방사휘도입니다. 이들은 한 줄로 차례차례 서로를 미분하는 계층이 아니라, 에너지 흐름을 시간·면적·방향의 서로 다른 기준으로 나눈 값입니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-01-b10"
    },
    {
      "type": "paragraph",
      "textKo": "모든 논의의 출발점은 **방사 에너지(Radiant Energy, $Q$)**이며, 단위는 **줄(Joule, $\\text{J}$)**입니다. 광원은 광자(Photon)들을 방출하며, 파장이 $\\lambda$인 단일 광자가 지닌 에너지는 플랑크 상수를 통해 다음과 같이 결정됩니다:",
      "textEn": "Our starting point is energy, which is measured in joules (J). Sources of illumination emit photons, each of which is at a particular wavelength and carries a particular amount of energy. A photon at wavelength $\\lambda$ carries energy",
      "id": "ch04-01-b11"
    },
    {
      "type": "equation",
      "tex": "e = \\frac{h c}{\\lambda}",
      "id": "ch04-01-b12"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 $c$는 진공 중의 빛의 속도($299,792,458\\text{ m/s}$)이고, $h$는 플랑크 상수($h \\approx 6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$)입니다.",
      "textEn": "where $c$ is the speed of light, $299,792,458\\text{ m/s}$, and $h$ is Planck’s constant, $h \\approx 6.626 \\times 10^{-34}\\text{ m}^2\\text{kg/s}$.",
      "id": "ch04-01-b13"
    },
    {
      "type": "subheading",
      "level": 4,
      "titleKo": "1. 방사속 / 일률 (Radiant Flux / Power, $\\Phi$)",
      "titleEn": "Flux",
      "id": "ch04-01-b14"
    },
    {
      "type": "paragraph",
      "textKo": "에너지는 특정 시간 동안 수행된 일의 총량입니다. 그러나 렌더링의 정상 상태 가정 하에서는 임의의 \"순간\"에 흐르는 빛을 측정하는 데 관심이 있습니다. **방사속(Radiant Flux, $\\Phi$)**은 단위 시간당 특정 표면이나 공간 영역을 통과하는 빛 에너지의 총량(일률, Power)을 의미하며, 미소 시간 $dt$에 대한 미소 에너지 $dQ$의 극한으로 정의됩니다:",
      "textEn": "Energy measures work over some period of time, though under the steady-state assumption generally used in rendering, we are mostly interested in measuring light at an instant. Radiant flux, also known as power, is the total amount of energy passing through a surface or region of space per unit time. Radiant flux can be found by taking the limit of differential energy per differential time:",
      "id": "ch04-01-b15"
    },
    {
      "type": "equation",
      "tex": "\\Phi = \\lim_{\\Delta t \\to 0} \\frac{\\Delta Q}{\\Delta t} = \\frac{dQ}{dt}",
      "id": "ch04-01-b16"
    },
    {
      "type": "paragraph",
      "textKo": "방사속의 단위는 초당 줄($\\text{J/s}$)이며, 일반적으로 **와트(Watt, $\\text{W}$)**로 표기합니다. 예를 들어 어떤 광원이 1시간 동안 $200,000\\text{ J}$의 에너지를 균일하게 방출했다면, 이 광원의 방사속은 $200,000 / 3600 \\approx 55.6\\text{ W}$가 됩니다. 역으로 방사속 $\\Phi(t)$를 시간에 대해 적분하면 방출된 총 에너지 $Q$를 구할 수 있습니다.",
      "textEn": "Its units are joules/second (J/s), or more commonly, watts (W). For example, given a light that emitted $Q = 200,000\\text{ J}$ over the course of an hour, if the same amount of energy was emitted at all times over the hour, we can find that the light source’s flux was 55.6 W.",
      "id": "ch04-01-b17"
    },
    {
      "type": "figure",
      "id": "fig-4-1",
      "number": "Figure 4.1",
      "title": "Original Figure 4.1",
      "titleKo": "원문 그림 4.1",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-1.png",
      "captionKo": "그림 4.1 · 방사속 Φ는 표면이나 공간 영역을 통과하는 단위 시간당 에너지입니다. 그림에서는 점광원을 둘러싼 구를 통과하는 방사속을 측정합니다.",
      "captionEn": "Figure 4.1: Radiant flux, normal upper Phi , measures energy passing through a surface or region of space. Here, flux from a point light source is measured at spheres that surround the light.",
      "width": 998,
      "height": 329,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 4,
      "titleKo": "2. 복사조도 (Irradiance $E$) 및 방출도 (Radiant Exitance $M$)",
      "titleEn": "Irradiance and Radiant Exitance",
      "id": "ch04-01-b19"
    },
    {
      "type": "paragraph",
      "textKo": "면적 A에 도착하는 총 방사속이 Φ라면 Φ/A는 그 영역의 평균 복사조도입니다. 한 점의 값은 미소 면적에 대한 극한 dΦ/dA로 정의합니다. 들어오는 흐름은 복사조도 E, 표면에서 떠나는 흐름은 방사출사도 M이며 단위는 모두 W/m²입니다. 사람이 느끼는 밝기로 가중한 조도(lx)와 구분합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-01-b20"
    },
    {
      "type": "paragraph",
      "textKo": "점 $p$에서의 국소 조도와 방출도는 미소 면적 $dA$에 대한 미소 방사속 $d\\Phi$의 극한으로 엄밀하게 정의됩니다:",
      "textEn": "More generally, we can define irradiance and radiant exitance by taking the limit of differential power per differential area at a point $p$:",
      "id": "ch04-01-b21"
    },
    {
      "type": "equation",
      "tex": "E(p) = \\frac{d\\Phi}{dA}, \\quad M(p) = \\frac{d\\Phi}{dA}",
      "id": "ch04-01-b22"
    },
    {
      "type": "paragraph",
      "textKo": "그림 4.1에서 점광원이 모든 방향으로 동일한 방사속 $\\Phi$를 방출할 때, 반지름이 $r$인 구면의 표면적은 $4\\pi r^2$이므로 구면 위의 임의의 점에서의 조도는 $E = \\frac{\\Phi}{4\\pi r^2}$가 됩니다. 이것이 바로 빛을 비출 때 **거리의 제곱에 반비례하여 어두워지는 거리 역제곱 법칙(Inverse-Square Law)**의 수학적 근원입니다.",
      "textEn": "This fact explains why the amount of energy received from a light at a point falls off with the squared distance from the light: $E = \\Phi / (4\\pi r^2)$.",
      "id": "ch04-01-b23"
    },
    {
      "type": "figure",
      "id": "fig-4-2",
      "number": "Figure 4.2",
      "title": "Original Figure 4.2",
      "titleKo": "원문 그림 4.2",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-2.png",
      "captionKo": "그림 4.2 · 같은 방향의 빛이라도 표면에 비스듬히 입사하면 더 넓게 퍼집니다. 그래서 복사조도에는 입사각의 코사인 인자가 들어갑니다.",
      "captionEn": "Figure 4.2: Lambert’s Law. Irradiance arriving at a surface varies according to the cosine of the angle of incidence of illumination, since illumination is over a larger area at larger incident angles.",
      "width": 998,
      "height": 346,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 4,
      "titleKo": "3. 방사강도 (Radiant Intensity, $I$)",
      "titleEn": "Intensity",
      "id": "ch04-01-b25"
    },
    {
      "type": "paragraph",
      "textKo": "이제 공간상의 한 점에서 광선들이 사방으로 뻗어나가는 각도별 분포를 고려해 봅시다. 크기가 없는 이상적인 점광원(Point Light)이 단위 구의 중심에 놓여 있을 때, 방출되는 방사속의 **입체각(Solid Angle, $\\omega$)당 각밀도**를 **방사강도(Intensity, $I$)**라고 합니다. 단위는 **스테라디안당 와트($\\text{W/sr}$)**입니다:",
      "textEn": "Consider now an infinitesimal light source emitting photons. Intensity, denoted by $I$, is the angular density of emitted power; it has units $\\text{W/sr}$. More generally we are interested in taking the limit of a differential cone of directions:",
      "id": "ch04-01-b26"
    },
    {
      "type": "equation",
      "tex": "I = \\lim_{\\Delta\\omega \\to 0} \\frac{\\Delta\\Phi}{\\Delta\\omega} = \\frac{d\\Phi}{d\\omega}",
      "id": "ch04-01-b27"
    },
    {
      "type": "paragraph",
      "textKo": "방사강도 I(ω)를 방향에 대해 적분하면 그 광원의 총 방사속을 얻습니다. PBRT에서는 특히 이상적인 점광원의 방향별 방출을 표현하는 데 사용합니다. 크기가 있는 광원의 전체 방향별 방출에도 정의할 수 있으므로, 점광원에서만 수학적으로 가능한 양은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-01-b28"
    },
    {
      "type": "subheading",
      "level": 4,
      "titleKo": "4. 방사휘도 (Radiance, $L$)",
      "titleEn": "Radiance",
      "id": "ch04-01-b29"
    },
    {
      "type": "paragraph",
      "textKo": "3D 컴퓨터 그래픽스 렌더링에서 **가장 중요하고 결정적인 물리량은 바로 방사휘도( Radiance, $L$)**입니다. 복사조도(Irradiance)는 한 점에 도달하는 면적당 전력을 알려주지만 어느 방향에서 빛이 왔는지 구별하지 못하며, 방사강도(Intensity)는 방향별 전력은 알려주지만 면적을 고려하지 못합니다. **방사도는 이 두 개념을 결합하여, 단위 투영 면적(Projected Area) 및 단위 입체각(Solid Angle)당 흐르는 방사속**을 측정합니다:",
      "textEn": "The final, and most important, radiometric quantity is radiance, $L$. Radiance measures irradiance or radiant exitance with respect to solid angles. It is defined by differential flux per unit projected area, per unit solid angle:",
      "id": "ch04-01-b30"
    },
    {
      "type": "equation",
      "tex": "L(p, \\omega) = \\frac{d^2\\Phi}{dA^\\perp \\, d\\omega} = \\frac{d^2\\Phi}{dA \\cos\\theta \\, d\\omega}",
      "id": "ch04-01-b31"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 $dA^\\perp = dA \\cos\\theta$는 광선 방향 $\\omega$에 수직인 가상 평면으로 투영된 미소 면적입니다(그림 4.3). 방사도의 단위는 **$\\text{W/(m}^2 \\cdot \\text{sr)}$**입니다.",
      "textEn": "where $dA^\\perp$ is the projected area of $dA$ on a hypothetical surface perpendicular to $\\omega$.",
      "id": "ch04-01-b32"
    },
    {
      "type": "figure",
      "id": "fig-4-3",
      "number": "Figure 4.3",
      "title": "Original Figure 4.3",
      "titleKo": "원문 그림 4.3",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-3.png",
      "captionKo": "그림 4.3 · 방사휘도 L은 단위 입체각 dω와 빛의 방향에 수직인 투영 면적 dA⊥당 방사속으로 정의합니다.",
      "captionEn": "Figure 4.3: Radiance upper L Subscript Superscript is defined as flux per unit solid angle normal d omega Subscript per unit projected area normal d upper A Subscript Superscript up-tack .",
      "width": 998,
      "height": 267,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "🎯 렌더링 핵심 통찰",
      "title": "왜 광선 추적에서는 방사휘도(Radiance)를 계산할까요?",
      "summary": "방사휘도(Radiance)가 지닌 놀라운 물리적 보존 성질",
      "points": [
        {
          "title": "흡수·산란·방출이 없는 균질한 공간에서의 방사휘도",
          "content": "진공처럼 흡수·산란·방출이 없고 굴절률이 일정한 공간에서는 같은 광선을 따라 방사휘도 $L$이 유지됩니다. 그러나 눈이나 센서가 받는 총에너지가 일정하다는 뜻은 아닙니다. 멀리 있는 물체는 더 작은 방향 범위를 차지하므로 총 수광량이 줄어들 수 있습니다. 안개와 경계면을 지나갈 때는 해당 매질과 반사·굴절의 영향을 별도로 계산합니다."
        },
        {
          "title": "센서는 여러 방향과 시간의 빛을 모아 기록합니다",
          "content": "한 픽셀은 한 가닥 광선의 값만 그대로 기록하지 않습니다. 렌즈를 통해 여러 방향에서 들어오는 빛을 면적·노출 시간·파장에 걸쳐 모으고 센서의 감도를 반영합니다. 적분은 여기서 작은 기여들을 모두 합하는 계산입니다. 그 뒤 색 변환과 표시 처리가 적용될 수 있으므로 최종 RGB가 특정 광선의 방사휘도에 언제나 정확히 비례한다고 말할 수 없습니다."
        }
      ],
      "tags": [
        "방사도 불변성",
        "광선 추적",
        "센서 렌더링"
      ],
      "id": "ch04-01-b34"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "입사 방사도($L_i$)와 출사 방사도($L_o$)",
      "titleEn": "Incident and Exitant Radiance Functions",
      "id": "ch04-01-b35"
    },
    {
      "type": "paragraph",
      "textKo": "표면 경계에서는 빛의 반사·투과·방출 때문에 방사휘도를 들어오는 쪽과 나가는 쪽으로 구분할 필요가 있습니다. Lᵢ와 Lₒ는 그 역할을 표시합니다. 반드시 모든 경계의 양쪽 값이 서로 다르다는 뜻은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-01-b36"
    },
    {
      "type": "figure",
      "id": "fig-4-4",
      "number": "Figure 4.4",
      "title": "Original Figure 4.4",
      "titleKo": "원문 그림 4.4",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-4.png",
      "captionKo": "그림 4.4 · Lᵢ는 점에 도달하는 빛, Lₒ는 점을 떠나는 빛의 방향별 분포입니다. PBRT에서는 두 함수의 방향 ω를 모두 표면에서 바깥쪽으로 잡습니다. 반대편에서 오는 빛을 적을 때는 −ω를 사용합니다.",
      "captionEn": "Figure 4.4: (a) The incident radiance function upper L Subscript normal i Baseline left-parenthesis normal p Subscript Baseline comma omega Subscript Baseline right-parenthesis describes the distribution of radiance arriving at a point as a function of position and direction. (b) The exitant radiance function upper L Subscript normal o Superscript Baseline left-parenthesis normal p Subscript Baseline comma omega Subscript Baseline right-parenthesis gives the distribution of radiance leaving the point. Note that for both functions, omega Subscript is oriented to point away from the surface, and thus, for example, upper L Subscript normal i Baseline left-parenthesis normal p Subscript Baseline comma minus omega Subscript Baseline right-parenthesis gives the radiance arriving on the other side of the surface than the one where omega Subscript lies.",
      "width": 998,
      "height": 272,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "표면이 없는 같은 위치 p에서 입사·출사 방향을 모두 바깥쪽으로 표시하면 Lᵢ(p,ω)=Lₒ(p,−ω)입니다. 서로 다른 두 위치의 값까지 같다고 하려면 그 사이가 흡수·산란·방출이 없고 굴절률이 일정한 구간이어야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-01-b38"
    },
    {
      "type": "equation",
      "tex": "L_i(p, \\omega) = L_o(p, -\\omega)",
      "id": "ch04-01-b39"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "방사측정학(Radiometry)과 광도학(Photometry)의 대응 관계",
      "titleEn": "Photometry and Luminance",
      "id": "ch04-01-b40"
    },
    {
      "type": "paragraph",
      "textKo": "방사측정학이 모든 파장의 전자기파 에너지를 객관적인 물리량으로 다룬다면, **광도학(Photometry)**은 **인간의 시각 시스템(망막)이 인지하는 밝기 감도**를 반영한 학문입니다. 인간의 눈은 모든 파장의 빛에 균일하게 반응하지 않으며, 녹색 계열(약 $555\\text{ nm}$)에 가장 민감하고 파란색이나 붉은색 끝단에는 상대적으로 둔감합니다. 이러한 인간 시각의 상대적 감도 곡선을 **시감도 함수(Spectral Response Curve, $V(\\lambda)$)**라고 부릅니다.",
      "textEn": "Photometry is the study of visible electromagnetic radiation in terms of its perception by the human visual system. Each spectral radiometric quantity can be converted to its corresponding photometric quantity by integrating against the spectral response curve $V(\\lambda)$.",
      "id": "ch04-01-b41"
    },
    {
      "type": "paragraph",
      "textKo": "표준 명소시 시감도 V(λ)로 스펙트럼 방사휘도를 가중 적분하면 휘도(cd/m²)를 구합니다. 아래 범위는 PBRT가 사용하는 360~830nm입니다. Lλ의 단위가 nm당 값인지 m당 값인지에 따라 dλ의 단위도 맞춰야 합니다. 이 표준 측정값이 관찰 조건에 따른 주관적 밝기를 전부 설명하지는 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-01-b42"
    },
    {
      "type": "equation",
      "tex": "Y = 683 \\int_{360}^{830} V(\\lambda) L_\\lambda \\, d\\lambda",
      "id": "ch04-01-b43"
    },
    {
      "type": "paragraph",
      "textKo": "방사측정학의 순수 물리량과 인간 시각을 반영한 광도학 물리량의 1:1 대응 관계는 다음 표와 같이 깔끔하게 정리됩니다:",
      "textEn": "All the radiometric quantities have photometric equivalents, summarized in the table below:",
      "id": "ch04-01-b44"
    },
    {
      "type": "concept-tip",
      "badge": "📊 방사측정학 vs 광도학 대응표",
      "title": "📊 방사측정학(물리)과 광도학(인간 시각)의 6대 물리량 1:1 완벽 대응표",
      "summary": "순수 물리 에너지와 인간의 눈이 느끼는 빛의 1:1 번역기",
      "points": [
        {
          "title": "에너지 (Energy)",
          "content": "• **방사측정학**: 방사 에너지 $Q$ (줄, J)\n• **광도학**: 광도 에너지 $Q_v$ (탈보트, Talbot = lm·s)"
        },
        {
          "title": "단위 시간당 에너지 (Power)",
          "content": "• **방사측정학**: 방사속 $\\Phi$ (와트, W)\n• **광도학**: 광속 $\\Phi_v$ (루멘, lm)"
        },
        {
          "title": "단위 입체각당 일률 (Angular Density)",
          "content": "• **방사측정학**: 방사강도 $I$ (W/sr)\n• **광도학**: 광도 $I_v$ (칸델라, cd)"
        },
        {
          "title": "도착하는 단위 면적당 일률 (Arrival Density)",
          "content": "• **방사측정학**: 복사조도 $E$ (W/m²)\n• **광도학**: 조도 $E_v$ (럭스, lx)"
        },
        {
          "title": "떠나는 단위 면적당 일률 (Leaving Density)",
          "content": "• **방사측정학**: 방출도 $M$ (W/m²)\n• **광도학**: 광속발산도 $M_v$ (럭스, lx)"
        },
        {
          "title": "단위 투영면적·입체각당 일률 (Directional Density)",
          "content": "• **방사측정학**: 방사휘도 $L$ (W/(m²·sr))\n• **광도학**: 휘도 $Y$ (칸델라 매 제곱미터, cd/m² 또는 nit)"
        }
      ],
      "tags": [
        "방사측정학",
        "광도학",
        "물리량대응",
        "단위정리"
      ],
      "id": "ch04-01-b45"
    }
  ],
  "audit": {
    "checkedSourceSha256": "4bc57f1242b67129db842ae022526ead425c33a81587cdadde2e40430e03e40f",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "4.1 Radiometry",
      "4.1.1  Basic Quantities",
      "Energy",
      "Flux",
      "Irradiance and Radiant Exitance",
      "Intensity",
      "Radiance",
      "4.1.2  Incident and Exitant Radiance Functions",
      "4.1.3  Radiometric Spectral Distributions",
      "4.1.4  Luminance and Photometry"
    ],
    "sourceFigures": [
      "4.1",
      "4.2",
      "4.3",
      "4.4"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
