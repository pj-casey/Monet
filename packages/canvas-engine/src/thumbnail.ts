/**
 * Thumbnail renderer — generates preview images for templates.
 *
 * Creates a temporary offscreen Fabric.js canvas, loads template objects
 * via the recipe constructor system, renders to PNG dataURL, then disposes.
 *
 * Key rendering steps:
 * 1. Preload Google Fonts used by templates (Montserrat, Playfair Display, etc.)
 * 2. Parse background gradient direction (to-bottom, to-bottom-right, etc.)
 * 3. Scale objects proportionally — text via fontSize+width, shapes via scaleX/scaleY
 * 4. Capture at 1.5x multiplier for retina-crisp thumbnails
 */

import { Canvas as FabricCanvas, Rect, Gradient, FabricObject as FabricObjectClass } from 'fabric';
import { createObjectsFromRecipes } from './template-loader';
import type { DesignDocument } from '@monet/shared';

// Ensure origin defaults match the main engine
FabricObjectClass.ownDefaults.originX = 'left';
FabricObjectClass.ownDefaults.originY = 'top';

// ─── Font preloading (singleton) ────────────────────────────────────

/** Fonts used across templates — Montserrat now preloaded in index.html */
const TEMPLATE_FONTS = ['Playfair Display', 'Inter'];

let _fontLoadPromise: Promise<void> | null = null;

/**
 * Ensure Google Fonts used by templates are loaded before rendering.
 * Injects CSS links, waits for font files, uses singleton promise to
 * avoid redundant work across concurrent calls.
 */
function ensureTemplateFonts(): Promise<void> {
  if (_fontLoadPromise) return _fontLoadPromise;
  _fontLoadPromise = (async () => {
    // Inject Google Fonts CSS for each template font (if not already present)
    const cssPromises: Promise<void>[] = [];
    for (const family of TEMPLATE_FONTS) {
      const id = `monet-tfont-${family.replace(/\s+/g, '-').toLowerCase()}`;
      if (document.getElementById(id)) continue;

      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap`;
      cssPromises.push(new Promise<void>(resolve => {
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Don't block on network error
      }));
      document.head.appendChild(link);
    }

    // Wait for CSS stylesheets to parse (so @font-face rules exist)
    if (cssPromises.length > 0) {
      await Promise.race([
        Promise.all(cssPromises),
        new Promise<void>(resolve => setTimeout(resolve, 1000)),
      ]);
    }

    // Trigger actual font file downloads and wait
    await Promise.race([
      Promise.allSettled(
        TEMPLATE_FONTS.flatMap(f => [
          document.fonts.load(`400 20px "${f}"`),
          document.fonts.load(`700 20px "${f}"`),
        ]),
      ),
      new Promise<void>(resolve => setTimeout(resolve, 1500)),
    ]);
  })();
  return _fontLoadPromise;
}

// ─── Background gradient direction ──────────────────────────────────

/**
 * Convert a template gradient direction string to Fabric.js gradient coords.
 * Template format: 'to-bottom', 'to-bottom-right', 'to-right', etc.
 */
function gradientCoords(
  direction: string,
  w: number,
  h: number,
): { x1: number; y1: number; x2: number; y2: number } {
  switch (direction) {
    case 'to-right':        return { x1: 0, y1: 0, x2: w, y2: 0 };
    case 'to-bottom-right': return { x1: 0, y1: 0, x2: w, y2: h };
    case 'to-bottom-left':  return { x1: w, y1: 0, x2: 0, y2: h };
    case 'to-top':          return { x1: 0, y1: h, x2: 0, y2: 0 };
    case 'to-left':         return { x1: w, y1: 0, x2: 0, y2: 0 };
    case 'to-bottom':
    default:                return { x1: 0, y1: 0, x2: 0, y2: h };
  }
}

// ─── Main renderer ──────────────────────────────────────────────────

/**
 * Render a template's DesignDocument to a data URL for thumbnail display.
 *
 * @param doc - The DesignDocument to render
 * @param targetWidth - The desired thumbnail width in pixels (height is proportional)
 * @returns JPEG data URL string, or empty string on failure
 */
export async function renderTemplateThumbnail(
  doc: DesignDocument,
  targetWidth: number = 800,
): Promise<string> {
  // Ensure template fonts are loaded (first call waits, subsequent calls instant)
  await ensureTemplateFonts();

  // Calculate proportional height
  const aspect = doc.dimensions.height / doc.dimensions.width;
  const targetHeight = Math.round(targetWidth * aspect);
  const scale = targetWidth / doc.dimensions.width;

  // Create a temporary <canvas> element (offscreen, not attached to DOM)
  const canvasEl = document.createElement('canvas');
  canvasEl.width = targetWidth;
  canvasEl.height = targetHeight;

  let fabricCanvas: FabricCanvas | null = null;

  try {
    fabricCanvas = new FabricCanvas(canvasEl, {
      width: targetWidth,
      height: targetHeight,
      backgroundColor: 'transparent',
      renderOnAddRemove: false,
    });

    // ─── Background ─────────────────────────────────────────────
    const bg = doc.background;
    if (bg.type === 'solid') {
      fabricCanvas.add(new Rect({
        left: 0, top: 0,
        width: targetWidth, height: targetHeight,
        fill: bg.value || '#ffffff',
        selectable: false, evented: false,
      }));
    } else if (bg.type === 'gradient' && bg.value.startsWith('linear:')) {
      const parts = bg.value.split(':');
      const direction = parts[1] || 'to-bottom';
      const color1 = parts[2] || '#888';
      const color2 = parts[3] || '#444';
      const bgRect = new Rect({
        left: 0, top: 0,
        width: targetWidth, height: targetHeight,
        selectable: false, evented: false,
      });
      bgRect.set('fill', new Gradient({
        type: 'linear',
        coords: gradientCoords(direction, targetWidth, targetHeight),
        colorStops: [
          { offset: 0, color: color1 },
          { offset: 1, color: color2 },
        ],
      }));
      fabricCanvas.add(bgRect);
    }

    // ─── Template objects ───────────────────────────────────────
    if (doc.objects && doc.objects.length > 0) {
      const objects = createObjectsFromRecipes(doc.objects as Record<string, unknown>[]);

      for (const obj of objects) {
        // Scale position for all objects
        obj.set({
          left: (obj.left ?? 0) * scale,
          top: (obj.top ?? 0) * scale,
        });

        const isText = 'fontSize' in obj && typeof (obj as any).fontSize === 'number';
        const isCircle = !isText && 'radius' in obj && typeof (obj as any).radius === 'number';

        if (isText) {
          // Text objects: scale fontSize and width directly for crisp font rendering.
          // We DON'T use scaleX/scaleY on text because native font hinting looks better.
          (obj as any).set('fontSize', (obj as any).fontSize * scale);
          // Scale textbox width so text wraps at the correct proportional width
          if (typeof (obj as any).width === 'number') {
            (obj as any).set('width', (obj as any).width * scale);
          }
          // Scale text stroke (outline) if present
          if (obj.strokeWidth) {
            obj.set('strokeWidth', obj.strokeWidth * scale);
          }
        } else if (isCircle) {
          // Circles: scale radius directly, reset scale to 1.
          (obj as any).set('radius', (obj as any).radius * scale);
          // Scale stroke width (not handled by scaleX/scaleY since we reset it)
          if (obj.strokeWidth) {
            obj.set('strokeWidth', obj.strokeWidth * scale);
          }
        } else {
          // Shapes (rect, triangle, polygon, line): scale via scaleX/scaleY.
          // This automatically scales width, height, rx, ry, and strokeWidth
          // proportionally — no need to scale those properties individually.
          obj.set({
            scaleX: (obj.scaleX ?? 1) * scale,
            scaleY: (obj.scaleY ?? 1) * scale,
          });
        }

        // Scale shadow for all objects — shadow blur/offset are always in
        // canvas pixels regardless of the object's scaleX/scaleY.
        if (obj.shadow) {
          const s = obj.shadow as any;
          if (typeof s.blur === 'number') {
            s.blur *= scale;
            s.offsetX = (s.offsetX || 0) * scale;
            s.offsetY = (s.offsetY || 0) * scale;
          }
        }

        fabricCanvas.add(obj);
      }
    }

    // Final safety: wait for any remaining font loads triggered by Fabric.js
    await document.fonts.ready;

    // Render
    fabricCanvas.requestRenderAll();
    fabricCanvas.renderAll();

    // Capture — JPEG for smaller data URLs (all templates have opaque backgrounds)
    return fabricCanvas.toDataURL({
      format: 'jpeg',
      quality: 0.92,
      multiplier: 1,
    });
  } catch (err) {
    console.warn('Failed to render template thumbnail:', err);
    return '';
  } finally {
    if (fabricCanvas) {
      fabricCanvas.dispose();
    }
  }
}
