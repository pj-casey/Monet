/**
 * ColorPicker — custom color picker replacing native browser input.
 *
 * Features:
 * - Saturation/brightness area + hue slider (via react-colorful)
 * - Hex input with validation
 * - Eyedropper tool (sample color from canvas)
 * - "Used in design" section (document color palette)
 * - Recent colors row (last 8 used)
 * - Brand kit colors row (if available)
 *
 * Styled with DESIGN.md tokens. Opens as a popover anchored to trigger.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { engine } from './Canvas';

/** Maximum number of recent colors to store */
const MAX_RECENT = 8;
const STORAGE_KEY = 'monet-recent-colors';

function getRecentColors(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function addRecentColor(color: string): void {
  const recent = getRecentColors().filter((c) => c !== color);
  recent.unshift(color);
  if (recent.length > MAX_RECENT) recent.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
}

/** Extract all unique colors used by objects on the canvas */
function getDocumentColors(): string[] {
  const canvas = engine.getFabricCanvas();
  if (!canvas) return [];
  const colors = new Set<string>();
  for (const obj of canvas.getObjects()) {
    const tagged = obj as unknown as Record<string, unknown>;
    if (tagged.__isArtboard || tagged.__isGridLine || tagged.__isGuide || tagged.__isBgImage) continue;
    const fill = obj.fill;
    if (typeof fill === 'string' && fill && fill !== 'transparent') colors.add(fill.toLowerCase());
    const stroke = obj.stroke;
    if (typeof stroke === 'string' && stroke && stroke !== 'transparent') colors.add(stroke.toLowerCase());
  }
  // Remove duplicates that differ only in case, limit to 12
  return [...colors].slice(0, 12);
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  brandColors?: string[];
}

export function ColorPicker({ value, onChange, brandColors }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const [recentColors, setRecentColors] = useState<string[]>(getRecentColors);
  const [docColors, setDocColors] = useState<string[]>([]);
  const [eyedropperActive, setEyedropperActive] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Sync hex input when external value changes
  useEffect(() => {
    setHexInput(value);
  }, [value]);

  // Load document colors when popover opens
  useEffect(() => {
    if (open) setDocColors(getDocumentColors());
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEyedropperActive(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Eyedropper: click on canvas to sample a pixel color
  useEffect(() => {
    if (!eyedropperActive) return;
    const canvas = engine.getFabricCanvas();
    if (!canvas) return;

    const el = canvas.getElement();
    el.style.cursor = 'crosshair';

    const handleClick = (e: MouseEvent) => {
      // Read pixel from canvas element
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (el.width / rect.width);
      const y = (e.clientY - rect.top) * (el.height / rect.height);
      const ctx = el.getContext('2d');
      if (!ctx) return;
      const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      const hex = '#' + [pixel[0], pixel[1], pixel[2]].map((c) => c.toString(16).padStart(2, '0')).join('');
      onChange(hex);
      setHexInput(hex);
      addRecentColor(hex);
      setRecentColors(getRecentColors());
      setEyedropperActive(false);
      el.style.cursor = '';
    };

    // Use capture so it fires before Fabric.js selection
    el.addEventListener('click', handleClick, { capture: true, once: true });

    return () => {
      el.removeEventListener('click', handleClick, { capture: true } as EventListenerOptions);
      el.style.cursor = '';
    };
  }, [eyedropperActive, onChange]);

  const handleChange = useCallback((color: string) => {
    onChange(color);
    setHexInput(color);
  }, [onChange]);

  const handleHexCommit = useCallback(() => {
    const hex = hexInput.trim();
    if (/^#[0-9a-f]{3,8}$/i.test(hex)) {
      onChange(hex);
      addRecentColor(hex);
      setRecentColors(getRecentColors());
    } else {
      setHexInput(value);
    }
  }, [hexInput, value, onChange]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEyedropperActive(false);
    if (value) {
      addRecentColor(value);
      setRecentColors(getRecentColors());
    }
  }, [value]);

  return (
    <div className="relative">
      {/* Swatch trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border border-border"
        style={{ backgroundColor: value || '#2d2a26' }}
        aria-label="Open color picker"
      />

      {/* Popover */}
      {open && (
        <div
          ref={popoverRef}
          className="animate-scale-up absolute left-0 top-full z-50 mt-2 w-[220px] rounded-md border border-border bg-overlay p-3 shadow-lg"
        >
          {/* react-colorful picker */}
          <div className="mb-3 [&_.react-colorful]:!w-full [&_.react-colorful]:!h-[150px] [&_.react-colorful__saturation]:!rounded-sm [&_.react-colorful__hue]:!rounded-full [&_.react-colorful__hue]:!h-[10px] [&_.react-colorful__hue]:!mt-2 [&_.react-colorful__pointer]:!w-[14px] [&_.react-colorful__pointer]:!h-[14px]">
            <HexColorPicker color={value} onChange={handleChange} />
          </div>

          {/* Hex input + eyedropper */}
          <div className="mb-3 flex items-center gap-2">
            <label className="text-[10px] text-text-tertiary">Hex</label>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={handleHexCommit}
              onKeyDown={(e) => { if (e.key === 'Enter') handleHexCommit(); }}
              className="flex-1 rounded-sm border border-border bg-canvas px-2 py-1 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
              aria-label="Hex color value"
            />
            <button
              type="button"
              onClick={() => setEyedropperActive(!eyedropperActive)}
              className={`flex h-6 w-6 items-center justify-center rounded-sm border ${
                eyedropperActive ? 'border-accent bg-accent-subtle text-accent' : 'border-border text-text-tertiary hover:bg-wash'
              }`}
              title="Eyedropper — click canvas to sample color"
              aria-label="Eyedropper tool"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M13.5 2.5a2 2 0 00-2.8 0L9 4.2 7.5 2.7l-1 1L8 5.2l-5.5 5.5a1 1 0 000 1.4l1.4 1.4a1 1 0 001.4 0L10.8 8l1.5 1.5 1-1L11.8 7l1.7-1.7a2 2 0 000-2.8z" />
              </svg>
            </button>
          </div>

          {eyedropperActive && (
            <p className="mb-2 text-center text-[9px] text-accent">Click anywhere on the canvas to pick a color</p>
          )}

          {/* Document colors */}
          {docColors.length > 0 && (
            <div className="mb-2">
              <p className="mb-1 text-[9px] font-medium text-text-tertiary">Used in design</p>
              <div className="flex flex-wrap gap-1">
                {docColors.map((dc, i) => (
                  <button key={i} type="button" onClick={() => handleChange(dc)} title={dc}
                    className="h-5 w-5 rounded-sm border border-border"
                    style={{ backgroundColor: dc }} aria-label={`Document color ${dc}`} />
                ))}
              </div>
            </div>
          )}

          {/* Brand colors */}
          {brandColors && brandColors.length > 0 && (
            <div className="mb-2">
              <p className="mb-1 text-[9px] font-medium text-text-tertiary">Brand</p>
              <div className="flex flex-wrap gap-1">
                {brandColors.map((bc, i) => (
                  <button key={i} type="button" onClick={() => handleChange(bc)} title={bc}
                    className="h-5 w-5 rounded-sm border border-border"
                    style={{ backgroundColor: bc }} aria-label={`Brand color ${bc}`} />
                ))}
              </div>
            </div>
          )}

          {/* Recent colors */}
          {recentColors.length > 0 && (
            <div>
              <p className="mb-1 text-[9px] font-medium text-text-tertiary">Recent</p>
              <div className="flex flex-wrap gap-1">
                {recentColors.map((rc, i) => (
                  <button key={i} type="button" onClick={() => handleChange(rc)} title={rc}
                    className="h-5 w-5 rounded-sm border border-border"
                    style={{ backgroundColor: rc }} aria-label={`Recent color ${rc}`} />
                ))}
              </div>
            </div>
          )}

          {/* Done button */}
          <button type="button" onClick={handleClose}
            className="mt-3 w-full rounded-sm bg-accent py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover">
            Done
          </button>
        </div>
      )}
    </div>
  );
}
