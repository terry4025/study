# 📚 컴공 지식 베이스캠프 (CS Reader)
> **물리 기반 렌더링: 이론부터 구현까지 (PBRT v4 한국어 학습판)**  
> *Physically Based Rendering: From Theory to Implementation (4th Edition) - Matt Pharr, Wenzel Jakob, and Greg Humphreys*

![PBRT v4 Korean Reader](https://img.shields.io/badge/pbrt--4ed-1~8장_완독-6366f1?style=flat-square)
![Total Sections](https://img.shields.io/badge/완성_섹션-50개-10b981?style=flat-square)
![Assets Included](https://img.shields.io/badge/공식_다이어그램_에셋-189개-f59e0b?style=flat-square)
![Glossary Items](https://img.shields.io/badge/수학·컴공_용어_치트키-79개-ec4899?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React_19_|_TypeScript_|_Tailwind_|_Vite-blue?style=flat-square)

컴퓨터 그래픽스와 렌더링 분야의 바이블인 **PBRT 제4판(4ed)**을 컴퓨터공학 및 컴퓨터 그래픽스 입문자부터 실무 연구자까지 누구나 깊이 있게 학습할 수 있도록 번역·구조화한 인터랙티브 학습 리더 플랫폼입니다.

---

## ✨ 핵심 기능 및 특징

1. **원문 누락 없는 완벽한 한글 완역 & 컴퓨터공학 친화적 해설**
   - 방대한 수식과 알고리즘을 단순 번역에 그치지 않고, 직관적인 비유와 컴퓨터 아키텍처 관점(CPU 캐시 라인, 비트 연산, SIMD, 메모리 정렬 등)의 **"💡 컴공 기초 콕콕"** 팁을 전 섹션에 수록했습니다.
2. **189개 공식 벡터 다이어그램 & 실사 비교 렌더링 에셋 통합**
   - 원서의 고해상도 SVG 벡터 다이어그램과 장면 렌더링 이미지를 각 단락과 완벽하게 매핑하고 한/영 대조 캡션 및 전체화면 줌 기능을 지원합니다.
3. **KaTeX 기반 무결점 수학 공식 렌더링**
   - 몬테카를로 적분, 구면 삼각법, 방사측정학, 푸리에 변환, 나이퀴스트-섀넌 정리, 저불일치 수열(Sobol/Halton) 등 모든 정밀 수식을 미려하게 렌더링합니다.
4. **수학 & 컴공 핵심 용어 치트키 사전 (총 79종)**
   - "미분·적분이 뭐였더라?", "표면적 휴리스틱(SAH)이 왜 필요하지?" 등 초보자 안심 3단계 해설과 일상 비유, 기호 해독을 제공하는 인터랙티브 모달 사전 탑재.
5. **학습자 맞춤형 뷰어 UI**
   - 친절 의역 모드, 한/영 대조 모드, 영문 원문 모드 3단 전환
   - 라이트 / 다크 테마 지원 및 폰트 크기 조절
   - 챕터별 점진적 진행률(Progress Bar) 및 전역 섹션 검색

---

## 📖 현재 학습 완료 챕터 현황 (1 ~ 8장 / 총 50개 섹션 완독)

| 챕터 | 국문 제목 | 영문 원제 | 섹션 수 | 수록 에셋 |
| :---: | :--- | :--- | :---: | :---: |
| **제1장** | 소개 및 시스템 개요 | Introduction | 6개 전 섹션 | 6개 |
| **제2장** | 몬테카를로 적분 | Monte Carlo Integration | 4개 전 섹션 | 12개 |
| **제3장** | 기하학과 변환 | Geometry and Transformations | 11개 전 섹션 | 24개 |
| **제4장** | 방사측정학, 스펙트럼, 색상 | Radiometry, Spectra, and Color | 6개 전 섹션 | 22개 |
| **제5장** | 가상 카메라와 필름 | Cameras and Film | 4개 전 섹션 | 18개 |
| **제6장** | 3차원 형상과 교차 검사 | Shapes | 8개 전 섹션 | 42개 |
| **제7장** | 프리미티브와 가속 구조 BVH | Primitives and Intersection Acceleration | 3개 전 섹션 | 14개 |
| **제8장** | 샘플링과 이미지 복원 | Sampling and Reconstruction | 8개 전 섹션 | 51개 |
| **합계** | **1~8장 완독 완료** | - | **50개 섹션** | **189개 에셋** |

---

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React
- **Math Engine**: KaTeX (`rehype-katex`, `remark-math`)
- **Testing & Verification**: Playwright (Headless End-to-End Visual Verification)

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 실행 (기본 포트: 5173)
npm run dev

# 3. 프로덕션 빌드 및 미리보기
npm run build
npm run preview
```

---

## 📜 저작권 및 라이선스 고지

본 프로젝트의 학습 해설 및 번역 콘텐츠는 Matt Pharr, Wenzel Jakob, Greg Humphreys 저 **"Physically Based Rendering: From Theory to Implementation" (4th Edition)**의 오픈 액세스 판본([pbr-book.org](https://pbr-book.org))을 기반으로 비상업적 학술 및 교육 연구 목적으로 제작되었습니다.
