import { SectionContent } from '../../../../types/book';

export const CH05_02_PROJECTIVE_CAMERA: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '5',
  chapterTitleKo: '제5장 가상 카메라와 필름 (Cameras and Film)',
  sectionNumber: '5.2',
  sectionTitle: 'Projective Camera Models',
  sectionTitleKo: '5.2 투영 카메라 모델 (원근 투영과 피사계 심도)',
  originalUrl: 'https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models.html',
  prevSection: {
    id: 'ch05-01',
    title: '5.1 카메라 인터페이스 설계',
  },
  nextSection: {
    id: 'ch05-03',
    title: '5.3 구면 360도 카메라',
  },
  summary: {
    keyTakeaways: [
      '투영 변환 파이프라인은 카메라 공간 $\\to$ 스크린 공간 $\\to$ 정규화 장치 좌표(NDC) $\\to$ 래스터(픽셀) 공간의 단계적 행렬 사상으로 구성되며, `cameraFromRaster`를 통해 역방향 광선을 생성합니다.',
      '직교 카메라(Orthographic Camera)는 모든 투영선이 평행하여 거리에 따른 크기 왜곡이 없으므로 건축 도면, 기계 CAD, 아이소메트릭 게임 렌더링에 적합합니다.',
      '가장 단순한 원근 카메라(Perspective Camera)는 하나의 투영 중심을 지나는 광선을 모델링하며, 4차원 동차좌표계의 투영 나눗셈($w\'=z$)을 통해 "가까운 것은 크게, 먼 것은 작게" 표현합니다.',
      '얇은 렌즈 모델(Thin Lens Model)은 가우스 렌즈 방정식($\\frac{1}{z} + \\frac{1}{z\'} = \\frac{1}{f}$)을 바탕으로 유한한 크기의 조리개 구경을 시뮬레이션하여, 초점면 밖의 피사체가 부드럽게 흐려지는 **피사계 심도(Depth of Field)**를 근사합니다. 실제 렌즈의 수차와 복잡한 조리개 모양까지 모두 재현하는 모델은 아닙니다. 보케는 초점 밖 흐림의 모양과 성질을 가리키며 피사계 심도와 같은 용어는 아닙니다.'
    ],
    prerequisites: [
      '4x4 동차좌표 변환 행렬 (Homogeneous Coordinates)',
      '투영 나눗셈 (Perspective Divide: $[x, y, z, w]^T \\to [x/w, y/w, z/w, 1]^T$)',
      '기하 광학의 렌즈 굴절 법칙'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '5.2 투영 카메라 모델의 개요',
      titleEn: '5.2 Projective Camera Models'
    },
    {
      type: 'paragraph',
      textKo: '컴퓨터 그래픽스에서 가장 널리 쓰이는 카메라 모델은 4x4 동차좌표 행렬과, 원근 투영의 경우 마지막 성분으로 나누는 연산으로 표현하는 **투영 카메라 모델(Projective Camera Models)**입니다. 이 절에서는 평행 투영을 수행하는 **직교 카메라(Orthographic Camera)**와 일상적인 원근감을 형성하는 **원근 카메라(Perspective Camera)**, 그리고 실제 카메라 렌즈의 유한한 구경 크기로 인해 발생하는 아웃포커싱 현상을 재현하는 **얇은 렌즈 기반 피사계 심도 모델(Depth of Field)**을 다룹니다.',
      textEn: 'The most commonly used camera models in computer graphics are projective camera models, which can be expressed with 4x4 homogeneous matrices followed, for perspective projection, by a division by the homogeneous coordinate. This section covers the orthographic camera (parallel projection), the perspective camera (standard perspective viewing), and the thin lens model that reproduces depth of field.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '화면 공간(Screen Space)과 래스터 좌표계 변환',
      titleEn: 'Screen Space and Raster Coordinates'
    },
    {
      type: 'paragraph',
      textKo: '3D 월드의 물체를 모니터의 2D 픽셀로 변환하기 위해 pbrt는 다음과 같은 좌표계 계층을 거칩니다:',
      textEn: 'To map 3D world objects onto 2D monitor pixels, pbrt defines a succession of coordinate transformations:'
    },
    {
      type: 'paragraph',
      textKo: '1. **카메라 공간(Camera Space)**: 카메라 원점이 $(0,0,0)$이고 $+z$가 시선 방향인 좌표계.\n2. **스크린 공간(Screen Space)**: 투영 변환이 적용된 후, 뷰 평면 위에 정의되는 연속적인 $x, y$ 윈도우 영역 (예: $[-1, 1] \\times [-1, 1]$).\n3. **래스터 공간(Raster Space)**: 픽셀 단위로 위치를 나타내는 좌표계로, 픽셀 번호는 정수지만 픽셀 내부의 표본 위치는 실수로 표현할 수 있습니다 ($[0, \\text{width}] \\times [0, \\text{height}]$).',
      textEn: '1. Camera Space: origin at camera location, looking along +z.\n2. Screen Space: continuous 2D window on the projection plane.\n3. Raster Space: coordinates measured in pixel units; sample positions may be fractional even though pixel indices are integers.'
    },
    {
      type: 'figure',
      id: 'fig-screen-window',
      number: 'Figure 5.3',
      title: 'Screen Window and Raster Space',
      titleKo: '스크린 윈도우와 래스터 픽셀 공간의 사상',
      src: '/books/pbrt-4ed/images/pha05f02.svg',
      captionKo: '스크린 공간의 연속적 윈도우 좌표(좌측)가 필름 픽셀 해상도에 맞춰 래스터 공간(우측)으로 스케일 및 이동 변환되는 기하학적 구조.',
      captionEn: 'Mapping from continuous screen space coordinates to discrete raster pixel coordinates.'
    },
    {
      type: 'paragraph',
      textKo: '레이 트레이서는 이 파이프라인을 정방향이 아닌 **역방향**으로 추적해야 하므로, 래스터 좌표를 카메라 공간으로 되돌려 놓는 `cameraFromRaster` 변환 행렬을 미리 계산해 둡니다.',
      textEn: 'Because a ray tracer works backwards, it precomputes the cameraFromRaster transformation matrix to map from raster pixel samples back to camera space rays.'
    },
    {
      type: 'equation',
      tex: '\\text{cameraFromRaster} = \\text{screenFromCamera}^{-1} \\times \\text{rasterFromScreen}^{-1}',
      explanationKo: '픽셀의 $(x, y)$ 샘플 점에 이 행렬을 곱하면 즉시 카메라 앞 근평면(Near Plane) 위의 3차원 점 좌표를 얻을 수 있습니다.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '직교 투영 카메라 (Orthographic Camera)',
      titleEn: 'Orthographic Camera'
    },
    {
      type: 'paragraph',
      textKo: '직교 투영 카메라는 모든 투영선이 시선 방향($+z$)과 완벽히 평행합니다. 물체가 카메라에서 아무리 멀리 떨어져 있어도 화면에 맺히는 크기가 전혀 줄어들지 않습니다.',
      textEn: 'The orthographic camera models parallel projection, where all projection rays are parallel to the viewing axis. Objects retain the same apparent size regardless of their distance from the camera.'
    },
    {
      type: 'figure',
      id: 'fig-ortho-diag',
      number: 'Figure 5.4',
      title: 'Orthographic Projection Geometry',
      titleKo: '직교 투영의 기하학적 구조',
      src: '/books/pbrt-4ed/images/pha05f03.svg',
      captionKo: '직교 투영에서는 씬 속의 점들이 z축과 평행하게 뷰 평면으로 수직 투영됩니다.',
      captionEn: 'In orthographic projection, scene points are projected along parallel lines perpendicular to the viewing plane.'
    },
    {
      type: 'paragraph',
      textKo: '아래는 동일한 안락의자(Kroken) 모델을 직교 투영과 원근 투영으로 각각 렌더링하여 비교한 결과입니다. 직교 투영은 마치 공학 설계도면처럼 평행한 모서리들이 화면에서도 완벽히 평행을 유지합니다.',
      textEn: 'Below is a visual comparison between orthographic and perspective renderings of the Kroken armchair model.'
    },
    {
      type: 'figure',
      id: 'fig-kroken-ortho',
      number: 'Figure 5.5 (a)',
      title: 'Kroken Chair - Orthographic',
      titleKo: '직교 투영(Orthographic)으로 렌더링된 안락의자',
      src: '/books/pbrt-4ed/images/kroken-ortho.png',
      captionKo: '직교 투영 렌더링: 원근 왜곡이 없어 앞다리와 뒷다리의 실제 축척 비율이 그대로 보존됩니다.',
      captionEn: 'Orthographic rendering of the Kroken chair: parallel lines remain parallel with no foreshortening.'
    },
    {
      type: 'figure',
      id: 'fig-kroken-persp',
      number: 'Figure 5.5 (b)',
      title: 'Kroken Chair - Perspective',
      titleKo: '원근 투영(Perspective)으로 렌더링된 안락의자',
      src: '/books/pbrt-4ed/images/kroken-perspective.png',
      captionKo: '원근 투영 렌더링: 가까운 앞쪽 팔걸이는 크게 보이고 멀리 있는 등받이는 작아지는 친숙한 원근감이 형성됩니다.',
      captionEn: 'Perspective rendering: distant elements appear smaller, creating natural depth perception.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '원근 투영 카메라 (Perspective Camera)와 투영 나눗셈',
      titleEn: 'Perspective Camera and Perspective Divide'
    },
    {
      type: 'paragraph',
      textKo: '원근 카메라는 인간의 눈망울이나 핀홀 카메라처럼 모든 광선이 중심점(투영 중심, Center of Projection)을 향해 모여듭니다. 평행한 철길 선로가 저 멀리 지평선의 한 점(**소실점, Vanishing Point**)으로 모여 보이는 시각 현상이 바로 여기서 나타납니다.',
      textEn: 'The perspective camera models the human eye and pinhole cameras, where all viewing rays converge at a single center of projection. Parallel lines in 3D converge to vanishing points on the horizon.'
    },
    {
      type: 'figure',
      id: 'fig-persp-lines',
      number: 'Figure 5.6',
      title: 'Perspective Vanishing Lines',
      titleKo: '원근 투영과 소실점의 형성',
      src: '/books/pbrt-4ed/images/pha05f05.svg',
      captionKo: '3차원 공간에서 평행하게 뻗어나가는 선들이 시점 중심을 통해 뷰 평면에 맺힐 때 하나의 소실점으로 수렴합니다.',
      captionEn: 'Parallel lines in 3D space project onto the view plane converging toward a vanishing point.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '4x4 행렬의 기적: 투영 나눗셈 (Perspective Divide)',
      summary: '어떻게 덧셈과 곱셈만 하는 행렬 연산으로 나눗셈($1/z$)을 해낼까요?',
      points: [
        {
          title: '동차좌표계의 마지막 성분 w',
          content: '3D 그래픽스에서는 3차원 점 $(x, y, z)$에 1을 덧붙여 4차원 벡터 $[x, y, z, 1]^T$로 표현합니다. 원근 투영 행렬은 영리하게도 행렬의 마지막 4행을 $[0, 0, 1, 0]$으로 설계하여, 결과 벡터의 $w\'$ 자리에 원본 깊이인 $z$ 값이 들어가도록 만듭니다.'
        },
        {
          title: 'w\'로 나누는 순간 마법이 시작된다',
          content: '하드웨어나 소프트웨어가 4D 벡터를 다시 3D 점으로 정규화할 때 $[x\'/w\', y\'/w\', z\'/w\']^T$ 연산을 수행합니다. $w\' = z$이므로 모든 좌표가 $z$로 나누어집니다! 즉, $z$(깊이)가 2배 멀어지면 화면 상의 크기 $x/z, y/z$는 정확히 절반으로 줄어들어 완벽한 원근감이 완성됩니다.'
        }
      ]
    },
    {
      type: 'figure',
      id: 'fig-persp-matrix',
      number: 'Figure 5.7',
      title: 'Perspective Matrix Projection',
      titleKo: '원근 변환 행렬과 근평면으로의 사상',
      src: '/books/pbrt-4ed/images/pha05f06.svg',
      captionKo: '원근 변환 행렬은 카메라 공간의 시야각(FOV) 절두체(Frustum)를 정규화된 큐브 공간으로 사상합니다.',
      captionEn: 'The perspective projection matrix maps the viewing frustum onto canonical clip coordinates.'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt에서 원근 투영 변환 행렬은 화각(FOV)과 근평면($z_{\\text{near}}$), 원평면($z_{\\text{far}}$)을 받아 다음과 같이 계산됩니다:',
      textEn: 'In pbrt, the perspective projection matrix is defined using the field of view (FOV), near plane, and far plane distances:'
    },
    {
      type: 'code',
      chunkName: '<<Perspective Matrix Computation>>=',
      language: 'cpp',
      code: `Transform Perspective(Float fov, Float zNear, Float zFar) {
    // 1. 투영 나눗셈을 위한 기본 원근 행렬
    Matrix4x4 persp(1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, zFar / (zFar - zNear), -zFar * zNear / (zFar - zNear),
                    0, 0, 1, 0);
    // 2. 화각(FOV)에 따른 스케일 정규화
    Float invTan = 1.0f / std::tan(Radians(fov) / 2.0f);
    return Scale(invTan, invTan, 1) * Transform(persp);
}`,
      explanationKo: 'z 값이 zNear에서 zFar 사이일 때, 변환된 z 좌표는 [0, 1] 범위로 매핑되어 깊이 버퍼(Z-Buffer) 검사에 사용됩니다.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '얇은 렌즈 모델과 피사계 심도 (Depth of Field & Bokeh)',
      titleEn: 'Thin Lens Model and Depth of Field'
    },
    {
      type: 'paragraph',
      textKo: '이상적인 핀홀 카메라는 무한히 작은 바늘구멍을 통해 광선을 모으므로, 1cm 앞의 손가락부터 수 킬로미터 뒤의 산봉우리까지 **모든 거리가 선명(Infinite Depth of Field)**하게 찍힙니다. 하지만 실제 카메라는 충분한 빛을 받아들이기 위해 지름이 수 센티미터에 달하는 유리 렌즈(조리개)를 사용합니다. 이로 인해 특정 초점 거리(Focal Plane)에 있는 물체만 선명하게 맺히고, 앞뒤의 물체는 둥글게 번지는 **피사계 심도(Depth of Field)**와 **보케(Bokeh)**가 발생합니다.',
      textEn: 'An ideal pinhole camera has an infinitesimally small aperture, resulting in infinite depth of field where everything is sharply in focus. Real cameras, however, require finite lens apertures to collect sufficient light. This leads to depth of field and beautiful bokeh blur for out-of-focus objects.'
    },
    {
      type: 'figure',
      id: 'fig-thin-lens-basics',
      number: 'Figure 5.8',
      title: 'Thin Lens Optics',
      titleKo: '얇은 렌즈의 광학적 기하 구조',
      src: '/books/pbrt-4ed/images/pha05f08.svg',
      captionKo: '두께를 무시할 수 있는 얇은 렌즈를 통과하는 광선의 굴절 경로. 렌즈 중심을 통과하는 광선은 꺾이지 않고 직진합니다.',
      captionEn: 'Refraction of light rays through a thin lens. Rays passing through the center of the lens continue without deviation.'
    },
    {
      type: 'paragraph',
      textKo: '얇은 렌즈의 초점 관계는 유명한 **가우스 렌즈 방정식(Gaussian Lens Equation)**을 따릅니다:',
      textEn: 'The optical imaging relationship of a thin lens is governed by the Gaussian lens equation:'
    },
    {
      type: 'equation',
      tex: '\\frac{1}{z} + \\frac{1}{z\'} = \\frac{1}{f}',
      explanationKo: '$z$는 렌즈 앞 물체까지의 거리, $z\'$는 렌즈 뒤 센서/필름까지의 상 거리, $f$는 렌즈 고유의 초점거리(Focal Length)입니다.'
    },
    {
      type: 'figure',
      id: 'fig-circle-of-confusion',
      number: 'Figure 5.9',
      title: 'Circle of Confusion Geometry',
      titleKo: '초점면을 벗어난 빛이 만드는 착란원(CoC) 기하 구조',
      src: '/books/pbrt-4ed/images/pha05f12.svg',
      captionKo: '초점거리 $z_f$에 놓이지 않은 물체에서 나온 빛은 센서 면에 하나의 점이 아닌 유한한 직경 $d_c$를 갖는 원판(착란원) 형태로 퍼져 맺힙니다.',
      captionEn: 'Points not on the focal plane project onto the film as a blur circle of diameter d_c (circle of confusion).'
    },
    {
      type: 'paragraph',
      textKo: '초점면($z_f$)에서 벗어난 점이 센서 평면에 맺히는 흐림의 직경인 **착란원(Circle of Confusion, $d_c$)**의 크기는 렌즈의 구경 지름 $d_l$과 닮음비에 의해 유도됩니다:',
      textEn: 'The diameter of the circle of confusion d_c on the sensor plane can be expressed in terms of the lens diameter d_l:'
    },
    {
      type: 'equation',
      tex: 'd_c = \\left| d_l \\frac{z - z_f}{z} \\frac{f}{z_f - f} \\right|',
      explanationKo: '렌즈 구경 $d_l$이 클수록, 그리고 물체가 초점면 $z_f$로부터 멀어질수록 착란원의 크기 $d_c$가 급격히 커져 배경 흐림이 강해집니다.'
    },
    {
      type: 'figure',
      id: 'fig-coc-graph',
      number: 'Figure 5.10',
      title: 'Circle of Confusion vs Depth',
      titleKo: '물체 거리(깊이)에 따른 착란원 직경의 비대칭적 증가 곡선',
      src: '/books/pbrt-4ed/images/pha05f13.svg',
      captionKo: '초점면(1m) 앞쪽의 가까운 물체는 착란원이 매우 가파르게 커지고(극심한 아웃포커싱), 뒤쪽의 먼 물체는 점근적으로 수렴하는 비대칭 특성을 보여줍니다.',
      captionEn: 'Circle of confusion diameter plotted against object depth, showing asymmetric defocus blur around the 1m focal plane.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '조리개 크기에 따른 피사계 심도 렌더링 비교',
      titleEn: 'Visual Comparison: Aperture and Depth of Field'
    },
    {
      type: 'paragraph',
      textKo: '아래 렌더링 사진은 동일한 정물(수채화 도구) 씬에서 렌즈 조리개 구경의 크기를 조절했을 때의 시각적 차이를 보여줍니다. 연필통이 놓인 중앙 초점면은 선명함을 유지하지만, 조리개를 열수록 앞쪽 붓과 뒤쪽 캔버스가 부드럽게 뭉개집니다.',
      textEn: 'The images below demonstrate depth of field in the Watercolor scene. As the aperture diameter increases, out-of-focus objects blur while the central pencil cup remains crisp.'
    },
    {
      type: 'figure',
      id: 'fig-watercolor-dof0',
      number: 'Figure 5.11 (a)',
      title: 'Watercolor Scene - Pinhole (No Defocus)',
      titleKo: '핀홀 카메라 ($d_l = 0$, 무한 초점심도)',
      src: '/books/pbrt-4ed/images/watercolor-dof-0.png',
      captionKo: '조리개 구경이 0인 이상적인 핀홀 카메라. 앞의 물감부터 맨 뒤의 벽면까지 모든 오브젝트가 칼같이 선명합니다.',
      captionEn: 'Zero aperture (ideal pinhole): infinite depth of field with sharp focus throughout.'
    },
    {
      type: 'figure',
      id: 'fig-watercolor-dof1',
      number: 'Figure 5.11 (b)',
      title: 'Watercolor Scene - Moderate Aperture',
      titleKo: '중간 조리개 구경 (자연스러운 심도)',
      src: '/books/pbrt-4ed/images/watercolor-dof-1.png',
      captionKo: '조리개를 적당히 개방한 모습. 중심 연필통에 시선이 집중되고 배경이 자연스럽게 흐려집니다.',
      captionEn: 'Moderate aperture: shallow depth of field begins to isolate the central subject.'
    },
    {
      type: 'figure',
      id: 'fig-watercolor-dof28',
      number: 'Figure 5.11 (c)',
      title: 'Watercolor Scene - Large Aperture (Strong Bokeh)',
      titleKo: '대구경 조리개 개방 (극적인 보케 효과)',
      src: '/books/pbrt-4ed/images/watercolor-dof-2.8.png',
      captionKo: '조리개를 최대로 개방했을 때. 초점면 밖의 피사체들이 몽환적인 원형 보케(Bokeh) 형태로 번집니다.',
      captionEn: 'Wide-open aperture: extreme shallow depth of field with dramatic soft bokeh.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '레이 트레이서에서의 얇은 렌즈 광선 생성 알고리즘',
      titleEn: 'Ray Generation for Thin Lens'
    },
    {
      type: 'figure',
      id: 'fig-thin-lens-raygen',
      number: 'Figure 5.12',
      title: 'Ray Generation with Thin Lens',
      titleKo: '얇은 렌즈 모델에서의 광선 생성 원리',
      src: '/books/pbrt-4ed/images/pha05f14.svg',
      captionKo: '렌즈 디스크 표면의 임의의 점 $p_{\\text{lens}}$에서 출발한 광선이, 핀홀 광선이 초점면과 만나는 목표 지점 $p_{\\text{focus}}$를 관통하도록 방향을 설정합니다.',
      captionEn: 'Ray tracing with a thin lens: a ray starts at a sampled lens point and passes through the focal plane intersection point.'
    },
    {
      type: 'code',
      chunkName: '<<PerspectiveCamera::GenerateRay with Thin Lens>>=',
      language: 'cpp',
      code: `// 1. 핀홀 모델로 초점면 위의 수렴 목표점(pFocus) 계산
Point3f pCamera = cameraFromRaster(sample.pFilm);
Ray ray(Point3f(0, 0, 0), Normalize(Vector3f(pCamera)));

if (lensRadius > 0) {
    // 2. 렌즈 원판(Disk) 표면 상의 균일 난수 샘플링
    Point2f pLens = lensRadius * SampleUniformDiskConcentric(sample.pLens);

    // 3. 광선이 초점 평면(z = focalDistance)과 교차하는 점 계산
    Float ft = focalDistance / ray.d.z;
    Point3f pFocus = ray(ft);

    // 4. 광선 원점을 렌즈 위의 점으로 변경하고, 방향을 pFocus를 향하도록 재설정
    ray.o = Point3f(pLens.x, pLens.y, 0);
    ray.d = Normalize(pFocus - ray.o);
}`,
      explanationKo: '놀랍도록 단순하면서도 강력한 기법입니다! 렌즈 위의 무작위 점에서 출발한 모든 광선이 초점면의 동일한 점 pFocus로 수렴하므로, 초점면에 있는 물체는 항상 선명하고 초점면 밖의 물체는 샘플 광선들이 분산되며 자연스럽게 아웃포커싱됩니다.'
    },
    {
      type: 'figure',
      id: 'fig-landscape-dof',
      number: 'Figure 5.13',
      title: 'Landscape Defocus Blur',
      titleKo: '대자연 풍경 씬의 피사계 심도 (2048 spp)',
      src: '/books/pbrt-4ed/images/landscape-dof.png',
      captionKo: '얇은 렌즈 모델을 사용하여 중앙 풀숲에 초점을 맞추고 배경 산맥을 부드럽게 흐리게 렌더링한 최종 고품질 결과물.',
      captionEn: 'Landscape scene rendered with thin lens depth of field, focusing on foreground vegetation.'
    }
  ]
};
