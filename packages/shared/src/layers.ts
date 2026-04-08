/**
 * Layer types for the layer panel.
 *
 * A "layer" in the UI corresponds to a single object on the canvas
 * (a shape, text box, image, or drawn path). The layer panel shows
 * all objects ordered by z-index (front-to-back), letting the user
 * reorder, lock, hide, and select them.
 */

/** Information about one layer displayed in the layer panel */
export interface LayerInfo {
  /** Index in the Fabric.js object array (0 = back, higher = front) */
  index: number;
  /** Friendly display name (e.g., "Rectangle", "Heading text...") */
  name: string;
  /** Fabric.js object type (rect, textbox, image, path, etc.) */
  objectType: string;
  /** Whether the object is locked (can't be moved/edited) */
  locked: boolean;
  /** Whether the object is visible */
  visible: boolean;
}
