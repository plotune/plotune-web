// Real technical documentation for Plotune Nexus, adapted from the product's own
// internal engineering docs (architecture notes, hardware qualification records,
// MCP tool references) rather than written from scratch as marketing copy. Every
// claim traces back to a real internal source and, where applicable, a public
// standard or vendor reference. See each article's own References section.
//
// This is deliberately separate from src/research/content/articles.js: Research is
// narrative/analysis content; these are reference documents meant to be read on
// their own, bookmarked, and cited. `cta` follows the same {path, summary, label}
// shape research articles use, so it renders through the same funnel-param helpers.
const docs = [
  {
    slug: 'security-model',
    title: 'Security & Trust Model',
    summary: 'How device ownership, key custody, and access boundaries work: what stays on the device, what a compromised session can and cannot do, and what is still being hardened.',
    topic: 'Security',
    order: 1,
    publishedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    readingTime: '7 min read',
    cta: { path: '/solutions/hil-testing', summary: 'AI Hardware-in-the-Loop Testing: the bounded-access architecture this document describes, applied to a real HIL workflow.', label: 'See the HIL workflow' },
    loader: () => import('../nexusdocs/docs/security-model.mdx'),
  },
  {
    slug: 'hardware-compatibility',
    title: 'Hardware & Protocol Compatibility',
    summary: 'Which CAN, UART, XCP, and DoIP hardware families run natively on Nexus today, which need a container, and which are not yet supported, stated without inflating the claim.',
    topic: 'Compatibility',
    order: 2,
    publishedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    readingTime: '8 min read',
    cta: { path: '/solutions/can-ecu-testing', summary: 'CAN / ECU Testing: how this hardware support turns into a bounded release-gate workflow.', label: 'See the CAN workflow' },
    loader: () => import('../nexusdocs/docs/hardware-compatibility.mdx'),
  },
  {
    slug: 'mcp-api',
    title: 'MCP Tools & API Reference',
    summary: 'The actual MCP tool surface an agent calls: real tool names, read-only resources, authentication, and the client setup commands for Claude Code, Codex, Cursor, VS Code, and n8n.',
    topic: 'API Reference',
    order: 3,
    publishedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    readingTime: '9 min read',
    cta: { path: '/nexus', summary: 'Plotune Nexus: the appliance these MCP tools run on.', label: 'See the product page' },
    loader: () => import('../nexusdocs/docs/mcp-api.mdx'),
  },
  {
    slug: 'architecture',
    title: 'System Architecture',
    summary: 'The three-plane model behind Nexus: what runs on the device, what runs in Plotune’s cloud, and the exact boundary between them, including where the design is still hardening.',
    topic: 'Architecture',
    order: 4,
    publishedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    readingTime: '7 min read',
    cta: { path: '/nexus', summary: 'Plotune Nexus: the appliance this architecture describes.', label: 'See the product page' },
    loader: () => import('../nexusdocs/docs/architecture.mdx'),
  },
  {
    slug: 'data-handling',
    title: 'Data Handling & Deployment Model',
    summary: 'Where recorded data lands first, how it leaves the device, the bring-your-own-cloud model, and the checklist for deploying into a closed network with no internet access.',
    topic: 'Deployment',
    order: 5,
    publishedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    readingTime: '6 min read',
    cta: { path: '/solutions/test-orchestration', summary: 'Test Automation & Orchestration: deploying and running bounded jobs across a real test environment.', label: 'See the orchestration workflow' },
    loader: () => import('../nexusdocs/docs/data-handling.mdx'),
  },
  {
    slug: 'protocols',
    title: 'Protocol Notes: CAN, UDS, DoIP, XCP',
    summary: 'Transport-level detail for the four protocols Nexus speaks today: addressing modes, discovery mechanics, and exactly what is production-qualified versus implemented-but-unqualified.',
    topic: 'Protocols',
    order: 6,
    publishedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    readingTime: '8 min read',
    cta: { path: '/solutions/can-ecu-testing', summary: 'CAN / ECU Testing: these protocols applied to a bounded ECU test workflow.', label: 'See the CAN workflow' },
    loader: () => import('../nexusdocs/docs/protocols.mdx'),
  },
  {
    slug: 'quick-start',
    title: 'Quick Start',
    summary: 'From power-on to your first bounded hardware workflow: network setup, owner bootstrap, connecting an MCP client, and three runnable simulator-based examples that need no hardware yet.',
    topic: 'Onboarding',
    order: 7,
    publishedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    readingTime: '6 min read',
    cta: { path: '/nexus', summary: 'Plotune Nexus: the appliance this guide sets up.', label: 'See the product page' },
    loader: () => import('../nexusdocs/docs/quick-start.mdx'),
  },
];

export const nexusDocs = [...docs].sort((a, b) => a.order - b.order);
export const getNexusDoc = (slug) => nexusDocs.find((doc) => doc.slug === slug);
