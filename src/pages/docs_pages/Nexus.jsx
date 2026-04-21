import React from "react";

const setupSteps = [
  {
    title: "Prepare a local Nexus workspace",
    body:
      "Start with a development machine that can reach the device or simulator you want to test. For early evaluation, keep the first run local and use placeholder addresses until your deployment is ready.",
    code: "http://<device-ip>/mcp",
  },
  {
    title: "Choose the interface to validate",
    body:
      "Pick one narrow hardware path for the first pass. CAN is a good smoke test because Linux SocketCAN and virtual CAN make it possible to validate the flow before using real hardware.",
    code: "vcan0 or can0",
  },
  {
    title: "Connect an MCP-capable client",
    body:
      "During installation, connect through the local device endpoint only. This keeps the first registration path close to the device before any remote route is shared.",
    code: "codex mcp add plotune-nexus --url http://<device-ip>/mcp",
  },
  {
    title: "Run a bounded capture",
    body:
      "Use a short duration and a known interface for the first capture. Confirm that the response includes job status or a small sample before increasing duration or moving to larger artifacts.",
    code: "record CAN traffic for 1-5 seconds",
  },
];

const checkpoints = [
  "The device or simulator is reachable from the client machine.",
  "The selected interface is visible before starting a capture.",
  "A short test message or sample frame can be observed.",
  "The capture result is small enough to inspect during the first run.",
  "The owner can see the device UUID on the dashboard after registration.",
];

const clientExamples = [
  {
    name: "Codex",
    command: "codex mcp add plotune-nexus --url http://<device-ip>/mcp",
  },
  {
    name: "VS Code",
    command: '{ "type": "http", "url": "http://<device-ip>/mcp" }',
  },
  {
    name: "Claude Code",
    command: "claude mcp add --transport http plotune-nexus http://<device-ip>/mcp",
  },
];

export default function Nexus() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-5">
          Initial Guide
        </div>
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Plotune Nexus Quick Start
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          A first-pass guide for connecting an MCP-capable client to a Nexus device path and validating a small hardware-facing workflow.
        </p>
      </div>

      <section className="mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-light-text mb-4 flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            What Nexus Provides
          </h2>
          <p className="text-gray-text leading-relaxed mb-4">
            <strong className="text-light-text">Plotune Nexus</strong> is a device-side gateway for acquisition, diagnostics, and controlled access to field interfaces. It helps MCP clients work near hardware boundaries where short checks, bounded recordings, and clear device state matter.
          </p>
          <p className="text-gray-text leading-relaxed">
            This page is intentionally small. It shows the shape of a first setup flow. After the local setup is complete, use the Remote Routing guide for owner-managed dashboard and MCP URLs.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-8 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          First Setup Flow
        </h2>

        <div className="space-y-5">
          {setupSteps.map((step, index) => (
            <article
              key={step.title}
              className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-light-text mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-text leading-relaxed mb-4">{step.body}</p>
                  <code className="block overflow-x-auto rounded-lg border border-white/5 bg-black/30 px-4 py-3 text-sm text-primary">
                    {step.code}
                  </code>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Client Setup Examples
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clientExamples.map((client) => (
            <div
              key={client.name}
              className="bg-gradient-to-br from-primary/10 to-transparent rounded-xl p-6 border border-primary/20"
            >
              <h3 className="text-lg font-semibold text-light-text mb-3">{client.name}</h3>
              <code className="block min-h-[5rem] overflow-x-auto rounded-lg bg-black/30 p-3 text-sm leading-6 text-primary">
                {client.command}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-light-text mb-5 flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            First Run Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checkpoints.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-black/20 p-4">
                <i className="fas fa-check text-primary mt-1 text-sm"></i>
                <span className="text-gray-text leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/10 to-transparent p-8">
          <h2 className="text-2xl font-bold text-light-text mb-4">
            Scope of This Guide
          </h2>
          <p className="text-gray-text leading-relaxed">
            Treat this as an initial orientation for development and demos. Start with one interface, one MCP client, and a short capture. Add real hardware, longer jobs, and deployment-specific access controls only after the basic path is visible end to end.
          </p>
        </div>
      </section>
    </div>
  );
}
