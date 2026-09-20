import type { SectionContent } from '../../../../types/book';

export const CH05_02_PROJECTIVE_CAMERA: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "5",
  "chapterTitleKo": "제5장 가상 카메라와 필름 (Cameras and Film)",
  "sectionNumber": "5.2",
  "sectionTitle": "Projective Camera Models",
  "sectionTitleKo": "5.2 투영 카메라 모델 (원근 투영과 피사계 심도)",
  "originalUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
  "prevSection": {
    "id": "ch05-01",
    "title": "5.1 카메라 인터페이스 설계"
  },
  "nextSection": {
    "id": "ch05-03",
    "title": "5.3 구면 360도 카메라"
  },
  "summary": {
    "keyTakeaways": [
      "투영 변환 파이프라인은 카메라 공간 $\\to$ 스크린 공간 $\\to$ 정규화 장치 좌표(NDC) $\\to$ 래스터(픽셀) 공간의 단계적 행렬 사상으로 구성되며, `cameraFromRaster`를 통해 역방향 광선을 생성합니다.",
      "직교 카메라(Orthographic Camera)는 모든 투영선이 평행하여 거리에 따른 크기 왜곡이 없으므로 건축 도면, 기계 CAD, 아이소메트릭 게임 렌더링에 적합합니다.",
      "가장 단순한 원근 카메라(Perspective Camera)는 하나의 투영 중심을 지나는 광선을 모델링하며, 4차원 동차좌표계의 투영 나눗셈($w'=z$)을 통해 \"가까운 것은 크게, 먼 것은 작게\" 표현합니다.",
      "얇은 렌즈 모델(Thin Lens Model)은 가우스 렌즈 방정식($\\frac{1}{z} + \\frac{1}{z'} = \\frac{1}{f}$)을 바탕으로 유한한 크기의 조리개 구경을 시뮬레이션하여, 초점면 밖의 피사체가 부드럽게 흐려지는 **피사계 심도(Depth of Field)**를 근사합니다. 실제 렌즈의 수차와 복잡한 조리개 모양까지 모두 재현하는 모델은 아닙니다. 보케는 초점 밖 흐림의 모양과 성질을 가리키며 피사계 심도와 같은 용어는 아닙니다."
    ],
    "prerequisites": [
      "4x4 동차좌표 변환 행렬 (Homogeneous Coordinates)",
      "투영 나눗셈 (Perspective Divide: $[x, y, z, w]^T \\to [x/w, y/w, z/w, 1]^T$)",
      "기하 광학의 렌즈 굴절 법칙"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "5.2 투영 카메라 모델의 개요",
      "titleEn": "5.2 Projective Camera Models",
      "id": "ch05-02-b1"
    },
    {
      "type": "paragraph",
      "textKo": "컴퓨터 그래픽스에서 가장 널리 쓰이는 카메라 모델은 4x4 동차좌표 행렬과, 원근 투영의 경우 마지막 성분으로 나누는 연산으로 표현하는 **투영 카메라 모델(Projective Camera Models)**입니다. 이 절에서는 평행 투영을 수행하는 **직교 카메라(Orthographic Camera)**와 일상적인 원근감을 형성하는 **원근 카메라(Perspective Camera)**, 그리고 실제 카메라 렌즈의 유한한 구경 크기로 인해 발생하는 아웃포커싱 현상을 재현하는 **얇은 렌즈 기반 피사계 심도 모델(Depth of Field)**을 다룹니다.",
      "textEn": "The most commonly used camera models in computer graphics are projective camera models, which can be expressed with 4x4 homogeneous matrices followed, for perspective projection, by a division by the homogeneous coordinate. This section covers the orthographic camera (parallel projection), the perspective camera (standard perspective viewing), and the thin lens model that reproduces depth of field.",
      "id": "ch05-02-b2"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "화면 공간(Screen Space)과 래스터 좌표계 변환",
      "titleEn": "Screen Space and Raster Coordinates",
      "id": "ch05-02-b3"
    },
    {
      "type": "paragraph",
      "textKo": "3D 월드의 물체를 모니터의 2D 픽셀로 변환하기 위해 pbrt는 다음과 같은 좌표계 계층을 거칩니다:",
      "textEn": "To map 3D world objects onto 2D monitor pixels, pbrt defines a succession of coordinate transformations:",
      "id": "ch05-02-b4"
    },
    {
      "type": "paragraph",
      "textKo": "1. **카메라 공간(Camera Space)**: 카메라 원점이 $(0,0,0)$이고 $+z$가 시선 방향인 좌표계.\n2. **스크린 공간(Screen Space)**: 투영 변환이 적용된 후, 뷰 평면 위에 정의되는 연속적인 $x, y$ 윈도우 영역 (예: $[-1, 1] \\times [-1, 1]$).\n3. **래스터 공간(Raster Space)**: 픽셀 단위로 위치를 나타내는 좌표계로, 픽셀 번호는 정수지만 픽셀 내부의 표본 위치는 실수로 표현할 수 있습니다 ($[0, \\text{width}] \\times [0, \\text{height}]$).",
      "textEn": "1. Camera Space: origin at camera location, looking along +z.\n2. Screen Space: continuous 2D window on the projection plane.\n3. Raster Space: coordinates measured in pixel units; sample positions may be fractional even though pixel indices are integers.",
      "id": "ch05-02-b5"
    },
    {
      "type": "figure",
      "id": "fig-screen-window",
      "number": "Figure 5.3",
      "title": "Original Figure 5.3",
      "titleKo": "원문 그림 5.3",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-3.png",
      "captionKo": "그림 5.3 · 직교 카메라의 시야 부피는 카메라 공간에서 축정렬 상자입니다. 상자 안의 점을 near 평면으로 평행 투영합니다.",
      "captionEn": "Figure 5.3: The orthographic view volume is an axis-aligned box in camera space, defined such that objects inside the region are projected onto the z equals normal n normal e normal a normal r face of the box.",
      "width": 998,
      "height": 276,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "레이 트레이서는 이 파이프라인을 정방향이 아닌 **역방향**으로 추적해야 하므로, 래스터 좌표를 카메라 공간으로 되돌려 놓는 `cameraFromRaster` 변환 행렬을 미리 계산해 둡니다.",
      "textEn": "Because a ray tracer works backwards, it precomputes the cameraFromRaster transformation matrix to map from raster pixel samples back to camera space rays.",
      "id": "ch05-02-b7"
    },
    {
      "type": "equation",
      "tex": "\\text{cameraFromRaster} = \\text{screenFromCamera}^{-1} \\times \\text{rasterFromScreen}^{-1}",
      "explanationKo": "픽셀의 $(x, y)$ 샘플 점에 이 행렬을 곱하면 즉시 카메라 앞 근평면(Near Plane) 위의 3차원 점 좌표를 얻을 수 있습니다.",
      "id": "ch05-02-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "직교 투영 카메라 (Orthographic Camera)",
      "titleEn": "Orthographic Camera",
      "id": "ch05-02-b9"
    },
    {
      "type": "paragraph",
      "textKo": "직교 투영 카메라는 모든 투영선이 시선 방향($+z$)과 완벽히 평행합니다. 물체가 카메라에서 아무리 멀리 떨어져 있어도 화면에 맺히는 크기가 전혀 줄어들지 않습니다.",
      "textEn": "The orthographic camera models parallel projection, where all projection rays are parallel to the viewing axis. Objects retain the same apparent size regardless of their distance from the camera.",
      "id": "ch05-02-b10"
    },
    {
      "type": "figure",
      "id": "fig-ortho-diag",
      "number": "Figure 5.4",
      "title": "Original Figure 5.4",
      "titleKo": "원문 그림 5.4",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-4.png",
      "captionKo": "그림 5.4 · 같은 시점의 Kroken 장면을 직교와 원근 카메라로 비교합니다. 직교 투영은 거리에 따른 축소가 없고 평행선을 유지합니다. 장면 제공: Angelo Ferretti.",
      "captionEn": "Figure 5.4: Kroken Scene Rendered with Different Camera Models. Images are rendered from the same viewpoint with (a) orthographic and (b) perspective cameras. The lack of foreshortening makes the orthographic view feel like it has less depth, although it does preserve parallel lines, which can be a useful property. (Scene courtesy of Angelo Ferretti.)",
      "width": 998,
      "height": 1395,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "아래는 동일한 안락의자(Kroken) 모델을 직교 투영과 원근 투영으로 각각 렌더링하여 비교한 결과입니다. 직교 투영은 마치 공학 설계도면처럼 평행한 모서리들이 화면에서도 완벽히 평행을 유지합니다.",
      "textEn": "Below is a visual comparison between orthographic and perspective renderings of the Kroken armchair model.",
      "id": "ch05-02-b12"
    },
    {
      "type": "figure",
      "id": "fig-kroken-ortho",
      "number": "Figure 5.5",
      "title": "Original Figure 5.5",
      "titleKo": "원문 그림 5.5",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-5.png",
      "captionKo": "그림 5.5 · 직교 카메라는 필름의 래스터 표본을 카메라 공간으로 바꾸어 near 평면의 광선 원점을 얻습니다. 광선 방향은 카메라 공간의 (0,0,1)입니다.",
      "captionEn": "Figure 5.5: To create a ray with the orthographic camera, a raster space position on the film plane is transformed to camera space, giving the ray’s origin on the near plane. The ray’s direction in camera space is left-parenthesis 0 comma 0 comma 1 right-parenthesis , down the z axis.",
      "width": 998,
      "height": 276,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "id": "fig-kroken-persp",
      "textKo": "같은 원문 그림의 중복·부분 번호 표기를 정리했습니다. 해당 그림의 비교 상태와 설명은 앞서 표시한 원문 그림 5.5에서 확인합니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "원근 투영 카메라 (Perspective Camera)와 투영 나눗셈",
      "titleEn": "Perspective Camera and Perspective Divide",
      "id": "ch05-02-b15"
    },
    {
      "type": "paragraph",
      "textKo": "원근 카메라는 인간의 눈망울이나 핀홀 카메라처럼 모든 광선이 중심점(투영 중심, Center of Projection)을 향해 모여듭니다. 평행한 철길 선로가 저 멀리 지평선의 한 점(**소실점, Vanishing Point**)으로 모여 보이는 시각 현상이 바로 여기서 나타납니다.",
      "textEn": "The perspective camera models the human eye and pinhole cameras, where all viewing rays converge at a single center of projection. Parallel lines in 3D converge to vanishing points on the horizon.",
      "id": "ch05-02-b16"
    },
    {
      "type": "figure",
      "id": "fig-persp-lines",
      "number": "Figure 5.6",
      "title": "Original Figure 5.6",
      "titleKo": "원문 그림 5.6",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-6.png",
      "captionKo": "그림 5.6 · 원근 투영에서는 xy를 깊이 z로 나누고 시야각 배율 등을 반영합니다. 깊이 좌표도 near를 0, far를 1로 대응시키도록 변환합니다.",
      "captionEn": "Figure 5.6: The perspective transformation matrix projects points in camera space onto the near plane. The x prime and y prime coordinates of the projected points are equal to the unprojected x and y coordinates divided by the z coordinate. That operation is depicted here, where the effect of the projection is indicated by an arrow. The projected z prime coordinate is then computed so that points on the near plane map to z prime equals 0 and points on the far plane map to z prime equals 1 .",
      "width": 998,
      "height": 323,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "4x4 행렬의 기적: 투영 나눗셈 (Perspective Divide)",
      "summary": "어떻게 덧셈과 곱셈만 하는 행렬 연산으로 나눗셈($1/z$)을 해낼까요?",
      "points": [
        {
          "title": "동차좌표계의 마지막 성분 w",
          "content": "3D 그래픽스에서는 3차원 점 $(x, y, z)$에 1을 덧붙여 4차원 벡터 $[x, y, z, 1]^T$로 표현합니다. 원근 투영 행렬은 영리하게도 행렬의 마지막 4행을 $[0, 0, 1, 0]$으로 설계하여, 결과 벡터의 $w'$ 자리에 원본 깊이인 $z$ 값이 들어가도록 만듭니다."
        },
        {
          "title": "w'로 나누는 순간 마법이 시작된다",
          "content": "하드웨어나 소프트웨어가 4D 벡터를 다시 3D 점으로 정규화할 때 $[x'/w', y'/w', z'/w']^T$ 연산을 수행합니다. $w' = z$이므로 모든 좌표가 $z$로 나누어집니다! 즉, $z$(깊이)가 2배 멀어지면 화면 상의 크기 $x/z, y/z$는 정확히 절반으로 줄어들어 완벽한 원근감이 완성됩니다."
        }
      ],
      "id": "ch05-02-b18"
    },
    {
      "type": "figure",
      "id": "fig-persp-matrix",
      "number": "Figure 5.7",
      "title": "Original Figure 5.7",
      "titleKo": "원문 그림 5.7",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-7.png",
      "captionKo": "그림 5.7 · 카메라의 중심 방향과 영상 모서리로 향하는 방향의 각도로 시야 방향을 감싸는 원뿔을 구합니다. 카메라 공간에서는 정규화한 모서리 방향의 z 성분이 해당 코사인입니다.",
      "captionEn": "Figure 5.7: Computing the Cosine of the Perspective Camera’s Maximum View Angle. A cone that bounds the viewing directions of a PerspectiveCamera can be found by using the camera’s viewing direction as the center axis and by computing the cosine of the angle theta between that axis and a vector to one of the corners of the image. In camera space, that simplifies to be the z component of that vector, normalized.",
      "width": 998,
      "height": 135,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt에서 원근 투영 변환 행렬은 화각(FOV)과 근평면($z_{\\text{near}}$), 원평면($z_{\\text{far}}$)을 받아 다음과 같이 계산됩니다:",
      "textEn": "In pbrt, the perspective projection matrix is defined using the field of view (FOV), near plane, and far plane distances:",
      "id": "ch05-02-b20"
    },
    {
      "type": "code",
      "chunkName": "<<Perspective Matrix Computation>>=",
      "language": "cpp",
      "code": "Transform Perspective(Float fov, Float zNear, Float zFar) {\n    // 1. 투영 나눗셈을 위한 기본 원근 행렬\n    SquareMatrix<4> persp(1, 0, 0, 0,\n                    0, 1, 0, 0,\n                    0, 0, zFar / (zFar - zNear), -zFar * zNear / (zFar - zNear),\n                    0, 0, 1, 0);\n    // 2. 화각(FOV)에 따른 스케일 정규화\n    Float invTan = 1.0f / std::tan(Radians(fov) / 2.0f);\n    return Scale(invTan, invTan, 1) * Transform(persp);\n}",
      "explanationKo": "zNear와 zFar는 투영 좌표를 정의합니다. 이 광선 추적 카메라가 반드시 래스터라이저의 Z-buffer 가림 판정을 사용한다는 뜻은 아닙니다. 0<zNear<zFar, 0<fov<180도 같은 유효한 조건이 필요합니다.",
      "provenance": "teaching",
      "id": "ch05-02-b21"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "얇은 렌즈 모델과 피사계 심도 (Depth of Field & Bokeh)",
      "titleEn": "Thin Lens Model and Depth of Field",
      "id": "ch05-02-b22"
    },
    {
      "type": "paragraph",
      "textKo": "이상적인 핀홀 카메라는 무한히 작은 바늘구멍을 통해 광선을 모으므로, 1cm 앞의 손가락부터 수 킬로미터 뒤의 산봉우리까지 **모든 거리가 선명(Infinite Depth of Field)**하게 찍힙니다. 하지만 실제 카메라는 충분한 빛을 받아들이기 위해 지름이 수 센티미터에 달하는 유리 렌즈(조리개)를 사용합니다. 이로 인해 특정 초점 거리(Focal Plane)에 있는 물체만 선명하게 맺히고, 앞뒤의 물체는 둥글게 번지는 **피사계 심도(Depth of Field)**와 **보케(Bokeh)**가 발생합니다.",
      "textEn": "An ideal pinhole camera has an infinitesimally small aperture, resulting in infinite depth of field where everything is sharply in focus. Real cameras, however, require finite lens apertures to collect sufficient light. This leads to depth of field and beautiful bokeh blur for out-of-focus objects.",
      "id": "ch05-02-b23"
    },
    {
      "type": "figure",
      "id": "fig-thin-lens-basics",
      "number": "Figure 5.8",
      "title": "Original Figure 5.8",
      "titleKo": "원문 그림 5.8",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-8.png",
      "captionKo": "그림 5.8 · 얇은 렌즈의 축과 평행하게 들어온 광선은 초점 p를 통과합니다. 렌즈에서 초점까지 거리가 초점거리 f입니다.",
      "captionEn": "Figure 5.8: A thin lens, located along the z axis at z equals 0 . Incident rays that are parallel to the optical axis and pass through a thin lens (dashed lines) all pass through a point normal p Subscript , the focal point. The distance between the lens and the focal point, f , is the lens’s focal length.",
      "width": 998,
      "height": 267,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "얇은 렌즈의 초점 관계는 유명한 **가우스 렌즈 방정식(Gaussian Lens Equation)**을 따릅니다:",
      "textEn": "The optical imaging relationship of a thin lens is governed by the Gaussian lens equation:",
      "id": "ch05-02-b25"
    },
    {
      "type": "equation",
      "tex": "\\frac{1}{z} + \\frac{1}{z'} = \\frac{1}{f}",
      "explanationKo": "$z$는 렌즈 앞 물체까지의 거리, $z'$는 렌즈 뒤 센서/필름까지의 상 거리, $f$는 렌즈 고유의 초점거리(Focal Length)입니다.",
      "id": "ch05-02-b26"
    },
    {
      "type": "figure",
      "id": "fig-circle-of-confusion",
      "number": "Figure 5.9",
      "title": "Original Figure 5.9",
      "titleKo": "원문 그림 5.9",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-9.png",
      "captionKo": "그림 5.9 · 물체 깊이 z에 초점을 맞추기 위해 얇은 렌즈 방정식으로 영상 거리 z′를 구합니다. 렌즈와 필름 사이 거리를 조정하는 초점 맞춤을 설명합니다.",
      "captionEn": "Figure 5.9: To focus a thin lens at a depth z in the scene, Equation ( 5.2 ) can be used to compute the distance z prime on the film side of the lens that points at z focus to. Focusing is performed by adjusting the distance between the lens and the film plane.",
      "width": 998,
      "height": 195,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "초점면($z_f$)에서 벗어난 점이 센서 평면에 맺히는 흐림의 직경인 **착란원(Circle of Confusion, $d_c$)**의 크기는 렌즈의 구경 지름 $d_l$과 닮음비에 의해 유도됩니다:",
      "textEn": "The diameter of the circle of confusion d_c on the sensor plane can be expressed in terms of the lens diameter d_l:",
      "id": "ch05-02-b28"
    },
    {
      "type": "equation",
      "tex": "d_c = \\left| d_l \\frac{z - z_f}{z} \\frac{f}{z_f - f} \\right|",
      "explanationKo": "렌즈 구경 $d_l$이 클수록, 그리고 물체가 초점면 $z_f$로부터 멀어질수록 착란원의 크기 $d_c$가 급격히 커져 배경 흐림이 강해집니다.",
      "id": "ch05-02-b29"
    },
    {
      "type": "figure",
      "id": "fig-coc-graph",
      "number": "Figure 5.10",
      "title": "Original Figure 5.10",
      "titleKo": "원문 그림 5.10",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-10.png",
      "captionKo": "그림 5.10 · 디포커스 흐림이 없는 경우, 작은 조리개로 피사계 심도가 깊은 경우, 큰 조리개로 착란원이 커지는 경우의 비교입니다. 장면 제공: Angelo Ferretti.",
      "captionEn": "Figure 5.10: (a) Scene rendered with no defocus blur, (b) extensive depth of field due to a relatively small lens aperture, which gives only a small amount of blurriness in the out-of-focus regions, and (c) a very large aperture, giving a larger circle of confusion in the out-of-focus areas, resulting in a greater amount of blur on the film plane. (Scene courtesy of Angelo Ferretti.)",
      "width": 998,
      "height": 1392,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "조리개 크기에 따른 피사계 심도 렌더링 비교",
      "titleEn": "Visual Comparison: Aperture and Depth of Field",
      "id": "ch05-02-b31"
    },
    {
      "type": "paragraph",
      "textKo": "아래 렌더링 사진은 동일한 정물(수채화 도구) 씬에서 렌즈 조리개 구경의 크기를 조절했을 때의 시각적 차이를 보여줍니다. 연필통이 놓인 중앙 초점면은 선명함을 유지하지만, 조리개를 열수록 앞쪽 붓과 뒤쪽 캔버스가 부드럽게 뭉개집니다.",
      "textEn": "The images below demonstrate depth of field in the Watercolor scene. As the aperture diameter increases, out-of-focus objects blur while the central pencil cup remains crisp.",
      "id": "ch05-02-b32"
    },
    {
      "type": "figure",
      "id": "fig-watercolor-dof0",
      "number": "Figure 5.11",
      "title": "Original Figure 5.11",
      "titleKo": "원문 그림 5.11",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-11.png",
      "captionKo": "그림 5.11 · 피사계 심도가 풍경 장면의 깊이와 크기를 느끼는 데 주는 효과입니다. 장면 제공: Laubwerk.",
      "captionEn": "Figure 5.11: Depth of field gives a greater sense of depth and scale to this part of the landscape scene. (Scene courtesy of Laubwerk.)",
      "width": 998,
      "height": 561,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "id": "fig-watercolor-dof1",
      "textKo": "같은 원문 그림의 중복·부분 번호 표기를 정리했습니다. 해당 그림의 비교 상태와 설명은 앞서 표시한 원문 그림 5.11에서 확인합니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "id": "fig-watercolor-dof28",
      "textKo": "같은 원문 그림의 중복·부분 번호 표기를 정리했습니다. 해당 그림의 비교 상태와 설명은 앞서 표시한 원문 그림 5.11에서 확인합니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "레이 트레이서에서의 얇은 렌즈 광선 생성 알고리즘",
      "titleEn": "Ray Generation for Thin Lens",
      "id": "ch05-02-b36"
    },
    {
      "type": "figure",
      "id": "fig-thin-lens-raygen",
      "number": "Figure 5.12",
      "title": "Original Figure 5.12",
      "titleKo": "원문 그림 5.12",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-12.png",
      "captionKo": "그림 5.12 · 초점을 맞춘 깊이와 다른 곳의 점은 필름 위에 원으로 퍼집니다. 렌즈 지름·영상 거리·초점 영상 거리의 닮은삼각형 관계로 착란원의 지름을 구합니다.",
      "captionEn": "Figure 5.12: (a) If a thin lens with focal length f is focused at some depth z Subscript normal f , then the distance from the lens to the focus plane is z prime Subscript normal f , given by the Gaussian lens equation. A point in the scene at depth z not-equals z Subscript normal f will be imaged as a circle on the film plane; here z focuses at z prime , which is behind the film plane. (b) To compute the diameter of the circle of confusion, we can apply similar triangles: the ratio of d Subscript normal l , the diameter of the lens, to z prime must be the same as the ratio of d Subscript normal c , the diameter of the circle of confusion, to z prime minus z prime Subscript normal f .",
      "width": 998,
      "height": 235,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "chunkName": "<<PerspectiveCamera::GenerateRay with Thin Lens>>=",
      "language": "cpp",
      "code": "// 1. 핀홀 모델로 초점면 위의 수렴 목표점(pFocus) 계산\nPoint3f pCamera = cameraFromRaster(Point3f(sample.pFilm.x, sample.pFilm.y, 0));\nRay ray(Point3f(0, 0, 0), Normalize(Vector3f(pCamera)));\n\nif (lensRadius > 0) {\n    // 2. 렌즈 원판(Disk) 표면 상의 균일 난수 샘플링\n    Point2f pLens = lensRadius * SampleUniformDiskConcentric(sample.pLens);\n\n    // 3. 광선이 초점 평면(z = focalDistance)과 교차하는 점 계산\n    Float ft = focalDistance / ray.d.z;\n    Point3f pFocus = ray(ft);\n\n    // 4. 광선 원점을 렌즈 위의 점으로 변경하고, 방향을 pFocus를 향하도록 재설정\n    ray.o = Point3f(pLens.x, pLens.y, 0);\n    ray.d = Normalize(pFocus - ray.o);\n}",
      "explanationKo": "놀랍도록 단순하면서도 강력한 기법입니다! 렌즈 위의 무작위 점에서 출발한 모든 광선이 초점면의 동일한 점 pFocus로 수렴하므로, 초점면에 있는 물체는 항상 선명하고 초점면 밖의 물체는 샘플 광선들이 분산되며 자연스럽게 아웃포커싱됩니다.",
      "provenance": "teaching",
      "id": "ch05-02-b38"
    },
    {
      "type": "figure",
      "id": "fig-landscape-dof",
      "number": "Figure 5.13",
      "title": "Original Figure 5.13",
      "titleKo": "원문 그림 5.13",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-13.png",
      "captionKo": "그림 5.13 · 초점거리 50mm, 조리개 지름 25mm인 렌즈를 1m에 맞췄을 때, 물체 깊이에 따라 달라지는 착란원 지름입니다.",
      "captionEn": "Figure 5.13: The diameter of the circle of confusion as a function of depth for a 50-mm focal length lens with 25-mm aperture, focused at 1 meter.",
      "width": 998,
      "height": 346,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "id": "ch05-02-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch05-02-source-figure-5-2",
      "number": "Figure 5.2",
      "title": "Original Figure 5.2",
      "titleKo": "원문 그림 5.2",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-2.png",
      "captionKo": "그림 5.2 · 렌더링·카메라·래스터·NDC 좌표계의 관계입니다. 카메라 공간에서는 +z를 바라보며, 래스터 공간의 영상 평면은 z=0이고 xy는 픽셀 해상도 범위입니다. NDC는 이 xy 범위를 [0,1]로 정규화합니다.",
      "captionEn": "Figure 5.2: Several camera-related coordinate spaces are commonly used to simplify the implementation of Camera s. The camera class holds transformations between them. Scene objects in rendering space are viewed by the camera, which sits at the origin of camera space and points along the plus z axis. Objects between the near and far planes are projected onto the film plane at z equals normal n normal e normal a normal r in camera space. The film plane is at z equals 0 in raster space, where x and y range from left-parenthesis 0 comma 0 right-parenthesis to the image resolution in pixels. Normalized device coordinate (NDC) space normalizes raster space so that x and y range from left-parenthesis 0 comma 0 right-parenthesis to left-parenthesis 1 comma 1 right-parenthesis .",
      "width": 998,
      "height": 383,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch05-02-source-figure-5-14",
      "number": "Figure 5.14",
      "title": "Original Figure 5.14",
      "titleKo": "원문 그림 5.14",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-14.png",
      "captionKo": "그림 5.14 · 유한 조리개에서는 렌즈 원판 위의 점을 표본으로 뽑습니다. 핀홀 광선이 초점면과 만나는 점을 먼저 구하고, 렌즈 표본에서 그 점으로 향하도록 광선을 만들면 초점면의 점은 선명하게 유지됩니다.",
      "captionEn": "Figure 5.14: (a) For a pinhole camera model, a single camera ray is associated with each point on the film plane (filled circle), given by the ray that passes through the single point of the pinhole lens (empty circle). (b) For a camera model with a finite aperture, we sample a point (filled circle) on the disk-shaped lens for each ray. We then compute the ray that passes through the center of the lens (corresponding to the pinhole model) and the point where it intersects the plane of focus (solid line). We know that all objects in the plane of focus must be in focus, regardless of the lens sample position. Therefore, the ray corresponding to the lens position sample (dashed line) is given by the ray starting on the lens sample point and passing through the computed intersection point on the plane of focus.",
      "width": 998,
      "height": 578,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch05-02-source-figure-5-15",
      "number": "Figure 5.15",
      "title": "Original Figure 5.15",
      "titleKo": "원문 그림 5.15",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-15.png",
      "captionKo": "그림 5.15 · 피사계 심도가 있는 풍경을 4 spp로 렌더링한 결과입니다. 조리개에 대한 표본이 부족해 입자 같은 잡음이 나타납니다. 장면 제공: Laubwerk.",
      "captionEn": "Figure 5.15: Landscape scene with depth of field and only four samples per pixel: the depth of field is undersampled and the image is grainy. (Scene courtesy of Laubwerk.)",
      "width": 998,
      "height": 561,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "d011e235f3fd1ed2614743c4dd4ad47e5c02b409226a5b4825ead45bdf4ad238",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "5.2 Projective Camera Models",
      "5.2.1  Orthographic Camera",
      "5.2.2  Perspective Camera",
      "5.2.3  The Thin Lens Model and Depth of Field"
    ],
    "sourceFigures": [
      "5.2",
      "5.3",
      "5.4",
      "5.5",
      "5.6",
      "5.7",
      "5.8",
      "5.9",
      "5.10",
      "5.11",
      "5.12",
      "5.13",
      "5.14",
      "5.15"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
