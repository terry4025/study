# 여러 책을 추가하는 방법

## 구조

`src/reader/library.ts`는 책 등록/교체/검색 경계입니다. 앱은 PBRT 데이터 모듈에 직접 의존하지 않습니다. 책 하나는 `BookDefinition`(메타데이터·권리·선택적 원문 목차·용어)과 `Repository`(수업 제공자)를 전달합니다.

`src/reader/books/index.ts`에서 PBRT/공통 기초/준비 슬롯을 조립합니다. `src/reader/books/additions.ts`에 다음 책의 제공자를 등록하면 화면을 바꿀 필요가 없습니다. 현재 PBRT 외 슬롯은 ostep, csapp, ddia, planned-05, planned-06입니다. 앞의 세 제목과 판본은 기존 `src/data/books.ts`를 존중합니다. 뒤의 두 제목은 정해지지 않았습니다.

공통 기초 `foundations`는 여섯 권에 포함하지 않습니다. 다른 책도 `math-03` 같은 기초 수업 ID를 선수 수업으로 참조할 수 있습니다. 명시적 참조는 `foundations::math-03` 형태입니다. 다른 책의 수업에는 `다른책ID::수업ID`를 씁니다. Bare ID는 같은 책에서 우선 찾고, 다음에 공통 기초에서만 찾습니다.

## 독자 집필 자료 등록 예제

다음은 **개발자 작성 예제**이며 어떤 책의 번역 본문도 아닙니다. 실제 OSTEP 본문으로 채운 것처럼 표시하지 마세요. 충분한 콘텐츠를 작성하고 출처·권리를 확인한 뒤 상태를 available로 바꿉니다.

```ts
// src/reader/books/my-course/index.ts
import { Repository } from '../../repository';
import type { BookEntry } from '../../library';
import type { Lesson } from '../../types';

const lessons: Lesson[] = [{
  id: 'intro', chapter: '1', chapterTitle: '준비',
  title: '내가 작성한 학습 설명', deck: '독자 집필 예제',
  kind: 'original', review: 'draft', minutes: 5,
  goals: ['이 수업의 구체적인 학습 목표'], prerequisites: ['math-08'],
  blocks: [{type: 'paragraph', id: 'intro-p1', text: '검수한 독자 설명을 작성합니다.'}],
  references: [],
}];
export const myCourse: BookEntry & {slotId:string} = {
  slotId: 'planned-05',
  definition: {
    id: 'my-course', title: '내 학습 자료', subtitle: '독자 수업',
    description: '실제 제공 범위를 적습니다.', authors: ['작성자'], edition: '1',
    role: 'book', status: 'available',
    rights: {status: 'original', label: '직접 집필한 자료입니다.'},
  },
  repository: new Repository([], undefined, lessons),
};
```

`books/additions.ts`에서 `myCourse`를 import하고 `bookAdditions` 배열에 넣습니다. OSTEP를 추가할 때는 slotId와 id를 모두 `ostep`로 유지합니다. 공개된 책의 ID를 임의로 바꾸면 기록이 달라지므로 registry가 자동 이름 변경을 거부합니다. 같은 수업 ID가 서로 다른 책에 있어도 기록·검색 결과는 섞이지 않습니다.

## 학습 기록

`gyeol.library.v3`에 `{version:3, settings, activeBookId, books}`를 저장합니다. 각 책의 `completed`, `bookmarks`, `positions`, `notes`, `answers`, `quizAttempts`, `sourceRead`는 독립적입니다. 글자 크기/줄간격/테마는 공통입니다.

기존 `gyeol.reader.v2`는 읽기 전용 이관 원본으로 남깁니다. math-* 기록은 foundations로, 기존 나머지 ID는 pbrt-4ed로 옮깁니다. 이전 24개 후반 강의의 guide-* ID는 변경하지 않았습니다. 신규 길잡이는 reading-* 이름을 사용합니다.

복원은 파일 검증 → 현재 기록 백업 → 전체 대체 순서입니다. 자동 병합 기능은 아닙니다. JSON 내보내기는 모든 책의 기록을 포함합니다. 서버/계정 동기화는 없고 다른 브라우저·다른 도메인에는 자동으로 복사되지 않습니다. 여러 탭에서 동시에 수정하는 충돌 병합도 아직 지원하지 않습니다.

## 완료의 세 종류

수업 파일 존재, 편집/원문 검수, 사용자의 읽음 기록은 다른 상태입니다. PBRT manifest의 `editorial-check`는 작성자가 기본 검토했다는 표기일 뿐 독립 전문가 검수나 완역 인증이 아닙니다. `source-reviewed`는 실제 대조 완료의 증거가 있을 때만 설정합니다. 현재 PBRT 값은 0입니다. 개수를 근거로 원서가 완성됐다고 표시하지 않습니다.

## 검증

```
npm run build
node scripts/check-platform.mjs
```

두 번째 명령은 기존 50개 실제 데이터까지 로드해 타입/연결/수식/로컬 그림 경로/기록 불변식을 검사합니다. 경고는 별도 검수 대상입니다. 문장 의미와 그림 설명의 정확성은 이 검사로 보증되지 않습니다.

선택적으로 `scripts/browser-smoke.mjs`를 이용해 로컬 서버에서 **네이티브 History/LocalStorage 통합 검사**를 합니다. 설치/실행법은 파일의 첫 주석에 있습니다. Playwright 공식 문서: https://playwright.dev/docs/library / https://playwright.dev/docs/browsers
