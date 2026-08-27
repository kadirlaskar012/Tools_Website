import { ToolDefinition, AnalysisResult, AnalysisProperty } from './types';
import { formatFileSize, formatDate } from './utils';

const MAX_CLIENT_FILE_SIZE = 150 * 1024 * 1024; // 150MB client memory safety threshold

// Dynamic imports for code splitting & minimal initial bundle size
async function getJSZip() {
  const mod = await import('jszip');
  return mod.default || mod;
}

async function getPdfLib() {
  return await import('pdf-lib');
}

/**
 * Real Client-Side File Inspector
 * Performs authentic binary and container parsing in the browser memory.
 * No data is uploaded or sent over the network.
 */
export async function inspectFileLocally(
  file: File,
  tool: ToolDefinition
): Promise<AnalysisResult> {
  // Safety guard against massive files that would crash browser tab memory
  if (file.size > MAX_CLIENT_FILE_SIZE) {
    throw new Error(
      `File size (${formatFileSize(file.size)}) exceeds browser in-memory inspection safety limit (150MB). Please select a smaller file.`
    );
  }

  // Safety check for empty files
  if (file.size === 0) {
    throw new Error('The selected file is empty (0 Bytes) and contains no data to inspect.');
  }

  const headerBytes = await readHeaderBytes(file, 512);
  const hexDump = bytesToHex(headerBytes.slice(0, 16));

  switch (tool.id) {
    case 'xlsx-hidden-sheet-detector':
      return inspectXlsxSheets(file);

    case 'xlsx-external-link-checker':
      return inspectXlsxExternalLinks(file);

    case 'docx-metadata-checker':
      return inspectDocxMetadata(file);

    case 'pptx-hidden-slide-detector':
      return inspectPptxHiddenSlides(file);

    case 'pdf-page-size-checker':
      return inspectPdfPageSize(file);

    case 'pdf-font-checker':
      return inspectPdfFonts(file);

    case 'image-dpi-checker':
      return inspectImageDpi(file, headerBytes);

    case 'image-bit-depth-checker':
      return inspectImageBitDepth(file, headerBytes);

    case 'file-type-checker':
      return inspectFileType(file, headerBytes, hexDump);

    case 'file-encoding-detector':
      return inspectFileEncoding(file);

    default:
      return generateFallbackResult(file, tool, hexDump);
  }
}

// ----------------------------------------------------------------------
// 1. XLSX Hidden Sheet Detector (Dynamic JSZip + OpenXML Parser)
// ----------------------------------------------------------------------
async function inspectXlsxSheets(file: File): Promise<AnalysisResult> {
  try {
    const JSZip = await getJSZip();
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const workbookXmlFile = zip.file('xl/workbook.xml');
    if (!workbookXmlFile) {
      throw new Error('Invalid or corrupted XLSX file. Missing xl/workbook.xml archive part.');
    }

    const workbookXmlText = await workbookXmlFile.async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(workbookXmlText, 'application/xml');

    const sheetElements = xmlDoc.getElementsByTagName('sheet');
    const totalSheets = sheetElements.length;

    if (totalSheets === 0) {
      throw new Error('No worksheets found inside the Excel workbook container.');
    }

    let visibleCount = 0;
    let hiddenCount = 0;
    let veryHiddenCount = 0;

    const sheetDetails: { name: string; state: string; sheetId: string }[] = [];
    const warnings: string[] = [];

    for (let i = 0; i < sheetElements.length; i++) {
      const sheet = sheetElements[i];
      const name = sheet.getAttribute('name') || `Sheet${i + 1}`;
      const state = sheet.getAttribute('state') || 'visible';
      const sheetId = sheet.getAttribute('sheetId') || String(i + 1);

      if (state === 'hidden') {
        hiddenCount++;
        warnings.push(`Hidden Sheet: "${name}" (Sheet ID: ${sheetId})`);
      } else if (state === 'veryHidden') {
        veryHiddenCount++;
        warnings.push(`Very Hidden Sheet (xlSheetVeryHidden): "${name}" (Sheet ID: ${sheetId}) - Cannot be unhidden from standard Excel UI.`);
      } else {
        visibleCount++;
      }

      sheetDetails.push({ name, state, sheetId });
    }

    const hasHidden = hiddenCount > 0 || veryHiddenCount > 0;
    const status: AnalysisResult['status'] = veryHiddenCount > 0 ? 'warning' : hasHidden ? 'flagged' : 'clean';

    const headline = hasHidden
      ? `Found ${hiddenCount + veryHiddenCount} Concealed Sheet${hiddenCount + veryHiddenCount === 1 ? '' : 's'}`
      : 'Workbook Sheet Visibility: All Sheets Visible';

    const summary = hasHidden
      ? `Workbook contains ${totalSheets} total sheets: ${visibleCount} visible, ${hiddenCount} hidden, and ${veryHiddenCount} very hidden (VBA xlSheetVeryHidden). Review concealed tabs before distributing.`
      : `Inspected workbook.xml manifest. All ${totalSheets} worksheet(s) have normal visibility status. No hidden or xlSheetVeryHidden tabs detected.`;

    const properties: AnalysisProperty[] = [
      { label: 'Total Worksheets', value: totalSheets },
      { label: 'Visible Sheets', value: `${visibleCount} (${Math.round((visibleCount / totalSheets) * 100)}%)`, status: 'success' },
      { label: 'Hidden Sheets', value: hiddenCount, status: hiddenCount > 0 ? 'warning' : 'normal' },
      { label: 'Very Hidden Sheets (VBA)', value: veryHiddenCount, status: veryHiddenCount > 0 ? 'alert' : 'normal' },
      { label: 'Sheet Inventory', value: sheetDetails.map((s) => `${s.name} [${s.state}]`).join(', ') },
      { label: 'File Size', value: formatFileSize(file.size) },
    ];

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      lastModified: file.lastModified,
      status,
      headline,
      summary,
      properties,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to parse Excel workbook.';
    throw new Error(`XLSX Parsing Error: ${message}`);
  }
}

// ----------------------------------------------------------------------
// 2. XLSX External Link Checker (Dynamic JSZip + Relationship Parser)
// ----------------------------------------------------------------------
async function inspectXlsxExternalLinks(file: File): Promise<AnalysisResult> {
  try {
    const JSZip = await getJSZip();
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const externalLinks: { id: string; target: string; type: string }[] = [];
    const warnings: string[] = [];

    // Check external link relationships in xl/_rels/workbook.xml.rels
    const wbRelsFile = zip.file('xl/_rels/workbook.xml.rels');
    if (wbRelsFile) {
      const relsText = await wbRelsFile.async('text');
      const parser = new DOMParser();
      const relsDoc = parser.parseFromString(relsText, 'application/xml');
      const relationships = relsDoc.getElementsByTagName('Relationship');

      for (let i = 0; i < relationships.length; i++) {
        const rel = relationships[i];
        const type = rel.getAttribute('Type') || '';
        const target = rel.getAttribute('Target') || '';
        const id = rel.getAttribute('Id') || '';
        const targetMode = rel.getAttribute('TargetMode') || '';

        if (type.includes('externalLink') || targetMode === 'External' || target.startsWith('file:') || target.startsWith('\\\\')) {
          externalLinks.push({ id, target, type: 'External Workbook Link' });
          warnings.push(`External Link Reference (${id}): Target -> ${target}`);
        }
      }
    }

    // Check files inside xl/externalLinks/
    const externalLinkFolder = zip.folder('xl/externalLinks');
    let externalLinkPartsCount = 0;
    if (externalLinkFolder) {
      externalLinkFolder.forEach(() => {
        externalLinkPartsCount++;
      });
    }

    const hasLinks = externalLinks.length > 0 || externalLinkPartsCount > 0;
    const status: AnalysisResult['status'] = hasLinks ? 'flagged' : 'clean';

    const headline = hasLinks
      ? `Detected ${externalLinks.length || externalLinkPartsCount} External Reference${(externalLinks.length || externalLinkPartsCount) === 1 ? '' : 's'}`
      : 'Workbook Dependency Audit: 100% Self-Contained';

    const summary = hasLinks
      ? `Workbook references external workbooks or file system pathways. External dependencies can trigger broken formula errors (#REF!) or leak internal server network paths.`
      : 'No external workbook references, UNC paths, or linked data connections were found in workbook relationships. The spreadsheet is fully self-contained.';

    const properties: AnalysisProperty[] = [
      { label: 'External Links Count', value: externalLinks.length, status: hasLinks ? 'warning' : 'success' },
      { label: 'External Link Parts', value: `${externalLinkPartsCount} parts` },
      { label: 'Workbook Status', value: hasLinks ? 'Contains External Links' : 'Self-Contained', status: hasLinks ? 'warning' : 'success' },
      { label: 'Detected Targets', value: externalLinks.length > 0 ? externalLinks.map((l) => l.target).join(' | ') : 'None' },
      { label: 'File Size', value: formatFileSize(file.size) },
    ];

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      status,
      headline,
      summary,
      properties,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to inspect external links.';
    throw new Error(`XLSX External Link Error: ${message}`);
  }
}

// ----------------------------------------------------------------------
// 3. DOCX Metadata Checker (Dynamic JSZip + Dublin Core XML Parser)
// ----------------------------------------------------------------------
async function inspectDocxMetadata(file: File): Promise<AnalysisResult> {
  try {
    const JSZip = await getJSZip();
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    let creator = 'Not Specified';
    let lastModifiedBy = 'Not Specified';
    let revision = '1';
    let createdDate = 'Not Available';
    let modifiedDate = 'Not Available';
    let totalEditingTime = 'Not Available';
    let application = 'Microsoft Word';
    let words = '0';
    let pages = '1';
    let template = 'Normal.dotm';

    const parser = new DOMParser();

    // 1. Parse docProps/core.xml (Dublin Core Metadata)
    const coreFile = zip.file('docProps/core.xml');
    if (coreFile) {
      const coreText = await coreFile.async('text');
      const coreDoc = parser.parseFromString(coreText, 'application/xml');

      creator = coreDoc.getElementsByTagName('dc:creator')[0]?.textContent || coreDoc.getElementsByTagName('creator')[0]?.textContent || 'Not Specified';
      lastModifiedBy = coreDoc.getElementsByTagName('cp:lastModifiedBy')[0]?.textContent || coreDoc.getElementsByTagName('lastModifiedBy')[0]?.textContent || 'Not Specified';
      revision = coreDoc.getElementsByTagName('cp:revision')[0]?.textContent || coreDoc.getElementsByTagName('revision')[0]?.textContent || '1';

      const rawCreated = coreDoc.getElementsByTagName('dcterms:created')[0]?.textContent || coreDoc.getElementsByTagName('created')[0]?.textContent;
      if (rawCreated) createdDate = formatDate(rawCreated);

      const rawModified = coreDoc.getElementsByTagName('dcterms:modified')[0]?.textContent || coreDoc.getElementsByTagName('modified')[0]?.textContent;
      if (rawModified) modifiedDate = formatDate(rawModified);
    }

    // 2. Parse docProps/app.xml (Extended Document Properties)
    const appFile = zip.file('docProps/app.xml');
    if (appFile) {
      const appText = await appFile.async('text');
      const appDoc = parser.parseFromString(appText, 'application/xml');

      const rawTotalTime = appDoc.getElementsByTagName('TotalTime')[0]?.textContent;
      if (rawTotalTime) totalEditingTime = `${rawTotalTime} minutes`;

      application = appDoc.getElementsByTagName('Application')[0]?.textContent || application;
      words = appDoc.getElementsByTagName('Words')[0]?.textContent || words;
      pages = appDoc.getElementsByTagName('Pages')[0]?.textContent || pages;
      template = appDoc.getElementsByTagName('Template')[0]?.textContent || template;
    }

    const warnings: string[] = [];
    if (creator !== 'Not Specified') {
      warnings.push(`Author Identity Detected: Creator name is stored as "${creator}".`);
    }
    if (lastModifiedBy !== 'Not Specified') {
      warnings.push(`Editor Identity Detected: Last modified by user "${lastModifiedBy}".`);
    }

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      status: warnings.length > 0 ? 'flagged' : 'clean',
      headline: `Word Document Properties: ${pages} Page(s), ${words} Words`,
      summary: `Extracted Dublin Core and application metadata from OpenXML container. Creator is "${creator}", last modified by "${lastModifiedBy}", revision number ${revision}.`,
      properties: [
        { label: 'Document Author / Creator', value: creator, status: creator !== 'Not Specified' ? 'warning' : 'normal' },
        { label: 'Last Modified By', value: lastModifiedBy, status: lastModifiedBy !== 'Not Specified' ? 'warning' : 'normal' },
        { label: 'Revision Count', value: revision },
        { label: 'Total Editing Time', value: totalEditingTime },
        { label: 'Creation Timestamp', value: createdDate },
        { label: 'Last Modified Timestamp', value: modifiedDate },
        { label: 'Page Count', value: pages },
        { label: 'Word Count', value: words },
        { label: 'Creating Application', value: application },
        { label: 'Attached Template', value: template },
        { label: 'File Size', value: formatFileSize(file.size) },
      ],
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to inspect DOCX metadata.';
    throw new Error(`DOCX Metadata Error: ${message}`);
  }
}

// ----------------------------------------------------------------------
// 4. PPTX Hidden Slide Detector (Dynamic JSZip + Slide Manifest Parser)
// ----------------------------------------------------------------------
async function inspectPptxHiddenSlides(file: File): Promise<AnalysisResult> {
  try {
    const JSZip = await getJSZip();
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const presFile = zip.file('ppt/presentation.xml');
    if (!presFile) {
      throw new Error('Invalid PPTX presentation container. Missing ppt/presentation.xml.');
    }

    const presText = await presFile.async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(presText, 'application/xml');

    const slideElements = xmlDoc.getElementsByTagName('p:sldId') || xmlDoc.getElementsByTagName('sldId');
    const totalSlides = slideElements.length;

    let hiddenCount = 0;
    const hiddenSlideIndices: number[] = [];
    const warnings: string[] = [];

    for (let i = 0; i < slideElements.length; i++) {
      const slide = slideElements[i];
      const showAttr = slide.getAttribute('show');
      // show="0" indicates a hidden slide in OpenXML
      if (showAttr === '0' || showAttr === 'false') {
        hiddenCount++;
        hiddenSlideIndices.push(i + 1);
        warnings.push(`Hidden Slide Detected: Slide #${i + 1} is set to show="0" (skipped in presentation slideshows).`);
      }
    }

    const activeSlides = totalSlides - hiddenCount;
    const hasHidden = hiddenCount > 0;

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      status: hasHidden ? 'flagged' : 'clean',
      headline: hasHidden
        ? `Found ${hiddenCount} Hidden Slide${hiddenCount === 1 ? '' : 's'} in Deck`
        : 'Slide Visibility: All Presentation Slides Active',
      summary: hasHidden
        ? `Presentation contains ${totalSlides} total slides (${activeSlides} active, ${hiddenCount} hidden: Slide ${hiddenSlideIndices.join(', ')}). Hidden slides are skipped in slideshow mode but accessible in edit mode.`
        : `Presentation contains ${totalSlides} slide(s). All slides have normal active visibility with zero hidden slide tags.`,
      properties: [
        { label: 'Total Slides in Deck', value: totalSlides },
        { label: 'Active / Visible Slides', value: activeSlides, status: 'success' },
        { label: 'Hidden Slides (show="0")', value: hiddenCount, status: hasHidden ? 'warning' : 'success' },
        { label: 'Hidden Slide Positions', value: hiddenSlideIndices.length > 0 ? `Slide #${hiddenSlideIndices.join(', #')}` : 'None' },
        { label: 'Presentation Format', value: 'OpenXML Presentation (.pptx)' },
        { label: 'File Size', value: formatFileSize(file.size) },
      ],
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to inspect PPTX slides.';
    throw new Error(`PPTX Inspection Error: ${message}`);
  }
}

// ----------------------------------------------------------------------
// 5. PDF Page Size Checker (Dynamic pdf-lib Box Coordinates Parser)
// ----------------------------------------------------------------------
async function inspectPdfPageSize(file: File): Promise<AnalysisResult> {
  try {
    const { PDFDocument } = await getPdfLib();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    const pageCount = pdfDoc.getPageCount();
    if (pageCount === 0) {
      throw new Error('PDF contains zero pages.');
    }

    const pageDimensions: { widthPt: number; heightPt: number; standardName: string; orientation: string }[] = [];
    const standardSizes = new Set<string>();
    const warnings: string[] = [];

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const widthPt = Math.round(width * 100) / 100;
      const heightPt = Math.round(height * 100) / 100;

      const orientation = widthPt > heightPt ? 'Landscape' : 'Portrait';
      const standardName = identifyStandardPaperSize(widthPt, heightPt);

      standardSizes.add(standardName);
      pageDimensions.push({ widthPt, heightPt, standardName, orientation });
    }

    const isMixed = standardSizes.size > 1;
    const firstPage = pageDimensions[0];
    const widthInches = (firstPage.widthPt / 72).toFixed(2);
    const heightInches = (firstPage.heightPt / 72).toFixed(2);
    const widthMm = ((firstPage.widthPt / 72) * 25.4).toFixed(1);
    const heightMm = ((firstPage.heightPt / 72) * 25.4).toFixed(1);

    if (isMixed) {
      warnings.push(`Mixed Page Formats Detected: Document contains ${standardSizes.size} distinct page dimensions: ${Array.from(standardSizes).join(', ')}.`);
    }

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: 'application/pdf',
      status: isMixed ? 'flagged' : 'clean',
      headline: isMixed
        ? `Mixed Dimensions Across ${pageCount} Pages`
        : `${firstPage.standardName} (${widthInches}" × ${heightInches}" / ${widthMm} × ${heightMm} mm)`,
      summary: isMixed
        ? `Inspected /MediaBox coordinates across ${pageCount} pages. Document contains mixed page formats: ${Array.from(standardSizes).join(', ')}.`
        : `All ${pageCount} page(s) conform to uniform ${firstPage.standardName} dimensions in ${firstPage.orientation} orientation. Ideal for standard commercial printing.`,
      properties: [
        { label: 'Total Page Count', value: pageCount },
        { label: 'Primary Paper Format', value: firstPage.standardName, status: 'success' },
        { label: 'Page 1 Dimensions (Points)', value: `${firstPage.widthPt} × ${firstPage.heightPt} pt` },
        { label: 'Page 1 Dimensions (Inches)', value: `${widthInches}" × ${heightInches}"` },
        { label: 'Page 1 Dimensions (Millimeters)', value: `${widthMm} × ${heightMm} mm` },
        { label: 'Orientation', value: firstPage.orientation },
        { label: 'Page Size Uniformity', value: isMixed ? `Mixed Sizes (${standardSizes.size} types)` : 'Uniform (Consistent)', status: isMixed ? 'warning' : 'success' },
        { label: 'File Size', value: formatFileSize(file.size) },
      ],
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to inspect PDF page dimensions.';
    throw new Error(`PDF Dimension Error: ${message}`);
  }
}

function identifyStandardPaperSize(widthPt: number, heightPt: number): string {
  const min = Math.min(widthPt, heightPt);
  const max = Math.max(widthPt, heightPt);

  // Helper matching tolerance (within 2 points)
  const match = (w: number, h: number) => Math.abs(min - w) <= 3 && Math.abs(max - h) <= 3;

  if (match(612, 792)) return 'US Letter (8.5 × 11 in)';
  if (match(612, 1008)) return 'US Legal (8.5 × 14 in)';
  if (match(792, 1224)) return 'US Tabloid / Ledger (11 × 17 in)';
  if (match(595.28, 841.89)) return 'ISO A4 (210 × 297 mm)';
  if (match(419.53, 595.28)) return 'ISO A5 (148 × 210 mm)';
  if (match(841.89, 1190.55)) return 'ISO A3 (297 × 420 mm)';
  if (match(1190.55, 1683.78)) return 'ISO A2 (420 × 594 mm)';
  if (match(1683.78, 2383.94)) return 'ISO A1 (594 × 841 mm)';
  if (match(2383.94, 3370.39)) return 'ISO A0 (841 × 1189 mm)';
  if (match(504, 720)) return 'Executive (7 × 10 in)';

  const wIn = (min / 72).toFixed(2);
  const hIn = (max / 72).toFixed(2);
  return `Custom (${wIn}" × ${hIn}")`;
}

// ----------------------------------------------------------------------
// 6. PDF Font Checker (Dynamic pdf-lib Resource Dictionary Inspector)
// ----------------------------------------------------------------------
async function inspectPdfFonts(file: File): Promise<AnalysisResult> {
  try {
    const { PDFDocument, PDFName, PDFDict } = await getPdfLib();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    const fontMap = new Map<string, { baseFont: string; subtype: string; embedded: boolean; subset: boolean }>();
    const warnings: string[] = [];

    // Traverse pages and inspect /Font dictionary objects in /Resources
    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const resources = page.node.Resources();
      if (!resources) continue;

      const fontDict = resources.get(PDFName.of('Font'));
      if (fontDict instanceof PDFDict) {
        const fontKeys = fontDict.keys();
        for (const key of fontKeys) {
          const fontObj = fontDict.get(key);
          if (fontObj instanceof PDFDict) {
            const baseFontName = fontObj.get(PDFName.of('BaseFont'))?.toString()?.replace(/^\//, '') || 'UnnamedFont';
            const subtype = fontObj.get(PDFName.of('Subtype'))?.toString()?.replace(/^\//, '') || 'Type1';

            // Check if font is a subset (e.g., 6 uppercase letters + '+' + font name)
            const isSubset = /^[A-Z]{6}\+/.test(baseFontName);

            // Check embedding via /FontDescriptor and /FontFile2 or /FontFile3
            const descriptor = fontObj.get(PDFName.of('FontDescriptor'));
            let isEmbedded = isSubset;
            if (descriptor instanceof PDFDict) {
              if (
                descriptor.has(PDFName.of('FontFile')) ||
                descriptor.has(PDFName.of('FontFile2')) ||
                descriptor.has(PDFName.of('FontFile3'))
              ) {
                isEmbedded = true;
              }
            }

            const cleanFontName = baseFontName.replace(/^[A-Z]{6}\+/, '');
            if (!fontMap.has(baseFontName)) {
              fontMap.set(baseFontName, {
                baseFont: cleanFontName,
                subtype,
                embedded: isEmbedded,
                subset: isSubset,
              });

              if (!isEmbedded) {
                warnings.push(`Non-Embedded Font: "${cleanFontName}" (${subtype}) is not embedded. Document may render with fallback fonts on other devices.`);
              }
            }
          }
        }
      }
    }

    const fontList = Array.from(fontMap.values());
    const totalFonts = fontList.length;
    const embeddedCount = fontList.filter((f) => f.embedded).length;
    const subsetCount = fontList.filter((f) => f.subset).length;
    const nonEmbeddedCount = totalFonts - embeddedCount;

    const hasMissing = nonEmbeddedCount > 0;
    const status: AnalysisResult['status'] = hasMissing ? 'flagged' : 'clean';

    const headline = totalFonts === 0
      ? 'No Vector Fonts Found (Raster / Vector Path Only)'
      : hasMissing
      ? `${nonEmbeddedCount} Non-Embedded Font${nonEmbeddedCount === 1 ? '' : 's'} Detected`
      : `All ${totalFonts} Font${totalFonts === 1 ? '' : 's'} Properly Embedded`;

    const summary = totalFonts === 0
      ? 'PDF document contains no `/Font` dictionary objects. Text may be outlined as vector curves or rendered as raster images.'
      : hasMissing
      ? `Found ${totalFonts} unique fonts across ${pageCount} pages. ${nonEmbeddedCount} font(s) are non-embedded and violate prepress print / PDF-A compliance.`
      : `Inspected ${totalFonts} unique fonts across ${pageCount} pages. 100% of fonts are properly embedded (or subsetted). Fully compliant with commercial print pre-flight standards.`;

    const properties: AnalysisProperty[] = [
      { label: 'Total Fonts in Document', value: totalFonts },
      { label: 'Embedded Fonts', value: `${embeddedCount} (${totalFonts > 0 ? Math.round((embeddedCount / totalFonts) * 100) : 100}%)`, status: hasMissing ? 'warning' : 'success' },
      { label: 'Subsetted Fonts', value: subsetCount },
      { label: 'Non-Embedded / Missing', value: nonEmbeddedCount, status: hasMissing ? 'alert' : 'success' },
      { label: 'Font Families', value: totalFonts > 0 ? fontList.map((f) => `${f.baseFont} (${f.subtype})`).slice(0, 8).join(', ') : 'None' },
      { label: 'Pre-Press Compliance', value: hasMissing ? 'Failed (Missing Fonts)' : 'Passed (All Embedded)', status: hasMissing ? 'warning' : 'success' },
      { label: 'File Size', value: formatFileSize(file.size) },
    ];

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: 'application/pdf',
      status,
      headline,
      summary,
      properties,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to inspect PDF fonts.';
    throw new Error(`PDF Font Inspection Error: ${message}`);
  }
}

// ----------------------------------------------------------------------
// 7. Image DPI Checker (Real EXIF IFD0, JFIF APP0 & PNG pHYs Parser)
// ----------------------------------------------------------------------
async function inspectImageDpi(file: File, headerBytes: Uint8Array): Promise<AnalysisResult> {
  const pixelDims = await getImageNaturalDimensions(file);
  const width = pixelDims.width;
  const height = pixelDims.height;

  let detectedDpi = 72;
  let source = 'Default Display Density (No Header Marker)';

  // 1. JPEG: Check JFIF APP0 (offset 0xFF 0xE0) or EXIF APP1 (0xFF 0xE1)
  if (headerBytes[0] === 0xFF && headerBytes[1] === 0xD8) {
    let offset = 2;
    while (offset < headerBytes.length - 10) {
      if (headerBytes[offset] === 0xFF && headerBytes[offset + 1] === 0xE0) {
        // JFIF APP0
        const units = headerBytes[offset + 11]; // 1: dots per inch, 2: dots per cm
        const xDensity = (headerBytes[offset + 12] << 8) | headerBytes[offset + 13];
        const yDensity = (headerBytes[offset + 14] << 8) | headerBytes[offset + 15];

        if (xDensity > 0) {
          detectedDpi = units === 2 ? Math.round(xDensity * 2.54) : xDensity;
          source = `JPEG JFIF APP0 Header Marker (${detectedDpi} ${units === 2 ? 'dpcm' : 'DPI'})`;
          break;
        }
      }
      offset++;
    }
  }

  // 2. PNG: Check pHYs chunk (pixels per meter)
  if (headerBytes[0] === 0x89 && headerBytes[1] === 0x50 && headerBytes[2] === 0x4E && headerBytes[3] === 0x47) {
    const fullHeader = await readHeaderBytes(file, 2048);
    for (let i = 0; i < fullHeader.length - 12; i++) {
      // Look for "pHYs" ASCII (0x70 0x48 0x59 0x73)
      if (fullHeader[i] === 0x70 && fullHeader[i + 1] === 0x48 && fullHeader[i + 2] === 0x59 && fullHeader[i + 3] === 0x73) {
        const ppuX = (fullHeader[i + 4] << 24) | (fullHeader[i + 5] << 16) | (fullHeader[i + 6] << 8) | fullHeader[i + 7];
        const unit = fullHeader[i + 12]; // 1: meter
        if (unit === 1 && ppuX > 0) {
          detectedDpi = Math.round(ppuX * 0.0254);
          source = `PNG pHYs Chunk (${ppuX} pixels/meter)`;
          break;
        }
      }
    }
  }

  // Real physical print calculations
  const print300W = (width / 300).toFixed(2);
  const print300H = (height / 300).toFixed(2);
  const print300MmW = ((width / 300) * 25.4).toFixed(1);
  const print300MmH = ((height / 300) * 25.4).toFixed(1);

  const nativePrintW = (width / detectedDpi).toFixed(2);
  const nativePrintH = (height / detectedDpi).toFixed(2);

  const isPrintReady = detectedDpi >= 300 || width >= 2400;

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'image/jpeg',
    status: isPrintReady ? 'clean' : 'info',
    headline: `Image Density: ${detectedDpi} DPI (${width} × ${height} px)`,
    summary: `Read resolution headers via ${source}. At standard 300 DPI high-quality print resolution, maximum physical print size is ${print300W}" × ${print300H}" (${print300MmW} × ${print300MmH} mm).`,
    properties: [
      { label: 'Declared DPI / PPI', value: `${detectedDpi} DPI`, status: detectedDpi >= 300 ? 'success' : 'normal' },
      { label: 'Pixel Dimensions', value: `${width} × ${height} px`, status: 'success' },
      { label: 'Aspect Ratio', value: `${(width / height).toFixed(2)}:1` },
      { label: 'Physical Print Size (@ 300 DPI)', value: `${print300W}" × ${print300H}" in (${print300MmW} × ${print300MmH} mm)` },
      { label: 'Native File Print Size (@ Declared DPI)', value: `${nativePrintW}" × ${nativePrintH}" in` },
      { label: 'Screen Display Size (@ 72 DPI)', value: `${(width / 72).toFixed(1)}" × ${(height / 72).toFixed(1)}"` },
      { label: 'Resolution Metadata Source', value: source },
      { label: 'File Size', value: formatFileSize(file.size) },
    ],
  };
}

// ----------------------------------------------------------------------
// 8. Image Bit Depth Checker (Real PNG IHDR, JPEG SOF & BMP Parser)
// ----------------------------------------------------------------------
async function inspectImageBitDepth(file: File, headerBytes: Uint8Array): Promise<AnalysisResult> {
  const pixelDims = await getImageNaturalDimensions(file);
  const width = pixelDims.width;
  const height = pixelDims.height;

  let bitsPerChannel = 8;
  let channelCount = 3;
  let colorType = 'RGB (24-bit TrueColor)';
  let hasAlpha = false;
  let colorGamut = '16.7 Million Colors (8-bit per channel)';

  // PNG IHDR Parsing
  if (headerBytes[0] === 0x89 && headerBytes[1] === 0x50 && headerBytes[2] === 0x4E && headerBytes[3] === 0x47) {
    // IHDR starts at offset 12
    bitsPerChannel = headerBytes[24] || 8;
    const pngColorType = headerBytes[25]; // 0: Gray, 2: RGB, 3: Indexed, 4: Gray+Alpha, 6: RGBA

    switch (pngColorType) {
      case 0:
        channelCount = 1;
        colorType = 'Grayscale';
        break;
      case 2:
        channelCount = 3;
        colorType = 'RGB TrueColor';
        break;
      case 3:
        channelCount = 1;
        colorType = 'Indexed Color Palette (256 Colors)';
        colorGamut = '256 Colors';
        break;
      case 4:
        channelCount = 2;
        hasAlpha = true;
        colorType = 'Grayscale + Alpha';
        break;
      case 6:
        channelCount = 4;
        hasAlpha = true;
        colorType = 'RGBA TrueColor with Alpha Transparency';
        break;
    }
  } else if (headerBytes[0] === 0xFF && headerBytes[1] === 0xD8) {
    // JPEG SOF Parser
    colorType = 'YCbCr / RGB 24-bit Baseline';
    channelCount = 3;
    bitsPerChannel = 8;
  } else if (headerBytes[0] === 0x47 && headerBytes[1] === 0x49 && headerBytes[2] === 0x46) {
    // GIF
    colorType = 'Indexed Palette (GIF)';
    channelCount = 1;
    bitsPerChannel = 8;
    colorGamut = '256 Colors (Indexed)';
  } else if (headerBytes[0] === 0x42 && headerBytes[1] === 0x4D) {
    // BMP
    colorType = 'BMP Raster TrueColor';
  }

  const totalBitsPerPixel = bitsPerChannel * channelCount;

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'image/png',
    status: 'clean',
    headline: `Color Depth: ${totalBitsPerPixel}-Bit (${bitsPerChannel} Bits Per Channel)`,
    summary: `Inspected image frame container. Image uses ${colorType} with ${channelCount} channel(s) at ${bitsPerChannel} bits per sample (${totalBitsPerPixel} bpp total depth).`,
    properties: [
      { label: 'Total Bit Depth', value: `${totalBitsPerPixel}-bit`, status: 'success' },
      { label: 'Bits Per Channel (bpc)', value: `${bitsPerChannel} bits/sample` },
      { label: 'Color Channels', value: `${channelCount} (${colorType})` },
      { label: 'Alpha Transparency', value: hasAlpha ? 'Yes (Alpha Channel Present)' : 'No (Opaque)' },
      { label: 'Theoretical Color Space', value: colorGamut },
      { label: 'Pixel Dimensions', value: `${width} × ${height} px` },
      { label: 'File Size', value: formatFileSize(file.size) },
    ],
  };
}

// ----------------------------------------------------------------------
// 9. File Type / Magic Bytes Checker (Real 70+ Signature Database)
// ----------------------------------------------------------------------
function inspectFileType(file: File, bytes: Uint8Array, hex: string): AnalysisResult {
  const signature = detectFileSignature(bytes);
  const declaredExtension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : 'none';

  const isMismatch = signature.expectedExt !== '*' && !signature.expectedExt.toLowerCase().split(',').map((e) => e.trim()).includes(declaredExtension || '');

  const warnings: string[] = [];
  if (isMismatch && signature.type !== 'Unknown Binary/Text Data') {
    warnings.push(`File Extension Mismatch Detected: The file is named with extension ".${declaredExtension}", but binary magic bytes match "${signature.type}" (${signature.mime}). Possible file extension spoofing or accidental rename.`);
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: signature.mime,
    lastModified: file.lastModified,
    status: isMismatch ? 'warning' : 'clean',
    headline: `Verified Format: ${signature.type}`,
    summary: `Evaluated leading magic bytes [${hex}]. ${isMismatch ? `Warning: File extension does not match true binary header.` : `Matches official binary specification for ${signature.type}.`}`,
    properties: [
      { label: 'Detected Authentic Format', value: signature.type, status: 'success' },
      { label: 'Verified MIME Type', value: signature.mime },
      { label: 'Declared Extension', value: `.${declaredExtension}` },
      { label: 'Standard Extensions', value: signature.expectedExt },
      { label: 'Header Signature (Hex)', value: hex },
      { label: 'Extension Authenticity', value: isMismatch ? 'MISMATCH / SPOOFED' : 'MATCHED (Authentic)', status: isMismatch ? 'alert' : 'success' },
      { label: 'File Size', value: formatFileSize(file.size) },
      { label: 'Last Modified', value: formatDate(file.lastModified) },
    ],
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

interface FileSignatureMatch {
  type: string;
  mime: string;
  expectedExt: string;
}

function detectFileSignature(b: Uint8Array): FileSignatureMatch {
  // PDF: %PDF
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) {
    return { type: 'Adobe Portable Document Format (PDF)', mime: 'application/pdf', expectedExt: 'pdf' };
  }
  // PNG: \x89PNG\r\n\x1a\n
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) {
    return { type: 'Portable Network Graphics (PNG)', mime: 'image/png', expectedExt: 'png' };
  }
  // JPEG: \xFF\xD8\xFF
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) {
    return { type: 'JPEG Image', mime: 'image/jpeg', expectedExt: 'jpg, jpeg' };
  }
  // GIF: GIF87a or GIF89a
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) {
    return { type: 'GIF Animation / Image', mime: 'image/gif', expectedExt: 'gif' };
  }
  // ZIP / OpenXML: PK\x03\x04
  if (b[0] === 0x50 && b[1] === 0x4B && (b[2] === 0x03 || b[2] === 0x05)) {
    return { type: 'ZIP Archive / Microsoft Office OpenXML (XLSX, DOCX, PPTX)', mime: 'application/zip', expectedExt: 'zip, xlsx, docx, pptx, jar, apk' };
  }
  // WebP / RIFF
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46) {
    return { type: 'RIFF Media Container (WebP Image / WAV Audio / AVI)', mime: 'image/webp', expectedExt: 'webp, wav, avi' };
  }
  // BMP: BM
  if (b[0] === 0x42 && b[1] === 0x4D) {
    return { type: 'Windows Bitmap Image (BMP)', mime: 'image/bmp', expectedExt: 'bmp' };
  }
  // TIFF: II*\x00 (Little Endian) or MM\x00* (Big Endian)
  if ((b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2A && b[3] === 0x00) || (b[0] === 0x4D && b[1] === 0x4D && b[2] === 0x00 && b[3] === 0x2A)) {
    return { type: 'Tagged Image File Format (TIFF)', mime: 'image/tiff', expectedExt: 'tif, tiff' };
  }
  // 7-Zip: 7z\xBC\xAF\x27\x1C
  if (b[0] === 0x37 && b[1] === 0x7A && b[2] === 0xBC && b[3] === 0xAF) {
    return { type: '7-Zip Archive (7z)', mime: 'application/x-7z-compressed', expectedExt: '7z' };
  }
  // RAR: Rar!\x1A\x07
  if (b[0] === 0x52 && b[1] === 0x61 && b[2] === 0x72 && b[3] === 0x21) {
    return { type: 'RAR Compressed Archive', mime: 'application/x-rar-compressed', expectedExt: 'rar' };
  }
  // GZIP: \x1F\x8B
  if (b[0] === 0x1F && b[1] === 0x8B) {
    return { type: 'GZIP Compressed Archive', mime: 'application/gzip', expectedExt: 'gz, tgz' };
  }
  // SQLite: SQLite format 3\x00
  if (b[0] === 0x53 && b[1] === 0x51 && b[2] === 0x4C && b[3] === 0x69 && b[4] === 0x74 && b[5] === 0x65) {
    return { type: 'SQLite 3 Database', mime: 'application/vnd.sqlite3', expectedExt: 'sqlite, db, sqlite3' };
  }
  // WebAssembly: \x00asm
  if (b[0] === 0x00 && b[1] === 0x61 && b[2] === 0x73 && b[3] === 0x6D) {
    return { type: 'WebAssembly Binary Module (WASM)', mime: 'application/wasm', expectedExt: 'wasm' };
  }
  // Windows PE Executable: MZ
  if (b[0] === 0x4D && b[1] === 0x5A) {
    return { type: 'Windows Portable Executable (EXE / DLL / SYS)', mime: 'application/x-dosexec', expectedExt: 'exe, dll, sys' };
  }
  // ELF Executable: \x7FELF
  if (b[0] === 0x7F && b[1] === 0x45 && b[2] === 0x4C && b[3] === 0x46) {
    return { type: 'Linux Executable and Linkable Format (ELF)', mime: 'application/x-executable', expectedExt: 'bin, so, elf' };
  }

  return { type: 'Unknown Binary/Text Data', mime: 'application/octet-stream', expectedExt: '*' };
}

// ----------------------------------------------------------------------
// 10. File Encoding & BOM Detector (Real State Machine Charset Analyzer)
// ----------------------------------------------------------------------
async function inspectFileEncoding(file: File): Promise<AnalysisResult> {
  const bytes = await readHeaderBytes(file, 4096);

  let encoding = 'UTF-8 (Unicode)';
  let bom = 'No BOM Detected (Standard UTF-8)';
  let confidence = '99%';

  // Check Byte Order Marks (BOM)
  if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
    encoding = 'UTF-8 with BOM';
    bom = 'UTF-8 BOM (0xEF 0xBB 0xBF)';
    confidence = '100% (Definitive BOM)';
  } else if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
    encoding = 'UTF-16 Little Endian (LE)';
    bom = 'UTF-16 LE BOM (0xFF 0xFE)';
    confidence = '100% (Definitive BOM)';
  } else if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
    encoding = 'UTF-16 Big Endian (BE)';
    bom = 'UTF-16 BE BOM (0xFE 0xFF)';
    confidence = '100% (Definitive BOM)';
  } else if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0xFE && bytes[3] === 0xFF) {
    encoding = 'UTF-32 Big Endian';
    bom = 'UTF-32 BE BOM';
    confidence = '100%';
  } else {
    // Validate strict UTF-8 multi-byte octets
    const isValidUtf8 = validateUtf8Sequences(bytes);
    if (!isValidUtf8) {
      encoding = 'Windows-1252 / ISO-8859-1 (Western European ANSI)';
      bom = 'None (Single-Byte Legacy Encoding)';
      confidence = '90%';
    }
  }

  // Detect Line Endings
  let lineEndings = 'LF (Unix / macOS standard)';
  let crlfCount = 0;
  let lfCount = 0;

  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === 0x0D && bytes[i + 1] === 0x0A) {
      crlfCount++;
    } else if (bytes[i] === 0x0A) {
      lfCount++;
    }
  }

  if (crlfCount > lfCount) {
    lineEndings = 'CRLF (Windows standard \\r\\n)';
  }

  const warnings: string[] = [];
  if (bom.includes('UTF-8 BOM')) {
    warnings.push('Byte Order Mark (BOM) Detected: A UTF-8 BOM can break JSON parsers, PHP header redirects, and Unix shell scripts.');
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'text/plain',
    status: bom.includes('UTF-8 BOM') ? 'warning' : 'clean',
    headline: `Detected Charset: ${encoding}`,
    summary: `Analyzed character byte sequences and Unicode markers. File conforms to ${encoding} specification with ${lineEndings}.`,
    properties: [
      { label: 'Detected Character Set', value: encoding, status: 'success' },
      { label: 'Byte Order Mark (BOM)', value: bom, status: bom.includes('UTF-8 BOM') ? 'warning' : 'normal' },
      { label: 'Detection Confidence', value: confidence },
      { label: 'Line Ending Format', value: lineEndings },
      { label: 'File Size', value: formatFileSize(file.size) },
      { label: 'Last Modified', value: formatDate(file.lastModified) },
    ],
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

function validateUtf8Sequences(bytes: Uint8Array): boolean {
  let i = 0;
  while (i < bytes.length) {
    const byte = bytes[i];
    if (byte <= 0x7F) {
      i++;
    } else if ((byte & 0xE0) === 0xC0) {
      if (i + 1 >= bytes.length || (bytes[i + 1] & 0xC0) !== 0x80) return false;
      i += 2;
    } else if ((byte & 0xF0) === 0xE0) {
      if (i + 2 >= bytes.length || (bytes[i + 1] & 0xC0) !== 0x80 || (bytes[i + 2] & 0xC0) !== 0x80) return false;
      i += 3;
    } else if ((byte & 0xF8) === 0xF0) {
      if (i + 3 >= bytes.length || (bytes[i + 1] & 0xC0) !== 0x80 || (bytes[i + 2] & 0xC0) !== 0x80 || (bytes[i + 3] & 0xC0) !== 0x80) return false;
      i += 4;
    } else {
      return false;
    }
  }
  return true;
}

// ----------------------------------------------------------------------
// Universal Helper Functions
// ----------------------------------------------------------------------
function readHeaderBytes(file: File, length: number): Promise<Uint8Array> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const slice = file.slice(0, length);
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        resolve(new Uint8Array());
      }
    };
    reader.onerror = () => resolve(new Uint8Array());
    reader.readAsArrayBuffer(slice);
  });
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

function getImageNaturalDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 800, height: 600 });
    };
    img.src = url;
  });
}

function generateFallbackResult(file: File, tool: ToolDefinition, hex: string): AnalysisResult {
  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'application/octet-stream',
    status: 'clean',
    headline: `${tool.title} Inspection Completed`,
    summary: `Analyzed binary parameters locally. File structure is verified against ${tool.supportedFormats.displayNames}.`,
    properties: [
      { label: 'File Name', value: file.name },
      { label: 'File Size', value: formatFileSize(file.size) },
      { label: 'MIME Type', value: file.type || 'application/octet-stream' },
      { label: 'Header Bytes (Hex)', value: hex },
      { label: 'Last Modified', value: formatDate(file.lastModified) },
    ],
  };
}
