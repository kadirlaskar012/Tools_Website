import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  FileCheck,
  ArrowRight,
  Sparkles,
  FileText,
  FileSpreadsheet,
  FileCode2,
  Image as ImageIcon,
  Shield,
  Layers,
  CheckCircle2,
  LockKeyhole,
} from 'lucide-react';
import { TOOL_LIST, FEATURED_TOOLS, POPULAR_TOOLS } from '@/lib/tools-registry';
import { CATEGORY_LIST, CATEGORIES } from '@/lib/categories-registry';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolFAQ } from '@/components/tools/ToolFAQ';
import { AdSlot } from '@/components/ui/AdSlot';
import { HomeSearchTrigger } from '@/components/home/HomeSearchTrigger';
import { WebSiteSchema, OrganizationSchema } from '@/components/ui/SchemaOrg';
import { Metadata } from 'next';
import { getBaseUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'File Intelligence - Understand What’s Inside Your Files',
  description:
    'Inspect file properties, metadata, hidden content, dimensions, structure, and encodings quickly and privately in your browser.',
  alternates: {
    canonical: getBaseUrl(),
  },
};

const HOME_FAQS = [
  {
    question: 'How does File Intelligence process files without uploading them?',
    answer:
      'File Intelligence utilizes standard browser APIs (such as the HTML5 File API, WebAssembly, ArrayBuffers, and FileReader) to execute binary inspections directly inside your browser memory. Your files never leave your local computer or network.',
  },
  {
    question: 'Is File Intelligence free to use?',
    answer:
      'Yes, all inspection tools are 100% free with no account creation, no signups, and no artificial daily limits.',
  },
  {
    question: 'What kind of files can I analyze?',
    answer:
      'We support Microsoft Office documents (XLSX, DOCX, PPTX), PDF files, raster images (JPEG, PNG, TIFF, WebP), plain text files, CSV/JSON data, and raw binary files for header magic byte identification.',
  },
  {
    question: 'Can File Intelligence see my confidential or proprietary data?',
    answer:
      'No. Because all parsing runs locally in your browser sandbox, our servers never receive your files, file names, or contents.',
  },
  {
    question: 'How are file properties and metadata extracted?',
    answer:
      'File Intelligence uses deterministic binary parsers, XML schema inspectors, and standard file specification decoders. All operations execute strictly in your browser memory without cloud processing.',
  },
];

export default function HomePage() {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Schema.org Structured Data */}
      <WebSiteSchema />
      <OrganizationSchema />

      {/* Background Ambient Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-gradient-to-bl from-pink-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-60 left-1/3 w-80 h-80 bg-gradient-to-r from-sky-400/15 to-emerald-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wider uppercase mb-8 shadow-xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span>PRIVATE • FAST • BROWSER-BASED</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-slate-100 max-w-5xl mx-auto leading-[1.12]">
            Understand What’s{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              Inside Your Files
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 mt-6 max-w-3xl mx-auto leading-relaxed font-normal">
            Inspect file properties, metadata, hidden content, dimensions, structure, and encodings — quickly, securely, and privately.
          </p>

          {/* 2. Main Tool Search Box */}
          <div className="mt-10 max-w-2xl mx-auto">
            <HomeSearchTrigger />

            {/* Popular Tool Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Popular:</span>
              
              <Link
                href="/tools/xlsx-hidden-sheet-detector"
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-bold hover:scale-105 transition-transform shadow-2xs"
              >
                XLSX Hidden Sheets
              </Link>
              
              <Link
                href="/tools/pdf-page-size-checker"
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 font-bold hover:scale-105 transition-transform shadow-2xs"
              >
                PDF Page Size
              </Link>

              <Link
                href="/tools/image-dpi-checker"
                className="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/80 font-bold hover:scale-105 transition-transform shadow-2xs"
              >
                Image DPI
              </Link>

              <Link
                href="/tools/docx-metadata-checker"
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 font-bold hover:scale-105 transition-transform shadow-2xs"
              >
                DOCX Metadata
              </Link>

              <Link
                href="/tools/file-type-checker"
                className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 font-bold hover:scale-105 transition-transform shadow-2xs"
              >
                Magic Bytes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Tools Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Utilities</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Featured Inspection Tools
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            Essential client-side tools for spreadsheet auditing, PDF preflight verification, raster resolution checking, and binary integrity analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Ad Space (CLS Protected / Inactive in dev) */}
      <AdSlot slotId="home-featured-bottom" format="horizontal" />

      {/* 4. Tools Grouped by Category (Vibrant Category Blocks) */}
      <section className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>Format Specialization</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Browse Tools by Category
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
              Explore specialized inspection tools built for images, documents, spreadsheets, PDFs, and privacy auditing.
            </p>
          </div>

          <div className="space-y-10">
            {/* 1. Office Category Block */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-white/90 dark:to-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-lg shadow-purple-500/5 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-100 dark:border-purple-900/40">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                        Office Tools
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {TOOL_LIST.filter((t) => t.category === 'office').length} Tools
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                      Audit Excel workbooks, PowerPoint slides, and Word documents for hidden tabs, author metadata, and external references.
                    </p>
                  </div>
                </div>

                <Link
                  href="/office-tools"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all self-start sm:self-auto"
                >
                  <span>Explore Office Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                {TOOL_LIST.filter((t) => t.category === 'office').map((tool) => (
                  <ToolCard key={tool.id} tool={tool} variant="compact" />
                ))}
              </div>
            </div>

            {/* 2. Image Category Block */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-white/90 dark:to-slate-900 border border-cyan-200/80 dark:border-cyan-900/60 shadow-lg shadow-cyan-500/5 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan-100 dark:border-cyan-900/40">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                        Image Tools
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                        {TOOL_LIST.filter((t) => t.category === 'image').length} Tools
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                      Inspect DPI/PPI resolution headers, calculate exact print measurements, and verify color channel bit depth.
                    </p>
                  </div>
                </div>

                <Link
                  href="/image-tools"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto"
                >
                  <span>Explore Image Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {TOOL_LIST.filter((t) => t.category === 'image').map((tool) => (
                  <ToolCard key={tool.id} tool={tool} variant="compact" />
                ))}
              </div>
            </div>

            {/* 3. PDF Category Block */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-white/90 dark:to-slate-900 border border-rose-200/80 dark:border-rose-900/60 shadow-lg shadow-rose-500/5 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rose-100 dark:border-rose-900/40">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/25">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                        PDF Tools
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {TOOL_LIST.filter((t) => t.category === 'pdf').length} Tools
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                      Verify PDF page geometries, identify mixed page dimensions, and inspect embedded font subsets.
                    </p>
                  </div>
                </div>

                <Link
                  href="/pdf-tools"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-500/20 transition-all self-start sm:self-auto"
                >
                  <span>Explore PDF Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {TOOL_LIST.filter((t) => t.category === 'pdf').map((tool) => (
                  <ToolCard key={tool.id} tool={tool} variant="compact" />
                ))}
              </div>
            </div>

            {/* 4. File & Privacy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Tools */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white/90 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                      <FileCode2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">File Tools</h3>
                      <span className="text-xs text-slate-500">Magic bytes & Charset</span>
                    </div>
                  </div>
                  <Link href="/file-tools" className="text-xs font-bold text-emerald-600 hover:underline">
                    View All →
                  </Link>
                </div>
                <div className="space-y-3 pt-4">
                  {TOOL_LIST.filter((t) => t.category === 'file').map((tool) => (
                    <ToolCard key={tool.id} tool={tool} variant="compact" />
                  ))}
                </div>
              </div>

              {/* Privacy Tools */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-white/90 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-900/60 shadow-lg shadow-indigo-500/5">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Privacy Tools</h3>
                      <span className="text-xs text-slate-500">Security audits</span>
                    </div>
                  </div>
                  <Link href="/privacy-tools" className="text-xs font-bold text-indigo-600 hover:underline">
                    View All →
                  </Link>
                </div>
                <div className="space-y-3 pt-4">
                  <ToolCard tool={TOOL_LIST.find((t) => t.id === 'docx-metadata-checker')!} variant="compact" />
                  <ToolCard tool={TOOL_LIST.find((t) => t.id === 'xlsx-hidden-sheet-detector')!} variant="compact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Privacy-First Section: “Your Files Stay Yours.” */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden shadow-2xl">
            {/* Ambient decorative lighting */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 mb-6 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Your Files Stay Yours.
              </h2>
              <p className="text-sm sm:text-lg text-slate-300 mt-4 leading-relaxed font-normal">
                Unlike traditional online file websites that secretly upload your confidential spreadsheets and PDF contracts to third-party cloud servers, File Intelligence runs directly inside your web browser.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-400/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Local Browser Processing
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Your files are processed locally in your browser whenever possible using client-side WebAssembly and memory buffers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-sky-400/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Zero Cloud Uploads
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Files are not stored on our servers for browser-based tools. No network transmission, zero retention.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-400/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-400 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  No Account Required
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Open a tool and start working immediately. No forced registrations, paywalls, or tracking cookies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. “How It Works” Section (Horizontal Timeline on Desktop) */}
      <section className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
              Four streamlined steps to inspect and audit file parameters locally.
            </p>
          </div>

          <div className="relative">
            {/* Connecting gradient line on desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -translate-y-6 z-0 opacity-40"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-100/60 dark:shadow-none hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center mb-4 shadow-sm shadow-indigo-500/30">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Select or Drop File
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Drop any spreadsheet, PDF, image, or document into the secure workspace.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-100/60 dark:shadow-none hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-black text-xs flex items-center justify-center mb-4 shadow-sm shadow-purple-500/30">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Local Analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Client-side parsers unpack container structures and inspect binary headers in RAM.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-100/60 dark:shadow-none hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white font-black text-xs flex items-center justify-center mb-4 shadow-sm shadow-pink-500/30">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  View Report
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Review verified properties, hidden content warnings, and compliance metrics.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-100/60 dark:shadow-none hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center justify-center mb-4 shadow-sm shadow-emerald-500/30">
                  04
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Export / Download
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Copy structured summaries or download JSON audit reports for your records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Popular Tools Section */}
      <section className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Frequently Accessed
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Popular Inspection Utilities
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Tools frequently used by analysts, print technicians, developers, and compliance auditors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_TOOLS.slice(0, 8).map((tool) => (
              <ToolCard key={tool.id} tool={tool} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ToolFAQ faqs={HOME_FAQS} title="Frequently Asked Questions" />
        </div>
      </section>

      {/* 9. Directory Links */}
      <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            File Intelligence Directory
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORY_LIST.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all shadow-xs"
              >
                {cat.name} ({TOOL_LIST.filter((t) => t.category === cat.id).length})
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
