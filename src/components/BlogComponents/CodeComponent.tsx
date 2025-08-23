import React from 'react';

interface CodeComponentProps {
  content: {
    language: string;
    code: string;
  };
}

export const CodeComponent: React.FC<CodeComponentProps> = ({ content }) => {
  const { language, code } = content;

  return (
    <div className="my-8">
      <div className="bg-gray-900 rounded-t-lg px-4 py-2 border-b border-gray-700">
        <span className="text-gray-400 text-sm font-mono">{language}</span>
      </div>
      <pre className="bg-gray-800 text-gray-100 p-6 rounded-b-lg overflow-x-auto">
        <code className="text-sm leading-relaxed">{code}</code>
      </pre>
    </div>
  );
};