import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../store/ProductCard';
import { BlogCover } from '../illustrations/BlogCover';
import { ProductCover } from '../illustrations/ProductCover';
import {
  ArrowRight,
  Sparkles,
  Download,
  ShieldCheck,
  Check,
  Star,
  ChevronDown,
  Layers,
  Zap,
  Bookmark,
  TrendingUp,
} from 'lucide-react';

interface HomePageProps {
  onQuickView: (product: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onQuickView }) => {
  const { products, blogPosts, setCurrentPage, setSelectedProductSlug, setSelectedArticleSlug, showNotification } = useStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [leadEmail, setLeadEmail] = useState('');
  const [leadClaimed, setLeadClaimed] = useState(false);

  const bestSellers = products.filter((p) => p.isBestSeller || p.isFeatured).slice(0, 3);
  const latestArticles = blogPosts.filter((b) => b.status === 'published').slice(0, 2);
  const freeMagnet = products.find((p) => p.isFreeLeadMagnet) || products[products.length - 1];

  const handleClaimLeadMagnet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadEmail.includes('@')) return;

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail,
          source: 'home_lead_magnet_banner',
          leadMagnetClaimed: freeMagnet.name,
        }),
      });
      const data = await res.json();
      setLeadClaimed(true);
      showNotification('Success! Your free 7-Day Blueprint is ready for download.');
    } catch {
      setLeadClaimed(true);
      showNotification('Download unlocked!');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION: Refined Editorial Typography & Campaign Split */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left: Editorial Headline & Value Hook */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-soft-accent)] text-[var(--theme-primary)] text-xs font-semibold mb-6 border border-blue-200/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Independent Digital Publishing & Creative Systems</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-[var(--theme-text)] leading-[1.08] mb-6 text-balance">
              Digital Assets Engineered for High-Output Creators.
            </h1>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mb-8 font-sans">
              Discover production-ready Notion operating systems, 2:3 Pinterest traffic kits, and editorial playbooks. Build once, sell endlessly with zero inventory constraints.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => {
                  setCurrentPage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-[var(--theme-radius)] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Explore Digital Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentPage('blog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-[var(--theme-radius)] border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Read Editorial Guides</span>
              </button>
            </div>

            {/* Social Proof Strip */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[var(--theme-border)] text-xs text-slate-500 font-mono">
              <div>
                <span className="font-bold text-slate-900 text-base font-sans block">2,400+</span>
                <span>Active Designers</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-base font-sans block">4.95 / 5.0</span>
                <span>Verified Rating</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-base font-sans block">Instant</span>
                <span>File Delivery</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Curated Visual Anchor Card */}
          <div className="lg:col-span-5">
            <div
              onClick={() => {
                setSelectedProductSlug('creative-director-operating-system');
                setCurrentPage('product_landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-[var(--theme-border)] bg-slate-900 cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
            >
              <ProductCover type="notion_os" className="w-full h-full" title="The Creative Director Operating System" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-xs flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-slate-900">Featured System · v2.4</div>
                  <div className="text-[11px] text-slate-500 font-mono">14 Relational Dashboards · $39</div>
                </div>
                <span className="px-3 py-1.5 bg-[var(--theme-primary)] text-white text-[11px] font-semibold rounded-md shadow-xs">
                  Sales Page →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY DISCOVERY STRIP */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'Planners & Systems', count: 'Notion & ClickUp', slug: 'Planners & Systems' },
            { name: 'Canva Templates', count: '120+ Viral Pins', slug: 'Canva Templates' },
            { name: 'Business & Finance', count: 'Automated Spreadsheets', slug: 'Business & Finance' },
            { name: 'Ebooks & Guides', count: 'Launch Playbooks', slug: 'Ebooks & Guides' },
            { name: 'Free Downloads', count: 'Starter Blueprints', slug: 'Free Downloads' },
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrentPage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-5 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-primary)] transition-all cursor-pointer group shadow-xs"
            >
              <h3 className="font-serif text-sm font-bold text-slate-900 group-hover:text-[var(--theme-primary)] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEST-SELLING DIGITAL PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Curated Catalog
            </span>
            <h2 className="font-serif text-3xl font-bold text-[var(--theme-text)] mt-1">
              Best-Selling Digital Workspaces
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-[var(--theme-primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} onQuickView={onQuickView} />
          ))}
        </div>
      </section>

      {/* 4. FREE LEAD MAGNET CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#1C2026] via-[#2A313C] to-[#14181E] text-white shadow-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30">
              Complimentary Starter Blueprint
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight">
              The Free 7-Day Digital Product Starter Blueprint
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
              Learn how to package your existing expertise into a sellable PDF, spreadsheet, or Notion template in 7 days without needing an existing audience.
            </p>

            {leadClaimed ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Your Free Download Is Ready</strong>
                  <a
                    href="/api/downloads/token-free-lead-magnet"
                    download
                    className="underline text-emerald-300 hover:text-white font-mono mt-0.5 inline-block"
                  >
                    Click here to download Free_7Day_Blueprint.pdf (4.8 MB) →
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleClaimLeadMagnet} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md">
                <input
                  type="email"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer shadow"
                >
                  Download Free
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm aspect-4/3 rounded-xl overflow-hidden shadow-xl border border-white/10">
              <ProductCover type="starter_blueprint" className="w-full h-full" title="Free 7-Day Starter Blueprint" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL ARTICLE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Editorial Publishing
            </span>
            <h2 className="font-serif text-3xl font-bold text-[var(--theme-text)] mt-1">
              In-Depth Growth Guides
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-[var(--theme-primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {latestArticles.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                setSelectedArticleSlug(post.slug);
                setCurrentPage('article_detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-16/9 w-full bg-slate-900">
                <BlogCover type={post.featuredImage} className="w-full h-full" title={post.title} category={post.category} />
              </div>
              <div className="p-6">
                <div className="text-xs text-slate-500 font-mono mb-2">
                  <span>{post.category}</span> · <span>{post.estimatedReadTime} min read</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-[var(--theme-primary)] transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PINTEREST INSPIRATION & TRAFFIC GALLERY */}
      <section className="bg-[var(--theme-surface)] py-20 border-y border-[var(--theme-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold flex items-center justify-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" /> Pinterest Traffic Engine
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-2">
              Visual Discovery & Pin Inspiration
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Explore 2:3 vertical Pin designs tested for maximum outbound click-through rates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                headline: 'How We Drove 240,000 Monthly Pageviews from Pinterest',
                sub: 'The Organic Traffic Blueprint for Digital Downloads',
                cta: 'Read Guide →',
                color: 'bg-gradient-to-br from-[#1E3A8A] to-[#0F172A]',
                accent: 'bg-amber-400 text-slate-950',
                link: '/blog/pinterest-organic-traffic-blueprint-digital-products',
              },
              {
                headline: 'The Creative Director Operating System (2026 Edition)',
                sub: '14 Relational Dashboards · Client Portals · Retainer Tracker',
                cta: 'Download OS · $39',
                color: 'bg-gradient-to-br from-[#FAF8F4] to-[#E8E1D5] text-slate-900',
                accent: 'bg-[#3157D5] text-white',
                link: '/product/creative-director-operating-system',
              },
              {
                headline: '12 High-Yield Digital Downloads That Sell While You Sleep',
                sub: 'Build Once, Sell Forever: Margin Breakdown & Revenue Models',
                cta: 'View Ranked List →',
                color: 'bg-gradient-to-br from-[#134E4A] to-[#021817]',
                accent: 'bg-teal-300 text-slate-950',
                link: '/blog/12-high-yield-digital-products-to-sell',
              },
            ].map((pin, idx) => (
              <div
                key={idx}
                className={`aspect-2/3 rounded-2xl p-6 shadow-xl flex flex-col justify-between text-white relative overflow-hidden ${pin.color}`}
              >
                <div className="text-[10px] font-mono tracking-widest uppercase opacity-80">
                  VERITASCRAFT.COM
                </div>
                <div className="my-auto py-4">
                  <h4 className="font-serif text-xl font-bold leading-tight mb-2">
                    {pin.headline}
                  </h4>
                  <p className="text-xs opacity-80 leading-relaxed font-sans">{pin.sub}</p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold shadow ${pin.accent}`}>
                    {pin.cta}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentPage('pinterest_studio');
                      showNotification('Opened Pin Studio!');
                    }}
                    className="text-xs font-mono opacity-80 hover:opacity-100 underline cursor-pointer"
                  >
                    Open Studio 📌
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Common Inquiries
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How are digital products delivered after purchase?',
              a: 'Instantly! Upon completing checkout, you will receive authorized expiring download links directly on the thank-you screen and via email confirmation. You can also re-download your files anytime from your customer account.',
            },
            {
              q: 'Can I use these templates for commercial client work?',
              a: 'Yes. All VeritasCraft products include a commercial license allowing you to use them in client deliverables and commercial brand assets. Reselling the raw templates themselves is prohibited.',
            },
            {
              q: 'What payment methods do you support?',
              a: 'Our modular payment manager supports cards, Apple Pay, Google Pay, PayPal, Razorpay UPI, Cashfree, and direct manual bank wire / UPI transfers with admin reconciliation.',
            },
            {
              q: 'What is your refund policy for digital downloads?',
              a: 'We offer a 30-day satisfaction guarantee. If a product fails to work as advertised or does not meet your workflow needs, simply email support@veritascraft.com for a swift resolution or refund.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 md:p-5 flex items-center justify-between text-xs md:text-sm font-semibold text-slate-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-[var(--theme-border)] pt-3 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
