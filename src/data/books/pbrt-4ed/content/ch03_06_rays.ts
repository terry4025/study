import type { SectionContent } from '../../../../types/book';

export const CH03_06_RAYS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "3",
  "chapterTitleKo": "제3장 기하학과 3차원 변환 (Geometry & Transformations)",
  "sectionNumber": "3.6",
  "sectionTitle": "Rays",
  "sectionTitleKo": "3.6 광선 (Ray): 빛의 이동 경로와 파라메트릭 방정식",
  "originalUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Rays.html",
  "prevSection": {
    "id": "ch03-05",
    "title": "3.5 법선 벡터 (Normal): 표면의 수직 방향"
  },
  "nextSection": {
    "id": "ch03-07",
    "title": "3.7 바운딩 박스 (Bounding Boxes & AABB)"
  },
  "summary": {
    "keyTakeaways": [
      "광선(Ray)은 시작점(원점 $o$)과 진행 방향(방향 벡터 $\\mathbf{d}$)으로 정의되는 반직선(Semi-infinite Line)입니다.",
      "광선 위의 임의의 점은 파라메트릭 방정식 $r(t) = o + t\\mathbf{d} \\; (0 \\le t < \\infty)$로 표현되며, C++의 함수 호출 연산자 `operator()(Float t)`를 오버로딩하여 수학 수식처럼 직관적으로 위치를 계산합니다.",
      "현대 렌더링 엔진의 광선은 단순한 기하학적 직선을 넘어, 애니메이션 모션 블러를 위한 시간 정보(`time`)와 안개/연기/액체 등 볼륨 렌더링을 위한 매질(`medium`) 정보를 함께 운반합니다.",
      "광선 미분(`RayDifferential`)은 주 광선 외에 인접 픽셀로 향하는 보조 광선 2개를 함께 추적하여, 물체 표면에 투영된 픽셀의 발자국(Footprint) 크기를 계산함으로써 텍스처 앨리어싱(계단 현상)을 제거하는 핵심 기술입니다."
    ],
    "prerequisites": [
      "3.4절 점(`Point3f`) 및 3.3절 벡터(`Vector3f`)",
      "직선의 매개변수(Parametric) 방정식"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "3.6 광선 (Rays)",
      "titleEn": "3.6 Rays",
      "id": "ch03-06-b1"
    },
    {
      "type": "paragraph",
      "textKo": "광선(Ray) $r$은 시작 원점 $o$와 진행 방향 벡터 $\\mathbf{d}$로 규정되는 반직선(Semi-infinite Line)입니다(그림 3.8 참조). pbrt는 원점 표현에 `Point3f`를 사용하고 방향 벡터 표현에 `Vector3f`를 사용하여 `Ray` 클래스를 모델링합니다. 렌더링 연산에서는 정수형 광선이 전혀 필요하지 않으므로 부동소수점(`Float`) 타입 전용으로 정의됩니다.",
      "textEn": "A ray $r$ is a semi-infinite line specified by its origin $o$ and direction $\\mathbf{d}$; see Figure 3.8. pbrt represents Rays using a Point3f for the origin and a Vector3f for the direction; there is no need for non-Float-based rays in pbrt.",
      "id": "ch03-06-b2"
    },
    {
      "type": "figure",
      "id": "fig-3-8",
      "number": "Figure 3.8",
      "title": "Original Figure 3.8",
      "titleKo": "원문 그림 3.8",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-8.png",
      "captionKo": "그림 3.8 · 광선은 원점 o와 방향 d로 정하는 반직선입니다. o+t·d에서 t≥0인 부분을 생각합니다.",
      "captionEn": "Figure 3.8: A ray is a semi-infinite line defined by its origin normal o and its direction vector bold d .",
      "width": 998,
      "height": 104,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Rays.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "광선의 매개변수(Parametric) 형태는 스칼라 매개변수 $t$의 함수로 표현되며, 광선이 지나가는 3차원 공간 속 점들의 궤적을 나타냅니다:",
      "textEn": "The parametric form of a ray expresses it as a function of a scalar value $t$, giving the set of points that the ray passes through:",
      "id": "ch03-06-b4"
    },
    {
      "type": "equation",
      "tex": "r(t) = o + t\\mathbf{d} \\quad (0 \\le t < \\infty)",
      "id": "ch03-06-b5"
    },
    {
      "type": "paragraph",
      "textKo": "광선은 r(t)=o+t*d로 나타냅니다. t는 광선 위 위치를 고르는 매개변수이며, 이동 거리는 |t|*Length(d)입니다. d가 단위 벡터일 때만 양의 t가 이동 거리와 같습니다. 예를 들어 t=1.7을 넣으면 광선 위 한 점을 얻을 뿐, 그곳에 실제 교차점이 있는지는 형상과의 교차 검사로 결정해야 합니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-06-b6"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Ray Definition>>=",
      "code": "class Ray {\n  public:\n    Ray() = default;\n    Ray(Point3f o, Vector3f d, Float time = 0.f, Medium medium = nullptr)\n        : o(o), d(d), time(time), medium(medium) {}\n\n    Point3f operator()(Float t) const { return o + d * t; }\n\n    PBRT_CPU_GPU\n    bool HasNaN() const { return (o.HasNaN() || d.HasNaN()); }\n\n    // 광선의 핵심 멤버 변수 (접근 편의를 위해 public 공개)\n    Point3f o;\n    Vector3f d;\n    Float time = 0;\n    Medium medium = nullptr;\n};",
      "provenance": "teaching",
      "id": "ch03-06-b7"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "💡 time과 medium 필드가 왜 광선에 필요할까?",
      "summary": "💡 time과 medium 필드가 왜 광선에 필요할까?",
      "points": [
        {
          "title": "핵심 설명",
          "content": "1. **시간 필드 (`time`)**: 현실 세계 카메라는 셔터가 열려 있는 동안 물체가 움직이면 잔상(모션 블러, Motion Blur)이 생깁니다. 렌더러가 사실적인 모션 블러를 시뮬레이션하려면 각 광선마다 자신이 발사된 특정 시점($time \\in [0, 1]$)을 기억하고 있어야 해당 시점의 움직이는 물체 위치와 교차 검사를 할 수 있습니다.\n\n2. **매질 필드 (`medium`)**: 빛은 진공이나 맑은 공기뿐만 아니라 짙은 안개, 담배 연기, 우유, 탁한 물속을 통과하기도 합니다(참여 매질, Participating Media). 광선이 어떤 매질 속에서 이동 중인지를 알아야 매질에 의한 빛의 흡수(Absorption)와 산란(Scattering) 감쇠를 물리적으로 정확하게 계산할 수 있습니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "PBRT"
      ],
      "id": "ch03-06-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.6.1 광선 미분 (Ray Differentials)",
      "titleEn": "3.6.1 Ray Differentials",
      "id": "ch03-06-b9"
    },
    {
      "type": "paragraph",
      "textKo": "RayDifferential은 주 광선과 화면에서 조금 옮긴 보조 광선의 원점·방향을 저장합니다. 모든 보조 광선을 장면과 별도로 교차 검사하는 것이 아니라, 교차점 주변의 변화와 텍스처 필터 영역을 근사하는 데 사용합니다. 표면의 실루엣·복잡한 산란 등에서는 근사에 한계가 있으며 모든 종류의 앨리어싱을 없애는 장치는 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-06-b10"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<RayDifferential Definition>>=",
      "code": "class RayDifferential : public Ray {\n  public:\n    RayDifferential() = default;\n    RayDifferential(Point3f o, Vector3f d, Float time = 0.f, Medium medium = nullptr)\n        : Ray(o, d, time, medium) {}\n    explicit RayDifferential(const Ray &ray) : Ray(ray) {}\n\n    void ScaleDifferentials(Float s) {\n        rxOrigin = o + (rxOrigin - o) * s;\n        ryOrigin = o + (ryOrigin - o) * s;\n        rxDirection = d + (rxDirection - d) * s;\n        ryDirection = d + (ryDirection - d) * s;\n    }\n\n    bool hasDifferentials = false;\n    Point3f rxOrigin, ryOrigin;       // x축, y축 방향으로 1픽셀 오프셋된 보조 광선 원점\n    Vector3f rxDirection, ryDirection; // x축, y축 보조 광선 방향 벡터\n};",
      "provenance": "teaching",
      "id": "ch03-06-b11"
    },
    {
      "type": "paragraph",
      "textKo": "RayDifferential은 주 광선과 화면에서 조금 옮긴 보조 광선의 원점·방향을 저장합니다. 모든 보조 광선을 장면과 별도로 교차 검사하는 것이 아니라, 교차점 주변의 변화와 텍스처 필터 영역을 근사하는 데 사용합니다. 표면의 실루엣·복잡한 산란 등에서는 근사에 한계가 있으며 모든 종류의 앨리어싱을 없애는 장치는 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch03-06-b12"
    }
  ],
  "audit": {
    "checkedSourceSha256": "1982f7c122b59c52aeaacf28e88954da198410acfba4f5a7984136ba100d0b27",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "3.6 Rays",
      "3.6.1  Ray Differentials"
    ],
    "sourceFigures": [
      "3.8"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
