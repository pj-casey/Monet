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
 */

import { useState } from 'react';
import { engine } from './Canvas';
import { useEditorStore } from '../stores/editor-store';

type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(92);
  const [multiplier, setMultiplier] = useState(1);
  const [filename, setFilename] = useState('design');
  const artboardWidth = useEditorStore((s) => s.artboardWidth);
  const artboardHeight = useEditorStore((s) => s.artboardHeight);

  if (!isOpen) return null;

  const showQuality = format === 'png' || format === 'jpg';
  const showMultiplier = format !== 'svg';
  const outputWidth = artboardWidth * multiplier;
  const outputHeight = artboardHeight * multiplier;

  const handleExport = () => {
    engine.export({
      format,
      quality: quality / 100,
      multiplier,
      filename,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Export design"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Export Design</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Filename */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-gray-500">Filename</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            aria-label="Filename"
          />
        </div>

        {/* Format picker */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-gray-500">Format</label>
          <div className="grid grid-cols-4 gap-2">
            {(['png', 'jpg', 'svg', 'pdf'] as ExportFormat[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium uppercase ${
                  format === f
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Quality slider */}
        {showQuality && (
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-500">
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
            <label className="mb-2 block text-xs font-medium text-gray-500">Resolution</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMultiplier(m)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                    multiplier === m
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {m}x
                </button>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              Output: {outputWidth} × {outputHeight} px
            </p>
          </div>
        )}

        {/* Format info */}
        <div className="mb-5 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          {format === 'png' && 'PNG — lossless with transparency support. Best for graphics and logos.'}
          {format === 'jpg' && 'JPG — compressed, smaller files. Best for photos. No transparency.'}
          {format === 'svg' && 'SVG — vector format, infinitely scalable. Text and shapes stay editable.'}
          {format === 'pdf' && 'PDF — print-ready document. Good for sharing and printing.'}
        </div>

        {/* Export button */}
        <button
          type="button"
          onClick={handleExport}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Export {format.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
