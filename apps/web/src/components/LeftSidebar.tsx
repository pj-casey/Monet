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

export type SidebarTab = 'templates' | 'elements' | 'text' | 'upload' | 'ai';

interface LeftSidebarProps {
  onOpenTemplates?: () => void;
  onOpenResize?: () => void;
  onSaveAsTemplate?: () => void;
  onOpenSettings?: () => void;
}

export function LeftSidebar({ onOpenTemplates, onOpenResize, onSaveAsTemplate, onOpenSettings }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('elements');
  return (
    <div className="flex h-full w-[280px] flex-col border-r border-border bg-surface shadow-sm">
      {/* Tab bar — all 5 tabs always visible, no scrolling */}
      <div className="flex border-b border-border px-1">
        <SidebarTabBtn icon={<TabTemplatesIcon />} active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>Templates</SidebarTabBtn>
        <SidebarTabBtn icon={<TabElementsIcon />} active={activeTab === 'elements'} onClick={() => setActiveTab('elements')}>Elements</SidebarTabBtn>
        <SidebarTabBtn icon={<TabTextIcon />} active={activeTab === 'text'} onClick={() => setActiveTab('text')}>Text</SidebarTabBtn>
        <SidebarTabBtn icon={<TabUploadIcon />} active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>Upload</SidebarTabBtn>
        <SidebarTabBtn icon={<TabAIIcon />} active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>AI</SidebarTabBtn>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'templates' && (
          <div className="animate-fade-in h-full">
            <DesignTab
              onOpenTemplates={onOpenTemplates}
              onOpenResize={onOpenResize}
              onSaveAsTemplate={onSaveAsTemplate}
            />
          </div>
        )}
        {activeTab === 'elements' && <div className="animate-fade-in h-full"><ElementsTab onOpenSettings={onOpenSettings} /></div>}
        {activeTab === 'text' && <div className="animate-fade-in h-full"><TextTab /></div>}
        {activeTab === 'upload' && <div className="animate-fade-in h-full"><UploadTab /></div>}
        {activeTab === 'ai' && <div className="animate-fade-in h-full"><AITab onOpenSettings={onOpenSettings} /></div>}
      </div>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────

function SidebarTabBtn({ icon, active, onClick, children }: {
  icon?: React.ReactNode; active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 flex-col items-center gap-0.5 border-b-2 py-2 text-[10px] font-medium transition-colors ${
        active
          ? 'border-accent text-accent'
          : 'border-transparent text-text-secondary hover:text-text-primary'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ─── Tab icons (14x14 SVGs) ──────────────────────────────────── */

function TabTemplatesIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="12" height="5" rx="1"/></svg>;
}
function TabElementsIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3.5"/><rect x="2" y="10" width="12" height="4" rx="1"/></svg>;
}
function TabTextIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h10M8 3v10M5.5 13h5"/></svg>;
}
function TabUploadIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v7M5 5l3-3 3 3"/><path d="M2 10v3a1 1 0 001 1h10a1 1 0 001-1v-3"/></svg>;
}
function TabAIIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1l1.5 3.5L13 6l-3.5 1.5L8 11 6.5 7.5 3 6l3.5-1.5z"/><path d="M12 10l.75 1.75L14.5 12.5l-1.75.75L12 15l-.75-1.75L9.5 12.5l1.75-.75z"/></svg>;
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
    <div className="flex flex-col overflow-y-auto p-3">
      {/* Primary: Browse Templates button */}
      {onOpenTemplates && (
        <button
          type="button"
          onClick={onOpenTemplates}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-accent-fg shadow-sm hover:bg-accent-hover"
        >
          <TemplateIcon /> Browse Templates
        </button>
      )}

      {/* Divider */}
      <div className="mb-2 border-b border-border pb-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">Tools</p>
      </div>

      {/* Secondary: tools */}
      <div className="space-y-1">
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

type ElementSection = 'all' | 'shapes' | 'photos' | 'icons' | 'illus' | 'frames';

function ElementsTab({ onOpenSettings }: { onOpenSettings?: () => void }) {
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
        <FilterChip active={section === 'frames'} onClick={() => setSection('frames')}>Frames</FilterChip>
        <FilterChip active={section === 'icons'} onClick={() => setSection('icons')}>Icons</FilterChip>
        <FilterChip active={section === 'illus'} onClick={() => setSection('illus')}>Illus</FilterChip>
        <FilterChip active={section === 'photos'} onClick={() => setSection('photos')}>Photos</FilterChip>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {(section === 'all' || section === 'shapes') && (
          <ShapesSection collapsed={section !== 'shapes' && section !== 'all'} />
        )}
        {(section === 'all' || section === 'frames') && (
          <FramesSection />
        )}
        {(section === 'all' || section === 'icons') && (
          <IconsSection query={searchQuery} fullHeight={section === 'icons'} />
        )}
        {(section === 'all' || section === 'illus') && (
          <IllustrationsSection query={searchQuery} />
        )}
        {(section === 'all' || section === 'photos') && (
          <PhotosSection query={searchQuery} onOpenSettings={onOpenSettings} />
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

// ─── Frames ───────────────────────────────────────────────────────

type FrameShapeId = 'circle' | 'rounded-rect' | 'star' | 'heart' | 'hexagon' | 'arch';

const FRAME_SHAPES: { id: FrameShapeId; label: string; preview: React.ReactNode }[] = [
  {
    id: 'circle', label: 'Circle',
    preview: <circle cx="32" cy="32" r="28" />,
  },
  {
    id: 'rounded-rect', label: 'Rounded Rect',
    preview: <rect x="4" y="4" width="56" height="56" rx="10" />,
  },
  {
    id: 'star', label: 'Star',
    preview: <polygon points="32,4 38,22 56,22 42,32 47,50 32,40 17,50 22,32 8,22 26,22" />,
  },
  {
    id: 'heart', label: 'Heart',
    preview: <path d="M32 52C32 52 8 38 8 22C8 14 14 8 22 8C26 8 32 12 32 12C32 12 38 8 42 8C50 8 56 14 56 22C56 38 32 52 32 52Z" />,
  },
  {
    id: 'hexagon', label: 'Hexagon',
    preview: <polygon points="48,8 58,32 48,56 16,56 6,32 16,8" />,
  },
  {
    id: 'arch', label: 'Arch',
    preview: <path d="M8 56 L8 28 C8 14 18 4 32 4 C46 4 56 14 56 28 L56 56 Z" />,
  },
];

function FramesSection() {
  return (
    <div className="mb-4">
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
        Image Frames
      </h4>
      <p className="mb-2 text-[10px] text-text-tertiary">
        Click to add a frame, then select it and add an image to fill it.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {FRAME_SHAPES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => engine.addFrame(f.id)}
            title={f.label}
            aria-label={`Add ${f.label} frame`}
            className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-wash"
          >
            <svg viewBox="0 0 64 64" className="h-12 w-12">
              <defs>
                <linearGradient id={`frame-grad-${f.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e8d5b7" />
                  <stop offset="100%" stopColor="#c4704a" />
                </linearGradient>
              </defs>
              <g fill={`url(#frame-grad-${f.id})`} stroke="var(--border-strong)" strokeWidth="1">
                {f.preview}
              </g>
            </svg>
            <span className="text-[9px] text-text-secondary">{f.label}</span>
          </button>
        ))}
      </div>
    </div>
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
    <div className="mb-4 space-y-1">
      {/* Basic */}
      <ShapeCategory label="Basic" defaultOpen>
        <ShapeBtn label="Rectangle" onClick={() => addShape('rectangle')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><rect x="4" y="8" width="24" height="16" rx="2" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Rounded Rect" onClick={() => addShape('rounded-rect')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><rect x="4" y="8" width="24" height="16" rx="6" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Circle" onClick={() => addShape('circle')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><circle cx="16" cy="16" r="11" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Triangle" onClick={() => addShape('triangle')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,4 28,28 4,28" fill="var(--accent)" /></svg>
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
        <ShapeBtn label="Line" onClick={() => addShape('line')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><line x1="4" y1="28" x2="28" y2="4" stroke="var(--text-secondary)" strokeWidth="2.5" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Arrow" onClick={() => addShape('arrow')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><line x1="4" y1="16" x2="22" y2="16" stroke="var(--text-secondary)" strokeWidth="2.5" /><polygon points="20,10 28,16 20,22" fill="var(--text-secondary)" /></svg>
        </ShapeBtn>
      </ShapeCategory>

      {/* Stars & Badges */}
      <ShapeCategory label="Stars & Badges">
        <ShapeBtn label="Star" onClick={() => addShape('star')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,2 19.5,12 30,12 22,18 24.5,28 16,22 7.5,28 10,18 2,12 12.5,12" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="4-Point Star" onClick={() => addShape('star-4')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,2 19,13 30,16 19,19 16,30 13,19 2,16 13,13" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="6-Point Star" onClick={() => addShape('star-6')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,2 20,10 29,6 24,14 30,22 22,20 16,30 10,20 2,22 8,14 3,6 12,10" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="8-Point Star" onClick={() => addShape('star-8')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,2 19,10 28,6 22,13 30,16 22,19 28,26 19,22 16,30 13,22 4,26 10,19 2,16 10,13 4,6 13,10" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Starburst" onClick={() => addShape('starburst')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><polygon points="16,1 18,11 27,5 21,13 31,13 23,17 31,21 21,19 27,27 18,21 16,31 14,21 5,27 11,19 1,21 9,17 1,13 11,13 5,5 14,11" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Badge" onClick={() => addShape('badge-circle')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><circle cx="16" cy="16" r="12" fill="var(--accent)" /><circle cx="16" cy="16" r="10" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2,1" /></svg>
        </ShapeBtn>
      </ShapeCategory>

      {/* Arrows */}
      <ShapeCategory label="Arrows">
        <ShapeBtn label="Arrow Right" onClick={() => addShape('arrow-right')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M4 11V21H18V26L28 16L18 6V11H4Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Arrow Left" onClick={() => addShape('arrow-left')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M28 11V21H14V26L4 16L14 6V11H28Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Arrow Up" onClick={() => addShape('arrow-up')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M11 28H21V14H26L16 4L6 14H11V28Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Arrow Down" onClick={() => addShape('arrow-down')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M11 4H21V18H26L16 28L6 18H11V4Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Double Arrow" onClick={() => addShape('arrow-double')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M2 16L9 9V13H23V9L30 16L23 23V19H9V23Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Curved Arrow" onClick={() => addShape('arrow-curved')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M5 26Q5 10 16 8V3L27 11L16 19V14Q10 15 9 26Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Chevron" onClick={() => addShape('chevron-right')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M8 4L22 16L8 28L13 16Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
      </ShapeCategory>

      {/* Callouts */}
      <ShapeCategory label="Callouts">
        <ShapeBtn label="Speech Bubble" onClick={() => addShape('speech-bubble')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M5 4H27C28.1 4 29 4.9 29 6V20C29 21.1 28.1 22 27 22H12L6 28V22H5C3.9 22 3 21.1 3 20V6C3 4.9 3.9 4 5 4Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Round Bubble" onClick={() => addShape('speech-bubble-round')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M16 4C24 4 29 9 29 15C29 21 24 26 16 26C14 26 12 25.5 11 25L6 29L7 24C4 22 3 18 3 15C3 9 8 4 16 4Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Thought Bubble" onClick={() => addShape('thought-bubble')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><ellipse cx="16" cy="13" rx="13" ry="10" fill="var(--accent)" /><circle cx="9" cy="25" r="2.5" fill="var(--accent)" /><circle cx="5" cy="29" r="1.5" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Callout Box" onClick={() => addShape('callout-box')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M3 4H29V22H16L9 29L11 22H3Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
      </ShapeCategory>

      {/* Banners */}
      <ShapeCategory label="Banners">
        <ShapeBtn label="Ribbon" onClick={() => addShape('banner-ribbon')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M2 10L6 6V9H26V6L30 10L26 14V18H6V14Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Scroll" onClick={() => addShape('banner-scroll')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M5 6Q3 6 3 9V25Q3 28 7 26L7 10H25V26Q25 28 29 26V9Q29 6 27 6Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
      </ShapeCategory>

      {/* Decorative */}
      <ShapeCategory label="Decorative">
        <ShapeBtn label="Heart" onClick={() => addShape('heart')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M16 28C16 28 3 20 3 11C3 6 7 3 11 3C13.5 3 16 5 16 5C16 5 18.5 3 21 3C25 3 29 6 29 11C29 20 16 28 16 28Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Cloud" onClick={() => addShape('cloud')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M8 24C4 24 2 22 2 19C2 16 4 14 6 13C5 11 6 8 9 7C11 4 15 3 19 4C21 2 25 3 27 5C29 5 30 7 30 9C30 13 27 14 25 14C27 16 26 20 23 21C24 23 22 25 19 25Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Teardrop" onClick={() => addShape('teardrop')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M16 3C16 3 27 16 27 21C27 27 22 30 16 30C10 30 5 27 5 21C5 16 16 3 16 3Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Cross" onClick={() => addShape('cross')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M12 3H20V12H29V20H20V29H12V20H3V12H12Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Crescent" onClick={() => addShape('crescent')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M20 3C13 3 4 8 4 16C4 24 13 29 20 29C15 26 12 21 12 16C12 11 15 6 20 3Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Lightning" onClick={() => addShape('lightning')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M18 3L9 15H14L7 29L25 14H17L24 3Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Leaf" onClick={() => addShape('leaf')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M16 3C24 6 29 14 29 22C29 27 25 30 20 30C15 30 11 28 9 24C5 18 4 11 16 3Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Cog" onClick={() => addShape('cog')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M14 3H18L19 7L22 6L24 9L21 11L23 14L27 13L28 17L24 18L26 21L23 23L21 21L19 24L21 26L19 29L16 27L14 29L12 26L13 24L11 21L9 23L6 21L8 18L4 17L5 13L9 14L11 11L8 9L10 6L13 7Z" fill="var(--accent)" /><circle cx="16" cy="16" r="4" fill="var(--bg-surface)" /></svg>
        </ShapeBtn>
        <ShapeBtn label="Blob" onClick={() => addShape('blob')}>
          <svg viewBox="0 0 32 32" className="h-6 w-6"><path d="M20 4C27 3 30 9 28 15C31 21 27 28 21 29C16 31 9 30 5 25C1 21 1 13 5 9C8 5 14 5 20 4Z" fill="var(--accent)" /></svg>
        </ShapeBtn>
      </ShapeCategory>
    </div>
  );
}

function ShapeCategory({ label, defaultOpen, children }: {
  label: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1.5 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary hover:text-text-secondary"
        aria-expanded={open}
      >
        {label}
        <span className={`text-[8px] transition-transform ${open ? 'rotate-90' : ''}`}>&#9654;</span>
      </button>
      {open && (
        <div className="grid grid-cols-6 gap-1 pb-1">
          {children}
        </div>
      )}
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

// ─── Icons ────────────────────────────────────────────────────────

const ICON_COLS = 6;
const ICON_CELL_SIZE = 44;

const ICON_COLORS = ['#2d2a26', '#C4704A', '#e53935', '#1e88e5', '#43a047', '#8e24aa', '#ff6d00', '#ffffff'];

function IconsSection({ query, fullHeight }: { query: string; fullHeight?: boolean }) {
  const [loading, setLoading] = useState(!isLoaded());
  const [category, setCategory] = useState('All');
  const [iconColor, setIconColor] = useState('#2d2a26');
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
    engine.addSvgFromString(svg, iconColor);
  }, [iconColor]);

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

      {/* Icon color picker — choose color before inserting */}
      <div className="mb-2 flex items-center gap-1">
        <span className="text-[10px] text-text-tertiary">Color:</span>
        {ICON_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setIconColor(c)}
            className={`h-5 w-5 rounded-full border ${
              iconColor === c ? 'border-accent ring-1 ring-accent' : 'border-border'
            }`}
            style={{ backgroundColor: c }}
            title={c}
            aria-label={`Icon color ${c}`}
          />
        ))}
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

function PhotosSection({ query, onOpenSettings }: { query: string; onOpenSettings?: () => void }) {
  const unsplashOk = isUnsplashConfigured();
  const pexelsOk = isPexelsConfigured();
  const hasAny = unsplashOk || pexelsOk;
  const defaultSource: PhotoSource = unsplashOk ? 'unsplash' : 'pexels';
  const [source, setSource] = useState<PhotoSource>(defaultSource);
  const [photos, setPhotos] = useState<NormalizedPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [photoError, setPhotoError] = useState('');

  const handleSearch = useCallback(async () => {
    const q = localQuery.trim() || query.trim();
    if (!q) return;
    setLoading(true);
    setPhotoError('');
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
    } catch (err) {
      setPhotos([]);
      setPhotoError(err instanceof Error ? err.message : 'Failed to search photos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [localQuery, query, source, unsplashOk, pexelsOk]);

  const handleInsert = useCallback(async (photo: NormalizedPhoto) => {
    if (photo.unsplashPhoto) trackDownload(photo.unsplashPhoto);
    // If a frame is selected, fill it with the photo instead of adding standalone
    if (engine.isFrameSelected()) {
      await engine.fillSelectedFrameWithUrl(photo.regular);
    } else {
      await engine.addImageFromUrl(photo.regular);
    }
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
          Add your Unsplash or Pexels API key in Settings to browse free stock photos, or upload your own.
        </p>
        <div className="flex flex-col gap-2">
          {onOpenSettings && (
            <button type="button" onClick={onOpenSettings}
              className="rounded-sm bg-accent px-4 py-1.5 text-[10px] font-medium text-accent-fg hover:bg-accent-hover">
              Open Settings
            </button>
          )}
          <label className="cursor-pointer rounded-sm border border-border px-4 py-1.5 text-[10px] font-medium text-text-secondary hover:bg-wash">
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
      {!loading && photoError && <p className="text-center text-xs text-danger">{photoError}</p>}
      {!loading && !photoError && searched && photos.length === 0 && <p className="text-center text-xs text-text-tertiary">No photos found</p>}

      <div className="grid grid-cols-3 gap-1">
        {photos.map((photo) => (
          <button key={photo.id} type="button" onClick={() => handleInsert(photo)}
            className="group relative overflow-hidden rounded" aria-label={`Insert photo by ${photo.credit}`}>
            <img src={photo.thumb} alt={photo.alt} className="h-16 w-full object-cover" loading="lazy" />
            <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[7px] text-white opacity-0 group-hover:opacity-100">
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

function AITab({ onOpenSettings }: { onOpenSettings?: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <AIAssistantPanel onOpenSettings={onOpenSettings} />
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

