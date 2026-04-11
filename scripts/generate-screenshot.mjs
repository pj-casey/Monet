/**
 * generate-screenshot.mjs — Puppeteer script to capture hero & OG screenshots.
 *
 * Usage:
 *   1. Start the dev server:  pnpm dev
 *   2. In another terminal:   node scripts/generate-screenshot.mjs
 *
 * Outputs:
 *   - apps/web/public/hero-screenshot.png  (editor UI with showcase template, 2560x1440)
 *   - apps/web/public/og-image.png         (clean design export, 1080x1080)
 *
 * Requirements: puppeteer installed (pnpm add -w -D puppeteer)
 */

import puppeteer from 'puppeteer';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC = resolve(ROOT, 'apps/web/public');

const DEV_URL = process.env.DEV_URL || 'http://localhost:5173';
const HERO_WIDTH = 2560;
const HERO_HEIGHT = 1440;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: false,          // Show the browser so you can see what's happening
    defaultViewport: null,    // We'll set viewport per page
    args: ['--window-size=2560,1440'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: HERO_WIDTH, height: HERO_HEIGHT, deviceScaleFactor: 1 });

  // ─── Step 1: Navigate to editor ────────────────────────────────

  console.log('Navigating to editor...');
  await page.goto(`${DEV_URL}/editor`, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(2000); // Wait for welcome screen to fully render

  // ─── Step 2: Find and click the "Aura Studio" showcase template ────

  console.log('Looking for showcase template...');

  // Click "Marketing" category filter to narrow results
  await page.evaluate(() => {
    const allButtons = document.querySelectorAll('button');
    for (const btn of allButtons) {
      if (btn.textContent?.trim() === 'Marketing') { btn.click(); return; }
    }
  });
  await sleep(1000);

  // Scroll down to make sure all templates are visible, then click it
  await page.evaluate(() => window.scrollTo(0, 500));
  await sleep(500);

  const templateClicked = await page.evaluate(() => {
    const allButtons = document.querySelectorAll('button');
    for (const btn of allButtons) {
      if (btn.textContent?.includes('Aura Studio')) {
        btn.click();
        return true;
      }
    }
    return false;
  });

  if (!templateClicked) {
    // Fallback: try typing in search
    console.log('Template not found in Marketing category, trying search...');
    await page.evaluate(() => {
      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        if (btn.textContent?.trim() === 'All') { btn.click(); return; }
      }
    });
    await sleep(500);

    // Type into search input
    const searchInput = await page.$('input[type="text"]');
    if (searchInput) {
      await searchInput.click({ clickCount: 3 }); // select all
      await searchInput.type('Aura', { delay: 50 });
      await sleep(1000);
    }

    const found = await page.evaluate(() => {
      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        if (btn.textContent?.includes('Aura Studio')) {
          btn.click();
          return true;
        }
      }
      return false;
    });

    if (!found) {
      console.log('WARNING: Could not find showcase template. Taking screenshot of whatever is showing.');
    }
  }

  // ─── Step 3: Wait for editor to initialize ────────────────────

  console.log('Waiting for editor to load...');
  await sleep(4000); // Wait for canvas mount, engine init, template load, font loading

  // ─── Step 4: Wait for fonts to load ───────────────────────────

  await page.evaluate(async () => {
    try {
      await document.fonts.ready;
    } catch { /* ignore */ }
  });
  await sleep(1000);

  // ─── Step 5: Take the hero screenshot (full editor UI) ────────

  console.log('Taking hero screenshot...');
  const heroPath = resolve(PUBLIC, 'hero-screenshot.png');
  await page.screenshot({
    path: heroPath,
    type: 'png',
    fullPage: false, // viewport only
  });
  console.log(`Hero screenshot saved to: ${heroPath}`);

  // ─── Step 6: Export clean design for OG image ─────────────────

  console.log('Generating OG image...');
  // Use the canvas export to get just the design at 1080x1080.
  // We'll extract the artboard content via the Fabric.js canvas.
  const ogDataUrl = await page.evaluate(() => {
    try {
      // Access the engine's export capability
      const canvasEl = document.querySelector('canvas');
      if (!canvasEl) return null;

      // The Fabric.js canvas wraps the HTML canvas. We need to use the engine.
      // The engine is a module-level singleton — we can't access it directly from page context.
      // Instead, trigger the export dialog flow or use toDataURL.

      // Actually, the simplest approach: get the fabric canvas from the upper-canvas
      // Fabric.js stores its instance on the canvas element.
      // But in this build, the engine is not globally accessible.

      // Fallback: take a screenshot of just the artboard area.
      return null;
    } catch {
      return null;
    }
  });

  if (!ogDataUrl) {
    // Fallback: crop the artboard area from the full screenshot.
    // For OG image, take a tighter screenshot of just the canvas area.
    console.log('Using viewport crop for OG image...');

    // Find the canvas element position
    const canvasBox = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });

    if (canvasBox) {
      const ogPath = resolve(PUBLIC, 'og-image.png');
      await page.screenshot({
        path: ogPath,
        type: 'png',
        clip: {
          x: canvasBox.x,
          y: canvasBox.y,
          width: canvasBox.width,
          height: canvasBox.height,
        },
      });
      console.log(`OG image saved to: ${ogPath}`);
    }
  }

  // ─── Done ─────────────────────────────────────────────────────

  console.log('\nDone! Screenshots saved to apps/web/public/');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Review hero-screenshot.png — crop/adjust if needed');
  console.log('  2. Review og-image.png — should be 1080x1080 design only');
  console.log('  3. If the OG image needs a cleaner crop, use the Export dialog in the editor');
  console.log('     to export the design as PNG at 1x resolution, then rename to og-image.png');

  await browser.close();
}

main().catch((err) => {
  console.error('Screenshot generation failed:', err);
  console.log('');
  console.log('Manual fallback instructions:');
  console.log('  1. Run: pnpm dev');
  console.log('  2. Open http://localhost:5173/editor in your browser');
  console.log('  3. Click "Marketing" category, find "Aura Studio — Brand Launch" and click it');
  console.log('  4. Once loaded, resize your browser to ~2560x1440');
  console.log('  5. Take a screenshot (Win+Shift+S or your OS screenshot tool)');
  console.log('  6. Save as apps/web/public/hero-screenshot.png');
  console.log('  7. In the editor, click Export → PNG → 1x → save');
  console.log('  8. Rename to apps/web/public/og-image.png');
  process.exit(1);
});
