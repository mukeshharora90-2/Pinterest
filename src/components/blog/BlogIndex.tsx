import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BlogCover } from '../illustrations/BlogCover';
import { Clock, ArrowRight, User, Search, Sparkles } from 'lucide-react';

export const BlogIndex: React.FC = () => {
  const { blogPosts, setCurrentPage, setSelectedArticleSlug, setSelectedProductSlug } = useStore();
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');

  const categories = Array.from(new Set(blogPosts.map((b) => b.category)));
  const published = blogPosts.filter((b) => b.status === 'published');

  const filtered = published.filter((post) => {
    const matchesCat = selectedCat === 'all' || post.category === selectedCat;
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featured = published[0];

  const openArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    setCurrentPage('article_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--theme-primary)] font-semibold">
          The VeritasCraft Dispatch
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--theme-text)] mt-3 mb-4">
          Editorial Insights on Creator Business & Organic Traffic
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Deep, data-backed blueprints on visual search engines, digital product pricing psychology, and zero-marginal-cost media businesses.
        </p>
      </div>

      {/* Featured Cornerstone Article */}
      {featured && (
        <div
          onClick={() => openArticle(featured.slug)}
          className="mb-16 bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-0"
        >
          <div className="lg:col-span-7 h-72 lg:h-auto min-h-72">
            <BlogCover
              type={featured.featuredImage}
              className="w-full h-full"
              title={featured.title}
              category={featured.category}
            />
          </div>
          <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-3">
                <span className="uppercase text-[var(--theme-primary)] font-semibold">{featured.category}</span>
                <span>·</span>
                <span>{featured.publishedAt}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featured.estimatedReadTime} min read
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] transition-colors leading-snug mb-4">
                {featured.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                {featured.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--theme-border)] text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif text-xs">
                  {featured.author.name[0]}
                </div>
                <span className="font-semibold text-slate-800">{featured.author.name}</span>
              </div>
              <span className="text-[var(--theme-primary)] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--theme-border)]">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedCat === 'all'
                ? 'bg-[var(--theme-primary)] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Topics ({published.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedCat === c
                  ? 'bg-[var(--theme-primary)] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post) => (
          <article
            key={post.id}
            onClick={() => openArticle(post.slug)}
            className="group bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-16/10 w-full overflow-hidden bg-slate-900">
                <BlogCover
                  type={post.featuredImage}
                  className="w-full h-full"
                  title={post.title}
                  category={post.category}
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-2">
                  <span className="uppercase text-[var(--theme-primary)] font-semibold">{post.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.estimatedReadTime} min
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] transition-colors leading-snug mb-2 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs text-slate-500 border-t border-[var(--theme-border)]/60 pt-4">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.author.name}</span>
              </div>
              <span className="text-[var(--theme-primary)] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read →
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* In-Blog Digital Product Promotion Box */}
      <div className="mt-20 p-8 md:p-10 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 text-amber-300 font-mono text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Featured Digital Kit
          </div>
          <h3 className="font-serif text-2xl font-bold mb-2">
            The Pinterest Organic Traffic Blueprint & 120+ Canva Templates
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Turn Pinterest into an automated customer acquisition engine. Includes 2:3 vertical layouts, viral headline swipe files, and complete keyword SEO checklists.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedProductSlug('pinterest-traffic-blueprint-pin-templates');
            setCurrentPage('product_landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-lg transition-colors shrink-0 shadow cursor-pointer"
        >
          Explore the Kit ($29) →
        </button>
      </div>
    </div>
  );
};
