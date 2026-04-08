/**
 * History Store — tracks undo/redo availability for the UI.
 *
 * This store doesn't hold the actual history data (that's in the
 * canvas engine's HistoryManager). It just tracks whether the
 * undo and redo buttons should be enabled or disabled.
 *
 * The canvas engine calls setCanUndo/setCanRedo whenever the
 * history state changes, and the toolbar reads these values
 * to show/hide buttons.
 */

import { create } from 'zustand';

interface HistoryState {
  /** Whether there's an action to undo */
  canUndo: boolean;
  /** Whether there's an action to redo */
  canRedo: boolean;

  /** Called by canvas engine when history state changes */
  setCanUndo: (canUndo: boolean) => void;
  setCanRedo: (canRedo: boolean) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  canUndo: false,
  canRedo: false,

  setCanUndo: (canUndo) => set({ canUndo }),
  setCanRedo: (canRedo) => set({ canRedo }),
}));
