import React from 'react';

interface ListComponentProps {
  content: {
    type: 'ordered' | 'unordered';
    items: string[];
  };
}

export const ListComponent: React.FC<ListComponentProps> = ({ content }) => {
  const { type, items } = content;
  const Component = type === 'ordered' ? 'ol' : 'ul';
  
  return (
    <div className="my-6">
      <Component className={`space-y-2 text-gray-700 text-lg ${
        type === 'ordered' 
          ? 'list-decimal list-inside' 
          : 'list-disc list-inside'
      }`}>
        {items.map((item, index) => (
          <li key={index} className="leading-relaxed">
            {item}
          </li>
        ))}
      </Component>
    </div>
  );
};