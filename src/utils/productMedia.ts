// =============================================================================
// VeritasCraft — Product Media & Image Resolution Utilities
// Standardized retrieval and validation for main, hero, and featured product images
// Adheres strictly to the 3-tier image priority:
// 1. Explicitly selected custom image for a particular landing-page section (if configured & valid)
// 2. The associated product's existing main image (primary media item or uploaded coverImage)
// 3. Fallback placeholder or illustration if neither image is available
// =============================================================================

import { Product } from '../types';

/**
 * Checks whether a given string is a valid image URL, data URL, blob URL,
 * or supported storage path (e.g. Supabase Storage / local assets).
 */
export const isProductImageUrl = (url?: string): boolean => {
  if (!url) return false;
  const clean = url.trim();
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:image/') ||
    clean.startsWith('blob:') ||
    clean.startsWith('/') ||
    clean.startsWith('./')
  ) {
    return true;
  }
  // Check common image file extensions
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif|bmp|ico)(\?.*)?$/i.test(clean)) {
    return true;
  }
  // Check Supabase storage bucket paths like 'product-images/...' or 'products/...'
  if (clean.includes('/storage/v1/object/') || clean.startsWith('product-images/') || clean.startsWith('products/')) {
    return true;
  }
  return false;
};

/**
 * Normalizes relative paths or storage paths into clean browser-loadable URLs
 */
export const resolveProductImageUrl = (url?: string): string => {
  if (!url) return '';
  const clean = url.trim();
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:') ||
    clean.startsWith('/')
  ) {
    return clean;
  }
  // If it's a relative storage path (e.g. products/xyz.png), prefix with /
  return `/${clean}`;
};

/**
 * Retrieves the product's actual uploaded main image from its media gallery or cover image.
 * Prioritizes real image files / URLs over abstract illustration placeholders.
 */
export const getProductUploadedImage = (product?: Product | null): string | null => {
  if (!product) return null;

  // 1. Explicit primary media in mediaGallery
  if (product.mediaGallery && product.mediaGallery.length > 0) {
    const primary = product.mediaGallery.find((m) => m.isPrimary && m.isVisible && m.url);
    if (primary) {
      if (primary.type === 'video') {
        if (primary.posterUrl && isProductImageUrl(primary.posterUrl)) {
          return primary.posterUrl;
        }
      } else if (primary.url && isProductImageUrl(primary.url)) {
        return primary.url;
      }
    }

    // 2. Any visible image in mediaGallery that is a valid image
    const anyImage = product.mediaGallery.find((m) => m.type === 'image' && m.isVisible && m.url && isProductImageUrl(m.url));
    if (anyImage?.url) {
      return anyImage.url;
    }

    // 3. Any media item in gallery with valid url or poster
    for (const m of product.mediaGallery) {
      if (m.isVisible) {
        if (m.type === 'image' && m.url && isProductImageUrl(m.url)) return m.url;
        if (m.posterUrl && isProductImageUrl(m.posterUrl)) return m.posterUrl;
      }
    }
  }

  // 4. Product coverImage if it is a real image URL
  if (product.coverImage && isProductImageUrl(product.coverImage)) {
    return product.coverImage.trim();
  }

  // 5. Product galleryImages if real image URL
  if (product.galleryImages && product.galleryImages.length > 0) {
    const realGalleryImg = product.galleryImages.find((img) => isProductImageUrl(img));
    if (realGalleryImg) return realGalleryImg.trim();
  }

  return null;
};

/**
 * Resolves the dedicated landing page hero/featured image according to the strict priority rules:
 * 1. An explicitly selected custom image for a particular landing-page section (if configured & valid)
 * 2. The associated product's existing main uploaded image
 * 3. Fallback placeholder or illustration
 */
export const getProductLandingHeroImage = (
  product?: Product | null,
  customSectionOverride?: string
): { imageUrl: string; isRealImage: boolean; source: 'custom' | 'product_main' | 'fallback' } => {
  if (!product) {
    return { imageUrl: 'notion_os', isRealImage: false, source: 'fallback' };
  }

  // 1. Explicitly selected custom image for section/config (must be a valid image URL)
  const customCandidate =
    (customSectionOverride && customSectionOverride.trim()) ||
    (product.landingPageConfig?.heroImage && product.landingPageConfig.heroImage.trim()) ||
    (product.landingPageConfig?.featuredImage && product.landingPageConfig.featuredImage.trim());

  if (customCandidate && isProductImageUrl(customCandidate)) {
    return { imageUrl: resolveProductImageUrl(customCandidate), isRealImage: true, source: 'custom' };
  }

  // 2. The associated product's existing main uploaded image
  const productMainUploaded = getProductUploadedImage(product);
  if (productMainUploaded) {
    return { imageUrl: resolveProductImageUrl(productMainUploaded), isRealImage: true, source: 'product_main' };
  }

  // 3. Fallback: custom candidate if it's an illustration key, or product coverImage, or clean default
  if (customCandidate) {
    return {
      imageUrl: customCandidate,
      isRealImage: isProductImageUrl(customCandidate),
      source: 'fallback',
    };
  }

  if (product.coverImage && product.coverImage.trim()) {
    return {
      imageUrl: product.coverImage.trim(),
      isRealImage: isProductImageUrl(product.coverImage),
      source: 'fallback',
    };
  }

  return { imageUrl: 'notion_os', isRealImage: false, source: 'fallback' };
};

/**
 * Standard getProductMainImage: returns browser-loadable image URL or illustration key.
 * Always resolves product main uploaded image when available.
 */
export const getProductMainImage = (product?: Product | null, customOverride?: string): string => {
  return getProductLandingHeroImage(product, customOverride).imageUrl;
};
