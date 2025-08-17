import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X } from 'lucide-react';
import { TableOfContentsItem } from '../../types/blog';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  className?: string;
}

export function TableOfContents({ items, className = '' }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop TOC */}
      <motion.div
        className={`hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 w-64 ${className}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Table of Contents
          </h3>
          <nav>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className={`block text-left w-full text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                      activeId === item.id
                        ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400'
                    } ${item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-4' : 'pl-6'}`}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>

      {/* Mobile TOC Toggle */}
      <motion.button
        className="lg:hidden fixed bottom-20 right-6 bg-indigo-500 text-white p-3 rounded-full shadow-lg z-40"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={20} /> : <List size={20} />}
      </motion.button>

      {/* Mobile TOC Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-lg shadow-xl z-50 max-h-80 overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Table of Contents
                </h3>
                <nav>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToHeading(item.id)}
                          className={`block text-left w-full transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                            activeId === item.id
                              ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300'
                          } ${item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-4' : 'pl-6'}`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}