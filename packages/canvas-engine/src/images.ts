/**
 * Images — loads images onto the canvas and applies Fabric.js filters.
 *
 * Images are loaded from File objects (from file picker or drag-and-drop).
 * The file is converted to a data URL (a long string that contains the
 * entire image data), which Fabric.js can then render on the canvas.
 *
 * Filters (brightness, contrast, saturation, blur) are Fabric.js built-in
 * effects that modify how the image looks without changing the original data.
 */

import { FabricImage, filters } from 'fabric';
import type { T2DPipelineState } from 'fabric';
import type { ImageFilterValues } from '@monet/shared';
import { DEFAULT_IMAGE_FILTERS } from '@monet/shared';

/**
 * Custom Vignette filter — darkens image edges with a radial falloff.
 * Uses 2D canvas pixel manipulation (no WebGL shader needed).
 */
class VignetteFilter extends filters.BaseFilter<'Vignette', { vignette: number }> {
  declare vignette: number;
  static type = 'Vignette';
  static defaults = { vignette: 0 };

  applyTo2d({ imageData: { data, width, height } }: T2DPipelineState): void {
    const cx = width / 2;
    const cy = height / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    const v = this.vignette;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
        const factor = Math.max(0, 1 - dist * v * 1.5);
        const idx = (y * width + x) * 4;
        data[idx] = data[idx] * factor;
        data[idx + 1] = data[idx + 1] * factor;
        data[idx + 2] = data[idx + 2] * factor;
      }
    }
  }
}


/**
 * Load an image from a File object and create a Fabric.js image.
 *
 * The process:
 * 1. Read the file as a "data URL" (a base64-encoded string of the image)
 * 2. Create an HTML Image element from that data URL
 * 3. Wrap it in a Fabric.js FabricImage object
 * 4. Scale it to fit within the artboard if it's too large
 *
 * @param file - The image file from a file picker or drag-and-drop
 * @param maxWidth - Maximum width (typically artboard width)
 * @param maxHeight - Maximum height (typically artboard height)
 * @param centerX - X center to place the image
 * @param centerY - Y center to place the image
 * @returns The created Fabric.js image object
 */
export async function loadImageFromFile(
  file: File,
  maxWidth: number,
  maxHeight: number,
  centerX: number,
  centerY: number,
): Promise<FabricImage> {
  // Step 1: Read the file as a data URL
  const dataUrl = await readFileAsDataURL(file);

  // Step 2-3: Create a Fabric.js image from the data URL
  const img = await FabricImage.fromURL(dataUrl);

  // Step 4: Scale to fit within the artboard with some padding
  const imgW = img.width ?? 1;
  const imgH = img.height ?? 1;
  const padding = 0.8; // Leave 20% padding
  const scaleX = (maxWidth * padding) / imgW;
  const scaleY = (maxHeight * padding) / imgH;
  const scale = Math.min(scaleX, scaleY, 1); // Never scale up

  img.set({
    left: centerX - (imgW * scale) / 2,
    top: centerY - (imgH * scale) / 2,
    scaleX: scale,
    scaleY: scale,
  });

  return img;
}

/**
 * Apply brightness, contrast, saturation, and blur filters to a Fabric.js image.
 *
 * Fabric.js filters work by processing each pixel of the image.
 * We replace the entire filter array each time because that's the
 * simplest way to ensure filters stay in sync.
 *
 * @param img - The Fabric.js image to apply filters to
 * @param values - The filter values to apply
 */
export function applyFilters(img: FabricImage, values: ImageFilterValues): void {
  const filterList: InstanceType<typeof filters.BaseFilter>[] = [];

  // Only add filters that differ from the default (0) to save processing
  if (values.brightness !== 0) {
    filterList.push(new filters.Brightness({ brightness: values.brightness }));
  }
  if (values.contrast !== 0) {
    filterList.push(new filters.Contrast({ contrast: values.contrast }));
  }
  if (values.saturation !== 0) {
    filterList.push(new filters.Saturation({ saturation: values.saturation }));
  }
  if (values.blur !== 0) {
    filterList.push(new filters.Blur({ blur: values.blur }));
  }
  if (values.hueRotation !== 0) {
    // HueRotation range: -1 to 1 (we convert from -180..180 degrees)
    filterList.push(new filters.HueRotation({ rotation: values.hueRotation / 180 }));
  }
  if (values.noise !== 0) {
    filterList.push(new filters.Noise({ noise: values.noise }));
  }
  if (values.sharpen > 0) {
    // Scale the sharpen kernel by the intensity
    const s = values.sharpen;
    const matrix = [0, -s, 0, -s, 1 + 4 * s, -s, 0, -s, 0];
    filterList.push(new filters.Convolute({ matrix }));
  }
  if (values.tintColor && values.tintAlpha > 0) {
    filterList.push(new filters.BlendColor({
      color: values.tintColor,
      mode: 'tint',
      alpha: values.tintAlpha,
    }));
  }
  if (values.vignette > 0) {
    filterList.push(new VignetteFilter({ vignette: values.vignette }) as InstanceType<typeof filters.BaseFilter>);
  }

  img.filters = filterList;
  img.applyFilters();
}

/**
 * Read the current filter values from a Fabric.js image.
 * Inspects the filters array and extracts the values of each filter type.
 */
export function readFilterValues(img: FabricImage): ImageFilterValues {
  const result = { ...DEFAULT_IMAGE_FILTERS };

  for (const filter of img.filters ?? []) {
    if (filter instanceof filters.Brightness) {
      result.brightness = filter.brightness ?? 0;
    } else if (filter instanceof filters.Contrast) {
      result.contrast = filter.contrast ?? 0;
    } else if (filter instanceof filters.Saturation) {
      result.saturation = filter.saturation ?? 0;
    } else if (filter instanceof filters.Blur) {
      result.blur = filter.blur ?? 0;
    } else if (filter instanceof filters.HueRotation) {
      result.hueRotation = (filter.rotation ?? 0) * 180; // Convert back to degrees
    } else if (filter instanceof filters.Noise) {
      result.noise = filter.noise ?? 0;
    } else if (filter instanceof filters.Convolute) {
      // Reverse-engineer sharpen intensity from matrix center value
      const center = filter.matrix?.[4] ?? 1;
      result.sharpen = Math.max(0, (center - 1) / 4);
    } else if (filter instanceof filters.BlendColor && filter.mode === 'tint') {
      result.tintColor = filter.color ?? '';
      result.tintAlpha = filter.alpha ?? 0;
    } else if (filter instanceof VignetteFilter) {
      result.vignette = filter.vignette ?? 0;
    }
  }

  return result;
}

/**
 * Read a File object as a data URL string.
 *
 * A data URL looks like "data:image/png;base64,iVBORw0KGgo..." — it's a way
 * to represent an entire file as a text string. This lets us use the image
 * without needing to upload it to a server first.
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
