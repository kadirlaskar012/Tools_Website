'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, FileCheck } from 'lucide-react';
import { CATEGORY_LIST } from '@/lib/categories-registry';
import { CommandSearch } from './CommandSearch';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search', handleOpenSearch);
    return () => window.removeEventListener('open-search', handleOpenSearch);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full py-3 pointer-events-none transform-gpu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 p-2 sm:px-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm shadow-slate-100/50 dark:shadow-none pointer-events-auto">
            {/* Unique Brand Logo */}
            <Link
              href="/"
              className="flex items-center flex-shrink-0"
              title="File Intelligence - Home"
            >
              <BrandLogo size={36} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  pathname === '/'
                    ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-700/60'
                }`}
              >
                Home
              </Link>
              {CATEGORY_LIST.map((cat) => {
                const href = `/${cat.slug}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm shadow-indigo-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
              <Link
                href="/articles"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  pathname?.startsWith('/articles')
                    ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-700/60'
                }`}
              >
                Guides
              </Link>
              <Link
                href="/about"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  pathname === '/about'
                    ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-700/60'
                }`}
              >
                About
              </Link>
            </nav>

            {/* Right Actions: Search trigger & Mobile toggle */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search Tools (Shortcut: Command+K or Control+K)"
                className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700/80 text-xs font-semibold transition-all shadow-xs"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                <span className="hidden sm:inline">Search tools...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-indigo-600">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle (Auto Day/Night, Light, Dark) */}
              <ThemeToggle />

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200/80 dark:border-slate-700/80"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Command Search Modal */}
      <CommandSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
}
