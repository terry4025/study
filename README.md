# 결 스터디 · 여러 책을 위한 학습 리더

컴공 입문자와 미분·적분을 아직 배우지 않은 독자를 위한 개인 학습 플랫폼입니다. 책별 목차·본문·용어·출처와 학습 기록을 독립적으로 관리합니다.

## 제공 범위 — 완료 상태를 혼동하지 않습니다

**PBRT 전권 완역 또는 전수 검수 완료본이 아닙니다.** 원서의 절을 빠짐없이 연결하는 것과 그 절의 내용을 모두 설명하는 것은 다릅니다.

| 자료 | 수량 | 상태 |
|---|---:|---|
| 보존한 PBRT 1~8장 노트 | 50개 | 기존 파일 유지, 일부 표시 교정, 상세 원문 대조 미완료 |
| 독자 기초 수업 | 8개 | 함수·미분·적분·벡터·확률·코드 읽기 등 |
| 독자 후반부 주제 강의 | 24개 | PBRT 9~16장 주제의 입문 강의, 전체 절의 번역이 아님 |
| 새 원문 읽기 안내 | 55개 | 9~16장 및 부록 A~C의 짧은 독자 개념·예제·문제 |
| 공식 목차 연결 | 105개 절 | 번호 있는 절의 링크 및 학습 자료 연결. 원문 검수는 모두 별도 관리 |

리더의 학습 항목은 총 137개입니다. 여러 형태의 자료가 같은 주제에 대응하므로 이 수를 원문 완성률로 사용하지 않습니다. 장 도입부·더 읽을거리·원서 연습문제의 번역은 제공하지 않습니다. 더 읽을거리와 연습문제는 공식 사이트에서 읽습니다.

## 서재

총 여섯 자리: PBRT(학습 자료 제공), OSTEP·CS:APP·DDIA(기존 등록 예정 도서), 아직 지정하지 않은 두 권. 예정 도서에 다른 책의 수업을 대신 보여주지 않습니다. 해당 도서의 판본과 제공 범위는 추가 시 확정합니다.

## 구조

- `src/platform/registry.ts`: 책 메타데이터와 지연 로딩 함수
- `src/platform/types.ts`: 공통 `BookPackage` 계약
- `src/platform/pbrt.ts`: PBRT 전용 자료 연결
- `src/platform/pbrt-outline.json`: 공식 원문 번호·URL·연결 수업·검수 상태
- `src/platform/pbrt-readings.json`: 독자 원문 읽기 안내 55개
- `src/reader/repository.ts`: 특정 책에 종속되지 않는 콘텐츠 조회·검색
- `src/reader/foundations.ts`: 다른 책에서도 사용할 수 있는 기초 8개
- `src/reader/legacy.ts`: 기존 PBRT 자료의 표시 어댑터
- `src/data/`: 보존한 기존 콘텐츠. 전수 교정 완료로 간주하지 않음

새 책 등록 절차는 `docs/ADDING_BOOKS.md`, 검수 기준은 `docs/CONTENT_REVIEW.md`를 참고합니다.

## 실행 및 검사

Node.js 22 환경에서:

```sh
npm ci
npm run dev
npm run build
node scripts/check-reader.mjs
node scripts/check-platform.mjs
node scripts/check-source-outline.mjs
```

마지막 검사는 인터넷으로 공식 목차를 확인합니다. 구조 검사와 수식 구문 검사는 번역의 의미·완전성·그림 캡션 정확성을 인증하지 않습니다.

실제 Chromium 통합 검사:

```sh
python3 -m pip install playwright==1.57.0
python3 -m playwright install chromium
npm run preview -- --host 127.0.0.1 --port 4173
# 별도 터미널
python3 scripts/check-browser.py
```

CI 보고서는 GitHub Actions의 `reader-validation` 아티팩트에 저장됩니다. `tested-commit.txt`에 검사한 실제 소스 SHA가 있습니다.

## 기록과 호환성

책별 저장 키는 `gyeol.reader.v2.book.<bookId>`입니다. 이전 `gyeol.reader.v2` 기록은 PBRT에만 이전하며 원래 저장값을 삭제하지 않습니다. 잘못된 저장값은 복구용 키에 보존하고, 보존에 실패하면 자동 덮어쓰기를 중단합니다.

내보낸 JSON에는 책 ID가 들어갑니다. 다른 책에서 불러오면 거부하며, 기존 책 ID 없는 v2 기록은 PBRT에서만 허용합니다. 읽음·북마크·문단 메모·정답 선택·읽기 위치는 책별로 분리합니다. 이 기록은 해당 브라우저 안에 저장되므로 중요한 기록은 파일로 내보내 보관하세요. 계정 동기화는 구현하지 않았습니다.

원문 학습 지도에서 `원문 읽음`을 체크해도 독자 강의를 읽음 처리하거나 콘텐츠를 검수 완료로 바꾸지 않습니다.

## 출처와 권리

원문: https://pbr-book.org/4ed/contents

PBRT 웹판의 저작권 안내는 CC BY-NC-ND 4.0으로 연결됩니다. 이 저장소의 기존 번역·이미지 자료에 대한 별도 허락이나 공개 배포 권한은 이번 작업에서 확인하지 않았습니다. 비상업·교육 목적 표시는 그 자체로 각색물의 공개 공유 허락이 아닙니다.

새로 추가한 자료는 독자적인 짧은 입문 설명·사고 실험·확인 문제이며 PBRT 본문·코드·그림의 완역을 제공하지 않습니다. 원문 참고 링크를 제공하는 것과 문단별 번역 대응을 보장하는 것을 구분합니다. 전체 공개 배포 전에는 기존 자료의 권리를 별도로 확인해야 합니다.
