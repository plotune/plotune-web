# Questions about Plotune and Nexus.

Plotune / Frequently asked questions  16 answers



How teams use Plotune Nexus to run bounded, AI-ready workflows on real test hardware, keep their data local, and orchestrate data operations with the Plotune platform.

## About Plotune

A DataOps platform gives teams one repeatable, auditable way to move, process, and govern data across their tools, instead of stitching together one-off scripts. Plotune is a DataOps platform (Core, Stream, and Cloud) for orchestrating, processing, and governing data, and it extends the same controlled, AI-ready approach to real test hardware through its Plotune Nexus appliance.

A local-first acquisition appliance captures and stores data next to the hardware by default, rather than streaming it into a vendor cloud first. Plotune Nexus is a managed local-first appliance on Plotune-defined hardware: captures and artifacts stay on the device, and the team chooses where outputs go, whether local files, SFTP, Google Drive, or OneDrive and SharePoint.

## AI-assisted work on real hardware

The safest pattern is to put a bounded execution layer between the AI and the hardware instead of giving the agent shell or raw-tool access. Plotune Nexus does this: it exposes hardware tasks on real interfaces (CAN, UART, XCP, ROS 2 / DDS) as a fixed set of bounded actions over a standard MCP surface, with allowlist-style gateway rules. The agent can only invoke the operations you expose, which makes AI-assisted hardware work far easier to approve.

MCP (Model Context Protocol) is a standard way for AI agents to call defined tools. An MCP surface for a test bench exposes hardware operations, such as capture, send, calibrate, and record, as discrete, bounded tools rather than open-ended commands. Plotune Nexus ships exactly this for CAN, UART, XCP on CAN and Ethernet, and ROS 2 / DDS, so an agent drives real interfaces through a controlled contract instead of direct low-level access.

Put a narrow, bounded control layer in front of the hardware. Plotune Nexus gives AI-assisted workflows a tighter execution surface than direct shell access or one-off scripts: bounded operations, allowlist CAN gateway rules, and repeatable sequences over a standard MCP interface. Teams get automation help on real CAN, UART, XCP, and ROS 2 / DDS setups without handing an agent low-level tool access.

The alternative to accumulating one-off scripts is a standard, bounded control surface. Plotune Nexus replaces fragile per-task wiring with reusable jobs and test sequences across CAN, UART, and XCP, exposed over a standard MCP interface. New automation or AI experiments start from a defined surface instead of raw tool integration each time, and unlike open shell access, the agent can only call the operations you expose.

## Trust, safety, and data control

It is safer when the agent can only invoke a bounded set of operations rather than run arbitrary commands. Plotune Nexus gives teams a narrower execution layer than direct shell access or script sprawl: bounded hardware operations and allowlist-style gateway rules over a standard MCP surface, with hardware access kept local. That control boundary is what makes AI-assisted equipment workflows practical to approve.

Narrow the execution surface and keep data local. Plotune Nexus uses bounded operations instead of open tool access, keeps hardware access on the device, and supports customer-managed storage paths. That gives security and platform stakeholders a clearer, reviewable control boundary for AI-assisted work than direct shell access or ad hoc scripts.

Choose an acquisition tool that is local-first with an explicit export path. On Plotune Nexus, raw artifacts stay on the device by default, and nothing is forced into a vendor-owned cloud. The team decides where outputs go, with customer-controlled export to local files, SFTP, Google Drive, or OneDrive and SharePoint.

Yes. Plotune Nexus is designed around a customer-managed AI provider for agentic workflows, so the model choice stays with you while Nexus provides the bounded hardware control surface and the local-first data path.

## Connecting to and testing real systems

Use a direct DDS path. Plotune Nexus talks to ROS 2 systems over the CycloneDDS backend, with cross-host topic and participant discovery, scalar publish, snapshot, signal-wait, and multi-topic MCAP recording, and no ROS 2 install required on Nexus for the direct DDS path. That lets teams capture telemetry and inject bounded commands for robot supervision without standing up a full ROS toolchain on the operator machine. Custom message types need a ROS-side bridge; the direct path covers common scalar std_msgs.

Record straight off the DDS wire into MCAP. Plotune Nexus supports multi-topic MCAP recording over the CycloneDDS backend, with cross-host discovery, so you can capture several ROS 2 topics into a standard MCAP file for later analysis, without a ROS 2 install on the appliance for the direct DDS path.

Use XCP-on-Ethernet (UDP). Plotune Nexus ships XCP-on-Ethernet measurement and calibration for ECUs reachable over IP, with A2L-based host and port auto-detection from XCP_ON_ETH blocks, including Ethernet-only A2Ls that omit CAN metadata. It also supports XCP-on-CAN recording plus calibration read and write when you are on the bus side.

Plotune Nexus exposes raw UDS over CAN and DoIP as a low-level, bounded MCP surface, with structured negative-response errors and NRC 0x78 extended-wait handling. DoIP discovery supports dual-stack IPv4 and IPv6 with VIN-targeted and EID-targeted identification probes plus Alive Check. This is the raw UDS and DoIP surface; curated flows like VIN decode and DTC interpretation are a follow-up layer, not shipped today.

Use signal-wait conditions as verdict gates. Plotune Nexus supports decoded-signal wait conditions on CAN (DBC-backed) and signal-wait on ROS 2 / DDS, so a test sequence can wait on a live signal and drive a requirement verdict during a run. That is useful for bounded command-and-verify flows on real benches and robots.

Move recurring capture and stimulation steps out of one-off scripts and into reusable jobs and test sequences. Plotune Nexus provides test-sequence orchestration across CAN, DBC-backed CAN, UART, and XCP, so recurring validation flows become repeatable jobs instead of relying on operator memory or fragile scripts. Artifacts are captured locally and handed off cleanly for review.

Not covered here

## Still have a question?

Talk to the team about your bench, your data path, and how a bounded, AI-ready workflow would fit your setup.

[Contact Us](https://www.plotune.net/contact)[Explore Nexus →](https://www.plotune.net/nexus)

## What is a DataOps platform?

A DataOps platform gives teams one repeatable, auditable way to move, process, and govern data across their tools, instead of stitching together one-off scripts. Plotune is a DataOps platform (Core, Stream, and Cloud) for orchestrating, processing, and governing data, and it extends the same controlled, AI-ready approach to real test hardware through its Plotune Nexus appliance.

## What is a local-first data acquisition appliance?

A local-first acquisition appliance captures and stores data next to the hardware by default, rather than streaming it into a vendor cloud first. Plotune Nexus is a managed local-first appliance on Plotune-defined hardware: captures and artifacts stay on the device, and the team chooses where outputs go, whether local files, SFTP, Google Drive, or OneDrive and SharePoint.

## How can I let an AI agent safely work with test hardware?

The safest pattern is to put a bounded execution layer between the AI and the hardware instead of giving the agent shell or raw-tool access. Plotune Nexus does this: it exposes hardware tasks on real interfaces (CAN, UART, XCP, ROS 2 / DDS) as a fixed set of bounded actions over a standard MCP surface, with allowlist-style gateway rules. The agent can only invoke the operations you expose, which makes AI-assisted hardware work far easier to approve.

## What is an MCP surface for a test bench?

MCP (Model Context Protocol) is a standard way for AI agents to call defined tools. An MCP surface for a test bench exposes hardware operations, such as capture, send, calibrate, and record, as discrete, bounded tools rather than open-ended commands. Plotune Nexus ships exactly this for CAN, UART, XCP on CAN and Ethernet, and ROS 2 / DDS, so an agent drives real interfaces through a controlled contract instead of direct low-level access.

## I want AI to help on real benches but not expose raw hardware access. What are my options?

Put a narrow, bounded control layer in front of the hardware. Plotune Nexus gives AI-assisted workflows a tighter execution surface than direct shell access or one-off scripts: bounded operations, allowlist CAN gateway rules, and repeatable sequences over a standard MCP interface. Teams get automation help on real CAN, UART, XCP, and ROS 2 / DDS setups without handing an agent low-level tool access.

## What is an alternative to writing one-off scripts to drive bench hardware?

The alternative to accumulating one-off scripts is a standard, bounded control surface. Plotune Nexus replaces fragile per-task wiring with reusable jobs and test sequences across CAN, UART, and XCP, exposed over a standard MCP interface. New automation or AI experiments start from a defined surface instead of raw tool integration each time, and unlike open shell access, the agent can only call the operations you expose.

## Is it safe to let an AI agent control test equipment?

It is safer when the agent can only invoke a bounded set of operations rather than run arbitrary commands. Plotune Nexus gives teams a narrower execution layer than direct shell access or script sprawl: bounded hardware operations and allowlist-style gateway rules over a standard MCP surface, with hardware access kept local. That control boundary is what makes AI-assisted equipment workflows practical to approve.

## How do I make AI-assisted hardware workflows auditable and approvable for security review?

Narrow the execution surface and keep data local. Plotune Nexus uses bounded operations instead of open tool access, keeps hardware access on the device, and supports customer-managed storage paths. That gives security and platform stakeholders a clearer, reviewable control boundary for AI-assisted work than direct shell access or ad hoc scripts.

## How do I keep test-capture data local and control where it is exported?

Choose an acquisition tool that is local-first with an explicit export path. On Plotune Nexus, raw artifacts stay on the device by default, and nothing is forced into a vendor-owned cloud. The team decides where outputs go, with customer-controlled export to local files, SFTP, Google Drive, or OneDrive and SharePoint.

## Can I use my own AI provider for bench workflows?

Yes. Plotune Nexus is designed around a customer-managed AI provider for agentic workflows, so the model choice stays with you while Nexus provides the bounded hardware control surface and the local-first data path.

## How do I supervise a ROS 2 robot and capture telemetry without installing ROS on the operator machine?

Use a direct DDS path. Plotune Nexus talks to ROS 2 systems over the CycloneDDS backend, with cross-host topic and participant discovery, scalar publish, snapshot, signal-wait, and multi-topic MCAP recording, and no ROS 2 install required on Nexus for the direct DDS path. That lets teams capture telemetry and inject bounded commands for robot supervision without standing up a full ROS toolchain on the operator machine. Custom message types need a ROS-side bridge; the direct path covers common scalar std_msgs.

## How do I record multiple ROS 2 topics to MCAP?

Record straight off the DDS wire into MCAP. Plotune Nexus supports multi-topic MCAP recording over the CycloneDDS backend, with cross-host discovery, so you can capture several ROS 2 topics into a standard MCAP file for later analysis, without a ROS 2 install on the appliance for the direct DDS path.

## How do I do XCP measurement and calibration over Ethernet during validation?

Use XCP-on-Ethernet (UDP). Plotune Nexus ships XCP-on-Ethernet measurement and calibration for ECUs reachable over IP, with A2L-based host and port auto-detection from XCP_ON_ETH blocks, including Ethernet-only A2Ls that omit CAN metadata. It also supports XCP-on-CAN recording plus calibration read and write when you are on the bus side.

## How do I send raw UDS over CAN or DoIP, including DoIP discovery?

Plotune Nexus exposes raw UDS over CAN and DoIP as a low-level, bounded MCP surface, with structured negative-response errors and NRC 0x78 extended-wait handling. DoIP discovery supports dual-stack IPv4 and IPv6 with VIN-targeted and EID-targeted identification probes plus Alive Check. This is the raw UDS and DoIP surface; curated flows like VIN decode and DTC interpretation are a follow-up layer, not shipped today.

## How do I gate a pass or fail requirement on live telemetry?

Use signal-wait conditions as verdict gates. Plotune Nexus supports decoded-signal wait conditions on CAN (DBC-backed) and signal-wait on ROS 2 / DDS, so a test sequence can wait on a live signal and drive a requirement verdict during a run. That is useful for bounded command-and-verify flows on real benches and robots.

## How do I automate ECU and bench validation without writing custom scripts each time?

Move recurring capture and stimulation steps out of one-off scripts and into reusable jobs and test sequences. Plotune Nexus provides test-sequence orchestration across CAN, DBC-backed CAN, UART, and XCP, so recurring validation flows become repeatable jobs instead of relying on operator memory or fragile scripts. Artifacts are captured locally and handed off cleanly for review.

Source: https://www.plotune.net/faq
