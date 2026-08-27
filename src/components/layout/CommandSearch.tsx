'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Command,
} from 'lucide-react';
import { TOOL_LIST } from '@/lib/tools-registry';
import { CATEGORY_LIST } from '@/lib/categories-registry';
import { ToolDefinition } from '@/lib/types';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent('open-search'));
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTools = TOOL_LIST.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'all' || tool.category === selectedCategory;

    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase().trim();
    const matchesTitle = tool.title.toLowerCase().includes(q);
    const matchesDesc = tool.shortDescription.toLowerCase().includes(q);
    const matchesCategoryName = tool.category.toLowerCase().includes(q);
    const matchesFormats = tool.supportedFormats.extensions.some((ext) =>
      ext.toLowerCase().includes(q)
    );
    const matchesKeywords = tool.seo.keywords.some((k) =>
      k.toLowerCase().includes(q)
    );

    return matchesTitle || matchesDesc || matchesCategoryName || matchesFormats || matchesKeywords;
  });

  const handleSelectTool = (tool: ToolDefinition) => {
    onClose();
    startTransition(() => {
      router.push(`/tools/${tool.slug}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredTools.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredTools.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelectTool(filteredTools[selectedIndex]);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-cyan-500" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-500" />;
      case 'office':
        return <FileSpreadsheet className="w-4 h-4 text-purple-500" />;
      case 'file':
        return <FileCode2 className="w-4 h-4 text-emerald-500" />;
      case 'privacy':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      default:
        return <FileCode2 className="w-4 h-4 text-slate-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Tools"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/65 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="relative flex items-center px-5 py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all file tools (e.g., excel, pdf size, dpi, magic bytes)..."
            className="w-full py-4 text-sm sm:text-base bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto bg-slate-50/70 dark:bg-slate-900/50 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            All Tools ({TOOL_LIST.length})
          </button>
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2.5 space-y-1">
          {filteredTools.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                No inspection tools found matching &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching for &ldquo;excel&rdquo;, &ldquo;pdf&rdquo;, &ldquo;dpi&rdquo;, &ldquo;metadata&rdquo;, or &ldquo;encoding&rdquo;.
              </p>
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex-shrink-0 mt-0.5 shadow-2xs">
                      {getCategoryIcon(tool.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {tool.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {tool.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-3 flex-shrink-0">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline font-mono">
                      {tool.supportedFormats.extensions.slice(0, 3).join(', ')}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isSelected ? 'translate-x-1 text-indigo-600 dark:text-indigo-400 font-bold' : ''
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span className="flex items-center gap-1 font-medium">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Local browser analysis • Zero cloud uploads
          </span>
        </div>
      </div>
    </div>
  );
}
