# Monet Template Audit Report

**Date:** 2026-04-12
**Auditor:** Claude (automated quality review)
**File:** `packages/templates/src/registry.ts`
**Templates counted:** 51 (file header claims 53 — discrepancy of 2)
**Scoring:** 1–5 scale (1 = needs total rebuild, 5 = ship-ready)
**Verdict thresholds:** SHIP (5), TOUCH UP (3–4), REBUILD (1–2)

---

## Critical Systemic Issue

Before the per-template review: **50 of 51 templates were generated from the same formula.** The pattern is:

1. Gradient accent line: `fill: { type: 'linear', colorStops: [{ color: '#C4704A' }, { color: '#e8956d' }] }` — a 50–400px rect
2. Shadow on heading: `shadow: { color: 'rgba(0,0,0,0.08 or 0.5)', blur: 12 or 16, offsetX: 0, offsetY: 4 }`
3. `charSpacing` on the heading (80–600)
4. Decorative circles at low opacity (0.05–0.25) scattered around
5. `#C4704A` as the only accent color
6. DM Sans for body, Montserrat or Playfair Display for headings
7. Zero use of: stars, diamonds, hearts, pentagons, hexagons, arrows, speech bubbles, rounded-rects (all available in the engine)

Template #51 (`product-launch-showcase`) is the sole exception — it was clearly hand-designed. The contrast is stark and embarrassing.

---

## Per-Template Reviews

---

### 1. The Night Owl Show (id: podcast-cover) — Score: 2/5 — Verdict: REBUILD
Category: Social Media | Subcategory: Podcast | Dimensions: 1080×1080

**What works:** Gradient background (navy to dark purple) sets a nighttime mood. The EP badge with gradient fill is a nice CTA element. Large bold type with shadow is readable.

**What's wrong:** The "microphone" (a circle + rect) looks like a lollipop, not a mic. Two decorative circles at different opacities add nothing. The entire bottom half below the text is unused. The same sienna accent line + shadow + charSpacing formula as every other template.

**Missing features:** No radial gradients (would create a spotlight effect). No shape variety. No use of opacity layering for depth.

**If rebuilding:** Dark moody atmosphere with a radial gradient spotlight center-stage. Audio waveform shapes (rows of rounded-rects at varying heights). Layered transparent shapes creating depth. The EP badge should pop more — maybe a frosted-glass effect with a subtle backdrop.

---

### 2. She Believed She Could (id: ig-quote-believe) — Score: 3/5 — Verdict: TOUCH UP
Category: Social Media | Subcategory: Instagram Post | Dimensions: 1080×1080

**What works:** Large decorative quotation marks (280px, 20% opacity) create elegant framing. Peach gradient background is warm and cohesive. Italic serif quote text with good line height creates readability. Attribution with em-dash is properly formatted.

**What's wrong:** The gradient accent line between quote and attribution is the same formula used in 50 other templates. Empty corners — lots of unused space above and below. The color palette is limited to one hue family.

**Missing features:** No decorative shapes (a thin diamond or star between sections would add class). No text stroke or outline effects.

**If rebuilding:** Keep the quotation marks and serif type. Add subtle botanical line art shapes. Use a second muted color (sage or dusty rose) for visual interest.

---

### 3. Summer Collection Sale (id: ig-story-sale) — Score: 3/5 — Verdict: TOUCH UP
Category: Social Media | Subcategory: Instagram Story | Dimensions: 1080×1920

**What works:** Bold "40% OFF" at 140px is immediately eye-catching. Warm gradient background (sienna to terracotta) is on-brand. White gradient CTA button with dark text creates contrast. Wide charSpacing on "SUMMER COLLECTION" creates luxury feel. Decorative circles at low opacity add subtle depth.

**What's wrong:** Only uses circles as decorative elements — no shape variety. The story format (1080×1920) has massive empty space above and below the content cluster. Promo code section blends into the background.

**Missing features:** No star/burst shapes for "SALE" emphasis. No rotated elements for dynamism. No use of text stroke.

**If rebuilding:** Add a starburst or diamond shape behind the discount number. Use rotated rectangles for energy. Scatter the vertical space with more varied decorative elements. Add a second accent color.

---

### 4. 5 Design Mistakes (id: yt-thumb-mistakes) — Score: 2/5 — Verdict: REBUILD
Category: Social Media | Subcategory: YouTube Thumbnail | Dimensions: 1280×720

**What works:** Text stroke (#C4704A, 2px) on the heading is good for YouTube readability. The "!" warning badge with gradient circle is a clever detail. Dark background creates contrast.

**What's wrong:** YouTube thumbnails need MAXIMUM visual energy — this is too restrained. The question mark circle in the background is barely visible. The accent line at bottom is the same formulaic element. The right side is mostly empty dark space. Font size hierarchy is reasonable but the layout is left-heavy.

**Missing features:** No face/avatar placeholder (YouTube thumbnails almost always have a face). No emoji or icon elements. No diagonal elements or dynamic angles. No color contrast beyond sienna-on-black.

**If rebuilding:** Split-screen layout with a large face placeholder on the right. Add a bright red or yellow accent for urgency. Use diagonal dividers. Add numbered list element (1,2,3,4,5). Make the "5" enormous and colored differently. Add emoji-style shapes. YouTube thumbnails are meant to scream — this one whispers.

---

### 5. 2026 Marketing Trends (id: li-carousel-cover) — Score: 3/5 — Verdict: TOUCH UP
Category: Social Media | Subcategory: LinkedIn Post | Dimensions: 1080×1080

**What works:** White card with box-shadow on cream background creates clean depth. Left accent bar (full-height gradient stripe) is distinctive. Serif heading at 80px creates authority. "1/10" page indicator is a smart carousel convention. Professional, appropriate for LinkedIn's tone.

**What's wrong:** The bottom half of the card is somewhat empty. Only one decorative element (the gradient bar). Very monochromatic — cream/white/sienna palette.

**Missing features:** No icon elements. No data visualization shapes (charts, arrows). No second color for variety.

**If rebuilding:** Add subtle data/chart iconography. Use a second muted color (navy or sage) for the subheading. Add a small company logo placeholder.

---

### 6. Creative Studio (id: tw-banner-studio) — Score: 2/5 — Verdict: REBUILD
Category: Social Media | Subcategory: Twitter Header | Dimensions: 1500×500

**What works:** Wide charSpacing (600) on "CREATIVE STUDIO" creates an editorial feel. The split accent line (gradient + faded continuation) is a subtle design detail.

**What's wrong:** Pure white background is bland and will look washed out on Twitter. The two decorative circles on the right are barely visible (10% and 18% opacity sienna). For a 1500×500 banner, the content is concentrated in the left third — the right 60% is dead white space. "@studio.creative" is the only secondary element and it's tiny.

**Missing features:** No photo placeholder. No brand mark area. No background texture or pattern. No shape variety.

**If rebuilding:** Use a warm cream or dark background instead of pure white. Add a portfolio image grid or geometric pattern on the right side. Create visual interest across the full width — Twitter banners must work at a glance. Add service keywords or a tagline.

---

### 7. Minimalist Home Office (id: pin-home-office) — Score: 2/5 — Verdict: REBUILD
Category: Social Media | Subcategory: Pinterest Pin | Dimensions: 1000×1500

**What works:** Photo placeholder is appropriately sized for a Pinterest pin. Serif heading with shadow creates elegance. The save icon (↓) in a circle is a charming detail. Warm cream background matches the platform aesthetic.

**What's wrong:** "YOUR PHOTO" text in the placeholder actively makes the template look empty/broken before a user replaces it. The bottom third below the description is entirely empty. The accent line is only 50px — barely visible.

**Missing features:** No shape overlays on the photo area. No "save" or "pin" visual hint. No decorative elements in the empty space.

**If rebuilding:** Replace "YOUR PHOTO" with a warm gradient fill in the photo rect (like template #51 does). Add overlapping shapes or a frame around the photo area. Use the full vertical space — add bullet points or additional text sections. Add a subtle pattern or texture.

---

### 8. Watch This! (id: tiktok-cover-watch) — Score: 3/5 — Verdict: TOUCH UP
Category: Social Media | Subcategory: TikTok Cover | Dimensions: 1080×1920

**What works:** 160px bold text with stroke and shadow is appropriately dramatic for TikTok. Angled background rectangles (25°, -15°, 40°) at low opacity add dynamism. Near-black background is on-brand. Gradient accent line at center breaks the layout well. The text feels TikTok-native.

**What's wrong:** Still only uses circles and rectangles. The bottom portion (below the accent line to the handle) is mostly empty. The rotated rects are subtle — they need more variety and boldness.

**Missing features:** No star/burst shapes for emphasis. No emoji-style elements. No arrows or directional shapes.

**If rebuilding:** Add more varied rotated shapes (triangles, stars, arrows). Make the background shapes bolder (higher opacity). Add a "play button" or video frame element. Use a second bright accent color.

---

### 9. Jazz in the Park (id: fb-event-jazz) — Score: 2/5 — Verdict: REBUILD
Category: Social Media | Subcategory: Facebook Event | Dimensions: 1200×628

**What works:** Warm gradient background (dark brown to black) evokes a nighttime jazz atmosphere. Date and venue information is complete and readable. Decorative circles in the upper-right suggest ambient lights.

**What's wrong:** For a Facebook event cover, this is far too sparse. The right half is essentially empty dark space with three tiny circles. The gradient accent line is the same formula. There's nothing that says "jazz" — no musical elements, no visual energy. It looks more like a corporate announcement than a jazz event.

**Missing features:** No musical shapes (notes, instruments). No image placeholder for performers. No ticket/price info. No visual texture.

**If rebuilding:** Add abstract musical note shapes or saxophone silhouette paths. Use a warm gold secondary color. Add a photo placeholder for the performer. Create a more evocative layout — maybe an asymmetric composition with overlapping shapes suggesting musical improvisation.

---

### 10. Pixel Collective (id: discord-banner) — Score: 2/5 — Verdict: REBUILD
Category: Social Media | Subcategory: Discord Banner | Dimensions: 960×540

**What works:** Cyan (#22d3ee) is a nice departure from the ubiquitous sienna. The glow effect (shadow color matching text: cyan at 40% opacity, blur 20) is technically clever. The gradient accent line (cyan → purple) is better color-matched than most.

**What's wrong:** The 2×2 grid of near-invisible rectangles (3% and 5% opacity) does nothing. The overall layout is left-text/right-empty. For a Discord server — a community platform — this feels lifeless and corporate. No sense of community, creativity, or gaming culture.

**Missing features:** No code/pixel art shapes. No avatar placeholders. No community member count or channel preview. No tech-themed decorative elements.

**If rebuilding:** Pixel art or grid-based decorative pattern. Brighter neon colors (Discord's aesthetic is vivid). Avatar circles suggesting community. Code bracket shapes or terminal-style elements. Make it feel like a vibrant community, not a corporate page.

---

### 11. Elena Vasquez, Architect (id: biz-card-elena) — Score: 2/5 — Verdict: REBUILD
Category: Business | Subcategory: Business Card | Dimensions: 1050×600

**What works:** Clean typography hierarchy (name → title → contact). Company name in bottom-right corner with accent color is a nice branding detail. Warm cream background is professional.

**What's wrong:** The gradient accent line is only 50px by 2px — practically invisible. No logo placeholder. Contact info at 14px is very small. The middle area (between the accent line and contact info) is vast empty space. The card lacks any visual personality that would make it memorable.

**Missing features:** No logo/monogram placeholder. No QR code area. No background pattern or texture. No shape elements.

**If rebuilding:** Add a logo/monogram area (large initial letter or circle). Use a partial background color block or diagonal divider to create visual interest. Add a QR code placeholder. Consider a two-sided design. Make the accent element more prominent.

---

### 12. Studio Monet Invoice (id: invoice-studio) — Score: 2/5 — Verdict: REBUILD
Category: Business | Subcategory: Invoice | Dimensions: 2550×3300

**What works:** Gradient header bar across the top is elegant. "INVOICE" in accent with shadow is prominent. The table header row with solid accent background is functional.

**What's wrong:** Column alignment uses spaces in a proportional font (DM Sans) — this will misalign when rendered. The invoice only shows 3 line items with no subtotal, tax, or total line. On a full letter-size page (2550×3300), the content only fills the top 35% — the bottom 65% is empty white. No payment terms, no bank details, no "Thank you" footer.

**Missing features:** No company logo area. No payment information section. No subtotal/tax/total calculations. No terms & conditions.

**If rebuilding:** Add proper table structure with aligned price columns (use separate textboxes, not spaces). Add subtotal/tax/total section. Add payment info, terms, and a branded footer. Fill the page proportionally. Add a "PAID" stamp option.

---

### 13. Apex Consulting (id: one-pager-apex) — Score: 2/5 — Verdict: REBUILD
Category: Business | Subcategory: One-Pager | Dimensions: 2550×3300

**What works:** Gradient header (sienna to dark brown) creates a strong first impression. Three stat columns (150+ clients, $2.4B revenue, 98% retention) are compelling. Frosted stat overlay with gradient background is a nice depth effect.

**What's wrong:** The template only fills the top 30% of a full letter-size page. Below the body paragraph (y=920, max y=3300), there's 2,380 pixels of empty white space. The one-pager is literally not a one-pager — it's a one-third-pager. Stats have no visual separation (the gradient overlay only covers the first stat).

**Missing features:** No services section. No team/leadership section. No contact info block. No testimonial area. No visual elements (charts, icons).

**If rebuilding:** Fill the full page. Add: services grid with icons, client logos placeholder row, team headshots area, contact info footer with map placeholder, and a testimonial quote. Each section should have its own visual treatment.

---

### 14. David Chen (id: email-sig-david) — Score: 2/5 — Verdict: REBUILD
Category: Business | Subcategory: Email Signature | Dimensions: 600×200

**What works:** Compact dimensions are appropriate. Contact info hierarchy is correct (name → title → email/phone → website/LinkedIn).

**What's wrong:** At 600×200, this is so small that design quality is hard to evaluate — but even so, it's purely typographic with no visual identity. The gradient accent line is 40×2 pixels — literally invisible. There's no visual element that would make someone remember this signature. Shadow on the name at this scale creates blur, not elegance.

**Missing features:** No headshot placeholder. No company logo. No social media icons. No separator between vertical and horizontal info.

**If rebuilding:** Add a small headshot circle and company logo. Use a vertical accent bar instead of a tiny horizontal line. Add social media icon placeholders. Consider a horizontal layout (photo | info | logo).

---

### 15. Brand Strategy 2026 (id: proposal-cover) — Score: 2/5 — Verdict: REBUILD
Category: Business | Subcategory: Proposal | Dimensions: 2550×3300

**What works:** Dark gradient background (purple to sienna) is dramatic. Large serif title with shadow commands attention. "Confidential" footer with wide charSpacing is a professional detail.

**What's wrong:** On a full letter-size page, the content is a single circle (decorative), one title, one subtitle, one more decorative circle, and a footer. That's 5 elements on a page that's 8.4 million pixels. The "Prepared for Luminary Brands" text is the only differentiating content. The decorative circles at 6-8% opacity are invisible.

**Missing features:** No company logo area. No project scope preview. No date field. No team/contact info. No visual richness.

**If rebuilding:** Add a large company logo placeholder at top. Create a structured information block (client name, date, project code, team lead). Add subtle geometric patterns or shapes. Consider a two-panel layout (dark left with branding, lighter right with project info). Add more decorative elements for a premium feel.

---

### 16. Certificate of Excellence (id: certificate-excellence) — Score: 3/5 — Verdict: TOUCH UP
Category: Business | Subcategory: Certificate | Dimensions: 3300×2550

**What works:** Double border (3px outer, 1px inner) creates an ornamental frame. Gold gradient seal circle with star emoji is a nice authenticity detail. Typography hierarchy works: formal title → "Awarded to" → italic name in accent → description. Landscape orientation is correct for certificates.

**What's wrong:** The seal is just a gradient circle with a text star — it needs more ornamentation. The space between the description and the seal is vast. No signature line. No date field. No organization logo area.

**Missing features:** No signature lines. No date awarded. No decorative corner ornaments. No organization seal area. No certificate number.

**If rebuilding:** Add decorative corner ornaments (rotated diamonds or flourish shapes). Add two signature lines with titles. Add date field and certificate number. Make the seal more elaborate (concentric circles, radiating lines). Add a subtle background pattern or watermark.

---

### 17. Weekly Standup Notes (id: meeting-notes) — Score: 3/5 — Verdict: TOUCH UP
Category: Business | Subcategory: Meeting Notes | Dimensions: 2550×3300

**What works:** Traffic light status indicators (green circle = completed, sienna = in progress, red = blockers) are clever and immediately scannable. Content is realistic and detailed with believable project updates. Structured sections are clearly separated. Gradient accent line under the title is proportional.

**What's wrong:** Very text-heavy — appropriate for meeting notes, but there are no visual dividers between sections (only the colored dots). The content ends at y≈1100 on a 3300px page — the bottom 65% is empty. No action items section. No attendees list.

**Missing features:** No attendee avatars or names section. No action items with owners. No next meeting date. No horizontal rules between sections.

**If rebuilding:** Add an attendees row with small avatar circles. Add horizontal dividers between sections. Add an "Action Items" section with checkbox placeholders. Add a "Next Meeting" footer. Fill more of the page.

---

### 18. Sarah Mitchell, Speaker (id: name-badge) — Score: 2/5 — Verdict: REBUILD
Category: Business | Subcategory: Name Badge | Dimensions: 1050×750

**What works:** Gradient header bar with overlay creates depth. Photo placeholder circle with accent stroke is functional. Event branding at bottom with wide charSpacing.

**What's wrong:** The layered header (gradient + semi-transparent overlay at 60% opacity) creates a muddy color. The photo circle has no placeholder text (just an empty circle). Generic layout that every conference badge generator produces. Too much empty space between photo and title.

**Missing features:** No QR code area for digital badge exchange. No attendee type indicator (Speaker/VIP/General). No company logo area. No session track color coding.

**If rebuilding:** Add a colored role badge (SPEAKER in a pill shape). Add a QR code placeholder. Add a company logo row. Use track colors. Make the photo placeholder show initials or "PHOTO" text. Consider a more distinctive layout.

---

### 19. Introducing AuraSound (id: product-launch) — Score: 3/5 — Verdict: TOUCH UP
Category: Marketing | Subcategory: Product Launch | Dimensions: 2550×3300

**What works:** Dark gradient background creates premium tech feel. "INTRODUCING" with 600 charSpacing is a classic Apple-style reveal. Concentric decorative circles suggest a product icon area. Feature bullets with dots are scannable. Gradient CTA button ("Pre-order · $199") is prominent and includes pricing.

**What's wrong:** The concentric circles are at 8-12% opacity — too subtle. No product image/shape placeholder in the obvious focal area. The content cluster is centered vertically, leaving large empty zones at top and bottom. "Immersive spatial audio" tagline is appropriately descriptive.

**Missing features:** No product silhouette or shape. No spec grid or comparison table. No "available on" store badges.

**If rebuilding:** Add an abstract product shape (a headphone silhouette using paths). Make the concentric circles more prominent or use them as a product halo. Add a specs section below the CTA. Add store badges placeholder.

---

### 20. The Golden Fork (id: menu-golden-fork) — Score: 3/5 — Verdict: TOUCH UP
Category: Food & Lifestyle | Subcategory: Restaurant Menu | Dimensions: 2550×3300

**What works:** Dark background (#1a1510) with warm text (#e8dcc8) creates an upscale dining atmosphere. Proper menu formatting — items left-aligned, prices right-aligned. Section headers with wide charSpacing (400). Thin border frame adds elegance. Menu content is realistic and appetizing (burrata, scallops, lamb chops, salmon).

**What's wrong:** Only shows Starters and Mains — missing Desserts, Drinks, and a chef's note. The menu content ends at y≈1200 on a 3300px page — the entire bottom half is empty dark space. Gradient divider line is the same formula. Prices are in separate textboxes, which is a good structural choice.

**Missing features:** No restaurant logo area. No decorative dividers between sections (just a plain line). No "Chef's Selection" or "Wine Pairing" notes.

**If rebuilding:** Fill the page — add Desserts, Wines/Cocktails sections. Add a chef's note in italic. Add a decorative divider (ornamental shapes, not just a line). Add a footer with address and hours. Consider a two-column layout for the lower sections.

---

### 21. Modern Loft $425,000 (id: real-estate) — Score: 2/5 — Verdict: REBUILD
Category: Marketing | Subcategory: Real Estate | Dimensions: 1080×1080

**What works:** Gradient price badge is a nice highlight. Property specs (3 bed · 2 bath · 1,840 sqft) are formatted well with dot separators. Agent attribution at bottom.

**What's wrong:** The photo placeholder is a flat gray rectangle with "PROPERTY PHOTO" text — looks broken. The bottom accent bar (full-width rect at 80% opacity) feels arbitrary. Very linear, vertical layout with no visual sophistication. The listing looks like a basic MLS card from 2010.

**Missing features:** No multiple image areas. No floor plan icon. No map placeholder. No agent photo circle. No "JUST LISTED" or "OPEN HOUSE" badge.

**If rebuilding:** Asymmetric layout with a large hero image area and smaller detail images. Gradient-filled image placeholder (like template #51). Add an "OPEN HOUSE" badge shape. Add agent photo circle. Add amenity icons. Create visual hierarchy that draws the eye to the price and key features.

---

### 22. 20% OFF Your Order (id: coupon-twenty) — Score: 2/5 — Verdict: REBUILD
Category: Marketing | Subcategory: Coupon | Dimensions: 1800×750

**What works:** Dashed border (`strokeDashArray: [12, 8]`) is semantically appropriate for a coupon. Large "20% OFF" is immediately readable. Two-zone layout separating the offer from the brand works conceptually.

**What's wrong:** Despite the large dimensions, the design is flat and lacks energy. The brand area on the right (subtle gradient at 2-10% opacity) is nearly invisible. The overall feel is more "corporate memo" than "exciting discount." The dashed border stroke is the only shape element. No visual urgency.

**Missing features:** No scissors/cut-line icon. No barcode placeholder. No star burst or badge shape. No expiration urgency styling.

**If rebuilding:** Add a starburst or circular badge behind the discount number. Use a brighter color for urgency (warm red or orange). Add a scissors icon at the dashed border. Make the brand area more prominent. Add a barcode placeholder. Create visual excitement — coupons should make people want to use them.

---

### 23. This Changed Everything (id: testimonial-card) — Score: 3/5 — Verdict: TOUCH UP
Category: Marketing | Subcategory: Testimonial | Dimensions: 1080×1080

**What works:** Large decorative quotation mark at 12% opacity creates elegant framing. Italic serif quote text with good line height (1.6) is readable and warm. Five-star rating in accent color adds credibility. Customer photo placeholder (circle) with name and company follows proven social proof patterns.

**What's wrong:** The bottom portion below the customer info is empty. The gradient accent line between stars and customer info is the same formula. Only one testimonial — a card could show rating/summary at a glance.

**Missing features:** No company logo next to the customer name. No "Verified Purchase" badge. No metric ("2x conversion increase") called out visually.

**If rebuilding:** Add a key metric in large type above the quote. Add a small company logo next to the attribution. Add a subtle brand pattern in the background. Consider a before/after visual element.

---

### 24. The Weekly Brief #47 (id: newsletter-header) — Score: 2/5 — Verdict: REBUILD
Category: Marketing | Subcategory: Newsletter | Dimensions: 1200×400

**What works:** Gradient background (sienna to lighter sienna) is warm. Issue number and date formatting is clean.

**What's wrong:** For a newsletter header that needs to grab attention in an inbox, this is too simple. Three decorative circles at 5-8% opacity contribute nothing. The gradient accent line is the same formula. No brand identity — the newsletter name could be anything.

**Missing features:** No logo/masthead area. No navigation links. No issue thumbnail. No visual element that creates brand recognition.

**If rebuilding:** Add a distinctive masthead/logo treatment. Create a more editorial layout — maybe a featured article title teaser. Add navigation elements (Articles · Podcast · Events). Use a distinctive shape element that becomes the newsletter's visual identity.

---

### 25. Download TaskFlow (id: app-promo-taskflow) — Score: 2/5 — Verdict: REBUILD
Category: Marketing | Subcategory: App Promo | Dimensions: 1080×1920

**What works:** Device frame concept (white rounded rect simulating a phone) is the right approach. Feature checklist with checkmarks is scannable. Gradient CTA button is prominent.

**What's wrong:** The "device frame" is just two nested rectangles — it looks nothing like a phone. The purple/blue gradient (#667eea to #764ba2) is completely off-brand from the rest of the design system. The app name "TaskFlow" inside the device is plain text, not a UI mockup. The feature list is generic and could describe any productivity app.

**Missing features:** No app icon. No app store badges. No phone notch/camera detail. No screenshot mockup. No rating stars.

**If rebuilding:** Create a more convincing device frame with proper proportions and a notch detail. Use the brand color system (warm sienna, not cold purple). Add a mock UI inside the device (even simple shapes suggesting an interface). Add app store badge placeholders. Add a download QR code. Include social proof (star rating, download count).

---

### 26. Emma & James (id: wedding-emma-james) — Score: 3/5 — Verdict: TOUCH UP
Category: Events | Subcategory: Wedding | Dimensions: 1500×2100

**What works:** Elegant restraint appropriate for a wedding invitation. Thin border frame with corner circles (subtle floral suggestion). Beautiful serif typography for names and dates. Complete event information (date in words, venue, RSVP, reception note). The text is written in traditional invitation language.

**What's wrong:** Corner circles are too subtle to suggest florals — they just look like random dots. Large empty zones between sections. The RSVP text at the bottom is too far from the main content. Uses only circles for decoration.

**Missing features:** No floral/botanical shapes (the engine could draw these as paths). No monogram. No map/directions placeholder. No meal preference checkbox area.

**If rebuilding:** Add botanical path shapes in corners (leaves, branches). Create a monogram (intertwined initials in a circle). Use a subtle damask or botanical background pattern. Add a response card section. Make the gradient divider more ornamental.

---

### 27. Mia Turns 7! (id: birthday-mia) — Score: 2/5 — Verdict: REBUILD
Category: Events | Subcategory: Birthday | Dimensions: 1080×1080

**What works:** Bright gradient background (yellow to pink) is festive. "Confetti" elements (circles and rotated squares) create a party feel. Bold text is age-appropriate for a kids' party.

**What's wrong:** The confetti is too sparse and subtle — at 15-30% opacity white, it barely registers on the bright gradient. All shapes are either circles or axis-aligned/slightly-rotated rectangles. For a 7-year-old's party, this is far too restrained and generic. No sense of fun or personality. Where are the balloons? Stars? Party hats?

**Missing features:** Star shapes. Heart shapes. Triangle bunting/banner shapes. Balloon shapes (circles with string lines). Party hat shapes (triangles). No illustration area.

**If rebuilding:** Go wild with shape variety — stars, hearts, triangles, diamonds at full opacity in multiple bright colors (not just white). Add balloon shapes, bunting/banner triangles. Use a playful handwriting-style font. Add a cake illustration area. Make it scream "PARTY!" not "corporate mixer."

---

### 28. Midnight Echo Live (id: concert-midnight) — Score: 3/5 — Verdict: TOUCH UP
Category: Events | Subcategory: Concert | Dimensions: 2400×3600

**What works:** Ghost text effect (second text layer at slight offset in semi-transparent accent) is sophisticated. The glow line (solid line + wider semi-transparent line behind it) creates a neon effect. Huge typography (200px) creates cinematic scale. Gradient CTA ticket button with pricing. Information hierarchy is clear (band → show type → date/venue → doors/time → tickets).

**What's wrong:** The lower half of the poster (below the CTA) is entirely empty — 1,600px of unused black space. The ghost text only applies to "MIDNIGHT" but not "ECHO." The overall feel, while dramatic, follows the same dark-template formula as many others.

**Missing features:** No support act listing. No sponsor logos area. No social media handles. No age restriction badge. No venue address.

**If rebuilding:** Add an opening act line. Add a sponsor/partner logo row at the bottom. Fill the empty lower section with subtle atmospheric elements (abstract shapes, light streaks). Make "ECHO" also have the ghost text treatment. Add a venue address line. Consider adding diagonal or radial elements for energy.

---

### 29. TechSummit 2026 Badge (id: conf-badge) — Score: 2/5 — Verdict: REBUILD
Category: Events | Subcategory: Conference | Dimensions: 750×1050

**What works:** Dark gradient header creates a tech-conference atmosphere. QR code placeholder is practical and forward-thinking. Attendee name in serif creates contrast with the sans-serif conference branding.

**What's wrong:** The header overlay (purple at 60% opacity) creates a murky, unintentional color. The space between the attendee info and QR code is vast and empty. The badge design is generic — every conference platform generates badges like this. "2026" at 500 charSpacing is excessively spaced.

**Missing features:** No attendee type indicator (Speaker, VIP, General, Staff). No company logo placeholder. No schedule highlights. No social handle.

**If rebuilding:** Add role-based color coding (colored stripe or badge pill). Add company logo area. Add a simplified schedule or track info. Make the QR code area more prominent with a scan instruction. Give it visual identity beyond "generic conference."

---

### 30. An Evening of Hope (id: gala-evening) — Score: 2/5 — Verdict: REBUILD
Category: Events | Subcategory: Gala | Dimensions: 1500×2100

**What works:** Dark background with gold-ish sienna accents is appropriate for formal events. Serif type with shadow creates elegance. "Black Tie" note and RSVP deadline are important practical details.

**What's wrong:** Virtually identical formula to every other dark-background template in this registry. Four decorative circles at 6-12% opacity are invisible. The invitation has massive empty space — the content cluster sits in the center third of the page with nothing above or below. No sense of luxury, grandeur, or charitable purpose.

**Missing features:** No organization logo. No ornamental border. No table/seating info. No ticket price. No dress code illustration. No beneficiary information.

**If rebuilding:** Add ornamental borders or art deco geometric patterns (fitting for a gala). Add the charitable organization's logo and mission statement. Use gold as a distinct color (not just sienna). Add a decorative frame around the invitation text. Include ticket information and charitable purpose. Make it feel like a $500/plate event, not a template.

---

### 31. Intro to Watercolor (id: workshop-watercolor) — Score: 3/5 — Verdict: TOUCH UP
Category: Education | Subcategory: Workshop | Dimensions: 2550×3300

**What works:** Gradient header bar is visually grounding. Three-session timeline with dot indicators is well-structured and scannable. Complete practical information (instructor, dates, location, price, time). Clean separation between the workshop sessions and logistics info.

**What's wrong:** Content ends at y≈1310 on a 3300px page — the bottom 60% is empty. For a watercolor workshop, there are zero visual elements suggesting art or watercolor. The dot indicators are just small circles — they could be more distinctive.

**Missing features:** No watercolor-style visual elements (splatters, washes). No instructor photo placeholder. No materials list preview. No "Register Now" CTA.

**If rebuilding:** Add watercolor-style decorative shapes (irregular circles with varying opacity to suggest paint drops). Add an instructor photo circle. Fill more of the page — add a materials list, what to expect, FAQs. Add a CTA button. Use a second color to suggest paint.

---

### 32. The Quiet Architecture of Days (id: book-cover-quiet) — Score: 3/5 — Verdict: TOUCH UP
Category: Creative | Subcategory: Book Cover | Dimensions: 1600×2560

**What works:** Dark gradient background (purple to dark brown) creates a moody, literary atmosphere. Title at 88px with line height 1.4 creates good readability and presence. "A NOVEL" label with wide charSpacing is a classic book cover convention. Author name in accent color at the bottom is properly placed. The restrained aesthetic matches literary fiction.

**What's wrong:** Two decorative circles at 6-8% opacity are invisible against the dark gradient. The space between "A NOVEL" and the author name (900px) is vast and empty. The gradient accent line fading from 10% to 60% opacity is barely visible.

**Missing features:** No spine text. No back cover content. No publisher logo area. No review quote. No subtle texture or pattern.

**If rebuilding:** Add a more prominent visual element in the center (an abstract shape, a constellation pattern, geometric art). Add a review quote in the empty middle zone. Add a publisher logo/imprint at the bottom. Consider a subtle texture overlay. The title should be the hero — consider making the typography more distinctive.

---

### 33. Photosynthesis (id: flashcard-photo) — Score: 3/5 — Verdict: TOUCH UP
Category: Education | Subcategory: Flashcard | Dimensions: 1050×750

**What works:** Two-zone layout (colored left panel for term, white right panel for definition) is pedagogically sound and visually clear. The vertical gradient divider is a creative separator. The chemical equation (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂) with Unicode subscripts is a great realistic detail. Subject/chapter footer provides context. Proper use of serif for the equation (scientific convention).

**What's wrong:** The left panel green (#e8f5e9) is a cold Tailwind green — doesn't match the warm design system. The decorative circle on the left adds nothing. "PHOTO-SYNTHESIS" uses a soft hyphen character — may not render consistently.

**Missing features:** No difficulty rating. No card number (1 of N). No diagram placeholder. No "flip" visual cue.

**If rebuilding:** Change the green to a warm sage from the design system. Add a difficulty indicator (stars or bars). Add a diagram placeholder area. Add a card number. Consider a visual element related to the topic (leaf shape, sun shape).

---

### 34. Alex Rivera, UX Designer (id: resume-alex) — Score: 3/5 — Verdict: TOUCH UP
Category: Business | Subcategory: Resume | Dimensions: 2550×3300

**What works:** Two-column layout with dark gradient sidebar is a proven, popular format. Skill bars (progress bars using overlapping rects) add visual interest. Realistic content — Spotify and Airbnb are believable employers with specific achievements (24% engagement increase, 40% setup time reduction). Contact info in sidebar is well-organized. Section separators with accent color work.

**What's wrong:** The resume content ends at y≈815 in the main column — the bottom 75% of the page is empty. Only shows 2 jobs and 1 degree. Skill bars are a cliché that many hiring managers dislike. The sidebar also has vast empty space below the skills section.

**Missing features:** No profile photo placeholder. No professional summary. No portfolio/awards section. No certifications. No volunteer/interests section.

**If rebuilding:** Add a profile summary paragraph at the top of the main column. Add more experience entries. Add a certifications/awards section. Add a languages or tools section. Fill the sidebar — add a professional headshot circle, a brief "About" paragraph, and social links with icons. Make it look like a complete, ready-to-use resume.

---

### 35. Biology Chapter 12 (id: study-guide-bio) — Score: 3/5 — Verdict: TOUCH UP
Category: Education | Subcategory: Study Guide | Dimensions: 2550×3300

**What works:** Clean academic layout with accent bars on left creating section grouping. Three clear sections (Key Terms, Process Steps, Review Questions) with consistent formatting. Content is detailed, accurate, and educational. The accent bar color-coding creates visual anchoring. Footer bar with class/teacher info is practical.

**What's wrong:** Very text-heavy with no visual relief. The content reaches y≈2660 which is much better than most templates but still leaves some empty space. All three sections use the identical visual treatment (accent bar + label + text). No diagrams or visual aids for a visual topic like cell division.

**Missing features:** No diagram area (cell division is inherently visual!). No vocabulary highlighting/boxing. No "Important" callout boxes. No page number.

**If rebuilding:** Add a diagram placeholder area in the margin (labeled "Mitosis Stages"). Add highlight boxes around key terms. Vary the section treatments slightly. Add a "Key Takeaway" summary box at the end. Add page number and total pages.

---

### 36. Velvet Horizon (id: album-velvet) — Score: 2/5 — Verdict: REBUILD
Category: Creative | Subcategory: Album Cover | Dimensions: 3000×3000

**What works:** Purple-to-sienna gradient is a distinctive color choice that suggests a twilight/horizon. Outline-only title text (stroke: #ffffff, fill: transparent) is a stylish effect. Large concentric circles create some visual interest.

**What's wrong:** At 3000×3000 (vinyl album cover size), the design is extremely sparse. Two circles and three lines of text on a 9-million-pixel canvas. The band name "AURORA SAINTS" in Inter with wide charSpacing is generic. The gradient accent line is the same formula. The concentric circles are at 8-15% opacity — too subtle.

**Missing features:** No album art imagery area. No track listing. No explicit content badge. No label/year info. No barcode.

**If rebuilding:** This needs a strong visual center — an abstract geometric composition, a landscape-inspired scene using shapes, or a bold typographic treatment. Make the concentric circles much more prominent (30-50% opacity) and add radiating lines or geometric patterns. Add a parental advisory badge placeholder. Add year/label info. The current design looks like a placeholder, not album art.

---

### 37. The Last Signal (id: movie-poster-signal) — Score: 3/5 — Verdict: TOUCH UP
Category: Creative | Subcategory: Movie Poster | Dimensions: 2400×3600

**What works:** Classic movie poster layout executed competently. Very large serif title (220px) creates cinematic impact. Italic tagline ("In a world gone silent, one signal remains.") is evocative. Credits block at the bottom follows real movie poster conventions with smaller text. "COMING FALL 2026" release date in accent is industry-standard. The gradient accent line separating the poster from credits is well-placed.

**What's wrong:** The poster is essentially title + tagline + credits on a near-black background — there's no visual content. The full-canvas semi-transparent rect overlay adds an imperceptible tint. The top third and bottom third are empty. For a movie poster, this needs an IMAGE — even an abstract visual representation.

**Missing features:** No key art/image placeholder. No rating badge (PG-13, R). No studio logo. No review quote. No "IMAX" or format badges.

**If rebuilding:** Add an abstract visual element in the upper portion — a glowing signal shape, a silhouette, or a dramatic landscape using shapes. Add rating and studio logo placeholders. Add a review quote. The poster should suggest the movie's world through visual elements, not just text.

---

### 38. FORM Issue 23 (id: magazine-form) — Score: 3/5 — Verdict: TOUCH UP
Category: Creative | Subcategory: Magazine Cover | Dimensions: 2550×3300

**What works:** "FORM" masthead at 200px is impactful and appropriately dominant. Photo placeholder is properly sized for a magazine cover. Feature headlines below the photo follow real magazine conventions. The barcode with gradient fill is a clever realistic detail. Subhead "Interview: Neri Oxman on Material Ecology" uses accent color to create hierarchy. Cover lines are realistic and topical.

**What's wrong:** "PHOTO" text inside the placeholder at 60px is too large and crude. The space between the photo and cover lines is awkward. The issue/date line uses Inter (not in the standard template fonts). The barcode is at the bottom-right — correct placement, but it's just a gradient rect with "BARCODE" text.

**Missing features:** No price/issue number on the cover. No "EXCLUSIVE" or "SPECIAL ISSUE" badge. No secondary image area.

**If rebuilding:** Replace "PHOTO" placeholder text with a gradient fill in the rect. Add a price + country indicator. Add a highlight badge ("EXCLUSIVE INTERVIEW"). Vary the cover line sizes more dramatically. Add a secondary feature image area.

---

### 39. Fragments (id: art-exhibition) — Score: 3/5 — Verdict: TOUCH UP
Category: Creative | Subcategory: Exhibition | Dimensions: 2400×3600

**What works:** Minimal aesthetic is genuinely appropriate for a gallery context. Wide charSpacing (600) on "FRAGMENTS" creates a gallery-worthy typographic treatment. The tall vertical accent bar with gradient (y: 400→2800) is a distinctive departure from the typical horizontal accent line. Complete exhibition information (dates, opening reception, gallery name/city).

**What's wrong:** Almost too minimal — on a 2400×3600 canvas, there are only 7 elements. The left half of the poster is mostly empty. No art preview. The artist's name in italic Georgia (not in the standard font list) is a font consistency issue.

**Missing features:** No artwork preview area. No gallery logo. No artist bio snippet. No ticket/admission info.

**If rebuilding:** Add an abstract art preview area (shapes suggesting the exhibition's theme). Add the gallery logo. Add a brief artist statement. Consider the poster as a piece of art itself — the minimal approach is fine but needs one strong visual element to anchor it.

---

### 40. Kai Nomura (id: photo-portfolio) — Score: 2/5 — Verdict: REBUILD
Category: Creative | Subcategory: Portfolio | Dimensions: 3300×2550

**What works:** 2×3 image grid is a natural portfolio layout. Photographer name in serif with shadow. Portfolio categories listed with dot separators. Website URL in accent color.

**What's wrong:** Six identical-looking gray rectangles with slightly different shades (#e8e5e0, #d5d0c8, #c8c2ba alternating) look like a broken image grid, not a curated portfolio. No image placeholder text or numbering. The photographer info is crammed into a thin strip below the grid. No personality or artistic vision is communicated.

**Missing features:** No project titles on each image area. No description of the photographer's style. No contact info beyond website. No social media links.

**If rebuilding:** Give each image placeholder a gradient fill with different warm tones (like template #51's approach). Add project titles below each image rect. Add a photographer bio section. Consider an asymmetric grid (one large image + several smaller) for visual interest. Add contact info and social links.

---

### 41. Solstice Festival 2026 (id: music-festival) — Score: 3/5 — Verdict: TOUCH UP
Category: Events | Subcategory: Music Festival | Dimensions: 2400×3600

**What works:** Orange gradient background is energetic and distinctive. Three-day lineup format with real artist names (Glass Animals, Tame Impala, Khruangbin, Bonobo, Tycho) creates authenticity. Semi-transparent overlay rect for the lineup area creates readability against the bright background. Website URL at the bottom is practical.

**What's wrong:** Only one decorative circle in the background. The headliner typography doesn't differentiate from supporting acts — all at the same 36px bold. The lower portion of the poster (below the venue info) is empty. "PLUS 30+ MORE ARTISTS" is generic filler.

**Missing features:** No tier system in the lineup (headliners should be MUCH bigger). No ticket price/tier info. No map or directions. No sponsor logos area.

**If rebuilding:** Create a proper lineup hierarchy — headliners at 80px, second tier at 48px, third at 28px. Add day-by-day stage assignments. Add ticket tier information. Add a sponsor logo row. Use shape elements suggesting festival energy (abstract sunbursts, waves).

---

### 42. Morning Ritual Café (id: cafe-menu) — Score: 3/5 — Verdict: TOUCH UP
Category: Food & Lifestyle | Subcategory: Café Menu | Dimensions: 2550×3300

**What works:** Dark background (#2d1810) with warm text (#f5f0e8) creates a cozy coffee shop atmosphere. Three sections (Coffee, Pastries, Brunch) with proper price alignment. Menu content is realistic and appetizing. Decorative coffee cup hint (circle + rect suggesting a cup) is a cute touch. Hours/address footer.

**What's wrong:** The right-side brunch section is inside a very subtle rect (4% opacity fill) — barely visible. Prices are right-aligned using separate textboxes — structurally sound. Content ends around y≈1140 for the main columns, leaving the bottom 65% empty on a 3300px page.

**Missing features:** No café logo area. No "Specials" or "Seasonal" callout. No illustrations or food shapes. No WiFi password note (common in café menus).

**If rebuilding:** Fill more of the page — add Specialties, Drinks, and Sides sections. Add a café logo area at the top. Add a "WiFi: ..." footer. Add decorative food shapes (coffee bean circles, croissant curves). Consider a chalkboard aesthetic variant.

---

### 43. Lemon Herb Chicken (id: recipe-lemon) — Score: 3/5 — Verdict: TOUCH UP
Category: Food & Lifestyle | Subcategory: Recipe Card | Dimensions: 1500×2100

**What works:** Photo area at top is appropriately sized (full-width, 550px tall). Two-column layout (Ingredients | Directions) is the universal recipe card format. Vertical divider between columns is a clean separator. Pairing suggestion in the footer ("Pairs well with roasted vegetables or a simple green salad") is a nice detail. Realistic, usable recipe content with actual cooking temperatures and times.

**What's wrong:** "PHOTO" text in the placeholder at 36px is crude. The photo area uses a flat gray fill. The gradient accent line under the title is only 100px. The footer accent bar is very subtle (8% opacity).

**Missing features:** No prep time / cook time / total time icons. No difficulty rating. No nutritional info area. No serving suggestion note. No "Print" indicator.

**If rebuilding:** Replace the photo placeholder with a gradient fill. Add time/difficulty icons (clock, thermometer shapes). Add a nutritional summary section. Add a "Notes" area at the bottom. Make the photo area more inviting.

---

### 44. The Smoky Paloma (id: cocktail-paloma) — Score: 3/5 — Verdict: TOUCH UP
Category: Food & Lifestyle | Subcategory: Cocktail Card | Dimensions: 1080×1080

**What works:** Dark background with warm sienna accents creates a bar atmosphere. Top gradient bar + glow area is sophisticated. Ingredient list is scannable with clear formatting. The geometric shapes (rect + triangle) abstractly suggest a cocktail glass. Italic garnishing instructions add a personal, bartender-voice touch. The recipe is accurate and detailed.

**What's wrong:** The glass shapes are very abstract — a rect and triangle at low opacity barely register as "glass." The lower-right corner shapes overlap in a way that doesn't clearly communicate anything. The gradient accent line is the same formula.

**Missing features:** No cocktail glass shape (the engine supports paths). No "Difficulty" or "Flavor Profile" indicator. No occasion suggestion. No serving glass recommendation.

**If rebuilding:** Create a recognizable cocktail glass silhouette using path shapes. Add a flavor profile indicator (sweet/sour/bitter/smoky). Add a "Best served in: rocks glass" note with an icon. Use the abstract shapes more intentionally.

---

### 45. 4-Week Strength Program (id: fitness-plan) — Score: 2/5 — Verdict: REBUILD
Category: Food & Lifestyle | Subcategory: Fitness Plan | Dimensions: 2550×3300

**What works:** Progressive overload structure (3×10 → 4×8 → 4×6 → 5×5) is realistic and correct. Alternating background tints for weeks create visual scanning lanes. Notes about rest periods and weight progression at the bottom are practical.

**What's wrong:** This looks like a spreadsheet pasted into a design template. Zero visual elements beyond text blocks and background rects. No icons, no shapes, no illustrations. Each week has identical visual treatment — there's no sense of progression or intensity increase. The layout is purely vertical stacking with no creativity.

**Missing features:** No body diagram or muscle group icons. No progress chart placeholder. No workout icons (dumbbell, barbell shapes). No rest day indicators. No warm-up/cool-down section.

**If rebuilding:** Add exercise icons or body diagrams. Create a visual progression element (growing intensity indicator). Add warm-up and cool-down sections. Use color coding for muscle groups. Add a progress tracking area (checkbox or chart placeholder). Make the weeks feel different as intensity increases — maybe background colors darken progressively.

---

### 46. Breathe In Calm (id: wellness-quote) — Score: 2/5 — Verdict: REBUILD
Category: Food & Lifestyle | Subcategory: Wellness | Dimensions: 1080×1080

**What works:** Soft gradient (cream to sage green) creates a calm mood. Italic serif text is appropriate for wellness/mindfulness content.

**What's wrong:** This is essentially a copy of template #2 (ig-quote-believe) with a different gradient. Same structure: large quote in center, gradient line, attribution. The three decorative circles add nothing distinctive. Empty stroke properties (`stroke: '', strokeWidth: 0`) are code smell — unnecessary properties.

**Missing features:** No nature-inspired shapes (leaf, wave, sun). No breathing exercise visual (circle expanding/contracting concept). No decorative borders or patterns.

**If rebuilding:** Create a distinctive wellness aesthetic — maybe concentric circles suggesting a breathing exercise, or organic leaf/petal shapes. Use the sage green more prominently. Add a meditation-themed visual element. Differentiate it completely from the Instagram quote template.

---

### 47. You Have My Heart (id: valentines-heart) — Score: 2/5 — Verdict: REBUILD
Category: Seasonal | Subcategory: Valentine | Dimensions: 1080×1080

**What works:** Pink gradient background (rose to pink) is on-theme. Bold serif text with shadow.

**What's wrong:** THE VALENTINE TEMPLATE HAS NO HEART SHAPES. The engine supports heart shapes via `createPathShape()`, yet this template uses only circles to vaguely suggest... hearts? They don't. They're just scattered pink circles of various sizes. The title says "You Have My Heart" while the design shows circles. Uses Georgia font (not in the standard font list). The gradient accent line is the same formula. Empty `stroke: '', strokeWidth: 0` properties are unnecessary.

**Missing features:** HEART SHAPES (the most obvious missing element in the entire registry). No roses or floral shapes. No cupid/arrow shapes. No envelope/letter shapes.

**If rebuilding:** Add actual heart shapes using the engine's heart path. Use hearts as the primary decorative motif — scattered hearts of various sizes, a large centered heart, hearts forming a pattern. Add rose-related shapes. Use a romantic script font for the heading. Make this unmistakably a Valentine's card.

---

### 48. Enter If You Dare (id: halloween-dare) — Score: 3/5 — Verdict: TOUCH UP
Category: Seasonal | Subcategory: Halloween | Dimensions: 1080×1350

**What works:** Ghost text effect (outline-only text layer offset by 4px behind the filled text) is technically sophisticated and creates a spooky vibration. Gradient circle glow suggests moonlight. Triangles used as scattered decorative elements (suggesting candy corn or bats). Dark background is on-theme. Complete event details (date, location, time, dress code).

**What's wrong:** The triangles are too small and subtle (12-18px width at 25-40% opacity) to clearly represent anything Halloween-related. Still using the formulaic gradient accent line. Uses Inter (not standard) for the event details.

**Missing features:** No pumpkin shapes. No bat shapes. No spider web patterns. No moon shape (circle with a crescent cut). No tombstone shapes.

**If rebuilding:** Add iconic Halloween shapes — pumpkins (circles with triangle eyes), bats (path shapes), a crescent moon, spider webs (line patterns). Use orange and purple as accent colors. Make the triangles more prominent if they're meant to be candy corn. Add cobweb patterns in corners.

---

### 49. Warmest Wishes (id: holiday-wishes) — Score: 2/5 — Verdict: REBUILD
Category: Seasonal | Subcategory: Holiday Card | Dimensions: 1500×2100

**What works:** Deep green background (#1a3320) is festive. Bold serif title in sienna with shadow creates warmth.

**What's wrong:** The "snow" is 7 tiny circles (radius 4-10px) on a 1500×2100 canvas — they're completely invisible. Uses Georgia font for the message body (not in the standard font list). The gradient accent line is the same formula. The overall feel is dark and somber for a holiday greeting card — it should feel warm, joyful, and celebratory.

**Missing features:** No snowflake shapes (hexagons, stars). No tree shape (triangle). No ornament shapes (circles with a small rect on top). No gift/present shapes. No string lights pattern.

**If rebuilding:** Add snowflake shapes using hexagons and stars. Add a simple tree silhouette (triangle shapes). Add ornament shapes (circles with small hooks). Use red and gold accents alongside the green. Add string lights (a line with small circles). Make the snow much more prominent — dozens of white circles at varying sizes and opacities. Make this feel like a warm, joyful holiday card.

---

### 50. Here's to 2026 (id: new-year-2026) — Score: 2/5 — Verdict: REBUILD
Category: Seasonal | Subcategory: New Year | Dimensions: 1080×1080

**What works:** Large "2026" at 200px is immediately impactful. Dark gradient background creates a midnight atmosphere.

**What's wrong:** This is a template mashup of every other dark-background design in the registry — dark bg, scattered accent dots, gradient accent line, charSpacing heading, italic Georgia subtitle. The "sparkles" (circles at radius 3-8px) are too small to register. Uses Georgia font (not standard). The vibe is more "somber reflection" than "New Year celebration."

**Missing features:** No firework shapes (starburst patterns). No champagne glass shapes. No confetti shapes. No clock/countdown visual. No party popper shapes.

**If rebuilding:** Add firework burst patterns (radiating lines from center points). Add champagne glass silhouettes. Add confetti shapes (small rotated rects, triangles, circles in gold and silver). Add a clock face or countdown element. Use gold and silver as accent colors. This should feel like the clock just struck midnight — energy, sparkle, celebration.

---

### 51. Aura Studio — Brand Launch (id: product-launch-showcase) — Score: 5/5 — Verdict: SHIP
Category: Marketing | Subcategory: Product Launch | Dimensions: 1080×1080

**What works:** EVERYTHING. This is the only template that looks like a human designer made it.
- **Asymmetric layout** with intentional negative space — left column (text) vs right column (image + accent block)
- **Service tag pills** with stroked borders and tiny uppercase text — a real UI detail
- **Photo placeholder with gradient fill** and shadow — looks intentional, not broken
- **Dark accent block overlapping the photo** — creates depth and visual tension
- **Quote inside the accent block** — editorial touch with italic serif
- **Corner marks** (two tiny perpendicular lines in the top-right) — a printing/design convention
- **Vertical accent line** fading downward — a margin detail that shows craft
- **Oversized "2026" as background texture** at 4% opacity — creates depth without competing
- **Fraunces display font** used correctly (headline only, not body)
- **Three distinct gradient techniques** — top bar (3-stop), photo placeholder (diagonal), accent block (dark-to-darker)
- **Bottom bar** with website, locations, and CTA — complete and proportional
- The palette is restrained (cream, warm dark, sienna accent) but every element is distinct
- 32 objects, each with a clear purpose — nothing is filler

**What's wrong:** Nothing significant. Minor nitpick: the service tag text at 9px might be too small to read, but that's a deliberate design choice.

**Missing features:** None for this format.

**If rebuilding:** Don't. Use this as the gold standard for every other template rebuild.

---

## Summary

- **SHIP (no changes needed):** 1 template
- **TOUCH UP (minor to moderate improvements):** 22 templates
- **REBUILD (wholesale redesign needed):** 28 templates

### Score Distribution

| Score | Count | Templates |
|-------|-------|-----------|
| 5/5 | 1 | product-launch-showcase |
| 4/5 | 0 | — |
| 3/5 | 22 | ig-quote-believe, ig-story-sale, li-carousel-cover, tiktok-cover-watch, certificate-excellence, meeting-notes, product-launch, menu-golden-fork, testimonial-card, wedding-emma-james, concert-midnight, workshop-watercolor, book-cover-quiet, flashcard-photo, resume-alex, study-guide-bio, movie-poster-signal, magazine-form, art-exhibition, music-festival, cafe-menu, recipe-lemon, cocktail-paloma, halloween-dare |
| 2/5 | 28 | podcast-cover, yt-thumb-mistakes, tw-banner-studio, pin-home-office, fb-event-jazz, discord-banner, biz-card-elena, invoice-studio, one-pager-apex, email-sig-david, proposal-cover, name-badge, real-estate, coupon-twenty, newsletter-header, app-promo-taskflow, birthday-mia, conf-badge, gala-evening, album-velvet, photo-portfolio, fitness-plan, wellness-quote, valentines-heart, holiday-wishes, new-year-2026 |
| 1/5 | 0 | — |

### Rebuild Priority (most embarrassing first)

1. **valentines-heart** — A Valentine template with no heart shapes. The engine literally has a heart shape builder. Unforgivable.
2. **birthday-mia** — A kids' birthday invite that looks like a corporate event. No stars, no balloons, no fun shapes.
3. **holiday-wishes** — Invisible "snow" (4px circles) and a somber mood for a joyful holiday card.
4. **new-year-2026** — No fireworks, no champagne, no confetti. Just dark bg + text. Again.
5. **fitness-plan** — Looks like a spreadsheet. No icons, no body diagrams, no visual energy.
6. **app-promo-taskflow** — Off-brand purple gradient, crude device frame (two rectangles), no store badges.
7. **wellness-quote** — Copy of ig-quote-believe with a different gradient. No distinct identity.
8. **invoice-studio** — Space-aligned columns in proportional font. Only fills 35% of the page.
9. **one-pager-apex** — Only fills top 30% of a full page. Not a one-pager, it's a one-third-pager.
10. **album-velvet** — 3 elements on a 3000×3000 canvas. Feels like a placeholder, not album art.
11. **yt-thumb-mistakes** — Too quiet for YouTube. No face, no urgency, no energy.
12. **gala-evening** — Same dark-template formula, no sense of luxury or charity.
13. **fb-event-jazz** — Nothing says "jazz." Right half is empty.
14. **discord-banner** — No gaming/tech energy, corporate feel.
15. **photo-portfolio** — Six identical gray rectangles.
16. **tw-banner-studio** — 60% empty white space.
17. **biz-card-elena** — No logo, no personality, too sparse.
18. **real-estate** — Flat, generic, looks like a basic MLS listing from 2010.
19. **coupon-twenty** — No visual urgency. A coupon should excite people.
20. **newsletter-header** — Too simple, no brand identity.
21. **email-sig-david** — Too tiny to evaluate, but basic.
22. **proposal-cover** — 5 elements on a full page. Empty.
23. **name-badge** — Generic conference badge.
24. **conf-badge** — Also generic conference badge. Two generic badges in the registry.
25. **pin-home-office** — "YOUR PHOTO" text placeholder looks broken.
26. **podcast-cover** — Lollipop microphone, formulaic layout.

### Most Common Issues Across All Templates

1. **THE FORMULA** — 50 of 51 templates use the identical recipe: gradient accent line (C4704A→e8956d) + shadow on heading ({blur: 12|16, offsetY: 4}) + charSpacing + decorative low-opacity circles. This is the single biggest problem. Every template feels AI-generated from the same prompt.

2. **Zero shape variety** — Despite the engine supporting hearts, stars, diamonds, pentagons, hexagons, arrows, rounded-rects, and speech bubbles, the templates exclusively use: circles, rectangles, triangles (rarely). The Valentine has no hearts. The birthday has no stars. The holiday card has no snowflakes.

3. **Incomplete pages** — 15+ templates only fill 30-40% of their canvas, with the rest being empty space. The invoice, one-pager, meeting notes, resume, study guide, and menus all have massive blank areas. Users will see this immediately and think the template is broken.

4. **"YOUR PHOTO" placeholder text** — Multiple templates show literal "YOUR PHOTO," "PHOTO," or "PROPERTY PHOTO" text in placeholder areas. This makes them look broken/unfinished. Template #51 shows the right approach: gradient-filled rects that look intentional.

5. **Monochromatic palette** — Almost every template uses only #C4704A (sienna) as its accent color, paired with either white or black. There's no variety — no blues, no greens, no purples, no warm reds. The seasonal templates especially suffer (Valentine should be pink/red, Halloween should be orange/purple, Christmas should be red/green/gold).

6. **Font consistency** — Several templates use Georgia or Inter, which are not in the project's standard font list (DM Sans, Montserrat, Playfair Display, Fraunces). This creates inconsistency and may cause rendering issues.

7. **No gradients on text** — Despite the engine supporting gradient fills on any object, zero templates use gradient text. This is a missed opportunity for hero text.

8. **Identical shadow parameters** — Every shadow is either `{blur: 12, offsetY: 4}` (light bg) or `{blur: 16, offsetY: 4}` (dark bg) with either 8% or 50% opacity black. There's no variation in shadow direction, spread, or color.

9. **No use of `angle` property on shapes** — Only 3 templates use rotation on decorative elements. Rotated shapes create dynamism and visual interest that every other template lacks.

10. **Template #51 gap** — The quality gap between template #51 (product-launch-showcase, score 5) and every other template (max score 3) is enormous. Template #51 has 32 purposeful objects with diverse techniques. The average template has 8-12 objects following the same formula. This tells us the templates CAN be great — they just weren't given the same care.

### Template Count Discrepancy

The file header states "53 built-in templates" but the `TEMPLATE_REGISTRY` array contains exactly 51 entries. Two templates are missing or were never created.

### Recommendation

**Do not ship these templates as-is.** A Canva user switching to Monet would see template #51 and be impressed, then open any other template and think the product is broken or auto-generated. The gap destroys trust.

**Priority approach:**
1. Rebuild the 10 most embarrassing templates first (top of the rebuild priority list)
2. Use template #51's patterns as the quality bar: asymmetric layouts, gradient-filled placeholders, diverse gradient techniques, service/tag pills, overlapping depth, corner details, editorial touches
3. Fix the systemic formula problem — vary shadow angles, use different decorative shapes per category, introduce category-appropriate color palettes
4. Add the missing shape types to seasonal and event templates — hearts for Valentine, stars for birthday, snowflakes for holiday, fireworks for New Year
5. Fill incomplete pages — no template should leave more than 20% of its canvas empty
