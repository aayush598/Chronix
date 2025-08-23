import React from 'react';

interface TextComponentProps {
  content: string;
}

export const TextComponent: React.FC<TextComponentProps> = ({ content }) => {
  return (
    <p className="text-gray-700 text-lg leading-relaxed mb-6">
      {content}
    </p>
  );
};