/**
 * MyDesigns — a modal showing all saved designs from IndexedDB.
 *
 * Displays a grid of design cards with thumbnails, names, and dates.
 * Actions: open, rename, duplicate, delete.
 */

import { useState, useEffect, useCallback } from 'react';
import { getAllDesigns, deleteDesign, saveDesign, type SavedDesign } from '../lib/db';

interface MyDesignsProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDesign: (design: SavedDesign) => void;
}

export function MyDesigns({ isOpen, onClose, onOpenDesign }: MyDesignsProps) {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const refresh = useCallback(async () => {
    const all = await getAllDesigns();
    setDesigns(all);
  }, []);

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen, refresh]);

  if (!isOpen) return null;

  const handleDelete = async (id: string) => {
    await deleteDesign(id);
    refresh();
  };

  const handleDuplicate = async (design: SavedDesign) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const now = new Date().toISOString();
    const copy: SavedDesign = {
      ...design,
      id,
      name: `${design.name} (copy)`,
      createdAt: now,
      updatedAt: now,
      document: { ...design.document, id, name: `${design.name} (copy)`, createdAt: now, updatedAt: now },
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
    const updated: SavedDesign = {
      ...design,
      name: newName,
      document: { ...design.document, name: newName },
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="My Designs"
    >
      <div className="flex h-[80vh] w-[90vw] max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">My Designs</h2>
          <button type="button" onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {designs.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-400">No saved designs yet. Create one with "+ New"!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-500"
                >
                  {/* Thumbnail */}
                  <button
                    type="button"
                    onClick={() => { onOpenDesign(design); onClose(); }}
                    className="flex h-32 items-center justify-center bg-gray-100 dark:bg-gray-700"
                  >
                    {design.thumbnail ? (
                      <img src={design.thumbnail} alt={design.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">No preview</span>
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
                        className="rounded border border-blue-400 px-1 py-0.5 text-sm dark:bg-gray-700 dark:text-gray-100"
                        autoFocus
                      />
                    ) : (
                      <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{design.name}</p>
                    )}
                    <p className="text-[10px] text-gray-400">{formatDate(design.updatedAt)}</p>

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
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
      }`}>
      {children}
    </button>
  );
}
