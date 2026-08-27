import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOL_LIST, getToolBySlug } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tools/ToolPageLayout';
import { getBaseUrl } from '@/lib/utils';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return TOOL_LIST.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/tools/${tool.slug}`;

  return {
    title: tool.seo.metaTitle,
    description: tool.seo.metaDescription,
    keywords: tool.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.seo.metaTitle,
      description: tool.seo.metaDescription,
      url: canonicalUrl,
      type: 'website',
      siteName: 'File Intelligence',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.seo.metaTitle,
      description: tool.seo.metaDescription,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolPageLayout tool={tool} />;
}
