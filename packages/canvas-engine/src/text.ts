/**
 * Text — creates and manages text objects on the canvas.
 *
 * Uses Fabric.js Textbox which supports:
 * - Editable text (double-click to enter editing mode)
 * - Multi-line with word wrapping
 * - Font family, size, weight, style, alignment
 * - Line height and letter spacing
 *
 * Google Fonts are loaded on-demand: when the user picks a font,
 * we inject a <link> tag that downloads it from Google's CDN.
 * The font becomes available to the browser (and Fabric.js) immediately.
 */

import { Textbox, type FabricObject } from 'fabric';
import type { TextOptions } from '@monet/shared';

/** Default text properties */
const DEFAULT_FONT_FAMILY = 'DM Sans';
const DEFAULT_FONT_SIZE = 32;
const DEFAULT_FILL = '#2d2a26'; // warm near-black — matches --text-primary
const DEFAULT_TEXT = 'Type something';
const DEFAULT_WIDTH = 300;

/** Track which fonts have already been loaded (so we don't load twice) */
const loadedFonts = new Set<string>();

/**
 * Load a Google Font by injecting a <link> tag into the document head.
 *
 * Google Fonts works by serving CSS that contains @font-face rules.
 * The browser downloads the font file and makes it available for
 * any element that uses that font-family name.
 *
 * @param fontFamily - The Google Font name (e.g., "Roboto", "Playfair Display")
 * @returns A promise that resolves when the font is loaded and ready to use
 */
export async function loadGoogleFont(fontFamily: string): Promise<void> {
  // Skip if already loaded
  if (loadedFonts.has(fontFamily)) return;

  // Build the Google Fonts URL
  const urlFamily = fontFamily.replace(/ /g, '+');
  const url = `https://fonts.googleapis.com/css2?family=${urlFamily}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;

  // Inject <link> and wait for the stylesheet to load
  // The stylesheet contains @font-face rules that tell the browser where
  // to download the actual font files
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;

  await new Promise<void>((resolve) => {
    link.onload = () => resolve();
    link.onerror = () => resolve(); // Continue even if it fails
    document.head.appendChild(link);
  });

  // Now the @font-face rules are registered — wait for the actual font
  // files to finish downloading
  try {
    await document.fonts.load(`400 16px "${fontFamily}"`);
    await document.fonts.load(`700 16px "${fontFamily}"`);
    // Also wait for the fonts.ready promise which resolves when all
    // pending font loads are complete
    await document.fonts.ready;
  } catch {
    console.warn(`Failed to load font: ${fontFamily}`);
  }

  loadedFonts.add(fontFamily);
}

/** Check if a font is already loaded */
export function isFontLoaded(fontFamily: string): boolean {
  return loadedFonts.has(fontFamily);
}

/**
 * Create a Fabric.js Textbox object.
 *
 * A Textbox is an editable text area — the user can double-click it
 * to enter editing mode and type/select/format text.
 *
 * @param options - Text content and styling
 * @param centerX - X center position on the artboard
 * @param centerY - Y center position on the artboard
 * @returns The Fabric.js Textbox object
 */
export function createText(
  options: TextOptions,
  centerX: number,
  centerY: number,
): FabricObject {
  const width = options.width ?? DEFAULT_WIDTH;
  const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE;

  const textbox = new Textbox(options.text ?? DEFAULT_TEXT, {
    left: centerX - width / 2,
    top: centerY - fontSize,
    width,
    fontFamily: options.fontFamily ?? DEFAULT_FONT_FAMILY,
    fontSize,
    fontWeight: options.fontWeight ?? 'normal',
    fontStyle: options.fontStyle ?? 'normal',
    underline: options.underline ?? false,
    fill: options.fill ?? DEFAULT_FILL,
    textAlign: options.textAlign ?? 'left',
    lineHeight: options.lineHeight ?? 1.2,
    charSpacing: options.charSpacing ?? 0,
    opacity: options.opacity ?? 1,
    editable: true,
    // Make sure the textbox wraps text and doesn't shrink below content
    splitByGrapheme: false,
  });

  return textbox;
}

/**
 * Update text-specific properties on a Textbox.
 *
 * This is separate from the generic updateSelectedObject because
 * text has its own set of properties (font family, alignment, etc.)
 * and because changing the font family requires loading the font first.
 *
 * @param textbox - The Fabric.js Textbox to update
 * @param props - The properties to change
 */
export async function updateTextProps(
  textbox: Textbox,
  props: Partial<TextOptions>,
): Promise<void> {
  // If the font family is changing, load it first
  if (props.fontFamily && props.fontFamily !== textbox.fontFamily) {
    await loadGoogleFont(props.fontFamily);
  }

  if (props.text !== undefined) textbox.set('text', props.text);
  if (props.fontFamily !== undefined) textbox.set('fontFamily', props.fontFamily);
  if (props.fontSize !== undefined) textbox.set('fontSize', props.fontSize);
  if (props.fontWeight !== undefined) textbox.set('fontWeight', props.fontWeight);
  if (props.fontStyle !== undefined) textbox.set('fontStyle', props.fontStyle);
  if (props.underline !== undefined) textbox.set('underline', props.underline);
  if (props.fill !== undefined) textbox.set('fill', props.fill);
  if (props.textAlign !== undefined) textbox.set('textAlign', props.textAlign);
  if (props.lineHeight !== undefined) textbox.set('lineHeight', props.lineHeight);
  if (props.charSpacing !== undefined) textbox.set('charSpacing', props.charSpacing);
  if (props.opacity !== undefined) textbox.set('opacity', props.opacity);

  // Clear Fabric.js internal font cache so it measures with the new font
  if (props.fontFamily !== undefined) {
    // Fabric.js caches character widths per font — clear it to force remeasure
    (textbox as unknown as Record<string, unknown>).__charBounds = undefined;
    textbox.set('dirty', true);
    textbox.setCoords();
  }
}

/**
 * Read text-specific properties from a Textbox.
 */
export function readTextProps(textbox: Textbox): {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  underline: boolean;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  charSpacing: number;
} {
  return {
    text: textbox.text ?? '',
    fontFamily: textbox.fontFamily ?? DEFAULT_FONT_FAMILY,
    fontSize: textbox.fontSize ?? DEFAULT_FONT_SIZE,
    fontWeight: (textbox.fontWeight === 'bold' ? 'bold' : 'normal'),
    fontStyle: (textbox.fontStyle === 'italic' ? 'italic' : 'normal'),
    underline: textbox.underline ?? false,
    textAlign: (textbox.textAlign as 'left' | 'center' | 'right' | 'justify') ?? 'left',
    lineHeight: textbox.lineHeight ?? 1.2,
    charSpacing: textbox.charSpacing ?? 0,
  };
}
