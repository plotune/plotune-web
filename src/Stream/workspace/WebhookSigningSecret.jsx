import React, { useState } from "react";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";

export default function WebhookSigningSecret({ secret, onDismiss }) {
  const [message, setMessage] = useState("");
  const [revealed, setRevealed] = useState(false);
  return <Panel title="Webhook signing secret">
    <div className="live-pad">
      <p>Save this secret in your receiver now. It is shown once and cannot be recovered. Verify X-Plotune-Signature against the raw request body.</p>
      {secret.previousExpiresAt && <p>The previous secret works until {new Date(secret.previousExpiresAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC. Rotating again replaces that previous secret.</p>}
      <label>Signing secret<input aria-label="Webhook signing secret" type={revealed ? "text" : "password"} readOnly autoComplete="off" value={secret.value} style={{ width: "100%", minWidth: 0 }} /></label>
      <div className="sw-toolbar" style={{ marginTop: 12, flexWrap: "wrap" }}>
        <button className="sw-button" aria-pressed={revealed} onClick={() => setRevealed(value => !value)}>{revealed ? "Hide signing secret" : "Show signing secret"}</button>
        <button className="sw-button" onClick={async () => { try { await navigator.clipboard.writeText(secret.value); setMessage("Secret copied."); } catch { setMessage("Copy unavailable. Select the secret field and copy it manually."); } }}>Copy signing secret</button>
        <button className="sw-button" onClick={onDismiss}>I saved the secret</button>
      </div>
      {message && <p role="status">{message}</p>}
    </div>
  </Panel>;
}
