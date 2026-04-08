/**
 * Font Pairing — suggests complementary body fonts for a given heading font.
 *
 * Good font pairings create visual contrast (e.g., a bold display font
 * for headings with a clean readable font for body text).
 *
 * Rules of thumb:
 * - Pair serif headings with sans-serif body (or vice versa)
 * - Pair display/decorative headings with neutral body fonts
 * - Monospace works as an accent with most body fonts
 */

/** Recommended body fonts for each heading font */
const PAIRINGS: Record<string, string[]> = {
  // Sans-serif headings → pair with serif or contrasting sans
  'Inter': ['Merriweather', 'Lora', 'PT Serif', 'Open Sans', 'Roboto'],
  'Roboto': ['Merriweather', 'Playfair Display', 'Lora', 'Open Sans', 'Inter'],
  'Open Sans': ['Playfair Display', 'Merriweather', 'Lora', 'Inter', 'Roboto'],
  'Montserrat': ['Merriweather', 'Lora', 'Open Sans', 'Roboto', 'Inter'],
  'Lato': ['Merriweather', 'Playfair Display', 'PT Serif', 'Open Sans', 'Inter'],
  'Poppins': ['Merriweather', 'Lora', 'Inter', 'Open Sans', 'Libre Baskerville'],
  'Nunito': ['Merriweather', 'Playfair Display', 'Lora', 'Inter', 'Roboto'],
  'Raleway': ['Merriweather', 'Lora', 'Roboto', 'Open Sans', 'Inter'],
  'Work Sans': ['Merriweather', 'Playfair Display', 'Lora', 'Inter', 'PT Serif'],
  'DM Sans': ['Merriweather', 'Lora', 'PT Serif', 'Inter', 'Roboto'],

  // Serif headings → pair with sans-serif body
  'Playfair Display': ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Work Sans'],
  'Merriweather': ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Lato'],
  'Lora': ['Inter', 'Roboto', 'Open Sans', 'Poppins', 'Work Sans'],
  'PT Serif': ['Inter', 'Roboto', 'Open Sans', 'DM Sans', 'Lato'],
  'Libre Baskerville': ['Inter', 'Roboto', 'Montserrat', 'Open Sans', 'Poppins'],

  // Display headings → pair with clean sans-serif body
  'Bebas Neue': ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Work Sans'],
  'Oswald': ['Inter', 'Roboto', 'Open Sans', 'Merriweather', 'Lato'],
  'Anton': ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins'],
  'Pacifico': ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'],
  'Lobster': ['Inter', 'Roboto', 'Open Sans', 'Lato', 'DM Sans'],

  // Monospace → pair with clean fonts
  'Fira Code': ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Merriweather'],
  'JetBrains Mono': ['Inter', 'Roboto', 'Open Sans', 'Work Sans', 'Lato'],
  'Source Code Pro': ['Inter', 'Roboto', 'Open Sans', 'Merriweather', 'Lato'],
};

/**
 * Get suggested body fonts for a heading font.
 * Returns up to 3 suggestions, or an empty array if no pairings are known.
 */
export function getFontPairings(headingFont: string, limit: number = 3): string[] {
  return (PAIRINGS[headingFont] ?? []).slice(0, limit);
}
