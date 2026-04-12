/**
 * Activity Store — tracks the app's current async activity for the living wordmark.
 *
 * States:
 * - idle: nothing happening, subtle breathing animation
 * - loading: template loading, editor init, image upload
 * - processing: AI generation, export rendering, background removal
 * - success: operation completed — auto-resets to idle after 1.5s
 * - error: operation failed — auto-resets to idle after 1.5s
 */

import { create } from 'zustand';

export type ActivityState = 'idle' | 'loading' | 'processing' | 'success' | 'error';

interface ActivityStore {
  activity: ActivityState;
  setActivity: (state: ActivityState) => void;
}

let _resetTimer: ReturnType<typeof setTimeout> | null = null;

export const useActivityStore = create<ActivityStore>((set) => ({
  activity: 'idle',
  setActivity: (state) => {
    if (_resetTimer) { clearTimeout(_resetTimer); _resetTimer = null; }
    set({ activity: state });
    // Auto-reset transient states back to idle
    if (state === 'success' || state === 'error') {
      _resetTimer = setTimeout(() => {
        set({ activity: 'idle' });
        _resetTimer = null;
      }, 1500);
    }
  },
}));
