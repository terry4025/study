import { SectionContent } from '../../../../types/book';

export const CH03_09_TRANSFORMATIONS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.9',
  sectionTitle: 'Transformations',
  sectionTitleKo: '3.9 3차원 동차 변환 행렬 (Transformations)',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/Transformations.html',
  prevSection: {
    id: 'ch03-08',
    title: '3.8 구면 기하학과 방향 표현',
  },
  nextSection: {
    id: 'ch03-10',
    title: '3.10 변환 적용과 법선 벡터의 역전치 변환',
  },
  summary: {
    keyTakeaways: [
      '3차원 공간의 선형 변환(회전, 확대축소)과 아핀 이동(평행이동)을 하나의 통합된 행렬 곱셈으로 처리하기 위해 4차원 **동차 좌표계(Homogeneous Coordinates)**를 도입합니다.',
      '동차 좌표계에서 점은 $w=1$, 벡터는 $w=0$으로 표현됩니다. $w=0$ 덕분에 벡터에 변환 행렬을 곱할 때 평행이동 성분이 자동으로 소거되어 방향성만 유지됩니다.',
      'pbrt의 `Transform` 클래스는 변환 행렬 $M$과 그 **역행렬 $M^{-1}$을 항상 쌍으로 보관**합니다. 렌더링 중 역변환이 빈번히 요구되는데, 매번 무거운 행렬 역원 수치해석을 수행하지 않고 $O(1)$로 즉시 역변환을 적용하기 위함입니다.',
      '행렬식(Determinant)이 음수($\\det(M) < 0$)이면 공간이 반전(Reflection)되어 왼손 좌표계와 오른손 좌표계가 서로 뒤바뀌므로, 표면 앞뒤 판정(Face-forward)을 위해 `SwapsHandedness()` 검사가 필수적입니다.',
      '`LookAt(pos, look, up)` 변환은 카메라의 3D 위치, 시선 목표점, 상단 업 벡터를 받아 월드 공간을 카메라 뷰 공간(원점 위치, $+z$ 방향 시선)으로 정렬하는 렌더러의 핵심 뷰 행렬을 생성합니다.'
    ],
    prerequisites: [
      '선형대수학: 4x4 행렬 곱셈, 역행렬, 행렬식(Determinant)',
      '3.1절 좌표계 및 아핀 공간'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '3.9 3차원 변환 (Transformations)',
      titleEn: '3.9 Transformations'
    },
    {
      type: 'paragraph',
      textKo: '변환(Transformation)은 3차원 공간의 점과 벡터를 다른 점과 벡터로 매핑하는 수학적 함수입니다. 기하학적으로 변환은 모델의 위치 이동(Translation), 크기 조절(Scaling), 회전(Rotation)뿐 아니라, 3차원 월드 공간에서 카메라의 시선 공간으로의 좌표계 변경(Look-At Viewing), 원근 투영(Perspective Projection)에 이르기까지 렌더링 시스템 전반에 걸쳐 사용됩니다.',
      textEn: 'A transformation is a function that maps points to points and vectors to vectors. Transformations are used in computer graphics to place objects in a scene, animate them, transform them between coordinate systems, and project 3D scenes onto 2D image planes.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.9.1 동차 좌표계 (Homogeneous Coordinates)',
      titleEn: '3.9.1 Homogeneous Coordinates'
    },
    {
      type: 'paragraph',
      textKo: '3차원 공간에서 회전과 확대축소는 $3 \\times 3$ 행렬 곱셈으로 표현할 수 있지만, 평행이동(Translation)은 단순한 덧셈이므로 $3 \\times 3$ 행렬 곱셈만으로는 표현할 수 없습니다. 컴퓨터 그래픽스는 이 문제를 해결하기 위해 4번째 가상 차원 $w$를 추가한 **동차 좌표계(Homogeneous Coordinates)**를 사용합니다.',
      textEn: 'While rotation and scaling can be represented by 3x3 matrices, translation requires addition. To represent all affine transformations uniformly as matrix multiplications, computer graphics uses 4D homogeneous coordinates.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 동차 좌표계에서 점(w=1)과 벡터(w=0)의 우아한 마법',
      summary: '💡 동차 좌표계에서 점(w=1)과 벡터(w=0)의 우아한 마법',
      points: [
        {
          title: '핵심 설명',
          content: '4차원 동차 벡터 $[x, y, z, w]^T$에 4x4 아핀 변환 행렬을 곱하면:\\n$$\\n\\\\begin{bmatrix}\\nm_{00} & m_{01} & m_{02} & t_x \\\\\\\\\\nm_{10} & m_{11} & m_{12} & t_y \\\\\\\\\\nm_{20} & m_{21} & m_{22} & t_z \\\\\\\\\\n0 & 0 & 0 & 1\\n\\\\end{bmatrix}\\n\\\\begin{bmatrix} x \\\\\\\\ y \\\\\\\\ z \\\\\\\\ w \\\\end{bmatrix}\\n$$\\n- **점 ($w = 1$일 때)**: 마지막 열의 평행이동 성분 $t_x, t_y, t_z$가 $1$과 곱해져 더해집니다! $\\\\rightarrow$ 위치가 올바르게 이동됨.\\n- **벡터 ($w = 0$일 때)**: 마지막 열의 평행이동 성분이 $0$과 곱해져 완전히 소거됩니다! $\\\\rightarrow$ 벡터는 위치가 없으므로 평행이동에 영향을 받지 않고 회전/스케일만 적용됨.\\n\\n이처럼 $w$ 성분 하나만으로 점과 벡터의 본질적 차이가 기계적으로 완벽하게 유지됩니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.9.2 Transform 클래스 설계',
      titleEn: '3.9.2 Transform Class Definition'
    },
    {
      type: 'paragraph',
      textKo: 'pbrt의 `Transform` 클래스는 $4 \\times 4$ 행렬 `m`과 그 역행렬 `mInv`를 멤버 변수로 항상 쌍으로 유지합니다:',
      textEn: 'The Transform class in pbrt stores both a 4x4 matrix m and its inverse mInv:'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Transform Definition>>=',
      code: `class Transform {
  public:
    Transform() = default;
    Transform(const SquareMatrix<4> &m) : m(m), mInv(Inverse(m)) {}
    Transform(const SquareMatrix<4> &m, const SquareMatrix<4> &mInv)
        : m(m), mInv(mInv) {}

    friend Transform Inverse(const Transform &t) {
        return Transform(t.mInv, t.m);
    }

    bool SwapsHandedness() const;

  private:
    SquareMatrix<4> m, mInv;
};`
    },
    {
      type: 'paragraph',
      textKo: '광선 추적 엔진에서는 표면 충돌점에서 계산된 물리량을 월드 공간과 로컬 오브젝트 공간 사이에서 끊임없이 왕복 변환해야 합니다. 만약 매번 런타임에 $4 \\times 4$ 행렬의 역행렬을 계산한다면 막대한 수치해석 비용이 소모됩니다. 따라서 pbrt는 생성 시점에 역행렬을 미리 계산해 두고, `Inverse(t)` 호출 시 단순히 두 행렬의 위치를 맞바꾼 새로운 `Transform` 객체를 $O(1)$로 즉시 반환합니다.',
      textEn: 'Because ray tracers frequently transform rays and surfaces back and forth between coordinate spaces, storing both m and mInv allows computing inverses in O(1) time without repeated numerical matrix inversion.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.9.3 기본 변환 연산 (평행이동, 스케일링, 회전)',
      titleEn: '3.9.3 Basic Transformations (Translation, Scale, Rotation)'
    },
    {
      type: 'paragraph',
      textKo: '평행이동(Translation)은 점의 위치에 변위 오프셋 $(\\Delta x, \\Delta y, \\Delta z)$를 더해주는 변환입니다(그림 3.25).',
      textEn: 'Translation moves points by an offset vector $(\\Delta x, \\Delta y, \\Delta z)$ (Figure 3.25).'
    },
    {
      type: 'figure',
      id: 'fig-3-25',
      number: 'Figure 3.25',
      captionKo: '그림 3.25: 2차원 평면에서의 평행이동: 점 $p$의 좌표에 오프셋 $\\Delta x$와 $\\Delta y$를 더하여 새로운 위치 $p\'$으로 이동시킵니다.',
      captionEn: 'Figure 3.25: Translation in 2D. Adding offsets $\\Delta x$ and $\\Delta y$ to the coordinates of a point moves it to a new location.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f25.svg',
    },
    {
      type: 'paragraph',
      textKo: '회전(Rotation)은 지정된 축을 중심으로 물체를 각도 $\\theta$만큼 회전시킵니다(그림 3.26, 그림 3.27).',
      textEn: 'Rotation rotates points and vectors around a given axis by an angle $\\theta$ (Figure 3.26 and Figure 3.27).'
    },
    {
      type: 'figure',
      id: 'fig-3-26',
      number: 'Figure 3.26',
      captionKo: '그림 3.26: 2차원 평면상에서 각도 $\\theta$만큼의 회전 변환.',
      captionEn: 'Figure 3.26: Rotation by an angle $\\theta$ in 2D.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f26.svg',
    },
    {
      type: 'figure',
      id: 'fig-3-27',
      number: 'Figure 3.27',
      captionKo: '그림 3.27: 임의의 3차원 회전축을 중심으로 한 벡터 회전(로드리게스 회전 공식): 벡터를 축에 평행한 성분과 수직인 성분으로 분해한 뒤 회전을 적용합니다.',
      captionEn: 'Figure 3.27: Rotation around an arbitrary axis using orthogonal decomposition.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f27.svg',
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.9.4 Look-At 뷰 변환 (The Look-at Transformation)',
      titleEn: '3.9.4 The Look-at Transformation'
    },
    {
      type: 'paragraph',
      textKo: '가상 카메라의 위치와 시야를 설정할 때 가장 널리 사용되는 변환이 바로 `LookAt`입니다. 카메라의 3차원 위치(`pos`), 카메라가 바라보고 있는 대상 지점(`look`), 그리고 위쪽 방향을 가리키는 업 벡터(`up`) 세 가지 파라미터로부터, 월드 공간을 카메라 기준 좌표계(원점에 카메라 위치, $+z$ 방향으로 시선 전개)로 정렬하는 변환 행렬을 구축합니다(그림 3.28).',
      textEn: 'The Look-at transformation constructs a viewing matrix from a camera position, a look-at target point, and an up vector (Figure 3.28).'
    },
    {
      type: 'figure',
      id: 'fig-3-28',
      number: 'Figure 3.28',
      captionKo: '그림 3.28: Look-At 변환: 카메라 위치 $pos$, 바라보는 지점 $look$, 상단 방향 $up$ 벡터가 주어졌을 때, 카메라가 원점에 위치하고 $+z$축을 똑바로 응시하는 카메라 로컬 좌표계를 정의합니다.',
      captionEn: 'Figure 3.28: The Look-at transformation defines a coordinate system where the camera is at the origin looking down the $+z$ axis.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f28.svg',
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Transform Function Definitions>>+=',
      code: `Transform LookAt(Point3f pos, Point3f look, Vector3f up) {
    SquareMatrix<4> cameraFromWorld;
    // 카메라 원점을 pos로 평행이동
    cameraFromWorld[0][3] = pos.x;
    cameraFromWorld[1][3] = pos.y;
    cameraFromWorld[2][3] = pos.z;
    cameraFromWorld[3][3] = 1;

    // 카메라 기준 세 기저 벡터 구성
    Vector3f dir = Normalize(look - pos);
    Vector3f right = Normalize(Cross(Normalize(up), dir));
    Vector3f newUp = Cross(dir, right);

    cameraFromWorld[0][0] = right.x;
    cameraFromWorld[1][0] = right.y;
    cameraFromWorld[2][0] = right.z;
    cameraFromWorld[3][0] = 0;

    cameraFromWorld[0][1] = newUp.x;
    cameraFromWorld[1][1] = newUp.y;
    cameraFromWorld[2][1] = newUp.z;
    cameraFromWorld[3][1] = 0;

    cameraFromWorld[0][2] = dir.x;
    cameraFromWorld[1][2] = dir.y;
    cameraFromWorld[2][2] = dir.z;
    cameraFromWorld[3][2] = 0;

    return Transform(Inverse(cameraFromWorld), cameraFromWorld);
}`
    }
  ]
};
