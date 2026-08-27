import React from 'react';
import { ToolDefinition } from '@/lib/types';
import { ToolCard } from './ToolCard';
import { getRelatedTools } from '@/lib/tools-registry';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RelatedToolsProps {
  toolId: string;
  categorySlug?: string;
  categoryName?: string;
}

export function RelatedTools({
  toolId,
  categorySlug,
  categoryName,
}: RelatedToolsProps) {
  const related = getRelatedTools(toolId);

  if (related.length === 0) return null;

  return (
    <section className="w-full my-12" aria-labelledby="related-tools-heading">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2
            id="related-tools-heading"
            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100"
          >
            Related Inspection Tools
          </h2>
        </div>

        {categorySlug && (
          <Link
            href={`/${categorySlug}`}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View all {categoryName || 'tools'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((tool) => (
          <ToolCard key={tool.id} tool={tool} variant="default" />
        ))}
      </div>
    </section>
  );
}
