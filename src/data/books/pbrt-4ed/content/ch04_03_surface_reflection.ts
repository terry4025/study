import type { SectionContent } from '../../../../types/book';

export const CH04_03_SURFACE_REFLECTION: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "4",
  "chapterTitleKo": "제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)",
  "sectionNumber": "4.3",
  "sectionTitle": "Surface Reflection",
  "sectionTitleKo": "4.3 표면 반사의 물리와 BRDF (Surface Reflection)",
  "originalUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Surface_Reflection.html",
  "prevSection": {
    "id": "ch04-02",
    "title": "4.2 광학 적분 다루기"
  },
  "nextSection": {
    "id": "ch04-04",
    "title": "4.4 광원 방출 메커니즘"
  },
  "summary": {
    "keyTakeaways": [
      "표면 반사는 특정 방향 $\\omega_i$에서 들어온 빛이 다른 방향 $\\omega_o$로 얼마나 반사되는지를 정량화하며, 이를 수학적으로 정의한 함수가 바로 **BRDF(양방향 반사율 분포 함수)**입니다.",
      "물리적으로 유효한 BRDF는 반드시 두 가지 법칙을 만족해야 합니다: 빛의 방향을 뒤집어도 값이 같은 **헬름홀츠 상호성(Helmholtz Reciprocity)**, 반사된 총 에너지가 입사 에너지 이하인 **에너지 보존(Energy Conservation)**.",
      "표면에서 반사되어 나가는 빛을 구하는 **반사 방정식(Reflection / Scattering Equation)**은 모든 입사 방향에 대해 BRDF와 입사 방사휘도, 그리고 코사인 가중치를 곱해 적분하는 형태로 렌더링 방정식의 핵심 뼈대가 됩니다.",
      "피부, 우유, 옥(Jade), 왁스처럼 빛이 표면 안으로 파고들어 내부에서 산란된 후 다른 위치로 튀어나오는 반투명 재질은 **BSSRDF(표면하 산란 반사 분포 함수)**를 통해 4차원 적분으로 모델링합니다."
    ],
    "prerequisites": [
      "방사측정학 기본 개념 (조도 $E$, 휘도 $L$)",
      "3차원 단위 반구 적분 및 내적($\\cos\\theta$)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "4.3 표면 반사의 물리적 메커니즘 (Surface Reflection)",
      "titleEn": "4.3 Surface Reflection",
      "id": "ch04-03-b1"
    },
    {
      "type": "paragraph",
      "textKo": "빛이 물체 표면에 닿으면 표면 재질은 빛을 산란시켜 그중 일부를 다시 외부 환경으로 반사해 보냅니다. 이러한 표면 반사를 물리적으로 충실하게 모델링하기 위해서는 두 가지 핵심 요소를 기술해야 합니다: 바로 반사되는 빛의 **스펙트럼 파장별 분포(Spectral Distribution)**와 **공간적 방향별 분포(Directional Distribution)**입니다.",
      "textEn": "When light is incident on a surface, the surface scatters the light, reflecting some of it back into the environment. There are two main effects that need to be described to model this reflection: the spectral distribution of the reflected light and its directional distribution.",
      "id": "ch04-03-b2"
    },
    {
      "type": "paragraph",
      "textKo": "예를 들어 노란 레몬 껍질은 파란색 파장의 빛을 대부분 흡수하고 빨간색과 초록색 파장의 빛을 강하게 반사하기 때문에 백색광을 비추었을 때 우리 눈에 노란색으로 보입니다. 또한 레몬은 어느 각도에서 바라보든 거의 균일한 색상을 유지하지만(난반사/디퓨즈), 특정 조명 방향에서는 밝고 하얀 하이라이트(정반사/스펙큘러)가 맺히기도 합니다. 반면 매끄러운 거울 표면은 난반사가 거의 없고 오직 시선 방향과 법선의 반사각에 의해서만 보이는 물체가 결정됩니다.",
      "textEn": "For example, the skin of a lemon mostly absorbs light in the blue wavelengths but reflects most of the light in the red and green wavelengths. Therefore, when it is illuminated with white light, its color is yellow. In contrast, the light reflected from a point in a mirror depends almost entirely on the viewing direction.",
      "id": "ch04-03-b3"
    },
    {
      "type": "paragraph",
      "textKo": "피부, 나뭇잎, 촛농(왁스), 대리석, 우유와 같은 반투명(Translucent) 물질의 반사는 한층 더 복잡합니다. 빛이 표면의 한 점 $p_i$로 침투한 뒤 내부 세포나 입자들과 무수히 충돌(산란)하다가 떨어진 다른 점 $p_o$를 통해 바깥으로 빠져나오는 **표면하 산란(Subsurface Light Transport)**을 겪기 때문입니다 (어두운 곳에서 손가락 뒤에 스마트폰 플래시를 대면 손가락 전체가 붉게 달아오르듯 빛나는 현상이 대표적입니다).",
      "textEn": "Reflection from translucent surfaces is more complex; a variety of materials ranging from skin and leaves to wax and liquids exhibit subsurface light transport, where light that enters the surface at one point exits it some distance away.",
      "id": "ch04-03-b4"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "BRDF: 양방향 반사율 분포 함수 (Bidirectional Reflectance Distribution Function)",
      "titleEn": "4.3.1 The BRDF",
      "id": "ch04-03-b5"
    },
    {
      "type": "paragraph",
      "textKo": "빛이 표면 내부로 파고들지 않고 충돌한 바로 그 지점에서 즉시 반사된다고 가정할 때, 표면의 반사 특성을 엄밀하게 기술하는 수학적 함수가 바로 **BRDF(양방향 반사율 분포 함수, $f_r$)**입니다. 그림 4.10의 기하 구성을 살펴봅시다: 임의의 입사 방향 $\\omega_i$를 따라 쏟아지는 입사 방사도 $L_i(p, \\omega_i)$로 인해 표면 위의 점 $p$가 받는 미소 조도(Differential Irradiance)는 다음과 같습니다:",
      "textEn": "The bidirectional reflectance distribution function (BRDF) gives a formalism for describing reflection from a surface. Consider the setting in Figure 4.10: If the direction $\\omega_i$ is considered as a differential cone of directions, the differential irradiance at $p$ is:",
      "id": "ch04-03-b6"
    },
    {
      "type": "equation",
      "tex": "dE(p, \\omega_i) = L_i(p, \\omega_i) \\cos\\theta_i \\, d\\omega_i",
      "id": "ch04-03-b7"
    },
    {
      "type": "paragraph",
      "textKo": "기하 광학의 선형성 가정에 따라, 이 미소 조도 $dE$에 의해 관찰자 방향 $\\omega_o$로 반사되어 나가는 미소 출사 방사도 $dL_o(p, \\omega_o)$는 입사된 미소 조도 $dE$에 정확히 비례합니다. 이때 **비례 상수 역할을 하는 함수가 바로 해당 표면의 BRDF $f_r$**입니다:",
      "textEn": "Because of the linearity assumption from geometric optics, the reflected differential radiance is proportional to the irradiance. The constant of proportionality defines the surface’s BRDF $f_r$:",
      "id": "ch04-03-b8"
    },
    {
      "type": "equation",
      "tex": "f_r(p, \\omega_o, \\omega_i) = \\frac{dL_o(p, \\omega_o)}{dE(p, \\omega_i)} = \\frac{dL_o(p, \\omega_o)}{L_i(p, \\omega_i) \\cos\\theta_i \\, d\\omega_i}",
      "id": "ch04-03-b9"
    },
    {
      "type": "paragraph",
      "textKo": "방사도($\\text{W/(m}^2\\cdot\\text{sr)}$)를 조도($\\text{W/m}^2$)로 나눈 값이므로, **BRDF의 단위는 스테라디안의 역수($\\text{sr}^{-1}$)**입니다.",
      "textEn": "The units of the BRDF are inverse steradians ($\\text{sr}^{-1}$).",
      "id": "ch04-03-b10"
    },
    {
      "type": "figure",
      "id": "fig-4-10",
      "number": "Figure 4.10",
      "title": "Original Figure 4.10",
      "titleKo": "원문 그림 4.10",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-10.png",
      "captionKo": "그림 4.10 · BRDF는 입사 방향과 출사 방향의 쌍에 대한 4차원 함수입니다. 특정 방향에서 들어오는 빛이 어떤 출사 방향으로 얼마나 반사되는지를 나타냅니다.",
      "captionEn": "Figure 4.10: The BRDF. The bidirectional reflectance distribution function is a 4D function over pairs of directions omega Subscript normal i and omega Subscript normal o that describes how much incident light along omega Subscript normal i is scattered from the surface in the direction omega Subscript normal o .",
      "width": 998,
      "height": 252,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Surface_Reflection.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "물리 기반 BRDF의 2대 절대 법칙",
      "titleEn": "Physical Properties of BRDFs",
      "id": "ch04-03-b12"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 사용하는 수동·선형·상호적인 반사 모델은 비음수성, 상호성, 에너지 보존 조건을 만족하도록 구성합니다. 편광·비상호 광학계 등까지 포괄하는 모든 자연 현상의 절대 조건으로 일반화하지 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-03-b13"
    },
    {
      "type": "concept-tip",
      "badge": "⚖️ 물리 기반 2대 공리",
      "title": "⚖️ 물리 기반 BRDF의 2대 절대 조건: 상호성과 에너지 보존",
      "summary": "자연계의 재질이 반드시 지켜야 하는 물리적 제약",
      "points": [
        {
          "title": "1. 헬름홀츠 상호성 (Helmholtz Reciprocity)",
          "content": "빛의 입사 경로와 관측 경로를 거꾸로 뒤집어도 BRDF 값은 완벽하게 동일해야 합니다:\n\n$$f_r(p, \\omega_o, \\omega_i) = f_r(p, \\omega_i, \\omega_o)$$"
        },
        {
          "title": "2. 에너지 보존 법칙 (Energy Conservation)",
          "content": "표면에서 반사되어 나가는 빛 에너지의 총합은 표면에 쏟아진 빛 에너지의 총량을 결코 초과할 수 없습니다. 즉, 임의의 출사각 $\\omega_o$에 대해 반구 전체로 반사되는 비율의 적분값은 항상 1 이하이어야 합니다:\n\n$$\\forall \\omega_o, \\quad \\int_{\\mathcal{H}^2(\\mathbf{n})} f_r(p, \\omega_o, \\omega_i) \\cos\\theta_i \\, d\\omega_i \\le 1$$\n\n*(주의: 특정한 한 쌍의 방향 $(\\omega_i, \\omega_o)$에 대한 BRDF 함수값 자체는 거울이나 날카로운 하이라이트처럼 1을 초과하여 무한대로 치솟을 수 있습니다. 적분값만이 1 이하로 제약됩니다.)*"
        }
      ],
      "tags": [
        "헬름홀츠",
        "에너지보존",
        "BRDF제약"
      ],
      "id": "ch04-03-b14"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "카메라에서 경로를 만드는 이유",
      "summary": "카메라에서 경로를 만드는 이유",
      "points": [
        {
          "title": "핵심 설명",
          "content": "최종 픽셀에 기여하는 경로에 집중하려고 카메라에서 출발하는 표본 경로를 만듭니다. 상호적인 반사는 방향을 바꿔도 같은 BRDF를 갖지만, 올바른 결과를 얻으려면 실제 샘플링 PDF와 기하 항을 포함한 추정량이 필요합니다. 굴절과 중요도 전달에는 추가적인 척도 변환도 있습니다. 광원에서 출발하는 추적이나 양방향 추적도 유효한 방법입니다."
        }
      ],
      "tags": [
        "헬름홀츠 상호성",
        "역방향 광선 추적",
        "광학 대칭성"
      ],
      "id": "ch04-03-b15"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "반사 방정식 (The Reflection / Scattering Equation)",
      "titleEn": "The Scattering Equation",
      "id": "ch04-03-b16"
    },
    {
      "type": "paragraph",
      "textKo": "BRDF의 정의를 변형하여 상반구 $\\mathcal{H}^2(\\mathbf{n})$ 상의 모든 입사 방향 $\\omega_i$에 대해 적분하면, 표면 위의 한 점 $p$에서 관찰자 방향 $\\omega_o$로 반사되어 나가는 총 출사 방사도 $L_o(p, \\omega_o)$를 구하는 컴퓨터 그래픽스 역사상 가장 위대한 방정식이 탄생합니다:",
      "textEn": "We can integrate this equation over the sphere of incident directions to compute outgoing radiance in direction $\\omega_o$ due to incident illumination from all directions:",
      "id": "ch04-03-b17"
    },
    {
      "type": "equation",
      "tex": "L_o(p, \\omega_o) = \\int_{\\mathcal{H}^2(\\mathbf{n})} f_r(p, \\omega_o, \\omega_i) L_i(p, \\omega_i) \\cos\\theta_i \\, d\\omega_i",
      "id": "ch04-03-b18"
    },
    {
      "type": "paragraph",
      "textKo": "이 방정식을 **반사 방정식(Reflection Equation)** 또는 투과(BTDF)까지 포괄하는 경우 **산란 방정식(Scattering Equation)**이라고 부릅니다. 이 책의 제13장부터 15장까지 구현할 모든 경로 추적(Path Tracing) 렌더러의 궁극적인 임무는 바로 3D 장면 속 모든 교차점에서 이 적분을 몬테카를로 기법으로 풀어내는 것입니다.",
      "textEn": "This is a fundamental equation in rendering; it describes how an incident distribution of light at a point is transformed into an outgoing distribution, based on the scattering properties of the surface.",
      "id": "ch04-03-b19"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "BSSRDF: 반투명 재질과 표면하 산란",
      "titleEn": "4.3.2 The BSSRDF",
      "id": "ch04-03-b20"
    },
    {
      "type": "paragraph",
      "textKo": "빛이 입사한 위치($p_i$)와 반사되어 나가는 위치($p_o$)가 서로 다른 반투명 재질을 다루기 위해 BRDF를 공간적으로 일반화한 모델을 **BSSRDF(양방향 표면하 산란 반사 분포 함수, Bidirectional Scattering-Surface Reflectance Distribution Function)**라고 부릅니다(그림 4.11).",
      "textEn": "The BSSRDF is the formalism that describes scattering from materials that exhibit subsurface light transport. It is a distribution function $S(p_o, \\omega_o, p_i, \\omega_i)$ that describes the ratio of exitant differential radiance at point $p_o$ in direction $\\omega_o$ to the incident differential flux at $p_i$ from direction $\\omega_i$:",
      "id": "ch04-03-b21"
    },
    {
      "type": "equation",
      "tex": "S(p_o, \\omega_o, p_i, \\omega_i) = \\frac{dL_o(p_o, \\omega_o)}{d\\Phi(p_i, \\omega_i)}",
      "id": "ch04-03-b22"
    },
    {
      "type": "figure",
      "id": "fig-4-11",
      "number": "Figure 4.11",
      "title": "Original Figure 4.11",
      "titleKo": "원문 그림 4.11",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-11.png",
      "captionKo": "그림 4.11 · BSSRDF는 들어간 점과 다른 점에서 나오는 빛까지 다룹니다. BSDF보다 평가가 복잡할 수 있지만 실제 물체의 외관에 중요한 표면 아래 산란을 표현합니다.",
      "captionEn": "Figure 4.11: The bidirectional scattering surface reflectance distribution function generalizes the BSDF to account for light that exits the surface at a point other than where it enters. It is often more difficult to evaluate than the BSDF, although subsurface light transport makes a substantial contribution to the appearance of many real-world objects.",
      "width": 998,
      "height": 356,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Surface_Reflection.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "BSSRDF를 적용한 표면하 산란 방정식은 물체 표면 전체 면적($A$)과 반구 방향($\\omega_i$) 모두에 대해 적분해야 하므로, 기존의 2차원 적분이 **4차원 적분(4D Integral)**으로 확장됩니다:",
      "textEn": "The generalization of the scattering equation for the BSSRDF requires integration over surface area and incoming direction, turning the 2D scattering equation into a 4D integral:",
      "id": "ch04-03-b24"
    },
    {
      "type": "equation",
      "tex": "L_o(p_o, \\omega_o) = \\int_A \\int_{\\mathcal{H}^2(\\mathbf{n})} S(p_o, \\omega_o, p_i, \\omega_i) L_i(p_i, \\omega_i) |\\cos\\theta_i| \\, d\\omega_i \\, dA(p_i)",
      "id": "ch04-03-b25"
    },
    {
      "type": "paragraph",
      "textKo": "많은 반투명 물질에서는 입사점 근처에서 나오는 기여가 크므로 거리 분포를 이용한 중요도 샘플링이 유용합니다. 다만 모든 BSSRDF가 하나의 지수함수로 감소하거나, 멀리 떨어진 기여를 무조건 버려도 정확한 것은 아닙니다. 샘플링은 필요한 영역을 빠뜨리지 않고 PDF로 보정해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-03-b26"
    }
  ],
  "audit": {
    "checkedSourceSha256": "bfcc6c8385f4abbb58544a38e673133b451bd69565b98ae697cd546206ea46b7",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "4.3 Surface Reflection",
      "4.3.1  The BRDF and the BTDF",
      "4.3.2  The BSSRDF"
    ],
    "sourceFigures": [
      "4.10",
      "4.11"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
