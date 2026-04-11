/**
 * TabSuggest — AI copy suggestions when editing empty text objects.
 *
 * When a user creates or edits an empty text object:
 * - Shows placeholder hint: "Type or press Tab for AI suggestions"
 * - Tab (with API key): fetches 3 suggestions from Claude, shows floating menu
 * - Click suggestion to insert, Escape to dismiss
 * - Without API key: Tab does nothing, placeholder says "Type to add text"
 *
 * Listens for Fabric.js text editing events via the canvas engine.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { engine } from './Canvas';
import { isAIConfigured, callClaudeStream } from '../lib/ai-assistant';

const SUGGEST_SYSTEM = `You are a copywriter generating text for graphic designs.

Given a design context (dimensions, existing text, format guess), suggest exactly 3 SHORT text options for a new text element.

Output ONLY a JSON array of 3 strings. No explanation.
Example: ["Summer Sale — 40% Off", "New Collection Available", "Shop Now & Save Big"]

Guidelines:
- Keep each under 50 characters
- Match the design's apparent purpose and tone
- Use real content, never "Lorem Ipsum" or placeholder text
- Vary the options: one punchy, one descriptive, one action-oriented`;

interface SuggestState {
  visible: boolean;
  position: { x: number; y: number };
  suggestions: string[];
  loading: boolean;
}

export function TabSuggest() {
  const [state, setState] = useState<SuggestState>({
    visible: false,
    position: { x: 0, y: 0 },
    suggestions: [],
    loading: false,
  });
  const hasKey = isAIConfigured();
  const activeRef = useRef(false);

  // Listen for Tab key during text editing
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !hasKey) return;

      const canvas = engine.getFabricCanvas();
      if (!canvas) return;

      const active = canvas.getActiveObject();
      if (!active || (active as any).type !== 'textbox') return;
      if (!(active as any).isEditing) return;

      // Only suggest on empty or near-empty text
      const text = ((active as any).text || '').trim();
      if (text.length > 5) return;

      e.preventDefault();
      e.stopPropagation();

      // Calculate position below the text object
      const bound = active.getBoundingRect();
      const canvasEl = canvas.getElement();
      const canvasRect = canvasEl.getBoundingClientRect();

      const pos = {
        x: canvasRect.left + bound.left + bound.width / 2,
        y: canvasRect.top + bound.top + bound.height + 8,
      };

      fetchSuggestions(pos);
    };

    document.addEventListener('keydown', handler, { capture: true });
    return () => document.removeEventListener('keydown', handler, { capture: true });
  }, [hasKey]);

  // Dismiss on Escape or click outside
  useEffect(() => {
    if (!state.visible) return;

    const dismiss = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setState((s) => ({ ...s, visible: false }));
      }
    };
    const clickOutside = () => {
      setState((s) => ({ ...s, visible: false }));
    };

    document.addEventListener('keydown', dismiss);
    // Delay to avoid immediate dismissal from the Tab event
    const timer = setTimeout(() => document.addEventListener('click', clickOutside), 100);

    return () => {
      document.removeEventListener('keydown', dismiss);
      clearTimeout(timer);
      document.removeEventListener('click', clickOutside);
    };
  }, [state.visible]);

  const fetchSuggestions = useCallback(async (position: { x: number; y: number }) => {
    if (activeRef.current) return;
    activeRef.current = true;

    setState({ visible: true, position, suggestions: [], loading: true });

    try {
      const doc = engine.toJSON();
      const allText = doc.objects
        .filter((o: any) => o.type === 'textbox' && o.text?.trim())
        .map((o: any) => o.text)
        .slice(0, 5);

      const formatGuess =
        doc.dimensions.width === doc.dimensions.height ? 'social media post' :
        doc.dimensions.width > doc.dimensions.height ? 'landscape/banner' :
        'portrait/story';

      const context = `Design: ${doc.dimensions.width}x${doc.dimensions.height} (${formatGuess})
Background: ${JSON.stringify(doc.background)}
Existing text: ${allText.map((t: string) => `"${t}"`).join(', ') || 'none yet'}`;

      const result = await callClaudeStream(
        SUGGEST_SYSTEM,
        [{ role: 'user', content: `${context}\n\nSuggest 3 text options for a new text element in this design.` }],
        256,
      );

      let cleaned = result.text.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      const arr = JSON.parse(cleaned);
      if (Array.isArray(arr)) {
        setState((s) => ({ ...s, suggestions: arr.slice(0, 3).map(String), loading: false }));
      } else {
        setState((s) => ({ ...s, visible: false }));
      }
    } catch {
      setState((s) => ({ ...s, visible: false }));
    } finally {
      activeRef.current = false;
    }
  }, []);

  const handleSelect = useCallback((text: string) => {
    engine.updateSelectedTextProps({ text });
    setState((s) => ({ ...s, visible: false }));
  }, []);

  if (!state.visible) return null;

  return (
    <div
      className="fixed z-50"
      style={{ left: state.position.x, top: state.position.y, transform: 'translateX(-50%)' }}
    >
      <div className="animate-scale-up rounded-lg bg-overlay py-1 shadow-lg" style={{ minWidth: '220px' }}>
        {state.loading ? (
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-text-secondary">
            <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-accent border-t-transparent" />
            Getting suggestions...
          </div>
        ) : (
          state.suggestions.map((text, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSelect(text); }}
              className="block w-full px-3 py-2 text-left text-xs text-text-primary hover:bg-accent-subtle"
            >
              {text}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
