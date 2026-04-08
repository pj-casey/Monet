/**
 * Toolbar — the top bar with controls.
 *
 * Contains: app name, + New, Export, undo/redo, zoom, grid/guides toggles,
 * dark mode toggle, sidebar toggles, shortcuts button.
 */

import { useEditorStore } from '../stores/editor-store';
import { useHistoryStore } from '../stores/history-store';
import { engine } from './Canvas';

import type { SaveStatus } from '../hooks/use-autosave';

interface ToolbarProps {
  onNewDesign?: () => void;
  onExport?: () => void;
  onSave?: () => void;
  onMyDesigns?: () => void;
  onResize?: () => void;
  onSaveFile?: () => void;
  onOpenFile?: () => void;
  onPublish?: () => void;
  onMarketplace?: () => void;
  saveStatus?: SaveStatus;
  userName?: string | null;
  onLogin?: () => void;
  onLogout?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  leftSidebarOpen?: boolean;
  onToggleLeftSidebar?: () => void;
  rightSidebarOpen?: boolean;
  onToggleRightSidebar?: () => void;
  onSaveAsTemplate?: () => void;
  onShowShortcuts?: () => void;
}

export function Toolbar({
  onNewDesign, onExport, onSave, onMyDesigns, onResize, onSaveFile, onOpenFile, onPublish, onMarketplace, onSaveAsTemplate, saveStatus,
  userName, onLogin, onLogout,
  isDark, onToggleTheme,
  leftSidebarOpen, onToggleLeftSidebar,
  rightSidebarOpen, onToggleRightSidebar,
  onShowShortcuts,
}: ToolbarProps) {
  const zoom = useEditorStore((s) => s.zoom);
  const gridVisible = useEditorStore((s) => s.gridVisible);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const showGuides = useEditorStore((s) => s.showGuides);
  const toggleGridVisible = useEditorStore((s) => s.toggleGridVisible);
  const toggleSnapToGrid = useEditorStore((s) => s.toggleSnapToGrid);
  const toggleShowGuides = useEditorStore((s) => s.toggleShowGuides);
  const rulersVisible = useEditorStore((s) => s.rulersVisible);
  const toggleRulers = useEditorStore((s) => s.toggleRulers);
  const lockAspectRatio = useEditorStore((s) => s.lockAspectRatio);
  const toggleLockAspectRatio = useEditorStore((s) => s.toggleLockAspectRatio);

  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);

  const zoomPercent = `${Math.round(zoom * 100)}%`;

  return (
    <header className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900">
      {/* Left: name + actions */}
      <div className="flex items-center gap-2">
        {onToggleLeftSidebar && (
          <TbBtn label="Toggle left sidebar" onClick={onToggleLeftSidebar} active={leftSidebarOpen}>
            <PanelLeftIcon />
          </TbBtn>
        )}
        <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100 max-sm:hidden">Monet</h1>
        {onNewDesign && (
          <button type="button" onClick={onNewDesign}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
            + New
          </button>
        )}
        {onSave && (
          <button type="button" onClick={onSave}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            Save
          </button>
        )}
        {onExport && (
          <button type="button" onClick={onExport}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            Export
          </button>
        )}
        {onResize && (
          <button type="button" onClick={onResize}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 max-sm:hidden">
            Resize
          </button>
        )}
        {onSaveFile && (
          <TbBtn label="Save as file" onClick={onSaveFile}><SaveFileIcon /></TbBtn>
        )}
        {onOpenFile && (
          <TbBtn label="Open file" onClick={onOpenFile}><OpenFileIcon /></TbBtn>
        )}
        {onSaveAsTemplate && (
          <TbBtn label="Save as template" onClick={onSaveAsTemplate}><TemplateIcon /></TbBtn>
        )}
        {onMyDesigns && (
          <button type="button" onClick={onMyDesigns}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 max-sm:hidden">
            My Designs
          </button>
        )}
        {onMarketplace && (
          <button type="button" onClick={onMarketplace}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 max-sm:hidden">
            Marketplace
          </button>
        )}
        {onPublish && (
          <TbBtn label="Publish template" onClick={onPublish}><PublishIcon /></TbBtn>
        )}
        {/* Save status indicator */}
        {saveStatus && (
          <span className={`text-[10px] ${
            saveStatus === 'saved' ? 'text-green-500' : saveStatus === 'saving' ? 'text-yellow-500' : 'text-gray-400'
          }`}>
            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
          </span>
        )}
      </div>

      {/* Center: undo/redo + zoom */}
      <div className="flex items-center gap-1">
        <TbBtn label="Undo (Ctrl+Z)" onClick={() => engine.undo()} disabled={!canUndo}>&#x21A9;</TbBtn>
        <TbBtn label="Redo (Ctrl+Y)" onClick={() => engine.redo()} disabled={!canRedo}>&#x21AA;</TbBtn>
        <Divider />
        <TbBtn label="Zoom out" onClick={() => engine.setZoom(zoom / 1.2)}>&minus;</TbBtn>
        <span className="min-w-[48px] select-none text-center text-xs text-gray-500 dark:text-gray-400">{zoomPercent}</span>
        <TbBtn label="Zoom in" onClick={() => engine.setZoom(zoom * 1.2)}>+</TbBtn>
        <TbBtn label="Fit to screen" onClick={() => engine.fitToScreen()}><FitIcon /></TbBtn>
      </div>

      {/* Right: toggles + user */}
      <div className="flex items-center gap-1">
        {userName ? (
          <>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 max-sm:hidden">{userName}</span>
            {onLogout && <TbBtn label="Log out" onClick={onLogout}><LogoutIcon /></TbBtn>}
          </>
        ) : (
          onLogin && (
            <button type="button" onClick={onLogin}
              className="rounded-md border border-gray-300 px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800">
              Log in
            </button>
          )
        )}
        <Divider />
        <TogBtn label="Grid" active={gridVisible} onClick={toggleGridVisible}><GridIcon /></TogBtn>
        <TogBtn label="Snap" active={snapToGrid} onClick={toggleSnapToGrid}><SnapIcon /></TogBtn>
        <TogBtn label="Guides" active={showGuides} onClick={toggleShowGuides}><GuidesIcon /></TogBtn>
        <TogBtn label="Rulers" active={rulersVisible} onClick={toggleRulers}><RulerIcon /></TogBtn>
        <TogBtn label="Lock Aspect Ratio" active={lockAspectRatio} onClick={toggleLockAspectRatio}><LockRatioIcon /></TogBtn>
        <Divider />
        {onToggleTheme && (
          <TbBtn label={isDark ? 'Light mode' : 'Dark mode'} onClick={onToggleTheme}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </TbBtn>
        )}
        {onShowShortcuts && (
          <TbBtn label="Shortcuts (?)" onClick={onShowShortcuts}>
            <span className="text-xs font-bold">?</span>
          </TbBtn>
        )}
        {onToggleRightSidebar && (
          <TbBtn label="Toggle right sidebar" onClick={onToggleRightSidebar} active={rightSidebarOpen}>
            <PanelRightIcon />
          </TbBtn>
        )}
      </div>
    </header>
  );
}

// ─── Buttons ──────────────────────────────────────────────────────

function TbBtn({ label, onClick, disabled, active, children }: {
  label: string; onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode;
}) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-gray-400 dark:hover:bg-gray-800 ${active ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
      {children}
    </button>
  );
}

function TogBtn({ label, active, onClick, children }: {
  label: string; active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button type="button" aria-label={label} aria-pressed={active} title={label} onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded ${
        active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      }`}>
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />;
}

// ─── Icons ────────────────────────────────────────────────────────

function FitIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="10" height="10" rx="1"/><path d="M1 5V2a1 1 0 011-1h3M15 5V2a1 1 0 00-1-1h-3M1 11v3a1 1 0 001 1h3M15 11v3a1 1 0 01-1 1h-3"/></svg>;
}
function GridIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M0 5.5h16M0 10.5h16M5.5 0v16M10.5 0v16"/></svg>;
}
function SnapIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2"/><path d="M8 1v3M8 12v3M1 8h3M12 8h3"/></svg>;
}
function GuidesIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1v14" strokeDasharray="2 2"/><path d="M1 8h14" strokeDasharray="2 2"/></svg>;
}
function TemplateIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><path d="M12 10v4M10 12h4"/></svg>;
}
function RulerIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="14" height="5" rx="1"/><path d="M4 1v3M7 1v2M10 1v3M13 1v2"/></svg>;
}
function LockRatioIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="10" height="7" rx="1.5"/><path d="M5 8V5.5a3 3 0 016 0V8"/><circle cx="8" cy="11.5" r="1" fill="currentColor"/></svg>;
}
function SunIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"/></svg>;
}
function MoonIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.5 8.5a5.5 5.5 0 01-6-6 5.5 5.5 0 106 6z"/></svg>;
}
function PanelLeftIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="14" height="12" rx="1"/><path d="M6 2v12"/></svg>;
}
function PanelRightIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="14" height="12" rx="1"/><path d="M10 2v12"/></svg>;
}
function SaveFileIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v8M8 10L5 7M8 10l3-3"/><path d="M2 12v2h12v-2"/></svg>;
}
function OpenFileIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6V3a1 1 0 011-1h4l2 2h4a1 1 0 011 1v1"/><path d="M1 7h14l-2 7H3z"/></svg>;
}
function PublishIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v8M5 5l3-3 3 3"/><path d="M3 10v3a1 1 0 001 1h8a1 1 0 001-1v-3"/></svg>;
}
function LogoutIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3"/><path d="M10 11l3-3-3-3"/><path d="M13 8H6"/></svg>;
}
