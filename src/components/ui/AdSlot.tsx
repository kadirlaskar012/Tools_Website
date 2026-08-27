import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'banner';
  className?: string;
}

export function AdSlot({
  slotId = 'placeholder',
  format = 'horizontal',
  className = '',
}: AdSlotProps) {
  // Ads disabled in current phase / development.
  // In production, when ads are activated, this container will safely hold the script without layout shift.
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

  if (!isEnabled) {
    // Hidden in production unless activated; clean zero-shift wrapper
    return null;
  }

  const formatStyles = {
    horizontal: 'min-h-[90px] max-w-[728px]',
    rectangle: 'min-h-[250px] max-w-[300px]',
    banner: 'min-h-[60px] max-w-[468px]',
  };

  return (
    <div
      aria-label="Advertisement Space"
      className={`my-8 mx-auto flex items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden ${formatStyles[format]} ${className}`}
      data-ad-slot={slotId}
    >
      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-600">
        Advertisement
      </span>
    </div>
  );
}
