import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ARTICLE_LIST,
  getArticleBySlug,
  getRelatedArticles,
  getArticlesByCategory,
} from '@/lib/articles-registry';
import { getToolBySlug } from '@/lib/tools-registry';
import { getCategoryById } from '@/lib/categories-registry';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AdSlot } from '@/components/ui/AdSlot';
import {
  ArticleSchema,
  FAQPageSchema,
  BreadcrumbSchema,
} from '@/components/ui/SchemaOrg';
import { ArticleTOC } from '@/components/articles/ArticleTOC';
import { RichArticleText } from '@/components/articles/RichArticleText';
import { getBaseUrl } from '@/lib/utils';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Share2,
  ChevronRight,
  FileCode2,
  Sparkles,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ARTICLE_LIST.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/articles/${article.slug}`;

  return {
    title: `${article.seoTitle || article.title} | File Intelligence`,
    description: article.metaDescription,
    keywords: [
      article.primaryKeyword,
      ...article.secondaryKeywords,
      'file intelligence guide',
      'technical file analysis',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${article.title} | File Intelligence`,
      description: article.metaDescription,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate || article.publishedDate,
      authors: [article.author || 'File Intelligence Editorial Team'],
      section: article.category,
      tags: [article.primaryKeyword, ...article.secondaryKeywords],
      siteName: 'File Intelligence',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | File Intelligence`,
      description: article.metaDescription,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = getCategoryById(article.category);
  const primaryTool = article.primaryToolSlug
    ? getToolBySlug(article.primaryToolSlug)
    : null;
  const relatedArticles = getRelatedArticles(article.slug, 3);

  const getCategoryColor = (catId: string) => {
    switch (catId) {
      case 'office':
        return {
          badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          gradient: 'from-emerald-600 to-teal-700',
          accent: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'pdf':
        return {
          badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          gradient: 'from-rose-600 to-red-700',
          accent: 'text-rose-600 dark:text-rose-400',
        };
      case 'image':
        return {
          badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
          gradient: 'from-cyan-600 to-blue-700',
          accent: 'text-cyan-600 dark:text-cyan-400',
        };
      case 'file':
      default:
        return {
          badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          gradient: 'from-purple-600 to-indigo-700',
          accent: 'text-purple-600 dark:text-purple-400',
        };
    }
  };

  const theme = getCategoryColor(article.category);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Schema.org Structured Data */}
      <ArticleSchema article={article} />
      {article.faqs && article.faqs.length > 0 && (
        <FAQPageSchema faqs={article.faqs} />
      )}
      <BreadcrumbSchema
        items={[
          { name: 'Articles', url: '/articles' },
          { name: category?.name || 'Guide', url: `/${category?.slug || 'tools'}` },
          { name: article.title, url: `/articles/${article.slug}` },
        ]}
      />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Articles', href: '/articles' },
              { label: category?.name || 'Category', href: `/${category?.slug || 'tools'}` },
              { label: article.title },
            ]}
          />
        </div>

        {/* Hero Article Header */}
        <header className="mb-10 lg:mb-14">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${theme.badge}`}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              {category?.name || 'Educational Guide'}
            </span>
            <span className="inline-flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2] mb-6">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl mb-6">
            {article.metaDescription}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1.5 text-slate-400" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
              <span>
                Updated:{' '}
                {new Date(article.updatedDate || article.publishedDate).toLocaleDateString(
                  'en-US',
                  { month: 'short', day: 'numeric', year: 'numeric' }
                )}
              </span>
            </div>
          </div>
        </header>

        {/* Top Ad Slot */}
        <div className="mb-10">
          <AdSlot slotId="article-top-leaderboard" format="horizontal" />
        </div>

        {/* Quick Takeaway Banner */}
        {article.quickTakeaway && (
          <div className="mb-12 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-purple-50/80 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/60 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  Direct Answer & Key Takeaway
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <RichArticleText text={article.quickTakeaway} />
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Layout: Main Article Content + Table of Contents Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Article Main Body */}
          <main className="lg:col-span-8 space-y-12">
            {article.sections.map((section, idx) => (
              <section
                key={section.id || idx}
                id={section.id}
                className="scroll-mt-24 space-y-5"
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  {section.title}
                </h2>

                {section.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal"
                  >
                    <RichArticleText text={p} />
                  </p>
                ))}

                {/* Optional Callout */}
                {section.callout && (
                  <div
                    className={`p-5 rounded-xl border my-6 ${
                      section.callout.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : section.callout.type === 'tip'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : section.callout.type === 'caution'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                        : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {section.callout.type === 'warning' && (
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      )}
                      {section.callout.type === 'tip' && (
                        <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {section.callout.type === 'caution' && (
                        <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                      {section.callout.type === 'info' && (
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        {section.callout.title && (
                          <h4 className="font-semibold text-sm sm:text-base mb-1">
                            {section.callout.title}
                          </h4>
                        )}
                        <p className="text-sm leading-relaxed">
                          <RichArticleText text={section.callout.text} />
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Table */}
                {section.table && (
                  <div className="my-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            {section.table.headers.map((h, hIdx) => (
                              <th
                                key={hIdx}
                                className="py-3 px-4 font-semibold text-slate-900 dark:text-white"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-slate-950">
                          {section.table.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                            >
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="py-3 px-4 text-slate-700 dark:text-slate-300 font-mono text-xs sm:text-sm"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Optional Code Block */}
                {section.codeBlock && (
                  <div className="my-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                    <div className="bg-slate-800 dark:bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                      <div className="flex items-center space-x-2">
                        <FileCode2 className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-mono font-medium text-slate-300 uppercase">
                          {section.codeBlock.language}
                        </span>
                      </div>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                      <code>{section.codeBlock.code}</code>
                    </pre>
                  </div>
                )}

                {/* Optional Subheadings */}
                {section.subheadings && (
                  <div className="space-y-6 pt-2">
                    {section.subheadings.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {sub.title}
                        </h3>
                        {sub.content.map((sc, scIdx) => (
                          <p
                            key={scIdx}
                            className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
                          >
                            <RichArticleText text={sc} />
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* In-Article Primary Tool CTA Banner */}
            {primaryTool && (
              <div className="my-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-800/40 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                    100% Client-Side Private Inspection
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Audit Your Files with {primaryTool.title}
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                    {primaryTool.shortDescription} Inspect internal structures, metadata, and encoding directly in your browser with zero server uploads.
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/tools/${primaryTool.slug}`}
                      className="inline-flex items-center px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
                    >
                      Open {primaryTool.title} Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Frequently Asked Questions Section */}
            {article.faqs && article.faqs.length > 0 && (
              <section id="faqs" className="scroll-mt-24 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    Quick expert answers regarding {article.primaryKeyword}.
                  </p>
                </div>

                <div className="space-y-4">
                  {article.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Q:</span>
                        <span>{faq.question}</span>
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed pl-6">
                        <RichArticleText text={faq.answer} />
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Concluding Section */}
            {article.conclusion && (
              <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Conclusion & Final Recommendations
                </h3>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  <RichArticleText text={article.conclusion} />
                </p>
              </section>
            )}

            {/* Mid Article Ad Slot */}
            <div className="pt-6">
              <AdSlot slotId="article-bottom-leaderboard" format="horizontal" />
            </div>
          </main>

          {/* Sticky Table of Contents Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-20 self-start space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            <ArticleTOC
              sections={article.sections}
              hasFaqs={Boolean(article.faqs && article.faqs.length > 0)}
            />

            {/* Sidebar Primary Tool Widget */}
              {primaryTool && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/60 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Free Inspection Tool</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {primaryTool.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Audit files privately in your browser without cloud uploads.
                  </p>
                  <Link
                    href={`/tools/${primaryTool.slug}`}
                    className="block w-full py-2.5 px-4 text-center rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
                  >
                    Open Tool Now
                  </Link>
                </div>
              )}

            {/* Sidebar Ad Slot */}
            <AdSlot slotId="article-sidebar-square" format="rectangle" />
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Related Technical Guides
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Deepen your understanding of file structures and metadata.
                </p>
              </div>
              <Link
                href="/articles"
                className="hidden sm:inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                All Articles
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relArt) => {
                const relCat = getCategoryById(relArt.category);
                return (
                  <Link
                    key={relArt.slug}
                    href={`/articles/${relArt.slug}`}
                    className="group block p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {relCat?.name || 'Guide'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
                        {relArt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {relArt.metaDescription}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>{relArt.readTime}</span>
                      <span className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                        Read Guide
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
