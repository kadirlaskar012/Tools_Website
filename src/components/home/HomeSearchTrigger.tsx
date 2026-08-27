'use client';

import React from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

export function HomeSearchTrigger() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <div className="relative group">
      {/* Decorative colored glow around search bar */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-300"></div>

      <button
        type="button"
        onClick={handleClick}
        aria-label="Search all file tools"
        className="relative w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl shadow-indigo-500/5 text-slate-400 dark:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group cursor-pointer"
      >
        <span className="flex items-center gap-3.5 pl-1 sm:pl-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
            Search 10+ file inspection tools...
          </span>
        </span>

        <div className="flex items-center gap-2 pr-1">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </div>
      </button>
    </div>
  );
}
