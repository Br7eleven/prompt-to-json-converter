import React from 'react';

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onSelectRatio: (ratio: string) => void;
}

const RATIOS = ["16:9", "9:16", "1:1", "4:3", "3:4"];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelectRatio }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-2">
        Aspect Ratio
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        {RATIOS.map(ratio => (
          <button
            key={ratio}
            type="button"
            onClick={() => onSelectRatio(ratio)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 ${
              selectedRatio === ratio 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
