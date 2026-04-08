/**
 * Accessibility utilities — focus trap, aria-live announcer, skip link.
 *
 * - FocusTrap: traps Tab key inside a modal/dialog
 * - LiveRegion: announces status changes to screen readers
 * - SkipLink: skip-to-content link for keyboard users
 * - ReducedMotion: CSS class hook for prefers-reduced-motion
 */

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * FocusTrap — keeps Tab key cycling within the children.
 * Used in modals and dialogs so keyboard users don't Tab behind the overlay.
 */
export function FocusTrap({ children, active = true }: { children: ReactNode; active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const element = ref.current;
    const focusable = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    // Focus the first element
    first.focus();

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return <div ref={ref}>{children}</div>;
}

/**
 * LiveRegion — invisible aria-live region for announcing status changes.
 * Screen readers will read the message aloud when it changes.
 */
export function LiveRegion({ message }: { message: string }) {
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}

/**
 * SkipLink — hidden link that becomes visible on focus.
 * Lets keyboard users skip the toolbar and jump to the canvas.
 */
export function SkipLink() {
  return (
    <a
      href="#canvas-area"
      className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-blue-600 focus:px-3 focus:py-1 focus:text-sm focus:text-white"
    >
      Skip to canvas
    </a>
  );
}

/**
 * Hook to check if user prefers reduced motion.
 * Returns true if the OS/browser setting is enabled.
 */
export function usePrefersReducedMotion(): boolean {
  const query = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  return query?.matches ?? false;
}
