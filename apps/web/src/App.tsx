/**
 * App — the root layout of the Monet editor.
 *
 * Two modes:
 * 1. **Welcome Screen**: shown when no design is loaded (first visit or after
 *    clicking "back to home"). Displays category cards for new users or a
 *    saved-designs dashboard for returning users.
 * 2. **Editor**: the full canvas editor with simplified toolbar, wide left
 *    sidebar (Design | Elements | Text | Upload | AI tabs), and contextual
 *    right sidebar (only appears when an object is selected).
 *
 * Features:
 * - Auto-save to IndexedDB (debounced 2s, immediate on blur/unload)
 * - Dark mode, responsive layout
 * - Modals: TemplateBrowser, ExportDialog, ShortcutSheet, ResizeDialog, etc.
 */

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import type { SelectedObjectProps, LayerInfo, ArtboardPreset } from '@monet/shared';
import { Canvas, onSelectionChange, onLayersChange, engine } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { BottomBar } from './components/BottomBar';
import { PageNavigator } from './components/PageNavigator';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CanvasHints } from './components/CanvasHints';
import { ContextMenu } from './components/ContextMenu';
import { checkAuth, logout as doLogout, type AuthUser } from './components/AuthModal';
import { pullAndMerge, pushAllLocal } from './lib/sync';
import { useCollaboration } from './hooks/use-collaboration';
import { CollabToolbar } from './components/CollabToolbar';
import { CursorOverlay } from './components/CursorOverlay';
import { registerBuiltinPlugins } from './plugins';
import { pluginManager } from './lib/plugin-manager';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SkipLink, LiveRegion } from './components/A11y';
import { ToastContainer } from './components/Toast';
import { useActivityStore } from './stores/activity-store';
import { migrateFromOpenCanvas } from './lib/migrate-storage';
import { useTheme } from './hooks/use-theme';
import { useAutosave } from './hooks/use-autosave';
import { getCurrentDesignId, getDesign } from './lib/db';
import { exportDesignFile, importDesignFile } from './lib/file-io';
import { useEditorStore } from './stores/editor-store';
import type { Template } from '@monet/templates';

// ─── Lazy-loaded modals and optional features ─────────────────────
// These only load when the user actually opens them, keeping the
// initial editor bundle small and reducing Total Blocking Time.
const TemplateBrowser = lazy(() => import('./components/TemplateBrowser').then((m) => ({ default: m.TemplateBrowser })));
const ExportDialog = lazy(() => import('./components/ExportDialog').then((m) => ({ default: m.ExportDialog })));
const ShortcutSheet = lazy(() => import('./components/ShortcutSheet').then((m) => ({ default: m.ShortcutSheet })));
const MyDesigns = lazy(() => import('./components/MyDesigns').then((m) => ({ default: m.MyDesigns })));
const ResizeDialog = lazy(() => import('./components/ResizeDialog').then((m) => ({ default: m.ResizeDialog })));
const AuthModal = lazy(() => import('./components/AuthModal').then((m) => ({ default: m.AuthModal })));
const MarketplaceBrowser = lazy(() => import('./components/MarketplaceBrowser').then((m) => ({ default: m.MarketplaceBrowser })));
const SaveTemplateDialog = lazy(() => import('./components/SaveTemplateDialog').then((m) => ({ default: m.SaveTemplateDialog })));
const PublishTemplate = lazy(() => import('./components/PublishTemplate').then((m) => ({ default: m.PublishTemplate })));
const CommentsPanel = lazy(() => import('./components/CommentsPanel').then((m) => ({ default: m.CommentsPanel })));
const Onboarding = lazy(() => import('./components/Onboarding').then((m) => ({ default: m.Onboarding })));
const CommandPalette = lazy(() => import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })));
const ContextualAI = lazy(() => import('./components/ContextualAI').then((m) => ({ default: m.ContextualAI })));
const TabSuggest = lazy(() => import('./components/TabSuggest').then((m) => ({ default: m.TabSuggest })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then((m) => ({ default: m.SettingsModal })));

/** Invisible Suspense fallback — modals don't need a loading spinner */
const NoFallback = null;

/** Tracks whether we're on the welcome screen or in the editor */
type AppView = 'welcome' | 'editor';

function App() {
  const [view, setView] = useState<AppView>('welcome');
  const [selection, setSelection] = useState<SelectedObjectProps | null>(null);
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [templateBrowserOpen, setTemplateBrowserOpen] = useState(false);
  const [templateBrowserTab, setTemplateBrowserTab] = useState<'templates' | 'blank' | 'ai' | undefined>(undefined);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [shortcutSheetOpen, setShortcutSheetOpen] = useState(false);
  const [myDesignsOpen, setMyDesignsOpen] = useState(false);
  const [resizeDialogOpen, setResizeDialogOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newDesignConfirmOpen, setNewDesignConfirmOpen] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const setActivity = useActivityStore((s) => s.setActivity);
  const autosave = useAutosave(!!authUser);
  const collab = useCollaboration();

  // Check for existing session on startup (non-blocking — guest mode if server is down)
  useEffect(() => {
    checkAuth().then(({ user, reachable }) => {
      if (user) setAuthUser(user);
      setBackendAvailable(reachable);
    });
    // Migrate storage from old "opencanvas-*" keys to "monet-*" (runs once, idempotent)
    migrateFromOpenCanvas();
  }, []);

  // Initialize plugin system
  useEffect(() => {
    registerBuiltinPlugins();
    pluginManager.initAll();
    return () => pluginManager.destroyAll();
  }, []);

  const setArtboardDimensions = useEditorStore((s) => s.setArtboardDimensions);

  useEffect(() => { return onSelectionChange(setSelection); }, []);
  useEffect(() => { return onLayersChange(setLayers); }, []);

  // Auto-load the last design on startup — if found, go straight to editor
  useEffect(() => {
    if (initialized) return;
    const loadLast = async () => {
      // Check if there's a saved design to restore
      const lastId = getCurrentDesignId();
      if (lastId) {
        const saved = await getDesign(lastId);
        if (saved) {
          // We have a saved design — switch to editor view.
          // The Canvas component will mount and initialize the engine.
          // The pendingDoc effect will load the design once the engine is ready.
          autosave.loadDesign(saved);
          setArtboardDimensions(saved.document.dimensions.width, saved.document.dimensions.height);
          pendingDoc.current = saved.document;
          setView('editor');
          setInitialized(true);
          return;
        }
      }
      // No saved design — show welcome screen (no engine needed)
      setInitialized(true);
    };
    loadLast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  // Global keyboard shortcuts: Ctrl+S to save, "?" for shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      // Ctrl+S = save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        autosave.saveNow();
        return;
      }
      // Ctrl+N = new design
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewDesign();
        return;
      }
      // Ctrl+, = settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setSettingsOpen(true);
        return;
      }
      // "?" = shortcut sheet (not in inputs)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault();
        setShortcutSheetOpen((prev) => !prev);
      }
      // "/" or Cmd+K = command palette (not in inputs, not during text editing)
      if (
        (e.key === '/' && !e.ctrlKey && !e.metaKey && !isInput) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'k')
      ) {
        // Don't open if a text object is being edited on canvas
        const active = engine.getFabricCanvas()?.getActiveObject();
        if (active && (active as any).isEditing) return;
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [autosave]);

  const getSelectedLayerIndex = useCallback((): number => {
    if (!selection) return -1;
    const fabricCanvas = engine.getFabricCanvas();
    if (!fabricCanvas) return -1;
    const active = fabricCanvas.getActiveObject();
    if (!active) return -1;
    return fabricCanvas.getObjects().indexOf(active);
  }, [selection]);

  /** Handle opening a design from My Designs or Welcome Screen */
  const handleOpenDesign = useCallback((saved: import('./lib/db').SavedDesign) => {
    autosave.loadDesign(saved);
    setArtboardDimensions(saved.document.dimensions.width, saved.document.dimensions.height);
    // If engine is already initialized (e.g., opening from My Designs while in editor),
    // load directly. Otherwise defer via pendingDoc (e.g., opening from Welcome Screen).
    if (engine.isInitialized()) {
      engine.fromJSON(saved.document);
    } else {
      pendingDoc.current = saved.document;
    }
    setView('editor');
    setMyDesignsOpen(false);
  }, [autosave, setArtboardDimensions]);

  /** Handle creating a new design — confirm first if canvas has content */
  const handleNewDesign = useCallback(() => {
    if (view === 'editor' && layers.length > 0) {
      setNewDesignConfirmOpen(true);
      return;
    }
    // No content or on welcome screen — proceed directly
    if (view === 'editor') {
      autosave.saveNow();
      autosave.newDesign();
      setView('welcome');
    } else {
      autosave.newDesign();
      setView('welcome');
    }
  }, [autosave, view, layers.length]);

  /** Confirmed new design — save current and go to welcome screen */
  const confirmNewDesign = useCallback(() => {
    autosave.saveNow();
    autosave.newDesign();
    setNewDesignConfirmOpen(false);
    setView('welcome');
  }, [autosave]);

  // Pending document to load after canvas mounts (used by welcome screen flows)
  const pendingDoc = useRef<import('@monet/shared').DesignDocument | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // When the view switches to editor, load the pending document once Canvas mounts
  useEffect(() => {
    if (view !== 'editor') { setCanvasReady(false); return; }
    if (!pendingDoc.current) { setCanvasReady(true); return; }
    const doc = pendingDoc.current;
    pendingDoc.current = null;
    setActivity('loading');
    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 100; // 5 seconds at 50ms intervals
    // Wait for Canvas component to mount and initialize the engine
    const tryLoad = () => {
      if (cancelled) return;
      if (engine.isInitialized()) {
        engine.fromJSON(doc)
          .then(() => { if (!cancelled) { setCanvasReady(true); setActivity('idle'); } })
          .catch((err) => {
            console.error('Failed to load design:', err);
            if (!cancelled) { setCanvasReady(true); setActivity('idle'); }
          });
      } else if (attempts < MAX_ATTEMPTS) {
        attempts++;
        setTimeout(tryLoad, 50);
      } else {
        console.error('Canvas engine failed to initialize after 5s');
        if (!cancelled) { setCanvasReady(true); setActivity('idle'); }
      }
    };
    setTimeout(tryLoad, 50);
    return () => { cancelled = true; };
  }, [view, setActivity]);

  /** Start from a template (from welcome screen category grid) */
  const handleStartFromTemplate = useCallback((template: Template) => {
    autosave.newDesign();
    autosave.setDesignName(template.name);
    setArtboardDimensions(template.dimensions.width, template.dimensions.height);
    // Defer fromJSON until Canvas mounts
    pendingDoc.current = template.document;
    setView('editor');
  }, [autosave, setArtboardDimensions]);

  /** Start from a blank preset (from welcome screen) */
  const handleStartBlank = useCallback((preset: ArtboardPreset) => {
    autosave.newDesign();
    setArtboardDimensions(preset.width, preset.height);
    // Defer fromJSON until Canvas mounts
    pendingDoc.current = {
      version: 1, id: '', name: 'Untitled Design',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      dimensions: { width: preset.width, height: preset.height },
      background: { type: 'solid', value: '#ffffff' },
      objects: [], metadata: {},
    };
    setView('editor');
  }, [autosave, setArtboardDimensions]);

  /** Open a resized design on the canvas (from Magic Resize) */
  const handleOpenResized = useCallback((doc: import('@monet/shared').DesignDocument) => {
    autosave.newDesign();
    autosave.setDesignName(doc.name);
    setArtboardDimensions(doc.dimensions.width, doc.dimensions.height);
    if (engine.isInitialized()) {
      engine.fromJSON(doc);
    } else {
      pendingDoc.current = doc;
    }
  }, [autosave, setArtboardDimensions]);

  /** Use a marketplace template — load it as a new design */
  const handleUseMarketplaceTemplate = useCallback((doc: import('@monet/shared').DesignDocument) => {
    autosave.newDesign();
    autosave.setDesignName(doc.name || 'From Marketplace');
    setArtboardDimensions(doc.dimensions.width, doc.dimensions.height);
    if (engine.isInitialized()) {
      engine.fromJSON(doc);
    } else {
      pendingDoc.current = doc;
    }
    setView('editor');
  }, [autosave, setArtboardDimensions]);

  /** Export current design as .monet file */
  const handleExportFile = useCallback(() => {
    const doc = engine.toJSON(autosave.designName, autosave.currentId || undefined);
    exportDesignFile(doc, autosave.designName);
  }, [autosave]);

  /** Import a .monet file */
  const handleImportFile = useCallback(async () => {
    const doc = await importDesignFile();
    if (doc) {
      autosave.newDesign();
      autosave.setDesignName(doc.name);
      setArtboardDimensions(doc.dimensions.width, doc.dimensions.height);
      if (engine.isInitialized()) {
        engine.fromJSON(doc);
      } else {
        pendingDoc.current = doc;
      }
      setView('editor');
    }
  }, [autosave, setArtboardDimensions]);

  // ─── Welcome Screen ─────────────────────────────────────────────
  // No wrapper div needed — <html class="dark"> handles theme globally
  if (view === 'welcome' && initialized) {
    return (
      <div className="editor-shell">
        <main>
        <WelcomeScreen
          onOpenDesign={handleOpenDesign}
          onNewDesign={handleNewDesign}
          onStartFromTemplate={handleStartFromTemplate}
          onStartBlank={handleStartBlank}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        </main>
        <Suspense fallback={NoFallback}>
          {settingsOpen && <SettingsModal isOpen onClose={() => setSettingsOpen(false)} />}
        </Suspense>
      </div>
    );
  }

  // ─── Editor ─────────────────────────────────────────────────────
  return (
    <div className="editor-shell flex h-screen w-screen flex-col bg-canvas">
      {/* Mobile notice — visible below 768px */}
      <div className="flex items-center justify-center gap-2 border-b border-border bg-elevated px-3 py-2 text-center text-xs text-text-secondary md:hidden">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>
        Best experienced on desktop
      </div>
      <SkipLink />
      <LiveRegion message={autosave.status === 'saved' ? 'Design saved' : autosave.status === 'saving' ? 'Saving design' : ''} />
      <ErrorBoundary name="Toolbar">
      <Toolbar
        onExport={() => setExportDialogOpen(true)}
        onMyDesigns={() => setMyDesignsOpen(true)}
        onNewDesign={handleNewDesign}
        onSettings={() => setSettingsOpen(true)}
        onSaveFile={handleExportFile}
        onOpenFile={handleImportFile}
        saveStatus={autosave.status}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onShowShortcuts={() => setShortcutSheetOpen(true)}
        userName={authUser?.name || authUser?.email || null}
        onLogin={backendAvailable ? () => setAuthModalOpen(true) : undefined}
        onLogout={backendAvailable ? async () => { await doLogout(); setAuthUser(null); } : undefined}
      />
      </ErrorBoundary>

      {/* Collaboration toolbar — shows when collab session is active */}
      {collab.connected && (
        <div className="flex items-center justify-center gap-2 border-b border-border bg-canvas px-3 py-1">
          <CollabToolbar
            users={collab.collabUsers}
            designId={autosave.currentId}
            isConnected={collab.connected}
            followingUserId={collab.followingUserId}
            onFollow={collab.setFollowingUserId}
          />
          <button type="button" onClick={() => collab.setCommentsOpen((p) => !p)}
            className="rounded-md border border-border px-2 py-0.5 text-[10px] text-text-secondary hover:bg-wash">
            Comments ({collab.comments.length})
          </button>
        </div>
      )}

      <main id="canvas-area" className="relative flex flex-1 overflow-hidden">
        {/* Left sidebar — always visible in editor */}
        <ErrorBoundary name="Left Sidebar">
          <div className="z-20 flex-shrink-0 max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:shadow-xl">
            <LeftSidebar
              onOpenTemplates={() => setTemplateBrowserOpen(true)}
              onOpenResize={() => setResizeDialogOpen(true)}
              onSaveAsTemplate={() => setSaveTemplateOpen(true)}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </div>
        </ErrorBoundary>

        {/* Canvas */}
        <ErrorBoundary name="Canvas">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
            style={canvasReady ? undefined : { opacity: 0 }}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY });
            }}
          >
            <Canvas />
            <CursorOverlay cursors={collab.cursors} />
            <CanvasHints
              hasObjects={layers.length > 0}
              onGenerateAI={() => { setTemplateBrowserTab('ai'); setTemplateBrowserOpen(true); }}
              onBrowseTemplates={() => { setTemplateBrowserTab('templates'); setTemplateBrowserOpen(true); }}
            />
            {contextMenu && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                hasSelection={selection !== null}
                isMultiSelect={selection?.objectType === 'activeselection'}
                isLocked={(() => { const c = engine.getFabricCanvas(); const a = c?.getActiveObject(); return a ? !a.selectable : false; })()}
                onClose={() => setContextMenu(null)}
              />
            )}
          </div>
          {/* Loading overlay during canvas initialization */}
          {!canvasReady && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-canvas">
              <div className="flex flex-col items-center gap-3">
                <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="28" height="28" className="animate-pulse" />
                <p className="text-sm text-text-secondary">Preparing your design...</p>
              </div>
            </div>
          )}
        </ErrorBoundary>

        {/* Right sidebar — contextual, only visible when object selected */}
        <ErrorBoundary name="Right Sidebar">
          <RightSidebar
            selection={selection}
            layers={layers}
            selectedIndex={getSelectedLayerIndex()}
          />
        </ErrorBoundary>
      </main>

      <Suspense fallback={NoFallback}>
        {collab.commentsOpen && <CommentsPanel comments={collab.comments} isOpen onClose={() => collab.setCommentsOpen(false)} />}
      </Suspense>

      <PageNavigator />
      <BottomBar />
      <ToastContainer />

      {/* Modals — all lazy-loaded, only mount when opened */}
      <Suspense fallback={NoFallback}>
        {templateBrowserOpen && (
          <ErrorBoundary name="Template Browser">
            <TemplateBrowser
              key={`tb-${templateBrowserTab || 'default'}`}
              isOpen
              initialTab={templateBrowserTab}
              onClose={() => { setTemplateBrowserOpen(false); setTemplateBrowserTab(undefined); }}
              onOpenSettings={() => { setTemplateBrowserOpen(false); setSettingsOpen(true); }}
            />
          </ErrorBoundary>
        )}
        {exportDialogOpen && <ExportDialog isOpen onClose={() => setExportDialogOpen(false)} />}
        {shortcutSheetOpen && <ShortcutSheet isOpen onClose={() => setShortcutSheetOpen(false)} />}
        {myDesignsOpen && <MyDesigns isOpen onClose={() => setMyDesignsOpen(false)} onOpenDesign={handleOpenDesign} />}
        {resizeDialogOpen && <ResizeDialog isOpen onClose={() => setResizeDialogOpen(false)} onOpenResized={handleOpenResized} />}
        {publishOpen && <PublishTemplate isOpen onClose={() => setPublishOpen(false)} />}
        {marketplaceOpen && <MarketplaceBrowser isOpen onClose={() => setMarketplaceOpen(false)} onUseTemplate={handleUseMarketplaceTemplate} />}
        {saveTemplateOpen && <SaveTemplateDialog onClose={() => setSaveTemplateOpen(false)} />}
        {authModalOpen && <AuthModal isOpen onClose={() => setAuthModalOpen(false)}
          onLogin={async (user, _token) => {
            setAuthUser(user);
            setAuthModalOpen(false);
            await pushAllLocal();
            const conflicts = await pullAndMerge();
            if (conflicts.length > 0) {
              alert(`${conflicts.length} design(s) have conflicting changes. Local versions kept.`);
            }
          }} />}
        {settingsOpen && <SettingsModal isOpen onClose={() => setSettingsOpen(false)} />}
        <Onboarding />
      </Suspense>

      {/* New Design confirmation dialog */}
      {newDesignConfirmOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setNewDesignConfirmOpen(false)}
          role="dialog" aria-modal="true" aria-label="New design confirmation"
        >
          <div className="animate-scale-up w-full max-w-xs rounded-lg bg-overlay p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Start a new design?</h3>
            <p className="mb-5 text-xs text-text-secondary">Your current design will be saved automatically. You can find it in My Designs.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setNewDesignConfirmOpen(false)}
                className="flex-1 rounded-sm border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:bg-wash">
                Cancel
              </button>
              <button type="button" onClick={confirmNewDesign}
                className="flex-1 rounded-sm bg-accent px-3 py-2 text-xs font-medium text-accent-fg hover:bg-accent-hover">
                New Design
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette — opens on / or Cmd+K */}
      <Suspense fallback={NoFallback}>
        {commandPaletteOpen && <CommandPalette
          isOpen
          onClose={() => setCommandPaletteOpen(false)}
          onExport={() => { setCommandPaletteOpen(false); setExportDialogOpen(true); }}
          onResize={() => { setCommandPaletteOpen(false); setResizeDialogOpen(true); }}
          onMyDesigns={() => { setCommandPaletteOpen(false); setMyDesignsOpen(true); }}
          onShortcuts={() => { setCommandPaletteOpen(false); setShortcutSheetOpen(true); }}
          onTemplates={() => { setCommandPaletteOpen(false); setTemplateBrowserOpen(true); }}
          onNew={() => { setCommandPaletteOpen(false); autosave.newDesign(); }}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />}

        {/* Contextual AI actions — floating buttons near selected objects */}
        <ContextualAI />

        {/* Tab-to-suggest — AI copy suggestions on empty text objects */}
        <TabSuggest />
      </Suspense>
    </div>
  );
}

export default App;
