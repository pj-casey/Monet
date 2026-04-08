/**
 * Background Removal — runs entirely in the browser using ONNX.
 *
 * Uses @huggingface/transformers with the RMBG-1.4 model to segment
 * the foreground from the background. The model downloads on first use
 * (~40MB) and is cached by the browser for subsequent runs.
 *
 * The entire process is client-side — the image never leaves the user's
 * computer. This is a key privacy feature.
 *
 * How it works:
 * 1. Take the image data URL from the canvas
 * 2. Run it through the segmentation model (produces a mask)
 * 3. Apply the mask as an alpha channel (transparent background)
 * 4. Return the result as a new data URL
 */

import { AutoModel, AutoProcessor, RawImage } from '@huggingface/transformers';

// The model is loaded lazily — only downloaded when first needed
let modelPromise: Promise<{ model: Awaited<ReturnType<typeof AutoModel.from_pretrained>>; processor: Awaited<ReturnType<typeof AutoProcessor.from_pretrained>> }> | null = null;

const MODEL_ID = 'briaai/RMBG-1.4';

/** Status callback for progress updates */
export type BgRemovalStatus = 'loading-model' | 'processing' | 'done' | 'error';

/**
 * Load the background removal model.
 * Downloads ~40MB on first use, cached by the browser after that.
 */
function getModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const model = await AutoModel.from_pretrained(MODEL_ID, {
        dtype: 'fp32',
      });
      const processor = await AutoProcessor.from_pretrained(MODEL_ID);
      return { model, processor };
    })();
  }
  return modelPromise;
}

/**
 * Remove the background from an image.
 *
 * @param imageDataUrl - The image as a data URL (from canvas or file upload)
 * @param onStatus - Callback for progress updates
 * @returns A new data URL with transparent background, or null if failed
 */
export async function removeBackground(
  imageDataUrl: string,
  onStatus?: (status: BgRemovalStatus) => void,
): Promise<string | null> {
  try {
    // Step 1: Load the model (cached after first download)
    onStatus?.('loading-model');
    const { model, processor } = await getModel();

    // Step 2: Load and process the image
    onStatus?.('processing');
    const image = await RawImage.fromURL(imageDataUrl);
    const { pixel_values } = await processor(image);

    // Step 3: Run the model to get the segmentation mask
    const { output } = await model({ input: pixel_values });

    // Step 4: Post-process the mask to get a clean alpha channel
    const maskData = output[0][0].data as Float32Array;
    const maskH = output[0][0].dims[0] as number;
    const maskW = output[0][0].dims[1] as number;

    // Resize mask to match original image dimensions
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;

    // Draw original image
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = imageDataUrl;
    });
    ctx.drawImage(img, 0, 0);

    // Get image pixel data
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const pixels = imageData.data;

    // Apply mask as alpha channel
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        // Map from image coords to mask coords
        const mx = Math.round((x / image.width) * (maskW - 1));
        const my = Math.round((y / image.height) * (maskH - 1));
        const maskValue = maskData[my * maskW + mx];

        // Set alpha channel (0 = transparent, 255 = opaque)
        const pixelIndex = (y * image.width + x) * 4;
        pixels[pixelIndex + 3] = Math.round(Math.max(0, Math.min(1, maskValue)) * 255);
      }
    }

    ctx.putImageData(imageData, 0, 0);

    onStatus?.('done');
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Background removal failed:', err);
    onStatus?.('error');
    return null;
  }
}
