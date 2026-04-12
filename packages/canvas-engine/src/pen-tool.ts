/**
 * PenTool — interactive vector path creation for the canvas.
 *
 * Lets users create custom vector shapes by placing anchor points:
 * - Click: place a straight-line anchor point
 * - Click + drag: create a bezier curve with control handles
 * - Double-click or click starting point: close/finish the path
 * - Escape: cancel current path
 *
 * The resulting path becomes an editable Fabric.js Path object with
 * fill and stroke properties.
 *
 * Also provides "Edit Points" mode for reshaping existing Path objects
 * by dragging anchor points and control handles.
 */

import {
  Canvas as FabricCanvas,
  Path,
  Circle,
  Line,
  Point,
  util,
  type FabricObject,
} from 'fabric';
import { isInfrastructure } from './tagged-object';

// ─── Types ──────────────────────────────────────────────────────

/** An anchor point in the path being constructed */
interface PenPoint {
  /** Anchor position in canvas coordinates */
  x: number;
  y: number;
  /** Outgoing control handle (toward next segment) */
  cpOut?: { x: number; y: number };
  /** Incoming control handle (from previous segment) */
  cpIn?: { x: number; y: number };
}

/** Tag for pen tool preview objects so layers/serialization skip them */
interface PenPreviewObject extends FabricObject {
  __isPenPreview?: boolean;
}

// ─── Constants ──────────────────────────────────────────────────

const ANCHOR_RADIUS = 4;
const HANDLE_RADIUS = 3;
const CLOSE_THRESHOLD = 12; // px — distance to snap to starting point
const PREVIEW_STROKE = 'oklch(0.65 0.15 45)'; // --accent (warm sienna)
const HANDLE_STROKE = 'oklch(0.55 0.18 45)';  // --accent-active (deeper sienna)
const HANDLE_LINE_STROKE = 'oklch(0.65 0.15 45 / 0.5)'; // --accent at 50%

// ─── PenTool class ──────────────────────────────────────────────

export class PenTool {
  private canvas: FabricCanvas | null = null;
  private active = false;
  private points: PenPoint[] = [];

  /** Preview objects rendered during path construction */
  private previewObjects: FabricObject[] = [];

  /** Whether the user is currently dragging to create a bezier handle */
  private isDragging = false;
  private dragPointIndex = -1;

  /** Bound event handlers (so we can remove them later) */
  private boundMouseDown: ((opt: { e: Event }) => void) | null = null;
  private boundMouseMove: ((opt: { e: Event }) => void) | null = null;
  private boundMouseUp: ((opt: { e: Event }) => void) | null = null;
  private boundDblClick: ((opt: { e: Event }) => void) | null = null;
  private boundKeyDown: ((e: KeyboardEvent) => void) | null = null;

  /** Callbacks for integration with the canvas engine */
  private onPathCreated: ((path: Path) => void) | null = null;

  // ─── Lifecycle ────────────────────────────────────────────────

  /**
   * Activate the pen tool on a canvas.
   *
   * @param canvas - Fabric.js canvas instance
   * @param onPathCreated - Called when user finishes a path (close or double-click)
   */
  activate(canvas: FabricCanvas, onPathCreated: (path: Path) => void): void {
    if (this.active) this.deactivate();

    this.canvas = canvas;
    this.onPathCreated = onPathCreated;
    this.active = true;
    this.points = [];

    // Disable object selection while pen tool is active
    canvas.selection = false;
    canvas.forEachObject((obj) => {
      (obj as FabricObject).selectable = false;
      (obj as FabricObject).evented = false;
    });

    // Bind event handlers
    this.boundMouseDown = (opt) => this.handleMouseDown(opt);
    this.boundMouseMove = (opt) => this.handleMouseMove(opt);
    this.boundMouseUp = (opt) => this.handleMouseUp(opt);
    this.boundDblClick = (opt) => this.handleDblClick(opt);
    this.boundKeyDown = (e) => this.handleKeyDown(e);

    canvas.on('mouse:down', this.boundMouseDown);
    canvas.on('mouse:move', this.boundMouseMove);
    canvas.on('mouse:up', this.boundMouseUp);
    canvas.on('mouse:dblclick', this.boundDblClick);
    document.addEventListener('keydown', this.boundKeyDown);

    // Change cursor
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
  }

  /**
   * Deactivate the pen tool and clean up.
   * Does NOT finalize the current path — call finishPath() first if needed.
   */
  deactivate(): void {
    if (!this.canvas || !this.active) return;

    // Remove event handlers
    if (this.boundMouseDown) this.canvas.off('mouse:down', this.boundMouseDown);
    if (this.boundMouseMove) this.canvas.off('mouse:move', this.boundMouseMove);
    if (this.boundMouseUp) this.canvas.off('mouse:up', this.boundMouseUp);
    if (this.boundDblClick) this.canvas.off('mouse:dblclick', this.boundDblClick);
    if (this.boundKeyDown) document.removeEventListener('keydown', this.boundKeyDown);

    // Remove preview objects
    this.clearPreview();

    // Restore selection
    this.canvas.selection = true;
    this.canvas.forEachObject((obj) => {
      // Don't make infrastructure objects selectable
      if (isInfrastructure(obj)) return;
      (obj as FabricObject).selectable = true;
      (obj as FabricObject).evented = true;
    });

    // Reset cursor
    this.canvas.defaultCursor = 'default';
    this.canvas.hoverCursor = 'move';

    this.active = false;
    this.points = [];
    this.isDragging = false;
    this.canvas = null;
    this.onPathCreated = null;

    // Clear bound references
    this.boundMouseDown = null;
    this.boundMouseMove = null;
    this.boundMouseUp = null;
    this.boundDblClick = null;
    this.boundKeyDown = null;
  }

  /** Whether the pen tool is currently active */
  isActive(): boolean {
    return this.active;
  }

  /** Number of points placed so far */
  getPointCount(): number {
    return this.points.length;
  }

  // ─── Mouse event handlers ────────────────────────────────────

  private handleMouseDown(opt: { e: Event }): void {
    if (!this.canvas) return;
    const e = opt.e as MouseEvent;
    // Only handle left button
    if (e.button !== 0) return;

    const pt = this.screenToCanvas(e.offsetX, e.offsetY);

    // Check if clicking near the starting point to close the path
    if (this.points.length >= 3) {
      const start = this.points[0];
      const dist = Math.sqrt((pt.x - start.x) ** 2 + (pt.y - start.y) ** 2);
      if (dist < CLOSE_THRESHOLD) {
        this.finishPath(true);
        return;
      }
    }

    // Start a new point — might become a bezier if the user drags
    this.points.push({ x: pt.x, y: pt.y });
    this.isDragging = true;
    this.dragPointIndex = this.points.length - 1;

    this.updatePreview();
  }

  private handleMouseMove(opt: { e: Event }): void {
    if (!this.canvas) return;
    const e = opt.e as MouseEvent;
    const pt = this.screenToCanvas(e.offsetX, e.offsetY);

    if (this.isDragging && this.dragPointIndex >= 0) {
      // User is dragging — create bezier control handles
      const anchor = this.points[this.dragPointIndex];
      const dx = pt.x - anchor.x;
      const dy = pt.y - anchor.y;

      // Only create handles if dragged far enough (avoid accidental micro-drags)
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        anchor.cpOut = { x: anchor.x + dx, y: anchor.y + dy };
        anchor.cpIn = { x: anchor.x - dx, y: anchor.y - dy };
        this.updatePreview();
      }
    } else if (this.points.length > 0) {
      // Not dragging — update the "cursor line" preview from last point to mouse
      this.updatePreview(pt);
    }
  }

  private handleMouseUp(_opt: { e: Event }): void {
    this.isDragging = false;
    this.dragPointIndex = -1;
  }

  private handleDblClick(_opt: { e: Event }): void {
    if (this.points.length < 2) return;
    // Double-click fires after mouse:down, which adds a duplicate point — remove it
    this.points.pop();
    this.finishPath(false);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.cancelPath();
    } else if (e.key === 'Enter' && this.points.length >= 2) {
      this.finishPath(false);
    }
  }

  // ─── Path construction ───────────────────────────────────────

  /**
   * Finish the current path and create a Fabric.js Path object.
   *
   * @param closed - Whether to close the path (connect last point to first)
   */
  finishPath(closed: boolean): void {
    if (!this.canvas || this.points.length < 2) {
      this.cancelPath();
      return;
    }

    const pathString = this.buildPathString(closed);
    const path = new Path(pathString, {
      fill: closed ? 'rgba(59, 130, 246, 0.15)' : 'none',
      stroke: '#2d2a26',
      strokeWidth: 2,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      selectable: true,
      evented: true,
    });

    // Clear preview before adding the real path
    this.clearPreview();
    this.points = [];
    this.isDragging = false;

    // Notify the engine
    if (this.onPathCreated) {
      this.onPathCreated(path);
    }
  }

  /** Cancel the current path without creating an object */
  cancelPath(): void {
    this.clearPreview();
    this.points = [];
    this.isDragging = false;
  }

  /**
   * Build an SVG path string from the current points.
   *
   * Handles both straight lines (L) and cubic bezier curves (C).
   * A segment uses a bezier curve if either endpoint has control handles.
   */
  private buildPathString(closed: boolean): string {
    const pts = this.points;
    if (pts.length === 0) return '';

    const parts: string[] = [`M ${pts[0].x} ${pts[0].y}`];

    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];

      if (prev.cpOut || curr.cpIn) {
        // Cubic bezier
        const cp1 = prev.cpOut ?? { x: prev.x, y: prev.y };
        const cp2 = curr.cpIn ?? { x: curr.x, y: curr.y };
        parts.push(`C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${curr.x} ${curr.y}`);
      } else {
        // Straight line
        parts.push(`L ${curr.x} ${curr.y}`);
      }
    }

    // Close path — connect last point back to first
    if (closed && pts.length >= 3) {
      const last = pts[pts.length - 1];
      const first = pts[0];

      if (last.cpOut || first.cpIn) {
        const cp1 = last.cpOut ?? { x: last.x, y: last.y };
        const cp2 = first.cpIn ?? { x: first.x, y: first.y };
        parts.push(`C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${first.x} ${first.y}`);
      }
      parts.push('Z');
    }

    return parts.join(' ');
  }

  // ─── Preview rendering ───────────────────────────────────────

  /**
   * Update the visual preview of the path being constructed.
   * Shows anchor dots, connecting lines, and control handles.
   *
   * @param cursorPt - Current mouse position (for the "rubber band" line)
   */
  private updatePreview(cursorPt?: { x: number; y: number }): void {
    if (!this.canvas) return;

    // Remove old preview objects
    this.clearPreview();

    const pts = this.points;
    if (pts.length === 0) return;

    // Build preview path from existing points
    if (pts.length >= 2) {
      const pathStr = this.buildPathString(false);
      const previewPath = new Path(pathStr, {
        fill: 'none',
        stroke: PREVIEW_STROKE,
        strokeWidth: 1.5,
        strokeDashArray: [6, 4],
        selectable: false,
        evented: false,
      });
      this.addPreviewObject(previewPath);
    }

    // "Rubber band" line from last point to cursor
    if (cursorPt && pts.length >= 1) {
      const last = pts[pts.length - 1];
      const rubberBand = new Line(
        [last.x, last.y, cursorPt.x, cursorPt.y],
        {
          stroke: PREVIEW_STROKE,
          strokeWidth: 1,
          strokeDashArray: [4, 4],
          selectable: false,
          evented: false,
          opacity: 0.5,
        },
      );
      this.addPreviewObject(rubberBand);
    }

    // Draw control handles for bezier points
    for (const pt of pts) {
      if (pt.cpOut) {
        // Handle line from anchor to cpOut
        const handleLine = new Line(
          [pt.x, pt.y, pt.cpOut.x, pt.cpOut.y],
          {
            stroke: HANDLE_LINE_STROKE,
            strokeWidth: 1,
            selectable: false,
            evented: false,
          },
        );
        this.addPreviewObject(handleLine);

        // cpOut dot
        const cpOutDot = new Circle({
          left: pt.cpOut.x - HANDLE_RADIUS,
          top: pt.cpOut.y - HANDLE_RADIUS,
          radius: HANDLE_RADIUS,
          fill: HANDLE_STROKE,
          stroke: 'white',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        });
        this.addPreviewObject(cpOutDot);
      }

      if (pt.cpIn) {
        // Handle line from anchor to cpIn
        const handleLine = new Line(
          [pt.x, pt.y, pt.cpIn.x, pt.cpIn.y],
          {
            stroke: HANDLE_LINE_STROKE,
            strokeWidth: 1,
            selectable: false,
            evented: false,
          },
        );
        this.addPreviewObject(handleLine);

        // cpIn dot
        const cpInDot = new Circle({
          left: pt.cpIn.x - HANDLE_RADIUS,
          top: pt.cpIn.y - HANDLE_RADIUS,
          radius: HANDLE_RADIUS,
          fill: HANDLE_STROKE,
          stroke: 'white',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        });
        this.addPreviewObject(cpInDot);
      }
    }

    // Draw anchor dots (on top of everything)
    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i];
      const isFirst = i === 0;
      const dot = new Circle({
        left: pt.x - ANCHOR_RADIUS,
        top: pt.y - ANCHOR_RADIUS,
        radius: ANCHOR_RADIUS,
        fill: isFirst ? '#10B981' : 'white', // green for start point
        stroke: isFirst ? '#059669' : PREVIEW_STROKE,
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      this.addPreviewObject(dot);
    }

    this.canvas.requestRenderAll();
  }

  private addPreviewObject(obj: FabricObject): void {
    if (!this.canvas) return;
    (obj as PenPreviewObject).__isPenPreview = true;
    this.previewObjects.push(obj);
    this.canvas.add(obj);
  }

  private clearPreview(): void {
    if (!this.canvas) return;
    for (const obj of this.previewObjects) {
      this.canvas.remove(obj);
    }
    this.previewObjects = [];
  }

  // ─── Coordinate conversion ───────────────────────────────────

  /**
   * Convert screen coordinates to canvas (scene) coordinates,
   * accounting for zoom and pan (the viewport transform).
   */
  private screenToCanvas(screenX: number, screenY: number): { x: number; y: number } {
    if (!this.canvas) return { x: screenX, y: screenY };
    const vpt = this.canvas.viewportTransform;
    const inv = util.invertTransform(vpt);
    const pt = util.transformPoint(new Point(screenX, screenY), inv);
    return { x: pt.x, y: pt.y };
  }
}

// ─── Edit Points Mode ──────────────────────────────────────────

/**
 * EditPointsMode — allows reshaping an existing Path object by
 * dragging its anchor points and control handles.
 *
 * Usage:
 *   const editor = new EditPointsMode();
 *   editor.enter(canvas, pathObject, onPathModified);
 *   // ... user drags points ...
 *   editor.exit();
 */
export class EditPointsMode {
  private canvas: FabricCanvas | null = null;
  private targetPath: Path | null = null;
  private handles: FabricObject[] = [];
  private onModified: (() => void) | null = null;
  private active = false;

  /**
   * Enter edit mode for a specific Path object.
   * Parses the path's segments and shows draggable anchor/control handles.
   */
  enter(canvas: FabricCanvas, path: Path, onModified: () => void): void {
    if (this.active) this.exit();

    this.canvas = canvas;
    this.targetPath = path;
    this.onModified = onModified;
    this.active = true;

    // Make the target path non-selectable while editing its points
    path.selectable = false;
    path.evented = false;

    this.buildHandles();
  }

  /** Exit edit mode, remove handles, and restore the path's selectability */
  exit(): void {
    if (!this.canvas) return;

    // Remove handles
    for (const h of this.handles) {
      this.canvas.remove(h);
    }
    this.handles = [];

    if (this.targetPath) {
      this.targetPath.selectable = true;
      this.targetPath.evented = true;
    }

    this.active = false;
    this.canvas.requestRenderAll();
    this.canvas = null;
    this.targetPath = null;
    this.onModified = null;
  }

  isActive(): boolean {
    return this.active;
  }

  /**
   * Parse the path's segments and create draggable circle handles
   * for each anchor point.
   */
  private buildHandles(): void {
    if (!this.canvas || !this.targetPath) return;

    const path = this.targetPath;
    const pathData = path.path;
    if (!pathData) return;

    // Fabric.js Path.path is an array of path commands:
    // ['M', x, y], ['L', x, y], ['C', cx1, cy1, cx2, cy2, x, y], ['Z']
    // Coordinates are relative to the path's own coordinate space.
    // We need to account for the path's position, scale, and angle.

    for (let i = 0; i < pathData.length; i++) {
      const cmd = pathData[i];
      const command = cmd[0] as string;

      if (command === 'Z' || command === 'z') continue;

      // Get the anchor point (last 2 numbers in the command)
      let anchorX: number;
      let anchorY: number;

      if (command === 'M' || command === 'L') {
        anchorX = cmd[1] as number;
        anchorY = cmd[2] as number;
      } else if (command === 'C') {
        anchorX = cmd[5] as number;
        anchorY = cmd[6] as number;
      } else if (command === 'Q') {
        anchorX = cmd[3] as number;
        anchorY = cmd[4] as number;
      } else {
        continue;
      }

      // Transform from path-local to canvas coordinates
      const worldPt = this.pathToCanvas(anchorX, anchorY);

      const handle = new Circle({
        left: worldPt.x - 5,
        top: worldPt.y - 5,
        radius: 5,
        fill: 'white',
        stroke: PREVIEW_STROKE,
        strokeWidth: 2,
        selectable: true,
        evented: true,
        hasControls: false,
        hasBorders: false,
        originX: 'center',
        originY: 'center',
      });

      // Store references for the move handler
      const cmdIndex = i;
      handle.on('moving', () => {
        this.onHandleMoved(handle, cmdIndex);
      });
      handle.on('modified', () => {
        if (this.onModified) this.onModified();
      });

      (handle as PenPreviewObject).__isPenPreview = true;
      this.handles.push(handle);
      this.canvas.add(handle);
    }

    this.canvas.requestRenderAll();
  }

  /**
   * Called when a handle is dragged — updates the corresponding
   * point in the Path's path data.
   */
  private onHandleMoved(handle: FabricObject, cmdIndex: number): void {
    if (!this.canvas || !this.targetPath) return;

    const path = this.targetPath;
    const pathData = path.path;
    if (!pathData || !pathData[cmdIndex]) return;

    // Convert handle's canvas position back to path-local coordinates
    const handleCenter = handle.getCenterPoint();
    const localPt = this.canvasToPath(handleCenter.x, handleCenter.y);

    const cmd = pathData[cmdIndex];
    const command = cmd[0] as string;

    if (command === 'M' || command === 'L') {
      cmd[1] = localPt.x;
      cmd[2] = localPt.y;
    } else if (command === 'C') {
      // Move the anchor point (last pair)
      // Also shift the incoming control point proportionally
      const dx = localPt.x - (cmd[5] as number);
      const dy = localPt.y - (cmd[6] as number);
      cmd[3] = (cmd[3] as number) + dx;
      cmd[4] = (cmd[4] as number) + dy;
      cmd[5] = localPt.x;
      cmd[6] = localPt.y;
    } else if (command === 'Q') {
      cmd[3] = localPt.x;
      cmd[4] = localPt.y;
    }

    // Force Fabric.js to recalculate the path
    path.set('dirty', true);
    path.setCoords();
    this.canvas.requestRenderAll();
  }

  /**
   * Transform a point from path-local coordinates to canvas coordinates.
   * Accounts for the path's position, scale, angle, and offset.
   */
  private pathToCanvas(localX: number, localY: number): { x: number; y: number } {
    if (!this.targetPath) return { x: localX, y: localY };

    const path = this.targetPath;
    const matrix = path.calcTransformMatrix();
    // Path coordinates are relative to the path's own bounding box.
    // The path's pathOffset centers the path data.
    const offsetX = localX - path.pathOffset.x;
    const offsetY = localY - path.pathOffset.y;
    const pt = util.transformPoint(new Point(offsetX, offsetY), matrix);
    return { x: pt.x, y: pt.y };
  }

  /**
   * Transform a point from canvas coordinates to path-local coordinates.
   */
  private canvasToPath(canvasX: number, canvasY: number): { x: number; y: number } {
    if (!this.targetPath) return { x: canvasX, y: canvasY };

    const path = this.targetPath;
    const matrix = path.calcTransformMatrix();
    const inv = util.invertTransform(matrix);
    const pt = util.transformPoint(new Point(canvasX, canvasY), inv);
    return {
      x: pt.x + path.pathOffset.x,
      y: pt.y + path.pathOffset.y,
    };
  }
}
