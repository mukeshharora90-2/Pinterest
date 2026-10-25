import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Menu, X, Shield, User } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { currentPage, setCurrentPage, cartTotalCount, currentUser, switchRole } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const navigateTo = (page: any) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--theme-surface)]/95 backdrop-blur-md border-b border-[var(--theme-border)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => navigateTo('home')}
            className="text-xl md:text-2xl font-serif font-bold tracking-tight text-[var(--theme-text)] whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            VeritasCraft
          </button>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--theme-text)]/80">
            <button
              onClick={() => navigateTo('shop')}
              className={`hover:text-[var(--theme-primary)] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'shop' ? 'text-[var(--theme-primary)] font-semibold' : ''
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => navigateTo('best_sellers')}
              className={`hover:text-[var(--theme-primary)] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'best_sellers' ? 'text-[var(--theme-primary)] font-semibold' : ''
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => navigateTo('blog')}
              className={`hover:text-[var(--theme-primary)] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'blog' || currentPage === 'article_detail' ? 'text-[var(--theme-primary)] font-semibold' : ''
              }`}
            >
              Editorial
            </button>
            <button
              onClick={() => navigateTo('pinterest_studio')}
              className={`hover:text-[var(--theme-primary)] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'pinterest_studio' ? 'text-[var(--theme-primary)] font-semibold' : ''
              }`}
            >
              Pinterest Studio
            </button>
            <button
              onClick={() => navigateTo('customer_account')}
              className={`hover:text-[var(--theme-primary)] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'customer_account' ? 'text-[var(--theme-primary)] font-semibold' : ''
              }`}
            >
              My Downloads
            </button>
          </nav>

          {/* Zone 3: 1 primary action (Cart & Role toggle) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick role indicator / switcher */}
            <button
              onClick={() => setRoleModalOpen(true)}
              title={`Logged in as ${currentUser.role}. Click to switch demo role.`}
              className="text-xs px-2.5 py-1.5 rounded border border-[var(--theme-border)] text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline capitalize font-mono text-[11px]">{currentUser.role.replace('_', ' ')}</span>
            </button>

            {currentUser.role !== 'customer' && (
              <button
                onClick={() => navigateTo('admin_dashboard')}
                className={`text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                  currentPage === 'admin_dashboard'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Primary Action Button: Cart */}
            <button
              onClick={() => navigateTo('cart')}
              className="relative px-4 py-2 text-xs font-semibold text-white bg-[var(--theme-primary)] rounded-[var(--theme-radius)] hover:bg-[#2646B8] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
              aria-label={`View shopping cart with ${cartTotalCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="tabular-nums font-mono bg-white/20 px-1.5 py-0.5 rounded text-[10px] min-w-4 text-center">
                {cartTotalCount}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--theme-border)] bg-[var(--theme-surface)] px-6 py-4 flex flex-col gap-3">
            <button
              onClick={() => navigateTo('shop')}
              className="text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Shop All Digital Products
            </button>
            <button
              onClick={() => navigateTo('best_sellers')}
              className="text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Best Sellers
            </button>
            <button
              onClick={() => navigateTo('blog')}
              className="text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Editorial & Guides
            </button>
            <button
              onClick={() => navigateTo('pinterest_studio')}
              className="text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Pinterest Content Studio
            </button>
            <button
              onClick={() => navigateTo('customer_account')}
              className="text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Customer Account & Downloads
            </button>
            {currentUser.role !== 'customer' && (
              <button
                onClick={() => navigateTo('admin_dashboard')}
                className="text-left py-2 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Admin Dashboard
              </button>
            )}
          </div>
        )}
      </header>

      {/* Role Switcher Modal (for instant testing of Admin, Editor, Customer, Support personas) */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-slate-900">Switch Demo Role</h3>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              VeritasCraft includes complete role-based access control (RBAC). Switch between roles to test the admin dashboard, editorial publishing, or buyer download library:
            </p>
            <div className="space-y-2 mb-6">
              <button
                onClick={() => {
                  switchRole('super_admin');
                  setRoleModalOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  currentUser.role === 'super_admin'
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-slate-900">Super Administrator</div>
                  <div className="text-xs text-slate-500">Full access: Products, Gateways, Theme, Orders, AI Studio</div>
                </div>
                {currentUser.role === 'super_admin' && <span className="text-xs text-blue-600 font-semibold font-mono">Active</span>}
              </button>

              <button
                onClick={() => {
                  switchRole('editor');
                  setRoleModalOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  currentUser.role === 'editor'
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-slate-900">Content Editor</div>
                  <div className="text-xs text-slate-500">Blog publishing, Pin designer, and product catalog edits</div>
                </div>
                {currentUser.role === 'editor' && <span className="text-xs text-blue-600 font-semibold font-mono">Active</span>}
              </button>

              <button
                onClick={() => {
                  switchRole('customer');
                  setRoleModalOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  currentUser.role === 'customer'
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-slate-900">Verified Customer (Buyer)</div>
                  <div className="text-xs text-slate-500">Order history, expiring download tokens, and wishlist</div>
                </div>
                {currentUser.role === 'customer' && <span className="text-xs text-blue-600 font-semibold font-mono">Active</span>}
              </button>
            </div>
            <div className="text-right">
              <button
                onClick={() => setRoleModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
