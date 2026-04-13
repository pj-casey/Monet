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
import { useCanvasStore } from '../stores/canvas-store';
import { removeBackground, type BgRemovalStatus } from '../lib/remove-bg';
import { isAIConfigured, chatWithClaude } from '../lib/ai-assistant';
import { FontBrowser } from './FontBrowser';
import { ColorPicker } from './ColorPicker';
import { showToast } from './Toast';
import { engine } from './Canvas';

interface PropertiesPanelProps {
  selection: SelectedObjectProps | null;
}

export function PropertiesPanel({ selection }: PropertiesPanelProps) {
  // Hooks must be called unconditionally (React Rules of Hooks)
  const { brandColors } = useBrandKit();

  if (!selection) {
    return <CanvasPropertiesPanel brandColors={brandColors} />;
  }

  const isText = selection.objectType === 'textbox';
  const isImage = selection.objectType === 'image';

  return (
    <div className="flex flex-col gap-4 bg-surface p-4">
      {/* Object type header */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <span className="text-sm font-medium text-text-primary">
          {friendlyTypeName(selection.objectType)}
        </span>
      </div>

      {/* ─── Crop UI (shown during crop mode regardless of active object type) ─── */}
      {(selection.isCropping ?? false) && !isImage && (
        <CropToolSection isCropping={true} />
      )}

      {/* ─── Image: Crop + Replace + Remove BG ─── */}
      {isImage && (
        <>
          <CropToolSection isCropping={selection.isCropping ?? false} />
          <ImageReplaceButton />
          <RemoveBackgroundCard />
          <ImageColorsSection />
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
            vibrance={selection.filterVibrance ?? 0}
            gamma={selection.filterGamma ?? 0}
            pixelate={selection.filterPixelate ?? 0}
            grayscale={selection.filterGrayscale ?? false}
            invert={selection.filterInvert ?? false}
            sepia={selection.filterSepia ?? false}
          />
        </>
      )}

      {/* ─── Text: contextual AI Suggest Copy ─── */}
      {isText && <SuggestCopyButton text={selection.text} />}

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
          <TextTransformSection text={selection.text ?? ''} />
          <TextAlignSection textAlign={selection.textAlign ?? 'left'} />
          <LineHeightSection lineHeight={selection.lineHeight ?? 1.2} />
          <CharSpacingSection charSpacing={selection.charSpacing ?? 0} />
          <TextDecorationSection
            linethrough={selection.linethrough ?? false}
            overline={selection.overline ?? false}
          />
          <TextOutlineSection
            stroke={selection.textStroke ?? ''}
            strokeWidth={selection.textStrokeWidth ?? 0}
          />
          <TextPathSection
            text={selection.text ?? ''}
            fontFamily={selection.fontFamily ?? 'DM Sans'}
            fontSize={selection.fontSize ?? 32}
            fontWeight={(selection.fontWeight ?? 'normal') as 'normal' | 'bold'}
            fill={selection.fill ?? '#2d2a26'}
          />
        </>
      )}

      {/* ─── Fill (with gradient toggle) ─── */}
      <FillSection
        fill={selection.fill}
        fillType={selection.fillType ?? 'solid'}
        gradientAngle={selection.gradientAngle ?? 0}
        gradientStops={selection.gradientStops}
        brandColors={brandColors}
      />

      {/* ─── Stroke (with dash/cap/join) ─── */}
      {!isText && (
        <StrokeStyleSection
          stroke={selection.stroke}
          strokeWidth={selection.strokeWidth}
          dashStyle={selection.strokeDashStyle ?? 'solid'}
          lineCap={selection.strokeLineCap ?? 'butt'}
          lineJoin={selection.strokeLineJoin ?? 'miter'}
        />
      )}

      {/* ─── Shadow ─── */}
      <ShadowSection
        enabled={selection.shadowEnabled ?? false}
        color={selection.shadowColor ?? 'oklch(0.30 0.02 60 / 0.3)'}
        blur={selection.shadowBlur ?? 10}
        offsetX={selection.shadowOffsetX ?? 4}
        offsetY={selection.shadowOffsetY ?? 4}
      />

      {/* ─── Effects ─── */}
      <OpacitySection opacity={selection.opacity} />
      <BlendModeSection blendMode={selection.blendMode} />

      {/* ─── Corners ─── */}
      {selection.objectType === 'rect' && (
        <CornerRadiusSection radius={selection.cornerRadius} />
      )}

      {/* ─── Flip & Rotate Shortcuts ─── */}
      <FlipRotateSection
        flipX={selection.flipX ?? false}
        flipY={selection.flipY ?? false}
        angle={selection.angle}
      />

      {/* ─── Position & Size ─── */}
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">Size</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={8}
          max={400}
          value={fontSize}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-20 rounded border border-border px-2 py-1 text-sm"
          aria-label="Font size"
        />
        <span className="text-xs text-text-tertiary">px</span>
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">Style</label>
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">Alignment</label>
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">
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

// ─── Contextual AI: Suggest Copy for Text ─────────────────────────

function SuggestCopyButton({ text }: { text?: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSuggest = useCallback(async () => {
    if (!text || !isAIConfigured()) return;
    setOpen(true);
    setLoading(true);
    setSuggestions([]);
    try {
      const doc = engine.toJSON();
      const response = await chatWithClaude(
        [], doc,
        `Suggest 3 alternative text options for: "${text}". Return as suggest_copy action.`,
      );
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch { setSuggestions([]); }
    setLoading(false);
  }, [text]);

  const handleApply = useCallback((newText: string) => {
    engine.updateSelectedTextProps({ text: newText });
    setOpen(false);
    setSuggestions([]);
  }, []);

  if (!isAIConfigured()) return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleSuggest}
        disabled={loading || !text}
        className="flex w-full items-center gap-2 rounded-lg border border-accent bg-accent-subtle px-3 py-2.5 text-left text-xs font-medium text-accent hover:bg-accent-subtle disabled:opacity-50"
      >
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
          <path d="M9 2l1.5 4.5L15 8l-4.5 1.5L9 14l-1.5-4.5L3 8l4.5-1.5z" />
        </svg>
        {loading ? 'Generating suggestions...' : 'Suggest alternative copy'}
      </button>

      {/* Inline suggestions */}
      {open && suggestions.length > 0 && (
        <div className="mt-2 flex flex-col gap-1.5">
          {suggestions.map((s, i) => (
            <button key={i} type="button" onClick={() => handleApply(s)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-left text-[11px] text-text-secondary hover:border-accent hover:bg-accent-subtle">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Background Removal (card-style) ──────────────────────────────

function RemoveBackgroundCard() {
  const [status, setStatus] = useState<BgRemovalStatus | null>(null);

  const handleRemoveBg = useCallback(async () => {
    const dataUrl = engine.getSelectedImageDataUrl();
    if (!dataUrl) return;

    const result = await removeBackground(dataUrl, setStatus);
    if (result) {
      await engine.replaceSelectedImage(result);
    }
    setTimeout(() => setStatus(null), 2000);
  }, []);

  const isWorking = status === 'loading-model' || status === 'processing';

  return (
    <div>
      <button
        type="button"
        onClick={handleRemoveBg}
        disabled={isWorking}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium ${
          status === 'done'
            ? 'bg-success-subtle text-success'
            : status === 'error'
              ? 'bg-danger-subtle text-danger'
              : 'bg-accent-subtle text-accent hover:bg-accent-subtle'
        } disabled:opacity-60`}
      >
        {isWorking ? <Spinner /> : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="flex-shrink-0">
            <rect x="2" y="3" width="12" height="10" rx="1.5"/>
            <path d="M2 10l3-3 2 2 3-4 4 5" />
            <path d="M11 4l3 3M14 4l-3 3" strokeLinecap="round" opacity="0.5"/>
          </svg>
        )}
        {status === 'done' ? 'Background removed!' :
         status === 'error' ? 'Failed — try again' :
         isWorking ? (status === 'loading-model' ? 'Downloading AI model...' : 'Removing...') :
         'Remove Background'}
      </button>
      {status === 'loading-model' && (
        <p className="mt-1 text-[9px] text-text-tertiary">First time: downloads ~40MB model (cached after)</p>
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

function ImageColorsSection() {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    engine.getSelectedImagePalette(6).then(setColors).catch(() => setColors([]));
  }, []);

  if (colors.length === 0) return null;

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      showToast(`Copied ${hex}`);
    });
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-text-secondary">Image Colors</label>
      <div className="flex flex-wrap gap-1.5">
        {colors.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleCopy(c)}
            title={`${c} — click to copy`}
            className="h-7 w-7 rounded-md border border-border shadow-sm hover:scale-110 transition-transform"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <p className="mt-1 text-[9px] text-text-tertiary">Click a swatch to copy its hex value</p>
    </div>
  );
}

// ─── Image filter section ──────────────────────────────────────────

function ImageFiltersSection({
  brightness, contrast, saturation, blur,
  hueRotation, noise, sharpen, tintColor, tintAlpha, vignette,
  vibrance, gamma, pixelate, grayscale, invert, sepia,
}: {
  brightness: number; contrast: number; saturation: number; blur: number;
  hueRotation: number; noise: number; sharpen: number;
  tintColor: string; tintAlpha: number; vignette: number;
  vibrance: number; gamma: number; pixelate: number;
  grayscale: boolean; invert: boolean; sepia: boolean;
}) {
  const [open, setOpen] = useState(true);
  const current = { brightness, contrast, saturation, blur, hueRotation, noise, sharpen, tintColor, tintAlpha, vignette, vibrance, gamma, pixelate, grayscale, invert, sepia };

  const update = useCallback(
    (values: typeof current) => {
      engine.updateImageFilters(values);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const defaults = { brightness: 0, contrast: 0, saturation: 0, blur: 0, hueRotation: 0, noise: 0, sharpen: 0, tintColor: '', tintAlpha: 0, vignette: 0, vibrance: 0, gamma: 0, pixelate: 0, grayscale: false, invert: false, sepia: false };

  return (
    <div>
      {/* Collapsible header */}
      <button type="button" onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-xs font-medium text-text-secondary">
        Adjustments
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M3 4.5 6 7.5 9 4.5" />
        </svg>
      </button>

      {open && (
        <div className="flex flex-col gap-2.5 pb-2">
          {/* ─── Adjustment Sliders ─── */}
          <AdjSlider label="Brightness" value={brightness} min={-1} max={1} step={0.01} displayRange={100}
            onChange={(v) => update({ ...current, brightness: v })} />
          <AdjSlider label="Contrast" value={contrast} min={-1} max={1} step={0.01} displayRange={100}
            onChange={(v) => update({ ...current, contrast: v })} />
          <AdjSlider label="Saturation" value={saturation} min={-1} max={1} step={0.01} displayRange={100}
            onChange={(v) => update({ ...current, saturation: v })} />
          <AdjSlider label="Vibrance" value={vibrance} min={-1} max={1} step={0.01} displayRange={100}
            onChange={(v) => update({ ...current, vibrance: v })} />
          <AdjSlider label="Hue" value={hueRotation} min={-180} max={180} step={1} displayRange={1} suffix="°"
            onChange={(v) => update({ ...current, hueRotation: v })} />
          <AdjSlider label="Gamma" value={gamma} min={-1} max={1} step={0.01} displayRange={100}
            onChange={(v) => update({ ...current, gamma: v })} />
          <AdjSlider label="Blur" value={blur} min={0} max={1} step={0.01} displayRange={20}            onChange={(v) => update({ ...current, blur: v })} />
          <AdjSlider label="Noise" value={noise} min={0} max={500} step={1} displayRange={0.2}            onChange={(v) => update({ ...current, noise: v })} />
          <AdjSlider label="Sharpen" value={sharpen} min={0} max={2} step={0.01} displayRange={50}            onChange={(v) => update({ ...current, sharpen: v })} />
          <AdjSlider label="Pixelate" value={pixelate} min={0} max={20} step={1} displayRange={1}            onChange={(v) => update({ ...current, pixelate: v })} />
          <AdjSlider label="Vignette" value={vignette} min={0} max={1} step={0.01} displayRange={100}            onChange={(v) => update({ ...current, vignette: v })} />

          {/* ─── Effect Toggles ─── */}
          <div className="flex gap-1.5 pt-1">
            <EffectToggle label="Grayscale" active={grayscale}
              onClick={() => update({ ...current, grayscale: !grayscale })} />
            <EffectToggle label="Sepia" active={sepia}
              onClick={() => update({ ...current, sepia: !sepia })} />
            <EffectToggle label="Invert" active={invert}
              onClick={() => update({ ...current, invert: !invert })} />
          </div>

          {/* ─── Tint ─── */}
          <div>
            <div className="mb-0.5 flex items-center justify-between">
              <span className="text-[10px] text-text-secondary">Tint</span>
              <span className="text-[10px] text-text-tertiary">{tintAlpha > 0 ? Math.round(tintAlpha * 100) + '%' : 'off'}</span>
            </div>
            <div className="flex items-center gap-1">
              <input type="color" value={tintColor || '#ff6600'}
                onChange={(e) => update({ ...current, tintColor: e.target.value, tintAlpha: current.tintAlpha || 0.3 })}
                className="h-6 w-6 cursor-pointer rounded border border-border p-0.5" aria-label="Tint color" />
              <input type="range" min={0} max={1} step={0.05} value={tintAlpha}
                onChange={(e) => update({ ...current, tintAlpha: Number(e.target.value), tintColor: current.tintColor || '#ff6600' })}
                className="flex-1" aria-label="Tint intensity" />
            </div>
          </div>

          {/* ─── Reset ─── */}
          <button type="button"
            onClick={() => update(defaults)}
            className="mt-1 rounded border border-border px-2 py-1 text-[10px] text-text-secondary hover:bg-canvas">
            Reset Adjustments
          </button>
        </div>
      )}
    </div>
  );
}

/** Effect toggle pill button */
function EffectToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
        active ? 'bg-accent text-accent-fg' : 'bg-wash text-text-secondary hover:text-text-primary'
      }`}>
      {label}
    </button>
  );
}

/** Adjustment slider with user-friendly display values */
function AdjSlider({
  label, value, min, max, step, displayRange, suffix, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  /** Multiply internal value by this for display (e.g. 100 turns 0.5 → 50) */
  displayRange?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  const dr = displayRange ?? 1;
  const display = Math.round(value * dr);
  const prefix = display > 0 && min < 0 ? '+' : '';
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[10px] text-text-tertiary">
        <span>{label}</span>
        <span>{prefix}{display}{suffix ?? ''}</span>
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

function FillSection({ fill, fillType, gradientAngle, gradientStops, brandColors }: {
  fill: string; fillType: string; gradientAngle?: number;
  gradientStops?: Array<{ offset: number; color: string }>; brandColors?: string[];
}) {
  const [mode, setMode] = useState<'solid' | 'linear' | 'radial'>(fillType as any || 'solid');
  const [angle, setAngle] = useState(gradientAngle ?? 90);
  const [stops, setStops] = useState(gradientStops ?? [
    { offset: 0, color: '#C4704A' }, { offset: 1, color: '#d4a574' },
  ]);

  useEffect(() => {
    setMode(fillType as any || 'solid');
    if (gradientAngle !== undefined) setAngle(gradientAngle);
    if (gradientStops && gradientStops.length >= 2) setStops(gradientStops);
  }, [fillType, gradientAngle, gradientStops]);

  const handleSolidChange = useCallback((color: string) => {
    engine.updateSelectedObject({ fill: color });
  }, []);

  const applyGradient = useCallback((type: 'linear' | 'radial', a: number, s: Array<{ offset: number; color: string }>) => {
    engine.updateSelectedObject({ gradientFill: { type, angle: a, stops: s } });
  }, []);

  const currentColor = fill === '(gradient)' ? '#C4704A' : fill || '#C4704A';

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">Fill</label>
      {/* Mode toggle */}
      <div className="mb-2 flex rounded-sm border border-border text-[10px]">
        {(['solid', 'linear', 'radial'] as const).map((m) => (
          <button key={m} type="button"
            onClick={() => {
              setMode(m);
              if (m === 'solid') {
                engine.updateSelectedObject({ fill: currentColor });
              } else {
                applyGradient(m, angle, stops);
              }
            }}
            className={`flex-1 py-1 font-medium capitalize ${mode === m ? 'bg-accent text-accent-fg' : 'text-text-secondary hover:bg-wash'}`}>
            {m === 'linear' ? 'Linear' : m === 'radial' ? 'Radial' : 'Solid'}
          </button>
        ))}
      </div>

      {mode === 'solid' ? (
        <div className="flex items-center gap-2">
          <ColorInput value={currentColor} onChange={handleSolidChange} brandColors={brandColors} />
          <span className="text-xs text-text-tertiary">{fill || 'none'}</span>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Gradient preview bar */}
          <div className="h-6 w-full rounded-sm border border-border"
            style={{ background: `linear-gradient(${angle}deg, ${stops.map((s) => `${s.color} ${s.offset * 100}%`).join(', ')})` }} />
          {/* Angle (linear only) */}
          {mode === 'linear' && (
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-text-tertiary">Angle</label>
              <input type="range" min={0} max={360} value={angle}
                onChange={(e) => { const a = Number(e.target.value); setAngle(a); applyGradient('linear', a, stops); }}
                className="flex-1" aria-label="Gradient angle" />
              <input
                type="number"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => { const a = Math.max(0, Math.min(360, Number(e.target.value) || 0)); setAngle(a); applyGradient('linear', a, stops); }}
                className="w-12 rounded border border-border bg-canvas px-1.5 py-0.5 text-right text-[10px] tabular-nums text-text-primary"
                aria-label="Gradient angle degrees"
              />
            </div>
          )}
          {/* Color stops */}
          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-1">
              <ColorPicker value={stop.color} onChange={(c) => {
                const next = [...stops]; next[i] = { ...next[i], color: c };
                setStops(next);
                applyGradient(mode, angle, next);
              }} />
              <input type="range" min={0} max={100} value={Math.round(stop.offset * 100)}
                onChange={(e) => {
                  const next = [...stops]; next[i] = { ...next[i], offset: Number(e.target.value) / 100 };
                  setStops(next);
                  applyGradient(mode, angle, next);
                }}
                className="flex-1" aria-label={`Stop ${i + 1} position`} />
              <span className="w-7 text-right text-[10px] text-text-tertiary">{Math.round(stop.offset * 100)}%</span>
              {stops.length > 2 && (
                <button type="button" onClick={() => {
                  const next = stops.filter((_, j) => j !== i);
                  setStops(next);
                  applyGradient(mode, angle, next);
                }} className="text-[10px] text-danger">&times;</button>
              )}
            </div>
          ))}
          {stops.length < 8 && (
            <button type="button" onClick={() => {
              const next = [...stops, { offset: 0.5, color: '#9a9088' }].sort((a, b) => a.offset - b.offset);
              setStops(next);
              applyGradient(mode, angle, next);
            }} className="text-[10px] text-accent hover:underline">+ Add stop</button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stroke with dash/cap/join ────────────────────────────────────

const DASH_PATTERNS: Record<string, number[] | null> = {
  solid: null,
  dashed: [8, 4],
  dotted: [1, 2],
  'dash-dot': [8, 4, 1, 4],
};

function StrokeStyleSection({ stroke, strokeWidth, dashStyle, lineCap, lineJoin }: {
  stroke: string; strokeWidth: number; dashStyle: string; lineCap: string; lineJoin: string;
}) {
  const handleColorChange = useCallback((color: string) => {
    engine.updateSelectedObject({ stroke: color, strokeWidth: strokeWidth || 2 });
  }, [strokeWidth]);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">Stroke</label>
      <div className="flex items-center gap-2">
        <ColorInput value={stroke || '#2d2a26'} onChange={handleColorChange} />
        <input type="range" min={0} max={20} step={0.5} value={strokeWidth}
          onChange={(e) => engine.updateSelectedObject({ strokeWidth: Number(e.target.value) })}
          className="flex-1" aria-label="Stroke width" />
        <span className="w-7 text-right text-[10px] text-text-tertiary">{strokeWidth}px</span>
      </div>
      {/* Dash pattern */}
      <div className="mt-2 flex gap-1">
        {Object.entries(DASH_PATTERNS).map(([name, pattern]) => (
          <button key={name} type="button"
            onClick={() => engine.updateSelectedObject({ strokeDashArray: pattern })}
            className={`flex-1 rounded-sm border py-1 text-[9px] capitalize ${dashStyle === name ? 'border-accent text-accent' : 'border-border text-text-tertiary'}`}>
            {name}
          </button>
        ))}
      </div>
      {/* Line cap & join */}
      <div className="mt-2 flex gap-2">
        <div className="flex-1">
          <label className="mb-0.5 block text-[9px] text-text-tertiary">Cap</label>
          <select value={lineCap} onChange={(e) => engine.updateSelectedObject({ strokeLineCap: e.target.value })}
            className="w-full rounded-sm border border-border px-1 py-0.5 text-[10px] text-text-primary">
            <option value="butt">Butt</option>
            <option value="round">Round</option>
            <option value="square">Square</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-0.5 block text-[9px] text-text-tertiary">Join</label>
          <select value={lineJoin} onChange={(e) => engine.updateSelectedObject({ strokeLineJoin: e.target.value })}
            className="w-full rounded-sm border border-border px-1 py-0.5 text-[10px] text-text-primary">
            <option value="miter">Miter</option>
            <option value="round">Round</option>
            <option value="bevel">Bevel</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Shadow ───────────────────────────────────────────────────────

function ShadowSection({ enabled, color, blur, offsetX, offsetY }: {
  enabled: boolean; color: string; blur: number; offsetX: number; offsetY: number;
}) {
  const [on, setOn] = useState(enabled);
  const [shadowColor, setShadowColor] = useState(color);
  const [shadowBlur, setShadowBlur] = useState(blur);
  const [shadowX, setShadowX] = useState(offsetX);
  const [shadowY, setShadowY] = useState(offsetY);

  useEffect(() => {
    setOn(enabled);
    setShadowColor(color);
    setShadowBlur(blur);
    setShadowX(offsetX);
    setShadowY(offsetY);
  }, [enabled, color, blur, offsetX, offsetY]);

  const apply = useCallback((c: string, b: number, x: number, y: number) => {
    engine.updateSelectedObject({ shadow: { color: c, blur: b, offsetX: x, offsetY: y } });
  }, []);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-text-secondary">Shadow</label>
        <button type="button"
          onClick={() => {
            const next = !on;
            setOn(next);
            if (next) apply(shadowColor, shadowBlur, shadowX, shadowY);
            else engine.updateSelectedObject({ shadow: null });
          }}
          className={`h-4 w-7 rounded-full transition-colors ${on ? 'bg-accent' : 'bg-wash'}`}
          aria-label="Toggle shadow">
          <div className={`h-3 w-3 rounded-full bg-overlay shadow-sm transition-transform ${on ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {on && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="w-8 text-[10px] text-text-tertiary">Color</label>
            <ColorPicker value={shadowColor} onChange={(c) => { setShadowColor(c); apply(c, shadowBlur, shadowX, shadowY); }} />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-8 text-[10px] text-text-tertiary">Blur</label>
            <input type="range" min={0} max={50} value={shadowBlur}
              onChange={(e) => { const v = Number(e.target.value); setShadowBlur(v); apply(shadowColor, v, shadowX, shadowY); }}
              className="flex-1" aria-label="Shadow blur" />
            <span className="w-7 text-right text-[10px] text-text-tertiary">{shadowBlur}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="w-8 text-[10px] text-text-tertiary">X</label>
            <input type="range" min={-50} max={50} value={shadowX}
              onChange={(e) => { const v = Number(e.target.value); setShadowX(v); apply(shadowColor, shadowBlur, v, shadowY); }}
              className="flex-1" aria-label="Shadow offset X" />
            <span className="w-7 text-right text-[10px] text-text-tertiary">{shadowX}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="w-8 text-[10px] text-text-tertiary">Y</label>
            <input type="range" min={-50} max={50} value={shadowY}
              onChange={(e) => { const v = Number(e.target.value); setShadowY(v); apply(shadowColor, shadowBlur, shadowX, v); }}
              className="flex-1" aria-label="Shadow offset Y" />
            <span className="w-7 text-right text-[10px] text-text-tertiary">{shadowY}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Text decoration (linethrough, overline) ──────────────────────

function TextDecorationSection({ linethrough, overline }: {
  linethrough: boolean; overline: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">Decoration</label>
      <div className="flex gap-1">
        <StyleToggle label="Strikethrough" active={linethrough}
          onClick={() => engine.updateSelectedObject({ linethrough: !linethrough })}>
          <span className="text-sm line-through">S</span>
        </StyleToggle>
        <StyleToggle label="Overline" active={overline}
          onClick={() => engine.updateSelectedObject({ overline: !overline })}>
          <span className="text-sm overline">O</span>
        </StyleToggle>
      </div>
    </div>
  );
}

// ─── Text outline (stroke on text) ───────────────────────────────

function TextOutlineSection({ stroke, strokeWidth }: {
  stroke: string; strokeWidth: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">Text Outline</label>
      <div className="flex items-center gap-2">
        <ColorPicker value={stroke || '#2d2a26'} onChange={(c) => engine.updateSelectedObject({ textStroke: c, textStrokeWidth: strokeWidth > 0 ? strokeWidth : 1 })} />
        <input type="range" min={0} max={5} step={0.5} value={strokeWidth}
          onChange={(e) => engine.updateSelectedObject({ textStrokeWidth: Number(e.target.value) })}
          className="flex-1" aria-label="Text outline width" />
        <span className="w-7 text-right text-[10px] text-text-tertiary">{strokeWidth}px</span>
      </div>
    </div>
  );
}

function TextPathSection({ text, fontFamily, fontSize, fontWeight, fill }: {
  text: string; fontFamily: string; fontSize: number; fontWeight: 'normal' | 'bold'; fill: string;
}) {
  const [curved, setCurved] = useState(false);
  const [arc, setArc] = useState(180);
  const [radius, setRadius] = useState(200);
  const [loading, setLoading] = useState(false);

  // Check if the selected object is already curved text
  useEffect(() => {
    const meta = engine.getCurvedTextMeta();
    if (meta) {
      setCurved(true);
      setArc(meta.__ctArc);
      setRadius(meta.__ctRadius);
    } else {
      setCurved(false);
    }
  }, [text]);

  const applyCurve = useCallback(async (newArc?: number, newRadius?: number) => {
    setLoading(true);
    try {
      if (engine.isCurvedText()) {
        await engine.updateCurvedText({
          text,
          arc: newArc ?? arc,
          radius: newRadius ?? radius,
        });
      } else {
        await engine.createCurvedText({
          text,
          fontFamily,
          fontSize,
          fontWeight,
          arc: newArc ?? arc,
          radius: newRadius ?? radius,
          fill,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [text, fontFamily, fontSize, fontWeight, fill, arc, radius]);

  const handleToggle = useCallback(async () => {
    if (curved) {
      // Uncurving is not supported — user should undo or delete and re-add
      return;
    }
    setCurved(true);
    await applyCurve();
  }, [curved, applyCurve]);

  const handleArcChange = useCallback((val: number) => {
    setArc(val);
    applyCurve(val, undefined);
  }, [applyCurve]);

  const handleRadiusChange = useCallback((val: number) => {
    setRadius(val);
    applyCurve(undefined, val);
  }, [applyCurve]);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">Text Path</label>
      <div className="space-y-2">
        {/* Straight / Curved toggle */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => { if (curved) handleToggle(); }}
            disabled={curved}
            title={curved ? 'Use Ctrl+Z to undo curving' : ''}
            className={`flex-1 rounded-md px-2 py-1 text-[10px] font-medium ${
              !curved ? 'bg-accent-subtle text-accent' : 'bg-wash text-text-tertiary opacity-50'
            }`}
          >
            Straight
          </button>
          <button
            type="button"
            onClick={() => { if (!curved) handleToggle(); }}
            className={`flex-1 rounded-md px-2 py-1 text-[10px] font-medium ${
              curved ? 'bg-accent-subtle text-accent' : 'bg-wash text-text-secondary'
            }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Curved'}
          </button>
        </div>

        {curved && (
          <>
            {/* Arc slider */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-tertiary">Arc</span>
                <span className="text-[10px] text-text-tertiary">{arc}°</span>
              </div>
              <input
                type="range"
                min={-360}
                max={360}
                value={arc}
                onChange={(e) => handleArcChange(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            {/* Radius slider */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-tertiary">Radius</span>
                <span className="text-[10px] text-text-tertiary">{radius}px</span>
              </div>
              <input
                type="range"
                min={50}
                max={500}
                value={radius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            {/* Full circle preset */}
            <button
              type="button"
              onClick={() => {
                setArc(360);
                applyCurve(360, undefined);
              }}
              className="w-full rounded-md bg-wash py-1 text-[10px] font-medium text-text-secondary hover:bg-border"
            >
              Text on Circle (360°)
            </button>
          </>
        )}
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">Blend Mode</label>
      <select
        value={blendMode}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded border border-border px-2 py-1 text-xs"
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">Transform</label>
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
      <span className="w-5 text-right text-[10px] text-text-tertiary">{label}</span>
      <input
        type="number"
        data-transform-label={label}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
        min={min}
        step={label === 'Rotation' ? 1 : undefined}
        className="w-full rounded border border-border px-1.5 py-0.5 text-xs tabular-nums"
        aria-label={label}
      />
      {suffix && <span className="text-[10px] text-text-tertiary">{suffix}</span>}
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
      <label className="mb-1 block text-xs font-medium text-text-secondary">Clip Mask</label>

      {isMultiSelect && (
        <button
          type="button"
          onClick={handleClip}
          className="mb-1 w-full rounded bg-accent-subtle px-2 py-1 text-xs font-medium text-accent hover:bg-accent-subtle"
        >
          Clip to Shape
        </button>
      )}

      {hasClipPath && (
        <button
          type="button"
          onClick={handleUnclip}
          className="mb-1 w-full rounded bg-wash px-2 py-1 text-xs font-medium text-text-secondary hover:bg-wash"
        >
          Remove Clip Mask
        </button>
      )}

      {!isMultiSelect && !hasClipPath && (
        <p className="text-[10px] text-text-tertiary">
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
      <ColorPicker value={value} onChange={onChange} brandColors={brandColors} />
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
        active ? 'bg-accent-subtle text-accent' : 'text-text-secondary hover:bg-wash'
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

// ─── Flip & Rotate Quick Actions ─────────────────────────────────

function FlipRotateSection({ flipX, flipY, angle }: {
  flipX: boolean; flipY: boolean; angle: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">Flip & Rotate</label>
      <div className="flex gap-1">
        <StyleToggle label="Flip horizontal" active={flipX}
          onClick={() => engine.updateSelectedObject({ flipX: !flipX })}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M8 2v12" strokeDasharray="2 1" opacity="0.4"/>
            <path d="M5 4L2 8l3 4" /><path d="M11 4l3 4-3 4" />
          </svg>
        </StyleToggle>
        <StyleToggle label="Flip vertical" active={flipY}
          onClick={() => engine.updateSelectedObject({ flipY: !flipY })}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M2 8h12" strokeDasharray="2 1" opacity="0.4"/>
            <path d="M4 5L8 2l4 3" /><path d="M4 11l4 3 4-3" />
          </svg>
        </StyleToggle>
        <StyleToggle label="Rotate 90° clockwise" active={false}
          onClick={() => engine.updateSelectedObject({ angle: (angle + 90) % 360 })}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M12 6a5 5 0 10-1.5 4.5" /><path d="M10 3l2 3 3-2" />
          </svg>
        </StyleToggle>
        <StyleToggle label="Rotate 90° counter-clockwise" active={false}
          onClick={() => engine.updateSelectedObject({ angle: ((angle - 90) % 360 + 360) % 360 })}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M4 6a5 5 0 111.5 4.5" /><path d="M6 3L4 6 1 4" />
          </svg>
        </StyleToggle>
      </div>
    </div>
  );
}

// ─── Text Transform ──────────────────────────────────────────────

function TextTransformSection({ text }: { text: string }) {
  const toUpperCase = useCallback(() => {
    if (text) engine.updateSelectedTextProps({ text: text.toUpperCase() });
  }, [text]);
  const toLowerCase = useCallback(() => {
    if (text) engine.updateSelectedTextProps({ text: text.toLowerCase() });
  }, [text]);
  const toTitleCase = useCallback(() => {
    if (text) {
      const title = text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      engine.updateSelectedTextProps({ text: title });
    }
  }, [text]);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">Transform</label>
      <div className="flex gap-1">
        <button type="button" onClick={toUpperCase} title="UPPERCASE"
          className="flex-1 rounded border border-border px-1 py-1 text-[10px] font-medium text-text-secondary hover:bg-wash">
          AA
        </button>
        <button type="button" onClick={toLowerCase} title="lowercase"
          className="flex-1 rounded border border-border px-1 py-1 text-[10px] font-medium text-text-secondary hover:bg-wash">
          aa
        </button>
        <button type="button" onClick={toTitleCase} title="Title Case"
          className="flex-1 rounded border border-border px-1 py-1 text-[10px] font-medium text-text-secondary hover:bg-wash">
          Aa
        </button>
      </div>
    </div>
  );
}

// ─── Crop Tool ───────────────────────────────────────────────────

const CROP_RATIOS: { label: string; value: number | null }[] = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
  { label: '3:2', value: 3 / 2 },
];

function CropToolSection({ isCropping }: { isCropping: boolean }) {
  const [activeRatio, setActiveRatio] = useState<number | null>(null);

  const handleEnterCrop = useCallback(() => {
    engine.enterCropMode();
    setActiveRatio(null);
  }, []);

  const handleApply = useCallback(() => {
    engine.applyCrop();
    setActiveRatio(null);
  }, []);

  const handleCancel = useCallback(() => {
    engine.cancelCrop();
    setActiveRatio(null);
  }, []);

  const handleRatio = useCallback((ratio: number | null) => {
    setActiveRatio(ratio);
    engine.setCropAspectRatio(ratio);
  }, []);

  if (!isCropping) {
    return (
      <button type="button" onClick={handleEnterCrop}
        className="flex w-full items-center gap-2 rounded border border-border px-3 py-2 text-left text-xs font-medium text-text-secondary hover:bg-wash"
        title="Crop image">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M4 1v11h11" /><path d="M1 4h11v11" />
        </svg>
        Crop
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-accent bg-accent-subtle p-3">
      <p className="mb-2 text-xs font-medium text-accent">Crop Mode</p>
      {/* Aspect ratio pills */}
      <div className="mb-3 flex flex-wrap gap-1">
        {CROP_RATIOS.map((r) => (
          <button key={r.label} type="button" onClick={() => handleRatio(r.value)}
            className={`rounded border px-2 py-0.5 text-[10px] font-medium ${
              activeRatio === r.value
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border text-text-secondary hover:bg-wash'
            }`}>
            {r.label}
          </button>
        ))}
      </div>
      <p className="mb-3 text-[10px] text-text-tertiary">Drag corners to adjust. Double-click image to crop.</p>
      {/* Apply / Cancel */}
      <div className="flex gap-2">
        <button type="button" onClick={handleCancel}
          className="flex-1 rounded border border-border px-2 py-1.5 text-xs font-medium text-text-secondary hover:bg-wash">
          Cancel
        </button>
        <button type="button" onClick={handleApply}
          className="flex-1 rounded bg-accent px-2 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover">
          Apply
        </button>
      </div>
    </div>
  );
}

// ─── Image Replace ───────────────────────────────────────────────

function ImageReplaceButton() {
  const handleReplace = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        await engine.replaceSelectedImage(dataUrl);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, []);

  return (
    <button type="button" onClick={handleReplace}
      className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-left text-xs font-medium text-text-secondary hover:bg-wash">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="1" y="3" width="14" height="10" rx="1.5"/>
        <path d="M6 13V7l4 3-4 3z" fill="currentColor" stroke="none" opacity="0.4"/>
        <path d="M11 1v4M9 3h4" strokeLinecap="round"/>
      </svg>
      Replace Image
    </button>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────

function friendlyTypeName(type: string): string {
  const map: Record<string, string> = {
    rect: 'Rectangle',
    circle: 'Circle',
    triangle: 'Triangle',
    line: 'Line',
    group: 'Group',
    activeselection: 'Selection',
    polygon: 'Star',
    path: 'Path',
    textbox: 'Text',
    image: 'Image',
  };
  return map[type] || type;
}

// ─── Canvas Properties (shown when nothing is selected) ──────────

function CanvasPropertiesPanel({ brandColors }: { brandColors: string[] }) {
  const background = useCanvasStore((s) => s.background);
  const setBackground = useCanvasStore((s) => s.setBackground);
  const bgColor = background.type === 'solid' ? background.value : '#ffffff';

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="border-b border-border pb-3">
        <span className="text-sm font-medium text-text-primary">Canvas</span>
      </div>

      {/* Background color */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">Background Color</label>
        <ColorPicker
          value={bgColor}
          onChange={(color) => {
            setBackground({ type: 'solid', value: color });
            engine.setBackground({ type: 'solid', value: color });
          }}
          brandColors={brandColors}
        />
      </div>

      <p className="text-xs text-text-tertiary">
        Click any element on the canvas to edit its properties.
      </p>
    </div>
  );
}
