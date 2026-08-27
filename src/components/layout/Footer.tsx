import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck, Lock, Cpu, Globe } from 'lucide-react';
import { CATEGORY_LIST } from '@/lib/categories-registry';
import { TOOL_LIST } from '@/lib/tools-registry';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 mt-auto transition-colors">
      {/* Top Banner: Local Processing Guarantee */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Client-Side Privacy Architecture
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Your files are processed locally in your browser whenever possible. No uploads, no telemetry storage.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                Zero Cloud Uploads
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-500" />
                Local Browser Execution
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group inline-flex"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
                File Intelligence
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Understand what’s inside your files. Inspect file properties, metadata, hidden content, dimensions, structure, and character encodings quickly and privately.
            </p>
            <div className="text-xs text-slate-400 dark:text-slate-500 pt-2">
              <p>Designed for professionals, developers, designers, and compliance auditors requiring reliable offline file verification.</p>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Categories
            </h3>
            <ul className="space-y-2 text-xs">
              {CATEGORY_LIST.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${cat.slug}`}
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Popular Tools
            </h3>
            <ul className="space-y-2 text-xs">
              {TOOL_LIST.slice(0, 5).map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors truncate block"
                    title={tool.title}
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Resources & Learning */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Guides & Learn
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/articles"
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Technical Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  HTML Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  About Platform
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Trust */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Legal & Privacy
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & note */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {currentYear} File Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/articles" className="hover:text-slate-600 dark:hover:text-slate-300">
              Articles
            </Link>
            <Link href="/sitemap" className="hover:text-slate-600 dark:hover:text-slate-300">
              Sitemap
            </Link>
            <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-300">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-slate-600 dark:hover:text-slate-300">
              Contact
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-600 dark:hover:text-slate-300">
              XML Index
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
