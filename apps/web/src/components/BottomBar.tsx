/**
 * BottomBar — status bar showing artboard dimensions and zoom percentage.
 */

import { useEditorStore } from '../stores/editor-store';

export function BottomBar() {
  const zoom = useEditorStore((s) => s.zoom);
  const artboardWidth = useEditorStore((s) => s.artboardWidth);
  const artboardHeight = useEditorStore((s) => s.artboardHeight);

  return (
    <footer className="flex h-7 items-center justify-between border-t border-gray-200 bg-white px-4 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
      <span>{artboardWidth} &times; {artboardHeight} px</span>
      <span>{Math.round(zoom * 100)}%</span>
    </footer>
  );
}
