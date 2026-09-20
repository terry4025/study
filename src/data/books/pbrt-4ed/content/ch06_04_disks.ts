import type { SectionContent } from '../../../../types/book';

export const CH06_04_DISKS: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "6",
  "chapterTitleKo": "제6장 3차원 형상과 교차 검사 (Shapes)",
  "sectionNumber": "6.4",
  "sectionTitle": "Disks",
  "sectionTitleKo": "6.4 원판(Disk) 모델과 교차 검사 (Disks)",
  "originalUrl": "https://pbr-book.org/4ed/Shapes/Disks.html",
  "prevSection": {
    "id": "ch06-03",
    "title": "6.3 원기둥(Cylinder)"
  },
  "nextSection": {
    "id": "ch06-05",
    "title": "6.5 삼각 메시(Triangle Meshes)"
  },
  "summary": {
    "keyTakeaways": [
      "원판(Disk)은 z = height 평면에 위치한 2차원 원형 평면으로, 2차 방정식 근의 공식 대신 단 한 번의 나눗셈으로 평면 교차 거리 t를 즉시 계산합니다.",
      "평면과의 교차 거리 t = (height - o_z) / d_z를 구한 뒤, 교차점의 중심 거리 제곱 x² + y²이 안쪽 반지름 제곱(rMin²)과 바깥 반지름 제곱(radius²) 사이에 존재하는지 검사합니다.",
      "안쪽 반지름 rMin을 0보다 크게 설정하면 중앙에 구멍이 뚫린 도넛/와셔(Washer) 형태의 원판이 되며, phiMax로 부채꼴 원판을 지원합니다.",
      "원판의 표면 법선은 모든 점에서 항상 z축과 평행한 (0, 0, 1) 상수 벡터입니다."
    ],
    "prerequisites": [
      "3차원 평면 방정식과 광선 교차 (Ray–Plane Intersection)",
      "극좌표계 (Polar Coordinates: r, phi)",
      "기초 삼각함수와 역탄젠트 함수 (atan2)"
    ]
  },
  "blocks": [
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.4.1 원판의 수학적 정의와 1차 평면 교차 검사",
      "titleEn": "6.4.1 Ray–Disk Intersection",
      "id": "ch06-04-b1"
    },
    {
      "type": "paragraph",
      "textKo": "원판(Disk)은 $z = \\text{height}$ 평면에 놓여 있으며, 중심이 원점 $(0, 0, \\text{height})$인 평평한 원형 표면입니다. 구나 원기둥처럼 2차 곡면이 아니라 순수한 평면이므로, 2차 방정식 판별식을 풀 필요 없이 단 한 줄의 수식으로 교차 거리 $t$가 결정됩니다:",
      "textEn": "A disk is a circular planar shape located in the plane z = height, centered at (0, 0, height). Ray–disk intersection reduces to a 1D ray–plane intersection followed by in-bounds checks.",
      "id": "ch06-04-b2"
    },
    {
      "type": "equation",
      "tex": "o_z + t d_z = \\text{height} \\implies t = \\frac{\\text{height} - o_z}{d_z}",
      "explanationKo": "광선-원판 평면 교차 매개변수 거리 t 유도 공식",
      "id": "ch06-04-b3"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 기초 콕콕",
      "title": "평행한 광선의 나눗셈은 먼저 피합니다",
      "summary": "평행한 광선의 나눗셈은 먼저 피합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "d_z=0이면 평면 밖에 있는 광선은 만나지 않고, 평면 위에 있는 광선은 통째로 같은 평면에 놓일 수 있습니다. PBRT의 원판 교차기는 이런 공면의 특수 경우도 별도의 한 점 교차로 취급하지 않고 거절합니다. 그러므로 “평행하면 수학적으로 절대 만나지 않는다”는 설명은 맞지 않습니다."
        }
      ],
      "id": "ch06-04-b4"
    },
    {
      "type": "paragraph",
      "id": "fig-6-17",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.4.2 반지름과 각도 판정 (도넛/와셔 형상 지원)",
      "titleEn": "6.4.2 Radius and Sweep Checks",
      "id": "ch06-04-b6"
    },
    {
      "type": "paragraph",
      "textKo": "평면과 만난 교차점 $p = (x, y, \\text{height})$의 중심 거리 제곱 $distSq = x^2 + y^2$을 계산합니다. 이 거리가 안쪽 반지름 제곱보다 작거나 바깥 반지름 제곱보다 크면 탈락입니다:",
      "textEn": "The squared distance distSq = x^2 + y^2 is computed. If distSq < innerRadius^2 or distSq > radius^2, the ray misses the disk.",
      "id": "ch06-04-b7"
    },
    {
      "type": "equation",
      "tex": "r_{\\min}^2 \\le x^2 + y^2 \\le r_{\\max}^2",
      "explanationKo": "원판 안쪽 반지름 및 바깥 반지름 유효 구간 판정식",
      "id": "ch06-04-b8"
    },
    {
      "type": "paragraph",
      "id": "fig-6-18",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "level": 2,
      "titleKo": "6.4.3 표면적(Area)과 수직 상수 법선",
      "titleEn": "6.4.3 Surface Area and Constant Normal",
      "id": "ch06-04-b10"
    },
    {
      "type": "paragraph",
      "textKo": "원판의 표면적 $A$는 중심각 $\\phi_{\\max}$에 비례하는 부채꼴 와셔의 면적으로 명쾌하게 유도됩니다:",
      "textEn": "The surface area of a disk with sweep angle phiMax is:",
      "id": "ch06-04-b11"
    },
    {
      "type": "equation",
      "tex": "A = \\frac{\\phi_{\\max}}{2} \\left(r_{\\max}^2 - r_{\\min}^2\\right)",
      "explanationKo": "원판의 표면적 계산 공식 (phiMax = 2pi, rMin = 0일 때 파이 r^2)",
      "id": "ch06-04-b12"
    },
    {
      "type": "paragraph",
      "textKo": "변환 전 객체 공간의 기본 방향에서는 원판 법선이 (0,0,1)입니다. reverseOrientation과 좌표 변환을 적용하면 부호와 방향이 바뀔 수 있습니다. 아래 면적식의 φMax는 라디안입니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch06-04-b13"
    },
    {
      "type": "paragraph",
      "id": "fig-disks-render",
      "textKo": "이 위치의 기존 그림 번호·설명이 원문과 맞지 않아 잘못된 그림을 제거했습니다. 이 절의 원문 도판은 아래의 검수된 그림 자료에서 확인할 수 있습니다.",
      "textEn": "The incorrect or duplicated legacy figure mapping was retired; use the source-aligned figures in this section."
    },
    {
      "type": "subheading",
      "id": "ch06-04-reviewed-figures",
      "level": 2,
      "titleKo": "원문 도판 보완 · 검수한 핵심 설명",
      "titleEn": "Source-aligned figures — reviewed explanatory summaries"
    },
    {
      "type": "figure",
      "id": "ch06-04-source-figure-6-9",
      "number": "Figure 6.9",
      "title": "Original Figure 6.9",
      "titleKo": "원문 그림 6.9",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-9.png",
      "captionKo": "그림 6.9 · 원판은 z축 높이 h에 놓이며 바깥 반경 r을 갖습니다. 안쪽 반경과 최대 방위각으로 고리나 부채꼴도 나타낼 수 있습니다.",
      "captionEn": "Figure 6.9: Basic Setting for the Disk Shape. The disk has radius r and is located at height h along the z axis. A partial disk may be swept by specifying a maximum phi value and an inner radius r Subscript normal i .",
      "width": 998,
      "height": 441,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Disks.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "figure",
      "id": "ch06-04-source-figure-6-10",
      "number": "Figure 6.10",
      "title": "Original Figure 6.10",
      "titleKo": "원문 그림 6.10",
      "src": "/books/pbrt-4ed/reviewed-images/figure-6-10.png",
      "captionKo": "그림 6.10 · 부분 원판과 전체 원판의 예입니다.",
      "captionEn": "Figure 6.10: Two Disks. A partial disk is on the left, and a complete disk is on the right.",
      "width": 998,
      "height": 617,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Shapes/Disks.html",
      "captionKind": "reviewed-summary"
    }
  ],
  "audit": {
    "checkedSourceSha256": "5ec524268fabedefc585d7be6bfa4c50b1a0dc0f8f72ef3f0c56710d334fab07",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "6.4 Disks",
      "6.4.1  Area and Bounding",
      "6.4.2  Intersection Tests",
      "6.4.3  Sampling"
    ],
    "sourceFigures": [
      "6.9",
      "6.10"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
