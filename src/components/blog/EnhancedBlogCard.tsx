import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, User, Bookmark, Share2, TrendingUp } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { InteractiveCard } from '../ui/InteractiveCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { MorphingBlob } from '../ui/MorphingBlob';

interface EnhancedBlogCardProps {
  post: BlogPost;
  featured?: boolean;
  onClick?: () => void;
  className?: string;
  index?: number;
}

export function EnhancedBlogCard({ 
  post, 
  featured = false, 
  onClick, 
  className = '',
  index = 0
}: EnhancedBlogCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 20
      }}
      className={`${featured ? 'md:col-span-2 lg:col-span-2' : ''} ${className}`}
    >
      <InteractiveCard 
        className="h-full cursor-pointer overflow-hidden"
        glowColor={featured ? '#8b5cf6' : '#6366f1'}
      >
        <div onClick={onClick} className="relative h-full">
          {/* Background Blob */}
          <div className="absolute top-4 right-4 w-20 h-20">
            <MorphingBlob color={featured ? '#8b5cf6' : '#6366f1'} />
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative overflow-hidden h-48 md:h-56">
              <motion.img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Featured badge */}
              {post.featured && (
                <motion.div
                  className="absolute top-4 left-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingUp size={12} />
                    Featured
                  </div>
                </motion.div>
              )}

              {/* Quick actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isBookmarked 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
                </motion.button>
                
                <motion.button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 size={14} />
                </motion.button>
              </div>
            </div>
          )}

          <div className="p-6 space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                <motion.span
                  key={tag}
                  className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + tagIndex * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Title */}
            <motion.h2 
              className={`font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight ${
                featured ? 'text-2xl lg:text-3xl' : 'text-xl'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {post.title}
            </motion.h2>

            {/* Excerpt */}
            <motion.p 
              className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {post.excerpt}
            </motion.p>

            {/* Author */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-800"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </motion.div>

            {/* Meta information */}
            <motion.div 
              className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{post.readingTime} min</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <AnimatedCounter value={post.views} />
                </div>
              </div>
              
              <motion.button
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  isLiked 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-50 hover:text-red-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                </motion.div>
                <AnimatedCounter value={likes} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </InteractiveCard>
    </motion.div>
  );
}