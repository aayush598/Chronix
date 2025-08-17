import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, Heart } from 'lucide-react';
import { BlogPost as BlogPostType, TableOfContentsItem } from '../../types/blog';
import { useReadingProgress } from '../../hooks/useReadingProgress';
import { ReadingProgressBar } from '../ui/ReadingProgressBar';
import { TableOfContents } from '../ui/TableOfContents';
import { CodeBlock } from '../ui/CodeBlock';

interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}

export function BlogPost({ post, onBack }: BlogPostProps) {
  const contentRef = useRef<HTMLElement>(null);
  const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  const progress = useReadingProgress(contentRef, post.content.split(' ').length);

  useEffect(() => {
    // Generate table of contents
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h2, h3, h4, h5, h6');
      const items: TableOfContentsItem[] = Array.from(headings).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          title: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1)),
        };
      });
      setTocItems(items);
    }
  }, [post.content]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const processContent = (content: string) => {
    return content.split(/```(\w+)?\n([\s\S]*?)\n```/).map((part, index) => {
      if (index % 3 === 0) {
        // Regular content
        return part.split('\n').map((line, lineIndex) => {
          if (line.startsWith('# ')) {
            return <h1 key={lineIndex} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
          } else if (line.startsWith('## ')) {
            return <h2 key={lineIndex} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
          } else if (line.startsWith('### ')) {
            return <h3 key={lineIndex} className="text-xl font-semibold mt-5 mb-2">{line.slice(4)}</h3>;
          } else if (line.startsWith('- ')) {
            return <li key={lineIndex} className="ml-4">{line.slice(2)}</li>;
          } else if (line.trim() !== '') {
            return <p key={lineIndex} className="mb-4 leading-relaxed">{line}</p>;
          }
          return null;
        });
      } else if (index % 3 === 2) {
        // Code block
        const language = content.split(/```(\w+)?\n([\s\S]*?)\n```/)[index - 1] || 'javascript';
        return <CodeBlock key={index} code={part} language={language} className="mb-6" />;
      }
      return null;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <ReadingProgressBar progress={progress} />
      <TableOfContents items={tocItems} />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            Back to articles
          </motion.button>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author and Meta */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {post.author.name}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setLiked(!liked)}
                  className={`p-2 rounded-full transition-colors ${
                    liked 
                      ? 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-400' 
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                </motion.button>
                
                <motion.button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-full transition-colors ${
                    bookmarked 
                      ? 'bg-indigo-100 text-indigo-500 dark:bg-indigo-900 dark:text-indigo-400' 
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
                </motion.button>
                
                <motion.button
                  className="p-2 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="h-64 md:h-96 lg:h-[500px] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <article 
        ref={contentRef}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {processContent(post.content)}
        </div>
      </article>

      {/* Author Bio */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-6">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {post.author.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {post.author.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}