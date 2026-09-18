import { SectionContent } from '../../../../types/book';

export const CH05_03_SPHERICAL_CAMERA: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '5',
  chapterTitleKo: '제5장 가상 카메라와 필름 (Cameras and Film)',
  sectionNumber: '5.3',
  sectionTitle: 'Spherical Camera',
  sectionTitleKo: '5.3 구면 360도 카메라 (Spherical Camera)',
  originalUrl: 'https://pbr-book.org/4ed/Cameras_and_Film/Spherical_Camera.html',
  prevSection: {
    id: 'ch05-02',
    title: '5.2 투영 카메라 모델',
  },
  nextSection: {
    id: 'ch05-04',
    title: '5.4 디지털 필름과 픽셀 센서',
  },
  summary: {
    keyTakeaways: [
      '구면 카메라(Spherical Camera)는 단일 뷰 평면을 넘어 카메라 중심으로부터 전방위 360도 구면($4\\pi$ 스테라디안) 전체로 방사되는 광선을 생성하는 특수 카메라입니다.',
      'VR 헤드셋, 전방위 파노라마 사진, 조명 환경 맵(Image-Based Lighting) 생성에 필수적으로 활용됩니다.',
      '등지사각 투영(Equirectangular Mapping)은 경도와 위도를 가로/세로 축으로 직접 매핑하여 직관적이지만, 북극과 남극 부근에서 픽셀이 심하게 늘어나 해상도 낭비가 심합니다.',
      '등면적 투영(Equal-Area Mapping)은 정사각형 픽셀 영역이 구면 상에서 항상 동일한 입체각(Solid Angle) 면적을 차지하도록 보존하여, 극점 왜곡을 없애고 저장 공간과 연산 효율을 극대화합니다.'
    ],
    prerequisites: [
      '구면좌표계 (Spherical Coordinates: 위도 $\\theta$, 경도 $\\phi$)',
      '단위 구면의 면적분 및 입체각 ($d\\omega = \\sin\\theta d\\theta d\\phi$)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '5.3 구면 360도 파노라마 카메라',
      titleEn: '5.3 Spherical Camera'
    },
    {
      type: 'paragraph',
      textKo: '앞 절에서 다룬 직교 및 원근 카메라는 평면 필름에 상을 투영하므로 시야각(FOV)이 $180^\\circ$ 미만으로 제한됩니다. 그러나 가상현실(VR) 환경, $360^\\circ$ 동영상, 그리고 씬 전체를 감싸는 고해상도 환경 조명 맵(HDRI Environment Map)을 생성하기 위해서는 모든 방향($4\\pi$ 스테라디안)을 한 번에 담을 수 있는 카메라가 필요합니다. `SphericalCamera`는 카메라 원점에서 구면의 모든 방향을 향해 광선을 방출하는 특수 카메라 모델입니다.',
      textEn: 'Projective cameras project onto a planar film and are therefore limited to fields of view strictly less than 180 degrees. However, applications like virtual reality (VR), 360-degree video, and environment lighting maps require capturing the entire 360-degree sphere of directions. SphericalCamera generates rays pointing in all directions around the camera position.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: 'VR 헤드셋이 세상을 보는 방식: 360도 구면 투영',
      summary: '어떻게 사각형 이미지 파일 하나로 사방팔방 3차원 공간을 둘러볼 수 있을까요?',
      points: [
        {
          title: '지구본을 세계지도로 펼치는 수학',
          content: '둥근 지구본의 표면을 2:1 비율의 직사각형 종이에 펼쳐 인쇄하듯, 카메라를 중심으로 사방 360도를 둘러싼 구면(Sphere)의 색상 정보를 2차원 사각형 픽셀 배열에 규칙적으로 저장합니다.'
        },
        {
          title: 'VR 기기의 실시간 역투영',
          content: '사용자가 메타 퀘스트나 애플 비전 프로 같은 VR 헤드셋을 착용하고 고개를 돌리면, 센서가 착용자의 시선 각도를 측정하여 이 구면 이미지에서 해당 각도의 영역만 즉시 잘라내어 양쪽 눈 렌즈에 보여줍니다.'
        }
      ]
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '등지사각 투영 (Equirectangular Mapping)',
      titleEn: 'Equirectangular Mapping'
    },
    {
      type: 'paragraph',
      textKo: '가장 직관적이고 널리 쓰이는 매핑 방식은 **등지사각 투영(Equirectangular Mapping)**입니다. 필름의 정규화된 2D 좌표 $(u, v) \\in [0, 1]^2$를 구면좌표계의 방위각(경도 $\\phi$)과 천정각(위도 $\\theta$)으로 선형 매핑합니다:',
      textEn: 'The most common mapping is equirectangular mapping, which linearly maps film coordinates (u, v) to spherical longitude phi and latitude theta:'
    },
    {
      type: 'equation',
      tex: '\\theta = \\pi v, \\quad \\phi = 2\\pi u',
      explanationKo: '$u$가 0에서 1로 변함에 따라 방위각 $\\phi$가 $0$에서 $2\\pi(360^\\circ)$로 회전하고, $v$가 0에서 1로 변함에 따라 $\\theta$가 북극($0$)에서 남극($\\pi$)으로 내려갑니다.'
    },
    {
      type: 'paragraph',
      textKo: '구면좌표계로부터 3차원 광선 방향 벡터 $\\mathbf{d}$는 삼각함수를 통해 계산됩니다:',
      textEn: 'The 3D ray direction is then obtained using the standard spherical direction formula:'
    },
    {
      type: 'equation',
      tex: '\\mathbf{d} = (\\sin\\theta \\cos\\phi, \\; \\sin\\theta \\sin\\phi, \\; \\cos\\theta)',
      explanationKo: '계산된 단위 벡터 $\\mathbf{d}$ 방향으로 카메라 원점에서 광선을 쏘아 보냅니다.'
    },
    {
      type: 'figure',
      id: 'fig-sanmiguel-equirect',
      number: 'Figure 5.14',
      title: 'Equirectangular 360 Panorama',
      titleKo: '산 미겔(San Miguel) 정원의 등지사각 360도 파노라마 렌더링',
      src: '/books/pbrt-4ed/images/sanmiguel-equirectangular.png',
      captionKo: '등지사각 투영 결과. 가로세로 2:1 비율의 이미지로 360도 전체 풍경이 담겨 있습니다. 상단(하늘)과 하단(바닥) 극지방으로 갈수록 좌우로 심하게 늘어나는 왜곡을 확인할 수 있습니다.',
      captionEn: 'Equirectangular panoramic rendering of the San Miguel scene, showing horizontal stretching near the poles.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '등면적 투영 (Equal-Area Mapping)과 극점 왜곡의 해결',
      titleEn: 'Equal-Area Mapping'
    },
    {
      type: 'paragraph',
      textKo: '등지사각 투영은 이해하기 쉽지만 중대한 공학적 단점이 있습니다. 구면의 미소 입체각 $d\\omega = \\sin\\theta d\\theta d\\phi$에서 $\\theta \\to 0$ 또는 $\\theta \\to \\pi$인 극점 부근은 $\\sin\\theta \\approx 0$이 되어 실제 면적이 거의 없습니다. 하지만 등지사각 투영에서는 모든 위도선에 동일한 수의 픽셀이 할당되므로, **북극점과 남극점의 작은 영역에 전체 픽셀의 상당수가 낭비**됩니다.',
      textEn: 'While equirectangular mapping is intuitive, it suffers from severe pixel density distortion. Near the poles, sin(theta) approaches zero, meaning huge numbers of image pixels represent tiny solid angles, wasting memory and computation.'
    },
    {
      type: 'paragraph',
      textKo: '이 문제를 완벽히 해결하기 위해 pbrt는 피터 셜리(Peter Shirley)와 치우(Chiu)의 연구에 기반한 **등면적 사각-구면 매핑(Equal-Area Square-to-Sphere Mapping)**을 제공합니다. 이 매핑에서는 필름 위의 1픽셀이 구면 위에서 차지하는 입체각 면적이 위치에 관계없이 항상 일정합니다($d\\omega = \\text{constant}$).',
      textEn: 'pbrt solves this with EqualAreaSquareToSphere mapping, where every pixel on the film corresponds to exactly the same solid angle on the sphere, eliminating polar oversampling.'
    },
    {
      type: 'figure',
      id: 'fig-sanmiguel-equalarea',
      number: 'Figure 5.15',
      title: 'Equal-Area Spherical Projection',
      titleKo: '등면적 투영(Equal-Area)으로 렌더링된 산 미겔 씬',
      src: '/books/pbrt-4ed/images/sanmiguel-equalarea.png',
      captionKo: '등면적 투영 결과. 1:1 정사각형 비율의 필름에 전체 구면이 균일한 밀도로 사상되어, 극지방 픽셀 낭비가 전혀 발생하지 않습니다.',
      captionEn: 'Equal-area projection rendering: maps the sphere onto a 1:1 square with uniform solid angle distribution.'
    },
    {
      type: 'code',
      chunkName: '<<SphericalCamera::GenerateRay>>=',
      language: 'cpp',
      code: `pbrt::optional<CameraRay> SphericalCamera::GenerateRay(
    CameraSample sample, SampledWavelengths &lambda) const {
    // 1. 픽셀 좌표를 정규화된 [0, 1)^2 범위로 변환
    Point2f uv(sample.pFilm.x / film.FullResolution().x,
               sample.pFilm.y / film.FullResolution().y);

    Vector3f dir;
    if (mapping == Mapping::EquiRectangular) {
        // 등지사각 투영: 각도 변환 후 구면 방향 벡터 생성
        Float theta = Pi * uv.y;
        Float phi = 2 * Pi * uv.x;
        dir = SphericalDirection(std::sin(theta), std::cos(theta), phi);
    } else {
        // 등면적 투영: 필터 경계 래핑 후 동등 면적 매핑
        Point2f uvWrapped = WrapEqualAreaSquare(uv);
        dir = EqualAreaSquareToSphere(uvWrapped);
    }

    // 2. 광선 원점은 카메라 위치, 방향은 계산된 구면 벡터
    Ray ray = RenderFromCamera(Ray(Point3f(0, 0, 0), dir, sample.time));
    return CameraRay{ray};
}`,
      explanationKo: 'WrapEqualAreaSquare()는 픽셀 재구성 필터로 인해 샘플 좌표가 [0, 1] 경계를 약간 벗어났을 때 구면의 주기적 경계 조건을 매끄럽게 처리해 줍니다.'
    }
  ]
};
