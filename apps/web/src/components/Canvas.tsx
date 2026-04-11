/**
 * Canvas component — the main canvas area of the editor.
 *
 * This component:
 * 1. Creates a full-size <canvas> that fills its container
 * 2. Initializes the CanvasEngine with the artboard dimensions
 * 3. Handles window resizing (keeps the canvas the right size)
 * 4. Connects canvas events to Zustand stores (so the UI stays in sync)
 *
 * The gray background you see is the "pasteboard" (CSS). The white
 * rectangle is the "artboard" (a Fabric.js object managed by the engine).
 */

import { useEffect, useRef, useCallback } from 'react';
import { CanvasEngine } from '@monet/canvas-engine';
import type { SelectedObjectProps, LayerInfo } from '@monet/shared';
import { useEditorStore } from '../stores/editor-store';
import { useHistoryStore } from '../stores/history-store';
import { useCanvasStore } from '../stores/canvas-store';
import { Rulers } from './Rulers';

/**
 * The canvas engine instance — created once and reused.
 * Lives outside the component so it persists across re-renders.
 */
const engine = new CanvasEngine();

/**
 * Export the engine so other components (like Toolbar) can call methods on it.
 * This is a simple approach — in a larger app you might use React Context instead.
 */
export { engine };

/**
 * Selection state — shared so other components (like PropertiesPanel)
 * can read what's currently selected on the canvas.
 */
let selectionListener: ((props: SelectedObjectProps | null) => void) | null = null;

/** Register a listener for selection changes. Returns an unsubscribe function. */
export function onSelectionChange(fn: (props: SelectedObjectProps | null) => void): () => void {
  selectionListener = fn;
  return () => { selectionListener = null; };
}

/**
 * Layer list state — shared so the LayerPanel can display the current layers.
 */
let layersListener: ((layers: LayerInfo[]) => void) | null = null;

/** Register a listener for layer list changes. Returns an unsubscribe function. */
export function onLayersChange(fn: (layers: LayerInfo[]) => void): () => void {
  layersListener = fn;
  return () => { layersListener = null; };
}

export function Canvas() {
  /** Reference to the HTML <canvas> element */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Reference to the container div (to measure its size) */
  const containerRef = useRef<HTMLDivElement>(null);

  /** Read artboard dimensions from the editor store */
  const artboardWidth = useEditorStore((s) => s.artboardWidth);
  const artboardHeight = useEditorStore((s) => s.artboardHeight);
  const setZoom = useEditorStore((s) => s.setZoom);

  /** Read background from canvas store */
  const background = useCanvasStore((s) => s.background);

  /** History store updaters */
  const setCanUndo = useHistoryStore((s) => s.setCanUndo);
  const setCanRedo = useHistoryStore((s) => s.setCanRedo);

  /** Grid/guide state from editor store */
  const gridVisible = useEditorStore((s) => s.gridVisible);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const gridSize = useEditorStore((s) => s.gridSize);
  const showGuides = useEditorStore((s) => s.showGuides);

  /**
   * Initialize the canvas engine when the component first appears.
   * Also set up a ResizeObserver to resize the canvas when the window changes.
   */
  useEffect(() => {
    const el = canvasRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const rect = container.getBoundingClientRect();

    engine.init(el, rect.width, rect.height, {
      width: artboardWidth,
      height: artboardHeight,
      background,
      onZoomChange: (zoom) => setZoom(zoom),
      onHistoryChange: (canUndo, canRedo) => {
        setCanUndo(canUndo);
        setCanRedo(canRedo);
      },
      onSelectionChange: (props) => {
        selectionListener?.(props);
      },
      getActiveTool: () => useEditorStore.getState().activeTool,
      onLayersChange: (newLayers) => {
        layersListener?.(newLayers);
      },
      onPagesChange: (pages, currentIndex) => {
        useEditorStore.getState().setPagesState(pages, currentIndex);
      },
    });

    // ResizeObserver watches the container and resizes the canvas when it changes.
    // After resizing the canvas element, re-center the artboard so it stays visible.
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        engine.resize(width, height);
        engine.fitToScreen();
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      engine.dispose();
    };
    // Only run on mount/unmount — artboard size changes are handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** When grid visibility or size changes, update the engine */
  useEffect(() => {
    if (!engine.isInitialized()) return;
    engine.setGridVisible(gridVisible, gridSize);
  }, [gridVisible, gridSize]);

  /** When snap-to-grid changes, update the engine */
  useEffect(() => {
    if (!engine.isInitialized()) return;
    engine.setSnapToGrid(snapToGrid);
  }, [snapToGrid]);

  /** When smart guides setting changes, update the engine */
  useEffect(() => {
    if (!engine.isInitialized()) return;
    engine.setGuidesEnabled(showGuides);
  }, [showGuides]);

  /** When aspect ratio lock changes, update the engine */
  const lockAspectRatio = useEditorStore((s) => s.lockAspectRatio);
  useEffect(() => {
    if (!engine.isInitialized()) return;
    engine.setLockAspectRatio(lockAspectRatio);
  }, [lockAspectRatio]);

  /** When artboard dimensions change, update the engine */
  useEffect(() => {
    if (!engine.isInitialized()) return;
    engine.setArtboardDimensions(artboardWidth, artboardHeight);
  }, [artboardWidth, artboardHeight]);

  /** When background changes, update the engine */
  useEffect(() => {
    if (!engine.isInitialized()) return;
    engine.setBackground(background);
  }, [background]);

  /**
   * Handle keyboard shortcuts for the canvas.
   *
   * Shortcuts:
   * - Ctrl+Z / Cmd+Z = Undo
   * - Ctrl+Y / Ctrl+Shift+Z = Redo
   * - Delete / Backspace = Delete selected (not while editing text)
   * - Ctrl+C = Copy
   * - Ctrl+V = Paste
   * - Ctrl+D = Duplicate
   * - Ctrl+G = Group selected objects
   * - Ctrl+Shift+G = Ungroup
   * - Arrow keys = Nudge 1px (Shift+Arrow = 10px)
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!engine.isInitialized()) return;

    // Check if user is typing inside a text object — most shortcuts should be skipped
    const fabricCanvas = engine.getFabricCanvas();
    const activeObj = fabricCanvas?.getActiveObject();
    const isEditing = activeObj && 'isEditing' in activeObj && activeObj.isEditing;

    const mod = e.ctrlKey || e.metaKey;

    // ─── Shortcuts that work even while editing text ───
    // Ctrl+Z = Undo
    if (mod && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      engine.undo();
      return;
    }
    // Ctrl+Y or Ctrl+Shift+Z = Redo
    if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      engine.redo();
      return;
    }

    // ─── Shortcuts that should NOT fire while editing text ───
    if (isEditing) return;

    // Delete / Backspace = Delete selected
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      engine.deleteSelectedObjects();
      return;
    }
    // Ctrl+C = Copy
    if (mod && e.key === 'c') {
      e.preventDefault();
      engine.copySelected();
      return;
    }
    // Ctrl+V = Paste
    if (mod && e.key === 'v') {
      e.preventDefault();
      engine.pasteClipboard();
      return;
    }
    // Ctrl+D = Duplicate
    if (mod && e.key === 'd') {
      e.preventDefault();
      engine.duplicateSelected();
      return;
    }
    // Ctrl+G = Group
    if (mod && e.key === 'g' && !e.shiftKey) {
      e.preventDefault();
      engine.groupSelected();
      return;
    }
    // Ctrl+Shift+G = Ungroup
    if (mod && e.key === 'g' && e.shiftKey) {
      e.preventDefault();
      engine.ungroupSelected();
      return;
    }
    // Ctrl+A = Select all
    if (mod && e.key === 'a') {
      e.preventDefault();
      engine.selectAllObjects();
      return;
    }
    // Ctrl+X = Cut
    if (mod && e.key === 'x') {
      e.preventDefault();
      engine.copySelected();
      engine.deleteSelectedObjects();
      return;
    }
    // Alt+Shift+C = Copy style
    if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      const style = engine.getSelectedStyle();
      if (style) {
        useEditorStore.getState().setCopiedStyle(style as import('../stores/editor-store').CopiedStyle);
      }
      return;
    }
    // Alt+Shift+V = Paste style
    if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      const style = useEditorStore.getState().copiedStyle;
      if (style) {
        engine.applyStyleToSelected(style as unknown as Record<string, unknown>);
      }
      return;
    }
    // Tool shortcuts (bare keys, no modifiers)
    if (!mod && !e.altKey) {
      const toolMap: Record<string, string> = { v: 'select', t: 'text', d: 'draw', p: 'pen' };
      const tool = toolMap[e.key.toLowerCase()];
      if (tool) {
        e.preventDefault();
        useEditorStore.getState().setActiveTool(tool as import('../stores/editor-store').EditorTool);
        return;
      }
    }
    // Escape = Deselect all
    if (e.key === 'Escape') {
      e.preventDefault();
      fabricCanvas?.discardActiveObject();
      fabricCanvas?.requestRenderAll();
      return;
    }
    // PageDown / Ctrl+] = Next page
    if (e.key === 'PageDown' || (mod && e.key === ']')) {
      e.preventDefault();
      const { currentPageIndex, pageCount } = useEditorStore.getState();
      if (currentPageIndex < pageCount - 1) engine.switchToPage(currentPageIndex + 1);
      return;
    }
    // PageUp / Ctrl+[ = Previous page
    if (e.key === 'PageUp' || (mod && e.key === '[')) {
      e.preventDefault();
      const { currentPageIndex } = useEditorStore.getState();
      if (currentPageIndex > 0) engine.switchToPage(currentPageIndex - 1);
      return;
    }

    // Arrow keys = Nudge (1px, or 10px with Shift)
    const nudgeAmount = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowLeft') { e.preventDefault(); engine.nudgeSelected(-nudgeAmount, 0); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); engine.nudgeSelected(nudgeAmount, 0); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); engine.nudgeSelected(0, -nudgeAmount); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); engine.nudgeSelected(0, nudgeAmount); return; }
  }, []);

  /**
   * Handle files dropped onto the canvas (drag-and-drop from desktop).
   * Only image files are accepted; they're added at the drop position.
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (!files.length) return;

    // Get drop position relative to the canvas container
    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : 0;
    const y = rect ? e.clientY - rect.top : 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        engine.addImageAtPosition(file, x, y);
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden bg-wash"
      onKeyDown={handleKeyDown}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      tabIndex={0}
      role="application"
      aria-label="Design canvas"
    >
      <canvas ref={canvasRef} />
      <RulersOverlay />
    </div>
  );
}

/** Conditionally renders rulers based on editor store toggle */
function RulersOverlay() {
  const rulersVisible = useEditorStore((s) => s.rulersVisible);
  if (!rulersVisible) return null;
  return <Rulers />;
}
