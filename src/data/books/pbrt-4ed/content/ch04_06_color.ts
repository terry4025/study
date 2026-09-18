import { SectionContent } from '../../../../types/book';

export const CH04_06_COLOR: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '4',
  chapterTitleKo: '제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)',
  sectionNumber: '4.6',
  sectionTitle: 'Color',
  sectionTitleKo: '4.6 인간의 시각과 RGB/XYZ 색 공간 (Color)',
  originalUrl: 'https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html',
  prevSection: {
    id: 'ch04-05',
    title: '4.5 파장별 스펙트럼 표현과 C++ 설계',
  },
  nextSection: {
    id: 'ch05-01',
    title: '5.1 카메라 인터페이스 설계',
  },
  summary: {
    keyTakeaways: [
      '**스펙트럼(Spectrum)**은 파장별 에너지를 나타내는 순수한 물리적 실체인 반면, **색상(Color)**은 그 빛을 받아들인 인간의 뇌와 망막이 느끼는 **생물학적 지각(Perception)**입니다.',
      '인간 망막에는 3종류의 원추세포(S, M, L)가 존재하므로, 무한 차원의 연속 스펙트럼이라 할지라도 단 3개의 가중 적분값으로 축약되는 **삼색 자극 이론(Tristimulus Theory)**이 성립합니다.',
      '서로 물리적 스펙트럼 파형이 완전히 달라도 사람 눈에는 완벽하게 똑같은 색으로 보이는 현상을 **메타메리즘(Metamerism, 조건등색)**이라고 하며, 이것이 바로 모니터가 단 3개의 RGB 서브픽셀만으로 자연의 모든 색을 흉내낼 수 있는 근거입니다.',
      '**CIE 1931 XYZ 색 공간**은 장치에 독립적인 인류 공통의 표준 색 공간이며, 3D 렌더러는 계산 편의상 sRGB/Rec.2020과 XYZ 사이를 $3 \\times 3$ 행렬 연산으로 자유롭게 상호 변환합니다.'
    ],
    prerequisites: [
      '선형대수학 기초 (3차원 벡터, 3x3 행렬 변환)',
      '미적분학 (가중 적분, 내적)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '4.6 스펙트럼과 색상의 본질적 차이 (Color)',
      titleEn: '4.6 Color'
    },
    {
      type: 'paragraph',
      textKo: '"분광 분포(Spectral Distribution)"와 "색상(Color)"은 일상생활에서 종종 같은 의미로 혼용되지만, 컴퓨터 그래픽스와 물리학에서는 엄격하게 구분되는 별개의 개념입니다. **분광 분포는 물리적 실체** 그 자체(특정 파장의 광자들이 지닌 에너지의 객관적 양)인 반면, **색상은 인간의 시각 시스템(망막과 뇌의 신경망)이 그 스펙트럼을 자극으로 받아들여 주관적으로 해석한 결과물**입니다.',
      textEn: '“Spectral distribution” and “color” might seem like two names for the same thing, but they are distinct. A spectral distribution is a purely physical concept, while color describes the human perception of a spectrum. Color is thus closely connected to the physiology of the human visual system.'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt 내부의 모든 광학 시뮬레이션은 스펙트럼 분포를 기반으로 계산되지만, 최종 렌더링된 이미지를 사람의 눈으로 보려면 컴퓨터 모니터에 맞는 RGB 색상으로 변환해야 합니다. 반대로 3D 아티스트가 그래픽 툴에서 지정한 머티리얼의 RGB 텍스처를 물리적 스펙트럼으로 역변환(RGB-to-Spectrum Lifting)하는 작업 역시 필수적입니다.',
      textEn: 'Although the majority of rendering computation in pbrt is based on spectral distributions, color still must be treated carefully. For example, the spectral distribution at each pixel in a rendered image must be converted to RGB color to be displayed on a monitor.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '인간 시각의 삼색형 색각 (Tristimulus Theory)',
      titleEn: 'Tristimulus Theory of Color Perception'
    },
    {
      type: 'paragraph',
      textKo: '인간의 안구 망막(Retina)에는 밝은 곳에서 색상을 감지하는 **세 종류의 원추세포(Cone Photoreceptor Cells)**가 있습니다. 이 세 세포는 각각 짧은 파장(Short, 약 $420\\text{ nm}$, 청색), 중간 파장(Medium, 약 $530\\text{ nm}$, 녹색), 긴 파장(Long, 약 $560\\text{ nm}$, 적색)에 최대 반응을 보입니다.',
      textEn: 'The tristimulus theory of color perception says that all visible spectral distributions can be accurately represented for human observers using three scalar values, because there are three types of photoreceptive cone cells in the eye.'
    },
    {
      type: 'paragraph',
      textKo: '이 세 가지 원추세포의 반응 특성으로 인해, 자연계에 존재하는 무한한 차원의 연속 스펙트럼 $S(\\lambda)$는 세 개의 스칼라 자극값 $v_i$로 축약되어 뇌로 전달됩니다:',
      textEn: 'Integrating the product of a spectral distribution $S(\\lambda)$ with three tristimulus matching functions $m_i(\\lambda)$ gives three tristimulus values $v_i$:'
    },
    {
      type: 'equation',
      tex: 'v_i = \\int_{\\lambda} S(\\lambda) m_i(\\lambda) \\, d\\lambda, \\quad i \\in \\{1, 2, 3\\}'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 컴공 기초 콕콕: 메타메리즘(Metamerism) - 모니터가 인간의 눈을 속이는 기적의 원리',
      summary: '왜 모니터는 단 3가지 색(Red, Green, Blue) 서브픽셀만 켤까?',
      points: [
        {
          title: '스펙트럼의 무한 차원 vs 눈의 3차원 축약',
          content: '실제 노란 개나리꽃에서 반사되는 빛은 $550\\text{ nm} \\sim 600\\text{ nm}$ 대역이 꽉 찬 복잡한 연속 스펙트럼입니다. 하지만 스마트폰이나 모니터는 노란색 단색광을 쏘는 대신 **초록색 LED와 빨간색 LED 두 개를 동시에 켭니다**.'
        },
        {
          title: '조건등색(Metamerism)의 마법',
          content: '물리적으로 두 빛의 파장 분포(스펙트럼)는 완전히 딴판입니다. 하지만 인간 망막의 세 원추세포에 떨어지는 가중 적분값 $(v_1, v_2, v_3)$이 기가 막히게 일치하기 때문에, **인간의 뇌는 두 빛을 100% 동일한 노란색으로 착각**합니다! 이 현상이 없었다면 컬러 디스플레이는 수백 개의 레이저를 달아야 했을 것입니다.'
        }
      ],
      tags: ['메타메리즘', '삼원색 디스플레이', '시각 생리학']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: 'CIE 1931 XYZ 표준 색 공간',
      titleEn: '4.6.1 The CIE XYZ Color Space'
    },
    {
      type: 'paragraph',
      textKo: '1931년 국제조명위원회(CIE)는 대규모 인체 실험을 거쳐 특정 하드웨어에 종속되지 않는 인류 보편의 기준 색 공간인 **CIE XYZ**를 정립했습니다. CIE는 세 개의 표준 등색 함수(Color Matching Functions) $\\bar{x}(\\lambda), \\bar{y}(\\lambda), \\bar{z}(\\lambda)$를 제정했습니다(그림 4.18).',
      textEn: 'The CIE XYZ color space is a device-independent color space. Given a spectral distribution $S(\\lambda)$, its coordinates are computed by integrating against the matching curves:'
    },
    {
      type: 'equation',
      tex: 'X = \\int S(\\lambda) \\bar{x}(\\lambda) \\, d\\lambda, \\quad Y = \\int S(\\lambda) \\bar{y}(\\lambda) \\, d\\lambda, \\quad Z = \\int S(\\lambda) \\bar{z}(\\lambda) \\, d\\lambda'
    },
    {
      type: 'paragraph',
      textKo: '여기서 특히 $\\bar{y}(\\lambda)$ 함수는 앞서 4.1절에서 배운 인간의 시감도 곡선 $V(\\lambda)$와 정확히 일치하도록 설계되었기 때문에, **XYZ 좌표의 $Y$ 성분은 빛의 물리적 휘도(Luminance, 밝기)를 직관적으로 나타냅니다**.',
      textEn: 'The CIE $\\bar{y}(\\lambda)$ curve was chosen to be proportional to the spectral response curve $V(\\lambda)$ used to define photometric luminance: $V(\\lambda) = 683 \\bar{y}(\\lambda)$.'
    },
    {
      type: 'figure',
      id: 'fig-4-18',
      number: 'Figure 4.18',
      captionKo: '그림 4.18: CIE 1931 XYZ 등색 함수 $\\bar{x}(\\lambda)$(적색), $\\bar{y}(\\lambda)$(녹색), $\\bar{z}(\\lambda)$(청색). 모든 가시광선 파장 전반에 걸쳐 음수 값이 나오지 않도록 수학적으로 설계되었습니다.',
      captionEn: 'Figure 4.18: The CIE 1931 XYZ color matching functions $\\bar{x}(\\lambda)$, $\\bar{y}(\\lambda)$, and $\\bar{z}(\\lambda)$.',
      title: 'CIE XYZ 등색 함수',
      titleKo: 'CIE 1931 XYZ 등색 함수',
      src: '/books/pbrt-4ed/images/pha04f18.svg',
    },
    {
      type: 'figure',
      id: 'fig-4-19',
      number: 'Figure 4.19',
      captionKo: '그림 4.19: 단색광(단일 파장)이 3차원 XYZ 색 공간에서 그리는 궤적 곡선(Spectral Locus). 자연계의 모든 물리적 가시광선 스펙트럼은 이 3차원 곡선이 만들어내는 볼록 껍질(Convex Cone) 내부의 선형 결합 점으로 존재합니다.',
      captionEn: 'Figure 4.19: 3D plot of the curve in XYZ space corresponding to single wavelengths of light over the visible range.',
      title: 'XYZ 3차원 분광 궤적',
      titleKo: 'XYZ 3D 분광 궤적',
      src: '/books/pbrt-4ed/images/pha04f19.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '색도 좌표와 CIE xy 색도도 (Chromaticity)',
      titleEn: 'xy Chromaticity Diagram'
    },
    {
      type: 'paragraph',
      textKo: '빛의 전체적인 밝기(휘도 $Y$)와 무관하게 순수한 "색조(Color Tone)와 채도"만을 2차원 평면에 시각화하기 위해 **색도 좌표(Chromaticity Coordinates, $x, y$)**를 다음과 같이 정규화합니다:',
      textEn: 'Chromaticity coordinates $x$ and $y$ factor out the overall brightness (luminance $Y$):'
    },
    {
      type: 'equation',
      tex: 'x = \\frac{X}{X + Y + Z}, \\quad y = \\frac{Y}{X + Y + Z}, \\quad z = 1 - x - y'
    },
    {
      type: 'figure',
      id: 'fig-4-20',
      number: 'Figure 4.20',
      captionKo: '그림 4.20: 유명한 말발굽 모양의 CIE 1931 $xy$ 색도도(Chromaticity Diagram). 외곽의 굽은 곡선은 순수 단색광의 파장(380nm~700nm)을 나타내며, 내부의 모든 영역이 인간의 시각이 인지할 수 있는 가시광선 영역 전체를 나타냅니다. 중앙부 $(x=0.3127, y=0.3290)$ 부근에 표준 백색광(D65)이 위치합니다.',
      captionEn: 'Figure 4.20: The CIE 1931 xy chromaticity diagram shows the horseshoe-shaped boundary of spectral colors and all perceptible colors.',
      title: 'CIE xy 색도도',
      titleKo: 'CIE 1931 xy 색도도',
      src: '/books/pbrt-4ed/images/pha04f20.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: 'RGB 색 공간과 색역 (Color Gamuts)',
      titleEn: '4.6.3 RGB Color Spaces'
    },
    {
      type: 'paragraph',
      textKo: '현대 디지털 모니터와 카메라는 세 가지 기본 원색(Red, Green, Blue)을 조합하여 색을 표현합니다. 하나의 RGB 색 공간을 수학적으로 엄밀히 정의하기 위해서는 다음 세 가지 규격이 확립되어야 합니다: (1) 빨강, 초록, 파랑의 3대 원색 색도 좌표 $(x, y)$, (2) 순수한 백색 기준점(White Point, 주로 D65), (3) 모니터의 비선형 밝기 특성을 보정하는 감마 전달 함수.',
      textEn: 'An RGB color space is defined by: (1) the chromaticities of its three primaries, (2) its white point, and (3) its transfer function.'
    },
    {
      type: 'figure',
      id: 'fig-4-21',
      number: 'Figure 4.21',
      captionKo: '그림 4.21: 대표적인 RGB 색역(Gamut) 비교. 인터넷 표준인 sRGB(가장 작은 안쪽 삼각형), 영화 산업 표준인 DCI-P3(중간 크기), 차세대 초고화질 UHD 방송 규격인 ITU-R BT.2020(가장 넓은 외곽 삼각형)이 $xy$ 색도도 상에서 차지하는 영역을 보여줍니다. 삼각형 밖의 색상은 해당 디스플레이가 물리적으로 출력할 수 없는 색상입니다.',
      captionEn: 'Figure 4.21: Comparison of color gamuts in the CIE xy diagram: sRGB, DCI-P3, and Rec. 2020.',
      title: 'RGB 색역 비교도',
      titleKo: 'RGB 색역(Gamut) 비교',
      src: '/books/pbrt-4ed/images/pha04f21.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: 'RGB $\\leftrightarrow$ XYZ 선형 변환 행렬',
      titleEn: 'Conversion Between RGB and XYZ'
    },
    {
      type: 'paragraph',
      textKo: 'RGB 색 공간과 CIE XYZ 색 공간 사이의 변환은 선형대수학의 $3 \\times 3$ 행렬 곱셈을 통해 초고속으로 이루어집니다. 예를 들어 표준 sRGB 선형 값과 XYZ 사이의 변환 공식은 다음과 같습니다:',
      textEn: 'Conversion between linear RGB and XYZ is performed using a $3 \\times 3$ matrix multiplication:'
    },
    {
      type: 'equation',
      tex: '\\begin{bmatrix} X \\\\ Y \\\\ Z \\end{bmatrix} = \\begin{bmatrix} 0.4124 & 0.3576 & 0.1805 \\\\ 0.2126 & 0.7152 & 0.0722 \\\\ 0.0193 & 0.1192 & 0.9505 \\end{bmatrix} \\begin{bmatrix} R_{\\text{linear}} \\\\ G_{\\text{linear}} \\\\ B_{\\text{linear}} \\end{bmatrix}'
    },
    {
      type: 'concept-tip',
      badge: '⚠️ 그래픽스 필독 주의',
      title: '⚠️ 렌더링 엔진 내부 연산은 반드시 선형(Linear) 색 공간에서 해야 합니다!',
      summary: '감마 보정(Gamma Correction, sRGB)이 적용된 색을 그대로 곱하거나 더하면 망하는 이유',
      points: [
        {
          title: '감마 비선형성 ($sRGB \\approx Linear^{1/2.2}$)',
          content: '과거 CRT 모니터의 물리적 특성 때문에 웹 브라우저나 이미지 파일(PNG, JPG)은 약 $2.2$의 거듭제곱으로 밝기를 왜곡(감마 인코딩)해 둡니다.'
        },
        {
          title: '선형 연산의 절대성',
          content: '빛의 물리 법칙(선형성 중첩 원리, 람베르트 법칙, BRDF 적분)은 **오직 실제 에너지 비례하는 선형(Linear) 공간에서만 성립**합니다. 감마가 씌워진 채로 렌더링하면 그림자 경계선이 부자연스럽게 시커멓게 타고 색이 탁해집니다. 따라서 렌더러는 텍스처를 읽을 때 반드시 선형화(`Linearize`)하고, 화면에 최종 출력할 때만 sRGB 감마를 다시 입힙니다.'
        }
      ],
      tags: ['선형 파이프라인', '감마 보정', 'sRGB 렌더링']
    }
  ]
};
