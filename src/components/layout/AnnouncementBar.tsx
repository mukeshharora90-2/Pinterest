import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { setCurrentPage, setSelectedProductSlug } = useStore();

  if (!isVisible) return null;

  return (
    <aside aria-label="Announcement" className="bg-[#20232A] text-white text-xs py-2 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center font-medium flex items-center justify-center gap-2">
          <span className="hidden sm:inline-block text-amber-300">
            <Sparkles className="w-3.5 h-3.5 inline" />
          </span>
          <span>
            Autumn Creative Sale: Use code <strong className="text-amber-300 font-mono tracking-wider">WELCOME20</strong> for 20% off all digital workspaces & templates.
          </span>
          <button
            onClick={() => {
              setSelectedProductSlug('creative-director-operating-system');
              setCurrentPage('product_landing');
            }}
            className="underline underline-offset-2 hover:text-amber-300 transition-colors ml-2 font-medium cursor-pointer"
          >
            Explore Featured OS →
          </button>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white p-1 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
