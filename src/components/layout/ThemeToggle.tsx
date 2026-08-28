'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export type ThemeMode = 'auto' | 'light' | 'dark';

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto');
  const [isDarkEffective, setIsDarkEffective] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Apply theme to document
  const applyTheme = (targetMode: ThemeMode) => {
    let shouldBeDark = false;

    if (targetMode === 'dark') {
      shouldBeDark = true;
    } else if (targetMode === 'light') {
      shouldBeDark = false;
    } else {
      // Auto: 06:00 to 17:59 is light, 18:00 to 05:59 is dark
      const hours = new Date().getHours();
      shouldBeDark = hours >= 18 || hours < 6;
    }

    const root = document.documentElement;
    if (shouldBeDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    setIsDarkEffective(shouldBeDark);
  };

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem('fi_theme') as ThemeMode) || 'auto';
    setMode(saved);
    applyTheme(saved);

    // If auto, periodically re-check every minute for time shifts
    const interval = setInterval(() => {
      const currentPref = (localStorage.getItem('fi_theme') as ThemeMode) || 'auto';
      if (currentPref === 'auto') {
        applyTheme('auto');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    // Smooth intuitive switch: if light -> dark; if dark -> light; or cycle
    let nextMode: ThemeMode;
    if (mode === 'auto') {
      nextMode = isDarkEffective ? 'light' : 'dark';
    } else if (mode === 'light') {
      nextMode = 'dark';
    } else {
      nextMode = 'auto';
    }

    setMode(nextMode);
    localStorage.setItem('fi_theme', nextMode);
    applyTheme(nextMode);
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
    );
  }

  const tooltipText = mode === 'auto' 
    ? `Theme: Auto (${isDarkEffective ? 'Night/Dark' : 'Day/Light'})`
    : `Theme: ${mode === 'dark' ? 'Dark Mode' : 'Light Mode'}`;

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={`${tooltipText} • Click to switch`}
      aria-label={`${tooltipText} • Click to switch`}
      className="relative flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all duration-200 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 flex-shrink-0"
    >
      {isDarkEffective ? (
        <Moon className="w-4 h-4 text-purple-400 dark:text-purple-300 transition-transform duration-200 transform hover:rotate-12" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200 transform hover:rotate-45" />
      )}
      
      {mode === 'auto' && (
        <span
          className="absolute -top-1 -right-1 flex h-2 w-2"
          title="Auto Time-Based"
        >
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
      )}
    </button>
  );
}
