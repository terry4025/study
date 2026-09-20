import type { SectionContent } from '../../../../types/book';

export const CH03_11_INTERACTIONS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "3",
  "chapterTitleKo": "제3장 기하학과 3차원 변환 (Geometry & Transformations)",
  "sectionNumber": "3.11",
  "sectionTitle": "Interactions",
  "sectionTitleKo": "3.11 광선-표면 상호작용 구조체 (Interactions)",
  "originalUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Interactions.html",
  "prevSection": {
    "id": "ch03-10",
    "title": "3.10 변환 적용과 법선 벡터의 역전치 변환"
  },
  "nextSection": {
    "id": "ch04-01",
    "title": "4.1 방사측정학 기본 물리량 (Radiometry)"
  },
  "summary": {
    "keyTakeaways": [
      "`Interaction`은 광선이 장면 속의 표면이나 참여 매질(안개, 연기)과 부딪히는 모든 사건(Event)을 추상화한 렌더러의 중심 데이터 버스입니다.",
      "기본 클래스 `Interaction`은 충돌 위치 $p$, 나가는 방향 벡터 $\\mathbf{w}_o$, 표면 법선 $\\mathbf{n}$, 텍스처 좌표 $(u, v)$, 장면을 평가하는 시각 $time$을 공통으로 관리합니다.",
      "`SurfaceInteraction`은 2차원 매개변수 곡면 $p(u, v)$ 위의 미분 기하학(Differential Geometry) 정보인 접벡터 $\\frac{\\partial p}{\\partial u}, \\frac{\\partial p}{\\partial v}$와 법선 미분 $\\frac{\\partial n}{\\partial u}, \\frac{\\partial n}{\\partial v}$를 보관합니다.",
      "**기하학적 형상(True Geometry) vs 셰이딩 형상(Shading Geometry)**: 실제 다각형 표면의 법선과 범프 매핑/노멀 매핑 또는 부드러운 정점 보간으로 변조된 셰이딩 법선을 분리하여 보관하며, `SetShadingGeometry()`를 통해 두 법선이 항상 동일한 반구를 향하도록 동기화합니다.",
      "`MediumInteraction`은 연기나 구름 같은 산란 매질 내부에서 빛이 부딪힐 때의 위상 함수(Phase Function) 정보를 캡슐화합니다."
    ],
    "prerequisites": [
      "3.4절 점(`Point3f`), 3.3절 벡터(`Vector3f`), 3.5절 법선(`Normal3f`)",
      "3.6절 광선(`Ray`)과 3.10절 기하 변환",
      "미분기하학: 2변수 매개변수 곡면의 편미분"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "3.11 상호작용 구조체 (Interactions)",
      "titleEn": "3.11 Interactions",
      "id": "ch03-11-b1"
    },
    {
      "type": "paragraph",
      "textKo": "광선 추적 렌더링에서 광선이 3차원 물체의 표면과 교차하거나 안개 같은 산란 매질 내부를 통과할 때, 빛과 물질 사이의 물리적 상호작용이 일어납니다. 렌더러의 적분기(Integrator)와 재질(Material), 광원(Light) 모듈들은 이 충돌 지점의 상세한 기하학적·물리적 정보를 공유해야 합니다. pbrt는 이러한 상호작용 정보를 하나로 묶어 전달하는 `Interaction` 클래스 계층을 정의합니다.",
      "textEn": "In a ray tracer, ray intersections with geometric surfaces and scattering events in participating media trigger physical interactions between light and matter. The Interaction classes encapsulate all the geometric and physical information at these points to facilitate communication across the system.",
      "id": "ch03-11-b2"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<Interaction Definition>>=",
      "code": "class Interaction {\n  public:\n    Interaction() = default;\n    Interaction(Point3fi p, Normal3f n, Point2f uv, Vector3f wo, Float time)\n        : pi(p), n(n), uv(uv), wo(Normalize(wo)), time(time) {}\n\n    Interaction(Point3f p, Vector3f wo, Float time, Medium medium)\n        : pi(p), wo(Normalize(wo)), time(time), medium(medium) {}\n\n    bool IsSurfaceInteraction() const { return n != Normal3f(0, 0, 0); }\n\n    // 상호작용 지점의 핵심 정보\n    Point3fi pi;       // 부동소수점 오차 범위가 포함된 상호작용 위치 (Point3fi)\n    Float time = 0;    // 장면 평가 시각 (모션 블러)\n    Vector3f wo;       // 광선을 타고 관찰자/카메라 쪽으로 나가는 방향 (-ray.d)\n    Normal3f n;        // 표면 법선 벡터 (매질 상호작용인 경우 0)\n    Medium medium = nullptr;\n    Point2f uv;        // 표면 매개변수 텍스처 좌표 (u, v)\n};",
      "provenance": "teaching",
      "id": "ch03-11-b3"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.11.1 표면 상호작용 (Surface Interaction)",
      "titleEn": "3.11.1 Surface Interaction",
      "id": "ch03-11-b4"
    },
    {
      "type": "paragraph",
      "textKo": "광선이 2차원 매개변수 곡면 $p(u, v)$와 부딪힐 때 발생하는 상호작용은 `SurfaceInteraction` 클래스로 표현됩니다. 이 클래스는 충돌 지점 주변의 국소적 **미분 기하학(Local Differential Geometry)** 정보를 완전하게 보관합니다(그림 3.30).",
      "textEn": "When a ray intersects a 2D parametric surface $p(u, v)$, a SurfaceInteraction is created. It stores the full local differential geometry at the point of intersection (Figure 3.30).",
      "id": "ch03-11-b5"
    },
    {
      "type": "figure",
      "id": "fig-3-30",
      "number": "Figure 3.30",
      "title": "Original Figure 3.30",
      "titleKo": "원문 그림 3.30",
      "src": "/books/pbrt-4ed/reviewed-images/figure-3-30.png",
      "captionKo": "그림 3.30 · 표면의 ∂p/∂u와 ∂p/∂v는 접평면에 있지만 반드시 수직이지는 않습니다. 외적으로 법선 방향을 얻고, 법선의 편미분은 표면을 따라 움직일 때 그 방향이 어떻게 변하는지 나타냅니다.",
      "captionEn": "Figure 3.30: The Local Differential Geometry around a Point normal p Subscript . The parametric partial derivatives of the surface, partial-differential normal p slash partial-differential u and partial-differential normal p slash partial-differential v , lie in the tangent plane but are not necessarily orthogonal. The surface normal bold n Subscript is given by the cross product of partial-differential normal p slash partial-differential u and partial-differential normal p slash partial-differential v . The vectors partial-differential bold n Subscript slash partial-differential u and partial-differential bold n Subscript slash partial-differential v record the differential change in surface normal as we move u and v along the surface.",
      "width": 998,
      "height": 372,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Geometry_and_Transformations/Interactions.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<SurfaceInteraction Definition>>=",
      "code": "class SurfaceInteraction : public Interaction {\n  public:\n    SurfaceInteraction() = default;\n    SurfaceInteraction(Point3fi p, Point2f uv, Vector3f wo,\n                       Vector3f dpdu, Vector3f dpdv,\n                       Normal3f dndu, Normal3f dndv, Float time,\n                       bool flipNormal);\n\n    void SetShadingGeometry(Normal3f ns, Vector3f dpdus, Vector3f dpdvs,\n                           Normal3f dndus, Normal3f dndvs,\n                           bool orientationIsAuthoritative);\n\n    // 실제 기하학적 접벡터 및 법선 미분\n    Vector3f dpdu, dpdv;\n    Normal3f dndu, dndv;\n\n    // 셰이딩 형상 (노멀 매핑/범프 매핑으로 변조된 값)\n    struct {\n        Normal3f n;\n        Vector3f dpdu, dpdv;\n        Normal3f dndu, dndv;\n    } shading;\n\n    int faceIndex = 0;\n};",
      "provenance": "teaching",
      "id": "ch03-11-b7"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 핵심 콕콕",
      "title": "💡 실제 기하 법선(True Normal) vs 셰이딩 법선(Shading Normal)",
      "summary": "💡 실제 기하 법선(True Normal) vs 셰이딩 법선(Shading Normal)",
      "points": [
        {
          "title": "핵심 설명",
          "content": "컴퓨터 그래픽스에서 평평한 로우 폴리곤 메시에 미세한 벽돌 질감이나 주름을 표현하기 위해 **범프 매핑(Bump Mapping)**이나 **노멀 매핑(Normal Mapping)**을 사용합니다.\n\n- **기하학적 법선 ($n$)**: 실제 삼각형 평면의 진짜 수직 방향입니다. 광선이 표면 뒷면으로 뚫고 들어가는지 self-intersection 오차를 피하려면 반드시 실제 기하학 정보를 알아야 합니다.\n- **셰이딩 법선 (`shading.n`)**: 빛 반사 셰이딩 계산에만 쓰이는 인위적으로 조작된 가짜 법선입니다.\n\npbrt는 이 둘을 명확하게 분리하여, 광선 생성 시에는 실제 기하 법선으로 안전한 오프셋을 계산하고, 라이팅 반사 계산 시에는 셰이딩 법선으로 디테일한 음영을 표현합니다."
        }
      ],
      "tags": [
        "컴퓨터 그래픽스",
        "PBRT"
      ],
      "id": "ch03-11-b8"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "3.11.2 매질 상호작용 (Medium Interaction)",
      "titleEn": "3.11.2 Medium Interaction",
      "id": "ch03-11-b9"
    },
    {
      "type": "paragraph",
      "textKo": "안개, 구름, 연기 같은 입자성 매질 내부에서 빛이 공기 분자나 수적(물방울)과 충돌할 때는 표면이 존재하지 않으므로 법선 $\\mathbf{n}$이 없습니다. 대신 빛이 어느 방향으로 산란(Scattering)되는지의 각도별 확률 분포를 규정하는 **위상 함수(Phase Function)**가 핵심 역할을 수행하며, `MediumInteraction` 클래스가 이를 처리합니다.",
      "textEn": "In participating media such as fog or clouds, scattering events have no surface or normal. Instead, a PhaseFunction describes the angular distribution of scattered light, encapsulated in the MediumInteraction class.",
      "id": "ch03-11-b10"
    },
    {
      "type": "code",
      "language": "cpp",
      "chunkName": "<<MediumInteraction Definition>>=",
      "code": "class MediumInteraction : public Interaction {\n  public:\n    MediumInteraction(Point3f p, Vector3f wo, Float time, Medium medium,\n                      PhaseFunction phase)\n        : Interaction(p, wo, time, medium), phase(phase) {}\n\n    PhaseFunction phase;\n};",
      "provenance": "teaching",
      "id": "ch03-11-b11"
    }
  ],
  "audit": {
    "checkedSourceSha256": "0ae5bb298184ee60d292b209aee953a787bcce678b4d7d3cb646d4ff9f86957c",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "3.11 Interactions",
      "3.11.1  Surface Interaction",
      "3.11.2  Medium Interaction"
    ],
    "sourceFigures": [
      "3.30"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
