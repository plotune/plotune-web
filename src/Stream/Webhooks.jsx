import React, { useMemo, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Dialog, Empty, Panel } from "../StreamWorkspace/WorkspaceUI";
import {
  createWebhookRecord,
  validateWebhookDraft,
  webhookAuthSummary,
} from "./webhookModel";
import { signingLabel } from "./workspace/WebhookSigning";

const CUSTOM_EVENT = "__custom_event__";

export function AddWebhookDialog({ events, onClose, onCreate, discoveredEventNames }) {
  const eventNames = useMemo(
    () => discoveredEventNames || [...new Set(events.map((event) => event.event))].sort(),
    [events, discoveredEventNames],
  );
  const [creationId] = useState(() => `hook-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`);
  const [eventChoice, setEventChoice] = useState(eventNames[0] || CUSTOM_EVENT);
  const [customEvent, setCustomEvent] = useState("");
  const [url, setUrl] = useState("");
  const [authType, setAuthType] = useState("none");
  const [headerName, setHeaderName] = useState("Authorization");
  const [headerValue, setHeaderValue] = useState("");
  const [errors, setErrors] = useState({});
  const eventName = eventChoice === CUSTOM_EVENT ? customEvent : eventChoice;

  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const draft = { eventName, url, authType, headerName, headerValue };
    const nextErrors = validateWebhookDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try { await onCreate(createWebhookRecord(draft, creationId)); onClose(); } catch (cause) { setErrors({ submit: cause.message }); } finally { setBusy(false); }
  };

  return (
    <Dialog
      title="Add webhook"
      subtitle="Send one event type to an HTTPS endpoint."
      onClose={onClose}
    >
      <form className="sw-detail-body st-webhook-form" onSubmit={submit}>
        <label>
          Event
          <select
            value={eventChoice}
            onChange={(e) => setEventChoice(e.target.value)}
          >
            {eventNames.map((name) => <option key={name} value={name}>{name}</option>)}
            <option value={CUSTOM_EVENT}>Enter event name…</option>
          </select>
          {eventChoice === CUSTOM_EVENT && (
            <input
              autoFocus
              aria-label="Custom event name"
              placeholder="e.g. test.failed"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
            />
          )}
          {errors.eventName && <span className="st-webhook-error">{errors.eventName}</span>}
        </label>

        <label>
          Webhook URL
          <input
            type="url"
            placeholder="https://example.com/hooks/plotune"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {errors.url && <span className="st-webhook-error">{errors.url}</span>}
        </label>

        <label>
          Authentication
          <select value={authType} onChange={(e) => setAuthType(e.target.value)}>
            <option value="none">None</option>
            <option value="header">Header Auth</option>
          </select>
        </label>

        {authType === "header" && (
          <div className="st-webhook-auth-fields">
            <label>
              Header name
              <input
                placeholder="Authorization"
                value={headerName}
                onChange={(e) => setHeaderName(e.target.value)}
              />
              {errors.headerName && <span className="st-webhook-error">{errors.headerName}</span>}
            </label>
            <label>
              Header value
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Bearer token"
                value={headerValue}
                onChange={(e) => setHeaderValue(e.target.value)}
              />
              {errors.headerValue && <span className="st-webhook-error">{errors.headerValue}</span>}
            </label>
          </div>
        )}

        <p className="st-webhook-note">
          The complete Stream event is sent as JSON. Header credentials are kept separate from the event payload.
        </p>
        {errors.submit && <p role="alert">{errors.submit}</p>}
        <button className="sw-button sw-primary" type="submit" disabled={busy}>
          Add webhook
        </button>
      </form>
    </Dialog>
  );
}

function endpointHost(value) {
  try {
    return new URL(value).host;
  } catch {
    return value;
  }
}

export default function Webhooks({
  projectId,
  busy = false,
  discoveredEventNames,
  events,
  webhooks,
  onCreate,
  onToggle,
  onDelete,
  onSigning,
  readOnly = false,
}) {
  const [adding, setAdding] = useState(false);
  const action = readOnly ? null : (
    <button className="sw-button sw-primary st-webhook-add" onClick={() => setAdding(true)}>
      <FiPlus /> Add webhook
    </button>
  );

  return (
    <>
      <Panel
        title="Webhooks"
        meta={`${webhooks.length} configured`}
        action={webhooks.length ? action : null}
      >
        {webhooks.length === 0 ? (
          <Empty
            title={readOnly ? "No webhooks yet" : "Send events to any HTTP endpoint"}
            description={readOnly
              ? "Project owners and admins add webhooks. They will be listed here with their delivery status."
              : "Choose an event and forward its complete payload to an automation system, CI/CD bridge, agent, or your own service."}
            action={readOnly ? null : <button className="sw-button sw-primary" onClick={() => setAdding(true)}>Add webhook</button>}
          />
        ) : (
          <div className="st-webhook-list" aria-label={`Webhooks for project ${projectId}`}>
            {webhooks.map((webhook) => (
              <article className={`st-webhook-row${readOnly ? " is-read-only" : ""}`} key={webhook.id}>
                <div className="st-webhook-main">
                  <strong>{webhook.eventName}</strong>
                  <code title={webhook.url}>{endpointHost(webhook.url)}</code>
                  <span>{webhook.url}</span>
                </div>
                <span className="st-webhook-auth">
                  {webhookAuthSummary(webhook)}
                  {onSigning && (
                    <button
                      type="button"
                      className={`st-webhook-signing${webhook.signing?.configured ? "" : " is-unsigned"}`}
                      aria-label={`Signing for ${webhook.eventName}: ${signingLabel(webhook)}`}
                      onClick={() => onSigning(webhook.id)}
                    >
                      {signingLabel(webhook)}
                    </button>
                  )}
                </span>
                {readOnly ? (
                  <span className={`st-webhook-enabled${webhook.autoDisabled ? " is-auto-off" : ""}`}>
                    {webhook.enabled ? "Enabled" : webhook.autoDisabled ? "Switched off · failing" : "Disabled"}
                  </span>
                ) : (
                  <>
                    <label className={`st-webhook-enabled${webhook.autoDisabled ? " is-auto-off" : ""}`}>
                      <input
                        type="checkbox"
                        disabled={busy}
                        checked={webhook.enabled}
                        aria-label={`Enable webhook for ${webhook.eventName}`}
                        onChange={() => onToggle(webhook.id)}
                      />
                      {webhook.enabled ? "Enabled" : webhook.autoDisabled ? "Switched off · failing" : "Disabled"}
                    </label>
                    <button
                      className="sw-icon-button"
                      disabled={busy}
                      aria-label={`Delete webhook for ${webhook.eventName}`}
                      onClick={() => onDelete(webhook.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </Panel>
      {adding && !readOnly && (
        <AddWebhookDialog
          key={projectId}
          events={events}
          discoveredEventNames={discoveredEventNames}
          onClose={() => setAdding(false)}
          onCreate={onCreate}
        />
      )}
    </>
  );
}
