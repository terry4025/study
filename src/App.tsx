import React, { useState, useEffect } from 'react';
import { BOOKS } from './data/books';
import { PBRT_TOC } from './data/books/pbrt-4ed/toc';
import { getSectionContent } from './data/sections';
import { Navbar, ReadingMode, FontFamily, ReaderTheme, LineHeight, ColumnWidth } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ReaderView } from './components/ReaderView';
import { LibraryModal } from './components/LibraryModal';
import { GlossaryModal } from './components/GlossaryModal';
import { BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  // Read initial values from URL params or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const initialBookId = urlParams.get('book') || localStorage.getItem('cs_current_book') || 'pbrt-4ed';
  const initialSectionId = urlParams.get('sec') || localStorage.getItem('cs_current_sec') || 'ch03-07';
  const initialMode = (urlParams.get('mode') as ReadingMode) || (localStorage.getItem('cs_reading_mode') as ReadingMode) || 'korean';
  const savedTheme = (localStorage.getItem('cs_theme') as ReaderTheme) || (urlParams.get('dark') === 'true' || localStorage.getItem('cs_dark_mode') === 'true' ? 'dark' : 'light');

  const [currentBookId, setCurrentBookId] = useState<string>(initialBookId);
  const [currentSectionId, setCurrentSectionId] = useState<string>(initialSectionId);
  const [readingMode, setReadingMode] = useState<ReadingMode>(initialMode);
  const [theme, setTheme] = useState<ReaderTheme>(savedTheme);
  const [fontFamily, setFontFamily] = useState<FontFamily>((localStorage.getItem('cs_font_family') as FontFamily) || 'pretendard');
  const [fontSize, setFontSize] = useState<number>(Number(localStorage.getItem('cs_font_size')) || 18);
  const [lineHeight, setLineHeight] = useState<LineHeight>((localStorage.getItem('cs_line_height') as LineHeight) || 'normal');
  const [columnWidth, setColumnWidth] = useState<ColumnWidth>((localStorage.getItem('cs_column_width') as ColumnWidth) || 'normal');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [glossaryQuery, setGlossaryQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Sync theme class on html tag and localStorage
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'sepia');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'sepia') {
      document.documentElement.classList.add('sepia');
    }
    localStorage.setItem('cs_theme', theme);
    localStorage.setItem('cs_dark_mode', String(theme === 'dark'));
  }, [theme]);

  // Sync font family, size, line height, column width
  useEffect(() => {
    localStorage.setItem('cs_font_family', fontFamily);
    localStorage.setItem('cs_font_size', String(fontSize));
    localStorage.setItem('cs_line_height', lineHeight);
    localStorage.setItem('cs_column_width', columnWidth);
  }, [fontFamily, fontSize, lineHeight, columnWidth]);

  // Sync state to URL and localStorage
  useEffect(() => {
    localStorage.setItem('cs_current_book', currentBookId);
    localStorage.setItem('cs_current_sec', currentSectionId);
    localStorage.setItem('cs_reading_mode', readingMode);

    const params = new URLSearchParams();
    params.set('book', currentBookId);
    params.set('sec', currentSectionId);
    if (readingMode !== 'korean') params.set('mode', readingMode);
    if (theme === 'dark') params.set('dark', 'true');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [currentBookId, currentSectionId, readingMode, theme]);

  const currentBook = BOOKS.find((b) => b.id === currentBookId) || BOOKS[0];
  const sectionContent = getSectionContent(currentSectionId);

  const handleSelectBook = (bookId: string) => {
    setCurrentBookId(bookId);
    if (bookId === 'pbrt-4ed') {
      setCurrentSectionId('ch03-07');
    }
  };

  const handleSelectSection = (sectionId: string) => {
    setCurrentSectionId(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentChapterId = currentSectionId.split('-')[0] || 'ch03';

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 sepia:bg-[#f7f4ed] text-slate-900 dark:text-slate-100 sepia:text-[#2b2621] flex flex-col transition-colors font-${fontFamily}`}>
      {/* Top Navigation */}
      <Navbar
        currentBook={currentBook}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        columnWidth={columnWidth}
        setColumnWidth={setColumnWidth}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenGlossary={() => {
          setGlossaryQuery('');
          setIsGlossaryOpen(true);
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        {/* TOC Sidebar */}
        <Sidebar
          currentBook={currentBook}
          chapters={PBRT_TOC}
          currentSectionId={currentSectionId}
          onSelectSection={handleSelectSection}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        {sectionContent ? (
          <ReaderView
            content={sectionContent}
            readingMode={readingMode}
            fontSize={fontSize}
            fontFamily={fontFamily}
            lineHeight={lineHeight}
            columnWidth={columnWidth}
            onNavigateSection={handleSelectSection}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenGlossary={(query) => {
              setGlossaryQuery(query || '');
              setIsGlossaryOpen(true);
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              해당 섹션의 번역본을 준비하고 있습니다.
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              왼쪽 목차에서 열람 가능한 섹션을 선택해주세요!
            </p>
            <button
              onClick={() => handleSelectSection('ch03-07')}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              3.7 바운딩 박스로 이동 →
            </button>
          </div>
        )}
      </div>

      {/* CS Books Library Modal */}
      <LibraryModal
        books={BOOKS}
        currentBookId={currentBookId}
        onSelectBook={handleSelectBook}
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />

      {/* Math & CS Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        initialQuery={glossaryQuery}
        currentChapterId={currentChapterId}
        onNavigateChapter={(chId) => {
          const firstSecMap: Record<string, string> = {
            ch01: 'ch01-01',
            ch02: 'ch02-01',
            ch03: 'ch03-01',
            ch04: 'ch04-01',
            ch05: 'ch05-01',
            ch06: 'ch06-01',
            ch07: 'ch07-01',
            ch08: 'ch08-01',
          };
          if (firstSecMap[chId]) {
            handleSelectSection(firstSecMap[chId]);
            setIsGlossaryOpen(false);
          }
        }}
      />
    </div>
  );
};

export default App;
