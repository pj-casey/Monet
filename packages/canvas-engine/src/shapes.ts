/**
 * Shapes — creates Fabric.js shape objects for the canvas.
 *
 * Each function builds a Fabric.js object (Rect, Circle, etc.) from
 * our ShapeOptions type. The canvas-engine calls these, and React
 * never touches Fabric.js directly.
 *
 * Supported shapes:
 * - Rectangle (with optional rounded corners)
 * - Circle
 * - Triangle
 * - Line
 * - Arrow (line with arrowhead)
 * - Star (5-pointed polygon)
 */

import {
  Rect,
  Circle,
  Triangle,
  Line,
  Polygon,
  Group,
  Gradient,
  type FabricObject,
} from 'fabric';
import type { ShapeOptions } from '@monet/shared';

/** Default sizes when the user doesn't specify */
const DEFAULT_SIZE = 150;
const DEFAULT_FILL = '#4A90D9';
const DEFAULT_STROKE = '';
const DEFAULT_STROKE_WIDTH = 0;
const DEFAULT_OPACITY = 1;
const LINE_DEFAULT_LENGTH = 200;

/**
 * Create a Fabric.js shape from our ShapeOptions.
 *
 * @param options - What shape to create and how it should look
 * @param centerX - X position (center of artboard, in canvas coordinates)
 * @param centerY - Y position (center of artboard, in canvas coordinates)
 * @returns The created Fabric.js object
 */
export function createShape(
  options: ShapeOptions,
  centerX: number,
  centerY: number,
): FabricObject {
  const fill = resolveFill(options);
  const stroke = options.stroke ?? DEFAULT_STROKE;
  const strokeWidth = options.strokeWidth ?? DEFAULT_STROKE_WIDTH;
  const opacity = options.opacity ?? DEFAULT_OPACITY;

  switch (options.type) {
    case 'rectangle':
      return createRectangle(options, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'circle':
      return createCircle(options, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'triangle':
      return createTriangle(options, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'line':
      return createLine(options, stroke || '#333333', strokeWidth || 2, opacity, centerX, centerY);
    case 'arrow':
      return createArrow(options, stroke || '#333333', strokeWidth || 2, opacity, centerX, centerY);
    case 'star':
      return createStar(options, fill, stroke, strokeWidth, opacity, centerX, centerY);
  }
}

// ─── Individual shape creators ─────────────────────────────────────

function createRectangle(
  options: ShapeOptions,
  fill: string | Gradient<'linear'> | Gradient<'radial'>,
  stroke: string,
  strokeWidth: number,
  opacity: number,
  cx: number,
  cy: number,
): FabricObject {
  const w = options.width ?? DEFAULT_SIZE;
  const h = options.height ?? DEFAULT_SIZE;
  const cr = options.cornerRadius ?? 0;

  return new Rect({
    left: cx - w / 2,
    top: cy - h / 2,
    width: w,
    height: h,
    fill,
    stroke,
    strokeWidth,
    opacity,
    rx: cr,
    ry: cr,
  });
}

function createCircle(
  options: ShapeOptions,
  fill: string | Gradient<'linear'> | Gradient<'radial'>,
  stroke: string,
  strokeWidth: number,
  opacity: number,
  cx: number,
  cy: number,
): FabricObject {
  const diameter = options.width ?? DEFAULT_SIZE;
  const radius = diameter / 2;

  return new Circle({
    left: cx - radius,
    top: cy - radius,
    radius,
    fill,
    stroke,
    strokeWidth,
    opacity,
  });
}

function createTriangle(
  options: ShapeOptions,
  fill: string | Gradient<'linear'> | Gradient<'radial'>,
  stroke: string,
  strokeWidth: number,
  opacity: number,
  cx: number,
  cy: number,
): FabricObject {
  const w = options.width ?? DEFAULT_SIZE;
  const h = options.height ?? (DEFAULT_SIZE * 0.87); // equilateral-ish ratio

  return new Triangle({
    left: cx - w / 2,
    top: cy - h / 2,
    width: w,
    height: h,
    fill,
    stroke,
    strokeWidth,
    opacity,
  });
}

function createLine(
  options: ShapeOptions,
  stroke: string,
  strokeWidth: number,
  opacity: number,
  cx: number,
  cy: number,
): FabricObject {
  const len = options.width ?? LINE_DEFAULT_LENGTH;
  const halfLen = len / 2;

  return new Line([cx - halfLen, cy, cx + halfLen, cy], {
    stroke,
    strokeWidth,
    opacity,
    fill: '',
  });
}

function createArrow(
  options: ShapeOptions,
  stroke: string,
  strokeWidth: number,
  opacity: number,
  cx: number,
  cy: number,
): FabricObject {
  const len = options.width ?? LINE_DEFAULT_LENGTH;
  const halfLen = len / 2;
  const headSize = Math.max(10, strokeWidth * 4);

  // The line shaft
  const line = new Line([cx - halfLen, cy, cx + halfLen - headSize / 2, cy], {
    stroke,
    strokeWidth,
    opacity,
    fill: '',
  });

  // The arrowhead (a small triangle pointing right)
  const head = new Triangle({
    left: cx + halfLen - headSize,
    top: cy - headSize / 2,
    width: headSize,
    height: headSize,
    fill: stroke,
    stroke: '',
    strokeWidth: 0,
    opacity,
    angle: 90,
    originX: 'center',
    originY: 'center',
  });
  // Position the head at the end of the line
  head.set({ left: cx + halfLen - headSize / 2, top: cy });

  return new Group([line, head], {
    left: cx - halfLen,
    top: cy - headSize / 2,
  });
}

function createStar(
  options: ShapeOptions,
  fill: string | Gradient<'linear'> | Gradient<'radial'>,
  stroke: string,
  strokeWidth: number,
  opacity: number,
  cx: number,
  cy: number,
): FabricObject {
  const size = options.width ?? DEFAULT_SIZE;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.38; // classic 5-pointed star ratio
  const points = generateStarPoints(5, outerRadius, innerRadius);

  return new Polygon(points, {
    left: cx - outerRadius,
    top: cy - outerRadius,
    fill,
    stroke,
    strokeWidth,
    opacity,
  });
}

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Generate the vertices of a star polygon.
 *
 * A star is made by alternating between outer points (the tips)
 * and inner points (the indentations). For a 5-pointed star,
 * this creates 10 vertices total.
 *
 * @param numPoints - Number of star tips (5 = classic star)
 * @param outerRadius - Distance from center to tip
 * @param innerRadius - Distance from center to indentation
 */
function generateStarPoints(
  numPoints: number,
  outerRadius: number,
  innerRadius: number,
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const angleStep = Math.PI / numPoints;

  for (let i = 0; i < numPoints * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    // Start from the top (-PI/2 rotates so first point faces up)
    const angle = i * angleStep - Math.PI / 2;
    points.push({
      x: outerRadius + radius * Math.cos(angle),
      y: outerRadius + radius * Math.sin(angle),
    });
  }

  return points;
}

/**
 * Resolve the fill value — either a solid color string or a Gradient object.
 * If gradientFill is specified, it overrides the solid fill.
 */
function resolveFill(
  options: ShapeOptions,
): string | Gradient<'linear'> | Gradient<'radial'> {
  if (options.gradientFill) {
    return parseGradient(options.gradientFill, options.width ?? DEFAULT_SIZE, options.height ?? DEFAULT_SIZE);
  }
  return options.fill ?? DEFAULT_FILL;
}

/**
 * Parse a gradient string into a Fabric.js Gradient.
 * Same format as background.ts: "linear:to-bottom:#ff0000:#0000ff"
 */
function parseGradient(
  value: string,
  w: number,
  h: number,
): Gradient<'linear'> | Gradient<'radial'> {
  const parts = value.split(':');
  const type = parts[0] as 'linear' | 'radial';

  if (type === 'radial') {
    return new Gradient({
      type: 'radial',
      coords: { x1: w / 2, y1: h / 2, r1: 0, x2: w / 2, y2: h / 2, r2: Math.max(w, h) / 2 },
      colorStops: [
        { offset: 0, color: parts[1] || '#ffffff' },
        { offset: 1, color: parts[2] || '#000000' },
      ],
    });
  }

  const direction = parts[1] || 'to-bottom';
  const c1 = parts[2] || '#ffffff';
  const c2 = parts[3] || '#000000';

  const coords = direction === 'to-right'
    ? { x1: 0, y1: 0, x2: w, y2: 0 }
    : direction === 'to-bottom-right'
      ? { x1: 0, y1: 0, x2: w, y2: h }
      : { x1: 0, y1: 0, x2: 0, y2: h }; // to-bottom default

  return new Gradient({
    type: 'linear',
    coords,
    colorStops: [
      { offset: 0, color: c1 },
      { offset: 1, color: c2 },
    ],
  });
}
