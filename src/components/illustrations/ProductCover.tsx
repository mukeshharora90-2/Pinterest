import React, { useState } from 'react';
import { isProductImageUrl } from '../../utils/productMedia';

interface ProductCoverProps {
  type: string;
  className?: string;
  title?: string;
  badge?: string;
}

export const ProductCover: React.FC<ProductCoverProps> = ({ type, className = '', title, badge }) => {
  const [hasImageError, setHasImageError] = useState(false);

  // If type is an image URL (uploaded image, external URL, data URI, or storage path), render the actual image
  if (type && isProductImageUrl(type) && !hasImageError) {
    return (
      <div className={`relative overflow-hidden bg-slate-900 flex items-center justify-center select-none ${className}`}>
        <img
          src={type}
          alt={title || 'Product Image'}
          className="w-full h-full object-cover"
          loading="eager"
          onError={() => setHasImageError(true)}
        />
        {badge && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white font-mono text-[10px] font-bold uppercase tracking-wider border border-white/20">
            {badge}
          </div>
        )}
      </div>
    );
  }

  switch (type) {
    case 'notion_os':
      return (
        <div className={`relative overflow-hidden bg-[#1E232A] text-white flex flex-col justify-between p-6 select-none ${className}`}>
          {/* Subtle geometric grid background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 bg-white/10 rounded text-slate-300">
              Notion 2.4 Edition
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              14 Databases
            </span>
          </div>

          {/* Center Graphic: Realistic Notion Relational Workspace UI Mockup */}
          <div className="relative z-10 my-4 bg-[#282E37] rounded-lg p-3 shadow-xl border border-white/10 text-xs font-mono">
            <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-red-400/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-amber-400/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald-400/80 inline-block" />
              <span className="ml-2 text-[10px] text-slate-300">Workspace / Executive Dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="bg-[#1F242C] p-2 rounded">
                <div className="text-slate-400">Active Retainers</div>
                <div className="text-sm font-semibold text-emerald-400 font-sans mt-0.5">$18,400</div>
              </div>
              <div className="bg-[#1F242C] p-2 rounded">
                <div className="text-slate-400">Editorial Queue</div>
                <div className="text-sm font-semibold text-blue-400 font-sans mt-0.5">8 Drafts</div>
              </div>
              <div className="bg-[#1F242C] p-2 rounded">
                <div className="text-slate-400">Sprint Progress</div>
                <div className="text-sm font-semibold text-indigo-400 font-sans mt-0.5">92% Done</div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="font-serif text-lg font-bold leading-tight text-white mb-1">
              {title || 'Creative Director Operating System'}
            </h3>
            <p className="text-xs text-slate-400">Unified Notion Workspace for High-Output Creators</p>
          </div>
        </div>
      );

    case 'pinterest_kit':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#8C1D40] via-[#5C1027] to-[#2B0812] text-white flex flex-col justify-between p-6 select-none ${className}`}>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 bg-white/15 rounded text-rose-200">
              Canva + 2:3 Ratio
            </span>
            <span className="text-[10px] font-semibold text-white bg-rose-500/40 px-2 py-0.5 rounded border border-rose-300/30">
              120+ Templates
            </span>
          </div>

          {/* Visual Mini Pin Cards Mockup */}
          <div className="relative z-10 my-3 flex justify-center gap-2">
            <div className="w-16 h-24 bg-white text-slate-900 rounded p-1.5 shadow-lg transform -rotate-6 flex flex-col justify-between">
              <span className="text-[6px] font-bold text-rose-800 uppercase tracking-tighter">SEO Guide</span>
              <div className="w-full h-8 bg-rose-50 rounded text-[7px] p-1 font-serif leading-none">
                How We Ranked #1
              </div>
              <div className="w-full h-2 bg-rose-600 rounded-[2px]" />
            </div>
            <div className="w-20 h-28 bg-[#FFFDF9] text-slate-900 rounded-md p-2 shadow-2xl z-10 flex flex-col justify-between border border-rose-100">
              <span className="text-[7px] font-bold text-rose-700 uppercase tracking-tight">Viral Blueprint</span>
              <div className="text-[8px] font-serif font-bold leading-tight text-slate-800">
                120+ High CTR Pin Graphics
              </div>
              <div className="w-full text-center py-0.5 bg-[#8C1D40] text-[6px] text-white rounded font-medium">
                Save Idea
              </div>
            </div>
            <div className="w-16 h-24 bg-white text-slate-900 rounded p-1.5 shadow-lg transform rotate-6 flex flex-col justify-between">
              <span className="text-[6px] font-bold text-slate-500 uppercase tracking-tighter">Checklist</span>
              <div className="w-full h-8 bg-amber-50 rounded text-[7px] p-1 font-serif leading-none">
                Fresh Pin Cadence
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-[2px]" />
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="font-serif text-lg font-bold leading-tight text-white mb-1">
              {title || 'Pinterest Traffic Blueprint & 120+ Templates'}
            </h3>
            <p className="text-xs text-rose-200">The Visual Search Ranking Engine</p>
          </div>
        </div>
      );

    case 'launch_playbook':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#1C2D42] to-[#0D1826] text-white flex flex-col justify-between p-6 select-none ${className}`}>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 bg-blue-500/20 text-blue-200 rounded">
              Comprehensive Guide
            </span>
            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              110 Pages
            </span>
          </div>

          {/* Book / Binder mockup */}
          <div className="relative z-10 my-4 flex justify-center">
            <div className="w-36 h-28 bg-[#FAF8F4] text-slate-900 rounded-r-md p-3 shadow-2xl border-l-4 border-[#3157D5] flex flex-col justify-between">
              <span className="text-[7px] font-mono tracking-wider uppercase text-slate-500">Master Playbook</span>
              <div>
                <h4 className="font-serif text-[11px] font-bold leading-tight text-slate-900">
                  Digital Product Launch Playbook
                </h4>
                <p className="text-[7px] text-slate-500 mt-1 font-sans">Validation to $10k Month</p>
              </div>
              <div className="text-[6px] font-mono text-[#3157D5] border-t border-slate-200 pt-1">
                VeritasCraft Publishing
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="font-serif text-lg font-bold leading-tight text-white mb-1">
              {title || 'Digital Product Launch Playbook'}
            </h3>
            <p className="text-xs text-slate-300">Step-by-step validation, pricing, & sales pages</p>
          </div>
        </div>
      );

    case 'client_portal':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#2D3748] to-[#1A202C] text-white flex flex-col justify-between p-6 select-none ${className}`}>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 bg-white/10 rounded text-slate-300">
              Client Portal
            </span>
            <span className="text-[10px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              White-Label
            </span>
          </div>
          <div className="relative z-10 my-3 bg-[#1A202C] p-3 rounded-lg border border-slate-700 shadow-lg text-[10px] font-mono">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span>Client: Acme Studio</span>
              <span className="text-emerald-400">Milestone 3/4 Approved</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full w-3/4" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-serif text-lg font-bold leading-tight text-white mb-1">
              {title || 'Client Onboarding & Project Portal'}
            </h3>
            <p className="text-xs text-slate-400">Seamless Client Approvals & File Delivery</p>
          </div>
        </div>
      );

    case 'wealth_dashboard':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#133E2B] via-[#0E2C1E] to-[#071911] text-white flex flex-col justify-between p-6 select-none ${className}`}>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-200 rounded">
              Sheets + Excel
            </span>
            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-400/30">
              Automated
            </span>
          </div>
          <div className="relative z-10 my-3 bg-[#0A1F15] p-3 rounded-lg border border-emerald-500/20 shadow-lg text-[10px] font-mono">
            <div className="text-emerald-300 font-bold text-sm tabular-nums mb-1">$142,850 Net Worth</div>
            <div className="text-[9px] text-emerald-400/80">Monthly Passive Royalties: +$3,420</div>
          </div>
          <div className="relative z-10">
            <h3 className="font-serif text-lg font-bold leading-tight text-white mb-1">
              {title || 'Automated Wealth & Royalty Dashboard'}
            </h3>
            <p className="text-xs text-emerald-200/80">Financial Clarity for Digital Founders</p>
          </div>
        </div>
      );

    case 'social_kit':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#4A3B32] to-[#2B211B] text-white flex flex-col justify-between p-6 select-none ${className}`}>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 bg-white/10 rounded text-amber-200">
              200+ Templates
            </span>
            <span className="text-[10px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              Editorial Aesthetic
            </span>
          </div>
          <div className="relative z-10 my-3 grid grid-cols-2 gap-2">
            <div className="bg-[#FAF8F4] text-slate-900 p-2 rounded shadow text-[8px] font-serif">
              "Build products that compound while you sleep."
            </div>
            <div className="bg-[#FAF8F4] text-slate-900 p-2 rounded shadow text-[8px] font-serif">
              Quarterly Revenue Roadmap
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-serif text-lg font-bold leading-tight text-white mb-1">
              {title || 'Minimalist Editorial Social Media Kit'}
            </h3>
            <p className="text-xs text-amber-200/80">Cohesive Instagram & Pinterest Templates</p>
          </div>
        </div>
      );

    default: // starter_blueprint or generic
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#3157D5] via-[#2442A8] to-[#172B6E] text-white flex flex-col justify-between p-6 select-none ${className}`}>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 bg-white/20 text-white rounded">
              {badge || 'Free Download'}
            </span>
            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-400/30">
              Instant Access
            </span>
          </div>
          <div className="relative z-10 my-4 text-center">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur rounded border border-white/20">
              <span className="text-xs font-mono tracking-wider uppercase text-blue-200">7-Day Roadmap</span>
              <div className="text-sm font-serif font-bold text-white mt-1">Idea to First $1,000</div>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-serif text-lg font-bold leading-tight text-white mb-1">
              {title || 'Free 7-Day Digital Product Starter Blueprint'}
            </h3>
            <p className="text-xs text-blue-100">Step-by-step validation and launch worksheet</p>
          </div>
        </div>
      );
  }
};
