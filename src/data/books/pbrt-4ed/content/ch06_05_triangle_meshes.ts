import { SectionContent } from '../../../../types/book';

export const CH06_05_TRIANGLE_MESHES: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '6',
  chapterTitleKo: '제6장 3차원 형상과 교차 검사 (Shapes)',
  sectionNumber: '6.5',
  sectionTitle: 'Triangle Meshes',
  sectionTitleKo: '6.5 삼각 메시와 묄러-트룸보어 알고리즘 (Triangle Meshes)',
  originalUrl: 'https://pbr-book.org/4ed/Shapes/Triangle_Meshes.html',
  prevSection: {
    id: 'ch06-04',
    title: '6.4 원판(Disk)',
  },
  nextSection: {
    id: 'ch06-06',
    title: '6.6 쌍선형 패치 곡면(Bilinear Patches)',
  },
  summary: {
    keyTakeaways: [
      '삼각형(Triangle)은 현대 3D 컴퓨터 그래픽스에서 임의의 복잡한 물체를 표현하는 가장 보편적이고 표준적인 기본 프리미티브(Primitive)입니다.',
      'pbrt의 TriangleMesh는 중복 정점을 절약하기 위해 정점 버퍼(Vertex Buffer)와 인덱스 버퍼(Index Buffer)를 분리하여 메모리를 3배 이상 절약합니다.',
      '묄러-트룸보어(Möller-Trumbore) 광선-삼각형 교차 알고리즘은 평면 방정식을 직접 구하지 않고, 크래머 공식(Cramer\'s Rule)과 스칼라 삼중적을 이용해 교차 거리 t와 무게중심 좌표 (b1, b2)를 초고속으로 계산합니다.',
      '무게중심 좌표계 (b0, b1, b2, b0 + b1 + b2 = 1)는 삼각형 내부의 텍스처 좌표, 색상, 그리고 각진 로우폴리곤을 도자기처럼 부드럽게 보이게 만드는 셰이딩 법선(Shading Normal)을 보간하는 핵심 도구입니다.'
    ],
    prerequisites: [
      '3차원 선형대수학: 벡터의 외적(Cross Product)과 내적(Dot Product)',
      '스칼라 삼중적 (Scalar Triple Product: a · (b × c))',
      '크래머 공식 (Cramer\'s Rule: 행렬식 기반 연립방정식 풀이)',
      '무게중심 좌표계 (Barycentric Coordinates)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.5.1 인덱스 기반 삼각 메시 구조 (TriangleMesh Architecture)',
      titleEn: '6.5.1 Triangle Mesh Representation'
    },
    {
      type: 'paragraph',
      textKo: '영화나 게임에 등장하는 3D 캐릭터나 배경은 수백만~수억 개의 삼각형으로 이루어져 있습니다. 만약 각 삼각형마다 3개의 3D 정점 좌표를 개별적으로 저장한다면, 인접한 삼각형들이 정점을 공유함에도 불구하고 엄청난 메모리가 낭비됩니다.',
      textEn: 'A scene may contain millions of triangles. Storing independent vertex coordinates for every triangle would be extremely wasteful, since neighboring triangles share vertices.'
    },
    {
      type: 'code',
      chunkName: '<<pbrt-v4 TriangleMesh>>=',
      explanationKo: 'pbrt-v4 TriangleMesh의 효율적인 정점/인덱스 버퍼 구조',
      language: 'cpp',
      code: `class TriangleMesh {
  public:
    int nTriangles, nVertices;
    // 인덱스 버퍼: 각 삼각형이 참조하는 3개 정점의 번호 배열 (3 * nTriangles 개)
    std::vector<int> vertexIndices;
    // 정점 버퍼: 고유한 3D 정점 위치 배열 (Point3f)
    std::vector<Point3f> p;
    // 부가 데이터: 정점 법선(n), 탄젠트(s), 텍스처 좌표(uv)
    std::vector<Normal3f> n;
    std::vector<Vector3f> s;
    std::vector<Point2f> uv;
};`
    },
    {
      type: 'figure',
      id: 'fig-6-19',
      number: 'Figure 6.19',
      title: 'Shared vertex indexing in a triangle mesh, where multiple triangles reference shared vertices',
      titleKo: '삼각형 메시에서 정점과 면의 인덱스 공유 구조',
      src: '/books/pbrt-4ed/images/pha06f19.svg',
      captionKo: 'Figure 6.19: 삼각형 메시에서 정점과 면의 인덱스 공유 구조. 4개의 정점만으로 2개의 삼각형이 완벽히 표현됩니다.',
      captionEn: 'Figure 6.19: Shared vertex indexing in a triangle mesh, where multiple triangles reference shared vertices.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.5.2 묄러-트룸보어(Möller-Trumbore) 광선-삼각형 교차 알고리즘',
      titleEn: '6.5.2 Möller–Trumbore Ray–Triangle Intersection'
    },
    {
      type: 'paragraph',
      textKo: '전통적인 광선-삼각형 교차 검사는 먼저 삼각형이 속한 무한 평면과의 교점을 구한 뒤, 그 점이 삼각형 3개 모서리 안쪽에 있는지 검사하는 2단계 방식을 썼습니다. 하지만 1997년 토마스 묄러와 벤 트룸보어가 제안한 알고리즘은 **평면 방정식을 아예 구하지 않고**, 광선 방정식과 삼각형의 무게중심 좌표 방정식을 직접 연립하여 단 한 방에 풀어냅니다.',
      textEn: 'Traditional intersection tests first intersect the ray with the plane of the triangle and then test if the hit point is inside the three edges. The Möller–Trumbore algorithm bypasses plane equation setup entirely by solving for t and the barycentric coordinates simultaneously.'
    },
    {
      type: 'figure',
      id: 'fig-6-20',
      number: 'Figure 6.20',
      title: 'Triangle vertices p0, p1, p2 and edge vectors e1 and e2',
      titleKo: '삼각형의 세 꼭짓점 p0, p1, p2와 변 벡터 e1 = p1 - p0, e2 = p2 - p0',
      src: '/books/pbrt-4ed/images/pha06f20.svg',
      captionKo: 'Figure 6.20: 삼각형의 세 꼭짓점 p0, p1, p2와 변 벡터 e1 = p1 - p0, e2 = p2 - p0.',
      captionEn: 'Figure 6.20: Triangle vertices p0, p1, p2 and edge vectors e1 and e2.'
    },
    {
      type: 'paragraph',
      textKo: '삼각형 내부의 임의의 점 $p$는 두 변 벡터 $e_1 = p_1 - p_0$, $e_2 = p_2 - p_0$와 무게중심 가중치 $b_1, b_2$의 선형 결합으로 표현됩니다:',
      textEn: 'A point p in the triangle can be written in terms of edge vectors e1 and e2:'
    },
    {
      type: 'equation',
      tex: 'p(b_1, b_2) = (1 - b_1 - b_2) p_0 + b_1 p_1 + b_2 p_2 = p_0 + b_1 e_1 + b_2 e_2',
      explanationKo: '삼각형의 무게중심 매개변수 표현식'
    },
    {
      type: 'paragraph',
      textKo: '이 점이 광선의 궤적 $o + t d$와 만난다고 두면 다음과 같은 $3 \\times 3$ 선형 연립방정식이 구성됩니다:',
      textEn: 'Equating the ray equation o + td to the triangle point gives:'
    },
    {
      type: 'equation',
      tex: 'o + t d = p_0 + b_1 e_1 + b_2 e_2 \\implies \\begin{bmatrix} -d & e_1 & e_2 \\end{bmatrix} \\begin{bmatrix} t \\\\ b_1 \\\\ b_2 \\end{bmatrix} = o - p_0',
      explanationKo: '묄러-트룸보어 선형 행렬 방정식'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 기초 콕콕',
      title: "크래머 공식(Cramer's Rule)과 스칼라 삼중적",
      summary: '역행렬 계산 없이 외적과 내적 3번만으로 교차 거리와 무게중심 좌표를 구하는 마법',
      points: [
        {
          title: '선형대수학 트릭의 극치',
          content: '3x3 연립방정식을 풀 때 역행렬을 구하지 않고, 크래머 공식과 벡터 삼중적 a·(b×c)의 치환 트릭을 사용하여 단 두 번의 외적(Cross)과 몇 번의 내적(Dot)만으로 t, b1, b2를 동시에 산출합니다!\n\n- b1 < 0 또는 b2 < 0 또는 b1 + b2 > 1 이면? -> 삼각형 바깥을 지나쳤으므로 즉시 탈락!\n- t < 0 또는 t > t_max 이면? -> 카메라 뒤편이거나 다른 물체에 가려졌으므로 탈락!\n\n조건을 만족하면 단 10~15줄의 C++ 코드로 삼각형 충돌이 100% 완벽하게 처리됩니다.'
        }
      ]
    },
    {
      type: 'figure',
      id: 'fig-6-21',
      number: 'Figure 6.21',
      title: 'Geometric interpretation of the Möller–Trumbore intersection algorithm',
      titleKo: '묄러-트룸보어 알고리즘의 기하학적 투영 해석',
      src: '/books/pbrt-4ed/images/pha06f21.svg',
      captionKo: 'Figure 6.21: 묄러-트룸보어 알고리즘의 기하학적 투영 해석. 광선 방향 d와 모서리 e2의 외적(pvec = d × e2)이 평면 법선 투영 역할을 합니다.',
      captionEn: 'Figure 6.21: Geometric interpretation of the Möller–Trumbore intersection algorithm.'
    },
    {
      type: 'subheading',
      level: 2,
      titleKo: '6.5.3 셰이딩 법선 보간 (Phong Shading Normal)',
      titleEn: '6.5.3 Shading Normal Interpolation'
    },
    {
      type: 'paragraph',
      textKo: '삼각형은 평평하므로 본래의 기하 법선($n_{\\text{geom}} = e_1 \\times e_2$)을 그대로 쓰면 각 삼각형 경계면마다 모서리가 도드라져 보이는 각진(Facetted) 로우폴리곤 그래픽이 됩니다.',
      textEn: 'Using the flat geometric normal yields a faceted appearance where triangle boundaries are clearly visible.'
    },
    {
      type: 'figure',
      id: 'fig-6-23',
      number: 'Figure 6.23',
      title: 'Interpolating vertex normals using barycentric coordinates across the triangle face',
      titleKo: '정점 법선의 무게중심 보간',
      src: '/books/pbrt-4ed/images/pha06f23.svg',
      captionKo: 'Figure 6.23: 정점 법선의 무게중심 보간. 세 꼭짓점의 법선 n0, n1, n2를 무게중심 가중치로 가중합하여 매끄러운 셰이딩 법선 n_shading을 만듭니다.',
      captionEn: 'Figure 6.23: Interpolating vertex normals using barycentric coordinates across the triangle face.'
    },
    {
      type: 'equation',
      tex: 'n_{\\text{shading}} = \\operatorname{Normalize}\\left((1 - b_1 - b_2) n_0 + b_1 n_1 + b_2 n_2\\right)',
      explanationKo: '부드러운 셰이딩 법선 벡터 보간 공식'
    },
    {
      type: 'figure',
      id: 'fig-6-24',
      number: 'Figure 6.24',
      title: 'Comparison between true geometric face normals and smoothly interpolated shading normals',
      titleKo: '기하 법선(Face Normal)과 보간된 셰이딩 법선(Shading Normal)의 차이',
      src: '/books/pbrt-4ed/images/pha06f24.svg',
      captionKo: 'Figure 6.24: 기하 법선(Face Normal)과 보간된 셰이딩 법선(Shading Normal)의 차이.',
      captionEn: 'Figure 6.24: Comparison between true geometric face normals and smoothly interpolated shading normals.'
    },
    {
      type: 'figure',
      id: 'fig-6-25',
      number: 'Figure 6.25',
      title: 'Surface area of a triangle given by half the magnitude of the cross product of two edges',
      titleKo: '삼각형 면적 계산',
      src: '/books/pbrt-4ed/images/pha06f25.svg',
      captionKo: 'Figure 6.25: 삼각형 면적 계산. 두 모서리 벡터의 외적 크기의 절반과 같습니다.',
      captionEn: 'Figure 6.25: Surface area of a triangle given by half the magnitude of the cross product of two edges.'
    },
    {
      type: 'figure',
      id: 'fig-tri-render',
      number: 'Rendering tri',
      title: 'A high-polygon triangle mesh rendered with pbrt-v4 demonstrating smooth shading normals and precise Möller–Trumbore intersections',
      titleKo: 'pbrt-v4로 렌더링한 복잡한 고해상도 삼각 메시 조각상 씬',
      src: '/books/pbrt-4ed/images/tri-sample-image.png',
      captionKo: 'pbrt-v4로 렌더링한 복잡한 고해상도 삼각 메시 조각상 씬.',
      captionEn: 'A high-polygon triangle mesh rendered with pbrt-v4 demonstrating smooth shading normals and precise Möller–Trumbore intersections.'
    }
  ]
};
