export type UserRole = 'super_admin' | 'admin' | 'editor' | 'support' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
}

export type ProductType = 'notion_template' | 'canva_template' | 'pdf_guide' | 'sheets' | 'zip_bundle' | 'design_assets';

export interface ProductFileItem {
  name: string;
  format: string;
  size: string;
  version: string;
  downloadUrl: string;
}

export interface ProductBonus {
  title: string;
  value: number;
  description: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface ProductReview {
  id: string;
  authorName: string;
  authorRole?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerifiedBuyer: boolean;
}

export interface LandingPageSectionConfig {
  id: string;
  type: 'announcement' | 'hero' | 'problem_solution' | 'walkthrough' | 'included_files' | 'bonuses' | 'comparison' | 'testimonials' | 'faq' | 'final_cta' | 'product_grid';
  isEnabled: boolean;
  title?: string;
  subtitle?: string;
  content?: any;
}

export interface LandingPageConfig {
  headline: string;
  subheadline: string;
  heroBadge: string;
  ctaText: string;
  guaranteeText: string;
  whoIsThisFor: string[];
  whoIsThisNotFor: string[];
  featureHighlights: { icon: string; title: string; description: string }[];
  comparisonTable: {
    feature: string;
    ourProduct: string;
    buildingFromScratch: string;
    expensiveAgency: string;
  }[];
  sections: LandingPageSectionConfig[];
  heroImage?: string;
  featuredImage?: string;
  showHeroImage?: boolean;
  showProductGrid?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  comparePrice?: number;
  category: string;
  tags: string[];
  productType: ProductType;
  fileFormat: string;
  fileSize: string;
  version: string;
  coverImage: string;
  galleryImages: string[];
  licenseType: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFreeLeadMagnet: boolean;
  hasDedicatedLandingPage: boolean;
  landingPageConfig?: LandingPageConfig;
  seoTitle?: string;
  seoDescription?: string;
  customCtaLabel?: string;
  downloadLimit: number;
  accessExpiryDays: number;
  rating: number;
  reviewsCount: number;
  includedFiles: ProductFileItem[];
  bonuses: ProductBonus[];
  faqs: ProductFaq[];
  reviews: ProductReview[];
  relatedProductIds?: string[];
  // Customizable Product Media & Catalog Presentation
  mainMediaType?: 'image' | 'video' | 'both';
  mediaGallery?: ProductMediaItem[];
  catalogMediaMode?: ProductCatalogMediaMode;
}

// -----------------------------------------------------------------------------
// Product Media Types
// -----------------------------------------------------------------------------
export type ProductMediaType = 'image' | 'video';
export type VideoProvider = 'direct' | 'youtube' | 'vimeo';

export interface ProductMediaItem {
  id: string;
  type: ProductMediaType;
  url: string;
  posterUrl?: string; // thumbnail or poster for video
  altText?: string;
  caption?: string;
  displayOrder: number;
  isPrimary: boolean;
  isVisible: boolean;
  duration?: string; // e.g. "0:45"
  videoProvider?: VideoProvider;
  autoplay?: boolean;
}

export type ProductCatalogMediaMode = 'image_only' | 'video_thumbnail' | 'gallery_preview' | 'hover_preview';

// -----------------------------------------------------------------------------
// Editorial Publishing & Article Content Block Types
// -----------------------------------------------------------------------------
export type ArticleBlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'video'
  | 'two_column'
  | 'quote'
  | 'bullet_list'
  | 'numbered_list'
  | 'affiliate_card'
  | 'button_cta'
  | 'divider'
  | 'callout'
  | 'custom_embed';

export type ImageAlignment = 'left' | 'center' | 'right' | 'full' | 'float_left' | 'float_right';
export type VideoAlignment = 'left' | 'center' | 'right' | 'full';

export interface TextTypographyStyle {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
}

export interface LinkItem {
  text: string;
  url: string;
  target?: '_blank' | '_self';
  title?: string;
  isAffiliate?: boolean;
  rel?: string;
}

export interface ArticleContentBlock {
  id: string;
  type: ArticleBlockType;
  content?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  listItems?: string[];
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageLinkUrl?: string;
  imageAlign?: ImageAlignment;
  imageWidth?: number; // 25 to 100 percentage
  imageAspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  videoUrl?: string;
  videoPosterUrl?: string;
  videoCaption?: string;
  videoTitle?: string;
  videoAlign?: VideoAlignment;
  videoProvider?: VideoProvider;
  videoAspectRatio?: '16/9' | '4/3' | '1/1' | '9/16';
  videoAutoplay?: boolean;
  videoMuted?: boolean;
  twoColumnLayout?: {
    leftType: 'text' | 'image' | 'video';
    rightType: 'text' | 'image' | 'video';
    textContent: string;
    mediaUrl: string;
    mediaCaption?: string;
    mediaType: 'image' | 'video';
    ratio: '50_50' | '60_40' | '40_60';
  };
  affiliateCard?: {
    productId?: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    price?: number;
    destinationUrl: string;
    disclosureNote?: string;
    badgeText?: string;
    buttonLabel: string;
    isSponsored: boolean;
  };
  buttonCta?: {
    label: string;
    url: string;
    style?: 'primary' | 'secondary' | 'outline';
    align?: 'left' | 'center' | 'right';
    isAffiliate?: boolean;
  };
  style?: TextTypographyStyle;
  links?: LinkItem[];
  isHidden?: boolean;
}

export interface BlogAuthor {
  id: string;
  name: string;
  slug: string;
  roleTitle: string;
  bio: string;
  avatarUrl: string;
}

export interface BlogComment {
  id: string;
  authorName: string;
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentBlocks?: ArticleContentBlock[];
  affiliateDisclosureText?: string;
  hasAffiliateLinks?: boolean;
  featuredImage: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  templateType: 'how_to_guide' | 'listicle' | 'product_comparison' | 'tutorial' | 'case_study';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  estimatedReadTime: number;
  affiliateDisclosureRequired: boolean;
  promotedProductId?: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  publishedAt: string;
  updatedAt: string;
  viewsCount: number;
  comments: BlogComment[];
}

export type PinSizePreset = 'standard' | 'square' | 'vertical_video' | 'taller' | 'custom';

export type PinBackgroundType =
  | 'solid'
  | 'gradient'
  | 'image_upload'
  | 'image_library'
  | 'image_url'
  | 'video_upload'
  | 'video_library'
  | 'video_url';

export interface PinBackgroundConfig {
  type: PinBackgroundType;
  color: string;
  gradient: {
    from: string;
    to: string;
    direction: 'to-b' | 'to-br' | 'to-r' | 'to-tr';
  };
  imageUrl?: string;
  videoUrl?: string;
  imageFit: 'cover' | 'contain' | 'fill';
  position: { x: number; y: number }; // percentages 0-100
  zoom: number; // 1.0 to 2.5
  brightness: number; // 50 to 150
  contrast: number; // 50 to 150
  blur: number; // 0 to 20
  opacity: number; // 0 to 100
  overlayColor: string;
  overlayOpacity: number; // 0 to 100
  overlayType?: 'solid' | 'gradient';
  overlayGradient?: {
    from: string;
    to: string;
    direction: string;
  };
  focalPointPreset?: string;
  videoFit: 'cover' | 'contain';
  videoMuted: boolean;
  videoTrimStart: number;
  videoTrimEnd: number;
  videoPosterUrl?: string;
}

export type TextPresetType =
  | 'headline'
  | 'subtitle'
  | 'description'
  | 'cta_button'
  | 'price_badge'
  | 'website_url'
  | 'brand_logo'
  | 'custom';

export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export interface PinTextLayer {
  id: string;
  presetType: TextPresetType;
  text: string;
  // Responsive positions as percentage of canvas (0 to 100)
  x: number;
  y: number;
  width?: number; // percentage of canvas width (e.g. 80)
  rotation: number; // degrees -180 to 180
  zIndex: number;
  isLocked: boolean;

  // Typography
  fontFamily: string;
  fontCategory?: 'serif' | 'sans-serif' | 'modern' | 'display' | 'handwritten' | 'bold';
  fontSize: number; // base size (relative to 1000px canvas width)
  fontWeight: string; // '400' | '600' | '700' | '800' | 'bold'
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number; // px (-2 to 10)
  lineHeight: number; // multiplier (0.8 to 2.2)
  textTransform: TextTransform;

  // Color & Gradient
  color: string;
  opacity: number; // 0 to 100
  isGradientText?: boolean;
  textGradient?: {
    from: string;
    to: string;
    direction: string;
  };

  // Outline / Stroke
  hasOutline?: boolean;
  outlineColor?: string;
  outlineWidth?: number; // 1 to 10

  // Shadow
  hasShadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // Background Highlight / Pill / Badge
  hasBackground?: boolean;
  backgroundColor?: string;
  backgroundOpacity?: number; // 0 to 100
  backgroundPaddingX?: number; // px
  backgroundPaddingY?: number; // px
  backgroundRadius?: number; // px (0 to 50)
  backgroundBorderColor?: string;
  backgroundBorderWidth?: number;
}

export interface PinAudioConfig {
  sourceType: 'none' | 'upload' | 'library';
  audioUrl?: string;
  audioName?: string;
  duration?: number; // seconds
  fileSize?: string;
  volume: number; // 0 to 100
  isMuted: boolean;
  startTime: number; // seconds
  endTime?: number; // seconds
  fadeInSeconds: number; // 0 to 5
  fadeOutSeconds: number; // 0 to 5
  loop?: boolean;
  trackId?: string;
  originalVideoVolume?: number; // 0 to 100
  keepVideoAudio?: boolean;
}

export interface PinDesign {
  id: string;
  title: string;
  description: string;
  destinationUrl: string;
  boardName: string;
  templateName: 'editorial_tip' | 'step_by_step' | 'checklist' | 'product_showcase' | 'comparison';
  headlineOverlay: string;
  subtitleOverlay: string;
  ctaOverlay: string;
  brandTagline: string;
  colorPreset: 'classic_ivory' | 'royal_blue' | 'muted_teal' | 'coral_sunset' | 'obsidian';
  aspectRatio: string;
  sizePreset: PinSizePreset;
  canvasWidth: number;
  canvasHeight: number;
  backgroundConfig: PinBackgroundConfig;
  imageUrl?: string;
  videoUrl?: string;
  textLayers?: PinTextLayer[];
  audioConfig?: PinAudioConfig;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  status: 'draft' | 'ready' | 'published';
  pinClicksCount: number;
  savesCount: number;
  createdAt: string;
}

export type AiToolType =
  | 'pin_title'
  | 'pin_description'
  | 'pin_keywords'
  | 'pin_hashtags'
  | 'blog_outline'
  | 'seo_meta'
  | 'blog_intro'
  | 'product_description'
  | 'sales_copy'
  | 'cta_suggestions'
  | 'social_copy'
  | 'email_marketing'
  | 'rewrite_expand';

export interface AiWritingOutput {
  id: string;
  toolType: AiToolType;
  topic: string;
  generatedContent: string;
  targetAudience?: string;
  tone?: string;
  language?: string;
  createdAt: string;
}

export interface PaymentGateway {
  providerId: 'stripe' | 'razorpay' | 'cashfree' | 'phonepe' | 'paypal' | 'payu' | 'ccavenue' | 'authorizenet' | 'mollie' | 'manual_transfer';
  displayName: string;
  logoText: string;
  isEnabled: boolean;
  isTestMode: boolean;
  supportedCurrencies: string[];
  displayOrder: number;
  apiKeyPublic?: string;
  instructions?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  timesUsed: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isAddon?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  isAddon: boolean;
  fileFormat: string;
  fileSize: string;
  downloadToken: string;
  version: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'manual_verification';
  paymentGatewayId: string;
  gatewayTransactionId?: string;
  manualPaymentRef?: string;
  items: OrderItem[];
  createdAt: string;
  completedAt?: string;
}

export interface DownloadPermission {
  token: string;
  orderId: string;
  productId: string;
  productName: string;
  fileFormat: string;
  fileSize: string;
  version: string;
  fileName: string;
  timesDownloaded: number;
  maxDownloads: number;
  expiresAt: string;
}

export interface ThemeSettings {
  presetName: 'classic_editorial' | 'modern_commerce';
  palette: {
    bg: string;
    surface: string;
    text: string;
    primary: string;
    accent: string;
    softAccent: string;
    offer: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  layout: {
    containerWidth: string;
    borderRadius: string;
    cardStyle: 'bordered' | 'flat' | 'shadow';
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

export interface NewsletterSubscriber {
  email: string;
  source: string;
  subscribedAt: string;
  leadMagnetClaimed?: string;
}
