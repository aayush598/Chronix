export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  coverImage?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  active?: boolean;
}

export interface ReadingProgress {
  progress: number;
  estimatedTimeLeft: number;
  wordsRead: number;
  totalWords: number;
}