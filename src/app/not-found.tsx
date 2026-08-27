import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowRight, Home, Search } from 'lucide-react';
import { CATEGORY_LIST } from '@/lib/categories-registry';
import { POPULAR_TOOLS } from '@/lib/tools-registry';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/25">
        <FileQuestion className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200 dark:border-slate-700">
        <span>404 • Page Not Found</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 max-w-xl mx-auto">
        Looking for a File Tool?
      </h1>

      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 max-w-md mx-auto leading-relaxed">
        The page or tool route you requested does not exist or has been moved. Explore our popular file inspection utilities below.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold hover:opacity-90 shadow-md shadow-indigo-500/25 transition"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>

      {/* Popular Tools Grid */}
      <div className="mt-14 pt-12 border-t border-slate-200/80 dark:border-slate-800 text-left">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 text-center sm:text-left">
          Popular Inspection Utilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POPULAR_TOOLS.slice(0, 6).map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition group flex items-center justify-between"
            >
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                {tool.title}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
