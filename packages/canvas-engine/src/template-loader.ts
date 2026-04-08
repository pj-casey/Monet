/**
 * Template Loader — creates Fabric.js objects from template recipe data.
 *
 * Templates store objects in a simplified format (just the properties that
 * matter for the design). This module converts those recipes into real
 * Fabric.js objects using the proper constructors.
 *
 * Why not use enlivenObjects()? Because enlivenObjects() expects the full
 * verbose output of toObject() (with version, originX, originY, scaleX, etc.).
 * Our template recipes are deliberately minimal for readability.
 */

import {
  Rect,
  Circle,
  Triangle,
  Textbox,
  Polygon,
  Line,
  type FabricObject,
} from 'fabric';

/**
 * Create Fabric.js objects from an array of template recipe objects.
 *
 * Each recipe has a `type` field that determines which Fabric.js class
 * to use. All other fields are passed as constructor options.
 *
 * Supported types: rect, circle, triangle, textbox, polygon, line
 *
 * @param recipes - Array of simplified object definitions from a template
 * @returns Array of real Fabric.js objects ready to add to the canvas
 */
export function createObjectsFromRecipes(
  recipes: Record<string, unknown>[],
): FabricObject[] {
  const objects: FabricObject[] = [];

  for (const recipe of recipes) {
    const obj = createSingleObject(recipe);
    if (obj) objects.push(obj);
  }

  return objects;
}

/**
 * Create a single Fabric.js object from a recipe.
 *
 * We pull out `type` to decide the constructor, then pass the rest
 * as options. Each constructor handles its own defaults for missing props.
 */
function createSingleObject(recipe: Record<string, unknown>): FabricObject | null {
  const type = recipe.type as string;
  // Remove 'type' from the options — it's not a Fabric.js property
  const { type: _, ...opts } = recipe;

  switch (type) {
    case 'rect':
      return new Rect(opts as ConstructorParameters<typeof Rect>[0]);

    case 'circle':
      return new Circle(opts as ConstructorParameters<typeof Circle>[0]);

    case 'triangle':
      return new Triangle(opts as ConstructorParameters<typeof Triangle>[0]);

    case 'textbox': {
      const text = (opts.text as string) ?? '';
      delete opts.text;
      return new Textbox(text, opts as ConstructorParameters<typeof Textbox>[1]);
    }

    case 'polygon': {
      const points = (opts.points as Array<{ x: number; y: number }>) ?? [];
      delete opts.points;
      return new Polygon(points, opts as ConstructorParameters<typeof Polygon>[1]);
    }

    case 'line': {
      const coords = [
        (opts.x1 as number) ?? 0,
        (opts.y1 as number) ?? 0,
        (opts.x2 as number) ?? 0,
        (opts.y2 as number) ?? 0,
      ] as [number, number, number, number];
      delete opts.x1; delete opts.y1; delete opts.x2; delete opts.y2;
      return new Line(coords, opts as ConstructorParameters<typeof Line>[1]);
    }

    default:
      console.warn(`Unknown template object type: ${type}`);
      return null;
  }
}
