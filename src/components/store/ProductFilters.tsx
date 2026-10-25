import React from 'react';
import { Search, LayoutGrid, List, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedFormat: string;
  setSelectedFormat: (f: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
  categories: string[];
  formats: string[];
  totalCount: number;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedFormat,
  setSelectedFormat,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  categories,
  formats,
  totalCount,
  onReset,
}) => {
  return (
    <div className="bg-[var(--theme-surface)] rounded-[var(--theme-radius)] border border-[var(--theme-border)] p-5 mb-8 shadow-xs">
      {/* Top search & sorting row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search digital products, Notion workspaces, Canva templates..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-[var(--theme-radius)] focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Sort & View Mode */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-[var(--theme-radius)] text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="newest">Newest Releases</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="flex items-center border border-slate-200 rounded-[var(--theme-radius)] overflow-hidden bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List view"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs / Segmented controls for Category */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--theme-border)]">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mr-2">Category:</span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
            selectedCategory === 'all'
              ? 'bg-[var(--theme-primary)] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({totalCount})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
              selectedCategory === cat
                ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}

        {/* Format Filter Dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Format:</span>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="text-xs py-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700"
          >
            <option value="all">All Formats</option>
            {formats.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))}
          </select>

          {(selectedCategory !== 'all' || selectedFormat !== 'all' || searchQuery) && (
            <button
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors ml-2 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
