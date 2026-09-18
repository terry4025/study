import { SectionContent } from '../../../../types/book';

export const CH06_04_DISKS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '6',
  chapterTitleKo: '제6장 3차원 형상과 교차 검사 (Shapes)',
  sectionNumber: '6.4',
  sectionTitle: 'Disks',
  sectionTitleKo: '6.4 원판(Disk) 모델과 교차 검사 (Disks)',
  originalUrl: 'https://pbr-book.org/4ed/Shapes/Disks.html',
  prevSection: {
    id: 'ch06-03',
    title: '6.3 원기둥(Cylinder)',
  },
  nextSection: {
    id: 'ch06-05',
    title: '6.5 삼각 메시(Triangle Meshes)',
  },
  summary: {
    keyTakeaways: [
      '원판(Disk)은 z = height 평면에 위치한 2차원 원형 평면으로, 2차 방정식 근의 공식 대신 단 한 번의 나눗셈으로 평면 교차 거리 t를 즉시 계산합니다.',
      '평면과의 교차 거리 t = (height - o_z) / d_z를 구한 뒤, 교차점의 중심 거리 제곱 x² + y²이 내경 제곱(rMin²)과 외경 제곱(radius²) 사이에 존재하는지 검사합니다.',
      '내경 rMin을 0보다 크게 설정하면 중앙에 구멍이 뚫린 도넛/와셔(Washer) 형태의 원판이 되며, phiMax로 부채꼴 원판을 지원합니다.',
      '원판의 표면 법선은 모든 점에서 항상 z축과 평행한 (0, 0, 1) 상수 벡터입니다.'
    ],
    prerequisites: [
      '3차원 평면 방정식과 광선 교차 (Ray–Plane Intersection)',
      '극좌표계 (Polar Coordinates: r, phi)',
      '기초 삼각함수와 역탄젠트 함수 (atan2)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.4.1 원판의 수학적 정의와 1차 평면 교차 검사',
      titleEn: '6.4.1 Ray–Disk Intersection'
    },
    {
      type: 'paragraph',
      textKo: '원판(Disk)은 $z = \\text{height}$ 평면에 놓여 있으며, 중심이 원점 $(0, 0, \\text{height})$인 평평한 원형 표면입니다. 구나 원기둥처럼 2차 곡면이 아니라 순수한 평면이므로, 2차 방정식 판별식을 풀 필요 없이 단 한 줄의 수식으로 교차 거리 $t$가 결정됩니다:',
      textEn: 'A disk is a circular planar shape located in the plane z = height, centered at (0, 0, height). Ray–disk intersection reduces to a 1D ray–plane intersection followed by in-bounds checks.'
    },
    {
      type: 'equation',
      tex: 'o_z + t d_z = \\text{height} \\implies t = \\frac{\\text{height} - o_z}{d_z}',
      explanationKo: '광선-원판 평면 교차 매개변수 거리 t 유도 공식'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: 'dz = 0 (광선이 평면과 평행)일 때의 예외 처리',
      summary: 'dz = 0 (광선이 평면과 평행)일 때의 예외 처리',
      points: [
        {
          title: '핵심 원리와 메커니즘',
          content: '광선이 원판과 완벽히 평행하게 날아가면 $d_z = 0$이 되어 분모가 0이 됩니다. 이 경우 광선은 평면과 절대 만나지 않으므로 나눗셈을 실행하기 전에 즉시 실패(`return false`)를 반환합니다.'
        }
      ]
    },
    {
      type: 'figure',
      id: 'fig-6-17',
      number: 'Figure 6.17',
      title: 'Geometry of a disk with an inner hole and partial sweep angle phiMax',
      titleKo: '원판(Disk)의 기하 구조',
      src: '/books/pbrt-4ed/images/pha06f17.svg',
      captionKo: 'Figure 6.17: 원판(Disk)의 기하 구조. 중심 높이(height), 내경(innerRadius), 외경(radius), 방위각(phiMax)으로 정의됩니다.',
      captionEn: 'Figure 6.17: Geometry of a disk with an inner hole and partial sweep angle phiMax.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.4.2 반지름과 각도 판정 (도넛/와셔 형상 지원)',
      titleEn: '6.4.2 Radius and Sweep Checks'
    },
    {
      type: 'paragraph',
      textKo: '평면과 만난 교차점 $p = (x, y, \\text{height})$의 중심 거리 제곱 $distSq = x^2 + y^2$을 계산합니다. 이 거리가 내경 제곱보다 작거나 외경 제곱보다 크면 탈락입니다:',
      textEn: 'The squared distance distSq = x^2 + y^2 is computed. If distSq < innerRadius^2 or distSq > radius^2, the ray misses the disk.'
    },
    {
      type: 'equation',
      tex: 'r_{\\min}^2 \\le x^2 + y^2 \\le r_{\\max}^2',
      explanationKo: '원판 내경 및 외경 유효 구간 판정식'
    },
    {
      type: 'figure',
      id: 'fig-6-18',
      number: 'Figure 6.18',
      title: 'Disk parametrization mapping normalized radius to u and sweep angle phi to v',
      titleKo: '원판 표면의 극좌표 매개변수화 (u, v)',
      src: '/books/pbrt-4ed/images/pha06f18.svg',
      captionKo: 'Figure 6.18: 원판 표면의 극좌표 매개변수화 (u, v). u는 반지름 비율, v는 방위각 비율을 나타냅니다.',
      captionEn: 'Figure 6.18: Disk parametrization mapping normalized radius to u and sweep angle phi to v.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.4.3 표면적(Area)과 수직 상수 법선',
      titleEn: '6.4.3 Surface Area and Constant Normal'
    },
    {
      type: 'paragraph',
      textKo: '원판의 표면적 $A$는 중심각 $\\phi_{\\max}$에 비례하는 부채꼴 와셔의 면적으로 명쾌하게 유도됩니다:',
      textEn: 'The surface area of a disk with sweep angle phiMax is:'
    },
    {
      type: 'equation',
      tex: 'A = \\frac{\\phi_{\\max}}{2} \\left(r_{\\max}^2 - r_{\\min}^2\\right)',
      explanationKo: '원판의 표면적 계산 공식 (phiMax = 2pi, rMin = 0일 때 파이 r^2)'
    },
    {
      type: 'paragraph',
      textKo: '원판은 완벽한 평면이므로, 표면의 모든 위치에서 표면 법선은 언제나 $z$축 양의 방향 $(0, 0, 1)$로 고정되어 있습니다.',
      textEn: 'Because the disk is planar, the surface normal is constant across its entire surface: (0, 0, 1).'
    },
    {
      type: 'figure',
      id: 'fig-disks-render',
      number: 'Rendering disks',
      title: 'Rendered collection of planar disks, washers, and partial sectors in pbrt-v4',
      titleKo: 'pbrt-v4로 렌더링한 완전 원판, 와셔형 링, 부채꼴 원판(Disks) 씬',
      src: '/books/pbrt-4ed/images/disks.png',
      captionKo: 'pbrt-v4로 렌더링한 완전 원판, 와셔형 링, 부채꼴 원판(Disks) 씬.',
      captionEn: 'Rendered collection of planar disks, washers, and partial sectors in pbrt-v4.'
    }
  ]
};
