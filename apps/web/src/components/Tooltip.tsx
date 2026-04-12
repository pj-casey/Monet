/**
 * Tooltip — styled tooltip that replaces native title="" attributes.
 *
 * Small dark rounded pill, appears above the trigger after 300ms delay.
 * Uses DESIGN.md tokens. Supports configurable position and keyboard shortcut display.
 */

import { useState, useRef, useCallback, type ReactNode } from 'react';

interface TooltipProps {
  /** Tooltip text */
  label: string;
  /** Optional keyboard shortcut displayed as <kbd> after the label */
  shortcut?: string;
  /** Position relative to trigger */
  position?: 'top' | 'bottom';
  /** The element that triggers the tooltip */
  children: ReactNode;
}

export function Tooltip({ label, shortcut, position = 'top', children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), 300);
  }, []);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setVisible(false);
  }, []);

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`animate-tooltip-pop pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-text-primary px-2 py-1 text-[10px] font-medium text-text-inverse shadow-md ${
            position === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {label}
            {shortcut && (
              <kbd className="rounded bg-white/15 px-1 py-px text-[9px] font-normal">{shortcut}</kbd>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
