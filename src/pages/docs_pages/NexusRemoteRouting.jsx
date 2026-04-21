import React from "react";

const deviceUuid = "<UUID>";
const dashboardUrl = `https://nexus.plotune.net/devices/${deviceUuid}/dashboard`;
const mcpUrl = `https://nexus.plotune.net/devices/${deviceUuid}/mcp/`;
const vscodeHeaderExample = `{
  "servers": {
    "plotune-nexus": {
      "url": "https://nexus.plotune.net/devices/<UUID>/mcp/",
      "type": "http",
      "headers": {
        "X-Plotune-Device-UUID": "<UUID>"
      }
    }
  },
  "inputs": []
}`;

const routingSteps = [
  {
    title: "Install and register locally",
    body:
      "Use the local Nexus endpoint for installation and first registration. Keeping this step local reduces accidental exposure while the device identity and owner relationship are created.",
    code: "http://<device-ip>/mcp",
  },
  {
    title: "Find the device UUID",
    body:
      "After registration, the device UUID is visible on the Nexus dashboard. The UUID identifies the device route and lets the owner share the correct endpoint with approved users.",
    code: deviceUuid,
  },
  {
    title: "Open the device dashboard",
    body:
      "Use the device-scoped dashboard URL to inspect the interface and confirm the device route. Replace <UUID> with the UUID shown for your device.",
    code: dashboardUrl,
  },
  {
    title: "Register MCP from anywhere",
    body:
      "Once the device route is available, MCP-capable clients can register against the HTTPS endpoint. The device owner controls who should receive this URL.",
    code: mcpUrl,
  },
];

const clientCommands = [
  {
    name: "Codex",
    command: `codex mcp add plotune-nexus --url ${mcpUrl}`,
  },
  {
    name: "VS Code",
    command: `{ "type": "http", "url": "${mcpUrl}" }`,
  },
  {
    name: "Claude Code",
    command: `claude mcp add --transport http plotune-nexus ${mcpUrl}`,
  },
];

export default function NexusRemoteRouting() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-5">
          Nexus Routing
        </div>
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Remote Routing with nexus.plotune.net
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          After local installation and owner registration, Nexus exposes device-scoped dashboard and MCP routes through <span className="text-light-text">nexus.plotune.net</span>.
        </p>
      </div>

      <section className="mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-light-text mb-4 flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            Security Model
          </h2>
          <p className="text-gray-text leading-relaxed mb-4">
            Installation starts over a local connection for security. After the device is registered to an owner, the owner can use the dashboard to identify the device UUID and share the device-scoped route when remote access is needed.
          </p>
          <p className="text-gray-text leading-relaxed">
            The route includes the device UUID, so clients and users land on a specific Nexus device instead of a generic endpoint.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-8 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Routing Flow
        </h2>

        <div className="space-y-5">
          {routingSteps.map((step, index) => (
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
          Remote MCP Examples
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clientCommands.map((client) => (
            <div
              key={client.name}
              className="bg-gradient-to-br from-primary/10 to-transparent rounded-xl p-6 border border-primary/20"
            >
              <h3 className="text-lg font-semibold text-light-text mb-3">{client.name}</h3>
              <code className="block min-h-[6rem] overflow-x-auto rounded-lg bg-black/30 p-3 text-sm leading-6 text-primary">
                {client.command}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-light-text mb-4 flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            Clients That Require Headers
          </h2>
          <p className="text-gray-text leading-relaxed mb-5">
            Some MCP clients may require the device UUID as an explicit routing header. Use the same UUID from the dashboard in both the device-scoped URL and the <code className="text-primary">X-Plotune-Device-UUID</code> header.
          </p>
          <pre className="overflow-x-auto rounded-xl border border-white/5 bg-black/30 p-4 text-sm leading-6 text-primary">
            <code>{vscodeHeaderExample}</code>
          </pre>
        </div>
      </section>

      <section>
        <div className="rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/10 to-transparent p-8">
          <h2 className="text-2xl font-bold text-light-text mb-4">
            Share the Right URL
          </h2>
          <p className="text-gray-text leading-relaxed mb-4">
            Use the dashboard URL for the web interface:
          </p>
          <code className="block overflow-x-auto rounded-lg bg-black/30 px-4 py-3 text-sm text-primary mb-5">
            {dashboardUrl}
          </code>
          <p className="text-gray-text leading-relaxed mb-4">
            Use the MCP URL for client registration:
          </p>
          <code className="block overflow-x-auto rounded-lg bg-black/30 px-4 py-3 text-sm text-primary">
            {mcpUrl}
          </code>
        </div>
      </section>
    </div>
  );
}
