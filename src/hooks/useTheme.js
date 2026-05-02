import { useState, useEffect } from 'react';

const THEME_KEY = 'clocker_theme';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return { theme, toggle };
};
