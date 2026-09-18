import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, CheckCircle2, Clock, BookOpen, Layers, X } from 'lucide-react';
import { BookMeta, ChapterMeta } from '../types/book';

interface SidebarProps {
  currentBook: BookMeta;
  chapters: ChapterMeta[];
  currentSectionId: string;
  onSelectSection: (sectionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentBook,
  chapters,
  currentSectionId,
  onSelectSection,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    ch01: true,
    ch03: true,
  });

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Filter sections by search term
  const filteredChapters = chapters
    .map((chapter) => {
      const filteredSections = chapter.sections.filter(
        (sec) =>
          sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sec.titleKo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sec.number.includes(searchTerm)
      );
      return {
        ...chapter,
        sections: filteredSections,
      };
    })
    .filter((ch) => ch.sections.length > 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Book Header Card */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <img
                src={currentBook.coverImage}
                alt="Book cover"
                className="w-9 h-9 rounded-md object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                onError={(e) => {
                  // Fallback icon if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h2 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight line-clamp-1">
                  {currentBook.titleKo.split('(')[0]}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentBook.edition} · {currentBook.authors[0]} 외
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mt-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="챕터, 섹션, 키워드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Chapters and Sections List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredChapters.map((ch) => {
            const isExpanded = searchTerm ? true : !!expandedChapters[ch.id];
            const hasActiveSection = ch.sections.some((s) => s.id === currentSectionId);

            return (
              <div key={ch.id} className="pt-2 first:pt-0">
                {/* Chapter Header */}
                <button
                  onClick={() => toggleChapter(ch.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold transition-colors ${
                    hasActiveSection
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-4 text-slate-400 text-[10px]">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                    <span className="truncate">{ch.titleKo}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    {ch.sections.length}
                  </span>
                </button>

                {/* Sections Subtree */}
                {isExpanded && (
                  <div className="mt-1 pl-4 pr-1 space-y-0.5">
                    {ch.sections.map((sec) => {
                      const isActive = sec.id === currentSectionId;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => {
                            if (sec.isAvailable) {
                              onSelectSection(sec.id);
                              onClose();
                            }
                          }}
                          disabled={!sec.isAvailable}
                          className={`w-full flex items-start justify-between gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-all ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs border-l-2 border-indigo-600'
                              : sec.isAvailable
                              ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                              : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-75'
                          }`}
                        >
                          <div className="truncate">
                            <span className="font-mono text-[11px] text-slate-400 mr-1.5">
                              {sec.number}
                            </span>
                            <span className="truncate">{sec.titleKo.replace(/^\d+\.\d+\s*/, '')}</span>
                          </div>

                          {sec.isAvailable ? (
                            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium">
                              열람
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-600 font-normal">
                              준비중
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <span>PBRT v4 한국어 학습판</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {chapters.reduce((acc, ch) => acc + ch.sections.filter((s) => s.isAvailable).length, 0)}개 섹션 완성 (1~8장 완독)
          </span>
        </div>
      </aside>
    </>
  );
};
