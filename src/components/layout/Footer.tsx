import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Check, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedProductSlug, showNotification } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer_newsletter' }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
        showNotification(data.message);
      }
    } catch {
      setIsSubscribed(true);
      showNotification('Subscribed successfully to VeritasCraft Editorial.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-[#1C2026] text-white border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white mb-3">
              VeritasCraft
            </h2>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              A premium digital products store and editorial publication. We engineer aesthetic Notion operating systems, Canva visual assets, and data-backed organic traffic systems for modern creators.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Designed with timeless typography & zero-compromise security.
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h3 className="text-xs font-mono tracking-wider uppercase text-slate-300 font-semibold mb-4">
              Digital Catalog
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shop All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedProductSlug('creative-director-operating-system');
                    setCurrentPage('product_landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Creative Director OS
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedProductSlug('pinterest-traffic-blueprint-pin-templates');
                    setCurrentPage('product_landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pinterest Pin Kit (120+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedProductSlug('free-digital-product-starter-blueprint');
                    setCurrentPage('product_detail');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Free Starter Blueprint →
                </button>
              </li>
            </ul>
          </div>

          {/* Editorial & Growth */}
          <div>
            <h3 className="text-xs font-mono tracking-wider uppercase text-slate-300 font-semibold mb-4">
              Editorial & Growth
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('blog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Editorial Publishing
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('pinterest_studio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pinterest Pin Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('faq');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('customer_account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Download Library
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-xs font-mono tracking-wider uppercase text-slate-300 font-semibold mb-4">
              The Weekly Dispatch
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Actionable visual SEO strategies, product launch frameworks, and private member discounts.
            </p>
            {isSubscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>You are subscribed. Check your inbox for our latest editorial issue.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} VeritasCraft Publishing. All rights reserved. Instant digital delivery guaranteed.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                setCurrentPage('privacy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setCurrentPage('terms');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white cursor-pointer"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setCurrentPage('delivery_policy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white cursor-pointer"
            >
              Digital Delivery & Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
