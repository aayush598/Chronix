import React, { useMemo } from 'react';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Blog, TableOfContentsItem } from '../types/blog';
import { ProgressBar } from './ProgressBar';
import { TableOfContents } from './TableOfContents';
import {
  TextComponent,
  HeadingComponent,
  CodeComponent,
  QuoteComponent,
  ListComponent,
  InteractiveDemoComponent,
  CalloutComponent
} from './BlogComponents';

interface BlogPostProps {
  blog: Blog;
  onBack: () => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ blog, onBack }) => {
  const tableOfContents: TableOfContentsItem[] = useMemo(() => {
    return blog.content
      .filter(item => item.type === 'heading')
      .map(item => ({
        id: item.content.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: item.content.text,
        level: item.content.level
      }));
  }, [blog.content]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = `${window.location.origin}/#/blog/${blog.slug}`;
  const shareText = `Check out this article: ${blog.title}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  const renderContent = (item: any) => {
    switch (item.type) {
      case 'text':
        return <TextComponent key={item.id} content={item.content} />;
      case 'heading':
        return <HeadingComponent key={item.id} content={item.content} />;
      case 'code':
        return <CodeComponent key={item.id} content={item.content} />;
      case 'quote':
        return <QuoteComponent key={item.id} content={item.content} />;
      case 'list':
        return <ListComponent key={item.id} content={item.content} />;
      case 'interactive-demo':
        return <InteractiveDemoComponent key={item.id} content={item.content} />;
      case 'callout':
        return <CalloutComponent key={item.id} content={item.content} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ProgressBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back to all blogs</span>
        </button>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main Content */}
          <main className="lg:col-span-8">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Cover Image */}
              <div className="aspect-video overflow-hidden">
                <img 
                  src={blog.coverImage} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Header */}
              <header className="p-8 pb-6">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Published {formatDate(blog.publishedAt)}</span>
                  </div>
                  {blog.updatedAt !== blog.publishedAt && (
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>Updated {formatDate(blog.updatedAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{blog.readingTime} min read</span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {blog.title}
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  {blog.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                  <img 
                    src={blog.author.avatar} 
                    alt={blog.author.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{blog.author.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{blog.author.bio}</p>
                    <div className="flex space-x-3">
                      {blog.author.socialLinks.website && (
                        <a 
                          href={blog.author.socialLinks.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Website
                        </a>
                      )}
                      {blog.author.socialLinks.twitter && (
                        <a 
                          href={blog.author.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Twitter
                        </a>
                      )}
                      {blog.author.socialLinks.linkedin && (
                        <a 
                          href={blog.author.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          LinkedIn
                        </a>
                      )}
                      {blog.author.socialLinks.github && (
                        <a 
                          href={blog.author.socialLinks.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Share2 size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Share this article:</span>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      <Twitter size={18} />
                    </a>
                    <a
                      href={shareLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Facebook size={18} />
                    </a>
                    <a
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      <Linkedin size={18} />
                    </a>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <div className="px-8 pb-8">
                <div className="prose prose-lg max-w-none">
                  {blog.content.map(renderContent)}
                </div>
              </div>
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 mt-8 lg:mt-0">
            <TableOfContents items={tableOfContents} />
          </aside>
        </div>
      </div>
    </div>
  );
};