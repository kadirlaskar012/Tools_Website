import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ShieldCheck, Cpu, Lock, CheckCircle2, FileCheck, Eye } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About File Intelligence - Local File Inspection Platform',
  description:
    'Learn about File Intelligence, our mission, and our privacy-first client-side architecture for file analysis and metadata inspection.',
  alternates: {
    canonical: `${getBaseUrl()}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-16">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          About File Intelligence
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
          A modern, privacy-first technical toolkit built to help professionals, developers, and designers inspect, verify, and understand what is inside their files.
        </p>
      </header>

      <div className="space-y-10 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Mission */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Our Mission
          </h2>
          <p>
            When handling contracts, confidential spreadsheets, proprietary images, or financial presentations, users often need quick answers to technical questions: <em>Is there a hidden sheet with salary data? Are all PDF fonts embedded for print? What is the actual DPI resolution? Is this file extension spoofed?</em>
          </p>
          <p>
            Most online utilities require you to upload your sensitive documents to remote third-party cloud servers, posing significant compliance, security, and privacy risks.
          </p>
          <p>
            <strong>File Intelligence</strong> was created to solve this fundamental problem by delivering professional-grade file inspection tools that execute 100% locally in your web browser.
          </p>
        </section>

        {/* Core Principles */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Core Architecture Principles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Zero Server Uploads</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Binary parsing, OpenXML decompression, and header validation are performed in your browser memory via the HTML5 File API and WebAssembly.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-2">
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>Deterministic Analysis</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                All inspections rely on strict ISO and RFC specifications, magic byte tables, and OpenXML standards for reproducible, transparent results.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Zero Data Retention</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                We do not store, log, or transmit files, document titles, or extracted metadata. When you refresh or close the tab, all memory buffers are freed.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>Frictionless Access</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                No user accounts, no passwords, no email registrations, and no artificial usage caps. Just fast, dependable tools whenever you need them.
              </p>
            </div>
          </div>
        </section>

        {/* Who Uses File Intelligence */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Who Uses File Intelligence
          </h2>
          <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>Legal & Compliance Officers:</strong> Checking spreadsheets and documents for unintended metadata or hidden historical edits before disclosure.
            </li>
            <li>
              <strong>Graphic Designers & Prepress Operators:</strong> Verifying PDF bleed boxes, page trim dimensions, embedded font subsets, and image print DPI.
            </li>
            <li>
              <strong>Cybersecurity & Forensic Analysts:</strong> Identifying unknown file headers, verifying authentic MIME types against magic bytes, and discovering file spoofing.
            </li>
            <li>
              <strong>Software Engineers & Data Engineers:</strong> Diagnosing character encoding discrepancies (UTF-8, UTF-16, BOM) and broken formula reference links.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
