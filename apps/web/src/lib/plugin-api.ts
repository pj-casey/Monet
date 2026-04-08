/**
 * Plugin API — the typed interface that plugins interact with.
 *
 * Plugins are JavaScript modules with a standard interface:
 *   { name, version, init(api), destroy() }
 *
 * The PluginAPI provides safe, controlled access to:
 * - Canvas operations (add shapes, text, images, SVGs)
 * - Document access (serialize/deserialize the design)
 * - UI registration (add a panel to the Plugins sidebar section)
 *
 * Each plugin registers one or more panels via api.ui.registerPanel().
 * Panels are React components rendered in the Plugins sidebar.
 */

import type { ReactNode } from 'react';
import type { DesignDocument, SelectedObjectProps, ShapeOptions, TextOptions } from '@monet/shared';

// ─── Plugin Interface ─────────────────────────────────────────────

/** The standard plugin module interface */
export interface MonetPlugin {
  /** Unique plugin name */
  name: string;
  /** Semver version */
  version: string;
  /** Called when the plugin is loaded — receives the API */
  init(api: PluginAPI): void | Promise<void>;
  /** Called when the plugin is unloaded — clean up resources */
  destroy(): void;
}

// ─── Plugin API ───────────────────────────────────────────────────

/** The API object passed to each plugin's init() function */
export interface PluginAPI {
  /** Canvas operations — add and manipulate objects */
  canvas: {
    addShape(options: ShapeOptions): void;
    addText(options?: Partial<TextOptions>): void;
    addImageFromUrl(url: string): Promise<void>;
    addSvgFromString(svg: string, color?: string): Promise<void>;
    addIllustration(svg: string): Promise<void>;
    getSelectedProps(): SelectedObjectProps | null;
    updateSelected(props: Partial<{
      fill: string;
      stroke: string;
      strokeWidth: number;
      opacity: number;
    }>): void;
    deleteSelected(): void;
  };

  /** Document operations — read/write the full design */
  document: {
    toJSON(name?: string): DesignDocument;
    fromJSON(doc: DesignDocument): Promise<void>;
    getArtboardDimensions(): { width: number; height: number };
  };

  /** UI operations — register panels in the Plugins sidebar */
  ui: {
    registerPanel(panel: PluginPanel): void;
  };
}

/** A panel registered by a plugin — appears in the Plugins sidebar */
export interface PluginPanel {
  /** Unique panel ID (namespaced: "plugin-name:panel-id") */
  id: string;
  /** Display label shown in the panel header */
  label: string;
  /** Icon shown in the panel list (React node, typically an SVG) */
  icon: ReactNode;
  /** The panel content — a React component */
  component: React.ComponentType;
}
