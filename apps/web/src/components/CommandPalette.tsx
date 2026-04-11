/**
 * CommandPalette — Raycast/Linear-style floating command bar.
 *
 * Opens on `/` or `Cmd+K`. Accepts both built-in commands (export, resize, etc.)
 * and AI prompts (anything else → smart edit via Claude).
 *
 * Built-in commands work without an API key. AI commands require a configured key.
 * Shows ✨AI badge for AI commands, ⌘ badge for built-in.
 * Command history accessible via up arrow.
 * Streaming status shown inline while Claude processes.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { engine } from './Canvas';
import { isAIConfigured, smartEdit } from '../lib/ai-assistant';

// ─── Built-in commands ──────────────────────────────────────────────

interface BuiltinCommand {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  action: string;
}

const BUILTIN_COMMANDS: BuiltinCommand[] = [
  { id: 'export', label: 'Export', description: 'Export design as PNG, PDF, or SVG', keywords: ['export', 'download', 'save as', 'png', 'pdf', 'svg'], action: 'export' },
  { id: 'resize', label: 'Magic Resize', description: 'Resize design to different formats', keywords: ['resize', 'magic resize', 'dimensions', 'size'], action: 'resize' },
  { id: 'my-designs', label: 'My Designs', description: 'Browse your saved designs', keywords: ['my designs', 'saved', 'open', 'browse'], action: 'myDesigns' },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', description: 'View all keyboard shortcuts', keywords: ['shortcuts', 'keyboard', 'keys', 'hotkeys'], action: 'shortcuts' },
  { id: 'templates', label: 'Template Browser', description: 'Browse and use templates', keywords: ['templates', 'template', 'browse templates'], action: 'templates' },
  { id: 'new', label: 'New Design', description: 'Start a new blank design', keywords: ['new', 'new design', 'blank', 'create'], action: 'new' },
  { id: 'dark-mode', label: 'Dark Mode', description: 'Switch to dark mode', keywords: ['dark mode', 'dark', 'night'], action: 'darkMode' },
  { id: 'light-mode', label: 'Light Mode', description: 'Switch to light mode', keywords: ['light mode', 'light', 'day'], action: 'lightMode' },
];

// ─── Props ──────────────────────────────────────────────────────────

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onResize: () => void;
  onMyDesigns: () => void;
  onShortcuts: () => void;
  onTemplates: () => void;
  onNew: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

// ─── Command history (persists across open/close, not across page loads) ────
const commandHistory: string[] = [];

export function CommandPalette({
  isOpen, onClose, onExport, onResize, onMyDesigns, onShortcuts,
  onTemplates, onNew, isDark, onToggleTheme,
}: CommandPaletteProps) {
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [streamStatus, setStreamStatus] = useState('');
  const [error, setError] = useState('');
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      setInput('');
      setError('');
      setStreamStatus('');
      setHistoryIdx(-1);
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Match built-in commands
  const query = input.trim().toLowerCase();
  const matchedCommands = query
    ? BUILTIN_COMMANDS.filter((cmd) =>
        cmd.keywords.some((kw) => kw.includes(query)) || cmd.label.toLowerCase().includes(query),
      )
    : BUILTIN_COMMANDS;

  const isAICommand = query.length > 0 && matchedCommands.length === 0;
  const hasAIKey = isAIConfigured();

  // Execute a built-in command
  const executeBuiltin = useCallback((cmd: BuiltinCommand) => {
    switch (cmd.action) {
      case 'export': onExport(); break;
      case 'resize': onResize(); break;
      case 'myDesigns': onMyDesigns(); break;
      case 'shortcuts': onShortcuts(); break;
      case 'templates': onTemplates(); break;
      case 'new': onNew(); break;
      case 'darkMode': if (!isDark) onToggleTheme(); break;
      case 'lightMode': if (isDark) onToggleTheme(); break;
    }
    commandHistory.unshift(input.trim());
    if (commandHistory.length > 20) commandHistory.pop();
    onClose();
  }, [input, isDark, onClose, onExport, onMyDesigns, onNew, onResize, onShortcuts, onTemplates, onToggleTheme]);

  // Execute an AI command (smart edit)
  const executeAI = useCallback(async () => {
    if (!hasAIKey || !query) return;

    setProcessing(true);
    setStreamStatus('Sending to Claude...');
    setError('');

    try {
      const currentDoc = engine.toJSON();
      setStreamStatus('Claude is editing your design...');

      engine.saveHistoryCheckpoint();
      const result = await smartEdit(currentDoc, query);
      await engine.fromJSON(result);

      commandHistory.unshift(input.trim());
      if (commandHistory.length > 20) commandHistory.pop();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI edit failed. Try again.');
      setStreamStatus('');
    } finally {
      setProcessing(false);
    }
  }, [hasAIKey, query, input, onClose]);

  // Handle Enter, Escape, Up/Down
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isAICommand) {
        // Navigate command history
        const nextIdx = Math.min(historyIdx + 1, commandHistory.length - 1);
        if (commandHistory[nextIdx]) {
          setHistoryIdx(nextIdx);
          setInput(commandHistory[nextIdx]);
        }
      } else {
        setSelectedIdx((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (isAICommand) {
        const nextIdx = historyIdx - 1;
        if (nextIdx < 0) {
          setHistoryIdx(-1);
          setInput('');
        } else {
          setHistoryIdx(nextIdx);
          setInput(commandHistory[nextIdx]);
        }
      } else {
        setSelectedIdx((prev) => Math.min(matchedCommands.length - 1, prev + 1));
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (processing) return;
      if (!isAICommand && matchedCommands.length > 0) {
        executeBuiltin(matchedCommands[selectedIdx] || matchedCommands[0]);
      } else if (isAICommand) {
        executeAI();
      }
    }
  }, [isAICommand, matchedCommands, selectedIdx, historyIdx, processing, executeBuiltin, executeAI, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      onClick={(e) => { if (e.target === e.currentTarget && !processing) onClose(); }}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Palette */}
      <div className="relative z-10 w-[560px] animate-scale-up overflow-hidden rounded-lg bg-overlay shadow-xl">
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          {/* Mode badge */}
          <span className={`flex h-6 min-w-[2rem] items-center justify-center rounded-md px-1.5 text-[10px] font-semibold ${
            isAICommand
              ? 'bg-accent-subtle text-accent'
              : 'bg-wash text-text-tertiary'
          }`}>
            {isAICommand ? '✨ AI' : '⌘'}
          </span>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setSelectedIdx(0); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or describe a design change..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
            disabled={processing}
            autoComplete="off"
            spellCheck={false}
          />

          {processing && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          )}
        </div>

        {/* Streaming status */}
        {streamStatus && (
          <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs text-text-secondary">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {streamStatus}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border-b border-border px-4 py-2 text-xs text-danger">{error}</div>
        )}

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto py-1">
          {!isAICommand && matchedCommands.map((cmd, i) => (
            <button
              key={cmd.id}
              type="button"
              onClick={() => executeBuiltin(cmd)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${
                i === selectedIdx ? 'bg-accent-subtle' : 'hover:bg-wash'
              }`}
            >
              <span className="text-sm text-text-primary">{cmd.label}</span>
              <span className="text-xs text-text-tertiary">{cmd.description}</span>
            </button>
          ))}

          {isAICommand && !processing && (
            <div className="px-4 py-3">
              {hasAIKey ? (
                <p className="text-xs text-text-secondary">
                  Press <kbd className="mx-0.5 rounded-sm border border-border px-1 py-0.5 text-[10px]">Enter</kbd> to send to Claude as a Smart Edit
                </p>
              ) : (
                <p className="text-xs text-text-tertiary">
                  Connect Claude to use AI commands.
                  <br />
                  <span className="text-text-secondary">Open the AI tab in the sidebar to add your API key.</span>
                </p>
              )}
            </div>
          )}

          {query === '' && (
            <div className="px-4 pb-2 pt-1">
              <p className="text-[10px] text-text-tertiary">
                {hasAIKey
                  ? 'Type a command or describe a change — AI will edit your design.'
                  : 'Type a command to get started. Connect Claude for AI features.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-text-tertiary">
          <span>↑↓ Navigate · Enter Select · Esc Close</span>
          <span>/ or ⌘K to open</span>
        </div>
      </div>
    </div>
  );
}
