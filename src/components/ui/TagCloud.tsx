import React from 'react';
import { motion } from 'framer-motion';

interface Tag {
  tag: string;
  count: number;
}

interface TagCloudProps {
  tags: Tag[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  className?: string;
}

export function TagCloud({ tags, selectedTags, onTagClick, className = '' }: TagCloudProps) {
  const maxCount = Math.max(...tags.map(t => t.count));
  
  const getTagSize = (count: number) => {
    const ratio = count / maxCount;
    return 0.75 + (ratio * 0.75); // Size between 0.75 and 1.5
  };

  const getTagColor = (tag: string, selected: boolean) => {
    if (selected) return 'bg-indigo-500 text-white border-indigo-500';
    
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
      'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
      'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
      'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
    ];
    
    const hash = tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(({ tag, count }, index) => {
        const selected = selectedTags.includes(tag);
        const size = getTagSize(count);
        
        return (
          <motion.button
            key={tag}
            onClick={() => onTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200 ${getTagColor(tag, selected)}`}
            style={{ 
              fontSize: `${size}rem`,
              transform: selected ? 'scale(1.1)' : 'scale(1)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: selected ? 1.1 : 1,
            }}
            transition={{ 
              delay: index * 0.05,
              type: 'spring',
              stiffness: 500,
              damping: 30
            }}
            whileHover={{ scale: selected ? 1.15 : 1.05 }}
            whileTap={{ scale: selected ? 1.05 : 0.95 }}
          >
            {tag} ({count})
          </motion.button>
        );
      })}
    </div>
  );
}