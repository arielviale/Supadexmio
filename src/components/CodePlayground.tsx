import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface CodePlaygroundProps {
  code: string;
  language?: 'typescript' | 'javascript' | 'sql' | 'bash';
}

export function CodePlayground({ code, language = 'typescript' }: CodePlaygroundProps) {
  const [copied, setCopied] = useState(false);

  const highlightedCode = hljs.highlight(code, { 
    language: language,
    ignoreIllegals: true 
  }).value;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/40 text-xs font-mono font-bold uppercase tracking-widest">
          <Code2 size={14} />
          <span>{language}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="relative text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5"
              >
                <Check size={16} className="text-supabase-green" />
                <span className="text-supabase-green">Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5"
              >
                <Copy size={16} />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="bg-supabase-black rounded-xl p-6 border border-white/10 font-mono text-sm overflow-x-auto">
        <pre>
          <code 
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className="whitespace-pre-wrap break-words"
          />
        </pre>
      </div>
    </div>
  );
}
