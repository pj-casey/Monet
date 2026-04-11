/**
 * useTheme — manages dark/light mode.
 *
 * ARCHITECTURE (final, bullet-proof):
 * - <html class="dark"> is baked into index.html. That's the default. Period.
 * - This hook reads the class on mount and toggles it in memory.
 * - NO localStorage. No persistence. No migration. No stale values.
 * - Every page load starts dark. Toggle works within the session.
 * - Nothing else in the codebase can accidentally override the theme.
 *
 * Why no persistence? Because every previous attempt to persist the theme
 * via localStorage was defeated by: migration scripts re-writing the key,
 * useEffect firing on mount and persisting transient states, HMR glitches,
 * and race conditions. The only way to guarantee dark-by-default is to
 * not store the preference at all. If we ever need persistence, it should
 * go through the server/account settings, not localStorage.
 */

import { useState, useEffect, useCallback } from 'react';

function readThemeFromDOM(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(readThemeFromDOM);

  // Sync <html> class whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDark = theme === 'dark';

  return { theme, isDark, toggleTheme };
}
