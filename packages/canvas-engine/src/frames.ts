/**
 * Frames — shaped image placeholders.
 *
 * A frame is a shape on the canvas that acts as a clipping window for an image.
 * Users click a frame shape (circle, star, heart, etc.), then fill it with an
 * image. The image is clipped to the frame shape via Fabric.js clipPath.
 *
 * Frame shapes reuse path data from shapes.ts (HEART_PATH, ARCH_PATH,
 * generateStarPoints) so the clip paths match the regular shape library.
 */

import {
  Canvas as FabricCanvas,
  FabricImage,
  Circle,
  Rect,
  Path,
  Polygon,
  Group,
  Gradient,
  Textbox,
  type FabricObject,
} from 'fabric';
import { HEART_PATH, ARCH_PATH, generateStarPoints } from './shapes';

/* ═══════════════════════════════════════════════════════════════════ */
/* Types                                                              */
/* ═══════════════════════════════════════════════════════════════════ */

export type FrameShape = 'circle' | 'rounded-rect' | 'star' | 'heart' | 'hexagon' | 'arch';

/* ═══════════════════════════════════════════════════════════════════ */
/* Frame placeholder creation                                         */
/* ═══════════════════════════════════════════════════════════════════ */

const DEFAULT_FRAME_SIZE = 250;

/** Create a warm gradient for the frame placeholder */
function makeFrameGradient(size: number): Gradient<'linear'> {
  return new Gradient({
    type: 'linear',
    coords: { x1: 0, y1: 0, x2: size, y2: size },
    colorStops: [
      { offset: 0, color: '#e8d5b7' },
      { offset: 1, color: '#c4704a' },
    ],
  });
}

/** Create the visible frame shape (the gradient-filled placeholder) */
function createFrameShape(shape: FrameShape, size: number): FabricObject {
  const grad = makeFrameGradient(size);
  const half = size / 2;

  switch (shape) {
    case 'circle':
      return new Circle({
        radius: half,
        fill: grad,
        originX: 'center',
        originY: 'center',
      });

    case 'rounded-rect': {
      const cr = size * 0.15;
      return new Rect({
        width: size,
        height: size,
        rx: cr,
        ry: cr,
        fill: grad,
        originX: 'center',
        originY: 'center',
      });
    }

    case 'star': {
      const pts = generateStarPoints(5, half, half * 0.38);
      // Center the points around origin
      const poly = new Polygon(pts, { fill: grad });
      return poly;
    }

    case 'heart': {
      const p = new Path(HEART_PATH, { fill: grad });
      const pw = p.width ?? 150;
      const ph = p.height ?? 150;
      const s = size / Math.max(pw, ph);
      p.set({ scaleX: s, scaleY: s, originX: 'center', originY: 'center' });
      return p;
    }

    case 'hexagon': {
      const pts = generateHexPoints(half);
      return new Polygon(pts, { fill: grad });
    }

    case 'arch': {
      const p = new Path(ARCH_PATH, { fill: grad });
      const pw = p.width ?? 150;
      const ph = p.height ?? 150;
      const s = size / Math.max(pw, ph);
      p.set({ scaleX: s, scaleY: s, originX: 'center', originY: 'center' });
      return p;
    }
  }
}

/** Create a clipPath object for the given frame shape at the given size */
function createClipPath(shape: FrameShape, width: number, height: number): FabricObject {
  const size = Math.min(width, height);
  const half = size / 2;

  switch (shape) {
    case 'circle':
      return new Circle({
        radius: half,
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0,
      });

    case 'rounded-rect': {
      const cr = size * 0.15;
      return new Rect({
        width: size,
        height: size,
        rx: cr,
        ry: cr,
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0,
      });
    }

    case 'star': {
      const pts = generateStarPoints(5, half, half * 0.38);
      return new Polygon(pts, {
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0,
      });
    }

    case 'heart': {
      const p = new Path(HEART_PATH, {
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0,
      });
      const pw = p.width ?? 150;
      const ph = p.height ?? 150;
      const s = size / Math.max(pw, ph);
      p.set({ scaleX: s, scaleY: s });
      return p;
    }

    case 'hexagon': {
      const pts = generateHexPoints(half);
      return new Polygon(pts, {
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0,
      });
    }

    case 'arch': {
      const p = new Path(ARCH_PATH, {
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0,
      });
      const pw = p.width ?? 150;
      const ph = p.height ?? 150;
      const s = size / Math.max(pw, ph);
      p.set({ scaleX: s, scaleY: s });
      return p;
    }
  }
}

/** Generate hexagon vertices centered at (radius, radius) */
function generateHexPoints(radius: number): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < 6; i++) {
    const angle = (2 * Math.PI * i) / 6 - Math.PI / 2;
    pts.push({
      x: radius + radius * Math.cos(angle),
      y: radius + radius * Math.sin(angle),
    });
  }
  return pts;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Public API                                                         */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Create a frame placeholder object and place it on the canvas.
 *
 * The placeholder shows the shape filled with a warm gradient and a
 * "Drop image" label. When filled with an image, the placeholder is
 * replaced with the clipped image.
 */
export function createFrame(
  shape: FrameShape,
  cx: number,
  cy: number,
  size: number = DEFAULT_FRAME_SIZE,
): FabricObject {
  const frameShape = createFrameShape(shape, size);

  const label = new Textbox('Drop image', {
    fontSize: 14,
    fontFamily: 'DM Sans, system-ui, sans-serif',
    fill: '#ffffff',
    opacity: 0.5,
    textAlign: 'center',
    width: size * 0.8,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
  });

  const group = new Group([frameShape, label], {
    left: cx - size / 2,
    top: cy - size / 2,
  });

  // Tag as frame
  (group as any).__isFrame = true;
  (group as any).__frameShape = shape;
  (group as any).__frameSize = size;
  (group as any).erasable = false;

  return group;
}

/**
 * Fill a frame placeholder with an image.
 *
 * Loads the image, creates a clipPath matching the frame shape,
 * positions the image to cover the frame bounds, removes the
 * placeholder, and adds the clipped image.
 */
export async function fillFrameWithImage(
  canvas: FabricCanvas,
  frame: FabricObject,
  imageUrl: string,
): Promise<FabricObject | null> {
  const shape = (frame as any).__frameShape as FrameShape;
  if (!shape) return null;

  // Get frame geometry
  const frameLeft = frame.left ?? 0;
  const frameTop = frame.top ?? 0;
  const frameW = (frame.width ?? DEFAULT_FRAME_SIZE) * (frame.scaleX ?? 1);
  const frameH = (frame.height ?? DEFAULT_FRAME_SIZE) * (frame.scaleY ?? 1);

  // Load image — if this fails, keep the frame placeholder intact
  let img: InstanceType<typeof FabricImage>;
  try {
    img = await FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
  } catch {
    console.warn('[frames] Failed to load image for frame:', imageUrl);
    return null; // Frame stays on canvas, caller can show error toast
  }

  const imgW = img.width ?? 1;
  const imgH = img.height ?? 1;
  if (imgW <= 1 || imgH <= 1) return null; // Invalid image

  // Cover scale — fill frame completely with no gaps
  const coverScale = Math.max(frameW / imgW, frameH / imgH);

  // Create clip path at the image's local coordinate scale
  const clipW = frameW / coverScale;
  const clipH = frameH / coverScale;
  const clip = createClipPath(shape, clipW, clipH);

  // Position image so its center aligns with the frame center
  img.set({
    left: frameLeft,
    top: frameTop,
    scaleX: coverScale,
    scaleY: coverScale,
    clipPath: clip,
  });

  // Tag the image as framed
  (img as any).__frameShape = shape;
  (img as any).__isFramedImage = true;

  // Swap: remove frame placeholder, add clipped image
  canvas.remove(frame);
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.requestRenderAll();

  return img;
}

/**
 * Check if a FabricObject is a frame placeholder.
 */
export function isFrame(obj: FabricObject): boolean {
  return !!(obj as any).__isFrame;
}
