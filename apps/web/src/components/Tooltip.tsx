/**
 * Tooltip — styled tooltip that replaces native title="" attributes.
 *
 * Small dark rounded pill, appears above the trigger after 500ms delay.
 * Uses DESIGN.md tokens. Supports configurable position.
 */

import { useState, useRef, useCallback, type ReactNode } from 'react';

interface TooltipProps {
  /** Tooltip text */
  label: string;
  /** Position relative to trigger */
  position?: 'top' | 'bottom';
  /** The element that triggers the tooltip */
  children: ReactNode;
}

export function Tooltip({ label, position = 'top', children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), 500);
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
          className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-text-primary px-2.5 py-1 text-[10px] font-medium text-text-inverse shadow-md ${
            position === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          {label}
        </div>
      )}
    </div>
  );
}
