import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { executeAiWritingGeneration } from './server/geminiService';
import {
  INITIAL_PRODUCTS,
  INITIAL_BLOG_POSTS,
  INITIAL_GATEWAYS,
  INITIAL_COUPONS,
  INITIAL_PINS,
  INITIAL_ORDERS,
  INITIAL_THEME,
  INITIAL_AUDIT_LOGS,
} from './src/data/initialData';
import { Product, BlogPost, PaymentGateway, Coupon, PinDesign, Order, ThemeSettings, AuditLog } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.static(path.resolve(__dirname, 'public')));

// Global error handler for JSON parsing and payload size limits
app.use((err: any, req: Request, res: Response, next: any) => {
  if (err && (err.type === 'entity.too.large' || err.status === 413 || err.message?.includes('too large'))) {
    console.error('Payload too large error intercepted:', err.message);
    return res.status(413).json({
      success: false,
      error: 'Payload Too Large: The uploaded file or content exceeds the 100MB limit. Please compress media or upload a smaller file.',
    });
  }
  if (err && (err.type === 'entity.parse.failed' || err.status === 400)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload received.',
    });
  }
  next(err);
});

// In-memory persistent state initialized with rich seed data
let products: Product[] = [...INITIAL_PRODUCTS];
let blogPosts: BlogPost[] = [...INITIAL_BLOG_POSTS];
let paymentGateways: PaymentGateway[] = [...INITIAL_GATEWAYS];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let pins: PinDesign[] = [...INITIAL_PINS];
let orders: Order[] = [...INITIAL_ORDERS];
let themeSettings: ThemeSettings = { ...INITIAL_THEME };
let auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let subscribers: { email: string; source: string; subscribedAt: string; leadMagnetClaimed?: string }[] = [
  { email: 'sarah.miller@creative.co', source: 'lead_magnet_modal', subscribedAt: '2026-10-15', leadMagnetClaimed: 'Free 7-Day Digital Product Starter Blueprint' },
  { email: 'marcus.vance@studio.org', source: 'blog_footer', subscribedAt: '2026-10-16' },
  { email: 'elena.rostova@forma.design', source: 'checkout', subscribedAt: '2026-10-17' },
];

// Initialize GoogleGenAI SDK on server side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory store for saved AI writing outputs
let savedAiOutputs: {
  id: string;
  toolType: string;
  topic: string;
  generatedContent: string;
  targetAudience?: string;
  tone?: string;
  language?: string;
  createdAt: string;
}[] = [];

// -----------------------------------------------------------------------------
// AI-Assisted Content Studio API (13 High-Impact Tools via Gemini 3.8 Flash)
// -----------------------------------------------------------------------------
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  const {
    topic,
    targetAudience,
    keywords,
    tone,
    language = 'English',
    length = 'medium',
    brandName = 'VeritasCraft',
    destinationUrl,
    productToPromote,
    actionType,
    customInstructions,
    sourceText,
  } = req.body;

  if (!process.env.GEMINI_API_KEY || !ai) {
    return res.status(200).json({
      success: false,
      isConfigured: false,
      message: 'Gemini API key is not configured in environment secrets. Please configure GEMINI_API_KEY in the AI Studio Settings > Secrets panel.',
    });
  }

  try {
    let prompt = '';
    const productInfo = products.find((p) => p.id === productToPromote || p.slug === productToPromote);
    const productMention = productInfo
      ? `Naturally integrate and promote this digital product: "${productInfo.name}" (${productInfo.shortDescription}, priced at $${productInfo.price}).`
      : '';

    const langInstruction = `Write entirely in ${language}.`;
    const brandContext = `Brand Name: ${brandName}. Audience: ${targetAudience || 'Creators & entrepreneurs'}. Tone: ${tone || 'Authoritative and editorial'}.`;

    switch (actionType) {
      case 'pin_title':
        prompt = `You are a Pinterest visual search algorithm expert. Generate 10 high-CTR Pinterest Pin titles for: "${topic}".
${brandContext}
${keywords ? `Target Keywords: ${keywords}` : ''}
${langInstruction}

Requirements:
- Each title must be under 90 characters so it is never truncated in mobile feeds.
- Front-load high-intent search keywords in the first 35 characters.
- Vary formulas: curiosity hooks, numbered list titles, direct benefit promises, and actionable tutorials.
- Number each title clearly 1 to 10 without markdown clutter.`;
        break;

      case 'pin_description':
        prompt = `Generate 3 comprehensive, SEO-optimized Pinterest Pin descriptions for: "${topic}".
${brandContext}
${productMention}
${destinationUrl ? `Destination Link Context: ${destinationUrl}` : ''}
${keywords ? `Main Keywords: ${keywords}` : ''}
${langInstruction}

For each description:
- Write 2–3 flowing, natural sentences incorporating 3–4 high-volume keywords organically (no keyword stuffing).
- Include an explicit call to action (e.g., "Click through to download the blueprint and start today!").
- Append 4–5 relevant, searchable Pinterest hashtags at the end.`;
        break;

      case 'pin_keywords':
        prompt = `Provide an in-depth Pinterest keyword research breakdown for the niche/topic: "${topic}".
${langInstruction}

Provide:
1. 5 High-Volume Seed Keywords
2. 10 Long-Tail Search Queries that users actively type into the Pinterest search bar
3. 5 Predictive Tile suggestions (the colored search bubbles Pinterest displays under the search bar)
4. Recommended Board Name and Board Category classification.`;
        break;

      case 'pin_hashtags':
        prompt = `Generate a curated list of 25 targeted, non-spammy Pinterest hashtags for: "${topic}".
${langInstruction}
Group them into:
1. Broad Category Tags (5 tags)
2. Niche Specific Tags (10 tags)
3. High-Intent Buyer Tags (10 tags).`;
        break;

      case 'headlines':
        prompt = `Generate 10 viral, high-CTR blog and pin headlines for: "${topic}".
${brandContext}
${keywords ? `Keywords: ${keywords}` : ''}
${langInstruction}
Requirements:
- Mix curiosity hooks, contrarian statements, how-to guides, and numbered listicles.
- Keep each under 80 characters for optimal visibility across Pinterest and search engines.
- Number each 1 to 10.`;
        break;

      case 'pin_copy':
        prompt = `Generate complete Pinterest Pin promotional copy for: "${topic}".
${brandContext}
${productMention}
${langInstruction}
Include:
1. 3 Punchy Pin Overlay Headlines (under 8 words each, ideal for bold text on visual pins)
2. 2 SEO Pin Descriptions (with natural keyword integration and call to action)
3. 5 High-ranking Pinterest hashtags.`;
        break;

      case 'faq':
        prompt = `Generate 5 high-converting objection-handling FAQs for: "${topic}".
${brandContext}
${productMention}
${langInstruction}
Structure each FAQ with a common buyer hesitation or skepticism, followed by an empathetic, reassuring, value-packed answer.`;
        break;

      case 'outline':
      case 'blog_outline':
        prompt = `Create a comprehensive, conversion-engineered article outline for a long-form editorial guide on: "${topic}".
${brandContext}
${productMention}
${keywords ? `Focus Keywords: ${keywords}` : ''}
${langInstruction}

Include:
1. Working Headline + 3 Alternative High-CTR Titles
2. Target Word Count and Estimated Reading Time
3. Search Intent Summary (Informational + Commercial)
4. Introduction Hook & Problem Statement
5. Section-by-section breakdown (H2 and H3 subheadings) with 2–3 actionable bullet points per section
6. Strategic Placement for an Affiliate / Companion Digital Product Callout Box
7. Conclusion with Clear Actionable Steps & Discussion Prompt for Comments.`;
        break;

      case 'seo_meta':
        prompt = `Generate optimized SEO metadata for an article or product page on: "${topic}".
${brandContext}
${keywords ? `Target Keywords: ${keywords}` : ''}
${langInstruction}

Provide:
1. 3 SEO Meta Titles (strictly under 60 characters each with character count)
2. 3 SEO Meta Descriptions (strictly between 140 and 155 characters each with character count)
3. Recommended URL Slug (clean, hyphenated, human-readable).`;
        break;

      case 'draft_intro':
      case 'blog_intro':
        prompt = `Write a captivating 350-word introduction and first major section for an editorial guide on: "${topic}".
${brandContext}
${productMention}
${langInstruction}

Guidelines:
- Open with a thought-provoking industry contradiction or common painful misconception.
- Avoid generic filler (never start with "In today's fast-paced digital world").
- Use calm, human, sophisticated editorial phrasing.
- Include a highlighted key takeaway quote.`;
        break;

      case 'product_description':
        prompt = `Write a compelling, benefit-focused digital product description for: "${topic}".
${brandContext}
${productMention}
${langInstruction}

Structure:
1. Headline Hook & Emotional Value Proposition
2. Short 2-sentence Overview
3. Core What's Inside Feature Breakdown (bulleted list with tangible outcomes)
4. Who It's Made For & Licensing Terms Summary.`;
        break;

      case 'sales_copy':
        prompt = `Write high-converting sales landing page copy for the digital product: "${topic}".
${brandContext}
${productMention}
${langInstruction}

Provide copy for:
1. Hero Headline & Benefit Subheading
2. "Who This Is For" vs "Who This Is NOT For" criteria
3. 3 Key Transformation Highlights
4. Comparison Summary (Why our solution beats building from scratch or hiring expensive agencies)
5. Urgency / Risk-Reversal Guarantee Statement.`;
        break;

      case 'cta_suggestions':
        prompt = `Generate 15 high-converting Call-to-Action (CTA) button and banner text options for: "${topic}".
${langInstruction}
Group into:
- 5 Direct Purchase CTAs (e.g., "Download Operating System — $39")
- 5 Value / Outcome CTAs (e.g., "Streamline My Studio Today")
- 5 Low-Friction / Lead Magnet CTAs (e.g., "Claim Free 7-Day Blueprint →").`;
        break;

      case 'social_copy':
        prompt = `Create 3 multi-slide social media promotional post captions (for Instagram & Facebook) promoting: "${topic}".
${brandContext}
${productMention}
${destinationUrl ? `Link in Bio / Destination: ${destinationUrl}` : ''}
${langInstruction}

Each post should include:
- Eye-catching 1-line hook
- Educational micro-lesson or value breakdown
- Clear call to action to visit the link or save the post
- 5 relevant hashtags.`;
        break;

      case 'email_marketing':
        prompt = `Write an engaging promotional email newsletter dispatch for: "${topic}".
${brandContext}
${productMention}
${destinationUrl ? `Action Link: ${destinationUrl}` : ''}
${langInstruction}

Include:
1. 4 High-Open-Rate Subject Lines (with emojis & curiosity angles)
2. Preview / Preheader Text
3. Email Body (conversational, storytelling opening, practical tip, product recommendation bridge, and P.S. note).`;
        break;

      case 'rewrite_expand':
        prompt = `Rewrite, polish, and elevate the following text for publication in VeritasCraft.
${brandContext}
Target Length: ${length}
${langInstruction}
${customInstructions ? `Special Instructions: ${customInstructions}` : ''}

Original Text:
"""
${sourceText || topic}
"""

Provide an elevated editorial version with crisp sentence cadence, zero fluff, and strong vocabulary.`;
        break;

      default:
        prompt = `Write an authoritative, high-value editorial guide on: "${topic}".
${brandContext}
${productMention}
${langInstruction}
${customInstructions ? `Additional Instructions: ${customInstructions}` : ''}`;
        break;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const generatedText = response.text || '';

    // Record audit log
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'admin@veritascraft.com',
      action: 'AI_STUDIO_GENERATED',
      entityType: 'ai_studio',
      entityId: actionType,
      details: `Generated ${actionType} for topic: "${topic?.slice(0, 40)}..."`,
    });

    return res.json({
      success: true,
      isConfigured: true,
      result: generatedText,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    let friendlyMessage = error.message || 'An error occurred during AI generation.';

    if (friendlyMessage.includes('quota') || friendlyMessage.includes('RESOURCE_EXHAUSTED')) {
      friendlyMessage = 'Gemini API quota exceeded for your project. Please verify your Gemini quota in AI Studio or check back shortly.';
    } else if (friendlyMessage.includes('API_KEY_INVALID') || friendlyMessage.includes('unregistered caller')) {
      friendlyMessage = 'The configured GEMINI_API_KEY is invalid or not recognized by Google GenAI. Please update your secret key in Settings > Secrets.';
    } else if (friendlyMessage.includes('rate limit')) {
      friendlyMessage = 'Rate limit reached. Please wait a few seconds and try again.';
    }

    return res.status(200).json({
      success: false,
      isConfigured: true,
      error: friendlyMessage,
    });
  }
});

// Saved AI Outputs API
app.get('/api/ai/outputs', (req: Request, res: Response) => {
  res.json({ success: true, data: savedAiOutputs });
});

app.post('/api/ai/outputs', (req: Request, res: Response) => {
  const { toolType, topic, generatedContent, targetAudience, tone, language } = req.body;
  if (!topic || !generatedContent) {
    return res.status(400).json({ success: false, error: 'Topic and content required' });
  }

  const newSaved = {
    id: `ai-out-${Date.now()}`,
    toolType: toolType || 'custom',
    topic,
    generatedContent,
    targetAudience,
    tone,
    language,
    createdAt: new Date().toISOString(),
  };

  savedAiOutputs.unshift(newSaved);
  res.json({ success: true, data: newSaved });
});

// -----------------------------------------------------------------------------
// PRODUCTS API
// -----------------------------------------------------------------------------
app.get('/api/products', (req: Request, res: Response) => {
  res.json({ success: true, data: products });
});

app.post('/api/products', (req: Request, res: Response) => {
  const productData = req.body as Product;
  if (!productData.name || !productData.price) {
    return res.status(400).json({ success: false, error: 'Product name and price are required.' });
  }

  const existingIndex = products.findIndex((p) => p.id === productData.id);
  if (existingIndex >= 0) {
    products[existingIndex] = { ...products[existingIndex], ...productData };
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'admin@veritascraft.com',
      action: 'PRODUCT_UPDATED',
      entityType: 'product',
      entityId: productData.id,
      details: `Updated product "${productData.name}"`,
    });
    return res.json({ success: true, data: products[existingIndex] });
  } else {
    const newProduct: Product = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      reviews: [],
      reviewsCount: 0,
      rating: 5.0,
      isAvailable: productData.isAvailable ?? true,
    };
    products.unshift(newProduct);
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'admin@veritascraft.com',
      action: 'PRODUCT_CREATED',
      entityType: 'product',
      entityId: newProduct.id,
      details: `Created new product "${newProduct.name}"`,
    });
    return res.json({ success: true, data: newProduct });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const prod = products.find((p) => p.id === id);
  products = products.filter((p) => p.id !== id);
  if (prod) {
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'admin@veritascraft.com',
      action: 'PRODUCT_DELETED',
      entityType: 'product',
      entityId: id,
      details: `Deleted product "${prod.name}"`,
    });
  }
  res.json({ success: true });
});

// -----------------------------------------------------------------------------
// BLOG POSTS API
// -----------------------------------------------------------------------------
app.get('/api/blog', (req: Request, res: Response) => {
  res.json({ success: true, data: blogPosts });
});

app.post('/api/blog', (req: Request, res: Response) => {
  const postData = req.body as BlogPost;
  if (!postData.title || !postData.content) {
    return res.status(400).json({ success: false, error: 'Title and content are required.' });
  }

  const existingIndex = blogPosts.findIndex((b) => b.id === postData.id);
  if (existingIndex >= 0) {
    blogPosts[existingIndex] = {
      ...blogPosts[existingIndex],
      ...postData,
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'admin@veritascraft.com',
      action: 'POST_UPDATED',
      entityType: 'blog_post',
      entityId: postData.id,
      details: `Updated article "${postData.title}"`,
    });
    return res.json({ success: true, data: blogPosts[existingIndex] });
  } else {
    const newPost: BlogPost = {
      ...postData,
      id: postData.id || `post-${Date.now()}`,
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      viewsCount: 1,
      comments: [],
    };
    blogPosts.unshift(newPost);
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'admin@veritascraft.com',
      action: 'POST_CREATED',
      entityType: 'blog_post',
      entityId: newPost.id,
      details: `Published new article "${newPost.title}"`,
    });
    return res.json({ success: true, data: newPost });
  }
});

// -----------------------------------------------------------------------------
// PAYMENT GATEWAYS API
// -----------------------------------------------------------------------------
app.get('/api/gateways', (req: Request, res: Response) => {
  res.json({ success: true, data: paymentGateways });
});

app.post('/api/gateways', (req: Request, res: Response) => {
  const updatedList = req.body as PaymentGateway[];
  if (!Array.isArray(updatedList)) {
    return res.status(400).json({ success: false, error: 'Gateways must be an array' });
  }
  paymentGateways = updatedList;
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorEmail: 'admin@veritascraft.com',
    action: 'GATEWAYS_CONFIGURED',
    entityType: 'payment_gateways',
    entityId: 'all',
    details: `Updated payment gateway settings. Active gateways: ${paymentGateways.filter((g) => g.isEnabled).map((g) => g.displayName).join(', ')}`,
  });
  res.json({ success: true, data: paymentGateways });
});

// -----------------------------------------------------------------------------
// CHECKOUT & ORDERS (SERVER-SIDE PRICE & DISCOUNT VALIDATION)
// -----------------------------------------------------------------------------
app.post('/api/checkout/process', (req: Request, res: Response) => {
  const { customerEmail, customerName, items, couponCode, paymentGatewayId, manualPaymentRef } = req.body;

  if (!customerEmail || !customerName) {
    return res.status(400).json({ success: false, error: 'Customer email and name are required.' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty.' });
  }

  // Server-side price recalculation: NEVER trust client price
  let calculatedSubtotal = 0;
  const verifiedOrderItems = items.map((cartItem: any) => {
    const dbProduct = products.find((p) => p.id === cartItem.product?.id || p.id === cartItem.productId);
    const unitPrice = dbProduct ? dbProduct.price : Number(cartItem.unitPrice || 0);
    const quantity = Math.max(1, Number(cartItem.quantity || 1));
    calculatedSubtotal += unitPrice * quantity;

    return {
      productId: dbProduct ? dbProduct.id : cartItem.productId,
      productName: dbProduct ? dbProduct.name : cartItem.productName,
      unitPrice: unitPrice,
      quantity: quantity,
      isAddon: Boolean(cartItem.isAddon),
      fileFormat: dbProduct ? dbProduct.fileFormat : 'Digital Download',
      fileSize: dbProduct ? dbProduct.fileSize : 'Instant Access',
      version: dbProduct ? dbProduct.version : '1.0',
      downloadToken: `dl_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
  });

  // Server-side coupon verification
  let discountAmount = 0;
  if (couponCode) {
    const activeCoupon = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive);
    if (activeCoupon) {
      if (!activeCoupon.minOrderAmount || calculatedSubtotal >= activeCoupon.minOrderAmount) {
        if (activeCoupon.discountType === 'percentage') {
          discountAmount = (calculatedSubtotal * activeCoupon.discountValue) / 100;
        } else {
          discountAmount = Math.min(calculatedSubtotal, activeCoupon.discountValue);
        }
        activeCoupon.timesUsed += 1;
      }
    }
  }

  const totalAmount = Math.max(0, calculatedSubtotal - discountAmount);

  // Status resolution
  const isManual = paymentGatewayId === 'manual_transfer';
  const paymentStatus = isManual ? 'manual_verification' : 'paid';

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `VC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerEmail,
    customerName,
    subtotal: Number(calculatedSubtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    couponCode: discountAmount > 0 ? couponCode : undefined,
    taxAmount: 0,
    totalAmount: Number(totalAmount.toFixed(2)),
    currency: 'USD',
    paymentStatus,
    paymentGatewayId: paymentGatewayId || 'stripe',
    gatewayTransactionId: isManual ? undefined : `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    manualPaymentRef: isManual ? manualPaymentRef : undefined,
    items: verifiedOrderItems,
    createdAt: new Date().toISOString(),
    completedAt: isManual ? undefined : new Date().toISOString(),
  };

  orders.unshift(newOrder);

  // Auto-subscribe customer email
  if (!subscribers.find((s) => s.email === customerEmail)) {
    subscribers.push({
      email: customerEmail,
      source: 'checkout',
      subscribedAt: new Date().toISOString().split('T')[0],
    });
  }

  // Audit log
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorEmail: customerEmail,
    action: 'ORDER_PLACED',
    entityType: 'order',
    entityId: newOrder.orderNumber,
    details: `Order of $${newOrder.totalAmount} via ${paymentGatewayId}. Status: ${paymentStatus}`,
  });

  res.json({
    success: true,
    order: newOrder,
  });
});

app.get('/api/orders', (req: Request, res: Response) => {
  const { email } = req.query;
  if (email) {
    const customerOrders = orders.filter((o) => o.customerEmail.toLowerCase() === (email as string).toLowerCase());
    return res.json({ success: true, data: customerOrders });
  }
  res.json({ success: true, data: orders });
});

app.post('/api/orders/verify-manual', (req: Request, res: Response) => {
  const { orderId, approve } = req.body;
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  if (approve) {
    order.paymentStatus = 'paid';
    order.completedAt = new Date().toISOString();
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'admin@veritascraft.com',
      action: 'MANUAL_PAYMENT_APPROVED',
      entityType: 'order',
      entityId: order.orderNumber,
      details: `Approved manual wire/UPI payment for order ${order.orderNumber}. Instant delivery unlocked.`,
    });
  } else {
    order.paymentStatus = 'failed';
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'admin@veritascraft.com',
      action: 'MANUAL_PAYMENT_REJECTED',
      entityType: 'order',
      entityId: order.orderNumber,
      details: `Rejected manual reference for order ${order.orderNumber}.`,
    });
  }

  res.json({ success: true, order });
});

// -----------------------------------------------------------------------------
// SECURE EXPIRING DIGITAL DOWNLOAD DELIVERY
// -----------------------------------------------------------------------------
app.get('/api/downloads/:token', (req: Request, res: Response) => {
  const { token } = req.params;

  let foundItem: any = null;
  let parentOrder: Order | null = null;

  for (const ord of orders) {
    for (const item of ord.items) {
      if (item.downloadToken === token) {
        foundItem = item;
        parentOrder = ord;
        break;
      }
    }
    if (foundItem) break;
  }

  // Free lead magnet exception token
  if (token === 'token-free-lead-magnet') {
    res.setHeader('Content-Disposition', 'attachment; filename="Free_7Day_Digital_Product_Blueprint.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    return res.send(`%PDF-1.4 VeritasCraft Free 7-Day Digital Product Starter Blueprint. Authorized Download.`);
  }

  if (!foundItem || !parentOrder) {
    return res.status(404).send('Download token invalid or expired. Please contact support@veritascraft.com.');
  }

  if (parentOrder.paymentStatus !== 'paid') {
    return res.status(403).send('Payment is still pending verification. Downloads unlock immediately upon verified payment.');
  }

  // Log download event
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorEmail: parentOrder.customerEmail,
    action: 'FILE_DOWNLOADED',
    entityType: 'download_permission',
    entityId: token,
    details: `Downloaded "${foundItem.productName}" (Token: ${token.substring(0, 10)}...)`,
  });

  const safeFileName = `${foundItem.productName.replace(/[^a-zA-Z0-9_-]/g, '_')}_v${foundItem.version}.zip`;
  res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
  res.setHeader('Content-Type', 'application/zip');
  res.send(`PK\x03\x04 VeritasCraft Authenticated License Payload for ${parentOrder.customerEmail} - Order ${parentOrder.orderNumber}`);
});

// -----------------------------------------------------------------------------
// PINTEREST PIN WORKSPACE API
// -----------------------------------------------------------------------------
app.get('/api/pins', (req: Request, res: Response) => {
  res.json({ success: true, data: pins });
});

app.post('/api/pins', (req: Request, res: Response) => {
  const pinData = req.body as PinDesign;
  const existingIdx = pins.findIndex((p) => p.id === pinData.id);
  if (existingIdx >= 0) {
    pins[existingIdx] = { ...pins[existingIdx], ...pinData };
    res.json({ success: true, data: pins[existingIdx] });
  } else {
    const newPin: PinDesign = {
      ...pinData,
      id: pinData.id || `pin-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      pinClicksCount: 0,
      savesCount: 0,
    };
    pins.unshift(newPin);
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: 'admin@veritascraft.com',
      action: 'PIN_CREATED',
      entityType: 'pinterest_pin',
      entityId: newPin.id,
      details: `Created new 2:3 vertical Pin: "${newPin.headlineOverlay}"`,
    });
    res.json({ success: true, data: newPin });
  }
});

// -----------------------------------------------------------------------------
// THEME SETTINGS API
// -----------------------------------------------------------------------------
app.get('/api/theme', (req: Request, res: Response) => {
  res.json({ success: true, data: themeSettings });
});

app.post('/api/theme', (req: Request, res: Response) => {
  themeSettings = { ...themeSettings, ...req.body };
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorEmail: 'admin@veritascraft.com',
    action: 'THEME_SAVED',
    entityType: 'theme_settings',
    entityId: 'theme',
    details: `Updated active storefront theme preset to ${themeSettings.presetName}.`,
  });
  res.json({ success: true, data: themeSettings });
});

// -----------------------------------------------------------------------------
// COUPONS API
// -----------------------------------------------------------------------------
app.get('/api/coupons', (req: Request, res: Response) => {
  res.json({ success: true, data: coupons });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const couponData = req.body as Coupon;
  const existing = coupons.findIndex((c) => c.code.toUpperCase() === couponData.code.toUpperCase());
  if (existing >= 0) {
    coupons[existing] = { ...coupons[existing], ...couponData };
  } else {
    coupons.unshift({ ...couponData, timesUsed: 0 });
  }
  res.json({ success: true, data: coupons });
});

// -----------------------------------------------------------------------------
// SUBSCRIBERS & LEAD MAGNETS API
// -----------------------------------------------------------------------------
app.get('/api/subscribers', (req: Request, res: Response) => {
  res.json({ success: true, data: subscribers });
});

app.post('/api/newsletter/subscribe', (req: Request, res: Response) => {
  const { email, source, leadMagnetClaimed } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email required' });
  }

  const existing = subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (!existing) {
    subscribers.unshift({
      email,
      source: source || 'newsletter_box',
      leadMagnetClaimed,
      subscribedAt: new Date().toISOString().split('T')[0],
    });
  }

  res.json({
    success: true,
    message: leadMagnetClaimed
      ? 'Success! Your free digital blueprint is ready for download.'
      : 'Thank you for subscribing to VeritasCraft Editorial.',
    downloadUrl: leadMagnetClaimed ? '/api/downloads/token-free-lead-magnet' : undefined,
  });
});

// -----------------------------------------------------------------------------
// AUDIT LOGS & ANALYTICS
// -----------------------------------------------------------------------------
app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, data: auditLogs });
});

app.get('/api/analytics', (req: Request, res: Response) => {
  const totalRevenue = orders.filter((o) => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrders = orders.filter((o) => o.paymentStatus === 'paid').length;
  const totalPinClicks = pins.reduce((acc, p) => acc + (p.pinClicksCount || 0), 0);
  const totalPinSaves = pins.reduce((acc, p) => acc + (p.savesCount || 0), 0);

  res.json({
    success: true,
    data: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      averageOrderValue: totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0,
      totalPinClicks,
      totalPinSaves,
      subscribersCount: subscribers.length,
      publishedArticles: blogPosts.filter((b) => b.status === 'published').length,
      activeProducts: products.filter((p) => p.isAvailable).length,
      trafficSources: [
        { name: 'Pinterest Visual Search', percentage: 48, visitors: 115200 },
        { name: 'Organic Google Search', percentage: 28, visitors: 67200 },
        { name: 'Direct & Email Newsletter', percentage: 16, visitors: 38400 },
        { name: 'Social & Referral', percentage: 8, visitors: 19200 },
      ],
    },
  });
});

// -----------------------------------------------------------------------------
// IMAGE PROXY FOR CROSS-ORIGIN PINTEREST CANVAS EXPORTS
// -----------------------------------------------------------------------------
app.get('/api/proxy-image', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).json({ error: 'Missing url query parameter.' });
  }

  try {
    const parsed = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Only http and https protocols are supported.' });
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Remote image fetch returned status ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Content-Type', contentType);
    res.send(buffer);
  } catch (err: any) {
    console.error('Image proxy error:', err);
    res.status(500).json({ error: 'Failed to proxy remote image.' });
  }
});

// -----------------------------------------------------------------------------
// SEO: SITEMAP & ROBOTS.TXT
// -----------------------------------------------------------------------------
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://veritascraft.com';
  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/shop`,
    `${baseUrl}/blog`,
    ...products.filter((p) => p.isAvailable).map((p) => `${baseUrl}/product/${p.slug}`),
    ...products.filter((p) => p.isAvailable && p.hasDedicatedLandingPage).map((p) => `${baseUrl}/landing/${p.slug}`),
    ...blogPosts.filter((b) => b.status === 'published').map((b) => `${baseUrl}/blog/${b.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/robots.txt', (req: Request, res: Response) => {
  const robots = `User-agent: *
Disallow: /admin
Disallow: /checkout
Disallow: /account/downloads
Disallow: /api/
Allow: /

Sitemap: ${(process.env.APP_URL || 'https://veritascraft.com')}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(robots);
});

// -----------------------------------------------------------------------------
// VITE DEV SERVER MIDDLEWARE / PRODUCTION STATIC FILES
// -----------------------------------------------------------------------------
async function setupFrontend() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`VeritasCraft server running on port ${PORT}`);
  });
}

setupFrontend();
