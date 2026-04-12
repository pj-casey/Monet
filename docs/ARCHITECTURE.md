# Monet — Architecture Guide

## Overview

Monet is a client-first, template-driven graphic design editor. The architecture prioritizes:

1. **Client-side independence** — the full editor works with zero backend
2. **Serializable state** — every design is a JSON blob that can be saved, loaded, shared
3. **Plugin-friendly canvas** — all canvas operations go through a clean abstraction over Fabric.js
4. **Progressive enhancement** — backend, auth, AI, and collaboration are opt-in layers

---

## Data Flow

```
User Action
  → React Component (UI event)
    → Zustand Store (state update)
      → Canvas Engine (Fabric.js operation)
        → Canvas renders
        → Store updates serialized state
          → Auto-save to IndexedDB (or API if logged in)
```

### Key principle: React never talks to Fabric.js directly.

All canvas interactions go through the canvas-engine package. The engine is split into focused modules:

```
packages/canvas-engine/src/
├── canvas-engine.ts   # ✅ Main class — init, dispose, artboard, coordinates modules
├── viewport.ts        # ✅ Zoom (mouse wheel, 10%-500%) and pan (space+drag)
├── grid.ts            # ✅ Grid line rendering and snap-to-grid
├── guides.ts          # ✅ Smart alignment guides (edge/center snapping)
├── history.ts         # ✅ Undo/redo with snapshot-based command pattern
├── background.ts      # ✅ Solid color, gradient, and image backgrounds
├── shapes.ts          # ✅ Shape factory (rect, circle, triangle, line, arrow, star + rounded-rect, diamond, pentagon, hexagon, heart, arrow-right, speech-bubble)
├── text.ts            # ✅ Text creation, Google Fonts on-demand loading (1929 fonts), text property updates
├── pen-tool.ts        # ✅ PenTool (click-to-place vector paths) + EditPointsMode (reshape existing paths)
├── images.ts          # ✅ Image loading, 10 filters (brightness/contrast/saturation/blur/hueRotation/noise/sharpen/tint/vignette)
├── drawing.ts         # ✅ Freehand pen (PencilBrush) and eraser (white brush)
├── layers.ts          # ✅ Layer list generation, friendly names, infrastructure filtering
├── serialization.ts   # ✅ Multi-page serialization (serializeCanvas, deserializeObjects, normalizePagesToArray, serializeCurrentPageObjects)
├── template-loader.ts # ✅ Converts template recipe objects → real Fabric.js objects via constructors
├── export.ts          # ✅ PNG/JPG/SVG/PDF export with artboard cropping, jsPDF for PDF, multi-page PDF via exportMultiPagePDF
├── thumbnail.ts       # ✅ Offscreen Fabric.js canvas thumbnail rendering for templates
├── tagged-object.ts   # TaggedObject interface (__isArtboard, __isGridLine, __isGuide, __isBgImage, __isPenPreview, __isCropOverlay, __cropPrevEvented)
└── index.ts           # Public exports

Plugin system (apps/web/src/):
├── lib/plugin-api.ts      # PluginAPI, PluginPanel, MonetPlugin type definitions
├── lib/plugin-manager.ts  # PluginManager singleton — register, init, destroy, panel tracking
├── plugins/index.ts       # Registers all built-in plugins
├── plugins/qr-code.tsx    # QR Code Generator plugin (uses qrcode npm package)
├── plugins/lorem-ipsum.tsx # Lorem Ipsum placeholder text plugin
├── plugins/chart-widget.tsx # Bar/Line/Pie chart SVG generator plugin
└── components/PluginsPanel.tsx # Left sidebar panel — accordion layout for plugin panels

Key UI components:
├── components/Tooltip.tsx       # Styled tooltip (dark pill, 500ms delay) — replaces native title=""
├── components/PageNavigator.tsx # Horizontal page thumbnail strip — switch/add/delete/duplicate/reorder pages
├── components/ColorPicker.tsx   # Custom color picker with eyedropper, document colors, recent colors, brand colors
├── components/SettingsModal.tsx # Centralized API key management (Anthropic, Unsplash, Pexels)
├── components/CommandPalette.tsx # Raycast-style command bar (/ or Cmd+K)
├── components/ContextualAI.tsx  # Floating AI sparkle buttons near selected objects
├── components/TabSuggest.tsx    # Tab-to-suggest AI copy for empty text objects
```

### Key types

```typescript
// packages/shared/src/types.ts
interface DesignPage { id: string; name: string; objects: Record<string, unknown>[]; background?: BackgroundOptions; }
interface DesignDocument { ...; pages?: DesignPage[]; objects: Record<string, unknown>[]; ... }
// pages is source of truth when present; objects kept for backward compat with old saves/templates

// packages/shared/src/shapes.ts  
type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow' | 'star' | 'rounded-rect' | 'diamond' | 'pentagon' | 'hexagon' | 'heart' | 'arrow-right' | 'speech-bubble';
```

### Fabric.js v7 origin fix

Fabric.js v7 changed the default `originX`/`originY` from `'left'`/`'top'` to `'center'`/`'center'`.
This means `left: 0, top: 0` positions the CENTER of an object at (0,0), not the top-left corner.
We fix this globally on engine load:

```typescript
FabricObjectClass.ownDefaults.originX = 'left';
FabricObjectClass.ownDefaults.originY = 'top';
```

The `CanvasEngine` class exposes methods grouped by feature:

```typescript
class CanvasEngine {
  // Lifecycle
  init(element, containerWidth, containerHeight, options): void;
  dispose(): void;
  resize(containerWidth, containerHeight): void;

  // Artboard
  setArtboardDimensions(width, height): void;
  getArtboardDimensions(): { width, height };

  // Viewport (zoom & pan) — ✅ implemented
  fitToScreen(): void;
  setZoom(zoom): void;
  getZoom(): number;

  // Grid — ✅ implemented
  setGridVisible(visible, gridSize?): void;
  setSnapToGrid(enabled): void;

  // Smart Guides — ✅ implemented
  setGuidesEnabled(enabled): void;

  // History — ✅ implemented
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  saveHistoryCheckpoint(): void;
  commitHistory(description): void;

  // Background — ✅ implemented
  setBackground(options: BackgroundOptions): Promise<void>;

  // Shapes — ✅ implemented
  addShape(options: ShapeOptions): string;
  updateSelectedObject(props): void;
  deleteSelectedObjects(): void;
  getSelectedObjectProps(): SelectedObjectProps | null;

  // Text — ✅ implemented
  addText(options?: TextOptions): void;
  updateSelectedTextProps(props: Partial<TextOptions>): Promise<void>;
  // Double-click canvas with text tool → adds text at position
  // Double-click existing text → enters inline editing (Fabric.js built-in)

  // Images — ✅ implemented
  addImageFromFile(file: File): Promise<void>;
  addImageAtPosition(file: File, screenX: number, screenY: number): Promise<void>;
  updateImageFilters(values: ImageFilterValues): void;
  // Drag-and-drop: handled by Canvas.tsx onDrop → addImageAtPosition

  // Drawing — ✅ implemented
  enableDrawing(color?: string, width?: number): void;
  enableEraser(width?: number): void;
  disableDrawing(): void;
  setDrawingColor(color: string): void;
  setDrawingWidth(width: number): void;
  // Strokes auto-record to undo via path:created event

  // Layers — ✅ implemented
  getLayers(): LayerInfo[];
  reorderLayer(fromIdx, toIdx): void;
  selectLayerByIndex(idx): void;
  toggleLayerLock(idx): void;
  toggleLayerVisibility(idx): void;
  deleteLayerByIndex(idx): void;
  duplicateSelected(): void;
  copySelected(): void;
  pasteClipboard(): void;
  groupSelected(): void;
  ungroupSelected(): void;
  nudgeSelected(dx, dy): void;

  // Serialization — ✅ implemented
  toJSON(name?: string, existingId?: string): DesignDocument;
  fromJSON(doc: DesignDocument): Promise<void>;

  // Icons — ✅ implemented
  addSvgIcon(paths: string[], color?: string): void;           // Path-only icons (legacy)
  addSvgFromString(svgString: string, color?: string): Promise<void>;  // Full SVG (all element types)

  // Illustrations — ✅ implemented
  addIllustration(svgString: string): Promise<void>;  // Full-color SVG, preserves fills, scales to 80% artboard

  // Pen Tool — ✅ implemented
  enablePenTool(): void;             // Activate pen tool for vector path creation
  disablePenTool(): void;            // Deactivate pen tool
  isPenToolActive(): boolean;        // Check if pen tool is active
  enterEditPoints(): void;           // Enter edit-points mode for selected Path
  exitEditPoints(): void;            // Exit edit-points mode
  isEditPointsActive(): boolean;     // Check if edit-points mode is active

  // Clipping Masks — ✅ implemented
  clipToShape(): void;               // Clip top object to bottom object's shape (2 selected)
  unclipObject(): void;              // Remove clip mask from selected object

  // Aspect Ratio & Viewport — ✅ implemented
  setLockAspectRatio(locked: boolean): void;  // Toggle uniform scaling
  getViewportTransform(): number[];           // For ruler rendering

  // Image Crop — ✅ implemented
  enterCropMode(): void;                  // Enter crop mode for selected image
  applyCrop(): void;                      // Apply crop (non-destructive via clipPath)
  cancelCrop(): void;                     // Cancel crop mode
  setCropAspectRatio(ratio: number | null): void;  // Lock crop to aspect ratio
  isCropping(): boolean;                  // Check if in crop mode

  // Multi-Page — ✅ implemented
  switchToPage(index: number): Promise<void>;      // Save current page, load target page
  addPage(): Promise<void>;                        // Add blank page after current
  deletePage(index: number): Promise<void>;        // Delete page (prevents last page deletion)
  duplicatePage(index: number): Promise<void>;     // Deep-copy page
  reorderPages(from: number, to: number): void;    // Move page
  renamePage(index: number, name: string): void;   // Rename page
  getPages(): { pages: DesignPage[]; currentIndex: number };
  renderPageToDataURL(index: number, multiplier?: number): Promise<string>;  // For thumbnails

  // Export — ✅ implemented
  export(options: ExportOptions): void;  // PNG, JPG, SVG, PDF with quality/multiplier
  exportAllPagesAsPDF(options): Promise<void>;  // Multi-page PDF
}
```

### Object tagging system

Infrastructure objects on the canvas (artboard rect, grid lines, guide lines, background images) are tagged with boolean flags so they can be identified and excluded from user operations:

```typescript
interface TaggedObject extends FabricObject {
  __isArtboard?: boolean;   // The white artboard rectangle
  __isGridLine?: boolean;   // Grid overlay lines
  __isGuide?: boolean;      // Smart alignment guide lines
  __isBgImage?: boolean;    // Background image
}
```

These tagged objects are excluded from: serialization, undo/redo snapshots, smart guide alignment checks, and user selection.

---

## Backend API (`apps/api/`)

Optional REST API server for cloud sync. The frontend works fully without it.

```
apps/api/src/
├── index.ts              # ✅ Hono server with CORS, routes, health check
├── db.ts                 # ✅ SQLite via sql.js — designs, preferences, users, sessions tables
├── auth.ts               # ✅ Password hashing (scrypt), session management, user CRUD
├── middleware/
│   └── auth.ts           # ✅ requireAuth + optionalAuth middleware
└── routes/
    ├── auth.ts           # ✅ POST signup/login/logout, GET /api/auth/me, OAuth stubs
    ├── designs.ts        # ✅ GET/POST/PUT/DELETE /api/designs
    └── preferences.ts    # ✅ GET/PUT /api/preferences
```

**Endpoints:**
- `GET /api/health` — health check
- `GET /api/designs` — list designs (metadata only)
- `GET /api/designs/:id` — get full design with document JSON
- `POST /api/designs` — create design
- `PUT /api/designs/:id` — update design
- `DELETE /api/designs/:id` — delete design
- `GET /api/preferences` — get all preferences
- `GET /api/preferences/:key` — get one preference
- `PUT /api/preferences/:key` — set one preference

**Database:** SQLite file at `./data/monet.db` (auto-created). Uses sql.js (pure JS WebAssembly SQLite, no native compilation).

**Running:** `pnpm dev:api` (port 3001) or `pnpm dev:all` (frontend + API together).

---

## State Architecture (Zustand)

### Stores

Located in `apps/web/src/stores/`:

```
stores/
├── editor-store.ts      # ✅ Active tool, zoom, grid visible/size/snap, guides, artboard dimensions
├── canvas-store.ts      # ✅ Design document, selection, dirty flag, background options
├── history-store.ts     # ✅ Undo/redo availability (canUndo, canRedo)
├── ui-store.ts          # ✅ Panel visibility, dark mode
├── template-store.ts    # (Phase 1.4) Template catalog, categories, search/filter
├── brand-store.ts       # (Phase 4) Brand kits
├── auth-store.ts        # (Phase 5) User session
└── collaboration-store.ts  # (Phase 7) Presence, cursors
```

### Store design rules

- Stores are independent — no circular dependencies between stores.
- Stores expose actions as methods, not raw setters.
- Derived state uses Zustand selectors, not computed in components.
- Canvas-store holds the serialized `DesignDocument` as source of truth.
- History-store records snapshots from canvas-store for undo/redo.

---

## Design System

All visual values come from CSS custom properties defined in `apps/web/src/styles/tokens.css` and mapped to Tailwind utilities via `@theme inline` in `index.css`. See `DESIGN.md` for the full specification.

### Token Architecture

```
DESIGN.md (spec) → tokens.css (CSS vars) → index.css (@theme inline) → Tailwind utilities
```

### Color Tokens (OKLCH, warm hue 60-70)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--accent` | `oklch(0.65 0.15 45)` (warm sienna) | `oklch(0.70 0.15 45)` | Primary CTAs, active states |
| `--bg-canvas` | Warm sand | Deep warm dark | Pasteboard behind artboard |
| `--bg-surface` | Cream | Dark warm | Panels, sidebars |
| `--bg-elevated` | Near-white | Slightly lifted | Cards, popovers |
| `--bg-overlay` | White | Dark overlay | Modals, dialogs |
| `--text-primary` | Near-black (warm) | Warm off-white | Primary text |
| `--text-secondary` | Warm mid-gray | Warm mid-gray | Secondary UI text |
| `--border-default` | Warm subtle | Dark subtle | Dividers, borders |

### Typography

| Font | Variable | Usage |
|------|----------|-------|
| DM Sans (400/500/600) | `--font-sans` | All editor UI |
| Fraunces (400/600) | `--font-display` | Wordmark, welcome hero, marketing only |

Base font size: 14px (`--text-base`). Editor UI never uses 16px.

### Spacing & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Buttons, inputs |
| `--radius-lg` | 8px | Modals, dialogs |
| `--space-3` | 12px | Panel padding (always) |
| `--space-2` | 8px | Between controls |
| `--space-4` | 16px | Between sections |

### Motion

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-normal` | 150ms | Hovers, color transitions |
| `--duration-slow` | 250ms | Panel slides, modals |
| `--ease-spring` | cubic-bezier(0.34,1.56,0.64,1) | Scale-up, tooltips |

### Animations (defined in `index.css`)
- `animate-save-pulse` — 600ms badge glow on auto-save
- `animate-scale-up` — 250ms 0.97→1.0 with spring easing
- `animate-fade-in` — 150ms opacity for overlays
- `animate-tooltip-pop` — 250ms scale+translate with spring

---

## UI Layout

The app has two top-level views managed by `App.tsx`:

### Welcome Screen (`view === 'welcome'`)
Shown when no design is loaded. Full-screen, no canvas rendered.
- **Returning users:** design dashboard with thumbnails + "+ Create New" button
- **New users:** "What do you want to create?" with 6 category cards leading to filtered template grids
- **Blank Canvas option:** all dimension presets grouped by category + custom size input

### Editor (`view === 'editor'`)
```
┌──────────────────────────────────────────────────┐
│ Toolbar: Logo│Undo/Redo│Badge  Tools+Zoom  Share│Export│⋮│
├──────────┬───────────────────────┬───────────────┤
│ Left     │                       │ Right Sidebar │
│ Sidebar  │                       │ (contextual)  │
│ (280px)  │       Canvas          │ Properties tab│
│          │                       │ Layers tab    │
│ Design   │                       │               │
│ Elements │                       │ Only visible  │
│ Text     │                       │ when object   │
│ Upload   │                       │ is selected   │
│ AI       │                       │               │
├──────────┴───────────────────────┴───────────────┤
│ BottomBar: dimensions + zoom                      │
└──────────────────────────────────────────────────┘
```

**Left Sidebar** (`LeftSidebar.tsx`, 280px, always visible):
- 5 tabs: Design | Elements | Text | Upload | AI
- Design: templates, brand kit, resize, plugins
- Elements: shapes + icons + illustrations + photos with unified search
- Text: heading/subheading/body presets
- Upload: drag-and-drop file zone
- AI: Claude chat assistant

**Right Sidebar** (`RightSidebar.tsx`, 256px, contextual):
- Only appears when an object is selected on the canvas
- Properties tab: fill, stroke, opacity, text props, filters, transform, blend mode, clip mask
  - **Text selected**: "Suggest alternative copy" sparkle button (calls Claude inline)
  - **Image selected**: "Remove Background" card at top of controls
- Layers tab: layer list with reorder, lock, visibility, align, distribute

**Canvas Hints** (`CanvasHints.tsx`):
- Floating chips centered over empty canvas: "Generate with AI" + "Browse templates"
- Disappear when objects are added (keyed on `layers.length > 0`)

**AI Assistant** (`AIAssistantPanel.tsx`, embedded in left sidebar AI tab):
- Conversational chat: user messages right (violet bubbles), Claude left (gray bubbles + avatar)
- Typing indicator: 3 bouncing dots during API calls
- Quick-action chips: Get feedback, Suggest copy, Smart edit, Translate

**Context Menu** (`ContextMenu.tsx`):
- Custom right-click menu on canvas. Object: Cut/Copy/Paste/Duplicate/Delete/Lock/Group/Ordering. Empty: Paste/Select All/Zoom.

**Color Picker** (`ColorPicker.tsx`):
- react-colorful based. Saturation/brightness + hue slider + hex input + recent colors + brand colors.

### Canvas Interactions (in `CanvasEngine`)
- **Selection handles:** white circles, accent bounding box, set via `FabricObjectClass.ownDefaults`
- **Hover outline:** 1px accent stroke on `mouse:over`, restored on `mouse:out`
- **Real-time sync:** `object:moving`/`scaling`/`rotating` → throttled (rAF) selection change
- **Rotation display:** temporary angle label during rotation
- **Smart duplicate:** configurable offset vector (`lastDuplicateOffset`)
- **Smart guides:** accent-colored, 5px snap threshold

**Toolbar** (`Toolbar.tsx`, 48px height):
- Left: Logo + Undo/Redo + auto-save badge
- Center: Select/Draw/Pen tool switcher + zoom controls
- Right: Share + Export + overflow menu (settings, toggles, account)

---

## Design Document Schema

Every design is a `DesignDocument` — a serializable JSON object:

```typescript
interface DesignDocument {
  version: number;                    // Schema version for migrations
  id: string;                         // Unique design ID (nanoid)
  name: string;
  createdAt: string;                  // ISO 8601
  updatedAt: string;
  dimensions: {
    width: number;                    // px
    height: number;
  };
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string;                    // hex, CSS gradient, or image URL/base64
  };
  objects: CanvasObject[];            // Ordered by z-index (back to front)
  metadata: {
    templateId?: string;              // If created from a template
    tags?: string[];
    exportHistory?: ExportRecord[];
  };
}

interface CanvasObject {
  id: string;                         // nanoid
  type: 'text' | 'shape' | 'image' | 'group' | 'path';
  name: string;                       // User-visible layer name
  locked: boolean;
  visible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;                   // degrees
  opacity: number;                    // 0–1
  props: TextProps | ShapeProps | ImageProps | GroupProps | PathProps;
}
```

---

## Template System

50 built-in templates live in a single registry file using a `tpl()` helper for compact definitions:

```
packages/templates/src/
├── types.ts         # Template interface definition
├── registry.ts      # TEMPLATE_REGISTRY array — all 50 templates defined inline via tpl() helper
└── index.ts         # Public exports (TEMPLATE_REGISTRY, getTemplateCategories, getTemplatesByCategory)
```

Templates use a "recipe" format — simplified object definitions that `template-loader.ts` in canvas-engine converts to real Fabric.js objects. Thumbnails are rendered at runtime by `renderTemplateThumbnail()` using an offscreen Fabric.js canvas (no pre-built thumbnail images).

User-created templates are stored in IndexedDB (`monet-user-templates` database) and shown in the template browser above built-in templates.

```typescript
interface Template {
  templateId: string;
  name: string;
  description: string;
  category: string;               // e.g., "Social Media", "Business", "Marketing"
  subcategory?: string;           // e.g., "Instagram Post", "Business Card"
  tags: string[];
  dimensions: { width: number; height: number };
  thumbnail: string;              // Empty string — thumbnails rendered at runtime
  document: DesignDocument;       // The actual design as recipe-format JSON
}
```

Categories: Social Media (10), Business (9), Marketing (7), Events (7), Education (3), Creative (6), Food & Lifestyle (6), Seasonal (4).

---

## Persistence Strategy

### Client-side (default, always available)

```
IndexedDB ("monet-db")
├── designs/          # DesignDocument objects, keyed by ID
├── brand-kits/       # BrandKit objects
├── preferences/      # User settings (theme, grid, etc.)
└── asset-cache/      # Uploaded images (as blobs)
```

Use **idb** (npm package) for a promise-based IndexedDB wrapper.

Auto-save strategy:
- Save on every meaningful change, debounced 2 seconds.
- Save immediately on blur/beforeunload.
- Display "Saved" / "Saving..." / "Unsaved changes" indicator.

### Server-side (Phase 5+, opt-in)

- REST API mirrors IndexedDB structure.
- Sync strategy: local-first, push to server on save, pull on load.
- Conflict: last-write-wins with timestamp comparison. Show merge prompt if timestamps are close (< 5 seconds).

---

## Export Pipeline

```
DesignDocument
  → Canvas Engine renders to off-screen Fabric.js canvas
    → PNG/JPG: canvas.toDataURL() with quality and multiplier params
    → SVG: fabric.js toSVG() with font embedding
    → PDF: jsPDF with canvas rasterization (or svg2pdf for vector)
```

Export runs in a Web Worker to avoid blocking the UI for large designs.

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial load (cold) | < 3s on 4G |
| Time to interactive | < 2s |
| Canvas render (100 objects) | < 16ms (60fps) |
| Export PNG (1080x1080) | < 2s |
| Auto-save | < 100ms (serialization) |
| Bundle size (initial) | < 500KB gzipped |
| Lighthouse performance | > 90 |

---

## Accessibility Requirements

- All toolbar buttons: `aria-label`, keyboard focus, visible focus ring.
- Layer panel: navigable with arrow keys, spacebar to toggle visibility.
- Properties panel: form inputs with labels, tab order.
- Canvas: not directly accessible (visual by nature), but all actions available via keyboard shortcuts and panels.
- Color pickers: support hex input (not just visual picker).
- Export dialogs: focus trap, Escape to close.
- Skip-to-content link for the main canvas area.
- Announce state changes (saved, exported, error) via `aria-live` regions.

---

## Security Considerations

- SVG uploads: sanitize with DOMPurify before rendering (XSS vector).
- Image uploads: validate MIME type server-side, resize/strip EXIF client-side.
- Template JSON: validate against schema before loading.
- Auth tokens: HttpOnly cookies preferred over localStorage.
- CSP headers: restrict script sources in self-hosted deployments.
- No eval() or innerHTML with user content, ever.
