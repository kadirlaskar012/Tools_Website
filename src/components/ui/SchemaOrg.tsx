import React from 'react';
import { ToolDefinition, ToolFAQItem } from '@/lib/types';
import { getBaseUrl } from '@/lib/utils';

interface WebApplicationSchemaProps {
  tool: ToolDefinition;
}

export function WebApplicationSchema({ tool }: WebApplicationSchemaProps) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/tools/${tool.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All (Web Browser)',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description: tool.shortDescription,
    url: url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.howItWorksSteps.map((s) => s.title).join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQPageSchemaProps {
  faqs: ToolFAQItem[];
}

export function FAQPageSchema({ faqs }: FAQPageSchemaProps) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = getBaseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const baseUrl = getBaseUrl();

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'File Intelligence',
    url: baseUrl,
    description: 'Understand what’s inside your files. Privacy-first, client-side browser file inspection toolkit.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}

export function OrganizationSchema() {
  const baseUrl = getBaseUrl();

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'File Intelligence',
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description: 'Privacy-first online file inspection and technical verification platform.',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
    />
  );
}

interface ArticleSchemaProps {
  article: {
    slug: string;
    title: string;
    metaDescription: string;
    publishedDate: string;
    updatedDate: string;
    author: string;
    category: string;
  };
}

export function ArticleSchema({ article }: ArticleSchemaProps) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/articles/${article.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.metaDescription,
    url: url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Organization',
      name: article.author || 'File Intelligence Editorial Team',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'File Intelligence',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
    datePublished: article.publishedDate,
    dateModified: article.updatedDate || article.publishedDate,
    articleSection: article.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteOrganizationSchema() {
  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema />
    </>
  );
}

