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
  onNewDesign?: () => void;
  onSettings?: () => void;
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
  onExport, onMyDesigns, onShowShortcuts, onNewDesign, onSettings,
  saveStatus, isDark, onToggleTheme, onShareLink, onSaveFile, onOpenFile,
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
        <h1 className="flex items-center gap-1.5 font-display text-base font-semibold text-text-primary">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="18" height="18" className="block" aria-hidden="true" />
          Monet
        </h1>
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
              {onNewDesign && (
                <MenuItem onClick={() => { onNewDesign(); setMenuOpen(false); }} shortcut="Ctrl+N">
                  <NewDesignIcon /> New Design
                </MenuItem>
              )}
              {onMyDesigns && (
                <MenuItem onClick={() => { onMyDesigns(); setMenuOpen(false); }}>
                  <MyDesignsIcon /> My Designs
                </MenuItem>
              )}
              {onSaveFile && (
                <MenuItem onClick={() => { onSaveFile(); setMenuOpen(false); }}>
                  <SaveFileIcon /> Save as .monet
                </MenuItem>
              )}
              {onOpenFile && (
                <MenuItem onClick={() => { onOpenFile(); setMenuOpen(false); }}>
                  <OpenFileIcon /> Open .monet
                </MenuItem>
              )}
              <MenuDivider />
              <MenuToggle label="Grid" active={gridVisible} onClick={() => { toggleGridVisible(); }} />
              <MenuToggle label="Snap to Grid" active={snapToGrid} onClick={() => { toggleSnapToGrid(); }} />
              <MenuToggle label="Smart Guides" active={showGuides} onClick={() => { toggleShowGuides(); }} />
              <MenuToggle label="Rulers" active={rulersVisible} onClick={() => { toggleRulers(); }} />
              <MenuDivider />
              {onSettings && (
                <MenuItem onClick={() => { onSettings(); setMenuOpen(false); }} shortcut="Ctrl+,">
                  <SettingsIcon /> Settings
                </MenuItem>
              )}
              {onToggleTheme && (
                <MenuItem onClick={() => { onToggleTheme(); setMenuOpen(false); }}>
                  {isDark ? <><SunMenuIcon /> Light Mode</> : <><MoonMenuIcon /> Dark Mode</>}
                </MenuItem>
              )}
              {onShowShortcuts && (
                <MenuItem onClick={() => { onShowShortcuts(); setMenuOpen(false); }} shortcut="?">
                  <ShortcutsIcon /> Keyboard Shortcuts
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

function MenuItem({ onClick, children, shortcut }: { onClick: () => void; children: React.ReactNode; shortcut?: string }) {
  return (
    <button type="button" onClick={onClick}
      className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-text-primary hover:bg-canvas">
      <span className="flex items-center gap-2">{children}</span>
      {shortcut && <kbd className="text-[10px] text-text-tertiary">{shortcut}</kbd>}
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

// ─── Menu item icons ─────────────────────────────────────────────

function NewDesignIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M8 7v4M6 9h4"/></svg>;
}

function MyDesignsIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>;
}

function SaveFileIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v7M5 7l3 3 3-3"/><path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2"/></svg>;
}

function OpenFileIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4h5l2 2h5a1 1 0 011 1v6a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1z"/></svg>;
}

function SettingsIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}

function SunMenuIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"/></svg>;
}

function MoonMenuIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.5 8.5a5.5 5.5 0 01-6-6 5.5 5.5 0 106 6z"/></svg>;
}

function ShortcutsIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="14" height="9" rx="2"/><path d="M4 7h1M7 7h2M11 7h1M4 10h8"/></svg>;
}
