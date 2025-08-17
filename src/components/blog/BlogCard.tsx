import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, User } from 'lucide-react';
import { BlogPost } from '../../types/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  onClick?: () => void;
  className?: string;
}

export function BlogCard({ post, featured = false, onClick, className = '' }: BlogCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.article
      onClick={onClick}
      className={`group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      } ${className}`}
      whileHover={{ y: -4, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative overflow-hidden h-48 md:h-56">
          <motion.img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          {post.featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-md text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className={`font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
          featured ? 'text-2xl lg:text-3xl' : 'text-xl'
        }`}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{post.author.name}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{post.readingTime} min read</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{post.views.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Heart size={16} />
            <span>{post.likes}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}