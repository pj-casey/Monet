/**
 * QR Code Plugin — generates QR codes and inserts them onto the canvas.
 *
 * User types a URL or text, plugin generates an SVG QR code via the
 * `qrcode` library, and inserts it as an editable SVG group on the canvas.
 */

import { useState, useCallback } from 'react';
import QRCode from 'qrcode';
import type { MonetPlugin, PluginAPI } from '../lib/plugin-api';

let pluginAPI: PluginAPI | null = null;

function QRCodePanel() {
  const [input, setInput] = useState('https://example.com');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!pluginAPI || !input.trim()) return;
    setGenerating(true);

    try {
      const svg = await QRCode.toString(input.trim(), {
        type: 'svg',
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
      await pluginAPI.canvas.addIllustration(svg);
    } catch (err) {
      console.error('QR Code generation failed:', err);
    } finally {
      setGenerating(false);
    }
  }, [input]);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">
        URL or Text
      </label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
        placeholder="https://example.com"
        className="mb-2 w-full rounded border border-border px-2 py-1.5 text-xs"
      />
      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating || !input.trim()}
        className="w-full rounded bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-50"
      >
        {generating ? 'Generating...' : 'Insert QR Code'}
      </button>
    </div>
  );
}

export const qrCodePlugin: MonetPlugin = {
  name: 'QR Code Generator',
  version: '1.0.0',
  init(api) {
    pluginAPI = api;
    api.ui.registerPanel({
      id: 'qr-code:main',
      label: 'QR Code',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="3" height="3" /><rect x="5" y="1" width="1" height="1" />
          <rect x="1" y="5" width="1" height="1" /><rect x="3" y="5" width="1" height="1" />
          <rect x="5" y="3" width="1" height="1" /><rect x="5" y="5" width="1" height="1" />
          <rect x="8" y="1" width="1" height="1" /><rect x="10" y="1" width="1" height="1" />
          <rect x="12" y="1" width="3" height="3" /><rect x="12" y="5" width="1" height="1" />
          <rect x="14" y="5" width="1" height="1" /><rect x="1" y="12" width="3" height="3" />
          <rect x="1" y="10" width="1" height="1" /><rect x="5" y="12" width="1" height="1" />
        </svg>
      ),
      component: QRCodePanel,
    });
  },
  destroy() {
    pluginAPI = null;
  },
};
