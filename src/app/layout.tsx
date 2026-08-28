import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WebsiteOrganizationSchema } from '@/components/ui/SchemaOrg';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
  width: 'device-width',
  initialScale: 1,
};

import { getBaseUrl } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'File Intelligence - Understand What’s Inside Your Files',
    template: '%s | File Intelligence',
  },
  description:
    'Inspect file properties, metadata, hidden content, dimensions, structure, and encodings quickly and privately in your browser.',
  applicationName: 'File Intelligence',
  authors: [{ name: 'File Intelligence Team' }],
  generator: 'Next.js',
  keywords: [
    'file inspector',
    'file intelligence',
    'pdf page size checker',
    'image dpi checker',
    'xlsx hidden sheet detector',
    'docx metadata checker',
    'file magic bytes',
    'client side file analysis',
    'privacy first file tools',
  ],
  creator: 'File Intelligence',
  publisher: 'File Intelligence',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getBaseUrl(),
    siteName: 'File Intelligence',
    title: 'File Intelligence - Understand What’s Inside Your Files',
    description:
      'Fast, privacy-first online file analysis toolkit. Inspect file properties, metadata, hidden content, and encodings locally in your browser.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'File Intelligence - Understand What’s Inside Your Files',
    description:
      'Fast, privacy-first online file analysis toolkit. Inspect file properties, metadata, hidden content, and encodings locally in your browser.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var pref=localStorage.getItem('fi_theme')||'auto';var isDark=false;if(pref==='dark'){isDark=true;}else if(pref==='light'){isDark=false;}else{var h=new Date().getHours();isDark=(h>=18||h<6);}if(isDark){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-150">
        <WebsiteOrganizationSchema />
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
