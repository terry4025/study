import type { Lesson } from './types.js';
// Shared beginner lessons. Stable IDs preserve existing learner records.
export const foundations: Lesson[] = [
    {
        "id": "math-01",
        "chapter": "0",
        "chapterTitle": "처음부터 배우는 수학과 코드",
        "title": "수식은 숫자에 붙인 이름이다",
        "deck": "기호를 외우기 전에, 무엇을 세고 있는지부터 살펴봅니다.",
        "kind": "original",
        "minutes": 7,
        "goals": [
            "변수를 빈칸이 있는 이름표로 읽기",
            "비율과 단위를 구분하기"
        ],
        "prerequisites": [],
        "blocks": [
            {
                "type": "heading",
                "text": "커피 세 잔에서 시작하기",
                "id": "math-01-b01"
            },
            {
                "type": "paragraph",
                "text": "한 잔에 3,000원인 커피를 몇 잔 살지 아직 정하지 않았다고 해 봅시다. 잔 수에 n이라는 이름을 붙이면 전체 가격은 3000 × n입니다. n은 신비한 수학 기호가 아니라, 나중에 1이나 3 같은 숫자가 들어갈 자리입니다. n = 3을 넣으면 9,000원이 됩니다.",
                "id": "math-01-b02"
            },
            {
                "type": "paragraph",
                "text": "렌더링에서도 똑같습니다. 거리는 d, 빛의 양은 L처럼 짧은 이름을 붙입니다. 글자가 바뀌어도 먼저 물을 것은 하나입니다. “이 글자는 무엇을 나타내며, 단위는 무엇인가?” 숫자 2만으로는 2미터인지 2초인지 알 수 없습니다.",
                "id": "math-01-b03"
            },
            {
                "type": "heading",
                "text": "나눈다는 것은 한 단위당 얼마인지 묻는 것",
                "id": "math-01-b04"
            },
            {
                "type": "paragraph",
                "text": "6초 동안 물이 12리터 들어왔다면 평균 유량은 12 ÷ 6 = 2리터/초입니다. 반대로 2리터/초를 6초 동안 유지하면 12리터가 됩니다. 단위를 따라가면 초가 서로 지워지고 리터가 남습니다. 빛의 밀도에 면적을 곱해 총량을 구할 때도 같은 생각을 씁니다.",
                "id": "math-01-b05"
            },
            {
                "type": "equation",
                "tex": "\\text{양}=\\text{한 단위당 양}\\times\\text{단위의 개수}",
                "explanation": "곱셈을 단위와 함께 읽는 습관이 적분의 출발점입니다.",
                "terms": [],
                "id": "math-01-b06"
            },
            {
                "type": "paragraph",
                "text": "비율 0.4는 전체를 1로 보았을 때 40%라는 뜻입니다. 들어온 양이 80이고 그중 40%가 남으면 80 × 0.4 = 32입니다. 40을 곱하지 않는 이유는 40%가 40/100이기 때문입니다.",
                "id": "math-01-b07"
            },
            {
                "type": "aside",
                "title": "자주 만날 표기",
                "text": "x²는 x를 두 번 곱한다는 뜻입니다. x₁의 작은 1은 보통 첫 번째 값이라는 번호입니다. x²와 x₁은 전혀 다른 표기입니다. π는 원의 둘레를 지름으로 나눈 비율로, 약 3.14159입니다.",
                "tone": "note",
                "id": "math-01-b08"
            },
            {
                "type": "quiz",
                "question": "1초에 3리터씩 4초 동안 받았습니다. 모인 물은 얼마인가요?",
                "options": [
                    "0.75리터",
                    "7리터",
                    "12리터"
                ],
                "answer": 2,
                "feedback": "한 단위당 양 3리터/초에 시간 4초를 곱합니다. 3 × 4 = 12리터입니다. 단위를 붙여 보면 나누기와 곱하기 중 무엇을 해야 할지 판단하기 쉽습니다.",
                "id": "math-01-b09"
            }
        ],
        "references": [
            {
                "title": "수학 배경 자료 · OpenStax",
                "url": "https://openstax.org/details/books/calculus-volume-1",
                "role": "further-reading"
            }
        ]
    },
    {
        "id": "math-02",
        "chapter": "0",
        "chapterTitle": "처음부터 배우는 수학과 코드",
        "title": "함수는 입력을 출력으로 바꾸는 규칙",
        "deck": "f(x)를 보고 겁먹지 않도록, 값 하나씩 직접 넣어 봅니다.",
        "kind": "original",
        "minutes": 8,
        "goals": [
            "함수 표기 읽기",
            "그래프의 가로·세로축 이해하기"
        ],
        "prerequisites": [
            "math-01"
        ],
        "blocks": [
            {
                "type": "heading",
                "text": "입력과 출력이 있는 작은 기계",
                "id": "math-02-b01"
            },
            {
                "type": "paragraph",
                "text": "정사각형의 한 변 길이를 넣으면 넓이를 알려 주는 기계가 있다고 해 봅시다. 길이가 2이면 넓이는 4, 길이가 3이면 넓이는 9입니다. 이 규칙을 f(x) = x²라고 씁니다. “f 괄호 x”는 f와 x를 곱하라는 말이 아니라, 함수 f에 x를 넣은 결과입니다.",
                "id": "math-02-b02"
            },
            {
                "type": "equation",
                "tex": "f(x)=x^2,\\qquad f(2)=4,\\quad f(3)=9",
                "explanation": "이 예에서 x는 미터 단위의 길이, f(x)는 제곱미터 단위의 넓이입니다.",
                "terms": [
                    [
                        "x",
                        "입력값"
                    ],
                    [
                        "f(x)",
                        "규칙을 적용한 출력값"
                    ]
                ],
                "id": "math-02-b03"
            },
            {
                "type": "paragraph",
                "text": "그래프는 이 입력·출력 쌍을 점으로 표시한 지도입니다. 가로축에서 2를 찾고 세로축에서 4를 찾으면 점 (2, 4)가 됩니다. 그래프가 오른쪽으로 갈수록 가파르게 올라간다는 말은, 같은 만큼 입력을 늘렸을 때 출력이 점점 더 많이 변한다는 뜻입니다.",
                "id": "math-02-b04"
            },
            {
                "type": "heading",
                "text": "컴퓨터가 다루는 함수",
                "id": "math-02-b05"
            },
            {
                "type": "code",
                "title": "직접 만든 넓이 함수",
                "language": "javascript",
                "code": "function area(side) {\n  if (side < 0) throw new Error(\"길이는 0 이상이어야 합니다.\");\n  return side * side;\n}\nconsole.log(area(3)); // 9",
                "explanation": "함수 안의 return은 계산 결과를 호출한 곳으로 돌려줍니다. 이 코드는 학습용 예제로 PBRT 소스가 아닙니다.",
                "provenance": "teaching",
                "id": "math-02-b06"
            },
            {
                "type": "paragraph",
                "text": "한 함수에 입력이 여러 개 있어도 원리는 같습니다. 직사각형의 넓이는 width × height이므로 두 입력이 필요합니다. 재질 함수가 위치와 빛의 방향을 함께 받는 것도 입력이 조금 늘어난 경우라고 생각하면 됩니다.",
                "id": "math-02-b07"
            },
            {
                "type": "aside",
                "title": "정의역은 넣어도 되는 입력의 범위",
                "text": "길이에 음수를 넣지 않기로 한 것처럼, 함수마다 허용하는 입력 범위가 있습니다. 코드에서 값을 계산하기 전에 조건을 검사하는 이유입니다.",
                "tone": "note",
                "id": "math-02-b08"
            },
            {
                "type": "quiz",
                "question": "f(x) = 2x + 1일 때 f(3)은 무엇인가요?",
                "options": [
                    "6",
                    "7",
                    "9"
                ],
                "answer": 1,
                "feedback": "x 자리에 3을 넣습니다. 먼저 2 × 3 = 6, 여기에 1을 더해 7입니다. f(3)을 f × 3으로 읽지 않습니다.",
                "id": "math-02-b09"
            }
        ],
        "references": [
            {
                "title": "수학 배경 자료 · OpenStax",
                "url": "https://openstax.org/details/books/calculus-volume-1",
                "role": "further-reading"
            }
        ]
    },
    {
        "id": "math-03",
        "chapter": "0",
        "chapterTitle": "처음부터 배우는 수학과 코드",
        "title": "미분: 지금 얼마나 빠르게 변할까",
        "deck": "속도계와 작은 차이를 통해 미분을 이해합니다.",
        "kind": "original",
        "minutes": 12,
        "goals": [
            "평균 변화율 계산하기",
            "미분과 값 자체의 차이 이해하기"
        ],
        "prerequisites": [
            "math-02"
        ],
        "blocks": [
            {
                "type": "heading",
                "text": "전체 거리와 현재 속도는 다릅니다",
                "id": "math-03-b01"
            },
            {
                "type": "paragraph",
                "text": "자동차가 2초 동안 10미터 움직이면 평균 속도는 5미터/초입니다. 그런데 출발할 때 느렸다가 나중에 빨라졌다면 이 평균만으로는 지금 속도를 알 수 없습니다. 관찰 시간을 더 짧게 잡아 지금 주변의 변화를 살펴봐야 합니다.",
                "id": "math-03-b02"
            },
            {
                "type": "paragraph",
                "text": "함수에서도 출력의 변화량을 입력의 변화량으로 나눕니다. f(x) = x²에서 입력을 2에서 2.1로 바꾸면 출력은 4에서 4.41로 바뀝니다. 변화율은 (4.41 − 4) ÷ 0.1 = 4.1입니다. 2에서 2.01로 바꾸면 4.01이 됩니다.",
                "id": "math-03-b03"
            },
            {
                "type": "equation",
                "tex": "\\frac{f(x+h)-f(x)}{h}",
                "explanation": "분자는 출력이 변한 양, 분모는 입력을 바꾼 양입니다. h를 0이 아닌 작은 수로 고릅니다.",
                "terms": [
                    [
                        "h",
                        "입력을 조금 움직인 양"
                    ],
                    [
                        "f(x+h) − f(x)",
                        "그 때문에 출력이 변한 양"
                    ]
                ],
                "id": "math-03-b04"
            },
            {
                "type": "heading",
                "text": "작은 구간이 한 점에 가까워질 때",
                "id": "math-03-b05"
            },
            {
                "type": "paragraph",
                "text": "h를 0에 가깝게 줄였을 때 변화율이 어떤 값으로 다가가면, 그 값을 그 점에서의 미분계수라고 합니다. f′(x)는 그 변화율을 돌려주는 함수입니다. x²의 경우 (x+h)² − x²를 풀어 나누면 2x+h가 되고, h가 0에 가까워질 때 2x로 다가갑니다. 따라서 x = 2에서 미분계수는 4입니다.",
                "id": "math-03-b06"
            },
            {
                "type": "equation",
                "tex": "f\\prime(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}",
                "explanation": "lim은 “가까워질 때 어느 값으로 다가가는가”를 묻는 표시입니다. h = 0을 그대로 넣고 나누는 것이 아닙니다.",
                "terms": [],
                "id": "math-03-b07"
            },
            {
                "type": "lab",
                "kind": "derivative",
                "title": "실험 · 두 점의 간격을 줄여 보기",
                "id": "math-03-b08"
            },
            {
                "type": "paragraph",
                "text": "렌더링에서는 화면에서 한 픽셀 움직였을 때 텍스처 좌표가 얼마나 바뀌는지처럼, 작은 변화가 미치는 영향을 알아야 할 때 미분을 사용합니다. 지금은 공식을 암기하기보다 “입력을 살짝 바꾸면 출력이 얼마나 달라지는가?”라는 질문을 기억하세요.",
                "id": "math-03-b09"
            },
            {
                "type": "aside",
                "title": "미분이 언제나 존재하지는 않습니다",
                "text": "그래프가 뾰족하게 꺾인 지점에서는 왼쪽과 오른쪽 변화율이 다를 수 있습니다. 컴퓨터에서는 너무 작은 차이를 빼도 반올림 오차가 커질 수 있습니다. 작은 h가 무조건 더 정확하다는 뜻은 아닙니다.",
                "tone": "warning",
                "id": "math-03-b10"
            },
            {
                "type": "quiz",
                "question": "x²에서 x = 2일 때 함수값은 4이고 미분계수도 4입니다. 둘은 같은 개념인가요?",
                "options": [
                    "아니요. 하나는 출력이고 다른 하나는 변화율입니다.",
                    "네. 미분은 함수값의 다른 이름입니다.",
                    "미분계수는 언제나 함수값보다 큽니다."
                ],
                "answer": 0,
                "feedback": "이번에는 숫자만 우연히 같습니다. x = 3에서는 함수값이 9, 미분계수가 6입니다. 미분은 현재 출력이 아니라 변화하는 정도를 말합니다.",
                "id": "math-03-b11"
            }
        ],
        "references": [
            {
                "title": "수학 배경 자료 · OpenStax",
                "url": "https://openstax.org/details/books/calculus-volume-1",
                "role": "further-reading"
            }
        ]
    },
    {
        "id": "math-04",
        "chapter": "0",
        "chapterTitle": "처음부터 배우는 수학과 코드",
        "title": "적분: 작은 조각을 모아 전체 만들기",
        "deck": "넓이 공식 대신 작은 직사각형을 차곡차곡 더합니다.",
        "kind": "original",
        "minutes": 12,
        "goals": [
            "밀도와 총량 연결하기",
            "적분 기호를 합산 과정으로 읽기"
        ],
        "prerequisites": [
            "math-02"
        ],
        "blocks": [
            {
                "type": "heading",
                "text": "유량이 계속 달라진다면",
                "id": "math-04-b01"
            },
            {
                "type": "paragraph",
                "text": "수도꼭지에서 물이 매초 같은 양으로 나오면 유량 × 시간으로 총량을 구합니다. 하지만 점점 더 많이 나온다면 하나의 유량을 전체 시간에 곱할 수 없습니다. 대신 시간을 잘게 나누고, 각 구간에서는 유량이 거의 일정하다고 보고 구간별 물의 양을 더합니다.",
                "id": "math-04-b02"
            },
            {
                "type": "paragraph",
                "text": "1초를 네 구간으로 나누면 각 구간의 폭은 0.25초입니다. 각 구간의 대표 유량이 0, 1, 2, 3리터/초라면 총량의 근삿값은 (0 + 1 + 2 + 3) × 0.25 = 1.5리터입니다. 각 항은 그 구간의 높이와 폭을 곱한 직사각형 넓이에 해당합니다.",
                "id": "math-04-b03"
            },
            {
                "type": "equation",
                "tex": "\\text{총량의 근삿값}=\\sum_{i=1}^{N} f(t_i)\\,\\Delta t",
                "explanation": "Σ는 반복해서 더하라는 기호입니다. 작은 구간마다 f(tᵢ) × Δt를 계산해 모두 더합니다.",
                "terms": [
                    [
                        "N",
                        "나눈 구간의 개수"
                    ],
                    [
                        "Δt",
                        "구간 하나의 시간 폭"
                    ],
                    [
                        "tᵢ",
                        "i번째 구간에서 고른 대표 시간"
                    ]
                ],
                "id": "math-04-b04"
            },
            {
                "type": "heading",
                "text": "적분 기호를 문장처럼 읽기",
                "id": "math-04-b05"
            },
            {
                "type": "paragraph",
                "text": "구간을 충분히 잘게 나누었을 때 합이 특정 값으로 다가가면, 그 값이 정적분입니다. ∫는 길게 늘인 합산 표시처럼 생각하세요. 아래의 0과 위의 1은 어디부터 어디까지 모으는지, dt는 시간을 따라 작은 조각을 모은다는 뜻입니다.",
                "id": "math-04-b06"
            },
            {
                "type": "equation",
                "tex": "\\int_0^1 t^2\\,dt=\\frac{1}{3}",
                "explanation": "0초부터 1초까지, 유량을 t²리터/초로 정의한 예의 총량은 1/3리터입니다. 지금은 이 값을 외우지 않고 아래 실험에서 근삿값이 접근하는 모습을 관찰합니다.",
                "terms": [],
                "id": "math-04-b07"
            },
            {
                "type": "lab",
                "kind": "integral",
                "title": "실험 · 조각이 많아질수록 어떻게 달라질까",
                "id": "math-04-b08"
            },
            {
                "type": "paragraph",
                "text": "빛을 계산할 때도 한 방향에서 오는 빛만 보지 않고 여러 방향의 기여를 모읍니다. 방향이나 면적으로 합산 대상이 바뀌어도 “각 작은 조각의 기여를 더한다”는 핵심은 같습니다. 적분이 보이면 먼저 무엇을, 어느 범위에서 더하는지 찾으세요.",
                "id": "math-04-b09"
            },
            {
                "type": "aside",
                "title": "적분은 언제나 양의 넓이는 아닙니다",
                "text": "함수값이 음수면 그 부분은 음의 기여로 합산됩니다. 넓이라는 비유는 양수 함수에서 가장 직관적입니다. 또한 지금 만든 유한 개 직사각형의 합은 정확한 적분값과 일반적으로 다른 근삿값입니다.",
                "tone": "warning",
                "id": "math-04-b10"
            },
            {
                "type": "quiz",
                "question": "구간 폭이 절반이 되면 한 직사각형의 넓이는 어떻게 계산하나요?",
                "options": [
                    "높이만 더합니다.",
                    "높이에 새 구간 폭을 곱합니다.",
                    "높이를 항상 두 배로 만듭니다."
                ],
                "answer": 1,
                "feedback": "총량은 높이 × 폭입니다. 구간을 더 많이 만들 때 폭을 잊고 높이만 더하면, 샘플 수를 늘릴수록 총량이 부당하게 커집니다.",
                "id": "math-04-b11"
            }
        ],
        "references": [
            {
                "title": "수학 배경 자료 · OpenStax",
                "url": "https://openstax.org/details/books/calculus-volume-1",
                "role": "further-reading"
            }
        ]
    },
    {
        "id": "math-05",
        "chapter": "0",
        "chapterTitle": "처음부터 배우는 수학과 코드",
        "title": "벡터: 위치와 방향을 나누어 생각하기",
        "deck": "화살표, 길이, 각도가 렌더링의 언어가 됩니다.",
        "kind": "original",
        "minutes": 10,
        "goals": [
            "점과 방향 구별하기",
            "정규화와 내적의 의미 이해하기"
        ],
        "prerequisites": [
            "math-01"
        ],
        "blocks": [
            {
                "type": "heading",
                "text": "주소와 이동 지시는 다릅니다",
                "id": "math-05-b01"
            },
            {
                "type": "paragraph",
                "text": "“동쪽 3칸, 북쪽 4칸 위치에 있다”는 점의 설명입니다. “지금부터 동쪽 3칸, 북쪽 4칸 움직여라”는 이동 벡터입니다. 숫자 쌍은 같아 보여도 역할이 다릅니다. 두 점을 빼면 한 점에서 다른 점으로 가는 이동 벡터를 얻습니다.",
                "id": "math-05-b02"
            },
            {
                "type": "paragraph",
                "text": "벡터 (3, 4)의 길이는 피타고라스 정리로 √(3² + 4²) = 5입니다. 길이는 버리고 방향만 쓰려면 각 성분을 5로 나누어 (0.6, 0.8)을 만듭니다. 이렇게 길이를 1로 만드는 과정이 정규화입니다. 길이가 0인 벡터는 이 방법으로 정규화할 수 없습니다.",
                "id": "math-05-b03"
            },
            {
                "type": "equation",
                "tex": "\\hat{v}=\\frac{v}{\\lVert v\\rVert}",
                "explanation": "v 위의 작은 모자는 이 강의에서 길이가 1인 방향 벡터를 뜻합니다.",
                "terms": [
                    [
                        "∥v∥",
                        "벡터의 길이"
                    ],
                    [
                        "v̂",
                        "같은 방향의 단위 벡터"
                    ]
                ],
                "id": "math-05-b04"
            },
            {
                "type": "heading",
                "text": "서로 얼마나 같은 방향을 볼까",
                "id": "math-05-b05"
            },
            {
                "type": "paragraph",
                "text": "내적은 같은 위치의 성분을 곱해서 더한 수입니다. (1, 0)과 (0.6, 0.8)의 내적은 1 × 0.6 + 0 × 0.8 = 0.6입니다. 두 벡터가 단위 벡터일 때 내적은 사이 각도의 코사인과 같습니다. 같은 방향이면 1, 직각이면 0, 정반대이면 −1입니다.",
                "id": "math-05-b06"
            },
            {
                "type": "equation",
                "tex": "\\hat{a}\\cdot\\hat{b}=\\cos\\theta",
                "explanation": "코사인은 각도를 하나의 수로 표현하는 함수입니다. 이 관계는 두 화살표의 길이가 1일 때 바로 쓸 수 있습니다.",
                "terms": [],
                "id": "math-05-b07"
            },
            {
                "type": "paragraph",
                "text": "표면 법선은 표면에 수직인 방향입니다. 책상 위에 연필을 수직으로 세우면 그 방향이 위쪽 법선의 비유가 됩니다. 광원 방향과 법선의 내적은 빛이 표면을 정면으로 비추는지, 비스듬히 스치는지를 판단할 때 쓰입니다.",
                "id": "math-05-b08"
            },
            {
                "type": "aside",
                "title": "법선과 정규화는 서로 다른 말",
                "text": "법선이라는 이름이 길이 1을 보장하지는 않습니다. 법선도 사용할 때 길이를 확인해야 합니다. 곡면의 법선은 위치에 따라 달라집니다.",
                "tone": "note",
                "id": "math-05-b09"
            },
            {
                "type": "quiz",
                "question": "두 단위 벡터의 내적이 0이면 어떤 관계인가요?",
                "options": [
                    "같은 방향",
                    "직각",
                    "정반대 방향"
                ],
                "answer": 1,
                "feedback": "단위 벡터 내적은 각도의 코사인입니다. 직각의 코사인이 0이므로, 두 화살표가 서로 수직이라는 뜻입니다.",
                "id": "math-05-b10"
            }
        ],
        "references": [
            {
                "title": "수학 배경 자료 · OpenStax",
                "url": "https://openstax.org/details/books/calculus-volume-1",
                "role": "further-reading"
            }
        ]
    },
    {
        "id": "math-06",
        "chapter": "0",
        "chapterTitle": "처음부터 배우는 수학과 코드",
        "title": "확률과 밀도: 자주 뽑는 만큼 보정하기",
        "deck": "확률밀도를 확률 그 자체와 혼동하지 않도록 합니다.",
        "kind": "original",
        "minutes": 11,
        "goals": [
            "확률과 PDF의 차이 설명하기",
            "밀도에 구간 폭을 곱하기"
        ],
        "prerequisites": [
            "math-04"
        ],
        "blocks": [
            {
                "type": "heading",
                "text": "사탕을 뽑는 경우",
                "id": "math-06-b01"
            },
            {
                "type": "paragraph",
                "text": "상자에 빨간 사탕 2개와 파란 사탕 3개가 있고 모두 같은 가능성으로 뽑힌다면, 빨간색 확률은 2/5입니다. 가능한 결과의 확률을 모두 더하면 1입니다. 이처럼 셀 수 있는 선택에서는 결과 하나에 직접 확률을 붙일 수 있습니다.",
                "id": "math-06-b02"
            },
            {
                "type": "heading",
                "text": "연속적인 자를 짚는 경우",
                "id": "math-06-b03"
            },
            {
                "type": "paragraph",
                "text": "0미터부터 0.5미터까지의 자에서 위치를 균일하게 고르면, 어떤 구간에 들어갈 확률은 그 구간의 길이에 비례합니다. 전체 길이가 0.5이므로 확률밀도는 1 ÷ 0.5 = 2입니다. 0부터 0.25까지에 들어갈 확률은 2 × 0.25 = 0.5입니다.",
                "id": "math-06-b04"
            },
            {
                "type": "equation",
                "tex": "p(x)=2\\quad(0\\le x\\le0.5),\\qquad P(0\\le X\\le0.25)=\\int_0^{0.25}2\\,dx=0.5",
                "explanation": "PDF 값 2는 200% 확률이라는 뜻이 아닙니다. 단위 길이당 확률의 밀도이며, 구간에 대해 모아야 확률이 됩니다.",
                "terms": [],
                "id": "math-06-b05"
            },
            {
                "type": "paragraph",
                "text": "이상적인 연속 분포에서 특정 점 하나의 확률은 0이어도, 폭이 있는 구간의 확률은 0이 아닐 수 있습니다. 컴퓨터 난수는 유한한 정밀도로 표현되므로 이 이상적인 수학 모델과 구현을 구분할 필요가 있습니다.",
                "id": "math-06-b06"
            },
            {
                "type": "heading",
                "text": "밝은 방향을 더 자주 고를 때",
                "id": "math-06-b07"
            },
            {
                "type": "paragraph",
                "text": "모든 방향을 같은 횟수로 살펴보면 어두운 방향에 계산을 많이 쓸 수 있습니다. 밝을 법한 방향을 더 자주 고르면 유용한 정보를 빨리 얻을 수 있지만, 그 값들을 아무 보정 없이 평균 내면 전체가 실제보다 밝아질 수 있습니다. 선택한 분포를 알고 가중치를 보정해야 하는 이유입니다.",
                "id": "math-06-b08"
            },
            {
                "type": "aside",
                "title": "기댓값은 한 번의 결과가 아닙니다",
                "text": "기댓값은 같은 확률 규칙으로 반복했을 때의 이론적 평균입니다. 동전의 앞면을 1, 뒷면을 0으로 두면 기댓값은 0.5이지만 동전 한 번에서 0.5가 나오지는 않습니다.",
                "tone": "note",
                "id": "math-06-b09"
            },
            {
                "type": "quiz",
                "question": "확률밀도 p(x)가 2인 구간의 폭이 0.1이면, 그 구간의 확률은?",
                "options": [
                    "2",
                    "0.2",
                    "20"
                ],
                "answer": 1,
                "feedback": "이 구간 안에서 밀도가 일정하다는 조건으로 2 × 0.1 = 0.2입니다. 1보다 클 수 있는 것은 밀도값이지, 한 사건의 확률이 아닙니다.",
                "id": "math-06-b10"
            }
        ],
        "references": [
            {
                "title": "수학 배경 자료 · OpenStax",
                "url": "https://openstax.org/details/books/calculus-volume-1",
                "role": "further-reading"
            }
        ]
    },
    {
        "id": "math-07",
        "chapter": "0",
        "chapterTitle": "처음부터 배우는 수학과 코드",
        "title": "평균으로 적분을 추정하는 방법",
        "deck": "몬테카를로 계산을 숫자 몇 개로 직접 해 봅니다.",
        "kind": "original",
        "minutes": 12,
        "goals": [
            "샘플 평균과 적분 연결하기",
            "표본 수와 오차의 관계 이해하기"
        ],
        "prerequisites": [
            "math-04",
            "math-06"
        ],
        "blocks": [
            {
                "type": "heading",
                "text": "모든 위치를 계산할 수 없을 때",
                "id": "math-07-b01"
            },
            {
                "type": "paragraph",
                "text": "0부터 1 사이에서 x²의 평균을 알고 싶습니다. 모든 실수를 하나씩 계산할 수는 없으므로 몇 위치를 골라 출력값을 평균 냅니다. 예를 들어 0.2와 0.8을 골랐다면 (0.04 + 0.64) ÷ 2 = 0.34입니다. 정확한 적분 1/3에 가깝지만 같지는 않습니다.",
                "id": "math-07-b02"
            },
            {
                "type": "equation",
                "tex": "\\hat{I}=\\frac{1}{N}\\sum_{i=1}^{N} f(x_i)",
                "explanation": "이번 예는 [0,1]에서 균일하게 뽑으므로 구간 길이가 1입니다. [a,b]에서 균일하게 뽑으면 평균에 b − a를 곱해야 합니다.",
                "terms": [],
                "id": "math-07-b03"
            },
            {
                "type": "paragraph",
                "text": "몬테카를로 방법은 무작위 표본을 이용해 이런 합을 추정합니다. 독립적으로 같은 분포에서 뽑고 분산이 유한하면 표준오차는 보통 1/√N에 비례합니다. 표본을 4배 모으면 표준오차는 절반이 됩니다. 한 번 실행한 오차가 정확히 절반이 된다는 보장은 아닙니다.",
                "id": "math-07-b04"
            },
            {
                "type": "lab",
                "kind": "sampling",
                "title": "실험 · 같은 난수열에서 표본을 더 모으기",
                "id": "math-07-b05"
            },
            {
                "type": "heading",
                "text": "고르는 규칙이 다르면 가중치도 달라집니다",
                "id": "math-07-b06"
            },
            {
                "type": "paragraph",
                "text": "일반적인 분포 p(x)를 이용하면 f(x)/p(x)를 평균 냅니다. 많이 뽑히는 곳의 기여는 적게, 드물게 뽑히는 곳의 기여는 크게 반영하는 셈입니다. 단, 기여가 있는 영역을 아예 뽑지 않는 분포를 고르면 빠진 값을 보정할 방법이 없습니다.",
                "id": "math-07-b07"
            },
            {
                "type": "equation",
                "tex": "\\hat{I}=\\frac1N\\sum_{i=1}^{N}\\frac{f(x_i)}{p(x_i)}",
                "explanation": "p는 실제로 표본을 뽑은 확률밀도여야 합니다. f가 0이 아닌 영역에서 p가 양수여야 한다는 조건을 잊지 않습니다.",
                "terms": [],
                "id": "math-07-b08"
            },
            {
                "type": "aside",
                "title": "왜 밝기가 아니라 노이즈가 줄어들까",
                "text": "올바른 추정량에서는 표본 수를 늘릴 때 이론적 평균 밝기를 바꾸는 것이 아니라 결과의 흔들림을 줄입니다. 더 많은 표본을 썼는데 계속 두 배씩 밝아진다면 평균의 분모나 가중치를 먼저 확인하세요.",
                "tone": "note",
                "id": "math-07-b09"
            },
            {
                "type": "quiz",
                "question": "다른 조건이 같을 때 표준오차를 대략 절반으로 만들려면 표본 수를 어떻게 하나요?",
                "options": [
                    "2배",
                    "4배",
                    "절반"
                ],
                "answer": 1,
                "feedback": "유한 분산의 독립 표본이라는 조건에서 표준오차는 1/√N에 비례합니다. √4 = 2이므로 표본 수를 4배로 늘립니다.",
                "id": "math-07-b10"
            }
        ],
        "references": [
            {
                "title": "수학 배경 자료 · OpenStax",
                "url": "https://openstax.org/details/books/calculus-volume-1",
                "role": "further-reading"
            }
        ]
    },
    {
        "id": "math-08",
        "chapter": "0",
        "chapterTitle": "처음부터 배우는 수학과 코드",
        "title": "코드 읽기: 값, 함수, 인터페이스",
        "deck": "C++ 코드를 보기 전에 프로그램을 읽는 기본 틀을 만듭니다.",
        "kind": "original",
        "minutes": 9,
        "goals": [
            "입력·출력·조건·반복 찾기",
            "설명용 코드와 실제 구현 구분하기"
        ],
        "prerequisites": [
            "math-02"
        ],
        "blocks": [
            {
                "type": "heading",
                "text": "코드는 순서가 있는 계산 설명입니다",
                "id": "math-08-b01"
            },
            {
                "type": "paragraph",
                "text": "변수는 값을 담는 이름표, 함수는 입력을 받아 일을 하는 규칙입니다. 배열은 여러 값을 순서대로 담는 목록입니다. if는 조건에 따라 갈림길을 고르고, for는 반복합니다. 처음 보는 렌더러에서도 이 네 가지부터 찾아보면 흐름이 덜 복잡해집니다.",
                "id": "math-08-b02"
            },
            {
                "type": "code",
                "title": "빛의 기여를 평균 내는 작은 예제",
                "language": "javascript",
                "code": "function average(values) {\n  if (values.length === 0) return 0;\n  let total = 0;\n  for (const value of values) {\n    total += value;\n  }\n  return total / values.length;\n}\nconsole.log(average([2, 4, 6])); // 4",
                "explanation": "JavaScript로 쓴 독립 학습 예제입니다. +=는 기존 값에 오른쪽 값을 더해 다시 저장하라는 뜻입니다.",
                "provenance": "teaching",
                "id": "math-08-b03"
            },
            {
                "type": "heading",
                "text": "인터페이스는 약속입니다",
                "id": "math-08-b04"
            },
            {
                "type": "paragraph",
                "text": "재질마다 빛을 다르게 반사해도, 렌더러가 사용할 때는 “이 방향의 반사를 계산한다”, “새 방향을 뽑는다” 같은 공통 약속을 두면 편리합니다. 이 약속이 인터페이스입니다. 계산하는 쪽은 약속만 알고, 세부 구현은 재질마다 바꿀 수 있습니다.",
                "id": "math-08-b05"
            },
            {
                "type": "paragraph",
                "text": "타입은 어떤 종류의 값을 받거나 돌려주는지 나타냅니다. 소수 하나와 3차원 벡터는 역할이 다릅니다. C++의 const는 해당 사용 맥락에서 변경을 제한한다는 표시이며, &와 *는 참조나 포인터 등 값에 접근하는 방식을 나타낼 수 있습니다. 처음에는 모든 문법을 해석하려 하기보다 데이터가 어디로 이동하는지 보세요.",
                "id": "math-08-b06"
            },
            {
                "type": "heading",
                "text": "설명용 코드에는 생략이 있습니다",
                "id": "math-08-b07"
            },
            {
                "type": "paragraph",
                "text": "짧은 의사코드는 중요한 아이디어만 보이도록 오류 처리, 메모리 관리, 수치적 예외를 생략합니다. 그것을 그대로 실제 렌더러에 넣어도 안전하다는 뜻은 아닙니다. 이 코스는 독자 예제에 “학습용 코드” 표시를 붙이고, PBRT의 실제 구현은 원문 링크에서 확인하도록 구분합니다.",
                "id": "math-08-b08"
            },
            {
                "type": "aside",
                "title": "컴공 입문자의 읽기 체크",
                "text": "함수 이름만 보고 이해했다고 넘기지 마세요. 입력은 무엇인지, 결과는 무엇인지, 실패하면 어떻게 되는지, 같은 입력이면 같은 출력인지 질문하세요. 이 네 질문만으로도 많은 버그와 오해를 찾을 수 있습니다.",
                "tone": "note",
                "id": "math-08-b09"
            },
            {
                "type": "quiz",
                "question": "서로 다른 재질에 같은 함수 이름과 입출력 약속을 두는 주된 이유는 무엇인가요?",
                "options": [
                    "모든 재질을 같은 색으로 만들려고",
                    "세부 구현을 몰라도 공통 방식으로 다루려고",
                    "조건문을 절대 사용하지 않으려고"
                ],
                "answer": 1,
                "feedback": "인터페이스는 사용하는 쪽과 구현하는 쪽의 약속입니다. 내부 계산은 달라도 같은 약속으로 호출할 수 있어 코드를 나누어 이해하기 쉬워집니다.",
                "id": "math-08-b10"
            }
        ],
        "references": [
            {
                "title": "수학 배경 자료 · OpenStax",
                "url": "https://openstax.org/details/books/calculus-volume-1",
                "role": "further-reading"
            }
        ]
    }
];
