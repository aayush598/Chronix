export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface BlogContent {
  id: string;
  type: 'text' | 'heading' | 'image' | 'code' | 'quote' | 'list' | 'interactive-demo' | 'callout';
  content: any;
  props?: any;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogContent[];
  author: BlogAuthor;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  tags: string[];
  coverImage: string;
  featured: boolean;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}