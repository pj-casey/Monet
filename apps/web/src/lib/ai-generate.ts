/**
 * AI Template Generator — uses the Anthropic API to generate designs
 * from natural language descriptions.
 *
 * Calls Claude (claude-sonnet-4-20250514) with streaming to produce a valid
 * DesignDocument JSON matching our template recipe format, including
 * advanced features: gradient fills, shadows, charSpacing, opacity layers.
 *
 * "Bring Your Own Key" model — each user connects their own Anthropic
 * account by pasting their API key. The key is stored in localStorage
 * (never sent to any server, only to api.anthropic.com directly).
 */

import type { DesignDocument } from '@monet/shared';
import { callClaudeStream, isAIConfigured } from './ai-assistant';

// Re-export for backward compatibility
export { isAIConfigured };

const STORAGE_KEY = 'monet-anthropic-key';

/** Get the stored API key from localStorage */
function getApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

/** Save the user's API key to localStorage */
export function saveApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
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

/**
 * System prompt that instructs Claude to generate a valid DesignDocument.
 * Includes schema, object types, advanced features, and example templates.
 */
const SYSTEM_PROMPT = `You are a graphic design AI that generates design templates as JSON.

You must output ONLY a valid JSON object — no markdown, no explanation, no code fences.
The JSON must match this exact schema:

{
  "version": 1,
  "id": "",
  "name": "Design Name",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z",
  "dimensions": { "width": 1080, "height": 1080 },
  "background": { "type": "solid", "value": "#1a1a2e" },
  "objects": [ ... ],
  "metadata": { "tags": ["tag1", "tag2"] }
}

DIMENSIONS — common sizes:
- Instagram post: 1080x1080
- Instagram story: 1080x1920
- Facebook post: 1200x630
- YouTube thumbnail: 1280x720
- Presentation slide: 1920x1080
- Business card: 1050x600
- Poster/flyer: 1080x1440
- Twitter/X header: 1500x500

BACKGROUND types:
- Solid: { "type": "solid", "value": "#hexcolor" }
- Gradient: { "type": "gradient", "value": "linear:to-bottom:#color1:#color2" }
  Directions: to-bottom, to-right, to-bottom-right

OBJECT TYPES in the "objects" array:

1. Rectangle:
{ "type": "rect", "left": 100, "top": 100, "width": 400, "height": 200, "fill": "#ff0000", "rx": 0, "ry": 0 }
rx/ry = corner radius for rounded corners.

2. Circle:
{ "type": "circle", "left": 100, "top": 100, "radius": 50, "fill": "#00ff00" }

3. Textbox:
{ "type": "textbox", "left": 100, "top": 100, "width": 500, "text": "Hello World", "fontFamily": "Montserrat", "fontSize": 48, "fontWeight": "bold", "fill": "#ffffff", "textAlign": "center", "lineHeight": 1.4 }

4. Triangle:
{ "type": "triangle", "left": 100, "top": 100, "width": 100, "height": 100, "fill": "#0000ff" }

5. Line:
{ "type": "line", "x1": 0, "y1": 0, "x2": 200, "y2": 0, "stroke": "#ffffff", "strokeWidth": 2, "left": 100, "top": 100 }

COORDINATES: Origin is top-left (0,0). X increases rightward, Y increases downward.
Objects are positioned by their top-left corner (left, top).

AVAILABLE FONTS (use only these):
Sans-serif: Inter, Roboto, Open Sans, Montserrat, Lato, Poppins, Nunito, Raleway, Work Sans, DM Sans
Serif: Playfair Display, Merriweather, Lora, PT Serif, Libre Baskerville
Display: Bebas Neue, Oswald, Anton, Pacifico, Lobster
Monospace: Fira Code, JetBrains Mono, Source Code Pro

ADVANCED FEATURES — you MUST use these for professional-quality output:

GRADIENT FILLS — use instead of plain colors on accent shapes, CTA buttons, and decorative elements:
  Linear: "fill": { "type": "linear", "coords": { "x1": 0, "y1": 0, "x2": WIDTH, "y2": 0 }, "colorStops": [{ "offset": 0, "color": "#C4704A" }, { "offset": 1, "color": "#e8956d" }] }
  Vertical gradient: set x2=0, y2=HEIGHT. Diagonal: x2=WIDTH, y2=HEIGHT.
  Radial: "fill": { "type": "radial", "coords": { "x1": CX, "y1": CY, "x2": CX, "y2": CY, "r1": 0, "r2": RADIUS }, "colorStops": [...] }
  Coords are in the object's own coordinate space (relative to its width/height).

DROP SHADOWS — add depth to headings and key shapes:
  "shadow": { "color": "rgba(0,0,0,0.3)", "blur": 12, "offsetX": 0, "offsetY": 4 }
  Glow effect: { "color": "rgba(196,112,74,0.5)", "blur": 20, "offsetX": 0, "offsetY": 0 }

TEXT EFFECTS:
  "charSpacing": 200     — letter spacing in 1/1000 em (100-400 for headings, 200-600 for ALL-CAPS labels)
  "lineHeight": 1.3      — line height multiplier
  "stroke": "#ffffff", "strokeWidth": 2  — text outline for contrast
  "fontStyle": "italic"

DECORATIVE OPACITY:
  "opacity": 0.15  — semi-transparent shapes for layered background depth

STROKE PATTERNS:
  "strokeDashArray": [10, 5]  — dashed borders

MANDATORY DESIGN RULES:
1. ALWAYS include at least ONE gradient fill (on an accent bar, CTA button, or decorative shape)
2. ALWAYS add a shadow to the main heading text
3. Use charSpacing (50-400) on ALL heading text
4. Add 2-3 decorative shapes with low opacity (0.08-0.25) behind content
5. Use REAL content — actual names, dates, prices, addresses. NEVER use "Lorem Ipsum", "Your Title Here", "[Insert text]", or generic placeholder text
6. Layer objects: background shapes first, then decorative, then text on top
7. Use 2-4 colors max for a cohesive palette
8. Leave breathing room — don't fill every pixel
9. Ensure text contrast: light text on dark backgrounds, dark text on light

EXAMPLE — Instagram Sale Story (1080×1920):
{
  "version": 1, "id": "", "name": "Summer Sale",
  "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z",
  "dimensions": { "width": 1080, "height": 1920 },
  "background": { "type": "gradient", "value": "linear:to-bottom-right:#C4704A:#e76f51" },
  "objects": [
    { "type": "circle", "left": -60, "top": 100, "radius": 200, "fill": "rgba(255,255,255,0.08)" },
    { "type": "circle", "left": 800, "top": 1400, "radius": 260, "fill": "rgba(255,255,255,0.06)" },
    { "type": "textbox", "left": 100, "top": 520, "width": 880, "text": "SUMMER COLLECTION", "fontFamily": "Montserrat", "fontSize": 28, "fontWeight": "bold", "fill": "rgba(255,255,255,0.85)", "textAlign": "center", "charSpacing": 400 },
    { "type": "textbox", "left": 100, "top": 620, "width": 880, "text": "40% OFF", "fontFamily": "Montserrat", "fontSize": 140, "fontWeight": "bold", "fill": "#ffffff", "textAlign": "center", "charSpacing": 100, "shadow": { "color": "rgba(0,0,0,0.5)", "blur": 16, "offsetX": 0, "offsetY": 4 } },
    { "type": "textbox", "left": 100, "top": 820, "width": 880, "text": "USE CODE: SUN40", "fontFamily": "DM Sans", "fontSize": 26, "fill": "rgba(255,255,255,0.75)", "textAlign": "center", "charSpacing": 200 },
    { "type": "rect", "left": 340, "top": 960, "width": 400, "height": 64, "fill": { "type": "linear", "coords": { "x1": 0, "y1": 0, "x2": 400, "y2": 0 }, "colorStops": [{ "offset": 0, "color": "#ffffff" }, { "offset": 1, "color": "#f0e6df" }] }, "rx": 32, "ry": 32 },
    { "type": "textbox", "left": 340, "top": 975, "width": 400, "text": "Shop Now", "fontFamily": "Montserrat", "fontSize": 22, "fontWeight": "bold", "fill": "#C4704A", "textAlign": "center" }
  ],
  "metadata": { "tags": ["sale", "summer", "fashion"] }
}

EXAMPLE — Dark Tech Product Card (1080×1080):
{
  "version": 1, "id": "", "name": "AuraSound Launch",
  "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-01T00:00:00Z",
  "dimensions": { "width": 1080, "height": 1080 },
  "background": { "type": "gradient", "value": "linear:to-bottom:#1a1a2e:#0a0a14" },
  "objects": [
    { "type": "circle", "left": 340, "top": 120, "radius": 200, "fill": "rgba(196,112,74,0.12)" },
    { "type": "circle", "left": 420, "top": 200, "radius": 140, "fill": "rgba(196,112,74,0.06)" },
    { "type": "textbox", "left": 100, "top": 100, "width": 880, "text": "INTRODUCING", "fontFamily": "Montserrat", "fontSize": 22, "fontWeight": "bold", "fill": "#C4704A", "textAlign": "center", "charSpacing": 600 },
    { "type": "textbox", "left": 100, "top": 480, "width": 880, "text": "AuraSound", "fontFamily": "Playfair Display", "fontSize": 80, "fill": "#ffffff", "textAlign": "center", "shadow": { "color": "rgba(0,0,0,0.5)", "blur": 16, "offsetX": 0, "offsetY": 4 } },
    { "type": "textbox", "left": 100, "top": 600, "width": 880, "text": "Immersive spatial audio for the way you listen.", "fontFamily": "DM Sans", "fontSize": 24, "fill": "rgba(255,255,255,0.6)", "textAlign": "center" },
    { "type": "rect", "left": 440, "top": 690, "width": 200, "height": 2, "fill": { "type": "linear", "coords": { "x1": 0, "y1": 0, "x2": 200, "y2": 0 }, "colorStops": [{ "offset": 0, "color": "rgba(196,112,74,0.1)" }, { "offset": 0.5, "color": "#C4704A" }, { "offset": 1, "color": "rgba(196,112,74,0.1)" }] } },
    { "type": "rect", "left": 340, "top": 800, "width": 400, "height": 64, "fill": { "type": "linear", "coords": { "x1": 0, "y1": 0, "x2": 400, "y2": 0 }, "colorStops": [{ "offset": 0, "color": "#C4704A" }, { "offset": 1, "color": "#e8956d" }] }, "rx": 32, "ry": 32 },
    { "type": "textbox", "left": 340, "top": 815, "width": 400, "text": "Pre-order · $199", "fontFamily": "Montserrat", "fontSize": 22, "fontWeight": "bold", "fill": "#ffffff", "textAlign": "center" }
  ],
  "metadata": { "tags": ["product", "tech", "launch"] }
}

OUTPUT ONLY THE JSON OBJECT. No other text.`;

/** Quick-select example descriptions shown as chips */
export const EXAMPLE_PROMPTS = [
  'Instagram post announcing a summer sale with bold red and white',
  'YouTube thumbnail for a cooking tutorial, warm colors',
  'Modern business card, dark theme with gold accents',
  'Motivational quote poster with gradient background',
  'Birthday party invitation, fun and colorful',
  'Product launch announcement, sleek and minimal',
  'Social media post for a coffee shop opening',
  'Event flyer for a music festival, vibrant neon colors',
];

/**
 * Generate a design from a text description using the Anthropic API.
 * Uses streaming internally to collect the JSON response.
 *
 * @param description - Natural language description of the desired design
 * @returns A validated DesignDocument ready to load via fromJSON()
 * @throws Error if API call fails or response isn't valid JSON
 */
export async function generateDesign(description: string): Promise<DesignDocument> {
  const key = getApiKey();
  if (!key) {
    throw new Error('Anthropic API key not configured. Add your API key in the AI panel.');
  }

  const { text: response } = await callClaudeStream(
    SYSTEM_PROMPT,
    [
      {
        role: 'user',
        content: `Generate a design for: ${description}`,
      },
    ],
    4096,
  );

  // Parse the JSON — the model may include markdown fences despite instructions
  let jsonStr = response.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  let doc: DesignDocument;
  try {
    doc = JSON.parse(jsonStr);
  } catch {
    throw new Error('AI response was not valid JSON. Please try again.');
  }

  return validateDesignDocument(doc);
}

/**
 * Validate that the parsed JSON has the required DesignDocument structure.
 * Fills in missing optional fields with defaults.
 */
function validateDesignDocument(doc: unknown): DesignDocument {
  if (!doc || typeof doc !== 'object') {
    throw new Error('AI response is not an object');
  }

  const d = doc as Record<string, unknown>;

  if (!d.dimensions || typeof d.dimensions !== 'object') {
    throw new Error('Missing dimensions in AI response');
  }
  const dims = d.dimensions as Record<string, unknown>;
  if (typeof dims.width !== 'number' || typeof dims.height !== 'number') {
    throw new Error('Invalid dimensions in AI response');
  }

  if (!Array.isArray(d.objects)) {
    throw new Error('Missing objects array in AI response');
  }

  const now = new Date().toISOString();
  const result: DesignDocument = {
    version: 1,
    id: '',
    name: typeof d.name === 'string' ? d.name : 'AI Generated Design',
    createdAt: now,
    updatedAt: now,
    dimensions: {
      width: dims.width as number,
      height: dims.height as number,
    },
    background: validateBackground(d.background),
    objects: d.objects as Record<string, unknown>[],
    metadata: {
      tags: Array.isArray((d.metadata as Record<string, unknown>)?.tags)
        ? (d.metadata as Record<string, unknown>).tags as string[]
        : [],
    },
  };

  return result;
}

function validateBackground(bg: unknown): { type: 'solid' | 'gradient' | 'image'; value: string } {
  if (!bg || typeof bg !== 'object') {
    return { type: 'solid', value: '#ffffff' };
  }
  const b = bg as Record<string, unknown>;
  const type = b.type as string;
  if (type === 'solid' || type === 'gradient' || type === 'image') {
    return { type, value: typeof b.value === 'string' ? b.value : '#ffffff' };
  }
  return { type: 'solid', value: '#ffffff' };
}
