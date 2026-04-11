/**
 * LayerPanel — shows all objects on the canvas as a list of "layers".
 *
 * Each layer row shows:
 * - A friendly name (e.g., "Rectangle", "Hello world…")
 * - A visibility toggle (eye icon) — hide/show the object
 * - A lock toggle (padlock icon) — prevent moving/editing
 * - Click to select the object on the canvas
 *
 * Layers are ordered top-to-bottom = front-to-back (the topmost layer
 * in the list is drawn in front of everything else).
 *
 * Drag-to-reorder uses a simple swap approach: click the up/down arrows
 * to move a layer forward or backward. (Full drag-and-drop reordering
 * would require a drag library, deferred to keep dependencies minimal.)
 */

import { useCallback } from 'react';
import type { LayerInfo } from '@monet/shared';
import { engine } from './Canvas';

interface LayerPanelProps {
  /** The current list of layers (front-to-back order) */
  layers: LayerInfo[];
  /** Index of the currently selected object in the Fabric.js array, or -1 */
  selectedIndex: number;
}

export function LayerPanel({ layers, selectedIndex }: LayerPanelProps) {
  return (
    <div className="flex flex-col bg-surface">
      {/* Header with group/ungroup buttons */}
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Layers
        </span>
        <div className="flex gap-1">
          <SmallButton label="Group (Ctrl+G)" onClick={() => engine.groupSelected()}>
            <GroupIcon />
          </SmallButton>
          <SmallButton label="Ungroup (Ctrl+Shift+G)" onClick={() => engine.ungroupSelected()}>
            <UngroupIcon />
          </SmallButton>
        </div>
      </div>

      {/* Auto-layout: align + distribute */}
      <div className="flex items-center justify-between border-b border-border px-3 py-1">
        <div className="flex gap-0.5" title="Align selected objects">
          <SmallButton label="Align left" onClick={() => engine.alignSelected('left')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 1v10"/><rect x="3" y="2" width="7" height="3" rx="0.5"/><rect x="3" y="7" width="5" height="3" rx="0.5"/></svg>
          </SmallButton>
          <SmallButton label="Align center horizontally" onClick={() => engine.alignSelected('center-h')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 1v10"/><rect x="2" y="2" width="8" height="3" rx="0.5"/><rect x="3" y="7" width="6" height="3" rx="0.5"/></svg>
          </SmallButton>
          <SmallButton label="Align right" onClick={() => engine.alignSelected('right')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M11 1v10"/><rect x="2" y="2" width="7" height="3" rx="0.5"/><rect x="4" y="7" width="5" height="3" rx="0.5"/></svg>
          </SmallButton>
          <SmallButton label="Align top" onClick={() => engine.alignSelected('top')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 1h10"/><rect x="2" y="3" width="3" height="7" rx="0.5"/><rect x="7" y="3" width="3" height="5" rx="0.5"/></svg>
          </SmallButton>
          <SmallButton label="Align center vertically" onClick={() => engine.alignSelected('center-v')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 6h10"/><rect x="2" y="1" width="3" height="10" rx="0.5"/><rect x="7" y="2" width="3" height="8" rx="0.5"/></svg>
          </SmallButton>
          <SmallButton label="Align bottom" onClick={() => engine.alignSelected('bottom')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 11h10"/><rect x="2" y="2" width="3" height="7" rx="0.5"/><rect x="7" y="4" width="3" height="5" rx="0.5"/></svg>
          </SmallButton>
        </div>
        <div className="flex gap-0.5" title="Distribute spacing">
          <SmallButton label="Distribute horizontally" onClick={() => engine.distributeSelected('horizontal')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="3" width="2" height="6" rx="0.5"/><rect x="5" y="3" width="2" height="6" rx="0.5"/><rect x="9" y="3" width="2" height="6" rx="0.5"/></svg>
          </SmallButton>
          <SmallButton label="Distribute vertically" onClick={() => engine.distributeSelected('vertical')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="1" width="6" height="2" rx="0.5"/><rect x="3" y="5" width="6" height="2" rx="0.5"/><rect x="3" y="9" width="6" height="2" rx="0.5"/></svg>
          </SmallButton>
        </div>
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto">
        {layers.length === 0 && (
          <div className="flex flex-col items-center px-4 py-8 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-wash">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-text-tertiary">
                <rect x="2" y="2" width="12" height="4" rx="1"/><rect x="2" y="8" width="12" height="4" rx="1" opacity="0.5"/>
              </svg>
            </div>
            <p className="text-xs font-medium text-text-secondary">No layers yet</p>
            <p className="mt-0.5 text-[10px] text-text-tertiary">Add shapes, text, or images to get started.</p>
          </div>
        )}
        {layers.map((layer) => (
          <LayerRow
            key={layer.index}
            layer={layer}
            isSelected={layer.index === selectedIndex}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Layer row ─────────────────────────────────────────────────────

function LayerRow({ layer, isSelected }: { layer: LayerInfo; isSelected: boolean }) {
  const handleSelect = useCallback(() => {
    engine.selectLayerByIndex(layer.index);
  }, [layer.index]);

  const handleToggleLock = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    engine.toggleLayerLock(layer.index);
  }, [layer.index]);

  const handleToggleVisibility = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    engine.toggleLayerVisibility(layer.index);
  }, [layer.index]);

  const handleMoveUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // "Up" in the panel = higher z-index = move forward in Fabric.js
    const objects = engine.getFabricCanvas()?.getObjects();
    if (!objects) return;
    const nextIdx = Math.min(layer.index + 1, objects.length - 1);
    if (nextIdx !== layer.index) engine.reorderLayer(layer.index, nextIdx);
  }, [layer.index]);

  const handleMoveDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // "Down" in the panel = lower z-index = move backward in Fabric.js
    // Don't go below index 1 (index 0 is the artboard)
    const nextIdx = Math.max(layer.index - 1, 1);
    if (nextIdx !== layer.index) engine.reorderLayer(layer.index, nextIdx);
  }, [layer.index]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    engine.selectLayerByIndex(layer.index);
    engine.duplicateSelected();
  }, [layer.index]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    engine.deleteLayerByIndex(layer.index);
  }, [layer.index]);

  return (
    <div
      onClick={handleSelect}
      className={`group flex items-center gap-1 border-b border-border px-2 py-1.5 text-xs cursor-pointer ${
        isSelected ? 'bg-accent-subtle' : 'hover:bg-canvas'
      } ${!layer.visible ? 'opacity-40' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Select ${layer.name}`}
      onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(); }}
    >
      {/* Type icon */}
      <span className="w-4 text-center text-text-tertiary">
        <TypeIcon type={layer.objectType} />
      </span>

      {/* Name */}
      <span className="flex-1 truncate text-text-primary">{layer.name}</span>

      {/* Action buttons — visible on hover or when selected */}
      <div className={`flex items-center gap-0.5 ${isSelected ? 'visible' : 'invisible group-hover:visible'}`}>
        <TinyButton label="Move up" onClick={handleMoveUp}>&#x25B2;</TinyButton>
        <TinyButton label="Move down" onClick={handleMoveDown}>&#x25BC;</TinyButton>
        <TinyButton label="Duplicate" onClick={handleDuplicate}>&#x2398;</TinyButton>
        <TinyButton label="Delete" onClick={handleDelete}>&#x2715;</TinyButton>
      </div>

      {/* Lock toggle */}
      <button
        type="button"
        onClick={handleToggleLock}
        className={`flex h-5 w-5 items-center justify-center rounded ${
          layer.locked ? 'text-danger' : 'text-text-tertiary hover:text-text-secondary'
        }`}
        aria-label={layer.locked ? 'Unlock layer' : 'Lock layer'}
        title={layer.locked ? 'Unlock' : 'Lock'}
      >
        {layer.locked ? <LockIcon /> : <UnlockIcon />}
      </button>

      {/* Visibility toggle */}
      <button
        type="button"
        onClick={handleToggleVisibility}
        className={`flex h-5 w-5 items-center justify-center rounded ${
          layer.visible ? 'text-text-tertiary hover:text-text-secondary' : 'text-text-tertiary'
        }`}
        aria-label={layer.visible ? 'Hide layer' : 'Show layer'}
        title={layer.visible ? 'Hide' : 'Show'}
      >
        {layer.visible ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  );
}

// ─── Small button components ───────────────────────────────────────

function SmallButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded text-text-tertiary hover:bg-wash hover:text-text-secondary">
      {children}
    </button>
  );
}

function TinyButton({ label, onClick, children }: { label: string; onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      className="flex h-4 w-4 items-center justify-center rounded text-[8px] text-text-tertiary hover:text-text-secondary">
      {children}
    </button>
  );
}

// ─── SVG icons ─────────────────────────────────────────────────────

function TypeIcon({ type }: { type: string }) {
  const iconMap: Record<string, string> = {
    rect: '▬', circle: '●', triangle: '▲', line: '╱', polygon: '★',
    group: '⊞', image: '🖼', path: '〰', textbox: 'T',
  };
  return <span className="text-[10px]">{iconMap[type] || '◆'}</span>;
}

function EyeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M1 6s2-3.5 5-3.5S11 6 11 6s-2 3.5-5 3.5S1 6 1 6z" />
      <circle cx="6" cy="6" r="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M1 6s2-3.5 5-3.5S11 6 11 6s-2 3.5-5 3.5S1 6 1 6z" />
      <line x1="2" y1="2" x2="10" y2="10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="2" y="5" width="6" height="4" rx="0.5" />
      <path d="M3 5V3.5a2 2 0 014 0V5" />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="2" y="5" width="6" height="4" rx="0.5" />
      <path d="M3 5V3.5a2 2 0 014 0" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="1" y="1" width="4" height="4" rx="0.5" />
      <rect x="7" y="7" width="4" height="4" rx="0.5" />
      <path d="M5 3h2v2M5 9H3V7" strokeDasharray="1 1" />
    </svg>
  );
}

function UngroupIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="1" y="1" width="4" height="4" rx="0.5" />
      <rect x="7" y="7" width="4" height="4" rx="0.5" />
    </svg>
  );
}
