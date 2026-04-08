/**
 * Serialization — save and load canvas state as JSON.
 *
 * "Serialization" means converting the live canvas (all its objects, their
 * positions, colors, text, etc.) into a JSON object that can be saved as
 * a file. "Deserialization" is the reverse — taking that JSON and
 * recreating the exact same canvas state.
 *
 * We use Fabric.js's built-in toObject()/enlivenObjects() for the heavy
 * lifting, then wrap the result in our DesignDocument format which adds
 * metadata like name, dimensions, and background.
 */

import { Canvas as FabricCanvas, util, type FabricObject } from 'fabric';
import type { TaggedObject } from './tagged-object';
import type { DesignDocument, BackgroundOptions } from '@monet/shared';
import { createObjectsFromRecipes } from './template-loader';

/**
 * Serialize the current canvas state into a DesignDocument.
 *
 * Reads all user objects (filtering out infrastructure like grid/artboard),
 * serializes them via Fabric.js, and wraps them in our document format.
 *
 * @param canvas - The Fabric.js canvas
 * @param artboardWidth - Current artboard width
 * @param artboardHeight - Current artboard height
 * @param background - Current background settings
 * @param docName - Name for the document
 * @param existingId - If updating an existing doc, keep its ID
 */
export function serializeCanvas(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  background: BackgroundOptions,
  docName: string,
  existingId?: string,
): DesignDocument {
  // Get only user objects (skip artboard rect, grid, guides, bg image)
  const userObjects = canvas.getObjects().filter(
    (obj) => !isInfrastructure(obj),
  );

  // Serialize each object using Fabric.js's built-in serialization
  const serializedObjects = userObjects.map((obj) => obj.toObject());

  const now = new Date().toISOString();

  return {
    version: 1,
    id: existingId ?? generateId(),
    name: docName,
    createdAt: existingId ? '' : now, // Blank if updating — caller preserves original
    updatedAt: now,
    dimensions: { width: artboardWidth, height: artboardHeight },
    background,
    objects: serializedObjects,
    metadata: {},
  };
}

/**
 * Deserialize a DesignDocument back onto the canvas.
 *
 * Clears all user objects from the canvas, then recreates them from
 * the saved JSON. The artboard and infrastructure objects are preserved.
 *
 * @param canvas - The Fabric.js canvas
 * @param doc - The DesignDocument to load
 * @returns Promise that resolves when all objects are loaded
 */
export async function deserializeCanvas(
  canvas: FabricCanvas,
  doc: DesignDocument,
): Promise<void> {
  // Remove all existing user objects
  const toRemove = canvas.getObjects().filter((obj) => !isInfrastructure(obj));
  for (const obj of toRemove) {
    canvas.remove(obj);
  }

  // Recreate objects from the saved data.
  // We detect whether objects are in full Fabric.js format (from toObject(),
  // which always includes 'version') or simplified template recipes.
  if (doc.objects.length > 0) {
    const isFullFormat = 'version' in doc.objects[0];

    if (isFullFormat) {
      // Full Fabric.js serialized format — use enlivenObjects
      const enlivened = await util.enlivenObjects(doc.objects);
      for (const item of enlivened) {
        if (item && typeof (item as FabricObject).set === 'function') {
          canvas.add(item as FabricObject);
        }
      }
    } else {
      // Simplified template recipe format — use our constructors
      const objects = createObjectsFromRecipes(doc.objects);
      for (const obj of objects) {
        canvas.add(obj);
      }
    }
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

/** Generate a simple unique ID (good enough for local use) */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/** Check if an object is infrastructure (should be excluded from serialization) */
function isInfrastructure(obj: FabricObject): boolean {
  const tagged = obj as TaggedObject;
  return !!(
    tagged.__isArtboard ||
    tagged.__isGridLine ||
    tagged.__isGuide ||
    tagged.__isBgImage ||
    tagged.__isPenPreview
  );
}

