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
import { FocusTrap } from './A11y';
import { useEscapeClose } from '../hooks/use-escape-close';
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
  useEscapeClose(true, onClose);
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
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <FocusTrap>
      <div
        className="animate-scale-up mx-4 w-full max-w-lg rounded-lg bg-overlay p-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Generate design with AI"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Generate with AI
          </h2>
          <button type="button" onClick={onClose}
            className="text-text-tertiary hover:text-text-secondary"
            aria-label="Close">
            &times;
          </button>
        </div>

        {!connected ? (
          /* ─── Connect Account ─────────────────────────────── */
          <div>
            <p className="mb-3 text-sm text-text-secondary">
              Connect your Anthropic account to generate designs with Claude.
              Your API key stays in your browser — it's never sent to our servers.
            </p>

            <div className="mb-3 rounded-lg bg-accent-subtle px-3 py-2">
              <p className="text-xs text-accent">
                <strong>How to get a key:</strong> Go to{' '}
                <span className="font-medium">console.anthropic.com</span>
                {' '}&rarr; Settings &rarr; API Keys &rarr; Create Key
              </p>
              <p className="mt-1 text-[10px] text-accent">
                Each design costs about $0.01–0.03 and is billed to your Anthropic account.
              </p>
            </div>

            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Your Anthropic API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConnect(); }}
              placeholder="sk-ant-..."
              className="mb-3 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
              aria-label="Anthropic API key"
              autoFocus
            />

            <div className="flex gap-2">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-text-secondary hover:bg-canvas">
                Cancel
              </button>
              <button type="button" onClick={handleConnect}
                disabled={!keyInput.trim()}
                className="flex-1 rounded-lg bg-accent py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-50">
                Connect
              </button>
            </div>
          </div>
        ) : (
          /* ─── Generate Design ─────────────────────────────── */
          <div>
            <p className="mb-3 text-xs text-text-secondary">
              Describe the design you want and Claude will generate it. Be specific about colors, style, and content.
            </p>

            {/* Prompt input */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Instagram post announcing a summer sale with bold red colors and modern fonts"
              className="mb-3 h-24 w-full resize-none rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
              disabled={loading}
              aria-label="Design description"
              autoFocus
            />

            {/* Quick-select chips */}
            <div className="mb-4">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-text-tertiary">
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
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] text-text-secondary hover:border-accent hover:bg-accent-subtle hover:text-accent disabled:opacity-50"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 rounded-lg bg-danger-subtle px-3 py-2 text-xs text-danger">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-accent-subtle px-3 py-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="text-xs text-accent">
                  Generating your design...
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} disabled={loading}
                className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-text-secondary hover:bg-canvas disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={() => handleGenerate(prompt)}
                disabled={loading || !prompt.trim()}
                className="flex-1 rounded-lg bg-accent py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-50">
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {/* Disconnect */}
            <button type="button" onClick={handleDisconnect}
              className="mt-3 w-full text-center text-[10px] text-text-tertiary hover:text-danger">
              Disconnect Claude account
            </button>
          </div>
        )}
      </div>
      </FocusTrap>
    </div>
  );
}
