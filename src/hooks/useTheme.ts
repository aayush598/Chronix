import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const appliedTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(appliedTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme };
}