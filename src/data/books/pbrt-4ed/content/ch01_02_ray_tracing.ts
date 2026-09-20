import type { SectionContent } from '../../../../types/book';

export const CH01_02_RAY_TRACING: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "1",
  "chapterTitleKo": "제1장 소개 (Introduction)",
  "sectionNumber": "1.2",
  "sectionTitle": "Photorealistic Rendering and the Ray-Tracing Algorithm",
  "sectionTitleKo": "1.2 사실적 렌더링과 광선 추적(Ray-Tracing) 알고리즘",
  "originalUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
  "prevSection": {
    "id": "ch01-01",
    "title": "1.1 문학적 프로그래밍"
  },
  "nextSection": {
    "id": "ch01-03",
    "title": "1.3 pbrt 시스템 전체 개요"
  },
  "summary": {
    "keyTakeaways": [
      "사실적 렌더링(Photorealistic Rendering)은 실제 카메라로 촬영한 사진과 눈으로 구별할 수 없는 2D 이미지를 3D 모델로부터 합성하는 기술입니다.",
      "빛은 본질적으로 전자기파이자 광자(Photon)이지만, 컴퓨터 그래픽스에서는 직진하는 기하학적 \"광선(Ray)\"으로 추상화하여 시뮬레이션합니다.",
      "광선 추적 알고리즘의 7대 핵심 요소: 카메라 모델, 광선-물체 교차 검사, 빛의 분포(조도), 가시성(그림자), 표면 반사(BRDF), 재귀 광선 추적, 참여 매질(안개, 연기).",
      "터너 휘티(Turner Whitted)의 1980년 논문을 기점으로, 거울 반사와 투명 굴절을 재귀적으로 추적하는 현대 레이 트레이싱의 기초가 확립되었습니다."
    ],
    "prerequisites": [
      "3차원 공간 속 직선의 매개변수 방정식 r(t) = o + t*d",
      "빛의 직진, 반사, 굴절에 대한 기본 물리 상식"
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "textKo": "**사실적 렌더링(Photorealistic Rendering)**의 궁극적인 목표는 \"실제 카메라로 현실 세계를 촬영한 사진과 눈으로 구별할 수 없는 정교한 2차원 디지털 이미지\"를 3차원 컴퓨터 모델로부터 만들어내는 것입니다. 이 거대한 목표를 달성하는 가장 우아하고 강력한 알고리즘이 바로 **광선 추적법(Ray Tracing)**입니다.",
      "textEn": "The goal of photorealistic rendering is to create an image of a 3D scene that is indistinguishable from a photograph of an equivalent real-world scene. Ray tracing is a remarkably simple and elegant algorithm that can simulate the physics of light transport with high fidelity.",
      "id": "ch01-02-b1"
    },
    {
      "type": "paragraph",
      "textKo": "빛은 전자기파와 양자적 성질을 갖지만, 이 책은 주로 기하 광학과 방사 전달 모델을 사용합니다. 물체가 파장보다 충분히 큰 여러 장면에서 유용한 근사입니다. 회절·간섭·편광 등 모든 광학 현상을 같은 기본 모델로 정확히 재현하는 것은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-02-b2"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "왜 카메라에서 경로를 시작할까요?",
      "summary": "왜 카메라에서 경로를 시작할까요?",
      "points": [
        {
          "title": "핵심 설명",
          "content": "광원에서 내보낸 모든 빛 가운데 카메라에 도달하는 것은 일부입니다. 카메라에서 시작하면 관측할 픽셀과 연결된 경로에 계산을 집중하기 쉽습니다. 그래도 기여가 0인 경로를 뽑을 수 있고 모든 계산이 유효한 것은 아닙니다. 광원에서 시작하거나 양쪽에서 시작하는 방법이 더 효율적인 장면도 있습니다. 고정된 절약 비율은 없습니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "레이 트레이싱 원리",
        "알고리즘 최적화"
      ],
      "id": "ch01-02-b3"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "1. 가상 카메라와 디지털 필름 (Cameras and Film)",
      "titleEn": "1. Cameras and Film",
      "id": "ch01-02-b4"
    },
    {
      "type": "paragraph",
      "textKo": "카메라의 가장 원초적인 형태는 작은 바늘구멍 하나로 상이 맺히는 **바늘구멍 카메라(Pinhole Camera)**입니다. 3차원 공간 속 가상의 한 점(시점, Eye point)에 핀홀이 있고, 그 뒤편에 필름 평면(Film Plane)이 놓여 있다고 상상해 봅시다. 3차원 세계의 물체에서 출발한 빛은 이 핀홀을 통과하여 필름에 거꾸로 맺히게 됩니다.",
      "textEn": "Nearly everyone has used a camera and is familiar with its basic functionality. Although most cameras are substantially more complex than the pinhole camera, it is a convenient approximation. In a pinhole camera, light from the scene passes through a tiny aperture and forms an inverted image on the film plane.",
      "id": "ch01-02-b5"
    },
    {
      "type": "figure",
      "id": "fig:pinhole-inverted",
      "number": "Figure 1.2",
      "title": "Original Figure 1.2",
      "titleKo": "원문 그림 1.2",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-2.png",
      "captionKo": "그림 1.2 · 핀홀 카메라에서는 필름을 구멍을 통해 투영한 범위가 화면에 보이는 영역을 정합니다.",
      "captionEn": "Figure 1.2: A Pinhole Camera. The viewing volume is determined by the projection of the film through the pinhole.",
      "width": 998,
      "height": 234,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "하지만 컴퓨터 그래픽스에서는 이미지가 뒤집히는 번거로움을 피하기 위해, 수학적으로 완전히 동등하면서도 훨씬 편리한 발상을 사용합니다: **\"필름 평면을 시점(핀홀) 앞쪽으로 옮겨놓는 것\"**입니다! 이렇게 하면 상이 뒤집히지 않고 똑바로 맺히게 됩니다. 이제 카메라는 각 픽셀을 향해 3차원 공간으로 날아가는 광선 벡터를 생성하는 역할을 맡게 됩니다.",
      "textEn": "Another way to think about the pinhole camera is to place the film plane in front of the pinhole. In this case, the image is formed right-side up. In a ray tracer, we can generate a ray from the camera position through each pixel into the scene.",
      "id": "ch01-02-b7"
    },
    {
      "type": "figure",
      "id": "fig:pinhole-front",
      "number": "Figure 1.3",
      "title": "Original Figure 1.3",
      "titleKo": "원문 그림 1.3",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-3.png",
      "captionKo": "그림 1.3 · 계산용 핀홀 모델에서는 영상 평면을 구멍 앞에 놓아 뒤집히지 않은 영상을 다룹니다. 구멍에 해당하는 점을 눈, 즉 시점이라고 부릅니다.",
      "captionEn": "Figure 1.3: When we simulate a pinhole camera, we place the film in front of the hole at the imaging plane, and the hole is renamed the eye .",
      "width": 998,
      "height": 169,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "2. 광선과 물체의 교차 검사 (Ray-Object Intersections)",
      "titleEn": "2. Ray-Object Intersections",
      "id": "ch01-02-b9"
    },
    {
      "type": "paragraph",
      "textKo": "카메라가 광선을 발사했을 때 렌더러가 해결해야 할 첫 번째 과제는 **\"이 광선이 가상 세계 속에 놓인 수많은 물체 중 어떤 것과 가장 먼저 충돌하는가?\"**를 알아내는 것입니다. 수학적으로 3차원 광선은 시작점 $\\mathbf{o}$(Origin)와 방향 벡터 $\\mathbf{d}$(Direction), 그리고 광선 위 위치를 나타내는 매개변수 $t$ (방향 벡터가 단위 길이일 때만 실제 거리와 같습니다)를 사용해 다음과 같이 표현됩니다:\n\n$$\\mathbf{r}(t) = \\mathbf{o} + t\\,\\mathbf{d} \\quad (t > 0)$$\n\n예를 들어 구(Sphere)나 삼각형(Triangle)의 방정식에 광선의 식을 대입하면, 2차 방정식의 근의 공식을 풀거나 연립방정식을 풀어 교차 매개변수 $t$를 계산할 수 있습니다. 컴퓨터의 부동소수점 오차와 경계 판정은 별도로 다뤄야 합니다.",
      "textEn": "Each time the camera generates a ray, the first task of the renderer is to determine which object the ray intersects first and where that intersection occurs. A ray can be expressed parametrically as r(t) = o + t*d where o is the origin and d is the direction vector.",
      "id": "ch01-02-b10"
    },
    {
      "type": "paragraph",
      "textKo": "단순히 광선이 물체와 부딪힌 위치(교차점)만 알아내는 것으로는 충분하지 않습니다. 그 지점의 표면이 어느 쪽을 향하고 있는지를 나타내는 **법선 벡터(Surface Normal)**, 텍스처를 입히기 위한 $(u, v)$ 좌표, 그리고 물체의 기하학적 미분 정보까지 함께 수집해야 이후 정밀한 빛 계산을 수행할 수 있습니다.",
      "textEn": "The intersection point alone is not enough information for the rest of the ray tracer; it needs to know geometric properties of the surface at the hit point, such as the surface normal, parameterization coordinates (u, v), and partial derivatives.",
      "id": "ch01-02-b11"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "3. 빛의 분포와 거리 역제곱 법칙 (Light Distribution)",
      "titleEn": "3. Light Distribution",
      "id": "ch01-02-b12"
    },
    {
      "type": "paragraph",
      "textKo": "물체 표면의 한 점을 찾았다면, 이제 광원(조명)으로부터 이 점으로 얼마나 많은 빛 에너지가 쏟아지고 있는지를 계산해야 합니다. 점광원(Point light)에서 방출된 빛 에너지는 구(Sphere) 형태로 사방으로 퍼져나가므로, **광원과의 거리 $r$이 멀어질수록 단위 면적당 도달하는 빛의 세기는 거리의 제곱에 반비례하여 급격히 약해집니다 (역제곱 법칙, Inverse-Square Law)**.",
      "textEn": "The ray-object intersection gives us a point to be shaded. We need to know how much light arrives at this point from light sources. For a point light, the power per area decreases with the square of the distance r from the light (the 1/r^2 falloff).",
      "id": "ch01-02-b13"
    },
    {
      "type": "figure",
      "id": "fig:inverse-square",
      "number": "Figure 1.5",
      "title": "Original Figure 1.5",
      "titleKo": "원문 그림 1.5",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-5.png",
      "captionKo": "그림 1.5 · 점광원에서 점 p로 도달하는 단위 면적당 전력을 구하기 위한 배치입니다. r은 광원까지의 거리이며, 빛의 방향과 표면 법선 사이 각도도 도달량에 영향을 줍니다.",
      "captionEn": "Figure 1.5: Geometric construction for determining the power per area arriving at a point normal p due to a point light source. The distance from the point to the light source is denoted by r .",
      "width": 998,
      "height": 298,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "또한, 빛이 표면에 비스듬하게 비출수록 같은 양의 빛이 더 넓은 면적으로 퍼지게 됩니다. 따라서 표면의 법선 벡터와 빛이 들어오는 방향 사이의 각도 $\\theta$에 따라 빛의 밝기는 $\\cos\\theta$에 비례하여 어두워집니다(**람베르트 코사인 법칙, Lambert’s Cosine Law**).",
      "textEn": "Furthermore, if the surface is tilted by an angle theta with respect to the light direction, the light is spread over a larger area, reducing the irradiance by a factor of cos(theta).",
      "id": "ch01-02-b15"
    },
    {
      "type": "figure",
      "id": "fig:cosine-law",
      "number": "Figure 1.6",
      "title": "Original Figure 1.6",
      "titleKo": "원문 그림 1.6",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-6.png",
      "captionKo": "그림 1.6 · 모든 방향으로 같은 세기로 방출하는 점광원에서는, 광원을 둘러싼 구의 반경이 달라도 그 구 전체를 통과하는 총전력은 같습니다. 구의 면적이 커질수록 단위 면적당 양은 작아집니다.",
      "captionEn": "Figure 1.6: Since the point light radiates light equally in all directions, the same total power is deposited on all spheres centered at the light.",
      "width": 998,
      "height": 294,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "4. 가시성과 그림자 광선 (Visibility & Shadow Rays)",
      "titleEn": "4. Visibility and Shadows",
      "id": "ch01-02-b17"
    },
    {
      "type": "paragraph",
      "textKo": "광원과 표면 사이에 불투명한 물체가 있으면 그 광원의 직접 기여는 차단됩니다. 그림자 광선은 이 구간의 가려짐을 검사합니다. 투명한 경계나 참여 매질이 있으면 단순한 첫 교차 여부만으로 충분하지 않으며 투과·소광을 함께 처리해야 합니다. 다른 광원의 빛이나 간접 조명까지 모두 0이 된다는 뜻은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch01-02-b18"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "5. 표면 반사와 재질 BRDF (Surface Reflection & Materials)",
      "titleEn": "5. Surface Reflection and BRDF",
      "id": "ch01-02-b19"
    },
    {
      "type": "paragraph",
      "textKo": "빛이 도달하는 것을 확인했다면, 이제 그 물체가 어떤 재질인가에 따라 카메라를 향해 얼마나 많은 빛이 반사되는지를 계산합니다. 분필이나 석고상처럼 모든 방향으로 고르게 빛을 흩뿌리는 **무광 확산 재질(Diffuse)**이 있는가 하면, 거울이나 광택 금속처럼 특정 각도로만 빛을 튕겨내는 **정반사 재질(Specular)**도 있습니다.  \n이러한 표면의 반사 특성을 수학적으로 기술하는 물리 함수를 **양방향 반사율 분포 함수(BRDF, Bidirectional Reflectance Distribution Function)**라고 부릅니다.",
      "textEn": "Each object in the scene provides a material, which is a description of its appearance properties. This behavior is formalized by the Bidirectional Reflectance Distribution Function (BRDF), which describes how much light is reflected from an incoming direction to an outgoing direction.",
      "id": "ch01-02-b20"
    },
    {
      "type": "figure",
      "id": "fig:brdf-concept",
      "number": "Figure 1.8",
      "title": "Original Figure 1.8",
      "titleKo": "원문 그림 1.8",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-8.png",
      "captionKo": "그림 1.8 · 표면에서 광원으로 향하는 경로가 막히지 않아야 직접광이 도달합니다. 그림의 왼쪽 광원은 p를 비추지만 오른쪽 광원은 가려져 있습니다.",
      "captionEn": "Figure 1.8: A light source only deposits energy on a surface if the source is not obscured as seen from the receiving point. The light source on the left illuminates the point normal p Subscript , but the light source on the right does not.",
      "width": 998,
      "height": 338,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6. 재귀적 광선 추적과 휘티의 도약 (Recursive Ray Tracing)",
      "titleEn": "6. Recursive Ray Tracing and Whitted’s Formulation",
      "id": "ch01-02-b22"
    },
    {
      "type": "paragraph",
      "textKo": "1980년 터너 휘티(Turner Whitted)는 컴퓨터 그래픽스 역사에 길이 남을 혁명적인 논문을 발표했습니다. 빛의 반사와 굴절을 **재귀적(Recursive)인 광선 추적**으로 풀어낸 것입니다. 거울 표면에 닿은 광선은 정반사 방향으로 또 다른 반사 광선(Reflected Ray)을 쏘고, 투명한 유리 표면에 닿은 광선은 스넬의 법칙에 따라 꺾이는 굴절 광선(Refracted Ray)을 쏘아 그 끝에서 들어오는 빛을 계속해서 추적해 나갑니다.",
      "textEn": "Turner Whitted’s original paper on ray tracing (1980) emphasized its recursive nature, which made it possible to easily simulate specular reflection and refraction by tracing new rays from the intersection point in the reflection and refraction directions.",
      "id": "ch01-02-b23"
    },
    {
      "type": "paragraph",
      "id": "fig:whitted-spheres",
      "textKo": "같은 원문 그림의 중복·부분 번호 표기를 정리했습니다. 해당 그림의 비교 상태와 설명은 앞서 표시한 원문 그림 1.3에서 확인합니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "7. 참여 매질과 볼륨 산란 (Participating Media & Volume Scattering)",
      "titleEn": "7. Participating Media and Volume Scattering",
      "id": "ch01-02-b25"
    },
    {
      "type": "paragraph",
      "textKo": "지금까지의 설명은 광선이 아무것도 없는 진공 속을 날아간다고 가정했습니다. 하지만 실제 현실 세계에는 공기 중의 안개(Fog), 자욱한 연기(Smoke), 먼지, 그리고 사람의 피부나 우유처럼 물체 내부로 빛이 침투하여 퍼져나가는 **참여 매질(Participating Media)**이 가득합니다.  \n참여 매질 속을 지나는 광선은 매질의 입자에 부딪혀 빛 에너지를 잃는 **흡수(Absorption)**와 다른 방향으로 튀는 **산란(Scattering)**을 겪게 되며, pbrt는 이러한 고난도의 볼륨 렌더링까지 선택한 물리 모델과 수치 근사의 범위에서 시뮬레이션합니다.",
      "textEn": "The discussion so far has assumed that rays are traveling through a vacuum. However, the real world contains participating media such as fog, smoke, dust, or subsurface scattering within translucent materials like skin and marble. Rays passing through media experience absorption, emission, and scattering.",
      "id": "ch01-02-b26"
    },
    {
      "type": "figure",
      "id": "fig:subsurface-head",
      "number": "Figure 1.10",
      "title": "Original Figure 1.10",
      "titleKo": "원문 그림 1.10",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-10.png",
      "captionKo": "그림 1.10 · BSSRDF로 피부 내부의 산란을 모델링한 머리입니다. 빛이 들어간 점과 다른 점에서 나올 수 있게 하면 피부의 사실성이 높아집니다. 모델 제공: Infinite Realities, Inc.",
      "captionEn": "Figure 1.10: Head with Scattering Modeled Using a BSSRDF. Accurately modeling subsurface light transport rather than assuming that light exits the surface at the same point it entered greatly improves the realism of the rendered image. (Model courtesy of Infinite Realities, Inc.)",
      "width": 998,
      "height": 637,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "id": "ch01-02-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch01-02-source-figure-1-4",
      "number": "Figure 1.4",
      "title": "Original Figure 1.4",
      "titleKo": "원문 그림 1.4",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-4.png",
      "captionKo": "그림 1.4 · PBRT로 렌더링한 모아나 섬 장면입니다. 고유 삼각형만 1억 4,600만 개 이상이며, 인스턴싱으로 반복된 형상까지 포함하면 복잡도가 수백억 삼각형 규모가 됩니다. 장면 제공: Walt Disney Animation Studios.",
      "captionEn": "Figure 1.4: Moana Island Scene, Rendered by pbrt . This model from a feature film exhibits the extreme complexity of scenes rendered for movies ( Walt Disney Animation Studios 2018 ). It features over 146 million unique triangles, though the true geometric complexity of the scene is well into the tens of billions of triangles due to extensive use of object instancing. (Scene courtesy of Walt Disney Animation Studios.)",
      "width": 998,
      "height": 441,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch01-02-source-figure-1-7",
      "number": "Figure 1.7",
      "title": "Original Figure 1.7",
      "titleKo": "원문 그림 1.7",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-7.png",
      "captionKo": "그림 1.7 · 수천 개 광원이 있는 장면입니다. 모든 표면 지점에서 모든 광원을 계산하는 대신, 확률적으로 광원을 선택하면 효율적으로 렌더링할 수 있습니다. 장면 제공: Beeple.",
      "captionEn": "Figure 1.7: Scene with Thousands of Light Sources. This scene has far too many lights to consider all of them at each point where the reflected light is computed. Nevertheless, it can be rendered efficiently using stochastic sampling of light sources. (Scene courtesy of Beeple.)",
      "width": 998,
      "height": 460,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch01-02-source-figure-1-9",
      "number": "Figure 1.9",
      "title": "Original Figure 1.9",
      "titleKo": "원문 그림 1.9",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-9.png",
      "captionKo": "그림 1.9 · 입사 방향 ωᵢ의 빛이 표면 p에서 상호작용한 뒤 카메라 방향 ωₒ로 산란됩니다. BRDF는 입사 복사조도의 기여가 특정 출사 방향의 방사휘도로 얼마나 바뀌는지 나타냅니다.",
      "captionEn": "Figure 1.9: The Geometry of Surface Scattering. Incident light arriving along direction omega Subscript normal i interacts with the surface at point normal p Subscript and is scattered back toward the camera along direction omega Subscript normal o . The amount of light scattered toward the camera is given by the product of the incident light energy and the BRDF.",
      "width": 998,
      "height": 250,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch01-02-source-figure-1-11",
      "number": "Figure 1.11",
      "title": "Original Figure 1.11",
      "titleKo": "원문 그림 1.11",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-11.png",
      "captionKo": "그림 1.11 · 초기 광선 추적을 대표하는 거울·유리 구 장면입니다. 원문은 Whitted 방식과 확률적 점진 포톤 매핑(SPPM)을 비교합니다. 후자는 구를 통과해 모이는 빛을 더 충실히 표현합니다. 첨부 PDF는 대화형 비교의 표시 상태만 담습니다.",
      "captionEn": "Figure 1.11: A Prototypical Early Ray Tracing Scene. Note the use of mirrored and glass objects, which emphasizes the algorithm’s ability to handle these kinds of surfaces. (a) Rendered using Whitted’s original ray-tracing algorithm from 1980, and (b) rendered using stochastic progressive photon mapping (SPPM), a modern advanced light transport algorithm. algorithm that will be introduced in Section sec:photon-mapping. SPPM is able to accurately simulate the focusing of light that passes through the spheres.",
      "width": 998,
      "height": 814,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch01-02-source-figure-1-12",
      "number": "Figure 1.12",
      "title": "Original Figure 1.12",
      "titleKo": "원문 그림 1.12",
      "src": "/books/pbrt-4ed/reviewed-images/figure-1-12.png",
      "captionKo": "그림 1.12 · 참여 매질의 방출·산란·흡수를 사용한 폭발 장면입니다. 장면 제공: Jim Price.",
      "captionEn": "Figure 1.12: Explosion Modeled Using Participating Media. Because pbrt is capable of simulating light emission, scattering, and absorption in detailed models of participating media, it is capable of rendering images like this one. (Scene courtesy of Jim Price.)",
      "width": 998,
      "height": 1229,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Introduction/Photorealistic_Rendering_and_the_Ray-Tracing_Algorithm.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "6b74a76f6019b2cd3026fb99c68af4210b9de7c45c9c22072ed9fa1c0825b9ca",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "1.2 Photorealistic Rendering and the Ray-Tracing Algorithm",
      "1.2.1  Cameras and Film",
      "1.2.2  Ray–Object Intersections",
      "1.2.3  Light Distribution",
      "1.2.4  Visibility",
      "1.2.5  Light Scattering at Surfaces",
      "1.2.6  Indirect Light Transport",
      "1.2.7  Ray Propagation"
    ],
    "sourceFigures": [
      "1.2",
      "1.3",
      "1.4",
      "1.5",
      "1.6",
      "1.7",
      "1.8",
      "1.9",
      "1.10",
      "1.11",
      "1.12"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
