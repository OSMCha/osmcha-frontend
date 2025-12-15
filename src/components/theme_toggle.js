// @flow
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Button } from './button';

export function ThemeToggle() {
  const context = useContext(ThemeContext);

  if (!context || !context.toggleTheme) {
    // Return a fallback button if context is not available
    return (
      <button className="ml3 btn btn--s" disabled>
        Theme
      </button>
    );
  }

  const { theme, toggleTheme, effectiveTheme } = context;

  const handleClick = () => {
    toggleTheme();
  };

  const getButtonText = () => {
    if (theme === 'auto') {
      return effectiveTheme === 'dark' ? '🌙 Auto (Dark)' : '☀️ Auto (Light)';
    }
    return theme === 'dark' ? '🌙 Dark' : '☀️ Light';
  };

  const getTitle = () => {
    if (theme === 'auto') {
      return 'Currently following system preference. Click to set manual theme.';
    }
    if (theme === 'dark') {
      return 'Currently dark mode. Click to switch to light mode.';
    }
    return 'Currently light mode. Click to switch to dark mode.';
  };

  return (
    <Button onClick={handleClick} className="ml3" title={getTitle()}>
      {getButtonText()}
    </Button>
  );
}
