// =============================================================================
// VeritasCraft — Product Media Manager Component (Admin Dashboard)
// Full custom product media management: Images, Videos (Upload, URL, YouTube,
// Vimeo, Library), Ordering, Primary Selection, Posters, Alt Text, and Catalog Mode
// =============================================================================

import React, { useState, useRef } from 'react';
import { Product, ProductMediaItem, ProductCatalogMediaMode, VideoProvider } from '../../types';
import { CURATED_MEDIA_LIBRARY, parseVideoUrl, compressImageFile } from '../../utils/mediaEmbed';
import { isProductImageUrl } from '../../utils/productMedia';
import { VideoPlayerEmbed } from '../common/VideoPlayerEmbed';
import {
  Upload,
  Video,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Check,
  Eye,
  EyeOff,
  Link,
  Film,
  AlertCircle,
  Play,
  Sliders,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ProductMediaManagerProps {
  product: Product;
  onChange: (updated: Partial<Product>) => void;
  showNotification: (msg: string) => void;
}

export const ProductMediaManager: React.FC<ProductMediaManagerProps> = ({
  product,
  onChange,
  showNotification,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [mediaTypeToAdd, setMediaTypeToAdd] = useState<'image' | 'video'>('image');
  const [urlInput, setUrlInput] = useState('');
  const [posterUrlInput, setPosterUrlInput] = useState('');
  const [altTextInput, setAltTextInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize media gallery if empty
  const mediaGallery: ProductMediaItem[] = product.mediaGallery || [];

  const mainMediaType = product.mainMediaType || 'image';
  const catalogMediaMode = product.catalogMediaMode || 'hover_preview';

  // 1. Add Media from Device Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(20);

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);

    // Format & extension validation
    if (isVideo) {
      if (/\.(mkv|avi|wmv|flv)$/i.test(file.name)) {
        setUploadError(
          `File "${file.name}" uses an unsupported video container format. Browsers require MP4 or WebM for HTML5 playback. Please select an MP4 or WebM video.`
        );
        setIsUploading(false);
        return;
      }
      if (file.size > 80 * 1024 * 1024) {
        setUploadError('Video file exceeds maximum limit of 80MB.');
        setIsUploading(false);
        return;
      }
    } else if (isImage) {
      if (file.size > 25 * 1024 * 1024) {
        setUploadError('Image file exceeds maximum limit of 25MB.');
        setIsUploading(false);
        return;
      }
    } else {
      setUploadError('Unsupported format. Please upload JPG, PNG, WebP, GIF, or MP4/WebM video.');
      setIsUploading(false);
      return;
    }

    setUploadProgress(60);

    const processUpload = async () => {
      try {
        let dataUrl: string;
        if (isImage) {
          dataUrl = await compressImageFile(file, 1920, 1920, 0.85);
        } else {
          dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }

        setUploadProgress(100);
        const hasExistingRealImage = mediaGallery.some((m) => m.type === 'image' && m.isVisible && isProductImageUrl(m.url));
        const shouldBePrimary = mediaGallery.length === 0 || !hasExistingRealImage || !product.coverImage || !isProductImageUrl(product.coverImage);

        const newItem: ProductMediaItem = {
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: isVideo ? 'video' : 'image',
          url: dataUrl,
          altText: altTextInput || file.name.replace(/\.[^/.]+$/, ''),
          caption: captionInput,
          displayOrder: mediaGallery.length,
          isPrimary: shouldBePrimary,
          isVisible: true,
          duration: isVideo ? 'Preview' : undefined,
        };

        const updated = shouldBePrimary
          ? mediaGallery.map((m) => ({ ...m, isPrimary: false })).concat(newItem)
          : [...mediaGallery, newItem];

        const shouldUpdateCover = !isVideo && (shouldBePrimary || !product.coverImage || !isProductImageUrl(product.coverImage));
        onChange({
          mediaGallery: updated,
          coverImage: shouldUpdateCover ? dataUrl : product.coverImage,
        });

        setIsUploading(false);
        setAltTextInput('');
        setCaptionInput('');
        showNotification(`Uploaded ${isVideo ? 'video' : 'image'} "${file.name}" to product gallery!`);
      } catch (err) {
        console.error('File upload failed:', err);
        setIsUploading(false);
        setUploadError('Failed to read and process file.');
      }
    };

    processUpload();
  };

  // 2. Add Media from URL (Image or Video: YouTube, Vimeo, MP4)
  const handleAddFromUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setUploadError(null);

    if (mediaTypeToAdd === 'video') {
      const parsed = parseVideoUrl(urlInput);
      if (!parsed.isValid) {
        setUploadError(parsed.errorMessage || 'Invalid video URL.');
        return;
      }

      const newItem: ProductMediaItem = {
        id: `media-vid-${Date.now()}`,
        type: 'video',
        url: urlInput.trim(),
        posterUrl: posterUrlInput.trim() || undefined,
        videoProvider: parsed.provider,
        altText: altTextInput || 'Product Video Demo',
        caption: captionInput,
        displayOrder: mediaGallery.length,
        isPrimary: mediaGallery.length === 0,
        isVisible: true,
      };

      onChange({ mediaGallery: [...mediaGallery, newItem] });
      setUrlInput('');
      setPosterUrlInput('');
      setAltTextInput('');
      setCaptionInput('');
      showNotification(`Added ${parsed.provider.toUpperCase()} video to product gallery!`);
    } else {
      // Image URL
      const hasExistingRealImage = mediaGallery.some((m) => m.type === 'image' && m.isVisible && isProductImageUrl(m.url));
      const shouldBePrimary = mediaGallery.length === 0 || !hasExistingRealImage || !product.coverImage || !isProductImageUrl(product.coverImage);

      const newItem: ProductMediaItem = {
        id: `media-img-${Date.now()}`,
        type: 'image',
        url: urlInput.trim(),
        altText: altTextInput || product.name,
        caption: captionInput,
        displayOrder: mediaGallery.length,
        isPrimary: shouldBePrimary,
        isVisible: true,
      };

      const updated = shouldBePrimary
        ? mediaGallery.map((m) => ({ ...m, isPrimary: false })).concat(newItem)
        : [...mediaGallery, newItem];

      const shouldUpdateCover = shouldBePrimary || !product.coverImage || !isProductImageUrl(product.coverImage);
      onChange({
        mediaGallery: updated,
        coverImage: shouldUpdateCover ? urlInput.trim() : product.coverImage,
      });

      setUrlInput('');
      setAltTextInput('');
      setCaptionInput('');
      showNotification('Added image URL to product gallery!');
    }
  };

  // 3. Add from Curated Media Library
  const handleAddFromLibrary = (item: any, type: 'image' | 'video') => {
    const hasExistingRealImage = mediaGallery.some((m) => m.type === 'image' && m.isVisible && isProductImageUrl(m.url));
    const shouldBePrimary = type === 'image' && (mediaGallery.length === 0 || !hasExistingRealImage || !product.coverImage || !isProductImageUrl(product.coverImage));

    const newItem: ProductMediaItem = {
      id: `media-lib-${Date.now()}`,
      type: type,
      url: item.url,
      posterUrl: item.poster,
      altText: item.name,
      caption: item.alt || item.category,
      displayOrder: mediaGallery.length,
      isPrimary: shouldBePrimary,
      isVisible: true,
      duration: item.duration,
      videoProvider: type === 'video' ? 'direct' : undefined,
    };

    const updated = shouldBePrimary
      ? mediaGallery.map((m) => ({ ...m, isPrimary: false })).concat(newItem)
      : [...mediaGallery, newItem];

    const shouldUpdateCover = type === 'image' && (shouldBePrimary || !product.coverImage || !isProductImageUrl(product.coverImage));

    onChange({
      mediaGallery: updated,
      coverImage: shouldUpdateCover ? item.url : product.coverImage,
    });

    showNotification(`Selected library ${type}: "${item.name}"`);
  };

  // Set Primary Media explicitly
  const handleSetPrimary = (id: string) => {
    const updated = mediaGallery.map((m) => ({
      ...m,
      isPrimary: m.id === id,
    }));
    const primary = updated.find((m) => m.id === id);
    onChange({
      mediaGallery: updated,
      coverImage: primary?.type === 'image' ? primary.url : (primary?.posterUrl || product.coverImage),
    });
    showNotification('Primary product media updated!');
  };

  // Reorder Media items
  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === mediaGallery.length - 1)
    ) {
      return;
    }

    const copy = [...mediaGallery];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Resync displayOrder
    const reordered = copy.map((m, idx) => ({ ...m, displayOrder: idx }));
    onChange({ mediaGallery: reordered });
  };

  // Delete Media
  const handleDeleteMedia = (id: string) => {
    const remaining = mediaGallery.filter((m) => m.id !== id);
    if (remaining.length > 0 && !remaining.some((m) => m.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    const newPrimary = remaining.find((m) => m.isPrimary) || remaining[0];
    onChange({
      mediaGallery: remaining,
      coverImage: newPrimary
        ? newPrimary.type === 'image'
          ? newPrimary.url
          : (newPrimary.posterUrl || product.coverImage)
        : product.coverImage,
    });
    showNotification('Media item removed.');
  };

  // Toggle Visibility
  const handleToggleVisibility = (id: string) => {
    const updated = mediaGallery.map((m) =>
      m.id === id ? { ...m, isVisible: !m.isVisible } : m
    );
    onChange({ mediaGallery: updated });
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200 text-xs">
      {/* Header & Global Settings */}
      <div>
        <h3 className="font-serif text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
          <Film className="w-4 h-4 text-blue-600" />
          <span>Product Media & Video Customizer</span>
        </h3>
        <p className="text-[11px] text-slate-500">
          Upload custom product photos and videos, embed YouTube/Vimeo demos, arrange gallery order, and configure catalog card previews.
        </p>
      </div>

      {/* Main Media Strategy & Catalog Card Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Primary Showcase Media Type
          </label>
          <select
            value={mainMediaType}
            onChange={(e) => onChange({ mainMediaType: e.target.value as any })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
          >
            <option value="image">Main Product Image (Traditional)</option>
            <option value="video">Main Product Video (Immersive Demo)</option>
            <option value="both">Image and Video Together (Multi-Media)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Catalog Card Presentation Mode
          </label>
          <select
            value={catalogMediaMode}
            onChange={(e) => onChange({ catalogMediaMode: e.target.value as any })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
          >
            <option value="hover_preview">Hover Preview (Show secondary photo on mouseover)</option>
            <option value="video_thumbnail">Video Thumbnail (With Play Badge)</option>
            <option value="gallery_preview">Image-First Gallery</option>
            <option value="image_only">Main Image Only</option>
          </select>
        </div>
      </div>

      {/* Current Media Items List (Reorder, Primary, Visibility, Delete) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800">
            Current Media Gallery ({mediaGallery.length} items)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            ★ Star indicates Primary Product Showcase
          </span>
        </div>

        {mediaGallery.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-slate-500">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-medium text-xs">No custom media uploaded yet.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Currently using default thematic illustration cover. Add photos or videos below.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {mediaGallery.map((item, idx) => {
              const isVideo = item.type === 'video';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                    item.isPrimary ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Media Thumbnail */}
                    <div className="w-16 h-12 rounded-lg bg-slate-900 border border-slate-300 overflow-hidden shrink-0 relative flex items-center justify-center">
                      {isVideo ? (
                        <div
                          className="w-full h-full bg-cover bg-center flex items-center justify-center"
                          style={{ backgroundImage: item.posterUrl ? `url(${item.posterUrl})` : undefined }}
                        >
                          <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
                            <Play className="w-3 h-3 fill-current pl-0.5" />
                          </div>
                        </div>
                      ) : (
                        <img src={item.url} alt={item.altText || ''} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {item.altText || (isVideo ? 'Product Video' : 'Product Image')}
                        </span>
                        {item.isPrimary && (
                          <span className="text-[9px] font-mono bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded shadow-xs">
                            PRIMARY
                          </span>
                        )}
                        <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {isVideo ? (item.videoProvider || 'video').toUpperCase() : 'IMAGE'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        {item.caption || item.url.slice(0, 50)}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Reordering */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(item.id)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        item.isPrimary
                          ? 'text-amber-500 bg-amber-50'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                      }`}
                      title={item.isPrimary ? 'Primary Showcase Media' : 'Set as Primary Media'}
                    >
                      <Star className={`w-4 h-4 ${item.isPrimary ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(item.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      title={item.isVisible ? 'Visible in gallery' : 'Hidden from gallery'}
                    >
                      {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-rose-500" />}
                    </button>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === mediaGallery.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="Remove Media"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Media Section */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-bold text-slate-900 text-xs">Add Media to Product</span>
          <div className="flex items-center gap-1 font-semibold text-[11px]">
            <button
              type="button"
              onClick={() => setActiveMediaTab('upload')}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                activeMediaTab === 'upload' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setActiveMediaTab('url')}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                activeMediaTab === 'url' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Paste URL / Embed
            </button>
            <button
              type="button"
              onClick={() => setActiveMediaTab('library')}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                activeMediaTab === 'library' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Media Library
            </button>
          </div>
        </div>

        {/* Error notification */}
        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="text-[11px] leading-relaxed">{uploadError}</div>
          </div>
        )}

        {/* TAB 1: UPLOAD FILE FROM DEVICE */}
        {activeMediaTab === 'upload' && (
          <div className="space-y-3">
            <div className="p-6 bg-white border-2 border-dashed border-slate-300 rounded-xl text-center space-y-3">
              <Upload className="w-8 h-8 text-blue-600 mx-auto" />
              <div>
                <p className="font-semibold text-slate-900 text-xs">
                  Upload Product Image or Video from Device
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supported formats: JPG, PNG, WebP, GIF, MP4, WebM (up to 80MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
              />

              {isUploading && (
                <div className="w-full max-w-xs mx-auto space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                    <span>Reading & optimizing file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 text-[11px] mb-1">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  placeholder="e.g. Notion Workspace Dashboard Preview"
                  value={altTextInput}
                  onChange={(e) => setAltTextInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 text-[11px] mb-1">Optional Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Includes 14 customizable database views"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PASTE URL (IMAGE OR VIDEO EMBED) */}
        {activeMediaTab === 'url' && (
          <form onSubmit={handleAddFromUrl} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-medium text-[11px]">Media Type:</span>
              <button
                type="button"
                onClick={() => setMediaTypeToAdd('image')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  mediaTypeToAdd === 'image' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setMediaTypeToAdd('video')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  mediaTypeToAdd === 'video' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                Video / YouTube / Vimeo
              </button>
            </div>

            <div>
              <label className="block text-slate-700 font-medium text-[11px] mb-1">
                {mediaTypeToAdd === 'video'
                  ? 'Video URL (YouTube, Vimeo, or direct MP4 link)'
                  : 'Image URL (JPG, PNG, WebP)'}
              </label>
              <input
                type="url"
                required
                placeholder={
                  mediaTypeToAdd === 'video'
                    ? 'https://www.youtube.com/watch?v=... or https://vimeo.com/...'
                    : 'https://images.unsplash.com/...'
                }
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
              />
            </div>

            {mediaTypeToAdd === 'video' && (
              <div>
                <label className="block text-slate-700 font-medium text-[11px] mb-1">
                  Video Poster / Thumbnail Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://... poster image for video card"
                  value={posterUrlInput}
                  onChange={(e) => setPosterUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 text-[11px] mb-1">Alt Text / Title</label>
                <input
                  type="text"
                  placeholder="Descriptive label"
                  value={altTextInput}
                  onChange={(e) => setAltTextInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 text-[11px] mb-1">Caption</label>
                <input
                  type="text"
                  placeholder="Caption under player"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Add {mediaTypeToAdd === 'video' ? 'Video' : 'Image'} to Gallery
            </button>
          </form>
        )}

        {/* TAB 3: CURATED MEDIA LIBRARY */}
        {activeMediaTab === 'library' && (
          <div className="space-y-4">
            <div>
              <span className="block font-semibold text-slate-800 text-[11px] mb-2">
                Curated High-Res Product Photos
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CURATED_MEDIA_LIBRARY.images.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => handleAddFromLibrary(img, 'image')}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs cursor-pointer transition-all group"
                  >
                    <div
                      className="w-full h-16 rounded bg-slate-200 bg-cover bg-center mb-1 group-hover:scale-[1.02] transition-transform"
                      style={{ backgroundImage: `url(${img.thumbnailUrl || img.url})` }}
                    />
                    <div className="font-semibold text-slate-900 text-[10px] truncate">{img.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{img.category}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="block font-semibold text-slate-800 text-[11px] mb-2">
                Curated Looping Video Walkthroughs
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CURATED_MEDIA_LIBRARY.videos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => handleAddFromLibrary(vid, 'video')}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:border-rose-500 hover:shadow-xs cursor-pointer transition-all group"
                  >
                    <div
                      className="w-full h-16 rounded bg-slate-900 bg-cover bg-center mb-1 flex items-center justify-center relative"
                      style={{ backgroundImage: `url(${vid.poster})` }}
                    >
                      <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
                        <Play className="w-3 h-3 fill-current pl-0.5" />
                      </div>
                    </div>
                    <div className="font-semibold text-slate-900 text-[10px] truncate">{vid.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      {vid.category} · {vid.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
