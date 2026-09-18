import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Tag, Sparkles } from 'lucide-react';

interface ConceptTipProps {
  badge?: string;
  title: string;
  summary: string;
  points: { title: string; content: string }[];
  tags?: string[];
}

export const ConceptTip: React.FC<ConceptTipProps> = ({
  badge = '컴공 기초 콕콕',
  title,
  summary,
  points,
  tags,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Sanitize any raw emojis from strings
  const cleanBadge = badge.replace(/^[💡\s]+/, '');
  const cleanTitle = title.replace(/^[💡\s]+/, '');
  const cleanSummary = summary.replace(/^[💡\s]+/, '');

  return (
    <div className="my-7 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-yellow-50/50 dark:from-amber-950/20 dark:via-orange-950/15 dark:to-yellow-950/20 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 sm:px-5 py-3.5 flex items-center justify-between cursor-pointer select-none border-b border-amber-200/60 dark:border-amber-900/40 hover:bg-amber-100/40 dark:hover:bg-amber-900/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                {cleanBadge}
              </span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug">
              {cleanTitle}
            </h4>
          </div>
        </div>

        <button className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
          <p className="font-medium text-amber-900 dark:text-amber-200/90 text-sm leading-relaxed">
            {cleanSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {points.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200/70 dark:border-amber-900/50 shadow-xs"
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
                  {p.title.replace(/^[💡\s]+/, '')}
                </div>
                <div className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {p.content}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
