# Monet — Session Log

> This file is automatically maintained by Claude Code at the end of each work session.
> It serves as the project's memory across sessions.

---

## Session 1 — 2026-04-07
**Phase:** Phase 0 — Project Scaffolding
**Completed:**
- Initialized pnpm monorepo with workspace configuration
- Scaffolded `apps/web` with Vite + React 19 + TypeScript 6 (strict mode)
- Created `packages/canvas-engine` with Fabric.js v7 wrapper (`CanvasEngine` class)
- Created `packages/shared` with core types (`DesignDocument`, `CanvasObject`, `BackgroundOptions`, feature flags)
- Created `packages/templates` with `Template` type definition
- Installed and configured Tailwind CSS v4 via Vite plugin
- Installed Zustand v5, created 3 store skeletons: `editor-store`, `canvas-store`, `ui-store`
- Configured ESLint with React hooks/refresh plugins + Prettier integration
- Created `Canvas.tsx` component that renders an empty 1080x1080 Fabric.js canvas
- Created editor shell layout with placeholder header, left sidebar, right sidebar
- Initialized git with comprehensive `.gitignore`
- Moved docs to `docs/` directory per project structure spec

**Files Created/Modified:**
- `package.json` — monorepo root with shared scripts
- `pnpm-workspace.yaml` — workspace package locations
- `.gitignore`, `.prettierrc`, `.prettierignore` — project config
- `apps/web/` — full Vite + React + TS app
- `apps/web/src/App.tsx` — editor shell layout
- `apps/web/src/components/Canvas.tsx` — Fabric.js canvas component
- `apps/web/src/stores/editor-store.ts` — tool/zoom/snap state
- `apps/web/src/stores/canvas-store.ts` — design document state
- `apps/web/src/stores/ui-store.ts` — panel/theme state
- `apps/web/src/index.css` — Tailwind CSS entry point
- `packages/canvas-engine/src/canvas-engine.ts` — Fabric.js wrapper class
- `packages/shared/src/types.ts` — DesignDocument, CanvasObject types
- `packages/shared/src/features.ts` — feature flags
- `packages/templates/src/types.ts` — Template type

**Decisions Made:**
- Used Tailwind CSS v4 with Vite plugin (simpler than v3, no `tailwind.config.js` needed)
- Used Fabric.js v7 (latest, better TypeScript support than v5/v6)
- Zustand v5 (latest, simpler API than v4)
- React 19 (latest stable from Vite scaffold)
- TypeScript 6 with strict mode
- Canvas engine is a class (not functions) to hold Fabric.js instance state
- Workspace packages use `"main": "src/index.ts"` — Vite resolves source directly, no build step needed for packages during development

**Next Steps:**
- Phase 1.1: Canvas Foundation — artboard dimensions, zoom/pan, grid/snap, undo/redo
- Phase 1.2: Object tools — text, shapes, images

**Issues:**
- None

---

## Session 2 — 2026-04-07
**Phase:** Phase 1.1 — Canvas Foundation
**Completed:**
- Rewrote `CanvasEngine` with proper artboard concept: the Fabric canvas fills the container, a white Rect with shadow serves as the artboard, CSS provides the gray pasteboard
- Split canvas-engine into focused modules: `viewport.ts`, `grid.ts`, `guides.ts`, `history.ts`, `background.ts`
- **Zoom & pan:** scroll wheel zoom (10%-500%) centered on cursor, space+drag panning with grab cursor, fit-to-screen calculation, zoom in/out buttons
- **Grid:** draws evenly spaced lines on the artboard, toggleable visibility, configurable spacing (default 20px)
- **Snap-to-grid:** rounds object position to nearest grid point during drag
- **Smart guides:** detects alignment with other objects' edges/centers (left, right, top, bottom, horizontal center, vertical center), shows magenta dashed lines, auto-snaps within 5px threshold, skips infrastructure objects via `__isArtboard`/`__isGridLine` tags
- **Undo/redo:** `HistoryManager` class using command pattern with snapshot-based state (serializes user objects to JSON, max 50 steps). `before:transform` saves checkpoint, `object:modified` commits. Ctrl+Z / Ctrl+Y keyboard shortcuts
- **Background:** solid color (set rect fill), gradient (linear/radial via custom string format), image (FabricImage scaled to cover artboard)
- **Toolbar component:** undo/redo buttons with disabled state, zoom controls (−, %, +, fit), grid/snap/guides toggle buttons with active highlight
- **BottomBar component:** displays artboard dimensions and zoom percentage
- Added `history-store.ts` for undo/redo UI state
- Added artboard dimension presets (14 presets across Social Media, Video, Presentation, Print)
- Updated editor-store with gridVisible, gridSize, artboard dimensions
- Updated canvas-store with background state
- Canvas component: full-container sizing with ResizeObserver, syncs engine with all store state via useEffect hooks

**Files Created:**
- `packages/canvas-engine/src/viewport.ts` — zoom/pan
- `packages/canvas-engine/src/grid.ts` — grid rendering + snap
- `packages/canvas-engine/src/guides.ts` — smart alignment guides
- `packages/canvas-engine/src/history.ts` — undo/redo command pattern
- `packages/canvas-engine/src/background.ts` — solid/gradient/image background
- `packages/shared/src/presets.ts` — artboard dimension presets
- `apps/web/src/stores/history-store.ts` — undo/redo UI state
- `apps/web/src/components/Toolbar.tsx` — top toolbar
- `apps/web/src/components/BottomBar.tsx` — bottom status bar

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — major rewrite with artboard concept
- `packages/canvas-engine/src/index.ts` — updated exports
- `packages/shared/src/index.ts` — added preset exports
- `apps/web/src/stores/editor-store.ts` — added grid, artboard state
- `apps/web/src/stores/canvas-store.ts` — added background state
- `apps/web/src/components/Canvas.tsx` — full rewrite with container sizing
- `apps/web/src/App.tsx` — added Toolbar and BottomBar

**Decisions Made:**
- Artboard is a Fabric.js Rect (not canvas.backgroundColor) so it zooms/pans with the viewport and has a shadow for depth
- Canvas element fills container (CSS gray pasteboard), canvas.backgroundColor is transparent
- Engine modules are stateless helper functions, CanvasEngine class coordinates them
- Smart guides use tagged objects (`__isArtboard`, `__isGridLine`, `__isGuide`) to distinguish infrastructure from user objects
- Undo/redo uses JSON snapshots of user objects (simpler and more reliable than per-operation commands)
- Gradient string format: `type:direction:color1:color2` (e.g., `linear:to-bottom:#ff0000:#0000ff`)
- `isEnabled` callback pattern for smart guides (canvas engine controls whether they fire)

**Next Steps:**
- Phase 1.2: Object Tools — text tool, shape tool, image tool, drawing tool
- Phase 1.3: Layer Management — layer panel, reorder, lock/hide, keyboard shortcuts

**Issues:**
- None

---

## Session 3 — 2026-04-07
**Phase:** Phase 1.2 — Shape Tool
**Completed:**
- Created shape types (`ShapeType`, `ShapeOptions`, `SelectedObjectProps`) in `@monet/shared`
- Built `shapes.ts` module in canvas-engine with factory functions for 6 shape types:
  - Rectangle (with configurable corner radius via `rx`/`ry`)
  - Circle (uses width as diameter)
  - Triangle (equilateral-ish default ratio)
  - Line (horizontal, configurable length)
  - Arrow (Group of Line + Triangle arrowhead)
  - Star (5-pointed Polygon with alternating inner/outer vertices)
- All shapes support: solid fill, gradient fill, stroke color/width, opacity
- Added `addShape()`, `updateSelectedObject()`, `deleteSelectedObjects()`, `getSelectedObjectProps()` to CanvasEngine with full undo/redo support
- Added selection tracking — canvas engine emits `onSelectionChange` callback when user selects/deselects objects
- Built LeftSidebar component with:
  - Narrow tool icon strip (select, shape, text, image, draw) with active state highlighting
  - Expandable ShapePanel that opens when shape tool is active, showing a 3-column grid of shape buttons with SVG previews
  - Clicking a shape adds it to artboard center, then auto-switches to select tool
- Built PropertiesPanel (right sidebar) with:
  - Fill color picker (native `<input type="color">`)
  - Stroke color picker + width number input
  - Opacity slider (0-100%)
  - Corner radius slider (rectangle only, 0-100px)
  - Hint message when nothing is selected
  - Friendly type names (rect → Rectangle, polygon → Star, etc.)
- Delete/Backspace keyboard shortcut to remove selected objects
- Updated App.tsx to wire LeftSidebar, PropertiesPanel, and selection state

**Files Created:**
- `packages/shared/src/shapes.ts` — ShapeType, ShapeOptions, SelectedObjectProps types
- `packages/canvas-engine/src/shapes.ts` — shape factory functions
- `apps/web/src/components/LeftSidebar.tsx` — tool icons + shape picker
- `apps/web/src/components/PropertiesPanel.tsx` — object property editors

**Files Modified:**
- `packages/shared/src/index.ts` — added shape type exports
- `packages/canvas-engine/src/canvas-engine.ts` — addShape, updateSelectedObject, deleteSelectedObjects, selection tracking
- `packages/canvas-engine/src/index.ts` — added createShape export
- `apps/web/src/components/Canvas.tsx` — onSelectionChange listener, Delete key handler
- `apps/web/src/App.tsx` — wired LeftSidebar, PropertiesPanel, selection state

**Decisions Made:**
- Star shape uses Polygon with `generateStarPoints()` — alternates between outer radius (tips) and inner radius (38% of outer, classic star ratio)
- Arrow is a Fabric.js Group containing a Line + Triangle (not a single Path) — simpler to create and each part is standard
- Selection change uses a module-level listener pattern (not a Zustand store) to avoid re-rendering the entire app on every selection/move
- Shape picker auto-switches to select tool after adding a shape — so user can immediately move/resize
- PropertiesPanel uses native `<input type="color">` for color pickers — works across all browsers, no external dependency
- `SelectedObjectProps` is a plain object snapshot (not a reactive binding) — properties panel re-reads on each selection change

**Next Steps:**
- Phase 1.2 continued: Text tool, Image tool, Drawing tool
- Phase 1.3: Layer Management

**Issues:**
- None

---

## Session 4 — 2026-04-07
**Phase:** Phase 1.2 — Text Tool
**Completed:**
- Created text types (`TextOptions`, `TextProperties`, `FontName`, `FONT_LIST`) in `@monet/shared`
- Extended `SelectedObjectProps` with text-specific fields (fontFamily, fontSize, fontWeight, fontStyle, underline, textAlign, lineHeight, charSpacing)
- Built `text.ts` module in canvas-engine:
  - `loadGoogleFont()` — loads fonts on-demand by injecting `<link>` tags for Google Fonts CSS, waits via Font Loading API
  - `createText()` — creates Fabric.js Textbox with all text options
  - `updateTextProps()` — updates text properties, loads new font if fontFamily changes
  - `readTextProps()` — reads current text properties from a Textbox for the properties panel
  - 24 curated fonts across sans-serif, serif, display, and monospace categories
- Added text methods to CanvasEngine:
  - `addText(options)` — adds text to artboard center with undo support
  - `addTextAtScreenPoint(x, y)` — adds text at double-click position, enters editing mode with text selected
  - `updateSelectedTextProps(props)` — async method that loads font first if needed
  - Double-click handler: creates text at click position when text tool active, Fabric.js handles editing existing text
  - `getSelectedObjectProps()` now includes text properties when a Textbox is selected
- Updated left sidebar:
  - Text tool icon toggles text panel (like shape panel)
  - TextPanel with 3 presets: Heading (64px bold), Subheading (36px bold), Body (18px)
  - Hint text about double-clicking canvas
- Updated PropertiesPanel to be context-sensitive:
  - Text objects show: font family dropdown (24 fonts), font size input, B/I/U toggle buttons, alignment buttons (left/center/right/justify), line height slider (0.8–3.0), letter spacing slider (-200 to 800)
  - Shape objects show: fill, stroke, opacity, corner radius (as before)
  - Both show: fill color picker, opacity slider
- Delete/Backspace now checks `isEditing` flag to avoid deleting the text object while the user is typing inside it
- Canvas.tsx passes `getActiveTool` callback to engine via `useEditorStore.getState().activeTool`
- Inter font pre-loaded on canvas init

**Files Created:**
- `packages/shared/src/text.ts` — TextOptions, TextProperties, FONT_LIST, FontName
- `packages/canvas-engine/src/text.ts` — Google Fonts loader, text creation/update/read

**Files Modified:**
- `packages/shared/src/shapes.ts` — extended SelectedObjectProps with text fields
- `packages/shared/src/index.ts` — added text type exports
- `packages/canvas-engine/src/canvas-engine.ts` — addText, updateSelectedTextProps, double-click handler, getActiveTool, text property reading in getSelectedObjectProps
- `packages/canvas-engine/src/index.ts` — added loadGoogleFont, isFontLoaded exports
- `apps/web/src/components/LeftSidebar.tsx` — TextPanel component, text tool toggle
- `apps/web/src/components/PropertiesPanel.tsx` — full rewrite with text-specific controls
- `apps/web/src/components/Canvas.tsx` — getActiveTool callback, isEditing check for delete

**Decisions Made:**
- Used Fabric.js `Textbox` (not `IText`) because Textbox supports automatic word wrapping within a fixed width — essential for a design tool where text boxes have defined widths
- Google Fonts loaded via `<link>` tag injection rather than JavaScript Font Face API — simpler, the browser handles caching, and Google's CDN serves optimized subsets
- Font Loading API (`document.fonts.load()`) used to wait for font to be available before rendering — prevents flash of fallback font
- `charSpacing` in Fabric.js is in 1/1000 em units, not pixels — the slider range (-200 to 800) covers tight to very loose spacing
- Engine gets active tool state via `getActiveTool` callback rather than importing the store — keeps the engine package decoupled from React/Zustand
- Pre-load Inter font on init so default text renders correctly immediately

**Next Steps:**
- Phase 1.2 continued: Image Tool, Drawing Tool
- Phase 1.3: Layer Management

**Issues:**
- None

---

## Session 5 — 2026-04-07
**Phase:** Phase 1.2 — Image Tool
**Completed:**
- Created image types (`ImageFilterValues`, `DEFAULT_IMAGE_FILTERS`) in `@monet/shared`
- Extended `SelectedObjectProps` with image filter fields (filterBrightness, filterContrast, filterSaturation, filterBlur)
- Built `images.ts` module in canvas-engine:
  - `loadImageFromFile()` — reads a File as data URL, creates FabricImage, auto-scales to fit artboard (80% max, never upscale)
  - `applyFilters()` — applies Fabric.js built-in Brightness/Contrast/Saturation/Blur filters
  - `readFilterValues()` — reads current filter values from a FabricImage's filters array
- Added image methods to CanvasEngine:
  - `addImageFromFile(file)` — loads image from File, places at artboard center, with undo
  - `addImageAtPosition(file, screenX, screenY)` — loads image at screen coordinate (for drag-and-drop), converts to canvas coords via viewport transform inversion
  - `updateImageFilters(values)` — applies filter values to selected image with undo
  - `getSelectedObjectProps()` now reads filter values when a FabricImage is selected
- Updated LeftSidebar:
  - Image tool icon now toggles ImagePanel
  - ImagePanel with file picker `<input type="file">` accepting PNG/JPG/SVG/WebP/GIF, multiple files
  - Upload icon and hint about drag-and-drop
- Updated PropertiesPanel with image-specific section:
  - 4 filter sliders: brightness (-1 to 1), contrast (-1 to 1), saturation (-1 to 1), blur (0 to 1)
  - Each shows current value, all connected to `engine.updateImageFilters()`
  - "Reset Filters" button to zero all filters
- Added drag-and-drop support on Canvas.tsx:
  - `onDrop` handler reads dropped files, filters to images, calls `engine.addImageAtPosition()`
  - `onDragOver` handler with `preventDefault()` + `dropEffect = 'copy'` to enable drop zone
- Resize/rotate/crop: Fabric.js built-in controls handle resize and rotate; crop can be done by resizing with clipPath (basic crop via resize is available, advanced crop deferred)

**Files Created:**
- `packages/shared/src/image.ts` — ImageFilterValues type, DEFAULT_IMAGE_FILTERS
- `packages/canvas-engine/src/images.ts` — image loading, filter application, filter reading

**Files Modified:**
- `packages/shared/src/shapes.ts` — extended SelectedObjectProps with filter fields
- `packages/shared/src/index.ts` — added image type exports
- `packages/canvas-engine/src/canvas-engine.ts` — addImageFromFile, addImageAtPosition, updateImageFilters, image filter reading in getSelectedObjectProps
- `packages/canvas-engine/src/index.ts` — added image function exports
- `apps/web/src/components/LeftSidebar.tsx` — ImagePanel with file picker, upload icon
- `apps/web/src/components/PropertiesPanel.tsx` — ImageFiltersSection with 4 sliders + reset
- `apps/web/src/components/Canvas.tsx` — onDrop and onDragOver handlers

**Decisions Made:**
- Images loaded client-side via FileReader.readAsDataURL — no server upload needed, keeps the editor fully client-side
- Auto-scale images to 80% of artboard dimensions (never upscale) — ensures images fit without overwhelming the design
- Filters applied by replacing the entire `img.filters` array each time — simpler than tracking individual filter indices, and Fabric.js re-applies them efficiently
- Filter values stored as numbers matching Fabric.js conventions: brightness/contrast/saturation -1 to 1, blur 0 to 1
- Drag-and-drop uses native HTML5 DragEvent API on the React container div — no library needed
- Accepted formats: PNG, JPG, SVG, WebP, GIF — all natively supported by browsers and Fabric.js

**Next Steps:**
- Phase 1.2 continued: Drawing Tool (freehand pen + eraser)
- Phase 1.3: Layer Management

**Issues:**
- None

---

## Session 6 — 2026-04-07
**Phase:** Phase 1.2 — Drawing Tool (completes Phase 1.2)
**Completed:**
- Built `drawing.ts` module in canvas-engine:
  - `enableDrawing(canvas, color, width)` — activates Fabric.js `isDrawingMode` with PencilBrush
  - `disableDrawing(canvas)` — returns to normal selection mode
  - `enableEraser(canvas, width)` — draws with white to cover content
  - `setDrawingColor(canvas, color)` / `setDrawingWidth(canvas, width)` — update brush live
- Added drawing methods to CanvasEngine: `enableDrawing()`, `enableEraser()`, `disableDrawing()`, `setDrawingColor()`, `setDrawingWidth()`
- Added undo/redo for strokes: `mouse:down:before` saves checkpoint when in drawing mode, `path:created` commits after stroke finishes
- Built DrawingPanel in LeftSidebar:
  - Pen / Eraser toggle buttons
  - Color picker (pen mode only)
  - Width slider (1-50px for pen, 1-100px for eraser)
  - useEffect manages drawing mode lifecycle — enables/disables based on activeTool and mode/color/width changes
- Draw tool icon now toggles panel like other tools

**Files Created:**
- `packages/canvas-engine/src/drawing.ts` — PencilBrush drawing + eraser

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — drawing methods, path:created/mouse:down:before event listeners
- `packages/canvas-engine/src/index.ts` — added drawing exports
- `apps/web/src/components/LeftSidebar.tsx` — DrawingPanel component, draw tool toggle

**Decisions Made:**
- Used Fabric.js built-in `isDrawingMode` + PencilBrush — the simplest and most reliable approach, strokes automatically become Path objects
- Eraser is a white PencilBrush rather than a true pixel eraser — much simpler to implement, works well for most designs (true eraser would need compositing/masking, deferred)
- DrawingPanel owns the drawing mode lifecycle via useEffect — when the component mounts it enables drawing, when it unmounts (tool change) it disables drawing; this keeps state management clean
- Undo checkpoint saved on `mouse:down:before` (before the stroke) and committed on `path:created` (after the stroke) — ensures each individual stroke is one undo step

**Next Steps:**
- Phase 1.3: Layer Management — layer panel, reorder, lock/hide, group/ungroup, keyboard shortcuts
- Phase 1.4: Template System

**Issues:**
- None

---

## Session 7 — 2026-04-07
**Phase:** Phase 1.3 — Layer Management
**Completed:**
- Created `LayerInfo` type in `@monet/shared/layers.ts`
- Built `layers.ts` module in canvas-engine:
  - `getLayerList(canvas)` — reads all user objects, filters infrastructure, returns front-to-back ordered list with friendly names
  - `getLayerName(obj)` — generates display names (truncated text content for textboxes, type name for shapes)
- Added 12 layer/clipboard methods to CanvasEngine:
  - `getLayers()` — returns current layer list
  - `reorderLayer(from, to)` — moves object z-order using bringObjectForward/sendObjectBackwards
  - `selectLayerByIndex(idx)` — selects an object from the layer panel
  - `toggleLayerLock(idx)` — toggles selectable/evented/hasControls
  - `toggleLayerVisibility(idx)` — toggles visible
  - `deleteLayerByIndex(idx)` — removes a specific object
  - `duplicateSelected()` — clones active object at +20px offset
  - `copySelected()` / `pasteClipboard()` — internal clipboard via toObject()/enlivenObjects()
  - `groupSelected()` — wraps ActiveSelection in a Group
  - `ungroupSelected()` — extracts Group children back to canvas
  - `nudgeSelected(dx, dy)` — moves object by pixel amounts
- Added `onLayersChange` callback to CanvasEngineOptions; fires on object:added/object:removed
- Built LayerPanel component with:
  - Front-to-back layer list with type icons (▬ rect, ● circle, T text, etc.)
  - Click to select object on canvas
  - Up/down arrow buttons to reorder z-index
  - Duplicate (⎘) and delete (✕) per-layer buttons (visible on hover/selection)
  - Lock toggle (padlock icon) — locked objects can't be selected/moved
  - Visibility toggle (eye icon) — hidden objects disappear
  - Group/Ungroup buttons in header
  - Scrollable list with max-height
- Expanded keyboard shortcuts in Canvas.tsx:
  - Ctrl+C = Copy, Ctrl+V = Paste, Ctrl+D = Duplicate
  - Ctrl+G = Group, Ctrl+Shift+G = Ungroup
  - Arrow keys = Nudge 1px, Shift+Arrow = Nudge 10px
  - All shortcuts (except undo/redo) disabled while editing text
- Updated App.tsx layout: right sidebar is now a flex column with PropertiesPanel on top and LayerPanel on bottom, both sharing the 256px width
- PropertiesPanel no longer has its own border-l (the container handles it)

**Files Created:**
- `packages/shared/src/layers.ts` — LayerInfo type
- `packages/canvas-engine/src/layers.ts` — getLayerList, getLayerName
- `apps/web/src/components/LayerPanel.tsx` — layer list UI with all controls

**Files Modified:**
- `packages/shared/src/index.ts` — added LayerInfo export
- `packages/canvas-engine/src/canvas-engine.ts` — 12 new layer methods, onLayersChange callback, clipboard field, object:added/removed listeners
- `packages/canvas-engine/src/index.ts` — added layer exports
- `apps/web/src/components/Canvas.tsx` — layersListener, onLayersChange, full keyboard shortcut expansion
- `apps/web/src/components/PropertiesPanel.tsx` — removed w-64 border-l (container handles sizing)
- `apps/web/src/App.tsx` — split right sidebar into PropertiesPanel + LayerPanel

**Decisions Made:**
- Layer reorder uses a loop of `bringObjectForward`/`sendObjectBackwards` because Fabric.js v7 removed `moveTo` — this works reliably for small position changes
- Copy/paste uses an internal clipboard (serialized JSON) rather than the system clipboard — simpler and avoids browser permission issues
- Nudge (arrow keys) doesn't save undo checkpoints per keystroke — this would flood the history stack with tiny moves. Instead, the next manual action (like a drag or property change) captures the state including any nudges
- Lock uses `selectable: false` + `evented: false` + `hasControls: false` — the object stays visible but can't be clicked or manipulated
- Layer panel shows action buttons (reorder/duplicate/delete) on hover to keep the UI clean
- `onLayersChange` fires on `object:added` and `object:removed` Fabric.js events — reorder also triggers it after moving objects

**Next Steps:**
- Phase 1.4: Template System — template data format, template browser, starter templates
- Phase 1.5: Export (PNG, JPG, SVG, PDF)

**Issues:**
- None

---

## Session 8 — 2026-04-07
**Phase:** Phase 1.4 — Template System
**Completed:**
- Built `serialization.ts` module in canvas-engine:
  - `serializeCanvas()` — reads user objects via `toObject()`, wraps in DesignDocument with dimensions + background
  - `deserializeCanvas()` — removes user objects, recreates from JSON via `util.enlivenObjects()`
  - `generateId()` — simple unique ID generator for local use
- Added `toJSON(name, existingId?)` and `fromJSON(doc)` methods to CanvasEngine:
  - `toJSON` captures current canvas state as a DesignDocument
  - `fromJSON` clears canvas, resizes artboard, applies background, loads objects, clears history, fits to screen
  - `currentBackground` tracked on CanvasEngine for serialization
- Updated `DesignDocument.objects` type from `CanvasObject[]` to `Record<string, unknown>[]` — stores raw Fabric.js serialized data for faithful roundtrip of all object types
- Created 9 starter templates in `packages/templates/src/registry.ts`:
  - Social Media: Bold Announcement (IG), Minimal Quote (IG), Gradient Story (IG Story), Event Promo (FB)
  - Video: Bold Thumbnail (YouTube)
  - Presentation: Dark Title Slide (16:9)
  - Print: Modern Business Card, Event Poster
  - Marketing: Sale Banner
  - Each template has realistic objects (rects, textboxes, circles) with proper positioning and styling
- Built `getTemplateCategories()` and `getTemplatesByCategory()` registry functions
- Built TemplateBrowser modal component:
  - Two tabs: "Templates" and "Blank Canvas"
  - Templates tab: grid of template cards organized by category, showing background color preview, name, dimensions
  - Blank Canvas tab: custom dimensions input (width × height, 100-5000px range), preset grids grouped by category with aspect-ratio preview thumbnails
  - Clicking a template calls `engine.fromJSON(template.document)`
  - Clicking a blank preset creates an empty DesignDocument with the chosen dimensions
  - Click backdrop to close, ✕ button, accessible with role="dialog" and aria-modal
- Added "+ New" button to Toolbar (blue, opens template browser)
- Updated App.tsx with `templateBrowserOpen` state and TemplateBrowser mount
- Added `@monet/templates` as dependency of `@monet/web`

**Files Created:**
- `packages/canvas-engine/src/serialization.ts` — serialize/deserialize canvas ↔ DesignDocument
- `packages/templates/src/registry.ts` — 9 templates + category helpers
- `apps/web/src/components/TemplateBrowser.tsx` — modal with templates grid + blank canvas presets

**Files Modified:**
- `packages/shared/src/types.ts` — DesignDocument.objects changed to `Record<string, unknown>[]`
- `packages/canvas-engine/src/canvas-engine.ts` — toJSON(), fromJSON(), currentBackground tracking, serialization import
- `packages/canvas-engine/src/index.ts` — serialization exports
- `packages/templates/src/index.ts` — registry exports
- `apps/web/src/components/Toolbar.tsx` — onNewDesign prop, "+ New" button
- `apps/web/src/App.tsx` — templateBrowserOpen state, TemplateBrowser modal

**Decisions Made:**
- Templates stored as TypeScript objects in a registry array — provides type safety, tree-shaking, and easy addition of new templates without JSON file management
- DesignDocument.objects uses `Record<string, unknown>[]` instead of typed `CanvasObject[]` — necessary because Fabric.js's `toObject()` output varies per object type (textboxes have font props, images have src, etc.) and we need to roundtrip everything
- Serialization works per-object (`obj.toObject()`) rather than `canvas.toJSON()` — this lets us filter out infrastructure objects cleanly
- `fromJSON()` clears undo history — a loaded template/design starts fresh
- Template browser is a modal overlay — no routing needed, stays SPA-simple
- Blank canvas presets reuse `ARTBOARD_PRESETS` from `@monet/shared` — single source of truth
- Template card previews use the background color as a visual proxy — real thumbnail generation deferred

**Next Steps:**
- Phase 1.5: Export — PNG, JPG, SVG, PDF with quality/resolution options
- Phase 1.6: UI/UX Shell — responsive layout, dark mode, keyboard shortcut cheat sheet

**Issues:**
- None

---

## Session 9 — 2026-04-07
**Phase:** Phase 1.4 — Template Expansion (18 templates)
**Completed:**
- Expanded template registry from 9 to 18 templates, hitting all required categories:
  - **Instagram Post (5):** Bold Announcement (dark bg, red accent), Minimal Quote (warm tones, Playfair Display italic), Gradient Promo (pink gradient, CTA button), Tips Card (numbered list, white bg), Product Showcase (split-tone, price tag)
  - **Instagram Story (3):** Gradient Story (purple, swipe-up), Poll Story (this-or-that dual cards), Countdown Story (dark gradient, date, reminder button)
  - **Facebook Post (3):** Event Promo (split color, date block), Customer Testimonial (star rating, quote card), Limited Offer (dark, gold accent, discount code)
  - **YouTube Thumbnail (3):** Bold Thumbnail (split orange/navy), Reaction Thumbnail (gradient, emoji-style), Tutorial Thumbnail (dark, cyan accent, FREE badge)
  - **Presentation (2):** Dark Title Slide (GitHub-style dark), Light Title Slide (white, purple sidebar)
  - **Business Card (2):** Modern Card (white, blue accent, circles), Bold Card (dark, gold accent, logo frame)
- Introduced `tpl()` helper function to reduce registry boilerplate — each template definition is now ~15 lines instead of ~25
- All templates use only shapes, text, and solid/gradient backgrounds — fully self-contained, no external images
- Templates use Inter (primary) and Playfair Display (serif) fonts
- Each template has carefully positioned objects with proper coordinates for its artboard size

**Files Modified:**
- `packages/templates/src/registry.ts` — complete rewrite with 18 templates + `tpl()` helper

**Decisions Made:**
- Used `tpl()` helper to reduce boilerplate — DRY approach cuts each template from ~25 to ~15 lines while keeping the full Template type structure
- Removed the Marketing category (Sale Banner) in favor of the requested categories — Facebook Post now has 3 entries that cover promo/offer use cases
- Thumbnails remain empty strings — generating WebP thumbnails requires rendering each template to a canvas and exporting (needs a headless browser), deferred to Phase 9 polish
- Templates use Unicode characters for decorative text (\u201C for curly quotes, \u00b7 for middle dots, \u2605 for stars) — works across all browsers

**Next Steps:**
- Phase 1.5: Export — PNG, JPG, SVG, PDF
- Phase 1.6: UI/UX Shell

**Issues:**
- None

---

## Session 10 — 2026-04-07
**Phase:** Phase 1.4 — Template Format Fix
**Completed:**
- Fixed a critical issue: templates used simplified "recipe" objects (just type + props), but `deserializeCanvas()` was passing them to Fabric.js `enlivenObjects()` which expects the full verbose `toObject()` format (with version, originX, scaleX, etc.)
- Created `template-loader.ts` — converts recipe objects to real Fabric.js objects using proper constructors (Rect, Circle, Triangle, Textbox, Polygon, Line)
- Updated `deserializeCanvas()` to auto-detect format: checks for `version` field to distinguish full Fabric.js format (from saved designs) vs. simplified recipe format (from templates)
- This means: saved designs roundtrip faithfully via enlivenObjects, and templates load correctly via constructors

**Files Created:**
- `packages/canvas-engine/src/template-loader.ts` — `createObjectsFromRecipes()` function

**Files Modified:**
- `packages/canvas-engine/src/serialization.ts` — format auto-detection in deserializeCanvas
- `packages/canvas-engine/src/index.ts` — added template-loader export

**Decisions Made:**
- Two deserialization paths: `enlivenObjects` for saved designs (full fidelity), `createObjectsFromRecipes` for templates (readable recipes)
- Format detection uses presence of `version` field — `toObject()` always includes it, recipe objects never do
- Template loader uses a switch on `type` to dispatch to the correct Fabric.js constructor, same approach as our shape/text tools

**Next Steps:**
- Phase 1.5: Export — PNG, JPG, SVG, PDF

**Issues:**
- None

---

## Session 12 — 2026-04-07
**Phase:** Phase 1.5 — Export
**Completed:**
- Installed jsPDF for PDF generation
- Built `export.ts` in canvas-engine: PNG, JPG, SVG, PDF export with artboard cropping
- Export uses viewport reset technique: save viewport → reset to identity → hide infrastructure → render → restore → download
- Artboard background included by temporarily un-tagging `__isArtboard`
- Built ExportDialog modal: format picker, quality slider, 1x/2x/3x resolution, filename, output size preview
- Added "Export" button to Toolbar

**Files Created:**
- `packages/canvas-engine/src/export.ts`
- `apps/web/src/components/ExportDialog.tsx`

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — export() method
- `apps/web/src/components/Toolbar.tsx` — Export button
- `apps/web/src/App.tsx` — ExportDialog state

**Next Steps:**
- Phase 1.6: UI/UX Shell

**Issues:**
- None

---

## Session 11 — 2026-04-07
**Phase:** Debugging & Code Cleanup
**Completed:**
- **Root cause found and fixed:** Fabric.js v7 changed default `originX`/`originY` from `'left'`/`'top'` to `'center'`/`'center'` — this caused ALL objects (artboard, shapes, text, template objects) to position from their center instead of top-left corner. Fixed by setting `FabricObjectClass.ownDefaults.originX = 'left'` and `originY = 'top'` globally at engine load time.
- **Artboard rebuild on resize:** `fromJSON()` and `setArtboardDimensions()` now remove the old artboard Rect and create a new one, avoiding Fabric.js render cache stale-size issues.
- **Background preservation:** `fromJSON()` now sets `currentBackground` before creating the artboard, so subsequent rebuilds (from React useEffect) preserve template colors instead of reverting to white.
- **Skip no-op resizes:** `setArtboardDimensions()` returns early if dimensions haven't changed, preventing React's useEffect from overwriting template state.
- **Extracted TaggedObject:** Consolidated 6 duplicate `TaggedObject` interface definitions into a single `tagged-object.ts` file, imported everywhere.
- **Removed debug logging:** All `console.log` debug statements removed from canvas-engine.
- **Dead code removal:** Removed unused `CanvasObject` export from shared, trimmed canvas-engine index exports to only what's needed (`CanvasEngine`, `CanvasEngineOptions`, `MIN_ZOOM`, `MAX_ZOOM`, `DEFAULT_GRID_SIZE`).
- **Template fill fix:** Changed `fill: 'transparent'` to `fill: 'rgba(0,0,0,0)'` for outline-only shapes; added `strokeUniform: true` to stroked rects.
- **Font preloading:** `fromJSON()` now awaits `loadGoogleFont('Inter')` and `loadGoogleFont('Playfair Display')` before rendering template objects.

**Files Created:**
- `packages/canvas-engine/src/tagged-object.ts` — single TaggedObject interface

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — global origin fix, debug removal, artboard rebuild, background tracking, TaggedObject import
- `packages/canvas-engine/src/background.ts` — TaggedObject import, removed duplicate
- `packages/canvas-engine/src/guides.ts` — TaggedObject import, removed duplicate
- `packages/canvas-engine/src/history.ts` — TaggedObject import, removed duplicate
- `packages/canvas-engine/src/layers.ts` — TaggedObject import, removed duplicate
- `packages/canvas-engine/src/serialization.ts` — TaggedObject import, removed duplicate
- `packages/canvas-engine/src/template-loader.ts` — removed per-object origin override (global handles it)
- `packages/canvas-engine/src/index.ts` — trimmed to essential exports only
- `packages/shared/src/index.ts` — removed dead CanvasObject export
- `packages/templates/src/registry.ts` — fixed transparent fills, added strokeUniform
- `docs/ARCHITECTURE.md` — documented origin fix, added tagged-object.ts

**Next Steps:**
- Phase 1.5: Export — PNG, JPG, SVG, PDF

**Issues:**
- None

---

## Session 13 — 2026-04-07
**Phase:** Phase 1.6 — UI/UX Shell
**Completed:**
- Dark mode with localStorage persistence, system preference detection, and Tailwind dark: variants across all components
- Responsive sidebars: toggle buttons in toolbar, absolute overlay positioning on screens < 1024px
- Keyboard shortcut cheat sheet modal (press "?")
- All components polished with dark mode variants

**Files Created:**
- `apps/web/src/hooks/use-theme.ts` — useTheme hook
- `apps/web/src/components/ShortcutSheet.tsx` — shortcut cheat sheet modal

**Files Modified:**
- `apps/web/src/index.css`, `App.tsx`, `Toolbar.tsx`, `BottomBar.tsx`, `Canvas.tsx`, `LeftSidebar.tsx`, `PropertiesPanel.tsx`, `LayerPanel.tsx`, `TemplateBrowser.tsx`, `ExportDialog.tsx`

**Next Steps:**
- Phase 1 Core Editor MVP complete. Next: Phase 2, 3, or 4

**Issues:**
- None

---

## Session 14 — 2026-04-07
**Phase:** Phase 3 — Save, Load & Local Persistence
**Completed:**
- Installed `idb` for promise-based IndexedDB
- Built `db.ts` persistence layer: `saveDesign`, `getDesign`, `getAllDesigns`, `deleteDesign`, `getLastDesign`, `getRecentDesigns`, plus current design ID in localStorage
- Built `useAutosave` hook: debounced 2s auto-save on canvas events (`object:modified/added/removed/path:created`), immediate save on blur/beforeunload, status tracking (`saved`/`saving`/`unsaved`), thumbnail generation via `toDataURL` at 15% scale
- Built `MyDesigns` modal: grid of saved designs with thumbnails, names, dates; rename (inline edit), duplicate, delete actions; empty state message
- Built `file-io.ts`: `exportDesignFile()` downloads `.monet` JSON, `importDesignFile()` opens file picker and validates
- Auto-load on startup: checks `getCurrentDesignId()` in localStorage, loads last design via `fromJSON()`
- Ctrl+S saves immediately, Save button in toolbar
- Save status indicator in toolbar ("Saved"/"Saving..."/"Unsaved" with color coding)
- "My Designs" button in toolbar opens the dashboard
- Save File / Open File toolbar icons for `.monet` export/import
- Updated ShortcutSheet with Ctrl+S under new "File" category

**Files Created:**
- `apps/web/src/lib/db.ts` — IndexedDB CRUD
- `apps/web/src/lib/file-io.ts` — .monet export/import
- `apps/web/src/hooks/use-autosave.ts` — auto-save hook
- `apps/web/src/components/MyDesigns.tsx` — My Designs dashboard modal

**Files Modified:**
- `apps/web/src/App.tsx` — auto-save integration, My Designs, file import/export, auto-load on startup, Ctrl+S
- `apps/web/src/components/Toolbar.tsx` — Save, My Designs, Save File, Open File buttons, save status
- `apps/web/src/components/ShortcutSheet.tsx` — added File category with Ctrl+S

**Next Steps:**
- Phase 2: Stock Assets (Unsplash, icons) or Phase 4: Brand Kit

**Issues:**
- None

---

## Session 15 — 2026-04-07
**Phase:** Phase 2 — Stock Assets & Integrations
**Completed:**
- Built Unsplash API client (`unsplash.ts`): search photos, get thumbnails, track downloads per API guidelines; requires `VITE_UNSPLASH_ACCESS_KEY` env var
- Built icon library (`icons.ts`): ~50 curated icons stored as SVG path data, searchable by name and tags, MIT licensed, 24x24 viewBox stroke-based
- Built unified AssetsPanel component with 3 tabs: Photos (Unsplash search), Icons (searchable grid), Upload (file picker)
- Added `addImageFromUrl(url)` to CanvasEngine — loads image from URL, scales to fit artboard, inserts at center
- Added `addSvgIcon(paths, color)` to CanvasEngine — creates Path objects from SVG path data, groups if multiple, scales to 100px
- Added `.env.example` with `VITE_UNSPLASH_ACCESS_KEY` placeholder
- Added 'assets' to EditorTool union type
- Added Assets icon and panel toggle in LeftSidebar (grid icon below tool strip, separated by divider)
- Photos tab shows "Unsplash not configured" hint with setup instructions if no API key
- Icons render as editable SVG on canvas (recolorable via stroke property)

**Files Created:**
- `apps/web/.env.example` — Unsplash API key template
- `apps/web/src/lib/unsplash.ts` — Unsplash API client
- `apps/web/src/lib/icons.ts` — curated icon library with search
- `apps/web/src/components/AssetsPanel.tsx` — unified Photos/Icons/Upload panel

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — addImageFromUrl, addSvgIcon, Path import
- `apps/web/src/stores/editor-store.ts` — added 'assets' to EditorTool
- `apps/web/src/components/LeftSidebar.tsx` — Assets tool icon, AssetsPanel, AssetsIcon SVG

**Next Steps:**
- Phase 4: Brand Kit & Multi-Format Resize

**Issues:**
- None

---

## Session 16 — 2026-04-07
**Phase:** Phase 4 — Brand Kit
**Completed:**
- Built `brand-kit.ts` persistence layer: `BrandKit` type with colors (up to 12), fonts (heading/subheading/body), logos (base64 data URLs); CRUD via separate `monet-brands` IndexedDB; active kit ID in localStorage; import/export as `.brandkit.json`
- Built `useBrandKit` hook: loads kits from DB, tracks active kit, provides switchKit/createKit/updateKit/removeKit/addColor/removeColor
- Built `BrandKitPanel` component: kit switcher dropdown, create new kit inline, color palette (add via picker, apply on click, remove on right-click), font selectors for heading/subheading/body, logo upload/insert/remove, export/import/delete buttons
- Updated `PropertiesPanel`: `ColorInput` now accepts `brandColors` prop and renders brand color swatches before the native color picker; `FillSection` passes `brandColors` from `useBrandKit` hook
- Added 'brand' to EditorTool type
- Added Brand Kit icon (person icon) and panel in LeftSidebar

**Files Created:**
- `apps/web/src/lib/brand-kit.ts` — BrandKit types, IndexedDB CRUD, import/export
- `apps/web/src/hooks/use-brand-kit.ts` — brand kit state management hook
- `apps/web/src/components/BrandKitPanel.tsx` — brand kit UI panel

**Files Modified:**
- `apps/web/src/stores/editor-store.ts` — added 'brand' to EditorTool
- `apps/web/src/components/LeftSidebar.tsx` — brand tool icon, BrandKitPanel, BrandIcon
- `apps/web/src/components/PropertiesPanel.tsx` — ColorInput with brandColors, useBrandKit import

**Next Steps:**
- Phase 4 continued: Magic Resize
- Phase 5: Backend & Auth

**Issues:**
- None

---

## Session 17 — 2026-04-07
**Phase:** Phase 4 — Magic Resize
**Completed:**
- Installed JSZip for batch export
- Built `resize.ts` in canvas-engine: `resizeDesign(doc, newWidth, newHeight)` — pure function that scales all objects proportionally using `Math.min(scaleX, scaleY)`, centers content via offset, adjusts fontSize/strokeWidth/cornerRadius/radius
- Built `ResizeDialog` modal: shows current format, all other presets grouped by category with checkboxes and aspect-ratio previews; "Open" button per format to resize single; "Batch Export" to render all selected sizes + current as PNGs in a ZIP
- Added `getArtboardDataURL(multiplier)` to CanvasEngine for rendering artboard without downloading
- Batch export: for each selected size, calls `resizeDesign()` → `fromJSON()` → `getArtboardDataURL()` → adds PNG to JSZip → restores original design → downloads ZIP
- Added "Resize" button to Toolbar
- Wired ResizeDialog in App.tsx with `handleOpenResized` callback

**Files Created:**
- `packages/canvas-engine/src/resize.ts` — proportional resize logic
- `apps/web/src/components/ResizeDialog.tsx` — Magic Resize modal

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — getArtboardDataURL method
- `packages/canvas-engine/src/index.ts` — resizeDesign export
- `apps/web/src/components/Toolbar.tsx` — onResize prop, Resize button
- `apps/web/src/App.tsx` — resizeDialogOpen state, handleOpenResized, ResizeDialog mount

**Next Steps:**
- Phase 5: Backend, Auth & Cloud Sync

**Issues:**
- None

---

## Session 18 — 2026-04-07
**Phase:** Phase 5 — Backend API Server
**Completed:**
- Scaffolded `apps/api/` with TypeScript, Hono, sql.js, tsx
- Built `db.ts`: SQLite database via sql.js (pure JS WebAssembly, no native deps); tables for `designs` (id, name, document JSON, thumbnail, timestamps) and `preferences` (key-value); auto-creates DB file at `./data/monet.db`
- Built designs CRUD routes: GET list (lightweight, no full document), GET by ID (full document), POST create, PUT update, DELETE
- Built preferences routes: GET all, GET by key, PUT set
- Health check endpoint at GET `/api/health`
- CORS configured for frontend dev server ports (5173, 5174, 3000)
- Added `pnpm dev:api` and `pnpm dev:all` scripts to root package.json
- Switched from better-sqlite3 (requires Visual Studio C++ build tools) to sql.js (pure JavaScript)
- Frontend continues to work fully without the backend — all backend features are opt-in

**Files Created:**
- `apps/api/package.json` — Hono + sql.js + tsx
- `apps/api/tsconfig.json`
- `apps/api/.gitignore` — excludes data/, dist/
- `apps/api/src/index.ts` — server entry point with CORS + routes
- `apps/api/src/db.ts` — SQLite database module
- `apps/api/src/routes/designs.ts` — designs CRUD
- `apps/api/src/routes/preferences.ts` — preferences CRUD

**Files Modified:**
- `package.json` — added dev:api, dev:all scripts, esbuild to build approvals

**Next Steps:**
- Phase 5 continued: Authentication (email/password, OAuth), cloud storage sync, Docker self-hosting

**Issues:**
- None

---

## Session 19 — 2026-04-07
**Phase:** Phase 5 — Authentication
**Completed:**
- Added `users` and `sessions` tables to SQLite database
- Built `auth.ts` module: password hashing (crypto.scrypt), session creation/validation/deletion, user CRUD, OAuth user find-or-create
- Built auth routes: POST /api/auth/signup (email+password), POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- Built auth middleware: `requireAuth` (returns 401), `optionalAuth` (sets userId if available)
- OAuth endpoint stubs for Google and GitHub (redirect URLs built, callback exchange needs app credentials)
- Built AuthModal frontend component: login/signup form toggle, error messages, "Continue as guest"
- Toolbar shows user name when logged in, "Log in" button when guest, logout icon
- App.tsx checks for existing session on startup via checkAuth() — non-blocking, stays guest if server is down
- CORS updated with `credentials: true` for session cookies
- Session tokens: 32-byte random hex, 30-day expiry, stored in SQLite

**Files Created:**
- `apps/api/src/auth.ts` — password hashing, user CRUD, session management
- `apps/api/src/routes/auth.ts` — signup, login, logout, me, OAuth stubs
- `apps/api/src/middleware/auth.ts` — requireAuth, optionalAuth middleware
- `apps/web/src/components/AuthModal.tsx` — login/signup modal + checkAuth/logout helpers

**Files Modified:**
- `apps/api/src/db.ts` — users + sessions tables, exported saveDB
- `apps/api/src/index.ts` — auth routes, CORS credentials
- `apps/web/src/components/Toolbar.tsx` — user name, login/logout buttons
- `apps/web/src/App.tsx` — auth state, AuthModal, checkAuth on startup

**Next Steps:**
- Phase 5 continued: Cloud sync, Docker self-hosting

**Issues:**
- None

---

## Session 20 — 2026-04-07
**Phase:** Phase 5 — Cloud Sync, Sharing & Self-Hosting
**Completed:**
- Built `sync.ts` client module: `pushDesignUpdate()` (POST/PUT to server), `pullAndMerge()` (fetch server list, merge with local by timestamp), `pushAllLocal()` (batch push), `resolveConflict()` (choose local or server), `getShareLink()`, `isServerAvailable()`
- Conflict resolution: compares `updatedAt` timestamps; if diff < 5 seconds → flags as conflict; otherwise last-write-wins
- Updated `useAutosave` hook: accepts `isLoggedIn` param; when true, pushes to server after every IndexedDB save; added 'syncing' status
- On login: calls `pushAllLocal()` then `pullAndMerge()` — syncs bidirectionally; alerts user if conflicts found
- Added sharing route: GET `/api/share/:id` — public, no auth, returns design JSON for view-only access
- Created `Dockerfile` — multi-stage build (frontend build → API build → production runtime)
- Created `docker-compose.yml` — single service with SQLite volume, configurable env vars
- Created `SELF-HOSTING.md` — setup guide with Docker, Nginx reverse proxy, OAuth config, backup/restore instructions

**Files Created:**
- `apps/web/src/lib/sync.ts` — sync client (push/pull/merge/share)
- `apps/api/src/routes/sharing.ts` — public share endpoint
- `Dockerfile` — multi-stage Docker build
- `docker-compose.yml` — self-hosting config
- `SELF-HOSTING.md` — deployment guide

**Files Modified:**
- `apps/web/src/hooks/use-autosave.ts` — isLoggedIn param, server push, 'syncing' status
- `apps/web/src/App.tsx` — sync on login, import sync functions
- `apps/api/src/index.ts` — sharing route

**Next Steps:**
- Phase 6: AI Features, or Phase 7: Collaboration

**Issues:**
- None

---

## Session 21 — 2026-04-07
**Phase:** Phase 6 — AI Background Removal
**Completed:**
- Installed @huggingface/transformers (formerly @xenova/transformers) for in-browser ML inference
- Built `remove-bg.ts` module: loads RMBG-1.4 model via ONNX WebAssembly, runs image segmentation, applies mask as alpha channel, returns PNG data URL with transparent background
- Added `replaceSelectedImage(dataUrl)` and `getSelectedImageDataUrl()` to CanvasEngine — preserves position/scale/angle when swapping the processed image
- Added "Remove Background" button in PropertiesPanel (shows when an image is selected): purple button with animated spinner, status messages ("Downloading AI model..." / "Removing background..." / "Done!" / "Failed"), first-use download note
- Model lazy-loaded — only downloads (~40MB) when user first clicks the button, cached by browser after
- Entire process is client-side — image never leaves the user's computer

**Files Created:**
- `apps/web/src/lib/remove-bg.ts` — background removal using HuggingFace Transformers.js

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — replaceSelectedImage, getSelectedImageDataUrl
- `apps/web/src/components/PropertiesPanel.tsx` — RemoveBackgroundButton, Spinner, removeBackground import

**Next Steps:**
- Phase 6 continued: Smart suggestions, auto-layout
- Phase 7: Collaboration

**Issues:**
- None

---

## Session 22 — 2026-04-07
**Phase:** Phase 6 — Smart Suggestions & Auto-Layout
**Completed:**
- Built `color-harmony.ts`: `getColorHarmonies(hex)` returns complementary, analogous, triadic, and split-complementary palettes using HSL hue rotation
- Built `font-pairing.ts`: `getFontPairings(font)` returns 3 recommended body fonts for each of the 24 heading fonts in our library
- Added `alignSelected(alignment)` to CanvasEngine: align left/right/top/bottom/center-h/center-v using bounding rect calculations
- Added `distributeSelected(direction)` to CanvasEngine: sort objects by position, calculate equal gaps, reposition middle objects
- Added align + distribute buttons to LayerPanel: 6 alignment icons (left/center-h/right/top/center-v/bottom) + 2 distribute icons (horizontal/vertical), all with SVG icons
- Updated FontFamilySection in PropertiesPanel: shows "Pairs well with:" chips below the font dropdown — click a chip to switch font
- Updated FillSection in PropertiesPanel: shows color harmony swatches (Comp/Anal/Tria/Spli) below the color picker — click a swatch to apply that color

**Files Created:**
- `apps/web/src/lib/color-harmony.ts` — HSL-based color harmony calculations
- `apps/web/src/lib/font-pairing.ts` — font pairing lookup table

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — alignSelected, distributeSelected, getSelectedObjects helper
- `apps/web/src/components/LayerPanel.tsx` — align + distribute button row
- `apps/web/src/components/PropertiesPanel.tsx` — font pairing chips, color harmony swatches

**Next Steps:**
- Phase 7: Real-time Collaboration
- Phase 8: Template Marketplace

**Issues:**
- None

---

## Session 23 — 2026-04-07
**Phase:** Phase 7 — Real-time Collaboration
**Completed:**
- Installed Socket.io (server + client) and Yjs on both API and web
- Built `collab.ts` server module: Socket.io integrated with Hono HTTP server, rooms per design, Yjs doc sync (encode/decode state), cursor presence (10 user colors), comments (add/reply/resolve), permissions (owner/editor/viewer), follow mode (viewport broadcasting), auto-cleanup on disconnect
- Built `collab-client.ts`: joinRoom/leaveRoom, sendCursorMove/sendSelectionChange/sendViewportChange, addComment/replyToComment/resolveComment, setPermission, getInviteLink, isConnected
- Built `useCollaboration` hook: manages collab lifecycle, cursor map, comment state, follow state
- Built `CursorOverlay` component: renders remote cursors as colored SVG arrows with name labels, absolutely positioned, pointer-events-none
- Built `CollabToolbar` component: user avatar circles (color-coded initials, max 5 + overflow), follow on click (blue ring), invite button with editor/viewer link generation + copy-to-clipboard
- Built `CommentsPanel` component: sidebar panel showing open/resolved comments, threaded replies, resolve/unresolve toggle, inline reply input
- Wired into App.tsx: CollabToolbar shown when connected, CursorOverlay over canvas, CommentsPanel as sidebar overlay, comments count button

**Files Created:**
- `apps/api/src/collab.ts` — Socket.io WebSocket server with Yjs + presence + comments + permissions
- `apps/web/src/lib/collab-client.ts` — Socket.io client wrapper
- `apps/web/src/hooks/use-collaboration.ts` — collaboration state hook
- `apps/web/src/components/CollabToolbar.tsx` — avatars + invite UI
- `apps/web/src/components/CursorOverlay.tsx` — remote cursor rendering
- `apps/web/src/components/CommentsPanel.tsx` — comment threads UI

**Files Modified:**
- `apps/api/src/index.ts` — initCollaboration call
- `apps/web/src/App.tsx` — collab hook, CollabToolbar, CursorOverlay, CommentsPanel

**Next Steps:**
- Phase 8: Template Marketplace
- Phase 9: Polish & Accessibility

**Issues:**
- None

---

## Session 24 — 2026-04-07
**Phase:** Phase 8 — Template Marketplace
**Completed:**
- Added marketplace_templates and template_votes tables to SQLite
- Built full marketplace API: browse (search/filter/sort/paginate), get single, creator profile, publish (with moderation), use (increment counter), vote toggle, moderate (approve/reject/staff-pick), delete own
- Built PublishTemplate dialog: name/description/category/tags form, thumbnail generation, submits to API
- Built MarketplaceBrowser modal: search input, category dropdown, sort tabs (newest/popular/staff picks), template card grid with thumbnails/uses/upvotes/staff-pick badge, preview overlay with details, "Use Template" button, pagination
- Added Marketplace button and Publish icon to Toolbar
- Wired into App.tsx with state and handlers

**Files Created:**
- `apps/api/src/routes/marketplace.ts` — marketplace API endpoints
- `apps/web/src/components/PublishTemplate.tsx` — publish dialog
- `apps/web/src/components/MarketplaceBrowser.tsx` — browse/search/preview/use modal

**Files Modified:**
- `apps/api/src/db.ts` — marketplace tables
- `apps/api/src/index.ts` — marketplace route
- `apps/web/src/components/Toolbar.tsx` — Marketplace button, Publish icon, new props
- `apps/web/src/App.tsx` — marketplace state, handlers, dialog mounts

**Next Steps:**
- Phase 9: Polish & Accessibility
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 25 — 2026-04-08
**Phase:** Phase 9 — Polish & Accessibility
**Completed:**
- Installed react-i18next + i18next; created en/es/fr translation files with all UI strings extracted
- Built ErrorBoundary component wrapping Toolbar, Canvas, Left/Right Sidebars — shows "Try again" button on crash
- Built A11y utilities: FocusTrap (Tab cycling in modals), LiveRegion (aria-live for status), SkipLink (skip to canvas), usePrefersReducedMotion hook
- Built Service Worker (sw.js): cache-first for static assets, network fallback, offline index.html for navigation
- Built Onboarding tutorial: 5-step positioned tooltip walkthrough, localStorage-tracked, shows once for new users
- Registered Service Worker in main.tsx
- Added id="canvas-area" on main element for SkipLink target
- Wired ErrorBoundary, SkipLink, LiveRegion, Onboarding into App.tsx

**Files Created:**
- `apps/web/src/i18n/en.ts`, `es.ts`, `fr.ts`, `index.ts` — i18n translations + setup
- `apps/web/src/components/ErrorBoundary.tsx` — crash recovery
- `apps/web/src/components/A11y.tsx` — FocusTrap, LiveRegion, SkipLink, usePrefersReducedMotion
- `apps/web/src/components/Onboarding.tsx` — first-run tutorial
- `apps/web/public/sw.js` — Service Worker for offline support

**Files Modified:**
- `apps/web/src/main.tsx` — i18n import, Service Worker registration
- `apps/web/src/App.tsx` — ErrorBoundary wraps, SkipLink, LiveRegion, Onboarding

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 26 — 2026-04-08
**Phase:** Icon Library Expansion (Phase 2 enhancement)
**Completed:**
- Replaced 58 curated SVG icons with full Lucide icon set (~1937 icons)
- Installed `lucide` npm package (v1.7.0) — provides icon node data for all icons
- Created `lucide-icons.ts` — lazy-loaded icon registry with:
  - Dynamic `import('lucide')` — icon data only fetched when user opens Icons tab
  - 25+ auto-detected categories derived from icon names via regex rules
  - `filterIcons(query, category)` for combined search + category filtering
  - `buildSvgString(nodes)` to convert Lucide node tuples to SVG strings
- Added `addSvgFromString(svgString, color?)` method to CanvasEngine:
  - Uses Fabric.js `loadSVGFromString()` to parse all SVG element types
  - Handles path, circle, rect, line, polyline, ellipse, polygon elements
  - Groups multi-element icons, scales to 100px, centers on artboard
- Rewrote `IconsTab` in AssetsPanel with:
  - Search bar (placeholder: "Search 1900+ icons...")
  - Category filter dropdown (All + 25 categories)
  - Result count display
  - Virtual scrolling grid (44px row height, 5 cols, 4-row buffer)
  - `IconPreview` component renders all 7 SVG element types
- Deleted old `apps/web/src/lib/icons.ts` (curated icon file)
- Build succeeds — lucide chunk auto-split to 95KB gzipped (not in main bundle)

**Files Created:**
- `apps/web/src/lib/lucide-icons.ts` — lazy-loaded Lucide icon registry

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — added `loadSVGFromString` import, `addSvgFromString()` method
- `apps/web/src/components/AssetsPanel.tsx` — rewrote IconsTab with virtual scrolling, categories, lazy loading

**Files Deleted:**
- `apps/web/src/lib/icons.ts` — replaced by lucide-icons.ts

**Decisions Made:**
- Used `lucide` package (not `lucide-react`) — we need raw SVG node data, not React components
- Categories auto-derived from PascalCase icon names via ordered regex rules — avoids maintaining a manual mapping for 1937 icons
- Virtual scrolling implemented manually (no library) — simple math: track scrollTop, compute visible row range, slice icon array. Keeps bundle small
- `addSvgFromString()` added alongside existing `addSvgIcon()` — the old method still works for path-only icons, new method handles all SVG element types
- `IconPreview` uses a switch statement for 7 known SVG tags instead of `createElement(tag)` — type-safe and explicit
- Parent container switches from `overflow-y-auto` to `overflow-hidden` when Icons tab is active — prevents double scrollbars with virtual scroll

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 27 — 2026-04-08
**Phase:** Asset Library Expansion (Phase 2 enhancements)
**Completed:**
- **Pexels integration:** Created `pexels.ts` API client mirroring Unsplash pattern
  - Auth via `Authorization: key` header (different from Unsplash's `Client-ID`)
  - `VITE_PEXELS_API_KEY` env var, documented in `.env.example`
- **Photos tab redesign:**
  - Unsplash/Pexels source toggle (only shown when both API keys configured)
  - Normalized `NormalizedPhoto` type unifies both sources for shared rendering
- **Illustrations tab (new):**
  - 18 original flat-style SVG illustrations across 5 categories (Abstract, Business, Technology, Social, Nature)
  - Search + category filter, 2-column grid with SVG previews
  - Click to insert as editable Fabric.js group (preserves colors, ungroupable)
- **`addIllustration()` engine method** — preserves original fills, scales to 80% artboard
- **AssetsPanel** expanded from 3 to 4 tabs: Photos | Icons | Illus | Upload
- **unDraw NOT integrated** — license prohibits bundling in competing design tools

**Files Created:**
- `apps/web/src/lib/pexels.ts` — Pexels API client
- `apps/web/src/lib/illustrations.ts` — 18 original SVG illustrations

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — added `addIllustration()`
- `apps/web/src/components/AssetsPanel.tsx` — 4 tabs, Pexels toggle, Illustrations tab
- `apps/web/.env.example` — added `VITE_PEXELS_API_KEY`

**Decisions Made:**
- unDraw license changed from MIT to restrictive — used original SVGs instead
- Photos normalized to common type so both sources share rendering code
- Source toggle only shown when both API keys configured
- `addIllustration()` preserves fills unlike `addSvgFromString()` which strips for monochrome icons

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 28 — 2026-04-08
**Phase:** Font System Expansion
**Completed:**
- **Google Fonts catalog:** Fetched metadata for 1929 fonts from Google's public API (`fonts.google.com/metadata/fonts`), generated `google-fonts-catalog.ts` sorted by popularity
- **FontBrowser component:** New standalone component replacing the 24-font dropdown:
  - Search bar ("Search 1900+ fonts...")
  - Category filter (All / Sans Serif / Serif / Display / Handwriting / Monospace)
  - "Recommended" section at top showing the original 24 curated fonts with "REC" badge
  - Virtual scrolling for 1929+ entries (36px row height, 6-row buffer)
  - Lazy font preview: CSS loaded in batches of 20 via Google Fonts CDN as fonts scroll into view
  - Each font name rendered in its own typeface for preview
  - Font pairing suggestions still shown below when closed
  - Category label shown on each font row
- **PropertiesPanel** updated: `FontFamilySection` now delegates to `FontBrowser`
- Removed unused imports (`useRef`, `useEffect`, `FONT_LIST`, `getFontPairings`) from PropertiesPanel

**Files Created:**
- `apps/web/src/lib/google-fonts-catalog.ts` — 1929 fonts with categories, sorted by popularity
- `apps/web/src/components/FontBrowser.tsx` — full Google Fonts browser component

**Files Modified:**
- `apps/web/src/components/PropertiesPanel.tsx` — replaced FontFamilySection with FontBrowser

**Decisions Made:**
- Catalog fetched from Google's public metadata API (no API key needed) — baked into a static TS file
- Font preview CSS loaded lazily per batch (not all 1929 at once) — keeps network usage low
- `FONT_LIST` (24 fonts) preserved in `@monet/shared` — used by BrandKitPanel and as Recommended section
- FontBrowser is a standalone component — complex enough to warrant its own file
- Virtual scrolling uses flat list model: header items + font items in one scrollable list

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 29 — 2026-04-08
**Phase:** Pen Tool — Vector Path Creation
**Completed:**
- **PenTool class** (`pen-tool.ts`): click to place straight-line anchors, click+drag for bezier curves with symmetric control handles, double-click/Enter to finish, click start point to close, Escape to cancel
- **SVG path builder**: constructs path string from PenPoint array (M/L/C/Z commands), handles mixed straight and bezier segments
- **Visual preview**: dashed blue path preview, green dot for start point, white dots for anchors, purple dots and lines for bezier control handles, rubber-band cursor line
- **EditPointsMode class**: select existing Path → enter edit mode → draggable Circle handles at each anchor → drag to reshape → exit commits changes. Coordinate translation via path's transform matrix and pathOffset
- **CanvasEngine integration**: `enablePenTool()`, `disablePenTool()`, `isPenToolActive()`, `enterEditPoints()`, `exitEditPoints()`, `isEditPointsActive()`
- **EditorTool expanded**: added `'pen'` to the union type
- **LeftSidebar UI**: pen tool icon (bezier curve with dots), PenPanel with instructions + keyboard shortcuts + "Edit Points" button
- **Tagged object system**: `__isPenPreview` tag added — preview objects excluded from serialization, layers, and smart guides
- Build succeeds, ~2.5KB gzipped added to bundle

**Files Created:**
- `packages/canvas-engine/src/pen-tool.ts` — PenTool + EditPointsMode classes

**Files Modified:**
- `packages/canvas-engine/src/canvas-engine.ts` — PenTool/EditPointsMode instances + 6 public methods
- `packages/canvas-engine/src/index.ts` — export PenTool, EditPointsMode
- `packages/canvas-engine/src/tagged-object.ts` — added `__isPenPreview` tag
- `packages/canvas-engine/src/layers.ts` — exclude `__isPenPreview` from layer list
- `packages/canvas-engine/src/serialization.ts` — exclude `__isPenPreview` from serialization
- `packages/canvas-engine/src/guides.ts` — exclude `__isPenPreview` from smart guides
- `apps/web/src/stores/editor-store.ts` — added `'pen'` to EditorTool type
- `apps/web/src/components/LeftSidebar.tsx` — pen tool button, PenPanel, PenToolIcon

**Decisions Made:**
- PenTool manages own mouse listeners (not Fabric's isDrawingMode/PencilBrush) — fundamentally different interaction model
- Pen tool disables all object selection while active; restores on deactivate (skips infrastructure objects)
- Bezier handles are symmetric: cpOut = anchor + drag, cpIn = anchor - drag
- Close threshold: 12px from start point triggers close
- Preview objects tagged `__isPenPreview` — excluded from 4 systems (serialization, layers, guides, and cursor interactions)
- Edit Points parses Fabric's internal `path.path` array (not the SVG string) for precise coordinate manipulation
- Closed paths get light blue fill; open paths get no fill

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 30 — 2026-04-08
**Phase:** Clipping Masks, Blend Modes & Precise Positioning
**Completed:**
- **Clipping masks:**
  - `clipToShape()`: select 2 objects → clones bottom as clipPath with `absolutePositioned = true` → applies to top → removes original mask from canvas
  - `unclipObject()`: re-adds clip shape to canvas at 50% opacity, removes clipPath from target
  - "Clip to Shape" button in properties panel (shown for multi-select)
  - "Remove Clip Mask" button (shown when object has clipPath)
  - Help text when neither condition is met
- **Blend modes:**
  - Dropdown with 8 modes: Normal, Multiply, Screen, Overlay, Darken, Lighten, Color Dodge, Color Burn
  - Maps to Fabric.js `globalCompositeOperation` property
  - Read/write in `getSelectedObjectProps()` / `updateSelectedObject()`
- **Precise positioning:**
  - X, Y, W, H number inputs + Rotation with ° suffix
  - Values commit on blur or Enter (no intermediate updates while typing)
  - Width/Height set via `scaleX`/`scaleY` (preserves Fabric.js internal dimensions)
  - `getSelectedObjectProps()` changed to read `left`/`top` directly (not bounding rect) and compute visual W/H as `width * scaleX`
- **`SelectedObjectProps` type** expanded with `blendMode: string` and `hasClipPath: boolean`
- **`updateSelectedObject()`** extended with `blendMode`, `left`, `top`, `width`, `height`, `angle` parameters

**Files Modified:**
- `packages/shared/src/shapes.ts` — added blendMode, hasClipPath to SelectedObjectProps
- `packages/canvas-engine/src/canvas-engine.ts` — clipToShape(), unclipObject(), extended updateSelectedObject/getSelectedObjectProps
- `apps/web/src/components/PropertiesPanel.tsx` — BlendModeSection, TransformSection, ClipMaskSection components

**Decisions Made:**
- clipPath uses `absolutePositioned = true` — stays in canvas coordinates, not relative to clipped object
- Blend modes map to Canvas2D globalCompositeOperation values (source-over = Normal)
- X/Y reads object's `left`/`top` directly instead of `getBoundingRect()` — bounding rect shifts with rotation
- W/H = width × scaleX — setting W changes scaleX, not the raw width property
- TransformInput uses local state + commit-on-blur to prevent fighting with external updates

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 31 — 2026-04-08
**Phase:** Rulers, Advanced Image Filters & Aspect Ratio Lock
**Completed:**
- **Rulers:** pixel measurement rulers along top and left canvas edges
  - Two HTML `<canvas>` elements drawn via requestAnimationFrame
  - Scale with zoom, shift with pan, artboard boundaries highlighted in blue
  - Adaptive tick spacing, corner square, dark mode support
  - Toggle via toolbar button, state in editor store
- **6 new image filters** (total: 10):
  - Hue Rotation (HueRotation, -180° to 180°)
  - Noise (Noise, 0-500)
  - Sharpen (Convolute with scaled kernel, 0-2)
  - Tint (BlendColor with 'tint' mode, color picker + alpha slider)
  - Vignette (custom VignetteFilter, radial darkening, 0-1)
  - All in ImageFiltersSection with "Reset Filters" button
- **Aspect ratio lock:** toolbar toggle, `canvas.uniformScaling` — corners scale proportionally when locked, Shift key toggles temporarily

**Files Created:**
- `apps/web/src/components/Rulers.tsx` — ruler overlay component

**Files Modified:**
- `apps/web/src/stores/editor-store.ts` — `rulersVisible`, `lockAspectRatio` toggles
- `packages/shared/src/image.ts` — 6 new fields in ImageFilterValues
- `packages/shared/src/shapes.ts` — 6 new filter fields in SelectedObjectProps
- `packages/canvas-engine/src/images.ts` — VignetteFilter class, new filter apply/read logic
- `packages/canvas-engine/src/canvas-engine.ts` — `setLockAspectRatio()`, `getViewportTransform()`, new filter reading
- `apps/web/src/components/Canvas.tsx` — Rulers overlay, aspect ratio sync
- `apps/web/src/components/Toolbar.tsx` — rulers + lock toggle buttons with icons
- `apps/web/src/components/PropertiesPanel.tsx` — 6 new filter sliders + tint color picker

**Decisions Made:**
- Rulers use HTML canvas polling (not React state) for 60fps viewport tracking
- VignetteFilter uses `applyTo2d` pixel-level manipulation (no WebGL shader needed)
- Sharpen kernel is dynamically scaled: `[0,-s,0,-s,1+4s,-s,0,-s,0]` for smooth 0-2 range
- Aspect ratio uses canvas-wide `uniformScaling` (not per-object) — Fabric.js default

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 32 — 2026-04-08
**Phase:** Holistic Bug Audit & Fixes
**Completed:**
- Full codebase audit across all components, engine, stores, and shared packages
- Found and fixed 8 bugs:

**Bug 1 — SVG syntax error in illustrations.ts (CRITICAL)**
- `<rect x="70" cy="140" ...>` used `cy` (circle attribute) instead of `y` (rect attribute)
- Celebration illustration rectangle didn't render
- **Fix:** Changed `cy` to `y`

**Bug 2 — Race condition in `clipToShape()` (HIGH)**
- `maskShape.clone().then()` was async without await — `saveCheckpoint()` and `commit()` ran in different ticks
- If user acted between checkpoint and commit, undo/redo history corrupted
- **Fix:** Changed to `async/await` pattern, removed `.then()` callback

**Bug 3 — TransformInput setting state during render (HIGH)**
- Direct `setLocalValue()` call in render body violated React patterns, risked infinite loops
- **Fix:** Moved sync logic into `useEffect([value, label])` — only syncs when not actively editing

**Bug 4 — Pen tool `deactivate()` didn't exclude `__isPenPreview` (MEDIUM)**
- Pen preview objects (anchor dots, lines) would become selectable after deactivation if cleanup failed
- **Fix:** Added `tagged.__isPenPreview` to the infrastructure exclusion check

**Bug 5 — PhotosTab didn't clear results on source switch (MEDIUM)**
- Switching from Unsplash to Pexels showed stale Unsplash results until next search
- **Fix:** Added `useEffect([source])` that clears photos and searched state

**Bug 6 — FontBrowser link ID collision (MEDIUM)**
- Link IDs used only first 3 font names, so different batches starting with same fonts collided
- Second batch's fonts wouldn't load (link already in `injectedLinks` Set)
- **Fix:** Use all font names in the ID, strip non-alphanumeric characters

**Bug 7 — Missing `setCoords()` in `duplicateSelected()` and `pasteClipboard()` (MEDIUM)**
- Duplicated/pasted objects had stale bounding box caches after position offset
- Could cause selection handles to appear misaligned
- **Fix:** Added `cloned.setCoords()` / `obj.setCoords()` after position changes
- Also converted `duplicateSelected()` from `.then()` to `async/await` for undo/redo safety

**Bug 8 — Division by zero in `addIllustration()` (LOW)**
- If SVG parsed to a Group with zero width or height, `Math.min(maxWidth / 0, ...)` = Infinity
- **Fix:** Added guard `if (!group.width || !group.height) return;` after Group creation

**Files Modified:**
- `apps/web/src/lib/illustrations.ts` — SVG rect attribute fix
- `packages/canvas-engine/src/canvas-engine.ts` — clipToShape async/await, duplicateSelected async/await, setCoords in paste, addIllustration guard
- `apps/web/src/components/PropertiesPanel.tsx` — TransformInput useEffect fix, added useEffect import
- `packages/canvas-engine/src/pen-tool.ts` — __isPenPreview exclusion in deactivate
- `apps/web/src/components/AssetsPanel.tsx` — Photo source clear effect
- `apps/web/src/components/FontBrowser.tsx` — Link ID uniqueness fix

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 33 — 2026-04-08
**Phase:** AI Template Generator (Phase 6 stretch goal)
**Completed:**
- **AI generation API client** (`ai-generate.ts`):
  - Calls Anthropic API (`api.anthropic.com/v1/messages`) with `claude-sonnet-4-20250514`
  - Detailed system prompt describing DesignDocument schema, object types, fonts, design guidelines
  - Response parsing: strips markdown fences, parses JSON, validates structure
  - Fills missing fields (version, timestamps, name) with defaults
  - `isAIConfigured()` checks for `VITE_ANTHROPIC_API_KEY` env var
- **AIGenerateDialog component**:
  - Textarea for natural language description
  - 8 quick-select example chips (Instagram sale, YouTube thumbnail, business card, etc.)
  - Clicking a chip sets text AND generates immediately
  - Loading state with spinner
  - Error display for API failures / invalid JSON / missing key
  - Setup instructions when API key not configured
- **TemplateBrowser integration**:
  - New "Generate with AI" tab alongside Templates and Blank Canvas
  - Tab shows button to open the AI dialog
  - On success, loads generated design via `engine.fromJSON()` and closes browser
- **Environment config**: `VITE_ANTHROPIC_API_KEY` added to `.env.example`

**Files Created:**
- `apps/web/src/lib/ai-generate.ts` — Anthropic API client with system prompt + validation
- `apps/web/src/components/AIGenerateDialog.tsx` — AI generation dialog UI

**Files Modified:**
- `apps/web/src/components/TemplateBrowser.tsx` — AI tab, dialog integration
- `apps/web/.env.example` — VITE_ANTHROPIC_API_KEY

**Decisions Made:**
- Bring Your Own Key (BYOK): users paste their own Anthropic API key, stored in localStorage only
- Two-state dialog: connect form (no key) vs generate form (key saved); "Disconnect" link to remove key
- Client-side API calls via `anthropic-dangerous-direct-browser-access` header
- System prompt uses simplified "recipe" format matching template registry
- Validation is lenient: only dimensions + objects required, everything else has defaults
- Example chips trigger immediate generation for faster UX
- 401 errors show "Invalid API key" message; `VITE_ANTHROPIC_API_KEY` env var removed (keys from localStorage)

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 34 — 2026-04-08
**Phase:** Template System Expansion
**Completed:**
- **Save as Template:** IndexedDB storage (`monet-user-templates`) with `saveUserTemplate()`, `getAllUserTemplates()`, `deleteUserTemplate()`. SaveTemplateDialog with name/category/tags inputs. Toolbar button + App.tsx wiring. User templates shown in "My Templates" section of template browser with delete buttons.
- **50 built-in templates** (up from 18): Added 32 new templates:
  - Event Invitations (3): Wedding, Birthday, Corporate
  - Restaurant Menus (2): Cafe, Fine Dining
  - Resumes (3): Modern, Creative, Minimal
  - Infographics (3): Stats, Process Steps, Comparison
  - Newsletters (2): Company, Personal
  - Social Media Stories (5): Product Launch, Behind the Scenes, Sale, Testimonial, Coming Soon
  - Motivational Quotes (3): Sunrise, Bold Modern, Elegant
  - Product Showcases (3): New Arrival, Featured, Comparison
  - Sale/Discount (3): Flash Sale, Seasonal, Clearance
  - Thank You Cards (2): Elegant, Fun
  - Bonus (3): LinkedIn Post, Twitter Header, Event Poster
- **Template Creator Guide** (`docs/TEMPLATE_GUIDE.md`): Complete reference for community contributors covering JSON format, object types, coordinates, fonts, colors, design tips, and example template.

**Files Created:**
- `apps/web/src/lib/user-templates.ts` — IndexedDB CRUD
- `apps/web/src/components/SaveTemplateDialog.tsx` — Save as Template dialog
- `docs/TEMPLATE_GUIDE.md` — Community contributor guide

**Files Modified:**
- `packages/templates/src/registry.ts` — expanded from 18 to 50 templates
- `apps/web/src/components/Toolbar.tsx` — Save as Template button + TemplateIcon
- `apps/web/src/components/TemplateBrowser.tsx` — user templates section, delete button
- `apps/web/src/App.tsx` — SaveTemplateDialog state + import

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 35 — 2026-04-08
**Phase:** Plugin System
**Completed:**
- **Plugin API** (`plugin-api.ts`): typed interface — `canvas` (8 methods), `document` (3 methods), `ui` (registerPanel)
- **Plugin interface:** `{ name, version, init(api), destroy() }` standard module pattern
- **PluginManager** (`plugin-manager.ts`): register/initAll/destroyAll lifecycle, panel tracking, change listeners
- **PluginsPanel** (`PluginsPanel.tsx`): accordion layout in left sidebar, auto-expands first panel
- **3 built-in plugins:**
  - QR Code: `qrcode` npm package → SVG → `addIllustration()`
  - Lorem Ipsum: 5 presets (short/medium/long/heading/subheading) → `addText()`
  - Chart Widget: bar/line/pie charts from comma-separated data → SVG → `addIllustration()`
- Plugins initialized on app startup, cleaned up on unmount
- `EditorTool` expanded with `'plugins'`

**Files Created:**
- `apps/web/src/lib/plugin-api.ts` — API types
- `apps/web/src/lib/plugin-manager.ts` — Manager singleton
- `apps/web/src/plugins/index.ts` — Built-in plugin registration
- `apps/web/src/plugins/qr-code.tsx` — QR Code plugin
- `apps/web/src/plugins/lorem-ipsum.tsx` — Lorem Ipsum plugin
- `apps/web/src/plugins/chart-widget.tsx` — Chart Widget plugin
- `apps/web/src/components/PluginsPanel.tsx` — Sidebar panel

**Files Modified:**
- `apps/web/src/stores/editor-store.ts` — added 'plugins' to EditorTool
- `apps/web/src/components/LeftSidebar.tsx` — Plugins icon + panel
- `apps/web/src/App.tsx` — plugin initialization

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 36 — 2026-04-08
**Phase:** AI Design Assistant
**Completed:**
- **AI Assistant panel** in left sidebar with sparkle icon
- **Design Feedback:** `getArtboardDataURL()` → base64 PNG → Claude Vision → formatted critique on layout/color/typography/hierarchy
- **Suggest Copy:** selected textbox → design context (dimensions, colors, all text) → Claude → 3 clickable alternative texts
- **Translate Design:** all text extracted from DesignDocument → Claude → translated text → `fromJSON()` reload. 12 languages.
- **Inline BYOK:** connect form shown when no key configured, shares localStorage key with template generator
- **`callClaude()` helper:** shared fetch wrapper with error mapping (401 → invalid key)

**Files Created:**
- `apps/web/src/lib/ai-assistant.ts` — 3 API functions + language list
- `apps/web/src/components/AIAssistantPanel.tsx` — panel with FeedbackSection, SuggestCopySection, TranslateSection

**Files Modified:**
- `apps/web/src/stores/editor-store.ts` — added 'ai' to EditorTool
- `apps/web/src/components/LeftSidebar.tsx` — AI icon + panel + AIIcon component

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 37 — 2026-04-08
**Phase:** AI Design Assistant Expansion
**Completed:**
- **Smart Edit:** natural language design instructions → Claude modifies DesignDocument → fromJSON() with undo. 5 quick-example chips. System prompt includes full recipe format.
- **Extract Brand:** upload logo/screenshot → Claude Vision → extracts colors (hex), font recommendations, aesthetic → auto-creates BrandKit in IndexedDB
- **Generate Variations:** current design → Claude → 3 variations (color/font/layout) → thumbnail previews via temporary fromJSON() → click to apply with undo

**Files Modified:**
- `apps/web/src/lib/ai-assistant.ts` — added `smartEdit()`, `extractBrand()`, `generateVariations()` + system prompts + `ExtractedBrand`/`DesignVariation` types
- `apps/web/src/components/AIAssistantPanel.tsx` — added SmartEditSection, ExtractBrandSection, VariationsSection

**Decisions Made:**
- Smart Edit saves history checkpoint before fromJSON() so Ctrl+Z works
- Extract Brand creates a BrandKit via `createEmptyKit()` + `saveBrandKit()` — integrates with existing brand kit system
- Variation thumbnails: save → load each → screenshot at 0.15x → restore. Causes brief canvas flash but accurate previews
- max_tokens scaled per feature: 2048 default, 8192 for smart edit, 16384 for variations

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 38 — 2026-04-08
**Phase:** Rename OpenCanvas → Monet
**Completed:**
- Holistic rename of the entire codebase from "OpenCanvas" to "Monet"
- **Package names:** `@opencanvas/*` → `@monet/*` across all 6 package.json files
- **Source imports:** All `@opencanvas/` imports updated to `@monet/` across 31 TypeScript files
- **String literals:** All `opencanvas` → `monet` in database names, localStorage keys, comments, CSS, etc.
- **Plugin types:** `OpenCanvasPlugin` → `MonetPlugin` (auto-renamed by sed)
- **IndexedDB databases:** `opencanvas-db` → `monet-db`, `opencanvas-brands` → `monet-brands`, `opencanvas-user-templates` → `monet-user-templates`
- **localStorage keys:** All 6 keys renamed (`opencanvas-current-design-id`, `opencanvas-theme`, etc.)
- **Storage migration:** Created `migrate-storage.ts` with `migrateFromOpenCanvas()` — migrates old database names and localStorage keys to new ones on first startup (idempotent)
- **File format:** `.opencanvas` → `.monet` (export/import file extension)
- **UI text:** Toolbar title, onboarding, i18n (en/es/fr), error messages, illustrations
- **Docker:** Container name `opencanvas` → `monet`, volume `opencanvas-data` → `monet-data`
- **HTML:** Page title updated to "Monet"
- **Documentation:** CLAUDE.md, ROADMAP.md, ARCHITECTURE.md, SESSION_LOG.md, TEMPLATE_GUIDE.md, SELF-HOSTING.md all updated
- **Service Worker:** Cache name updated in sw.js

**Files Created:**
- `apps/web/src/lib/migrate-storage.ts` — Migration helper for existing users

**Files Modified (62 total):**
- All 6 `package.json` files
- 31 TypeScript/TSX files (imports, string literals, comments)
- 3 i18n files (en, es, fr)
- 6 documentation files
- `docker-compose.yml`, `Dockerfile`
- `apps/web/index.html`
- `apps/web/public/sw.js`
- `apps/web/src/index.css`
- `apps/web/src/App.tsx` (migration import + call)

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None

---

## Session 39 — 2026-04-08
**Phase:** Conversational AI Design Partner
**Completed:**
- **Chat interface:** replaced 6 isolated AI buttons with scrollable chat conversation. User types messages, Claude responds inline. Auto-scrolls. Message bubbles with user (blue) and assistant (gray) styling.
- **`chatWithClaude()`:** new function that sends conversation history (last 10 messages), current DesignDocument JSON, and optional image to Claude. Single system prompt handles all actions.
- **Smart response parsing:** Claude responds with JSON envelope `{reply, action, design?, designs?, suggestions?}`. Actions: `none` (text only), `modify` (apply design change), `batch` (multiple designs with thumbnails), `suggest_copy` (3 text alternatives).
- **Auto-screenshot:** when user's message references visual elements (regex: look/see/current/design/layout), automatically attaches canvas screenshot via `getArtboardDataURL(0.5)`.
- **Quick-action chips:** Feedback, Smart Edit, Suggest Copy, Translate (with language dropdown), Variations, Batch Generate, Extract Brand — each sends a pre-written message into chat so response appears in conversation context.
- **Batch Generate:** user describes multiple designs → Claude returns array → thumbnails generated by temp-loading each → displayed as clickable grid in chat.
- **Recreate from image:** paste (Ctrl+V) or drag-drop image into chat input → image appears as preview → sent to Claude Vision on send → Claude generates design inspired by it.
- **Copy suggestions in chat:** Claude responds with `suggest_copy` action → 3 clickable text buttons rendered inline in the assistant's message bubble.
- **Design modifications in chat:** `modify` action → `saveHistoryCheckpoint()` + `fromJSON()` → "(Design updated — Ctrl+Z to undo)" appended to reply.

**Files Modified:**
- `apps/web/src/lib/ai-assistant.ts` — added `ChatMessage`, `ChatResponse` types, `chatWithClaude()`, `normalizeDoc()`, `CHAT_SYSTEM` prompt
- `apps/web/src/components/AIAssistantPanel.tsx` — complete rewrite: ChatView, MessageBubble, quick-action chips, image paste/drop

**Next Steps:**
- Phase 10: v1.0 Launch

**Issues:**
- None
