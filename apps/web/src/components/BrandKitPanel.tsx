/**
 * BrandKitPanel — manage brand colors, fonts, and logos.
 *
 * Shows in the left sidebar when the brand tool is active.
 * Features:
 * - Kit switcher dropdown (multiple kits: Personal, Client A, etc.)
 * - Color palette (up to 12 colors, add/remove)
 * - Font picker (heading, subheading, body)
 * - Logo uploads (stored as base64 in IndexedDB)
 * - Import/export brand kit as JSON
 */

import { useState, useCallback, useRef } from 'react';
import { FONT_LIST } from '@monet/shared';
import { useBrandKit } from '../hooks/use-brand-kit';
import { exportBrandKitFile, importBrandKitFile, saveBrandKit, type BrandLogo } from '../lib/brand-kit';
import { engine } from './Canvas';

export function BrandKitPanel() {
  const {
    kits, activeKit, switchKit, createKit, updateKit, removeKit,
    addColor, removeColor, refresh,
  } = useBrandKit();
  const [newKitName, setNewKitName] = useState('');
  const [showNewKit, setShowNewKit] = useState(false);

  const handleCreateKit = async () => {
    const name = newKitName.trim() || 'New Brand';
    await createKit(name);
    setNewKitName('');
    setShowNewKit(false);
  };

  const handleImport = async () => {
    const kit = await importBrandKitFile();
    if (kit) {
      await saveBrandKit(kit);
      await refresh();
    }
  };

  if (!activeKit && kits.length === 0) {
    return (
      <div className="w-56 border-r border-border bg-surface p-3">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Brand Kit</h3>
        <p className="mb-3 text-xs text-text-tertiary">No brand kits yet.</p>
        <button type="button" onClick={() => createKit('My Brand')}
          className="w-full rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-fg hover:bg-accent-hover">
          Create Brand Kit
        </button>
      </div>
    );
  }

  return (
    <div className="w-56 border-r border-border bg-surface p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Brand Kit</h3>

      {/* Kit switcher */}
      <div className="mb-3 flex gap-1">
        <select
          value={activeKit?.id ?? ''}
          onChange={(e) => switchKit(e.target.value)}
          className="flex-1 rounded border border-border px-2 py-1 text-xs"
          aria-label="Select brand kit"
        >
          {kits.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
        <button type="button" onClick={() => setShowNewKit(true)} title="New kit"
          className="rounded border border-border px-2 text-xs text-text-secondary hover:bg-wash">+</button>
      </div>

      {showNewKit && (
        <div className="mb-3 flex gap-1">
          <input type="text" placeholder="Kit name" value={newKitName}
            onChange={(e) => setNewKitName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateKit(); }}
            className="flex-1 rounded border border-border px-2 py-1 text-xs"
            autoFocus />
          <button type="button" onClick={handleCreateKit}
            className="rounded bg-accent px-2 py-1 text-xs text-accent-fg">Add</button>
        </div>
      )}

      {activeKit && (
        <>
          {/* Colors */}
          <ColorsSection
            colors={activeKit.colors}
            onAdd={addColor}
            onRemove={removeColor}
          />

          {/* Fonts */}
          <FontsSection
            fonts={activeKit.fonts}
            onChange={(fonts) => updateKit({ fonts })}
          />

          {/* Logos */}
          <LogosSection
            logos={activeKit.logos}
            onUpdate={(logos) => updateKit({ logos })}
          />

          {/* Actions */}
          <div className="mt-3 flex flex-col gap-1">
            <button type="button" onClick={() => exportBrandKitFile(activeKit)}
              className="rounded border border-border px-2 py-1 text-[10px] text-text-secondary hover:bg-wash">
              Export Kit
            </button>
            <button type="button" onClick={handleImport}
              className="rounded border border-border px-2 py-1 text-[10px] text-text-secondary hover:bg-wash">
              Import Kit
            </button>
            {kits.length > 1 && (
              <button type="button" onClick={() => removeKit(activeKit.id)}
                className="rounded border border-danger px-2 py-1 text-[10px] text-danger hover:bg-danger-subtle">
                Delete Kit
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Colors ────────────────────────────────────────────────────────

function ColorsSection({ colors, onAdd, onRemove }: {
  colors: string[];
  onAdd: (c: string) => void;
  onRemove: (i: number) => void;
}) {
  const [pickerColor, setPickerColor] = useState('#C4704A');

  return (
    <div className="mb-3">
      <label className="mb-1 block text-[10px] font-medium text-text-secondary">
        Colors ({colors.length}/12)
      </label>
      <div className="flex flex-wrap gap-1">
        {colors.map((color, i) => (
          <button key={i} type="button" title={`${color} — right-click to remove`}
            onClick={() => {
              // Apply to selected object
              engine.updateSelectedObject({ fill: color });
            }}
            onContextMenu={(e) => { e.preventDefault(); onRemove(i); }}
            className="h-6 w-6 rounded border border-border"
            style={{ backgroundColor: color }}
            aria-label={`Brand color ${color}`}
          />
        ))}
        {colors.length < 12 && (
          <div className="flex items-center gap-0.5">
            <input type="color" value={pickerColor} onChange={(e) => setPickerColor(e.target.value)}
              className="h-6 w-6 cursor-pointer rounded border border-border p-0" aria-label="Pick color" />
            <button type="button" onClick={() => onAdd(pickerColor)}
              className="rounded bg-wash px-1.5 py-0.5 text-[10px] text-text-secondary hover:bg-wash">
              +
            </button>
          </div>
        )}
      </div>
      <p className="mt-1 text-[9px] text-text-tertiary">Click to apply. Right-click to remove.</p>
    </div>
  );
}

// ─── Fonts ─────────────────────────────────────────────────────────

function FontsSection({ fonts, onChange }: {
  fonts: { heading: string; subheading: string; body: string };
  onChange: (fonts: { heading: string; subheading: string; body: string }) => void;
}) {
  const update = (key: 'heading' | 'subheading' | 'body', value: string) => {
    onChange({ ...fonts, [key]: value });
  };

  return (
    <div className="mb-3">
      <label className="mb-1 block text-[10px] font-medium text-text-secondary">Fonts</label>
      {(['heading', 'subheading', 'body'] as const).map((key) => (
        <div key={key} className="mb-1 flex items-center gap-1">
          <span className="w-14 text-[9px] capitalize text-text-tertiary">{key}</span>
          <select value={fonts[key]} onChange={(e) => update(key, e.target.value)}
            className="flex-1 rounded border border-border px-1 py-0.5 text-[10px]">
            {FONT_LIST.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

// ─── Logos ──────────────────────────────────────────────────────────

function LogosSection({ logos, onUpdate }: {
  logos: BrandLogo[];
  onUpdate: (logos: BrandLogo[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const newLogos: BrandLogo[] = [...logos];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      const dataUrl = await readAsDataUrl(file);
      newLogos.push({
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        name: file.name,
        dataUrl,
      });
    }
    onUpdate(newLogos);
  }, [logos, onUpdate]);

  const handleRemove = useCallback((id: string) => {
    onUpdate(logos.filter((l) => l.id !== id));
  }, [logos, onUpdate]);

  const handleInsert = useCallback((logo: BrandLogo) => {
    engine.addImageFromUrl(logo.dataUrl);
  }, []);

  return (
    <div className="mb-3">
      <label className="mb-1 block text-[10px] font-medium text-text-secondary">Logos</label>
      <div className="flex flex-wrap gap-1">
        {logos.map((logo) => (
          <button key={logo.id} type="button" title={`${logo.name} — click to insert, right-click to remove`}
            onClick={() => handleInsert(logo)}
            onContextMenu={(e) => { e.preventDefault(); handleRemove(logo.id); }}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-border bg-surface">
            <img src={logo.dataUrl} alt={logo.name} className="max-h-full max-w-full object-contain" />
          </button>
        ))}
        <button type="button" onClick={() => fileRef.current?.click()}
          className="flex h-10 w-10 items-center justify-center rounded border border-dashed border-border-strong text-text-tertiary hover:border-accent hover:text-accent">
          +
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleUpload(e.target.files)} />
      <p className="mt-1 text-[9px] text-text-tertiary">Click logo to insert. Right-click to remove.</p>
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
