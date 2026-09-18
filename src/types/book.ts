export interface BookMeta {
  id: string;
  title: string;
  titleKo: string;
  originalSubtitle: string;
  subtitleKo: string;
  authors: string[];
  edition: string;
  year: number;
  coverImage: string;
  descriptionKo: string;
  tags: string[];
  originalUrl: string;
  status: 'active' | 'coming-soon';
  chaptersCount: number;
  availableSectionsCount: number;
}

export interface SectionMeta {
  id: string;
  number: string; // e.g. "3.7"
  title: string;
  titleKo: string;
  isAvailable: boolean;
}

export interface ChapterMeta {
  id: string;
  number: string; // "1", "2", "3", "A", etc.
  title: string;
  titleKo: string;
  sections: SectionMeta[];
}

export type ContentBlock = 
  | {
      type: 'paragraph';
      id?: string;
      textKo: string;
      textEn: string;
    }
  | {
      type: 'subheading';
      level: 2 | 3 | 4;
      titleKo: string;
      titleEn?: string;
    }
  | {
      type: 'figure';
      id: string;
      number: string; // e.g. "Figure 3.10"
      title: string;
      titleKo: string;
      src: string;
      captionKo: string;
      captionEn: string;
      width?: number;
      height?: number;
    }
  | {
      type: 'code';
      id?: string;
      chunkName: string; // e.g. "<<Bounds3 Inline Functions>>+="
      language: string;
      code: string;
      explanationKo?: string;
      chunkUpRef?: string;
      chunkDownRef?: string;
    }
  | {
      type: 'concept-tip';
      badge?: string;
      title: string;
      summary: string;
      points: { title: string; content: string }[];
      tags?: string[];
    }
  | {
      type: 'equation';
      tex: string;
      explanationKo?: string;
    };

export interface SectionContent {
  bookId: string;
  chapterNumber: string;
  chapterTitleKo: string;
  sectionNumber: string;
  sectionTitle: string;
  sectionTitleKo: string;
  originalUrl: string;
  prevSection?: { id: string; title: string };
  nextSection?: { id: string; title: string };
  summary: {
    keyTakeaways: string[];
    prerequisites?: string[];
  };
  blocks: ContentBlock[];
}
