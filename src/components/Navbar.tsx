import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Moon, 
  Sun, 
  Languages, 
  Library, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  GraduationCap, 
  BookA, 
  FileText,
  Type,
  SlidersHorizontal,
  BookMarked,
  AlignLeft,
  X
} from 'lucide-react';
import { BookMeta } from '../types/book';

export type ReadingMode = 'korean' | 'bilingual' | 'english';
export type FontFamily = 'pretendard' | 'noto-sans' | 'ibm-plex' | 'noto-serif';
export type ReaderTheme = 'light' | 'sepia' | 'dark';
export type LineHeight = 'compact' | 'normal' | 'relaxed';
export type ColumnWidth = 'focus' | 'normal' | 'wide';

interface NavbarProps {
  currentBook: BookMeta;
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
  theme: ReaderTheme;
  setTheme: (theme: ReaderTheme) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  lineHeight: LineHeight;
  setLineHeight: (lh: LineHeight) => void;
  columnWidth: ColumnWidth;
  setColumnWidth: (cw: ColumnWidth) => void;
  onOpenLibrary: () => void;
  onOpenGlossary: () => void;
}

const FONT_OPTIONS: { id: FontFamily; name: string; desc: string; preview: string; fontClass: string }[] = [
  {
    id: 'pretendard',
    name: '프리텐다드 (Pretendard)',
    desc: '모던하고 매끄러운 고딕 (가장 대중적·추천)',
    preview: '빛과 카메라의 3차원 물리 렌더링',
    fontClass: 'font-pretendard',
  },
  {
    id: 'noto-sans',
    name: '본고딕 (Noto Sans KR)',
    desc: '군더더기 없이 단정하고 또렷한 정통 본문체',
    preview: '빛과 카메라의 3차원 물리 렌더링',
    fontClass: 'font-noto-sans',
  },
  {
    id: 'ibm-plex',
    name: 'IBM 플렉스 (IBM Plex Sans)',
    desc: '엔지니어링·기술 문서에 최적화된 높은 가독성',
    preview: '빛과 카메라의 3차원 물리 렌더링',
    fontClass: 'font-ibm-plex',
  },
  {
    id: 'noto-serif',
    name: '본명조 (Noto Serif / 바탕체)',
    desc: '출판 도서·전자책 특유의 편안하고 따뜻한 감성',
    preview: '빛과 카메라의 3차원 물리 렌더링',
    fontClass: 'font-noto-serif',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentBook,
  readingMode,
  setReadingMode,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  lineHeight,
  setLineHeight,
  columnWidth,
  setColumnWidth,
  onOpenLibrary,
  onOpenGlossary,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen]);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('sepia');
    else if (theme === 'sepia') setTheme('dark');
    else setTheme('light');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 sepia:border-[#ded6c5] bg-white/95 dark:bg-slate-900/95 sepia:bg-[#fcfbfa]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="cursor-pointer" onClick={onOpenLibrary}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white sepia:text-[#1a1714]">
                컴공 지식 베이스캠프
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 sepia:bg-amber-100 sepia:text-amber-800">
                CS Reader
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#797166] hidden md:block">
              컴공 명저 친절한 의역 & 다이어그램 완벽 보존 학습실
            </p>
          </div>
        </div>

        {/* Current Book & Glossary Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 sepia:border-[#ded6c5] hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 sepia:bg-[#f0ebe1] text-xs font-medium text-slate-700 dark:text-slate-200 sepia:text-[#2b2621] transition-all hover:shadow-xs"
            title="도서 목록 열기"
          >
            <Library className="w-4 h-4 text-indigo-500" />
            <span className="max-w-[160px] truncate">{currentBook.titleKo.split('(')[0]}</span>
            <span className="text-slate-400 text-[10px]">▾</span>
          </button>

          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700/60 sepia:border-amber-400/80 bg-amber-50/80 dark:bg-amber-950/40 sepia:bg-amber-100/60 text-amber-900 dark:text-amber-200 sepia:text-amber-950 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all hover:shadow-xs"
            title="수학 & 컴공 핵심 용어 치트키 열기"
          >
            <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>수학·용어 치트키</span>
          </button>
        </div>

        {/* Right Action Tools: Reading Mode, Aa Settings, Theme Cycle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Bilingual / Translation Mode Segmented Control */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 sepia:bg-[#eae3d5] rounded-lg p-1 border border-slate-200 dark:border-slate-700 sepia:border-[#ded6c5]">
            <button
              onClick={() => setReadingMode('korean')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                readingMode === 'korean'
                  ? 'bg-white dark:bg-slate-700 sepia:bg-[#fcfbfa] text-indigo-600 dark:text-indigo-400 sepia:text-amber-900 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 sepia:text-[#575047] hover:text-slate-900 dark:hover:text-white'
              }`}
              title="친절한 한국어 의역 중심"
            >
              <BookA className="w-3.5 h-3.5" />
              <span>친절 의역</span>
            </button>
            <button
              onClick={() => setReadingMode('bilingual')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                readingMode === 'bilingual'
                  ? 'bg-white dark:bg-slate-700 sepia:bg-[#fcfbfa] text-indigo-600 dark:text-indigo-400 sepia:text-amber-900 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 sepia:text-[#575047] hover:text-slate-900 dark:hover:text-white'
              }`}
              title="한글 의역과 원문 영어 문장 함께 보기"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">한·영 대조</span>
            </button>
            <button
              onClick={() => setReadingMode('english')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                readingMode === 'english'
                  ? 'bg-white dark:bg-slate-700 sepia:bg-[#fcfbfa] text-indigo-600 dark:text-indigo-400 sepia:text-amber-900 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 sepia:text-[#575047] hover:text-slate-900 dark:hover:text-white'
              }`}
              title="영문 원문만 보기"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">영문 원문</span>
            </button>
          </div>

          {/* Aa Reading Environment Settings Popover Trigger */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isSettingsOpen
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 sepia:bg-amber-100 text-indigo-700 dark:text-indigo-300 sepia:text-amber-950 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-700 sepia:border-[#ded6c5] bg-white dark:bg-slate-800 sepia:bg-[#fcfbfa] text-slate-700 dark:text-slate-200 sepia:text-[#2b2621] hover:border-slate-400'
              }`}
              title="폰트 및 독서 환경 설정 (Aa)"
            >
              <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400 sepia:text-amber-800" />
              <span className="font-bold">Aa 독서 설정</span>
            </button>

            {/* Reading Settings Dropdown Popover */}
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 sepia:bg-[#fcfbfa] border border-slate-200 dark:border-slate-800 sepia:border-[#ded6c5] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 sepia:border-[#ded6c5]">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400 sepia:text-amber-800" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white sepia:text-[#1a1714]">
                      독서 맞춤 환경 설정
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 1. Font Family Picker */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 sepia:text-[#797166] block mb-2">
                    본문 글꼴 선택
                  </label>
                  <div className="space-y-1.5">
                    {FONT_OPTIONS.map((f) => {
                      const isSelected = fontFamily === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setFontFamily(f.id)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 sepia:bg-amber-100/70 text-indigo-900 dark:text-indigo-100 sepia:text-amber-950 ring-1 ring-indigo-500/30'
                              : 'border-slate-200 dark:border-slate-800 sepia:border-[#ded6c5] bg-slate-50/60 dark:bg-slate-800/40 sepia:bg-[#f5efe2] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 sepia:text-[#3f3933]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-bold ${f.fontClass}`}>
                                {f.name}
                              </span>
                              {f.id === 'pretendard' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-semibold">
                                  추천
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#797166] mt-0.5">
                              {f.desc}
                            </p>
                            <p className={`text-xs mt-1 text-slate-800 dark:text-slate-200 sepia:text-[#1a1714] ${f.fontClass}`}>
                              "{f.preview}"
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 sepia:text-amber-800 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Font Size Slider / Buttons */}
                <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800 sepia:border-[#ded6c5]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 sepia:text-[#797166]">
                      글자 크기
                    </label>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 sepia:text-amber-800">
                      {fontSize}px
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFontSize((s) => Math.max(15, s - 1))}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 sepia:border-[#ded6c5] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="작게"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <div className="flex-1 grid grid-cols-4 gap-1 text-center">
                      {[16, 17, 18, 20].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setFontSize(sz)}
                          className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            fontSize === sz
                              ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs'
                              : 'border-slate-200 dark:border-slate-700 sepia:border-[#ded6c5] text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {sz}px
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 sepia:border-[#ded6c5] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="크게"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3. Line Height & Column Width */}
                <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800 sepia:border-[#ded6c5] grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 sepia:text-[#797166] block mb-1.5">
                      줄 간격 (가독성)
                    </label>
                    <div className="space-y-1">
                      {[
                        { id: 'compact', label: '1.75 보통' },
                        { id: 'normal', label: '1.9 쾌적 (추천)' },
                        { id: 'relaxed', label: '2.1 여유' },
                      ].map((lh) => (
                        <button
                          key={lh.id}
                          onClick={() => setLineHeight(lh.id as any)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            lineHeight === lh.id
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 sepia:bg-amber-100 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 sepia:border-[#ded6c5] text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {lh.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 sepia:text-[#797166] block mb-1.5">
                      본문 너비 (시선 이동)
                    </label>
                    <div className="space-y-1">
                      {[
                        { id: 'focus', label: '집중 (700px)' },
                        { id: 'normal', label: '표준 (780px)' },
                        { id: 'wide', label: '넓게 (920px)' },
                      ].map((w) => (
                        <button
                          key={w.id}
                          onClick={() => setColumnWidth(w.id as any)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            columnWidth === w.id
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 sepia:bg-amber-100 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 sepia:border-[#ded6c5] text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Reading Theme Selector */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 sepia:border-[#ded6c5]">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 sepia:text-[#797166] block mb-2">
                    화면 테마 모드
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        theme === 'light'
                          ? 'border-indigo-600 bg-slate-50 text-indigo-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-amber-500 mb-1" />
                      <span className="text-xs">라이트</span>
                    </button>

                    <button
                      onClick={() => setTheme('sepia')}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        theme === 'sepia'
                          ? 'border-amber-600 bg-[#f7f4ed] text-amber-900 font-bold shadow-xs'
                          : 'border-[#ded6c5] bg-[#fcfbfa] text-[#3f3933] hover:bg-[#f7f4ed]'
                      }`}
                    >
                      <BookMarked className="w-4 h-4 text-amber-700 mb-1" />
                      <span className="text-xs">아이보리 서재</span>
                    </button>

                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        theme === 'dark'
                          ? 'border-indigo-500 bg-slate-800 text-white font-bold shadow-xs'
                          : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-indigo-400 mb-1" />
                      <span className="text-xs">다크 모드</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Theme Cycle Button in Header */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 sepia:text-[#575047] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#eae3d5] transition-colors"
            title={`현재: ${theme === 'light' ? '라이트 모드' : theme === 'sepia' ? '아이보리 서재 모드' : '다크 모드'} (클릭하여 변경)`}
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : theme === 'sepia' ? (
              <BookMarked className="w-4 h-4 text-amber-700" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

