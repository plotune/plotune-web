import React, { useRef, useState } from "react";

/** Rare key replacement stays behind a disclosure; initial signing setup is direct. */
export default function WebhookSigningControls({ webhook, busy, pendingSecret, onRotate }) {
  const disclosure = useRef(null);
  const trigger = useRef(null);
  const pending = useRef(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const run = async () => {
    if (pending.current || busy || pendingSecret) return;
    pending.current = true;
    setSaving(true);
    setError("");
    try { await onRotate(webhook, () => trigger.current); if (disclosure.current) disclosure.current.open = false; }
    catch (cause) {
      if (cause.signingSecretReceived) { if (disclosure.current) disclosure.current.open = false; }
      else setError(cause.message || "Could not create a secret. Try again.");
    }
    finally { pending.current = false; setSaving(false); }
  };
  const close = () => {
    if (saving) return;
    disclosure.current.open = false;
    setError("");
    trigger.current?.focus();
  };
  const unavailable = busy || saving || pendingSecret;
  return <div className="live-hook-signing" aria-busy={saving}>
    <span className={webhook.signingConfigured ? "live-hook-state" : "live-hook-state live-hook-required"}>
      {pendingSecret ? "New secret ready to save" : webhook.signingConfigured ? "Signing configured" : "Signing required"}
    </span>
    {webhook.signingConfigured ? (
      <details ref={disclosure} onKeyDown={(event) => { if (event.key === "Escape" && !saving) { event.preventDefault(); close(); } }}>
        <summary ref={trigger}>Rotate signing secret</summary>
        <div className="live-hook-confirm">
          <p>Create a new secret for <strong>{webhook.eventName}</strong>. The previous secret works for 24 hours; rotating again replaces it.</p>
          {pendingSecret && <p>Save the new secret above before creating another.</p>}
          {error && <p className="live-hook-error" role="alert">{error}</p>}
          <div className="live-hook-actions">
            <button type="button" className="sw-button" disabled={saving} onClick={close}>Cancel</button>
            <button type="button" className="sw-button sw-primary" disabled={unavailable} onClick={run}>{saving ? "Creating secret…" : "Create new secret"}</button>
          </div>
        </div>
      </details>
    ) : (
      <>
        <p>Set up signing before this webhook can deliver events.</p>
        <button ref={trigger} type="button" className="sw-button" disabled={unavailable} onClick={run}>{saving ? "Creating secret…" : "Set up signing"}</button>
        {error && <p className="live-hook-error" role="alert">{error}</p>}
      </>
    )}
  </div>;
}
