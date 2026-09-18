import { SectionContent } from '../../../../types/book';

export const CH04_04_LIGHT_EMISSION: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '4',
  chapterTitleKo: '제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)',
  sectionNumber: '4.4',
  sectionTitle: 'Light Emission',
  sectionTitleKo: '4.4 광원 방출 메커니즘과 흑체 복사 (Light Emission)',
  originalUrl: 'https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Light_Emission.html',
  prevSection: {
    id: 'ch04-03',
    title: '4.3 표면 반사의 물리 (BRDF)',
  },
  nextSection: {
    id: 'ch04-05',
    title: '4.5 파장별 스펙트럼 표현',
  },
  summary: {
    keyTakeaways: [
      '모든 물체는 절대영도($0\\text{ K}$)보다 높은 온도를 가지면 원자 내부 전자의 열진동에 의해 전자기파를 방출하며, 이를 **열복사(Thermal Radiation)**라고 합니다.',
      '**흑체(Blackbody)**는 외부에서 입사하는 모든 빛을 100% 흡수하는 동시에 물리적으로 가능한 최대의 효율로 빛을 방출하는 이상적인 완전 복사체입니다.',
      '**플랑크 법칙(Planck\'s Law)**은 온도 $T$와 파장 $\\lambda$에 따라 흑체가 방출하는 방사도 $L_e(T, \\lambda)$를 수학적으로 완벽하게 기술하며, **슈테판-볼츠만 법칙($M = \\sigma T^4$)**에 의해 온도가 2배 오르면 방출 에너지는 $2^4 = 16$배로 폭증합니다.',
      '실제 3D 그래픽스에서는 복잡한 광원 스펙트럼을 직접 측정하는 대신, **색온도(Color Temperature, Kelvin)**와 CIE 표준 광원(백열등 A, 주광 D65)을 통해 물리적으로 정확한 조명을 손쉽게 세팅합니다.'
    ],
    prerequisites: [
      '물리학 기초 (원자, 전자 전이, 열에너지)',
      '미적분학 및 지수함수 ($e^x$)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '4.4 광원의 발광 물리와 복사 메커니즘 (Light Emission)',
      titleEn: '4.4 Light Emission'
    },
    {
      type: 'paragraph',
      textKo: '절대영도($-273.15^\\circ\\text{C} = 0\\text{ K}$) 이상의 온도를 가진 우주 만물의 원자들은 끊임없이 진동하고 있습니다. 맥스웰 방정식이 설명하듯, 전하를 띤 소립자들의 가속 운동은 다양한 파장에 걸쳐 전자기파(빛)를 방출하게 만듭니다. 실온($300\\text{ K}$)의 물체들은 대부분 눈에 보이지 않는 적외선(Infrared) 대역에서 열을 방출하지만, 온도가 수천 도 이상으로 뜨거워지면 가시광선 대역의 빛을 뿜어내며 붉거나 하얗게 빛나게 됩니다.',
      textEn: 'The atoms of an object with temperature above absolute zero are moving. In turn, the motion of atomic particles causes objects to emit electromagnetic radiation over a range of wavelengths. At room temperature most of the emission is at infrared frequencies; objects need to be much warmer to emit meaningful amounts at visible frequencies.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '현대 조명의 4가지 물리적 발광 원리',
      titleEn: 'Types of Lamps'
    },
    {
      type: 'paragraph',
      textKo: '3D 렌더링에서 실감 나는 조명을 시뮬레이션하려면 실제 조명 기구들의 물리적 방출 방식을 이해하는 것이 중요합니다:',
      textEn: 'A number of corresponding types of lamps are in wide use today:'
    },
    {
      type: 'concept-tip',
      badge: '💡 현대 조명의 4대 발광 원리',
      title: '💡 현대 인공 조명의 4가지 물리적 발광 메커니즘',
      summary: '백열등, 할로겐, 형광등, LED가 빛을 내는 물리적 차이',
      points: [
        {
          title: '1. 백열전구 (Incandescent Tungsten)',
          content: '얇은 텅스텐 필라멘트에 전류를 흘려 약 2700K로 가열할 때 방출되는 순수한 열복사 빛입니다. 투입 전력의 대부분이 빛이 아닌 적외선(열)으로 소모되어 에너지 효율이 낮습니다.'
        },
        {
          title: '2. 할로겐 램프 (Halogen)',
          content: '텅스텐 필라멘트 주변을 할로겐 가스로 채워, 증발한 텅스텐이 화학 반응으로 필라멘트로 되돌아오는 할로겐 순환 사이클을 이용합니다. 수명이 길고 유리벽이 검게 그을리지 않습니다.'
        },
        {
          title: '3. 기체 방전등 및 형광등 (Gas-Discharge / Fluorescent)',
          content: '아르곤이나 수은 증기에 고전압을 걸어 전자를 방전시키면 고유한 선 스펙트럼(자외선 등)이 방출됩니다. 형광 물질 코팅을 통해 자외선을 넓은 대역의 가시광선으로 변환합니다.'
        },
        {
          title: '4. 발광 다이오드 (LED)',
          content: '반도체 pn 접합부에 전류를 흘려 전자가 정공과 결합할 때 에너지가 광자로 직접 방출되는 **전계발광(Electroluminescence)**을 이용합니다. 열 손실이 극도로 적어 최고의 효율을 냅니다.'
        }
      ],
      tags: ['조명물리', '백열등', '형광등', 'LED']
    },
    {
      type: 'paragraph',
      textKo: '조명이 소비한 전기 전력 대비 인간이 볼 수 있는 가시광선을 얼마나 효율적으로 뽑아내는지를 나타내는 지표를 **발광 효능(Luminous Efficacy)**이라고 하며, 단위는 **루멘 매 와트($\\text{lm/W}$)**입니다. 백열전구는 약 $15\\text{ lm/W}$에 불과하지만, 이론적으로 인간 시각이 가장 민감한 $555\\text{ nm}$ 단색광을 $100\\%$ 방출하는 이상적인 램프의 최대 효능 한계는 $683\\text{ lm/W}$입니다.',
      textEn: 'Luminous efficacy measures how effectively a light source converts power to visible illumination: $\\frac{\\Phi_v}{\\Phi}$. A typical value for an incandescent lightbulb is around 15 lm/W. The highest possible value is 683 lm/W at $\\lambda = 555\\text{ nm}$.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '흑체 복사와 플랑크 법칙 (Blackbody Radiation & Planck\'s Law)',
      titleEn: '4.4.1 Blackbody Emitters'
    },
    {
      type: 'paragraph',
      textKo: '**흑체(Blackbody)**는 입사하는 모든 전자기파를 반사 없이 $100\\%$ 흡수하는 이상적인 물체입니다. 열역학적으로 완벽한 흡수체는 동시에 **물리적으로 가장 완벽한 효율을 내는 발광체**가 됩니다. 흑체는 방향에 따른 차이 없이 모든 각도로 균일하게 빛을 내뿜는 완전 난반사(Diffuse) 방출체입니다.',
      textEn: 'A blackbody is a perfect emitter: it converts power to electromagnetic radiation as efficiently as physically possible. Blackbodies absorb absolutely all incident power, reflecting none of it. Blackbody emitters are perfectly diffuse; they emit radiance equally in all directions.'
    },
    {
      type: 'paragraph',
      textKo: '막스 플랑크(Max Planck)가 유도한 **플랑크 법칙(Planck\'s Law)**은 절대온도 $T$ (켈빈, $\\text{K}$)를 갖는 흑체가 특정 파장 $\\lambda$에서 방출하는 방사도(휘도, $L_e$)를 다음과 같은 엄밀한 닫힌 형식(Closed-form)으로 제공합니다:',
      textEn: 'Planck’s law gives the radiance emitted by a blackbody as a function of wavelength $\\lambda$ and temperature $T$ measured in kelvins:'
    },
    {
      type: 'equation',
      tex: 'L_e(T, \\lambda) = \\frac{2 h c^2}{\\lambda^5 \\left( e^{\\frac{h c}{\\lambda k_b T}} - 1 \\right)}'
    },
    {
      type: 'paragraph',
      textKo: '여기서 $c$는 빛의 속도($2.9979 \\times 10^8\\text{ m/s}$), $h$는 플랑크 상수($6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$), $k_b$는 볼츠만 상수($1.3806 \\times 10^{-23}\\text{ J/K}$)입니다. 그림 4.12는 다양한 온도에서 흑체가 방출하는 파장별 스펙트럼 곡선을 보여줍니다. 온도가 올라갈수록 피크 파장이 짧아지고(청색 쪽으로 이동), 전체 방출 면적이 급격히 거대해집니다.',
      textEn: 'where $c$ is the speed of light, $h$ is Planck’s constant, and $k_b$ is the Boltzmann constant. Figure 4.12 plots the emitted radiance distributions of a blackbody for a number of temperatures.'
    },
    {
      type: 'figure',
      id: 'fig-4-12',
      number: 'Figure 4.12',
      captionKo: '그림 4.12: 다양한 온도($2000\\text{ K} \\sim 6000\\text{ K}$)에서 흑체의 플랑크 복사 스펙트럼 분포. 온도가 $2000\\text{ K}$일 때는 대부분 적외선 영역에 머물지만, 태양 표면 온도인 $6000\\text{ K}$에 가까워지면 가시광선 대역(회색 음영 영역) 전체를 강렬하게 채우며 흰빛을 띠게 됩니다.',
      captionEn: 'Figure 4.12: Emitted radiance distributions of a blackbody for temperatures from 2000 K to 6000 K. As temperature increases, peak emission shifts to shorter wavelengths.',
      title: '흑체 플랑크 스펙트럼 곡선',
      titleKo: '흑체 복사 스펙트럼',
      src: '/books/pbrt-4ed/images/pha04f12.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '슈테판-볼츠만 법칙과 빈의 변위 법칙',
      titleEn: 'Stefan-Boltzmann Law & Wien\'s Law'
    },
    {
      type: 'paragraph',
      textKo: '흑체 표면의 한 점에서 모든 파장과 모든 반구 방향으로 방출되는 총 방사출사도(Radiant Exitance, $M$)는 **슈테판-볼츠만 법칙(Stefan–Boltzmann Law)**에 의해 온도의 4제곱에 비례합니다:',
      textEn: 'The Stefan–Boltzmann law gives the radiant exitance at a point for a blackbody emitter:'
    },
    {
      type: 'equation',
      tex: 'M = \\sigma T^4'
    },
    {
      type: 'paragraph',
      textKo: '여기서 $\\sigma \\approx 5.67032 \\times 10^{-8}\\text{ W}/(\\text{m}^2\\cdot\\text{K}^4)$는 슈테판-볼츠만 상수입니다. 방출 에너지가 $T^4$으로 비례한다는 것은 엄청난 의미를 갖습니다: **흑체의 온도를 단 2배만 올려도, 방출되는 총 빛 에너지는 무려 $2^4 = 16$배로 폭증**합니다!',
      textEn: 'where $\\sigma$ is the Stefan–Boltzmann constant. Note that total emission grows very rapidly—at the rate $T^4$. Doubling temperature increases total energy emitted by a factor of 16.'
    },
    {
      type: 'paragraph',
      textKo: '또한 흑체 스펙트럼 곡선에서 에너지가 가장 강하게 뿜어져 나오는 최정상 피크 파장 $\\lambda_{\\max}$는 **빈의 변위 법칙(Wien\'s Displacement Law)**에 의해 온도에 반비례합니다:',
      textEn: 'Wien’s displacement law gives the wavelength where emission of a blackbody is maximum given its temperature:'
    },
    {
      type: 'equation',
      tex: '\\lambda_{\\max} = \\frac{b}{T}, \\quad b \\approx 2.89777 \\times 10^{-3}\\text{ m}\\cdot\\text{K}'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 실전 그래픽스: 왜 3D 렌더링에서 전구 색상을 RGB 대신 색온도(Kelvin)로 지정할까?',
      summary: '블렌더, 마야, 언리얼 엔진에서 조명 설정할 때 보는 6500K의 정체',
      points: [
        {
          title: '인간 직관과 물리적 일치',
          content: '3D 아티스트에게 "따뜻한 카페 조명을 위해 RGB(255, 197, 143)을 입력하세요"라고 하면 직관적이지 않고, 다른 광원들과의 물리적 에너지 비율이 어긋나기 쉽습니다. 하지만 "촛불은 약 1900K, 백열등은 2800K, 한낮 태양광은 5500~6500K, 흐린 날 하늘은 8000K"라는 **색온도(Color Temperature)**를 사용하면 단 하나의 물리적 수치(K)만으로 완벽하게 자연스러운 조명 색조를 만들 수 있습니다.'
        },
        {
          title: '흑체 복사 기반의 스펙트럼 재현',
          content: 'pbrt 내부에서는 사용자가 입력한 색온도 $T$를 플랑크 법칙 $L_e(T, \\lambda)$에 대입하여 연속적인 파장별 스펙트럼을 즉석에서 물리적으로 정확하게 계산합니다.'
        }
      ],
      tags: ['색온도', '플랑크 법칙', '조명 아티스트']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: 'CIE 표준 광원 (Standard Illuminants)',
      titleEn: '4.4.2 Standard Illuminants'
    },
    {
      type: 'paragraph',
      textKo: '국제조명위원회(CIE)는 컴퓨터 그래픽스와 디스플레이 공학에서 기준 광원으로 사용할 수 있도록 일련의 **표준 광원(Standard Illuminants)** 스펙트럼 규격을 제정했습니다:',
      textEn: 'Another useful way of categorizing light emission distributions is standard illuminants defined by CIE:'
    },
    {
      type: 'figure',
      id: 'fig-4-13',
      number: 'Figure 4.13',
      captionKo: '그림 4.13: CIE 표준 광원 A의 파장별 스펙트럼 분포. 가정용 백열전구를 대표하며, 약 $2856\\text{ K}$의 흑체 복사 스펙트럼과 거의 일치하여 붉은색 파장으로 갈수록 에너지가 완만하게 증가합니다.',
      captionEn: 'Figure 4.13: Spectral distribution of CIE Standard Illuminant A, representing incandescent light with blackbody at ~2856 K.',
      title: 'CIE 표준 광원 A',
      titleKo: '표준 광원 A (백열등)',
      src: '/books/pbrt-4ed/images/pha04f13.svg',
    },
    {
      type: 'figure',
      id: 'fig-4-14',
      number: 'Figure 4.14',
      captionKo: '그림 4.14: CIE 표준 주광 광원 D65의 스펙트럼 분포. 색온도 약 $6504\\text{ K}$인 유럽의 맑은 정오 태양광과 하늘빛을 모사한 것으로, 모니터 sRGB 및 전 세계 디지털 영상의 절대적인 백색점(White Point) 표준입니다.',
      captionEn: 'Figure 4.14: Spectral distribution of CIE Standard Illuminant D65, representing midday daylight at color temperature ~6504 K.',
      title: 'CIE 표준 광원 D65',
      titleKo: '표준 광원 D65 (자연 주광)',
      src: '/books/pbrt-4ed/images/pha04f14.svg',
    },
    {
      type: 'figure',
      id: 'fig-4-15',
      number: 'Figure 4.15',
      captionKo: '그림 4.15: 형광등 광원을 나타내는 CIE F 시리즈 표준 광원(F2, F11)의 스펙트럼. 수은 원자의 뾰족한 방전 피크와 형광체 코팅의 연속 스펙트럼이 섞여 있는 전형적인 형광등 특성을 보여줍니다.',
      captionEn: 'Figure 4.15: Spectral distributions of fluorescent illuminants F2 and F11, showing sharp mercury emission peaks.',
      title: 'CIE 형광등 표준 광원 F',
      titleKo: '표준 광원 F (형광등)',
      src: '/books/pbrt-4ed/images/pha04f15.svg',
    }
  ]
};
