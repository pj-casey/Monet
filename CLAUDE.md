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

## Monetization Principles
1. The tool is free. Forever. For everyone. No asterisks.
2. Paid tiers sell infrastructure, never capabilities.
3. Self-hosted = full product. No artificial limitations.
4. Undercut every competitor. Cloud at $5/month. Teams at $8/user/month.
5. No crown icons. No "upgrade to unlock." No feature gates.
6. 80/20 marketplace split favoring designers.
7. No ads. Ever.
8. No metered pricing. Flat monthly price.
9. Student/nonprofit discount (50% off Cloud, free Teams for verified nonprofits).
10. Cancel in one click. Always.

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
**Last Updated:** 2026-04-12
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

**UI/UX Overhaul — Entry Experience & Layout Restructure (complete):**
- **Welcome Screen:** replaces blank-canvas default. New users see "What do you want to create?" with 6 category cards (Social Media, Presentation, Print, Marketing, Event, Video). Each card filters templates inline. Includes "Blank Canvas" option with dimension presets. Returning users see a dashboard of saved designs with thumbnails, duplicate/delete, and "+ Create New" button
- **Left sidebar restructured:** replaced narrow icon strip (w-14) + expandable panels with a single wide panel (~280px) with 5 labeled tabs: Design | Elements | Text | Upload | AI
  - **Design tab:** browse templates, magic resize, save as template, brand kit, plugins
  - **Elements tab:** shapes + icons + illustrations + stock photos with unified search bar and filter chips (All / Shapes / Icons / Illus / Photos)
  - **Text tab:** text presets (heading/subheading/body) with click-to-add
  - **Upload tab:** full-height drag-and-drop upload zone
  - **AI tab:** AI assistant chat panel
- **Right sidebar now contextual:** only slides in (w-64) when an object is selected. When nothing selected, right side is empty canvas space. Contains two tabs: Properties | Layers
- **Toolbar simplified:** Left = Monet logo + undo/redo + auto-save badge (green/yellow pill). Center = Select/Draw/Pen tool switcher (segmented control) + zoom controls. Right = Share + Export buttons + overflow menu (...) containing My Designs, file import/export, grid/snap/guides/rulers toggles, dark mode, shortcuts, login/logout
- **New component:** `WelcomeScreen.tsx` — full-screen entry experience
- **New component:** `RightSidebar.tsx` — contextual wrapper with Properties/Layers tabs
- **App.tsx refactored:** tracks `view` state ('welcome' | 'editor'), shows WelcomeScreen when no design loaded, transitions to editor on design open/create

**UI/UX Overhaul — Visual Polish & Micro-interactions (complete):**
- **Accent color:** replaced all blue Tailwind classes with violet (`#7C3AED` / `violet-600`) across 27 component files. All primary actions, active states, and interactive highlights now use violet. Everything else stays neutral gray
- **Dark mode first:** new users default to dark mode (changed `use-theme.ts`). System preference detection removed — dark is the default, users can switch to light in the toolbar menu
- **Global CSS (`index.css`) expanded with:**
  - Keyframe animations: `save-pulse` (600ms glow on auto-save), `slide-in-right` (180ms panel entry), `fade-in` (150ms modal overlay), `scale-up` (200ms modal pop), `tooltip-pop` (200ms for onboarding)
  - Global button transitions: 150ms ease on background, border, color, shadow, transform, opacity
  - Custom scrollbar styling: thin 6px bars, subtle colors, dark mode support
- **Micro-interactions:**
  - Save status badge pulses briefly when auto-save completes (tracks `saving` → `saved` transition, applies `animate-save-pulse` class)
  - All modals (ExportDialog, ShortcutSheet, MyDesigns, TemplateBrowser) use `animate-fade-in` on backdrop + `animate-scale-up` on content + `backdrop-blur-sm` for frosted glass effect
  - Toolbar overflow menu uses `animate-scale-up` for pop-in
  - Right sidebar content uses `animate-fade-in` when selection changes
  - Onboarding tooltip uses `animate-tooltip-pop` for slide-up entry
- **Consistent border-radius:** modals upgraded from `rounded-xl` to `rounded-2xl`, toolbar overflow menu `rounded-xl`, all buttons `rounded-lg`
- **Increased spacing:** toolbar `px-3` → `px-4`, sidebar tab bars `px-1`, Design tab `p-3` → `p-4`, action buttons `py-3` → `py-3.5`, icon backgrounds `h-9 w-9` → `h-10 w-10`, search inputs `py-1.5` → `py-2`, filter chips `gap-1` → `gap-1.5`
- **Box shadows:** toolbar gets `shadow-sm`, left sidebar gets `shadow-sm`, right sidebar gets `shadow-sm`, modals keep `shadow-2xl`
- **Warm empty states redesigned:**
  - Properties panel: icon in rounded container + "Nothing selected" + helpful subtitle
  - Layer panel: layered-rectangles icon + "No layers yet" + "Add shapes, text, or images to get started"
  - My Designs: large violet icon in pill + "No designs yet" + encouraging message
- **Onboarding replaced:** removed 5-step tooltip walkthrough. Welcome screen IS the onboarding for new users. Now shows ONE contextual tooltip at bottom-center when first entering the editor: "Click any element to edit it / Properties will appear on the right." Auto-dismisses after 6 seconds or on "Got it" click. Dark/light theme aware.
- **Design tab icons:** action button icon backgrounds changed from gray to violet-tinted (`bg-violet-50 text-violet-500 dark:bg-violet-900/20 dark:text-violet-400`)
- **Search inputs improved:** focus states use violet ring (`focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30`), background changes on focus (`bg-gray-50` → `bg-white`)

**UI/UX Overhaul — AI Integration & Cohesion (complete):**
- **AI panel rewrite (`AIAssistantPanel.tsx`):** fully conversational design — user messages right-aligned with violet bubbles, Claude messages left-aligned with gray bubbles + sparkle avatar. Animated typing indicator (3 bouncing dots). Quick-action chips above input: "Get feedback", "Suggest copy", "Smart edit", "Translate" with emoji icons. Connect screen redesigned with centered layout, violet icon, and prominent CTA. Send button uses arrow icon. Empty state shows "How can I help?" with sparkle icon
- **Contextual AI actions in PropertiesPanel:**
  - **Text selected → "Suggest alternative copy" button** (violet accent, sparkle icon) appears at top of text controls. Calls Claude inline, shows 3 clickable text suggestions that apply on click
  - **Image selected → "Remove Background" card** redesigned from plain button to prominent card with icon, stays at top of image controls
- **Floating canvas hints (`CanvasHints.tsx`):** when editor has no objects, centered floating chips appear: "Generate with AI" (violet, sparkle) + "Browse templates" (neutral, grid icon). Disappear when objects are added. Uses `pointer-events-none` on container, `pointer-events-auto` on chips
- **Final cohesion pass:** all 8 remaining modals (Auth, AIGenerate, Resize, Publish, Marketplace, SaveTemplate, plus previously done Export/Shortcuts/MyDesigns/Templates) now use consistent `animate-fade-in` + `backdrop-blur-sm` on overlay, `animate-scale-up` + `rounded-2xl` + `shadow-2xl` on content panel. Zero `blue-*` classes remaining in codebase. ErrorBoundary button upgraded to `rounded-lg` with more padding

**Bug Audit (Session 43 — complete):**
- Fixed 6 bugs found during systematic code audit:
  1. **WelcomeScreen "+ Create New" button** called `setShowBlankOptions(false)` (no-op) instead of `onNewDesign` — users couldn't create new designs from dashboard
  2. **WelcomeScreen duplicate heading** — "What do you want to create?" rendered twice for new users due to overlapping conditionals
  3. **Drawing/Pen tools broken** — new LeftSidebar's `DrawToolBtn` only toggled the store state but never called `engine.enableDrawing()`/`engine.enablePenTool()` — both tools were completely non-functional after the sidebar rewrite
  4. **Toolbar save pulse ref update** — `prevStatus.current` wasn't always updated, could miss pulse on rapid save cycles
  5. **Template loading from welcome screen crashed** — `handleStartFromTemplate`/`handleStartBlank` called `engine.fromJSON()` before Canvas component mounted (engine uninitialized). Fixed with deferred loading via `pendingDoc` ref + polling for engine initialization
  6. **ExportDialog format/resolution buttons** had `bg-violet-50` active state with no dark variant — showed light background on dark modal
- Fixed 2 layout issues:
  7. **BrandKitPanel** hardcoded `w-56 border-r` didn't fit 280px sidebar — added `!w-full !border-r-0` overrides in wrapper
  8. **PluginsPanel** same issue with `w-48`/`w-56` — same fix applied
**Design System Rebuild (Session 44 — complete):**
- **Token system:** created `apps/web/src/styles/tokens.css` with every CSS variable from DESIGN.md — light theme in `:root`, dark theme in `.dark`. All colors use OKLCH color space with warm hue 60-70
- **Tailwind mapping:** `index.css` imports tokens.css and maps all tokens to Tailwind via `@theme inline` — generates utility classes `bg-canvas`, `bg-surface`, `bg-elevated`, `bg-overlay`, `bg-wash`, `bg-accent`, `bg-accent-subtle`, `text-text-primary`, `text-text-secondary`, `text-text-tertiary`, `border-border`, `border-border-strong`, etc.
- **Typography:** DM Sans (400/500/600) + Fraunces (400/600, optical size) loaded from Google Fonts in index.html. Body set to `var(--font-sans)`. Welcome screen hero heading + wordmark use `font-display` (Fraunces)
- **Full component migration:** every component file (34 files) migrated from hardcoded Tailwind colors to token-based classes. All `violet-*`, `gray-*`, `blue-*`, `white`, `black` replaced. All redundant `dark:` overrides removed (tokens auto-switch)
- **Accent color changed:** from violet (`#7C3AED`) to warm sienna (`oklch(0.65 0.15 45)` / ~`#C4704A`) per DESIGN.md
- **Border radius corrected:** per DESIGN.md, buttons are `--radius-sm` (4px), modals are `--radius-lg` (8px)
- **Motion tokens:** keyframe animations updated to use `var(--duration-*)` and `var(--ease-*)` tokens
- **Reduced motion:** added `@media (prefers-reduced-motion: reduce)` rule that disables all animations
- **Build results:** CSS 52.6KB → 49.4KB (removed dark: duplication), JS 1,923KB → 1,913KB

**Post-Migration Bug Audit (Session 45 — complete):**
- Fixed 8 issues caused by the sed batch migration:
  1. **App.tsx** — 3 lines with hardcoded gray classes missed by sed (collab toolbar section)
  2. **`accent-subtle0` malformed class** — appeared in LeftSidebar.tsx, AssetsPanel.tsx, Onboarding.tsx (sed appended a stray "0")
  3. **Onboarding.tsx `bg-surface/20/10`** — double opacity modifier from sed mangling. Rewritten to use proper token classes
  4. **PropertiesPanel.tsx** — `purple-*` classes on Clip Mask button not caught by sed
  5. **All status colors** — `red-*`, `green-*`, `yellow-*` across 12 components migrated to `danger`/`success`/`warning` tokens. Redundant `dark:` variants removed
  6. **WelcomeScreen gradient cards** — 2 category card gradients mangled by sed (`from-accent` and `from-accent-plum`). Fixed to use standard Tailwind palette colors (gradients are decorative exceptions to the token system)
  7. **CanvasHints** — `bg-surface/90` opacity modifier on OKLCH token may not work. Changed to solid `bg-elevated`
  8. **5 redundant `dark:` overrides** — `dark:hover:text-accent`, `dark:bg-accent`, etc. removed (tokens auto-switch)
- Zero hardcoded Tailwind default colors remain in components (verified via grep)
- Only 1 legitimate `dark:` override remains: `dark:shadow-black/40` in FontBrowser (shadows need manual dark adjustment)

**Tool Interaction Polish (Session 46 — complete):**
- **Custom selection handles:** white circles (10px), accent bounding box (warm sienna), 1px border. Set globally via `FabricObjectClass.ownDefaults` — applies to all object types automatically
- **Object hover outline:** `mouse:over`/`mouse:out` events on canvas show 1px accent stroke at 50% opacity when hovering unselected objects. Skips infrastructure objects and currently selected. Saves/restores original stroke on mouseout
- **Real-time property sync:** `object:moving`, `object:scaling`, `object:rotating` events fire throttled (requestAnimationFrame) selection change callbacks — X/Y/W/H update live during drag/resize
- **Rotation angle display:** while rotating, a small "45°" label appears above the object. Uses a temporary Textbox tagged `__isPenPreview` (excluded from serialization). Removed on `object:modified` or `selection:cleared`
- **Smart duplicate:** `duplicateSelected()` uses `lastDuplicateOffset` (default 10,10) instead of hardcoded 20,20. `setDuplicateOffset(x,y)` method allows tracking movement vector
- **Right-click context menu** (`ContextMenu.tsx`): appears on canvas right-click. Object selected: Cut/Copy/Paste/Duplicate/Delete/Lock/Group/Ordering. Empty canvas: Paste/Select All/Zoom to Fit. Styled with DESIGN.md tokens. Dismisses on click outside or Escape
- **`selectAllObjects()` method** added to CanvasEngine — filters infrastructure objects, creates ActiveSelection
- **Smart guide color:** changed from magenta `#ff00ff` to accent `oklch(0.65 0.15 45)`
- **Custom color picker** (`ColorPicker.tsx`): uses `react-colorful` (HexColorPicker). Includes saturation/brightness area, hue slider, hex input, recent colors row (last 8, localStorage), brand kit colors. Replaces native `<input type="color">` in PropertiesPanel
- **Zoom to cursor:** already implemented — wheel zoom uses `zoomToPoint(cursor)`, toolbar +/- zooms to canvas center (correct behavior since no cursor position available from button click)
- Build passes clean, JS bundle ~1,929KB gzipped ~571KB

**Rendering & Properties Upgrade (Session 47 — complete):**
- **Gradient fill editor:** Solid | Linear | Radial toggle in Fill section. Gradient mode shows: visual gradient bar preview, draggable color stops (2-8), angle slider (linear only), color picker per stop, add/remove stops. Uses `Gradient` class from Fabric.js — `updateSelectedObject({ gradientFill })` creates gradient objects with calculated coords from angle
- **Drop shadow controls:** Shadow section with enable/disable toggle. Color picker, blur slider (0-50px), offset X/Y sliders (-50 to +50). Uses `new Shadow({...})` from Fabric.js. Live preview during slider adjustment
- **Stroke style improvements:** Width as slider (0-20px), dash pattern selector (Solid/Dashed/Dotted/Dash-dot using `strokeDashArray`), line cap selector (Butt/Round/Square via `strokeLineCap`), line join selector (Miter/Round/Bevel via `strokeLineJoin`)
- **Text rendering upgrades:** Text decoration section (strikethrough via `linethrough`, overline via `overline`), text outline section (stroke color + stroke width on text objects via Fabric.js `stroke`/`strokeWidth`)
- **SelectedObjectProps expanded:** added 16 new properties — shadow (5), stroke style (3), gradient (3), text extras (4), fillType
- **updateSelectedObject expanded:** handles `shadow`, `strokeDashArray`, `strokeLineCap`, `strokeLineJoin`, `gradientFill`, `linethrough`, `overline`, `textStroke`, `textStrokeWidth`
- **getSelectedObjectProps expanded:** reads shadow state, stroke dash style detection, gradient type/angle/stops, text decoration state
- **Serialization:** all new properties are natively supported by Fabric.js `toObject()` — shadow, strokeDashArray, strokeLineCap, strokeLineJoin, gradient fills, linethrough, overline all serialize/deserialize automatically
- Build passes, JS 1,937KB gzipped 573KB

**Post-Rendering Bug Audit (Session 48 — complete):**
- Found and fixed 2 bugs in the rendering upgrade:
  1. **Shadow not preserved after save/load** — `getSelectedObjectProps` used `instanceof Shadow` to detect shadows, but after deserialization Fabric.js may restore shadow as a plain object. Fixed by also checking `typeof shadow.blur === 'number'`
  2. **Text extras applied to non-text objects** — `linethrough`/`overline` were set without `instanceof Textbox` guard. Fixed by adding the guard
- Verified: gradient angle math (atan2 roundtrip), gradient coords in object-local space, stroke dash pattern detection, text stroke/fill separation, all dark mode token usage
- Build passes clean, zero TypeScript errors

**Comprehensive Agent Team Audit (Session 49 — complete):**
- 4-teammate parallel audit covering build/tokens, canvas-engine, UI components, and E2E flows
- **9 bugs fixed:**
  1. **CRITICAL: React hooks violation** — `useBrandKit()` called after conditional early return in PropertiesPanel. Moved before the return
  2. **HIGH: Multi-select delete broken** — `deleteSelectedObjects()` called `canvas.remove(activeSelection)` which only removed the wrapper, not children. Fixed to iterate `getObjects()` and remove each
  3. **HIGH: pasteClipboard fire-and-forget** — `.then()` chain between `saveCheckpoint()` and `commit()` could corrupt undo history. Converted to `async/await`
  4. **MEDIUM: Missing keyboard shortcuts** — Ctrl+A (select all), Ctrl+X (cut), V/T/D/P (tool switch) were documented but not implemented. Added all 4
  5. **MEDIUM: Context menu isLocked always false** — hardcoded `false` instead of reading actual lock state from Fabric.js object
  6. **MEDIUM: 11 modals used rounded-2xl** — DESIGN.md specifies `--radius-lg` (8px) for modals, not 16px. Changed all to `rounded-lg`
  7. **MEDIUM: transition-all in RightSidebar** — anti-pattern per DESIGN.md. Changed to `transition-[width,opacity,border-width]`
  8. **LOW: Draw/pen tool cleanup missing** — `DrawToolBtn` useEffect had no return cleanup function, leaving tools active on unmount. Added cleanup
  9. **LOW: __isPenPreview not filtered in history** — pen tool preview objects could leak into undo/redo snapshots. Added filter
- **Audit findings noted but not bugs:** 14 `bg-black/50` backdrop overlays (match spec but use pure black), `restoreState()` race condition in history.ts (existing, not introduced by us), 13 engine methods missing `setCoords()` (low impact — Fabric.js auto-corrects on next interaction)
- Build passes clean, JS 1,938KB gzipped 573KB

**Welcome Screen Redesign (Session 50 — complete):**
- **Complete rewrite of WelcomeScreen.tsx** — deleted rainbow gradient category cards, rebuilt as a visual template gallery
- **New layout (new users):** top bar (Fraunces wordmark + theme toggle + "Open blank canvas"), hero section ("Design something beautiful." in Fraunces + "Free and open-source. Powered by AI."), AI prompt input (search bar with sparkle icon, triggers `generateDesign()` on Enter), category filter pills (All/Social Media/Presentation/Print/Marketing/Event/Video), template thumbnail grid (responsive 5-column, actual aspect ratios via CSS `aspect-ratio`)
- **New layout (returning users):** "Welcome back" heading + horizontal scroll row of saved design thumbnails with + New card, "Start fresh" divider, then same AI input + template grid
- **Template cards:** show template background color as preview, actual dimensions, name + category. Hover: subtle scale + shadow. Click opens directly in editor
- **Category filtering:** unified CATEGORY_MAP maps 7 filter labels to 16 registry categories. "All" shows everything. Real-time filtering
- **Search:** small search input in filter bar, filters by template name/category/tags
- **AI integration:** prompt input only shows if API key configured (`isAIConfigured()`). Generates design via existing `generateDesign()` flow, passes result as a Template to `onStartFromTemplate`
- **Visual design:** no gradients, no colored cards. `--bg-canvas` background, `--bg-surface` cards with `--shadow-sm`, `--radius-md`, DESIGN.md tokens throughout. Template thumbnails provide all the color
- **Removed:** `onStartCustom` prop (and `handleStartCustom` callback in App.tsx) — "Open blank canvas" button uses `onStartBlank` with default 1080x1080 preset
- Build passes, JS 1,932KB (6KB smaller than before — simpler component)

**Template System Expansion (complete):**
- **51 built-in templates** across 8 categories:
  - Social Media (10): Podcast, Instagram Post/Story, YouTube Thumbnail, LinkedIn, Twitter, Pinterest, TikTok, Facebook, Discord
  - Business (9): Business Card, Invoice, One-Pager, Email Signature, Proposal, Certificate, Meeting Notes, Name Badge, Resume
  - Marketing (7): Product Launch, Real Estate, Coupon, Testimonial, Newsletter, App Promo
  - Events (7): Wedding, Birthday, Concert, Conference Badge, Gala, Music Festival, Workshop
  - Education (3): Workshop, Flashcard, Study Guide
  - Creative (6): Book Cover, Movie Poster, Magazine Cover, Exhibition, Portfolio, Album Cover
  - Food & Lifestyle (6): Restaurant Menu, Cafe Menu, Recipe Card, Cocktail Card, Fitness Plan, Wellness
  - Seasonal (4): Valentine, Halloween, Holiday Card, New Year
- **Template Quality Upgrade (Session 75):** 28 templates rebuilt from scratch — each with unique visual personality, category-appropriate colors, diverse shape types (hearts, stars, diamonds, hexagons, pentagons), gradient-filled image placeholders, varied shadow styles, 15-40+ objects each. No more formulaic repetition.
- **Template Creator Guide** (`docs/TEMPLATE_GUIDE.md`) — explains JSON format, object types, coordinates, fonts, colors, design tips, and contribution workflow
- **User templates** stored in IndexedDB (`monet-user-templates`) following the brand-kit pattern
- **Template thumbnails** rendered at runtime via offscreen Fabric.js canvas (`renderTemplateThumbnail()` in `packages/canvas-engine/src/thumbnail.ts`). Batched rendering (6 at a time), cached in memory. Skeleton loading placeholders shown while rendering.

**Competitive Polish (Session 52 — complete):**
- Hero copy: "Design something beautiful. / Free and open-source. Powered by Claude."
- Template grid: 4 columns (was 5), cards lift on hover (`scale-[1.03]` + `shadow-lg`)
- "Blank canvas" button styled as real button with border (was invisible text link)
- "New design" card: `hover:bg-accent-subtle` fill
- Zoom display: `text-sm text-text-primary` (was tiny secondary text)
- Menu toggles: checkmarks (✓) replace "ON/OFF" text
- PropertiesPanel object type header: `text-sm font-medium text-text-primary` with border-bottom separator
- RightSidebar animation: 300ms ease-in-out (was 200ms ease-out)
- CanvasHints: "Your canvas is empty —" (was "Get started:")
- Onboarding auto-dismiss: 10 seconds (was 6)

**Template Thumbnail Rendering (Session 53 — complete):**
- `renderTemplateThumbnail()` in `packages/canvas-engine/src/thumbnail.ts` — creates offscreen Fabric.js canvas, loads all template objects via `createObjectsFromRecipes()`, scales to 300px width, renders to PNG data URL
- WelcomeScreen renders thumbnails in batches of 6 with skeleton loading placeholders
- Thumbnails cached in module-level `Map` — survive category filter changes but not page reloads
- Template cards show fully rendered previews with all text, shapes, and decorative elements

**Dark Mode Architecture Fix (Session 53 — complete):**
- **Single source of truth for theme: `<html class="dark">`**
- `index.html` starts with `<html class="dark">` — dark by default
- Inline `<script>` only removes `dark` if `localStorage` has `monet-theme === "light"`
- `useTheme()` hook reads from `document.documentElement.classList` on init — no separate default
- Removed redundant `<div className={isDark ? 'dark' : ''}>` wrapper around WelcomeScreen
- Chain of authority: HTML → inline script → React hook. No disagreements possible.
**AI Integration Upgrade (complete):**
- **Advanced system prompts:** ALL AI system prompts (ai-generate.ts, ai-assistant.ts) upgraded to teach Claude the full advanced recipe format — gradient fills (linear/radial), drop shadows, charSpacing, lineHeight, text stroke, opacity, strokeDashArray. Includes 2 example templates inline showing professional-quality designs. Mandatory rules: always use at least one gradient, always shadow headings, always real content (never "Lorem Ipsum")
- **Streaming API calls:** `callClaudeStream()` in ai-assistant.ts uses Anthropic SSE streaming (`stream: true`). Parses `content_block_delta` events for real-time token delivery. Feedback requests stream text word-by-word into the chat UI. JSON responses (smart edit, generate, batch) collect the full stream then parse. Singleton pattern shared by ai-generate.ts via import
- **Cost estimation:** `token-estimator.ts` utility — `estimateTokens()`, `estimateCost()`, `formatCost()`, `estimateCallCost()`, `formatUsage()`. Shows `~$0.02` estimate next to send button while user types. Shows `Used ~1,200 tokens ($0.02)` below each assistant response after completion
- **Streaming indicator:** feedback requests show a pulsing "Streaming response..." badge while text arrives; JSON requests show bouncing dots
- **Dark mode fix:** `useTheme` no longer writes to localStorage on mount — only on explicit toggle. One-time migration in inline script clears stale `'light'` values via `monet-theme-v` version flag

**Deep AI Integration — Contextual AI & Command Palette (complete):**
- **Command Palette (`CommandPalette.tsx`):** Raycast/Linear-style floating command bar. Opens on `/` or `Cmd+K` (blocked when editing text). `--bg-overlay`, `--shadow-xl`, `--radius-lg`, 560px wide. Shows `⌘` badge for built-in commands, `✨ AI` badge for AI prompts. 8 built-in commands (export, resize, my designs, shortcuts, templates, new, dark/light mode) — work without API key, execute instantly. AI commands → `smartEdit()` with undo support and streaming status inline. Command history via up arrow. Dismiss with Escape.
- **Contextual AI (`ContextualAI.tsx`):** Floating 24px circular sparkle buttons near selected objects. Text objects: dropdown with Rewrite/Shorter/Longer/More formal/More casual — rewrites text via Claude with undo. All objects: "Make it pop" — Claude analyzes the object in design context and applies styling improvements (shadow, spacing, contrast). Buttons appear after 1s delay on selection. Hidden during drag/resize. Hidden entirely when no API key configured.
- **Tab-to-Suggest (`TabSuggest.tsx`):** When editing empty text objects, pressing Tab (with API key) fetches 3 copy suggestions from Claude based on design context. Floating menu below text object. Click to insert, Escape to dismiss. Without API key, Tab does nothing. Uses capture-phase keydown listener to intercept before Fabric.js.
- **Welcome Screen AI Input:** Always visible (not just when key configured). Styled as command palette aesthetic with sparkle badge, `--bg-overlay`, `--shadow-lg`. Without key: shows "Connect Claude" button inline. With key: text input + streaming generation status.
- **Graceful Degradation:** Without API key: command palette works for all built-in commands (AI commands show "Connect Claude" hint), contextual sparkle buttons don't render, Tab-to-suggest is inert, AI sidebar tab shows connect screen. App is 100% functional without AI.

**Comprehensive QA Pass (complete):**
- **4-agent parallel audit** covering visual tokens, interaction shortcuts, rendering pipeline, and amateur UX
- **Visual fixes (19 files touched):**
  - Rulers.tsx: 7 cold slate hex colors → warm tokens (`#f5f0eb`, `#2d2a26`, `#9a9088`, `#7a7068`, `#e5ddd5`, `#3d3830`), blue artboard band → accent
  - 9 modals: `shadow-2xl` → `shadow-xl` (10 replacements total per DESIGN.md spec)
  - AIAssistantPanel + MyDesigns: `rounded-2xl` → `rounded-xl` on icon containers
  - CollabToolbar: `font-bold` → `font-semibold` (2 instances)
  - MarketplaceBrowser: `font-bold` → `font-semibold` on PICK badge
  - WelcomeScreen: `transition-all` → `transition-[transform,box-shadow]`
  - FontBrowser: removed stale `dark:shadow-black/40` override
  - LeftSidebar: shape icon colors `#4A90D9` → `var(--accent)`, line/arrow strokes `#555` → `var(--text-secondary)`, drawing brush `#333333` → `#2d2a26`
- **Interaction fixes:**
  - Added Escape to deselect objects on canvas (Canvas.tsx `discardActiveObject()`)
  - ShortcutSheet expanded from 14 → 22 shortcuts: added P (pen), Ctrl+X (cut), Ctrl+A (select all), Ctrl+Shift+Z (redo alt), / and Ctrl+K (command palette), Escape (deselect), middle mouse drag (pan)
- **UX fixes:**
  - WelcomeScreen: added `window.confirm()` before design deletion — prevents accidental data loss
  - LeftSidebar Elements tab: "Illus" label → "Illustrations" for clarity
  - LeftSidebar Photos: `.env` developer jargon → user-friendly message
- **CRITICAL rendering fixes:**
  - VignetteFilter registered with `classRegistry.setClass()` — prevents crash on loading designs with vignette filters via undo/redo/paste/load
  - Magic Resize completely rewritten — fixed double-scaling bug where both `width`/`height` AND `scaleX`/`scaleY` were multiplied (result was `uniformScale²`). New approach: text/circles scale dimensions directly (fontSize, radius) and reset scale; shapes scale only via scaleX/scaleY. Added shadow blur/offset scaling, gradient coordinate scaling, clipPath sub-object scaling, strokeDashArray scaling

**Canva Parity — Quick Wins (Sessions 54-55, complete):**
- **Flip H/V buttons:** `flipX`/`flipY` toggle in PropertiesPanel `FlipRotateSection`, wired to Fabric.js native flip
- **Align single object to artboard:** `alignSelected()` now works with 1 object — aligns to artboard edges/center instead of requiring 2+ objects
- **Transparent PNG export:** checkbox in ExportDialog, hides artboard rect via `hideInfrastructure(canvas, transparent)` 
- **FocusTrap in all modals:** `FocusTrap` from A11y.tsx now wraps content in all 10 dialog components — Tab key cycles within modals
- **Recently used fonts:** last 8 fonts in localStorage (`monet-recent-fonts`), shown at top of FontBrowser dropdown
- **Text transform:** UPPERCASE / lowercase / Title Case buttons in `TextTransformSection` — applies string transformation to Fabric.js Textbox text property
- **Image replace:** `ImageReplaceButton` opens file picker, calls `replaceSelectedImage()` which preserves visual size, position, flip, opacity
- **Rotate 90°:** CW/CCW buttons in `FlipRotateSection`, modulo 360
- **Branded delete confirmation:** styled modal replaces `window.confirm()` in WelcomeScreen

**Image Crop Tool (Session 56, complete):**
- **Non-destructive crop** using Fabric.js `clipPath` — original image data preserved, re-croppable
- **Crop mode:** select image → click "Crop" (or double-click image) → full image shown at 35% opacity, draggable/resizable white-bordered crop rectangle with corner handles
- **Aspect ratio presets:** Free, 1:1, 4:3, 16:9, 9:16, 3:2 — enforced via `lockUniScaling`
- **Crop rect constrained** to stay within image bounds on every move/scale event
- **Apply/Cancel:** Apply creates clipPath in image-local coords, Cancel restores original state (including opacity)
- **CropToolSection** in PropertiesPanel: shows crop button for images, full crop UI during crop mode (even when crop rect is selected)
- **`__isCropOverlay`** tag excludes crop rect from serialization, layers, guides, history, hover outlines

**Multi-Page Designs (Session 57, complete):**
- **Data model:** `DesignPage` type: `{ id, name, objects[], background? }`. `DesignDocument.pages` array (optional, backward compat)
- **Backward compatibility:** `normalizePagesToArray()` auto-wraps old `objects`-only designs into a single page — all 52 templates + old saves load without changes
- **Engine methods:** `switchToPage(index)`, `addPage()`, `deletePage(index)`, `duplicatePage(index)`, `reorderPages(from, to)`, `renamePage(index, name)`, `getPages()`, `renderPageToDataURL(index, multiplier)`
- **Page switching:** serializes current page → stores in `pages[]` → deserializes target page. History clears on switch (global, not per-page).
- **PageNavigator component:** 72px horizontal thumbnail strip at bottom of editor. Accent-bordered active page, "+" button, right-click context menu (Duplicate/Delete/Rename/Move). Page count badge.
- **Keyboard shortcuts:** PageDown / Ctrl+] = next page, PageUp / Ctrl+[ = previous page
- **Multi-page PDF:** "All pages" checkbox in ExportDialog, renders each page to PNG then combines via jsPDF `addPage()`
- **Editor store:** `pages`, `currentPageIndex`, `pageCount`, `setPagesState()` — synced from engine via `onPagesChange` callback
- **Delete prevention:** cannot delete the last remaining page

**P1 Polish (Session 58, complete):**
- **Recently used templates:** last 5 template names in localStorage, "Recent" section at top of TemplateBrowser
- **Styled tooltips:** `Tooltip` component (dark pill, 500ms delay, above trigger), applied to all toolbar buttons
- **7 new shapes:** rounded rect, diamond, pentagon, hexagon, heart, arrow-right, speech bubble. Uses `createRegularPolygon()` (Polygon) and `createPathShape()` (Path with SVG data)
- **Eyedropper tool:** button in ColorPicker, canvas cursor → crosshair, reads pixel via `getImageData()`, capture-phase click listener
- **Document color palette:** "Used in design" section in ColorPicker showing all unique fill/stroke colors from canvas objects (up to 12)

**Bug Fixes (Sessions 54-55):**
- Text Transform was broken: `updateTextProps()` didn't handle `text` property
- Align-to-artboard didn't emit `emitSelectionChange()` — panel didn't update
- Image replace copied raw scale instead of preserving visual size (wrong when new image has different natural dimensions)
- Undo/redo async race: `restoreState()` used `.then()` instead of `async/await`
- Ungroup missing `setCoords()` — stale bounding boxes
- Non-functional opacity slider in ColorPicker removed (was never wired)
- Hardcoded white in template skeleton → design token

**Session 73 — Settings, New Design, Template Browser Fix (complete):**
- **New Design confirmation:** Ctrl+N / toolbar menu shows confirmation dialog when canvas has objects. Saves current, creates fresh ID, returns to welcome screen
- **Toolbar overflow menu:** SVG icons on all 8 items, keyboard shortcut hints (Ctrl+N, Ctrl+,, ?) as `<kbd>` elements
- **Settings modal integration:** "Open Settings" buttons in Photos empty state, AI connect screen, template browser AI tab. Settings gear icon in welcome screen header. SettingsModal renders in both welcome and editor views
- **Settings reactivity:** `monet-settings-changed` custom event on save → AIAssistantPanel auto-detects new API key without page reload
- **Welcome screen AI fix:** replaced `window.prompt()` for API key with opening Settings modal
- **Template browser blank page fix:** TemplateBrowser now conditionally rendered (mount/unmount), not always-mounted. `useState(initialTab || 'templates')` runs fresh on each open. Wrapped in ErrorBoundary. Removed stale `useEffect` tab sync

**QA Audit (Session 73 — 5-agent team, complete):**
- 5 specialized agents read every file in the codebase in parallel
- **Found:** 16 P0, 35 P1, 44 P2, 45 P3 issues
- **Fixed (11 P0s):** export try/finally, undo race guard, selection multi-subscriber, resize multi-page, loadDesign premature call, AI streaming safety, "Make it pop" validation, pnpm typecheck, infrastructure tag filtering in getArtboardDataURL
- **Unfixed P0s (API server — optional, local-only):** design/preferences/sharing routes have no auth middleware; beforeunload async save is a browser limitation
- **Top P1s remaining (next session):**
  - `nudgeSelected()` has no undo history — arrow key moves can't be undone
  - `setBackground()` has no undo history — background changes can't be undone
  - Smart guides filter in `guides.ts` misses `__isGuide` and `__isBgImage` tags — guides snap to other guides and bg images
  - Montserrat font not preloaded — 30+ templates render with fallback font on first load
  - Marketplace moderation has no admin role check — any authenticated user can approve/reject templates
  - AI `normalizeDoc()` doesn't handle multi-page designs — AI edits on multi-page designs lose pages
  - AI `smartEdit()` system prompt doesn't mention multi-page — Claude won't produce pages
  - `FocusTrap` queries focusable elements only once on mount — dynamic modal content breaks trap
  - `history.restoreState()` removes `__isPenPreview`/`__isCropOverlay` on undo — breaks crop mode if undo during crop
  - Collab client has no `connect_error` handler — hangs with no feedback if server unreachable
  - Stock photo API errors silently swallowed — shows "no results" instead of error message
  - `PropertiesPanel` shows "Arrow" for all grouped objects (should show "Group")
  - `serializeCanvas` sets `createdAt` to empty string on saves after the first
- **Top P2s remaining:**
  - Background removal model promise cached on failure — reload required to retry
  - Cost estimate ignores system prompt and image tokens — shown cost is much lower than actual
  - `CommandPalette` Escape closes during AI processing — loses in-progress edit
  - Delete confirmation dialogs (WelcomeScreen, App.tsx, MyDesigns) missing FocusTrap
  - `hexToHsl()` can return hue=360, producing wrong complementary color
  - No email format validation on signup
  - Session token returned in response body (undermines httpOnly cookie)
  - Batch export flashes each design on canvas (needs offscreen rendering)

**Session 74 — Pre-Launch Polish + 5 QA Passes (2026-04-12, complete):**
- **ALL 35 P1 bugs fixed** — undo gaps, tag filtering, AI multi-page, UI fixes, backend security
- **Pre-launch UX polish:** branded loading states, mobile "best on desktop" notice, responsive template grid, thumbnail rendering perf (font timeouts cut, multiplier 1.5x→1x)
- **Delight pass:** Tooltip upgrade (animation + kbd shortcut display + 300ms delay), Toast notification system (copy/paste/duplicate/export/image-drop), left sidebar tab fade transitions, canvas pasteboard dot pattern
- **Living wordmark:** Fraunces variable font axes (wght, opsz) animate based on activity state (idle/loading/processing/success/error). Activity store shared with water lily logo animation.
- **Water lily logo animation:** CSS transform+filter on the existing favicon `<img>` wrapper — scale/rotate/glow synced with activity store. SVG NOT modified.
- **Image adjustments expanded:** 6 new Fabric.js filters (Vibrance, Gamma, Pixelate, Grayscale, Sepia, Invert) — total 16 filters. Collapsible "Adjustments" section with user-friendly integer display ranges and effect toggle pills.
- **Library evaluations (comments only):** pdf-lib (vector PDF export), colorthief (OKLCH color extraction), opentype.js (font parsing for curved text)
- **Login hidden when no backend:** `checkAuth()` returns `{ user, reachable }`, Toolbar only shows login/logout when backend confirmed reachable
- **5 comprehensive QA passes** (10 parallel agents total): canvas engine, properties panel, save/load+export, templates+navigation, AI+plugins+edge cases. 17 additional bugs found and fixed.
- `pnpm build` succeeds, JS ~1,913KB gzipped ~542KB

**Known Issues:** All P0 and P1 bugs fixed. P2/P3 issues from QA audit remain (cosmetic/edge-case only, not launch-blocking). API server routes still have no auth middleware (optional backend, not needed for client-only deployment).
**What's Next:** Visual QA of all 51 templates (open in editor, verify rendering). Verify template-loader compatibility with new shape types (heart, star, diamond, hexagon, pentagon, arrow-right). Then final launch checklist.

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
- **UI/UX overhaul:** App.tsx tracks `view` state ('welcome' | 'editor') — `WelcomeScreen` renders when `view === 'welcome'`, full editor renders when `view === 'editor'`
- Welcome screen loads saved designs from IndexedDB on mount — if designs exist, shows dashboard; otherwise shows category cards
- `WelcomeScreen` receives callbacks for all entry paths: `onOpenDesign`, `onNewDesign`, `onStartFromTemplate`, `onStartBlank`, `onStartCustom`
- Left sidebar width changed from icon-strip (w-14) + expandable (w-48) to single panel (w-[280px]) — all content lives in tab panels, no more tool icon strip
- Right sidebar visibility controlled by selection state, not by a toggle button — `RightSidebar` component handles the slide-in/out animation via `w-0 opacity-0` ↔ `w-64 opacity-100` transition
- Layers panel moved from fixed bottom section of right sidebar to a tab within it — `Properties | Layers` tab bar
- Toolbar overflow menu uses `useRef` + `mousedown` listener for outside-click dismissal
- Old `AssetsPanel.tsx` code absorbed into new `LeftSidebar.tsx` Elements tab — file remains but is no longer imported
- `BrandKitPanel` rendered inline in Design tab via CSS override (`[&>div]:w-full [&>div]:border-r-0`) to fit full width
- `PropertiesPanel` outer `w-64 border-l` wrapper removed — now `RightSidebar` handles width and border
- `LayerPanel` removed `border-t` and `max-h-60` constraints — now fills full height as a tab
- **Visual polish:** accent color is violet-600 (`#7C3AED`) in light mode, violet-500 (`#8B5CF6`) in dark — chosen for warmth and distinctiveness vs. generic blue
- Dark mode defaults for new users — design tools work better in dark (less eye strain, colors pop more against dark bg)
- `getInitialTheme()` returns `'dark'` when no localStorage value exists (was: system preference detection)
- Save pulse animation uses `useEffect` watching `saveStatus` transitions: only fires when `saving` → `saved`, not on initial render
- `prevStatus` useRef tracks the prior save status to detect the transition edge
- Modals use `backdrop-blur-sm` for frosted-glass overlay — subtle but modern feel
- `animate-scale-up` on modal content starts at 92% scale and eases to 100% in 200ms — avoids jarring pop-in
- Onboarding reduced from 5-step overlay walkthrough to 1 contextual tooltip — welcome screen handles first-time education
- Tooltip auto-dismisses after 6 seconds to avoid blocking the user if they don't notice it
- Toolbar removed "Unsaved" text from save badge — empty badge when unsaved (less visual noise); shows "Saved" or "Saving..." only
- Global CSS button transition rule applies to all `button`, `[role="button"]`, `a`, `select`, `input[type="color"]` elements — no need for per-component `transition-colors` classes (though they're kept for clarity)
- Scrollbar styling uses rgba for cross-theme compatibility — no theme-specific overrides needed
- AI panel uses 3-dot bounce animation for typing indicator — `[animation-delay:0ms/150ms/300ms]` for staggered bounce
- `SuggestCopyButton` calls `chatWithClaude()` directly from PropertiesPanel — doesn't require AI panel to be open
- `RemoveBackgroundCard` renamed from `RemoveBackgroundButton` — card-style with icon, more visual prominence
- `CanvasHints` uses `pointer-events-none` on the overlay div so clicks pass through to canvas, `pointer-events-auto` on the chips themselves
- `CanvasHints` checks `layers.length > 0` to determine if canvas has objects — disappears when first object is added
- Chat message bubbles use `rounded-2xl rounded-tr-md` (user) / `rounded-2xl rounded-tl-md` (assistant) for speech-bubble feel
- All 14 modal/dialog components now share identical overlay+content pattern: `animate-fade-in backdrop-blur-sm` on overlay, `animate-scale-up rounded-2xl shadow-2xl` on content
- **Deferred template loading:** welcome screen flows use `pendingDoc` ref to queue the document, then `setView('editor')` triggers Canvas mount, and a polling `useEffect` waits for `engine.isInitialized()` before calling `fromJSON()` — avoids race condition between React mount and engine init
- `DrawToolBtn` useEffect calls `engine.enableDrawing()`/`engine.disableDrawing()` and `engine.enablePenTool()`/`engine.disablePenTool()` keyed on `activeTool` — restores the behavior the old sidebar panels provided
- BrandKitPanel and PluginsPanel rendered inside override wrappers (`[&>div]:!w-full [&>div]:!border-r-0`) to strip their hardcoded widths — the `!important` modifier ensures Tailwind specificity wins
- **Design system token architecture:** `tokens.css` defines all variables, `index.css` maps them to Tailwind via `@theme inline`, components use Tailwind utility classes (e.g., `bg-surface` not `bg-white dark:bg-gray-900`)
- Token-based classes auto-switch between light/dark — no need for `dark:` overrides on any token-mapped class. Only non-token classes (gradients, special states) use `dark:` variants
- OKLCH color space chosen for perceptual uniformity — colors look equally vibrant in both themes without manual per-theme adjustments
- Warm hue 60-70 gives the signature sand/clay undertone that distinguishes Monet from cold blue-gray design tools
- `body` sets `font-family: var(--font-sans)` and `color: var(--text-primary)` globally — most components inherit these automatically
- `font-display` (Fraunces) used only for: Monet wordmark, welcome screen hero heading, and "Welcome back" heading. All other UI stays on `font-sans` (DM Sans)
- Rulers component keeps hardcoded hex colors for HTML canvas drawing (JavaScript `fillStyle`/`strokeStyle` — can't use CSS variables). Rulers' Tailwind classes on the corner square element were migrated to tokens
- `scale-up` animation changed from 0.92 to 0.97 per DESIGN.md motion spec ("Scale from 0.97, never 0")
- **Dark mode architecture:** `<html class="dark">` is the ONLY source of truth. `index.html` bakes it in. Inline `<script>` conditionally removes it. `useTheme()` reads from DOM on init. No wrapper divs. No separate defaults. No disagreements.
- `useTheme()` reads initial state from `document.documentElement.classList.contains('dark')` — NOT from localStorage or a hardcoded default
- Template thumbnails use offscreen `FabricCanvas` + `createObjectsFromRecipes()` + scaling + `toDataURL()` — disposed after capture
- Thumbnail rendering batched (6 at a time) to avoid blocking the main thread
- Template cards prioritize rendered thumbnail image; show skeleton with background color while loading
- Middle-click drag panning added to viewport.ts — works alongside existing Space+drag
- `onStartCustom` prop removed from WelcomeScreen — "Blank canvas" button uses `onStartBlank` with default 1080x1080
- `callClaudeStream()` is the foundational API call — parses SSE events (`data:` lines), extracts `content_block_delta` for text, `message_start` for input tokens, `message_delta` for output tokens. `callClaude()` wraps it without onDelta
- `callClaudeStream` exported from ai-assistant.ts, imported by ai-generate.ts — single implementation for streaming across both modules
- `RECIPE_FORMAT_DOCS` is a shared string constant in ai-assistant.ts appended to `SMART_EDIT_SYSTEM`, `VARIATIONS_SYSTEM`, and `CHAT_SYSTEM` — keeps advanced feature docs in one place
- ai-generate.ts has its own inline copy of the format docs (self-contained, doesn't import the constant) because its prompt structure is different
- Feedback requests detected via `FEEDBACK_RE` regex in AIAssistantPanel — matched requests bypass `chatWithClaude()` JSON flow and call `getDesignFeedback()` directly for streaming
- `ChatMessage.usage` field stores formatted usage string, displayed as `text-[9px] text-text-tertiary` below assistant messages
- Cost estimate updates live via `useEffect([input])` — calls `estimateCallCost()` on each keystroke, shown next to send button
- Token estimator uses ~4 chars/token for text, ~3 for JSON — rough but better than nothing
- `useTheme` localStorage write moved from `useEffect` (ran on every mount) to `toggleTheme` callback (explicit user action only) — prevents transient HMR glitches from persisting stale theme
- `monet-theme-v` version flag in inline script enables one-time migration to clear stale localStorage theme values
- CommandPalette uses `commandHistory` module-level array (persists across open/close, not across page loads) — up arrow navigates history
- CommandPalette keyboard handler checks `(active as any).isEditing` to avoid opening during Fabric.js text editing
- Built-in commands matched via `keywords` array — fuzzy enough to catch "export", "download", "save as", "png" all mapping to Export
- AI commands detected by exclusion: if input doesn't match any built-in command keywords, it's treated as AI
- ContextualAI uses `getBoundingRect()` + canvas element's `getBoundingClientRect()` to convert object-local coords to screen coords for button positioning
- ContextualAI tracks `isDragging` via `object:moving/scaling/rotating` events and hides buttons during operations
- ContextualAI text rewrite uses dedicated `TEXT_REWRITE_SYSTEM` prompt (not the full chat system) for faster, more focused responses
- ContextualAI "Make it pop" returns a JSON object of property changes (shadow, charSpacing, opacity) applied via `updateSelectedObject()`
- TabSuggest uses `document.addEventListener('keydown', handler, { capture: true })` to intercept Tab before Fabric.js's hidden textarea handler
- TabSuggest only triggers on empty/near-empty text (< 5 chars) to avoid interfering with normal Tab behavior
- WelcomeScreen AI input always renders (not gated by `isAIConfigured()`) — shows inline "Connect Claude" button when no key, text input when key is saved
- **Sessions 54-58 key decisions:**
- `flipX`/`flipY` added to `SelectedObjectProps` and `updateSelectedObject()` — Fabric.js natively supports these, just needed UI exposure
- `alignSelected()` single-object case: aligns to artboard (0,0)→(artboardWidth, artboardHeight) instead of selection bounding box
- Transparent PNG: `hideInfrastructure(canvas, transparent)` hides the artboard rect when `transparent=true`, Fabric.js renders remaining objects on transparent canvas
- `replaceSelectedImage()` now preserves VISUAL size (not raw scale) by computing `newScaleX = visualWidth / newImg.width`
- `history.restoreState()` converted from `.then()` to `async/await` — eliminates async race condition where operations during undo could be lost
- Non-destructive crop via `clipPath` (Rect in image-local coords, `absolutePositioned: false`) — original image data preserved for re-cropping
- Image dimmed to 35% opacity during crop mode (simpler than dark overlay, same visual effect). Other objects set `evented: false` during crop.
- `__isCropOverlay` tag on crop rect — excluded from serialization, layers, guides, history, hover outlines, selectAll
- **Multi-page architecture:** `DesignDocument.pages` is optional — if absent, `normalizePagesToArray()` wraps `objects` into single page. All 52 templates + old saves work without migration.
- Page switching: serialize current page → store in `pages[]` → deserialize target page. History clears on switch (simpler than per-page undo stacks, matches Canva behavior).
- `serializeCanvas()` now takes full `pages` array + `currentPageIndex` — writes live canvas objects into current page slot, passes other pages through as-is. Output always has both `objects: []` (deprecated) and `pages: [...]`.
- `exportAllPagesAsPDF()` renders each page to PNG via temporary canvas swap, then combines via jsPDF `addPage()`
- Editor store tracks `pages`, `currentPageIndex`, `pageCount` — synced from engine via `onPagesChange` callback in `Canvas.tsx`
- `ShapeType` expanded with 7 new types. `createRegularPolygon(sides)` generates vertices with trig for diamond/pentagon/hexagon. `createPathShape(svgData)` renders SVG path strings for heart/arrow/speech bubble.
- Eyedropper uses `canvas.getElement().getContext('2d').getImageData()` with capture-phase click listener to fire before Fabric.js selection
- Document color palette: reads all unique fill/stroke colors from canvas objects, limited to 12, refreshed on popover open
- `Tooltip` component: 500ms delay, dark pill, positioned above trigger. Applied to toolbar buttons (replaced native `title`).
- Recently used templates tracked by name in localStorage (`monet-recent-templates`, max 5)
- **Session 73 key decisions:**
- TemplateBrowser now conditionally rendered (`{templateBrowserOpen && <TemplateBrowser .../>}`) instead of always-mounted with `if (!isOpen) return null`. Eliminates stale state between opens, `useState(initialTab)` initializer runs fresh each time
- `monet-settings-changed` custom DOM event dispatched by SettingsModal on save. AIAssistantPanel listens and re-checks `isAIConfigured()`. Simpler than lifting state or context for cross-component API key reactivity
- ErrorBoundary wraps TemplateBrowser — prevents modal crashes from blanking the entire app
- WelcomeScreen "Connect Claude" routes to Settings modal (not `window.prompt()`) — consistent key management through one UI
- `MenuItem` component in Toolbar accepts `shortcut` prop — renders `<kbd>` hint right-aligned
- **Session 74 key decisions:**
- `isInfrastructure()` exported from `tagged-object.ts` as the SINGLE source of truth — all 6 previous copies removed from guides.ts, history.ts, layers.ts, serialization.ts, pen-tool.ts, and inline checks in canvas-engine.ts
- Activity store (`activity-store.ts`) is Zustand — states: idle/loading/processing/success/error. success+error auto-reset to idle after 1.5s
- Toast system (`Toast.tsx`) uses module-level pub/sub pattern — `showToast()` callable from anywhere, not a React hook. Max 3 visible, auto-dismiss 2.5s
- Fraunces loaded as full variable font (wght 100-900, opsz 9-144) for wordmark animation. Old static weights replaced.
- Water lily logo animation: CSS transform+filter on a `<span>` wrapper around the existing `<img>` tag. SVG NOT restructured.
- `checkAuth()` returns `{ user, reachable }` (not just `user`). `backendAvailable` state gates login/logout UI.
- All template fonts (DM Sans, Fraunces, Montserrat, Inter, Playfair Display) preloaded in index.html. `thumbnail.ts` TEMPLATE_FONTS array is now empty.
- `serializeCanvas()` accepts `existingCreatedAt` param. Engine stores `createdAt` on load and passes through on save.
- `saveNow()` checks `dirtyRef.current` — skips save when nothing changed.
- Image filters expanded to 16: existing 10 + Vibrance, Gamma, Pixelate, Grayscale, Sepia, Invert. All are standard Fabric.js built-in filter classes that serialize/deserialize automatically.
- `smartEdit()` uses `normalizeDoc()` instead of manual validation — accepts both objects and pages formats from Claude.
- Magic Resize `resizeObject()` now scales shadow offsetX/offsetY/blur proportionally.

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
