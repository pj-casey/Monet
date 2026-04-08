/**
 * Image types for the image tool.
 *
 * Images are photos or graphics uploaded by the user.
 * They support Fabric.js built-in filters that adjust how the image looks
 * without changing the original file.
 */

/**
 * Filter values for an image. Each is a number that adjusts the image:
 * - brightness: -1 (black) to 1 (white), 0 = normal
 * - contrast: -1 (flat gray) to 1 (high contrast), 0 = normal
 * - saturation: -1 (grayscale) to 1 (very vivid), 0 = normal
 * - blur: 0 (sharp) to 1 (very blurry)
 */
export interface ImageFilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  /** Hue rotation in degrees (-180 to 180) */
  hueRotation: number;
  /** Noise amount (0 to 500) */
  noise: number;
  /** Sharpen intensity (0 = off, 1 = moderate, 2 = strong) */
  sharpen: number;
  /** Tint color (hex, empty = no tint) */
  tintColor: string;
  /** Tint intensity (0 to 1) */
  tintAlpha: number;
  /** Vignette intensity (0 = off, 1 = strong) */
  vignette: number;
}

/** Default filter values — no adjustments */
export const DEFAULT_IMAGE_FILTERS: ImageFilterValues = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  hueRotation: 0,
  noise: 0,
  sharpen: 0,
  tintColor: '',
  tintAlpha: 0,
  vignette: 0,
};
