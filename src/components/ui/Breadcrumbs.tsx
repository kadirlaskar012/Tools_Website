import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const baseUrl = getBaseUrl();

  const allItems = [
    { label: 'Home', href: '/' },
    ...items,
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${baseUrl}${item.href}` : baseUrl,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap py-1">
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              title="File Intelligence Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
