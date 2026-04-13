/**
 * MyDesigns — a modal showing all saved designs from IndexedDB.
 *
 * Displays a grid of design cards with thumbnails, names, and dates.
 * Actions: open, rename, duplicate, delete.
 */

import { useState, useEffect, useCallback } from 'react';
import { getAllDesigns, deleteDesign, saveDesign, type SavedDesign } from '../lib/db';
import { FocusTrap } from './A11y';
import { useEscapeClose } from '../hooks/use-escape-close';

interface MyDesignsProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDesign: (design: SavedDesign) => void;
}

export function MyDesigns({ isOpen, onClose, onOpenDesign }: MyDesignsProps) {
  useEscapeClose(isOpen, onClose);
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const all = await getAllDesigns();
    setDesigns(all);
  }, []);

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen, refresh]);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteDesign(deleteConfirmId);
    setDeleteConfirmId(null);
    refresh();
  };

  const handleDuplicate = async (design: SavedDesign) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const now = new Date().toISOString();
    // Deep copy the document to avoid shared references between original and duplicate
    const docCopy = JSON.parse(JSON.stringify(design.document));
    docCopy.id = id;
    docCopy.name = `${design.name} (copy)`;
    docCopy.createdAt = now;
    docCopy.updatedAt = now;
    const copy: SavedDesign = {
      ...design,
      id,
      name: `${design.name} (copy)`,
      createdAt: now,
      updatedAt: now,
      thumbnail: design.thumbnail,
      document: docCopy,
    };
    await saveDesign(copy);
    refresh();
  };

  const handleRenameStart = (design: SavedDesign) => {
    setRenaming(design.id);
    setRenameValue(design.name);
  };

  const handleRenameConfirm = async (design: SavedDesign) => {
    const newName = renameValue.trim() || design.name;
    const now = new Date().toISOString();
    const updated: SavedDesign = {
      ...design,
      name: newName,
      updatedAt: now,
      document: { ...design.document, name: newName, updatedAt: now },
    };
    await saveDesign(updated);
    setRenaming(null);
    refresh();
  };

  const formatDate = (iso: string): string => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="My Designs"
    >
      <FocusTrap>
      <div className="animate-scale-up flex h-[80vh] w-[90vw] max-w-4xl flex-col overflow-hidden rounded-lg bg-overlay shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-text-primary">My Designs</h2>
          <button type="button" onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-text-tertiary hover:bg-wash"
            aria-label="Close">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {designs.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-accent-subtle">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/>
                </svg>
              </div>
              <p className="text-base font-medium text-text-secondary">No designs yet</p>
              <p className="mt-1 max-w-xs text-sm text-text-tertiary">Your saved designs will appear here. Start creating by clicking the button below!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border hover:border-accent hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <button
                    type="button"
                    onClick={() => { onOpenDesign(design); onClose(); }}
                    className="flex h-32 items-center justify-center bg-wash"
                  >
                    {design.thumbnail ? (
                      <img src={design.thumbnail} alt={design.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs text-text-tertiary">No preview</span>
                    )}
                  </button>

                  {/* Info */}
                  <div className="flex flex-col gap-1 p-3">
                    {renaming === design.id ? (
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRenameConfirm(design)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleRenameConfirm(design); }}
                        className="rounded border border-accent px-1 py-0.5 text-sm"
                        autoFocus
                      />
                    ) : (
                      <p className="truncate text-sm font-medium text-text-primary">{design.name}</p>
                    )}
                    <p className="text-[10px] text-text-tertiary">{formatDate(design.updatedAt)}</p>

                    {/* Actions */}
                    <div className="mt-1 flex gap-1 opacity-0 group-hover:opacity-100">
                      <ActionBtn label="Rename" onClick={() => handleRenameStart(design)}>Rename</ActionBtn>
                      <ActionBtn label="Duplicate" onClick={() => handleDuplicate(design)}>Duplicate</ActionBtn>
                      <ActionBtn label="Delete" onClick={() => handleDelete(design.id)} danger>Delete</ActionBtn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </FocusTrap>

      {/* Delete confirmation dialog */}
      {deleteConfirmId && (
        <div
          className="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteConfirmId(null)}
          role="dialog" aria-modal="true" aria-label="Confirm delete"
        >
          <div className="animate-scale-up w-full max-w-xs rounded-lg bg-overlay p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Delete design?</h3>
            <p className="mb-5 text-xs text-text-secondary">This cannot be undone. The design will be permanently removed.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:bg-wash">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete}
                className="flex-1 rounded bg-danger px-3 py-2 text-xs font-medium text-text-inverse hover:opacity-90">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ label, onClick, children, danger }: {
  label: string; onClick: () => void; children: React.ReactNode; danger?: boolean;
}) {
  return (
    <button type="button" aria-label={label} onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`rounded px-2 py-0.5 text-[10px] ${
        danger
          ? 'text-danger hover:bg-danger-subtle'
          : 'text-text-secondary hover:bg-wash'
      }`}>
      {children}
    </button>
  );
}
