/**
 * LeftSidebar — the tool panel on the left side of the editor.
 *
 * Contains two parts:
 * 1. A narrow strip of tool icons (select, shape, text, etc.)
 * 2. When a tool with options is selected (like shapes), an expanded panel
 *    opens beside it showing the available options.
 *
 * Clicking a shape in the expanded panel adds it to the canvas center.
 */

import { useState, useEffect } from 'react';
import { useEditorStore } from '../stores/editor-store';
import type { EditorTool } from '../stores/editor-store';
import type { ShapeType } from '@monet/shared';
import { engine } from './Canvas';
import { AssetsPanel } from './AssetsPanel';
import { BrandKitPanel } from './BrandKitPanel';
import { PluginsPanel } from './PluginsPanel';
import { AIAssistantPanel } from './AIAssistantPanel';

export function LeftSidebar() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  return (
    <div className="flex h-full">
      {/* Narrow tool icon strip */}
      <div className="flex w-14 flex-col items-center gap-1 border-r border-gray-200 bg-white py-2 dark:border-gray-700 dark:bg-gray-900">
        <ToolIcon
          tool="select"
          label="Select (V)"
          active={activeTool === 'select'}
          onClick={() => setActiveTool('select')}
        >
          <SelectIcon />
        </ToolIcon>

        <ToolIcon
          tool="shape"
          label="Shapes"
          active={activeTool === 'shape'}
          onClick={() => setActiveTool(activeTool === 'shape' ? 'select' : 'shape')}
        >
          <ShapesToolIcon />
        </ToolIcon>

        <ToolIcon
          tool="text"
          label="Text (T)"
          active={activeTool === 'text'}
          onClick={() => setActiveTool(activeTool === 'text' ? 'select' : 'text')}
        >
          <TextIcon />
        </ToolIcon>

        <ToolIcon
          tool="image"
          label="Image"
          active={activeTool === 'image'}
          onClick={() => setActiveTool(activeTool === 'image' ? 'select' : 'image')}
        >
          <ImageIcon />
        </ToolIcon>

        <ToolIcon
          tool="draw"
          label="Draw (D)"
          active={activeTool === 'draw'}
          onClick={() => setActiveTool(activeTool === 'draw' ? 'select' : 'draw')}
        >
          <DrawIcon />
        </ToolIcon>

        <ToolIcon
          tool="pen"
          label="Pen Tool (P)"
          active={activeTool === 'pen'}
          onClick={() => setActiveTool(activeTool === 'pen' ? 'select' : 'pen')}
        >
          <PenToolIcon />
        </ToolIcon>

        <div className="my-1 h-px w-8 bg-gray-200 dark:bg-gray-700" />

        <ToolIcon
          tool="assets"
          label="Assets"
          active={activeTool === 'assets'}
          onClick={() => setActiveTool(activeTool === 'assets' ? 'select' : 'assets')}
        >
          <AssetsIcon />
        </ToolIcon>

        <ToolIcon
          tool="brand"
          label="Brand Kit"
          active={activeTool === 'brand'}
          onClick={() => setActiveTool(activeTool === 'brand' ? 'select' : 'brand')}
        >
          <BrandIcon />
        </ToolIcon>

        <ToolIcon
          tool="plugins"
          label="Plugins"
          active={activeTool === 'plugins'}
          onClick={() => setActiveTool(activeTool === 'plugins' ? 'select' : 'plugins')}
        >
          <PluginsIcon />
        </ToolIcon>

        <ToolIcon
          tool="ai"
          label="AI Assistant"
          active={activeTool === 'ai'}
          onClick={() => setActiveTool(activeTool === 'ai' ? 'select' : 'ai')}
        >
          <AIIcon />
        </ToolIcon>
      </div>

      {/* Expanded panel — shows when a tool with options is active */}
      {activeTool === 'shape' && <ShapePanel />}
      {activeTool === 'text' && <TextPanel />}
      {activeTool === 'image' && <ImagePanel />}
      {activeTool === 'draw' && <DrawingPanel />}
      {activeTool === 'pen' && <PenPanel />}
      {activeTool === 'assets' && <AssetsPanel />}
      {activeTool === 'brand' && <BrandKitPanel />}
      {activeTool === 'plugins' && <PluginsPanel />}
      {activeTool === 'ai' && <AIAssistantPanel />}
    </div>
  );
}

// ─── Shape Picker Panel ────────────────────────────────────────────

/**
 * ShapePanel — the expanded panel showing available shapes.
 * Clicking a shape adds it to the center of the artboard.
 */
function ShapePanel() {
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  const addShape = (type: ShapeType) => {
    engine.addShape({ type });
    // Switch back to select tool so the user can immediately move/resize
    setActiveTool('select');
  };

  return (
    <div className="w-48 border-r border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Shapes
      </h3>
      <div className="grid grid-cols-3 gap-2">
        <ShapeButton label="Rectangle" onClick={() => addShape('rectangle')}>
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <rect x="4" y="8" width="32" height="24" rx="2" fill="#4A90D9" />
          </svg>
        </ShapeButton>

        <ShapeButton label="Circle" onClick={() => addShape('circle')}>
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <circle cx="20" cy="20" r="15" fill="#4A90D9" />
          </svg>
        </ShapeButton>

        <ShapeButton label="Triangle" onClick={() => addShape('triangle')}>
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <polygon points="20,5 36,35 4,35" fill="#4A90D9" />
          </svg>
        </ShapeButton>

        <ShapeButton label="Line" onClick={() => addShape('line')}>
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <line x1="4" y1="36" x2="36" y2="4" stroke="#333" strokeWidth="2.5" />
          </svg>
        </ShapeButton>

        <ShapeButton label="Arrow" onClick={() => addShape('arrow')}>
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <line x1="4" y1="20" x2="30" y2="20" stroke="#333" strokeWidth="2.5" />
            <polygon points="28,14 36,20 28,26" fill="#333" />
          </svg>
        </ShapeButton>

        <ShapeButton label="Star" onClick={() => addShape('star')}>
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <polygon
              points="20,3 24.5,15 37,15 27,23 30.5,35 20,28 9.5,35 13,23 3,15 15.5,15"
              fill="#4A90D9"
            />
          </svg>
        </ShapeButton>
      </div>
    </div>
  );
}

// ─── Drawing Panel ─────────────────────────────────────────────────

/**
 * DrawingPanel — freehand pen and eraser controls.
 *
 * When the draw tool is active, the canvas enters drawing mode.
 * The user can pick pen or eraser, choose a color, and set the brush width.
 * Each finished stroke becomes a Path object (movable, deletable, undoable).
 */
function DrawingPanel() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#333333');
  const [width, setWidth] = useState(4);

  // Enable/disable drawing mode when this panel mounts/unmounts or mode changes
  useEffect(() => {
    if (activeTool !== 'draw') {
      engine.disableDrawing();
      return;
    }
    if (mode === 'pen') {
      engine.enableDrawing(color, width);
    } else {
      engine.enableEraser(width);
    }
    return () => {
      engine.disableDrawing();
    };
  }, [activeTool, mode, color, width]);

  return (
    <div className="w-48 border-r border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Draw
      </h3>

      {/* Pen / Eraser toggle */}
      <div className="mb-3 flex gap-1">
        <button
          type="button"
          aria-pressed={mode === 'pen'}
          onClick={() => setMode('pen')}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
            mode === 'pen'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Pen
        </button>
        <button
          type="button"
          aria-pressed={mode === 'eraser'}
          onClick={() => setMode('eraser')}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
            mode === 'eraser'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Eraser
        </button>
      </div>

      {/* Color picker (only for pen mode) */}
      {mode === 'pen' && (
        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-gray-500">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border border-gray-200 p-0.5"
              aria-label="Pen color"
            />
            <span className="text-xs text-gray-400">{color}</span>
          </div>
        </div>
      )}

      {/* Width slider */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          {mode === 'pen' ? 'Pen' : 'Eraser'} Width — {width}px
        </label>
        <input
          type="range"
          min={1}
          max={mode === 'pen' ? 50 : 100}
          step={1}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-full"
          aria-label="Brush width"
        />
      </div>

      <p className="mt-3 text-[10px] leading-tight text-gray-400">
        Click and drag on the canvas to draw. Each stroke becomes a movable object.
      </p>
    </div>
  );
}

// ─── Pen Tool Panel ───────────────────────────────────────────────

/**
 * PenPanel — the expanded panel for the pen (vector path) tool.
 *
 * When active, the user can click on the canvas to place anchor points.
 * Click + drag creates bezier curves. Double-click or click the start
 * point to close the path. Also provides an "Edit Points" button for
 * reshaping existing paths.
 */
function PenPanel() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const [isEditing, setIsEditing] = useState(false);

  // Enable/disable pen tool when this panel mounts/unmounts
  useEffect(() => {
    if (activeTool !== 'pen') {
      engine.disablePenTool();
      if (engine.isEditPointsActive()) {
        engine.exitEditPoints();
        setIsEditing(false);
      }
      return;
    }
    engine.enablePenTool();
    return () => {
      engine.disablePenTool();
    };
  }, [activeTool]);

  const handleEditPoints = () => {
    if (isEditing) {
      engine.exitEditPoints();
      setIsEditing(false);
    } else {
      engine.disablePenTool();
      engine.enterEditPoints();
      setIsEditing(true);
    }
  };

  const handleDoneEditing = () => {
    engine.exitEditPoints();
    setIsEditing(false);
    engine.enablePenTool();
  };

  return (
    <div className="w-48 border-r border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Pen Tool
      </h3>

      {!isEditing ? (
        <>
          <p className="mb-3 text-[10px] leading-tight text-gray-400">
            <strong className="text-gray-500">Click</strong> to place anchor points.{' '}
            <strong className="text-gray-500">Click + drag</strong> for bezier curves.{' '}
            <strong className="text-gray-500">Double-click</strong> or click the{' '}
            <span className="font-semibold text-green-600">green dot</span> to close the shape.
          </p>

          <div className="mb-3 rounded bg-gray-50 p-2 dark:bg-gray-800">
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              <span className="font-medium">Enter</span> — finish open path
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              <span className="font-medium">Escape</span> — cancel path
            </p>
          </div>

          <div className="border-t border-gray-100 pt-2 dark:border-gray-700">
            <button
              type="button"
              onClick={handleEditPoints}
              className="w-full rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Edit Points
            </button>
            <p className="mt-1 text-[10px] text-gray-400">
              Select a path first, then click to edit its anchor points.
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="mb-3 text-[10px] leading-tight text-gray-400">
            Drag the anchor points to reshape the path.
          </p>
          <button
            type="button"
            onClick={handleDoneEditing}
            className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            Done Editing
          </button>
        </>
      )}
    </div>
  );
}

// ─── Image Panel ───────────────────────────────────────────────────

/**
 * ImagePanel — the expanded panel for uploading images.
 *
 * Provides a file picker button and a drag-and-drop area.
 * Accepted formats: PNG, JPG, SVG, WebP, GIF.
 */
function ImagePanel() {
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        await engine.addImageFromFile(file);
      }
    }
    setActiveTool('select');
  };

  return (
    <div className="w-48 border-r border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Image
      </h3>

      {/* File picker button */}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-4 text-sm text-gray-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600">
        <UploadIcon />
        Upload Image
        <input
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          aria-label="Upload image file"
        />
      </label>

      <p className="mt-3 text-[10px] leading-tight text-gray-400">
        Or drag and drop an image directly onto the canvas.
      </p>
      <p className="mt-2 text-[10px] text-gray-400">
        PNG, JPG, SVG, WebP, GIF
      </p>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 10V2M8 2L5 5M8 2l3 3" />
      <path d="M2 10v3a1 1 0 001 1h10a1 1 0 001-1v-3" />
    </svg>
  );
}

// ─── Text Panel ────────────────────────────────────────────────────

/**
 * TextPanel — the expanded panel showing text presets.
 *
 * Provides quick-add buttons for common text styles (heading, subheading, body).
 * Also shows a hint that you can double-click the canvas to add text.
 */
function TextPanel() {
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  const addText = (preset: 'heading' | 'subheading' | 'body') => {
    const presets = {
      heading: { text: 'Heading', fontSize: 64, fontWeight: 'bold' as const },
      subheading: { text: 'Subheading', fontSize: 36, fontWeight: 'bold' as const },
      body: { text: 'Body text. Double-click to edit.', fontSize: 18, fontWeight: 'normal' as const },
    };
    engine.addText(presets[preset]);
    setActiveTool('select');
  };

  return (
    <div className="w-48 border-r border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Text
      </h3>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => addText('heading')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-left hover:bg-gray-50"
          aria-label="Add heading text"
        >
          <span className="text-lg font-bold text-gray-800">Heading</span>
        </button>

        <button
          type="button"
          onClick={() => addText('subheading')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-left hover:bg-gray-50"
          aria-label="Add subheading text"
        >
          <span className="text-sm font-bold text-gray-700">Subheading</span>
        </button>

        <button
          type="button"
          onClick={() => addText('body')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-left hover:bg-gray-50"
          aria-label="Add body text"
        >
          <span className="text-xs text-gray-600">Body text</span>
        </button>
      </div>
      <p className="mt-3 text-[10px] leading-tight text-gray-400">
        Or double-click the canvas to add text at any position.
      </p>
    </div>
  );
}

// ─── Button components ─────────────────────────────────────────────

interface ToolIconProps {
  tool: EditorTool;
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolIcon({ label, active, onClick, children }: ToolIconProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
        active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </button>
  );
}

interface ShapeButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ShapeButton({ label, onClick, children }: ShapeButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Add ${label}`}
      title={label}
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {children}
      <span className="text-[10px] text-gray-500">{label}</span>
    </button>
  );
}

// ─── SVG icons ─────────────────────────────────────────────────────

function SelectIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 2l5 14 2-5.5L15.5 8.5z" />
    </svg>
  );
}

function ShapesToolIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="7" height="7" rx="1" />
      <circle cx="13" cy="13" r="3.5" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h10M9 4v11" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="14" height="12" rx="1" />
      <circle cx="6.5" cy="7.5" r="1.5" fill="currentColor" />
      <path d="M2 13l4-4 3 3 2-2 5 5H3z" />
    </svg>
  );
}

function DrawIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 15l3-1L14.5 5.5a1.4 1.4 0 00-2-2L4 12z" />
      <path d="M11.5 4.5l2 2" />
    </svg>
  );
}

function PenToolIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 15 Q5 10 9 9 Q13 8 15 3" />
      <circle cx="3" cy="15" r="1.5" fill="currentColor" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <circle cx="15" cy="3" r="1.5" fill="currentColor" />
    </svg>
  );
}

function BrandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="6" r="4" />
      <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 2l1.5 4.5L15 8l-4.5 1.5L9 14l-1.5-4.5L3 8l4.5-1.5z" />
      <path d="M14 2l.5 1.5L16 4l-1.5.5L14 6l-.5-1.5L12 4l1.5-.5z" opacity="0.5" />
    </svg>
  );
}

function PluginsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="10" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="10" width="5" height="5" rx="1" />
      <circle cx="12.5" cy="12.5" r="2.5" />
    </svg>
  );
}

function AssetsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="10" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="10" width="6" height="6" rx="1" />
      <circle cx="13" cy="13" r="3" />
    </svg>
  );
}
