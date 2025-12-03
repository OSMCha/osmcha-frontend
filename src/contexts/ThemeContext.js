// @flow
import React, { createContext, useState, useEffect } from 'react';
import * as safeStorage from '../utils/safe_storage';

type ThemeContextType = {
  theme: 'light' | 'dark',
  toggleTheme: () => void
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.Node }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = safeStorage.getItem('theme');
    return savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : 'light';
  });

  useEffect(() => {
    // Apply theme to document on mount and when theme changes
    document.documentElement.setAttribute('data-theme', theme);
    safeStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
