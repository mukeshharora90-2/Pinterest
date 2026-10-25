import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  BlogPost,
  CartItem,
  PaymentGateway,
  Coupon,
  PinDesign,
  Order,
  ThemeSettings,
  UserProfile,
  AuditLog,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BLOG_POSTS,
  INITIAL_GATEWAYS,
  INITIAL_COUPONS,
  INITIAL_PINS,
  INITIAL_ORDERS,
  INITIAL_THEME,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

export type ActivePage =
  | 'home'
  | 'shop'
  | 'best_sellers'
  | 'product_detail'
  | 'product_landing'
  | 'blog'
  | 'article_detail'
  | 'pinterest_studio'
  | 'cart'
  | 'checkout'
  | 'order_confirmation'
  | 'customer_account'
  | 'admin_dashboard'
  | 'about'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'delivery_policy';

interface StoreContextType {
  // Navigation
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  selectedArticleSlug: string | null;
  setSelectedArticleSlug: (slug: string | null) => void;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;

  // User & Roles
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserProfile['role']) => void;

  // Data
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  pins: PinDesign[];
  setPins: React.Dispatch<React.SetStateAction<PinDesign[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  auditLogs: AuditLog[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, isAddon?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons & Pricing
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculatedDiscount: number;

  // Theme
  theme: ThemeSettings;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
  applyThemePreset: (preset: 'classic_editorial' | 'modern_commerce') => void;

  // Notifications
  notification: string | null;
  showNotification: (msg: string) => void;

  // Inter-module Bridge: AI Writing Studio to Pinterest Studio
  transferredPinData: { title?: string; description?: string; headline?: string } | null;
  sendToPinStudio: (data: { title?: string; description?: string; headline?: string }) => void;
  clearTransferredPinData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state with URL and localStorage sync
  const [currentPage, setCurrentPage] = useState<ActivePage>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as ActivePage;
      if (pageParam) return pageParam;
      if (params.get('landing')) return 'product_landing';
      const saved = localStorage.getItem('vc_current_page') as ActivePage;
      if (saved) return saved;
    }
    return 'home';
  });

  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const slugParam = params.get('slug') || params.get('landing') || params.get('product');
      if (slugParam) return slugParam;
      const saved = localStorage.getItem('vc_selected_product_slug');
      if (saved) return saved;
    }
    return null;
  });

  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const articleParam = params.get('article');
      if (articleParam) return articleParam;
      const saved = localStorage.getItem('vc_selected_article_slug');
      if (saved) return saved;
    }
    return null;
  });

  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // User auth state
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-admin-01',
    email: 'admin@veritascraft.com',
    fullName: 'Julian Vance',
    role: 'super_admin',
    avatarUrl: 'author_julian',
    bio: 'Founder & Editor-in-Chief at VeritasCraft.',
  });

  // App data state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vc_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('vc_blog_posts');
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
  });

  const [gateways, setGateways] = useState<PaymentGateway[]>(() => {
    const saved = localStorage.getItem('vc_gateways');
    return saved ? JSON.parse(saved) : INITIAL_GATEWAYS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('vc_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [pins, setPins] = useState<PinDesign[]>(() => {
    const saved = localStorage.getItem('vc_pins');
    return saved ? JSON.parse(saved) : INITIAL_PINS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('vc_wishlist');
    return saved ? JSON.parse(saved) : ['prod-01'];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [transferredPinData, setTransferredPinData] = useState<{
    title?: string;
    description?: string;
    headline?: string;
  } | null>(null);

  const sendToPinStudio = (data: { title?: string; description?: string; headline?: string }) => {
    setTransferredPinData(data);
    setCurrentPage('pinterest_studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('AI content transferred to Pinterest Studio!');
  };

  const clearTransferredPinData = () => {
    setTransferredPinData(null);
  };

  // Theme settings
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('vc_theme');
    return saved ? JSON.parse(saved) : INITIAL_THEME;
  });

  // Apply CSS Custom Properties directly to DOM on theme update
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', theme.palette.bg);
    root.style.setProperty('--theme-surface', theme.palette.surface);
    root.style.setProperty('--theme-text', theme.palette.text);
    root.style.setProperty('--theme-primary', theme.palette.primary);
    root.style.setProperty('--theme-accent', theme.palette.accent);
    root.style.setProperty('--theme-soft-accent', theme.palette.softAccent);
    root.style.setProperty('--theme-offer', theme.palette.offer);
    root.style.setProperty('--theme-border', theme.palette.border);
    root.style.setProperty('--theme-radius', theme.layout.borderRadius);
    root.style.setProperty('--font-heading', theme.typography.headingFont);
    root.style.setProperty('--font-body', theme.typography.bodyFont);

    localStorage.setItem('vc_theme', JSON.stringify(theme));
  }, [theme]);

  // Persist products, blog, cart, etc.
  useEffect(() => {
    localStorage.setItem('vc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vc_blog_posts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('vc_gateways', JSON.stringify(gateways));
  }, [gateways]);

  useEffect(() => {
    localStorage.setItem('vc_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('vc_pins', JSON.stringify(pins));
  }, [pins]);

  useEffect(() => {
    localStorage.setItem('vc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vc_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync navigation to localStorage and update browser URL for seamless sharing, refresh, and public links
  useEffect(() => {
    localStorage.setItem('vc_current_page', currentPage);
    if (selectedProductSlug) {
      localStorage.setItem('vc_selected_product_slug', selectedProductSlug);
    }
    if (selectedArticleSlug) {
      localStorage.setItem('vc_selected_article_slug', selectedArticleSlug);
    }

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (currentPage === 'product_landing') {
          url.searchParams.set('page', 'product_landing');
          if (selectedProductSlug) url.searchParams.set('slug', selectedProductSlug);
        } else if (currentPage === 'product_detail') {
          url.searchParams.set('page', 'product_detail');
          if (selectedProductSlug) url.searchParams.set('slug', selectedProductSlug);
        } else if (currentPage === 'article_detail') {
          url.searchParams.set('page', 'article_detail');
          if (selectedArticleSlug) url.searchParams.set('article', selectedArticleSlug);
        } else if (currentPage === 'home') {
          url.searchParams.delete('page');
          url.searchParams.delete('slug');
          url.searchParams.delete('landing');
          url.searchParams.delete('article');
        } else {
          url.searchParams.set('page', currentPage);
          url.searchParams.delete('landing');
        }
        window.history.replaceState({}, '', url.toString());
      } catch (err) {
        // Ignore in restricted environments
      }
    }
  }, [currentPage, selectedProductSlug, selectedArticleSlug]);

  // Notification helper
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3800);
  };

  // Cart actions
  const addToCart = (product: Product, isAddon = false) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, isAddon }];
    });
    showNotification(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Coupon handling
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }

    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `This code requires a minimum purchase of $${found.minOrderAmount}.`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon "${found.code}" applied: ${
        found.discountType === 'percentage' ? `${found.discountValue}% off` : `$${found.discountValue} off`
      }!`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Coupon removed.');
  };

  let calculatedDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      calculatedDiscount = (cartSubtotal * appliedCoupon.discountValue) / 100;
    } else {
      calculatedDiscount = Math.min(cartSubtotal, appliedCoupon.discountValue);
    }
  }

  // Wishlist handling
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification('Item removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Item added to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Role switching
  const switchRole = (role: UserProfile['role']) => {
    if (role === 'super_admin' || role === 'admin') {
      setCurrentUser({
        id: 'user-admin-01',
        email: 'admin@veritascraft.com',
        fullName: 'Julian Vance (Admin)',
        role,
        bio: 'Editorial Director with full administrative permissions.',
      });
      showNotification(`Switched role to ${role.toUpperCase()}. Admin access enabled.`);
    } else if (role === 'editor') {
      setCurrentUser({
        id: 'user-editor-02',
        email: 'editor@veritascraft.com',
        fullName: 'Clara Beaumont (Editor)',
        role: 'editor',
        bio: 'Senior Content & Visual Growth Editor.',
      });
      showNotification('Switched role to EDITOR. Content management enabled.');
    } else {
      setCurrentUser({
        id: 'user-cust-03',
        email: 'sarah.miller@creative.co',
        fullName: 'Sarah Miller (Customer)',
        role: 'customer',
        bio: 'Independent Creator & Verified Customer.',
      });
      showNotification('Switched role to CUSTOMER view.');
    }
  };

  // Theme controls
  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    setTheme((prev) => ({
      ...prev,
      ...newTheme,
      palette: { ...prev.palette, ...(newTheme.palette || {}) },
      typography: { ...prev.typography, ...(newTheme.typography || {}) },
      layout: { ...prev.layout, ...(newTheme.layout || {}) },
    }));
  };

  const resetTheme = () => {
    setTheme(INITIAL_THEME);
    showNotification('Theme reset to Classic Editorial default.');
  };

  const applyThemePreset = (preset: 'classic_editorial' | 'modern_commerce') => {
    if (preset === 'classic_editorial') {
      setTheme(INITIAL_THEME);
      showNotification('Applied Classic Editorial preset.');
    } else {
      setTheme({
        presetName: 'modern_commerce',
        palette: {
          bg: '#FFFFFF',
          surface: '#F8FAFC',
          text: '#0F172A',
          primary: '#2563EB',
          accent: '#0D9488',
          softAccent: '#F1F5F9',
          offer: '#EA580C',
          border: '#E2E8F0',
        },
        typography: {
          headingFont: "'Plus Jakarta Sans', system-ui, sans-serif",
          bodyFont: "'Plus Jakarta Sans', system-ui, sans-serif",
        },
        layout: {
          containerWidth: '1280px',
          borderRadius: '0.375rem',
          cardStyle: 'bordered',
        },
      });
      showNotification('Applied Modern Commerce preset.');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProductSlug,
        setSelectedProductSlug,
        selectedArticleSlug,
        setSelectedArticleSlug,
        lastCompletedOrder,
        setLastCompletedOrder,
        currentUser,
        setCurrentUser,
        switchRole,
        products,
        setProducts,
        blogPosts,
        setBlogPosts,
        gateways,
        setGateways,
        coupons,
        setCoupons,
        pins,
        setPins,
        orders,
        setOrders,
        auditLogs,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculatedDiscount,
        theme,
        updateTheme,
        resetTheme,
        applyThemePreset,
        notification,
        showNotification,
        transferredPinData,
        sendToPinStudio,
        clearTransferredPinData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
