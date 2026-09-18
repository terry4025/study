import { SectionContent } from '../../../../types/book';

export const CH08_08_IMAGE_RECONSTRUCTION: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '8',
  chapterTitleKo: '제8장 샘플링과 이미지 복원 (Sampling & Reconstruction)',
  sectionNumber: '8.8',
  sectionTitle: 'Image Reconstruction',
  sectionTitleKo: '8.8 픽셀 재구성 필터링 (Image Reconstruction)',
  originalUrl: 'https://pbr-book.org/4ed/Sampling_and_Reconstruction/Image_Reconstruction.html',
  prevSection: {
    id: 'ch08-07',
    title: '8.7 Sobol 저불일치 샘플러',
  },
  nextSection: {
    id: 'ch09-01',
    title: '9.1 BSDF 표면 반사 인터페이스 (BSDF Representation)',
  },
  summary: {
    keyTakeaways: [
      '이미지 재구성(Image Reconstruction)은 픽셀 주변에 확률적으로 떨어진 수많은 샘플들의 휘도(Radiance)를 2차원 필터 함수 $w(x, y)$로 가중합산하여 최종 픽셀 색상을 완성하는 단계입니다.',
      '상자 필터(Box Filter)는 픽셀 영역 내부의 모든 샘플을 균일하게 대충 평균 내므로 극심한 앨리어싱(모아레 무늬와 지글거림)을 유발합니다.',
      '필터 설계의 3대 딜레마: 블러링(Blurring, 세부 디테일 소실), 링잉(Ringing, 날카로운 경계선 주변에 후광이 생기는 오버슈트 현상), 앨리어싱(Aliasing).',
      '미첼-네트라발리(Mitchell-Netravali) 필터는 3차 스플라인 이론을 바탕으로 $B + 2C = 1$ 조건(기본값 $B=C=1/3$)을 만족하도록 설계되어, 블러링과 링잉 사이의 완벽한 시각적 균형을 이뤄낸 그래픽스 산업 표준 필터입니다.',
      '란초스(Lanczos / Windowed Sinc) 필터는 이론상 이상적인 신호 복원기인 싱크(Sinc) 함수에 윈도우를 씌워 유한한 반경 안에서 극도로 날카롭고 선명한 이미지를 재구성합니다.'
    ],
    prerequisites: [
      '8장 8.1 푸리에 변환과 이상적인 싱크 복원 필터',
      '8장 8.2 픽셀 가중 적분 공식',
      '수학: 3차 스플라인(Cubic Splines)과 연속성($C^0, C^1$)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.8.1 이미지 재구성 필터링의 수학적 원리',
      titleEn: '8.8.1 Mathematical Principles of Image Reconstruction'
    },
    {
      type: 'paragraph',
      textKo: '카메라 렌즈와 센서를 통과한 수많은 광선 샘플들이 필름 평면에 제각기 다른 위치와 색상으로 기록되었습니다. 이제 마지막 단계는 이 샘플 점들을 모아 각 픽셀 $(x_p, y_p)$의 최종 RGB 색상 $I(x_p, y_p)$를 결정하는 것입니다. 연속 신호 이론에 따라 픽셀 색상은 필터 함수 $w(x, y)$를 이용한 이산 정규화 가중합으로 계산됩니다:',
      textEn: 'After sample contributions are evaluated across the film plane, an image reconstruction filter computes the final pixel values as a weighted average over nearby samples.'
    },
    {
      type: 'equation',
      tex: 'I(x_p, y_p) = \\frac{\\sum_{i} w(x_i - x_p, \\; y_i - y_p) \\cdot L(x_i, y_i)}{\\sum_{i} w(x_i - x_p, \\; y_i - y_p)}',
      explanationKo: '픽셀 필터 가중 평균 공식: 픽셀 중심 $(x_p, y_p)$으로부터의 거리에 따른 필터 가중치 $w$를 샘플 휘도 $L$에 곱해 누적한 뒤, 전체 가중치의 총합으로 나누어 정규화합니다.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.8.2 필터 설계의 3대 딜레마 (블러링, 링잉, 앨리어싱)',
      titleEn: '8.8.2 The Filter Dilemma: Blurring, Ringing, and Aliasing'
    },
    {
      type: 'paragraph',
      textKo: '이상적인 필터란 존재할 수 없으며, 모든 필터는 세 가지 상반된 시각적 결함 사이에서 타협을 해야 합니다:',
      textEn: 'Filter design involves balancing three competing artifacts: blurring (loss of sharp detail), ringing (halos around edges caused by negative lobes), and aliasing.'
    },
    {
      type: 'figure',
      id: 'fig-08-49',
      number: 'Figure 8.49',
      title: 'Box filter profile and its poor frequency sinc response',
      titleKo: '상자 필터(Box Filter)의 공간 프로파일과 극심한 주파수 앨리어싱',
      src: '/books/pbrt-4ed/images/pha08f49.svg',
      captionKo: '그림 8.49: 상자 필터(Box filter, $w(x) = 1$)는 구현이 제일 쉽지만, 주파수 영역에서 싱크 함수의 거대한 꼬리(Side Lobes)가 무한히 이어져 고주파 앨리어싱(모아레 무늬)이 그대로 통과해 버립니다.',
      captionEn: 'Figure 8.49: The box filter has high side lobes in the frequency domain, passing substantial high-frequency energy and producing severe aliasing.'
    },
    {
      type: 'figure',
      id: 'fig-08-50',
      number: 'Figure 8.50',
      title: 'Triangle filter profile and frequency response',
      titleKo: '삼각 필터(Triangle Filter / Tent Filter)의 공간 및 주파수 특성',
      src: '/books/pbrt-4ed/images/pha08f50.svg',
      captionKo: '그림 8.50: 중심에서 선형으로 감소하는 삼각 필터. 상자 필터보다 앨리어싱 억제력이 월등히 높지만, 고주파를 과도하게 깎아 먹어 이미지가 다소 뿌옇게 흐려지는(Blurring) 경향이 있습니다.',
      captionEn: 'Figure 8.50: The triangle filter offers better stop-band attenuation than the box filter but introduces moderate blurring.'
    },
    {
      type: 'figure',
      id: 'fig-08-51',
      number: 'Figure 8.51',
      title: 'Gaussian filter profile and its frequency decay',
      titleKo: '가우시안 필터(Gaussian Filter)의 부드러운 감쇠 곡선',
      src: '/books/pbrt-4ed/images/pha08f51.svg',
      captionKo: '그림 8.51: 가우시안 필터는 링잉(Ringing) 현상이 전혀 발생하지 않는 가장 부드러운 필터입니다. 다만 파라미터가 조금만 커져도 이미지가 과도하게 뭉개질 수 있습니다.',
      captionEn: 'Figure 8.51: Gaussian filters produce completely positive weights, eliminating ringing, but can overly soften crisp edges.'
    },
    {
      type: 'figure',
      id: 'fig-08-52',
      number: 'Figure 8.52',
      title: 'Visual comparison of Box, Triangle, and Gaussian filters on zone plate',
      titleKo: '존 플레이트 씬에서의 상자, 삼각, 가우시안 필터 렌더링 결과 비교',
      src: '/books/pbrt-4ed/images/pha08f52.svg',
      captionKo: '그림 8.52: 상자 필터는 외곽에 지독한 모아레 간섭 무늬가 생기지만, 삼각 및 가우시안 필터는 고주파를 자연스럽게 완화하여 부드러운 그라데이션으로 수렴시킵니다.',
      captionEn: 'Figure 8.52: Zone plate rendered with box, triangle, and Gaussian filters, showing dramatic reduction in moiré rings.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.8.3 미첼-네트라발리(Mitchell-Netravali) 필터: 그래픽스의 황금률',
      titleEn: '8.8.3 The Mitchell-Netravali Filter: The Golden Standard'
    },
    {
      type: 'paragraph',
      textKo: '1988년 돈 미첼(Don Mitchell)과 아룬 네트라발리(Arun Netravali)는 컴퓨터 그래픽스 역사상 가장 위대한 필터 논문을 발표했습니다. 그들은 3차 조각별 다항식(Cubic Splines) 중 $C^1$ 연속성을 만족하는 모든 필터를 분석하여, 두 개의 파라미터 $B$와 $C$로 표현되는 미첼 필터 족(Family)을 유도했습니다:',
      textEn: 'In 1988, Mitchell and Netravali investigated piecewise cubic filters and proposed a two-parameter family that optimally balances blurring and ringing artifacts.'
    },
    {
      type: 'equation',
      tex: 'w(x) = \\frac{1}{6} \\begin{cases} (12 - 9B - 6C)|x|^3 + (-18 + 12B + 6C)|x|^2 + (6 - 2B), & |x| < 1 \\\\ (-B - 6C)|x|^3 + (6B + 30C)|x|^2 + (-12B - 48C)|x| + (8B + 24C), & 1 \\le |x| < 2 \\\\ 0, & |x| \\ge 2 \\end{cases}',
      explanationKo: '미첼-네트라발리 3차 스플라인 수식: $|x| < 1$ 구간에서는 양수 가중치를 가지며, $1 \\le |x| < 2$ 구간에서는 약간의 음수 가중치(Negative Lobe)를 가져 경계선의 선명도(Sharpening)를 극대화합니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-53',
      number: 'Figure 8.53',
      title: 'Mitchell filter parameter space (B, C plane)',
      titleKo: '미첼 필터 파라미터 공간 ($B, C$ 평면)과 최적 선 $B + 2C = 1$',
      src: '/books/pbrt-4ed/images/pha08f53.svg',
      captionKo: '그림 8.53: 미첼과 네트라발리는 수많은 시각인지 블라인드 테스트를 거쳐, 테일러 급수 2차 수렴을 보장하는 직선 $B + 2C = 1$ 상에 가장 이상적인 필터들이 모여 있음을 밝혔습니다. 그중에서도 $B = 1/3, C = 1/3$ 지점이 블러링과 링잉을 동시에 최소화하는 전설의 황금 지점입니다.',
      captionEn: 'Figure 8.53: The (B, C) parameter space. The line B + 2C = 1 gives second-order accuracy; the point B = C = 1/3 provides the ideal visual compromise.'
    },
    {
      type: 'figure',
      id: 'fig-08-54',
      number: 'Figure 8.54',
      title: 'Mitchell filter profile showing the negative lobe enhancing edge sharpness',
      titleKo: '미첼 필터 프로파일: 선명한 윤곽선을 살려주는 음수 로브(Negative Lobe)',
      src: '/books/pbrt-4ed/images/pha08f54.svg',
      captionKo: '그림 8.54: $x=1$과 $x=2$ 사이에서 필터 값이 0 아래로 살짝 내려가는 음수 로브(Negative lobe)가 존재합니다. 이 음수 가중치가 경계선 바로 바깥쪽의 밝기를 미세하게 깎아내어, 사람 눈에는 모서리가 칼처럼 선명하게 보이도록 만듭니다(샤프닝 효과).',
      captionEn: 'Figure 8.54: The Mitchell-Netravali curve dips below zero between 1 and 2, which slightly sharpens edges and combats blurring.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '8.8.4 윈도우드 싱크 (Windowed Sinc / Lanczos) 필터',
      titleEn: '8.8.4 Windowed Sinc and the Lanczos Filter'
    },
    {
      type: 'paragraph',
      textKo: '이론상 가장 완벽한 대역 제한 필터는 무한한 지지대를 갖는 싱크 필터($\\text{sinc}(x) = \\frac{\\sin \\pi x}{\\pi x}$)입니다. 하지만 싱크 필터는 무한대까지 감쇠되지 않아 컴퓨터에서 그대로 쓸 수 없습니다. 이를 반경 $\\tau$ 안에서 부드럽게 잘라내기 위해 란초스 윈도우(Lanczos Window)를 곱한 것이 바로 **란초스 필터(Lanczos Filter)**입니다:',
      textEn: 'While the sinc filter is the mathematically ideal low-pass filter, its infinite extent requires truncation. Windowing sinc by another stretched sinc produces the Lanczos filter.'
    },
    {
      type: 'equation',
      tex: 'w_{\\text{Lanczos}}(x) = \\text{sinc}(x) \\cdot \\text{sinc}\\left(\\frac{x}{\\tau}\\right) = \\frac{\\sin(\\pi x)}{\\pi x} \\cdot \\frac{\\sin(\\pi x / \\tau)}{\\pi x / \\tau} \\quad (|x| < \\tau)',
      explanationKo: '란초스(Lanczos) 필터 공식: 싱크 함수에 축소된 싱크 윈도우를 곱하여 반경 $\\tau$(보통 $\\tau=3$) 바깥을 0으로 깔끔하게 소거합니다.'
    },
    {
      type: 'figure',
      id: 'fig-08-55',
      number: 'Figure 8.55',
      title: 'Windowed sinc filter spatial profile with radius 3',
      titleKo: '반경 $\\tau=3$을 갖는 란초스 윈도우드 싱크 필터 곡선',
      src: '/books/pbrt-4ed/images/pha08f55.svg',
      captionKo: '그림 8.55: 란초스 필터는 나이퀴스트 컷오프 주파수까지의 신호를 100% 온전히 보존하면서 그 이상의 고주파만 칼같이 잘라내는 탁월한 주파수 분리 특성을 보여줍니다.',
      captionEn: 'Figure 8.55: Spatial profile of the Lanczos windowed sinc filter with tau = 3.'
    },
    {
      type: 'figure',
      id: 'fig-08-56',
      number: 'Figure 8.56',
      title: 'Rendering comparison between Mitchell and Windowed Sinc on zone plate',
      titleKo: '미첼 필터와 윈도우드 싱크 필터의 존 플레이트 최종 렌더링 화질 비교',
      src: '/books/pbrt-4ed/images/pha08f56.svg',
      captionKo: '그림 8.56: 미첼 필터(왼쪽)와 란초스 싱크 필터(오른쪽)의 최종 결과. 란초스 필터는 기하학적 세부선이 가장 칼처럼 날카롭고 선명하지만 연산 비용이 약간 더 들며, 미첼 필터는 속도와 품질의 균형이 가장 뛰어나 pbrt의 기본 필터로 사용됩니다.',
      captionEn: 'Figure 8.56: Final zone plate rendering comparing Mitchell vs Lanczos filters. Both achieve clean high-frequency roll-off without noticeable moiré.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '필터 선택 가이드: 무엇을 기본값으로 써야 할까?',
      summary: '렌더링 프로젝트의 목적에 따라 최적의 픽셀 필터를 선택하세요!',
      points: [
        {
          title: '기본 추천: Mitchell-Netravali (B=1/3, C=1/3)',
          content: 'pbrt와 픽사 렌더맨(RenderMan)의 기본값입니다. 적당한 샤프닝과 부드러움이 완벽하게 조화되어 대부분의 실사 씬에서 가장 눈이 편안한 결과물을 냅니다.'
        },
        {
          title: '극강의 선명도: Windowed Sinc (Lanczos radius=3)',
          content: '건축 CG나 CAD 렌더링처럼 미세한 선과 텍스처를 뭉개짐 없이 칼같이 선명하게 살려야 할 때 최고의 선택입니다.'
        },
        {
          title: '피해야 할 것: Box Filter',
          content: '박스 필터는 프리뷰 속도 테스트 외에는 절대 최종 렌더링에 쓰지 마세요! 지옥 같은 모아레 패턴과 계단 현상이 화면을 뒤덮습니다.'
        }
      ],
      tags: ['미첼필터', '란초스필터', '이미지재구성', '안티앨리어싱', '픽셀필터']
    }
  ]
};
