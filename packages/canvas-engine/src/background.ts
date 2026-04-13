/**
 * Background — manages the artboard background (solid color, gradient, or image).
 *
 * The artboard is the white rectangle where your design lives. Its background
 * can be:
 * - Solid color: a single flat color (e.g., "#ff0000" for red)
 * - Gradient: a smooth blend between two or more colors
 * - Image: a photo or pattern that fills the artboard
 */

import { Gradient, FabricImage, Rect, type Canvas as FabricCanvas, type FabricObject } from 'fabric';
import type { TaggedObject } from './tagged-object';
import type { BackgroundOptions } from '@monet/shared';

/**
 * Apply a background to the artboard rectangle.
 *
 * @param canvas - The Fabric.js canvas
 * @param artboard - The artboard Rect object
 * @param options - What kind of background to apply
 * @returns The background image object if one was created (null otherwise)
 */
export async function applyBackground(
  canvas: FabricCanvas,
  artboard: Rect,
  options: BackgroundOptions,
): Promise<FabricObject | null> {
  // Remove any existing background image first
  removeBackgroundImage(canvas);

  switch (options.type) {
    case 'solid':
      artboard.set('fill', options.value);
      canvas.requestRenderAll();
      return null;

    case 'gradient': {
      const gradient = parseGradient(options.value, artboard);
      artboard.set('fill', gradient);
      canvas.requestRenderAll();
      return null;
    }

    case 'image': {
      // Set artboard fill to white as base, then overlay the image
      artboard.set('fill', '#ffffff');
      const bgImage = await createBackgroundImage(
        options.value,
        artboard.width ?? 0,
        artboard.height ?? 0,
      );
      if (bgImage) {
        canvas.add(bgImage);
        // Reorder: send bgImage to back, then artboard behind it
        // This gives us: artboard (z=0), bgImage (z=1), user objects (z=2+)
        canvas.sendObjectToBack(bgImage);
        canvas.sendObjectToBack(artboard);
        canvas.requestRenderAll();
      }
      return bgImage;
    }
  }
}

/**
 * Remove any background image from the canvas.
 */
function removeBackgroundImage(canvas: FabricCanvas): void {
  const existing = canvas.getObjects().filter((obj) => (obj as TaggedObject).__isBgImage);
  for (const obj of existing) {
    canvas.remove(obj);
  }
}

/**
 * Parse a gradient string into a Fabric.js Gradient object.
 *
 * Expected format: "linear:direction:color1:color2" or "radial:color1:color2"
 * Examples:
 * - "linear:to-bottom:#ff0000:#0000ff" — red to blue, top to bottom
 * - "linear:to-right:#ffffff:#000000" — white to black, left to right
 * - "radial:#ff0000:#0000ff" — red center to blue edges
 */
function parseGradient(value: string, artboard: Rect): Gradient<'linear' | 'radial'> {
  const parts = value.split(':');
  const type = parts[0] as 'linear' | 'radial';
  const w = artboard.width ?? 0;
  const h = artboard.height ?? 0;

  if (type === 'radial') {
    const color1 = parts[1] || '#ffffff';
    const color2 = parts[2] || '#000000';
    return new Gradient({
      type: 'radial',
      coords: {
        x1: w / 2,
        y1: h / 2,
        r1: 0,
        x2: w / 2,
        y2: h / 2,
        r2: Math.max(w, h) / 2,
      },
      colorStops: [
        { offset: 0, color: color1 },
        { offset: 1, color: color2 },
      ],
    });
  }

  // Linear gradient
  const direction = parts[1] || 'to-bottom';
  const color1 = parts[2] || '#ffffff';
  const color2 = parts[3] || '#000000';

  let coords: { x1: number; y1: number; x2: number; y2: number };
  switch (direction) {
    case 'to-right':
      coords = { x1: 0, y1: 0, x2: w, y2: 0 };
      break;
    case 'to-left':
      coords = { x1: w, y1: 0, x2: 0, y2: 0 };
      break;
    case 'to-top':
      coords = { x1: 0, y1: h, x2: 0, y2: 0 };
      break;
    case 'to-bottom-right':
      coords = { x1: 0, y1: 0, x2: w, y2: h };
      break;
    case 'to-bottom':
    default:
      coords = { x1: 0, y1: 0, x2: 0, y2: h };
      break;
  }

  return new Gradient({
    type: 'linear',
    coords,
    colorStops: [
      { offset: 0, color: color1 },
      { offset: 1, color: color2 },
    ],
  });
}

/**
 * Create a FabricImage object that covers the artboard as a background.
 *
 * The image is scaled to cover the entire artboard (like CSS "cover").
 */
async function createBackgroundImage(
  url: string,
  width: number,
  height: number,
): Promise<FabricObject | null> {
  try {
    const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    const imgWidth = img.width ?? 1;
    const imgHeight = img.height ?? 1;

    // Scale to cover: use the larger scale factor
    const scaleX = width / imgWidth;
    const scaleY = height / imgHeight;
    const scale = Math.max(scaleX, scaleY);

    img.set({
      left: 0,
      top: 0,
      scaleX: scale,
      scaleY: scale,
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });

    (img as TaggedObject).__isBgImage = true;
    (img as any).erasable = false;
    return img;
  } catch {
    console.warn('Failed to load background image:', url);
    return null;
  }
}

