import { NextResponse } from 'next/server';
import { TOOL_LIST } from '@/lib/tools-registry';
import { getBaseUrl } from '@/lib/utils';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString();

  const tools = TOOL_LIST.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastmod: currentDate,
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${tools
  .map(
    (tool) => `  <url>
    <loc>${tool.url}</loc>
    <lastmod>${tool.lastmod}</lastmod>
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
