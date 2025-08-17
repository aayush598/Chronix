import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, TrendingUp, Hash } from 'lucide-react';

interface Tag {
  tag: string;
  count: number;
}

interface EnhancedTagCloudProps {
  tags: Tag[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  className?: string;
}

export function EnhancedTagCloud({ 
  tags, 
  selectedTags, 
  onTagClick, 
  className = '' 
}: EnhancedTagCloudProps) {
  const [shuffledTags, setShuffledTags] = useState(tags);
  const [viewMode, setViewMode] = useState<'cloud' | 'list'>('cloud');

  useEffect(() => {
    setShuffledTags([...tags].sort(() => Math.random() - 0.5));
  }, [tags]);

  const maxCount = Math.max(...tags.map(t => t.count));
  
  const getTagSize = (count: number) => {
    const ratio = count / maxCount;
    return 0.75 + (ratio * 1.25); // Size between 0.75 and 2
  };

  const getTagColor = (tag: string, selected: boolean) => {
    if (selected) {
      return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/25';
    }
    
    const colors = [
      'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-blue-300',
      'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300 hover:from-green-200 hover:to-emerald-300',
      'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300 hover:from-purple-200 hover:to-purple-300',
      'bg-gradient-to-r from-pink-100 to-rose-200 text-pink-800 border-pink-300 hover:from-pink-200 hover:to-rose-300',
      'bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border-yellow-300 hover:from-yellow-200 hover:to-amber-300',
      'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300 hover:from-indigo-200 hover:to-indigo-300',
    ];
    
    const hash = tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const shuffleTags = () => {
    setShuffledTags([...tags].sort(() => Math.random() - 0.5));
  };

  const sortByPopularity = () => {
    setShuffledTags([...tags].sort((a, b) => b.count - a.count));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash size={20} className="text-indigo-500" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Explore Topics
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={shuffleTags}
            className="p-2 text-gray-500 hover:text-indigo-500 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            title="Shuffle tags"
          >
            <Shuffle size={16} />
          </motion.button>
          
          <motion.button
            onClick={sortByPopularity}
            className="p-2 text-gray-500 hover:text-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Sort by popularity"
          >
            <TrendingUp size={16} />
          </motion.button>
        </div>
      </div>

      {/* Tag Cloud */}
      <div className="relative">
        <div className="flex flex-wrap gap-3 justify-center">
          <AnimatePresence mode="popLayout">
            {shuffledTags.map(({ tag, count }, index) => {
              const selected = selectedTags.includes(tag);
              const size = getTagSize(count);
              
              return (
                <motion.button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300
                    transform-gpu hover:shadow-lg
                    ${getTagColor(tag, selected)}
                  `}
                  style={{ 
                    fontSize: `${size * 0.875}rem`,
                  }}
                  layout
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ 
                    opacity: 1, 
                    scale: selected ? 1.1 : 1,
                    rotate: 0,
                  }}
                  exit={{ opacity: 0, scale: 0, rotate: 180 }}
                  transition={{ 
                    layout: { duration: 0.3 },
                    opacity: { delay: index * 0.02 },
                    scale: { delay: index * 0.02 },
                    rotate: { delay: index * 0.02 },
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                  }}
                  whileHover={{ 
                    scale: selected ? 1.15 : 1.05,
                    rotate: [0, -1, 1, 0],
                    transition: { rotate: { duration: 0.3 } }
                  }}
                  whileTap={{ scale: selected ? 1.05 : 0.95 }}
                >
                  <span className="flex items-center gap-1">
                    {tag}
                    <span className="text-xs opacity-75">
                      {count}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Selected tags summary */}
        <AnimatePresence>
          {selectedTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
            >
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Filtering by: {selectedTags.join(', ')}
                <button
                  onClick={() => selectedTags.forEach(tag => onTagClick(tag))}
                  className="ml-2 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200 underline"
                >
                  Clear all
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}