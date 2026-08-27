# File Intelligence

> **Understand what’s inside your files.**  
> A privacy-first, client-side online file analysis toolkit.

---

## 🔒 Core Architecture: 100% Client-Side In-Browser Execution

File Intelligence parses file metadata, binary headers, OpenXML containers, and character encodings directly in the user's web browser using standard Web APIs (HTML5 File API, FileReader, ArrayBuffers, and WebAssembly).

- **Zero Cloud Uploads**: User files are processed locally in browser RAM and never transmitted to external servers.
- **Zero Data Retention**: No file contents, file names, or extracted metadata are logged or stored.
- **Deterministic Inspections**: Relies on strict RFC, ISO, and OpenXML standards for reproducible results.

---

## 🛠️ Tool Suite (v1.0)

### Office Tools
1. **XLSX Hidden Sheet Detector**: Identifies standard hidden and developer-level `xlSheetVeryHidden` worksheets.
2. **XLSX External Link Checker**: Audits external formula dependencies, UNC network paths, and linked workbooks.
3. **DOCX Metadata Checker**: Inspects Dublin Core creator properties, revision counters, and total editing time.
4. **PPTX Hidden Slide Detector**: Detects `show="0"` concealed presentation slides in PowerPoint pitch decks.

### PDF Tools
5. **PDF Page Size Checker**: Measures exact MediaBox dimensions in points, inches, and mm; flags mixed sheet formats.
6. **PDF Font Checker**: Inspects embedded fonts, subset prefixes (`ABCDEF+`), and prepress compliance.

### Image Tools
7. **Image DPI Checker**: Extracts EXIF/JFIF density tags and computes physical print sizing at 300, 150, and 72 DPI.
8. **Image Bit Depth Checker**: Analyzes PNG IHDR and JPEG SOF frames for bits per channel (bpc) and alpha transparency.

### Binary & Encoding Tools
9. **File Type / Magic Bytes Checker**: Identifies authentic formats via 70+ binary header signatures to uncover extension spoofing.
10. **File Encoding & BOM Detector**: Validates UTF-8 multi-byte octets, Byte Order Marks (BOM), and CRLF vs LF line endings.

---

## 🚀 Getting Started & Deployment

### Prerequisites
- Node.js 18.x or later
- npm or pnpm

### Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Configure `.env.local` or your hosting platform settings:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ENABLE_ADS=false
```

---

## 🌐 SEO & Standards Compliance
- **Dynamic XML Sitemap**: Generated at `/sitemap.xml` with all 21 indexable routes.
- **Structured Data**: Schema.org `WebApplication`, `FAQPage`, `BreadcrumbList`, `WebSite`, and `Organization`.
- **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `HSTS`, `Referrer-Policy`.
- **Accessibility & Mobile-First**: 100% responsive across 320px to 1920px viewports.

---

## 📄 License & Terms
© 2026 File Intelligence. All rights reserved. Read our [Privacy Policy](https://fileintelligence.dev/privacy) and [Terms of Use](https://fileintelligence.dev/terms).
