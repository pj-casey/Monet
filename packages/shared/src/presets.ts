/**
 * Artboard dimension presets — standard sizes for common design formats.
 *
 * When a user creates a new design, they can pick from these presets
 * instead of typing in pixel dimensions manually. The sizes match
 * what each platform recommends for best quality.
 */

export interface ArtboardPreset {
  /** Display name shown to the user */
  name: string;
  /** Category for grouping in the UI */
  category: string;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
}

export const ARTBOARD_PRESETS: ArtboardPreset[] = [
  // Social Media
  { name: 'Instagram Post', category: 'Social Media', width: 1080, height: 1080 },
  { name: 'Instagram Story', category: 'Social Media', width: 1080, height: 1920 },
  { name: 'Facebook Post', category: 'Social Media', width: 1200, height: 630 },
  { name: 'Twitter/X Post', category: 'Social Media', width: 1200, height: 675 },
  { name: 'Twitter/X Header', category: 'Social Media', width: 1500, height: 500 },
  { name: 'LinkedIn Post', category: 'Social Media', width: 1200, height: 627 },

  // Video
  { name: 'YouTube Thumbnail', category: 'Video', width: 1280, height: 720 },
  { name: 'YouTube Channel Art', category: 'Video', width: 2560, height: 1440 },

  // Presentation
  { name: 'Presentation (16:9)', category: 'Presentation', width: 1920, height: 1080 },
  { name: 'Presentation (4:3)', category: 'Presentation', width: 1024, height: 768 },

  // Print
  { name: 'Business Card', category: 'Print', width: 1050, height: 600 },
  { name: 'Poster (18×24)', category: 'Print', width: 1800, height: 2400 },
  { name: 'Flyer (A5)', category: 'Print', width: 1748, height: 2480 },

  // Custom (this is a placeholder — the UI will let users type custom dimensions)
  { name: 'Custom', category: 'Custom', width: 800, height: 600 },
];
