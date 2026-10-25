import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductCover } from '../illustrations/ProductCover';
import { getProductMainImage } from '../../utils/productMedia';
import { X, Check, Star, ShieldCheck, Download, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, setCurrentPage, setSelectedProductSlug } = useStore();

  if (!product) return null;

  const handleOpenLanding = () => {
    setSelectedProductSlug(product.slug || product.id);
    setCurrentPage('product_landing');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = () => {
    setSelectedProductSlug(product.slug || product.id);
    setCurrentPage('product_detail');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-2xl max-w-3xl w-full border border-[var(--theme-border)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Left: Product Cover */}
        <div className="w-full md:w-5/12 bg-slate-900 relative flex flex-col justify-between shrink-0 min-h-64 md:min-h-full">
          <ProductCover type={getProductMainImage(product)} className="w-full h-full" title={product.name} />
          <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md rounded p-2.5 text-xs text-white border border-white/10">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating} / 5.0 rating</span>
              <span className="text-white/70">({product.reviewsCount} verified reviews)</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              Version {product.version} · {product.fileFormat}
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase Module */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                {product.category}
              </span>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[var(--theme-text)] leading-snug mb-3">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold font-mono text-[var(--theme-text)] tabular-nums">
                {product.price === 0 ? 'Free' : `$${product.price}`}
              </span>
              {product.comparePrice && (
                <span className="text-sm line-through text-slate-400 font-mono tabular-nums">
                  ${product.comparePrice}
                </span>
              )}
              {product.comparePrice && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Save ${(product.comparePrice - product.price).toFixed(0)}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            {/* Included Assets */}
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold mb-2">
                What's Included:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {product.includedFiles.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{file.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({file.size})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant digital delivery to your account upon checkout. {product.licenseType}.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[var(--theme-border)] space-y-2">
            <button
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              className="w-full py-3 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-sm font-semibold rounded-[var(--theme-radius)] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Download className="w-4 h-4" />
              <span>{product.price === 0 ? 'Claim Free Download' : `Add to Cart — $${product.price}`}</span>
            </button>

            {product.hasDedicatedLandingPage && (
              <button
                onClick={handleOpenLanding}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-[var(--theme-radius)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Product Sales Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
