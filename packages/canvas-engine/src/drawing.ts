/**
 * Drawing — pressure-sensitive freehand strokes using perfect-freehand.
 *
 * Instead of Fabric.js's built-in PencilBrush, we capture pointer events
 * directly, collect [x, y, pressure] points, and use perfect-freehand's
 * getStroke() to generate beautiful outlines. The result is converted to
 * an SVG path string and added as a fabric.Path object.
 *
 * Supports 4 brush types:
 * - Pen: natural pressure-sensitive pen
 * - Marker: thick, uniform strokes
 * - Highlighter: wide, semi-transparent
 * - Glow: pen with colored shadow (neon effect)
 *
 * Eraser uses @erase2d/fabric EraserBrush — a real compositing eraser
 * that clips erasable objects, showing the background through. It uses
 * Fabric.js isDrawingMode=true (separate from the custom pointer system).
 */

import { Canvas as FabricCanvas, Path, Shadow } from 'fabric';
import getStroke from 'perfect-freehand';
import { EraserBrush } from '@erase2d/fabric';
import { isInfrastructure } from './tagged-object';
import { makeCircleCursor, makeEraserCursor } from './cursors';

/* ═══════════════════════════════════════════════════════════════════ */
/* Types                                                              */
/* ═══════════════════════════════════════════════════════════════════ */

export type BrushType = 'pen' | 'marker' | 'highlighter' | 'glow';

interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
}

interface FreehandState {
  active: boolean;
  points: StrokePoint[];
  brushType: BrushType;
  color: string;
  width: number;
  onCheckpoint?: () => void;
  onCommit?: (label: string) => void;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Constants                                                          */
/* ═══════════════════════════════════════════════════════════════════ */

const DEFAULT_COLOR = '#2d2a26';
const DEFAULT_WIDTH = 4;

/* ═══════════════════════════════════════════════════════════════════ */
/* Brush presets                                                      */
/* ═══════════════════════════════════════════════════════════════════ */

function getBrushOptions(type: BrushType, width: number) {
  switch (type) {
    case 'pen':
      return { size: width, thinning: 0.5, smoothing: 0.5, streamline: 0.5 };
    case 'marker':
      return { size: width * 2, thinning: 0.1, smoothing: 0.8, streamline: 0.3 };
    case 'highlighter':
      return { size: width * 3, thinning: 0, smoothing: 0.5, streamline: 0.5 };
    case 'glow':
      return { size: width, thinning: 0.5, smoothing: 0.5, streamline: 0.5 };
  }
}

/* ═══════════════════════════════════════════════════════════════════ */
/* SVG path from stroke outline                                       */
/* ═══════════════════════════════════════════════════════════════════ */

function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc: (string | number)[], [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'],
  );
  d.push('Z');
  return d.join(' ');
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Module state — one freehand session per canvas                     */
/* ═══════════════════════════════════════════════════════════════════ */

const stateMap = new WeakMap<FabricCanvas, FreehandState>();
const handlerMap = new WeakMap<FabricCanvas, {
  down: (e: any) => void;
  move: (e: any) => void;
  up: () => void;
}>();

function getState(canvas: FabricCanvas): FreehandState {
  let s = stateMap.get(canvas);
  if (!s) {
    s = {
      active: false,
      points: [],
      brushType: 'pen',
      color: DEFAULT_COLOR,
      width: DEFAULT_WIDTH,
    };
    stateMap.set(canvas, s);
  }
  return s;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Eraser state — separate from freehand drawing                      */
/* ═══════════════════════════════════════════════════════════════════ */

interface EraserState {
  brush: EraserBrush;
  width: number;
  /** Disposer for the 'end' event listener */
  endDisposer?: () => void;
  /** Disposer for the 'start' event listener */
  startDisposer?: () => void;
  onCheckpoint?: () => void;
  onCommit?: (label: string) => void;
}

const eraserMap = new WeakMap<FabricCanvas, EraserState>();

/* ═══════════════════════════════════════════════════════════════════ */
/* Core drawing handlers                                              */
/* ═══════════════════════════════════════════════════════════════════ */

function handlePointerDown(canvas: FabricCanvas, e: any) {
  const state = getState(canvas);
  const pointer = canvas.getScenePoint(e.e);

  // Save undo checkpoint
  state.onCheckpoint?.();

  state.active = true;
  state.points = [{
    x: pointer.x,
    y: pointer.y,
    pressure: (e.e as PointerEvent).pressure ?? 0.5,
  }];
}

function handlePointerMove(canvas: FabricCanvas, e: any) {
  const state = getState(canvas);
  if (!state.active) return;

  const pointer = canvas.getScenePoint(e.e);
  state.points.push({
    x: pointer.x,
    y: pointer.y,
    pressure: (e.e as PointerEvent).pressure ?? 0.5,
  });

  // ── Live stroke preview on the upper canvas ──────────────────
  if (state.points.length < 2) return;

  const inputPoints = state.points.map((p) => [p.x, p.y, p.pressure]);
  const options = getBrushOptions(state.brushType, state.width);
  const outlinePoints = getStroke(inputPoints, options);
  const pathData = getSvgPathFromStroke(outlinePoints);
  if (!pathData) return;

  const ctx = canvas.getTopContext();
  canvas.clearContext(ctx);

  ctx.save();

  // Apply viewport transform so preview matches canvas zoom/pan
  const vpt = canvas.viewportTransform;
  if (vpt) {
    ctx.transform(vpt[0], vpt[1], vpt[2], vpt[3], vpt[4], vpt[5]);
  }

  const path2d = new Path2D(pathData);
  ctx.fillStyle = state.color;
  ctx.globalAlpha = state.brushType === 'highlighter' ? 0.3 : 1;

  // Glow brush: draw shadow first, then fill
  if (state.brushType === 'glow') {
    ctx.shadowColor = state.color;
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  ctx.fill(path2d);
  ctx.restore();
}

function handlePointerUp(canvas: FabricCanvas) {
  const state = getState(canvas);
  if (!state.active) return;
  state.active = false;

  // Clear the live preview from the upper canvas
  canvas.clearContext(canvas.getTopContext());

  if (state.points.length < 2) return;

  // Convert points to format perfect-freehand expects: [x, y, pressure]
  const inputPoints = state.points.map((p) => [p.x, p.y, p.pressure]);

  // Get stroke outline
  const options = getBrushOptions(state.brushType, state.width);
  const outlinePoints = getStroke(inputPoints, options);
  const pathData = getSvgPathFromStroke(outlinePoints);

  if (!pathData) return;

  // Create Fabric.js Path
  const path = new Path(pathData, {
    fill: state.color,
    stroke: 'transparent',
    strokeWidth: 0,
    opacity: state.brushType === 'highlighter' ? 0.3 : 1,
    globalCompositeOperation: 'source-over',
    selectable: true,
    evented: true,
  });

  // Tag as freehand stroke so the eraser can target it.
  // Only freehand strokes have erasable: true — shapes, text, images,
  // pen tool paths, and template objects are NOT erasable.
  (path as any).__isFreehandStroke = true;
  (path as any).erasable = true;

  // Ensure these custom properties survive serialization (save/load/undo).
  // Fabric.js toObject() only serializes known properties by default.
  const origToObject = path.toObject.bind(path);
  (path as any).toObject = function(propertiesToInclude?: any) {
    return { ...origToObject(propertiesToInclude), erasable: true, __isFreehandStroke: true };
  };

  // Glow effect — add colored shadow
  if (state.brushType === 'glow') {
    path.shadow = new Shadow({
      color: state.color,
      blur: 12,
      offsetX: 0,
      offsetY: 0,
    });
  }

  canvas.add(path);
  canvas.renderAll();

  // Commit to undo history
  state.onCommit?.('Draw stroke');
  state.points = [];
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Public API — Freehand Drawing                                      */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Enable freehand drawing with perfect-freehand.
 * Disables Fabric.js isDrawingMode and uses custom pointer events instead.
 */
export function enableDrawing(
  canvas: FabricCanvas,
  color: string = DEFAULT_COLOR,
  width: number = DEFAULT_WIDTH,
  brushType: BrushType = 'pen',
  onCheckpoint?: () => void,
  onCommit?: (label: string) => void,
): void {
  // Make sure eraser is off first
  disableEraser(canvas);

  // Disable Fabric.js built-in drawing
  canvas.isDrawingMode = false;

  const state = getState(canvas);
  state.color = color;
  state.width = width;
  state.brushType = brushType;
  state.onCheckpoint = onCheckpoint;
  state.onCommit = onCommit;

  // Disable object selection while drawing
  canvas.selection = false;
  canvas.forEachObject((obj) => {
    obj.selectable = false;
    obj.evented = false;
  });

  // Set cursor to circle showing brush size
  const effectiveSize = getBrushOptions(brushType, width).size;
  canvas.defaultCursor = makeCircleCursor(effectiveSize);
  canvas.hoverCursor = makeCircleCursor(effectiveSize);

  // Remove any existing handlers
  const existing = handlerMap.get(canvas);
  if (existing) {
    canvas.off('mouse:down', existing.down);
    canvas.off('mouse:move', existing.move);
    canvas.off('mouse:up', existing.up);
  }

  // Bind new handlers
  const down = (e: any) => handlePointerDown(canvas, e);
  const move = (e: any) => handlePointerMove(canvas, e);
  const up = () => handlePointerUp(canvas);

  canvas.on('mouse:down', down);
  canvas.on('mouse:move', move);
  canvas.on('mouse:up', up);

  handlerMap.set(canvas, { down, move, up });
}

/**
 * Disable freehand drawing mode, returning to normal selection mode.
 */
export function disableDrawing(canvas: FabricCanvas): void {
  canvas.isDrawingMode = false;

  // Remove our custom handlers
  const handlers = handlerMap.get(canvas);
  if (handlers) {
    canvas.off('mouse:down', handlers.down);
    canvas.off('mouse:move', handlers.move);
    canvas.off('mouse:up', handlers.up);
    handlerMap.delete(canvas);
  }

  // Restore object selectability (skip infrastructure objects)
  canvas.selection = true;
  canvas.forEachObject((obj) => {
    if (isInfrastructure(obj)) return;
    obj.selectable = true;
    obj.evented = true;
  });

  // Restore cursor
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';

  // Clear active state
  const state = stateMap.get(canvas);
  if (state) {
    state.active = false;
    state.points = [];
  }
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Public API — Real Eraser (EraserBrush from @erase2d/fabric)        */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Enable eraser mode using @erase2d/fabric's EraserBrush.
 *
 * This is a true compositing eraser — it clips erasable objects so the
 * background shows through. Uses Fabric.js isDrawingMode=true (separate
 * from the custom perfect-freehand pointer system).
 *
 * @param canvas - Fabric.js canvas
 * @param width - Eraser width in pixels (default 20)
 * @param onCheckpoint - Called before each erase stroke for undo
 * @param onCommit - Called after each erase stroke for undo
 */
export function enableEraser(
  canvas: FabricCanvas,
  width: number = 20,
  onCheckpoint?: () => void,
  onCommit?: (label: string) => void,
): void {
  // Disable freehand drawing if active (they use separate systems)
  const freehandHandlers = handlerMap.get(canvas);
  if (freehandHandlers) {
    canvas.off('mouse:down', freehandHandlers.down);
    canvas.off('mouse:move', freehandHandlers.move);
    canvas.off('mouse:up', freehandHandlers.up);
    handlerMap.delete(canvas);
  }

  // If eraser already exists, just update the width
  let es = eraserMap.get(canvas);
  if (es) {
    es.brush.width = width;
    es.width = width;
    es.onCheckpoint = onCheckpoint;
    es.onCommit = onCommit;
    // Update cursor
    canvas.defaultCursor = makeEraserCursor(width);
    canvas.hoverCursor = makeEraserCursor(width);
    return;
  }

  // Create EraserBrush
  const eraser = new EraserBrush(canvas);
  eraser.width = width;

  // Assign it as the active brush and enable Fabric's drawing mode
  canvas.freeDrawingBrush = eraser;
  canvas.isDrawingMode = true;

  // Disable selection (Fabric handles this with isDrawingMode, but be explicit)
  canvas.selection = false;

  // Set up undo integration via eraser events
  const startDisposer = eraser.on('start', () => {
    onCheckpoint?.();
  });

  const endDisposer = eraser.on('end', () => {
    // Let the default commit happen (don't preventDefault), then commit to undo
    // Use a microtask to ensure the erase has been committed to the tree first
    queueMicrotask(() => {
      onCommit?.('Erase');
    });
  });

  // Set eraser cursor
  canvas.defaultCursor = makeEraserCursor(width);
  canvas.hoverCursor = makeEraserCursor(width);

  es = {
    brush: eraser,
    width,
    endDisposer,
    startDisposer,
    onCheckpoint,
    onCommit,
  };
  eraserMap.set(canvas, es);
}

/**
 * Disable eraser mode.
 */
export function disableEraser(canvas: FabricCanvas): void {
  const es = eraserMap.get(canvas);
  if (!es) return;

  // Clean up event listeners
  es.endDisposer?.();
  es.startDisposer?.();
  es.brush.dispose();

  // Disable Fabric drawing mode
  canvas.isDrawingMode = false;
  canvas.freeDrawingBrush = undefined as any;

  eraserMap.delete(canvas);
}

/**
 * Check whether eraser mode is currently active.
 */
export function isEraserActive(canvas: FabricCanvas): boolean {
  return eraserMap.has(canvas);
}

/**
 * Update eraser width. Only works when eraser mode is active.
 */
export function setEraserWidth(canvas: FabricCanvas, width: number): void {
  const es = eraserMap.get(canvas);
  if (es) {
    es.brush.width = width;
    es.width = width;
    canvas.defaultCursor = makeEraserCursor(width);
    canvas.hoverCursor = makeEraserCursor(width);
  }
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Public API — Drawing Settings (freehand only)                      */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Update the drawing brush color.
 */
export function setDrawingColor(canvas: FabricCanvas, color: string): void {
  const state = stateMap.get(canvas);
  if (state) {
    state.color = color;
  }
}

/**
 * Update the drawing brush width.
 * Updates the cursor to reflect the new size.
 */
export function setDrawingWidth(canvas: FabricCanvas, width: number): void {
  const state = stateMap.get(canvas);
  if (state) {
    state.width = width;
    // Update cursor size if freehand drawing is active
    if (handlerMap.has(canvas)) {
      const effectiveSize = getBrushOptions(state.brushType, width).size;
      canvas.defaultCursor = makeCircleCursor(effectiveSize);
      canvas.hoverCursor = makeCircleCursor(effectiveSize);
    }
  }
}

/**
 * Update the brush type.
 * Updates the cursor to reflect the new brush effective size.
 */
export function setDrawingBrushType(canvas: FabricCanvas, brushType: BrushType): void {
  const state = stateMap.get(canvas);
  if (state) {
    state.brushType = brushType;
    // Update cursor for new brush effective size
    if (handlerMap.has(canvas)) {
      const effectiveSize = getBrushOptions(brushType, state.width).size;
      canvas.defaultCursor = makeCircleCursor(effectiveSize);
      canvas.hoverCursor = makeCircleCursor(effectiveSize);
    }
  }
}

/**
 * Get the current brush type.
 */
export function getDrawingBrushType(canvas: FabricCanvas): BrushType {
  return getState(canvas).brushType;
}

export { DEFAULT_COLOR, DEFAULT_WIDTH };
export type { StrokePoint };
