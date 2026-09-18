import { buildModelComparisonChart } from './charts';

// `segment` is optional and maps to a key in src/content/solutions.js — when set, the article
// renders a "see how this workflow can be automated" CTA to /solutions/<segment>. `cta` is an
// explicit override ({path, summary, label}) for articles whose next step isn't a solution page
// (e.g. straight to /nexus, or the /agentic-test-development pillar page) — see
// ResearchArticle.jsx's resolveCta.
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
}, {
  slug: 'what-is-agentic-test-development',
  title: 'What Is Agentic Test & Development? From Test Scripts to Autonomous Engineering',
  summary: 'What "agentic testing" actually means, and how agentic test automation differs from a fixed test script by deciding its next bounded action instead of replaying a fixed one.',
  topic: 'Agentic Test & Development',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '5 min read',
  cta: { path: '/agentic-test-development', summary: 'Agentic Test & Development: the full comparison, and every workflow it applies to.', label: 'See the full picture' },
  loader: () => import('../articles/what-is-agentic-test-development.mdx'),
}, {
  slug: 'ai-hardware-in-the-loop-testing',
  title: 'AI Hardware-in-the-Loop Testing: Giving AI Agents Access to Real Hardware',
  summary: 'Why most HIL rigs keep AI agents out entirely, and what a bounded-access architecture for AI HIL testing looks like once it stops being a trust exercise.',
  topic: 'AI Hardware-in-the-Loop Testing',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '5 min read',
  segment: 'hil-testing',
  loader: () => import('../articles/ai-hardware-in-the-loop-testing.mdx'),
}, {
  slug: 'ai-agents-control-test-benches-with-mcp',
  title: 'How AI Agents Can Control Real Test Benches with MCP',
  summary: "Why MCP hardware test automation works where raw shell access doesn't — a narrow, typed, authorized set of operations is what makes AI agent hardware control safe to approve.",
  topic: 'MCP for Hardware Testing',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '5 min read',
  cta: { path: '/nexus', summary: 'Plotune Nexus is the MCP-based control surface this describes.', label: 'Explore Plotune Nexus' },
  loader: () => import('../articles/ai-agents-control-test-benches-with-mcp.mdx'),
}, {
  slug: 'agentic-ecu-testing-can-to-execution',
  title: 'Agentic ECU Testing: From CAN Signals to Autonomous Test Execution',
  summary: 'A look at the decode layer underneath CAN test automation — why DBC-based signal decode, not raw frames, is what makes ECU test automation and autonomous execution trustworthy.',
  topic: 'CAN / ECU Testing',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '5 min read',
  segment: 'can-ecu-testing',
  loader: () => import('../articles/agentic-ecu-testing-can-to-execution.mdx'),
}, {
  slug: 'agentic-testing-ros2-dds-systems',
  title: 'Agentic Testing for ROS 2 & DDS Systems',
  summary: 'A walkthrough of how an AI agent runs ROS2 test automation end to end — discovering the DDS graph, commanding and gating on telemetry, recording multi-topic evidence, and producing a verdict.',
  topic: 'ROS 2 / DDS Testing',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '4 min read',
  segment: 'ros2-dds-testing',
  loader: () => import('../articles/agentic-testing-ros2-dds-systems.mdx'),
}, {
  slug: 'building-a-24-7-unattended-test-lab',
  title: 'From Manual Test Benches to Unattended Testing: Building a 24/7 Hardware Test Lab',
  summary: 'A practical look at what it takes to turn a manual test bench into an automated test bench that supports unattended testing and remote hardware testing around the clock.',
  topic: 'Test Automation & Orchestration',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '4 min read',
  segment: 'test-orchestration',
  loader: () => import('../articles/building-a-24-7-unattended-test-lab.mdx'),
}, {
  slug: 'ai-agents-vs-traditional-test-automation',
  title: 'AI Agents vs. Traditional Test Automation: What Should Actually Be Autonomous?',
  summary: 'A framework for AI test automation that scopes autonomous testing by how bounded and reviewable an action is, not by how capable the underlying model happens to be.',
  topic: 'Agentic Test & Development',
  publishedAt: '2026-09-18', updatedAt: '2026-09-18', featured: false, published: true, readingTime: '5 min read',
  cta: { path: '/agentic-test-development', summary: 'Agentic Test & Development: where the line between bounded and autonomous actually sits.', label: 'See the full picture' },
  loader: () => import('../articles/ai-agents-vs-traditional-test-automation.mdx'),
}];

export const publishedResearchArticles = articles.filter((article) => article.published);
export const getResearchArticle = (slug) => publishedResearchArticles.find((article) => article.slug === slug);
