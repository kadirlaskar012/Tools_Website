import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/utils';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString();

  const pages = [
    { url: `${baseUrl}`, lastmod: currentDate },
    { url: `${baseUrl}/about`, lastmod: currentDate },
    { url: `${baseUrl}/contact`, lastmod: currentDate },
    { url: `${baseUrl}/privacy`, lastmod: currentDate },
    { url: `${baseUrl}/terms`, lastmod: currentDate },
    { url: `${baseUrl}/disclaimer`, lastmod: currentDate },
    { url: `${baseUrl}/sitemap`, lastmod: currentDate },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
