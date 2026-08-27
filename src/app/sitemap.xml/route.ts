import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/utils';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString();

  const childSitemaps = [
    {
      loc: `${baseUrl}/sitemap-pages.xml`,
      lastmod: currentDate,
    },
    {
      loc: `${baseUrl}/sitemap-categories.xml`,
      lastmod: currentDate,
    },
    {
      loc: `${baseUrl}/sitemap-tools.xml`,
      lastmod: currentDate,
    },
    {
      loc: `${baseUrl}/sitemap-articles.xml`,
      lastmod: currentDate,
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${childSitemaps
  .map(
    (sm) => `  <sitemap>
    <loc>${sm.loc}</loc>
    <lastmod>${sm.lastmod}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
