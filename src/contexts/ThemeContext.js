// @flow
import React, { createContext, useState, useEffect } from 'react';
import * as safeStorage from '../utils/safe_storage';

type ThemeContextType = {
  theme: 'light' | 'dark' | 'auto',
  toggleTheme: () => void,
  effectiveTheme: 'light' | 'dark'
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'auto',
  toggleTheme: () => {},
  effectiveTheme: 'light'
});

export function ThemeProvider({ children }: { children: React.Node }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(() => {
    const savedTheme = safeStorage.getItem('theme');
    return savedTheme === 'dark' ||
      savedTheme === 'light' ||
      savedTheme === 'auto'
      ? savedTheme
      : 'auto';
  });

  // Detect system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  };

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    const initialTheme = theme || safeStorage.getItem('theme') || 'auto';
    if (initialTheme === 'auto') {
      return getSystemTheme();
    }
    return initialTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    // Update effective theme when theme preference changes
    if (theme === 'auto') {
      const systemTheme = getSystemTheme();
      setEffectiveTheme(systemTheme);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      // Auto mode - remove data-theme to let prefers-color-scheme work
      document.documentElement.removeAttribute('data-theme');
    }
    safeStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'auto') return 'dark';
      if (prevTheme === 'dark') return 'light';
      return 'auto';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
