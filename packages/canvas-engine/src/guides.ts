/**
 * Smart Guides — alignment lines that appear when dragging objects.
 *
 * When you drag an object near the edge or center of another object,
 * a colored line appears to show the alignment. The object also "snaps"
 * to that alignment for precision.
 *
 * Smart guides check 5 alignment points for each object:
 * - Left edge, Right edge, Horizontal center
 * - Top edge, Bottom edge, Vertical center
 *
 * Think of it like a magnet that pulls objects into alignment with each other.
 */

import { Canvas as FabricCanvas, Line, type FabricObject } from 'fabric';
import { isInfrastructure, type TaggedObject } from './tagged-object';

/** How close (in pixels) an object needs to be to trigger a guide */
const SNAP_THRESHOLD = 5;

/** Guide line appearance — uses accent color from design system */
const GUIDE_COLOR = 'oklch(0.65 0.15 45)'; // --accent (warm sienna)
const GUIDE_STROKE_WIDTH = 1;

/** Currently displayed guide lines (so we can remove them later) */
let activeGuides: FabricObject[] = [];

/** Represents a single alignment edge (either horizontal or vertical) */
interface AlignmentEdge {
  position: number;
  orientation: 'horizontal' | 'vertical';
}

/**
 * Calculate the alignment edges of an object.
 *
 * Returns positions for left/right/center (vertical lines)
 * and top/bottom/center (horizontal lines).
 */
function getObjectEdges(obj: FabricObject): AlignmentEdge[] {
  const bound = obj.getBoundingRect();
  return [
    // Vertical alignment edges (left, center, right)
    { position: bound.left, orientation: 'vertical' as const },
    { position: bound.left + bound.width / 2, orientation: 'vertical' as const },
    { position: bound.left + bound.width, orientation: 'vertical' as const },
    // Horizontal alignment edges (top, center, bottom)
    { position: bound.top, orientation: 'horizontal' as const },
    { position: bound.top + bound.height / 2, orientation: 'horizontal' as const },
    { position: bound.top + bound.height, orientation: 'horizontal' as const },
  ];
}

/**
 * Set up smart guides on the canvas.
 *
 * Listens for object movement and shows/hides alignment guides.
 * When an object is dragged close to another object's edge or center,
 * a guide line appears and the object snaps to that alignment.
 *
 * @param canvas - The Fabric.js canvas instance
 * @param artboardWidth - Width of artboard (for guide line length)
 * @param artboardHeight - Height of artboard (for guide line length)
 * @param isEnabled - Callback that returns whether guides are currently on
 */
export function setupSmartGuides(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  isEnabled: () => boolean,
): void {
  canvas.on('object:moving', (opt) => {
    const target = opt.target;
    if (!target) return;

    // Remove any previously shown guides
    clearGuides(canvas);

    // Skip if guides are disabled
    if (!isEnabled()) return;

    // Get all other objects on the canvas (excluding the one being moved,
    // grid lines, and the artboard background)
    const others = canvas.getObjects().filter(
      (obj) => obj !== target && !isInfrastructure(obj),
    );

    if (others.length === 0) return;

    const targetBound = target.getBoundingRect();
    const targetEdges = [
      // Vertical edges of the moving object
      { pos: targetBound.left, type: 'left' as const },
      { pos: targetBound.left + targetBound.width / 2, type: 'centerX' as const },
      { pos: targetBound.left + targetBound.width, type: 'right' as const },
      // Horizontal edges of the moving object
      { pos: targetBound.top, type: 'top' as const },
      { pos: targetBound.top + targetBound.height / 2, type: 'centerY' as const },
      { pos: targetBound.top + targetBound.height, type: 'bottom' as const },
    ];

    // Collect all edges from other objects
    const otherEdgesCollection: AlignmentEdge[] = [];
    for (const other of others) {
      otherEdgesCollection.push(...getObjectEdges(other));
    }

    let snapX: number | null = null;
    let snapY: number | null = null;
    let snapDeltaX = 0;
    let snapDeltaY = 0;

    // Check vertical alignments (snapping left/right)
    for (const tEdge of targetEdges) {
      if (tEdge.type === 'top' || tEdge.type === 'centerY' || tEdge.type === 'bottom') continue;

      for (const oEdge of otherEdgesCollection) {
        if (oEdge.orientation !== 'vertical') continue;
        const diff = tEdge.pos - oEdge.position;
        if (Math.abs(diff) < SNAP_THRESHOLD) {
          snapX = oEdge.position;
          snapDeltaX = diff;
          break;
        }
      }
      if (snapX !== null) break;
    }

    // Check horizontal alignments (snapping top/bottom)
    for (const tEdge of targetEdges) {
      if (tEdge.type === 'left' || tEdge.type === 'centerX' || tEdge.type === 'right') continue;

      for (const oEdge of otherEdgesCollection) {
        if (oEdge.orientation !== 'horizontal') continue;
        const diff = tEdge.pos - oEdge.position;
        if (Math.abs(diff) < SNAP_THRESHOLD) {
          snapY = oEdge.position;
          snapDeltaY = diff;
          break;
        }
      }
      if (snapY !== null) break;
    }

    // Apply snapping — move the object to align
    if (snapX !== null) {
      target.set('left', (target.left ?? 0) - snapDeltaX);
    }
    if (snapY !== null) {
      target.set('top', (target.top ?? 0) - snapDeltaY);
    }

    // Draw guide lines
    if (snapX !== null) {
      const line = new Line([snapX, 0, snapX, artboardHeight], {
        stroke: GUIDE_COLOR,
        strokeWidth: GUIDE_STROKE_WIDTH,
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      (line as TaggedObject).__isGuide = true;
      (line as any).erasable = false;
      canvas.add(line);
      activeGuides.push(line);
    }
    if (snapY !== null) {
      const line = new Line([0, snapY, artboardWidth, snapY], {
        stroke: GUIDE_COLOR,
        strokeWidth: GUIDE_STROKE_WIDTH,
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      (line as TaggedObject).__isGuide = true;
      (line as any).erasable = false;
      canvas.add(line);
      activeGuides.push(line);
    }

    canvas.requestRenderAll();
  });

  // Clear guides when the user stops dragging
  canvas.on('object:modified', () => {
    clearGuides(canvas);
  });

  // Also clear when selection changes
  canvas.on('selection:cleared', () => {
    clearGuides(canvas);
  });
}

/**
 * Remove all currently visible guide lines from the canvas.
 */
export function clearGuides(canvas: FabricCanvas): void {
  for (const guide of activeGuides) {
    canvas.remove(guide);
  }
  activeGuides = [];
}

