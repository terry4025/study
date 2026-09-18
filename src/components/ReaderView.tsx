import React, { useState } from 'react';
import { SectionContent, ContentBlock } from '../types/book';
import { ReadingMode, FontFamily, LineHeight, ColumnWidth } from './Navbar';
import { FigureCard } from './FigureCard';
import { CodeBlock } from './CodeBlock';
import { ConceptTip } from './ConceptTip';
import { MathText } from './MathText';
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  Menu,
  GraduationCap
} from 'lucide-react';

interface ReaderViewProps {
  content: SectionContent;
  readingMode: ReadingMode;
  fontSize: number;
  fontFamily?: FontFamily;
  lineHeight?: LineHeight;
  columnWidth?: ColumnWidth;
  onNavigateSection: (sectionId: string) => void;
  onOpenSidebar: () => void;
  onOpenGlossary?: (query?: string) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  content,
  readingMode,
  fontSize,
  fontFamily = 'pretendard',
  lineHeight = 'normal',
  columnWidth = 'normal',
  onNavigateSection,
  onOpenSidebar,
  onOpenGlossary,
}) => {
  const [isKeyPointsOpen, setIsKeyPointsOpen] = useState(false);
  const currentChapterId = `ch0${content.chapterNumber}`;

  const getChapterBannerInfo = () => {
    switch (currentChapterId) {
      case 'ch01':
        return {
          badge: '제1장 핵심 용어',
          title: '제1장 문예적 프로그래밍 & 시스템 개념',
          desc: '문예적 프로그래밍, 렌더링 방정식, 스펙트럼 광선 추적 등 1장의 필수 개념을 초보자 눈높이의 쉬운 일상 비유로 확인해 보세요.',
          btnText: '1장 용어 치트키',
        };
      case 'ch02':
        return {
          badge: '제2장 핵심 수학',
          title: '제2장 몬테카를로 & 확률 통계 공식',
          desc: '확률 밀도 함수(PDF), 기댓값, 분산, 몬테카를로 적분 등 2장의 수학 개념을 주사위와 다트 던지기 비유로 알기 쉽게 확인해 보세요.',
          btnText: '2장 용어 치트키',
        };
      case 'ch03':
        return {
          badge: '제3장 기하학·수학',
          title: '제3장 기하학·변환 & 미적분 공식',
          desc: '미분, 적분, 아핀 공간, 동차 좌표계, 법선 벡터, 부동소수점 오차 등 3장의 핵심 기하학·수학을 쉬운 일상 비유와 3단계 원리로 확인해 보세요.',
          btnText: '3장 용어 치트키',
        };
      case 'ch04':
        return {
          badge: '제4장 광학·색채학',
          title: '제4장 방사측정학 & 색상 공식',
          desc: '플럭스(W), 조도, 휘도(Radiance), 람베르트 법칙, BRDF, 흑체 복사, CIE XYZ 등 4장의 핵심 광학 개념을 직관적인 일상 비유로 확인해 보세요.',
          btnText: '4장 용어 치트키',
        };
      case 'ch05':
        return {
          badge: '제5장 카메라·광학계',
          title: '제5장 가상 카메라 모델 & 센서 공식',
          desc: '핀홀, 원근 투영, 가우스 렌즈 방정식, 착란원(CoC), 피사계 심도(DoF), 등지사각 파노라마, G-버퍼 등 5장의 핵심 광학계를 쉬운 일상 비유로 확인해 보세요.',
          btnText: '5장 용어 치트키',
        };
      case 'ch06':
        return {
          badge: '제6장 형상·교차검사',
          title: '제6장 3차원 형상과 광선 교차 검사 공식',
          desc: '슬랩 교차법, 2차 판별식(D), 묄러-트룸보어 알고리즘, 무게중심 좌표계, 셰이딩 법선 보간, 베지어 곡선, 감마 오차 바운드(γ_n) 등 6장의 핵심 기하·수치 알고리즘을 직관적인 비유로 확인해 보세요.',
          btnText: '6장 용어 치트키',
        };
      case 'ch07':
        return {
          badge: '제7장 가속구조·BVH',
          title: '제7장 프리미티브와 BVH 가속 구조 공식',
          desc: '오브젝트 인스턴싱, 확률적 알파 테스팅, SAH 표면적 휴리스틱 비용 함수, 모턴 코드(Morton Code), HLBVH 기수 정렬, 32바이트 캐시 최적화 등 7장의 핵심 컴퓨터공학·알고리즘을 직관적인 비유로 확인해 보세요.',
          btnText: '7장 용어 치트키',
        };
      case 'ch08':
        return {
          badge: '제8장 샘플링·복원',
          title: '제8장 샘플링 이론과 이미지 복원 공식',
          desc: '푸리에 변환, 나이퀴스트-섀넌 정리(f_s ≥ 2 f_max), 앨리어싱과 모아레, 청색 잡음(Blue Noise), 별-불일치도(D_N*), 라틴 초입방체(LHS), 반전 라디칼, 할튼/소볼 디지털 네트, 미첼-네트라발리 필터 등 8장의 핵심 이론을 쉬운 일상 비유로 확인해 보세요.',
          btnText: '8장 용어 치트키',
        };
      default:
        return {
          badge: '핵심 개념 치트키',
          title: '수학 공식이나 전문 용어가 생소하신가요?',
          desc: '적분, 미분, 벡터 내적/외적, 몬테카를로 등 가물가물한 개념을 초보자 눈높이의 쉬운 일상 비유로 확인해 보세요.',
          btnText: '용어 치트키',
        };
    }
  };
  const bannerInfo = getChapterBannerInfo();

  const getWidthClass = () => {
    switch (columnWidth) {
      case 'focus':
        return 'max-w-[700px]';
      case 'wide':
        return 'max-w-[900px]';
      case 'normal':
      default:
        return 'max-w-[780px]';
    }
  };

  const getLineHeightClass = () => {
    switch (lineHeight) {
      case 'compact':
        return 'leading-[1.75]';
      case 'relaxed':
        return 'leading-[2.1]';
      case 'normal':
      default:
        return 'leading-[1.9]';
    }
  };

  const getFontClass = () => {
    switch (fontFamily) {
      case 'noto-sans':
        return 'font-noto-sans';
      case 'ibm-plex':
        return 'font-ibm-plex';
      case 'noto-serif':
        return 'font-noto-serif';
      case 'pretendard':
      default:
        return 'font-pretendard';
    }
  };

  const renderFormattedText = (rawText: string, isEnglish = false) => {
    const paragraphs = rawText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    return (
      <div className={`space-y-5 ${getLineHeightClass()} ${isEnglish ? 'italic text-slate-600 dark:text-slate-400 sepia:text-[#575047]' : 'text-slate-800 dark:text-slate-200 sepia:text-[#2b2621]'}`}>
        {paragraphs.map((pText, pIdx) => {
          const trimmed = pText.trim();

          // 1. Blockquote
          if (trimmed.startsWith('>')) {
            const quoteLines = trimmed
              .split('\n')
              .map((line) => line.replace(/^>\s?/, ''))
              .join(' ');
            return (
              <blockquote
                key={pIdx}
                className="my-5 pl-4 py-3 border-l-4 border-indigo-500 dark:border-indigo-400 sepia:border-amber-700 bg-indigo-50/50 dark:bg-indigo-950/30 sepia:bg-[#ede6d8] rounded-r-xl text-slate-700 dark:text-slate-300 sepia:text-[#3f3933] italic text-[0.98em] leading-relaxed shadow-2xs"
              >
                <MathText text={quoteLines} />
              </blockquote>
            );
          }

          // 2. Unordered list
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed
              .split('\n')
              .filter((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));
            return (
              <ul key={pIdx} className="my-4 space-y-2.5 pl-2">
                {items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2.5 text-[0.98em] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 sepia:bg-amber-700 mt-2.5 shrink-0" />
                    <span className="flex-1">
                      <MathText text={item.replace(/^[-*]\s+/, '')} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          }

          // 3. Ordered list
          if (/^\d+\.\s/.test(trimmed)) {
            const items = trimmed
              .split('\n')
              .filter((line) => /^\d+\.\s/.test(line.trim()));
            return (
              <ol key={pIdx} className="my-4 space-y-2.5 pl-2">
                {items.map((item, iIdx) => {
                  const match = item.trim().match(/^(\d+)\.\s*(.*)$/);
                  const num = match ? match[1] : `${iIdx + 1}`;
                  const text = match ? match[2] : item;
                  return (
                    <li key={iIdx} className="flex items-start gap-2.5 text-[0.98em] leading-relaxed">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 sepia:bg-amber-200/80 text-indigo-700 dark:text-indigo-300 sepia:text-amber-950 text-xs font-bold shrink-0 mt-0.5">
                        {num}
                      </span>
                      <span className="flex-1">
                        <MathText text={text} />
                      </span>
                    </li>
                  );
                })}
              </ol>
            );
          }

          // 4. Regular paragraph
          return (
            <p key={pIdx} className="tracking-[-0.015em] mb-0">
              <MathText text={trimmed} />
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <main className={`flex-1 min-w-0 ${getWidthClass()} mx-auto px-4 sm:px-8 py-6 md:py-10 transition-all duration-200 ${getFontClass()}`}>
      {/* Mobile TOC Trigger Button & Breadcrumbs */}
      <div className="flex items-center justify-between gap-2 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 sepia:border-[#ded6c5]">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 sepia:text-[#797166] truncate">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-1.5 -ml-1.5 mr-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="목차 열기"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span>PBRT 4판</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{content.chapterTitleKo.split('(')[0]}</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 sepia:text-[#1a1714] truncate">
            {content.sectionNumber}
          </span>
        </div>

        <a
          href={content.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 sepia:hover:text-amber-800 transition-colors"
          title="원문 웹사이트 새 창으로 열기"
        >
          <span className="hidden sm:inline">원문(pbr-book.org) 보기</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Section Title Header */}
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 sepia:bg-amber-100 text-indigo-700 dark:text-indigo-300 sepia:text-amber-800 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{content.chapterTitleKo}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white sepia:text-[#1a1714] tracking-tight leading-tight">
          {content.sectionTitleKo}
        </h1>
        <p className="text-sm sm:text-base italic text-slate-500 dark:text-slate-400 sepia:text-[#797166] mt-1.5">
          {content.sectionNumber} {content.sectionTitle}
        </p>
      </header>

      {/* Sleek Top Study Guide Bar (Collapsible Key Points + Math Glossary Trigger) */}
      <div className="mb-8 rounded-xl border border-slate-200/90 dark:border-slate-800 sepia:border-[#ded6c5] bg-white/90 dark:bg-slate-900/60 sepia:bg-[#fbf9f4] shadow-xs overflow-hidden">
        <div className="p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 sepia:bg-amber-200/70 flex items-center justify-center text-amber-800 dark:text-amber-300 sepia:text-amber-900 shrink-0">
              <GraduationCap className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 sepia:text-[#2b2621] truncate">
                  {bannerInfo.title}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 sepia:bg-amber-200/80 shrink-0">
                  {bannerInfo.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#797166] mt-0.5 truncate hidden sm:block">
                {bannerInfo.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              onClick={() => onOpenGlossary?.()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-2xs transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{bannerInfo.btnText}</span>
            </button>
            <button
              onClick={() => setIsKeyPointsOpen(!isKeyPointsOpen)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 sepia:border-[#ded6c5] text-xs font-medium text-slate-600 dark:text-slate-300 sepia:text-[#575047] hover:bg-slate-50 dark:hover:bg-slate-800 sepia:hover:bg-[#eae3d5] transition-colors"
            >
              <span>핵심 요약</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isKeyPointsOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Collapsible Key Points Drawer */}
        {isKeyPointsOpen && (
          <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 sepia:bg-[#f3ece0] border-t border-slate-100 dark:border-slate-800/60 sepia:border-[#ded6c5] animate-in fade-in duration-150">
            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 sepia:text-amber-950 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>이 절에서 다루는 핵심 개념 ({content.summary.keyTakeaways.length}가지)</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 sepia:text-[#3f3933]">
              {content.summary.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="leading-relaxed"><MathText text={point} /></span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Content Blocks Area */}
      <div
        className="reading-content text-slate-800 dark:text-slate-200"
        style={{ fontSize: `${fontSize}px` }}
      >
        {content.blocks.map((block, index) => {
          switch (block.type) {
            case 'subheading': {
              const HeadingTag = block.level === 4 ? 'h4' : block.level === 3 ? 'h3' : 'h2';
              const sizeClass =
                block.level === 4
                  ? 'text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100'
                  : block.level === 3
                  ? 'text-lg sm:text-xl font-bold text-slate-900 dark:text-white'
                  : 'text-xl sm:text-2xl font-bold text-slate-900 dark:text-white';
              const marginClass = block.level === 4 ? 'mt-6 mb-2' : 'mt-10 mb-4 pt-4 border-t border-slate-200/60 dark:border-slate-800';

              return (
                <div key={index} className={marginClass}>
                  <HeadingTag className={`${sizeClass} tracking-tight`}>
                    {block.titleKo}
                  </HeadingTag>
                  {block.titleEn && (
                    <p className="text-xs sm:text-sm font-serif italic text-slate-500 dark:text-slate-400 mt-0.5">
                      {block.titleEn}
                    </p>
                  )}
                </div>
              );
            }

            case 'paragraph':
              if (readingMode === 'english') {
                return (
                  <div key={index} className="my-5">
                    {renderFormattedText(block.textEn, true)}
                  </div>
                );
              }

              if (readingMode === 'bilingual') {
                return (
                  <div
                    key={index}
                    className="my-6 p-5 rounded-xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3.5 transition-all hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs"
                  >
                    <div>
                      {renderFormattedText(block.textKo, false)}
                    </div>
                    <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/60">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">
                        Original English
                      </span>
                      {renderFormattedText(block.textEn, true)}
                    </div>
                  </div>
                );
              }

              // Default: Korean with comfortable paragraph spacing
              return (
                <div key={index} className="my-5">
                  {renderFormattedText(block.textKo, false)}
                </div>
              );

            case 'figure':
              return (
                <FigureCard
                  key={index}
                  id={block.id}
                  number={block.number}
                  title={block.title}
                  titleKo={block.titleKo}
                  src={block.src}
                  captionKo={block.captionKo}
                  captionEn={block.captionEn}
                />
              );

            case 'code':
              return (
                <CodeBlock
                  key={index}
                  chunkName={block.chunkName}
                  language={block.language}
                  code={block.code}
                  explanationKo={block.explanationKo}
                  chunkUpRef={block.chunkUpRef}
                  chunkDownRef={block.chunkDownRef}
                />
              );

            case 'concept-tip':
              return (
                <ConceptTip
                  key={index}
                  badge={block.badge}
                  title={block.title}
                  summary={block.summary}
                  points={block.points}
                  tags={block.tags}
                />
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Bottom Navigation: Prev / Next Section */}
      <footer className="mt-14 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {content.prevSection ? (
          <button
            onClick={() => onNavigateSection(content.prevSection!.id)}
            className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 text-left transition-all hover:shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-500 group-hover:-translate-x-1 transition-transform" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">이전 절</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {content.prevSection.title}
              </div>
            </div>
          </button>
        ) : (
          <div />
        )}

        {content.nextSection ? (
          <button
            onClick={() => onNavigateSection(content.nextSection!.id)}
            className="w-full sm:w-auto flex items-center justify-end gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 text-right transition-all hover:shadow-sm group ml-auto"
          >
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">다음 절</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {content.nextSection.title}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <div />
        )}
      </footer>
    </main>
  );
};
