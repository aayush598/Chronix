import { Blog } from '../../types/blog';
import { authors } from '../authors';

export const modernCssBeautifulUiDesign: Blog = {
  id: '2',
  title: 'Modern CSS Techniques for Beautiful UI Design',
  slug: 'modern-css-beautiful-ui-design',
  excerpt: 'Explore cutting-edge CSS features and techniques to create stunning, responsive user interfaces that delight users.',
  content: [
    {
      id: '1',
      type: 'heading',
      content: { level: 2, text: 'The Evolution of CSS' }
    },
    {
      id: '2',
      type: 'text',
      content: 'CSS has evolved tremendously in recent years, introducing powerful features that enable developers to create sophisticated designs without relying heavily on JavaScript. From CSS Grid and Flexbox to custom properties and container queries, modern CSS provides unprecedented control over layout and styling.'
    },
    {
      id: '3',
      type: 'heading',
      content: { level: 2, text: 'Glass Morphism Effects' }
    },
    {
      id: '4',
      type: 'text',
      content: 'Glass morphism has become one of the most popular design trends, creating elegant, translucent interfaces that feel modern and sophisticated. This technique combines backdrop filters with subtle borders and shadows to achieve a frosted glass effect.'
    },
    {
      id: '5',
      type: 'code',
      content: {
        language: 'css',
        code: `.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
}`
      }
    },
    {
      id: '6',
      type: 'callout',
      content: {
        type: 'warning',
        title: 'Browser Support',
        message: 'Backdrop filter is not supported in all browsers. Always provide fallbacks for critical design elements.'
      }
    },
    {
      id: '7',
      type: 'heading',
      content: { level: 2, text: 'Advanced Grid Layouts' }
    },
    {
      id: '8',
      type: 'text',
      content: 'CSS Grid has revolutionized how we approach layout design. Unlike Flexbox, which is one-dimensional, Grid allows for complex two-dimensional layouts with precise control over both rows and columns.'
    },
    {
      id: '9',
      type: 'code',
      content: {
        language: 'css',
        code: `.advanced-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: masonry; /* Future CSS feature */
  gap: 2rem;
  padding: 2rem;
}

.grid-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: scale(1.05);
}`
      }
    },
    {
      id: '10',
      type: 'quote',
      content: {
        text: 'Good design is not about making things look pretty. It\'s about making things work beautifully.',
        author: 'Design Philosophy'
      }
    },
    {
      id: '11',
      type: 'heading',
      content: { level: 2, text: 'Container Queries: The Future of Responsive Design' }
    },
    {
      id: '12',
      type: 'text',
      content: 'Container queries represent a paradigm shift in responsive design. Instead of responding to viewport size, components can now respond to their container size, enabling truly modular and reusable components.'
    },
    {
      id: '13',
      type: 'code',
      content: {
        language: 'css',
        code: `.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
    padding: 2rem;
  }
  
  .card-image {
    aspect-ratio: 1;
    border-radius: 8px;
  }
}`
      }
    },
    {
      id: '14',
      type: 'callout',
      content: {
        type: 'info',
        title: 'Browser Support',
        message: 'Container queries are now supported in all modern browsers as of 2023. Check caniuse.com for the latest compatibility information.'
      }
    }
  ],
  author: authors.sarah,
  publishedAt: '2025-01-12T09:15:00Z',
  updatedAt: '2025-01-13T16:45:00Z',
  readingTime: 6,
  tags: ['CSS', 'Design', 'UI/UX', 'Web Design'],
  coverImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop',
  featured: true
};