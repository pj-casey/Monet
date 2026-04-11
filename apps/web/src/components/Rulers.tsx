/**
 * Rulers — pixel measurement rulers along the top and left canvas edges.
 *
 * Two thin canvas elements (horizontal top, vertical left) draw tick marks
 * that show pixel positions in canvas coordinates. They scale with zoom
 * and shift with pan so the numbers always correspond to the actual
 * artboard position.
 *
 * Artboard boundaries are highlighted with a subtle blue band.
 *
 * Rendering uses requestAnimationFrame to stay in sync with the viewport
 * without triggering React re-renders on every pan/zoom.
 */

import { useEffect, useRef } from 'react';
import { engine } from './Canvas';
import { useEditorStore } from '../stores/editor-store';

/** Colors — warm tones matching DESIGN.md tokens (can't use CSS vars in canvas 2D) */
const BG = '#f5f0eb';         // warm cream (matches --bg-surface light)
const BG_DARK = '#2d2a26';    // warm dark (matches --bg-surface dark)
const TICK_COLOR = '#9a9088';  // warm gray (matches --text-tertiary)
const TEXT_COLOR = '#7a7068';  // warm mid (matches --text-secondary)
const ARTBOARD_BAND = 'rgba(196, 112, 74, 0.12)'; // accent band (warm sienna)

export function Rulers() {
  const hRef = useRef<HTMLCanvasElement>(null);
  const vRef = useRef<HTMLCanvasElement>(null);
  const artboardW = useEditorStore((s) => s.artboardWidth);
  const artboardH = useEditorStore((s) => s.artboardHeight);

  useEffect(() => {
    let raf: number;
    let prevVptStr = '';

    const draw = () => {
      const vpt = engine.getViewportTransform();
      const vptStr = vpt.join(',');

      // Only redraw if viewport changed
      if (vptStr !== prevVptStr) {
        prevVptStr = vptStr;
        const zoom = vpt[0];
        const panX = vpt[4];
        const panY = vpt[5];

        if (hRef.current) drawHorizontal(hRef.current, zoom, panX, artboardW);
        if (vRef.current) drawVertical(vRef.current, zoom, panY, artboardH);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [artboardW, artboardH]);

  // Resize canvases to match their CSS size
  useEffect(() => {
    const resizeCanvas = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
    };
    resizeCanvas(hRef.current);
    resizeCanvas(vRef.current);

    const observer = new ResizeObserver(() => {
      resizeCanvas(hRef.current);
      resizeCanvas(vRef.current);
    });
    if (hRef.current) observer.observe(hRef.current);
    if (vRef.current) observer.observe(vRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Horizontal ruler (top) */}
      <canvas
        ref={hRef}
        className="absolute left-[22px] top-0 z-10 h-[22px] w-[calc(100%-22px)]"
        style={{ pointerEvents: 'none' }}
      />
      {/* Vertical ruler (left) */}
      <canvas
        ref={vRef}
        className="absolute left-0 top-[22px] z-10 h-[calc(100%-22px)] w-[22px]"
        style={{ pointerEvents: 'none' }}
      />
      {/* Corner square */}
      <div
        className="absolute left-0 top-0 z-10 h-[22px] w-[22px] bg-surface border-b border-r border-border"
        style={{ pointerEvents: 'none' }}
      />
    </>
  );
}

/**
 * Choose tick spacing that looks good at the current zoom level.
 * At high zoom, show more detail (smaller intervals).
 * At low zoom, show less detail (larger intervals).
 */
function getTickInterval(zoom: number): { major: number; minor: number } {
  const pixelsPerUnit = zoom;
  // Target: major ticks ~80-150px apart on screen
  const candidates = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
  let major = 100;
  for (const c of candidates) {
    if (c * pixelsPerUnit >= 60) {
      major = c;
      break;
    }
  }
  const minor = major / (major >= 100 ? 5 : major >= 50 ? 5 : 2);
  return { major, minor };
}

function drawHorizontal(canvas: HTMLCanvasElement, zoom: number, panX: number, artboardW: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = devicePixelRatio;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.scale(dpr, dpr);

  const cssW = w / dpr;
  const cssH = h / dpr;

  // Background
  const isDark = document.documentElement.classList.contains('dark');
  ctx.fillStyle = isDark ? BG_DARK : BG;
  ctx.fillRect(0, 0, cssW, cssH);

  // Artboard highlight band
  const abStart = 0 * zoom + panX;
  const abEnd = artboardW * zoom + panX;
  ctx.fillStyle = ARTBOARD_BAND;
  ctx.fillRect(Math.max(0, abStart), 0, Math.min(cssW, abEnd) - Math.max(0, abStart), cssH);

  // Tick marks
  const { major, minor } = getTickInterval(zoom);
  const startUnit = Math.floor(-panX / zoom / minor) * minor;
  const endUnit = Math.ceil((cssW - panX) / zoom / minor) * minor;

  ctx.strokeStyle = TICK_COLOR;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'center';

  for (let u = startUnit; u <= endUnit; u += minor) {
    const screenX = u * zoom + panX;
    if (screenX < 0 || screenX > cssW) continue;

    const isMajor = Math.abs(u % major) < 0.01;
    const tickH = isMajor ? cssH * 0.55 : cssH * 0.3;

    ctx.beginPath();
    ctx.moveTo(screenX, cssH);
    ctx.lineTo(screenX, cssH - tickH);
    ctx.lineWidth = isMajor ? 1 : 0.5;
    ctx.stroke();

    if (isMajor) {
      ctx.fillText(String(Math.round(u)), screenX, cssH - tickH - 2);
    }
  }

  // Bottom border
  ctx.strokeStyle = isDark ? '#3d3830' : '#e5ddd5';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cssH - 0.5);
  ctx.lineTo(cssW, cssH - 0.5);
  ctx.stroke();

  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
}

function drawVertical(canvas: HTMLCanvasElement, zoom: number, panY: number, artboardH: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = devicePixelRatio;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.scale(dpr, dpr);

  const cssW = w / dpr;
  const cssH = h / dpr;

  // Background
  const isDark = document.documentElement.classList.contains('dark');
  ctx.fillStyle = isDark ? BG_DARK : BG;
  ctx.fillRect(0, 0, cssW, cssH);

  // Artboard highlight band
  const abStart = 0 * zoom + panY;
  const abEnd = artboardH * zoom + panY;
  ctx.fillStyle = ARTBOARD_BAND;
  ctx.fillRect(0, Math.max(0, abStart), cssW, Math.min(cssH, abEnd) - Math.max(0, abStart));

  // Tick marks
  const { major, minor } = getTickInterval(zoom);
  const startUnit = Math.floor(-panY / zoom / minor) * minor;
  const endUnit = Math.ceil((cssH - panY) / zoom / minor) * minor;

  ctx.strokeStyle = TICK_COLOR;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = '9px sans-serif';

  for (let u = startUnit; u <= endUnit; u += minor) {
    const screenY = u * zoom + panY;
    if (screenY < 0 || screenY > cssH) continue;

    const isMajor = Math.abs(u % major) < 0.01;
    const tickW = isMajor ? cssW * 0.55 : cssW * 0.3;

    ctx.beginPath();
    ctx.moveTo(cssW, screenY);
    ctx.lineTo(cssW - tickW, screenY);
    ctx.lineWidth = isMajor ? 1 : 0.5;
    ctx.stroke();

    if (isMajor) {
      ctx.save();
      ctx.translate(cssW - tickW - 2, screenY);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(String(Math.round(u)), 0, 0);
      ctx.restore();
    }
  }

  // Right border
  ctx.strokeStyle = isDark ? '#3d3830' : '#e5ddd5';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cssW - 0.5, 0);
  ctx.lineTo(cssW - 0.5, cssH);
  ctx.stroke();

  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
}
