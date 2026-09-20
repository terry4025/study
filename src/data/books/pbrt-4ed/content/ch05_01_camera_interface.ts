import type { SectionContent } from '../../../../types/book';

export const CH05_01_CAMERA_INTERFACE: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "5",
  "chapterTitleKo": "제5장 가상 카메라와 필름 (Cameras and Film)",
  "sectionNumber": "5.1",
  "sectionTitle": "Camera Interface",
  "sectionTitleKo": "5.1 카메라 인터페이스 설계 (Camera Interface)",
  "originalUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Camera_Interface.html",
  "prevSection": {
    "id": "ch04-06",
    "title": "4.6 인간의 시각과 RGB/XYZ 색 공간"
  },
  "nextSection": {
    "id": "ch05-02",
    "title": "5.2 투영 카메라 모델 (원근 투영과 피사계 심도)"
  },
  "summary": {
    "keyTakeaways": [
      "가상 카메라는 필름 상의 2차원 픽셀 샘플 좌표, 노출 시간, 렌즈 표면의 샘플 점을 입력받아 3차원 공간으로 날아가는 광선(Ray)을 생성하는 핵심 모듈입니다.",
      "광선 미분은 화면에서 가까운 위치의 광선 변화를 이용해 텍스처 필터 영역을 근사합니다. 모든 앨리어싱을 완전히 방지하지는 않습니다.",
      "pbrt-v4는 대규모 씬에서 부동소수점 정밀도 손실(Float32 Cancellation)로 인해 발생하는 메시 찢어짐과 표면 지글거림(Acne)을 방지하기 위해, 카메라 위치를 원점으로 삼는 **카메라-월드 렌더링 좌표계(Camera-World Space)**를 도입했습니다.",
      "카메라의 움직임은 장면의 평가 시각에 따라 AnimatedTransform을 계산해 모델링합니다. 일반적으로 행렬 원소를 직접 선형 보간하는 것과 같지 않습니다."
    ],
    "prerequisites": [
      "3차원 좌표계 변환 행렬 (Matrix Transformation: Scale, Rotate, Translate)",
      "광선(Ray)의 기본 정의 (원점 $o$와 정규화된 방향 벡터 $d$)",
      "IEEE 754 단정밀도 부동소수점(float32)의 정밀도 한계"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "5.1 카메라 인터페이스의 기본 역할",
      "titleEn": "5.1 Camera Interface",
      "id": "ch05-01-b1"
    },
    {
      "type": "paragraph",
      "textKo": "물리기반 렌더링에서 카메라의 가장 본질적인 역할은 **필름 위의 한 지점에 대응하는 공간 속의 광선(Ray)을 생성하는 것**입니다. 제1장에서 살펴보았듯이, 광선 추적기는 픽셀 영역 내부의 특정 위치를 샘플링한 뒤 그 점을 통과하여 3차원 씬으로 나아가는 광선을 쏘아 보냅니다. 이 광선이 씬 속의 물체들과 부딪히며 빛을 모아오면, 그 결과로 얻어진 방사휘도(Radiance)를 필름 센서에 기록하여 최종 이미지를 합성합니다.",
      "textEn": "In physically based rendering, the fundamental task of a camera is to generate rays into the scene that correspond to points on the film. As described in Chapter 1, a ray tracer samples locations within pixels and shoots rays through those points into the scene. The radiance carried back along these rays is then recorded on the film to produce the final image.",
      "id": "ch05-01-b2"
    },
    {
      "type": "paragraph",
      "textKo": "하지만 실제 사진 카메라는 단순히 한 점에서 사방으로 직선을 긋는 이상적인 핀홀(Pinhole)에 그치지 않습니다. 셔터가 열려 있는 시간 동안 카메라가 이동하면 **모션 블러(Motion Blur)**가 발생하고, 렌즈의 구경(Aperture) 크기에 따라 초점이 맞지 않는 배경이 부드럽게 번지는 **피사계 심도(Depth of Field / Bokeh)**가 나타납니다. 따라서 pbrt의 카메라 인터페이스는 2차원 필름 좌표뿐만 아니라 시간과 렌즈 상의 샘플링 위치까지 포괄하는 일반화된 설계를 갖추고 있습니다.",
      "textEn": "However, real cameras are far more sophisticated than simple pinholes. Moving cameras produce motion blur during the time the shutter is open, and lens apertures produce depth of field effects where out-of-focus regions are blurred. PBRT’s camera interface therefore accepts multidimensional samples encompassing film position, time, and lens coordinates.",
      "id": "ch05-01-b3"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "카메라에서 시작해 픽셀에 기여할 경로를 찾습니다",
      "summary": "카메라에서 시작해 픽셀에 기여할 경로를 찾습니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "카메라 광선은 실제 카메라가 빛을 발사한다는 뜻이 아니라, 픽셀에 도착하는 빛의 경로를 계산하기 위한 표본입니다. 광원에서 시작하는 방법도 가능하며, 방향을 바꾼다고 샘플링 확률과 굴절 시 척도 변환까지 저절로 맞는 것은 아닙니다."
        }
      ],
      "id": "ch05-01-b4"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "카메라 샘플링 구조체 (CameraSample)",
      "titleEn": "CameraSample Structure",
      "id": "ch05-01-b5"
    },
    {
      "type": "paragraph",
      "textKo": "카메라가 광선을 하나 생성하기 위해서는 여러 차원의 무작위 난수 샘플이 필요합니다. pbrt는 이를 `CameraSample` 구조체로 깔끔하게 묶어서 전달합니다.",
      "textEn": "To generate a ray, the camera requires several sample values, which are packaged into the CameraSample structure.",
      "id": "ch05-01-b6"
    },
    {
      "type": "code",
      "chunkName": "<<CameraSample Definition>>=",
      "language": "cpp",
      "code": "struct CameraSample {\n    Point2f pFilm;      // 필름 상의 연속적 픽셀 샘플 위치 (예: [120.4, 305.8])\n    Point2f pLens;      // 렌즈 표면 상의 2D 샘플 점 [0, 1)^2 (피사계 심도용)\n    Float time = 0;     // 셔터가 열려 있는 동안의 정규화된 시간 [0, 1) (모션 블러용)\n    Float filterWeight = 1; // 픽셀 재구성 필터 가중치\n};",
      "explanationKo": "pFilm은 정수 픽셀 좌표가 아닌 부동소수점 연속 좌표입니다. 픽셀 내부에 난수를 주어 슈퍼샘플링(안티앨리어싱)을 수행합니다. pLens는 렌즈 디스크 위의 샘플링 점을 지정하며, time은 셔터 개폐 사이의 시간을 나타냅니다.",
      "provenance": "teaching",
      "id": "ch05-01-b7"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "광선 미분 (CameraRayDifferential)과 텍스처 안티앨리어싱",
      "titleEn": "CameraRayDifferential and Texture Filtering",
      "id": "ch05-01-b8"
    },
    {
      "type": "paragraph",
      "textKo": "카메라가 단순히 중심 광선 하나만 반환하면 렌더러는 물체 표면에 도달했을 때 그 픽셀이 표면에서 얼마나 넓은 면적을 차지하는지 알 수 없습니다. 표면 풋프린트(Footprint)를 모르면 텍스처를 읽어올 때 너무 좁은 영역을 읽어 체스판 무늬나 텍스처가 지글거리는 **앨리어싱(Aliasing)**이 발생합니다.",
      "textEn": "If the camera only returned a single ray, the renderer would not know how large an area on a surface a pixel covers. Without this surface footprint, texture filtering algorithms cannot choose the correct mipmap level, leading to severe aliasing artifacts.",
      "id": "ch05-01-b9"
    },
    {
      "type": "paragraph",
      "textKo": "이를 해결하기 위해 pbrt는 기본 광선 외에 $x$축과 $y$축 방향으로 각각 1픽셀씩 이동했을 때 생성되는 보조 광선들의 정보를 담는 `CameraRayDifferential`을 사용합니다.",
      "textEn": "To address this, pbrt uses CameraRayDifferential, which augments the main ray with auxiliary rays shifted by one pixel in the x and y directions on the film plane.",
      "id": "ch05-01-b10"
    },
    {
      "type": "code",
      "chunkName": "<<CameraRay and CameraRayDifferential>>=",
      "language": "cpp",
      "code": "struct CameraRay {\n    Ray ray;\n    SampledSpectrum weight = SampledSpectrum(1);\n};\nstruct CameraRayDifferential {\n    RayDifferential ray;\n    SampledSpectrum weight = SampledSpectrum(1);\n};",
      "explanationKo": "두 구조체는 상속 관계가 아닙니다. 각각 광선과 스펙트럼 가중치를 보관하며, 미분 광선은 가까운 광선의 변화를 근사합니다.",
      "provenance": "teaching",
      "id": "ch05-01-b11"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "좌표계와 혁신적인 카메라-월드 렌더링 공간 (Camera-World Space)",
      "titleEn": "Coordinate Systems and Camera-World Rendering",
      "id": "ch05-01-b12"
    },
    {
      "type": "paragraph",
      "textKo": "pbrt-v4에서 가장 주목할 만한 시스템 설계 개선 중 하나는 **렌더링 좌표계의 혁신**입니다. 3D 그래픽스에서 모든 지오메트리는 일반적으로 월드 좌표계(World Space)를 기준으로 정의됩니다. 그러나 씬의 크기가 매우 거대하거나(예: 광활한 야외 풍경, 우주선 내부, 원점에서 수 킬로미터 떨어진 건물 단지) 카메라가 원점 $(0,0,0)$에서 수십만 유닛 떨어진 곳에 위치하는 경우 심각한 정밀도 재앙이 일어납니다.",
      "textEn": "One of the most notable architectural innovations in pbrt-v4 is the redesign of rendering coordinate systems. In computer graphics, scene geometry is traditionally represented in world space. However, when the scene is vast or the camera is placed far from the origin, standard 32-bit floating point precision breaks down completely.",
      "id": "ch05-01-b13"
    },
    {
      "type": "concept-tip",
      "badge": "⚠️ 부동소수점 참사 방지",
      "title": "원점에서 1,000,000 유닛 떨어진 곳에서 벌어지는 비극",
      "summary": "IEEE 754 float32는 큰 수 주변에서 듬성듬성해집니다!",
      "points": [
        {
          "title": "가수부 24비트의 한계",
          "content": "float32는 약 7자리의 십진수 유효숫자만을 저장할 수 있습니다. 물체 좌표가 $x = 1,000,000$ (100만) 수준이 되면, 숫자의 최소 표현 간격(ULP)이 약 $0.0625$까지 벌어집니다! 즉, 밀리미터 단위의 섬세한 메시 굴곡이 부동소수점 오차로 뭉개집니다."
        },
        {
          "title": "결과: 메시 찢어짐과 셀프 섀도우 지글거림(Acne)",
          "content": "삼각형 정점들이 지진이 난 것처럼 떨리고(Jitter), 광선이 표면과 교차할 때 부동소수점 반올림 오차로 인해 자기 자신과 잘못 충돌하여 시커먼 노이즈 얼룩(Shadow Acne)이 온 화면을 뒤덮습니다."
        }
      ],
      "id": "ch05-01-b14"
    },
    {
      "type": "paragraph",
      "textKo": "아래 렌더링 결과는 스포츠카 모델을 원점 근처에 두었을 때와, 원점에서 1,000,000 유닛 떨어진 곳으로 옮긴 뒤 기존 월드 공간에서 렌더링했을 때의 비극적인 차이를 보여줍니다.",
      "textEn": "The images below demonstrate the severe artifacts that occur when a sports car is placed 1,000,000 units from the origin and rendered in standard world space, versus when rendered in camera-world space.",
      "id": "ch05-01-b15"
    },
    {
      "type": "figure",
      "id": "fig-sportscar-precision",
      "number": "Figure 5.1",
      "title": "Original Figure 5.1",
      "titleKo": "원문 그림 5.1",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-1.png",
      "captionKo": "그림 5.1 · 장면과 카메라를 원점에서 100만 단위 멀리 옮기면 세계 좌표의 부동소수점 정밀도가 부족해집니다. 카메라-월드 공간으로 계산하면 세부 형상을 더 잘 보존하지만 카메라 위치 자체의 표현 오차는 남을 수 있습니다. 모델 제공: Yasutoshi Mori.",
      "captionEn": "Figure 5.1: Effect of the Loss of Floating-Point Precision Far from the Origin. (a) As originally specified, this scene is within 10 units of the origin. Rendering the scene in world space produces the expected image. (b) If both the scene and the camera are translated 1,000,000 units from the origin and the scene is rendered in world space, there is significantly less floating-point precision to represent the scene, giving this poor result. (c) If the translated scene is rendered in camera-world space, much more precision is available and the geometric detail is preserved. However, the viewpoint has shifted slightly due to a loss of accuracy in the representation of the camera position. (Model courtesy of Yasutoshi Mori.)",
      "width": 998,
      "height": 530,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Camera_Interface.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "id": "fig-sportscar-cameraworld",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "textKo": "pbrt-v4는 이 문제를 해결하기 위해 `worldFromRender` 변환을 도입했습니다. 카메라가 어디에 있든, 프레임 셔터의 정중앙 시점에서 카메라의 위치 $\\mathbf{p}_{\\text{cam}}$을 찾아 다음과 같이 렌더링 좌표계의 원점을 카메라 위치로 이동시킵니다:",
      "textEn": "pbrt-v4 solves this by defining a worldFromRender transformation. Regardless of where the camera is in world space, the render coordinate system is translated to the camera position at the midpoint of the shutter interval:",
      "id": "ch05-01-b18"
    },
    {
      "type": "equation",
      "tex": "\\text{worldFromRender} = \\text{Translate}(\\mathbf{p}_{\\text{cam}})",
      "explanationKo": "렌더링 공간의 원점을 중간 시각의 카메라 위치에 맞추고 축 방향은 월드 공간과 같게 유지합니다. 인접한 좌표가 작아져 상대적인 기하 정밀도를 개선할 수 있습니다.",
      "id": "ch05-01-b19"
    },
    {
      "type": "code",
      "chunkName": "<<Compute worldFromRender transformation>>=",
      "language": "cpp",
      "code": "// AnimatedTransform의 실제 시작·종료 시각의 중간을 사용합니다.\nFloat tMid = (worldFromCamera.startTime + worldFromCamera.endTime) / 2;\nPoint3f pCamera = worldFromCamera(Point3f(0, 0, 0), tMid);\nworldFromRender = Translate(Vector3f(pCamera));\nTransform renderFromWorld = Inverse(worldFromRender);\nTransform rfc[2] = {renderFromWorld * worldFromCamera.startTransform,\n                   renderFromWorld * worldFromCamera.endTransform};\nrenderFromCamera = AnimatedTransform(rfc[0], worldFromCamera.startTime,\n                                    rfc[1], worldFromCamera.endTime);",
      "explanationKo": "카메라 근처 좌표의 크기를 줄여 정밀도 손실을 완화합니다. 모든 규모와 모든 물체에 대한 오차 제거를 보장하지 않으며, 카메라에서 먼 물체와 교차 계산의 오차는 따로 고려합니다.",
      "provenance": "teaching",
      "id": "ch05-01-b20"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "CameraBase 기본 클래스와 가상 인터페이스",
      "titleEn": "CameraBase and Camera Interface",
      "id": "ch05-01-b21"
    },
    {
      "type": "paragraph",
      "textKo": "모든 구체적인 카메라 모델(직교 카메라, 원근 카메라, 구면 카메라 등)은 `CameraBase` 공통 클래스로부터 유용한 기능을 상속받으며, `Camera` 인터페이스를 통해 다형적으로 호출됩니다.",
      "textEn": "All specific camera implementations inherit from CameraBase and implement the methods required by the polymorphic Camera interface.",
      "id": "ch05-01-b22"
    },
    {
      "type": "code",
      "chunkName": "<<Camera Interface Declarations>>=",
      "language": "cpp",
      "code": "class Camera : public TaggedPointer<PerspectiveCamera,\n                                      OrthographicCamera,\n                                      SphericalCamera, RealisticCamera> {\n  public:\n    using TaggedPointer::TaggedPointer;\n\n    // 주어진 카메라 샘플로부터 광선과 가중치를 생성\n    pstd::optional<CameraRay> GenerateRay(CameraSample sample,\n                                          SampledWavelengths &lambda) const;\n\n    // 광선 미분을 포함한 확장 광선 생성 (텍스처 안티앨리어싱용)\n    pstd::optional<CameraRayDifferential> GenerateRayDifferential(\n        CameraSample sample, SampledWavelengths &lambda) const;\n\n    // 연결된 필름(Film) 객체 반환\n    Film GetFilm() const;\n\n    // 셔터 구간의 실제 시각으로 변환\n    Float SampleTime(Float u) const;\n};",
      "explanationKo": "Camera는 TaggedPointer를 통해 구체 타입으로 디스패치합니다. 이 패턴은 C++20 전용 기능이 아니며 캐시 미스가 없어지는 것도 아닙니다. 파장 샘플링은 연결된 Film의 인터페이스에서 제공됩니다.",
      "provenance": "teaching",
      "id": "ch05-01-b23"
    }
  ],
  "audit": {
    "checkedSourceSha256": "61dec848ea38763076138c3ffcf7aaa2564f09ce0e5115019133d4b815abc6c5",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "5.1 Camera Interface",
      "5.1.1  Camera Coordinate Spaces",
      "5.1.2  The CameraBase Class"
    ],
    "sourceFigures": [
      "5.1"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
