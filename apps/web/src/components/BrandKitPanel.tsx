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
      <div className="w-56 border-r border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Brand Kit</h3>
        <p className="mb-3 text-xs text-gray-400">No brand kits yet.</p>
        <button type="button" onClick={() => createKit('My Brand')}
          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700">
          Create Brand Kit
        </button>
      </div>
    );
  }

  return (
    <div className="w-56 border-r border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Brand Kit</h3>

      {/* Kit switcher */}
      <div className="mb-3 flex gap-1">
        <select
          value={activeKit?.id ?? ''}
          onChange={(e) => switchKit(e.target.value)}
          className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          aria-label="Select brand kit"
        >
          {kits.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
        <button type="button" onClick={() => setShowNewKit(true)} title="New kit"
          className="rounded border border-gray-200 px-2 text-xs text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">+</button>
      </div>

      {showNewKit && (
        <div className="mb-3 flex gap-1">
          <input type="text" placeholder="Kit name" value={newKitName}
            onChange={(e) => setNewKitName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateKit(); }}
            className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            autoFocus />
          <button type="button" onClick={handleCreateKit}
            className="rounded bg-blue-600 px-2 py-1 text-xs text-white">Add</button>
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
              className="rounded border border-gray-200 px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">
              Export Kit
            </button>
            <button type="button" onClick={handleImport}
              className="rounded border border-gray-200 px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">
              Import Kit
            </button>
            {kits.length > 1 && (
              <button type="button" onClick={() => removeKit(activeKit.id)}
                className="rounded border border-red-200 px-2 py-1 text-[10px] text-red-500 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20">
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
  const [pickerColor, setPickerColor] = useState('#4A90D9');

  return (
    <div className="mb-3">
      <label className="mb-1 block text-[10px] font-medium text-gray-500 dark:text-gray-400">
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
            className="h-6 w-6 rounded border border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: color }}
            aria-label={`Brand color ${color}`}
          />
        ))}
        {colors.length < 12 && (
          <div className="flex items-center gap-0.5">
            <input type="color" value={pickerColor} onChange={(e) => setPickerColor(e.target.value)}
              className="h-6 w-6 cursor-pointer rounded border border-gray-200 p-0" aria-label="Pick color" />
            <button type="button" onClick={() => onAdd(pickerColor)}
              className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
              +
            </button>
          </div>
        )}
      </div>
      <p className="mt-1 text-[9px] text-gray-400">Click to apply. Right-click to remove.</p>
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
      <label className="mb-1 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Fonts</label>
      {(['heading', 'subheading', 'body'] as const).map((key) => (
        <div key={key} className="mb-1 flex items-center gap-1">
          <span className="w-14 text-[9px] capitalize text-gray-400">{key}</span>
          <select value={fonts[key]} onChange={(e) => update(key, e.target.value)}
            className="flex-1 rounded border border-gray-200 px-1 py-0.5 text-[10px] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
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
      <label className="mb-1 block text-[10px] font-medium text-gray-500 dark:text-gray-400">Logos</label>
      <div className="flex flex-wrap gap-1">
        {logos.map((logo) => (
          <button key={logo.id} type="button" title={`${logo.name} — click to insert, right-click to remove`}
            onClick={() => handleInsert(logo)}
            onContextMenu={(e) => { e.preventDefault(); handleRemove(logo.id); }}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
            <img src={logo.dataUrl} alt={logo.name} className="max-h-full max-w-full object-contain" />
          </button>
        ))}
        <button type="button" onClick={() => fileRef.current?.click()}
          className="flex h-10 w-10 items-center justify-center rounded border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:border-gray-600">
          +
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleUpload(e.target.files)} />
      <p className="mt-1 text-[9px] text-gray-400">Click logo to insert. Right-click to remove.</p>
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
