import type { Lesson } from '../../types.js';
// Original preparation guides and worked examples. NOT a complete translation.
export const pbrtGuides: Lesson[] = [
  {
    "id": "reading-9-01",
    "chapter": "9",
    "chapterTitle": "표면의 반사 모델",
    "title": "재질의 성질과 방향을 뽑는 방법은 다릅니다",
    "deck": "9.1 읽기 길잡이 · BSDF 표현",
    "kind": "guide",
    "sourceSection": "9.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 산란 함수 값 f와 확률밀도 p를 같은 것으로 취급해도 될까요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05",
      "math-06",
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-9-01-b01"
      },
      {
        "type": "paragraph",
        "text": "표면에서 빛을 계산할 때 서로 다른 질문 세 개를 합니다. “이 방향에서 들어와 저 방향으로 나가는 빛에 어떤 값을 곱할까?”, “다음에는 어느 방향을 살펴볼까?”, “그 방향은 얼마나 자주 뽑히는가?” 첫째는 산란 함수, 둘째는 샘플링, 셋째는 확률밀도입니다. BSDF는 반사와 투과를 다루는 약속이고, PBRT의 BxDF 구현은 구체적인 산란 모델을 제공합니다. 표면마다 기울기가 달라도 같은 계산을 쓰도록 표면에 붙인 작은 좌표계를 이용합니다.",
        "id": "reading-9-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-9-01-b03"
      },
      {
        "type": "paragraph",
        "text": "장면 좌표에서 비스듬한 판도 표면 좌표에서는 위쪽이 법선 방향이 되게 표현할 수 있습니다. 두 단위 방향의 z 성분이 0.8과 0.3이면 곱이 양수라 같은 반구에 있습니다. 0.8과 −0.3이면 반대 반구입니다. 이 검사는 방향의 부호 관계이지 빛이 몇 퍼센트 반사되는지 계산하는 식이 아닙니다.",
        "id": "reading-9-01-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "PBRT에서는 입사·출사 방향을 모두 표면 밖으로 향하는 약속으로 표현합니다. 물리적으로 빛이 이동하는 화살표와 혼동하지 마세요. 이상적 거울의 델타 분포는 일반 방향 평가와 표본 생성의 반환 규약도 다릅니다.",
        "tone": "warning",
        "id": "reading-9-01-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-9-01-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘BSDF Representation’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-9-01-b07"
      },
      {
        "type": "quiz",
        "question": "산란 함수 값 f와 확률밀도 p를 같은 것으로 취급해도 될까요?",
        "options": [
          "둘 다 항상 0과 1 사이의 확률이다",
          "둘은 서로 다른 역할이므로 구분해야 한다",
          "이름만 다르고 언제나 같다"
        ],
        "answer": 1,
        "feedback": "f는 재질의 산란을, p는 선택 전략의 밀도를 설명합니다. 밀도는 단순한 사건 확률과도 다릅니다.",
        "id": "reading-9-01-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 9.1 · BSDF Representation",
        "url": "https://pbr-book.org/4ed/Reflection_Models/BSDF_Representation",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-9-02",
    "chapter": "9",
    "chapterTitle": "표면의 반사 모델",
    "title": "무광 표면의 0.6과 0.6/π는 다른 값입니다",
    "deck": "9.2 읽기 길잡이 · 확산 반사",
    "kind": "guide",
    "sourceSection": "9.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 반사율이 0.6인 람베르트 표면의 BRDF는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-04",
      "math-06"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-9-02-b01"
      },
      {
        "type": "paragraph",
        "text": "거친 종이를 어느 쪽에서 보아도 비슷한 밝기로 보이는 상황을 이상화한 것이 람베르트 확산 반사입니다. 반사율 ρ는 들어온 에너지 중 반사되는 비율이고, BRDF는 방향별 계산에 쓰는 값입니다. 두 값을 동일하게 놓으면 모든 방향의 기여를 합칠 때 에너지를 과하게 세게 됩니다. 여기서 π는 방향 전체에 대한 코사인 가중 합을 맞추는 정규화에서 나옵니다.",
        "id": "reading-9-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-9-02-b03"
      },
      {
        "type": "paragraph",
        "text": "반사율을 0.6으로 정하면 BRDF는 0.6÷π≈0.191입니다. 이를 코사인 가중 방향 전체에 대해 적분하면 다시 0.6이 됩니다. 특정 방향의 BRDF가 0.191이라는 말은 “이 한 방향이 뽑힐 확률이 19.1%”라는 뜻이 아닙니다. 방향 하나의 사건 확률과 연속 방향의 밀도를 구분하세요.",
        "id": "reading-9-02-b04"
      },
      {
        "type": "equation",
        "tex": "f_r=\\frac{\\rho}{\\pi}",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "ρ",
            "반사율: 단위 없는 비율"
          ],
          [
            "fᵣ",
            "BRDF: 방향별 산란 계산 값"
          ]
        ],
        "id": "reading-9-02-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "관측 방향에 따른 방사휘도가 일정하다는 이상화이지, 같은 입체각마다 반사되는 총 에너지가 전부 같다는 뜻은 아닙니다. 실제 표면은 이 모델과 다를 수 있습니다.",
        "tone": "warning",
        "id": "reading-9-02-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-9-02-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Diffuse Reflection’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-9-02-b08"
      },
      {
        "type": "quiz",
        "question": "반사율이 0.6인 람베르트 표면의 BRDF는?",
        "options": [
          "0.6/π",
          "항상 1",
          "0.6π"
        ],
        "answer": 0,
        "feedback": "반사율을 π로 나눈 값입니다. 코사인 가중 반구 적분이 π이므로 전체 반사율이 맞습니다.",
        "id": "reading-9-02-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 9.2 · Diffuse Reflection",
        "url": "https://pbr-book.org/4ed/Reflection_Models/Diffuse_Reflection",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-9-03",
    "chapter": "9",
    "chapterTitle": "표면의 반사 모델",
    "title": "물속 빨대가 꺾여 보이는 각도를 계산합니다",
    "deck": "9.3 읽기 길잡이 · 정반사와 투과",
    "kind": "guide",
    "sourceSection": "9.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 위 예제에서 유리 안의 광선은 법선에 더 가까워질까요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-9-03-b01"
      },
      {
        "type": "paragraph",
        "text": "거울의 반사는 표면 법선을 기준으로 같은 각도로 돌아오고, 굴절은 다른 매질로 들어가며 방향이 바뀝니다. 굴절률은 단순한 밝기 조절 값이 아니라 매질에서 빛의 전파를 기술하는 값입니다. 사인 함수는 각도에 대응하는 비율을 돌려줍니다. 역삼각함수는 그 비율에서 각도를 찾는 도구입니다.",
        "id": "reading-9-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-9-03-b03"
      },
      {
        "type": "paragraph",
        "text": "공기 쪽 굴절률을 1, 유리 쪽을 1.5라고 가정하고 법선에서 30도 기울어 들어갑니다. sin(30°)=0.5이므로 유리 쪽 sin값은 1×0.5÷1.5=1/3입니다. 따라서 굴절각은 약 19.47도입니다. 각도를 바닥면에서 재면 숫자가 바뀌므로 법선 기준임을 먼저 확인합니다.",
        "id": "reading-9-03-b04"
      },
      {
        "type": "equation",
        "tex": "\\eta_i\\sin\\theta_i=\\eta_t\\sin\\theta_t",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "ηᵢ, ηₜ",
            "양쪽 매질의 굴절률"
          ],
          [
            "θᵢ, θₜ",
            "법선에서 잰 입사각·굴절각"
          ]
        ],
        "id": "reading-9-03-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "스넬 법칙만으로 반사되는 양까지 결정되지는 않습니다. 낮은 굴절률 쪽으로 나갈 때는 전반사도 확인해야 합니다. 이상적 경계면의 각도 계산이며 거칠기나 파동 효과를 전부 설명하지 않습니다.",
        "tone": "warning",
        "id": "reading-9-03-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-9-03-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Specular Reflection and Transmission’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-9-03-b08"
      },
      {
        "type": "quiz",
        "question": "위 예제에서 유리 안의 광선은 법선에 더 가까워질까요?",
        "options": [
          "아니요, 변화가 없다",
          "네, 약 19.47도가 된다",
          "아니요, 60도가 된다"
        ],
        "answer": 1,
        "feedback": "sinθ가 1/3이므로 약 19.47도입니다. 굴절률이 큰 쪽으로 들어가는 이 예제에서는 법선에 가까워집니다.",
        "id": "reading-9-03-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 9.3 · Specular Reflection and Transmission",
        "url": "https://pbr-book.org/4ed/Reflection_Models/Specular_Reflection_and_Transmission",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-9-04",
    "chapter": "9",
    "chapterTitle": "표면의 반사 모델",
    "title": "금속은 왜 흰 빛을 색깔 있게 반사할까요",
    "deck": "9.4 읽기 길잡이 · 도체 반사",
    "kind": "guide",
    "sourceSection": "9.4",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 금속 색을 정확히 다루려면 어떤 정보가 중요할까요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-9-04-b01"
      },
      {
        "type": "paragraph",
        "text": "금속의 반사는 파장에 따라 달라집니다. 빨강 성분과 파랑 성분을 서로 다른 비율로 반사하면 흰 조명을 받아도 색이 생깁니다. 이를 기술할 때 복소 굴절률을 쓰는데, 지금은 실수 부분 n과 흡수와 관련된 부분 k라는 두 입력이 필요하다고 이해하면 됩니다. k를 일반 유리의 굴절률처럼 하나로 합쳐 넣지 않습니다.",
        "id": "reading-9-04-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-9-04-b03"
      },
      {
        "type": "paragraph",
        "text": "공기에서 평평한 금속에 수직으로 입사하는 단순 예를 생각합니다. 특정 파장에서 n=0.2, k=3이라면 분자는 (0.2−1)²+3²=9.64, 분모는 (0.2+1)²+3²=10.44입니다. 반사율은 약 0.9234입니다. 이것은 임의의 교육용 파장 하나의 값이며 실제 특정 금속의 측정값이 아닙니다.",
        "id": "reading-9-04-b04"
      },
      {
        "type": "equation",
        "tex": "R=\\frac{(n-1)^2+k^2}{(n+1)^2+k^2}",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "n, k",
            "특정 파장의 복소 굴절률 성분"
          ],
          [
            "R",
            "수직 입사 시 반사율"
          ]
        ],
        "id": "reading-9-04-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "기울어진 입사, 표면 거칠기, 여러 파장에서는 추가 계산이 필요합니다. 두꺼운 불투명 금속 모델의 설명을 모든 얇은 금속막에 그대로 적용하지 마세요.",
        "tone": "warning",
        "id": "reading-9-04-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-9-04-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Conductor BRDF’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-9-04-b08"
      },
      {
        "type": "quiz",
        "question": "금속 색을 정확히 다루려면 어떤 정보가 중요할까요?",
        "options": [
          "모든 파장에 같은 반사율만 쓰기",
          "파장별 광학 특성",
          "파일 이름의 길이"
        ],
        "answer": 1,
        "feedback": "파장마다 반사되는 비율이 달라 색이 생깁니다. 거칠기와 주변 조명도 관측되는 모습에 영향을 줍니다.",
        "id": "reading-9-04-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 9.4 · Conductor BRDF",
        "url": "https://pbr-book.org/4ed/Reflection_Models/Conductor_BRDF",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-9-05",
    "chapter": "9",
    "chapterTitle": "표면의 반사 모델",
    "title": "유리의 반사와 투과를 확률적으로 고릅니다",
    "deck": "9.5 읽기 길잡이 · 유전체 반사·투과",
    "kind": "guide",
    "sourceSection": "9.5",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 드물게 뽑힌 반사 경로를 선택 확률로 나누는 이유는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06",
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-9-05-b01"
      },
      {
        "type": "paragraph",
        "text": "창문에는 바깥 풍경과 실내 반사가 겹쳐 보입니다. 이상적 유리 경계에서는 반사 경로와 투과 경로를 둘 다 생각해야 합니다. 매번 두 경로를 모두 따라가면 경로 수가 빠르게 늘어나므로 하나를 확률적으로 선택할 수 있습니다. 선택한 확률을 가중치에 반영해야 평균 에너지가 왜곡되지 않습니다.",
        "id": "reading-9-05-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-9-05-b03"
      },
      {
        "type": "paragraph",
        "text": "굴절률 1에서 1.5로 수직 입사하면 반사율은 ((1−1.5)/(1+1.5))²=0.04입니다. 단순한 에너지 분기에서는 4% 반사, 96% 투과로 생각합니다. 반사 사건을 확률 0.04로 뽑고 그 사건의 에너지 가중치 0.04를 선택 확률로 나누면 1입니다. 드문 사건이라도 확률 보정 뒤의 값은 작지 않을 수 있습니다.",
        "id": "reading-9-05-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "이 계산은 경계에서 에너지를 나누는 작은 예입니다. 방사휘도 수송의 실제 투과 가중치에는 굴절률에 따른 변환이 추가될 수 있고, 전반사에서는 반사율이 1이 됩니다.",
        "tone": "warning",
        "id": "reading-9-05-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-9-05-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Dielectric BSDF’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-9-05-b07"
      },
      {
        "type": "quiz",
        "question": "드물게 뽑힌 반사 경로를 선택 확률로 나누는 이유는?",
        "options": [
          "반사를 없애기",
          "선택 편향을 평균에서 보정하기",
          "유리를 임의로 밝게 만들기"
        ],
        "answer": 1,
        "feedback": "사건을 덜 자주 뽑는 만큼 선택되었을 때 기여를 보정합니다. 실제 BSDF의 규약과 측도를 함께 맞춰야 합니다.",
        "id": "reading-9-05-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 9.5 · Dielectric BSDF",
        "url": "https://pbr-book.org/4ed/Reflection_Models/Dielectric_BSDF",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-9-06",
    "chapter": "9",
    "chapterTitle": "표면의 반사 모델",
    "title": "큰 하이라이트 안에는 작은 거울들이 있습니다",
    "deck": "9.6 읽기 길잡이 · 미세면과 거칠기",
    "kind": "guide",
    "sourceSection": "9.6",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 거칠기를 올리는 것을 단순한 이미지 블러와 같다고 봐도 될까요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05",
      "math-06"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-9-06-b01"
      },
      {
        "type": "paragraph",
        "text": "거친 금속에 생기는 넓은 하이라이트를 작은 거울 조각들의 모임으로 상상해 보세요. 조각마다 방향이 달라 여러 방향으로 반사됩니다. 미세면 모델의 D는 작은 면들의 방향 분포, F는 각 면에서의 프레넬 반사, G는 면끼리 가리거나 그림자가 생기는 효과를 다룹니다. 표면 거칠기는 단순히 최종 이미지를 흐리게 만드는 필터가 아닙니다.",
        "id": "reading-9-06-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-9-06-b03"
      },
      {
        "type": "paragraph",
        "text": "같은 법선 근처에 조각들이 모여 있으면 거울 방향 가까이에 에너지가 집중됩니다. 조각들이 더 넓게 기울어져 있으면 반사가 넓게 퍼집니다. 다만 넓이와 높이의 변화를 각각 독립적인 밝기 버튼처럼 조절하면 에너지 균형이 깨질 수 있습니다. 빛을 뿌리는 방향 분포 자체가 바뀌는 것으로 이해하세요.",
        "id": "reading-9-06-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "D 자체를 아무 보정 없는 방향 확률밀도로 사용하지 마세요. 면의 투영 면적, 보이는 미세면 샘플링, 방향 변환의 밀도 계산이 필요합니다. 한 번만 산란하는 모델은 다중 산란을 생략할 수 있습니다.",
        "tone": "warning",
        "id": "reading-9-06-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-9-06-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Roughness Using Microfacet Theory’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-9-06-b07"
      },
      {
        "type": "quiz",
        "question": "거칠기를 올리는 것을 단순한 이미지 블러와 같다고 봐도 될까요?",
        "options": [
          "아니요, 표면의 산란 분포가 달라진다",
          "네, 언제나 같은 연산이다",
          "거칠기는 색상 이름이다"
        ],
        "answer": 0,
        "feedback": "재질의 빛 분포가 바뀌므로 관측 방향, 광원, 가림에 함께 반응합니다.",
        "id": "reading-9-06-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 9.6 · Roughness Using Microfacet Theory",
        "url": "https://pbr-book.org/4ed/Reflection_Models/Roughness_Using_Microfacet_Theory",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-9-07",
    "chapter": "9",
    "chapterTitle": "표면의 반사 모델",
    "title": "거친 유리에서는 두 종류의 선택을 구분합니다",
    "deck": "9.7 읽기 길잡이 · 거친 유전체",
    "kind": "guide",
    "sourceSection": "9.7",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 중간 표본을 최종 광선 방향으로 바꾸면 무엇을 다시 확인해야 하나요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06",
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-9-07-b01"
      },
      {
        "type": "paragraph",
        "text": "매끈한 유리는 특정 방향으로 굴절하지만, 거친 유리는 미세면 방향에 따라 여러 방향으로 빛이 퍼집니다. 계산은 “어떤 작은 면을 보았는가”와 “거기서 반사했는가, 투과했는가”를 함께 다룹니다. 최종 방향의 확률밀도를 구하려면 중간에 뽑은 면 방향과 최종 광선 방향이 같은 변수가 아니라는 점도 기억해야 합니다.",
        "id": "reading-9-07-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-9-07-b03"
      },
      {
        "type": "paragraph",
        "text": "어떤 영역의 미세면을 고를 확률이 0.2이고 그 조건에서 투과를 선택할 확률이 0.5라면, 두 선택이 함께 일어날 확률은 0.1입니다. 이는 조건부 선택을 곱한 이산 예제입니다. 실제 연속 방향 계산에서는 이 값에 변수 변환에 따른 밀도 보정이 필요합니다.",
        "id": "reading-9-07-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "반사에서 쓰는 중간 방향 공식을 굴절에도 그대로 복사하지 마세요. 굴절률, 전반사, 방향 규약을 확인해야 합니다. 이 작은 확률 예제는 실제 거친 유전체의 완성 PDF가 아닙니다.",
        "tone": "warning",
        "id": "reading-9-07-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-9-07-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Rough Dielectric BSDF’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-9-07-b07"
      },
      {
        "type": "quiz",
        "question": "중간 표본을 최종 광선 방향으로 바꾸면 무엇을 다시 확인해야 하나요?",
        "options": [
          "항상 확률을 1로 바꾸기",
          "문자열 정렬 순서",
          "최종 방향에 대한 확률밀도와 측도"
        ],
        "answer": 2,
        "feedback": "변수를 바꾸면 밀도의 기준도 바뀝니다. 같은 점을 나타내더라도 면적이나 입체각이 어떻게 변하는지 반영합니다.",
        "id": "reading-9-07-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 9.7 · Rough Dielectric BSDF",
        "url": "https://pbr-book.org/4ed/Reflection_Models/Rough_Dielectric_BSDF",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-9-08",
    "chapter": "9",
    "chapterTitle": "표면의 반사 모델",
    "title": "측정표는 정답을 그대로 복사하는 마법이 아닙니다",
    "deck": "9.8 읽기 길잡이 · 측정 BSDF",
    "kind": "guide",
    "sourceSection": "9.8",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 0.2에서 0.6 쪽으로 25% 이동한 선형 보간값은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-02"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-9-08-b01"
      },
      {
        "type": "paragraph",
        "text": "재질을 장비로 여러 방향에서 비추고 측정하면 이론식으로 표현하기 어려운 반사 특성을 표로 저장할 수 있습니다. 렌더러가 묻는 방향이 표에 정확히 없을 때는 주변 값에서 보간해야 합니다. 측정 데이터의 좌표계, 단위, 분해능을 모른 채 숫자만 읽으면 잘못된 재질이 됩니다.",
        "id": "reading-9-08-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-9-08-b03"
      },
      {
        "type": "paragraph",
        "text": "교육용 표에서 같은 조건의 두 방향 값이 0.2와 0.6이라고 합시다. 두 위치 사이의 정확한 중간을 선형 보간하면 0.4입니다. 위치를 25% 이동한 지점이면 0.75×0.2+0.25×0.6=0.3입니다. 가중치의 합이 1이어야 상수 자료도 상수로 유지됩니다.",
        "id": "reading-9-08-b04"
      },
      {
        "type": "equation",
        "tex": "v=(1-t)v_0+t v_1",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "t",
            "첫 지점에서 둘째 지점까지 이동한 비율"
          ]
        ],
        "id": "reading-9-08-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "실제 BSDF 보간은 방향 매개화와 에너지 보존 등의 조건을 따져야 합니다. 임의로 선형 보간했다고 모든 물리적 제약이 보존되는 것은 아닙니다. 측정 잡음도 존재합니다.",
        "tone": "warning",
        "id": "reading-9-08-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-9-08-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Measured BSDFs’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-9-08-b08"
      },
      {
        "type": "quiz",
        "question": "0.2에서 0.6 쪽으로 25% 이동한 선형 보간값은?",
        "options": [
          "0.8",
          "0.1",
          "0.3"
        ],
        "answer": 2,
        "feedback": "0.2×0.75+0.6×0.25=0.3입니다. 이것은 보간 연습이지 특정 측정 재질의 결과가 아닙니다.",
        "id": "reading-9-08-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 9.8 · Measured BSDFs",
        "url": "https://pbr-book.org/4ed/Reflection_Models/Measured_BSDFs",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-9-09",
    "chapter": "9",
    "chapterTitle": "표면의 반사 모델",
    "title": "머리카락에서는 표면을 스친 빛과 통과한 빛이 다릅니다",
    "deck": "9.9 읽기 길잡이 · 머리카락 산란",
    "kind": "guide",
    "sourceSection": "9.9",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 통과 구간마다 80%가 남는 빛이 두 구간을 지나면?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-9-09-b01"
      },
      {
        "type": "paragraph",
        "text": "머리카락 한 올을 가늘고 휘어진 섬유로 생각하면 평평한 플라스틱과 다른 하이라이트가 생기는 이유를 이해하기 쉽습니다. 빛은 겉에서 반사되거나, 내부를 통과해 나오거나, 안에서 한 번 더 반사된 뒤 나올 수 있습니다. 섬유의 방향이 정해져 있으므로 길이 방향과 둘레 방향의 변화도 구분합니다.",
        "id": "reading-9-09-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-9-09-b03"
      },
      {
        "type": "paragraph",
        "text": "단순한 흡수 연습으로, 같은 두께의 통과 구간마다 빛이 80% 남는다고 합시다. 한 구간 뒤에는 0.8, 두 구간 뒤에는 0.8×0.8=0.64가 남습니다. 내부에서 길게 이동하는 경로는 흡수 영향을 더 많이 받습니다. 표면에서 반사되는 경로와 내부 통과 경로의 색이 다른 원리를 생각할 수 있습니다.",
        "id": "reading-9-09-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "실제 머리카락은 완벽한 매끈 원기둥이 아닙니다. 0.8은 예제 값이며 모든 모발의 통과율이 아닙니다. 다중 경로를 구분하는 모델을 단순한 금속 BRDF로 바꾸어 설명하면 안 됩니다.",
        "tone": "warning",
        "id": "reading-9-09-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-9-09-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Scattering from Hair’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-9-09-b07"
      },
      {
        "type": "quiz",
        "question": "통과 구간마다 80%가 남는 빛이 두 구간을 지나면?",
        "options": [
          "64%",
          "80%",
          "160%"
        ],
        "answer": 0,
        "feedback": "남는 비율을 곱해서 0.8²=0.64입니다. 각 경로의 길이에 따라 누적 흡수가 달라집니다.",
        "id": "reading-9-09-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 9.9 · Scattering from Hair",
        "url": "https://pbr-book.org/4ed/Reflection_Models/Scattering_from_Hair",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-10-01",
    "chapter": "10",
    "chapterTitle": "텍스처와 재질",
    "title": "미분은 한 픽셀이 차지하는 무늬의 폭을 알려줍니다",
    "deck": "10.1 읽기 길잡이 · 텍스처 앨리어싱",
    "kind": "guide",
    "sourceSection": "10.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 위 조건에서 한 픽셀은 가로로 대략 몇 텍셀에 해당하나요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-03"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-10-01-b01"
      },
      {
        "type": "paragraph",
        "text": "검정·흰색 줄무늬가 한 픽셀 안에 여러 번 반복되면 그중 한 점만 읽어서는 안정적인 색을 얻기 어렵습니다. 픽셀을 살짝 옮겼을 때 텍스처 좌표가 얼마나 움직이는지를 알면 픽셀이 덮는 텍스처 영역을 추정할 수 있습니다. 이것이 여기서 미분이 필요한 이유입니다. 복잡한 기호보다 “화면 한 칸의 변화가 무늬 몇 칸에 해당하는가”를 먼저 생각하세요.",
        "id": "reading-10-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-10-01-b03"
      },
      {
        "type": "paragraph",
        "text": "가로 1024 텍셀짜리 무늬에서 화면 한 픽셀 이동 시 u가 1/256만큼 변한다면, 무늬에서는 약 1024/256=4텍셀을 가로지릅니다. 한 텍셀만 읽는 대신 이 발자국 크기를 고려해 필터링해야 합니다. 미분값 du/dx의 x 단위가 픽셀인지 정규화 좌표인지도 확인합니다.",
        "id": "reading-10-01-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "이것은 국소적인 근사입니다. 물체 경계나 가림이 급변하는 곳에서는 주변 광선의 표면이 달라질 수 있습니다. 텍스처 앨리어싱과 조명 샘플의 몬테카를로 잡음도 다른 문제입니다.",
        "tone": "warning",
        "id": "reading-10-01-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-10-01-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Texture Sampling and Antialiasing’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-10-01-b07"
      },
      {
        "type": "quiz",
        "question": "위 조건에서 한 픽셀은 가로로 대략 몇 텍셀에 해당하나요?",
        "options": [
          "4개",
          "1024개",
          "1/4개"
        ],
        "answer": 0,
        "feedback": "1024×(1/256)=4입니다. 차분과 단위의 의미부터 이해하면 미분 기호가 덜 낯설어집니다.",
        "id": "reading-10-01-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 10.1 · Texture Sampling and Antialiasing",
        "url": "https://pbr-book.org/4ed/Textures_and_Materials/Texture_Sampling_and_Antialiasing",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-10-02",
    "chapter": "10",
    "chapterTitle": "텍스처와 재질",
    "title": "UV 좌표는 표면 위의 주소입니다",
    "deck": "10.2 읽기 길잡이 · 텍스처 좌표",
    "kind": "guide",
    "sourceSection": "10.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 이 예제에서 보간된 UV 좌표는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-10-02-b01"
      },
      {
        "type": "paragraph",
        "text": "3차원 물체의 점에 2차원 무늬를 붙이려면 무늬의 어느 주소를 읽을지 정해야 합니다. u와 v는 보통 그 주소를 나타내는 두 숫자입니다. 꼭짓점 사이에서는 좌표를 보간하거나, 위치를 원통·구면 등의 규칙으로 변환할 수 있습니다. 텍스처 파일과 표면 주소는 서로 다른 데이터입니다.",
        "id": "reading-10-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-10-02-b03"
      },
      {
        "type": "paragraph",
        "text": "세 꼭짓점의 UV가 (0,0), (1,0), (0,1)이고 무게중심 가중치가 0.5, 0.25, 0.25라면 UV는 (0.25,0.25)입니다. 가중치를 똑같이 위치와 UV에 적용하면 표면의 어떤 점이 무늬의 어느 지점인지 일관되게 연결할 수 있습니다.",
        "id": "reading-10-02-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "구면·원통 매핑에는 이음선이 있고, 극점에서는 좌표 변화가 불안정할 수 있습니다. UV를 항상 거리와 같은 단위로 해석하거나 모든 매핑이 왜곡을 없앤다고 생각하지 마세요.",
        "tone": "warning",
        "id": "reading-10-02-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-10-02-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Texture Coordinate Generation’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-10-02-b07"
      },
      {
        "type": "quiz",
        "question": "이 예제에서 보간된 UV 좌표는?",
        "options": [
          "(1,1)",
          "(0.5,0.5)",
          "(0.25,0.25)"
        ],
        "answer": 2,
        "feedback": "두 좌표 성분마다 가중합을 따로 계산합니다.",
        "id": "reading-10-02-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 10.2 · Texture Coordinate Generation",
        "url": "https://pbr-book.org/4ed/Textures_and_Materials/Texture_Coordinate_Generation",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-10-03",
    "chapter": "10",
    "chapterTitle": "텍스처와 재질",
    "title": "텍스처는 그림 파일이 아니라 값을 주는 함수일 수 있습니다",
    "deck": "10.3 읽기 길잡이 · 텍스처 인터페이스",
    "kind": "guide",
    "sourceSection": "10.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 그림 파일 없이도 텍스처를 만들 수 있나요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-02",
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-10-03-b01"
      },
      {
        "type": "paragraph",
        "text": "표면의 한 지점에서 색·거칠기·스칼라 값을 돌려주는 함수도 텍스처입니다. 일정한 값을 주는 함수, 두 결과를 섞는 함수, 계산으로 줄무늬를 만드는 함수도 가능합니다. 같은 평가 약속을 맞추면 재질 코드는 파일 기반인지 절차적 생성인지 몰라도 결과를 사용할 수 있습니다.",
        "id": "reading-10-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-10-03-b03"
      },
      {
        "type": "paragraph",
        "text": "두 스칼라 텍스처 값이 0.2와 0.8이고 혼합 비율이 0.25라면 결과는 0.75×0.2+0.25×0.8=0.35입니다. 입력을 바꾸어도 같은 호출 방식으로 결과를 얻는 것이 인터페이스의 장점입니다. 이것이 색 혼합인지 거칠기 혼합인지는 값의 의미를 따로 확인합니다.",
        "id": "reading-10-03-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "RGB, 스펙트럼, 단일 수치는 서로 같은 타입이 아닙니다. 값을 섞는 것과 두 BSDF를 물리적으로 혼합하는 것도 완전히 같은 연산은 아닙니다.",
        "tone": "warning",
        "id": "reading-10-03-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-10-03-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Texture Interface and Basic Textures’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-10-03-b07"
      },
      {
        "type": "quiz",
        "question": "그림 파일 없이도 텍스처를 만들 수 있나요?",
        "options": [
          "아니요, 텍스처는 무조건 사진이다",
          "아니요, PNG만 가능하다",
          "네, 입력 위치에서 값을 계산하는 함수도 가능하다"
        ],
        "answer": 2,
        "feedback": "텍스처를 함수로 이해하면 상수·혼합·절차적 무늬를 같은 평가 인터페이스로 다룰 수 있습니다.",
        "id": "reading-10-03-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 10.3 · Texture Interface and Basic Textures",
        "url": "https://pbr-book.org/4ed/Textures_and_Materials/Texture_Interface_and_Basic_Textures",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-10-04",
    "chapter": "10",
    "chapterTitle": "텍스처와 재질",
    "title": "먼 무늬는 미리 줄여 둔 버전에서 읽습니다",
    "deck": "10.4 읽기 길잡이 · 이미지 텍스처",
    "kind": "guide",
    "sourceSection": "10.4",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 위 이상적 밉맵 체인의 전체 픽셀 수는 원본의 약 몇 배인가요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01",
      "math-04"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-10-04-b01"
      },
      {
        "type": "paragraph",
        "text": "큰 이미지를 멀리 있는 작은 물체에 붙이면 한 픽셀이 많은 텍셀을 덮습니다. 밉맵은 크기를 단계적으로 줄인 이미지를 준비해 필요한 크기에 맞게 읽는 방법입니다. 가까울 때는 상세한 단계, 멀 때는 축소된 단계를 사용합니다. 모든 텍셀을 매번 평균 내는 비용을 줄이면서 신호를 적절히 걸러내려는 목적입니다.",
        "id": "reading-10-04-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-10-04-b03"
      },
      {
        "type": "paragraph",
        "text": "정사각형 이미지 한 변을 매 단계 절반으로 줄이면 픽셀 수는 1, 1/4, 1/16… 비율로 감소합니다. 무한히 이어지는 이상적인 합은 1/(1−1/4)=4/3입니다. 실제 유한한 밉맵은 원본 대비 약 1/3의 픽셀 저장 비용을 추가합니다. 헤더·정렬·압축 등은 이 계산에서 제외했습니다.",
        "id": "reading-10-04-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "비스듬히 보는 표면에서는 가로·세로 발자국이 다르므로 비등방 필터가 중요합니다. 색상 인코딩된 값을 물리적으로 선형인 값처럼 그대로 평균 내지 않도록 데이터 의미를 확인하세요.",
        "tone": "warning",
        "id": "reading-10-04-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-10-04-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Image Texture’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-10-04-b07"
      },
      {
        "type": "quiz",
        "question": "위 이상적 밉맵 체인의 전체 픽셀 수는 원본의 약 몇 배인가요?",
        "options": [
          "4/3배",
          "4배",
          "2배"
        ],
        "answer": 0,
        "feedback": "단계별 픽셀 수가 1/4씩 줄어드는 등비급수입니다. 실제 메모리 사용량에는 형식별 추가 비용이 있습니다.",
        "id": "reading-10-04-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 10.4 · Image Texture",
        "url": "https://pbr-book.org/4ed/Textures_and_Materials/Image_Texture",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-10-05",
    "chapter": "10",
    "chapterTitle": "텍스처와 재질",
    "title": "표면 방향을 바꾸는 것과 실제 표면을 움직이는 것은 다릅니다",
    "deck": "10.5 읽기 길잡이 · 재질 인터페이스",
    "kind": "guide",
    "sourceSection": "10.5",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 노멀 맵만으로 반드시 바뀌는 것은 무엇인가요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05",
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-10-05-b01"
      },
      {
        "type": "paragraph",
        "text": "재질은 텍스처에서 읽은 값으로 산란 모델을 구성합니다. 색 지도, 거칠기 지도, 표면 방향 지도는 서로 다른 입력입니다. 노멀 매핑은 주로 셰이딩에 사용하는 방향을 바꾸어 세부 굴곡처럼 보이게 합니다. 변위는 실제 형상의 위치를 바꿀 수 있습니다.",
        "id": "reading-10-05-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-10-05-b03"
      },
      {
        "type": "paragraph",
        "text": "평평한 원판에 작은 홈 무늬의 노멀 맵을 붙이면 정면 조명에서 울퉁불퉁해 보일 수 있습니다. 하지만 옆에서 본 원판의 외곽선을 실제로 파내는 것은 아닙니다. 홈이 실루엣까지 바꾸어야 한다면 형상이나 변위를 다루는 추가 작업이 필요합니다.",
        "id": "reading-10-05-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "셰이딩 법선과 기하 법선을 혼동하면 표면의 어느 쪽인지, 가시성, 에너지 처리에서 오류가 납니다. 지도 값의 좌표계와 정규화 규칙도 맞춰야 합니다.",
        "tone": "warning",
        "id": "reading-10-05-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-10-05-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Material Interface and Implementations’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-10-05-b07"
      },
      {
        "type": "quiz",
        "question": "노멀 맵만으로 반드시 바뀌는 것은 무엇인가요?",
        "options": [
          "셰이딩에 사용되는 표면 방향",
          "정점 개수",
          "실제 실루엣"
        ],
        "answer": 0,
        "feedback": "표면 방향을 이용하는 음영을 바꿉니다. 실제 형상의 이동이나 정점 증가와는 구별됩니다.",
        "id": "reading-10-05-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 10.5 · Material Interface and Implementations",
        "url": "https://pbr-book.org/4ed/Textures_and_Materials/Material_Interface_and_Implementations",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-11-01",
    "chapter": "11",
    "chapterTitle": "공간 안의 산란",
    "title": "안개는 빛을 없애기도 하고 방향을 바꾸기도 합니다",
    "deck": "11.1 읽기 길잡이 · 볼륨 산란 과정",
    "kind": "guide",
    "sourceSection": "11.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 흡수 0.2/m, 산란 0.3/m일 때 소멸계수는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-03"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-11-01-b01"
      },
      {
        "type": "paragraph",
        "text": "맑은 진공에서는 광선 사이에 별일이 없지만, 안개 속에서는 중간 지점에서 상호작용이 생깁니다. 흡수는 빛의 에너지를 다른 형태로 전환하고, 산란은 진행 방향을 바꿉니다. 기존 방향에서 빛이 빠져나가는 효과를 함께 기술하는 계수가 소멸계수입니다. 반대로 다른 방향의 빛이 현재 방향으로 들어올 수도 있습니다.",
        "id": "reading-11-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-11-01-b03"
      },
      {
        "type": "paragraph",
        "text": "흡수계수를 0.2/m, 산란계수를 0.3/m로 둔 가상의 균일 매질은 소멸계수가 0.5/m입니다. 0.5는 “무조건 1미터마다 50%가 사라진다”는 확률이 아니라 거리당 변화율을 기술하는 계수입니다. 한 미터 뒤의 원래 방향 투과율은 exp(−0.5)≈0.6065입니다.",
        "id": "reading-11-01-b04"
      },
      {
        "type": "equation",
        "tex": "\\sigma_t=\\sigma_a+\\sigma_s",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "σₜ",
            "소멸계수"
          ],
          [
            "σₐ, σₛ",
            "흡수계수·산란계수: 여기서는 1/m"
          ]
        ],
        "id": "reading-11-01-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "산란은 모든 방향을 합친 에너지의 소멸과 같지 않습니다. 현재 광선에서 빠져나갔다고 씬 전체에서 빛이 사라진 것은 아닙니다. 매질 자체의 방출은 별도로 다룹니다.",
        "tone": "warning",
        "id": "reading-11-01-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-11-01-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Volume Scattering Processes’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-11-01-b08"
      },
      {
        "type": "quiz",
        "question": "흡수 0.2/m, 산란 0.3/m일 때 소멸계수는?",
        "options": [
          "0.06/m",
          "0.1/m",
          "0.5/m"
        ],
        "answer": 2,
        "feedback": "현재 진행 방향에서 빛을 제거하는 흡수와 바깥 산란 계수를 더합니다.",
        "id": "reading-11-01-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 11.1 · Volume Scattering Processes",
        "url": "https://pbr-book.org/4ed/Volume_Scattering/Volume_Scattering_Processes",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-11-02",
    "chapter": "11",
    "chapterTitle": "공간 안의 산란",
    "title": "빛이 절반씩 남는 구간을 이어 붙여 봅니다",
    "deck": "11.2 읽기 길잡이 · 투과율",
    "kind": "guide",
    "sourceSection": "11.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 투과율이 0.8인 구간과 0.5인 구간을 이어 지나면?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01",
      "math-04"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-11-02-b01"
      },
      {
        "type": "paragraph",
        "text": "투과율은 원래 진행 방향의 빛이 구간을 상호작용 없이 얼마나 통과하는지 나타냅니다. 두 구간을 이어 지나갈 때는 남는 비율을 곱합니다. 균일한 매질에서는 이 누적 효과를 지수함수로 간단히 표현합니다. 지수함수 exp는 매번 같은 비율의 변화를 아주 잘게 이어 붙일 때 등장하는 도구입니다.",
        "id": "reading-11-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-11-02-b03"
      },
      {
        "type": "paragraph",
        "text": "소멸계수 0.4/m인 안개를 2m 통과하면 exp(−0.8)≈0.4493이 남습니다. 1m씩 두 구간으로 쪼개면 각각 exp(−0.4)≈0.6703이고 곱은 약 0.4493입니다. 같은 물리적 구간은 계산 편의를 위해 쪼개어도 결과가 같아야 합니다.",
        "id": "reading-11-02-b04"
      },
      {
        "type": "equation",
        "tex": "T(d)=e^{-\\sigma_t d}",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "d",
            "통과 거리: m"
          ],
          [
            "T",
            "상호작용 없이 남는 비율"
          ]
        ],
        "id": "reading-11-02-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "밀도가 위치마다 바뀌면 단순히 임의의 한 지점 계수에 전체 거리를 곱하면 안 됩니다. 경로를 따라 계수를 적분합니다. 여기에 다른 방향에서 들어오는 산란광을 더하면 전체 관측 밝기는 달라집니다.",
        "tone": "warning",
        "id": "reading-11-02-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-11-02-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Transmittance’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-11-02-b08"
      },
      {
        "type": "quiz",
        "question": "투과율이 0.8인 구간과 0.5인 구간을 이어 지나면?",
        "options": [
          "0.65",
          "0.4",
          "1.3"
        ],
        "answer": 1,
        "feedback": "0.8×0.5=0.4입니다. 각 구간의 남는 비율을 곱합니다.",
        "id": "reading-11-02-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 11.2 · Transmittance",
        "url": "https://pbr-book.org/4ed/Volume_Scattering/Transmittance",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-11-03",
    "chapter": "11",
    "chapterTitle": "공간 안의 산란",
    "title": "위상 함수는 산란 뒤의 방향을 설명합니다",
    "deck": "11.3 읽기 길잡이 · 위상 함수",
    "kind": "guide",
    "sourceSection": "11.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 등방 산란에서 구 전체 방향의 확률을 합치면?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05",
      "math-06"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-11-03-b01"
      },
      {
        "type": "paragraph",
        "text": "매질 입자에 부딪힌 빛은 앞쪽으로 더 자주 가거나, 여러 방향으로 비슷하게 퍼질 수 있습니다. 위상 함수는 이런 방향별 분포를 기술합니다. 여기서 “위상”이라는 이름을 파동의 위상 변화와 바로 연결하지 마세요. 이 맥락에서는 산란 방향의 분포가 주제입니다.",
        "id": "reading-11-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-11-03-b03"
      },
      {
        "type": "paragraph",
        "text": "모든 방향이 균등한 등방 산란을 생각합시다. 단위 구의 전체 입체각은 4π이므로 입체각에 대한 밀도는 1/(4π)≈0.0796입니다. 전체를 적분하면 1입니다. 정확히 같은 크기의 두 반구에 들어갈 확률은 각각 1/2입니다.",
        "id": "reading-11-03-b04"
      },
      {
        "type": "equation",
        "tex": "p(\\omega)=\\frac{1}{4\\pi}",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "p",
            "입체각당 방향 확률밀도"
          ],
          [
            "ω",
            "산란 방향"
          ]
        ],
        "id": "reading-11-03-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "앞쪽의 정의는 물리적 빛 진행 방향과 렌더러의 입사·출사 벡터 규약을 함께 봐야 합니다. 내적의 부호를 다른 라이브러리에서 그대로 복사하면 앞·뒤 산란이 뒤바뀔 수 있습니다.",
        "tone": "warning",
        "id": "reading-11-03-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-11-03-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Phase Functions’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-11-03-b08"
      },
      {
        "type": "quiz",
        "question": "등방 산란에서 구 전체 방향의 확률을 합치면?",
        "options": [
          "1",
          "0",
          "4π"
        ],
        "answer": 0,
        "feedback": "밀도 1/(4π)를 입체각 4π에 걸쳐 적분하므로 1입니다.",
        "id": "reading-11-03-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 11.3 · Phase Functions",
        "url": "https://pbr-book.org/4ed/Volume_Scattering/Phase_Functions",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-11-04",
    "chapter": "11",
    "chapterTitle": "공간 안의 산란",
    "title": "매질의 종류보다 먼저 경계와 단위를 맞춥니다",
    "deck": "11.4 읽기 길잡이 · 매질",
    "kind": "guide",
    "sourceSection": "11.4",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 밀도와 경로 길이를 함께 고려해야 하는 이유는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01",
      "math-04"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-11-04-b01"
      },
      {
        "type": "paragraph",
        "text": "균일한 매질은 어디서나 같은 계수를 사용하고, 불균일한 매질은 위치마다 밀도나 광학 특성이 다릅니다. 격자 자료에 저장한 밀도를 읽는 것과 광선이 지금 어느 매질 안에 있는지 판단하는 것은 다른 일입니다. 표면을 통과할 때 내부·외부 매질이 바뀌는 규칙도 필요합니다.",
        "id": "reading-11-04-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-11-04-b03"
      },
      {
        "type": "paragraph",
        "text": "기본 소멸계수가 0.5/m이고 첫 구간의 상대 밀도는 1, 둘째는 2라고 합시다. 각각 길이가 1m라면 광학 두께는 0.5×1+1.0×1=1.5이고 투과율은 exp(−1.5)≈0.2231입니다. 각 구간의 물리적 길이를 함께 곱해야 합니다.",
        "id": "reading-11-04-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "격자 좌표에서의 한 칸을 무조건 1m로 취급하지 마세요. 객체 변환과 밀도 단위가 맞아야 합니다. 공간을 건너뛰는 가속 기법에서도 밀도 상한의 유효성을 보존해야 합니다.",
        "tone": "warning",
        "id": "reading-11-04-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-11-04-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Media’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-11-04-b07"
      },
      {
        "type": "quiz",
        "question": "밀도와 경로 길이를 함께 고려해야 하는 이유는?",
        "options": [
          "계수가 무조건 확률이어서",
          "같은 밀도라도 오래 통과하면 누적 효과가 달라져서",
          "길이는 항상 무시해도 되어서"
        ],
        "answer": 1,
        "feedback": "거리당 계수에 거리를 곱해 무차원 광학 두께를 만듭니다.",
        "id": "reading-11-04-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 11.4 · Media",
        "url": "https://pbr-book.org/4ed/Volume_Scattering/Media",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-12-01",
    "chapter": "12",
    "chapterTitle": "광원",
    "title": "조명을 고르는 함수는 확률도 알려줘야 합니다",
    "deck": "12.1 읽기 길잡이 · 광원 인터페이스",
    "kind": "guide",
    "sourceSection": "12.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 광원 선택 확률 0.25와 조건부 방향 밀도 0.2/sr의 곱은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06",
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-12-01-b01"
      },
      {
        "type": "paragraph",
        "text": "점광원과 면광원은 생김새가 다르지만 렌더러는 공통으로 빛이 오는 방향과 기여, 그 표본의 선택 밀도를 알아야 합니다. 인터페이스는 조명 내부의 표현을 감추면서 필요한 정보를 일관되게 돌려주는 약속입니다. 광원에 닿는지 확인하는 가시성도 실제 기여를 결정합니다.",
        "id": "reading-12-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-12-01-b03"
      },
      {
        "type": "paragraph",
        "text": "램프 하나를 선택할 확률이 1/4이고, 그 램프에서 한 방향을 뽑는 조건부 밀도가 0.2/sr라고 합시다. 전체 선택 밀도는 (1/4)×0.2=0.05/sr입니다. 조건부 방향 밀도만 기록하고 램프 선택 확률을 빼먹으면 가중치가 틀어집니다.",
        "id": "reading-12-01-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "델타 광원은 일반적인 연속 방향 밀도와 다른 규약을 요구합니다. 반환값이 빈 표본인 경우, 가려진 경우, 밀도가 0인 경우를 분리해 처리하세요.",
        "tone": "warning",
        "id": "reading-12-01-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-12-01-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Light Interface’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-12-01-b07"
      },
      {
        "type": "quiz",
        "question": "광원 선택 확률 0.25와 조건부 방향 밀도 0.2/sr의 곱은?",
        "options": [
          "0.8/sr",
          "0.05/sr",
          "0.45/sr"
        ],
        "answer": 1,
        "feedback": "두 단계 선택의 결합 밀도는 곱입니다.",
        "id": "reading-12-01-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 12.1 · Light Interface",
        "url": "https://pbr-book.org/4ed/Light_Sources/Light_Interface",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-12-02",
    "chapter": "12",
    "chapterTitle": "광원",
    "title": "손전등을 멀리하면 왜 어두워질까요",
    "deck": "12.2 읽기 길잡이 · 점광원",
    "kind": "guide",
    "sourceSection": "12.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 거리를 3배로 늘리면 같은 조건의 점광원 조도는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01",
      "math-05"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-12-02-b01"
      },
      {
        "type": "paragraph",
        "text": "모든 방향으로 일정한 방사강도를 내는 이상적 점광원에서는 빛이 퍼지는 구의 면적이 거리의 제곱에 비례합니다. 같은 총량을 더 넓은 면적에 나누므로 수신면의 조도가 감소합니다. 이 설명은 방사휘도가 자유 공간에서 보존된다는 말과 모순되지 않습니다. 서로 다른 물리량을 비교하고 있기 때문입니다.",
        "id": "reading-12-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-12-02-b03"
      },
      {
        "type": "paragraph",
        "text": "표면이 광원을 정면으로 향하고 가림이 없을 때, 2m에서의 조도를 기준으로 4m에서는 (2/4)²=1/4이 됩니다. 2배 멀어졌다고 1/2이 되는 것이 아닙니다. 표면이 기울면 코사인 항도 함께 고려합니다.",
        "id": "reading-12-02-b04"
      },
      {
        "type": "equation",
        "tex": "E=\\frac{I\\cos\\theta}{r^2}",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "E",
            "수신면 복사조도"
          ],
          [
            "I",
            "점광원의 방사강도"
          ],
          [
            "r",
            "거리"
          ],
          [
            "θ",
            "수신면 법선과 광원 방향 사이의 각도"
          ]
        ],
        "id": "reading-12-02-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "광원 위치 자체의 0거리에서는 이상화된 식이 특이해집니다. 실제 유한 크기 조명 근처의 분포를 점광원 식으로 완전히 재현할 수는 없습니다.",
        "tone": "warning",
        "id": "reading-12-02-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-12-02-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Point Lights’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-12-02-b08"
      },
      {
        "type": "quiz",
        "question": "거리를 3배로 늘리면 같은 조건의 점광원 조도는?",
        "options": [
          "1/9",
          "1/3",
          "3배"
        ],
        "answer": 0,
        "feedback": "거리 제곱에 반비례하므로 1/3²=1/9입니다.",
        "id": "reading-12-02-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 12.2 · Point Lights",
        "url": "https://pbr-book.org/4ed/Light_Sources/Point_Lights",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-12-03",
    "chapter": "12",
    "chapterTitle": "광원",
    "title": "멀리 있는 조명은 방향으로 단순화합니다",
    "deck": "12.3 읽기 길잡이 · 먼 광원",
    "kind": "guide",
    "sourceSection": "12.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 이상적 방향광을 사용할 때의 핵심 근사는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-12-03-b01"
      },
      {
        "type": "paragraph",
        "text": "아주 먼 광원에서는 작은 장면 안의 지점마다 광원 방향이 거의 같습니다. 이 상황을 이상화하면 위치 대신 방향 중심으로 조명을 기술할 수 있습니다. 이를 쓰면 모든 점에서 먼 광원의 정확한 위치까지 계산하는 일을 피할 수 있습니다.",
        "id": "reading-12-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-12-03-b03"
      },
      {
        "type": "paragraph",
        "text": "장면의 폭이 1m이고 광원까지의 거리가 1,000,000m인 가상의 상황을 생각하세요. 장면 양끝에서 방향 차이를 만드는 가로 거리와 전방 거리의 비는 약 1/1,000,000입니다. 장면 크기에 비해 거리가 매우 크면 평행 방향 근사가 자연스럽다는 것을 보여줍니다.",
        "id": "reading-12-03-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "이상적인 방향광에는 장면 내부의 위치 변화에 따라 임의로 점광원식 1/r²를 또 곱하지 않습니다. 광원의 각 크기를 무시하면 부드러운 그림자 같은 현상을 놓칠 수 있습니다.",
        "tone": "warning",
        "id": "reading-12-03-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-12-03-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Distant Lights’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-12-03-b07"
      },
      {
        "type": "quiz",
        "question": "이상적 방향광을 사용할 때의 핵심 근사는?",
        "options": [
          "장면 안에서 빛의 방향을 같게 본다",
          "광원이 장면 중심에 있다",
          "모든 물체의 반사율이 같다"
        ],
        "answer": 0,
        "feedback": "광원 거리가 장면 규모보다 매우 크다는 이상화입니다.",
        "id": "reading-12-03-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 12.3 · Distant Lights",
        "url": "https://pbr-book.org/4ed/Light_Sources/Distant_Lights",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-12-04",
    "chapter": "12",
    "chapterTitle": "광원",
    "title": "큰 조명은 보이는 부분만큼 그림자를 만듭니다",
    "deck": "12.4 읽기 길잡이 · 면광원",
    "kind": "guide",
    "sourceSection": "12.4",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 면적 밀도와 입체각 밀도를 그대로 같은 숫자로 쓸 수 있나요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05",
      "math-06"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-12-04-b01"
      },
      {
        "type": "paragraph",
        "text": "면광원에는 크기가 있으므로 표면에서 볼 때 일부는 가려지고 일부는 보일 수 있습니다. 이 부분 가림이 부드러운 그림자를 만드는 원인 중 하나입니다. 계산에서는 광원 위의 점을 선택하는 면적 기준과, 수신점에서 바라보는 방향 기준을 구별해야 합니다.",
        "id": "reading-12-04-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-12-04-b03"
      },
      {
        "type": "paragraph",
        "text": "넓이 4m²의 면광원을 균일하게 뽑으면 면적 밀도는 1/4m²입니다. 선택 지점까지의 거리가 2m, 광원 법선과 연결 방향의 코사인 절댓값이 0.5라면 입체각 밀도는 (1/4)×2²÷0.5=2/sr입니다. 2가 1보다 커도 확률밀도이므로 모순이 아닙니다.",
        "id": "reading-12-04-b04"
      },
      {
        "type": "equation",
        "tex": "p_\\omega=p_A\\frac{r^2}{|n_L\\cdot\\omega|}",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "p_A",
            "면적당 밀도"
          ],
          [
            "p_ω",
            "입체각당 밀도"
          ],
          [
            "n_L",
            "광원 쪽 법선"
          ]
        ],
        "id": "reading-12-04-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "밀도를 변환할 때의 코사인은 광원 쪽 법선에 대한 값입니다. 수신면의 코사인과 섞지 마세요. 실제 가시성 검사는 별도로 해야 합니다.",
        "tone": "warning",
        "id": "reading-12-04-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-12-04-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Area Lights’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-12-04-b08"
      },
      {
        "type": "quiz",
        "question": "면적 밀도와 입체각 밀도를 그대로 같은 숫자로 쓸 수 있나요?",
        "options": [
          "아니요, 거리와 방향에 따른 변환이 필요하다",
          "네, 항상 같다",
          "확률밀도는 단위가 없다"
        ],
        "answer": 0,
        "feedback": "같은 표본이라도 측정 기준이 바뀌면 밀도가 바뀝니다.",
        "id": "reading-12-04-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 12.4 · Area Lights",
        "url": "https://pbr-book.org/4ed/Light_Sources/Area_Lights",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-12-05",
    "chapter": "12",
    "chapterTitle": "광원",
    "title": "배경 그림도 빛을 내는 방향 지도가 됩니다",
    "deck": "12.5 읽기 길잡이 · 환경광",
    "kind": "guide",
    "sourceSection": "12.5",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 환경 지도 픽셀을 모두 동일 확률로 뽑으면 구면 방향도 반드시 균일할까요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05",
      "math-06"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-12-05-b01"
      },
      {
        "type": "paragraph",
        "text": "환경광 지도는 멀리 있는 주변 환경을 방향별 밝기로 저장합니다. 배경으로만 그리는 것과 씬을 실제로 비추게 하는 것은 다른 작업입니다. 밝은 태양이나 창문 방향은 좁은 영역에 모여 있어 균일한 방향 선택만으로는 찾기 어려울 수 있습니다.",
        "id": "reading-12-05-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-12-05-b03"
      },
      {
        "type": "paragraph",
        "text": "지도 전체에서 면적 비중이 작은 밝은 영역이 빛 기여의 대부분을 차지한다고 합시다. 그 영역을 더 자주 뽑되, 선택한 방향의 확률밀도를 이용해 보정하면 적은 샘플로도 더 안정적인 추정이 가능할 수 있습니다. 어두운 영역이라도 0이 아닌 기여가 있다면 지원 범위를 잃지 않도록 합니다.",
        "id": "reading-12-05-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "위도·경도 방식 이미지의 같은 픽셀 크기는 구면의 같은 입체각과 같지 않습니다. 극지방과 적도에서 면적이 달라집니다. 환경광 중요도 분포에는 매핑의 면적 변화를 반영해야 합니다.",
        "tone": "warning",
        "id": "reading-12-05-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-12-05-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Infinite Area Lights’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-12-05-b07"
      },
      {
        "type": "quiz",
        "question": "환경 지도 픽셀을 모두 동일 확률로 뽑으면 구면 방향도 반드시 균일할까요?",
        "options": [
          "아니다, 지도 매핑의 면적 변화를 봐야 한다",
          "픽셀 수와 무관하게 방향은 두 개뿐이다",
          "항상 그렇다"
        ],
        "answer": 0,
        "feedback": "지도 좌표의 균일함과 입체각의 균일함은 서로 다른 기준입니다.",
        "id": "reading-12-05-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 12.5 · Infinite Area Lights",
        "url": "https://pbr-book.org/4ed/Light_Sources/Infinite_Area_Lights",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-12-06",
    "chapter": "12",
    "chapterTitle": "광원",
    "title": "밝은 램프를 자주 고르되, 나머지를 잊지 않습니다",
    "deck": "12.6 읽기 길잡이 · 광원 샘플링",
    "kind": "guide",
    "sourceSection": "12.6",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 2와 6의 기여를 위 확률로 선택·보정하면 결과는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06",
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-12-06-b01"
      },
      {
        "type": "paragraph",
        "text": "조명이 많은 장면에서 모든 램프를 매번 계산하기 어렵다면 일부를 선택합니다. 밝고 가까운 램프처럼 기여가 클 것으로 예상되는 것을 자주 선택하는 전략이 유리할 수 있습니다. 핵심은 “많이 선택한다”가 아니라 “선택 확률과 기여 보정이 한 쌍이다”입니다.",
        "id": "reading-12-06-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-12-06-b03"
      },
      {
        "type": "paragraph",
        "text": "두 램프의 실제 기여가 2와 6이고 선택 확률을 각각 1/4, 3/4로 둔 이상적 예를 생각합니다. 첫째를 뽑으면 2÷0.25=8, 둘째를 뽑으면 6÷0.75=8을 반환합니다. 어느 쪽을 뽑아도 합 8을 얻습니다. 실제 장면에서는 가림과 재질 때문에 완벽한 비율을 미리 알기 어렵습니다.",
        "id": "reading-12-06-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "현재 예상이 어둡다고 실제 기여가 있는 광원의 선택 확률을 0으로 만들면 편향이 생길 수 있습니다. 선택 분포를 바꾸면 해당 표본의 확률도 같이 바뀌어야 합니다.",
        "tone": "warning",
        "id": "reading-12-06-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-12-06-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Light Sampling’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-12-06-b07"
      },
      {
        "type": "quiz",
        "question": "2와 6의 기여를 위 확률로 선택·보정하면 결과는?",
        "options": [
          "4",
          "어느 쪽이든 8",
          "2 또는 6"
        ],
        "answer": 1,
        "feedback": "각 기여를 선택 확률로 나누면 둘 다 8입니다. 합을 추정하는 이산 중요도 샘플링 예제입니다.",
        "id": "reading-12-06-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 12.6 · Light Sampling",
        "url": "https://pbr-book.org/4ed/Light_Sources/Light_Sampling",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-13-01",
    "chapter": "13",
    "chapterTitle": "표면 사이의 빛 전달",
    "title": "한 점의 밝기가 다른 점의 밝기에 의존합니다",
    "deck": "13.1 읽기 길잡이 · 빛 전달 방정식",
    "kind": "guide",
    "sourceSection": "13.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: L=2+0.25L인 예제에서 L은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-02",
      "math-04"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-13-01-b01"
      },
      {
        "type": "paragraph",
        "text": "벽이 밝은 이유는 벽이 스스로 빛을 내서일 수도 있고, 다른 곳에서 온 빛을 반사해서일 수도 있습니다. 다시 그 다른 곳의 밝기도 주변 반사에 의존합니다. 이 서로 물고 물리는 관계를 빛 전달 문제라고 생각하면 됩니다. 식에서 적분은 주변의 연속적인 방향들을 빠짐없이 더하는 역할을 합니다.",
        "id": "reading-13-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-13-01-b03"
      },
      {
        "type": "paragraph",
        "text": "독립적인 장난감 모형으로 값 L이 “자체 기여 2 + 되돌아온 비율 0.25×L”이라고 합시다. L=2+0.25L이므로 0.75L=2, L=8/3≈2.6667입니다. 2+0.5+0.125…처럼 반복해서 더해도 같은 결과에 가까워집니다. 실제 장면의 방향·가시성 적분을 이 한 숫자로 대체하는 것은 아닙니다.",
        "id": "reading-13-01-b04"
      },
      {
        "type": "equation",
        "tex": "L=a+rL\\quad\\Rightarrow\\quad L=\\frac{a}{1-r}\\quad(|r|<1)",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "a",
            "처음 공급되는 값"
          ],
          [
            "r",
            "반복되어 되돌아오는 비율"
          ]
        ],
        "id": "reading-13-01-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "무한히 더할 때 수렴 조건이 필요합니다. 여기서는 돌아오는 비율의 절댓값이 1보다 작습니다. 볼륨 산란을 생략한 표면 모형과 안개 속 수송 방정식도 구분합니다.",
        "tone": "warning",
        "id": "reading-13-01-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-13-01-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘The Light Transport Equation’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-13-01-b08"
      },
      {
        "type": "quiz",
        "question": "L=2+0.25L인 예제에서 L은?",
        "options": [
          "8",
          "2",
          "8/3"
        ],
        "answer": 2,
        "feedback": "L 항을 한쪽으로 모으면 0.75L=2입니다. 반복 반사의 합을 작은 대수식으로 연습한 것입니다.",
        "id": "reading-13-01-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 13.1 · The Light Transport Equation",
        "url": "https://pbr-book.org/4ed/Light_Transport_I_Surface_Reflection/The_Light_Transport_Equation",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-13-02",
    "chapter": "13",
    "chapterTitle": "표면 사이의 빛 전달",
    "title": "경로를 따라 기여의 가중치를 갱신합니다",
    "deck": "13.2 읽기 길잡이 · 경로 추적",
    "kind": "guide",
    "sourceSection": "13.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 주어진 값에서 새 경로 가중치는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05",
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-13-02-b01"
      },
      {
        "type": "paragraph",
        "text": "경로 추적은 카메라에서 시작해 표면을 만나고 다음 방향을 선택하는 일을 반복합니다. 매 단계에서 경로가 최종 픽셀에 얼마나 기여할지 가중치를 갱신합니다. 다음 방향을 자주 뽑는 편향은 선택 밀도로 나누어 보정합니다. 한 경로가 실제 세상의 모든 빛을 대표하는 것은 아니며, 많은 경로의 평균을 사용합니다.",
        "id": "reading-13-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-13-02-b03"
      },
      {
        "type": "paragraph",
        "text": "이전 가중치 β=0.5, 산란값 f=0.2, 코사인 절댓값 0.5, 같은 측도의 방향 밀도 p=0.25인 가상의 단계라면 새 가중치는 0.5×0.2×0.5÷0.25=0.2입니다. 이후 광원 기여가 10이면 이 경로에서 2를 더하는 상황을 생각할 수 있습니다.",
        "id": "reading-13-02-b04"
      },
      {
        "type": "equation",
        "tex": "\\beta_{new}=\\beta\\frac{f|\\cos\\theta|}{p}",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "β",
            "이전 경로 가중치"
          ],
          [
            "f",
            "산란 함수 값"
          ],
          [
            "p",
            "선택한 방향의 밀도"
          ]
        ],
        "id": "reading-13-02-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "이 식은 일반적인 연속 표면 산란 단계의 설명입니다. 델타 분포, 굴절 수송, 매질, 러시안 룰렛에서는 추가 규칙을 확인해야 합니다. 0인 PDF로 나누지 않습니다.",
        "tone": "warning",
        "id": "reading-13-02-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-13-02-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Path Tracing’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-13-02-b08"
      },
      {
        "type": "quiz",
        "question": "주어진 값에서 새 경로 가중치는?",
        "options": [
          "2",
          "0.025",
          "0.2"
        ],
        "answer": 2,
        "feedback": "곱셈 뒤에 0.25로 나누면 0.2입니다. 밀도로 나누는 단계를 빠뜨리지 마세요.",
        "id": "reading-13-02-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 13.2 · Path Tracing",
        "url": "https://pbr-book.org/4ed/Light_Transport_I_Surface_Reflection/Path_Tracing",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-13-03",
    "chapter": "13",
    "chapterTitle": "표면 사이의 빛 전달",
    "title": "작은 경로 추적기는 중단 조건부터 시험합니다",
    "deck": "13.3 읽기 길잡이 · 간단한 경로 추적기",
    "kind": "guide",
    "sourceSection": "13.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 복잡한 장면에서 오류가 보일 때 먼저 할 일은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-07",
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-13-03-b01"
      },
      {
        "type": "paragraph",
        "text": "간단한 렌더러를 만들 때는 화면이 나오는지뿐 아니라 광선이 아무것도 만나지 않은 경우, 빛을 내는 표면에 닿은 경우, 다음 방향을 만들 수 없는 경우를 각각 처리해야 합니다. 경로 최대 깊이는 무한 실행을 막지만 빛의 반복 기여를 잘라내는 설계 선택이기도 합니다.",
        "id": "reading-13-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-13-03-b03"
      },
      {
        "type": "paragraph",
        "text": "확인용 장면을 세 개 만듭니다. 첫째는 물체도 환경광도 없는 검은 장면입니다. 둘째는 카메라에 직접 보이는 일정한 방출 표면입니다. 셋째는 반사면 하나와 광원 하나입니다. 첫째가 밝거나 둘째가 표본 수에 따라 체계적으로 어두워지면 복잡한 장면보다 먼저 기본 분기와 평균을 조사해야 합니다.",
        "id": "reading-13-03-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "최대 깊이를 늘린다고 수학적 오류가 자동으로 해결되지는 않습니다. 임의의 작은 기여를 보정 없이 버리면 평균이 변할 수 있습니다. 표본 수·깊이·난수 시드를 함께 기록하세요.",
        "tone": "warning",
        "id": "reading-13-03-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-13-03-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘A Simple Path Tracer’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-13-03-b07"
      },
      {
        "type": "quiz",
        "question": "복잡한 장면에서 오류가 보일 때 먼저 할 일은?",
        "options": [
          "무조건 샘플 수를 백 배 늘리기",
          "재질을 모두 바꾸기",
          "정답을 예상할 수 있는 작은 장면으로 분리하기"
        ],
        "answer": 2,
        "feedback": "작은 장면에서는 가시성·방출·평균 등의 오류를 따로 찾을 수 있습니다.",
        "id": "reading-13-03-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 13.3 · A Simple Path Tracer",
        "url": "https://pbr-book.org/4ed/Light_Transport_I_Surface_Reflection/A_Simple_Path_Tracer",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-13-04",
    "chapter": "13",
    "chapterTitle": "표면 사이의 빛 전달",
    "title": "두 샘플링 전략을 섞을 때 두 번 세지 않습니다",
    "deck": "13.4 읽기 길잡이 · 효율을 높인 경로 추적기",
    "kind": "guide",
    "sourceSection": "13.4",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 위 조건에서 전략 A의 파워 휴리스틱 가중치는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06",
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-13-04-b01"
      },
      {
        "type": "paragraph",
        "text": "작은 밝은 램프는 광원 쪽에서 뽑는 전략이, 좁은 반사 하이라이트는 재질 쪽에서 뽑는 전략이 잘 찾을 수 있습니다. 다중 중요도 샘플링은 서로 다른 전략을 함께 쓰되 같은 적분을 무턱대고 두 번 더하지 않도록 가중치를 나눕니다. 각 전략이 같은 표본을 어느 밀도로 만들 수 있는지 비교합니다.",
        "id": "reading-13-04-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-13-04-b03"
      },
      {
        "type": "paragraph",
        "text": "동일한 방향에서 전략 A의 밀도가 0.2, B가 0.4이고 각각 한 표본을 쓴다고 합시다. 제곱을 쓰는 파워 휴리스틱에서는 A의 가중치가 0.2²/(0.2²+0.4²)=0.2이고 B는 0.8입니다. 두 가중치의 합은 1입니다. 이것은 혼합의 연습이고 실제 추정량은 각 표본의 기여와 자기 밀도로도 보정됩니다.",
        "id": "reading-13-04-b04"
      },
      {
        "type": "equation",
        "tex": "w_A=\\frac{(n_Ap_A)^2}{(n_Ap_A)^2+(n_Bp_B)^2}",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "n_A, n_B",
            "각 전략의 표본 수"
          ],
          [
            "p_A, p_B",
            "같은 측도에 대한 밀도"
          ]
        ],
        "id": "reading-13-04-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "면적 PDF와 입체각 PDF를 섞어 비교하면 안 됩니다. 표본 개수가 다르면 n×p를 사용하고 델타 표본에는 별도 처리가 필요합니다.",
        "tone": "warning",
        "id": "reading-13-04-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-13-04-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘A Better Path Tracer’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-13-04-b08"
      },
      {
        "type": "quiz",
        "question": "위 조건에서 전략 A의 파워 휴리스틱 가중치는?",
        "options": [
          "2",
          "0.2",
          "0.5"
        ],
        "answer": 1,
        "feedback": "0.04/(0.04+0.16)=0.2입니다.",
        "id": "reading-13-04-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 13.4 · A Better Path Tracer",
        "url": "https://pbr-book.org/4ed/Light_Transport_I_Surface_Reflection/A_Better_Path_Tracer",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-14-01",
    "chapter": "14",
    "chapterTitle": "볼륨 렌더링",
    "title": "안개 속 밝기는 줄어드는 빛과 더해지는 빛의 합입니다",
    "deck": "14.1 읽기 길잡이 · 전달 방정식",
    "kind": "guide",
    "sourceSection": "14.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 위 예제의 출력값은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-04"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-14-01-b01"
      },
      {
        "type": "paragraph",
        "text": "멀리 있는 배경의 빛은 안개를 지나며 줄어들지만, 주변 조명에서 산란되어 시선으로 들어오는 빛도 있습니다. 따라서 투과율만 곱하면 안개가 항상 검게만 보이는 불완전한 모형이 됩니다. 짧은 구간마다 빠지는 양과 들어오는 양을 함께 생각하면 전달 방정식의 역할을 이해할 수 있습니다.",
        "id": "reading-14-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-14-01-b03"
      },
      {
        "type": "paragraph",
        "text": "독립적인 균일 구간 모형에서 Lout=T×Lin+(1−T)×S라고 둡시다. T=0.5, 배경 Lin=10, 일정한 소스 수준 S=2이면 5+1=6입니다. 단순 감쇠만 계산한 5와 다릅니다. 여기서 S가 일정하고 계수도 균일하다는 조건을 사용했습니다.",
        "id": "reading-14-01-b04"
      },
      {
        "type": "equation",
        "tex": "L_{out}=T L_{in}+(1-T)S",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "T",
            "구간 투과율"
          ],
          [
            "S",
            "이 작은 균일 모형의 일정한 소스 수준"
          ]
        ],
        "id": "reading-14-01-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "일반적인 불균일 매질에서는 소스 항과 계수가 위치에 따라 달라져 경로 적분이 필요합니다. 이 폐형식 예제를 모든 안개에 그대로 쓰지 마세요.",
        "tone": "warning",
        "id": "reading-14-01-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-14-01-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘The Equation of Transfer’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-14-01-b08"
      },
      {
        "type": "quiz",
        "question": "위 예제의 출력값은?",
        "options": [
          "5",
          "6",
          "12"
        ],
        "answer": 1,
        "feedback": "배경에서 남은 5에 구간 내부의 소스 기여 1을 더합니다.",
        "id": "reading-14-01-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 14.1 · The Equation of Transfer",
        "url": "https://pbr-book.org/4ed/Light_Transport_II_Volume_Rendering/The_Equation_of_Transfer",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-14-02",
    "chapter": "14",
    "chapterTitle": "볼륨 렌더링",
    "title": "가상 충돌은 계산을 위한 후보입니다",
    "deck": "14.2 읽기 길잡이 · 볼륨 적분기",
    "kind": "guide",
    "sourceSection": "14.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 상한 0.5/m, 실제 계수 0.3/m의 비율은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06",
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-14-02-b01"
      },
      {
        "type": "paragraph",
        "text": "밀도가 제각각인 안개 속에서 매번 정확한 충돌 거리를 바로 뽑기 어려울 수 있습니다. 한 방법은 실제 소멸계수보다 크거나 같은 상한으로 후보 거리를 뽑고, 후보가 실제 상호작용인지 가상 충돌인지 구분하는 것입니다. 가상 충돌은 계산을 쉽게 하기 위한 장치이지 새로운 물리적 입자가 아닙니다.",
        "id": "reading-14-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-14-02-b03"
      },
      {
        "type": "paragraph",
        "text": "특정 지점의 실제 소멸계수가 0.3/m이고 사용하는 상한이 0.5/m이면 후보를 실제 상호작용으로 받아들일 비율은 0.3/0.5=0.6입니다. 남은 0.4는 이 단순한 설명에서 가상 후보입니다. 실제 상호작용으로 정해진 뒤 흡수인지 산란인지도 모델에 맞게 정합니다.",
        "id": "reading-14-02-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "상한이 실제 계수보다 작으면 비율이 1보다 커지고 이 확률 절차의 전제가 깨집니다. 실제 PBRT의 스펙트럼 가중 추정기는 이 작은 단일 파장 예제보다 더 많은 규칙을 사용합니다.",
        "tone": "warning",
        "id": "reading-14-02-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-14-02-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Volume Scattering Integrators’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-14-02-b07"
      },
      {
        "type": "quiz",
        "question": "상한 0.5/m, 실제 계수 0.3/m의 비율은?",
        "options": [
          "0.2",
          "1.5",
          "0.6"
        ],
        "answer": 2,
        "feedback": "0.3÷0.5=0.6입니다. 상한의 유효성이 알고리즘 정확성의 전제입니다.",
        "id": "reading-14-02-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 14.2 · Volume Scattering Integrators",
        "url": "https://pbr-book.org/4ed/Light_Transport_II_Volume_Rendering/Volume_Scattering_Integrators",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-14-03",
    "chapter": "14",
    "chapterTitle": "볼륨 렌더링",
    "title": "코팅은 겉면과 안쪽의 경로를 함께 만듭니다",
    "deck": "14.3 읽기 길잡이 · 층진 재질",
    "kind": "guide",
    "sourceSection": "14.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 층진 재질을 단순한 두 RGB의 평균으로만 보면 무엇을 놓칠까요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-02",
      "math-04"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-14-03-b01"
      },
      {
        "type": "paragraph",
        "text": "투명한 코팅 아래의 색층을 생각해 보세요. 일부 빛은 코팅 표면에서 바로 반사되고 일부는 안으로 들어가 색층에서 반사된 뒤 다시 나옵니다. 안에서 여러 번 반사될 수도 있습니다. 층진 재질은 두 재질의 최종 색을 단순히 절반씩 섞는 것과 다릅니다.",
        "id": "reading-14-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-14-03-b03"
      },
      {
        "type": "paragraph",
        "text": "경계와 내부에서의 여러 효과를 이미 포함한 장난감 경로값이 처음 0.2이고, 한 번 더 왕복할 때마다 0.3배가 된다고 합시다. 합은 0.2+0.06+0.018…=0.2/(1−0.3)≈0.2857입니다. 첫 왕복만 남기면 0.2라 나머지 기여를 놓칩니다.",
        "id": "reading-14-03-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "실제 층에서는 각도, 두께, 굴절률, 흡수, 산란이 경로별로 다릅니다. 이 등비급수 예제는 반복 기여를 연습하는 것이며 층진 BSDF의 대체 공식이 아닙니다.",
        "tone": "warning",
        "id": "reading-14-03-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-14-03-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Scattering from Layered Materials’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-14-03-b07"
      },
      {
        "type": "quiz",
        "question": "층진 재질을 단순한 두 RGB의 평균으로만 보면 무엇을 놓칠까요?",
        "options": [
          "파일 확장자",
          "변수 이름",
          "내부 왕복·흡수·각도 의존성"
        ],
        "answer": 2,
        "feedback": "빛은 여러 경계를 통과하며 다른 경로와 에너지 변화를 겪습니다.",
        "id": "reading-14-03-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 14.3 · Scattering from Layered Materials",
        "url": "https://pbr-book.org/4ed/Light_Transport_II_Volume_Rendering/Scattering_from_Layered_Materials",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-15-01",
    "chapter": "15",
    "chapterTitle": "GPU에서 일 나누기",
    "title": "같은 일을 하는 경로끼리 모읍니다",
    "deck": "15.1 읽기 길잡이 · GPU로 옮기기",
    "kind": "guide",
    "sourceSection": "15.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 웨이브프런트 방식에서 함께 고려할 비용은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-15-01-b01"
      },
      {
        "type": "paragraph",
        "text": "GPU는 많은 작업을 함께 처리하지만 모든 작업이 서로 다른 분기로 흩어지면 자원을 효율적으로 사용하기 어려울 수 있습니다. 웨이브프런트 방식은 교차 검사, 재질 평가, 그림자 검사처럼 비슷한 단계의 경로를 큐에 모아 처리합니다. 큰 함수 하나에 모든 것을 넣는 방법과 다른 설계입니다.",
        "id": "reading-15-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-15-01-b03"
      },
      {
        "type": "paragraph",
        "text": "64개 경로 중 40개는 확산 표면, 24개는 유리 표면을 만났다고 합시다. 분류 후 두 종류의 큐를 따로 처리하면 각 단계의 코드를 더 균일하게 실행할 기회가 생깁니다. 하지만 분류와 큐 저장·읽기에도 비용이 있으므로 “분리하면 무조건 빨라진다”는 결론은 내릴 수 없습니다.",
        "id": "reading-15-01-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "GPU 세대, 경로 분포, 메모리 접근에 따라 결과가 달라집니다. CPU 시간을 GPU 성능으로 추측하지 말고 같은 장면·표본 수에서 실제로 측정하세요.",
        "tone": "warning",
        "id": "reading-15-01-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-15-01-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Mapping Path Tracing to the GPU’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-15-01-b07"
      },
      {
        "type": "quiz",
        "question": "웨이브프런트 방식에서 함께 고려할 비용은?",
        "options": [
          "함수 이름만",
          "계산뿐 아니라 큐와 메모리 이동 비용",
          "큐는 항상 무료다"
        ],
        "answer": 1,
        "feedback": "분기 효율 개선과 큐 관리 비용 사이의 균형을 측정해야 합니다.",
        "id": "reading-15-01-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 15.1 · Mapping Path Tracing to the GPU",
        "url": "https://pbr-book.org/4ed/Wavefront_Rendering_on_GPUs/Mapping_Path_Tracing_to_the_GPU",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-15-02",
    "chapter": "15",
    "chapterTitle": "GPU에서 일 나누기",
    "title": "필요한 값만 연속해서 읽을 수 있게 배치합니다",
    "deck": "15.2 읽기 길잡이 · 구현 기반",
    "kind": "guide",
    "sourceSection": "15.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 항상 하나의 메모리 배치가 가장 빠른가요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-15-02-b01"
      },
      {
        "type": "paragraph",
        "text": "배열의 각 원소에 위치·색·상태를 모두 넣는 방식과, 위치 배열·색 배열·상태 배열을 따로 두는 방식이 있습니다. 어떤 배치가 좋은지는 어떤 단계가 어떤 필드만 읽는지에 따라 달라집니다. 여러 작업이 같은 필드에 연속 접근하면 메모리 전송을 효율적으로 묶을 기회가 있습니다.",
        "id": "reading-15-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-15-02-b03"
      },
      {
        "type": "paragraph",
        "text": "한 경로 자료가 위치 12바이트, 색 12바이트, 상태 4바이트로 총 28바이트라고 가정합니다. 어떤 단계가 상태만 필요하면 논리적으로 필요한 값은 경로당 4바이트뿐입니다. 상태 배열을 분리하면 불필요한 필드를 읽는 일을 줄일 수 있습니다. 실제 트랜잭션 수는 정렬·캐시·하드웨어에 따라 다릅니다.",
        "id": "reading-15-02-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "크기 합계와 실제 구조체 크기는 정렬 때문에 다를 수 있습니다. 호스트·기기 메모리의 수명과 접근 가능성도 별도로 관리해야 합니다.",
        "tone": "warning",
        "id": "reading-15-02-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-15-02-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Implementation Foundations’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-15-02-b07"
      },
      {
        "type": "quiz",
        "question": "항상 하나의 메모리 배치가 가장 빠른가요?",
        "options": [
          "네, 배열의 구조체만 정답이다",
          "네, 구조체 배열만 정답이다",
          "아니요, 접근 패턴과 하드웨어를 봐야 한다"
        ],
        "answer": 2,
        "feedback": "같이 읽는 값과 따로 읽는 값, 이동 비용을 기준으로 판단합니다.",
        "id": "reading-15-02-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 15.2 · Implementation Foundations",
        "url": "https://pbr-book.org/4ed/Wavefront_Rendering_on_GPUs/Implementation_Foundations",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-15-03",
    "chapter": "15",
    "chapterTitle": "GPU에서 일 나누기",
    "title": "큐가 넘치지 않는지 먼저 확인합니다",
    "deck": "15.3 읽기 길잡이 · 경로 추적기 구현",
    "kind": "guide",
    "sourceSection": "15.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 80개 작업이 각각 최대 두 개를 생성할 때 단순 최대 개수는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-15-03-b01"
      },
      {
        "type": "paragraph",
        "text": "경로를 단계별 큐로 전달하는 구현에는 값의 내용뿐 아니라 몇 개가 들어갔는지, 어느 단계가 쓰고 읽는지, 최대 용량은 얼마인지가 중요합니다. 잘못된 인덱스나 용량 계산은 빠른 렌더러가 아니라 잘못된 렌더러를 만듭니다. 실행 단계가 끝나는 시점의 동기화도 설계에 포함됩니다.",
        "id": "reading-15-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-15-03-b03"
      },
      {
        "type": "paragraph",
        "text": "현재 큐에 80개가 있고 각 항목이 최대 2개의 후속 작업을 만들 수 있다면 단순 상한은 160개입니다. 다음 큐 용량이 100개뿐이라면 일부 작업이 빠지거나 범위를 넘을 위험이 있습니다. 실제 분기 수를 줄이거나 충분한 용량·검사·분할 처리 정책을 마련해야 합니다.",
        "id": "reading-15-03-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "원자적 카운터 하나를 쓴다고 모든 메모리 접근과 수명 문제가 해결되지는 않습니다. 작은 장면의 CPU 결과와 비교하고, 난수 시드·정밀도·표본 수를 함께 기록하세요.",
        "tone": "warning",
        "id": "reading-15-03-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-15-03-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Path Tracer Implementation’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-15-03-b07"
      },
      {
        "type": "quiz",
        "question": "80개 작업이 각각 최대 두 개를 생성할 때 단순 최대 개수는?",
        "options": [
          "160",
          "80",
          "100"
        ],
        "answer": 0,
        "feedback": "최악의 경우 80×2=160개입니다. 평균 생성 수만으로 용량을 잡지 않습니다.",
        "id": "reading-15-03-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 15.3 · Path Tracer Implementation",
        "url": "https://pbr-book.org/4ed/Wavefront_Rendering_on_GPUs/Path_Tracer_Implementation",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-16-01",
    "chapter": "16",
    "chapterTitle": "설계 돌아보기",
    "title": "같은 이름의 렌더러라도 판본은 구분합니다",
    "deck": "16.1 읽기 길잡이 · PBRT의 변화",
    "kind": "guide",
    "sourceSection": "16.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 재현 가능한 기록에 필요한 것은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-16-01-b01"
      },
      {
        "type": "paragraph",
        "text": "장기간 발전한 프로그램은 인터페이스와 데이터 표현, 알고리즘 선택이 바뀝니다. 오래된 설명의 코드 이름이 익숙해 보여도 현재 읽는 판본과 같은 구현이라고 단정하지 않습니다. 비교할 때는 책 판본과 코드 버전을 함께 기록하는 습관이 중요합니다.",
        "id": "reading-16-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-16-01-b03"
      },
      {
        "type": "paragraph",
        "text": "학습 노트 머리에 “책 4판, 소스 커밋 X, 장면 Y”라고 기록했다고 합시다. 이후 새 버전에서 함수 이름이나 동작이 달라지면 동일한 커밋으로 돌아가 당시 결과를 재현할 수 있습니다. “최신 코드”라고만 쓰면 나중에 무엇을 실행했는지 알기 어렵습니다.",
        "id": "reading-16-01-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "원문의 회고는 책이 출간될 당시의 관점입니다. 그 내용을 2026년의 최신 구현·성능 현황이라고 표시하지 않습니다.",
        "tone": "warning",
        "id": "reading-16-01-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-16-01-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘pbrt over the Years’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-16-01-b07"
      },
      {
        "type": "quiz",
        "question": "재현 가능한 기록에 필요한 것은?",
        "options": [
          "책 판본·코드 버전·실행 조건",
          "화면 색상만",
          "“최신”이라는 단어만"
        ],
        "answer": 0,
        "feedback": "버전과 조건을 고정해야 결과 차이가 구현 변화인지 실험 차이인지 판단할 수 있습니다.",
        "id": "reading-16-01-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 16.1 · pbrt over the Years",
        "url": "https://pbr-book.org/4ed/Retrospective_and_the_Future/pbrt_over_the_Years",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-16-02",
    "chapter": "16",
    "chapterTitle": "설계 돌아보기",
    "title": "설계 대안은 비용을 나란히 놓고 비교합니다",
    "deck": "16.2 읽기 길잡이 · 설계의 대안",
    "kind": "guide",
    "sourceSection": "16.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 메모리 제한이 4GB일 때 위 두 구현을 평가하는 적절한 태도는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-16-02-b01"
      },
      {
        "type": "paragraph",
        "text": "프로그램 설계에는 실행 시간, 메모리, 구현 복잡도, 확장성 같은 여러 기준이 있습니다. 한 기준에서 이득을 얻으면서 다른 기준에서는 비용을 낼 수 있습니다. 먼저 무엇을 최적화하려는지 정하고 같은 조건에서 비교하세요.",
        "id": "reading-16-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-16-02-b03"
      },
      {
        "type": "paragraph",
        "text": "독립적인 예제로 A가 12초·2GB, B가 8초·5GB를 사용한다고 합시다. 4GB만 쓸 수 있는 환경에서는 B의 속도 이득을 그대로 누릴 수 없습니다. 메모리 제한이 충분하고 반복 렌더링 시간이 중요한 환경에서는 판단이 달라질 수 있습니다. 숫자는 가상의 비교 연습입니다.",
        "id": "reading-16-02-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "한 장면의 측정으로 모든 장면에서의 우위를 선언하지 마세요. 측정 조건, 오차, 유지보수 비용까지 함께 적으면 단정 대신 근거 있는 선택을 할 수 있습니다.",
        "tone": "warning",
        "id": "reading-16-02-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-16-02-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Design Alternatives’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-16-02-b07"
      },
      {
        "type": "quiz",
        "question": "메모리 제한이 4GB일 때 위 두 구현을 평가하는 적절한 태도는?",
        "options": [
          "8초인 B가 무조건 답이다",
          "12초인 A가 모든 환경에서 답이다",
          "메모리 제약 때문에 선택이 달라질 수 있다"
        ],
        "answer": 2,
        "feedback": "성능은 시간 하나로 결정되지 않습니다. 필요한 조건과 제약을 먼저 정의합니다.",
        "id": "reading-16-02-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 16.2 · Design Alternatives",
        "url": "https://pbr-book.org/4ed/Retrospective_and_the_Future/Design_Alternatives",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-16-03",
    "chapter": "16",
    "chapterTitle": "설계 돌아보기",
    "title": "새 방법을 볼 때 무엇을 추정하는지 먼저 묻습니다",
    "deck": "16.3 읽기 길잡이 · 책에서 소개하는 연구 주제",
    "kind": "guide",
    "sourceSection": "16.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 오차 0.01이라는 결과를 해석하기 전에 확인할 것은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-16-03-b01"
      },
      {
        "type": "paragraph",
        "text": "새로운 렌더링 방법의 이름을 외우기보다 목표량과 전제를 확인하세요. 무엇을 입력으로 받고, 어떤 값을 출력하며, 어떤 오차가 허용되는지 알면 기존 방법과 비교할 기준이 생깁니다. 학습 기반 근사나 재사용 기법도 입력 분포와 실패 사례를 따져야 합니다.",
        "id": "reading-16-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-16-03-b03"
      },
      {
        "type": "paragraph",
        "text": "한 방법이 특정 테스트 장면에서 오차 0.01을 보였다고 해 봅시다. 그 값이 픽셀별 제곱오차 평균인지, 최댓값인지, 사람이 평가한 값인지 모르면 해석할 수 없습니다. 같은 숫자라도 측정 방식이 다르면 직접 비교할 수 없습니다. 장면 밖의 새로운 입력에서도 같은 성능인지 따로 시험합니다.",
        "id": "reading-16-03-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "이 수업은 새로운 논문들의 최신 순위를 제공하지 않습니다. PBRT 4판의 연구 주제 링크는 출간 시점의 맥락으로 읽고, 현재 동향은 별도 자료로 갱신해야 합니다.",
        "tone": "warning",
        "id": "reading-16-03-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-16-03-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Emerging Topics’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-16-03-b07"
      },
      {
        "type": "quiz",
        "question": "오차 0.01이라는 결과를 해석하기 전에 확인할 것은?",
        "options": [
          "발표 슬라이드의 색",
          "평가 지표·데이터·비교 조건",
          "논문의 제목 길이"
        ],
        "answer": 1,
        "feedback": "어떤 오차를 어떻게 측정했는지 알아야 숫자에 의미가 있습니다.",
        "id": "reading-16-03-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 16.3 · Emerging Topics",
        "url": "https://pbr-book.org/4ed/Retrospective_and_the_Future/Emerging_Topics",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-16-04",
    "chapter": "16",
    "chapterTitle": "설계 돌아보기",
    "title": "미래를 예언하기보다 검증 가능한 질문을 만듭니다",
    "deck": "16.4 읽기 길잡이 · 미래를 바라보는 질문",
    "kind": "guide",
    "sourceSection": "16.4",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 검증 가능한 연구 질문에 가까운 것은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-16-04-b01"
      },
      {
        "type": "paragraph",
        "text": "어떤 기술이 미래에 반드시 이긴다고 단정하는 대신 작은 실험으로 확인할 질문을 만듭니다. “품질이 좋다”보다 “같은 시간에서 특정 오차가 줄어드는가”처럼 측정 가능한 질문이 유용합니다. 더 많은 계산, 더 좋은 표본, 더 나은 근사가 각각 어떤 역할을 하는지 나누어 보세요.",
        "id": "reading-16-04-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-16-04-b03"
      },
      {
        "type": "paragraph",
        "text": "새 샘플링 방법을 시험한다면 같은 장면, 같은 시간 예산, 서로 다른 여러 난수 시드로 반복합니다. 평균 오차뿐 아니라 드물게 큰 오류가 나는지 살펴봅니다. 단 한 장의 보기 좋은 결과는 경향을 증명하기에 부족합니다.",
        "id": "reading-16-04-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "미래 전망과 검증된 사실은 다른 종류의 문장입니다. 전망에는 시점과 불확실성을 붙이고, 아직 측정하지 않은 성능 향상을 결과처럼 표시하지 않습니다.",
        "tone": "warning",
        "id": "reading-16-04-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-16-04-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘The Future’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-16-04-b07"
      },
      {
        "type": "quiz",
        "question": "검증 가능한 연구 질문에 가까운 것은?",
        "options": [
          "보기 좋으니 정확하다",
          "이 방법은 영원히 최고다",
          "같은 시간에서 여러 시드의 평균 오차가 줄어드는가"
        ],
        "answer": 2,
        "feedback": "입력 조건과 평가 방법을 정하면 반복해서 확인할 수 있습니다.",
        "id": "reading-16-04-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 16.4 · The Future",
        "url": "https://pbr-book.org/4ed/Retrospective_and_the_Future/The_Future",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-16-05",
    "chapter": "16",
    "chapterTitle": "설계 돌아보기",
    "title": "한 픽셀을 자신의 말로 설명하면 연결이 보입니다",
    "deck": "16.5 읽기 길잡이 · 마무리",
    "kind": "guide",
    "sourceSection": "16.5",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 마무리 점검으로 가장 도움이 되는 활동은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-04",
      "math-05",
      "math-06",
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-16-05-b01"
      },
      {
        "type": "paragraph",
        "text": "마무리 과제는 모든 공식을 외우는 것이 아닙니다. 카메라 표본이 광선이 되고, 형상과 만나고, 재질·광원·매질을 거쳐 픽셀에 기여하는 흐름을 설명해 보세요. 각 단계에서 쓰는 단위와 확률, 데이터가 어떻게 연결되는지 적으면 모르는 부분이 드러납니다.",
        "id": "reading-16-05-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-16-05-b03"
      },
      {
        "type": "paragraph",
        "text": "자작 과제로 무광 구 하나와 면광원 하나인 장면을 가정합니다. “왜 점 하나가 아니라 픽셀 영역을 샘플링하는가?”, “가려진 광원 표본의 기여는?”, “표본 수를 늘릴 때 줄어드는 것은 어떤 오차인가?”를 노트에 답합니다. 다음에는 유리나 안개를 하나만 추가하고 필요한 변경을 비교합니다.",
        "id": "reading-16-05-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "수업을 읽었다는 표시, 문제에 답했다는 기록, 실제 구현을 설명할 수 있다는 상태는 서로 다릅니다. 앱은 이들을 완역 여부나 전문가 검수 완료와 혼동하지 않습니다.",
        "tone": "warning",
        "id": "reading-16-05-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-16-05-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Conclusion’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-16-05-b07"
      },
      {
        "type": "quiz",
        "question": "마무리 점검으로 가장 도움이 되는 활동은?",
        "options": [
          "모든 경고를 숨기기",
          "작은 장면의 계산 흐름을 조건과 함께 설명하기",
          "수업 개수만 세기"
        ],
        "answer": 1,
        "feedback": "개별 개념을 연결하고 가정·단위·확률의 역할을 자신의 말로 설명하는 것이 목표입니다.",
        "id": "reading-16-05-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 16.5 · Conclusion",
        "url": "https://pbr-book.org/4ed/Retrospective_and_the_Future/Conclusion",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-a-01",
    "chapter": "A",
    "chapterTitle": "부록 A · 샘플링 도구",
    "title": "불균등한 추첨을 두 번의 선택으로 바꿉니다",
    "deck": "A.1 읽기 길잡이 · 앨리어스 방법",
    "kind": "guide",
    "sourceSection": "A.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 첫 칸 선택 확률 0.5, 그 안에서 A 선택 확률 0.5라면 A의 최종 확률은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06",
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-a-01-b01"
      },
      {
        "type": "paragraph",
        "text": "가중치가 다른 많은 항목을 계속 뽑아야 할 때, 매번 목록을 끝까지 훑는 것은 낭비일 수 있습니다. 앨리어스 방법은 먼저 표를 만들고, 표의 칸을 균등하게 하나 선택한 뒤 그 칸의 기본 항목과 대체 항목 중 하나를 선택합니다. 미리 계산하는 비용과 이후 반복 선택의 비용을 바꾸는 생각입니다.",
        "id": "reading-a-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-a-01-b03"
      },
      {
        "type": "paragraph",
        "text": "두 항목 A, B를 확률 0.25와 0.75로 뽑는 새 예제입니다. 두 칸을 절반 확률로 고릅니다. 첫 칸에서는 동전을 던져 절반은 A, 절반은 B를 반환합니다. 둘째 칸에서는 항상 B를 반환합니다. A의 최종 확률은 0.5×0.5=0.25이고 B는 0.75입니다.",
        "id": "reading-a-01-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "각 항목을 뽑는 비용이 상수 시간이어도 표 생성·메모리 비용까지 0인 것은 아닙니다. 가중치 합이 0이거나 음수인 입력을 어떻게 처리할지도 정해야 합니다.",
        "tone": "warning",
        "id": "reading-a-01-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-a-01-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘The Alias Method’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-a-01-b07"
      },
      {
        "type": "quiz",
        "question": "첫 칸 선택 확률 0.5, 그 안에서 A 선택 확률 0.5라면 A의 최종 확률은?",
        "options": [
          "0.5",
          "1",
          "0.25"
        ],
        "answer": 2,
        "feedback": "두 단계를 함께 통과할 확률을 곱합니다.",
        "id": "reading-a-01-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 A.1 · The Alias Method",
        "url": "https://pbr-book.org/4ed/Sampling_Algorithms/The_Alias_Method",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-a-02",
    "chapter": "A",
    "chapterTitle": "부록 A · 샘플링 도구",
    "title": "끝을 모르는 목록에서 하나를 공평하게 남깁니다",
    "deck": "A.2 읽기 길잡이 · 저수지 샘플링",
    "kind": "guide",
    "sourceSection": "A.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 동일 가중치의 열 번째 항목으로 후보를 교체할 확률은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-a-02-b01"
      },
      {
        "type": "paragraph",
        "text": "입력이 몇 개 올지 모르고 모두 저장할 수도 없다면 하나의 후보만 유지할 수 있습니다. 가중치가 같은 경우 k번째 항목이 왔을 때 1/k 확률로 현재 후보를 새 항목으로 바꾸면, 지금까지 본 항목이 공평한 확률로 남습니다. 이것이 가장 작은 저수지 샘플링의 생각입니다.",
        "id": "reading-a-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-a-02-b03"
      },
      {
        "type": "paragraph",
        "text": "A, B, C가 차례로 옵니다. A는 처음에 저장되고, B가 오면 1/2로 교체합니다. C가 오면 1/3로 교체합니다. A가 최종적으로 남을 확률은 1×1/2×2/3=1/3입니다. B도 1/2×2/3=1/3, C도 1/3입니다. 모든 항목을 배열에 보관하지 않았어도 균등합니다.",
        "id": "reading-a-02-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "이 예제는 동일 가중치에서 한 항목만 남기는 방법입니다. 가중치가 다를 때는 누적 가중치와 교체 확률이 달라집니다. 후보를 뽑는 방법과 렌더링 추정량의 가중치 설계도 구분하세요.",
        "tone": "warning",
        "id": "reading-a-02-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-a-02-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Reservoir Sampling’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-a-02-b07"
      },
      {
        "type": "quiz",
        "question": "동일 가중치의 열 번째 항목으로 후보를 교체할 확률은?",
        "options": [
          "1/10",
          "1",
          "1/2"
        ],
        "answer": 0,
        "feedback": "지금까지 본 항목 수 k가 10이므로 1/k=1/10입니다.",
        "id": "reading-a-02-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 A.2 · Reservoir Sampling",
        "url": "https://pbr-book.org/4ed/Sampling_Algorithms/Reservoir_Sampling",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-a-03",
    "chapter": "A",
    "chapterTitle": "부록 A · 샘플링 도구",
    "title": "후보를 뽑고, 적절한 비율로 받아들입니다",
    "deck": "A.3 읽기 길잡이 · 기각 샘플링",
    "kind": "guide",
    "sourceSection": "A.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 위 예제에서 후보 x=0.8의 수락 확률은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06",
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-a-03-b01"
      },
      {
        "type": "paragraph",
        "text": "어떤 분포에서 직접 뽑기 어렵다면 쉬운 분포에서 후보를 만들고 일부만 받아들이는 방법을 쓸 수 있습니다. 높이가 높은 구간의 후보를 더 자주 남기면 원하는 모양의 분포에 가까워집니다. 받아들일 확률이 1을 넘지 않도록 전체를 덮는 상한이 있어야 합니다.",
        "id": "reading-a-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-a-03-b03"
      },
      {
        "type": "paragraph",
        "text": "0~1에서 목표 밀도를 f(x)=2x로 두고 후보는 균일하게 뽑습니다. 상한을 2로 두면 후보 x의 수락 확률은 x입니다. x=0.2는 20%, x=0.8은 80%로 받아들입니다. 수락 확률의 평균은 1/2이므로 평균적으로 후보 두 개에 하나를 남기는 상황입니다.",
        "id": "reading-a-03-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "기각된 후보가 있다고 실패한 알고리즘은 아닙니다. 다만 상한이 느슨하면 낭비가 커집니다. 목표가 후보 분포의 지원 범위 밖에서 양수라면 올바르게 샘플링할 수 없습니다.",
        "tone": "warning",
        "id": "reading-a-03-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-a-03-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘The Rejection Method’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-a-03-b07"
      },
      {
        "type": "quiz",
        "question": "위 예제에서 후보 x=0.8의 수락 확률은?",
        "options": [
          "80%",
          "20%",
          "40%"
        ],
        "answer": 0,
        "feedback": "f(x)를 상한 2로 나누므로 (2×0.8)/2=0.8입니다.",
        "id": "reading-a-03-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 A.3 · The Rejection Method",
        "url": "https://pbr-book.org/4ed/Sampling_Algorithms/The_Rejection_Method",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-a-04",
    "chapter": "A",
    "chapterTitle": "부록 A · 샘플링 도구",
    "title": "누적된 확률에서 주소를 거꾸로 찾습니다",
    "deck": "A.4 읽기 길잡이 · 일차원 함수 샘플링",
    "kind": "guide",
    "sourceSection": "A.4",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: CDF가 x²일 때 u=0.81을 역변환한 값은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-04",
      "math-06"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-a-04-b01"
      },
      {
        "type": "paragraph",
        "text": "누적분포함수 CDF는 왼쪽부터 쌓인 확률을 알려줍니다. 균일 난수 u를 누적 확률의 주소로 보고 그 주소가 되는 x를 찾으면 원하는 분포에서 샘플을 만들 수 있습니다. 그래프의 높이를 직접 균일하게 고르는 것과 다릅니다.",
        "id": "reading-a-04-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-a-04-b03"
      },
      {
        "type": "paragraph",
        "text": "0~1에서 밀도가 p(x)=2x이면 x까지 쌓인 면적은 x²입니다. u=0.36이라는 누적 확률 주소에 대응하는 값은 x²=0.36을 풀어 x=0.6입니다. x=0.36을 그대로 반환하면 목표 분포와 다릅니다.",
        "id": "reading-a-04-b04"
      },
      {
        "type": "equation",
        "tex": "F(x)=x^2,\\qquad x=\\sqrt{u}",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "F",
            "누적 확률"
          ],
          [
            "u",
            "0~1 균일 난수"
          ]
        ],
        "id": "reading-a-04-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "역함수를 계산하기 어려운 분포도 있습니다. 구간별 상수나 선형 근사에서는 CDF 표·구간 선택·국소 역변환을 조합합니다. 확률 합과 경계값 처리도 확인하세요.",
        "tone": "warning",
        "id": "reading-a-04-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-a-04-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Sampling 1D Functions’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-a-04-b08"
      },
      {
        "type": "quiz",
        "question": "CDF가 x²일 때 u=0.81을 역변환한 값은?",
        "options": [
          "0.9",
          "0.81",
          "0.6561"
        ],
        "answer": 0,
        "feedback": "x=√u이므로 √0.81=0.9입니다.",
        "id": "reading-a-04-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 A.4 · Sampling 1D Functions",
        "url": "https://pbr-book.org/4ed/Sampling_Algorithms/Sampling_1D_Functions",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-a-05",
    "chapter": "A",
    "chapterTitle": "부록 A · 샘플링 도구",
    "title": "원의 반지름을 균일하게 뽑으면 면적은 균일하지 않습니다",
    "deck": "A.5 읽기 길잡이 · 다차원 샘플링",
    "kind": "guide",
    "sourceSection": "A.5",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 면적에 균일한 단위 원판 표본이 반지름 0.5 안에 있을 확률은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-05",
      "math-06"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-a-05-b01"
      },
      {
        "type": "paragraph",
        "text": "2차원 원판에서 점을 고르려면 반지름과 각도를 생각할 수 있습니다. 그런데 바깥쪽 고리는 안쪽 고리보다 면적이 큽니다. 반지름만 균일하게 고르면 중심 부근의 단위 면적에 점이 더 많이 모입니다. 좌표를 바꿀 때 면적이 어떻게 늘어나는지 반영해야 합니다.",
        "id": "reading-a-05-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-a-05-b03"
      },
      {
        "type": "paragraph",
        "text": "반지름 1인 원의 안쪽 반지름 0.5 영역은 면적의 0.5²=1/4입니다. 면적이 균일한 표본이라면 25%만 이 안에 있어야 합니다. 반지름을 0~1에서 균일하게 뽑으면 50%가 안쪽에 들어가 과도하게 밀집합니다. u가 균일할 때 r=√u를 사용하면 이 문제를 보정할 수 있습니다.",
        "id": "reading-a-05-b04"
      },
      {
        "type": "equation",
        "tex": "r=\\sqrt{u},\\qquad \\phi=2\\pi v",
        "explanation": "이 수업의 작은 예제를 계산하는 식입니다. 원문의 식 번호를 재사용하지 않습니다.",
        "terms": [
          [
            "u, v",
            "독립적인 0~1 균일 난수"
          ],
          [
            "r, φ",
            "반지름과 각도"
          ]
        ],
        "id": "reading-a-05-b05"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "이것은 원판 면적 샘플링 예제입니다. 구면 표면, 반구 방향, 코사인 가중 방향 샘플링은 서로 다른 분포입니다.",
        "tone": "warning",
        "id": "reading-a-05-b06"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-a-05-b07"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Sampling Multidimensional Functions’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-a-05-b08"
      },
      {
        "type": "quiz",
        "question": "면적에 균일한 단위 원판 표본이 반지름 0.5 안에 있을 확률은?",
        "options": [
          "1/2",
          "1/4",
          "1"
        ],
        "answer": 1,
        "feedback": "면적 비율이 반지름 비율의 제곱이므로 1/4입니다.",
        "id": "reading-a-05-b09"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 A.5 · Sampling Multidimensional Functions",
        "url": "https://pbr-book.org/4ed/Sampling_Algorithms/Sampling_Multidimensional_Functions",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-b-01",
    "chapter": "B",
    "chapterTitle": "부록 B · 구현 도구",
    "title": "시작과 끝도 프로그램의 기능입니다",
    "deck": "B.1 읽기 길잡이 · 시작·정리·옵션",
    "kind": "guide",
    "sourceSection": "B.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 잘못된 실행 옵션을 받았을 때 바람직한 동작은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-b-01-b01"
      },
      {
        "type": "paragraph",
        "text": "좋은 프로그램은 계산 본문뿐 아니라 설정을 읽고 자원을 준비하는 단계, 오류가 나도 자원을 정리하는 단계가 필요합니다. 명령행 옵션은 실행 조건을 외부에서 정하는 입력입니다. 기본값과 유효 범위를 명확히 하면 같은 결과를 다시 만들기 쉽습니다.",
        "id": "reading-b-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-b-01-b03"
      },
      {
        "type": "paragraph",
        "text": "자작 렌더러에 samples=64라는 기본값이 있다고 합시다. 사용자가 samples=0이나 “많이”라는 문자열을 넘기면 어떻게 할지 정해야 합니다. 값을 조용히 바꾸는 대신 유효한 양의 정수인지 검사하고 잘못된 값은 원인을 알려주는 오류로 처리할 수 있습니다.",
        "id": "reading-b-01-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "이 수업의 옵션 이름은 학습용입니다. 실제 PBRT 명령행 옵션을 그대로 재현한 것이 아닙니다. 파일 핸들·메모리·스레드 같은 자원의 수명도 함께 관리하세요.",
        "tone": "warning",
        "id": "reading-b-01-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-b-01-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘System Startup, Cleanup, and Options’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-b-01-b07"
      },
      {
        "type": "quiz",
        "question": "잘못된 실행 옵션을 받았을 때 바람직한 동작은?",
        "options": [
          "오류를 무시하고 계속 쓴다",
          "원인을 알려주고 안전하게 중단하거나 명시된 규칙으로 처리한다",
          "의미를 숨긴 채 아무 값으로 바꾼다"
        ],
        "answer": 1,
        "feedback": "설정 해석과 오류 처리를 예측 가능하게 만들어야 재현과 디버깅이 가능합니다.",
        "id": "reading-b-01-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 B.1 · System Startup, Cleanup, and Options",
        "url": "https://pbr-book.org/4ed/Utilities/System_Startup,_Cleanup,_and_Options",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-b-02",
    "chapter": "B",
    "chapterTitle": "부록 B · 구현 도구",
    "title": "컴퓨터의 소수는 종이에 쓴 실수와 다릅니다",
    "deck": "B.2 읽기 길잡이 · 수학 기반 도구",
    "kind": "guide",
    "sourceSection": "B.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 근삿값 0.333을 세 번 더한 값이 1과 다른 이유는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-b-02-b01"
      },
      {
        "type": "paragraph",
        "text": "부동소수점은 유한한 비트로 많은 크기의 수를 표현하는 방법입니다. 모든 실수를 정확히 저장할 수 없으므로 계산 순서나 상쇄가 결과에 영향을 줄 수 있습니다. 기본 수학 함수를 공통 도구로 모으는 이유는 이런 세부 처리를 매 알고리즘에서 제각각 반복하지 않기 위해서입니다.",
        "id": "reading-b-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-b-02-b03"
      },
      {
        "type": "paragraph",
        "text": "10진수에서 1/3을 소수 세 자리까지만 저장하면 0.333입니다. 세 번 더하면 0.999이지 정확한 1이 아닙니다. 실제 컴퓨터는 보통 2진수를 쓰지만, 유한 자릿수로 근사한다는 핵심을 이 작은 예제로 이해할 수 있습니다.",
        "id": "reading-b-02-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "정확히 같은지 비교하는 것이 항상 틀린 것은 아닙니다. 정수나 특별한 규약에서는 필요합니다. 허용오차를 쓸 때도 절대·상대 크기와 문제의 단위를 고려해야 합니다.",
        "tone": "warning",
        "id": "reading-b-02-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-b-02-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Mathematical Infrastructure’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-b-02-b07"
      },
      {
        "type": "quiz",
        "question": "근삿값 0.333을 세 번 더한 값이 1과 다른 이유는?",
        "options": [
          "유한 자릿수 표현의 오차",
          "덧셈을 할 수 없어서",
          "모든 실수가 정수여서"
        ],
        "answer": 0,
        "feedback": "표현 단계에서 이미 정확한 1/3과 차이가 났습니다. 수치 알고리즘은 이 차이를 다룹니다.",
        "id": "reading-b-02-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 B.2 · Mathematical Infrastructure",
        "url": "https://pbr-book.org/4ed/Utilities/Mathematical_Infrastructure",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-b-03",
    "chapter": "B",
    "chapterTitle": "부록 B · 구현 도구",
    "title": "진행률이 100%라는 말의 기준을 정합니다",
    "deck": "B.3 읽기 길잡이 · 사용자 상호작용",
    "kind": "guide",
    "sourceSection": "B.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 타일 개수 90% 완료가 의미하는 것은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-b-03-b01"
      },
      {
        "type": "paragraph",
        "text": "사용자는 프로그램 내부를 볼 수 없으므로 진행률과 오류 메시지에 의존합니다. 준비·계산·저장 단계 중 무엇을 측정하는지 명확해야 합니다. 작업 개수와 남은 실행 시간은 항상 비례하지 않습니다.",
        "id": "reading-b-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-b-03-b03"
      },
      {
        "type": "paragraph",
        "text": "타일 열 개 중 아홉 개가 끝났더라도 마지막 타일에 복잡한 유리와 안개가 몰려 있으면 시간이 많이 남을 수 있습니다. 타일 개수 기준으로 90%라고 말할 수는 있지만 남은 시간이 전체의 10%라고 확언할 수는 없습니다. 예상과 완료를 구분하는 메시지가 필요합니다.",
        "id": "reading-b-03-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "진행률 수집 자체가 작업을 크게 느리게 하지 않도록 갱신 빈도를 정합니다. 취소·오류·완료를 같은 상태로 표시하지 마세요.",
        "tone": "warning",
        "id": "reading-b-03-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-b-03-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘User Interaction’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-b-03-b07"
      },
      {
        "type": "quiz",
        "question": "타일 개수 90% 완료가 의미하는 것은?",
        "options": [
          "계산은 무조건 다 끝남",
          "시간도 반드시 90% 완료",
          "정의한 타일 수 기준으로 90% 처리"
        ],
        "answer": 2,
        "feedback": "측정한 것은 개수입니다. 각 타일의 비용이 다르면 시간 비율은 달라집니다.",
        "id": "reading-b-03-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 B.3 · User Interaction",
        "url": "https://pbr-book.org/4ed/Utilities/User_Interaction",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-b-04",
    "chapter": "B",
    "chapterTitle": "부록 B · 구현 도구",
    "title": "메모리를 빌리는 사람과 돌려주는 사람을 정합니다",
    "deck": "B.4 읽기 길잡이 · 컨테이너와 메모리",
    "kind": "guide",
    "sourceSection": "B.4",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 주소를 저장해 두었다는 사실만으로 데이터의 수명이 보장되나요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-b-04-b01"
      },
      {
        "type": "paragraph",
        "text": "배열·컨테이너는 값을 담는 방법이고, 메모리 관리는 그 저장 공간을 언제 확보하고 해제할지 정하는 일입니다. 값의 주소를 보관한 뒤 원래 공간이 사라지면 잘못된 주소를 읽게 됩니다. 소유권과 수명을 이해하는 것이 포인터 문법 암기보다 먼저입니다.",
        "id": "reading-b-04-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-b-04-b03"
      },
      {
        "type": "paragraph",
        "text": "함수 안에서 임시 배열을 만들고 그 주소만 함수 밖에 돌려주었다고 합시다. 함수가 끝나 임시 공간의 수명이 끝났다면 주소라는 숫자는 남아 있어도 유효한 데이터라는 보장은 없습니다. 메모리 풀을 한꺼번에 초기화할 때도 그 공간을 참조하는 객체가 남아 있는지 확인합니다.",
        "id": "reading-b-04-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "메모리 풀이 모든 경우에 빠르거나 안전한 것은 아닙니다. 개별 객체의 소멸 처리가 필요한지, 정렬, 동시 접근, 실제 사용량을 함께 고려하세요.",
        "tone": "warning",
        "id": "reading-b-04-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-b-04-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Containers and Memory Management’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-b-04-b07"
      },
      {
        "type": "quiz",
        "question": "주소를 저장해 두었다는 사실만으로 데이터의 수명이 보장되나요?",
        "options": [
          "아니요, 소유권과 저장 공간의 수명을 확인해야 한다",
          "네, 주소는 영구적이다",
          "네, 변수 이름이 같으면 된다"
        ],
        "answer": 0,
        "feedback": "주소와 그 주소가 가리키는 유효한 객체의 존재는 별개입니다.",
        "id": "reading-b-04-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 B.4 · Containers and Memory Management",
        "url": "https://pbr-book.org/4ed/Utilities/Containers_and_Memory_Management",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-b-05",
    "chapter": "B",
    "chapterTitle": "부록 B · 구현 도구",
    "title": "이미지에는 색뿐 아니라 채널의 의미가 있습니다",
    "deck": "B.5 읽기 길잡이 · 이미지",
    "kind": "guide",
    "sourceSection": "B.5",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 위 원시 이미지 배열의 저장량은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-b-05-b01"
      },
      {
        "type": "paragraph",
        "text": "이미지를 픽셀들의 격자로 생각할 수 있지만, 각 채널이 RGB인지 깊이인지 법선인지에 따라 처리 방법이 달라집니다. 수치의 범위, 인코딩, 해상도, 데이터 정밀도를 알아야 저장과 필터링이 올바릅니다. 밝기가 1보다 큰 값도 표현해야 하는 자료가 있습니다.",
        "id": "reading-b-05-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-b-05-b03"
      },
      {
        "type": "paragraph",
        "text": "가로 800, 세로 600, RGB 세 채널, 채널당 4바이트인 가상의 압축 없는 배열은 800×600×3×4=5,760,000바이트가 필요합니다. 약 5.76MB(10진 단위)입니다. 파일 헤더, 행 정렬, 밉맵, 압축은 제외한 원시 저장량 계산입니다.",
        "id": "reading-b-05-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "8비트 출력에 맞추기 위한 인코딩과 물리적 선형 계산을 구분하세요. 깊이·법선 지도에 색상용 변환을 무턱대고 적용하면 의미가 망가집니다.",
        "tone": "warning",
        "id": "reading-b-05-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-b-05-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Images’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-b-05-b07"
      },
      {
        "type": "quiz",
        "question": "위 원시 이미지 배열의 저장량은?",
        "options": [
          "1,440바이트",
          "5,760,000바이트",
          "480,000바이트"
        ],
        "answer": 1,
        "feedback": "가로×세로×채널 수×채널당 바이트를 곱합니다.",
        "id": "reading-b-05-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 B.5 · Images",
        "url": "https://pbr-book.org/4ed/Utilities/Images",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-b-06",
    "chapter": "B",
    "chapterTitle": "부록 B · 구현 도구",
    "title": "동시에 더하면 합이 틀릴 수도 있습니다",
    "deck": "B.6 읽기 길잡이 · 병렬 처리",
    "kind": "guide",
    "sourceSection": "B.6",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 두 작업이 같은 카운터를 보호 없이 증가시키면?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-b-06-b01"
      },
      {
        "type": "paragraph",
        "text": "여러 작업이 서로 다른 데이터만 처리하면 병렬화가 비교적 쉽습니다. 하지만 같은 변수에 동시에 읽기·수정·쓰기를 하면 결과가 덮어써질 수 있습니다. 경쟁 상태는 단순히 실행 순서가 달라지는 것을 넘어 결과의 정확성을 바꿀 수 있습니다.",
        "id": "reading-b-06-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-b-06-b03"
      },
      {
        "type": "paragraph",
        "text": "공유 카운터가 0일 때 두 작업이 동시에 0을 읽고 각각 1을 계산한 뒤 저장하면 최종값이 1로 남을 수 있습니다. 기대했던 2가 아닙니다. 작업별 카운터를 따로 두고 마지막에 합치거나 적절한 동기화 연산을 사용하는 방법을 생각할 수 있습니다.",
        "id": "reading-b-06-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "원자적 덧셈은 특정 공유 연산을 보호하지만 모든 병렬 오류를 해결하지 않습니다. 부동소수점 합은 덧셈 순서에 따라 작은 차이가 나므로 재현성 요구도 따로 정해야 합니다.",
        "tone": "warning",
        "id": "reading-b-06-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-b-06-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Parallelism’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-b-06-b07"
      },
      {
        "type": "quiz",
        "question": "두 작업이 같은 카운터를 보호 없이 증가시키면?",
        "options": [
          "동시에 실행 자체가 불가능하다",
          "언제나 정확히 2가 된다",
          "업데이트가 유실될 수 있다"
        ],
        "answer": 2,
        "feedback": "읽기·수정·쓰기가 하나의 안전한 연산으로 보장되지 않으면 서로 덮어쓸 수 있습니다.",
        "id": "reading-b-06-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 B.6 · Parallelism",
        "url": "https://pbr-book.org/4ed/Utilities/Parallelism",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-b-07",
    "chapter": "B",
    "chapterTitle": "부록 B · 구현 도구",
    "title": "측정하지 않은 최적화는 추측입니다",
    "deck": "B.7 읽기 길잡이 · 통계",
    "kind": "guide",
    "sourceSection": "B.7",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 10초에서 8초로 줄었을 때 시간 감소율은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-01",
      "math-07"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-b-07-b01"
      },
      {
        "type": "paragraph",
        "text": "느린 원인을 찾으려면 무엇을 몇 번 했고 어디에 시간이 쓰였는지 측정합니다. 교차 검사 수, 메모리 사용량, 단계별 시간은 서로 다른 정보를 줍니다. 숫자를 수집하기 전에 단위와 집계 범위를 정의해야 비교가 가능합니다.",
        "id": "reading-b-07-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-b-07-b03"
      },
      {
        "type": "paragraph",
        "text": "변경 전 실행 시간이 10초, 변경 후가 8초인 같은 조건의 예에서는 속도 향상 비율은 10/8=1.25배입니다. 시간 감소율은 (10−8)/10=20%입니다. “25% 빨라짐”과 “시간 25% 감소”를 같은 계산으로 사용하지 마세요.",
        "id": "reading-b-07-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "계측에도 비용이 있고 실행별 변동이 있습니다. 한 번의 측정 대신 반복값을 보고, 해상도·표본 수·장면·하드웨어 조건을 맞춥니다.",
        "tone": "warning",
        "id": "reading-b-07-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-b-07-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Statistics’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-b-07-b07"
      },
      {
        "type": "quiz",
        "question": "10초에서 8초로 줄었을 때 시간 감소율은?",
        "options": [
          "25%",
          "80%",
          "20%"
        ],
        "answer": 2,
        "feedback": "원래 10초 중 2초가 줄었으므로 2/10=20%입니다.",
        "id": "reading-b-07-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 B.7 · Statistics",
        "url": "https://pbr-book.org/4ed/Utilities/Statistics",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-c-01",
    "chapter": "C",
    "chapterTitle": "부록 C · 장면 읽기",
    "title": "글자를 나누는 단계와 문법을 읽는 단계는 다릅니다",
    "deck": "C.1 읽기 길잡이 · 토큰화와 파싱",
    "kind": "guide",
    "sourceSection": "C.1",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 토큰화가 성공하면 문법도 반드시 올바른가요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-c-01-b01"
      },
      {
        "type": "paragraph",
        "text": "장면 파일의 텍스트를 처리할 때 먼저 의미 있는 조각으로 나누고, 그 조각의 순서가 문법에 맞는지 해석합니다. 전자는 토큰화, 후자는 파싱입니다. 숫자나 따옴표 문자열을 어떻게 읽을지 정해야 장면을 안정적으로 만들 수 있습니다.",
        "id": "reading-c-01-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-c-01-b03"
      },
      {
        "type": "paragraph",
        "text": "독립 예제 문장 sphere radius=2를 생각합시다. 토큰화 결과를 [sphere, radius, =, 2]로 만들 수 있습니다. 파서는 이것이 구를 만들고 반지름에 2를 지정하는 구문인지 판단합니다. sphere = radius 2처럼 순서가 달라져도 토큰 목록은 만들 수 있지만 문법적으로 맞는 것은 아닙니다.",
        "id": "reading-c-01-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "이 예제는 실제 PBRT 장면 문법이 아닙니다. 사용자 입력을 코드로 eval하지 않고 정의한 문법으로 해석하는 방식입니다. 오류의 파일·줄·열 위치를 보존하면 고치기 쉽습니다.",
        "tone": "warning",
        "id": "reading-c-01-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-c-01-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Tokenizing and Parsing’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-c-01-b07"
      },
      {
        "type": "quiz",
        "question": "토큰화가 성공하면 문법도 반드시 올바른가요?",
        "options": [
          "네, 언제나 그렇다",
          "숫자가 있으면 파싱은 불필요하다",
          "아니요, 파싱에서 구조를 따로 확인한다"
        ],
        "answer": 2,
        "feedback": "단어 조각을 읽는 것과 올바른 구조를 확인하는 것은 서로 다른 단계입니다.",
        "id": "reading-c-01-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 C.1 · Tokenizing and Parsing",
        "url": "https://pbr-book.org/4ed/Processing_the_Scene_Description/Tokenizing_and_Parsing",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-c-02",
    "chapter": "C",
    "chapterTitle": "부록 C · 장면 읽기",
    "title": "설정의 적용 범위를 명확하게 나눕니다",
    "deck": "C.2 읽기 길잡이 · 장면 정보 관리",
    "kind": "guide",
    "sourceSection": "C.2",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 지역 설정 뒤 상태 복원을 잊으면 어떤 문제가 생길 수 있나요?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-c-02-b01"
      },
      {
        "type": "paragraph",
        "text": "장면 설명에는 현재 변환, 재질, 이름 있는 객체처럼 이후 명령에 영향을 주는 상태가 있습니다. 특정 구간에서만 설정을 바꾸고 구간을 벗어나면 이전 상태로 돌아오는 규칙이 필요할 수 있습니다. 스택은 이런 저장과 복원의 순서를 표현하는 데 도움이 됩니다.",
        "id": "reading-c-02-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-c-02-b03"
      },
      {
        "type": "paragraph",
        "text": "현재 재질이 흰색인 상태를 저장한 뒤 작은 구간에서 빨강으로 바꾸고 구를 하나 만듭니다. 구간이 끝나 상태를 복원한 다음 만드는 다른 물체는 다시 흰색을 사용하게 할 수 있습니다. 복원을 빼먹으면 이후 물체까지 의도치 않게 빨강이 됩니다.",
        "id": "reading-c-02-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "어떤 상태가 저장·복원되는지는 파일 형식의 명세에 따릅니다. 이름 참조와 정의 순서, 중첩 구간, 오류 발생 시 복원도 확인하세요.",
        "tone": "warning",
        "id": "reading-c-02-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-c-02-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Managing the Scene Description’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-c-02-b07"
      },
      {
        "type": "quiz",
        "question": "지역 설정 뒤 상태 복원을 잊으면 어떤 문제가 생길 수 있나요?",
        "options": [
          "파일이 자동으로 정렬된다",
          "메모리가 무조건 0이 된다",
          "이후 객체에 설정이 새어 나간다"
        ],
        "answer": 2,
        "feedback": "적용 범위를 넘어 상태가 유지되면 의도하지 않은 재질이나 변환이 적용됩니다.",
        "id": "reading-c-02-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 C.2 · Managing the Scene Description",
        "url": "https://pbr-book.org/4ed/Processing_the_Scene_Description/Managing_the_Scene_Description",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-c-03",
    "chapter": "C",
    "chapterTitle": "부록 C · 장면 읽기",
    "title": "읽은 설명과 실행에 쓸 객체는 분리할 수 있습니다",
    "deck": "C.3 읽기 길잡이 · 최종 객체 생성",
    "kind": "guide",
    "sourceSection": "C.3",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 파싱 이후에도 따로 검증해야 하는 것은?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-c-03-b01"
      },
      {
        "type": "paragraph",
        "text": "파일을 읽자마자 모든 무거운 객체를 만들기보다, 먼저 장면의 설명 자료를 모으고 참조가 맞는지 확인한 뒤 실행 객체로 바꿀 수 있습니다. 이 구분은 오류 검출과 병렬 생성, 공통 자원 재사용에 도움이 됩니다. 파싱 성공과 렌더링 준비 완료가 같은 상태는 아닙니다.",
        "id": "reading-c-03-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-c-03-b03"
      },
      {
        "type": "paragraph",
        "text": "설명 자료에 material=wood라는 이름이 있지만 wood 정의가 없는 상황을 생각합니다. 구문 자체는 올바르게 읽혀도 객체를 만들기 전에 참조 오류를 알려줘야 합니다. 이미지 경로도 문법적으로 올바른 문자열인 것과 파일이 실제로 존재하는 것은 다른 조건입니다.",
        "id": "reading-c-03-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "자원을 공유할 때 수명과 변경 가능성을 명확히 하세요. 준비 단계의 일부가 실패하면 절반만 만들어진 객체를 완료된 장면으로 노출하지 않습니다.",
        "tone": "warning",
        "id": "reading-c-03-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-c-03-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘BasicScene and Final Object Creation’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-c-03-b07"
      },
      {
        "type": "quiz",
        "question": "파싱 이후에도 따로 검증해야 하는 것은?",
        "options": [
          "공백이 몇 개인지만",
          "파일 이름이 짧은지만",
          "이름 참조와 실제 자원의 존재"
        ],
        "answer": 2,
        "feedback": "문법 구조가 맞더라도 의미·참조·자원 준비에서 오류가 날 수 있습니다.",
        "id": "reading-c-03-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 C.3 · BasicScene and Final Object Creation",
        "url": "https://pbr-book.org/4ed/Processing_the_Scene_Description/BasicScene_and_Final_Object_Creation",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  },
  {
    "id": "reading-c-04",
    "chapter": "C",
    "chapterTitle": "부록 C · 장면 읽기",
    "title": "새 기능은 이름을 등록하는 것만으로 끝나지 않습니다",
    "deck": "C.4 읽기 길잡이 · 새 객체 추가",
    "kind": "guide",
    "sourceSection": "C.4",
    "review": "editorial-check",
    "minutes": 7,
    "goals": [
      "핵심 질문에 답하기: 새 모델의 샘플링 구현을 확인하는 적절한 검사는?",
      "작은 예제의 계산과 적용 조건 구분하기"
    ],
    "prerequisites": [
      "math-06",
      "math-07",
      "math-08"
    ],
    "blocks": [
      {
        "type": "heading",
        "text": "먼저 잡을 생각",
        "id": "reading-c-04-b01"
      },
      {
        "type": "paragraph",
        "text": "새 재질이나 형상을 추가하려면 생성 경로, 인터페이스, 입력 파라미터, 평가와 샘플링의 규약을 모두 맞춰야 합니다. 화면에 객체가 나타난다는 사실만으로 구현이 정확하다고 볼 수 없습니다. 작고 예측 가능한 테스트와 기존 기능의 회귀 검사가 함께 필요합니다.",
        "id": "reading-c-04-b02"
      },
      {
        "type": "heading",
        "text": "작은 숫자로 직접 확인하기",
        "id": "reading-c-04-b03"
      },
      {
        "type": "paragraph",
        "text": "새 분포 모델을 추가했다고 합시다. 표본 100개가 화면에 보이는지뿐 아니라 확률밀도가 음수가 아닌지, 전체가 정규화되는지, 평가 함수와 샘플 함수가 같은 분포를 뜻하는지 확인합니다. 동일 입력·시드에서 변경 전후 결과도 비교할 수 있게 기록합니다.",
        "id": "reading-c-04-b04"
      },
      {
        "type": "aside",
        "title": "이 설명을 사용할 때의 조건",
        "text": "원문의 정확한 확장 지점과 소스 버전은 공식 자료에서 확인하세요. 이 앱의 책 추가도 마찬가지로 등록·자료·링크·기록 격리·검사를 함께 통과해야 합니다.",
        "tone": "warning",
        "id": "reading-c-04-b05"
      },
      {
        "type": "heading",
        "text": "원문으로 이어 읽기",
        "id": "reading-c-04-b06"
      },
      {
        "type": "paragraph",
        "text": "아래의 ‘Adding New Object Implementations’ 링크에서 실제 정의·성립 조건·구현을 확인하세요. 이 길잡이는 원문을 읽기 위한 준비 설명이며 해당 절의 문장, 전체 수식 유도, 구현 코드, 그림을 대체하지 않습니다. 읽으며 위 예제와 다른 가정이 등장하면 메모에 적어 비교해 보세요.",
        "id": "reading-c-04-b07"
      },
      {
        "type": "quiz",
        "question": "새 모델의 샘플링 구현을 확인하는 적절한 검사는?",
        "options": [
          "변수 이름을 길게 만들기",
          "화면이 예쁘면 끝",
          "확률밀도와 샘플 분포의 일치·정규화 확인"
        ],
        "answer": 2,
        "feedback": "형식적인 연결과 통계적·물리적 정확성은 별도의 검사입니다.",
        "id": "reading-c-04-b08"
      }
    ],
    "references": [
      {
        "title": "PBRT 4판 C.4 · Adding New Object Implementations",
        "url": "https://pbr-book.org/4ed/Processing_the_Scene_Description/Adding_New_Object_Implementations",
        "role": "further-reading"
      }
    ],
    "notice": "독자적인 준비 해설과 새 예제입니다. 원문 전체 번역이나 원문 구현의 완전한 설명이 아니며, 독립 전문가의 전수 검수도 완료되지 않았습니다."
  }
];
