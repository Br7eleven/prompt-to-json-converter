import React, { useState, useCallback, useEffect } from 'react';
import { LoaderIcon } from './icons/LoaderIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DocumentCopyIcon } from './icons/DocumentCopyIcon';
import { TrashIcon } from './icons/TrashIcon';

interface OutputAreaProps {
  prompt: string;
  isLoading?: boolean;
  onClearAll: () => void;
}

const OutputArea: React.FC<OutputAreaProps> = ({ prompt, isLoading = false, onClearAll }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    if (!prompt || isLoading) return;
    navigator.clipboard.writeText(prompt).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  }, [prompt, isLoading]);
  
  useEffect(() => {
    setIsCopied(false);
  }, [prompt]);

  const placeholderText = isLoading ? 'AI is thinking...' : 'Your generated superprompt will appear here...';
  const hasContent = !isLoading && !!prompt;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700 space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-300">Your Generated Superprompt</h2>
      </div>
      <div className="relative">
        <textarea
          readOnly
          value={isLoading ? '' : prompt}
          placeholder={placeholderText}
          className={`w-full h-96 bg-slate-900/70 border border-slate-700 rounded-lg p-4 text-slate-300 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}
          aria-live="polite"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <LoaderIcon className="h-8 w-8 text-indigo-400" />
          </div>
        )}
      </div>

      {hasContent && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-green-800 disabled:cursor-not-allowed disabled:scale-100"
            aria-label="Copy VEO 3 Prompt to clipboard"
          >
            {isCopied ? (
              <>
                <CheckIcon />
                Copied!
              </>
            ) : (
              <>
                <DocumentCopyIcon />
                Copy Veo 3 Prompt
              </>
            )}
          </button>
          <button
            onClick={onClearAll}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-600 text-slate-200 font-bold py-3 px-4 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-all duration-300 ease-in-out"
            aria-label="Clear all inputs"
          >
            <TrashIcon />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default OutputArea;
