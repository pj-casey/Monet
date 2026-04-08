/**
 * App — the root layout of the Monet editor.
 *
 * Features:
 * - Auto-save to IndexedDB (debounced 2s, immediate on blur/unload)
 * - My Designs dashboard, .monet file import/export
 * - Dark mode, responsive sidebars, shortcut sheet
 * - Modals: TemplateBrowser, ExportDialog, ShortcutSheet, MyDesigns
 */

import { useState, useEffect, useCallback } from 'react';
import type { SelectedObjectProps, LayerInfo } from '@monet/shared';
import { Canvas, onSelectionChange, onLayersChange, engine } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { BottomBar } from './components/BottomBar';
import { LeftSidebar } from './components/LeftSidebar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { LayerPanel } from './components/LayerPanel';
import { TemplateBrowser } from './components/TemplateBrowser';
import { ExportDialog } from './components/ExportDialog';
import { ShortcutSheet } from './components/ShortcutSheet';
import { MyDesigns } from './components/MyDesigns';
import { ResizeDialog } from './components/ResizeDialog';
import { AuthModal, checkAuth, logout, type AuthUser } from './components/AuthModal';
import { pullAndMerge, pushAllLocal } from './lib/sync';
import { useCollaboration } from './hooks/use-collaboration';
import { CollabToolbar } from './components/CollabToolbar';
import { CursorOverlay } from './components/CursorOverlay';
import { PublishTemplate } from './components/PublishTemplate';
import { MarketplaceBrowser } from './components/MarketplaceBrowser';
import { SaveTemplateDialog } from './components/SaveTemplateDialog';
import { registerBuiltinPlugins } from './plugins';
import { pluginManager } from './lib/plugin-manager';
import { CommentsPanel } from './components/CommentsPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Onboarding } from './components/Onboarding';
import { SkipLink, LiveRegion } from './components/A11y';
import { migrateFromOpenCanvas } from './lib/migrate-storage';
import { useTheme } from './hooks/use-theme';
import { useAutosave } from './hooks/use-autosave';
import { getCurrentDesignId, getDesign } from './lib/db';
import { exportDesignFile, importDesignFile } from './lib/file-io';
import { useEditorStore } from './stores/editor-store';

function App() {
  const [selection, setSelection] = useState<SelectedObjectProps | null>(null);
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [templateBrowserOpen, setTemplateBrowserOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [shortcutSheetOpen, setShortcutSheetOpen] = useState(false);
  const [myDesignsOpen, setMyDesignsOpen] = useState(false);
  const [resizeDialogOpen, setResizeDialogOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const autosave = useAutosave(!!authUser);
  const collab = useCollaboration();

  // Check for existing session on startup (non-blocking — guest mode if server is down)
  useEffect(() => {
    checkAuth().then((user) => { if (user) setAuthUser(user); });
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

  // Auto-load the last design on startup
  useEffect(() => {
    if (initialized) return;
    const loadLast = async () => {
      // Wait a tick for the canvas engine to initialize
      await new Promise((r) => setTimeout(r, 100));
      if (!engine.isInitialized()) return;

      const lastId = getCurrentDesignId();
      if (lastId) {
        const saved = await getDesign(lastId);
        if (saved) {
          autosave.loadDesign(saved);
          setArtboardDimensions(saved.document.dimensions.width, saved.document.dimensions.height);
          setInitialized(true);
          return;
        }
      }
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
      // "?" = shortcut sheet (not in inputs)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault();
        setShortcutSheetOpen((prev) => !prev);
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

  /** Handle opening a design from My Designs */
  const handleOpenDesign = useCallback((saved: import('./lib/db').SavedDesign) => {
    autosave.loadDesign(saved);
    setArtboardDimensions(saved.document.dimensions.width, saved.document.dimensions.height);
  }, [autosave, setArtboardDimensions]);

  /** Handle creating a new design (from template browser) */
  const handleNewDesign = useCallback(() => {
    autosave.newDesign();
    setTemplateBrowserOpen(true);
  }, [autosave]);

  /** Open a resized design on the canvas (from Magic Resize) */
  const handleOpenResized = useCallback((doc: import('@monet/shared').DesignDocument) => {
    autosave.newDesign();
    autosave.setDesignName(doc.name);
    setArtboardDimensions(doc.dimensions.width, doc.dimensions.height);
    engine.fromJSON(doc);
  }, [autosave, setArtboardDimensions]);

  /** Use a marketplace template — load it as a new design */
  const handleUseMarketplaceTemplate = useCallback((doc: import('@monet/shared').DesignDocument) => {
    autosave.newDesign();
    autosave.setDesignName(doc.name || 'From Marketplace');
    setArtboardDimensions(doc.dimensions.width, doc.dimensions.height);
    engine.fromJSON(doc);
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
      engine.fromJSON(doc);
    }
  }, [autosave, setArtboardDimensions]);

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-50 dark:bg-gray-950">
      <SkipLink />
      <LiveRegion message={autosave.status === 'saved' ? 'Design saved' : autosave.status === 'saving' ? 'Saving design' : ''} />
      <ErrorBoundary name="Toolbar">
      <Toolbar
        onNewDesign={handleNewDesign}
        onExport={() => setExportDialogOpen(true)}
        onSave={autosave.saveNow}
        onMyDesigns={() => setMyDesignsOpen(true)}
        onResize={() => setResizeDialogOpen(true)}
        onSaveFile={handleExportFile}
        onOpenFile={handleImportFile}
        onPublish={() => setPublishOpen(true)}
        onMarketplace={() => setMarketplaceOpen(true)}
        onSaveAsTemplate={() => setSaveTemplateOpen(true)}
        userName={authUser?.name || authUser?.email || null}
        onLogin={() => setAuthModalOpen(true)}
        onLogout={async () => { await logout(); setAuthUser(null); }}
        saveStatus={autosave.status}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        leftSidebarOpen={leftSidebarOpen}
        onToggleLeftSidebar={() => setLeftSidebarOpen((p) => !p)}
        rightSidebarOpen={rightSidebarOpen}
        onToggleRightSidebar={() => setRightSidebarOpen((p) => !p)}
        onShowShortcuts={() => setShortcutSheetOpen(true)}
      />

      {/* Collaboration toolbar — shows when collab session is active */}
      </ErrorBoundary>

      {collab.connected && (
        <div className="flex items-center justify-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-1 dark:border-gray-700 dark:bg-gray-900">
          <CollabToolbar
            users={collab.collabUsers}
            designId={autosave.currentId}
            isConnected={collab.connected}
            followingUserId={collab.followingUserId}
            onFollow={collab.setFollowingUserId}
          />
          <button type="button" onClick={() => collab.setCommentsOpen((p) => !p)}
            className="rounded-md border border-gray-300 px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800">
            Comments ({collab.comments.length})
          </button>
        </div>
      )}

      <main id="canvas-area" className="relative flex flex-1 overflow-hidden">
        {leftSidebarOpen && (
          <ErrorBoundary name="Left Sidebar">
          <div className="z-20 flex-shrink-0 max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:shadow-xl">
            <LeftSidebar />
          </div>
          </ErrorBoundary>
        )}

        <ErrorBoundary name="Canvas">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <Canvas />
          <CursorOverlay cursors={collab.cursors} />
        </div>
        </ErrorBoundary>

        {rightSidebarOpen && (
          <ErrorBoundary name="Right Sidebar">
          <div className="z-20 flex w-64 flex-shrink-0 flex-col overflow-hidden border-l border-gray-200 dark:border-gray-700 max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:bg-white max-lg:shadow-xl max-lg:dark:bg-gray-900">
            <div className="flex-1 overflow-y-auto">
              <PropertiesPanel selection={selection} />
            </div>
            <LayerPanel layers={layers} selectedIndex={getSelectedLayerIndex()} />
          </div>
          </ErrorBoundary>
        )}
      </main>

      <CommentsPanel comments={collab.comments} isOpen={collab.commentsOpen} onClose={() => collab.setCommentsOpen(false)} />

      <BottomBar />

      <TemplateBrowser isOpen={templateBrowserOpen} onClose={() => setTemplateBrowserOpen(false)} />
      <ExportDialog isOpen={exportDialogOpen} onClose={() => setExportDialogOpen(false)} />
      <ShortcutSheet isOpen={shortcutSheetOpen} onClose={() => setShortcutSheetOpen(false)} />
      <MyDesigns isOpen={myDesignsOpen} onClose={() => setMyDesignsOpen(false)} onOpenDesign={handleOpenDesign} />
      <ResizeDialog isOpen={resizeDialogOpen} onClose={() => setResizeDialogOpen(false)} onOpenResized={handleOpenResized} />
      <PublishTemplate isOpen={publishOpen} onClose={() => setPublishOpen(false)} />
      <MarketplaceBrowser isOpen={marketplaceOpen} onClose={() => setMarketplaceOpen(false)} onUseTemplate={handleUseMarketplaceTemplate} />
      {saveTemplateOpen && <SaveTemplateDialog onClose={() => setSaveTemplateOpen(false)} />}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)}
        onLogin={async (user, _token) => {
          setAuthUser(user);
          setAuthModalOpen(false);
          // Sync: push local designs to server, then pull server designs
          await pushAllLocal();
          const conflicts = await pullAndMerge();
          if (conflicts.length > 0) {
            alert(`${conflicts.length} design(s) have conflicting changes. Local versions kept.`);
          }
        }} />
      <Onboarding />
    </div>
  );
}

export default App;
