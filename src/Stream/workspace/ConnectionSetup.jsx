import React, { useEffect, useState } from "react";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";
import { mcpExample } from "./examples";
import CaptureGuide from "./CaptureGuide";
import McpSetup from "./McpSetup";
import { FiCopy, FiTerminal } from "react-icons/fi";
import { Failure } from "./LiveExplorer";

export default function ConnectionSetup({ client, metadata, mcp = false }) {
  const [suppliedKey, setSuppliedKey] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(null);
  const raw = metadata.keys[metadata.project.id];
  const key = raw || suppliedKey;
  const snippet = mcpExample(key || "YOUR_PROJECT_KEY", client.origin);
  const mcpUrl = `${client.origin}/mcp`;
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(null), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  // Feedback appears on the button that was used; the status line is for keyboard and screen readers.
  const copy = async (text, id = null) => {
    try {
      await navigator.clipboard.writeText(text);
      setError(null);
      setCopied(id);
      setStatus("Copied.");
    } catch {
      setError(new Error("Copy failed. Select the text to copy manually."));
    }
  };
  const keyAccess = (
      <Panel title={mcp ? "Project key access" : "Project connection"} meta={metadata.project.name}>
        <div className="st-connection live-project-connection">
          <label>{mcp ? "MCP endpoint" : "Ingestion endpoint"}
            <div className="st-endpoint">
              <code>{client.origin}/{mcp ? "mcp" : "capture"}</code>
              <button className="sw-icon-button" aria-label={mcp ? "Copy MCP endpoint" : "Copy ingestion endpoint"} onClick={() => copy(`${client.origin}/${mcp ? "mcp" : "capture"}`)}><FiCopy /></button>
            </div>
          </label>
          <div className="live-project-key">{raw ? (
            <>
              <p>
                Copy this key now. It is held only in this browser session and
                will not be returned again.
              </p>
              <div className="live-key">
                <input
                  aria-label="New project API key"
                  readOnly
                  type={revealed ? "text" : "password"}
                  value={raw}
                />
                <button
                  className="sw-button"
                  onClick={() => setRevealed(!revealed)}
                >
                  {revealed ? "Hide" : "Reveal"}
                </button>
                <button className="sw-button" onClick={() => copy(raw)}>
                  Copy key
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                Key prefix: <code>{metadata.project.keyPrefix}…</code>. Existing
                keys cannot be recovered.
              </p>
              <label>
                Use your existing key <span>Optional · held in memory</span>
                <input
                  type="password"
                  autoComplete="off"
                  value={suppliedKey}
                  onChange={(e) => setSuppliedKey(e.target.value)}
                  placeholder="Paste a key to generate examples or check MCP"
                />
              </label>
            </>
          )}
          </div>
          <p>
            This key allows event capture and read-only MCP access. Keep it in
            your own system's secret store.
          </p>
          {metadata.role !== "Member" && (
            <div className="live-key-rotation"><p>Replace the key only if you need to update or revoke client access.</p><button
              className="sw-button"
              disabled={metadata.busy}
              onClick={async () => {
                if (
                  !window.confirm(
                    "Rotate this project's key? The old key will stop accepting capture and MCP requests. Update every client that uses it.",
                  )
                )
                  return;
                try {
                  await metadata.rotate();
                  setSuppliedKey("");
                  setStatus("New key created. Update your clients.");
                } catch (cause) {
                  setError(cause);
                }
              }}
            >
              Rotate API key
            </button></div>
          )}
        </div>
      </Panel>
  );
  if (!mcp) return (
    <>
      {keyAccess}
      <Panel title="Capture an event">
        <CaptureGuide apiKey={key} origin={client.origin} />
      </Panel>
      <Failure error={error} />
      {status && <p role="status">{status}</p>}
    </>
  );
  return (
    <>
      <Panel title="Query events from your AI agent">
        <div className="st-mcp-intro">
          <span className="st-first-icon"><FiTerminal /></span>
          <div><h3>Your event history, available to your AI agent.</h3>
            <p>Connect your AI client, sign in once, and ask about this project's events, devices and health.</p>
            <p className="st-muted">Reads events, dashboards and health. This connection does not control hardware.</p>
          </div>
        </div>
        <div className="st-mcp-example"><span>Try asking</span><q>Which devices stopped sending in the last hour, and why?</q></div>
      </Panel>
      <Panel title="Connect your AI client" meta={metadata.project.name}>
        <McpSetup url={mcpUrl} projectName={metadata.project.name} copy={copy} copied={copied} />
      </Panel>
      <details className="mcp-key-alternative">
        <summary>Use a project key instead</summary>
        <p className="st-muted">For clients without sign-in support. A project key reads event history only; dashboards, analysis and health need sign-in.</p>
        {keyAccess}
        <Panel title="Client configuration">
        <div className="st-connection live-mcp-config">
          <p>Configuration format varies by MCP client. Use the endpoint and project key below in your client's remote MCP settings.</p>
          <div className="sw-code-head">
            <span>Client configuration</span>
            <button className="sw-link" onClick={() => copy(snippet)}>Copy example</button>
          </div>
          <pre className="sw-code" tabIndex={0} aria-label="MCP configuration">{snippet}</pre>
          <button
              className="sw-button"
              disabled={!key || checking}
              onClick={async () => {
                setChecking(true);
                setError(null);
                setStatus("");
                try {
                  const response = await client.mcp(key);
                  if (response.error || !response.result?.protocolVersion)
                    throw new Error(
                      response.error?.message ||
                        "MCP did not initialize successfully.",
                    );
                  setStatus(
                    `MCP connected · protocol ${response.result.protocolVersion}`,
                  );
                } catch (cause) {
                  setError(cause);
                } finally {
                  setChecking(false);
                }
              }}
            >
              {checking ? "Checking…" : "Check MCP connection"}
            </button>
        </div>
        </Panel>
      </details>
      <Failure error={error} />
      {status && <p role="status">{status}</p>}
    </>
  );
}
