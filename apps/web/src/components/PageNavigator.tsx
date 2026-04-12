/**
 * PageNavigator — horizontal thumbnail strip for multi-page designs.
 *
 * Shows small page thumbnails at the bottom of the editor. Users can:
 * - Click a thumbnail to switch pages
 * - Click "+" to add a new page
 * - Right-click for context menu (duplicate, delete, rename, move)
 * - See which page is active (accent border)
 *
 * Thumbnails are rendered lazily from the canvas engine.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useEditorStore } from '../stores/editor-store';
import { engine } from './Canvas';
import { Tooltip } from './Tooltip';

export function PageNavigator() {
  const pages = useEditorStore((s) => s.pages);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const pageCount = useEditorStore((s) => s.pageCount);
  const artboardWidth = useEditorStore((s) => s.artboardWidth);
  const artboardHeight = useEditorStore((s) => s.artboardHeight);

  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; pageIndex: number } | null>(null);
  const [renaming, setRenaming] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const contextRef = useRef<HTMLDivElement>(null);

  // Thumbnail aspect ratio — capped to fit within the 72px strip
  const maxThumbH = 56;
  const rawThumbH = Math.round(120 * (artboardHeight / artboardWidth));
  const thumbHeight = Math.min(rawThumbH, maxThumbH);
  const thumbWidth = rawThumbH > maxThumbH
    ? Math.round(maxThumbH * (artboardWidth / artboardHeight))
    : 120;

  // Render thumbnails when pages change
  useEffect(() => {
    let cancelled = false;
    const renderThumbs = async () => {
      const newThumbs = new Map<string, string>();
      for (let i = 0; i < pages.length; i++) {
        if (cancelled) return;
        const url = await engine.renderPageToDataURL(i, 0.15);
        if (url) newThumbs.set(pages[i].id, url);
      }
      if (!cancelled) setThumbnails(newThumbs);
    };
    // Debounce slightly
    const timer = setTimeout(renderThumbs, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [pages, currentPageIndex]);

  const handleSwitchPage = useCallback(async (index: number) => {
    await engine.switchToPage(index);
  }, []);

  const handleAddPage = useCallback(async () => {
    await engine.addPage();
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent, pageIndex: number) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, pageIndex });
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const handler = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [contextMenu]);

  const handleDuplicate = useCallback(async () => {
    if (contextMenu) {
      await engine.duplicatePage(contextMenu.pageIndex);
      setContextMenu(null);
    }
  }, [contextMenu]);

  const handleDelete = useCallback(async () => {
    if (contextMenu && pages.length > 1) {
      await engine.deletePage(contextMenu.pageIndex);
      setContextMenu(null);
    }
  }, [contextMenu, pages.length]);

  const handleMoveLeft = useCallback(() => {
    if (contextMenu && contextMenu.pageIndex > 0) {
      engine.reorderPages(contextMenu.pageIndex, contextMenu.pageIndex - 1);
      setContextMenu(null);
    }
  }, [contextMenu]);

  const handleMoveRight = useCallback(() => {
    if (contextMenu && contextMenu.pageIndex < pages.length - 1) {
      engine.reorderPages(contextMenu.pageIndex, contextMenu.pageIndex + 1);
      setContextMenu(null);
    }
  }, [contextMenu, pages.length]);

  const handleStartRename = useCallback(() => {
    if (contextMenu) {
      setRenaming(contextMenu.pageIndex);
      setRenameValue(pages[contextMenu.pageIndex].name);
      setContextMenu(null);
    }
  }, [contextMenu, pages]);

  const handleRenameCommit = useCallback(() => {
    if (renaming !== null && renameValue.trim()) {
      engine.renamePage(renaming, renameValue.trim());
    }
    setRenaming(null);
  }, [renaming, renameValue]);

  // Don't show if only 1 page (but still show the add button)
  // Actually always show — users need to know multi-page exists

  return (
    <>
      <div className="flex h-[72px] items-center gap-2 border-t border-border bg-surface px-3">
        {/* Page thumbnails */}
        <div className="flex flex-1 items-center gap-2 overflow-x-auto py-1.5">
          {pages.map((page, i) => (
            <button
              key={page.id}
              type="button"
              onClick={() => handleSwitchPage(i)}
              onContextMenu={(e) => handleContextMenu(e, i)}
              className={`group relative flex-shrink-0 rounded border-2 transition-[border-color,box-shadow] ${
                i === currentPageIndex
                  ? 'border-accent shadow-sm'
                  : 'border-border hover:border-border-strong'
              }`}
              style={{ width: thumbWidth, height: thumbHeight }}
              title={page.name}
              aria-label={`${page.name} — Page ${i + 1}`}
            >
              {/* Thumbnail image */}
              {thumbnails.get(page.id) ? (
                <img
                  src={thumbnails.get(page.id)}
                  alt={page.name}
                  className="h-full w-full rounded-sm object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-sm bg-elevated">
                  <span className="text-[8px] text-text-tertiary">{i + 1}</span>
                </div>
              )}
              {/* Page label */}
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 translate-y-full whitespace-nowrap text-[9px] text-text-tertiary">
                {renaming === i ? (
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={handleRenameCommit}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRenameCommit(); if (e.key === 'Escape') setRenaming(null); }}
                    className="w-16 rounded border border-accent bg-surface px-1 text-center text-[9px] text-text-primary outline-none"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  `${i + 1}`
                )}
              </span>
            </button>
          ))}

          {/* Add page button */}
          <Tooltip label="Add page">
            <button
              type="button"
              onClick={handleAddPage}
              className="flex flex-shrink-0 items-center justify-center rounded border-2 border-dashed border-border text-text-tertiary hover:border-accent hover:text-accent"
              style={{ width: thumbWidth * 0.5, height: thumbHeight }}
              aria-label="Add new page"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 4v12M4 10h12" />
              </svg>
            </button>
          </Tooltip>
        </div>

        {/* Page count */}
        <span className="flex-shrink-0 text-[11px] text-text-tertiary">
          Page {currentPageIndex + 1} of {pageCount}
        </span>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          ref={contextRef}
          className="animate-scale-up fixed z-50 min-w-[160px] rounded-md border border-border bg-overlay py-1 shadow-lg"
          style={{ left: contextMenu.x, bottom: window.innerHeight - contextMenu.y + 8 }}
        >
          <CtxItem label="Duplicate Page" onClick={handleDuplicate} />
          <CtxItem label="Rename" onClick={handleStartRename} />
          <CtxItem label="Move Left" onClick={handleMoveLeft} disabled={contextMenu.pageIndex === 0} />
          <CtxItem label="Move Right" onClick={handleMoveRight} disabled={contextMenu.pageIndex === pages.length - 1} />
          <div className="my-1 border-t border-border" />
          <CtxItem label="Delete Page" onClick={handleDelete} disabled={pages.length <= 1} danger />
        </div>
      )}
    </>
  );
}

function CtxItem({ label, onClick, disabled, danger }: {
  label: string; onClick: () => void; disabled?: boolean; danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`block w-full px-3 py-1.5 text-left text-xs ${
        disabled
          ? 'text-text-tertiary cursor-not-allowed'
          : danger
            ? 'text-danger hover:bg-danger-subtle'
            : 'text-text-secondary hover:bg-wash'
      }`}
    >
      {label}
    </button>
  );
}
