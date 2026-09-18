import { SectionContent } from '../../../../types/book';

export const CH03_01_COORDINATE_SYSTEMS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.1',
  sectionTitle: 'Coordinate Systems',
  sectionTitleKo: '3.1 3차원 좌표계와 아핀 공간 (Coordinate Systems)',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/Coordinate_Systems.html',
  prevSection: {
    id: 'ch02-04',
    title: '2.4 다차원 확률 분포 간의 변환과 야코비안',
  },
  nextSection: {
    id: 'ch03-02',
    title: '3.2 n-튜플 기본 클래스와 C++ CRTP 템플릿 설계',
  },
  summary: {
    keyTakeaways: [
      '컴퓨터 그래픽스에서 점(Point), 벡터(Vector), 법선(Normal)은 모두 $(x, y, z)$ 세 개의 실수로 저장되지만, 기준이 되는 "좌표계(Frame: 원점 $p_o$와 선형 독립인 세 기저 벡터)"가 주어지지 않으면 아무런 공간적 의미를 갖지 못합니다.',
      '아핀 공간(Affine Space)에서 임의의 벡터 $\\mathbf{v}$는 기저 벡터들의 선형 결합 $\\mathbf{v} = \\sum s_i \\mathbf{v}_i$로 유일하게 표현되며, 점 $p$는 원점에 벡터를 더한 형태 $p = p_o + \\sum s_i \\mathbf{v}_i$로 정의됩니다. 따라서 점과 벡터는 전혀 다른 수학적 개체이며 상호 교환될 수 없습니다.',
      '좌표계를 정의하기 위한 기준 좌표계의 순환 정의 모순을 해결하기 위해, 원점이 $(0, 0, 0)$이고 표준 단위 기저 벡터를 갖는 절대 기준계인 **월드 공간(World Space)**을 정의하여 모든 공간의 기준점으로 삼습니다.',
      '3차원 직교 좌표계는 $z$축의 방향에 따라 왼손 좌표계(Left-Handed)와 오른손 좌표계(Right-Handed)로 나뉘며, pbrt는 화면 안쪽(깊이 방향)으로 $z$축이 증가하는 **왼손 좌표계**를 표준으로 사용합니다.'
    ],
    prerequisites: [
      '선형대수학 기초 (벡터, 기저 벡터, 선형 독립, 선형 결합)',
      '3차원 공간 직교 좌표계의 기본 개념'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '3.1 좌표계 (Coordinate Systems)',
      titleEn: '3.1 Coordinate Systems'
    },
    {
      type: 'paragraph',
      textKo: '컴퓨터 그래픽스 분야의 전형적인 방식과 마찬가지로, pbrt 시스템 역시 3차원 점(Point), 벡터(Vector), 법선 벡터(Normal Vector)를 세 개의 좌표 성분값인 $x, y, z$로 표현합니다. 하지만 이 세 값은 공간의 기준 원점(Origin)을 정하고, $x, y, z$ 축의 방향과 척도를 결정하는 서로 선형 독립인 세 개의 기저 벡터(Basis Vectors)를 제공하는 **좌표계(Coordinate System)**가 전제되지 않는다면 아무런 물리적·기하학적 의미도 갖지 못합니다.',
      textEn: 'As is typical in computer graphics, pbrt represents three-dimensional points, vectors, and normal vectors with three coordinate values: $x$, $y$, and $z$. These values are meaningless without a coordinate system that defines the origin of the space and gives three linearly independent vectors that define the $x$, $y$, and $z$ axes of the space.'
    },
    {
      type: 'paragraph',
      textKo: '이러한 공간의 원점과 세 개의 기저 벡터를 한데 묶어 좌표계를 규정하는 **프레임(Frame)**이라고 부릅니다. 3차원 공간에 존재하는 임의의 점이나 방향 벡터가 주어졌을 때, 컴퓨터 메모리에 기록되는 $(x, y, z)$ 좌표 수치는 오로지 해당 개체가 프레임과 맺고 있는 기하학적 상대 관계에 의해서만 결정됩니다. 그림 3.1은 이해를 돕기 위해 이 핵심 원리를 2차원 평면 공간을 예로 들어 직관적으로 보여줍니다.',
      textEn: 'Together, the origin and three vectors are called the frame that defines the coordinate system. Given an arbitrary point or direction in 3D, its $(x, y, z)$ coordinate values depend on its relationship to the frame. Figure 3.1 shows an example that illustrates this idea in 2D.'
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 컴공 기초 콕콕: 아핀 공간(Affine Space)이란 무엇이며 점과 벡터는 왜 다를까?',
      summary: '💡 컴공 기초 콕콕: 아핀 공간(Affine Space)이란 무엇이며 점과 벡터는 왜 다를까?',
      points: [
        {
          title: '핵심 설명',
          content: '프로그래밍을 처음 접할 때 `float x, y, z;` 구조체 하나로 점과 벡터를 모두 처리하고 싶은 유혹에 빠지기 쉽습니다. 하지만 수학적으로 점(Point)과 벡터(Vector)는 전혀 다릅니다:\\n\\n1. **벡터(Vector)**: "방향(Direction)"과 "크기(Magnitude)"만을 나타내며, 공간에서의 절대 위치(Position)가 없습니다. 즉, 평행이동해도 동일한 벡터입니다.\\n2. **점(Point)**: 공간 속의 특정한 "위치(Location)"를 나타냅니다. 위치가 달라지면 다른 점입니다.\\n3. **아핀 연산 규칙**:\\n   - $\\\\text{Point} - \\\\text{Point} = \\\\text{Vector}$ (두 위치의 차이는 이동 방향과 거리인 벡터가 됨)\\n   - $\\\\text{Point} + \\\\text{Vector} = \\\\text{Point}$ (어떤 위치에서 벡터만큼 이동하면 새로운 위치가 됨)\\n   - $\\\\text{Point} + \\\\text{Point} = \\\\text{정의되지 않음}$ (두 서울시청 위치를 더한다는 것은 물리적 의미가 없음!)\\n\\npbrt는 이처럼 엄밀한 기하학적 의미 차이를 반영하기 위해 C++ 타입 시스템 수준에서 `Point3`와 `Vector3`를 엄격하게 분리하여 버그를 사전에 차단합니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    },
    {
      type: 'figure',
      id: 'fig-3-1',
      number: 'Figure 3.1',
      captionKo: '그림 3.1: 2차원에서 한 점 $p$의 $(x, y)$ 좌표값은 그 점이 어떤 2차원 좌표계와 관계를 맺고 있는지에 따라 정의됩니다. 여기서는 두 개의 서로 다른 좌표계가 표시되어 있습니다. 실선으로 표시된 좌표계에 대해 점 $p$는 $(3, 3)$의 좌표를 가질 수 있지만, 점선으로 표시된 좌표계에 대해서는 $(2, -4)$라는 좌표를 가집니다. 그러나 두 경우 모두 점 $p$가 우주 공간 속에서 차지하는 절대적 물리 위치는 완벽히 동일합니다.',
      captionEn: 'Figure 3.1: In 2D, the $(x, y)$ coordinates of a point $p$ are defined by the relationship of the point to a particular 2D coordinate system. Here, two coordinate systems are shown; the point might have coordinates $(3, 3)$ with respect to the coordinate system with its coordinate axes drawn in solid lines but have coordinates $(2, -4)$ with respect to the coordinate system with dashed axes. In either case, the 2D point $p$ is at the same absolute position in space.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f01.svg',
    },
    {
      type: 'paragraph',
      textKo: '일반적인 $n$차원 공간의 경우, 프레임의 원점 $p_o$와 $n$개의 선형 독립인 기저 벡터(Basis Vectors)는 $n$차원 **아핀 공간(Affine Space)**을 구성합니다. 이 공간 내의 모든 벡터 $\\mathbf{v}$는 기저 벡터들의 선형 결합(Linear Combination)으로 유일하게 표현될 수 있습니다. 즉, 임의의 벡터 $\\mathbf{v}$와 기저 벡터들 $\\mathbf{v}_i$가 주어졌을 때, 다음 관계를 만족하는 스칼라 값의 집합 $s_i$가 오직 하나만 존재합니다:',
      textEn: 'In the general $n$-dimensional case, a frame\'s origin $p_o$ and its $n$ linearly independent basis vectors define an $n$-dimensional affine space. All vectors $\\mathbf{v}$ in the space can be expressed as a linear combination of the basis vectors. Given a vector $\\mathbf{v}$ and the basis vectors $\\mathbf{v}_i$, there is a unique set of scalar values $s_i$ such that'
    },
    {
      type: 'equation',
      tex: '\\mathbf{v} = s_1 \\mathbf{v}_1 + \\dots + s_n \\mathbf{v}_n'
    },
    {
      type: 'paragraph',
      textKo: '이때 스칼라 계수들 $s_i$가 바로 기저 $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_n\\}$에 대한 벡터 $\\mathbf{v}$의 표현이며, 우리가 벡터 변수에 저장하는 좌표 수치값들입니다. 마찬가지로 공간 속의 모든 점 $p$에 대해서도 원점 $p_o$와 기저 벡터들을 사용하여 점의 위치를 유일하게 표현해 주는 스칼라 $s_i$들이 존재합니다:',
      textEn: 'The scalars $s_i$ are the representation of $\\mathbf{v}$ with respect to the basis $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_n\\}$ and are the coordinate values that we store with the vector. Similarly, for all points $p$, there are unique scalars $s_i$ such that the point can be expressed in terms of the origin $p_o$ and the basis vectors'
    },
    {
      type: 'equation',
      tex: 'p = p_o + s_1 \\mathbf{v}_1 + \\dots + s_n \\mathbf{v}_n'
    },
    {
      type: 'paragraph',
      textKo: '따라서 점(Point)과 벡터(Vector)는 비록 3차원 컴퓨터 프로그램 내부에서는 둘 다 $(x, y, z)$ 세 개의 부동소수점 숫자로 표현되지만, 본질적으로 완전히 다른 수학적 실체이며 코드 상에서 무분별하게 혼용되어서는 안 됩니다.',
      textEn: 'Thus, although points and vectors are both represented by $x$, $y$, and $z$ coordinates in 3D, they are distinct mathematical entities and are not freely interchangeable.'
    },
    {
      type: 'paragraph',
      textKo: '좌표계 관점에서 점과 벡터를 이렇게 정의하다 보면 한 가지 역설(Paradox)에 부딪히게 됩니다. 하나의 프레임을 정의하기 위해서는 원점(점) 하나와 기저 벡터들의 집합이 필요한데, 우리가 점과 벡터를 의미 있게 논하려면 이미 어떤 프레임이 주어져 있어야만 하기 때문입니다. 따라서 3차원 공간에서는 모든 계산의 근본이 되는 표준 표준계(Standard Canonical Frame)를 정해야 합니다. 이 표준계는 원점이 $(0, 0, 0)$이고 기저 벡터가 각각 $(1, 0, 0)$, $(0, 1, 0)$, $(0, 0, 1)$로 정의됩니다. 3차원 장면 속의 다른 모든 프레임들은 이 표준 좌표계를 기준으로 기술되며, 우리는 이를 **월드 공간(World Space)**이라고 부릅니다.',
      textEn: 'This definition of points and vectors in terms of coordinate systems reveals a paradox: to define a frame we need a point and a set of vectors, but we can only meaningfully talk about points and vectors with respect to a particular frame. Therefore, in three dimensions we need a standard frame with origin $(0, 0, 0)$ and basis vectors $(1, 0, 0)$, $(0, 1, 0)$, and $(0, 0, 1)$. All other frames will be defined with respect to this canonical coordinate system, which we call world space.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.1.1 좌표계의 손잡이성 (Coordinate System Handedness)',
      titleEn: '3.1.1 Coordinate System Handedness'
    },
    {
      type: 'paragraph',
      textKo: '그림 3.2에 나와 있듯이, 3차원 공간에서 직교하는 세 개의 축을 배치하는 방식에는 근본적으로 두 가지의 서로 다른 기하학적 방법이 존재합니다. 서로 수직인 $x$축과 $y$축이 평면상에 놓여 있을 때, 수직인 $z$축은 앞쪽(모니터 밖) 혹은 뒤쪽(모니터 안쪽)이라는 두 가지 반대 방향 중 하나를 향할 수 있습니다. 이 두 가지 선택을 각각 **왼손 좌표계(Left-Handed System)**와 **오른손 좌표계(Right-Handed System)**라고 부릅니다. 둘 중 어떤 것을 선택하느냐는 규약의 문제이지만, 렌더링 엔진 전체에 걸쳐 수많은 기하학적 연산(예: 두 벡터의 외적 부호 판정 등)의 구현 방식에 큰 영향을 미칩니다. pbrt는 **왼손 좌표계**를 표준으로 사용합니다.',
      textEn: 'There are two different ways that the three coordinate axes can be arranged, as shown in Figure 3.2. Given perpendicular $x$ and $y$ coordinate axes, the $z$ axis can point in one of two directions. These two choices are called left-handed and right-handed. The choice between the two is arbitrary but has a number of implications for how some of the geometric operations throughout the system are implemented. pbrt uses a left-handed coordinate system.'
    },
    {
      type: 'figure',
      id: 'fig-3-2',
      number: 'Figure 3.2',
      captionKo: '그림 3.2: (a) 왼손 좌표계에서는 $x$축이 오른쪽을 향하고 $y$축이 위쪽을 향할 때, 왼손 엄지를 화면 안쪽으로 뻗어 $z$축이 지면(화면) 안쪽을 가리킵니다. (b) 오른손 좌표계에서는 동일한 $x, y$축 배치에서 오른손 엄지가 가리키는 $z$축이 지면(화면) 바깥쪽을 향해 튀어나옵니다.',
      captionEn: 'Figure 3.2: (a) In a left-handed coordinate system, the $z$ axis points into the page when the $x$ and $y$ axes are oriented with $x$ pointing to the right and $y$ pointing up. (b) In a right-handed system, the $z$ axis points out of the page.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f02.svg',
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '💡 컴공 상식: 그래픽스 엔진들의 좌표계 규칙 비교',
      summary: '💡 컴공 상식: 그래픽스 엔진들의 좌표계 규칙 비교',
      points: [
        {
          title: '핵심 설명',
          content: '다양한 3D 엔진과 그래픽스 API는 저마다 다른 좌표계 규약을 사용하므로 모델을 임포트하거나 엔진을 바꿀 때 주의해야 합니다:\\n\\n- **왼손 좌표계**: pbrt, DirectX, Unreal Engine (카메라 정면 깊이 방향으로 $+z$가 증가하므로 직관적임)\\n- **오른손 좌표계**: OpenGL, Vulkan 기본 카메라, Blender, Maya, ROS(로봇 운영체제)\\n\\n오른손 좌표계에서는 두 기저 벡터의 외적 $\\\\mathbf{x} \\\\times \\\\mathbf{y} = +\\\\mathbf{z}$가 화면 밖을 향하지만, 왼손 좌표계에서는 외적 규칙을 왼손으로 감싸 쥐어야 합니다. pbrt는 카메라가 바라보는 깊이 방향을 $+z$로 통일하기 위해 왼손 좌표계를 일관되게 적용합니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', 'PBRT']
    }
  ]
};
