// =============================================================================
// VeritasCraft — Article Block Editor (Editorial CMS)
// Advanced Block-Based Editor Supporting Images, Videos (YouTube/Vimeo/Direct),
// Two-Column Layouts, Quotes, Lists, Affiliate Cards, Typography, and Links
// =============================================================================

import React, { useState } from 'react';
import {
  BlogPost,
  ArticleContentBlock,
  ArticleBlockType,
  ImageAlignment,
  VideoAlignment,
  VideoProvider,
  LinkItem,
} from '../../types';
import { useStore } from '../../context/StoreContext';
import { CURATED_MEDIA_LIBRARY, parseVideoUrl, sanitizeUrl, convertLegacyPostToBlocks, compressImageFile } from '../../utils/mediaEmbed';
import { VideoPlayerEmbed } from '../common/VideoPlayerEmbed';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Eye,
  EyeOff,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Video,
  Columns,
  Quote,
  List,
  ListOrdered,
  DollarSign,
  MousePointer,
  Minus,
  Sparkles,
  Link as LinkIcon,
  Upload,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Film,
  Play,
  RotateCcw,
} from 'lucide-react';

interface ArticleBlockEditorProps {
  post: BlogPost;
  onChange: (updated: Partial<BlogPost>) => void;
  showNotification: (msg: string) => void;
}

export const ArticleBlockEditor: React.FC<ArticleBlockEditorProps> = ({
  post,
  onChange,
  showNotification,
}) => {
  const { products, blogPosts } = useStore();

  // Ensure blocks exist (auto-convert legacy markdown if empty)
  const blocks: ArticleContentBlock[] =
    post.contentBlocks && post.contentBlocks.length > 0
      ? post.contentBlocks
      : convertLegacyPostToBlocks(post.content);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    blocks[0]?.id || null
  );

  // Link Insertion Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [targetBlockIdForLink, setTargetBlockIdForLink] = useState<string | null>(null);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);
  const [linkIsAffiliate, setLinkIsAffiliate] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Quick Block Inserter Menu State
  const [insertTargetIndex, setInsertTargetIndex] = useState<number | null>(null);
  const [isInsertMenuOpen, setIsInsertMenuOpen] = useState(false);

  // Update a single block
  const handleUpdateBlock = (id: string, updates: Partial<ArticleContentBlock>) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, ...updates } : b));
    onChange({ contentBlocks: updated });
  };

  // Add block at a specific position
  const handleAddBlock = (type: ArticleBlockType, atIndex?: number) => {
    const newBlockId = `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let newBlock: ArticleContentBlock;

    switch (type) {
      case 'heading':
        newBlock = {
          id: newBlockId,
          type: 'heading',
          headingLevel: 2,
          content: 'New Section Subheading',
        };
        break;
      case 'image':
        newBlock = {
          id: newBlockId,
          type: 'image',
          imageUrl: CURATED_MEDIA_LIBRARY.images[0].url,
          imageAlt: 'Editorial illustration',
          imageCaption: 'Figure 1: Visual breakdown of editorial workflow.',
          imageAlign: 'center',
          imageWidth: 100,
          imageAspectRatio: '16/9',
        };
        break;
      case 'video':
        newBlock = {
          id: newBlockId,
          type: 'video',
          videoUrl: CURATED_MEDIA_LIBRARY.videos[0].url,
          videoPosterUrl: CURATED_MEDIA_LIBRARY.videos[0].poster,
          videoCaption: 'Watch the step-by-step walkthrough demo.',
          videoAlign: 'center',
          videoAspectRatio: '16/9',
          videoProvider: 'direct',
        };
        break;
      case 'two_column':
        newBlock = {
          id: newBlockId,
          type: 'two_column',
          twoColumnLayout: {
            leftType: 'text',
            rightType: 'image',
            textContent: 'Strategic visual hierarchy is essential for high-converting editorial articles. Pairing targeted imagery with clear prose boosts retention by 42%.',
            mediaUrl: CURATED_MEDIA_LIBRARY.images[1].url,
            mediaCaption: 'Workspace blueprint review',
            mediaType: 'image',
            ratio: '50_50',
          },
        };
        break;
      case 'quote':
        newBlock = {
          id: newBlockId,
          type: 'quote',
          content: 'The most profitable creators do not chase algorithms. They build evergreen publishing assets with compounding traffic.',
        };
        break;
      case 'bullet_list':
        newBlock = {
          id: newBlockId,
          type: 'bullet_list',
          listItems: [
            'Target high-intent visual search keywords first',
            'Design vertical 2:3 pins with high contrast typography',
            'Publish fresh pin URLs rather than repinning stale links',
          ],
        };
        break;
      case 'numbered_list':
        newBlock = {
          id: newBlockId,
          type: 'numbered_list',
          listItems: [
            'Audit existing product catalogue and customer reviews',
            'Extract high-volume search queries and predictive tiles',
            'Automate pin scheduling to maintain a consistent daily cadence',
          ],
        };
        break;
      case 'affiliate_card':
        const prod = products[0];
        newBlock = {
          id: newBlockId,
          type: 'affiliate_card',
          affiliateCard: {
            productId: prod?.id,
            title: prod?.name || 'Recommended Notion System',
            subtitle: prod?.shortDescription || 'Essential digital asset for growing creators.',
            imageUrl: CURATED_MEDIA_LIBRARY.images[0].url,
            price: prod?.price || 39,
            destinationUrl: `/product/${prod?.slug || 'notion-creator-os'}`,
            disclosureNote: 'Affiliate partner link: we may earn a vetted commission at no extra cost to you.',
            badgeText: 'Verified Companion Resource',
            buttonLabel: 'Get the Operating System →',
            isSponsored: true,
          },
        };
        break;
      case 'button_cta':
        newBlock = {
          id: newBlockId,
          type: 'button_cta',
          buttonCta: {
            label: 'Download the Free Traffic Blueprint →',
            url: '/product/notion-creator-os',
            style: 'primary',
            align: 'center',
            isAffiliate: false,
          },
        };
        break;
      case 'divider':
        newBlock = {
          id: newBlockId,
          type: 'divider',
        };
        break;
      default:
        newBlock = {
          id: newBlockId,
          type: 'paragraph',
          content: 'Add your insightful editorial paragraph content here. Support your arguments with specific data points, case studies, or operational observations.',
        };
        break;
    }

    const copy = [...blocks];
    if (typeof atIndex === 'number' && atIndex >= 0 && atIndex <= copy.length) {
      copy.splice(atIndex, 0, newBlock);
    } else {
      copy.push(newBlock);
    }

    onChange({ contentBlocks: copy });
    setSelectedBlockId(newBlockId);
    setIsInsertMenuOpen(false);
    showNotification(`Inserted new ${type.replace('_', ' ')} block!`);
  };

  // Reorder Block
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }
    const copy = [...blocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange({ contentBlocks: copy });
  };

  // Duplicate Block
  const handleDuplicateBlock = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const original = blocks[idx];
    const duplicated: ArticleContentBlock = {
      ...JSON.parse(JSON.stringify(original)),
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const copy = [...blocks];
    copy.splice(idx + 1, 0, duplicated);
    onChange({ contentBlocks: copy });
    setSelectedBlockId(duplicated.id);
    showNotification('Duplicated content block.');
  };

  // Delete Block
  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      showNotification('Cannot delete the last remaining article block.');
      return;
    }
    const filtered = blocks.filter((b) => b.id !== id);
    onChange({ contentBlocks: filtered });
    if (selectedBlockId === id) {
      setSelectedBlockId(filtered[0]?.id || null);
    }
    showNotification('Removed content block.');
  };

  // Handle Link Modal Submission
  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError(null);

    const safeUrl = sanitizeUrl(linkUrl);
    if (safeUrl === '#invalid-url') {
      setLinkError('Dangerous URL scheme detected. JavaScript URLs are blocked for security.');
      return;
    }

    if (!targetBlockIdForLink) return;

    const block = blocks.find((b) => b.id === targetBlockIdForLink);
    if (!block) return;

    const newLink: LinkItem = {
      text: linkText || linkUrl,
      url: safeUrl,
      target: linkOpenNewTab ? '_blank' : '_self',
      isAffiliate: linkIsAffiliate,
      rel: linkIsAffiliate
        ? 'sponsored nofollow noopener noreferrer'
        : linkOpenNewTab
        ? 'noopener noreferrer'
        : undefined,
    };

    const existingLinks = block.links || [];
    handleUpdateBlock(targetBlockIdForLink, {
      links: [...existingLinks, newLink],
    });

    if (linkIsAffiliate) {
      onChange({ hasAffiliateLinks: true, affiliateDisclosureRequired: true });
    }

    setIsLinkModalOpen(false);
    setLinkText('');
    setLinkUrl('');
    setLinkIsAffiliate(false);
    showNotification('Link embedded into content block!');
  };

  // File Upload Helper for Article Media
  const handleUploadBlockMedia = async (blockId: string, file: File, type: 'image' | 'video') => {
    if (type === 'video') {
      if (/\.(mkv|avi|wmv)$/i.test(file.name)) {
        showNotification('Unsupported format. Please upload MP4 or WebM video for web playback.');
        return;
      }
    }
    try {
      let dataUrl: string;
      if (type === 'image') {
        dataUrl = await compressImageFile(file, 1920, 1920, 0.85);
        handleUpdateBlock(blockId, {
          imageUrl: dataUrl,
          imageAlt: file.name.replace(/\.[^/.]+$/, ''),
        });
      } else {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        handleUpdateBlock(blockId, {
          videoUrl: dataUrl,
          videoProvider: 'direct',
        });
      }
      showNotification(`Uploaded article ${type}: ${file.name}`);
    } catch (err) {
      console.error('Failed to upload article media:', err);
      showNotification('Failed to read and process media file.');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Top Controls: Global Disclosure & Insert Toolbar */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-900 text-xs block">
              Block-Based Editorial Canvas ({blocks.length} blocks)
            </span>
            <span className="text-[11px] text-slate-500">
              Insert photos, videos, and CTA modules anywhere. Reorder blocks freely without losing surrounding copy.
            </span>
          </div>

          {/* Quick Insert Menu Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setInsertTargetIndex(blocks.length);
                setIsInsertMenuOpen(!isInsertMenuOpen);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Content Block
            </button>

            {/* Block Type Picker Popup */}
            {isInsertMenuOpen && (
              <div className="absolute right-0 top-10 z-30 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 block">
                  Select Block Type
                </span>
                {[
                  { type: 'paragraph', label: 'Paragraph Text', icon: Type },
                  { type: 'heading', label: 'Section Heading (H2/H3)', icon: Heading2 },
                  { type: 'image', label: 'Image (Upload / Library)', icon: ImageIcon },
                  { type: 'video', label: 'Video (YouTube / Vimeo / MP4)', icon: Video },
                  { type: 'two_column', label: 'Two-Column (Media + Text)', icon: Columns },
                  { type: 'quote', label: 'Pull Quote / Callout', icon: Quote },
                  { type: 'bullet_list', label: 'Bullet Points', icon: List },
                  { type: 'numbered_list', label: 'Numbered Steps', icon: ListOrdered },
                  { type: 'affiliate_card', label: 'Affiliate Product Box', icon: DollarSign },
                  { type: 'button_cta', label: 'CTA Button Link', icon: MousePointer },
                  { type: 'divider', label: 'Section Divider', icon: Minus },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => handleAddBlock(item.type as any, insertTargetIndex || blocks.length)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Affiliate Disclosure Notice Configuration */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={post.affiliateDisclosureRequired}
              onChange={(e) => onChange({ affiliateDisclosureRequired: e.target.checked })}
              className="w-3.5 h-3.5 text-blue-600 rounded"
            />
            <span>Enable Mandatory Affiliate / Transparency Disclosure Notice</span>
          </label>

          <span className="text-slate-400 font-mono text-[10px]">
            {post.hasAffiliateLinks ? '⚡ Contains active affiliate links' : 'Clean editorial'}
          </span>
        </div>
      </div>

      {/* Main Blocks List */}
      <div className="space-y-4">
        {blocks.map((block, idx) => {
          const isSelected = selectedBlockId === block.id;

          return (
            <div
              key={block.id}
              onClick={() => setSelectedBlockId(block.id)}
              className={`rounded-xl border transition-all p-4 relative group ${
                isSelected
                  ? 'border-blue-500 bg-white ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Block Header & Reorder Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded uppercase">
                    {block.type.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    #{idx + 1}
                  </span>
                  {block.links && block.links.length > 0 && (
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <LinkIcon className="w-2.5 h-2.5" />
                      <span>{block.links.length} Link{block.links.length > 1 ? 's' : ''}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Link Modal Trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTargetBlockIdForLink(block.id);
                      setIsLinkModalOpen(true);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                    title="Insert or Edit Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateBlock(block.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                    title="Duplicate Block"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveBlock(idx, 'up');
                    }}
                    className="p-1 rounded text-slate-500 hover:text-slate-700 disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={idx === blocks.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveBlock(idx, 'down');
                    }}
                    className="p-1 rounded text-slate-500 hover:text-slate-700 disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBlock(block.id);
                    }}
                    className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                    title="Delete Block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* BLOCK TYPE EDITORS */}

              {/* 1. PARAGRAPH BLOCK */}
              {block.type === 'paragraph' && (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={block.content || ''}
                    onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                    placeholder="Write article paragraph..."
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs leading-relaxed focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                  {/* Embedded Links Tags */}
                  {block.links && block.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {block.links.map((lnk, lIdx) => (
                        <span
                          key={lIdx}
                          className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono text-slate-700 flex items-center gap-1 border border-slate-200"
                        >
                          <ExternalLink className="w-2.5 h-2.5 text-blue-600" />
                          <span>{lnk.text}</span>
                          {lnk.isAffiliate && <span className="text-amber-600 font-bold">($)</span>}
                          <button
                            type="button"
                            onClick={() => {
                              const remaining = block.links!.filter((_, i) => i !== lIdx);
                              handleUpdateBlock(block.id, { links: remaining });
                            }}
                            className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. HEADING BLOCK */}
              {block.type === 'heading' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Level:</span>
                    {([2, 3, 4] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleUpdateBlock(block.id, { headingLevel: lvl })}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer ${
                          (block.headingLevel || 2) === lvl
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        H{lvl}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={block.content || ''}
                    onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                    placeholder="Enter section heading..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-serif font-bold text-sm text-slate-900"
                  />
                </div>
              )}

              {/* 3. IMAGE BLOCK (UPLOAD, LIBRARY, URL, ALIGNMENT, CAPTION, WIDTH) */}
              {block.type === 'image' && (
                <div className="space-y-4">
                  {/* Image Preview & URL */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-full sm:w-44 h-28 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                      {block.imageUrl ? (
                        <img src={block.imageUrl} alt={block.imageAlt || ''} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div>
                        <label className="block text-slate-600 text-[11px] mb-1">Image URL / Source</label>
                        <input
                          type="text"
                          value={block.imageUrl || ''}
                          onChange={(e) => handleUpdateBlock(block.id, { imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer text-[11px]">
                          <Upload className="w-3 h-3 text-blue-600" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadBlockMedia(block.id, file, 'image');
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            const randomImg = CURATED_MEDIA_LIBRARY.images[Math.floor(Math.random() * CURATED_MEDIA_LIBRARY.images.length)];
                            handleUpdateBlock(block.id, {
                              imageUrl: randomImg.url,
                              imageAlt: randomImg.name,
                            });
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer text-[11px]"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>From Library</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Alignment & Layout Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Placement / Alignment</label>
                      <select
                        value={block.imageAlign || 'center'}
                        onChange={(e) => handleUpdateBlock(block.id, { imageAlign: e.target.value as ImageAlignment })}
                        className="w-full px-2 py-1.5 bg-slate-50 border rounded text-xs"
                      >
                        <option value="center">Centered</option>
                        <option value="full">Full Bleed Width</option>
                        <option value="left">Aligned Left</option>
                        <option value="right">Aligned Right</option>
                        <option value="float_left">Float Left (Text wraps right)</option>
                        <option value="float_right">Float Right (Text wraps left)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">
                        Width ({block.imageWidth || 100}%)
                      </label>
                      <input
                        type="range"
                        min="25"
                        max="100"
                        step="5"
                        value={block.imageWidth || 100}
                        onChange={(e) => handleUpdateBlock(block.id, { imageWidth: Number(e.target.value) })}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Clickable Link URL (Optional)</label>
                      <input
                        type="text"
                        value={block.imageLinkUrl || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { imageLinkUrl: e.target.value })}
                        placeholder="https://... or /product/..."
                        className="w-full px-2 py-1.5 bg-slate-50 border rounded text-xs"
                      >
                      </input>
                    </div>
                  </div>

                  {/* Caption & Alt Text */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Alt Text (Accessibility)</label>
                      <input
                        type="text"
                        value={block.imageAlt || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { imageAlt: e.target.value })}
                        placeholder="Descriptive text for screen readers"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Visible Caption</label>
                      <input
                        type="text"
                        value={block.imageCaption || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { imageCaption: e.target.value })}
                        placeholder="Photo credit or figure note"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. VIDEO BLOCK (YOUTUBE, VIMEO, DIRECT MP4/WEBM, UPLOAD) */}
              {block.type === 'video' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">
                        Video URL (YouTube, Vimeo, or direct MP4 link)
                      </label>
                      <input
                        type="text"
                        value={block.videoUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const parsed = parseVideoUrl(val);
                          handleUpdateBlock(block.id, {
                            videoUrl: val,
                            videoProvider: parsed.provider,
                          });
                        }}
                        placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs"
                      />
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Detected Provider: {(block.videoProvider || 'direct').toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">
                        Poster Image URL (Thumbnail)
                      </label>
                      <input
                        type="text"
                        value={block.videoPosterUrl || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { videoPosterUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Video Preview in Editor */}
                  {block.videoUrl && (
                    <div className="max-w-md mx-auto">
                      <VideoPlayerEmbed
                        url={block.videoUrl}
                        posterUrl={block.videoPosterUrl}
                        provider={block.videoProvider}
                        aspectRatio={block.videoAspectRatio || '16/9'}
                        caption={block.videoCaption}
                        title={block.videoTitle}
                        controls={true}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Video Caption</label>
                      <input
                        type="text"
                        value={block.videoCaption || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { videoCaption: e.target.value })}
                        placeholder="Video description under player"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Aspect Ratio</label>
                      <select
                        value={block.videoAspectRatio || '16/9'}
                        onChange={(e) => handleUpdateBlock(block.id, { videoAspectRatio: e.target.value as any })}
                        className="w-full px-2 py-1.5 bg-slate-50 border rounded text-xs"
                      >
                        <option value="16/9">16:9 Standard Widescreen</option>
                        <option value="4/3">4:3 Classic</option>
                        <option value="1/1">1:1 Square</option>
                        <option value="9/16">9:16 Vertical / Mobile</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. TWO-COLUMN TEXT & MEDIA LAYOUT */}
              {block.type === 'two_column' && block.twoColumnLayout && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left side text */}
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Text Column Content</label>
                      <textarea
                        rows={4}
                        value={block.twoColumnLayout.textContent}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            twoColumnLayout: {
                              ...block.twoColumnLayout!,
                              textContent: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs leading-relaxed"
                      />
                    </div>

                    {/* Right side media */}
                    <div className="space-y-2">
                      <label className="block text-slate-600 text-[11px]">Media Column URL</label>
                      <input
                        type="text"
                        value={block.twoColumnLayout.mediaUrl}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            twoColumnLayout: {
                              ...block.twoColumnLayout!,
                              mediaUrl: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs"
                      />
                      <div className="w-full h-24 rounded bg-slate-100 overflow-hidden flex items-center justify-center border">
                        {block.twoColumnLayout.mediaUrl ? (
                          <img src={block.twoColumnLayout.mediaUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400">Preview</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. QUOTE / CALLOUT BLOCK */}
              {block.type === 'quote' && (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={block.content || ''}
                    onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                    placeholder="Enter inspiring quote or editorial callout..."
                    className="w-full px-3 py-2 bg-blue-50/40 border border-blue-200 rounded font-serif italic text-xs text-slate-800"
                  />
                </div>
              )}

              {/* 7. BULLET / NUMBERED LIST BLOCKS */}
              {(block.type === 'bullet_list' || block.type === 'numbered_list') && (
                <div className="space-y-2">
                  <label className="block text-slate-600 text-[11px]">
                    List Items (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={(block.listItems || []).join('\n')}
                    onChange={(e) =>
                      handleUpdateBlock(block.id, {
                        listItems: e.target.value.split('\n').filter(Boolean),
                      })
                    }
                    placeholder="Item 1&#10;Item 2&#10;Item 3"
                    className="w-full px-3 py-2 bg-slate-50 border rounded font-mono text-xs leading-relaxed"
                  />
                </div>
              )}

              {/* 8. AFFILIATE RECOMMENDATION CARD */}
              {block.type === 'affiliate_card' && block.affiliateCard && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Affiliate Product Showcase Box</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                      Rel="sponsored" Enabled
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Product Title</label>
                      <input
                        type="text"
                        value={block.affiliateCard.title}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            affiliateCard: { ...block.affiliateCard!, title: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={block.affiliateCard.price || ''}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            affiliateCard: { ...block.affiliateCard!, price: Number(e.target.value) },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Destination Affiliate URL</label>
                    <input
                      type="text"
                      value={block.affiliateCard.destinationUrl}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, {
                          affiliateCard: { ...block.affiliateCard!, destinationUrl: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border rounded text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Button Text</label>
                      <input
                        type="text"
                        value={block.affiliateCard.buttonLabel}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            affiliateCard: { ...block.affiliateCard!, buttonLabel: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">Badge Label</label>
                      <input
                        type="text"
                        value={block.affiliateCard.badgeText || ''}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            affiliateCard: { ...block.affiliateCard!, badgeText: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 9. BUTTON CTA BLOCK */}
              {block.type === 'button_cta' && block.buttonCta && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Button Label</label>
                    <input
                      type="text"
                      value={block.buttonCta.label}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, {
                          buttonCta: { ...block.buttonCta!, label: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Destination URL</label>
                    <input
                      type="text"
                      value={block.buttonCta.url}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, {
                          buttonCta: { ...block.buttonCta!, url: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 border rounded text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* 10. DIVIDER */}
              {block.type === 'divider' && (
                <div className="py-2 text-center text-slate-300">
                  <div className="border-b border-dashed border-slate-300 w-full" />
                </div>
              )}

              {/* Insert Between Buttons */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setInsertTargetIndex(idx + 1);
                    setIsInsertMenuOpen(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded cursor-pointer"
                >
                  + Insert block after this
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* LINK INSERTION MODAL */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveLink}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span>Insert or Edit Hyperlink</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {linkError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-[11px]">
                {linkError}
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Anchor Text</label>
              <input
                type="text"
                required
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Creator Operating System"
                className="w-full px-3 py-2 bg-slate-50 border rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Destination URL</label>
              <input
                type="text"
                required
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://... or /product/... or /blog/..."
                className="w-full px-3 py-2 bg-slate-50 border rounded text-xs font-mono"
              />
            </div>

            {/* Internal Page Quick Picker */}
            <div>
              <label className="block text-slate-600 text-[10px] font-mono mb-1">
                Or Pick Internal Store Page:
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setLinkUrl(e.target.value);
                    if (!linkText) {
                      const selectedText = e.target.options[e.target.selectedIndex].text;
                      setLinkText(selectedText);
                    }
                  }
                }}
                className="w-full px-2 py-1.5 bg-slate-100 border rounded text-[11px]"
              >
                <option value="">Select internal product or article...</option>
                <optgroup label="Storefront Products">
                  {products.map((p) => (
                    <option key={p.id} value={`/product/${p.slug}`}>
                      Product: {p.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Editorial Articles">
                  {blogPosts.map((b) => (
                    <option key={b.id} value={`/blog/${b.slug}`}>
                      Article: {b.title}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkOpenNewTab}
                  onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                  className="w-3.5 h-3.5 text-blue-600 rounded"
                />
                <span>Open in a new browser tab (_blank)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkIsAffiliate}
                  onChange={(e) => setLinkIsAffiliate(e.target.checked)}
                  className="w-3.5 h-3.5 text-amber-600 rounded"
                />
                <span className="font-semibold text-amber-900">
                  Mark as Affiliate Link (rel="sponsored nofollow")
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
              >
                Insert Link
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
