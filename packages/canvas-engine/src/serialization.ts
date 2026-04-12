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
 *
 * Multi-page: the DesignDocument now has a `pages` array. Each page stores
 * its own objects. Old designs with a flat `objects` array are auto-wrapped
 * into a single page on load (backward compatibility).
 */

import { Canvas as FabricCanvas, util, type FabricObject } from 'fabric';
import { isInfrastructure } from './tagged-object';
import type { DesignDocument, DesignPage, BackgroundOptions } from '@monet/shared';
import { createObjectsFromRecipes } from './template-loader';

/**
 * Serialize the current canvas state into a DesignDocument.
 *
 * The `pages` parameter carries ALL pages in the design. The current page's
 * objects are read live from the canvas; other pages are passed through as-is.
 *
 * @param canvas - The Fabric.js canvas
 * @param artboardWidth - Current artboard width
 * @param artboardHeight - Current artboard height
 * @param background - Current background settings
 * @param docName - Name for the document
 * @param pages - All pages in the design
 * @param currentPageIndex - Index of the page currently on the canvas
 * @param existingId - If updating an existing doc, keep its ID
 */
export function serializeCanvas(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  background: BackgroundOptions,
  docName: string,
  pages: DesignPage[],
  currentPageIndex: number,
  existingId?: string,
  existingCreatedAt?: string,
): DesignDocument {
  // Serialize the current page's objects from the live canvas
  const userObjects = canvas.getObjects().filter(
    (obj) => !isInfrastructure(obj),
  );
  const serializedObjects = userObjects.map((obj) => obj.toObject());

  // Update the current page's objects in the pages array
  const updatedPages = pages.map((page, i) => {
    if (i === currentPageIndex) {
      return { ...page, objects: serializedObjects };
    }
    return page;
  });

  const now = new Date().toISOString();

  return {
    version: 1,
    id: existingId ?? generateId(),
    name: docName,
    createdAt: existingCreatedAt || now,
    updatedAt: now,
    dimensions: { width: artboardWidth, height: artboardHeight },
    background,
    objects: [], // Kept empty for backward compat; pages is the source of truth
    pages: updatedPages,
    metadata: {},
  };
}

/**
 * Deserialize objects onto the canvas.
 *
 * Clears all user objects from the canvas, then recreates them from
 * the page's object array. Handles both full Fabric.js format and
 * simplified template recipes.
 */
export async function deserializeObjects(
  canvas: FabricCanvas,
  objects: Record<string, unknown>[],
): Promise<void> {
  // Remove all existing user objects
  const toRemove = canvas.getObjects().filter((obj) => !isInfrastructure(obj));
  for (const obj of toRemove) {
    canvas.remove(obj);
  }

  if (objects.length > 0) {
    const isFullFormat = 'version' in objects[0];

    if (isFullFormat) {
      const enlivened = await util.enlivenObjects(objects);
      for (const item of enlivened) {
        if (item && typeof (item as FabricObject).set === 'function') {
          canvas.add(item as FabricObject);
        }
      }
    } else {
      const created = createObjectsFromRecipes(objects);
      for (const obj of created) {
        canvas.add(obj);
      }
    }
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

/**
 * Backward-compatible deserializer: reads either `pages` or `objects`
 * from a DesignDocument and loads the specified page onto the canvas.
 *
 * Old designs (no `pages` field) are auto-wrapped into a single page.
 */
export async function deserializeCanvas(
  canvas: FabricCanvas,
  doc: DesignDocument,
  pageIndex = 0,
): Promise<void> {
  const pages = normalizePagesToArray(doc);
  const page = pages[pageIndex] ?? pages[0];
  if (!page) return;
  await deserializeObjects(canvas, page.objects);
}

/**
 * Normalize a DesignDocument to always have a `pages` array.
 * Old designs with a flat `objects` array are wrapped into a single page.
 */
export function normalizePagesToArray(doc: DesignDocument): DesignPage[] {
  if (doc.pages && doc.pages.length > 0) {
    return doc.pages;
  }
  // Backward compatibility: wrap flat objects into page 1
  return [{
    id: generateId(),
    name: 'Page 1',
    objects: doc.objects ?? [],
  }];
}

/** Serialize just the current canvas objects (used when switching pages) */
export function serializeCurrentPageObjects(canvas: FabricCanvas): Record<string, unknown>[] {
  const userObjects = canvas.getObjects().filter(
    (obj) => !isInfrastructure(obj),
  );
  return userObjects.map((obj) => obj.toObject());
}

/** Generate a simple unique ID (good enough for local use) */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// isInfrastructure imported from tagged-object.ts
