/**
 * Template Registry — the catalog of all built-in starter templates.
 *
 * 50 templates across 16 categories:
 * - Instagram Post (5)
 * - Instagram Story (3)
 * - Facebook Post (3)
 * - YouTube Thumbnail (3)
 * - Presentation (2)
 * - Business Card (2)
 *
 * Every template is self-contained — shapes, text, and colors only, no
 * external images. All use bold colors and clean layouts.
 *
 * Thumbnail generation requires a browser/canvas environment and is
 * deferred — the template browser uses background color as a visual proxy.
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

  // ─── INSTAGRAM POST (5) — 1080×1080 ──────────────────────────────

  tpl('ig-bold-announce', 'Bold Announcement', 'Eye-catching announcement with bold typography',
    'Social Media', 'Instagram Post', ['instagram', 'announcement', 'bold'],
    1080, 1080, 'solid', '#1a1a2e', [
      { type: 'rect', left: 60, top: 60, width: 960, height: 960, fill: 'rgba(0,0,0,0)', stroke: '#e94560', strokeWidth: 4, strokeUniform: true },
      { type: 'textbox', left: 120, top: 340, width: 840, text: 'BIG NEWS', fontFamily: 'Inter', fontSize: 120, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 120, top: 520, width: 840, text: 'Something amazing is coming soon. Stay tuned.', fontFamily: 'Inter', fontSize: 32, fill: '#a0a0b0', textAlign: 'center', lineHeight: 1.4 },
      { type: 'rect', left: 380, top: 700, width: 320, height: 60, fill: '#e94560', rx: 30, ry: 30 },
      { type: 'textbox', left: 380, top: 712, width: 320, text: 'Learn More', fontFamily: 'Inter', fontSize: 22, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  tpl('ig-quote-minimal', 'Minimal Quote', 'Clean quote card with warm tones',
    'Social Media', 'Instagram Post', ['instagram', 'quote', 'minimal'],
    1080, 1080, 'solid', '#f5f0eb', [
      { type: 'textbox', left: 120, top: 200, width: 840, text: '\u201C', fontFamily: 'Playfair Display', fontSize: 200, fill: '#d4a574', textAlign: 'left', opacity: 0.4 },
      { type: 'textbox', left: 120, top: 360, width: 840, text: 'Design is not just what it looks like. Design is how it works.', fontFamily: 'Playfair Display', fontSize: 48, fontStyle: 'italic', fill: '#2d2d2d', lineHeight: 1.5 },
      { type: 'rect', left: 120, top: 650, width: 80, height: 3, fill: '#d4a574' },
      { type: 'textbox', left: 120, top: 680, width: 840, text: '— Steve Jobs', fontFamily: 'Inter', fontSize: 24, fill: '#888888' },
    ]),

  tpl('ig-promo-gradient', 'Gradient Promo', 'Vibrant gradient with central text',
    'Social Media', 'Instagram Post', ['instagram', 'promo', 'gradient'],
    1080, 1080, 'gradient', 'linear:to-bottom-right:#f093fb:#f5576c', [
      { type: 'circle', left: 100, top: 100, radius: 60, fill: 'rgba(255,255,255,0.15)', stroke: '', strokeWidth: 0 },
      { type: 'circle', left: 820, top: 780, radius: 90, fill: 'rgba(255,255,255,0.1)', stroke: '', strokeWidth: 0 },
      { type: 'textbox', left: 120, top: 380, width: 840, text: 'NEW\nCOLLECTION', fontFamily: 'Inter', fontSize: 96, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 1.1 },
      { type: 'textbox', left: 120, top: 640, width: 840, text: 'Discover the latest styles for spring', fontFamily: 'Inter', fontSize: 26, fill: 'rgba(255,255,255,0.85)', textAlign: 'center' },
      { type: 'rect', left: 390, top: 740, width: 300, height: 56, fill: '#ffffff', rx: 28, ry: 28 },
      { type: 'textbox', left: 390, top: 752, width: 300, text: 'Shop Now', fontFamily: 'Inter', fontSize: 20, fontWeight: 'bold', fill: '#f5576c', textAlign: 'center' },
    ]),

  tpl('ig-tips-carousel', 'Tips Card', 'Numbered tips with clean layout',
    'Social Media', 'Instagram Post', ['instagram', 'tips', 'educational'],
    1080, 1080, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 200, fill: '#111827' },
      { type: 'textbox', left: 80, top: 60, width: 920, text: '5 DESIGN TIPS', fontFamily: 'Inter', fontSize: 56, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 80, top: 140, width: 920, text: 'you need to know', fontFamily: 'Inter', fontSize: 22, fill: 'rgba(255,255,255,0.6)', textAlign: 'center' },
      { type: 'circle', left: 80, top: 280, radius: 28, fill: '#6366f1' },
      { type: 'textbox', left: 84, top: 290, width: 52, text: '1', fontFamily: 'Inter', fontSize: 24, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 160, top: 288, width: 840, text: 'Use consistent spacing throughout', fontFamily: 'Inter', fontSize: 24, fill: '#374151' },
      { type: 'circle', left: 80, top: 380, radius: 28, fill: '#6366f1' },
      { type: 'textbox', left: 84, top: 390, width: 52, text: '2', fontFamily: 'Inter', fontSize: 24, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 160, top: 388, width: 840, text: 'Limit your color palette to 3 colors', fontFamily: 'Inter', fontSize: 24, fill: '#374151' },
      { type: 'circle', left: 80, top: 480, radius: 28, fill: '#6366f1' },
      { type: 'textbox', left: 84, top: 490, width: 52, text: '3', fontFamily: 'Inter', fontSize: 24, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 160, top: 488, width: 840, text: 'Choose typography that matches your brand', fontFamily: 'Inter', fontSize: 24, fill: '#374151' },
      { type: 'circle', left: 80, top: 580, radius: 28, fill: '#6366f1' },
      { type: 'textbox', left: 84, top: 590, width: 52, text: '4', fontFamily: 'Inter', fontSize: 24, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 160, top: 588, width: 840, text: 'White space is your friend', fontFamily: 'Inter', fontSize: 24, fill: '#374151' },
      { type: 'circle', left: 80, top: 680, radius: 28, fill: '#6366f1' },
      { type: 'textbox', left: 84, top: 690, width: 52, text: '5', fontFamily: 'Inter', fontSize: 24, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 160, top: 688, width: 840, text: 'Align everything to a grid', fontFamily: 'Inter', fontSize: 24, fill: '#374151' },
      { type: 'textbox', left: 80, top: 840, width: 920, text: '@yourusername', fontFamily: 'Inter', fontSize: 18, fill: '#9ca3af', textAlign: 'center' },
    ]),

  tpl('ig-product-showcase', 'Product Showcase', 'Split-tone layout for showcasing a product',
    'Social Media', 'Instagram Post', ['instagram', 'product', 'ecommerce'],
    1080, 1080, 'solid', '#f8fafc', [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 540, fill: '#0ea5e9' },
      { type: 'circle', left: 340, top: 170, radius: 200, fill: 'rgba(255,255,255,0.15)' },
      { type: 'textbox', left: 340, top: 300, width: 400, text: 'YOUR\nPRODUCT', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.1 },
      { type: 'textbox', left: 80, top: 600, width: 920, text: 'Product Name', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#0f172a', textAlign: 'center' },
      { type: 'textbox', left: 80, top: 680, width: 920, text: 'A brief tagline that sells the value', fontFamily: 'Inter', fontSize: 22, fill: '#64748b', textAlign: 'center' },
      { type: 'textbox', left: 370, top: 780, width: 340, text: '$49.99', fontFamily: 'Inter', fontSize: 52, fontWeight: 'bold', fill: '#0ea5e9', textAlign: 'center' },
      { type: 'rect', left: 380, top: 870, width: 320, height: 56, fill: '#0ea5e9', rx: 28, ry: 28 },
      { type: 'textbox', left: 380, top: 882, width: 320, text: 'Buy Now', fontFamily: 'Inter', fontSize: 20, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  // ─── INSTAGRAM STORY (3) — 1080×1920 ─────────────────────────────

  tpl('ig-story-gradient', 'Gradient Story', 'Vibrant gradient with swipe-up prompt',
    'Social Media', 'Instagram Story', ['instagram', 'story', 'gradient'],
    1080, 1920, 'gradient', 'linear:to-bottom:#667eea:#764ba2', [
      { type: 'textbox', left: 100, top: 700, width: 880, text: 'SWIPE UP', fontFamily: 'Inter', fontSize: 64, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 800, width: 880, text: 'to discover something new', fontFamily: 'Inter', fontSize: 28, fill: 'rgba(255,255,255,0.8)', textAlign: 'center' },
      { type: 'circle', left: 490, top: 1400, radius: 40, fill: 'rgba(0,0,0,0)', stroke: '#ffffff', strokeWidth: 2 },
      { type: 'triangle', left: 504, top: 1412, width: 16, height: 16, fill: '#ffffff', angle: 180 },
    ]),

  tpl('ig-story-poll', 'Poll Story', 'Engaging poll story with this-or-that layout',
    'Social Media', 'Instagram Story', ['instagram', 'story', 'poll', 'interactive'],
    1080, 1920, 'solid', '#18181b', [
      { type: 'textbox', left: 100, top: 200, width: 880, text: 'THIS OR THAT?', fontFamily: 'Inter', fontSize: 52, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 80, top: 400, width: 420, height: 500, fill: '#f43f5e', rx: 24, ry: 24 },
      { type: 'textbox', left: 100, top: 580, width: 380, text: 'OPTION\nONE', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 1.1 },
      { type: 'rect', left: 580, top: 400, width: 420, height: 500, fill: '#3b82f6', rx: 24, ry: 24 },
      { type: 'textbox', left: 600, top: 580, width: 380, text: 'OPTION\nTWO', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 1.1 },
      { type: 'textbox', left: 100, top: 1050, width: 880, text: 'Vote in the poll above!', fontFamily: 'Inter', fontSize: 22, fill: '#a1a1aa', textAlign: 'center' },
    ]),

  tpl('ig-story-countdown', 'Countdown Story', 'Event countdown with bold date',
    'Social Media', 'Instagram Story', ['instagram', 'story', 'countdown', 'event'],
    1080, 1920, 'gradient', 'linear:to-bottom:#0f0c29:#302b63', [
      { type: 'textbox', left: 100, top: 400, width: 880, text: 'COMING SOON', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#a78bfa', textAlign: 'center', charSpacing: 400 },
      { type: 'textbox', left: 100, top: 520, width: 880, text: 'APRIL 20', fontFamily: 'Inter', fontSize: 120, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 340, top: 700, width: 400, height: 4, fill: '#a78bfa' },
      { type: 'textbox', left: 100, top: 760, width: 880, text: 'The wait is almost over.\nMark your calendar.', fontFamily: 'Inter', fontSize: 26, fill: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.5 },
      { type: 'rect', left: 340, top: 920, width: 400, height: 56, fill: '#a78bfa', rx: 28, ry: 28 },
      { type: 'textbox', left: 340, top: 932, width: 400, text: 'Set Reminder', fontFamily: 'Inter', fontSize: 20, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  // ─── FACEBOOK POST (3) — 1200×630 ────────────────────────────────

  tpl('fb-event', 'Event Promo', 'Event banner with date and details',
    'Social Media', 'Facebook Post', ['facebook', 'event', 'promo'],
    1200, 630, 'solid', '#0f3460', [
      { type: 'rect', left: 0, top: 0, width: 400, height: 630, fill: '#e94560' },
      { type: 'textbox', left: 60, top: 180, width: 280, text: 'JAN', fontFamily: 'Inter', fontSize: 36, fontWeight: 'bold', fill: 'rgba(255,255,255,0.7)', textAlign: 'center' },
      { type: 'textbox', left: 60, top: 230, width: 280, text: '15', fontFamily: 'Inter', fontSize: 120, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 460, top: 160, width: 680, text: 'Creative Workshop', fontFamily: 'Inter', fontSize: 52, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 460, top: 260, width: 680, text: 'Join us for an evening of design, creativity, and networking. Free entry for all members.', fontFamily: 'Inter', fontSize: 22, fill: 'rgba(255,255,255,0.7)', lineHeight: 1.5 },
      { type: 'textbox', left: 460, top: 420, width: 680, text: '7:00 PM  \u00b7  Downtown Studio  \u00b7  Free', fontFamily: 'Inter', fontSize: 18, fontWeight: 'bold', fill: '#e94560' },
    ]),

  tpl('fb-testimonial', 'Customer Testimonial', 'Social proof card with star rating',
    'Social Media', 'Facebook Post', ['facebook', 'testimonial', 'review'],
    1200, 630, 'solid', '#f0fdf4', [
      { type: 'rect', left: 60, top: 60, width: 1080, height: 510, fill: '#ffffff', rx: 16, ry: 16, stroke: '#e5e7eb', strokeWidth: 1 },
      { type: 'textbox', left: 120, top: 100, width: 960, text: '\u2605 \u2605 \u2605 \u2605 \u2605', fontFamily: 'Inter', fontSize: 32, fill: '#eab308' },
      { type: 'textbox', left: 120, top: 170, width: 960, text: '"This product completely changed how I work. I can\'t recommend it enough. The team behind it truly cares about quality."', fontFamily: 'Inter', fontSize: 28, fontStyle: 'italic', fill: '#374151', lineHeight: 1.5 },
      { type: 'rect', left: 120, top: 380, width: 50, height: 3, fill: '#22c55e' },
      { type: 'textbox', left: 120, top: 400, width: 500, text: 'Alex Johnson', fontFamily: 'Inter', fontSize: 22, fontWeight: 'bold', fill: '#111827' },
      { type: 'textbox', left: 120, top: 435, width: 500, text: 'Verified Customer', fontFamily: 'Inter', fontSize: 16, fill: '#22c55e' },
    ]),

  tpl('fb-offer', 'Limited Offer', 'Time-limited special offer banner',
    'Social Media', 'Facebook Post', ['facebook', 'offer', 'discount'],
    1200, 630, 'solid', '#1e1b4b', [
      { type: 'rect', left: 0, top: 0, width: 1200, height: 8, fill: '#f59e0b' },
      { type: 'textbox', left: 80, top: 80, width: 500, text: 'LIMITED TIME', fontFamily: 'Inter', fontSize: 18, fontWeight: 'bold', fill: '#f59e0b', charSpacing: 300 },
      { type: 'textbox', left: 80, top: 140, width: 700, text: 'Get 50% Off\nEverything', fontFamily: 'Inter', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.1 },
      { type: 'textbox', left: 80, top: 360, width: 700, text: 'Use code SAVE50 at checkout. Offer ends Sunday.', fontFamily: 'Inter', fontSize: 22, fill: '#a5b4fc', lineHeight: 1.4 },
      { type: 'rect', left: 80, top: 470, width: 240, height: 56, fill: '#f59e0b', rx: 8, ry: 8 },
      { type: 'textbox', left: 80, top: 482, width: 240, text: 'Claim Offer', fontFamily: 'Inter', fontSize: 20, fontWeight: 'bold', fill: '#1e1b4b', textAlign: 'center' },
      { type: 'circle', left: 950, top: 200, radius: 140, fill: '#f59e0b', opacity: 0.12 },
      { type: 'textbox', left: 930, top: 290, width: 180, text: '50%', fontFamily: 'Inter', fontSize: 64, fontWeight: 'bold', fill: '#f59e0b', textAlign: 'center' },
    ]),

  // ─── YOUTUBE THUMBNAIL (3) — 1280×720 ────────────────────────────

  tpl('yt-thumb-bold', 'Bold Thumbnail', 'High-impact split-tone with big text',
    'Video', 'YouTube Thumbnail', ['youtube', 'thumbnail', 'bold'],
    1280, 720, 'solid', '#ff6b35', [
      { type: 'rect', left: 640, top: 0, width: 640, height: 720, fill: '#1a1a2e' },
      { type: 'textbox', left: 60, top: 200, width: 560, text: 'TOP 10', fontFamily: 'Inter', fontSize: 100, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 60, top: 340, width: 560, text: 'TIPS', fontFamily: 'Inter', fontSize: 80, fontWeight: 'bold', fill: '#1a1a2e', textAlign: 'center' },
      { type: 'circle', left: 820, top: 240, radius: 100, fill: '#ff6b35' },
      { type: 'textbox', left: 820, top: 290, width: 200, text: '2026', fontFamily: 'Inter', fontSize: 40, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  tpl('yt-thumb-reaction', 'Reaction Thumbnail', 'Emoji-style reaction with vibrant background',
    'Video', 'YouTube Thumbnail', ['youtube', 'thumbnail', 'reaction'],
    1280, 720, 'gradient', 'linear:to-right:#7c3aed:#db2777', [
      { type: 'textbox', left: 60, top: 120, width: 700, text: 'I TRIED\nTHIS FOR\n30 DAYS', fontFamily: 'Inter', fontSize: 88, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.0 },
      { type: 'circle', left: 900, top: 200, radius: 160, fill: 'rgba(255,255,255,0.15)' },
      { type: 'textbox', left: 920, top: 280, width: 280, text: '!?', fontFamily: 'Inter', fontSize: 120, fontWeight: 'bold', fill: '#fbbf24', textAlign: 'center' },
      { type: 'rect', left: 60, top: 540, width: 300, height: 56, fill: '#fbbf24', rx: 8, ry: 8 },
      { type: 'textbox', left: 60, top: 552, width: 300, text: 'WATCH NOW', fontFamily: 'Inter', fontSize: 20, fontWeight: 'bold', fill: '#1e1b4b', textAlign: 'center' },
    ]),

  tpl('yt-thumb-tutorial', 'Tutorial Thumbnail', 'Clean tutorial style with step indicator',
    'Video', 'YouTube Thumbnail', ['youtube', 'thumbnail', 'tutorial', 'howto'],
    1280, 720, 'solid', '#0f172a', [
      { type: 'rect', left: 0, top: 0, width: 1280, height: 6, fill: '#22d3ee' },
      { type: 'textbox', left: 60, top: 100, width: 800, text: 'HOW TO', fontFamily: 'Inter', fontSize: 36, fontWeight: 'bold', fill: '#22d3ee', charSpacing: 200 },
      { type: 'textbox', left: 60, top: 170, width: 800, text: 'Design Like\na Pro', fontFamily: 'Inter', fontSize: 84, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.05 },
      { type: 'textbox', left: 60, top: 420, width: 800, text: 'Step-by-step beginner guide', fontFamily: 'Inter', fontSize: 26, fill: '#94a3b8' },
      { type: 'rect', left: 1000, top: 200, width: 200, height: 200, fill: '#22d3ee', rx: 20, ry: 20 },
      { type: 'textbox', left: 1000, top: 240, width: 200, text: 'FREE', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#0f172a', textAlign: 'center' },
      { type: 'textbox', left: 1000, top: 310, width: 200, text: 'GUIDE', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#0f172a', textAlign: 'center' },
    ]),

  // ─── PRESENTATION (2) — 1920×1080 ────────────────────────────────

  tpl('pres-title-dark', 'Dark Title Slide', 'Professional dark presentation title',
    'Presentation', 'Presentation (16:9)', ['presentation', 'title', 'dark'],
    1920, 1080, 'solid', '#0d1117', [
      { type: 'rect', left: 0, top: 0, width: 8, height: 1080, fill: '#58a6ff' },
      { type: 'textbox', left: 120, top: 300, width: 1200, text: 'Presentation Title', fontFamily: 'Inter', fontSize: 72, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 120, top: 420, width: 1200, text: 'A subtitle that explains the context of this presentation', fontFamily: 'Inter', fontSize: 28, fill: '#8b949e', lineHeight: 1.5 },
      { type: 'rect', left: 120, top: 530, width: 100, height: 4, fill: '#58a6ff' },
      { type: 'textbox', left: 120, top: 570, width: 600, text: 'Your Name  \u00b7  April 2026', fontFamily: 'Inter', fontSize: 18, fill: '#484f58' },
    ]),

  tpl('pres-title-light', 'Light Title Slide', 'Clean white presentation with accent',
    'Presentation', 'Presentation (16:9)', ['presentation', 'title', 'light', 'clean'],
    1920, 1080, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 1920, height: 6, fill: '#6366f1' },
      { type: 'rect', left: 1600, top: 0, width: 320, height: 1080, fill: '#6366f1' },
      { type: 'textbox', left: 120, top: 320, width: 1400, text: 'Your Big Idea', fontFamily: 'Inter', fontSize: 80, fontWeight: 'bold', fill: '#1e1b4b' },
      { type: 'textbox', left: 120, top: 450, width: 1400, text: 'A presentation about making things better', fontFamily: 'Inter', fontSize: 30, fill: '#6b7280', lineHeight: 1.4 },
      { type: 'rect', left: 120, top: 550, width: 80, height: 4, fill: '#6366f1' },
      { type: 'textbox', left: 120, top: 590, width: 500, text: 'Jane Doe  \u00b7  Product Team', fontFamily: 'Inter', fontSize: 20, fill: '#9ca3af' },
      { type: 'textbox', left: 1630, top: 480, width: 260, text: '2026', fontFamily: 'Inter', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  // ─── BUSINESS CARD (2) — 1050×600 ────────────────────────────────

  tpl('bcard-modern', 'Modern Card', 'Clean modern business card with blue accent',
    'Print', 'Business Card', ['business card', 'modern', 'clean'],
    1050, 600, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 1050, height: 8, fill: '#2563eb' },
      { type: 'textbox', left: 60, top: 80, width: 500, text: 'Jane Doe', fontFamily: 'Inter', fontSize: 36, fontWeight: 'bold', fill: '#111827' },
      { type: 'textbox', left: 60, top: 135, width: 500, text: 'Senior Designer', fontFamily: 'Inter', fontSize: 18, fill: '#6b7280' },
      { type: 'rect', left: 60, top: 180, width: 40, height: 3, fill: '#2563eb' },
      { type: 'textbox', left: 60, top: 220, width: 500, text: 'jane@example.com\n+1 (555) 123-4567\nexample.com', fontFamily: 'Inter', fontSize: 14, fill: '#4b5563', lineHeight: 1.8 },
      { type: 'circle', left: 850, top: 200, radius: 80, fill: '#2563eb', opacity: 0.08 },
      { type: 'circle', left: 880, top: 230, radius: 50, fill: '#2563eb', opacity: 0.12 },
    ]),

  tpl('bcard-bold', 'Bold Card', 'Dark bold business card with gold accent',
    'Print', 'Business Card', ['business card', 'bold', 'dark'],
    1050, 600, 'solid', '#1c1917', [
      { type: 'rect', left: 0, top: 0, width: 12, height: 600, fill: '#d97706' },
      { type: 'textbox', left: 60, top: 60, width: 500, text: 'JOHN SMITH', fontFamily: 'Inter', fontSize: 32, fontWeight: 'bold', fill: '#ffffff', charSpacing: 200 },
      { type: 'textbox', left: 60, top: 115, width: 500, text: 'Creative Director', fontFamily: 'Inter', fontSize: 16, fill: '#d97706' },
      { type: 'rect', left: 60, top: 170, width: 60, height: 2, fill: '#d97706' },
      { type: 'textbox', left: 60, top: 210, width: 500, text: 'john@studio.co\n+1 (555) 987-6543\nwww.studio.co', fontFamily: 'Inter', fontSize: 14, fill: '#a8a29e', lineHeight: 1.8 },
      { type: 'rect', left: 700, top: 350, width: 280, height: 180, fill: 'rgba(0,0,0,0)', stroke: '#d97706', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 720, top: 410, width: 240, text: 'STUDIO', fontFamily: 'Inter', fontSize: 36, fontWeight: 'bold', fill: '#d97706', textAlign: 'center' },
    ]),

  // ─── EVENT INVITATIONS (3) — 1080×1080 ──────────────────────────

  tpl('event-wedding', 'Wedding Invitation', 'Elegant wedding invitation with serif fonts',
    'Event', 'Invitation', ['wedding', 'invitation', 'elegant'],
    1080, 1080, 'solid', '#faf7f2', [
      { type: 'rect', left: 60, top: 60, width: 960, height: 960, fill: 'rgba(0,0,0,0)', stroke: '#c9a96e', strokeWidth: 2, strokeUniform: true },
      { type: 'rect', left: 80, top: 80, width: 920, height: 920, fill: 'rgba(0,0,0,0)', stroke: '#c9a96e', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 140, top: 200, width: 800, text: 'Together with their families', fontFamily: 'Lora', fontSize: 20, fill: '#8b7355', textAlign: 'center' },
      { type: 'textbox', left: 140, top: 300, width: 800, text: 'Emma & James', fontFamily: 'Playfair Display', fontSize: 72, fill: '#2d2215', textAlign: 'center' },
      { type: 'rect', left: 440, top: 400, width: 200, height: 2, fill: '#c9a96e' },
      { type: 'textbox', left: 140, top: 440, width: 800, text: 'request the pleasure of your company\nat the celebration of their marriage', fontFamily: 'Lora', fontSize: 22, fill: '#5c4a32', textAlign: 'center', lineHeight: 1.6 },
      { type: 'textbox', left: 140, top: 580, width: 800, text: 'Saturday, June 15th, 2026\nat four o\u2019clock in the afternoon', fontFamily: 'Lora', fontSize: 24, fontWeight: 'bold', fill: '#2d2215', textAlign: 'center', lineHeight: 1.6 },
      { type: 'textbox', left: 140, top: 720, width: 800, text: 'The Grand Ballroom\n123 Celebration Ave, New York', fontFamily: 'Lora', fontSize: 18, fill: '#8b7355', textAlign: 'center', lineHeight: 1.6 },
      { type: 'textbox', left: 140, top: 850, width: 800, text: 'RSVP by May 1st', fontFamily: 'Inter', fontSize: 14, fill: '#c9a96e', textAlign: 'center', charSpacing: 200 },
    ]),

  tpl('event-birthday', 'Birthday Party', 'Fun colorful birthday party invitation',
    'Event', 'Invitation', ['birthday', 'party', 'fun', 'colorful'],
    1080, 1080, 'solid', '#7c3aed', [
      { type: 'circle', left: -80, top: -80, radius: 200, fill: '#fbbf24', opacity: 0.3 },
      { type: 'circle', left: 800, top: 700, radius: 250, fill: '#ec4899', opacity: 0.2 },
      { type: 'textbox', left: 100, top: 150, width: 880, text: 'YOU\'RE INVITED!', fontFamily: 'Anton', fontSize: 80, fill: '#fbbf24', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 280, width: 880, text: 'Sarah\'s 30th\nBirthday Bash', fontFamily: 'Poppins', fontSize: 60, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center', lineHeight: 1.3 },
      { type: 'rect', left: 300, top: 460, width: 480, height: 4, fill: '#fbbf24', rx: 2, ry: 2 },
      { type: 'textbox', left: 100, top: 510, width: 880, text: 'Saturday, August 20th\n7:00 PM \u2014 Late', fontFamily: 'Poppins', fontSize: 28, fill: '#e9d5ff', textAlign: 'center', lineHeight: 1.5 },
      { type: 'textbox', left: 100, top: 650, width: 880, text: 'The Rooftop Bar\n456 Party Street', fontFamily: 'Poppins', fontSize: 22, fill: '#c4b5fd', textAlign: 'center', lineHeight: 1.5 },
      { type: 'rect', left: 300, top: 790, width: 480, height: 60, fill: '#fbbf24', rx: 30, ry: 30 },
      { type: 'textbox', left: 300, top: 802, width: 480, text: 'RSVP to Sarah', fontFamily: 'Poppins', fontSize: 22, fontWeight: 'bold', fill: '#7c3aed', textAlign: 'center' },
    ]),

  tpl('event-corporate', 'Corporate Event', 'Professional corporate event invitation',
    'Event', 'Invitation', ['corporate', 'event', 'professional'],
    1080, 1080, 'solid', '#0f172a', [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 8, fill: '#3b82f6' },
      { type: 'textbox', left: 100, top: 120, width: 880, text: 'ANNUAL\nSUMMIT 2026', fontFamily: 'Inter', fontSize: 80, fontWeight: 'bold', fill: '#ffffff', textAlign: 'left', lineHeight: 1.1 },
      { type: 'rect', left: 100, top: 340, width: 80, height: 4, fill: '#3b82f6' },
      { type: 'textbox', left: 100, top: 390, width: 880, text: 'Innovation \u00b7 Leadership \u00b7 Growth', fontFamily: 'Inter', fontSize: 24, fill: '#64748b', textAlign: 'left' },
      { type: 'textbox', left: 100, top: 500, width: 500, text: 'March 15\u201316, 2026\n9:00 AM \u2014 6:00 PM', fontFamily: 'Inter', fontSize: 28, fill: '#e2e8f0', lineHeight: 1.5 },
      { type: 'textbox', left: 100, top: 640, width: 500, text: 'Convention Center\n789 Business Blvd, San Francisco', fontFamily: 'Inter', fontSize: 20, fill: '#94a3b8', lineHeight: 1.5 },
      { type: 'rect', left: 100, top: 800, width: 300, height: 56, fill: '#3b82f6', rx: 8, ry: 8 },
      { type: 'textbox', left: 100, top: 814, width: 300, text: 'Register Now', fontFamily: 'Inter', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 920, width: 500, text: 'ACME CORPORATION', fontFamily: 'Inter', fontSize: 14, fill: '#475569', charSpacing: 300 },
    ]),

  // ─── RESTAURANT MENUS (2) — 1080×1440 ──────────────────────────

  tpl('menu-cafe', 'Caf\u00e9 Menu', 'Warm rustic caf\u00e9 menu with earthy tones',
    'Print', 'Menu', ['restaurant', 'cafe', 'menu', 'food'],
    1080, 1440, 'solid', '#faf5ef', [
      { type: 'textbox', left: 100, top: 80, width: 880, text: 'THE DAILY GRIND', fontFamily: 'Playfair Display', fontSize: 48, fill: '#3e2723', textAlign: 'center', charSpacing: 150 },
      { type: 'rect', left: 440, top: 150, width: 200, height: 2, fill: '#8d6e63' },
      { type: 'textbox', left: 100, top: 200, width: 880, text: 'COFFEE', fontFamily: 'Inter', fontSize: 20, fill: '#8d6e63', textAlign: 'center', charSpacing: 300 },
      { type: 'textbox', left: 100, top: 250, width: 600, text: 'Espresso\nCappuccino\nLatte\nCold Brew\nPour Over', fontFamily: 'Lora', fontSize: 22, fill: '#3e2723', lineHeight: 2.0 },
      { type: 'textbox', left: 750, top: 250, width: 200, text: '$3.50\n$4.50\n$5.00\n$4.50\n$5.50', fontFamily: 'Lora', fontSize: 22, fill: '#8d6e63', textAlign: 'right', lineHeight: 2.0 },
      { type: 'rect', left: 100, top: 530, width: 880, height: 1, fill: '#d7ccc8' },
      { type: 'textbox', left: 100, top: 570, width: 880, text: 'PASTRIES', fontFamily: 'Inter', fontSize: 20, fill: '#8d6e63', textAlign: 'center', charSpacing: 300 },
      { type: 'textbox', left: 100, top: 620, width: 600, text: 'Croissant\nBlueberry Muffin\nBanana Bread\nCinnamon Roll', fontFamily: 'Lora', fontSize: 22, fill: '#3e2723', lineHeight: 2.0 },
      { type: 'textbox', left: 750, top: 620, width: 200, text: '$3.00\n$3.50\n$4.00\n$4.50', fontFamily: 'Lora', fontSize: 22, fill: '#8d6e63', textAlign: 'right', lineHeight: 2.0 },
      { type: 'rect', left: 100, top: 860, width: 880, height: 1, fill: '#d7ccc8' },
      { type: 'textbox', left: 100, top: 900, width: 880, text: 'BRUNCH', fontFamily: 'Inter', fontSize: 20, fill: '#8d6e63', textAlign: 'center', charSpacing: 300 },
      { type: 'textbox', left: 100, top: 950, width: 600, text: 'Avocado Toast\nAcai Bowl\nEggs Benedict\nPancake Stack', fontFamily: 'Lora', fontSize: 22, fill: '#3e2723', lineHeight: 2.0 },
      { type: 'textbox', left: 750, top: 950, width: 200, text: '$12.00\n$14.00\n$15.00\n$11.00', fontFamily: 'Lora', fontSize: 22, fill: '#8d6e63', textAlign: 'right', lineHeight: 2.0 },
      { type: 'textbox', left: 100, top: 1300, width: 880, text: 'Open Daily 7am\u20134pm \u00b7 123 Main Street', fontFamily: 'Inter', fontSize: 14, fill: '#bcaaa4', textAlign: 'center' },
    ]),

  tpl('menu-fine-dining', 'Fine Dining Menu', 'Elegant dark fine dining menu',
    'Print', 'Menu', ['restaurant', 'fine dining', 'menu', 'elegant'],
    1080, 1440, 'solid', '#1a1a1a', [
      { type: 'textbox', left: 100, top: 80, width: 880, text: 'MAISON', fontFamily: 'Playfair Display', fontSize: 56, fill: '#c9a96e', textAlign: 'center', charSpacing: 400 },
      { type: 'textbox', left: 100, top: 155, width: 880, text: 'TASTING MENU', fontFamily: 'Inter', fontSize: 14, fill: '#666666', textAlign: 'center', charSpacing: 400 },
      { type: 'rect', left: 490, top: 210, width: 100, height: 1, fill: '#c9a96e' },
      { type: 'textbox', left: 100, top: 280, width: 880, text: 'AMUSE-BOUCHE', fontFamily: 'Inter', fontSize: 13, fill: '#c9a96e', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 100, top: 310, width: 880, text: 'Oyster with champagne foam\nand caviar', fontFamily: 'Lora', fontSize: 22, fill: '#e0e0e0', textAlign: 'center', lineHeight: 1.5 },
      { type: 'textbox', left: 100, top: 430, width: 880, text: 'ENTR\u00c9E', fontFamily: 'Inter', fontSize: 13, fill: '#c9a96e', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 100, top: 460, width: 880, text: 'Seared foie gras with fig compote\nand brioche toast', fontFamily: 'Lora', fontSize: 22, fill: '#e0e0e0', textAlign: 'center', lineHeight: 1.5 },
      { type: 'textbox', left: 100, top: 580, width: 880, text: 'POISSON', fontFamily: 'Inter', fontSize: 13, fill: '#c9a96e', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 100, top: 610, width: 880, text: 'Pan-roasted halibut\nwith beurre blanc and asparagus', fontFamily: 'Lora', fontSize: 22, fill: '#e0e0e0', textAlign: 'center', lineHeight: 1.5 },
      { type: 'textbox', left: 100, top: 730, width: 880, text: 'VIANDE', fontFamily: 'Inter', fontSize: 13, fill: '#c9a96e', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 100, top: 760, width: 880, text: 'Wagyu beef tenderloin\nwith truffle jus and pommes pur\u00e9e', fontFamily: 'Lora', fontSize: 22, fill: '#e0e0e0', textAlign: 'center', lineHeight: 1.5 },
      { type: 'textbox', left: 100, top: 880, width: 880, text: 'DESSERT', fontFamily: 'Inter', fontSize: 13, fill: '#c9a96e', textAlign: 'center', charSpacing: 200 },
      { type: 'textbox', left: 100, top: 910, width: 880, text: 'Valrhona chocolate fondant\nwith vanilla ice cream', fontFamily: 'Lora', fontSize: 22, fill: '#e0e0e0', textAlign: 'center', lineHeight: 1.5 },
      { type: 'rect', left: 490, top: 1050, width: 100, height: 1, fill: '#c9a96e' },
      { type: 'textbox', left: 100, top: 1100, width: 880, text: '$185 per person\nWine pairing available', fontFamily: 'Inter', fontSize: 16, fill: '#666666', textAlign: 'center', lineHeight: 1.6 },
    ]),

  // ─── RESUMES (3) — 1748×2480 ────────────────────────────────────

  tpl('resume-modern', 'Modern Resume', 'Clean two-column resume with blue accent',
    'Print', 'Resume', ['resume', 'cv', 'modern', 'professional'],
    1748, 2480, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 580, height: 2480, fill: '#1e3a5f' },
      { type: 'textbox', left: 60, top: 100, width: 460, text: 'ALEX\nJOHNSON', fontFamily: 'Inter', fontSize: 52, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.1 },
      { type: 'textbox', left: 60, top: 260, width: 460, text: 'Product Designer', fontFamily: 'Inter', fontSize: 20, fill: '#93c5fd' },
      { type: 'rect', left: 60, top: 320, width: 80, height: 3, fill: '#93c5fd' },
      { type: 'textbox', left: 60, top: 370, width: 460, text: 'CONTACT', fontFamily: 'Inter', fontSize: 13, fill: '#93c5fd', charSpacing: 200 },
      { type: 'textbox', left: 60, top: 400, width: 460, text: 'alex@email.com\n+1 (555) 123-4567\nNew York, NY\nlinkedin.com/in/alex', fontFamily: 'Inter', fontSize: 16, fill: '#cbd5e1', lineHeight: 1.8 },
      { type: 'textbox', left: 60, top: 600, width: 460, text: 'SKILLS', fontFamily: 'Inter', fontSize: 13, fill: '#93c5fd', charSpacing: 200 },
      { type: 'textbox', left: 60, top: 635, width: 460, text: 'UI/UX Design \u00b7 Figma \u00b7 Sketch\nPrototyping \u00b7 User Research\nDesign Systems \u00b7 HTML/CSS\nReact \u00b7 TypeScript', fontFamily: 'Inter', fontSize: 16, fill: '#cbd5e1', lineHeight: 1.8 },
      { type: 'textbox', left: 660, top: 100, width: 1000, text: 'EXPERIENCE', fontFamily: 'Inter', fontSize: 13, fill: '#1e3a5f', charSpacing: 200 },
      { type: 'textbox', left: 660, top: 140, width: 1000, text: 'Senior Product Designer', fontFamily: 'Inter', fontSize: 22, fontWeight: 'bold', fill: '#1e293b' },
      { type: 'textbox', left: 660, top: 175, width: 1000, text: 'TechCorp Inc. \u00b7 2023\u2013Present', fontFamily: 'Inter', fontSize: 15, fill: '#64748b' },
      { type: 'textbox', left: 660, top: 210, width: 1000, text: '\u2022 Led redesign of core product, improving conversion by 35%\n\u2022 Built and maintained design system used by 12 teams\n\u2022 Mentored 3 junior designers', fontFamily: 'Inter', fontSize: 15, fill: '#475569', lineHeight: 1.8 },
      { type: 'textbox', left: 660, top: 380, width: 1000, text: 'Product Designer', fontFamily: 'Inter', fontSize: 22, fontWeight: 'bold', fill: '#1e293b' },
      { type: 'textbox', left: 660, top: 415, width: 1000, text: 'StartupXYZ \u00b7 2020\u20132023', fontFamily: 'Inter', fontSize: 15, fill: '#64748b' },
      { type: 'textbox', left: 660, top: 450, width: 1000, text: '\u2022 Designed mobile app from 0 to 1, reaching 100K users\n\u2022 Conducted user research with 200+ participants\n\u2022 Collaborated with engineering on design implementation', fontFamily: 'Inter', fontSize: 15, fill: '#475569', lineHeight: 1.8 },
      { type: 'rect', left: 660, top: 640, width: 1000, height: 1, fill: '#e2e8f0' },
      { type: 'textbox', left: 660, top: 680, width: 1000, text: 'EDUCATION', fontFamily: 'Inter', fontSize: 13, fill: '#1e3a5f', charSpacing: 200 },
      { type: 'textbox', left: 660, top: 720, width: 1000, text: 'B.F.A. in Graphic Design', fontFamily: 'Inter', fontSize: 22, fontWeight: 'bold', fill: '#1e293b' },
      { type: 'textbox', left: 660, top: 755, width: 1000, text: 'School of Visual Arts \u00b7 2016\u20132020', fontFamily: 'Inter', fontSize: 15, fill: '#64748b' },
    ]),

  tpl('resume-creative', 'Creative Resume', 'Colorful resume with accent sidebar',
    'Print', 'Resume', ['resume', 'cv', 'creative', 'colorful'],
    1748, 2480, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 1748, height: 200, fill: '#7c3aed' },
      { type: 'textbox', left: 100, top: 50, width: 1000, text: 'MAYA CHEN', fontFamily: 'Montserrat', fontSize: 56, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 100, top: 130, width: 1000, text: 'Graphic Designer & Illustrator', fontFamily: 'Montserrat', fontSize: 22, fill: '#e9d5ff' },
      { type: 'rect', left: 100, top: 260, width: 60, height: 4, fill: '#7c3aed' },
      { type: 'textbox', left: 100, top: 290, width: 700, text: 'Creative designer with 5+ years of experience in branding, illustration, and digital design. Passionate about creating visual stories that connect with audiences.', fontFamily: 'Inter', fontSize: 17, fill: '#475569', lineHeight: 1.6 },
      { type: 'textbox', left: 100, top: 450, width: 700, text: 'EXPERIENCE', fontFamily: 'Inter', fontSize: 13, fill: '#7c3aed', charSpacing: 200 },
      { type: 'textbox', left: 100, top: 490, width: 700, text: 'Senior Designer \u2014 Creative Agency (2022\u2013Present)\nLead Designer \u2014 BrandStudio (2019\u20132022)\nJunior Designer \u2014 DesignCo (2017\u20132019)', fontFamily: 'Inter', fontSize: 17, fill: '#334155', lineHeight: 2.0 },
      { type: 'textbox', left: 1000, top: 260, width: 650, text: 'CONTACT', fontFamily: 'Inter', fontSize: 13, fill: '#7c3aed', charSpacing: 200 },
      { type: 'textbox', left: 1000, top: 295, width: 650, text: 'maya@design.co\n+1 (555) 234-5678\nPortfolio: maya.design', fontFamily: 'Inter', fontSize: 16, fill: '#64748b', lineHeight: 1.8 },
      { type: 'textbox', left: 1000, top: 450, width: 650, text: 'SKILLS', fontFamily: 'Inter', fontSize: 13, fill: '#7c3aed', charSpacing: 200 },
      { type: 'textbox', left: 1000, top: 490, width: 650, text: 'Adobe Creative Suite\nFigma & Sketch\nIllustration\nBrand Identity\nMotion Graphics', fontFamily: 'Inter', fontSize: 16, fill: '#64748b', lineHeight: 1.8 },
    ]),

  tpl('resume-minimal', 'Minimal Resume', 'Simple and clean minimal resume',
    'Print', 'Resume', ['resume', 'cv', 'minimal', 'simple'],
    1748, 2480, 'solid', '#ffffff', [
      { type: 'textbox', left: 100, top: 100, width: 1548, text: 'Sam Rivera', fontFamily: 'Playfair Display', fontSize: 60, fill: '#111827' },
      { type: 'textbox', left: 100, top: 185, width: 1548, text: 'Software Engineer', fontFamily: 'Inter', fontSize: 20, fill: '#6b7280' },
      { type: 'rect', left: 100, top: 240, width: 1548, height: 1, fill: '#d1d5db' },
      { type: 'textbox', left: 100, top: 280, width: 1548, text: 'sam@email.com  \u00b7  +1 (555) 345-6789  \u00b7  github.com/sam  \u00b7  San Francisco, CA', fontFamily: 'Inter', fontSize: 15, fill: '#9ca3af' },
      { type: 'textbox', left: 100, top: 360, width: 1548, text: 'Experience', fontFamily: 'Playfair Display', fontSize: 28, fill: '#111827' },
      { type: 'textbox', left: 100, top: 410, width: 1548, text: 'Staff Engineer \u2014 BigTech (2022\u2013Present)\nSenior Engineer \u2014 Startup (2019\u20132022)\nEngineer \u2014 Agency (2016\u20132019)', fontFamily: 'Inter', fontSize: 17, fill: '#374151', lineHeight: 2.0 },
      { type: 'rect', left: 100, top: 580, width: 1548, height: 1, fill: '#e5e7eb' },
      { type: 'textbox', left: 100, top: 620, width: 1548, text: 'Education', fontFamily: 'Playfair Display', fontSize: 28, fill: '#111827' },
      { type: 'textbox', left: 100, top: 670, width: 1548, text: 'B.S. Computer Science \u2014 MIT (2012\u20132016)', fontFamily: 'Inter', fontSize: 17, fill: '#374151' },
    ]),

  // ─── INFOGRAPHICS (3) — 1080×1920 ──────────────────────────────

  tpl('infographic-stats', 'Stats Infographic', 'Bold statistics infographic with big numbers',
    'Social Media', 'Infographic', ['infographic', 'stats', 'data', 'numbers'],
    1080, 1920, 'solid', '#0f172a', [
      { type: 'textbox', left: 100, top: 80, width: 880, text: 'BY THE\nNUMBERS', fontFamily: 'Inter', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.1 },
      { type: 'rect', left: 100, top: 260, width: 60, height: 4, fill: '#3b82f6' },
      { type: 'textbox', left: 100, top: 300, width: 880, text: '2026 Industry Report', fontFamily: 'Inter', fontSize: 20, fill: '#64748b' },
      { type: 'rect', left: 100, top: 400, width: 380, height: 200, fill: '#1e293b', rx: 16, ry: 16 },
      { type: 'textbox', left: 130, top: 430, width: 320, text: '87%', fontFamily: 'Inter', fontSize: 64, fontWeight: 'bold', fill: '#3b82f6' },
      { type: 'textbox', left: 130, top: 520, width: 320, text: 'Growth Rate', fontFamily: 'Inter', fontSize: 18, fill: '#94a3b8' },
      { type: 'rect', left: 600, top: 400, width: 380, height: 200, fill: '#1e293b', rx: 16, ry: 16 },
      { type: 'textbox', left: 630, top: 430, width: 320, text: '2.4M', fontFamily: 'Inter', fontSize: 64, fontWeight: 'bold', fill: '#10b981' },
      { type: 'textbox', left: 630, top: 520, width: 320, text: 'Active Users', fontFamily: 'Inter', fontSize: 18, fill: '#94a3b8' },
      { type: 'rect', left: 100, top: 650, width: 380, height: 200, fill: '#1e293b', rx: 16, ry: 16 },
      { type: 'textbox', left: 130, top: 680, width: 320, text: '$42B', fontFamily: 'Inter', fontSize: 64, fontWeight: 'bold', fill: '#f59e0b' },
      { type: 'textbox', left: 130, top: 770, width: 320, text: 'Market Size', fontFamily: 'Inter', fontSize: 18, fill: '#94a3b8' },
      { type: 'rect', left: 600, top: 650, width: 380, height: 200, fill: '#1e293b', rx: 16, ry: 16 },
      { type: 'textbox', left: 630, top: 680, width: 320, text: '150+', fontFamily: 'Inter', fontSize: 64, fontWeight: 'bold', fill: '#ec4899' },
      { type: 'textbox', left: 630, top: 770, width: 320, text: 'Countries', fontFamily: 'Inter', fontSize: 18, fill: '#94a3b8' },
    ]),

  tpl('infographic-steps', 'Process Steps', 'Step-by-step process infographic',
    'Social Media', 'Infographic', ['infographic', 'process', 'steps', 'how-to'],
    1080, 1920, 'gradient', 'linear:to-bottom:#1e293b:#0f172a', [
      { type: 'textbox', left: 100, top: 80, width: 880, text: 'HOW IT WORKS', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 160, width: 880, text: 'A simple 4-step process', fontFamily: 'Inter', fontSize: 20, fill: '#64748b', textAlign: 'center' },
      { type: 'circle', left: 100, top: 320, radius: 35, fill: '#3b82f6' },
      { type: 'textbox', left: 112, top: 332, width: 48, text: '1', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 200, top: 320, width: 780, text: 'Sign Up', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 200, top: 365, width: 780, text: 'Create your free account in just 30 seconds', fontFamily: 'Inter', fontSize: 18, fill: '#94a3b8' },
      { type: 'circle', left: 100, top: 500, radius: 35, fill: '#8b5cf6' },
      { type: 'textbox', left: 112, top: 512, width: 48, text: '2', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 200, top: 500, width: 780, text: 'Choose a Template', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 200, top: 545, width: 780, text: 'Browse 50+ professional templates for any occasion', fontFamily: 'Inter', fontSize: 18, fill: '#94a3b8' },
      { type: 'circle', left: 100, top: 680, radius: 35, fill: '#ec4899' },
      { type: 'textbox', left: 112, top: 692, width: 48, text: '3', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 200, top: 680, width: 780, text: 'Customize', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 200, top: 725, width: 780, text: 'Add your text, images, and brand colors', fontFamily: 'Inter', fontSize: 18, fill: '#94a3b8' },
      { type: 'circle', left: 100, top: 860, radius: 35, fill: '#10b981' },
      { type: 'textbox', left: 112, top: 872, width: 48, text: '4', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 200, top: 860, width: 780, text: 'Export & Share', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 200, top: 905, width: 780, text: 'Download as PNG, JPG, or PDF and share anywhere', fontFamily: 'Inter', fontSize: 18, fill: '#94a3b8' },
    ]),

  tpl('infographic-comparison', 'Comparison', 'Side-by-side comparison infographic',
    'Social Media', 'Infographic', ['infographic', 'comparison', 'versus', 'vs'],
    1080, 1920, 'solid', '#ffffff', [
      { type: 'textbox', left: 100, top: 80, width: 880, text: 'FREE vs PRO', fontFamily: 'Inter', fontSize: 56, fontWeight: 'bold', fill: '#111827', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 165, width: 880, text: 'Choose the right plan for you', fontFamily: 'Inter', fontSize: 20, fill: '#6b7280', textAlign: 'center' },
      { type: 'rect', left: 60, top: 260, width: 460, height: 600, fill: '#f1f5f9', rx: 16, ry: 16 },
      { type: 'textbox', left: 80, top: 290, width: 420, text: 'FREE', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#374151', textAlign: 'center' },
      { type: 'textbox', left: 80, top: 340, width: 420, text: '$0', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#6b7280', textAlign: 'center' },
      { type: 'textbox', left: 80, top: 420, width: 420, text: '\u2713 5 templates\n\u2713 Basic export\n\u2713 1 brand kit\n\u2717 AI generation\n\u2717 Priority support', fontFamily: 'Inter', fontSize: 18, fill: '#475569', lineHeight: 2.0, textAlign: 'center' },
      { type: 'rect', left: 560, top: 260, width: 460, height: 600, fill: '#1e293b', rx: 16, ry: 16 },
      { type: 'textbox', left: 580, top: 290, width: 420, text: 'PRO', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 580, top: 340, width: 420, text: '$12/mo', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#3b82f6', textAlign: 'center' },
      { type: 'textbox', left: 580, top: 420, width: 420, text: '\u2713 50+ templates\n\u2713 All export formats\n\u2713 Unlimited brand kits\n\u2713 AI generation\n\u2713 Priority support', fontFamily: 'Inter', fontSize: 18, fill: '#e2e8f0', lineHeight: 2.0, textAlign: 'center' },
    ]),

  // ─── NEWSLETTER (2) — 1200×1600 ────────────────────────────────

  tpl('newsletter-company', 'Company Newsletter', 'Clean professional company newsletter',
    'Marketing', 'Newsletter', ['newsletter', 'email', 'company', 'professional'],
    1200, 1600, 'solid', '#ffffff', [
      { type: 'rect', left: 0, top: 0, width: 1200, height: 120, fill: '#1e40af' },
      { type: 'textbox', left: 60, top: 35, width: 600, text: 'ACME WEEKLY', fontFamily: 'Inter', fontSize: 36, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 700, top: 48, width: 440, text: 'Issue #42 \u00b7 April 2026', fontFamily: 'Inter', fontSize: 14, fill: '#93c5fd', textAlign: 'right' },
      { type: 'textbox', left: 60, top: 180, width: 1080, text: 'Big Product Update\nShipping This Week', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#111827', lineHeight: 1.2 },
      { type: 'rect', left: 60, top: 320, width: 60, height: 4, fill: '#1e40af' },
      { type: 'textbox', left: 60, top: 360, width: 1080, text: 'We\u2019re excited to announce a major update to our platform. This release includes the features you\u2019ve been asking for \u2014 faster performance, new integrations, and a completely redesigned dashboard.', fontFamily: 'Inter', fontSize: 18, fill: '#4b5563', lineHeight: 1.7 },
      { type: 'rect', left: 60, top: 530, width: 1080, height: 1, fill: '#e5e7eb' },
      { type: 'textbox', left: 60, top: 570, width: 1080, text: 'What\u2019s New', fontFamily: 'Inter', fontSize: 28, fontWeight: 'bold', fill: '#111827' },
      { type: 'textbox', left: 60, top: 620, width: 1080, text: '\u2022 Dashboard 2.0 with real-time analytics\n\u2022 Slack and Teams integrations\n\u2022 Custom workflows and automation\n\u2022 Advanced reporting and exports', fontFamily: 'Inter', fontSize: 17, fill: '#4b5563', lineHeight: 1.9 },
      { type: 'rect', left: 60, top: 820, width: 200, height: 48, fill: '#1e40af', rx: 8, ry: 8 },
      { type: 'textbox', left: 60, top: 832, width: 200, text: 'Read More', fontFamily: 'Inter', fontSize: 16, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  tpl('newsletter-personal', 'Personal Newsletter', 'Casual and colorful personal newsletter',
    'Marketing', 'Newsletter', ['newsletter', 'personal', 'blog', 'casual'],
    1200, 1600, 'solid', '#fef3c7', [
      { type: 'textbox', left: 100, top: 80, width: 1000, text: '\u2728 The Weekly Spark', fontFamily: 'Playfair Display', fontSize: 48, fill: '#92400e' },
      { type: 'textbox', left: 100, top: 160, width: 1000, text: 'Ideas, inspiration, and a little bit of magic', fontFamily: 'Lora', fontSize: 18, fill: '#b45309' },
      { type: 'rect', left: 100, top: 220, width: 1000, height: 1, fill: '#d97706', opacity: 0.3 },
      { type: 'textbox', left: 100, top: 280, width: 1000, text: 'This week I\u2019ve been thinking about creativity...', fontFamily: 'Lora', fontSize: 22, fill: '#78350f', lineHeight: 1.7 },
      { type: 'rect', left: 100, top: 400, width: 1000, height: 200, fill: '#fde68a', rx: 12, ry: 12 },
      { type: 'textbox', left: 140, top: 430, width: 920, text: '\u201cCreativity is intelligence having fun.\u201d', fontFamily: 'Playfair Display', fontSize: 28, fill: '#78350f', textAlign: 'center' },
      { type: 'textbox', left: 140, top: 520, width: 920, text: '\u2014 Albert Einstein', fontFamily: 'Inter', fontSize: 16, fill: '#92400e', textAlign: 'center' },
    ]),

  // ─── SOCIAL MEDIA STORIES — Modern (5) — 1080×1920 ─────────────

  tpl('story-product-launch', 'Product Launch', 'Bold product launch story',
    'Social Media', 'Story', ['story', 'product', 'launch', 'new'],
    1080, 1920, 'gradient', 'linear:to-bottom:#000000:#1e1b4b', [
      { type: 'textbox', left: 100, top: 200, width: 880, text: 'INTRODUCING', fontFamily: 'Inter', fontSize: 18, fill: '#818cf8', charSpacing: 400 },
      { type: 'textbox', left: 100, top: 300, width: 880, text: 'THE\nNEXT\nBIG\nTHING', fontFamily: 'Inter', fontSize: 120, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.0 },
      { type: 'rect', left: 100, top: 850, width: 60, height: 4, fill: '#818cf8' },
      { type: 'textbox', left: 100, top: 900, width: 880, text: 'Available Now', fontFamily: 'Inter', fontSize: 24, fill: '#a5b4fc' },
      { type: 'rect', left: 100, top: 1000, width: 300, height: 56, fill: '#6366f1', rx: 28, ry: 28 },
      { type: 'textbox', left: 100, top: 1014, width: 300, text: 'Shop Now', fontFamily: 'Inter', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  tpl('story-behind-scenes', 'Behind the Scenes', 'Casual behind-the-scenes story',
    'Social Media', 'Story', ['story', 'behind the scenes', 'bts', 'casual'],
    1080, 1920, 'solid', '#f97316', [
      { type: 'circle', left: 700, top: -100, radius: 300, fill: '#fb923c', opacity: 0.4 },
      { type: 'textbox', left: 80, top: 200, width: 920, text: 'BEHIND\nTHE\nSCENES', fontFamily: 'Anton', fontSize: 100, fill: '#ffffff', lineHeight: 1.0 },
      { type: 'rect', left: 80, top: 620, width: 920, height: 300, fill: 'rgba(0,0,0,0.2)', rx: 16, ry: 16 },
      { type: 'textbox', left: 120, top: 650, width: 840, text: 'A sneak peek at what we\u2019re working on...', fontFamily: 'Inter', fontSize: 24, fill: '#ffffff', lineHeight: 1.5 },
      { type: 'textbox', left: 80, top: 1000, width: 920, text: 'Swipe up to see more \u2191', fontFamily: 'Inter', fontSize: 18, fill: '#fed7aa', textAlign: 'center' },
    ]),

  tpl('story-sale', 'Sale Announcement', 'Eye-catching sale announcement story',
    'Social Media', 'Story', ['story', 'sale', 'discount', 'shopping'],
    1080, 1920, 'solid', '#dc2626', [
      { type: 'textbox', left: 100, top: 300, width: 880, text: 'MEGA', fontFamily: 'Anton', fontSize: 140, fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 470, width: 880, text: 'SALE', fontFamily: 'Anton', fontSize: 180, fill: '#fbbf24', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 700, width: 880, text: 'UP TO', fontFamily: 'Inter', fontSize: 24, fill: '#fecaca', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 750, width: 880, text: '70% OFF', fontFamily: 'Inter', fontSize: 80, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'rect', left: 300, top: 900, width: 480, height: 60, fill: '#ffffff', rx: 30, ry: 30 },
      { type: 'textbox', left: 300, top: 912, width: 480, text: 'SHOP NOW', fontFamily: 'Inter', fontSize: 24, fontWeight: 'bold', fill: '#dc2626', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 1020, width: 880, text: 'Limited time only \u00b7 Ends Sunday', fontFamily: 'Inter', fontSize: 16, fill: '#fecaca', textAlign: 'center' },
    ]),

  tpl('story-testimonial', 'Testimonial Story', 'Customer testimonial story layout',
    'Social Media', 'Story', ['story', 'testimonial', 'review', 'social proof'],
    1080, 1920, 'solid', '#faf5ff', [
      { type: 'textbox', left: 100, top: 200, width: 880, text: '\u2605\u2605\u2605\u2605\u2605', fontFamily: 'Inter', fontSize: 36, fill: '#eab308', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 300, width: 880, text: '\u201cThis completely changed how I work. I can\u2019t imagine going back to the old way.\u201d', fontFamily: 'Playfair Display', fontSize: 36, fill: '#1e1b4b', textAlign: 'center', lineHeight: 1.5 },
      { type: 'rect', left: 440, top: 580, width: 200, height: 2, fill: '#c084fc' },
      { type: 'circle', left: 460, top: 640, radius: 40, fill: '#e9d5ff' },
      { type: 'textbox', left: 100, top: 740, width: 880, text: 'Sarah Martinez', fontFamily: 'Inter', fontSize: 22, fontWeight: 'bold', fill: '#1e1b4b', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 775, width: 880, text: 'CEO, TechStartup', fontFamily: 'Inter', fontSize: 16, fill: '#7c3aed', textAlign: 'center' },
    ]),

  tpl('story-coming-soon', 'Coming Soon', 'Minimal coming soon teaser story',
    'Social Media', 'Story', ['story', 'coming soon', 'teaser', 'launch'],
    1080, 1920, 'solid', '#000000', [
      { type: 'textbox', left: 100, top: 600, width: 880, text: 'SOMETHING', fontFamily: 'Inter', fontSize: 20, fill: '#525252', textAlign: 'center', charSpacing: 500 },
      { type: 'textbox', left: 100, top: 680, width: 880, text: 'BIG', fontFamily: 'Inter', fontSize: 140, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 860, width: 880, text: 'IS COMING', fontFamily: 'Inter', fontSize: 20, fill: '#525252', textAlign: 'center', charSpacing: 500 },
      { type: 'rect', left: 440, top: 960, width: 200, height: 2, fill: '#404040' },
      { type: 'textbox', left: 100, top: 1020, width: 880, text: '04.15.2026', fontFamily: 'Inter', fontSize: 28, fill: '#737373', textAlign: 'center', charSpacing: 200 },
    ]),

  // ─── MOTIVATIONAL QUOTES (3) — 1080×1080 ──────────────────────

  tpl('quote-sunrise', 'Sunrise Quote', 'Warm inspirational quote with sunrise colors',
    'Social Media', 'Quote', ['quote', 'motivational', 'inspiration', 'warm'],
    1080, 1080, 'gradient', 'linear:to-bottom:#fbbf24:#f97316', [
      { type: 'textbox', left: 100, top: 250, width: 880, text: '\u201cThe only way\nto do great work\nis to love what\nyou do.\u201d', fontFamily: 'Playfair Display', fontSize: 56, fill: '#ffffff', textAlign: 'center', lineHeight: 1.3 },
      { type: 'rect', left: 440, top: 700, width: 200, height: 3, fill: 'rgba(255,255,255,0.5)' },
      { type: 'textbox', left: 100, top: 740, width: 880, text: 'Steve Jobs', fontFamily: 'Inter', fontSize: 20, fill: 'rgba(255,255,255,0.8)', textAlign: 'center' },
    ]),

  tpl('quote-bold-modern', 'Bold Modern Quote', 'Bold modern motivational quote',
    'Social Media', 'Quote', ['quote', 'motivational', 'bold', 'modern'],
    1080, 1080, 'solid', '#111827', [
      { type: 'rect', left: 80, top: 80, width: 920, height: 920, fill: 'rgba(0,0,0,0)', stroke: '#374151', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 140, top: 200, width: 800, text: 'DREAM\nBIG.', fontFamily: 'Inter', fontSize: 120, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.0 },
      { type: 'textbox', left: 140, top: 500, width: 800, text: 'START\nSMALL.', fontFamily: 'Inter', fontSize: 120, fontWeight: 'bold', fill: '#3b82f6', lineHeight: 1.0 },
      { type: 'textbox', left: 140, top: 800, width: 800, text: 'ACT NOW.', fontFamily: 'Inter', fontSize: 48, fill: '#6b7280' },
    ]),

  tpl('quote-elegant', 'Elegant Quote', 'Minimal elegant quote with serif font',
    'Social Media', 'Quote', ['quote', 'motivational', 'elegant', 'minimal'],
    1080, 1080, 'solid', '#fefce8', [
      { type: 'textbox', left: 100, top: 100, width: 200, text: '\u201c', fontFamily: 'Playfair Display', fontSize: 200, fill: '#d4a574', opacity: 0.3 },
      { type: 'textbox', left: 140, top: 300, width: 800, text: 'Be yourself;\neveryone else is\nalready taken.', fontFamily: 'Playfair Display', fontSize: 52, fill: '#44403c', lineHeight: 1.4 },
      { type: 'rect', left: 140, top: 660, width: 80, height: 3, fill: '#d4a574' },
      { type: 'textbox', left: 140, top: 700, width: 800, text: 'Oscar Wilde', fontFamily: 'Inter', fontSize: 18, fill: '#a8a29e' },
    ]),

  // ─── PRODUCT SHOWCASES (3) — 1080×1080 ─────────────────────────

  tpl('product-new-arrival', 'New Arrival', 'Clean new product arrival announcement',
    'Social Media', 'Product', ['product', 'new arrival', 'ecommerce', 'shop'],
    1080, 1080, 'solid', '#f8fafc', [
      { type: 'textbox', left: 100, top: 60, width: 880, text: 'NEW ARRIVAL', fontFamily: 'Inter', fontSize: 14, fill: '#64748b', charSpacing: 400 },
      { type: 'rect', left: 200, top: 150, width: 680, height: 500, fill: '#e2e8f0', rx: 16, ry: 16 },
      { type: 'textbox', left: 200, top: 350, width: 680, text: 'Product Image', fontFamily: 'Inter', fontSize: 20, fill: '#94a3b8', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 720, width: 880, text: 'The Perfect\nEveryday Bag', fontFamily: 'Playfair Display', fontSize: 48, fill: '#0f172a', textAlign: 'center', lineHeight: 1.2 },
      { type: 'textbox', left: 100, top: 860, width: 880, text: '$89.00', fontFamily: 'Inter', fontSize: 32, fontWeight: 'bold', fill: '#0f172a', textAlign: 'center' },
      { type: 'rect', left: 340, top: 930, width: 400, height: 56, fill: '#0f172a', rx: 28, ry: 28 },
      { type: 'textbox', left: 340, top: 944, width: 400, text: 'Shop Now', fontFamily: 'Inter', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
    ]),

  tpl('product-featured', 'Featured Product', 'Bold featured product with dark background',
    'Social Media', 'Product', ['product', 'featured', 'showcase', 'dark'],
    1080, 1080, 'solid', '#18181b', [
      { type: 'rect', left: 60, top: 60, width: 960, height: 960, fill: 'rgba(0,0,0,0)', stroke: '#3f3f46', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 100, top: 100, width: 300, text: 'FEATURED', fontFamily: 'Inter', fontSize: 12, fill: '#a1a1aa', charSpacing: 300 },
      { type: 'rect', left: 250, top: 200, width: 580, height: 400, fill: '#27272a', rx: 12, ry: 12 },
      { type: 'textbox', left: 100, top: 680, width: 880, text: 'Premium\nWireless Headphones', fontFamily: 'Inter', fontSize: 44, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.2 },
      { type: 'textbox', left: 100, top: 820, width: 400, text: 'From $299', fontFamily: 'Inter', fontSize: 24, fill: '#a1a1aa' },
      { type: 'textbox', left: 600, top: 820, width: 360, text: 'Learn More \u2192', fontFamily: 'Inter', fontSize: 18, fill: '#3b82f6', textAlign: 'right' },
    ]),

  tpl('product-comparison', 'Product Comparison', 'Side-by-side product comparison',
    'Social Media', 'Product', ['product', 'comparison', 'versus', 'ecommerce'],
    1080, 1080, 'solid', '#f1f5f9', [
      { type: 'textbox', left: 100, top: 60, width: 880, text: 'WHICH ONE IS RIGHT FOR YOU?', fontFamily: 'Inter', fontSize: 16, fill: '#64748b', textAlign: 'center', charSpacing: 150 },
      { type: 'rect', left: 60, top: 150, width: 460, height: 800, fill: '#ffffff', rx: 16, ry: 16 },
      { type: 'textbox', left: 80, top: 180, width: 420, text: 'BASIC', fontFamily: 'Inter', fontSize: 18, fontWeight: 'bold', fill: '#475569', textAlign: 'center' },
      { type: 'textbox', left: 80, top: 230, width: 420, text: '$49', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#0f172a', textAlign: 'center' },
      { type: 'textbox', left: 80, top: 320, width: 420, text: '\u2713 Core features\n\u2713 Email support\n\u2713 1 user\n\u2717 Analytics\n\u2717 API access', fontFamily: 'Inter', fontSize: 16, fill: '#64748b', textAlign: 'center', lineHeight: 2.0 },
      { type: 'rect', left: 560, top: 150, width: 460, height: 800, fill: '#1e293b', rx: 16, ry: 16 },
      { type: 'rect', left: 660, top: 130, width: 260, height: 28, fill: '#3b82f6', rx: 14, ry: 14 },
      { type: 'textbox', left: 660, top: 133, width: 260, text: 'MOST POPULAR', fontFamily: 'Inter', fontSize: 11, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 580, top: 180, width: 420, text: 'PRO', fontFamily: 'Inter', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 580, top: 230, width: 420, text: '$99', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#3b82f6', textAlign: 'center' },
      { type: 'textbox', left: 580, top: 320, width: 420, text: '\u2713 All features\n\u2713 Priority support\n\u2713 5 users\n\u2713 Analytics\n\u2713 API access', fontFamily: 'Inter', fontSize: 16, fill: '#e2e8f0', textAlign: 'center', lineHeight: 2.0 },
    ]),

  // ─── SALE / DISCOUNT (3) — 1080×1080 ───────────────────────────

  tpl('sale-flash', 'Flash Sale', 'Urgent flash sale with bold red',
    'Marketing', 'Sale', ['sale', 'flash', 'discount', 'urgent'],
    1080, 1080, 'solid', '#dc2626', [
      { type: 'textbox', left: 100, top: 100, width: 880, text: '\u26a1 FLASH SALE \u26a1', fontFamily: 'Inter', fontSize: 24, fill: '#fecaca', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 250, width: 880, text: '50%\nOFF', fontFamily: 'Anton', fontSize: 180, fill: '#ffffff', textAlign: 'center', lineHeight: 0.9 },
      { type: 'textbox', left: 100, top: 650, width: 880, text: 'EVERYTHING', fontFamily: 'Inter', fontSize: 48, fontWeight: 'bold', fill: '#fbbf24', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 740, width: 880, text: 'Today only \u00b7 Use code FLASH50', fontFamily: 'Inter', fontSize: 20, fill: '#fecaca', textAlign: 'center' },
      { type: 'rect', left: 300, top: 830, width: 480, height: 60, fill: '#ffffff', rx: 30, ry: 30 },
      { type: 'textbox', left: 300, top: 842, width: 480, text: 'SHOP THE SALE', fontFamily: 'Inter', fontSize: 22, fontWeight: 'bold', fill: '#dc2626', textAlign: 'center' },
    ]),

  tpl('sale-seasonal', 'Seasonal Discount', 'Seasonal discount with gradient background',
    'Marketing', 'Sale', ['sale', 'seasonal', 'discount', 'summer'],
    1080, 1080, 'gradient', 'linear:to-bottom-right:#06b6d4:#3b82f6', [
      { type: 'circle', left: 750, top: -50, radius: 200, fill: 'rgba(255,255,255,0.1)' },
      { type: 'circle', left: -100, top: 700, radius: 250, fill: 'rgba(255,255,255,0.08)' },
      { type: 'textbox', left: 100, top: 150, width: 880, text: 'SUMMER\nCOLLECTION', fontFamily: 'Inter', fontSize: 80, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.1 },
      { type: 'rect', left: 100, top: 380, width: 60, height: 4, fill: '#ffffff' },
      { type: 'textbox', left: 100, top: 430, width: 880, text: 'Save 30% on all summer styles.\nFree shipping on orders over $50.', fontFamily: 'Inter', fontSize: 24, fill: 'rgba(255,255,255,0.85)', lineHeight: 1.5 },
      { type: 'rect', left: 100, top: 600, width: 280, height: 56, fill: '#ffffff', rx: 28, ry: 28 },
      { type: 'textbox', left: 100, top: 614, width: 280, text: 'Shop Now', fontFamily: 'Inter', fontSize: 18, fontWeight: 'bold', fill: '#0284c7', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 720, width: 880, text: 'Code: SUMMER30', fontFamily: 'Inter', fontSize: 16, fill: 'rgba(255,255,255,0.6)' },
    ]),

  tpl('sale-clearance', 'Clearance Sale', 'Bold clearance sale with yellow/black',
    'Marketing', 'Sale', ['sale', 'clearance', 'discount', 'bold'],
    1080, 1080, 'solid', '#fbbf24', [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 60, fill: '#000000' },
      { type: 'textbox', left: 0, top: 12, width: 1080, text: '\u2605 CLEARANCE EVENT \u2605', fontFamily: 'Inter', fontSize: 18, fontWeight: 'bold', fill: '#fbbf24', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 200, width: 880, text: 'UP TO', fontFamily: 'Inter', fontSize: 36, fill: '#000000', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 260, width: 880, text: '80%', fontFamily: 'Anton', fontSize: 220, fill: '#000000', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 520, width: 880, text: 'OFF', fontFamily: 'Anton', fontSize: 100, fill: '#000000', textAlign: 'center' },
      { type: 'rect', left: 200, top: 680, width: 680, height: 70, fill: '#000000', rx: 8, ry: 8 },
      { type: 'textbox', left: 200, top: 695, width: 680, text: 'WHILE SUPPLIES LAST', fontFamily: 'Inter', fontSize: 24, fontWeight: 'bold', fill: '#fbbf24', textAlign: 'center' },
      { type: 'rect', left: 0, top: 1020, width: 1080, height: 60, fill: '#000000' },
      { type: 'textbox', left: 0, top: 1032, width: 1080, text: 'In-store & online \u00b7 This weekend only', fontFamily: 'Inter', fontSize: 16, fill: '#fbbf24', textAlign: 'center' },
    ]),

  // ─── THANK YOU CARDS (2) — 1050×600 ────────────────────────────

  tpl('thankyou-elegant', 'Elegant Thank You', 'Elegant thank you card with gold accents',
    'Print', 'Thank You', ['thank you', 'card', 'elegant', 'gratitude'],
    1050, 600, 'solid', '#1a1a1a', [
      { type: 'rect', left: 40, top: 40, width: 970, height: 520, fill: 'rgba(0,0,0,0)', stroke: '#c9a96e', strokeWidth: 1, strokeUniform: true },
      { type: 'textbox', left: 100, top: 120, width: 850, text: 'Thank You', fontFamily: 'Playfair Display', fontSize: 64, fill: '#c9a96e', textAlign: 'center' },
      { type: 'rect', left: 425, top: 220, width: 200, height: 2, fill: '#c9a96e', opacity: 0.5 },
      { type: 'textbox', left: 100, top: 260, width: 850, text: 'Your kindness means the world to us.\nWe truly appreciate your generosity and support.', fontFamily: 'Lora', fontSize: 18, fill: '#a8a29e', textAlign: 'center', lineHeight: 1.8 },
      { type: 'textbox', left: 100, top: 420, width: 850, text: 'With gratitude, The Smith Family', fontFamily: 'Lora', fontSize: 16, fill: '#c9a96e', textAlign: 'center' },
    ]),

  // ─── BONUS TEMPLATES (3) ────────────────────────────────────────

  tpl('linkedin-post', 'LinkedIn Post', 'Professional LinkedIn post with insight',
    'Social Media', 'LinkedIn Post', ['linkedin', 'professional', 'post'],
    1200, 627, 'solid', '#0a66c2', [
      { type: 'textbox', left: 80, top: 60, width: 1040, text: 'DID YOU\nKNOW?', fontFamily: 'Inter', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.1 },
      { type: 'rect', left: 80, top: 240, width: 60, height: 4, fill: '#ffffff' },
      { type: 'textbox', left: 80, top: 280, width: 700, text: '73% of professionals say continuous\nlearning is essential for career growth.', fontFamily: 'Inter', fontSize: 24, fill: '#bfdbfe', lineHeight: 1.5 },
      { type: 'textbox', left: 80, top: 430, width: 700, text: 'What are you learning today?', fontFamily: 'Inter', fontSize: 20, fill: '#93c5fd' },
      { type: 'textbox', left: 80, top: 550, width: 400, text: '@YourName \u00b7 Follow for more insights', fontFamily: 'Inter', fontSize: 14, fill: '#60a5fa' },
    ]),

  tpl('twitter-header', 'Twitter/X Header', 'Clean personal brand Twitter header',
    'Social Media', 'Twitter Header', ['twitter', 'x', 'header', 'banner'],
    1500, 500, 'gradient', 'linear:to-right:#1e293b:#0f172a', [
      { type: 'textbox', left: 100, top: 100, width: 800, text: 'BUILDING THE FUTURE', fontFamily: 'Inter', fontSize: 56, fontWeight: 'bold', fill: '#ffffff' },
      { type: 'textbox', left: 100, top: 190, width: 800, text: 'Developer \u00b7 Designer \u00b7 Creator', fontFamily: 'Inter', fontSize: 22, fill: '#64748b' },
      { type: 'rect', left: 100, top: 260, width: 60, height: 4, fill: '#3b82f6' },
      { type: 'textbox', left: 100, top: 310, width: 600, text: 'Open to collaborations and new projects', fontFamily: 'Inter', fontSize: 16, fill: '#94a3b8' },
      { type: 'circle', left: 1200, top: 50, radius: 180, fill: '#3b82f6', opacity: 0.1 },
      { type: 'circle', left: 1250, top: 100, radius: 120, fill: '#8b5cf6', opacity: 0.08 },
    ]),

  tpl('poster-event', 'Event Poster', 'Bold event poster with large type',
    'Print', 'Poster', ['poster', 'event', 'concert', 'bold'],
    1800, 2400, 'solid', '#0f0f0f', [
      { type: 'textbox', left: 120, top: 200, width: 1560, text: 'SUMMER\nFEST', fontFamily: 'Anton', fontSize: 240, fill: '#ffffff', lineHeight: 0.95 },
      { type: 'textbox', left: 120, top: 740, width: 1560, text: '2026', fontFamily: 'Anton', fontSize: 200, fill: '#ef4444' },
      { type: 'rect', left: 120, top: 1000, width: 100, height: 4, fill: '#ef4444' },
      { type: 'textbox', left: 120, top: 1060, width: 1560, text: 'LIVE MUSIC \u00b7 FOOD \u00b7 ART\nJULY 15\u201317 \u00b7 CENTRAL PARK', fontFamily: 'Inter', fontSize: 40, fill: '#a3a3a3', lineHeight: 1.6 },
      { type: 'textbox', left: 120, top: 1260, width: 1560, text: 'FEATURING', fontFamily: 'Inter', fontSize: 16, fill: '#525252', charSpacing: 400 },
      { type: 'textbox', left: 120, top: 1310, width: 1560, text: 'The Midnight Hour \u00b7 Solar Waves\nNeon Dreams \u00b7 Crystal Echo\nThe Low Tides \u00b7 Purple Haze', fontFamily: 'Inter', fontSize: 32, fill: '#d4d4d4', lineHeight: 1.6 },
      { type: 'rect', left: 120, top: 1600, width: 400, height: 70, fill: '#ef4444', rx: 8, ry: 8 },
      { type: 'textbox', left: 120, top: 1618, width: 400, text: 'Get Tickets', fontFamily: 'Inter', fontSize: 24, fontWeight: 'bold', fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 120, top: 1750, width: 1560, text: 'summerfest2026.com', fontFamily: 'Inter', fontSize: 18, fill: '#525252' },
    ]),

  tpl('thankyou-fun', 'Fun Thank You', 'Colorful fun thank you card',
    'Print', 'Thank You', ['thank you', 'card', 'fun', 'colorful'],
    1050, 600, 'solid', '#7c3aed', [
      { type: 'circle', left: -40, top: -40, radius: 100, fill: '#a78bfa', opacity: 0.3 },
      { type: 'circle', left: 850, top: 400, radius: 120, fill: '#fbbf24', opacity: 0.2 },
      { type: 'textbox', left: 100, top: 80, width: 850, text: 'THANK', fontFamily: 'Anton', fontSize: 100, fill: '#ffffff', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 190, width: 850, text: 'YOU!', fontFamily: 'Anton', fontSize: 100, fill: '#fbbf24', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 340, width: 850, text: 'You\u2019re the best! We couldn\u2019t have done it without you.', fontFamily: 'Poppins', fontSize: 18, fill: '#e9d5ff', textAlign: 'center' },
      { type: 'textbox', left: 100, top: 440, width: 850, text: '\u2764\ufe0f', fontFamily: 'Inter', fontSize: 40, textAlign: 'center' },
    ]),
];

/** Get all unique template categories */
export function getTemplateCategories(): string[] {
  const categories = new Set(TEMPLATE_REGISTRY.map((t) => t.category));
  return Array.from(categories);
}

/** Get templates filtered by category */
export function getTemplatesByCategory(category: string): Template[] {
  return TEMPLATE_REGISTRY.filter((t) => t.category === category);
}
