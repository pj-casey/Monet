/**
 * Color Harmony — suggests complementary, analogous, and triadic colors.
 *
 * Given a hex color, generates harmonious color palettes using HSL
 * (Hue, Saturation, Lightness) color space. Each harmony type
 * rotates the hue by specific angles:
 *
 * - Complementary: opposite on the color wheel (180°)
 * - Analogous: neighbors on the color wheel (±30°)
 * - Triadic: three evenly spaced colors (120° apart)
 * - Split-complementary: two colors adjacent to the complement (150°, 210°)
 */

export interface ColorHarmony {
  name: string;
  colors: string[];
}

/**
 * Generate color harmony suggestions from a base hex color.
 * Returns an array of harmony palettes.
 */
export function getColorHarmonies(hex: string): ColorHarmony[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [];

  const [h, s, l] = hsl;

  return [
    {
      name: 'Complementary',
      colors: [
        hslToHex((h + 180) % 360, s, l),
      ],
    },
    {
      name: 'Analogous',
      colors: [
        hslToHex((h + 330) % 360, s, l),
        hslToHex((h + 30) % 360, s, l),
      ],
    },
    {
      name: 'Triadic',
      colors: [
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
      ],
    },
    {
      name: 'Split-complementary',
      colors: [
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l),
      ],
    },
  ];
}

// ─── HSL ↔ Hex conversion ──────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return [Math.round(h * 360), s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}
