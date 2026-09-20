import type { SectionContent } from '../../../../types/book';

export const CH04_02_RADIOMETRIC_INTEGRALS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "4",
  "chapterTitleKo": "제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)",
  "sectionNumber": "4.2",
  "sectionTitle": "Working with Radiometric Integrals",
  "sectionTitleKo": "4.2 광학 적분 다루기 (Working with Radiometric Integrals)",
  "originalUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Working_with_Radiometric_Integrals.html",
  "prevSection": {
    "id": "ch04-01",
    "title": "4.1 방사측정학의 기초와 4대 물리량"
  },
  "nextSection": {
    "id": "ch04-03",
    "title": "4.3 표면 반사의 물리 (BRDF)"
  },
  "summary": {
    "keyTakeaways": [
      "표면에 쏟아지는 복사조도(Irradiance $E$)는 반구 상의 모든 방향에서 들어오는 입사 방사휘도(Radiance $L_i$)에 입사각 코사인($\\cos\\theta$)을 곱해 입체각($d\\omega$)에 대해 적분함으로써 계산됩니다.",
      "방향 적분을 구면좌표계로 전개하면 미소 입체각은 $d\\omega = \\sin\\theta \\, d\\theta \\, d\\phi$가 되며, 모든 방향에서 동일한 균일 방사휘도 $L$이 비출 때의 총 조도는 놀랍게도 **$E = \\pi L$**로 매우 깔끔하게 정리됩니다.",
      "투영 입체각(Projected Solid Angle, $d\\omega^\\perp = \\cos\\theta \\, d\\omega$)을 도입하면 적분식 내부의 번거로운 $\\cos\\theta$ 항을 측도 자체에 흡수시켜 수식을 직관적으로 단순화할 수 있습니다.",
      "발광체의 면적 적분 변환식 $d\\omega = \\frac{\\cos\\theta_o}{r^2} dA$는 몬테카를로 렌더러가 방향을 무작위로 추측하는 대신 **광원 표면에서 직접 샘플 포인트를 뽑을 수 있게 해주는 핵심 다리** 역할을 합니다."
    ],
    "prerequisites": [
      "다변수 미적분학 (구면좌표계 이중적분, 치환적분)",
      "3차원 기하학 (구면상의 미소 면적, 입체각, 역제곱 법칙)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "4.2 방사측정학 적분 다루기 (Working with Radiometric Integrals)",
      "titleEn": "4.2 Working with Radiometric Integrals",
      "id": "ch04-02-b1"
    },
    {
      "type": "paragraph",
      "textKo": "3D 렌더링 시스템을 구현할 때 가장 빈번하게 마주치는 핵심 작업은 방사측정학 물리량들의 적분을 실제로 계산하는 것입니다. 이 절에서는 이러한 광학 적분을 직관적이고 효율적으로 다루기 위한 몇 가지 수학적 기법과 변환 트릭을 다룹니다. 이해를 돕기 위해 표면 위의 한 점에 쏟아지는 복사조도(Irradiance)를 계산하는 고전적인 문제를 대표 예제로 살펴보겠습니다.",
      "textEn": "A frequent task in rendering is the evaluation of integrals of radiometric quantities. In this section, we will present some tricks that can make it easier to do this. To illustrate the use of these techniques, we will take the computation of irradiance at a point as an example.",
      "id": "ch04-02-b2"
    },
    {
      "type": "paragraph",
      "textKo": "표면 법선 벡터가 $\\mathbf{n}$인 점 $p$에 방향들의 집합 $\\Omega$로부터 입사 방사도 $L_i(p, \\omega)$가 들어올 때, 점 $p$가 받는 총 복사조도(Irradiance, $E$)는 다음과 같은 반구 적분으로 표현됩니다:",
      "textEn": "Irradiance at a point $p$ with surface normal $\\mathbf{n}$ due to radiance over a set of directions $\\Omega$ is:",
      "id": "ch04-02-b3"
    },
    {
      "type": "equation",
      "tex": "E(p, \\mathbf{n}) = \\int_\\Omega L_i(p, \\omega) \\cos\\theta \\, d\\omega",
      "id": "ch04-02-b4"
    },
    {
      "type": "paragraph",
      "textKo": "피적분 함수에 포함된 $\\cos\\theta$ 항은 방사도 정의에 포함되어 있던 투영 면적 인자 $dA^\\perp = dA \\cos\\theta$에서 비롯된 것입니다. 여기서 $\\theta$는 빛의 입사 방향 $\\omega$와 표면 법선 벡터 $\\mathbf{n}$ 사이의 사잇각입니다. 컴퓨터 그래픽스에서 조도는 일반적으로 표면 법선 $\\mathbf{n}$을 중심으로 하는 **상반구(Unit Hemisphere, $\\mathcal{H}^2(\\mathbf{n})$)** 전체 방향에 대해 적분됩니다.",
      "textEn": "where $L_i(p, \\omega)$ is the incident radiance function (Figure 4.5) and the $\\cos\\theta$ factor in the integrand is due to the $dA^\\perp$ factor in the definition of radiance. $\\theta$ is measured as the angle between $\\omega$ and surface normal $\\mathbf{n}$. Irradiance is usually computed over the hemisphere $\\mathcal{H}^2(\\mathbf{n})$ of directions.",
      "id": "ch04-02-b5"
    },
    {
      "type": "figure",
      "id": "fig-4-5",
      "number": "Figure 4.5",
      "title": "Original Figure 4.5",
      "titleKo": "원문 그림 4.5",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-5.png",
      "captionKo": "그림 4.5 · 한 점의 복사조도는 위쪽 반구 전체에서 입사 방사휘도에 입사각 코사인을 곱한 값을 적분하여 얻습니다.",
      "captionEn": "Figure 4.5: Irradiance at a point normal p Subscript is given by the integral of radiance times the cosine of the incident direction over the entire upper hemisphere above the point.",
      "width": 998,
      "height": 216,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Working_with_Radiometric_Integrals.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "4.2.1 투영 입체각(Projected Solid Angle)을 이용한 적분",
      "titleEn": "4.2.1 Integrals over Projected Solid Angle",
      "id": "ch04-02-b7"
    },
    {
      "type": "paragraph",
      "textKo": "방사측정학 적분식 곳곳에 나타나는 다양한 코사인($\\cos\\theta$) 계수들은 때때로 적분식이 표현하고자 하는 본질적인 물리적 의미를 가리고 수식을 복잡하게 만듭니다. 이러한 번거로움은 일반 입체각($d\\omega$) 대신 **투영 입체각(Projected Solid Angle, $d\\omega^\\perp$)**을 측도로 사용함으로써 깔끔하게 해결할 수 있습니다.",
      "textEn": "The various cosine factors in the integrals for radiometric quantities can often distract from what is being expressed in the integral. This problem can be avoided using projected solid angle rather than solid angle to measure areas subtended by objects being integrated over.",
      "id": "ch04-02-b8"
    },
    {
      "type": "paragraph",
      "textKo": "물체가 점 $p$에 대해 이루는 투영 입체각은 물체를 먼저 단위 구면 위에 투영한 뒤(일반 입체각), 그 투영된 영역을 표면 법선 벡터 $\\mathbf{n}$에 수직인 **단위 밑면 원판(Unit Disk)** 위로 수직 정사영하여 얻어집니다(그림 4.6).",
      "textEn": "The projected solid angle subtended by an object is determined by projecting the object onto the unit sphere, and then projecting the resulting shape down onto the unit disk that is perpendicular to the surface normal (Figure 4.6).",
      "id": "ch04-02-b9"
    },
    {
      "type": "equation",
      "tex": "d\\omega^\\perp = \\cos\\theta \\, d\\omega",
      "id": "ch04-02-b10"
    },
    {
      "type": "paragraph",
      "textKo": "이 투영 입체각 측도를 사용하면, 상반구 전체에 대한 조도 적분식을 성가신 $\\cos\\theta$ 항 없이 극도로 간결하게 다시 쓸 수 있습니다:",
      "textEn": "so the irradiance-from-radiance integral over the hemisphere can be written more simply as:",
      "id": "ch04-02-b11"
    },
    {
      "type": "equation",
      "tex": "E(p, \\mathbf{n}) = \\int_{\\mathcal{H}^2(\\mathbf{n})} L_i(p, \\omega) \\, d\\omega^\\perp",
      "id": "ch04-02-b12"
    },
    {
      "type": "figure",
      "id": "fig-4-6",
      "number": "Figure 4.6",
      "title": "Original Figure 4.6",
      "titleKo": "원문 그림 4.6",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-6.png",
      "captionKo": "그림 4.6 · 투영 입체각은 물체가 차지하는 구면 영역을 표면 법선에 수직인 평면으로 투영한 면적입니다. 코사인 가중치를 포함하므로 관찰점의 법선 방향에 따라 달라집니다.",
      "captionEn": "Figure 4.6: The projected solid angle subtended by an object is the cosine-weighted solid angle that it subtends. It can be computed by finding the object’s solid angle, projecting it down to the plane perpendicular to the surface normal, and measuring its area there. Thus, the projected solid angle depends on the surface normal where it is being measured, since the normal orients the plane of projection.",
      "width": 998,
      "height": 279,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Working_with_Radiometric_Integrals.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "4.2.2 구면좌표계(Spherical Coordinates)로의 적분 변환",
      "titleEn": "4.2.2 Integrals over Spherical Coordinates",
      "id": "ch04-02-b14"
    },
    {
      "type": "paragraph",
      "textKo": "실제 컴퓨터로 수치 적분을 수행하거나 해석적으로 공식을 유도할 때는 입체각 $\\omega$ 적분을 친숙한 구면좌표계 각도 $(\\theta, \\phi)$ 적분으로 변환하는 것이 매우 편리합니다. 구면 위의 미소 입체각 면적소 $d\\omega$는 위도 방향 호의 길이($d\\theta$)와 경도 방향 호의 길이($\\sin\\theta \\, d\\phi$)의 곱으로 표현됩니다(그림 4.7):",
      "textEn": "It is often convenient to transform integrals over solid angle into integrals over spherical coordinates $(\\theta, \\phi)$. The differential area on the unit sphere $d\\omega$ is the product of the differential lengths of its sides, $\\sin\\theta \\, d\\phi$ and $d\\theta$. Therefore:",
      "id": "ch04-02-b15"
    },
    {
      "type": "equation",
      "tex": "d\\omega = \\sin\\theta \\, d\\theta \\, d\\phi",
      "id": "ch04-02-b16"
    },
    {
      "type": "figure",
      "id": "fig-4-7",
      "number": "Figure 4.7",
      "title": "Original Figure 4.7",
      "titleKo": "원문 그림 4.7",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-7.png",
      "captionKo": "그림 4.7 · 구면에서 작은 각도 조각의 두 변 길이는 sinθ·dφ와 dθ입니다. 따라서 입체각 요소는 dω=sinθ·dθ·dφ입니다.",
      "captionEn": "Figure 4.7: The differential area normal d omega Subscript subtended by a differential solid angle is the product of the differential lengths of the two edges sine theta normal d phi Subscript and normal d theta Subscript . The resulting relationship, normal d omega Subscript Baseline equals sine theta normal d theta Subscript Baseline normal d phi Subscript , is the key to converting between integrals over solid angles and integrals over spherical angles.",
      "width": 998,
      "height": 252,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Working_with_Radiometric_Integrals.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "이제 상반구 $\\mathcal{H}^2(\\mathbf{n})$에 대한 조도 적분식을 구면좌표계의 이중적분으로 완전히 전개해 봅시다 ($\\theta$는 0부터 $\\pi/2$까지, $\\phi$는 0부터 $2\\pi$까지):",
      "textEn": "We can thus see that the irradiance integral over the hemisphere can equivalently be written as:",
      "id": "ch04-02-b18"
    },
    {
      "type": "equation",
      "tex": "E(p, \\mathbf{n}) = \\int_0^{2\\pi} \\int_0^{\\pi/2} L_i(p, \\theta, \\phi) \\cos\\theta \\sin\\theta \\, d\\theta \\, d\\phi",
      "id": "ch04-02-b19"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "💡 수학 미스터리: 왜 균일한 하늘빛 $L$ 아래에서 조도는 $2\\pi L$이 아니라 $\\pi L$일까?",
      "summary": "반구의 총 면적은 $2\\pi$인데 왜 빛의 밝기는 $\\pi$배만 받을까?",
      "points": [
        {
          "title": "수식으로 직접 계산하기",
          "content": "모든 방향에서 동일한 균일 방사도 $L_i = L$이 들어온다고 가정해 봅시다. 상수 $L$을 적분 기호 밖으로 빼내면:\n\n$$E = L \\int_0^{2\\pi} d\\phi \\int_0^{\\pi/2} \\cos\\theta \\sin\\theta \\, d\\theta$$\n\n1. 방위각 적분: $\\int_0^{2\\pi} d\\phi = 2\\pi$\n2. 극각 적분: 치환적분($u = \\sin\\theta, du = \\cos\\theta d\\theta$)을 적용하면 $\\int_0^1 u du = \\left[ \\frac{u^2}{2} \\right]_0^1 = \\frac{1}{2}$\n3. 두 결과를 곱하면: $E = L \\cdot 2\\pi \\cdot \\frac{1}{2} = \\mathbf{\\pi L}$ !"
        },
        {
          "title": "물리적·직관적 의미",
          "content": "반구의 총 입체각 면적은 $2\\pi$ 스테라디안이지만, 지평선 부근($\\theta \\to \\pi/2$)에서 들어오는 빛은 표면에 비스듬하게 비추기 때문에 $\\cos\\theta \\to 0$이 되어 표면에 거의 에너지를 주지 못합니다. 이 코사인 감쇠 효과를 평균내면 정확히 절반($1/2$)이 깎여나가므로, 최종적으로 표면이 받는 총 에너지는 $2\\pi \\times 1/2 = \\pi L$이 되는 것입니다!"
        }
      ],
      "tags": [
        "반구 조도 적분",
        "파이 팩터",
        "수학적 직관"
      ],
      "id": "ch04-02-b20"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "방향 적분($d\\omega$)을 면적 적분($dA$)으로 변환하기",
      "titleEn": "Transforming Integrals over Directions to Integrals over Area",
      "id": "ch04-02-b21"
    },
    {
      "type": "paragraph",
      "textKo": "마지막으로 렌더러 구현에서 가장 중요한 변환 중 하나는 방향에 대한 적분을 **광원 물체의 표면적(Area, $dA$)에 대한 적분**으로 전환하는 것입니다. 예를 들어 천장에 매달린 사각형 형광등(면광원)이 바닥의 한 점 $p$에 미치는 조도를 계산한다고 상상해 봅시다. 방향 $\\omega$ 공간에서 사각형 광원이 정확히 어디에 걸려 있는지 찾아 적분하는 것은 매우 어렵지만, **사각형 광원의 2차원 표면 $A$ 위에서 직접 적분하는 것**은 기하학적으로 훨씬 명쾌합니다.",
      "textEn": "One last useful transformation is to turn integrals over directions into integrals over area. It is much easier to compute the irradiance as an integral over the area of a light source rather than over directions.",
      "id": "ch04-02-b22"
    },
    {
      "type": "paragraph",
      "textKo": "광원 표면 위의 미소 면적 $dA$와 점 $p$에서 바라본 미소 입체각 $d\\omega$ 사이의 수학적 관계식은 다음과 같습니다(그림 4.8):",
      "textEn": "Differential area $dA$ on a surface is related to differential solid angle as viewed from a point $p$ by:",
      "id": "ch04-02-b23"
    },
    {
      "type": "equation",
      "tex": "d\\omega = \\frac{|\\cos\\theta_o|}{r^2}\\,dA",
      "id": "ch04-02-b24"
    },
    {
      "type": "paragraph",
      "textKo": "여기서 $r$은 점 $p$와 광원 표면 점 $p'$ 사이의 거리이며, $\\theta_o$는 광원 표면의 법선 벡터와 $p$를 향하는 광선 벡터 사이의 각도입니다. 광원 면적이 수직에서 기울어질수록($\\cos\\theta_o$), 거리가 멀어질수록($r^2$) 점 $p$에서 바라본 시각적 입체각 $d\\omega$는 줄어듭니다.",
      "textEn": "where $\\theta_o$ is the angle between the surface normal of $dA$ and the vector to $p$, and $r$ is the distance from $p$ to $dA$ (Figure 4.8).",
      "id": "ch04-02-b25"
    },
    {
      "type": "figure",
      "id": "fig-4-8",
      "number": "Figure 4.8",
      "title": "Original Figure 4.8",
      "titleKo": "원문 그림 4.8",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-8.png",
      "captionKo": "그림 4.8 · 미소 면적 dA가 거리 r의 점에서 차지하는 입체각은 dA·|cosθ|/r²입니다. θ는 그 면적의 법선과 관찰점 방향의 사이각이며, 앞면만 다루는 원문 그림에서는 코사인이 양수입니다.",
      "captionEn": "Figure 4.8: The differential solid angle normal d omega Subscript subtended by a differential area normal d upper A Subscript is equal to normal d upper A Subscript Baseline cosine theta slash r squared , where theta is the angle between normal d upper A Subscript ’s surface normal and the vector to the point normal p Subscript and r is the distance from normal p Subscript to normal d upper A Subscript .",
      "width": 998,
      "height": 328,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Working_with_Radiometric_Integrals.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "면적 적분으로 바꾸면 광원의 각 미소 면적 기여를 더할 수 있습니다. 아래 식에서는 광원과 수신점이 서로 보이는 영역만 적분하거나, 별도의 가시성 V를 곱합니다. 받는 쪽 반구 제한과 보내는 쪽 방출 방향도 포함해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-02-b27"
    },
    {
      "type": "equation",
      "tex": "E(p) = \\int_A V(p,p\\prime)L_e(p\\prime\\!\\to p)\\,\\frac{\\max(0,\\cos\\theta_i)|\\cos\\theta_o|}{r^2}\\,dA",
      "id": "ch04-02-b28"
    },
    {
      "type": "figure",
      "id": "fig-4-9",
      "number": "Figure 4.9",
      "title": "Original Figure 4.9",
      "titleKo": "원문 그림 4.9",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-9.png",
      "captionKo": "그림 4.9 · 사각형 광원은 복잡한 방향 영역보다 광원 면적에서 적분하기 편할 수 있습니다. 면적과 입체각 사이의 변환으로 두 표현을 연결합니다.",
      "captionEn": "Figure 4.9: To compute irradiance at a point normal p Subscript from a quadrilateral source, it is easier to integrate over the surface area of the source than to integrate over the irregular set of directions that it subtends. The relationship between solid angles and areas given by Equation ( 4.9 ) lets us go back and forth between the two approaches.",
      "width": 998,
      "height": 336,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Working_with_Radiometric_Integrals.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "🎮 실전 그래픽스 연결",
      "title": "광원 샘플링도 확률과 가시성을 계산합니다",
      "summary": "광원 샘플링도 확률과 가시성을 계산합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "작은 광원을 향할 가능성이 적으면 무작위 방향 샘플링의 분산이 커집니다. 광원 위의 점을 직접 뽑으면 그 영역에 집중할 수 있습니다. 그러나 기여에는 BRDF·거리·각도·가시성이 필요하며, 광원 선택 확률과 면적 또는 입체각 PDF로 나누어야 합니다. 한 샘플이 조명 전체를 정확히 계산해 주는 것은 아닙니다."
        }
      ],
      "tags": [
        "직접 조명 샘플링",
        "NEE",
        "몬테카를로 최적화"
      ],
      "id": "ch04-02-b30"
    }
  ],
  "audit": {
    "checkedSourceSha256": "cc2a9ea9c2d1a70c380448675dd816675ea5ba13534efa0dbefac522628096f0",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "4.2 Working with Radiometric Integrals",
      "4.2.1  Integrals over Projected Solid Angle",
      "4.2.2  Integrals over Spherical Coordinates",
      "4.2.3  Integrals over Area"
    ],
    "sourceFigures": [
      "4.5",
      "4.6",
      "4.7",
      "4.8",
      "4.9"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
