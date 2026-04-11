/**
 * Core types for the Monet design document format.
 *
 * A DesignDocument is a JSON object that represents a complete design.
 * It can be saved, loaded, exported, and shared.
 */

/** Background configuration for a design */
export interface BackgroundOptions {
  type: 'solid' | 'gradient' | 'image';
  value: string;
}

/** A single object on the canvas (text, shape, image, etc.) */
export interface CanvasObject {
  id: string;
  type: 'text' | 'shape' | 'image' | 'group' | 'path';
  name: string;
  locked: boolean;
  visible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
}

/** A single page within a design (each page has its own objects and background) */
export interface DesignPage {
  id: string;
  name: string;
  /**
   * Fabric.js serialized objects. Each entry is the output of
   * fabricObject.toObject() — a plain JSON-friendly object.
   */
  objects: Record<string, unknown>[];
  /** Per-page background (defaults to document-level background if not set) */
  background?: BackgroundOptions;
}

/** The complete serializable design document */
export interface DesignDocument {
  version: number;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  dimensions: {
    width: number;
    height: number;
  };
  background: BackgroundOptions;
  /**
   * @deprecated Use `pages` instead. Kept for backward compatibility —
   * old single-page designs have this field instead of `pages`.
   * The engine auto-wraps it into a single page on load.
   */
  objects: Record<string, unknown>[];
  /** Multi-page support: array of pages, each with its own objects */
  pages?: DesignPage[];
  metadata: {
    templateId?: string;
    tags?: string[];
  };
}
