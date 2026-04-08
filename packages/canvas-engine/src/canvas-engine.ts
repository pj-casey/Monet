/**
 * CanvasEngine — the core wrapper around Fabric.js.
 *
 * This is the ONLY place in the project that touches Fabric.js directly.
 * React components call methods on this class, and it translates them
 * into Fabric.js operations.
 *
 * The canvas has two layers conceptually:
 * 1. The "pasteboard" — the gray background area (handled by CSS)
 * 2. The "artboard" — the white design area where objects live
 *
 * The artboard is a Fabric.js Rect that sits on the canvas. When the user
 * zooms or pans, the viewport transform changes, but the artboard stays
 * at position (0, 0) in canvas coordinates.
 */

import { Canvas as FabricCanvas, Rect, Textbox, FabricImage, Path, Shadow, Gradient, Point, Group, ActiveSelection, FabricObject as FabricObjectClass, util, loadSVGFromString, type FabricObject } from 'fabric';

/**
 * Fabric.js v7 defaults originX/originY to 'center', meaning left/top
 * positions the CENTER of the object. We change this globally to 'left'/'top'
 * so left/top means the top-left corner — matching CSS, SVG, and how
 * everyone intuitively thinks about coordinates.
 */
FabricObjectClass.ownDefaults.originX = 'left';
FabricObjectClass.ownDefaults.originY = 'top';
import type { BackgroundOptions, ShapeOptions, SelectedObjectProps, TextOptions, ImageFilterValues, LayerInfo, DesignDocument } from '@monet/shared';
import { setupWheelZoom, setupPanning, fitToScreen, setZoom, disposeViewport } from './viewport';
import { drawGrid, removeGrid, snapToGrid, DEFAULT_GRID_SIZE } from './grid';
import { setupSmartGuides, clearGuides } from './guides';
import { HistoryManager } from './history';
import { applyBackground } from './background';
import { createShape } from './shapes';
import { createText, updateTextProps, readTextProps, loadGoogleFont } from './text';
import { loadImageFromFile, applyFilters, readFilterValues } from './images';
import {
  enableDrawing,
  disableDrawing,
  enableEraser,
  setDrawingColor as setBrushColor,
  setDrawingWidth as setBrushWidth,
} from './drawing';
import { getLayerList } from './layers';
import { serializeCanvas, deserializeCanvas } from './serialization';
import { exportCanvas } from './export';
import type { ExportOptions } from './export';
import type { TaggedObject } from './tagged-object';
import { PenTool, EditPointsMode } from './pen-tool';

/** Options for initializing the canvas */
export interface CanvasEngineOptions {
  /** Width of the artboard in pixels */
  width: number;
  /** Height of the artboard in pixels */
  height: number;
  /** Background options for the artboard */
  background?: BackgroundOptions;
  /** Callback when zoom level changes */
  onZoomChange?: (zoom: number) => void;
  /** Callback when undo/redo availability changes */
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
  /** Callback when the selected object changes (null = nothing selected) */
  onSelectionChange?: (props: SelectedObjectProps | null) => void;
  /** Returns the current active tool (so engine knows when text tool is active) */
  getActiveTool?: () => string;
  /** Callback when the layer list changes (objects added/removed/reordered) */
  onLayersChange?: (layers: LayerInfo[]) => void;
}

export class CanvasEngine {
  /** The Fabric.js canvas instance */
  private canvas: FabricCanvas | null = null;
  /** The artboard rectangle (the white design area) */
  private artboard: Rect | null = null;
  /** Background image object if one exists */
  private bgImage: FabricObject | null = null;
  /** Current grid lines (empty if grid is off) */
  private gridLines: FabricObject[] = [];
  /** Undo/redo manager */
  private history = new HistoryManager();
  /** Current artboard dimensions */
  private artboardWidth = 0;
  private artboardHeight = 0;
  /** Grid size in pixels */
  private gridSize = DEFAULT_GRID_SIZE;
  /** Whether grid snapping is currently on */
  private snapEnabled = false;
  /** Whether smart guides are enabled */
  private guidesEnabled = true;
  /** Stored callbacks */
  private onZoomChange?: (zoom: number) => void;
  private onSelectionChange?: (props: SelectedObjectProps | null) => void;
  /** Function that returns the current active tool (set by React) */
  private getActiveTool?: () => string;
  /** Callback when layers change */
  private onLayersChange?: (layers: LayerInfo[]) => void;
  /** Clipboard for copy/paste (stores serialized object data) */
  private clipboard: Record<string, unknown> | null = null;
  /** Pen tool instance for vector path creation */
  private penTool = new PenTool();
  /** Edit points mode instance for reshaping existing paths */
  private editPointsMode = new EditPointsMode();

  /**
   * Initialize the canvas engine.
   *
   * This creates the Fabric.js canvas, draws the artboard rectangle,
   * sets up zoom/pan controls, smart guides, and undo/redo tracking.
   *
   * @param element - The HTML <canvas> element to render on
   * @param containerWidth - Width of the container (browser area available)
   * @param containerHeight - Height of the container
   * @param options - Artboard dimensions and callbacks
   */
  init(
    element: HTMLCanvasElement,
    containerWidth: number,
    containerHeight: number,
    options: CanvasEngineOptions,
  ): void {
    if (this.canvas) {
      this.dispose();
    }

    this.artboardWidth = options.width;
    this.artboardHeight = options.height;
    this.onZoomChange = options.onZoomChange;
    this.onSelectionChange = options.onSelectionChange;
    this.getActiveTool = options.getActiveTool;
    this.onLayersChange = options.onLayersChange;

    // Create the Fabric.js canvas at the container size (NOT artboard size)
    // The artboard is a rectangle that sits within this larger canvas
    this.canvas = new FabricCanvas(element, {
      width: containerWidth,
      height: containerHeight,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
    });

    // Create the artboard — the white rectangle where the design lives
    this.createArtboard(options.background);

    // Set up zoom (mouse wheel) and pan (space + drag)
    setupWheelZoom(this.canvas, options.onZoomChange);
    setupPanning(this.canvas);

    // Set up smart guides (alignment lines when dragging objects)
    // Pass a callback so guides check if they're enabled before showing
    setupSmartGuides(
      this.canvas,
      this.artboardWidth,
      this.artboardHeight,
      () => this.guidesEnabled,
    );

    // Set up snap-to-grid handling
    this.setupSnapping();

    // Set up undo/redo
    this.history.init(this.canvas, options.onHistoryChange);
    this.setupHistoryTracking();

    // Set up selection change notifications (so the properties panel updates)
    this.setupSelectionTracking();

    // Record freehand strokes for undo/redo:
    // Save checkpoint before each stroke starts (mouse down while drawing)
    this.canvas.on('mouse:down:before', () => {
      if (this.canvas?.isDrawingMode) {
        this.history.saveCheckpoint();
      }
    });
    // Commit after the stroke finishes and becomes a Path object
    this.canvas.on('path:created', () => {
      this.history.commit('Draw stroke');
    });

    // Notify the layer panel whenever objects are added, removed, or reordered
    this.canvas.on('object:added', () => this.emitLayersChange());
    this.canvas.on('object:removed', () => this.emitLayersChange());

    // Set up double-click to add text (when text tool active) or edit existing text
    this.setupDoubleClick();

    // Load the default font (Inter) so it's ready for text and templates
    loadGoogleFont('Inter');
    loadGoogleFont('Playfair Display');

    // Center the artboard in the viewport (fit to screen)
    fitToScreen(this.canvas, this.artboardWidth, this.artboardHeight, options.onZoomChange);
  }

  /** Clean up everything when the component unmounts */
  dispose(): void {
    if (this.canvas) {
      disposeViewport(this.canvas);
      this.history.dispose();
      this.canvas.dispose();
      this.canvas = null;
    }
    this.artboard = null;
    this.bgImage = null;
    this.gridLines = [];
  }

  // ─── Artboard ──────────────────────────────────────────────────────

  /**
   * Create the artboard rectangle.
   *
   * The artboard is a white rectangle with a subtle shadow that makes it
   * look like a piece of paper floating on the gray pasteboard.
   */
  private createArtboard(background?: BackgroundOptions): void {
    if (!this.canvas) return;

    this.artboard = new Rect({
      left: 0,
      top: 0,
      width: this.artboardWidth,
      height: this.artboardHeight,
      fill: '#ffffff',
      selectable: false,
      evented: false,
      excludeFromExport: true,
      objectCaching: false,
      shadow: new Shadow({
        color: 'rgba(0, 0, 0, 0.12)',
        blur: 24,
        offsetX: 0,
        offsetY: 4,
      }),
    });


    // Tag it so other modules can identify it
    (this.artboard as TaggedObject).__isArtboard = true;

    this.canvas.add(this.artboard);
    this.canvas.sendObjectToBack(this.artboard);

    // Apply background if provided
    if (background) {
      this.setBackground(background);
    }
  }

  /**
   * Change the artboard dimensions.
   *
   * @param width - New width in pixels
   * @param height - New height in pixels
   */
  setArtboardDimensions(width: number, height: number): void {
    if (!this.canvas || !this.artboard) return;

    // Skip if dimensions haven't actually changed — prevents the React
    // useEffect from rebuilding the artboard after fromJSON already set it
    if (width === this.artboardWidth && height === this.artboardHeight) return;

    // Rebuild artboard from scratch to avoid Fabric.js render cache issues
    const currentBg = this.currentBackground;
    this.canvas.remove(this.artboard);
    this.artboardWidth = width;
    this.artboardHeight = height;
    this.createArtboard(currentBg);

    // Redraw grid if it's showing
    if (this.gridLines.length > 0) {
      removeGrid(this.canvas, this.gridLines);
      this.gridLines = drawGrid(this.canvas, width, height, this.gridSize);
      this.canvas.sendObjectToBack(this.artboard!);
    }

    this.canvas.requestRenderAll();
    this.fitToScreen();
  }

  /** Get current artboard dimensions */
  getArtboardDimensions(): { width: number; height: number } {
    return { width: this.artboardWidth, height: this.artboardHeight };
  }

  // ─── Viewport (Zoom & Pan) ────────────────────────────────────────

  /**
   * Fit the artboard in the viewport with padding.
   * Called automatically on init and when artboard dimensions change.
   */
  fitToScreen(): void {
    if (!this.canvas) return;
    fitToScreen(this.canvas, this.artboardWidth, this.artboardHeight, this.onZoomChange);
  }

  /**
   * Set the zoom level.
   * @param zoom - Zoom level (1 = 100%, 0.5 = 50%, 2 = 200%)
   */
  setZoom(zoom: number): void {
    if (!this.canvas) return;
    setZoom(this.canvas, zoom, this.onZoomChange);
  }

  /** Get the current zoom level */
  getZoom(): number {
    return this.canvas?.getZoom() ?? 1;
  }

  /**
   * Resize the canvas to match its container.
   * Call this when the browser window resizes.
   */
  resize(containerWidth: number, containerHeight: number): void {
    if (!this.canvas) return;
    this.canvas.setDimensions({ width: containerWidth, height: containerHeight });
    this.canvas.requestRenderAll();
  }

  // ─── Grid ─────────────────────────────────────────────────────────

  /**
   * Show or hide the grid on the artboard.
   *
   * @param visible - Whether the grid should be visible
   * @param gridSize - Optional grid spacing (default 20px)
   */
  setGridVisible(visible: boolean, gridSize?: number): void {
    if (!this.canvas || !this.artboard) return;

    if (gridSize !== undefined) {
      this.gridSize = gridSize;
    }

    // Remove existing grid lines
    if (this.gridLines.length > 0) {
      removeGrid(this.canvas, this.gridLines);
      this.gridLines = [];
    }

    // Draw new grid if requested
    if (visible) {
      this.gridLines = drawGrid(this.canvas, this.artboardWidth, this.artboardHeight, this.gridSize);
      // Keep artboard behind the grid
      this.canvas.sendObjectToBack(this.artboard);
    }
  }

  /**
   * Enable or disable snap-to-grid.
   * When enabled, objects jump to the nearest grid line when dragged.
   */
  setSnapToGrid(enabled: boolean): void {
    this.snapEnabled = enabled;
  }

  /** Set up the event listener that snaps objects to the grid */
  private setupSnapping(): void {
    if (!this.canvas) return;

    this.canvas.on('object:moving', (opt) => {
      if (this.snapEnabled && opt.target) {
        snapToGrid(opt.target, this.gridSize);
      }
    });
  }

  /**
   * Lock or unlock aspect ratio for resize handles.
   * When locked, corner drag handles scale proportionally.
   * Users can hold Shift to temporarily toggle the behavior.
   */
  setLockAspectRatio(locked: boolean): void {
    if (!this.canvas) return;
    this.canvas.uniformScaling = locked;
  }

  /**
   * Get the Fabric.js viewport transform (for ruler rendering).
   * Returns [scaleX, skewY, skewX, scaleY, translateX, translateY].
   */
  getViewportTransform(): number[] {
    return this.canvas?.viewportTransform ? [...this.canvas.viewportTransform] : [1, 0, 0, 1, 0, 0];
  }

  // ─── Smart Guides ─────────────────────────────────────────────────

  /**
   * Enable or disable smart guides.
   * Smart guides show alignment lines when dragging objects near each other.
   */
  setGuidesEnabled(enabled: boolean): void {
    this.guidesEnabled = enabled;
    if (!enabled && this.canvas) {
      clearGuides(this.canvas);
    }
  }

  // ─── History (Undo / Redo) ────────────────────────────────────────

  /** Undo the last action */
  undo(): void {
    this.history.undo();
  }

  /** Redo a previously undone action */
  redo(): void {
    this.history.redo();
  }

  /** Whether there's an action to undo */
  canUndo(): boolean {
    return this.history.canUndo();
  }

  /** Whether there's an action to redo */
  canRedo(): boolean {
    return this.history.canRedo();
  }

  /**
   * Set up automatic history tracking.
   *
   * Listens for Fabric.js events that indicate objects have been modified
   * (moved, resized, rotated, etc.) and records them for undo/redo.
   */
  private setupHistoryTracking(): void {
    if (!this.canvas) return;

    // Save checkpoint before any transform starts
    this.canvas.on('before:transform', () => {
      this.history.saveCheckpoint();
    });

    // Commit after an object is modified (moved, resized, rotated, etc.)
    this.canvas.on('object:modified', () => {
      this.history.commit('Modify object');
    });
  }

  /**
   * Save a history checkpoint manually.
   * Call before programmatic changes (like adding/removing objects).
   */
  saveHistoryCheckpoint(): void {
    this.history.saveCheckpoint();
  }

  /**
   * Commit a history entry manually.
   * Call after programmatic changes.
   */
  commitHistory(description: string): void {
    this.history.commit(description);
  }

  // ─── Background ───────────────────────────────────────────────────

  /**
   * Change the artboard background.
   *
   * @param options - Background type and value:
   *   - { type: 'solid', value: '#ff0000' } — solid red
   *   - { type: 'gradient', value: 'linear:to-bottom:#ff0000:#0000ff' } — red to blue
   *   - { type: 'image', value: 'https://...' } — image URL
   */
  async setBackground(options: BackgroundOptions): Promise<void> {
    if (!this.canvas || !this.artboard) return;
    this.currentBackground = options;
    this.bgImage = await applyBackground(this.canvas, this.artboard, options);
    if (this.bgImage) {
      // Make sure artboard is still at the bottom
      this.canvas.sendObjectToBack(this.artboard);
    }
  }

  // ─── Text ──────────────────────────────────────────────────────────

  /**
   * Add a text object to the center of the artboard.
   *
   * @param options - Text content and styling
   */
  addText(options: TextOptions = {}): void {
    if (!this.canvas) return;

    const cx = this.artboardWidth / 2;
    const cy = this.artboardHeight / 2;
    const textObj = createText(options, cx, cy);

    this.history.saveCheckpoint();
    this.canvas.add(textObj);
    this.canvas.setActiveObject(textObj);
    this.canvas.requestRenderAll();
    this.history.commit('Add text');
    this.emitSelectionChange();
  }

  /**
   * Add a text object at a specific position (canvas screen coords).
   * Used when the user double-clicks the canvas with the text tool.
   */
  private addTextAtScreenPoint(screenX: number, screenY: number): void {
    if (!this.canvas) return;

    // Convert screen coordinates to canvas coordinates (accounting for zoom/pan)
    // Invert the viewport transform to map from screen space to canvas space
    const vpt = this.canvas.viewportTransform;
    const invertedVpt = util.invertTransform(vpt);
    const point = util.transformPoint(new Point(screenX, screenY), invertedVpt);
    const textObj = createText({}, point.x, point.y);

    this.history.saveCheckpoint();
    this.canvas.add(textObj);
    this.canvas.setActiveObject(textObj);

    // Enter editing mode immediately so the user can start typing
    if (textObj instanceof Textbox) {
      textObj.enterEditing();
      textObj.selectAll();
    }

    this.canvas.requestRenderAll();
    this.history.commit('Add text');
    this.emitSelectionChange();
  }

  /**
   * Update text-specific properties of the selected text object.
   *
   * This handles font family, size, weight, style, alignment, etc.
   * If the font family changes, it loads the Google Font first.
   */
  async updateSelectedTextProps(props: Partial<TextOptions>): Promise<void> {
    if (!this.canvas) return;

    const active = this.canvas.getActiveObject();
    if (!active || !(active instanceof Textbox)) return;

    this.history.saveCheckpoint();
    await updateTextProps(active, props);
    this.canvas.requestRenderAll();
    this.history.commit('Update text');
    this.emitSelectionChange();
  }

  /**
   * Set up double-click handling.
   *
   * - If the text tool is active and the user double-clicks empty space,
   *   a new text object is created at that position.
   * - If the user double-clicks an existing text object (regardless of tool),
   *   Fabric.js automatically enters text editing mode.
   */
  private setupDoubleClick(): void {
    if (!this.canvas) return;

    this.canvas.on('mouse:dblclick', (opt) => {
      // If the user clicked on an existing object, Fabric handles editing
      if (opt.target) return;

      // Only add text on double-click if the text tool is active
      if (this.getActiveTool?.() === 'text') {
        const evt = opt.e as MouseEvent;
        this.addTextAtScreenPoint(evt.offsetX, evt.offsetY);
      }
    });
  }

  // ─── Images ────────────────────────────────────────────────────────

  /**
   * Add an image from a File object (from file picker or drag-and-drop).
   *
   * The image is loaded, scaled to fit the artboard, and placed at center.
   * Records the action for undo/redo.
   *
   * @param file - The image file to add
   */
  async addImageFromFile(file: File): Promise<void> {
    if (!this.canvas) return;

    const cx = this.artboardWidth / 2;
    const cy = this.artboardHeight / 2;
    const img = await loadImageFromFile(file, this.artboardWidth, this.artboardHeight, cx, cy);

    this.history.saveCheckpoint();
    this.canvas.add(img);
    this.canvas.setActiveObject(img);
    this.canvas.requestRenderAll();
    this.history.commit('Add image');
    this.emitSelectionChange();
  }

  /**
   * Add an image from a File at a specific screen position (for drag-and-drop).
   *
   * @param file - The image file
   * @param screenX - Drop X position in screen pixels
   * @param screenY - Drop Y position in screen pixels
   */
  async addImageAtPosition(file: File, screenX: number, screenY: number): Promise<void> {
    if (!this.canvas) return;

    const vpt = this.canvas.viewportTransform;
    const invertedVpt = util.invertTransform(vpt);
    const point = util.transformPoint(new Point(screenX, screenY), invertedVpt);

    const img = await loadImageFromFile(file, this.artboardWidth, this.artboardHeight, point.x, point.y);

    this.history.saveCheckpoint();
    this.canvas.add(img);
    this.canvas.setActiveObject(img);
    this.canvas.requestRenderAll();
    this.history.commit('Add image');
    this.emitSelectionChange();
  }

  /**
   * Update the filter values of the currently selected image.
   *
   * Filters adjust how the image looks without changing the original:
   * - brightness: -1 (dark) to 1 (light), 0 = normal
   * - contrast: -1 (flat) to 1 (high), 0 = normal
   * - saturation: -1 (grayscale) to 1 (vivid), 0 = normal
   * - blur: 0 (sharp) to 1 (blurry)
   */
  updateImageFilters(values: ImageFilterValues): void {
    if (!this.canvas) return;

    const active = this.canvas.getActiveObject();
    if (!active || !(active instanceof FabricImage)) return;

    this.history.saveCheckpoint();
    applyFilters(active, values);
    this.canvas.requestRenderAll();
    this.history.commit('Update image filters');
    this.emitSelectionChange();
  }

  /**
   * Replace the selected image with a new image from a data URL.
   * Used by background removal to swap in the processed result.
   */
  async replaceSelectedImage(newDataUrl: string): Promise<void> {
    if (!this.canvas) return;

    const active = this.canvas.getActiveObject();
    if (!active || !(active instanceof FabricImage)) return;

    // Remember position and size of the current image
    const { left, top, scaleX, scaleY, angle } = active;

    this.history.saveCheckpoint();

    // Create a new image from the data URL
    const newImg = await FabricImage.fromURL(newDataUrl);
    newImg.set({ left, top, scaleX, scaleY, angle });

    // Remove old, add new
    this.canvas.remove(active);
    this.canvas.add(newImg);
    this.canvas.setActiveObject(newImg);
    this.canvas.requestRenderAll();
    this.history.commit('Remove background');
    this.emitSelectionChange();
    this.emitLayersChange();
  }

  /**
   * Get the data URL of the currently selected image.
   * Returns null if no image is selected.
   */
  getSelectedImageDataUrl(): string | null {
    if (!this.canvas) return null;

    const active = this.canvas.getActiveObject();
    if (!active || !(active instanceof FabricImage)) return null;

    // Render the image to a temporary canvas to get its data URL
    const el = active.getElement();
    if (!el || !(el instanceof HTMLImageElement || el instanceof HTMLCanvasElement)) return null;

    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = active.width ?? 100;
    tmpCanvas.height = active.height ?? 100;
    const ctx = tmpCanvas.getContext('2d');
    if (!ctx) return null;

    if (el instanceof HTMLImageElement) {
      ctx.drawImage(el, 0, 0);
    } else {
      ctx.drawImage(el, 0, 0);
    }

    return tmpCanvas.toDataURL('image/png');
  }

  /**
   * Add an image from a URL (e.g., Unsplash photo URL) to the canvas center.
   */
  async addImageFromUrl(url: string): Promise<void> {
    if (!this.canvas) return;

    const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    const imgW = img.width ?? 1;
    const imgH = img.height ?? 1;
    const scale = Math.min(
      (this.artboardWidth * 0.8) / imgW,
      (this.artboardHeight * 0.8) / imgH,
      1,
    );
    img.set({
      left: this.artboardWidth / 2 - (imgW * scale) / 2,
      top: this.artboardHeight / 2 - (imgH * scale) / 2,
      scaleX: scale,
      scaleY: scale,
    });

    this.history.saveCheckpoint();
    this.canvas.add(img);
    this.canvas.setActiveObject(img);
    this.canvas.requestRenderAll();
    this.history.commit('Add image');
    this.emitSelectionChange();
  }

  /**
   * Add an SVG icon to the canvas center.
   *
   * Takes an array of SVG path `d` strings (from our icon library),
   * creates Path objects, groups them, scales to a nice default size,
   * and places them at the artboard center.
   *
   * @param paths - Array of SVG path data strings
   * @param color - Fill/stroke color for the icon
   */
  addSvgIcon(paths: string[], color: string = '#333333'): void {
    if (!this.canvas) return;

    const fabricPaths = paths.map((d) => new Path(d, {
      fill: 'none',
      stroke: color,
      strokeWidth: 2,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
    }));

    let icon: FabricObject;
    if (fabricPaths.length === 1) {
      icon = fabricPaths[0];
    } else {
      icon = new Group(fabricPaths);
    }

    // Scale icon to ~100px (Lucide icons are 24x24 viewBox)
    const iconScale = 100 / 24;
    icon.set({
      scaleX: iconScale,
      scaleY: iconScale,
      left: this.artboardWidth / 2 - 50,
      top: this.artboardHeight / 2 - 50,
    });

    this.history.saveCheckpoint();
    this.canvas.add(icon);
    this.canvas.setActiveObject(icon);
    this.canvas.requestRenderAll();
    this.history.commit('Add icon');
    this.emitSelectionChange();
  }

  /**
   * Add an SVG icon from a complete SVG string.
   *
   * Unlike addSvgIcon (which only handles <path> elements), this method
   * uses Fabric.js's SVG parser to handle ALL SVG element types: path,
   * circle, rect, line, polyline, ellipse, polygon.
   *
   * Used by the Lucide icon integration where icons contain mixed
   * SVG element types.
   *
   * @param svgString - Complete SVG markup string
   * @param color - Stroke color for the icon (default: '#333333')
   */
  async addSvgFromString(svgString: string, color: string = '#333333'): Promise<void> {
    if (!this.canvas) return;

    const { objects } = await loadSVGFromString(svgString);
    const validObjects = objects.filter((obj): obj is FabricObject => obj !== null);
    if (validObjects.length === 0) return;

    // Apply stroke color to all child elements
    for (const obj of validObjects) {
      obj.set({
        stroke: color,
        fill: 'none',
        strokeWidth: 2,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
      });
    }

    let icon: FabricObject;
    if (validObjects.length === 1) {
      icon = validObjects[0];
    } else {
      icon = new Group(validObjects);
    }

    // Scale icon to ~100px (Lucide icons are 24×24 viewBox)
    const iconScale = 100 / 24;
    icon.set({
      scaleX: iconScale,
      scaleY: iconScale,
      left: this.artboardWidth / 2 - 50,
      top: this.artboardHeight / 2 - 50,
    });

    this.history.saveCheckpoint();
    this.canvas.add(icon);
    this.canvas.setActiveObject(icon);
    this.canvas.requestRenderAll();
    this.history.commit('Add icon');
    this.emitSelectionChange();
  }

  /**
   * Add an SVG illustration to the canvas.
   *
   * Unlike addSvgFromString (which overrides fills for monochrome icons),
   * this method preserves the original fill colors and styling of the SVG.
   * Illustrations are scaled to fit 80% of the artboard width and centered.
   *
   * @param svgString - Complete SVG markup string with fills/colors
   */
  async addIllustration(svgString: string): Promise<void> {
    if (!this.canvas) return;

    const { objects } = await loadSVGFromString(svgString);
    const validObjects = objects.filter((obj): obj is FabricObject => obj !== null);
    if (validObjects.length === 0) return;

    // Group all elements — keep original fill/stroke colors
    const group = new Group(validObjects);

    // Guard against empty/degenerate groups
    if (!group.width || !group.height) return;

    // Scale to fit 80% of artboard width, maintaining aspect ratio
    const maxWidth = this.artboardWidth * 0.8;
    const maxHeight = this.artboardHeight * 0.8;
    const scale = Math.min(maxWidth / group.width, maxHeight / group.height, 1);

    group.set({
      scaleX: scale,
      scaleY: scale,
      left: this.artboardWidth / 2 - (group.width * scale) / 2,
      top: this.artboardHeight / 2 - (group.height * scale) / 2,
    });

    this.history.saveCheckpoint();
    this.canvas.add(group);
    this.canvas.setActiveObject(group);
    this.canvas.requestRenderAll();
    this.history.commit('Add illustration');
    this.emitSelectionChange();
  }

  // ─── Shapes ────────────────────────────────────────────────────────

  /**
   * Add a shape to the center of the artboard.
   *
   * Creates a Fabric.js shape object and places it at the artboard center.
   * Records the action for undo/redo.
   *
   * @param options - What shape to create and how it should look
   * @returns The ID of the created shape (for future reference)
   */
  addShape(options: ShapeOptions): string {
    if (!this.canvas) return '';

    const cx = this.artboardWidth / 2;
    const cy = this.artboardHeight / 2;
    const shape = createShape(options, cx, cy);

    // Record for undo
    this.history.saveCheckpoint();
    this.canvas.add(shape);
    this.canvas.setActiveObject(shape);
    this.canvas.requestRenderAll();
    this.history.commit(`Add ${options.type}`);

    // Notify UI of the new selection
    this.emitSelectionChange();

    return (shape as TaggedObject).__id ?? '';
  }

  // ─── Object Editing ───────────────────────────────────────────────

  /**
   * Update properties of the currently selected object.
   *
   * This is how the properties panel changes fill, stroke, opacity, etc.
   * Changes are recorded for undo/redo.
   *
   * @param props - Partial set of properties to update
   */
  updateSelectedObject(props: Partial<{
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    cornerRadius: number;
    blendMode: string;
    left: number;
    top: number;
    width: number;
    height: number;
    angle: number;
  }>): void {
    if (!this.canvas) return;

    const active = this.canvas.getActiveObject();
    if (!active) return;

    this.history.saveCheckpoint();

    if (props.fill !== undefined) {
      active.set('fill', props.fill);
    }
    if (props.stroke !== undefined) {
      active.set('stroke', props.stroke);
    }
    if (props.strokeWidth !== undefined) {
      active.set('strokeWidth', props.strokeWidth);
    }
    if (props.opacity !== undefined) {
      active.set('opacity', props.opacity);
    }
    if (props.cornerRadius !== undefined && active instanceof Rect) {
      active.set('rx', props.cornerRadius);
      active.set('ry', props.cornerRadius);
    }
    if (props.blendMode !== undefined) {
      active.set('globalCompositeOperation', props.blendMode);
    }

    // ─── Precise positioning ─────────────────────────────
    if (props.left !== undefined) {
      active.set('left', props.left);
    }
    if (props.top !== undefined) {
      active.set('top', props.top);
    }
    if (props.width !== undefined && active.width) {
      active.set('scaleX', props.width / active.width);
    }
    if (props.height !== undefined && active.height) {
      active.set('scaleY', props.height / active.height);
    }
    if (props.angle !== undefined) {
      active.set('angle', props.angle);
    }

    active.setCoords();
    this.canvas.requestRenderAll();
    this.history.commit('Update properties');
    this.emitSelectionChange();
  }

  // ─── Clipping Masks ──────────────────────────────────────────────

  /**
   * Clip the top selected object to the bottom selected object's shape.
   *
   * Requires exactly 2 objects selected. The first (bottom) object in the
   * selection becomes the clipping shape, and the second (top) object gets
   * clipped. The clipping shape is removed from the canvas and applied as
   * the top object's clipPath.
   */
  async clipToShape(): Promise<void> {
    if (!this.canvas) return;

    const active = this.canvas.getActiveObject();
    if (!active || !(active instanceof ActiveSelection)) return;

    const objects = active.getObjects();
    if (objects.length !== 2) return;

    // Bottom object = mask shape, top object = gets clipped
    const maskShape = objects[0];
    const target = objects[1];

    this.history.saveCheckpoint();

    // Discard the active selection so we can manipulate individual objects
    this.canvas.discardActiveObject();

    // Clone the mask shape to use as clipPath.
    // absolutePositioned = true keeps it aligned with the canvas, not the target
    const cloned = await maskShape.clone() as FabricObject;
    cloned.set('absolutePositioned', true);
    target.set('clipPath', cloned);

    // Remove the mask shape from the canvas
    this.canvas.remove(maskShape);

    this.canvas.setActiveObject(target);
    this.canvas.requestRenderAll();
    this.history.commit('Clip to shape');
    this.emitSelectionChange();
    this.emitLayersChange();
  }

  /**
   * Remove the clipping mask from the currently selected object.
   * The clip shape is recreated on the canvas as a visible object.
   */
  unclipObject(): void {
    if (!this.canvas) return;

    const active = this.canvas.getActiveObject();
    if (!active || !active.clipPath) return;

    this.history.saveCheckpoint();

    const clipShape = active.clipPath as FabricObject;

    // Make the clip shape visible again on the canvas
    clipShape.set({
      absolutePositioned: false,
      selectable: true,
      evented: true,
      opacity: 0.5,
      fill: clipShape.fill || '#cccccc',
    });
    this.canvas.add(clipShape);

    // Remove the clip path
    active.set('clipPath', undefined);

    this.canvas.requestRenderAll();
    this.history.commit('Remove clip mask');
    this.emitSelectionChange();
    this.emitLayersChange();
  }

  /**
   * Delete the currently selected object(s) from the canvas.
   */
  deleteSelectedObjects(): void {
    if (!this.canvas) return;

    const active = this.canvas.getActiveObject();
    if (!active) return;

    this.history.saveCheckpoint();
    this.canvas.remove(active);
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.history.commit('Delete object');
    this.onSelectionChange?.(null);
  }

  // ─── Selection ────────────────────────────────────────────────────

  /**
   * Get the properties of the currently selected object.
   * Returns null if nothing is selected.
   */
  getSelectedObjectProps(): SelectedObjectProps | null {
    if (!this.canvas) return null;

    const active = this.canvas.getActiveObject();
    if (!active) return null;

    const fillValue = active.fill;
    let fillStr = '';
    if (typeof fillValue === 'string') {
      fillStr = fillValue;
    } else if (fillValue instanceof Gradient) {
      fillStr = '(gradient)';
    }

    const result: SelectedObjectProps = {
      id: (active as TaggedObject).__id ?? '',
      objectType: active.type ?? 'object',
      fill: fillStr,
      stroke: (active.stroke as string) ?? '',
      strokeWidth: active.strokeWidth ?? 0,
      opacity: active.opacity ?? 1,
      cornerRadius: active instanceof Rect ? (active.rx ?? 0) : 0,
      left: active.left ?? 0,
      top: active.top ?? 0,
      width: (active.width ?? 0) * (active.scaleX ?? 1),
      height: (active.height ?? 0) * (active.scaleY ?? 1),
      angle: active.angle ?? 0,
      blendMode: (active.globalCompositeOperation as string) ?? 'source-over',
      hasClipPath: !!active.clipPath,
    };

    // Add image-specific properties if it's an image object
    if (active instanceof FabricImage) {
      const filterVals = readFilterValues(active);
      result.filterBrightness = filterVals.brightness;
      result.filterContrast = filterVals.contrast;
      result.filterSaturation = filterVals.saturation;
      result.filterBlur = filterVals.blur;
      result.filterHueRotation = filterVals.hueRotation;
      result.filterNoise = filterVals.noise;
      result.filterSharpen = filterVals.sharpen;
      result.filterTintColor = filterVals.tintColor;
      result.filterTintAlpha = filterVals.tintAlpha;
      result.filterVignette = filterVals.vignette;
    }

    // Add text-specific properties if it's a text object
    if (active instanceof Textbox) {
      const textProps = readTextProps(active);
      result.text = textProps.text;
      result.fontFamily = textProps.fontFamily;
      result.fontSize = textProps.fontSize;
      result.fontWeight = textProps.fontWeight;
      result.fontStyle = textProps.fontStyle;
      result.underline = textProps.underline;
      result.textAlign = textProps.textAlign;
      result.lineHeight = textProps.lineHeight;
      result.charSpacing = textProps.charSpacing;
    }

    return result;
  }

  /**
   * Listen for selection changes on the canvas and notify the UI.
   */
  private setupSelectionTracking(): void {
    if (!this.canvas) return;

    this.canvas.on('selection:created', () => this.emitSelectionChange());
    this.canvas.on('selection:updated', () => this.emitSelectionChange());
    this.canvas.on('selection:cleared', () => this.onSelectionChange?.(null));
  }

  /** Read current selection and fire the callback */
  private emitSelectionChange(): void {
    const props = this.getSelectedObjectProps();
    this.onSelectionChange?.(props);
  }

  // ─── Layers ────────────────────────────────────────────────────────

  /** Get the current layer list (front-to-back order) */
  getLayers(): LayerInfo[] {
    if (!this.canvas) return [];
    return getLayerList(this.canvas);
  }

  /**
   * Move a layer from one z-index to another.
   * Both indices refer to the Fabric.js object array (0 = back).
   */
  reorderLayer(fromFabricIndex: number, toFabricIndex: number): void {
    if (!this.canvas) return;
    const objects = this.canvas.getObjects();
    const obj = objects[fromFabricIndex];
    if (!obj) return;

    this.history.saveCheckpoint();
    this.canvas.remove(obj);

    // Re-get objects after removal and insert at correct position
    const allObjs = this.canvas.getObjects();
    const insertAt = Math.min(toFabricIndex, allObjs.length);
    // Add back and move to position
    this.canvas.add(obj);
    // Move to the desired z-position
    const currentIdx = this.canvas.getObjects().indexOf(obj);
    const delta = insertAt - currentIdx;
    if (delta > 0) {
      for (let i = 0; i < delta; i++) this.canvas.bringObjectForward(obj);
    } else if (delta < 0) {
      for (let i = 0; i < -delta; i++) this.canvas.sendObjectBackwards(obj);
    }

    this.canvas.requestRenderAll();
    this.history.commit('Reorder layer');
    this.emitLayersChange();
  }

  /** Select an object by its Fabric.js index (clicking a layer in the panel) */
  selectLayerByIndex(fabricIndex: number): void {
    if (!this.canvas) return;
    const obj = this.canvas.getObjects()[fabricIndex];
    if (!obj || !obj.selectable) return;
    this.canvas.setActiveObject(obj);
    this.canvas.requestRenderAll();
    this.emitSelectionChange();
  }

  /** Toggle whether a layer is locked (locked = can't be moved or edited) */
  toggleLayerLock(fabricIndex: number): void {
    if (!this.canvas) return;
    const obj = this.canvas.getObjects()[fabricIndex];
    if (!obj) return;

    const newLocked = obj.selectable !== false ? true : false;
    obj.set({
      selectable: !newLocked,
      evented: !newLocked,
      hasControls: !newLocked,
    });

    // If this object is currently selected and we just locked it, deselect
    if (newLocked && this.canvas.getActiveObject() === obj) {
      this.canvas.discardActiveObject();
    }

    this.canvas.requestRenderAll();
    this.emitLayersChange();
  }

  /** Toggle whether a layer is visible */
  toggleLayerVisibility(fabricIndex: number): void {
    if (!this.canvas) return;
    const obj = this.canvas.getObjects()[fabricIndex];
    if (!obj) return;

    obj.set('visible', !obj.visible);
    this.canvas.requestRenderAll();
    this.emitLayersChange();
  }

  /** Delete a specific layer by its Fabric.js index */
  deleteLayerByIndex(fabricIndex: number): void {
    if (!this.canvas) return;
    const obj = this.canvas.getObjects()[fabricIndex];
    if (!obj) return;

    this.history.saveCheckpoint();
    this.canvas.remove(obj);
    if (this.canvas.getActiveObject() === obj) {
      this.canvas.discardActiveObject();
      this.onSelectionChange?.(null);
    }
    this.canvas.requestRenderAll();
    this.history.commit('Delete layer');
    this.emitLayersChange();
  }

  /** Duplicate the currently selected object (offset by 20px so it's visible) */
  async duplicateSelected(): Promise<void> {
    if (!this.canvas) return;
    const active = this.canvas.getActiveObject();
    if (!active) return;

    this.history.saveCheckpoint();
    const cloned = await active.clone() as FabricObject;
    if (!this.canvas) return;
    cloned.set({ left: (cloned.left ?? 0) + 20, top: (cloned.top ?? 0) + 20 });
    cloned.setCoords();
    this.canvas.add(cloned);
    this.canvas.setActiveObject(cloned);
    this.canvas.requestRenderAll();
    this.history.commit('Duplicate');
    this.emitSelectionChange();
    this.emitLayersChange();
  }

  /** Copy the selected object to the internal clipboard */
  copySelected(): void {
    if (!this.canvas) return;
    const active = this.canvas.getActiveObject();
    if (!active) return;
    this.clipboard = active.toObject();
  }

  /** Paste from the internal clipboard */
  pasteClipboard(): void {
    if (!this.canvas || !this.clipboard) return;

    this.history.saveCheckpoint();
    util.enlivenObjects([this.clipboard]).then((objects) => {
      if (!this.canvas) return;
      for (const item of objects) {
        if (item && typeof (item as FabricObject).set === 'function') {
          const obj = item as FabricObject;
          obj.set({ left: (obj.left ?? 0) + 20, top: (obj.top ?? 0) + 20 });
          obj.setCoords();
          this.canvas.add(obj);
          this.canvas.setActiveObject(obj);
        }
      }
      this.canvas.requestRenderAll();
      this.history.commit('Paste');
      this.emitSelectionChange();
      this.emitLayersChange();
    });
  }

  /** Group the currently selected objects into a single group */
  groupSelected(): void {
    if (!this.canvas) return;
    const active = this.canvas.getActiveObject();
    if (!active || !(active instanceof ActiveSelection)) return;

    this.history.saveCheckpoint();
    const objects = active.getObjects();
    this.canvas.discardActiveObject();
    const group = new Group(objects);
    // Remove the individual objects and add the group
    for (const obj of objects) this.canvas.remove(obj);
    this.canvas.add(group);
    this.canvas.setActiveObject(group);
    this.canvas.requestRenderAll();
    this.history.commit('Group');
    this.emitSelectionChange();
    this.emitLayersChange();
  }

  /** Ungroup a group back into individual objects */
  ungroupSelected(): void {
    if (!this.canvas) return;
    const active = this.canvas.getActiveObject();
    if (!active || !(active instanceof Group)) return;

    this.history.saveCheckpoint();
    const objects = active.getObjects();
    this.canvas.remove(active);
    for (const obj of objects) {
      this.canvas.add(obj);
    }
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.history.commit('Ungroup');
    this.onSelectionChange?.(null);
    this.emitLayersChange();
  }

  /**
   * Nudge the selected object by a number of pixels.
   * Used for arrow key movement (1px normal, 10px with Shift held).
   */
  nudgeSelected(dx: number, dy: number): void {
    if (!this.canvas) return;
    const active = this.canvas.getActiveObject();
    if (!active) return;

    active.set({
      left: (active.left ?? 0) + dx,
      top: (active.top ?? 0) + dy,
    });
    active.setCoords();
    this.canvas.requestRenderAll();
  }

  // ─── Auto-Layout ──────────────────────────────────────────────────

  /**
   * Get the objects in the current selection.
   * Works for both ActiveSelection (multiple) and single objects.
   */
  private getSelectedObjects(): FabricObject[] {
    if (!this.canvas) return [];
    const active = this.canvas.getActiveObject();
    if (!active) return [];
    if (active instanceof ActiveSelection) {
      return active.getObjects();
    }
    return [active];
  }

  /**
   * Align all selected objects to a given edge or center.
   */
  alignSelected(alignment: 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom'): void {
    const objects = this.getSelectedObjects();
    if (objects.length < 2) return;

    this.history.saveCheckpoint();

    const bounds = objects.map((obj) => obj.getBoundingRect());

    switch (alignment) {
      case 'left': {
        const minLeft = Math.min(...bounds.map((b) => b.left));
        objects.forEach((obj, i) => obj.set('left', (obj.left ?? 0) + minLeft - bounds[i].left));
        break;
      }
      case 'right': {
        const maxRight = Math.max(...bounds.map((b) => b.left + b.width));
        objects.forEach((obj, i) => obj.set('left', (obj.left ?? 0) + maxRight - (bounds[i].left + bounds[i].width)));
        break;
      }
      case 'center-h': {
        const centerX = bounds.reduce((sum, b) => sum + b.left + b.width / 2, 0) / bounds.length;
        objects.forEach((obj, i) => obj.set('left', (obj.left ?? 0) + centerX - (bounds[i].left + bounds[i].width / 2)));
        break;
      }
      case 'top': {
        const minTop = Math.min(...bounds.map((b) => b.top));
        objects.forEach((obj, i) => obj.set('top', (obj.top ?? 0) + minTop - bounds[i].top));
        break;
      }
      case 'bottom': {
        const maxBottom = Math.max(...bounds.map((b) => b.top + b.height));
        objects.forEach((obj, i) => obj.set('top', (obj.top ?? 0) + maxBottom - (bounds[i].top + bounds[i].height)));
        break;
      }
      case 'center-v': {
        const centerY = bounds.reduce((sum, b) => sum + b.top + b.height / 2, 0) / bounds.length;
        objects.forEach((obj, i) => obj.set('top', (obj.top ?? 0) + centerY - (bounds[i].top + bounds[i].height / 2)));
        break;
      }
    }

    objects.forEach((obj) => obj.setCoords());
    this.canvas?.requestRenderAll();
    this.history.commit('Align objects');
  }

  /**
   * Distribute selected objects with equal spacing.
   */
  distributeSelected(direction: 'horizontal' | 'vertical'): void {
    const objects = this.getSelectedObjects();
    if (objects.length < 3) return;

    this.history.saveCheckpoint();

    const bounds = objects.map((obj, i) => ({ index: i, ...obj.getBoundingRect() }));

    if (direction === 'horizontal') {
      bounds.sort((a, b) => a.left - b.left);
      const totalWidth = bounds.reduce((sum, b) => sum + b.width, 0);
      const totalSpan = bounds[bounds.length - 1].left + bounds[bounds.length - 1].width - bounds[0].left;
      const gap = (totalSpan - totalWidth) / (bounds.length - 1);

      let currentX = bounds[0].left + bounds[0].width + gap;
      for (let i = 1; i < bounds.length - 1; i++) {
        const obj = objects[bounds[i].index];
        obj.set('left', (obj.left ?? 0) + currentX - bounds[i].left);
        currentX += bounds[i].width + gap;
      }
    } else {
      bounds.sort((a, b) => a.top - b.top);
      const totalHeight = bounds.reduce((sum, b) => sum + b.height, 0);
      const totalSpan = bounds[bounds.length - 1].top + bounds[bounds.length - 1].height - bounds[0].top;
      const gap = (totalSpan - totalHeight) / (bounds.length - 1);

      let currentY = bounds[0].top + bounds[0].height + gap;
      for (let i = 1; i < bounds.length - 1; i++) {
        const obj = objects[bounds[i].index];
        obj.set('top', (obj.top ?? 0) + currentY - bounds[i].top);
        currentY += bounds[i].height + gap;
      }
    }

    objects.forEach((obj) => obj.setCoords());
    this.canvas?.requestRenderAll();
    this.history.commit('Distribute objects');
  }

  /** Fire the layers change callback */
  private emitLayersChange(): void {
    if (!this.canvas) return;
    this.onLayersChange?.(getLayerList(this.canvas));
  }

  // ─── Drawing ──────────────────────────────────────────────────────

  /**
   * Enable freehand drawing (pen) mode.
   *
   * While active, clicking and dragging draws strokes instead of
   * selecting objects. Each finished stroke becomes a Path object.
   *
   * @param color - Pen color
   * @param width - Pen width in pixels
   */
  enableDrawing(color?: string, width?: number): void {
    if (!this.canvas) return;
    enableDrawing(this.canvas, color, width);
  }

  /**
   * Enable eraser mode — draws white strokes to cover content.
   *
   * @param width - Eraser width in pixels (default 20)
   */
  enableEraser(width?: number): void {
    if (!this.canvas) return;
    enableEraser(this.canvas, width);
  }

  /**
   * Disable drawing mode, returning to normal selection mode.
   */
  disableDrawing(): void {
    if (!this.canvas) return;
    disableDrawing(this.canvas);
  }

  /**
   * Change the drawing brush color (while drawing mode is active).
   */
  setDrawingColor(color: string): void {
    if (!this.canvas) return;
    setBrushColor(this.canvas, color);
  }

  /**
   * Change the drawing brush width (while drawing mode is active).
   */
  setDrawingWidth(width: number): void {
    if (!this.canvas) return;
    setBrushWidth(this.canvas, width);
  }

  // ─── Pen Tool (vector path creation) ────────────────────────────────

  /**
   * Activate the pen tool for creating custom vector shapes.
   * Click to place straight-line points, click+drag for bezier curves,
   * double-click or click start to close the path.
   */
  enablePenTool(): void {
    if (!this.canvas) return;
    // Disable drawing mode if active
    disableDrawing(this.canvas);
    this.penTool.activate(this.canvas, (path) => {
      // Callback when user finishes a path
      this.history.saveCheckpoint();
      this.canvas!.add(path);
      this.canvas!.setActiveObject(path);
      this.canvas!.requestRenderAll();
      this.history.commit('Add pen path');
      this.emitSelectionChange();
      this.emitLayersChange();
    });
  }

  /**
   * Deactivate the pen tool.
   * If a path is in progress, it will be discarded.
   */
  disablePenTool(): void {
    if (this.penTool.isActive()) {
      this.penTool.deactivate();
    }
  }

  /** Check if the pen tool is currently active */
  isPenToolActive(): boolean {
    return this.penTool.isActive();
  }

  // ─── Edit Points (reshape existing paths) ──────────────────────────

  /**
   * Enter edit-points mode for the currently selected path.
   * Shows draggable handles at each anchor point.
   */
  enterEditPoints(): void {
    if (!this.canvas) return;
    const active = this.canvas.getActiveObject();
    if (!active || !(active instanceof Path)) return;

    this.history.saveCheckpoint();
    this.editPointsMode.enter(this.canvas, active, () => {
      // Called when a point is moved
      this.canvas!.requestRenderAll();
    });
  }

  /**
   * Exit edit-points mode and commit the changes.
   */
  exitEditPoints(): void {
    if (this.editPointsMode.isActive()) {
      this.editPointsMode.exit();
      this.history.commit('Edit path points');
      this.emitLayersChange();
    }
  }

  /** Check if edit-points mode is active */
  isEditPointsActive(): boolean {
    return this.editPointsMode.isActive();
  }

  // ─── Serialization ─────────────────────────────────────────────────

  /** Current background setting (tracked for serialization) */
  private currentBackground: BackgroundOptions = { type: 'solid', value: '#ffffff' };

  /**
   * Save the current canvas state as a DesignDocument JSON.
   *
   * This captures all user objects, artboard dimensions, and background
   * into a JSON-serializable object that can be saved to a file or database.
   */
  toJSON(name: string = 'Untitled Design', existingId?: string): DesignDocument {
    if (!this.canvas) {
      return {
        version: 1, id: '', name, createdAt: '', updatedAt: '',
        dimensions: { width: 0, height: 0 },
        background: { type: 'solid', value: '#ffffff' },
        objects: [], metadata: {},
      };
    }
    return serializeCanvas(
      this.canvas, this.artboardWidth, this.artboardHeight,
      this.currentBackground, name, existingId,
    );
  }

  /**
   * Load a DesignDocument onto the canvas, replacing everything currently there.
   *
   * This:
   * 1. Resizes the artboard to the document's dimensions
   * 2. Applies the document's background
   * 3. Removes all existing user objects
   * 4. Recreates all objects from the saved JSON
   */
  async fromJSON(doc: DesignDocument): Promise<void> {
    if (!this.canvas || !this.artboard) return;
    // Remove the old artboard and create a fresh one at the new dimensions.
    this.canvas.remove(this.artboard);
    this.artboardWidth = doc.dimensions.width;
    this.artboardHeight = doc.dimensions.height;
    this.currentBackground = doc.background;
    this.createArtboard(doc.background);

    // Ensure fonts used in templates are loaded before rendering objects
    await loadGoogleFont('Inter');
    await loadGoogleFont('Playfair Display');

    // Deserialize objects onto canvas
    await deserializeCanvas(this.canvas, doc);

    // Ensure artboard stays behind all user objects
    this.canvas.sendObjectToBack(this.artboard!);
    this.canvas.requestRenderAll();

    // Clear history for the new document
    this.history.clear();

    // Fit the new artboard in the viewport
    this.fitToScreen();
    this.emitLayersChange();
    this.onSelectionChange?.(null);
  }

  // ─── Export ────────────────────────────────────────────────────────

  /**
   * Export the artboard as PNG, JPG, SVG, or PDF and trigger a download.
   *
   * Only the artboard area is exported — the gray pasteboard, grid lines,
   * and guide lines are excluded. The artboard background IS included.
   */
  export(options: ExportOptions): void {
    if (!this.canvas) return;

    // Temporarily make the artboard visible so its fill (background color)
    // is included in the export, but hide other infrastructure
    if (this.artboard) {
      // Briefly un-tag the artboard so hideInfrastructure() skips it
      (this.artboard as TaggedObject).__isArtboard = false;
    }

    exportCanvas(this.canvas, this.artboardWidth, this.artboardHeight, options);

    // Re-tag the artboard
    if (this.artboard) {
      (this.artboard as TaggedObject).__isArtboard = true;
    }
  }

  /**
   * Render the artboard as a PNG data URL (for batch export / thumbnails).
   * Does NOT trigger a download — just returns the data URL string.
   */
  getArtboardDataURL(multiplier: number = 1): string {
    if (!this.canvas) return '';

    const vpt = [...this.canvas.viewportTransform];
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // Un-tag artboard so it's included
    if (this.artboard) (this.artboard as TaggedObject).__isArtboard = false;

    // Hide other infrastructure
    const hidden: { obj: TaggedObject; wasVisible: boolean }[] = [];
    for (const obj of this.canvas.getObjects()) {
      const tagged = obj as TaggedObject;
      if (tagged.__isGridLine || tagged.__isGuide || tagged.__isBgImage) {
        hidden.push({ obj: tagged, wasVisible: tagged.visible ?? true });
        tagged.set('visible', false);
      }
    }

    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 0.9,
      multiplier,
      left: 0, top: 0,
      width: this.artboardWidth,
      height: this.artboardHeight,
    });

    // Restore
    for (const { obj, wasVisible } of hidden) obj.set('visible', wasVisible);
    if (this.artboard) (this.artboard as TaggedObject).__isArtboard = true;
    this.canvas.setViewportTransform(vpt as typeof this.canvas.viewportTransform);
    this.canvas.requestRenderAll();

    return dataURL;
  }

  // ─── Utilities ────────────────────────────────────────────────────

  /** Check if the canvas is initialized */
  isInitialized(): boolean {
    return this.canvas !== null;
  }

  /** Get the Fabric.js canvas instance (for use within this package only) */
  getFabricCanvas(): FabricCanvas | null {
    return this.canvas;
  }
}

