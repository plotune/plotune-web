// Content for the /agentic-test-development pillar page — a broader, category-level page that
// two research articles ("What is agentic test & development" and "AI agents vs traditional
// test automation") both link into, sitting above the segment-specific /solutions/* pages and
// linking out to all of them. Not itself tied to one product segment.
export const agenticTestDevelopmentPillar = {
  path: '/agentic-test-development',
  label: 'Agentic Test & Development',
  heroTitle: 'What is agentic test & development?',
  intro: "Traditional test automation runs a fixed script: the same steps, in the same order, against the same fixture, every time. Agentic test & development is a different approach — an AI agent reads the current state of a real system and takes the next bounded, pre-approved action, rather than following a script that breaks the moment reality doesn't match it exactly.",
  traditional: [
    'A fixed script runs the same steps in the same order, every time',
    'A test written for one fixture revision breaks silently when the fixture changes',
    'An unexpected state — a fault, a retry, a slow response — usually just fails the run',
    'Adding a new check means writing new script from scratch',
  ],
  agentic: [
    'An agent reads the current state and decides the next bounded, approved action',
    'The same acquire → act → gate → release shape adapts to what the interface actually reports',
    'An unexpected state is something the agent can reason about within its bounds, not just fail on',
    'Extending coverage means pointing the same bounded operations at a new workflow',
  ],
  segmentSlugs: ['can-ecu-testing', 'ros2-dds-testing', 'test-orchestration', 'hil-testing'],
};
