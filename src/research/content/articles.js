import { buildModelComparisonChart } from './charts';

// `segment` is optional and maps to a key in src/content/solutions.js — when set, the article
// renders a "see how this workflow can be automated" CTA to /solutions/<segment>.
const articles = [{
  slug: 'agentic-test-validation-model-comparison',
  title: 'How to read a monthly benchmark release',
  summary: 'A guide to reading agentic test and validation results through task acceptance, evidence, cost, time, and reliability.',
  topic: 'Agentic Test & Validation',
  publishedAt: '2026-09-17', updatedAt: '2026-09-17', featured: true, published: true, readingTime: '6 min read',
  heroChart: buildModelComparisonChart(),
  loader: () => import('../articles/agentic-test-validation-model-comparison.mdx'),
}];

export const publishedResearchArticles = articles.filter((article) => article.published);
export const getResearchArticle = (slug) => publishedResearchArticles.find((article) => article.slug === slug);
