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
 *
 * Supports advanced features in recipes:
 * - Gradient fills: fill as { type, coords, colorStops } object → converted to Gradient instance
 * - Shadows: { color, blur, offsetX, offsetY } → handled natively by Fabric.js constructors
 * - Text effects: charSpacing, lineHeight, stroke, strokeWidth, underline, linethrough
 */

import {
  Rect,
  Circle,
  Triangle,
  Textbox,
  Polygon,
  Line,
  Gradient,
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
 * Gradient fills are detected and converted from plain specs to Gradient instances.
 */
function createSingleObject(recipe: Record<string, unknown>): FabricObject | null {
  const type = recipe.type as string;
  // Remove 'type' from the options — it's not a Fabric.js property
  const { type: _, ...opts } = recipe;

  // Extract gradient fill spec — Fabric.js needs a Gradient instance, not a plain object
  let gradientSpec: Record<string, unknown> | null = null;
  if (opts.fill && typeof opts.fill === 'object' && opts.fill !== null && !Array.isArray(opts.fill)) {
    const fillObj = opts.fill as Record<string, unknown>;
    if ('type' in fillObj && 'colorStops' in fillObj) {
      gradientSpec = fillObj;
      delete opts.fill;
    }
  }

  let obj: FabricObject | null = null;

  switch (type) {
    case 'rect':
      obj = new Rect(opts as ConstructorParameters<typeof Rect>[0]);
      break;

    case 'circle':
      obj = new Circle(opts as ConstructorParameters<typeof Circle>[0]);
      break;

    case 'triangle':
      obj = new Triangle(opts as ConstructorParameters<typeof Triangle>[0]);
      break;

    case 'textbox': {
      const text = (opts.text as string) ?? '';
      delete opts.text;
      // If the text has a stroke, paint stroke behind fill so it doesn't eat into the letter glyph
      if (opts.stroke && opts.stroke !== '') {
        opts.paintFirst = 'stroke';
      }
      obj = new Textbox(text, opts as ConstructorParameters<typeof Textbox>[1]);
      break;
    }

    case 'polygon': {
      const points = (opts.points as Array<{ x: number; y: number }>) ?? [];
      delete opts.points;
      obj = new Polygon(points, opts as ConstructorParameters<typeof Polygon>[1]);
      break;
    }

    case 'line': {
      const coords = [
        (opts.x1 as number) ?? 0,
        (opts.y1 as number) ?? 0,
        (opts.x2 as number) ?? 0,
        (opts.y2 as number) ?? 0,
      ] as [number, number, number, number];
      delete opts.x1; delete opts.y1; delete opts.x2; delete opts.y2;
      obj = new Line(coords, opts as ConstructorParameters<typeof Line>[1]);
      break;
    }

    default:
      console.warn(`Unknown template object type: ${type}`);
      return null;
  }

  // Apply gradient fill after construction — must be a Gradient instance
  if (obj && gradientSpec) {
    obj.set('fill', new Gradient({
      type: gradientSpec.type as 'linear' | 'radial',
      coords: gradientSpec.coords as Record<string, number>,
      colorStops: gradientSpec.colorStops as Array<{ offset: number; color: string }>,
    }));
  }

  return obj;
}
