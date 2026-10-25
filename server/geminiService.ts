import { GoogleGenAI } from '@google/genai';

export interface GenerateAiOptions {
  topic: string;
  targetAudience?: string;
  keywords?: string;
  tone?: string;
  language?: string;
  length?: string;
  brandName?: string;
  destinationUrl?: string;
  productToPromote?: string;
  actionType: string;
  customInstructions?: string;
  sourceText?: string;
  productInfo?: {
    id: string;
    name: string;
    shortDescription?: string;
    price: number;
    slug?: string;
  };
}

export interface GenerationResult {
  success: boolean;
  isConfigured: boolean;
  result?: string;
  error?: string;
  errorCode?: string;
  statusCode?: number;
  modelUsed?: string;
  fallbackUsed?: boolean;
  correlationId: string;
  canRetry?: boolean;
  topicPreserved?: boolean;
  totalAttempts?: number;
}

export interface GeminiClientLike {
  models: {
    generateContent: (params: { model: string; contents: string }) => Promise<{ text?: string | null }>;
  };
}

// Model settings from secure server-side configuration
export const PRIMARY_GEMINI_MODEL = process.env.GEMINI_PRIMARY_MODEL || 'gemini-3.8-flash';
export const FALLBACK_GEMINI_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash';

// Retry boundaries
export const MAX_PRIMARY_ATTEMPTS = 3; // Initial + up to 2 retries
export const MAX_FALLBACK_ATTEMPTS = 2; // Initial + up to 1 retry
export const BASE_RETRY_DELAY_MS = 400;
export const MAX_RETRY_DELAY_MS = 6000;
export const JITTER_MS = 250;

/**
 * Generate a unique correlation ID for tracing requests without sensitive data.
 */
export function generateCorrelationId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `req-${ts}-${rand}`;
}

/**
 * Redact sensitive info (API keys, credentials, tokens) from string or error messages.
 */
export function sanitizeLogString(str: string): string {
  if (!str) return '';
  return str
    .replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]')
    .replace(/(?:bearer|token|key|secret)\s*[:=]\s*['"]?[a-zA-Z0-9_\-\.]{8,}['"]?/gi, '$1=[REDACTED]');
}

/**
 * Safe server-side diagnostic logger that never prints credentials or raw user secrets.
 */
export function logAiDiagnostic(entry: {
  correlationId: string;
  level: 'info' | 'warn' | 'error';
  actionType: string;
  model: string;
  attempt?: number;
  maxAttempts?: number;
  statusCode?: number;
  delayMs?: number;
  message: string;
  isFallback?: boolean;
  error?: any;
}) {
  const timestamp = new Date().toISOString();
  const safeMessage = sanitizeLogString(entry.message);
  const prefix = `[Gemini-AI-Writing][${timestamp}][${entry.correlationId}]`;

  const details = [
    `model=${entry.model}`,
    `action=${entry.actionType}`,
    entry.attempt ? `attempt=${entry.attempt}/${entry.maxAttempts}` : null,
    entry.statusCode ? `status=${entry.statusCode}` : null,
    entry.delayMs ? `backoff=${entry.delayMs}ms` : null,
    entry.isFallback ? 'fallback=true' : null,
  ]
    .filter(Boolean)
    .join(' ');

  if (entry.level === 'error') {
    console.error(`${prefix} ERROR (${details}) ${safeMessage}`);
  } else if (entry.level === 'warn') {
    console.warn(`${prefix} WARN (${details}) ${safeMessage}`);
  } else {
    console.log(`${prefix} INFO (${details}) ${safeMessage}`);
  }
}

/**
 * Inspect an error to determine whether it is a transient failure (503, 429, 500, 502, 504, timeout).
 */
export function inspectError(error: any): {
  isTransient: boolean;
  statusCode: number;
  retryAfterMs?: number;
  reason: string;
} {
  let statusCode = 500;
  let reason = 'UNKNOWN';
  let retryAfterMs: number | undefined;

  if (error && typeof error.status === 'number') {
    statusCode = error.status;
  } else if (error && typeof error.statusCode === 'number') {
    statusCode = error.statusCode;
  } else if (error && typeof error.code === 'number') {
    statusCode = error.code;
  }

  const rawMessage = (error?.message || '').toLowerCase();

  // Try parsing JSON error structure if present
  try {
    if (typeof error?.message === 'string' && error.message.trim().startsWith('{')) {
      const parsed = JSON.parse(error.message);
      if (parsed?.error?.code && typeof parsed.error.code === 'number') {
        statusCode = parsed.error.code;
      }
      if (parsed?.error?.status) {
        reason = parsed.error.status;
      }
    }
  } catch {
    // Ignore JSON parse failure
  }

  // Check common status patterns in message
  if (statusCode === 500) {
    if (rawMessage.includes('503') || rawMessage.includes('unavailable') || rawMessage.includes('high demand')) {
      statusCode = 503;
      reason = 'HIGH_DEMAND_UNAVAILABLE';
    } else if (rawMessage.includes('429') || rawMessage.includes('resource_exhausted') || rawMessage.includes('quota')) {
      statusCode = 429;
      reason = 'RESOURCE_EXHAUSTED';
    } else if (rawMessage.includes('404') || rawMessage.includes('not found')) {
      statusCode = 404;
      reason = 'NOT_FOUND';
    } else if (rawMessage.includes('401') || rawMessage.includes('unauthenticated') || rawMessage.includes('invalid api key')) {
      statusCode = 401;
      reason = 'UNAUTHENTICATED';
    } else if (rawMessage.includes('403') || rawMessage.includes('permission_denied')) {
      statusCode = 403;
      reason = 'PERMISSION_DENIED';
    } else if (rawMessage.includes('400') || rawMessage.includes('invalid_argument')) {
      statusCode = 400;
      reason = 'INVALID_ARGUMENT';
    } else if (rawMessage.includes('timeout') || rawMessage.includes('etimedout') || rawMessage.includes('deadline_exceeded')) {
      statusCode = 504;
      reason = 'DEADLINE_EXCEEDED';
    } else if (rawMessage.includes('econnreset') || rawMessage.includes('fetch failed')) {
      statusCode = 502;
      reason = 'CONNECTION_RESET';
    }
  }

  // Check headers for Retry-After if available
  if (error?.response?.headers) {
    const retryHeader = error.response.headers.get?.('retry-after') || error.response.headers['retry-after'];
    if (retryHeader) {
      const parsedSec = parseFloat(retryHeader);
      if (!isNaN(parsedSec) && parsedSec > 0) {
        retryAfterMs = Math.round(parsedSec * 1000);
      }
    }
  }

  // Transient status codes that warrant retry
  const isTransient = [503, 429, 500, 502, 503, 504].includes(statusCode);

  return { isTransient, statusCode, retryAfterMs, reason };
}

/**
 * Calculate exponential backoff with jitter and bounds.
 */
export function calculateBackoffMs(attempt: number, retryAfterMs?: number): number {
  if (typeof retryAfterMs === 'number' && retryAfterMs > 0) {
    // Respect Retry-After header, bounded between 200ms and 8000ms
    return Math.min(Math.max(retryAfterMs, 200), 8000);
  }
  // Exponential backoff: base * 2^(attempt - 1) + jitter
  const exp = Math.min(MAX_RETRY_DELAY_MS, BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1));
  const jitter = Math.floor(Math.random() * JITTER_MS);
  return exp + jitter;
}

/**
 * Return user-friendly non-technical error messages preserving topic state.
 */
export function getFriendlyErrorMessage(statusCode: number, customDetail?: string): string {
  switch (statusCode) {
    case 503:
    case 429:
    case 502:
    case 504:
      return 'AI generation is temporarily unavailable. Please try again shortly. Your topic has been preserved.';
    case 401:
    case 403:
      return 'The configured Gemini API key is invalid or lacks required permissions. Please verify your GEMINI_API_KEY in Settings > Secrets.';
    case 404:
      return 'The requested Gemini model is not supported or not found. Please verify your model configuration.';
    case 400:
      return 'Invalid generation request parameters. Please verify your topic and settings.';
    default:
      if (customDetail && customDetail.toLowerCase().includes('timeout')) {
        return 'AI generation request timed out. Please try again shortly. Your topic has been preserved.';
      }
      return 'AI generation is temporarily unavailable. Please try again shortly. Your topic has been preserved.';
  }
}

/**
 * Constructs prompt for all 13+ Content Studio / Pinterest Studio actions.
 */
export function buildAiPrompt(options: GenerateAiOptions): string {
  const {
    topic,
    targetAudience,
    keywords,
    tone,
    language = 'English',
    length = 'medium',
    brandName = 'VeritasCraft',
    destinationUrl,
    actionType,
    customInstructions,
    sourceText,
    productInfo,
  } = options;

  const productMention = productInfo
    ? `Naturally integrate and promote this digital product: "${productInfo.name}" (${productInfo.shortDescription || 'digital craft'}, priced at $${productInfo.price}).`
    : '';

  const langInstruction = `Write entirely in ${language}.`;
  const brandContext = `Brand Name: ${brandName}. Audience: ${targetAudience || 'Creators & entrepreneurs'}. Tone: ${tone || 'Authoritative and editorial'}.`;

  switch (actionType) {
    case 'pin_title':
      return `You are a Pinterest visual search algorithm expert. Generate 10 high-CTR Pinterest Pin titles for: "${topic}".
${brandContext}
${keywords ? `Target Keywords: ${keywords}` : ''}
${langInstruction}

Requirements:
- Each title must be under 90 characters so it is never truncated in mobile feeds.
- Front-load high-intent search keywords in the first 35 characters.
- Vary formulas: curiosity hooks, numbered list titles, direct benefit promises, and actionable tutorials.
- Number each title clearly 1 to 10 without markdown clutter.`;

    case 'pin_description':
      return `Generate 3 comprehensive, SEO-optimized Pinterest Pin descriptions for: "${topic}".
${brandContext}
${productMention}
${destinationUrl ? `Destination Link Context: ${destinationUrl}` : ''}
${keywords ? `Main Keywords: ${keywords}` : ''}
${langInstruction}

For each description:
- Write 2–3 flowing, natural sentences incorporating 3–4 high-volume keywords organically (no keyword stuffing).
- Include an explicit call to action (e.g., "Click through to download the blueprint and start today!").
- Append 4–5 relevant, searchable Pinterest hashtags at the end.`;

    case 'pin_keywords':
      return `Provide an in-depth Pinterest keyword research breakdown for the niche/topic: "${topic}".
${langInstruction}

Provide:
1. 5 High-Volume Seed Keywords
2. 10 Long-Tail Search Queries that users actively type into the Pinterest search bar
3. 5 Predictive Tile suggestions (the colored search bubbles Pinterest displays under the search bar)
4. Recommended Board Name and Board Category classification.`;

    case 'pin_hashtags':
      return `Generate a curated list of 25 targeted, non-spammy Pinterest hashtags for: "${topic}".
${langInstruction}
Group them into:
1. Broad Category Tags (5 tags)
2. Niche Specific Tags (10 tags)
3. High-Intent Buyer Tags (10 tags).`;

    case 'headlines':
      return `Generate 10 viral, high-CTR blog and pin headlines for: "${topic}".
${brandContext}
${keywords ? `Keywords: ${keywords}` : ''}
${langInstruction}
Requirements:
- Mix curiosity hooks, contrarian statements, how-to guides, and numbered listicles.
- Keep each under 80 characters for optimal visibility across Pinterest and search engines.
- Number each 1 to 10.`;

    case 'pin_copy':
      return `Generate complete Pinterest Pin promotional copy for: "${topic}".
${brandContext}
${productMention}
${langInstruction}
Include:
1. 3 Punchy Pin Overlay Headlines (under 8 words each, ideal for bold text on visual pins)
2. 2 SEO Pin Descriptions (with natural keyword integration and call to action)
3. 5 High-ranking Pinterest hashtags.`;

    case 'faq':
      return `Generate 5 high-converting objection-handling FAQs for: "${topic}".
${brandContext}
${productMention}
${langInstruction}
Structure each FAQ with a common buyer hesitation or skepticism, followed by an empathetic, reassuring, value-packed answer.`;

    case 'outline':
    case 'blog_outline':
      return `Create a comprehensive, conversion-engineered article outline for a long-form editorial guide on: "${topic}".
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

    case 'seo_meta':
      return `Generate optimized SEO metadata for an article or product page on: "${topic}".
${brandContext}
${keywords ? `Target Keywords: ${keywords}` : ''}
${langInstruction}

Provide:
1. 3 SEO Meta Titles (strictly under 60 characters each with character count)
2. 3 SEO Meta Descriptions (strictly between 140 and 155 characters each with character count)
3. Recommended URL Slug (clean, hyphenated, human-readable).`;

    case 'draft_intro':
    case 'blog_intro':
      return `Write a captivating 350-word introduction and first major section for an editorial guide on: "${topic}".
${brandContext}
${productMention}
${langInstruction}

Guidelines:
- Open with a thought-provoking industry contradiction or common painful misconception.
- Avoid generic filler (never start with "In today's fast-paced digital world").
- Use calm, human, sophisticated editorial phrasing.
- Include a highlighted key takeaway quote.`;

    case 'product_description':
      return `Write a compelling, benefit-focused digital product description for: "${topic}".
${brandContext}
${productMention}
${langInstruction}

Structure:
1. Headline Hook & Emotional Value Proposition
2. Short 2-sentence Overview
3. Core What's Inside Feature Breakdown (bulleted list with tangible outcomes)
4. Who It's Made For & Licensing Terms Summary.`;

    case 'sales_copy':
      return `Write high-converting sales landing page copy for the digital product: "${topic}".
${brandContext}
${productMention}
${langInstruction}

Provide copy for:
1. Hero Headline & Benefit Subheading
2. "Who This Is For" vs "Who This Is NOT For" criteria
3. 3 Key Transformation Highlights
4. Comparison Summary (Why our solution beats building from scratch or hiring expensive agencies)
5. Urgency / Risk-Reversal Guarantee Statement.`;

    case 'cta_suggestions':
      return `Generate 15 high-converting Call-to-Action (CTA) button and banner text options for: "${topic}".
${langInstruction}
Group into:
- 5 Direct Purchase CTAs (e.g., "Download Operating System — $39")
- 5 Value / Outcome CTAs (e.g., "Streamline My Studio Today")
- 5 Low-Friction / Lead Magnet CTAs (e.g., "Claim Free 7-Day Blueprint →").`;

    case 'social_copy':
      return `Create 3 multi-slide social media promotional post captions (for Instagram & Facebook) promoting: "${topic}".
${brandContext}
${productMention}
${destinationUrl ? `Link in Bio / Destination: ${destinationUrl}` : ''}
${langInstruction}

Each post should include:
- Eye-catching 1-line hook
- Educational micro-lesson or value breakdown
- Clear call to action to visit the link or save the post
- 5 relevant hashtags.`;

    case 'email_marketing':
      return `Write an engaging promotional email newsletter dispatch for: "${topic}".
${brandContext}
${productMention}
${destinationUrl ? `Action Link: ${destinationUrl}` : ''}
${langInstruction}

Include:
1. 4 High-Open-Rate Subject Lines (with emojis & curiosity angles)
2. Preview / Preheader Text
3. Email Body (conversational, storytelling opening, practical tip, product recommendation bridge, and P.S. note).`;

    case 'rewrite_expand':
      return `Rewrite, polish, and elevate the following text for publication in VeritasCraft.
${brandContext}
Target Length: ${length}
${langInstruction}
${customInstructions ? `Special Instructions: ${customInstructions}` : ''}

Original Text:
"""
${sourceText || topic}
"""

Provide an elevated editorial version with crisp sentence cadence, zero fluff, and strong vocabulary.`;

    default:
      return `Write an authoritative, high-value editorial guide on: "${topic}".
${brandContext}
${productMention}
${langInstruction}
${customInstructions ? `Additional Instructions: ${customInstructions}` : ''}`;
  }
}

/**
 * Main AI Writing executor with exponential backoff retries and verified fallback model.
 */
export async function executeAiWritingGeneration(
  client: GeminiClientLike,
  options: GenerateAiOptions,
  configOverrides?: {
    primaryModel?: string;
    fallbackModel?: string;
    maxPrimaryAttempts?: number;
    maxFallbackAttempts?: number;
    sleepFn?: (ms: number) => Promise<void>;
  }
): Promise<GenerationResult> {
  const correlationId = generateCorrelationId();
  const primaryModel = configOverrides?.primaryModel || PRIMARY_GEMINI_MODEL;
  const fallbackModel = configOverrides?.fallbackModel || FALLBACK_GEMINI_MODEL;
  const maxPrimaryAttempts = configOverrides?.maxPrimaryAttempts ?? MAX_PRIMARY_ATTEMPTS;
  const maxFallbackAttempts = configOverrides?.maxFallbackAttempts ?? MAX_FALLBACK_ATTEMPTS;
  const sleep = configOverrides?.sleepFn || ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));

  const prompt = buildAiPrompt(options);

  let totalAttempts = 0;
  let lastError: any = null;
  let lastStatusCode = 500;

  // ---------------------------------------------------------------------------
  // Step 1: Execute primary model with exponential backoff for transient errors
  // ---------------------------------------------------------------------------
  logAiDiagnostic({
    correlationId,
    level: 'info',
    actionType: options.actionType,
    model: primaryModel,
    message: `Initiating AI generation request for topic: "${options.topic?.slice(0, 40)}"`,
  });

  for (let attempt = 1; attempt <= maxPrimaryAttempts; attempt++) {
    totalAttempts++;
    try {
      const response = await client.models.generateContent({
        model: primaryModel,
        contents: prompt,
      });

      const generatedText = response?.text || '';
      if (!generatedText) {
        throw new Error('Empty response received from model generation.');
      }

      logAiDiagnostic({
        correlationId,
        level: 'info',
        actionType: options.actionType,
        model: primaryModel,
        attempt,
        maxAttempts: maxPrimaryAttempts,
        message: `Generation succeeded with primary model (${generatedText.length} chars).`,
      });

      return {
        success: true,
        isConfigured: true,
        result: generatedText,
        modelUsed: primaryModel,
        fallbackUsed: false,
        correlationId,
        canRetry: false,
        topicPreserved: true,
        totalAttempts,
      };
    } catch (err: any) {
      lastError = err;
      const { isTransient, statusCode, retryAfterMs, reason } = inspectError(err);
      lastStatusCode = statusCode;

      logAiDiagnostic({
        correlationId,
        level: 'warn',
        actionType: options.actionType,
        model: primaryModel,
        attempt,
        maxAttempts: maxPrimaryAttempts,
        statusCode,
        message: `Primary model request failed: ${reason} (message: ${err.message?.slice(0, 120)})`,
        error: err,
      });

      // If error is not transient (e.g. 400 bad request, 401 unauthenticated, 403 forbidden, 404 model not found), abort retries
      if (!isTransient) {
        logAiDiagnostic({
          correlationId,
          level: 'error',
          actionType: options.actionType,
          model: primaryModel,
          statusCode,
          message: `Non-transient error encountered (${statusCode}). Aborting retries immediately without fallback.`,
        });

        return {
          success: false,
          isConfigured: statusCode !== 401,
          error: getFriendlyErrorMessage(statusCode, err.message),
          errorCode: reason,
          statusCode,
          correlationId,
          canRetry: false,
          topicPreserved: true,
          totalAttempts,
        };
      }

      // If attempts remain for primary model, wait backoff delay with jitter
      if (attempt < maxPrimaryAttempts) {
        const delayMs = calculateBackoffMs(attempt, retryAfterMs);
        logAiDiagnostic({
          correlationId,
          level: 'info',
          actionType: options.actionType,
          model: primaryModel,
          attempt,
          maxAttempts: maxPrimaryAttempts,
          delayMs,
          message: `Transient error ${statusCode}. Scheduling retry in ${delayMs}ms.`,
        });
        await sleep(delayMs);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Step 2: Primary model exhausted. Try fallback model if configured & appropriate
  // ---------------------------------------------------------------------------
  const shouldTryFallback =
    Boolean(fallbackModel) &&
    fallbackModel !== primaryModel &&
    (lastStatusCode === 503 || lastStatusCode === 429 || lastStatusCode === 502 || lastStatusCode === 504);

  if (shouldTryFallback) {
    logAiDiagnostic({
      correlationId,
      level: 'warn',
      actionType: options.actionType,
      model: fallbackModel,
      isFallback: true,
      message: `Primary model ${primaryModel} exhausted with HTTP ${lastStatusCode}. Switching to verified fallback model: ${fallbackModel}.`,
    });

    for (let fbAttempt = 1; fbAttempt <= maxFallbackAttempts; fbAttempt++) {
      totalAttempts++;
      try {
        const fbResponse = await client.models.generateContent({
          model: fallbackModel,
          contents: prompt,
        });

        const fbText = fbResponse?.text || '';
        if (!fbText) {
          throw new Error('Empty response received from fallback model generation.');
        }

        logAiDiagnostic({
          correlationId,
          level: 'info',
          actionType: options.actionType,
          model: fallbackModel,
          attempt: fbAttempt,
          maxAttempts: maxFallbackAttempts,
          isFallback: true,
          message: `Generation succeeded with fallback model ${fallbackModel} (${fbText.length} chars).`,
        });

        return {
          success: true,
          isConfigured: true,
          result: fbText,
          modelUsed: fallbackModel,
          fallbackUsed: true,
          correlationId,
          canRetry: false,
          topicPreserved: true,
          totalAttempts,
        };
      } catch (fbErr: any) {
        lastError = fbErr;
        const { isTransient, statusCode, retryAfterMs, reason } = inspectError(fbErr);
        lastStatusCode = statusCode;

        logAiDiagnostic({
          correlationId,
          level: 'warn',
          actionType: options.actionType,
          model: fallbackModel,
          attempt: fbAttempt,
          maxAttempts: maxFallbackAttempts,
          statusCode,
          isFallback: true,
          message: `Fallback model attempt failed: ${reason} (message: ${fbErr.message?.slice(0, 120)})`,
        });

        if (!isTransient) {
          break;
        }

        if (fbAttempt < maxFallbackAttempts) {
          const delayMs = calculateBackoffMs(fbAttempt, retryAfterMs);
          await sleep(delayMs);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Step 3: All attempts exhausted. Return friendly message preserving topic state
  // ---------------------------------------------------------------------------
  logAiDiagnostic({
    correlationId,
    level: 'error',
    actionType: options.actionType,
    model: primaryModel,
    statusCode: lastStatusCode,
    message: `All generation attempts failed. Total attempts: ${totalAttempts}. Returning user-friendly message.`,
  });

  return {
    success: false,
    isConfigured: true,
    error: getFriendlyErrorMessage(lastStatusCode, lastError?.message),
    errorCode: 'SERVICE_UNAVAILABLE',
    statusCode: lastStatusCode,
    correlationId,
    canRetry: true,
    topicPreserved: true,
    totalAttempts,
  };
}
