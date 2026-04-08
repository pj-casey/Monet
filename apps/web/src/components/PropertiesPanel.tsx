/**
 * PropertiesPanel — the right sidebar showing properties of the selected object.
 *
 * Shows different controls depending on what's selected:
 * - Shapes: fill, stroke, opacity, corner radius
 * - Text: font family, size, weight/style, alignment, spacing + fill, opacity
 * - Nothing: hint message
 */

import { useCallback, useState, useEffect } from 'react';
import type { SelectedObjectProps } from '@monet/shared';
import { useBrandKit } from '../hooks/use-brand-kit';
import { removeBackground, type BgRemovalStatus } from '../lib/remove-bg';
import { getColorHarmonies } from '../lib/color-harmony';
import { FontBrowser } from './FontBrowser';
import { engine } from './Canvas';

interface PropertiesPanelProps {
  selection: SelectedObjectProps | null;
}

export function PropertiesPanel({ selection }: PropertiesPanelProps) {
  if (!selection) {
    return (
      <div className="flex flex-col bg-white p-4 dark:bg-gray-900">
        <p className="text-center text-sm text-gray-400">
          Select an object to edit its properties
        </p>
      </div>
    );
  }

  const isText = selection.objectType === 'textbox';
  const isImage = selection.objectType === 'image';
  const { brandColors } = useBrandKit();

  return (
    <div className="flex w-64 flex-col gap-4 overflow-y-auto border-l border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      {/* Object type header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {friendlyTypeName(selection.objectType)}
        </span>
      </div>

      {/* ─── Image-specific controls ─── */}
      {isImage && (
        <>
          <RemoveBackgroundButton />
          <ImageFiltersSection
            brightness={selection.filterBrightness ?? 0}
            contrast={selection.filterContrast ?? 0}
            saturation={selection.filterSaturation ?? 0}
            blur={selection.filterBlur ?? 0}
            hueRotation={selection.filterHueRotation ?? 0}
            noise={selection.filterNoise ?? 0}
            sharpen={selection.filterSharpen ?? 0}
            tintColor={selection.filterTintColor ?? ''}
            tintAlpha={selection.filterTintAlpha ?? 0}
            vignette={selection.filterVignette ?? 0}
          />
        </>
      )}

      {/* ─── Text-specific controls ─── */}
      {isText && (
        <>
          <FontFamilySection fontFamily={selection.fontFamily ?? 'Inter'} />
          <FontSizeSection fontSize={selection.fontSize ?? 32} />
          <TextStyleSection
            fontWeight={selection.fontWeight ?? 'normal'}
            fontStyle={selection.fontStyle ?? 'normal'}
            underline={selection.underline ?? false}
          />
          <TextAlignSection textAlign={selection.textAlign ?? 'left'} />
          <LineHeightSection lineHeight={selection.lineHeight ?? 1.2} />
          <CharSpacingSection charSpacing={selection.charSpacing ?? 0} />
        </>
      )}

      {/* ─── Common controls ─── */}
      <FillSection fill={selection.fill} brandColors={brandColors} />

      {!isText && (
        <StrokeSection stroke={selection.stroke} strokeWidth={selection.strokeWidth} />
      )}

      <OpacitySection opacity={selection.opacity} />

      {selection.objectType === 'rect' && (
        <CornerRadiusSection radius={selection.cornerRadius} />
      )}

      {/* ─── Blend mode ─── */}
      <BlendModeSection blendMode={selection.blendMode} />

      {/* ─── Precise positioning ─── */}
      <TransformSection
        left={selection.left}
        top={selection.top}
        width={selection.width}
        height={selection.height}
        angle={selection.angle}
      />

      {/* ─── Clipping mask ─── */}
      <ClipMaskSection
        objectType={selection.objectType}
        hasClipPath={selection.hasClipPath}
      />
    </div>
  );
}

// ─── Text property sections ────────────────────────────────────────

function FontFamilySection({ fontFamily }: { fontFamily: string }) {
  return <FontBrowser fontFamily={fontFamily} />;
}

function FontSizeSection({ fontSize }: { fontSize: number }) {
  const handleChange = useCallback((size: number) => {
    engine.updateSelectedTextProps({ fontSize: size });
  }, []);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Size</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={8}
          max={400}
          value={fontSize}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-20 rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          aria-label="Font size"
        />
        <span className="text-xs text-gray-400">px</span>
      </div>
    </div>
  );
}

function TextStyleSection({
  fontWeight,
  fontStyle,
  underline,
}: {
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  underline: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Style</label>
      <div className="flex gap-1">
        <StyleToggle
          label="Bold"
          active={fontWeight === 'bold'}
          onClick={() =>
            engine.updateSelectedTextProps({
              fontWeight: fontWeight === 'bold' ? 'normal' : 'bold',
            })
          }
        >
          <span className="text-sm font-bold">B</span>
        </StyleToggle>

        <StyleToggle
          label="Italic"
          active={fontStyle === 'italic'}
          onClick={() =>
            engine.updateSelectedTextProps({
              fontStyle: fontStyle === 'italic' ? 'normal' : 'italic',
            })
          }
        >
          <span className="text-sm italic">I</span>
        </StyleToggle>

        <StyleToggle
          label="Underline"
          active={underline}
          onClick={() =>
            engine.updateSelectedTextProps({ underline: !underline })
          }
        >
          <span className="text-sm underline">U</span>
        </StyleToggle>
      </div>
    </div>
  );
}

function TextAlignSection({ textAlign }: { textAlign: string }) {
  const alignments: Array<{ value: 'left' | 'center' | 'right' | 'justify'; label: string; icon: string }> = [
    { value: 'left', label: 'Align left', icon: '≡' },
    { value: 'center', label: 'Align center', icon: '≡' },
    { value: 'right', label: 'Align right', icon: '≡' },
    { value: 'justify', label: 'Justify', icon: '≡' },
  ];

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Alignment</label>
      <div className="flex gap-1">
        {alignments.map((a) => (
          <StyleToggle
            key={a.value}
            label={a.label}
            active={textAlign === a.value}
            onClick={() => engine.updateSelectedTextProps({ textAlign: a.value })}
          >
            <AlignIcon align={a.value} />
          </StyleToggle>
        ))}
      </div>
    </div>
  );
}

function LineHeightSection({ lineHeight }: { lineHeight: number }) {
  const handleChange = useCallback((value: number) => {
    engine.updateSelectedTextProps({ lineHeight: value });
  }, []);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
        Line Height — {lineHeight.toFixed(1)}
      </label>
      <input
        type="range"
        min={0.8}
        max={3}
        step={0.1}
        value={lineHeight}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full"
        aria-label="Line height"
      />
    </div>
  );
}

function CharSpacingSection({ charSpacing }: { charSpacing: number }) {
  const handleChange = useCallback((value: number) => {
    engine.updateSelectedTextProps({ charSpacing: value });
  }, []);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
        Letter Spacing — {charSpacing}
      </label>
      <input
        type="range"
        min={-200}
        max={800}
        step={10}
        value={charSpacing}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full"
        aria-label="Letter spacing"
      />
    </div>
  );
}

// ─── Background Removal ────────────────────────────────────────────

function RemoveBackgroundButton() {
  const [status, setStatus] = useState<BgRemovalStatus | null>(null);

  const handleRemoveBg = useCallback(async () => {
    const dataUrl = engine.getSelectedImageDataUrl();
    if (!dataUrl) return;

    const result = await removeBackground(dataUrl, setStatus);
    if (result) {
      await engine.replaceSelectedImage(result);
    }
    // Reset status after a moment
    setTimeout(() => setStatus(null), 2000);
  }, []);

  const label =
    status === 'loading-model' ? 'Downloading AI model...' :
    status === 'processing' ? 'Removing background...' :
    status === 'done' ? 'Done!' :
    status === 'error' ? 'Failed — try again' :
    'Remove Background';

  const isWorking = status === 'loading-model' || status === 'processing';

  return (
    <div>
      <button
        type="button"
        onClick={handleRemoveBg}
        disabled={isWorking}
        className={`w-full rounded-lg px-3 py-2 text-xs font-medium ${
          status === 'done'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : status === 'error'
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50'
        } disabled:opacity-60`}
      >
        {isWorking && <Spinner />}
        {label}
      </button>
      {status === 'loading-model' && (
        <p className="mt-1 text-[9px] text-gray-400">First time: downloads ~40MB AI model (cached after)</p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="mr-1.5 inline h-3 w-3 animate-spin" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Image filter section ──────────────────────────────────────────

function ImageFiltersSection({
  brightness, contrast, saturation, blur,
  hueRotation, noise, sharpen, tintColor, tintAlpha, vignette,
}: {
  brightness: number; contrast: number; saturation: number; blur: number;
  hueRotation: number; noise: number; sharpen: number;
  tintColor: string; tintAlpha: number; vignette: number;
}) {
  const current = { brightness, contrast, saturation, blur, hueRotation, noise, sharpen, tintColor, tintAlpha, vignette };

  const update = useCallback(
    (values: typeof current) => {
      engine.updateImageFilters(values);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const defaults = { brightness: 0, contrast: 0, saturation: 0, blur: 0, hueRotation: 0, noise: 0, sharpen: 0, tintColor: '', tintAlpha: 0, vignette: 0 };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Filters</label>

      <FilterSlider label="Brightness" value={brightness} min={-1} max={1} step={0.05}
        onChange={(v) => update({ ...current, brightness: v })} />
      <FilterSlider label="Contrast" value={contrast} min={-1} max={1} step={0.05}
        onChange={(v) => update({ ...current, contrast: v })} />
      <FilterSlider label="Saturation" value={saturation} min={-1} max={1} step={0.05}
        onChange={(v) => update({ ...current, saturation: v })} />
      <FilterSlider label="Blur" value={blur} min={0} max={1} step={0.02}
        onChange={(v) => update({ ...current, blur: v })} />
      <FilterSlider label="Hue Rotation" value={hueRotation} min={-180} max={180} step={5}
        onChange={(v) => update({ ...current, hueRotation: v })} />
      <FilterSlider label="Noise" value={noise} min={0} max={500} step={10}
        onChange={(v) => update({ ...current, noise: v })} />
      <FilterSlider label="Sharpen" value={sharpen} min={0} max={2} step={0.1}
        onChange={(v) => update({ ...current, sharpen: v })} />
      <FilterSlider label="Vignette" value={vignette} min={0} max={1} step={0.05}
        onChange={(v) => update({ ...current, vignette: v })} />

      {/* Tint with color picker */}
      <div>
        <div className="mb-0.5 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">Tint</span>
          <span className="text-[10px] text-gray-400">{tintAlpha > 0 ? Math.round(tintAlpha * 100) + '%' : 'off'}</span>
        </div>
        <div className="flex items-center gap-1">
          <input type="color" value={tintColor || '#ff6600'}
            onChange={(e) => update({ ...current, tintColor: e.target.value, tintAlpha: current.tintAlpha || 0.3 })}
            className="h-6 w-6 cursor-pointer rounded border border-gray-200 p-0.5" aria-label="Tint color" />
          <input type="range" min={0} max={1} step={0.05} value={tintAlpha}
            onChange={(e) => update({ ...current, tintAlpha: Number(e.target.value), tintColor: current.tintColor || '#ff6600' })}
            className="flex-1" aria-label="Tint intensity" />
        </div>
      </div>

      <button type="button"
        onClick={() => update(defaults)}
        className="mt-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800">
        Reset Filters
      </button>
    </div>
  );
}

function FilterSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const display = value === 0 ? '0' : value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[10px] text-gray-400">
        <span>{label}</span>
        <span>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label={label}
      />
    </div>
  );
}

// ─── Shape/common property sections ────────────────────────────────

function FillSection({ fill, brandColors }: { fill: string; brandColors?: string[] }) {
  const handleChange = useCallback((color: string) => {
    engine.updateSelectedObject({ fill: color });
  }, []);

  const currentColor = fill === '(gradient)' ? '#4A90D9' : fill || '#4A90D9';
  const harmonies = currentColor.startsWith('#') ? getColorHarmonies(currentColor) : [];

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
        Fill
      </label>
      <div className="flex items-center gap-2">
        <ColorInput
          value={currentColor}
          onChange={handleChange}
          brandColors={brandColors}
        />
        <span className="text-xs text-gray-400">{fill || 'none'}</span>
      </div>
      {/* Color harmony suggestions */}
      {harmonies.length > 0 && (
        <div className="mt-1.5">
          <span className="text-[9px] text-gray-400 dark:text-gray-500">Harmonies:</span>
          <div className="mt-0.5 flex flex-wrap gap-1">
            {harmonies.map((h) => (
              <div key={h.name} className="flex items-center gap-0.5" title={h.name}>
                <span className="text-[8px] text-gray-400">{h.name.slice(0, 4)}</span>
                {h.colors.map((c) => (
                  <button key={c} type="button" onClick={() => handleChange(c)} title={`${h.name}: ${c}`}
                    className="h-4 w-4 rounded-sm border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StrokeSection({ stroke, strokeWidth }: { stroke: string; strokeWidth: number }) {
  const handleColorChange = useCallback(
    (color: string) => {
      engine.updateSelectedObject({ stroke: color, strokeWidth: strokeWidth || 2 });
    },
    [strokeWidth],
  );

  const handleWidthChange = useCallback((width: number) => {
    engine.updateSelectedObject({ strokeWidth: width });
  }, []);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Stroke</label>
      <div className="flex items-center gap-2">
        <ColorInput value={stroke || '#000000'} onChange={handleColorChange} />
        <input
          type="number"
          min={0}
          max={50}
          value={strokeWidth}
          onChange={(e) => handleWidthChange(Number(e.target.value))}
          className="w-14 rounded border border-gray-200 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          aria-label="Stroke width"
        />
        <span className="text-xs text-gray-400">px</span>
      </div>
    </div>
  );
}

function OpacitySection({ opacity }: { opacity: number }) {
  const handleChange = useCallback((newOpacity: number) => {
    engine.updateSelectedObject({ opacity: newOpacity });
  }, []);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
        Opacity — {Math.round(opacity * 100)}%
      </label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={opacity}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full"
        aria-label="Opacity"
      />
    </div>
  );
}

function CornerRadiusSection({ radius }: { radius: number }) {
  const handleChange = useCallback((newRadius: number) => {
    engine.updateSelectedObject({ cornerRadius: newRadius });
  }, []);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
        Corner Radius — {Math.round(radius)}px
      </label>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={radius}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full"
        aria-label="Corner radius"
      />
    </div>
  );
}

// ─── Blend Mode ───────────────────────────────────────────────────

const BLEND_MODES: { value: string; label: string }[] = [
  { value: 'source-over', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'color-burn', label: 'Color Burn' },
];

function BlendModeSection({ blendMode }: { blendMode: string }) {
  const handleChange = useCallback((mode: string) => {
    engine.updateSelectedObject({ blendMode: mode });
  }, []);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Blend Mode</label>
      <select
        value={blendMode}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded border border-gray-200 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        aria-label="Blend mode"
      >
        {BLEND_MODES.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Transform (Precise Positioning) ──────────────────────────────

function TransformSection({ left, top, width, height, angle }: {
  left: number; top: number; width: number; height: number; angle: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Transform</label>
      <div className="grid grid-cols-2 gap-1">
        <TransformInput label="X" value={Math.round(left)} onChange={(v) => engine.updateSelectedObject({ left: v })} />
        <TransformInput label="Y" value={Math.round(top)} onChange={(v) => engine.updateSelectedObject({ top: v })} />
        <TransformInput label="W" value={Math.round(width)} min={1} onChange={(v) => engine.updateSelectedObject({ width: v })} />
        <TransformInput label="H" value={Math.round(height)} min={1} onChange={(v) => engine.updateSelectedObject({ height: v })} />
      </div>
      <div className="mt-1">
        <TransformInput label="Rotation" value={Math.round(angle * 10) / 10} suffix="°" onChange={(v) => engine.updateSelectedObject({ angle: v })} />
      </div>
    </div>
  );
}

function TransformInput({ label, value, min, suffix, onChange }: {
  label: string; value: number; min?: number; suffix?: string;
  onChange: (v: number) => void;
}) {
  const [localValue, setLocalValue] = useState(String(value));

  // Sync local value from props when the user is NOT actively editing this input
  useEffect(() => {
    const valueStr = String(value);
    if (document.activeElement?.getAttribute('data-transform-label') !== label) {
      setLocalValue(valueStr);
    }
  }, [value, label]);

  const commit = useCallback(() => {
    const num = parseFloat(localValue);
    if (!isNaN(num) && (min === undefined || num >= min)) {
      onChange(num);
    } else {
      setLocalValue(String(value));
    }
  }, [localValue, value, min, onChange]);

  return (
    <div className="flex items-center gap-1">
      <span className="w-5 text-right text-[10px] text-gray-400">{label}</span>
      <input
        type="number"
        data-transform-label={label}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
        min={min}
        step={label === 'Rotation' ? 1 : undefined}
        className="w-full rounded border border-gray-200 px-1.5 py-0.5 text-xs tabular-nums dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        aria-label={label}
      />
      {suffix && <span className="text-[10px] text-gray-400">{suffix}</span>}
    </div>
  );
}

// ─── Clipping Mask ────────────────────────────────────────────────

function ClipMaskSection({ objectType, hasClipPath }: { objectType: string; hasClipPath: boolean }) {
  const handleClip = useCallback(() => {
    engine.clipToShape();
  }, []);

  const handleUnclip = useCallback(() => {
    engine.unclipObject();
  }, []);

  // Only show clip button for multi-selection (activeselection)
  const isMultiSelect = objectType === 'activeselection';

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Clip Mask</label>

      {isMultiSelect && (
        <button
          type="button"
          onClick={handleClip}
          className="mb-1 w-full rounded bg-purple-50 px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
        >
          Clip to Shape
        </button>
      )}

      {hasClipPath && (
        <button
          type="button"
          onClick={handleUnclip}
          className="mb-1 w-full rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Remove Clip Mask
        </button>
      )}

      {!isMultiSelect && !hasClipPath && (
        <p className="text-[10px] text-gray-400">
          Select 2 objects to create a clip mask (bottom = mask shape, top = clipped).
        </p>
      )}
    </div>
  );
}

// ─── Shared components ─────────────────────────────────────────────

function ColorInput({ value, onChange, brandColors }: {
  value: string; onChange: (c: string) => void; brandColors?: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {/* Brand colors — shown first for quick access */}
      {brandColors && brandColors.length > 0 && brandColors.map((bc, i) => (
        <button key={i} type="button" onClick={() => onChange(bc)} title={bc}
          className="h-5 w-5 rounded border border-gray-200 dark:border-gray-600"
          style={{ backgroundColor: bc }} aria-label={`Brand color ${bc}`} />
      ))}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-7 cursor-pointer rounded border border-gray-200 p-0.5 dark:border-gray-600"
        aria-label="Color picker"
      />
    </div>
  );
}

function StyleToggle({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded ${
        active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </button>
  );
}

function AlignIcon({ align }: { align: string }) {
  const lines: [number, number][] =
    align === 'left'
      ? [[2, 14], [2, 10], [2, 14], [2, 8]]
      : align === 'center'
        ? [[3, 13], [1, 15], [3, 13], [2, 14]]
        : align === 'right'
          ? [[4, 14], [6, 14], [2, 14], [8, 14]]
          : [[2, 14], [2, 14], [2, 14], [2, 14]]; // justify
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1={lines[0][0]} y1="3" x2={lines[0][1]} y2="3" />
      <line x1={lines[1][0]} y1="6.5" x2={lines[1][1]} y2="6.5" />
      <line x1={lines[2][0]} y1="10" x2={lines[2][1]} y2="10" />
      <line x1={lines[3][0]} y1="13" x2={lines[3][1]} y2="13" />
    </svg>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────

function friendlyTypeName(type: string): string {
  const map: Record<string, string> = {
    rect: 'Rectangle',
    circle: 'Circle',
    triangle: 'Triangle',
    line: 'Line',
    group: 'Arrow',
    polygon: 'Star',
    path: 'Path',
    textbox: 'Text',
    image: 'Image',
  };
  return map[type] || type;
}
