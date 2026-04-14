/**
 * AuthModal — login/signup modal for optional cloud features.
 *
 * The editor works fully without logging in ("Continue as guest").
 * Logging in enables cloud sync, sharing, and multi-device access.
 *
 * Supports:
 * - Email/password signup and login
 * - Toggle between signup and login forms
 * - Error messages from the API
 * - "Continue as guest" button to close without logging in
 */

import { useState } from 'react';
import { FocusTrap } from './A11y';
import { useEscapeClose } from '../hooks/use-escape-close';

const API_BASE = 'http://localhost:3001';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser, token: string) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  useEscapeClose(isOpen, onClose);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body = mode === 'signup'
        ? { email, password, name }
        : { email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      onLogin(data.user, data.token);
      onClose();
    } catch {
      setError('Cannot connect to server. Is the API running? (pnpm dev:api)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="Login or sign up"
    >
      <FocusTrap>
      <div className="w-full max-w-sm animate-scale-up rounded-lg bg-overlay p-6 shadow-xl">
        <h2 className="mb-1 text-lg font-semibold text-text-primary">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="mb-4 text-xs text-text-tertiary">
          {mode === 'login'
            ? 'Log in to sync your designs across devices'
            : 'Sign up for cloud sync and sharing'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <input
              type="text" placeholder="Name (optional)" value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            />
          )}

          <input
            type="email" placeholder="Email" value={email} required
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />

          <input
            type="password" placeholder="Password (min 8 chars)" value={password} required
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />

          {error && (
            <p className="rounded bg-danger-subtle px-3 py-2 text-xs text-danger">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-3 flex flex-col gap-2">
          <button type="button"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="text-xs text-accent hover:underline">
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>

          <button type="button" onClick={onClose}
            className="text-xs text-text-tertiary hover:underline">
            Continue as guest
          </button>
        </div>
      </div>
      </FocusTrap>
    </div>
  );
}

/**
 * Check if the user is currently logged in.
 * Calls GET /api/auth/me — returns the user or null.
 */
export async function checkAuth(): Promise<{ user: AuthUser | null; reachable: boolean }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: 'include',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return { user: null, reachable: true };
    const data = await res.json();
    return { user: data.user ?? null, reachable: true };
  } catch {
    return { user: null, reachable: false }; // Server not running or timeout — guest mode
  }
}

/** Log out the current user */
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Server not running — clear local state anyway
  }
}
