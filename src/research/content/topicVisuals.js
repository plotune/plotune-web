import React from 'react';

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ValidationIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const CircuitIcon = () => (
  <svg {...iconProps}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M9 3v4M15 3v4M9 21v-4M15 21v-4M3 9h4M3 15h4M21 9h-4M21 15h-4" />
  </svg>
);

const NodeGraphIcon = () => (
  <svg {...iconProps}>
    <circle cx="6" cy="18" r="2.4" />
    <circle cx="18" cy="18" r="2.4" />
    <circle cx="12" cy="6" r="2.4" />
    <path d="M12 8.4v5M9.8 16.6L10.6 13M14.2 16.6L13.4 13M8.4 18h7.2" />
  </svg>
);

const PipelineIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="6" height="4" rx="1" />
    <rect x="15" y="5" width="6" height="4" rx="1" />
    <rect x="9" y="15" width="6" height="4" rx="1" />
    <path d="M6 9v3a2 2 0 002 2h1M18 9v3a2 2 0 01-2 2h-1" />
  </svg>
);

const SparkIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" />
  </svg>
);

const PlugIcon = () => (
  <svg {...iconProps}>
    <path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 01-5 5 5 5 0 01-5-5z" />
    <path d="M12 16v3M9 21h6" />
  </svg>
);

const TerminalIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 10l3 2.5L7 15M12 15h5" />
  </svg>
);

// Cool-hue family only (blue/teal/indigo/violet/cyan/slate) so a new topic's
// generated thumbnail never collides with the amber "preview" banner or the
// red error/destructive-action colors used elsewhere on the site.
const TOPIC_VISUALS = {
  'Agentic Test & Validation': { from: '#2563d9', to: '#60a5fa', Icon: ValidationIcon },
  'CAN / ECU Testing': { from: '#0f766e', to: '#2dd4bf', Icon: CircuitIcon },
  'ROS 2 / DDS Testing': { from: '#4338ca', to: '#818cf8', Icon: NodeGraphIcon },
  'Test Automation & Orchestration': { from: '#334155', to: '#64748b', Icon: PipelineIcon },
  'Agentic Test & Development': { from: '#7c3aed', to: '#a78bfa', Icon: SparkIcon },
  'AI Hardware-in-the-Loop Testing': { from: '#0891b2', to: '#22d3ee', Icon: PlugIcon },
  'MCP for Hardware Testing': { from: '#1e40af', to: '#3b82f6', Icon: TerminalIcon },
};

const DEFAULT_VISUAL = { from: '#475569', to: '#94a3b8', Icon: SparkIcon };

export const getTopicVisual = (topic) => TOPIC_VISUALS[topic] || DEFAULT_VISUAL;
