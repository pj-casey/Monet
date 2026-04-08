/**
 * UI Store — controls visual UI state like panel visibility and theme.
 *
 * This store handles things that are about the editor's interface itself,
 * not about the design being edited. For example: is the left sidebar open?
 * Is dark mode on?
 */

import { create } from 'zustand';

interface UIState {
  /** Whether to use dark color theme */
  darkMode: boolean;
  /** Whether the left sidebar (tools panel) is visible */
  leftPanelOpen: boolean;
  /** Whether the right sidebar (properties panel) is visible */
  rightPanelOpen: boolean;

  /** Toggle dark mode on/off */
  toggleDarkMode: () => void;
  /** Toggle left sidebar visibility */
  toggleLeftPanel: () => void;
  /** Toggle right sidebar visibility */
  toggleRightPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  darkMode: false,
  leftPanelOpen: true,
  rightPanelOpen: true,

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
}));
