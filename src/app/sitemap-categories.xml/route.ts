import { NextResponse } from 'next/server';
import { CATEGORY_LIST } from '@/lib/categories-registry';
import { getBaseUrl } from '@/lib/utils';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString();

  const categories = CATEGORY_LIST.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastmod: currentDate,
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories
  .map(
    (cat) => `  <url>
    <loc>${cat.url}</loc>
    <lastmod>${cat.lastmod}</lastmod>
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
