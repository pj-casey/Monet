/**
 * Magic Resize — proportionally scales a design to new dimensions.
 *
 * When resizing a 1080×1080 Instagram post to a 1080×1920 story:
 * 1. Calculate scale factors for width and height
 * 2. Use the smaller factor so nothing gets cut off
 * 3. Reposition objects relative to the new artboard center
 * 4. Scale text font sizes proportionally
 *
 * The result is a new DesignDocument that can be loaded via fromJSON.
 */

import type { DesignDocument } from '@monet/shared';

/**
 * Resize a design document to new dimensions.
 *
 * Objects are scaled proportionally and re-centered on the new artboard.
 * Text font sizes are adjusted. The background is preserved.
 *
 * @param doc - The source design document
 * @param newWidth - Target width in pixels
 * @param newHeight - Target height in pixels
 * @returns A new DesignDocument with resized objects
 */
export function resizeDesign(
  doc: DesignDocument,
  newWidth: number,
  newHeight: number,
): DesignDocument {
  const oldW = doc.dimensions.width;
  const oldH = doc.dimensions.height;

  // Calculate how much to scale — use the smaller factor so everything fits
  const scaleX = newWidth / oldW;
  const scaleY = newHeight / oldH;
  const uniformScale = Math.min(scaleX, scaleY);

  // Offset to center the scaled content in the new artboard
  const offsetX = (newWidth - oldW * uniformScale) / 2;
  const offsetY = (newHeight - oldH * uniformScale) / 2;

  // Transform each object
  const resizedObjects = doc.objects.map((obj) => {
    const resized = { ...obj };

    // Position: scale and offset to center
    if (typeof resized.left === 'number') {
      resized.left = resized.left * uniformScale + offsetX;
    }
    if (typeof resized.top === 'number') {
      resized.top = resized.top * uniformScale + offsetY;
    }

    // Dimensions: scale width/height
    if (typeof resized.width === 'number') {
      resized.width = resized.width * uniformScale;
    }
    if (typeof resized.height === 'number') {
      resized.height = resized.height * uniformScale;
    }

    // Scale factors: multiply existing scale
    if (typeof resized.scaleX === 'number') {
      resized.scaleX = resized.scaleX * uniformScale;
    }
    if (typeof resized.scaleY === 'number') {
      resized.scaleY = resized.scaleY * uniformScale;
    }

    // Circle radius
    if (typeof resized.radius === 'number') {
      resized.radius = resized.radius * uniformScale;
    }

    // Text: scale font size
    if (typeof resized.fontSize === 'number') {
      resized.fontSize = Math.round(resized.fontSize * uniformScale);
    }

    // Corner radius
    if (typeof resized.rx === 'number') {
      resized.rx = resized.rx * uniformScale;
    }
    if (typeof resized.ry === 'number') {
      resized.ry = resized.ry * uniformScale;
    }

    // Stroke width
    if (typeof resized.strokeWidth === 'number' && resized.strokeWidth > 0) {
      resized.strokeWidth = Math.max(1, resized.strokeWidth * uniformScale);
    }

    return resized;
  });

  const now = new Date().toISOString();
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

  return {
    ...doc,
    id,
    name: `${doc.name} (resized)`,
    createdAt: now,
    updatedAt: now,
    dimensions: { width: newWidth, height: newHeight },
    objects: resizedObjects,
  };
}
