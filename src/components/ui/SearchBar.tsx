import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  query, 
  onQueryChange, 
  placeholder = 'Search articles...', 
  className = '' 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
        />
        <motion.input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border rounded-lg 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all
            ${isFocused 
              ? 'border-indigo-500 shadow-lg' 
              : 'border-gray-300 dark:border-gray-600'
            }`}
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused 
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' 
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => onQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Search suggestions or results count */}
      <AnimatePresence>
        {isFocused && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-2 z-10"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 px-2 py-1">
              Press Enter to search for "{query}"
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}