'use client';

import React from 'react';
import Link from 'next/link';

interface RichArticleTextProps {
  text: string;
  className?: string;
}

/**
 * Parses article paragraph text and transforms markdown links [Anchor Text](/url)
 * and formatted text (**bold**, *italic*, `code`) into rich Next.js interactive links
 * and semantic HTML elements for optimal SEO anchor text indexing.
 */
export function RichArticleText({ text, className = '' }: RichArticleTextProps) {
  if (!text) return null;

  // Regex to match markdown links: [anchor](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // If no markdown links, render plain text with bold/code formatting
  if (!linkRegex.test(text)) {
    return <span className={className}>{formatInlineText(text)}</span>;
  }

  // Reset regex index
  linkRegex.lastIndex = 0;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    const [fullMatch, anchorText, url] = match;
    const matchIndex = match.index;

    // Text before the link
    if (matchIndex > lastIndex) {
      elements.push(
        <React.Fragment key={`text-${lastIndex}`}>
          {formatInlineText(text.substring(lastIndex, matchIndex))}
        </React.Fragment>
      );
    }

    // Is it internal or external?
    const isInternal = url.startsWith('/') || url.includes('fileintelligence');

    if (isInternal) {
      elements.push(
        <Link
          key={`link-${matchIndex}`}
          href={url}
          className="font-semibold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-600 underline-offset-3 hover:text-indigo-800 dark:hover:text-indigo-300 hover:decoration-indigo-500 transition-colors"
        >
          {anchorText}
        </Link>
      );
    } else {
      elements.push(
        <a
          key={`ext-${matchIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-600 underline-offset-3 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          {anchorText}
        </a>
      );
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  // Remaining text after last link
  if (lastIndex < text.length) {
    elements.push(
      <React.Fragment key={`text-${lastIndex}`}>
        {formatInlineText(text.substring(lastIndex))}
      </React.Fragment>
    );
  }

  return <span className={className}>{elements}</span>;
}

function formatInlineText(raw: string): React.ReactNode {
  // Simple parser for **bold** and `code`
  if (!raw.includes('**') && !raw.includes('`') && !raw.includes('*')) {
    return raw;
  }

  const parts = raw.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);

  return parts.map((part, pIdx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={pIdx} className="font-bold text-slate-900 dark:text-slate-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={pIdx}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={pIdx}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
