import React, { useState } from 'react';
import { Copy, Check, Terminal, ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';

interface CodeBlockProps {
  chunkName: string;
  language: string;
  code: string;
  explanationKo?: string;
  chunkUpRef?: string;
  chunkDownRef?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  chunkName,
  language,
  code,
  explanationKo,
  chunkUpRef,
  chunkDownRef,
}) => {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 shadow-md overflow-hidden font-mono text-sm">
      {/* Literate Programming Chunk Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700/80 text-xs select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-bold text-amber-300 tracking-tight">
            {chunkName}
          </span>
          {/* Literate Navigation Icons */}
          <div className="inline-flex items-center gap-1 ml-1 text-slate-400">
            {chunkUpRef && (
              <span
                className="hover:text-indigo-300 cursor-pointer p-0.5 rounded hover:bg-slate-700 inline-flex items-center"
                title={`이전 조각: ${chunkUpRef}`}
              >
                <ChevronUp className="w-3 h-3" />
              </span>
            )}
            {chunkDownRef && (
              <span
                className="hover:text-indigo-300 cursor-pointer p-0.5 rounded hover:bg-slate-700 inline-flex items-center"
                title={`다음 조각: ${chunkDownRef}`}
              >
                <ChevronDown className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-sans font-semibold uppercase text-slate-400 bg-slate-700/60 px-2 py-0.5 rounded">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
            title="코드 복사"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans">복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="font-sans">복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-[13px] leading-relaxed bg-[#0d1117]">
        <pre className="font-mono">
          <code>{code}</code>
        </pre>
      </div>

      {/* Beginner-Friendly Explanation Box */}
      {explanationKo && (
        <div className="border-t border-slate-800 bg-slate-950/60 p-3.5 text-xs font-sans text-slate-300 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-indigo-300 mr-1.5">코드 콕콕 해설:</span>
            <span>{explanationKo}</span>
          </div>
        </div>
      )}
    </div>
  );
};
