import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductCover } from '../illustrations/ProductCover';
import { getProductMainImage, isProductImageUrl } from '../../utils/productMedia';
import { Heart, Eye, ArrowRight, Star, Play, Film, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, viewMode = 'grid' }) => {
  const { addToCart, toggleWishlist, isInWishlist, setCurrentPage, setSelectedProductSlug } = useStore();
  const wishlisted = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);

  // Extract primary & secondary media
  const resolvedMainImage = getProductMainImage(product);
  const primaryMedia = product.mediaGallery?.find((m) => m.isPrimary && m.isVisible) || product.mediaGallery?.[0];
  const secondaryMedia = product.mediaGallery?.find((m) => m.id !== primaryMedia?.id && m.isVisible);
  const isVideoPrimary = primaryMedia?.type === 'video';

  const displayMediaUrl = isHovered && product.catalogMediaMode === 'hover_preview' && secondaryMedia?.url
    ? secondaryMedia.url
    : (primaryMedia?.type === 'video' ? (primaryMedia.posterUrl || primaryMedia.url) : (primaryMedia?.url || resolvedMainImage));

  const hasCustomMedia = isProductImageUrl(displayMediaUrl);

  const openLanding = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProductSlug(product.slug || product.id);
    if (product.hasDedicatedLandingPage) {
      setCurrentPage('product_landing');
    } else {
      setCurrentPage('product_detail');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDetail = () => {
    setSelectedProductSlug(product.slug || product.id);
    setCurrentPage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-[var(--theme-surface)] rounded-[var(--theme-radius)] border border-[var(--theme-border)] overflow-hidden hover:shadow-md transition-all p-4 flex flex-col sm:flex-row gap-5 items-center">
        <div
          onClick={openDetail}
          className="w-full sm:w-56 h-40 shrink-0 rounded-[var(--theme-radius)] overflow-hidden cursor-pointer relative group bg-slate-900"
        >
          {hasCustomMedia && displayMediaUrl ? (
            <img src={displayMediaUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          ) : (
            <ProductCover type={displayMediaUrl || product.coverImage} className="w-full h-full" title={product.name} />
          )}

          {isVideoPrimary && (
            <div className="absolute top-2 left-2 z-20 bg-rose-600/90 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
              <Play className="w-2.5 h-2.5 fill-current" /> Video
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-semibold"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="tabular-nums">{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <h3
            onClick={openDetail}
            className="font-serif text-lg font-bold text-[var(--theme-text)] hover:text-[var(--theme-primary)] transition-colors cursor-pointer truncate"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 my-2 leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
            <span>{product.fileFormat}</span>
            <span>·</span>
            <span>{product.fileSize}</span>
          </div>
        </div>

        <div className="w-full sm:w-44 shrink-0 flex flex-col items-end justify-between self-stretch pt-2 sm:pt-0">
          <div className="text-right mb-3">
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-xl font-bold font-mono text-[var(--theme-text)] tabular-nums">
                {product.price === 0 ? 'Free' : `$${product.price}`}
              </span>
              {product.comparePrice && (
                <span className="text-xs line-through text-slate-400 font-mono tabular-nums">
                  ${product.comparePrice}
                </span>
              )}
            </div>
            {product.comparePrice && (
              <span className="text-[10px] text-emerald-600 font-medium">
                Save ${(product.comparePrice - product.price).toFixed(0)}
              </span>
            )}
          </div>

          <div className="w-full flex items-center gap-2 justify-end">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded border border-[var(--theme-border)] transition-colors cursor-pointer ${
                wishlisted ? 'text-rose-500 bg-rose-50 border-rose-200' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Save to wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => addToCart(product)}
              className="flex-1 py-2 px-3 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-[var(--theme-radius)] transition-colors cursor-pointer"
            >
              {product.price === 0 ? 'Get Free' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-[var(--theme-surface)] rounded-[var(--theme-radius)] border border-[var(--theme-border)] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200"
    >
      {/* Cover / Image Area */}
      <div
        onClick={openDetail}
        className="relative aspect-4/3 w-full overflow-hidden cursor-pointer bg-slate-900"
      >
        {hasCustomMedia && displayMediaUrl ? (
          <img
            src={displayMediaUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ProductCover type={displayMediaUrl || product.coverImage} className="w-full h-full" title={product.name} />
        )}

        {/* Video badge if primary media is video */}
        {isVideoPrimary && (
          <div className="absolute bottom-3 left-3 z-20 bg-rose-600/90 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow backdrop-blur-xs">
            <Play className="w-2.5 h-2.5 fill-current" /> Video Demo
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 items-start">
          {product.isBestSeller && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-400 text-slate-900 px-2 py-0.5 rounded shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm">
              New Release
            </span>
          )}
          {product.isFreeLeadMagnet && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded shadow-sm">
              Free Download
            </span>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            wishlisted ? 'bg-white text-rose-500 shadow' : 'bg-black/30 text-white hover:bg-white hover:text-slate-900'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick View overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3 py-1.5 bg-white text-slate-900 rounded-md text-xs font-semibold shadow hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-1.5">
            <span className="uppercase tracking-wider">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-current" />
              <span className="tabular-nums font-mono">{product.rating}</span>
            </div>
          </div>

          <h3
            onClick={openDetail}
            className="font-serif text-base font-bold text-[var(--theme-text)] hover:text-[var(--theme-primary)] transition-colors cursor-pointer line-clamp-1 mb-2"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-[var(--theme-border)]">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-[var(--theme-text)] tabular-nums">
                {product.price === 0 ? 'Free' : `$${product.price}`}
              </span>
              {product.comparePrice && (
                <span className="text-xs line-through text-slate-400 font-mono tabular-nums">
                  ${product.comparePrice}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-500">{product.fileFormat.split('/')[0]}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {product.hasDedicatedLandingPage ? (
              <button
                onClick={openLanding}
                className="w-full py-2 px-2 text-center text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-[var(--theme-radius)] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Sales Page</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={openDetail}
                className="w-full py-2 px-2 text-center text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-[var(--theme-radius)] transition-colors cursor-pointer"
              >
                Details
              </button>
            )}

            <button
              onClick={() => addToCart(product)}
              className="w-full py-2 px-2 text-center text-xs font-semibold text-white bg-[var(--theme-primary)] hover:bg-[#2646B8] rounded-[var(--theme-radius)] transition-colors cursor-pointer"
            >
              {product.price === 0 ? 'Get Free' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
