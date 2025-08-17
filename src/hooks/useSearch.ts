import { useState, useMemo } from 'react';
import { BlogPost } from '../types/blog';

export function useSearch(posts: BlogPost[]) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery) ||
        post.excerpt.toLowerCase().includes(searchQuery) ||
        post.content.toLowerCase().includes(searchQuery) ||
        post.author.name.toLowerCase().includes(searchQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }

    return filtered;
  }, [posts, query, selectedTags]);

  const allTags = useMemo(() => {
    const tagCount = new Map<string, number>();
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCount.entries()).map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return {
    query,
    setQuery,
    selectedTags,
    toggleTag,
    filteredPosts,
    allTags,
  };
}