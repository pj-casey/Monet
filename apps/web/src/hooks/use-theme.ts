/**
 * useTheme — manages dark/light mode with localStorage persistence.
 *
 * How it works:
 * 1. On first load, checks localStorage for a saved preference
 * 2. If none, respects the system preference (prefers-color-scheme)
 * 3. Adds/removes the "dark" class on <html>, which Tailwind uses
 *    to activate dark: variant classes
 * 4. Saves the preference to localStorage when toggled
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'monet-theme';

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(getInitialTheme);

  // Apply the dark class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDark = theme === 'dark';

  return { theme, isDark, toggleTheme };
}
