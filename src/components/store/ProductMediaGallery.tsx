// =============================================================================
// VeritasCraft — Product Media Gallery Component
// Multi-media gallery supporting images, videos (direct, YouTube, Vimeo),
// thumbnail navigation, autoplay controls, and lightbox inspection
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Product, ProductMediaItem } from '../../types';
import { ProductCover } from '../illustrations/ProductCover';
import { VideoPlayerEmbed } from '../common/VideoPlayerEmbed';
import {
  Play,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

interface ProductMediaGalleryProps {
  product: Product;
  className?: string;
}

export const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({
  product,
  className = '',
}) => {
  // Synthesize unified media items from product.mediaGallery or legacy coverImage / galleryImages
  const [mediaList, setMediaList] = useState<ProductMediaItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [autoplayMuted, setAutoplayMuted] = useState(true);

  useEffect(() => {
    if (product.mediaGallery && product.mediaGallery.length > 0) {
      // Sort by displayOrder
      const sorted = [...product.mediaGallery].sort((a, b) => a.displayOrder - b.displayOrder);
      setMediaList(sorted);
      // Set initial index to primary media item
      const primaryIndex = sorted.findIndex((m) => m.isPrimary);
      setActiveIndex(primaryIndex >= 0 ? primaryIndex : 0);
    } else {
      // Fallback from legacy coverImage and galleryImages
      const items: ProductMediaItem[] = [];
      if (product.coverImage) {
        items.push({
          id: 'media-cover-default',
          type: 'image',
          url: product.coverImage,
          altText: product.name,
          displayOrder: 0,
          isPrimary: true,
          isVisible: true,
        });
      }
      if (product.galleryImages && product.galleryImages.length > 0) {
        product.galleryImages.forEach((imgUrl, idx) => {
          items.push({
            id: `media-gallery-${idx}`,
            type: 'image',
            url: imgUrl,
            altText: `${product.name} Preview ${idx + 1}`,
            displayOrder: idx + 1,
            isPrimary: false,
            isVisible: true,
          });
        });
      }
      setMediaList(items);
      setActiveIndex(0);
    }
  }, [product]);

  const activeMedia = mediaList[activeIndex] || mediaList[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % mediaList.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const isIllustration = (url?: string) => {
    if (!url) return true;
    return !url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('blob:');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Display Container */}
      <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-lg border border-[var(--theme-border)] bg-slate-950 group select-none">
        {activeMedia ? (
          activeMedia.type === 'video' ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <VideoPlayerEmbed
                url={activeMedia.url}
                posterUrl={activeMedia.posterUrl}
                provider={activeMedia.videoProvider}
                aspectRatio="16/9"
                autoplay={activeMedia.autoplay}
                muted={autoplayMuted}
                controls={true}
                caption={activeMedia.caption}
                title={activeMedia.altText || product.name}
                className="w-full h-full"
              />
            </div>
          ) : isIllustration(activeMedia.url) ? (
            <ProductCover type={activeMedia.url || product.coverImage} className="w-full h-full" title={product.name} />
          ) : (
            <img
              src={activeMedia.url}
              alt={activeMedia.altText || product.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
          )
        ) : (
          <ProductCover type={product.coverImage} className="w-full h-full" title={product.name} />
        )}

        {/* Media Type Badge Overlay */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          {activeMedia?.type === 'video' ? (
            <span className="text-[10px] font-mono uppercase bg-rose-600/90 text-white px-2.5 py-1 rounded-md font-bold backdrop-blur-xs flex items-center gap-1 shadow">
              <Film className="w-3 h-3" />
              <span>Video Demonstration {activeMedia.duration ? `(${activeMedia.duration})` : ''}</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono uppercase bg-slate-900/80 text-white px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 shadow">
              <ImageIcon className="w-3 h-3" />
              <span>{activeIndex + 1} of {Math.max(1, mediaList.length)}</span>
            </span>
          )}
        </div>

        {/* Lightbox Trigger for Photos */}
        {activeMedia?.type === 'image' && !isIllustration(activeMedia.url) && (
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer shadow backdrop-blur-xs"
            title="Enlarge Image"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Quick Prev / Next Arrows if multiple media */}
        {mediaList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-xs"
              aria-label="Previous Media"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-xs"
              aria-label="Next Media"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Caption if provided */}
      {activeMedia?.caption && (
        <p className="text-xs text-slate-500 font-sans italic text-center px-2">
          {activeMedia.caption}
        </p>
      )}

      {/* Thumbnail Strip (Images and Video Cards with Play Badges) */}
      {mediaList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {mediaList.map((media, idx) => {
            const isSelected = activeIndex === idx;
            const isVideo = media.type === 'video';

            return (
              <button
                key={media.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md scale-105'
                    : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                }`}
                title={media.altText || `Media item ${idx + 1}`}
              >
                {isVideo ? (
                  <div
                    className="w-full h-full bg-slate-900 bg-cover bg-center flex items-center justify-center relative"
                    style={{
                      backgroundImage: media.posterUrl ? `url(${media.posterUrl})` : undefined,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center relative z-10 shadow">
                      <Play className="w-3 h-3 fill-current pl-0.5" />
                    </div>
                  </div>
                ) : isIllustration(media.url) ? (
                  <div className="w-full h-full bg-slate-900">
                    <ProductCover type={media.url || product.coverImage} className="w-full h-full" title="" />
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt={media.altText || ''}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}

                {/* Primary item indicator dot */}
                {media.isPrimary && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-black" title="Primary Product Media" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && activeMedia?.type === 'image' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col items-center">
            <img
              src={activeMedia.url}
              alt={activeMedia.altText || product.name}
              className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            {activeMedia.caption && (
              <p className="text-sm text-slate-300 mt-3 font-sans italic text-center">
                {activeMedia.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
