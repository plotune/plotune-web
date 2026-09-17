import { buildModelComparisonChart } from './charts';

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
export const researchTopics = [
  { name: 'Agentic Test & Validation', description: 'Monthly benchmark readouts and workflow studies.', status: 'Active' },
  { name: 'Model Comparisons', description: 'Versioned results through common task manifests.', status: 'In development' },
  { name: 'Hardware Comparisons', description: 'Inference hardware performance and operating trade-offs.', status: 'In development' },
];
