import React, { useEffect, useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { Dialog } from "../../StreamWorkspace/WorkspaceUI";

const host = (url) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};
const utc = (iso) =>
  `${new Date(iso).toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })} UTC`;

/** Short signing state for a webhook row: one word plus a hint when a rotation is in progress. */
export function signingLabel(webhook) {
  if (!webhook.signing?.configured) return "Not signed";
  return webhook.signing.previousUntil ? "Signed · rotating" : "Signed";
}

const ACTIONS = {
  created: "Created", updated: "Changed", enabled: "Turned on", disabled: "Turned off",
  signing_rotated: "Rotated the signing secret", signing_set_up: "Set up signing",
  auto_disabled: "Switched off after 20 failed deliveries in a row",
};
const via = (change) =>
  change.via === "mcp" ? `via ${change.client || "MCP"}` : change.via === "auto" ? "automatically" : "in the workspace";

/** Who changed the webhook, newest first. Only Owners and Admins receive it. */
function ChangeHistory({ audit }) {
  if (!audit?.length) return null;
  return (
    <section className="wh-history" aria-labelledby="wh-history-title">
      <h3 id="wh-history-title">Recent changes</h3>
      <ol>
        {audit.map((change, index) => (
          <li key={`${change.at}-${index}`}>
            <span>{ACTIONS[change.action] || change.action}</span>
            <small>
              {change.via === "auto" ? "Plotune" : change.by} {via(change)} · <time dateTime={change.at}>{utc(change.at)}</time>
            </small>
          </li>
        ))}
      </ol>
    </section>
  );
}

function VerifyHelp() {
  return (
    <details className="wh-help">
      <summary>How your receiver checks the signature</summary>
      <ol>
        <li>
          Read the <code>X-Plotune-Signature</code> header: <code>t=&lt;unix seconds&gt;,v1=&lt;signature&gt;</code>.
        </li>
        <li>
          Compute HMAC-SHA256 of <code>&lt;t&gt;.&lt;raw request body&gt;</code>, using the whole secret as the key.
        </li>
        <li>Accept the delivery if the result matches any v1 value and t is less than 5 minutes old.</li>
      </ol>
      <pre>{`const expected = crypto.createHmac("sha256", secret)
  .update(t + ".").update(rawBody).digest("hex");`}</pre>
    </details>
  );
}

/**
 * Signing for one webhook. After a create or rotation it shows the new secret once;
 * otherwise it shows the state and lets an Owner or Admin set up or rotate the secret.
 */
export function WebhookSigningDialog({ webhook, secret = null, rotated = false, canManage = false, busy = false, error = null, onRotate, onClose }) {
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const field = useRef(null);
  useEffect(() => {
    if (secret) field.current?.select();
    setConfirming(false);
  }, [secret, webhook.id]);
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
      field.current?.select();
    }
  };
  const configured = !!webhook.signing?.configured;

  return (
    <Dialog title={secret ? "Signing secret" : "Webhook"} subtitle={`${webhook.eventName} → ${host(webhook.url)}`} onClose={onClose}>
      <div className="sw-detail-body wh-signing">
        {secret ? (
          <>
            <p className="wh-lead">Copy this secret now. It won't be shown again.</p>
            <div className="wh-secret">
              <input ref={field} aria-label="Signing secret" readOnly value={secret} onFocus={(e) => e.target.select()} />
              <button type="button" className="sw-button sw-primary" onClick={copy}>
                <FiCopy /> {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="wh-note" role="status">
              {copyFailed
                ? "Copy failed. The secret is selected; copy it with your keyboard."
                : rotated && webhook.signing?.previousUntil
                  ? `The previous secret also signs until ${utc(webhook.signing.previousUntil)}. Update your receiver before then.`
                  : "Add it to your receiver, then every delivery can be checked."}
            </p>
            <VerifyHelp />
            <div className="wh-actions">
              <button type="button" className="sw-button" onClick={onClose}>
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            {webhook.autoDisabled && (
              <p className="wh-off" role="status">
                Switched off after 20 failed deliveries in a row. Fix the receiver so it answers 2xx, then turn the webhook back on.
              </p>
            )}
            <p className="wh-lead">
              {configured
                ? "Deliveries carry an X-Plotune-Signature header your receiver can check."
                : "Deliveries to this webhook are not signed. Set up a secret so your receiver can check that requests come from Plotune."}
            </p>
            {configured && webhook.signing.previousUntil && (
              <p className="wh-note">The previous secret also signs until {utc(webhook.signing.previousUntil)}.</p>
            )}
            {configured && <VerifyHelp />}
            {error && (
              <p className="wh-error" role="alert">
                {error.code === "revision_conflict" ? "This webhook changed. Close this window and try again." : error.message}
              </p>
            )}
            {canManage &&
              (confirming ? (
                <div className="wh-confirm" role="group" aria-label="Confirm rotation">
                  <p>
                    A new secret signs from now on. The current one keeps working for 24 hours, then receivers using it
                    reject deliveries.
                  </p>
                  <div className="wh-actions">
                    <button type="button" className="sw-button" onClick={() => setConfirming(false)} disabled={busy}>
                      Cancel
                    </button>
                    <button type="button" className="sw-button sw-primary" onClick={onRotate} disabled={busy}>
                      {busy ? "Rotating…" : "Rotate secret"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="wh-actions">
                  <button
                    type="button"
                    className={`sw-button${configured ? "" : " sw-primary"}`}
                    disabled={busy}
                    onClick={configured ? () => setConfirming(true) : onRotate}
                  >
                    {configured ? "Rotate secret…" : busy ? "Setting up…" : "Set up signing"}
                  </button>
                </div>
              ))}
            <ChangeHistory audit={webhook.audit} />
          </>
        )}
      </div>
    </Dialog>
  );
}
