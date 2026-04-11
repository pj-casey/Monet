/**
 * Onboarding — contextual, minimal approach.
 *
 * The welcome screen IS the onboarding for new users — no separate tutorial.
 * This component shows ONE small tooltip the first time a user opens a
 * template or design, pointing them to the canvas:
 *   "Click any element to edit it."
 *
 * After dismissal (click or 5 seconds), it never shows again.
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'monet-onboarding-done';

export function Onboarding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    // Show after a short delay so the canvas renders first
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => dismiss(), 10000);
    return () => clearTimeout(timer);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2">
      <div className="animate-tooltip-pop flex items-center gap-3 rounded-xl bg-overlay px-5 py-3.5 shadow-xl">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-fg">
            <path d="M3 3l4 4M13 13l-4-4M9 7l4-4M3 13l4-4" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">Click any element to edit it</p>
          <p className="text-xs text-text-tertiary">Properties will appear on the right.</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="ml-2 flex-shrink-0 rounded-lg bg-wash px-3 py-1 text-xs font-medium text-text-secondary hover:bg-canvas"
          aria-label="Dismiss"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

/** Reset onboarding so it shows again */
export function resetOnboarding(): void {
  localStorage.removeItem(STORAGE_KEY);
}
