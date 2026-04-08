# Template Creator Guide

How to create and contribute templates for Monet.

## Quick Start

Templates are defined in `packages/templates/src/registry.ts` using the `tpl()` helper function. Each template is a self-contained design described as JSON — shapes, text, and colors only (no external images).

## Template Format

Every template uses this structure:

```typescript
tpl(
  id,           // Unique ID like 'ig-bold-announce'
  name,         // Display name: 'Bold Announcement'
  description,  // Short description of the design
  category,     // Category: 'Social Media', 'Print', 'Marketing', 'Event'
  subcategory,  // Sub-category: 'Instagram Post', 'Business Card', etc.
  tags,         // Search tags: ['instagram', 'announcement', 'bold']
  width,        // Artboard width in pixels (e.g., 1080)
  height,       // Artboard height in pixels (e.g., 1080)
  bgType,       // Background type: 'solid' or 'gradient'
  bgValue,      // Background value (see below)
  objects,      // Array of shapes and text (see below)
)
```

## Common Dimensions

| Format | Width | Height |
|--------|-------|--------|
| Instagram Post | 1080 | 1080 |
| Instagram Story | 1080 | 1920 |
| Facebook Post | 1200 | 630 |
| YouTube Thumbnail | 1280 | 720 |
| Presentation (16:9) | 1920 | 1080 |
| Business Card | 1050 | 600 |
| A5 Flyer | 1748 | 2480 |
| Twitter/X Header | 1500 | 500 |

## Background Options

**Solid color:**
```typescript
'solid', '#1a1a2e'
```

**Gradient:**
```typescript
'gradient', 'linear:to-bottom:#667eea:#764ba2'
```
Directions: `to-bottom`, `to-right`, `to-bottom-right`

## Object Types

### Rectangle
```json
{
  "type": "rect",
  "left": 100,
  "top": 100,
  "width": 400,
  "height": 200,
  "fill": "#ff0000",
  "stroke": "",
  "strokeWidth": 0,
  "rx": 0,
  "ry": 0,
  "opacity": 1,
  "strokeUniform": true
}
```
- `rx`/`ry`: Corner radius for rounded corners
- `strokeUniform`: Keep stroke width constant regardless of scale

### Circle
```json
{
  "type": "circle",
  "left": 100,
  "top": 100,
  "radius": 50,
  "fill": "#00ff00",
  "opacity": 0.5
}
```

### Text
```json
{
  "type": "textbox",
  "left": 100,
  "top": 100,
  "width": 500,
  "text": "Hello World",
  "fontFamily": "Inter",
  "fontSize": 48,
  "fontWeight": "bold",
  "fill": "#ffffff",
  "textAlign": "center",
  "lineHeight": 1.4,
  "charSpacing": 0
}
```
- `fontWeight`: `"normal"` or `"bold"`
- `textAlign`: `"left"`, `"center"`, `"right"`
- `charSpacing`: Letter spacing in 1/1000 em (e.g., `200` = wide spacing)
- Multi-line text: Use `\n` for line breaks

### Triangle
```json
{
  "type": "triangle",
  "left": 100,
  "top": 100,
  "width": 100,
  "height": 100,
  "fill": "#0000ff"
}
```

### Line
```json
{
  "type": "line",
  "x1": 0, "y1": 0,
  "x2": 200, "y2": 0,
  "stroke": "#ffffff",
  "strokeWidth": 2,
  "left": 100,
  "top": 100
}
```

## Available Fonts

Use only these fonts (they're pre-loaded from Google Fonts):

**Sans-serif:** Inter, Roboto, Open Sans, Montserrat, Lato, Poppins, Nunito, Raleway, Work Sans, DM Sans

**Serif:** Playfair Display, Merriweather, Lora, PT Serif, Libre Baskerville

**Display:** Bebas Neue, Oswald, Anton, Pacifico, Lobster

**Monospace:** Fira Code, JetBrains Mono, Source Code Pro

## Coordinates

- Origin `(0, 0)` is the **top-left corner** of the artboard
- `left` = X position (increases rightward)
- `top` = Y position (increases downward)
- Objects are positioned by their top-left corner

## Colors

- Hex: `"#ff0000"`
- RGBA: `"rgba(255, 255, 255, 0.2)"` (for semi-transparent)
- Use `"rgba(0,0,0,0)"` for transparent fill (useful for border-only shapes)

## Design Tips

1. **Visual hierarchy** — Largest/boldest text for the main message
2. **Breathing room** — Don't fill every pixel; leave margins (60-100px from edges)
3. **2-4 colors max** — Keep palettes cohesive
4. **Layer order** — Objects render bottom to top (first in array = behind)
5. **Readable text** — Ensure contrast between text color and background
6. **Font sizes** — Headlines: 60-120px, Subheadings: 28-48px, Body: 16-28px

## Example: Complete Instagram Post

```typescript
tpl('ig-my-template', 'My Template', 'Description of the template',
  'Social Media', 'Instagram Post', ['instagram', 'tag1', 'tag2'],
  1080, 1080, 'solid', '#1a1a2e', [
    // Background border
    { type: 'rect', left: 60, top: 60, width: 960, height: 960,
      fill: 'rgba(0,0,0,0)', stroke: '#e94560', strokeWidth: 4, strokeUniform: true },
    // Main heading
    { type: 'textbox', left: 120, top: 340, width: 840, text: 'HEADLINE',
      fontFamily: 'Inter', fontSize: 100, fontWeight: 'bold',
      fill: '#ffffff', textAlign: 'center' },
    // Subtitle
    { type: 'textbox', left: 120, top: 500, width: 840,
      text: 'Supporting text goes here.',
      fontFamily: 'Inter', fontSize: 28, fill: '#a0a0b0',
      textAlign: 'center', lineHeight: 1.4 },
    // Button
    { type: 'rect', left: 380, top: 700, width: 320, height: 60,
      fill: '#e94560', rx: 30, ry: 30 },
    { type: 'textbox', left: 380, top: 712, width: 320, text: 'Learn More',
      fontFamily: 'Inter', fontSize: 22, fontWeight: 'bold',
      fill: '#ffffff', textAlign: 'center' },
  ]),
```

## Contributing

1. Add your template to the `TEMPLATE_REGISTRY` array in `packages/templates/src/registry.ts`
2. Run `pnpm build` to check for errors
3. Open a PR with a screenshot of your template

All templates must be self-contained (no external images) and use only the listed fonts.
