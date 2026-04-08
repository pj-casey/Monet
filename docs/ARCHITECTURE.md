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
├── shapes.ts          # ✅ Shape factory (rect, circle, triangle, line, arrow, star)
├── text.ts            # ✅ Text creation, Google Fonts on-demand loading (1929 fonts), text property updates
├── pen-tool.ts        # ✅ PenTool (click-to-place vector paths) + EditPointsMode (reshape existing paths)
├── images.ts          # ✅ Image loading, 10 filters (brightness/contrast/saturation/blur/hueRotation/noise/sharpen/tint/vignette)
├── drawing.ts         # ✅ Freehand pen (PencilBrush) and eraser (white brush)
├── layers.ts          # ✅ Layer list generation, friendly names, infrastructure filtering
├── serialization.ts   # ✅ Canvas ↔ DesignDocument JSON (toJSON/fromJSON)
├── template-loader.ts # ✅ Converts template recipe objects → real Fabric.js objects via constructors
├── export.ts          # ✅ PNG/JPG/SVG/PDF export with artboard cropping, jsPDF for PDF
├── tagged-object.ts   # TaggedObject interface (shared across all engine modules)
└── index.ts           # Public exports

Plugin system (apps/web/src/):
├── lib/plugin-api.ts      # PluginAPI, PluginPanel, MonetPlugin type definitions
├── lib/plugin-manager.ts  # PluginManager singleton — register, init, destroy, panel tracking
├── plugins/index.ts       # Registers all built-in plugins
├── plugins/qr-code.tsx    # QR Code Generator plugin (uses qrcode npm package)
├── plugins/lorem-ipsum.tsx # Lorem Ipsum placeholder text plugin
├── plugins/chart-widget.tsx # Bar/Line/Pie chart SVG generator plugin
└── components/PluginsPanel.tsx # Left sidebar panel — accordion layout for plugin panels
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

  // Export — ✅ implemented
  export(options: ExportOptions): void;  // PNG, JPG, SVG, PDF with quality/multiplier
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

Templates are static JSON files bundled with the app:

```
packages/templates/
├── src/
│   ├── index.ts                      # Template registry
│   └── categories/
│       ├── social-media/
│       │   ├── instagram-post/
│       │   │   ├── bold-announcement.json
│       │   │   ├── bold-announcement.thumb.webp
│       │   │   └── assets/           # Embedded images used by template
│       │   └── ...
│       ├── presentations/
│       ├── print/
│       └── marketing/
├── schema.json                       # JSON Schema for template validation
└── scripts/
    └── generate-thumbnails.ts        # Auto-generate thumbs from templates
```

Template JSON is a `DesignDocument` plus template metadata:

```typescript
interface Template {
  templateId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  dimensions: { width: number; height: number };
  thumbnail: string;                  // Relative path to thumb
  document: DesignDocument;           // The actual design
}
```

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

## Feature Flags

Use a simple feature flag system for progressive rollout:

```typescript
// packages/shared/src/features.ts
export const FEATURES = {
  BACKEND_SYNC: false,        // Phase 5
  AI_BACKGROUND_REMOVE: false, // Phase 6
  COLLABORATION: false,        // Phase 7
  TEMPLATE_MARKETPLACE: false,  // Phase 8
} as const;
```

Check in code: `if (FEATURES.AI_BACKGROUND_REMOVE) { ... }`

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
