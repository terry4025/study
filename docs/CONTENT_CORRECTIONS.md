# 기존 본문 교정 내역

대상: 2.1·4.1·5.2·7.3·8.1의 특정 문장 32건. 전체 번역 또는 5개 절 전수 검수 완료를 뜻하지 않습니다.

교정 문장은 기존 한국어 설명의 오류를 고치는 편집 문안입니다. 아래 영어 수정도 저장소의 영어 노트를 고친 것이며 원서의 정확한 인용으로 표시하지 않습니다.

## PBRT-2.1-01 · 비편향성의 조건

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

은 수학적으로 기댓값이 원래 적분값과 정확히 일치하는 비편향(Unbiased) 추정량입니다.

**교정 후**

은 표본을 실제 밀도 $p$에 따라 뽑고, 적분에 기여하는 영역을 빠뜨리지 않으며 기댓값이 존재할 때 비편향(Unbiased) 추정량입니다. 비편향이란 반복 실험의 평균이 참값과 같다는 뜻이지, 한 번의 계산이 항상 정확하다는 뜻은 아닙니다.

이유: 지지집합과 기댓값 조건을 복원하고 단일 실행의 정확도와 구별합니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-2.1-02 · 수렴률과 차원

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

전통적인 수치적분(사다리꼴 공식, 심슨 공식)은 차원이 늘어날 때마다 연산량이 기하급수적으로 폭증하는 "차원의 저주(Curse of Dimensionality, $O(N^{-1/d})$)"에 빠지지만, 몬테카를로는 차원 수와 무관하게 언제나 $O(N^{-1/2})$ 속도로 수렴합니다.

**교정 후**

규칙적인 격자로 여러 변수를 나누면 차원이 늘수록 필요한 점이 빠르게 많아집니다. 몬테카를로 적분은 독립 표본과 유한 분산을 전제로 표준오차가 $O(N^{-1/2})$로 줄어듭니다. 다만 분산과 표본 하나의 계산 비용은 문제와 차원에 따라 달라집니다. 사다리꼴·심슨 공식의 오차 차수도 방법과 함수의 매끄러움에 따라 다르므로 하나의 차수로 묶지 않습니다.

이유: 항상이라는 무조건적 수렴 보장과 서로 다른 수치적분법의 차수 혼동을 제거합니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-2.1-03 · 계산값은 근삿값

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

놀랍도록 단순한 사칙연산의 평균만으로 복잡한 우주의 빛 적분을 정확하게 풀어낼 수 있습니다.

**교정 후**

여러 표본의 계산값을 평균 내어 복잡한 빛의 적분을 근사할 수 있습니다. 표본이 유한하면 오차가 남으므로, 결과를 정확한 정답과 구별해야 합니다.

이유: 확률 추정의 성격을 설명합니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-2.1-04 · 독립성과 인과관계 구분

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

두 확률 변수 $X$와 $Y$가 서로에게 아무런 영향을 미치지 않을 때 두 변수는 **독립(Independent)**이라고 부릅니다.

**교정 후**

두 확률 변수 $X$와 $Y$는 한쪽 결과를 알아도 다른 쪽 결과의 확률 분포가 달라지지 않을 때 **독립(Independent)**이라고 부릅니다. 이는 확률에 관한 조건이며, 두 대상 사이에 물리적인 원인과 결과가 있는지를 말하는 정의는 아닙니다.

이유: 영향이라는 표현을 확률적 정보의 조건으로 한정합니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-2.1-05 · 균일 난수와 컴퓨터 정밀도

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

컴퓨터의 난수 생성기(`sampler.Get1D()`, `sampler.Get2D()`)가 뿜어내는 기본 값이 바로 이 $\xi$입니다.

**교정 후**

샘플러의 `Get1D()`는 한 성분, `Get2D()`는 두 성분의 표본을 제공합니다. 실제 컴퓨터는 유한한 정밀도의 수만 표현하므로 연속 균일 변수를 근사합니다. 표본 사이의 독립성 여부는 선택한 샘플러에 따라 다릅니다.

이유: 연속적인 이론적 변수와 유한 정밀도·다차원 표본을 구분합니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-2.1-06 · 기댓값과 유한 표본평균

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

무작위로 뽑은 코사인 값들의 평균이 0이 되는 것은 너무나 당연하고 직관적인 결과입니다.

**교정 후**

이론적인 기댓값이 0이라는 것을 확인할 수 있습니다. 유한하게 뽑은 표본의 평균은 보통 0과 조금 다릅니다. 예를 들어 표본 하나만 뽑으면 그 코사인 값이 양수나 음수일 수 있습니다.

이유: 기댓값 0을 모든 실행의 표본평균 0으로 오해하지 않도록 합니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-2.1-07 · 노이즈 감소와 제거 구분

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

표준 오차 공식이 $\sigma \propto 1/\sqrt{N}$ 이기 때문에, 분모의 오차를 $1/2$로 깎으려면 루트 안의 $N$이 **$4$배**가 되어야 합니다. 화면의 지글거리는 노이즈를 $1/10$ 수준으로 완전히 없애려면 샘플 수를 무려 **$100$배** 늘려야 합니다!

**교정 후**

독립 표본을 같은 분포에서 뽑고 분산이 유한하면 표준오차는 $1/\sqrt{N}$에 비례합니다. 표준오차를 절반으로 줄이려면 표본을 4배, 10분의 1로 줄이려면 100배 사용합니다. 이는 반복 실험의 오차 규모에 대한 관계이지, 노이즈가 완전히 사라지거나 한 장의 이미지에서 정확히 그 비율만큼 줄어든다는 보장은 아닙니다.

이유: 표준오차의 확률적 의미를 복원합니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-2.1-08 · 학습자에게 평가적 표현 제거

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

무작정 샘플만 늘리는 것은 하수(下手)다

**교정 후**

표본 수를 늘리는 방법과 표본을 효율적으로 고르는 방법

이유: 입문자의 선택을 비하하지 않고 두 접근을 설명합니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-2.1-09 · 효율성 척도의 적용 조건

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

이 수치는 샘플 수 $N$에 영향을 받지 않는 고유한 알고리즘의 우수성을 완벽히 대변합니다.

**교정 후**

표본 수에 반비례해 분산이 줄고 실행 시간이 표본 수에 비례할 때, 이 곱은 표본 수의 영향을 대략 상쇄합니다. 초기 준비 비용, 편향, 하드웨어와 문제의 차이까지 없애 주는 절대적인 점수는 아닙니다.

이유: 시간·분산의 스케일 가정을 명시합니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-2.1-10 · 영어 노트에도 분산 조건 반영

파일: `src/data/books/pbrt-4ed/content/ch02_01_monte_carlo_basics.ts`

**교정 전**

Computing the variance of F_N reveals V[F_N] = 1/N * V[f(X)/p(X)].

**교정 후**

For independent, identically distributed samples with finite variance, V[F_N] = V[f(X)/p(X)] / N.

이유: 영어 노트에서도 빠진 조건을 복원합니다. 실제 원문으로 검수한 것은 아닙니다.

검토 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration/Monte_Carlo_Basics

관련 근거: https://pbr-book.org/4ed/Monte_Carlo_Integration · https://pbr-book.org/4ed/Monte_Carlo_Integration/Improving_Efficiency

## PBRT-4.1-01 · 방사휘도 제목의 물리량 구분

파일: `src/data/books/pbrt-4ed/content/ch04_01_radiometry.ts`

**교정 전**

🎯 왜 레이 트레이싱의 주인공은 조도가 아니라 휘도(Radiance)일까?

**교정 후**

왜 광선 추적에서는 방사휘도(Radiance)를 계산할까요?

이유: 복사량 Radiance와 시각 가중량 Luminance를 구분합니다.

검토 근거: https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry

## PBRT-4.1-02 · 불변성의 공간 조건

파일: `src/data/books/pbrt-4ed/content/ch04_01_radiometry.ts`

**교정 전**

진공/공기 중 방사도 불변의 법칙 (Invariance along Rays)

**교정 후**

흡수·산란·방출이 없는 균질한 공간에서의 방사휘도

이유: 공기라는 이유만으로 항상 불변이라고 표현하지 않습니다.

검토 근거: https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry

## PBRT-4.1-03 · 방사휘도와 총 수광량

파일: `src/data/books/pbrt-4ed/content/ch04_01_radiometry.ts`

**교정 전**

빛이 장애물이나 산란 매질이 없는 자유 공간을 날아갈 때, **광선을 따라 측정되는 방사도 $L$은 거리에 관계없이 완벽히 일정(Constant)**합니다! 달빛이나 밤하늘의 별을 볼 때, 물체가 멀어진다고 해서 표면의 단위 면적당 눈에 들어오는 "표면 밝기(휘도)" 자체가 어두워지지는 않습니다(단지 물체의 겉보기 크기인 입체각이 작아져서 총 도달 에너지가 줄어들 뿐입니다).

**교정 후**

진공처럼 흡수·산란·방출이 없고 굴절률이 일정한 공간에서는 같은 광선을 따라 방사휘도 $L$이 유지됩니다. 그러나 눈이나 센서가 받는 총에너지가 일정하다는 뜻은 아닙니다. 멀리 있는 물체는 더 작은 방향 범위를 차지하므로 총 수광량이 줄어들 수 있습니다. 안개와 경계면을 지나갈 때는 해당 매질과 반사·굴절의 영향을 별도로 계산합니다.

이유: 단일 광선의 양과 유한 센서의 적분값을 구별합니다.

검토 근거: https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry

## PBRT-4.1-04 · 센서 항목 제목

파일: `src/data/books/pbrt-4ed/content/ch04_01_radiometry.ts`

**교정 전**

카메라 픽셀 센서와의 완벽한 일치

**교정 후**

센서는 여러 방향과 시간의 빛을 모아 기록합니다

이유: 정확히 비례한다는 잘못된 인상을 제거합니다.

검토 근거: https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry

## PBRT-4.1-05 · 센서 적분과 RGB

파일: `src/data/books/pbrt-4ed/content/ch04_01_radiometry.ts`

**교정 전**

카메라 센서의 각 픽셀이나 우리 망막의 시세포는 특정 면적($dA$)과 렌즈 조리개가 이루는 특정 입체각($d\omega$)을 통해 들어오는 빛을 기록합니다. 즉, 카메라 센서가 최종적으로 기록하는 이미지의 RGB 값은 센서에 맺히는 **방사도(Radiance)**에 정확히 비례합니다. 따라서 광선 추적기는 카메라로부터 광선을 쏘아 그 광선을 타고 거꾸로 들어오는 방사도를 계산하는 것입니다.

**교정 후**

한 픽셀은 한 가닥 광선의 값만 그대로 기록하지 않습니다. 렌즈를 통해 여러 방향에서 들어오는 빛을 면적·노출 시간·파장에 걸쳐 모으고 센서의 감도를 반영합니다. 적분은 여기서 작은 기여들을 모두 합하는 계산입니다. 그 뒤 색 변환과 표시 처리가 적용될 수 있으므로 최종 RGB가 특정 광선의 방사휘도에 언제나 정확히 비례한다고 말할 수 없습니다.

이유: 센서 측정 과정과 최종 표시 RGB를 분리합니다.

검토 근거: https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color/Radiometry

## PBRT-5.2-01 · 투영 중심과 렌즈 초점

파일: `src/data/books/pbrt-4ed/content/ch05_02_projective_camera.ts`

**교정 전**

원근 카메라(Perspective Camera)는 인간의 눈과 핀홀 카메라처럼 한 점(초점)으로 수렴하는 광선을 모델링하며

**교정 후**

가장 단순한 원근 카메라(Perspective Camera)는 하나의 투영 중심을 지나는 광선을 모델링하며

이유: 핀홀의 투영 중심과 렌즈의 초점을 혼동하지 않습니다.

검토 근거: https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models

## PBRT-5.2-02 · 얇은 렌즈의 근사성

파일: `src/data/books/pbrt-4ed/content/ch05_02_projective_camera.ts`

**교정 전**

**피사계 심도(Depth of Field / Bokeh)**를 완벽히 구현합니다.

**교정 후**

**피사계 심도(Depth of Field)**를 근사합니다. 실제 렌즈의 수차와 복잡한 조리개 모양까지 모두 재현하는 모델은 아닙니다. 보케는 초점 밖 흐림의 모양과 성질을 가리키며 피사계 심도와 같은 용어는 아닙니다.

이유: 근사 모델의 범위와 서로 다른 용어를 구분합니다.

검토 근거: https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models

## PBRT-5.2-03 · 래스터 표본의 실수 좌표

파일: `src/data/books/pbrt-4ed/content/ch05_02_projective_camera.ts`

**교정 전**

모니터의 정수 픽셀 격자 좌표계

**교정 후**

픽셀 단위로 위치를 나타내는 좌표계로, 픽셀 번호는 정수지만 픽셀 내부의 표본 위치는 실수로 표현할 수 있습니다

이유: 픽셀 인덱스와 표본 위치를 구분합니다.

검토 근거: https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models

## PBRT-5.2-04 · 영어 래스터 설명

파일: `src/data/books/pbrt-4ed/content/ch05_02_projective_camera.ts`

**교정 전**

3. Raster Space: discrete pixel grid coordinates.

**교정 후**

3. Raster Space: coordinates measured in pixel units; sample positions may be fractional even though pixel indices are integers.

이유: 한국어 교정과 영어 노트의 의미를 일치시킵니다.

검토 근거: https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models

## PBRT-5.2-05 · 동차 행렬과 원근 나눗셈

파일: `src/data/books/pbrt-4ed/content/ch05_02_projective_camera.ts`

**교정 전**

4x4 선형 투영 변환 행렬로 표현할 수 있는

**교정 후**

4x4 동차좌표 행렬과, 원근 투영의 경우 마지막 성분으로 나누는 연산으로 표현하는

이유: 행렬만으로 3차원 원근 나눗셈까지 선형 연산이 되는 것으로 설명하지 않습니다.

검토 근거: https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models

## PBRT-5.2-06 · 영어 동차 좌표 설명

파일: `src/data/books/pbrt-4ed/content/ch05_02_projective_camera.ts`

**교정 전**

4x4 linear projection transformation matrices

**교정 후**

4x4 homogeneous matrices followed, for perspective projection, by a division by the homogeneous coordinate

이유: 영어 노트에도 동차 좌표 해석을 명시합니다.

검토 근거: https://pbr-book.org/4ed/Cameras_and_Film/Projective_Camera_Models

## PBRT-7.3-01 · 리프 개수와 노드 상한

파일: `src/data/books/pbrt-4ed/content/ch07_03_bvh.ts`

**교정 전**

반면 BVH에서는 모든 프리미티브가 정확히 단 하나의 리프 노드에만 속하므로, $N$개의 프리미티브가 주어졌을 때 리프 노드의 개수는 정확히 $N$개, 내부 노드의 개수는 $N-1$개로 트리의 총 노드 수가 $2N-1$개로 엄격하게 상한선이 고정됩니다.

**교정 후**

여기서 다루는 물체 분할 이진 BVH에서는 각 프리미티브를 한 리프에 배정합니다. 리프가 $L$개이고 내부 노드마다 자식이 둘이면 전체 노드는 $2L-1$개입니다. 비어 있지 않은 리프에 여러 프리미티브를 담을 수 있으므로 $L$은 $N$ 이하이며, 전체 노드는 최대 $2N-1$개입니다. 예를 들어 프리미티브 4개를 두 개씩 두 리프에 넣으면 루트까지 총 3개 노드입니다.

이유: 최대값을 모든 트리의 정확한 노드 수로 오해하지 않게 합니다.

검토 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies

관련 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives

## PBRT-7.3-02 · BVH 변형과 메모리

파일: `src/data/books/pbrt-4ed/content/ch07_03_bvh.ts`

**교정 전**

각 기하 프리미티브는 트리 전체에서 오직 단 하나의 리프 노드에만 정확히 속하므로, 공간 분할 구조(Kd-트리)처럼 물체 쪼개짐(Primitive Splitting)이나 메모리 폭발 문제가 전혀 발생하지 않습니다.

**교정 후**

이 절의 물체 분할 BVH에서는 한 프리미티브를 여러 리프에 중복 배정하지 않아 노드 수의 상한을 구하기 쉽습니다. 모든 BVH 변형이 이 규칙을 따르거나, 큰 장면에서 메모리 문제가 전혀 없다는 뜻은 아닙니다.

이유: 특정 BVH 구조의 성질을 모든 구현에 일반화하지 않습니다.

검토 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies

관련 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives

## PBRT-7.3-03 · 캐시 최적화 표현

파일: `src/data/books/pbrt-4ed/content/ch07_03_bvh.ts`

**교정 전**

포인터 추적(Pointer Chasing)으로 인한 캐시 미스를 박멸하기 위해

**교정 후**

포인터 추적(Pointer Chasing)을 줄이고 캐시 지역성을 개선하기 위해

이유: 배열 배치가 캐시 미스를 없앤다고 보장하지 않습니다.

검토 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies

관련 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives

## PBRT-7.3-04 · 순회와 조기 종료

파일: `src/data/books/pbrt-4ed/content/ch07_03_bvh.ts`

**교정 전**

광선 순회(Traversal)는 함수 재귀 호출 오버헤드를 없애기 위해 64개 깊이의 로컬 스택을 사용하며, 광선의 진행 방향 부호에 따라 앞쪽 자식 노드를 먼저 방문하여 탐색을 조기 종료(Early Termination)합니다.

**교정 후**

광선 순회는 재귀 대신 배열 스택으로 다음에 방문할 노드를 기억합니다. 가까울 것으로 예상되는 자식을 먼저 검사하면, 가장 가까운 교차점을 찾을 때 거리 상한을 줄여 뒤쪽 후보를 제외할 수 있습니다. 다만 첫 교차점에서 항상 종료하지는 않습니다. 가려짐 여부만 묻는 검사는 한 번의 유효한 교차로 종료할 수 있습니다.

이유: 최단 교차점 탐색과 any-hit 검사를 구분합니다.

검토 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies

관련 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives

## PBRT-7.3-05 · 바운딩 박스 선수 절

파일: `src/data/books/pbrt-4ed/content/ch07_03_bvh.ts`

**교정 전**

6장 6.1 축정렬 바운딩 박스(AABB)와 슬랩(Slab) 교차 검사 알고리즘

**교정 후**

3장 3.7 바운딩 박스(AABB)의 정의와 6장 형상 교차 검사의 기초

이유: AABB 정의의 절 번호를 바로잡습니다.

검토 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies

관련 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives

## PBRT-7.3-06 · 최장 축 선택의 한계

파일: `src/data/books/pbrt-4ed/content/ch07_03_bvh.ts`

**교정 전**

이렇게 하면 공간이 가로세로 균형 있게 분할되어 바운딩 박스들의 중첩 면적이 최소화됩니다.

**교정 후**

이 선택은 길게 늘어진 중심점 분포를 나누는 간단한 기준입니다. 자식 상자의 겹침이 최소가 되거나 실제 순회 비용이 가장 작아진다는 보장은 없습니다.

이유: 국소적인 휴리스틱을 최적화 보장으로 표현하지 않습니다. 그림 매핑 검수는 별도입니다.

검토 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies

관련 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives

## PBRT-7.3-07 · SAH 비용 모델

파일: `src/data/books/pbrt-4ed/content/ch07_03_bvh.ts`

**교정 전**

SAH(Surface Area Heuristic, 표면적 휴리스틱)는 기하학적 확률 이론(Crofton 공식)에 기반하여 광선이 바운딩 박스를 관통할 확률이 표면적에 비례함을 이용해 최적의 분할 지점을 계산하는 비용 모델입니다.

**교정 후**

SAH(Surface Area Heuristic, 표면적 휴리스틱)는 광선 분포에 대한 단순화된 가정 아래 상자의 표면적 비율로 방문 확률을 근사하고, 후보 분할의 예상 검사 비용을 비교하는 모델입니다. 선택한 후보 중 비용이 낮은 분할을 찾는 것이며 모든 실제 광선에 대한 전역 최적해를 보장하지 않습니다.

이유: 확률 모델·후보 집합·실측 성능의 차이를 구분합니다.

검토 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Bounding_Volume_Hierarchies

관련 근거: https://pbr-book.org/4ed/Primitives_and_Intersection_Acceleration/Primitive_Interface_and_Geometric_Primitives

## PBRT-8.1-01 · 나이퀴스트 경계 조건

파일: `src/data/books/pbrt-4ed/content/ch08_01_sampling_theory.ts`

**교정 전**

나이퀴스트-섀넌(Nyquist-Shannon) 샘플링 정리에 따르면, 신호의 최고 주파수가 $f_{\max}$일 때 원본 신호를 왜곡 없이 완벽하게 복원하려면 샘플링 주파수가 최소 2배 이상($f_s \ge 2 f_{\max}$)이어야 합니다.

**교정 후**

신호가 어떤 주파수보다 높은 성분을 갖지 않는 대역 제한 신호이고 이상적인 규칙적 샘플링과 복원을 가정할 때, 샘플링 주파수를 최고 주파수의 2배보다 높게 잡으면($f_s > 2f_{\max}$) 복원이 가능합니다. 경계값에 정확히 맞추면 위상 등에 따라 정보가 사라질 수 있으므로, 초보 단계에서는 엄격한 부등식과 대역 제한 조건을 함께 기억하세요.

이유: 등호에서의 무조건적 보장을 제거하고 이론적 조건을 설명합니다.

검토 근거: https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory

## PBRT-8.1-02 · 무작위 표본과 청색 잡음

파일: `src/data/books/pbrt-4ed/content/ch08_01_sampling_theory.ts`

**교정 전**

기하학적 물체의 날카로운 경계선(실루엣)은 무한대의 고주파를 포함하므로 컴퓨터 그래픽스에서 앨리어싱은 원천적으로 피할 수 없습니다. 렌더러의 목표는 규칙적 샘플링의 불쾌한 모아레 무늬를 무작위 샘플링을 통해 눈에 덜 거슬리는 고주파 노이즈(특히 청색 잡음, Blue Noise)로 치환하는 것입니다.

**교정 후**

날카로운 경계에는 높은 주파수 성분이 있어 유한한 점 표본만으로 정확한 복원이 어렵습니다. 적절한 필터링과 표본 배치로 오차를 줄여야 합니다. 독립적인 무작위 표본은 규칙적인 무늬를 덜 드러나게 할 수 있지만 자동으로 청색 잡음이 되지는 않습니다. 청색 잡음은 낮은 주파수의 오차 성분을 억제하도록 표본 사이의 관계를 설계한 경우와 구분해 배웁니다.

이유: 독립 난수와 blue-noise 배치를 구분합니다.

검토 근거: https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory

## PBRT-8.1-03 · 입사 Radiance 용어

파일: `src/data/books/pbrt-4ed/content/ch08_01_sampling_theory.ts`

**교정 전**

실제 씬에서 필름 평면으로 들어오는 입사 휘도(Radiance)는

**교정 후**

장면에서 필름 평면으로 들어오는 입사 방사휘도(Radiance)는

이유: Radiance를 Luminance의 한국어 표현과 구분합니다.

검토 근거: https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory

## PBRT-8.1-04 · Irradiance 용어

파일: `src/data/books/pbrt-4ed/content/ch08_01_sampling_theory.ts`

**교정 전**

4장 방사측정학: 필름 평면의 조도(Irradiance)와 센서 응답

**교정 후**

4장 방사측정학: 필름 평면의 복사조도(Irradiance)와 센서 응답. 여기서 복사조도의 단위는 W/m²이며 시각 감도를 반영한 조도(lx)와 다릅니다.

이유: 복사량과 측광량의 단위 차이를 명시합니다.

검토 근거: https://pbr-book.org/4ed/Sampling_and_Reconstruction/Sampling_Theory

## 남아 있는 주요 작업

1~8장 중 이번 대상 외의 절은 변경하지 않았습니다. 대상 5개 절도 부분적인 문장 교정만 했으며, 원문에서 누락된 내용을 복원하거나 모든 그림을 바로잡지 않았습니다. 6.5절의 실제 구현 설명과 기존 어댑터의 대체 해설 사이의 누락도 남아 있습니다.

9~16장 및 부록의 완역은 포함하지 않습니다. 기존 입문 강의와 길잡이는 계속 별도 자료입니다.
