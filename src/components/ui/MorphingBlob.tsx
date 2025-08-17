import React from 'react';
import { motion } from 'framer-motion';

interface MorphingBlobProps {
  className?: string;
  color?: string;
}

export function MorphingBlob({ className = '', color = '#6366f1' }: MorphingBlobProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 0.8, 1.1, 1],
          rotate: [0, 90, 180, 270, 360],
          borderRadius: ['50%', '40%', '60%', '30%', '50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-2 rounded-full opacity-30 blur-lg"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1.1, 0.9, 1.3, 0.8, 1.1],
          rotate: [360, 270, 180, 90, 0],
          borderRadius: ['60%', '50%', '40%', '70%', '60%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}