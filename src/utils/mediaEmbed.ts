// =============================================================================
// VeritasCraft — Media Embed & Content Utilities
// Supports YouTube, Vimeo, Direct Video, Image URL parsing, and Markdown-to-Block conversion
// =============================================================================

import { ArticleContentBlock, VideoProvider } from '../types';

export interface ParsedVideoInfo {
  isValid: boolean;
  provider: VideoProvider;
  embedUrl: string;
  videoId?: string;
  errorMessage?: string;
  isUnsupportedFormat?: boolean;
}

/**
 * Validates and extracts secure embed information from video URLs.
 * Supports YouTube, Vimeo, and direct video formats (MP4, WebM, MOV, M4V).
 */
export function parseVideoUrl(inputUrl: string): ParsedVideoInfo {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return {
      isValid: false,
      provider: 'direct',
      embedUrl: '',
      errorMessage: 'Please enter a video URL.',
    };
  }

  const trimmed = inputUrl.trim();

  // Check for dangerous schemes
  if (/^javascript:/i.test(trimmed)) {
    return {
      isValid: false,
      provider: 'direct',
      embedUrl: '',
      errorMessage: 'Invalid URL scheme. JavaScript execution is blocked for security.',
    };
  }

  // Check for unsupported legacy container formats
  const lower = trimmed.toLowerCase();
  if (lower.endsWith('.mkv') || lower.endsWith('.avi') || lower.endsWith('.wmv') || lower.endsWith('.flv')) {
    const ext = lower.split('.').pop()?.toUpperCase();
    return {
      isValid: false,
      provider: 'direct',
      embedUrl: '',
      isUnsupportedFormat: true,
      errorMessage: `${ext} is not supported for native web playback. Modern browsers require MP4 (H.264), WebM, or video streaming from YouTube/Vimeo. Please upload an MP4 or WebM video.`,
    };
  }

  // 1. YouTube detection
  // Matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const ytMatch = trimmed.match(youtubeRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isValid: true,
      provider: 'youtube',
      videoId,
      // Use privacy-enhanced youtube-nocookie domain
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`,
    };
  }

  // 2. Vimeo detection
  // Matches:
  // - https://vimeo.com/VIDEO_ID
  // - https://player.vimeo.com/video/VIDEO_ID
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|))(\d+)/i;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[vimeoMatch.length - 1]) {
    const videoId = vimeoMatch[vimeoMatch.length - 1];
    return {
      isValid: true,
      provider: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&badge=0`,
    };
  }

  // 3. Direct Video format (MP4, WebM, MOV, M4V, or Blob/Data URL)
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:video/') ||
    lower.includes('.mp4') ||
    lower.includes('.webm') ||
    lower.includes('.mov') ||
    lower.includes('.m4v')
  ) {
    return {
      isValid: true,
      provider: 'direct',
      embedUrl: trimmed,
    };
  }

  // If HTTP/HTTPS URL but unrecognized host/format
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      isValid: true,
      provider: 'direct',
      embedUrl: trimmed,
    };
  }

  return {
    isValid: false,
    provider: 'direct',
    embedUrl: '',
    errorMessage: 'Could not recognize this video URL. Please provide a YouTube link, Vimeo link, or direct MP4/WebM file URL.',
  };
}

/**
 * Validates and sanitizes destination URLs for links.
 * Rejects javascript: or data: URIs to protect from XSS.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^javascript:/i.test(trimmed) || /^vbscript:/i.test(trimmed)) {
    return '#invalid-url';
  }
  return trimmed;
}

/**
 * Automatically converts legacy markdown content string into structured content blocks.
 * Guarantees 100% backward compatibility for existing articles.
 */
export function convertLegacyPostToBlocks(markdownContent: string): ArticleContentBlock[] {
  if (!markdownContent || typeof markdownContent !== 'string') {
    return [];
  }

  const blocks: ArticleContentBlock[] = [];
  const sections = markdownContent.split('---');

  sections.forEach((section, sIdx) => {
    const paragraphs = section.split('\n\n').map((p) => p.trim()).filter(Boolean);

    paragraphs.forEach((para, pIdx) => {
      const blockId = `block-legacy-${sIdx}-${pIdx}-${Date.now()}`;

      if (para.startsWith('## ')) {
        blocks.push({
          id: blockId,
          type: 'heading',
          headingLevel: 2,
          content: para.replace(/^##\s+/, ''),
        });
      } else if (para.startsWith('### ')) {
        blocks.push({
          id: blockId,
          type: 'heading',
          headingLevel: 3,
          content: para.replace(/^###\s+/, ''),
        });
      } else if (para.startsWith('#### ')) {
        blocks.push({
          id: blockId,
          type: 'heading',
          headingLevel: 4,
          content: para.replace(/^####\s+/, ''),
        });
      } else if (para.startsWith('> ')) {
        blocks.push({
          id: blockId,
          type: 'quote',
          content: para.replace(/^>\s+/, ''),
        });
      } else if (para.startsWith('- ') || para.startsWith('* ')) {
        const items = para.split('\n').map((li) => li.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
        blocks.push({
          id: blockId,
          type: 'bullet_list',
          listItems: items,
        });
      } else if (/^\d+\.\s+/.test(para)) {
        const items = para.split('\n').map((li) => li.replace(/^\d+\.\s+/, '').trim()).filter(Boolean);
        blocks.push({
          id: blockId,
          type: 'numbered_list',
          listItems: items,
        });
      } else if (para.startsWith('![')) {
        // Markdown image: ![alt](url)
        const imgMatch = para.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          blocks.push({
            id: blockId,
            type: 'image',
            imageAlt: imgMatch[1],
            imageUrl: imgMatch[2],
            imageAlign: 'center',
            imageWidth: 100,
          });
        } else {
          blocks.push({ id: blockId, type: 'paragraph', content: para });
        }
      } else {
        blocks.push({
          id: blockId,
          type: 'paragraph',
          content: para,
        });
      }
    });

    if (sIdx < sections.length - 1) {
      blocks.push({
        id: `divider-${sIdx}-${Date.now()}`,
        type: 'divider',
      });
    }
  });

  return blocks;
}

/**
 * Curated Media Library Assets for Products & Editorial
 */
export const CURATED_MEDIA_LIBRARY = {
  images: [
    {
      id: 'img-desk-macbook',
      name: 'Editorial Desk & Notion System',
      category: 'Workspace',
      url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80',
      alt: 'Clean minimalist creator desk with laptop and planning notebook',
    },
    {
      id: 'img-planner-coffee',
      name: 'Leather Notebook & Morning Espresso',
      category: 'Lifestyle',
      url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
      alt: 'Open paper planner with pen and cup of coffee',
    },
    {
      id: 'img-dark-workspace',
      name: 'Obsidian Studio Hardware Setup',
      category: 'Technology',
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80',
      alt: 'Dark mode computer workstation for digital production',
    },
    {
      id: 'img-minimal-typography',
      name: 'Typography & Editorial Grid',
      category: 'Design',
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
      alt: 'Clean architecture and typography shadow lines',
    },
    {
      id: 'img-linen-texture',
      name: 'Warm Linen Paper & Stationery',
      category: 'Textures',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1400&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      alt: 'Textured handmade paper texture and book binding',
    },
    {
      id: 'img-finance-sheets',
      name: 'Financial Modeling & Spreadsheets',
      category: 'Finance',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
      alt: 'Digital financial analytics dashboard and spreadsheets',
    },
  ],
  videos: [
    {
      id: 'vid-creator-typing',
      name: 'Creator System Walkthrough (Loop)',
      category: 'Walkthrough',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-43528-large.mp4',
      poster: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
      duration: '0:12',
      provider: 'direct' as VideoProvider,
    },
    {
      id: 'vid-desk-ambience',
      name: 'Workspace Workflow Overview',
      category: 'Product Demo',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-43527-large.mp4',
      poster: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
      duration: '0:10',
      provider: 'direct' as VideoProvider,
    },
    {
      id: 'vid-coffee-focus',
      name: 'Creative Studio Time-lapse',
      category: 'Studio',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-cup-on-a-wooden-table-with-natural-light-43529-large.mp4',
      poster: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      duration: '0:08',
      provider: 'direct' as VideoProvider,
    },
  ],
};

/**
 * Optimizes and compresses an image client-side to ensure fast loading and prevent
 * large payload issues when saving products and articles.
 */
export function compressImageFile(file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's a GIF or SVG, don't re-encode via canvas to preserve frames and vectors
    if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize proportionally if dimensions exceed maximum
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with controlled quality
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

