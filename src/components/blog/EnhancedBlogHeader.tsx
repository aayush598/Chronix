import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Pen, Rss, Menu, X, Sparkles, Zap } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { AdvancedSearchBar } from '../ui/AdvancedSearchBar';
import { GlassCard } from '../ui/GlassCard';

interface EnhancedBlogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function EnhancedBlogHeader({ searchQuery, onSearchChange }: EnhancedBlogHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 20]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50"
        style={{ 
          backdropFilter: `blur(${headerBlur}px)`,
        }}
      >
        <motion.div
          className="bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/20"
          style={{ opacity: headerOpacity }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <motion.div 
                className="flex items-center gap-3"
                style={{ scale: logoScale }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-75"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-xl">
                    <Pen size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <motion.h1 
                    className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    DevBlog
                  </motion.h1>
                  <motion.p 
                    className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Sparkles size={10} />
                    Modern Web Development
                  </motion.p>
                </div>
              </motion.div>

              {/* Desktop Search */}
              <div className="hidden md:block flex-1 max-w-2xl mx-8">
                <AdvancedSearchBar
                  query={searchQuery}
                  onQueryChange={onSearchChange}
                />
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-4">
                <motion.button
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  whileHover={{ scale: 1.05, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                  title="RSS Feed"
                >
                  <Rss size={20} />
                </motion.button>

                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap size={16} />
                  Subscribe
                </motion.button>

                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 text-gray-600 dark:text-gray-400"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: isMenuOpen ? 1 : 0 }}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
        <motion.div
          className="absolute top-16 left-4 right-4"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0,
            y: isMenuOpen ? 0 : -20,
            scale: isMenuOpen ? 1 : 0.95
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <GlassCard className="p-6 space-y-6">
            {/* Mobile Search */}
            <AdvancedSearchBar
              query={searchQuery}
              onQueryChange={onSearchChange}
            />

            {/* Mobile Actions */}
            <div className="flex items-center justify-between">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rss size={18} />
                RSS Feed
              </motion.button>

              <ThemeToggle />
            </div>

            <motion.button
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap size={18} />
              Subscribe to Newsletter
            </motion.button>
          </GlassCard>
        </motion.div>
      </motion.div>
    </>
  );
}