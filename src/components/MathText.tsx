import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  // Regex to detect:
  // 1. Display Math: $$...$$
  // 2. Inline Math: $...$
  // 3. Inline code: `...`
  // 4. Bold: **...**
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|`[^`]+?`|\*\*[^*]+?\*\*)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        // Display Math: $$...$$
        if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
          const formula = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(formula, {
              throwOnError: false,
              displayMode: true,
            });
            return (
              <span
                key={index}
                className="block my-5 py-3 px-4 rounded-xl overflow-x-auto text-center font-serif text-slate-900 dark:text-slate-100 sepia:text-[#1a1714] bg-slate-50/80 dark:bg-slate-900/60 sepia:bg-[#f2ece0] border border-slate-200/80 dark:border-slate-800 sepia:border-[#ded6c5] shadow-2xs"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <span key={index}>{part}</span>;
          }
        }

        // Inline LaTeX Math: $...$
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const formula = part.slice(1, -1);
          try {
            const html = katex.renderToString(formula, {
              throwOnError: false,
              displayMode: false,
            });
            return (
              <span
                key={index}
                className="inline-math mx-0.5 align-baseline text-[1.03em]"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <span key={index}>{part}</span>;
          }
        }

        // Inline Code: `...`
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          const codeContent = part.slice(1, -1);
          return (
            <code
              key={index}
              className="px-1.5 py-0.5 mx-0.5 rounded text-[0.88em] font-mono font-medium bg-slate-100 dark:bg-slate-800 sepia:bg-[#eae3d5] text-indigo-700 dark:text-indigo-300 sepia:text-amber-900 border border-slate-200 dark:border-slate-700/60 sepia:border-[#ded6c5]"
            >
              {codeContent}
            </code>
          );
        }

        // Bold: **...** (recursively parse math inside bold)
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          const boldContent = part.slice(2, -2);
          return (
            <strong key={index} className="font-bold text-slate-900 dark:text-white sepia:text-[#191410] bg-indigo-50/80 dark:bg-indigo-950/60 sepia:bg-amber-100/60 px-1 py-0.5 rounded">
              <MathText text={boldContent} />
            </strong>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
