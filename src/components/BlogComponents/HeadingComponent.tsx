import React from 'react';

interface HeadingComponentProps {
  content: {
    level: number;
    text: string;
  };
}

export const HeadingComponent: React.FC<HeadingComponentProps> = ({ content }) => {
  const { level, text } = content;
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const baseClasses = "font-bold text-gray-900 mb-4 scroll-mt-20";
  const levelClasses = {
    1: "text-4xl mb-6",
    2: "text-3xl mb-5",
    3: "text-2xl mb-4",
    4: "text-xl mb-3",
    5: "text-lg mb-3",
    6: "text-base mb-2"
  };

  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const className = `${baseClasses} ${levelClasses[level as keyof typeof levelClasses]}`;

  return (
    <Component id={id} className={className}>
      {text}
    </Component>
  );
};