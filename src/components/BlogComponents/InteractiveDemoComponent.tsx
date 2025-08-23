import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface InteractiveDemoComponentProps {
  content: {
    title: string;
    description: string;
  };
}

export const InteractiveDemoComponent: React.FC<InteractiveDemoComponentProps> = ({ content }) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setCount(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="my-8 bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-xl">
      <div className="bg-white rounded-lg p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h4>
        <p className="text-gray-600 mb-6">{content.description}</p>
        
        <div className="flex items-center justify-center space-x-6">
          <div className={`text-4xl font-bold text-blue-600 transition-transform duration-300 ${
            isAnimating ? 'scale-125' : 'scale-100'
          }`}>
            {count}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleClick}
              className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Play size={16} />
              <span>Click Me!</span>
            </button>
            
            <button
              onClick={reset}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};