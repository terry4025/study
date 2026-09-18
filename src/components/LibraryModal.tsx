import React from 'react';
import { X, BookOpen, ExternalLink, Sparkles, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import { BookMeta } from '../types/book';

interface LibraryModalProps {
  books: BookMeta[];
  currentBookId: string;
  onSelectBook: (bookId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  books,
  currentBookId,
  onSelectBook,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                컴공 지식 베이스캠프 서재 (CS Library)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              컴퓨터공학 기초부터 고급 렌더링/시스템까지, 명저들을 친절한 한국어 의역본으로 학습하세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Book Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => {
            const isSelected = book.id === currentBookId;
            const isActive = book.status === 'active';

            return (
              <div
                key={book.id}
                className={`relative rounded-xl border p-5 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-md'
                    : isActive
                    ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-800/40 hover:shadow-sm'
                    : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                      }`}
                    >
                      {isActive ? '학습 가능 (Active)' : '준비 중 (Coming Soon)'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{book.edition}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {book.titleKo}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">
                    {book.title}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
                    {book.descriptionKo}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {book.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    저자: {book.authors[0]} 외
                  </span>

                  {isActive ? (
                    <button
                      onClick={() => {
                        onSelectBook(book.id);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500'
                      }`}
                    >
                      {isSelected ? '현재 읽는 중' : '책 열기 →'}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">번역 순차 수록 예정</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>추가하고 싶은 컴공 추천도서가 있다면 언제든 말씀해주세요!</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
