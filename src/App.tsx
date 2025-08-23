import React, { useState, useEffect } from 'react';
import { BlogList } from './components/BlogList';
import { BlogPost } from './components/BlogPost';
import { blogs } from './data';
import { Blog } from './types/blog';

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'post'>('list');
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);

  useEffect(() => {
    // Simple path-based routing
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '');
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

    handleRouteChange(); // Check initial path
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleBlogClick = (blogId: string) => {
    const blog = blogs.find(b => b.id === blogId);
    if (blog) {
      window.history.pushState({}, '', `/blog/${blog.slug}`);
      setCurrentBlog(blog);
      setCurrentView('post');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('list');
    setCurrentBlog(null);
  };

  if (currentView === 'post' && currentBlog) {
    return <BlogPost blog={currentBlog} onBack={handleBack} />;
  }

  return <BlogList blogs={blogs} onBlogClick={handleBlogClick} />;
}

export default App;
