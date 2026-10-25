// =============================================================================
// VeritasCraft — Article View (Editorial Publishing CMS)
// Upgraded to render rich content blocks (Images, Videos, 2-Column layouts,
// Affiliate Cards, Bullet/Numbered Lists, Quotes, and Links)
// =============================================================================

import React, { useState } from 'react';
import { BlogPost, ArticleContentBlock, BlogComment } from '../../types';
import { useStore } from '../../context/StoreContext';
import { BlogCover } from '../illustrations/BlogCover';
import { VideoPlayerEmbed } from '../common/VideoPlayerEmbed';
import { convertLegacyPostToBlocks } from '../../utils/mediaEmbed';
import {
  Clock,
  User,
  Calendar,
  Share2,
  Bookmark,
  Check,
  Send,
  Download,
  AlertCircle,
  ArrowRight,
  List,
  ExternalLink,
  DollarSign,
  Quote as QuoteIcon,
  Film,
} from 'lucide-react';

interface ArticleViewProps {
  articleSlug?: string;
  previewPost?: BlogPost;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ articleSlug, previewPost }) => {
  const { blogPosts, products, addToCart, setCurrentPage, setSelectedProductSlug, showNotification } = useStore();
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const post = previewPost || (articleSlug ? blogPosts.find((b) => b.slug === articleSlug) : null) || blogPosts[0];
  const promotedProduct = products.find((p) => p.id === post.promotedProductId);

  // Content blocks: use post.contentBlocks if available, else convert legacy markdown
  const blocks: ArticleContentBlock[] =
    post.contentBlocks && post.contentBlocks.length > 0
      ? post.contentBlocks
      : convertLegacyPostToBlocks(post.content);

  // Dynamic Table of Contents scanning actual heading blocks
  const headingBlocks = blocks.filter((b) => b.type === 'heading' && b.content);
  const tocItems = headingBlocks.map((b, idx) => ({
    title: b.content || `Section ${idx + 1}`,
    id: `heading-sec-${idx + 1}`,
  }));

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentText) return;
    setCommentSubmitted(true);
    showNotification('Comment submitted! It will appear after quick editorial moderation.');
    setCommentName('');
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Article URL copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-mono flex items-center gap-2 mb-6">
        <button onClick={() => setCurrentPage('home')} className="hover:text-slate-900 cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button onClick={() => setCurrentPage('blog')} className="hover:text-slate-900 cursor-pointer">
          Editorial
        </button>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{post.category}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-4">
          <span className="uppercase text-[var(--theme-primary)] font-semibold">{post.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {post.publishedAt}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.estimatedReadTime} min read
          </span>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[var(--theme-text)] leading-[1.15] mb-6 text-balance">
          {post.title}
        </h1>

        <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6 font-sans">
          {post.excerpt}
        </p>

        {/* Author Byline & Sharing Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--theme-border)] text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-sm">
              {post.author.name[0]}
            </div>
            <div>
              <div className="font-semibold text-slate-900">{post.author.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">{post.author.roleTitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button
              onClick={() => {
                setCurrentPage('pinterest_studio');
                showNotification('Opened Pin Studio for this article!');
              }}
              className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Bookmark className="w-3.5 h-3.5" /> Pin to Pinterest
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Illustration or Image */}
      <div className="aspect-16/9 w-full rounded-2xl overflow-hidden shadow-lg border border-[var(--theme-border)] bg-slate-900 mb-10">
        <BlogCover type={post.featuredImage} className="w-full h-full" title={post.title} category={post.category} />
      </div>

      {/* Affiliate & Transparent Disclosure Banner */}
      {(post.affiliateDisclosureRequired || post.hasAffiliateLinks) && (
        <aside aria-label="Editorial disclosure" className="p-4 bg-slate-100 rounded-xl border border-slate-200/80 mb-10 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Editorial Transparency Notice:</strong>{' '}
            {post.affiliateDisclosureText ||
              'This article contains honest recommendations for digital tools and companion resources. When you purchase through our links, we may earn an affiliate commission at no extra cost to you. We only feature systems vetted in active production.'}
          </div>
        </aside>
      )}

      {/* Table of Contents (Generated dynamically from article headings) */}
      {tocItems.length > 0 && (
        <div className="p-6 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] mb-12 shadow-xs">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-[var(--theme-text)] mb-3">
            <List className="w-4 h-4 text-[var(--theme-primary)]" />
            <h3>Table of Contents</h3>
          </div>
          <ul className="space-y-2 text-xs">
            {tocItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="font-mono text-slate-400">0{idx + 1}.</span>
                <a
                  href={`#${item.id}`}
                  className="text-slate-700 hover:text-[var(--theme-primary)] hover:underline transition-colors"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Block-Based Formatted Article Body */}
      <div className="prose prose-slate max-w-none text-slate-800 text-sm md:text-base leading-relaxed space-y-8 font-sans">
        {blocks.map((block, bIdx) => {
          if (block.isHidden) return null;

          switch (block.type) {
            case 'heading': {
              const headingIdx = headingBlocks.findIndex((hb) => hb.id === block.id);
              const anchorId = `heading-sec-${headingIdx + 1}`;
              const Tag = (block.headingLevel === 3 ? 'h3' : block.headingLevel === 4 ? 'h4' : 'h2') as any;
              const sizeClasses =
                block.headingLevel === 3
                  ? 'font-serif text-xl font-bold text-slate-900 pt-4'
                  : block.headingLevel === 4
                  ? 'font-serif text-lg font-bold text-slate-900 pt-2'
                  : 'font-serif text-2xl md:text-3xl font-bold text-slate-900 pt-8 border-t border-[var(--theme-border)]';

              return (
                <Tag key={block.id || bIdx} id={anchorId} className={sizeClasses}>
                  {block.content}
                </Tag>
              );
            }

            case 'image': {
              // Image alignment classes
              let alignContainerClass = 'my-8 flex justify-center';
              let widthClass = 'w-full';

              if (block.imageAlign === 'float_left') {
                alignContainerClass = 'my-4 float-none md:float-left md:mr-6 md:mb-4 max-w-full md:max-w-[45%]';
              } else if (block.imageAlign === 'float_right') {
                alignContainerClass = 'my-4 float-none md:float-right md:ml-6 md:mb-4 max-w-full md:max-w-[45%]';
              } else if (block.imageAlign === 'left') {
                alignContainerClass = 'my-8 flex justify-start';
              } else if (block.imageAlign === 'right') {
                alignContainerClass = 'my-8 flex justify-end';
              }

              const imgElement = (
                <img
                  src={block.imageUrl}
                  alt={block.imageAlt || ''}
                  className="rounded-2xl shadow-md border border-[var(--theme-border)] object-cover w-full max-h-[500px]"
                  loading="lazy"
                />
              );

              return (
                <figure key={block.id || bIdx} className={`${alignContainerClass} clear-both`}>
                  <div style={{ width: block.imageWidth ? `${block.imageWidth}%` : '100%' }} className="max-w-full">
                    {block.imageLinkUrl ? (
                      <a
                        href={block.imageLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:opacity-95 transition-opacity"
                      >
                        {imgElement}
                      </a>
                    ) : (
                      imgElement
                    )}
                    {block.imageCaption && (
                      <figcaption className="text-xs text-slate-500 mt-2 font-sans italic text-center">
                        {block.imageCaption}
                      </figcaption>
                    )}
                  </div>
                </figure>
              );
            }

            case 'video': {
              return (
                <div key={block.id || bIdx} className="my-8 max-w-3xl mx-auto clear-both">
                  <VideoPlayerEmbed
                    url={block.videoUrl || ''}
                    posterUrl={block.videoPosterUrl}
                    provider={block.videoProvider}
                    aspectRatio={block.videoAspectRatio || '16/9'}
                    caption={block.videoCaption}
                    title={block.videoTitle || post.title}
                    controls={true}
                  />
                </div>
              );
            }

            case 'two_column': {
              const layout = block.twoColumnLayout;
              if (!layout) return null;

              return (
                <div
                  key={block.id || bIdx}
                  className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 bg-slate-50/60 rounded-2xl border border-[var(--theme-border)] clear-both"
                >
                  <div className="space-y-3">
                    <p className="text-sm md:text-base leading-relaxed text-slate-800">
                      {layout.textContent}
                    </p>
                  </div>
                  <div>
                    {layout.mediaType === 'video' ? (
                      <VideoPlayerEmbed url={layout.mediaUrl} aspectRatio="16/9" controls={true} />
                    ) : (
                      <img
                        src={layout.mediaUrl}
                        alt=""
                        className="rounded-xl shadow border border-slate-200 object-cover w-full h-56"
                        loading="lazy"
                      />
                    )}
                    {layout.mediaCaption && (
                      <p className="text-[11px] text-slate-500 italic mt-1.5 text-center">
                        {layout.mediaCaption}
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            case 'quote': {
              return (
                <blockquote
                  key={block.id || bIdx}
                  className="my-6 p-6 bg-blue-50/50 rounded-2xl border-l-4 border-[var(--theme-primary)] text-sm md:text-base font-serif italic text-slate-800 shadow-xs relative"
                >
                  <QuoteIcon className="w-6 h-6 text-blue-300 absolute top-3 right-4 opacity-40" />
                  <p className="leading-relaxed relative z-10 m-0">"{block.content}"</p>
                </blockquote>
              );
            }

            case 'bullet_list': {
              return (
                <ul key={block.id || bIdx} className="my-6 space-y-2 list-disc pl-6 text-slate-700">
                  {(block.listItems || []).map((item, iIdx) => (
                    <li key={iIdx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }

            case 'numbered_list': {
              return (
                <ol key={block.id || bIdx} className="my-6 space-y-2 list-decimal pl-6 text-slate-700">
                  {(block.listItems || []).map((item, iIdx) => (
                    <li key={iIdx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ol>
              );
            }

            case 'affiliate_card': {
              const card = block.affiliateCard;
              if (!card) return null;

              return (
                <div
                  key={block.id || bIdx}
                  className="my-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border-2 border-amber-300/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 clear-both"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase bg-amber-500 text-slate-900 font-bold px-2 py-0.5 rounded shadow-xs">
                        {card.badgeText || 'Affiliate Recommendation'}
                      </span>
                      {card.isSponsored && (
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          Sponsored
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-slate-900 m-0">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className="text-xs text-slate-600 leading-relaxed m-0">
                        {card.subtitle}
                      </p>
                    )}
                    {card.price && (
                      <div className="text-xl font-bold font-mono text-slate-900">
                        ${card.price}
                      </div>
                    )}
                    {card.disclosureNote && (
                      <p className="text-[11px] text-slate-500 italic m-0 pt-1">
                        {card.disclosureNote}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    <a
                      href={card.destinationUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow hover:shadow-md cursor-pointer no-underline"
                    >
                      <span>{card.buttonLabel || 'Check Out Resource →'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            }

            case 'button_cta': {
              const cta = block.buttonCta;
              if (!cta) return null;

              const alignClass =
                cta.align === 'left' ? 'justify-start' : cta.align === 'right' ? 'justify-end' : 'justify-center';

              return (
                <div key={block.id || bIdx} className={`my-8 flex ${alignClass} clear-both`}>
                  <a
                    href={cta.url}
                    target="_blank"
                    rel={cta.isAffiliate ? 'sponsored nofollow noopener noreferrer' : 'noopener noreferrer'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-bold rounded-xl transition-colors shadow-md no-underline cursor-pointer"
                  >
                    <span>{cta.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            }

            case 'divider': {
              return (
                <hr
                  key={block.id || bIdx}
                  className="my-10 border-0 border-b border-dashed border-slate-300 clear-both"
                />
              );
            }

            case 'callout': {
              return (
                <div
                  key={block.id || bIdx}
                  className="my-6 p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 flex items-start gap-3.5 clear-both shadow-xs"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm leading-relaxed font-sans">
                    {block.content}
                  </div>
                </div>
              );
            }

            default: {
              // Paragraph with optional embedded links and custom typography styling
              const pStyle: React.CSSProperties = {
                fontFamily: block.style?.fontFamily,
                fontSize: block.style?.fontSize ? `${block.style.fontSize}px` : undefined,
                color: block.style?.color,
                backgroundColor: block.style?.backgroundColor,
                fontWeight: block.style?.fontWeight as any,
                fontStyle: block.style?.fontStyle,
                textDecoration: block.style?.textDecoration,
                textAlign: block.style?.textAlign as any,
                lineHeight: block.style?.lineHeight,
              };

              return (
                <p key={block.id || bIdx} className="leading-relaxed" style={pStyle}>
                  {block.content}
                  {block.links && block.links.length > 0 && (
                    <span className="block mt-2 pt-1">
                      {block.links.map((lnk, lIdx) => (
                        <a
                          key={lIdx}
                          href={lnk.url}
                          target={lnk.target || '_self'}
                          rel={lnk.rel}
                          className="inline-flex items-center gap-1 text-[var(--theme-primary)] hover:underline font-medium text-xs mr-3"
                        >
                          <span>{lnk.text}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </span>
                  )}
                </p>
              );
            }
          }
        })}
      </div>

      {/* Embedded High-Converting Digital Product Box (Promoted product from article metadata) */}
      {promotedProduct && (
        <div className="my-14 p-8 rounded-2xl bg-[var(--theme-surface)] border-2 border-[var(--theme-primary)]/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--theme-primary)] font-bold bg-blue-50 px-2 py-0.5 rounded">
              Recommended Companion Tool
            </span>
            <h3 className="font-serif text-xl font-bold text-slate-900 mt-2 mb-1">
              {promotedProduct.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {promotedProduct.shortDescription}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                ${promotedProduct.price}
              </span>
              {promotedProduct.comparePrice && (
                <span className="text-xs line-through text-slate-400 font-mono tabular-nums">
                  ${promotedProduct.comparePrice}
                </span>
              )}
              <span className="text-xs text-emerald-600 font-semibold">Instant Download Access</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => addToCart(promotedProduct)}
              className="px-6 py-3 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-[var(--theme-radius)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add to Cart (${promotedProduct.price})</span>
            </button>
            <button
              onClick={() => {
                setSelectedProductSlug(promotedProduct.slug);
                setCurrentPage('product_landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-[var(--theme-radius)] transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Product Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Author Bio Box */}
      <div className="p-8 bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] mb-14 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif text-2xl font-bold shrink-0">
          {post.author.name[0]}
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold text-slate-900 mb-1">
            Written by {post.author.name}
          </h4>
          <div className="text-xs font-mono text-[var(--theme-primary)] mb-3">
            {post.author.roleTitle}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            {post.author.bio}
          </p>
        </div>
      </div>

      {/* Moderated Comments Section */}
      <section className="pt-10 border-t border-[var(--theme-border)]">
        <h3 className="font-serif text-2xl font-bold text-[var(--theme-text)] mb-6">
          Discussion & Insights ({post.comments.length})
        </h3>

        {/* Existing Comments */}
        <div className="space-y-4 mb-10">
          {(post.comments || []).map((com: BlogComment) => (
            <div
              key={com.id}
              className="p-5 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] text-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {com.authorName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{com.createdAt}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{com.comment}</p>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <div className="bg-[var(--theme-surface)] p-6 rounded-xl border border-[var(--theme-border)]">
          <h4 className="font-serif text-base font-bold text-slate-900 mb-3">Leave a Thought</h4>
          {commentSubmitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your comment has been received and will publish upon editorial approval.</span>
            </div>
          ) : (
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Comment</label>
                <textarea
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your perspective or ask a question regarding this guide..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Submit Comment
              </button>
            </form>
          )}
        </div>
      </section>
    </article>
  );
};
