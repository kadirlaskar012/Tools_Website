'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Clock } from 'lucide-react';

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

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
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
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleCycleTheme = () => {
    let nextMode: ThemeMode = 'light';
    if (mode === 'auto') {
      // If currently auto, switch to explicit opposite or light
      nextMode = isDarkEffective ? 'light' : 'dark';
    } else if (mode === 'light') {
      nextMode = 'dark';
    } else if (mode === 'dark') {
      nextMode = 'auto';
    }

    setMode(nextMode);
    localStorage.setItem('fi_theme', nextMode);
    applyTheme(nextMode);
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 animate-pulse" />
    );
  }

  const getLabel = () => {
    if (mode === 'auto') {
      return `Theme: Auto (${isDarkEffective ? 'Night' : 'Day'})`;
    }
    return `Theme: ${mode === 'dark' ? 'Dark' : 'Light'}`;
  };

  return (
    <button
      type="button"
      onClick={handleCycleTheme}
      title={`${getLabel()} - Click to cycle (Light / Dark / Auto)`}
      aria-label={`${getLabel()} - Click to switch theme`}
      className="relative flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700/80 transition-all duration-200 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 flex-shrink-0"
    >
      {mode === 'auto' ? (
        <div className="relative flex items-center justify-center">
          {isDarkEffective ? (
            <Moon className="w-4 h-4 text-purple-400 animate-in fade-in zoom-in-75 duration-200" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 animate-in fade-in zoom-in-75 duration-200" />
          )}
          <span className="absolute -bottom-1 -right-1 flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
          </span>
        </div>
      ) : mode === 'dark' ? (
        <Moon className="w-4 h-4 text-indigo-400 animate-in fade-in zoom-in-75 duration-200" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500 animate-in fade-in zoom-in-75 duration-200" />
      )}
    </button>
  );
}
