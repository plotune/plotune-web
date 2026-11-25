# Questions about Plotune

How to start, what you need and who can see your data.  Then how the workspace fits together, and how teams use Plotune Nexus to run bounded, AI-ready workflows on real test hardware.

 A doubtful reviewer holds a puzzle piece that does not quite fit.

## Getting started

Yes. Creating a workspace is free and needs no credit card. A free account includes 300 credits that renew every month and all the core features. Use of the cloud tools is measured in credits: your workspace shows what is left and the current rates under Usage.

[Create a workspace](https://www.plotune.net/register)

No. Requirements (RMS) and bench event history (Stream) run in the cloud and need no hardware from Plotune. Stream records events that something sends to it, which can be any script or tool that makes an HTTP request. To look around first, the Stream demo opens a sample project and needs no account.

[Open the Stream demo](https://www.plotune.net/stream/demo)

Not for requirements: RMS is used in the browser. Stream keeps the events that your scripts, test tools and devices send over HTTP, so someone on the team adds that call; the set-up steps include ready examples for curl, Python, C/C++, MATLAB and more. Nexus and Bridge are hardware for your test bench: Nexus is an appliance where AI agents run tests on your real hardware within the limits you set, and Bridge interfaces are managed from the browser.

[See the set-up examples in the demo](https://www.plotune.net/stream/demo?view=api)

Microsoft Copilot, ChatGPT and Claude. Microsoft Copilot connects through Copilot Studio, and your IT team may need to approve the connection. Other assistants that support MCP (Model Context Protocol), the standard way for an AI assistant to use outside tools, connect the same way. The assistant works with your own account and your role in the workspace, and you choose read-only or full access when you connect.

[Connect your assistant](https://www.plotune.net/connect)

Open your workspace and choose Invite under People. Enter the person's email address and a role: an Admin manages projects, tools and people, a Member works in the projects, and a Viewer can only read. Plotune does not send an invitation email, so tell them: they join as soon as they sign in, or sign up, with that address. The Owner role moves only by transferring ownership.

What you and your team put into a workspace stays yours. People you add to the workspace work in its projects within their role. An AI assistant you connect works with your account and role, and you can make the connection read-only or revoke it under Connected apps. On the Nexus appliance, captures stay on the device by default; in a Nexus Edge session they are kept in the cloud workspace of that session. What we store and who receives it is described in the privacy policy.

[Read the privacy policy](https://www.plotune.net/privacy)

## About Plotune

The workspace is the place where an engineering team keeps its work in Plotune. You create a workspace, add projects to it, invite people with roles, and switch on the tools each project needs. RMS (requirements), Stream (event history) and Nexus (cloud test sessions through a Nexus Edge on your bench) are switched on per project. The Nexus appliance and Bridge are hardware products of their own.

RMS is the requirements tool in a Plotune workspace. It keeps requirements with revisions, review and approval, traceability links, test cases with recorded evidence, and baselines, and it exchanges requirement sets as ReqIF. AI agents can work in it through MCP, with roles and an audit trail. RMS makes no claim of compliance with any standard.

Open the project in your workspace and switch on the tool it needs: RMS, Stream or Nexus. The tool then appears inside that project, and only the people who have access to the project see it. Switching a tool off again removes it from the project view.

Both give AI agents the same tools on your real test hardware; they differ in where the work runs. The Nexus appliance sits on your bench and processes and stores data locally. Nexus Edge is a much smaller device on your bench: it shares the USB devices plugged into it and, if you choose, the bench network, with a session that runs in the cloud. You pair the Edge and choose what it shares in your workspace; your AI assistant starts and stops the sessions. The choice is mostly whether you spend on the device or on cloud use.

[See Nexus Edge](https://www.plotune.net/nexus/edge)

A local-first acquisition appliance captures and stores data next to the hardware by default, rather than streaming it into a vendor cloud first. Plotune Nexus is a managed local-first appliance on Plotune-defined hardware: captures and artifacts stay on the device, and the team chooses where outputs go, whether local files, SFTP, Google Drive, or OneDrive and SharePoint.

## AI agents on real test hardware

The answers from here on are about Plotune Nexus, the appliance where AI agents run tests on your real hardware within the limits you set.

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

## Ask the team

Talk to the team about your project, your bench and your data path.

[Talk to us](https://www.plotune.net/contact)[Create a workspace](https://www.plotune.net/register)

## Is it free to start?

Yes. Creating a workspace is free and needs no credit card. A free account includes 300 credits that renew every month and all the core features. Use of the cloud tools is measured in credits: your workspace shows what is left and the current rates under Usage.

## Do I need hardware to start?

No. Requirements (RMS) and bench event history (Stream) run in the cloud and need no hardware from Plotune. Stream records events that something sends to it, which can be any script or tool that makes an HTTP request. To look around first, the Stream demo opens a sample project and needs no account.

## Do I need to write code?

Not for requirements: RMS is used in the browser. Stream keeps the events that your scripts, test tools and devices send over HTTP, so someone on the team adds that call; the set-up steps include ready examples for curl, Python, C/C++, MATLAB and more. Nexus and Bridge are hardware for your test bench: Nexus is an appliance where AI agents run tests on your real hardware within the limits you set, and Bridge interfaces are managed from the browser.

## Which AI assistants does it work with?

Microsoft Copilot, ChatGPT and Claude. Microsoft Copilot connects through Copilot Studio, and your IT team may need to approve the connection. Other assistants that support MCP (Model Context Protocol), the standard way for an AI assistant to use outside tools, connect the same way. The assistant works with your own account and your role in the workspace, and you choose read-only or full access when you connect.

## How do I add my team?

Open your workspace and choose Invite under People. Enter the person's email address and a role: an Admin manages projects, tools and people, a Member works in the projects, and a Viewer can only read. Plotune does not send an invitation email, so tell them: they join as soon as they sign in, or sign up, with that address. The Owner role moves only by transferring ownership.

## Where is my data and who can see it?

What you and your team put into a workspace stays yours. People you add to the workspace work in its projects within their role. An AI assistant you connect works with your account and role, and you can make the connection read-only or revoke it under Connected apps. On the Nexus appliance, captures stay on the device by default; in a Nexus Edge session they are kept in the cloud workspace of that session. What we store and who receives it is described in the privacy policy.

## What is the Plotune workspace?

The workspace is the place where an engineering team keeps its work in Plotune. You create a workspace, add projects to it, invite people with roles, and switch on the tools each project needs. RMS (requirements), Stream (event history) and Nexus (cloud test sessions through a Nexus Edge on your bench) are switched on per project. The Nexus appliance and Bridge are hardware products of their own.

## What is RMS?

RMS is the requirements tool in a Plotune workspace. It keeps requirements with revisions, review and approval, traceability links, test cases with recorded evidence, and baselines, and it exchanges requirement sets as ReqIF. AI agents can work in it through MCP, with roles and an audit trail. RMS makes no claim of compliance with any standard.

## How are tools added to a project?

Open the project in your workspace and switch on the tool it needs: RMS, Stream or Nexus. The tool then appears inside that project, and only the people who have access to the project see it. Switching a tool off again removes it from the project view.

## What is the difference between the Nexus appliance and Nexus Edge?

Both give AI agents the same tools on your real test hardware; they differ in where the work runs. The Nexus appliance sits on your bench and processes and stores data locally. Nexus Edge is a much smaller device on your bench: it shares the USB devices plugged into it and, if you choose, the bench network, with a session that runs in the cloud. You pair the Edge and choose what it shares in your workspace; your AI assistant starts and stops the sessions. The choice is mostly whether you spend on the device or on cloud use.

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
