import React, { act } from "react";
import { createRoot } from "react-dom/client";
import WebhookDeliveries, { deliverySummary } from "./WebhookDeliveries";
let container, root;
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
test("reports distinguish outcomes and show next attempt only for queued work", () => {
  const base = { eventId: "event-1", attempts: 1, nextAt: "2026-10-20T00:00:00Z", statusCode: 204 };
  act(() => root.render(<WebhookDeliveries deliveries={[{ ...base, id: "done", status: "delivered" }, { ...base, id: "waiting", status: "pending", reason: "relay_daily_budget", statusCode: null }]} />));
  expect(container.textContent).toContain("Delivered"); expect(container.textContent).toContain("Receiver HTTP 204"); expect(container.textContent).toContain("Waiting for daily limit reset");
  expect(container.querySelectorAll("time")).toHaveLength(1); expect(container.querySelector('[role="region"]').tabIndex).toBe(0);
  expect(deliverySummary({ status: "pending", reason: "relay_unavailable" })).toBe("Waiting for delivery service");
});
test("loading and failure do not become empty-success messages", () => {
  act(() => root.render(<WebhookDeliveries deliveries={[]} loading />)); expect(container.textContent).toContain("Updating delivery status"); expect(container.textContent).not.toContain("No deliveries reported");
  act(() => root.render(<WebhookDeliveries deliveries={[]} error={new Error("Unavailable")} onRetry={() => {}} />)); expect(container.querySelector('[role="alert"]')).toBeTruthy(); expect(container.textContent).not.toContain("No deliveries reported");
});
