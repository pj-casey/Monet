/**
 * ShortcutSheet — a modal listing all keyboard shortcuts.
 *
 * Press "?" to open. Shows shortcuts grouped by category:
 * Tools, Editing, Layers, Navigation, General.
 */

import { FocusTrap } from './A11y';

interface ShortcutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutSheet({ isOpen, onClose }: ShortcutSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <FocusTrap>
      <div className="animate-scale-up max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-overlay p-7 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Keyboard Shortcuts</h2>
          <button
            type="button" onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-text-tertiary hover:bg-wash"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <ShortcutGroup title="Tools">
          <Shortcut keys="V" desc="Select tool" />
          <Shortcut keys="T" desc="Text tool" />
          <Shortcut keys="D" desc="Draw tool" />
          <Shortcut keys="P" desc="Pen tool" />
        </ShortcutGroup>

        <ShortcutGroup title="File">
          <Shortcut keys="Ctrl + S" desc="Save" />
        </ShortcutGroup>

        <ShortcutGroup title="Editing">
          <Shortcut keys="Ctrl + Z" desc="Undo" />
          <Shortcut keys="Ctrl + Y" desc="Redo" />
          <Shortcut keys="Ctrl + Shift + Z" desc="Redo (alternative)" />
          <Shortcut keys="Ctrl + C" desc="Copy" />
          <Shortcut keys="Ctrl + X" desc="Cut" />
          <Shortcut keys="Ctrl + V" desc="Paste" />
          <Shortcut keys="Ctrl + D" desc="Duplicate" />
          <Shortcut keys="Ctrl + A" desc="Select all" />
          <Shortcut keys="Delete" desc="Delete selected" />
          <Shortcut keys="Alt + Shift + C" desc="Copy style" />
          <Shortcut keys="Alt + Shift + V" desc="Paste style" />
          <Shortcut keys="Alt + drag" desc="Duplicate and drag" />
          <Shortcut keys="Escape" desc="Deselect / cancel" />
        </ShortcutGroup>

        <ShortcutGroup title="Layers">
          <Shortcut keys="Ctrl + G" desc="Group objects" />
          <Shortcut keys="Ctrl + Shift + G" desc="Ungroup" />
        </ShortcutGroup>

        <ShortcutGroup title="Navigation">
          <Shortcut keys="Scroll wheel" desc="Zoom in/out" />
          <Shortcut keys="Space + drag" desc="Pan canvas" />
          <Shortcut keys="Middle mouse drag" desc="Pan canvas" />
          <Shortcut keys="Arrow keys" desc="Nudge 1px" />
          <Shortcut keys="Shift + arrows" desc="Nudge 10px" />
        </ShortcutGroup>

        <ShortcutGroup title="General">
          <Shortcut keys="/" desc="Command palette" />
          <Shortcut keys="Ctrl + K" desc="Command palette" />
          <Shortcut keys="?" desc="Show this sheet" />
        </ShortcutGroup>
      </div>
      </FocusTrap>
    </div>
  );
}

function ShortcutGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Shortcut({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-text-secondary">{desc}</span>
      <kbd className="rounded bg-wash px-2 py-0.5 text-xs font-mono text-text-secondary">{keys}</kbd>
    </div>
  );
}
