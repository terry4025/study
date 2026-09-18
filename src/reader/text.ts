import katex from 'katex';
export function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    if (className)
        node.className = className;
    if (text !== undefined)
        node.textContent = text;
    return node;
}
export function button(text: string, action: () => void, className = 'button'): HTMLButtonElement {
    const b = element('button', className, text);
    b.type = 'button';
    b.addEventListener('click', action);
    return b;
}
export function externalLink(label: string, url: string): HTMLElement {
    try {
        const u = new URL(url);
        if (u.protocol !== 'https:' && u.protocol !== 'http:')
            throw new Error();
        const a = element('a', 'source-link', label + ' ↗');
        a.href = u.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        return a;
    }
    catch {
        return element('span', 'muted', '유효하지 않은 출처 링크');
    }
}
export function math(tex: string, display = false): HTMLElement {
    const node = element(display ? 'div' : 'span', display ? 'formula' : 'inline-formula');
    try {
        if (tex.length > 12000)
            throw new Error('수식 길이 초과');
        // Native MathML avoids downloading/redistributing font files and is accessible.
        node.innerHTML = katex.renderToString(tex, { displayMode: display, throwOnError: true, trust: false, strict: 'ignore', maxExpand: 2000, output: 'mathml' });
    }
    catch {
        node.classList.add('formula-error');
        node.append(element('code', '', tex));
        node.title = '수식을 표시하지 못했습니다. 원본 표기를 보존합니다.';
        if (display)
            node.append(element('small', '', '수식 표시 오류 · 원본 표기를 보존했습니다.'));
    }
    return node;
}
export function inline(text: string, depth = 0): DocumentFragment {
    const out = document.createDocumentFragment();
    if (depth > 5) {
        out.append(document.createTextNode(text));
        return out;
    }
    // Tokenization never drops unmatched input; rendering does not allow raw HTML.
    const pattern = /(\$\$[\s\S]+?\$\$|`[^`\n]+`|\*\*[\s\S]+?\*\*|\$[^$\n]+\$)/g;
    let cursor = 0;
    for (const match of text.matchAll(pattern)) {
        const i = match.index!;
        out.append(document.createTextNode(text.slice(cursor, i)));
        const token = match[0];
        if (token.startsWith('$$'))
            out.append(math(token.slice(2, -2), true));
        else if (token.startsWith('$'))
            out.append(math(token.slice(1, -1)));
        else if (token.startsWith('`'))
            out.append(element('code', 'inline-code', token.slice(1, -1)));
        else {
            const strong = element('strong');
            strong.append(inline(token.slice(2, -2), depth + 1));
            out.append(strong);
        }
        cursor = i + token.length;
    }
    out.append(document.createTextNode(text.slice(cursor)));
    return out;
}
export function prose(text: string): HTMLElement {
    const node = element('div', 'prose');
    for (const group of text.split(/\n\s*\n/).filter(x => x.trim())) {
        if (group.trim().startsWith('$$') && group.trim().endsWith('$$')) {
            node.append(math(group.trim().slice(2, -2), true));
            continue;
        }
        const lines = group.split('\n');
        let list: HTMLUListElement | HTMLOListElement | null = null;
        let paragraph: HTMLParagraphElement | null = null;
        for (const line of lines) {
            const m = line.match(/^\s*(?:([-*])\s+|(\d+)\.\s+)(.*)$/);
            if (m) {
                const tag = m[2] ? 'OL' : 'UL';
                if (!list || list.tagName !== tag) {
                    list = element(m[2] ? 'ol' : 'ul');
                    if (list instanceof HTMLOListElement)
                        list.start = Number(m[2]);
                    node.append(list);
                }
                const li = element('li');
                li.append(inline(m[3]));
                list.append(li);
                paragraph = null;
            }
            else if (list && /^\s{2,}\S/.test(line)) {
                list.lastElementChild?.append(document.createElement('br'), inline(line.trim()));
            }
            else {
                list = null;
                if (!paragraph) {
                    paragraph = element('p');
                    node.append(paragraph);
                }
                else
                    paragraph.append(document.createElement('br'));
                paragraph.append(inline(line.replace(/^>\s?/, '')));
                if (line.startsWith('>'))
                    paragraph.classList.add('quote');
            }
        }
    }
    return node;
}
