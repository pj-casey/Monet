/**
 * PenToolPopout — pen tool controls that appear below
 * the Pen button in the toolbar when the Pen tool is active.
 *
 * Contains: Edit Points button, brief instructions, stroke controls.
 * Stays open as long as Pen tool is active.
 */

import { useEffect } from 'react';
import { engine } from './Canvas';

export function PenToolPopout() {
  // Initialize pen tool on mount, clean up on unmount
  useEffect(() => {
    engine.enablePenTool();
    return () => {
      engine.disablePenTool();
      if (engine.isEditPointsActive()) engine.exitEditPoints();
    };
  }, []);

  return (
    <div className="animate-scale-up absolute left-1/2 top-full z-40 mt-1.5 w-[240px] -translate-x-1/2 rounded-lg border border-border bg-elevated p-3 shadow-lg">

      {/* Instructions */}
      <p className="mb-2 text-[10px] leading-relaxed text-text-secondary">
        Click to add points. Click near start to close path. Double-click or Enter to finish.
      </p>

      {/* Edit Points button */}
      <button
        type="button"
        onClick={() => {
          if (engine.isEditPointsActive()) {
            engine.exitEditPoints();
          } else {
            engine.enterEditPoints();
          }
        }}
        className="w-full rounded-md bg-wash px-3 py-1.5 text-[10px] font-medium text-text-secondary hover:bg-border"
      >
        {engine.isEditPointsActive?.() ? 'Done Editing' : 'Edit Points'}
      </button>
    </div>
  );
}
