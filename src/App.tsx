import React, { useState, useEffect } from 'react';
import { BlogList } from './components/BlogList';
import { BlogPost } from './components/BlogPost';
import { blogs } from './data';
import { Blog } from './types/blog';

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'post'>('list');
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);

  useEffect(() => {
    // Simple hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/')) {
        const slug = hash.replace('#/blog/', '');
        const blog = blogs.find(b => b.slug === slug);
        if (blog) {
          setCurrentBlog(blog);
          setCurrentView('post');
        } else {
          setCurrentView('list');
          setCurrentBlog(null);
        }
      } else {
        setCurrentView('list');
        setCurrentBlog(null);
      }
    };

    handleHashChange(); // Check initial hash
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleBlogClick = (blogId: string) => {
    const blog = blogs.find(b => b.id === blogId);
    if (blog) {
      window.location.hash = `/blog/${blog.slug}`;
    }
  };

  const handleBack = () => {
    window.location.hash = '';
  };

  if (currentView === 'post' && currentBlog) {
    return <BlogPost blog={currentBlog} onBack={handleBack} />;
  }

  return <BlogList blogs={blogs} onBlogClick={handleBlogClick} />;
}

export default App;