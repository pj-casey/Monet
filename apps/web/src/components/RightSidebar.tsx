/**
 * RightSidebar — contextual properties panel that slides in from the right
 * only when an object is selected on the canvas.
 *
 * Contains two tabs:
 * 1. Properties: all object properties (fill, stroke, text, filters, etc.)
 * 2. Layers: layer list with reorder/lock/visibility controls
 *
 * When nothing is selected, this sidebar is hidden, giving more canvas space.
 * Uses CSS transitions for smooth slide-in/out (200ms ease-out).
 */

import { useState } from 'react';
import type { SelectedObjectProps, LayerInfo } from '@monet/shared';
import { PropertiesPanel } from './PropertiesPanel';
import { LayerPanel } from './LayerPanel';

interface RightSidebarProps {
  selection: SelectedObjectProps | null;
  layers: LayerInfo[];
  selectedIndex: number;
}

export function RightSidebar({ selection, layers, selectedIndex }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
  const isVisible = selection !== null;

  return (
    <div
      className={`z-20 flex flex-shrink-0 flex-col overflow-hidden border-l border-border bg-surface shadow-sm transition-[width,opacity,border-width] duration-300 ease-in-out max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:shadow-xl ${
        isVisible ? 'w-64 opacity-100' : 'w-0 border-l-0 opacity-0'
      }`}
    >
      {isVisible && (
        <div className="animate-fade-in flex h-full flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-border px-1">
            <button
              type="button"
              onClick={() => setActiveTab('properties')}
              className={`flex-1 border-b-2 py-2.5 text-xs font-medium transition-colors ${
                activeTab === 'properties'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Properties
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('layers')}
              className={`flex-1 border-b-2 py-2.5 text-xs font-medium transition-colors ${
                activeTab === 'layers'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Layers
            </button>
          </div>

          {/* Content */}
          {activeTab === 'properties' && (
            <div className="flex-1 overflow-y-auto">
              <PropertiesPanel selection={selection} />
            </div>
          )}
          {activeTab === 'layers' && (
            <div className="flex-1 overflow-y-auto">
              <LayerPanel layers={layers} selectedIndex={selectedIndex} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
