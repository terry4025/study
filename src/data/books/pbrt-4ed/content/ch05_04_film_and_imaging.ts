import type { SectionContent } from '../../../../types/book';

export const CH05_04_FILM_AND_IMAGING: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "5",
  "chapterTitleKo": "제5장 가상 카메라와 필름 (Cameras and Film)",
  "sectionNumber": "5.4",
  "sectionTitle": "Film and Imaging",
  "sectionTitleKo": "5.4 디지털 필름과 픽셀 센서 (Film and Imaging)",
  "originalUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
  "prevSection": {
    "id": "ch05-03",
    "title": "5.3 구면 360도 카메라"
  },
  "nextSection": {
    "id": "ch06-01",
    "title": "6.1 기본 Shape 인터페이스"
  },
  "summary": {
    "keyTakeaways": [
      "필름(Film)은 카메라를 통과한 빛의 분광 방사휘도를 측정하여 이산적인 2D 픽셀 격자에 최종 색상과 광학적 데이터를 기록하는 최종 수신체입니다.",
      "`PixelSensor`는 실제 디지털 카메라 센서(Canon EOS 5D 등)의 파장별 감도 반응 곡선($S(\\lambda)$)을 시뮬레이션하여 임의의 연속 파장 빛을 정확한 센서 RGB 신호로 변환합니다.",
      "수백만 개의 광선 샘플을 멀티코어 CPU나 GPU에서 병렬로 안전하게 합산하기 위해, pbrt는 타일 기반(Tile-based) 분할과 원자적 부동소수점 누적(`AtomicDouble`) 구조를 사용합니다.",
      "`GBufferFilm`은 픽셀 색상뿐만 아니라 표면 노멀(법선), 깊이(Depth), 알베도(반사율), 색상 분산(Variance)을 함께 기록하여 최신 AI 디노이저(OIDN, OptiX)와 적응형 샘플링의 핵심 입력 데이터를 제공합니다."
    ],
    "prerequisites": [
      "스펙트럼 분광 분포와 색공간 변환 (제4장 내용)",
      "멀티스레딩과 병렬 처리 (Race Condition, False Sharing, Atomic Operation)",
      "이미지 재구성 필터 (Box, Gaussian, Mitchell Filter)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "5.4 디지털 필름과 센서의 물리 모델",
      "titleEn": "5.4 Film and Imaging",
      "id": "ch05-04-b1"
    },
    {
      "type": "paragraph",
      "textKo": "센서는 도착한 빛을 파장별 감도와 노출 시간에 따라 누적하여 전기적 신호로 바꿉니다. 일반적인 RGB 센서의 한 화소가 모든 파장을 각각 분광 계수하는 것은 아닙니다. 컬러 필터를 통한 넓은 파장 대역의 응답을 측정합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch05-04-b2"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "픽셀 센서 (PixelSensor)와 분광 응답 특성",
      "titleEn": "PixelSensor and Spectral Response",
      "id": "ch05-04-b3"
    },
    {
      "type": "paragraph",
      "textKo": "실제 디지털 카메라는 수학적으로 순수한 RGB를 곧바로 읽지 못합니다. 센서 표면의 미세 컬러 필터(Color Filter Array / Bayer Filter)에 따라 파장별 감도 응답 곡선 $S_r(\\lambda), S_g(\\lambda), S_b(\\lambda)$가 다르게 작용합니다. pbrt의 `PixelSensor` 클래스는 이 물리적 분광 감도를 정밀하게 모델링합니다.",
      "textEn": "Real cameras do not measure pure RGB directly; each pixel is covered by a color filter with wavelength-dependent spectral sensitivities. pbrt models this with the PixelSensor class.",
      "id": "ch05-04-b4"
    },
    {
      "type": "equation",
      "tex": "\\text{RGB}_i = \\int L_i(\\lambda) S(\\lambda) d\\lambda",
      "explanationKo": "파장별 감도의 가중합이라는 핵심을 보여 주는 축약식입니다. 실제 픽셀 측정에는 위치·방향·노출 시간의 적분, 센서 배율과 색 변환이 추가됩니다. 이 식 하나가 최종 출력 RGB 전압 전체를 정의하지는 않습니다.",
      "id": "ch05-04-b5"
    },
    {
      "type": "paragraph",
      "id": "fig-sensor-curves",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "textKo": "PBRT는 가시 범위에서 감도가 큰 부분을 더 자주 뽑는 파장 분포를 제공합니다. FilmBase는 SampledWavelengths::SampleVisible을 호출하며, 매번 임의 센서의 세 감도 곡선에 정확히 비례하는 분포를 새로 계산하는 것은 아닙니다. 표본 기여를 실제 PDF로 나누는 보정이 필요합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch05-04-b7"
    },
    {
      "type": "figure",
      "id": "fig-wavelength-sampling",
      "number": "Figure 5.17",
      "title": "Original Figure 5.17",
      "titleKo": "원문 그림 5.17",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-17.png",
      "captionKo": "그림 5.17 · 필름의 두 위치에서 렌즈를 통해 보이는 장면입니다. 초점이 맞는 점에서는 렌즈 영역의 입사 방사휘도가 거의 같지만, 흐린 영역에서는 렌즈 위에 작은 장면 영상이 나타나 빠르게 변할 수 있습니다.",
      "captionEn": "Figure 5.17: The Image of the Scene on the Lens, as Seen from Two Points on the Film Plane. Both are from a rendering of the San Miguel scene. (a) As seen from a point where the scene is in sharp focus; the incident radiance is effectively constant over its area. (b) As seen from a pixel in an out-of-focus area, a small image of part of the scene is visible, with potentially rapidly varying radiance.",
      "width": 998,
      "height": 617,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "FilmBase와 픽셀 재구성 필터링",
      "titleEn": "FilmBase and Image Reconstruction",
      "id": "ch05-04-b9"
    },
    {
      "type": "paragraph",
      "textKo": "필름은 전체 이미지 해상도(`fullResolution`), 렌더링할 특정 서브 영역 크기(`pixelBounds`), 필름의 물리적 대각선 길이(`diagonal`, 기본 35mm 풀프레임 기준 43.3mm), 그리고 픽셀 재구성 필터(`Filter`)를 관리합니다.",
      "textEn": "FilmBase manages overall image resolution, cropped pixel bounds, physical film dimensions, and the pixel reconstruction filter.",
      "id": "ch05-04-b10"
    },
    {
      "type": "figure",
      "id": "fig-film-filter",
      "number": "Figure 5.18",
      "title": "Original Figure 5.18",
      "titleKo": "원문 그림 5.18",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-18.png",
      "captionKo": "그림 5.18 · 필름의 복사조도 측정 배치입니다. 뒤쪽 렌즈 요소의 접평면 위 p′에서 필름 p로 도달하는 빛을 다루며, 축 방향 거리 z와 광학축에 대한 각도 θ를 사용합니다.",
      "captionEn": "Figure 5.18: Geometric setting for the irradiance measurement equation, ( 5.3 ). Radiance can be measured as it passes through points normal p prime on the plane tangent to the rear lens element to a point on the film plane normal p Subscript . z is the axial distance from the film plane to the rear element tangent plane, and theta is the angle between the vector from normal p prime to normal p Subscript and the optical axis.",
      "width": 998,
      "height": 218,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "멀티코어 병렬 렌더링을 위한 RGBFilm 타일링 구조",
      "titleEn": "Tile-Based Parallel Rendering in RGBFilm",
      "id": "ch05-04-b12"
    },
    {
      "type": "paragraph",
      "textKo": "일반 카메라 샘플은 목적 픽셀별로 누적하고, 작업 분할로 같은 픽셀의 쓰기가 충돌하지 않게 구성할 수 있습니다. 반면 임의 픽셀에 도달하는 splat은 동시 쓰기가 가능하므로 원자적 누적이 필요합니다. 타일의 사용이 모든 캐시 경합을 제거한다는 뜻은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch05-04-b13"
    },
    {
      "type": "figure",
      "id": "fig-film-tiles",
      "number": "Figure 5.19",
      "title": "Original Figure 5.19",
      "titleKo": "원문 그림 5.19",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-19.png",
      "captionKo": "그림 5.19 · XYZ 등색함수와 Canon EOS 5D의 측정 센서 응답으로 렌더링한 결과를 비교합니다. 센서 응답 선택은 결과 색조에 영향을 줍니다. 장면 제공: Beeple.",
      "captionEn": "Figure 5.19: The Effect of Accurately Modeling Camera Sensor Response. (a) Scene rendered using the XYZ matching functions for the PixelSensor . (b) Scene rendered using measured sensor response curves for a Canon EOS 5D camera. Note that the color tones are slightly cooler—they have less orange and more blue to them. (Scene courtesy of Beeple.)",
      "width": 998,
      "height": 506,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "double 정밀도와 원자적 연산은 다른 역할입니다",
      "summary": "double 정밀도와 원자적 연산은 다른 역할입니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "double은 float보다 더 많은 유효 비트를 제공하지만 여전히 반올림 오차가 있습니다. 원자적 덧셈은 여러 스레드의 갱신이 유실되지 않게 하는 장치이지 수학적 오차를 없애는 장치는 아닙니다. PBRT의 일반 rgbSum과 weightSum은 double이고, 동시에 누적될 수 있는 rgbSplat에 AtomicDouble을 씁니다."
        }
      ],
      "id": "ch05-04-b15"
    },
    {
      "type": "figure",
      "id": "fig-float-precision",
      "number": "Figure 5.20",
      "title": "Original Figure 5.20",
      "titleKo": "원문 그림 5.20",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-20.png",
      "captionKo": "그림 5.20 · 백열등과 비슷한 노란 조명에서의 원본과 3,000K 백색 균형 적용 결과입니다. 색 순응 때문에 백색 균형 결과가 실제 관찰자의 지각에 더 가까울 수 있습니다. 장면 제공: Wig42, Benedikt Bitterli.",
      "captionEn": "Figure 5.20: The Effect of White Balance. (a) Image of a scene with a yellow illuminant that has a similar spectral distribution to an incandescent light bulb. (b) White balanced image, using a color temperature of 3000 K. Due to chromatic adaptation, this image is much closer than (a) to what a human observer would perceive viewing this scene. (Scene courtesy of Wig42 from Blend Swap, via Benedikt Bitterli.)",
      "width": 998,
      "height": 1868,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "필름 스플래팅 (Film Splatting)과 화이트 밸런스",
      "titleEn": "Film Splatting and White Balance",
      "id": "ch05-04-b17"
    },
    {
      "type": "paragraph",
      "textKo": "AddSplat은 보통 픽셀에 배정된 카메라 표본과 달리 이미지의 임의 위치에 기여를 더할 때 사용합니다. 예를 들어 광원 쪽 경로를 카메라에 연결하는 기법에서 필요합니다. 모든 포톤 매핑 알고리즘이 이 연산으로 필름에 직접 광자를 뿌리는 것은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch05-04-b18"
    },
    {
      "type": "figure",
      "id": "fig-film-splat",
      "number": "Figure 5.21",
      "title": "Original Figure 5.21",
      "titleKo": "원문 그림 5.21",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-21.png",
      "captionKo": "그림 5.21 · CIE Y와 X+Y+Z에 비례하는 정규화 분포, 그리고 가시 파장 표본용 매개변수 분포를 비교합니다.",
      "captionEn": "Figure 5.21: (a) Plot of normalized PDFs corresponding to the CIE upper Y matching function and the sum of the upper X , upper Y , and upper Z matching functions. (b) Plot of the parametric distribution p Subscript normal v Baseline left-parenthesis lamda right-parenthesis from Equation ( 5.9 ).",
      "width": 998,
      "height": 357,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "또한 센서에서 수집된 원시 센서 RGB는 최종 출력 포맷에 맞춰 화이트 밸런스(White Balance) 색온도 보정과 $3 \\times 3$ 색공간 변환 행렬을 거쳐 sRGB, Display-P3, ACES 등의 표준 이미지 파일로 저장됩니다.",
      "textEn": "Sensor RGB values are white-balanced and transformed via 3x3 matrices into standard output color spaces such as sRGB or Display-P3.",
      "id": "ch05-04-b20"
    },
    {
      "type": "figure",
      "id": "fig-white-balance",
      "number": "Figure 5.22",
      "title": "Original Figure 5.22",
      "titleKo": "원문 그림 5.22",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-22.png",
      "captionKo": "그림 5.22 · 4 spp·파장 표본 4개라는 같은 조건에서 균일 파장 샘플링과 SampleVisible()을 비교합니다. 이 예제에서는 후자가 적은 추가 비용으로 색 잡음을 줄입니다. 모델 제공: Yasutoshi Mori.",
      "captionEn": "Figure 5.22: (a) Scene rendered with 4 samples per pixel, each with 4 wavelength samples, sampled uniformly over the visible range. (b) Rendered at the same sampling rates but instead sampling wavelengths using SampledWavelengths::SampleVisible() . This image has substantially less color noise, at a negligible cost in additional computation. (Model courtesy of Yasutoshi Mori.)",
      "width": 998,
      "height": 1073,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "AI 디노이저와 미래형 기하 버퍼 (GBufferFilm)",
      "titleEn": "GBufferFilm and AI Denoising",
      "id": "ch05-04-b22"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt-v4에 새롭게 도입된 `GBufferFilm`은 픽셀의 최종 RGB 색상뿐만 아니라, 첫 번째로 교차한 물체 표면의 **기하학적 보조 정보(Geometry Buffer / G-Buffer)**를 동시에 기록합니다.",
      "textEn": "GBufferFilm extends standard RGB film by recording auxiliary geometric channels at the first visible surface intersection point, providing indispensable data for modern AI denoisers.",
      "id": "ch05-04-b23"
    },
    {
      "type": "code",
      "chunkName": "<<GBufferFilm::Pixel Structure>>=",
      "language": "cpp",
      "code": "// 원문의 GBufferFilm::Pixel 멤버\nstruct Pixel {\n    double rgbSum[3] = {0., 0., 0.};\n    double weightSum = 0., gBufferWeightSum = 0.;\n    AtomicDouble rgbSplat[3];\n    Point3f pSum;\n    Float dzdxSum = 0, dzdySum = 0;\n    Normal3f nSum, nsSum;\n    Point2f uvSum;\n    double rgbAlbedoSum[3] = {0., 0., 0.};\n    VarianceEstimator<Float> rgbVariance[3];\n};",
      "explanationKo": "G-buffer의 위치·법선·알베도·분산 정보는 노이즈 제거와 분석에 활용됩니다. 특정 디노이저가 모든 장면에서 정해진 시간 안에 참값을 복원한다는 보장은 없습니다. 불충분한 샘플의 작은 세부는 지워지거나 잘못 만들어질 수 있습니다.",
      "provenance": "teaching",
      "id": "ch05-04-b24"
    },
    {
      "type": "subheading",
      "id": "ch05-04-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch05-04-source-figure-5-23",
      "number": "Figure 5.23",
      "title": "Original Figure 5.23",
      "titleKo": "원문 그림 5.23",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-23.png",
      "captionKo": "그림 5.23 · 픽셀 중심 주변에서 radius.x와 radius.y가 정한 범위의 표본들을 2차원 필터 가중치로 모읍니다. 필터 가중치의 합으로 정규화한 평균이 픽셀 값을 이룹니다.",
      "captionEn": "Figure 5.23: 2D Image Filtering. To compute a filtered pixel value for the pixel marked with a filled circle located at left-parenthesis x comma y right-parenthesis , all the image samples inside the box around left-parenthesis x comma y right-parenthesis with extent radius.x and radius.y need to be considered. Each of the image samples left-parenthesis x Subscript i Baseline comma y Subscript i Baseline right-parenthesis , denoted by open circles, is weighted by a 2D filter function, f left-parenthesis x minus x Subscript i Baseline comma y minus y Subscript i Baseline right-parenthesis . The weighted average of all samples is the final pixel value.",
      "width": 998,
      "height": 373,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch05-04-source-figure-5-24",
      "number": "Figure 5.24",
      "title": "Original Figure 5.24",
      "titleKo": "원문 그림 5.24",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-24.png",
      "captionKo": "그림 5.24 · 비편향·유한 분산 등의 조건에서 MSE의 1/n 감소는 로그 그래프의 기울기 −1에 대응합니다. 이 실험에서는 32비트 기준 이미지의 정밀도 때문에 약 1,000표본 이후 측정 오차가 더 이상 줄지 않는 것처럼 보입니다.",
      "captionEn": "Figure 5.24: Mean Squared Error as a Function of Sample Count. When rendering a scene using an unbiased Monte Carlo estimator, we expect MSE to be related to the number of samples n by upper O left-parenthesis 1 slash n right-parenthesis . With a log–log plot, this rate corresponds to a straight line with slope negative 1 . For the test scene considered here, we can see that using 32-bit float s for the reference image causes reported error to inaccurately stop decreasing after 1,000 or so samples.",
      "width": 998,
      "height": 322,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch05-04-source-figure-5-25",
      "number": "Figure 5.25",
      "title": "Original Figure 5.25",
      "titleKo": "원문 그림 5.25",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-25.png",
      "captionKo": "그림 5.25 · 드물게 태양에 도달하는 경로 때문에 일부 픽셀에 큰 값이 생긴 장면입니다. RGB 표본을 10 이하로 제한하면 더 깨끗해 보이지만 에너지를 잃는 편향이 생깁니다. 모델 제공: Yasutoshi Mori.",
      "captionEn": "Figure 5.25: Image with High Variance in Some Pixels. This scene suffers from variance spikes in pixels due to difficult-to-sample light paths that occasionally intersect the sun. (a) Image rendered normally. (b) Image rendered with clamping, where pixel sample RGB values are clamped to have values no larger than 10. The image looks much better with clamping, though at a cost of some loss of energy. (Model courtesy of Yasutoshi Mori.)",
      "width": 998,
      "height": 673,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Film_and_Imaging.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "7785bf81000d6c8d222cdb14cbfc22cfad6143baf1682ff60cf958d0a4c15321",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "5.4 Film and Imaging",
      "5.4.1  The Camera Measurement Equation",
      "5.4.2  Modeling Sensor Response",
      "Chromatic Adaptation and White Balance",
      "Sampling Sensor Response",
      "5.4.3  Filtering Image Samples",
      "5.4.4  The Film Interface",
      "5.4.5  Common Film Functionality",
      "5.4.6  RGBFilm",
      "5.4.7  GBufferFilm"
    ],
    "sourceFigures": [
      "5.17",
      "5.18",
      "5.19",
      "5.20",
      "5.21",
      "5.22",
      "5.23",
      "5.24",
      "5.25"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
