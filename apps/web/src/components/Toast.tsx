/**
 * Toast — lightweight bottom-center notification system.
 *
 * Shows brief confirmations for user actions (copy, paste, export, etc.).
 * Auto-dismisses after 2.5s. Slide-up + fade-in animation.
 * Uses DESIGN.md tokens. No close button — gentle confirmations only.
 */

import { useEffect, useState, useCallback, useRef, type ReactNode } from 'react';

interface ToastItem {
  id: number;
  icon: ReactNode;
  message: string;
}

let _nextId = 0;
const _listeners: Set<(toast: ToastItem) => void> = new Set();

/** Show a toast notification. Call from anywhere — not a hook. */
export function showToast(message: string, icon?: ReactNode) {
  const toast: ToastItem = { id: ++_nextId, icon: icon ?? <CheckIcon />, message };
  for (const fn of _listeners) fn(toast);
}

/** Container component — render once in the app, above the page navigator */
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const addToast = useCallback((toast: ToastItem) => {
    setToasts((prev) => [...prev.slice(-2), toast]); // max 3 visible
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      timers.current.delete(toast.id);
    }, 2500);
    timers.current.set(toast.id, timer);
  }, []);

  useEffect(() => {
    _listeners.add(addToast);
    return () => { _listeners.delete(addToast); };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-up pointer-events-auto flex items-center gap-2 rounded-lg bg-elevated px-3.5 py-2 text-sm font-medium text-text-primary shadow-lg"
        >
          <span className="flex-shrink-0 text-success">{toast.icon}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ClipboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

export function ImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
    </svg>
  );
}
