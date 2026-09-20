import type { SectionContent } from '../../../../types/book';

export const CH02_02_IMPROVING_EFFICIENCY: SectionContent = {
  "bookId": "pbrt-4ed",
  "chapterNumber": "2",
  "chapterTitleKo": "제2장 몬테카를로 적분 (Monte Carlo Integration)",
  "sectionNumber": "2.2",
  "sectionTitle": "Improving Efficiency",
  "sectionTitleKo": "2.2 샘플링 효율성 향상 기법 (Improving Efficiency)",
  "originalUrl": "https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency.html",
  "prevSection": {
    "id": "ch02-01",
    "title": "2.1 몬테카를로 적분의 기초 원리"
  },
  "nextSection": {
    "id": "ch02-03",
    "title": "2.3 역변환 방법을 이용한 확률 샘플링"
  },
  "summary": {
    "keyTakeaways": [
      "계층화 샘플링(Stratified Sampling)은 적분 영역을 여러 구획(Strata)으로 나누고 구획마다 균등하게 표본을 뽑아, 표본이 한곳에 뭉치는 현상을 방지하고 분산을 크게 낮춥니다.",
      "음수가 아닌 함수 f에 대해 정규화 가능한 정확한 밀도 p∝f를 사용하면 이상적으로 분산이 0입니다. 부호가 바뀌는 함수나 근사 PDF에는 같은 결론을 그대로 적용할 수 없습니다.",
      "MIS는 여러 표본 전략의 기여를 일관된 가중치로 합칩니다. 균형·거듭제곱 휴리스틱은 유용한 선택이지만 모든 장면에서 분산을 최소화하는 절대적인 최적값은 아닙니다.",
      "러시안 룰렛(Russian Roulette)은 빛의 기여도가 미미한 광선 경로를 확률적으로 안전하게 조기 종료시키면서도, 살아남은 광선의 가중치를 보정하여 $100\\%$ 비편향(Unbiased)을 유지하는 기법입니다."
    ],
    "prerequisites": [
      "2.1절 몬테카를로 추정량 및 분산 공식",
      "확률 밀도 함수(PDF)의 개념과 기댓값 연산"
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "textKo": "2.1절에서 보았듯이 순수한 몬테카를로 적분의 오차 수렴 속도는 $O(1/\\sqrt{N})$에 불과합니다. 노이즈를 절반으로 줄이려면 무려 4배의 연산 시간과 샘플이 필요합니다. 컴퓨터의 계산 자원은 유한하므로, 단순히 무식하게 샘플 수 $N$만 무한정 늘리는 것은 좋은 공학적 해결책이 될 수 없습니다.  \n다행히도 영리한 컴퓨터 과학자들은 샘플 수 $N$을 늘리지 않고도 **분산(Variance $V$) 자체를 극적으로 깎아내리는 분산 감소(Variance Reduction)** 기법들을 발전시켜 왔습니다. 본 절에서는 현대 렌더러의 성능을 비약적으로 끌어올린 5가지 핵심 기법을 살펴봅니다.",
      "textEn": "Because standard Monte Carlo error decreases only as O(N^{-1/2}), simply increasing the sample count N is computationally expensive. Fortunately, variance reduction techniques reduce the variance of the estimator itself, delivering dramatically cleaner images with fewer samples.",
      "id": "ch02-02-b1"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "2.2.1 계층화 샘플링 (Stratified Sampling)",
      "titleEn": "2.2.1 Stratified Sampling",
      "id": "ch02-02-b2"
    },
    {
      "type": "paragraph",
      "textKo": "순수한 독립 무작위 샘플링(Pure Random Sampling)의 가장 큰 약점은 **\"표본의 뭉침 현상(Clustering)\"**입니다. 주사위를 던지다 보면 우연히 같은 숫자가 연속해서 나오듯, 무작위로 점을 찍다 보면 어떤 구역에는 점들이 다닥다닥 뭉치고 어떤 구역은 텅 비어버리는 불균형이 발생합니다.  \n**계층화 샘플링(Stratified Sampling)**은 적분 구간 $\\Lambda$를 겹치지 않는 $n$개의 작은 하위 구획(Strata) $\\Lambda_1, \\dots, \\Lambda_n$으로 균등하게 바둑판처럼 쪼갠 뒤, **각 구획마다 정확히 $n_i$개(보통 1개)의 표본을 골고루 배치**하는 방식입니다.",
      "textEn": "A classic variance reduction technique is stratified sampling. Pure independent random sampling often suffers from sample clustering, where some areas are over-sampled and others are left empty. Stratified sampling subdivides the integration domain into n nonoverlapping strata and draws samples within each stratum.",
      "id": "ch02-02-b3"
    },
    {
      "type": "figure",
      "id": "fig:bunny-stratified-comparison",
      "number": "Figure 2.1",
      "title": "Original Figure 2.1",
      "titleKo": "원문 그림 2.1",
      "src": "/books/pbrt-4ed/reviewed-images/figure-2-1.png",
      "captionKo": "그림 2.1 · 독립 무작위 방향 표본과 층화한 방향 표본의 비교입니다. 원문 예제에서는 층화가 분산과 영상 잡음을 줄입니다. 토끼 모델 제공: Stanford Computer Graphics Laboratory.",
      "captionEn": "Figure 2.1: Variance is higher and the image noisier (a) when independent random sampling is used than (b) when a stratified distribution of sample directions is used instead. (Bunny model courtesy of the Stanford Computer Graphics Laboratory.)",
      "width": 998,
      "height": 1140,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "1차원 구간 $[0, 1)$에서 계층화 표본을 추출하는 공식은 매우 단순합니다:  \n$$X_i = \\frac{i + \\xi_i}{n} \\quad (i = 0, 1, \\dots, n - 1)$$  \n여기서 $\\xi_i \\sim U(0, 1)$는 각 구획 안에서 무작위 오프셋을 주는 균일 난수입니다.  \n수학적으로 증명하면, 계층화 추정량의 분산은 언제나 독립 무작위 추정량의 분산보다 작거나 같습니다:  \n$$V[F_{\\text{stratified}}] \\le V[F_{\\text{independent}}]$$  \n이 비교는 같은 총 표본 수와 적절한 층별 배분 등의 조건에서 성립합니다. 층 사이의 평균 차이에 따른 분산을 줄일 수 있지만 저주파 오차가 유한한 표본에서 모두 사라지는 것은 아닙니다.",
      "textEn": "In 1D, drawing a stratified sample is as simple as X_i = (i + xi_i) / n, where xi_i is a uniform random offset in [0, 1). Mathematically, the variance of the stratified estimator is strictly less than or equal to that of independent sampling, eliminating variance caused by low-frequency variation across strata.",
      "id": "ch02-02-b5"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 알고리즘 콕콕",
      "title": "비둘기집 원리와 샘플 뭉침 방지 (Clustering Prevention)",
      "summary": "왜 계층화 샘플링은 공짜 점심처럼 분산을 깎아줄까?",
      "points": [
        {
          "title": "균일성의 보장 (Space-Filling Property)",
          "content": "모든 구획에 최소 1개의 샘플이 강제로 들어가므로, 적분 영역의 그 어떤 부분도 소외되지 않고 균일하게 정보가 수집됩니다."
        },
        {
          "title": "고차원에서의 한계 (차원의 저주 재등장)",
          "content": "계층화는 2D 화면 픽셀(16개 타일 = $4 \\times 4$)에서는 마법처럼 작동하지만, 6차원 적분에서 차원당 고작 2개씩만 구획을 나눠도 $2^6 = 64$개의 샘플이 필요하고, 차원당 4개면 $4^6 = 4,096$개가 필요합니다. 따라서 고차원 렌더링에서는 8장에서 배울 **준난수(Quasi-Monte Carlo / 저불일치 수열)** 기법으로 진화하게 됩니다."
        }
      ],
      "tags": [
        "계층화 샘플링",
        "Stratified",
        "분산 감소",
        "샘플 분배"
      ],
      "id": "ch02-02-b6"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "2.2.2 중요도 샘플링 (Importance Sampling)",
      "titleEn": "2.2.2 Importance Sampling",
      "id": "ch02-02-b7"
    },
    {
      "type": "paragraph",
      "textKo": "음수가 아닌 함수 $f$의 적분 $I$가 유한하고 양수라면 이상적인 밀도는 $p(x)=f(x)/I$입니다. 이때 $f(X)/p(X)=I$이므로 모든 표본의 보정 기여가 같아 분산이 0입니다. 다만 I를 이미 알아야 정규화할 수 있다는 어려움이 있고, 실제로는 샘플링하기 쉬운 근사 분포를 사용합니다. 부호가 바뀌는 함수에는 $p\\propto|f|$가 기본적인 최적 형태지만 보통 분산 0은 아닙니다.",
      "textEn": "The former English paraphrase has been retired after editorial correction. Consult the linked PBRT source for the original wording.",
      "id": "ch02-02-b8"
    },
    {
      "type": "figure",
      "id": "fig:importance-sampling-gaussian",
      "number": "Figure 2.2",
      "title": "Original Figure 2.2",
      "titleKo": "원문 그림 2.2",
      "src": "/books/pbrt-4ed/reviewed-images/figure-2-2.png",
      "captionKo": "그림 2.2 · 대부분의 구간에서 0에 가까운 좁은 가우시안 함수를 균일하게 샘플링하면 유효한 표본이 드물어 분산이 큽니다. 함수 모양을 대략 따라가는 PDF에서 표본을 뽑으면 이 예제의 분산이 줄어듭니다.",
      "captionEn": "Figure 2.2: (a) A narrow Gaussian function that is close to zero over most of the range left-bracket 0 comma 1 right-bracket . The basic Monte Carlo estimator of Equation ( 2.6 ) has relatively high variance if it is used to integrate this function, since most samples have values that are close to zero. (b) A PDF that roughly approximates the function’s distribution. If this PDF is used to generate samples, variance is reduced substantially. (c) A representative distribution of samples generated according to (b).",
      "width": 998,
      "height": 768,
      "reviewed": true,
      "sourceUrl": "https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency.html",
      "captionKind": "reviewed-summary"
    },
    {
      "type": "paragraph",
      "textKo": "**중요도 샘플링의 주의점**:  \n중요도 샘플링은 양날의 검입니다. 만약 잘못된 PDF를 선택하여, **함수 값 $f(x)$는 매우 큰데 $p(x)$가 0에 가까운 영역**이 존재한다면, 분모가 극도로 작아져 $f(x)/p(x)$ 값이 수천~수만으로 폭증하게 됩니다. 이것이 렌더링 화면에 뜬금없이 번쩍이는 하얀 점, 즉 **파이어플라이(Fireflies)** 현상의 수학적 원인입니다. 따라서 $p(x)$는 항상 $f(x)$가 큰 곳을 절대 놓치지 않도록 너그럽고 안전하게 설계해야 합니다.",
      "textEn": "Caution with importance sampling: if a poorly chosen PDF is near zero where f(x) is large, the ratio f(x)/p(x) explodes, causing massive variance spikes. In rendering, this manifests as bright speckles known as \"fireflies\". The PDF must adequately cover all regions where the integrand is significant.",
      "id": "ch02-02-b10"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "2.2.3 다중 중요도 샘플링 (Multiple Importance Sampling, MIS)",
      "titleEn": "2.2.3 Multiple Importance Sampling",
      "id": "ch02-02-b11"
    },
    {
      "type": "paragraph",
      "textKo": "실제 렌더링에서는 적분해야 할 식이 단일 함수가 아니라 **두 개 이상의 함수가 곱해진 형태**인 경우가 대부분입니다:  \n$$I = \\int f_a(x) f_b(x) dx$$  \n가장 대표적인 예가 **[조명의 빛 방출 $L_i$] $\\times$ [표면의 반사율 BSDF $f_r$]**의 곱입니다.  \n문제는 조명도 매우 작고 날카롭고(예: 조그만 할로겐 전구), 표면도 매끄러운 거울이나 금속처럼 반사율이 특정 방향으로만 날카롭게 솟아 있을 때 발생합니다.  \n- 조명에 맞춰 샘플링($p_a$)하면 거울 반사각을 놓쳐 노이즈 폭발!  \n- 거울 반사각에 맞춰 샘플링($p_b$)하면 작은 전구를 맞추지 못해 노이즈 폭발!  \n어느 한 전략만 사용하면 이런 장면에서 분산이 커질 수 있습니다. 충분한 표본을 사용한 수렴 가능성까지 부정하는 말은 아닙니다.",
      "textEn": "In rendering, integrands are frequently the product of multiple functions: integral f_a(x) f_b(x) dx, most commonly [incident light L_i] * [surface BSDF f_r]. When both a light source (e.g., small intense lamp) and a surface BSDF (e.g., glossy metal) have sharp directional peaks, neither sampling the light alone nor the BSDF alone succeeds.",
      "id": "ch02-02-b12"
    },
    {
      "type": "paragraph",
      "textKo": "1995년 스탠퍼드 대학교의 **에릭 비치(Eric Veach)**는 이 난제를 영구적으로 해결하는 역사적 논문을 발표했습니다. 바로 **다중 중요도 샘플링(MIS, Multiple Importance Sampling)**입니다.  \n서로 다른 $n$개의 샘플링 전략 $p_1, \\dots, p_n$에서 각각 $n_i$개의 표본 $X_{i, j}$를 뽑은 뒤, 특별히 고안된 **가중치 함수 $w_i(x)$**를 곱해 가중합을 계산합니다:  \n$$F = \\sum_{i=1}^n \\frac{1}{n_i} \\sum_{j=1}^{n_i} w_i(X_{i, j}) \\frac{f(X_{i, j})}{p_i(X_{i, j})}$$  \n기댓값이 존재하고 각 실제 샘플링 PDF를 사용하며, p_i=0인 곳에서는 그 전략의 가중치를 0으로 두는 등의 조건 아래에서 요구되는 가중치 조건은 $f(x) \\ne 0$인 곳에서 가중치들의 합이 $1$이어야 한다는 것뿐입니다:  \n$$\\sum_{i=1}^n w_i(x) = 1$$",
      "textEn": "Eric Veach introduced Multiple Importance Sampling (MIS) in 1995. Samples are drawn from n different sampling distributions p_i, combined using weighting functions w_i(x) such that sum w_i(x) = 1 wherever f(x) != 0, ensuring unbiasedness while combining the strengths of all sampling strategies.",
      "id": "ch02-02-b13"
    },
    {
      "type": "paragraph",
      "textKo": "에릭 비치는 수학적으로 최적에 가까운 두 가지 가중치 휴리스틱을 증명했습니다:  \n\n1. **균형 휴리스틱 (Balance Heuristic)**:  \n$$w_i(x) = \\frac{n_i p_i(x)}{\\sum_j n_j p_j(x)}$$  \n각 샘플 전략의 확률 비율 그대로 가중치를 매기는 방식입니다. 정해진 가정에서 최적 가중치와의 분산 차이를 제한하는 결과가 있지만, 모든 상황에서 가장 작은 분산을 주는 것은 아닙니다.  \n\n2. **거듭제곱 휴리스틱 (Power Heuristic)**:  \n$$w_i(x) = \\frac{(n_i p_i(x))^\\beta}{\\sum_j (n_j p_j(x))^\\beta} \\quad (\\text{보통 } \\beta = 2)$$  \n확률 밀도에 제곱($\\beta = 2$)을 취하여, 상대적으로 확률이 낮은 열세인 샘플 전략의 기여도를 더욱 과감하게 0으로 눌러버림으로써 분산을 더욱 드라마틱하게 낮춥니다.",
      "textEn": "Veach derived the provably near-optimal Balance Heuristic: w_i(x) = n_i p_i(x) / sum n_j p_j(x). He also introduced the Power Heuristic with exponent beta (typically beta = 2): w_i(x) = (n_i p_i(x))^beta / sum (n_j p_j(x))^beta, which sharpens weights and further reduces variance in practice.",
      "id": "ch02-02-b14"
    },
    {
      "type": "code",
      "chunkName": "<<Multiple Importance Sampling Functions>>=",
      "language": "cpp",
      "code": "// 균형 휴리스틱 (Balance Heuristic): 2개 분포 결합\ninline Float BalanceHeuristic(int nf, Float fPdf, int ng, Float gPdf) {\n    return (nf * fPdf) / (nf * fPdf + ng * gPdf);\n}\n\n// 거듭제곱 휴리스틱 (Power Heuristic, beta = 2): 실무 표준\ninline Float PowerHeuristic(int nf, Float fPdf, int ng, Float gPdf) {\n    Float f = nf * fPdf, g = ng * gPdf;\n    return (f * f) / (f * f + g * g);\n}",
      "explanationKo": "pbrt에서 1초에 수천만 번 실행되는 가장 유명한 유틸리티 함수입니다. 빛 샘플링 PDF와 BSDF 샘플링 PDF를 넘겨주면, 제곱 비를 계산하여 두 전략의 장점만을 취합하는 최적의 가중치를 간단한 계산으로 반환합니다. 분모가 0인 경우와 비정상 PDF는 호출 조건에 따라 따로 다뤄야 합니다.",
      "provenance": "teaching",
      "id": "ch02-02-b15"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "2.2.4 러시안 룰렛 (Russian Roulette)",
      "titleEn": "2.2.4 Russian Roulette",
      "id": "ch02-02-b16"
    },
    {
      "type": "paragraph",
      "textKo": "광선 추적 시뮬레이션에서 광선은 물체 표면을 맞고 튕겨 나가기를 반복합니다. 만약 광선이 10번, 20번 튕겨 어두운 구석으로 들어갔다면, 그 광선이 최종 이미지에 기여할 빛의 양은 거의 $0$에 수렴합니다.  \n그렇다고 해서 특정 깊이(예: 5번)에서 광선을 일괄적으로 강제 종료해 버리면, 실내 조명이나 유리구슬 내부의 빛이 사라져 화면이 어두워지는 **편향(Bias)**이 생깁니다.  \n**러시안 룰렛(Russian Roulette)**은 계산 효율을 극대화하면서도 **수학적 비편향성(Unbiasedness)을 100% 지켜내는 놀라운 확률 기법**입니다.",
      "textEn": "In recursive path tracing, rays bounce repeatedly through the scene. Rays that have bounced many times often carry negligible radiance. Simply truncating them at a fixed depth introduces dark systematic bias. Russian roulette provides a mechanism to terminate rays probabilistically with zero bias.",
      "id": "ch02-02-b17"
    },
    {
      "type": "paragraph",
      "textKo": "러시안 룰렛의 규칙은 다음과 같습니다:  \n1. 임의의 종료 확률 $q \\in (0, 1)$를 정합니다. (계속 진행할 확률은 $1 - q$)  \n2. 주사위를 굴려 확률 $q$로 광선을 즉시 중단하고 **0을 반환**합니다.  \n3. 운 좋게 살아남은 확률 $(1 - q)$의 광선은 계속 전진시키되, 그 광선이 가져온 빛의 값에 **보정 가중치 $\\frac{1}{1 - q}$를 곱해 증폭**시킵니다!  \n\n이 새로운 추정량의 기댓값을 계산해 보면:  \n$$E[F_{\\text{rr}}] = (1 - q) \\cdot \\left( \\frac{F}{1 - q} \\right) + q \\cdot 0 = F$$  \n확률 $(1 - q)$와 분모의 $(1 - q)$가 완벽하게 약분되어, **원래 적분값 $F$가 손실 없이 100% 온전히 보존**됩니다! 죽을 확률만큼 살아남은 자에게 보상을 몰아줌으로써 전체 평균을 일정하게 유지하는 것입니다.",
      "textEn": "With termination probability q, Russian roulette terminates evaluation and returns 0. With probability (1 - q), evaluation continues, but the result is scaled by 1 / (1 - q). The expected value is E[F_rr] = (1 - q) * (F / (1 - q)) + q * 0 = F. The factor (1 - q) cancels exactly, preserving the true expected value without any bias.",
      "id": "ch02-02-b18"
    },
    {
      "type": "concept-tip",
      "badge": "💡 컴공 게임이론/최적화 콕콕",
      "title": "러시안 룰렛의 효율은 측정으로 판단합니다",
      "summary": "러시안 룰렛의 효율은 측정으로 판단합니다",
      "points": [
        {
          "title": "핵심 설명",
          "content": "기여가 작을 것으로 예상되는 경로를 종료하면 비용을 줄일 수 있지만, 살아남은 기여를 키워 보정하므로 분산은 증가할 수 있습니다. 비용 감소가 분산 증가를 상쇄하는지가 중요합니다. 고정된 5배·10배 개선을 보장하지 않으며, 매질·굴절·누적 가중치 등을 고려한 생존 확률이 필요합니다."
        }
      ],
      "tags": [
        "러시안 룰렛",
        "비편향 조기 종료",
        "효율성 최적화",
        "광선 추적 기법"
      ],
      "id": "ch02-02-b19"
    },
    {
      "type": "subheading",
      "level": 3,
      "titleKo": "2.2.5 스플리팅 (Splitting: 표본 분기)",
      "titleEn": "2.2.5 Splitting",
      "id": "ch02-02-b20"
    },
    {
      "type": "paragraph",
      "textKo": "러시안 룰렛이 불필요한 광선을 쳐내는 기법이라면, **스플리팅(Splitting)**은 반대로 분산이 너무 커서 노이즈가 심할 것으로 예상되는 중요한 지점에서 **광선을 여러 가닥으로 쪼개어(Branching) 샘플링하는 기법**입니다.  \n예를 들어 픽셀 하나를 평가할 때, 카메라 광선은 1개만 쏘더라도 표면에 부딪힌 지점에서 여러 조명들을 향해 그림자 광선(Shadow Ray)을 4개, 8개씩 분기시켜 쏘아 보내면, 비싼 카메라 광선 생성 비용을 재활용하면서도 조명 그림자 노이즈를 매우 효율적으로 잠재울 수 있습니다.",
      "textEn": "While Russian roulette reduces the number of samples, splitting increases sample count in high-variance dimensions of multidimensional integrals. For instance, a single camera ray may branch into multiple shadow rays at a surface intersection, efficiently amortizing camera ray traversal costs over multiple light evaluations.",
      "id": "ch02-02-b21"
    },
    {
      "type": "paragraph",
      "textKo": "이제 우리는 계층화, 중요도 샘플링, MIS, 러시안 룰렛, 스플리팅이라는 물리 기반 렌더링의 5대 무기를 완벽하게 손에 넣었습니다!  \n하지만 한 가지 근본적인 의문이 남습니다: **\"우리가 원하는 임의의 확률 밀도 함수 $p(x)$가 주어졌을 때, 컴퓨터는 어떻게 그 분포를 따르는 난수를 실제로 만들어낼 수 있을까?\"**  \n이어지는 2.3절에서는 컴퓨터 난수 생성의 마법인 **역변환 샘플링 방법(Sampling Using the Inversion Method)**을 배우겠습니다.",
      "textEn": "Having mastered variance reduction techniques, Section 2.3 addresses the practical challenge: given a target PDF p(x), how can a computer algorithm generate random samples that strictly follow that distribution? This is solved by the Inversion Method.",
      "id": "ch02-02-b22"
    }
  ],
  "audit": {
    "checkedSourceSha256": "e63a84cd25a08f2f79e9337536e8581a17de3e804b52a0da2eeb42eab5064d81",
    "scope": "existing-note-review",
    "status": "editorial-pass",
    "originalHeadings": [
      "2.2 Improving Efficiency",
      "2.2.1  Stratified Sampling",
      "2.2.2  Importance Sampling",
      "2.2.3  Multiple Importance Sampling",
      "MIS Compensation",
      "2.2.4  Russian Roulette",
      "2.2.5  Splitting"
    ],
    "sourceFigures": [
      "2.1",
      "2.2"
    ],
    "captionPolicy": "source-aligned reviewed summaries; English captions preserved",
    "fullTranslation": false,
    "independentExpertReview": false,
    "notice": "본문·수식·코드·그림의 1차 대조 검수를 반영했습니다. 기존 자료는 축약·의역 학습 노트이며 원문 전체 번역은 아닙니다. 그림 설명은 검수한 핵심 요약이며 원문 캡션도 함께 보존했습니다."
  }
};
