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
   * Fabric.js serialized objects. Each entry is the output of
   * fabricObject.toObject() — a plain JSON-friendly object.
   * We use Record<string, unknown>[] instead of CanvasObject[]
   * so we can roundtrip any Fabric.js object type faithfully.
   */
  objects: Record<string, unknown>[];
  metadata: {
    templateId?: string;
    tags?: string[];
  };
}
