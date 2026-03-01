import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [uiStyle, setUiStyle] = useState(() => {
    const savedStyle = localStorage.getItem('uiStyle');
    return savedStyle || 'block'; // 'block' (new) or 'soft' (old)
  });

  // Handle Dark/Light Mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle Soft/Block UI Style
  useEffect(() => {
    const root = document.documentElement;
    if (uiStyle === 'block') {
      root.classList.add('ui-block');
      root.classList.remove('ui-soft');
    } else {
      root.classList.add('ui-soft');
      root.classList.remove('ui-block');
    }
    localStorage.setItem('uiStyle', uiStyle);
  }, [uiStyle]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleUiStyle = () => {
    setUiStyle(prev => prev === 'soft' ? 'block' : 'soft');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    uiStyle,
    toggleUiStyle,
    isBlock: uiStyle === 'block'
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
