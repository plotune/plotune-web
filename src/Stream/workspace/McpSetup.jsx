import React, { useRef, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

const SERVER = "plotune-stream";
const STORAGE_KEY = "plotune.stream.mcpClient";

// One entry per client. Commands and file formats follow each client's own docs;
// every one signs in with OAuth, so no secret is pasted into a config file.
export const MCP_CLIENTS = [
  {
    id: "claude-code",
    label: "Claude Code",
    steps: (url) => [
      { text: "Add Stream in your terminal.", code: `claude mcp add --transport http ${SERVER} ${url}` },
      { text: "Start Claude Code, run /mcp, choose plotune-stream and select Authenticate." },
    ],
  },
  {
    id: "codex",
    label: "Codex",
    steps: (url) => [
      { text: "Add Stream in your terminal.", code: `codex mcp add ${SERVER} --url ${url}` },
      { text: "Sign in.", code: `codex mcp login ${SERVER}` },
    ],
  },
  {
    id: "vscode",
    label: "VS Code",
    steps: (url) => [
      {
        text: "Add Stream to .vscode/mcp.json, or to your user mcp.json.",
        code: JSON.stringify({ servers: { [SERVER]: { type: "http", url } } }, null, 2),
      },
      { text: "Start the server from mcp.json and allow VS Code to sign in when it asks." },
    ],
  },
  {
    id: "cursor",
    label: "Cursor",
    steps: (url) => [
      {
        text: "Add Stream to ~/.cursor/mcp.json.",
        code: JSON.stringify({ mcpServers: { [SERVER]: { url } } }, null, 2),
      },
      { text: "In Cursor Settings, open MCP and connect plotune-stream." },
    ],
  },
  {
    id: "other",
    label: "Other",
    steps: (url) => [
      { text: "Add this server URL to any MCP client that supports remote servers with OAuth sign-in.", code: url },
      { text: "Connect from the client. It finds the sign-in page by itself." },
    ],
  },
];

function remembered() {
  try {
    const id = window.localStorage.getItem(STORAGE_KEY);
    return MCP_CLIENTS.some((c) => c.id === id) ? id : MCP_CLIENTS[0].id;
  } catch {
    return MCP_CLIENTS[0].id;
  }
}

export default function McpSetup({ url, projectName, copy, copied }) {
  const [selected, setSelected] = useState(remembered);
  const tabs = useRef([]);
  const index = MCP_CLIENTS.findIndex((c) => c.id === selected);
  const current = MCP_CLIENTS[index];
  const choose = (id, focus = false) => {
    setSelected(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Remembering the tab is a convenience only.
    }
    if (focus) tabs.current[MCP_CLIENTS.findIndex((c) => c.id === id)]?.focus();
  };
  const onKeyDown = (event) => {
    const moves = { ArrowRight: 1, ArrowLeft: -1, Home: -index, End: MCP_CLIENTS.length - 1 - index };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (index + moves[event.key] + MCP_CLIENTS.length) % MCP_CLIENTS.length;
    choose(MCP_CLIENTS[next].id, true);
  };
  const steps = [
    ...current.steps(url),
    { text: `Your browser opens plotune.net. Sign in, choose “${projectName}” and approve.` },
  ];
  return (
    <div className="mcp-setup">
      <div className="mcp-setup-tabs" role="tablist" aria-label="MCP client">
        {MCP_CLIENTS.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => (tabs.current[i] = el)}
            id={`mcp-tab-${c.id}`}
            role="tab"
            type="button"
            aria-selected={c.id === selected}
            aria-controls="mcp-setup-steps"
            tabIndex={c.id === selected ? 0 : -1}
            className={c.id === selected ? "active" : ""}
            onClick={() => choose(c.id)}
            onKeyDown={onKeyDown}
          >
            {c.label}
          </button>
        ))}
      </div>
      <ol id="mcp-setup-steps" className="mcp-setup-steps" role="tabpanel" aria-labelledby={`mcp-tab-${current.id}`}>
        {steps.map((step, i) => (
          <li key={`${current.id}-${i}`}>
            <span className="mcp-step-number" aria-hidden="true">{i + 1}</span>
            <div>
              <p>{step.text}</p>
              {step.code && (
                <div className="mcp-step-code">
                  <pre className="sw-code" tabIndex={0} aria-label={`${current.label} step ${i + 1}`}>{step.code}</pre>
                  <button
                    type="button"
                    className="sw-button mcp-copy"
                    onClick={() => copy(step.code, `${current.id}-${i}`)}
                    aria-label={`Copy ${current.label} step ${i + 1}`}
                  >
                    {copied === `${current.id}-${i}` ? <FiCheck /> : <FiCopy />}
                    {copied === `${current.id}-${i}` ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
