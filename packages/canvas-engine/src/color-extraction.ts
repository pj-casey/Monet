/**
 * Color Extraction — extracts dominant colors from images using ColorThief.
 *
 * Used to:
 * - Show an "Image Colors" palette in PropertiesPanel when an image is selected
 * - Pre-populate brand kit colors from uploaded logos
 * - Add image-derived colors to the ColorPicker's "Used in design" section
 *
 * ColorThief (~8.6KB) analyzes pixel data and returns dominant colors
 * via the median-cut algorithm. Runs entirely client-side.
 */

import type { FabricObject } from 'fabric';

// Lazy-load colorthief to avoid crashing on import if the module shape is unexpected
let _colorThief: any = null;
async function getColorThief() {
  if (!_colorThief) {
    // @ts-ignore — colorthief export shape varies between CJS/ESM
    const mod: any = await import('colorthief');
    const CT = mod.default ?? mod;
    _colorThief = typeof CT === 'function' ? new CT() : CT;
  }
  return _colorThief;
}

/**
 * Convert an RGB array [r, g, b] to a hex string "#rrggbb".
 */
function rgbToHex(rgb: number[]): string {
  return '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');
}

/**
 * Extract a color palette from an HTMLImageElement.
 *
 * @param img - An image element (must be loaded and same-origin or crossOrigin="anonymous")
 * @param colorCount - Number of colors to extract (2-20, default 6)
 * @returns Array of hex color strings, or empty array on failure
 */
export async function extractPalette(img: HTMLImageElement, colorCount: number = 6): Promise<string[]> {
  try {
    // ColorThief needs the image to be fully loaded
    if (!img.complete || img.naturalWidth === 0) return [];

    const ct = await getColorThief();
    const palette = ct.getPalette(img, Math.max(2, Math.min(20, colorCount)));
    if (!palette) return [];

    return palette.map(rgbToHex);
  } catch (err) {
    console.warn('[color-extraction] Failed to extract palette:', err);
    return [];
  }
}

/**
 * Extract a color palette from a data URL or image URL.
 * Creates a temporary image element, waits for it to load, then extracts.
 *
 * @param src - Image source (data URL or HTTP URL)
 * @param colorCount - Number of colors to extract
 * @returns Promise of hex color array
 */
export async function extractPaletteFromUrl(src: string, colorCount: number = 6): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const palette = await extractPalette(img, colorCount);
      resolve(palette);
    };
    img.onerror = () => {
      console.warn('[color-extraction] Failed to load image for palette extraction');
      resolve([]);
    };
    img.src = src;
  });
}

/**
 * Extract palette from a Fabric.js image object.
 * Gets the underlying HTMLImageElement from the Fabric image.
 */
export async function extractPaletteFromFabricImage(fabricImg: FabricObject, colorCount: number = 6): Promise<string[]> {
  try {
    const element = (fabricImg as any).getElement?.();
    if (element instanceof HTMLImageElement) {
      return await extractPalette(element, colorCount);
    }

    // Can't extract without HTMLImageElement — caller should use extractPaletteFromUrl
    return [];
  } catch {
    return [];
  }
}
