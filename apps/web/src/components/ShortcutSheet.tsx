/**
 * ShortcutSheet — a modal listing all keyboard shortcuts.
 *
 * Press "?" to open. Shows shortcuts grouped by category:
 * Tools, Editing, Layers, Navigation.
 */

interface ShortcutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutSheet({ isOpen, onClose }: ShortcutSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Keyboard Shortcuts</h2>
          <button
            type="button" onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <ShortcutGroup title="Tools">
          <Shortcut keys="V" desc="Select tool" />
          <Shortcut keys="T" desc="Text tool" />
          <Shortcut keys="D" desc="Draw tool" />
        </ShortcutGroup>

        <ShortcutGroup title="File">
          <Shortcut keys="Ctrl + S" desc="Save" />
        </ShortcutGroup>

        <ShortcutGroup title="Editing">
          <Shortcut keys="Ctrl + Z" desc="Undo" />
          <Shortcut keys="Ctrl + Y" desc="Redo" />
          <Shortcut keys="Ctrl + C" desc="Copy" />
          <Shortcut keys="Ctrl + V" desc="Paste" />
          <Shortcut keys="Ctrl + D" desc="Duplicate" />
          <Shortcut keys="Delete" desc="Delete selected" />
        </ShortcutGroup>

        <ShortcutGroup title="Layers">
          <Shortcut keys="Ctrl + G" desc="Group objects" />
          <Shortcut keys="Ctrl + Shift + G" desc="Ungroup" />
        </ShortcutGroup>

        <ShortcutGroup title="Navigation">
          <Shortcut keys="Scroll wheel" desc="Zoom in/out" />
          <Shortcut keys="Space + drag" desc="Pan canvas" />
          <Shortcut keys="Arrow keys" desc="Nudge 1px" />
          <Shortcut keys="Shift + arrows" desc="Nudge 10px" />
        </ShortcutGroup>

        <ShortcutGroup title="General">
          <Shortcut keys="?" desc="Show this sheet" />
        </ShortcutGroup>
      </div>
    </div>
  );
}

function ShortcutGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Shortcut({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-600 dark:text-gray-300">{desc}</span>
      <kbd className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-500 dark:bg-gray-700 dark:text-gray-400">{keys}</kbd>
    </div>
  );
}
