/**
 * TemplatePreviews — renders 6 curated template thumbnails.
 *
 * This component is in its own file so it can be lazy-loaded from
 * the landing page. It imports @monet/canvas-engine (Fabric.js) and
 * @monet/templates, which are ~1MB together — too heavy for the
 * initial landing page bundle.
 */

import { useState, useEffect } from 'react';
import { TEMPLATE_REGISTRY } from '@monet/templates';
import { renderTemplateThumbnail } from '@monet/canvas-engine';

/**
 * Hand-picked template IDs for the landing page showcase grid.
 * Chosen for visual variety: dark/light contrast, diverse categories,
 * and distinct aesthetics. Ordered for a pleasing 3x2 grid:
 *   Row 1: dark podcast | light wedding | dark concert
 *   Row 2: warm gala    | fun halloween | dark product
 */
const SHOWCASE_IDS = [
  'podcast-cover',
  'wedding-emma-james',
  'concert-midnight',
  'gala-evening',
  'halloween-dare',
  'product-launch',
];

const _idLookup = new Map(TEMPLATE_REGISTRY.map((t) => [t.templateId, t]));
const PREVIEW_TEMPLATES = SHOWCASE_IDS.map((id) => _idLookup.get(id)).filter(Boolean) as typeof TEMPLATE_REGISTRY;

const _lpThumbCache = new Map<string, string>();

export default function TemplatePreviews() {
  const [thumbs, setThumbs] = useState<Map<string, string>>(_lpThumbCache);

  useEffect(() => {
    if (_lpThumbCache.size >= PREVIEW_TEMPLATES.length) return;
    let cancelled = false;
    (async () => {
      for (const t of PREVIEW_TEMPLATES) {
        if (_lpThumbCache.has(t.templateId) || cancelled) continue;
        try {
          const url = await renderTemplateThumbnail(t.document, 300);
          if (url && !cancelled) {
            _lpThumbCache.set(t.templateId, url);
            setThumbs(new Map(_lpThumbCache));
          }
        } catch { /* skip failed renders */ }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="rounded-lg border border-border bg-elevated p-3 shadow-sm">
      <div className="grid grid-cols-3 gap-2">
        {PREVIEW_TEMPLATES.map((t) => {
          const thumb = thumbs.get(t.templateId);
          const bg = t.document.background;
          const fallback = bg.type === 'solid' ? bg.value : '#e5ddd5';
          return (
            <div key={t.templateId} className="aspect-square overflow-hidden rounded" style={{ backgroundColor: fallback }}>
              {thumb ? (
                <img src={thumb} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="h-full w-full animate-pulse" style={{ backgroundColor: fallback }} />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-text-tertiary">
        50+ templates across 8 categories
      </p>
    </div>
  );
}
