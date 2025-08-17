import { useState, useEffect } from 'react';
import { ReadingProgress } from '../types/blog';

export function useReadingProgress(contentRef: React.RefObject<HTMLElement>, totalWords: number) {
  const [progress, setProgress] = useState<ReadingProgress>({
    progress: 0,
    estimatedTimeLeft: 0,
    wordsRead: 0,
    totalWords,
  });

  useEffect(() => {
    const updateProgress = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const scrollTop = window.scrollY;
      const scrollHeight = element.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollTop / scrollHeight, 1);

      const wordsRead = Math.floor(totalWords * scrollProgress);
      const estimatedTimeLeft = Math.ceil((totalWords - wordsRead) / 200); // 200 WPM average

      setProgress({
        progress: scrollProgress * 100,
        estimatedTimeLeft,
        wordsRead,
        totalWords,
      });
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, [contentRef, totalWords]);

  return progress;
}