import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLE_LIST } from '@/lib/articles-registry';
import { CATEGORY_LIST, getCategoryById } from '@/lib/categories-registry';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AdSlot } from '@/components/ui/AdSlot';
import { BreadcrumbSchema } from '@/components/ui/SchemaOrg';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { getBaseUrl } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  FileCode2,
  Shield,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Technical Guides & Educational Articles | File Intelligence',
  description:
    'Comprehensive in-depth technical guides on file formats, metadata analysis, font embedding, DPI resolution, and character encoding standards.',
  keywords: [
    'file format guides',
    'metadata analysis tutorials',
    'pdf font embedding guide',
    'excel hidden sheets guide',
    'image dpi vs ppi explained',
    'fix mojibake character encoding',
  ],
  alternates: {
    canonical: `${getBaseUrl()}/articles`,
  },
  openGraph: {
    title: 'Technical Guides & Educational Articles | File Intelligence',
    description:
      'Comprehensive in-depth technical guides on file formats, metadata analysis, font embedding, DPI resolution, and character encoding standards.',
    url: `${getBaseUrl()}/articles`,
    type: 'website',
    siteName: 'File Intelligence',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Guides & Educational Articles | File Intelligence',
    description:
      'Comprehensive in-depth technical guides on file formats, metadata analysis, font embedding, DPI resolution, and character encoding standards.',
  },
};

export default function ArticlesHubPage() {
  const getCategoryColor = (catId: string) => {
    switch (catId) {
      case 'office':
        return {
          badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: <FileSpreadsheet className="w-4 h-4" />,
        };
      case 'pdf':
        return {
          badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: <FileText className="w-4 h-4" />,
        };
      case 'image':
        return {
          badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
          icon: <ImageIcon className="w-4 h-4" />,
        };
      case 'file':
      default:
        return {
          badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          icon: <FileCode2 className="w-4 h-4" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <BreadcrumbSchema
        items={[{ name: 'Articles', url: '/articles' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Articles' }]} />
        </div>

        {/* Hero Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-4">
            <BookOpen className="w-4 h-4 mr-1.5" />
            File Intelligence Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            Technical Guides & Educational Articles
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            In-depth architectural guides, binary specifications, forensic analysis methods, and practical tutorials on file formats, metadata inspection, and data privacy.
          </p>
        </div>

        {/* Top Leaderboard Ad */}
        <div className="mb-12">
          <AdSlot slotId="articles-hub-top" format="horizontal" />
        </div>

        {/* Articles Grid grouped by category */}
        {CATEGORY_LIST.filter(c => c.id !== 'privacy').map((cat) => {
          const catArticles = ARTICLE_LIST.filter((a) => a.category === cat.id);
          if (catArticles.length === 0) return null;
          const catTheme = getCategoryColor(cat.id);

          return (
            <section key={cat.id} className="mb-16">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg border ${catTheme.badge}`}>
                    {catTheme.icon}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {cat.name} Articles & Guides
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {catArticles.length} Comprehensive Technical Articles
                    </p>
                  </div>
                </div>
                <Link
                  href={`/${cat.slug}`}
                  className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center"
                >
                  Explore {cat.name} Tools
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catArticles.map((art) => (
                  <Link
                    key={art.slug}
                    href={`/articles/${art.slug}`}
                    className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold border ${catTheme.badge}`}>
                          {cat.name}
                        </span>
                        <span className="flex items-center font-medium">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {art.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {art.metaDescription}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      <span>Read Guide (2,000+ words)</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Bottom Ad Slot */}
        <div className="mt-12">
          <AdSlot slotId="articles-hub-bottom" format="horizontal" />
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}
