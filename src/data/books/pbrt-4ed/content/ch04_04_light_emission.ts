import type { SectionContent } from '../../../../types/book';

export const CH04_04_LIGHT_EMISSION: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "4",
  "chapterTitleKo": "제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)",
  "sectionNumber": "4.4",
  "sectionTitle": "Light Emission",
  "sectionTitleKo": "4.4 광원 방출 메커니즘과 흑체 복사 (Light Emission)",
  "originalUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Light_Emission.html",
  "prevSection": {
    "id": "ch04-03",
    "title": "4.3 표면 반사의 물리 (BRDF)"
  },
  "nextSection": {
    "id": "ch04-05",
    "title": "4.5 파장별 스펙트럼 표현"
  },
  "summary": {
    "keyTakeaways": [
      "물체는 온도와 방출 성질에 따라 열복사를 합니다. 흑체는 주어진 온도에서의 이상적인 열평형 방출 모델이며, 실제 물체의 방출률은 파장·방향에 따라 달라집니다.",
      "**흑체(Blackbody)**는 외부에서 입사하는 모든 빛을 100% 흡수하는 동시에 물리적으로 가능한 최대의 효율로 빛을 방출하는 이상적인 완전 복사체입니다.",
      "**플랑크 법칙(Planck's Law)**은 온도 $T$와 파장 $\\lambda$에 따라 흑체가 방출하는 방사도 $L_e(T, \\lambda)$를 수학적으로 완벽하게 기술하며, **슈테판-볼츠만 법칙($M = \\sigma T^4$)**에 의해 온도가 2배 오르면 방출 에너지는 $2^4 = 16$배로 폭증합니다.",
      "실제 3D 그래픽스에서는 복잡한 광원 스펙트럼을 직접 측정하는 대신, **색온도(Color Temperature, Kelvin)**와 CIE 표준 광원(백열등 A, 주광 D65)을 통해 물리적으로 정확한 조명을 손쉽게 세팅합니다."
    ],
    "prerequisites": [
      "물리학 기초 (원자, 전자 전이, 열에너지)",
      "미적분학 및 지수함수 ($e^x$)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "4.4 광원의 발광 물리와 복사 메커니즘 (Light Emission)",
      "titleEn": "4.4 Light Emission",
      "id": "ch04-04-b1"
    },
    {
      "type": "paragraph",
      "textKo": "절대영도($-273.15^\\circ\\text{C} = 0\\text{ K}$) 이상의 온도를 가진 우주 만물의 원자들은 끊임없이 진동하고 있습니다. 맥스웰 방정식이 설명하듯, 전하를 띤 소립자들의 가속 운동은 다양한 파장에 걸쳐 전자기파(빛)를 방출하게 만듭니다. 실온($300\\text{ K}$)의 물체들은 대부분 눈에 보이지 않는 적외선(Infrared) 대역에서 열을 방출하지만, 온도가 수천 도 이상으로 뜨거워지면 가시광선 대역의 빛을 뿜어내며 붉거나 하얗게 빛나게 됩니다.",
      "textEn": "The atoms of an object with temperature above absolute zero are moving. In turn, the motion of atomic particles causes objects to emit electromagnetic radiation over a range of wavelengths. At room temperature most of the emission is at infrared frequencies; objects need to be much warmer to emit meaningful amounts at visible frequencies.",
      "id": "ch04-04-b2"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "현대 조명의 4가지 물리적 발광 원리",
      "titleEn": "Types of Lamps",
      "id": "ch04-04-b3"
    },
    {
      "type": "paragraph",
      "textKo": "3D 렌더링에서 실감 나는 조명을 시뮬레이션하려면 실제 조명 기구들의 물리적 방출 방식을 이해하는 것이 중요합니다:",
      "textEn": "A number of corresponding types of lamps are in wide use today:",
      "id": "ch04-04-b4"
    },
    {
      "type": "concept-tip",
      "badge": "💡 현대 조명의 4대 발광 원리",
      "title": "💡 현대 인공 조명의 4가지 물리적 발광 메커니즘",
      "summary": "백열등, 할로겐, 형광등, LED가 빛을 내는 물리적 차이",
      "points": [
        {
          "title": "1. 백열전구 (Incandescent Tungsten)",
          "content": "얇은 텅스텐 필라멘트에 전류를 흘려 약 2700K로 가열할 때 방출되는 순수한 열복사 빛입니다. 투입 전력의 대부분이 빛이 아닌 적외선(열)으로 소모되어 에너지 효율이 낮습니다."
        },
        {
          "title": "2. 할로겐 램프 (Halogen)",
          "content": "텅스텐 필라멘트 주변을 할로겐 가스로 채워, 증발한 텅스텐이 화학 반응으로 필라멘트로 되돌아오는 할로겐 순환 사이클을 이용합니다. 수명이 길고 유리벽이 검게 그을리지 않습니다."
        },
        {
          "title": "3. 기체 방전등 및 형광등 (Gas-Discharge / Fluorescent)",
          "content": "아르곤이나 수은 증기에 고전압을 걸어 전자를 방전시키면 고유한 선 스펙트럼(자외선 등)이 방출됩니다. 형광 물질 코팅을 통해 자외선을 넓은 대역의 가시광선으로 변환합니다."
        },
        {
          "title": "4. 발광 다이오드 (LED)",
          "content": "반도체 pn 접합부에 전류를 흘려 전자가 정공과 결합할 때 에너지가 광자로 직접 방출되는 **전계발광(Electroluminescence)**을 이용합니다. 열 손실이 극도로 적어 최고의 효율을 냅니다."
        }
      ],
      "tags": [
        "조명물리",
        "백열등",
        "형광등",
        "LED"
      ],
      "id": "ch04-04-b5"
    },
    {
      "type": "paragraph",
      "textKo": "광효율(lm/W)을 말할 때 분모가 방출한 복사 전력인지 입력 전기 전력인지 구분합니다. 683lm/W는 표준 시감도가 최대인 단색 방사에 대한 광학적 환산 기준입니다. 실제 램프에는 전기에서 빛으로 바뀌는 손실도 있으며, 모든 백색 광원이 이 값에 도달한다는 뜻은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-04-b6"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "흑체 복사와 플랑크 법칙 (Blackbody Radiation & Planck's Law)",
      "titleEn": "4.4.1 Blackbody Emitters",
      "id": "ch04-04-b7"
    },
    {
      "type": "paragraph",
      "textKo": "흑체는 입사하는 복사를 모두 흡수하며, 열평형 상태에서 같은 온도의 수동 열복사체가 낼 수 있는 방출의 기준을 제공합니다. 이상적인 흑체 표면의 방사휘도는 방향과 무관하지만, 표면의 방사강도에는 투영 면적의 코사인 인자가 있습니다. 전기 에너지의 가시광 변환 효율이 가장 높다는 의미는 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-04-b8"
    },
    {
      "type": "paragraph",
      "textKo": "막스 플랑크(Max Planck)가 유도한 **플랑크 법칙(Planck's Law)**은 절대온도 $T$ (켈빈, $\\text{K}$)를 갖는 흑체가 특정 파장 $\\lambda$에서 방출하는 방사휘도( $L_e$)를 다음과 같은 엄밀한 닫힌 형식(Closed-form)으로 제공합니다:",
      "textEn": "Planck’s law gives the radiance emitted by a blackbody as a function of wavelength $\\lambda$ and temperature $T$ measured in kelvins:",
      "id": "ch04-04-b9"
    },
    {
      "type": "equation",
      "tex": "L_e(T, \\lambda) = \\frac{2 h c^2}{\\lambda^5 \\left( e^{\\frac{h c}{\\lambda k_b T}} - 1 \\right)}",
      "id": "ch04-04-b10"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 $c$는 빛의 속도($2.9979 \\times 10^8\\text{ m/s}$), $h$는 플랑크 상수($6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$), $k_b$는 볼츠만 상수($1.3806 \\times 10^{-23}\\text{ J/K}$)입니다. 그림 4.12는 다양한 온도에서 흑체가 방출하는 파장별 스펙트럼 곡선을 보여줍니다. 온도가 올라갈수록 피크 파장이 짧아지고(청색 쪽으로 이동), 전체 방출 면적이 급격히 거대해집니다.",
      "textEn": "where $c$ is the speed of light, $h$ is Planck’s constant, and $k_b$ is the Boltzmann constant. Figure 4.12 plots the emitted radiance distributions of a blackbody for a number of temperatures.",
      "id": "ch04-04-b11"
    },
    {
      "type": "figure",
      "id": "fig-4-12",
      "number": "Figure 4.12",
      "title": "Original Figure 4.12",
      "titleKo": "원문 그림 4.12",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-12.png",
      "captionKo": "그림 4.12 · 서로 다른 온도의 흑체가 파장마다 방출하는 방사휘도입니다. 온도가 높아지면 분포가 짧은 파장 쪽으로 이동하고 총방출량도 빠르게 증가합니다.",
      "captionEn": "Figure 4.12: Plots of emitted radiance as a function of wavelength for blackbody emitters at a few temperatures, as given by Equation ( 4.17 ). Note that as temperature increases, more of the emitted light is in the visible frequencies (roughly 380 nm–780 nm) and that the spectral distribution shifts from reddish colors to bluish colors. The total amount of emitted energy grows quickly as temperature increases, as described by the Stefan–Boltzmann law in Equation ( 4.19 ).",
      "width": 998,
      "height": 283,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Light_Emission.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "슈테판-볼츠만 법칙과 빈의 변위 법칙",
      "titleEn": "Stefan-Boltzmann Law & Wien's Law",
      "id": "ch04-04-b13"
    },
    {
      "type": "paragraph",
      "textKo": "흑체 표면의 한 점에서 모든 파장과 모든 반구 방향으로 방출되는 총 방사출사도(Radiant Exitance, $M$)는 **슈테판-볼츠만 법칙(Stefan–Boltzmann Law)**에 의해 온도의 4제곱에 비례합니다:",
      "textEn": "The Stefan–Boltzmann law gives the radiant exitance at a point for a blackbody emitter:",
      "id": "ch04-04-b14"
    },
    {
      "type": "equation",
      "tex": "M = \\sigma T^4",
      "id": "ch04-04-b15"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 $\\sigma \\approx 5.67032 \\times 10^{-8}\\text{ W}/(\\text{m}^2\\cdot\\text{K}^4)$는 슈테판-볼츠만 상수입니다. 방출 에너지가 $T^4$으로 비례한다는 것은 엄청난 의미를 갖습니다: **흑체의 온도를 단 2배만 올려도, 방출되는 총 빛 에너지는 무려 $2^4 = 16$배로 폭증**합니다!",
      "textEn": "where $\\sigma$ is the Stefan–Boltzmann constant. Note that total emission grows very rapidly—at the rate $T^4$. Doubling temperature increases total energy emitted by a factor of 16.",
      "id": "ch04-04-b16"
    },
    {
      "type": "paragraph",
      "textKo": "또한 흑체 스펙트럼 곡선에서 에너지가 가장 강하게 뿜어져 나오는 최정상 피크 파장 $\\lambda_{\\max}$는 **빈의 변위 법칙(Wien's Displacement Law)**에 의해 온도에 반비례합니다:",
      "textEn": "Wien’s displacement law gives the wavelength where emission of a blackbody is maximum given its temperature:",
      "id": "ch04-04-b17"
    },
    {
      "type": "equation",
      "tex": "\\lambda_{\\max} = \\frac{b}{T}, \\quad b \\approx 2.89777 \\times 10^{-3}\\text{ m}\\cdot\\text{K}",
      "id": "ch04-04-b18"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "색온도만으로 임의의 스펙트럼을 복원할 수는 없습니다",
      "summary": "색온도만으로 임의의 스펙트럼을 복원할 수는 없습니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "흑체의 온도는 플랑크 분포의 모양을 정합니다. 비흑체 광원의 상관 색온도는 그 색이 어느 흑체 색과 가까운지를 나타냅니다. 같은 상관 색온도의 LED와 주광은 다른 스펙트럼을 가질 수 있습니다. 색온도만 맞췄다고 모든 물체 색과 광학 현상까지 같아지는 것은 아닙니다."
        }
      ],
      "tags": [
        "색온도",
        "플랑크 법칙",
        "조명 아티스트"
      ],
      "id": "ch04-04-b19"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "CIE 표준 광원 (Standard Illuminants)",
      "titleEn": "4.4.2 Standard Illuminants",
      "id": "ch04-04-b20"
    },
    {
      "type": "paragraph",
      "textKo": "국제조명위원회(CIE)는 컴퓨터 그래픽스와 디스플레이 공학에서 기준 광원으로 사용할 수 있도록 일련의 **표준 광원(Standard Illuminants)** 스펙트럼 규격을 제정했습니다:",
      "textEn": "Another useful way of categorizing light emission distributions is standard illuminants defined by CIE:",
      "id": "ch04-04-b21"
    },
    {
      "type": "figure",
      "id": "fig-4-13",
      "number": "Figure 4.13",
      "title": "Original Figure 4.13",
      "titleKo": "원문 그림 4.13",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-13.png",
      "captionKo": "그림 4.13 · CIE 표준광 A의 스펙트럼입니다. 백열등 조명을 대표하며 약 2,856K 흑체 분포에 가깝습니다.",
      "captionEn": "Figure 4.13: Plot of the CIE Standard Illuminant A’s Spectral Power Distribution as a Function of Wavelength in nm. This illuminant represents incandescent illumination and is close to a blackbody at 2856 normal upper K .",
      "width": 998,
      "height": 321,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Light_Emission.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-4-14",
      "number": "Figure 4.14",
      "title": "Original Figure 4.14",
      "titleKo": "원문 그림 4.14",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-14.png",
      "captionKo": "그림 4.14 · 표준광 D65의 스펙트럼입니다. 주광을 대표하는 분포로 색 공간의 백색점 정의에 흔히 사용됩니다. 흑체 하나와 정확히 같은 분포는 아닙니다.",
      "captionEn": "Figure 4.14: Plot of the CIE Standard D65 Illuminant Spectral Distribution as a Function of Wavelength in nm. This illuminant represents noontime daylight at European latitudes and is commonly used to define the whitepoint of color spaces (Section 4.6.3 ).",
      "width": 998,
      "height": 321,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Light_Emission.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-4-15",
      "number": "Figure 4.15",
      "title": "Original Figure 4.15",
      "titleKo": "원문 그림 4.15",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-15.png",
      "captionKo": "그림 4.15 · F4와 F9 형광등 표준광 분포입니다. 뾰족한 성분은 기체 원자의 방출, 다른 부분은 형광 코팅의 기여입니다. F9는 여러 형광체로 더 넓고 고른 분포를 만듭니다.",
      "captionEn": "Figure 4.15: Plots of the F4 and F9 Standard Illuminants as a Function of Wavelength in nm. These represent two fluorescent lights. Note that the distributions are quite different. Spikes in the two distributions correspond to the wavelengths directly emitted by atoms in the gas, while the other wavelengths are generated by the bulb’s fluorescent coating. The F9 illuminant is a “broadband” emitter that uses multiple phosphors to achieve a more uniform spectral distribution.",
      "width": 998,
      "height": 320,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Light_Emission.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "6e729d9fb7911d9ae481ab7cf2cb98a4908e1acf6d5cb3472d3dfa514c7bb2e0",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "4.4 Light Emission",
      "4.4.1  Blackbody Emitters",
      "4.4.2  Standard Illuminants"
    ],
    "sourceFigures": [
      "4.12",
      "4.13",
      "4.14",
      "4.15"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
