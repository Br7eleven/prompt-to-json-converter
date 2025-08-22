import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoaderIcon } from './icons/LoaderIcon';

interface InspireButtonProps {
  onClick: () => void;
  isLoading: boolean;
  fieldName: string;
  isTextarea?: boolean;
}

const InspireButton: React.FC<InspireButtonProps> = ({ onClick, isLoading, fieldName, isTextarea = false }) => {
  const positionClass = isTextarea ? 'top-3 right-3' : 'top-1/2 right-3 -translate-y-1/2';
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`absolute ${positionClass} text-slate-400 hover:text-indigo-400 disabled:text-slate-500 disabled:cursor-wait transition-colors`}
      aria-label={`Get AI suggestion for ${fieldName}`}
    >
      {isLoading ? <LoaderIcon className="h-4 w-4" /> : <SparklesIcon className="h-4 w-4" />}
    </button>
  );
};

export default InspireButton;
