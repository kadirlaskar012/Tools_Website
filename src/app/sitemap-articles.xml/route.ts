import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/utils';
import { ARTICLE_LIST } from '@/lib/articles-registry';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString();

  const articles = [
    {
      url: `${baseUrl}/articles`,
      lastmod: currentDate,
    },
    ...ARTICLE_LIST.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastmod: article.updatedDate || article.publishedDate || currentDate,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${articles
  .map(
    (article) => `  <url>
    <loc>${article.url}</loc>
    <lastmod>${article.lastmod}</lastmod>
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
