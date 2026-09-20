import type { SectionContent } from '../../../../types/book';

export const CH05_03_SPHERICAL_CAMERA: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "5",
  "chapterTitleKo": "제5장 가상 카메라와 필름 (Cameras and Film)",
  "sectionNumber": "5.3",
  "sectionTitle": "Spherical Camera",
  "sectionTitleKo": "5.3 구면 360도 카메라 (Spherical Camera)",
  "originalUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Spherical_Camera.html",
  "prevSection": {
    "id": "ch05-02",
    "title": "5.2 투영 카메라 모델"
  },
  "nextSection": {
    "id": "ch05-04",
    "title": "5.4 디지털 필름과 픽셀 센서"
  },
  "summary": {
    "keyTakeaways": [
      "구면 카메라(Spherical Camera)는 단일 뷰 평면을 넘어 카메라 중심으로부터 전방위 360도 구면($4\\pi$ 스테라디안) 전체로 방사되는 광선을 생성하는 특수 카메라입니다.",
      "VR 헤드셋, 전방위 파노라마 사진, 조명 환경 맵(Image-Based Lighting) 생성에 필수적으로 활용됩니다.",
      "등지사각 투영(Equirectangular Mapping)은 경도와 위도를 가로/세로 축으로 직접 매핑하여 직관적이지만, 북극과 남극 부근에서 픽셀이 심하게 늘어나 해상도 낭비가 심합니다.",
      "등면적 투영(Equal-Area Mapping)은 정사각형 픽셀 영역이 구면 상에서 항상 동일한 입체각(Solid Angle) 면적을 차지하도록 보존하여, 극점 왜곡을 없애고 저장 공간과 연산 효율을 극대화합니다."
    ],
    "prerequisites": [
      "구면좌표계 (Spherical Coordinates: 위도 $\\theta$, 경도 $\\phi$)",
      "단위 구면의 면적분 및 입체각 ($d\\omega = \\sin\\theta d\\theta d\\phi$)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "5.3 구면 360도 파노라마 카메라",
      "titleEn": "5.3 Spherical Camera",
      "id": "ch05-03-b1"
    },
    {
      "type": "paragraph",
      "textKo": "원근 카메라는 한 평면의 투영으로 시야를 표현하며 일반적인 핀홀 화각은 180도 미만입니다. 직교 카메라는 각도 화각보다 스크린 윈도우로 범위를 지정합니다. 구면 카메라는 한 위치에서 모든 방향을 샘플링하여 파노라마·환경 맵에 사용합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch05-03-b2"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "파노라마와 입체 VR은 구분합니다",
      "summary": "파노라마와 입체 VR은 구분합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "한 위치에서 구한 구면 영상은 고개를 돌려 보는 파노라마에 사용할 수 있습니다. 그러나 위치를 옮겼을 때의 시차나 양쪽 눈의 서로 다른 광선을 자동으로 제공하지 않습니다. 완전한 입체·위치 이동 VR은 다른 촬영 또는 렌더링 구성이 필요합니다."
        }
      ],
      "id": "ch05-03-b3"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "등지사각 투영 (Equirectangular Mapping)",
      "titleEn": "Equirectangular Mapping",
      "id": "ch05-03-b4"
    },
    {
      "type": "paragraph",
      "textKo": "가장 직관적이고 널리 쓰이는 매핑 방식은 **등지사각 투영(Equirectangular Mapping)**입니다. 필름의 정규화된 2D 좌표 $(u, v) \\in [0, 1]^2$를 구면좌표계의 방위각(경도 $\\phi$)과 천정각(위도 $\\theta$)으로 선형 매핑합니다:",
      "textEn": "The most common mapping is equirectangular mapping, which linearly maps film coordinates (u, v) to spherical longitude phi and latitude theta:",
      "id": "ch05-03-b5"
    },
    {
      "type": "equation",
      "tex": "\\theta = \\pi v, \\quad \\phi = 2\\pi u",
      "explanationKo": "$u$가 0에서 1로 변함에 따라 방위각 $\\phi$가 $0$에서 $2\\pi(360^\\circ)$로 회전하고, $v$가 0에서 1로 변함에 따라 $\\theta$가 북극($0$)에서 남극($\\pi$)으로 내려갑니다.",
      "id": "ch05-03-b6"
    },
    {
      "type": "paragraph",
      "textKo": "구면좌표계로부터 3차원 광선 방향 벡터 $\\mathbf{d}$는 삼각함수를 통해 계산됩니다:",
      "textEn": "The 3D ray direction is then obtained using the standard spherical direction formula:",
      "id": "ch05-03-b7"
    },
    {
      "type": "equation",
      "tex": "\\mathbf{d} = (\\sin\\theta \\cos\\phi, \\; \\sin\\theta \\sin\\phi, \\; \\cos\\theta)",
      "explanationKo": "이 식은 구면 유틸리티의 z축 기준 방향입니다. PBRT의 구면 카메라는 이어서 y,z 성분을 바꿔 카메라의 위 방향에 맞춥니다.",
      "id": "ch05-03-b8"
    },
    {
      "type": "paragraph",
      "id": "fig-sanmiguel-equirect",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "등면적 투영 (Equal-Area Mapping)과 극점 왜곡의 해결",
      "titleEn": "Equal-Area Mapping",
      "id": "ch05-03-b10"
    },
    {
      "type": "paragraph",
      "textKo": "등지사각 투영은 이해하기 쉽지만 중대한 공학적 단점이 있습니다. 구면의 미소 입체각 $d\\omega = \\sin\\theta d\\theta d\\phi$에서 $\\theta \\to 0$ 또는 $\\theta \\to \\pi$인 극점 부근은 $\\sin\\theta \\approx 0$이 되어 실제 면적이 거의 없습니다. 하지만 등지사각 투영에서는 모든 위도선에 동일한 수의 픽셀이 할당되므로, **북극점과 남극점의 작은 영역에 전체 픽셀의 상당수가 낭비**됩니다.",
      "textEn": "While equirectangular mapping is intuitive, it suffers from severe pixel density distortion. Near the poles, sin(theta) approaches zero, meaning huge numbers of image pixels represent tiny solid angles, wasting memory and computation.",
      "id": "ch05-03-b11"
    },
    {
      "type": "paragraph",
      "textKo": "등면적 사각형–구면 매핑은 같은 크기의 이미지 영역을 같은 입체각으로 대응시킵니다. 구면의 면적 배분은 개선되지만, 각도와 모양의 왜곡까지 모두 없앨 수는 없습니다. 이음매와 필터 경계도 해당 매핑 규칙으로 처리합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch05-03-b12"
    },
    {
      "type": "paragraph",
      "id": "fig-sanmiguel-equalarea",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "code",
      "chunkName": "<<SphericalCamera::GenerateRay>>=",
      "language": "cpp",
      "code": "pstd::optional<CameraRay> SphericalCamera::GenerateRay(\n    CameraSample sample, SampledWavelengths &lambda) const {\n    // 1. 픽셀 좌표를 정규화된 [0, 1)^2 범위로 변환\n    Point2f uv(sample.pFilm.x / film.FullResolution().x,\n               sample.pFilm.y / film.FullResolution().y);\n\n    Vector3f dir;\n    if (mapping == Mapping::EquiRectangular) {\n        // 등지사각 투영: 각도 변환 후 구면 방향 벡터 생성\n        Float theta = Pi * uv.y;\n        Float phi = 2 * Pi * uv.x;\n        dir = SphericalDirection(std::sin(theta), std::cos(theta), phi);\n    } else {\n        // 등면적 투영: 필터 경계 래핑 후 동등 면적 매핑\n        Point2f uvWrapped = WrapEqualAreaSquare(uv);\n        dir = EqualAreaSquareToSphere(uvWrapped);\n    }\n\n    // 2. 광선 원점은 카메라 위치, 방향은 계산된 구면 벡터\n    pstd::swap(dir.y, dir.z); // 카메라의 위 방향을 y축에 맞춤\n    Ray ray(Point3f(0, 0, 0), dir, SampleTime(sample.time), medium);\n    return CameraRay{RenderFromCamera(ray)};\n}",
      "explanationKo": "WrapEqualAreaSquare()는 픽셀 재구성 필터로 인해 샘플 좌표가 [0, 1] 경계를 약간 벗어났을 때 구면의 주기적 경계 조건을 매끄럽게 처리해 줍니다.",
      "provenance": "teaching",
      "id": "ch05-03-b14"
    },
    {
      "type": "subheading",
      "id": "ch05-03-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch05-03-source-figure-5-16",
      "number": "Figure 5.16",
      "title": "Original Figure 5.16",
      "titleKo": "원문 그림 5.16",
      "src": "/books/pbrt-4ed/reviewed-images/figure-5-16.png",
      "captionKo": "그림 5.16 · SphericalCamera로 모든 방향을 기록한 San Miguel 장면입니다. 원문은 등거리 원통형 매핑과 등면적 매핑을 비교합니다. 장면 제공: Guillermo M. Leal Llaguno.",
      "captionEn": "Figure 5.16: The San Miguel scene rendered with the SphericalCamera , which traces rays in all directions from the camera position. (a) Rendered using an equirectangular mapping. (b) Rendered with an equal-area mapping. (Scene courtesy of Guillermo M. Leal Llaguno.)",
      "width": 998,
      "height": 568,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Cameras_and_Film/Spherical_Camera.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "33ce439c402d5453e156bc606680cdeab50f53df307e7a8fa6fc6d4550d145f7",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "5.3 Spherical Camera"
    ],
    "sourceFigures": [
      "5.16"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
