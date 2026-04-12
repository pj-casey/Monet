/**
 * Template Registry — 53 built-in templates.
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
 * Every template uses realistic content and at least 2 advanced features:
 * gradient fills, opacity shapes, multiple font weights, accent color, shadows, text stroke.
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

  // 1. Podcast Cover — gradient on EP button, shadow+charSpacing on heading
  tpl('podcast-cover', 'The Night Owl Show', 'Podcast cover with radial gradient and mic motif',
    'Social Media', 'Podcast', ['podcast', 'cover', 'audio', 'show'],
    1080, 1080, 'gradient', 'linear:to-bottom:#0f172a:#1e1b4b', [
      { type: 'circle', left: 440, top: 280, radius: 80, fill: '#C4704A', opacity: 0.25 },
      { type: 'circle', left: 490, top: 400, radius: 30, fill: '#C4704A' },
      { type: 'rect', left: 510, top: 430, width: 20, height: 120, fill: '#C4704A', rx: 10, ry: 10 },
      { type: 'textbox', left: 100, top: 600, width: 880, text: 'THE NIGHT OWL\nSHOW', fontFamily: 'Montserrat', fontSize: 82, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 1.05, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 100, top: 820, width: 880, text: 'with Marcus Rivera', fontFamily: 'DM Sans', fontSize: 28, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      { type: 'rect', left: 420, top: 910, width: 240, height: 48, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 240, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] }, rx: 24, ry: 24 },
      { type: 'textbox', left: 420, top: 920, width: 240, text: 'EP. 47', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  // 2. Instagram Quote — gradient on divider rect, shadow+charSpacing on heading
  tpl('ig-quote-believe', 'She Believed She Could', 'Inspirational quote with peach gradient',
    'Social Media', 'Instagram Post', ['instagram', 'quote', 'inspirational', 'women'],
    1080, 1080, 'gradient', 'linear:to-bottom-right:#fcd5ce:#f8b4b4', [
      { type: 'textbox', left: 60, top: 120, width: 300, text: '\u201C', fontFamily: 'Playfair Display', fontSize: 280, fill: '#c2857a', textAlign: 'left', opacity: 0.2 },
      { type: 'textbox', left: 120, top: 340, width: 840, text: 'She believed she could,\nso she did.', fontFamily: 'Playfair Display', fontSize: 56, fontStyle: 'italic', fill: '#4a2c2a', textAlign: 'center', lineHeight: 1.5, charSpacing: 50, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 460, top: 640, width: 160, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 160, y2: 0 }, colorStops: [{ offset: 0, color: '#c2857a' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 120, top: 680, width: 840, text: '\u2014 R.S. Grey', fontFamily: 'DM Sans', fontSize: 22, fill: '#7a5550', textAlign: 'center' },
      { type: 'textbox', left: 680, top: 120, width: 300, text: '\u201D', fontFamily: 'Playfair Display', fontSize: 280, fill: '#c2857a', textAlign: 'right', opacity: 0.2 },
    ]),

  // 3. Instagram Story Sale — gradient on CTA button, shadow on heading (already has charSpacing)
  tpl('ig-story-sale', 'Summer Collection Sale', 'Story with bold sale text and CTA',
    'Social Media', 'Instagram Story', ['instagram', 'story', 'sale', 'summer', 'fashion'],
    1080, 1920, 'gradient', 'linear:to-bottom-right:#C4704A:#e76f51', [
      { type: 'circle', left: -60, top: 100, radius: 200, fill: 'rgba(255,255,255,0.08)' },
      { type: 'circle', left: 800, top: 1400, radius: 260, fill: 'rgba(255,255,255,0.06)' },
      { type: 'textbox', left: 100, top: 520, width: 880, text: 'SUMMER COLLECTION', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: 'rgba(255,255,255,0.85)', textAlign: 'center', charSpacing: 400 },
      { type: 'textbox', left: 100, top: 620, width: 880, text: '40% OFF', fontFamily: 'Montserrat', fontSize: 140, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 100, top: 820, width: 880, text: 'USE CODE: SUN40', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(255,255,255,0.75)', textAlign: 'center', charSpacing: 200 },
      { type: 'rect', left: 340, top: 960, width: 400, height: 64, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f0e6df' }] }, rx: 32, ry: 32 },
      { type: 'textbox', left: 340, top: 975, width: 400, text: 'Shop Now \u2192', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center' },
    ]),

  // 4. YouTube Thumbnail — gradient on accent line, shadow on heading (already has stroke)
  tpl('yt-thumb-mistakes', '5 Design Mistakes', 'YouTube thumbnail with bold warning text',
    'Social Media', 'YouTube Thumbnail', ['youtube', 'thumbnail', 'design', 'mistakes'],
    1280, 720, 'solid', '#0f0f0f', [
      { type: 'circle', left: 800, top: 180, radius: 180, fill: '#2a2a2a' },
      { type: 'textbox', left: 830, top: 310, width: 300, text: '?', fontFamily: 'Inter', fontSize: 120, fontWeight: 'bold', fill: '#444444', textAlign: 'center' },
      { type: 'circle', left: 1080, top: 40, radius: 48, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 96, y2: 96 }, colorStops: [{ offset: 0, color: '#dc2626' }, { offset: 1, color: '#ef4444' }] } },
      { type: 'textbox', left: 1080, top: 52, width: 96, text: '!', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 60, top: 180, width: 720, text: '5 DESIGN\nMISTAKES', fontFamily: 'Montserrat', fontSize: 96, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.0, stroke: '#C4704A', strokeWidth: 2, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 60, top: 460, width: 720, text: 'that ruin your brand', fontFamily: 'DM Sans', fontSize: 36, fill: '#C4704A' },
      { type: 'rect', left: 60, top: 560, width: 200, height: 4, fill: '#C4704A' },
    ]),

  // 5. LinkedIn Carousel — gradient on accent bar, shadow+charSpacing on heading (already has shadow on card)
  tpl('li-carousel-cover', '2026 Marketing Trends', 'LinkedIn carousel cover with accent bar',
    'Social Media', 'LinkedIn Post', ['linkedin', 'carousel', 'marketing', 'trends'],
    1080, 1080, 'solid', '#faf8f5', [
      { type: 'rect', left: 0, top: 0, width: 8, height: 1080, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 1080 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'rect', left: 60, top: 200, width: 700, height: 560, fill: '#ffffff', rx: 8, ry: 8, shadow: { color: 'rgba(0,0,0,0.08)', blur: 24, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 110, top: 260, width: 600, text: '2026\nMarketing\nTrends', fontFamily: 'Playfair Display', fontSize: 80, fontWeight: 'bold', fill: '#1a1520', lineHeight: 1.15, charSpacing: 50, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 110, top: 590, width: 60, height: 4, fill: '#C4704A' },
      { type: 'textbox', left: 110, top: 620, width: 600, text: 'A comprehensive guide for\nmodern marketers', fontFamily: 'DM Sans', fontSize: 24, fill: '#6b6b6b', lineHeight: 1.5 },
      { type: 'textbox', left: 110, top: 720, width: 200, text: '1 / 10', fontFamily: 'DM Sans', fontSize: 18, fill: '#C4704A', fontWeight: 'bold' },
    ]),

  // 6. Twitter Banner — gradient on accent line, shadow+charSpacing on heading (already has charSpacing)
  tpl('tw-banner-studio', 'Creative Studio', 'Minimal Twitter banner with gradient line',
    'Social Media', 'Twitter Header', ['twitter', 'banner', 'minimal', 'studio'],
    1500, 500, 'solid', '#ffffff', [
      { type: 'textbox', left: 100, top: 170, width: 800, text: 'CREATIVE STUDIO', fontFamily: 'Inter', fontSize: 52, fontWeight: 'bold', fill: '#1a1a1a', charSpacing: 600, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 100, top: 260, width: 400, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'rect', left: 500, top: 260, width: 400, height: 3, fill: '#C4704A', opacity: 0.3 },
      { type: 'textbox', left: 100, top: 290, width: 600, text: '@studio.creative', fontFamily: 'DM Sans', fontSize: 20, fill: '#999999' },
      { type: 'circle', left: 1260, top: 180, radius: 60, fill: 'rgba(196,112,74,0.1)' },
      { type: 'circle', left: 1300, top: 220, radius: 35, fill: 'rgba(196,112,74,0.18)' },
    ]),

  // 7. Pinterest Pin — gradient on accent line, shadow+charSpacing on heading
  tpl('pin-home-office', 'Minimalist Home Office', 'Pinterest pin with photo placeholder',
    'Social Media', 'Pinterest Pin', ['pinterest', 'pin', 'home', 'office', 'minimal'],
    1000, 1500, 'solid', '#f5f0eb', [
      { type: 'rect', left: 80, top: 80, width: 840, height: 600, fill: '#e0d8cf', rx: 12, ry: 12 },
      { type: 'textbox', left: 340, top: 330, width: 320, text: 'YOUR PHOTO', fontFamily: 'DM Sans', fontSize: 20, fill: '#b0a89e', textAlign: 'center' },
      { type: 'textbox', left: 80, top: 750, width: 840, text: 'Minimalist\nHome Office', fontFamily: 'Playfair Display', fontSize: 64, fontWeight: 'bold', fill: '#2d2520', lineHeight: 1.2, charSpacing: 50, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 80, top: 960, width: 50, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 50, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 80, top: 990, width: 840, text: '12 essentials for your workspace', fontFamily: 'DM Sans', fontSize: 24, fill: '#7a6e64', lineHeight: 1.4 },
      { type: 'circle', left: 450, top: 1360, radius: 28, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 2, strokeUniform: true },
      { type: 'textbox', left: 448, top: 1365, width: 60, text: '\u2193', fontFamily: 'Inter', fontSize: 24, fill: '#C4704A', textAlign: 'center' },
    ]),

  // 8. TikTok Cover — gradient on accent line, shadow on heading (already has stroke+charSpacing not present, add charSpacing)
  tpl('tiktok-cover-watch', 'Watch This!', 'TikTok cover with bold angled typography',
    'Social Media', 'TikTok Cover', ['tiktok', 'cover', 'bold', 'creative'],
    1080, 1920, 'solid', '#0a0a0a', [
      { type: 'rect', left: 200, top: 300, width: 400, height: 400, fill: '#C4704A', opacity: 0.1, angle: 25 },
      { type: 'rect', left: 500, top: 800, width: 300, height: 300, fill: '#C4704A', opacity: 0.2, angle: -15 },
      { type: 'rect', left: 100, top: 1100, width: 200, height: 200, fill: '#C4704A', opacity: 0.3, angle: 40 },
      { type: 'textbox', left: 80, top: 700, width: 920, text: 'WATCH\nTHIS!', fontFamily: 'Montserrat', fontSize: 160, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 0.95, stroke: '#C4704A', strokeWidth: 3, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 340, top: 1100, width: 400, height: 6, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 100, top: 1700, width: 880, text: '@creativedaily', fontFamily: 'DM Sans', fontSize: 24, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
    ]),

  // 9. Facebook Event — gradient on accent line, shadow+charSpacing on heading
  tpl('fb-event-jazz', 'Jazz in the Park', 'Facebook event cover with warm palette',
    'Social Media', 'Facebook Event', ['facebook', 'event', 'jazz', 'music', 'concert'],
    1200, 628, 'gradient', 'linear:to-bottom:#2d1810:#0a0a0a', [
      { type: 'circle', left: 900, top: 80, radius: 50, fill: '#C4704A', opacity: 0.25 },
      { type: 'circle', left: 1000, top: 200, radius: 30, fill: '#C4704A', opacity: 0.15 },
      { type: 'circle', left: 850, top: 250, radius: 20, fill: '#C4704A', opacity: 0.2 },
      { type: 'rect', left: 80, top: 120, width: 60, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 60, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 80, top: 150, width: 700, text: 'JAZZ IN\nTHE PARK', fontFamily: 'Playfair Display', fontSize: 80, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.05, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 80, top: 380, width: 700, text: 'Saturday, July 19 \u00b7 7 PM', fontFamily: 'DM Sans', fontSize: 22, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 80, top: 420, width: 700, text: 'Riverside Amphitheater \u00b7 Free Admission', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(255,255,255,0.5)' },
    ]),

  // 10. Discord Banner — already has shadow on heading; add gradient on accent line, charSpacing on heading
  tpl('discord-banner', 'Pixel Collective', 'Discord server banner with tech aesthetic',
    'Social Media', 'Discord Banner', ['discord', 'banner', 'gaming', 'tech', 'community'],
    960, 540, 'solid', '#111111', [
      { type: 'rect', left: 60, top: 60, width: 120, height: 120, fill: 'rgba(255,255,255,0.03)', rx: 4, ry: 4 },
      { type: 'rect', left: 200, top: 60, width: 120, height: 120, fill: 'rgba(255,255,255,0.05)', rx: 4, ry: 4 },
      { type: 'rect', left: 60, top: 200, width: 120, height: 120, fill: 'rgba(255,255,255,0.05)', rx: 4, ry: 4 },
      { type: 'rect', left: 200, top: 200, width: 120, height: 120, fill: 'rgba(255,255,255,0.03)', rx: 4, ry: 4 },
      { type: 'textbox', left: 400, top: 160, width: 500, text: 'PIXEL COLLECTIVE', fontFamily: 'Montserrat', fontSize: 48, fontWeight: 'bold', fill: '#22d3ee', textAlign: 'left', charSpacing: 100, shadow: { color: 'rgba(34,211,238,0.4)', blur: 20, offsetX: 0, offsetY: 0 } },
      { type: 'textbox', left: 400, top: 240, width: 500, text: 'Design \u00b7 Code \u00b7 Create', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.45)' },
      { type: 'rect', left: 400, top: 300, width: 160, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 160, y2: 0 }, colorStops: [{ offset: 0, color: '#22d3ee' }, { offset: 1, color: '#667eea' }] }, opacity: 0.5 },
    ]),

  // ─── BUSINESS — CARDS / INVOICES / PROPOSALS / CERTIFICATES ──────

  // 11. Business Card — gradient on accent line, shadow+charSpacing on heading (already has charSpacing)
  tpl('biz-card-elena', 'Elena Vasquez, Architect', 'Minimal business card with warm accent',
    'Business', 'Business Card', ['business card', 'architect', 'minimal', 'professional'],
    1050, 600, 'solid', '#faf8f5', [
      { type: 'textbox', left: 80, top: 100, width: 600, text: 'ELENA VASQUEZ', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#1a1520', charSpacing: 200, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 80, top: 150, width: 600, text: 'Senior Architect', fontFamily: 'DM Sans', fontSize: 18, fill: '#8a8078' },
      { type: 'rect', left: 80, top: 200, width: 50, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 50, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 80, top: 360, width: 500, text: 'elena@meridianstudio.com\n(312) 555-0198\nmeridianstudio.com', fontFamily: 'DM Sans', fontSize: 14, fill: '#6b6260', lineHeight: 1.8 },
      { type: 'textbox', left: 750, top: 480, width: 250, text: 'MERIDIAN\nSTUDIO', fontFamily: 'Montserrat', fontSize: 14, fontWeight: 'bold', fill: '#C4704A', textAlign: 'right', lineHeight: 1.3, charSpacing: 300 },
    ]),

  // 12. Invoice — gradient on header bar, shadow+charSpacing on INVOICE heading
  tpl('invoice-studio', 'Studio Monet Invoice', 'Clean invoice template with accent header',
    'Business', 'Invoice', ['invoice', 'billing', 'freelance', 'studio'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 2550, height: 12, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 2550, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 160, top: 100, width: 600, text: 'Studio Monet', fontFamily: 'Playfair Display', fontSize: 40, fontWeight: 'bold', fill: '#1a1520' },
      { type: 'textbox', left: 1700, top: 100, width: 700, text: 'INVOICE', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#C4704A', textAlign: 'right', charSpacing: 200, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 1700, top: 180, width: 700, text: 'Invoice #1024\nDate: March 15, 2026\nDue: April 14, 2026', fontFamily: 'DM Sans', fontSize: 18, fill: '#6b6b6b', textAlign: 'right', lineHeight: 1.8 },
      { type: 'rect', left: 160, top: 600, width: 2230, height: 60, fill: '#C4704A', rx: 4, ry: 4 },
      { type: 'textbox', left: 180, top: 612, width: 2200, text: 'Description                                                                           Qty       Rate           Amount', fontFamily: 'DM Sans', fontSize: 17, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 160, top: 720, width: 2230, text: 'Brand Identity Design                                                                  1       $4,500         $4,500\nWebsite UI/UX Design                                                                   1       $6,200         $6,200\nSocial Media Templates (12)                                                         12        $150          $1,800', fontFamily: 'DM Sans', fontSize: 16, fill: '#2d2a26', lineHeight: 2.4 },
    ]),

  // 13. One-Pager — gradient on stat highlight area, shadow on heading (already has charSpacing)
  tpl('one-pager-apex', 'Apex Consulting', 'Company one-pager with gradient header',
    'Business', 'One-Pager', ['one-pager', 'consulting', 'company', 'corporate'],
    2550, 3300, 'gradient', 'linear:to-bottom:#C4704A:#2d1810', [
      { type: 'rect', left: 0, top: 800, width: 2550, height: 2500, fill: '#ffffff' },
      { type: 'textbox', left: 200, top: 200, width: 2150, text: 'APEX CONSULTING', fontFamily: 'Montserrat', fontSize: 64, fontWeight: 'bold', fill: '#ffffff', charSpacing: 400, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 320, width: 2150, text: 'Strategy \u00b7 Growth \u00b7 Impact', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 200, top: 500, width: 600, height: 180, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 600, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(255,255,255,0.15)' }, { offset: 1, color: 'rgba(255,255,255,0.05)' }] }, rx: 8, ry: 8 },
      { type: 'textbox', left: 200, top: 520, width: 600, text: '150+\nClients Served', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.3 },
      { type: 'textbox', left: 900, top: 520, width: 600, text: '$2.4B\nRevenue Generated', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.3 },
      { type: 'textbox', left: 1600, top: 520, width: 600, text: '98%\nClient Retention', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.3 },
      { type: 'textbox', left: 200, top: 920, width: 2150, text: 'We help mid-market companies unlock their next stage of growth through data-driven strategy, operational excellence, and leadership development. Founded in 2014, Apex has offices in Chicago, Austin, and London.', fontFamily: 'DM Sans', fontSize: 22, fill: '#444444', lineHeight: 1.7 },
    ]),

  // 14. Email Signature — gradient on accent line, shadow+charSpacing on name
  tpl('email-sig-david', 'David Chen', 'Compact professional email signature',
    'Business', 'Email Signature', ['email', 'signature', 'professional', 'tech'],
    600, 200, 'solid', '#ffffff', [
      { type: 'textbox', left: 20, top: 24, width: 360, text: 'David Chen', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 20, top: 58, width: 400, text: 'Product Lead, Wavefront Labs', fontFamily: 'DM Sans', fontSize: 13, fill: '#555555' },
      { type: 'rect', left: 20, top: 90, width: 40, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 40, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 20, top: 108, width: 560, text: 'david@wavefront.io \u00b7 (415) 555-0142', fontFamily: 'DM Sans', fontSize: 12, fill: '#888888' },
      { type: 'textbox', left: 20, top: 140, width: 560, text: 'wavefrontlabs.com \u00b7 LinkedIn: /in/davidchen', fontFamily: 'DM Sans', fontSize: 11, fill: '#aaaaaa' },
    ]),

  // 15. Proposal Cover — gradient on decorative circle, shadow on heading (already has charSpacing)
  tpl('proposal-cover', 'Brand Strategy 2026', 'Proposal cover page with gradient and serif type',
    'Business', 'Proposal', ['proposal', 'cover', 'strategy', 'branding'],
    2550, 3300, 'gradient', 'linear:to-bottom:#1a1520:#C4704A', [
      { type: 'circle', left: 1125, top: 700, radius: 120, fill: 'rgba(255,255,255,0.06)' },
      { type: 'textbox', left: 400, top: 1100, width: 1750, text: 'BRAND\nSTRATEGY\n2026', fontFamily: 'Playfair Display', fontSize: 120, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 1.15, charSpacing: 200, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 1075, top: 1560, width: 400, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(255,255,255,0.1)' }, { offset: 1, color: 'rgba(255,255,255,0.5)' }] } },
      { type: 'textbox', left: 400, top: 1610, width: 1750, text: 'Prepared for Luminary Brands', fontFamily: 'DM Sans', fontSize: 24, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      { type: 'circle', left: 1200, top: 2200, radius: 50, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 400, top: 3000, width: 1750, text: 'Confidential', fontFamily: 'DM Sans', fontSize: 16, fill: 'rgba(255,255,255,0.3)', textAlign: 'center', charSpacing: 300 },
    ]),

  // 16. Certificate — gradient on accent line, shadow on heading (already has charSpacing)
  tpl('certificate-excellence', 'Certificate of Excellence', 'Formal award certificate with ornamental border',
    'Business', 'Certificate', ['certificate', 'award', 'excellence', 'formal'],
    3300, 2550, 'solid', '#faf8f5', [
      { type: 'rect', left: 80, top: 80, width: 3140, height: 2390, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 3, strokeUniform: true, rx: 8, ry: 8 },
      { type: 'rect', left: 110, top: 110, width: 3080, height: 2330, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 1, strokeUniform: true, rx: 4, ry: 4 },
      { type: 'textbox', left: 400, top: 350, width: 2500, text: 'CERTIFICATE OF EXCELLENCE', fontFamily: 'Playfair Display', fontSize: 72, fontWeight: 'bold', fill: '#1a1520', textAlign: 'center', charSpacing: 200, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 1400, top: 490, width: 500, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 500, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4a574' }] } },
      { type: 'textbox', left: 400, top: 600, width: 2500, text: 'Awarded to', fontFamily: 'DM Sans', fontSize: 22, fill: '#8a8078', textAlign: 'center' },
      { type: 'textbox', left: 400, top: 700, width: 2500, text: 'Maya Chen', fontFamily: 'Playfair Display', fontSize: 64, fontStyle: 'italic', fill: '#C4704A', textAlign: 'center' },
      { type: 'textbox', left: 400, top: 880, width: 2500, text: 'For outstanding contribution to design innovation\nand creative leadership within the organization.', fontFamily: 'DM Sans', fontSize: 24, fill: '#555555', textAlign: 'center', lineHeight: 1.6 },
      { type: 'circle', left: 2900, top: 1900, radius: 80, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 160, y2: 160 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4a574' }] } },
      { type: 'textbox', left: 2900, top: 1930, width: 160, text: '\u2605', fontFamily: 'Inter', fontSize: 60, fill: '#ffffff', textAlign: 'center' },
    ]),

  // 17. Meeting Notes — gradient on accent line, shadow+charSpacing on heading (already has charSpacing)
  tpl('meeting-notes', 'Weekly Standup Notes', 'Structured meeting notes template',
    'Business', 'Meeting Notes', ['meeting', 'notes', 'standup', 'agenda', 'team'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'textbox', left: 160, top: 140, width: 1200, text: 'WEEKLY STANDUP', fontFamily: 'Montserrat', fontSize: 42, fontWeight: 'bold', fill: '#1a1520', charSpacing: 200, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 160, top: 210, width: 100, height: 4, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 100, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 160, top: 250, width: 2000, text: 'March 18, 2026 \u00b7 10:00 AM \u00b7 Engineering Team', fontFamily: 'DM Sans', fontSize: 18, fill: '#888888' },
      { type: 'circle', left: 160, top: 420, radius: 10, fill: '#22c55e' },
      { type: 'textbox', left: 200, top: 408, width: 800, text: 'Completed', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1a1520' },
      { type: 'textbox', left: 200, top: 460, width: 2100, text: '\u2022  Shipped auth flow to production (v2.4.1)\n\u2022  Closed 14 QA tickets from sprint review\n\u2022  Deployed updated design tokens to staging', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555', lineHeight: 2.0 },
      { type: 'circle', left: 160, top: 700, radius: 10, fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 688, width: 800, text: 'In Progress', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1a1520' },
      { type: 'textbox', left: 200, top: 740, width: 2100, text: '\u2022  Dashboard redesign \u2014 60% complete (ETA Friday)\n\u2022  API rate-limiting implementation\n\u2022  User onboarding flow A/B test setup', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555', lineHeight: 2.0 },
      { type: 'circle', left: 160, top: 980, radius: 10, fill: '#dc2626' },
      { type: 'textbox', left: 200, top: 968, width: 800, text: 'Blockers', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#1a1520' },
      { type: 'textbox', left: 200, top: 1020, width: 2100, text: '\u2022  Waiting on legal review for Terms of Service update\n\u2022  CI pipeline flaky on integration tests \u2014 needs DevOps support', fontFamily: 'DM Sans', fontSize: 18, fill: '#555555', lineHeight: 2.0 },
    ]),

  // ─── BATCH 2: Business + Marketing + Events + Education + Creative (18-34) ──

  // ─── NAME BADGE — 1050×750 ──────────────────────────────────────

  // 18. Name Badge — gradient on header bar, shadow on heading (already has charSpacing)
  tpl('name-badge', 'Sarah Mitchell, Speaker', 'Conference badge with gradient header and speaker details',
    'Business', 'Name Badge', ['badge', 'conference', 'speaker', 'event'],
    1050, 750, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 1050, height: 180, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1050, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'rect', left: 0, top: 0, width: 1050, height: 180, fill: 'rgba(232,149,109,0.45)', opacity: 0.6 },
      { type: 'textbox', left: 60, top: 40, width: 930, text: 'SARAH MITCHELL', fontFamily: 'Montserrat', fontSize: 52, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 200, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 60, top: 115, width: 930, text: 'Keynote Speaker', fontFamily: 'DM Sans', fontSize: 24, fill: 'rgba(255,255,255,0.85)', textAlign: 'center' },
      { type: 'circle', left: 495, top: 300, radius: 70, fill: '#f5f0eb', stroke: '#C4704A', strokeWidth: 3 },
      { type: 'textbox', left: 60, top: 480, width: 930, text: 'Creative Director · Luminary Studio', fontFamily: 'DM Sans', fontSize: 22, fill: '#555555', textAlign: 'center' },
      { type: 'textbox', left: 60, top: 640, width: 930, text: 'DESIGNCON 2026', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 300 },
    ]),

  // ─── PRODUCT LAUNCH — 2550×3300 ────────────────────────────────

  // 19. Product Launch — gradient on CTA button, shadow+charSpacing on heading
  tpl('product-launch', 'Introducing AuraSound', 'Product launch announcement with dark gradient and feature highlights',
    'Marketing', 'Product Launch', ['product', 'launch', 'tech', 'audio'],
    2550, 3300, 'gradient', 'linear:to-bottom:#1a1a2e:#0a0a14', [
      { type: 'circle', left: 875, top: 600, radius: 320, fill: 'rgba(196,112,74,0.12)' },
      { type: 'circle', left: 975, top: 700, radius: 220, fill: 'rgba(196,112,74,0.08)', stroke: '#C4704A', strokeWidth: 1 },
      { type: 'textbox', left: 200, top: 450, width: 2150, text: 'INTRODUCING', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 600 },
      { type: 'textbox', left: 200, top: 1200, width: 2150, text: 'AuraSound', fontFamily: 'Playfair Display', fontSize: 140, fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 1420, width: 2150, text: 'Immersive spatial audio. Crafted for the way you listen.', fontFamily: 'DM Sans', fontSize: 36, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      { type: 'rect', left: 1175, top: 1550, width: 200, height: 2, fill: 'rgba(196,112,74,0.5)' },
      { type: 'circle', left: 550, top: 1700, radius: 8, fill: '#C4704A' },
      { type: 'textbox', left: 590, top: 1688, width: 1600, text: '360° Spatial Audio  ·  40-Hour Battery  ·  Active Noise Cancellation', fontFamily: 'DM Sans', fontSize: 28, fill: 'rgba(255,255,255,0.5)' },
      { type: 'rect', left: 900, top: 2000, width: 750, height: 90, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 750, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] }, rx: 45, ry: 45 },
      { type: 'textbox', left: 900, top: 2020, width: 750, text: 'Pre-order · $199', fontFamily: 'Montserrat', fontSize: 32, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  // ─── RESTAURANT MENU — 2550×3300 ───────────────────────────────

  // 20. Restaurant Menu — gradient on divider line, shadow+charSpacing on heading (already has charSpacing)
  tpl('menu-golden-fork', 'The Golden Fork', 'Elegant dark restaurant menu with gold accents',
    'Food & Lifestyle', 'Restaurant Menu', ['menu', 'restaurant', 'dining', 'elegant'],
    2550, 3300, 'solid', '#1a1510', [
      { type: 'rect', left: 150, top: 150, width: 2250, height: 3000, fill: 'rgba(0,0,0,0)', stroke: 'rgba(196,112,74,0.3)', strokeWidth: 1 },
      { type: 'textbox', left: 200, top: 250, width: 2150, text: 'THE GOLDEN FORK', fontFamily: 'Playfair Display', fontSize: 72, fill: '#C4704A', textAlign: 'center', charSpacing: 300, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 1075, top: 380, width: 400, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4a574' }] } },
      { type: 'textbox', left: 300, top: 500, width: 1950, text: 'STARTERS', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 300, top: 580, width: 1600, text: 'Burrata & Heirloom Tomato\nwith basil oil and aged balsamic', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 580, width: 300, text: '$16', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
      { type: 'textbox', left: 300, top: 740, width: 1600, text: 'Pan-Seared Scallops\nwith cauliflower purée and brown butter', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 740, width: 300, text: '$22', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
      { type: 'rect', left: 300, top: 900, width: 1950, height: 1, fill: 'rgba(196,112,74,0.2)' },
      { type: 'textbox', left: 300, top: 960, width: 1950, text: 'MAINS', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 300, top: 1040, width: 1600, text: 'Grilled Lamb Chops\nwith rosemary jus and roasted vegetables', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 1040, width: 300, text: '$38', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
      { type: 'textbox', left: 300, top: 1200, width: 1600, text: 'Wild Salmon\nwith lemon caper sauce and asparagus', fontFamily: 'Playfair Display', fontSize: 28, fill: '#e8dcc8', lineHeight: 1.6 },
      { type: 'textbox', left: 1950, top: 1200, width: 300, text: '$34', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right' },
    ]),

  // ─── REAL ESTATE — 1080×1080 ───────────────────────────────────

  // 21. Real Estate — gradient on price badge, shadow+charSpacing on heading
  tpl('real-estate', 'Modern Loft $425,000', 'Real estate listing card with price badge and property details',
    'Marketing', 'Real Estate', ['real estate', 'listing', 'property', 'home'],
    1080, 1080, 'solid', '#f5f0eb', [
      { type: 'rect', left: 60, top: 60, width: 960, height: 480, fill: '#d6cdc4', rx: 8, ry: 8 },
      { type: 'textbox', left: 260, top: 260, width: 560, text: 'PROPERTY PHOTO', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(100,80,60,0.3)', textAlign: 'center' },
      { type: 'rect', left: 60, top: 490, width: 280, height: 60, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 280, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] }, rx: 4, ry: 4 },
      { type: 'textbox', left: 70, top: 502, width: 260, text: '$425,000', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 60, top: 600, width: 960, text: 'Modern Downtown Loft', fontFamily: 'Playfair Display', fontSize: 44, fill: '#1a1510', charSpacing: 50, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 60, top: 670, width: 960, text: '3 bed  ·  2 bath  ·  1,840 sqft', fontFamily: 'DM Sans', fontSize: 22, fill: '#888070' },
      { type: 'rect', left: 60, top: 760, width: 960, height: 2, fill: 'rgba(196,112,74,0.3)' },
      { type: 'textbox', left: 60, top: 790, width: 960, text: 'Listed by Maria Chen  ·  Compass Realty', fontFamily: 'DM Sans', fontSize: 18, fill: '#aaa090' },
      { type: 'rect', left: 0, top: 1050, width: 1080, height: 30, fill: '#C4704A', opacity: 0.8 },
    ]),

  // ─── COUPON — 1800×750 ─────────────────────────────────────────

  // 22. Coupon — gradient on brand area bg, shadow+charSpacing on heading
  tpl('coupon-twenty', '20% OFF Your Order', 'Discount coupon with dashed border and bold typography',
    'Marketing', 'Coupon', ['coupon', 'discount', 'sale', 'promo'],
    1800, 750, 'solid', '#ffffff', [
      { type: 'rect', left: 30, top: 30, width: 1740, height: 690, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 3, strokeDashArray: [12, 8] },
      { type: 'textbox', left: 100, top: 120, width: 800, text: '20% OFF', fontFamily: 'Montserrat', fontSize: 140, fontWeight: 'bold', fill: '#C4704A', charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 100, top: 310, width: 800, text: 'YOUR NEXT ORDER', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#1a1510', charSpacing: 200 },
      { type: 'rect', left: 100, top: 400, width: 600, height: 2, fill: '#e8dcc8' },
      { type: 'textbox', left: 100, top: 430, width: 800, text: 'Use code SAVE20  ·  Expires Dec 31, 2026', fontFamily: 'DM Sans', fontSize: 22, fill: '#888070' },
      { type: 'rect', left: 1100, top: 120, width: 580, height: 510, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 510 }, colorStops: [{ offset: 0, color: 'rgba(196,112,74,0.1)' }, { offset: 1, color: 'rgba(196,112,74,0.02)' }] }, rx: 12, ry: 12 },
      { type: 'textbox', left: 1100, top: 300, width: 580, text: 'ARTISAN\nGOODS CO.', fontFamily: 'Playfair Display', fontSize: 42, fill: '#C4704A', textAlign: 'center', lineHeight: 1.3 },
    ]),

  // ─── TESTIMONIAL CARD — 1080×1080 ──────────────────────────────

  // 23. Testimonial — gradient on accent line, shadow+charSpacing on quote
  tpl('testimonial-card', 'This Changed Everything', 'Customer testimonial card with quote marks and star rating',
    'Marketing', 'Testimonial', ['testimonial', 'review', 'social proof', 'quote'],
    1080, 1080, 'solid', '#faf8f5', [
      { type: 'textbox', left: 60, top: 80, width: 400, text: '\u201C', fontFamily: 'Playfair Display', fontSize: 300, fill: '#C4704A', opacity: 0.12 },
      { type: 'textbox', left: 120, top: 300, width: 840, text: '\u201CThis product completely changed how we approach design. Our conversion rate doubled in the first month.\u201D', fontFamily: 'Playfair Display', fontSize: 36, fill: '#2d2520', lineHeight: 1.6, fontStyle: 'italic', charSpacing: 50, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 120, top: 620, width: 840, text: '\u2605\u2605\u2605\u2605\u2605', fontFamily: 'Inter', fontSize: 28, fill: '#C4704A' },
      { type: 'rect', left: 120, top: 700, width: 60, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 60, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'circle', left: 120, top: 750, radius: 32, fill: '#e8dcc8' },
      { type: 'textbox', left: 200, top: 745, width: 700, text: 'Rachel Torres', fontFamily: 'Montserrat', fontSize: 20, fontWeight: 'bold', fill: '#1a1510' },
      { type: 'textbox', left: 200, top: 780, width: 700, text: 'Founder, Drift Studio', fontFamily: 'DM Sans', fontSize: 16, fill: '#888070' },
    ]),

  // ─── NEWSLETTER HEADER — 1200×400 ──────────────────────────────

  // 24. Newsletter Header — gradient on accent line, shadow on heading (already has charSpacing)
  tpl('newsletter-header', 'The Weekly Brief #47', 'Newsletter header banner with gradient and decorative elements',
    'Marketing', 'Newsletter', ['newsletter', 'email', 'header', 'weekly'],
    1200, 400, 'gradient', 'linear:to-bottom-right:#C4704A:#e8956d', [
      { type: 'circle', left: 950, top: 30, radius: 120, fill: 'rgba(255,255,255,0.08)' },
      { type: 'circle', left: 1050, top: 200, radius: 80, fill: 'rgba(255,255,255,0.06)' },
      { type: 'circle', left: 50, top: 280, radius: 60, fill: 'rgba(255,255,255,0.05)' },
      { type: 'textbox', left: 80, top: 100, width: 800, text: 'THE WEEKLY BRIEF', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#ffffff', charSpacing: 200, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 80, top: 190, width: 800, text: '#47  ·  March 2026', fontFamily: 'DM Sans', fontSize: 24, fill: 'rgba(255,255,255,0.75)' },
      { type: 'rect', left: 80, top: 260, width: 100, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 100, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(255,255,255,0.8)' }, { offset: 1, color: 'rgba(255,255,255,0.3)' }] } },
      { type: 'textbox', left: 80, top: 290, width: 800, text: 'Your weekly dose of design insights and industry news', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(255,255,255,0.6)' },
    ]),

  // ─── APP PROMO STORY — 1080×1920 ───────────────────────────────

  // 25. App Promo — gradient on CTA button, shadow+charSpacing on heading
  tpl('app-promo-taskflow', 'Download TaskFlow', 'App promo story with device frame and feature list',
    'Marketing', 'App Promo', ['app', 'promo', 'mobile', 'download', 'story'],
    1080, 1920, 'gradient', 'linear:to-bottom:#667eea:#764ba2', [
      { type: 'rect', left: 300, top: 280, width: 480, height: 850, fill: '#ffffff', rx: 32, ry: 32 },
      { type: 'rect', left: 320, top: 320, width: 440, height: 770, fill: '#f0f0f8', rx: 8, ry: 8 },
      { type: 'textbox', left: 360, top: 420, width: 360, text: 'TaskFlow', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#667eea', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 1220, width: 880, text: 'Organize your life.', fontFamily: 'Playfair Display', fontSize: 48, fill: '#ffffff', textAlign: 'center', charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 140, top: 1340, width: 800, text: '\u2713  Smart task prioritization\n\u2713  Calendar sync across devices\n\u2713  Team collaboration built in', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(255,255,255,0.8)', lineHeight: 2.0 },
      { type: 'rect', left: 300, top: 1640, width: 480, height: 72, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 480, y2: 0 }, colorStops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#e8e0f8' }] }, rx: 36, ry: 36 },
      { type: 'textbox', left: 300, top: 1656, width: 480, text: 'Download Free', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#667eea', textAlign: 'center' },
    ]),

  // ─── WEDDING INVITATION — 1500×2100 ────────────────────────────

  // 26. Wedding — gradient on divider line, shadow+charSpacing on heading
  tpl('wedding-emma-james', 'Emma & James', 'Elegant wedding invitation with floral accents and serif typography',
    'Events', 'Wedding', ['wedding', 'invitation', 'elegant', 'romantic'],
    1500, 2100, 'solid', '#faf8f5', [
      { type: 'rect', left: 60, top: 60, width: 1380, height: 1980, fill: 'rgba(0,0,0,0)', stroke: '#C4704A', strokeWidth: 1 },
      { type: 'circle', left: 80, top: 80, radius: 50, fill: '#C4704A', opacity: 0.06 },
      { type: 'circle', left: 1320, top: 80, radius: 40, fill: '#C4704A', opacity: 0.08 },
      { type: 'circle', left: 1300, top: 1900, radius: 55, fill: '#C4704A', opacity: 0.06 },
      { type: 'circle', left: 100, top: 1880, radius: 45, fill: '#C4704A', opacity: 0.07 },
      { type: 'textbox', left: 150, top: 400, width: 1200, text: 'Emma & James', fontFamily: 'Playfair Display', fontSize: 80, fill: '#2d2520', textAlign: 'center', charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 650, top: 520, width: 200, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 200, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4a574' }] } },
      { type: 'textbox', left: 150, top: 580, width: 1200, text: 'request the pleasure of your company\nat the celebration of their marriage', fontFamily: 'DM Sans', fontSize: 22, fill: '#888070', textAlign: 'center', lineHeight: 1.8 },
      { type: 'textbox', left: 150, top: 780, width: 1200, text: 'Saturday, the fourteenth of June\nTwo thousand twenty-six\nat half past four in the afternoon', fontFamily: 'Playfair Display', fontSize: 28, fill: '#2d2520', textAlign: 'center', lineHeight: 1.8 },
      { type: 'textbox', left: 150, top: 1040, width: 1200, text: 'The Willows Estate, Sonoma', fontFamily: 'DM Sans', fontSize: 20, fill: '#C4704A', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 150, top: 1200, width: 1200, text: 'Dinner & Dancing to Follow', fontFamily: 'DM Sans', fontSize: 18, fill: '#aaa090', textAlign: 'center' },
      { type: 'textbox', left: 150, top: 1700, width: 1200, text: 'RSVP by May 1, 2026', fontFamily: 'Montserrat', fontSize: 16, fill: '#aaa090', textAlign: 'center', charSpacing: 200 },
    ]),

  // ─── BIRTHDAY INVITE — 1080×1080 ───────────────────────────────

  // 27. Birthday — gradient on divider line, shadow+charSpacing on heading
  tpl('birthday-mia', 'Mia Turns 7!', 'Colorful birthday party invitation with confetti and playful typography',
    'Events', 'Birthday', ['birthday', 'party', 'kids', 'celebration', 'invitation'],
    1080, 1080, 'gradient', 'linear:to-bottom-right:#fbbf24:#f472b6', [
      { type: 'circle', left: 120, top: 80, radius: 18, fill: '#ffffff', opacity: 0.25 },
      { type: 'rect', left: 800, top: 120, width: 24, height: 24, fill: '#ffffff', opacity: 0.2, angle: 30 },
      { type: 'circle', left: 900, top: 300, radius: 12, fill: '#ffffff', opacity: 0.3 },
      { type: 'rect', left: 180, top: 750, width: 20, height: 20, fill: '#ffffff', opacity: 0.15, angle: 45 },
      { type: 'circle', left: 850, top: 800, radius: 15, fill: '#ffffff', opacity: 0.2 },
      { type: 'rect', left: 300, top: 200, width: 16, height: 16, fill: '#ffffff', opacity: 0.18, angle: 15 },
      { type: 'textbox', left: 100, top: 280, width: 880, text: 'MIA TURNS 7!', fontFamily: 'Montserrat', fontSize: 80, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 100, top: 420, width: 880, text: 'Join us for cake, games & fun!', fontFamily: 'DM Sans', fontSize: 30, fill: 'rgba(255,255,255,0.9)', textAlign: 'center' },
      { type: 'rect', left: 390, top: 510, width: 300, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 300, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(255,255,255,0.8)' }, { offset: 1, color: 'rgba(255,255,255,0.3)' }] } },
      { type: 'textbox', left: 100, top: 560, width: 880, text: 'Saturday, April 12  ·  2 – 5 PM', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 640, width: 880, text: 'The Johnson House\n42 Oak Lane, Maplewood', fontFamily: 'DM Sans', fontSize: 20, fill: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 1.6 },
      { type: 'textbox', left: 100, top: 820, width: 880, text: 'RSVP to Lisa  ·  (555) 234-5678', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(255,255,255,0.65)', textAlign: 'center' },
    ]),

  // ─── CONCERT POSTER — 2400×3600 ────────────────────────────────

  // 28. Concert — gradient on CTA button, shadow+charSpacing on heading
  tpl('concert-midnight', 'Midnight Echo Live', 'Dramatic concert poster with heavy typography and glow effect',
    'Events', 'Concert', ['concert', 'music', 'poster', 'live', 'event'],
    2400, 3600, 'solid', '#0a0a0a', [
      { type: 'rect', left: 0, top: 1400, width: 2400, height: 6, fill: '#C4704A', opacity: 0.6 },
      { type: 'rect', left: 0, top: 1390, width: 2400, height: 30, fill: '#C4704A', opacity: 0.08 },
      { type: 'textbox', left: 100, top: 810, width: 2200, text: 'MIDNIGHT', fontFamily: 'Montserrat', fontSize: 200, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 103, top: 813, width: 2200, text: 'MIDNIGHT', fontFamily: 'Montserrat', fontSize: 200, fontWeight: 'bold', fill: 'rgba(196,112,74,0.15)', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 1040, width: 2200, text: 'ECHO', fontFamily: 'Montserrat', fontSize: 200, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 1500, width: 2200, text: 'LIVE IN CONCERT', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 600 },
      { type: 'rect', left: 900, top: 1620, width: 600, height: 2, fill: 'rgba(255,255,255,0.15)' },
      { type: 'textbox', left: 100, top: 1700, width: 2200, text: 'October 18, 2026  ·  Paramount Theater', fontFamily: 'DM Sans', fontSize: 32, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 1800, width: 2200, text: 'Doors 7 PM  ·  Show 9 PM', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
      { type: 'rect', left: 850, top: 2000, width: 700, height: 80, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 700, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] }, rx: 40, ry: 40 },
      { type: 'textbox', left: 850, top: 2018, width: 700, text: 'Tickets from $45', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  // ─── CONFERENCE BADGE — 750×1050 ───────────────────────────────

  // 29. Conference Badge — gradient on header bar, shadow on heading (already has charSpacing)
  tpl('conf-badge', 'TechSummit 2026 Badge', 'Conference attendee badge with dark gradient header',
    'Events', 'Conference', ['conference', 'badge', 'tech', 'attendee'],
    750, 1050, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 750, height: 250, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 750, y2: 0 }, colorStops: [{ offset: 0, color: '#1a1a2e' }, { offset: 1, color: '#2d1810' }] } },
      { type: 'rect', left: 0, top: 230, width: 750, height: 40, fill: '#2d2d5e', opacity: 0.6 },
      { type: 'textbox', left: 50, top: 60, width: 650, text: 'TECHSUMMIT', fontFamily: 'Montserrat', fontSize: 44, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 300, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 50, top: 130, width: 650, text: '2026', fontFamily: 'Montserrat', fontSize: 36, fill: 'rgba(255,255,255,0.5)', textAlign: 'center', charSpacing: 500 },
      { type: 'textbox', left: 50, top: 350, width: 650, text: 'Alex Rivera', fontFamily: 'Playfair Display', fontSize: 48, fill: '#1a1a2e', textAlign: 'center' },
      { type: 'textbox', left: 50, top: 430, width: 650, text: 'Senior Engineer  ·  Stripe', fontFamily: 'DM Sans', fontSize: 22, fill: '#888888', textAlign: 'center' },
      { type: 'rect', left: 275, top: 520, width: 200, height: 2, fill: '#C4704A' },
      { type: 'rect', left: 250, top: 700, width: 250, height: 250, fill: '#f0f0f0', rx: 8, ry: 8 },
      { type: 'textbox', left: 250, top: 800, width: 250, text: 'QR CODE', fontFamily: 'DM Sans', fontSize: 14, fill: '#cccccc', textAlign: 'center' },
    ]),

  // ─── CHARITY GALA — 1500×2100 ──────────────────────────────────

  // 30. Gala — gradient on divider line, shadow+charSpacing on heading
  tpl('gala-evening', 'An Evening of Hope', 'Formal charity gala invitation with gold accents on black',
    'Events', 'Gala', ['gala', 'charity', 'formal', 'invitation', 'fundraiser'],
    1500, 2100, 'solid', '#0a0a0a', [
      { type: 'circle', left: 100, top: 200, radius: 80, fill: '#C4704A', opacity: 0.1 },
      { type: 'circle', left: 1200, top: 350, radius: 60, fill: '#C4704A', opacity: 0.08 },
      { type: 'circle', left: 1100, top: 1600, radius: 100, fill: '#C4704A', opacity: 0.06 },
      { type: 'circle', left: 200, top: 1700, radius: 50, fill: '#C4704A', opacity: 0.12 },
      { type: 'textbox', left: 150, top: 500, width: 1200, text: 'AN EVENING\nOF HOPE', fontFamily: 'Playfair Display', fontSize: 80, fill: '#C4704A', textAlign: 'center', lineHeight: 1.3, charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 600, top: 730, width: 300, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 300, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4a574' }] } },
      { type: 'textbox', left: 150, top: 790, width: 1200, text: 'Annual Charity Gala', fontFamily: 'DM Sans', fontSize: 28, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      { type: 'textbox', left: 150, top: 920, width: 1200, text: 'November 8, 2026  ·  7:00 PM', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 150, top: 1000, width: 1200, text: 'Grand Ballroom, The Langham', fontFamily: 'DM Sans', fontSize: 20, fill: 'rgba(255,255,255,0.5)', textAlign: 'center' },
      { type: 'rect', left: 600, top: 1100, width: 300, height: 1, fill: 'rgba(196,112,74,0.3)' },
      { type: 'textbox', left: 150, top: 1160, width: 1200, text: 'Black Tie  ·  RSVP by Oct 15', fontFamily: 'DM Sans', fontSize: 18, fill: 'rgba(255,255,255,0.4)', textAlign: 'center', charSpacing: 200 },
    ]),

  // ─── WORKSHOP — 2550×3300 ──────────────────────────────────────

  // 31. Workshop — gradient on header bar, shadow+charSpacing on heading
  tpl('workshop-watercolor', 'Intro to Watercolor', 'Workshop announcement flyer with session schedule',
    'Education', 'Workshop', ['workshop', 'art', 'watercolor', 'class', 'education'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 2550, height: 200, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 2550, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 200, top: 50, width: 2150, text: 'WORKSHOP SERIES', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: 'rgba(255,255,255,0.7)', textAlign: 'center', charSpacing: 400 },
      { type: 'textbox', left: 200, top: 110, width: 2150, text: 'Spring 2026', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.5)', textAlign: 'center' },
      { type: 'textbox', left: 200, top: 350, width: 2150, text: 'INTRO TO\nWATERCOLOR', fontFamily: 'Playfair Display', fontSize: 100, fill: '#1a1510', textAlign: 'center', lineHeight: 1.2, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 650, width: 2150, text: 'with artist Maya Lin', fontFamily: 'DM Sans', fontSize: 30, fill: '#888070', textAlign: 'center' },
      { type: 'rect', left: 1125, top: 750, width: 300, height: 2, fill: '#C4704A' },
      { type: 'circle', left: 400, top: 900, radius: 8, fill: '#C4704A' },
      { type: 'textbox', left: 440, top: 886, width: 1700, text: 'Session 1: Color Theory & Mixing  ·  March 4', fontFamily: 'DM Sans', fontSize: 28, fill: '#2d2520' },
      { type: 'circle', left: 400, top: 990, radius: 8, fill: '#C4704A' },
      { type: 'textbox', left: 440, top: 976, width: 1700, text: 'Session 2: Wet-on-Wet Techniques  ·  March 11', fontFamily: 'DM Sans', fontSize: 28, fill: '#2d2520' },
      { type: 'circle', left: 400, top: 1080, radius: 8, fill: '#C4704A' },
      { type: 'textbox', left: 440, top: 1066, width: 1700, text: 'Session 3: Landscape Composition  ·  March 18', fontFamily: 'DM Sans', fontSize: 28, fill: '#2d2520' },
      { type: 'rect', left: 200, top: 1180, width: 2150, height: 1, fill: '#e8dcc8' },
      { type: 'textbox', left: 200, top: 1230, width: 2150, text: 'Materials included  ·  $120 per session', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center' },
      { type: 'textbox', left: 200, top: 1310, width: 2150, text: 'Lincoln Arts Center  ·  Studio B  ·  6:00 – 8:30 PM', fontFamily: 'DM Sans', fontSize: 22, fill: '#aaa090', textAlign: 'center' },
    ]),

  // ─── BOOK COVER — 1600×2560 ────────────────────────────────────

  // 32. Book Cover — gradient on decorative line, shadow on heading (already has charSpacing)
  tpl('book-cover-quiet', 'The Quiet Architecture of Days', 'Minimalist literary book cover with dark gradient',
    'Creative', 'Book Cover', ['book', 'cover', 'novel', 'literary', 'minimal'],
    1600, 2560, 'gradient', 'linear:to-bottom:#1a1520:#2d1810', [
      { type: 'rect', left: 700, top: 650, width: 200, height: 1, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 200, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(196,112,74,0.1)' }, { offset: 1, color: 'rgba(196,112,74,0.6)' }] } },
      { type: 'textbox', left: 150, top: 720, width: 1300, text: 'THE QUIET\nARCHITECTURE\nOF DAYS', fontFamily: 'Playfair Display', fontSize: 88, fill: '#ffffff', textAlign: 'center', lineHeight: 1.4, charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 700, top: 1150, width: 200, height: 1, fill: 'rgba(196,112,74,0.4)' },
      { type: 'textbox', left: 150, top: 1200, width: 1300, text: 'A NOVEL', fontFamily: 'Montserrat', fontSize: 20, fill: 'rgba(255,255,255,0.4)', textAlign: 'center', charSpacing: 600 },
      { type: 'textbox', left: 150, top: 2100, width: 1300, text: 'ELENA PARK', fontFamily: 'Montserrat', fontSize: 30, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 400 },
      { type: 'circle', left: 760, top: 400, radius: 60, fill: '#C4704A', opacity: 0.08 },
      { type: 'circle', left: 720, top: 1800, radius: 40, fill: '#C4704A', opacity: 0.06 },
    ]),

  // ─── FLASHCARD — 1050×750 ──────────────────────────────────────

  // 33. Flashcard — gradient on divider line, shadow+charSpacing on term heading
  tpl('flashcard-photo', 'Photosynthesis', 'Study flashcard with two-zone layout for term and definition',
    'Education', 'Flashcard', ['flashcard', 'study', 'biology', 'education', 'science'],
    1050, 750, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 420, height: 750, fill: '#e8f5e9' },
      { type: 'rect', left: 420, top: 80, width: 3, height: 590, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 590 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: 'rgba(196,112,74,0.1)' }] } },
      { type: 'textbox', left: 40, top: 280, width: 340, text: 'PHOTO\u00ADSYNTHESIS', fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold', fill: '#1a1510', textAlign: 'center', lineHeight: 1.3, charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'circle', left: 180, top: 440, radius: 20, fill: '#C4704A', opacity: 0.15 },
      { type: 'textbox', left: 480, top: 200, width: 520, text: 'The process by which green plants convert sunlight, water, and carbon dioxide into glucose and oxygen.', fontFamily: 'DM Sans', fontSize: 22, fill: '#2d2520', lineHeight: 1.7 },
      { type: 'textbox', left: 480, top: 480, width: 520, text: '6CO\u2082 + 6H\u2082O \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082', fontFamily: 'Georgia', fontSize: 18, fill: '#C4704A' },
      { type: 'textbox', left: 480, top: 620, width: 520, text: 'Biology  ·  Chapter 8', fontFamily: 'DM Sans', fontSize: 14, fill: '#aaa090' },
    ]),

  // ─── RESUME — 2550×3300 ────────────────────────────────────────

  // 34. Resume — gradient on sidebar, shadow+charSpacing on name heading
  tpl('resume-alex', 'Alex Rivera, UX Designer', 'Professional two-column resume with dark sidebar and skill bars',
    'Business', 'Resume', ['resume', 'cv', 'professional', 'career', 'job'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 700, height: 3300, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 3300 }, colorStops: [{ offset: 0, color: '#1a1a2e' }, { offset: 1, color: '#2d1810' }] } },
      { type: 'textbox', left: 60, top: 150, width: 580, text: 'ALEX\nRIVERA', fontFamily: 'Montserrat', fontSize: 52, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.2, charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 60, top: 330, width: 580, text: 'UX Designer', fontFamily: 'DM Sans', fontSize: 22, fill: '#C4704A' },
      { type: 'rect', left: 60, top: 400, width: 100, height: 2, fill: 'rgba(196,112,74,0.5)' },
      { type: 'textbox', left: 60, top: 460, width: 580, text: 'alex@rivera.design\n+1 (415) 555-7890\nSan Francisco, CA\nrivera.design', fontFamily: 'DM Sans', fontSize: 17, fill: 'rgba(255,255,255,0.6)', lineHeight: 2.0 },
      { type: 'textbox', left: 60, top: 720, width: 580, text: 'SKILLS', fontFamily: 'Montserrat', fontSize: 16, fontWeight: 'bold', fill: '#C4704A', charSpacing: 300 },
      { type: 'textbox', left: 60, top: 780, width: 300, text: 'User Research', fontFamily: 'DM Sans', fontSize: 15, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 60, top: 810, width: 580, height: 4, fill: 'rgba(255,255,255,0.1)', rx: 2, ry: 2 },
      { type: 'rect', left: 60, top: 810, width: 520, height: 4, fill: '#C4704A', rx: 2, ry: 2 },
      { type: 'textbox', left: 60, top: 840, width: 300, text: 'Prototyping', fontFamily: 'DM Sans', fontSize: 15, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 60, top: 870, width: 580, height: 4, fill: 'rgba(255,255,255,0.1)', rx: 2, ry: 2 },
      { type: 'rect', left: 60, top: 870, width: 490, height: 4, fill: '#C4704A', rx: 2, ry: 2 },
      { type: 'textbox', left: 60, top: 900, width: 300, text: 'Design Systems', fontFamily: 'DM Sans', fontSize: 15, fill: 'rgba(255,255,255,0.7)' },
      { type: 'rect', left: 60, top: 930, width: 580, height: 4, fill: 'rgba(255,255,255,0.1)', rx: 2, ry: 2 },
      { type: 'rect', left: 60, top: 930, width: 550, height: 4, fill: '#C4704A', rx: 2, ry: 2 },
      { type: 'textbox', left: 800, top: 150, width: 1600, text: 'EXPERIENCE', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#1a1510', charSpacing: 300 },
      { type: 'rect', left: 800, top: 190, width: 80, height: 3, fill: '#C4704A' },
      { type: 'textbox', left: 800, top: 230, width: 1600, text: 'Lead Designer', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#1a1510' },
      { type: 'textbox', left: 800, top: 270, width: 1600, text: 'Spotify  ·  2023 – Present', fontFamily: 'DM Sans', fontSize: 17, fill: '#C4704A' },
      { type: 'textbox', left: 800, top: 310, width: 1600, text: 'Led redesign of the mobile listening experience, increasing user engagement by 24%. Managed a team of 5 designers across 3 product areas.', fontFamily: 'DM Sans', fontSize: 17, fill: '#555555', lineHeight: 1.7 },
      { type: 'textbox', left: 800, top: 450, width: 1600, text: 'Senior UX Designer', fontFamily: 'Montserrat', fontSize: 24, fontWeight: 'bold', fill: '#1a1510' },
      { type: 'textbox', left: 800, top: 490, width: 1600, text: 'Airbnb  ·  2020 – 2023', fontFamily: 'DM Sans', fontSize: 17, fill: '#C4704A' },
      { type: 'textbox', left: 800, top: 530, width: 1600, text: 'Designed the host onboarding flow that reduced setup time by 40%. Conducted 120+ user interviews to inform product direction.', fontFamily: 'DM Sans', fontSize: 17, fill: '#555555', lineHeight: 1.7 },
      { type: 'textbox', left: 800, top: 700, width: 1600, text: 'EDUCATION', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#1a1510', charSpacing: 300 },
      { type: 'rect', left: 800, top: 740, width: 80, height: 3, fill: '#C4704A' },
      { type: 'textbox', left: 800, top: 780, width: 1600, text: 'MFA, Interaction Design', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#1a1510' },
      { type: 'textbox', left: 800, top: 815, width: 1600, text: 'School of Visual Arts, New York  ·  2018 – 2020', fontFamily: 'DM Sans', fontSize: 17, fill: '#888070' },
    ]),

  // ─── BATCH 3: Education + Creative + Food & Lifestyle + Seasonal (35-50) ──


  // ─── EDUCATION ──────────────────────────────────────────────────────

  // 35. Study Guide — gradient on accent bar, shadow+charSpacing on heading
  tpl('study-guide-bio', 'Biology Chapter 12', 'Study guide',
    'Education', 'Study Guide', ['biology', 'study', 'science', 'school'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'textbox', left: 150, top: 120, width: 2250, text: 'BIOLOGY \u00b7 CHAPTER 12', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#6b7280', textAlign: 'left', charSpacing: 300 },
      { type: 'rect', left: 150, top: 175, width: 300, height: 5, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 300, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 150, top: 220, width: 2250, text: 'Cell Division & Mitosis', fontFamily: 'Playfair Display', fontSize: 72, fontWeight: 'bold', fill: '#1a1a1a', charSpacing: 50, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 150, top: 380, width: 2250, height: 4, fill: '#e5e7eb' },
      { type: 'rect', left: 150, top: 440, width: 8, height: 680, fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 440, width: 2160, text: 'KEY TERMS', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 490, width: 2160, text: 'Mitosis \u2014 the process by which a cell divides its nucleus into two identical daughter nuclei\nInterphase \u2014 the resting phase between successive mitotic divisions\nChromatin \u2014 the material of which chromosomes are composed\nCytokinesis \u2014 the cytoplasmic division of a cell at the end of mitosis\nCentromere \u2014 the point on a chromosome where the spindle fiber is attached', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 150, top: 1160, width: 8, height: 680, fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 1160, width: 2160, text: 'PROCESS STEPS', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 1210, width: 2160, text: '1. Prophase \u2014 Chromatin condenses into visible chromosomes\n2. Prometaphase \u2014 Nuclear envelope breaks down\n3. Metaphase \u2014 Chromosomes align at the cell equator\n4. Anaphase \u2014 Sister chromatids separate and move to poles\n5. Telophase \u2014 Nuclear envelopes reform around each set', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 150, top: 1880, width: 8, height: 500, fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 1880, width: 2160, text: 'REVIEW QUESTIONS', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 190, top: 1930, width: 2160, text: '1. What is the difference between mitosis and meiosis?\n2. Why is interphase the longest phase of the cell cycle?\n3. Describe the role of the spindle fibers during cell division.\n4. How does cytokinesis differ in plant and animal cells?', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 150, top: 2600, width: 2250, height: 60, fill: '#C4704A', opacity: 0.08 },
      { type: 'textbox', left: 190, top: 2612, width: 2160, text: 'AP Biology \u00b7 Mrs. Khatri \u00b7 Period 3', fontFamily: 'DM Sans', fontSize: 20, fill: '#9ca3af' },
    ]),

  // ─── CREATIVE ───────────────────────────────────────────────────────

  // 36. Album Cover — gradient on divider line, shadow on heading (already has charSpacing+stroke)
  tpl('album-velvet', 'Velvet Horizon', 'Album cover art',
    'Creative', 'Album Cover', ['album', 'music', 'cover art', 'modern'],
    3000, 3000, 'gradient', 'linear:to-bottom-right:#4a1942:#C4704A', [
      { type: 'circle', left: 900, top: 800, radius: 600, fill: 'rgba(255,255,255,0.15)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 1050, top: 950, radius: 400, fill: 'rgba(255,255,255,0.08)', stroke: '', strokeWidth: 0 },
      { type: 'textbox', left: 200, top: 1100, width: 2600, text: 'VELVET HORIZON', fontFamily: 'Montserrat', fontSize: 180, fontWeight: 'bold', fill: 'rgba(0,0,0,0)', stroke: '#ffffff', strokeWidth: 3, textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 1400, width: 2600, text: 'AURORA SAINTS', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: 'rgba(255,255,255,0.85)', textAlign: 'center', charSpacing: 500 },
      { type: 'rect', left: 1200, top: 1520, width: 600, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 600, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(255,255,255,0.1)' }, { offset: 1, color: 'rgba(255,255,255,0.6)' }] } },
    ]),

  // 37. Movie Poster — gradient on accent line, shadow+charSpacing on heading
  tpl('movie-poster-signal', 'The Last Signal', 'Cinematic movie poster',
    'Creative', 'Movie Poster', ['movie', 'poster', 'film', 'cinematic'],
    2400, 3600, 'solid', '#0a0505', [
      { type: 'rect', left: 0, top: 0, width: 2400, height: 3600, fill: 'rgba(196,112,74,0.04)' },
      { type: 'textbox', left: 200, top: 900, width: 2000, text: 'THE LAST\nSIGNAL', fontFamily: 'Playfair Display', fontSize: 220, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 1.05, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 300, top: 1450, width: 1800, text: 'In a world gone silent, one signal remains.', fontFamily: 'Georgia', fontSize: 42, fontStyle: 'italic', fill: 'rgba(255,255,255,0.65)', textAlign: 'center' },
      { type: 'rect', left: 300, top: 2800, width: 1800, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1800, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#8b3e2a' }] } },
      { type: 'textbox', left: 300, top: 2840, width: 1800, text: 'STARRING  DANIEL KIM  \u00b7  SOPHIA REYES  \u00b7  MARCO BIANCHI', fontFamily: 'Inter', fontSize: 24, fill: 'rgba(255,255,255,0.5)', textAlign: 'center', charSpacing: 150 },
      { type: 'textbox', left: 300, top: 2920, width: 1800, text: 'DIRECTED BY ELENA VASQUEZ  \u00b7  SCREENPLAY BY JAMES OKAFOR  \u00b7  MUSIC BY YUKI TANAKA', fontFamily: 'Inter', fontSize: 14, fill: 'rgba(255,255,255,0.3)', textAlign: 'center', charSpacing: 100 },
      { type: 'textbox', left: 300, top: 3000, width: 1800, text: 'COMING FALL 2026', fontFamily: 'Montserrat', fontSize: 28, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 400 },
    ]),

  // 38. Magazine Cover — gradient on barcode rect, shadow+charSpacing on heading
  tpl('magazine-form', 'FORM Issue 23', 'Magazine cover',
    'Creative', 'Magazine Cover', ['magazine', 'cover', 'editorial', 'design'],
    2550, 3300, 'solid', '#f0ece4', [
      { type: 'textbox', left: 150, top: 100, width: 2250, text: 'FORM', fontFamily: 'Playfair Display', fontSize: 200, fontWeight: 'bold', fill: '#1a1a1a', textAlign: 'center', charSpacing: 300, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 150, top: 330, width: 2250, text: 'ISSUE 23 \u00b7 SPRING 2026', fontFamily: 'Inter', fontSize: 22, fill: '#888880', textAlign: 'center', charSpacing: 400 },
      { type: 'rect', left: 300, top: 480, width: 1950, height: 1600, fill: '#d5d0c8', rx: 4, ry: 4 },
      { type: 'textbox', left: 300, top: 1140, width: 1950, text: 'PHOTO', fontFamily: 'Inter', fontSize: 60, fill: 'rgba(0,0,0,0.08)', textAlign: 'center' },
      { type: 'textbox', left: 150, top: 2200, width: 2250, text: 'The Future of\nSustainable Design', fontFamily: 'Playfair Display', fontSize: 72, fill: '#1a1a1a', lineHeight: 1.2 },
      { type: 'textbox', left: 150, top: 2440, width: 2250, text: 'Interview: Neri Oxman on Material Ecology', fontFamily: 'DM Sans', fontSize: 30, fill: '#C4704A' },
      { type: 'textbox', left: 150, top: 2520, width: 1500, text: 'Plus: 40 Studios Redefining Craft \u00b7 The Rise of Bio-Materials \u00b7 Tokyo Design Week Report', fontFamily: 'DM Sans', fontSize: 22, fill: '#6b6b60', lineHeight: 1.6 },
      { type: 'rect', left: 2050, top: 2900, width: 200, height: 260, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 260 }, colorStops: [{ offset: 0, color: '#1a1a1a' }, { offset: 1, color: '#2d1810' }] } },
      { type: 'textbox', left: 2060, top: 3070, width: 180, text: 'BARCODE', fontFamily: 'Inter', fontSize: 10, fill: '#ffffff', textAlign: 'center' },
    ]),

  // 39. Exhibition — gradient on accent bar, shadow+charSpacing on heading (already has charSpacing)
  tpl('art-exhibition', 'Fragments', 'Gallery exhibition poster',
    'Creative', 'Exhibition', ['art', 'gallery', 'exhibition', 'poster', 'minimal'],
    2400, 3600, 'solid', '#faf8f5', [
      { type: 'textbox', left: 200, top: 800, width: 2000, text: 'FRAGMENTS', fontFamily: 'Playfair Display', fontSize: 140, fill: '#1a1a1a', textAlign: 'left', charSpacing: 600, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 1000, width: 2000, text: 'Works by Yuki Tanaka', fontFamily: 'Georgia', fontSize: 36, fontStyle: 'italic', fill: '#6b6b60' },
      { type: 'rect', left: 1600, top: 400, width: 40, height: 2400, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 2400 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: 'rgba(196,112,74,0.2)' }] }, opacity: 0.7 },
      { type: 'textbox', left: 200, top: 2600, width: 1200, text: 'March 1 \u2013 April 30, 2026', fontFamily: 'DM Sans', fontSize: 30, fill: '#1a1a1a' },
      { type: 'textbox', left: 200, top: 2660, width: 1200, text: 'Opening Reception: March 1, 6\u20139 PM', fontFamily: 'DM Sans', fontSize: 24, fill: '#888880' },
      { type: 'rect', left: 200, top: 2740, width: 200, height: 2, fill: '#1a1a1a' },
      { type: 'textbox', left: 200, top: 2780, width: 1200, text: 'Whitespace Gallery \u00b7 Portland', fontFamily: 'Inter', fontSize: 26, fontWeight: 'bold', fill: '#1a1a1a' },
    ]),

  // 40. Photography Portfolio — gradient on accent line, shadow+charSpacing on name
  tpl('photo-portfolio', 'Kai Nomura', 'Photography portfolio',
    'Creative', 'Portfolio', ['photography', 'portfolio', 'minimal', 'grid'],
    3300, 2550, 'solid', '#ffffff', [
      { type: 'rect', left: 150, top: 200, width: 920, height: 700, fill: '#e8e5e0' },
      { type: 'rect', left: 1120, top: 200, width: 920, height: 700, fill: '#d5d0c8' },
      { type: 'rect', left: 2090, top: 200, width: 920, height: 700, fill: '#c8c2ba' },
      { type: 'rect', left: 150, top: 960, width: 920, height: 700, fill: '#c8c2ba' },
      { type: 'rect', left: 1120, top: 960, width: 920, height: 700, fill: '#e8e5e0' },
      { type: 'rect', left: 2090, top: 960, width: 920, height: 700, fill: '#d5d0c8' },
      { type: 'textbox', left: 150, top: 1840, width: 1400, text: 'KAI NOMURA', fontFamily: 'Playfair Display', fontSize: 48, fill: '#1a1a1a', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 150, top: 1910, width: 100, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 100, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 150, top: 1940, width: 1400, text: 'Documentary \u00b7 Portrait \u00b7 Landscape', fontFamily: 'DM Sans', fontSize: 22, fill: '#888880' },
      { type: 'textbox', left: 2400, top: 1940, width: 610, text: 'kainomura.com', fontFamily: 'DM Sans', fontSize: 22, fill: '#C4704A', textAlign: 'right' },
    ]),

  // ─── EVENTS ─────────────────────────────────────────────────────────

  // 41. Music Festival — gradient on lineup bg area, shadow+charSpacing on heading
  tpl('music-festival', 'Solstice Festival 2026', 'Music festival poster',
    'Events', 'Music Festival', ['music', 'festival', 'concert', 'lineup'],
    2400, 3600, 'gradient', 'linear:to-bottom:#ff6b35:#C4704A', [
      { type: 'circle', left: 1600, top: -200, radius: 500, fill: 'rgba(255,255,255,0.1)', stroke: '', strokeWidth: 0 },
      { type: 'textbox', left: 200, top: 300, width: 2000, text: 'SOLSTICE', fontFamily: 'Montserrat', fontSize: 220, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 200, top: 560, width: 2000, text: 'MUSIC FESTIVAL 2026', fontFamily: 'Inter', fontSize: 36, fill: 'rgba(255,255,255,0.8)', textAlign: 'center', charSpacing: 500 },
      { type: 'rect', left: 800, top: 670, width: 800, height: 3, fill: 'rgba(255,255,255,0.4)' },
      { type: 'rect', left: 300, top: 780, width: 1800, height: 1600, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 1600 }, colorStops: [{ offset: 0, color: 'rgba(0,0,0,0.3)' }, { offset: 1, color: 'rgba(0,0,0,0.15)' }] }, rx: 16, ry: 16 },
      { type: 'textbox', left: 400, top: 860, width: 1600, text: 'FRI  \u00b7  The Midnight  \u00b7  Glass Animals  \u00b7  Raveena', fontFamily: 'DM Sans', fontSize: 36, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 400, top: 1060, width: 1600, text: 'SAT  \u00b7  Khruangbin  \u00b7  Tame Impala  \u00b7  Wet Leg', fontFamily: 'DM Sans', fontSize: 36, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 400, top: 1260, width: 1600, text: 'SUN  \u00b7  Bonobo  \u00b7  Tycho  \u00b7  Floating Points', fontFamily: 'DM Sans', fontSize: 36, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 600, top: 1500, width: 1200, height: 2, fill: 'rgba(255,255,255,0.3)' },
      { type: 'textbox', left: 400, top: 1560, width: 1600, text: 'PLUS 30+ MORE ARTISTS', fontFamily: 'Inter', fontSize: 24, fill: 'rgba(255,255,255,0.6)', textAlign: 'center', charSpacing: 300 },
      { type: 'textbox', left: 200, top: 2600, width: 2000, text: 'JUNE 20\u201322  \u00b7  RED ROCKS AMPHITHEATRE', fontFamily: 'Montserrat', fontSize: 32, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 200, top: 2700, width: 2000, text: 'solsticefest.com', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
    ]),

  // ─── FOOD & LIFESTYLE ──────────────────────────────────────────────

  // 42. Cafe Menu — gradient on accent line, shadow+charSpacing on heading
  tpl('cafe-menu', 'Morning Ritual Caf\u00e9', 'Caf\u00e9 menu',
    'Food & Lifestyle', 'Caf\u00e9 Menu', ['cafe', 'coffee', 'menu', 'food'],
    2550, 3300, 'solid', '#2d1810', [
      { type: 'circle', left: 1050, top: 200, radius: 120, fill: '#C4704A', opacity: 0.15 },
      { type: 'rect', left: 1000, top: 300, width: 100, height: 60, fill: '#C4704A', opacity: 0.15 },
      { type: 'textbox', left: 200, top: 180, width: 700, text: 'MORNING\nRITUAL', fontFamily: 'Playfair Display', fontSize: 120, fill: '#f5f0e8', lineHeight: 1.05, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 200, top: 460, width: 150, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 150, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4a574' }] } },
      { type: 'textbox', left: 200, top: 560, width: 950, text: 'COFFEE', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 200, top: 620, width: 700, text: 'Espresso\nCortado\nOat Latte\nPour Over\nCold Brew', fontFamily: 'DM Sans', fontSize: 28, fill: '#f5f0e8', lineHeight: 2.2 },
      { type: 'textbox', left: 900, top: 620, width: 250, text: '$4\n$5\n$6\n$5.50\n$5', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right', lineHeight: 2.2 },
      { type: 'rect', left: 200, top: 1020, width: 950, height: 1, fill: 'rgba(245,240,232,0.15)' },
      { type: 'textbox', left: 200, top: 1080, width: 950, text: 'PASTRIES', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 200, top: 1140, width: 700, text: 'Almond Croissant\nSourdough Toast & Jam\nBanana Walnut Loaf\nCardamom Bun', fontFamily: 'DM Sans', fontSize: 28, fill: '#f5f0e8', lineHeight: 2.2 },
      { type: 'textbox', left: 900, top: 1140, width: 250, text: '$5.50\n$4\n$5\n$4.50', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right', lineHeight: 2.2 },
      { type: 'rect', left: 1400, top: 560, width: 950, height: 1600, fill: 'rgba(245,240,232,0.04)', rx: 8, ry: 8 },
      { type: 'textbox', left: 1450, top: 560, width: 850, text: 'BRUNCH', fontFamily: 'Montserrat', fontSize: 22, fontWeight: 'bold', fill: '#C4704A', charSpacing: 400 },
      { type: 'textbox', left: 1450, top: 620, width: 600, text: 'Avocado Toast\nShakshuka\nGranola Bowl\nEggs Benedict\nFrench Toast', fontFamily: 'DM Sans', fontSize: 28, fill: '#f5f0e8', lineHeight: 2.2 },
      { type: 'textbox', left: 2100, top: 620, width: 200, text: '$14\n$16\n$13\n$17\n$15', fontFamily: 'DM Sans', fontSize: 28, fill: '#C4704A', textAlign: 'right', lineHeight: 2.2 },
      { type: 'textbox', left: 200, top: 2900, width: 2150, text: 'Open daily 7 AM \u2013 3 PM \u00b7 2847 NE Alberta St \u00b7 Portland, OR', fontFamily: 'DM Sans', fontSize: 20, fill: 'rgba(245,240,232,0.4)', textAlign: 'center' },
    ]),

  // 43. Recipe Card — gradient on accent line, shadow+charSpacing on heading
  tpl('recipe-lemon', 'Lemon Herb Chicken', 'Recipe card',
    'Food & Lifestyle', 'Recipe Card', ['recipe', 'cooking', 'food', 'chicken'],
    1500, 2100, 'solid', '#faf8f5', [
      { type: 'rect', left: 0, top: 0, width: 1500, height: 550, fill: '#e8e2d8' },
      { type: 'textbox', left: 0, top: 240, width: 1500, text: 'PHOTO', fontFamily: 'Inter', fontSize: 36, fill: 'rgba(0,0,0,0.06)', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 600, width: 1300, text: 'LEMON HERB CHICKEN', fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 'bold', fill: '#2d2215', charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 100, top: 670, width: 100, height: 3, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 100, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 100, top: 700, width: 1300, text: 'Serves 4  \u00b7  45 minutes  \u00b7  Easy', fontFamily: 'DM Sans', fontSize: 20, fill: '#C4704A' },
      { type: 'textbox', left: 100, top: 790, width: 580, text: 'INGREDIENTS', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#2d2215', charSpacing: 300 },
      { type: 'textbox', left: 100, top: 830, width: 580, text: '4 bone-in chicken thighs\n3 tbsp olive oil\n2 lemons, juiced and zested\n4 cloves garlic, minced\n2 tbsp fresh rosemary\n1 tbsp fresh thyme\nSalt and black pepper', fontFamily: 'DM Sans', fontSize: 18, fill: '#5c4a32', lineHeight: 1.9 },
      { type: 'rect', left: 730, top: 790, width: 1, height: 700, fill: '#e5e0d8' },
      { type: 'textbox', left: 780, top: 790, width: 620, text: 'DIRECTIONS', fontFamily: 'Montserrat', fontSize: 18, fontWeight: 'bold', fill: '#2d2215', charSpacing: 300 },
      { type: 'textbox', left: 780, top: 830, width: 620, text: '1. Preheat oven to 400\u00b0F.\n\n2. Mix olive oil, lemon juice, zest, garlic, rosemary, and thyme.\n\n3. Season chicken generously with salt and pepper. Coat with herb mixture.\n\n4. Roast for 35 minutes until internal temp reaches 165\u00b0F.\n\n5. Rest 5 minutes before serving with pan juices.', fontFamily: 'DM Sans', fontSize: 17, fill: '#5c4a32', lineHeight: 1.6 },
      { type: 'rect', left: 100, top: 1950, width: 1300, height: 50, fill: '#C4704A', opacity: 0.08 },
      { type: 'textbox', left: 120, top: 1960, width: 1260, text: 'Pairs well with roasted vegetables or a simple green salad.', fontFamily: 'Georgia', fontSize: 16, fontStyle: 'italic', fill: '#888880' },
    ]),

  // 44. Cocktail Card — gradient on top bar, shadow+charSpacing on heading
  tpl('cocktail-paloma', 'The Smoky Paloma', 'Cocktail card',
    'Food & Lifestyle', 'Cocktail Card', ['cocktail', 'drink', 'recipe', 'mezcal'],
    1080, 1080, 'solid', '#1a1510', [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 8, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4a574' }] } },
      { type: 'rect', left: 0, top: 8, width: 1080, height: 50, fill: '#C4704A', opacity: 0.15 },
      { type: 'textbox', left: 100, top: 140, width: 880, text: 'THE SMOKY\nPALOMA', fontFamily: 'Playfair Display', fontSize: 80, fill: '#f5f0e8', lineHeight: 1.1, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 100, top: 350, width: 120, height: 3, fill: '#C4704A' },
      { type: 'textbox', left: 100, top: 400, width: 880, text: '2 oz mezcal\n3 oz fresh grapefruit juice\n1 oz fresh lime juice\n\u00bd oz agave syrup\nClub soda\nTaj\u00edn rim', fontFamily: 'DM Sans', fontSize: 26, fill: 'rgba(245,240,232,0.75)', lineHeight: 2.0 },
      { type: 'rect', left: 680, top: 700, width: 200, height: 280, fill: 'rgba(196,112,74,0.12)' },
      { type: 'triangle', left: 630, top: 580, width: 300, height: 200, fill: 'rgba(196,112,74,0.08)' },
      { type: 'textbox', left: 100, top: 900, width: 880, text: 'Rim a rocks glass with lime and Taj\u00edn. Build over ice.\nTop with soda. Garnish with a grapefruit wheel.', fontFamily: 'Georgia', fontSize: 18, fontStyle: 'italic', fill: 'rgba(245,240,232,0.45)', lineHeight: 1.7 },
    ]),

  // 45. Fitness Plan — gradient on accent bar, shadow+charSpacing on heading
  tpl('fitness-plan', '4-Week Strength Program', 'Fitness plan',
    'Food & Lifestyle', 'Fitness Plan', ['fitness', 'workout', 'gym', 'strength'],
    2550, 3300, 'solid', '#ffffff', [
      { type: 'textbox', left: 150, top: 140, width: 2250, text: '4-WEEK STRENGTH', fontFamily: 'Montserrat', fontSize: 64, fontWeight: 'bold', fill: '#1a1a1a', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 150, top: 225, width: 400, height: 5, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: '#C4704A' }, { offset: 1, color: '#e8956d' }] } },
      { type: 'textbox', left: 150, top: 260, width: 2250, text: 'Progressive overload program \u00b7 3 days/week \u00b7 45\u201360 min sessions', fontFamily: 'DM Sans', fontSize: 24, fill: '#6b7280' },
      { type: 'rect', left: 150, top: 380, width: 2250, height: 520, fill: '#C4704A', opacity: 0.06, rx: 8, ry: 8 },
      { type: 'textbox', left: 200, top: 400, width: 400, text: 'WEEK 1', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 450, width: 2100, text: 'Day A: Squats 3\u00d710 \u00b7 Bench Press 3\u00d710 \u00b7 Barbell Row 3\u00d710\nDay B: Deadlift 3\u00d78 \u00b7 Overhead Press 3\u00d710 \u00b7 Pull-ups 3\u00d7max\nDay C: Front Squat 3\u00d78 \u00b7 Incline Bench 3\u00d710 \u00b7 Cable Row 3\u00d712', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 150, top: 940, width: 2250, height: 520, fill: 'rgba(0,0,0,0.02)', rx: 8, ry: 8 },
      { type: 'textbox', left: 200, top: 960, width: 400, text: 'WEEK 2', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 1010, width: 2100, text: 'Day A: Squats 4\u00d78 \u00b7 Bench Press 4\u00d78 \u00b7 Barbell Row 4\u00d78\nDay B: Deadlift 4\u00d76 \u00b7 Overhead Press 4\u00d78 \u00b7 Pull-ups 4\u00d7max\nDay C: Front Squat 4\u00d76 \u00b7 Incline Bench 4\u00d78 \u00b7 Cable Row 4\u00d710', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 150, top: 1500, width: 2250, height: 520, fill: '#C4704A', opacity: 0.06, rx: 8, ry: 8 },
      { type: 'textbox', left: 200, top: 1520, width: 400, text: 'WEEK 3', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 1570, width: 2100, text: 'Day A: Squats 4\u00d76 \u00b7 Bench Press 4\u00d76 \u00b7 Barbell Row 4\u00d76\nDay B: Deadlift 5\u00d75 \u00b7 Overhead Press 4\u00d76 \u00b7 Weighted Pull-ups 4\u00d76\nDay C: Front Squat 4\u00d75 \u00b7 Incline Bench 4\u00d76 \u00b7 Cable Row 4\u00d78', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 150, top: 2060, width: 2250, height: 520, fill: 'rgba(0,0,0,0.02)', rx: 8, ry: 8 },
      { type: 'textbox', left: 200, top: 2080, width: 400, text: 'WEEK 4', fontFamily: 'Montserrat', fontSize: 26, fontWeight: 'bold', fill: '#C4704A' },
      { type: 'textbox', left: 200, top: 2130, width: 2100, text: 'Day A: Squats 5\u00d75 \u00b7 Bench Press 5\u00d75 \u00b7 Barbell Row 5\u00d75\nDay B: Deadlift 5\u00d73 \u00b7 Overhead Press 5\u00d75 \u00b7 Weighted Pull-ups 5\u00d75\nDay C: Front Squat 5\u00d73 \u00b7 Incline Bench 5\u00d75 \u00b7 Cable Row 5\u00d76', fontFamily: 'DM Sans', fontSize: 22, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 150, top: 2700, width: 2250, height: 4, fill: '#e5e7eb' },
      { type: 'textbox', left: 150, top: 2740, width: 2250, text: 'Rest 90\u2013120 seconds between sets. Increase weight by 5 lbs each week. Log every session.', fontFamily: 'Georgia', fontSize: 20, fontStyle: 'italic', fill: '#9ca3af' },
    ]),

  // 46. Wellness Quote — gradient on divider line, shadow+charSpacing on heading
  tpl('wellness-quote', 'Breathe In Calm', 'Wellness quote',
    'Food & Lifestyle', 'Wellness', ['wellness', 'mindfulness', 'quote', 'calm'],
    1080, 1080, 'gradient', 'linear:to-bottom:#f5f0eb:#d4e7d4', [
      { type: 'circle', left: -100, top: -100, radius: 300, fill: 'rgba(196,112,74,0.08)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 750, top: 700, radius: 400, fill: 'rgba(150,190,150,0.1)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 500, top: 200, radius: 180, fill: 'rgba(196,112,74,0.06)', stroke: '', strokeWidth: 0 },
      { type: 'textbox', left: 120, top: 340, width: 840, text: 'breathe in calm,\nbreathe out tension.', fontFamily: 'Playfair Display', fontSize: 56, fontStyle: 'italic', fill: '#3d3d35', textAlign: 'center', lineHeight: 1.6, charSpacing: 50, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 440, top: 640, width: 200, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 200, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(196,112,74,0.2)' }, { offset: 1, color: 'rgba(196,112,74,0.6)' }] } },
      { type: 'textbox', left: 120, top: 680, width: 840, text: '\u2014 daily reminder', fontFamily: 'DM Sans', fontSize: 22, fill: '#888880', textAlign: 'center' },
    ]),

  // ─── SEASONAL ───────────────────────────────────────────────────────

  // 47. Valentine — gradient on divider line, shadow+charSpacing on heading
  tpl('valentines-heart', 'You Have My Heart', 'Valentine card',
    'Seasonal', 'Valentine', ['valentine', 'love', 'heart', 'romantic'],
    1080, 1080, 'gradient', 'linear:to-bottom:#fecdd3:#fda4af', [
      { type: 'circle', left: 300, top: 200, radius: 120, fill: 'rgba(225,29,72,0.15)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 500, top: 180, radius: 120, fill: 'rgba(225,29,72,0.15)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 200, top: 600, radius: 80, fill: 'rgba(225,29,72,0.25)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 780, top: 500, radius: 100, fill: 'rgba(225,29,72,0.12)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 650, top: 150, radius: 60, fill: 'rgba(225,29,72,0.35)', stroke: '', strokeWidth: 0 },
      { type: 'textbox', left: 100, top: 420, width: 880, text: 'YOU HAVE\nMY HEART', fontFamily: 'Playfair Display', fontSize: 80, fontWeight: 'bold', fill: '#9f1239', textAlign: 'center', lineHeight: 1.15, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 440, top: 650, width: 200, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 200, y2: 0 }, colorStops: [{ offset: 0, color: '#e11d48' }, { offset: 1, color: '#f472b6' }] } },
      { type: 'textbox', left: 100, top: 690, width: 880, text: 'Happy Valentine\u2019s Day', fontFamily: 'Georgia', fontSize: 28, fontStyle: 'italic', fill: '#be123c', textAlign: 'center' },
    ]),

  // 48. Halloween — gradient on accent circle, shadow+charSpacing on heading (already has stroke)
  tpl('halloween-dare', 'Enter If You Dare', 'Halloween party',
    'Seasonal', 'Halloween', ['halloween', 'party', 'spooky', 'october'],
    1080, 1350, 'solid', '#0a0a0a', [
      { type: 'circle', left: 650, top: 80, radius: 200, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 400 }, colorStops: [{ offset: 0, color: 'rgba(196,112,74,0.3)' }, { offset: 1, color: 'rgba(196,112,74,0.08)' }] } },
      { type: 'textbox', left: 80, top: 360, width: 920, text: 'ENTER IF\nYOU DARE', fontFamily: 'Montserrat', fontSize: 100, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', lineHeight: 1.1, charSpacing: 80, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 84, top: 364, width: 920, text: 'ENTER IF\nYOU DARE', fontFamily: 'Montserrat', fontSize: 100, fontWeight: 'bold', fill: 'rgba(0,0,0,0)', stroke: 'rgba(196,112,74,0.5)', strokeWidth: 2, textAlign: 'center', lineHeight: 1.1 },
      { type: 'triangle', left: 200, top: 150, width: 30, height: 18, fill: '#C4704A', opacity: 0.4 },
      { type: 'triangle', left: 820, top: 250, width: 24, height: 14, fill: '#C4704A', opacity: 0.3 },
      { type: 'triangle', left: 450, top: 100, width: 20, height: 12, fill: '#C4704A', opacity: 0.25 },
      { type: 'rect', left: 250, top: 650, width: 580, height: 2, fill: 'rgba(196,112,74,0.3)' },
      { type: 'textbox', left: 100, top: 700, width: 880, text: 'HALLOWEEN NIGHT \u00b7 OCT 31', fontFamily: 'Inter', fontSize: 22, fontWeight: 'bold', fill: 'rgba(255,255,255,0.6)', textAlign: 'center', charSpacing: 300 },
      { type: 'textbox', left: 100, top: 780, width: 880, text: 'The Morrison House \u00b7 8 PM \u00b7 Costumes Required', fontFamily: 'DM Sans', fontSize: 20, fill: 'rgba(255,255,255,0.35)', textAlign: 'center' },
    ]),

  // 49. Holiday Card — gradient on divider line, shadow+charSpacing on heading
  tpl('holiday-wishes', 'Warmest Wishes', 'Holiday greeting card',
    'Seasonal', 'Holiday Card', ['holiday', 'christmas', 'greeting', 'winter'],
    1500, 2100, 'solid', '#1a3320', [
      { type: 'circle', left: 200, top: 300, radius: 8, fill: 'rgba(255,255,255,0.15)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 800, top: 150, radius: 6, fill: 'rgba(255,255,255,0.12)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 1100, top: 400, radius: 10, fill: 'rgba(255,255,255,0.18)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 400, top: 500, radius: 5, fill: 'rgba(255,255,255,0.1)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 1200, top: 200, radius: 7, fill: 'rgba(255,255,255,0.14)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 600, top: 100, radius: 9, fill: 'rgba(255,255,255,0.12)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 300, top: 650, radius: 4, fill: 'rgba(255,255,255,0.16)', stroke: '', strokeWidth: 0 },
      { type: 'textbox', left: 150, top: 700, width: 1200, text: 'WARMEST\nWISHES', fontFamily: 'Playfair Display', fontSize: 110, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', lineHeight: 1.15, charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'rect', left: 550, top: 980, width: 400, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(196,112,74,0.2)' }, { offset: 1, color: 'rgba(196,112,74,0.6)' }] } },
      { type: 'textbox', left: 150, top: 1040, width: 1200, text: 'Wishing you peace, joy,\nand a wonderful new year.', fontFamily: 'Georgia', fontSize: 30, fontStyle: 'italic', fill: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.6 },
      { type: 'textbox', left: 150, top: 1300, width: 1200, text: 'From the Anderson Family, 2026', fontFamily: 'DM Sans', fontSize: 22, fill: 'rgba(255,255,255,0.4)', textAlign: 'center' },
    ]),

  // 50. New Year — gradient on divider line, shadow+charSpacing on heading
  tpl('new-year-2026', 'Here\'s to 2026', 'New Year celebration',
    'Seasonal', 'New Year', ['new year', 'celebration', '2026', 'party'],
    1080, 1080, 'gradient', 'linear:to-bottom:#0a0a0a:#1a1520', [
      { type: 'circle', left: 100, top: 100, radius: 6, fill: '#C4704A', opacity: 0.6 },
      { type: 'circle', left: 800, top: 200, radius: 4, fill: '#C4704A', opacity: 0.4 },
      { type: 'circle', left: 500, top: 50, radius: 5, fill: '#C4704A', opacity: 0.5 },
      { type: 'circle', left: 950, top: 400, radius: 3, fill: '#C4704A', opacity: 0.35 },
      { type: 'circle', left: 200, top: 350, radius: 8, fill: '#C4704A', opacity: 0.2 },
      { type: 'circle', left: 700, top: 150, radius: 40, fill: 'rgba(196,112,74,0.1)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 300, top: 500, radius: 60, fill: 'rgba(196,112,74,0.06)', stroke: '', strokeWidth: 0 },
      { type: 'textbox', left: 100, top: 280, width: 880, text: '2026', fontFamily: 'Montserrat', fontSize: 200, fontWeight: 'bold', fill: '#C4704A', textAlign: 'center', charSpacing: 100, shadow: { color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 4 } },
      { type: 'textbox', left: 100, top: 530, width: 880, text: 'HERE\u2019S TO NEW BEGINNINGS', fontFamily: 'Inter', fontSize: 26, fontWeight: 'bold', fill: 'rgba(255,255,255,0.7)', textAlign: 'center', charSpacing: 400 },
      { type: 'rect', left: 340, top: 610, width: 400, height: 2, fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 400, y2: 0 }, colorStops: [{ offset: 0, color: 'rgba(196,112,74,0.2)' }, { offset: 1, color: 'rgba(196,112,74,0.6)' }] } },
      { type: 'textbox', left: 100, top: 660, width: 880, text: 'May this year bring you\njoy, growth, and adventure.', fontFamily: 'Georgia', fontSize: 28, fontStyle: 'italic', fill: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.6 },
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

      // "Your photo" hint in the placeholder
      { type: 'textbox', left: 580, top: 310, width: 420, text: 'YOUR PHOTO',
        fontFamily: 'DM Sans', fontSize: 14, fill: 'rgba(245,240,234,0.5)', textAlign: 'center', charSpacing: 300 },

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
