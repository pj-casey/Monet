/**
 * PluginsPanel — sidebar panel showing all enabled plugin panels.
 *
 * Reads registered panels from the PluginManager and renders them
 * in an accordion-style layout. Each plugin's panel component is
 * rendered inside a collapsible section with its icon and label.
 */

import { useState, useEffect } from 'react';
import { pluginManager } from '../lib/plugin-manager';
import type { PluginPanel } from '../lib/plugin-api';

export function PluginsPanel() {
  const [panels, setPanels] = useState<PluginPanel[]>(pluginManager.getPanels());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Subscribe to panel changes
  useEffect(() => {
    const unsub = pluginManager.onPanelsChange(() => {
      setPanels(pluginManager.getPanels());
    });
    // Re-read panels in case they changed before subscribing
    setPanels(pluginManager.getPanels());
    return unsub;
  }, []);

  // Auto-expand first panel if none expanded
  useEffect(() => {
    if (expandedId === null && panels.length > 0) {
      setExpandedId(panels[0].id);
    }
  }, [panels, expandedId]);

  if (panels.length === 0) {
    return (
      <div className="w-48 border-r border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Plugins
        </h3>
        <p className="text-[10px] text-gray-400">No plugins loaded.</p>
      </div>
    );
  }

  return (
    <div className="w-56 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="p-3 pb-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Plugins
        </h3>
      </div>

      {panels.map((panel) => {
        const isExpanded = expandedId === panel.id;
        const PanelComponent = panel.component;

        return (
          <div key={panel.id} className="border-b border-gray-100 dark:border-gray-800">
            {/* Accordion header */}
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : panel.id)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="text-gray-500 dark:text-gray-400">{panel.icon}</span>
              <span className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                {panel.label}
              </span>
              <span className="text-[10px] text-gray-400">
                {isExpanded ? '\u25B2' : '\u25BC'}
              </span>
            </button>

            {/* Accordion content */}
            {isExpanded && (
              <div className="px-3 pb-3">
                <PanelComponent />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
