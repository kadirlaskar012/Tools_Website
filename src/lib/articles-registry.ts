import { ArticleDefinition } from './types';
import { OFFICE_ARTICLES } from './articles/office-articles';
import { PDF_ARTICLES } from './articles/pdf-articles';
import { IMAGE_ARTICLES } from './articles/image-articles';
import { FILE_ARTICLES } from './articles/file-articles';

export const ARTICLE_LIST: ArticleDefinition[] = [
  ...OFFICE_ARTICLES,
  ...PDF_ARTICLES,
  ...IMAGE_ARTICLES,
  ...FILE_ARTICLES,
];

export const ARTICLE_REGISTRY: Record<string, ArticleDefinition> = ARTICLE_LIST.reduce(
  (acc, article) => {
    acc[article.slug] = article;
    return acc;
  },
  {} as Record<string, ArticleDefinition>
);

export function getArticleBySlug(slug: string): ArticleDefinition | undefined {
  return ARTICLE_REGISTRY[slug];
}

export function getArticlesByCategory(category: string): ArticleDefinition[] {
  return ARTICLE_LIST.filter((article) => article.category === category);
}

export function getRelatedArticles(currentSlug: string, count: number = 3): ArticleDefinition[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return ARTICLE_LIST.slice(0, count);

  // First pick explicitly declared related articles
  const explicit = current.relatedArticleSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is ArticleDefinition => a !== undefined && a.slug !== currentSlug);

  if (explicit.length >= count) {
    return explicit.slice(0, count);
  }

  // Fallback to same category
  const sameCategory = ARTICLE_LIST.filter(
    (a) => a.category === current.category && a.slug !== currentSlug && !explicit.some((e) => e.slug === a.slug)
  );

  return [...explicit, ...sameCategory].slice(0, count);
}

/**
 * Calculates the exact article body word count excluding navigation,
 * metadata, buttons, UI labels, and boilerplate.
 */
export function calculateArticleBodyWordCount(article: ArticleDefinition): number {
  let text = `${article.title} ${article.quickTakeaway} `;

  // Add all section content
  for (const section of article.sections) {
    text += `${section.title} `;
    text += section.paragraphs.join(' ') + ' ';
    if (section.subheadings) {
      for (const sub of section.subheadings) {
        text += `${sub.title} ${sub.content.join(' ')} `;
      }
    }
    if (section.callout) {
      text += `${section.callout.title} ${section.callout.text} `;
    }
    if (section.table) {
      text += section.table.headers.join(' ') + ' ';
      for (const row of section.table.rows) {
        text += row.join(' ') + ' ';
      }
    }
  }

  // Add FAQs
  for (const faq of article.faqs) {
    text += `${faq.question} ${faq.answer} `;
  }

  // Add Conclusion
  text += article.conclusion;

  // Split on whitespace and filter empty tokens
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}
