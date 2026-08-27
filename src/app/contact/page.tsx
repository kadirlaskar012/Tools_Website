import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactForm } from '@/components/contact/ContactForm';
import { getBaseUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact File Intelligence | Support, Suggestions & Parser Feedback',
  description:
    'Contact the File Intelligence team. Submit tool suggestions, report binary parser bugs, or ask privacy and security questions.',
  alternates: {
    canonical: `${getBaseUrl()}/contact`,
  },
  openGraph: {
    title: 'Contact File Intelligence | Support & Feedback',
    description:
      'Contact the File Intelligence team. Submit tool suggestions, report parser issues, or ask questions.',
    url: `${getBaseUrl()}/contact`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact File Intelligence | Support & Feedback',
    description:
      'Contact the File Intelligence team. Submit tool suggestions, report parser issues, or ask questions.',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Contact File Intelligence
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Have feedback, a tool suggestion, or a question regarding our client-side file inspection platform? We&apos;d love to hear from you.
        </p>
      </header>

      <ContactForm />
    </div>
  );
}
