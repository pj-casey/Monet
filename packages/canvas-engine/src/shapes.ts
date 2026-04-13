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
  Path,
  Group,
  Gradient,
  type FabricObject,
} from 'fabric';
import type { ShapeOptions } from '@monet/shared';

/** Default sizes when the user doesn't specify */
const DEFAULT_SIZE = 150;
const DEFAULT_FILL = '#C4704A'; // warm sienna — matches --accent
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
      return createLine(options, stroke || '#2d2a26', strokeWidth || 2, opacity, centerX, centerY);
    case 'arrow':
      return createArrow(options, stroke || '#2d2a26', strokeWidth || 2, opacity, centerX, centerY);
    case 'star':
      return createStar(options, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'rounded-rect':
      return createRectangle({ ...options, cornerRadius: 20 }, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'diamond':
      return createRegularPolygon(4, fill, stroke, strokeWidth, opacity, centerX, centerY, 45);
    case 'pentagon':
      return createRegularPolygon(5, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'hexagon':
      return createRegularPolygon(6, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'heart':
      return createPathShape(HEART_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'arrow-right':
      return createPathShape(ARROW_RIGHT_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'speech-bubble':
      return createPathShape(SPEECH_BUBBLE_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    // Stars & Badges
    case 'star-4':
      return createStarN(4, 0.45, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'star-6':
      return createStarN(6, 0.55, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'star-8':
      return createStarN(8, 0.55, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'starburst':
      return createStarN(12, 0.7, fill, stroke, strokeWidth, opacity, centerX, centerY);
    // Arrows
    case 'arrow-left':
      return createPathShape(ARROW_LEFT_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'arrow-up':
      return createPathShape(ARROW_UP_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'arrow-down':
      return createPathShape(ARROW_DOWN_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'arrow-double':
      return createPathShape(ARROW_DOUBLE_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'arrow-curved':
      return createPathShape(ARROW_CURVED_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'chevron-right':
      return createPathShape(CHEVRON_RIGHT_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    // Callouts
    case 'speech-bubble-round':
      return createPathShape(SPEECH_BUBBLE_ROUND_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'thought-bubble':
      return createPathShape(THOUGHT_BUBBLE_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'callout-box':
      return createPathShape(CALLOUT_BOX_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    // Banners
    case 'banner-ribbon':
      return createPathShape(BANNER_RIBBON_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'banner-scroll':
      return createPathShape(BANNER_SCROLL_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'badge-circle':
      return createStarN(16, 0.88, fill, stroke, strokeWidth, opacity, centerX, centerY);
    // Decorative
    case 'cloud':
      return createPathShape(CLOUD_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'teardrop':
      return createPathShape(TEARDROP_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'cross':
      return createPathShape(CROSS_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'crescent':
      return createPathShape(CRESCENT_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'lightning':
      return createPathShape(LIGHTNING_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'leaf':
      return createPathShape(LEAF_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'cog':
      return createPathShape(COG_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    case 'blob':
      return createPathShape(BLOB_PATH, fill, stroke, strokeWidth, opacity, centerX, centerY);
    default:
      throw new Error(`Unknown shape type: ${options.type}`);
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
export function generateStarPoints(
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

// ─── New Shape Presets ────────────────────────────────────────────

/** Create a regular polygon (diamond=4, pentagon=5, hexagon=6) */
function createRegularPolygon(
  sides: number,
  fill: string | Gradient<'linear'> | Gradient<'radial'>,
  stroke: string,
  strokeWidth: number,
  opacity: number,
  cx: number,
  cy: number,
  rotationDeg = 0,
): FabricObject {
  const radius = DEFAULT_SIZE / 2;
  const points: Array<{ x: number; y: number }> = [];
  const rotRad = (rotationDeg * Math.PI) / 180;
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2 + rotRad;
    points.push({
      x: radius + radius * Math.cos(angle),
      y: radius + radius * Math.sin(angle),
    });
  }
  return new Polygon(points, {
    left: cx - radius,
    top: cy - radius,
    fill,
    stroke,
    strokeWidth,
    opacity,
  });
}

/** Create an N-pointed star polygon with configurable inner radius ratio */
function createStarN(
  points: number,
  innerRatio: number,
  fill: string | Gradient<'linear'> | Gradient<'radial'>,
  stroke: string,
  strokeWidth: number,
  opacity: number,
  cx: number,
  cy: number,
): FabricObject {
  const size = DEFAULT_SIZE;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * innerRatio;
  const pts = generateStarPoints(points, outerRadius, innerRadius);
  return new Polygon(pts, {
    left: cx - outerRadius,
    top: cy - outerRadius,
    fill,
    stroke,
    strokeWidth,
    opacity,
  });
}

/* ═══════════════════════════════════════════════════════════════════ */
/* SVG path data (normalized to ~150x150 viewbox)                     */
/* ═══════════════════════════════════════════════════════════════════ */

// --- Basic (existing) --- exported for reuse by frames.ts
export const HEART_PATH = 'M75 30 C75 30 60 0 37.5 0 C15 0 0 18 0 40 C0 75 75 120 75 150 C75 120 150 75 150 40 C150 18 135 0 112.5 0 C90 0 75 30 75 30 Z';
export const ARCH_PATH = 'M0 150 L0 75 C0 33 33 0 75 0 C117 0 150 33 150 75 L150 150 Z';
const ARROW_RIGHT_PATH = 'M0 30 L0 120 L90 120 L90 150 L150 75 L90 0 L90 30 Z';
const SPEECH_BUBBLE_PATH = 'M10 0 L140 0 Q150 0 150 10 L150 100 Q150 110 140 110 L50 110 L20 140 L30 110 L10 110 Q0 110 0 100 L0 10 Q0 0 10 0 Z';

// --- Arrows ---
const ARROW_LEFT_PATH = 'M150 30 L150 120 L60 120 L60 150 L0 75 L60 0 L60 30 Z';
const ARROW_UP_PATH = 'M30 150 L120 150 L120 60 L150 60 L75 0 L0 60 L30 60 Z';
const ARROW_DOWN_PATH = 'M30 0 L120 0 L120 90 L150 90 L75 150 L0 90 L30 90 Z';
const ARROW_DOUBLE_PATH = 'M0 75 L40 30 L40 55 L110 55 L110 30 L150 75 L110 120 L110 95 L40 95 L40 120 Z';
const ARROW_CURVED_PATH = 'M10 140 Q10 40 75 30 L75 0 L140 50 L75 100 L75 70 Q40 75 35 140 Z';
const CHEVRON_RIGHT_PATH = 'M20 0 L110 75 L20 150 L50 75 Z';

// --- Callouts ---
const SPEECH_BUBBLE_ROUND_PATH = 'M75 0 C116 0 150 25 150 55 C150 85 116 110 75 110 C65 110 55 108 46 105 L15 140 L25 105 C10 95 0 77 0 55 C0 25 34 0 75 0 Z';
const THOUGHT_BUBBLE_PATH = 'M75 0 C116 0 145 22 145 50 C145 78 116 100 75 100 C34 100 5 78 5 50 C5 22 34 0 75 0 Z M35 105 C42 105 48 111 48 118 C48 125 42 130 35 130 C28 130 22 125 22 118 C22 111 28 105 35 105 Z M18 133 C22 133 26 137 26 141 C26 146 22 150 18 150 C13 150 10 146 10 141 C10 137 13 133 18 133 Z';
const CALLOUT_BOX_PATH = 'M0 0 L150 0 L150 100 L70 100 L40 135 L50 100 L0 100 Z';

// --- Banners ---
const BANNER_RIBBON_PATH = 'M0 25 L20 0 L20 20 L130 20 L130 0 L150 25 L130 50 L130 80 L20 80 L20 50 Z M20 50 L0 75 L20 80 M130 50 L150 75 L130 80';
const BANNER_SCROLL_PATH = 'M15 10 Q0 10 0 30 L0 130 Q0 150 20 140 Q30 135 30 120 L30 40 L120 40 L120 120 Q120 135 130 140 Q150 150 150 130 L150 30 Q150 10 135 10 Z M30 25 L120 25 Q135 25 135 10 M30 40 Q15 40 15 25';

// --- Decorative ---
const CLOUD_PATH = 'M37.5 120 C16 120 0 106 0 88 C0 74 9 62 23 57 C20 45 28 30 45 25 C55 7 75 0 95 5 C108 -2 128 3 137 18 C145 15 150 20 150 30 C150 48 138 55 128 55 C135 65 133 82 120 90 C122 105 110 120 90 120 Z';
const TEARDROP_PATH = 'M75 0 C75 0 140 70 140 100 C140 136 110 150 75 150 C40 150 10 136 10 100 C10 70 75 0 75 0 Z';
const CROSS_PATH = 'M55 0 L95 0 L95 55 L150 55 L150 95 L95 95 L95 150 L55 150 L55 95 L0 95 L0 55 L55 55 Z';
const CRESCENT_PATH = 'M100 0 C45 0 0 33 0 75 C0 117 45 150 100 150 C75 135 60 108 60 75 C60 42 75 15 100 0 Z';
const LIGHTNING_PATH = 'M85 0 L35 65 L65 65 L25 150 L125 60 L80 60 L120 0 Z';
const LEAF_PATH = 'M75 0 C120 15 150 55 150 100 C150 130 125 150 95 150 C75 150 55 140 45 120 C25 85 20 50 75 0 Z M75 20 Q50 80 55 130';
const COG_PATH = 'M65 0 L85 0 L90 18 L108 10 L118 26 L103 38 L115 55 L135 50 L140 68 L122 75 L135 90 L120 103 L108 90 L95 108 L108 118 L98 135 L80 125 L75 150 L65 150 L60 132 L42 140 L32 124 L47 112 L35 95 L15 100 L10 82 L28 75 L15 60 L30 47 L42 60 L55 42 L42 32 L52 15 L70 25 Z';
const BLOB_PATH = 'M95 5 C130 -5 155 30 145 65 C155 95 135 130 105 140 C80 155 40 150 20 125 C-5 105 -5 65 15 40 C30 15 60 10 95 5 Z';

/** Create a shape from an SVG path string */
function createPathShape(
  pathData: string,
  fill: string | Gradient<'linear'> | Gradient<'radial'>,
  stroke: string,
  strokeWidth: number,
  opacity: number,
  cx: number,
  cy: number,
): FabricObject {
  const path = new Path(pathData, {
    fill,
    stroke,
    strokeWidth,
    opacity,
  });
  // Scale to DEFAULT_SIZE and center
  const pathW = path.width ?? 150;
  const pathH = path.height ?? 150;
  const scale = DEFAULT_SIZE / Math.max(pathW, pathH);
  path.set({
    scaleX: scale,
    scaleY: scale,
    left: cx - (pathW * scale) / 2,
    top: cy - (pathH * scale) / 2,
  });
  return path;
}
