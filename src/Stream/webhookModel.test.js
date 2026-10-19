import {
  canonicalWebhookPayload,
  createWebhookRecord,
  validateWebhookDraft,
  webhookAuthSummary,
  webhookMatchesEvent,
} from "./webhookModel";

const event = {
  id: "evt_01abc",
  event: "test.failed",
  timestamp: "2026-10-07T14:32:18Z",
  properties: { bench: "hil-03", reason: "CAN timeout", nested: { attempt: 2 } },
  apiKey: "must-not-leak",
};

test("canonical webhook payload preserves the generic event and arbitrary properties only", () => {
  expect(canonicalWebhookPayload(event)).toEqual({
    id: "evt_01abc",
    event: "test.failed",
    timestamp: "2026-10-07T14:32:18Z",
    properties: event.properties,
  });
});

test("webhook event matching is exact and disabled hooks do not qualify", () => {
  const webhook = { eventName: "test.failed", enabled: true };
  expect(webhookMatchesEvent(webhook, event)).toBe(true);
  expect(webhookMatchesEvent(webhook, { ...event, event: "test.failed.retry" })).toBe(false);
  expect(webhookMatchesEvent({ ...webhook, enabled: false }, event)).toBe(false);
});

test("Header Auth stays separate from the canonical event payload and list summary", () => {
  const record = createWebhookRecord({
    eventName: "test.failed",
    url: "https://example.com/hooks/stream",
    authType: "header",
    headerName: "Authorization",
    headerValue: "Bearer top-secret",
  }, "hook-test");
  expect(record.auth).toEqual({ type: "header", name: "Authorization", value: "Bearer top-secret" });
  expect(webhookAuthSummary(record)).toBe("Header auth · Authorization");
  expect(canonicalWebhookPayload(event)).not.toHaveProperty("auth");
  expect(canonicalWebhookPayload(event)).not.toHaveProperty("headerValue");
  expect(canonicalWebhookPayload(event)).not.toHaveProperty("apiKey");
});

test("draft validation requires a valid HTTPS URL and complete optional header credentials", () => {
  expect(validateWebhookDraft({
    eventName: "test.failed",
    url: "http://example.com/hook",
    authType: "header",
    headerName: "",
    headerValue: "",
  })).toEqual({
    url: "Enter an HTTPS endpoint URL.",
    headerName: "Enter a header name.",
    headerValue: "Enter a header value.",
  });
  expect(validateWebhookDraft({
    eventName: "test.failed",
    url: "https://example.com/hook",
    authType: "none",
  })).toEqual({});
});
