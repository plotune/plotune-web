import React, { useEffect, useId, useRef, useState } from "react";
import { FiCheck, FiCopy, FiEye, FiEyeOff } from "react-icons/fi";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";

function destinationHost(url) {
  try { return new URL(url).host; } catch { return "Webhook destination"; }
}

export default function WebhookSigningSecret({ secret, onDismiss, busy = false, focusVersion = 0 }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const heading = useRef(null), input = useRef(null), focused = useRef(null);
  const helpId = useId(), fieldId = useId();
  useEffect(() => {
    // Add-dialog cleanup restores its trigger first; then focus this next step.
    if (busy || document.querySelector("dialog[open]") || focused.current === focusVersion) return;
    focused.current = focusVersion;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView?.({ block: "start", behavior: "instant" });
  }, [busy, focusVersion]);
  const copy = async () => {
    setError("");
    try { await navigator.clipboard.writeText(secret.value); setCopied(true); }
    catch { setError("Copy unavailable. Use Show signing secret, then select and copy the text."); }
  };
  return <Panel className="live-webhook-secret" title={<span ref={heading} tabIndex={-1}>Save signing secret</span>}>
    <div className="live-hook-body">
      <div className="live-hook-context"><strong>{secret.eventName || "Webhook"}</strong>{secret.url && (secret.url.length > 120 ? <><code>{destinationHost(secret.url)}</code><details className="live-hook-destination"><summary>Full destination URL</summary><code>{secret.url}</code></details></> : <code>{secret.url}</code>)}</div>
      <p id={helpId}>Copy this secret to your receiver's secret store. Once dismissed, it cannot be viewed again.</p>
      {secret.previousExpiresAt && <p className="live-hook-overlap">Previous secret valid until <time dateTime={secret.previousExpiresAt}>{new Date(secret.previousExpiresAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC</time>.</p>}
      <label className="live-hook-secret-label" htmlFor={fieldId}>Signing secret</label>
        <div className="live-hook-secret-field">
          <input id={fieldId} ref={input} aria-label="Webhook signing secret" aria-describedby={helpId} type={revealed ? "text" : "password"} readOnly autoComplete="off" spellCheck={false} value={secret.value} />
          <button type="button" className="sw-icon-button" aria-label={revealed ? "Hide signing secret" : "Show signing secret"} aria-pressed={revealed} onClick={() => setRevealed(value => !value)}>{revealed ? <FiEyeOff /> : <FiEye />}</button>
        </div>
      <div className="live-hook-actions live-hook-save-actions">
        <button type="button" className="sw-button sw-primary" onClick={copy}>{copied ? <FiCheck /> : <FiCopy />}{copied ? "Copied" : "Copy signing secret"}</button>
        <button type="button" className="sw-button" disabled={busy} onClick={onDismiss}>I saved the secret</button>
      </div>
      <p className="live-hook-feedback" role={error ? "alert" : "status"}>{error || (copied ? "Secret copied. Save it at your receiver before dismissing." : "New secret ready to copy.")}</p>
      <details className="live-hook-verification">
        <summary>How to verify deliveries</summary>
        <p>Verify <code>X-Plotune-Signature</code> using this secret and the raw request body before parsing JSON. Accept timestamps within five minutes and deduplicate event IDs.</p>
      </details>
    </div>
  </Panel>;
}
