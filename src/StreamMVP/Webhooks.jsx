import React, { useMemo, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Dialog, Empty, Panel } from "../StreamWorkspace/WorkspaceUI";
import {
  createWebhookRecord,
  validateWebhookDraft,
  webhookAuthSummary,
} from "./webhookModel";

const CUSTOM_EVENT = "__custom_event__";

function AddWebhookDialog({ events, onClose, onCreate }) {
  const eventNames = useMemo(
    () => [...new Set(events.map((event) => event.event))].sort(),
    [events],
  );
  const [eventChoice, setEventChoice] = useState(eventNames[0] || CUSTOM_EVENT);
  const [customEvent, setCustomEvent] = useState("");
  const [url, setUrl] = useState("");
  const [authType, setAuthType] = useState("none");
  const [headerName, setHeaderName] = useState("Authorization");
  const [headerValue, setHeaderValue] = useState("");
  const [errors, setErrors] = useState({});
  const eventName = eventChoice === CUSTOM_EVENT ? customEvent : eventChoice;

  const submit = (e) => {
    e.preventDefault();
    const draft = { eventName, url, authType, headerName, headerValue };
    const nextErrors = validateWebhookDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onCreate(createWebhookRecord(draft));
    onClose();
  };

  return (
    <Dialog
      title="Add webhook"
      subtitle="Send one event type to an HTTPS endpoint."
      onClose={onClose}
    >
      <form className="sw-detail-body mvp-webhook-form" onSubmit={submit}>
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
          {errors.eventName && <span className="mvp-webhook-error">{errors.eventName}</span>}
        </label>

        <label>
          Webhook URL
          <input
            type="url"
            placeholder="https://example.com/hooks/plotune"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {errors.url && <span className="mvp-webhook-error">{errors.url}</span>}
        </label>

        <label>
          Authentication
          <select value={authType} onChange={(e) => setAuthType(e.target.value)}>
            <option value="none">None</option>
            <option value="header">Header Auth</option>
          </select>
        </label>

        {authType === "header" && (
          <div className="mvp-webhook-auth-fields">
            <label>
              Header name
              <input
                placeholder="Authorization"
                value={headerName}
                onChange={(e) => setHeaderName(e.target.value)}
              />
              {errors.headerName && <span className="mvp-webhook-error">{errors.headerName}</span>}
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
              {errors.headerValue && <span className="mvp-webhook-error">{errors.headerValue}</span>}
            </label>
          </div>
        )}

        <p className="mvp-webhook-note">
          The complete Stream event is sent as JSON. Header credentials are kept separate from the event payload.
        </p>
        <button className="sw-button sw-primary" type="submit">
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
  events,
  webhooks,
  onCreate,
  onToggle,
  onDelete,
}) {
  const [adding, setAdding] = useState(false);
  const action = (
    <button className="sw-button sw-primary mvp-webhook-add" onClick={() => setAdding(true)}>
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
            title="Send events to any HTTP endpoint"
            description="Choose an event and forward its complete payload to an automation system, CI/CD bridge, agent, or your own service."
            action={<button className="sw-button sw-primary" onClick={() => setAdding(true)}>Add webhook</button>}
          />
        ) : (
          <div className="mvp-webhook-list" aria-label={`Webhooks for project ${projectId}`}>
            {webhooks.map((webhook) => (
              <article className="mvp-webhook-row" key={webhook.id}>
                <div className="mvp-webhook-main">
                  <strong>{webhook.eventName}</strong>
                  <code title={webhook.url}>{endpointHost(webhook.url)}</code>
                  <span>{webhook.url}</span>
                </div>
                <span className="mvp-webhook-auth">{webhookAuthSummary(webhook)}</span>
                <label className="mvp-webhook-enabled">
                  <input
                    type="checkbox"
                    checked={webhook.enabled}
                    aria-label={`Enable webhook for ${webhook.eventName}`}
                    onChange={() => onToggle(webhook.id)}
                  />
                  {webhook.enabled ? "Enabled" : "Disabled"}
                </label>
                <button
                  className="sw-icon-button"
                  aria-label={`Delete webhook for ${webhook.eventName}`}
                  onClick={() => onDelete(webhook.id)}
                >
                  <FiTrash2 />
                </button>
              </article>
            ))}
          </div>
        )}
      </Panel>
      {adding && (
        <AddWebhookDialog
          key={projectId}
          events={events}
          onClose={() => setAdding(false)}
          onCreate={onCreate}
        />
      )}
    </>
  );
}
