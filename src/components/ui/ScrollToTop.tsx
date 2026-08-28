'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 200;
          setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      className={`fixed bottom-6 right-6 z-50 p-3 sm:p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/40 backdrop-blur-md transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 cursor-pointer transform active:scale-95 group ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-6 pointer-events-none scale-90'
      }`}
      style={{
        bottom: 'max(1.5rem, calc(1rem + env(safe-area-inset-bottom, 0px)))',
      }}
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-200" />
      <span className="sr-only">Go to top</span>
    </button>
  );
}
