/**
 * WelcomeScreen — visual gallery that sells the product through template previews.
 *
 * Two modes:
 * 1. **New users**: Hero heading (Fraunces), AI prompt input, category filter pills,
 *    template thumbnail grid (masonry-style, actual aspect ratios).
 * 2. **Returning users**: "Welcome back" + horizontal scroll of saved designs,
 *    then the same AI input + template grid below.
 *
 * No rainbow gradient cards. Template thumbnails provide all the color.
 * Follows DESIGN.md tokens exclusively.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ArtboardPreset } from '@monet/shared';
import { TEMPLATE_REGISTRY } from '@monet/templates';
import type { Template } from '@monet/templates';
import { getAllDesigns, deleteDesign, type SavedDesign } from '../lib/db';
import { useEditorStore } from '../stores/editor-store';

// Lazy-load heavy modules — keeps Fabric.js and AI out of the initial bundle.
// renderTemplateThumbnail pulls in all of @monet/canvas-engine (Fabric.js ~430KB).
// generateDesign/isAIConfigured pull in the Anthropic API client.
const lazyThumbnail = () => import('@monet/canvas-engine').then((m) => m.renderTemplateThumbnail);
const lazyAI = () => import('../lib/ai-generate');

// ─── Thumbnail cache (persists across re-renders, cleared on page reload) ──
const thumbnailCache = new Map<string, string>();

// ─── Category mapping ─────────────────────────────────────────────

/** Maps welcome filter labels to template registry categories */
const CATEGORY_MAP: Record<string, string[]> = {
  'All': [],
  'Social Media': ['Podcast', 'Instagram Post', 'Instagram Story', 'YouTube Thumbnail', 'LinkedIn Post', 'Twitter Header', 'Pinterest Pin', 'TikTok Cover', 'Discord Banner'],
  'Business': ['Business Card', 'Invoice', 'One-Pager', 'Email Signature', 'Proposal', 'Certificate', 'Meeting Notes', 'Name Badge', 'Resume'],
  'Marketing': ['Product Launch', 'Real Estate', 'Coupon', 'Testimonial', 'Newsletter', 'App Promo'],
  'Events': ['Wedding', 'Birthday', 'Concert', 'Conference', 'Gala', 'Music Festival', 'Facebook Event'],
  'Education': ['Workshop', 'Flashcard', 'Study Guide'],
  'Creative': ['Book Cover', 'Movie Poster', 'Magazine Cover', 'Exhibition', 'Portfolio', 'Album Cover'],
  'Food & Lifestyle': ['Restaurant Menu', 'Café Menu', 'Recipe Card', 'Cocktail Card', 'Fitness Plan', 'Wellness'],
  'Seasonal': ['Valentine', 'Halloween', 'Holiday Card', 'New Year'],
};

const FILTER_LABELS = Object.keys(CATEGORY_MAP);

// ─── Props ────────────────────────────────────────────────────────

interface WelcomeScreenProps {
  onOpenDesign: (design: SavedDesign) => void;
  onNewDesign: () => void;
  onStartFromTemplate: (template: Template) => void;
  onStartBlank: (preset: ArtboardPreset) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSettings?: () => void;
}

export function WelcomeScreen({
  onOpenDesign, onNewDesign, onStartFromTemplate, onStartBlank,
  isDark, onToggleTheme, onOpenSettings,
}: WelcomeScreenProps) {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const setArtboardDimensions = useEditorStore((s) => s.setArtboardDimensions);
  const hasDesigns = designs.length > 0;

  // Load saved designs
  useEffect(() => {
    getAllDesigns().then((all) => {
      setDesigns(all);
      setLoading(false);
    });
  }, []);

  // ─── Thumbnail generation (batched, cached) ──────────────────────
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(thumbnailCache);
  const renderingRef = useRef(false);

  useEffect(() => {
    if (renderingRef.current) return;
    // Find templates that need thumbnails
    const toRender = TEMPLATE_REGISTRY.filter((t) => !thumbnailCache.has(t.templateId));
    if (toRender.length === 0) return;

    renderingRef.current = true;
    let cancelled = false;
    const BATCH_SIZE = 6;

    (async () => {
      // Dynamic import — Fabric.js only loads when we start rendering thumbnails
      const renderTemplateThumbnail = await lazyThumbnail();
      for (let i = 0; i < toRender.length; i += BATCH_SIZE) {
        if (cancelled) break;
        const batch = toRender.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
          batch.map(async (t) => {
            try {
              const dataUrl = await renderTemplateThumbnail(t.document);
              return { id: t.templateId, dataUrl };
            } catch {
              return { id: t.templateId, dataUrl: '' };
            }
          }),
        );
        // Update cache and state — skip if component unmounted
        if (cancelled) break;
        for (const r of results) {
          if (r.dataUrl) thumbnailCache.set(r.id, r.dataUrl);
        }
        setThumbnails(new Map(thumbnailCache));
      }
      renderingRef.current = false;
    })();

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter templates by category + search
  const filteredTemplates = useMemo(() => {
    let templates = TEMPLATE_REGISTRY;

    // Category filter
    if (activeFilter !== 'All') {
      const cats = CATEGORY_MAP[activeFilter];
      if (cats && cats.length > 0) {
        templates = templates.filter((t) => t.subcategory && cats.includes(t.subcategory));
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      templates = templates.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    return templates;
  }, [activeFilter, searchQuery]);

  // AI generation handler
  const handleAiGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    const { isAIConfigured, generateDesign } = await lazyAI();
    if (!isAIConfigured()) return;
    setAiLoading(true);
    setAiError('');
    try {
      const doc = await generateDesign(aiPrompt);
      setArtboardDimensions(doc.dimensions.width, doc.dimensions.height);
      // The engine might not be initialized yet (we're on welcome screen),
      // so use the same pendingDoc pattern as onStartFromTemplate
      onStartFromTemplate({
        templateId: 'ai-generated',
        name: doc.name || 'AI Design',
        description: aiPrompt,
        category: 'AI Generated',
        tags: [],
        dimensions: doc.dimensions,
        thumbnail: '',
        document: doc,
      } as Template);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to generate design.');
    } finally {
      setAiLoading(false);
    }
  }, [aiPrompt, setArtboardDimensions, onStartFromTemplate]);

  // Delete confirmation dialog state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteDesign = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirmId) return;
    await deleteDesign(deleteConfirmId);
    setDesigns((prev) => prev.filter((d) => d.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  }, [deleteConfirmId]);

  const formatDate = (iso: string): string => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch { return ''; }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-canvas">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="28" height="28" className="animate-pulse" />
        <p className="text-sm text-text-secondary">Loading your designs...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-canvas">
      {/* ─── Top Bar ─── */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border bg-surface px-6">
        <h1 className="flex items-center gap-2 font-display text-lg font-semibold text-text-primary">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="20" height="20" className="block" aria-hidden="true" />
          Monet
        </h1>
        <div className="flex items-center gap-3">
          {onOpenSettings && (
            <button type="button" onClick={onOpenSettings}
              className="flex h-8 w-8 items-center justify-center rounded-sm text-text-tertiary hover:bg-wash"
              aria-label="Settings">
              <SettingsGearIcon />
            </button>
          )}
          <button type="button" onClick={onToggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-text-tertiary hover:bg-wash"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <BlankCanvasButton onStartBlank={onStartBlank} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6">

          {/* ─── Returning Users: Saved Designs Row ─── */}
          {hasDesigns && (
            <section className="pb-8 pt-10">
              <h2 className="mb-5 font-display text-xl font-semibold text-text-primary">Welcome back</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {/* New design card */}
                <button type="button" onClick={onNewDesign}
                  className="flex h-32 w-28 flex-shrink-0 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border text-text-tertiary hover:border-accent hover:bg-accent-subtle hover:text-accent">
                  <span className="text-2xl">+</span>
                  <span className="text-[10px] font-medium">New design</span>
                </button>

                {designs.map((design) => (
                  <button key={design.id} type="button" onClick={() => onOpenDesign(design)}
                    className="group relative flex h-32 w-28 flex-shrink-0 flex-col overflow-hidden rounded-md bg-surface shadow-sm hover:shadow-md">
                    <div className="flex flex-1 items-center justify-center bg-wash">
                      {design.thumbnail ? (
                        <img src={design.thumbnail} alt={design.name} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-[9px] text-text-tertiary">No preview</span>
                      )}
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="truncate text-[10px] font-medium text-text-primary">{design.name}</p>
                      <p className="text-[9px] text-text-tertiary">{formatDate(design.updatedAt)}</p>
                    </div>
                    {/* Delete button on hover */}
                    <button type="button" onClick={(e) => handleDeleteDesign(design.id, e)}
                      className="absolute right-1 top-1 hidden rounded-sm bg-danger px-1 py-0.5 text-[8px] text-accent-fg group-hover:block"
                      aria-label="Delete">&times;</button>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ─── Hero (new users) / Section divider (returning users) ─── */}
          <section className={hasDesigns ? 'pb-6 pt-4' : 'pb-8 pt-16'}>
            {!hasDesigns && (
              <div className="mb-8 text-center">
                <h2 className="mb-3 font-display text-3xl font-semibold tracking-tight text-text-primary">
                  Design something beautiful.
                </h2>
                <p className="text-sm text-text-secondary">
                  Free and open-source. Powered by Claude.
                </p>
              </div>
            )}

            {hasDesigns && (
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-text-tertiary">Start fresh</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            )}

            {/* AI prompt input — always visible, inline connect when no key */}
            <div className="mx-auto mb-8 max-w-xl">
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-overlay px-4 py-3 shadow-lg focus-within:border-accent focus-within:shadow-xl">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-accent-subtle">
                  <SparkleIcon className="h-3.5 w-3.5 text-accent" />
                </span>
                {localStorage.getItem('monet-anthropic-key') ? (
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAiGenerate(); }}
                    placeholder="Describe a design and AI will create it..."
                    className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
                    disabled={aiLoading}
                  />
                ) : (
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm text-text-tertiary">Describe a design to generate with AI</span>
                    {onOpenSettings ? (
                      <button type="button" onClick={onOpenSettings}
                        className="ml-3 shrink-0 rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-fg hover:bg-accent-hover">
                        Connect Claude
                      </button>
                    ) : (
                      <span className="ml-3 text-xs text-text-tertiary">Add API key in Settings</span>
                    )}
                  </div>
                )}
                {aiLoading && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary">Generating...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  </div>
                )}
              </div>
              {aiError && <p className="mt-2 text-center text-xs text-danger">{aiError}</p>}
            </div>
          </section>

          {/* ─── Category Filter + Search ─── */}
          <section className="mb-6 flex flex-wrap items-center gap-2">
            {FILTER_LABELS.map((label) => (
              <button key={label} type="button"
                onClick={() => setActiveFilter(label)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  activeFilter === label
                    ? 'bg-accent text-accent-fg'
                    : 'bg-wash text-text-secondary hover:text-text-primary'
                }`}>
                {label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1">
              <SearchIcon />
              <input type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-24 bg-transparent text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none sm:w-36" />
            </div>
          </section>

          {/* ─── Template Grid ─── */}
          <section className="pb-16">
            {filteredTemplates.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-text-secondary">No templates match your search.</p>
                <button type="button" onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                  className="mt-2 text-sm text-accent hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredTemplates.map((template, i) => (
                  <TemplateCard
                    key={template.templateId}
                    template={template}
                    thumbnailUrl={thumbnails.get(template.templateId)}
                    onClick={() => onStartFromTemplate(template)}
                    isFirst={i === 0}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ─── Delete Confirmation Dialog ─── */}
      {deleteConfirmId && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
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

// ─── Template Card ────────────────────────────────────────────────

function TemplateCard({ template, thumbnailUrl, onClick, isFirst }: {
  template: Template; thumbnailUrl?: string; onClick: () => void; isFirst?: boolean;
}) {
  // Fallback background for skeleton loading state
  const bg = template.document.background;
  let fallbackBg: React.CSSProperties;
  if (bg.type === 'gradient' && bg.value.startsWith('linear:')) {
    const parts = bg.value.split(':');
    const direction = (parts[1] || 'to-bottom').replace(/-/g, ' ');
    const c1 = parts[2] || '#9a9088';
    const c2 = parts[3] || '#3d3830';
    fallbackBg = { background: `linear-gradient(${direction}, ${c1}, ${c2})` };
  } else {
    fallbackBg = { backgroundColor: bg.value || '#e5ddd5' };
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-md bg-surface shadow-sm transition-[transform,box-shadow] duration-200 hover:shadow-lg hover:scale-[1.03]"
    >
      {/* Preview area */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${template.dimensions.width} / ${template.dimensions.height}`,
          maxHeight: '260px',
          minHeight: '80px',
        }}
      >
        {thumbnailUrl ? (
          /* Fully rendered thumbnail */
          <img
            src={thumbnailUrl}
            alt={template.name}
            className="h-full w-full object-cover"
            loading={isFirst ? 'eager' : 'lazy'}
          />
        ) : (
          /* Skeleton: background color + shimmer animation */
          <div className="h-full w-full animate-pulse" style={fallbackBg} />
        )}
      </div>
      {/* Label */}
      <div className="px-2.5 py-2">
        <p className="truncate text-xs font-medium text-text-primary group-hover:text-accent">
          {template.name}
        </p>
        <p className="text-[10px] text-text-tertiary">{template.subcategory || template.category}</p>
      </div>
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 2l1.5 4.5L15 8l-4.5 1.5L9 14l-1.5-4.5L3 8l4.5-1.5z" />
    </svg>
  );
}

// ─── Blank Canvas with dimension presets + custom input ──────────

const CANVAS_PRESETS: { label: string; w: number; h: number }[] = [
  { label: 'Instagram Post', w: 1080, h: 1080 },
  { label: 'Instagram Story', w: 1080, h: 1920 },
  { label: 'LinkedIn Post', w: 1200, h: 628 },
  { label: 'Presentation', w: 1920, h: 1080 },
  { label: 'Twitter / X', w: 1600, h: 900 },
];

function BlankCanvasButton({ onStartBlank }: { onStartBlank: (preset: ArtboardPreset) => void }) {
  const [open, setOpen] = useState(false);
  const [customW, setCustomW] = useState('1080');
  const [customH, setCustomH] = useState('1080');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const createCustom = () => {
    const w = Math.max(1, Math.min(10000, parseInt(customW) || 1080));
    const h = Math.max(1, Math.min(10000, parseInt(customH) || 1080));
    onStartBlank({ name: `${w}x${h}`, category: 'Custom', width: w, height: h });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-wash hover:text-text-primary">
        + Blank canvas
      </button>

      {open && (
        <div className="animate-scale-up absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-overlay p-4 shadow-xl">
          <p className="mb-3 text-xs font-medium text-text-secondary">Choose a size</p>

          {/* Presets */}
          <div className="mb-3 flex flex-col gap-1">
            {CANVAS_PRESETS.map((p) => (
              <button key={p.label} type="button"
                onClick={() => { onStartBlank({ name: p.label, category: 'Social Media', width: p.w, height: p.h }); setOpen(false); }}
                className="flex items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-xs hover:bg-wash">
                <span className="font-medium text-text-primary">{p.label}</span>
                <span className="text-text-tertiary">{p.w} &times; {p.h}</span>
              </button>
            ))}
          </div>

          {/* Custom dimensions */}
          <div className="border-t border-border pt-3">
            <p className="mb-2 text-[10px] font-medium text-text-tertiary">Custom size (px)</p>
            <div className="flex items-center gap-2">
              <input type="number" value={customW} onChange={(e) => setCustomW(e.target.value)}
                min={1} max={10000}
                className="w-full rounded-sm border border-border bg-canvas px-2 py-1 text-xs tabular-nums text-text-primary focus:border-accent focus:outline-none"
                placeholder="Width"
                onKeyDown={(e) => { if (e.key === 'Enter') createCustom(); }}
              />
              <span className="text-text-tertiary">&times;</span>
              <input type="number" value={customH} onChange={(e) => setCustomH(e.target.value)}
                min={1} max={10000}
                className="w-full rounded-sm border border-border bg-canvas px-2 py-1 text-xs tabular-nums text-text-primary focus:border-accent focus:outline-none"
                placeholder="Height"
                onKeyDown={(e) => { if (e.key === 'Enter') createCustom(); }}
              />
            </div>
            <button type="button" onClick={createCustom}
              className="mt-2 w-full rounded-sm bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover">
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsGearIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
      <circle cx="7" cy="7" r="5" /><path d="M11 11l3.5 3.5" />
    </svg>
  );
}

function SunIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"/></svg>;
}

function MoonIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.5 8.5a5.5 5.5 0 01-6-6 5.5 5.5 0 106 6z"/></svg>;
}
