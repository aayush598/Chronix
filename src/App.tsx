import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedBlogHeader } from './components/blog/EnhancedBlogHeader';
import { EnhancedBlogCard } from './components/blog/EnhancedBlogCard';
import { BlogPost } from './components/blog/BlogPost';
import { EnhancedTagCloud } from './components/ui/EnhancedTagCloud';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { FloatingElements } from './components/ui/FloatingElements';
import { GlassCard } from './components/ui/GlassCard';
import { MorphingBlob } from './components/ui/MorphingBlob';
import { samplePosts } from './data/samplePosts';
import { useSearch } from './hooks/useSearch';
import { BlogPost as BlogPostType } from './types/blog';

function App() {
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null);
  const { query, setQuery, selectedTags, toggleTag, filteredPosts, allTags } = useSearch(samplePosts);

  if (selectedPost) {
    return (
      <BlogPost 
        post={selectedPost} 
        onBack={() => setSelectedPost(null)} 
      />
    );
  }

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ParticleBackground />
      <FloatingElements />
      
      <EnhancedBlogHeader 
        searchQuery={query}
        onSearchChange={setQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Modern Web Development
          </motion.h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover the latest trends, techniques, and best practices in web development. 
            From React and TypeScript to AI and performance optimization.
          </p>
          
          {/* Tag Cloud */}
          {allTags.length > 0 && (
            <GlassCard className="p-8 mb-12">
              <EnhancedTagCloud
                tags={allTags}
                selectedTags={selectedTags}
                onTagClick={toggleTag}
              />
            </GlassCard>
          )}
          
          {/* Decorative blobs */}
          <div className="absolute top-20 left-10 w-32 h-32 opacity-30">
            <MorphingBlob color="#6366f1" />
          </div>
          <div className="absolute top-40 right-20 w-24 h-24 opacity-20">
            <MorphingBlob color="#8b5cf6" />
          </div>
        </motion.section>

        {/* Results Info */}
        {(query || selectedTags.length > 0) && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-indigo-800 dark:text-indigo-200 font-medium">
                  {filteredPosts.length === 0 
                    ? 'No articles found matching your criteria.' 
                    : `Found ${filteredPosts.length} article${filteredPosts.length === 1 ? '' : 's'}`
                  }
                  {query && ` for "${query}"`}
                  {selectedTags.length > 0 && ` tagged with ${selectedTags.join(', ')}`}
                </p>
                {(query || selectedTags.length > 0) && (
                  <motion.button
                    onClick={() => {
                      setQuery('');
                      selectedTags.forEach(tag => toggleTag(tag));
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear filters
                  </motion.button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && !query && selectedTags.length === 0 && (
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
              Featured Articles
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatePresence>
                {featuredPosts.map((post, index) => (
                  <EnhancedBlogCard
                    key={post.id}
                    post={post}
                    featured
                    onClick={() => setSelectedPost(post)}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* All Posts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            {(query || selectedTags.length > 0) ? 'Search Results' : 'Latest Articles'}
          </h3>
          
          {filteredPosts.length === 0 ? (
            <GlassCard className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 opacity-50">
                  <MorphingBlob color="#6366f1" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                  No articles found matching your search.
                </p>
                <motion.button
                  onClick={() => {
                    setQuery('');
                    selectedTags.forEach(tag => toggleTag(tag));
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View all articles
                </motion.button>
              </motion.div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.1,
                      layout: { duration: 0.3 }
                    }}
                  >
                    <EnhancedBlogCard
                      post={post}
                      onClick={() => setSelectedPost(post)}
                      index={index}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10" />
        <div className="absolute top-0 left-1/4 w-32 h-32 opacity-20">
          <MorphingBlob color="#6366f1" />
        </div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 opacity-15">
          <MorphingBlob color="#8b5cf6" />
        </div>
        
        <GlassCard className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.h4 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Stay Updated
            </motion.h4>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Subscribe to get the latest articles delivered directly to your inbox.
            </motion.p>
            <motion.div 
              className="flex max-w-md mx-auto gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
              <motion.button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.div>
            <motion.p 
              className="text-sm text-gray-500 dark:text-gray-400 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              © 2025 DevBlog. Made with React and modern web technologies.
            </motion.p>
          </div>
        </div>
        </GlassCard>
      </footer>
    </div>
  );
}

export default App;