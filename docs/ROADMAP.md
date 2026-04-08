# Monet — Open-Source Canva Alternative

## Project Roadmap to v1.0 Release

---

## Vision

A free, open-source, web-based design tool that empowers non-designers to create professional graphics using templates, drag-and-drop editing, and one-click export. Self-hostable, privacy-respecting, no account required to start designing.

**Target users:** Social media managers, small business owners, students, marketers, nonprofits — anyone who currently pays for Canva Pro or feels limited by Canva Free.

**Core philosophy:** Templates-first, not tools-first. The user should never face a blank canvas unless they choose to.

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Canvas Engine | **Fabric.js** | Mature, well-documented, handles objects/groups/layers/serialization natively. Large community. |
| Frontend | **React 18 + TypeScript** | Component-driven, huge ecosystem, easy to recruit contributors. |
| Styling | **Tailwind CSS** | Fast iteration, consistent design system. |
| State Management | **Zustand** | Lightweight, simple, works well with canvas sync. |
| Backend (Phase 2+) | **Node.js + Express** or **Hono** | Lightweight API server for templates, auth, storage. |
| Database | **SQLite** (dev/self-host) / **PostgreSQL** (cloud) | SQLite for zero-config self-hosting; Postgres for scale. |
| Auth (Phase 2+) | **Better Auth** or **Lucia** | Open-source, no vendor lock-in. |
| Storage | **Local filesystem** / **S3-compatible** | Self-hostable by default, optional cloud storage. |
| AI Features | **rembg** (bg removal), **sharp** (image processing) | Python microservice for AI; sharp for fast server-side transforms. |
| Build | **Vite** | Fast builds, great DX. |
| Monorepo | **Turborepo** or **pnpm workspaces** | Clean separation of packages as project grows. |

---

## Phase 0 — Project Scaffolding & Foundation

**Goal:** Bootable project with dev tooling, CI, and an empty canvas rendering.

**Duration:** 1–2 days

### Tasks

- [x] Initialize monorepo structure:
  ```
  monet/
  ├── apps/
  │   └── web/              # React frontend
  ├── packages/
  │   ├── canvas-engine/    # Fabric.js wrapper & canvas logic
  │   ├── templates/        # Template definitions (JSON + assets)
  │   └── shared/           # Types, utils, constants
  ├── docs/
  ├── .github/
  │   └── workflows/        # CI: lint, test, build
  ├── LICENSE               # AGPLv3
  ├── README.md
  ├── ROADMAP.md
  └── CONTRIBUTING.md
  ```
- [x] Set up Vite + React + TypeScript in `apps/web`
- [x] Install and configure Tailwind CSS
- [x] Set up ESLint + Prettier with shared config
- [x] Set up Zustand store skeleton
- [x] Initialize Fabric.js canvas component that renders an empty artboard
- [ ] Set up GitHub Actions CI (lint + typecheck + build)
- [ ] Write README with project vision, screenshot placeholder, and dev setup instructions
- [ ] Choose and apply license (recommend **AGPLv3** — prevents proprietary forks while allowing self-hosting)

### Acceptance Criteria

- `pnpm dev` launches the app with a visible, interactive canvas
- CI passes on push
- A contributor can clone, install, and run in under 2 minutes

---

## Phase 1 — Core Editor MVP

**Goal:** A user can open a template, edit text/images/shapes, and export a finished design. No backend required — everything runs client-side.

**Duration:** 2–4 weeks

### 1.1 — Canvas Foundation

- [x] Artboard component with configurable dimensions (e.g., 1080×1080 for Instagram)
- [x] Zoom & pan controls (scroll wheel zoom, fit-to-screen button)
- [x] Grid/snap-to-grid toggle
- [x] Smart guides (alignment lines when dragging objects near edges/centers)
- [x] Undo/redo system (command pattern over Fabric.js state)
- [x] Canvas background: solid color, gradient, or image

### 1.2 — Object Tools

- [x] **Text tool:**
  - Add/edit text directly on canvas (double-click to edit)
  - Font family picker (Google Fonts integration — load on demand)
  - Font size, weight, style (bold/italic/underline)
  - Text color + opacity
  - Text alignment (left/center/right/justify)
  - Line height & letter spacing
  - Text shadow (optional)
- [x] **Shape tool:**
  - Rectangle, circle, triangle, line, arrow, star, polygon
  - Fill color (solid, gradient) + stroke color/width
  - Corner radius for rectangles
  - Opacity control
- [x] **Image tool:**
  - Upload from device (drag & drop + file picker)
  - Crop, resize, rotate
  - Image filters (brightness, contrast, saturation, blur — Fabric.js built-in)
  - Opacity control
  - Fit/fill/stretch modes
- [x] **Drawing tool:**
  - Freehand pen with color/width
  - Eraser

### 1.3 — Layer Management

- [x] Layer panel (sidebar) showing all objects
- [x] Drag to reorder layers
- [x] Lock/unlock layers
- [x] Show/hide layers (eye icon)
- [x] Group/ungroup objects
- [x] Duplicate/delete objects
- [x] Keyboard shortcuts: Delete, Ctrl+C/V/D, Ctrl+Z/Y, arrow keys for nudge

### 1.4 — Template System

- [x] Template data format specification:
  ```json
  {
    "id": "instagram-post-001",
    "name": "Bold Announcement",
    "category": "social-media",
    "dimensions": { "width": 1080, "height": 1080 },
    "tags": ["instagram", "announcement", "bold"],
    "thumbnail": "thumb.webp",
    "canvas": { /* Fabric.js JSON serialization */ }
  }
  ```
- [x] Template browser/picker UI (grid view with categories)
- [x] Ship 15–25 starter templates across categories:
  - Instagram post (5)
  - Instagram story (3)
  - Facebook post (3)
  - Twitter/X header (2)
  - YouTube thumbnail (3)
  - Presentation slide (2)
  - Business card (2)
  - Flyer / poster (2)
- [x] "Blank canvas" option with preset dimension picker
- [x] Custom dimensions input

### 1.5 — Export

- [x] Export to PNG (with quality slider)
- [x] Export to JPG (with quality slider)
- [x] Export to SVG
- [x] Export to PDF (single page)
- [x] Export at 1x, 2x, 3x resolution
- [x] Download triggers browser save dialog (no server needed)

### 1.6 — UI/UX Shell

- [x] Top toolbar: file operations, undo/redo, zoom controls
- [x] Left sidebar: tools (text, shapes, images, draw, templates)
- [x] Right sidebar: properties panel (context-sensitive for selected object)
- [x] Bottom bar: artboard dimensions, zoom percentage
- [x] Dark mode / light mode toggle
- [x] Responsive layout (minimum: works on tablet-width screens)
- [x] Keyboard shortcut cheat sheet (? key to toggle)

### Acceptance Criteria

- A non-technical user can: pick a template → change text → swap an image → export PNG
- All state is local (localStorage or IndexedDB for auto-save)
- Works offline after initial load
- Loads in < 3 seconds on a mid-range device

---

## Phase 2 — Stock Assets & Integrations

**Goal:** Users have access to free images, icons, and illustrations without leaving the editor.

**Duration:** 1–2 weeks

### Tasks

- [x] **Unsplash integration:** search and insert free stock photos (via Unsplash API)
- [x] **Pexels integration:** secondary stock photo source with source toggle in Photos tab
- [x] **Icon library:** full Lucide icon set (~1937 icons), lazy-loaded, searchable with categories and virtual scrolling
- [x] **SVG illustrations:** 18 original flat-style SVG illustrations across 5 categories, searchable with category filter
- [ ] **Emoji picker** for quick decorative elements
- [x] **Upload manager:** drag-and-drop zone, recent uploads panel
- [x] Asset search within editor sidebar (unified search across photos + icons + illustrations)

### Acceptance Criteria

- User can search "mountain" and insert a stock photo in under 5 seconds
- Icons render as editable SVG objects on the canvas (recolorable)

---

## Phase 3 — Save, Load & Local Persistence

**Goal:** Users can save designs, reopen them, and manage multiple projects — all client-side.

**Duration:** 1 week

### Tasks

- [x] Auto-save to IndexedDB every 30 seconds (debounced on change)
- [x] "My Designs" dashboard showing saved projects with thumbnails
- [x] Rename / duplicate / delete designs
- [x] Export/import design as `.monet` file (JSON + embedded assets as base64 or blob refs)
- [ ] Version warning if file format changes between releases
- [x] "Save as template" — user can save their design as a reusable template (IndexedDB, shown in template browser)
- [x] Recent designs quick-access (last 5)

### Acceptance Criteria

- Close browser, reopen → design is still there
- Export `.monet` file on one machine, import on another → identical result

---

## Phase 4 — Brand Kit & Multi-Format Resize

**Goal:** Power-user features that Canva paywalls.

**Duration:** 1–2 weeks

### Tasks

- [x] **Brand Kit:**
  - Save brand colors (palette of up to 12 colors)
  - Save brand fonts (up to 3: heading, subheading, body)
  - Upload brand logos
  - Brand kit panel in sidebar — one-click to apply brand color/font to selected element
  - Multiple brand kits (personal, client A, client B, etc.)
  - Import/export brand kit as JSON
- [x] **Magic Resize:**
  - Select a design → choose target formats (e.g., Instagram post → also create Instagram story + Twitter header)
  - Auto-resize and reposition elements intelligently
  - Manual adjust after auto-resize
  - Batch export all sizes at once
- [ ] **Color palette generator:**
  - Upload an image → extract dominant colors
  - Generate complementary/analogous/triadic palettes
  - Save generated palettes to brand kit

### Acceptance Criteria

- User saves a brand kit → opening any template auto-suggests brand colors in the color picker
- Resize an Instagram post to 3 other formats in under 30 seconds

---

## Phase 5 — Backend, Auth & Cloud Sync (Optional Self-Host)

**Goal:** Users can create accounts, sync designs across devices, and share designs via link. Everything self-hostable.

**Duration:** 2–3 weeks

### Tasks

- [x] **Backend API server** (`apps/api`):
  - RESTful API (or tRPC for type-safe client-server)
  - Design CRUD endpoints
  - Template CRUD endpoints
  - User preferences endpoint
- [x] **Authentication:**
  - Email/password signup + login
  - OAuth: Google, GitHub
  - Magic link (passwordless) login
  - JWT or session-based auth
  - "Continue as guest" always available (no forced signup)
- [x] **Cloud storage:**
  - Save designs to server (Postgres + S3-compatible object storage for assets)
  - Sync between local and cloud (local-first — cloud is optional backup)
  - Conflict resolution strategy (last-write-wins with merge prompt)
- [x] **Sharing:**
  - Generate shareable view-only link for any design
  - Optional: allow duplicating a shared design ("Use this template")
  - Optional: password-protected shares
- [x] **Self-hosting documentation:**
  - Docker Compose setup (app + db + object storage via MinIO)
  - One-command deploy: `docker compose up`
  - Environment variable reference
  - Nginx reverse proxy example config
  - ARM64 support (Raspberry Pi friendly)

### Acceptance Criteria

- `docker compose up` → fully working instance with auth, storage, and sharing
- A user without an account can still use the full editor (client-side only mode)
- Self-hosted instance works on a $5/month VPS

---

## Phase 6 — AI-Powered Features

**Goal:** Match and exceed Canva's paywalled AI features — for free.

**Duration:** 2–3 weeks

### Tasks

- [x] **Background remover:**
  - Integrate rembg (Python) or @xenova/transformers (JS, runs in-browser via ONNX)
  - One-click background removal on any image
  - Option to run server-side (better quality) or client-side (privacy)
- [ ] **AI image generation (optional):**
  - Connect to local Stable Diffusion instance or Ollama vision model
  - Text-to-image directly in editor → insert onto canvas
  - Clearly labeled as self-hosted/optional (no external API dependency)
- [x] **Smart suggestions:**
  - Auto-suggest font pairings based on selected heading font
  - Color harmony suggestions
  - Layout suggestions based on content type
- [x] **Auto-layout:**
  - Select elements → auto-arrange with equal spacing
  - Align to grid, distribute evenly
- [x] **Text-to-design:**
  - "Generate with AI" tab in template browser — describe a design, Claude generates it
  - Powered by Anthropic API (claude-sonnet-4-20250514) generating DesignDocument JSON
  - 8 example prompt chips for quick generation

### Acceptance Criteria

- Background removal works in < 5 seconds on a typical photo
- All AI features work self-hosted with no external API calls required
- AI features are clearly optional — editor works fully without them

---

## Phase 7 — Collaboration (Real-Time)

**Goal:** Multiple users can edit the same design simultaneously.

**Duration:** 2–4 weeks

### Tasks

- [x] **Real-time sync engine:**
  - WebSocket server (Socket.io or native WS)
  - CRDT or OT-based conflict resolution (consider Yjs for CRDT)
  - Cursor presence (see other users' cursors + selections)
- [x] **Collaboration UI:**
  - User avatars in top bar
  - Color-coded selections per user
  - "Follow" a collaborator's viewport
- [x] **Comments:**
  - Click anywhere on canvas to leave a comment
  - Comment threads with replies
  - Resolve/unresolve comments
  - @mention collaborators
- [x] **Permissions:**
  - Owner / Editor / Viewer roles
  - Invite by email or link
  - Transfer ownership

### Acceptance Criteria

- Two users on different machines can edit the same design with < 200ms latency
- No data loss on concurrent edits

---

## Phase 8 — Template Marketplace & Community

**Goal:** Users can share and discover community-created templates.

**Duration:** 2–3 weeks

### Tasks

- [x] **Template submission flow:**
  - "Publish as template" button in editor
  - Add metadata: name, category, tags, description
  - Preview generation (auto-thumbnail)
  - Moderation queue (for hosted instance)
- [x] **Template discovery:**
  - Browse by category, trending, newest
  - Search with filters (dimensions, style, color)
  - Preview templates before opening
  - "Use this template" → opens in editor with all elements editable
- [x] **Creator profiles:**
  - Public profile page showing published templates
  - Follow creators
  - Template download/usage counts
- [x] **Ratings & curation:**
  - Upvote/favorite templates
  - Staff picks / featured section
  - Collections (curated lists of templates)

### Acceptance Criteria

- A user can publish a template and have it appear in the marketplace within minutes (or after moderation)
- Template marketplace loads fast with lazy-loaded thumbnails

---

## Phase 9 — Polish, Performance & Accessibility

**Goal:** Production-quality UX, performance, and accessibility.

**Duration:** 2–3 weeks

### Tasks

- [x] **Performance:**
  - Lazy-load fonts (only load fonts used in current design)
  - Virtual scrolling in template browser and asset panels
  - Web Worker for heavy operations (export, AI processing)
  - Service Worker for offline support + asset caching
  - Target: Lighthouse performance score > 90
- [x] **Accessibility:**
  - Full keyboard navigation for all panels and tools
  - Screen reader labels for all interactive elements
  - ARIA roles for canvas objects (where applicable)
  - High contrast mode
  - Reduced motion support
  - WCAG 2.1 AA compliance for all UI chrome
- [x] **Internationalization (i18n):**
  - Extract all UI strings
  - Set up i18n framework (react-i18next)
  - Ship with English + 2–3 community translations
  - RTL layout support
- [x] **Error handling & resilience:**
  - Graceful degradation if IndexedDB is unavailable
  - Error boundaries around canvas and panels
  - Crash recovery: auto-save before unload
  - Sentry or self-hosted error tracking (optional)
- [x] **Onboarding:**
  - First-run tutorial (5–7 steps, tooltip-based)
  - "What do you want to create?" entry point
  - Sample design pre-loaded for first-time users
  - Help/tips panel

### Acceptance Criteria

- Tab through entire editor UI without a mouse
- App works (degraded) with JavaScript-heavy features disabled
- Non-English user can navigate the full UI

---

## Phase 10 — v1.0 Launch

**Goal:** Ship it.

**Duration:** 1–2 weeks

### Tasks

- [ ] **Landing page:**
  - Hero with demo GIF/video
  - Feature highlights
  - "Open Editor" CTA (no signup required)
  - Self-hosting instructions
  - Comparison table (Monet vs Canva Free vs Canva Pro)
  - GitHub star button
- [ ] **Documentation site:**
  - Getting started guide
  - Self-hosting guide
  - Template creation guide
  - API reference (if backend is enabled)
  - Contributing guide
  - Architecture overview
- [ ] **Launch checklist:**
  - [ ] Security audit (dependencies, auth, XSS in SVG uploads)
  - [ ] License review (all bundled assets are CC0/MIT/Apache compatible)
  - [ ] Lighthouse audit (performance, accessibility, SEO)
  - [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - [ ] Mobile/tablet testing
  - [ ] Load testing (if hosted instance)
  - [ ] Write launch blog post
  - [ ] Prepare Show HN / Product Hunt / Reddit posts
  - [ ] Create demo video (2 minutes, no narration needed — just workflow)
  - [ ] Set up GitHub Discussions for community support
  - [ ] Create Discord or Matrix server for community

### Acceptance Criteria

- A brand-new user visits the site → creates a design → exports it in under 3 minutes
- Self-hosted instance deploys with a single `docker compose up`
- GitHub repo has: README, LICENSE, CONTRIBUTING, ROADMAP, CODE_OF_CONDUCT

---

## Timeline Summary

| Phase | Description | Duration | Cumulative |
|-------|------------|----------|------------|
| 0 | Scaffolding | 1–2 days | ~2 days |
| 1 | Core Editor MVP | 2–4 weeks | ~4 weeks |
| 2 | Stock Assets | 1–2 weeks | ~6 weeks |
| 3 | Save/Load | 1 week | ~7 weeks |
| 4 | Brand Kit & Resize | 1–2 weeks | ~9 weeks |
| 5 | Backend & Auth | 2–3 weeks | ~12 weeks |
| 6 | AI Features | 2–3 weeks | ~15 weeks |
| 7 | Collaboration | 2–4 weeks | ~18 weeks |
| 8 | Template Marketplace | 2–3 weeks | ~21 weeks |
| 9 | Polish & a11y | 2–3 weeks | ~24 weeks |
| 10 | Launch | 1–2 weeks | **~26 weeks** |

**Realistic timeline to v1.0: ~6 months** with consistent effort.

**Realistic timeline to usable MVP (Phases 0–3): ~7 weeks.** This is the "wow" moment — a working, client-side-only design editor with templates and export. Ship this first, gather feedback, iterate.

---

## Claude Code Usage Guide

When working on this project with Claude Code, use the following approach:

### Starting a session
```
Tell Claude Code: "Read ROADMAP.md. We are working on Phase [X], Task [Y]. 
Here is the current project structure: [paste tree output]. Continue from 
where we left off."
```

### Phase-specific prompts
- **Phase 0:** "Set up the monorepo with pnpm workspaces, Vite, React, TypeScript, Tailwind, and Fabric.js. Initialize the canvas-engine package."
- **Phase 1.1–1.3:** "Build the canvas editor component with [specific tool]. Reference the Fabric.js docs for [specific API]."
- **Phase 1.4:** "Create the template system. Here is the JSON schema. Generate 5 Instagram post templates with placeholder content."
- **Phase 5:** "Add the Express API server with Better Auth. Use Docker Compose for Postgres + MinIO."
- **Phase 6:** "Integrate rembg as a Python sidecar service. Add a one-click background remove button."

### Best practices for Claude Code sessions
1. Work on one subtask per session for best results
2. Always provide current file tree and relevant existing code
3. Ask Claude Code to write tests alongside implementation
4. Review generated code before committing — Claude Code is fast but not infallible
5. Use `git commit` frequently so you can roll back if needed

---

## Contributing

This project welcomes contributions at every phase. See `CONTRIBUTING.md` for guidelines.

Priority areas for community contributions:
- **Templates** — designers can contribute templates without writing code
- **Translations** — help make the editor accessible worldwide
- **Icons/illustrations** — curate and bundle open asset sets
- **Testing** — cross-browser, accessibility, and performance testing
- **Documentation** — tutorials, guides, and API docs

---

*This roadmap is a living document. Update it as priorities shift and features ship.*
