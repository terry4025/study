import type { SectionContent } from '../../../../types/book';

export const CH04_06_COLOR: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "4",
  "chapterTitleKo": "제4장 방사측정학, 스펙트럼, 색상 (Radiometry, Spectra, and Color)",
  "sectionNumber": "4.6",
  "sectionTitle": "Color",
  "sectionTitleKo": "4.6 인간의 시각과 RGB/XYZ 색 공간 (Color)",
  "originalUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
  "prevSection": {
    "id": "ch04-05",
    "title": "4.5 파장별 스펙트럼 표현과 C++ 설계"
  },
  "nextSection": {
    "id": "ch05-01",
    "title": "5.1 카메라 인터페이스 설계"
  },
  "summary": {
    "keyTakeaways": [
      "**스펙트럼(Spectrum)**은 파장별 에너지를 나타내는 순수한 물리적 실체인 반면, **색상(Color)**은 그 빛을 받아들인 인간의 뇌와 망막이 느끼는 **생물학적 지각(Perception)**입니다.",
      "인간 망막에는 3종류의 원추세포(S, M, L)가 존재하므로, 무한 차원의 연속 스펙트럼이라 할지라도 단 3개의 가중 적분값으로 축약되는 **삼색 자극 이론(Tristimulus Theory)**이 성립합니다.",
      "서로 다른 스펙트럼이 주어진 관찰 조건에서 같은 삼색 자극을 만드는 현상을 조건등색이라고 합니다. 실제 디스플레이의 재현 가능한 색은 원색과 밝기 범위에 의해 제한됩니다.",
      "**CIE 1931 XYZ 색 공간**은 장치에 독립적인 인류 공통의 표준 색 공간이며, 3D 렌더러는 계산 편의상 sRGB/Rec.2020과 XYZ 사이를 $3 \\times 3$ 행렬 연산으로 자유롭게 상호 변환합니다."
    ],
    "prerequisites": [
      "선형대수학 기초 (3차원 벡터, 3x3 행렬 변환)",
      "미적분학 (가중 적분, 내적)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "4.6 스펙트럼과 색상의 본질적 차이 (Color)",
      "titleEn": "4.6 Color",
      "id": "ch04-06-b1"
    },
    {
      "type": "paragraph",
      "textKo": "\"분광 분포(Spectral Distribution)\"와 \"색상(Color)\"은 일상생활에서 종종 같은 의미로 혼용되지만, 컴퓨터 그래픽스와 물리학에서는 엄격하게 구분되는 별개의 개념입니다. **분광 분포는 물리적 실체** 그 자체(특정 파장의 광자들이 지닌 에너지의 객관적 양)인 반면, **색상은 인간의 시각 시스템(망막과 뇌의 신경망)이 그 스펙트럼을 자극으로 받아들여 주관적으로 해석한 결과물**입니다.",
      "textEn": "“Spectral distribution” and “color” might seem like two names for the same thing, but they are distinct. A spectral distribution is a purely physical concept, while color describes the human perception of a spectrum. Color is thus closely connected to the physiology of the human visual system.",
      "id": "ch04-06-b2"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt 내부의 모든 광학 시뮬레이션은 스펙트럼 분포를 기반으로 계산되지만, 최종 렌더링된 이미지를 사람의 눈으로 보려면 컴퓨터 모니터에 맞는 RGB 색상으로 변환해야 합니다. 반대로 3D 아티스트가 그래픽 툴에서 지정한 머티리얼의 RGB 텍스처를 물리적 스펙트럼으로 역변환(RGB-to-Spectrum Lifting)하는 작업 역시 필수적입니다.",
      "textEn": "Although the majority of rendering computation in pbrt is based on spectral distributions, color still must be treated carefully. For example, the spectral distribution at each pixel in a rendered image must be converted to RGB color to be displayed on a monitor.",
      "id": "ch04-06-b3"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "인간 시각의 삼색형 색각 (Tristimulus Theory)",
      "titleEn": "Tristimulus Theory of Color Perception",
      "id": "ch04-06-b4"
    },
    {
      "type": "paragraph",
      "textKo": "인간의 안구 망막(Retina)에는 밝은 곳에서 색상을 감지하는 **세 종류의 원추세포(Cone Photoreceptor Cells)**가 있습니다. 이 세 세포는 각각 짧은 파장(Short, 약 $420\\text{ nm}$, 청색), 중간 파장(Medium, 약 $530\\text{ nm}$, 녹색), 긴 파장(Long, 약 $560\\text{ nm}$, 적색)에 최대 반응을 보입니다.",
      "textEn": "The tristimulus theory of color perception says that all visible spectral distributions can be accurately represented for human observers using three scalar values, because there are three types of photoreceptive cone cells in the eye.",
      "id": "ch04-06-b5"
    },
    {
      "type": "paragraph",
      "textKo": "이 세 가지 원추세포의 반응 특성으로 인해, 자연계에 존재하는 무한한 차원의 연속 스펙트럼 $S(\\lambda)$는 세 개의 스칼라 자극값 $v_i$로 축약되어 뇌로 전달됩니다:",
      "textEn": "Integrating the product of a spectral distribution $S(\\lambda)$ with three tristimulus matching functions $m_i(\\lambda)$ gives three tristimulus values $v_i$:",
      "id": "ch04-06-b6"
    },
    {
      "type": "equation",
      "tex": "v_i = \\int_{\\lambda} S(\\lambda) m_i(\\lambda) \\, d\\lambda, \\quad i \\in \\{1, 2, 3\\}",
      "id": "ch04-06-b7"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "같은 색으로 보이는 서로 다른 스펙트럼",
      "summary": "같은 색으로 보이는 서로 다른 스펙트럼",
      "points": [
        {
          "title": "핵심 설명",
          "content": "세 원추 반응을 맞추는 스펙트럼은 하나가 아닙니다. 빨강과 초록 빛을 섞어 어떤 노랑과 조건등색을 만들 수 있습니다. 그러나 관찰자·조명·적응 상태가 달라지면 등색이 유지되지 않을 수 있고, 세 원색의 양수 혼합으로 모든 가시 색을 재현할 수도 없습니다."
        }
      ],
      "tags": [
        "메타메리즘",
        "삼원색 디스플레이",
        "시각 생리학"
      ],
      "id": "ch04-06-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "CIE 1931 XYZ 표준 색 공간",
      "titleEn": "4.6.1 The CIE XYZ Color Space",
      "id": "ch04-06-b9"
    },
    {
      "type": "paragraph",
      "textKo": "1931년 국제조명위원회(CIE)는 대규모 인체 실험을 거쳐 특정 하드웨어에 종속되지 않는 인류 보편의 기준 색 공간인 **CIE XYZ**를 정립했습니다. CIE는 세 개의 표준 등색 함수(Color Matching Functions) $\\bar{x}(\\lambda), \\bar{y}(\\lambda), \\bar{z}(\\lambda)$를 제정했습니다(그림 4.18).",
      "textEn": "The CIE XYZ color space is a device-independent color space. Given a spectral distribution $S(\\lambda)$, its coordinates are computed by integrating against the matching curves:",
      "id": "ch04-06-b10"
    },
    {
      "type": "equation",
      "tex": "X = \\int S(\\lambda) \\bar{x}(\\lambda) \\, d\\lambda, \\quad Y = \\int S(\\lambda) \\bar{y}(\\lambda) \\, d\\lambda, \\quad Z = \\int S(\\lambda) \\bar{z}(\\lambda) \\, d\\lambda",
      "id": "ch04-06-b11"
    },
    {
      "type": "paragraph",
      "textKo": "XYZ의 Y는 표준 명소시 시감도와 연결되어 휘도에 비례합니다. 절대적인 cd/m² 값을 얻으려면 스펙트럼의 단위와 683 같은 환산 계수, 정규화 규약을 맞춰야 합니다. 아래 색도 계산에서는 전체 밝기 척도가 소거됩니다. X+Y+Z=0인 검정에는 색도 x,y가 정의되지 않습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch04-06-b12"
    },
    {
      "type": "figure",
      "id": "fig-4-18",
      "number": "Figure 4.18",
      "title": "Original Figure 4.18",
      "titleKo": "원문 그림 4.18",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-18.png",
      "captionKo": "그림 4.18 · XYZ 등색함수입니다. 스펙트럼에 각 곡선을 곱해 파장에 대해 적분하면 X,Y,Z 값을 얻습니다.",
      "captionEn": "Figure 4.18: The XYZ Color Matching Curves. A given spectral distribution can be converted to XYZ by multiplying it by each of the three matching curves and integrating the result to compute the values x Subscript lamda , y Subscript lamda , and z Subscript lamda , using Equation ( 4.22 ).",
      "width": 998,
      "height": 386,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "fig-4-19",
      "number": "Figure 4.19",
      "title": "Original Figure 4.19",
      "titleKo": "원문 그림 4.19",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-19.png",
      "captionKo": "그림 4.19 · 가시광선의 각 파장이 XYZ에 기여하는 계수를 보여 줍니다. 곡선의 색은 해당 파장에 대응하는 표시용 RGB 색입니다.",
      "captionEn": "Figure 4.19: Plot of XYZ color coefficients for the wavelengths of light in the visible range. The curve is shaded with the RGB color associated with each wavelength.",
      "width": 998,
      "height": 425,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "색도 좌표와 CIE xy 색도도 (Chromaticity)",
      "titleEn": "xy Chromaticity Diagram",
      "id": "ch04-06-b15"
    },
    {
      "type": "paragraph",
      "textKo": "빛의 전체적인 밝기(휘도 $Y$)와 무관하게 순수한 \"색조(Color Tone)와 채도\"만을 2차원 평면에 시각화하기 위해 **색도 좌표(Chromaticity Coordinates, $x, y$)**를 다음과 같이 정규화합니다:",
      "textEn": "Chromaticity coordinates $x$ and $y$ factor out the overall brightness (luminance $Y$):",
      "id": "ch04-06-b16"
    },
    {
      "type": "equation",
      "tex": "x = \\frac{X}{X + Y + Z}, \\quad y = \\frac{Y}{X + Y + Z}, \\quad z = 1 - x - y",
      "id": "ch04-06-b17"
    },
    {
      "type": "figure",
      "id": "fig-4-20",
      "number": "Figure 4.20",
      "title": "Original Figure 4.20",
      "titleKo": "원문 그림 4.20",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-20.png",
      "captionKo": "그림 4.20 · xy 색도도입니다. 실제로 가능한 색도들은 표시된 영역 안에 있습니다. 밝기 성분은 색도 좌표만으로 정해지지 않습니다.",
      "captionEn": "Figure 4.20: x y Chromaticity Diagram. All valid colors lie inside the shaded region.",
      "width": 998,
      "height": 415,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "RGB 색 공간과 색역 (Color Gamuts)",
      "titleEn": "4.6.3 RGB Color Spaces",
      "id": "ch04-06-b19"
    },
    {
      "type": "paragraph",
      "textKo": "현대 디지털 모니터와 카메라는 세 가지 기본 원색(Red, Green, Blue)을 조합하여 색을 표현합니다. 하나의 RGB 색 공간을 수학적으로 엄밀히 정의하기 위해서는 다음 세 가지 규격이 확립되어야 합니다: (1) 빨강, 초록, 파랑의 3대 원색 색도 좌표 $(x, y)$, (2) 순수한 백색 기준점(White Point, 주로 D65), (3) 모니터의 비선형 밝기 특성을 보정하는 감마 전달 함수.",
      "textEn": "An RGB color space is defined by: (1) the chromaticities of its three primaries, (2) its white point, and (3) its transfer function.",
      "id": "ch04-06-b20"
    },
    {
      "type": "figure",
      "id": "fig-4-21",
      "number": "Figure 4.21",
      "title": "Original Figure 4.21",
      "titleKo": "원문 그림 4.21",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-21.png",
      "captionKo": "그림 4.21 · 두 디스플레이의 빨강·초록·파랑 채널 방출 스펙트럼입니다. 원문에서 LCD와 LED로 표기한 장치의 분포는 상당히 다릅니다. 데이터 제공: X-Rite, Inc.",
      "captionEn": "Figure 4.21: Red, Green, and Blue Emission Curves for an LCD Display and an LED Display. The first plot shows the curves for an LCD display, and the second shows them for an LED. These two displays have quite different emission profiles. (Data courtesy of X-Rite, Inc.)",
      "width": 998,
      "height": 333,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "RGB $\\leftrightarrow$ XYZ 선형 변환 행렬",
      "titleEn": "Conversion Between RGB and XYZ",
      "id": "ch04-06-b22"
    },
    {
      "type": "paragraph",
      "textKo": "RGB 색 공간과 CIE XYZ 색 공간 사이의 변환은 선형대수학의 $3 \\times 3$ 행렬 곱셈을 통해 초고속으로 이루어집니다. 예를 들어 표준 sRGB 선형 값과 XYZ 사이의 변환 공식은 다음과 같습니다:",
      "textEn": "Conversion between linear RGB and XYZ is performed using a $3 \\times 3$ matrix multiplication:",
      "id": "ch04-06-b23"
    },
    {
      "type": "equation",
      "tex": "\\begin{bmatrix} X \\\\ Y \\\\ Z \\end{bmatrix} = \\begin{bmatrix} 0.4124 & 0.3576 & 0.1805 \\\\ 0.2126 & 0.7152 & 0.0722 \\\\ 0.0193 & 0.1192 & 0.9505 \\end{bmatrix} \\begin{bmatrix} R_{\\text{linear}} \\\\ G_{\\text{linear}} \\\\ B_{\\text{linear}} \\end{bmatrix}",
      "id": "ch04-06-b24"
    },
    {
      "type": "concept-tip",
      "badge": "⚠️ 그래픽스 필독 주의",
      "title": "색 인코딩과 물리 계산을 구분합니다",
      "summary": "색 인코딩과 물리 계산을 구분합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "빛의 합산·보간·반사 계산에는 선형 값을 사용합니다. sRGB의 정확한 전달 함수는 단순한 2.2 거듭제곱이 아니라 선형 구간과 거듭제곱 구간이 있는 함수입니다. 텍스처의 모든 채널에 무조건 역감마를 적용해서도 안 됩니다. 노멀·거칠기 같은 데이터 텍스처와 이미 선형인 파일은 그 의미에 맞게 읽어야 합니다."
        }
      ],
      "tags": [
        "선형 파이프라인",
        "감마 보정",
        "sRGB 렌더링"
      ],
      "id": "ch04-06-b25"
    },
    {
      "type": "subheading",
      "id": "ch04-06-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-22",
      "number": "Figure 4.22",
      "title": "Original Figure 4.22",
      "titleKo": "원문 그림 4.22",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-22.png",
      "captionKo": "그림 4.22 · 같은 RGB (0.6,0.3,0.2)를 표시해도 디스플레이별 원색 스펙트럼이 다르면 최종 방출 스펙트럼이 달라집니다.",
      "captionEn": "Figure 4.22: Spectral Distributions from Displaying the RGB Color left-parenthesis 0.6 comma 0.3 comma 0.2 right-parenthesis on LED (red) and LCD (blue) Displays. The resulting emitted distributions are remarkably different, even given the same RGB values, due to the different emission curves illustrated in Figure 4.21 .",
      "width": 998,
      "height": 314,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-23",
      "number": "Figure 4.23",
      "title": "Original Figure 4.23",
      "titleKo": "원문 그림 4.23",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-23.png",
      "captionKo": "그림 4.23 · sRGB, DCI-P3, Rec2020, ACES2065-1의 색역입니다. ACES2065-1은 물리적 원색이 아닌 가상의 원색 좌표를 사용해 실제 가능한 색도를 넓게 표현합니다.",
      "captionEn": "Figure 4.23: The gamuts of the sRGB, DCI-P3, Rec2020, and ACES2065-1 color spaces, visualized using the chromaticity diagram. sRGB covers the smallest gamut, DCI-P3 the next largest, Rec2020 an even larger one. ACES2065-1, which corresponds to the large triangle, is distinguished by using primaries that correspond to imaginary colors. In doing so, it is able to represent all valid colors, unlike the others.",
      "width": 998,
      "height": 482,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-24",
      "number": "Figure 4.24",
      "title": "Original Figure 4.24",
      "titleKo": "원문 그림 4.24",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-24.png",
      "captionKo": "그림 4.24 · 같은 색도라도 색 공간이 바뀌면 RGB 값이 달라집니다. sRGB의 초록 (0,1,0)은 ACES2065-1에서는 대략 (0.38,0.82,0.12)로 표현됩니다.",
      "captionEn": "Figure 4.24: The same color can have very different RGB values when expressed in RGB color spaces with differently shaped gamuts. The green primary left-parenthesis 0 comma 1 comma 0 right-parenthesis in the sRGB color gamut (inner triangle) has chromaticity coordinates left-parenthesis 0.3 comma 0.6 right-parenthesis (white dot). In the wide-gamut ACES2065-1 color space (outer triangle), the same color has the RGB value left-parenthesis 0.38 comma 0.82 comma 0.12 right-parenthesis .",
      "width": 998,
      "height": 482,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-25",
      "number": "Figure 4.25",
      "title": "Original Figure 4.25",
      "titleKo": "원문 그림 4.25",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-25.png",
      "captionKo": "그림 4.25 · 픽셀당 영상 표본 하나에서 파장 표본을 1개와 4개로 사용한 결과를 기준 영상과 비교합니다. 4개면 색 잡음이 줄지만 완전히 없어지지는 않습니다. 모델 제공: Yasutoshi Mori.",
      "captionEn": "Figure 4.25: (a) Reference image of the example scene. (b) If the scene is rendered using only a single image sample per pixel, each sampling only a single wavelength, there is a substantial amount of variance from error in the Monte Carlo estimates of the pixels’ RGB colors. (c) With four wavelength samples ( pbrt ’s default), this variance is substantially reduced, though color noise is still evident. In practice, four wavelength samples is usually sufficient since multiple image samples are generally taken at each pixel. (Model courtesy of Yasutoshi Mori.)",
      "width": 998,
      "height": 391,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-26",
      "number": "Figure 4.26",
      "title": "Original Figure 4.26",
      "titleKo": "원문 그림 4.26",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-26.png",
      "captionKo": "그림 4.26 · 그림 4.25 장면에서 파장 표본 수에 따른 시간·오차·효율을 측정합니다. 이 특정 실험에서는 32개 이상의 파장 표본이 유리하게 나타났습니다. 모든 장면의 최적값은 아닙니다.",
      "captionEn": "Figure 4.26: (a) Rendering time when rendering the scene in Figure 4.25 graphed as a function of the number of wavelength samples, normalized to rendering time with one wavelength sample. (b) Mean squared error as a function of number of wavelength samples for both independent and stratified samples. (c) Monte Carlo efficiency as a function of number of stratified wavelength samples. These results suggest that at least 32 wavelength samples are optimal.",
      "width": 998,
      "height": 598,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-27",
      "number": "Figure 4.27",
      "title": "Original Figure 4.27",
      "titleKo": "원문 그림 4.27",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-27.png",
      "captionKo": "그림 4.27 · 다른 오차 원인이 함께 있는 복잡한 장면입니다. 이 실험에서는 파장 표본을 6개 이상 늘렸을 때 오차 개선이 제한되고, 효율은 8개에서 가장 좋았습니다.",
      "captionEn": "Figure 4.27: (a) A more complex scene, where variance in the Monte Carlo estimator is present from a variety of sources beyond wavelength sampling. (b) Graph of mean squared error versus the number of stratified wavelength samples. The benefits of additional wavelength samples are limited after six of them. (c) Monte Carlo efficiency versus number of stratified wavelength samples, normalized to efficiency with one wavelength sample. For this scene, eight samples is optimal.",
      "width": 998,
      "height": 619,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-28",
      "number": "Figure 4.28",
      "title": "Original Figure 4.28",
      "titleKo": "원문 그림 4.28",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-28.png",
      "captionKo": "그림 4.28 · 색상표의 여러 패치에서 측정한 스펙트럼 반사율입니다. 각 선의 표시색은 대응하는 RGB 색입니다.",
      "captionEn": "Figure 4.28: Spectral reflectances of several color checker patches. Each curve is shaded with the associated RGB color.",
      "width": 998,
      "height": 320,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-29",
      "number": "Figure 4.29",
      "title": "Original Figure 4.29",
      "titleKo": "원문 그림 4.29",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-29.png",
      "captionKo": "그림 4.29 · 시그모이드는 입력을 유한한 출력 구간에 대응시키는 매끄러운 S자 함수입니다. 여기서는 빠르게 계산할 수 있는 대수적인 형태를 사용합니다.",
      "captionEn": "Figure 4.29: Sigmoid curve. The term sigmoid refers to smooth S-shaped curves that map all inputs to a bounded output interval. The particular type of sigmoid used here is defined in terms of algebraic functions, enabling highly efficient evaluation at runtime.",
      "width": 998,
      "height": 311,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-30",
      "number": "Figure 4.30",
      "title": "Original Figure 4.30",
      "titleKo": "원문 그림 4.30",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-30.png",
      "captionKo": "그림 4.30 · 서로 다른 세 RGB 값으로부터 RGBSigmoidPolynomial이 만든 반사 스펙트럼입니다. RGB만으로 스펙트럼이 물리적으로 유일하게 결정되는 것은 아니며, 선택한 표현으로 한 분포를 구성합니다.",
      "captionEn": "Figure 4.30: Spectra Computed from RGB Values. Plots of reflectance spectra represented by the RGBSigmoidPolynomial for the RGB colors left-parenthesis 0.7 comma 0.5 comma 0.8 right-parenthesis (purple line), left-parenthesis 0.25 comma 0.44 comma 0.33 right-parenthesis (green line), and left-parenthesis 0.36 comma 0.275 comma 0.21 right-parenthesis (brown line). Each line is colored with its corresponding RGB color.",
      "width": 998,
      "height": 329,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-31",
      "number": "Figure 4.31",
      "title": "Original Figure 4.31",
      "titleKo": "원문 그림 4.31",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-31.png",
      "captionKo": "그림 4.31 · 색도에 따른 스펙트럼 다항식 계수 c₀,c₁,c₂입니다. 값이 급격히 바뀌는 경계가 가장 큰 RGB 채널이 바뀌는 영역과 가까워, 세 영역에 각각 표를 만듭니다.",
      "captionEn": "Figure 4.31: Plots of Spectrum Polynomial Coefficients c Subscript i . These plots show the polynomial coefficients for the corresponding x y chromaticities in the sRGB color space. Each of (a) c 0 , (b) c 1 , and (c) c 2 mostly vary smoothly, though they exhibit sharp transitions. (d) Partitioning the gamut according to which of red, green, or blue has the largest magnitude closely corresponds to these transitions; coefficients are therefore independently tabularized in those three regions.",
      "width": 998,
      "height": 838,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch04-06-source-figure-4-32",
      "number": "Figure 4.32",
      "title": "Original Figure 4.32",
      "titleKo": "원문 그림 4.32",
      "src": "/books/pbrt-4ed/reviewed-images/figure-4-32.png",
      "captionKo": "그림 4.32 · 채도가 높은 RGB에서 시그모이드 다항식이 만든 예상 밖의 스펙트럼 모양입니다. RGB 성분을 절반으로 낮추면 형태가 달라지며, 파장별 값이 특정 RGB 성분보다 클 수도 있습니다.",
      "captionEn": "Figure 4.32: With the sigmoid polynomial representation, highly saturated colors may end up with unexpected features in their spectra. Here we have plotted the spectrum returned by RGBAlbedoSpectrum for the RGB color left-parenthesis 0.95 comma 0.05 comma 0.025 right-parenthesis as well as that color with all components divided by two. With the original color, we see a wide range of the higher wavelengths are near 1 and that the lower wavelengths have more energy than expected. If that color is divided by two, the resulting spectrum is better behaved, though note that its magnitude exceeds the original red value of 0.475 in the higher wavelengths.",
      "width": 998,
      "height": 329,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Color.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "1f9211525a441d51864176a9cc70458af9f24569de921f178e9baadc480cb3e6",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "4.6 Color",
      "4.6.1  XYZ Color",
      "Chromaticity and xyY Color",
      "4.6.2  RGB Color",
      "4.6.3  RGB Color Spaces",
      "Standard Color Spaces",
      "4.6.4  Why Spectral Rendering?",
      "4.6.5  Choosing the Number of Wavelength Samples",
      "4.6.6  From RGB to Spectra",
      "Unbounded RGB",
      "RGB Illuminants"
    ],
    "sourceFigures": [
      "4.18",
      "4.19",
      "4.20",
      "4.21",
      "4.22",
      "4.23",
      "4.24",
      "4.25",
      "4.26",
      "4.27",
      "4.28",
      "4.29",
      "4.30",
      "4.31",
      "4.32"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
