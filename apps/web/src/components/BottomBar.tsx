/**
 * BottomBar — status bar showing artboard dimensions and zoom percentage.
 */

import { useEditorStore } from '../stores/editor-store';

export function BottomBar() {
  const zoom = useEditorStore((s) => s.zoom);
  const artboardWidth = useEditorStore((s) => s.artboardWidth);
  const artboardHeight = useEditorStore((s) => s.artboardHeight);

  return (
    <footer className="flex h-7 items-center justify-between border-t border-border bg-surface px-5 text-[11px] text-text-tertiary">
      <span>{artboardWidth} &times; {artboardHeight} px</span>
      <span>{Math.round(zoom * 100)}%</span>
    </footer>
  );
}
