# 새 책 추가하기

UI를 복사하거나 PBRT 조건 분기를 늘리지 않습니다. `BookPackage`를 구현하고 `registry.ts`에 등록합니다.

## 1. 안정적인 ID

책 ID는 영문 소문자·숫자·하이픈으로 정합니다. 공개 후에는 함부로 바꾸지 않습니다. 저장 키와 백업의 책 ID에 사용됩니다. 같은 수업 ID를 다른 책에서 사용할 수 있지만 한 책 안에서는 중복할 수 없습니다. 문단 ID도 공개 후 가능한 한 유지하여 기존 메모·읽기 위치가 끊어지지 않게 합니다.

## 2. 책 패키지

`src/platform/types.ts`의 `BookPackage`를 만족하는 모듈을 만듭니다. 메타데이터, 정확한 제공 범위인 `scope`, 독자 수업 `lessons`, 용어 `glossary`, 원문 지도 `outline`을 제공합니다. 기존 형식의 자료를 연결할 때만 `legacy`의 목차·로더·어댑터를 구현합니다.

```ts
import type { BookPackage } from './types';
import { foundations } from '../reader/foundations';

export const nextBook: BookPackage = {
  id: 'my-book', title: '새 책', subtitle: '확정된 판본',
  description: '실제 제공하는 학습 범위',
  coverLines: ['새로운', '배움의', '기록'],
  sourceUrl: 'https://example.com/official-book', status: 'available',
  scope: '작성·검수한 범위를 정확히 적습니다.',
  lessons: [...foundations /*, 실제 작성된 수업 */],
  glossary: [], outline: []
};
```

예시 URL과 메타데이터는 실제 공식 자료로 교체해야 합니다. 기초 수업만 넣고 해당 책 본문이 완성됐다고 표시하지 않습니다. 공유 기초 수업을 여러 책에서 사용하더라도 읽음 기록은 각 책에 독립적으로 저장됩니다. 전체 도서 간 기초 진도 자동 공유는 현재 구현하지 않았습니다.

## 3. 등록

`registry.ts`의 예정 도서 하나를 실제 책 정보로 바꾸고 `load: () => import('./my-book').then(m => m.nextBook)`를 연결합니다. 카드 ID와 로드된 패키지 ID는 같아야 합니다. 아직 콘텐츠가 없으면 `status: 'planned'`를 유지하고 로더를 등록하지 않습니다.

## 4. 원문과 검수 상태

`outline`의 번호·URL은 공식 목차에서 확인합니다. 학습 항목에 대응한다는 이유만으로 `review: 'reviewed'`를 지정하지 않습니다. 기존 노트나 짧은 안내가 원문의 모든 개념을 포함한다고 가정하지 않습니다. 더 읽을거리와 연습문제 링크는 `chapterResources`로 직접 지정할 수 있습니다.

## 5. 검사

빌드와 구조 검사를 실행하고 다음을 확인합니다: 책 전환 전후 기록 분리, 잘못된 책 ID의 명시적 오류, 해당 책 안에서만 검색, 모든 선수 수업·문단 ID 연결, 다른 책 백업 불러오기 거부, 모바일에서 긴 수식·코드 표시, 출처·자료 유형 표시. 테스트용 두 번째 패키지는 `scripts/check-platform.mjs`에 있습니다.

책별 내용을 모두 검수한 후에만 완료 상태를 표시할 수 있습니다. 구조 검사 통과를 출판 품질 인증으로 사용하지 않습니다.
