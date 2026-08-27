import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface PrivacyNoticeProps {
  className?: string;
  level?: string;
  customText?: string;
}

export function PrivacyNotice({
  className = '',
  level = 'Client-Side Local Processing',
  customText,
}: PrivacyNoticeProps) {
  return (
    <div
      className={`flex items-start sm:items-center gap-3 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 text-xs ${className}`}
    >
      <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex-shrink-0">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div className="flex-1 leading-relaxed">
        <span className="font-semibold text-emerald-950 dark:text-emerald-200 mr-1.5">
          {level}:
        </span>
        <span>
          {customText ||
            'Your file stays on your device. Processing happens locally in your browser.'}
        </span>
      </div>
    </div>
  );
}
