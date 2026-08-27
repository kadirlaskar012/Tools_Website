import { CategoryInfo, ToolCategory } from './types';

export const CATEGORIES: Record<ToolCategory, CategoryInfo> = {
  office: {
    id: 'office',
    slug: 'office-tools',
    name: 'Office Tools',
    title: 'Office Document, Spreadsheet & Presentation Inspectors',
    shortDescription: 'Detect hidden Excel sheets, PowerPoint hidden slides, external links, and Word metadata.',
    description:
      'Audit Microsoft Office formats (XLSX, DOCX, PPTX) for confidential leaks, embedded author metadata, revision history, hidden worksheets, external formula connections, and concealed presentation slides.',
    longGuide:
      'Microsoft Office files (OpenXML formats including .docx, .xlsx, and .pptx) are compressed ZIP archives containing hundreds of individual XML property streams and relationship definitions. Behind standard cell values and slides lie embedded author identities, edit duration counters, hidden worksheets (including VBA xlSheetVeryHidden tabs), external workbook dependencies, and skipped presentation slides. Our browser-based Office inspection suite unpacks and audits these streams in memory, allowing you to sanitize and verify business files prior to distribution.',
    iconName: 'FileSpreadsheet',
    popularToolIds: [
      'xlsx-hidden-sheet-detector',
      'docx-metadata-checker',
      'pptx-hidden-slide-detector',
      'xlsx-external-link-checker',
    ],
    faqs: [
      {
        question: 'Why is it important to audit Microsoft Office files before sharing?',
        answer:
          'Office files embed extensive metadata such as creator names, corporate network paths, revision histories, hidden worksheet tabs, and skipped presentation slides that can lead to unintentional data leaks during legal filings or client proposals.',
      },
      {
        question: 'Are my confidential business spreadsheets or proposals uploaded to your servers?',
        answer:
          'No. All Office tools execute entirely in your web browser memory using client-side JavaScript ZIP and XML decompilers. No documents or spreadsheet data leave your computer.',
      },
      {
        question: 'What is the difference between OpenXML (.docx/.xlsx) and legacy Office (.doc/.xls)?',
        answer:
          'OpenXML files (introduced in Office 2007) are standardized ZIP packages of XML files. Legacy formats (.doc, .xls) are proprietary binary compound files. Our suite specifically audits modern OpenXML structures.',
      },
    ],
  },
  pdf: {
    id: 'pdf',
    slug: 'pdf-tools',
    name: 'PDF Tools',
    title: 'PDF Inspection & Document Verification Utilities',
    shortDescription: 'Check page dimensions, inspect embedded fonts, and audit PDF document structure.',
    description:
      'Verify PDF document geometries, detect non-standard trim boxes or mixed page sizes, inspect embedded font encodings, and validate PDF compliance locally without uploading sensitive files to external servers.',
    longGuide:
      'The Portable Document Format (PDF) is the universal standard for digital documents, print publishing, and legal archiving. Ensuring a PDF is ready for commercial printing or court submission requires verifying that page bounding boxes (/MediaBox, /CropBox, /TrimBox) conform to exact standard paper dimensions and that all referenced glyph outlines (/Font dictionaries) are 100% embedded or subsetted. Our PDF inspection utilities examine internal PDF dictionaries locally to guarantee pre-press readiness and PDF/A archival compliance.',
    iconName: 'FileText',
    popularToolIds: ['pdf-page-size-checker', 'pdf-font-checker'],
    faqs: [
      {
        question: 'What is PDF pre-flighting and why is it necessary?',
        answer:
          'PDF pre-flighting is the process of verifying that a PDF file contains all necessary resources (such as embedded fonts, correct page geometries, and high-resolution images) required for accurate commercial printing and viewing across all devices.',
      },
      {
        question: 'Can I check multi-page PDF documents for mixed page sizes?',
        answer:
          'Yes. Our PDF tools inspect every individual page in the document catalog and immediately flag whether pages are uniform (e.g., all US Letter or A4) or contain mixed dimensions and orientations.',
      },
      {
        question: 'Does inspecting a PDF upload my private contracts or tax forms?',
        answer:
          'No. PDF geometry and font dictionary extraction occurs 100% in your browser RAM using client-side WebAssembly and JavaScript parsers.',
      },
    ],
  },
  image: {
    id: 'image',
    slug: 'image-tools',
    name: 'Image Tools',
    title: 'Image Analysis & Inspection Utilities',
    shortDescription: 'Inspect DPI, bit depth, pixel dimensions, color profiles, and image metadata.',
    description:
      'Professional image inspection tools designed for designers, prepress operators, and developers. Analyze image resolution, verify print DPI/PPI metrics, inspect color bit depth, and extract header specifications entirely within your browser.',
    longGuide:
      'Digital images contain dual layers of information: raw visual pixel arrays and binary header metadata (EXIF, JFIF APP0, PNG IHDR/pHYs). Understanding the relationship between absolute pixel dimensions and declared DPI/PPI density is vital for commercial printing, fine art reproduction, and digital UI development. Our Image suite extracts header parameters and computes physical print boundaries in inches and millimeters without compression or image quality loss.',
    iconName: 'Image',
    popularToolIds: ['image-dpi-checker', 'image-bit-depth-checker'],
    faqs: [
      {
        question: 'What is the difference between digital image resolution and print DPI?',
        answer:
          'Digital resolution is the absolute pixel count (e.g., 3000 × 2000 px). DPI (Dots Per Inch) is a printing density metric that determines how many pixels are packed into each linear inch of physical paper.',
      },
      {
        question: 'How do I know if my photo has enough resolution for 300 DPI printing?',
        answer:
          'Divide your image pixel width and height by 300. For example, an 1800 × 1200 pixel image prints crisply up to 6 × 4 inches at 300 DPI. Our tool calculates these print dimensions automatically.',
      },
      {
        question: 'Does this image inspection tool compress or modify my photos?',
        answer:
          'No. The tool is strictly read-only and inspects header chunks in memory. Your images remain at original 100% quality on your device.',
      },
    ],
  },
  file: {
    id: 'file',
    slug: 'file-tools',
    name: 'File Tools',
    title: 'Core File Type & Encoding Analysis Utilities',
    shortDescription: 'Validate magic bytes, verify true MIME types, and detect text character encodings.',
    description:
      'Deep binary and text inspection tools. Validate authentic file extensions against true header magic bytes, detect character sets (UTF-8, UTF-16, ISO-8859, Windows-1252), and inspect byte-order marks (BOM).',
    longGuide:
      'Underlying all software systems are binary headers and character encoding formats. Relying solely on file extensions (.jpg, .pdf, .csv) invites security risks like extension spoofing, while mismatched text encodings cause garbled characters (Mojibake) and database import errors. Our File inspection utilities inspect raw hexadecimal magic bytes and evaluate multi-byte UTF-8 sequences to verify authentic formats and encoding integrity.',
    iconName: 'FileCode2',
    popularToolIds: ['file-type-checker', 'file-encoding-detector'],
    faqs: [
      {
        question: 'What are magic bytes and how do they prevent file spoofing?',
        answer:
          'Magic bytes are unique binary signatures placed at the beginning of a file by standard specifications (such as `25 50 44 46` for PDF). Checking magic bytes allows detection of renamed executables or corrupted file containers.',
      },
      {
        question: 'What is Mojibake and why does character encoding matter?',
        answer:
          'Mojibake is the garbled text (like `Ã©` instead of `é`) that appears when software decodes a UTF-8 encoded text or CSV file using a legacy ANSI (Windows-1252) character map. Our encoding detector identifies the exact charset to ensure smooth data migration.',
      },
      {
        question: 'Are raw files or database exports uploaded during binary inspection?',
        answer:
          'No. Binary header slices are read directly in browser memory via the HTML5 File API. No file data is transmitted over the internet.',
      },
    ],
  },
  privacy: {
    id: 'privacy',
    slug: 'privacy-tools',
    name: 'Privacy Tools',
    title: 'Privacy Auditing & Metadata Discovery Tools',
    shortDescription: 'Inspect hidden revisions, author tracking, and embedded telemetry in files.',
    description:
      'Privacy and security audit utilities to inspect documents for tracking markers, author signatures, document modification history, and hidden objects before sharing files publicly or with third parties.',
    longGuide:
      'Every document you export or edit stores invisible digital footprints: author usernames, editing durations, computer network paths, revision histories, and hidden tabs. Sharing un-sanitized files exposes corporate secrets, legal strategies, and personal identities. Our Privacy suite allows you to diagnose and audit these embedded metadata properties directly in your browser before emailing or publishing files.',
    iconName: 'ShieldCheck',
    popularToolIds: ['docx-metadata-checker', 'xlsx-hidden-sheet-detector', 'pptx-hidden-slide-detector'],
    faqs: [
      {
        question: 'What kind of privacy data is typically hidden in common office documents?',
        answer:
          'Documents often conceal author names, last modified usernames, total editing duration, company template pathways, internal network server paths, hidden spreadsheet tabs, and skipped presentation slides.',
      },
      {
        question: 'How does File Intelligence ensure my private files remain secure?',
        answer:
          'Our architecture operates 100% client-side in your browser memory. We never upload, store, or log your files, filenames, or metadata on any server.',
      },
      {
        question: 'Can I use these tools in confidential enterprise or legal environments?',
        answer:
          'Yes. Because no network transmission occurs, our inspection utilities are fully compliant with strict corporate data governance and confidentiality policies.',
      },
    ],
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORY_LIST.find((cat) => cat.slug === slug || cat.id === slug);
}

export function getCategoryById(id: ToolCategory): CategoryInfo {
  return CATEGORIES[id];
}
