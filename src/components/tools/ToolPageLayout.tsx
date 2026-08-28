'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  Info,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  FileCode2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Zap,
  ListChecks,
  FileBox,
  HelpCircle,
  Table,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { ToolDefinition, AnalysisResult } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories-registry';
import { POPULAR_TOOLS, getRelatedTools } from '@/lib/tools-registry';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PrivacyNotice } from './PrivacyNotice';
import { FileDropzone } from './FileDropzone';
import { ProcessingIndicator } from './ProcessingIndicator';
import { ResultPanel } from './ResultPanel';
import { ToolFAQ } from './ToolFAQ';
import { RelatedTools } from './RelatedTools';
import { AdSlot } from '@/components/ui/AdSlot';
import { WebApplicationSchema } from '@/components/ui/SchemaOrg';
import { inspectFileLocally } from '@/lib/client-inspector';

interface ToolPageLayoutProps {
  tool: ToolDefinition;
}

export function ToolPageLayout({ tool }: ToolPageLayoutProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const category = CATEGORIES[tool.category];

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setResult(null);
    setParseError(null);

    try {
      const res = await inspectFileLocally(file, tool);
      setResult(res);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while inspecting the file.';
      setParseError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setParseError(null);
    setIsProcessing(false);
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'image':
        return {
          gradient: 'from-cyan-500 to-blue-600',
          icon: <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
          badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
          bgOrb: 'bg-cyan-500/15',
        };
      case 'pdf':
        return {
          gradient: 'from-rose-500 to-orange-500',
          icon: <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
          badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          bgOrb: 'bg-rose-500/15',
        };
      case 'office':
        return {
          gradient: 'from-purple-500 to-indigo-600',
          icon: <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
          badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          bgOrb: 'bg-purple-500/15',
        };
      case 'file':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          icon: <FileCode2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
          badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          bgOrb: 'bg-emerald-500/15',
        };
      case 'privacy':
      default:
        return {
          gradient: 'from-indigo-600 to-purple-600',
          icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
          badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          bgOrb: 'bg-indigo-500/15',
        };
    }
  };

  const theme = getCategoryTheme(tool.category);
  const popularTools = POPULAR_TOOLS.filter((t) => t.id !== tool.id).slice(0, 5);
  const relatedTools = getRelatedTools(tool.id).slice(0, 5);

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none -z-10">
        <div className={`absolute top-0 left-1/3 w-96 h-96 ${theme.bgOrb} rounded-full blur-3xl`}></div>
      </div>

      {/* Schema.org WebApplication Structured Data */}
      <WebApplicationSchema tool={tool} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-12 sm:pt-4 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Content Area (col-span-8) */}
          <main className="lg:col-span-8 w-full min-w-0">
            {/* Breadcrumbs */}
            <Breadcrumbs
              items={[
                { label: category.name, href: `/${category.slug}` },
                { label: tool.title },
              ]}
            />

        {/* Hero Header */}
        <header className="mb-5 sm:mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <Link
              href={`/${category.slug}`}
              className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs hover:opacity-80 transition ${theme.badge}`}
            >
              {category.name}
            </Link>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Client-Side In-Browser
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br ${theme.gradient} shadow-lg shadow-indigo-500/20 flex-shrink-0 mt-1 hidden sm:flex`}>
              {theme.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                {tool.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {tool.shortDescription}
              </p>
            </div>
          </div>

          {/* Privacy Banner */}
          <div className="mt-4">
            <PrivacyNotice
              level={tool.privacyLevel}
              customText={tool.privacyExplanation}
            />
          </div>
        </header>

        {/* Interactive Tool Workspace (Focused Glassmorphism Container) */}
        <section
          aria-label="Tool Workspace"
          className="my-6 relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>

          <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-7 shadow-xl shadow-slate-100/50 dark:shadow-none">
            {!result && !isProcessing && !parseError && (
              <FileDropzone
                tool={tool}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                disabled={isProcessing}
              />
            )}

            {isProcessing && (
              <ProcessingIndicator statusText={`Inspecting ${selectedFile?.name || 'file'} in browser memory...`} />
            )}

            {parseError && (
              <div className="p-6 sm:p-8 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center mx-auto shadow-inner">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Inspection Could Not Complete
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 mt-1 max-w-md mx-auto leading-relaxed">
                    {parseError}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Another File</span>
                </button>
              </div>
            )}

            {result && !isProcessing && (
              <ResultPanel result={result} onReset={handleReset} />
            )}
          </div>
        </section>

        {/* Ad Space */}
        <AdSlot slotId={`tool-${tool.id}-top`} format="horizontal" />

        {/* ------------------------------------------------------------------ */}
        {/* PREMIUM EDITORIAL SEO CONTENT SECTION (Non-Overcarded)             */}
        {/* ------------------------------------------------------------------ */}
        <div className="my-16 space-y-16">
          {/* 1. What is this Tool & How Analysis Works */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              What is the {tool.title}?
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {tool.fullDescription}
            </p>

            {/* Editorial Highlight Callout */}
            <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-600 dark:border-indigo-400">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>How the Client-Side Analysis Works</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {tool.howAnalysisWorks}
              </p>
            </div>
          </section>

          {/* 2. Deep Dive Editorial Section (Validated Search Intent) */}
          {tool.deepDiveSection && (
            <>
              <hr className="border-slate-200/80 dark:border-slate-800" />
              <section className="space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {tool.deepDiveSection.title}
                  </h2>
                  {tool.deepDiveSection.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {tool.deepDiveSection.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {tool.deepDiveSection.paragraphs.map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {/* Optional Deep Dive Callout */}
                {tool.deepDiveSection.callout && (
                  <div
                    className={`p-5 rounded-2xl border-l-4 ${
                      tool.deepDiveSection.callout.type === 'warning'
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-200'
                        : tool.deepDiveSection.callout.type === 'privacy'
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-400 text-emerald-900 dark:text-emerald-200'
                        : 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-500 dark:border-indigo-400 text-slate-900 dark:text-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-sm mb-1">
                      {tool.deepDiveSection.callout.title}
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                      {tool.deepDiveSection.callout.text}
                    </p>
                  </div>
                )}

                {/* Optional Deep Dive Comparison Table */}
                {tool.deepDiveSection.comparisonTable && (
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-200/80 dark:border-slate-800">
                        <tr>
                          {tool.deepDiveSection.comparisonTable.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3 sm:p-4 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {tool.deepDiveSection.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                            <td className="p-3 sm:p-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {row.col1}
                            </td>
                            <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-400">
                              {row.col2}
                            </td>
                            {row.col3 && (
                              <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-400">
                                {row.col3}
                              </td>
                            )}
                            {row.col4 && (
                              <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-400">
                                {row.col4}
                              </td>
                            )}
                            {row.col5 && (
                              <td className="p-3 sm:p-4 text-slate-600 dark:text-slate-400">
                                {row.col5}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* 3. Step-by-Step Usage Timeline (Numbered Sequence) */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <ListChecks className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                How to Use the {tool.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              {tool.howItWorksSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* 4. Why Use This Tool (Clean Editorial List) */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Why Use This Tool
              </h2>
            </div>

            <div className="space-y-4">
              {tool.whyUseReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      {reason.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* 5. Inspection Results Explained (Structured Technical Guide) */}
          {tool.resultsExplanation && tool.resultsExplanation.length > 0 && (
            <section className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Inspection Results Explained
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Understand the exact technical parameters and risk indicators returned during local file analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.resultsExplanation.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {item.term}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {item.explanation}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Why it matters:</span> {item.whyItMatters}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* 6. Supported Formats & Technical Specifications */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <FileBox className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Supported File Types & Limitations
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  Supported Formats
                </span>
                <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">
                  {tool.supportedFormats.displayNames}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  Memory & Size Limits
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {tool.fileLimitations}
                </p>
              </div>
            </div>
          </section>

          {/* 7. Practical Real-World Scenarios */}
          {tool.practicalExamples && tool.practicalExamples.length > 0 && (
            <>
              <hr className="border-slate-200/80 dark:border-slate-800" />
              <section className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Practical Real-World Scenarios
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tool.practicalExamples.map((example, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
                    >
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {example.title}
                      </h3>
                      <div className="space-y-2 text-xs">
                        <p>
                          <strong className="text-slate-700 dark:text-slate-300">Scenario: </strong>
                          <span className="text-slate-600 dark:text-slate-400">{example.scenario}</span>
                        </p>
                        <p>
                          <strong className="text-emerald-600 dark:text-emerald-400">Outcome: </strong>
                          <span className="text-slate-600 dark:text-slate-400">{example.outcome}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* 8. Contextual Cross Links (Natural In-Content Links) */}
          {tool.contextualLinks && tool.contextualLinks.length > 0 && (
            <>
              <hr className="border-slate-200/80 dark:border-slate-800" />
              <section className="p-5 sm:p-6 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Related Inspection Workflows</span>
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {tool.contextualLinks.map((linkItem, lIdx) => (
                    <p key={lIdx}>
                      {linkItem.preText}{' '}
                      <Link
                        href={`/tools/${linkItem.toolSlug}`}
                        className="font-bold text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300 transition"
                      >
                        {linkItem.toolName}
                      </Link>{' '}
                      {linkItem.postText}
                    </p>
                  ))}
                </div>
              </section>
            </>
          )}

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* 9. FAQs (Interactive Accordion) */}
          <ToolFAQ faqs={tool.faqs} />

          {/* 10. Mobile-Visible Related Tools */}
          <div className="lg:hidden">
            <hr className="border-slate-200/80 dark:border-slate-800 my-8" />
            <RelatedTools
              toolId={tool.id}
              categorySlug={category.slug}
              categoryName={category.name}
            />
          </div>
        </div>
      </main>

      {/* RIGHT COLUMN: Desktop Sidebar (col-span-4 hidden lg:block, locked in viewport) */}
      <aside className="hidden lg:block lg:col-span-4 sticky top-20 self-start space-y-5 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1.5 scrollbar-thin">
        {/* Popular Tools Card */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Popular Tools
            </h3>
          </div>
          <div className="space-y-1.5">
            {popularTools.map((pt) => (
              <Link
                key={pt.id}
                href={`/tools/${pt.slug}`}
                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition flex-shrink-0">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                    {pt.title}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Related Tools Card */}
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Related Tools
            </h3>
          </div>
          <div className="space-y-1.5">
            {relatedTools.map((rt) => (
              <Link
                key={rt.id}
                href={`/tools/${rt.slug}`}
                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition truncate">
                    {rt.title}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Client-Side Privacy Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Local Browser Privacy</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All inspection runs inside your browser sandbox. Your files never leave your device.
          </p>
        </div>

        {/* Sidebar Ad Slot */}
        <AdSlot slotId={`tool-${tool.id}-sidebar`} format="rectangle" />
      </aside>
    </div>
  </div>
</div>
  );
}
