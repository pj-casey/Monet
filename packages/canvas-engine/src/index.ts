/**
 * @monet/canvas-engine — Fabric.js wrapper and canvas logic.
 *
 * This is the ONLY package that imports Fabric.js directly.
 * React components never touch Fabric.js — they go through this package instead.
 */

export { CanvasEngine } from './canvas-engine';
export type { CanvasEngineOptions } from './canvas-engine';
export { MIN_ZOOM, MAX_ZOOM } from './viewport';
export { DEFAULT_GRID_SIZE } from './grid';
export { PenTool, EditPointsMode } from './pen-tool';
