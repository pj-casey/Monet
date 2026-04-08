/**
 * Canvas Store — tracks the current design document and selection state.
 *
 * This is the "source of truth" for what's on the canvas.
 * When objects are added, removed, or changed, this store gets updated.
 * The design document in this store is what gets saved/exported.
 */

import { create } from 'zustand';
import type { DesignDocument, BackgroundOptions } from '@monet/shared';

interface CanvasState {
  /** The current design document (null if no design is open yet) */
  document: DesignDocument | null;
  /** IDs of currently selected objects on the canvas */
  selectedObjectIds: string[];
  /** Whether the design has unsaved changes */
  isDirty: boolean;
  /** Current artboard background setting */
  background: BackgroundOptions;

  /** Replace the entire design document (used when loading a design) */
  setDocument: (doc: DesignDocument) => void;
  /** Update which objects are selected */
  setSelectedObjectIds: (ids: string[]) => void;
  /** Mark the design as having unsaved changes */
  markDirty: () => void;
  /** Mark the design as saved (no unsaved changes) */
  markClean: () => void;
  /** Set the artboard background */
  setBackground: (bg: BackgroundOptions) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  document: null,
  selectedObjectIds: [],
  isDirty: false,
  background: { type: 'solid', value: '#ffffff' },

  setDocument: (doc) => set({ document: doc, isDirty: false }),
  setSelectedObjectIds: (ids) => set({ selectedObjectIds: ids }),
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
  setBackground: (bg) => set({ background: bg, isDirty: true }),
}));
