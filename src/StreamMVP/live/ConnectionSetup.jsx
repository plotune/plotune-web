import React, { useState } from "react";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";
import { mcpExample } from "./examples";
import CaptureGuide from "./CaptureGuide";
import { FiCopy, FiTerminal } from "react-icons/fi";
import { Failure } from "./LiveExplorer";

export default function ConnectionSetup({ client, metadata, mcp = false }) {
  const [suppliedKey, setSuppliedKey] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const raw = metadata.keys[metadata.project.id];
  const key = raw || suppliedKey;
  const snippet = mcpExample(key || "YOUR_PROJECT_KEY", client.origin);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied.");
    } catch {
      setError(new Error("Copy failed. Select the text to copy manually."));
    }
  };
  return (
    <>
      {mcp && <Panel title="Query events from your AI agent">
        <div className="mvp-mcp-intro">
          <span className="mvp-first-icon"><FiTerminal /></span>
          <div><h3>Your event history, available through MCP.</h3>
            <p>Connect an MCP-capable client to investigate this project's events.</p>
            <p className="mvp-muted">Read-only event history access. This connection does not control hardware.</p>
          </div>
        </div>
        <div className="mvp-mcp-example"><span>Try asking</span><q>Find motor.sample events from motor-003 in test-run-817 and summarize their temperatures.</q></div>
      </Panel>}
      <Panel title={mcp ? "MCP connection" : "Project connection"} meta={metadata.project.name}>
        <div className="mvp-connection live-project-connection">
          <label>{mcp ? "MCP endpoint" : "Ingestion endpoint"}
            <div className="mvp-endpoint">
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
      <Panel title={mcp ? "Client configuration" : "Capture an event"}>
        {!mcp ? <CaptureGuide apiKey={key} origin={client.origin} /> : <div className="mvp-connection live-mcp-config">
          <p>Configuration format varies by MCP client. Use the endpoint and project key below in your client's remote MCP settings.</p>
          <div className="sw-code-head">
            <span>Client configuration</span>
            <button className="sw-link" onClick={() => copy(snippet)}>Copy example</button>
          </div>
          <pre className="sw-code" tabIndex={0} aria-label="MCP configuration">{snippet}</pre>
          {mcp && (
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
          )}
        </div>}
      </Panel>
      <Failure error={error} />
      {status && <p role="status">{status}</p>}
    </>
  );
}
