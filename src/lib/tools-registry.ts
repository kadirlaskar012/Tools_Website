import { ToolDefinition } from './types';

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  // ----------------------------------------------------------------------
  // 1. XLSX Hidden Sheet Detector (Priority #1)
  // ----------------------------------------------------------------------
  'xlsx-hidden-sheet-detector': {
    id: 'xlsx-hidden-sheet-detector',
    slug: 'xlsx-hidden-sheet-detector',
    title: 'XLSX Hidden Sheet Detector',
    shortDescription:
      'Inspect Excel workbooks to identify hidden and very hidden (xlSheetVeryHidden) worksheets before sharing.',
    fullDescription:
      'The XLSX Hidden Sheet Detector analyzes the internal OpenXML structure of Microsoft Excel workbooks to uncover concealed worksheets. In Excel, worksheets can be set to "Hidden" (which can be unhidden through the standard user interface) or "Very Hidden" via VBA properties (xlSheetVeryHidden, which remains completely invisible in the standard Excel UI). This tool parses the workbook relationship and sheet state definitions in your browser to give you an exhaustive inventory of all tabs, preventing accidental exposure of confidential financial models, draft calculations, or private data.',
    category: 'office',
    iconName: 'FileSpreadsheet',
    featured: true,
    popular: true,
    supportedFormats: {
      extensions: ['.xlsx', '.xlsm', '.xltx', '.xltm'],
      mimePatterns: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
      ],
      displayNames: 'Excel Workbooks (.xlsx, .xlsm, .xltx, .xltm)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'Your Excel file is parsed directly in your browser memory using client-side OpenXML decompilers. No workbook contents, cell formulas, or sheet names are ever uploaded to a server.',
    howAnalysisWorks:
      'The inspector opens the XLSX container as an in-memory ZIP package and evaluates the `xl/workbook.xml` manifest. It reads the `<sheets>` XML elements and inspects the `state` attribute for every `<sheet>` node, identifying normal, hidden, and xlSheetVeryHidden states without executing any macros.',
    deepDiveSection: {
      title: 'Hidden vs Very Hidden Excel Sheets',
      subtitle: 'Understanding Excel worksheet visibility states and security implications',
      paragraphs: [
        'Microsoft Excel supports two distinct levels of sheet concealment: standard "Hidden" and developer-level "Very Hidden" (xlSheetVeryHidden). Standard hidden sheets can be unhidden by anyone who right-clicks a visible sheet tab and selects "Unhide".',
        'In contrast, worksheets marked with `xlSheetVeryHidden` do not appear in the standard Excel Unhide dialog box at all. They are typically created using the Visual Basic Editor (VBA) or automated scripts to hide configuration data, lookup matrices, or calculation models.',
        'Crucially, neither setting provides true data encryption or security. Concealed sheets remain fully stored in the underlying OpenXML file container and can be discovered by anyone who inspects the workbook structure.',
      ],
      callout: {
        type: 'warning',
        title: 'Hiding is Not Encryption',
        text: 'Hiding a worksheet does not protect confidential data. Anyone receiving your spreadsheet can extract formulas, values, and names from hidden or very hidden tabs using file inspectors or basic scripts.',
      },
      comparisonTable: {
        headers: ['Visibility State', 'Excel Tab Bar', 'Excel Right-Click Menu', 'VBA / OpenXML Status'],
        rows: [
          {
            col1: 'Visible (Normal)',
            col2: 'Displayed normally',
            col3: 'Standard navigation',
            col4: 'state="visible" (or omitted)',
          },
          {
            col1: 'Hidden',
            col2: 'Concealed from bottom bar',
            col3: 'Visible in "Unhide" dialog',
            col4: 'state="hidden"',
          },
          {
            col1: 'Very Hidden',
            col2: 'Concealed from bottom bar',
            col3: 'Invisible (Greyed out)',
            col4: 'state="veryHidden" (xlSheetVeryHidden)',
          },
        ],
      },
    },
    howItWorksSteps: [
      {
        title: 'Select or Drop Workbook',
        description: 'Drop your XLSX or XLSM spreadsheet into the local inspection workspace.',
      },
      {
        title: 'Parse OpenXML Sheet Manifest',
        description: 'The browser inspects the workbook.xml structure to examine tab visibility declarations.',
      },
      {
        title: 'Evaluate Concealed Tabs',
        description: 'Differentiate between standard user-hidden sheets and developer-level xlSheetVeryHidden tabs.',
      },
      {
        title: 'Review Audit Inventory',
        description: 'View the complete worksheet manifest and verify tab status before distribution.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Prevent Accidental Data Leaks',
        description: 'Verify that confidential salaries, cost baselines, or internal notes are not concealed in hidden tabs prior to sending spreadsheets to clients or external partners.',
      },
      {
        title: 'Uncover VBA Very Hidden Sheets',
        description: 'Detect tabs configured with `xlSheetVeryHidden` that cannot be discovered or unhidden via the standard Microsoft Excel right-click menu.',
      },
      {
        title: 'Verify Financial & M&A Models',
        description: 'Audit complex corporate spreadsheets during due diligence to ensure all underlying modeling sheets and assumption matrices are accounted for.',
      },
    ],
    resultsExplanation: [
      {
        term: 'Visible Sheets',
        explanation: 'Worksheets with normal visibility that appear directly on the Excel bottom tab bar.',
        whyItMatters: 'These are the sheets any regular user will see immediately upon opening the workbook.',
      },
      {
        term: 'Hidden Sheets',
        explanation: 'Sheets hidden via the standard Excel menu (Right Click > Hide).',
        whyItMatters: 'Any recipient can easily unhide these sheets via the Excel UI, posing a data leakage risk if sensitive information remains.',
      },
      {
        term: 'Very Hidden Sheets (xlSheetVeryHidden)',
        explanation: 'Sheets configured with `state="veryHidden"` through the VBA IDE or macro code.',
        whyItMatters: 'These sheets do not appear in the standard Excel Unhide dialog and require VBA or XML inspection to uncover.',
      },
      {
        term: 'Sheet ID & Manifest Name',
        explanation: 'The internal OpenXML reference index and declared name stored in the file structure.',
        whyItMatters: 'Ensures you know the exact technical name of every tab even if the sheet was renamed or concealed.',
      },
    ],
    practicalExamples: [
      {
        title: 'M&A Financial Model Due Diligence',
        scenario: 'An investment analyst receives a valuation model and needs to ensure no proprietary assumptions or unlinked cost calculations are concealed.',
        outcome: 'The detector identified 2 `xlSheetVeryHidden` tabs containing unlinked tax models that were otherwise invisible in Excel.',
      },
      {
        title: 'Client Proposal Spreadsheet Scrubbing',
        scenario: 'An agency prepares a pricing proposal workbook and wants to verify that internal margin calculators were removed before emailing the client.',
        outcome: 'Found 1 standard hidden sheet named "Internal_Margins" that was promptly deleted prior to contract signing.',
      },
    ],
    fileLimitations:
      'Supports OpenXML Excel spreadsheets (.xlsx, .xlsm, .xltx, .xltm). For optimal browser performance, files up to 150MB are supported locally in memory. Password-encrypted workbooks must be decrypted before inspection.',
    contextualLinks: [
      {
        preText: 'Before sharing an Excel spreadsheet, you should also check for external formula dependencies using the',
        toolSlug: 'xlsx-external-link-checker',
        toolName: 'XLSX External Link Checker',
        postText: 'to prevent broken calculation errors.',
      },
      {
        preText: 'If you are preparing a complete document package, inspect author metadata and revision counters with the',
        toolSlug: 'docx-metadata-checker',
        toolName: 'DOCX Metadata Checker',
        postText: '.',
      },
    ],
    faqs: [
      {
        question: 'How do I find hidden sheets in Excel without opening VBA?',
        answer:
          'You can inspect any Excel workbook using this tool directly in your browser. It parses the workbook.xml structure locally to list all worksheets and their visibility states without needing desktop Excel or macro execution.',
      },
      {
        question: 'What is the difference between Hidden and xlSheetVeryHidden in Excel?',
        answer:
          'A "Hidden" sheet is concealed from the sheet tab bar but can be unhidden by right-clicking any tab and choosing "Unhide". A "Very Hidden" sheet (xlSheetVeryHidden) is configured through VBA or OpenXML and does not show up in the standard Excel Unhide menu at all.',
      },
      {
        question: 'Can formulas in visible sheets still calculate data from hidden sheets?',
        answer:
          'Yes. Excel fully evaluates formulas linked to hidden and very hidden worksheets. Concealing a worksheet only alters visual interface display—it does not disable workbook calculations.',
      },
      {
        question: 'Does this tool modify, unhide, or save changes to my spreadsheet?',
        answer:
          'No. This tool operates strictly as a read-only inspector. It analyzes your workbook structure in your browser memory and never alters, rewrites, or uploads your original file.',
      },
      {
        question: 'Why does Excel grey out the "Unhide Sheet" option in the menu?',
        answer:
          'The "Unhide Sheet" option is greyed out when there are no standard hidden sheets in the workbook. However, if the workbook contains "Very Hidden" sheets, the option will still remain greyed out because Excel does not display very hidden sheets in that dialog.',
      },
      {
        question: 'Can someone see hidden sheet data by opening the file in Google Sheets or LibreOffice?',
        answer:
          'Yes. Alternative spreadsheet viewers (such as Google Sheets, Apple Numbers, or LibreOffice Calc) may display or list hidden sheets differently. Never rely on sheet hiding to secure confidential data.',
      },
    ],
    relatedToolIds: [
      'xlsx-external-link-checker',
      'docx-metadata-checker',
      'pptx-hidden-slide-detector',
      'file-encoding-detector',
    ],
    seo: {
      metaTitle: 'XLSX Hidden Sheet Detector | Find Hidden & Very Hidden Excel Sheets',
      metaDescription:
        'Inspect Excel workbooks to identify hidden and very hidden (xlSheetVeryHidden) worksheets before sharing. 100% private in-browser analysis.',
      primaryKeyword: 'find hidden sheets in excel',
      secondaryKeywords: [
        'unhide very hidden sheets excel',
        'detect xlsheetveryhidden online',
        'how to find hidden tabs in excel',
        'excel hidden sheet checker',
        'check hidden worksheets xlsx online',
        'audit hidden sheets before sharing',
      ],
      keywords: [
        'find hidden sheets in excel',
        'unhide very hidden sheets excel',
        'xlsx hidden sheet detector',
        'detect xlsheetveryhidden',
        'excel hidden tab checker',
        'inspect hidden worksheets xlsx',
      ],
    },
  },

  // ----------------------------------------------------------------------
  // 2. Image DPI Checker (Priority #2)
  // ----------------------------------------------------------------------
  'image-dpi-checker': {
    id: 'image-dpi-checker',
    slug: 'image-dpi-checker',
    title: 'Image DPI Checker',
    shortDescription:
      'Check image DPI, PPI, pixel dimensions, and calculate exact physical print measurements online.',
    fullDescription:
      'The Image DPI Checker reads the resolution metadata headers embedded inside your image files (including EXIF IFD0, JFIF APP0, and PNG pHYs chunks). It compares declared dots per inch (DPI/PPI) with native pixel dimensions to accurately calculate maximum physical print measurements for high-quality 300 DPI commercial printing, 150 DPI draft printing, and 72 DPI screen rendering. All analysis executes locally in browser memory.',
    category: 'image',
    iconName: 'Image',
    featured: true,
    popular: true,
    supportedFormats: {
      extensions: ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'],
      mimePatterns: ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'image/bmp'],
      displayNames: 'Images (JPEG, PNG, WebP, TIFF, BMP)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'Image headers are decoded entirely on your device. High-resolution photos, graphics, and designs never leave your local browser memory.',
    howAnalysisWorks:
      'The inspector reads the binary file header. For JPEGs, it checks JFIF APP0 marker density units. For PNGs, it evaluates the pHYs (physical pixel dimensions) chunk to calculate dots per meter. It then extracts natural image dimensions to calculate physical print sizing.',
    deepDiveSection: {
      title: 'DPI vs PPI Explained: What You Need for Print vs Screen',
      subtitle: 'Understanding pixel density, resolution metadata, and physical print sizing',
      paragraphs: [
        'DPI (Dots Per Inch) and PPI (Pixels Per Inch) are often used interchangeably, but they describe different stages of image reproduction. PPI refers to the digital pixel density displayed on a screen, while DPI describes the physical printer ink dot frequency on paper.',
        'An image file is fundamentally composed of pixels (e.g., 3000 × 2000 px). The DPI value stored in an image header is simply a metadata tag—an instruction telling a printer or layout software how tightly to space those pixels during physical printing.',
        'Changing an image\'s DPI from 72 to 300 without altering its pixel dimensions does not add new detail or increase sharpness. To print at high quality (300 DPI), you need sufficient raw pixel resolution: (Print Width in Inches × 300) × (Print Height in Inches × 300).',
      ],
      callout: {
        type: 'tip',
        title: 'The 300 DPI Print Rule',
        text: 'To print a crisp 8 × 10 inch photo without blurriness, your image needs at least 2400 × 3000 pixels (8 in × 300 DPI by 10 in × 300 DPI).',
      },
      comparisonTable: {
        headers: ['Target Medium', 'Recommended DPI', 'Minimum Viewing Distance', 'Typical Pixel Requirement'],
        rows: [
          {
            col1: 'Commercial Photo & Book Print',
            col2: '300 DPI',
            col3: '12 – 18 inches (Arm\'s length)',
            col4: '2400 × 3000 px (8×10 in)',
          },
          {
            col1: 'Brochures & Flyers',
            col2: '200 – 300 DPI',
            col3: '1 – 2 feet',
            col4: '1700 × 2200 px (8.5×11 in)',
          },
          {
            col1: 'Large Posters & Banners',
            col2: '100 – 150 DPI',
            col3: '4 – 8 feet',
            col4: '2400 × 3600 px (24×36 in)',
          },
          {
            col1: 'Web & Digital Displays',
            col2: '72 – 96 PPI',
            col3: 'Screen viewing',
            col4: '1920 × 1080 px (FHD)',
          },
        ],
      },
    },
    howItWorksSteps: [
      {
        title: 'Upload or Drop Image',
        description: 'Select any JPG, PNG, TIFF, or WebP image from your computer.',
      },
      {
        title: 'Parse Header Markers',
        description: 'Extract EXIF, JFIF, or pHYs metadata to retrieve declared print density.',
      },
      {
        title: 'Calculate Print Dimensions',
        description: 'Compute exact physical print size in inches and mm at 300 DPI, 150 DPI, and 72 DPI.',
      },
      {
        title: 'Inspect Quality Readiness',
        description: 'Verify if pixel dimensions are sufficient for high-resolution commercial printing.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Verify Pre-Press Print Quality',
        description: 'Ensure uploaded artwork, marketing posters, and book covers meet the standard 300 DPI requirement before sending jobs to the print shop.',
      },
      {
        title: 'Calculate Exact Print Sizes',
        description: 'Determine exactly how large an image can be printed in inches and millimeters without pixelation or loss of detail.',
      },
      {
        title: 'Inspect PNG & JPEG Header Tags',
        description: 'Identify whether digital graphics include explicit print density markers or default to 72 DPI screen resolution.',
      },
    ],
    resultsExplanation: [
      {
        term: 'Declared DPI / PPI',
        explanation: 'The target density tag stored in the image EXIF or JFIF header marker.',
        whyItMatters: 'Tells desktop publishing and printing software how large to render the image by default.',
      },
      {
        term: 'Pixel Dimensions',
        explanation: 'The actual width and height of the image raster in native digital pixels.',
        whyItMatters: 'The true measure of image detail and maximum printable size.',
      },
      {
        term: 'Physical Print Size (@ 300 DPI)',
        explanation: 'The physical dimensions (inches and mm) if printed at commercial photo quality.',
        whyItMatters: 'Standard benchmark for brochures, business cards, books, and fine art prints.',
      },
      {
        term: 'Resolution Metadata Source',
        explanation: 'The specific binary marker (e.g., JFIF APP0, PNG pHYs) where density was detected.',
        whyItMatters: 'Confirms whether the file contains explicit hardware density metadata or relies on standard fallbacks.',
      },
    ],
    practicalExamples: [
      {
        title: 'Print-on-Demand T-Shirt Artwork Check',
        scenario: 'A designer uploads a 1800 × 2400 px graphic to a merchandise store that requires 300 DPI for a 12 × 16 inch canvas.',
        outcome: 'The tool showed the graphic can only print at 6" × 8" at 300 DPI, alerting the designer to upscale native vector assets before printing.',
      },
      {
        title: 'Wedding Album Photo Verification',
        scenario: 'A photographer checks whether exported JPEG photos meet the print lab standard of 300 DPI.',
        outcome: 'Verified that the 6000 × 4000 px photo contains 300 DPI JFIF metadata, supporting prints up to 20" × 13.3" at full quality.',
      },
    ],
    fileLimitations:
      'Supports standard raster formats (.jpg, .jpeg, .png, .webp, .tiff, .bmp) up to 150MB. Vector formats (SVG, AI) do not have fixed pixel dimensions and do not use DPI.',
    contextualLinks: [
      {
        preText: 'After checking your image DPI, you may also want to inspect color channels and bits per pixel with the',
        toolSlug: 'image-bit-depth-checker',
        toolName: 'Image Bit Depth Checker',
        postText: 'to prevent color banding in print gradients.',
      },
    ],
    faqs: [
      {
        question: 'How do I check if an image is 300 DPI online?',
        answer:
          'Drop your JPG, PNG, or TIFF image into this tool. It reads the internal EXIF/JFIF header markers and divides your image pixel dimensions by 300 to show your exact physical print size in inches and millimeters.',
      },
      {
        question: 'Why do my PNG images always show 72 DPI by default?',
        answer:
          'PNG was designed primarily for the web. Many graphic design tools export PNGs without pHYs physical density chunks, causing software to default to the standard screen display value of 72 DPI. What matters most is the total pixel count.',
      },
      {
        question: 'Does increasing DPI make an image sharper or clearer?',
        answer:
          'No. Changing only the DPI metadata tag does not add new pixels or improve image clarity. True image quality depends on the native pixel resolution captured by the camera or rendered by design software.',
      },
      {
        question: 'What is the difference between DPI and PPI?',
        answer:
          'PPI (Pixels Per Inch) measures the digital resolution of an image on a screen. DPI (Dots Per Inch) measures the mechanical density of ink dots placed on physical paper by a printer.',
      },
      {
        question: 'Can I print an image at 150 DPI instead of 300 DPI?',
        answer:
          'Yes. Large format prints viewed from several feet away (such as posters, banners, and signage) look sharp at 150 DPI or even 100 DPI because the human eye cannot resolve individual dots at greater viewing distances.',
      },
      {
        question: 'How do I calculate printable size from pixel dimensions?',
        answer:
          'Divide the pixel width and height by your target DPI. For example, a 3000 × 2400 pixel image printed at 300 DPI yields a print size of (3000/300) × (2400/300) = 10 × 8 inches.',
      },
    ],
    relatedToolIds: [
      'image-bit-depth-checker',
      'pdf-page-size-checker',
      'file-type-checker',
      'docx-metadata-checker',
    ],
    seo: {
      metaTitle: 'Image DPI Checker | Check Image DPI, PPI & Print Size Online',
      metaDescription:
        'Check image DPI, PPI, and pixel resolution instantly. Calculate physical print sizes at 300 DPI, 150 DPI, and 72 DPI with 100% private in-browser analysis.',
      primaryKeyword: 'check image dpi online',
      secondaryKeywords: [
        'check photo dpi online',
        'image ppi resolution checker',
        'calculate print size at 300 dpi',
        'how to check dpi of jpg',
        'png dpi checker online',
        'check if image is 300 dpi for printing',
      ],
      keywords: [
        'check image dpi online',
        'image dpi checker',
        'check photo dpi',
        'image ppi checker',
        '300 dpi print size calculator',
        'photo resolution checker',
      ],
    },
  },

  // ----------------------------------------------------------------------
  // 3. PDF Page Size Checker (Priority #3)
  // ----------------------------------------------------------------------
  'pdf-page-size-checker': {
    id: 'pdf-page-size-checker',
    slug: 'pdf-page-size-checker',
    title: 'PDF Page Size Checker',
    shortDescription:
      'Inspect PDF page dimensions, paper sizes (US Letter, A4), MediaBox coordinates, and detect mixed page formats.',
    fullDescription:
      'The PDF Page Size Checker extracts exact physical page dimensions from PDF document structures in points, inches, and millimeters. It reads the `/MediaBox` dictionary across all pages to match dimensions against standard international paper sizes (US Letter, Legal, Tabloid, ISO A0–A6) and alerts you to mixed page sizes or orientations within the same document.',
    category: 'pdf',
    iconName: 'FileText',
    featured: true,
    popular: true,
    supportedFormats: {
      extensions: ['.pdf'],
      mimePatterns: ['application/pdf'],
      displayNames: 'PDF Documents (.pdf)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'PDF geometries are evaluated locally inside your browser memory. Confidential legal filings, financial statements, and personal documents are never uploaded.',
    howAnalysisWorks:
      'The tool reads the PDF binary trailer, resolves page tree objects, and extracts the `/MediaBox` coordinate array `[x1, y1, x2, y2]`. It calculates dimensions using the PostScript standard (72 points = 1 inch = 25.4 mm) and classifies standard formats.',
    deepDiveSection: {
      title: 'How to Check PDF Page Dimensions Without Acrobat',
      subtitle: 'Understanding PDF coordinate boxes and mixed paper geometries',
      paragraphs: [
        'In the PDF specification, page dimensions are defined by rectangular boundary boxes measured in default user space units (where 72 points equal exactly 1 inch or 25.4 millimeters).',
        'The primary bounding box is the MediaBox, which defines the physical boundaries of the medium upon which the page is intended to be printed. Other optional boxes include CropBox (visible page area) and TrimBox (final intended trim size after printing).',
        'Documents containing mixed page dimensions (e.g., a mix of US Letter and A4, or portrait and landscape pages) frequently trigger binding errors, automatic scaling issues, or rejection by commercial print shops and legal e-filing portals.',
      ],
      callout: {
        type: 'info',
        title: 'MediaBox vs CropBox',
        text: 'The MediaBox specifies the maximum physical page boundary. The CropBox defines the visible region displayed by PDF viewers. If both are defined, the viewer clips the page to the CropBox dimensions.',
      },
      comparisonTable: {
        headers: ['Standard Paper Format', 'Dimensions (Inches)', 'Dimensions (Millimeters)', 'Dimensions (Points @ 72 pt/in)'],
        rows: [
          {
            col1: 'US Letter',
            col2: '8.50 × 11.00 in',
            col3: '215.9 × 279.4 mm',
            col4: '612.00 × 792.00 pt',
          },
          {
            col1: 'US Legal',
            col2: '8.50 × 14.00 in',
            col3: '215.9 × 355.6 mm',
            col4: '612.00 × 1008.00 pt',
          },
          {
            col1: 'ISO A4',
            col2: '8.27 × 11.69 in',
            col3: '210.0 × 297.0 mm',
            col4: '595.28 × 841.89 pt',
          },
          {
            col1: 'ISO A3',
            col2: '11.69 × 16.54 in',
            col3: '297.0 × 420.0 mm',
            col4: '841.89 × 1190.55 pt',
          },
        ],
      },
    },
    howItWorksSteps: [
      {
        title: 'Select PDF File',
        description: 'Drop any single-page or multi-page PDF document into the workspace.',
      },
      {
        title: 'Extract Box Coordinates',
        description: 'Inspect the /MediaBox dictionary to calculate exact height and width in points.',
      },
      {
        title: 'Classify Standard Formats',
        description: 'Match dimensions to US Letter, Legal, Tabloid, or ISO A0–A6 paper standards.',
      },
      {
        title: 'Audit Uniformity',
        description: 'Verify whether all pages have identical dimensions or mixed formats.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Verify Pre-Press Print Setup',
        description: 'Ensure book interiors, brochures, and legal briefs match commercial printing specifications prior to sending to production.',
      },
      {
        title: 'Detect Mixed Page Dimensions',
        description: 'Identify multi-page PDFs that inadvertently combine US Letter (8.5x11) and ISO A4 (210x297mm) pages.',
      },
      {
        title: 'Verify Court & Legal E-Filing Compliance',
        description: 'Confirm that legal submissions strictly conform to court-mandated 8.5 × 11 inch US Letter standards.',
      },
    ],
    resultsExplanation: [
      {
        term: 'Primary Paper Format',
        explanation: 'The standard paper format matching the first page (e.g., US Letter, ISO A4).',
        whyItMatters: 'Confirms whether your document was exported for North American or international paper standards.',
      },
      {
        term: 'Dimensions (Inches & Millimeters)',
        explanation: 'The physical dimensions calculated by dividing points by 72.',
        whyItMatters: 'Allows immediate verification against print shop and binder requirements.',
      },
      {
        term: 'Page Size Uniformity',
        explanation: 'Indicates whether every page has identical dimensions or contains mixed sizes.',
        whyItMatters: 'Mixed sizes cause binding errors and automatic printer scaling issues.',
      },
      {
        term: 'Orientation',
        explanation: 'Whether page width exceeds height (Landscape) or height exceeds width (Portrait).',
        whyItMatters: 'Ensures landscape spread pages do not disrupt automated document feeding.',
      },
    ],
    practicalExamples: [
      {
        title: 'Court E-Filing Submission Check',
        scenario: 'A paralegal needs to ensure an appellate brief meets federal court requirements requiring strict 8.5 × 11 inch US Letter sizing.',
        outcome: 'The checker confirmed all 45 pages were uniform US Letter (612 × 792 pt), preventing rejection by the court portal.',
      },
      {
        title: 'Architectural Drawing Print Prep',
        scenario: 'An architect exports a blueprint packet and wants to verify sheet sizes before sending to a wide-format plotter.',
        outcome: 'Detected that pages 1–4 were ISO A1 while page 5 was ISO A2, enabling correction before costly oversized printing.',
      },
    ],
    fileLimitations:
      'Supports standard PDF documents up to 150MB. Password-protected PDFs with user encryption must be unlocked before geometric inspection.',
    contextualLinks: [
      {
        preText: 'Along with page dimensions, verify that all fonts are properly embedded for commercial printing using the',
        toolSlug: 'pdf-font-checker',
        toolName: 'PDF Font Checker',
        postText: '.',
      },
    ],
    faqs: [
      {
        question: 'How do I check if my PDF is US Letter or A4 online?',
        answer:
          'Upload your PDF to this tool. It reads the MediaBox coordinates and immediately reports whether the document is US Letter (8.5 × 11 inches / 612 × 792 pt) or ISO A4 (210 × 297 mm / 595 × 842 pt).',
      },
      {
        question: 'What is a MediaBox in a PDF document?',
        answer:
          'The MediaBox is the primary boundary box defined in the PDF specification that establishes the physical paper size for printing. Coordinates are expressed in points where 72 points equal 1 inch.',
      },
      {
        question: 'Why does my PDF have mixed page sizes?',
        answer:
          'Mixed page sizes happen when combining multiple PDFs created by different applications or scanned on different hardware (for example, combining scanned receipts with standard document pages).',
      },
      {
        question: 'Can I check PDF page dimensions without installing Adobe Acrobat?',
        answer:
          'Yes. This web tool parses PDF page structures directly inside your web browser, allowing you to view exact points, inches, and millimeters without installing Adobe Acrobat or third-party desktop software.',
      },
      {
        question: 'How do PDF points convert into inches and millimeters?',
        answer:
          'In standard PDF user space, 72 points equal exactly 1 inch (25.4 mm). For example, a width of 612 points divided by 72 equals 8.5 inches.',
      },
      {
        question: 'Why do commercial print shops reject PDFs with mixed page sizes?',
        answer:
          'Commercial printing presses and automated binding equipment require uniform sheet sizes. Mixed dimensions cause automatic rescaling, clipped margins, or misaligned trimming.',
      },
    ],
    relatedToolIds: [
      'pdf-font-checker',
      'image-dpi-checker',
      'docx-metadata-checker',
      'file-type-checker',
    ],
    seo: {
      metaTitle: 'PDF Page Size Checker | Inspect PDF Dimensions & Paper Formats Online',
      metaDescription:
        'Check exact PDF page dimensions in inches, millimeters, and points. Detect mixed page formats and verify standard paper sizes in your browser.',
      primaryKeyword: 'check pdf page size online',
      secondaryKeywords: [
        'pdf dimensions checker online',
        'pdf page size in inches',
        'check mixed page sizes pdf',
        'pdf mediabox inspector',
        'us letter vs a4 pdf checker',
        'find pdf width and height online',
      ],
      keywords: [
        'check pdf page size online',
        'pdf page size checker',
        'pdf dimensions checker',
        'check pdf size in inches',
        'pdf mediabox checker',
        'pdf paper size detector',
      ],
    },
  },

  // ----------------------------------------------------------------------
  // 4. DOCX Metadata Checker (Priority #4)
  // ----------------------------------------------------------------------
  'docx-metadata-checker': {
    id: 'docx-metadata-checker',
    slug: 'docx-metadata-checker',
    title: 'DOCX Metadata Checker',
    shortDescription:
      'Inspect Microsoft Word documents for author metadata, edit times, revisions, and hidden properties.',
    fullDescription:
      'The DOCX Metadata Checker extracts Dublin Core XML and extended application properties from Microsoft Word documents. It uncovers embedded author names, last modified editors, revision numbers, total editing duration (in minutes), word/page statistics, and creation timestamps stored inside the OpenXML package before you email or publish sensitive documents.',
    category: 'office',
    iconName: 'FileText',
    featured: true,
    popular: false,
    supportedFormats: {
      extensions: ['.docx', '.docm', '.dotx', '.dotm'],
      mimePatterns: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-word.document.macroEnabled.12',
      ],
      displayNames: 'Word Documents (.docx, .docm, .dotx, .dotm)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'Document XML is inspected locally in your browser sandbox. Confidential legal briefs, contracts, and proposals are never transmitted over the internet.',
    howAnalysisWorks:
      'The inspector unzips the DOCX container in memory and parses `docProps/core.xml` (Dublin Core author, revision, timestamps) and `docProps/app.xml` (total editing time, page count, software version) using standard DOM parsers.',
    deepDiveSection: {
      title: 'Word Document Metadata & Hidden Revision Tracking',
      subtitle: 'How Dublin Core and Extended Properties reveal document history',
      paragraphs: [
        'Every time a document is created or saved in Microsoft Word, background metadata is automatically written to internal XML streams within the DOCX container.',
        'The `docProps/core.xml` part records standard Dublin Core metadata, including the original author\'s registered system username, the username of the person who last saved the file, and the cumulative revision counter.',
        'The `docProps/app.xml` part records extended properties, notably `TotalTime` (the cumulative minutes the document has been open for editing), attached template names, and application version identifiers. This metadata persists even if text is rewritten.',
      ],
      callout: {
        type: 'privacy',
        title: 'Metadata Privacy in Legal Contracts',
        text: 'Sharing unscrubbed DOCX files can expose internal client names, previous draft authors, and exact editing durations to opposing counsel or competing bidders.',
      },
    },
    howItWorksSteps: [
      {
        title: 'Select Word Document',
        description: 'Drop any .docx or .docm document into the private inspection window.',
      },
      {
        title: 'Parse docProps/core.xml',
        description: 'Extract creator name, last modified editor, and revision sequence numbers.',
      },
      {
        title: 'Parse docProps/app.xml',
        description: 'Extract total editing time in minutes, template names, and page counts.',
      },
      {
        title: 'Review Privacy Summary',
        description: 'Audit identifying markers to determine if metadata scrubbing is required.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Sanitize Legal & Business Contracts',
        description: 'Confirm that previous author names, internal company templates, and editing histories are not inadvertently shared with external parties.',
      },
      {
        title: 'Audit Document Revision History',
        description: 'View the total revision counter and cumulative editing time to assess document maturity.',
      },
      {
        title: 'Verify Document Authenticity',
        description: 'Inspect exact creation and modification timestamps recorded in the file structure.',
      },
    ],
    resultsExplanation: [
      {
        term: 'Document Author / Creator',
        explanation: 'The system username registered when the document was initially created.',
        whyItMatters: 'Can reveal original authors or template sources even in heavily edited documents.',
      },
      {
        term: 'Last Modified By',
        explanation: 'The user identity that executed the most recent save operation.',
        whyItMatters: 'Identifies the most recent editor of the shared file.',
      },
      {
        term: 'Total Editing Time',
        explanation: 'The cumulative number of minutes the file was actively open in Word.',
        whyItMatters: 'Indicates how much time was spent drafting and revising the document.',
      },
      {
        term: 'Revision Count',
        explanation: 'An integer incremented each time the document is saved.',
        whyItMatters: 'Reflects how many save cycles the file has undergone.',
      },
    ],
    practicalExamples: [
      {
        title: 'Legal Contract Metadata Audit',
        scenario: 'A corporate attorney prepares a settlement agreement and wants to ensure the metadata does not reveal internal associate names or draft times.',
        outcome: 'The inspector revealed the original author username and 420 minutes of editing time, prompting the lawyer to sanitize properties before distribution.',
      },
      {
        title: 'Freelance Proposal Verification',
        scenario: 'A consultant verifies a proposal before sending it to a prospect to ensure an old client template name is not visible.',
        outcome: 'Confirmed the template was set to standard "Normal.dotm" with clean creator properties.',
      },
    ],
    fileLimitations:
      'Supports OpenXML Word documents (.docx, .docm, .dotx, .dotm) up to 150MB. Legacy binary Word files (.doc) must be saved as .docx first.',
    contextualLinks: [
      {
        preText: 'If you are reviewing spreadsheets alongside documents, check for concealed worksheets with the',
        toolSlug: 'xlsx-hidden-sheet-detector',
        toolName: 'XLSX Hidden Sheet Detector',
        postText: '.',
      },
      {
        preText: 'You can also check presentations for hidden slides using the',
        toolSlug: 'pptx-hidden-slide-detector',
        toolName: 'PPTX Hidden Slide Detector',
        postText: '.',
      },
    ],
    faqs: [
      {
        question: 'How do I inspect Word document metadata online without uploading files?',
        answer:
          'This tool unzips your DOCX container directly inside your browser memory using client-side JavaScript. It extracts author, editor, and revision metadata without transmitting your document to any server.',
      },
      {
        question: 'Can recipients see how long I spent editing a Word document?',
        answer:
          'Yes. Microsoft Word automatically tracks cumulative editing time in minutes within `docProps/app.xml` under the `<TotalTime>` tag. Anyone with access to the DOCX file can read this property.',
      },
      {
        question: 'Does this tool remove or scrub metadata from my Word document?',
        answer:
          'No. This tool is a read-only metadata inspector. To remove metadata, you can use Word\'s built-in "Inspect Document" tool (File > Info > Check for Issues > Inspect Document) or export to a clean PDF.',
      },
      {
        question: 'What is the difference between docProps/core.xml and app.xml?',
        answer:
          'core.xml contains standard Dublin Core properties like author, subject, title, and last modified user. app.xml contains document-specific statistics like word count, page count, editing duration, and application versions.',
      },
      {
        question: 'Does converting a Word document to PDF remove all metadata?',
        answer:
          'Not necessarily. Depending on the PDF export settings, Word may transfer author names, creation dates, and titles into the resulting PDF document properties.',
      },
      {
        question: 'Why does the creator name differ from the last modified user?',
        answer:
          'The creator name reflects the user account that originally created the document file (or the template it was based on), whereas "Last Modified By" reflects the user who performed the most recent save.',
      },
    ],
    relatedToolIds: [
      'pptx-hidden-slide-detector',
      'xlsx-hidden-sheet-detector',
      'pdf-font-checker',
      'file-type-checker',
    ],
    seo: {
      metaTitle: 'DOCX Metadata Checker | View Word Document Author & Hidden Properties',
      metaDescription:
        'Inspect Word document metadata, author identity, last modified user, revision history, and total editing time directly in your browser.',
      primaryKeyword: 'inspect word document metadata',
      secondaryKeywords: [
        'docx metadata checker online',
        'check word document author online',
        'view hidden properties docx',
        'word document total editing time checker',
        'check docx revision count',
        'word document privacy audit',
      ],
      keywords: [
        'inspect word document metadata',
        'docx metadata checker',
        'check word metadata online',
        'view docx author',
        'word document properties inspector',
        'check word editing time',
      ],
    },
  },

  // ----------------------------------------------------------------------
  // 5. PDF Font Checker (Priority #5)
  // ----------------------------------------------------------------------
  'pdf-font-checker': {
    id: 'pdf-font-checker',
    slug: 'pdf-font-checker',
    title: 'PDF Font Checker',
    shortDescription:
      'Inspect PDF embedded fonts, subset tags (ABCDEF+), font formats, and prepress print compliance.',
    fullDescription:
      'The PDF Font Checker inspects the `/Font` resource dictionaries across all pages of your PDF documents. It identifies font families, subtypes (Type 1, TrueType, Type 0 / CIDFont), subset status (indicated by standard 6-letter tag prefixes such as `ABCDEF+`), and flags non-embedded fonts that risk unexpected glyph substitutions or print shop rejections.',
    category: 'pdf',
    iconName: 'FileText',
    featured: false,
    popular: false,
    supportedFormats: {
      extensions: ['.pdf'],
      mimePatterns: ['application/pdf'],
      displayNames: 'PDF Documents (.pdf)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'PDF dictionaries and font descriptors are parsed strictly in your browser memory without cloud processing.',
    howAnalysisWorks:
      'The inspector traverses page `/Resources` dictionaries, resolves indirect `/Font` object references, and evaluates `/FontDescriptor` keys (checking for `/FontFile`, `/FontFile2`, `/FontFile3`) and subset prefix patterns to verify embedding status.',
    deepDiveSection: {
      title: 'Embedded Fonts vs Subsetted Fonts in PDF Preflight',
      subtitle: 'Why missing font glyphs cause prepress print failures',
      paragraphs: [
        'When a PDF is created, text can reference fonts in three different ways: fully embedded, subset embedded, or non-embedded (system dependent).',
        'A Fully Embedded font includes the entire character set of the typeface. A Subsetted Font includes only the exact glyphs used in the document, which saves file size while ensuring that text renders identically on any device.',
        'Subset fonts are universally identified by a 6-letter random uppercase prefix followed by a plus sign (e.g., `ABCDEF+HelveticaBold`).',
        'If a font is Non-Embedded, the viewing device or commercial print RIP (Raster Image Processor) must substitute an installed local font, which frequently causes text reflow, overlapping characters, or missing symbols.',
      ],
      callout: {
        type: 'warning',
        title: 'Prepress Standard Compliance',
        text: 'PDF/X and PDF/A standards for commercial print and legal archiving mandate that 100% of referenced fonts must be embedded or subsetted.',
      },
      comparisonTable: {
        headers: ['Embedding Status', 'File Size Impact', 'Visual Fidelity Across Devices', 'Print Shop / PDF-A Status'],
        rows: [
          {
            col1: 'Subset Embedded (ABCDEF+)',
            col2: 'Minimal (Only used glyphs)',
            col3: '100% Exact across all systems',
            col4: 'Passed (Industry standard)',
          },
          {
            col1: 'Fully Embedded',
            col2: 'Moderate (Complete font table)',
            col3: '100% Exact across all systems',
            col4: 'Passed (Compliant)',
          },
          {
            col1: 'Non-Embedded',
            col2: 'None (References system font)',
            col3: 'High risk of font substitution',
            col4: 'Failed (High rejection risk)',
          },
        ],
      },
    },
    howItWorksSteps: [
      {
        title: 'Select PDF File',
        description: 'Drop any PDF document into the in-browser font inspector.',
      },
      {
        title: 'Traverse /Font Dictionaries',
        description: 'Scan page resources to catalog all declared font families and subtypes.',
      },
      {
        title: 'Check Font Descriptors',
        description: 'Inspect /FontFile streams and 6-character subset tags (ABCDEF+).',
      },
      {
        title: 'Review Pre-Press Compliance',
        description: 'Confirm that all referenced typography is embedded for error-free printing.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Prevent Print Font Substitution',
        description: 'Ensure commercial print presses do not substitute missing fonts with Courier or generic sans-serif fallbacks.',
      },
      {
        title: 'Verify PDF/A Archival Standards',
        description: 'Audit document compliance for long-term archiving where non-embedded fonts are strictly prohibited.',
      },
      {
        title: 'Catalog Document Typography',
        description: 'Quickly inspect which typefaces and font subtypes are embedded across multi-page publications.',
      },
    ],
    resultsExplanation: [
      {
        term: 'Embedded Fonts',
        explanation: 'Fonts whose character glyph outlines are stored directly within the PDF container.',
        whyItMatters: 'Guarantees the document renders identically on any computer or printing press.',
      },
      {
        term: 'Subsetted Fonts',
        explanation: 'Fonts that include only the specific glyphs used, marked with a 6-letter prefix (e.g., ABCDEF+).',
        whyItMatters: 'The standard prepress method to ensure visual fidelity with optimized file size.',
      },
      {
        term: 'Non-Embedded / Missing',
        explanation: 'Fonts referenced by the document but missing from the internal file package.',
        whyItMatters: 'Triggers font substitution warnings and potential print rejection.',
      },
      {
        term: 'Font Subtypes',
        explanation: 'The font technology format (Type 1, TrueType, OpenType, CIDFont).',
        whyItMatters: 'Identifies modern Unicode vs legacy PostScript typefaces.',
      },
    ],
    practicalExamples: [
      {
        title: 'Magazine Prepress Preflight Check',
        scenario: 'A production designer verifies a 64-page catalog PDF before sending it to a commercial offset printer.',
        outcome: 'The tool identified 1 non-embedded font ("DIN-Bold"), allowing the designer to re-export with subsetting enabled before press setup.',
      },
      {
        title: 'Academic Dissertation Archival Verification',
        scenario: 'A graduate student checks if a thesis meets university institutional repository requirements requiring embedded fonts.',
        outcome: 'Confirmed that all 8 font subsets were embedded, passing library submission checks.',
      },
    ],
    fileLimitations:
      'Supports standard PDF files up to 150MB. Vectorized/outlined text (where glyphs were converted to paths) does not use font dictionaries.',
    contextualLinks: [
      {
        preText: 'Along with font embedding, ensure page dimensions match print shop paper sizes using the',
        toolSlug: 'pdf-page-size-checker',
        toolName: 'PDF Page Size Checker',
        postText: '.',
      },
    ],
    faqs: [
      {
        question: 'How do I know if fonts are embedded in my PDF online?',
        answer:
          'Upload your PDF to this tool. It inspects all internal `/Font` dictionaries and `/FontDescriptor` streams to report which fonts are embedded, which are subsets, and which are missing.',
      },
      {
        question: 'What does the 6-letter prefix (like ABCDEF+Arial) in a font name mean?',
        answer:
          'A 6-letter uppercase tag followed by a plus sign indicates a "subsetted font." When PDF creators embed only the characters used in your document (rather than the full font file), they attach a unique prefix according to the PDF specification.',
      },
      {
        question: 'What happens if a PDF has non-embedded fonts?',
        answer:
          'If a PDF with non-embedded fonts is opened on a computer that lacks that specific font, the PDF viewer or printer will substitute a fallback font, often causing overlapping text, misaligned margins, or missing symbols.',
      },
      {
        question: 'Why do commercial printers require all fonts to be embedded?',
        answer:
          'Commercial printing presses use automated RIPs (Raster Image Processors). If a font is missing from the file, the RIP may fail or substitute generic fonts, ruining the printed run.',
      },
      {
        question: 'What is the difference between a fully embedded font and a subset font?',
        answer:
          'A fully embedded font includes every letter, number, and glyph in the typeface. A subset embedded font includes only the specific characters used in that document, saving file size while preserving 100% exact rendering.',
      },
      {
        question: 'How can I fix non-embedded fonts in my PDF?',
        answer:
          'Re-export the PDF from your source application (InDesign, Word, Canva) and ensure the export settings have "Embed all fonts" or "Subset fonts" enabled.',
      },
    ],
    relatedToolIds: [
      'pdf-page-size-checker',
      'image-dpi-checker',
      'docx-metadata-checker',
      'file-type-checker',
    ],
    seo: {
      metaTitle: 'PDF Font Checker | Check PDF Embedded Fonts & Pre-Press Status',
      metaDescription:
        'Inspect PDF embedded fonts, subset status, font types (Type 1, TrueType, CIDFont), and pre-press compliance locally in your browser.',
      primaryKeyword: 'pdf font checker online',
      secondaryKeywords: [
        'verify font embedding in pdf',
        'find non-embedded fonts in pdf',
        'pdf font subset inspector',
        'check pdf fonts for print preflight',
        'pdf a font compliance checker',
      ],
      keywords: [
        'pdf font checker online',
        'pdf font checker',
        'check embedded fonts pdf',
        'pdf font subset checker',
        'verify fonts in pdf',
        'pdf preflight font inspector',
      ],
    },
  },

  // ----------------------------------------------------------------------
  // 6. File Type / Magic Bytes Checker (Priority #6)
  // ----------------------------------------------------------------------
  'file-type-checker': {
    id: 'file-type-checker',
    slug: 'file-type-checker',
    title: 'File Type / Magic Bytes Checker',
    shortDescription:
      'Identify true file formats, MIME types, and header magic bytes to detect spoofed file extensions.',
    fullDescription:
      'The File Type Checker inspects the leading binary signature (magic bytes) of any file to verify its authentic underlying format. By comparing initial byte patterns against an extensive database of 70+ binary specifications, it uncovers files with missing, renamed, or spoofed extensions (such as an executable renamed to `.pdf` or a PNG renamed to `.jpg`) and displays raw hex header previews.',
    category: 'file',
    iconName: 'FileCode2',
    featured: true,
    popular: true,
    supportedFormats: {
      extensions: ['*'],
      mimePatterns: ['*/*'],
      displayNames: 'All File Formats (Any Extension)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'Binary headers are evaluated locally in your browser sandbox. File bytes never leave your device.',
    howAnalysisWorks:
      'The tool reads the first 512 bytes using the HTML5 FileReader ArrayBuffer API and matches the signature against known binary magic numbers (e.g., `%PDF`, `\x89PNG`, `PK\x03\x04`, `MZ`, `\x7FELF`).',
    deepDiveSection: {
      title: 'How Binary Magic Bytes Identify Real File Types',
      subtitle: 'Why file extensions can be deceptive and how headers reveal true formats',
      paragraphs: [
        'Operating systems and users frequently rely on file extensions (such as `.pdf`, `.docx`, or `.jpg`) to decide how to handle a file. However, file extensions are merely naming conventions—they can be easily changed, stripped, or spoofed.',
        'Binary file formats contain standardized header sequences known as "magic numbers" or "magic bytes" placed at specific offsets (usually byte offset 0).',
        'For example, genuine PDF files always begin with the ASCII characters `%PDF` (hex: `25 50 44 46`), PNG images begin with `89 50 4E 47`, and ZIP/Office OpenXML files begin with `50 4B 03 04` (`PK..`). Analyzing magic bytes reveals the authentic MIME type regardless of what the file is named.',
      ],
      callout: {
        type: 'warning',
        title: 'Extension Spoofing Security Risks',
        text: 'Malicious executables and scripts frequently masquerade with `.pdf` or `.jpg` extensions to bypass basic email filters or trick users into double-clicking them.',
      },
      comparisonTable: {
        headers: ['Format Name', 'Declared Extension', 'Leading Magic Bytes (Hex Dump)', 'Verified MIME Type'],
        rows: [
          {
            col1: 'Adobe PDF',
            col2: '.pdf',
            col3: '25 50 44 46 (%PDF)',
            col4: 'application/pdf',
          },
          {
            col1: 'PNG Image',
            col2: '.png',
            col3: '89 50 4E 47 0D 0A 1A 0A',
            col4: 'image/png',
          },
          {
            col1: 'JPEG Image',
            col2: '.jpg, .jpeg',
            col3: 'FF D8 FF',
            col4: 'image/jpeg',
          },
          {
            col1: 'ZIP / OpenXML (DOCX, XLSX)',
            col2: '.zip, .docx, .xlsx',
            col3: '50 4B 03 04 (PK..)',
            col4: 'application/zip',
          },
          {
            col1: 'Windows Executable',
            col2: '.exe, .dll',
            col3: '4D 5A (MZ)',
            col4: 'application/x-dosexec',
          },
        ],
      },
    },
    howItWorksSteps: [
      {
        title: 'Select Any File',
        description: 'Drop any file with or without an extension into the inspector.',
      },
      {
        title: 'Read Header Bytes',
        description: 'Read the leading 512 binary bytes in browser memory.',
      },
      {
        title: 'Match Signature Database',
        description: 'Compare byte sequences against 70+ standardized format specifications.',
      },
      {
        title: 'Detect Extension Mismatches',
        description: 'Flag mismatches between declared filename extensions and authentic binary headers.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Detect File Extension Spoofing',
        description: 'Verify whether an attachment named `.pdf` or `.docx` is secretly an executable or archive.',
      },
      {
        title: 'Identify Files with Missing Extensions',
        description: 'Recover the authentic format of extensionless downloaded files or database blobs.',
      },
      {
        title: 'Inspect Raw Binary Hex Headers',
        description: 'View leading byte dumps in hex notation for fast debugging and technical triage.',
      },
    ],
    resultsExplanation: [
      {
        term: 'Detected Authentic Format',
        explanation: 'The verified file format matching the binary magic bytes signature.',
        whyItMatters: 'Confirms the true format regardless of the filename extension.',
      },
      {
        term: 'Verified MIME Type',
        explanation: 'The standard IANA media type associated with the detected header.',
        whyItMatters: 'Essential for configuring web servers and API uploads correctly.',
      },
      {
        term: 'Extension Authenticity',
        explanation: 'Indicates whether the declared filename extension matches the true binary header.',
        whyItMatters: 'Alerts you to accidental renames or deceptive extension spoofing.',
      },
      {
        term: 'Header Signature (Hex)',
        explanation: 'The leading 16 bytes displayed in hexadecimal notation.',
        whyItMatters: 'Provides raw binary verification for forensic analysts and developers.',
      },
    ],
    practicalExamples: [
      {
        title: 'Unidentified Server Blob Recovery',
        scenario: 'A developer downloads an unlabelled file named `download_9482` with no extension from a legacy backup.',
        outcome: 'The tool identified the magic bytes `89 50 4E 47`, confirming it was a PNG image.',
      },
      {
        title: 'Email Attachment Extension Spoofing Check',
        scenario: 'A security officer checks a suspicious invoice named `Invoice_March.pdf` before opening.',
        outcome: 'The tool flagged an Extension Mismatch: the header showed `4D 5A` (Windows Portable Executable), preventing execution of malware.',
      },
    ],
    fileLimitations:
      'Supports files of any format up to 150MB. Plain text files without distinctive headers are analyzed using character set and BOM detection.',
    contextualLinks: [
      {
        preText: 'For plain text and CSV files, you can also inspect character sets and Unicode markers using the',
        toolSlug: 'file-encoding-detector',
        toolName: 'File Encoding Detector',
        postText: '.',
      },
    ],
    faqs: [
      {
        question: 'What are magic bytes and file signatures?',
        answer:
          'Magic bytes (or file signatures) are specific sequences of bytes placed at the beginning of a file that identify its file format. Operating systems and programs read these bytes to understand how to decode the file regardless of its filename extension.',
      },
      {
        question: 'How do I find the real format of a file without an extension?',
        answer:
          'Drop the extensionless file into this tool. It reads the first 512 bytes and matches the binary header against 70+ format definitions to tell you the authentic file type and MIME category.',
      },
      {
        question: 'Why do attackers spoof file extensions?',
        answer:
          'Attackers rename executable files (e.g., `.exe` or `.scr`) to harmless extensions like `.pdf` or `.jpg` to trick users into opening them or to bypass simple filename-based security filters.',
      },
      {
        question: 'What are common magic bytes for PDF, PNG, and ZIP files?',
        answer:
          'PDF files start with `%PDF` (hex `25 50 44 46`), PNG images start with `89 50 4E 47`, and ZIP files (including Office `.docx` and `.xlsx` files) start with `PK` (hex `50 4B 03 04`).',
      },
      {
        question: 'Does changing a file extension convert its format?',
        answer:
          'No. Renaming `file.png` to `file.jpg` does not convert the internal image data; it only changes the label. The underlying file remains a PNG with PNG magic bytes.',
      },
      {
        question: 'Is it safe to inspect suspicious files with this tool?',
        answer:
          'Yes. This tool runs entirely in your local browser sandbox and only reads the header bytes without executing scripts or macros.',
      },
    ],
    relatedToolIds: [
      'file-encoding-detector',
      'image-dpi-checker',
      'docx-metadata-checker',
      'pdf-page-size-checker',
    ],
    seo: {
      metaTitle: 'File Type Checker | Identify True Format by Magic Bytes & Header',
      metaDescription:
        'Detect the true format and MIME type of any file using binary header magic bytes. Uncover extension mismatches and spoofed files in your browser.',
      primaryKeyword: 'check file type by magic bytes',
      secondaryKeywords: [
        'file type checker online',
        'identify true file format by header',
        'binary file signature inspector',
        'hex header analyzer online',
        'detect file extension mismatch',
        'check real mime type online',
      ],
      keywords: [
        'check file type by magic bytes',
        'file type checker',
        'magic bytes detector',
        'file signature checker',
        'identify file format online',
        'check mime type by header',
      ],
    },
  },

  // ----------------------------------------------------------------------
  // 7. File Encoding & BOM Detector (Priority #7)
  // ----------------------------------------------------------------------
  'file-encoding-detector': {
    id: 'file-encoding-detector',
    slug: 'file-encoding-detector',
    title: 'File Encoding Detector',
    shortDescription:
      'Detect character encodings (UTF-8, UTF-16, ANSI), Byte Order Marks (BOM), and CRLF/LF line endings.',
    fullDescription:
      'The File Encoding Detector inspects text, CSV, JSON, and source code files to determine character encodings, Unicode Byte Order Marks (BOM), and line ending formats. It validates UTF-8 multi-byte sequences, identifies UTF-16/UTF-32 BOM markers, flags legacy Windows-1252/ANSI encodings, and identifies CRLF vs LF line breaks to prevent database import failures and garbled text (Mojibake).',
    category: 'file',
    iconName: 'FileCode2',
    featured: false,
    popular: false,
    supportedFormats: {
      extensions: ['.txt', '.csv', '.json', '.xml', '.html', '.js', '.ts', '.py', '.sql', '.md'],
      mimePatterns: ['text/*', 'application/json', 'application/csv'],
      displayNames: 'Text & Data Files (.txt, .csv, .json, .xml, .sql, .md)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'Text byte sequences and character tables are evaluated locally in your browser memory. Data files are never uploaded.',
    howAnalysisWorks:
      'The tool reads the leading 4096 bytes. It checks for Unicode BOM signatures (`EF BB BF`, `FF FE`, `FE FF`), validates strict UTF-8 state-machine multi-byte octet rules, and counts `\r\n` vs `\n` line endings.',
    deepDiveSection: {
      title: 'Character Encoding, UTF-8 BOM, and Line Endings (CRLF vs LF)',
      subtitle: 'Why encoding mismatches cause Mojibake and database errors',
      paragraphs: [
        'Character encoding defines how digital bytes map to human-readable characters. When an application reads a file using the wrong character encoding (such as reading a Windows-1252 ANSI file as UTF-8), non-ASCII characters such as accented letters, currency symbols, and quotes appear as garbled characters (known as Mojibake, like `Ã©` instead of `é`).',
        'A Byte Order Mark (BOM) is a special sequence of bytes at the very beginning of a text stream (`0xEF 0xBB 0xBF` for UTF-8). While common in Windows applications like Excel and Notepad, a UTF-8 BOM can cause major parsing errors in JSON parsers, Unix shell scripts, and web server configuration files.',
        'Similarly, Windows uses Carriage Return + Line Feed (`CRLF` / `\r\n`), whereas Unix and macOS use Line Feed (`LF` / `\n`). Mismatched line endings can trigger script syntax errors and git diff noise.',
      ],
      callout: {
        type: 'info',
        title: 'BOM in CSV Files',
        text: 'Microsoft Excel often requires a UTF-8 BOM to correctly display foreign accents in CSV files, whereas database import tools often fail if a BOM is present.',
      },
      comparisonTable: {
        headers: ['Encoding Standard', 'BOM Signature (Hex)', 'Typical Line Ending', 'Common Compatibility Notes'],
        rows: [
          {
            col1: 'UTF-8 without BOM',
            col2: 'None',
            col3: 'LF (\n) or CRLF (\r\n)',
            col4: 'Universal web & programming standard',
          },
          {
            col1: 'UTF-8 with BOM',
            col2: 'EF BB BF',
            col3: 'CRLF (\r\n)',
            col4: 'Excel CSV compatibility; breaks some JSON parsers',
          },
          {
            col1: 'UTF-16 Little Endian (LE)',
            col2: 'FF FE',
            col3: 'CRLF (\r\n)',
            col4: 'Windows internal Unicode format',
          },
          {
            col1: 'Windows-1252 / ANSI',
            col2: 'None (Single-byte)',
            col3: 'CRLF (\r\n)',
            col4: 'Legacy Windows; causes Mojibake in UTF-8 systems',
          },
        ],
      },
    },
    howItWorksSteps: [
      {
        title: 'Upload Text or CSV File',
        description: 'Drop any text, CSV, JSON, or source code file into the workspace.',
      },
      {
        title: 'Scan Byte Order Marks',
        description: 'Check for UTF-8 (`EF BB BF`) and UTF-16 (`FF FE`) BOM headers.',
      },
      {
        title: 'Validate Byte Sequences',
        description: 'Evaluate multi-byte octets to verify strict UTF-8 compliance vs ANSI.',
      },
      {
        title: 'Detect Line Endings',
        description: 'Count `\\r\\n` (CRLF) vs `\\n` (LF) line break structures.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Diagnose CSV Database Import Failures',
        description: 'Identify hidden UTF-8 BOMs or Windows-1252 character encodings that cause database ingestion scripts to fail.',
      },
      {
        title: 'Fix Garbled Text (Mojibake)',
        description: 'Determine the correct character encoding to restore corrupted international characters and symbols.',
      },
      {
        title: 'Verify Unix vs Windows Line Endings',
        description: 'Confirm whether shell scripts use Unix LF line endings to avoid syntax errors on Linux servers.',
      },
    ],
    resultsExplanation: [
      {
        term: 'Detected Character Set',
        explanation: 'The verified text encoding format (e.g., UTF-8, Windows-1252, UTF-16).',
        whyItMatters: 'Tells you which charset parameter to specify in your database, editor, or API.',
      },
      {
        term: 'Byte Order Mark (BOM)',
        explanation: 'Whether an explicit Unicode byte marker is present at byte offset 0.',
        whyItMatters: 'Explains why certain JSON parsers or shell scripts may fail on the file.',
      },
      {
        term: 'Line Ending Format',
        explanation: 'The line break standard used throughout the file (CRLF vs LF).',
        whyItMatters: 'Ensures cross-platform compatibility between Windows and Unix/Linux environments.',
      },
      {
        term: 'Detection Confidence',
        explanation: 'Statistical confidence based on byte sequence validity.',
        whyItMatters: 'Confirms whether the encoding is definitively identified via BOM or verified via state machine.',
      },
    ],
    practicalExamples: [
      {
        title: 'PostgreSQL CSV Ingestion Failure',
        scenario: 'A database administrator encounters a syntax error on column 1 when importing a customer data CSV exported from Excel.',
        outcome: 'The tool identified a UTF-8 BOM (`0xEF 0xBB 0xBF`), which was causing the database to misread the first header name.',
      },
      {
        title: 'Linux Bash Script Syntax Error',
        scenario: 'A developer\'s bash script fails with `\r: command not found` on Ubuntu.',
        outcome: 'Confirmed the file used Windows CRLF line endings instead of Unix LF, pinpointing the issue immediately.',
      },
    ],
    fileLimitations:
      'Supports text, CSV, JSON, XML, SQL, and code files up to 150MB. Binary container files should be checked with the File Type Checker.',
    contextualLinks: [
      {
        preText: 'To verify the overall binary file structure or detect extension spoofing, use the',
        toolSlug: 'file-type-checker',
        toolName: 'File Type / Magic Bytes Checker',
        postText: '.',
      },
    ],
    faqs: [
      {
        question: 'How do I detect file encoding online without uploading sensitive data?',
        answer:
          'This tool reads the binary byte sequences of your file locally in your web browser. It evaluates UTF-8 byte rules and Unicode Byte Order Marks without transmitting your text data to external servers.',
      },
      {
        question: 'What is a Byte Order Mark (BOM) in UTF-8?',
        answer:
          'A UTF-8 BOM is a 3-byte sequence (`0xEF 0xBB 0xBF`) placed at the start of a text file. While intended to signal UTF-8 encoding, it is unnecessary in UTF-8 and can break JSON parsers, PHP scripts, and Linux shell commands.',
      },
      {
        question: 'Why do foreign accents and special characters appear garbled (Mojibake)?',
        answer:
          'Mojibake occurs when a file saved in one encoding (such as Windows-1252 or ISO-8859-1) is read by an application expecting UTF-8, causing multi-byte characters to be misrendered.',
      },
      {
        question: 'What is the difference between CRLF and LF line endings?',
        answer:
          'CRLF (`\r\n`) is the standard Windows line break format. LF (`\n`) is the standard format for Linux, macOS, and Unix systems. Running a script with CRLF line endings on Linux can cause execution errors.',
      },
      {
        question: 'Why does Excel require a BOM for UTF-8 CSV files?',
        answer:
          'Microsoft Excel historically assumes CSV files without a BOM are encoded in legacy Windows ANSI. Adding a UTF-8 BOM tells Excel to interpret international characters as UTF-8.',
      },
      {
        question: 'Can this tool detect UTF-16 and UTF-32 encodings?',
        answer:
          'Yes. The tool inspects BOM markers for UTF-16 Little Endian, UTF-16 Big Endian, and UTF-32 Big Endian formats.',
      },
    ],
    relatedToolIds: [
      'file-type-checker',
      'xlsx-hidden-sheet-detector',
      'docx-metadata-checker',
      'image-dpi-checker',
    ],
    seo: {
      metaTitle: 'File Encoding Detector | Detect UTF-8, BOM & Line Endings Online',
      metaDescription:
        'Detect character encodings (UTF-8, UTF-16, ANSI), Byte Order Marks (BOM), and CRLF/LF line endings in text, CSV, and code files locally in your browser.',
      primaryKeyword: 'detect file encoding online',
      secondaryKeywords: [
        'file encoding detector online',
        'check utf-8 vs windows-1252',
        'detect byte order mark bom in text',
        'csv character encoding checker',
        'check crlf vs lf line endings online',
        'fix mojibake character encoding',
      ],
      keywords: [
        'detect file encoding online',
        'file encoding detector',
        'check utf-8 bom',
        'detect csv encoding',
        'check line endings crlf lf',
        'character set detector',
      ],
    },
  },

  // ----------------------------------------------------------------------
  // 8. XLSX External Link Checker (Priority #8)
  // ----------------------------------------------------------------------
  'xlsx-external-link-checker': {
    id: 'xlsx-external-link-checker',
    slug: 'xlsx-external-link-checker',
    title: 'XLSX External Link Checker',
    shortDescription:
      'Scan Excel spreadsheets for external workbook references, file path links, and external data connections.',
    fullDescription:
      'The XLSX External Link Checker audits Microsoft Excel workbooks for external formula dependencies and linked workbook paths. It inspects internal OpenXML relationships (`xl/_rels/workbook.xml.rels` and `xl/externalLinks/`) to catalog referenced spreadsheets, network UNC server paths, and remote data connections, helping you avoid broken formula errors (#REF!) and prevent accidental exposure of confidential internal server file paths.',
    category: 'office',
    iconName: 'FileSpreadsheet',
    featured: false,
    popular: false,
    supportedFormats: {
      extensions: ['.xlsx', '.xlsm', '.xltx', '.xltm'],
      mimePatterns: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
      ],
      displayNames: 'Excel Workbooks (.xlsx, .xlsm, .xltx, .xltm)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'Workbook relationships are parsed locally in your browser memory. Financial models and file paths are never transmitted.',
    howAnalysisWorks:
      'The tool unzips the XLSX package in memory and evaluates relationship definitions in `xl/_rels/workbook.xml.rels` and XML parts in `xl/externalLinks/` to identify external workbook targets and UNC server pathways.',
    deepDiveSection: {
      title: 'Understanding External Workbook Dependencies in Excel',
      subtitle: 'Why linked spreadsheets cause broken calculations and path leaks',
      paragraphs: [
        'When an Excel formula references cells in another workbook (e.g., `=\'C:\Finance\[Q4_Budget.xlsx]Sheet1\'!$A$1`), Excel creates an external link relationship in the workbook manifest.',
        'While useful for interconnected local reporting, sharing such spreadsheets with external clients or partners often results in broken formula calculation errors (`#REF!` or `#VALUE!`) because the recipient cannot access your local file system.',
        'Furthermore, external links frequently embed full corporate UNC network paths (such as `\\\\fileserver.internal.corp\\accounting\\salaries.xlsx`), unintentionally revealing confidential server names and folder hierarchies.',
      ],
      callout: {
        type: 'warning',
        title: 'Broken Links in Shared Workbooks',
        text: 'Recipients without access to your original network file paths will see Excel security warnings and may be unable to refresh linked calculations.',
      },
    },
    howItWorksSteps: [
      {
        title: 'Select Excel Workbook',
        description: 'Drop any XLSX or XLSM file into the local inspection tool.',
      },
      {
        title: 'Inspect Relationship Streams',
        description: 'Scan xl/_rels/workbook.xml.rels for externalLink target references.',
      },
      {
        title: 'Catalog External Target Paths',
        description: 'Extract referenced file names, UNC network shares, and remote URIs.',
      },
      {
        title: 'Review Self-Contained Status',
        description: 'Confirm whether the workbook is 100% self-contained before sharing.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Prevent Broken Formula Errors (#REF!)',
        description: 'Verify that shared workbooks do not rely on local file paths inaccessible to outside recipients.',
      },
      {
        title: 'Prevent Server Path Information Leaks',
        description: 'Ensure internal corporate network share pathways and sensitive folder names are not embedded in workbook relationships.',
      },
      {
        title: 'Audit Financial Model Integrity',
        description: 'Confirm that all valuation models are self-contained during corporate M&A transactions.',
      },
    ],
    resultsExplanation: [
      {
        term: 'External Links Count',
        explanation: 'The total number of external workbook targets referenced in the file.',
        whyItMatters: 'Indicates whether the spreadsheet has external file dependencies.',
      },
      {
        term: 'Workbook Status',
        explanation: 'Whether the workbook is fully self-contained or contains external dependencies.',
        whyItMatters: 'Self-contained spreadsheets are safe to distribute without dependency errors.',
      },
      {
        term: 'Detected Targets',
        explanation: 'The specific file paths, UNC shares, or URIs referenced in formulas.',
        whyItMatters: 'Allows you to identify exactly which external files are linked.',
      },
      {
        term: 'External Link Parts',
        explanation: 'The count of dedicated external link XML files inside the container.',
        whyItMatters: 'Reflects cached external data tables stored within the spreadsheet.',
      },
    ],
    practicalExamples: [
      {
        title: 'Client Deliverable Spreadsheet Audit',
        scenario: 'A financial consultant prepares a budget model for a client and wants to ensure all calculations are hard-coded or self-contained.',
        outcome: 'The tool identified a link pointing to `D:\\Clients\\Internal_Costing.xlsx`, allowing the consultant to convert linked formulas to values before delivery.',
      },
      {
        title: 'Due Diligence Data Room Check',
        scenario: 'A startup uploads pitch metrics to a virtual data room and audits spreadsheets for internal file paths.',
        outcome: 'Confirmed the file was 100% self-contained with 0 external relationships.',
      },
    ],
    fileLimitations:
      'Supports OpenXML Excel spreadsheets (.xlsx, .xlsm, .xltx, .xltm) up to 150MB. Legacy binary `.xls` files must be saved as `.xlsx` before scanning.',
    contextualLinks: [
      {
        preText: 'Along with external links, check if your workbook contains hidden or very hidden worksheets using the',
        toolSlug: 'xlsx-hidden-sheet-detector',
        toolName: 'XLSX Hidden Sheet Detector',
        postText: '.',
      },
    ],
    faqs: [
      {
        question: 'How do I find external links in an Excel workbook online?',
        answer:
          'Drop your XLSX file into this tool. It inspects the `xl/_rels/workbook.xml.rels` file structure in your browser memory and lists all linked external workbook paths and data sources.',
      },
      {
        question: 'Why does Excel say my workbook contains links to external sources?',
        answer:
          'This warning occurs when cells, Defined Names, charts, or data validation rules reference another workbook. Even if the linked cells were deleted, Excel may keep the external relationship in the workbook manifest.',
      },
      {
        question: 'Can external links leak internal server file paths?',
        answer:
          'Yes. Excel external links often store full file paths, such as `\\\\internal-server\\finance\\secret_data.xlsx`. Anyone who inspects the file relationship structure can view these paths.',
      },
      {
        question: 'Does this tool automatically break or remove external links?',
        answer:
          'No. This tool is a read-only inspector. To break external links in Excel, open the desktop application, go to Data > Edit Links, and select "Break Link."',
      },
      {
        question: 'What causes #REF! errors in shared spreadsheets?',
        answer:
          'When formulas depend on cells in an external file that the recipient cannot access, Excel cannot retrieve the referenced values and displays `#REF!` or `#VALUE!` calculation errors.',
      },
      {
        question: 'Can external links exist in hidden worksheets?',
        answer:
          'Yes. External references can be embedded inside standard hidden sheets or `xlSheetVeryHidden` tabs, making them hard to locate from the standard Excel grid.',
      },
    ],
    relatedToolIds: [
      'xlsx-hidden-sheet-detector',
      'docx-metadata-checker',
      'pptx-hidden-slide-detector',
      'file-encoding-detector',
    ],
    seo: {
      metaTitle: 'XLSX External Link Checker | Find Linked Workbooks & External Data',
      metaDescription:
        'Scan Excel spreadsheets for external workbook references, file path links, and external data connections before sharing. 100% private in-browser tool.',
      primaryKeyword: 'find external links in excel',
      secondaryKeywords: [
        'xlsx external link checker online',
        'detect linked workbooks excel',
        'find broken external references excel',
        'audit unc file paths in xlsx',
        'check if excel file contains external links',
        'excel external link finder online',
      ],
      keywords: [
        'find external links in excel',
        'xlsx external link checker',
        'detect linked workbooks excel',
        'check external references excel',
        'excel link auditor online',
        'find unc paths in xlsx',
      ],
    },
  },

  // ----------------------------------------------------------------------
  // 9. PPTX Hidden Slide Detector (Priority #9)
  // ----------------------------------------------------------------------
  'pptx-hidden-slide-detector': {
    id: 'pptx-hidden-slide-detector',
    slug: 'pptx-hidden-slide-detector',
    title: 'PPTX Hidden Slide Detector',
    shortDescription:
      'Detect hidden and concealed presentation slides in Microsoft PowerPoint (.pptx) pitch decks.',
    fullDescription:
      'The PPTX Hidden Slide Detector inspects Microsoft PowerPoint presentation containers to identify concealed slides. In PowerPoint, slides marked as "Hidden" are skipped during slideshow playback but remain completely accessible inside the `.pptx` file. This tool parses the presentation XML manifest (`ppt/presentation.xml`) to catalog all slides, detect `show="0"` concealment attributes, and report slide position indices before you share presentations with clients or partners.',
    category: 'office',
    iconName: 'FileSpreadsheet',
    featured: false,
    popular: false,
    supportedFormats: {
      extensions: ['.pptx', '.pptm', '.potx', '.potm'],
      mimePatterns: [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
      ],
      displayNames: 'PowerPoint Presentations (.pptx, .pptm, .potx, .potm)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'Presentation manifests are parsed locally in browser memory. Slide graphics, speaker notes, and slide text are never sent to external servers.',
    howAnalysisWorks:
      'The tool inspects `ppt/presentation.xml` inside the PPTX zip container, evaluating `<p:sldId>` entries for the `show="0"` attribute that marks hidden slides in the OpenXML specification.',
    deepDiveSection: {
      title: 'PowerPoint Slide Visibility & Presentation Auditing',
      subtitle: 'Why hidden slides in shared decks pose data confidentiality risks',
      paragraphs: [
        'In PowerPoint, hiding a slide is commonly used by presenters to skip backup slides or extra appendices during a live presentation.',
        'However, hiding a slide does not delete or encrypt it. When you email a `.pptx` file to a client, investor, or competitor, any recipient can open the file in normal view and read all hidden slide text, diagrams, and speaker notes.',
        'In OpenXML, hidden slides are designated by the attribute `show="0"` inside the `<p:sldId>` element of `ppt/presentation.xml`. Inspecting this manifest gives you an instant audit of concealed slides without clicking through thumbnail ribbons.',
      ],
      callout: {
        type: 'privacy',
        title: 'Pitch Deck Due Diligence',
        text: 'Always delete confidential backup financial projections, internal meeting notes, and draft slides rather than simply hiding them before emailing presentation decks.',
      },
    },
    howItWorksSteps: [
      {
        title: 'Select PPTX Deck',
        description: 'Drop any PowerPoint presentation (.pptx, .pptm) into the workspace.',
      },
      {
        title: 'Parse Presentation XML',
        description: 'Inspect ppt/presentation.xml to read the master slide catalog.',
      },
      {
        title: 'Detect show="0" Attributes',
        description: 'Identify slide indices configured to skip slideshow playback.',
      },
      {
        title: 'Review Slide Inventory',
        description: 'Verify active vs hidden slide counts before sharing the deck.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Sanitize Investor & Client Pitch Decks',
        description: 'Ensure draft financial slides, internal meeting notes, or unreleased product roadmaps are not left hidden in shared decks.',
      },
      {
        title: 'Audit Multi-Slide Presentations Fast',
        description: 'Scan 100+ slide keynote decks instantly without scrolling through individual slide thumbnails.',
      },
      {
        title: 'Verify Presentation Privacy',
        description: 'Confirm that only intended active slides are present before distributing files.',
      },
    ],
    resultsExplanation: [
      {
        term: 'Total Slides in Deck',
        explanation: 'The total number of slides declared in the presentation manifest.',
        whyItMatters: 'Gives the complete count of all slides contained in the file.',
      },
      {
        term: 'Active / Visible Slides',
        explanation: 'Slides that display normally during full-screen presentation mode.',
        whyItMatters: 'The slides an audience sees during a slideshow.',
      },
      {
        term: 'Hidden Slides (show="0")',
        explanation: 'Slides configured with the `show="0"` attribute to be skipped during slideshows.',
        whyItMatters: 'Concealed from slideshow mode but fully readable in edit mode.',
      },
      {
        term: 'Hidden Slide Positions',
        explanation: 'The specific slide numbers (e.g., Slide #4, #12) that are hidden.',
        whyItMatters: 'Tells you exactly which slide numbers to inspect or delete in PowerPoint.',
      },
    ],
    practicalExamples: [
      {
        title: 'Venture Capital Pitch Deck Scrubbing',
        scenario: 'A founder prepares a Series A presentation deck and wants to verify that internal cap table notes from previous partner meetings were removed.',
        outcome: 'The tool flagged 2 hidden slides (Slide #14 and #18) containing sensitive valuation notes, allowing the founder to permanently delete them.',
      },
      {
        title: 'Webinar Keynote Presentation Verification',
        scenario: 'A speaker checks a downloaded company presentation template before presenting live to an audience.',
        outcome: 'Confirmed all 30 slides were active with 0 hidden slides.',
      },
    ],
    fileLimitations:
      'Supports OpenXML PowerPoint files (.pptx, .pptm, .potx, .potm) up to 150MB. Legacy `.ppt` binary files must be saved as `.pptx` first.',
    contextualLinks: [
      {
        preText: 'To inspect author metadata and editing histories in Word documents, use the',
        toolSlug: 'docx-metadata-checker',
        toolName: 'DOCX Metadata Checker',
        postText: '.',
      },
      {
        preText: 'For auditing hidden worksheets in Excel, use the',
        toolSlug: 'xlsx-hidden-sheet-detector',
        toolName: 'XLSX Hidden Sheet Detector',
        postText: '.',
      },
    ],
    faqs: [
      {
        question: 'How do I find hidden slides in a PowerPoint presentation online?',
        answer:
          'Drop your PPTX file into this tool. It inspects the `ppt/presentation.xml` manifest directly in your browser memory and reports all hidden slide indices without needing desktop PowerPoint.',
      },
      {
        question: 'Can recipients view hidden slides in an emailed PowerPoint file?',
        answer:
          'Yes. Hiding a slide only skips it during full-screen slideshow mode. Any recipient who opens the `.pptx` file in normal edit view can see and read all hidden slides and speaker notes.',
      },
      {
        question: 'What is the `show="0"` attribute in PowerPoint OpenXML?',
        answer:
          'In the OpenXML presentation format, each slide is listed in `ppt/presentation.xml`. When a slide is marked as hidden, PowerPoint adds the attribute `show="0"` to its `<p:sldId>` tag.',
      },
      {
        question: 'Does this tool delete hidden slides from my presentation?',
        answer:
          'No. This tool is a read-only audit tool. To permanently delete hidden slides, open the file in PowerPoint, right-click the hidden slide thumbnail, and select "Delete Slide."',
      },
      {
        question: 'Do hidden slides get included when saving PowerPoint as PDF?',
        answer:
          'By default, PowerPoint does NOT include hidden slides when exporting to PDF. However, if you share the original `.pptx` file, all hidden slides remain accessible.',
      },
      {
        question: 'Can hidden slides contain confidential speaker notes?',
        answer:
          'Yes. Hidden slides retain all speaker notes, embedded media, and comments, which can be viewed by anyone who opens the file.',
      },
    ],
    relatedToolIds: [
      'docx-metadata-checker',
      'xlsx-hidden-sheet-detector',
      'xlsx-external-link-checker',
      'pdf-font-checker',
    ],
    seo: {
      metaTitle: 'PPTX Hidden Slide Detector | Find Hidden PowerPoint Slides Online',
      metaDescription:
        'Detect hidden and concealed presentation slides in PowerPoint (.pptx) files before sharing with clients or presenting. Private in-browser tool.',
      primaryKeyword: 'find hidden slides in powerpoint',
      secondaryKeywords: [
        'pptx hidden slide detector online',
        'detect concealed slides in pptx',
        'check powerpoint deck for hidden slides',
        'find slide show=0 in pptx',
        'powerpoint presentation privacy audit',
        'audit pitch deck hidden slides',
      ],
      keywords: [
        'find hidden slides in powerpoint',
        'pptx hidden slide detector',
        'detect hidden slides powerpoint',
        'powerpoint slide visibility checker',
        'inspect hidden slides pptx',
        'check pitch deck hidden slides',
      ],
    },
  },

  // ----------------------------------------------------------------------
  // 10. Image Bit Depth Checker (Priority #10)
  // ----------------------------------------------------------------------
  'image-bit-depth-checker': {
    id: 'image-bit-depth-checker',
    slug: 'image-bit-depth-checker',
    title: 'Image Bit Depth Checker',
    shortDescription:
      'Check image bit depth, color channels, bits per channel (bpc), and alpha transparency across PNG, JPG, and BMP files.',
    fullDescription:
      'The Image Bit Depth Checker evaluates image frames and header chunks to report exact color depth specifications. It inspects PNG `IHDR` chunks, JPEG Start of Frame markers, and bitmap headers to report bits per channel (e.g., 8-bit vs 16-bit), total bits per pixel (8-bit, 24-bit TrueColor, 32-bit RGBA), color space channels (Grayscale, RGB, Indexed Palette), and alpha channel presence.',
    category: 'image',
    iconName: 'Image',
    featured: false,
    popular: false,
    supportedFormats: {
      extensions: ['.png', '.jpg', '.jpeg', '.bmp', '.gif'],
      mimePatterns: ['image/png', 'image/jpeg', 'image/bmp', 'image/gif'],
      displayNames: 'Images (PNG, JPG, BMP, GIF)',
    },
    privacyLevel: 'Client-Side Local Processing',
    privacyExplanation:
      'Image headers are analyzed directly in your browser memory. Image graphics are never uploaded to a server.',
    howAnalysisWorks:
      'The inspector parses the first 1024 bytes. For PNGs, it evaluates the `IHDR` chunk for bit depth (bytes 24-25) and color type. For JPEGs, it evaluates SOF0 markers for sample precision and channel counts.',
    deepDiveSection: {
      title: 'Understanding Image Bit Depth: 8-Bit vs 16-Bit Color Depth',
      subtitle: 'How bits per channel determine tonal smoothness and color gamut',
      paragraphs: [
        'Image bit depth (or color depth) specifies the amount of color information stored for each pixel in an image. It is expressed either as "bits per channel" (bpc) or "total bits per pixel" (bpp).',
        'A standard 8-bit per channel RGB image stores 256 tonal levels per channel (Red, Green, Blue), yielding a total bit depth of 24-bit TrueColor (16.7 million possible colors). When an 8-bit alpha transparency channel is added (as in 32-bit PNGs), the image supports 256 levels of opacity.',
        'In contrast, a 16-bit per channel image stores 65,536 tonal levels per channel (over 281 trillion colors). This higher precision is essential in raw photography, CGI rendering, and medical imaging to prevent visible color banding in smooth gradients and shadows.',
      ],
      callout: {
        type: 'tip',
        title: 'Color Banding in Gradients',
        text: 'If smooth sky or shadow gradients show visible stepped lines (banding), inspecting bit depth will confirm if the file is restricted to 8-bit color depth.',
      },
      comparisonTable: {
        headers: ['Color Depth', 'Bits Per Channel (bpc)', 'Color Space & Alpha', 'Total Color Palette'],
        rows: [
          {
            col1: '8-bit Indexed',
            col2: '8 bpc (Single channel)',
            col3: 'Indexed Palette (GIF, PNG-8)',
            col4: '256 Colors',
          },
          {
            col1: '24-bit TrueColor',
            col2: '8 bpc × 3 channels',
            col3: 'RGB (Standard JPEG, PNG-24)',
            col4: '16.7 Million Colors',
          },
          {
            col1: '32-bit RGBA',
            col2: '8 bpc × 4 channels',
            col3: 'RGB + Alpha (PNG-32, BMP)',
            col4: '16.7M Colors + 256 Alpha Levels',
          },
          {
            col1: '48-bit High Color',
            col2: '16 bpc × 3 channels',
            col3: 'RGB (16-bit TIFF, PNG, RAW)',
            col4: '281 Trillion Colors',
          },
        ],
      },
    },
    howItWorksSteps: [
      {
        title: 'Upload Image File',
        description: 'Drop any PNG, JPEG, GIF, or BMP image into the local workspace.',
      },
      {
        title: 'Read Frame Headers',
        description: 'Inspect PNG IHDR chunks or JPEG Start of Frame (SOF) segments.',
      },
      {
        title: 'Extract Color Channels',
        description: 'Identify bits per channel (bpc), channel count, and alpha presence.',
      },
      {
        title: 'Review Bit Depth Specifications',
        description: 'Verify total bits per pixel and theoretical color gamut.',
      },
    ],
    whyUseReasons: [
      {
        title: 'Verify PNG Transparency (24-bit vs 32-bit)',
        description: 'Confirm whether a PNG is an opaque 24-bit RGB file or includes a dedicated 8-bit alpha transparency channel (32-bit RGBA).',
      },
      {
        title: 'Diagnose Color Banding in Gradients',
        description: 'Check if digital graphics or sky photos are constrained to 8-bit color depth.',
      },
      {
        title: 'Verify Asset Specifications for Game & UI Dev',
        description: 'Ensure UI textures and sprite assets meet exact bit depth and channel standards for memory optimization.',
      },
    ],
    resultsExplanation: [
      {
        term: 'Total Bit Depth',
        explanation: 'The sum of all color and alpha bits allocated per pixel (e.g., 24-bit, 32-bit).',
        whyItMatters: 'Indicates the memory footprint and color capability of each pixel.',
      },
      {
        term: 'Bits Per Channel (bpc)',
        explanation: 'The precision per individual color channel (8 bits = 256 levels; 16 bits = 65,536 levels).',
        whyItMatters: 'Key indicator of whether gradients will render smoothly without banding.',
      },
      {
        term: 'Color Channels',
        explanation: 'The active channels present in the image (Grayscale, RGB, Indexed, RGBA).',
        whyItMatters: 'Confirms whether the image contains full color or palette-indexed data.',
      },
      {
        term: 'Alpha Transparency',
        explanation: 'Indicates whether the image file includes an alpha transparency channel.',
        whyItMatters: 'Crucial for web icons, logos, and game sprites requiring transparent backgrounds.',
      },
    ],
    practicalExamples: [
      {
        title: 'Web Logo Transparency Verification',
        scenario: 'A web designer checks whether an exported logo PNG has full alpha transparency or a white matte.',
        outcome: 'Confirmed the file was 32-bit RGBA with an active alpha channel, ensuring clean transparency across dark and light web themes.',
      },
      {
        title: 'Game Texture Asset Optimization',
        scenario: 'A game developer audits texture assets to ensure UI icons use 8-bit indexed palette instead of 32-bit RGBA to save GPU memory.',
        outcome: 'Identified 12 uncompressed 32-bit sprites that were converted to 8-bit indexed PNGs, reducing file size by 70%.',
      },
    ],
    fileLimitations:
      'Supports raster images (.png, .jpg, .jpeg, .bmp, .gif) up to 150MB. Vector SVG files do not use fixed raster bit depth.',
    contextualLinks: [
      {
        preText: 'To check physical print resolution and DPI density markers for this image, use the',
        toolSlug: 'image-dpi-checker',
        toolName: 'Image DPI Checker',
        postText: '.',
      },
    ],
    faqs: [
      {
        question: 'How do I check image bit depth online?',
        answer:
          'Drop your PNG, JPG, or BMP file into this tool. It parses the image header (such as the PNG IHDR chunk) locally in your browser and reports bits per channel (bpc), total bit depth, and alpha transparency status.',
      },
      {
        question: 'What is the difference between 8-bit, 24-bit, and 32-bit images?',
        answer:
          'An 8-bit image typically uses an indexed color palette of 256 colors (like GIF). A 24-bit image uses 8 bits per channel across Red, Green, and Blue (16.7 million colors). A 32-bit image adds an 8-bit alpha channel for smooth transparency.',
      },
      {
        question: 'What does bits per channel (bpc) mean in image editing?',
        answer:
          'Bits per channel measures how many bits are used to represent each color channel. 8 bpc allows 256 shades per color; 16 bpc allows 65,536 shades per color, virtually eliminating visible color banding in smooth gradients.',
      },
      {
        question: 'Why do gradients in 8-bit images sometimes show color banding?',
        answer:
          'With only 256 shades per channel, subtle color transitions across large screen areas run out of intermediate color steps, creating visible lines or bands.',
      },
      {
        question: 'Does JPEG support 32-bit images with alpha transparency?',
        answer:
          'No. Standard JPEG files do not support alpha transparency channels. JPEGs are typically 24-bit RGB files. For transparency, use PNG, WebP, or TIFF.',
      },
      {
        question: 'When should I edit photos in 16-bit instead of 8-bit?',
        answer:
          'Edit in 16-bit when performing heavy color grading, exposure adjustments, or shadow recovery on RAW photos in Photoshop or Lightroom to avoid losing color data.',
      },
    ],
    relatedToolIds: [
      'image-dpi-checker',
      'file-type-checker',
      'pdf-page-size-checker',
      'docx-metadata-checker',
    ],
    seo: {
      metaTitle: 'Image Bit Depth Checker | Check 8-bit, 24-bit & Color Depth Online',
      metaDescription:
        'Check image bit depth, color channels, bits per channel (bpc), and alpha transparency across PNG, JPG, BMP, and GIF files locally in your browser.',
      primaryKeyword: 'check image bit depth online',
      secondaryKeywords: [
        'image bit depth checker',
        'check 8-bit vs 16-bit image online',
        'image color depth checker',
        'check bits per channel image',
        'png ihdr bit depth analyzer',
        'check alpha transparency bit depth',
      ],
      keywords: [
        'check image bit depth online',
        'image bit depth checker',
        'image color depth',
        'bits per channel checker',
        '24 bit vs 32 bit png',
        'png bit depth analyzer',
      ],
    },
  },
};

export const TOOL_LIST: ToolDefinition[] = Object.values(TOOL_REGISTRY);

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOL_LIST.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return TOOL_LIST.filter((tool) => tool.category === category);
}

export const FEATURED_TOOLS = TOOL_LIST.filter((tool) => tool.featured);
export const POPULAR_TOOLS = TOOL_LIST.filter((tool) => tool.popular);

export function getRelatedTools(toolId: string): ToolDefinition[] {
  const tool = TOOL_REGISTRY[toolId];
  if (!tool || !tool.relatedToolIds) {
    return TOOL_LIST.filter((t) => t.id !== toolId).slice(0, 3);
  }
  const related = tool.relatedToolIds
    .map((id) => TOOL_REGISTRY[id])
    .filter(Boolean) as ToolDefinition[];

  if (related.length === 0) {
    return TOOL_LIST.filter((t) => t.category === tool.category && t.id !== toolId).slice(0, 3);
  }
  return related;
}

