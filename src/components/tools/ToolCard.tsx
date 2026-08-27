import React from 'react';
import Link from 'next/link';
import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode2,
  ShieldCheck,
  ArrowRight,
  Maximize2,
  ScanLine,
  Layers,
  Link2,
  Binary,
  Presentation,
  Type,
  EyeOff,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { ToolDefinition } from '@/lib/types';

interface ToolCardProps {
  tool: ToolDefinition;
  variant?: 'default' | 'compact' | 'featured';
}

export function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  // Category-specific visual accents & gradients
  const getToolTheme = (toolId: string, category: string) => {
    switch (toolId) {
      case 'xlsx-hidden-sheet-detector':
      case 'xlsx-external-link-checker':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80',
          glow: 'group-hover:shadow-emerald-500/10 group-hover:border-emerald-300 dark:group-hover:border-emerald-700',
          badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          btnHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
        };
      case 'pdf-page-size-checker':
      case 'pdf-font-checker':
        return {
          gradient: 'from-rose-500 to-orange-500',
          iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/80',
          glow: 'group-hover:shadow-rose-500/10 group-hover:border-rose-300 dark:group-hover:border-rose-700',
          badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          btnHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
        };
      case 'image-dpi-checker':
      case 'image-bit-depth-checker':
        return {
          gradient: 'from-blue-500 to-cyan-500',
          iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-200/80 dark:border-cyan-800/80',
          glow: 'group-hover:shadow-cyan-500/10 group-hover:border-cyan-300 dark:group-hover:border-cyan-700',
          badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
          btnHover: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
        };
      case 'docx-metadata-checker':
      case 'pptx-hidden-slide-detector':
        return {
          gradient: 'from-purple-500 to-indigo-600',
          iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200/80 dark:border-purple-800/80',
          glow: 'group-hover:shadow-purple-500/10 group-hover:border-purple-300 dark:group-hover:border-purple-700',
          badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          btnHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
        };
      case 'file-type-checker':
      case 'file-encoding-detector':
      default:
        return {
          gradient: 'from-indigo-500 to-sky-500',
          iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80',
          glow: 'group-hover:shadow-indigo-500/10 group-hover:border-indigo-300 dark:group-hover:border-indigo-700',
          badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          btnHover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
        };
    }
  };

  const theme = getToolTheme(tool.id, tool.category);

  const getIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 transition-transform group-hover:scale-110' };
    switch (iconName) {
      case 'EyeOff':
        return <EyeOff {...props} />;
      case 'Maximize2':
        return <Maximize2 {...props} />;
      case 'ScanLine':
        return <ScanLine {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Presentation':
        return <Presentation {...props} />;
      case 'Link2':
        return <Link2 {...props} />;
      case 'Type':
        return <Type {...props} />;
      case 'Binary':
        return <Binary {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'FileCode':
      case 'FileCode2':
        return <FileCode {...props} />;
      default:
        return <FileText {...props} />;
    }
  };

  if (variant === 'compact') {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className={`group relative flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 ${theme.glow}`}
      >
        <div className={`p-2.5 rounded-xl border flex-shrink-0 mt-0.5 ${theme.iconBg}`}>
          {getIcon(tool.iconName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {tool.title}
            </h4>
            <ArrowRight className={`w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-all flex-shrink-0 ${theme.btnHover}`} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {tool.shortDescription}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 overflow-hidden ${theme.glow}`}
    >
      {/* Decorative subtle gradient background splash on hover */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

      <div>
        {/* Header with Icon and Category Tag */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className={`p-3.5 rounded-2xl border shadow-xs ${theme.iconBg}`}>
            {getIcon(tool.iconName)}
          </div>
          <span
            className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full border ${theme.badge}`}
          >
            {tool.category}
          </span>
        </div>

        {/* Title and Description */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
          {tool.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 truncate max-w-[170px]">
          {tool.supportedFormats.displayNames}
        </span>
        <div className={`flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 transition-all ${theme.btnHover}`}>
          <span>Open Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
