/**
 * Drawing — freehand pen and eraser for the canvas.
 *
 * Fabric.js has a built-in drawing mode (`isDrawingMode`). When enabled,
 * mouse/touch strokes are captured and converted into Path objects.
 *
 * We support two modes:
 * - Pen: draws colored strokes (configurable color and width)
 * - Eraser: draws white strokes to cover existing content
 *
 * Each completed stroke becomes a selectable Path object that supports
 * undo/redo, move, resize, and delete — just like shapes and text.
 */

import { Canvas as FabricCanvas, PencilBrush } from 'fabric';

/** Default pen settings */
const DEFAULT_COLOR = '#333333';
const DEFAULT_WIDTH = 4;
const ERASER_COLOR = '#ffffff';

/**
 * Enable freehand drawing mode on the canvas.
 *
 * While drawing mode is active, clicking and dragging creates pen strokes
 * instead of selecting/moving objects. The cursor changes to a crosshair.
 *
 * @param canvas - The Fabric.js canvas
 * @param color - Stroke color (CSS color string)
 * @param width - Stroke width in pixels
 */
export function enableDrawing(
  canvas: FabricCanvas,
  color: string = DEFAULT_COLOR,
  width: number = DEFAULT_WIDTH,
): void {
  canvas.isDrawingMode = true;

  // PencilBrush creates smooth freehand strokes
  const brush = new PencilBrush(canvas);
  brush.color = color;
  brush.width = width;
  canvas.freeDrawingBrush = brush;
}

/**
 * Disable freehand drawing mode, returning to normal selection mode.
 */
export function disableDrawing(canvas: FabricCanvas): void {
  canvas.isDrawingMode = false;
}

/**
 * Switch to eraser mode — draws with white to cover existing content.
 *
 * This is a simple eraser that works by drawing white strokes on top.
 * It's effective for most use cases. A true eraser that removes pixels
 * would require more complex compositing (deferred to a later phase).
 *
 * @param canvas - The Fabric.js canvas
 * @param width - Eraser width in pixels (usually larger than pen)
 */
export function enableEraser(
  canvas: FabricCanvas,
  width: number = 20,
): void {
  enableDrawing(canvas, ERASER_COLOR, width);
}

/**
 * Update the drawing brush color without toggling drawing mode.
 */
export function setDrawingColor(canvas: FabricCanvas, color: string): void {
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = color;
  }
}

/**
 * Update the drawing brush width without toggling drawing mode.
 */
export function setDrawingWidth(canvas: FabricCanvas, width: number): void {
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.width = width;
  }
}

export { DEFAULT_COLOR, DEFAULT_WIDTH, ERASER_COLOR };
