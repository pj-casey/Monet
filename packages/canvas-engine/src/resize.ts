/**
 * Magic Resize — proportionally scales a design to new dimensions.
 *
 * When resizing a 1080×1080 Instagram post to a 1080×1920 story:
 * 1. Calculate scale factors for width and height
 * 2. Use the smaller factor so nothing gets cut off
 * 3. Reposition objects relative to the new artboard center
 * 4. Scale all visual properties proportionally
 *
 * The result is a new DesignDocument that can be loaded via fromJSON.
 *
 * Key: Fabric.js visual size = baseWidth * scaleX, so we only scale ONE
 * of these (scaleX/scaleY), never both. Text and circles use direct
 * property scaling (fontSize, radius) with scaleX/Y reset to 1.
 */

import type { DesignDocument } from '@monet/shared';

/**
 * Resize a design document to new dimensions.
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

  const scaleX = newWidth / oldW;
  const scaleY = newHeight / oldH;
  const uniformScale = Math.min(scaleX, scaleY);

  // Center the scaled content
  const offsetX = (newWidth - oldW * uniformScale) / 2;
  const offsetY = (newHeight - oldH * uniformScale) / 2;

  const resizedObjects = doc.objects.map((obj) => {
    const r = { ...obj } as Record<string, unknown>;

    // ─── Position: scale + offset ─────────────────────────────
    if (typeof r.left === 'number') r.left = r.left * uniformScale + offsetX;
    if (typeof r.top === 'number') r.top = r.top * uniformScale + offsetY;

    // ─── Determine object type ────────────────────────────────
    const isText = typeof r.fontSize === 'number';
    const isCircle = typeof r.radius === 'number' && !isText;

    if (isText) {
      // Text: scale fontSize and width directly (better font hinting)
      r.fontSize = Math.round((r.fontSize as number) * uniformScale);
      if (typeof r.width === 'number') r.width = r.width * uniformScale;
      // Reset scaleX/scaleY since we scaled fontSize directly
      if (typeof r.scaleX === 'number') r.scaleX = 1;
      if (typeof r.scaleY === 'number') r.scaleY = 1;
      // Scale text stroke
      if (typeof r.strokeWidth === 'number' && (r.strokeWidth as number) > 0) {
        r.strokeWidth = Math.max(1, (r.strokeWidth as number) * uniformScale);
      }
    } else if (isCircle) {
      // Circle: scale radius directly
      r.radius = (r.radius as number) * uniformScale;
      if (typeof r.scaleX === 'number') r.scaleX = 1;
      if (typeof r.scaleY === 'number') r.scaleY = 1;
      // Scale stroke for circles
      if (typeof r.strokeWidth === 'number' && (r.strokeWidth as number) > 0) {
        r.strokeWidth = Math.max(1, (r.strokeWidth as number) * uniformScale);
      }
    } else {
      // Shapes (rect, triangle, polygon, line): scale via scaleX/scaleY only
      // Do NOT scale width/height — that would double-scale
      const curScaleX = typeof r.scaleX === 'number' ? r.scaleX : 1;
      const curScaleY = typeof r.scaleY === 'number' ? r.scaleY : 1;
      r.scaleX = curScaleX * uniformScale;
      r.scaleY = curScaleY * uniformScale;
      // If no scaleX/scaleY existed (recipe format), we need to scale dimensions directly
      if (typeof obj.scaleX !== 'number' && typeof obj.scaleY !== 'number') {
        if (typeof r.width === 'number') r.width = r.width * uniformScale;
        if (typeof r.height === 'number') r.height = r.height * uniformScale;
        r.scaleX = 1;
        r.scaleY = 1;
        // Scale rx/ry and stroke when using direct dimensions
        if (typeof r.rx === 'number') r.rx = r.rx * uniformScale;
        if (typeof r.ry === 'number') r.ry = r.ry * uniformScale;
        if (typeof r.strokeWidth === 'number' && (r.strokeWidth as number) > 0) {
          r.strokeWidth = Math.max(1, (r.strokeWidth as number) * uniformScale);
        }
      }
      // strokeDashArray
      if (Array.isArray(r.strokeDashArray)) {
        r.strokeDashArray = (r.strokeDashArray as number[]).map((v) => v * uniformScale);
      }
    }

    // ─── Shadow: scale blur and offsets ────────────────────────
    if (r.shadow && typeof r.shadow === 'object') {
      const s = { ...(r.shadow as Record<string, unknown>) };
      if (typeof s.blur === 'number') s.blur = s.blur * uniformScale;
      if (typeof s.offsetX === 'number') s.offsetX = s.offsetX * uniformScale;
      if (typeof s.offsetY === 'number') s.offsetY = s.offsetY * uniformScale;
      r.shadow = s;
    }

    // ─── Gradient fills: scale coordinates ────────────────────
    if (r.fill && typeof r.fill === 'object' && !Array.isArray(r.fill)) {
      const f = { ...(r.fill as Record<string, unknown>) };
      if (f.coords && typeof f.coords === 'object') {
        const c = { ...(f.coords as Record<string, number>) };
        for (const key of Object.keys(c)) {
          if (typeof c[key] === 'number') c[key] = c[key] * uniformScale;
        }
        f.coords = c;
      }
      r.fill = f;
    }

    // ─── ClipPath: scale sub-object ───────────────────────────
    if (r.clipPath && typeof r.clipPath === 'object') {
      const cp = { ...(r.clipPath as Record<string, unknown>) };
      if (typeof cp.left === 'number') cp.left = cp.left * uniformScale;
      if (typeof cp.top === 'number') cp.top = cp.top * uniformScale;
      if (typeof cp.scaleX === 'number') cp.scaleX = (cp.scaleX as number) * uniformScale;
      if (typeof cp.scaleY === 'number') cp.scaleY = (cp.scaleY as number) * uniformScale;
      if (typeof cp.radius === 'number') cp.radius = (cp.radius as number) * uniformScale;
      r.clipPath = cp;
    }

    return r;
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
    objects: resizedObjects as DesignDocument['objects'],
  };
}
