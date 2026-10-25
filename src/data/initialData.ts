import { Product, BlogPost, PaymentGateway, Coupon, ThemeSettings, PinDesign, Order, AuditLog } from '../types';

export const INITIAL_THEME: ThemeSettings = {
  presetName: 'classic_editorial',
  palette: {
    bg: '#FAF8F4',
    surface: '#FFFFFF',
    text: '#20232A',
    primary: '#3157D5',
    accent: '#4C9B91',
    softAccent: '#EEF3FF',
    offer: '#E77A67',
    border: '#E8E5DF',
  },
  typography: {
    headingFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  layout: {
    containerWidth: '1240px',
    borderRadius: '0.5rem',
    cardStyle: 'bordered',
  },
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'The 2026 Creative Director Operating System',
    slug: 'creative-director-operating-system',
    sku: 'VC-NOTION-001',
    shortDescription: 'All-in-one Notion workspace with client portals, editorial pipeline, financial projections, and asset libraries.',
    longDescription: 'The Creative Director Operating System is designed for independent creators, boutique design studios, and digital publishers who need to streamline their client pipeline, content calendar, and financial tracking in one calm, aesthetic workspace. Pre-configured with automated relations, 14 custom dashboard views, and turnkey client onboarding templates.',
    price: 39,
    comparePrice: 69,
    category: 'Planners & Systems',
    tags: ['Best Seller', 'Notion', 'Workflow'],
    productType: 'notion_template',
    fileFormat: 'Notion Workspace Link + PDF Guide',
    fileSize: '4.2 MB Guide + Cloud Link',
    version: '2.4 (2026 Edition)',
    coverImage: 'notion_os',
    galleryImages: ['notion_os_1', 'notion_os_2', 'notion_os_3'],
    mainMediaType: 'both',
    catalogMediaMode: 'hover_preview',
    mediaGallery: [
      {
        id: 'med-01-1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        altText: 'Creative Director OS Notion Workspace Video Demo',
        caption: 'Watch the full walkthrough of the automated client relations and editorial pipeline.',
        displayOrder: 0,
        isPrimary: true,
        isVisible: true,
        duration: '0:45',
        videoProvider: 'direct',
      },
      {
        id: 'med-01-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        altText: 'Workspace Multi-Device Dashboard',
        caption: 'Seamless sync across iPad, desktop monitor, and mobile devices.',
        displayOrder: 1,
        isPrimary: false,
        isVisible: true,
      },
      {
        id: 'med-01-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        altText: 'Editorial Pipeline View',
        caption: 'Kanban content staging for multi-channel digital publishing.',
        displayOrder: 2,
        isPrimary: false,
        isVisible: true,
      },
    ],
    licenseType: 'Standard Commercial & Personal Use',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isFreeLeadMagnet: false,
    hasDedicatedLandingPage: true,
    downloadLimit: 15,
    accessExpiryDays: 365,
    rating: 4.95,
    reviewsCount: 148,
    customCtaLabel: 'Download Operating System ($39)',
    includedFiles: [
      { name: 'Creative_Director_OS_Master.pdf', format: 'PDF', size: '3.8 MB', version: '2.4', downloadUrl: '/api/downloads/token-sample-1' },
      { name: 'Notion_Template_Access_Instructions.txt', format: 'TXT', size: '12 KB', version: '2.4', downloadUrl: '/api/downloads/token-sample-2' },
      { name: 'Video_Walkthrough_Access_Card.pdf', format: 'PDF', size: '1.1 MB', version: '2.4', downloadUrl: '/api/downloads/token-sample-3' },
    ],
    bonuses: [
      { title: 'Client Contract & SOW Templates', value: 45, description: 'Plain-English legal contracts vetted for freelance digital product designers.' },
      { title: 'Video Implementation Masterclass (42 mins)', value: 35, description: 'Step-by-step setup walkthrough showing custom database views.' },
      { title: 'Lifetime Template Updates', value: 29, description: 'Free automatic access to all quarterly template enhancements.' },
    ],
    faqs: [
      { question: 'Do I need a paid Notion subscription?', answer: 'No. The system works completely on the 100% free personal tier of Notion without limitations.' },
      { question: 'Can I customize the databases and colors?', answer: 'Absolutely. Every property, icon, banner, and formula is fully unlocked for personal adaptation.' },
      { question: 'How is the template delivered?', answer: 'Immediately upon checkout, you will receive instant access to duplicate the workspace into your Notion account, plus a comprehensive PDF setup guide.' },
    ],
    reviews: [
      { id: 'rev-1', authorName: 'Elena Rostova', authorRole: 'Design Director, Studio Forma', rating: 5, title: 'Replaced 4 different paid subscription tools', comment: 'I previously juggled Asana, Google Sheets, and Dropbox Paper. This workspace unified everything into one calm, beautifully structured place. Worth ten times the price.', date: 'April 12, 2026', isVerifiedBuyer: true },
      { id: 'rev-2', authorName: 'Marcus Vance', authorRole: 'Independent Brand Strategist', rating: 5, title: 'Flawless layout and typography', comment: 'The database relationships are thoughtfully architected. Client onboarding time dropped from 3 hours to 15 minutes.', date: 'March 28, 2026', isVerifiedBuyer: true },
    ],
    relatedProductIds: ['prod-02', 'prod-03'],
    landingPageConfig: {
      headline: 'The Calm, Uncluttered Workspace Built for High-Output Creators',
      subheadline: 'Organize your entire creative practice, editorial pipelines, client contracts, and monthly revenue in one unified Notion system.',
      heroBadge: 'Used by 2,400+ Independent Designers & Publishers',
      ctaText: 'Claim Instant Access for $39 (Regularly $69)',
      guaranteeText: '30-Day Happiness Guarantee: If this does not save you at least 5 hours per week, we will issue an immediate full refund.',
      whoIsThisFor: [
        'Creative freelancers and boutique agencies juggling multiple concurrent projects',
        'Digital content publishers managing multi-channel editorial calendars',
        'Solo founders who want an aesthetic, unified command center without bloated SaaS fees',
      ],
      whoIsThisNotFor: [
        'Enterprises needing strict SAML SSO compliance across 500+ corporate seats',
        'Users looking for generic task lists without project relational depth',
      ],
      featureHighlights: [
        { icon: 'FolderKanban', title: 'Relational Project Pipeline', description: 'Track client engagements from lead qualification to final invoice delivery.' },
        { icon: 'CalendarDays', title: 'Multi-Channel Editorial Calendar', description: 'Plan Pinterest pins, blog articles, and newsletter launches in synchronized views.' },
        { icon: 'Coins', title: 'Revenue & Retainer Dashboard', description: 'Monitor invoice statuses, cash-flow projections, and passive product royalties.' },
      ],
      comparisonTable: [
        { feature: 'Setup Time', ourProduct: 'Under 10 minutes (1-click duplicate)', buildingFromScratch: '40–60 hours of database building', expensiveAgency: 'Weeks of custom onboarding' },
        { feature: 'Cost', ourProduct: '$39 one-time payment', buildingFromScratch: '$0 but weeks of lost billable hours', expensiveAgency: '$1,500–$3,500 consulting fees' },
        { feature: 'Software Subscriptions', ourProduct: 'Runs on 100% Free Notion tier', buildingFromScratch: 'Varies', expensiveAgency: '$50+/month per user tool stack' },
        { feature: 'Updates & Revisions', ourProduct: 'Free lifetime updates included', buildingFromScratch: 'Manual maintenance', expensiveAgency: 'Expensive hourly support contracts' },
      ],
      sections: [
        { id: 'sec-hero', type: 'hero', isEnabled: true },
        { id: 'sec-prob', type: 'problem_solution', isEnabled: true },
        { id: 'sec-walk', type: 'walkthrough', isEnabled: true },
        { id: 'sec-files', type: 'included_files', isEnabled: true },
        { id: 'sec-bonuses', type: 'bonuses', isEnabled: true },
        { id: 'sec-comp', type: 'comparison', isEnabled: true },
        { id: 'sec-test', type: 'testimonials', isEnabled: true },
        { id: 'sec-faq', type: 'faq', isEnabled: true },
        { id: 'sec-cta', type: 'final_cta', isEnabled: true },
      ],
    },
  },
  {
    id: 'prod-02',
    name: 'The Pinterest Organic Traffic Blueprint & 120+ Pin Templates',
    slug: 'pinterest-traffic-blueprint-pin-templates',
    sku: 'VC-PIN-002',
    shortDescription: 'Conversion-engineered 2:3 vertical Pin templates for Canva plus a step-by-step keyword ranking strategy guide.',
    longDescription: 'Pinterest drives more high-intent organic buyer traffic than almost any other visual search engine. This comprehensive kit delivers 120+ high-CTR Canva Pin templates (2:3 aspect ratio, 1000x1500px) specifically designed for digital product creators, editorial bloggers, and lifestyle brands. Includes the complete Pinterest SEO Playbook on keyword extraction, board SEO, and fresh pin cadence.',
    price: 29,
    comparePrice: 49,
    category: 'Canva Templates',
    tags: ['Best Seller', 'Pinterest', 'Canva'],
    productType: 'canva_template',
    fileFormat: 'Canva Template Links + PDF Ebook',
    fileSize: '18.4 MB Kit',
    version: '3.1',
    coverImage: 'pinterest_kit',
    galleryImages: ['pinterest_kit_1', 'pinterest_kit_2'],
    mainMediaType: 'image',
    catalogMediaMode: 'hover_preview',
    mediaGallery: [
      {
        id: 'med-02-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        altText: 'Pinterest Traffic Blueprint Pin Kit',
        caption: '120+ High-converting vertical Pin layouts ready to duplicate in Canva.',
        displayOrder: 0,
        isPrimary: true,
        isVisible: true,
      },
      {
        id: 'med-02-2',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
        altText: 'Pinterest Keyword Extraction Video Masterclass',
        caption: 'Step-by-step video breakdown of Pinterest SEO search volume analysis.',
        displayOrder: 1,
        isPrimary: false,
        isVisible: true,
        duration: '1:12',
        videoProvider: 'direct',
      },
      {
        id: 'med-02-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        altText: 'Analytics and Traffic Growth Graphs',
        caption: 'Real verified traffic scaling from 5k to 120k monthly organic visitors.',
        displayOrder: 2,
        isPrimary: false,
        isVisible: true,
      },
    ],
    licenseType: 'Commercial Use for Own Brand',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isFreeLeadMagnet: false,
    hasDedicatedLandingPage: true,
    downloadLimit: 10,
    accessExpiryDays: 365,
    rating: 4.92,
    reviewsCount: 215,
    customCtaLabel: 'Get Pin Kit & Blueprint ($29)',
    includedFiles: [
      { name: '120_Canva_Pin_Templates_Access.pdf', format: 'PDF', size: '2.4 MB', version: '3.1', downloadUrl: '/api/downloads/token-sample-4' },
      { name: 'Pinterest_SEO_Master_Playbook.pdf', format: 'PDF', size: '14.2 MB', version: '3.1', downloadUrl: '/api/downloads/token-sample-5' },
      { name: 'Viral_Pin_Headline_Swipe_File.xlsx', format: 'XLSX', size: '1.8 MB', version: '3.1', downloadUrl: '/api/downloads/token-sample-6' },
    ],
    bonuses: [
      { title: '50 High-Converting Pin Title Formula Cards', value: 25, description: 'Proven headline formulas tested across 250,000 monthly impressions.' },
      { title: 'Pinterest Board Optimization Checklist', value: 19, description: 'How to structure and keyword-tag your boards for search discoverability.' },
    ],
    faqs: [
      { question: 'Do I need Canva Pro?', answer: 'No, all templates are built using free fonts and elements compatible with Canva Free.' },
      { question: 'Can I use these for client accounts?', answer: 'Yes, our license permits creating graphics for your own brands as well as direct client work.' },
    ],
    reviews: [
      { id: 'rev-3', authorName: 'Sarah Jenkins', authorRole: 'Blogger & Printable Creator', rating: 5, title: 'My outbound clicks tripled in 45 days', comment: 'The typography and high-contrast editorial hierarchy on these pins stand out immediately in the Pinterest feed. Best investment for my shop this year.', date: 'May 04, 2026', isVerifiedBuyer: true },
    ],
    relatedProductIds: ['prod-01', 'prod-03'],
  },
  {
    id: 'prod-03',
    name: 'Digital Product Launch Playbook & Conversion Swipe Files',
    slug: 'digital-product-launch-playbook',
    sku: 'VC-PLAYBOOK-003',
    shortDescription: 'The battle-tested step-by-step guide to conceptualizing, validating, pricing, and launching digital downloads.',
    longDescription: 'Stop guessing how to price and position your digital downloads. This 110-page master guide takes you through the entire lifecycle: market validation without audience, high-converting product page anatomy, launch email sequences, and evergreen email funnels. Accompanied by real sales page copy templates and pricing matrix spreadsheets.',
    price: 47,
    comparePrice: 79,
    category: 'Ebooks & Guides',
    tags: ['Ebook', 'Marketing', 'New'],
    productType: 'pdf_guide',
    fileFormat: 'PDF Ebook + Figma Wireframes',
    fileSize: '32.6 MB ZIP',
    version: '1.2',
    coverImage: 'launch_playbook',
    galleryImages: ['launch_playbook_1'],
    licenseType: 'Personal & Commercial Use',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isFreeLeadMagnet: false,
    hasDedicatedLandingPage: true,
    downloadLimit: 10,
    accessExpiryDays: 365,
    rating: 4.88,
    reviewsCount: 89,
    customCtaLabel: 'Get Launch Playbook ($47)',
    includedFiles: [
      { name: 'Digital_Product_Launch_Playbook_v1.2.pdf', format: 'PDF', size: '28.1 MB', version: '1.2', downloadUrl: '/api/downloads/token-sample-7' },
      { name: 'Launch_Email_Sequence_Templates.docx', format: 'DOCX', size: '1.2 MB', version: '1.2', downloadUrl: '/api/downloads/token-sample-8' },
    ],
    bonuses: [
      { title: 'The 7-Day Pre-Launch Buzz Checklist', value: 30, description: 'Day-by-day roadmap to warm up your email list and Pinterest followers.' },
      { title: 'Objection-Crushing FAQ Builder', value: 20, description: 'Template to neutralize buyer hesitation directly on your checkout page.' },
    ],
    faqs: [
      { question: 'Is this applicable if I have zero followers?', answer: 'Yes! Phase 1 covers SEO-driven validation and audience-building through search and Pinterest before launching.' },
    ],
    reviews: [
      { id: 'rev-4', authorName: 'Devon Patel', authorRole: 'Template Creator', rating: 5, title: 'Straight to the point with zero filler', comment: 'Every section has practical templates I used directly on my sales page. Generated $2,400 in my first launch week.', date: 'April 22, 2026', isVerifiedBuyer: true },
    ],
    relatedProductIds: ['prod-01', 'prod-02'],
  },
  {
    id: 'prod-04',
    name: 'Client Onboarding & Project Management Portal',
    slug: 'client-onboarding-portal',
    sku: 'VC-NOTION-004',
    shortDescription: 'White-label Notion portal for client collaboration, deliverable approvals, and transparent status tracking.',
    longDescription: 'Impress your freelance and agency clients with a sleek, private portal that centralizes communication, file uploads, milestone approvals, and contract signatures in one distraction-free page. Eliminates endless email chains and missing files.',
    price: 34,
    comparePrice: 59,
    category: 'Planners & Systems',
    tags: ['Notion', 'Client Management'],
    productType: 'notion_template',
    fileFormat: 'Notion Template + Client Email Scripts',
    fileSize: '2.8 MB Guide',
    version: '1.5',
    coverImage: 'client_portal',
    galleryImages: ['client_portal_1'],
    licenseType: 'Commercial Use',
    isAvailable: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isFreeLeadMagnet: false,
    hasDedicatedLandingPage: true,
    downloadLimit: 10,
    accessExpiryDays: 365,
    rating: 4.89,
    reviewsCount: 74,
    includedFiles: [
      { name: 'Client_Portal_Template_Guide.pdf', format: 'PDF', size: '2.5 MB', version: '1.5', downloadUrl: '/api/downloads/token-sample-9' },
    ],
    bonuses: [
      { title: '12 Client Email Scripts', value: 20, description: 'Copy-paste emails for kickoff, milestone check-ins, and polite payment reminders.' },
    ],
    faqs: [
      { question: 'Can my clients view this without creating a Notion account?', answer: 'Yes, you can publish the client page to the web with read/comment permissions, or share privately.' },
    ],
    reviews: [],
  },
  {
    id: 'prod-05',
    name: 'Financial Freedom & Automated Wealth Dashboard',
    slug: 'financial-freedom-wealth-dashboard',
    sku: 'VC-SHEETS-005',
    shortDescription: 'Automated Google Sheets and Microsoft Excel dashboard for tracking net worth, cash flow, and digital product royalties.',
    longDescription: 'Gain crystal-clear visibility into your personal and business finances. Built with automated formulas, visual debt payoff calculators, monthly savings rate gauges, and passive revenue streams tracking. Compatible with both Google Sheets and Excel.',
    price: 24,
    comparePrice: 39,
    category: 'Business & Finance',
    tags: ['Spreadsheets', 'Finance'],
    productType: 'sheets',
    fileFormat: 'Google Sheets + Excel (.xlsx)',
    fileSize: '3.1 MB',
    version: '2.0',
    coverImage: 'wealth_dashboard',
    galleryImages: ['wealth_dashboard_1'],
    licenseType: 'Personal Use',
    isAvailable: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isFreeLeadMagnet: false,
    hasDedicatedLandingPage: true,
    downloadLimit: 10,
    accessExpiryDays: 365,
    rating: 4.96,
    reviewsCount: 162,
    includedFiles: [
      { name: 'Automated_Wealth_Dashboard_2026.xlsx', format: 'XLSX', size: '2.8 MB', version: '2.0', downloadUrl: '/api/downloads/token-sample-10' },
      { name: 'Google_Sheets_Setup_Instructions.pdf', format: 'PDF', size: '300 KB', version: '2.0', downloadUrl: '/api/downloads/token-sample-11' },
    ],
    bonuses: [
      { title: 'Tax Deduction Preparation Tracker', value: 25, description: 'Categorized business expense worksheet designed for digital entrepreneurs.' },
    ],
    faqs: [
      { question: 'Is my financial data stored privately?', answer: '100% yes. The spreadsheet resides completely within your own Google Drive or local Excel.' },
    ],
    reviews: [],
  },
  {
    id: 'prod-06',
    name: 'Minimalist Editorial Social Media Kit: 200+ Canva Templates',
    slug: 'minimalist-editorial-social-kit',
    sku: 'VC-CANVA-006',
    shortDescription: 'Cohesive Instagram carousels, Pinterest pins, and story layouts designed with timeless editorial typography.',
    longDescription: 'Establish an authoritative aesthetic on social media. 200+ modular Canva templates including quote cards, data charts, product carousels, and high-engagement saveable infographics. Designed in warm neutral tones with elegant serif headings.',
    price: 32,
    comparePrice: 55,
    category: 'Canva Templates',
    tags: ['Canva', 'Social Media'],
    productType: 'canva_template',
    fileFormat: 'Canva Template Links',
    fileSize: 'Instant Cloud Access',
    version: '1.8',
    coverImage: 'social_kit',
    galleryImages: ['social_kit_1'],
    licenseType: 'Commercial Use',
    isAvailable: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isFreeLeadMagnet: false,
    hasDedicatedLandingPage: true,
    downloadLimit: 10,
    accessExpiryDays: 365,
    rating: 4.87,
    reviewsCount: 53,
    includedFiles: [
      { name: 'Canva_Social_Kit_Links_Guide.pdf', format: 'PDF', size: '1.9 MB', version: '1.8', downloadUrl: '/api/downloads/token-sample-12' },
    ],
    bonuses: [
      { title: 'Curated Palette & Font Pairing Guide', value: 15, description: '10 timeless aesthetic pairings you can apply across your brand assets.' },
    ],
    faqs: [
      { question: 'Are photos included?', answer: 'The templates feature royalty-free placeholder photography and customizable frame holders.' },
    ],
    reviews: [],
  },
  {
    id: 'prod-07',
    name: 'Free 7-Day Digital Product Starter Blueprint',
    slug: 'free-digital-product-starter-blueprint',
    sku: 'VC-FREE-007',
    shortDescription: 'Free 24-page roadmap, validation checklist, and pricing worksheet for launching your first digital download.',
    longDescription: 'Our signature free lead magnet. Learn how to package your existing expertise into a sellable PDF, spreadsheet, or template in 7 days without needing a massive following.',
    price: 0,
    category: 'Free Downloads',
    tags: ['Free Lead Magnet', 'Beginner'],
    productType: 'pdf_guide',
    fileFormat: 'Instant PDF Download',
    fileSize: '4.8 MB PDF',
    version: '1.0',
    coverImage: 'starter_blueprint',
    galleryImages: ['starter_blueprint_1'],
    licenseType: 'Personal Use',
    isAvailable: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isFreeLeadMagnet: true,
    hasDedicatedLandingPage: true,
    downloadLimit: 20,
    accessExpiryDays: 365,
    rating: 4.98,
    reviewsCount: 420,
    customCtaLabel: 'Download Free Blueprint',
    includedFiles: [
      { name: 'Free_7Day_Digital_Product_Blueprint.pdf', format: 'PDF', size: '4.8 MB', version: '1.0', downloadUrl: '/api/downloads/token-free-lead-magnet' },
    ],
    bonuses: [],
    faqs: [],
    reviews: [],
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-01',
    title: 'The Pinterest Organic Traffic Blueprint: How We Drove 240,000 Monthly Pageviews to Digital Products',
    slug: 'pinterest-organic-traffic-blueprint-digital-products',
    excerpt: 'A comprehensive, data-driven breakdown of how to build an evergreen Pinterest traffic engine that converts cold searchers into loyal digital product buyers.',
    featuredImage: 'article_pinterest',
    category: 'Traffic & Growth',
    tags: ['Pinterest', 'SEO', 'Traffic Strategy'],
    templateType: 'how_to_guide',
    status: 'published',
    estimatedReadTime: 9,
    affiliateDisclosureRequired: true,
    promotedProductId: 'prod-02',
    seoTitle: 'Pinterest Organic Traffic Blueprint for Digital Products (Case Study)',
    seoDescription: 'Learn how to generate over 200,000 monthly pageviews using 2:3 vertical Pin templates, visual search SEO, and fresh pin consistency.',
    publishedAt: 'October 14, 2026',
    updatedAt: 'October 16, 2026',
    viewsCount: 14820,
    author: {
      id: 'auth-01',
      name: 'Clara Beaumont',
      slug: 'clara-beaumont',
      roleTitle: 'Head of Growth & Visual SEO',
      bio: 'Clara specializes in visual search engines, editorial content syndication, and organic e-commerce monetization.',
      avatarUrl: 'author_clara',
    },
    content: `
## Why Pinterest Is Not Social Media (And Why That Changes Everything)

Most digital product creators treat Pinterest like Instagram: they post sporadically, obsess over followers, and wonder why their links get virtually zero clicks.

Here is the fundamental reality: **Pinterest is a visual search engine, not a social feed.**

Unlike chronological timelines where posts vanish within 24 hours, a high-ranking Pinterest Pin has an average lifespan of **3.8 to 6 months**. Pins published eighteen months ago continue to generate daily email signups and digital download sales for our store.

When a user opens Pinterest, they are in an *active solution-seeking mindset*. They are searching:
- *"creative director client onboarding checklist"*
- *"how to price digital downloads"*
- *"notion aesthetic daily planner template"*

They are not passively scrolling while killing time; they are hunting for tangible resources to organize their lives or businesses. If your Pin delivers a clear visual answer and links to a friction-free landing page, conversion rates routinely surpass standard social traffic by 300%.

---

## 1. The Anatomy of a High-CTR Pin (2:3 Aspect Ratio)

Every high-performing pin in our catalog adheres to four non-negotiable structural rules:

### A. The 2:3 Strict Aspect Ratio Rule
Pinterest's algorithm penalizes horizontal images and squished squares. The platform standard is **1000 × 1500 pixels** (or a 2:3 ratio). Longer pins (e.g. 1:2.1) are frequently truncated in the mobile grid, hiding your primary call to action.

### B. High-Contrast Editorial Typography
Avoid delicate script fonts for your primary headline. In mobile feeds, users scan past cursive text because it requires cognitive effort to decipher. Use bold, characterful editorial serif or sans-serif typography with high contrast against the background surface.

### C. The Clear Visual Asset Teaser
Show a realistic preview of what the user receives upon clicking. Whether it is an angled mockup of a Notion workspace, a multi-page PDF checklist preview, or a Canva carousel mockup, tangible product proof anchors click-through desire.

### D. The Actionable Call to Action (CTA) Pill
Tell the viewer what to do: *"Read the 7-Step Guide"*, *"Get the Free Download"*, or *"Download the Workspace"*.

---

## 2. Pinterest Keyword Extraction & Board Architecture

Before designing a single Pin, conduct native keyword research directly in the Pinterest search bar.

1. **The Keyword Guiding Strip**: Type your core seed keyword (e.g., *"digital products"*) into the search field. Note the colored predictive keyword tiles beneath the search bar: *ideas to sell, marketing, aesthetics, packaging, pricing, notions*.
2. **Title Optimization**: Place your primary keyword within the first 30 characters of your Pin title (e.g. *"Digital Product Launch Checklist | 7 Steps to $10k"*).
3. **Keyword-Rich Natural Descriptions**: Write 2 to 3 sentences weaving in 3–4 long-tail keyword variations. Never dump comma-separated keyword lists; Pinterest's semantic algorithm penalizes keyword stuffing.

---

## 3. Recommended Resource for Creators

If you want to bypass the 40+ hours required to design custom Pin graphics from scratch, we packaged our top-converting layouts:

> **Recommended Tool**: Check out [The Pinterest Organic Traffic Blueprint & 120+ Canva Pin Templates](/product/pinterest-traffic-blueprint-pin-templates). It includes ready-to-customize Canva templates (2:3 ratio), our viral headline swipe file, and board SEO checklists.

---

## 4. Fresh Pin Cadence & Scheduling Best Practices

Pinterest explicitly favors **fresh pins**—meaning a new image URL or new design variation, even if it points to an existing high-value URL.

Our weekly publishing rhythm:
- 1 cornerstone article or product landing page
- 4 to 6 unique Pin design variants pointing to that same URL
- Pins scheduled across relevant boards with a 48-hour gap between each variant
- Zero spamming of identical images to multiple boards simultaneously

By maintaining this disciplined cadence, your traffic compounds steadily week over week without requiring ongoing paid ad budgets.
    `,
    comments: [
      { id: 'com-1', authorName: 'Julian Croft', comment: 'The distinction between a social network and a search engine is so spot-on. Applying the 2:3 ratio tip right now!', createdAt: 'Yesterday at 3:15 PM', isApproved: true },
      { id: 'com-2', authorName: 'Maya Lin', comment: 'Do you recommend personal or business Pinterest accounts for digital stores?', createdAt: '2 days ago', isApproved: true },
    ],
  },
  {
    id: 'post-02',
    title: '12 High-Yield Digital Products You Can Build Once and Sell for Years',
    slug: '12-high-yield-digital-products-to-sell',
    excerpt: 'From Notion operating systems and spreadsheet models to Canva brand kits, here is an objective ranking of the most profitable digital assets.',
    featuredImage: 'article_digital_products',
    category: 'Product Creation',
    tags: ['Digital Downloads', 'Monetization', 'E-commerce'],
    templateType: 'listicle',
    status: 'published',
    estimatedReadTime: 11,
    affiliateDisclosureRequired: true,
    promotedProductId: 'prod-01',
    seoTitle: '12 Most Profitable Digital Products to Sell Online in 2026',
    seoDescription: 'Discover the top high-margin digital products to create and sell, including templates, spreadsheets, workbooks, and guides.',
    publishedAt: 'October 11, 2026',
    updatedAt: 'October 15, 2026',
    viewsCount: 22400,
    author: {
      id: 'auth-02',
      name: 'Julian Vance',
      slug: 'julian-vance',
      roleTitle: 'Editor-in-Chief & Product Strategist',
      bio: 'Julian writes on creator business models, pricing psychology, and high-margin product packaging.',
      avatarUrl: 'author_julian',
    },
    content: `
## The Economics of Zero Marginal Cost Products

Physical products carry inventory risks, shipping bottlenecks, supply chain fluctuations, and customer returns.

Digital products, by contrast, possess the most attractive economic characteristic in commerce: **near-zero marginal cost of reproduction**. Once you create a pristine Notion workspace, Excel financial model, or Canva template kit, selling 1 copy or 10,000 copies costs virtually the same.

Here are the 12 most resilient and high-yield digital product formats you can develop this year.

---

## 1. Notion Business & Creator Operating Systems
- **Average Price Point**: $29 – $99
- **Skill Requirement**: Intermediate Notion database relations
- **Why It Sells**: Buyers are overwhelmed by disjointed apps. A pre-built Notion dashboard provides immediate order and peace of mind.

## 2. Automated Financial & Net Worth Spreadsheets
- **Average Price Point**: $19 – $49
- **Skill Requirement**: Google Sheets / Excel formulas
- **Why It Sells**: Numbers create anxiety. A clean spreadsheet with automated charts and debt payoff projections turns chaos into an actionable roadmap.

## 3. Specialized Canva Social & Pin Kits
- **Average Price Point**: $25 – $59
- **Skill Requirement**: Visual layout and typography
- **Why It Sells**: Content creators need to post daily but lack the time to design every graphic from a blank canvas.

## 4. In-Depth Operational Playbooks & Ebooks
- **Average Price Point**: $37 – $97
- **Skill Requirement**: Subject matter depth and editorial clarity
- **Why It Sells**: Curated, tested frameworks save buyers hundreds of hours of trial and error compared to fragmented free YouTube videos.

---

## 5. Client Onboarding & Proposal Portals
- **Average Price Point**: $29 – $69
- **Skill Requirement**: Client service experience
- **Why It Sells**: Freelancers want to appear premium and organized to justify higher client retainer fees.

---

## Conclusion & Next Steps

Pick one format that directly aligns with problems you have already solved for yourself. Package it with clear documentation and a generous license, and pair it with a conversion-optimized sales page.
    `,
    comments: [
      { id: 'com-3', authorName: 'Rachel K.', comment: 'Notion templates have completely transformed my freelance income. Great breakdown of pricing points.', createdAt: '3 days ago', isApproved: true },
    ],
  },
  {
    id: 'post-03',
    title: 'Pricing Psychology for Digital Downloads: Why $39 Outconverts $19',
    slug: 'pricing-psychology-for-digital-downloads',
    excerpt: 'How underpricing your digital assets triggers buyer skepticism, and the exact pricing tiers that maximize gross revenue and customer retention.',
    featuredImage: 'article_pricing',
    category: 'Monetization',
    tags: ['Pricing', 'Psychology', 'Conversion Rate'],
    templateType: 'case_study',
    status: 'published',
    estimatedReadTime: 7,
    affiliateDisclosureRequired: false,
    promotedProductId: 'prod-03',
    seoTitle: 'Pricing Psychology for Digital Products: The $39 vs $19 Paradox',
    seoDescription: 'Why low prices hurt perceived value and how to set high-converting prices for ebooks, templates, and digital downloads.',
    publishedAt: 'October 08, 2026',
    updatedAt: 'October 12, 2026',
    viewsCount: 9340,
    author: {
      id: 'auth-02',
      name: 'Julian Vance',
      slug: 'julian-vance',
      roleTitle: 'Editor-in-Chief & Product Strategist',
      bio: 'Julian writes on creator business models, pricing psychology, and high-margin product packaging.',
      avatarUrl: 'author_julian',
    },
    content: `
## The Perceived Value Trap

When first-time creators launch a digital product, their instinct is almost always to underprice: *"I will sell it for $9 so anyone can afford it!"*

Counterintuitively, ultra-low pricing often **depresses** sales volume instead of boosting it.

In the digital goods economy, price is one of the strongest heuristic proxies for quality. When a buyer sees a comprehensive "Business Operating System" priced at $7, their immediate subconscious conclusion is:
> *"This is probably a flimsy toy made in 15 minutes that will waste my afternoon."*

When that same product is priced at **$39 or $49**, backed by a comparison table, video walkthrough, and verified customer testimonials, the subconscious calculation shifts:
> *"This is a serious professional tool. For $39, saving even 2 hours of my time makes this an immediate no-brainer ROI."*

---

## The Three Golden Price Anchors for Digital Products

1. **Impulse Tier ($19 – $29)**: Ideal for standalone checklists, single-purpose spreadsheets, and entry-level Canva packs. Low friction, requires minimal deliberation.
2. **Value Investment Tier ($39 – $59)**: The sweet spot for comprehensive workspaces, multi-tool bundles, and operational playbooks. High perceived commitment with minimal buyer remorse.
3. **Mastery / System Tier ($79 – $149)**: Suitable for complete multi-file toolkits with video walkthroughs, bonus contracts, and lifetime updates.
    `,
    comments: [],
  },
];

export const INITIAL_GATEWAYS: PaymentGateway[] = [
  {
    providerId: 'stripe',
    displayName: 'Stripe Payments',
    logoText: 'Stripe (Cards, Apple Pay, Google Pay)',
    isEnabled: true,
    isTestMode: true,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    displayOrder: 1,
    apiKeyPublic: 'pk_test_sample_stripe_key_510293847',
    instructions: 'Accepts Credit/Debit Cards, Apple Pay, and Google Pay with instant automatic digital product delivery.',
  },
  {
    providerId: 'razorpay',
    displayName: 'Razorpay',
    logoText: 'Razorpay (Cards, UPI, NetBanking)',
    isEnabled: true,
    isTestMode: true,
    supportedCurrencies: ['INR', 'USD', 'EUR'],
    displayOrder: 2,
    apiKeyPublic: 'rzp_test_public_key_849302',
    instructions: 'Seamless UPI QR code, Google Pay, PhonePe, and domestic/international card processing.',
  },
  {
    providerId: 'cashfree',
    displayName: 'Cashfree Payments',
    logoText: 'Cashfree (UPI, Cards, Wallets)',
    isEnabled: false,
    isTestMode: true,
    supportedCurrencies: ['INR'],
    displayOrder: 3,
    apiKeyPublic: 'cf_test_app_id_99201',
    instructions: 'High-speed instant UPI and auto-reconciliation gateway for Indian digital sales.',
  },
  {
    providerId: 'phonepe',
    displayName: 'PhonePe Payment Gateway',
    logoText: 'PhonePe (UPI, QR, Cards)',
    isEnabled: false,
    isTestMode: true,
    supportedCurrencies: ['INR'],
    displayOrder: 4,
    apiKeyPublic: 'PGTESTPAYUAT_MID',
    instructions: 'Direct PhonePe app intent and scan-and-pay UPI QR gateway.',
  },
  {
    providerId: 'paypal',
    displayName: 'PayPal Express',
    logoText: 'PayPal (Balance & Credit)',
    isEnabled: true,
    isTestMode: true,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD'],
    displayOrder: 5,
    apiKeyPublic: 'paypal_client_sandbox_id_3302',
    instructions: 'Worldwide trusted 1-click checkout for international buyers with buyer protection.',
  },
  {
    providerId: 'payu',
    displayName: 'PayU India',
    logoText: 'PayU (Cards, NetBanking, UPI)',
    isEnabled: false,
    isTestMode: true,
    supportedCurrencies: ['INR', 'USD'],
    displayOrder: 6,
    apiKeyPublic: 'payu_merchant_key_993',
    instructions: 'Enterprise payment stack supporting multi-currency digital checkout.',
  },
  {
    providerId: 'ccavenue',
    displayName: 'CCAvenue',
    logoText: 'CCAvenue Gateway',
    isEnabled: false,
    isTestMode: true,
    supportedCurrencies: ['INR', 'USD', 'EUR', 'AED'],
    displayOrder: 7,
    apiKeyPublic: 'cca_merchant_9302',
    instructions: 'Traditional multi-bank and international payment aggregator.',
  },
  {
    providerId: 'authorizenet',
    displayName: 'Authorize.Net',
    logoText: 'Authorize.Net Merchant',
    isEnabled: false,
    isTestMode: true,
    supportedCurrencies: ['USD', 'CAD', 'GBP', 'EUR'],
    displayOrder: 8,
    apiKeyPublic: 'authnet_client_key_0293',
    instructions: 'Direct merchant credit card gateway for US and European business entities.',
  },
  {
    providerId: 'mollie',
    displayName: 'Mollie Payments',
    logoText: 'Mollie (iDEAL, Bancontact, SEPA, Cards)',
    isEnabled: false,
    isTestMode: true,
    supportedCurrencies: ['EUR', 'USD', 'GBP'],
    displayOrder: 9,
    apiKeyPublic: 'mollie_test_key_849302',
    instructions: 'Leading European localized payment provider supporting iDEAL, Sofort, and Bancontact.',
  },
  {
    providerId: 'manual_transfer',
    displayName: 'Direct Bank Wire / UPI Transfer (Manual Verification)',
    logoText: 'Manual Bank Transfer & UPI',
    isEnabled: true,
    isTestMode: false,
    supportedCurrencies: ['USD', 'INR', 'EUR'],
    displayOrder: 10,
    instructions: 'Transfer funds directly to our corporate bank account or UPI ID. Enter your transaction UTR / Reference ID at checkout. Digital files are unlocked as soon as an administrator verifies your receipt.',
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 20,
    timesUsed: 42,
    usageLimit: 500,
    isActive: true,
  },
  {
    code: 'CREATOR50',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 35,
    timesUsed: 18,
    usageLimit: 100,
    isActive: true,
  },
  {
    code: 'SAVE10',
    discountType: 'fixed',
    discountValue: 10,
    minOrderAmount: 30,
    timesUsed: 89,
    usageLimit: 1000,
    isActive: true,
  },
];

export const INITIAL_PINS: PinDesign[] = [
  {
    id: 'pin-01',
    title: 'How to Drive 240k Monthly Visitors to Your Digital Products Store',
    description: 'Learn the exact 2:3 Pin layout, Pinterest keyword placement, and fresh pin cadence to turn Pinterest into your top sales channel. Click through to read the full guide!',
    destinationUrl: '/blog/pinterest-organic-traffic-blueprint-digital-products',
    boardName: 'Digital Product Marketing & Growth',
    templateName: 'editorial_tip',
    headlineOverlay: 'How We Drove 240,000 Monthly Pageviews from Pinterest',
    subtitleOverlay: 'The Organic Traffic Blueprint for Digital Downloads & Notion Workspaces',
    ctaOverlay: 'Read the Blueprint →',
    brandTagline: 'VeritasCraft.com',
    colorPreset: 'royal_blue',
    aspectRatio: '2:3 (1000 × 1500 px)',
    sizePreset: 'standard',
    canvasWidth: 1000,
    canvasHeight: 1500,
    backgroundConfig: {
      type: 'gradient',
      color: '#1E3A8A',
      gradient: { from: '#1E3A8A', to: '#0F172A', direction: 'to-br' },
      imageFit: 'cover',
      position: { x: 50, y: 50 },
      zoom: 1.0,
      brightness: 100,
      contrast: 100,
      blur: 0,
      opacity: 100,
      overlayColor: '#000000',
      overlayOpacity: 30,
      videoFit: 'cover',
      videoMuted: true,
      videoTrimStart: 0,
      videoTrimEnd: 15,
    },
    utmSource: 'pinterest',
    utmMedium: 'organic',
    utmCampaign: 'traffic_blueprint_pin01',
    status: 'published',
    pinClicksCount: 1842,
    savesCount: 624,
    createdAt: '2026-10-12',
  },
  {
    id: 'pin-02',
    title: 'The Creative Director Operating System: Clean Notion Workspace',
    description: 'Organize your entire studio in one aesthetic, relational Notion workspace. Replaces 4 disjointed tools. Download instant access today.',
    destinationUrl: '/product/creative-director-operating-system',
    boardName: 'Notion Templates & Aesthetic Workspaces',
    templateName: 'product_showcase',
    headlineOverlay: 'The Creative Director Operating System (2026 Edition)',
    subtitleOverlay: '14 Relational Dashboards · Client Portals · Financial Tracker',
    ctaOverlay: 'Instant Download · $39',
    brandTagline: 'VeritasCraft.com',
    colorPreset: 'classic_ivory',
    aspectRatio: '2:3 (1000 × 1500 px)',
    sizePreset: 'standard',
    canvasWidth: 1000,
    canvasHeight: 1500,
    backgroundConfig: {
      type: 'gradient',
      color: '#FAF8F4',
      gradient: { from: '#FAF8F4', to: '#E8E1D5', direction: 'to-br' },
      imageFit: 'cover',
      position: { x: 50, y: 50 },
      zoom: 1.0,
      brightness: 100,
      contrast: 100,
      blur: 0,
      opacity: 100,
      overlayColor: '#000000',
      overlayOpacity: 10,
      videoFit: 'cover',
      videoMuted: true,
      videoTrimStart: 0,
      videoTrimEnd: 15,
    },
    utmSource: 'pinterest',
    utmMedium: 'organic',
    utmCampaign: 'notion_os_pin02',
    status: 'published',
    pinClicksCount: 2310,
    savesCount: 890,
    createdAt: '2026-10-10',
  },
  {
    id: 'pin-03',
    title: '12 High-Yield Digital Downloads That Sell While You Sleep',
    description: 'The definitive breakdown of zero-marginal-cost products including spreadsheets, Notion templates, and Canva kits. Check out the ranking.',
    destinationUrl: '/blog/12-high-yield-digital-products-to-sell',
    boardName: 'Passive Income & Digital Products',
    templateName: 'checklist',
    headlineOverlay: '12 High-Yield Digital Products to Sell in 2026',
    subtitleOverlay: 'Build Once, Sell Forever: Margin Breakdown & Revenue Models',
    ctaOverlay: 'View the Ranked List →',
    brandTagline: 'VeritasCraft.com',
    colorPreset: 'muted_teal',
    aspectRatio: '2:3 (1000 × 1500 px)',
    sizePreset: 'standard',
    canvasWidth: 1000,
    canvasHeight: 1500,
    backgroundConfig: {
      type: 'gradient',
      color: '#134E4A',
      gradient: { from: '#134E4A', to: '#021817', direction: 'to-br' },
      imageFit: 'cover',
      position: { x: 50, y: 50 },
      zoom: 1.0,
      brightness: 100,
      contrast: 100,
      blur: 0,
      opacity: 100,
      overlayColor: '#000000',
      overlayOpacity: 25,
      videoFit: 'cover',
      videoMuted: true,
      videoTrimStart: 0,
      videoTrimEnd: 15,
    },
    utmSource: 'pinterest',
    utmMedium: 'organic',
    utmCampaign: 'top12_products_pin03',
    status: 'published',
    pinClicksCount: 1205,
    savesCount: 430,
    createdAt: '2026-10-08',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'VC-2026-1001',
    customerEmail: 'sarah.miller@creative.co',
    customerName: 'Sarah Miller',
    subtotal: 68,
    discountAmount: 13.6,
    couponCode: 'WELCOME20',
    taxAmount: 0,
    totalAmount: 54.4,
    currency: 'USD',
    paymentStatus: 'paid',
    paymentGatewayId: 'stripe',
    gatewayTransactionId: 'pi_3Mtw289dk02910a',
    createdAt: '2026-10-16T14:32:00Z',
    items: [
      {
        productId: 'prod-01',
        productName: 'The 2026 Creative Director Operating System',
        unitPrice: 39,
        quantity: 1,
        isAddon: false,
        fileFormat: 'Notion Workspace + PDF',
        fileSize: '4.2 MB',
        downloadToken: 'tok-ord-1001-item-1',
        version: '2.4',
      },
      {
        productId: 'prod-02',
        productName: 'The Pinterest Organic Traffic Blueprint & 120+ Pin Templates',
        unitPrice: 29,
        quantity: 1,
        isAddon: false,
        fileFormat: 'Canva + PDF Ebook',
        fileSize: '18.4 MB',
        downloadToken: 'tok-ord-1001-item-2',
        version: '3.1',
      },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'VC-2026-1002',
    customerEmail: 'robert.chen@designlab.io',
    customerName: 'Robert Chen',
    subtotal: 47,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 47,
    currency: 'USD',
    paymentStatus: 'paid',
    paymentGatewayId: 'paypal',
    gatewayTransactionId: 'PAYPAL-TXN-84920',
    createdAt: '2026-10-17T09:15:00Z',
    items: [
      {
        productId: 'prod-03',
        productName: 'Digital Product Launch Playbook & Conversion Swipe Files',
        unitPrice: 47,
        quantity: 1,
        isAddon: false,
        fileFormat: 'PDF Ebook + Figma',
        fileSize: '32.6 MB',
        downloadToken: 'tok-ord-1002-item-1',
        version: '1.2',
      },
    ],
  },
  {
    id: 'ord-1003',
    orderNumber: 'VC-2026-1003',
    customerEmail: 'amita.sharma@gmail.com',
    customerName: 'Amita Sharma',
    subtotal: 39,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 39,
    currency: 'USD',
    paymentStatus: 'manual_verification',
    paymentGatewayId: 'manual_transfer',
    manualPaymentRef: 'UPI-REF-93028104829',
    createdAt: '2026-10-18T02:40:00Z',
    items: [
      {
        productId: 'prod-01',
        productName: 'The 2026 Creative Director Operating System',
        unitPrice: 39,
        quantity: 1,
        isAddon: false,
        fileFormat: 'Notion Workspace + PDF',
        fileSize: '4.2 MB',
        downloadToken: 'tok-ord-1003-item-1',
        version: '2.4',
      },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-18T02:45:00Z',
    actorEmail: 'admin@veritascraft.com',
    action: 'THEME_CUSTOMIZED',
    entityType: 'theme_settings',
    entityId: 'theme-01',
    details: 'Switched primary brand font to Fraunces Serif and activated Classic Editorial preset.',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-17T18:20:00Z',
    actorEmail: 'admin@veritascraft.com',
    action: 'PRODUCT_UPDATED',
    entityType: 'product',
    entityId: 'prod-01',
    details: 'Updated Creative Director OS to v2.4 with new Client Contract bonus files.',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-17T11:05:00Z',
    actorEmail: 'admin@veritascraft.com',
    action: 'PIN_CAMPAIGN_EXPORTED',
    entityType: 'pinterest_pins',
    entityId: 'pin-01',
    details: 'Generated and exported 1000x1500px high-resolution pin canvas asset.',
  },
];
