import { SectionContent } from '../../../../types/book';

export const CH05_01_CAMERA_INTERFACE: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '5',
  chapterTitleKo: '제5장 가상 카메라와 필름 (Cameras and Film)',
  sectionNumber: '5.1',
  sectionTitle: 'Camera Interface',
  sectionTitleKo: '5.1 카메라 인터페이스 설계 (Camera Interface)',
  originalUrl: 'https://pbr-book.org/4ed/Cameras_and_Film/Camera_Interface.html',
  prevSection: {
    id: 'ch04-06',
    title: '4.6 인간의 시각과 RGB/XYZ 색 공간',
  },
  nextSection: {
    id: 'ch05-02',
    title: '5.2 투영 카메라 모델 (원근 투영과 피사계 심도)',
  },
  summary: {
    keyTakeaways: [
      '가상 카메라는 필름 상의 2차원 픽셀 샘플 좌표, 노출 시간, 렌즈 표면의 샘플 점을 입력받아 3차원 공간으로 날아가는 광선(Ray)을 생성하는 핵심 모듈입니다.',
      '광선 미분(Ray Differential)은 인접 픽셀로 1픽셀 이동했을 때 광선 원점과 방향의 변화율을 함께 추적함으로써, 텍스처 필터링(Mipmap)에서 표면 샘플링 풋프린트를 계산하고 앨리어싱(지글거림)을 완벽히 방지합니다.',
      'pbrt-v4는 대규모 씬에서 부동소수점 정밀도 손실(Float32 Cancellation)로 인해 발생하는 메시 찢어짐과 표면 지글거림(Acne)을 방지하기 위해, 카메라 위치를 원점으로 삼는 **카메라-월드 렌더링 좌표계(Camera-World Space)**를 도입했습니다.',
      '카메라의 움직임(모션 블러)은 셔터 열림 시간($t_{\\text{open}}$)과 닫힘 시간($t_{\\text{close}}$) 사이의 좌표 변환 행렬을 시간에 따라 보간함으로써 자연스럽게 시뮬레이션됩니다.'
    ],
    prerequisites: [
      '3차원 좌표계 변환 행렬 (Matrix Transformation: Scale, Rotate, Translate)',
      '광선(Ray)의 기본 정의 (원점 $o$와 정규화된 방향 벡터 $d$)',
      'IEEE 754 단정밀도 부동소수점(float32)의 정밀도 한계'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '5.1 카메라 인터페이스의 기본 역할',
      titleEn: '5.1 Camera Interface'
    },
    {
      type: 'paragraph',
      textKo: '물리기반 렌더링에서 카메라의 가장 본질적인 역할은 **필름 위의 한 지점에 대응하는 공간 속의 광선(Ray)을 생성하는 것**입니다. 제1장에서 살펴보았듯이, 광선 추적기는 픽셀 영역 내부의 특정 위치를 샘플링한 뒤 그 점을 통과하여 3차원 씬으로 나아가는 광선을 쏘아 보냅니다. 이 광선이 씬 속의 물체들과 부딪히며 빛을 모아오면, 그 결과로 얻어진 방사휘도(Radiance)를 필름 센서에 기록하여 최종 이미지를 합성합니다.',
      textEn: 'In physically based rendering, the fundamental task of a camera is to generate rays into the scene that correspond to points on the film. As described in Chapter 1, a ray tracer samples locations within pixels and shoots rays through those points into the scene. The radiance carried back along these rays is then recorded on the film to produce the final image.'
    },
    {
      type: 'paragraph',
      textKo: '하지만 실제 사진 카메라는 단순히 한 점에서 사방으로 직선을 긋는 이상적인 핀홀(Pinhole)에 그치지 않습니다. 셔터가 열려 있는 시간 동안 카메라가 이동하면 **모션 블러(Motion Blur)**가 발생하고, 렌즈의 구경(Aperture) 크기에 따라 초점이 맞지 않는 배경이 부드럽게 번지는 **피사계 심도(Depth of Field / Bokeh)**가 나타납니다. 따라서 pbrt의 카메라 인터페이스는 2차원 필름 좌표뿐만 아니라 시간과 렌즈 상의 샘플링 위치까지 포괄하는 일반화된 설계를 갖추고 있습니다.',
      textEn: 'However, real cameras are far more sophisticated than simple pinholes. Moving cameras produce motion blur during the time the shutter is open, and lens apertures produce depth of field effects where out-of-focus regions are blurred. PBRT’s camera interface therefore accepts multidimensional samples encompassing film position, time, and lens coordinates.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '카메라의 마법: 2D 화면에서 3D 세상으로 역방향 광선 쏘기',
      summary: '왜 카메라는 빛을 "받는" 장치인데 그래픽스에서는 카메라에서 빛을 "쏠"까요?',
      points: [
        {
          title: '현실의 카메라 vs 컴퓨터의 레이 트레이싱',
          content: '현실에서는 태양이나 전등에서 나온 수억 개의 광자 중 극히 일부가 우연히 카메라 렌즈 안으로 들어옵니다. 컴퓨터가 이 방식을 그대로 시뮬레이션(전방향 추적)하면 99.999%의 광선이 카메라에 닿지도 못하고 버려져 엄청난 연산 낭비가 발생합니다.'
        },
        {
          title: '광학적 가역성(Reciprocity)의 천재적 활용',
          content: '빛의 경로는 역방향으로 추적해도 물리 법칙이 완전히 동일합니다! 그래서 컴퓨터는 화면의 픽셀(Film)에서 시작하여 거꾸로 카메라 렌즈를 거쳐 3D 공간의 물체와 광원을 향해 광선(Eye Ray)을 발사합니다. 이 과정을 담당하는 출발점이 바로 `Camera` 인터페이스입니다.'
        }
      ]
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '카메라 샘플링 구조체 (CameraSample)',
      titleEn: 'CameraSample Structure'
    },
    {
      type: 'paragraph',
      textKo: '카메라가 광선을 하나 생성하기 위해서는 여러 차원의 무작위 난수 샘플이 필요합니다. pbrt는 이를 `CameraSample` 구조체로 깔끔하게 묶어서 전달합니다.',
      textEn: 'To generate a ray, the camera requires several sample values, which are packaged into the CameraSample structure.'
    },
    {
      type: 'code',
      chunkName: '<<CameraSample Definition>>=',
      language: 'cpp',
      code: `struct CameraSample {
    Point2f pFilm;      // 필름 상의 연속적 픽셀 샘플 위치 (예: [120.4, 305.8])
    Point2f pLens;      // 렌즈 표면 상의 2D 샘플 점 [0, 1)^2 (피사계 심도용)
    Float time = 0;     // 셔터가 열려 있는 동안의 정규화된 시간 [0, 1) (모션 블러용)
    Float filterWeight = 1; // 픽셀 재구성 필터 가중치
};`,
      explanationKo: 'pFilm은 정수 픽셀 좌표가 아닌 부동소수점 연속 좌표입니다. 픽셀 내부에 난수를 주어 슈퍼샘플링(안티앨리어싱)을 수행합니다. pLens는 렌즈 디스크 위의 샘플링 점을 지정하며, time은 셔터 개폐 사이의 시간을 나타냅니다.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '광선 미분 (CameraRayDifferential)과 텍스처 안티앨리어싱',
      titleEn: 'CameraRayDifferential and Texture Filtering'
    },
    {
      type: 'paragraph',
      textKo: '카메라가 단순히 중심 광선 하나만 반환하면 렌더러는 물체 표면에 도달했을 때 그 픽셀이 표면에서 얼마나 넓은 면적을 차지하는지 알 수 없습니다. 표면 풋프린트(Footprint)를 모르면 텍스처를 읽어올 때 너무 좁은 영역을 읽어 체스판 무늬나 텍스처가 지글거리는 **앨리어싱(Aliasing)**이 발생합니다.',
      textEn: 'If the camera only returned a single ray, the renderer would not know how large an area on a surface a pixel covers. Without this surface footprint, texture filtering algorithms cannot choose the correct mipmap level, leading to severe aliasing artifacts.'
    },
    {
      type: 'paragraph',
      textKo: '이를 해결하기 위해 pbrt는 기본 광선 외에 $x$축과 $y$축 방향으로 각각 1픽셀씩 이동했을 때 생성되는 보조 광선들의 정보를 담는 `CameraRayDifferential`을 사용합니다.',
      textEn: 'To address this, pbrt uses CameraRayDifferential, which augments the main ray with auxiliary rays shifted by one pixel in the x and y directions on the film plane.'
    },
    {
      type: 'code',
      chunkName: '<<CameraRay and CameraRayDifferential>>=',
      language: 'cpp',
      code: `struct CameraRay {
    Ray ray;            // 씬으로 방출되는 주 광선 (Main Ray)
    Float weight = 1;   // 렌즈의 비네팅이나 기하학적 코사인 감쇠 가중치
};

struct CameraRayDifferential : public CameraRay {
    RayDifferential ray; // rxOrigin, rxDirection, ryOrigin, ryDirection 포함
};`,
      explanationKo: 'RayDifferential은 주 광선의 (rxOrigin, rxDirection), (ryOrigin, ryDirection)을 함께 유지하여, 광선이 반사되거나 굴절될 때도 광선 다발의 퍼짐 정도를 수학적으로 정확하게 추적할 수 있도록 합니다.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '좌표계와 혁신적인 카메라-월드 렌더링 공간 (Camera-World Space)',
      titleEn: 'Coordinate Systems and Camera-World Rendering'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt-v4에서 가장 주목할 만한 시스템 설계 개선 중 하나는 **렌더링 좌표계의 혁신**입니다. 3D 그래픽스에서 모든 지오메트리는 일반적으로 월드 좌표계(World Space)를 기준으로 정의됩니다. 그러나 씬의 크기가 매우 거대하거나(예: 광활한 야외 풍경, 우주선 내부, 원점에서 수 킬로미터 떨어진 건물 단지) 카메라가 원점 $(0,0,0)$에서 수십만 유닛 떨어진 곳에 위치하는 경우 심각한 정밀도 재앙이 일어납니다.',
      textEn: 'One of the most notable architectural innovations in pbrt-v4 is the redesign of rendering coordinate systems. In computer graphics, scene geometry is traditionally represented in world space. However, when the scene is vast or the camera is placed far from the origin, standard 32-bit floating point precision breaks down completely.'
    },
    {
      type: 'concept-tip',
      badge: '⚠️ 부동소수점 참사 방지',
      title: '원점에서 1,000,000 유닛 떨어진 곳에서 벌어지는 비극',
      summary: 'IEEE 754 float32는 큰 수 주변에서 듬성듬성해집니다!',
      points: [
        {
          title: '가수부 24비트의 한계',
          content: 'float32는 약 7자리의 십진수 유효숫자만을 저장할 수 있습니다. 물체 좌표가 $x = 1,000,000$ (100만) 수준이 되면, 숫자의 최소 표현 간격(ULP)이 약 $0.0625$까지 벌어집니다! 즉, 밀리미터 단위의 섬세한 메시 굴곡이 부동소수점 오차로 뭉개집니다.'
        },
        {
          title: '결과: 메시 찢어짐과 셀프 섀도우 지글거림(Acne)',
          content: '삼각형 정점들이 지진이 난 것처럼 떨리고(Jitter), 광선이 표면과 교차할 때 부동소수점 반올림 오차로 인해 자기 자신과 잘못 충돌하여 시커먼 노이즈 얼룩(Shadow Acne)이 온 화면을 뒤덮습니다.'
        }
      ]
    },
    {
      type: 'paragraph',
      textKo: '아래 렌더링 결과는 스포츠카 모델을 원점 근처에 두었을 때와, 원점에서 1,000,000 유닛 떨어진 곳으로 옮긴 뒤 기존 월드 공간에서 렌더링했을 때의 비극적인 차이를 보여줍니다.',
      textEn: 'The images below demonstrate the severe artifacts that occur when a sports car is placed 1,000,000 units from the origin and rendered in standard world space, versus when rendered in camera-world space.'
    },
    {
      type: 'figure',
      id: 'fig-sportscar-precision',
      number: 'Figure 5.1',
      title: 'Floating-Point Precision Comparison',
      titleKo: '부동소수점 정밀도 한계와 렌더링 좌표계 비교',
      src: '/books/pbrt-4ed/images/sportscar-1m-world.png',
      captionKo: '원점 $(0,0,0)$에서 100만 유닛 떨어진 위치에서 기존 월드 공간으로 렌더링한 모습. float32 정밀도 부족으로 차체 표면에 심각한 지글거림과 검은 섀도우 여드름(Acne) 아티팩트가 가득합니다.',
      captionEn: 'Rendering a sports car 1,000,000 units from the origin in world space leads to severe self-intersection acne and jagged geometry due to limited 32-bit float precision.'
    },
    {
      type: 'figure',
      id: 'fig-sportscar-cameraworld',
      number: 'Figure 5.2',
      title: 'Camera-World Rendering Solution',
      titleKo: '카메라-월드 좌표계 도입 후 완벽히 복원된 렌더링',
      src: '/books/pbrt-4ed/images/sportscar-1m-cameraworld.png',
      captionKo: 'pbrt-v4의 카메라-월드 좌표계를 적용한 결과. 카메라가 원점 100만 유닛 떨어진 곳에 있어도 렌더링 연산 공간의 중심을 카메라 위치로 평행이동시킴으로써 오차를 완벽히 제거했습니다.',
      captionEn: 'Rendering in camera-world space: by translating the render space origin to the camera position, full float precision is preserved even in massive coordinates.'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt-v4는 이 문제를 해결하기 위해 `worldFromRender` 변환을 도입했습니다. 카메라가 어디에 있든, 프레임 셔터의 정중앙 시점에서 카메라의 위치 $\\mathbf{p}_{\\text{cam}}$을 찾아 다음과 같이 렌더링 좌표계의 원점을 카메라 위치로 이동시킵니다:',
      textEn: 'pbrt-v4 solves this by defining a worldFromRender transformation. Regardless of where the camera is in world space, the render coordinate system is translated to the camera position at the midpoint of the shutter interval:'
    },
    {
      type: 'equation',
      tex: '\\text{worldFromRender} = \\text{Translate}(\\mathbf{p}_{\\text{cam}})',
      explanationKo: '렌더링 공간(Render Space)의 원점 $(0,0,0)$이 카메라의 눈 위치와 일치하게 되므로, 카메라 근처의 모든 물체 좌표가 매우 작은 숫자가 되어 float32의 풍부한 소수점 정밀도를 100% 누릴 수 있습니다.'
    },
    {
      type: 'code',
      chunkName: '<<Compute worldFromRender transformation>>=',
      language: 'cpp',
      code: `// 프레임 중앙 시점(t = 0.5)에서의 카메라 위치 추출
Point3f pCamera = worldFromCamera(Point3f(0, 0, 0), 0.5f);
worldFromRender = Translate(Vector3f(pCamera));
renderFromWorld = Inverse(worldFromRender);
renderFromCamera = renderFromWorld * worldFromCamera;`,
      explanationKo: '모든 BVH 가속 구조와 광선 교차 검사는 renderFromWorld로 변환된 렌더 공간에서 이루어집니다. 따라서 float32 연산만으로도 수백만 광년 떨어진 우주선부터 밀리미터 단위의 볼트 너트까지 결함 없이 렌더링할 수 있습니다.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: 'CameraBase 기본 클래스와 가상 인터페이스',
      titleEn: 'CameraBase and Camera Interface'
    },
    {
      type: 'paragraph',
      textKo: '모든 구체적인 카메라 모델(직교 카메라, 원근 카메라, 구면 카메라 등)은 `CameraBase` 공통 클래스로부터 유용한 기능을 상속받으며, `Camera` 인터페이스를 통해 다형적으로 호출됩니다.',
      textEn: 'All specific camera implementations inherit from CameraBase and implement the methods required by the polymorphic Camera interface.'
    },
    {
      type: 'code',
      chunkName: '<<Camera Interface Declarations>>=',
      language: 'cpp',
      code: `class Camera : public TaggedPointer<PerspectiveCamera,
                                      OrthographicCamera,
                                      SphericalCamera> {
  public:
    using TaggedPointer::TaggedPointer;

    // 주어진 카메라 샘플로부터 광선과 가중치를 생성
    pbrt::optional<CameraRay> GenerateRay(CameraSample sample,
                                          SampledWavelengths &lambda) const;

    // 광선 미분을 포함한 확장 광선 생성 (텍스처 안티앨리어싱용)
    pbrt::optional<CameraRayDifferential> GenerateRayDifferential(
        CameraSample sample, SampledWavelengths &lambda) const;

    // 연결된 필름(Film) 객체 반환
    Film GetFilm() const;

    // 파장(Wavelength) 샘플링
    SampledWavelengths SampleWavelengths(Float u) const;
};`,
      explanationKo: 'pbrt-v4는 가상 함수 테이블(vtable)의 캐시 미스를 방지하고 GPU 셰이더 컴파일을 최적화하기 위해 C++20 TaggedPointer 패턴을 사용합니다. 이를 통해 컴파일 타임에 분기 최적화가 이루어집니다.'
    }
  ]
};
