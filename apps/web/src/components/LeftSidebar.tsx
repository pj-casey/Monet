/**
 * LeftSidebar — the main content panel on the left side of the editor.
 *
 * Restructured as a single wide panel (~280px) with labeled tabs at the top:
 *   Design | Elements | Text | Upload | AI
 *
 * - **Design** tab: templates, brand kits, resize
 * - **Elements** tab: shapes + icons + illustrations + stock photos with unified search
 * - **Text** tab: text presets + font browser
 * - **Upload** tab: file upload zone
 * - **AI** tab: AI assistant panel
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useEditorStore } from '../stores/editor-store';
import type { EditorTool } from '../stores/editor-store';
import type { ShapeType } from '@monet/shared';
import { engine } from './Canvas';
import { BrandKitPanel } from './BrandKitPanel';
import { PluginsPanel } from './PluginsPanel';
import { AIAssistantPanel } from './AIAssistantPanel';
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

export type SidebarTab = 'design' | 'elements' | 'text' | 'upload' | 'ai';

interface LeftSidebarProps {
  onOpenTemplates?: () => void;
  onOpenResize?: () => void;
  onSaveAsTemplate?: () => void;
}

export function LeftSidebar({ onOpenTemplates, onOpenResize, onSaveAsTemplate }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('elements');
  return (
    <div className="flex h-full w-[280px] flex-col border-r border-border bg-surface shadow-sm">
      {/* Tab bar */}
      <div className="flex border-b border-border px-1">
        <SidebarTabBtn active={activeTab === 'design'} onClick={() => setActiveTab('design')}>Design</SidebarTabBtn>
        <SidebarTabBtn active={activeTab === 'elements'} onClick={() => setActiveTab('elements')}>Elements</SidebarTabBtn>
        <SidebarTabBtn active={activeTab === 'text'} onClick={() => setActiveTab('text')}>Text</SidebarTabBtn>
        <SidebarTabBtn active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>Upload</SidebarTabBtn>
        <SidebarTabBtn active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>AI</SidebarTabBtn>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'design' && (
          <DesignTab
            onOpenTemplates={onOpenTemplates}
            onOpenResize={onOpenResize}
            onSaveAsTemplate={onSaveAsTemplate}
          />
        )}
        {activeTab === 'elements' && <ElementsTab />}
        {activeTab === 'text' && <TextTab />}
        {activeTab === 'upload' && <UploadTab />}
        {activeTab === 'ai' && <AITab />}
      </div>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────

function SidebarTabBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border-b-2 py-2.5 text-xs font-medium transition-colors ${
        active
          ? 'border-accent text-accent'
          : 'border-transparent text-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DESIGN TAB — templates, brand kits, resize
// ═══════════════════════════════════════════════════════════════════

function DesignTab({ onOpenTemplates, onOpenResize, onSaveAsTemplate }: {
  onOpenTemplates?: () => void;
  onOpenResize?: () => void;
  onSaveAsTemplate?: () => void;
}) {
  const [section, setSection] = useState<'main' | 'brand' | 'plugins'>('main');

  if (section === 'brand') {
    return (
      <div className="flex h-full flex-col">
        <button type="button" onClick={() => setSection('main')}
          className="flex items-center gap-1 border-b border-border px-3 py-2 text-xs text-accent hover:bg-canvas">
          &larr; Back
        </button>
        <div className="flex-1 overflow-y-auto">
          <BrandKitPanelInline />
        </div>
      </div>
    );
  }

  if (section === 'plugins') {
    return (
      <div className="flex h-full flex-col">
        <button type="button" onClick={() => setSection('main')}
          className="flex items-center gap-1 border-b border-border px-3 py-2 text-xs text-accent hover:bg-canvas">
          &larr; Back
        </button>
        <div className="flex-1 overflow-y-auto [&>div]:!w-full [&>div]:!border-r-0">
          <PluginsPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto p-4">
      {onOpenTemplates && (
        <DesignActionBtn
          icon={<TemplateIcon />}
          label="Browse Templates"
          description="Start from a pre-made design"
          onClick={onOpenTemplates}
        />
      )}
      {onOpenResize && (
        <DesignActionBtn
          icon={<ResizeIcon />}
          label="Magic Resize"
          description="Resize to different formats"
          onClick={onOpenResize}
        />
      )}
      {onSaveAsTemplate && (
        <DesignActionBtn
          icon={<SaveTemplateIcon />}
          label="Save as Template"
          description="Reuse this design later"
          onClick={onSaveAsTemplate}
        />
      )}
      <DesignActionBtn
        icon={<BrandIcon />}
        label="Brand Kit"
        description="Colors, fonts, and logos"
        onClick={() => setSection('brand')}
      />
      <DesignActionBtn
        icon={<PluginsIcon />}
        label="Plugins"
        description="QR codes, charts, lorem ipsum"
        onClick={() => setSection('plugins')}
      />
    </div>
  );
}

function DesignActionBtn({ icon, label, description, onClick }: {
  icon: React.ReactNode; label: string; description: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-3.5 text-left transition-colors hover:bg-canvas/60"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="mt-0.5 text-[10px] text-text-tertiary">{description}</p>
      </div>
    </button>
  );
}

/** Inline version of BrandKitPanel that fits the full sidebar width */
function BrandKitPanelInline() {
  // BrandKitPanel has its own w-56 border-r wrapper that doesn't fit
  // our 280px sidebar. Override via a container that clips overflow and
  // lets the child stretch via CSS overrides.
  return (
    <div className="w-full overflow-hidden [&>div]:!w-full [&>div]:!border-r-0">
      <BrandKitPanel />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ELEMENTS TAB — shapes + icons + illustrations + photos with unified search
// ═══════════════════════════════════════════════════════════════════

type ElementSection = 'all' | 'shapes' | 'photos' | 'icons' | 'illus';

function ElementsTab() {
  const [section, setSection] = useState<ElementSection>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-full flex-col">
      {/* Search bar */}
      <div className="border-b border-border px-4 py-3">
        <input
          type="text"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs placeholder:text-text-tertiary focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent/30"
          aria-label="Search elements"
        />
      </div>

      {/* Section filter chips — scrollable so nothing clips */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-2.5 scrollbar-none">
        <FilterChip active={section === 'all'} onClick={() => setSection('all')}>All</FilterChip>
        <FilterChip active={section === 'shapes'} onClick={() => setSection('shapes')}>Shapes</FilterChip>
        <FilterChip active={section === 'icons'} onClick={() => setSection('icons')}>Icons</FilterChip>
        <FilterChip active={section === 'illus'} onClick={() => setSection('illus')}>Illus</FilterChip>
        <FilterChip active={section === 'photos'} onClick={() => setSection('photos')}>Photos</FilterChip>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {(section === 'all' || section === 'shapes') && (
          <ShapesSection collapsed={section !== 'shapes' && section !== 'all'} />
        )}
        {(section === 'all' || section === 'icons') && (
          <IconsSection query={searchQuery} fullHeight={section === 'icons'} />
        )}
        {(section === 'all' || section === 'illus') && (
          <IllustrationsSection query={searchQuery} />
        )}
        {(section === 'all' || section === 'photos') && (
          <PhotosSection query={searchQuery} />
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
        active
          ? 'bg-accent-subtle text-accent'
          : 'bg-wash text-text-secondary hover:bg-wash'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Shapes ───────────────────────────────────────────────────────

function ShapesSection(_props: { collapsed?: boolean }) {
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  const addShape = (type: ShapeType) => {
    engine.addShape({ type });
    setActiveTool('select');
  };

  return (
    <div className="mb-4">
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
        Shapes
      </h4>
      <div className="grid grid-cols-6 gap-1">
        <ShapeBtn label="Rectangle" onClick={() => addShape('rectangle')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><rect x="4" y="8" width="24" height="16" rx="2" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Circle" onClick={() => addShape('circle')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><circle cx="16" cy="16" r="11" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Triangle" onClick={() => addShape('triangle')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,4 28,28 4,28" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Line" onClick={() => addShape('line')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><line x1="4" y1="28" x2="28" y2="4" stroke="var(--text-secondary)" strokeWidth="2.5" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Arrow" onClick={() => addShape('arrow')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><line x1="4" y1="16" x2="22" y2="16" stroke="var(--text-secondary)" strokeWidth="2.5" /><polygon points="20,10 28,16 20,22" fill="var(--text-secondary)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Star" onClick={() => addShape('star')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,2 19.5,12 30,12 22,18 24.5,28 16,22 7.5,28 10,18 2,12 12.5,12" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Rounded Rectangle" onClick={() => addShape('rounded-rect')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><rect x="4" y="8" width="24" height="16" rx="6" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Diamond" onClick={() => addShape('diamond')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,3 29,16 16,29 3,16" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Pentagon" onClick={() => addShape('pentagon')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,3 29,12 25,27 7,27 3,12" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Hexagon" onClick={() => addShape('hexagon')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="24,5 30,16 24,27 8,27 2,16 8,5" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Heart" onClick={() => addShape('heart')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M16 28C16 28 3 20 3 11C3 6 7 3 11 3C13.5 3 16 5 16 5C16 5 18.5 3 21 3C25 3 29 6 29 11C29 20 16 28 16 28Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Arrow Right" onClick={() => addShape('arrow-right')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M4 11V21H18V26L28 16L18 6V11H4Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Speech Bubble" onClick={() => addShape('speech-bubble')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M5 4H27C28.1 4 29 4.9 29 6V20C29 21.1 28.1 22 27 22H12L6 28V22H5C3.9 22 3 21.1 3 20V6C3 4.9 3.9 4 5 4Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
      </div>

      {/* Drawing tools */}
      <div className="mt-2 flex gap-1">
        <DrawToolBtn tool="draw" label="Freehand Draw" />
        <DrawToolBtn tool="pen" label="Pen Tool" />
      </div>
    </div>
  );
}

function ShapeBtn({ label, onClick, children }: {
  label: string; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Add ${label}`}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-wash"
    >
      {children}
    </button>
  );
}

function DrawToolBtn({ tool, label }: { tool: EditorTool; label: string }) {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const isActive = activeTool === tool;

  // Enable/disable drawing or pen tool mode on the canvas engine
  useEffect(() => {
    if (tool === 'draw') {
      if (activeTool === 'draw') {
        engine.enableDrawing('#2d2a26', 4);
      } else {
        engine.disableDrawing();
      }
    }
    if (tool === 'pen') {
      if (activeTool === 'pen') {
        engine.enablePenTool();
      } else {
        engine.disablePenTool();
        if (engine.isEditPointsActive()) {
          engine.exitEditPoints();
        }
      }
    }
    // Cleanup on unmount — disable tool if component is removed while active
    return () => {
      if (tool === 'draw') engine.disableDrawing();
      if (tool === 'pen') { engine.disablePenTool(); if (engine.isEditPointsActive()) engine.exitEditPoints(); }
    };
  }, [activeTool, tool]);

  return (
    <button
      type="button"
      onClick={() => setActiveTool(isActive ? 'select' : tool)}
      aria-pressed={isActive}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
        isActive
          ? 'bg-accent-subtle text-accent'
          : 'bg-wash text-text-secondary hover:bg-wash'
      }`}
    >
      {tool === 'draw' ? <DrawIcon /> : <PenToolIcon />}
      {label}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────

const ICON_COLS = 6;
const ICON_CELL_SIZE = 44;

function IconsSection({ query, fullHeight }: { query: string; fullHeight?: boolean }) {
  const [loading, setLoading] = useState(!isLoaded());
  const [category, setCategory] = useState('All');
  const [, forceRender] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (isLoaded()) return;
    loadLucideIcons().then(() => {
      setLoading(false);
      forceRender((n) => n + 1);
    });
  }, []);

  const icons = useMemo(
    () => filterIcons(query, category),
    [query, category, loading], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const categories = getCategories();
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
    return <p className="py-4 text-center text-xs text-text-tertiary">Loading icons...</p>;
  }

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
          Icons ({icons.length})
        </h4>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-border px-1 py-0.5 text-[10px]"
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-y-auto"
        style={{ maxHeight: fullHeight ? '100%' : '240px' }}
        role="grid"
        aria-label="Icon grid"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ position: 'absolute', top: startRow * ICON_CELL_SIZE, left: 0, right: 0 }}>
            <div className="grid grid-cols-6 gap-1">
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

function IconPreview({ nodes }: { nodes: LucideIcon['nodes'] }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
      {nodes.map(([tag, attrs], i) => {
        switch (tag) {
          case 'path': return <path key={i} {...attrs} />;
          case 'circle': return <circle key={i} {...attrs} />;
          case 'rect': return <rect key={i} {...attrs} />;
          case 'line': return <line key={i} {...attrs} />;
          case 'polyline': return <polyline key={i} {...attrs} />;
          case 'ellipse': return <ellipse key={i} {...attrs} />;
          case 'polygon': return <polygon key={i} {...attrs} />;
          default: return null;
        }
      })}
    </svg>
  );
}

// ─── Illustrations ────────────────────────────────────────────────

function IllustrationsSection({ query }: { query: string }) {
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
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
          Illustrations ({illustrations.length})
        </h4>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-border px-1 py-0.5 text-[10px]"
          aria-label="Filter illustrations by category"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

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
            {/* Safe: illus.svg is our own bundled static SVG from illustrations.ts, not user input */}
            <div className="h-16 w-full" dangerouslySetInnerHTML={{ __html: illus.svg }} />
            <p className="truncate px-1 py-0.5 text-[9px] text-text-secondary">{illus.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Photos ───────────────────────────────────────────────────────

type PhotoSource = 'unsplash' | 'pexels';

interface NormalizedPhoto {
  id: string; thumb: string; regular: string; alt: string; credit: string;
  source: PhotoSource; unsplashPhoto?: UnsplashPhoto;
}

function normalizeUnsplash(photos: UnsplashPhoto[]): NormalizedPhoto[] {
  return photos.map((p) => ({
    id: `u-${p.id}`, thumb: p.urls.thumb, regular: p.urls.regular,
    alt: p.description || '', credit: p.user.name, source: 'unsplash' as const, unsplashPhoto: p,
  }));
}

function normalizePexels(photos: PexelsPhoto[]): NormalizedPhoto[] {
  return photos.map((p) => ({
    id: `p-${p.id}`, thumb: p.src.tiny, regular: p.src.large,
    alt: p.alt, credit: p.photographer, source: 'pexels' as const,
  }));
}

function PhotosSection({ query }: { query: string }) {
  const unsplashOk = isUnsplashConfigured();
  const pexelsOk = isPexelsConfigured();
  const hasAny = unsplashOk || pexelsOk;
  const defaultSource: PhotoSource = unsplashOk ? 'unsplash' : 'pexels';
  const [source, setSource] = useState<PhotoSource>(defaultSource);
  const [photos, setPhotos] = useState<NormalizedPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [localQuery, setLocalQuery] = useState('');

  const handleSearch = useCallback(async () => {
    const q = localQuery.trim() || query.trim();
    if (!q) return;
    setLoading(true);
    try {
      let results: NormalizedPhoto[] = [];
      if (source === 'unsplash' && unsplashOk) {
        const r = await searchPhotos(q);
        results = normalizeUnsplash(r.photos);
      } else if (source === 'pexels' && pexelsOk) {
        const r = await searchPexelsPhotos(q);
        results = normalizePexels(r.photos);
      }
      setPhotos(results);
      setSearched(true);
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [localQuery, query, source, unsplashOk, pexelsOk]);

  const handleInsert = useCallback(async (photo: NormalizedPhoto) => {
    if (photo.unsplashPhoto) trackDownload(photo.unsplashPhoto);
    await engine.addImageFromUrl(photo.regular);
  }, []);

  if (!hasAny) {
    return (
      <div className="mb-4 flex flex-col items-center py-6 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
          </svg>
        </div>
        <p className="mb-1 text-xs font-medium text-text-primary">Add stock photos</p>
        <p className="mb-4 max-w-[200px] text-[10px] leading-relaxed text-text-tertiary">
          Add your Unsplash or Pexels API key in Settings (toolbar menu) to browse free stock photos, or upload your own.
        </p>
        <label className="cursor-pointer rounded-sm bg-accent px-4 py-1.5 text-[10px] font-medium text-accent-fg hover:bg-accent-hover">
          Upload Image
          <input type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              for (let i = 0; i < files.length; i++) {
                if (files[i].type.startsWith('image/')) engine.addImageFromFile(files[i]);
              }
            }}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
        Stock Photos
      </h4>

      {unsplashOk && pexelsOk && (
        <div className="mb-2 flex rounded border border-border">
          <SourceBtn active={source === 'unsplash'} onClick={() => setSource('unsplash')}>Unsplash</SourceBtn>
          <SourceBtn active={source === 'pexels'} onClick={() => setSource('pexels')}>Pexels</SourceBtn>
        </div>
      )}

      <div className="mb-2 flex gap-1">
        <input
          type="text"
          placeholder={`Search ${source}...`}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          className="flex-1 rounded border border-border px-2 py-1 text-xs"
          aria-label={`Search ${source} photos`}
        />
        <button type="button" onClick={handleSearch}
          className="rounded bg-accent px-2 py-1 text-xs text-accent-fg hover:bg-accent-hover">Go</button>
      </div>

      {loading && <p className="text-center text-xs text-text-tertiary">Searching...</p>}
      {!loading && searched && photos.length === 0 && <p className="text-center text-xs text-text-tertiary">No photos found</p>}

      <div className="grid grid-cols-3 gap-1">
        {photos.map((photo) => (
          <button key={photo.id} type="button" onClick={() => handleInsert(photo)}
            className="group relative overflow-hidden rounded" aria-label={`Insert photo by ${photo.credit}`}>
            <img src={photo.thumb} alt={photo.alt} className="h-16 w-full object-cover" loading="lazy" />
            <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[7px] text-accent-fg opacity-0 group-hover:opacity-100">
              {photo.credit}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SourceBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 py-1 text-[10px] font-medium transition-colors ${
        active ? 'bg-accent text-accent-fg' : 'bg-transparent text-text-secondary hover:bg-canvas'
      }`}>
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TEXT TAB — text presets + font browser
// ═══════════════════════════════════════════════════════════════════

function TextTab() {
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  const addText = (preset: 'heading' | 'subheading' | 'body') => {
    const presets = {
      heading: { text: 'Heading', fontSize: 64, fontWeight: 'bold' as const },
      subheading: { text: 'Subheading', fontSize: 36, fontWeight: 'bold' as const },
      body: { text: 'Body text. Double-click to edit.', fontSize: 18, fontWeight: 'normal' as const },
    };
    engine.addText(presets[preset]);
    setActiveTool('select');
  };

  return (
    <div className="overflow-y-auto p-3">
      <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
        Add Text
      </h4>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => addText('heading')}
          className="rounded-lg border border-border px-4 py-3 text-left transition-colors hover:border-accent hover:bg-accent-subtle"
          aria-label="Add heading text"
        >
          <span className="text-xl font-bold text-text-primary">Add a heading</span>
        </button>

        <button
          type="button"
          onClick={() => addText('subheading')}
          className="rounded-lg border border-border px-4 py-2.5 text-left transition-colors hover:border-accent hover:bg-accent-subtle"
          aria-label="Add subheading text"
        >
          <span className="text-base font-bold text-text-primary">Add a subheading</span>
        </button>

        <button
          type="button"
          onClick={() => addText('body')}
          className="rounded-lg border border-border px-4 py-2 text-left transition-colors hover:border-accent hover:bg-accent-subtle"
          aria-label="Add body text"
        >
          <span className="text-sm text-text-secondary">Add body text</span>
        </button>
      </div>

      <p className="mt-4 text-[10px] text-text-tertiary">
        Tip: Double-click the canvas to add text at any position.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// UPLOAD TAB — file upload zone
// ═══════════════════════════════════════════════════════════════════

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
    <div className="flex h-full flex-col items-center justify-center p-6">
      <label className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border-strong p-8 text-center transition-colors hover:border-accent hover:bg-accent-subtle">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
          <path d="M8 10V2M8 2L5 5M8 2l3 3" /><path d="M2 10v3a1 1 0 001 1h10a1 1 0 001-1v-3" />
        </svg>
        <div>
          <span className="text-sm font-medium text-text-secondary">Click to upload</span>
          <p className="mt-1 text-[10px] text-text-tertiary">PNG, JPG, SVG, WebP, GIF</p>
        </div>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </label>
      <p className="mt-4 text-xs text-text-tertiary">Or drag files directly onto the canvas</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AI TAB — wraps the existing AI assistant panel
// ═══════════════════════════════════════════════════════════════════

function AITab() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <AIAssistantPanel />
    </div>
  );
}

// ─── SVG icons ────────────────────────────────────────────────────

function TemplateIcon() {
  return <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><path d="M12 10v4M10 12h4"/></svg>;
}

function ResizeIcon() {
  return <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="10" height="10" rx="1"/><path d="M13 6v9H6" /><path d="M10 10l5 5"/></svg>;
}

function SaveTemplateIcon() {
  return <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2h9l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M5 2v4h5V2"/><rect x="4" y="9" width="8" height="5" rx="0.5"/></svg>;
}

function BrandIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="6" r="4" /><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>;
}

function PluginsIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="10" y="3" width="5" height="5" rx="1" /><rect x="3" y="10" width="5" height="5" rx="1" /><circle cx="12.5" cy="12.5" r="2.5" /></svg>;
}

function DrawIcon() {
  return <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 15l3-1L14.5 5.5a1.4 1.4 0 00-2-2L4 12z" /><path d="M11.5 4.5l2 2" /></svg>;
}

function PenToolIcon() {
  return <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 15 Q5 10 9 9 Q13 8 15 3" /><circle cx="3" cy="15" r="1.5" fill="currentColor" /><circle cx="9" cy="9" r="1.5" fill="currentColor" /><circle cx="15" cy="3" r="1.5" fill="currentColor" /></svg>;
}
