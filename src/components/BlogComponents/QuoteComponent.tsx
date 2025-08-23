import React from 'react';
import { Quote } from 'lucide-react';

interface QuoteComponentProps {
  content: {
    text: string;
    author?: string;
  };
}

export const QuoteComponent: React.FC<QuoteComponentProps> = ({ content }) => {
  const { text, author } = content;

  return (
    <div className="my-8 relative">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <Quote className="text-blue-500 mb-4" size={24} />
        <blockquote className="text-gray-800 text-lg italic leading-relaxed mb-4">
          "{text}"
        </blockquote>
        {author && (
          <cite className="text-gray-600 font-medium">— {author}</cite>
        )}
      </div>
    </div>
  );
};