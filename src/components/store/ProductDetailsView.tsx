import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductCover } from '../illustrations/ProductCover';
import { ProductMediaGallery } from './ProductMediaGallery';
import { ProductCard } from './ProductCard';
import {
  Star,
  Check,
  ShieldCheck,
  Download,
  Gift,
  HelpCircle,
  ArrowRight,
  Heart,
  ChevronDown,
  Layers,
  FileCheck,
} from 'lucide-react';

interface ProductDetailsViewProps {
  productSlug: string;
  onQuickView: (product: Product) => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ productSlug, onQuickView }) => {
  const { products, addToCart, toggleWishlist, isInWishlist, setCurrentPage, setSelectedProductSlug } = useStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const product = products.find((p) => p.slug === productSlug) || products[0];
  const wishlisted = isInWishlist(product.id);

  // Related products
  const related = products.filter(
    (p) => p.id !== product.id && (product.relatedProductIds?.includes(p.id) || p.category === product.category)
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-mono flex items-center gap-2 mb-8">
        <button onClick={() => setCurrentPage('home')} className="hover:text-slate-900 cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button onClick={() => setCurrentPage('shop')} className="hover:text-slate-900 cursor-pointer">
          Shop
        </button>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main 2-Column Split: Sticky Gallery Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left Column: Visual Showcase */}
        <div className="lg:col-span-7 sticky top-24">
          <ProductMediaGallery product={product} className="mb-4" />

          {/* Quick Technical Specs Strip */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] text-xs text-slate-600 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Format</span>
              <span className="font-semibold text-slate-900">{product.fileFormat}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">File Size</span>
              <span className="font-semibold text-slate-900">{product.fileSize}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Version</span>
              <span className="font-semibold text-slate-900">{product.version}</span>
            </div>
          </div>

          {/* Dedicated Landing Page Banner */}
          {product.hasDedicatedLandingPage && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">Explore the Full Interactive Sales Page</h4>
                <p className="text-[11px] text-slate-600">See database breakdowns, video preview, and feature matrices.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedProductSlug(product.slug || product.id);
                  setCurrentPage('product_landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 bg-[var(--theme-primary)] text-white text-xs font-semibold rounded-lg hover:bg-[#2646B8] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                <span>View Sales Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span className="uppercase tracking-wider">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-4 h-4 fill-current" />
              <span className="tabular-nums font-mono">{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--theme-text)] leading-tight mb-4">
            {product.name}
          </h1>

          {/* Price lockup */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[var(--theme-border)]">
            <span className="text-3xl font-bold font-mono text-[var(--theme-text)] tabular-nums">
              {product.price === 0 ? 'Free Download' : `$${product.price}`}
            </span>
            {product.comparePrice && (
              <span className="text-base line-through text-slate-400 font-mono tabular-nums">
                ${product.comparePrice}
              </span>
            )}
            {product.comparePrice && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                Save ${(product.comparePrice - product.price).toFixed(0)} (40% OFF)
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            {product.longDescription}
          </p>

          {/* Purchase Actions */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => addToCart(product)}
              className="w-full py-3.5 px-4 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-sm font-semibold rounded-[var(--theme-radius)] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{product.price === 0 ? 'Claim Free Download' : `Download Now — $${product.price}`}</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-full py-2.5 px-4 border rounded-[var(--theme-radius)] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                wishlisted
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-[var(--theme-border)] text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
              <span>{wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-2.5 text-xs text-slate-600 pt-6 border-t border-[var(--theme-border)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant Digital Delivery: Download immediately after checkout.</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>License: {product.licenseType}.</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Free lifetime updates included with your purchase.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Deep Breakdown: Files, Bonuses, FAQs, Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-[var(--theme-border)]">
        {/* Left: What's included & Bonuses */}
        <div className="lg:col-span-7 space-y-10">
          <div>
            <h3 className="font-serif text-xl font-bold text-[var(--theme-text)] mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" /> What's Included in This Download
            </h3>
            <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] overflow-hidden divide-y divide-[var(--theme-border)]">
              {product.includedFiles.map((file, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-700 font-semibold uppercase">
                      {file.format}
                    </span>
                    <div>
                      <div className="font-medium text-slate-900">{file.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Version {file.version}</div>
                    </div>
                  </div>
                  <span className="font-mono text-slate-500 tabular-nums">{file.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bonuses */}
          {product.bonuses && product.bonuses.length > 0 && (
            <div>
              <h3 className="font-serif text-xl font-bold text-[var(--theme-text)] mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" /> Included Bonus Materials (Free with Purchase)
              </h3>
              <div className="space-y-3">
                {product.bonuses.map((bonus, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900 mb-1 flex items-center gap-2">
                        <span>{bonus.title}</span>
                        <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          ${bonus.value} Value
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{bonus.description}</p>
                    </div>
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {product.faqs && product.faqs.length > 0 && (
            <div>
              <h3 className="font-serif text-xl font-bold text-[var(--theme-text)] mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-slate-600" /> Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {product.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)] overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between text-xs font-semibold text-slate-900 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          activeFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeFaq === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-[var(--theme-border)] pt-3 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Reviews & Feedback */}
        <div className="lg:col-span-5">
          <h3 className="font-serif text-xl font-bold text-[var(--theme-text)] mb-4">
            Customer Reviews ({product.reviewsCount})
          </h3>
          <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-serif font-bold text-[var(--theme-text)] tabular-nums">
                {product.rating}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-slate-500 font-mono">100% Verified Buyer Rating</div>
              </div>
            </div>

            <div className="space-y-4">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="pb-4 border-b border-[var(--theme-border)] last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-900">{rev.authorName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                  </div>
                  {rev.authorRole && (
                    <div className="text-[10px] text-slate-500 font-mono mb-2">{rev.authorRole}</div>
                  )}
                  <h4 className="text-xs font-bold text-slate-800 mb-1">"{rev.title}"</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation Engine */}
      {related.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[var(--theme-border)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Curated Recommendation</span>
              <h3 className="font-serif text-2xl font-bold text-[var(--theme-text)]">Frequently Bought Together</h3>
            </div>
            <button
              onClick={() => {
                setCurrentPage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-medium text-[var(--theme-primary)] hover:underline cursor-pointer"
            >
              View Full Collection →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} onQuickView={onQuickView} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
