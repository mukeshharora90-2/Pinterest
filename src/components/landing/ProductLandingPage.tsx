// =============================================================================
// VeritasCraft — Dedicated High-Converting Product Landing Page Component
// Clean typographic hero, visual media showcase, feature highlights,
// comparison table, bonuses, testimonials, objection FAQs, and product grid
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductCover } from '../illustrations/ProductCover';
import { ProductCard } from '../store/ProductCard';
import { getProductLandingHeroImage, isProductImageUrl } from '../../utils/productMedia';
import {
  Star,
  Check,
  X as CloseIcon,
  ShieldCheck,
  Download,
  Gift,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Zap,
  Lock,
  Play,
  ArrowLeft,
  Settings,
} from 'lucide-react';

interface ProductLandingPageProps {
  productSlug: string;
}

export const ProductLandingPage: React.FC<ProductLandingPageProps> = ({ productSlug }) => {
  const { products, addToCart, setCurrentPage, setSelectedProductSlug, currentUser } = useStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Retrieve the requested product by slug or id, or first product with dedicated landing page enabled, with safe fallback
  const product =
    products.find(
      (p) => Boolean(productSlug) && (p.slug === productSlug || p.id === productSlug)
    ) ||
    products.find((p) => p.hasDedicatedLandingPage) ||
    products[0];

  const config = product?.landingPageConfig || {
    headline: product?.name || 'Exclusive Digital System',
    subheadline: product?.shortDescription || 'Transform your daily workflow with our engineered digital asset.',
    heroBadge: 'Verified Digital Asset',
    ctaText: `Download Instant Access — $${product?.price || 29}`,
    guaranteeText: '30-Day Money-Back Guarantee: If you are not satisfied, we will issue a full refund.',
    whoIsThisFor: ['Designers & creators', 'Independent digital publishers', 'High-volume operators'],
    whoIsThisNotFor: ['People looking for generic uncustomizable templates'],
    featureHighlights: [],
    comparisonTable: [],
    sections: [],
  };

  // Section visibility checks
  const heroSection = config.sections?.find((s) => s.type === 'hero');
  const isHeroEnabled = heroSection ? heroSection.isEnabled : true;

  const walkthroughSection = config.sections?.find((s) => s.type === 'walkthrough');
  const isWalkthroughEnabled = walkthroughSection ? walkthroughSection.isEnabled : true;

  const productGridSection = config.sections?.find((s) => s.type === 'product_grid');
  const isProductGridEnabled = productGridSection ? productGridSection.isEnabled : (config.showProductGrid !== false);

  // Priority rules for image display:
  // 1. Explicitly selected custom image for landing page hero or section
  // 2. The associated product's existing main uploaded image (from primary media or coverImage)
  // 3. Fallback placeholder / illustration
  const customSectionImage =
    heroSection?.content?.heroImage ||
    heroSection?.content?.imageUrl ||
    heroSection?.content?.featuredImage;

  const heroImageResolution = getProductLandingHeroImage(
    product,
    customSectionImage || config.heroImage || config.featuredImage
  );
  const resolvedHeroImage = heroImageResolution.imageUrl;

  // Reset image load error state whenever target product or hero image changes
  useEffect(() => {
    setImageLoadError(false);
  }, [product?.id, product?.slug, resolvedHeroImage]);

  // Related products for complementary product grid
  const relatedProducts = (
    products.filter(
      (p) =>
        p.id !== product?.id &&
        (product?.relatedProductIds?.includes(p.id) || p.category === product?.category)
    ).length > 0
      ? products.filter(
          (p) =>
            p.id !== product?.id &&
            (product?.relatedProductIds?.includes(p.id) || p.category === product?.category)
        )
      : products.filter((p) => p.id !== product?.id)
  ).slice(0, 3);

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    setCurrentPage('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">Product Not Found</h2>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'super_admin' || currentUser.role === 'editor';

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      {/* Admin Quick Jump Bar if logged in as Admin */}
      {isAdmin && (
        <div className="bg-slate-900 text-slate-300 text-xs px-6 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px]">
              Viewing Dedicated Landing Page: <strong className="text-white">{product.name}</strong>
              <span className="ml-2 text-slate-400 font-normal">
                ({heroImageResolution.source === 'custom' ? 'Custom Hero Image' : heroImageResolution.source === 'product_main' ? 'Main Product Image Active' : 'Fallback Graphic'})
              </span>
            </span>
          </div>
          <button
            onClick={() => {
              setCurrentPage('admin_dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
          >
            <Settings className="w-3 h-3 text-blue-400" />
            <span>Edit in Admin Dashboard</span>
          </button>
        </div>
      )}

      {/* 1. Launch / Offer Banner */}
      <aside aria-label="Special offer" className="bg-[#1C2026] text-amber-300 text-xs py-2 px-4 text-center border-b border-amber-500/20 font-mono flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          LIMITED RELEASE PROMOTION · Claim 40% off {product.name} today. Instant digital access.
        </span>
      </aside>

      {/* Navigation Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hover:text-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>
        <span className="font-mono text-[11px] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-700">
          Dedicated Sales Showcase
        </span>
      </div>

      {/* 2. Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-soft-accent)] text-[var(--theme-primary)] text-xs font-semibold mb-6 border border-blue-200/60">
            <Zap className="w-3.5 h-3.5" />
            <span>{config.heroBadge}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--theme-text)] leading-[1.1] mb-6 text-balance">
            {config.headline}
          </h1>

          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            {config.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-base font-semibold rounded-[var(--theme-radius)] transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{config.ctaText}</span>
            </button>
            <button
              onClick={() => {
                setSelectedProductSlug(product.slug);
                setCurrentPage('product_detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-[var(--theme-radius)] border border-slate-200 transition-colors cursor-pointer"
            >
              View Specifications
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-slate-700">{product.rating} / 5.0</span>
            </span>
            <span>·</span>
            <span>{product.reviewsCount} Verified Purchases</span>
            <span>·</span>
            <span className="text-emerald-700 font-medium">Instant Download</span>
          </div>
        </div>

        {/* Hero Mockup / Product Showcase Image Area */}
        {isHeroEnabled && config.showHeroImage !== false && (
          <div className="max-w-4xl mx-auto aspect-16/9 rounded-2xl overflow-hidden shadow-2xl border border-[var(--theme-border)] bg-slate-900 relative group">
            {isProductImageUrl(resolvedHeroImage) && !imageLoadError ? (
              <img
                src={resolvedHeroImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                loading="eager"
                onError={() => setImageLoadError(true)}
              />
            ) : (
              <ProductCover type={resolvedHeroImage} className="w-full h-full" title={product.name} />
            )}

            {/* Subtle product name overlay tag */}
            <div className="absolute bottom-4 left-4 z-20 bg-slate-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-serif text-xs font-semibold">{product.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">Official System Preview</span>
            </div>
          </div>
        )}
      </section>

      {/* 3. Problem / Solution ("Who Is This For" vs "Who Is This NOT For") */}
      <section className="bg-[var(--theme-surface)] py-20 border-y border-[var(--theme-border)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Clarity & Alignment</span>
            <h2 className="font-serif text-3xl font-bold text-[var(--theme-text)] mt-2">
              Is This the Right System for Your Practice?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For */}
            <div className="p-8 rounded-2xl bg-emerald-50/40 border border-emerald-200/80">
              <div className="flex items-center gap-2 text-emerald-800 font-serif font-bold text-lg mb-6">
                <Check className="w-5 h-5 text-emerald-600" />
                <h3>Built Specifically For:</h3>
              </div>
              <ul className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
                {config.whoIsThisFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not For */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-800 font-serif font-bold text-lg mb-6">
                <CloseIcon className="w-5 h-5 text-slate-400" />
                <h3>Who This Is NOT For:</h3>
              </div>
              <ul className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                {config.whoIsThisNotFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CloseIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Visual Media Walkthrough & Showcase (if product has media assets) */}
      {isWalkthroughEnabled && product.mediaGallery && product.mediaGallery.length > 0 && (
        <section className="py-20 max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">System Screenshots & Walkthrough</span>
            <h2 className="font-serif text-3xl font-bold text-[var(--theme-text)] mt-2">
              Inside the System Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Take a closer look at the actual databases, templates, and production frameworks included.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {product.mediaGallery.filter((m) => m.isVisible).map((media, idx) => (
              <div
                key={media.id || idx}
                className="rounded-xl overflow-hidden border border-[var(--theme-border)] bg-slate-900 shadow-md group relative aspect-16/10"
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <img
                      src={media.posterUrl || resolvedHeroImage}
                      alt={media.altText || product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt={media.altText || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
                {media.altText && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-[11px] font-medium">
                    {media.altText}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Deep Feature Highlights */}
      {config.featureHighlights.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-6 border-t border-[var(--theme-border)]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Core Architecture</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--theme-text)] mt-2">
              Engineered for Frictionless Daily Execution
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.featureHighlights.map((feat, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-xs"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--theme-soft-accent)] text-[var(--theme-primary)] flex items-center justify-center font-bold mb-6">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--theme-text)] mb-3">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Included Files Itemization */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Everything Inside</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2">
              Unpack Your Digital Workspace
            </h2>
            <p className="text-xs text-slate-400 mt-3">
              One simple checkout grants you lifetime access to these production-ready assets.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 divide-y divide-slate-700/80 overflow-hidden">
            {product.includedFiles.map((file, idx) => (
              <div key={idx} className="p-5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] bg-slate-700 px-2 py-1 rounded text-cyan-300 font-semibold uppercase">
                    {file.format}
                  </span>
                  <div>
                    <div className="font-semibold text-white text-sm">{file.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Build v{file.version}</div>
                  </div>
                </div>
                <span className="font-mono text-slate-400 tabular-nums">{file.size}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Comparison Table: VeritasCraft vs Building Yourself vs Agency */}
      {config.comparisonTable.length > 0 && (
        <section className="py-20 max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Objective Valuation</span>
            <h2 className="font-serif text-3xl font-bold text-[var(--theme-text)] mt-2">
              Why Savvy Founders Choose VeritasCraft
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--theme-border)]">
                  <th className="p-4 font-mono uppercase text-slate-500 w-1/4">Evaluation Vector</th>
                  <th className="p-4 font-serif font-bold text-sm text-[var(--theme-primary)] bg-blue-50/50 rounded-t-lg w-1/3">
                    {product.name}
                  </th>
                  <th className="p-4 font-mono uppercase text-slate-500 w-1/5">Building from Scratch</th>
                  <th className="p-4 font-mono uppercase text-slate-500 w-1/5">Boutique Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--theme-border)]">
                {config.comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{row.feature}</td>
                    <td className="p-4 font-semibold text-[var(--theme-primary)] bg-blue-50/30">
                      {row.ourProduct}
                    </td>
                    <td className="p-4 text-slate-600">{row.buildingFromScratch}</td>
                    <td className="p-4 text-slate-600">{row.expensiveAgency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 8. Bonus Pack */}
      {product.bonuses && product.bonuses.length > 0 && (
        <section className="bg-amber-50/40 py-20 border-y border-amber-200/60">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-800">Complimentary Upgrades</span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 mt-2">
                Included Launch Bonuses (Free with Today's Download)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.bonuses.map((bonus, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-xl border border-amber-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <Gift className="w-5 h-5 text-amber-600" />
                      <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                        ${bonus.value} VALUE
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-900 mb-2">{bonus.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{bonus.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Included Free
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Genuine Customer Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="py-20 max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Verified Feedback</span>
            <h2 className="font-serif text-3xl font-bold text-[var(--theme-text)] mt-2">
              Loved by Independent Designers & Publishers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-8 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-xs"
              >
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h4 className="font-serif text-lg font-bold text-slate-900 mb-2">"{rev.title}"</h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6">"{rev.comment}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--theme-border)] text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">{rev.authorName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{rev.authorRole}</div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. FAQs */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="bg-[var(--theme-surface)] py-20 border-t border-[var(--theme-border)]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Common Queries</span>
              <h2 className="font-serif text-3xl font-bold text-[var(--theme-text)] mt-2">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {product.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-[var(--theme-border)] rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between text-sm font-semibold text-slate-900 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        activeFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeFaq === idx && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. Curated Product Grid */}
      {isProductGridEnabled && relatedProducts.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-6 border-t border-[var(--theme-border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Curated Recommendations
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--theme-text)] mt-1">
                Frequently Paired With This System
              </h2>
            </div>
            <button
              onClick={() => {
                setCurrentPage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-[var(--theme-primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onQuickView={() => {}}
              />
            ))}
          </div>
        </section>
      )}

      {/* 12. Final Purchase CTA Block */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-slate-900 via-[#1C2026] to-slate-900 text-white shadow-2xl border border-white/10">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-300">Instant Access</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mt-3 mb-6">
            Start Streamlining Your Studio Today
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Download {product.name} right now. Complete with all relational databases, bonuses, and lifetime updates.
          </p>

          <div className="flex items-baseline justify-center gap-3 mb-8">
            <span className="text-4xl font-bold font-mono text-white tabular-nums">${product.price}</span>
            {product.comparePrice && (
              <span className="text-lg line-through text-slate-400 font-mono tabular-nums">
                ${product.comparePrice}
              </span>
            )}
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full sm:w-auto px-10 py-4 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-base font-semibold rounded-[var(--theme-radius)] transition-all transform hover:-translate-y-0.5 shadow-xl inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>{config.ctaText}</span>
          </button>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted Checkout
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> {config.guaranteeText.split(':')[0]}
            </span>
          </div>
        </div>
      </section>

      {/* 13. Sticky Bottom Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--theme-surface)]/95 backdrop-blur-md border-t border-[var(--theme-border)] py-2.5 px-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block truncate">
            <div className="font-serif font-bold text-sm text-[var(--theme-text)] truncate">{product.name}</div>
            <div className="text-[11px] text-slate-500 font-mono">Instant digital download · Lifetime access</div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-[var(--theme-text)] tabular-nums">
                ${product.price}
              </span>
              {product.comparePrice && (
                <span className="text-xs line-through text-slate-400 font-mono tabular-nums">
                  ${product.comparePrice}
                </span>
              )}
            </div>

            <button
              onClick={handleBuyNow}
              className="py-2.5 px-6 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-[var(--theme-radius)] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
