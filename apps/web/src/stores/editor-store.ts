/**
 * Editor Store — controls the overall editor UI state.
 *
 * This store tracks things like which tool is currently selected,
 * the zoom level, grid settings, and artboard dimensions.
 * Any React component can read from or update this store.
 *
 * Think of this as the "control panel" for the editor — it doesn't
 * hold the design data (that's in canvas-store), it holds the
 * editor's settings and mode.
 */

import { create } from 'zustand';

/** The tools a user can pick from the toolbar */
export type EditorTool = 'select' | 'text' | 'shape' | 'image' | 'draw' | 'pen' | 'pan' | 'assets' | 'brand' | 'plugins' | 'ai';

interface EditorState {
  /** Which tool is currently active (e.g., "select" for the pointer tool) */
  activeTool: EditorTool;
  /** Current zoom level (1 = 100%, 0.5 = 50%, 2 = 200%) */
  zoom: number;
  /** Whether grid snapping is enabled */
  snapToGrid: boolean;
  /** Whether the grid is visible */
  gridVisible: boolean;
  /** Grid spacing in pixels (e.g., 20 means a grid line every 20px) */
  gridSize: number;
  /** Whether to show alignment guides when dragging objects */
  showGuides: boolean;
  /** Current artboard dimensions */
  artboardWidth: number;
  artboardHeight: number;
  /** Whether rulers are visible along canvas edges */
  rulersVisible: boolean;
  /** Whether aspect ratio is locked during resize */
  lockAspectRatio: boolean;

  /** Switch to a different tool */
  setActiveTool: (tool: EditorTool) => void;
  /** Set the zoom level (called by canvas engine when zoom changes) */
  setZoom: (zoom: number) => void;
  /** Toggle grid snapping on/off */
  toggleSnapToGrid: () => void;
  /** Toggle grid visibility */
  toggleGridVisible: () => void;
  /** Set grid spacing */
  setGridSize: (size: number) => void;
  /** Toggle alignment guides on/off */
  toggleShowGuides: () => void;
  /** Set artboard dimensions (when user picks a preset or enters custom) */
  setArtboardDimensions: (width: number, height: number) => void;
  /** Toggle rulers visibility */
  toggleRulers: () => void;
  /** Toggle aspect ratio lock */
  toggleLockAspectRatio: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTool: 'select',
  zoom: 1,
  snapToGrid: false,
  gridVisible: false,
  gridSize: 20,
  showGuides: true,
  artboardWidth: 1080,
  artboardHeight: 1080,
  rulersVisible: false,
  lockAspectRatio: false,

  setActiveTool: (tool) => set({ activeTool: tool }),
  setZoom: (zoom) => set({ zoom }),
  toggleSnapToGrid: () =>
    set((state) => ({ snapToGrid: !state.snapToGrid })),
  toggleGridVisible: () =>
    set((state) => ({ gridVisible: !state.gridVisible })),
  setGridSize: (size) => set({ gridSize: size }),
  toggleShowGuides: () =>
    set((state) => ({ showGuides: !state.showGuides })),
  setArtboardDimensions: (width, height) =>
    set({ artboardWidth: width, artboardHeight: height }),
  toggleRulers: () =>
    set((state) => ({ rulersVisible: !state.rulersVisible })),
  toggleLockAspectRatio: () =>
    set((state) => ({ lockAspectRatio: !state.lockAspectRatio })),
}));
