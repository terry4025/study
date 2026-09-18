import type { SectionContent } from '../types/book';
import { adaptLegacy } from '../reader/legacy';
/** Targeted display correction. Never normalize arbitrary TeX or rewrite source files. */
export function adaptPbrt(id: string, source: SectionContent) {
    const lesson = adaptLegacy(id, source);
    if (id !== 'ch03-09') return lesson;
    lesson.blocks = lesson.blocks.map(block => {
        if (block.type !== 'aside') return block;
        const text = block.text.replace(/\$\$[\s\S]*?\$\$/g, token => {
            // This known block double-escaped every TeX backslash, including row separators.
            if (!token.includes(String.raw`\\begin{bmatrix}`)) return token;
            return token.replace(/\\\\/g, '\\');
        });
        return {...block, text};
    });
    lesson.notice = '표시 정정: 기존 동차 좌표 행렬의 중복 이스케이프를 표시 단계에서 교정했습니다. 원본 파일과 문단 ID는 보존했습니다. 이 수정은 해당 절 전체의 원문 대조 완료를 의미하지 않습니다.';
    return lesson;
}
