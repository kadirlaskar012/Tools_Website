import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CATEGORY_LIST,
  getCategoryBySlug,
} from '@/lib/categories-registry';
import { getToolsByCategory } from '@/lib/tools-registry';
import { ToolCard } from '@/components/tools/ToolCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PrivacyNotice } from '@/components/tools/PrivacyNotice';
import { ToolFAQ } from '@/components/tools/ToolFAQ';
import { AdSlot } from '@/components/ui/AdSlot';
import { FAQPageSchema, BreadcrumbSchema } from '@/components/ui/SchemaOrg';
import { getBaseUrl } from '@/lib/utils';
import {
  ShieldCheck,
  Layers,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  FileCode2,
  Shield,
  BookOpen,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return CATEGORY_LIST.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/${category.slug}`;

  return {
    title: `${category.title} | File Intelligence`,
    description: category.description,
    keywords: [
      category.name.toLowerCase(),
      `${category.name.toLowerCase()} online`,
      'client side file inspection',
      'offline file tools',
      'browser file analysis',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.title} | File Intelligence`,
      description: category.description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'File Intelligence',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.title} | File Intelligence`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(category.id);

  const getCategoryTheme = (id: string) => {
    switch (id) {
      case 'image':
        return {
          gradient: 'from-cyan-500 to-blue-600',
          badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
          icon: <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
        };
      case 'pdf':
        return {
          gradient: 'from-rose-500 to-orange-500',
          badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
        };
      case 'office':
        return {
          gradient: 'from-purple-500 to-indigo-600',
          badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          icon: <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
        };
      case 'file':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: <FileCode2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
        };
      case 'privacy':
      default:
        return {
          gradient: 'from-indigo-600 to-purple-600',
          badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
        };
    }
  };

  const theme = getCategoryTheme(category.id);
  const faqs = category.faqs || [];

  // Responsive balanced grid based on tool count
  const getToolGridClass = (count: number) => {
    if (count === 1) return 'max-w-md mx-auto grid grid-cols-1 gap-6';
    if (count === 2) return 'max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6';
    if (count === 3) return 'max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Structured Data: FAQPage & Breadcrumbs */}
      <FAQPageSchema faqs={faqs} />
      <BreadcrumbSchema items={[{ name: category.name, url: `/${category.slug}` }]} />

      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: category.name }]} />

        {/* Category Header Banner */}
        <header className="mb-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.gradient} shadow-lg shadow-indigo-500/20`}>
              {theme.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full border shadow-2xs ${theme.badge}`}>
                  Category Suite
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {tools.length} Tool{tools.length === 1 ? '' : 's'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 mt-1 leading-tight">
                {category.title}
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal mt-3">
            {category.description}
          </p>

          <div className="mt-5">
            <PrivacyNotice
              customText="All tools in this suite parse and inspect files directly in your browser memory."
            />
          </div>
        </header>

        {/* Tools Section with Balanced Centered Grid */}
        <section aria-label={`${category.name} List`} className="my-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              Available {category.name}
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
              Showing {tools.length} tool{tools.length === 1 ? '' : 's'}
            </span>
          </div>

          {tools.length > 0 ? (
            <div className={getToolGridClass(tools.length)}>
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Additional tools coming soon to {category.name}.
              </p>
            </div>
          )}
        </section>

        {/* Category Technical Guide (Editorial Article Style) */}
        {category.longGuide && (
          <section className="my-14 max-w-4xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Understanding {category.name} & In-Memory Analysis
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {category.longGuide}
            </p>
          </section>
        )}

        {/* Ad Space */}
        <AdSlot slotId={`cat-${category.id}-middle`} format="horizontal" />

        {/* Category FAQs */}
        {faqs.length > 0 && (
          <section className="my-14 max-w-4xl">
            <ToolFAQ faqs={faqs} title={`${category.name} FAQs`} />
          </section>
        )}

        {/* Cross Category Links */}
        <section className="my-16 max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
              Explore Other Tool Suites
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            Switch between document, image, PDF, and privacy auditing suites.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORY_LIST.filter((c) => c.id !== category.id).map((other) => (
              <Link
                key={other.id}
                href={`/${other.slug}`}
                className="group p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-0.5 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {other.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {other.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
