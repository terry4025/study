import { SectionContent } from '../../../../types/book';

export const CH03_10_APPLYING_TRANSFORMATIONS: SectionContent = {
  bookId: 'pbrt-4ed',
  chapterNumber: '3',
  chapterTitleKo: '제3장 기하학과 3차원 변환 (Geometry & Transformations)',
  sectionNumber: '3.10',
  sectionTitle: 'Applying Transformations',
  sectionTitleKo: '3.10 변환 적용과 법선 벡터의 역전치 변환',
  originalUrl: 'https://pbr-book.org/4ed/Geometry_and_Transformations/Applying_Transformations.html',
  prevSection: {
    id: 'ch03-09',
    title: '3.9 3차원 동차 변환 행렬',
  },
  nextSection: {
    id: 'ch03-11',
    title: '3.11 광선-표면 상호작용 구조체 (Interactions)',
  },
  summary: {
    keyTakeaways: [
      '3차원 변환 행렬을 점(Point)에 적용할 때, 동차 좌표 $w$로 나누는 **원근 나눗셈(Perspective Division, $p\' / w$)**을 통해 투영 변환까지 완벽히 지원합니다.',
      '벡터(Vector)는 위치가 없으므로 4번째 행과 열의 평행이동 성분을 무시하고 $3 \\times 3$ 부분 행렬로만 곱하여 방향과 크기만 변환합니다.',
      '**컴공 그래픽스 최대의 핵심 증명: 법선의 역전치 변환 ($M^{-T}$)**: 물체에 비균등 스케일링이 적용될 때, 표면 법선이 변형된 접평면과 직교성($\\mathbf{n} \\cdot \\mathbf{t} = 0$)을 영구히 보존하려면 원래 변환 행렬 $M$이 아니라 **역행렬의 전치 행렬 $M^{-T} = (M^{-1})^T$**을 곱해야만 합니다.',
      '축 정렬 바운딩 박스(AABB)에 회전이나 변환을 가하면 더 이상 좌표축에 정렬되지 않으므로, 박스의 8개 꼭짓점(Corners)을 모두 변환한 뒤 이들을 완벽히 감싸는 새로운 최소-최대 AABB를 생성합니다.'
    ],
    prerequisites: [
      '3.9절 4x4 동차 변환 행렬 및 역행렬',
      '3.5절 법선 벡터와 표면 접평면',
      '선형대수학: 전치 행렬(Transpose)과 역행렬(Inverse)'
    ]
  },
  blocks: [
    {
      type: 'subheading',
      level: 2,
      titleKo: '3.10 변환 적용 (Applying Transformations)',
      titleEn: '3.10 Applying Transformations'
    },
    {
      type: 'paragraph',
      textKo: '`Transform` 클래스가 정의된 후, 이제 이를 3차원 점, 벡터, 법선, 광선, 바운딩 박스 등 다양한 기하학적 요소들에 실제로 적용하는 연산자들을 살펴볼 차례입니다. `operator()`를 오버로딩하여 `p_transformed = t(p);`와 같이 마치 수학 함수를 적용하듯 직관적으로 코드를 작성할 수 있습니다.',
      textEn: 'Now that the Transform class has been defined, we can define methods to apply transformations to points, vectors, normals, rays, and bounding boxes.'
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.10.1 점의 변환과 원근 나눗셈',
      titleEn: '3.10.1 Points'
    },
    {
      type: 'paragraph',
      textKo: '점 $p$에 $4 \\times 4$ 변환 행렬 $M$을 적용할 때, 점의 동차 좌표 $w$는 1로 설정됩니다. 일반적인 아핀 변환에서는 변환 후 $w$ 성분이 여전히 1이지만, 카메라 투영 변환(원근 투영)에서는 $w$ 성분이 1이 아닌 값으로 바뀝니다. 따라서 변환된 좌표를 유클리드 3차원 공간으로 되돌리기 위해 $w$ 성분으로 나누어주는 원근 나눗셈(Perspective Division)을 수행합니다:',
      textEn: 'When transforming a point $p$, we set its homogeneous coordinate $w = 1$. While affine transformations leave $w = 1$, projective transformations (such as perspective projection) change $w$. Thus, we divide by $w$ to recover the 3D Cartesian coordinates:'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Transform Inline Methods>>+=',
      code: `template <typename T>
PBRT_CPU_GPU Point3<T> Transform::operator()(Point3<T> p) const {
    T xp = m[0][0] * p.x + m[0][1] * p.y + m[0][2] * p.z + m[0][3];
    T yp = m[1][0] * p.x + m[1][1] * p.y + m[1][2] * p.z + m[1][3];
    T zp = m[2][0] * p.x + m[2][1] * p.y + m[2][2] * p.z + m[2][3];
    T wp = m[3][0] * p.x + m[3][1] * p.y + m[3][2] * p.z + m[3][3];
    if (wp == 1)
        return Point3<T>(xp, yp, zp);
    else
        return Point3<T>(xp, yp, zp) / wp;
}`
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.10.2 벡터의 변환',
      titleEn: '3.10.2 Vectors'
    },
    {
      type: 'paragraph',
      textKo: '방향 벡터는 위치가 없으므로 동차 좌표 $w = 0$입니다. 따라서 4번째 열의 평행이동 성분은 완전히 무시되고 상위 $3 \\times 3$ 선형 변환 성분만 곱해집니다:',
      textEn: 'Vectors have no position, so $w = 0$. Translation components are omitted, and only the upper $3 \\times 3$ portion of the matrix is used:'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Transform Inline Methods>>+=',
      code: `template <typename T>
PBRT_CPU_GPU Vector3<T> Transform::operator()(Vector3<T> v) const {
    return Vector3<T>(
        m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z,
        m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z,
        m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z);
}`
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.10.3 법선 벡터의 변환과 역전치 행렬 (M^{-T})',
      titleEn: '3.10.3 Normals'
    },
    {
      type: 'paragraph',
      textKo: '컴퓨터 그래픽스에서 가장 유명하고 중요한 수학적 원리 중 하나는 **"표면 법선 벡터는 일반 벡터와 같은 행렬로 변환해서는 안 된다"**는 사실입니다. 그림 3.29는 원을 세로 방향으로 $1/2$배 압축했을 때 발생하는 기하학적 문제를 극명하게 보여줍니다.',
      textEn: 'One of the most important geometric subtleties in computer graphics is that surface normal vectors must not be transformed by the same matrix used for points and vectors (Figure 3.29).'
    },
    {
      type: 'figure',
      id: 'fig-3-29',
      number: 'Figure 3.29',
      captionKo: '그림 3.29: 표면 법선의 변환: (a) 원래 원 표면 위의 접벡터와 이에 수직인 법선 벡터. (b) $y$축 방향으로 $1/2$배 스케일링할 때 법선에 동일한 스케일링 행렬을 적용하면, 변형된 타원 표면과의 직교성이 완전히 깨집니다! (c) 법선 벡터에 역전치 행렬($M^{-T}$)을 적용하면, 변형된 표면의 접벡터와 여전히 완벽한 $90^\\circ$ 수직을 유지합니다.',
      captionEn: 'Figure 3.29: Transforming Surface Normals. (a) Original circle with normal. (b) Scaling incorrectly tilts the normal so it is no longer perpendicular to the surface. (c) Transforming with the inverse transpose matrix correctly preserves perpendicularity.',
      title: 'Figure',
      titleKo: '다이어그램',
      src: '/books/pbrt-4ed/images/pha03f29.svg',
    },
    {
      type: 'concept-tip',
      badge: '💡 컴공 핵심 콕콕',
      title: '그래픽스 면접 단골 질문: 법선에 역전치 행렬(M^-T)을 곱하는 수학적 증명',
      summary: '비균등 스케일링 변환 후에도 표면 접평면과의 수직성을 보존하는 유일한 해법',
      points: [
        {
          title: '1. 표면 접벡터와 법선의 수직 관계',
          content: '표면의 임의의 접벡터(Tangent) t와 법선(Normal) n은 수직이므로 내적이 0입니다: n^T * t = 0.'
        },
        {
          title: '2. 변환 행렬 M 적용 시',
          content: '물체에 변환 M이 적용되면 변형된 접벡터는 t\' = M * t가 됩니다. 우리가 구하고자 하는 변형된 법선을 n\' = S * n이라 두겠습니다.'
        },
        {
          title: '3. 수직 조건 보존',
          content: '변형 후에도 수직이어야 하므로 (n\')^T * t\' = (S * n)^T * (M * t) = n^T * (S^T * M) * t = 0이 항상 성립해야 합니다.'
        },
        {
          title: '4. 역전치 행렬 도출',
          content: '모든 접벡터에 대해 성립하려면 S^T * M = I(단위행렬)이어야 하므로, S^T = M^-1, 즉 S = (M^-1)^T = M^-T 가 됩니다! 따라서 법선에는 역행렬의 전치 행렬을 곱해야만 수직성이 보존됩니다.'
        }
      ],
      tags: ['컴퓨터 그래픽스', '선형대수학', 'PBRT']
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Transform Inline Methods>>+=',
      code: `template <typename T>
PBRT_CPU_GPU Normal3<T> Transform::operator()(Normal3<T> n) const {
    // mInv의 전치 행렬(Transpose of mInv = M^{-T})을 곱함!
    return Normal3<T>(
        mInv[0][0] * n.x + mInv[1][0] * n.y + mInv[2][0] * n.z,
        mInv[0][1] * n.x + mInv[1][1] * n.y + mInv[2][1] * n.z,
        mInv[0][2] * n.x + mInv[1][2] * n.y + mInv[2][2] * n.z);
}`
    },
    {
      type: 'subheading',
      level: 3,
      titleKo: '3.10.4 광선과 바운딩 박스의 변환',
      titleEn: '3.10.4 Rays and Bounding Boxes'
    },
    {
      type: 'paragraph',
      textKo: '광선 `Ray`에 변환을 적용할 때는 원점 $o$를 점으로 변환하고(`(*this)(r.o)`), 방향 벡터 $d$를 벡터로 변환합니다(`(*this)(r.d)`).',
      textEn: 'Transforming a Ray transforms its origin as a point and its direction as a vector.'
    },
    {
      type: 'paragraph',
      textKo: '바운딩 박스 `Bounds3`에 회전 변환을 적용하면 축 정렬 성질이 깨지게 됩니다. 따라서 8개의 모든 꼭짓점(Corners)에 변환을 적용한 뒤, 변환된 8개 점들의 최소 성분과 최대 성분을 취하여 새로운 AABB 바운딩 박스를 구축합니다:',
      textEn: 'To transform an axis-aligned bounding box, we transform all eight of its corners and compute the bounding box that encloses the resulting points.'
    },
    {
      type: 'code',
      language: 'cpp',
      chunkName: '<<Transform Inline Methods>>+=',
      code: `template <typename T>
Bounds3<T> Transform::operator()(const Bounds3<T> &b) const {
    const Transform &M = *this;
    Bounds3<T> ret(M(Point3<T>(b.pMin.x, b.pMin.y, b.pMin.z)));
    ret = Union(ret, M(Point3<T>(b.pMax.x, b.pMin.y, b.pMin.z)));
    ret = Union(ret, M(Point3<T>(b.pMin.x, b.pMax.y, b.pMin.z)));
    ret = Union(ret, M(Point3<T>(b.pMin.x, b.pMin.y, b.pMax.z)));
    ret = Union(ret, M(Point3<T>(b.pMin.x, b.pMax.y, b.pMax.z)));
    ret = Union(ret, M(Point3<T>(b.pMax.x, b.pMax.y, b.pMin.z)));
    ret = Union(ret, M(Point3<T>(b.pMax.x, b.pMin.y, b.pMax.z)));
    ret = Union(ret, M(Point3<T>(b.pMax.x, b.pMax.y, b.pMax.z)));
    return ret;
}`
    }
  ]
};
