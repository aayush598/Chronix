# Chronix Blog Website

A modern, Chronix blogging platform built with React, TypeScript, and Tailwind CSS. This application features custom UI components, advanced search functionality, and a beautiful, responsive design.

## Features

### 🎨 Custom UI Components
- **Interactive Demos**: Embedded interactive components within blog posts
- **Code Blocks**: Syntax-highlighted code with language indicators
- **Callouts**: Info, warning, success, and error message boxes
- **Quotes**: Beautifully styled blockquotes with attribution
- **Lists**: Ordered and unordered lists with custom styling

### 📊 Advanced Functionality
- **Reading Progress Bar**: Visual progress indicator while reading
- **Table of Contents**: Auto-generated, scrollspy-enabled navigation
- **Search & Filter**: Real-time search with tag-based filtering
- **Shareable URLs**: Unique URLs for each blog post
- **Author Profiles**: Detailed author information with social links

### 🎯 User Experience
- **Responsive Design**: Optimized for all screen sizes
- **Smooth Animations**: Micro-interactions and hover effects
- **Glass Morphism**: Modern translucent design elements
- **Fast Navigation**: Hash-based routing for instant page loads

## Project Structure

```
src/
├── components/
│   ├── BlogComponents/     # Custom blog content components
│   │   ├── TextComponent.tsx
│   │   ├── HeadingComponent.tsx
│   │   ├── CodeComponent.tsx
│   │   ├── QuoteComponent.tsx
│   │   ├── ListComponent.tsx
│   │   ├── InteractiveDemoComponent.tsx
│   │   ├── CalloutComponent.tsx
│   │   └── index.ts
│   ├── BlogList.tsx        # Blog listing with search/filter
│   ├── BlogPost.tsx        # Individual blog post view
│   ├── ProgressBar.tsx     # Reading progress indicator
│   ├── TableOfContents.tsx # Auto-generated TOC
│   └── SearchAndFilter.tsx # Search and tag filtering
├── data/
│   ├── blogs/             # Individual blog post files
│   │   ├── interactive-react-typescript-components.ts
│   │   ├── modern-css-beautiful-ui-design.ts
│   │   ├── react-performance-optimization-strategies.ts
│   │   ├── future-web-development-trends-2025.ts
│   │   └── index.ts
│   ├── authors.ts         # Author profiles
│   └── index.ts          # Main data exports
├── types/
│   └── blog.ts           # TypeScript type definitions
└── App.tsx               # Main application component
```

## Adding New Blog Posts

To create a new blog post:

1. **Create a new file** in `src/data/blogs/` with a descriptive filename (e.g., `my-new-blog-post.ts`)

2. **Define your blog post** using the `Blog` interface:

```typescript
import { Blog } from '../../types/blog';
import { authors } from '../authors';

export const myNewBlogPost: Blog = {
  id: 'unique-id',
  title: 'Your Blog Title',
  slug: 'your-blog-slug',
  excerpt: 'A brief description of your blog post...',
  content: [
    {
      id: '1',
      type: 'heading',
      content: { level: 2, text: 'Your Heading' }
    },
    {
      id: '2',
      type: 'text',
      content: 'Your paragraph content...'
    },
    // Add more content blocks as needed
  ],
  author: authors.yourAuthor,
  publishedAt: '2025-01-20T10:00:00Z',
  updatedAt: '2025-01-20T10:00:00Z',
  readingTime: 5,
  tags: ['Tag1', 'Tag2'],
  coverImage: 'https://your-image-url.jpg',
  featured: false
};
```

3. **Export your blog** in `src/data/blogs/index.ts`:

```typescript
import { myNewBlogPost } from './my-new-blog-post';

export const blogs: Blog[] = [
  // ... existing blogs
  myNewBlogPost
];

export { myNewBlogPost };
```

## Available Content Types

### Text
```typescript
{
  type: 'text',
  content: 'Your paragraph text here...'
}
```

### Headings
```typescript
{
  type: 'heading',
  content: { level: 2, text: 'Your Heading' }
}
```

### Code Blocks
```typescript
{
  type: 'code',
  content: {
    language: 'typescript',
    code: 'const example = "Hello World";'
  }
}
```

### Interactive Demos
```typescript
{
  type: 'interactive-demo',
  content: {
    title: 'Demo Title',
    description: 'Demo description'
  }
}
```

### Callouts
```typescript
{
  type: 'callout',
  content: {
    type: 'info' | 'warning' | 'success' | 'error',
    title: 'Callout Title',
    message: 'Your message here'
  }
}
```

### Quotes
```typescript
{
  type: 'quote',
  content: {
    text: 'Your quote text',
    author: 'Quote Author'
  }
}
```

### Lists
```typescript
{
  type: 'list',
  content: {
    type: 'ordered' | 'unordered',
    items: ['Item 1', 'Item 2', 'Item 3']
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technologies Used

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Vite** - Fast build tool and development server

## Design Philosophy

This blog platform prioritizes:
- **User Experience**: Smooth interactions and intuitive navigation
- **Performance**: Fast loading and responsive design
- **Accessibility**: Semantic HTML and keyboard navigation
- **Maintainability**: Clean, modular code structure
- **Extensibility**: Easy to add new content types and features