# Monet — Design System & Brand Book

> **This file is the visual source of truth.**
> Every Claude Code session that touches UI MUST read this file first.
> No component may use hardcoded colors, spacing, font sizes, shadows, or radii.
> Everything references tokens. Zero exceptions.

---

## Brand Identity

**Monet** is a free, open-source design editor — powered by Claude. The brand should feel:

- **Warm** — earthy, human, approachable (like talking to a thoughtful friend)
- **Intelligent** — precise but never cold
- **Crafted** — every pixel is intentional, like a well-designed object
- **Alive** — subtle motion, responsive to touch

### Design Philosophy

> *"Most design tools feel like machines. Monet should feel like a warm studio — the kind of place where creative work happens naturally."*

Our visual language is inspired by the Anthropic/Claude aesthetic: warm neutrals, earthy accents, cream backgrounds that invite creation rather than intimidate. We use sand and terracotta where others use slate and blue. Our dark mode feels like an evening studio — warm lamplight, not a cold terminal.

**Monet is NOT:** cold/corporate blue-gray, generic purple-gradient AI slop, sterile white, or "looks like every other SaaS tool."

---

## Color System

### Philosophy

Warm earth tones. Sand, clay, terracotta, parchment. The palette is inspired by the Impressionist painters our name references — natural light, warm shadows, organic color. We use OKLCH color space for perceptual uniformity across light and dark themes.

### Brand Accent

```css
/* Warm sienna — our signature. Evokes terracotta, clay, warm earth.
   Adjacent to Anthropic's palette, creating an immediate family resemblance
   while being distinctly ours. */
--accent:            oklch(0.65 0.15 45);     /* warm sienna ~#C4704A */
--accent-hover:      oklch(0.60 0.17 45);     /* deeper on hover */
--accent-active:     oklch(0.55 0.18 45);     /* pressed state */
--accent-subtle:     oklch(0.65 0.15 45 / 0.12);  /* tinted backgrounds */
--accent-foreground: oklch(0.15 0.01 60);     /* dark text on accent — 7:1 contrast */
```

### Secondary Accents (used sparingly)

```css
--accent-blue:       oklch(0.68 0.12 235);    /* soft blue — secondary actions, links */
--accent-sage:       oklch(0.65 0.10 155);    /* sage green — success, confirmations */
--accent-plum:       oklch(0.55 0.14 320);    /* muted plum — AI/smart features indicator */
```

### Light Theme (Default for light mode)

```css
:root {
  /* Surfaces — warm cream/parchment family, NOT pure white, NOT gray */
  --bg-canvas:      oklch(0.94 0.015 70);    /* warm sand — the pasteboard */
  --bg-surface:     oklch(0.97 0.01 70);     /* cream — panels, sidebars */
  --bg-elevated:    oklch(0.99 0.005 70);    /* near-white — cards, popovers */
  --bg-overlay:     oklch(1.00 0 0);          /* white — modals */
  --bg-wash:        oklch(0.93 0.015 70);    /* slightly deeper cream — hover states */

  /* Text — warm dark tones, NOT pure black */
  --text-primary:   oklch(0.16 0.01 60);     /* near-black with warm undertone */
  --text-secondary: oklch(0.45 0.01 60);     /* warm mid-gray */
  --text-tertiary:  oklch(0.62 0.01 60);     /* subtle, disabled */
  --text-inverse:   oklch(0.97 0.01 70);     /* light text on dark backgrounds */

  /* Borders — warm, subtle */
  --border-default: oklch(0.88 0.01 70);     /* subtle warm dividers */
  --border-strong:  oklch(0.78 0.01 70);     /* inputs, focused elements */
  --border-accent:  var(--accent);            /* accent-colored focus rings */

  /* Shadows (light mode — warm-tinted) */
  --shadow-sm:      0 1px 2px oklch(0.30 0.02 60 / 0.06);
  --shadow-md:      0 4px 12px oklch(0.30 0.02 60 / 0.08);
  --shadow-lg:      0 8px 24px oklch(0.30 0.02 60 / 0.12);
  --shadow-xl:      0 16px 32px oklch(0.30 0.02 60 / 0.16);
  --shadow-focus:   0 0 0 2px var(--bg-surface), 0 0 0 4px var(--accent);

  /* Status */
  --success:        oklch(0.62 0.14 155);
  --success-subtle: oklch(0.62 0.14 155 / 0.10);
  --warning:        oklch(0.78 0.14 75);
  --warning-subtle: oklch(0.78 0.14 75 / 0.10);
  --danger:         oklch(0.60 0.20 25);
  --danger-subtle:  oklch(0.60 0.20 25 / 0.10);
  --info:           oklch(0.65 0.12 235);
  --info-subtle:    oklch(0.65 0.12 235 / 0.10);
}
```

### Dark Theme

Dark mode should feel like a warm studio at night — lamplight ambiance, not a cold terminal. Surfaces have a subtle warm undertone.

```css
.dark {
  /* Surfaces — warm dark tones, NOT blue-gray, NOT pure black */
  --bg-canvas:      oklch(0.14 0.008 60);    /* deep warm dark — pasteboard */
  --bg-surface:     oklch(0.18 0.008 60);    /* dark warm — panels */
  --bg-elevated:    oklch(0.22 0.008 60);    /* slightly lifted — cards */
  --bg-overlay:     oklch(0.25 0.008 60);    /* modals, dialogs */
  --bg-wash:        oklch(0.26 0.008 60);    /* hover states */

  /* Text */
  --text-primary:   oklch(0.92 0.01 70);     /* warm off-white */
  --text-secondary: oklch(0.66 0.01 60);     /* 4.5:1 on bg-wash */
  --text-tertiary:  oklch(0.64 0.01 60);     /* 4.5:1 on bg-overlay */
  --text-inverse:   oklch(0.16 0.01 60);     /* dark text on light bg */

  /* Borders */
  --border-default: oklch(0.28 0.008 60);
  --border-strong:  oklch(0.38 0.008 60);

  /* Shadows — more pronounced in dark mode */
  --shadow-sm:      0 1px 3px oklch(0 0 0 / 0.25);
  --shadow-md:      0 4px 12px oklch(0 0 0 / 0.35);
  --shadow-lg:      0 10px 24px oklch(0 0 0 / 0.45);
  --shadow-xl:      0 20px 40px oklch(0 0 0 / 0.55);

  /* Accent adjusts for dark bg — slightly brighter for contrast */
  --accent:         oklch(0.70 0.15 45);
  --accent-hover:   oklch(0.65 0.17 45);
  --accent-active:  oklch(0.60 0.18 45);
  --accent-subtle:  oklch(0.70 0.15 45 / 0.15);
}
```

### Color Rules

1. **Never use hex or rgb in components.** Always `var(--token-name)`.
2. **Never use Tailwind arbitrary color values** like `bg-[#1a1a2e]`. Map tokens to Tailwind via `@theme inline`.
3. **No more `violet-*` Tailwind classes.** Replace all with token-based accent classes.
4. **Surface hierarchy is elevation-based:** canvas < surface < elevated < overlay.
5. **The accent is used sparingly:** primary CTAs, active states, focus rings, selected items. Never large backgrounds.
6. **Warm undertones everywhere.** The hue `60-70` in OKLCH gives a subtle warm cast. This is the signature — sand, not slate.
7. **Never pure black or pure white.** Darkest is `--text-primary`, lightest is `--bg-overlay`. Both have warm undertones.

---

## Typography

### Font Stack

```css
:root {
  --font-sans:     'DM Sans', system-ui, -apple-system, sans-serif;
  --font-display:  'Fraunces', Georgia, serif;
  --font-mono:     'JetBrains Mono', 'Fira Code', monospace;
}
```

**Why DM Sans?** Clean, geometric, excellent for UI at small sizes. More character than Inter, less overused. Available free on Google Fonts.

**Why Fraunces for display?** A beautiful variable optical-size serif — playful, warm, distinctive. It echoes the serif warmth of Anthropic's brand (Tiempos/Lora) without being the same font. Used for the Monet wordmark, welcome screen hero text, and marketing headings. **NOT used in the editor chrome** — only display contexts.

**Rule:** Editor UI uses `--font-sans` exclusively. `--font-display` is for welcome screen, landing page, marketing, and the Monet wordmark only.

### Type Scale

Anchored at 14px for editor UI (design tools use smaller type than websites).

```css
:root {
  --text-xs:    0.6875rem;   /* 11px — labels, badges, metadata */
  --text-sm:    0.8125rem;   /* 13px — secondary UI text, panel labels */
  --text-base:  0.875rem;    /* 14px — primary UI text, inputs, buttons */
  --text-lg:    1.0rem;      /* 16px — section headings in panels */
  --text-xl:    1.25rem;     /* 20px — dialog titles */
  --text-2xl:   1.5rem;      /* 24px — page headings */
  --text-3xl:   2.0rem;      /* 32px — welcome screen, hero */
  --text-4xl:   2.5rem;      /* 40px — display, marketing only */

  --leading-tight:  1.2;     /* headings */
  --leading-normal: 1.5;     /* body text */
  --leading-relaxed: 1.65;   /* long-form, descriptions */

  --tracking-tight:  -0.02em;  /* headings, display */
  --tracking-normal:  0;       /* body */
  --tracking-wide:    0.05em;  /* labels, uppercase, badges */

  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
}
```

### Typography Rules

1. **Editor UI is 14px base.** Not 16px.
2. **Headings use `--weight-medium` or `--weight-semibold`.** Never bold (700).
3. **Panel section headers:** `--text-xs`, `--weight-semibold`, `--tracking-wide`, `uppercase`, `--text-secondary`. Quiet, consistent.
4. **Uppercase always uses `--tracking-wide`.** Without it, uppercase looks cramped.
5. **Max 3 weights on one screen.** Regular + medium + semibold.
6. **No Inter, Roboto, or system fonts in visible UI.** DM Sans is loaded and specified.

---

## Spacing

8px base grid with 4px half-steps.

```css
:root {
  --space-0:   0;
  --space-0.5: 0.125rem;  /* 2px */
  --space-1:   0.25rem;   /* 4px */
  --space-1.5: 0.375rem;  /* 6px */
  --space-2:   0.5rem;    /* 8px — default internal gap */
  --space-3:   0.75rem;   /* 12px — between related items */
  --space-4:   1rem;      /* 16px — section padding */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px — between sections */
  --space-8:   2rem;      /* 32px — major gaps */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
}
```

### Spacing Application

| Context | Token | Px |
|---------|-------|----|
| Panel internal padding | `--space-3` | 12 |
| Between controls in a panel | `--space-2` | 8 |
| Between panel sections | `--space-4` | 16 |
| Toolbar button padding | `--space-1.5` h, `--space-1` v | 6x4 |
| Input padding | `--space-2` h, `--space-1.5` v | 8x6 |
| Modal padding | `--space-6` | 24 |
| Icon-to-label gap | `--space-1.5` | 6 |
| Between list items | `--space-0.5` to `--space-1` | 2-4 |

### Rules

1. **Only use token values.** Never `p-[13px]` or `gap-[7px]`.
2. **Every panel uses `--space-3` padding.** Consistent. No exceptions.
3. **Group related items tightly, separate sections generously.** `--space-2` within, `--space-4` between.

---

## Border Radius

```css
:root {
  --radius-sm:   4px;    /* buttons, inputs, small interactive elements */
  --radius-md:   6px;    /* cards within panels, dropdowns */
  --radius-lg:   8px;    /* modals, dialogs */
  --radius-xl:   12px;   /* large cards, welcome screen elements */
  --radius-full: 9999px; /* pills, avatars, toggles */
}
```

### Rules

1. **Default interactive element radius: `--radius-sm` (4px).** Precise and tool-like.
2. **Modals: `--radius-lg` (8px).** Not `rounded-2xl` (16px) — that's too puffy for a tool.
3. **Nested elements reduce radius.** 8px container -> 4px children inside.
4. **Every button has the same radius.** No exceptions.

---

## Shadows & Elevation

In **light mode**, use shadows + subtle surface color shifts.
In **dark mode**, elevation is communicated primarily through surface color steps, shadows reinforce.

| Level | Surface | Shadow | Usage |
|-------|---------|--------|-------|
| 0 | `--bg-canvas` | none | Pasteboard |
| 1 | `--bg-surface` | none or `--shadow-sm` | Panels, toolbar |
| 2 | `--bg-elevated` | `--shadow-sm` | Cards, popovers |
| 3 | `--bg-overlay` | `--shadow-lg` | Modals, dropdowns |

### Focus Ring

```css
--ring-focus: 0 0 0 2px var(--bg-surface), 0 0 0 4px var(--accent);
```

---

## Motion

```css
:root {
  --duration-fast:     100ms;
  --duration-normal:   150ms;
  --duration-slow:     250ms;
  --duration-slower:   400ms;
  --ease-default:      cubic-bezier(0.2, 0, 0, 1);
  --ease-out:          cubic-bezier(0, 0, 0.2, 1);
  --ease-in:           cubic-bezier(0.4, 0, 1, 1);
  --ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Principles

1. Enter from trigger direction. Exit faster than enter.
2. Scale from 0.97, never 0. Opacity + transform together.
3. No motion on Fabric.js canvas. UI chrome only.
4. Respect `prefers-reduced-motion`.

---

## Component Specs

### Buttons

| Variant | Background | Text | Hover |
|---------|-----------|------|-------|
| Primary | `--accent` | `--accent-foreground` | `--accent-hover` |
| Secondary | `--bg-elevated` | `--text-primary` | `--bg-wash` |
| Ghost | transparent | `--text-secondary` | `--bg-wash` |
| Danger | `--danger` | white | darker |

Height: 32px default, 28px compact, 36px large. Radius: `--radius-sm`. Font: `--text-base`, `--weight-medium`.

### Inputs

Height: 32px. Background: `--bg-canvas`. Border: `--border-default`, focus: `--border-accent`. Radius: `--radius-sm`. Focus ring: `--ring-focus`.

### Panels

Background: `--bg-surface`. Padding: `--space-3`. Section headers: `--text-xs`, `--weight-semibold`, `uppercase`, `--tracking-wide`, `--text-secondary`.

### Modals

Background: `--bg-overlay`. Radius: `--radius-lg`. Shadow: `--shadow-xl`. Backdrop: `oklch(0 0 0 / 0.5)` + blur(4px). Padding: `--space-6`.

---

## Editor Layout

```
Toolbar (48px) | Left Panel (280px) | Canvas (flex) | Right Panel (280px, contextual) | Bottom Bar (28px)
```

Right panel only visible when object selected. Slides in with `slideInRight`.

---

## Relationship to Anthropic/Claude

Monet's visual language is **intentionally adjacent** to Anthropic's brand:

| Anthropic/Claude | Monet |
|-----------------|-------|
| Terracotta `#d97757` | Warm sienna `oklch(0.65 0.15 45)` |
| Cream `#faf9f5` | Warm cream `oklch(0.97 0.01 70)` |
| Dark `#141413` | Warm dark `oklch(0.14 0.008 60)` |
| Soft blue `#6a9bcc` | Soft blue `oklch(0.68 0.12 235)` |
| Sage `#788c5d` | Sage `oklch(0.65 0.10 155)` |
| Styrene / Tiempos (proprietary) | DM Sans / Fraunces (free, Google Fonts) |

Users should *feel* the family resemblance without it being a copy. The warmth, the earthiness, the "intelligence that feels approachable" — that's the shared DNA.

---

## Anti-Patterns (NEVER DO THESE)

1. `bg-[#1a1a2e]` — hardcoded color
2. `text-gray-400` — Tailwind default gray
3. `violet-600` or any `violet-*` — old accent, replaced by token
4. `rounded-2xl` on modals — too puffy, use `--radius-lg` (8px)
5. `font-bold` everywhere — use medium/semibold
6. `transition-all` — transition only changing properties
7. Mixed panel padding — always `--space-3`
8. Pure white `#ffffff` or black `#000000` — use warm tokens
9. Inter, Roboto, system fonts — use DM Sans
10. Blue-gray surfaces (`slate-*`, `zinc-*`) — warm neutrals hue 60-70
11. `bg-white dark:bg-gray-900` — use `bg-surface` token

---

## Implementation for Claude Code

### Step 1: Create `apps/web/src/styles/tokens.css` with all variables above
### Step 2: Map tokens to Tailwind via `@theme inline` in main CSS
### Step 3: Load DM Sans + Fraunces from Google Fonts in `index.html`
### Step 4: Systematically replace all `violet-*`, `gray-*`, `blue-*` Tailwind classes with token classes
### Step 5: Test dark mode first (it's the default)
### Step 6: Verify contrast ratios on every text/background pair

---

*This design system is a living document. Every visual choice traces back to a token.*
