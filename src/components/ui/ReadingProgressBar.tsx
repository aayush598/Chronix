import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { ReadingProgress } from '../../types/blog';

interface ReadingProgressBarProps {
  progress: ReadingProgress;
  className?: string;
}

export function ReadingProgressBar({ progress, className = '' }: ReadingProgressBarProps) {
  return (
    <>
      {/* Fixed progress bar at top */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-50 ${className}`}
        style={{ scaleX: progress.progress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress.progress / 100 }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      />
      
      {/* Progress indicator */}
      {progress.progress > 5 && (
        <motion.div
          className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 z-40 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
        >
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-indigo-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {progress.estimatedTimeLeft > 0 ? `${progress.estimatedTimeLeft} min` : 'Done!'}
            </span>
            <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}