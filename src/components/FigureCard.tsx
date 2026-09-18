import React, { useState } from 'react';
import { Maximize2, Minimize2, ExternalLink, ChevronDown, ChevronUp, Image as ImageIcon, Languages } from 'lucide-react';
import { MathText } from './MathText';

interface FigureCardProps {
  id: string;
  number: string;
  title: string;
  titleKo: string;
  src: string;
  captionKo: string;
  captionEn: string;
}

export const FigureCard: React.FC<FigureCardProps> = ({
  id,
  number,
  title,
  titleKo,
  src,
  captionKo,
  captionEn,
}) => {
  const [showEnCaption, setShowEnCaption] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <figure
      id={id}
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all hover:shadow-md"
    >
      {/* Top Bar with Figure Number & Tools */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{number}</span>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">{titleKo}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title={isZoomed ? '원래 크기로' : '확대 보기'}
          >
            {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Image Container (Faithful to Original Card Aesthetic) */}
      <div className="p-6 md:p-8 flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/60 min-h-[180px] overflow-x-auto">
        <div className={`p-5 rounded-lg bg-white dark:bg-white/95 transition-all duration-300 shadow-xs border border-slate-200/60 dark:border-slate-700/50 ${isZoomed ? 'scale-125 md:scale-150 py-8' : 'scale-100'}`}>
          <img
            src={src}
            alt={`${number}: ${title}`}
            className="max-w-full h-auto object-contain mx-auto filter drop-shadow-xs select-none"
            style={{ maxHeight: isZoomed ? '600px' : '360px' }}
            loading="lazy"
          />
        </div>
      </div>

      {/* Figcaption: Matches user's screenshot layout */}
      <figcaption className="p-4 md:p-5 bg-slate-50/70 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <div className="mb-2">
          <span className="font-semibold text-slate-900 dark:text-white mr-1.5 text-[0.95rem]">
            {number}: {title}.
          </span>
          <MathText text={captionKo} className="text-slate-800 dark:text-slate-200" />
        </div>

        {/* Expandable Original English Caption Toggle */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80">
          <button
            onClick={() => setShowEnCaption(!showEnCaption)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            {showEnCaption ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <Languages className="w-3.5 h-3.5" />
            <span>{showEnCaption ? '원문 영문 캡션 접기' : '원문 영문 캡션(Original English) 확인하기'}</span>
          </button>

          {showEnCaption && (
            <div className="mt-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/70 text-xs font-serif text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200/60 dark:border-slate-700/60 animate-fadeIn">
              <p>
                <strong className="text-slate-800 dark:text-slate-100 font-sans">{number}: {title}.</strong>{' '}
                <MathText text={captionEn} />
              </p>
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
};
