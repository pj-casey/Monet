/**
 * PluginManager — loads, initializes, and manages plugins.
 *
 * Creates the PluginAPI bridge from the canvas engine singleton
 * and passes it to each plugin's init() function. Tracks registered
 * panels so the UI can render them.
 *
 * Usage:
 *   import { pluginManager } from './plugin-manager';
 *   pluginManager.register(myPlugin);
 *   pluginManager.initAll();
 *   const panels = pluginManager.getPanels();
 */

import { engine } from '../components/Canvas';
import type { MonetPlugin, PluginAPI, PluginPanel } from './plugin-api';
import { useEditorStore } from '../stores/editor-store';

/** All registered plugins */
const plugins: MonetPlugin[] = [];

/** All panels registered by plugins */
const panels: PluginPanel[] = [];

/** Track which plugins have been initialized */
const initialized = new Set<string>();

/** Listeners for panel changes */
const listeners: Array<() => void> = [];

function notifyListeners(): void {
  for (const fn of listeners) fn();
}

/**
 * Create the PluginAPI bridge from the engine singleton.
 * This gives plugins controlled access to canvas operations.
 */
function createAPI(): PluginAPI {
  return {
    canvas: {
      addShape: (options) => engine.addShape(options),
      addText: (options) => engine.addText(options),
      addImageFromUrl: (url) => engine.addImageFromUrl(url),
      addSvgFromString: (svg, color) => engine.addSvgFromString(svg, color),
      addIllustration: (svg) => engine.addIllustration(svg),
      getSelectedProps: () => engine.getSelectedObjectProps(),
      updateSelected: (props) => engine.updateSelectedObject(props),
      deleteSelected: () => engine.deleteSelectedObjects(),
    },
    document: {
      toJSON: (name) => engine.toJSON(name),
      fromJSON: (doc) => engine.fromJSON(doc),
      getArtboardDimensions: () => {
        const store = useEditorStore.getState();
        return { width: store.artboardWidth, height: store.artboardHeight };
      },
    },
    ui: {
      registerPanel: (panel) => {
        // Avoid duplicate panels
        if (!panels.some((p) => p.id === panel.id)) {
          panels.push(panel);
          notifyListeners();
        }
      },
    },
  };
}

// ─── Public API ─────────────────────────────────────────────────

export const pluginManager = {
  /** Register a plugin (does not initialize it yet) */
  register(plugin: MonetPlugin): void {
    if (!plugins.some((p) => p.name === plugin.name)) {
      plugins.push(plugin);
    }
  },

  /** Initialize all registered plugins that haven't been initialized */
  async initAll(): Promise<void> {
    const api = createAPI();
    for (const plugin of plugins) {
      if (initialized.has(plugin.name)) continue;
      try {
        await plugin.init(api);
        initialized.add(plugin.name);
      } catch (err) {
        console.error(`Plugin "${plugin.name}" failed to initialize:`, err);
      }
    }
  },

  /** Destroy all plugins and clear panels */
  destroyAll(): void {
    for (const plugin of plugins) {
      try {
        plugin.destroy();
      } catch {
        // Non-critical
      }
    }
    initialized.clear();
    panels.length = 0;
    notifyListeners();
  },

  /** Get all registered panels */
  getPanels(): PluginPanel[] {
    return [...panels];
  },

  /** Get all registered plugin names and versions */
  getPlugins(): Array<{ name: string; version: string }> {
    return plugins.map((p) => ({ name: p.name, version: p.version }));
  },

  /** Subscribe to panel changes (returns unsubscribe function) */
  onPanelsChange(fn: () => void): () => void {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  },
};
