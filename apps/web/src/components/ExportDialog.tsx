/**
 * ExportDialog — a modal for exporting the design as an image or PDF.
 *
 * Options:
 * - Format: PNG, JPG, SVG, PDF
 * - Quality slider (for PNG/JPG) — 0% to 100%
 * - Resolution: 1x, 2x, 3x (higher = more pixels, larger file)
 * - Filename
 *
 * Clicking "Export" triggers a browser download — no server needed.
 *
 * ─── LIBRARY EVALUATION: pdf-lib ───────────────────────────────────
 * Package: pdf-lib (https://npmjs.com/package/pdf-lib)
 * Size: 161KB gzip | Downloads: 4.6M/week | License: MIT | Last: Nov 2021
 *
 * Our current PDF export embeds rasterized PNG images via jsPDF — PDFs
 * look pixelated when printed at high resolution. pdf-lib creates true
 * vector PDFs with shapes, text, and SVG paths (not rasterized).
 *
 * Key API: PDFDocument.create(), page.drawText() with embedded fonts,
 * page.drawRectangle/Circle/Ellipse/Line(), page.drawSvgPath(),
 * page.drawImage() for embedded PNGs. Works in browser, no native deps.
 *
 * We could map Fabric.js canvas objects to pdf-lib drawing commands:
 * - Rect → page.drawRectangle()
 * - Circle → page.drawEllipse()
 * - Textbox → page.drawText() with embedFont() for Google Fonts
 * - Path → page.drawSvgPath() (directly accepts SVG d="" strings)
 * - Image → page.drawImage() (PNG/JPEG embedding)
 *
 * Verdict: Best option for vector PDF export. Would produce dramatically
 * better print quality. 161KB is heavy but justified for the quality
 * upgrade. Mature, stable API (4.6M weekly downloads). Implement when
 * PDF print quality becomes a priority.
 * ───────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { engine } from './Canvas';
import { useEditorStore } from '../stores/editor-store';
import { FocusTrap } from './A11y';
import { showToast } from './Toast';
import { useActivityStore } from '../stores/activity-store';
import { useEscapeClose } from '../hooks/use-escape-close';

type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  useEscapeClose(isOpen, onClose);
  const setActivity = useActivityStore((s) => s.setActivity);
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(92);
  const [multiplier, setMultiplier] = useState(1);
  const [filename, setFilename] = useState('design');
  const [transparent, setTransparent] = useState(false);
  const [allPages, setAllPages] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [vectorPdf, setVectorPdf] = useState(true);
  const artboardWidth = useEditorStore((s) => s.artboardWidth);
  const artboardHeight = useEditorStore((s) => s.artboardHeight);
  const pageCount = useEditorStore((s) => s.pageCount);

  if (!isOpen) return null;

  const showQuality = format === 'png' || format === 'jpg';
  const showMultiplier = format !== 'svg';
  const outputWidth = artboardWidth * multiplier;
  const outputHeight = artboardHeight * multiplier;

  const handleExport = async () => {
    setActivity('processing');
    try {
    if (format === 'pdf' && vectorPdf) {
      setExporting(true);
      await engine.exportVectorPDF(filename);
      setExporting(false);
    } else if (format === 'pdf' && allPages && pageCount > 1) {
      setExporting(true);
      await engine.exportAllPagesAsPDF({ quality: quality / 100, multiplier, filename });
      setExporting(false);
    } else if ((format === 'png' || format === 'jpg') && allPages && pageCount > 1) {
      // Export all pages as individual images in a ZIP
      setExporting(true);
      const dataUrls = await engine.exportAllPagesAsImages({ format, quality: quality / 100, multiplier, filename });
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      for (let i = 0; i < dataUrls.length; i++) {
        const base64 = dataUrls[i].split(',')[1];
        zip.file(`${filename}-page-${i + 1}.${format}`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}-all-pages.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
    } else {
      engine.export({
        format,
        quality: quality / 100,
        multiplier,
        filename,
        transparent: format === 'png' ? transparent : false,
      });
    }
    setActivity('success');
    showToast(`Exported as ${format.toUpperCase()}`);
    onClose();
    } catch {
      setActivity('error');
    }
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Export design"
    >
      <FocusTrap>
      <div className="animate-scale-up w-full max-w-md rounded-lg bg-overlay p-7 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Export Design</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-text-tertiary hover:bg-wash"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Filename */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-text-secondary">Filename</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            aria-label="Filename"
          />
        </div>

        {/* Format picker */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-text-secondary">Format</label>
          <div className="grid grid-cols-4 gap-2">
            {(['png', 'jpg', 'svg', 'pdf'] as ExportFormat[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium uppercase ${
                  format === f
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border text-text-secondary hover:bg-canvas'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Vector / Raster PDF toggle */}
        {format === 'pdf' && (
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-text-secondary">PDF Mode</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVectorPdf(true)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                  vectorPdf
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border text-text-secondary hover:bg-canvas'
                }`}
              >
                Vector PDF
              </button>
              <button
                type="button"
                onClick={() => setVectorPdf(false)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                  !vectorPdf
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border text-text-secondary hover:bg-canvas'
                }`}
              >
                Raster PDF
              </button>
            </div>
            <p className="mt-1 text-[11px] text-text-tertiary">
              {vectorPdf
                ? 'Text stays selectable, shapes stay sharp at any zoom. Gradients render as images.'
                : 'Exact canvas appearance as a high-res image embedded in PDF.'}
            </p>
          </div>
        )}

        {/* Quality slider */}
        {showQuality && (
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Quality — {quality}%
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
              aria-label="Export quality"
            />
          </div>
        )}

        {/* Resolution multiplier */}
        {showMultiplier && (
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-text-secondary">Resolution</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMultiplier(m)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                    multiplier === m
                      ? 'border-accent bg-accent-subtle text-accent'
                      : 'border-border text-text-secondary hover:bg-canvas'
                  }`}
                >
                  {m}x
                </button>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-text-tertiary">
              Output: {outputWidth} × {outputHeight} px
            </p>
          </div>
        )}

        {/* Transparent background (PNG only) */}
        {format === 'png' && (
          <div className="mb-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-text-secondary">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              <span className="font-medium">Transparent background</span>
            </label>
            <p className="ml-6 mt-0.5 text-[11px] text-text-tertiary">
              Remove the artboard background for logos and overlays.
            </p>
          </div>
        )}

        {/* All pages (multi-page designs) */}
        {format !== 'svg' && pageCount > 1 && (
          <div className="mb-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-text-secondary">
              <input
                type="checkbox"
                checked={allPages}
                onChange={(e) => setAllPages(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              <span className="font-medium">All pages ({pageCount} pages)</span>
            </label>
            <p className="ml-6 mt-0.5 text-[11px] text-text-tertiary">
              {format === 'pdf' ? 'Export all pages as a multi-page PDF.' : `Export each page as a separate ${format.toUpperCase()} in a ZIP file.`}
            </p>
          </div>
        )}

        {/* Format info */}
        <div className="mb-5 rounded-lg bg-canvas px-3 py-2 text-xs text-text-secondary">
          {format === 'png' && 'PNG — lossless with transparency support. Best for graphics and logos.'}
          {format === 'jpg' && 'JPG — compressed, smaller files. Best for photos. No transparency.'}
          {format === 'svg' && 'SVG — vector format, infinitely scalable. Text and shapes stay editable.'}
          {format === 'pdf' && 'PDF — print-ready document. Good for sharing and printing.'}
        </div>

        {/* Export button */}
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-60"
        >
          {exporting ? 'Exporting...' : `Export ${format.toUpperCase()}`}
        </button>
      </div>
      </FocusTrap>
    </div>
  );
}
