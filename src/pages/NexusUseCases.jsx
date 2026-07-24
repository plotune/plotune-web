import React, { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import Seo from '../components/Seo';
import { ReactComponent as BusGateSvg } from '../assets/use-case-bus-gate.svg';
import { ReactComponent as DiffSvg } from '../assets/use-case-diff.svg';
import { ReactComponent as TimelineSvg } from '../assets/use-case-timeline.svg';
import { ReactComponent as MeshSvg } from '../assets/use-case-mesh.svg';
import { ReactComponent as DocumentSvg } from '../assets/use-case-document.svg';

const publicBase = process.env.PUBLIC_URL || '';

const syncMessageType = 'plotune-nexus-use-case';

const demoMailto = (label) =>
  `mailto:contact@plotune.net?subject=${encodeURIComponent(`Plotune Nexus demo request — ${label}`)}`;

const industries = [
  {
    id: 'automotive',
    label: 'Automotive & Mobility Validation',
    blurb:
      'Validation teams do not fail because the test did not run — they fail because nobody can prove exactly what happened. Nexus runs the bounded workflow on the bench, captures the trace, waits for the decoded condition, checks the sequence result, and packages everything as one artifact.',
    features: [
      {
        title: 'Release-gate CAN capture',
        copy:
          'Run the bounded release procedure on the bench: capture the trace, wait on the decoded pressure condition, and package the evidence instead of relying on a "looks good" run note.',
        chips: ['Classic CAN', 'DBC decoded wait', 'Artifact'],
        result: {
          run: 'brake-controller-release-gate',
          rows: [
            ['Commanded pressure', '38.2 bar'],
            ['Measured pressure', '37.9 bar'],
            ['Gateway dropouts', '0'],
            ['Decision', 'release evidence ready'],
          ],
        },
      },
      {
        title: 'XCP measurement & calibration',
        copy:
          'Start XCP DAQ, record CAN evidence, read the calibration, run the acceptance sequence, apply a bounded change, and rerun the gate — the chart is earned by the workflow, not described after it.',
        chips: ['XCP-on-CAN', 'Calibration', 'Acceptance rerun'],
        result: {
          run: 'current-limit-calibration',
          rows: [
            ['Base run margin', '+2.4 A'],
            ['Rerun margin', '+8.7 A'],
            ['XCP readback', '428 A'],
            ['Decision', 'calibration note ready'],
          ],
        },
      },
      {
        title: 'DBC-backed signal stimulation',
        copy:
          'Encode a message from your DBC, send it at the required cycle time, and wait on the decoded response signal instead of hand-crafting raw frames for every check.',
        chips: ['DBC', 'Encode / send', 'Decoded wait'],
        result: {
          run: 'torque-request-stimulus',
          rows: [
            ['Sent', 'TorqueReq @ 10 ms'],
            ['Waited on', 'EngTorque decoded'],
            ['Condition', 'met in 240 ms'],
            ['Artifact', 'saved'],
          ],
        },
      },
      {
        title: 'Signal regression vs baseline',
        copy:
          'Replay a validated capture as the baseline and diff a fresh run against it, so new arbitration IDs or timing drift are caught before sign-off.',
        chips: ['Baseline', 'Diff', 'Regression'],
        result: {
          run: 'gateway-regression',
          rows: [
            ['New IDs', '0'],
            ['Timing drift', '+0.1 ms'],
            ['Signals aligned', 'yes'],
            ['Decision', 'no regression'],
          ],
        },
      },
      {
        title: 'Periodic-send endurance',
        copy:
          'Hold a heartbeat or periodic frame over a long window as an async job, watch for dropouts, and release the bus cleanly at the end.',
        chips: ['Periodic send', 'Endurance', 'Async job'],
        result: {
          run: 'heartbeat-endurance',
          rows: [
            ['Frame', 'heartbeat @ 20 ms'],
            ['Window', '30 min'],
            ['Missed frames', '0'],
            ['Bus', 'released clean'],
          ],
        },
      },
      {
        title: 'XCP-on-Ethernet measurement',
        copy:
          'Reach ECUs over IP with XCP-on-Ethernet, auto-detecting host and port from the A2L XCP_ON_ETH block — including Ethernet-only A2Ls that omit CAN TP_BLOB metadata.',
        chips: ['XCP / Ethernet', 'A2L auto-detect', 'UDP'],
        result: {
          run: 'xcp-eth-measure',
          rows: [
            ['Transport', 'XCP-on-Ethernet'],
            ['Host / port', 'from A2L'],
            ['DAQ measurement', 'live'],
            ['Calibration read', 'ok'],
          ],
        },
      },
      {
        title: 'XCP Seed+Key unlock',
        copy:
          'Unlock protected XCP sessions with a getSeed challenge and key response, coordinated statefully across the two calls, before running calibration or measurement.',
        chips: ['Seed+Key', 'getSeed / unlock', 'Stateful'],
        result: {
          run: 'xcp-seed-key',
          rows: [
            ['getSeed', 'challenge received'],
            ['Key response', 'sent'],
            ['Session', 'unlocked'],
            ['Access', 'granted'],
          ],
        },
      },
      {
        title: 'Multi-ECU sign-off sequence',
        copy:
          'Orchestrate a repeatable multi-step sequence across several ECUs and capture the handshake as one artifact another engineer can review.',
        chips: ['Test sequence', 'Multi-ECU', 'Sign-off'],
        result: {
          run: 'multi-ecu-handshake',
          rows: [
            ['ECUs', '4'],
            ['Sequence steps', '12'],
            ['Unexpected frames', '0'],
            ['Decision', 'sign-off ready'],
          ],
        },
      },
    ],
  },
  {
    id: 'robotics',
    label: 'Robotics & Autonomous Systems',
    blurb:
      'When a robot throws a fault, the old workflow is procedure execution: pull the logs, find the frame, apply the documented mitigation, verify it cleared, write the report. Nexus runs the bounded part and returns before-and-after evidence — the engineer still owns the judgment call.',
    features: [
      {
        title: 'Fault triage & mitigation',
        copy:
          'The agent waits for the fault frame, captures the context, runs the approved mitigation sequence, waits for the fault-clear condition, and returns before-and-after evidence.',
        chips: ['Capture', 'Mitigation', 'Fault-clear'],
        result: {
          run: 'dc-bus-overvoltage-triage',
          rows: [
            ['Pre-action voltage', '61.8 V'],
            ['Limit', '58.0 V'],
            ['Post-action voltage', '54.6 V'],
            ['Fault-clear evidence', 'captured'],
          ],
        },
      },
      {
        title: 'UART controller bring-up',
        copy:
          'Open the managed UART session, send the bring-up command, wait for the expected response, store the exchange, and tie it to the run artifact — no terminal screenshot, no pasted transcript.',
        chips: ['UART', 'RS-485', 'Bounded record'],
        result: {
          run: 'uart-bringup-session',
          rows: [
            ['Port', 'ttyUSB0'],
            ['Command', 'boot_check'],
            ['Observed', 'READY in 486 ms'],
            ['Artifact', 'saved'],
          ],
        },
      },
      {
        title: 'Power-rail capture under motion',
        copy:
          'Record the supply rail while the actuator moves, capture the sag window, and keep the trace tied to the exact run that produced it.',
        chips: ['Capture', 'Power rail', 'Evidence'],
        result: {
          run: 'rail-sag-capture',
          rows: [
            ['Nominal rail', '24.0 V'],
            ['Minimum sag', '22.1 V'],
            ['Window', 'captured'],
            ['Artifact', 'tied to run'],
          ],
        },
      },
      {
        title: 'Warm-restart reproduction',
        copy:
          'Trigger the warm restart, record CAN and UART through recovery, and confirm whether the fault recurs — the repro is a controlled procedure, not a manual retry.',
        chips: ['Repro', 'Recovery', 'Artifact'],
        result: {
          run: 'warm-restart-repro',
          rows: [
            ['Restart', 'triggered'],
            ['Recovery time', '1.8 s'],
            ['Fault recurred', 'no'],
            ['Package', 'ready'],
          ],
        },
      },
      {
        title: 'CAN gateway allowlist rules',
        copy:
          'Forward traffic between interfaces under allowlist-style policy so bridging stays inside defined boundaries, and leave proof of exactly what crossed.',
        chips: ['Gateway', 'Allowlist', 'Policy'],
        result: {
          run: 'bus-bridge-policy',
          rows: [
            ['Allowlist rules', '5'],
            ['Blocked frames', '12'],
            ['Allowed frames', 'aligned'],
            ['Boundary', 'held'],
          ],
        },
      },
      {
        title: 'Overnight endurance watch',
        copy:
          'Leave a bounded watch running as an async job so an intermittent fault is captured with context the moment it appears, not the next morning.',
        chips: ['Overnight', 'Async job', 'Evidence'],
      },
    ],
  },
  {
    id: 'ros2-dds',
    label: 'ROS 2 & Autonomous Robotics',
    blurb:
      'Point Plotune Nexus at a ROS 2 / DDS robot and it becomes the test-and-supervision instrument over the wire — with no ROS tooling on the operator side. It joins the robot’s DDS domain through its CycloneDDS backend, reads telemetry, injects bounded commands, records MCAP evidence, and gates requirements on live signals.',
    features: [
      {
        title: 'Cross-host DDS discovery',
        copy:
          'Join the robot’s DDS domain over the bench network and enumerate every participant and topic before touching anything — a readiness gate confirms the middleware, clock, and interfaces are ready first.',
        chips: ['CycloneDDS', 'Cross-host', 'Discovery'],
        result: {
          run: 'dds-topic-discovery',
          rows: [
            ['Topics visible', '332'],
            ['Bridge topics', '/nexus/* pub=1'],
            ['Transport', 'dds_udp'],
            ['Session readiness', 'ready'],
          ],
        },
      },
      {
        title: 'Requirement-verdict gate on live telemetry',
        copy:
          'Gate a requirement on a fresh DDS sample with wait_dds_signal instead of assuming the command worked. The session’s long-lived participant reuses completed discovery, so the gate matches reliably cross-host.',
        chips: ['wait_dds_signal', 'Verdict', 'Cross-host'],
        result: {
          run: 'dds-requirement-verdict-soak',
          rows: [
            ['Runs', '15 / 15 PASS'],
            ['Gate evaluations', '30 / 30 matched'],
            ['Match latency', '0.26 – 0.37 s'],
            ['Flakes', '0'],
          ],
        },
      },
      {
        title: 'Drive-by-wire command + telemetry gate',
        copy:
          'Publish a scalar command onto the ROS 2 graph, then gate on live odometry to prove the effect — command, then measure, not command and hope. A clean zero-command stop is part of the procedure.',
        chips: ['publish_dds_message', 'Odometry gate', 'Effect-proven'],
        result: {
          run: 'dds-omni-drive',
          rows: [
            ['Command', 'Twist x+y+yaw'],
            ['Result pose', '(3.45, 0.57)'],
            ['Heading θ', '2.87 rad'],
            ['Stop-on-zero', 'odom → 3.3e-16'],
          ],
        },
      },
      {
        title: 'Multi-topic DDS recording to one MCAP',
        copy:
          'Record several ROS 2 topics into a single MCAP artifact — each topic its own channel — as a bounded async job, then derive the real rate from message count over the window.',
        chips: ['record_dds_topics', 'MCAP', 'Async job'],
        result: {
          run: 'dds-drive-cycle-record',
          rows: [
            ['Topics', '/scan + /nexus/*'],
            ['Scan rate', '6.47 Hz ∈ [2,10]'],
            ['Messages', '194 / 30 s'],
            ['Artifact', 'MCAP saved'],
          ],
        },
      },
      {
        title: 'Controller-in-the-loop supervision',
        copy:
          'Deploy a reference controller as its own managed container, supervise its closed loop over DDS, and prove Nexus can override it — the instrument, not just an observer of the stack.',
        chips: ['Container', 'Closed loop', 'Override'],
        result: {
          run: 'nexus-safe-cruise',
          rows: [
            ['Controller', 'staged container'],
            ['Loop', 'supervised'],
            ['Override', 'proven'],
            ['Evidence', 'captured'],
          ],
        },
      },
      {
        title: 'AMCL localization bring-up',
        copy:
          'Publish an initial pose estimate onto /initialpose and watch AMCL begin emitting pose and covariance — the localization stack is exercised through the same bounded DDS surface.',
        chips: ['/initialpose', 'AMCL', 'Covariance'],
        result: {
          run: 'amcl-init',
          rows: [
            ['Initialpose', 'published'],
            ['AMCL response', 'pose + covariance'],
            ['Cov trace', '0.41 – 0.55'],
            ['Localization', 'converging'],
          ],
        },
      },
      {
        title: 'Bounded DDS test sequence',
        copy:
          'Wrap join → record → publish → wait → leave as one bounded test sequence with an ordered verdict and an evidence MCAP, so a ROS 2 requirement check is repeatable and reviewable.',
        chips: ['run_test_sequence', 'Verdict', 'Repeatable'],
        result: {
          run: 'dds-scan-min-verdict',
          rows: [
            ['Steps', 'join → record → wait → leave'],
            ['scan_min', '1.748 m'],
            ['Rate check', '6.47 Hz PASS'],
            ['Verdict', 'pass 1/1'],
          ],
        },
      },
    ],
  },
  {
    id: 'ecu-gateway',
    label: 'ECU & Gateway Integration',
    blurb:
      '"Send this CAN frame every 20 ms for five minutes" is not simple on a real bench: acquire the interface, send only the allowed frame, watch the gateway response, stop cleanly, release the interface, leave evidence. Nexus is built around that lifecycle, not just the command.',
    features: [
      {
        title: 'Full CAN interface lifecycle',
        copy:
          'A missing-heartbeat test becomes a controlled procedure: the adapter is attached, the interface is acquired, the heartbeat runs, the gateway reaction is captured, transmission stops, and the interface is released cleanly.',
        chips: ['Acquire → release', 'Periodic send', 'Lifecycle'],
        result: {
          run: 'ecu-heartbeat-check',
          rows: [
            ['Interface', 'can0 acquired'],
            ['Frame', 'heartbeat @ 20 ms'],
            ['Gateway reaction', 'captured'],
            ['Bus state', 'released clean'],
          ],
        },
      },
      {
        title: 'Bus inspection & snapshot',
        copy:
          'Bring up an unfamiliar bus, list the active arbitration IDs, read the load, and snapshot the state before you change anything.',
        chips: ['Inspect', 'Snapshot', 'Bring-up'],
        result: {
          run: 'bus-inspection',
          rows: [
            ['IDs seen', '42'],
            ['Bus load', '38%'],
            ['Errors', '0'],
            ['Snapshot', 'saved'],
          ],
        },
      },
      {
        title: 'Standard MCP control surface',
        copy:
          'Expose common CAN, UART, and XCP tasks as bounded MCP actions — acquire, capture, wait, send only the approved message, stop, package — instead of raw shell or one-off script sprawl.',
        chips: ['MCP', 'Bounded ops', 'No raw shell'],
      },
      {
        title: 'DBC decoded-signal gate',
        copy:
          'Wait on a decoded signal or condition from your DBC to gate the next step of an integration flow, so ordering is enforced by the workflow.',
        chips: ['DBC', 'Decoded wait', 'Condition'],
        result: {
          run: 'signal-gate',
          rows: [
            ['Waited on', 'ChargeReady = 1'],
            ['Timeout', '5 s'],
            ['Met at', '1.2 s'],
            ['Next step', 'released'],
          ],
        },
      },
      {
        title: 'Gateway regression jobs',
        copy:
          'Run allowlist gateway jobs and compare against a clean baseline to catch new IDs or timing drift before they reach the field.',
        chips: ['Gateway', 'Baseline', 'Regression'],
      },
      {
        title: 'Segment forwarding rules',
        copy:
          'Bridge two segments with an explicit forwarding allowlist so only intended traffic crosses between networks, with proof of what was passed and blocked.',
        chips: ['Segmentation', 'Allowlist', 'Policy'],
      },
      {
        title: 'CAN FD bring-up lane',
        copy:
          'Run CAN FD frames through the same send, periodic, wait, snapshot, DBC and gateway flows on Linux SocketCAN. It is implemented and usable for bring-up today, and tracked as qualification-pending rather than a production guarantee.',
        chips: ['CAN FD', 'SocketCAN', 'Qualification-pending'],
        result: {
          run: 'canfd-bringup',
          rows: [
            ['Frame format', 'CAN FD'],
            ['Send / wait / snapshot', 'supported'],
            ['DBC + gateway', 'supported'],
            ['Status', 'qualification-pending'],
          ],
        },
      },
    ],
  },
  {
    id: 'field-diagnostics',
    label: 'Field Diagnostics & Reliability',
    blurb:
      'A DTC tells you where the investigation starts, not why the system failed. Most AI workflows begin too late — after the run, after someone collected the evidence by hand. Nexus starts before the failure and builds service evidence from the actual sequence.',
    features: [
      {
        title: 'Root-cause evidence capture',
        copy:
          'Open the UART session, record CAN, trigger the warm restart, wait for the fault condition, rerun the failing window, and build the service evidence from the real sequence.',
        chips: ['UART + CAN', 'Fault window', 'Evidence'],
        result: {
          run: 'precharge-dtc-root-cause',
          rows: [
            ['PrechargeDeltaV', '47.6 V'],
            ['Limit', '25.0 V'],
            ['DTC', 'P0D67:28'],
            ['Fault window', '22.184 – 22.432 s'],
          ],
        },
      },
      {
        title: 'Unattended overnight capture',
        copy:
          'A fault at 2am no longer waits for morning. The agent is already watching: it catches the condition, starts the bounded capture, runs the approved check, and leaves the package ready for review.',
        chips: ['Always watching', 'Bounded', 'Overnight'],
        result: {
          run: 'night-fault-watch',
          rows: [
            ['Trigger', '02:14 condition matched'],
            ['Capture', 'bounded, started'],
            ['Fault-clear check', 'run'],
            ['Package', 'ready by morning'],
          ],
        },
      },
      {
        title: 'Intermittent-fault window capture',
        copy:
          'Define the threshold once. When a signal crosses it, the bounded capture starts immediately and records the surrounding window so the rare event is never missed.',
        chips: ['Threshold', 'Fault window', 'Capture'],
        result: {
          run: 'intermittent-window',
          rows: [
            ['Threshold', 'crossed'],
            ['Pre-trigger', 'retained'],
            ['Window', 'captured'],
            ['Notify', 'sent'],
          ],
        },
      },
      {
        title: 'Delegated field access',
        copy:
          'The on-site operator runs the vehicle; a remote expert reviews the same evidence. Ownership is bootstrapped, access is delegated, and the handoff stays scoped.',
        chips: ['Delegated', 'Operator UI', 'Scoped'],
        result: {
          run: 'delegated-access',
          rows: [
            ['Owner', 'set'],
            ['Delegate', 'operator'],
            ['Access', 'scoped'],
            ['Handoff', 'clean'],
          ],
        },
      },
      {
        title: 'Clean export to your storage',
        copy:
          'Keep the run local first, then move artifacts to storage you already control — SFTP, Google Drive, or OneDrive — instead of a vendor-owned archive.',
        chips: ['Export', 'Customer storage', 'Local-first'],
        result: {
          run: 'artifact-export',
          rows: [
            ['Destination', 'SFTP'],
            ['Artifact size', '82 MB'],
            ['Transfer', 'ok'],
            ['Local copy', 'retained'],
          ],
        },
      },
      {
        title: 'Raw UDS request / response',
        copy:
          'Issue raw UDS services over CAN or DoIP and get structured negative-response handling back — including NRC 0x78 request-received-response-pending extended waits — as a low-level, bounded diagnostic surface. Curated VIN/DTC flows sit above this as a follow-up layer.',
        chips: ['UDS', 'CAN / DoIP', 'NRC-aware'],
        result: {
          run: 'uds-raw-request',
          rows: [
            ['Service', '0x22 read-by-id'],
            ['Negative response', '0x78 handled'],
            ['Extended wait', 'honored'],
            ['Positive response', 'captured'],
          ],
        },
      },
      {
        title: 'DoIP ECU discovery',
        copy:
          'Probe for DoIP entities across IPv4 and IPv6 with VIN-targeted or EID-targeted identification requests, and keep reused batch sockets alive with Alive Check before running a diagnostic exchange.',
        chips: ['DoIP', 'IPv4 / IPv6', 'VIN / EID'],
        result: {
          run: 'doip-discovery',
          rows: [
            ['Probe', 'dual-stack'],
            ['Match', 'VIN-targeted'],
            ['Alive Check', 'ok'],
            ['Entity', 'identified'],
          ],
        },
      },
      {
        title: 'Reproducible triage sequence',
        copy:
          'Capture the recurring triage steps once and re-run them the same way across sites and vehicles, so field turnaround does not depend on a specialist being available.',
        chips: ['Sequence', 'Repeatable', 'Consistent'],
      },
    ],
  },
  {
    id: 'hil-automation',
    label: 'HIL & Test Automation',
    blurb:
      'Every HIL team has the mystery machine: the laptop in the corner, the VM nobody updates, the sim that only runs on one person’s setup. If your answer to "where does the sim run?" is a person’s name, that is your bottleneck. Nexus runs the environment and leaves proof of what crossed the boundary.',
    features: [
      {
        title: 'Containerized sim on virtual CAN',
        copy:
          'The controller or simulator runs as a staged container on the device, connected to a virtual CAN bus, with a policy gateway between virtual and real CAN so only approved frames cross.',
        chips: ['Container', 'Virtual CAN', 'Policy gateway'],
        result: {
          run: 'hil-sim-boundary',
          rows: [
            ['Controller', 'staged container'],
            ['Bus', 'virtual CAN'],
            ['Gateway', 'approved frames only'],
            ['Boundary proof', 'captured'],
          ],
        },
      },
      {
        title: 'Async recording jobs',
        copy:
          'Start long recordings that return a job ID and poll for status, so unattended runs do not block the workflow or a person standing next to the bench.',
        chips: ['Async job', 'Job ID', 'Poll'],
        result: {
          run: 'recording-job',
          rows: [
            ['Job ID', 'rec-7f3a'],
            ['Duration', '45 min'],
            ['Status', 'polled → done'],
            ['Artifact', 'ready'],
          ],
        },
      },
      {
        title: 'Fault-injection verification',
        copy:
          'Inject a bounded fault, watch the diagnostic react, confirm graceful degradation, and keep the before-and-after as evidence the safety mechanism worked.',
        chips: ['Fault injection', 'Verify', 'Evidence'],
        result: {
          run: 'fault-injection',
          rows: [
            ['Injected', 'CAN_TIMEOUT'],
            ['Diagnostic', 'reacted'],
            ['Degradation', 'graceful'],
            ['Evidence', 'captured'],
          ],
        },
      },
      {
        title: 'Test-sequence orchestration',
        copy:
          'Drive repeatable multi-step runs across CAN, UART, DBC, and XCP as a single orchestrated sequence, then export the results to your data path.',
        chips: ['Sequence', 'Multi-step', 'Export'],
      },
      {
        title: 'Regression across releases',
        copy:
          'Re-run the validated sequence against a new firmware build and diff it against the prior release to protect behavior that already passed.',
        chips: ['Regression', 'Baseline', 'Repeatable'],
      },
      {
        title: 'XCP STIM bypass injection',
        copy:
          'Inject signals directly into ECU measurement memory over XCP for hardware-in-the-loop bypass testing — periodic writes that preserve integer and bitmask values according to the A2L measurement type.',
        chips: ['XCP STIM', 'HIL bypass', 'A2L-typed'],
        result: {
          run: 'xcp-stim-bypass',
          rows: [
            ['Target', 'measurement address'],
            ['Write', 'periodic'],
            ['Value type', 'int / bitmask preserved'],
            ['Bypass', 'active'],
          ],
        },
      },
      {
        title: 'Night validation runs',
        copy:
          'Set up the routines before you leave; they run overnight as async jobs and the packaged results are waiting when you arrive.',
        chips: ['Overnight', 'Async job', 'Report'],
      },
    ],
  },
  {
    id: 'ai-assisted',
    label: 'AI-Assisted Engineering Teams',
    blurb:
      'The first thing a validation lead cares about is not the protocol — it is "can the agent safely do the work my engineer does by hand?" Nexus is the control surface for that: action control and data control are the same conversation once AI starts touching hardware.',
    features: [
      {
        title: 'Bounded operations, not raw access',
        copy:
          'Agents act through a narrow set of bounded operations — acquire, capture, wait, send only approved frames, stop, package — rather than direct, unrestricted hardware tools, which makes AI-assisted work operationally approvable.',
        chips: ['Guardrails', 'Bounded', 'Approvable'],
        result: {
          run: 'control-boundary',
          rows: [
            ['Tools', 'bounded set'],
            ['Raw shell', 'none'],
            ['Approval', 'operational'],
            ['Audit', 'per run'],
          ],
        },
      },
      {
        title: 'Local artifact first',
        copy:
          'The run produces local artifacts first. Inspect bounded reads, export through a controlled transfer flow, or hand off to storage you already control — raw bench data does not default to a vendor cloud.',
        chips: ['Local-first', 'Customer path', 'Data control'],
        result: {
          run: 'local-artifact-flow',
          rows: [
            ['Artifact', 'created locally'],
            ['Access', 'bounded reads'],
            ['Export', 'configured path'],
            ['Vendor cloud', 'not by default'],
          ],
        },
      },
      {
        title: 'MCP + OAuth onboarding',
        copy:
          'Stand up the MCP surface with the OAuth browser flow, dynamic client registration, and delegated device access so AI-assisted work stays inside policy from day one.',
        chips: ['MCP', 'OAuth', 'Delegated'],
        result: {
          run: 'mcp-onboarding',
          rows: [
            ['Endpoint', '/mcp up'],
            ['Auth', 'OAuth flow'],
            ['Client', 'registered'],
            ['Access', 'delegated'],
          ],
        },
      },
      {
        title: 'Evidence another engineer can trust',
        copy:
          'The value is the chain behind the answer: live DAQ, CAN trace, calibration readback, sequence result, and a packaged artifact — not "the AI thinks it passed."',
        chips: ['Artifact', 'Reviewable', 'Chain'],
      },
      {
        title: 'Workflow-first, not protocol-first',
        copy:
          'Start with the real bench workflow your engineer runs by hand and let the agent run the bounded procedure and hand back the proof — the infrastructure follows the workflow.',
        chips: ['Workflow', 'Bounded', 'Proof'],
      },
      {
        title: 'Start with one real workflow',
        copy:
          'Prove one bounded workflow on real hardware before scaling, instead of a full platform migration.',
        chips: ['One workflow', 'Real hardware', 'Prove it'],
      },
    ],
  },
];

const familyOrder = ['claude', 'codex'];

const families = {
  claude: {
    id: 'claude',
    label: 'Claude',
    shell: '~ : claude',
    railLabel: 'Operational cases',
    runtimeLabel: 'Operational flow',
    src: `${publicBase}/use-cases/claude/index.html`,
    scenarios: [
      {
        id: 'hil-firmware-gate',
        label: 'HIL firmware gate',
        status: 'Gate passed',
        chips: ['0.09 m', '52 ms', '0 unexpected'],
        Svg: BusGateSvg,
      },
      {
        id: 'gateway-regression',
        label: 'Gateway regression',
        status: 'Baseline clean',
        chips: ['+0.1 ms', '0 new IDs', 'aligned'],
        Svg: DiffSvg,
      },
      {
        id: 'bms-field-triage',
        label: 'BMS field triage',
        status: 'Root cause found',
        chips: ['820 ms', '2.4 A', 'P1C44:28'],
        Svg: TimelineSvg,
      },
      {
        id: 'multi-ecu-handshake',
        label: 'Multi-ECU handshake',
        status: 'Sign-off ready',
        chips: ['4 ECUs', '12 UDS', '0 DTC'],
        Svg: MeshSvg,
      },
    ],
  },
  codex: {
    id: 'codex',
    label: 'Codex',
    shell: 'OpenAI Codex',
    railLabel: 'Follow-up cases',
    runtimeLabel: 'Follow-up flow',
    src: `${publicBase}/use-cases/codex/index.html`,
    scenarios: [
      {
        id: 'brake-ecu',
        label: 'Brake ECU',
        status: 'Checklist built',
        chips: ['gap closed', '3 + 2 rules', 'PDF ready'],
        Svg: DocumentSvg,
      },
      {
        id: 'inverter',
        label: 'Inverter',
        status: 'Margin restored',
        chips: ['438 → 428 A', '2.4 → 8.7 A', 'note ready'],
        Svg: DiffSvg,
      },
      {
        id: 'charger',
        label: 'Charger',
        status: 'Report published',
        chips: ['22.184–22.432 s', '47.6 V', 'fault window'],
        Svg: TimelineSvg,
      },
      {
        id: 'endurance',
        label: 'Endurance',
        status: 'Addendum published',
        chips: ['+4.6 pp', '+0.8 C', 'watch item'],
        Svg: MeshSvg,
      },
    ],
  },
};

const motionCss = `
  .use-case-row {
    animation: useCaseRowPulse 5.4s ease-in-out infinite;
  }

  .use-case-status {
    animation: useCaseStatusPulse 3s ease-in-out infinite;
  }

  @keyframes useCaseRowPulse {
    0%, 100% { background-color: rgba(255, 255, 255, 0); }
    14% { background-color: rgba(38, 166, 154, 0.08); }
    26% { background-color: rgba(38, 166, 154, 0.16); }
    42% { background-color: rgba(255, 255, 255, 0.03); }
  }

  @keyframes useCaseStatusPulse {
    0%, 100% { opacity: 0.76; box-shadow: 0 0 0 0 rgba(38, 166, 154, 0); }
    34% { opacity: 1; box-shadow: 0 0 0 10px rgba(38, 166, 154, 0); }
    14% { opacity: 1; box-shadow: 0 0 0 0 rgba(38, 166, 154, 0.3); }
  }

  @media (prefers-reduced-motion: reduce) {
    .use-case-row,
    .use-case-status {
      animation: none !important;
    }
  }
`;

const CaseChip = ({ value }) => (
  <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-text">
    {value}
  </span>
);

const IndustryTab = ({ industry, isActive, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:text-sm ${
      isActive
        ? 'bg-primary text-white shadow-custom'
        : 'bg-white/[0.04] text-gray-text hover:bg-white/[0.08] hover:text-light-text'
    }`}
    aria-pressed={isActive}
  >
    {industry.label}
  </button>
);

const ResultBlock = ({ result }) => (
  <div className="mt-5 overflow-hidden rounded-[1.25rem] bg-dark-surface/80 p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{result.run}</span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-gray-text">Example run</span>
    </div>
    <dl className="mt-3 space-y-2">
      {result.rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-4 text-sm">
          <dt className="text-gray-text">{label}</dt>
          <dd className="font-mono text-light-text">{value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

const FeatureAccordionItem = ({ feature, isOpen, onToggle }) => (
  <div className="overflow-hidden rounded-[1.5rem] bg-dark-card/80 shadow-custom">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-white/[0.03] md:px-6 md:py-5"
    >
      <h3 className="text-base font-semibold text-light-text md:text-lg">{feature.title}</h3>
      <FiChevronDown
        className={`shrink-0 text-xl text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    {isOpen && (
      <div className="px-5 pb-6 md:px-6">
        <p className="text-sm leading-7 text-gray-text">{feature.copy}</p>
        {feature.result && <ResultBlock result={feature.result} />}
        <div className="mt-5 flex flex-wrap gap-2">
          {feature.chips.map((chip) => (
            <CaseChip key={chip} value={chip} />
          ))}
        </div>
      </div>
    )}
  </div>
);

const FamilyTab = ({ family, isActive, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`rounded-[1.35rem] px-5 py-4 text-left transition-all duration-300 ${
      isActive ? 'bg-dark-surface text-light-text shadow-custom' : 'bg-transparent text-gray-text hover:bg-white/[0.04] hover:text-light-text'
    }`}
    aria-pressed={isActive}
  >
    <p className="font-mono text-xs uppercase tracking-[0.22em] text-gray-text">{family.shell}</p>
    <h2 className="mt-3 text-2xl font-semibold">{family.label}</h2>
    <p className="mt-2 text-sm text-gray-text">{family.railLabel}</p>
  </button>
);

const HeroProof = ({ family, scenario, cycle }) => {
  const Svg = scenario.Svg;

  return (
    <div className="rounded-[2rem] bg-dark-card/80 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-gray-text">{family.shell}</p>
          <h2 className="mt-3 text-2xl font-semibold text-light-text">{scenario.label}</h2>
        </div>
        <span className="use-case-status rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          {scenario.status}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-[#0f1114]">
        <Svg key={`${scenario.id}-hero-${cycle}`} className="h-auto w-full" />
      </div>
    </div>
  );
};

const ArtifactCard = ({ scenario, isActive, cycle, onSelect }) => {
  const Svg = scenario.Svg;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group rounded-[2rem] p-4 text-left shadow-custom transition-all duration-300 ${
        isActive ? 'bg-dark-card' : 'bg-dark-card/80'
      }`}
      aria-pressed={isActive}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-light-text">{scenario.label}</h3>
        </div>
        <span className="use-case-status shrink-0 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          {scenario.status}
        </span>
      </div>

      <div className="mt-4 min-h-[10rem] overflow-hidden rounded-[1.5rem] bg-dark-surface/80">
        <Svg key={`${scenario.id}-${isActive ? cycle : 'idle'}`} className="h-auto w-full" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {scenario.chips.map((chip) => (
          <CaseChip key={chip} value={chip} />
        ))}
      </div>
    </button>
  );
};

const ResultMatrix = ({ scenarios }) => (
  <div className="rounded-[2rem] bg-dark-card/80 p-4 shadow-custom">
    <div className="overflow-hidden rounded-[1.5rem] bg-dark-surface/75">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.22em] text-gray-text">
            <th className="px-4 py-4 font-semibold">Scenario</th>
            <th className="px-4 py-4 font-semibold">Output</th>
            <th className="px-4 py-4 font-semibold">State</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario, index) => (
            <tr
              key={scenario.id}
              className="use-case-row text-light-text"
              style={{ animationDelay: `${index * 0.42}s` }}
            >
              <td className="px-4 py-4 font-semibold">{scenario.label}</td>
              <td className="px-4 py-4 text-gray-text">{scenario.chips[0]}</td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {scenario.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const NexusUseCases = () => {
  const [activeIndustry, setActiveIndustry] = useState(industries[0].id);
  const [openFeatures, setOpenFeatures] = useState({});
  const [activeFamily, setActiveFamily] = useState('claude');

  const toggleFeature = (key) =>
    setOpenFeatures((current) => ({ ...current, [key]: !current[key] }));
  const [activeScenarioByFamily, setActiveScenarioByFamily] = useState({ claude: 0, codex: 0 });
  const [frameSeed, setFrameSeed] = useState(0);
  const [artifactCycle, setArtifactCycle] = useState(0);

  const activeIndustryConfig =
    industries.find((industry) => industry.id === activeIndustry) || industries[0];
  const activeFamilyConfig = families[activeFamily];
  const activeScenario = activeScenarioByFamily[activeFamily];
  const activeScenarioConfig = activeFamilyConfig.scenarios[activeScenario];

  const frameSrc = useMemo(() => {
    const params = new URLSearchParams({
      scenario: String(activeScenario),
      run: String(frameSeed),
    });

    return `${activeFamilyConfig.src}?${params.toString()}`;
  }, [activeFamilyConfig.src, activeScenario, frameSeed]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      const data = event.data;
      if (!data || data.type !== syncMessageType || !families[data.family]) return;

      if (typeof data.scenario === 'number') {
        setActiveScenarioByFamily((current) => (
          current[data.family] === data.scenario
            ? current
            : { ...current, [data.family]: data.scenario }
        ));
      }

      if (data.family !== activeFamily) setActiveFamily(data.family);
      if (data.action === 'select' || data.action === 'replay' || data.action === 'load') {
        setArtifactCycle((value) => value + 1);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeFamily]);

  const selectFamily = (family) => {
    setActiveFamily(family);
    setFrameSeed((value) => value + 1);
    setArtifactCycle((value) => value + 1);
  };

  const selectScenario = (index) => {
    setActiveScenarioByFamily((current) => ({ ...current, [activeFamily]: index }));
    setFrameSeed((value) => value + 1);
    setArtifactCycle((value) => value + 1);
  };

  return (
    <main className="overflow-hidden bg-dark-bg text-dark-text">
      <Seo
        title="Plotune Nexus Use Cases: Automotive, Robotics & ROS 2"
        description="See how Plotune Nexus runs bounded, AI-ready workflows across automotive validation, robotics, ROS 2 / DDS supervision, ECU and gateway integration, field diagnostics, and HIL automation."
        path="/nexus/use-cases"
      />
      <style>{motionCss}</style>

      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(38,166,154,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(63,81,181,0.14),transparent_28%),linear-gradient(180deg,#101112_0%,#121212_58%,#151719_100%)]" />
        <div className="relative container mx-auto px-5">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Plotune Nexus</p>
              <h1 className="mt-5 text-5xl font-semibold text-light-text md:text-7xl">
                Use Cases
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-text">
                Switch between Claude and Codex, follow the full runtime on Plotune Nexus, and read the artifacts that come out of each case. Then jump to the scenarios built for your industry.
              </p>
              <div className="mt-8">
                <a
                  href={demoMailto('Plotune Nexus')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
                >
                  Request a Demo
                  <FiArrowRight />
                </a>
              </div>
            </div>

            <HeroProof
              family={activeFamilyConfig}
              scenario={activeScenarioConfig}
              cycle={artifactCycle}
            />
          </div>

          <div className="mt-10 grid gap-2 rounded-[1.75rem] bg-dark-card/80 p-2 shadow-custom md:grid-cols-2">
            {familyOrder.map((familyKey) => (
              <FamilyTab
                key={familyKey}
                family={families[familyKey]}
                isActive={activeFamily === familyKey}
                onSelect={() => selectFamily(familyKey)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-5">
          <div className="rounded-[2rem] bg-dark-card/80 p-3 shadow-2xl backdrop-blur-xl md:p-4">
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-gray-text">{activeFamilyConfig.shell}</p>
              <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-text">
                {activeFamilyConfig.runtimeLabel}
              </span>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] bg-[#090a0c]">
              <iframe
                key={`${activeFamily}-${frameSeed}`}
                src={frameSrc}
                title={`${activeFamilyConfig.label} use cases`}
                className="h-[33rem] w-full border-0 bg-[#090a0c] md:h-[40rem] xl:h-[46rem]"
                loading="eager"
              />
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Artifacts</p>
              <h2 className="mt-4 text-3xl font-semibold text-light-text md:text-4xl">
                Outputs from the active flow
              </h2>
            </div>
            <p className="hidden text-sm text-gray-text md:block">{activeFamilyConfig.railLabel}</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {activeFamilyConfig.scenarios.map((scenario, index) => (
              <ArtifactCard
                key={scenario.id}
                scenario={scenario}
                isActive={activeScenario === index}
                cycle={artifactCycle}
                onSelect={() => selectScenario(index)}
              />
            ))}
          </div>

          <div className="mt-6">
            <ResultMatrix scenarios={activeFamilyConfig.scenarios} />
          </div>

          <div className="mt-24">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Scenarios by industry</p>
            <h2 className="mt-4 text-3xl font-semibold text-light-text md:text-4xl">
              See how Plotune Nexus works in your world
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-text">
              Select your industry to see the bounded workflows Plotune Nexus runs on real hardware — and the evidence each one leaves behind.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {industries.map((industry) => (
                <IndustryTab
                  key={industry.id}
                  industry={industry}
                  isActive={activeIndustry === industry.id}
                  onSelect={() => setActiveIndustry(industry.id)}
                />
              ))}
            </div>

            <div className="mt-8 rounded-[2rem] bg-dark-card/60 p-6 shadow-custom md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-semibold text-light-text">{activeIndustryConfig.label}</h3>
                  <p className="mt-3 leading-7 text-gray-text">{activeIndustryConfig.blurb}</p>
                </div>
                <a
                  href={demoMailto(activeIndustryConfig.label)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
                >
                  Request a Demo
                  <FiArrowRight />
                </a>
              </div>

              <div className="mt-8 space-y-3">
                {activeIndustryConfig.features.map((feature) => {
                  const key = `${activeIndustryConfig.id}:${feature.title}`;
                  return (
                    <FeatureAccordionItem
                      key={key}
                      feature={feature}
                      isOpen={Boolean(openFeatures[key])}
                      onToggle={() => toggleFeature(key)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(63,81,181,0.08))] p-8 shadow-custom md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-light-text">Map this to your own bench.</h3>
                <p className="mt-2 text-gray-text">Plotune Nexus can mirror the same flow shape against your own validation cases. Start with one real workflow.</p>
              </div>
              <a
                href={demoMailto('Plotune Nexus')}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
              >
                Request a Demo
                <FiArrowRight />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NexusUseCases;
