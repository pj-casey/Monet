/**
 * Curved Text — renders text along a circular arc using opentype.js.
 *
 * Loads the font file from Google Fonts, extracts glyph outlines,
 * positions each glyph along an arc using trigonometry, and produces
 * a single SVG path string that can be used as a fabric.Path.
 *
 * The resulting Path carries custom metadata (__curvedText) so it can
 * be re-edited: changing the text, arc angle, radius, or font regenerates
 * the path while preserving position and other properties.
 */

import { Canvas as FabricCanvas, Path, type FabricObject } from 'fabric';

// Lazy-load opentype.js (~47KB) — only downloaded when curved text is first used
let _opentype: any = null;
async function getOpentype() {
  if (!_opentype) {
    // @ts-ignore — opentype.js has no bundled types
    const mod = await import('opentype.js');
    _opentype = mod.default ?? mod;
  }
  return _opentype;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Types                                                              */
/* ═══════════════════════════════════════════════════════════════════ */

export interface CurvedTextOptions {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  arc: number;         // degrees of arc (-360 to 360)
  radius: number;      // radius in pixels
  fill: string;
}

export interface CurvedTextMeta {
  __curvedText: true;
  __ctText: string;
  __ctFontFamily: string;
  __ctFontSize: number;
  __ctFontWeight: 'normal' | 'bold';
  __ctArc: number;
  __ctRadius: number;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Font cache                                                         */
/* ═══════════════════════════════════════════════════════════════════ */

const fontCache = new Map<string, any>();
const loadingPromises = new Map<string, Promise<any>>();

/**
 * Construct Google Fonts URL for a given family and weight.
 * Google Fonts serves TTF/WOFF based on User-Agent — we request TTF.
 */
function getGoogleFontUrl(family: string, weight: 'normal' | 'bold'): string {
  const wght = weight === 'bold' ? '700' : '400';
  const encoded = encodeURIComponent(family);
  // Use the direct CSS2 API — we'll fetch the CSS, then extract the .woff2/.ttf URL
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${wght}&display=swap`;
}

/**
 * Load a font via opentype.js. Returns cached font if already loaded.
 * Falls back to null on error (caller should handle fallback).
 */
async function loadFont(family: string, weight: 'normal' | 'bold'): Promise<any> {
  const cacheKey = `${family}:${weight}`;

  // Return cached
  const cached = fontCache.get(cacheKey);
  if (cached) return cached;

  // Return in-flight promise if already loading
  const existing = loadingPromises.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    try {
      // Fetch Google Fonts CSS to find the actual font file URL
      const cssUrl = getGoogleFontUrl(family, weight);
      const cssResp = await fetch(cssUrl, {
        headers: {
          // Request woff2 format (smallest, widely supported)
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      if (!cssResp.ok) throw new Error(`Failed to fetch font CSS: ${cssResp.status}`);

      const css = await cssResp.text();

      // Extract the font file URL from the CSS (looks for url(...) with .woff2 or .ttf)
      const urlMatch = css.match(/url\(([^)]+\.(?:woff2?|ttf|otf))\)/);
      if (!urlMatch) throw new Error(`No font URL found in CSS for ${family}`);

      const fontUrl = urlMatch[1].replace(/['"]/g, '');

      // Load via opentype.js (lazy-loaded)
      const ot = await getOpentype();
      const font = await ot.load(fontUrl);
      fontCache.set(cacheKey, font);
      return font;
    } catch (err) {
      console.warn(`[curved-text] Failed to load font "${family}" (${weight}):`, err);
      return null;
    } finally {
      loadingPromises.delete(cacheKey);
    }
  })();

  loadingPromises.set(cacheKey, promise);
  return promise;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Core: generate curved text SVG path                                */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Generate an SVG path string for text arranged along a circular arc.
 *
 * Each character's glyph outline is positioned and rotated to follow
 * the arc at the specified radius.
 *
 * @param font - opentype.js Font object
 * @param text - the text to render
 * @param fontSize - font size in pixels
 * @param arcDeg - arc angle in degrees (positive = top curve, negative = bottom)
 * @param radius - radius of the circle in pixels
 * @returns SVG path data string
 */
function generateCurvedPathData(
  font: any,
  text: string,
  fontSize: number,
  arcDeg: number,
  radius: number,
): string {
  if (!text.trim()) return '';

  const scale = fontSize / font.unitsPerEm;
  const arcRad = (arcDeg * Math.PI) / 180;

  // Calculate total text width to center it on the arc
  let totalWidth = 0;
  const glyphs = font.stringToGlyphs(text);
  const advances: number[] = [];
  for (const glyph of glyphs) {
    const advance = (glyph.advanceWidth ?? 0) * scale;
    advances.push(advance);
    totalWidth += advance;
  }

  // Arc length = radius * arcRad — map total text width to this
  // If arc is 0 (straight), default to 180 degrees
  const effectiveArc = arcRad === 0 ? Math.PI : arcRad;
  const anglePerPixel = effectiveArc / (totalWidth || 1);

  // Start angle — center the text on the arc
  const startAngle = -effectiveArc / 2 - Math.PI / 2;

  // Center of the arc
  const cx = 0;
  const cy = 0;

  // Build combined path by accumulating SVG path commands as strings
  const pathParts: string[] = [];
  let currentAngle = startAngle;

  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    const advance = advances[i];

    // Angle at the center of this glyph
    const glyphAngle = currentAngle + (advance * anglePerPixel) / 2;

    // Position on the arc
    const x = cx + radius * Math.cos(glyphAngle);
    const y = cy + radius * Math.sin(glyphAngle);

    // Get glyph path at origin
    const glyphPath = glyph.getPath(0, 0, fontSize);

    // Transform each command: rotate by glyphAngle + 90° (tangent) and translate
    const rotAngle = glyphAngle + Math.PI / 2;
    const cosA = Math.cos(rotAngle);
    const sinA = Math.sin(rotAngle);

    // Helper to transform a point
    const tx = (px: number, py: number) => (px * cosA - py * sinA + x).toFixed(2);
    const ty = (px: number, py: number) => (px * sinA + py * cosA + y).toFixed(2);

    for (const cmd of glyphPath.commands) {
      switch (cmd.type) {
        case 'M':
          pathParts.push(`M${tx(cmd.x, cmd.y)} ${ty(cmd.x, cmd.y)}`);
          break;
        case 'L':
          pathParts.push(`L${tx(cmd.x, cmd.y)} ${ty(cmd.x, cmd.y)}`);
          break;
        case 'Q':
          pathParts.push(`Q${tx(cmd.x1, cmd.y1)} ${ty(cmd.x1, cmd.y1)} ${tx(cmd.x, cmd.y)} ${ty(cmd.x, cmd.y)}`);
          break;
        case 'C':
          pathParts.push(`C${tx(cmd.x1, cmd.y1)} ${ty(cmd.x1, cmd.y1)} ${tx(cmd.x2, cmd.y2)} ${ty(cmd.x2, cmd.y2)} ${tx(cmd.x, cmd.y)} ${ty(cmd.x, cmd.y)}`);
          break;
        case 'Z':
          pathParts.push('Z');
          break;
      }
    }

    currentAngle += advance * anglePerPixel;
  }

  return pathParts.join(' ');
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Public API                                                         */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Create a curved text Path object on the canvas.
 * Replaces the selected textbox with a Path that follows a circular arc.
 */
export async function createCurvedText(
  canvas: FabricCanvas,
  options: CurvedTextOptions,
  replaceObject?: FabricObject,
): Promise<FabricObject | null> {
  const font = await loadFont(options.fontFamily, options.fontWeight);
  if (!font) {
    console.warn('[curved-text] Font not available, skipping curve');
    return null;
  }

  const pathData = generateCurvedPathData(
    font,
    options.text,
    options.fontSize,
    options.arc,
    options.radius,
  );

  if (!pathData) return null;

  // Create fabric.Path
  const path = new Path(pathData, {
    fill: options.fill,
    stroke: 'transparent',
    strokeWidth: 0,
    selectable: true,
    evented: true,
  });

  // Store curve metadata for re-editing
  const meta: CurvedTextMeta = {
    __curvedText: true,
    __ctText: options.text,
    __ctFontFamily: options.fontFamily,
    __ctFontSize: options.fontSize,
    __ctFontWeight: options.fontWeight,
    __ctArc: options.arc,
    __ctRadius: options.radius,
  };
  Object.assign(path, meta);

  // If replacing an existing object, copy its position
  if (replaceObject) {
    const bounds = replaceObject.getBoundingRect();
    path.left = bounds.left + bounds.width / 2 - (path.width ?? 0) / 2;
    path.top = bounds.top + bounds.height / 2 - (path.height ?? 0) / 2;
    canvas.remove(replaceObject);
  } else {
    // Center on canvas
    path.left = (canvas.width ?? 800) / 2 - (path.width ?? 0) / 2;
    path.top = (canvas.height ?? 600) / 2 - (path.height ?? 0) / 2;
  }

  canvas.add(path);
  canvas.setActiveObject(path);
  canvas.renderAll();

  return path;
}

/**
 * Update an existing curved text Path with new parameters.
 * Regenerates the path in-place preserving position.
 */
export async function updateCurvedText(
  canvas: FabricCanvas,
  existingPath: FabricObject,
  updates: Partial<CurvedTextOptions>,
): Promise<FabricObject | null> {
  const meta = existingPath as any as Partial<CurvedTextMeta>;
  if (!meta.__curvedText) return null;

  const options: CurvedTextOptions = {
    text: updates.text ?? meta.__ctText ?? '',
    fontFamily: updates.fontFamily ?? meta.__ctFontFamily ?? 'DM Sans',
    fontSize: updates.fontSize ?? meta.__ctFontSize ?? 32,
    fontWeight: updates.fontWeight ?? meta.__ctFontWeight ?? 'normal',
    arc: updates.arc ?? meta.__ctArc ?? 180,
    radius: updates.radius ?? meta.__ctRadius ?? 200,
    fill: updates.fill ?? (existingPath as any).fill ?? '#2d2a26',
  };

  return createCurvedText(canvas, options, existingPath);
}

/**
 * Check if a Fabric object is a curved text path.
 */
export function isCurvedText(obj: FabricObject): boolean {
  return !!(obj as any).__curvedText;
}

/**
 * Get curved text metadata from a path object.
 */
export function getCurvedTextMeta(obj: FabricObject): CurvedTextMeta | null {
  const meta = obj as any;
  if (!meta.__curvedText) return null;
  return {
    __curvedText: true,
    __ctText: meta.__ctText ?? '',
    __ctFontFamily: meta.__ctFontFamily ?? 'DM Sans',
    __ctFontSize: meta.__ctFontSize ?? 32,
    __ctFontWeight: meta.__ctFontWeight ?? 'normal',
    __ctArc: meta.__ctArc ?? 180,
    __ctRadius: meta.__ctRadius ?? 200,
  };
}
