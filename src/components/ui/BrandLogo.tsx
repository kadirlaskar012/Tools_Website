import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subtitle?: boolean;
}

/**
 * Unique, Modern & Ultra-Professional Brand Logo for FileIntelligence.
 * Combines an Origami Shield / Document Fold with a Smart Privacy Core.
 */
export function BrandLogo({
  size = 36,
  className = '',
  showText = true,
  subtitle = true,
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Brand Icon Mark */}
      <div className="relative shrink-0">
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 drop-shadow-md"
        >
          <defs>
            {/* Main Outer Gradient */}
            <linearGradient id="fi-main-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Inner Facet Overlay */}
            <linearGradient id="fi-facet-grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>

            {/* Core Shield Glow */}
            <linearGradient id="fi-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e0e7ff" />
            </linearGradient>
          </defs>

          {/* Squircle Background Container */}
          <rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="11"
            fill="url(#fi-main-grad)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />

          {/* Facet / Lighting Overlay */}
          <path
            d="M1 12C1 5.92487 5.92487 1 12 1H39L1 39V12Z"
            fill="url(#fi-facet-grad)"
            style={{ mixBlendMode: 'overlay' }}
          />

          {/* Geometric 'F' & Smart Privacy Document Shield Mark */}
          {/* Document Sheet Silhouette */}
          <path
            d="M12 10.5C12 9.67157 12.6716 9 13.5 9H22L28 15V28.5C28 29.3284 27.3284 30 26.5 30H13.5C12.6716 30 12 29.3284 12 28.5V10.5Z"
            fill="white"
            fillOpacity="0.16"
          />

          {/* Top Folded Corner */}
          <path
            d="M22 9V14C22 14.5523 22.4477 15 23 15H28L22 9Z"
            fill="white"
            fillOpacity="0.4"
          />

          {/* Sleek Central Intelligence Eye / Shield Check Core */}
          <path
            d="M15.5 17.5H23.5M15.5 21.5H21M15.5 25.5H19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Glowing Smart Node */}
          <circle cx="24.5" cy="24.5" r="3.5" fill="#10b981" stroke="white" strokeWidth="1.5" />
        </svg>

        {/* Ambient Pulse Ping Badge */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-xs"></span>
        </span>
      </div>

      {/* Brand Text Name & Subtitle */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100 leading-none">
              File<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">Intelligence</span>
            </span>
          </div>
          {subtitle && (
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase mt-0.5">
              Privacy-First Toolkit
            </span>
          )}
        </div>
      )}
    </div>
  );
}
