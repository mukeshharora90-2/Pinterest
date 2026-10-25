import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { TopBar } from './components/layout/TopBar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { ShopCollectionPage } from './components/store/ShopCollectionPage';
import { ProductDetailsView } from './components/store/ProductDetailsView';
import { ProductLandingPage } from './components/landing/ProductLandingPage';
import { BlogIndex } from './components/blog/BlogIndex';
import { ArticleView } from './components/blog/ArticleView';
import { PinCanvasStudio } from './components/pinterest/PinCanvasStudio';
import { CartPage } from './components/checkout/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmationView } from './components/checkout/OrderConfirmationView';
import { CustomerDashboard } from './components/account/CustomerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PolicyPage } from './components/pages/PolicyPage';
import { QuickViewModal } from './components/store/QuickViewModal';
import { Product } from './types';
import { Check, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentPage, selectedProductSlug, selectedArticleSlug, notification } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onQuickView={(p) => setQuickViewProduct(p)} />;
      case 'shop':
        return <ShopCollectionPage onQuickView={(p) => setQuickViewProduct(p)} />;
      case 'best_sellers':
        return <ShopCollectionPage onQuickView={(p) => setQuickViewProduct(p)} initialFilter="Planners & Systems" />;
      case 'product_detail':
        return (
          <ProductDetailsView
            productSlug={selectedProductSlug || ''}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        );
      case 'product_landing':
        return (
          <ProductLandingPage
            productSlug={selectedProductSlug || ''}
          />
        );
      case 'blog':
        return <BlogIndex />;
      case 'article_detail':
        return (
          <ArticleView
            articleSlug={selectedArticleSlug || 'pinterest-organic-traffic-blueprint-digital-products'}
          />
        );
      case 'pinterest_studio':
        return <PinCanvasStudio />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order_confirmation':
        return <OrderConfirmationView />;
      case 'customer_account':
        return <CustomerDashboard onQuickView={(p) => setQuickViewProduct(p)} />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'privacy':
        return <PolicyPage type="privacy" />;
      case 'terms':
        return <PolicyPage type="terms" />;
      case 'delivery_policy':
      case 'faq':
        return <PolicyPage type="delivery" />;
      default:
        return <HomePage onQuickView={(p) => setQuickViewProduct(p)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#3157D5] selection:text-white">
      {/* Top Banner & Header */}
      <div>
        <AnnouncementBar />
        <TopBar />
        <main>{renderCurrentView()}</main>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E232A] text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
