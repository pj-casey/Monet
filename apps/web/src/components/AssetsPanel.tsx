/**
 * AssetsPanel — unified panel for stock photos, icons, illustrations, and uploads.
 *
 * Four tabs:
 * 1. Photos — search Unsplash and/or Pexels for free stock photos
 * 2. Icons — full Lucide icon set (~1937 icons), lazy-loaded with
 *    virtual scrolling, search, and category filtering
 * 3. Illus — original SVG illustrations, searchable by category
 * 4. Upload — file picker for user images
 *
 * Clicking any asset inserts it onto the canvas center.
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { engine } from './Canvas';
import { searchPhotos, trackDownload, isUnsplashConfigured, type UnsplashPhoto } from '../lib/unsplash';
import { searchPexelsPhotos, isPexelsConfigured, type PexelsPhoto } from '../lib/pexels';
import {
  loadLucideIcons,
  filterIcons,
  getCategories,
  isLoaded,
  buildSvgString,
  type LucideIcon,
} from '../lib/lucide-icons';
import {
  filterIllustrations,
  getIllustrationCategories,
  type Illustration,
} from '../lib/illustrations';
import { useEditorStore } from '../stores/editor-store';

type AssetTab = 'photos' | 'icons' | 'illus' | 'upload';

export function AssetsPanel() {
  const [tab, setTab] = useState<AssetTab>('icons');

  return (
    <div className="flex w-64 flex-col border-r border-border bg-surface">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        <TabBtn active={tab === 'photos'} onClick={() => setTab('photos')}>Photos</TabBtn>
        <TabBtn active={tab === 'icons'} onClick={() => setTab('icons')}>Icons</TabBtn>
        <TabBtn active={tab === 'illus'} onClick={() => setTab('illus')}>Illus</TabBtn>
        <TabBtn active={tab === 'upload'} onClick={() => setTab('upload')}>Upload</TabBtn>
      </div>

      {/* Content — Icons tab manages its own scrolling (virtual scroll),
          so we use overflow-hidden when icons are active, overflow-y-auto otherwise */}
      <div className={`flex-1 p-2 ${tab === 'icons' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'}`}>
        {tab === 'photos' && <PhotosTab />}
        {tab === 'icons' && <IconsTab />}
        {tab === 'illus' && <IllustrationsTab />}
        {tab === 'upload' && <UploadTab />}
      </div>
    </div>
  );
}

// ─── Photos Tab (Unsplash + Pexels) ──────────────────────────────

type PhotoSource = 'unsplash' | 'pexels';

/** Normalized photo — common shape for both Unsplash and Pexels results */
interface NormalizedPhoto {
  id: string;
  thumb: string;
  regular: string;
  alt: string;
  credit: string;
  source: PhotoSource;
  /** Original Unsplash photo (for download tracking) */
  unsplashPhoto?: UnsplashPhoto;
}

function normalizeUnsplash(photos: UnsplashPhoto[]): NormalizedPhoto[] {
  return photos.map((p) => ({
    id: `u-${p.id}`,
    thumb: p.urls.thumb,
    regular: p.urls.regular,
    alt: p.description || '',
    credit: p.user.name,
    source: 'unsplash' as const,
    unsplashPhoto: p,
  }));
}

function normalizePexels(photos: PexelsPhoto[]): NormalizedPhoto[] {
  return photos.map((p) => ({
    id: `p-${p.id}`,
    thumb: p.src.tiny,
    regular: p.src.large,
    alt: p.alt,
    credit: p.photographer,
    source: 'pexels' as const,
  }));
}

function PhotosTab() {
  const unsplashOk = isUnsplashConfigured();
  const pexelsOk = isPexelsConfigured();
  const hasAny = unsplashOk || pexelsOk;

  // Default to whichever is configured; prefer unsplash
  const defaultSource: PhotoSource = unsplashOk ? 'unsplash' : 'pexels';
  const [source, setSource] = useState<PhotoSource>(defaultSource);
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<NormalizedPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Clear results when switching photo sources
  useEffect(() => {
    setPhotos([]);
    setSearched(false);
  }, [source]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      let results: NormalizedPhoto[] = [];
      if (source === 'unsplash' && unsplashOk) {
        const r = await searchPhotos(query);
        results = normalizeUnsplash(r.photos);
      } else if (source === 'pexels' && pexelsOk) {
        const r = await searchPexelsPhotos(query);
        results = normalizePexels(r.photos);
      }
      setPhotos(results);
      setSearched(true);
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [query, source, unsplashOk, pexelsOk]);

  const handleInsert = useCallback(async (photo: NormalizedPhoto) => {
    // Track download for Unsplash (required by their API guidelines)
    if (photo.unsplashPhoto) {
      trackDownload(photo.unsplashPhoto);
    }
    await engine.addImageFromUrl(photo.regular);
  }, []);

  if (!hasAny) {
    return (
      <div className="p-2 text-center text-xs text-text-tertiary">
        <p className="mb-2 font-medium">No photo service configured</p>
        <p>Add API keys to <code className="rounded bg-wash px-1">.env</code>:</p>
        <p className="mt-1 font-mono text-[10px]">VITE_UNSPLASH_ACCESS_KEY=your_key</p>
        <p className="font-mono text-[10px]">VITE_PEXELS_API_KEY=your_key</p>
        <p className="mt-2 text-[10px]">
          Free keys: <span className="text-accent">unsplash.com/developers</span>
          {' / '}
          <span className="text-accent">pexels.com/api/new</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Source toggle — only show if both are configured */}
      {unsplashOk && pexelsOk && (
        <div className="mb-2 flex rounded border border-border">
          <SourceBtn active={source === 'unsplash'} onClick={() => setSource('unsplash')}>Unsplash</SourceBtn>
          <SourceBtn active={source === 'pexels'} onClick={() => setSource('pexels')}>Pexels</SourceBtn>
        </div>
      )}

      {/* Show which source is active if only one configured */}
      {!(unsplashOk && pexelsOk) && (
        <p className="mb-1 text-[10px] text-text-tertiary">
          Source: {unsplashOk ? 'Unsplash' : 'Pexels'}
        </p>
      )}

      {/* Search */}
      <div className="mb-2 flex gap-1">
        <input
          type="text"
          placeholder={`Search ${source === 'unsplash' ? 'Unsplash' : 'Pexels'}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          className="flex-1 rounded border border-border px-2 py-1 text-xs"
          aria-label={`Search ${source} photos`}
        />
        <button type="button" onClick={handleSearch}
          className="rounded bg-accent px-2 py-1 text-xs text-accent-fg hover:bg-accent-hover">
          Go
        </button>
      </div>

      {loading && <p className="text-center text-xs text-text-tertiary">Searching...</p>}

      {!loading && searched && photos.length === 0 && (
        <p className="text-center text-xs text-text-tertiary">No photos found</p>
      )}

      <div className="grid grid-cols-2 gap-1">
        {photos.map((photo) => (
          <button key={photo.id} type="button" onClick={() => handleInsert(photo)}
            className="group relative overflow-hidden rounded"
            aria-label={`Insert photo by ${photo.credit}`}
          >
            <img src={photo.thumb} alt={photo.alt} className="h-20 w-full object-cover" loading="lazy" />
            <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[8px] text-accent-fg opacity-0 group-hover:opacity-100">
              {photo.credit}
            </span>
          </button>
        ))}
      </div>

      {/* Attribution */}
      {searched && photos.length > 0 && (
        <p className="mt-2 text-center text-[8px] text-text-tertiary">
          Photos by {source === 'unsplash' ? 'Unsplash' : 'Pexels'}
        </p>
      )}
    </div>
  );
}

/** Source toggle button */
function SourceBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 py-1 text-[10px] font-medium transition-colors ${
        active
          ? 'bg-accent text-accent-fg'
          : 'bg-transparent text-text-secondary hover:bg-canvas'
      }`}>
      {children}
    </button>
  );
}

// ─── Icons Tab (Lucide — full set, lazy-loaded, virtual scroll) ───

/** Grid config */
const ICON_COLS = 5;
const ICON_CELL_SIZE = 44; // px — height of each row (icon button + gap)

function IconsTab() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(!isLoaded());
  const [, forceRender] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Load icons on first mount (lazy — only fetches the lucide package now)
  useEffect(() => {
    if (isLoaded()) return;
    loadLucideIcons().then(() => {
      setLoading(false);
      forceRender((n) => n + 1);
    });
  }, []);

  // Filtered icon list
  const icons = useMemo(
    () => filterIcons(query, category),
    [query, category, loading], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const categories = getCategories();

  // Virtual scrolling math
  const totalRows = Math.ceil(icons.length / ICON_COLS);
  const totalHeight = totalRows * ICON_CELL_SIZE;
  const viewportHeight = scrollRef.current?.clientHeight ?? 400;
  const bufferRows = 4;
  const startRow = Math.max(0, Math.floor(scrollTop / ICON_CELL_SIZE) - bufferRows);
  const endRow = Math.min(totalRows, Math.ceil((scrollTop + viewportHeight) / ICON_CELL_SIZE) + bufferRows);
  const visibleIcons = icons.slice(startRow * ICON_COLS, endRow * ICON_COLS);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop);
  }, []);

  const handleInsert = useCallback((icon: LucideIcon) => {
    const svg = buildSvgString(icon.nodes);
    engine.addSvgFromString(svg);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-xs text-text-tertiary">Loading icons...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <input
        type="text"
        placeholder="Search 1900+ icons..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-1 w-full rounded border border-border px-2 py-1 text-xs"
        aria-label="Search icons"
      />

      {/* Category filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-2 w-full rounded border border-border px-1 py-1 text-xs"
        aria-label="Filter by category"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Result count */}
      <p className="mb-1 text-[10px] text-text-tertiary">
        {icons.length} icon{icons.length !== 1 ? 's' : ''}
        {category !== 'All' ? ` in ${category}` : ''}
      </p>

      {/* Virtual scrolling grid */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        role="grid"
        aria-label="Icon grid"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: startRow * ICON_CELL_SIZE,
              left: 0,
              right: 0,
            }}
          >
            <div className="grid grid-cols-5 gap-1">
              {visibleIcons.map((icon) => (
                <button
                  key={icon.key}
                  type="button"
                  onClick={() => handleInsert(icon)}
                  title={icon.name}
                  className="flex h-10 w-10 items-center justify-center rounded hover:bg-wash"
                  aria-label={`Insert ${icon.name} icon`}
                >
                  <IconPreview nodes={icon.nodes} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a Lucide icon preview as inline SVG.
 *
 * Supports all SVG element types: path, circle, rect, line,
 * polyline, ellipse, polygon.
 */
function IconPreview({ nodes }: { nodes: LucideIcon['nodes'] }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-secondary"
    >
      {nodes.map(([tag, attrs], i) => {
        switch (tag) {
          case 'path':
            return <path key={i} {...attrs} />;
          case 'circle':
            return <circle key={i} {...attrs} />;
          case 'rect':
            return <rect key={i} {...attrs} />;
          case 'line':
            return <line key={i} {...attrs} />;
          case 'polyline':
            return <polyline key={i} {...attrs} />;
          case 'ellipse':
            return <ellipse key={i} {...attrs} />;
          case 'polygon':
            return <polygon key={i} {...attrs} />;
          default:
            return null;
        }
      })}
    </svg>
  );
}

// ─── Illustrations Tab ────────────────────────────────────────────

function IllustrationsTab() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const illustrations = useMemo(
    () => filterIllustrations(query, category),
    [query, category],
  );

  const categories = getIllustrationCategories();

  const handleInsert = useCallback((illus: Illustration) => {
    engine.addIllustration(illus.svg);
  }, []);

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search illustrations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-1 w-full rounded border border-border px-2 py-1 text-xs"
        aria-label="Search illustrations"
      />

      {/* Category filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-2 w-full rounded border border-border px-1 py-1 text-xs"
        aria-label="Filter illustrations by category"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Result count */}
      <p className="mb-1 text-[10px] text-text-tertiary">
        {illustrations.length} illustration{illustrations.length !== 1 ? 's' : ''}
        {category !== 'All' ? ` in ${category}` : ''}
      </p>

      {/* Illustration grid */}
      <div className="grid grid-cols-2 gap-2">
        {illustrations.map((illus) => (
          <button
            key={illus.id}
            type="button"
            onClick={() => handleInsert(illus)}
            title={illus.name}
            className="group overflow-hidden rounded-lg border border-border hover:border-accent hover:shadow-sm"
            aria-label={`Insert ${illus.name} illustration`}
          >
            <div
              className="h-20 w-full"
              dangerouslySetInnerHTML={{ __html: illus.svg }}
            />
            <p className="truncate px-1 py-0.5 text-[9px] text-text-secondary">
              {illus.name}
            </p>
          </button>
        ))}
      </div>

      {illustrations.length === 0 && (
        <p className="mt-4 text-center text-xs text-text-tertiary">No illustrations found</p>
      )}
    </div>
  );
}

// ─── Upload Tab ────────────────────────────────────────────────────

function UploadTab() {
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        await engine.addImageFromFile(files[i]);
      }
    }
    setActiveTool('select');
  }, [setActiveTool]);

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border-strong p-6 text-center hover:border-accent hover:bg-accent-subtle">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
          <path d="M8 10V2M8 2L5 5M8 2l3 3" /><path d="M2 10v3a1 1 0 001 1h10a1 1 0 001-1v-3" />
        </svg>
        <span className="text-xs text-text-secondary">Click to upload</span>
        <span className="text-[10px] text-text-tertiary">PNG, JPG, SVG, WebP, GIF</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </label>
      <p className="mt-2 text-center text-[10px] text-text-tertiary">Or drag files onto the canvas</p>
    </div>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 border-b-2 py-2 text-xs font-medium ${
        active
          ? 'border-accent text-accent'
          : 'border-transparent text-text-secondary hover:text-text-primary'
      }`}>
      {children}
    </button>
  );
}
