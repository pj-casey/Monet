/**
 * Toolbar — simplified top bar.
 *
 * Left:   Logo + undo/redo + auto-save badge
 * Center: Select / Draw / Pen tool switcher + zoom controls
 * Right:  Share + Export + overflow menu (My Designs, Settings, Shortcuts, Rulers, Grid, Dark Mode)
 */

import { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../stores/editor-store';
import { useHistoryStore } from '../stores/history-store';
import { engine } from './Canvas';
import { Tooltip } from './Tooltip';

import type { SaveStatus } from '../hooks/use-autosave';

interface ToolbarProps {
  onExport?: () => void;
  onMyDesigns?: () => void;
  onShowShortcuts?: () => void;
  saveStatus?: SaveStatus;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onShareLink?: () => void;
  onSaveFile?: () => void;
  onOpenFile?: () => void;
  userName?: string | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Toolbar({
  onExport, onMyDesigns, onShowShortcuts, saveStatus,
  isDark, onToggleTheme, onShareLink, onSaveFile, onOpenFile,
  userName, onLogin, onLogout,
}: ToolbarProps) {
  const zoom = useEditorStore((s) => s.zoom);
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const gridVisible = useEditorStore((s) => s.gridVisible);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const showGuides = useEditorStore((s) => s.showGuides);
  const toggleGridVisible = useEditorStore((s) => s.toggleGridVisible);
  const toggleSnapToGrid = useEditorStore((s) => s.toggleSnapToGrid);
  const toggleShowGuides = useEditorStore((s) => s.toggleShowGuides);
  const rulersVisible = useEditorStore((s) => s.rulersVisible);
  const toggleRulers = useEditorStore((s) => s.toggleRulers);

  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [savePulse, setSavePulse] = useState(false);
  const prevStatus = useRef(saveStatus);

  // Trigger save pulse animation when status transitions to 'saved'
  useEffect(() => {
    if (saveStatus === 'saved' && prevStatus.current === 'saving') {
      setSavePulse(true);
      const t = setTimeout(() => setSavePulse(false), 600);
      prevStatus.current = saveStatus;
      return () => clearTimeout(t);
    }
    prevStatus.current = saveStatus;
  }, [saveStatus]);

  // Close overflow menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const zoomPercent = `${Math.round(zoom * 100)}%`;

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-surface px-4 shadow-sm">

      {/* ─── Left: Logo + Undo/Redo + Save badge ─── */}
      <div className="flex items-center gap-2">
        <h1 className="font-display text-base font-semibold text-text-primary">Monet</h1>
        <Divider />
        <TbBtn label="Undo (Ctrl+Z)" onClick={() => engine.undo()} disabled={!canUndo}>
          <UndoIcon />
        </TbBtn>
        <TbBtn label="Redo (Ctrl+Y)" onClick={() => engine.redo()} disabled={!canRedo}>
          <RedoIcon />
        </TbBtn>
        {/* Auto-save badge with pulse animation */}
        {saveStatus && (
          <span className={`ml-1 rounded-full px-2.5 py-0.5 text-[9px] font-medium ${savePulse ? 'animate-save-pulse' : ''} ${
            saveStatus === 'saved'
              ? 'bg-success-subtle text-success'
              : saveStatus === 'saving'
                ? 'bg-warning-subtle text-warning'
                : 'bg-wash text-text-tertiary'
          }`}>
            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : ''}
          </span>
        )}
      </div>

      {/* ─── Center: Tool switcher + zoom ─── */}
      <div className="flex items-center gap-1">
        {/* Tool switcher */}
        <div className="flex rounded-lg border border-border">
          <ToolBtn
            label="Select (V)"
            active={activeTool === 'select'}
            onClick={() => setActiveTool('select')}
            first
          >
            <SelectIcon />
          </ToolBtn>
          <ToolBtn
            label="Draw (D)"
            active={activeTool === 'draw'}
            onClick={() => setActiveTool(activeTool === 'draw' ? 'select' : 'draw')}
          >
            <DrawIcon />
          </ToolBtn>
          <ToolBtn
            label="Pen (P)"
            active={activeTool === 'pen'}
            onClick={() => setActiveTool(activeTool === 'pen' ? 'select' : 'pen')}
            last
          >
            <PenIcon />
          </ToolBtn>
        </div>

        <Divider />

        {/* Zoom */}
        <TbBtn label="Zoom out" onClick={() => engine.setZoom(zoom / 1.2)}>&minus;</TbBtn>
        <span className="min-w-[48px] select-none text-center text-sm tabular-nums text-text-primary">{zoomPercent}</span>
        <TbBtn label="Zoom in" onClick={() => engine.setZoom(zoom * 1.2)}>+</TbBtn>
        <TbBtn label="Fit to screen" onClick={() => engine.fitToScreen()}>
          <FitIcon />
        </TbBtn>
      </div>

      {/* ─── Right: Share + Export + overflow menu ─── */}
      <div className="flex items-center gap-2">
        {onShareLink && (
          <button type="button" onClick={onShareLink}
            className="rounded-lg border border-border-strong px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-wash">
            Share
          </button>
        )}
        {onExport && (
          <button type="button" onClick={onExport}
            className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-fg shadow-sm hover:bg-accent-hover hover:shadow-md">
            Export
          </button>
        )}

        {/* Overflow menu */}
        <div className="relative" ref={menuRef}>
          <TbBtn label="More options" onClick={() => setMenuOpen(!menuOpen)}>
            <MoreIcon />
          </TbBtn>

          {menuOpen && (
            <div className="animate-scale-up absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-border bg-surface py-1.5 shadow-xl">
              {onMyDesigns && (
                <MenuItem onClick={() => { onMyDesigns(); setMenuOpen(false); }}>
                  My Designs
                </MenuItem>
              )}
              {onSaveFile && (
                <MenuItem onClick={() => { onSaveFile(); setMenuOpen(false); }}>
                  Save as .monet File
                </MenuItem>
              )}
              {onOpenFile && (
                <MenuItem onClick={() => { onOpenFile(); setMenuOpen(false); }}>
                  Open .monet File
                </MenuItem>
              )}
              <MenuDivider />
              <MenuToggle label="Grid" active={gridVisible} onClick={() => { toggleGridVisible(); }} />
              <MenuToggle label="Snap to Grid" active={snapToGrid} onClick={() => { toggleSnapToGrid(); }} />
              <MenuToggle label="Smart Guides" active={showGuides} onClick={() => { toggleShowGuides(); }} />
              <MenuToggle label="Rulers" active={rulersVisible} onClick={() => { toggleRulers(); }} />
              <MenuDivider />
              {onToggleTheme && (
                <MenuItem onClick={() => { onToggleTheme(); setMenuOpen(false); }}>
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </MenuItem>
              )}
              {onShowShortcuts && (
                <MenuItem onClick={() => { onShowShortcuts(); setMenuOpen(false); }}>
                  Keyboard Shortcuts
                </MenuItem>
              )}
              {(userName || onLogin) && <MenuDivider />}
              {userName && (
                <div className="px-3 py-1.5 text-[10px] text-text-tertiary">{userName}</div>
              )}
              {userName && onLogout && (
                <MenuItem onClick={() => { onLogout(); setMenuOpen(false); }}>
                  Log Out
                </MenuItem>
              )}
              {!userName && onLogin && (
                <MenuItem onClick={() => { onLogin(); setMenuOpen(false); }}>
                  Log In
                </MenuItem>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Menu components ──────────────────────────────────────────────

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className="flex w-full items-center px-3 py-2 text-left text-xs text-text-primary hover:bg-canvas">
      {children}
    </button>
  );
}

function MenuToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex w-full items-center justify-between px-3 py-2 text-xs text-text-primary hover:bg-canvas">
      <span>{label}</span>
      {active && <span className="text-sm text-accent">✓</span>}
    </button>
  );
}

function MenuDivider() {
  return <div className="my-1 h-px bg-wash" />;
}

// ─── Toolbar buttons ──────────────────────────────────────────────

function TbBtn({ label, onClick, disabled, children }: {
  label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <Tooltip label={label}>
      <button type="button" aria-label={label} onClick={onClick} disabled={disabled}
        className="flex h-8 w-8 items-center justify-center rounded text-text-secondary hover:bg-wash disabled:opacity-30 disabled:hover:bg-transparent">
        {children}
      </button>
    </Tooltip>
  );
}

function ToolBtn({ label, active, onClick, children, first, last }: {
  label: string; active: boolean; onClick: () => void; children: React.ReactNode;
  first?: boolean; last?: boolean;
}) {
  return (
    <Tooltip label={label}>
      <button type="button" aria-label={label} aria-pressed={active} onClick={onClick}
        className={`flex h-8 w-8 items-center justify-center ${
          first ? 'rounded-l-md' : ''
        } ${last ? 'rounded-r-md' : ''} ${
          active
            ? 'bg-accent-subtle text-accent'
            : 'text-text-secondary hover:bg-canvas'
        }`}>
        {children}
      </button>
    </Tooltip>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-wash" />;
}

// ─── Icons ────────────────────────────────────────────────────────

function UndoIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h7a4 4 0 010 8H6"/><path d="M6 4L3 7l3 3"/></svg>;
}

function RedoIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 7H6a4 4 0 000 8h4"/><path d="M10 4l3 3-3 3"/></svg>;
}

function SelectIcon() {
  return <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2l5 14 2-5.5L15.5 8.5z" /></svg>;
}

function DrawIcon() {
  return <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 15l3-1L14.5 5.5a1.4 1.4 0 00-2-2L4 12z" /><path d="M11.5 4.5l2 2" /></svg>;
}

function PenIcon() {
  return <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 15 Q5 10 9 9 Q13 8 15 3" /><circle cx="3" cy="15" r="1.5" fill="currentColor" /><circle cx="15" cy="3" r="1.5" fill="currentColor" /></svg>;
}

function FitIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="10" height="10" rx="1"/><path d="M1 5V2a1 1 0 011-1h3M15 5V2a1 1 0 00-1-1h-3M1 11v3a1 1 0 001 1h3M15 11v3a1 1 0 01-1 1h-3"/></svg>;
}

function MoreIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>;
}
