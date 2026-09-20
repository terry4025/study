import type { SectionContent } from '../../../../types/book';

export const CH06_05_TRIANGLE_MESHES: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "6",
  "chapterTitleKo": "제6장 3차원 형상과 교차 검사 (Shapes)",
  "sectionNumber": "6.5",
  "sectionTitle": "Triangle Meshes",
  "sectionTitleKo": "6.5 삼각 메시와 견고한 광선 교차",
  "originalUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
  "prevSection": {
    "id": "ch06-04",
    "title": "6.4 원판(Disk)"
  },
  "nextSection": {
    "id": "ch06-06",
    "title": "6.6 쌍선형 패치 곡면(Bilinear Patches)"
  },
  "summary": {
    "keyTakeaways": [
      "삼각형(Triangle)은 현대 3D 컴퓨터 그래픽스에서 임의의 복잡한 물체를 표현하는 가장 보편적이고 표준적인 기본 프리미티브(Primitive)입니다.",
      "정점과 인덱스를 분리해 공유 정점의 중복 저장을 줄입니다. 절약 비율은 연결 구조·속성·인덱스 크기에 따라 달라집니다.",
      "PBRT 4판의 주 교차기는 광선에 맞춘 이동·축 교환·전단 변환 뒤 에지 함수를 계산합니다. 공유 모서리와 수치 오차를 다루는 과정이 핵심입니다.",
      "무게중심 좌표계 (b0, b1, b2, b0 + b1 + b2 = 1)는 삼각형 내부의 텍스처 좌표, 색상, 그리고 각진 로우폴리곤을 도자기처럼 부드럽게 보이게 만드는 셰이딩 법선(Shading Normal)을 보간하는 핵심 도구입니다."
    ],
    "prerequisites": [
      "점과 벡터·내적·외적",
      "좌표계를 바꿔 같은 기하 문제를 푸는 생각",
      "부동소수점은 실수를 유한 정밀도로 표현한다는 사실"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.5.1 인덱스 기반 삼각 메시 구조 (TriangleMesh Architecture)",
      "titleEn": "6.5.1 Triangle Mesh Representation",
      "id": "ch06-05-b1"
    },
    {
      "type": "paragraph",
      "textKo": "영화나 게임에 등장하는 3D 캐릭터나 배경은 수백만~수억 개의 삼각형으로 이루어져 있습니다. 만약 각 삼각형마다 3개의 3D 정점 좌표를 개별적으로 저장한다면, 인접한 삼각형들이 정점을 공유함에도 불구하고 엄청난 메모리가 낭비됩니다.",
      "textEn": "A scene may contain millions of triangles. Storing independent vertex coordinates for every triangle would be extremely wasteful, since neighboring triangles share vertices.",
      "id": "ch06-05-b2"
    },
    {
      "type": "code",
      "chunkName": "<<pbrt-v4 TriangleMesh>>=",
      "explanationKo": "pbrt-v4 TriangleMesh의 효율적인 정점/인덱스 버퍼 구조",
      "language": "cpp",
      "code": "class TriangleMesh {\n  public:\n    int nTriangles, nVertices;\n    // 인덱스 버퍼: 각 삼각형이 참조하는 3개 정점의 번호 배열 (3 * nTriangles 개)\n    std::vector<int> vertexIndices;\n    // 정점 버퍼: 고유한 3D 정점 위치 배열 (Point3f)\n    std::vector<Point3f> p;\n    // 부가 데이터: 정점 법선(n), 탄젠트(s), 텍스처 좌표(uv)\n    std::vector<Normal3f> n;\n    std::vector<Vector3f> s;\n    std::vector<Point2f> uv;\n};",
      "provenance": "teaching",
      "id": "ch06-05-b3"
    },
    {
      "type": "figure",
      "id": "fig-6-19",
      "number": "Figure 6.19",
      "title": "Original Figure 6.19",
      "titleKo": "원문 그림 6.19",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-19.png",
      "captionKo": "그림 6.19 · 구면 삼각형 위의 입사 코사인 인자는 매끄럽게 변합니다. 이 샘플링 방법으로 [0,1]²로 되돌려도 지나친 왜곡이나 불연속 없이 매끄러운 분포를 얻습니다.",
      "captionEn": "Figure 6.19: (a) The cosine theta factor varies smoothly over the area of a spherical triangle. (b) If it is mapped back to the left-bracket 0 comma 1 right-bracket squared sampling domain, it also varies smoothly there, thanks to the sampling algorithm not introducing any discontinuities or excessive distortion.",
      "width": 998,
      "height": 336,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.5.3 광선에 맞춘 좌표 변환과 에지 함수",
      "titleEn": "6.5.2 Möller–Trumbore Ray–Triangle Intersection",
      "id": "ch06-05-b5"
    },
    {
      "type": "paragraph",
      "textKo": "공유 모서리를 지나는 광선을 두 삼각형이 모두 놓치면 실제로 없는 틈이 나타납니다. PBRT 4판의 주 교차 구현은 묄러–트룸보어 알고리즘이 아니라, 광선을 기준으로 좌표를 바꾸고 에지 함수를 계산하는 견고한 방법입니다. 먼저 정점을 광선 원점만큼 평행이동하고, 광선 방향의 절댓값이 가장 큰 성분을 z로 놓도록 축을 바꿉니다. 다음 전단 변환으로 광선 방향을 z축에 맞추면, xy평면에서 원점이 삼각형의 어느 쪽에 있는지 검사할 수 있습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-05-b6"
    },
    {
      "type": "figure",
      "id": "fig-6-20",
      "number": "Figure 6.20",
      "title": "Original Figure 6.20",
      "titleKo": "원문 그림 6.20",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-20.png",
      "captionKo": "그림 6.20 · [0,1]²에서 표본을 입사 코사인 분포에 가깝게 먼저 변형한 뒤 구면 삼각형에 매핑하면, 최종 표본도 대략 코사인에 비례하게 배치됩니다.",
      "captionEn": "Figure 6.20: If (a) uniform sample points are warped to (b) approximate the distribution of the incident cosine factor in left-bracket 0 comma 1 right-bracket squared before being used with the spherical triangle sampling algorithm, then (c) the resulting points in the triangle are approximately cosine-distributed.",
      "width": 998,
      "height": 338,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "변환된 정점의 xy성분으로 세 에지 함수를 구합니다. 부호가 섞이면 원점이 삼각형 바깥에 있으므로 빗나간 것입니다. 에지 값이 정확히 0일 때는 단정밀도 곱셈만으로 공유 경계를 불일치하게 판단하지 않도록 더 높은 정밀도로 다시 계산합니다. 세 값의 합인 행렬식이 0이면 퇴화한 투영이므로 제외합니다. 비음수 무게중심 좌표는 한 점을 세 꼭짓점의 가중 평균으로 나타낸 값입니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-05-b8"
    },
    {
      "type": "equation",
      "tex": "p(b_1, b_2) = (1 - b_1 - b_2) p_0 + b_1 p_1 + b_2 p_2 = p_0 + b_1 e_1 + b_2 e_2",
      "explanationKo": "삼각형의 무게중심 매개변수 표현식",
      "id": "ch06-05-b9"
    },
    {
      "type": "paragraph",
      "textKo": "같은 변환에서 정점의 z성분과 에지 값으로 교차 매개변수의 분자를 구합니다. 나눗셈 전에 부호에 맞춰 t의 유효 구간을 검사하고, 통과하면 행렬식으로 나누어 t와 무게중심 좌표를 얻습니다. 원문은 이어 t의 수치 오차 상한 δt를 계산하여 광선 뒤쪽의 가짜 교차를 받아들이지 않도록 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-05-b10"
    },
    {
      "type": "equation",
      "tex": "e_0=x_1y_2-y_1x_2,\\quad e_1=x_2y_0-y_2x_0,\\quad e_2=x_0y_1-y_0x_1,\\quad b_i=\\frac{e_i}{e_0+e_1+e_2}",
      "explanationKo": "위치는 광선에 맞춰 이동·축 교환·전단한 좌표입니다. 분모가 0인 경우는 별도로 제외합니다. 이 식만으로 원문의 전체 오차 분석이 대체되지는 않습니다.",
      "id": "ch06-05-b11"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "무게중심 좌표와 알고리즘을 구분합니다",
      "summary": "무게중심 좌표와 알고리즘을 구분합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "무게중심 좌표는 다양한 교차 알고리즘이 공통으로 사용하는 표현입니다. 이를 쓴다고 모두 묄러–트룸보어 알고리즘인 것은 아닙니다. PBRT는 좌표 변환·에지 함수·오차 한계 계산을 사용합니다. 정점 법선의 보간도 실제 삼각형의 윤곽이나 교차 형상을 바꾸지는 않습니다."
        }
      ],
      "id": "ch06-05-b12"
    },
    {
      "type": "figure",
      "id": "fig-6-21",
      "number": "Figure 6.21",
      "title": "Original Figure 6.21",
      "titleKo": "원문 그림 6.21",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-21.png",
      "captionKo": "그림 6.21 · 구면 삼각형 안의 방향 ω가 주어졌을 때 b와 ω를 지나는 큰원, a와 c를 지나는 큰원의 교차로 c′를 구할 수 있습니다. 샘플링을 거꾸로 계산하는 데 사용합니다.",
      "captionEn": "Figure 6.21: Given a spherical triangle bold a bold b bold c and a direction omega Subscript that is inside it, the vertex bold c prime along the edge from bold a to bold c can be found from the intersection of the great circle that passes through bold b and omega Subscript and the great circle that passes through bold a and bold c .",
      "width": 998,
      "height": 336,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.5.3 셰이딩 법선 보간 (Phong Shading Normal)",
      "titleEn": "6.5.3 Shading Normal Interpolation",
      "id": "ch06-05-b14"
    },
    {
      "type": "paragraph",
      "textKo": "삼각형은 평평하므로 본래의 기하 법선($n_{\\text{geom}} = e_1 \\times e_2$)을 그대로 쓰면 각 삼각형 경계면마다 모서리가 도드라져 보이는 각진(Facetted) 로우폴리곤 그래픽이 됩니다.",
      "textEn": "Using the flat geometric normal yields a faceted appearance where triangle boundaries are clearly visible.",
      "id": "ch06-05-b15"
    },
    {
      "type": "paragraph",
      "id": "fig-6-23",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "equation",
      "tex": "n_{\\text{shading}} = \\operatorname{Normalize}\\left((1 - b_1 - b_2) n_0 + b_1 n_1 + b_2 n_2\\right)",
      "explanationKo": "부드러운 셰이딩 법선 벡터 보간 공식",
      "id": "ch06-05-b17"
    },
    {
      "type": "paragraph",
      "id": "fig-6-24",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "id": "fig-6-25",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "paragraph",
      "id": "fig-tri-render",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "첨부 원문의 교차 구현과 수치 오차 처리",
      "id": "ch06-05-b21"
    },
    {
      "type": "code",
      "id": "ch06-05-reviewed-intersection",
      "chunkName": "원문 발췌 · IntersectTriangle",
      "language": "cpp",
      "code": "pstd::optional<TriangleIntersection>\nIntersectTriangle(const Ray &ray, Float tMax, Point3f p0, Point3f p1,\n                  Point3f p2) {\n    if (LengthSquared(Cross(p2 - p0, p1 - p0)) == 0)\n           return {};\n    Point3f p0t = p0 - Vector3f(ray.o);\n          Point3f p1t = p1 - Vector3f(ray.o);\n          Point3f p2t = p2 - Vector3f(ray.o);\n       int kz = MaxComponentIndex(Abs(ray.d));\n          int kx = kz + 1; if (kx == 3) kx = 0;\n          int ky = kx + 1; if (ky == 3) ky = 0;\n          Vector3f d = Permute(ray.d, {kx, ky, kz});\n          p0t = Permute(p0t, {kx, ky, kz});\n          p1t = Permute(p1t, {kx, ky, kz});\n          p2t = Permute(p2t, {kx, ky, kz});\n       Float Sx = -d.x / d.z;\n          Float Sy = -d.y / d.z;\n          Float Sz = 1 / d.z;\n          p0t.x += Sx * p0t.z;\n          p0t.y += Sy * p0t.z;\n          p1t.x += Sx * p1t.z;\n          p1t.y += Sy * p1t.z;\n          p2t.x += Sx * p2t.z;\n          p2t.y += Sy * p2t.z;\n    Float e0 = DifferenceOfProducts(p1t.x, p2t.y, p1t.y, p2t.x);\n       Float e1 = DifferenceOfProducts(p2t.x, p0t.y, p2t.y, p0t.x);\n       Float e2 = DifferenceOfProducts(p0t.x, p1t.y, p0t.y, p1t.x);\n    if (sizeof(Float) == sizeof(float) &&\n           (e0 == 0.0f || e1 == 0.0f || e2 == 0.0f)) {\n           double p2txp1ty = (double)p2t.x * (double)p1t.y;\n           double p2typ1tx = (double)p2t.y * (double)p1t.x;\n           e0 = (float)(p2typ1tx - p2txp1ty);\n           double p0txp2ty = (double)p0t.x * (double)p2t.y;\n           double p0typ2tx = (double)p0t.y * (double)p2t.x;\n           e1 = (float)(p0typ2tx - p0txp2ty);\n           double p1txp0ty = (double)p1t.x * (double)p0t.y;\n           double p1typ0tx = (double)p1t.y * (double)p0t.x;\n           e2 = (float)(p1typ0tx - p1txp0ty);\n       }\n    if ((e0 < 0 || e1 < 0 || e2 < 0) && (e0 > 0 || e1 > 0 || e2 > 0))\n           return {};\n       Float det = e0 + e1 + e2;\n       if (det == 0)\n           return {};\n    p0t.z *= Sz;\n       p1t.z *= Sz;\n       p2t.z *= Sz;\n       Float tScaled = e0 * p0t.z + e1 * p1t.z + e2 * p2t.z;\n       if (det < 0 && (tScaled >= 0 || tScaled < tMax * det))\n           return {};\n       else if (det > 0 && (tScaled <= 0 || tScaled > tMax * det))\n           return {};\n    Float invDet = 1 / det;\n       Float b0 = e0 * invDet, b1 = e1 * invDet, b2 = e2 * invDet;\n       Float t = tScaled * invDet;\n       \n    Float maxZt = MaxComponentValue(Abs(Vector3f(p0t.z, p1t.z, p2t.z)));\n          Float deltaZ = gamma(3) * maxZt;\n       Float maxXt = MaxComponentValue(Abs(Vector3f(p0t.x, p1t.x, p2t.x)));\n          Float maxYt = MaxComponentValue(Abs(Vector3f(p0t.y, p1t.y, p2t.y)));\n          Float deltaX = gamma(5) * (maxXt + maxZt);\n          Float deltaY = gamma(5) * (maxYt + maxZt);\n       Float deltaE = 2 * (gamma(2) * maxXt * maxYt + deltaY * maxXt +\n                              deltaX * maxYt);\n       Float maxE = MaxComponentValue(Abs(Vector3f(e0, e1, e2)));\n          Float deltaT = 3 * (gamma(3) * maxE * maxZt + deltaE * maxZt +\n                              deltaZ * maxE) * std::abs(invDet);\n          if (t <= deltaT)\n              return {};\n    return TriangleIntersection{b0, b1, b2, t};\n}",
      "explanationKo": "원문에서 펼친 코드입니다. 공유 경계 재계산과 δt 검사를 포함합니다. PBRT의 타입·보조 함수가 필요한 코드 발췌입니다.",
      "provenance": "source-excerpt"
    },
    {
      "type": "subheading",
      "id": "ch06-05-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch06-05-source-figure-6-11",
      "number": "Figure 6.11",
      "title": "Original Figure 6.11",
      "titleKo": "원문 그림 6.11",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-11.png",
      "captionKo": "그림 6.11 · 구조광 3차원 스캐너로 실제 조각상을 측정해 만든 가네샤 메시입니다. 400만 개 이상의 삼각형으로 이루어져 있습니다.",
      "captionEn": "Figure 6.11: Ganesha Model. This triangle mesh contains over four million individual triangles. It was created from a real statue using a 3D scanner that uses structured light to determine shapes of objects.",
      "width": 998,
      "height": 998,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-05-source-figure-6-12",
      "number": "Figure 6.12",
      "title": "Original Figure 6.12",
      "titleKo": "원문 그림 6.12",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-12.png",
      "captionKo": "그림 6.12 · 좌표를 바꾸어 광선 원점을 (0,0,0), 방향을 +z로 맞춥니다. 그러면 xy에 투영된 삼각형 안에 (0,0)이 있는지 검사하는 문제로 줄일 수 있습니다.",
      "captionEn": "Figure 6.12: In the ray–triangle intersection coordinate system, the ray starts at the origin and goes along the plus z axis. The intersection test can be performed by considering only the x y projection of the ray and the triangle vertices, which in turn reduces to determining if the 2D point left-parenthesis 0 comma 0 right-parenthesis is within the triangle.",
      "width": 998,
      "height": 225,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-05-source-figure-6-13",
      "number": "Figure 6.13",
      "title": "Original Figure 6.13",
      "titleKo": "원문 그림 6.13",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-13.png",
      "captionKo": "그림 6.13 · 두 변의 외적 길이는 평행사변형 넓이이고, 삼각형 넓이는 그 절반입니다.",
      "captionEn": "Figure 6.13: The area of a triangle with two edges given by vectors bold v 1 and bold v 2 is one-half of the area of the parallelogram shown here. The parallelogram area is given by the length of the cross product of bold v 1 and bold v 2 .",
      "width": 998,
      "height": 326,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-05-source-figure-6-14",
      "number": "Figure 6.14",
      "title": "Original Figure 6.14",
      "titleKo": "원문 그림 6.14",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-14.png",
      "captionKo": "그림 6.14 · 방향이 있는 변을 기준으로 점이 왼쪽·선 위·오른쪽인지 에지 함수의 부호로 판단합니다. 이 알고리즘의 에지 함수는 세 점이 만드는 부호 있는 삼각형 넓이의 두 배에 해당합니다.",
      "captionEn": "Figure 6.14: The edge function e left-parenthesis normal p Subscript Baseline right-parenthesis characterizes points with respect to an oriented line between two points normal p 0 and normal p 1 . The value of the edge function is positive for points normal p Subscript to the left of the line, zero for points on the line, and negative for points to the right of the line. The ray–triangle intersection algorithm uses an edge function that is twice the signed area of the triangle formed by the three points.",
      "width": 998,
      "height": 373,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-05-source-figure-6-15",
      "number": "Figure 6.15",
      "title": "Original Figure 6.15",
      "titleKo": "원문 그림 6.15",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-15.png",
      "captionKo": "그림 6.15 · 단위 정사각형에서 x+y=1을 기준으로 뒤집으면 단위 직각삼각형으로 표본을 보낼 수 있습니다. 하지만 멀리 떨어진 두 점이 가까운 점으로 옮겨질 수 있습니다.",
      "captionEn": "Figure 6.15: Samples from the unit square can be mapped to the unit right triangle by reflecting across the x plus y equals 1 diagonal, though doing so causes far away samples on the square to map to nearby points on the triangle.",
      "width": 998,
      "height": 195,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-05-source-figure-6-16",
      "number": "Figure 6.16",
      "title": "Original Figure 6.16",
      "titleKo": "원문 그림 6.16",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-16.png",
      "captionKo": "그림 6.16 · 삼각형 광원을 면적에 균일하게 뽑는 방식과 입체각에 균일하게 뽑는 방식의 비교입니다. 광원 가까이에서 후자의 오차가 작으며, 원문 장면에서는 MSE가 3.86배 줄었습니다. 용 모델 제공: Stanford Computer Graphics Laboratory.",
      "captionEn": "Figure 6.16: A Scene Where Solid Angle Triangle Sampling Is Beneficial. When points on triangles are sampled using uniform area sampling, error is high at points on the ground close to the emitter. If points are sampled on the triangle by uniformly sampling the solid angle the triangle subtends, then the remaining non-constant factors in the estimator are both between 0 and 1, which results in much lower error. For this scene, mean squared error (MSE) is reduced by a factor of 3.86 . (Dragon model courtesy of the Stanford Computer Graphics Laboratory.)",
      "width": 998,
      "height": 764,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-05-source-figure-6-17",
      "number": "Figure 6.17",
      "title": "Original Figure 6.17",
      "titleKo": "원문 그림 6.17",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-17.png",
      "captionKo": "그림 6.17 · 구면 삼각형의 꼭짓점 a,b,c와 각각 마주 보는 변, 내부 각 α,β,γ의 표기입니다.",
      "captionEn": "Figure 6.17: Geometric Setting for Spherical Triangles. Given vertices bold a , bold b , and bold c , the respective opposite edges are labeled bold a overbar , bold b overbar , and bold c overbar and the interior angles are labeled with Greek letters alpha , beta , and gamma .",
      "width": 998,
      "height": 296,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-05-source-figure-6-18",
      "number": "Figure 6.18",
      "title": "Original Figure 6.18",
      "titleKo": "원문 그림 6.18",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-18.png",
      "captionKo": "그림 6.18 · 먼저 목표 면적을 가진 구면 삼각형 a,b,c′가 되도록 c′를 정합니다. 이어 b와 c′ 사이의 호에서 방향을 선택합니다.",
      "captionEn": "Figure 6.18: (a) After sampling a triangle area, the first step of the sampling algorithm finds the vertex bold c prime that gives a spherical triangle bold a bold b bold c prime with that area. The vertices bold a and bold b and the edge bold c overbar are shared with the original triangle. (b) Given bold c prime , a direction omega Subscript is sampled along the arc between bold b and bold c prime .",
      "width": 998,
      "height": 272,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "0e678755a02edb7230a33a21824ff493f5db08a2cd98eebf10ef938e7c354892",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "6.5 Triangle Meshes",
      "6.5.1  Mesh Representation and Storage",
      "6.5.2  Triangle Class",
      "6.5.3  Ray–Triangle Intersection",
      "6.5.4  Sampling"
    ],
    "sourceFigures": [
      "6.11",
      "6.12",
      "6.13",
      "6.14",
      "6.15",
      "6.16",
      "6.17",
      "6.18",
      "6.19",
      "6.20",
      "6.21"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
