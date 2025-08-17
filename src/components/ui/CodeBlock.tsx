import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export function CodeBlock({ code, language, className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = hljs.highlight(code, { language: language || 'javascript' }).value;

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute top-3 right-3 z-10">
        <motion.button
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </motion.button>
      </div>
      
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
}