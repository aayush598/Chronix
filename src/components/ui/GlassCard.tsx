import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: boolean;
}

export function GlassCard({ children, className = '', blur = true }: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border border-white/20 
        ${blur ? 'backdrop-blur-md bg-white/10 dark:bg-gray-900/10' : 'bg-white/5 dark:bg-gray-900/5'}
        shadow-xl shadow-black/5
        ${className}
      `}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}