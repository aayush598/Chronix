import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Tag, Star } from 'lucide-react';
import { Blog } from '../types/blog';
import { SearchAndFilter } from './SearchAndFilter';

interface BlogListProps {
  blogs: Blog[];
  onBlogClick: (blogId: string) => void;
}

export const BlogList: React.FC<BlogListProps> = ({ blogs, onBlogClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    blogs.forEach(blog => blog.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => blog.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [blogs, searchTerm, selectedTags]);

  const featuredBlogs = filteredBlogs.filter(blog => blog.featured);
  const regularBlogs = filteredBlogs.filter(blog => !blog.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const BlogCard: React.FC<{ blog: Blog; featured?: boolean }> = ({ blog, featured = false }) => (
    <article 
      className={`group cursor-pointer ${
        featured 
          ? 'bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200' 
          : 'bg-white border border-gray-200'
      } rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}
      onClick={() => onBlogClick(blog.id)}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={blog.coverImage} 
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{blog.readingTime} min read</span>
            </div>
          </div>
          {featured && (
            <div className="flex items-center space-x-1 text-blue-600">
              <Star size={16} fill="currentColor" />
              <span className="text-xs font-medium">Featured</span>
            </div>
          )}
        </div>

        <h2 className={`${
          featured ? 'text-2xl' : 'text-xl'
        } font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200`}>
          {blog.title}
        </h2>
        
        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <img 
            src={blog.author.avatar} 
            alt={blog.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-1">
              <User size={14} className="text-gray-400" />
              <span className="font-medium text-gray-900 text-sm">{blog.author.name}</span>
            </div>
            <span className="text-xs text-gray-600">{blog.author.bio.substring(0, 50)}...</span>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chronix Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the latest insights, tutorials, and trends in development, design, and technology.
          </p>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          availableTags={availableTags}
        />

        {/* Results Info */}
        <div className="mb-8">
          <p className="text-gray-600">
            {filteredBlogs.length === blogs.length 
              ? `Showing all ${blogs.length} blogs`
              : `Showing ${filteredBlogs.length} of ${blogs.length} blogs`
            }
          </p>
        </div>

        {/* Featured Blogs */}
        {featuredBlogs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <Star className="text-blue-600 mr-2" fill="currentColor" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} featured />
              ))}
            </div>
          </section>
        )}

        {/* Regular Blogs */}
        {regularBlogs.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">All Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};