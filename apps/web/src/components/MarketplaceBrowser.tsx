/**
 * MarketplaceBrowser — browse, search, preview, and use community templates.
 *
 * Features: category filter, search, sort (newest/popular/staff picks),
 * template preview with details, "Use this template" button,
 * upvote toggle, creator profile link.
 */

import { useState, useEffect, useCallback } from 'react';
import type { DesignDocument } from '@monet/shared';
import { FocusTrap } from './A11y';
import { useEscapeClose } from '../hooks/use-escape-close';

const API_BASE = 'http://localhost:3001';

interface MarketplaceTemplate {
  id: string;
  userId: string;
  userName: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  dimensions: { width: number; height: number };
  thumbnail: string;
  uses: number;
  upvotes: number;
  staffPick: boolean;
  createdAt: string;
}

interface MarketplaceBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (doc: DesignDocument) => void;
}

export function MarketplaceBrowser({ isOpen, onClose, onUseTemplate }: MarketplaceBrowserProps) {
  useEscapeClose(isOpen, onClose);
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<'newest' | 'popular' | 'staff'>('newest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<MarketplaceTemplate | null>(null);

  const CATEGORIES = ['', 'Social Media', 'Video', 'Presentation', 'Print', 'Marketing', 'Other'];

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, page: String(page), limit: '12' });
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      const res = await fetch(`${API_BASE}/api/marketplace?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
        setTotal(data.total);
      }
    } catch { /* Server not available */ }
    finally { setLoading(false); }
  }, [query, category, sort, page]);

  useEffect(() => { if (isOpen) fetchTemplates(); }, [isOpen, fetchTemplates]);

  const handleUse = useCallback(async (template: MarketplaceTemplate) => {
    try {
      // Fetch full document
      const res = await fetch(`${API_BASE}/api/marketplace/${template.id}`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();

      // Increment use count
      fetch(`${API_BASE}/api/marketplace/${template.id}/use`, { method: 'POST', credentials: 'include' });

      onUseTemplate(data.document);
      onClose();
    } catch { alert('Failed to load template'); }
  }, [onUseTemplate, onClose]);

  const handleVote = useCallback(async (templateId: string) => {
    try {
      await fetch(`${API_BASE}/api/marketplace/${templateId}/vote`, { method: 'POST', credentials: 'include' });
      fetchTemplates();
    } catch { /* ignore */ }
  }, [fetchTemplates]);

  const handlePreview = useCallback((template: MarketplaceTemplate) => {
    setPreview(template);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true">
      <FocusTrap>
      <div className="flex h-[85vh] w-[90vw] max-w-5xl flex-col overflow-hidden animate-scale-up rounded-lg bg-overlay shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-text-primary">Template Marketplace</h2>
          <button type="button" onClick={onClose} aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-full text-text-tertiary hover:bg-wash">&#x2715;</button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-6 py-3">
          <input type="text" placeholder="Search templates..." value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="w-48 rounded border border-border px-2 py-1 text-xs" />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="rounded border border-border px-2 py-1 text-xs">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c || 'All categories'}</option>)}
          </select>
          <div className="flex gap-1">
            {(['newest', 'popular', 'staff'] as const).map((s) => (
              <button key={s} type="button" onClick={() => { setSort(s); setPage(1); }}
                className={`rounded px-2 py-1 text-xs ${sort === s ? 'bg-accent-subtle text-accent' : 'text-text-secondary hover:bg-wash'}`}>
                {s === 'staff' ? 'Staff Picks' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-text-tertiary">{total} templates</span>
        </div>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && <p className="text-center text-sm text-text-tertiary">Loading...</p>}
          {!loading && templates.length === 0 && (
            <p className="text-center text-sm text-text-tertiary">No templates found. Be the first to publish one!</p>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {templates.map((t) => (
              <div key={t.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-border hover:border-accent hover:shadow-md">
                <button type="button" onClick={() => handlePreview(t)}
                  className="flex h-32 items-center justify-center bg-wash">
                  {t.thumbnail ? (
                    <img src={t.thumbnail} alt={t.name} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-xs text-text-tertiary">{t.dimensions.width}x{t.dimensions.height}</span>
                  )}
                </button>
                <div className="flex flex-col gap-1 p-2.5">
                  <p className="truncate text-xs font-medium text-text-primary">{t.name}</p>
                  <p className="text-[10px] text-text-tertiary">{t.userName} · {t.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-[10px] text-text-tertiary">
                      <span>{t.uses} uses</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleVote(t.id); }}
                        className="hover:text-accent">&#9650; {t.upvotes}</button>
                    </div>
                    {t.staffPick && <span className="rounded bg-warning-subtle px-1 text-[9px] font-semibold text-warning">PICK</span>}
                  </div>
                  <button type="button" onClick={() => handleUse(t)}
                    className="mt-1 rounded bg-accent px-2 py-1 text-[10px] font-medium text-accent-fg opacity-0 group-hover:opacity-100 hover:bg-accent-hover">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > 12 && (
            <div className="mt-4 flex justify-center gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                className="rounded border border-border px-3 py-1 text-xs disabled:opacity-30">Prev</button>
              <span className="py-1 text-xs text-text-tertiary">Page {page}</span>
              <button type="button" onClick={() => setPage((p) => p + 1)}
                className="rounded border border-border px-3 py-1 text-xs">Next</button>
            </div>
          )}
        </div>

        {/* Preview overlay */}
        {preview && (
          <PreviewOverlay template={preview}
            onClose={() => setPreview(null)}
            onUse={() => handleUse(preview)} />
        )}
      </div>
      </FocusTrap>
    </div>
  );
}

function PreviewOverlay({ template, onClose, onUse }: {
  template: MarketplaceTemplate; onClose: () => void; onUse: () => void;
}) {
  return (
    <div className="absolute inset-0 flex bg-black/40" onClick={onClose}>
      <div className="m-auto w-full max-w-lg animate-scale-up rounded-lg bg-overlay p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        {template.thumbnail && (
          <img src={template.thumbnail} alt={template.name} className="mb-4 h-48 w-full rounded-lg object-contain bg-wash" />
        )}
        <h3 className="text-lg font-semibold text-text-primary">{template.name}</h3>
        <p className="mt-1 text-xs text-text-tertiary">by {template.userName} · {template.dimensions.width}×{template.dimensions.height}</p>
        {template.description && <p className="mt-2 text-sm text-text-secondary">{template.description}</p>}
        {template.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {template.tags.map((tag) => (
              <span key={tag} className="rounded bg-wash px-1.5 py-0.5 text-[10px] text-text-secondary">{tag}</span>
            ))}
          </div>
        )}
        <div className="mt-2 flex gap-3 text-xs text-text-tertiary">
          <span>{template.uses} uses</span>
          <span>{template.upvotes} upvotes</span>
          {template.staffPick && <span className="text-warning">Staff Pick</span>}
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-lg border border-border-strong px-4 py-2 text-sm text-text-secondary">Close</button>
          <button type="button" onClick={onUse}
            className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover">
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}
