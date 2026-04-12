/**
 * TaggedObject — extended FabricObject type with custom identification tags.
 *
 * Infrastructure objects on the canvas (artboard, grid lines, guide lines,
 * background images) are tagged with boolean flags so they can be
 * identified and excluded from user operations like serialization,
 * undo/redo, smart guide alignment, and the layer list.
 */

import type { FabricObject } from 'fabric';

export interface TaggedObject extends FabricObject {
  __id?: string;
  __isArtboard?: boolean;
  __isGridLine?: boolean;
  __isGuide?: boolean;
  __isBgImage?: boolean;
  __isPenPreview?: boolean;
  __isCropOverlay?: boolean;
  /** Saved evented state during crop mode */
  __cropPrevEvented?: boolean;
}

/**
 * Check if an object is infrastructure (artboard, grid, guide, etc.)
 * and should be excluded from user operations like serialization,
 * undo/redo, smart guide alignment, and the layer list.
 */
export function isInfrastructure(obj: FabricObject): boolean {
  const tagged = obj as TaggedObject;
  return !!(
    tagged.__isArtboard ||
    tagged.__isGridLine ||
    tagged.__isGuide ||
    tagged.__isBgImage ||
    tagged.__isPenPreview ||
    tagged.__isCropOverlay
  );
}
