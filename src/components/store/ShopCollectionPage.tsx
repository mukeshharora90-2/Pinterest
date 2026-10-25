import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { RotateCcw } from 'lucide-react';

interface ShopCollectionPageProps {
  onQuickView: (product: any) => void;
  initialFilter?: string;
}

export const ShopCollectionPage: React.FC<ShopCollectionPageProps> = ({ onQuickView, initialFilter }) => {
  const { products } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialFilter || 'all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const formats = ['Notion Workspace', 'Canva Templates', 'PDF Guide', 'Google Sheets'];

  // Filter products
  let filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesFormat =
      selectedFormat === 'all' || p.fileFormat.toLowerCase().includes(selectedFormat.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesFormat && matchesSearch && p.isAvailable;
  });

  // Sort products
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
      default:
        return b.reviewsCount - a.reviewsCount;
    }
  });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFormat('all');
    setSortBy('popularity');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--theme-primary)] font-semibold">
          Digital Products Store
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--theme-text)] mt-2 mb-3">
          Curated Digital Downloads
        </h1>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          Production-grade Notion workspaces, viral Canva pin templates, and operational spreadsheets designed for immediate execution.
        </p>
      </div>

      {/* Filter Component */}
      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={categories}
        formats={formats}
        totalCount={products.filter((p) => p.isAvailable).length}
        onReset={handleReset}
      />

      {/* Product Grid or List */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-16 text-center">
          <h3 className="font-serif text-xl font-bold text-slate-800 mb-2">No Matching Products Found</h3>
          <p className="text-xs text-slate-500 mb-6">Try broadening your search term or selecting another category.</p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} onQuickView={onQuickView} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} onQuickView={onQuickView} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  );
};
