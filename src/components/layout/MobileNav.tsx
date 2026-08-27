'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Search, Shield, ChevronRight, Layers, FileText, FileSpreadsheet, FileCode2, Image as ImageIcon, Info } from 'lucide-react';
import { CATEGORY_LIST } from '@/lib/categories-registry';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileNav({ isOpen, onClose, onOpenSearch }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-500" />;
      case 'office':
        return <FileSpreadsheet className="w-4 h-4 text-sky-500" />;
      case 'file':
        return <FileCode2 className="w-4 h-4 text-amber-500" />;
      case 'privacy':
        return <Shield className="w-4 h-4 text-indigo-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity lg:hidden"
      onClick={onClose}
    >
      <div
        className="w-4/5 max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-black text-sm">
              FI
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
              File Intelligence
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Navigation"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Action */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search 10+ tools...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
              Tool Categories
            </div>
            <nav className="space-y-1">
              {CATEGORY_LIST.map((cat) => {
                const href = `/${cat.slug}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {getCategoryIcon(cat.id)}
                      <span>{cat.name}</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
              Platform & Resources
            </div>
            <nav className="space-y-1">
              <Link
                href="/articles"
                onClick={onClose}
                className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Technical Guides</span>
              </Link>
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>About Platform</span>
              </Link>
              <Link
                href="/privacy"
                onClick={onClose}
                className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Privacy & Security</span>
              </Link>
              <Link
                href="/sitemap"
                onClick={onClose}
                className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span>HTML Sitemap</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Privacy Note Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            Your files stay on your device. Processing happens locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
