/**
 * Cursors — dynamic SVG cursor generation for drawing tools.
 *
 * Custom CSS cursors are generated as SVG data URLs so the cursor
 * visually matches the current brush size. The black/white dashed
 * circle is visible on both light and dark backgrounds.
 *
 * Browser limit: custom cursors max at 128×128 px. Sizes are clamped.
 */

/** Maximum cursor size browsers will accept */
const MAX_CURSOR_SIZE = 128;

/** Minimum cursor size to keep it visible */
const MIN_CURSOR_SIZE = 4;

/**
 * Clamp a pixel size to the browser-supported cursor range.
 */
function clampSize(size: number): number {
  return Math.max(MIN_CURSOR_SIZE, Math.min(MAX_CURSOR_SIZE, Math.round(size)));
}

/**
 * Circle cursor for freehand drawing modes (pen, marker, highlighter, glow).
 *
 * Shows a black/white dashed circle at the brush's effective size so
 * the user can see exactly how wide their next stroke will be.
 *
 * @param size - The effective brush diameter in pixels
 * @returns CSS cursor value string
 */
export function makeCircleCursor(size: number): string {
  const s = clampSize(size);
  const half = s / 2;
  const r = half - 1;
  if (r < 1) return 'crosshair';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">`
    + `<circle cx="${half}" cy="${half}" r="${r}" fill="none" stroke="black" stroke-width="1"/>`
    + `<circle cx="${half}" cy="${half}" r="${r}" fill="none" stroke="white" stroke-width="1" stroke-dasharray="2,2"/>`
    + `</svg>`;

  return `url('data:image/svg+xml,${encodeURIComponent(svg)}') ${half} ${half}, crosshair`;
}

/**
 * Circle-with-X cursor for eraser mode.
 *
 * Same dashed circle as drawing but with a small X in the center
 * to visually distinguish erasing from drawing.
 *
 * @param size - The eraser diameter in pixels
 * @returns CSS cursor value string
 */
export function makeEraserCursor(size: number): string {
  const s = clampSize(size);
  const half = s / 2;
  const r = half - 1;
  if (r < 1) return 'crosshair';

  // X arm length scales with cursor size but caps at 4px
  const arm = Math.min(4, Math.floor(r * 0.4));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">`
    + `<circle cx="${half}" cy="${half}" r="${r}" fill="none" stroke="black" stroke-width="1"/>`
    + `<circle cx="${half}" cy="${half}" r="${r}" fill="none" stroke="white" stroke-width="1" stroke-dasharray="2,2"/>`
    + `<line x1="${half - arm}" y1="${half - arm}" x2="${half + arm}" y2="${half + arm}" stroke="black" stroke-width="2"/>`
    + `<line x1="${half + arm}" y1="${half - arm}" x2="${half - arm}" y2="${half + arm}" stroke="black" stroke-width="2"/>`
    + `<line x1="${half - arm}" y1="${half - arm}" x2="${half + arm}" y2="${half + arm}" stroke="white" stroke-width="1"/>`
    + `<line x1="${half + arm}" y1="${half - arm}" x2="${half - arm}" y2="${half + arm}" stroke="white" stroke-width="1"/>`
    + `</svg>`;

  return `url('data:image/svg+xml,${encodeURIComponent(svg)}') ${half} ${half}, crosshair`;
}
