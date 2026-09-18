import { SectionContent } from '../../../../types/book';

export const CH01_02_RAY_TRACING: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '1',
  chapterTitleKo: '제1장 소개 (Introduction)',
  sectionNumber: '1.2',
  sectionTitle: 'Photorealistic Rendering and the Ray-Tracing Algorithm',
  sectionTitleKo: '1.2 사실적 렌더링과 광선 추적(Ray-Tracing) 알고리즘',
  originalUrl: 'https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html',
  prevSection: {
    id: 'ch01-01',
    title: '1.1 문학적 프로그래밍',
  },
  nextSection: {
    id: 'ch01-03',
    title: '1.3 pbrt 시스템 전체 개요',
  },
  summary: {
    keyTakeaways: [
      '사실적 렌더링(Photorealistic Rendering)은 실제 카메라로 촬영한 사진과 눈으로 구별할 수 없는 2D 이미지를 3D 모델로부터 합성하는 기술입니다.',
      '빛은 본질적으로 전자기파이자 광자(Photon)이지만, 컴퓨터 그래픽스에서는 직진하는 기하학적 "광선(Ray)"으로 추상화하여 시뮬레이션합니다.',
      '광선 추적 알고리즘의 7대 핵심 요소: 카메라 모델, 광선-물체 교차 검사, 빛의 분포(조도), 가시성(그림자), 표면 반사(BRDF), 재귀 광선 추적, 참여 매질(안개, 연기).',
      '터너 휘티(Turner Whitted)의 1980년 논문을 기점으로, 거울 반사와 투명 굴절을 재귀적으로 추적하는 현대 레이 트레이싱의 기초가 확립되었습니다.'
    ],
    prerequisites: [
      '3차원 공간 속 직선의 매개변수 방정식 r(t) = o + t*d',
      '빛의 직진, 반사, 굴절에 대한 기본 물리 상식'
    ]
  },
  blocks: [
    {
      type: 'paragraph',
      textKo: '**사실적 렌더링(Photorealistic Rendering)**의 궁극적인 목표는 "실제 카메라로 현실 세계를 촬영한 사진과 눈으로 구별할 수 없는 정교한 2차원 디지털 이미지"를 3차원 컴퓨터 모델로부터 만들어내는 것입니다. 이 거대한 목표를 달성하는 가장 우아하고 강력한 알고리즘이 바로 **광선 추적법(Ray Tracing)**입니다.',
      textEn: 'The goal of photorealistic rendering is to create an image of a 3D scene that is indistinguishable from a photograph of an equivalent real-world scene. Ray tracing is a remarkably simple and elegant algorithm that can simulate the physics of light transport with high fidelity.'
    },
    {
      type: 'paragraph',
      textKo: '빛의 물리적 시뮬레이션에 집중하기에 앞서, 근본적인 질문을 던져볼 필요가 있습니다: **"도대체 빛(Light)이란 무엇인가?"**  \n현대 물리학에서 빛은 전자기파(Wave)이자 양자화된 에너지 알갱이인 광자(Photon)로 설명됩니다. 그러나 다행스럽게도 사람의 눈으로 보는 일상적인 규모의 3D 렌더링에서는 빛의 파장보다 훨씬 큰 물체들을 다루기 때문에, 빛이 직선으로 나아가는 **기하 광학(Geometric Optics)**의 "광선(Ray)" 모델만으로도 거의 모든 사실적인 시각 현상을 완벽하게 시뮬레이션할 수 있습니다.',
      textEn: 'Given this single-minded focus on realistic simulation of light, it seems prudent to ask: what is light? Light is a wave-like manifestation in this framework: the motion of electrically charged particles produces an oscillating electromagnetic field. How does our goal of simulating light to produce realistic images fit into all of this? Fortunately, we can model light as rays that travel in straight lines in vacuum or homogeneous media.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: '왜 빛을 "광원"에서 쏘지 않고 "카메라"에서 거꾸로 쏠까요?',
      summary: '알고리즘 연산량 99.9999% 절약의 기적: 역방향 광선 추적 (Backward Ray Tracing)',
      points: [
        {
          title: '자연계의 빛 (순방향: 광원 → 눈)',
          content: '태양이나 전등에서 방출된 수조 개의 광자 중 99.9999%는 카메라 렌즈와 무관한 허공으로 흩어집니다. 이 방식대로 시뮬레이션하면 카메라 센서에 닿지도 않는 빛을 계산하느라 컴퓨터가 멈추고 맙니다.'
        },
        {
          title: '컴퓨터 그래픽스의 지혜 (역방향: 눈 → 광원)',
          content: '우리가 관심 있는 것은 오직 "카메라 센서 각 픽셀 안으로 들어오는 빛"뿐입니다! 따라서 화면의 각 픽셀에서부터 광선을 거꾸로 쏘아, 물체와 부딪힌 뒤 그 지점으로 광원들의 빛이 얼마나 도달하는지 추적하면 단 1회의 낭비도 없이 100% 필요한 계산만 수행할 수 있습니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', '레이 트레이싱 원리', '알고리즘 최적화']
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '1. 가상 카메라와 디지털 필름 (Cameras and Film)',
      titleEn: '1. Cameras and Film'
    },
    {
      type: 'paragraph',
      textKo: '카메라의 가장 원초적인 형태는 작은 바늘구멍 하나로 상이 맺히는 **바늘구멍 카메라(Pinhole Camera)**입니다. 3차원 공간 속 가상의 한 점(시점, Eye point)에 핀홀이 있고, 그 뒤편에 필름 평면(Film Plane)이 놓여 있다고 상상해 봅시다. 3차원 세계의 물체에서 출발한 빛은 이 핀홀을 통과하여 필름에 거꾸로 맺히게 됩니다.',
      textEn: 'Nearly everyone has used a camera and is familiar with its basic functionality. Although most cameras are substantially more complex than the pinhole camera, it is a convenient approximation. In a pinhole camera, light from the scene passes through a tiny aperture and forms an inverted image on the film plane.'
    },
    {
      type: 'figure',
      id: 'fig:pinhole-inverted',
      number: 'Figure 1.2',
      title: 'The Pinhole Camera Model',
      titleKo: '전통적인 바늘구멍 카메라 모델 (상하좌우 반전)',
      src: '/books/pbrt-4ed/images/pha01f02.svg',
      captionKo: '실제 핀홀 카메라에서는 핀홀 뒤편의 필름 평면에 물체의 상이 상하좌우가 뒤집힌 도립상(Inverted image)으로 투영됩니다.',
      captionEn: 'Figure 1.2: The pinhole camera model. Light from the scene enters a tiny hole and projects an inverted image on the film plane.'
    },
    {
      type: 'paragraph',
      textKo: '하지만 컴퓨터 그래픽스에서는 이미지가 뒤집히는 번거로움을 피하기 위해, 수학적으로 완전히 동등하면서도 훨씬 편리한 발상을 사용합니다: **"필름 평면을 시점(핀홀) 앞쪽으로 옮겨놓는 것"**입니다! 이렇게 하면 상이 뒤집히지 않고 똑바로 맺히게 됩니다. 이제 카메라는 각 픽셀을 향해 3차원 공간으로 날아가는 광선 벡터를 생성하는 역할을 맡게 됩니다.',
      textEn: 'Another way to think about the pinhole camera is to place the film plane in front of the pinhole. In this case, the image is formed right-side up. In a ray tracer, we can generate a ray from the camera position through each pixel into the scene.'
    },
    {
      type: 'figure',
      id: 'fig:pinhole-front',
      number: 'Figure 1.3',
      title: 'Upright Pinhole Camera Geometry',
      titleKo: '필름 평면을 앞쪽에 둔 레이 트레이서의 가상 카메라 구조',
      src: '/books/pbrt-4ed/images/pha01f03.svg',
      captionKo: '시점(Viewing point) 앞쪽에 가상의 이미지 평면을 배치하면, 각 픽셀의 중심을 관통하는 광선(Ray)을 3D 월드 공간을 향해 직관적으로 발사할 수 있습니다.',
      captionEn: 'Figure 1.3: By placing the film plane in front of the viewing position, rays can be traced directly from the camera through the pixels into the scene without image inversion.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '2. 광선과 물체의 교차 검사 (Ray-Object Intersections)',
      titleEn: '2. Ray-Object Intersections'
    },
    {
      type: 'paragraph',
      textKo: '카메라가 광선을 발사했을 때 렌더러가 해결해야 할 첫 번째 과제는 **"이 광선이 가상 세계 속에 놓인 수많은 물체 중 어떤 것과 가장 먼저 충돌하는가?"**를 알아내는 것입니다. 수학적으로 3차원 광선은 시작점 $\\mathbf{o}$(Origin)와 방향 벡터 $\\mathbf{d}$(Direction), 그리고 이동 거리를 나타내는 매개변수 $t$를 사용해 다음과 같이 표현됩니다:\n\n$$\\mathbf{r}(t) = \\mathbf{o} + t\\,\\mathbf{d} \\quad (t > 0)$$\n\n예를 들어 구(Sphere)나 삼각형(Triangle)의 방정식에 광선의 식을 대입하면, 2차 방정식의 근의 공식을 풀거나 연립방정식을 풀어 교차 거리 $t$를 정확하게 계산해낼 수 있습니다.',
      textEn: 'Each time the camera generates a ray, the first task of the renderer is to determine which object the ray intersects first and where that intersection occurs. A ray can be expressed parametrically as r(t) = o + t*d where o is the origin and d is the direction vector.'
    },
    {
      type: 'paragraph',
      textKo: '단순히 광선이 물체와 부딪힌 위치(교차점)만 알아내는 것으로는 충분하지 않습니다. 그 지점의 표면이 어느 쪽을 향하고 있는지를 나타내는 **법선 벡터(Surface Normal)**, 텍스처를 입히기 위한 $(u, v)$ 좌표, 그리고 물체의 기하학적 미분 정보까지 함께 수집해야 이후 정밀한 빛 계산을 수행할 수 있습니다.',
      textEn: 'The intersection point alone is not enough information for the rest of the ray tracer; it needs to know geometric properties of the surface at the hit point, such as the surface normal, parameterization coordinates (u, v), and partial derivatives.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '3. 빛의 분포와 거리 역제곱 법칙 (Light Distribution)',
      titleEn: '3. Light Distribution'
    },
    {
      type: 'paragraph',
      textKo: '물체 표면의 한 점을 찾았다면, 이제 광원(조명)으로부터 이 점으로 얼마나 많은 빛 에너지가 쏟아지고 있는지를 계산해야 합니다. 점광원(Point light)에서 방출된 빛 에너지는 구(Sphere) 형태로 사방으로 퍼져나가므로, **광원과의 거리 $r$이 멀어질수록 단위 면적당 도달하는 빛의 세기는 거리의 제곱에 반비례하여 급격히 약해집니다 (역제곱 법칙, Inverse-Square Law)**.',
      textEn: 'The ray-object intersection gives us a point to be shaded. We need to know how much light arrives at this point from light sources. For a point light, the power per area decreases with the square of the distance r from the light (the 1/r^2 falloff).'
    },
    {
      type: 'figure',
      id: 'fig:inverse-square',
      number: 'Figure 1.5',
      title: 'The Inverse Square Law',
      titleKo: '빛 에너지의 거리 역제곱 법칙 (1/r² 감소)',
      src: '/books/pbrt-4ed/images/pha01f05.svg',
      captionKo: '점광원에서 퍼져나가는 빛 에너지는 거리가 2배 멀어지면 4배 넓은 구면 면적으로 흩어지므로, 단위 면적당 받는 에너지(조도)는 1/r²로 감소합니다.',
      captionEn: 'Figure 1.5: The inverse square law. Light spreading out from a point source covers an area proportional to r^2, causing irradiance to diminish with distance squared.'
    },
    {
      type: 'paragraph',
      textKo: '또한, 빛이 표면에 비스듬하게 비출수록 같은 양의 빛이 더 넓은 면적으로 퍼지게 됩니다. 따라서 표면의 법선 벡터와 빛이 들어오는 방향 사이의 각도 $\\theta$에 따라 빛의 밝기는 $\\cos\\theta$에 비례하여 어두워집니다(**람베르트 코사인 법칙, Lambert’s Cosine Law**).',
      textEn: 'Furthermore, if the surface is tilted by an angle theta with respect to the light direction, the light is spread over a larger area, reducing the irradiance by a factor of cos(theta).'
    },
    {
      type: 'figure',
      id: 'fig:cosine-law',
      number: 'Figure 1.6',
      title: 'Lambert’s Cosine Law',
      titleKo: '빛의 입사각과 람베르트 코사인 법칙 (cos θ)',
      src: '/books/pbrt-4ed/images/pha01f06.svg',
      captionKo: '표면이 빛의 진행 방향과 수직일 때 가장 많은 에너지를 받으며, 표면이 기울어질수록 cos(θ) 비율만큼 단위 면적당 입사하는 빛의 밀도가 줄어듭니다.',
      captionEn: 'Figure 1.6: Lambert’s cosine law. A surface tilted at angle theta receives irradiance proportional to cos(theta).'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '4. 가시성과 그림자 광선 (Visibility & Shadow Rays)',
      titleEn: '4. Visibility and Shadows'
    },
    {
      type: 'paragraph',
      textKo: '단순히 표면의 기울기와 거리만 계산해서는 현실적인 이미지를 얻을 수 없습니다. 광원과 물체 사이에 **또 다른 장애물이 가로막고 있다면 그림자(Shadow)**가 드리워져야 하기 때문입니다!  \n레이 트레이서에서는 이것을 믿을 수 없을 만큼 간단하게 판별합니다: 표면의 교차점에서부터 광원을 향해 새로운 광선인 **그림자 광선(Shadow Ray)**을 쏘아보는 것입니다. 만약 이 그림자 광선이 광원에 도달하기 전에 다른 물체와 충돌한다면 그 지점은 그늘진 곳으로 판정하여 직접 조명 값을 0으로 처리합니다.',
      textEn: 'In a ray tracer, it is easy to determine if the light is visible from the point being shaded. We simply construct a new ray from the intersection point to the light source, called a shadow ray, and test whether it intersects any objects before reaching the light.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '5. 표면 반사와 재질 BRDF (Surface Reflection & Materials)',
      titleEn: '5. Surface Reflection and BRDF'
    },
    {
      type: 'paragraph',
      textKo: '빛이 도달하는 것을 확인했다면, 이제 그 물체가 어떤 재질인가에 따라 카메라를 향해 얼마나 많은 빛이 반사되는지를 계산합니다. 분필이나 석고상처럼 모든 방향으로 고르게 빛을 흩뿌리는 **무광 확산 재질(Diffuse)**이 있는가 하면, 거울이나 광택 금속처럼 특정 각도로만 빛을 튕겨내는 **정반사 재질(Specular)**도 있습니다.  \n이러한 표면의 반사 특성을 수학적으로 기술하는 물리 함수를 **양방향 반사율 분포 함수(BRDF, Bidirectional Reflectance Distribution Function)**라고 부릅니다.',
      textEn: 'Each object in the scene provides a material, which is a description of its appearance properties. This behavior is formalized by the Bidirectional Reflectance Distribution Function (BRDF), which describes how much light is reflected from an incoming direction to an outgoing direction.'
    },
    {
      type: 'figure',
      id: 'fig:brdf-concept',
      number: 'Figure 1.8',
      title: 'BRDF Reflection Geometry',
      titleKo: '입사 방향과 반사 방향을 기술하는 BRDF의 기하학',
      src: '/books/pbrt-4ed/images/pha01f08.svg',
      captionKo: 'BRDF는 입사각(ω_i)으로 쏟아지는 빛 중 얼마만큼의 비율이 카메라가 바라보는 출사각(ω_o) 방향으로 반사되는지를 정밀하게 정의하는 렌더링의 핵심 물리 방정식입니다.',
      captionEn: 'Figure 1.8: Geometry of the BRDF. It relates incoming light from direction omega_i to reflected light toward direction omega_o.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6. 재귀적 광선 추적과 휘티의 도약 (Recursive Ray Tracing)',
      titleEn: '6. Recursive Ray Tracing and Whitted’s Formulation'
    },
    {
      type: 'paragraph',
      textKo: '1980년 터너 휘티(Turner Whitted)는 컴퓨터 그래픽스 역사에 길이 남을 혁명적인 논문을 발표했습니다. 빛의 반사와 굴절을 **재귀적(Recursive)인 광선 추적**으로 풀어낸 것입니다. 거울 표면에 닿은 광선은 정반사 방향으로 또 다른 반사 광선(Reflected Ray)을 쏘고, 투명한 유리 표면에 닿은 광선은 스넬의 법칙에 따라 꺾이는 굴절 광선(Refracted Ray)을 쏘아 그 끝에서 들어오는 빛을 계속해서 추적해 나갑니다.',
      textEn: 'Turner Whitted’s original paper on ray tracing (1980) emphasized its recursive nature, which made it possible to easily simulate specular reflection and refraction by tracing new rays from the intersection point in the reflection and refraction directions.'
    },
    {
      type: 'figure',
      id: 'fig:whitted-spheres',
      number: 'Figure 1.3',
      title: 'Classic Whitted Ray Tracing',
      titleKo: '터너 휘티의 1980년 기념비적인 렌더링 결과',
      src: '/books/pbrt-4ed/images/spheres-whitted.png',
      captionKo: '유리구의 굴절, 거울 구의 선명한 반사, 그리고 바닥 체커보드에 생기는 또렷한 그림자를 컴퓨터 그래픽스 역사상 최초로 완전하게 구현해낸 역사적 이미지입니다.',
      captionEn: 'Figure 1.3: Turner Whitted’s classic 1980 ray-traced image demonstrates sharp shadows, reflections, and refractions generated recursively.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '7. 참여 매질과 볼륨 산란 (Participating Media & Volume Scattering)',
      titleEn: '7. Participating Media and Volume Scattering'
    },
    {
      type: 'paragraph',
      textKo: '지금까지의 설명은 광선이 아무것도 없는 진공 속을 날아간다고 가정했습니다. 하지만 실제 현실 세계에는 공기 중의 안개(Fog), 자욱한 연기(Smoke), 먼지, 그리고 사람의 피부나 우유처럼 물체 내부로 빛이 침투하여 퍼져나가는 **참여 매질(Participating Media)**이 가득합니다.  \n참여 매질 속을 지나는 광선은 매질의 입자에 부딪혀 빛 에너지를 잃는 **흡수(Absorption)**와 다른 방향으로 튀는 **산란(Scattering)**을 겪게 되며, pbrt는 이러한 고난도의 볼륨 렌더링까지 물리 법칙 그대로 시뮬레이션할 수 있습니다.',
      textEn: 'The discussion so far has assumed that rays are traveling through a vacuum. However, the real world contains participating media such as fog, smoke, dust, or subsurface scattering within translucent materials like skin and marble. Rays passing through media experience absorption, emission, and scattering.'
    },
    {
      type: 'figure',
      id: 'fig:subsurface-head',
      number: 'Figure 1.10',
      title: 'Subsurface Scattering in Human Skin',
      titleKo: '인간 피부 내부에서 일어나는 빛의 피하 산란(Subsurface Scattering)',
      src: '/books/pbrt-4ed/images/head-subsurface.png',
      captionKo: '단순한 표면 반사만으로는 인간의 피부가 플라스틱 인형처럼 차갑게 보입니다. 빛이 피부 표면을 뚫고 들어가 모세혈관과 조직에서 부드럽게 산란되어 다시 뿜어져 나오는 현상을 시뮬레이션해야만 생명력 넘치는 피부의 따뜻한 붉은 톤이 완성됩니다.',
      captionEn: 'Figure 1.10: Subsurface scattering simulates light penetrating translucent objects like skin and scattering inside before exiting, creating realistic organic appearances.'
    }
  ]
};
