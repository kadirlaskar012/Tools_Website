'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, File, AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { ToolDefinition } from '@/lib/types';
import { formatFileSize } from '@/lib/utils';

interface FileDropzoneProps {
  tool: ToolDefinition;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export function FileDropzone({
  tool,
  onFileSelect,
  selectedFile,
  disabled = false,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (
      tool.supportedFormats.extensions.includes('*') ||
      tool.supportedFormats.mimePatterns.includes('*/*')
    ) {
      setErrorMessage(null);
      return true;
    }

    const fileName = file.name.toLowerCase();
    const hasValidExt = tool.supportedFormats.extensions.some((ext) =>
      fileName.endsWith(ext.toLowerCase())
    );

    if (!hasValidExt) {
      setErrorMessage(
        `Invalid file format. Supported: ${tool.supportedFormats.displayNames}`
      );
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const openFilePicker = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const acceptString = tool.supportedFormats.extensions.includes('*')
    ? undefined
    : tool.supportedFormats.extensions.join(',');

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptString}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        id={`file-input-${tool.id}`}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        role="button"
        tabIndex={0}
        aria-label={`Drop or select ${tool.supportedFormats.displayNames} to inspect`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFilePicker();
          }
        }}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl border-2 border-dashed transition-all cursor-pointer select-none text-center overflow-hidden ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99] shadow-lg shadow-indigo-500/20'
            : selectedFile
            ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/10'
            : 'border-slate-300 dark:border-slate-700 bg-gradient-to-b from-white/90 to-slate-50/70 dark:from-slate-900/90 dark:to-slate-950/70 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {selectedFile ? (
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-in zoom-in-95">
              <File className="w-8 h-8" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 max-w-sm sm:max-w-md truncate">
                {selectedFile.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                {formatFileSize(selectedFile.size)} • Ready for local analysis
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-sm transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Choose a different file</span>
            </button>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Drop your file here, or{' '}
                <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 decoration-2">
                  browse your device
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Supported: {tool.supportedFormats.displayNames}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Client-Side Processing • Your file never leaves this device</span>
            </div>
          </div>
        )}
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="mt-3.5 flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
