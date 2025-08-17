import React from 'react';
import { motion } from 'framer-motion';
import { Pen, Rss, Search as SearchIcon } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { SearchBar } from '../ui/SearchBar';

interface BlogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BlogHeader({ searchQuery, onSearchChange }: BlogHeaderProps) {
  return (
    <motion.header 
      className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Pen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                DevBlog
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Modern Web Development
              </p>
            </div>
          </motion.div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar
              query={searchQuery}
              onQueryChange={onSearchChange}
              placeholder="Search articles, tags, or authors..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Toggle */}
            <motion.button
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SearchIcon size={20} />
            </motion.button>

            {/* RSS Feed */}
            <motion.button
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="RSS Feed"
            >
              <Rss size={20} />
            </motion.button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <motion.div 
          className="md:hidden pb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <SearchBar
            query={searchQuery}
            onQueryChange={onSearchChange}
            placeholder="Search articles..."
          />
        </motion.div>
      </div>
    </motion.header>
  );
}