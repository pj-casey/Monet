/**
 * CanvasHints — dismissible banner shown at the top of an empty canvas.
 *
 * When the editor has no objects, a subtle bar appears at the top with
 * quick-start actions. Users can dismiss it with the × button, and it
 * also disappears automatically when objects are added.
 */

import { useState } from 'react';

interface CanvasHintsProps {
  hasObjects: boolean;
  onGenerateAI: () => void;
  onBrowseTemplates: () => void;
}

export function CanvasHints({ hasObjects, onGenerateAI, onBrowseTemplates }: CanvasHintsProps) {
  const [dismissed, setDismissed] = useState(false);

  if (hasObjects || dismissed) return null;

  return (
    <div className="absolute left-0 right-0 top-0 z-10 animate-fade-in">
      <div className="flex items-center justify-center gap-3 border-b border-border bg-surface/95 px-4 py-2.5 backdrop-blur-sm">
        <span className="text-xs text-text-tertiary">Your canvas is empty —</span>
        <button type="button" onClick={onGenerateAI}
          className="flex items-center gap-1.5 rounded-sm bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover">
          <SparkleIcon />
          Generate with AI
        </button>
        <button type="button" onClick={onBrowseTemplates}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-wash">
          <TemplateIcon />
          Browse templates
        </button>
        <button type="button" onClick={() => setDismissed(true)}
          className="ml-2 flex h-5 w-5 items-center justify-center rounded-sm text-text-tertiary hover:bg-wash hover:text-text-secondary"
          aria-label="Dismiss">
          &times;
        </button>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 2l1.5 4.5L15 8l-4.5 1.5L9 14l-1.5-4.5L3 8l4.5-1.5z" />
    </svg>
  );
}

function TemplateIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
      <rect x="1" y="9" width="6" height="6" rx="1"/><path d="M12 10v4M10 12h4"/>
    </svg>
  );
}
