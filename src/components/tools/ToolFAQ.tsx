'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ToolFAQItem } from '@/lib/types';
import { FAQPageSchema } from '@/components/ui/SchemaOrg';

interface ToolFAQProps {
  faqs: ToolFAQItem[];
  title?: string;
}

export function ToolFAQ({ faqs, title = 'Frequently Asked Questions' }: ToolFAQProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  if (!faqs || faqs.length === 0) return null;

  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="w-full my-12" aria-labelledby="faq-heading">
      <FAQPageSchema faqs={faqs} />

      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <HelpCircle className="w-4 h-4" />
        </div>
        <h2
          id="faq-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100"
        >
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndexes.includes(idx);
          return (
            <div
              key={idx}
              className="border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/50 transition"
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-slate-900 dark:text-slate-100' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
