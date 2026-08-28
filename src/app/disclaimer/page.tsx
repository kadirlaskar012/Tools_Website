import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Disclaimer - File Intelligence',
  description:
    'Read the File Intelligence technical inspection disclaimer, accuracy considerations, and non-destructive analysis policies.',
  alternates: {
    canonical: `${getBaseUrl()}/disclaimer`,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-16">
      <Breadcrumbs items={[{ label: 'Disclaimer' }]} />

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Disclaimer & Technical Limitations
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Effective Date: August 2026
        </p>
      </header>

      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Non-Destructive Read-Only Analysis</span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
            All File Intelligence tools perform read-only inspections. Our software does not alter, write to, or mutate your original files on disk.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            1. Informational Purposes Only
          </h2>
          <p>
            The analysis reports, metadata extractions, and property evaluations provided by File Intelligence are intended for technical verification and informational purposes only. While our parsers adhere strictly to published OpenXML, PDF 1.7/2.0, Exif, and ISO specifications, complex files created with non-standard or proprietary software may present atypical behaviors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            2. Legal and Compliance Decisions
          </h2>
          <p>
            While File Intelligence is a valuable tool for pre-flight verification and auditing, it should not serve as the sole basis for formal legal discovery or certified evidentiary certifications without independent verification by qualified forensic professionals.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            3. Browser Sandbox Performance
          </h2>
          <p>
            Inspection speed and capacity depend on the available system memory (RAM) and CPU resources of your local computing device. For extremely large files (e.g. multi-gigabyte disk images or archives), performance may vary based on your browser&apos;s allocated memory limits.
          </p>
        </section>
      </div>
    </div>
  );
}
