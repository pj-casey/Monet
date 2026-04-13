/**
 * DrawToolPopout — freehand drawing controls that appear below
 * the Draw button in the toolbar when the Draw tool is active.
 *
 * Contains: brush type selector, color picker, width slider, eraser toggle.
 * Stays open as long as Draw tool is active. Only closes when the user
 * switches to Select or Pen tool.
 */

import { useState, useEffect } from 'react';
import { engine } from './Canvas';

type BrushTypeOption = 'pen' | 'marker' | 'highlighter' | 'glow';

const BRUSH_TYPES: { type: BrushTypeOption; label: string; preview: string }[] = [
  { type: 'pen', label: 'Pen', preview: 'M2 14 Q6 6 10 8 Q14 10 18 4 Q22 1 26 6' },
  { type: 'marker', label: 'Marker', preview: 'M2 10 Q8 6 14 8 Q20 10 26 7' },
  { type: 'highlighter', label: 'Highlight', preview: 'M2 8 L26 8' },
  { type: 'glow', label: 'Glow', preview: 'M2 14 Q6 6 10 8 Q14 10 18 4 Q22 1 26 6' },
];

const BRUSH_COLORS = ['#2d2a26', '#C4704A', '#e53935', '#1e88e5', '#43a047', '#8e24aa', '#ff6d00', '#ffffff'];

export function DrawToolPopout() {
  const [brushType, setBrushType] = useState<BrushTypeOption>('pen');
  const [color, setColor] = useState('#2d2a26');
  const [width, setWidth] = useState(4);
  const [eraserWidth, setEraserWidthState] = useState(20);
  const [isEraser, setIsEraser] = useState(false);

  // Initialize drawing mode on mount
  useEffect(() => {
    engine.enableDrawing(color, width, brushType);
    return () => { engine.disableDrawing(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync freehand settings — only when NOT in eraser mode
  useEffect(() => { if (!isEraser) engine.setDrawingBrushType(brushType); }, [brushType, isEraser]);
  useEffect(() => { if (!isEraser) engine.setDrawingColor(color); }, [color, isEraser]);
  useEffect(() => { if (!isEraser) engine.setDrawingWidth(width); }, [width, isEraser]);
  useEffect(() => { if (isEraser) engine.setEraserWidth(eraserWidth); }, [eraserWidth, isEraser]);

  const handleBrushClick = (type: BrushTypeOption) => {
    setBrushType(type);
    if (isEraser) {
      setIsEraser(false);
      engine.disableEraser();
      engine.enableDrawing(color, width, type);
    }
  };

  const handleColorClick = (c: string) => {
    setColor(c);
    if (isEraser) {
      setIsEraser(false);
      engine.disableEraser();
      engine.enableDrawing(c, width, brushType);
    }
  };

  const handleEraserClick = () => {
    if (isEraser) {
      setIsEraser(false);
      engine.disableEraser();
      engine.enableDrawing(color, width, brushType);
    } else {
      setIsEraser(true);
      engine.enableEraser(eraserWidth);
    }
  };

  return (
    <div className="animate-scale-up absolute left-1/2 top-full z-40 mt-1.5 w-[300px] -translate-x-1/2 rounded-lg border border-border bg-elevated p-3 shadow-lg">

      {/* Brush type + Eraser row */}
      <div className="mb-3 flex gap-1">
        {BRUSH_TYPES.map((b) => (
          <button
            key={b.type}
            type="button"
            onClick={() => handleBrushClick(b.type)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[9px] font-medium ${
              !isEraser && brushType === b.type
                ? 'bg-accent-subtle text-accent'
                : 'text-text-secondary hover:bg-wash'
            }`}
            title={b.label}
          >
            <svg viewBox="0 0 28 16" className="h-3 w-7">
              <path
                d={b.preview}
                fill="none"
                stroke="currentColor"
                strokeWidth={b.type === 'marker' ? 4 : b.type === 'highlighter' ? 6 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={b.type === 'highlighter' ? 0.4 : 1}
              />
            </svg>
            {b.label}
          </button>
        ))}
        {/* Eraser button */}
        <button
          type="button"
          onClick={handleEraserClick}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[9px] font-medium ${
            isEraser
              ? 'bg-accent-subtle text-accent'
              : 'text-text-secondary hover:bg-wash'
          }`}
          title="Eraser"
          aria-pressed={isEraser}
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 2l3 3-7 7H4l-1-1 .5-.5L11 2z" />
          </svg>
          Eraser
        </button>
      </div>

      {/* Color picker — hidden when eraser active */}
      {!isEraser && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-text-tertiary">Color</span>
            <div className="flex gap-1">
              {BRUSH_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorClick(c)}
                  className={`h-5 w-5 rounded-full border ${
                    color === c ? 'border-accent ring-1 ring-accent' : 'border-border'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                  aria-label={`Brush color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Width slider */}
      <div className="flex items-center gap-2">
        <span className="w-16 text-[10px] text-text-tertiary">
          {isEraser ? 'Eraser' : 'Size'}: {isEraser ? eraserWidth : width}px
        </span>
        <input
          type="range"
          min={1}
          max={100}
          value={isEraser ? eraserWidth : width}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (isEraser) setEraserWidthState(v);
            else setWidth(v);
          }}
          className="flex-1 accent-accent"
          aria-label={isEraser ? 'Eraser width' : 'Brush width'}
        />
      </div>
    </div>
  );
}
