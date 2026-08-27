export type ToolCategory = 'image' | 'pdf' | 'office' | 'file' | 'privacy';

export interface CategoryInfo {
  id: ToolCategory;
  slug: string;
  name: string;
  title: string;
  shortDescription: string;
  description: string;
  longGuide?: string;
  iconName: string;
  popularToolIds: string[];
  faqs?: ToolFAQItem[];
}

export interface ToolFAQItem {
  question: string;
  answer: string;
}

export interface ToolUseCase {
  title: string;
  description: string;
  audience: string;
}

export interface ToolStep {
  title: string;
  description: string;
}

export interface ResultExplanationItem {
  term: string;
  explanation: string;
  whyItMatters: string;
}

export interface PracticalExampleItem {
  title: string;
  scenario: string;
  outcome: string;
}

export interface DeepDiveComparisonTable {
  headers: string[];
  rows: {
    col1: string;
    col2: string;
    col3?: string;
    col4?: string;
    col5?: string;
  }[];
}

export interface DeepDiveSection {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  callout?: {
    type: 'info' | 'warning' | 'tip' | 'privacy';
    title: string;
    text: string;
  };
  comparisonTable?: DeepDiveComparisonTable;
}

export interface ContextualCrossLink {
  preText: string;
  toolSlug: string;
  toolName: string;
  postText: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ToolCategory;
  iconName: string;
  featured?: boolean;
  popular?: boolean;
  supportedFormats: {
    extensions: string[];
    mimePatterns: string[];
    displayNames: string;
  };
  privacyLevel: 'Client-Side Local Processing' | 'Secure Stream Processing';
  privacyExplanation: string;
  howAnalysisWorks: string;
  deepDiveSection?: DeepDiveSection;
  howItWorksSteps: ToolStep[];
  whyUseReasons: {
    title: string;
    description: string;
  }[];
  useCases?: ToolUseCase[];
  resultsExplanation: ResultExplanationItem[];
  practicalExamples: PracticalExampleItem[];
  fileLimitations: string;
  contextualLinks?: ContextualCrossLink[];
  faqs: ToolFAQItem[];
  relatedToolIds: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    primaryKeyword: string;
    secondaryKeywords: string[];
    schemaType?: 'WebApplication' | 'SoftwareApplication';
  };
  technicalDetails?: {
    headerSpec?: string;
    keyStandards?: string[];
  };
}

export interface AnalysisProperty {
  label: string;
  value: string | number | boolean | null;
  status?: 'normal' | 'warning' | 'alert' | 'success';
  description?: string;
}

export interface AnalysisResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  lastModified?: number;
  status: 'clean' | 'flagged' | 'warning' | 'info';
  headline: string;
  summary: string;
  properties: AnalysisProperty[];
  details?: Record<string, unknown>;
  warnings?: string[];
  insights?: string[];
}

export interface ArticleSubheading {
  title: string;
  content: string[];
  codeBlock?: {
    language: string;
    code: string;
  };
}

export interface ArticleSection {
  id: string;
  title: string;
  paragraphs: string[];
  subheadings?: ArticleSubheading[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  callout?: {
    type: 'tip' | 'warning' | 'info' | 'privacy' | 'caution';
    title: string;
    text: string;
  };
  codeBlock?: {
    language: string;
    code: string;
  };
}

export interface ArticleDefinition {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: ToolCategory;
  author: string;
  publishedDate: string;
  updatedDate: string;
  readTime: string;
  primaryToolSlug: string;
  relatedToolSlugs: string[];
  relatedArticleSlugs: string[];
  quickTakeaway: string;
  sections: ArticleSection[];
  faqs: ToolFAQItem[];
  conclusion: string;
}
