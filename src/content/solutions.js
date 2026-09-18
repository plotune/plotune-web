// Segment solution pages linked from article CTAs (/research/articles/:slug -> /solutions/:segment).
// Facts and example-run numbers below are reused from the vetted content already published on
// /nexus/use-cases (per-industry breakdown), not invented for this page.
// Legacy slugs that now redirect to their renamed key, preserving query string / funnel params.
export const solutionSegmentAliases = {
  'can-testing': 'can-ecu-testing',
};

export const solutionSegments = {
  'can-ecu-testing': {
    slug: 'can-ecu-testing',
    label: 'CAN / ECU Testing',
    heroTitle: 'Automate CAN-based ECU testing without losing the engineer in the loop',
    problem: 'A CAN or ECU test procedure is never just "send a frame." It is acquire the interface, send only the approved message, watch the gateway or ECU response, capture evidence, and release the bus cleanly. Every one of those steps is usually done by hand, on a laptop, by whoever is free that day.',
    currentWorkflow: [
      'Attach the adapter and bring the bus up manually before every run',
      'Hand-craft or replay raw frames from a DBC, one test at a time',
      'Watch signals in a scope tool and decide pass/fail by eye',
      'Write up what happened afterward, from memory or screenshots',
    ],
    nexusWorkflow: [
      'Acquire the CAN interface as a bounded operation, released when the run ends',
      'Encode and send only the approved message from your DBC, at the required cycle time',
      'Gate the next step on a decoded signal condition instead of a fixed wait',
      'Package the run as one reviewable artifact: trace, decoded signals, and verdict together',
    ],
    integrations: ['Classic CAN', 'CAN FD (SocketCAN)', 'DBC decode / encode', 'XCP-on-CAN', 'UDS over CAN / DoIP'],
    exampleScenario: {
      title: 'Release-gate CAN capture',
      rows: [
        ['Commanded pressure', '38.2 bar'],
        ['Measured pressure', '37.9 bar'],
        ['Gateway dropouts', '0'],
        ['Decision', 'release evidence ready'],
      ],
    },
  },
  'ros2-dds-testing': {
    slug: 'ros2-dds-testing',
    label: 'ROS 2 / DDS Testing',
    heroTitle: 'Run unattended ROS 2 hardware tests without ROS tooling on your side',
    problem: 'Testing a ROS 2 robot usually means SSHing into the robot, running ros2 CLI commands by hand, and eyeballing topic echoes to decide whether a requirement passed, a process that does not scale past the one person who knows the stack.',
    currentWorkflow: [
      'SSH into the robot and run ros2 topic echo / ros2 service call by hand',
      'Eyeball telemetry in a terminal to judge whether a requirement passed',
      'Re-run the same manual steps for every regression check',
      'No artifact: the "evidence" is whoever happened to be watching the terminal',
    ],
    nexusWorkflow: [
      "Join the robot's DDS domain over the network, no ROS tooling needed on your side",
      'Publish a bounded command and gate the next step on live telemetry, not a fixed wait',
      'Record multiple topics into a single MCAP artifact as an unattended, bounded job',
      'Wrap join → command → gate → record into one repeatable sequence with a pass/fail verdict',
    ],
    integrations: ['CycloneDDS', 'Cross-host discovery', 'MCAP recording', 'wait_dds_signal gating', 'Containerized controller supervision'],
    exampleScenario: {
      title: 'Requirement-verdict gate on live telemetry',
      rows: [
        ['Runs', '15 / 15 PASS'],
        ['Gate evaluations', '30 / 30 matched'],
        ['Match latency', '0.26 – 0.37 s'],
        ['Flakes', '0'],
      ],
    },
  },
  'test-orchestration': {
    slug: 'test-orchestration',
    label: 'Test Automation & Orchestration',
    heroTitle: 'Why test automation still requires an engineer in the loop',
    problem: 'Most test automation stops at "run the script." The real bottleneck is upstream: someone still decides which sequence to run, watches it for faults, and re-runs it by hand when a build changes. Automation that still needs a person standing next to it is a faster way to wait, not less waiting.',
    currentWorkflow: [
      'A person kicks off each test sequence and stays to watch it run',
      'Faults are triaged live, in the moment, by whoever is on the bench',
      'Regression checks are re-run by hand against every new build',
      'Overnight or long-running coverage simply does not happen',
    ],
    nexusWorkflow: [
      'Orchestrate multi-step sequences across CAN, UART, DBC, XCP, and DDS as one bounded run',
      'Leave a bounded fault watch running as an async job, so a 2am fault is captured, not missed',
      'Diff a fresh run against a validated baseline to catch regressions automatically',
      "Every sequence ends with a packaged, reviewable artifact, not a person's notes",
    ],
    integrations: ['Test sequences', 'Async jobs', 'Baseline regression diff', 'Multi-protocol orchestration (CAN / UART / XCP / DDS)'],
    exampleScenario: {
      title: 'Bounded DDS test sequence',
      rows: [
        ['Steps', 'join → record → wait → leave'],
        ['scan_min', '1.748 m'],
        ['Rate check', '6.47 Hz PASS'],
        ['Verdict', 'pass 1/1'],
      ],
    },
  },
  'hil-testing': {
    slug: 'hil-testing',
    label: 'AI Hardware-in-the-Loop Testing',
    heroTitle: 'Give AI agents access to real hardware without giving up control of the boundary',
    problem: "Giving an AI agent access to real hardware raises a different question than giving it access to a shell: what happens when it's wrong? Most HIL setups solve this by keeping AI out entirely. The simulator, the virtual bus, and the real bench stay in a person's hands, because there's no bounded way to let an agent touch any of it safely.",
    currentWorkflow: [
      "Run the simulator and controller on whichever engineer's machine last set it up",
      'Bridge virtual and real hardware by hand, with no enforced boundary on what crosses',
      'Give an AI agent either full shell access or no access at all, with no middle ground',
      'Trust a "looks right" run instead of a boundary you can point to and prove',
    ],
    nexusWorkflow: [
      "Run the controller or simulator as a staged container, not a laptop only one person can restart",
      'Bridge virtual and real CAN through a policy gateway that lets only approved frames cross',
      'Give the agent a bounded operation set (acquire, capture, wait, send only approved frames, stop, package), not raw shell access',
      'Connect over MCP with OAuth and delegated access, so what the agent can touch is a policy decision, not a trust exercise',
    ],
    integrations: ['Containerized simulation', 'Virtual CAN + policy gateway', 'MCP + OAuth', 'Bounded operation set'],
    exampleScenario: {
      title: 'Containerized sim on virtual CAN',
      rows: [
        ['Controller', 'staged container'],
        ['Bus', 'virtual CAN'],
        ['Gateway', 'approved frames only'],
        ['Boundary proof', 'captured'],
      ],
    },
  },
};

export const getSolutionSegment = (slug) => solutionSegments[slug];
