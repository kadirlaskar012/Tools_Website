import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Privacy Policy - File Intelligence',
  description:
    'Read the File Intelligence privacy policy. Learn how our client-side processing ensures your files never leave your computer.',
  alternates: {
    canonical: `${getBaseUrl()}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-16">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy-First Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Effective Date: August 2026 • Version 1.0
        </p>
      </header>

      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Core Guarantee */}
        <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60">
          <h2 className="text-base font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            Our Core Privacy Commitment
          </h2>
          <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 mt-2">
            File Intelligence is designed from the ground up to protect user privacy. All file parsing, metadata extraction, and binary inspections are executed locally in your browser memory. Your files are not uploaded to our servers, stored in databases, or transferred to third parties.
          </p>
        </div>

        {/* 1. Files & Data Processing */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            1. Processing of User Files
          </h2>
          <p>
            When you select or drag and drop a file into any File Intelligence tool:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
            <li>
              <strong>Local Execution:</strong> The file is read directly into your device&apos;s volatile RAM using standard browser JavaScript APIs (FileReader, ArrayBuffer, Web Workers).
            </li>
            <li>
              <strong>No Cloud Storage:</strong> No copy of the file is created on any external server or cloud bucket.
            </li>
            <li>
              <strong>No Telemetry Logging:</strong> We do not log file names, document titles, author names, or file contents in server analytics.
            </li>
            <li>
              <strong>Immediate De-allocation:</strong> Once you reset the tool or close your browser tab, all temporary memory objects are cleared by the browser garbage collector.
            </li>
          </ul>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            2. Web Traffic & Hosting Logs
          </h2>
          <p>
            Like virtually all web applications, standard HTTP web servers automatically collect basic network request logs when you access our static pages. This may include:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
            <li>Your IP address and general geographic region (country/city level).</li>
            <li>Browser user-agent, operating system, and screen resolution.</li>
            <li>HTTP referrer headers and request timestamps.</li>
          </ul>
          <p>
            These access logs are used strictly for security monitoring, DDoS mitigation, and ensuring operational availability.
          </p>
        </section>

        {/* 3. Cookies and Local Storage */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            3. Cookies and Local Storage
          </h2>
          <p>
            File Intelligence does not use cookies for authentication or user profiling. We may utilize standard browser `localStorage` solely to remember client-side preferences (such as your chosen light/dark color theme or recent UI filter states).
          </p>
        </section>

        {/* 4. Third-Party Services & Advertising */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            4. Third-Party Services & Advertising
          </h2>
          <p>
            We use reliable hosting and CDN providers to deliver static web assets efficiently. These infrastructure providers adhere to strict global security and data protection standards (including GDPR and CCPA compliance).
          </p>
          <p>
            When advertising is enabled on File Intelligence, third-party vendors, including Google, may use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and other sites on the Internet.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Google Ads Settings</a> or through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">aboutads.info</a>.
          </p>
        </section>

        {/* 5. Contact Information */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            5. Contact Regarding Privacy
          </h2>
          <p>
            If you have questions or suggestions regarding our privacy practices, please contact us via our dedicated contact page or email us at <code>privacy@fileintelligence.dev</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
