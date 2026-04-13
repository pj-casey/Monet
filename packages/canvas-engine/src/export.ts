/**
 * Export — renders the artboard as PNG, JPG, SVG, or PDF.
 *
 * Export works by asking Fabric.js to render only the artboard area
 * (not the gray pasteboard) using `toDataURL` or `toSVG` with a
 * viewport transform that crops to the artboard.
 *
 * For PDF, we render to PNG first, then embed the image in a jsPDF page.
 *
 * The exported file is downloaded via a temporary <a> link — no server needed.
 */

import { type Canvas as FabricCanvas, Textbox, Rect, Circle, Ellipse, FabricImage, Path, Polygon, Triangle, Gradient } from 'fabric';
import { jsPDF } from 'jspdf';
// pdf-lib is lazy-loaded — only downloaded when vector PDF export is first used
let _pdfLib: typeof import('pdf-lib') | null = null;
async function getPdfLib() {
  if (!_pdfLib) _pdfLib = await import('pdf-lib');
  return _pdfLib;
}
import type { TaggedObject } from './tagged-object';
import { isInfrastructure } from './tagged-object';

export type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf';

export interface ExportOptions {
  /** Output format */
  format: ExportFormat;
  /** Quality for PNG/JPG (0 to 1, default 0.92) */
  quality?: number;
  /** Resolution multiplier (1 = actual size, 2 = double, 3 = triple) */
  multiplier?: number;
  /** Filename without extension */
  filename?: string;
  /** If true, export with transparent background (PNG only) */
  transparent?: boolean;
  /** Page data URLs for multi-page PDF export (one PNG per page) */
  pageDataUrls?: string[];
}

/**
 * Export the artboard as an image or document and trigger a browser download.
 *
 * @param canvas - The Fabric.js canvas
 * @param artboardWidth - Artboard width in pixels
 * @param artboardHeight - Artboard height in pixels
 * @param options - Format, quality, multiplier, filename
 */
export function exportCanvas(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  options: ExportOptions,
): void {
  const {
    format,
    quality = 0.92,
    multiplier = 1,
    filename = 'design',
    transparent = false,
  } = options;

  switch (format) {
    case 'png':
      exportRaster(canvas, artboardWidth, artboardHeight, 'png', quality, multiplier, filename, transparent);
      break;
    case 'jpg':
      exportRaster(canvas, artboardWidth, artboardHeight, 'jpeg', quality, multiplier, filename);
      break;
    case 'svg':
      exportSVG(canvas, artboardWidth, artboardHeight, filename);
      break;
    case 'pdf':
      if (options.pageDataUrls && options.pageDataUrls.length > 1) {
        exportMultiPagePDF(options.pageDataUrls, artboardWidth, artboardHeight, filename);
      } else {
        exportPDF(canvas, artboardWidth, artboardHeight, quality, multiplier, filename);
      }
      break;
  }
}

/**
 * Export as PNG or JPG.
 *
 * Uses Fabric.js `toDataURL` with viewport cropping to render only
 * the artboard area. The multiplier scales the output resolution
 * (2x = double the pixels, good for retina displays).
 */
function exportRaster(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  mimeType: 'png' | 'jpeg',
  quality: number,
  multiplier: number,
  filename: string,
  transparent = false,
): void {
  // Save current viewport state
  const originalVpt = [...canvas.viewportTransform];

  // Reset viewport to show artboard at 1:1 with no pan
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  // Hide infrastructure objects before export
  const hidden = hideInfrastructure(canvas, transparent);

  const dataURL = canvas.toDataURL({
    format: mimeType,
    quality,
    multiplier,
    left: 0,
    top: 0,
    width: artboardWidth,
    height: artboardHeight,
  });

  // Restore infrastructure and viewport
  showInfrastructure(hidden);
  canvas.setViewportTransform(originalVpt as typeof canvas.viewportTransform);
  canvas.requestRenderAll();

  // Trigger download
  const ext = mimeType === 'jpeg' ? 'jpg' : 'png';
  downloadDataURL(dataURL, `${filename}.${ext}`);
}

/**
 * Export as SVG.
 *
 * Uses Fabric.js `toSVG` to generate vector output. We add a viewBox
 * attribute to crop to the artboard area.
 */
function exportSVG(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  filename: string,
): void {
  const originalVpt = [...canvas.viewportTransform];
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const hidden = hideInfrastructure(canvas);

  const svgString = canvas.toSVG({
    viewBox: {
      x: 0,
      y: 0,
      width: artboardWidth,
      height: artboardHeight,
    },
    width: `${artboardWidth}px`,
    height: `${artboardHeight}px`,
  });

  showInfrastructure(hidden);
  canvas.setViewportTransform(originalVpt as typeof canvas.viewportTransform);
  canvas.requestRenderAll();

  // Create a Blob and download
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  downloadURL(url, `${filename}.svg`);
  URL.revokeObjectURL(url);
}

/**
 * Export as PDF.
 *
 * Renders the artboard as a PNG image, then embeds it in a single-page
 * PDF using jsPDF. The PDF page matches the artboard dimensions.
 */
function exportPDF(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  quality: number,
  multiplier: number,
  filename: string,
): void {
  const originalVpt = [...canvas.viewportTransform];
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const hidden = hideInfrastructure(canvas);

  const dataURL = canvas.toDataURL({
    format: 'png',
    quality,
    multiplier,
    left: 0,
    top: 0,
    width: artboardWidth,
    height: artboardHeight,
  });

  showInfrastructure(hidden);
  canvas.setViewportTransform(originalVpt as typeof canvas.viewportTransform);
  canvas.requestRenderAll();

  // Create PDF with page dimensions matching the artboard (in points, 1pt = 1/72 inch)
  // We use pixels directly and set the unit to 'px'
  const orientation = artboardWidth >= artboardHeight ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [artboardWidth, artboardHeight],
    hotfixes: ['px_scaling'],
  });

  pdf.addImage(dataURL, 'PNG', 0, 0, artboardWidth, artboardHeight);
  pdf.save(`${filename}.pdf`);
}

/**
 * Export multiple pages as a single multi-page PDF.
 *
 * Each page data URL is added as a separate PDF page.
 * Used when a design has multiple pages.
 */
function exportMultiPagePDF(
  pageDataUrls: string[],
  artboardWidth: number,
  artboardHeight: number,
  filename: string,
): void {
  const orientation = artboardWidth >= artboardHeight ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [artboardWidth, artboardHeight],
    hotfixes: ['px_scaling'],
  });

  for (let i = 0; i < pageDataUrls.length; i++) {
    if (i > 0) pdf.addPage([artboardWidth, artboardHeight], orientation);
    pdf.addImage(pageDataUrls[i], 'PNG', 0, 0, artboardWidth, artboardHeight);
  }

  pdf.save(`${filename}.pdf`);
}

// ─── Vector PDF Export ────────────────────────────────────────────

/**
 * Font cache for PDF embedding — avoids re-fetching the same font.
 */
const pdfFontCache = new Map<string, Uint8Array>();

/**
 * Fetch a Google Font's .ttf bytes for PDF embedding.
 */
async function fetchFontBytes(family: string, weight: string): Promise<Uint8Array | null> {
  const cacheKey = `${family}:${weight}`;
  const cached = pdfFontCache.get(cacheKey);
  if (cached) return cached;

  try {
    const wght = weight === 'bold' || weight === '700' ? '700' : '400';
    const encoded = encodeURIComponent(family);
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encoded}:wght@${wght}&display=swap`;
    const cssResp = await fetch(cssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (!cssResp.ok) return null;
    const css = await cssResp.text();
    const urlMatch = css.match(/url\(([^)]+\.(?:woff2?|ttf|otf))\)/);
    if (!urlMatch) return null;
    const fontUrl = urlMatch[1].replace(/['"]/g, '');
    const fontResp = await fetch(fontUrl);
    if (!fontResp.ok) return null;
    const bytes = new Uint8Array(await fontResp.arrayBuffer());
    pdfFontCache.set(cacheKey, bytes);
    return bytes;
  } catch {
    return null;
  }
}

/**
 * Parse a CSS color string to pdf-lib rgb() values (0-1 range).
 */
function parseColor(color: string): { r: number; g: number; b: number } {
  if (!color || color === 'transparent') return { r: 0, g: 0, b: 0 };

  // Handle rgba()
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbaMatch) {
    return { r: parseInt(rgbaMatch[1]) / 255, g: parseInt(rgbaMatch[2]) / 255, b: parseInt(rgbaMatch[3]) / 255 };
  }

  // Handle hex
  let hex = color.replace('#', '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (hex.length >= 6) {
    return {
      r: parseInt(hex.substring(0, 2), 16) / 255,
      g: parseInt(hex.substring(2, 4), 16) / 255,
      b: parseInt(hex.substring(4, 6), 16) / 255,
    };
  }

  return { r: 0, g: 0, b: 0 };
}

/**
 * Check if a Fabric.js fill is a gradient (not a simple color string).
 */
function isGradientFill(fill: unknown): boolean {
  return fill !== null && typeof fill === 'object' && fill instanceof Gradient;
}

/**
 * Export the canvas as a vector PDF using pdf-lib.
 * Text remains selectable, shapes are sharp at any zoom.
 * Gradients and shadows fall back to rasterized images.
 */
export async function exportVectorPDF(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  filename: string = 'design',
): Promise<void> {
  const { PDFDocument, rgb, StandardFonts } = await getPdfLib();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([artboardWidth, artboardHeight]);
  const pageH = artboardHeight;

  // Embed fallback font
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Font embed cache (per PDF document)
  const embeddedFonts = new Map<string, Awaited<ReturnType<typeof pdfDoc.embedFont>>>();

  async function getEmbeddedFont(family: string, weight: string) {
    const key = `${family}:${weight}`;
    const cached = embeddedFonts.get(key);
    if (cached) return cached;

    const bytes = await fetchFontBytes(family, weight);
    if (bytes) {
      try {
        const font = await pdfDoc.embedFont(bytes);
        embeddedFonts.set(key, font);
        return font;
      } catch {
        // Font embedding failed — fall back
      }
    }
    return weight === 'bold' || weight === '700' ? helveticaBold : helvetica;
  }

  // Draw artboard background
  const artboard = canvas.getObjects().find((o) => (o as TaggedObject).__isArtboard);
  if (artboard) {
    const fillColor = typeof artboard.fill === 'string' ? artboard.fill : '#ffffff';
    const c = parseColor(fillColor);
    page.drawRectangle({
      x: 0, y: 0, width: artboardWidth, height: artboardHeight,
      color: rgb(c.r, c.g, c.b),
    });
  }

  // Iterate user objects (skip infrastructure)
  for (const obj of canvas.getObjects()) {
    if (isInfrastructure(obj as TaggedObject)) continue;
    if ((obj as TaggedObject).__isArtboard) continue;

    const left = obj.left ?? 0;
    const top = obj.top ?? 0;
    const scaleX = obj.scaleX ?? 1;
    const scaleY = obj.scaleY ?? 1;
    const angle = obj.angle ?? 0;
    const opacity = obj.opacity ?? 1;

    // If object has gradient fill or shadow, rasterize it as fallback
    if (isGradientFill(obj.fill) || obj.shadow) {
      try {
        const dataUrl = obj.toDataURL({ format: 'png', multiplier: 2 });
        const pngBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (c) => c.charCodeAt(0));
        const pngImage = await pdfDoc.embedPng(pngBytes);
        const w = (obj.width ?? 0) * scaleX;
        const h = (obj.height ?? 0) * scaleY;
        page.drawImage(pngImage, {
          x: left, y: pageH - top - h, width: w, height: h, opacity,
          rotate: angle ? { type: 0 /* Degrees */, angle: -angle } as any : undefined,
        });
      } catch {
        // Skip objects that can't be rasterized
      }
      continue;
    }

    const fillStr = typeof obj.fill === 'string' ? obj.fill : '#000000';
    const fc = parseColor(fillStr);
    const fillColor = rgb(fc.r, fc.g, fc.b);

    const strokeStr = typeof obj.stroke === 'string' ? obj.stroke : '';
    const sc = parseColor(strokeStr);
    const borderColor = strokeStr && strokeStr !== 'transparent' ? rgb(sc.r, sc.g, sc.b) : undefined;
    const borderWidth = (obj.strokeWidth ?? 0) > 0 ? obj.strokeWidth : undefined;

    // Textbox → drawText
    if (obj instanceof Textbox) {
      const text = obj.text ?? '';
      const fontSize = (obj.fontSize ?? 16) * scaleY;
      const family = obj.fontFamily ?? 'Helvetica';
      const weight = obj.fontWeight === 'bold' ? 'bold' : 'normal';
      const font = await getEmbeddedFont(family, weight);

      // Split text into lines and draw each
      const lines = text.split('\n');
      const lineH = fontSize * (obj.lineHeight ?? 1.2);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const y = pageH - top * scaleY - (i + 1) * lineH;
        try {
          page.drawText(line, {
            x: left, y, size: fontSize, font,
            color: fillColor, opacity,
          });
        } catch {
          // Some characters may not be supported by the font
        }
      }
      continue;
    }

    // Rect → drawRectangle
    if (obj instanceof Rect) {
      const w = (obj.width ?? 0) * scaleX;
      const h = (obj.height ?? 0) * scaleY;
      page.drawRectangle({
        x: left, y: pageH - top - h, width: w, height: h,
        color: fillStr !== 'transparent' && fillStr !== 'rgba(0,0,0,0)' ? fillColor : undefined,
        borderColor, borderWidth, opacity,
      });
      continue;
    }

    // Circle → drawCircle
    if (obj instanceof Circle) {
      const r = (obj.radius ?? 0) * Math.max(scaleX, scaleY);
      page.drawCircle({
        x: left + r, y: pageH - top - r, size: r,
        color: fillColor, borderColor, borderWidth, opacity,
      });
      continue;
    }

    // Ellipse → drawEllipse
    if (obj instanceof Ellipse) {
      const rx = (obj.rx ?? 0) * scaleX;
      const ry = (obj.ry ?? 0) * scaleY;
      page.drawEllipse({
        x: left + rx, y: pageH - top - ry, xScale: rx, yScale: ry,
        color: fillColor, borderColor, borderWidth, opacity,
      });
      continue;
    }

    // Image → embed as raster
    if (obj instanceof FabricImage) {
      try {
        const dataUrl = obj.toDataURL({ format: 'png', multiplier: 1 });
        const pngBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (c) => c.charCodeAt(0));
        const pngImage = await pdfDoc.embedPng(pngBytes);
        const w = (obj.width ?? 0) * scaleX;
        const h = (obj.height ?? 0) * scaleY;
        page.drawImage(pngImage, {
          x: left, y: pageH - top - h, width: w, height: h, opacity,
        });
      } catch {
        // Skip images that fail to embed
      }
      continue;
    }

    // Path / Polygon / Triangle → drawSvgPath
    if (obj instanceof Path || obj instanceof Polygon || obj instanceof Triangle) {
      try {
        const svgStr = obj.toSVG();
        // Extract path data from the SVG string
        const pathMatch = svgStr.match(/\bd="([^"]+)"/);
        if (pathMatch) {
          page.drawSvgPath(pathMatch[1], {
            x: left, y: pageH - top,
            color: fillColor, borderColor, borderWidth, opacity,
            scale: scaleX,
          });
        }
      } catch {
        // Fall back to raster if SVG path fails
        try {
          const dataUrl = obj.toDataURL({ format: 'png', multiplier: 2 });
          const pngBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (c) => c.charCodeAt(0));
          const pngImage = await pdfDoc.embedPng(pngBytes);
          const w = (obj.width ?? 0) * scaleX;
          const h = (obj.height ?? 0) * scaleY;
          page.drawImage(pngImage, { x: left, y: pageH - top - h, width: w, height: h, opacity });
        } catch {
          // Skip entirely
        }
      }
      continue;
    }

    // Fallback for any unknown object type — rasterize
    try {
      const dataUrl = obj.toDataURL({ format: 'png', multiplier: 2 });
      const pngBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (c) => c.charCodeAt(0));
      const pngImage = await pdfDoc.embedPng(pngBytes);
      const w = (obj.width ?? 0) * scaleX;
      const h = (obj.height ?? 0) * scaleY;
      page.drawImage(pngImage, { x: left, y: pageH - top - h, width: w, height: h, opacity });
    } catch {
      // Skip
    }
  }

  // Save and download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  downloadURL(url, `${filename}.pdf`);
  URL.revokeObjectURL(url);
}

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Hide infrastructure objects (artboard, grid, guides) before export.
 * Returns the list of hidden objects so they can be restored.
 */
function hideInfrastructure(canvas: FabricCanvas, transparent = false): { obj: TaggedObject; wasVisible: boolean }[] {
  const hidden: { obj: TaggedObject; wasVisible: boolean }[] = [];

  for (const obj of canvas.getObjects()) {
    const tagged = obj as TaggedObject;
    // Always hide grid, guides, bg image; hide artboard only when NOT transparent
    // (normally artboard is un-hidden for export, but if transparent=true we hide it entirely)
    const isInfra = tagged.__isGridLine || tagged.__isGuide || tagged.__isBgImage || tagged.__isPenPreview || tagged.__isCropOverlay;
    const isArtboard = !!tagged.__isArtboard;
    if (isInfra || (isArtboard && transparent)) {
      hidden.push({ obj: tagged, wasVisible: tagged.visible ?? true });
      tagged.set('visible', false);
    } else if (isArtboard && !transparent) {
      // Keep artboard visible for normal export (shows background)
      // But still track it so hideInfrastructure/show round-trips work
    }
  }

  return hidden;
}

/** Restore previously hidden infrastructure objects. */
function showInfrastructure(hidden: { obj: TaggedObject; wasVisible: boolean }[]): void {
  for (const { obj, wasVisible } of hidden) {
    obj.set('visible', wasVisible);
  }
}

/**
 * Trigger a browser file download from a data URL.
 * Creates a temporary <a> element, clicks it, then removes it.
 */
function downloadDataURL(dataURL: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Trigger a browser file download from a blob URL. */
function downloadURL(url: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
