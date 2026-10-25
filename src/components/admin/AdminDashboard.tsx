import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, BlogPost, PaymentGateway, Coupon } from '../../types';
import {
  LayoutDashboard,
  Package,
  BookOpen,
  Sparkles,
  Bookmark,
  ShoppingCart,
  CreditCard,
  Tag,
  Palette,
  Users,
  Search,
  History,
  Plus,
  Trash2,
  Edit,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldAlert,
  Send,
  Loader2,
  Film,
  Eye,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { ProductMediaManager } from './ProductMediaManager';
import { ArticleBlockEditor } from './ArticleBlockEditor';
import { ArticleView } from '../blog/ArticleView';
import { VideoPlayerEmbed } from '../common/VideoPlayerEmbed';
import { convertLegacyPostToBlocks } from '../../utils/mediaEmbed';
import { getProductLandingHeroImage, getProductUploadedImage, isProductImageUrl } from '../../utils/productMedia';
import { ProductCover } from '../illustrations/ProductCover';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    setProducts,
    blogPosts,
    setBlogPosts,
    gateways,
    setGateways,
    coupons,
    setCoupons,
    pins,
    orders,
    setOrders,
    theme,
    updateTheme,
    resetTheme,
    applyThemePreset,
    auditLogs,
    showNotification,
    setCurrentPage,
    setSelectedProductSlug,
    sendToPinStudio,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'blog'
    | 'ai_studio'
    | 'pins'
    | 'orders'
    | 'gateways'
    | 'coupons'
    | 'theme'
    | 'subscribers'
    | 'seo'
    | 'audit_logs'
  >('overview');

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalTab, setProductModalTab] = useState<'media' | 'details' | 'settings' | 'landing'>('media');

  // Blog edit state
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogModalTab, setBlogModalTab] = useState<'blocks' | 'meta' | 'preview'>('blocks');

  // AI Studio form state
  const [aiTopic, setAiTopic] = useState('');
  const [aiAudience, setAiAudience] = useState('Digital content creators & solopreneurs');
  const [aiTone, setAiTone] = useState('Authoritative, practical, and editorial');
  const [aiFormat, setAiFormat] = useState('How-To Guide');
  const [aiProduct, setAiProduct] = useState('prod-01');
  const [aiAction, setAiAction] = useState<string>('pin_title');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiConfigError, setAiConfigError] = useState<string | null>(null);

  // New Coupon state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');

  // Check RBAC permission
  if (currentUser.role === 'customer') {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          The Admin Dashboard requires an Administrator or Editor role. Use the role switcher in the top navigation bar to test administrative permissions.
        </p>
        <button
          onClick={() => setCurrentPage('home')}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  // Handle AI generation via Express backend route /api/ai/generate
  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      showNotification('Please enter an article topic or focus keyword.');
      return;
    }
    setIsGeneratingAi(true);
    setAiConfigError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          targetAudience: aiAudience,
          tone: aiTone,
          format: aiFormat,
          productToPromote: aiProduct,
          actionType: aiAction,
        }),
      });

      const data = await response.json();

      if (!data.isConfigured) {
        setAiConfigError(data.message);
      } else if (data.success) {
        setAiResult(data.result);
        showNotification('AI Content successfully drafted!');
      } else {
        setAiConfigError(data.error || 'Failed to generate content.');
      }
    } catch (err: any) {
      setAiConfigError('Could not connect to backend AI server. Check console.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Insert AI draft directly into blog post
  const handleInsertAiToBlogPost = () => {
    if (!aiResult) return;
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: aiTopic || 'New Editorial Draft',
      slug: (aiTopic || 'new-draft').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: aiResult.slice(0, 160) + '...',
      content: aiResult,
      featuredImage: 'article_digital_products',
      author: {
        id: 'auth-01',
        name: currentUser.fullName,
        slug: 'editor',
        roleTitle: 'Content Editor',
        bio: 'Editorial Staff at VeritasCraft.',
        avatarUrl: 'author_clara',
      },
      category: 'Product Creation',
      tags: ['AI Draft', 'Tutorial'],
      templateType: 'how_to_guide',
      status: 'draft',
      estimatedReadTime: 6,
      affiliateDisclosureRequired: true,
      promotedProductId: aiProduct,
      seoTitle: aiTopic,
      seoDescription: aiResult.slice(0, 150),
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      viewsCount: 0,
      comments: [],
    };
    setBlogPosts([newPost, ...blogPosts]);
    showNotification('AI draft saved as a new Blog Article Draft!');
    setActiveTab('blog');
  };

  // Transfer AI generated content into Pinterest Studio
  const handleTransferAiToPinStudio = () => {
    if (!aiResult) return;
    const lines = aiResult.split('\n').map((l) => l.trim()).filter(Boolean);
    let parsedHeadline = aiTopic || 'How to Monetize Digital Downloads';
    let parsedTitle = aiTopic || 'Pinterest Visual Traffic Guide';
    let parsedDesc = '';

    for (const line of lines) {
      const match = line.match(/^[0-9]+[\.\)]\s*(.+)/);
      if (match && match[1]) {
        parsedHeadline = match[1].replace(/["*]/g, '').trim();
        parsedTitle = parsedHeadline;
        break;
      } else if (line.length > 15 && line.length < 90 && !line.startsWith('#')) {
        parsedHeadline = line.replace(/["*]/g, '').trim();
        parsedTitle = parsedHeadline;
        break;
      }
    }

    // Look for description paragraph
    const paragraphs = aiResult.split('\n\n').map((p) => p.trim()).filter((p) => p.length > 40 && !p.startsWith('#'));
    if (paragraphs.length > 0) {
      parsedDesc = paragraphs[0].replace(/[*_#]/g, '').trim().slice(0, 350);
    } else {
      parsedDesc = aiResult.slice(0, 300);
    }

    sendToPinStudio({
      headline: parsedHeadline,
      title: parsedTitle,
      description: parsedDesc,
    });
  };

  // Manual payment order verification
  const handleVerifyOrder = async (orderId: string, approve: boolean) => {
    try {
      const res = await fetch('/api/orders/verify-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, approve }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders(orders.map((o) => (o.id === orderId ? data.order : o)));
        showNotification(
          approve ? 'Payment approved! Customer downloads unlocked.' : 'Order marked as failed.'
        );
      }
    } catch {
      showNotification('Error updating order status.');
    }
  };

  // Save Product changes with backend persistence
  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingProduct) return;

    // 1. Ensure slug is clean and SEO/URL friendly
    const cleanSlug =
      (editingProduct.slug && editingProduct.slug.trim()) ||
      editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
      `prod-${Date.now()}`;

    // 2. Synchronize media items and ensure uploaded image is accurately set as cover
    let updatedMedia = editingProduct.mediaGallery ? [...editingProduct.mediaGallery] : [];
    let updatedCover = editingProduct.coverImage;

    if (updatedMedia.length > 0) {
      if (!updatedMedia.some((m) => m.isPrimary)) {
        updatedMedia[0].isPrimary = true;
      }
      const primaryItem = updatedMedia.find((m) => m.isPrimary);
      if (primaryItem && primaryItem.type === 'image' && isProductImageUrl(primaryItem.url)) {
        updatedCover = primaryItem.url;
      }
    }

    // 3. Ensure landingPageConfig exists with hero and product grid sections
    const existingConfig = editingProduct.landingPageConfig;
    const initialSections = [
      { id: 'sec-hero', type: 'hero' as const, isEnabled: true },
      { id: 'sec-prob', type: 'problem_solution' as const, isEnabled: true },
      { id: 'sec-walk', type: 'walkthrough' as const, isEnabled: true },
      { id: 'sec-files', type: 'included_files' as const, isEnabled: true },
      { id: 'sec-comp', type: 'comparison' as const, isEnabled: true },
      { id: 'sec-faq', type: 'faq' as const, isEnabled: true },
      { id: 'sec-grid', type: 'product_grid' as const, isEnabled: true },
      { id: 'sec-cta', type: 'final_cta' as const, isEnabled: true },
    ];

    const cleanedProduct: Product = {
      ...editingProduct,
      slug: cleanSlug,
      coverImage: updatedCover,
      mediaGallery: updatedMedia,
      landingPageConfig: {
        headline: existingConfig?.headline || editingProduct.name || 'Exclusive Digital System',
        subheadline: existingConfig?.subheadline || editingProduct.shortDescription || 'Transform your daily workflow with our engineered digital asset.',
        heroBadge: existingConfig?.heroBadge || 'Verified Digital Asset',
        ctaText: existingConfig?.ctaText || `Download Instant Access — $${editingProduct.price || 29}`,
        guaranteeText: existingConfig?.guaranteeText || '30-Day Money-Back Guarantee: If you are not satisfied, we will issue a full refund.',
        whoIsThisFor: existingConfig?.whoIsThisFor?.length ? existingConfig.whoIsThisFor : ['Designers & creators', 'Independent digital publishers', 'High-volume operators'],
        whoIsThisNotFor: existingConfig?.whoIsThisNotFor?.length ? existingConfig.whoIsThisNotFor : ['People looking for generic uncustomizable templates'],
        featureHighlights: existingConfig?.featureHighlights || [],
        comparisonTable: existingConfig?.comparisonTable || [],
        sections: existingConfig?.sections?.length ? existingConfig.sections : initialSections,
        heroImage: existingConfig?.heroImage,
        featuredImage: existingConfig?.featuredImage,
        showHeroImage: existingConfig?.showHeroImage !== false,
        showProductGrid: existingConfig?.showProductGrid !== false,
      },
    };

    if (products.some((p) => p.id === cleanedProduct.id)) {
      setProducts(products.map((p) => (p.id === cleanedProduct.id ? cleanedProduct : p)));
      showNotification(`Saved "${cleanedProduct.name}" and updated landing page`);
    } else {
      setProducts([cleanedProduct, ...products]);
      showNotification(`Created product "${cleanedProduct.name}" with dedicated landing page`);
    }
    setIsProductModalOpen(false);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedProduct),
      });
    } catch (err) {
      console.error('Failed to persist product to server:', err);
    }
  };

  // Delete product with backend persistence
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
      showNotification('Product deleted from storefront.');

      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Failed to delete product on server:', err);
      }
    }
  };

  // Toggle Gateway Enabled
  const handleToggleGateway = (providerId: string) => {
    setGateways(
      gateways.map((g) => (g.providerId === providerId ? { ...g, isEnabled: !g.isEnabled } : g))
    );
    showNotification('Gateway availability updated.');
  };

  // Toggle Gateway Test Mode
  const handleToggleGatewayMode = (providerId: string) => {
    setGateways(
      gateways.map((g) => (g.providerId === providerId ? { ...g, isTestMode: !g.isTestMode } : g))
    );
    showNotification('Gateway mode toggled.');
  };

  // Add Coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newC: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrderAmount: 20,
      timesUsed: 0,
      usageLimit: 500,
      isActive: true,
    };
    setCoupons([newC, ...coupons]);
    setNewCouponCode('');
    showNotification(`Coupon "${newC.code}" created.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Admin Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--theme-border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
              Control Panel
            </span>
            <span className="text-xs text-slate-500 font-mono">VeritasCraft v2.4</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 mt-1">Website Administration</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Preview Live Storefront
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Tabs + Module View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-3 shadow-xs space-y-1">
          {[
            { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products & Catalog', icon: Package },
            { id: 'blog', label: 'Editorial Publishing', icon: BookOpen },
            { id: 'ai_studio', label: 'AI Writing Studio', icon: Sparkles },
            { id: 'pins', label: 'Pinterest Campaigns', icon: Bookmark },
            { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingCart },
            { id: 'gateways', label: 'Payment Gateways', icon: CreditCard },
            { id: 'coupons', label: 'Coupons & Promos', icon: Tag },
            { id: 'theme', label: 'Theme Customizer', icon: Palette },
            { id: 'subscribers', label: 'Subscribers & Leads', icon: Users },
            { id: 'seo', label: 'SEO & Redirects', icon: Search },
            { id: 'audit_logs', label: 'System Audit Log', icon: History },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Content Panel */}
        <div className="lg:col-span-9 bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-6 md:p-8 shadow-xs min-h-[600px]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">Executive Summary</h2>
                <p className="text-xs text-slate-500">Live operational snapshot of catalog revenue, Pinterest referrals, and conversion rates.</p>
              </div>

              {/* KPI Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Gross Revenue</span>
                  <div className="text-2xl font-serif font-bold text-slate-900 tabular-nums">
                    $
                    {orders
                      .filter((o) => o.paymentStatus === 'paid')
                      .reduce((acc, o) => acc + o.totalAmount, 0)
                      .toFixed(2)}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-mono mt-1 block">+24% vs last month</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Total Orders</span>
                  <div className="text-2xl font-serif font-bold text-slate-900 tabular-nums">
                    {orders.length}
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono mt-1 block">100% Digital Delivery</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Pinterest Clicks</span>
                  <div className="text-2xl font-serif font-bold text-slate-900 tabular-nums">
                    {pins.reduce((acc, p) => acc + p.pinClicksCount, 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-rose-600 font-mono mt-1 block">48% Top Acquisition Source</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Active Gateways</span>
                  <div className="text-2xl font-serif font-bold text-slate-900 tabular-nums">
                    {gateways.filter((g) => g.isEnabled).length} / 10
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">Modular Config Ready</span>
                </div>
              </div>

              {/* Traffic Sources Breakdown */}
              <div className="pt-6 border-t border-[var(--theme-border)]">
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-4">Verified Traffic & Conversion Channels</h3>
                <div className="space-y-3">
                  {[
                    { source: 'Pinterest Visual Search (Pins & Collections)', share: '48%', visitors: '115,200', conv: '3.8%' },
                    { source: 'Editorial Google Organic Search (In-depth Guides)', share: '28%', visitors: '67,200', conv: '2.9%' },
                    { source: 'The Weekly Dispatch (Direct & Newsletter)', share: '16%', visitors: '38,400', conv: '5.2%' },
                    { source: 'Direct & Social Referrals', share: '8%', visitors: '19,200', conv: '2.1%' },
                  ].map((row, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-900">{row.source}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{row.visitors} Monthly Visitors</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">{row.share}</div>
                        <div className="text-[10px] text-emerald-600 font-mono">{row.conv} Store Conversion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">Digital Product Catalog</h2>
                  <p className="text-xs text-slate-500">Manage digital downloads, pricing, included files, and landing page toggles.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      name: 'New Digital Asset',
                      slug: 'new-digital-asset',
                      sku: `VC-${Date.now().toString().slice(-4)}`,
                      shortDescription: 'Short description of product...',
                      longDescription: 'Comprehensive long description...',
                      price: 29,
                      comparePrice: 49,
                      category: 'Planners & Systems',
                      tags: ['New'],
                      productType: 'notion_template',
                      fileFormat: 'Notion Workspace + PDF',
                      fileSize: '3.5 MB',
                      version: '1.0',
                      coverImage: 'notion_os',
                      galleryImages: [],
                      licenseType: 'Commercial Use',
                      isAvailable: true,
                      isFeatured: false,
                      isBestSeller: false,
                      isNewArrival: true,
                      isFreeLeadMagnet: false,
                      hasDedicatedLandingPage: true,
                      downloadLimit: 10,
                      accessExpiryDays: 365,
                      rating: 5.0,
                      reviewsCount: 0,
                      includedFiles: [
                        { name: 'Template_Guide.pdf', format: 'PDF', size: '3.5 MB', version: '1.0', downloadUrl: '/api/downloads/tok-sample' },
                      ],
                      bonuses: [],
                      faqs: [],
                      reviews: [],
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="divide-y divide-[var(--theme-border)] border border-[var(--theme-border)] rounded-xl overflow-hidden">
                {products.map((prod) => (
                  <div key={prod.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif font-bold text-sm text-slate-900">{prod.name}</h3>
                        {prod.isFreeLeadMagnet && (
                          <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            Lead Magnet
                          </span>
                        )}
                        {prod.hasDedicatedLandingPage && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProductSlug(prod.slug || prod.id);
                              setCurrentPage('product_landing');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-[10px] font-mono bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors font-medium"
                            title={`View dedicated sales page for ${prod.name}`}
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>Sales Page</span>
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-3">
                        <span>{prod.category}</span>
                        <span>·</span>
                        <span>Format: {prod.fileFormat}</span>
                        <span>·</span>
                        <span className="font-bold text-slate-800 font-mono">${prod.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsProductModalOpen(true);
                        }}
                        className="p-2 border border-slate-200 rounded hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 border border-slate-200 rounded hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BLOG EDITOR */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">Editorial CMS & Articles</h2>
                  <p className="text-xs text-slate-500">Publish in-depth articles, manage affiliate disclosure labels, and associate digital products.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingPost({
                      id: `post-${Date.now()}`,
                      title: 'New Editorial Article Title',
                      slug: 'new-editorial-article',
                      excerpt: 'Summary excerpt of the article...',
                      content: '## Introduction\n\nWrite your guide content here...',
                      featuredImage: 'article_pinterest',
                      author: {
                        id: 'auth-01',
                        name: currentUser.fullName,
                        slug: 'editor',
                        roleTitle: 'Content Editor',
                        bio: 'Editorial Staff at VeritasCraft.',
                        avatarUrl: 'author_clara',
                      },
                      category: 'Traffic & Growth',
                      tags: ['Pinterest', 'SEO'],
                      templateType: 'how_to_guide',
                      status: 'published',
                      estimatedReadTime: 7,
                      affiliateDisclosureRequired: true,
                      promotedProductId: 'prod-02',
                      seoTitle: 'New Editorial Article',
                      seoDescription: 'SEO Description under 155 chars',
                      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                      updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                      viewsCount: 1,
                      comments: [],
                    });
                    setIsBlogModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> New Article
                </button>
              </div>

              <div className="divide-y divide-[var(--theme-border)] border border-[var(--theme-border)] rounded-xl overflow-hidden">
                {blogPosts.map((post) => (
                  <div key={post.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif font-bold text-sm text-slate-900">{post.title}</h3>
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                        <span>{post.category}</span>
                        <span>·</span>
                        <span>{post.publishedAt}</span>
                        <span>·</span>
                        <span>{post.estimatedReadTime} min read</span>
                        <span>·</span>
                        <span className="tabular-nums">{post.viewsCount.toLocaleString()} views</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setIsBlogModalOpen(true);
                        }}
                        className="p-2 border border-slate-200 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                        title="Edit article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI WRITING STUDIO (GEMINI 3.8 FLASH) */}
          {activeTab === 'ai_studio' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> POWERED BY GEMINI 3.8 FLASH
                </div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">AI-Assisted Content Studio</h2>
                <p className="text-xs text-slate-500">
                  Generate conversion-focused outlines, draft sections, viral headline variations, and Pinterest Pin copy with human editorial review.
                </p>
              </div>

              {aiConfigError && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">Configuration Notice</h4>
                    <p className="leading-relaxed">{aiConfigError}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Article Topic / Keyword</label>
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. How to Build a 6-Figure Notion Template Store"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={aiAudience}
                    onChange={(e) => setAiAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tone & Voice</label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
                  >
                    <option value="Authoritative, practical, and editorial">Authoritative & Editorial</option>
                    <option value="Conversational and encouraging">Conversational & Inspiring</option>
                    <option value="Analytical, direct, and metric-focused">Analytical & Data-Driven</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Promoted Digital Product</label>
                  <select
                    value={aiProduct}
                    onChange={(e) => setAiProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Tabs */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                  Select Generation Task
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { id: 'pin_title', label: '10 High-CTR Pin Titles' },
                    { id: 'pin_description', label: 'SEO Pin Descriptions' },
                    { id: 'pin_keywords', label: 'Pinterest Keywords & Tiles' },
                    { id: 'pin_hashtags', label: 'Curated Hashtag Sets' },
                    { id: 'headlines', label: 'Viral Blog Headlines' },
                    { id: 'outline', label: 'Full Article Outline' },
                    { id: 'draft_intro', label: 'Draft Intro' },
                    { id: 'sales_copy', label: 'Sales Landing Copy' },
                    { id: 'cta_suggestions', label: '15 High-Converting CTAs' },
                    { id: 'faq', label: 'Objection FAQs' },
                  ].map((act) => (
                    <button
                      key={act.id}
                      onClick={() => setAiAction(act.id)}
                      className={`py-2 px-2.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        aiAction === act.id
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateAI}
                disabled={isGeneratingAi}
                className="w-full py-3 bg-[var(--theme-primary)] hover:bg-[#2646B8] disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini 3.8 Flash is drafting your content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate {aiAction.replace(/_/g, ' ').toUpperCase()}</span>
                  </>
                )}
              </button>

              {/* AI Output Workspace */}
              {aiResult && (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 text-xs">
                    <span className="font-semibold text-slate-900 font-mono">Generated Output</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(aiResult);
                          showNotification('AI text copied to clipboard!');
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      <button
                        onClick={handleInsertAiToBlogPost}
                        className="px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Send className="w-3 h-3" /> Save to Blog CMS
                      </button>
                      <button
                        onClick={handleTransferAiToPinStudio}
                        className="px-2.5 py-1 bg-rose-600 text-white rounded hover:bg-rose-700 flex items-center gap-1 cursor-pointer font-medium shadow-xs"
                      >
                        <Bookmark className="w-3 h-3" /> Transfer to Pinterest Studio
                      </button>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-800 font-sans whitespace-pre-wrap text-xs leading-relaxed max-h-96 overflow-y-auto">
                    {aiResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PINTEREST CAMPAIGNS */}
          {activeTab === 'pins' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">Pinterest Pin Campaigns</h2>
                  <p className="text-xs text-slate-500">Track 2:3 vertical pins, click analytics, and destination page performance.</p>
                </div>
                <button
                  onClick={() => setCurrentPage('pinterest_studio')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Bookmark className="w-4 h-4" /> Open Pin Designer Studio
                </button>
              </div>

              <div className="divide-y divide-[var(--theme-border)] border border-[var(--theme-border)] rounded-xl overflow-hidden">
                {pins.map((pin) => (
                  <div key={pin.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-serif font-bold text-sm text-slate-900">{pin.headlineOverlay}</h4>
                        <span className="text-[10px] font-mono bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded">
                          {pin.colorPreset}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-3">
                        <span>Board: {pin.boardName}</span>
                        <span>·</span>
                        <span>Destination: {pin.destinationUrl}</span>
                        <span>·</span>
                        <span className="tabular-nums font-semibold text-slate-800">{pin.pinClicksCount} Clicks</span>
                        <span>·</span>
                        <span className="tabular-nums text-slate-600">{pin.savesCount} Saves</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ORDERS & FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">Orders & Fulfillment</h2>
                <p className="text-xs text-slate-500">Verify manual payments, view gateway transaction IDs, and inspect download tokens.</p>
              </div>

              <div className="divide-y divide-[var(--theme-border)] border border-[var(--theme-border)] rounded-xl overflow-hidden">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm font-mono text-slate-900">{ord.orderNumber}</span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                              ord.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.paymentStatus === 'manual_verification'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {ord.paymentStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {ord.customerName} ({ord.customerEmail}) · {new Date(ord.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-base text-slate-900 tabular-nums">
                          ${ord.totalAmount.toFixed(2)} USD
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Gateway: {ord.paymentGatewayId}</div>
                      </div>
                    </div>

                    {/* Manual Payment Approval Action */}
                    {ord.paymentStatus === 'manual_verification' && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-amber-900">Manual UTR / Ref: </span>
                          <span className="font-mono">{ord.manualPaymentRef || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVerifyOrder(ord.id, true)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold cursor-pointer"
                          >
                            Approve & Unlock Files
                          </button>
                          <button
                            onClick={() => handleVerifyOrder(ord.id, false)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PAYMENT GATEWAYS (UP TO 10 MODULAR PROVIDERS) */}
          {activeTab === 'gateways' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">Payment Gateway Manager</h2>
                <p className="text-xs text-slate-500">
                  Configure up to 10 independent payment gateways. Seamlessly toggle live/test mode without redesigning checkout.
                </p>
              </div>

              <div className="space-y-3">
                {gateways.map((gw) => (
                  <div
                    key={gw.providerId}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900">{gw.displayName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({gw.providerId})</span>
                      </div>
                      <p className="text-slate-500 mb-2">{gw.instructions}</p>
                      <div className="text-[11px] font-mono text-slate-400">
                        Currencies: {gw.supportedCurrencies.join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Test Mode toggle */}
                      <button
                        onClick={() => handleToggleGatewayMode(gw.providerId)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium border cursor-pointer ${
                          gw.isTestMode
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {gw.isTestMode ? 'TEST MODE' : 'LIVE MODE'}
                      </button>

                      {/* Enable toggle */}
                      <button
                        onClick={() => handleToggleGateway(gw.providerId)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          gw.isEnabled
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                      >
                        {gw.isEnabled ? 'Active in Checkout' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: COUPONS & DISCOUNTS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">Coupons & Promotions</h2>
                  <p className="text-xs text-slate-500">Configure percentage or fixed cart discount rules.</p>
                </div>
              </div>

              {/* Add Coupon Form */}
              <form onSubmit={handleAddCoupon} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="CODE (e.g. AUTUMN30)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="px-3 py-2 bg-white border border-slate-300 rounded uppercase font-mono font-bold"
                />
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  className="w-20 px-3 py-2 bg-white border border-slate-300 rounded font-mono"
                />
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="px-3 py-2 bg-white border border-slate-300 rounded"
                >
                  <option value="percentage">% Percentage Off</option>
                  <option value="fixed">$ Fixed Amount Off</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Add Promotion
                </button>
              </form>

              {/* Coupons List */}
              <div className="divide-y divide-[var(--theme-border)] border border-[var(--theme-border)] rounded-xl overflow-hidden">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm tracking-wider mr-2">{c.code}</span>
                      <span className="text-emerald-700 font-semibold">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Min Order: ${c.minOrderAmount || 0} · Used {c.timesUsed} times
                      </div>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {c.isActive ? 'Active' : 'Expired'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: THEME CUSTOMIZER */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">Visual Theme Customizer</h2>
                  <p className="text-xs text-slate-500">Live controls for storefront palette, typography, and layout presets.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetTheme}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Preset Switcher */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold block mb-3">
                  Design System Presets
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => applyThemePreset('classic_editorial')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      theme.presetName === 'classic_editorial'
                        ? 'border-blue-600 bg-white ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-serif font-bold text-sm text-slate-900">Classic Editorial</div>
                    <div className="text-[11px] text-slate-500 mt-1">Warm ivory canvas, Fraunces serif headlines, magazine layout rhythm.</div>
                  </button>

                  <button
                    onClick={() => applyThemePreset('modern_commerce')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      theme.presetName === 'modern_commerce'
                        ? 'border-blue-600 bg-white ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-sans font-bold text-sm text-slate-900">Modern Commerce</div>
                    <div className="text-[11px] text-slate-500 mt-1">Clean crisp white background, geometric typography, bold high-contrast CTAs.</div>
                  </button>
                </div>
              </div>

              {/* Granular Color Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Canvas Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.palette.bg}
                      onChange={(e) => updateTheme({ palette: { ...theme.palette, bg: e.target.value } })}
                      className="w-9 h-9 rounded cursor-pointer border"
                    />
                    <input
                      type="text"
                      value={theme.palette.bg}
                      onChange={(e) => updateTheme({ palette: { ...theme.palette, bg: e.target.value } })}
                      className="flex-1 px-3 py-1.5 font-mono bg-slate-50 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.palette.primary}
                      onChange={(e) => updateTheme({ palette: { ...theme.palette, primary: e.target.value } })}
                      className="w-9 h-9 rounded cursor-pointer border"
                    />
                    <input
                      type="text"
                      value={theme.palette.primary}
                      onChange={(e) => updateTheme({ palette: { ...theme.palette, primary: e.target.value } })}
                      className="flex-1 px-3 py-1.5 font-mono bg-slate-50 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Secondary Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.palette.accent}
                      onChange={(e) => updateTheme({ palette: { ...theme.palette, accent: e.target.value } })}
                      className="w-9 h-9 rounded cursor-pointer border"
                    />
                    <input
                      type="text"
                      value={theme.palette.accent}
                      onChange={(e) => updateTheme({ palette: { ...theme.palette, accent: e.target.value } })}
                      className="flex-1 px-3 py-1.5 font-mono bg-slate-50 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Border Radius</label>
                  <select
                    value={theme.layout.borderRadius}
                    onChange={(e) => updateTheme({ layout: { ...theme.layout, borderRadius: e.target.value } })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded"
                  >
                    <option value="0.25rem">Subtle (4px)</option>
                    <option value="0.5rem">Standard Editorial (8px)</option>
                    <option value="0.75rem">Rounded Contemporary (12px)</option>
                    <option value="1rem">Soft Curved (16px)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">Email Subscribers & Lead Magnets</h2>
                <p className="text-xs text-slate-500">Audience opted into weekly newsletters and free starter blueprint downloads.</p>
              </div>

              <div className="divide-y divide-[var(--theme-border)] border border-[var(--theme-border)] rounded-xl overflow-hidden">
                {[
                  { email: 'sarah.miller@creative.co', source: 'Lead Magnet Modal', date: '2026-10-15', magnet: 'Free 7-Day Digital Product Starter Blueprint' },
                  { email: 'marcus.vance@studio.org', source: 'Blog Footer Form', date: '2026-10-16', magnet: 'None (Direct Dispatch)' },
                  { email: 'elena.rostova@forma.design', source: 'Checkout Opt-In', date: '2026-10-17', magnet: 'None (Customer)' },
                  { email: 'amita.sharma@gmail.com', source: 'Checkout Opt-In', date: '2026-10-18', magnet: 'None (Customer)' },
                ].map((sub, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-mono font-semibold text-slate-900">{sub.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Opted-in via {sub.source} · {sub.date}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {sub.magnet}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: SEO & REDIRECTS */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">Search Engine Optimization & Robots Rules</h2>
                <p className="text-xs text-slate-500">Automated XML sitemaps, robots.txt directives, and canonical indexing controls.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Live XML Sitemap URL</div>
                  <div className="font-mono text-[11px] text-blue-600 bg-white p-2 rounded border border-slate-200">
                    /sitemap.xml
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Robots.txt Configuration</div>
                  <pre className="font-mono text-[11px] text-slate-700 bg-white p-3 rounded border border-slate-200 overflow-x-auto">
{`User-agent: *
Disallow: /admin
Disallow: /checkout
Disallow: /account/downloads
Disallow: /api/
Allow: /

Sitemap: https://veritascraft.com/sitemap.xml`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: SYSTEM AUDIT LOGS */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">System Audit Log</h2>
                <p className="text-xs text-slate-500">Immutable ledger of administrative actions, product edits, and order state transitions.</p>
              </div>

              <div className="divide-y divide-[var(--theme-border)] border border-[var(--theme-border)] rounded-xl overflow-hidden font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-slate-50">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">[{log.action}]</span>
                      <span className="text-slate-600">{log.details}</span>
                    </div>
                    <div className="text-slate-400 whitespace-nowrap text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Edit / Create Modal with Full Media & Video Manager */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-auto max-h-[92vh] flex flex-col border border-slate-200 text-xs overflow-hidden">
            {/* Modal Header & Tab Navigation */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    Product Studio
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{editingProduct.sku || 'SKU'}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5">
                  {editingProduct.name || 'Edit Product Record'}
                </h3>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setProductModalTab('media')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    productModalTab === 'media'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-blue-600" />
                  <span>Media & Videos</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded-full font-bold">
                    {editingProduct.mediaGallery?.length || (editingProduct.coverImage ? 1 : 0)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setProductModalTab('details')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    productModalTab === 'details'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-slate-600" />
                  <span>Core Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProductModalTab('settings')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    productModalTab === 'settings'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 text-slate-600" />
                  <span>Catalog & Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProductModalTab('landing')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    productModalTab === 'landing'
                      ? 'bg-white text-blue-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Landing Page</span>
                  {editingProduct.hasDedicatedLandingPage && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {productModalTab === 'media' && (
                <div>
                  <ProductMediaManager
                    product={editingProduct}
                    onChange={(updated) => setEditingProduct({ ...editingProduct, ...updated })}
                    showNotification={showNotification}
                  />
                </div>
              )}

              {productModalTab === 'details' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Compare Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editingProduct.comparePrice || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, comparePrice: Number(e.target.value) || undefined })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Category</label>
                      <input
                        type="text"
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">SKU</label>
                      <input
                        type="text"
                        value={editingProduct.sku}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Short Description (Summary)</label>
                    <textarea
                      rows={2}
                      value={editingProduct.shortDescription}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Full Long Description</label>
                    <textarea
                      rows={5}
                      value={editingProduct.longDescription}
                      onChange={(e) => setEditingProduct({ ...editingProduct, longDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {productModalTab === 'settings' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="font-semibold text-slate-900 text-sm">Catalog Visibility & Features</h4>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isAvailable}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">Available on Storefront</div>
                        <div className="text-[11px] text-slate-500">Allow customers to discover and purchase this item.</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.hasDedicatedLandingPage}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setEditingProduct({
                            ...editingProduct,
                            hasDedicatedLandingPage: isChecked,
                            landingPageConfig: editingProduct.landingPageConfig || {
                              headline: editingProduct.name || 'Exclusive Digital System',
                              subheadline: editingProduct.shortDescription || 'Transform your daily workflow with our engineered digital asset.',
                              heroBadge: 'Verified Digital Asset',
                              ctaText: `Download Instant Access — $${editingProduct.price || 29}`,
                              guaranteeText: '30-Day Money-Back Guarantee: If you are not satisfied, we will issue a full refund.',
                              whoIsThisFor: ['Designers & creators', 'Independent digital publishers', 'High-volume operators'],
                              whoIsThisNotFor: ['People looking for generic uncustomizable templates'],
                              featureHighlights: [],
                              comparisonTable: [],
                              sections: [
                                { id: 'sec-hero', type: 'hero', isEnabled: true },
                                { id: 'sec-prob', type: 'problem_solution', isEnabled: true },
                                { id: 'sec-walk', type: 'walkthrough', isEnabled: true },
                                { id: 'sec-files', type: 'included_files', isEnabled: true },
                                { id: 'sec-comp', type: 'comparison', isEnabled: true },
                                { id: 'sec-faq', type: 'faq', isEnabled: true },
                                { id: 'sec-grid', type: 'product_grid', isEnabled: true },
                                { id: 'sec-cta', type: 'final_cta', isEnabled: true },
                              ],
                              showHeroImage: true,
                              showProductGrid: true,
                            },
                          });
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">Dedicated Landing Page</div>
                        <div className="text-[11px] text-slate-500">Enables high-converting standalone sales funnel for this item.</div>
                      </div>
                    </label>

                    {editingProduct.hasDedicatedLandingPage && (
                      <div className="mt-2 ml-7 p-3 bg-blue-50/80 border border-blue-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <div className="font-semibold text-blue-900 text-[11px]">Sales Page Active & Linked</div>
                            <div className="text-[10px] text-blue-700">Hero section and product grid are automatically bound to this product's uploaded image.</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setProductModalTab('landing')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            Configure Landing Page & Hero →
                          </button>
                        </div>
                      </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isFeatured}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">Featured in Hero Grid</div>
                        <div className="text-[11px] text-slate-500">Highlighted on the homepage and top catalog sections.</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isFreeLeadMagnet}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isFreeLeadMagnet: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">Free Lead Magnet ($0 instant access)</div>
                        <div className="text-[11px] text-slate-500">Collects customer email and grants direct download link.</div>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">License Type</label>
                      <select
                        value={editingProduct.licenseType}
                        onChange={(e) => setEditingProduct({ ...editingProduct, licenseType: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                      >
                        <option value="Commercial Use">Commercial Use</option>
                        <option value="Personal Use Only">Personal Use Only</option>
                        <option value="Extended Studio License">Extended Studio License</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Download Expiry (Days)</label>
                      <input
                        type="number"
                        value={editingProduct.accessExpiryDays}
                        onChange={(e) => setEditingProduct({ ...editingProduct, accessExpiryDays: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {productModalTab === 'landing' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Landing page enablement banner */}
                  {!editingProduct.hasDedicatedLandingPage ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Dedicated landing page is currently disabled for this product.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, hasDedicatedLandingPage: true })}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold cursor-pointer"
                      >
                        Enable Sales Page
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 text-xs">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Dedicated landing page active. Changes will reflect on <strong>/landing/{editingProduct.slug || editingProduct.id}</strong>.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const targetSlug = editingProduct.slug || editingProduct.id;
                          setSelectedProductSlug(targetSlug);
                          setIsProductModalOpen(false);
                          setCurrentPage('product_landing');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Preview Live Landing Page</span>
                      </button>
                    </div>
                  )}

                  {/* 1. Hero Image & Featured Image Binding Control */}
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                          <span>Landing Page Hero Image & Media Binding</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Configure how the hero section retrieves and displays the featured image.
                        </p>
                      </div>
                    </div>

                    {/* Image Resolution Card */}
                    {(() => {
                      const heroInfo = getProductLandingHeroImage(
                        editingProduct,
                        editingProduct.landingPageConfig?.heroImage || editingProduct.landingPageConfig?.featuredImage
                      );
                      const uploadedImg = getProductUploadedImage(editingProduct);

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-4 bg-white rounded-xl border border-slate-200">
                          {/* Live Thumbnail Preview */}
                          <div className="md:col-span-5 aspect-16/10 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 relative group">
                            {isProductImageUrl(heroInfo.imageUrl) ? (
                              <img
                                src={heroInfo.imageUrl}
                                alt="Hero preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ProductCover type={heroInfo.imageUrl} className="w-full h-full" title={editingProduct.name} />
                            )}
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-white backdrop-blur-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{heroInfo.source === 'custom' ? 'Custom Hero' : heroInfo.source === 'product_main' ? 'Main Product Image' : 'Default Illustration'}</span>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="md:col-span-7 space-y-3">
                            <div>
                              <span className="text-xs font-semibold text-slate-800 block mb-1">
                                Image Source Priority:
                              </span>
                              <div className="space-y-2">
                                <label className="flex items-start gap-2.5 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="heroImageSource"
                                    checked={!editingProduct.landingPageConfig?.heroImage && !editingProduct.landingPageConfig?.featuredImage}
                                    onChange={() => {
                                      setEditingProduct({
                                        ...editingProduct,
                                        landingPageConfig: {
                                          ...editingProduct.landingPageConfig!,
                                          heroImage: undefined,
                                          featuredImage: undefined,
                                        },
                                      });
                                    }}
                                    className="mt-0.5 text-blue-600"
                                  />
                                  <div>
                                    <div className="font-semibold text-slate-900 text-xs">
                                      Use Main Uploaded Product Image (Recommended)
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                      {uploadedImg
                                        ? 'Automatically binds to the primary photo uploaded in the Media tab.'
                                        : 'No custom photo uploaded yet. Uses default aesthetic graphic until an image is uploaded in the Media tab.'}
                                    </div>
                                  </div>
                                </label>

                                <label className="flex items-start gap-2.5 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="heroImageSource"
                                    checked={Boolean(editingProduct.landingPageConfig?.heroImage || editingProduct.landingPageConfig?.featuredImage)}
                                    onChange={() => {
                                      const defaultCustom = uploadedImg || editingProduct.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                                      setEditingProduct({
                                        ...editingProduct,
                                        landingPageConfig: {
                                          ...editingProduct.landingPageConfig!,
                                          heroImage: defaultCustom,
                                          featuredImage: defaultCustom,
                                        },
                                      });
                                    }}
                                    className="mt-0.5 text-blue-600"
                                  />
                                  <div>
                                    <div className="font-semibold text-slate-900 text-xs">
                                      Use Custom Landing Page Hero Image
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                      Specify a custom hero banner or select a specific secondary photo.
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>

                            {/* Custom Image Input if Custom is Selected */}
                            {(editingProduct.landingPageConfig?.heroImage || editingProduct.landingPageConfig?.featuredImage) && (
                              <div className="pt-2 border-t border-slate-100 space-y-2">
                                <label className="block text-[11px] font-semibold text-slate-700">
                                  Custom Hero / Featured Image URL:
                                </label>
                                <input
                                  type="text"
                                  value={editingProduct.landingPageConfig?.heroImage || editingProduct.landingPageConfig?.featuredImage || ''}
                                  onChange={(e) => {
                                    const val = e.target.value.trim();
                                    setEditingProduct({
                                      ...editingProduct,
                                      landingPageConfig: {
                                        ...editingProduct.landingPageConfig!,
                                        heroImage: val,
                                        featuredImage: val,
                                      },
                                    });
                                  }}
                                  placeholder="https://... or data:image/..."
                                  className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs font-mono"
                                />

                                {editingProduct.mediaGallery && editingProduct.mediaGallery.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                    <span className="text-[10px] text-slate-500">Pick from gallery:</span>
                                    {editingProduct.mediaGallery.filter((m) => m.url).map((m, idx) => (
                                      <button
                                        key={m.id || idx}
                                        type="button"
                                        onClick={() => {
                                          setEditingProduct({
                                            ...editingProduct,
                                            landingPageConfig: {
                                              ...editingProduct.landingPageConfig!,
                                              heroImage: m.url,
                                              featuredImage: m.url,
                                            },
                                          });
                                        }}
                                        className="text-[10px] px-2 py-0.5 border rounded hover:bg-slate-100 cursor-pointer text-slate-700"
                                      >
                                        Media #{idx + 1}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Section Visibility Toggles */}
                    <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.landingPageConfig?.showHeroImage !== false}
                          onChange={(e) => {
                            setEditingProduct({
                              ...editingProduct,
                              landingPageConfig: {
                                ...editingProduct.landingPageConfig!,
                                showHeroImage: e.target.checked,
                              },
                            });
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">Display Hero Showcase Image</div>
                          <div className="text-[10px] text-slate-500">Show high-res 16:9 mockup in hero header.</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.landingPageConfig?.showProductGrid !== false}
                          onChange={(e) => {
                            setEditingProduct({
                              ...editingProduct,
                              landingPageConfig: {
                                ...editingProduct.landingPageConfig!,
                                showProductGrid: e.target.checked,
                              },
                            });
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">Display Product Grid</div>
                          <div className="text-[10px] text-slate-500">Show frequently paired recommendations grid.</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* 2. Copy and Typography Settings */}
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="font-semibold text-slate-900 text-sm">Sales Page Headline & Copy</h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Hero Badge Text</label>
                        <input
                          type="text"
                          value={editingProduct.landingPageConfig?.heroBadge || 'Verified Digital Asset'}
                          onChange={(e) => {
                            setEditingProduct({
                              ...editingProduct,
                              landingPageConfig: {
                                ...editingProduct.landingPageConfig!,
                                heroBadge: e.target.value,
                              },
                            });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Main Hero Headline</label>
                        <input
                          type="text"
                          value={editingProduct.landingPageConfig?.headline || editingProduct.name}
                          onChange={(e) => {
                            setEditingProduct({
                              ...editingProduct,
                              landingPageConfig: {
                                ...editingProduct.landingPageConfig!,
                                headline: e.target.value,
                              },
                            });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Subheadline / Value Prop</label>
                        <textarea
                          rows={2}
                          value={editingProduct.landingPageConfig?.subheadline || editingProduct.shortDescription}
                          onChange={(e) => {
                            setEditingProduct({
                              ...editingProduct,
                              landingPageConfig: {
                                ...editingProduct.landingPageConfig!,
                                subheadline: e.target.value,
                              },
                            });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Primary CTA Button Label</label>
                          <input
                            type="text"
                            value={editingProduct.landingPageConfig?.ctaText || `Download Instant Access — $${editingProduct.price}`}
                            onChange={(e) => {
                              setEditingProduct({
                                ...editingProduct,
                                landingPageConfig: {
                                  ...editingProduct.landingPageConfig!,
                                  ctaText: e.target.value,
                                },
                              });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Guarantee Statement</label>
                          <input
                            type="text"
                            value={editingProduct.landingPageConfig?.guaranteeText || '30-Day Money-Back Guarantee: If you are not satisfied, we will issue a full refund.'}
                            onChange={(e) => {
                              setEditingProduct({
                                ...editingProduct,
                                landingPageConfig: {
                                  ...editingProduct.landingPageConfig!,
                                  guaranteeText: e.target.value,
                                },
                              });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {editingProduct.mediaGallery?.length || 0} media assets attached
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Save Product & Media
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Editorial Publishing CMS Studio Modal */}
      {isBlogModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-auto max-h-[92vh] flex flex-col border border-slate-200 text-xs overflow-hidden">
            {/* Modal Header & Tabs */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                    Editorial CMS
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{editingPost.category}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5 truncate max-w-md">
                  {editingPost.title || 'Untitled Article'}
                </h3>
              </div>

              {/* View Tabs */}
              <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBlogModalTab('blocks')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    blogModalTab === 'blocks'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Content Blocks & Media</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded-full font-bold">
                    {editingPost.contentBlocks?.length || 0}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setBlogModalTab('meta')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    blogModalTab === 'meta'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Metadata & Disclosures</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBlogModalTab('preview')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    blogModalTab === 'preview'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live Reader Preview</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {blogModalTab === 'blocks' && (
                <div>
                  <ArticleBlockEditor
                    post={editingPost}
                    onChange={(updated) => setEditingPost({ ...editingPost, ...updated })}
                    showNotification={showNotification}
                  />
                </div>
              )}

              {blogModalTab === 'meta' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Article Headline</label>
                    <input
                      type="text"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-serif text-base"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={editingPost.slug}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Category</label>
                      <input
                        type="text"
                        value={editingPost.category}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Excerpt Summary</label>
                    <textarea
                      rows={2}
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg leading-relaxed"
                    />
                  </div>

                  {/* Affiliate Disclosure Settings */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-3">
                    <h4 className="font-semibold text-amber-900 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Affiliate & Regulatory Disclosures
                    </h4>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingPost.affiliateDisclosureRequired || editingPost.hasAffiliateLinks}
                        onChange={(e) =>
                          setEditingPost({
                            ...editingPost,
                            affiliateDisclosureRequired: e.target.checked,
                            hasAffiliateLinks: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-amber-600 rounded"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">Show FTC Affiliate Disclosure Banner</div>
                        <div className="text-[11px] text-slate-500">Displays legal compliance notice before article body.</div>
                      </div>
                    </label>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Custom Disclosure Statement</label>
                      <textarea
                        rows={2}
                        value={editingPost.affiliateDisclosureText || ''}
                        placeholder="This article contains honest recommendations for digital tools. When you purchase through our links, we may earn an affiliate commission at no extra cost to you."
                        onChange={(e) => setEditingPost({ ...editingPost, affiliateDisclosureText: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-slate-700"
                      />
                    </div>
                  </div>

                  {/* SEO & Companion Product */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">SEO Title Tag</label>
                      <input
                        type="text"
                        value={editingPost.seoTitle || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, seoTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Promoted Companion Product</label>
                      <select
                        value={editingPost.promotedProductId || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, promotedProductId: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                      >
                        <option value="">None</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (${p.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {blogModalTab === 'preview' && (
                <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-xs max-h-[70vh] overflow-y-auto">
                  <div className="max-w-3xl mx-auto">
                    <ArticleView previewPost={editingPost} />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Status: <strong className="text-slate-800 uppercase">{editingPost.status}</strong>
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    // Update local state
                    const updatedList = blogPosts.some((b) => b.id === editingPost.id)
                      ? blogPosts.map((b) => (b.id === editingPost.id ? editingPost : b))
                      : [editingPost, ...blogPosts];
                    setBlogPosts(updatedList);
                    setIsBlogModalOpen(false);
                    showNotification(`Article "${editingPost.title}" published!`);

                    // Persist to server.ts backend
                    try {
                      await fetch('/api/blog', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editingPost),
                      });
                    } catch (e) {
                      console.error('Failed to sync article to server', e);
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Save & Publish Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
