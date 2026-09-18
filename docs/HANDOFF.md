# 다음 개발 세션을 위한 인계

## 사용자 목표

기존 AI풍 UI를 완전히 버리고 새 기술서 리더로 교체. 미분·적분을 모르는 수학·컴공 입문자에게 충분히 쉬운 설명을 제공. 기존 자료를 잃지 않으며, 의역과 오개념을 구분.

## 지금 있는 것

오버레이 소스, 백업·복원 설치 스크립트, 독립 실행 HTML 미리보기, 검수 문서. GitHub 원격 변경은 없음. 기준 커밋은 `f617ca9a906b45c6d0a05fa3f5d18ffbbf90c218`.

기초 8개 + 9~16장 주제 24개 = **32개 독자 강의**. PBRT 미제공 장의 전체 번역을 대신 작성한 것이 아니며, 완역으로 바꿔 표시하지 말 것. 공식 본문 마지막은 16장, 부록 전체 코스 미포함.

기존 `src/data`, `src/types`, `public`을 보존. 새 Repository가 기존 PBRT_TOC, SECTIONS_MAP을 연결. 새 React App은 독립된 DOM 리더를 소유하는 호스트이고, useEffect 반환에서 모든 이벤트·옵저버를 정리. 새 디자인은 옛 컴포넌트를 import하지 않음. apply.py가 이전 컴포넌트 9개를 백업 후 제거.

## 먼저 할 일

실제 저장소의 최신 변경, 특히 9장 로컬 작업 존재 여부를 확인. 백업 후 오버레이 적용. 실제 저장소의 npm run build와 check-reader.mjs 실행. React StrictMode 마운트/해제, 실제 History/localStorage, 실제 기존 50노트, 이미지 경로 및 모바일 브라우저 통합을 확인. 검수 범위는 VERIFICATION.md를 읽을 것. 테스트 단언 통과를 전체 번역 완료나 모든 환경 정상 동작으로 과장하지 말 것.

## 남아 있는 콘텐츠 검수

기존 노트 전부의 원문 대조는 끝나지 않음. 알려진 문제의 일부 텍스트 교정과 안내는 repository.ts에 있음. 특히 ch06-05 표시 내용은 원문 주 구현과 다른 알고리즘을 혼동하지 않도록 짧은 독자 교정 수업으로 대체됨. 원본 파일 자체는 여전히 남음. 기존 그림·영어를 자동으로 검수 완료로 바꾸지 말 것. 올바른 원문 위치, 그림 번호, 파일, 캡션을 묶어 검수해야 함.

기초 용어 새 25개만 현재 UI에 노출, 옛 glossary.ts는 데이터로 보존. 기존 전체 사전 재노출은 용어 정확성 검수 이후 판단. 현재 연결된 책은 하나. 다른 책은 거부 화면을 내고 그 책의 이름 아래 PBRT를 표시하지 않음.

## 원문/출처

PBRT https://pbr-book.org/4ed/contents
KaTeX https://katex.org/docs/options
OpenStax https://openstax.org/details/books/calculus-volume-1
NVIDIA https://docs.nvidia.com/cuda/cuda-programming-guide/index.html

새 수업의 references는 더 읽기 링크이지 번역 대응표가 아님. 공개 번역·이미지 이용 권리는 별도 확인이 필요함.
