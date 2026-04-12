/**
 * Layers — reads canvas objects as an ordered layer list.
 *
 * Each user-created object on the canvas is a "layer" in the layer panel.
 * Infrastructure objects (artboard rect, grid lines, guide lines, background
 * images) are filtered out — only user objects appear.
 *
 * Layers are ordered by z-index: the last object in the Fabric.js array
 * is on top (drawn last, appears in front).
 */

import { Textbox, type Canvas as FabricCanvas, type FabricObject } from 'fabric';
import { isInfrastructure } from './tagged-object';
import type { LayerInfo } from '@monet/shared';

/**
 * Get the list of user layers from the canvas, ordered front-to-back.
 *
 * The returned array is reversed from Fabric.js order:
 * index 0 = frontmost layer, last = backmost layer.
 * This matches how users think about layers (top of the list = in front).
 */
export function getLayerList(canvas: FabricCanvas): LayerInfo[] {
  const allObjects = canvas.getObjects();
  const layers: LayerInfo[] = [];

  for (let i = 0; i < allObjects.length; i++) {
    const obj = allObjects[i];
    if (isInfrastructure(obj)) continue;

    layers.push({
      index: i,
      name: getLayerName(obj),
      objectType: obj.type ?? 'object',
      locked: !obj.selectable,
      visible: obj.visible ?? true,
    });
  }

  // Reverse so the top layer (highest z-index) is first in the list
  return layers.reverse();
}

/**
 * Generate a user-friendly name for a layer based on its type and content.
 *
 * Examples:
 * - Textbox with "Hello world" → "Hello world" (truncated to 20 chars)
 * - Rectangle → "Rectangle"
 * - Image → "Image"
 * - Path → "Drawing"
 */
export function getLayerName(obj: FabricObject): string {
  const type = obj.type ?? 'object';

  if (obj instanceof Textbox) {
    const text = obj.text ?? '';
    if (text.length > 20) return text.substring(0, 20) + '…';
    return text || 'Text';
  }

  const nameMap: Record<string, string> = {
    rect: 'Rectangle',
    circle: 'Circle',
    triangle: 'Triangle',
    line: 'Line',
    polygon: 'Star',
    group: 'Group',
    image: 'Image',
    path: 'Drawing',
    activeselection: 'Selection',
  };

  return nameMap[type] || type;
}

// isInfrastructure imported from tagged-object.ts

