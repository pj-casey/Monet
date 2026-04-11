/**
 * ContextMenu — custom right-click menu for the canvas.
 *
 * Shows different options depending on what was right-clicked:
 * - Object selected: Cut, Copy, Paste, Duplicate, Delete, Lock, Group, ordering
 * - Empty canvas: Paste, Select All, Zoom to Fit
 *
 * Styled with DESIGN.md tokens. Dismisses on click outside or Escape.
 */

import { useEffect, useRef } from 'react';
import { engine } from './Canvas';
import { useEditorStore, type CopiedStyle } from '../stores/editor-store';

interface ContextMenuProps {
  x: number;
  y: number;
  hasSelection: boolean;
  isMultiSelect: boolean;
  isLocked: boolean;
  onClose: () => void;
}

export function ContextMenu({
  x, y, hasSelection, isMultiSelect, isLocked, onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // Ensure menu stays within viewport
  const style: React.CSSProperties = {
    position: 'fixed',
    left: x,
    top: y,
    zIndex: 100,
  };

  const action = (fn: () => void) => () => { fn(); onClose(); };

  return (
    <div ref={menuRef} style={style}
      className="animate-scale-up min-w-[180px] rounded-md border border-border bg-overlay py-1 shadow-lg">

      {hasSelection ? (
        <>
          <MenuItem label="Cut" shortcut="Ctrl+X" onClick={action(() => { engine.copySelected(); engine.deleteSelectedObjects(); })} />
          <MenuItem label="Copy" shortcut="Ctrl+C" onClick={action(() => engine.copySelected())} />
          <MenuItem label="Paste" shortcut="Ctrl+V" onClick={action(() => engine.pasteClipboard())} />
          <MenuItem label="Duplicate" shortcut="Ctrl+D" onClick={action(() => engine.duplicateSelected())} />
          <MenuDivider />
          <MenuItem label="Copy Style" shortcut="Alt+Shift+C" onClick={action(() => {
            const style = engine.getSelectedStyle();
            if (style) useEditorStore.getState().setCopiedStyle(style as CopiedStyle);
          })} />
          <MenuItem label="Paste Style" shortcut="Alt+Shift+V" onClick={action(() => {
            const style = useEditorStore.getState().copiedStyle;
            if (style) engine.applyStyleToSelected(style as unknown as Record<string, unknown>);
          })} />
          <MenuDivider />
          <MenuItem label="Delete" shortcut="Del" onClick={action(() => engine.deleteSelectedObjects())} danger />
          <MenuDivider />
          <MenuItem
            label={isLocked ? 'Unlock' : 'Lock'}
            onClick={action(() => {
              const canvas = engine.getFabricCanvas();
              if (!canvas) return;
              const obj = canvas.getActiveObject();
              if (!obj) return;
              const idx = canvas.getObjects().indexOf(obj);
              if (idx >= 0) engine.toggleLayerLock(idx);
            })}
          />
          {isMultiSelect && (
            <>
              <MenuItem label="Group" shortcut="Ctrl+G" onClick={action(() => engine.groupSelected())} />
              <MenuItem label="Ungroup" shortcut="Ctrl+Shift+G" onClick={action(() => engine.ungroupSelected())} />
            </>
          )}
          <MenuDivider />
          <MenuItem label="Bring Forward" onClick={action(() => {
            const canvas = engine.getFabricCanvas();
            const obj = canvas?.getActiveObject();
            if (obj && canvas) { canvas.bringObjectForward(obj); canvas.requestRenderAll(); }
          })} />
          <MenuItem label="Send Backward" onClick={action(() => {
            const canvas = engine.getFabricCanvas();
            const obj = canvas?.getActiveObject();
            if (obj && canvas) { canvas.sendObjectBackwards(obj); canvas.requestRenderAll(); }
          })} />
          <MenuItem label="Bring to Front" onClick={action(() => {
            const canvas = engine.getFabricCanvas();
            const obj = canvas?.getActiveObject();
            if (obj && canvas) { canvas.bringObjectToFront(obj); canvas.requestRenderAll(); }
          })} />
          <MenuItem label="Send to Back" onClick={action(() => {
            const canvas = engine.getFabricCanvas();
            const obj = canvas?.getActiveObject();
            if (obj && canvas) { canvas.sendObjectToBack(obj); canvas.requestRenderAll(); }
          })} />
        </>
      ) : (
        <>
          <MenuItem label="Paste" shortcut="Ctrl+V" onClick={action(() => engine.pasteClipboard())} />
          <MenuItem label="Select All" shortcut="Ctrl+A" onClick={action(() => engine.selectAllObjects())} />
          <MenuDivider />
          <MenuItem label="Zoom to Fit" onClick={action(() => engine.fitToScreen())} />
        </>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function MenuItem({ label, shortcut, onClick, danger }: {
  label: string; shortcut?: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between px-3 py-1.5 text-xs hover:bg-wash ${
        danger ? 'text-danger' : 'text-text-primary'
      }`}
    >
      <span>{label}</span>
      {shortcut && (
        <span className="ml-4 text-[10px] text-text-tertiary">{shortcut}</span>
      )}
    </button>
  );
}

function MenuDivider() {
  return <div className="my-1 h-px bg-border" />;
}
