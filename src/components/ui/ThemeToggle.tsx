import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          onClick={() => setTheme(value as any)}
          className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            theme === value
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === value && (
            <motion.div
              className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md"
              layoutId="theme-bg"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <div className="relative flex items-center gap-1">
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}