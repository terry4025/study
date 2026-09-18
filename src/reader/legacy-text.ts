/** Repair unambiguous double-escaped prose line breaks, never TeX or code.
 * A stored `\\n` immediately followed by an ASCII letter is ambiguous, so keep it.
 * In particular \\nu, \\nabla, \\ne and \\neq are NOT line breaks.
 */
export function normalizeLegacyText(input: string): string {
    const protectedTokens = /(```[\s\S]*?```|`[^`\n]*`|\$\$[\s\S]*?\$\$|\$(?:\\.|[^$\n])*?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;
    const normalize = (text: string) => text.replace(/(?<!\\)\\n(?![A-Za-z])/g, '\n');
    let output = '', cursor = 0;
    for (const match of input.matchAll(protectedTokens)) {
        const start = match.index!;
        output += normalize(input.slice(cursor, start)) + match[0];
        cursor = start + match[0].length;
    }
    return output + normalize(input.slice(cursor));
}
