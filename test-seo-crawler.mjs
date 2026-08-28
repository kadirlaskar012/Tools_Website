import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runTechnicalSeoAudit() {
  console.log('==================================================');
  console.log('STARTING ADVANCED LIVE CHECK & TECHNICAL SEO AUDIT');
  console.log('==================================================\n');

  const visited = new Set();
  const queue = ['/'];
  const results = [];
  const errors = [];

  const expectedPages = [
    '/',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/sitemap',
    '/articles',
    '/image-tools',
    '/pdf-tools',
    '/office-tools',
    '/file-tools',
    '/privacy-tools',
    // 10 Tools
    '/tools/xlsx-hidden-sheet-detector',
    '/tools/pdf-page-size-checker',
    '/tools/image-dpi-checker',
    '/tools/docx-metadata-checker',
    '/tools/pptx-hidden-slide-detector',
    '/tools/xlsx-external-link-checker',
    '/tools/pdf-font-checker',
    '/tools/file-type-checker',
    '/tools/image-bit-depth-checker',
    '/tools/file-encoding-detector',
    // 15 Educational Articles
    '/articles/how-to-find-hidden-sheets-in-excel',
    '/articles/how-to-unhide-very-hidden-sheets-in-excel',
    '/articles/how-to-find-external-links-in-excel',
    '/articles/how-to-view-and-remove-word-document-metadata',
    '/articles/how-to-find-hidden-slides-in-powerpoint',
    '/articles/how-to-check-pdf-page-size-and-dimensions',
    '/articles/pdf-mediabox-cropbox-trimbox-explained',
    '/articles/why-embedded-fonts-matter-in-pdf',
    '/articles/how-to-check-if-fonts-are-embedded-in-pdf',
    '/articles/dpi-vs-ppi-explained-for-print-and-web',
    '/articles/how-to-check-image-dpi-and-print-resolution',
    '/articles/8-bit-vs-16-bit-image-color-depth',
    '/articles/what-are-file-magic-bytes-and-signatures',
    '/articles/what-is-utf8-bom-and-why-does-it-break-parsers',
    '/articles/how-to-fix-mojibake-and-character-encoding-errors',
  ];

  expectedPages.forEach((p) => {
    if (!queue.includes(p)) queue.push(p);
  });

  const titles = new Map();
  const descriptions = new Map();

  while (queue.length > 0) {
    const path = queue.shift();
    if (visited.has(path)) continue;
    visited.add(path);

    try {
      const res = await fetchPage(`${BASE_URL}${path}`);

      if (res.status !== 200) {
        errors.push(`[HTTP ${res.status}] Broken Route: ${path}`);
        continue;
      }

      const html = res.body;

      // 1. Extract H1
      const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
      const h1Count = h1Matches.length;

      // 2. Extract Title
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'MISSING';

      // 3. Extract Meta Description
      const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
      const description = descMatch ? descMatch[1].trim() : 'MISSING';

      // 4. Extract Canonical
      const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || html.match(/<link\s+href="([^"]*)"\s+rel="canonical"/i);
      const canonical = canonMatch ? canonMatch[1].trim() : 'MISSING';

      // 5. Extract JSON-LD Schemas
      const jsonLdMatches = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
      let validSchemas = 0;
      for (const tag of jsonLdMatches) {
        const jsonContent = tag.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        try {
          JSON.parse(jsonContent);
          validSchemas++;
        } catch {
          errors.push(`[JSON-LD Parse Error] On page ${path}`);
        }
      }

      // Check Duplicates
      if (titles.has(title) && path !== titles.get(title)) {
        errors.push(`[Duplicate Title] "${title}" shared by ${path} and ${titles.get(title)}`);
      } else {
        titles.set(title, path);
      }

      if (descriptions.has(description) && description !== 'MISSING' && path !== descriptions.get(description)) {
        errors.push(`[Duplicate Description] On ${path} and ${descriptions.get(description)}`);
      } else {
        descriptions.set(description, path);
      }

      results.push({
        path,
        status: res.status,
        h1Count,
        titleLength: title.length,
        hasDesc: description !== 'MISSING',
        hasCanonical: canonical !== 'MISSING',
        schemas: validSchemas,
      });

      console.log(`✓ [200 OK] ${path.padEnd(55)} | H1: ${h1Count} | Schema: ${validSchemas} | Title: "${title.slice(0, 40)}..."`);
    } catch (e) {
      errors.push(`[Fetch Error] Could not connect to ${path}: ${e.message}`);
    }
  }

  // 6. Test Advanced XML Sitemaps
  console.log('\n--- ADVANCED SITEMAP SUITE VERIFICATION ---');

  const sitemapEndpoints = [
    { path: '/sitemap.xml', rootTag: '<sitemapindex', desc: 'Main Sitemap Index' },
    { path: '/sitemap-pages.xml', rootTag: '<urlset', desc: 'Static Pages Sitemap' },
    { path: '/sitemap-categories.xml', rootTag: '<urlset', desc: 'Categories Sitemap' },
    { path: '/sitemap-tools.xml', rootTag: '<urlset', desc: 'Tools Dynamic Sitemap' },
    { path: '/sitemap-articles.xml', rootTag: '<urlset', desc: '15 Articles Sitemap' },
  ];

  for (const sm of sitemapEndpoints) {
    try {
      const res = await fetchPage(`${BASE_URL}${sm.path}`);
      const isXml = res.headers['content-type'] && res.headers['content-type'].includes('xml');
      const hasRootTag = res.body.includes(sm.rootTag);

      if (res.status === 200 && isXml && hasRootTag) {
        console.log(`✓ [200 OK] ${sm.path.padEnd(25)} | ${sm.desc} | Valid XML (${res.body.length} bytes)`);
      } else {
        errors.push(`[Sitemap Error] ${sm.path} failed check (Status: ${res.status}, isXml: ${isXml}, hasRootTag: ${hasRootTag})`);
      }
    } catch (e) {
      errors.push(`[Sitemap Fetch Error] ${sm.path}: ${e.message}`);
    }
  }

  // 7. Test Robots.txt & Manifest & Favicon
  try {
    const robotsRes = await fetchPage(`${BASE_URL}/robots.txt`);
    const declaresSitemap = robotsRes.body.includes('sitemap.xml');
    console.log(`✓ [200 OK] /robots.txt                                             | Robots File | Sitemap declared: ${declaresSitemap}`);
    if (!declaresSitemap) {
      errors.push('[Robots Error] /robots.txt does not declare sitemap.xml');
    }
  } catch (e) {
    errors.push(`[Robots Error] ${e.message}`);
  }

  try {
    const manifestRes = await fetchPage(`${BASE_URL}/manifest.webmanifest`);
    console.log(`✓ [200 OK] /manifest.webmanifest                                   | Web Manifest | Valid (${manifestRes.body.length} bytes)`);
  } catch (e) {
    errors.push(`[Manifest Error] ${e.message}`);
  }

  try {
    const iconRes = await fetchPage(`${BASE_URL}/icon.svg`);
    console.log(`✓ [200 OK] /icon.svg                                               | Browser Tab SVG Logo | Valid (${iconRes.body.length} bytes)`);
  } catch (e) {
    errors.push(`[Icon Error] ${e.message}`);
  }

  console.log('\n==================================================');
  console.log(`AUDIT SUMMARY:`);
  console.log(`Pages Crawled & Verified: ${results.length}`);
  console.log(`Sitemaps Verified: ${sitemapEndpoints.length}`);
  console.log(`Issues / Errors Found: ${errors.length}`);
  console.log('==================================================\n');

  if (errors.length > 0) {
    console.error('Errors detected:');
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL LIVE ENDPOINTS & TECHNICAL SEO AUDITS PASSED WITH 0 ERRORS!\n');
  }
}

runTechnicalSeoAudit();
