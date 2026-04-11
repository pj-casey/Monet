/**
 * Viewport — handles zoom and pan for the canvas.
 *
 * "Viewport" means the user's view of the canvas. Imagine looking through a
 * window at a large painting — you can move the window (pan) and use a
 * magnifying glass (zoom). The painting itself doesn't change; only your
 * view of it does.
 *
 * Fabric.js uses a "viewport transform" — a set of numbers that tells it
 * how to translate between screen coordinates and canvas coordinates.
 */

import { Canvas as FabricCanvas, Point } from 'fabric';

/** Zoom constraints — prevents zooming too far in or out */
const MIN_ZOOM = 0.1; // 10%
const MAX_ZOOM = 5.0; // 500%

/** How much to zoom per scroll wheel click (1.05 = 5% per click) */
const ZOOM_STEP = 1.05;

/** Padding around artboard when fitting to screen (in pixels) */
const FIT_PADDING = 40;

/**
 * Set up mouse wheel zooming on the canvas.
 *
 * When the user scrolls the mouse wheel, the canvas zooms in or out.
 * The zoom is centered on the mouse cursor position, so whatever
 * you're pointing at stays under your cursor.
 *
 * @param canvas - The Fabric.js canvas instance
 * @param onZoomChange - Callback when zoom level changes (to update UI)
 */
export function setupWheelZoom(
  canvas: FabricCanvas,
  onZoomChange?: (zoom: number) => void,
): void {
  canvas.on('mouse:wheel', (opt) => {
    const evt = opt.e as WheelEvent;
    const delta = evt.deltaY;

    let zoom = canvas.getZoom();
    // Scroll up = zoom in, scroll down = zoom out
    zoom = delta < 0 ? zoom * ZOOM_STEP : zoom / ZOOM_STEP;
    // Clamp between min and max
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

    // Zoom toward the mouse cursor position
    canvas.zoomToPoint(new Point(evt.offsetX, evt.offsetY), zoom);

    evt.preventDefault();
    evt.stopPropagation();

    onZoomChange?.(zoom);
  });
}

/**
 * Set up space+drag panning on the canvas.
 *
 * When the user holds the Space key and drags the mouse, the canvas
 * pans (scrolls) in the direction they drag. This is how most design
 * tools (Figma, Photoshop, etc.) handle panning.
 *
 * @param canvas - The Fabric.js canvas instance
 */
export function setupPanning(canvas: FabricCanvas): void {
  let isPanning = false;
  let spaceHeld = false;
  let lastX = 0;
  let lastY = 0;

  // Track whether Space key is held down
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !e.repeat) {
      spaceHeld = true;
      // Change cursor to "grab" hand to show the user they can pan
      const el = canvas.getSelectionElement();
      if (el) el.style.cursor = 'grab';
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      spaceHeld = false;
      isPanning = false;
      const el = canvas.getSelectionElement();
      if (el) el.style.cursor = 'default';
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // When space is held and mouse is pressed, OR middle mouse button, start panning
  canvas.on('mouse:down', (opt) => {
    const evt = opt.e as MouseEvent;
    if (spaceHeld || evt.button === 1) {
      // Middle-click (button 1) or space+click
      isPanning = true;
      lastX = evt.clientX;
      lastY = evt.clientY;
      const el = canvas.getSelectionElement();
      if (el) el.style.cursor = 'grabbing';
      evt.preventDefault(); // prevent middle-click auto-scroll
    }
  });

  // While panning, move the viewport
  canvas.on('mouse:move', (opt) => {
    if (isPanning) {
      const evt = opt.e as MouseEvent;
      const deltaX = evt.clientX - lastX;
      const deltaY = evt.clientY - lastY;
      canvas.relativePan(new Point(deltaX, deltaY));
      lastX = evt.clientX;
      lastY = evt.clientY;
    }
  });

  // Stop panning when mouse is released
  canvas.on('mouse:up', () => {
    if (!isPanning) return;
    isPanning = false;
    const el = canvas.getSelectionElement();
    if (el) el.style.cursor = spaceHeld ? 'grab' : 'default';
  });

  // Store cleanup function on the canvas for later disposal
  (canvas as CanvasWithCleanup).__viewportCleanup = () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  };
}

/** Extended canvas type to store cleanup function */
interface CanvasWithCleanup extends FabricCanvas {
  __viewportCleanup?: () => void;
}

/**
 * Clean up viewport event listeners.
 * Called when the canvas is disposed.
 */
export function disposeViewport(canvas: FabricCanvas): void {
  (canvas as CanvasWithCleanup).__viewportCleanup?.();
}

/**
 * Calculate and apply a zoom level that fits the artboard in the viewport
 * with some padding around it.
 *
 * @param canvas - The Fabric.js canvas instance
 * @param artboardWidth - Width of the artboard in pixels
 * @param artboardHeight - Height of the artboard in pixels
 * @param onZoomChange - Callback when zoom level changes
 */
export function fitToScreen(
  canvas: FabricCanvas,
  artboardWidth: number,
  artboardHeight: number,
  onZoomChange?: (zoom: number) => void,
): void {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // Calculate how much we need to scale to fit, leaving some padding
  const scaleX = (canvasWidth - FIT_PADDING * 2) / artboardWidth;
  const scaleY = (canvasHeight - FIT_PADDING * 2) / artboardHeight;
  const zoom = Math.min(scaleX, scaleY, MAX_ZOOM);

  // Center the artboard in the viewport
  const vpLeft = (canvasWidth - artboardWidth * zoom) / 2;
  const vpTop = (canvasHeight - artboardHeight * zoom) / 2;

  canvas.setViewportTransform([zoom, 0, 0, zoom, vpLeft, vpTop]);
  onZoomChange?.(zoom);
}

/**
 * Set the zoom level centered on the canvas center.
 *
 * @param canvas - The Fabric.js canvas instance
 * @param zoom - New zoom level (1 = 100%)
 * @param onZoomChange - Callback when zoom level changes
 */
export function setZoom(
  canvas: FabricCanvas,
  zoom: number,
  onZoomChange?: (zoom: number) => void,
): void {
  const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  const center = new Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
  canvas.zoomToPoint(center, clamped);
  onZoomChange?.(clamped);
}

export { MIN_ZOOM, MAX_ZOOM };
