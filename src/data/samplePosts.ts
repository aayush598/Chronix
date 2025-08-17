import { BlogPost } from '../types/blog';

export const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Interactive Web Applications with React and Modern Tools',
    slug: 'building-interactive-web-applications-react',
    excerpt: 'Explore the latest techniques for creating engaging, interactive web applications using React, TypeScript, and modern development tools.',
    content: `# Building Interactive Web Applications with React and Modern Tools

## Introduction

Modern web development has evolved dramatically over the past few years. Today, we have access to powerful tools and libraries that enable us to build sophisticated, interactive applications that provide exceptional user experiences.

## The Modern React Ecosystem

React has become the foundation for countless applications, but it's the ecosystem around it that truly makes it powerful:

### Core Technologies
- **TypeScript**: Provides type safety and better developer experience
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

### State Management
Modern state management has evolved beyond Redux:

\`\`\`typescript
// Using React's built-in state with custom hooks
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}
\`\`\`

## Interactive Components

Creating interactive components is where React truly shines. Here's an example of a sophisticated interactive component:

\`\`\`jsx
function InteractiveChart({ data }) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="relative w-full h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {data.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={selectedPoint === index ? 8 : 4}
            fill={selectedPoint === index ? '#6366f1' : '#94a3b8'}
            className="transition-all duration-300 cursor-pointer hover:r-6"
            onClick={() => setSelectedPoint(index)}
          />
        ))}
      </svg>
    </div>
  );
}
\`\`\`

## Performance Optimization

Modern React applications require careful attention to performance:

1. **Code Splitting**: Use dynamic imports to split your bundle
2. **Memoization**: Leverage React.memo and useMemo strategically  
3. **Lazy Loading**: Load components and images on demand
4. **Virtual Scrolling**: Handle large lists efficiently

## Conclusion

Building modern web applications requires a combination of the right tools, patterns, and performance considerations. By leveraging React's ecosystem and following best practices, we can create applications that are both powerful and maintainable.

The key is to stay updated with the latest developments while maintaining focus on user experience and code quality.`,
    author: {
      name: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      bio: 'Full-stack developer passionate about modern web technologies and user experience design.'
    },
    publishedAt: '2025-01-15T10:00:00Z',
    readingTime: 8,
    tags: ['React', 'TypeScript', 'Web Development', 'Frontend', 'Performance'],
    featured: true,
    views: 1542,
    likes: 89,
    coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    seo: {
      metaTitle: 'Building Interactive Web Applications with React - Modern Development Guide',
      metaDescription: 'Learn how to build engaging, interactive web applications using React, TypeScript, and modern development tools.',
      keywords: ['React', 'TypeScript', 'Web Development', 'Interactive UI', 'Frontend']
    }
  },
  {
    id: '2',
    title: 'The Future of AI in Web Development: Tools and Techniques for 2025',
    slug: 'future-ai-web-development-2025',
    excerpt: 'Discover how artificial intelligence is revolutionizing web development, from automated code generation to intelligent user experiences.',
    content: `# The Future of AI in Web Development: Tools and Techniques for 2025

## The AI Revolution in Development

Artificial Intelligence is no longer just a buzzword in web development—it's becoming an integral part of how we build, optimize, and maintain web applications. From code generation to user experience personalization, AI is transforming every aspect of the development lifecycle.

## AI-Powered Development Tools

### Code Generation and Assistance
Modern AI tools are becoming increasingly sophisticated in understanding context and generating meaningful code:

\`\`\`python
# AI-generated Python function for data processing
def process_user_analytics(data):
    """
    Process user analytics data with AI-powered insights
    """
    import pandas as pd
    from sklearn.preprocessing import StandardScaler
    
    df = pd.DataFrame(data)
    
    # Normalize numerical features
    scaler = StandardScaler()
    numerical_cols = df.select_dtypes(include=['float64', 'int64']).columns
    df[numerical_cols] = scaler.fit_transform(df[numerical_cols])
    
    # Generate insights
    insights = {
        'user_engagement': df['session_duration'].mean(),
        'conversion_rate': df['converted'].sum() / len(df),
        'top_features': df.corr()['converted'].abs().nlargest(5).to_dict()
    }
    
    return insights
\`\`\`

### Intelligent Testing
AI can help generate comprehensive test suites:

\`\`\`javascript
// AI-suggested test cases for a React component
describe('UserProfile Component', () => {
  it('should render user information correctly', () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg'
    };
    
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should handle loading state appropriately', () => {
    render(<UserProfile user={null} loading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
\`\`\`

## Personalized User Experiences

AI enables us to create adaptive interfaces that learn from user behavior:

### Smart Content Recommendations
\`\`\`typescript
interface UserPreferences {
  topics: string[];
  readingTime: number;
  engagement: number;
}

function getPersonalizedContent(
  user: UserPreferences,
  availableContent: BlogPost[]
): BlogPost[] {
  // AI-powered content scoring algorithm
  return availableContent
    .map(post => ({
      ...post,
      relevanceScore: calculateRelevance(post, user)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10);
}
\`\`\`

## Performance Optimization with AI

AI can help optimize web applications automatically:

### Intelligent Bundling
- Predictive preloading based on user navigation patterns
- Dynamic code splitting using machine learning
- Automated performance monitoring and optimization suggestions

### Smart Caching Strategies
AI algorithms can predict which resources users are likely to need and cache them proactively.

## Accessibility and AI

AI is making web accessibility better than ever:

1. **Automatic Alt Text Generation**: AI can generate descriptive alt text for images
2. **Real-time Captioning**: Voice-to-text AI for video content
3. **Layout Adaptation**: AI that adapts interfaces for users with disabilities

## The Challenges Ahead

While AI brings tremendous opportunities, it also presents challenges:

- **Data Privacy**: Ensuring user data is handled responsibly
- **Bias Prevention**: Making sure AI systems are fair and inclusive
- **Performance Impact**: Balancing AI features with application speed
- **Human Oversight**: Maintaining the human element in design decisions

## Getting Started with AI in Your Projects

### Essential Tools for 2025:
1. **GitHub Copilot**: AI pair programmer
2. **Vercel AI SDK**: Building AI-powered applications
3. **OpenAI API**: Integrating language models
4. **TensorFlow.js**: Client-side machine learning

### Best Practices:
- Start small with specific use cases
- Focus on user value, not just cool technology
- Implement proper monitoring and fallbacks
- Consider ethical implications from the beginning

## Conclusion

The integration of AI in web development is not just about automation—it's about creating more intelligent, adaptive, and user-centric applications. As we move through 2025, developers who embrace these technologies while maintaining focus on user experience and ethical considerations will be best positioned for success.

The future of web development is intelligent, personalized, and more accessible than ever before.`,
    author: {
      name: 'Sarah Rodriguez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      bio: 'AI researcher and web developer exploring the intersection of artificial intelligence and user experience.'
    },
    publishedAt: '2025-01-12T14:30:00Z',
    readingTime: 12,
    tags: ['AI', 'Machine Learning', 'Web Development', 'Future Tech', 'UX'],
    featured: true,
    views: 2108,
    likes: 156,
    coverImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    seo: {
      metaTitle: 'The Future of AI in Web Development - 2025 Trends and Tools',
      metaDescription: 'Explore how AI is revolutionizing web development with automated code generation, intelligent UX, and performance optimization.',
      keywords: ['AI', 'Web Development', 'Machine Learning', 'Automation', '2025 Trends']
    }
  },
  {
    id: '3',
    title: 'Mastering Modern CSS: Advanced Techniques for Beautiful Web Design',
    slug: 'mastering-modern-css-advanced-techniques',
    excerpt: 'Dive deep into modern CSS features like Grid, Flexbox, Custom Properties, and the latest layout techniques that will elevate your designs.',
    content: `# Mastering Modern CSS: Advanced Techniques for Beautiful Web Design

## Introduction

CSS has evolved tremendously over the past few years. Modern CSS gives us unprecedented control over layout, animations, and visual effects. Let's explore the advanced techniques that will make your designs stand out in 2025.

## CSS Grid: The Ultimate Layout System

CSS Grid has revolutionized how we approach web layouts:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
  grid-auto-rows: minmax(200px, auto);
}

.featured-item {
  grid-column: span 2;
  grid-row: span 2;
}

/* Responsive grid without media queries */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\`

## Custom Properties: Dynamic Theming

CSS Custom Properties (CSS Variables) enable powerful theming systems:

\`\`\`css
:root {
  --color-primary: hsl(220, 90%, 60%);
  --color-secondary: hsl(280, 70%, 65%);
  --spacing-unit: 1rem;
  --border-radius: 0.5rem;
  
  /* Semantic color system */
  --color-text: hsl(220, 15%, 20%);
  --color-background: hsl(220, 15%, 98%);
  --color-surface: hsl(220, 15%, 96%);
}

[data-theme="dark"] {
  --color-text: hsl(220, 15%, 85%);
  --color-background: hsl(220, 15%, 8%);
  --color-surface: hsl(220, 15%, 12%);
}

.card {
  background: var(--color-surface);
  color: var(--color-text);
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
  
  /* Dynamic spacing based on context */
  margin-block: clamp(1rem, 5vw, 3rem);
}
\`\`\`

## Advanced Animations and Transitions

Modern CSS animations can create engaging micro-interactions:

\`\`\`css
/* Smooth hover effects */
.interactive-card {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.interactive-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
}

/* Loading animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
\`\`\`

## Container Queries: Context-Aware Styling

Container queries allow components to adapt based on their container size:

\`\`\`css
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

/* When container is wider than 400px */
@container card (min-width: 400px) {
  .card-content {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
  
  .card-image {
    width: 150px;
    height: 150px;
  }
}
\`\`\`

## Modern Typography Techniques

Typography is crucial for great design:

\`\`\`css
/* Fluid typography */
.heading {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.025em;
}

/* Variable fonts */
.variable-font {
  font-family: 'Inter Variable', sans-serif;
  font-variation-settings: 'wght' 400, 'slnt' 0;
  transition: font-variation-settings 0.3s ease;
}

.variable-font:hover {
  font-variation-settings: 'wght' 600, 'slnt' -10;
}

/* Text effects */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
\`\`\`

## Advanced Layout Techniques

Combining modern CSS features for complex layouts:

\`\`\`css
/* Holy Grail layout with CSS Grid */
.page-layout {
  display: grid;
  grid-template:
    "header header header" auto
    "nav main aside" 1fr
    "footer footer footer" auto
    / 200px 1fr 200px;
  min-height: 100vh;
  gap: 1rem;
}

/* Responsive sidebar */
@media (max-width: 768px) {
  .page-layout {
    grid-template:
      "header" auto
      "nav" auto
      "main" 1fr
      "aside" auto
      "footer" auto
      / 1fr;
  }
}

/* Masonry-like layout */
.masonry-grid {
  columns: 3;
  column-gap: 1rem;
  column-fill: balance;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}
\`\`\`

## Performance Optimization

CSS performance best practices:

\`\`\`css
/* Use contain for performance */
.isolated-component {
  contain: layout style paint;
}

/* Efficient animations */
.smooth-animation {
  /* Only animate transform and opacity for 60fps */
  transform: translateX(0);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.3s ease;
  will-change: transform, opacity;
}

/* Critical CSS inlining */
.above-fold {
  /* Critical styles that should be inlined */
  display: block;
  font-family: system-ui, -apple-system, sans-serif;
}
\`\`\`

## Future CSS Features

Exciting features coming to CSS:

### CSS Nesting
\`\`\`css
.component {
  background: white;
  padding: 1rem;
  
  & .title {
    font-size: 1.5rem;
    color: #333;
    
    &:hover {
      color: #666;
    }
  }
  
  & .content {
    margin-top: 1rem;
  }
}
\`\`\`

### CSS Layers
\`\`\`css
@layer reset, base, components, utilities;

@layer reset {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

@layer components {
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
  }
}
\`\`\`

## Conclusion

Modern CSS provides incredible power for creating beautiful, responsive, and performant web designs. By mastering these techniques—Grid, Custom Properties, Container Queries, and advanced animations—you can create designs that truly stand out.

The key is to use these features thoughtfully, always considering performance and accessibility alongside visual appeal.`,
    author: {
      name: 'Marcus Thompson',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      bio: 'UI/UX designer and CSS specialist with a passion for creating beautiful, accessible web experiences.'
    },
    publishedAt: '2025-01-10T09:15:00Z',
    readingTime: 10,
    tags: ['CSS', 'Web Design', 'Frontend', 'Layout', 'Animation'],
    featured: false,
    views: 1876,
    likes: 124,
    coverImage: 'https://images.pexels.com/photos/6476595/pexels-photo-6476595.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    seo: {
      metaTitle: 'Mastering Modern CSS - Advanced Techniques for Beautiful Web Design',
      metaDescription: 'Learn advanced CSS techniques including Grid, Custom Properties, Container Queries, and modern animation methods.',
      keywords: ['CSS', 'Web Design', 'Grid', 'Flexbox', 'Custom Properties', 'Animation']
    }
  }
];