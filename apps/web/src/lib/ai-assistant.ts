/**
 * AI Design Assistant — Claude-powered design feedback, copy suggestions,
 * and translation using the user's stored API key (BYOK).
 *
 * Three features:
 * 1. Design Feedback — sends a screenshot to Claude Vision for layout/color/typography critique
 * 2. Suggest Copy — sends design context to generate alternative text for selected textbox
 * 3. Translate Design — reads all text, translates to target language, replaces in-place
 *
 * Uses the same localStorage key as ai-generate.ts ('monet-anthropic-key').
 */

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const STORAGE_KEY = 'monet-anthropic-key';

function getApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

/** Check if the user has connected their Claude account */
export function isAIAssistantAvailable(): boolean {
  return !!getApiKey();
}

/** Common fetch wrapper for Anthropic API */
async function callClaude(
  system: string,
  messages: Array<{ role: string; content: string | Array<{ type: string; [key: string]: unknown }> }>,
  maxTokens: number = 2048,
): Promise<string> {
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
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401) throw new Error('Invalid API key. Check your Claude connection.');
    throw new Error(`API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text;
  if (!text) throw new Error('No response from Claude.');
  return text;
}

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
 * @param imageDataUrl - PNG data URL from getArtboardDataURL()
 * @returns Markdown-formatted feedback string
 */
export async function getDesignFeedback(imageDataUrl: string): Promise<string> {
  // Strip the data URL prefix to get raw base64
  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');

  return callClaude(FEEDBACK_SYSTEM, [
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
  ]);
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
- Consider the design format (Instagram = punchy, Presentation = clear, etc.)`;

/**
 * Get 3 copy suggestions for a selected text element.
 * @param currentText - The text currently in the textbox
 * @param designContext - Info about the design (dimensions, colors, all text)
 * @returns Array of 3 alternative text strings
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

  // Parse JSON array from response
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
    // If parsing fails, try to extract quoted strings
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
 * @param texts - Array of text strings to translate
 * @param targetLanguage - Target language name (e.g. "Spanish")
 * @returns Array of translated strings in the same order
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

// ─── 4. Smart Edit (Natural Language Instructions) ────────────────

const SMART_EDIT_SYSTEM = `You are a graphic design assistant that modifies designs based on natural language instructions.

You will receive a DesignDocument JSON and an instruction. Apply the instruction and return the MODIFIED DesignDocument JSON.

Rules:
- Output ONLY the complete modified JSON. No explanation, no markdown.
- Preserve all existing objects unless the instruction says to remove them.
- Keep the same structure (version, id, name, dimensions, etc).
- When adding objects, use the "recipe" format: { type, left, top, width, height, fill, ... }
- Supported types: rect, circle, textbox, triangle, line
- Available fonts: Inter, Roboto, Open Sans, Montserrat, Lato, Poppins, Playfair Display, Merriweather, Lora, Bebas Neue, Oswald, Anton
- Coordinates: origin at top-left, X right, Y down
- Colors: hex (#ffffff) or rgba (rgba(0,0,0,0.5))
- For "button" shapes: rect with rx/ry for rounded corners + centered textbox on top
- Apply changes precisely: if asked to change colors, change fill/stroke/text colors. If asked to add something, add to the objects array. If asked to move, update left/top.`;

/**
 * Apply a natural language instruction to the current design.
 * @param doc - Current DesignDocument JSON
 * @param instruction - Natural language instruction like "add a red button at the bottom"
 * @returns Modified DesignDocument
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

  const result = JSON.parse(cleaned);

  // Validate basic structure
  if (!result?.dimensions || !Array.isArray(result?.objects)) {
    throw new Error('Invalid design returned by AI.');
  }

  // Preserve original metadata
  result.version = 1;
  result.id = doc.id;
  result.updatedAt = new Date().toISOString();

  return result as import('@monet/shared').DesignDocument;
}

// ─── 5. Extract Brand from Image ─────────────────────────────────

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

/** Result from brand extraction */
export interface ExtractedBrand {
  name: string;
  colors: string[];
  fonts: { heading: string; subheading: string; body: string };
  aesthetic: string;
}

/**
 * Extract brand identity from an uploaded image.
 * @param imageDataUrl - Data URL of the uploaded image
 * @returns Extracted brand information
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
- Available fonts: Inter, Roboto, Montserrat, Poppins, Playfair Display, Merriweather, Lora, Bebas Neue, Oswald, Anton
- Use hex colors. Keep text readable (good contrast).

Output ONLY the JSON array.`;

/** A design variation returned by Claude */
export interface DesignVariation {
  label: string;
  description: string;
  document: import('@monet/shared').DesignDocument;
}

/**
 * Generate 3 design variations from the current design.
 * @param doc - Current DesignDocument
 * @returns Array of 3 variations
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

/** A message in the AI chat conversation */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** User-uploaded image (data URL) */
  image?: string;
  /** Design documents generated by the assistant */
  designs?: Array<{ label: string; document: import('@monet/shared').DesignDocument; thumbnail?: string }>;
  /** Copy suggestions for a selected textbox */
  copySuggestions?: string[];
}

const CHAT_SYSTEM = `You are Monet AI, a conversational design assistant for a web-based graphic design editor.

You help users create, modify, and improve designs through natural conversation. You have access to the current design as JSON and optionally a screenshot.

RESPONSE FORMAT — you MUST respond with a JSON object:
{
  "reply": "Your conversational response (displayed in the chat)",
  "action": "none",
}

ACTIONS — set "action" based on what the user asked:

1. If the user asks you to MODIFY the current design (change colors, add elements, move things):
   {"reply": "...", "action": "modify", "design": { ...full modified DesignDocument... }}

2. If the user asks you to CREATE MULTIPLE designs (batch generate):
   {"reply": "...", "action": "batch", "designs": [{"label": "Name", "document": {...}}, ...]}

3. If the user asks to RECREATE a design from an image:
   {"reply": "...", "action": "modify", "design": { ...new DesignDocument inspired by the image... }}

4. For FEEDBACK, suggestions, questions, or conversation:
   {"reply": "Your detailed response here", "action": "none"}

5. If the user asks for TEXT SUGGESTIONS for a specific text element:
   {"reply": "Here are 3 alternatives:", "action": "suggest_copy", "suggestions": ["option 1", "option 2", "option 3"]}

DESIGN FORMAT — when creating/modifying designs, use this DesignDocument schema:
{
  "version": 1, "id": "", "name": "Design Name",
  "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z",
  "dimensions": { "width": 1080, "height": 1080 },
  "background": { "type": "solid", "value": "#hexcolor" },
  "objects": [ ...recipe objects... ],
  "metadata": { "tags": [] }
}

Object types: rect (with rx/ry for rounded), circle (with radius), textbox (with text/fontFamily/fontSize/fontWeight/fill/textAlign), triangle, line.
Available fonts: Inter, Roboto, Montserrat, Poppins, Playfair Display, Merriweather, Lora, Bebas Neue, Oswald, Anton.
Coordinates: origin top-left, X right, Y down. Colors as hex or rgba.
Background: solid (#hex) or gradient (linear:to-bottom:#c1:#c2).

ALWAYS output valid JSON. No markdown fences. The "reply" field is shown to the user as chat text — be helpful, specific, and friendly.`;

/** Parsed response from the chat API */
export interface ChatResponse {
  reply: string;
  action: 'none' | 'modify' | 'batch' | 'suggest_copy';
  design?: import('@monet/shared').DesignDocument;
  designs?: Array<{ label: string; document: import('@monet/shared').DesignDocument }>;
  suggestions?: string[];
}

/**
 * Send a message in the conversational chat.
 * Includes conversation history, current design, and optionally an image.
 */
export async function chatWithClaude(
  history: ChatMessage[],
  currentDoc: import('@monet/shared').DesignDocument | null,
  userMessage: string,
  userImage?: string,
): Promise<ChatResponse> {
  // Build the messages array for the API
  const apiMessages: Array<{ role: string; content: string | Array<{ type: string; [key: string]: unknown }> }> = [];

  // Include recent conversation history (last 10 messages to stay within context)
  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === 'user') {
      apiMessages.push({ role: 'user', content: msg.text });
    } else {
      apiMessages.push({ role: 'assistant', content: msg.text });
    }
  }

  // Build the current user message with context
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

  const response = await callClaude(CHAT_SYSTEM, apiMessages, 16384);

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
    // If JSON parsing fails, treat as plain text reply
    return { reply: cleaned, action: 'none' };
  }
}

/** Normalize a design document from Claude's response */
function normalizeDoc(doc: unknown): import('@monet/shared').DesignDocument {
  const d = (doc || {}) as Record<string, unknown>;
  const now = new Date().toISOString();
  return {
    version: 1,
    id: '',
    name: String(d.name || 'AI Design'),
    createdAt: now,
    updatedAt: now,
    dimensions: (d.dimensions as { width: number; height: number }) || { width: 1080, height: 1080 },
    background: (d.background as { type: 'solid' | 'gradient' | 'image'; value: string }) || { type: 'solid', value: '#ffffff' },
    objects: Array.isArray(d.objects) ? d.objects as Record<string, unknown>[] : [],
    metadata: { tags: [] },
  };
}
