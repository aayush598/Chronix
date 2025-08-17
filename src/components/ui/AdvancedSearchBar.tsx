import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface AdvancedSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  suggestions?: string[];
  trending?: string[];
  className?: string;
}

export function AdvancedSearchBar({ 
  query, 
  onQueryChange, 
  suggestions = [],
  trending = ['React', 'TypeScript', 'AI', 'Performance'],
  className = '' 
}: AdvancedSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <motion.div 
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center">
          <Search 
            size={20} 
            className="absolute left-4 text-gray-400 z-10" 
          />
          
          <motion.input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={handleFocus}
            placeholder="Search articles, discover insights..."
            className="w-full pl-12 pr-20 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500"
            whileFocus={{ 
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
            }}
          />
          
          <div className="absolute right-4 flex items-center gap-2">
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => onQueryChange('')}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
            
            <motion.button
              className="p-1 text-gray-400 hover:text-indigo-500 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Filter size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Advanced Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-full mt-2 left-0 right-0 z-50"
          >
            <GlassCard className="p-6">
              {/* AI Suggestions */}
              {query && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      AI Suggestions
                    </span>
                  </div>
                  <div className="space-y-2">
                    <motion.button
                      onClick={() => handleSuggestionClick(`${query} tutorial`)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      "{query}" tutorial
                    </motion.button>
                    <motion.button
                      onClick={() => handleSuggestionClick(`${query} best practices`)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      "{query}" best practices
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Trending Topics */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trending Topics
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map((topic, index) => (
                    <motion.button
                      key={topic}
                      onClick={() => handleSuggestionClick(topic)}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium hover:from-indigo-500/20 hover:to-purple-500/20 transition-all"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {topic}
                    </motion.button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}