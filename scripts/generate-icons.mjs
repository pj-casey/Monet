/**
 * generate-icons.mjs — Renders the SVG favicon to PNG at multiple sizes.
 *
 * Usage: node scripts/generate-icons.mjs
 *
 * Outputs:
 *   - apps/web/public/apple-touch-icon.png (180x180)
 *   - apps/web/public/icon-192.png (192x192)
 *   - apps/web/public/icon-512.png (512x512)
 */

import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC = resolve(ROOT, 'apps/web/public');

const svgContent = readFileSync(resolve(PUBLIC, 'favicon.svg'), 'utf8');

const sizes = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--force-color-profile=srgb'],
  });

  for (const { name, size } of sizes) {
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });

    // Force light mode so we get the primary #C4704A color
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'light' },
    ]);

    const iconSize = Math.round(size * 0.75);
    const pad = Math.round((size - iconSize) / 2);

    const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:${pad}px;width:${size}px;height:${size}px;background:transparent;box-sizing:border-box;">
${svgContent.replace('width="32"', `width="${iconSize}"`).replace('height="32"', `height="${iconSize}"`)}
</body></html>`;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: resolve(PUBLIC, name),
      type: 'png',
      omitBackground: true,
    });
    await page.close();
    console.log(`Generated ${name} (${size}x${size})`);
  }

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
