import { useEffect } from 'react';

/**
 * Close a dialog/modal/overlay when the user presses Escape.
 * Standard accessibility pattern — WCAG 2.1 requires modals to be
 * dismissible via keyboard.
 *
 * @param isOpen - Whether the dialog is currently open
 * @param onClose - Callback to close the dialog
 */
export function useEscapeClose(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);
}
