import React, { useState } from "react";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";
import { captureExample, mcpExample } from "./examples";
import { Failure } from "./LiveExplorer";

export default function ConnectionSetup({ client, metadata, mcp = false }) {
  const [language, setLanguage] = useState("curl");
  const [suppliedKey, setSuppliedKey] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const raw = metadata.keys[metadata.project.id];
  const key = raw || suppliedKey;
  const snippet = mcp
    ? mcpExample(key || "YOUR_PROJECT_KEY", client.origin)
    : captureExample(language, key || "YOUR_PROJECT_KEY", client.origin);
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
      <Panel title="Project API key" meta={metadata.project.name}>
        <div className="mvp-connection">
          {raw ? (
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
          <p>
            This key allows event capture and read-only MCP access. Keep it in
            your own system's secret store.
          </p>
          {metadata.role !== "Member" && (
            <button
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
            </button>
          )}
        </div>
      </Panel>
      <Panel title={mcp ? "Connect your AI agent" : "Send your first event"}>
        <div className="mvp-connection">
          <p>
            {mcp
              ? "Connect to the read-only event history endpoint. Configuration format varies by MCP client."
              : "Send any event name and arbitrary JSON properties from an HTTP-capable system."}
          </p>
          <code>
            {client.origin || "https://stream.plotune.net"}/
            {mcp ? "mcp" : "capture"}
          </code>
          {!mcp && (
            <label>
              Example language
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="curl">cURL</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
              </select>
            </label>
          )}
          <div className="sw-code-head">
            <span>
              {key
                ? "Client example"
                : "Replace YOUR_PROJECT_KEY with your stored key"}
            </span>
            <button className="sw-link" onClick={() => copy(snippet)}>
              Copy example
            </button>
          </div>
          <pre className="sw-code" tabIndex={0}>
            {snippet}
          </pre>
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
          <Failure error={error} />
          {status && <p role="status">{status}</p>}
        </div>
      </Panel>
    </>
  );
}
