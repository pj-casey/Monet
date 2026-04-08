/**
 * AI Template Generator — uses the Anthropic API to generate designs
 * from natural language descriptions.
 *
 * Calls Claude (claude-sonnet-4-20250514) to produce a valid DesignDocument JSON
 * matching our template recipe format. The generated design is loaded
 * onto the canvas via fromJSON().
 *
 * "Bring Your Own Key" model — each user connects their own Anthropic
 * account by pasting their API key. The key is stored in localStorage
 * (never sent to any server, only to api.anthropic.com directly).
 */

import type { DesignDocument } from '@monet/shared';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const STORAGE_KEY = 'monet-anthropic-key';

/** Check if the user has saved an API key */
export function isAIConfigured(): boolean {
  return !!getApiKey();
}

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
 * The system prompt that instructs Claude to generate a valid DesignDocument.
 * Includes the schema, available object types, and design guidelines.
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
{ "type": "rect", "left": 100, "top": 100, "width": 400, "height": 200, "fill": "#ff0000", "stroke": "", "strokeWidth": 0, "rx": 0, "ry": 0 }
rx/ry = corner radius for rounded corners.

2. Circle:
{ "type": "circle", "left": 100, "top": 100, "radius": 50, "fill": "#00ff00" }

3. Textbox:
{ "type": "textbox", "left": 100, "top": 100, "width": 500, "text": "Hello World", "fontFamily": "Inter", "fontSize": 48, "fontWeight": "bold", "fill": "#ffffff", "textAlign": "center", "lineHeight": 1.4 }

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

DESIGN GUIDELINES:
- Create professional, visually appealing designs
- Use appropriate font sizes: headings 60-120px, subheadings 28-48px, body 16-28px
- Use proper visual hierarchy — largest/boldest text for the main message
- Leave breathing room — don't fill every pixel
- Use 2-4 colors max for a cohesive palette
- Layer objects: backgrounds first, then decorative shapes, then text on top
- Objects in the array render in order — first = bottom, last = top
- Make text readable: ensure contrast between text color and background
- Use rgba for semi-transparent fills: "rgba(255,255,255,0.2)"
- For buttons: a rounded rect (rx/ry: 25-30) with text centered inside

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
 *
 * @param description - Natural language description of the desired design
 * @returns A validated DesignDocument ready to load via fromJSON()
 * @throws Error if API call fails or response isn't valid JSON
 */
export async function generateDesign(description: string): Promise<DesignDocument> {
  const key = getApiKey();
  if (!key) {
    throw new Error('Anthropic API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file.');
  }

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
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a design for: ${description}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();

  // Extract text content from the response
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
  if (!textBlock?.text) {
    throw new Error('No text content in API response');
  }

  // Parse the JSON — the model may include markdown fences despite instructions
  let jsonStr = textBlock.text.trim();
  // Strip markdown code fences if present
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  let doc: DesignDocument;
  try {
    doc = JSON.parse(jsonStr);
  } catch {
    throw new Error('AI response was not valid JSON. Please try again.');
  }

  // Validate required fields
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

  // Ensure required fields exist
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

  // Fill in defaults for missing fields
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
