import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Tag, 
  Lightbulb, 
  Compass, 
  Calculator, 
  Dices, 
  Boxes, 
  Code2,
  CheckCircle2,
  HelpCircle,
  Layers,
  SunMedium,
  Camera
} from 'lucide-react';
import { GLOSSARY_ITEMS, GLOSSARY_CATEGORIES, GlossaryCategory, GlossaryItem } from '../data/glossary';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  currentChapterId?: string; // e.g. 'ch01', 'ch02', 'ch03', 'ch04', 'ch05'
  onNavigateChapter?: (chapterId: string) => void;
}

const CHAPTER_LABELS: Record<string, { label: string; name: string }> = {
  ch01: { label: '제1장', name: '소개 & 시스템' },
  ch02: { label: '제2장', name: '몬테카를로 & 확률' },
  ch03: { label: '제3장', name: '기하학 & 3D 변환' },
  ch04: { label: '제4장', name: '방사측정학 & 색상' },
  ch05: { label: '제5장', name: '카메라 & 필름' },
  ch06: { label: '제6장', name: '형상 & 교차검사' },
  ch07: { label: '제7장', name: '가속 구조 & BVH' },
  ch08: { label: '제8장', name: '샘플링 & 복원' },
};

const renderCategoryIcon = (id: GlossaryCategory | 'all') => {
  switch (id) {
    case 'math':
      return <Calculator className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    case 'probability':
      return <Dices className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
    case 'geometry':
      return <Boxes className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
    case 'optics':
      return <SunMedium className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    case 'camera':
      return <Camera className="w-3.5 h-3.5 text-cyan-500 shrink-0" />;
    case 'cs':
      return <Code2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    default:
      return <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
  }
};

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  currentChapterId = 'ch08',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');
  const [selectedChapter, setSelectedChapter] = useState<'all' | 'ch01' | 'ch02' | 'ch03' | 'ch04' | 'ch05' | 'ch06' | 'ch07' | 'ch08'>(() => {
    if (currentChapterId && ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08'].includes(currentChapterId)) {
      return currentChapterId as 'ch01' | 'ch02' | 'ch03' | 'ch04' | 'ch05' | 'ch06' | 'ch07' | 'ch08';
    }
    return 'all';
  });

  // When modal opens, default to the current chapter
  useEffect(() => {
    if (isOpen) {
      if (currentChapterId && ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08'].includes(currentChapterId)) {
        setSelectedChapter(currentChapterId as 'ch01' | 'ch02' | 'ch03' | 'ch04' | 'ch05' | 'ch06' | 'ch07' | 'ch08');
      } else {
        setSelectedChapter('all');
      }
      setSearchQuery(initialQuery || '');
      setSelectedCategory('all');
    }
  }, [isOpen, currentChapterId, initialQuery]);

  // Count items per chapter
  const counts = useMemo(() => {
    return {
      all: GLOSSARY_ITEMS.length,
      ch01: GLOSSARY_ITEMS.filter((i) => i.chapterId === 'ch01').length,
      ch02: GLOSSARY_ITEMS.filter((i) => i.chapterId === 'ch02').length,
      ch03: GLOSSARY_ITEMS.filter((i) => i.chapterId === 'ch03').length,
      ch04: GLOSSARY_ITEMS.filter((i) => i.chapterId === 'ch04').length,
      ch05: GLOSSARY_ITEMS.filter((i) => i.chapterId === 'ch05').length,
      ch06: GLOSSARY_ITEMS.filter((i) => i.chapterId === 'ch06').length,
      ch07: GLOSSARY_ITEMS.filter((i) => i.chapterId === 'ch07').length,
      ch08: GLOSSARY_ITEMS.filter((i) => i.chapterId === 'ch08').length,
    };
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return GLOSSARY_ITEMS.filter((item) => {
      // 1. Chapter filter
      if (selectedChapter !== 'all' && item.chapterId !== selectedChapter) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.termKo.toLowerCase().includes(q) ||
        item.termEn.toLowerCase().includes(q) ||
        item.easyAnalogy.toLowerCase().includes(q) ||
        item.mathMeaning.toLowerCase().includes(q) ||
        item.whyUsedInRendering.toLowerCase().includes(q) ||
        item.takeaway.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory, selectedChapter]);

  if (!isOpen) return null;

  const currentChapterInfo = CHAPTER_LABELS[selectedChapter] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="수학 & 컴공 핵심 용어 치트키"
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-50/60 via-indigo-50/40 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    수학 & 컴공 핵심 용어 치트키
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    초보자 안심 해설집
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  "미분·적분이 뭐였더라? 몬테카를로가 뭐지?" 고교 수학과 컴퓨터 과학 원리를 쉬운 일상 비유와 단계별 작동 원리로 풀어낸 사전입니다.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="닫기 (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chapter Selector Tabs (Core Feature Requested by User) */}
          <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>챕터 선택:</span>
            </span>

            {/* Current Chapter Priority Button */}
            {currentChapterId && ['ch01', 'ch02', 'ch03', 'ch04', 'ch05'].includes(currentChapterId) && (
              <button
                onClick={() => setSelectedChapter(currentChapterId as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedChapter === currentChapterId
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <span>📌 현재 읽는 중 ({CHAPTER_LABELS[currentChapterId]?.label || currentChapterId})</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/15">
                  {counts[currentChapterId as keyof typeof counts]}개
                </span>
              </button>
            )}

            {/* Individual Chapter Buttons */}
            <button
              onClick={() => setSelectedChapter('ch01')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedChapter === 'ch01'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>1장 소개 ({counts.ch01})</span>
            </button>

            <button
              onClick={() => setSelectedChapter('ch02')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedChapter === 'ch02'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>2장 몬테카를로 ({counts.ch02})</span>
            </button>

            <button
              onClick={() => setSelectedChapter('ch03')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedChapter === 'ch03'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>3장 기하학·변환 ({counts.ch03})</span>
            </button>

            <button
              onClick={() => setSelectedChapter('ch04')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedChapter === 'ch04'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>4장 방사측정·색상 ({counts.ch04})</span>
            </button>

            <button
              onClick={() => setSelectedChapter('ch05')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedChapter === 'ch05'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>5장 카메라·필름 ({counts.ch05})</span>
            </button>

            <button
              onClick={() => setSelectedChapter('ch06')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedChapter === 'ch06'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>6장 형상·교차 ({counts.ch06})</span>
            </button>

            <button
              onClick={() => setSelectedChapter('ch07')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedChapter === 'ch07'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>7장 가속·BVH ({counts.ch07})</span>
            </button>

            <button
              onClick={() => setSelectedChapter('ch08')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedChapter === 'ch08'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>8장 샘플링·복원 ({counts.ch08})</span>
            </button>

            <button
              onClick={() => setSelectedChapter('all')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedChapter === 'all'
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>전체 보기 ({counts.all})</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="mt-3.5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="궁금한 용어나 기호를 검색하세요 (예: 미분, 편미분, 적분, 몬테카를로, 아핀 공간, CRTP, 법선, NaN...)"
              className="w-full pl-10 pr-16 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-xs"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700"
              >
                지우기
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>카테고리 전체</span>
            </button>
            {GLOSSARY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {renderCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body - Detailed Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-semibold">
                선택하신 조건에 해당하는 용어를 찾지 못했습니다.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                상단의 [전체 보기] 탭을 누르시거나 다른 검색어를 입력해 보세요.
              </p>
              <button
                onClick={() => {
                  setSelectedChapter('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                전체 용어 보기
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <article
                key={`${item.chapterId}-${item.id}`}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600/60 transition-all space-y-4"
              >
                {/* 1. Header: Term, Badges, Symbol */}
                <div className="flex flex-wrap items-start justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                        {item.chapterLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        {item.termKo}
                      </h3>
                    </div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.termEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.symbol && (
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {item.symbol}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Story Analogy (핵심 비유 스토리) */}
                <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/50">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                        초보자를 위한 생생한 직관 비유
                      </span>
                      <div className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 leading-relaxed whitespace-pre-line font-medium">
                        {item.easyAnalogy}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Step-by-Step 원리 차근차근 뜯어보기 */}
                {item.steps && item.steps.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                      <span>원리 차근차근 뜯어보기 (단계별 해설)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {item.steps.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex flex-col"
                        >
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                            {s.step}
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {s.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Symbol Decoder (수식 기호 해독기) */}
                {item.symbolDecoder && (
                  <div className="p-3 rounded-lg bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <Calculator className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white mr-1.5 font-sans">
                        기호 해독:
                      </span>
                      <span>{item.symbolDecoder}</span>
                    </div>
                  </div>
                )}

                {/* 5. Academic Definition */}
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-slate-900 dark:text-slate-200 mr-1.5">
                      학술적 정의:
                    </strong>
                    {item.mathMeaning}
                  </div>
                </div>

                {/* 6. Why Used In 3D Rendering */}
                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div className="w-5 h-5 rounded-md bg-indigo-500/20 dark:bg-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="font-bold text-indigo-700 dark:text-indigo-300 mr-1.5">
                      3D 그래픽스 & 렌더링에서 쓰는 이유:
                    </strong>
                    {item.whyUsedInRendering}
                  </div>
                </div>

                {/* 7. Takeaway (초보자 안심 한 줄 요약) */}
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold mr-1">핵심 요약:</span>
                    {item.takeaway}
                  </div>
                </div>

                {/* 8. Tags & Related Chapters */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-slate-400">
                    관련 섹션: {item.relatedChapters.join(', ')}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between shrink-0">
          <span>
            {currentChapterInfo ? (
              <span>
                <strong className="text-indigo-600 dark:text-indigo-400">{currentChapterInfo.label} {currentChapterInfo.name}</strong> 관련 {filteredItems.length}개 용어 열람 중
              </span>
            ) : (
              <span>
                전체 챕터 <strong className="text-slate-700 dark:text-slate-300">{filteredItems.length}개</strong> 핵심 용어 열람 중
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-semibold transition-colors"
          >
            닫기 (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
