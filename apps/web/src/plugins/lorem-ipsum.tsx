/**
 * Lorem Ipsum Plugin — inserts placeholder text onto the canvas.
 *
 * One-click insertion of lorem ipsum paragraphs in various lengths.
 * Useful for testing layouts before real content is ready.
 */

import { useCallback } from 'react';
import type { MonetPlugin, PluginAPI } from '../lib/plugin-api';

let pluginAPI: PluginAPI | null = null;

const PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.',
];

const PRESETS = [
  { label: 'Short (1 sentence)', lines: 1, size: 20 },
  { label: 'Medium (2 paragraphs)', lines: 2, size: 18 },
  { label: 'Long (4 paragraphs)', lines: 4, size: 16 },
  { label: 'Heading', lines: 0, size: 48 },
  { label: 'Subheading', lines: 0, size: 28 },
];

function LoremIpsumPanel() {
  const handleInsert = useCallback((preset: typeof PRESETS[number]) => {
    if (!pluginAPI) return;

    if (preset.lines === 0) {
      // Heading/subheading — just a short phrase
      const text = preset.label === 'Heading'
        ? 'Lorem Ipsum Dolor'
        : 'Sed ut perspiciatis unde omnis';
      pluginAPI.canvas.addText({
        text,
        fontSize: preset.size,
        fontWeight: preset.label === 'Heading' ? 'bold' : 'normal',
        fontFamily: preset.label === 'Heading' ? 'Inter' : 'Inter',
      });
    } else {
      const text = PARAGRAPHS.slice(0, preset.lines).join('\n\n');
      pluginAPI.canvas.addText({
        text,
        fontSize: preset.size,
        fontFamily: 'Inter',
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      {PRESETS.map((preset) => (
        <button
          key={preset.label}
          type="button"
          onClick={() => handleInsert(preset)}
          className="w-full rounded border border-border px-2 py-1.5 text-left text-xs text-text-secondary hover:border-accent hover:bg-accent-subtle"
        >
          {preset.label}
        </button>
      ))}
      <p className="mt-1 text-[10px] text-text-tertiary">
        Click to insert placeholder text onto the canvas.
      </p>
    </div>
  );
}

export const loremIpsumPlugin: MonetPlugin = {
  name: 'Lorem Ipsum',
  version: '1.0.0',
  init(api) {
    pluginAPI = api;
    api.ui.registerPanel({
      id: 'lorem-ipsum:main',
      label: 'Lorem Ipsum',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="2" y1="3" x2="14" y2="3" /><line x1="2" y1="6.5" x2="14" y2="6.5" />
          <line x1="2" y1="10" x2="10" y2="10" /><line x1="2" y1="13.5" x2="12" y2="13.5" />
        </svg>
      ),
      component: LoremIpsumPanel,
    });
  },
  destroy() {
    pluginAPI = null;
  },
};
