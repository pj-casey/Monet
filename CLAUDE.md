# CLAUDE.md — Monet

> **IMPORTANT: This file is the single source of truth for project context.**
> Claude Code MUST update this file at the end of every session.
> The human developer is a novice — explain decisions, avoid jargon without context, and never assume familiarity with tools or patterns.

## What is this project?
Monet is a free, open-source, web-based graphic design editor — an alternative to Canva. Template-first, drag-and-drop, aimed at non-designers. AGPLv3 licensed.

## Tech Stack
- React 18 + TypeScript + Vite (frontend framework + build tool)
- Fabric.js v6+ (the library that powers the drag-and-drop canvas)
- Tailwind CSS (utility-based styling — write CSS as class names)
- Zustand (lightweight state management — think of it as shared memory between components)
- pnpm workspaces (monorepo tool — one repo, multiple packages)
- Node.js + Hono (backend API server, Phase 5+)
- SQLite / PostgreSQL (database, Phase 5+)

## Project Structure
```
monet/
├── apps/web/                  # The main web app users interact with
├── apps/api/                  # Backend server (Phase 5+, not yet built)
├── packages/canvas-engine/    # All Fabric.js logic lives here (NOT in React components)
├── packages/templates/        # Template JSON files + images
├── packages/shared/           # Types and utilities shared across packages
├── packages/ai/               # AI features like background removal (Phase 6+)
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # How the system is designed
│   ├── ROADMAP.md             # Full development plan
│   └── SESSION_LOG.md         # Record of what was built each session
├── CLAUDE.md                  # THIS FILE — project context for Claude Code
└── CONTRIBUTING.md            # How others can contribute
```

## Key Rules
1. React components NEVER import Fabric.js directly. All canvas operations go through `packages/canvas-engine/`.
2. Zustand stores don't depend on each other (no circular dependencies).
3. Every design is a `DesignDocument` — a JSON object that can be saved, loaded, and shared.
4. The editor MUST work fully client-side. No backend required. Backend features are always optional add-ons.
5. All bundled images, icons, and fonts must use permissive licenses (CC0, MIT, Apache 2.0).
6. TypeScript strict mode. No `any` types unless there's a documented reason.
7. Functional React components only. No class components.
8. All UI must be keyboard-navigable (accessibility is not optional).

## Code Style
- `kebab-case.ts` for regular files, `PascalCase.tsx` for React components
- Named exports preferred (except route/page components use default export)
- Tests go next to the file they test: `foo.ts` → `foo.test.ts`
- JSDoc comments on all public functions

## Commands
```bash
pnpm dev          # Start the development server (opens in browser)
pnpm build        # Create production build
pnpm lint         # Check code for style issues
pnpm typecheck    # Check TypeScript types
pnpm test         # Run tests
```

## Current Status

**Current Phase:** Phase 10 — v1.0 Launch (all prior phases complete)
**Last Updated:** 2026-04-08
**What's Done:**
- Phases 1–3 complete (core editor, stock assets, save/load)
- **Brand Kit:** colors, fonts, logos with multiple kits, import/export, brand colors in color pickers
- **Magic Resize:** click "Resize" in toolbar → pick target formats → proportionally scale and center all objects → open resized version or batch export all sizes as ZIP
- **Resize dialog:** shows all artboard presets (excluding current size), checkbox selection, select all/clear, per-format "Open" button, batch export
- **Proportional scaling:** uses the smaller scale factor (width vs height) so nothing gets cut off, centers content in the new artboard, scales font sizes/stroke widths/corner radii
- **Batch export:** renders each resized version as PNG, packages with JSZip, downloads as a single `.zip` file
- **`getArtboardDataURL()`:** new engine method for rendering artboard without downloading (used by batch export and thumbnails)
- `pnpm build` succeeds, bundle is ~343KB gzipped

**Phase 6 — AI Features (complete):**
- **Background removal:** in-browser via ONNX with RMBG-1.4 model, fully client-side
- **Auto-layout:** align (left/center/right/top/center/bottom) and distribute (horizontal/vertical) selected objects — buttons in layer panel
- **Font pairing:** when editing text, the font dropdown shows "Pairs well with:" suggestions (e.g., Montserrat → Merriweather, Lora, Open Sans)
- **Color harmony:** below the fill color picker, shows complementary, analogous, triadic, and split-complementary color swatches — click to apply

**Phase 7 — Real-time Collaboration (complete):**
- **WebSocket server:** Socket.io integrated with Hono, rooms per design ID
- **Yjs CRDT sync:** conflict-free concurrent editing via Yjs documents, state encoded/decoded as Uint8Array
- **Cursor presence:** color-coded cursors with user names, rendered as SVG overlay on canvas
- **Comments:** positioned on canvas, threaded replies, resolve/unresolve, panel in sidebar
- **Permissions:** owner/editor/viewer roles per user per room, only owners can change permissions
- **Follow mode:** click a user avatar to follow their viewport
- **Invite links:** generate editor/viewer links with copy-to-clipboard
- **CollabToolbar:** user avatars, invite button, comments button — shown when collab is active
- Frontend works fully without collaboration — all collab features are opt-in (requires API server)

**Phase 8 — Template Marketplace (complete):**
- **Publish:** toolbar icon → fill name/description/category/tags → submits to moderation queue
- **Browse:** Marketplace button opens modal with search, category filter, sort (newest/popular/staff picks), pagination
- **Preview:** click template card for details, description, tags, use/upvote counts
- **Use Template:** loads design into editor as a new design, increments use counter
- **Upvote:** toggle upvote per user (requires login)
- **Creator profiles:** API returns all templates by a user + total use count
- **Moderation:** approve/reject/staff-pick via PATCH endpoint
- **Database:** marketplace_templates + template_votes tables in SQLite

**Phase 9 — Polish & Accessibility (complete):**
- **i18n:** react-i18next with English, Spanish, French translations; all UI strings extracted; language stored in localStorage
- **Error boundaries:** ErrorBoundary wraps Toolbar, Canvas, Left/Right Sidebars — crashes show recovery UI instead of white screen
- **Accessibility:** SkipLink (skip to canvas), FocusTrap for modals, LiveRegion for aria-live status announcements, usePrefersReducedMotion hook
- **Service Worker:** offline support with cache-first strategy for static assets, network-first for API calls
- **Onboarding:** 5-step tooltip tutorial for first-time users (tracked in localStorage, shows once, skippable)

**Icon Library Expansion (complete):**
- **Full Lucide set:** replaced 58 curated icons with all ~1937 Lucide icons
- **Lazy loading:** `lucide` package dynamically imported on first Icons tab open (~95KB gzipped chunk, not in main bundle)
- **Category system:** 25+ auto-detected categories from icon names (Arrows, Communication, Media, Commerce, etc.)
- **Searchable:** search by name or category, real-time filtering
- **Category filter:** dropdown to browse by category
- **Virtual scrolling:** only renders visible rows (~8-12 rows) instead of 388+ rows — smooth scrolling with no DOM bloat
- **Full SVG support:** new `addSvgFromString()` engine method handles all SVG element types (path, circle, rect, line, polyline, ellipse, polygon) via Fabric.js `loadSVGFromString()`
- **Icon preview:** `IconPreview` component renders all 7 SVG element types inline

**Asset Library Expansion (complete):**
- **Pexels integration:** second stock photo source alongside Unsplash; Unsplash/Pexels toggle in Photos tab; `VITE_PEXELS_API_KEY` env var
- **Illustrations tab:** 18 original flat-style SVG illustrations across 5 categories (Abstract, Business, Technology, Social, Nature)
- **Photos tab**: shows source toggle when both API keys configured; shows single source label when only one configured; shows setup instructions when neither configured
- **Illustrations insert** as editable Fabric.js groups — users can ungroup and modify individual shapes/colors
- **`addIllustration()`** engine method: preserves original fill colors (unlike `addSvgFromString` which overrides for monochrome icons), scales to fit 80% of artboard
- **AssetsPanel** now has 4 tabs: Photos | Icons | Illus | Upload

**Google Fonts Browser (complete):**
- **Full catalog:** 1929 Google Fonts browsable in the font picker (replaced 24-font hardcoded dropdown)
- **Static metadata:** `google-fonts-catalog.ts` generated from Google Fonts public metadata API, sorted by popularity
- **Categories:** All / Sans Serif (710) / Serif (347) / Display (466) / Handwriting (356) / Monospace (50)
- **"Recommended" section:** the original 24 curated fonts shown at top of the list with "REC" badge
- **Virtual scrolling:** smooth scrolling through 1929+ entries — only renders visible rows
- **Lazy font preview:** CSS for font previews loaded in batches as fonts scroll into view (not all at once)
- **Font preview:** each font name rendered in its own typeface via Google Fonts CSS
- **FontBrowser component:** standalone component in `FontBrowser.tsx`, used by PropertiesPanel
- **Font pairing suggestions** still shown below when dropdown is closed

**Pen Tool — Vector Path Creation (complete):**
- **Pen tool** in left sidebar (icon shows bezier curve with anchor dots)
- **Click** to place straight-line anchor points connected by lines
- **Click + drag** to create bezier curves with symmetric control handles
- **Double-click** or **Enter** to finish an open path
- **Click starting point** (green dot) to close the shape
- **Escape** to cancel the current path
- **Visual preview:** dashed blue line showing path so far, green dot for start, white dots for anchors, purple dots for bezier control handles, rubber-band line from last point to cursor
- **Closed paths** get a light blue fill; open paths get no fill
- **PenTool class** in `pen-tool.ts`: manages its own mouse event listeners, builds SVG path strings (M/L/C/Z commands)
- **Edit Points mode:** select an existing Path, click "Edit Points" in panel → draggable handles appear at each anchor point → drag to reshape → "Done Editing" commits changes
- **EditPointsMode class:** parses Fabric.js Path data, shows Circle handles at anchor points, translates between path-local and canvas coordinates
- `__isPenPreview` tag excludes preview objects from serialization, layers, and smart guides

**Clipping Masks, Blend Modes & Precise Positioning (complete):**
- **Clipping masks:** select 2 objects → "Clip to Shape" button in properties panel → bottom object becomes mask, top object gets clipped via Fabric.js `clipPath` with `absolutePositioned = true`. "Remove Clip Mask" reverses it
- **Blend modes:** dropdown in properties panel with 8 options (Normal, Multiply, Screen, Overlay, Darken, Lighten, Color Dodge, Color Burn) → maps to `globalCompositeOperation`
- **Precise positioning:** X, Y, W, H number inputs + Rotation with degree suffix in properties panel. Commit on blur or Enter. Width/Height change via `scaleX`/`scaleY` (not raw width)
- **`SelectedObjectProps` expanded:** added `blendMode` (string) and `hasClipPath` (boolean)
- `getSelectedObjectProps()` now reads `left`/`top` directly from object (not bounding rect) and computes visual width/height as `width * scaleX`
- `updateSelectedObject()` extended with `blendMode`, `left`, `top`, `width`, `height`, `angle`

**Rulers, Advanced Filters & Aspect Ratio Lock (complete):**
- **Rulers:** pixel measurement rulers along top and left canvas edges, toggle via toolbar button
  - Two HTML canvas elements drawn via requestAnimationFrame (no React re-renders)
  - Auto-scale with zoom, shift with pan, show artboard boundaries as blue highlight
  - Adaptive tick spacing: more detail at high zoom, less at low zoom
  - Corner square at ruler intersection, dark mode support
- **Expanded image filters:** 6 new filters added (total: 10)
  - Hue Rotation (-180° to 180°) via `filters.HueRotation`
  - Noise (0-500) via `filters.Noise`
  - Sharpen (0-2) via `filters.Convolute` with scaled kernel
  - Tint (color picker + intensity slider) via `filters.BlendColor` with mode 'tint'
  - Vignette (0-1) via custom `VignetteFilter` class using `applyTo2d` pixel manipulation
  - All filters have "Reset Filters" button
- **Aspect ratio lock:** toolbar toggle, uses Fabric.js `canvas.uniformScaling`
  - When locked, corner drag handles scale proportionally
  - Hold Shift to temporarily toggle (Fabric.js built-in `uniScaleKey`)

**AI Design Assistant — Conversational (complete):**
- **Chat interface** in left sidebar (sparkle icon) — scrollable conversation with Claude, replaces old isolated buttons
- **`chatWithClaude()`:** sends conversation history (last 10), current DesignDocument JSON, optional image → Claude responds with JSON envelope `{reply, action, design?, designs?, suggestions?}`
- **Auto-screenshot:** when message references visual elements (regex match), automatically attaches canvas screenshot
- **Quick-action chips** above input: Feedback, Smart Edit, Suggest Copy, Translate (with language dropdown), Variations, Batch Generate, Extract Brand — each sends pre-written message into chat
- **Design modifications in chat:** `action: "modify"` → `saveHistoryCheckpoint()` + `fromJSON()` → undo via Ctrl+Z
- **Batch Generate:** `action: "batch"` → array of DesignDocuments → thumbnails rendered via temp-load → clickable grid in chat
- **Recreate from image:** paste (Ctrl+V) or drag-drop image → Claude Vision analyzes → generates new design inspired by it
- **Copy suggestions:** `action: "suggest_copy"` → 3 clickable text buttons inline in assistant's message bubble
- **Standalone functions preserved:** `getDesignFeedback`, `suggestCopy`, `translateTexts`, `smartEdit`, `extractBrand`, `generateVariations` still exist for backward compatibility

**Plugin System (complete):**
- **Plugin API** (`plugin-api.ts`): typed interface exposing `canvas` (addShape, addText, addImageFromUrl, addSvgFromString, addIllustration, getSelectedProps, updateSelected, deleteSelected), `document` (toJSON, fromJSON, getArtboardDimensions), and `ui` (registerPanel) operations
- **Plugin interface:** `{ name, version, init(api), destroy() }` — standard module pattern
- **PluginManager** (`plugin-manager.ts`): registers, initializes, and destroys plugins; tracks registered panels; notifies listeners on changes
- **PluginsPanel** in left sidebar: accordion layout showing all registered plugin panels
- **3 built-in plugins:**
  - **QR Code Generator:** type a URL/text → generates SVG QR code via `qrcode` library → inserts as editable illustration
  - **Lorem Ipsum:** one-click placeholder text insertion — 5 presets (short, medium, long, heading, subheading)
  - **Chart Widget:** pick chart type (bar/line/pie), enter comma-separated values + labels → generates SVG chart → inserts as illustration. No external chart library — SVG generated from scratch
- Plugins initialized on app startup via `registerBuiltinPlugins()` + `pluginManager.initAll()` in App.tsx
- `EditorTool` expanded with `'plugins'`

**Template System Expansion (complete):**
- **Save as Template:** toolbar button saves current design as reusable template in IndexedDB — name, category, tags metadata — appears in "My Templates" section of template browser with delete button
- **50 built-in templates** (up from 18) across 16 categories:
  - Instagram Post (5), Instagram Story (3), Facebook Post (3), YouTube Thumbnail (3)
  - Presentation (2), Business Card (2), Event Invitation (3), Restaurant Menu (2)
  - Resume (3), Infographic (3), Newsletter (2), Social Media Story (5)
  - Motivational Quote (3), Product Showcase (3), Sale/Discount (3), Thank You Card (2)
  - LinkedIn Post (1), Twitter Header (1), Event Poster (1)
- **Template Creator Guide** (`docs/TEMPLATE_GUIDE.md`) — explains JSON format, object types, coordinates, fonts, colors, design tips, and contribution workflow
- **User templates** stored in IndexedDB (`monet-user-templates`) following the brand-kit pattern

**What's Next:** Phase 10 — v1.0 Launch

**Phase 5 — Backend, Auth, Cloud Sync, Self-Hosting (complete):**
- **Hono API server** with SQLite, auth (email/password, sessions), designs CRUD, preferences
- **Cloud sync:** on save, designs push to server if logged in; on login, pull from server and merge with local
- **Conflict resolution:** last-write-wins by timestamp; alert if timestamps within 5 seconds
- **Shareable links:** GET /api/share/:id returns design JSON (public, no auth); `getShareLink()` generates URL
- **Docker Compose:** single `docker compose up` deploys frontend + API + SQLite volume
- **SELF-HOSTING.md:** setup guide with Nginx reverse proxy, OAuth config, backup/restore
- Frontend works fully without the backend — all cloud features are opt-in
**AI Template Generator (complete):**
- **"Generate with AI" tab** in the template browser — describe a design in natural language, Claude creates it
- **Bring Your Own Key (BYOK):** users connect their own Anthropic account by pasting their API key in the dialog — key stored in localStorage only, never sent to any server except api.anthropic.com
- **Two-state dialog:** no key → "Connect your Claude account" form with instructions; key saved → design prompt with example chips
- **Anthropic API integration:** calls `claude-sonnet-4-20250514` via `api.anthropic.com/v1/messages` (client-side, no backend needed)
- **System prompt:** detailed schema instructions — DesignDocument format, object types, coordinate system, available fonts, design guidelines
- **8 example prompt chips:** quick-select common designs (Instagram sale, YouTube thumbnail, business card, etc.)
- **Validation:** parses response JSON, strips markdown fences, fills missing fields with defaults
- **Disconnect:** users can remove their key at any time ("Disconnect Claude account" link)
- **Error handling:** API errors, invalid JSON, 401 → "Invalid API key" message

**Bug Audit (Session 32 — complete):**
- Fixed 8 bugs across engine, UI, and data: SVG syntax error, async race conditions in clipToShape/duplicateSelected, React state-during-render violation, pen tool cleanup, photo source switch, font preview link collisions, missing setCoords() calls, division by zero guard
- `clipToShape()` and `duplicateSelected()` converted from `.then()` to `async/await` to prevent undo/redo history corruption
- All async operations in canvas-engine now properly await before committing to history
**Known Issues:** None — thumbnail generation deferred (browser shows background color as proxy)
**Key Decisions Made:**
- All previous decisions still apply
- **Fabric.js v7 origin fix:** `FabricObject.ownDefaults.originX/originY` set to `'left'`/`'top'` globally — v7 defaults to `'center'` which broke all coordinate positioning
- `TaggedObject` interface extracted to `tagged-object.ts` (was duplicated in 6 files)
- `fromJSON()` recreates artboard from scratch (removes old, creates new) to avoid Fabric.js render cache stale-size issues
- `setArtboardDimensions()` skips if dimensions unchanged (prevents React useEffect from overwriting template state)
- `fromJSON()` sets `currentBackground` before creating artboard (so subsequent rebuilds preserve template colors)
- Templates use simplified "recipe" format with `template-loader.ts` converting to Fabric.js objects via constructors
- `deserializeCanvas()` auto-detects format via `version` field presence
- Dead code removed: unused `CanvasObject` export, unused `ui-store.ts`, redundant canvas-engine exports trimmed
- Export uses viewport reset trick: saves current viewport, sets to identity [1,0,0,1,0,0], renders artboard area, restores viewport
- Artboard background included in export by temporarily un-tagging the artboard rect so `hideInfrastructure()` skips it
- PDF uses jsPDF with `unit: 'px'` and `hotfixes: ['px_scaling']` for pixel-accurate page dimensions
- SVG export uses Fabric.js `toSVG()` with `viewBox` for artboard cropping
- Dark mode uses Tailwind `@custom-variant dark (&:where(.dark, .dark *))` + class on `<html>`
- `useTheme` hook manages theme state, localStorage persistence, and system preference detection
- Responsive uses `max-lg:` Tailwind variant — sidebars become absolute-positioned overlays below 1024px
- Shortcut sheet listens for "?" key on `document`, skips when focus is in input/textarea
- IndexedDB uses `idb` library with promise API; database `monet-db`, store `designs`, index `updatedAt`
- Auto-save debounced 2 seconds via `useAutosave` hook; saves on `object:modified/added/removed/path:created` events
- Thumbnail generated at export-time by `toDataURL` at 15% scale (small, fast)
- `.monet` files are plain JSON (DesignDocument) — no binary, fully portable
- Current design ID tracked in localStorage so startup knows what to reload
- `useAutosave` hook manages save lifecycle — `markDirty()`, `saveNow()`, `loadDesign()`, `newDesign()`
- Unsplash API key from `import.meta.env.VITE_UNSPLASH_ACCESS_KEY` (Vite exposes `VITE_` prefixed vars)
- Icons are curated SVG path data (not full Lucide package) — ~50 icons keep bundle small
- Icons inserted as Fabric.js Path objects (stroke-based, recolorable via stroke color)
- `addSvgIcon` scales icons from 24x24 viewBox to 100px on canvas
- Assets panel uses 3 tabs (Photos/Icons/Upload) in a single component, no route changes
- Brand kits stored in separate IndexedDB database (`monet-brands`) to avoid schema migrations on the designs DB
- `useBrandKit` hook loads kits on mount, tracks active kit, provides CRUD + color add/remove
- Brand colors injected into PropertiesPanel's `ColorInput` via `brandColors` prop — shown as small swatches before the native picker
- Logos stored as base64 data URLs in the kit object (not in a separate blob store) for simplicity
- Brand kit import assigns a new ID to avoid overwriting existing kits
- Magic Resize uses `Math.min(scaleX, scaleY)` for uniform scaling — objects stay proportional, centered via offset
- Batch export temporarily loads each resized doc via `fromJSON`, renders via `getArtboardDataURL`, then restores original
- JSZip generates the zip client-side — no server needed
- `resizeDesign()` is a pure function (no canvas needed) — takes a DesignDocument and returns a new one
- API uses sql.js (not better-sqlite3) — pure JS SQLite via WebAssembly, no Visual Studio C++ build tools needed
- API runs on port 3001 by default (`PORT` env var to override)
- `pnpm dev:api` starts the API server, `pnpm dev:all` starts both frontend and API
- Database file at `apps/api/data/monet.db` — gitignored, auto-created on first run
- Auth uses Node.js built-in `crypto.scrypt` for password hashing — no external auth library needed
- Sessions are random 32-byte hex tokens stored in SQLite, 30-day expiry
- `requireAuth` middleware returns 401 if not authenticated; `optionalAuth` sets userId if available
- OAuth endpoints are stubs — redirect URLs built but callback exchange needs Google/GitHub app credentials
- Frontend AuthModal: checkAuth() on startup is non-blocking — if server is down, app stays in guest mode silently
- CORS has `credentials: true` to allow session cookies cross-origin
- Sync strategy: local-first, server is optional backup; push on every save, pull+merge on login
- Conflict resolution: compare `updatedAt` timestamps; if diff < 5 seconds → alert user; otherwise last-write-wins
- Sharing uses the design ID as a public link — GET /api/share/:id returns document without auth
- Docker uses multi-stage build: frontend built with Vite, API runs with tsx, SQLite in a Docker volume
- Background removal uses @huggingface/transformers with RMBG-1.4 model, runs entirely client-side via ONNX WebAssembly
- Model is lazy-loaded — only downloads when user clicks "Remove Background" for the first time
- `getSelectedImageDataUrl()` renders the FabricImage element to a temp canvas to get the source data
- `replaceSelectedImage()` preserves position/scale/angle of the original image when swapping in the result
- Auto-layout: `alignSelected()` aligns to min/max/average of bounding rects; `distributeSelected()` sorts by position and spaces evenly
- Font pairings stored as a static lookup table — serif headings suggest sans-serif body and vice versa
- Color harmony uses HSL color space: hex → HSL → rotate hue → back to hex. Complementary=180°, Analogous=±30°, Triadic=±120°
- Suggestions are non-intrusive: small chips below the relevant control, one click to apply
- Collaboration uses Socket.io rooms (one room per design ID) with Yjs for CRDT sync
- Cursor positions sent via `cursor-move` event, rendered as absolute SVG overlay
- Comments stored in server memory per room (not persisted to DB — cleared when room empties)
- Permissions map stored per room; only `owner` role can call `set-permission`
- USER_COLORS array cycles through 10 distinct colors for user identification
- `useCollaboration` hook manages entire collab lifecycle; components are conditionally rendered when `connected`
- Full Lucide icon set (~1937 icons) replaces the old 58-icon curated set — `lucide` npm package used for icon node data
- Icons lazy-loaded via dynamic `import('lucide')` — the ~95KB gzipped chunk only loads when user opens Icons tab
- Icon categories auto-derived from PascalCase icon names via regex rules in `lucide-icons.ts`
- `addSvgFromString()` uses Fabric.js `loadSVGFromString()` to handle all SVG element types (not just `<path>`)
- Virtual scrolling in Icons tab: 44px row height, 5 columns, 4-row buffer — only DOM-renders visible rows
- `IconPreview` component uses a switch statement to render 7 SVG element types (path, circle, rect, line, polyline, ellipse, polygon)
- Old `icons.ts` with curated SVG path data deleted — no longer needed
- Pexels API client (`pexels.ts`) mirrors `unsplash.ts` pattern — same structure, different endpoint/auth
- Pexels uses `Authorization: {key}` header (not `Client-ID {key}` like Unsplash)
- Photos are normalized to a common `NormalizedPhoto` type — both sources share the same grid rendering code
- Photos tab shows source toggle only when both API keys are configured; single source when one; setup instructions when none
- Unsplash download tracking still called for Unsplash photos (required by their API guidelines); Pexels has no equivalent requirement
- Illustrations are original SVGs (400×300 viewBox) bundled in `illustrations.ts` — no external dependencies or license concerns
- `addIllustration()` preserves original fill/stroke colors (unlike `addSvgFromString` which overrides all to stroke-only)
- `addIllustration()` scales to fit 80% of artboard (same logic as `addImageFromUrl`) and centers
- Illustration previews use `dangerouslySetInnerHTML` for the SVG thumbnails — safe because the SVG strings are our own bundled content, not user input
- unDraw was NOT integrated due to license change — their current license prohibits bundling in competing design tools and automated access
- Google Fonts catalog fetched from `https://fonts.google.com/metadata/fonts` (public, no API key) and baked into `google-fonts-catalog.ts` at build time
- Catalog is 62KB uncompressed (~15KB gzipped contribution to bundle) — just `[fontFamily, category]` tuples sorted by popularity
- Font preview CSS loaded in batches of 20 as fonts scroll into view — uses `<link>` tag injection to Google Fonts CDN (no API key needed for CSS)
- `previewLoaded` Set and `injectedLinks` Set track which fonts have been loaded to avoid duplicate requests
- FontBrowser is a standalone component (not inline in PropertiesPanel) — complex enough to warrant its own file
- `FONT_LIST` (24 curated fonts) still exported from `@monet/shared` — used by BrandKitPanel and as the "Recommended" section in FontBrowser
- `FontName` type in shared package still works — existing code that uses the 24-font type doesn't break
- Virtual scrolling uses same approach as icon browser: ROW_HEIGHT × total rows for container, absolute positioning for visible slice
- Flat list model: Recommended header + recommended fonts + All Fonts header + catalog fonts — one unified virtual-scrollable list
- PenTool class manages its own mouse event listeners on the Fabric canvas — separate from the drawing mode system (PencilBrush)
- Pen tool disables object selection while active (`canvas.selection = false`, all objects `selectable = false`)
- Pen tool deactivation restores selectability except for infrastructure objects (artboard, grid, etc.)
- Bezier control handles are symmetric: cpOut = anchor + drag offset, cpIn = anchor - drag offset
- SVG path string built from PenPoint array: `M` for start, `L` for straight lines, `C` for cubic beziers, `Z` for close
- Preview uses temporary Fabric.js objects (Circle, Line, Path) tagged with `__isPenPreview` — excluded from serialization, layers, and smart guides
- Close threshold: 12px from starting point triggers path close
- Edit Points mode parses `path.path` (Fabric.js internal path data array) and creates Circle handles at anchor positions
- `pathToCanvas()` / `canvasToPath()` use path's `calcTransformMatrix()` and `pathOffset` for coordinate transformation
- `EditorTool` type expanded with `'pen'` — added to Zustand store union type
- Clipping uses `absolutePositioned = true` on the clip path — keeps it aligned with the canvas, not relative to the clipped object
- `clipToShape()` clones the mask shape via `maskShape.clone()`, removes original from canvas, sets clone as `target.clipPath`
- `unclipObject()` re-adds the clip shape to the canvas with `opacity: 0.5` and removes `clipPath` from the target
- Blend modes map to Canvas2D `globalCompositeOperation` values: `source-over` = Normal, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`
- `getSelectedObjectProps()` changed from `getBoundingRect()` to direct properties for X/Y/W/H — bounding rect changes with rotation, direct properties are what users expect to edit
- Width/Height precision: setting width sets `scaleX = newWidth / obj.width` (not `obj.width` directly) — Fabric.js tracks scale and base dimensions separately
- TransformInput uses local state + blur/Enter commit pattern — prevents input from updating while user is typing
- Rulers use two HTML `<canvas>` elements with requestAnimationFrame polling — only redraws when viewport transform actually changes (cheap string comparison)
- Ruler tick interval adapts to zoom: candidates [10,20,50,100,200,500,1000,2000,5000], picks first where `interval * zoom >= 60px`
- Canvas DPR scaling: `canvas.width = cssWidth * devicePixelRatio` for crisp rendering on HiDPI
- Custom `VignetteFilter` extends `filters.BaseFilter` with `applyTo2d` — iterates all pixels, darkens based on radial distance from center
- Sharpen filter uses dynamic convolution kernel: `[0, -s, 0, -s, 1+4s, -s, 0, -s, 0]` where s = intensity, allowing smooth 0-2 range
- Tint uses `filters.BlendColor({ mode: 'tint', color, alpha })` — picks color on first use, defaults to `#ff6600` if none set
- `readFilterValues()` reverse-engineers sharpen intensity from convolution matrix center value: `(center - 1) / 4`
- Aspect ratio lock uses `canvas.uniformScaling` (canvas-wide) — Fabric.js's built-in `uniScaleKey = 'shiftKey'` toggles it
- `getViewportTransform()` added to engine for ruler rendering — returns a copy of the 6-element transform array
- `rulersVisible` and `lockAspectRatio` added to editor store with toggle functions
- AI generator uses Bring Your Own Key (BYOK) — each user stores their own Anthropic API key in localStorage (`monet-anthropic-key`)
- `anthropic-dangerous-direct-browser-access: true` header required for client-side API calls
- `saveApiKey()` / `clearApiKey()` manage localStorage; `isAIConfigured()` checks if key exists
- Dialog has two states: no key → connect form (password input, instructions); key saved → generate form (prompt, chips)
- System prompt uses simplified "recipe" format (not full Fabric.js toObject format) — same as templates in registry.ts
- Response parsing strips markdown code fences since the model sometimes includes them despite instructions
- `validateDesignDocument()` fills missing fields with defaults — only dimensions and objects are required
- 401 API errors trigger "Invalid API key" message; users can disconnect and re-enter
- No env var needed — `VITE_ANTHROPIC_API_KEY` removed from `.env.example` since keys come from user input
- User templates stored in IndexedDB (`monet-user-templates`, store: `templates`, keyPath: `id`) following brand-kit pattern
- `SaveTemplateDialog` captures current canvas state via `engine.toJSON()` and saves as `UserTemplate` with name/category/tags
- User templates shown above built-in templates in browser, with per-template delete button (red X on hover)
- `TemplateBrowser` loads user templates via `useEffect([isOpen])` — fetches from IndexedDB each time browser opens
- 50 built-in templates use only shapes and text (no images) for zero external dependencies
- Template Creator Guide covers the recipe format, not the full Fabric.js toObject format
- Plugin API is a bridge object created by PluginManager — wraps engine methods with a stable interface
- Plugins access the engine singleton indirectly (never import it directly) — the API bridge isolates them
- Plugin panels are React components registered via `api.ui.registerPanel({ id, label, icon, component })`
- PluginsPanel uses accordion layout — only one plugin panel expanded at a time
- Panel change subscription uses a simple listener array pattern (not Zustand) since plugins are outside React
- QR Code uses `qrcode` npm package's `toString()` with `type: 'svg'` for clean SVG output
- Chart widget generates SVG strings from scratch — bar/line/pie charts without any chart library
- Built-in plugins registered in `plugins/index.ts`, initialized in App.tsx useEffect with cleanup via destroyAll()
- AI Design Assistant shares the same localStorage key (`monet-anthropic-key`) as the AI template generator
- Design Feedback uses Claude Vision API — sends image as `{ type: 'image', source: { type: 'base64', media_type: 'image/png', data } }` in the messages array
- Suggest Copy extracts all text from `doc.objects` where `type === 'textbox'` for context; guesses format from dimensions (square = social media, landscape = banner, portrait = story)
- Translate replaces text in the DesignDocument JSON objects array and reloads via `engine.fromJSON(doc)` — preserves all styling, positions, and colors
- `callClaude()` is a shared helper in `ai-assistant.ts` for all 3 features — handles auth, error mapping (401 → invalid key), response extraction
- AI panel uses `onSelectionChange` subscription directly (not via parent props) to track selected text objects independently
- `EditorTool` expanded with `'ai'` — sparkle icon in sidebar between Plugins and the tools divider
- Smart Edit uses `engine.saveHistoryCheckpoint()` before `fromJSON()` so users can Ctrl+Z to undo the AI edit
- Smart Edit system prompt includes full recipe format docs so Claude knows how to add/modify objects correctly
- Smart Edit uses max_tokens=8192 (larger than other calls) since it returns the full DesignDocument
- Extract Brand creates a new BrandKit via `createEmptyKit()` + `saveBrandKit()` and calls `refresh()` on the useBrandKit hook
- Extract Brand system prompt restricts font recommendations to the 24 available fonts in FONT_LIST
- Generate Variations uses max_tokens=16384 (largest call) since it returns 3 full DesignDocuments
- Variation thumbnails generated by: save current → `fromJSON(variation)` → `getArtboardDataURL(0.15)` → restore original. Brief canvas flash during generation.
- All 6 AI functions share the same `callClaude()` helper — consistent error handling and auth

---

## SESSION UPDATE PROTOCOL

**Claude Code: you MUST follow this protocol at the end of every work session.**

### After completing any task:

1. **Update "Current Status" above** with:
   - Current phase and subtask
   - What was completed this session
   - What should be done next
   - Any bugs, blockers, or known issues
   - Any architecture or design decisions that were made

2. **Append to `docs/SESSION_LOG.md`** with a new entry:
   ```markdown
   ## Session [DATE or NUMBER]
   **Phase:** [current phase]
   **Completed:**
   - [what was built/changed]
   **Files Created/Modified:**
   - [file paths]
   **Decisions Made:**
   - [any technical decisions and WHY]
   **Next Steps:**
   - [what to work on next]
   **Issues:**
   - [any bugs or concerns]
   ```

3. **Update `docs/ROADMAP.md`** — check off completed tasks:
   - Change `- [ ]` to `- [x]` for finished items

4. **Update `docs/ARCHITECTURE.md`** if any of these changed:
   - New packages or major files added
   - Store structure changed
   - API interfaces changed
   - New patterns established

5. **Tell the human** what was updated and if they need to re-upload any files to their Claude.ai Project knowledge base. Say something like:
   > "I've updated CLAUDE.md, SESSION_LOG.md, and checked off tasks in ROADMAP.md. You don't need to re-upload anything to your Claude.ai Project unless [specific reason]."

### Why this matters:
- Claude Code has no memory between sessions. This file IS the memory.
- The human is a novice and may not know what changed or what to do next.
- Keeping docs accurate means the next session starts smoothly instead of confused.

---

## NOVICE DEVELOPER PROTOCOL

The human working on this project is learning as they go. Claude Code must:

1. **Explain what you're doing and why** before writing code. Example:
   > "I'm creating a Zustand store — this is basically a shared container that holds data (like which tool is selected) so that different parts of the app can all access and update it without passing data through every component."

2. **Explain terminal commands** before running them. Example:
   > "I'm going to run `pnpm add fabric` — this downloads the Fabric.js library and adds it to our project so we can use it in our code."

3. **Flag anything that needs manual action** clearly. Example:
   > "⚠️ ACTION NEEDED: You need to copy your Unsplash API key into the `.env` file. Here's how..."

4. **Never assume familiarity** with Git, npm/pnpm, TypeScript generics, React patterns, or DevOps concepts. Explain or offer to explain.

5. **When something breaks**, explain what the error means in plain language before fixing it.

6. **After each session**, give a plain-language summary:
   > "Today we built the shape tool — you can now add rectangles, circles, and triangles to the canvas by clicking them in the left sidebar. Tomorrow we should work on the image upload tool."
