/**
 * ContextualAI — floating AI action buttons near selected canvas objects.
 *
 * When an object is selected and an API key is configured, small circular
 * ✨ buttons appear near the selection bounding box:
 * - Text objects: Rewrite, Shorter, Longer, More formal, More casual
 * - All objects: "Make it pop" — Claude suggests styling improvements
 *
 * Buttons appear after 1s delay on selection or on hover.
 * Hidden during drag/resize operations.
 * All actions support undo (Ctrl+Z).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { engine, onSelectionChange } from './Canvas';
import { isAIConfigured, callClaudeStream } from '../lib/ai-assistant';
import type { SelectedObjectProps } from '@monet/shared';

// ─── Text rewrite options ───────────────────────────────────────────

const TEXT_ACTIONS = [
  { label: 'Rewrite', instruction: 'Rewrite this text with different wording but keep the same meaning and approximate length.' },
  { label: 'Shorter', instruction: 'Make this text more concise — significantly shorter while preserving the core message.' },
  { label: 'Longer', instruction: 'Expand this text — add more detail while keeping the same tone.' },
  { label: 'More formal', instruction: 'Rewrite this text in a more formal, professional tone.' },
  { label: 'More casual', instruction: 'Rewrite this text in a more casual, friendly tone.' },
];

const TEXT_REWRITE_SYSTEM = `You are a copywriter. Rewrite the given text following the instruction.
Output ONLY the rewritten text. No quotes, no explanation, no preamble.
Keep similar length unless told otherwise. Preserve line breaks.`;

const MAKE_IT_POP_SYSTEM = `You are a graphic designer. Given a design object's properties and the overall design context, suggest ONE specific styling improvement to make it "pop" (stand out better).

Respond with ONLY a JSON object of properties to change. Example responses:
- For text: {"shadow":{"color":"rgba(0,0,0,0.3)","blur":12,"offsetX":0,"offsetY":4},"charSpacing":150}
- For shapes: {"shadow":{"color":"rgba(0,0,0,0.2)","blur":16,"offsetX":0,"offsetY":6},"opacity":1}

Only include properties that should change. Use the design token format. Output ONLY JSON.`;

export function ContextualAI() {
  const [selection, setSelection] = useState<SelectedObjectProps | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasKey = isAIConfigured();

  // Track selection changes
  useEffect(() => {
    return onSelectionChange((props) => {
      setSelection(props);
      setMenuOpen(false);
      setShowButtons(false);

      if (props && hasKey) {
        // Show buttons after 1s delay
        if (delayRef.current) clearTimeout(delayRef.current);
        delayRef.current = setTimeout(() => setShowButtons(true), 1000);
      }
    });
  }, [hasKey]);

  // Track drag/resize to hide buttons
  useEffect(() => {
    const canvas = engine.getFabricCanvas();
    if (!canvas) return;

    const onDragStart = () => setIsDragging(true);
    const onDragEnd = () => {
      setIsDragging(false);
      updatePosition();
    };

    canvas.on('object:moving', onDragStart);
    canvas.on('object:scaling', onDragStart);
    canvas.on('object:rotating', onDragStart);
    canvas.on('object:modified', onDragEnd);

    return () => {
      canvas.off('object:moving', onDragStart);
      canvas.off('object:scaling', onDragStart);
      canvas.off('object:rotating', onDragStart);
      canvas.off('object:modified', onDragEnd);
    };
  }, []);

  // Calculate position relative to viewport
  const updatePosition = useCallback(() => {
    const canvas = engine.getFabricCanvas();
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    const bound = active.getBoundingRect();
    const canvasEl = canvas.getElement();
    const canvasRect = canvasEl.getBoundingClientRect();

    // Position above the object, centered horizontally
    const x = canvasRect.left + (bound.left + bound.width / 2);
    const y = canvasRect.top + bound.top - 12;

    setPosition({ x, y });
  }, []);

  // Update position when showing buttons
  useEffect(() => {
    if (showButtons && selection) {
      updatePosition();
    }
  }, [showButtons, selection, updatePosition]);

  // Handle text rewrite
  const handleTextRewrite = useCallback(async (instruction: string) => {
    if (!selection?.text || processing) return;

    setProcessing(true);
    setMenuOpen(false);

    try {
      engine.saveHistoryCheckpoint();
      const result = await callClaudeStream(
        TEXT_REWRITE_SYSTEM,
        [{ role: 'user', content: `Instruction: ${instruction}\n\nText to rewrite:\n${selection.text}` }],
        1024,
      );

      const newText = result.text.trim();
      if (newText) {
        engine.updateSelectedTextProps({ text: newText });
      }
    } catch {
      // Silently fail — user can undo if needed
    } finally {
      setProcessing(false);
    }
  }, [selection, processing]);

  // Handle "make it pop"
  const handleMakeItPop = useCallback(async () => {
    if (!selection || processing) return;

    setProcessing(true);

    try {
      const doc = engine.toJSON();
      const context = `Design: ${doc.dimensions.width}x${doc.dimensions.height}, background: ${JSON.stringify(doc.background)}`;
      const objectInfo = `Selected object: ${JSON.stringify(selection)}`;

      engine.saveHistoryCheckpoint();
      const result = await callClaudeStream(
        MAKE_IT_POP_SYSTEM,
        [{ role: 'user', content: `${context}\n\n${objectInfo}\n\nSuggest ONE styling improvement.` }],
        512,
      );

      let cleaned = result.text.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      try {
        const updates = JSON.parse(cleaned);
        engine.updateSelectedObject(updates);
      } catch {
        // Could not parse — ignore
      }
    } catch {
      // Silently fail
    } finally {
      setProcessing(false);
    }
  }, [selection, processing]);

  // Don't render if no key, no selection, hidden, or dragging
  if (!hasKey || !selection || !showButtons || isDragging || !position) {
    return null;
  }

  const isText = selection.objectType === 'textbox';

  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{ left: position.x, top: position.y, transform: 'translate(-50%, -100%)' }}
    >
      <div className="pointer-events-auto flex items-center gap-1">
        {/* Sparkle button — opens menu for text, does "pop" for others */}
        {isText ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              disabled={processing}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-overlay shadow-md transition-transform hover:scale-110 disabled:opacity-50"
              title="AI text actions"
            >
              {processing ? (
                <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-accent border-t-transparent" />
              ) : (
                <SparkleSmall />
              )}
            </button>

            {/* Text actions dropdown */}
            {menuOpen && !processing && (
              <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded-md bg-overlay py-1 shadow-lg"
                style={{ minWidth: '130px' }}>
                {TEXT_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleTextRewrite(action.instruction)}
                    className="block w-full px-3 py-1.5 text-left text-[11px] text-text-primary hover:bg-accent-subtle"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleMakeItPop}
            disabled={processing}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-overlay shadow-md transition-transform hover:scale-110 disabled:opacity-50"
            title="Make it pop"
          >
            {processing ? (
              <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-accent border-t-transparent" />
            ) : (
              <SparkleSmall />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SparkleSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
      <path d="M9 2l1.5 4.5L15 8l-4.5 1.5L9 14l-1.5-4.5L3 8l4.5-1.5z" />
    </svg>
  );
}
