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
}, {
  slug: 'automating-can-ecu-tests-with-ai-agents',
  title: 'Automating CAN-based ECU tests with AI agents',
  summary: 'Why a CAN or ECU test procedure is a lifecycle, not a single frame send, and how an agent-driven workflow keeps that lifecycle bounded and reviewable.',
  topic: 'CAN / ECU Testing',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '5 min read',
  segment: 'can-ecu-testing',
  loader: () => import('../articles/automating-can-ecu-tests-with-ai-agents.mdx'),
}, {
  slug: 'running-unattended-ros2-hardware-tests',
  title: 'Running unattended ROS 2 hardware tests',
  summary: "Why most ROS 2 hardware testing is bottlenecked on a terminal and a person watching it, and what it takes to make a DDS-based test run unattended.",
  topic: 'ROS 2 / DDS Testing',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '5 min read',
  segment: 'ros2-dds-testing',
  loader: () => import('../articles/running-unattended-ros2-hardware-tests.mdx'),
}, {
  slug: 'test-automation-engineer-in-the-loop',
  title: 'Why test automation still requires an engineer in the loop',
  summary: 'Automation that stops at "run the script" still needs a person standing next to it — a look at where test automation actually breaks down and what closes the gap.',
  topic: 'Test Automation & Orchestration',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '5 min read',
  segment: 'test-orchestration',
  loader: () => import('../articles/test-automation-engineer-in-the-loop.mdx'),
}];

export const publishedResearchArticles = articles.filter((article) => article.published);
export const getResearchArticle = (slug) => publishedResearchArticles.find((article) => article.slug === slug);
