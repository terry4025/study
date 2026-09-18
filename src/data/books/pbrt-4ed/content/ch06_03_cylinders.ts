import { SectionContent } from '../../../../types/book';

export const CH06_03_CYLINDERS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '6',
  chapterTitleKo: '제6장 3차원 형상과 교차 검사 (Shapes)',
  sectionNumber: '6.3',
  sectionTitle: 'Cylinders',
  sectionTitleKo: '6.3 원기둥(Cylinder) 모델과 교차 검사 (Cylinders)',
  originalUrl: 'https://pbr-book.org/4ed/Shapes/Cylinders.html',
  prevSection: {
    id: 'ch06-02',
    title: '6.2 구(Sphere)의 해석적 교차 검사',
  },
  nextSection: {
    id: 'ch06-04',
    title: '6.4 원판(Disk)',
  },
  summary: {
    keyTakeaways: [
      '원기둥(Cylinder)은 z축을 중심축으로 하는 2차 곡면으로, 음함수 방정식 x² + y² - r² = 0을 만족합니다.',
      '광선과의 교차 검사는 x와 y 성분만을 고려한 2D 2차 방정식으로 환원되므로 구보다 계산량이 더 적습니다.',
      '해석적으로 구한 두 교점 t0, t1 중 z축 유효 높이 구간 [zMin, zMax] 및 방위각 [0, phiMax] 내에 들어오는 가장 가까운 점을 최종 교차점으로 선택합니다.',
      '원기둥의 표면 법선은 z 성분이 항상 0이며, 중심축에서 바깥쪽을 향해 수평으로 방사하는 (x, y, 0) 방향을 가집니다.'
    ],
    prerequisites: [
      '6.2절 2차 방정식 근의 공식과 판별식',
      '원통 좌표계 (Cylindrical Coordinates: r, phi, z)',
      '3차원 선분 클리핑 기법'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.3.1 원기둥의 수학적 방정식과 2D 2차 방정식 유도',
      titleEn: '6.3.1 Ray–Cylinder Intersection'
    },
    {
      type: 'paragraph',
      textKo: '$z$축을 중심축으로 두고 반지름이 $r$인 무한 원기둥의 음함수 방정식은 매우 단순합니다. $z$ 좌표와 무관하게 $xy$ 평면상의 거리가 항상 $r$이어야 하므로 다음과 같습니다:',
      textEn: 'An infinite cylinder centered on the z axis with radius r has the simple implicit equation:'
    },
    {
      type: 'equation',
      tex: 'x^2 + y^2 - r^2 = 0',
      explanationKo: 'z축 중심 무한 원기둥의 음함수 표기법'
    },
    {
      type: 'paragraph',
      textKo: '광선 방정식 $x(t) = o_x + t d_x$, $y(t) = o_y + t d_y$를 대입하면, $z$ 성분이 빠진 2차 방정식 $a t^2 + b t + c = 0$이 도출됩니다:',
      textEn: 'Substituting the ray equations for x and y gives a quadratic equation where the z components do not appear:'
    },
    {
      type: 'equation',
      tex: 'a = d_x^2 + d_y^2, \\quad b = 2(d_x o_x + d_y o_y), \\quad c = o_x^2 + o_y^2 - r^2',
      explanationKo: '원기둥 교차 방정식 계수 a, b, c'
    },
    {
      type: 'figure',
      id: 'fig-6-13',
      number: 'Figure 6.13',
      title: 'A cylinder centered on the z axis bounded by zMin and zMax',
      titleKo: 'z축 중심 원기둥의 기하 구조와 zMin, zMax 높이 클리핑',
      src: '/books/pbrt-4ed/images/pha06f13.svg',
      captionKo: 'Figure 6.13: z축 중심 원기둥의 기하 구조와 zMin, zMax 높이 클리핑.',
      captionEn: 'Figure 6.13: A cylinder centered on the z axis bounded by zMin and zMax.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.3.2 높이 제한(zMin, zMax)과 방위각(phiMax) 판정',
      titleEn: '6.3.2 Height Clipping and Azimuthal Bounds'
    },
    {
      type: 'paragraph',
      textKo: '2차 방정식의 근의 공식으로 구한 교차 거리 $t$에 대해, 해당 위치의 $z$ 좌표 $z_{\\text{hit}} = o_z + t d_z$를 계산합니다. 만약 $z_{\\text{hit}} < z_{\\min}$ 이거나 $z_{\\text{hit}} > z_{\\max}$라면, 무한 원기둥 표면에는 닿았으나 우리가 원하는 유한 원기둥 몸통 바깥을 지나간 것이므로 해당 근을 기각합니다.',
      textEn: 'For an intersection distance t, the z coordinate zHit = oz + t dz is computed. If zHit falls outside [zMin, zMax], the intersection is rejected.'
    },
    {
      type: 'figure',
      id: 'fig-6-14',
      number: 'Figure 6.14',
      title: 'Various ray intersection cases against a finite cylinder, illustrating valid and invalid height intersections',
      titleKo: '광선이 유한한 원기둥의 옆면을 관통하거나 윗면/아랫면 바깥으로 빗나가는 다양한 기하학적 경우의 수',
      src: '/books/pbrt-4ed/images/pha06f14.svg',
      captionKo: 'Figure 6.14: 광선이 유한한 원기둥의 옆면을 관통하거나 윗면/아랫면 바깥으로 빗나가는 다양한 기하학적 경우의 수.',
      captionEn: 'Figure 6.14: Various ray intersection cases against a finite cylinder, illustrating valid and invalid height intersections.'
    },
    {
      type: 'paragraph',
      textKo: '첫 번째 근 $t_0$가 높이 제한에 걸려 탈락하더라도, 뒤쪽 표면인 두 번째 근 $t_1$이 유효 높이 구간에 들어온다면 $t_1$이 유효한 교차점으로 승격됩니다.',
      textEn: 'If the first intersection t0 is outside the height bounds, t1 may still lie within the valid interval.'
    },
    {
      type: 'figure',
      id: 'fig-6-15',
      number: 'Figure 6.15',
      title: 'Cylinder parametrization mapping azimuthal angle to u and height to v',
      titleKo: '원기둥 표면의 매개변수화',
      src: '/books/pbrt-4ed/images/pha06f15.svg',
      captionKo: 'Figure 6.15: 원기둥 표면의 매개변수화. u는 회전각(phi/phiMax), v는 높이 비율((z - zMin)/(zMax - zMin))을 나타냅니다.',
      captionEn: 'Figure 6.15: Cylinder parametrization mapping azimuthal angle to u and height to v.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.3.3 편미분과 수평 방사 법선 벡터',
      titleEn: '6.3.3 Differential Geometry'
    },
    {
      type: 'paragraph',
      textKo: '원기둥의 표면 법선은 $z$축 방향의 기울기가 전혀 없으므로, $z$ 성분이 항상 $0$입니다. 교차점 $(x, y, z)$에서의 정규화된 외향 법선은 다음과 같습니다:',
      textEn: 'Because the surface does not change radius along z, the surface normal has a zero z component:'
    },
    {
      type: 'equation',
      tex: '\\mathbf{n} = \\left(\\frac{x}{r}, \\; \\frac{y}{r}, \\; 0\\right)^T',
      explanationKo: '원기둥 표면 법선 벡터'
    },
    {
      type: 'figure',
      id: 'fig-cylinders-render',
      number: 'Rendering cylinders',
      title: 'Rendered cylinders with varying height limits and materials in pbrt-v4',
      titleKo: 'pbrt-v4로 렌더링한 다양한 원기둥(Cylinders) 집합 씬',
      src: '/books/pbrt-4ed/images/cylinders.png',
      captionKo: 'pbrt-v4로 렌더링한 다양한 원기둥(Cylinders) 집합 씬.',
      captionEn: 'Rendered cylinders with varying height limits and materials in pbrt-v4.'
    }
  ]
};
