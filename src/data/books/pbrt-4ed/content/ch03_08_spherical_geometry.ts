import type { SectionContent } from '../../../../types/book';

export const CH03_08_SPHERICAL_GEOMETRY: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "3",
  "chapterTitleKo": "제3장 기하학과 3차원 변환 (Geometry & Transformations)",
  "sectionNumber": "3.8",
  "sectionTitle": "Spherical Geometry",
  "sectionTitleKo": "3.8 구면 기하학과 방향 표현 (Spherical Geometry)",
  "originalUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
  "prevSection": {
    "id": "ch03-07",
    "title": "3.7 바운딩 박스 (Bounding Boxes & AABB)"
  },
  "nextSection": {
    "id": "ch03-09",
    "title": "3.9 3차원 변환과 행렬 (Transformations)"
  },
  "summary": {
    "keyTakeaways": [
      "평면에서의 각도(Radian)가 단위 원 둘레의 호의 길이이듯, 3차원 공간에서의 **입체각(Solid Angle, 스테라디안 sr)**은 단위 구(Unit Sphere) 표면적에 투영된 영역의 넓이입니다. 전체 구의 입체각은 $4\\pi$ sr, 반구는 $2\\pi$ sr입니다.",
      "구면 좌표계(Spherical Coordinates)는 극각 $\\theta \\in [0, \\pi]$와 방위각 $\\phi \\in [0, 2\\pi)$로 3D 방향을 나타내며, 미소 입체각은 $d\\omega = \\sin\\theta\\,d\\theta\\,d\\phi$로 계산됩니다.",
      "구면 삼각형(Spherical Triangle)의 면적은 지라르(Girard)의 정리에 의해 세 내각의 합에서 $\\pi$를 뺀 초과 각도 $A = a + b + c - \\pi$로 놀랍도록 우아하게 구해집니다.",
      "옥타헤드럴 인코딩은 구면 방향을 정팔면체의 표면에 사상하고 접어 2차원으로 저장합니다. 면적 보존 사상은 아니며 이음매와 양자화 오차가 있습니다.",
      "**방향 원뿔(`DirectionCone`)**은 중심축 $\\mathbf{w}$와 최대 확산각 $\\cos\\theta_{max}$로 3차원 방향들의 집합을 감싸는 바운딩 볼륨으로, 클러스터 셰이딩 및 광원 컬링에서 핵심 역할을 수행합니다."
    ],
    "prerequisites": [
      "3.3절 3차원 벡터 및 내적/외적",
      "고등학교 삼각함수와 미적분학의 중적분 개념"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "3.8 구면 기하학 (Spherical Geometry)",
      "titleEn": "3.8 Spherical Geometry",
      "id": "ch03-08-b1"
    },
    {
      "type": "paragraph",
      "textKo": "렌더링 알고리즘에서 빛의 산란과 반사, 카메라 시선 방향, 광원의 방출 각도를 다룰 때 3차원 공간의 \"방향(Direction)\"을 수학적으로 엄밀하게 표현하는 것은 필수적입니다. 단위 구(Unit Sphere) $S^2$ 상의 기하학인 구면 기하학은 이러한 렌더링 방정식의 뼈대를 형성합니다.",
      "textEn": "Directions in 3D space are naturally represented as points on the unit sphere $S^2$. Spherical geometry is fundamental to physically based rendering, as it underpins the representation of light scattering, camera viewing directions, and illumination integrals.",
      "id": "ch03-08-b2"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.8.1 각도와 입체각 (Angles and Solid Angles)",
      "titleEn": "3.8.1 Angles and Solid Angles",
      "id": "ch03-08-b3"
    },
    {
      "type": "paragraph",
      "textKo": "2차원 평면에서 각도(라디안, Radians)는 반지름이 1인 단위 원(Unit Circle)의 둘레에서 특정 각도가 잘라내는 호의 길이(Arc Length)로 정의됩니다(그림 3.12). 전체 원의 둘레 길이는 $2\\pi$이므로 한 바퀴는 $2\\pi$ 라디안입니다.",
      "textEn": "In 2D, an angle is defined as the length of the arc subtended by the angle on a unit circle (Figure 3.12). The total circumference of a circle is $2\\pi$, so there are $2\\pi$ radians in a full circle.",
      "id": "ch03-08-b4"
    },
    {
      "type": "figure",
      "id": "fig-3-12",
      "number": "Figure 3.12",
      "title": "Original Figure 3.12",
      "titleKo": "원문 그림 3.12",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-12.png",
      "captionKo": "그림 3.12 · 평면각은 단위 원에 투영한 호의 길이로 측정할 수 있습니다. 관찰점에서 물체가 차지하는 벌어짐을 나타냅니다.",
      "captionEn": "Figure 3.12: Planar Angle. The planar angle of an object as seen from a point normal p Subscript is equal to the angle it subtends as seen from normal p Subscript or, equivalently, as the length of the arc s on the unit sphere.",
      "width": 998,
      "height": 255,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "이 개념을 3차원 공간으로 확장한 것이 바로 **입체각(Solid Angle, 기호 $\\omega$ 또는 $\\Omega$)**입니다. 입체각의 단위는 **스테라디안(Steradian, sr)**이며, 반지름이 1인 단위 구(Unit Sphere)의 표면에 어떤 3차원 물체나 각도가 투영되었을 때 생기는 구면 영역의 넓이로 엄밀하게 정의됩니다(그림 3.13). 반지름이 1인 전체 구의 겉넓이는 $4\\pi r^2 = 4\\pi$이므로, 3차원 전방위 공간의 총 입체각은 정확히 $4\\pi$ sr이며, 평면 위의 반구(Hemisphere)는 $2\\pi$ sr입니다.",
      "textEn": "Solid angles extend the concept of angles to 3D. The solid angle subtended by an object is defined as the area of its projection onto the unit sphere (Figure 3.13). The unit of solid angle is the steradian (sr). Since the surface area of a unit sphere is $4\\pi$, there are $4\\pi$ steradians in the entire sphere, and $2\\pi$ steradians in a hemisphere.",
      "id": "ch03-08-b6"
    },
    {
      "type": "figure",
      "id": "fig-3-13",
      "number": "Figure 3.13",
      "title": "Original Figure 3.13",
      "titleKo": "원문 그림 3.13",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-13.png",
      "captionKo": "그림 3.13 · 입체각은 물체를 단위 구면에 투영했을 때 차지하는 면적입니다. 3차원 방향 범위의 크기를 나타냅니다.",
      "captionEn": "Figure 3.13: Solid Angle. The solid angle s subtended by a 3D object is computed by projecting the object onto the unit sphere and measuring the area of its projection.",
      "width": 998,
      "height": 491,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.8.2 구면 좌표계 (Spherical Coordinates)",
      "titleEn": "3.8.2 Spherical Coordinates",
      "id": "ch03-08-b8"
    },
    {
      "type": "paragraph",
      "textKo": "3차원 공간의 단위 방향 벡터는 $z$축으로부터 아래로 기울어진 극각(Polar/Zenith Angle) $\\theta \\in [0, \\pi]$와, $xy$ 평면상에서 $x$축으로부터 회전한 방위각(Azimuthal Angle) $\\phi \\in [0, 2\\pi)$ 두 개의 각도로 표현할 수 있습니다(그림 3.14).",
      "textEn": "Spherical coordinates represent a direction using a polar angle $\\theta \\in [0, \\pi]$ from the $+z$ axis and an azimuthal angle $\\phi \\in [0, 2\\pi]$ around the $+z$ axis in the $xy$ plane (Figure 3.14).",
      "id": "ch03-08-b9"
    },
    {
      "type": "figure",
      "id": "fig-3-14",
      "number": "Figure 3.14",
      "title": "Original Figure 3.14",
      "titleKo": "원문 그림 3.14",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-14.png",
      "captionKo": "그림 3.14 · 구면 다각형의 꼭짓점은 원래 꼭짓점을 향하는 단위 방향입니다. 변은 구 중심과 두 꼭짓점을 지나는 평면이 구면과 만나는 큰원의 일부입니다.",
      "captionEn": "Figure 3.14: A spherical polygon corresponds to the projection of a polygon onto the unit sphere. Its vertices correspond to the unit vectors to the original polygon’s vertices and its edges are defined by the intersection of the sphere and the planes that go through the sphere’s center and two vertices of the polygon.",
      "width": 998,
      "height": 292,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "구면 좌표계 $(\\theta, \\phi)$로부터 3차원 데카르트 직교 단위 벡터 $\\mathbf{v} = (x, y, z)$로의 변환 공식은 삼각함수를 통해 직관적으로 도출됩니다:",
      "textEn": "The Cartesian components $(x, y, z)$ of a unit vector given its spherical coordinates are:",
      "id": "ch03-08-b11"
    },
    {
      "type": "equation",
      "tex": "x = \\sin\\theta \\cos\\phi, \\quad y = \\sin\\theta \\sin\\phi, \\quad z = \\cos\\theta",
      "id": "ch03-08-b12"
    },
    {
      "type": "figure",
      "id": "fig-3-15",
      "number": "Figure 3.15",
      "title": "Original Figure 3.15",
      "titleKo": "원문 그림 3.15",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-15.png",
      "captionKo": "그림 3.15 · 구면 삼각형입니다. 꼭짓점 문자에 대응하는 그리스 문자로 각 꼭짓점의 각도를 표시했습니다.",
      "captionEn": "Figure 3.15: A Spherical Triangle. Each vertex’s angle is labeled with the Greek letter corresponding to the letter used for its vertex.",
      "width": 998,
      "height": 249,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.8.3 구면 삼각형과 면적 (Spherical Triangles)",
      "titleEn": "3.8.3 Spherical Triangles",
      "id": "ch03-08-b14"
    },
    {
      "type": "paragraph",
      "textKo": "단위 구면 위의 세 점을 대원(Great Circle, 구의 중심을 지나는 평면으로 자른 원) 호로 연결하여 만든 도형을 구면 삼각형(Spherical Triangle)이라고 부릅니다. 일반 평면 삼각형의 내각의 합은 항상 $180^\\circ(\\pi)$이지만, 구면 삼각형은 볼록한 곡면 위에 있으므로 내각의 합이 항상 $\\pi$보다 큽니다!",
      "textEn": "A spherical triangle is formed by connecting three points on the unit sphere with arcs of great circles (Figure 3.16). Unlike planar triangles, the sum of angles of a spherical triangle always exceeds $\\pi$.",
      "id": "ch03-08-b15"
    },
    {
      "type": "figure",
      "id": "fig-3-16",
      "number": "Figure 3.16",
      "title": "Original Figure 3.16",
      "titleKo": "원문 그림 3.16",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-16.png",
      "captionKo": "그림 3.16 · 좌표축이 정해지면 방향 벡터와 구면각 (θ,φ)을 서로 변환할 수 있습니다.",
      "captionEn": "Figure 3.16: A direction vector can be written in terms of spherical coordinates left-parenthesis theta comma phi right-parenthesis if the x , y , and z basis vectors are given as well. The spherical angle formulae make it easy to convert between the two representations.",
      "width": 998,
      "height": 269,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "지라르의 정리(Girard's Theorem)에 따르면, 단위 구면상에서 구면 삼각형의 면적(즉, 삼각형이 차지하는 입체각 $A$)은 세 내각의 합에서 $\\pi$를 뺀 구면 과잉(Spherical Excess)과 정확히 같습니다:",
      "textEn": "According to Girard's Theorem, the area $A$ of a spherical triangle on the unit sphere is simply its spherical excess:",
      "id": "ch03-08-b17"
    },
    {
      "type": "equation",
      "tex": "A = \\alpha + \\beta + \\gamma - \\pi",
      "id": "ch03-08-b18"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.8.4 옥타헤드럴 인코딩 (Octahedral Encoding)",
      "titleEn": "3.8.4 Octahedral Encoding",
      "id": "ch03-08-b19"
    },
    {
      "type": "paragraph",
      "textKo": "정규화된 방향을 정팔면체에 사상한 뒤 아래쪽 절반을 접어 정사각형 안에 저장할 수 있습니다. 메모리와 대역폭을 줄이지만, 면적 왜곡이 전혀 없는 사상은 아니며 경계의 중복 표현과 유한 비트 양자화도 고려해야 합니다. 원문은 이 방법과 별도로 면적을 보존하는 사상도 설명합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-08-b20"
    },
    {
      "type": "figure",
      "id": "fig-3-17",
      "number": "Figure 3.17",
      "title": "Original Figure 3.17",
      "titleKo": "원문 그림 3.17",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-17.png",
      "captionKo": "그림 3.17 · xy 평면으로 투영한 반경 r은 sinθ입니다. x=r·cosφ, y=r·sinφ로부터 방위각의 사인과 코사인을 계산할 수 있습니다.",
      "captionEn": "Figure 3.17: The values of sine phi and cosine phi can be computed using the circular coordinate equations x equals r cosine phi and y equals r sine phi , where r , the length of the dashed line, is equal to sine theta .",
      "width": 998,
      "height": 268,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.8.5 방향 원뿔 (Direction Cones)",
      "titleEn": "3.8.5 Direction Cones",
      "id": "ch03-08-b22"
    },
    {
      "type": "paragraph",
      "textKo": "3D 공간의 박스를 `Bounds3`로 감싸듯, 여러 방향들의 묶음(Solid Angles)을 감싸는 바운딩 볼륨으로 **방향 원뿔(`DirectionCone`)**을 사용합니다. 중심 방향 벡터 $\\mathbf{w}$와 최대 확산 각도의 코사인 값 $\\cos\\theta_{max}$로 정의되며, 복합 광원 클러스터링이나 보이지 않는 빛의 조기 제거(Culling)에 결정적입니다.",
      "textEn": "DirectionCone bounds a set of directions on the unit sphere, defined by a central axis vector $\\mathbf{w}$ and a maximum spread angle cosine $\\cos\\theta_{max}$.",
      "id": "ch03-08-b23"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<DirectionCone Definition>>=",
      "code": "class DirectionCone {\n  public:\n    DirectionCone() = default;\n    DirectionCone(Vector3f w, Float cosTheta)\n        : w(Normalize(w)), cosTheta(cosTheta) {}\n\n    bool IsEmpty() const { return cosTheta == Infinity; }\n    static DirectionCone EntireSphere() { return DirectionCone(Vector3f(0, 0, 1), -1); }\n\n    Vector3f w;\n    Float cosTheta = Infinity;\n};\n\n// 특정 방향 w가 원뿔 안에 포함되는지 판별\nbool Inside(const DirectionCone &d, Vector3f w) {\n    return !d.IsEmpty() && Dot(d.w, Normalize(w)) >= d.cosTheta;\n}",
      "provenance": "teaching",
      "id": "ch03-08-b24"
    },
    {
      "type": "subheading",
      "id": "ch03-08-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch03-08-source-figure-3-18",
      "number": "Figure 3.18",
      "title": "Original Figure 3.18",
      "titleKo": "원문 그림 3.18",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-18.png",
      "captionKo": "그림 3.18 · 구에 내접한 팔면체를 위·아래 두 피라미드로 생각합니다. 위쪽을 평면으로 눌러 펼치고 아래쪽 면도 같은 평면에 펼치면 [−1,1]² 좌표로 방향을 표현할 수 있습니다. Meyer 등의 도해에 기반합니다.",
      "captionEn": "Figure 3.18: The OctahedralVector ’s parameterization of the unit sphere can be understood by first considering (a) an octahedron inscribed in the sphere. Its 2D parameterization is then defined by (b) flattening the top pyramid into the z equals 0 plane and (c) unwrapping the bottom half and projecting its triangles onto the same plane. (d) The result allows a simple left-bracket negative 1 comma 1 right-bracket squared parameterization. (Figure after Figure 2 in Meyer et al. ( 2010 ).)",
      "width": 998,
      "height": 213,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch03-08-source-figure-3-19",
      "number": "Figure 3.19",
      "title": "Original Figure 3.19",
      "titleKo": "원문 그림 3.19",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-19.png",
      "captionKo": "그림 3.19 · 단위 정사각형을 원판으로 보낸 뒤 반구로 올립니다. 음영 영역끼리 대응시키며 상대적인 면적 비율을 유지하도록 구성합니다.",
      "captionEn": "Figure 3.19: The uniform hemispherical mapping (a) first transforms the unit square to the unit disk so that the four shaded sectors of the square are mapped to the corresponding shaded sectors of the disk. (b) Points on the disk are then mapped to the hemisphere in a manner that preserves relative area.",
      "width": 998,
      "height": 490,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch03-08-source-figure-3-20",
      "number": "Figure 3.20",
      "title": "Original Figure 3.20",
      "titleKo": "원문 그림 3.20",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-20.png",
      "captionKo": "그림 3.20 · 정사각형에서 원판으로 옮길 반경은 u′+v′=1 직선까지의 부호 있는 거리로 구합니다. 그 절댓값을 1에서 빼면 0~1의 반경을 얻습니다.",
      "captionEn": "Figure 3.20: Computation of the Radius r for the Square-to-Disk Mapping. The signed distance to the u prime plus v Superscript prime Baseline equals 1 line is computed. One minus its absolute value gives a radius between 0 and 1.",
      "width": 998,
      "height": 231,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch03-08-source-figure-3-21",
      "number": "Figure 3.21",
      "title": "Original Figure 3.21",
      "titleKo": "원문 그림 3.21",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-21.png",
      "captionKo": "그림 3.21 · 여러 방향을 하나의 중심 방향과 벌어짐 각도로 나타내는 원뿔 안에 넣습니다. 방향 집합을 보수적으로 감싸는 표현입니다.",
      "captionEn": "Figure 3.21: Bounding a Set of Directions with a Cone. A set of directions, shown here as a shaded region on the sphere, can be bounded using a cone described by a central direction vector bold v and a spread angle theta set such that all the directions in the set are inside the cone.",
      "width": 998,
      "height": 252,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch03-08-source-figure-3-22",
      "number": "Figure 3.22",
      "title": "Original Figure 3.22",
      "titleKo": "원문 그림 3.22",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-22.png",
      "captionKo": "그림 3.22 · 점 p 밖에 있는 바운딩 구의 반경 r과 중심까지 거리 d로 sinθ=r/d를 구하고, sin²θ+cos²θ=1로 코사인을 얻습니다. p가 구 안에 있는 경우는 별도 처리합니다.",
      "captionEn": "Figure 3.22: Finding the Angle That a Bounding Sphere Subtends from a Point normal p Subscript . Given a bounding sphere and a reference point normal p Subscript outside of the sphere, the cosine of the angle theta can be found by first computing sine theta by dividing the sphere’s radius r by the distance d between normal p Subscript and the sphere’s center and then using the identity sine squared theta plus cosine squared theta equals 1 .",
      "width": 998,
      "height": 376,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch03-08-source-figure-3-23",
      "number": "Figure 3.23",
      "title": "Original Figure 3.23",
      "titleKo": "원문 그림 3.23",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-23.png",
      "captionKo": "그림 3.23 · 방향 원뿔 a의 벌어짐이 두 중심축 사이 각도와 b의 벌어짐의 합보다 크면 b 전체가 a 안에 들어갑니다.",
      "captionEn": "Figure 3.23: Determining If One Cone of Directions Is Entirely inside Another. Given two direction cones a and b , their spread angles theta Subscript a and theta Subscript b , and the angle between their two central direction vectors theta Subscript d , we can determine if one cone is entirely inside the other. Here, theta Subscript a Baseline greater-than theta Subscript d Baseline plus theta Subscript b , and so b is inside a .",
      "width": 998,
      "height": 351,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch03-08-source-figure-3-24",
      "number": "Figure 3.24",
      "title": "Original Figure 3.24",
      "titleKo": "원문 그림 3.24",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-24.png",
      "captionKo": "그림 3.24 · 두 방향 원뿔을 함께 감싸는 경우, 해당 구성에서 전체 각도 범위는 두 벌어짐 각과 중심축 사이 각의 합입니다. 새 원뿔의 반각은 그 절반입니다. 포함 관계나 전체 구면을 덮는 예외는 별도로 검사합니다.",
      "captionEn": "Figure 3.24: Computing the Spread Angle of the Direction Cone That Bounds Two Others. If theta Subscript d is the angle between two cones’ central axes and the two cones have spread angles theta Subscript a and theta Subscript b , then the total angle that the cone bounds is theta Subscript a Baseline plus theta Subscript d Baseline plus theta Subscript b and so its spread angle is half of that.",
      "width": 998,
      "height": 336,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Spherical_Geometry.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "c4afc2cdbfd6384fb8df2710f843e0ae51ce3e2896f9d14afb0336ec2b001a6b",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "3.8 Spherical Geometry",
      "3.8.1  Solid Angles",
      "3.8.2  Spherical Polygons",
      "3.8.3  Spherical Parameterizations",
      "Spherical Coordinates",
      "Octahedral Encoding",
      "Equal-Area Mapping",
      "3.8.4  Bounding Directions"
    ],
    "sourceFigures": [
      "3.12",
      "3.13",
      "3.14",
      "3.15",
      "3.16",
      "3.17",
      "3.18",
      "3.19",
      "3.20",
      "3.21",
      "3.22",
      "3.23",
      "3.24"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
