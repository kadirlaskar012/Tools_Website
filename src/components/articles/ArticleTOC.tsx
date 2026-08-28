'use client';

import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface TOCSection {
  id: string;
  title: string;
}

interface ArticleTOCProps {
  sections: TOCSection[];
  hasFaqs?: boolean;
}

export function ArticleTOC({ sections, hasFaqs }: ArticleTOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const allIds = sections.map((s) => s.id).filter(Boolean);
    if (hasFaqs) allIds.push('faqs');

    if (allIds.length === 0) return;

    // Set initial active
    if (!activeId && allIds.length > 0) {
      setActiveId(allIds[0]);
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the first visible heading from top
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        // Pick the top-most visible section
        const sorted = visibleEntries.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveId(sorted[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0.1,
    });

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, hasFaqs]);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <List className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          On This Page
        </h3>
      </div>

      <nav className="space-y-1">
        {sections.map((sec, sIdx) => {
          const isActive = activeId === sec.id;
          return (
            <a
              key={sIdx}
              href={`#${sec.id}`}
              onClick={() => setActiveId(sec.id)}
              className={`block py-1.5 px-3 rounded-lg text-xs sm:text-sm transition-all duration-150 leading-snug line-clamp-1 border-l-2 ${
                isActive
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-indigo-950/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 font-medium'
              }`}
            >
              {sec.title}
            </a>
          );
        })}

        {hasFaqs && (
          <a
            href="#faqs"
            onClick={() => setActiveId('faqs')}
            className={`block py-1.5 px-3 rounded-lg text-xs sm:text-sm transition-all duration-150 leading-snug border-l-2 ${
              activeId === 'faqs'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-indigo-950/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 font-medium'
            }`}
          >
            Frequently Asked Questions
          </a>
        )}
      </nav>
    </div>
  );
}
