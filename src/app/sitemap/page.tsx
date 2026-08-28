import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  FileCode2,
  Shield,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  HelpCircle,
  Mail,
  ShieldCheck,
  FileCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { CATEGORY_LIST, CATEGORIES } from '@/lib/categories-registry';
import { TOOL_LIST, getToolsByCategory } from '@/lib/tools-registry';
import { ARTICLE_LIST } from '@/lib/articles-registry';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/ui/SchemaOrg';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { getBaseUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Website Sitemap | File Intelligence',
  description:
    'Explore all File Intelligence privacy-first file inspection tools, category hubs, and platform resources in one comprehensive directory.',
  alternates: {
    canonical: `${getBaseUrl()}/sitemap`,
  },
  openGraph: {
    title: 'Website Sitemap | File Intelligence',
    description:
      'Explore all File Intelligence privacy-first file inspection tools, category hubs, and platform resources.',
    url: `${getBaseUrl()}/sitemap`,
    type: 'website',
  },
};

export default function SitemapPage() {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'FileCode2':
        return <FileCode2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Shield':
      default:
        return <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getCategoryGradient = (catId: string) => {
    switch (catId) {
      case 'image':
        return 'from-cyan-500/10 to-blue-500/5 border-cyan-200 dark:border-cyan-800/60 hover:border-cyan-300';
      case 'pdf':
        return 'from-rose-500/10 to-orange-500/5 border-rose-200 dark:border-rose-800/60 hover:border-rose-300';
      case 'office':
        return 'from-purple-500/10 to-indigo-500/5 border-purple-200 dark:border-purple-800/60 hover:border-purple-300';
      case 'file':
        return 'from-emerald-500/10 to-teal-500/5 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-300';
      case 'privacy':
      default:
        return 'from-indigo-500/10 to-purple-500/5 border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-300';
    }
  };

  const breadcrumbItems = [{ name: 'Sitemap', url: '/sitemap' }];

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'Sitemap' }]} />

        {/* Hero Section */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider mb-4 border border-indigo-200 dark:border-indigo-800">
            <Layers className="w-3.5 h-3.5" />
            <span>Navigation Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Website Sitemap
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl leading-relaxed">
            Explore all File Intelligence tools, categories, technical inspectors, and platform resources in one unified directory.
          </p>
        </header>

        <div className="space-y-14">
          {/* 1. Category Overview Grid */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Tool Categories</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {CATEGORY_LIST.length} Specialized Suites
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORY_LIST.map((category) => {
                const categoryTools = getToolsByCategory(category.id);
                const tools = categoryTools.length > 0
                  ? categoryTools
                  : category.popularToolIds
                      .map((id) => TOOL_LIST.find((t) => t.id === id))
                      .filter(Boolean);
                const toolsCount = tools.length;
                return (
                  <Link
                    key={category.id}
                    href={`/${category.slug}`}
                    className={`p-5 rounded-2xl border bg-gradient-to-br transition group hover:shadow-md flex flex-col justify-between ${getCategoryGradient(
                      category.id
                    )}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-2xs border border-slate-200/80 dark:border-slate-800">
                          {getCategoryIcon(category.iconName)}
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800">
                          {toolsCount} {toolsCount === 1 ? 'Tool' : 'Tools'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {category.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <span>Explore Category</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 2. Complete Tool Directory (Grouped by Category in Compact Rows) */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>All File Inspection Tools</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {TOOL_LIST.length} Available Tools
              </span>
            </div>

            <div className="space-y-8">
              {CATEGORY_LIST.map((category) => {
                const tools = getToolsByCategory(category.id);
                if (tools.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                        {category.name}
                      </h3>
                      <span className="text-xs text-slate-400">
                        ({tools.length})
                      </span>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden shadow-2xs">
                      {tools.map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                        >
                          <div className="flex items-start sm:items-center gap-3.5">
                            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition flex-shrink-0 mt-0.5 sm:mt-0">
                              {getCategoryIcon(tool.iconName)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition flex items-center gap-2">
                                <span>{tool.title}</span>
                                {tool.featured && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                    Featured
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                {tool.shortDescription}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition self-end sm:self-center flex-shrink-0">
                            <span className="hidden sm:inline">Launch Tool</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. Technical Guides & Educational Articles */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span>Technical Guides & Educational Articles (15 In-Depth Articles)</span>
              </h2>
              <Link
                href="/articles"
                className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Articles Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ARTICLE_LIST.map((art) => (
                <Link
                  key={art.slug}
                  href={`/articles/${art.slug}`}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {art.category} Guide • {art.readTime}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mt-1 line-clamp-2">
                      {art.title}
                    </h3>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span>2,000+ words</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Read →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 4. Resources & Support */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span>Platform Architecture & Support</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/about"
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition group flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    About Platform & Architecture
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Learn about our mission, client-side memory execution principles, and file privacy guarantees.
                  </p>
                </div>
              </Link>

              <Link
                href="/contact"
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition group flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    Contact & Parser Feedback
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Submit tool suggestions, report binary parser discrepancies, or ask privacy questions.
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* 5. Legal & Trust */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-purple-500" />
                <span>Legal & Trust Policies</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/privacy"
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition group"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  Privacy Policy
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Client-side processing and zero-storage data policy.
                </p>
              </Link>

              <Link
                href="/terms"
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition group"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  Terms of Use
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Terms governing usage and analytical tool access.
                </p>
              </Link>

              <Link
                href="/disclaimer"
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition group"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  Disclaimer
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Read-only limitations and technical analysis considerations.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}
