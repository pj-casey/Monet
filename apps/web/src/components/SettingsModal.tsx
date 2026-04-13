/**
 * SettingsModal — centralized settings for API keys and preferences.
 *
 * Manages Anthropic, Unsplash, and Pexels API keys in localStorage.
 * Accessible from the toolbar overflow menu or Ctrl+, shortcut.
 */

import { useState, useCallback, useEffect } from 'react';
import { FocusTrap } from './A11y';
import { useEscapeClose } from '../hooks/use-escape-close';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KEY_CONFIGS = [
  {
    id: 'monet-anthropic-key',
    label: 'Anthropic API Key',
    desc: 'Powers AI design assistant, copy suggestions, and background removal.',
    placeholder: 'sk-ant-...',
    link: 'https://console.anthropic.com',
    linkLabel: 'Get a key at console.anthropic.com',
  },
  {
    id: 'monet-unsplash-key',
    label: 'Unsplash Access Key',
    desc: 'Enables stock photo search in the Elements panel.',
    placeholder: 'Access Key',
    link: 'https://unsplash.com/developers',
    linkLabel: 'Get a key at unsplash.com/developers',
  },
  {
    id: 'monet-pexels-key',
    label: 'Pexels API Key',
    desc: 'Alternative stock photo source.',
    placeholder: 'API Key',
    link: 'https://www.pexels.com/api',
    linkLabel: 'Get a key at pexels.com/api',
  },
] as const;

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  useEscapeClose(isOpen, onClose);
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  // Load current keys on open
  useEffect(() => {
    if (!isOpen) return;
    const loaded: Record<string, string> = {};
    for (const cfg of KEY_CONFIGS) {
      loaded[cfg.id] = localStorage.getItem(cfg.id) || '';
    }
    setKeys(loaded);
    setSaved(false);
  }, [isOpen]);

  const handleSave = useCallback(() => {
    for (const cfg of KEY_CONFIGS) {
      const val = keys[cfg.id]?.trim() || '';
      if (val) {
        localStorage.setItem(cfg.id, val);
      } else {
        localStorage.removeItem(cfg.id);
      }
    }
    // Dispatch a custom event so components can re-check their API key state
    window.dispatchEvent(new Event('monet-settings-changed'));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [keys]);

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <FocusTrap>
      <div className="animate-scale-up w-full max-w-md rounded-lg bg-overlay p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
          <button type="button" onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-text-tertiary hover:bg-wash"
            aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mb-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            API Keys
          </h3>
          <p className="mb-4 text-[11px] leading-relaxed text-text-tertiary">
            Keys are stored in your browser only and never sent anywhere except the service they belong to.
          </p>

          <div className="flex flex-col gap-4">
            {KEY_CONFIGS.map((cfg) => {
              const val = keys[cfg.id] || '';
              const hasKey = !!val;
              const isVisible = visible[cfg.id] || false;

              return (
                <div key={cfg.id}>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-text-primary">
                    {cfg.label}
                    {hasKey && (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-success">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                        <path d="m5 8 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </label>
                  <p className="mb-1.5 text-[10px] text-text-tertiary">{cfg.desc}</p>
                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        value={val}
                        onChange={(e) => setKeys({ ...keys, [cfg.id]: e.target.value })}
                        placeholder={cfg.placeholder}
                        className="w-full rounded-sm border border-border bg-canvas px-2.5 py-1.5 pr-8 font-mono text-xs text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setVisible({ ...visible, [cfg.id]: !isVisible })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                        aria-label={isVisible ? 'Hide key' : 'Show key'}
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                          {isVisible ? (
                            <><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5S1 8 1 8z" /><circle cx="8" cy="8" r="2" /></>
                          ) : (
                            <><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5S1 8 1 8z" /><path d="M2 14 14 2" strokeWidth="1.5" /></>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                  <a href={cfg.link} target="_blank" rel="noopener noreferrer"
                    className="mt-1 inline-block text-[10px] text-accent hover:text-accent-hover hover:underline">
                    {cfg.linkLabel}
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-success">{saved ? 'Settings saved' : ''}</span>
          <button type="button" onClick={handleSave}
            className="rounded-sm bg-accent px-4 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover">
            Save
          </button>
        </div>
      </div>
      </FocusTrap>
    </div>
  );
}
