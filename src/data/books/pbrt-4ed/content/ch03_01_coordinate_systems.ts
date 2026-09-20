import type { SectionContent } from '../../../../types/book';

export const CH03_01_COORDINATE_SYSTEMS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "3",
  "chapterTitleKo": "제3장 기하학과 3차원 변환 (Geometry & Transformations)",
  "sectionNumber": "3.1",
  "sectionTitle": "Coordinate Systems",
  "sectionTitleKo": "3.1 3차원 좌표계와 아핀 공간 (Coordinate Systems)",
  "originalUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Coordinate_Systems.html",
  "prevSection": {
    "id": "ch02-04",
    "title": "2.4 다차원 확률 분포 간의 변환과 야코비안"
  },
  "nextSection": {
    "id": "ch03-02",
    "title": "3.2 n-튜플 기본 클래스와 C++ CRTP 템플릿 설계"
  },
  "summary": {
    "keyTakeaways": [
      "컴퓨터 그래픽스에서 점(Point), 벡터(Vector), 법선(Normal)은 모두 $(x, y, z)$ 세 개의 실수로 저장되지만, 기준이 되는 \"좌표계(Frame: 원점 $p_o$와 선형 독립인 세 기저 벡터)\"가 주어지지 않으면 아무런 공간적 의미를 갖지 못합니다.",
      "아핀 공간(Affine Space)에서 임의의 벡터 $\\mathbf{v}$는 기저 벡터들의 선형 결합 $\\mathbf{v} = \\sum s_i \\mathbf{v}_i$로 유일하게 표현되며, 점 $p$는 원점에 벡터를 더한 형태 $p = p_o + \\sum s_i \\mathbf{v}_i$로 정의됩니다. 따라서 점과 벡터는 전혀 다른 수학적 개체이며 상호 교환될 수 없습니다.",
      "월드 공간은 장면을 기술하기 위해 선택한 기준 좌표계입니다. 물리적으로 특별한 절대 좌표계라는 뜻은 아닙니다.",
      "3차원 직교 좌표계는 $z$축의 방향에 따라 왼손 좌표계(Left-Handed)와 오른손 좌표계(Right-Handed)로 나뉘며, pbrt는 화면 안쪽(깊이 방향)으로 $z$축이 증가하는 **왼손 좌표계**를 표준으로 사용합니다."
    ],
    "prerequisites": [
      "선형대수학 기초 (벡터, 기저 벡터, 선형 독립, 선형 결합)",
      "3차원 공간 직교 좌표계의 기본 개념"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "3.1 좌표계 (Coordinate Systems)",
      "titleEn": "3.1 Coordinate Systems",
      "id": "ch03-01-b1"
    },
    {
      "type": "paragraph",
      "textKo": "컴퓨터 그래픽스 분야의 전형적인 방식과 마찬가지로, pbrt 시스템 역시 3차원 점(Point), 벡터(Vector), 법선 벡터(Normal Vector)를 세 개의 좌표 성분값인 $x, y, z$로 표현합니다. 하지만 이 세 값은 공간의 기준 원점(Origin)을 정하고, $x, y, z$ 축의 방향과 척도를 결정하는 서로 선형 독립인 세 개의 기저 벡터(Basis Vectors)를 제공하는 **좌표계(Coordinate System)**가 전제되지 않는다면 아무런 물리적·기하학적 의미도 갖지 못합니다.",
      "textEn": "As is typical in computer graphics, pbrt represents three-dimensional points, vectors, and normal vectors with three coordinate values: $x$, $y$, and $z$. These values are meaningless without a coordinate system that defines the origin of the space and gives three linearly independent vectors that define the $x$, $y$, and $z$ axes of the space.",
      "id": "ch03-01-b2"
    },
    {
      "type": "paragraph",
      "textKo": "이러한 공간의 원점과 세 개의 기저 벡터를 한데 묶어 좌표계를 규정하는 **프레임(Frame)**이라고 부릅니다. 3차원 공간에 존재하는 임의의 점이나 방향 벡터가 주어졌을 때, 컴퓨터 메모리에 기록되는 $(x, y, z)$ 좌표 수치는 오로지 해당 개체가 프레임과 맺고 있는 기하학적 상대 관계에 의해서만 결정됩니다. 그림 3.1은 이해를 돕기 위해 이 핵심 원리를 2차원 평면 공간을 예로 들어 직관적으로 보여줍니다.",
      "textEn": "Together, the origin and three vectors are called the frame that defines the coordinate system. Given an arbitrary point or direction in 3D, its $(x, y, z)$ coordinate values depend on its relationship to the frame. Figure 3.1 shows an example that illustrates this idea in 2D.",
      "id": "ch03-01-b3"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "점과 벡터는 역할이 다릅니다",
      "summary": "점과 벡터는 역할이 다릅니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "점에서 점을 빼면 이동 벡터이고, 점에 벡터를 더하면 새 점입니다. 점들의 가중합도 가중치 합이 1이면 원점 선택과 무관한 점을 나타냅니다. PBRT는 이런 보간 계산을 편하게 하려고 Point끼리의 성분별 덧셈·스칼라 곱도 허용합니다. 따라서 수학적 의미의 구분과 라이브러리가 허용하는 연산을 같다고 단정하지 않습니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "PBRT"
      ],
      "id": "ch03-01-b4"
    },
    {
      "type": "figure",
      "id": "fig-3-1",
      "number": "Figure 3.1",
      "title": "Original Figure 3.1",
      "titleKo": "원문 그림 3.1",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-1.png",
      "captionKo": "그림 3.1 · 같은 공간의 점이라도 좌표계에 따라 (3,3) 또는 (2,−4)처럼 다른 좌표를 가질 수 있습니다. 점이 이동한 것이 아니라 좌표를 정하는 기준이 달라진 것입니다.",
      "captionEn": "Figure 3.1: In 2D, the left-parenthesis x comma y right-parenthesis coordinates of a point normal p Subscript are defined by the relationship of the point to a particular 2D coordinate system. Here, two coordinate systems are shown; the point might have coordinates left-parenthesis 3 comma 3 right-parenthesis with respect to the coordinate system with its coordinate axes drawn in solid lines but have coordinates left-parenthesis 2 comma negative 4 right-parenthesis with respect to the coordinate system with dashed axes. In either case, the 2D point normal p Subscript is at the same absolute position in space.",
      "width": 998,
      "height": 337,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Coordinate_Systems.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "일반적인 $n$차원 공간의 경우, 프레임의 원점 $p_o$와 $n$개의 선형 독립인 기저 벡터(Basis Vectors)는 $n$차원 **아핀 공간(Affine Space)**을 구성합니다. 이 공간 내의 모든 벡터 $\\mathbf{v}$는 기저 벡터들의 선형 결합(Linear Combination)으로 유일하게 표현될 수 있습니다. 즉, 임의의 벡터 $\\mathbf{v}$와 기저 벡터들 $\\mathbf{v}_i$가 주어졌을 때, 다음 관계를 만족하는 스칼라 값의 집합 $s_i$가 오직 하나만 존재합니다:",
      "textEn": "In the general $n$-dimensional case, a frame's origin $p_o$ and its $n$ linearly independent basis vectors define an $n$-dimensional affine space. All vectors $\\mathbf{v}$ in the space can be expressed as a linear combination of the basis vectors. Given a vector $\\mathbf{v}$ and the basis vectors $\\mathbf{v}_i$, there is a unique set of scalar values $s_i$ such that",
      "id": "ch03-01-b6"
    },
    {
      "type": "equation",
      "tex": "\\mathbf{v} = s_1 \\mathbf{v}_1 + \\dots + s_n \\mathbf{v}_n",
      "id": "ch03-01-b7"
    },
    {
      "type": "paragraph",
      "textKo": "이때 스칼라 계수들 $s_i$가 바로 기저 $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_n\\}$에 대한 벡터 $\\mathbf{v}$의 표현이며, 우리가 벡터 변수에 저장하는 좌표 수치값들입니다. 마찬가지로 공간 속의 모든 점 $p$에 대해서도 원점 $p_o$와 기저 벡터들을 사용하여 점의 위치를 유일하게 표현해 주는 스칼라 $s_i$들이 존재합니다:",
      "textEn": "The scalars $s_i$ are the representation of $\\mathbf{v}$ with respect to the basis $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_n\\}$ and are the coordinate values that we store with the vector. Similarly, for all points $p$, there are unique scalars $s_i$ such that the point can be expressed in terms of the origin $p_o$ and the basis vectors",
      "id": "ch03-01-b8"
    },
    {
      "type": "equation",
      "tex": "p = p_o + s_1 \\mathbf{v}_1 + \\dots + s_n \\mathbf{v}_n",
      "id": "ch03-01-b9"
    },
    {
      "type": "paragraph",
      "textKo": "따라서 점(Point)과 벡터(Vector)는 비록 3차원 컴퓨터 프로그램 내부에서는 둘 다 $(x, y, z)$ 세 개의 부동소수점 숫자로 표현되지만, 본질적으로 완전히 다른 수학적 실체이며 코드 상에서 무분별하게 혼용되어서는 안 됩니다.",
      "textEn": "Thus, although points and vectors are both represented by $x$, $y$, and $z$ coordinates in 3D, they are distinct mathematical entities and are not freely interchangeable.",
      "id": "ch03-01-b10"
    },
    {
      "type": "paragraph",
      "textKo": "장면의 위치들을 함께 표현할 기준 프레임을 하나 정하고 이를 월드 공간이라고 부릅니다. 그 프레임에서 원점은 (0,0,0), 기저의 좌표는 (1,0,0), (0,1,0), (0,0,1)입니다. 다른 프레임은 이 선택한 기준에 대한 위치와 방향으로 기술합니다. 기준을 바꿔도 같은 기하학적 관계를 나타낼 수 있습니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-01-b11"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.1.1 좌표계의 손잡이성 (Coordinate System Handedness)",
      "titleEn": "3.1.1 Coordinate System Handedness",
      "id": "ch03-01-b12"
    },
    {
      "type": "paragraph",
      "textKo": "그림 3.2에 나와 있듯이, 3차원 공간에서 직교하는 세 개의 축을 배치하는 방식에는 근본적으로 두 가지의 서로 다른 기하학적 방법이 존재합니다. 서로 수직인 $x$축과 $y$축이 평면상에 놓여 있을 때, 수직인 $z$축은 앞쪽(모니터 밖) 혹은 뒤쪽(모니터 안쪽)이라는 두 가지 반대 방향 중 하나를 향할 수 있습니다. 이 두 가지 선택을 각각 **왼손 좌표계(Left-Handed System)**와 **오른손 좌표계(Right-Handed System)**라고 부릅니다. 둘 중 어떤 것을 선택하느냐는 규약의 문제이지만, 렌더링 엔진 전체에 걸쳐 수많은 기하학적 연산(예: 두 벡터의 외적 부호 판정 등)의 구현 방식에 큰 영향을 미칩니다. pbrt는 **왼손 좌표계**를 표준으로 사용합니다.",
      "textEn": "There are two different ways that the three coordinate axes can be arranged, as shown in Figure 3.2. Given perpendicular $x$ and $y$ coordinate axes, the $z$ axis can point in one of two directions. These two choices are called left-handed and right-handed. The choice between the two is arbitrary but has a number of implications for how some of the geometric operations throughout the system are implemented. pbrt uses a left-handed coordinate system.",
      "id": "ch03-01-b13"
    },
    {
      "type": "figure",
      "id": "fig-3-2",
      "number": "Figure 3.2",
      "title": "Original Figure 3.2",
      "titleKo": "원문 그림 3.2",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-2.png",
      "captionKo": "그림 3.2 · x가 오른쪽, y가 위를 향할 때 왼손 좌표계의 z는 종이 안쪽, 오른손 좌표계의 z는 종이 바깥쪽을 향합니다.",
      "captionEn": "Figure 3.2: (a) In a left-handed coordinate system, the z axis points into the page when the x and y axes are oriented with x pointing to the right and y pointing up. (b) In a right-handed system, the z axis points out of the page.",
      "width": 998,
      "height": 353,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Coordinate_Systems.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "좌표계는 각 단계의 규약을 확인합니다",
      "summary": "좌표계는 각 단계의 규약을 확인합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "PBRT는 이 책에서 왼손 좌표계를 기준으로 설명합니다. 다른 시스템과 자료를 교환할 때는 월드·카메라·클립 공간의 축, 위 방향, 곱셈 순서, 앞면 판정을 각각 확인해야 합니다. 그래픽스 API가 임의의 월드 좌표계나 카메라 방향을 모두 고정하는 것은 아닙니다. 일반 기저에서는 좌표 성분의 내적만으로 길이와 각도를 구할 수 없고, 여기의 친숙한 공식은 정규 직교 기저를 기준으로 합니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "PBRT"
      ],
      "id": "ch03-01-b15"
    }
  ],
  "audit": {
    "checkedSourceSha256": "bd776ab431740b3df8cd1ae19feac2be6b16c38f6fd68fb7b1cb3b6ebf2636d6",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "3.1 Coordinate Systems",
      "3.1.1  Coordinate System Handedness"
    ],
    "sourceFigures": [
      "3.1",
      "3.2"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
