import { BlogAuthor } from '../types/blog';

export const authors: Record<string, BlogAuthor> = {
  aayush: {
    id: 'aayush',
    name: 'Aayush Gid',
    bio: 'Frontend architect with 8+ years of experience in React, TypeScript, and modern web technologies.',
    avatar: '../src/assets/images/aayushgid.png',
    socialLinks: {
      twitter: 'https://x.com/AayushGid598',
      linkedin: 'https://www.linkedin.com/in/aayush-gid-3767a2221/',
      github: 'https://github.com/aayush598',
      website: 'https://aayushgid.vercel.app/'
    }
  },
  john: {
    id: 'john',
    name: 'John Smith',
    bio: 'Frontend architect with 8+ years of experience in React, TypeScript, and modern web technologies.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    socialLinks: {
      twitter: 'https://twitter.com/johnsmith',
      linkedin: 'https://linkedin.com/in/johnsmith',
      github: 'https://github.com/johnsmith',
      website: 'https://johnsmith.dev'
    }
  },
  sarah: {
    id: 'sarah',
    name: 'Sarah Johnson',
    bio: 'UI/UX Designer and Frontend Developer passionate about creating beautiful, accessible web experiences.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    socialLinks: {
      twitter: 'https://twitter.com/sarahj',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      github: 'https://github.com/sarahj'
    }
  },
  mike: {
    id: 'mike',
    name: 'Mike Chen',
    bio: 'Full-stack developer specializing in performance optimization and scalable web applications.',
    avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    socialLinks: {
      github: 'https://github.com/mikechen',
      linkedin: 'https://linkedin.com/in/mikechen',
      website: 'https://mikechen.dev'
    }
  }
};