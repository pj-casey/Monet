/**
 * Template Registry — 51 built-in templates.
 *
 * Organized into 8 categories:
 * - Social Media (10): Podcast, Instagram, YouTube, LinkedIn, Twitter, Pinterest, TikTok, Facebook, Discord
 * - Business (9): Business Card, Invoice, One-Pager, Email Signature, Proposal, Certificate, Meeting Notes, Name Badge, Resume
 * - Marketing (7): Product Launch, Real Estate, Coupon, Testimonial, Newsletter, App Promo
 * - Events (7): Wedding, Birthday, Concert, Conference, Gala, Music Festival
 * - Education (3): Workshop, Flashcard, Study Guide
 * - Creative (6): Book Cover, Movie Poster, Magazine Cover, Exhibition, Portfolio, Album Cover
 * - Food & Lifestyle (6): Restaurant Menu, Café Menu, Recipe Card, Cocktail Card, Fitness Plan, Wellness
 * - Seasonal (4): Valentine, Halloween, Holiday Card, New Year
 *
 * Design quality standards (Session 75 rebuild):
 * - Each template has a unique visual personality (no formulaic repetition)
 * - Minimum 15 objects per template; category-appropriate color palettes
 * - Uses diverse shape types: hearts, stars, diamonds, hexagons, pentagons, arrows
 * - Gradient-filled image placeholders (never "YOUR PHOTO" text)
 * - Varied shadow styles, rotated decorative elements, realistic content
 * - Approved fonts only: DM Sans, Montserrat, Playfair Display, Bebas Neue, Oswald,
 *   Pacifico, Lobster, Lora, Fraunces, Poppins, Raleway, Work Sans, and others
 */

import type { Template } from './types';

// ─── Helper to reduce boilerplate ───────────────────────────────────

const TS = '2026-01-01T00:00:00Z';

function tpl(
  id: string,
  name: string,
  description: string,
  category: string,
  subcategory: string,
  tags: string[],
  w: number,
  h: number,
  bgType: 'solid' | 'gradient',
  bgValue: string,
  objects: Record<string, unknown>[],
): Template {
  return {
    templateId: id, name, description, category, subcategory, tags,
    dimensions: { width: w, height: h }, thumbnail: '',
    document: {
      version: 1, id: `tpl-${id}`, name,
      createdAt: TS, updatedAt: TS,
      dimensions: { width: w, height: h },
      background: { type: bgType, value: bgValue },
      objects,
      metadata: { templateId: id, tags },
    },
  };
}

// =====================================================================
//  TEMPLATE REGISTRY
// =====================================================================

export const TEMPLATE_REGISTRY: Template[] = [


  // ─── BATCH 1: Social Media + Business (1-17) ─────────────────────

// Batch 1: Social Media + Business (templates 1-17)
// Paste these entries into the TEMPLATE_REGISTRY array in registry.ts.
// Requires the tpl() helper defined at the top of that file.

  // ─── SOCIAL MEDIA — PODCAST / QUOTES / STORIES / THUMBNAILS ──────

  // 1. Podcast Cover — dark gradient spotlight, waveform, EP pill, platform icons
  tpl('podcast-cover', 'The Night Owl Show', 'Podcast cover with spotlight gradient and audio waveform',
    'Social Media', 'Podcast', ['podcast', 'cover', 'audio', 'show', 'waveform'],
    1080, 1080, 'gradient', 'linear:to-bottom:#1a0a2e:#0a0a1a', [
      // Halftone texture — scattered tiny circles
      { type: 'circle', left: 120, top: 100, radius: 4, fill: 'rgba(255,255,255,0.05)' },
      { type: 'circle', left: 340, top: 180, radius: 3, fill: 'rgba(255,255,255,0.04)' },
      { type: 'circle', left: 780, top: 140, radius: 5, fill: 'rgba(255,255,255,0.04)' },
      { type: 'circle', left: 920, top: 300, radius: 3, fill: 'rgba(255,255,255,0.05)' },
      { type: 'circle', left: 200, top: 900, radius: 4, fill: 'rgba(255,255,255,0.04)' },
      { type: 'circle', left: 600, top: 950, radius: 3, fill: 'rgba(255,255,255,0.06)' },
      { type: 'circle', left: 850, top: 850, radius: 4, fill: 'rgba(255,255,255,0.04)' },
      // EP pill badge — top right with accent stroke
      { type: 'rect', left: 820, top: 50, width: 180, height: 40, fill: 'rgba(0,0,0,0.5)', rx: 20, ry: 20, stroke: '#d4a853', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 820, top: 57, width: 180, text: 'EP. 142', fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 200 },
      // Title — above waveform
      { type: 'textbox', left: 80, top: 300, width: 920, text: 'THE NIGHT OWL SHOW', fontFamily: 'Montserrat', fontSize: 48, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(212,168,83,0.3)', blur: 16, offsetX: 0, offsetY: 0 } },
      // Audio waveform — 18 rounded-rect bars, centered vertically
      { type: 'rect', left: 120, top: 470, width: 12, height: 28, fill: '#d4a853', rx: 6, ry: 6 },
      { type: 'rect', left: 142, top: 445, width: 12, height: 55, fill: '#e8956d', rx: 6, ry: 6 },
      { type: 'rect', left: 164, top: 455, width: 12, height: 40, fill: '#d4a853', rx: 6, ry: 6 },
      { type: 'rect', left: 186, top: 425, width: 12, height: 75, fill: '#e8956d', rx: 6, ry: 6 },
      { type: 'rect', left: 208, top: 440, width: 12, height: 55, fill: '#d4a853', rx: 6, ry: 6 },
      { type: 'rect', left: 230, top: 420, width: 12, height: 80, fill: '#e8956d', rx: 6, ry: 6 },
      { type: 'rect', left: 252, top: 435, width: 12, height: 65, fill: '#d4a853', rx: 6, ry: 6 },
      { type: 'rect', left: 274, top: 410, width: 12, height: 80, fill: '#e8956d', rx: 6, ry: 6 },
      { type: 'rect', left: 296, top: 430, width: 12, height: 70, fill: '#d4a853', rx: 6, ry: 6 },
      { type: 'rect', left: 318, top: 415, width: 12, height: 80, fill: '#e8956d', rx: 6, ry: 6 },
      { type: 'rect', left: 340, top: 435, width: 12, height: 60, fill: '#d4a853', rx: 6, ry: 6 },
      { type: 'rect', left: 362, top: 420, width: 12, height: 75, fill: '#e8956d', rx: 6, ry: 6 },
      { type: 'rect', left: 384, top: 440, width: 12, height: 50, fill: '#d4a853', rx: 6, ry: 6 },
      { type: 'rect', left: 406, top: 425, width: 12, height: 70, fill: '#e8956d', rx: 6, ry: 6 },
      { type: 'rect', left: 428, top: 445, width: 12, height: 45, fill: '#d4a853', rx: 6, ry: 6 },
      { type: 'rect', left: 450, top: 430, width: 12, height: 65, fill: '#e8956d', rx: 6, ry: 6 },
      { type: 'rect', left: 472, top: 450, width: 12, height: 40, fill: '#d4a853', rx: 6, ry: 6 },
      { type: 'rect', left: 494, top: 460, width: 12, height: 30, fill: '#e8956d', rx: 6, ry: 6 },
      // Subtitle — below waveform
      { type: 'textbox', left: 80, top: 560, width: 920, text: 'with Marcus Rivera', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.5)', textAlign: 'center' },
      // Fading accent line
      { type: 'rect', left: 380, top: 620, width: 320, height: 1, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 320, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(212,168,83,0)' }, { offset: 0.5, color: '#d4a853' }, { offset: 1, color: 'rgba(212,168,83,0)' }] } },
      // "Available on all platforms" + platform circles
      { type: 'textbox', left: 280, top: 980, width: 520, text: 'Available on all platforms', fontFamily: 'DM Sans', fontSize: 12, fill: 'rgba(255,255,255,0.3)', textAlign: 'center' },
      { type: 'circle', left: 470, top: 1020, radius: 12, fill: 'rgba(212,168,83,0.15)' },
      { type: 'circle', left: 510, top: 1020, radius: 12, fill: 'rgba(212,168,83,0.15)' },
      { type: 'circle', left: 550, top: 1020, radius: 12, fill: 'rgba(212,168,83,0.15)' },
    ]),

  // 2. Instagram Quote — diamond dividers, botanical corner accents, dusty rose palette
  tpl('ig-quote-believe', 'She Believed She Could', 'Inspirational quote with peach gradient and botanical accents',
    'Social Media', 'Instagram Post', ['instagram', 'quote', 'inspirational', 'women'],
    1080, 1080, 'gradient', 'linear:to-bottom-right:#fcd5ce:#f8b4b4', [
      { type: 'textbox', left: 60, top: 120, width: 300, text: '\u201C', fontFamily: 'Playfair Display', fontSize: 280, fill: '#c2857a', textAlign: 'left', opacity: 0.2 },
      { type: 'textbox', left: 680, top: 120, width: 300, text: '\u201D', fontFamily: 'Playfair Display', fontSize: 280, fill: '#c2857a', textAlign: 'right', opacity: 0.2 },
      { type: 'textbox', left: 120, top: 340, width: 840, text: 'She believed she could,\nso she did.', fontFamily: 'Playfair Display', fontSize: 56, fontStyle: 'italic', fill: '#4a2c2a', textAlign: 'center', lineHeight: 1.5, charSpacing: 50, shadow: { color: 'rgba(194,133,122,0.15)', blur: 16, offsetX: 1, offsetY: 5 } },
      // Diamond divider replacing gradient accent line
      { type: 'diamond', left: 490, top: 630, width: 12, height: 18, fill: '#c2857a', opacity: 0.7 },
      { type: 'diamond', left: 525, top: 630, width: 16, height: 24, fill: '#b5838d' },
      { type: 'diamond', left: 560, top: 630, width: 12, height: 18, fill: '#c2857a', opacity: 0.7 },
      { type: 'textbox', left: 120, top: 680, width: 840, text: '\u2014 R.S. Grey', fontFamily: 'DM Sans', fontSize: 22, fill: '#7a5550', textAlign: 'center' },
      // Botanical corner accents — rotated diamonds suggesting leaves
      { type: 'diamond', left: 60, top: 60, width: 18, height: 28, fill: '#b5838d', opacity: 0.25, angle: 35 },
      { type: 'diamond', left: 90, top: 90, width: 14, height: 22, fill: '#c2857a', opacity: 0.18, angle: 55 },
      { type: 'diamond', left: 960, top: 60, width: 18, height: 28, fill: '#b5838d', opacity: 0.25, angle: -35 },
      { type: 'diamond', left: 930, top: 90, width: 14, height: 22, fill: '#c2857a', opacity: 0.18, angle: -55 },
      { type: 'diamond', left: 60, top: 960, width: 18, height: 28, fill: '#c2857a', opacity: 0.2, angle: -35 },
      { type: 'diamond', left: 960, top: 960, width: 18, height: 28, fill: '#c2857a', opacity: 0.2, angle: 35 },
      // Small star accents near attribution
      { type: 'star', left: 350, top: 680, width: 16, height: 16, fill: '#b5838d', opacity: 0.3, angle: 15 },
      { type: 'star', left: 710, top: 680, width: 14, height: 14, fill: '#b5838d', opacity: 0.25, angle: -10 },
    ]),

  // 3. Instagram Story Sale — star motifs, rotated rects, gold accents, glow shadow
  tpl('ig-story-sale', 'Summer Collection Sale', 'Story with bold sale text, star motifs, and CTA',
    'Social Media', 'Instagram Story', ['instagram', 'story', 'sale', 'summer', 'fashion'],
    1080, 1920, 'gradient', 'linear:to-bottom-right:#C4704A:#e76f51', [
      // Star replacing first circle
      { type: 'star', left: -30, top: 120, width: 320, height: 320, fill: 'rgba(255,255,255,0.08)', angle: 18 },
      // Diamond replacing second circle
      { type: 'diamond', left: 820, top: 1400, width: 260, height: 340, fill: 'rgba(255,255,255,0.06)', angle: 25 },
      // Large star behind 40% OFF
      { type: 'star', left: 340, top: 540, width: 400, height: 400, fill: 'rgba(255,255,255,0.07)', angle: 12 },
      // Rotated rects for dynamism
      { type: 'rect', left: 800, top: 300, width: 200, height: 200, fill: 'rgba(255,255,255,0.05)', angle: 20 },
      { type: 'rect', left: 100, top: 1200, width: 180, height: 180, fill: 'rgba(255,255,255,0.06)', angle: -15 },
      { type: 'rect', left: 700, top: 1600, width: 140, height: 140, fill: '#fbbf24', opacity: 0.08, angle: 30 },
      { type: 'textbox', left: 100, top: 520, width: 880, text: 'SUMMER COLLECTION', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: 'rgba(255,255,255,0.85)', textAlign: 'center', charSpacing: 400 },
      { type: 'textbox', left: 100, top: 620, width: 880, text: '40% OFF', fontFamily: 'Montserrat', fontSize: 140, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(255,255,255,0.3)', blur: 20, offsetX: 0, offsetY: 0 } },
      { type: 'textbox', left: 100, top: 820, width: 880, text: 'USE CODE: SUN40', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(255,255,255,0.75)', textAlign: 'center', charSpacing: 200 },
      { type: 'rect', left: 340, top: 960, width: 400, height: 64, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f0e6df' }] }, rx: 32, ry: 32 },
      { type: 'textbox', left: 340, top: 975, width: 400, text: 'Shop Now \u2192', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center' },
      // Gold accent stars
      { type: 'star', left: 140, top: 440, width: 24, height: 24, fill: '#fbbf24', opacity: 0.4, angle: 10 },
      { type: 'star', left: 900, top: 880, width: 20, height: 20, fill: '#fbbf24', opacity: 0.35, angle: -8 },
      { type: 'diamond', left: 180, top: 1050, width: 14, height: 20, fill: '#fbbf24', opacity: 0.3, angle: 15 },
      { type: 'diamond', left: 860, top: 500, width: 12, height: 18, fill: '#fbbf24', opacity: 0.25, angle: -12 },
    ]),

  // 4. YouTube Thumbnail — diagonal split, giant "5", X mark, face placeholder, maximum energy
  tpl('yt-thumb-mistakes', '5 Design Mistakes', 'YouTube thumbnail with diagonal split and maximum energy',
    'Social Media', 'YouTube Thumbnail', ['youtube', 'thumbnail', 'design', 'mistakes', 'tips'],
    1280, 720, 'solid', '#0f172a', [
      // Left panel — warm red/orange gradient (55%)
      { type: 'rect', left: 0, top: 0, width: 704, height: 720, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 704, y2: 720 }, colorStops: [{ offset: 0, color: '#e53935' }, { offset: 1, color: '#ff7043' }] } },
      // Diagonal overlay to create angular split
      { type: 'triangle', left: 600, top: 0, width: 300, height: 720, fill: '#0f172a' },
      // Large "X" mark — two rotated rects in the dark area
      { type: 'rect', left: 950, top: 180, width: 200, height: 28, fill: '#e53935', opacity: 0.6, angle: 45 },
      { type: 'rect', left: 950, top: 180, width: 200, height: 28, fill: '#e53935', opacity: 0.6, angle: -45 },
      // Numbered circles in dark area at 15-20% opacity
      { type: 'circle', left: 780, top: 50, radius: 20, fill: 'rgba(255,255,255,0.15)' },
      { type: 'textbox', left: 780, top: 44, width: 40, text: '1', fontFamily: 'Bebas Neue', fontSize: 26, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
      { type: 'circle', left: 1100, top: 80, radius: 20, fill: 'rgba(255,255,255,0.12)' },
      { type: 'textbox', left: 1100, top: 74, width: 40, text: '2', fontFamily: 'Bebas Neue', fontSize: 26, fill: 'rgba(255,255,255,0.35)', textAlign: 'center' },
      { type: 'circle', left: 850, top: 600, radius: 20, fill: 'rgba(255,255,255,0.12)' },
      { type: 'textbox', left: 850, top: 594, width: 40, text: '3', fontFamily: 'Bebas Neue', fontSize: 26, fill: 'rgba(255,255,255,0.3)', textAlign: 'center' },
      { type: 'circle', left: 1200, top: 600, radius: 20, fill: 'rgba(255,255,255,0.10)' },
      { type: 'textbox', left: 1200, top: 594, width: 40, text: '4', fontFamily: 'Bebas Neue', fontSize: 26, fill: 'rgba(255,255,255,0.25)', textAlign: 'center' },
      { type: 'circle', left: 1150, top: 350, radius: 20, fill: 'rgba(255,255,255,0.10)' },
      { type: 'textbox', left: 1150, top: 344, width: 40, text: '5', fontFamily: 'Bebas Neue', fontSize: 26, fill: 'rgba(255,255,255,0.25)', textAlign: 'center' },
      // Giant "5" straddling the split
      { type: 'textbox', left: 200, top: 60, width: 500, text: '5', fontFamily: 'Bebas Neue', fontSize: 480, fill: '#ffffff', textAlign: 'center', lineHeight: 0.85, shadow: { color: 'rgba(0,0,0,0.5)', blur: 24, offsetX: 6, offsetY: 6 } },
      // Arrow pointing at the 5
      { type: 'arrow-right', left: 100, top: 350, width: 80, height: 50, fill: '#fbbf24', angle: 5 },
      // "DESIGN MISTAKES" — white with black stroke for readability
      { type: 'textbox', left: 740, top: 380, width: 500, text: 'DESIGN\nMISTAKES', fontFamily: 'Montserrat', fontSize: 48, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.0, stroke: '#0f172a', strokeWidth: 2, charSpacing: 80, shadow: { color: 'rgba(229,57,53,0.5)', blur: 16, offsetX: 0, offsetY: 0 } },
      // "You're making ALL of these" text at bottom
      { type: 'textbox', left: 740, top: 530, width: 480, text: 'You\u2019re making ALL of these', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.6)' },
      // Face placeholder — bottom right with white border
      { type: 'circle', left: 1020, top: 500, radius: 90, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 180, y2: 180 }, colorStops: [{ offset: 0, color: '#d4c4b0' }, { offset: 1, color: '#8a7060' }] }, stroke: '#ffffff', strokeWidth: 3, strokeUniform: true, shadow: { color: 'rgba(0,0,0,0.4)', blur: 12, offsetX: 3, offsetY: 3 } },
      // Star accent
      { type: 'star', left: 60, top: 30, width: 40, height: 40, fill: '#fbbf24', opacity: 0.4, angle: 15 },
    ]),

  // 5. LinkedIn Carousel — navy accent bar, chart elements, data visualization shapes
  tpl('li-carousel-cover', '2026 Marketing Trends', 'LinkedIn carousel cover with navy accent bar and chart elements',
    'Social Media', 'LinkedIn Post', ['linkedin', 'carousel', 'marketing', 'trends'],
    1080, 1080, 'solid', '#faf8f5', [
      // Solid navy accent bar (replacing gradient)
      { type: 'rect', left: 0, top: 0, width: 8, height: 1080, fill: '#1e3a5f' },
      // White card with navy-tinted shadow
      { type: 'rect', left: 60, top: 200, width: 700, height: 560, fill: '#ffffff', rx: 8, ry: 8, shadow: { color: 'rgba(30,58,95,0.12)', blur: 20, offsetX: 2, offsetY: 6 } },
      { type: 'textbox', left: 110, top: 260, width: 600, text: '2026\nMarketing\nTrends', fontFamily: 'Playfair Display', fontSize: 80, fontWeight: 'bold', fill: '#1a1520', lineHeight: 1.15, charSpacing: 50, shadow: { color: 'rgba(30,58,95,0.1)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 110, top: 590, width: 60, height: 4, fill: '#C4704A' },
      { type: 'textbox', left: 110, top: 620, width: 600, text: 'A comprehensive guide for\nmodern marketers', fontFamily: 'DM Sans', fontSize: 24, fill: '#6b6b6b', lineHeight: 1.5 },
      { type: 'textbox', left: 110, top: 720, width: 200, text: '1 / 10', fontFamily: 'DM Sans', fontSize: 18, fill: '#C4704A', fontWeight: 'bold' },
      // Chart bar shapes in right area
      { type: 'rect', left: 830, top: 620, width: 40, height: 100, fill: '#1e3a5f', opacity: 0.6, rx: 4, ry: 4 },
      { type: 'rect', left: 890, top: 560, width: 40, height: 160, fill: '#C4704A', opacity: 0.7, rx: 4, ry: 4 },
      { type: 'rect', left: 950, top: 500, width: 40, height: 220, fill: '#1e3a5f', opacity: 0.8, rx: 4, ry: 4 },
      { type: 'rect', left: 820, top: 720, width: 180, height: 2, fill: '#1e3a5f', opacity: 0.3 },
      // Trend arrow
      { type: 'arrow-right', left: 840, top: 440, width: 120, height: 60, fill: '#C4704A', opacity: 0.5, angle: -30 },
      // Navy decorative elements
      { type: 'diamond', left: 810, top: 260, width: 18, height: 24, fill: '#1e3a5f', opacity: 0.2, angle: 10 },
      { type: 'star', left: 870, top: 320, width: 20, height: 20, fill: '#C4704A', opacity: 0.15, angle: 15 },
      // Dot grid in top-right
      { type: 'circle', left: 820, top: 100, radius: 4, fill: '#1e3a5f', opacity: 0.15 },
      { type: 'circle', left: 860, top: 100, radius: 4, fill: '#1e3a5f', opacity: 0.12 },
      { type: 'circle', left: 900, top: 100, radius: 4, fill: '#1e3a5f', opacity: 0.15 },
      { type: 'circle', left: 820, top: 140, radius: 4, fill: '#1e3a5f', opacity: 0.12 },
      { type: 'circle', left: 860, top: 140, radius: 4, fill: '#1e3a5f', opacity: 0.15 },
      { type: 'circle', left: 900, top: 140, radius: 4, fill: '#1e3a5f', opacity: 0.12 },
    ]),

  // 6. Twitter Banner — full-width with dot grid, portfolio, and brand mark cluster
  tpl('tw-banner-studio', 'Creative Studio', 'Twitter banner with dot grid texture, portfolio grid, and brand mark',
    'Social Media', 'Twitter Header', ['twitter', 'banner', 'studio', 'portfolio', 'creative'],
    1500, 500, 'solid', '#faf8f0', [
      // Dot grid texture — evenly distributed
      { type: 'circle', left: 100, top: 60, radius: 2, fill: 'rgba(0,0,0,0.03)' },
      { type: 'circle', left: 250, top: 60, radius: 2, fill: 'rgba(0,0,0,0.04)' },
      { type: 'circle', left: 400, top: 60, radius: 2, fill: 'rgba(0,0,0,0.03)' },
      { type: 'circle', left: 100, top: 180, radius: 2, fill: 'rgba(0,0,0,0.04)' },
      { type: 'circle', left: 250, top: 180, radius: 2, fill: 'rgba(0,0,0,0.03)' },
      { type: 'circle', left: 700, top: 420, radius: 2, fill: 'rgba(0,0,0,0.03)' },
      { type: 'circle', left: 850, top: 420, radius: 2, fill: 'rgba(0,0,0,0.04)' },
      { type: 'circle', left: 1000, top: 60, radius: 2, fill: 'rgba(0,0,0,0.03)' },
      { type: 'circle', left: 1300, top: 60, radius: 2, fill: 'rgba(0,0,0,0.04)' },
      { type: 'circle', left: 1300, top: 300, radius: 2, fill: 'rgba(0,0,0,0.03)' },
      // Left third — studio name
      { type: 'textbox', left: 60, top: 80, width: 420, text: 'CREATIVE', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#2d2520', charSpacing: 100 },
      { type: 'textbox', left: 60, top: 145, width: 420, text: 'STUDIO', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#2d2520', charSpacing: 100 },
      { type: 'textbox', left: 60, top: 230, width: 420, text: 'Design \u00b7 Brand \u00b7 Digital', fontFamily: 'DM Sans', fontSize: 14, fill: '#8a8078' },
      // Center third — portfolio samples (staggered)
      { type: 'rect', left: 540, top: 80, width: 120, height: 90, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 120, y2: 90 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4966e' }] }, rx: 6, ry: 6, shadow: { color: 'rgba(0,0,0,0.08)', blur: 8, offsetX: 1, offsetY: 3 } },
      { type: 'rect', left: 680, top: 120, width: 120, height: 90, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 120, y2: 90 }, colorStops: [{ offset: 0, color: '#7a9a6a' }, { offset: 1, color: '#d4ccc4' }] }, rx: 6, ry: 6, shadow: { color: 'rgba(0,0,0,0.08)', blur: 8, offsetX: 1, offsetY: 3 } },
      { type: 'rect', left: 820, top: 90, width: 120, height: 90, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 120, y2: 90 }, colorStops: [{ offset: 0, color: '#b5838d' }, { offset: 1, color: '#e8d5d0' }] }, rx: 6, ry: 6, shadow: { color: 'rgba(0,0,0,0.08)', blur: 8, offsetX: 1, offsetY: 3 } },
      // Right third — brand mark cluster (hexagon + diamond + circle overlapping)
      { type: 'hexagon', left: 1120, top: 80, width: 60, height: 66, fill: '#C4704A', opacity: 0.5 },
      { type: 'diamond', left: 1170, top: 100, width: 50, height: 70, fill: '#d4966e', opacity: 0.35 },
      { type: 'circle', left: 1140, top: 120, radius: 28, fill: '#e8956d', opacity: 0.3 },
      // Handle + established
      { type: 'textbox', left: 1080, top: 200, width: 350, text: '@studio.creative', fontFamily: 'DM Sans', fontSize: 14, fill: '#C4704A', textAlign: 'center' },
      { type: 'textbox', left: 1080, top: 225, width: 350, text: 'Est. 2019', fontFamily: 'DM Sans', fontSize: 11, fill: '#aaa090', textAlign: 'center' },
      // Thin accent bottom line
      { type: 'rect', left: 0, top: 494, width: 1500, height: 6, fill: '#C4704A' },
    ]),

  // 7. Pinterest Pin — full vertical, gradient photo, overlapping card, author section
  tpl('pin-home-office', 'Minimalist Home Office', 'Pinterest pin with overlapping card and author section',
    'Social Media', 'Pinterest Pin', ['pinterest', 'pin', 'home', 'office', 'minimal', 'workspace'],
    1000, 1500, 'solid', '#f5f0eb', [
      // Photo placeholder — top 55%, warm gradient
      { type: 'rect', left: 0, top: 0, width: 1000, height: 825, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1000, y2: 825 }, colorStops: [{ offset: 0, color: '#e8d5b7' }, { offset: 0.6, color: '#d4b896' }, { offset: 1, color: '#c4704a' }] } },
      // Decorative diamonds in photo corners
      { type: 'diamond', left: 60, top: 60, width: 14, height: 20, fill: 'rgba(255,255,255,0.08)', angle: 15 },
      { type: 'diamond', left: 900, top: 80, width: 12, height: 18, fill: 'rgba(255,255,255,0.06)', angle: -10 },
      // Overlapping cream card
      { type: 'rect', left: 60, top: 785, width: 880, height: 380, fill: '#faf8f5', rx: 16, ry: 16, shadow: { color: 'rgba(45,37,32,0.12)', blur: 24, offsetX: 0, offsetY: -6 } },
      // Card content — "10 MINIMALIST"
      { type: 'textbox', left: 100, top: 810, width: 800, text: '10 MINIMALIST', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#2d2520', charSpacing: 100 },
      // "Home Office Ideas" in italic serif
      { type: 'textbox', left: 100, top: 855, width: 800, text: 'Home Office Ideas', fontFamily: 'Playfair Display', fontSize: 36, fontStyle: 'italic', fill: '#2d2520' },
      // Accent line
      { type: 'rect', left: 100, top: 910, width: 80, height: 3, fill: '#C4704A' },
      // Description
      { type: 'textbox', left: 100, top: 935, width: 760, text: 'Transform your workspace with clean lines,\nnatural light, and intentional organization\nthat sparks creativity.', fontFamily: 'DM Sans', fontSize: 14, fill: '#8a8078', lineHeight: 1.7 },
      // Author section below card
      { type: 'circle', left: 80, top: 1220, radius: 25, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 50, y2: 50 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4966e' }] } },
      { type: 'textbox', left: 140, top: 1212, width: 300, text: 'Styled by Emma Liu', fontFamily: 'DM Sans', fontSize: 13, fontWeight: 'bold', fill: '#2d2520' },
      { type: 'textbox', left: 140, top: 1236, width: 300, text: '@emmaliu.design', fontFamily: 'DM Sans', fontSize: 11, fill: '#C4704A' },
      // Bookmark icon + save text at bottom
      { type: 'pentagon', left: 80, top: 1350, width: 18, height: 22, fill: '#C4704A', opacity: 0.3, angle: 180 },
      { type: 'textbox', left: 110, top: 1350, width: 200, text: 'Save for later', fontFamily: 'DM Sans', fontSize: 11, fill: '#aaa090' },
      // Small decorative star
      { type: 'star', left: 870, top: 810, width: 16, height: 16, fill: '#C4704A', opacity: 0.1, angle: 20 },
      // Hexagon accent
      { type: 'hexagon', left: 880, top: 1220, width: 20, height: 20, fill: '#C4704A', opacity: 0.08 },
    ]),

  // 8. TikTok Cover — bold rotated rects, stars, play button, electric blue accent
  tpl('tiktok-cover-watch', 'Watch This!', 'TikTok cover with bold angled typography, play button, and star accents',
    'Social Media', 'TikTok Cover', ['tiktok', 'cover', 'bold', 'creative'],
    1080, 1920, 'solid', '#0a0a0a', [
      // Bolder rotated background rects
      { type: 'rect', left: 200, top: 300, width: 400, height: 400, fill: '#C4704A', opacity: 0.25, angle: 25 },
      { type: 'rect', left: 500, top: 800, width: 300, height: 300, fill: '#3b82f6', opacity: 0.35, angle: -15 },
      { type: 'rect', left: 100, top: 1100, width: 200, height: 200, fill: '#C4704A', opacity: 0.5, angle: 40 },
      { type: 'rect', left: 700, top: 200, width: 250, height: 250, fill: '#3b82f6', opacity: 0.2, angle: 35 },
      // Stars scattered
      { type: 'star', left: 80, top: 400, width: 50, height: 50, fill: '#fbbf24', opacity: 0.3, angle: 12 },
      { type: 'star', left: 900, top: 600, width: 40, height: 40, fill: '#3b82f6', opacity: 0.35, angle: -18 },
      { type: 'star', left: 500, top: 1500, width: 36, height: 36, fill: '#C4704A', opacity: 0.25, angle: 25 },
      // Arrow-right pointing at text
      { type: 'arrow-right', left: 60, top: 780, width: 100, height: 60, fill: '#C4704A', opacity: 0.6 },
      // Play button — circle with triangle
      { type: 'circle', left: 440, top: 1250, radius: 80, fill: '#C4704A', opacity: 0.8, shadow: { color: 'rgba(196,112,74,0.5)', blur: 30, offsetX: 0, offsetY: 0 } },
      { type: 'triangle', left: 475, top: 1270, width: 60, height: 70, fill: '#ffffff', angle: 90 },
      // Heading with accent glow
      { type: 'textbox', left: 80, top: 700, width: 920, text: 'WATCH\nTHIS!', fontFamily: 'Montserrat', fontSize: 160, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 0.95, stroke: '#C4704A', strokeWidth: 3, charSpacing: 80, shadow: { color: 'rgba(196,112,74,0.6)', blur: 24, offsetX: 0, offsetY: 0 } },
      // Blue accent line replacing gradient
      { type: 'rect', left: 340, top: 1100, width: 400, height: 6, fill: '#3b82f6' },
      // Decorative shapes
      { type: 'diamond', left: 850, top: 1100, width: 30, height: 42, fill: '#3b82f6', opacity: 0.4, angle: 15 },
      { type: 'diamond', left: 200, top: 1350, width: 24, height: 34, fill: '#C4704A', opacity: 0.35, angle: -10 },
      { type: 'hexagon', left: 920, top: 1500, width: 40, height: 44, fill: '#3b82f6', opacity: 0.2 },
      // Handle
      { type: 'textbox', left: 100, top: 1700, width: 880, text: '@creativedaily', fontFamily: 'DM Sans', fontSize: 24, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
    ]),

  // 9. Facebook Event — warm golden palette, musical motifs, piano keys, full event details
  tpl('fb-event-jazz', 'Jazz in the Park', 'Warm golden-hour jazz event with musical elements and performer',
    'Events', 'Facebook Event', ['facebook', 'event', 'jazz', 'music', 'concert'],
    1200, 628, 'gradient', 'linear:to-bottom:#1a1510:#0a0805', [
      // Warm golden overlay
      { type: 'rect', left: 0, top: 0, width: 1200, height: 628, fill: 'rgba(61,43,31,0.3)' },
      // "JAZZ" — enormous Bebas Neue, slight rotation
      { type: 'textbox', left: 40, top: 60, width: 600, text: 'JAZZ', fontFamily: 'Bebas Neue', fontSize: 160, fill: '#faf8f0', charSpacing: 100, angle: -2, shadow: { color: 'rgba(212,168,83,0.4)', blur: 20, offsetX: 2, offsetY: 4 } },
      // "IN THE PARK"
      { type: 'textbox', left: 50, top: 250, width: 500, text: 'IN THE PARK', fontFamily: 'Montserrat', fontSize: 32, fill: '#d4a853', charSpacing: 200 },
      // Thin gold accent line
      { type: 'rect', left: 50, top: 310, width: 100, height: 2, fill: '#d4a853', opacity: 0.6 },
      // Date pill
      { type: 'rect', left: 50, top: 340, width: 200, height: 40, fill: 'rgba(212,168,83,0.2)', rx: 20, ry: 20 },
      { type: 'textbox', left: 50, top: 348, width: 200, text: 'SAT \u00b7 JUNE 14', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#faf8f0', textAlign: 'center', charSpacing: 100 },
      // Venue + time
      { type: 'textbox', left: 50, top: 400, width: 500, text: 'Riverside Amphitheater \u00b7 7:00 PM', fontFamily: 'DM Sans', fontSize: 16, fill: 'rgba(250,248,240,0.5)' },
      { type: 'textbox', left: 50, top: 430, width: 500, text: 'Free Admission \u00b7 Bring a Blanket', fontFamily: 'DM Sans', fontSize: 14, fill: 'rgba(250,248,240,0.35)' },
      // Performer photo — large gradient circle
      { type: 'circle', left: 820, top: 150, radius: 130, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 260, y2: 260 }, colorStops: [{ offset: 0, color: '#d4a853' }, { offset: 1, color: '#6b4226' }] } },
      // Performer name
      { type: 'textbox', left: 760, top: 430, width: 400, text: 'THE MARCUS COLE', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#faf8f0', textAlign: 'center', charSpacing: 150 },
      { type: 'textbox', left: 760, top: 455, width: 400, text: 'QUARTET', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#d4a853', textAlign: 'center', charSpacing: 150 },
      // Equalizer bars — varying heights
      { type: 'rect', left: 680, top: 520, width: 8, height: 30, fill: '#d4a853', opacity: 0.25 },
      { type: 'rect', left: 696, top: 500, width: 8, height: 50, fill: '#faf8f0', opacity: 0.2 },
      { type: 'rect', left: 712, top: 510, width: 8, height: 40, fill: '#d4a853', opacity: 0.3 },
      { type: 'rect', left: 728, top: 490, width: 8, height: 60, fill: '#faf8f0', opacity: 0.2 },
      { type: 'rect', left: 744, top: 505, width: 8, height: 45, fill: '#d4a853', opacity: 0.25 },
      { type: 'rect', left: 760, top: 515, width: 8, height: 35, fill: '#faf8f0', opacity: 0.2 },
      { type: 'rect', left: 776, top: 495, width: 8, height: 55, fill: '#d4a853', opacity: 0.3 },
      { type: 'rect', left: 792, top: 510, width: 8, height: 40, fill: '#faf8f0', opacity: 0.2 },
      { type: 'rect', left: 808, top: 525, width: 8, height: 25, fill: '#d4a853', opacity: 0.2 },
      { type: 'rect', left: 824, top: 500, width: 8, height: 50, fill: '#faf8f0', opacity: 0.25 },
      // Bottom gold line
      { type: 'rect', left: 0, top: 618, width: 1200, height: 10, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1200, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(212,168,83,0)' }, { offset: 0.5, color: '#d4a853' }, { offset: 1, color: 'rgba(212,168,83,0)' }] } },
    ]),

  // 10. Discord Banner — neon aesthetic, pixel grid, terminal prompt, avatar circles
  tpl('discord-banner', 'Pixel Collective', 'Neon Discord banner with pixel grid and terminal prompt',
    'Social Media', 'Discord Banner', ['discord', 'banner', 'neon', 'gaming', 'community'],
    960, 540, 'solid', '#12101f', [
      // Pixel grid texture — cyan/purple 8×8 rects scattered
      { type: 'rect', left: 40, top: 40, width: 8, height: 8, fill: 'rgba(34,211,238,0.05)' },
      { type: 'rect', left: 80, top: 60, width: 8, height: 8, fill: 'rgba(167,139,250,0.06)' },
      { type: 'rect', left: 120, top: 30, width: 8, height: 8, fill: 'rgba(34,211,238,0.04)' },
      { type: 'rect', left: 200, top: 80, width: 8, height: 8, fill: 'rgba(244,114,182,0.05)' },
      { type: 'rect', left: 800, top: 50, width: 8, height: 8, fill: 'rgba(34,211,238,0.06)' },
      { type: 'rect', left: 860, top: 90, width: 8, height: 8, fill: 'rgba(167,139,250,0.04)' },
      { type: 'rect', left: 700, top: 450, width: 8, height: 8, fill: 'rgba(244,114,182,0.05)' },
      { type: 'rect', left: 100, top: 400, width: 8, height: 8, fill: 'rgba(34,211,238,0.05)' },
      { type: 'rect', left: 300, top: 470, width: 8, height: 8, fill: 'rgba(167,139,250,0.06)' },
      { type: 'rect', left: 500, top: 30, width: 8, height: 8, fill: 'rgba(34,211,238,0.04)' },
      { type: 'rect', left: 650, top: 100, width: 8, height: 8, fill: 'rgba(244,114,182,0.05)' },
      { type: 'rect', left: 900, top: 400, width: 8, height: 8, fill: 'rgba(34,211,238,0.06)' },
      // "PIXEL" — cyan neon glow
      { type: 'textbox', left: 60, top: 100, width: 500, text: 'PIXEL', fontFamily: 'Oswald', fontSize: 72, fontWeight: 'bold', fill: '#22d3ee', shadow: { color: 'rgba(34,211,238,0.5)', blur: 24, offsetX: 0, offsetY: 0 } },
      // Diamond divider between words
      { type: 'diamond', left: 300, top: 175, width: 12, height: 18, fill: '#a78bfa', opacity: 0.6 },
      // "COLLECTIVE" — magenta neon glow
      { type: 'textbox', left: 60, top: 190, width: 500, text: 'COLLECTIVE', fontFamily: 'Oswald', fontSize: 60, fontWeight: 'bold', fill: '#f472b6', shadow: { color: 'rgba(244,114,182,0.5)', blur: 24, offsetX: 0, offsetY: 0 } },
      // Terminal prompt
      { type: 'textbox', left: 60, top: 290, width: 300, text: '> join us_', fontFamily: 'Fira Code', fontSize: 16, fill: '#4ade80' },
      // Accent lines — partial width, cyan/purple
      { type: 'rect', left: 60, top: 340, width: 200, height: 1, fill: '#22d3ee', opacity: 0.10 },
      { type: 'rect', left: 400, top: 380, width: 300, height: 1, fill: '#a78bfa', opacity: 0.08 },
      { type: 'rect', left: 100, top: 480, width: 250, height: 1, fill: '#f472b6', opacity: 0.06 },
      // Avatar circles — right side, overlapping, neon borders
      { type: 'circle', left: 680, top: 180, radius: 40, fill: '#1a1a2e', stroke: '#22d3ee', strokeWidth: 3, strokeUniform: true, shadow: { color: 'rgba(34,211,238,0.4)', blur: 10, offsetX: 0, offsetY: 0 } },
      { type: 'circle', left: 740, top: 180, radius: 40, fill: '#1a1a2e', stroke: '#f472b6', strokeWidth: 3, strokeUniform: true, shadow: { color: 'rgba(244,114,182,0.4)', blur: 10, offsetX: 0, offsetY: 0 } },
      { type: 'circle', left: 800, top: 180, radius: 40, fill: '#1a1a2e', stroke: '#a78bfa', strokeWidth: 3, strokeUniform: true, shadow: { color: 'rgba(167,139,250,0.4)', blur: 10, offsetX: 0, offsetY: 0 } },
      // "JOIN SERVER" CTA pill
      { type: 'rect', left: 680, top: 290, width: 200, height: 40, fill: '#22d3ee', rx: 20, ry: 20 },
      { type: 'textbox', left: 680, top: 299, width: 200, text: 'JOIN SERVER', fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold', fill: '#12101f', textAlign: 'center', charSpacing: 100 },
      // Stats
      { type: 'textbox', left: 680, top: 345, width: 200, text: '2.4K members \u00b7 150 online', fontFamily: 'DM Sans', fontSize: 11, fill: 'rgba(255,255,255,0.35)', textAlign: 'center' },
      // Decorative neon shapes
      { type: 'star', left: 580, top: 80, width: 20, height: 20, fill: '#f472b6', opacity: 0.25, angle: 15 },
      { type: 'hexagon', left: 850, top: 350, width: 24, height: 24, fill: '#a78bfa', opacity: 0.12, angle: 20 },
    ]),

  // ─── BUSINESS — CARDS / INVOICES / PROPOSALS / CERTIFICATES ──────

  // 11. Business Card — two-zone layout with monogram and diagonal accent
  tpl('biz-card-elena', 'Elena Vasquez, Architect', 'Two-zone business card with monogram, accent dots, and tagline',
    'Business', 'Business Card', ['business card', 'architect', 'minimal', 'professional'],
    1050, 600, 'solid', '#faf8f5', [
      // Left dark panel (40%)
      { type: 'rect', left: 0, top: 0, width: 420, height: 600, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 600 }, colorStops: [{ offset: 0, color: '#2d2520' }, { offset: 1, color: '#1a1510' }] } },
      // 3px accent stripe at zone boundary
      { type: 'rect', left: 420, top: 0, width: 3, height: 600, fill: '#C4704A' },
      // Monogram "E"
      { type: 'textbox', left: 60, top: 40, width: 300, text: 'E', fontFamily: 'Playfair Display', fontSize: 140, fill: '#C4704A', textAlign: 'center', opacity: 0.18 },
      // Contact with accent dot bullets
      { type: 'circle', left: 55, top: 273, radius: 3, fill: '#C4704A', opacity: 0.6 },
      { type: 'textbox', left: 70, top: 265, width: 300, text: '(312) 555-0198', fontFamily: 'DM Sans', fontSize: 11, fill: 'rgba(255,255,255,0.7)' },
      { type: 'circle', left: 55, top: 298, radius: 3, fill: '#C4704A', opacity: 0.6 },
      { type: 'textbox', left: 70, top: 290, width: 300, text: 'elena@vasquezarch.com', fontFamily: 'DM Sans', fontSize: 11, fill: 'rgba(255,255,255,0.7)' },
      { type: 'circle', left: 55, top: 323, radius: 3, fill: '#C4704A', opacity: 0.6 },
      { type: 'textbox', left: 70, top: 315, width: 300, text: 'vasquezarch.com', fontFamily: 'DM Sans', fontSize: 11, fill: '#C4704A' },
      // Location
      { type: 'rect', left: 55, top: 505, width: 60, height: 2, fill: 'rgba(196,112,74,0.4)' },
      { type: 'textbox', left: 55, top: 520, width: 300, text: 'Chicago, IL', fontFamily: 'DM Sans', fontSize: 10, fill: 'rgba(255,255,255,0.35)' },
      // Right panel — name block
      { type: 'textbox', left: 460, top: 100, width: 550, text: 'ELENA\nVASQUEZ', fontFamily: 'Montserrat', fontSize: 32, fontWeight: 'bold', fill: '#1a1520', lineHeight: 1.15, charSpacing: 150 },
      { type: 'rect', left: 460, top: 210, width: 50, height: 3, fill: '#C4704A' },
      { type: 'textbox', left: 460, top: 230, width: 550, text: 'Architect \u00b7 LEED AP', fontFamily: 'DM Sans', fontSize: 14, fill: '#8a8078' },
      { type: 'textbox', left: 460, top: 260, width: 550, text: 'Vasquez & Associates', fontFamily: 'DM Sans', fontSize: 14, fill: '#C4704A' },
      // Thin divider
      { type: 'rect', left: 460, top: 310, width: 300, height: 1, fill: '#e8e2d8' },
      // Tagline
      { type: 'textbox', left: 460, top: 330, width: 400, text: 'Sustainable design for modern spaces', fontFamily: 'Lora', fontSize: 11, fontStyle: 'italic', fill: '#aaa090' },
      // Logo placeholder — bottom right
      { type: 'rect', left: 880, top: 500, width: 120, height: 50, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 120, y2: 50 }, colorStops: [{ offset: 0, color: '#e8e2d8' }, { offset: 1, color: '#f0ece6' }] }, rx: 4, ry: 4 },
      // Decorative diamonds
      { type: 'diamond', left: 460, top: 480, width: 8, height: 12, fill: '#C4704A', opacity: 0.25 },
      { type: 'diamond', left: 480, top: 480, width: 8, height: 12, fill: '#C4704A', opacity: 0.15 },
    ]),

  // 12. Invoice — full letter page with logo, table, totals, payment info, footer
  tpl('invoice-studio', 'Studio Monet Invoice', 'Full-page invoice with logo, proper table, bank details, and footer',
    'Business', 'Invoice', ['invoice', 'billing', 'freelance', 'studio'],
    2550, 3300, 'solid', '#ffffff', [
      // Header gradient bar — full width
      { type: 'rect', left: 0, top: 0, width: 2550, height: 10, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 2550, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 0.5, color: '#d4966e' }, { offset: 1, color: '#8a5a3a' }] } },
      // Logo placeholder — rounded-rect with gradient
      { type: 'rect', left: 160, top: 60, width: 160, height: 60, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 160, y2: 60 }, colorStops: [{ offset: 0, color: '#e8e2d8' }, { offset: 1, color: '#d4ccc4' }] }, rx: 6, ry: 6 },
      // Company name + address
      { type: 'textbox', left: 350, top: 60, width: 600, text: 'Studio Monet', fontFamily: 'Playfair Display', fontSize: 36, fontWeight: 'bold', fill: '#1a1520' },
      { type: 'textbox', left: 350, top: 110, width: 600, text: '1234 Design Avenue, Suite 500\nPortland, OR 97201', fontFamily: 'DM Sans', fontSize: 14, fill: '#888880', lineHeight: 1.6 },
      // INVOICE heading — top right
      { type: 'textbox', left: 1800, top: 60, width: 600, text: 'INVOICE', fontFamily: 'Montserrat', fontSize: 48, fontWeight: 'bold', fill: '#C4704A', textAlign: 'right', charSpacing: 250 },
      // Invoice meta — right-aligned row
      { type: 'textbox', left: 1600, top: 130, width: 800, text: '#INV-1024  \u00b7  March 15, 2026  \u00b7  Due: April 14, 2026', fontFamily: 'DM Sans', fontSize: 16, fill: '#6b6b6b', textAlign: 'right' },
      // Full-width divider
      { type: 'rect', left: 160, top: 200, width: 2230, height: 2, fill: '#e8e2d8' },
      // Bill To
      { type: 'textbox', left: 160, top: 240, width: 400, text: 'BILL TO', fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      { type: 'textbox', left: 160, top: 270, width: 800, text: 'Luminary Brands Inc.\nAttn: Sarah Mitchell\n5678 Commerce Blvd\nChicago, IL 60601', fontFamily: 'DM Sans', fontSize: 15, fill: '#444444', lineHeight: 1.6 },
      // Ship To
      { type: 'textbox', left: 1200, top: 240, width: 400, text: 'PROJECT', fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      { type: 'textbox', left: 1200, top: 270, width: 800, text: 'Brand Identity Refresh\nQ1 2026 Deliverables\nPO #LB-2026-0412', fontFamily: 'DM Sans', fontSize: 15, fill: '#444444', lineHeight: 1.6 },
      // Table header row
      { type: 'rect', left: 160, top: 440, width: 2230, height: 50, fill: '#2d2520', rx: 4, ry: 4 },
      { type: 'textbox', left: 200, top: 452, width: 1000, text: 'Description', fontFamily: 'DM Sans', fontSize: 14, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 1240, top: 452, width: 160, text: 'Qty', fontFamily: 'DM Sans', fontSize: 14, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 1440, top: 452, width: 300, text: 'Rate', fontFamily: 'DM Sans', fontSize: 14, fontWeight: 'bold', fill: '#ffffff', textAlign: 'right' },
      { type: 'textbox', left: 1900, top: 452, width: 450, text: 'Amount', fontFamily: 'DM Sans', fontSize: 14, fontWeight: 'bold', fill: '#ffffff', textAlign: 'right' },
      // Row 1
      { type: 'textbox', left: 200, top: 520, width: 1000, text: 'Brand Identity Design', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26' },
      { type: 'textbox', left: 1240, top: 520, width: 160, text: '1', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'center' },
      { type: 'textbox', left: 1440, top: 520, width: 300, text: '$4,500.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'textbox', left: 1900, top: 520, width: 450, text: '$4,500.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'rect', left: 160, top: 555, width: 2230, height: 1, fill: '#f0ece6' },
      // Row 2
      { type: 'textbox', left: 200, top: 575, width: 1000, text: 'Website UI/UX Design', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26' },
      { type: 'textbox', left: 1240, top: 575, width: 160, text: '1', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'center' },
      { type: 'textbox', left: 1440, top: 575, width: 300, text: '$6,200.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'textbox', left: 1900, top: 575, width: 450, text: '$6,200.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'rect', left: 160, top: 610, width: 2230, height: 1, fill: '#f0ece6' },
      // Row 3
      { type: 'textbox', left: 200, top: 630, width: 1000, text: 'Social Media Templates (12 designs)', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26' },
      { type: 'textbox', left: 1240, top: 630, width: 160, text: '12', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'center' },
      { type: 'textbox', left: 1440, top: 630, width: 300, text: '$150.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'textbox', left: 1900, top: 630, width: 450, text: '$1,800.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'rect', left: 160, top: 665, width: 2230, height: 1, fill: '#f0ece6' },
      // Row 4
      { type: 'textbox', left: 200, top: 685, width: 1000, text: 'Brand Guidelines Document', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26' },
      { type: 'textbox', left: 1240, top: 685, width: 160, text: '1', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'center' },
      { type: 'textbox', left: 1440, top: 685, width: 300, text: '$2,400.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'textbox', left: 1900, top: 685, width: 450, text: '$2,400.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'rect', left: 160, top: 720, width: 2230, height: 1, fill: '#f0ece6' },
      // Row 5
      { type: 'textbox', left: 200, top: 740, width: 1000, text: 'Photography Art Direction', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26' },
      { type: 'textbox', left: 1240, top: 740, width: 160, text: '2', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'center' },
      { type: 'textbox', left: 1440, top: 740, width: 300, text: '$800.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'textbox', left: 1900, top: 740, width: 450, text: '$1,600.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'rect', left: 160, top: 775, width: 2230, height: 2, fill: '#2d2520' },
      // Totals — right aligned
      { type: 'textbox', left: 1440, top: 810, width: 300, text: 'Subtotal', fontFamily: 'DM Sans', fontSize: 16, fill: '#888880', textAlign: 'right' },
      { type: 'textbox', left: 1900, top: 810, width: 450, text: '$16,500.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'textbox', left: 1440, top: 845, width: 300, text: 'Tax (8%)', fontFamily: 'DM Sans', fontSize: 16, fill: '#888880', textAlign: 'right' },
      { type: 'textbox', left: 1900, top: 845, width: 450, text: '$1,320.00', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', textAlign: 'right' },
      { type: 'rect', left: 1440, top: 880, width: 910, height: 1, fill: '#2d2520' },
      // Total due — accent color
      { type: 'rect', left: 1440, top: 895, width: 910, height: 50, fill: 'rgba(196,112,74,0.06)', rx: 4, ry: 4 },
      { type: 'textbox', left: 1440, top: 905, width: 300, text: 'Total Due', fontFamily: 'Montserrat', fontSize: 20, fontWeight: 'bold', fill: '#2d2520', textAlign: 'right' },
      { type: 'textbox', left: 1900, top: 900, width: 450, text: '$17,820.00', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A', textAlign: 'right' },
      // Payment info section
      { type: 'rect', left: 160, top: 1020, width: 2230, height: 1, fill: '#e8e2d8' },
      { type: 'textbox', left: 160, top: 1060, width: 400, text: 'PAYMENT', fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      { type: 'textbox', left: 160, top: 1090, width: 2230, text: 'Payment Terms: Net 30  \u00b7  Bank Transfer or ACH accepted', fontFamily: 'DM Sans', fontSize: 15, fill: '#888880' },
      { type: 'textbox', left: 160, top: 1120, width: 2230, text: 'Bank: First National  \u00b7  Routing: 021000021  \u00b7  Account: ****4582', fontFamily: 'DM Sans', fontSize: 15, fill: '#888880' },
      { type: 'textbox', left: 160, top: 1155, width: 2230, text: 'Please include invoice number INV-1024 with your payment.', fontFamily: 'DM Sans', fontSize: 13, fill: '#aaa8a0' },
      // Notes section
      { type: 'rect', left: 160, top: 1230, width: 2230, height: 1, fill: '#e8e2d8' },
      { type: 'textbox', left: 160, top: 1260, width: 400, text: 'NOTES', fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      { type: 'textbox', left: 160, top: 1290, width: 2230, text: 'Late payments subject to 1.5% monthly fee. All intellectual property transfers upon final payment.', fontFamily: 'DM Sans', fontSize: 14, fill: '#aaa8a0' },
      // Footer divider
      { type: 'rect', left: 160, top: 3080, width: 2230, height: 1, fill: '#e8e2d8' },
      // Footer — thank you + contact
      { type: 'textbox', left: 160, top: 3110, width: 2230, text: 'Thank you for your business!', fontFamily: 'Playfair Display', fontSize: 22, fontStyle: 'italic', fill: '#C4704A', textAlign: 'center' },
      { type: 'textbox', left: 160, top: 3160, width: 2230, text: 'Studio Monet  \u00b7  1234 Design Ave, Portland, OR 97201  \u00b7  hello@studiomonet.com  \u00b7  (503) 555-0189', fontFamily: 'DM Sans', fontSize: 13, fill: '#aaa8a0', textAlign: 'center' },
      // Bottom accent bar
      { type: 'rect', left: 0, top: 3290, width: 2550, height: 10, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 2550, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 0.5, color: '#d4966e' }, { offset: 1, color: '#8a5a3a' }] } },
    ]),

  // 13. One-Pager — full page with services, clients, testimonial, contact
  tpl('one-pager-apex', 'Apex Consulting', 'Full-page company one-pager with services, testimonial, and contact',
    'Business', 'One-Pager', ['one-pager', 'consulting', 'company', 'corporate'],
    2550, 3300, 'solid', '#ffffff', [
      // Header bar — gradient accent across full width
      { type: 'rect', left: 0, top: 0, width: 2550, height: 200, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 2550, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 0.5, color: '#d4966e' }, { offset: 1, color: '#8a5a3a' }] } },
      { type: 'textbox', left: 200, top: 50, width: 1600, text: 'APEX CONSULTING', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#ffffff', charSpacing: 350, shadow: { color: 'rgba(0,0,0,0.3)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 130, width: 1600, text: 'Strategy \u00b7 Growth \u00b7 Impact', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.7)' },
      // Section 1 — About Us (y:260-500)
      { type: 'rect', left: 160, top: 260, width: 6, height: 100, fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 260, width: 400, text: 'ABOUT US', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      { type: 'textbox', left: 200, top: 300, width: 2150, text: 'We help mid-market companies unlock their next stage of growth through data-driven strategy, operational excellence, and leadership development. Founded in 2014, Apex has advised over 150 organizations across three continents, generating measurable results that speak for themselves.', fontFamily: 'DM Sans', fontSize: 19, fill: '#444444', lineHeight: 1.7 },
      // Section 2 — Stats row (y:500-700)
      { type: 'rect', left: 160, top: 500, width: 2230, height: 1, fill: '#e8e2d8' },
      { type: 'textbox', left: 160, top: 540, width: 530, text: '150+', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 160, top: 610, width: 530, text: 'Clients Served', fontFamily: 'DM Sans', fontSize: 16, fill: '#888880' },
      { type: 'textbox', left: 720, top: 540, width: 530, text: '$2.4B', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 720, top: 610, width: 530, text: 'Revenue Managed', fontFamily: 'DM Sans', fontSize: 16, fill: '#888880' },
      { type: 'textbox', left: 1280, top: 540, width: 530, text: '98%', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 1280, top: 610, width: 530, text: 'Retention Rate', fontFamily: 'DM Sans', fontSize: 16, fill: '#888880' },
      { type: 'textbox', left: 1840, top: 540, width: 530, text: '12', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 1840, top: 610, width: 530, text: 'Years', fontFamily: 'DM Sans', fontSize: 16, fill: '#888880' },
      // Section 3 — Services (y:720-1300)
      { type: 'rect', left: 160, top: 720, width: 2230, height: 1, fill: '#e8e2d8' },
      { type: 'textbox', left: 160, top: 760, width: 400, text: 'OUR SERVICES', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      // Service 1
      { type: 'circle', left: 200, top: 830, radius: 30, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 60, y2: 60 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4966e' }] } },
      { type: 'textbox', left: 160, top: 900, width: 680, text: 'Growth Strategy', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#2d2520' },
      { type: 'textbox', left: 160, top: 940, width: 680, text: 'Market analysis, competitive positioning, and roadmap planning for sustainable growth.', fontFamily: 'DM Sans', fontSize: 16, fill: '#888880', lineHeight: 1.6 },
      // Service 2
      { type: 'rect', left: 920, top: 820, width: 680, height: 220, fill: 'rgba(196,112,74,0.03)', rx: 8, ry: 8 },
      { type: 'circle', left: 960, top: 830, radius: 30, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 60, y2: 60 }, colorStops: [{ offset: 0, color: '#d4966e' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 920, top: 900, width: 680, text: 'Operations', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#2d2520' },
      { type: 'textbox', left: 920, top: 940, width: 680, text: 'Process optimization, supply chain redesign, and digital transformation initiatives.', fontFamily: 'DM Sans', fontSize: 16, fill: '#888880', lineHeight: 1.6 },
      // Service 3
      { type: 'circle', left: 1720, top: 830, radius: 30, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 60, y2: 60 }, colorStops: [{ offset: 0, color: '#8a5a3a' }, { offset: 1, color: '#C4704A' }] } },
      { type: 'textbox', left: 1680, top: 900, width: 680, text: 'Leadership', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#2d2520' },
      { type: 'textbox', left: 1680, top: 940, width: 680, text: 'Executive coaching, team development, and organizational culture transformation.', fontFamily: 'DM Sans', fontSize: 16, fill: '#888880', lineHeight: 1.6 },
      // Section 4 — Client logos (y:1100-1250)
      { type: 'rect', left: 160, top: 1100, width: 2230, height: 1, fill: '#e8e2d8' },
      { type: 'textbox', left: 160, top: 1130, width: 400, text: 'TRUSTED BY', fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      { type: 'rect', left: 160, top: 1170, width: 400, height: 70, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#e8e2d8' }, { offset: 1, color: '#f0ece6' }] }, rx: 6, ry: 6 },
      { type: 'rect', left: 610, top: 1170, width: 400, height: 70, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#e0dcd6' }, { offset: 1, color: '#ece8e2' }] }, rx: 6, ry: 6 },
      { type: 'rect', left: 1060, top: 1170, width: 400, height: 70, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#e8e2d8' }, { offset: 1, color: '#f0ece6' }] }, rx: 6, ry: 6 },
      { type: 'rect', left: 1510, top: 1170, width: 400, height: 70, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#e0dcd6' }, { offset: 1, color: '#ece8e2' }] }, rx: 6, ry: 6 },
      { type: 'rect', left: 1960, top: 1170, width: 400, height: 70, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#e8e2d8' }, { offset: 1, color: '#f0ece6' }] }, rx: 6, ry: 6 },
      // Section 5 — Testimonial (y:1320-1650)
      { type: 'rect', left: 160, top: 1320, width: 2230, height: 1, fill: '#e8e2d8' },
      { type: 'textbox', left: 160, top: 1360, width: 300, text: '\u201C', fontFamily: 'Playfair Display', fontSize: 200, fill: '#C4704A', opacity: 0.12 },
      { type: 'textbox', left: 300, top: 1420, width: 1950, text: 'Apex transformed our go-to-market strategy in 90 days. Revenue grew 40% in the first year\u2014and their team felt like an extension of ours the entire time.', fontFamily: 'Playfair Display', fontSize: 26, fontStyle: 'italic', fill: '#2d2520', textAlign: 'center', lineHeight: 1.6 },
      { type: 'textbox', left: 300, top: 1580, width: 1950, text: '\u2014 Sarah Chen, CEO at Meridian Health', fontFamily: 'DM Sans', fontSize: 18, fill: '#C4704A', textAlign: 'center' },
      // Section 6 — Contact (y:1700-1950)
      { type: 'rect', left: 160, top: 1700, width: 2230, height: 1, fill: '#e8e2d8' },
      { type: 'textbox', left: 160, top: 1740, width: 400, text: 'GET IN TOUCH', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      { type: 'textbox', left: 160, top: 1790, width: 1000, text: '(312) 555-0100\nhello@apexconsulting.com', fontFamily: 'DM Sans', fontSize: 18, fill: '#444444', lineHeight: 1.8 },
      { type: 'textbox', left: 1300, top: 1790, width: 1000, text: '200 W Monroe St, Suite 2800\nChicago, IL 60606', fontFamily: 'DM Sans', fontSize: 18, fill: '#444444', lineHeight: 1.8 },
      // Footer bar
      { type: 'rect', left: 0, top: 1920, width: 2550, height: 60, fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 1935, width: 2150, text: 'apexconsulting.com', fontFamily: 'DM Sans', fontSize: 18, fill: '#ffffff', textAlign: 'center', charSpacing: 100 },
    ]),

  // 14. Email Signature — horizontal layout with headshot, vertical dividers, social icons
  tpl('email-sig-david', 'David Chen', 'Crisp horizontal email signature with headshot, logo, and social links',
    'Business', 'Email Signature', ['email', 'signature', 'professional', 'tech'],
    600, 200, 'solid', '#ffffff', [
      // Headshot circle — gradient filled, accent border
      { type: 'circle', left: 10, top: 45, radius: 35, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 70, y2: 70 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4966e' }] }, stroke: '#C4704A', strokeWidth: 2, strokeUniform: true },
      // Vertical accent separator
      { type: 'rect', left: 90, top: 35, width: 1, height: 110, fill: '#C4704A' },
      // Name
      { type: 'textbox', left: 102, top: 35, width: 250, text: 'David Chen', fontFamily: 'DM Sans', fontSize: 18, fontWeight: 'bold', fill: '#2d2520' },
      // Title
      { type: 'textbox', left: 102, top: 58, width: 250, text: 'Senior Product Designer', fontFamily: 'DM Sans', fontSize: 10, fill: '#888880' },
      // Company in accent
      { type: 'textbox', left: 102, top: 74, width: 250, text: 'Meridian Design Co.', fontFamily: 'DM Sans', fontSize: 10, fill: '#C4704A' },
      // Thin horizontal line
      { type: 'rect', left: 102, top: 96, width: 180, height: 1, fill: '#e8e2d8' },
      // Phone
      { type: 'textbox', left: 102, top: 105, width: 250, text: '(415) 555-0142', fontFamily: 'DM Sans', fontSize: 10, fill: '#888880' },
      // Email
      { type: 'textbox', left: 102, top: 120, width: 250, text: 'david@meridiandesign.co', fontFamily: 'DM Sans', fontSize: 10, fill: '#888880' },
      // Vertical separator — right zone
      { type: 'rect', left: 400, top: 35, width: 1, height: 110, fill: '#e8e2d8' },
      // Company logo placeholder — right
      { type: 'rect', left: 420, top: 42, width: 80, height: 30, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 80, y2: 30 }, colorStops: [{ offset: 0, color: '#e8e2d8' }, { offset: 1, color: '#d4ccc4' }] }, rx: 3, ry: 3 },
      // Social link circles — 4 tiny circles
      { type: 'circle', left: 420, top: 110, radius: 10, fill: 'rgba(196,112,74,0.10)' },
      { type: 'circle', left: 448, top: 110, radius: 10, fill: 'rgba(196,112,74,0.10)' },
      { type: 'circle', left: 476, top: 110, radius: 10, fill: 'rgba(196,112,74,0.10)' },
      { type: 'circle', left: 504, top: 110, radius: 10, fill: 'rgba(196,112,74,0.10)' },
    ]),

  // 15. Proposal Cover — full page, geometric pattern, structured info block
  tpl('proposal-cover', 'Brand Strategy 2026', 'Dark premium proposal cover with corner marks and geometric texture',
    'Business', 'Proposal', ['proposal', 'cover', 'strategy', 'branding'],
    2550, 3300, 'gradient', 'linear:to-bottom:#0f1729:#1a1a2a', [
      // Decorative border — thin line inset 80px
      { type: 'rect', left: 80, top: 80, width: 2390, height: 3140, fill: 'rgba(0,0,0,0)', stroke: 'rgba(196,112,74,0.3)', strokeWidth: 1, strokeUniform: true },
      // Corner marks — top right (two perpendicular lines)
      { type: 'rect', left: 2380, top: 50, width: 30, height: 1, fill: 'rgba(255,255,255,0.2)' },
      { type: 'rect', left: 2409, top: 50, width: 1, height: 30, fill: 'rgba(255,255,255,0.2)' },
      // Corner marks — bottom left
      { type: 'rect', left: 120, top: 3220, width: 30, height: 1, fill: 'rgba(255,255,255,0.15)' },
      { type: 'rect', left: 120, top: 3190, width: 1, height: 30, fill: 'rgba(255,255,255,0.15)' },
      // Company logo placeholder — top left
      { type: 'rect', left: 160, top: 160, width: 180, height: 65, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 180, y2: 65 }, colorStops: [{ offset: 0, color: 'rgba(255,255,255,0.10)' }, { offset: 1, color: 'rgba(255,255,255,0.05)' }] }, rx: 6, ry: 6 },
      // Vertical accent line — left margin
      { type: 'rect', left: 130, top: 160, width: 2, height: 2500, fill: 'rgba(196,112,74,0.15)' },
      // Oversized "2026" — background texture at 3% opacity
      { type: 'textbox', left: 300, top: 500, width: 2000, text: '2026', fontFamily: 'Montserrat', fontSize: 400, fill: 'rgba(255,255,255,0.03)', textAlign: 'center' },
      // Main title — centered vertically
      { type: 'textbox', left: 200, top: 1200, width: 2150, text: 'Brand Strategy\n2026', fontFamily: 'Playfair Display', fontSize: 100, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 1.15, charSpacing: 80, shadow: { color: 'rgba(196,112,74,0.15)', blur: 40, offsetX: 0, offsetY: 8 } },
      // Diamond divider
      { type: 'rect', left: 1050, top: 1480, width: 180, height: 1, fill: 'rgba(196,112,74,0.4)' },
      { type: 'diamond', left: 1255, top: 1472, width: 16, height: 20, fill: '#C4704A', opacity: 0.6 },
      { type: 'rect', left: 1300, top: 1480, width: 180, height: 1, fill: 'rgba(196,112,74,0.4)' },
      // "Prepared for" label
      { type: 'textbox', left: 200, top: 1540, width: 2150, text: 'Prepared for', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
      // Client name in accent
      { type: 'textbox', left: 200, top: 1580, width: 2150, text: 'LUMINARY BRANDS', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 300 },
      // Info block (~y:2200)
      { type: 'rect', left: 200, top: 2200, width: 800, height: 1, fill: 'rgba(255,255,255,0.08)' },
      { type: 'textbox', left: 200, top: 2230, width: 250, text: 'Date', fontFamily: 'DM Sans', fontSize: 12, fill: 'rgba(255,255,255,0.3)' },
      { type: 'textbox', left: 200, top: 2255, width: 250, text: 'March 2026', fontFamily: 'DM Sans', fontSize: 17, fill: 'rgba(255,255,255,0.65)' },
      { type: 'textbox', left: 480, top: 2230, width: 250, text: 'Version', fontFamily: 'DM Sans', fontSize: 12, fill: 'rgba(255,255,255,0.3)' },
      { type: 'textbox', left: 480, top: 2255, width: 250, text: '2.1', fontFamily: 'DM Sans', fontSize: 17, fill: 'rgba(255,255,255,0.65)' },
      { type: 'textbox', left: 200, top: 2310, width: 250, text: 'Document ID', fontFamily: 'DM Sans', fontSize: 12, fill: 'rgba(255,255,255,0.3)' },
      { type: 'textbox', left: 200, top: 2335, width: 250, text: 'MS-2026-042', fontFamily: 'DM Sans', fontSize: 17, fill: 'rgba(255,255,255,0.65)' },
      { type: 'textbox', left: 480, top: 2310, width: 250, text: 'Prepared by', fontFamily: 'DM Sans', fontSize: 12, fill: 'rgba(255,255,255,0.3)' },
      { type: 'textbox', left: 480, top: 2335, width: 250, text: 'Elena Vasquez', fontFamily: 'DM Sans', fontSize: 17, fill: 'rgba(255,255,255,0.65)' },
      // Bottom — CONFIDENTIAL
      { type: 'textbox', left: 200, top: 3000, width: 2150, text: 'CONFIDENTIAL', fontFamily: 'Montserrat', fontSize: 12, fill: 'rgba(255,255,255,0.15)', textAlign: 'center', charSpacing: 600 },
      { type: 'rect', left: 200, top: 3050, width: 2150, height: 1, fill: 'rgba(255,255,255,0.06)' },
      { type: 'textbox', left: 200, top: 3080, width: 2150, text: 'Meridian Studio \u00b7 1234 Design Ave, Suite 500 \u00b7 Portland, OR 97201', fontFamily: 'DM Sans', fontSize: 13, fill: 'rgba(255,255,255,0.2)', textAlign: 'center' },
      // Scattered decorative diamonds for texture
      { type: 'diamond', left: 2000, top: 400, width: 60, height: 90, fill: 'rgba(255,255,255,0.03)', angle: 8 },
      { type: 'diamond', left: 2150, top: 550, width: 45, height: 68, fill: 'rgba(255,255,255,0.025)', angle: -12 },
      { type: 'diamond', left: 1900, top: 700, width: 50, height: 75, fill: 'rgba(255,255,255,0.02)', angle: 15 },
      { type: 'diamond', left: 2100, top: 850, width: 40, height: 60, fill: 'rgba(255,255,255,0.03)', angle: -5 },
      { type: 'diamond', left: 1950, top: 2600, width: 55, height: 82, fill: 'rgba(255,255,255,0.025)', angle: 20 },
      { type: 'diamond', left: 2200, top: 2750, width: 35, height: 52, fill: 'rgba(255,255,255,0.02)', angle: -8 },
    ]),

  tpl('certificate-excellence', 'Certificate of Excellence', 'Formal award certificate with ornamental border and gold seal',
    'Business', 'Certificate', ['certificate', 'award', 'excellence', 'formal'],
    3300, 2550, 'solid', '#faf8f5', [
      { type: 'rect', left: 80, top: 80, width: 3140, height: 2390, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 3, strokeUniform: true, rx: 8, ry: 8 },
      { type: 'rect', left: 110, top: 110, width: 3080, height: 2330, fill: 'rgba(0,0,0,0)', stroke: '#d4a853', strokeWidth: 1, strokeUniform: true, rx: 4, ry: 4 },
      { type: 'diamond', left: 140, top: 140, width: 28, height: 28, fill: '#d4a853', opacity: 0.5, angle: 45 },
      { type: 'diamond', left: 3120, top: 140, width: 28, height: 28, fill: '#d4a853', opacity: 0.5, angle: 45 },
      { type: 'diamond', left: 140, top: 2370, width: 28, height: 28, fill: '#d4a853', opacity: 0.5, angle: 45 },
      { type: 'diamond', left: 3120, top: 2370, width: 28, height: 28, fill: '#d4a853', opacity: 0.5, angle: 45 },
      { type: 'textbox', left: 400, top: 350, width: 2500, text: 'CERTIFICATE OF EXCELLENCE', fontFamily: 'Playfair Display', fontSize: 72, fontWeight: 'bold', fill: '#1a1520', textAlign: 'center', charSpacing: 200, shadow: { color: 'rgba(212,168,83,0.12)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'diamond', left: 1450, top: 490, width: 10, height: 10, fill: '#d4a853' },
      { type: 'diamond', left: 1510, top: 490, width: 10, height: 10, fill: '#C4704A' },
      { type: 'diamond', left: 1570, top: 490, width: 10, height: 10, fill: '#d4a853' },
      { type: 'diamond', left: 1630, top: 490, width: 10, height: 10, fill: '#C4704A' },
      { type: 'diamond', left: 1690, top: 490, width: 10, height: 10, fill: '#d4a853' },
      { type: 'textbox', left: 400, top: 600, width: 2500, text: 'Awarded to', fontFamily: 'DM Sans', fontSize: 22, fill: '#8a8078', textAlign: 'center' },
      { type: 'textbox', left: 400, top: 700, width: 2500, text: 'Maya Chen', fontFamily: 'Playfair Display', fontSize: 64, fontStyle: 'italic', fill: '#C4704A', textAlign: 'center' },
      { type: 'textbox', left: 400, top: 880, width: 2500, text: 'For outstanding contribution to design innovation\nand creative leadership within the organization.', fontFamily: 'DM Sans', fontSize: 24, fill: '#555555', textAlign: 'center', lineHeight: 1.6 },
      { type: 'textbox', left: 400, top: 1050, width: 2500, text: 'March 15, 2026', fontFamily: 'DM Sans', fontSize: 20, fill: '#8a8078', textAlign: 'center', charSpacing: 100 },
      { type: 'textbox', left: 400, top: 1100, width: 2500, text: 'No. 2026-0042', fontFamily: 'Montserrat', fontSize: 14, fill: '#aaa090', textAlign: 'center', charSpacing: 200 },
      { type: 'rect', left: 500, top: 1850, width: 600, height: 1, fill: '#C4704A', opacity: 0.5 },
      { type: 'textbox', left: 500, top: 1870, width: 600, text: 'Director', fontFamily: 'DM Sans', fontSize: 18, fill: '#8a8078', textAlign: 'center' },
      { type: 'rect', left: 2200, top: 1850, width: 600, height: 1, fill: '#C4704A', opacity: 0.5 },
      { type: 'textbox', left: 2200, top: 1870, width: 600, text: 'President', fontFamily: 'DM Sans', fontSize: 18, fill: '#8a8078', textAlign: 'center' },
      { type: 'circle', left: 2870, top: 1870, radius: 100, fill: 'rgba(0,0,0,0)', stroke: '#d4a853', strokeWidth: 2, strokeUniform: true, opacity: 0.3 },
      { type: 'circle', left: 2880, top: 1880, radius: 90, fill: 'rgba(0,0,0,0)', stroke: '#d4a853', strokeWidth: 1, strokeUniform: true, opacity: 0.2 },
      { type: 'circle', left: 2900, top: 1900, radius: 80, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 160, y2: 160 }, colorStops: [{ offset: 0, color: '#d4a853' }, { offset: 1, color: '#C4704A' }] } },
      { type: 'textbox', left: 2900, top: 1930, width: 160, text: '\u2605', fontFamily: 'Montserrat', fontSize: 60, fill: '#ffffff', textAlign: 'center' },
      { type: 'hexagon', left: 200, top: 200, width: 20, height: 20, fill: '#d4a853', opacity: 0.15 },
      { type: 'hexagon', left: 3040, top: 200, width: 20, height: 20, fill: '#d4a853', opacity: 0.15 },
    ]),

  tpl('meeting-notes', 'Weekly Standup Notes', 'Structured meeting notes template with action items',
    'Business', 'Meeting Notes', ['meeting', 'notes', 'standup', 'agenda', 'team'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'textbox', left: 160, top: 140, width: 1200, text: 'WEEKLY STANDUP', fontFamily: 'Montserrat', fontSize: 42, fontWeight: 'bold', fill: '#1e3a5f', charSpacing: 200, shadow: { color: 'rgba(30,58,95,0.1)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 160, top: 210, width: 100, height: 4, fill: '#C4704A' },
      { type: 'textbox', left: 160, top: 250, width: 2000, text: 'March 18, 2026 \u00b7 10:00 AM \u00b7 Engineering Team', fontFamily: 'DM Sans', fontSize: 18, fill: '#888888' },
      { type: 'textbox', left: 160, top: 330, width: 800, text: 'ATTENDEES', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#1e3a5f', charSpacing: 300 },
      { type: 'circle', left: 160, top: 370, radius: 22, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 44, y2: 44 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'circle', left: 220, top: 370, radius: 22, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 44, y2: 44 }, colorStops: [{ offset: 0, color: '#1e3a5f' }, { offset: 1, color: '#3b6fa0' }] } },
      { type: 'circle', left: 280, top: 370, radius: 22, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 44, y2: 44 }, colorStops: [{ offset: 0, color: '#d4a853' }, { offset: 1, color: '#e8c86d' }] } },
      { type: 'circle', left: 340, top: 370, radius: 22, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 44, y2: 44 }, colorStops: [{ offset: 0, color: '#6b8f71' }, { offset: 1, color: '#8fb896' }] } },
      { type: 'textbox', left: 400, top: 378, width: 1600, text: 'Sarah, Marcus, Priya, Alex \u2014 4 attendees', fontFamily: 'DM Sans', fontSize: 16, fill: '#888888' },
      { type: 'rect', left: 160, top: 440, width: 2200, height: 1, fill: '#e8dcc8' },
      { type: 'diamond', left: 160, top: 490, width: 16, height: 16, fill: '#22c55e' },
      { type: 'textbox', left: 200, top: 480, width: 800, text: 'Completed', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1e3a5f' },
      { type: 'textbox', left: 200, top: 530, width: 2100, text: '\u2022  Shipped auth flow to production (v2.4.1)\n\u2022  Closed 14 QA tickets from sprint review\n\u2022  Deployed updated design tokens to staging', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555', lineHeight: 2.0 },
      { type: 'rect', left: 160, top: 710, width: 2200, height: 1, fill: '#e8dcc8' },
      { type: 'diamond', left: 160, top: 760, width: 16, height: 16, fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 750, width: 800, text: 'In Progress', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1e3a5f' },
      { type: 'textbox', left: 200, top: 800, width: 2100, text: '\u2022  Dashboard redesign \u2014 60% complete (ETA Friday)\n\u2022  API rate-limiting implementation\n\u2022  User onboarding flow A/B test setup', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555', lineHeight: 2.0 },
      { type: 'rect', left: 160, top: 980, width: 2200, height: 1, fill: '#e8dcc8' },
      { type: 'diamond', left: 160, top: 1030, width: 16, height: 16, fill: '#dc2626' },
      { type: 'textbox', left: 200, top: 1020, width: 800, text: 'Blockers', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1e3a5f' },
      { type: 'textbox', left: 200, top: 1070, width: 2100, text: '\u2022  Waiting on legal review for Terms of Service update\n\u2022  CI pipeline flaky on integration tests \u2014 needs DevOps support', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555', lineHeight: 2.0 },
      { type: 'rect', left: 160, top: 1220, width: 2200, height: 1, fill: '#e8dcc8' },
      { type: 'star', left: 160, top: 1270, width: 16, height: 16, fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 1260, width: 800, text: 'Action Items', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1e3a5f' },
      { type: 'rect', left: 200, top: 1320, width: 22, height: 22, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 2, strokeUniform: true, rx: 4, ry: 4 },
      { type: 'textbox', left: 240, top: 1318, width: 2060, text: 'Sarah: Follow up with legal on ToS review by Wednesday', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555' },
      { type: 'rect', left: 200, top: 1370, width: 22, height: 22, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 2, strokeUniform: true, rx: 4, ry: 4 },
      { type: 'textbox', left: 240, top: 1368, width: 2060, text: 'Marcus: Create DevOps ticket for CI pipeline investigation', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555' },
      { type: 'rect', left: 200, top: 1420, width: 22, height: 22, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 2, strokeUniform: true, rx: 4, ry: 4 },
      { type: 'textbox', left: 240, top: 1418, width: 2060, text: 'Priya: Share A/B test plan with stakeholders for review', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555' },
      { type: 'rect', left: 160, top: 1500, width: 2200, height: 1, fill: '#e8dcc8' },
      { type: 'hexagon', left: 160, top: 1550, width: 16, height: 16, fill: '#1e3a5f' },
      { type: 'textbox', left: 200, top: 1540, width: 800, text: 'Decisions', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1e3a5f' },
      { type: 'textbox', left: 200, top: 1590, width: 2100, text: '\u2022  Push dashboard launch to next sprint to ensure QA coverage\n\u2022  Adopt new component library starting v3.0', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555', lineHeight: 2.0 },
      { type: 'rect', left: 160, top: 1740, width: 2200, height: 1, fill: '#e8dcc8' },
      { type: 'pentagon', left: 160, top: 1790, width: 16, height: 16, fill: '#C4704A', opacity: 0.6 },
      { type: 'textbox', left: 200, top: 1780, width: 800, text: 'Notes', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1e3a5f' },
      { type: 'textbox', left: 200, top: 1830, width: 2100, text: '\u2022  Sprint retro scheduled for Friday 3:00 PM\n\u2022  All-hands demo next Tuesday \u2014 Alex presenting dashboard progress\n\u2022  New hire (Jordan) starting Monday \u2014 Sarah to onboard', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555', lineHeight: 2.0 },
      { type: 'rect', left: 160, top: 2050, width: 2200, height: 1, fill: '#e8dcc8' },
      { type: 'textbox', left: 160, top: 2090, width: 800, text: 'NEXT MEETING', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#1e3a5f', charSpacing: 300 },
      { type: 'textbox', left: 160, top: 2130, width: 2200, text: 'March 25, 2026 \u00b7 10:00 AM \u00b7 Same room', fontFamily: 'DM Sans', fontSize: 18, fill: '#888888' },
      { type: 'rect', left: 160, top: 2200, width: 60, height: 3, fill: '#C4704A' },
    ]),

  // ─── BATCH 2: Business + Marketing + Events + Education + Creative (18-34) ──

  // ─── NAME BADGE — 1050×750 ──────────────────────────────────────

  // 18. Name Badge — teal tech accent, role pill, QR code, gradient photo
  tpl('name-badge', 'Sarah Mitchell, Speaker', 'Tech conference badge with teal accent, role pill, and QR code',
    'Business', 'Name Badge', ['badge', 'conference', 'speaker', 'event'],
    1050, 750, 'solid', '#ffffff', [
      // Dark gradient header — top 30%
      { type: 'rect', left: 0, top: 0, width: 1050, height: 225, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1050, y2: 0 }, colorStops: [{ offset: 0, color: '#0f172a' }, { offset: 1, color: '#1e293b' }] } },
      // Teal accent stripe
      { type: 'rect', left: 0, top: 220, width: 1050, height: 5, fill: '#0891b2' },
      // Conference name
      { type: 'textbox', left: 50, top: 40, width: 950, text: 'TECHSUMMIT', fontFamily: 'Montserrat', fontSize: 42, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 300 },
      // Year with spacing
      { type: 'textbox', left: 50, top: 100, width: 950, text: '2026', fontFamily: 'Montserrat', fontSize: 30, fill: 'rgba(255,255,255,0.5)', textAlign: 'center', charSpacing: 200 },
      // Location + dates
      { type: 'textbox', left: 50, top: 150, width: 950, text: 'San Francisco \u00b7 June 10\u201312', fontFamily: 'DM Sans', fontSize: 14, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
      // Photo circle — gradient-filled, teal tones, on left
      { type: 'circle', left: 60, top: 270, radius: 55, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 110, y2: 110 }, colorStops: [{ offset: 0, color: '#0891b2' }, { offset: 1, color: '#164e63' }] } },
      // SPEAKER role pill
      { type: 'rect', left: 60, top: 395, width: 110, height: 28, fill: '#0891b2', rx: 14, ry: 14 },
      { type: 'textbox', left: 60, top: 400, width: 110, text: 'SPEAKER', fontFamily: 'Montserrat', fontSize: 9, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 200 },
      // Name — large serif
      { type: 'textbox', left: 200, top: 270, width: 550, text: 'Sarah Mitchell', fontFamily: 'Playfair Display', fontSize: 36, fill: '#0f172a' },
      // Title + Company
      { type: 'textbox', left: 200, top: 320, width: 550, text: 'VP of Engineering', fontFamily: 'DM Sans', fontSize: 16, fill: '#64748b' },
      { type: 'textbox', left: 200, top: 345, width: 550, text: 'Cloudbase Inc.', fontFamily: 'DM Sans', fontSize: 16, fill: '#0891b2' },
      // QR code area — bottom right
      { type: 'rect', left: 840, top: 280, width: 150, height: 150, fill: '#f1f5f9', rx: 8, ry: 8 },
      // Crosshair detail inside QR
      { type: 'rect', left: 905, top: 310, width: 1, height: 90, fill: '#cbd5e1', opacity: 0.5 },
      { type: 'rect', left: 860, top: 355, width: 110, height: 1, fill: '#cbd5e1', opacity: 0.5 },
      // Day indicator dots — bottom center
      { type: 'circle', left: 420, top: 470, radius: 10, fill: '#0891b2' },
      { type: 'circle', left: 450, top: 470, radius: 10, fill: 'rgba(0,0,0,0)', stroke: '#0891b2', strokeWidth: 2, strokeUniform: true },
      { type: 'circle', left: 480, top: 470, radius: 10, fill: 'rgba(0,0,0,0)', stroke: '#0891b2', strokeWidth: 2, strokeUniform: true },
      { type: 'textbox', left: 510, top: 465, width: 100, text: 'Day 1', fontFamily: 'DM Sans', fontSize: 11, fill: '#94a3b8' },
      // Divider before WiFi
      { type: 'rect', left: 60, top: 530, width: 930, height: 1, fill: '#e2e8f0' },
      // WiFi info — teal accent line at bottom
      { type: 'rect', left: 0, top: 690, width: 1050, height: 60, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1050, y2: 0 }, colorStops: [{ offset: 0, color: '#0e7490' }, { offset: 1, color: '#0891b2' }] } },
      { type: 'textbox', left: 50, top: 706, width: 950, text: 'WiFi: TechSummit-Guest  \u00b7  Pass: innovate2026', fontFamily: 'DM Sans', fontSize: 13, fill: 'rgba(255,255,255,0.8)', textAlign: 'center' },
    ]),

  // ─── PRODUCT LAUNCH — 2550×3300 ────────────────────────────────

  tpl('product-launch', 'Introducing AuraSound', 'Product launch announcement with dark gradient, hexagon silhouette, and feature specs',
    'Marketing', 'Product Launch', ['product', 'launch', 'tech', 'audio'],
    2550, 3300, 'gradient', 'linear:to-bottom:#1a1a2e:#0a0a14', [
      { type: 'circle', left: 875, top: 600, radius: 320, fill: 'rgba(196,112,74,0.20)' },
      { type: 'circle', left: 975, top: 700, radius: 220, fill: 'rgba(196,112,74,0.15)', stroke: '#C4704A', strokeWidth: 1, strokeUniform: true },
      { type: 'hexagon', left: 1050, top: 760, width: 180, height: 180, fill: 'rgba(59,130,246,0.12)', stroke: 'rgba(59,130,246,0.2)', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 200, top: 450, width: 2150, text: 'INTRODUCING', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 600 },
      { type: 'textbox', left: 200, top: 1200, width: 2150, text: 'AuraSound', fontFamily: 'Playfair Display', fontSize: 140, fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(59,130,246,0.3)', blur: 24, offsetX: 0, offsetY: 6 } },
      { type: 'textbox', left: 200, top: 1420, width: 2150, text: 'Immersive spatial audio. Crafted for the way you listen.', fontFamily: 'DM Sans', fontSize: 36, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      { type: 'diamond', left: 1240, top: 1545, width: 16, height: 22, fill: '#C4704A', opacity: 0.6 },
      { type: 'hexagon', left: 500, top: 1690, width: 24, height: 24, fill: '#3b82f6', opacity: 0.4 },
      { type: 'textbox', left: 540, top: 1688, width: 500, text: '360° Spatial Audio', fontFamily: 'DM Sans', fontSize: 28, fill: 'rgba(255,255,255,0.6)' },
      { type: 'hexagon', left: 1060, top: 1690, width: 24, height: 24, fill: '#C4704A', opacity: 0.4 },
      { type: 'textbox', left: 1100, top: 1688, width: 400, text: '40-Hour Battery', fontFamily: 'DM Sans', fontSize: 28, fill: 'rgba(255,255,255,0.6)' },
      { type: 'hexagon', left: 1520, top: 1690, width: 24, height: 24, fill: '#3b82f6', opacity: 0.4 },
      { type: 'textbox', left: 1560, top: 1688, width: 600, text: 'Active Noise Cancellation', fontFamily: 'DM Sans', fontSize: 28, fill: 'rgba(255,255,255,0.6)' },
      { type: 'rect', left: 900, top: 2000, width: 750, height: 90, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 750, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#3b82f6' }] }, rx: 45, ry: 45, shadow: { color: 'rgba(59,130,246,0.25)', blur: 16, offsetX: 0, offsetY: 6 } },
      { type: 'textbox', left: 900, top: 2020, width: 750, text: 'Pre-order · $199', fontFamily: 'Montserrat', fontSize: 32, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'star', left: 400, top: 500, width: 30, height: 30, fill: '#3b82f6', opacity: 0.1, angle: 15 },
      { type: 'diamond', left: 2100, top: 450, width: 20, height: 28, fill: '#C4704A', opacity: 0.12, angle: -10 },
    ]),

  // ─── RESTAURANT MENU — 2550×3300 ───────────────────────────────

  // 20. Restaurant Menu — gradient on divider line, shadow+charSpacing on heading (already has charSpacing)
  tpl('menu-golden-fork', 'The Golden Fork', 'Elegant dark restaurant menu with gold accents and full courses',
    'Food & Lifestyle', 'Restaurant Menu', ['menu', 'restaurant', 'dining', 'elegant'],
    2550, 3300, 'solid', '#1a1510', [
      { type: 'rect', left: 150, top: 150, width: 2250, height: 3000, fill: 'rgba(0,0,0,0)', stroke: 'rgba(196,112,74,0.3)', strokeWidth: 1 },
      { type: 'textbox', left: 200, top: 250, width: 2150, text: 'THE GOLDEN FORK', fontFamily: 'Playfair Display', fontSize: 72, fill: '#C4704A', textAlign: 'center', charSpacing: 300, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 975, top: 380, width: 200, height: 1, fill: 'rgba(196,112,74,0.4)' },
      { type: 'diamond', left: 1258, top: 373, width: 12, height: 16, fill: '#C4704A' },
      { type: 'rect', left: 1375, top: 380, width: 200, height: 1, fill: 'rgba(196,112,74,0.4)' },
      { type: 'textbox', left: 200, top: 420, width: 2150, text: 'Est. 2018  \u00b7  Fine Dining', fontFamily: 'DM Sans', fontSize: 18, fill: '#f5f0e8', textAlign: 'center', charSpacing: 200, opacity: 0.5 },
      { type: 'textbox', left: 300, top: 530, width: 1950, text: 'STARTERS', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 300, top: 600, width: 1600, text: 'Burrata & Heirloom Tomato\nwith basil oil and aged balsamic', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 600, width: 300, text: '$16', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
      { type: 'textbox', left: 300, top: 740, width: 1600, text: 'Pan-Seared Scallops\nwith cauliflower purée and brown butter', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 740, width: 300, text: '$22', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
      { type: 'rect', left: 300, top: 890, width: 800, height: 1, fill: 'rgba(196,112,74,0.15)' },
      { type: 'diamond', left: 1250, top: 883, width: 10, height: 14, fill: '#C4704A', opacity: 0.4 },
      { type: 'rect', left: 1450, top: 890, width: 800, height: 1, fill: 'rgba(196,112,74,0.15)' },
      { type: 'textbox', left: 300, top: 950, width: 1950, text: 'MAINS', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 300, top: 1020, width: 1600, text: 'Grilled Lamb Chops\nwith rosemary jus and roasted vegetables', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 1020, width: 300, text: '$38', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
      { type: 'textbox', left: 300, top: 1160, width: 1600, text: 'Wild Salmon\nwith lemon caper sauce and asparagus', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 1160, width: 300, text: '$34', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
      { type: 'rect', left: 300, top: 1320, width: 800, height: 1, fill: 'rgba(196,112,74,0.15)' },
      { type: 'diamond', left: 1250, top: 1313, width: 10, height: 14, fill: '#C4704A', opacity: 0.4 },
      { type: 'rect', left: 1450, top: 1320, width: 800, height: 1, fill: 'rgba(196,112,74,0.15)' },
      { type: 'textbox', left: 300, top: 1380, width: 1950, text: 'DESSERTS', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 300, top: 1450, width: 1600, text: 'Crème Brûlée\nMadagascar vanilla bean with caramelized sugar', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 1450, width: 300, text: '$14', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
      { type: 'textbox', left: 300, top: 1590, width: 1600, text: 'Dark Chocolate Fondant\nwith salted caramel and hazelnut praline', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 1590, width: 300, text: '$16', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
      { type: 'rect', left: 300, top: 1750, width: 800, height: 1, fill: 'rgba(196,112,74,0.15)' },
      { type: 'diamond', left: 1250, top: 1743, width: 10, height: 14, fill: '#C4704A', opacity: 0.4 },
      { type: 'rect', left: 1450, top: 1750, width: 800, height: 1, fill: 'rgba(196,112,74,0.15)' },
      { type: 'textbox', left: 300, top: 1810, width: 1950, text: 'WINE PAIRINGS', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 300, top: 1880, width: 1600, text: 'Château Margaux 2018\nBordeaux, France \u00b7 Full-bodied, blackcurrant & cedar', fontFamily: 'Playfair Display', fontSize: 26, fill: '#f5f0e8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 1880, width: 300, text: '$28', fontFamily: 'DM Sans', fontSize: 26, fill: '#C4704A', textAlign: 'right' },
      { type: 'textbox', left: 300, top: 2020, width: 1600, text: 'Cloudy Bay Sauvignon Blanc\nMarlborough, NZ \u00b7 Crisp, citrus & tropical notes', fontFamily: 'Playfair Display', fontSize: 26, fill: '#f5f0e8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 2020, width: 300, text: '$18', fontFamily: 'DM Sans', fontSize: 26, fill: '#C4704A', textAlign: 'right' },
      { type: 'textbox', left: 300, top: 2160, width: 1600, text: 'Barolo Riserva 2016\nPiedmont, Italy \u00b7 Structured, rose & tar', fontFamily: 'Playfair Display', fontSize: 26, fill: '#f5f0e8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 2160, width: 300, text: '$32', fontFamily: 'DM Sans', fontSize: 26, fill: '#C4704A', textAlign: 'right' },
      { type: 'rect', left: 300, top: 2340, width: 800, height: 1, fill: 'rgba(196,112,74,0.15)' },
      { type: 'diamond', left: 1250, top: 2333, width: 10, height: 14, fill: '#C4704A', opacity: 0.4 },
      { type: 'rect', left: 1450, top: 2340, width: 800, height: 1, fill: 'rgba(196,112,74,0.15)' },
      { type: 'star', left: 220, top: 530, width: 14, height: 14, fill: '#C4704A', opacity: 0.2, angle: 12 },
      { type: 'star', left: 2280, top: 1810, width: 14, height: 14, fill: '#C4704A', opacity: 0.2, angle: -10 },
      { type: 'textbox', left: 200, top: 2440, width: 2150, text: 'Open Tuesday \u2013 Sunday  \u00b7  5:30 PM \u2013 11:00 PM', fontFamily: 'DM Sans', fontSize: 20, fill: '#f5f0e8', textAlign: 'center', opacity: 0.5 },
      { type: 'textbox', left: 200, top: 2490, width: 2150, text: '248 West Grand Avenue, Portland, OR  \u00b7  (503) 555-0198', fontFamily: 'DM Sans', fontSize: 18, fill: '#f5f0e8', textAlign: 'center', opacity: 0.4 },
      { type: 'textbox', left: 200, top: 2540, width: 2150, text: 'Reservations recommended', fontFamily: 'Playfair Display', fontSize: 20, fontStyle: 'italic', fill: '#C4704A', textAlign: 'center', opacity: 0.6 },
      { type: 'hexagon', left: 190, top: 190, width: 18, height: 18, fill: '#C4704A', opacity: 0.2 },
      { type: 'hexagon', left: 2340, top: 190, width: 18, height: 18, fill: '#C4704A', opacity: 0.2 },
      { type: 'hexagon', left: 190, top: 3090, width: 18, height: 18, fill: '#C4704A', opacity: 0.2 },
      { type: 'hexagon', left: 2340, top: 3090, width: 18, height: 18, fill: '#C4704A', opacity: 0.2 },
    ]),

  // ─── REAL ESTATE — 1080×1080 ───────────────────────────────────

  // 21. Real Estate — asymmetric layout, gradient photo placeholder, JUST LISTED pill, agent section
  tpl('real-estate', 'Modern Loft \u00b7 Downtown', 'Asymmetric real estate listing with gradient photo and agent section',
    'Marketing', 'Real Estate', ['real estate', 'listing', 'property', 'home', 'loft'],
    1080, 1080, 'solid', '#faf8f5', [
      // Photo placeholder — warm gradient, top 60%
      { type: 'rect', left: 0, top: 0, width: 1080, height: 648, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 648 }, colorStops: [{ offset: 0, color: '#e8d5b7' }, { offset: 0.6, color: '#d4b896' }, { offset: 1, color: '#c9a96e' }] } },
      // JUST LISTED pill — top left
      { type: 'rect', left: 40, top: 40, width: 190, height: 40, fill: '#1a1a1a', rx: 20, ry: 20 },
      { type: 'textbox', left: 40, top: 48, width: 190, text: 'JUST LISTED', fontFamily: 'Montserrat', fontSize: 13, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 200 },
      // White content panel — bottom 40%
      { type: 'rect', left: 0, top: 648, width: 1080, height: 432, fill: '#ffffff' },
      // Property name
      { type: 'textbox', left: 50, top: 670, width: 700, text: 'Modern Loft \u00b7 Downtown', fontFamily: 'Montserrat', fontSize: 32, fontWeight: 'bold', fill: '#1a1a1a' },
      // Price
      { type: 'textbox', left: 50, top: 720, width: 400, text: '$425,000', fontFamily: 'Montserrat', fontSize: 48, fontWeight: 'bold', fill: '#C4704A', shadow: { color: 'rgba(196,112,74,0.15)', blur: 12, offsetX: 0, offsetY: 3 } },
      // Accent line under price
      { type: 'rect', left: 50, top: 785, width: 80, height: 3, fill: '#C4704A' },
      // Specs
      { type: 'textbox', left: 50, top: 805, width: 600, text: '3 Bed  \u00b7  2 Bath  \u00b7  1,840 sqft', fontFamily: 'DM Sans', fontSize: 16, fill: '#8a8078' },
      // Description
      { type: 'textbox', left: 50, top: 840, width: 650, text: 'Sun-drenched corner unit with floor-to-ceiling windows and skyline views.', fontFamily: 'DM Sans', fontSize: 13, fill: '#aaa090' },
      // Divider
      { type: 'rect', left: 50, top: 890, width: 980, height: 1, fill: '#e8e2d8' },
      // Agent headshot circle
      { type: 'circle', left: 50, top: 920, radius: 25, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 50, y2: 50 }, colorStops: [{ offset: 0, color: '#d4b896' }, { offset: 1, color: '#a0826a' }] } },
      // Agent info
      { type: 'textbox', left: 110, top: 914, width: 400, text: 'Sarah Chen', fontFamily: 'Montserrat', fontSize: 16, fontWeight: 'bold', fill: '#1a1a1a' },
      { type: 'textbox', left: 110, top: 938, width: 400, text: 'Pinnacle Realty  \u00b7  (312) 555-0472', fontFamily: 'DM Sans', fontSize: 12, fill: '#9a9088' },
      // Logo placeholder — bottom right
      { type: 'rect', left: 890, top: 918, width: 140, height: 46, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 140, y2: 46 }, colorStops: [{ offset: 0, color: '#e8e2d8' }, { offset: 1, color: '#d4ccc4' }] }, rx: 4, ry: 4 },
      // Decorative elements
      { type: 'diamond', left: 750, top: 680, width: 10, height: 14, fill: '#C4704A', opacity: 0.15 },
      { type: 'diamond', left: 775, top: 680, width: 8, height: 12, fill: '#C4704A', opacity: 0.1 },
      // Subtle photo overlay shape
      { type: 'rect', left: 760, top: 80, width: 260, height: 260, fill: 'rgba(255,255,255,0.04)', angle: 12 },
    ]),

  // ─── COUPON — 1800×750 ─────────────────────────────────────────

  // 22. Coupon — exciting red/orange gradient, star motif, barcode, scissors detail
  tpl('coupon-twenty', '20% OFF Your Order', 'Exciting coupon with star motif, barcode, and scissors detail',
    'Marketing', 'Coupon', ['coupon', 'discount', 'sale', 'promo'],
    1800, 750, 'gradient', 'linear:to-right:#e53935:#ff7043', [
      // Dashed border
      { type: 'rect', left: 20, top: 20, width: 1760, height: 710, fill: 'rgba(0,0,0,0)', stroke: '#ffffff', strokeWidth: 3, strokeDashArray: [12, 8], rx: 10, ry: 10 },
      // Large star behind discount
      { type: 'star', left: 220, top: 130, width: 400, height: 400, fill: 'rgba(255,255,255,0.12)', angle: 15 },
      // Scattered small stars
      { type: 'star', left: 80, top: 60, width: 30, height: 30, fill: 'rgba(255,255,255,0.10)', angle: 25 },
      { type: 'star', left: 750, top: 600, width: 24, height: 24, fill: 'rgba(255,255,255,0.08)', angle: -10 },
      { type: 'star', left: 600, top: 50, width: 20, height: 20, fill: 'rgba(255,255,255,0.07)', angle: 40 },
      // "20%" in Bebas Neue
      { type: 'textbox', left: 120, top: 100, width: 600, text: '20%', fontFamily: 'Bebas Neue', fontSize: 200, fill: '#ffffff', shadow: { color: 'rgba(120,0,0,0.4)', blur: 20, offsetX: 3, offsetY: 6 } },
      // "OFF YOUR ENTIRE ORDER"
      { type: 'textbox', left: 120, top: 330, width: 600, text: 'OFF YOUR ENTIRE ORDER', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: 'rgba(255,255,255,0.9)', charSpacing: 150 },
      // Brand section
      { type: 'textbox', left: 120, top: 460, width: 500, text: 'CRAFT & CO', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#ffffff', charSpacing: 200 },
      { type: 'textbox', left: 120, top: 500, width: 500, text: 'Handcrafted goods since 2018', fontFamily: 'DM Sans', fontSize: 14, fill: 'rgba(255,255,255,0.6)' },
      // Scissors triangles
      { type: 'triangle', left: 1070, top: 4, width: 22, height: 16, fill: 'rgba(255,255,255,0.5)', angle: 180 },
      { type: 'triangle', left: 1070, top: 730, width: 22, height: 16, fill: 'rgba(255,255,255,0.5)', angle: 0 },
      // Dotted cut line
      { type: 'rect', left: 1080, top: 25, width: 2, height: 700, fill: 'rgba(0,0,0,0)', stroke: 'rgba(255,255,255,0.25)', strokeWidth: 2, strokeDashArray: [6, 6] },
      // Right section — promo code area
      { type: 'rect', left: 1140, top: 120, width: 580, height: 510, fill: 'rgba(255,255,255,0.06)', rx: 12, ry: 12 },
      // Promo code pill
      { type: 'rect', left: 1280, top: 220, width: 300, height: 56, fill: '#ffffff', rx: 28, ry: 28 },
      { type: 'textbox', left: 1280, top: 232, width: 300, text: 'CODE: SAVE20', fontFamily: 'Montserrat', fontSize: 20, fontWeight: 'bold', fill: '#e53935', textAlign: 'center', charSpacing: 100 },
      // Validity
      { type: 'textbox', left: 1140, top: 310, width: 580, text: 'Valid through Dec 31, 2026', fontFamily: 'DM Sans', fontSize: 15, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      // Barcode placeholder
      { type: 'rect', left: 1260, top: 430, width: 4, height: 50, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 1270, top: 430, width: 2, height: 50, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 1278, top: 430, width: 6, height: 50, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 1290, top: 430, width: 3, height: 50, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 1299, top: 430, width: 5, height: 50, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 1310, top: 430, width: 2, height: 50, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 1318, top: 430, width: 7, height: 50, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 1332, top: 430, width: 3, height: 50, fill: 'rgba(255,255,255,0.7)' },
      // Diamond accent
      { type: 'diamond', left: 1500, top: 560, width: 14, height: 20, fill: 'rgba(255,255,255,0.15)', angle: 20 },
    ]),

  // ─── TESTIMONIAL CARD — 1080×1080 ──────────────────────────────

  tpl('testimonial-card', 'This Changed Everything', 'Customer testimonial card with metric highlight, diamond accents, and star rating',
    'Marketing', 'Testimonial', ['testimonial', 'review', 'social proof', 'quote'],
    1080, 1080, 'solid', '#faf8f5', [
      { type: 'diamond', left: 80, top: 60, width: 140, height: 200, fill: '#C4704A', opacity: 0.08 },
      { type: 'textbox', left: 120, top: 100, width: 840, text: '2x', fontFamily: 'Montserrat', fontSize: 72, fontWeight: 'bold', fill: '#2d3748', charSpacing: 40, shadow: { color: 'rgba(45,55,72,0.1)', blur: 10, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 120, top: 185, width: 840, text: 'CONVERSION RATE', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#C4704A', charSpacing: 350 },
      { type: 'textbox', left: 120, top: 300, width: 840, text: '\u201CThis product completely changed how we approach design. Our conversion rate doubled in the first month.\u201D', fontFamily: 'Playfair Display', fontSize: 36, fill: '#2d2520', lineHeight: 1.6, fontStyle: 'italic', charSpacing: 50, shadow: { color: 'rgba(194,133,122,0.12)', blur: 14, offsetX: 2, offsetY: 5 } },
      { type: 'textbox', left: 120, top: 620, width: 840, text: '\u2605\u2605\u2605\u2605\u2605', fontFamily: 'Montserrat', fontSize: 28, fill: '#C4704A' },
      { type: 'diamond', left: 120, top: 690, width: 14, height: 20, fill: '#C4704A', opacity: 0.6 },
      { type: 'diamond', left: 148, top: 690, width: 10, height: 14, fill: '#b5838d', opacity: 0.4 },
      { type: 'diamond', left: 170, top: 690, width: 14, height: 20, fill: '#C4704A', opacity: 0.6 },
      { type: 'circle', left: 120, top: 750, radius: 32, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 64, y2: 64 }, colorStops: [{ offset: 0, color: '#e8dcc8' }, { offset: 1, color: '#c4a882' }] } },
      { type: 'textbox', left: 200, top: 745, width: 700, text: 'Rachel Torres', fontFamily: 'Montserrat', fontSize: 20, fontWeight: 'bold', fill: '#1a1510' },
      { type: 'textbox', left: 200, top: 780, width: 700, text: 'Founder, Drift Studio', fontFamily: 'DM Sans', fontSize: 16, fill: '#888070' },
      { type: 'rect', left: 820, top: 750, width: 140, height: 50, fill: 'rgba(0,0,0,0)', stroke: 'rgba(45,55,72,0.25)', strokeWidth: 1, rx: 6, ry: 6 },
      { type: 'textbox', left: 820, top: 762, width: 140, text: 'DRIFT', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#2d3748', textAlign: 'center', charSpacing: 250 },
      { type: 'star', left: 950, top: 80, width: 24, height: 24, fill: '#C4704A', opacity: 0.15, angle: 12 },
      { type: 'diamond', left: 980, top: 950, width: 16, height: 22, fill: '#2d3748', opacity: 0.12, angle: -8 },
      { type: 'hexagon', left: 60, top: 950, width: 30, height: 34, fill: '#C4704A', opacity: 0.08 },
    ]),

  // ─── NEWSLETTER HEADER — 1200×400 ──────────────────────────────

  // 24. Newsletter Header — distinctive brand identity with hexagon mark and article teaser
  tpl('newsletter-header', 'The Weekly Brief #47', 'Distinctive newsletter header with brand mark and article teaser',
    'Marketing', 'Newsletter', ['newsletter', 'email', 'header', 'weekly', 'brief'],
    1200, 400, 'solid', '#faf8f0', [
      // Bottom accent line
      { type: 'rect', left: 0, top: 393, width: 1200, height: 7, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1200, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 0.5, color: '#d4966e' }, { offset: 1, color: '#C4704A' }] } },
      // Hexagon brand mark
      { type: 'hexagon', left: 50, top: 50, width: 48, height: 54, fill: '#C4704A' },
      { type: 'textbox', left: 50, top: 62, width: 48, text: 'WB', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      // Newsletter name
      { type: 'textbox', left: 120, top: 48, width: 500, text: 'THE WEEKLY BRIEF', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#1a1a1a', charSpacing: 150 },
      // Issue + date
      { type: 'textbox', left: 120, top: 95, width: 400, text: 'Issue #47 \u00b7 April 14, 2026', fontFamily: 'DM Sans', fontSize: 12, fill: '#888880' },
      // Accent bar
      { type: 'rect', left: 120, top: 120, width: 60, height: 3, fill: '#C4704A' },
      // Vertical divider
      { type: 'rect', left: 630, top: 40, width: 1, height: 140, fill: '#e8e2d8' },
      // Article teaser — right side
      { type: 'textbox', left: 650, top: 50, width: 500, text: 'This Week:', fontFamily: 'Montserrat', fontSize: 11, fontWeight: 'bold', fill: '#C4704A', charSpacing: 200 },
      { type: 'textbox', left: 650, top: 75, width: 500, text: 'The Future of\nDesign Systems', fontFamily: 'Playfair Display', fontSize: 28, fontStyle: 'italic', fill: '#2d2520', lineHeight: 1.25 },
      // Navigation hints
      { type: 'textbox', left: 650, top: 170, width: 500, text: 'Articles  \u00b7  Podcast  \u00b7  Resources', fontFamily: 'DM Sans', fontSize: 12, fill: '#C4704A' },
      // Decorative diamonds
      { type: 'diamond', left: 620, top: 60, width: 8, height: 12, fill: '#C4704A', opacity: 0.12, angle: 15 },
      { type: 'diamond', left: 600, top: 340, width: 10, height: 14, fill: '#C4704A', opacity: 0.08, angle: -10 },
      { type: 'diamond', left: 1140, top: 50, width: 8, height: 12, fill: '#C4704A', opacity: 0.08, angle: 20 },
      // Left accent stripe
      { type: 'rect', left: 0, top: 0, width: 4, height: 400, fill: '#C4704A', opacity: 0.3 },
    ]),

  // ─── APP PROMO STORY — 1080×1920 ───────────────────────────────

  // 25. App Promo — warm sienna/amber gradient, device frame with mock UI, store badges
  tpl('app-promo-taskflow', 'Download TaskFlow', 'App promo with device frame, mock UI, and store badges',
    'Marketing', 'App Promo', ['app', 'promo', 'mobile', 'download', 'story', 'taskflow'],
    1080, 1920, 'gradient', 'linear:to-bottom:#2d2520:#1a1510', [
      // Title above phone
      { type: 'textbox', left: 100, top: 80, width: 880, text: 'TaskFlow', fontFamily: 'Montserrat', fontSize: 48, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 80 },
      { type: 'textbox', left: 100, top: 150, width: 880, text: 'Your tasks, simplified.', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      // Device frame
      { type: 'rect', left: 340, top: 240, width: 400, height: 720, fill: '#ffffff', rx: 28, ry: 28, shadow: { color: 'rgba(0,0,0,0.35)', blur: 40, offsetX: 0, offsetY: 12 } },
      { type: 'rect', left: 470, top: 250, width: 140, height: 22, fill: '#1a1510', rx: 11, ry: 11 },
      { type: 'rect', left: 354, top: 284, width: 372, height: 662, fill: '#f5f0eb', rx: 4, ry: 4 },
      // App header inside phone
      { type: 'rect', left: 354, top: 284, width: 372, height: 52, fill: '#C4704A' },
      { type: 'textbox', left: 370, top: 296, width: 200, text: 'TaskFlow', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'circle', left: 680, top: 296, radius: 14, fill: 'rgba(255,255,255,0.3)' },
      // Task items with colored left accent borders
      { type: 'rect', left: 370, top: 356, width: 340, height: 50, fill: '#ffffff', rx: 6, ry: 6 },
      { type: 'rect', left: 370, top: 356, width: 4, height: 50, fill: '#C4704A', rx: 2, ry: 2 },
      { type: 'rect', left: 388, top: 368, width: 180, height: 8, fill: '#d4ccc4', rx: 4, ry: 4 },
      { type: 'rect', left: 370, top: 420, width: 340, height: 50, fill: '#ffffff', rx: 6, ry: 6 },
      { type: 'rect', left: 370, top: 420, width: 4, height: 50, fill: '#22c55e', rx: 2, ry: 2 },
      { type: 'rect', left: 388, top: 432, width: 200, height: 8, fill: '#d4ccc4', rx: 4, ry: 4 },
      { type: 'rect', left: 370, top: 484, width: 340, height: 50, fill: '#ffffff', rx: 6, ry: 6 },
      { type: 'rect', left: 370, top: 484, width: 4, height: 50, fill: '#C4704A', rx: 2, ry: 2 },
      { type: 'rect', left: 388, top: 496, width: 160, height: 8, fill: '#d4ccc4', rx: 4, ry: 4 },
      { type: 'rect', left: 370, top: 548, width: 340, height: 50, fill: '#ffffff', rx: 6, ry: 6 },
      { type: 'rect', left: 370, top: 548, width: 4, height: 50, fill: '#fbbf24', rx: 2, ry: 2 },
      { type: 'rect', left: 388, top: 560, width: 220, height: 8, fill: '#d4ccc4', rx: 4, ry: 4 },
      // Floating action button
      { type: 'circle', left: 660, top: 890, radius: 22, fill: '#C4704A', shadow: { color: 'rgba(196,112,74,0.4)', blur: 10, offsetX: 0, offsetY: 3 } },
      { type: 'textbox', left: 660, top: 893, width: 44, text: '+', fontFamily: 'DM Sans', fontSize: 24, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      // Feature icons — star, diamond, hexagon
      { type: 'star', left: 200, top: 1020, width: 28, height: 28, fill: '#C4704A', opacity: 0.8 },
      { type: 'textbox', left: 160, top: 1060, width: 110, text: 'Smart\nPriority', fontFamily: 'DM Sans', fontSize: 13, fill: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.3 },
      { type: 'diamond', left: 500, top: 1020, width: 28, height: 34, fill: '#C4704A', opacity: 0.8 },
      { type: 'textbox', left: 460, top: 1060, width: 110, text: 'Calendar\nSync', fontFamily: 'DM Sans', fontSize: 13, fill: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.3 },
      { type: 'hexagon', left: 800, top: 1018, width: 30, height: 34, fill: '#C4704A', opacity: 0.8 },
      { type: 'textbox', left: 760, top: 1060, width: 110, text: 'Team\nCollab', fontFamily: 'DM Sans', fontSize: 13, fill: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.3 },
      // Star rating
      { type: 'star', left: 368, top: 1140, width: 18, height: 18, fill: '#fbbf24' },
      { type: 'star', left: 396, top: 1140, width: 18, height: 18, fill: '#fbbf24' },
      { type: 'star', left: 424, top: 1140, width: 18, height: 18, fill: '#fbbf24' },
      { type: 'star', left: 452, top: 1140, width: 18, height: 18, fill: '#fbbf24' },
      { type: 'star', left: 480, top: 1140, width: 18, height: 18, fill: '#fbbf24' },
      { type: 'textbox', left: 510, top: 1140, width: 200, text: '4.9 \u00b7 12K reviews', fontFamily: 'DM Sans', fontSize: 14, fill: 'rgba(255,255,255,0.5)' },
      // App store badges
      { type: 'rect', left: 280, top: 1210, width: 220, height: 56, fill: '#1a1a1a', rx: 8, ry: 8 },
      { type: 'textbox', left: 280, top: 1220, width: 220, text: 'App Store', fontFamily: 'DM Sans', fontSize: 14, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 540, top: 1210, width: 220, height: 56, fill: '#1a1a1a', rx: 8, ry: 8 },
      { type: 'textbox', left: 540, top: 1220, width: 220, text: 'Google Play', fontFamily: 'DM Sans', fontSize: 14, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 200, top: 1300, width: 680, text: 'Free forever \u00b7 No credit card required', fontFamily: 'DM Sans', fontSize: 13, fill: 'rgba(255,255,255,0.35)', textAlign: 'center' },
    ]),

  // ─── WEDDING INVITATION — 1500×2100 ────────────────────────────

  // 26. Wedding — gradient on divider line, shadow+charSpacing on heading
  tpl('wedding-emma-james', 'Emma & James', 'Elegant wedding invitation with floral accents and serif typography',
    'Events', 'Wedding', ['wedding', 'invitation', 'elegant', 'romantic'],
    1500, 2100, 'solid', '#faf8f5', [
      { type: 'rect', left: 60, top: 60, width: 1380, height: 1980, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 1 },
      { type: 'diamond', left: 85, top: 85, width: 40, height: 40, fill: '#b5838d', opacity: 0.2, angle: 45 },
      { type: 'diamond', left: 1345, top: 85, width: 32, height: 32, fill: '#b5838d', opacity: 0.25, angle: 45 },
      { type: 'diamond', left: 1325, top: 1925, width: 44, height: 44, fill: '#b5838d', opacity: 0.2, angle: 45 },
      { type: 'diamond', left: 105, top: 1905, width: 36, height: 36, fill: '#b5838d', opacity: 0.22, angle: 45 },
      { type: 'circle', left: 690, top: 200, radius: 60, fill: 'rgba(0,0,0,0)', stroke: '#b5838d', strokeWidth: 1.5, strokeUniform: true },
      { type: 'textbox', left: 690, top: 225, width: 120, text: 'E&J', fontFamily: 'Playfair Display', fontSize: 32, fontStyle: 'italic', fill: '#b5838d', textAlign: 'center' },
      { type: 'rect', left: 745, top: 330, width: 2, height: 40, fill: '#b5838d', opacity: 0.3 },
      { type: 'textbox', left: 150, top: 420, width: 1200, text: 'Emma & James', fontFamily: 'Playfair Display', fontSize: 80, fill: '#2d2520', textAlign: 'center', charSpacing: 80, shadow: { color: 'rgba(181,131,141,0.2)', blur: 16, offsetX: 0, offsetY: 0 } },
      { type: 'rect', left: 550, top: 540, width: 120, height: 1, fill: '#C4704A', opacity: 0.4 },
      { type: 'diamond', left: 738, top: 533, width: 10, height: 14, fill: '#b5838d' },
      { type: 'rect', left: 830, top: 540, width: 120, height: 1, fill: '#C4704A', opacity: 0.4 },
      { type: 'textbox', left: 150, top: 600, width: 1200, text: 'request the pleasure of your company\nat the celebration of their marriage', fontFamily: 'DM Sans', fontSize: 22, fill: '#888070', textAlign: 'center', lineHeight: 1.8 },
      { type: 'textbox', left: 150, top: 780, width: 1200, text: 'Saturday, the fourteenth of June\nTwo thousand twenty-six\nat half past four in the afternoon', fontFamily: 'Playfair Display', fontSize: 28, fill: '#2d2520', textAlign: 'center', lineHeight: 1.8 },
      { type: 'textbox', left: 150, top: 1040, width: 1200, text: 'The Willows Estate, Sonoma', fontFamily: 'DM Sans', fontSize: 20, fill: '#C4704A', textAlign: 'center', charSpacing: 200 },
      { type: 'heart', left: 400, top: 1010, width: 14, height: 14, fill: '#b5838d', opacity: 0.2 },
      { type: 'heart', left: 1080, top: 1010, width: 14, height: 14, fill: '#b5838d', opacity: 0.2 },
      { type: 'textbox', left: 150, top: 1160, width: 1200, text: 'Dinner & Dancing to Follow', fontFamily: 'DM Sans', fontSize: 18, fill: '#aaa090', textAlign: 'center' },
      { type: 'star', left: 730, top: 1120, width: 12, height: 12, fill: '#b5838d', opacity: 0.3 },
      { type: 'rect', left: 500, top: 1420, width: 500, height: 1, fill: '#b5838d', opacity: 0.3 },
      { type: 'textbox', left: 150, top: 1460, width: 1200, text: 'Kindly respond by the first of May\nTwo thousand twenty-six', fontFamily: 'Playfair Display', fontSize: 22, fontStyle: 'italic', fill: '#888070', textAlign: 'center', lineHeight: 1.8 },
      { type: 'textbox', left: 150, top: 1580, width: 1200, text: 'rsvp@emmaandjames.com', fontFamily: 'DM Sans', fontSize: 16, fill: '#b5838d', textAlign: 'center', charSpacing: 100 },
      { type: 'textbox', left: 150, top: 1700, width: 1200, text: 'RSVP by May 1, 2026', fontFamily: 'Montserrat', fontSize: 16, fill: '#aaa090', textAlign: 'center', charSpacing: 200 },
      { type: 'rect', left: 745, top: 1770, width: 2, height: 30, fill: '#b5838d', opacity: 0.25 },
    ]),

  // ─── BIRTHDAY INVITE — 1080×1080 ───────────────────────────────

  // 27. Birthday — gradient on divider line, shadow+charSpacing on heading
  tpl('birthday-mia', 'Mia Turns 7!', 'Bright and fun birthday invitation with stars, balloons, and bunting',
    'Events', 'Birthday', ['birthday', 'party', 'kids', 'celebration', 'invitation'],
    1080, 1080, 'gradient', 'linear:to-bottom-right:#ffd54f:#f06292', [
      // Bunting/banner triangles across the top
      { type: 'triangle', left: 60, top: 30, width: 60, height: 50, fill: '#e53935' },
      { type: 'triangle', left: 140, top: 30, width: 60, height: 50, fill: '#1e88e5' },
      { type: 'triangle', left: 220, top: 30, width: 60, height: 50, fill: '#43a047' },
      { type: 'triangle', left: 300, top: 30, width: 60, height: 50, fill: '#fb8c00' },
      { type: 'triangle', left: 380, top: 30, width: 60, height: 50, fill: '#8e24aa' },
      { type: 'triangle', left: 460, top: 30, width: 60, height: 50, fill: '#e53935' },
      { type: 'triangle', left: 540, top: 30, width: 60, height: 50, fill: '#1e88e5' },
      { type: 'triangle', left: 620, top: 30, width: 60, height: 50, fill: '#43a047' },
      { type: 'triangle', left: 700, top: 30, width: 60, height: 50, fill: '#fb8c00' },
      { type: 'triangle', left: 780, top: 30, width: 60, height: 50, fill: '#8e24aa' },
      { type: 'triangle', left: 860, top: 30, width: 60, height: 50, fill: '#e53935' },
      { type: 'triangle', left: 940, top: 30, width: 60, height: 50, fill: '#1e88e5' },
      // Bunting string
      { type: 'rect', left: 40, top: 28, width: 1000, height: 2, fill: 'rgba(255,255,255,0.6)' },
      // Stars scattered — bright colors at full opacity
      { type: 'star', left: 80, top: 120, width: 40, height: 40, fill: '#e53935', angle: 12 },
      { type: 'star', left: 920, top: 150, width: 35, height: 35, fill: '#1e88e5', angle: -8 },
      { type: 'star', left: 180, top: 850, width: 30, height: 30, fill: '#8e24aa', angle: 20 },
      { type: 'star', left: 850, top: 880, width: 45, height: 45, fill: '#43a047', angle: -15 },
      { type: 'star', left: 500, top: 950, width: 25, height: 25, fill: '#fb8c00', angle: 30 },
      { type: 'star', left: 950, top: 500, width: 28, height: 28, fill: '#e53935', angle: 45 },
      // Balloon shapes — circles with triangle tips and line strings
      { type: 'circle', left: 50, top: 300, radius: 40, fill: '#e53935', opacity: 0.85 },
      { type: 'triangle', left: 73, top: 376, width: 16, height: 12, fill: '#e53935', opacity: 0.85 },
      { type: 'rect', left: 88, top: 388, width: 2, height: 50, fill: 'rgba(255,255,255,0.4)' },
      { type: 'circle', left: 950, top: 280, radius: 35, fill: '#1e88e5', opacity: 0.85 },
      { type: 'triangle', left: 970, top: 350, width: 14, height: 10, fill: '#1e88e5', opacity: 0.85 },
      { type: 'rect', left: 984, top: 360, width: 2, height: 45, fill: 'rgba(255,255,255,0.4)' },
      { type: 'circle', left: 120, top: 600, radius: 30, fill: '#43a047', opacity: 0.7 },
      { type: 'triangle', left: 136, top: 656, width: 12, height: 9, fill: '#43a047', opacity: 0.7 },
      { type: 'circle', left: 900, top: 650, radius: 32, fill: '#fb8c00', opacity: 0.75 },
      { type: 'triangle', left: 918, top: 710, width: 12, height: 9, fill: '#fb8c00', opacity: 0.75 },
      // Hearts for extra fun
      { type: 'heart', left: 200, top: 180, width: 30, height: 28, fill: '#f06292', opacity: 0.6, angle: -10 },
      { type: 'heart', left: 800, top: 800, width: 35, height: 32, fill: '#e53935', opacity: 0.5, angle: 15 },
      // Large "7" — playful and huge
      { type: 'textbox', left: 340, top: 130, width: 400, text: '7', fontFamily: 'Pacifico', fontSize: 300, fill: '#ffffff', textAlign: 'center', shadow: { color: 'rgba(233,30,99,0.4)', blur: 30, offsetX: 4, offsetY: 8 } },
      // Heading
      { type: 'textbox', left: 100, top: 440, width: 880, text: 'Mia Turns Seven!', fontFamily: 'Pacifico', fontSize: 60, fill: '#ffffff', textAlign: 'center', shadow: { color: 'rgba(0,0,0,0.3)', blur: 12, offsetX: 2, offsetY: 4 } },
      // Subtitle
      { type: 'textbox', left: 100, top: 530, width: 880, text: 'Join us for cake, games & fun!', fontFamily: 'DM Sans', fontSize: 28, fill: 'rgba(255,255,255,0.9)', textAlign: 'center' },
      // Event details in a white pill
      { type: 'rect', left: 240, top: 610, width: 600, height: 110, fill: 'rgba(255,255,255,0.25)', rx: 20, ry: 20 },
      { type: 'textbox', left: 260, top: 625, width: 560, text: 'Saturday, April 12  \u00b7  2 \u2013 5 PM', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 260, top: 665, width: 560, text: 'The Johnson House \u00b7 42 Oak Lane', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(255,255,255,0.85)', textAlign: 'center' },
      // RSVP
      { type: 'textbox', left: 100, top: 770, width: 880, text: 'RSVP to Lisa \u00b7 (555) 234-5678', fontFamily: 'DM Sans', fontSize: 20, fill: 'rgba(255,255,255,0.7)', textAlign: 'center' },
      // Confetti diamonds
      { type: 'diamond', left: 450, top: 100, width: 16, height: 24, fill: '#8e24aa', opacity: 0.6, angle: 20 },
      { type: 'diamond', left: 700, top: 200, width: 14, height: 20, fill: '#1e88e5', opacity: 0.5, angle: -15 },
      { type: 'diamond', left: 300, top: 750, width: 12, height: 18, fill: '#fb8c00', opacity: 0.4, angle: 30 },
    ]),

  // ─── CONCERT POSTER — 2400×3600 ────────────────────────────────

  // 28. Concert — gradient on CTA button, shadow+charSpacing on heading
  tpl('concert-midnight', 'Midnight Echo Live', 'Dramatic concert poster with heavy typography, glow effect, and support acts',
    'Events', 'Concert', ['concert', 'music', 'poster', 'live', 'event'],
    2400, 3600, 'solid', '#0a0a0a', [
      { type: 'circle', left: 900, top: 600, radius: 400, fill: '#7c3aed', opacity: 0.03 },
      { type: 'circle', left: 1200, top: 900, radius: 300, fill: '#C4704A', opacity: 0.04 },
      { type: 'rect', left: 0, top: 1400, width: 2400, height: 6, fill: '#C4704A', opacity: 0.6 },
      { type: 'rect', left: 0, top: 1390, width: 2400, height: 30, fill: '#C4704A', opacity: 0.08 },
      { type: 'textbox', left: 100, top: 810, width: 2200, text: 'MIDNIGHT', fontFamily: 'Montserrat', fontSize: 200, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(124,58,237,0.3)', blur: 24, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 103, top: 813, width: 2200, text: 'MIDNIGHT', fontFamily: 'Montserrat', fontSize: 200, fontWeight: 'bold', fill: 'rgba(196,112,74,0.15)', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 1040, width: 2200, text: 'ECHO', fontFamily: 'Montserrat', fontSize: 200, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 103, top: 1043, width: 2200, text: 'ECHO', fontFamily: 'Montserrat', fontSize: 200, fontWeight: 'bold', fill: 'rgba(124,58,237,0.12)', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 1500, width: 2200, text: 'LIVE IN CONCERT', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 600 },
      { type: 'rect', left: 800, top: 1620, width: 280, height: 1, fill: 'rgba(255,255,255,0.15)' },
      { type: 'star', left: 1170, top: 1612, width: 16, height: 16, fill: '#7c3aed', opacity: 0.7 },
      { type: 'rect', left: 1320, top: 1620, width: 280, height: 1, fill: 'rgba(255,255,255,0.15)' },
      { type: 'textbox', left: 100, top: 1670, width: 2200, text: 'with NEON VALLEY & THE ARCHIVE', fontFamily: 'DM Sans', fontSize: 24, fill: '#7c3aed', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 100, top: 1750, width: 2200, text: 'October 18, 2026  \u00b7  Paramount Theater', fontFamily: 'DM Sans', fontSize: 32, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 1840, width: 2200, text: 'Doors 7 PM  \u00b7  Show 9 PM', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
      { type: 'rect', left: 850, top: 1960, width: 700, height: 80, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 700, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#7c3aed' }] }, rx: 40, ry: 40 },
      { type: 'textbox', left: 850, top: 1978, width: 700, text: 'Tickets from $45', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 200, top: 2200, width: 4, height: 500, fill: '#7c3aed', opacity: 0.06, angle: 8 },
      { type: 'rect', left: 800, top: 2300, width: 3, height: 600, fill: '#C4704A', opacity: 0.05, angle: -5 },
      { type: 'rect', left: 1600, top: 2150, width: 4, height: 550, fill: '#7c3aed', opacity: 0.07, angle: 12 },
      { type: 'rect', left: 2100, top: 2250, width: 3, height: 450, fill: '#C4704A', opacity: 0.04, angle: -8 },
      { type: 'rect', left: 350, top: 3200, width: 300, height: 80, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 300, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(124,58,237,0.15)' }, { offset: 1, color: 'rgba(124,58,237,0.05)' }] }, rx: 8, ry: 8 },
      { type: 'rect', left: 1050, top: 3200, width: 300, height: 80, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 300, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(196,112,74,0.15)' }, { offset: 1, color: 'rgba(196,112,74,0.05)' }] }, rx: 8, ry: 8 },
      { type: 'rect', left: 1750, top: 3200, width: 300, height: 80, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 300, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(124,58,237,0.15)' }, { offset: 1, color: 'rgba(124,58,237,0.05)' }] }, rx: 8, ry: 8 },
      { type: 'textbox', left: 350, top: 3225, width: 300, text: 'SPONSOR', fontFamily: 'Montserrat', fontSize: 14, fill: 'rgba(255,255,255,0.2)', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 1050, top: 3225, width: 300, text: 'SPONSOR', fontFamily: 'Montserrat', fontSize: 14, fill: 'rgba(255,255,255,0.2)', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 1750, top: 3225, width: 300, text: 'SPONSOR', fontFamily: 'Montserrat', fontSize: 14, fill: 'rgba(255,255,255,0.2)', textAlign: 'center', charSpacing: 200 },
      { type: 'diamond', left: 100, top: 3350, width: 12, height: 16, fill: '#7c3aed', opacity: 0.15 },
      { type: 'diamond', left: 2280, top: 3350, width: 12, height: 16, fill: '#C4704A', opacity: 0.15 },
      { type: 'textbox', left: 100, top: 3450, width: 2200, text: 'All ages \u00b7 VIP packages available at midnightecho.com', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(255,255,255,0.25)', textAlign: 'center' },
    ]),

  // ─── CONFERENCE BADGE — 750×1050 ───────────────────────────────

  // 29. Conference Badge — tech-forward dark design with teal accent, role pill, QR code
  tpl('conf-badge', 'TechSummit 2026 Badge', 'Tech conference badge with teal accent and QR code',
    'Events', 'Conference', ['conference', 'badge', 'tech', 'attendee'],
    750, 1050, 'solid', '#ffffff', [
      // Dark header — top 25%
      { type: 'rect', left: 0, top: 0, width: 750, height: 262, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 750, y2: 0 }, colorStops: [{ offset: 0, color: '#0f172a' }, { offset: 1, color: '#1e293b' }] } },
      // Gradient accent stripe
      { type: 'rect', left: 0, top: 258, width: 750, height: 4, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 750, y2: 0 }, colorStops: [{ offset: 0, color: '#0891b2' }, { offset: 1, color: '#22d3ee' }] } },
      // Conference name
      { type: 'textbox', left: 40, top: 50, width: 670, text: 'TECHSUMMIT', fontFamily: 'Montserrat', fontSize: 44, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 200 },
      // Year in teal
      { type: 'textbox', left: 40, top: 115, width: 670, text: '2026', fontFamily: 'Montserrat', fontSize: 32, fill: '#0891b2', textAlign: 'center', charSpacing: 150 },
      // Location
      { type: 'textbox', left: 40, top: 170, width: 670, text: 'San Francisco \u00b7 June 10\u201312', fontFamily: 'DM Sans', fontSize: 14, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
      // ATTENDEE role pill
      { type: 'rect', left: 290, top: 300, width: 170, height: 34, fill: '#0891b2', rx: 17, ry: 17 },
      { type: 'textbox', left: 290, top: 307, width: 170, text: 'ATTENDEE', fontFamily: 'Montserrat', fontSize: 11, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 150 },
      // Photo circle — left side, teal gradient
      { type: 'circle', left: 60, top: 390, radius: 55, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 110, y2: 110 }, colorStops: [{ offset: 0, color: '#0891b2' }, { offset: 1, color: '#164e63' }] } },
      // Name
      { type: 'textbox', left: 60, top: 520, width: 300, text: 'Jordan Park', fontFamily: 'Playfair Display', fontSize: 32, fill: '#0f172a' },
      // Title + company
      { type: 'textbox', left: 60, top: 565, width: 300, text: 'Software Engineer', fontFamily: 'DM Sans', fontSize: 14, fill: '#64748b' },
      { type: 'textbox', left: 60, top: 588, width: 300, text: 'Streamline Labs', fontFamily: 'DM Sans', fontSize: 14, fill: '#0891b2' },
      // QR code area — right side with grid lines
      { type: 'rect', left: 530, top: 390, width: 160, height: 160, fill: '#f1f5f9', rx: 8, ry: 8 },
      { type: 'rect', left: 550, top: 410, width: 120, height: 1, fill: '#cbd5e1', opacity: 0.5 },
      { type: 'rect', left: 550, top: 440, width: 120, height: 1, fill: '#cbd5e1', opacity: 0.5 },
      { type: 'rect', left: 550, top: 470, width: 120, height: 1, fill: '#cbd5e1', opacity: 0.5 },
      { type: 'rect', left: 550, top: 500, width: 120, height: 1, fill: '#cbd5e1', opacity: 0.5 },
      { type: 'rect', left: 580, top: 410, width: 1, height: 120, fill: '#cbd5e1', opacity: 0.5 },
      { type: 'rect', left: 610, top: 410, width: 1, height: 120, fill: '#cbd5e1', opacity: 0.5 },
      { type: 'rect', left: 640, top: 410, width: 1, height: 120, fill: '#cbd5e1', opacity: 0.5 },
      // Day indicators with labels
      { type: 'textbox', left: 60, top: 680, width: 80, text: 'DAY 1', fontFamily: 'DM Sans', fontSize: 10, fill: '#64748b', textAlign: 'center' },
      { type: 'circle', left: 90, top: 710, radius: 8, fill: '#0891b2' },
      { type: 'textbox', left: 160, top: 680, width: 80, text: 'DAY 2', fontFamily: 'DM Sans', fontSize: 10, fill: '#94a3b8', textAlign: 'center' },
      { type: 'circle', left: 190, top: 710, radius: 8, fill: 'rgba(0,0,0,0)', stroke: '#0891b2', strokeWidth: 1.5, strokeUniform: true },
      { type: 'textbox', left: 260, top: 680, width: 80, text: 'DAY 3', fontFamily: 'DM Sans', fontSize: 10, fill: '#94a3b8', textAlign: 'center' },
      { type: 'circle', left: 290, top: 710, radius: 8, fill: 'rgba(0,0,0,0)', stroke: '#0891b2', strokeWidth: 1.5, strokeUniform: true },
      // Bottom dark bar with WiFi
      { type: 'rect', left: 0, top: 990, width: 750, height: 60, fill: '#0f172a' },
      { type: 'textbox', left: 40, top: 1006, width: 670, text: 'WiFi: Summit-Guest  \u00b7  Pass: innovate2026', fontFamily: 'DM Sans', fontSize: 11, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
    ]),

  // ─── CHARITY GALA — 1500×2100 ──────────────────────────────────

  // 30. Gala — art deco aesthetic, ornamental border, gold on black, ticket tiers
  tpl('gala-evening', 'An Evening of Hope', 'Art deco charity gala with double-line border and fan motif',
    'Events', 'Gala', ['gala', 'charity', 'formal', 'invitation', 'fundraiser'],
    1500, 2100, 'solid', '#0d0d0d', [
      // Outer border — gold stroke, 2px
      { type: 'rect', left: 50, top: 50, width: 1400, height: 2000, fill: 'rgba(0,0,0,0)', stroke: '#d4a853', strokeWidth: 2, strokeUniform: true },
      // Inner border
      { type: 'rect', left: 70, top: 70, width: 1360, height: 1960, fill: 'rgba(0,0,0,0)', stroke: '#d4a853', strokeWidth: 1, strokeUniform: true },
      // Corner diamonds
      { type: 'diamond', left: 43, top: 43, width: 16, height: 16, fill: '#d4a853', angle: 45 },
      { type: 'diamond', left: 1441, top: 43, width: 16, height: 16, fill: '#d4a853', angle: 45 },
      { type: 'diamond', left: 43, top: 2041, width: 16, height: 16, fill: '#d4a853', angle: 45 },
      { type: 'diamond', left: 1441, top: 2041, width: 16, height: 16, fill: '#d4a853', angle: 45 },
      // Art deco fan/sunburst — thin lines radiating from center-top
      { type: 'rect', left: 748, top: 160, width: 2, height: 120, fill: '#d4a853', opacity: 0.15, angle: 0 },
      { type: 'rect', left: 748, top: 160, width: 2, height: 110, fill: '#d4a853', opacity: 0.12, angle: 15 },
      { type: 'rect', left: 748, top: 160, width: 2, height: 100, fill: '#d4a853', opacity: 0.10, angle: 30 },
      { type: 'rect', left: 748, top: 160, width: 2, height: 110, fill: '#d4a853', opacity: 0.12, angle: -15 },
      { type: 'rect', left: 748, top: 160, width: 2, height: 100, fill: '#d4a853', opacity: 0.10, angle: -30 },
      { type: 'rect', left: 748, top: 160, width: 2, height: 90, fill: '#d4a853', opacity: 0.08, angle: 45 },
      { type: 'rect', left: 748, top: 160, width: 2, height: 90, fill: '#d4a853', opacity: 0.08, angle: -45 },
      // Organization name
      { type: 'textbox', left: 150, top: 340, width: 1200, text: 'THE HARTWELL FOUNDATION', fontFamily: 'Montserrat', fontSize: 14, fill: '#d4a853', textAlign: 'center', charSpacing: 400 },
      // Main title — Playfair Display italic
      { type: 'textbox', left: 150, top: 440, width: 1200, text: 'An Evening\nof Hope', fontFamily: 'Playfair Display', fontSize: 72, fontStyle: 'italic', fill: '#faf8f0', textAlign: 'center', lineHeight: 1.25, shadow: { color: 'rgba(212,168,83,0.2)', blur: 20, offsetX: 0, offsetY: 4 } },
      // Gold divider
      { type: 'rect', left: 600, top: 660, width: 300, height: 1, fill: '#d4a853', opacity: 0.4 },
      // Purpose — Lora italic
      { type: 'textbox', left: 150, top: 700, width: 1200, text: 'Benefiting Children\u2019s Literacy Fund', fontFamily: 'Lora', fontSize: 20, fontStyle: 'italic', fill: 'rgba(250,248,240,0.5)', textAlign: 'center' },
      // Feature line
      { type: 'textbox', left: 150, top: 800, width: 1200, text: 'Dinner  \u00b7  Auction  \u00b7  Live Orchestra', fontFamily: 'DM Sans', fontSize: 16, fill: '#d4a853', textAlign: 'center', charSpacing: 150 },
      // Date
      { type: 'textbox', left: 150, top: 920, width: 1200, text: 'Saturday, November 8, 2026', fontFamily: 'Montserrat', fontSize: 22, fill: '#faf8f0', textAlign: 'center', charSpacing: 100 },
      // Time
      { type: 'textbox', left: 150, top: 960, width: 1200, text: '7:00 PM', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(250,248,240,0.45)', textAlign: 'center' },
      // Venue
      { type: 'textbox', left: 150, top: 1020, width: 1200, text: 'The Grand Ballroom, The Langham Hotel', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(250,248,240,0.6)', textAlign: 'center' },
      // Divider
      { type: 'rect', left: 600, top: 1100, width: 300, height: 1, fill: '#d4a853', opacity: 0.3 },
      // Ticket tiers — includes Patron
      { type: 'textbox', left: 150, top: 1140, width: 1200, text: 'General $250  \u00b7  VIP $500  \u00b7  Patron $1,000', fontFamily: 'DM Sans', fontSize: 20, fontWeight: 'bold', fill: '#faf8f0', textAlign: 'center' },
      // Dress code
      { type: 'textbox', left: 150, top: 1220, width: 1200, text: 'Black Tie', fontFamily: 'Montserrat', fontSize: 16, fill: '#d4a853', textAlign: 'center', charSpacing: 400 },
      // RSVP
      { type: 'textbox', left: 150, top: 1320, width: 1200, text: 'RSVP by May 30, 2026', fontFamily: 'DM Sans', fontSize: 16, fill: 'rgba(250,248,240,0.35)', textAlign: 'center' },
      // Website
      { type: 'textbox', left: 150, top: 1780, width: 1200, text: 'hartwellfoundation.org', fontFamily: 'DM Sans', fontSize: 14, fill: 'rgba(212,168,83,0.4)', textAlign: 'center', charSpacing: 150 },
    ]),

  // ─── WORKSHOP — 2550×3300 ──────────────────────────────────────

  // 31. Workshop — gradient on header bar, shadow+charSpacing on heading
  tpl('workshop-watercolor', 'Intro to Watercolor', 'Workshop announcement flyer with session schedule and registration',
    'Education', 'Workshop', ['workshop', 'art', 'watercolor', 'class', 'education'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 2550, height: 200, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 2550, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 0.5, color: '#d4966e' }, { offset: 1, color: '#8a5a3a' }] } },
      { type: 'textbox', left: 200, top: 50, width: 2150, text: 'WORKSHOP SERIES', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: 'rgba(255,255,255,0.7)', textAlign: 'center', charSpacing: 400 },
      { type: 'textbox', left: 200, top: 110, width: 2150, text: 'Spring 2026', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.5)', textAlign: 'center' },
      { type: 'circle', left: 200, top: 280, radius: 80, fill: '#C4704A', opacity: 0.08 },
      { type: 'circle', left: 2100, top: 350, radius: 60, fill: '#e8956d', opacity: 0.06 },
      { type: 'circle', left: 1800, top: 500, radius: 50, fill: '#d4a574', opacity: 0.10 },
      { type: 'circle', left: 300, top: 600, radius: 45, fill: '#7a9a6a', opacity: 0.07 },
      { type: 'circle', left: 2200, top: 700, radius: 70, fill: '#C4704A', opacity: 0.05 },
      { type: 'textbox', left: 200, top: 350, width: 2150, text: 'INTRO TO\nWATERCOLOR', fontFamily: 'Playfair Display', fontSize: 100, fill: '#1a1510', textAlign: 'center', lineHeight: 1.2, charSpacing: 80, shadow: { color: 'rgba(196,112,74,0.12)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'circle', left: 1140, top: 650, radius: 50, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 100, y2: 100 }, colorStops: [{ offset: 0, color: '#d4a574' }, { offset: 1, color: '#C4704A' }] } },
      { type: 'textbox', left: 200, top: 680, width: 900, text: 'with artist Maya Lin', fontFamily: 'DM Sans', fontSize: 30, fill: '#888070', textAlign: 'right' },
      { type: 'rect', left: 1125, top: 790, width: 300, height: 2, fill: '#C4704A' },
      { type: 'diamond', left: 400, top: 910, width: 14, height: 14, fill: '#C4704A' },
      { type: 'textbox', left: 440, top: 900, width: 1700, text: 'Session 1: Color Theory & Mixing  \u00b7  March 4', fontFamily: 'DM Sans', fontSize: 28, fill: '#2d2520' },
      { type: 'star', left: 398, top: 998, width: 16, height: 16, fill: '#7a9a6a' },
      { type: 'textbox', left: 440, top: 990, width: 1700, text: 'Session 2: Wet-on-Wet Techniques  \u00b7  March 11', fontFamily: 'DM Sans', fontSize: 28, fill: '#2d2520' },
      { type: 'hexagon', left: 398, top: 1088, width: 16, height: 16, fill: '#C4704A' },
      { type: 'textbox', left: 440, top: 1080, width: 1700, text: 'Session 3: Landscape Composition  \u00b7  March 18', fontFamily: 'DM Sans', fontSize: 28, fill: '#2d2520' },
      { type: 'rect', left: 200, top: 1180, width: 2150, height: 1, fill: '#e8dcc8' },
      { type: 'textbox', left: 200, top: 1230, width: 2150, text: 'Materials included  \u00b7  $120 per session', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center' },
      { type: 'textbox', left: 200, top: 1310, width: 2150, text: 'Lincoln Arts Center  \u00b7  Studio B  \u00b7  6:00 \u2013 8:30 PM', fontFamily: 'DM Sans', fontSize: 22, fill: '#aaa090', textAlign: 'center' },
      { type: 'rect', left: 200, top: 1410, width: 2150, height: 1, fill: '#e8dcc8' },
      { type: 'textbox', left: 200, top: 1470, width: 2150, text: 'WHAT\u2019S INCLUDED', fontFamily: 'Montserrat', fontSize: 20, fontWeight: 'bold', fill: '#7a9a6a', textAlign: 'center', charSpacing: 300 },
      { type: 'textbox', left: 300, top: 1530, width: 1950, text: 'Professional watercolor brushes, cold-press paper, palette,\nwater cups, reference prints \u2014 all included in your registration.', fontFamily: 'DM Sans', fontSize: 22, fill: '#555555', textAlign: 'center', lineHeight: 1.7 },
      { type: 'rect', left: 200, top: 1670, width: 2150, height: 1, fill: '#e8dcc8' },
      { type: 'textbox', left: 200, top: 1730, width: 2150, text: 'ABOUT THE INSTRUCTOR', fontFamily: 'Montserrat', fontSize: 20, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 300 },
      { type: 'textbox', left: 300, top: 1790, width: 1950, text: 'Maya Lin is a nationally exhibited watercolorist with 15 years of\nteaching experience. Her work has been featured in galleries across\nNew York, San Francisco, and Portland.', fontFamily: 'DM Sans', fontSize: 20, fill: '#555555', textAlign: 'center', lineHeight: 1.7 },
      { type: 'rect', left: 200, top: 1980, width: 2150, height: 1, fill: '#e8dcc8' },
      { type: 'textbox', left: 350, top: 2040, width: 1850, text: '\u201CMaya\u2019s workshop completely transformed how I approach color.\nI went from feeling lost to confident in just three sessions.\u201D', fontFamily: 'Playfair Display', fontSize: 24, fontStyle: 'italic', fill: '#888070', textAlign: 'center', lineHeight: 1.6 },
      { type: 'textbox', left: 350, top: 2170, width: 1850, text: '\u2014 Sarah K., past student', fontFamily: 'DM Sans', fontSize: 18, fill: '#aaa090', textAlign: 'center' },
      { type: 'rect', left: 200, top: 2260, width: 2150, height: 1, fill: '#e8dcc8' },
      { type: 'textbox', left: 200, top: 2310, width: 1050, text: 'Class size limited to 12 students', fontFamily: 'DM Sans', fontSize: 20, fill: '#555555', textAlign: 'center' },
      { type: 'textbox', left: 1300, top: 2310, width: 1050, text: 'Early bird: $100/session (before Feb 15)', fontFamily: 'DM Sans', fontSize: 20, fill: '#7a9a6a', textAlign: 'center' },
      { type: 'rect', left: 900, top: 2440, width: 750, height: 80, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 750, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#7a9a6a' }] }, rx: 40, ry: 40, shadow: { color: 'rgba(196,112,74,0.25)', blur: 16, offsetX: 0, offsetY: 6 } },
      { type: 'textbox', left: 900, top: 2458, width: 750, text: 'Register Now', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 200, top: 2580, width: 2150, text: 'lincolnarts.org/watercolor  \u00b7  (503) 555-0234  \u00b7  info@lincolnarts.org', fontFamily: 'DM Sans', fontSize: 18, fill: '#aaa090', textAlign: 'center' },
      { type: 'circle', left: 400, top: 2700, radius: 90, fill: '#7a9a6a', opacity: 0.06 },
      { type: 'circle', left: 1900, top: 2750, radius: 70, fill: '#C4704A', opacity: 0.05 },
      { type: 'circle', left: 1200, top: 2800, radius: 55, fill: '#d4a574', opacity: 0.08 },
      { type: 'rect', left: 0, top: 3200, width: 2550, height: 8, fill: '#7a9a6a', opacity: 0.4 },
      { type: 'pentagon', left: 2350, top: 2650, width: 20, height: 20, fill: '#7a9a6a', opacity: 0.15 },
      { type: 'heart', left: 150, top: 2680, width: 18, height: 18, fill: '#C4704A', opacity: 0.12 },
    ]),

  // ─── BOOK COVER — 1600×2560 ────────────────────────────────────

  // 32. Book Cover — gradient on decorative line, shadow on heading (already has charSpacing)
  tpl('book-cover-quiet', 'The Quiet Architecture of Days', 'Minimalist literary book cover with constellation pattern and review quote',
    'Creative', 'Book Cover', ['book', 'cover', 'novel', 'literary', 'minimal'],
    1600, 2560, 'gradient', 'linear:to-bottom:#1a1520:#2d1810', [
      { type: 'circle', left: 300, top: 320, radius: 4, fill: '#6a9bcc', opacity: 0.6 },
      { type: 'circle', left: 460, top: 280, radius: 3, fill: '#6a9bcc', opacity: 0.5 },
      { type: 'circle', left: 580, top: 370, radius: 5, fill: '#6a9bcc', opacity: 0.7 },
      { type: 'circle', left: 720, top: 300, radius: 3, fill: '#6a9bcc', opacity: 0.4 },
      { type: 'circle', left: 900, top: 350, radius: 6, fill: '#6a9bcc', opacity: 0.6 },
      { type: 'circle', left: 1050, top: 290, radius: 4, fill: '#6a9bcc', opacity: 0.5 },
      { type: 'circle', left: 1200, top: 380, radius: 3, fill: '#6a9bcc', opacity: 0.4 },
      { type: 'circle', left: 1320, top: 310, radius: 5, fill: '#6a9bcc', opacity: 0.6 },
      { type: 'rect', left: 304, top: 321, width: 162, height: 1, fill: 'rgba(106,155,204,0.2)', angle: -14 },
      { type: 'rect', left: 463, top: 281, width: 125, height: 1, fill: 'rgba(106,155,204,0.15)', angle: 36 },
      { type: 'rect', left: 583, top: 371, width: 145, height: 1, fill: 'rgba(106,155,204,0.2)', angle: -27 },
      { type: 'rect', left: 723, top: 301, width: 185, height: 1, fill: 'rgba(106,155,204,0.15)', angle: 15 },
      { type: 'rect', left: 903, top: 351, width: 155, height: 1, fill: 'rgba(106,155,204,0.2)', angle: -22 },
      { type: 'rect', left: 1053, top: 291, width: 155, height: 1, fill: 'rgba(106,155,204,0.15)', angle: 30 },
      { type: 'rect', left: 1203, top: 381, width: 125, height: 1, fill: 'rgba(106,155,204,0.2)', angle: -30 },
      { type: 'star', left: 740, top: 630, width: 20, height: 20, fill: '#C4704A', opacity: 0.4 },
      { type: 'star', left: 770, top: 635, width: 16, height: 16, fill: '#6a9bcc', opacity: 0.3 },
      { type: 'star', left: 800, top: 628, width: 22, height: 22, fill: '#C4704A', opacity: 0.35 },
      { type: 'textbox', left: 150, top: 720, width: 1300, text: 'THE QUIET\nARCHITECTURE\nOF DAYS', fontFamily: 'Playfair Display', fontSize: 88, fill: '#ffffff', textAlign: 'center', lineHeight: 1.4, charSpacing: 100, shadow: { color: 'rgba(106,155,204,0.3)', blur: 20, offsetX: 0, offsetY: 6 } },
      { type: 'star', left: 740, top: 1130, width: 18, height: 18, fill: '#6a9bcc', opacity: 0.35 },
      { type: 'star', left: 770, top: 1135, width: 14, height: 14, fill: '#C4704A', opacity: 0.3 },
      { type: 'star', left: 800, top: 1128, width: 20, height: 20, fill: '#6a9bcc', opacity: 0.4 },
      { type: 'textbox', left: 150, top: 1200, width: 1300, text: 'A NOVEL', fontFamily: 'Montserrat', fontSize: 20, fill: 'rgba(255,255,255,0.4)', textAlign: 'center', charSpacing: 600 },
      { type: 'textbox', left: 250, top: 1400, width: 1100, text: '\u201CA masterwork of restraint and beauty.\nPark writes silence the way others write thunder.\u201D', fontFamily: 'Lora', fontSize: 26, fontStyle: 'italic', fill: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.6 },
      { type: 'textbox', left: 250, top: 1550, width: 1100, text: '\u2014 The Literary Review', fontFamily: 'Montserrat', fontSize: 16, fill: 'rgba(106,155,204,0.6)', textAlign: 'center', charSpacing: 200 },
      { type: 'diamond', left: 760, top: 1650, width: 30, height: 40, fill: '#C4704A', opacity: 0.12 },
      { type: 'hexagon', left: 720, top: 1900, width: 50, height: 50, fill: '#6a9bcc', opacity: 0.08 },
      { type: 'textbox', left: 150, top: 2100, width: 1300, text: 'ELENA PARK', fontFamily: 'Montserrat', fontSize: 30, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 400 },
      { type: 'textbox', left: 150, top: 2350, width: 1300, text: 'MERIDIAN PRESS', fontFamily: 'Montserrat', fontSize: 14, fill: 'rgba(255,255,255,0.25)', textAlign: 'center', charSpacing: 500 },
      { type: 'star', left: 780, top: 2310, width: 12, height: 12, fill: '#6a9bcc', opacity: 0.2 },
    ]),

  // ─── FLASHCARD — 1050×750 ──────────────────────────────────────

  // 33. Flashcard — gradient on divider line, shadow+charSpacing on term heading
  tpl('flashcard-photo', 'Photosynthesis', 'Study flashcard with two-zone layout for term and definition',
    'Education', 'Flashcard', ['flashcard', 'study', 'biology', 'education', 'science'],
    1050, 750, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 420, height: 750, fill: '#e8f0e0' },
      { type: 'rect', left: 420, top: 80, width: 3, height: 590, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 590 }, colorStops: [{ offset: 0, color: '#7a9a6a' }, { offset: 1, color: 'rgba(122,154,106,0.1)' }] } },
      { type: 'textbox', left: 40, top: 260, width: 340, text: 'PHOTO\nSYNTHESIS', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#1a1510', textAlign: 'center', lineHeight: 1.3, charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'hexagon', left: 165, top: 430, width: 50, height: 50, fill: '#7a9a6a', opacity: 0.15 },
      { type: 'rect', left: 60, top: 520, width: 300, height: 120, fill: 'rgba(122,154,106,0.08)', stroke: 'rgba(122,154,106,0.3)', strokeWidth: 1, strokeUniform: true, rx: 4, ry: 4 },
      { type: 'textbox', left: 60, top: 560, width: 300, text: 'diagram', fontFamily: 'DM Sans', fontSize: 16, fill: 'rgba(122,154,106,0.5)', textAlign: 'center' },
      { type: 'star', left: 140, top: 180, width: 18, height: 18, fill: '#C4704A' },
      { type: 'star', left: 168, top: 180, width: 18, height: 18, fill: '#C4704A' },
      { type: 'star', left: 196, top: 180, width: 18, height: 18, fill: 'transparent', stroke: '#C4704A', strokeWidth: 1.5, strokeUniform: true },
      { type: 'textbox', left: 480, top: 200, width: 520, text: 'The process by which green plants convert sunlight, water, and carbon dioxide into glucose and oxygen.', fontFamily: 'DM Sans', fontSize: 22, fill: '#2d2520', lineHeight: 1.7 },
      { type: 'textbox', left: 480, top: 480, width: 520, text: '6CO\u2082 + 6H\u2082O \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082', fontFamily: 'Lora', fontSize: 18, fill: '#C4704A' },
      { type: 'textbox', left: 480, top: 620, width: 520, text: 'Biology  \u00b7  Chapter 8', fontFamily: 'DM Sans', fontSize: 14, fill: '#aaa090' },
      { type: 'textbox', left: 40, top: 700, width: 200, text: '1 of 20', fontFamily: 'DM Sans', fontSize: 13, fill: 'rgba(122,154,106,0.5)' },
      { type: 'diamond', left: 950, top: 100, width: 20, height: 28, fill: '#7a9a6a', opacity: 0.12 },
    ]),

  // ─── RESUME — 2550×3300 ────────────────────────────────────────

  // 34. Resume — gradient on sidebar, shadow+charSpacing on name heading
  tpl('resume-alex', 'Alex Rivera, UX Designer', 'Professional two-column resume with dark sidebar and skill bars',
    'Business', 'Resume', ['resume', 'cv', 'professional', 'career', 'job'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 700, height: 3300, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 3300 }, colorStops: [{ offset: 0, color: '#1a1a2e' }, { offset: 1, color: '#2d1810' }] } },
      { type: 'circle', left: 230, top: 60, radius: 60, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 120, y2: 120 }, colorStops: [{ offset: 0, color: '#1e3a5f' }, { offset: 1, color: '#C4704A' }] }, stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2, strokeUniform: true },
      { type: 'textbox', left: 60, top: 210, width: 580, text: 'ALEX\nRIVERA', fontFamily: 'Montserrat', fontSize: 52, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.2, charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 60, top: 390, width: 580, text: 'UX Designer', fontFamily: 'DM Sans', fontSize: 22, fill: '#C4704A' },
      { type: 'rect', left: 60, top: 450, width: 100, height: 2, fill: 'rgba(196,112,74,0.5)' },
      { type: 'textbox', left: 60, top: 510, width: 580, text: 'alex@rivera.design\n+1 (415) 555-7890\nSan Francisco, CA\nrivera.design', fontFamily: 'DM Sans', fontSize: 17, fill: 'rgba(255,255,255,0.6)', lineHeight: 2.0 },
      { type: 'textbox', left: 60, top: 780, width: 580, text: 'SKILLS', fontFamily: 'Montserrat', fontSize: 16, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      { type: 'textbox', left: 60, top: 840, width: 300, text: 'User Research', fontFamily: 'DM Sans', fontSize: 15, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 60, top: 870, width: 580, height: 4, fill: 'rgba(255,255,255,0.1)', rx: 2, ry: 2 },
      { type: 'rect', left: 60, top: 870, width: 520, height: 4, fill: '#C4704A', rx: 2, ry: 2 },
      { type: 'textbox', left: 60, top: 900, width: 300, text: 'Prototyping', fontFamily: 'DM Sans', fontSize: 15, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 60, top: 930, width: 580, height: 4, fill: 'rgba(255,255,255,0.1)', rx: 2, ry: 2 },
      { type: 'rect', left: 60, top: 930, width: 490, height: 4, fill: '#C4704A', rx: 2, ry: 2 },
      { type: 'textbox', left: 60, top: 960, width: 300, text: 'Design Systems', fontFamily: 'DM Sans', fontSize: 15, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 60, top: 990, width: 580, height: 4, fill: 'rgba(255,255,255,0.1)', rx: 2, ry: 2 },
      { type: 'rect', left: 60, top: 990, width: 550, height: 4, fill: '#C4704A', rx: 2, ry: 2 },
      { type: 'textbox', left: 60, top: 1080, width: 580, text: 'LANGUAGES', fontFamily: 'Montserrat', fontSize: 16, fontWeight: 'bold', fill: '#1e3a5f', charSpacing: 300 },
      { type: 'textbox', left: 60, top: 1130, width: 580, text: 'English \u2014 Native\nSpanish \u2014 Fluent\nPortuguese \u2014 Conversational', fontFamily: 'DM Sans', fontSize: 15, fill: 'rgba(255,255,255,0.6)', lineHeight: 2.0 },
      { type: 'textbox', left: 800, top: 150, width: 1600, text: 'PROFILE', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#1a1510', charSpacing: 300 },
      { type: 'rect', left: 800, top: 190, width: 80, height: 3, fill: '#1e3a5f' },
      { type: 'textbox', left: 800, top: 230, width: 1600, text: 'Creative UX designer with 6+ years of experience crafting user-centered digital products. Passionate about accessibility, design systems, and bridging the gap between research insights and elegant interfaces. Track record of leading cross-functional teams to ship products used by millions.', fontFamily: 'DM Sans', fontSize: 17, fill: '#555555', lineHeight: 1.7 },
      { type: 'textbox', left: 800, top: 420, width: 1600, text: 'EXPERIENCE', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#1a1510', charSpacing: 300 },
      { type: 'rect', left: 800, top: 460, width: 80, height: 3, fill: '#1e3a5f' },
      { type: 'textbox', left: 800, top: 500, width: 1600, text: 'Lead Designer', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#1a1510' },
      { type: 'textbox', left: 800, top: 540, width: 1600, text: 'Spotify  \u00b7  2023 \u2013 Present', fontFamily: 'DM Sans', fontSize: 17, fill: '#C4704A' },
      { type: 'textbox', left: 800, top: 580, width: 1600, text: 'Led redesign of the mobile listening experience, increasing user engagement by 24%. Managed a team of 5 designers across 3 product areas.', fontFamily: 'DM Sans', fontSize: 17, fill: '#555555', lineHeight: 1.7 },
      { type: 'textbox', left: 800, top: 720, width: 1600, text: 'Senior UX Designer', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#1a1510' },
      { type: 'textbox', left: 800, top: 760, width: 1600, text: 'Airbnb  \u00b7  2020 \u2013 2023', fontFamily: 'DM Sans', fontSize: 17, fill: '#C4704A' },
      { type: 'textbox', left: 800, top: 800, width: 1600, text: 'Designed the host onboarding flow that reduced setup time by 40%. Conducted 120+ user interviews to inform product direction.', fontFamily: 'DM Sans', fontSize: 17, fill: '#555555', lineHeight: 1.7 },
      { type: 'textbox', left: 800, top: 940, width: 1600, text: 'UX Designer', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#1a1510' },
      { type: 'textbox', left: 800, top: 980, width: 1600, text: 'Dropbox  \u00b7  2018 \u2013 2020', fontFamily: 'DM Sans', fontSize: 17, fill: '#C4704A' },
      { type: 'textbox', left: 800, top: 1020, width: 1600, text: 'Redesigned the file sharing experience for enterprise users. Created a component library that reduced design-to-dev handoff time by 35%.', fontFamily: 'DM Sans', fontSize: 17, fill: '#555555', lineHeight: 1.7 },
      { type: 'textbox', left: 800, top: 1200, width: 1600, text: 'EDUCATION', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#1a1510', charSpacing: 300 },
      { type: 'rect', left: 800, top: 1240, width: 80, height: 3, fill: '#1e3a5f' },
      { type: 'textbox', left: 800, top: 1280, width: 1600, text: 'MFA, Interaction Design', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#1a1510' },
      { type: 'textbox', left: 800, top: 1315, width: 1600, text: 'School of Visual Arts, New York  \u00b7  2016 \u2013 2018', fontFamily: 'DM Sans', fontSize: 17, fill: '#888070' },
      { type: 'textbox', left: 800, top: 1440, width: 1600, text: 'CERTIFICATIONS', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#1a1510', charSpacing: 300 },
      { type: 'rect', left: 800, top: 1480, width: 80, height: 3, fill: '#1e3a5f' },
      { type: 'textbox', left: 800, top: 1520, width: 1600, text: 'Google UX Design Professional Certificate', fontFamily: 'DM Sans', fontSize: 18, fill: '#1a1510' },
      { type: 'textbox', left: 800, top: 1550, width: 1600, text: 'Google  \u00b7  2022', fontFamily: 'DM Sans', fontSize: 15, fill: '#888070' },
      { type: 'textbox', left: 800, top: 1600, width: 1600, text: 'Certified Usability Analyst (CUA)', fontFamily: 'DM Sans', fontSize: 18, fill: '#1a1510' },
      { type: 'textbox', left: 800, top: 1630, width: 1600, text: 'Human Factors International  \u00b7  2021', fontFamily: 'DM Sans', fontSize: 15, fill: '#888070' },
      { type: 'diamond', left: 310, top: 2800, width: 40, height: 55, fill: '#1e3a5f', opacity: 0.15 },
      { type: 'hexagon', left: 500, top: 3000, width: 35, height: 35, fill: '#C4704A', opacity: 0.1 },
    ]),

  // ─── BATCH 3: Education + Creative + Food & Lifestyle + Seasonal (35-50) ──


  // ─── EDUCATION ──────────────────────────────────────────────────────

  // 35. Study Guide — gradient on accent bar, shadow+charSpacing on heading
  tpl('study-guide-bio', 'Biology Chapter 12', 'Study guide with key term highlights and diagram placeholder',
    'Education', 'Study Guide', ['biology', 'study', 'science', 'school'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'textbox', left: 150, top: 120, width: 2250, text: 'BIOLOGY \u00b7 CHAPTER 12', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#6b7280', textAlign: 'left', charSpacing: 300 },
      { type: 'rect', left: 150, top: 175, width: 300, height: 5, fill: '#7a9a6a' },
      { type: 'textbox', left: 150, top: 220, width: 2250, text: 'Cell Division & Mitosis', fontFamily: 'Playfair Display', fontSize: 72, fontWeight: 'bold', fill: '#1a1a1a', charSpacing: 50, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 150, top: 380, width: 2250, height: 4, fill: '#e5e7eb' },
      { type: 'rect', left: 150, top: 440, width: 8, height: 680, fill: '#7a9a6a' },
      { type: 'textbox', left: 190, top: 440, width: 1400, text: 'KEY TERMS', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#7a9a6a' },
      { type: 'rect', left: 185, top: 488, width: 700, height: 42, fill: 'rgba(122,154,106,0.1)', rx: 4, ry: 4 },
      { type: 'rect', left: 185, top: 620, width: 700, height: 42, fill: 'rgba(122,154,106,0.1)', rx: 4, ry: 4 },
      { type: 'textbox', left: 190, top: 490, width: 1400, text: 'Mitosis \u2014 the process by which a cell divides its nucleus into two identical daughter nuclei\nInterphase \u2014 the resting phase between successive mitotic divisions\nChromatin \u2014 the material of which chromosomes are composed\nCytokinesis \u2014 the cytoplasmic division of a cell at the end of mitosis\nCentromere \u2014 the point on a chromosome where the spindle fiber is attached', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 1700, top: 440, width: 700, height: 500, fill: 'rgba(122,154,106,0.05)', stroke: '#7a9a6a', strokeWidth: 2, strokeUniform: true, rx: 6, ry: 6 },
      { type: 'textbox', left: 1700, top: 600, width: 700, text: 'Mitosis Stages', fontFamily: 'Montserrat', fontSize: 20, fontWeight: 'bold', fill: '#7a9a6a', textAlign: 'center' },
      { type: 'textbox', left: 1700, top: 660, width: 700, text: 'diagram', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(122,154,106,0.4)', textAlign: 'center' },
      { type: 'hexagon', left: 2000, top: 740, width: 40, height: 40, fill: '#7a9a6a', opacity: 0.12 },
      { type: 'rect', left: 150, top: 1160, width: 8, height: 680, fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 1160, width: 2160, text: 'PROCESS STEPS', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 1210, width: 2160, text: '1. Prophase \u2014 Chromatin condenses into visible chromosomes\n2. Prometaphase \u2014 Nuclear envelope breaks down\n3. Metaphase \u2014 Chromosomes align at the cell equator\n4. Anaphase \u2014 Sister chromatids separate and move to poles\n5. Telophase \u2014 Nuclear envelopes reform around each set', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 150, top: 1880, width: 8, height: 500, fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 1880, width: 2160, text: 'REVIEW QUESTIONS', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 1930, width: 2160, text: '1. What is the difference between mitosis and meiosis?\n2. Why is interphase the longest phase of the cell cycle?\n3. Describe the role of the spindle fibers during cell division.\n4. How does cytokinesis differ in plant and animal cells?', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 150, top: 2600, width: 2250, height: 60, fill: '#C4704A', opacity: 0.08 },
      { type: 'textbox', left: 190, top: 2612, width: 1800, text: 'AP Biology \u00b7 Mrs. Khatri \u00b7 Period 3', fontFamily: 'DM Sans', fontSize: 20, fill: '#9ca3af' },
      { type: 'textbox', left: 1900, top: 2612, width: 500, text: 'Page 1 of 3', fontFamily: 'DM Sans', fontSize: 20, fill: '#9ca3af', textAlign: 'right' },
      { type: 'star', left: 2300, top: 130, width: 24, height: 24, fill: '#7a9a6a', opacity: 0.15 },
      { type: 'diamond', left: 2350, top: 180, width: 16, height: 22, fill: '#C4704A', opacity: 0.1 },
    ]),

  // ─── CREATIVE ───────────────────────────────────────────────────────

  // 36. Album Cover — dark geometric, concentric circles, radiating lines, glow text
  tpl('album-velvet', 'Velvet Horizon', 'Dark geometric album cover with concentric circles and glowing typography',
    'Creative', 'Album Cover', ['album', 'music', 'cover art', 'modern'],
    3000, 3000, 'gradient', 'linear:to-bottom-right:#2d1b4e:#0a0a1a', [
      // Concentric circles
      { type: 'circle', left: 1100, top: 900, radius: 600, fill: 'rgba(120,60,180,0.08)', stroke: 'rgba(180,120,255,0.12)', strokeWidth: 1, strokeUniform: true },
      { type: 'circle', left: 1150, top: 950, radius: 500, fill: 'rgba(140,70,200,0.10)', stroke: 'rgba(180,120,255,0.10)', strokeWidth: 1, strokeUniform: true },
      { type: 'circle', left: 1200, top: 1000, radius: 400, fill: 'rgba(160,80,220,0.12)', stroke: 'rgba(180,120,255,0.08)', strokeWidth: 1, strokeUniform: true },
      { type: 'circle', left: 1300, top: 1100, radius: 250, fill: 'rgba(180,100,240,0.15)', stroke: 'rgba(200,140,255,0.15)', strokeWidth: 1, strokeUniform: true },
      { type: 'circle', left: 1380, top: 1180, radius: 120, fill: 'rgba(200,120,255,0.20)' },
      // Large diamond overlapping the circles
      { type: 'diamond', left: 1200, top: 850, width: 600, height: 900, fill: 'rgba(140,60,200,0.10)', stroke: 'rgba(180,120,255,0.18)', strokeWidth: 1, strokeUniform: true },
      // Radiating lines from center (thin rects at various angles)
      { type: 'rect', left: 1490, top: 800, width: 3, height: 500, fill: 'rgba(180,120,255,0.08)', angle: 0 },
      { type: 'rect', left: 1490, top: 800, width: 3, height: 500, fill: 'rgba(180,120,255,0.06)', angle: 45 },
      { type: 'rect', left: 1490, top: 800, width: 3, height: 500, fill: 'rgba(180,120,255,0.08)', angle: 90 },
      { type: 'rect', left: 1490, top: 800, width: 3, height: 500, fill: 'rgba(180,120,255,0.06)', angle: 135 },
      { type: 'rect', left: 1490, top: 800, width: 3, height: 500, fill: 'rgba(180,120,255,0.05)', angle: 22 },
      { type: 'rect', left: 1490, top: 800, width: 3, height: 500, fill: 'rgba(180,120,255,0.05)', angle: 67 },
      { type: 'rect', left: 1490, top: 800, width: 3, height: 500, fill: 'rgba(180,120,255,0.05)', angle: 112 },
      { type: 'rect', left: 1490, top: 800, width: 3, height: 500, fill: 'rgba(180,120,255,0.05)', angle: 157 },
      // Corner geometric accents
      { type: 'triangle', left: 80, top: 80, width: 200, height: 200, fill: 'rgba(140,60,200,0.06)' },
      { type: 'triangle', left: 2700, top: 2700, width: 220, height: 220, fill: 'rgba(140,60,200,0.06)', angle: 180 },
      { type: 'diamond', left: 2600, top: 200, width: 80, height: 120, fill: 'rgba(180,120,255,0.05)', angle: 15 },
      { type: 'diamond', left: 150, top: 2500, width: 60, height: 90, fill: 'rgba(180,120,255,0.05)', angle: -10 },
      // Band name — AURORA SAINTS — large Oswald with purple glow
      { type: 'textbox', left: 200, top: 1600, width: 2600, text: 'AURORA SAINTS', fontFamily: 'Oswald', fontSize: 120, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 300, shadow: { color: 'rgba(160,80,220,0.7)', blur: 40, offsetX: 0, offsetY: 0 } },
      // Album title — VELVET HORIZON
      { type: 'textbox', left: 200, top: 1780, width: 2600, text: 'VELVET HORIZON', fontFamily: 'Playfair Display', fontSize: 72, fontStyle: 'italic', fill: 'rgba(255,255,255,0.75)', textAlign: 'center', charSpacing: 200, shadow: { color: 'rgba(140,60,200,0.4)', blur: 20, offsetX: 0, offsetY: 4 } },
      // Divider
      { type: 'rect', left: 1100, top: 1900, width: 800, height: 1, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 800, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(180,120,255,0.05)' }, { offset: 0.5, color: 'rgba(180,120,255,0.4)' }, { offset: 1, color: 'rgba(180,120,255,0.05)' }] } },
      // Year and label
      { type: 'textbox', left: 200, top: 2650, width: 2600, text: '2026', fontFamily: 'Oswald', fontSize: 28, fill: 'rgba(255,255,255,0.35)', textAlign: 'center', charSpacing: 600 },
      { type: 'textbox', left: 200, top: 2720, width: 2600, text: 'ECLIPSE RECORDS', fontFamily: 'Montserrat', fontSize: 18, fill: 'rgba(255,255,255,0.25)', textAlign: 'center', charSpacing: 500 },
      // Parental advisory placeholder
      { type: 'rect', left: 2560, top: 2680, width: 260, height: 160, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.25)', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 2570, top: 2720, width: 240, text: 'EXPLICIT', fontFamily: 'Montserrat', fontSize: 16, fontWeight: 'bold', fill: 'rgba(255,255,255,0.6)', textAlign: 'center', charSpacing: 300 },
      // Horizontal scan lines
      { type: 'rect', left: 0, top: 600, width: 3000, height: 1, fill: 'rgba(180,120,255,0.03)' },
      { type: 'rect', left: 0, top: 1200, width: 3000, height: 1, fill: 'rgba(180,120,255,0.03)' },
      { type: 'rect', left: 0, top: 2400, width: 3000, height: 1, fill: 'rgba(180,120,255,0.03)' },
    ]),

  // 37. Movie Poster — gradient on accent line, shadow+charSpacing on heading
  tpl('movie-poster-signal', 'The Last Signal', 'Cinematic movie poster with signal wave arcs and rating badge',
    'Creative', 'Movie Poster', ['movie', 'poster', 'film', 'cinematic'],
    2400, 3600, 'solid', '#0a0505', [
      { type: 'rect', left: 0, top: 0, width: 2400, height: 3600, fill: 'rgba(196,112,74,0.04)' },
      { type: 'circle', left: 900, top: -200, radius: 300, fill: 'transparent', stroke: 'rgba(139,37,0,0.3)', strokeWidth: 2, strokeUniform: true },
      { type: 'circle', left: 750, top: -350, radius: 450, fill: 'transparent', stroke: 'rgba(139,37,0,0.2)', strokeWidth: 2, strokeUniform: true },
      { type: 'circle', left: 600, top: -500, radius: 600, fill: 'transparent', stroke: 'rgba(139,37,0,0.15)', strokeWidth: 1.5, strokeUniform: true },
      { type: 'circle', left: 450, top: -650, radius: 750, fill: 'transparent', stroke: 'rgba(139,37,0,0.1)', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 200, top: 900, width: 2000, text: 'THE LAST\nSIGNAL', fontFamily: 'Playfair Display', fontSize: 220, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 1.05, charSpacing: 80, shadow: { color: 'rgba(139,37,0,0.4)', blur: 30, offsetX: 0, offsetY: 8 } },
      { type: 'textbox', left: 300, top: 1450, width: 1800, text: 'In a world gone silent, one signal remains.', fontFamily: 'Lora', fontSize: 42, fontStyle: 'italic', fill: 'rgba(255,255,255,0.65)', textAlign: 'center' },
      { type: 'rect', left: 100, top: 100, width: 120, height: 50, fill: 'rgba(139,37,0,0.8)', rx: 4, ry: 4 },
      { type: 'textbox', left: 100, top: 110, width: 120, text: 'PG-13', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 300, top: 2800, width: 750, height: 2, fill: 'rgba(196,112,74,0.5)' },
      { type: 'star', left: 1140, top: 2790, width: 22, height: 22, fill: '#C4704A', opacity: 0.7 },
      { type: 'rect', left: 1200, top: 2800, width: 900, height: 2, fill: 'rgba(196,112,74,0.5)' },
      { type: 'textbox', left: 300, top: 2840, width: 1800, text: 'STARRING  DANIEL KIM  \u00b7  SOPHIA REYES  \u00b7  MARCO BIANCHI', fontFamily: 'DM Sans', fontSize: 24, fill: 'rgba(255,255,255,0.5)', textAlign: 'center', charSpacing: 150 },
      { type: 'textbox', left: 300, top: 2920, width: 1800, text: 'DIRECTED BY ELENA VASQUEZ  \u00b7  SCREENPLAY BY JAMES OKAFOR  \u00b7  MUSIC BY YUKI TANAKA', fontFamily: 'DM Sans', fontSize: 14, fill: 'rgba(255,255,255,0.3)', textAlign: 'center', charSpacing: 100 },
      { type: 'textbox', left: 300, top: 3000, width: 1800, text: 'COMING FALL 2026', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 400 },
      { type: 'rect', left: 1050, top: 3300, width: 300, height: 80, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 300, y2: 0 }, colorStops: [{ offset: 0, color: '#8b2500' }, { offset: 1, color: '#C4704A' }] }, rx: 6, ry: 6, opacity: 0.6 },
      { type: 'textbox', left: 1050, top: 3320, width: 300, text: 'STUDIO', fontFamily: 'Montserrat', fontSize: 14, fill: 'rgba(255,255,255,0.5)', textAlign: 'center', charSpacing: 300 },
      { type: 'diamond', left: 2150, top: 200, width: 40, height: 60, fill: '#8b2500', opacity: 0.15 },
      { type: 'hexagon', left: 150, top: 3400, width: 50, height: 50, fill: '#8b2500', opacity: 0.08 },
    ]),

  // 38. Magazine Cover — gradient on barcode rect, shadow+charSpacing on heading
  tpl('magazine-form', 'FORM Issue 23', 'Magazine cover with gradient photo placeholder and editorial layout',
    'Creative', 'Magazine Cover', ['magazine', 'cover', 'editorial', 'design'],
    2550, 3300, 'solid', '#f0ece4', [
      { type: 'textbox', left: 150, top: 100, width: 2250, text: 'FORM', fontFamily: 'Playfair Display', fontSize: 200, fontWeight: 'bold', fill: '#1a1a1a', textAlign: 'center', charSpacing: 300, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 150, top: 330, width: 2250, text: 'ISSUE 23 \u00b7 SPRING 2026', fontFamily: 'DM Sans', fontSize: 22, fill: '#888880', textAlign: 'center', charSpacing: 400 },
      { type: 'textbox', left: 2100, top: 40, width: 350, text: '$12.99', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#1a1a1a', textAlign: 'right' },
      { type: 'textbox', left: 2100, top: 72, width: 350, text: 'US / UK / EU', fontFamily: 'DM Sans', fontSize: 13, fill: '#888880', textAlign: 'right' },
      { type: 'rect', left: 300, top: 480, width: 1950, height: 1600, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1950, y2: 1600 }, colorStops: [{ offset: 0, color: '#d5c8b8' }, { offset: 0.5, color: '#c4a48a' }, { offset: 1, color: '#b09080' }] }, rx: 4, ry: 4 },
      { type: 'rect', left: 150, top: 2140, width: 180, height: 36, fill: '#b5838d', rx: 4, ry: 4 },
      { type: 'textbox', left: 155, top: 2148, width: 170, text: 'EXCLUSIVE', fontFamily: 'Montserrat', fontSize: 12, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 150, top: 2200, width: 2250, text: 'The Future of\nSustainable Design', fontFamily: 'Playfair Display', fontSize: 72, fill: '#1a1a1a', lineHeight: 1.2 },
      { type: 'textbox', left: 150, top: 2440, width: 2250, text: 'Interview: Neri Oxman on Material Ecology', fontFamily: 'DM Sans', fontSize: 30, fill: '#C4704A' },
      { type: 'rect', left: 150, top: 2490, width: 60, height: 2, fill: '#b5838d' },
      { type: 'textbox', left: 150, top: 2520, width: 1500, text: 'Plus: 40 Studios Redefining Craft \u00b7 The Rise of Bio-Materials \u00b7 Tokyo Design Week Report', fontFamily: 'DM Sans', fontSize: 22, fill: '#6b6b60', lineHeight: 1.6 },
      { type: 'rect', left: 2050, top: 2900, width: 200, height: 260, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 260 }, colorStops: [{ offset: 0, color: '#1a1a1a' }, { offset: 1, color: '#2d1810' }] } },
      { type: 'textbox', left: 2060, top: 3070, width: 180, text: 'BARCODE', fontFamily: 'DM Sans', fontSize: 10, fill: '#ffffff', textAlign: 'center' },
      { type: 'diamond', left: 2300, top: 2200, width: 30, height: 42, fill: '#b5838d', opacity: 0.2 },
      { type: 'star', left: 100, top: 2450, width: 22, height: 22, fill: '#C4704A', opacity: 0.15 },
    ]),

  // 39. Exhibition — gradient on accent bar, shadow+charSpacing on heading (already has charSpacing)
  tpl('art-exhibition', 'Fragments', 'Gallery exhibition poster with abstract art preview',
    'Creative', 'Exhibition', ['art', 'gallery', 'exhibition', 'poster', 'minimal'],
    2400, 3600, 'solid', '#faf8f5', [
      { type: 'rect', left: 200, top: 200, width: 800, height: 500, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 800, y2: 500 }, colorStops: [{ offset: 0, color: '#2d2a26' }, { offset: 0.6, color: '#4a4540' }, { offset: 1, color: '#1a1a1a' }] }, shadow: { color: 'rgba(0,0,0,0.12)', blur: 24, offsetX: 0, offsetY: 8 } },
      { type: 'triangle', left: 380, top: 280, width: 240, height: 300, fill: '#C4704A', opacity: 0.7 },
      { type: 'circle', left: 700, top: 340, radius: 90, fill: '#8a8078', opacity: 0.5 },
      { type: 'rect', left: 280, top: 440, width: 350, height: 180, fill: 'rgba(138,128,120,0.25)', angle: -8 },
      { type: 'rect', left: 1600, top: 200, width: 2, height: 2800, fill: '#8a8078', opacity: 0.4 },
      { type: 'diamond', left: 1590, top: 1600, width: 22, height: 32, fill: '#C4704A', opacity: 0.25 },
      { type: 'textbox', left: 200, top: 850, width: 1300, text: 'FRAGMENTS', fontFamily: 'Playfair Display', fontSize: 140, fill: '#1a1a1a', textAlign: 'left', charSpacing: 600, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 1050, width: 1300, text: 'Works by Yuki Tanaka', fontFamily: 'Lora', fontSize: 36, fontStyle: 'italic', fill: '#6b6b60' },
      { type: 'rect', left: 200, top: 1130, width: 300, height: 1, fill: '#8a8078', opacity: 0.3 },
      { type: 'hexagon', left: 1750, top: 900, width: 60, height: 60, fill: 'rgba(138,128,120,0.1)' },
      { type: 'star', left: 1850, top: 1050, width: 24, height: 24, fill: '#C4704A', opacity: 0.15 },
      { type: 'textbox', left: 200, top: 2600, width: 1200, text: 'March 1 \u2013 April 30, 2026', fontFamily: 'DM Sans', fontSize: 30, fill: '#1a1a1a' },
      { type: 'textbox', left: 200, top: 2660, width: 1200, text: 'Opening Reception: March 1, 6\u20139 PM', fontFamily: 'DM Sans', fontSize: 24, fill: '#8a8078' },
      { type: 'rect', left: 200, top: 2740, width: 200, height: 2, fill: '#1a1a1a' },
      { type: 'textbox', left: 200, top: 2780, width: 1200, text: 'Whitespace Gallery \u00b7 Portland', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1a1a1a' },
      { type: 'rect', left: 1700, top: 3200, width: 400, height: 1, fill: '#8a8078', opacity: 0.2 },
      { type: 'diamond', left: 2150, top: 3190, width: 16, height: 24, fill: '#8a8078', opacity: 0.2 },
      { type: 'circle', left: 1680, top: 3400, radius: 30, fill: 'rgba(196,112,74,0.06)' },
    ]),

  // 40. Photography Portfolio — landscape layout with dark sidebar and asymmetric image grid
  tpl('photo-portfolio', 'Kai Nomura', 'Photography portfolio with dark sidebar and asymmetric grid',
    'Creative', 'Portfolio', ['photography', 'portfolio', 'minimal', 'grid'],
    3300, 2550, 'solid', '#faf8f0', [
      // Left sidebar — dark gradient (25%)
      { type: 'rect', left: 0, top: 0, width: 825, height: 2550, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 2550 }, colorStops: [{ offset: 0, color: '#1a1510' }, { offset: 1, color: '#2d2520' }] } },
      // Accent line between sidebar and grid
      { type: 'rect', left: 825, top: 0, width: 2, height: 2550, fill: '#C4704A', opacity: 0.3 },
      // Photographer name — stacked high in sidebar
      { type: 'textbox', left: 80, top: 120, width: 660, text: 'KAI\nNOMURA', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.15, charSpacing: 200 },
      // Specialties
      { type: 'rect', left: 80, top: 290, width: 80, height: 2, fill: '#C4704A' },
      { type: 'textbox', left: 80, top: 310, width: 660, text: 'Editorial \u00b7 Architecture \u00b7 Portrait', fontFamily: 'DM Sans', fontSize: 16, fill: 'rgba(255,255,255,0.5)' },
      // Contact — each on own line
      { type: 'textbox', left: 80, top: 1500, width: 660, text: 'kai@kainomura.com', fontFamily: 'DM Sans', fontSize: 16, fill: 'rgba(255,255,255,0.6)' },
      { type: 'textbox', left: 80, top: 1535, width: 660, text: '(503) 555-0234', fontFamily: 'DM Sans', fontSize: 16, fill: 'rgba(255,255,255,0.6)' },
      { type: 'textbox', left: 80, top: 1570, width: 660, text: 'kainomura.com', fontFamily: 'DM Sans', fontSize: 16, fill: '#C4704A' },
      // Small accent divider
      { type: 'rect', left: 80, top: 1620, width: 40, height: 1, fill: 'rgba(196,112,74,0.4)' },
      // Based in
      { type: 'textbox', left: 80, top: 1650, width: 660, text: 'Based in Portland, OR', fontFamily: 'DM Sans', fontSize: 14, fill: 'rgba(255,255,255,0.35)' },
      // RIGHT AREA — asymmetric grid on cream bg
      // Large hero rect — warm amber to sienna
      { type: 'rect', left: 880, top: 80, width: 1400, height: 1000, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1400, y2: 1000 }, colorStops: [{ offset: 0, color: '#c9a96e' }, { offset: 1, color: '#c4704a' }] }, rx: 4, ry: 4, shadow: { color: 'rgba(0,0,0,0.08)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 880, top: 1100, width: 1400, text: 'VOGUE JAPAN', fontFamily: 'DM Sans', fontSize: 14, fill: '#5c5248' },
      // Three smaller rects with different gradients
      { type: 'rect', left: 2340, top: 80, width: 880, height: 480, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 880, y2: 480 }, colorStops: [{ offset: 0, color: '#7a9a6a' }, { offset: 1, color: '#d4ccc4' }] }, rx: 4, ry: 4, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 3 } },
      { type: 'textbox', left: 2340, top: 580, width: 880, text: 'THE MODERN HOUSE', fontFamily: 'DM Sans', fontSize: 14, fill: '#5c5248' },
      { type: 'rect', left: 2340, top: 640, width: 880, height: 480, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 880, y2: 480 }, colorStops: [{ offset: 0, color: '#b5838d' }, { offset: 1, color: '#e8d5d0' }] }, rx: 4, ry: 4, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 3 } },
      { type: 'textbox', left: 2340, top: 1140, width: 880, text: 'STUDIO PORTRAIT', fontFamily: 'DM Sans', fontSize: 14, fill: '#5c5248' },
      { type: 'rect', left: 880, top: 1180, width: 1400, height: 480, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1400, y2: 480 }, colorStops: [{ offset: 0, color: '#9a9088' }, { offset: 1, color: '#d4ccc4' }] }, rx: 4, ry: 4, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 3 } },
      { type: 'textbox', left: 880, top: 1680, width: 1400, text: 'GOLDEN HOUR', fontFamily: 'DM Sans', fontSize: 14, fill: '#5c5248' },
    ]),

  // ─── EVENTS ─────────────────────────────────────────────────────────

  // 41. Music Festival — gradient on lineup bg area, shadow+charSpacing on heading
  tpl('music-festival', 'Solstice Festival 2026', 'Music festival poster with lineup hierarchy',
    'Events', 'Music Festival', ['music', 'festival', 'concert', 'lineup'],
    2400, 3600, 'gradient', 'linear:to-bottom:#ff6b35:#C4704A', [
      { type: 'star', left: 1700, top: 100, width: 80, height: 80, fill: 'rgba(255,255,255,0.1)', angle: 15 },
      { type: 'star', left: 200, top: 200, width: 40, height: 40, fill: 'rgba(212,168,83,0.2)', angle: 30 },
      { type: 'star', left: 2100, top: 350, width: 50, height: 50, fill: 'rgba(255,255,255,0.08)', angle: -10 },
      { type: 'diamond', left: 1900, top: 150, width: 30, height: 45, fill: '#d4a853', opacity: 0.2 },
      { type: 'textbox', left: 200, top: 250, width: 2000, text: 'SOLSTICE', fontFamily: 'Montserrat', fontSize: 220, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 510, width: 2000, text: 'MUSIC FESTIVAL 2026', fontFamily: 'DM Sans', fontSize: 36, fill: 'rgba(255,255,255,0.8)', textAlign: 'center', charSpacing: 500 },
      { type: 'rect', left: 800, top: 620, width: 800, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 800, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(212,168,83,0)' }, { offset: 0.5, color: '#d4a853' }, { offset: 1, color: 'rgba(212,168,83,0)' }] } },
      { type: 'rect', left: 250, top: 720, width: 1900, height: 1800, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 1800 }, colorStops: [{ offset: 0, color: 'rgba(0,0,0,0.35)' }, { offset: 1, color: 'rgba(0,0,0,0.15)' }] }, rx: 16, ry: 16 },
      { type: 'textbox', left: 350, top: 780, width: 1700, text: 'HEADLINERS', fontFamily: 'DM Sans', fontSize: 18, fill: '#d4a853', textAlign: 'center', charSpacing: 500 },
      { type: 'textbox', left: 350, top: 830, width: 1700, text: 'THE MIDNIGHT', fontFamily: 'Montserrat', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 80, shadow: { color: 'rgba(212,168,83,0.4)', blur: 20, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 350, top: 930, width: 1700, text: 'KHRUANGBIN', fontFamily: 'Montserrat', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 80 },
      { type: 'textbox', left: 350, top: 1030, width: 1700, text: 'BONOBO', fontFamily: 'Montserrat', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 80 },
      { type: 'rect', left: 600, top: 1140, width: 1200, height: 1, fill: 'rgba(212,168,83,0.3)' },
      { type: 'textbox', left: 350, top: 1180, width: 1700, text: 'Glass Animals  \u00b7  Tame Impala  \u00b7  Tycho', fontFamily: 'DM Sans', fontSize: 44, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 350, top: 1260, width: 1700, text: 'Raveena  \u00b7  Wet Leg  \u00b7  Floating Points', fontFamily: 'DM Sans', fontSize: 44, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 700, top: 1350, width: 1000, height: 1, fill: 'rgba(255,255,255,0.2)' },
      { type: 'textbox', left: 350, top: 1390, width: 1700, text: 'Caribou \u00b7 Jungle \u00b7 Bicep \u00b7 Four Tet \u00b7 Sault', fontFamily: 'DM Sans', fontSize: 28, fill: 'rgba(255,255,255,0.7)', textAlign: 'center' },
      { type: 'textbox', left: 350, top: 1440, width: 1700, text: 'Hiatus Kaiyote \u00b7 Little Dragon \u00b7 BadBadNotGood \u00b7 Yussef Dayes', fontFamily: 'DM Sans', fontSize: 28, fill: 'rgba(255,255,255,0.7)', textAlign: 'center' },
      { type: 'textbox', left: 350, top: 1510, width: 1700, text: 'PLUS 30+ MORE ARTISTS', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.45)', textAlign: 'center', charSpacing: 300 },
      { type: 'rect', left: 350, top: 1600, width: 1700, height: 70, fill: 'rgba(212,168,83,0.12)', rx: 8, ry: 8 },
      { type: 'textbox', left: 350, top: 1615, width: 1700, text: 'GA $129  \u00b7  VIP $349  \u00b7  Platinum $599', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#d4a853', textAlign: 'center', charSpacing: 100 },
      { type: 'textbox', left: 200, top: 2700, width: 2000, text: 'JUNE 20\u201322  \u00b7  RED ROCKS AMPHITHEATRE', fontFamily: 'Montserrat', fontSize: 32, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 200, top: 2780, width: 2000, text: 'solsticefest.com', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      { type: 'rect', left: 450, top: 2950, width: 260, height: 60, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 260, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(255,255,255,0.08)' }, { offset: 1, color: 'rgba(255,255,255,0.03)' }] }, rx: 8, ry: 8 },
      { type: 'rect', left: 770, top: 2950, width: 260, height: 60, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 260, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(212,168,83,0.1)' }, { offset: 1, color: 'rgba(212,168,83,0.03)' }] }, rx: 8, ry: 8 },
      { type: 'rect', left: 1090, top: 2950, width: 260, height: 60, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 260, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(255,255,255,0.08)' }, { offset: 1, color: 'rgba(255,255,255,0.03)' }] }, rx: 8, ry: 8 },
      { type: 'rect', left: 1410, top: 2950, width: 260, height: 60, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 260, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(212,168,83,0.1)' }, { offset: 1, color: 'rgba(212,168,83,0.03)' }] }, rx: 8, ry: 8 },
    ]),

  // ─── FOOD & LIFESTYLE ──────────────────────────────────────────────

  // 42. Cafe Menu — gradient on accent line, shadow+charSpacing on heading
  tpl('cafe-menu', 'Morning Ritual Caf\u00e9', 'Caf\u00e9 menu with specialties and sides',
    'Food & Lifestyle', 'Caf\u00e9 Menu', ['cafe', 'coffee', 'menu', 'food'],
    2550, 3300, 'solid', '#2d1810', [
      { type: 'circle', left: 1100, top: 80, radius: 60, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 2, strokeUniform: true },
      { type: 'textbox', left: 1100, top: 105, width: 120, text: 'MR', fontFamily: 'Playfair Display', fontSize: 42, fill: '#C4704A', textAlign: 'center' },
      { type: 'circle', left: 2100, top: 300, radius: 8, fill: '#C4704A', opacity: 0.2 },
      { type: 'circle', left: 2130, top: 320, radius: 6, fill: '#C4704A', opacity: 0.15 },
      { type: 'circle', left: 2200, top: 600, radius: 7, fill: '#f5f0e8', opacity: 0.06 },
      { type: 'circle', left: 2220, top: 625, radius: 5, fill: '#f5f0e8', opacity: 0.05 },
      { type: 'star', left: 2300, top: 200, width: 18, height: 18, fill: '#C4704A', opacity: 0.1 },
      { type: 'hexagon', left: 100, top: 3100, width: 20, height: 20, fill: '#f5f0e8', opacity: 0.06 },
      { type: 'textbox', left: 200, top: 230, width: 700, text: 'MORNING\nRITUAL', fontFamily: 'Playfair Display', fontSize: 120, fill: '#f5f0e8', lineHeight: 1.05, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 200, top: 505, width: 80, height: 2, fill: '#C4704A' },
      { type: 'diamond', left: 290, top: 498, width: 12, height: 18, fill: '#C4704A', opacity: 0.6 },
      { type: 'rect', left: 315, top: 505, width: 80, height: 2, fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 570, width: 950, text: 'COFFEE', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 200, top: 630, width: 700, text: 'Espresso\nCortado\nOat Latte\nPour Over\nCold Brew', fontFamily: 'DM Sans', fontSize: 28, fill: '#f5f0e8', lineHeight: 2.2 },
      { type: 'textbox', left: 900, top: 630, width: 250, text: '$4\n$5\n$6\n$5.50\n$5', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right', lineHeight: 2.2 },
      { type: 'rect', left: 200, top: 1030, width: 420, height: 1, fill: 'rgba(245,240,232,0.12)' },
      { type: 'diamond', left: 630, top: 1024, width: 10, height: 14, fill: '#f5f0e8', opacity: 0.15 },
      { type: 'rect', left: 655, top: 1030, width: 495, height: 1, fill: 'rgba(245,240,232,0.12)' },
      { type: 'textbox', left: 200, top: 1080, width: 950, text: 'PASTRIES', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 200, top: 1140, width: 700, text: 'Almond Croissant\nSourdough Toast & Jam\nBanana Walnut Loaf\nCardamom Bun', fontFamily: 'DM Sans', fontSize: 28, fill: '#f5f0e8', lineHeight: 2.2 },
      { type: 'textbox', left: 900, top: 1140, width: 250, text: '$5.50\n$4\n$5\n$4.50', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right', lineHeight: 2.2 },
      { type: 'rect', left: 1350, top: 570, width: 1000, height: 2400, fill: 'rgba(245,240,232,0.04)', rx: 8, ry: 8 },
      { type: 'textbox', left: 1450, top: 570, width: 850, text: 'BRUNCH', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 1450, top: 630, width: 600, text: 'Avocado Toast\nShakshuka\nGranola Bowl\nEggs Benedict\nFrench Toast', fontFamily: 'DM Sans', fontSize: 28, fill: '#f5f0e8', lineHeight: 2.2 },
      { type: 'textbox', left: 2100, top: 630, width: 200, text: '$14\n$16\n$13\n$17\n$15', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right', lineHeight: 2.2 },
      { type: 'rect', left: 1450, top: 1030, width: 270, height: 1, fill: 'rgba(245,240,232,0.12)' },
      { type: 'diamond', left: 1730, top: 1024, width: 10, height: 14, fill: '#f5f0e8', opacity: 0.15 },
      { type: 'rect', left: 1755, top: 1030, width: 545, height: 1, fill: 'rgba(245,240,232,0.12)' },
      { type: 'textbox', left: 1450, top: 1080, width: 850, text: 'SPECIALTIES', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 1450, top: 1140, width: 600, text: 'Matcha Latte\nTurmeric Golden Milk\nLavender Honey Latte', fontFamily: 'DM Sans', fontSize: 28, fill: '#f5f0e8', lineHeight: 2.2 },
      { type: 'textbox', left: 2100, top: 1140, width: 200, text: '$7\n$6.50\n$7', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right', lineHeight: 2.2 },
      { type: 'rect', left: 200, top: 1520, width: 420, height: 1, fill: 'rgba(245,240,232,0.12)' },
      { type: 'diamond', left: 630, top: 1514, width: 10, height: 14, fill: '#f5f0e8', opacity: 0.15 },
      { type: 'rect', left: 655, top: 1520, width: 495, height: 1, fill: 'rgba(245,240,232,0.12)' },
      { type: 'textbox', left: 200, top: 1570, width: 950, text: 'SIDES', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 200, top: 1630, width: 700, text: 'Fresh Fruit Bowl\nSide of Bacon\nHash Browns', fontFamily: 'DM Sans', fontSize: 28, fill: '#f5f0e8', lineHeight: 2.2 },
      { type: 'textbox', left: 900, top: 1630, width: 250, text: '$6\n$5\n$4', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right', lineHeight: 2.2 },
      { type: 'rect', left: 200, top: 2850, width: 2150, height: 1, fill: 'rgba(245,240,232,0.1)' },
      { type: 'textbox', left: 200, top: 2890, width: 2150, text: 'WiFi: MorningRitual \u00b7 Pass: freshbrew2026', fontFamily: 'DM Sans', fontSize: 20, fill: '#f5f0e8', textAlign: 'center', opacity: 0.5 },
      { type: 'textbox', left: 200, top: 2960, width: 2150, text: 'Open daily 7 AM \u2013 3 PM \u00b7 2847 NE Alberta St \u00b7 Portland, OR', fontFamily: 'DM Sans', fontSize: 20, fill: 'rgba(245,240,232,0.4)', textAlign: 'center' },
    ]),

  // 43. Recipe Card — gradient on accent line, shadow+charSpacing on heading
  tpl('recipe-lemon', 'Lemon Herb Chicken', 'Recipe card with prep times and difficulty',
    'Food & Lifestyle', 'Recipe Card', ['recipe', 'cooking', 'food', 'chicken'],
    1500, 2100, 'solid', '#faf8f5', [
      { type: 'rect', left: 0, top: 0, width: 1500, height: 520, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1500, y2: 520 }, colorStops: [{ offset: 0, color: '#e8d5c4' }, { offset: 0.5, color: '#d4b89a' }, { offset: 1, color: '#c9a882' }] } },
      { type: 'circle', left: 1300, top: 420, radius: 18, fill: '#7a9a6a', opacity: 0.2 },
      { type: 'diamond', left: 1340, top: 440, width: 14, height: 20, fill: '#7a9a6a', opacity: 0.15 },
      { type: 'textbox', left: 100, top: 560, width: 1300, text: 'LEMON HERB CHICKEN', fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 'bold', fill: '#2d2215', charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 100, top: 630, width: 60, height: 2, fill: '#C4704A' },
      { type: 'diamond', left: 168, top: 624, width: 10, height: 14, fill: '#C4704A', opacity: 0.6 },
      { type: 'rect', left: 190, top: 630, width: 60, height: 2, fill: '#C4704A' },
      { type: 'rect', left: 100, top: 660, width: 140, height: 36, fill: '#7a9a6a', rx: 18, ry: 18, opacity: 0.15 },
      { type: 'textbox', left: 108, top: 668, width: 124, text: 'Prep: 15 min', fontFamily: 'DM Sans', fontSize: 14, fill: '#7a9a6a', textAlign: 'center', fontWeight: 'bold' },
      { type: 'rect', left: 260, top: 660, width: 140, height: 36, fill: '#C4704A', rx: 18, ry: 18, opacity: 0.15 },
      { type: 'textbox', left: 268, top: 668, width: 124, text: 'Cook: 35 min', fontFamily: 'DM Sans', fontSize: 14, fill: '#C4704A', textAlign: 'center', fontWeight: 'bold' },
      { type: 'circle', left: 430, top: 670, radius: 8, fill: '#C4704A' },
      { type: 'circle', left: 456, top: 670, radius: 8, fill: '#C4704A' },
      { type: 'circle', left: 482, top: 670, radius: 8, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 1.5, strokeUniform: true },
      { type: 'textbox', left: 500, top: 668, width: 60, text: 'Easy', fontFamily: 'DM Sans', fontSize: 14, fill: '#888880' },
      { type: 'textbox', left: 100, top: 740, width: 580, text: 'INGREDIENTS', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#2d2215', charSpacing: 300 },
      { type: 'textbox', left: 100, top: 780, width: 580, text: '4 bone-in chicken thighs\n3 tbsp olive oil\n2 lemons, juiced and zested\n4 cloves garlic, minced\n2 tbsp fresh rosemary\n1 tbsp fresh thyme\nSalt and black pepper', fontFamily: 'DM Sans', fontSize: 18, fill: '#5c4a32', lineHeight: 1.9 },
      { type: 'rect', left: 730, top: 740, width: 1, height: 700, fill: '#e5e0d8' },
      { type: 'textbox', left: 780, top: 740, width: 620, text: 'DIRECTIONS', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#2d2215', charSpacing: 300 },
      { type: 'textbox', left: 780, top: 780, width: 620, text: '1. Preheat oven to 400\u00b0F.\n\n2. Mix olive oil, lemon juice, zest, garlic, rosemary, and thyme.\n\n3. Season chicken generously with salt and pepper. Coat with herb mixture.\n\n4. Roast for 35 minutes until internal temp reaches 165\u00b0F.\n\n5. Rest 5 minutes before serving with pan juices.', fontFamily: 'DM Sans', fontSize: 17, fill: '#5c4a32', lineHeight: 1.6 },
      { type: 'rect', left: 100, top: 1910, width: 1300, height: 50, fill: '#7a9a6a', opacity: 0.08 },
      { type: 'textbox', left: 120, top: 1920, width: 1260, text: 'Pairs beautifully with roasted vegetables or a simple green salad with lemon vinaigrette.', fontFamily: 'Lora', fontSize: 16, fontStyle: 'italic', fill: '#7a9a6a' },
      { type: 'textbox', left: 100, top: 1990, width: 1300, text: 'Serving suggestion: plate on warm ceramic with a sprig of rosemary and lemon wedge.', fontFamily: 'Lora', fontSize: 14, fontStyle: 'italic', fill: '#888880' },
    ]),

  // 44. Cocktail Card — gradient on top bar, shadow+charSpacing on heading
  tpl('cocktail-paloma', 'The Smoky Paloma', 'Cocktail card with glass silhouette and flavor profile',
    'Food & Lifestyle', 'Cocktail Card', ['cocktail', 'drink', 'recipe', 'mezcal'],
    1080, 1080, 'solid', '#1a1510', [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 8, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 0.5, color: '#d4a853' }, { offset: 1, color: '#C4704A' }] } },
      { type: 'rect', left: 0, top: 8, width: 1080, height: 50, fill: '#d4a853', opacity: 0.1 },
      { type: 'triangle', left: 750, top: 530, width: 200, height: 240, fill: 'rgba(212,168,83,0.08)' },
      { type: 'rect', left: 840, top: 770, width: 8, height: 120, fill: 'rgba(212,168,83,0.12)', rx: 4, ry: 4 },
      { type: 'circle', left: 810, top: 890, radius: 35, fill: 'rgba(212,168,83,0.06)', stroke: 'rgba(212,168,83,0.1)', strokeWidth: 1, strokeUniform: true },
      { type: 'diamond', left: 960, top: 480, width: 16, height: 24, fill: '#d4a853', opacity: 0.15 },
      { type: 'star', left: 920, top: 420, width: 14, height: 14, fill: '#C4704A', opacity: 0.12 },
      { type: 'textbox', left: 100, top: 140, width: 600, text: 'THE SMOKY\nPALOMA', fontFamily: 'Playfair Display', fontSize: 80, fill: '#f5f0e8', lineHeight: 1.1, charSpacing: 80, shadow: { color: 'rgba(212,168,83,0.3)', blur: 20, offsetX: 0, offsetY: 6 } },
      { type: 'rect', left: 100, top: 350, width: 80, height: 3, fill: '#C4704A' },
      { type: 'rect', left: 195, top: 350, width: 60, height: 3, fill: '#d4a853' },
      { type: 'rect', left: 100, top: 390, width: 80, height: 30, fill: 'rgba(212,168,83,0.12)', rx: 15, ry: 15 },
      { type: 'textbox', left: 100, top: 396, width: 80, text: 'Sweet', fontFamily: 'DM Sans', fontSize: 12, fill: '#d4a853', textAlign: 'center' },
      { type: 'rect', left: 195, top: 390, width: 80, height: 30, fill: 'rgba(196,112,74,0.12)', rx: 15, ry: 15 },
      { type: 'textbox', left: 195, top: 396, width: 80, text: 'Citrus', fontFamily: 'DM Sans', fontSize: 12, fill: '#C4704A', textAlign: 'center' },
      { type: 'rect', left: 290, top: 390, width: 80, height: 30, fill: 'rgba(245,240,232,0.08)', rx: 15, ry: 15 },
      { type: 'textbox', left: 290, top: 396, width: 80, text: 'Salty', fontFamily: 'DM Sans', fontSize: 12, fill: 'rgba(245,240,232,0.6)', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 460, width: 600, text: '2 oz mezcal\n3 oz fresh grapefruit juice\n1 oz fresh lime juice\n\u00bd oz agave syrup\nClub soda\nTaj\u00edn rim', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(245,240,232,0.75)', lineHeight: 2.0 },
      { type: 'textbox', left: 100, top: 900, width: 600, text: 'Rim a rocks glass with lime and Taj\u00edn. Build over ice.\nTop with soda. Garnish with a grapefruit wheel.', fontFamily: 'Lora', fontSize: 18, fontStyle: 'italic', fill: 'rgba(245,240,232,0.45)', lineHeight: 1.7 },
      { type: 'rect', left: 100, top: 1020, width: 200, height: 1, fill: 'rgba(212,168,83,0.2)' },
    ]),

  // 45. Fitness Plan — visual layout with dumbbell icon, progressive weeks, body-part indicators
  tpl('fitness-plan', '4-Week Strength Program', 'Visual fitness plan with progressive overload and body-part indicators',
    'Food & Lifestyle', 'Fitness Plan', ['fitness', 'workout', 'gym', 'strength'],
    2550, 3300, 'solid', '#ffffff', [
      // Header gradient bar
      { type: 'rect', left: 0, top: 0, width: 2550, height: 240, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 2550, y2: 0 }, colorStops: [{ offset: 0, color: '#0f172a' }, { offset: 1, color: '#1e293b' }] } },
      { type: 'textbox', left: 200, top: 50, width: 1800, text: '4-WEEK STRENGTH PROGRAM', fontFamily: 'Montserrat', fontSize: 52, fontWeight: 'bold', fill: '#ffffff', charSpacing: 150, shadow: { color: 'rgba(0,0,0,0.4)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 130, width: 1800, text: 'Progressive overload \u00b7 3 days/week \u00b7 45\u201360 min', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.6)' },
      // Dumbbell icon in header
      { type: 'circle', left: 2100, top: 80, radius: 40, fill: 'rgba(255,255,255,0.15)', stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2, strokeUniform: true },
      { type: 'rect', left: 2180, top: 105, width: 120, height: 12, fill: 'rgba(255,255,255,0.25)', rx: 6, ry: 6 },
      { type: 'circle', left: 2300, top: 80, radius: 40, fill: 'rgba(255,255,255,0.15)', stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2, strokeUniform: true },
      // Legend bar
      { type: 'rect', left: 150, top: 280, width: 2250, height: 60, fill: '#f8f6f4', rx: 4, ry: 4 },
      { type: 'diamond', left: 200, top: 292, width: 16, height: 22, fill: '#C4704A' },
      { type: 'textbox', left: 230, top: 293, width: 200, text: 'Upper Body', fontFamily: 'DM Sans', fontSize: 16, fill: '#6b7280' },
      { type: 'triangle', left: 480, top: 292, width: 18, height: 18, fill: '#2563eb' },
      { type: 'textbox', left: 510, top: 293, width: 200, text: 'Lower Body', fontFamily: 'DM Sans', fontSize: 16, fill: '#6b7280' },
      { type: 'circle', left: 760, top: 296, radius: 9, fill: '#16a34a' },
      { type: 'textbox', left: 790, top: 293, width: 200, text: 'Full Body', fontFamily: 'DM Sans', fontSize: 16, fill: '#6b7280' },
      // WEEK 1
      { type: 'rect', left: 150, top: 380, width: 120, height: 46, fill: '#C4704A', rx: 23, ry: 23 },
      { type: 'textbox', left: 150, top: 389, width: 120, text: 'WK 1', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 150, top: 440, width: 2250, height: 280, fill: 'rgba(196,112,74,0.04)', rx: 8, ry: 8 },
      { type: 'diamond', left: 200, top: 465, width: 12, height: 18, fill: '#C4704A', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 460, width: 2100, text: 'Squats 3\u00d710  \u00b7  Bench Press 3\u00d710  \u00b7  Barbell Row 3\u00d710', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      { type: 'triangle', left: 200, top: 515, width: 14, height: 14, fill: '#2563eb', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 510, width: 2100, text: 'Deadlift 3\u00d78  \u00b7  Leg Press 3\u00d712  \u00b7  Lunges 3\u00d710 ea', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      { type: 'circle', left: 205, top: 565, radius: 7, fill: '#16a34a', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 560, width: 2100, text: 'Overhead Press 3\u00d710  \u00b7  Pull-ups 3\u00d7max  \u00b7  Plank 3\u00d730s', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      // WEEK 2
      { type: 'rect', left: 150, top: 760, width: 120, height: 46, fill: '#C4704A', rx: 23, ry: 23 },
      { type: 'textbox', left: 150, top: 769, width: 120, text: 'WK 2', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 150, top: 820, width: 2250, height: 280, fill: 'rgba(196,112,74,0.06)', rx: 8, ry: 8 },
      { type: 'diamond', left: 200, top: 845, width: 12, height: 18, fill: '#C4704A', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 840, width: 2100, text: 'Squats 4\u00d78  \u00b7  Bench Press 4\u00d78  \u00b7  Barbell Row 4\u00d78', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      { type: 'triangle', left: 200, top: 895, width: 14, height: 14, fill: '#2563eb', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 890, width: 2100, text: 'Deadlift 4\u00d76  \u00b7  Leg Press 4\u00d710  \u00b7  Lunges 4\u00d78 ea', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      { type: 'circle', left: 205, top: 945, radius: 7, fill: '#16a34a', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 940, width: 2100, text: 'Overhead Press 4\u00d78  \u00b7  Pull-ups 4\u00d7max  \u00b7  Plank 3\u00d745s', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      // WEEK 3
      { type: 'rect', left: 150, top: 1140, width: 120, height: 46, fill: '#C4704A', rx: 23, ry: 23 },
      { type: 'textbox', left: 150, top: 1149, width: 120, text: 'WK 3', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 150, top: 1200, width: 2250, height: 280, fill: 'rgba(196,112,74,0.08)', rx: 8, ry: 8 },
      { type: 'diamond', left: 200, top: 1225, width: 12, height: 18, fill: '#C4704A', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 1220, width: 2100, text: 'Squats 4\u00d76  \u00b7  Bench Press 4\u00d76  \u00b7  Barbell Row 4\u00d76', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      { type: 'triangle', left: 200, top: 1275, width: 14, height: 14, fill: '#2563eb', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 1270, width: 2100, text: 'Deadlift 5\u00d75  \u00b7  Leg Press 5\u00d78  \u00b7  Weighted Lunges 4\u00d76 ea', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      { type: 'circle', left: 205, top: 1325, radius: 7, fill: '#16a34a', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 1320, width: 2100, text: 'Overhead Press 4\u00d76  \u00b7  Weighted Pull-ups 4\u00d76  \u00b7  Plank 3\u00d760s', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      // WEEK 4
      { type: 'rect', left: 150, top: 1520, width: 120, height: 46, fill: '#C4704A', rx: 23, ry: 23 },
      { type: 'textbox', left: 150, top: 1529, width: 120, text: 'WK 4', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 150, top: 1580, width: 2250, height: 280, fill: 'rgba(196,112,74,0.10)', rx: 8, ry: 8 },
      { type: 'diamond', left: 200, top: 1605, width: 12, height: 18, fill: '#C4704A', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 1600, width: 2100, text: 'Squats 5\u00d75  \u00b7  Bench Press 5\u00d75  \u00b7  Barbell Row 5\u00d75', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      { type: 'triangle', left: 200, top: 1655, width: 14, height: 14, fill: '#2563eb', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 1650, width: 2100, text: 'Deadlift 5\u00d73  \u00b7  Leg Press 5\u00d76  \u00b7  Bulgarian Splits 5\u00d75 ea', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      { type: 'circle', left: 205, top: 1705, radius: 7, fill: '#16a34a', opacity: 0.7 },
      { type: 'textbox', left: 225, top: 1700, width: 2100, text: 'Overhead Press 5\u00d75  \u00b7  Weighted Pull-ups 5\u00d75  \u00b7  Plank 3\u00d790s', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151' },
      // Warm-up / Cool-down rows
      { type: 'rect', left: 150, top: 1930, width: 2250, height: 2, fill: '#e5e7eb' },
      { type: 'rect', left: 150, top: 1960, width: 1080, height: 100, fill: '#f0fdf4', rx: 6, ry: 6 },
      { type: 'textbox', left: 190, top: 1980, width: 200, text: 'WARM-UP', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#16a34a', charSpacing: 200 },
      { type: 'textbox', left: 190, top: 2010, width: 1000, text: '5 min cardio \u00b7 dynamic stretches \u00b7 2 warm-up sets', fontFamily: 'DM Sans', fontSize: 18, fill: '#4b5563' },
      { type: 'rect', left: 1320, top: 1960, width: 1080, height: 100, fill: '#eff6ff', rx: 6, ry: 6 },
      { type: 'textbox', left: 1360, top: 1980, width: 200, text: 'COOL-DOWN', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#2563eb', charSpacing: 200 },
      { type: 'textbox', left: 1360, top: 2010, width: 1000, text: '5 min walk \u00b7 foam roll \u00b7 static stretches (hold 30s)', fontFamily: 'DM Sans', fontSize: 18, fill: '#4b5563' },
      // Progress tracking
      { type: 'textbox', left: 150, top: 2120, width: 600, text: 'WEEKLY PROGRESS', fontFamily: 'Montserrat', fontSize: 16, fontWeight: 'bold', fill: '#1a1a1a', charSpacing: 300 },
      { type: 'rect', left: 150, top: 2170, width: 44, height: 44, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 2, rx: 4, ry: 4, strokeUniform: true },
      { type: 'textbox', left: 210, top: 2178, width: 100, text: 'Wk 1', fontFamily: 'DM Sans', fontSize: 18, fill: '#6b7280' },
      { type: 'rect', left: 350, top: 2170, width: 44, height: 44, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 2, rx: 4, ry: 4, strokeUniform: true },
      { type: 'textbox', left: 410, top: 2178, width: 100, text: 'Wk 2', fontFamily: 'DM Sans', fontSize: 18, fill: '#6b7280' },
      { type: 'rect', left: 550, top: 2170, width: 44, height: 44, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 2, rx: 4, ry: 4, strokeUniform: true },
      { type: 'textbox', left: 610, top: 2178, width: 100, text: 'Wk 3', fontFamily: 'DM Sans', fontSize: 18, fill: '#6b7280' },
      { type: 'rect', left: 750, top: 2170, width: 44, height: 44, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 2, rx: 4, ry: 4, strokeUniform: true },
      { type: 'textbox', left: 810, top: 2178, width: 100, text: 'Wk 4', fontFamily: 'DM Sans', fontSize: 18, fill: '#6b7280' },
      // Rest instructions footer
      { type: 'rect', left: 150, top: 2280, width: 2250, height: 2, fill: '#e5e7eb' },
      { type: 'textbox', left: 150, top: 2310, width: 2250, text: 'Rest 90\u2013120s between sets. Increase weight by 5 lbs each week. Log every session. Deload after week 4 if needed.', fontFamily: 'Lora', fontSize: 20, fontStyle: 'italic', fill: '#9ca3af' },
    ]),

  // 46. Wellness Quote — sage mandala circles, diamond petals, ornamental border, meditation feel
  tpl('wellness-quote', 'Breathe In Calm', 'Wellness quote card with mandala circles, diamond petals, and sage tones',
    'Food & Lifestyle', 'Wellness', ['wellness', 'mindfulness', 'quote', 'calm'],
    1080, 1080, 'gradient', 'linear:to-bottom:#e8f0e0:#f5f0eb', [
      // Ornamental border
      { type: 'rect', left: 40, top: 40, width: 1000, height: 1000, fill: 'rgba(0,0,0,0)', stroke: 'rgba(122,154,106,0.25)', strokeWidth: 1, rx: 4, ry: 4, strokeUniform: true },
      { type: 'rect', left: 56, top: 56, width: 968, height: 968, fill: 'rgba(0,0,0,0)', stroke: 'rgba(122,154,106,0.12)', strokeWidth: 1, rx: 2, ry: 2, strokeUniform: true },
      // Concentric mandala circles — sage tones
      { type: 'circle', left: 340, top: 220, radius: 200, fill: 'rgba(122,154,106,0.05)', stroke: 'rgba(122,154,106,0.08)', strokeWidth: 1, strokeUniform: true },
      { type: 'circle', left: 380, top: 260, radius: 160, fill: 'rgba(122,154,106,0.07)', stroke: 'rgba(122,154,106,0.10)', strokeWidth: 1, strokeUniform: true },
      { type: 'circle', left: 420, top: 300, radius: 120, fill: 'rgba(122,154,106,0.09)', stroke: 'rgba(122,154,106,0.12)', strokeWidth: 1, strokeUniform: true },
      { type: 'circle', left: 460, top: 340, radius: 80, fill: 'rgba(122,154,106,0.11)', stroke: 'rgba(122,154,106,0.14)', strokeWidth: 1, strokeUniform: true },
      { type: 'circle', left: 500, top: 380, radius: 40, fill: 'rgba(122,154,106,0.15)', stroke: 'rgba(122,154,106,0.18)', strokeWidth: 1, strokeUniform: true },
      // Diamond petal arrangement — radial
      { type: 'diamond', left: 500, top: 200, width: 40, height: 80, fill: 'rgba(122,154,106,0.10)' },
      { type: 'diamond', left: 620, top: 380, width: 80, height: 40, fill: 'rgba(122,154,106,0.10)' },
      { type: 'diamond', left: 500, top: 500, width: 40, height: 80, fill: 'rgba(122,154,106,0.10)' },
      { type: 'diamond', left: 380, top: 380, width: 80, height: 40, fill: 'rgba(122,154,106,0.10)' },
      // 45-degree accent diamonds
      { type: 'diamond', left: 590, top: 240, width: 24, height: 48, fill: 'rgba(122,154,106,0.07)', angle: 45 },
      { type: 'diamond', left: 590, top: 480, width: 24, height: 48, fill: 'rgba(122,154,106,0.07)', angle: -45 },
      { type: 'diamond', left: 400, top: 240, width: 24, height: 48, fill: 'rgba(122,154,106,0.07)', angle: -45 },
      { type: 'diamond', left: 400, top: 480, width: 24, height: 48, fill: 'rgba(122,154,106,0.07)', angle: 45 },
      // Quote text
      { type: 'textbox', left: 100, top: 580, width: 880, text: 'breathe in calm,\nbreathe out tension.', fontFamily: 'Lora', fontSize: 48, fontStyle: 'italic', fill: '#3d4a35', textAlign: 'center', lineHeight: 1.6, charSpacing: 40, shadow: { color: 'rgba(0,0,0,0.06)', blur: 10, offsetX: 0, offsetY: 3 } },
      // Divider
      { type: 'rect', left: 440, top: 780, width: 200, height: 1, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 200, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(122,154,106,0.1)' }, { offset: 0.5, color: 'rgba(122,154,106,0.4)' }, { offset: 1, color: 'rgba(122,154,106,0.1)' }] } },
      // Attribution
      { type: 'textbox', left: 100, top: 810, width: 880, text: '\u2014 daily reminder', fontFamily: 'DM Sans', fontSize: 20, fill: 'rgba(90,110,80,0.5)', textAlign: 'center' },
      // Lotus flower — 5 circles in radial pattern
      { type: 'circle', left: 520, top: 900, radius: 12, fill: 'rgba(122,154,106,0.25)' },
      { type: 'circle', left: 495, top: 920, radius: 10, fill: 'rgba(122,154,106,0.20)' },
      { type: 'circle', left: 545, top: 920, radius: 10, fill: 'rgba(122,154,106,0.20)' },
      { type: 'circle', left: 505, top: 940, radius: 8, fill: 'rgba(122,154,106,0.15)' },
      { type: 'circle', left: 535, top: 940, radius: 8, fill: 'rgba(122,154,106,0.15)' },
      // Stem
      { type: 'rect', left: 537, top: 955, width: 2, height: 30, fill: 'rgba(122,154,106,0.18)' },
      // Corner accents
      { type: 'circle', left: 70, top: 70, radius: 80, fill: 'rgba(122,154,106,0.04)' },
      { type: 'circle', left: 900, top: 900, radius: 60, fill: 'rgba(122,154,106,0.04)' },
    ]),

  // ─── SEASONAL ───────────────────────────────────────────────────────

  // 47. Valentine — hearts, diamonds, romantic script, pink/rose palette
  tpl('valentines-heart', 'You Have My Heart', 'Romantic Valentine card with scattered hearts and diamond accents',
    'Seasonal', 'Valentine', ['valentine', 'love', 'heart', 'romantic'],
    1080, 1080, 'gradient', 'linear:to-bottom:#fce4ec:#f48fb1', [
      // Large centered heart behind text
      { type: 'heart', left: 340, top: 260, width: 400, height: 380, fill: 'rgba(233,30,99,0.10)', angle: 0 },
      // Scattered hearts at varying sizes, opacities, rotations
      { type: 'heart', left: 60, top: 60, width: 110, height: 100, fill: '#e91e63', opacity: 0.7, angle: -15 },
      { type: 'heart', left: 880, top: 100, width: 80, height: 75, fill: '#f48fb1', opacity: 0.5, angle: 12 },
      { type: 'heart', left: 150, top: 820, width: 60, height: 55, fill: '#ad1457', opacity: 0.4, angle: -8 },
      { type: 'heart', left: 900, top: 750, width: 95, height: 90, fill: '#e91e63', opacity: 0.55, angle: 20 },
      { type: 'heart', left: 750, top: 40, width: 45, height: 42, fill: '#f8bbd0', opacity: 0.6, angle: -25 },
      { type: 'heart', left: 50, top: 500, width: 55, height: 50, fill: '#f06292', opacity: 0.35, angle: 10 },
      { type: 'heart', left: 930, top: 450, width: 70, height: 65, fill: '#ec407a', opacity: 0.45, angle: -18 },
      { type: 'heart', left: 480, top: 900, width: 50, height: 46, fill: '#f48fb1', opacity: 0.3, angle: 30 },
      // Diamond accents between text elements
      { type: 'diamond', left: 505, top: 380, width: 24, height: 36, fill: '#ad1457', opacity: 0.5, angle: 0 },
      { type: 'diamond', left: 540, top: 680, width: 18, height: 28, fill: '#e91e63', opacity: 0.4, angle: 0 },
      { type: 'diamond', left: 200, top: 300, width: 16, height: 24, fill: '#f06292', opacity: 0.3, angle: 15 },
      // Main heading — romantic script font
      { type: 'textbox', left: 80, top: 420, width: 920, text: 'You Have\nMy Heart', fontFamily: 'Pacifico', fontSize: 88, fill: '#880e4f', textAlign: 'center', lineHeight: 1.2, shadow: { color: 'rgba(136,14,79,0.25)', blur: 24, offsetX: 3, offsetY: 6 } },
      // Decorative line with hearts at each end
      { type: 'rect', left: 380, top: 650, width: 320, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 320, y2: 0 }, colorStops: [{ offset: 0, color: '#f48fb1' }, { offset: 0.5, color: '#e91e63' }, { offset: 1, color: '#f48fb1' }] } },
      { type: 'heart', left: 355, top: 642, width: 18, height: 17, fill: '#e91e63' },
      { type: 'heart', left: 705, top: 642, width: 18, height: 17, fill: '#e91e63' },
      // Subtitle
      { type: 'textbox', left: 100, top: 690, width: 880, text: 'Happy Valentine\u2019s Day', fontFamily: 'Playfair Display', fontSize: 32, fontStyle: 'italic', fill: '#ad1457', textAlign: 'center' },
      // From line
      { type: 'textbox', left: 100, top: 760, width: 880, text: 'With all my love, always & forever', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(136,14,79,0.5)', textAlign: 'center' },
      // Bottom decorative hearts
      { type: 'heart', left: 380, top: 950, width: 30, height: 28, fill: '#e91e63', opacity: 0.25, angle: -5 },
      { type: 'heart', left: 650, top: 940, width: 25, height: 23, fill: '#f06292', opacity: 0.2, angle: 8 },
    ]),

  // 48. Halloween — orange/purple palette, pumpkin shapes, bats, moonlight
  tpl('halloween-dare', 'Enter If You Dare', 'Spooky Halloween party invite with pumpkin, bats, spider web, and moonlight',
    'Seasonal', 'Halloween', ['halloween', 'party', 'spooky', 'october'],
    1080, 1350, 'solid', '#0a0a0a', [
      { type: 'circle', left: 720, top: 40, radius: 110, fill: { type: 'radial', coords: { x1: 110, y1: 110, r1: 0, x2: 110, y2: 110, r2: 110 }, colorStops: [{ offset: 0, color: '#ffd54f' }, { offset: 0.7, color: '#ffb300' }, { offset: 1, color: 'rgba(255,179,0,0)' }] } },
      { type: 'circle', left: 760, top: 30, radius: 90, fill: '#0a0a0a' },
      { type: 'triangle', left: 160, top: 120, width: 50, height: 28, fill: '#7c3aed', opacity: 0.6, angle: 0 },
      { type: 'triangle', left: 210, top: 120, width: 50, height: 28, fill: '#7c3aed', opacity: 0.6, angle: 0 },
      { type: 'circle', left: 220, top: 128, radius: 8, fill: '#7c3aed', opacity: 0.6 },
      { type: 'triangle', left: 850, top: 200, width: 40, height: 22, fill: '#7c3aed', opacity: 0.45, angle: 10 },
      { type: 'triangle', left: 890, top: 200, width: 40, height: 22, fill: '#7c3aed', opacity: 0.45, angle: 10 },
      { type: 'triangle', left: 420, top: 80, width: 35, height: 20, fill: '#7c3aed', opacity: 0.3, angle: -5 },
      { type: 'triangle', left: 455, top: 80, width: 35, height: 20, fill: '#7c3aed', opacity: 0.3, angle: -5 },
      { type: 'rect', left: 1080, top: 0, width: 200, height: 1, fill: 'rgba(255,255,255,0.1)', angle: 135 },
      { type: 'rect', left: 1080, top: 0, width: 170, height: 1, fill: 'rgba(255,255,255,0.07)', angle: 150 },
      { type: 'rect', left: 1080, top: 0, width: 190, height: 1, fill: 'rgba(255,255,255,0.08)', angle: 120 },
      { type: 'rect', left: 1080, top: 0, width: 140, height: 1, fill: 'rgba(255,255,255,0.06)', angle: 165 },
      { type: 'circle', left: 100, top: 1050, radius: 65, fill: '#e65100', opacity: 0.6 },
      { type: 'rect', left: 158, top: 1040, width: 10, height: 20, fill: '#33691e', opacity: 0.6, rx: 3, ry: 3 },
      { type: 'triangle', left: 125, top: 1065, width: 18, height: 16, fill: '#0a0a0a', opacity: 0.6 },
      { type: 'triangle', left: 155, top: 1065, width: 18, height: 16, fill: '#0a0a0a', opacity: 0.6 },
      { type: 'circle', left: 880, top: 1100, radius: 45, fill: '#ff6d00', opacity: 0.4 },
      { type: 'rect', left: 920, top: 1092, width: 8, height: 14, fill: '#33691e', opacity: 0.4, rx: 2, ry: 2 },
      { type: 'rect', left: 0, top: 0, width: 180, height: 1, fill: 'rgba(255,255,255,0.08)', angle: 45 },
      { type: 'rect', left: 0, top: 0, width: 140, height: 1, fill: 'rgba(255,255,255,0.06)', angle: 30 },
      { type: 'rect', left: 0, top: 0, width: 160, height: 1, fill: 'rgba(255,255,255,0.07)', angle: 60 },
      { type: 'textbox', left: 84, top: 364, width: 920, text: 'ENTER IF\nYOU DARE', fontFamily: 'Oswald', fontSize: 110, fontWeight: 'bold', fill: 'rgba(0,0,0,0)', stroke: 'rgba(124,58,237,0.3)', strokeWidth: 3, textAlign: 'center', lineHeight: 1.05 },
      { type: 'textbox', left: 80, top: 360, width: 920, text: 'ENTER IF\nYOU DARE', fontFamily: 'Oswald', fontSize: 110, fontWeight: 'bold', fill: '#ff6d00', textAlign: 'center', lineHeight: 1.05, charSpacing: 60, shadow: { color: 'rgba(124,58,237,0.6)', blur: 30, offsetX: 0, offsetY: 0 } },
      { type: 'star', left: 460, top: 620, width: 20, height: 20, fill: '#ff6d00', opacity: 0.4 },
      { type: 'rect', left: 300, top: 630, width: 150, height: 2, fill: 'rgba(124,58,237,0.3)' },
      { type: 'rect', left: 630, top: 630, width: 150, height: 2, fill: 'rgba(124,58,237,0.3)' },
      { type: 'textbox', left: 100, top: 690, width: 880, text: 'HALLOWEEN NIGHT \u00b7 OCT 31', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: 'rgba(255,255,255,0.7)', textAlign: 'center', charSpacing: 300 },
      { type: 'textbox', left: 100, top: 760, width: 880, text: 'The Morrison House \u00b7 8 PM', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 810, width: 880, text: 'Costumes Required \u00b7 Prizes for Best Dressed', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(255,255,255,0.3)', textAlign: 'center' },
      { type: 'star', left: 300, top: 180, width: 12, height: 12, fill: '#ffd54f', opacity: 0.3 },
      { type: 'star', left: 650, top: 100, width: 10, height: 10, fill: '#7c3aed', opacity: 0.25 },
      { type: 'star', left: 900, top: 350, width: 8, height: 8, fill: '#ffd54f', opacity: 0.25 },
      { type: 'star', left: 50, top: 280, width: 14, height: 14, fill: '#7c3aed', opacity: 0.2 },
    ]),

  // 49. Holiday Card — snowflakes, tree, ornaments, string lights, red/green/gold
  tpl('holiday-wishes', 'Warmest Wishes', 'Festive holiday greeting with tree, snowflakes, and ornaments',
    'Seasonal', 'Holiday Card', ['holiday', 'christmas', 'greeting', 'winter'],
    1500, 2100, 'solid', '#1a3320', [
      // Decorative border — double line frame
      { type: 'rect', left: 50, top: 50, width: 1400, height: 2000, fill: 'rgba(0,0,0,0)', stroke: 'rgba(249,168,37,0.25)', strokeWidth: 1 },
      { type: 'rect', left: 70, top: 70, width: 1360, height: 1960, fill: 'rgba(0,0,0,0)', stroke: 'rgba(249,168,37,0.15)', strokeWidth: 1 },
      // String lights across the top — line + alternating colored circles
      { type: 'rect', left: 100, top: 130, width: 1300, height: 2, fill: 'rgba(255,255,255,0.15)' },
      { type: 'circle', left: 150, top: 130, radius: 8, fill: '#c62828', opacity: 0.8 },
      { type: 'circle', left: 260, top: 135, radius: 8, fill: '#f9a825', opacity: 0.8 },
      { type: 'circle', left: 370, top: 130, radius: 8, fill: '#fafafa', opacity: 0.7 },
      { type: 'circle', left: 480, top: 135, radius: 8, fill: '#c62828', opacity: 0.8 },
      { type: 'circle', left: 590, top: 130, radius: 8, fill: '#2e7d32', opacity: 0.7 },
      { type: 'circle', left: 700, top: 135, radius: 8, fill: '#f9a825', opacity: 0.8 },
      { type: 'circle', left: 810, top: 130, radius: 8, fill: '#fafafa', opacity: 0.7 },
      { type: 'circle', left: 920, top: 135, radius: 8, fill: '#c62828', opacity: 0.8 },
      { type: 'circle', left: 1030, top: 130, radius: 8, fill: '#2e7d32', opacity: 0.7 },
      { type: 'circle', left: 1140, top: 135, radius: 8, fill: '#f9a825', opacity: 0.8 },
      { type: 'circle', left: 1250, top: 130, radius: 8, fill: '#fafafa', opacity: 0.7 },
      { type: 'circle', left: 1350, top: 135, radius: 8, fill: '#c62828', opacity: 0.8 },
      // Tree — stacked triangles (large → medium → small) in dark green
      { type: 'triangle', left: 580, top: 220, width: 340, height: 260, fill: '#1b5e20', opacity: 0.7 },
      { type: 'triangle', left: 610, top: 180, width: 280, height: 220, fill: '#2e7d32', opacity: 0.7 },
      { type: 'triangle', left: 645, top: 150, width: 210, height: 170, fill: '#388e3c', opacity: 0.7 },
      // Tree trunk
      { type: 'rect', left: 725, top: 470, width: 50, height: 40, fill: '#4e342e', opacity: 0.6, rx: 4, ry: 4 },
      // Tree ornaments — small circles on the tree
      { type: 'circle', left: 680, top: 350, radius: 10, fill: '#c62828' },
      { type: 'circle', left: 770, top: 300, radius: 8, fill: '#f9a825' },
      { type: 'circle', left: 720, top: 420, radius: 9, fill: '#c62828' },
      { type: 'circle', left: 810, top: 380, radius: 7, fill: '#fafafa', opacity: 0.8 },
      { type: 'circle', left: 650, top: 260, radius: 8, fill: '#f9a825' },
      // Tree star topper
      { type: 'star', left: 730, top: 128, width: 40, height: 40, fill: '#f9a825', shadow: { color: 'rgba(249,168,37,0.5)', blur: 12, offsetX: 0, offsetY: 0 } },
      // Snowflakes — stars and hexagons scattered
      { type: 'star', left: 150, top: 200, width: 20, height: 20, fill: '#fafafa', opacity: 0.4 },
      { type: 'star', left: 1250, top: 280, width: 28, height: 28, fill: '#fafafa', opacity: 0.3 },
      { type: 'hexagon', left: 200, top: 450, width: 18, height: 18, fill: '#fafafa', opacity: 0.2 },
      { type: 'star', left: 1100, top: 500, width: 16, height: 16, fill: '#fafafa', opacity: 0.35 },
      { type: 'hexagon', left: 300, top: 700, width: 14, height: 14, fill: '#fafafa', opacity: 0.25 },
      { type: 'star', left: 1300, top: 650, width: 22, height: 22, fill: '#fafafa', opacity: 0.3 },
      { type: 'star', left: 400, top: 1100, width: 18, height: 18, fill: '#fafafa', opacity: 0.2 },
      { type: 'hexagon', left: 1150, top: 900, width: 20, height: 20, fill: '#fafafa', opacity: 0.25 },
      { type: 'star', left: 250, top: 1500, width: 24, height: 24, fill: '#fafafa', opacity: 0.3 },
      { type: 'star', left: 1050, top: 1600, width: 16, height: 16, fill: '#fafafa', opacity: 0.2 },
      { type: 'hexagon', left: 500, top: 1700, width: 18, height: 18, fill: '#fafafa', opacity: 0.15 },
      { type: 'star', left: 1250, top: 1400, width: 14, height: 14, fill: '#fafafa', opacity: 0.25 },
      { type: 'star', left: 180, top: 1800, width: 20, height: 20, fill: '#fafafa', opacity: 0.2 },
      // Main heading
      { type: 'textbox', left: 150, top: 600, width: 1200, text: 'WARMEST\nWISHES', fontFamily: 'Playfair Display', fontSize: 110, fontWeight: 'bold', fill: '#f9a825', textAlign: 'center', lineHeight: 1.15, charSpacing: 100, shadow: { color: 'rgba(249,168,37,0.3)', blur: 20, offsetX: 0, offsetY: 0 } },
      // Decorative divider with diamond
      { type: 'rect', left: 450, top: 880, width: 250, height: 2, fill: 'rgba(249,168,37,0.4)' },
      { type: 'diamond', left: 725, top: 873, width: 14, height: 18, fill: '#f9a825', opacity: 0.6 },
      { type: 'rect', left: 760, top: 880, width: 250, height: 2, fill: 'rgba(249,168,37,0.4)' },
      // Message
      { type: 'textbox', left: 150, top: 940, width: 1200, text: 'Wishing you peace, joy,\nand a wonderful new year.', fontFamily: 'Lora', fontSize: 30, fontStyle: 'italic', fill: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 1.6 },
      // From line
      { type: 'textbox', left: 150, top: 1120, width: 1200, text: 'From our family to yours', fontFamily: 'DM Sans', fontSize: 24, fill: 'rgba(255,255,255,0.5)', textAlign: 'center' },
      { type: 'textbox', left: 150, top: 1170, width: 1200, text: 'The Anderson Family \u00b7 2026', fontFamily: 'DM Sans', fontSize: 20, fill: 'rgba(255,255,255,0.35)', textAlign: 'center', charSpacing: 150 },
      // Bottom decorative ornaments
      { type: 'circle', left: 550, top: 1800, radius: 22, fill: '#c62828', opacity: 0.5 },
      { type: 'rect', left: 570, top: 1790, width: 6, height: 12, fill: '#f9a825', opacity: 0.5 },
      { type: 'circle', left: 700, top: 1820, radius: 18, fill: '#f9a825', opacity: 0.4 },
      { type: 'rect', left: 716, top: 1812, width: 5, height: 10, fill: '#c62828', opacity: 0.4 },
      { type: 'circle', left: 850, top: 1800, radius: 20, fill: '#2e7d32', opacity: 0.45 },
      { type: 'rect', left: 868, top: 1791, width: 5, height: 11, fill: '#f9a825', opacity: 0.45 },
    ]),

  // 50. New Year — fireworks, confetti, champagne, gold/silver/black
  tpl('new-year-2026', 'Here\'s to 2026', 'New Year celebration with fireworks, confetti, and champagne',
    'Seasonal', 'New Year', ['new year', 'celebration', '2026', 'party'],
    1080, 1080, 'gradient', 'linear:to-bottom:#0a0a1a:#1a1030', [
      // Firework burst 1 — top-left, gold
      { type: 'rect', left: 200, top: 80, width: 2, height: 60, fill: '#ffd700', opacity: 0.7, angle: 0 },
      { type: 'rect', left: 200, top: 80, width: 2, height: 55, fill: '#ffd700', opacity: 0.6, angle: 45 },
      { type: 'rect', left: 200, top: 80, width: 2, height: 50, fill: '#ffd700', opacity: 0.5, angle: 90 },
      { type: 'rect', left: 200, top: 80, width: 2, height: 55, fill: '#ffd700', opacity: 0.6, angle: 135 },
      { type: 'rect', left: 200, top: 80, width: 2, height: 45, fill: '#ffd700', opacity: 0.4, angle: 22 },
      { type: 'rect', left: 200, top: 80, width: 2, height: 48, fill: '#ffd700', opacity: 0.45, angle: 67 },
      { type: 'rect', left: 200, top: 80, width: 2, height: 52, fill: '#ffd700', opacity: 0.5, angle: 112 },
      { type: 'rect', left: 200, top: 80, width: 2, height: 46, fill: '#ffd700', opacity: 0.4, angle: 157 },
      { type: 'circle', left: 195, top: 75, radius: 8, fill: '#ffd700', opacity: 0.8, shadow: { color: 'rgba(255,215,0,0.5)', blur: 16, offsetX: 0, offsetY: 0 } },
      // Firework burst 2 — top-right, silver
      { type: 'rect', left: 850, top: 130, width: 2, height: 50, fill: '#c0c0c0', opacity: 0.6, angle: 0 },
      { type: 'rect', left: 850, top: 130, width: 2, height: 45, fill: '#c0c0c0', opacity: 0.5, angle: 45 },
      { type: 'rect', left: 850, top: 130, width: 2, height: 48, fill: '#c0c0c0', opacity: 0.55, angle: 90 },
      { type: 'rect', left: 850, top: 130, width: 2, height: 42, fill: '#c0c0c0', opacity: 0.5, angle: 135 },
      { type: 'rect', left: 850, top: 130, width: 2, height: 40, fill: '#c0c0c0', opacity: 0.35, angle: 67 },
      { type: 'rect', left: 850, top: 130, width: 2, height: 44, fill: '#c0c0c0', opacity: 0.4, angle: 112 },
      { type: 'circle', left: 845, top: 125, radius: 6, fill: '#c0c0c0', opacity: 0.7, shadow: { color: 'rgba(192,192,192,0.4)', blur: 12, offsetX: 0, offsetY: 0 } },
      // Firework burst 3 — center top, white
      { type: 'rect', left: 540, top: 50, width: 2, height: 40, fill: '#ffffff', opacity: 0.5, angle: 0 },
      { type: 'rect', left: 540, top: 50, width: 2, height: 38, fill: '#ffffff', opacity: 0.45, angle: 60 },
      { type: 'rect', left: 540, top: 50, width: 2, height: 42, fill: '#ffffff', opacity: 0.5, angle: 120 },
      { type: 'rect', left: 540, top: 50, width: 2, height: 36, fill: '#ffffff', opacity: 0.4, angle: 30 },
      { type: 'rect', left: 540, top: 50, width: 2, height: 35, fill: '#ffffff', opacity: 0.35, angle: 90 },
      { type: 'rect', left: 540, top: 50, width: 2, height: 37, fill: '#ffffff', opacity: 0.4, angle: 150 },
      // Confetti — rotated rects, triangles, circles in gold/silver/white
      { type: 'rect', left: 120, top: 200, width: 12, height: 6, fill: '#ffd700', opacity: 0.7, angle: 35 },
      { type: 'rect', left: 350, top: 150, width: 10, height: 5, fill: '#c0c0c0', opacity: 0.6, angle: -20 },
      { type: 'triangle', left: 700, top: 230, width: 14, height: 12, fill: '#ffd700', opacity: 0.5, angle: 45 },
      { type: 'rect', left: 950, top: 280, width: 11, height: 5, fill: '#ffffff', opacity: 0.5, angle: 65 },
      { type: 'circle', left: 450, top: 180, radius: 5, fill: '#ffd700', opacity: 0.6 },
      { type: 'rect', left: 80, top: 400, width: 10, height: 5, fill: '#c0c0c0', opacity: 0.4, angle: -40 },
      { type: 'triangle', left: 980, top: 450, width: 12, height: 10, fill: '#ffd700', opacity: 0.45, angle: 70 },
      { type: 'rect', left: 200, top: 600, width: 9, height: 4, fill: '#ffffff', opacity: 0.35, angle: 25 },
      { type: 'circle', left: 900, top: 550, radius: 4, fill: '#c0c0c0', opacity: 0.4 },
      { type: 'rect', left: 750, top: 650, width: 11, height: 5, fill: '#ffd700', opacity: 0.3, angle: -55 },
      { type: 'triangle', left: 150, top: 700, width: 10, height: 8, fill: '#c0c0c0', opacity: 0.25, angle: 80 },
      { type: 'rect', left: 600, top: 750, width: 8, height: 4, fill: '#ffd700', opacity: 0.2, angle: 15 },
      // Champagne glass silhouette — triangle bowl + line stem + circle base
      { type: 'triangle', left: 60, top: 780, width: 80, height: 100, fill: 'rgba(255,215,0,0.12)' },
      { type: 'rect', left: 96, top: 880, width: 4, height: 50, fill: 'rgba(255,215,0,0.12)' },
      { type: 'circle', left: 80, top: 930, radius: 20, fill: 'rgba(255,215,0,0.08)' },
      // Second champagne glass
      { type: 'triangle', left: 940, top: 800, width: 70, height: 90, fill: 'rgba(192,192,192,0.10)' },
      { type: 'rect', left: 972, top: 890, width: 4, height: 45, fill: 'rgba(192,192,192,0.10)' },
      { type: 'circle', left: 957, top: 935, radius: 18, fill: 'rgba(192,192,192,0.07)' },
      // Large year heading — gold gradient
      { type: 'textbox', left: 100, top: 300, width: 880, text: '2026', fontFamily: 'Bebas Neue', fontSize: 220, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 880, y2: 0 }, colorStops: [{ offset: 0, color: '#ffd700' }, { offset: 0.5, color: '#fff8e1' }, { offset: 1, color: '#ffd700' }] }, textAlign: 'center', shadow: { color: 'rgba(255,215,0,0.4)', blur: 30, offsetX: 0, offsetY: 0 } },
      // Subtitle
      { type: 'textbox', left: 100, top: 540, width: 880, text: 'HAPPY NEW YEAR', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: 'rgba(255,255,255,0.8)', textAlign: 'center', charSpacing: 400 },
      // Decorative star divider
      { type: 'rect', left: 300, top: 610, width: 180, height: 1, fill: 'rgba(255,215,0,0.3)' },
      { type: 'star', left: 510, top: 603, width: 16, height: 16, fill: '#ffd700', opacity: 0.5 },
      { type: 'rect', left: 560, top: 610, width: 180, height: 1, fill: 'rgba(255,215,0,0.3)' },
      // Message
      { type: 'textbox', left: 100, top: 660, width: 880, text: 'May this year bring you\njoy, growth, and adventure.', fontFamily: 'Lora', fontSize: 28, fontStyle: 'italic', fill: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.6 },
      // Bottom sparkle stars
      { type: 'star', left: 250, top: 900, width: 12, height: 12, fill: '#ffd700', opacity: 0.4 },
      { type: 'star', left: 500, top: 950, width: 10, height: 10, fill: '#c0c0c0', opacity: 0.3 },
      { type: 'star', left: 780, top: 920, width: 14, height: 14, fill: '#ffd700', opacity: 0.35 },
    ]),

  // ─── SHOWCASE — Hero screenshot template ────────────────────────────

  // 51. Product Launch Showcase — modern architecture studio brand
  //     presentation. Asymmetric grid, confident typography, restrained
  //     palette. The kind of design that gets 5K likes on Behance.
  tpl('product-launch-showcase', 'Aura Studio — Brand Launch', 'Modern brand presentation with editorial typography and gradient accents',
    'Marketing', 'Product Launch', ['showcase', 'brand', 'launch', 'studio', 'architecture', 'modern'],
    1080, 1080, 'solid', '#f5f0ea', [

      // ── Top bar — thin accent gradient stripe across full width
      { type: 'rect', left: 0, top: 0, width: 1080, height: 5,
        fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 0 },
          colorStops: [{ offset: 0, color: '#c4704a' }, { offset: 0.5, color: '#d4966e' }, { offset: 1, color: '#8a5a3a' }] } },

      // ── Left column: brand info block ─────────────────────────

      // Small label — studio name
      { type: 'textbox', left: 80, top: 70, width: 400, text: 'AURA STUDIO',
        fontFamily: 'DM Sans', fontSize: 11, fontWeight: 'bold', fill: '#c4704a', charSpacing: 400 },

      // Thin horizontal rule under label
      { type: 'rect', left: 80, top: 98, width: 40, height: 1.5, fill: '#c4704a' },

      // Oversized display year — background texture element
      { type: 'textbox', left: 56, top: 130, width: 500, text: '2026',
        fontFamily: 'Fraunces', fontSize: 180, fill: 'rgba(42,36,30,0.04)', lineHeight: 1 },

      // ── Main headline — serif, large, editorial feel
      { type: 'textbox', left: 80, top: 200, width: 580, text: 'Spaces\nthat\nbreathe.',
        fontFamily: 'Fraunces', fontSize: 88, fill: '#2a241e', lineHeight: 1.05,
        charSpacing: -20,
        shadow: { color: 'rgba(42,36,30,0.06)', blur: 20, offsetX: 0, offsetY: 8 } },

      // ── Body copy — clean, well-spaced
      { type: 'textbox', left: 80, top: 550, width: 440, text: 'We design homes and workspaces\nthat balance light, material, and\npurpose. Every project begins with\nlistening.',
        fontFamily: 'DM Sans', fontSize: 18, fill: '#7a7068', lineHeight: 1.7 },

      // ── Service tags — small pills
      { type: 'rect', left: 80, top: 710, width: 110, height: 28, rx: 14, ry: 14,
        fill: 'rgba(0,0,0,0)', stroke: '#c4b5a8', strokeWidth: 1 },
      { type: 'textbox', left: 80, top: 716, width: 110, text: 'INTERIORS',
        fontFamily: 'DM Sans', fontSize: 9, fill: '#9a9088', textAlign: 'center', charSpacing: 200 },

      { type: 'rect', left: 200, top: 710, width: 130, height: 28, rx: 14, ry: 14,
        fill: 'rgba(0,0,0,0)', stroke: '#c4b5a8', strokeWidth: 1 },
      { type: 'textbox', left: 200, top: 716, width: 130, text: 'RESIDENTIAL',
        fontFamily: 'DM Sans', fontSize: 9, fill: '#9a9088', textAlign: 'center', charSpacing: 200 },

      { type: 'rect', left: 340, top: 710, width: 110, height: 28, rx: 14, ry: 14,
        fill: 'rgba(0,0,0,0)', stroke: '#c4b5a8', strokeWidth: 1 },
      { type: 'textbox', left: 340, top: 716, width: 110, text: 'COMMERCIAL',
        fontFamily: 'DM Sans', fontSize: 9, fill: '#9a9088', textAlign: 'center', charSpacing: 200 },

      // ── Right column: hero image placeholder + accent block ───

      // Large image placeholder — warm toned rect
      { type: 'rect', left: 580, top: 70, width: 420, height: 520, rx: 6, ry: 6,
        fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 420, y2: 520 },
          colorStops: [{ offset: 0, color: '#d4c4b0' }, { offset: 0.4, color: '#c4b09a' }, { offset: 1, color: '#a89480' }] },
        shadow: { color: 'rgba(42,36,30,0.12)', blur: 32, offsetX: 0, offsetY: 8 } },

      // Accent block — overlapping card with gradient, offset from image
      { type: 'rect', left: 640, top: 530, width: 360, height: 200, rx: 4, ry: 4,
        fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 360, y2: 200 },
          colorStops: [{ offset: 0, color: '#2a241e' }, { offset: 1, color: '#3d3530' }] },
        shadow: { color: 'rgba(42,36,30,0.2)', blur: 24, offsetX: 0, offsetY: 6 } },

      // Quote inside accent block
      { type: 'textbox', left: 672, top: 562, width: 296, text: '\u201CArchitecture is the\nthoughtful making\nof space.\u201D',
        fontFamily: 'Fraunces', fontSize: 22, fontStyle: 'italic', fill: '#e8dcc8', lineHeight: 1.5 },

      // Attribution
      { type: 'textbox', left: 672, top: 680, width: 296, text: '\u2014 Louis Kahn',
        fontFamily: 'DM Sans', fontSize: 12, fill: 'rgba(232,220,200,0.4)' },

      // ── Bottom bar ────────────────────────────────────────────

      // Horizontal divider
      { type: 'rect', left: 80, top: 790, width: 920, height: 1, fill: '#e0d8cf' },

      // Bottom left — website
      { type: 'textbox', left: 80, top: 818, width: 300, text: 'aurastudio.design',
        fontFamily: 'DM Sans', fontSize: 13, fill: '#9a9088' },

      // Bottom center — location
      { type: 'textbox', left: 340, top: 818, width: 400, text: 'Copenhagen  \u00B7  New York  \u00B7  Tokyo',
        fontFamily: 'DM Sans', fontSize: 13, fill: '#9a9088', textAlign: 'center' },

      // Bottom right — CTA with accent color
      { type: 'textbox', left: 740, top: 818, width: 260, text: 'VIEW PORTFOLIO  \u2192',
        fontFamily: 'DM Sans', fontSize: 12, fontWeight: 'bold', fill: '#c4704a',
        textAlign: 'right', charSpacing: 200 },

      // ── Subtle design details ─────────────────────────────────

      // Vertical accent line — left margin detail
      { type: 'rect', left: 60, top: 70, width: 1.5, height: 120,
        fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 120 },
          colorStops: [{ offset: 0, color: '#c4704a' }, { offset: 1, color: 'rgba(196,112,74,0)' }] } },

      // Corner mark — top right
      { type: 'rect', left: 980, top: 24, width: 20, height: 1, fill: 'rgba(42,36,30,0.15)' },
      { type: 'rect', left: 999, top: 24, width: 1, height: 20, fill: 'rgba(42,36,30,0.15)' },
    ]),

];

// ─── Utility functions ──────────────────────────────────────────────

/** Get all unique template categories */
export function getTemplateCategories(): string[] {
  const categories = new Set(TEMPLATE_REGISTRY.map((t) => t.category));
  return Array.from(categories);
}

/** Get templates filtered by category */
export function getTemplatesByCategory(category: string): Template[] {
  return TEMPLATE_REGISTRY.filter((t) => t.category === category);
}
