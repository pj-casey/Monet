/**
 * AI Design Assistant — Claude-powered conversational design partner.
 *
 * Features: design feedback (Vision), copy suggestions, translation,
 * smart edit, brand extraction, variations, conversational chat.
 *
 * Streaming: callClaudeStream() supports Server-Sent Events for
 * real-time token delivery. Text responses stream into the chat UI;
 * JSON responses are collected and parsed at the end.
 *
 * Uses the same localStorage key as ai-generate.ts ('monet-anthropic-key').
 */

import { formatUsage } from './token-estimator';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const STORAGE_KEY = 'monet-anthropic-key';

export function getApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

/** Check if the user has connected their Claude account */
export function isAIConfigured(): boolean {
  return !!getApiKey();
}

/** Save the user's API key to localStorage. Only saves keys that look valid (sk-..., 20+ chars). */
export function saveApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage may be unavailable
  }
}

/** Remove the stored API key */
export function clearApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage may be unavailable
  }
}

/** @deprecated Use isAIConfigured instead */
export const isAIAssistantAvailable = isAIConfigured;

// ─── API result type ────────────────────────────────────────────────

export interface ApiResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

// ─── Streaming API call ─────────────────────────────────────────────

/**
 * Call Claude with SSE streaming support.
 *
 * Sends `stream: true` to the Anthropic API. Parses Server-Sent Events
 * and calls onDelta for each text chunk. Returns the complete text and
 * token usage when the stream ends.
 *
 * @param system - System prompt
 * @param messages - Conversation messages
 * @param maxTokens - Max output tokens
 * @param onDelta - Optional callback for each text chunk (for streaming UI)
 * @returns Complete response text and token usage
 */
export async function callClaudeStream(
  system: string,
  messages: Array<{ role: string; content: string | Array<{ type: string; [key: string]: unknown }> }>,
  maxTokens: number = 2048,
  onDelta?: (text: string) => void,
): Promise<ApiResult> {
  const key = getApiKey();
  if (!key) throw new Error('No API key configured.');

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages,
      stream: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401) throw new Error('Invalid API key. Check your Claude connection.');
    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      throw new Error(retryAfter
        ? `Rate limited. Please wait ${retryAfter} seconds and try again.`
        : 'Rate limited. Please wait a moment and try again.');
    }
    throw new Error(`API error (${res.status}): ${body}`);
  }

  if (!res.body) {
    throw new Error('Response body is empty');
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let inputTokens = 0;
  let outputTokens = 0;
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;

        try {
          const event = JSON.parse(jsonStr);
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            fullText += event.delta.text;
            onDelta?.(event.delta.text);
          } else if (event.type === 'message_start' && event.message?.usage) {
            inputTokens = event.message.usage.input_tokens || 0;
          } else if (event.type === 'message_delta' && event.usage) {
            outputTokens = event.usage.output_tokens || 0;
          }
        } catch {
          /* skip malformed SSE data */
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return { text: fullText, inputTokens, outputTokens };
}

/** Non-streaming wrapper — collects the full response and returns text only. */
async function callClaude(
  system: string,
  messages: Array<{ role: string; content: string | Array<{ type: string; [key: string]: unknown }> }>,
  maxTokens: number = 2048,
): Promise<string> {
  const result = await callClaudeStream(system, messages, maxTokens);
  return result.text;
}

// ─── Shared advanced recipe documentation ───────────────────────────

const RECIPE_FORMAT_DOCS = `
ADVANCED RECIPE FORMAT — use these features for professional-quality designs:

GRADIENT FILLS — use on accent shapes, CTA buttons, decorative elements instead of plain colors:
  Linear: "fill": { "type": "linear", "coords": { "x1": 0, "y1": 0, "x2": WIDTH, "y2": 0 }, "colorStops": [{ "offset": 0, "color": "#C4704A" }, { "offset": 1, "color": "#e8956d" }] }
  Vertical: set x2=0, y2=HEIGHT. Diagonal: x2=WIDTH, y2=HEIGHT.
  Radial: "fill": { "type": "radial", "coords": { "x1": CX, "y1": CY, "x2": CX, "y2": CY, "r1": 0, "r2": RADIUS }, "colorStops": [...] }
  Coords are in object-local space (relative to the shape's own width/height).

DROP SHADOWS — add to headings and key shapes for depth:
  "shadow": { "color": "rgba(0,0,0,0.3)", "blur": 12, "offsetX": 0, "offsetY": 4 }
  Glow: { "color": "rgba(196,112,74,0.5)", "blur": 20, "offsetX": 0, "offsetY": 0 }

TEXT EFFECTS:
  "charSpacing": 200     — letter spacing in 1/1000 em (100-400 for headings, 200-600 for ALL-CAPS labels)
  "lineHeight": 1.3      — line height multiplier
  "stroke": "#ffffff", "strokeWidth": 2  — text outline for contrast over images
  "fontStyle": "italic"

DECORATIVE OPACITY:
  "opacity": 0.15  — semi-transparent shapes create layered depth behind content

STROKE PATTERNS:
  "strokeDashArray": [10, 5]  — dashed borders (10px dash, 5px gap)

MANDATORY QUALITY RULES:
1. ALWAYS include at least ONE gradient fill (accent bar, CTA button, or decorative shape)
2. ALWAYS add a shadow to the main heading text
3. Use charSpacing (50-400) on heading text
4. Add 2-3 decorative shapes with low opacity (0.08-0.25) for visual depth
5. Use REAL content — actual names, dates, prices. NEVER use "Lorem Ipsum", "Your Title Here", or "[Insert text]"
6. Layer objects: background → decorative shapes → content → text on top

EXAMPLE — Instagram Sale Story (1080×1920):
{
  "dimensions": { "width": 1080, "height": 1920 },
  "background": { "type": "gradient", "value": "linear:to-bottom-right:#C4704A:#e76f51" },
  "objects": [
    { "type": "circle", "left": -60, "top": 100, "radius": 200, "fill": "rgba(255,255,255,0.08)" },
    { "type": "circle", "left": 800, "top": 1400, "radius": 260, "fill": "rgba(255,255,255,0.06)" },
    { "type": "textbox", "left": 100, "top": 520, "width": 880, "text": "SUMMER COLLECTION", "fontFamily": "Montserrat", "fontSize": 28, "fontWeight": "bold", "fill": "rgba(255,255,255,0.85)", "textAlign": "center", "charSpacing": 400 },
    { "type": "textbox", "left": 100, "top": 620, "width": 880, "text": "40% OFF", "fontFamily": "Montserrat", "fontSize": 140, "fontWeight": "bold", "fill": "#ffffff", "textAlign": "center", "charSpacing": 100, "shadow": { "color": "rgba(0,0,0,0.5)", "blur": 16, "offsetX": 0, "offsetY": 4 } },
    { "type": "rect", "left": 340, "top": 960, "width": 400, "height": 64, "fill": { "type": "linear", "coords": { "x1": 0, "y1": 0, "x2": 400, "y2": 0 }, "colorStops": [{ "offset": 0, "color": "#ffffff" }, { "offset": 1, "color": "#f0e6df" }] }, "rx": 32, "ry": 32 },
    { "type": "textbox", "left": 340, "top": 975, "width": 400, "text": "Shop Now \\u2192", "fontFamily": "Montserrat", "fontSize": 22, "fontWeight": "bold", "fill": "#C4704A", "textAlign": "center" }
  ]
}

EXAMPLE — Minimal Business Card (1050×600):
{
  "dimensions": { "width": 1050, "height": 600 },
  "background": { "type": "solid", "value": "#faf8f5" },
  "objects": [
    { "type": "textbox", "left": 80, "top": 100, "width": 600, "text": "ELENA VASQUEZ", "fontFamily": "Montserrat", "fontSize": 28, "fontWeight": "bold", "fill": "#1a1520", "charSpacing": 200, "shadow": { "color": "rgba(0,0,0,0.08)", "blur": 12, "offsetX": 0, "offsetY": 4 } },
    { "type": "textbox", "left": 80, "top": 150, "width": 600, "text": "Senior Architect", "fontFamily": "DM Sans", "fontSize": 18, "fill": "#8a8078" },
    { "type": "rect", "left": 80, "top": 200, "width": 50, "height": 2, "fill": { "type": "linear", "coords": { "x1": 0, "y1": 0, "x2": 50, "y2": 0 }, "colorStops": [{ "offset": 0, "color": "#C4704A" }, { "offset": 1, "color": "#e8956d" }] } },
    { "type": "textbox", "left": 80, "top": 360, "width": 500, "text": "elena@meridianstudio.com\\n(312) 555-0198\\nmeridianstudio.com", "fontFamily": "DM Sans", "fontSize": 14, "fill": "#6b6260", "lineHeight": 1.8 },
    { "type": "textbox", "left": 750, "top": 480, "width": 250, "text": "MERIDIAN\\nSTUDIO", "fontFamily": "Montserrat", "fontSize": 14, "fontWeight": "bold", "fill": "#C4704A", "textAlign": "right", "lineHeight": 1.3, "charSpacing": 300 }
  ]
}
`;

// ─── 1. Design Feedback ──────────────────────────────────────────

const FEEDBACK_SYSTEM = `You are an expert graphic designer reviewing a design.

Analyze the image and provide specific, actionable feedback organized into these categories:
- **Layout**: spacing, alignment, balance, visual flow
- **Color**: palette harmony, contrast, readability
- **Typography**: font choices, sizes, hierarchy, readability
- **Hierarchy**: what draws the eye first, information priority
- **Overall**: general impression and top 1-2 improvements

Keep each point concise (1-2 sentences). Be specific — reference exact elements you see.
Use bullet points. Be constructive, not just critical.`;

/**
 * Send a canvas screenshot to Claude Vision for design feedback.
 * Supports streaming — pass onDelta to receive text chunks as they arrive.
 */
export async function getDesignFeedback(
  imageDataUrl: string,
  onDelta?: (text: string) => void,
): Promise<ApiResult> {
  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');

  return callClaudeStream(FEEDBACK_SYSTEM, [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: 'image/png', data: base64 },
        },
        {
          type: 'text',
          text: 'Please review this design and provide specific, actionable feedback.',
        },
      ],
    },
  ], 2048, onDelta);
}

// ─── 2. Suggest Copy ─────────────────────────────────────────────

const COPY_SYSTEM = `You are an expert copywriter helping with graphic design text.

Given a design context (dimensions, colors, existing text), suggest exactly 3 alternative text options for the specified text element.

Output ONLY a JSON array of 3 strings. No explanation, no markdown.
Example: ["Option one text", "Option two text", "Option three text"]

Guidelines:
- Match the tone and purpose of the design
- Keep similar length to the original (don't make text much longer)
- Be creative but professional
- Use REAL content, never generic placeholders
- Consider the design format (Instagram = punchy, Presentation = clear, etc.)`;

/**
 * Get 3 copy suggestions for a selected text element.
 */
export async function suggestCopy(
  currentText: string,
  designContext: {
    width: number;
    height: number;
    allText: string[];
    background: string;
  },
): Promise<string[]> {
  const formatGuess =
    designContext.width === designContext.height ? 'social media post' :
    designContext.width > designContext.height ? 'landscape/banner' :
    'portrait/story';

  const prompt = `Design format: ${designContext.width}x${designContext.height} (${formatGuess})
Background: ${designContext.background}
All text in design: ${designContext.allText.map((t) => `"${t}"`).join(', ')}

Suggest 3 alternatives for this text: "${currentText}"`;

  const response = await callClaude(COPY_SYSTEM, [{ role: 'user', content: prompt }], 512);

  let cleaned = response.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const arr = JSON.parse(cleaned);
    if (Array.isArray(arr) && arr.length >= 1) {
      return arr.slice(0, 3).map(String);
    }
  } catch {
    const matches = cleaned.match(/"([^"]+)"/g);
    if (matches && matches.length >= 1) {
      return matches.slice(0, 3).map((m) => m.replace(/^"|"$/g, ''));
    }
  }

  throw new Error('Could not parse copy suggestions from Claude.');
}

// ─── 3. Translate Design ─────────────────────────────────────────

const TRANSLATE_SYSTEM = `You are a professional translator for graphic design content.

Given a list of text strings and a target language, translate each one.

Output ONLY a JSON array of translated strings in the same order as the input.
Preserve line breaks (\\n) in translations. Keep proper nouns unchanged.
Match the tone — if the original is casual, keep it casual in translation.

Example input: ["Hello World", "Click Here"]
Example output for Spanish: ["Hola Mundo", "Haz Clic Aquí"]`;

export const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' },
  { code: 'nl', name: 'Dutch' },
];

/**
 * Translate an array of text strings to a target language.
 */
export async function translateTexts(
  texts: string[],
  targetLanguage: string,
): Promise<string[]> {
  if (texts.length === 0) return [];

  const prompt = `Translate these ${texts.length} text strings to ${targetLanguage}:\n${JSON.stringify(texts)}`;

  const response = await callClaude(TRANSLATE_SYSTEM, [{ role: 'user', content: prompt }], 2048);

  let cleaned = response.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const arr = JSON.parse(cleaned);
  if (!Array.isArray(arr) || arr.length !== texts.length) {
    throw new Error(`Expected ${texts.length} translations, got ${Array.isArray(arr) ? arr.length : 0}.`);
  }

  return arr.map(String);
}

// ─── 4. Smart Edit ───────────────────────────────────────────────

const SMART_EDIT_SYSTEM = `You are a graphic design assistant that modifies designs based on natural language instructions.

You will receive a DesignDocument JSON and an instruction. Apply the instruction and return the MODIFIED DesignDocument JSON.

Rules:
- Output ONLY the complete modified JSON. No explanation, no markdown.
- Preserve all existing objects unless the instruction says to remove them.
- Keep the same structure (version, id, name, dimensions, etc).
- The design may have a "pages" array. Each page has { id, name, objects[] }. ALWAYS preserve and output the pages array. Edit the objects inside each page, not a top-level objects array.
- If the input has no "pages" array, wrap all objects into pages: [{ id: "", name: "Page 1", objects: [...] }].
- When adding objects, use the "recipe" format: { type, left, top, width, height, fill, ... }
- Supported types: rect, circle, textbox, triangle, line
- Available fonts: Inter, Roboto, Open Sans, Montserrat, Lato, Poppins, Playfair Display, Merriweather, Lora, Bebas Neue, Oswald, Anton, DM Sans
- Coordinates: origin at top-left, X right, Y down
- Colors: hex (#ffffff) or rgba (rgba(0,0,0,0.5))
${RECIPE_FORMAT_DOCS}

Output ONLY the modified JSON.`;

/**
 * Apply a natural language instruction to the current design.
 */
export async function smartEdit(
  doc: import('@monet/shared').DesignDocument,
  instruction: string,
): Promise<import('@monet/shared').DesignDocument> {
  const docJson = JSON.stringify(doc);

  const response = await callClaude(SMART_EDIT_SYSTEM, [
    {
      role: 'user',
      content: `Here is the current design:\n${docJson}\n\nInstruction: ${instruction}`,
    },
  ], 8192);

  let cleaned = response.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);
  const result = normalizeDoc(parsed);
  result.id = doc.id;
  return result;
}

// ─── 5. Extract Brand ────────────────────────────────────────────

const EXTRACT_BRAND_SYSTEM = `You are a brand identity expert. Analyze the provided image (logo, screenshot, or design) and extract brand identity information.

Output ONLY a JSON object with this exact structure:
{
  "name": "Brand Name (if visible, otherwise 'Extracted Brand')",
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "fonts": {
    "heading": "font name from list below",
    "subheading": "font name from list below",
    "body": "font name from list below"
  },
  "aesthetic": "Brief 1-sentence description of the visual style"
}

For colors: extract the most prominent 3-5 colors as hex values. Include primary, secondary, and accent colors.
For fonts: recommend the closest match from these available fonts:
  Sans: Inter, Roboto, Open Sans, Montserrat, Lato, Poppins, Nunito, Raleway, Work Sans, DM Sans
  Serif: Playfair Display, Merriweather, Lora, PT Serif, Libre Baskerville
  Display: Bebas Neue, Oswald, Anton, Pacifico, Lobster
  Mono: Fira Code, JetBrains Mono, Source Code Pro

Output ONLY the JSON.`;

export interface ExtractedBrand {
  name: string;
  colors: string[];
  fonts: { heading: string; subheading: string; body: string };
  aesthetic: string;
}

/**
 * Extract brand identity from an uploaded image.
 */
export async function extractBrand(imageDataUrl: string): Promise<ExtractedBrand> {
  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
  const mediaType = imageDataUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

  const response = await callClaude(EXTRACT_BRAND_SYSTEM, [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        {
          type: 'text',
          text: 'Analyze this image and extract the brand identity.',
        },
      ],
    },
  ]);

  let cleaned = response.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const result = JSON.parse(cleaned);

  return {
    name: result.name || 'Extracted Brand',
    colors: Array.isArray(result.colors) ? result.colors.filter((c: unknown) => typeof c === 'string') : [],
    fonts: {
      heading: result.fonts?.heading || 'Inter',
      subheading: result.fonts?.subheading || 'Inter',
      body: result.fonts?.body || 'Inter',
    },
    aesthetic: result.aesthetic || '',
  };
}

// ─── 6. Generate Variations ──────────────────────────────────────

const VARIATIONS_SYSTEM = `You are a graphic design expert creating design variations.

Given a DesignDocument JSON, create exactly 3 variations:
1. Different color scheme (complementary or analogous palette shift)
2. Different font pairing (swap fonts while keeping the layout)
3. Different layout emphasis (rearrange/resize elements for different visual hierarchy)

Output ONLY a JSON array of 3 objects, each with:
{
  "label": "Short name for this variation",
  "description": "1-sentence description of what changed",
  "document": { ...the full modified DesignDocument... }
}

Rules:
- Each variation is a COMPLETE DesignDocument (same structure as input)
- Keep the same dimensions and general layout
- Variation 1: Change colors only (fill, stroke, background, text colors)
- Variation 2: Change fonts only (fontFamily on all textboxes)
- Variation 3: Change positions/sizes for different emphasis (move, scale objects)
- Available fonts: Inter, Roboto, Montserrat, Poppins, Playfair Display, Merriweather, Lora, Bebas Neue, Oswald, Anton, DM Sans
- Use hex colors. Keep text readable (good contrast).
${RECIPE_FORMAT_DOCS}

Output ONLY the JSON array.`;

export interface DesignVariation {
  label: string;
  description: string;
  document: import('@monet/shared').DesignDocument;
}

/**
 * Generate 3 design variations from the current design.
 */
export async function generateVariations(
  doc: import('@monet/shared').DesignDocument,
): Promise<DesignVariation[]> {
  const docJson = JSON.stringify(doc);

  const response = await callClaude(VARIATIONS_SYSTEM, [
    {
      role: 'user',
      content: `Create 3 variations of this design:\n${docJson}`,
    },
  ], 16384);

  let cleaned = response.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const arr = JSON.parse(cleaned);
  if (!Array.isArray(arr) || arr.length < 1) {
    throw new Error('Invalid variations response.');
  }

  return arr.slice(0, 3).map((v: Record<string, unknown>) => ({
    label: String(v.label || 'Variation'),
    description: String(v.description || ''),
    document: {
      ...(v.document as Record<string, unknown>),
      version: 1,
      id: doc.id,
      updatedAt: new Date().toISOString(),
    } as import('@monet/shared').DesignDocument,
  }));
}

// ─── 7. Conversational Chat ──────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string;
  designs?: Array<{ label: string; document: import('@monet/shared').DesignDocument; thumbnail?: string }>;
  copySuggestions?: string[];
  /** Token usage info shown after the message */
  usage?: string;
  /** Raw JSON response from Claude (used to preserve structured history for follow-up requests) */
  rawResponse?: string;
}

const CHAT_SYSTEM = `You are Monet AI, a conversational design assistant for a web-based graphic design editor.

You help users create, modify, and improve designs through natural conversation. You have access to the current design as JSON and optionally a screenshot.

RESPONSE FORMAT — you MUST respond with a JSON object:
{
  "reply": "Your conversational response (displayed in the chat)",
  "action": "none"
}

ACTIONS — set "action" based on what the user asked:

1. MODIFY the current design (change colors, add elements, move things):
   {"reply": "...", "action": "modify", "design": { ...full modified DesignDocument... }}

2. CREATE MULTIPLE designs (batch generate):
   {"reply": "...", "action": "batch", "designs": [{"label": "Name", "document": {...}}, ...]}

3. RECREATE a design from an image:
   {"reply": "...", "action": "modify", "design": { ...new DesignDocument inspired by the image... }}

4. FEEDBACK, suggestions, questions, or conversation:
   {"reply": "Your detailed response here", "action": "none"}

5. TEXT SUGGESTIONS for a specific text element:
   {"reply": "Here are 3 alternatives:", "action": "suggest_copy", "suggestions": ["option 1", "option 2", "option 3"]}

DESIGN FORMAT — when creating/modifying designs:
{
  "version": 1, "id": "", "name": "Design Name",
  "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z",
  "dimensions": { "width": 1080, "height": 1080 },
  "background": { "type": "solid", "value": "#hexcolor" },
  "objects": [ ...recipe objects... ],
  "metadata": { "tags": [] }
}

Object types: rect (with rx/ry for rounded), circle (with radius), textbox (with text/fontFamily/fontSize/fontWeight/fill/textAlign), triangle, line.
Available fonts: Inter, Roboto, Montserrat, Poppins, Playfair Display, Merriweather, Lora, Bebas Neue, Oswald, Anton, DM Sans.
Coordinates: origin top-left, X right, Y down. Colors as hex or rgba.
Background: solid (#hex) or gradient (linear:to-bottom:#c1:#c2, linear:to-bottom-right:#c1:#c2).
${RECIPE_FORMAT_DOCS}

ALWAYS output valid JSON. No markdown fences. The "reply" field is shown to the user as chat text — be helpful, specific, and friendly.`;

export interface ChatResponse {
  reply: string;
  action: 'none' | 'modify' | 'batch' | 'suggest_copy';
  design?: import('@monet/shared').DesignDocument;
  designs?: Array<{ label: string; document: import('@monet/shared').DesignDocument }>;
  suggestions?: string[];
  inputTokens: number;
  outputTokens: number;
  /** Raw JSON response string for preserving structured context in chat history */
  rawResponse?: string;
}

/**
 * Send a message in the conversational chat.
 * Supports streaming via onDelta callback.
 */
export async function chatWithClaude(
  history: ChatMessage[],
  currentDoc: import('@monet/shared').DesignDocument | null,
  userMessage: string,
  userImage?: string,
  onDelta?: (text: string) => void,
): Promise<ChatResponse> {
  const apiMessages: Array<{ role: string; content: string | Array<{ type: string; [key: string]: unknown }> }> = [];

  // Include recent conversation history (last 10 messages)
  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === 'user') {
      apiMessages.push({ role: 'user', content: msg.text });
    } else {
      // Use raw JSON response if available to preserve structured context for follow-ups
      apiMessages.push({ role: 'assistant', content: msg.rawResponse || msg.text });
    }
  }

  // Build current user message with context
  const contextParts: string[] = [];
  if (currentDoc) {
    contextParts.push(`[Current design JSON]\n${JSON.stringify(currentDoc)}`);
  }
  contextParts.push(userMessage);

  if (userImage) {
    const base64 = userImage.replace(/^data:image\/\w+;base64,/, '');
    const mediaType = userImage.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
    apiMessages.push({
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: contextParts.join('\n\n') },
      ],
    });
  } else {
    apiMessages.push({ role: 'user', content: contextParts.join('\n\n') });
  }

  const { text: response, inputTokens, outputTokens } = await callClaudeStream(
    CHAT_SYSTEM, apiMessages, 16384, onDelta,
  );

  // Parse the JSON response
  let cleaned = response.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const parsed = JSON.parse(cleaned);
    const result: ChatResponse = {
      reply: String(parsed.reply || parsed.message || ''),
      action: parsed.action || 'none',
      inputTokens,
      outputTokens,
      rawResponse: cleaned,
    };

    if (parsed.action === 'modify' && parsed.design) {
      result.design = normalizeDoc(parsed.design);
    }
    if (parsed.action === 'batch' && Array.isArray(parsed.designs)) {
      result.designs = parsed.designs.map((d: { label?: string; document?: unknown }) => ({
        label: String(d.label || 'Design'),
        document: normalizeDoc(d.document),
      }));
    }
    if (parsed.action === 'suggest_copy' && Array.isArray(parsed.suggestions)) {
      result.suggestions = parsed.suggestions.map(String);
    }

    return result;
  } catch {
    return { reply: cleaned, action: 'none', inputTokens, outputTokens };
  }
}

/** Normalize a design document from Claude's response */
function normalizeDoc(doc: unknown): import('@monet/shared').DesignDocument {
  const d = (doc || {}) as Record<string, unknown>;
  const now = new Date().toISOString();
  const objects = Array.isArray(d.objects) ? d.objects as Record<string, unknown>[] : [];
  // Preserve pages if Claude returned them, otherwise wrap objects into a single page
  const pages = Array.isArray(d.pages)
    ? (d.pages as Array<Record<string, unknown>>).map((p, i) => ({
        id: String(p.id || ''),
        name: String(p.name || `Page ${i + 1}`),
        objects: Array.isArray(p.objects) ? p.objects as Record<string, unknown>[] : [],
      }))
    : [{ id: '', name: 'Page 1', objects }];
  return {
    version: 1,
    id: '',
    name: String(d.name || 'AI Design'),
    createdAt: now,
    updatedAt: now,
    dimensions: (d.dimensions as { width: number; height: number }) || { width: 1080, height: 1080 },
    background: (d.background as { type: 'solid' | 'gradient' | 'image'; value: string }) || { type: 'solid', value: '#ffffff' },
    objects: [],
    pages,
    metadata: { tags: [] },
  };
}

export { formatUsage };
