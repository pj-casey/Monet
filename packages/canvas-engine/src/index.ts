/**
 * @monet/canvas-engine — Fabric.js wrapper and canvas logic.
 *
 * This is the ONLY package that imports Fabric.js directly.
 * React components never touch Fabric.js — they go through this package instead.
 */

export { CanvasEngine } from './canvas-engine';
export type { CanvasEngineOptions } from './canvas-engine';
export type { BrushType } from './drawing';
export type { CurvedTextOptions, CurvedTextMeta } from './curved-text';
export { isCurvedText, getCurvedTextMeta } from './curved-text';
export { extractPalette, extractPaletteFromUrl, extractPaletteFromFabricImage } from './color-extraction';
export { MIN_ZOOM, MAX_ZOOM } from './viewport';
export { DEFAULT_GRID_SIZE } from './grid';
export { PenTool, EditPointsMode } from './pen-tool';
export { renderTemplateThumbnail } from './thumbnail';
