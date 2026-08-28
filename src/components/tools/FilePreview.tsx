'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode2,
  Maximize2,
  Minimize2,
  Layers,
  FileBox,
  Eye,
  FileAudio,
  FileVideo,
} from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface FilePreviewProps {
  file: File;
  headline?: string;
}

export function FilePreview({ file }: FilePreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);
  const [textSnippet, setTextSnippet] = useState<string | null>(null);
  const [csvRows, setCsvRows] = useState<string[][] | null>(null);
  const [xlsxSheets, setXlsxSheets] = useState<{ name: string; rows: string[][] }[] | null>(null);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [docxSnippet, setDocxSnippet] = useState<string | null>(null);
  const [pptxSlideCount, setPptxSlideCount] = useState<number | null>(null);
  const [hexDump, setHexDump] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'hex'>('preview');
  const [isZoomed, setIsZoomed] = useState(false);

  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  const isImage =
    fileType.startsWith('image/') ||
    /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)$/i.test(fileName);

  const isPdf = fileType === 'application/pdf' || fileName.endsWith('.pdf');

  const isCsv =
    fileType.includes('csv') ||
    fileType.includes('tab-separated') ||
    /\.(csv|tsv)$/i.test(fileName);

  const isXlsx =
    fileType.includes('spreadsheet') ||
    /\.(xlsx|xlsm|xlsb|xltx)$/i.test(fileName);

  const isDocx =
    fileType.includes('wordprocessingml') ||
    /\.(docx|dotx)$/i.test(fileName);

  const isPptx =
    fileType.includes('presentationml') ||
    /\.(pptx|potx)$/i.test(fileName);

  const isTextOrCode =
    fileType.startsWith('text/') ||
    /\.(txt|json|xml|html|css|js|ts|jsx|tsx|md|yaml|yml|log|ini|env|sh|py|sql)$/i.test(fileName);

  const isAudio = fileType.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(fileName);
  const isVideo = fileType.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv)$/i.test(fileName);

  useEffect(() => {
    // Generate object URL for media
    let url: string | null = null;
    if (isImage || isPdf || isAudio || isVideo) {
      try {
        url = URL.createObjectURL(file);
        setObjectUrl(url);
      } catch {
        // Fallback
      }
    }

    // Read Image Dimensions
    if (isImage) {
      const img = new Image();
      img.onload = () => {
        setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    }

    // Parse CSV
    if (isCsv) {
      file.text().then((text) => {
        const lines = text.split(/\r?\n/).slice(0, 15);
        const parsed = lines
          .filter((l) => l.trim().length > 0)
          .map((l) => {
            // Simple CSV line splitter handling quotes
            const row: string[] = [];
            let inQuotes = false;
            let current = '';
            for (let i = 0; i < l.length; i++) {
              const char = l[i];
              if (char === '"') inQuotes = !inQuotes;
              else if (char === (fileName.endsWith('.tsv') ? '\t' : ',') && !inQuotes) {
                row.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            row.push(current.trim());
            return row;
          });
        setCsvRows(parsed);
      });
    }

    // Parse Plain Text / Code
    if (isTextOrCode) {
      file.text().then((text) => {
        setTextSnippet(text.slice(0, 3000));
      });
    }

    // Parse Office Formats (XLSX, DOCX, PPTX)
    if (isXlsx || isDocx || isPptx) {
      import('jszip').then((JSZipMod) => {
        const JSZip = JSZipMod.default || JSZipMod;
        file.arrayBuffer().then((buf) => {
          JSZip.loadAsync(buf).then((zip) => {
            if (isXlsx) {
              parseXlsxPreview(zip).then((sheets) => setXlsxSheets(sheets));
            } else if (isDocx) {
              parseDocxPreview(zip).then((text) => setDocxSnippet(text));
            } else if (isPptx) {
              const slideFiles = Object.keys(zip.files).filter((k) =>
                k.startsWith('ppt/slides/slide') && k.endsWith('.xml')
              );
              setPptxSlideCount(slideFiles.length);
            }
          });
        });
      });
    }

    // Generate Hex dump for inspection
    file.slice(0, 128).arrayBuffer().then((buf) => {
      const bytes = new Uint8Array(buf);
      let hexString = '';
      for (let i = 0; i < bytes.length; i += 16) {
        const chunk = bytes.slice(i, i + 16);
        const hex = Array.from(chunk)
          .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
          .join(' ');
        const ascii = Array.from(chunk)
          .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
          .join('');
        hexString += `${i.toString(16).padStart(4, '0').toUpperCase()}  ${hex.padEnd(48, ' ')}  |${ascii}|\n`;
      }
      setHexDump(hexString);
    });

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  return (
    <div className="mb-6 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Preview Header Bar */}
      <div className="px-5 py-3.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0">
            {isImage ? (
              <ImageIcon className="w-4 h-4" />
            ) : isPdf ? (
              <FileText className="w-4 h-4" />
            ) : isXlsx || isCsv ? (
              <FileSpreadsheet className="w-4 h-4" />
            ) : isTextOrCode ? (
              <FileCode2 className="w-4 h-4" />
            ) : isAudio ? (
              <FileAudio className="w-4 h-4" />
            ) : isVideo ? (
              <FileVideo className="w-4 h-4" />
            ) : (
              <FileBox className="w-4 h-4" />
            )}
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block">
              {file.name}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {formatFileSize(file.size)} • {file.type || 'Binary Document'}
            </span>
          </div>
        </div>

        {/* Tabs: Visual Preview / Raw Hex */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              Preview
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hex')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hex'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <FileCode2 className="w-3.5 h-3.5" />
              Hex View
            </span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-4 sm:p-6">
        {activeTab === 'hex' ? (
          <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
              Raw File Header Hex Dump (First 128 Bytes):
            </div>
            <pre className="leading-relaxed whitespace-pre font-mono">
              {hexDump || 'Generating binary stream dump...'}
            </pre>
          </div>
        ) : (
          <div>
            {/* 1. IMAGE PREVIEW */}
            {isImage && objectUrl && (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-4 min-h-[220px] max-h-[420px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={objectUrl}
                    alt={file.name}
                    className={`max-h-[380px] max-w-full object-contain rounded-lg shadow-md transition-transform duration-200 ${
                      isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md shadow-md transition"
                    title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                  >
                    {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>

                {imgDimensions && (
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      Dimensions: <strong className="text-slate-900 dark:text-slate-100">{imgDimensions.width} × {imgDimensions.height} px</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      Aspect Ratio: <strong className="text-slate-900 dark:text-slate-100">{(imgDimensions.width / imgDimensions.height).toFixed(2)}:1</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 2. PDF DOCUMENT PREVIEW */}
            {isPdf && objectUrl && (
              <div className="space-y-3">
                <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-950">
                  <iframe
                    src={`${objectUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-0"
                    title="PDF Document View"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Interactive Client-Side PDF Renderer</span>
                  <a
                    href={objectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Open Full PDF in New Tab
                  </a>
                </div>
              </div>
            )}

            {/* 3. CSV SPREADSHEET GRID PREVIEW */}
            {isCsv && csvRows && (
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>CSV Data Table Preview (First {csvRows.length} Rows)</span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-h-72">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2 px-3 text-slate-400 dark:text-slate-500 w-10 text-center border-r border-slate-200 dark:border-slate-700">
                          #
                        </th>
                        {csvRows[0]?.map((_, colIdx) => (
                          <th
                            key={colIdx}
                            className="py-2 px-3 font-bold text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700 last:border-r-0"
                          >
                            {String.fromCharCode(65 + (colIdx % 26))}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {csvRows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-2 px-3 text-slate-400 dark:text-slate-500 text-center font-bold bg-slate-50/50 dark:bg-slate-950/40 border-r border-slate-200 dark:border-slate-700">
                            {rIdx + 1}
                          </td>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="py-2 px-3 text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800 last:border-r-0 max-w-xs truncate"
                              title={cell}
                            >
                              {cell || <span className="text-slate-300 dark:text-slate-600 italic">empty</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. XLSX SPREADSHEET PREVIEW */}
            {isXlsx && xlsxSheets && xlsxSheets.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                    <span>Workbook Worksheet Grid</span>
                  </div>

                  {/* Sheet Tabs Switcher */}
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {xlsxSheets.map((sh, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setActiveSheetIndex(sIdx)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeSheetIndex === sIdx
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {sh.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-h-72">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2 px-3 text-slate-400 dark:text-slate-500 w-10 text-center border-r border-slate-200 dark:border-slate-700">
                          #
                        </th>
                        {xlsxSheets[activeSheetIndex]?.rows[0]?.map((_, colIdx) => (
                          <th
                            key={colIdx}
                            className="py-2 px-3 font-bold text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700 last:border-r-0"
                          >
                            {String.fromCharCode(65 + (colIdx % 26))}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {xlsxSheets[activeSheetIndex]?.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-2 px-3 text-slate-400 dark:text-slate-500 text-center font-bold bg-slate-50/50 dark:bg-slate-950/40 border-r border-slate-200 dark:border-slate-700">
                            {rIdx + 1}
                          </td>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="py-2 px-3 text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800 last:border-r-0 max-w-xs truncate"
                              title={cell}
                            >
                              {cell || <span className="text-slate-300 dark:text-slate-600 italic">empty</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. WORD DOCX DOCUMENT PREVIEW */}
            {isDocx && docxSnippet && (
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Word Document Content Preview</span>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner max-h-64 overflow-y-auto leading-relaxed text-sm text-slate-700 dark:text-slate-300">
                  {docxSnippet}
                </div>
              </div>
            )}

            {/* 6. POWERPOINT PPTX SLIDES PREVIEW */}
            {isPptx && pptxSlideCount !== null && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    PowerPoint Presentation Detected
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Contains <strong className="text-amber-600 dark:text-amber-400 font-extrabold">{pptxSlideCount}</strong> slides in deck
                  </p>
                </div>
              </div>
            )}

            {/* 7. PLAIN TEXT / CODE / ENCODED FILE PREVIEW */}
            {isTextOrCode && textSnippet && (
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4 text-indigo-600" />
                  <span>File Text & Code Preview</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner border border-slate-800 max-h-72 leading-relaxed">
                  <pre className="whitespace-pre-wrap">{textSnippet}</pre>
                </div>
              </div>
            )}

            {/* 8. AUDIO / VIDEO PREVIEW */}
            {isAudio && objectUrl && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <audio controls src={objectUrl} className="w-full" />
              </div>
            )}

            {isVideo && objectUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black">
                <video controls src={objectUrl} className="w-full max-h-80 object-contain mx-auto" />
              </div>
            )}

            {/* Fallback for other binary files */}
            {!isImage && !isPdf && !isCsv && !isXlsx && !isDocx && !isPptx && !isTextOrCode && !isAudio && !isVideo && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <FileBox className="w-10 h-10 text-indigo-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Binary Document Loaded
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  File header analyzed in browser memory. See extracted technical properties and Hex view tab for deep binary inspection.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to parse XLSX sheets and basic cell contents
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseXlsxPreview(zip: any): Promise<{ name: string; rows: string[][] }[]> {
  try {
    const workbookXml = await zip.file('xl/workbook.xml')?.async('text');
    if (!workbookXml) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(workbookXml, 'application/xml');
    const sheetNodes = doc.getElementsByTagName('sheet');

    // Parse shared strings table if available
    let sharedStrings: string[] = [];
    const sstFile = zip.file('xl/sharedStrings.xml');
    if (sstFile) {
      const sstXml = await sstFile.async('text');
      const sstDoc = parser.parseFromString(sstXml, 'application/xml');
      const siNodes = sstDoc.getElementsByTagName('si');
      sharedStrings = Array.from(siNodes).map((si) => si.textContent || '');
    }

    const sheetsResult: { name: string; rows: string[][] }[] = [];

    for (let i = 0; i < Math.min(sheetNodes.length, 5); i++) {
      const name = sheetNodes[i].getAttribute('name') || `Sheet ${i + 1}`;
      const sheetFile = zip.file(`xl/worksheets/sheet${i + 1}.xml`);
      if (sheetFile) {
        const sheetXml = await sheetFile.async('text');
        const sheetDoc = parser.parseFromString(sheetXml, 'application/xml');
        const rowNodes = sheetDoc.getElementsByTagName('row');

        const rows: string[][] = [];
        for (let r = 0; r < Math.min(rowNodes.length, 10); r++) {
          const cNodes = rowNodes[r].getElementsByTagName('c');
          const rowData: string[] = [];
          for (let c = 0; c < Math.min(cNodes.length, 8); c++) {
            const cellType = cNodes[c].getAttribute('t');
            const vNode = cNodes[c].getElementsByTagName('v')[0];
            let cellValue = vNode ? vNode.textContent || '' : '';
            if (cellType === 's' && sharedStrings[Number(cellValue)]) {
              cellValue = sharedStrings[Number(cellValue)];
            }
            rowData.push(cellValue);
          }
          if (rowData.length > 0) rows.push(rowData);
        }
        sheetsResult.push({ name, rows: rows.length > 0 ? rows : [['(Empty Sheet)']] });
      }
    }

    return sheetsResult;
  } catch {
    return [];
  }
}

// Helper to parse Word document.xml preview
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseDocxPreview(zip: any): Promise<string> {
  try {
    const docFile = zip.file('word/document.xml');
    if (!docFile) return '';
    const xml = await docFile.async('text');
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const pNodes = doc.getElementsByTagName('w:p');
    const paragraphs: string[] = [];
    for (let i = 0; i < Math.min(pNodes.length, 25); i++) {
      const text = pNodes[i].textContent;
      if (text && text.trim().length > 0) {
        paragraphs.push(text.trim());
      }
    }
    return paragraphs.join('\n\n') || 'Document structure parsed successfully.';
  } catch {
    return '';
  }
}
