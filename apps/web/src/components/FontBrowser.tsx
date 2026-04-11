/**
 * FontBrowser — searchable, categorized Google Fonts picker.
 *
 * Replaces the simple 24-font dropdown with a full browser for all
 * 1900+ Google Fonts. Features:
 *
 * - "Recommended" section at top (the 24 curated fonts)
 * - Category filter: All / Sans Serif / Serif / Display / Handwriting / Monospace
 * - Real-time search across all fonts
 * - Font preview: each font name rendered in its own typeface
 * - Lazy font loading: preview CSS only loaded for visible fonts
 * - Virtual scrolling for performance
 * - Font pairing suggestions shown below when dropdown is closed
 *
 * Font preview loading strategy:
 * When a batch of fonts scrolls into view, we inject a single <link>
 * tag that loads those fonts from Google Fonts CDN. This means we only
 * download font CSS for fonts the user actually sees — not all 1900+.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { FONT_LIST } from '@monet/shared';
import { GOOGLE_FONTS_CATALOG, type FontCategory } from '../lib/google-fonts-catalog';
import { getFontPairings } from '../lib/font-pairing';
import { engine } from './Canvas';

interface FontBrowserProps {
  fontFamily: string;
}

// Category labels for the filter dropdown
const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'display', label: 'Display' },
  { value: 'handwriting', label: 'Handwriting' },
  { value: 'monospace', label: 'Monospace' },
];

// Build a category lookup from the catalog
const CATEGORY_MAP = new Map<string, FontCategory>();
for (const [family, category] of GOOGLE_FONTS_CATALOG) {
  CATEGORY_MAP.set(family, category);
}

/** Row height in the virtual scroll list */
const ROW_HEIGHT = 36;

/** How many extra rows to render above/below the viewport */
const BUFFER_ROWS = 6;

/** How many fonts to load per preview batch */
const PREVIEW_BATCH_SIZE = 20;

// Track which fonts have had their preview CSS injected
const previewLoaded = new Set<string>();
// Track which link IDs have been injected
const injectedLinks = new Set<string>();

/** Recently used fonts — tracked in localStorage */
const RECENT_FONTS_KEY = 'monet-recent-fonts';
const MAX_RECENT_FONTS = 8;

function getRecentFonts(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_FONTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function addRecentFont(family: string): void {
  const recent = getRecentFonts().filter((f) => f !== family);
  recent.unshift(family);
  if (recent.length > MAX_RECENT_FONTS) recent.pop();
  localStorage.setItem(RECENT_FONTS_KEY, JSON.stringify(recent));
}

/**
 * Inject a Google Fonts CSS link for a batch of fonts (for preview).
 * Uses the CSS API v2 which doesn't require an API key.
 */
function loadFontPreviewBatch(fonts: string[]): void {
  const toLoad = fonts.filter((f) => !previewLoaded.has(f));
  if (toLoad.length === 0) return;

  // Build a unique ID from all font names in this batch
  const linkId = 'gfp-' + toLoad.map((f) => f.replace(/[^a-zA-Z0-9]/g, '')).join('-');
  if (injectedLinks.has(linkId)) return;
  injectedLinks.add(linkId);

  const families = toLoad.map((f) => `family=${f.replace(/ /g, '+')}`).join('&');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.appendChild(link);

  for (const f of toLoad) {
    previewLoaded.add(f);
  }
}

export function FontBrowser({ fontFamily }: FontBrowserProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [scrollTop, setScrollTop] = useState(0);
  const [recentFonts, setRecentFonts] = useState<string[]>(getRecentFonts);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  // Reset scroll when search/category changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [search, category]);

  // Build the filtered font list
  const fontList = useMemo(() => {
    const q = search.toLowerCase().trim();
    const filterCat = category !== 'all' ? category : null;

    // Filter the full catalog
    let catalogFiltered = GOOGLE_FONTS_CATALOG.filter(([family, cat]) => {
      if (filterCat && cat !== filterCat) return false;
      if (q && !family.toLowerCase().includes(q)) return false;
      return true;
    });

    // Build recommended list (matching same filters)
    const recommended: string[] = (FONT_LIST as readonly string[]).filter((f) => {
      if (filterCat) {
        const cat = CATEGORY_MAP.get(f);
        if (cat && cat !== filterCat) return false;
      }
      if (q && !f.toLowerCase().includes(q)) return false;
      return true;
    });

    // Remove recommended fonts from the catalog list to avoid duplicates
    const recommendedSet = new Set(recommended);
    catalogFiltered = catalogFiltered.filter(([f]) => !recommendedSet.has(f));

    return { recommended, catalog: catalogFiltered };
  }, [search, category]);

  // Full list: recently used + recommended + all fonts — flat list for virtual scrolling
  const flatList = useMemo(() => {
    const items: FlatItem[] = [];
    const q = search.toLowerCase().trim();

    // Recently used (only if not searching or search matches)
    const filteredRecent = recentFonts.filter((f) => !q || f.toLowerCase().includes(q));
    if (filteredRecent.length > 0) {
      items.push({ type: 'header', label: 'Recently Used' });
      for (const f of filteredRecent) {
        items.push({ type: 'font', family: f, isRecommended: false });
      }
    }

    if (fontList.recommended.length > 0) {
      items.push({ type: 'header', label: 'Recommended' });
      for (const f of fontList.recommended) {
        items.push({ type: 'font', family: f, isRecommended: true });
      }
    }

    if (fontList.catalog.length > 0) {
      items.push({ type: 'header', label: `All Fonts (${fontList.catalog.length})` });
      for (const [f] of fontList.catalog) {
        items.push({ type: 'font', family: f, isRecommended: false });
      }
    }

    return items;
  }, [fontList, recentFonts, search]);

  // Virtual scrolling
  const totalHeight = flatList.length * ROW_HEIGHT;
  const viewportHeight = scrollRef.current?.clientHeight ?? 300;
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS);
  const endIdx = Math.min(flatList.length, Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + BUFFER_ROWS);
  const visibleItems = flatList.slice(startIdx, endIdx);

  // Load font previews for visible fonts
  useEffect(() => {
    if (!open) return;
    const visibleFonts = visibleItems
      .filter((item): item is FontItem => item.type === 'font')
      .map((item) => item.family);

    if (visibleFonts.length > 0) {
      // Load in batches
      for (let i = 0; i < visibleFonts.length; i += PREVIEW_BATCH_SIZE) {
        const batch = visibleFonts.slice(i, i + PREVIEW_BATCH_SIZE);
        loadFontPreviewBatch(batch);
      }
    }
  }, [open, startIdx, endIdx, visibleItems]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop);
  }, []);

  const handleSelect = useCallback((family: string) => {
    engine.updateSelectedTextProps({ fontFamily: family });
    addRecentFont(family);
    setRecentFonts(getRecentFonts());
    setOpen(false);
    setSearch('');
  }, []);

  const pairings = getFontPairings(fontFamily);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-xs font-medium text-text-secondary">Font</label>

      {/* Trigger button — shows current font in its own typeface */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded border border-border px-2 py-1.5 text-left text-sm"
        style={{ fontFamily: `"${fontFamily}", sans-serif` }}
        aria-label="Font family"
      >
        <span className="truncate">{fontFamily}</span>
        <span className="ml-1 text-[10px] text-text-tertiary">{open ? '\u25B2' : '\u25BC'}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
          style={{ height: 360 }}>

          {/* Search + Category filter */}
          <div className="border-b border-border p-1.5">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search 1900+ fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-1 w-full rounded border border-border bg-canvas px-2 py-1 text-xs"
              aria-label="Search fonts"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded border border-border bg-canvas px-1 py-0.5 text-[11px]"
              aria-label="Filter by category"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Virtual scroll font list */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-y-auto"
            style={{ height: 360 - 74 }}
          >
            {flatList.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-text-tertiary">No fonts found</p>
            ) : (
              <div style={{ height: totalHeight, position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: startIdx * ROW_HEIGHT,
                    left: 0,
                    right: 0,
                  }}
                >
                  {visibleItems.map((item) => {
                    if (item.type === 'header') {
                      return (
                        <div
                          key={`h-${item.label}`}
                          className="flex items-center px-3 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
                          style={{ height: ROW_HEIGHT }}
                        >
                          {item.label}
                        </div>
                      );
                    }

                    const isSelected = item.family === fontFamily;
                    return (
                      <button
                        key={item.family}
                        type="button"
                        onClick={() => handleSelect(item.family)}
                        className={`flex w-full items-center gap-2 px-3 text-left text-sm hover:bg-accent-subtle ${
                          isSelected
                            ? 'bg-accent-subtle text-accent'
                            : 'text-text-primary'
                        }`}
                        style={{
                          height: ROW_HEIGHT,
                          fontFamily: `"${item.family}", sans-serif`,
                        }}
                      >
                        <span className="flex-1 truncate">{item.family}</span>
                        {item.isRecommended && (
                          <span className="shrink-0 rounded bg-accent-subtle px-1 text-[8px] font-medium text-accent">
                            REC
                          </span>
                        )}
                        <span className="shrink-0 text-[9px] text-text-tertiary">
                          {CATEGORY_MAP.get(item.family) ?? ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Font pairing suggestions — shown when dropdown is closed */}
      {!open && pairings.length > 0 && (
        <div className="mt-1.5">
          <span className="text-[9px] text-text-tertiary">Pairs well with:</span>
          <div className="mt-0.5 flex flex-wrap gap-1">
            {pairings.map((font) => (
              <button key={font} type="button" onClick={() => handleSelect(font)}
                className="rounded bg-wash px-1.5 py-0.5 text-[10px] text-text-secondary hover:bg-accent-subtle hover:text-accent">
                {font}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Types for the flat list ──────────────────────────────────────

type FlatItem = HeaderItem | FontItem;

interface HeaderItem {
  type: 'header';
  label: string;
}

interface FontItem {
  type: 'font';
  family: string;
  isRecommended: boolean;
}
