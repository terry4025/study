import { SectionContent } from '../../../../types/book';

export const CH04_02_RADIOMETRIC_INTEGRALS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '4',
  chapterTitleKo: '제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)',
  sectionNumber: '4.2',
  sectionTitle: 'Working with Radiometric Integrals',
  sectionTitleKo: '4.2 광학 적분 다루기 (Working with Radiometric Integrals)',
  originalUrl: 'https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Working_with_Radiometric_Integrals.html',
  prevSection: {
    id: 'ch04-01',
    title: '4.1 방사측정학의 기초와 4대 물리량',
  },
  nextSection: {
    id: 'ch04-03',
    title: '4.3 표면 반사의 물리 (BRDF)',
  },
  summary: {
    keyTakeaways: [
      '표면에 쏟아지는 조도(Irradiance $E$)는 반구 상의 모든 방향에서 들어오는 입사 방사도(Radiance $L_i$)에 입사각 코사인($\\cos\\theta$)을 곱해 입체각($d\\omega$)에 대해 적분함으로써 계산됩니다.',
      '방향 적분을 구면좌표계로 전개하면 미소 입체각은 $d\\omega = \\sin\\theta \\, d\\theta \\, d\\phi$가 되며, 모든 방향에서 동일한 균일 휘도 $L$이 비출 때의 총 조도는 놀랍게도 **$E = \\pi L$**로 매우 깔끔하게 정리됩니다.',
      '투영 입체각(Projected Solid Angle, $d\\omega^\\perp = \\cos\\theta \\, d\\omega$)을 도입하면 적분식 내부의 번거로운 $\\cos\\theta$ 항을 측도 자체에 흡수시켜 수식을 직관적으로 단순화할 수 있습니다.',
      '발광체의 면적 적분 변환식 $d\\omega = \\frac{\\cos\\theta_o}{r^2} dA$는 몬테카를로 렌더러가 방향을 무작위로 추측하는 대신 **광원 표면에서 직접 샘플 포인트를 뽑을 수 있게 해주는 핵심 다리** 역할을 합니다.'
    ],
    prerequisites: [
      '다변수 미적분학 (구면좌표계 이중적분, 치환적분)',
      '3차원 기하학 (구면상의 미소 면적, 입체각, 역제곱 법칙)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '4.2 방사측정학 적분 다루기 (Working with Radiometric Integrals)',
      titleEn: '4.2 Working with Radiometric Integrals'
    },
    {
      type: 'paragraph',
      textKo: '3D 렌더링 시스템을 구현할 때 가장 빈번하게 마주치는 핵심 작업은 방사측정학 물리량들의 적분을 실제로 계산하는 것입니다. 이 절에서는 이러한 광학 적분을 직관적이고 효율적으로 다루기 위한 몇 가지 수학적 기법과 변환 트릭을 다룹니다. 이해를 돕기 위해 표면 위의 한 점에 쏟아지는 조도(Irradiance)를 계산하는 고전적인 문제를 대표 예제로 살펴보겠습니다.',
      textEn: 'A frequent task in rendering is the evaluation of integrals of radiometric quantities. In this section, we will present some tricks that can make it easier to do this. To illustrate the use of these techniques, we will take the computation of irradiance at a point as an example.'
    },
    {
      type: 'paragraph',
      textKo: '표면 법선 벡터가 $\\mathbf{n}$인 점 $p$에 방향들의 집합 $\\Omega$로부터 입사 방사도 $L_i(p, \\omega)$가 들어올 때, 점 $p$가 받는 총 조도(Irradiance, $E$)는 다음과 같은 반구 적분으로 표현됩니다:',
      textEn: 'Irradiance at a point $p$ with surface normal $\\mathbf{n}$ due to radiance over a set of directions $\\Omega$ is:'
    },
    {
      type: 'equation',
      tex: 'E(p, \\mathbf{n}) = \\int_\\Omega L_i(p, \\omega) \\cos\\theta \\, d\\omega'
    },
    {
      type: 'paragraph',
      textKo: '피적분 함수에 포함된 $\\cos\\theta$ 항은 방사도 정의에 포함되어 있던 투영 면적 인자 $dA^\\perp = dA \\cos\\theta$에서 비롯된 것입니다. 여기서 $\\theta$는 빛의 입사 방향 $\\omega$와 표면 법선 벡터 $\\mathbf{n}$ 사이의 사잇각입니다. 컴퓨터 그래픽스에서 조도는 일반적으로 표면 법선 $\\mathbf{n}$을 중심으로 하는 **상반구(Unit Hemisphere, $\\mathcal{H}^2(\\mathbf{n})$)** 전체 방향에 대해 적분됩니다.',
      textEn: 'where $L_i(p, \\omega)$ is the incident radiance function (Figure 4.5) and the $\\cos\\theta$ factor in the integrand is due to the $dA^\\perp$ factor in the definition of radiance. $\\theta$ is measured as the angle between $\\omega$ and surface normal $\\mathbf{n}$. Irradiance is usually computed over the hemisphere $\\mathcal{H}^2(\\mathbf{n})$ of directions.'
    },
    {
      type: 'figure',
      id: 'fig-4-5',
      number: 'Figure 4.5',
      captionKo: '그림 4.5: 표면 위의 한 점 $p$에서 상반구 $\\mathcal{H}^2(\\mathbf{n})$로부터 들어오는 입사 방사도 $L_i(p, \\omega)$를 적분하여 조도를 계산하는 기하학적 구조. 각 방향 $\\omega$마다 표면 법선 $\\mathbf{n}$과의 사잇각 $\\cos\\theta$만큼 가중치가 적용됩니다.',
      captionEn: 'Figure 4.5: Incident radiance $L_i(p, \\omega)$ over a hemisphere of directions about normal $\\mathbf{n}$ at point $p$.',
      title: '반구 조도 적분 기하 구조',
      titleKo: '반구 조도 적분',
      src: '/books/pbrt-4ed/images/pha04f05.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '4.2.1 투영 입체각(Projected Solid Angle)을 이용한 적분',
      titleEn: '4.2.1 Integrals over Projected Solid Angle'
    },
    {
      type: 'paragraph',
      textKo: '방사측정학 적분식 곳곳에 나타나는 다양한 코사인($\\cos\\theta$) 계수들은 때때로 적분식이 표현하고자 하는 본질적인 물리적 의미를 가리고 수식을 복잡하게 만듭니다. 이러한 번거로움은 일반 입체각($d\\omega$) 대신 **투영 입체각(Projected Solid Angle, $d\\omega^\\perp$)**을 측도로 사용함으로써 깔끔하게 해결할 수 있습니다.',
      textEn: 'The various cosine factors in the integrals for radiometric quantities can often distract from what is being expressed in the integral. This problem can be avoided using projected solid angle rather than solid angle to measure areas subtended by objects being integrated over.'
    },
    {
      type: 'paragraph',
      textKo: '물체가 점 $p$에 대해 이루는 투영 입체각은 물체를 먼저 단위 구면 위에 투영한 뒤(일반 입체각), 그 투영된 영역을 표면 법선 벡터 $\\mathbf{n}$에 수직인 **단위 밑면 원판(Unit Disk)** 위로 수직 정사영하여 얻어집니다(그림 4.6).',
      textEn: 'The projected solid angle subtended by an object is determined by projecting the object onto the unit sphere, and then projecting the resulting shape down onto the unit disk that is perpendicular to the surface normal (Figure 4.6).'
    },
    {
      type: 'equation',
      tex: 'd\\omega^\\perp = \\cos\\theta \\, d\\omega'
    },
    {
      type: 'paragraph',
      textKo: '이 투영 입체각 측도를 사용하면, 상반구 전체에 대한 조도 적분식을 성가신 $\\cos\\theta$ 항 없이 극도로 간결하게 다시 쓸 수 있습니다:',
      textEn: 'so the irradiance-from-radiance integral over the hemisphere can be written more simply as:'
    },
    {
      type: 'equation',
      tex: 'E(p, \\mathbf{n}) = \\int_{\\mathcal{H}^2(\\mathbf{n})} L_i(p, \\omega) \\, d\\omega^\\perp'
    },
    {
      type: 'figure',
      id: 'fig-4-6',
      number: 'Figure 4.6',
      captionKo: '그림 4.6: 투영 입체각(Projected Solid Angle)의 원리. 단위 구면 상의 미소 입체각 $d\\omega$를 지표면 원판(Unit Disk) 위로 수직 정사영하면 면적이 $\\cos\\theta$만큼 축소된 $d\\omega^\\perp$가 됩니다. 이를 통해 복잡한 코사인 가중 적분을 면적 적분으로 단순화할 수 있습니다.',
      captionEn: 'Figure 4.6: Projected solid angle is found by projecting the solid angle onto the unit disk perpendicular to the surface normal. The area of the projection is $d\\omega^\\perp = \\cos\\theta d\\omega$.',
      title: '투영 입체각 다이어그램',
      titleKo: '투영 입체각(Projected Solid Angle)',
      src: '/books/pbrt-4ed/images/pha04f06.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '4.2.2 구면좌표계(Spherical Coordinates)로의 적분 변환',
      titleEn: '4.2.2 Integrals over Spherical Coordinates'
    },
    {
      type: 'paragraph',
      textKo: '실제 컴퓨터로 수치 적분을 수행하거나 해석적으로 공식을 유도할 때는 입체각 $\\omega$ 적분을 친숙한 구면좌표계 각도 $(\\theta, \\phi)$ 적분으로 변환하는 것이 매우 편리합니다. 구면 위의 미소 입체각 면적소 $d\\omega$는 위도 방향 호의 길이($d\\theta$)와 경도 방향 호의 길이($\\sin\\theta \\, d\\phi$)의 곱으로 표현됩니다(그림 4.7):',
      textEn: 'It is often convenient to transform integrals over solid angle into integrals over spherical coordinates $(\\theta, \\phi)$. The differential area on the unit sphere $d\\omega$ is the product of the differential lengths of its sides, $\\sin\\theta \\, d\\phi$ and $d\\theta$. Therefore:'
    },
    {
      type: 'equation',
      tex: 'd\\omega = \\sin\\theta \\, d\\theta \\, d\\phi'
    },
    {
      type: 'figure',
      id: 'fig-4-7',
      number: 'Figure 4.7',
      captionKo: '그림 4.7: 단위 구면에서의 미소 입체각 $d\\omega$와 구면좌표계 $(d\\theta, d\\phi)$의 관계. 극각 $\\theta$가 커질수록(적도에 가까워질수록) 경도선의 반지름이 $\\sin\\theta$로 커지므로, 가로 변의 길이는 $\\sin\\theta d\\phi$가 되고 세로 변의 길이는 $d\\theta$가 되어 $d\\omega = \\sin\\theta d\\theta d\\phi$가 됩니다.',
      captionEn: 'Figure 4.7: Differential area on the unit sphere $d\\omega$ in terms of spherical coordinates $(\\theta, \\phi)$ has side lengths $d\\theta$ and $\\sin\\theta d\\phi$.',
      title: '구면좌표계 미소 면적 유도',
      titleKo: '구면좌표계 미소 면적소',
      src: '/books/pbrt-4ed/images/pha04f07.svg',
    },
    {
      type: 'paragraph',
      textKo: '이제 상반구 $\\mathcal{H}^2(\\mathbf{n})$에 대한 조도 적분식을 구면좌표계의 이중적분으로 완전히 전개해 봅시다 ($\\theta$는 0부터 $\\pi/2$까지, $\\phi$는 0부터 $2\\pi$까지):',
      textEn: 'We can thus see that the irradiance integral over the hemisphere can equivalently be written as:'
    },
    {
      type: 'equation',
      tex: 'E(p, \\mathbf{n}) = \\int_0^{2\\pi} \\int_0^{\\pi/2} L_i(p, \\theta, \\phi) \\cos\\theta \\sin\\theta \\, d\\theta \\, d\\phi'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 수학 미스터리: 왜 균일한 하늘빛 $L$ 아래에서 조도는 $2\\pi L$이 아니라 $\\pi L$일까?',
      summary: '반구의 총 면적은 $2\\pi$인데 왜 빛의 밝기는 $\\pi$배만 받을까?',
      points: [
        {
          title: '수식으로 직접 계산하기',
          content: '모든 방향에서 동일한 균일 방사도 $L_i = L$이 들어온다고 가정해 봅시다. 상수 $L$을 적분 기호 밖으로 빼내면:\n\n$$E = L \\int_0^{2\\pi} d\\phi \\int_0^{\\pi/2} \\cos\\theta \\sin\\theta \\, d\\theta$$\n\n1. 방위각 적분: $\\int_0^{2\\pi} d\\phi = 2\\pi$\n2. 극각 적분: 치환적분($u = \\sin\\theta, du = \\cos\\theta d\\theta$)을 적용하면 $\\int_0^1 u du = \\left[ \\frac{u^2}{2} \\right]_0^1 = \\frac{1}{2}$\n3. 두 결과를 곱하면: $E = L \\cdot 2\\pi \\cdot \\frac{1}{2} = \\mathbf{\\pi L}$ !'
        },
        {
          title: '물리적·직관적 의미',
          content: '반구의 총 입체각 면적은 $2\\pi$ 스테라디안이지만, 지평선 부근($\\theta \\to \\pi/2$)에서 들어오는 빛은 표면에 비스듬하게 비추기 때문에 $\\cos\\theta \\to 0$이 되어 표면에 거의 에너지를 주지 못합니다. 이 코사인 감쇠 효과를 평균내면 정확히 절반($1/2$)이 깎여나가므로, 최종적으로 표면이 받는 총 에너지는 $2\\pi \\times 1/2 = \\pi L$이 되는 것입니다!'
        }
      ],
      tags: ['반구 조도 적분', '파이 팩터', '수학적 직관']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '방향 적분($d\\omega$)을 면적 적분($dA$)으로 변환하기',
      titleEn: 'Transforming Integrals over Directions to Integrals over Area'
    },
    {
      type: 'paragraph',
      textKo: '마지막으로 렌더러 구현에서 가장 중요한 변환 중 하나는 방향에 대한 적분을 **광원 물체의 표면적(Area, $dA$)에 대한 적분**으로 전환하는 것입니다. 예를 들어 천장에 매달린 사각형 형광등(면광원)이 바닥의 한 점 $p$에 미치는 조도를 계산한다고 상상해 봅시다. 방향 $\\omega$ 공간에서 사각형 광원이 정확히 어디에 걸려 있는지 찾아 적분하는 것은 매우 어렵지만, **사각형 광원의 2차원 표면 $A$ 위에서 직접 적분하는 것**은 기하학적으로 훨씬 명쾌합니다.',
      textEn: 'One last useful transformation is to turn integrals over directions into integrals over area. It is much easier to compute the irradiance as an integral over the area of a light source rather than over directions.'
    },
    {
      type: 'paragraph',
      textKo: '광원 표면 위의 미소 면적 $dA$와 점 $p$에서 바라본 미소 입체각 $d\\omega$ 사이의 수학적 관계식은 다음과 같습니다(그림 4.8):',
      textEn: 'Differential area $dA$ on a surface is related to differential solid angle as viewed from a point $p$ by:'
    },
    {
      type: 'equation',
      tex: 'd\\omega = \\frac{dA \\cos\\theta_o}{r^2}'
    },
    {
      type: 'paragraph',
      textKo: '여기서 $r$은 점 $p$와 광원 표면 점 $p\'$ 사이의 거리이며, $\\theta_o$는 광원 표면의 법선 벡터와 $p$를 향하는 광선 벡터 사이의 각도입니다. 광원 면적이 수직에서 기울어질수록($\\cos\\theta_o$), 거리가 멀어질수록($r^2$) 점 $p$에서 바라본 시각적 입체각 $d\\omega$는 줄어듭니다.',
      textEn: 'where $\\theta_o$ is the angle between the surface normal of $dA$ and the vector to $p$, and $r$ is the distance from $p$ to $dA$ (Figure 4.8).'
    },
    {
      type: 'figure',
      id: 'fig-4-8',
      number: 'Figure 4.8',
      captionKo: '그림 4.8: 미소 면적 $dA$와 미소 입체각 $d\\omega$의 기하학적 관계. 점 $p$로부터 거리 $r$만큼 떨어진 표면의 미소 면적 $dA$는 법선 벡터 사잇각 $\\theta$에 의해 투영되고 거리의 제곱에 반비례하여 점 $p$의 구면상에 입체각 $d\\omega = \\frac{dA \\cos\\theta}{r^2}$를 형성합니다.',
      captionEn: 'Figure 4.8: Differential area $dA$ subtends differential solid angle $d\\omega = \\frac{dA \\cos\\theta}{r^2}$ at distance $r$.',
      title: '미소 면적과 입체각 관계',
      titleKo: '면적-입체각 변환',
      src: '/books/pbrt-4ed/images/pha04f08.svg',
    },
    {
      type: 'paragraph',
      textKo: '이 변환 관계를 적용하면, 임의의 사각형 면광원 $A$로부터 점 $p$가 받는 조도 적분식은 완벽한 면적 적분 형태로 다시 작성됩니다(그림 4.9):',
      textEn: 'Therefore, we can write the irradiance integral for a quadrilateral source as an integral over its area:'
    },
    {
      type: 'equation',
      tex: 'E(p) = \\int_A L(p\' \\to p) \\frac{\\cos\\theta_i \\cos\\theta_o}{r^2} \\, dA'
    },
    {
      type: 'figure',
      id: 'fig-4-9',
      number: 'Figure 4.9',
      captionKo: '그림 4.9: 사각형 면광원이 점 $p$에 미치는 조도 적분의 기하 구성. 점 $p$에서의 수신 입사각 $\\theta_i$, 광원 표면 점 $p\'$에서의 발신 출사각 $\\theta_o$, 그리고 두 점 사이의 거리 $r$이 조합되어 광선 전달 지오메트리 항 $G(p \\leftrightarrow p\') = \\frac{\\cos\\theta_i \\cos\\theta_o}{r^2}$를 구성합니다.',
      captionEn: 'Figure 4.9: Geometry for computing irradiance at point $p$ from a quadrilateral area light source.',
      title: '면광원 조도 기하 구성',
      titleKo: '면광원 조도 적분',
      src: '/books/pbrt-4ed/images/pha04f09.svg',
    },
    {
      type: 'concept-tip',
      badge: '🎮 실전 그래픽스 연결',
      title: '🎮 몬테카를로 광선 추적기에서 면적 적분이 필수인 이유 (Next Event Estimation)',
      summary: '왜 하늘을 무작위로 쏘는 대신 광원 표면을 직접 조준할까?',
      points: [
        {
          title: '작은 전구 맞추기의 비극',
          content: '어두운 방 천장에 작은 꼬마전구 하나가 켜져 있다고 가정해 봅시다. 방향 기준 적분($d\\omega$)을 쓰면 광선 추적기는 반구 상의 무수한 방향 중 무작위로 광선을 쏩니다. 하지만 전구가 차지하는 입체각은 너무나 작아서 1,000개의 광선을 쏴도 전구에 맞는 것은 1~2개뿐이며, 화면은 심각한 노이즈(소금-후추 노이즈)로 뒤덮입니다.'
        },
        {
          title: '광원 표면 직접 샘플링 (Direct Light Sampling)',
          content: '하지만 면적 적분($dA$) 공식을 사용하면, 렌더러는 **"광원 표면의 2차원 사각형 안에서 균일하게 난수 두 개 $(u_1, u_2)$를 뽑아 점 $p\'$을 바로 지정"**할 수 있습니다! 그런 다음 위 수식의 $\\frac{\\cos\\theta_i \\cos\\theta_o}{r^2}$ 가중치를 곱해주기만 하면 단 1개의 샘플만으로도 100% 전구 빛을 정확하게 수집할 수 있습니다. 이것이 현대 패스 트레이서의 핵심 최적화인 **직접 조명 샘플링(NEE, Next Event Estimation)**의 핵심 원리입니다.'
        }
      ],
      tags: ['직접 조명 샘플링', 'NEE', '몬테카를로 최적화']
    }
  ]
};
