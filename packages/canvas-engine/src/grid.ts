/**
 * Grid — renders grid lines on the artboard and handles snap-to-grid.
 *
 * A grid is a pattern of evenly spaced lines (like graph paper) that helps
 * users align objects precisely. "Snap to grid" means objects jump to the
 * nearest grid line when being dragged, instead of moving to any pixel.
 */

import { Canvas as FabricCanvas, Line, type FabricObject } from 'fabric';

/** Default spacing between grid lines in pixels */
const DEFAULT_GRID_SIZE = 20;

/** Color of grid lines */
const GRID_COLOR = 'oklch(0.30 0.02 60 / 0.08)'; // warm-tinted grid lines

/**
 * Draw grid lines on the artboard.
 *
 * Creates a set of thin horizontal and vertical lines across the artboard.
 * These lines are purely visual — they can't be selected or moved.
 *
 * @param canvas - The Fabric.js canvas instance
 * @param artboardWidth - Width of the artboard in pixels
 * @param artboardHeight - Height of the artboard in pixels
 * @param gridSize - Spacing between grid lines (default 20px)
 * @returns Array of grid line objects (so we can remove them later)
 */
export function drawGrid(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  gridSize: number = DEFAULT_GRID_SIZE,
): FabricObject[] {
  const lines: FabricObject[] = [];

  // Vertical lines (going top to bottom)
  for (let x = gridSize; x < artboardWidth; x += gridSize) {
    const line = new Line([x, 0, x, artboardHeight], {
      stroke: GRID_COLOR,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });
    (line as GridLine).__isGridLine = true;
    lines.push(line);
  }

  // Horizontal lines (going left to right)
  for (let y = gridSize; y < artboardHeight; y += gridSize) {
    const line = new Line([0, y, artboardWidth, y], {
      stroke: GRID_COLOR,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });
    (line as GridLine).__isGridLine = true;
    lines.push(line);
  }

  // Add all grid lines to the canvas, behind other objects
  for (const line of lines) {
    canvas.add(line);
    canvas.sendObjectToBack(line);
  }

  canvas.requestRenderAll();
  return lines;
}

/**
 * Remove all grid lines from the canvas.
 *
 * @param canvas - The Fabric.js canvas instance
 * @param gridLines - The array of grid line objects returned by drawGrid
 */
export function removeGrid(canvas: FabricCanvas, gridLines: FabricObject[]): void {
  for (const line of gridLines) {
    canvas.remove(line);
  }
  canvas.requestRenderAll();
}

/**
 * Snap an object's position to the nearest grid point.
 *
 * When an object is being dragged with snap enabled, this function
 * rounds the object's position to the nearest grid intersection.
 * For example, with a 20px grid, an object at position (37, 43)
 * would snap to (40, 40).
 *
 * @param target - The Fabric.js object being moved
 * @param gridSize - Spacing between grid lines
 */
export function snapToGrid(target: FabricObject, gridSize: number = DEFAULT_GRID_SIZE): void {
  const left = target.left ?? 0;
  const top = target.top ?? 0;
  target.set({
    left: Math.round(left / gridSize) * gridSize,
    top: Math.round(top / gridSize) * gridSize,
  });
}

/** Extended Line type with grid marker */
interface GridLine extends FabricObject {
  __isGridLine?: boolean;
}

export { DEFAULT_GRID_SIZE };
