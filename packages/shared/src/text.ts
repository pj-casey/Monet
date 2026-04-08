/**
 * Text types and options for the text tool.
 *
 * Text objects are editable text boxes on the canvas.
 * Double-click on the canvas to add one, double-click existing text to edit.
 */

/** Options when creating a new text object */
export interface TextOptions {
  /** The initial text content */
  text?: string;
  /** Font family name (e.g., "Inter", "Roboto") */
  fontFamily?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight — "normal" or "bold" */
  fontWeight?: 'normal' | 'bold';
  /** Font style — "normal" or "italic" */
  fontStyle?: 'normal' | 'italic';
  /** Whether the text has an underline */
  underline?: boolean;
  /** Text color (CSS color string) */
  fill?: string;
  /** Text horizontal alignment */
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  /** Line height as a multiplier (1.0 = single spacing, 1.5 = 1.5x) */
  lineHeight?: number;
  /** Letter spacing in pixels (can be negative to tighten) */
  charSpacing?: number;
  /** Opacity from 0 to 1 */
  opacity?: number;
  /** Width of the text box (text wraps within this) */
  width?: number;
}

/**
 * Text-specific properties readable from a selected text object.
 * These extend the base SelectedObjectProps when objectType is 'textbox'.
 */
export interface TextProperties {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  underline: boolean;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  charSpacing: number;
}

/**
 * A curated list of Google Fonts that are popular, versatile, and free.
 * These are loaded on-demand — only downloaded when the user selects them.
 */
export const FONT_LIST = [
  // Sans-serif — clean, modern
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Nunito',
  'Raleway',
  'Work Sans',
  'DM Sans',

  // Serif — traditional, elegant
  'Playfair Display',
  'Merriweather',
  'Lora',
  'PT Serif',
  'Libre Baskerville',

  // Display — eye-catching headings
  'Bebas Neue',
  'Oswald',
  'Anton',
  'Pacifico',
  'Lobster',

  // Monospace — code-like
  'Fira Code',
  'JetBrains Mono',
  'Source Code Pro',
] as const;

export type FontName = (typeof FONT_LIST)[number];
