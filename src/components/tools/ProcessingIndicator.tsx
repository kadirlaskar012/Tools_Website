import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingIndicatorProps {
  statusText?: string;
}

export function ProcessingIndicator({
  statusText = 'Analyzing file structure locally in browser...',
}: ProcessingIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center animate-in fade-in duration-200"
    >
      <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Processing File
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        {statusText}
      </div>
      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
        Zero upload • Processing 100% on device
      </div>
    </div>
  );
}
