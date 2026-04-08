/**
 * AIGenerateDialog — dialog for generating designs with AI.
 *
 * "Bring Your Own Key" model — users connect their own Anthropic
 * account by pasting their API key. The key is stored in localStorage
 * (never leaves the browser except to api.anthropic.com directly).
 *
 * Two states:
 * 1. No key saved → shows a simple "Connect your Claude account" form
 * 2. Key saved → shows the design prompt input with example chips
 */

import { useState, useCallback } from 'react';
import {
  generateDesign,
  isAIConfigured,
  saveApiKey,
  clearApiKey,
  EXAMPLE_PROMPTS,
} from '../lib/ai-generate';
import { engine } from './Canvas';
import { useEditorStore } from '../stores/editor-store';

interface AIGenerateDialogProps {
  onClose: () => void;
}

export function AIGenerateDialog({ onClose }: AIGenerateDialogProps) {
  const [connected, setConnected] = useState(isAIConfigured());
  const [keyInput, setKeyInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setArtboardDimensions = useEditorStore((s) => s.setArtboardDimensions);

  const handleConnect = useCallback(() => {
    if (!keyInput.trim()) return;
    saveApiKey(keyInput);
    setConnected(true);
    setKeyInput('');
    setError('');
  }, [keyInput]);

  const handleDisconnect = useCallback(() => {
    clearApiKey();
    setConnected(false);
    setError('');
  }, []);

  const handleGenerate = useCallback(async (description: string) => {
    if (!description.trim()) return;

    setLoading(true);
    setError('');

    try {
      const doc = await generateDesign(description);
      setArtboardDimensions(doc.dimensions.width, doc.dimensions.height);
      await engine.fromJSON(doc);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate design.';
      // If the API returns 401, the key is invalid
      if (msg.includes('401')) {
        setError('Invalid API key. Please check your key and try again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [onClose, setArtboardDimensions]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Generate design with AI"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Generate with AI
          </h2>
          <button type="button" onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close">
            &times;
          </button>
        </div>

        {!connected ? (
          /* ─── Connect Account ─────────────────────────────── */
          <div>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
              Connect your Anthropic account to generate designs with Claude.
              Your API key stays in your browser — it's never sent to our servers.
            </p>

            <div className="mb-3 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>How to get a key:</strong> Go to{' '}
                <span className="font-medium">console.anthropic.com</span>
                {' '}&rarr; Settings &rarr; API Keys &rarr; Create Key
              </p>
              <p className="mt-1 text-[10px] text-blue-600 dark:text-blue-400">
                Each design costs about $0.01–0.03 and is billed to your Anthropic account.
              </p>
            </div>

            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Your Anthropic API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConnect(); }}
              placeholder="sk-ant-..."
              className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              aria-label="Anthropic API key"
              autoFocus
            />

            <div className="flex gap-2">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button type="button" onClick={handleConnect}
                disabled={!keyInput.trim()}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                Connect
              </button>
            </div>
          </div>
        ) : (
          /* ─── Generate Design ─────────────────────────────── */
          <div>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Describe the design you want and Claude will generate it. Be specific about colors, style, and content.
            </p>

            {/* Prompt input */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Instagram post announcing a summer sale with bold red colors and modern fonts"
              className="mb-3 h-24 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
              disabled={loading}
              aria-label="Design description"
              autoFocus
            />

            {/* Quick-select chips */}
            <div className="mb-4">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Try an example
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_PROMPTS.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setPrompt(example);
                      if (!loading) handleGenerate(example);
                    }}
                    disabled={loading}
                    className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Generating your design...
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} disabled={loading}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button type="button" onClick={() => handleGenerate(prompt)}
                disabled={loading || !prompt.trim()}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {/* Disconnect */}
            <button type="button" onClick={handleDisconnect}
              className="mt-3 w-full text-center text-[10px] text-gray-400 hover:text-red-500 dark:hover:text-red-400">
              Disconnect Claude account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
