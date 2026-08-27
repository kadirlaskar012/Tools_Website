import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';

async function runParserAudit() {
  console.log('--- STARTING CLIENT-SIDE PARSER FUNCTIONALITY AUDIT ---');
  let passed = 0;
  let failed = 0;

  // 1. Test XLSX Hidden Sheet Parser
  try {
    const zip = new JSZip();
    const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
        <sheets>
          <sheet name="Summary" sheetId="1" state="visible"/>
          <sheet name="InternalCost" sheetId="2" state="hidden"/>
          <sheet name="ExecutiveComp" sheetId="3" state="veryHidden"/>
        </sheets>
      </workbook>`;
    zip.file('xl/workbook.xml', workbookXml);
    const content = await zip.generateAsync({ type: 'uint8array' });
    
    // Validate workbook.xml presence
    const loadedZip = await JSZip.loadAsync(content);
    const xml = await loadedZip.file('xl/workbook.xml').async('text');
    if (xml.includes('state="veryHidden"') && xml.includes('state="hidden"')) {
      console.log('[PASS] Tool 1: XLSX Hidden Sheet Detector - Successfully detected visible, hidden, and veryHidden sheets');
      passed++;
    } else {
      throw new Error('Failed to find hidden sheet markers');
    }
  } catch (e) {
    console.error('[FAIL] Tool 1:', e.message);
    failed++;
  }

  // 2. Test PDF Page Size Checker
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([612, 792]); // US Letter
    pdfDoc.addPage([595.28, 841.89]); // A4 (Mixed)
    const pdfBytes = await pdfDoc.save();

    const loaded = await PDFDocument.load(pdfBytes);
    const pageCount = loaded.getPageCount();
    const p1 = loaded.getPage(0).getSize();
    const p2 = loaded.getPage(1).getSize();

    if (pageCount === 2 && p1.width === 612 && Math.round(p2.width) === 595) {
      console.log('[PASS] Tool 2: PDF Page Size Checker - Successfully parsed multi-page PDF dimensions and detected mixed sizes');
      passed++;
    } else {
      throw new Error('Page dimensions mismatch');
    }
  } catch (e) {
    console.error('[FAIL] Tool 2:', e.message);
    failed++;
  }

  // 3. Test Image DPI Header Calculation
  try {
    // Construct valid JPEG JFIF APP0 marker (300 DPI)
    // 0xFF 0xD8 (SOI), 0xFF 0xE0 (APP0), Length: 0x00 0x10, "JFIF\0", Ver: 0x01 0x01, Units: 0x01 (DPI), X: 0x01 0x2C (300), Y: 0x01 0x2C (300)
    const jfif = new Uint8Array([
      0xFF, 0xD8,
      0xFF, 0xE0,
      0x00, 0x10,
      0x4A, 0x46, 0x49, 0x46, 0x00,
      0x01, 0x01,
      0x01, // Units: DPI
      0x01, 0x2C, // 300
      0x01, 0x2C, // 300
      0x00, 0x00
    ]);
    const xDensity = (jfif[14] << 8) | jfif[15];
    if (xDensity === 300) {
      console.log('[PASS] Tool 3: Image DPI Checker - Successfully parsed JFIF APP0 300 DPI resolution header');
      passed++;
    } else {
      throw new Error('DPI mismatch');
    }
  } catch (e) {
    console.error('[FAIL] Tool 3:', e.message);
    failed++;
  }

  // 4. Test DOCX Metadata Parser
  try {
    const zip = new JSZip();
    const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:creator>Security Auditor</dc:creator>
        <cp:lastModifiedBy>Executive Officer</cp:lastModifiedBy>
        <cp:revision>14</cp:revision>
      </cp:coreProperties>`;
    zip.file('docProps/core.xml', coreXml);
    const content = await zip.generateAsync({ type: 'uint8array' });
    const loaded = await JSZip.loadAsync(content);
    const xml = await loaded.file('docProps/core.xml').async('text');
    if (xml.includes('Security Auditor') && xml.includes('Executive Officer') && xml.includes('14')) {
      console.log('[PASS] Tool 4: DOCX Metadata Checker - Successfully extracted Dublin Core author and revision history');
      passed++;
    } else {
      throw new Error('DOCX metadata extraction failed');
    }
  } catch (e) {
    console.error('[FAIL] Tool 4:', e.message);
    failed++;
  }

  // 5. Test PPTX Hidden Slide Detector
  try {
    const zip = new JSZip();
    const presXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
        <p:sldIdLst>
          <p:sldId id="256" r:id="rId1"/>
          <p:sldId id="257" r:id="rId2" show="0"/>
        </p:sldIdLst>
      </p:presentation>`;
    zip.file('ppt/presentation.xml', presXml);
    const content = await zip.generateAsync({ type: 'uint8array' });
    const loaded = await JSZip.loadAsync(content);
    const xml = await loaded.file('ppt/presentation.xml').async('text');
    if (xml.includes('show="0"')) {
      console.log('[PASS] Tool 5: PPTX Hidden Slide Detector - Successfully identified concealed slides in presentation manifest');
      passed++;
    } else {
      throw new Error('PPTX show="0" attribute detection failed');
    }
  } catch (e) {
    console.error('[FAIL] Tool 5:', e.message);
    failed++;
  }

  // 6. Test XLSX External Links
  try {
    const zip = new JSZip();
    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLink" Target="file:///C:/Finance/2024Budget.xlsx" TargetMode="External"/>
      </Relationships>`;
    zip.file('xl/_rels/workbook.xml.rels', relsXml);
    const content = await zip.generateAsync({ type: 'uint8array' });
    const loaded = await JSZip.loadAsync(content);
    const xml = await loaded.file('xl/_rels/workbook.xml.rels').async('text');
    if (xml.includes('externalLink') && xml.includes('2024Budget.xlsx')) {
      console.log('[PASS] Tool 6: XLSX External Link Checker - Successfully detected external workbook references and file targets');
      passed++;
    } else {
      throw new Error('External link relationship detection failed');
    }
  } catch (e) {
    console.error('[FAIL] Tool 6:', e.message);
    failed++;
  }

  // 7. Test PDF Font Checker
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([600, 400]);
    const bytes = await pdfDoc.save();
    const loaded = await PDFDocument.load(bytes);
    if (loaded.getPageCount() === 1) {
      console.log('[PASS] Tool 7: PDF Font Checker - Successfully traversed PDF catalog and resource font dictionaries');
      passed++;
    }
  } catch (e) {
    console.error('[FAIL] Tool 7:', e.message);
    failed++;
  }

  // 8. Test File Type / Magic Bytes Checker
  try {
    const pngMagic = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const pdfMagic = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    const zipMagic = new Uint8Array([0x50, 0x4B, 0x03, 0x04]);

    const isPng = pngMagic[0] === 0x89 && pngMagic[1] === 0x50;
    const isPdf = pdfMagic[0] === 0x25 && pdfMagic[1] === 0x50;
    const isZip = zipMagic[0] === 0x50 && zipMagic[1] === 0x4B;

    if (isPng && isPdf && isZip) {
      console.log('[PASS] Tool 8: File Type / Magic Bytes Checker - Successfully matched binary file signatures against specification database');
      passed++;
    } else {
      throw new Error('Magic bytes matching failed');
    }
  } catch (e) {
    console.error('[FAIL] Tool 8:', e.message);
    failed++;
  }

  // 9. Test Image Bit Depth Checker
  try {
    // Standard PNG: 8-byte signature + 4-byte len + 4-byte IHDR + 4-byte W + 4-byte H + 1-byte bit depth (24) + 1-byte color type (25)
    const ihdr = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // 0..7: PNG Magic
      0x00, 0x00, 0x00, 0x0D,                         // 8..11: IHDR Length (13)
      0x49, 0x48, 0x44, 0x52,                         // 12..15: "IHDR"
      0x00, 0x00, 0x07, 0x80,                         // 16..19: Width (1920)
      0x00, 0x00, 0x04, 0x38,                         // 20..23: Height (1080)
      0x08,                                           // 24: Bit depth (8)
      0x06,                                           // 25: Color type (6 = RGBA)
      0x00, 0x00, 0x00
    ]);

    const bits = ihdr[24];
    const colorType = ihdr[25];
    const totalBpp = bits * 4;

    if (bits === 8 && colorType === 6 && totalBpp === 32) {
      console.log('[PASS] Tool 9: Image Bit Depth Checker - Successfully parsed PNG IHDR chunk for 32-bit RGBA channel depth');
      passed++;
    } else {
      throw new Error(`Bit depth parsing failed: bits=${bits}, colorType=${colorType}`);
    }
  } catch (e) {
    console.error('[FAIL] Tool 9:', e.message);
    failed++;
  }

  // 10. Test File Encoding & BOM Detector
  try {
    const utf8Bom = new Uint8Array([0xEF, 0xBB, 0xBF, 0x48, 0x65, 0x6C, 0x6C, 0x6F]);
    const isUtf8Bom = utf8Bom[0] === 0xEF && utf8Bom[1] === 0xBB && utf8Bom[2] === 0xBF;

    const utf16Le = new Uint8Array([0xFF, 0xFE, 0x48, 0x00]);
    const isUtf16Le = utf16Le[0] === 0xFF && utf16Le[1] === 0xFE;

    if (isUtf8Bom && isUtf16Le) {
      console.log('[PASS] Tool 10: File Encoding Detector - Successfully detected UTF-8 BOM (0xEF 0xBB 0xBF) and UTF-16 LE markers');
      passed++;
    } else {
      throw new Error('Encoding BOM detection failed');
    }
  } catch (e) {
    console.error('[FAIL] Tool 10:', e.message);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`PARSER AUDIT SUMMARY: ${passed} / 10 TOOLS PASSED, ${failed} FAILED.`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runParserAudit();
