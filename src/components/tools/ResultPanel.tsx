'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import { formatFileSize } from '@/lib/utils';
import { FilePreview } from './FilePreview';

interface ResultPanelProps {
  result: AnalysisResult;
  file?: File | null;
  onReset: () => void;
}

export function ResultPanel({ result, file, onReset }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const getStatusBadge = () => {
    switch (result.status) {
      case 'clean':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Verified / Clean
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Flagged Items Detected
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-xs">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Attention Needed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 shadow-xs">
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            Inspection Verified
          </span>
        );
    }
  };

  const copyToClipboard = () => {
    const textReport = [
      `--- File Intelligence Inspection Report ---`,
      `File: ${result.fileName}`,
      `Size: ${formatFileSize(result.fileSize)}`,
      `Type: ${result.fileType}`,
      `Status: ${result.status.toUpperCase()}`,
      `Headline: ${result.headline}`,
      `Summary: ${result.summary}`,
      `\nProperties:`,
      ...result.properties.map((p) => `- ${p.label}: ${p.value ?? 'N/A'}`),
      result.warnings && result.warnings.length > 0
        ? `\nWarnings:\n${result.warnings.map((w) => `* ${w}`).join('\n')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName}-file-intelligence-report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/90 via-indigo-50/20 to-purple-50/20 dark:from-slate-900/80 dark:to-slate-950">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            {getStatusBadge()}
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
              {formatFileSize(result.fileSize)}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 truncate max-w-xl">
            {result.fileName}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-all"
            title="Copy report text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={downloadJson}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-all"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-md shadow-indigo-500/25 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Inspect Another</span>
          </button>
        </div>
      </div>

      {/* Main Headline & Summary Callout */}
      <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {result.headline}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {result.summary}
            </p>
          </div>
        </div>

        {/* Warning Callouts if any */}
        {result.warnings && result.warnings.length > 0 && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-semibold space-y-1.5">
            <div className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Inspection Warnings</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-300 font-normal">
              {result.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Visual File Preview (Image / PDF / Spreadsheet / Code / Document / Hex) */}
      {file && (
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800">
          <FilePreview file={file} headline={result.headline} />
        </div>
      )}

      {/* Key Metric Properties Grid */}
      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Extracted Technical Properties
          </h4>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Parsed Locally in RAM
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {result.properties.map((prop, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {prop.label}
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1 break-words">
                {prop.value !== null && prop.value !== undefined
                  ? String(prop.value)
                  : 'N/A'}
              </div>
              {prop.description && (
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {prop.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
