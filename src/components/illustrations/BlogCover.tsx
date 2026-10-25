import React from 'react';

interface BlogCoverProps {
  type: string;
  className?: string;
  title?: string;
  category?: string;
}

export const BlogCover: React.FC<BlogCoverProps> = ({ type, className = '', title, category }) => {
  switch (type) {
    case 'article_pinterest':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#8C1D40] via-[#5C1027] to-[#1E050D] text-white flex flex-col justify-between p-8 select-none ${className}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 flex justify-between items-center text-xs text-rose-200">
            <span className="font-mono tracking-wider uppercase">{category || 'Visual SEO & Growth'}</span>
            <span className="text-[11px] font-mono">Case Study · 240k Views</span>
          </div>
          <div className="relative z-10 my-4 max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white mb-2">
              {title || 'The Pinterest Organic Traffic Blueprint: 0 to 240k Monthly Pageviews'}
            </h2>
            <p className="text-sm text-rose-100 font-sans line-clamp-2">
              How intentional digital creators leverage high-CTR 2:3 vertical layouts and keyword discovery.
            </p>
          </div>
          <div className="relative z-10 flex items-center justify-between text-xs text-rose-300 pt-4 border-t border-white/10">
            <span>By Clara Beaumont · 9 min read</span>
            <span className="font-mono">VeritasCraft Publishing</span>
          </div>
        </div>
      );

    case 'article_digital_products':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#1C2D42] via-[#102033] to-[#08121E] text-white flex flex-col justify-between p-8 select-none ${className}`}>
          <div className="relative z-10 flex justify-between items-center text-xs text-blue-200">
            <span className="font-mono tracking-wider uppercase">{category || 'Product Creation'}</span>
            <span className="text-[11px] font-mono">Ranked Guide</span>
          </div>
          <div className="relative z-10 my-4 max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white mb-2">
              {title || '12 High-Yield Digital Products You Can Build Once and Sell for Years'}
            </h2>
            <p className="text-sm text-blue-100 font-sans line-clamp-2">
              The economics of zero marginal cost assets: Notion operating systems, automated spreadsheets, and Canva kits.
            </p>
          </div>
          <div className="relative z-10 flex items-center justify-between text-xs text-blue-300 pt-4 border-t border-white/10">
            <span>By Julian Vance · 11 min read</span>
            <span className="font-mono">VeritasCraft Publishing</span>
          </div>
        </div>
      );

    default: // article_pricing or generic
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#1E232A] via-[#2A313C] to-[#14181E] text-white flex flex-col justify-between p-8 select-none ${className}`}>
          <div className="relative z-10 flex justify-between items-center text-xs text-amber-200">
            <span className="font-mono tracking-wider uppercase">{category || 'Monetization'}</span>
            <span className="text-[11px] font-mono">Pricing Psychology</span>
          </div>
          <div className="relative z-10 my-4 max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white mb-2">
              {title || 'Pricing Psychology for Digital Downloads: Why $39 Outconverts $19'}
            </h2>
            <p className="text-sm text-slate-300 font-sans line-clamp-2">
              Why ultra-low prices trigger buyer skepticism, and the three golden price anchors for online products.
            </p>
          </div>
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10">
            <span>By Julian Vance · 7 min read</span>
            <span className="font-mono">VeritasCraft Publishing</span>
          </div>
        </div>
      );
  }
};
