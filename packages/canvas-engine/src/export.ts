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

import { type Canvas as FabricCanvas } from 'fabric';
import { jsPDF } from 'jspdf';
import type { TaggedObject } from './tagged-object';

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
