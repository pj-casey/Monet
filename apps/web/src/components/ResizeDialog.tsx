/**
 * ResizeDialog — Magic Resize modal.
 *
 * User picks target formats, clicks Resize to create duplicated resized
 * versions, or Batch Export to download all sizes as a zip file.
 */

import { useState, useCallback } from 'react';
import { ARTBOARD_PRESETS } from '@monet/shared';
import { FocusTrap } from './A11y';
import type { ArtboardPreset, DesignDocument } from '@monet/shared';
import { resizeDesign } from '../lib/resize';
import { engine } from './Canvas';
import { useEditorStore } from '../stores/editor-store';

interface ResizeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResized: (doc: DesignDocument) => void;
}

export function ResizeDialog({ isOpen, onClose, onOpenResized }: ResizeDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const artboardWidth = useEditorStore((s) => s.artboardWidth);
  const artboardHeight = useEditorStore((s) => s.artboardHeight);

  // All hooks MUST be above the early return (React Rules of Hooks)
  const handleResizeSingle = useCallback((preset: ArtboardPreset) => {
    const doc = engine.toJSON();
    const resized = resizeDesign(doc, preset.width, preset.height);
    onOpenResized(resized);
    onClose();
  }, [onOpenResized, onClose]);

  const handleBatchExport = useCallback(async () => {
    if (selected.size === 0) return;
    setExporting(true);

    const presets = ARTBOARD_PRESETS.filter(
      (p) => p.category !== 'Custom' && !(p.width === artboardWidth && p.height === artboardHeight),
    );
    const currentPreset = ARTBOARD_PRESETS.find(
      (p) => p.width === artboardWidth && p.height === artboardHeight,
    );

    try {
      const sourceDoc = engine.toJSON();
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();

      const currentPng = engine.getArtboardDataURL(1);
      const currentName = currentPreset?.name ?? `${artboardWidth}x${artboardHeight}`;
      zip.file(`${sanitize(currentName)}.png`, dataURLToBlob(currentPng));

      for (const preset of presets) {
        if (!selected.has(preset.name)) continue;
        const resized = resizeDesign(sourceDoc, preset.width, preset.height);
        await engine.fromJSON(resized);
        await new Promise((r) => setTimeout(r, 100));
        const dataUrl = engine.getArtboardDataURL(1);
        zip.file(`${sanitize(preset.name)}.png`, dataURLToBlob(dataUrl));
      }

      await engine.fromJSON(sourceDoc);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sourceDoc.name ?? 'designs'}-all-sizes.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Batch export failed:', err);
    } finally {
      setExporting(false);
      onClose();
    }
  }, [selected, artboardWidth, artboardHeight, onClose]);

  // Early return AFTER all hooks
  if (!isOpen) return null;

  const presets = ARTBOARD_PRESETS.filter(
    (p) => p.category !== 'Custom' && !(p.width === artboardWidth && p.height === artboardHeight),
  );
  const currentPreset = ARTBOARD_PRESETS.find(
    (p) => p.width === artboardWidth && p.height === artboardHeight,
  );

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(presets.map((p) => p.name)));
  const clearAll = () => setSelected(new Set());

  const grouped: Record<string, ArtboardPreset[]> = {};
  for (const p of presets) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  }

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="Magic Resize"
    >
      <FocusTrap>
      <div className="flex h-[80vh] w-[90vw] max-w-3xl flex-col overflow-hidden animate-scale-up rounded-lg bg-overlay shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Magic Resize</h2>
            <p className="text-xs text-text-tertiary">
              Current: {currentPreset?.name ?? 'Custom'} ({artboardWidth} &times; {artboardHeight})
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-text-tertiary hover:bg-wash"
            aria-label="Close">&#x2715;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-text-secondary">
              Select target sizes ({selected.size} selected)
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={selectAll}
                className="text-xs text-accent hover:underline">Select all</button>
              <button type="button" onClick={clearAll}
                className="text-xs text-text-tertiary hover:underline">Clear</button>
            </div>
          </div>

          {Object.entries(grouped).map(([category, categoryPresets]) => (
            <div key={category} className="mb-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">{category}</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categoryPresets.map((preset) => (
                  <PresetCard key={preset.name} preset={preset}
                    checked={selected.has(preset.name)}
                    onToggle={() => toggle(preset.name)}
                    onResizeSingle={() => handleResizeSingle(preset)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <p className="text-xs text-text-tertiary">Resize scales objects proportionally and centers them.</p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-border-strong px-4 py-2 text-sm text-text-secondary hover:bg-canvas">
              Cancel
            </button>
            <button type="button" onClick={handleBatchExport}
              disabled={selected.size === 0 || exporting}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-50">
              {exporting ? 'Exporting...' : `Batch Export (${selected.size + 1} sizes)`}
            </button>
          </div>
        </div>
      </div>
      </FocusTrap>
    </div>
  );
}

function PresetCard({ preset, checked, onToggle, onResizeSingle }: {
  preset: ArtboardPreset; checked: boolean; onToggle: () => void; onResizeSingle: () => void;
}) {
  const maxDim = 36;
  const aspect = preset.width / preset.height;
  const w = aspect >= 1 ? maxDim : maxDim * aspect;
  const h = aspect >= 1 ? maxDim / aspect : maxDim;

  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 ${
      checked ? 'border-accent bg-accent-subtle' : 'border-border'
    }`}>
      <input type="checkbox" checked={checked} onChange={onToggle} className="h-4 w-4 rounded text-accent" />
      <div className="rounded border border-border-strong bg-surface"
        style={{ width: `${w}px`, height: `${h}px` }} />
      <div className="flex-1">
        <p className="text-xs font-medium text-text-primary">{preset.name}</p>
        <p className="text-[10px] text-text-tertiary">{preset.width} &times; {preset.height}</p>
      </div>
      <button type="button" onClick={onResizeSingle} title="Resize to this format"
        className="rounded px-2 py-1 text-[10px] text-accent hover:bg-accent-subtle">
        Open
      </button>
    </div>
  );
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] ?? 'image/png';
  const raw = atob(parts[1]);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
