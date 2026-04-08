/**
 * Shape types and options for the shape tool.
 *
 * A "shape" is any geometric object you can place on the canvas:
 * rectangles, circles, triangles, lines, arrows, and stars.
 * Each shape has properties like fill color, stroke, and opacity.
 */

/** The kinds of shapes users can create */
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow' | 'star';

/** Options when creating a new shape */
export interface ShapeOptions {
  /** What kind of shape to create */
  type: ShapeType;
  /** Width in pixels (ignored for circle — uses width as diameter) */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Fill color — a CSS color string like "#ff0000" or "transparent" */
  fill?: string;
  /**
   * Gradient fill — overrides solid fill.
   * Format: "linear:direction:color1:color2" or "radial:color1:color2"
   */
  gradientFill?: string;
  /** Stroke (outline) color */
  stroke?: string;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Opacity from 0 (invisible) to 1 (fully visible) */
  opacity?: number;
  /** Corner radius for rectangles only (rounds the corners) */
  cornerRadius?: number;
}

/**
 * Properties of a selected object that the UI can display/edit.
 * Read from the canvas engine when the user selects an object.
 */
export interface SelectedObjectProps {
  /** The Fabric.js object ID (for updating) */
  id: string;
  /** What type of object it is */
  objectType: string;
  /** Fill color (may be a color string or "gradient" or empty) */
  fill: string;
  /** Stroke color */
  stroke: string;
  /** Stroke width */
  strokeWidth: number;
  /** Opacity 0–1 */
  opacity: number;
  /** Corner radius (only meaningful for rectangles) */
  cornerRadius: number;
  /** Position and size */
  left: number;
  top: number;
  width: number;
  height: number;
  /** Rotation angle in degrees */
  angle: number;
  /** Blend mode (maps to CSS/Canvas globalCompositeOperation) */
  blendMode: string;
  /** Whether this object has a clipping mask applied */
  hasClipPath: boolean;

  // ─── Text-specific (only set when objectType is 'textbox') ──────
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  underline?: boolean;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  /** Fabric.js charSpacing value (in 1/1000 em units) */
  charSpacing?: number;

  // ─── Image-specific (only set when objectType is 'image') ───────
  /** Current brightness filter value (-1 to 1) */
  filterBrightness?: number;
  /** Current contrast filter value (-1 to 1) */
  filterContrast?: number;
  /** Current saturation filter value (-1 to 1) */
  filterSaturation?: number;
  /** Current blur filter value (0 to 1) */
  filterBlur?: number;
  /** Hue rotation in degrees (-180 to 180) */
  filterHueRotation?: number;
  /** Noise amount (0 to 500) */
  filterNoise?: number;
  /** Sharpen intensity (0 to 2) */
  filterSharpen?: number;
  /** Tint color (hex string) */
  filterTintColor?: string;
  /** Tint intensity (0 to 1) */
  filterTintAlpha?: number;
  /** Vignette intensity (0 to 1) */
  filterVignette?: number;
}
