export function canonicalWebhookPayload(event) {
  return {
    id: event.id,
    event: event.event,
    timestamp: event.timestamp,
    properties: event.properties,
  };
}

export function webhookMatchesEvent(webhook, event) {
  return Boolean(webhook.enabled && webhook.eventName === event.event);
}

export function webhookAuthSummary(webhook) {
  if (webhook.auth?.type !== "header") return "No authentication";
  return `Header auth · ${webhook.auth.name}`;
}

export function validateWebhookDraft(draft) {
  const errors = {};
  if (!draft.eventName?.trim()) errors.eventName = "Choose an event name.";
  try {
    const url = new URL(draft.url);
    if (url.protocol !== "https:") errors.url = "Enter an HTTPS endpoint URL.";
  } catch {
    errors.url = "Enter a valid HTTPS endpoint URL.";
  }
  if (draft.authType === "header") {
    if (!draft.headerName?.trim()) errors.headerName = "Enter a header name.";
    if (!draft.headerValue?.trim()) errors.headerValue = "Enter a header value.";
  }
  return errors;
}

export function createWebhookRecord(draft, id = `hook-${Date.now()}`) {
  return {
    id,
    eventName: draft.eventName.trim(),
    url: draft.url.trim(),
    enabled: true,
    auth: draft.authType === "header"
      ? { type: "header", name: draft.headerName.trim(), value: draft.headerValue }
      : { type: "none" },
  };
}
