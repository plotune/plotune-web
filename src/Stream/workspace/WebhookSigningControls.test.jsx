import React, { act } from "react";
import { createRoot } from "react-dom/client";
import WebhookSigningControls from "./WebhookSigningControls";
import Webhooks from "../Webhooks";
let root, container;
const hook = { id: "hook", eventName: "motor.sample", url: "https://motor.example.com/receiver", signingConfigured: true, enabled: true, auth: { type: "none" } };
const button = name => [...container.querySelectorAll("button")].find(b => b.textContent === name);
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
test("rotation is disclosed, contextual and cancellable without a request; Escape restores its trigger", () => {
  const rotate = jest.fn(); act(() => root.render(<WebhookSigningControls webhook={hook} onRotate={rotate} />));
  const details = container.querySelector("details"), summary = container.querySelector("summary"); expect(details.open).toBe(false);
  act(() => { details.open = true; }); expect(container.textContent).toContain("24 hours"); expect(container.textContent).toContain(hook.eventName);
  act(() => button("Cancel").click()); expect(details.open).toBe(false); expect(document.activeElement).toBe(summary); expect(rotate).not.toHaveBeenCalled();
  act(() => { details.open = true; details.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
  expect(details.open).toBe(false); expect(document.activeElement).toBe(summary);
});
test("initial setup acknowledges immediately, prevents duplicate writes and resolves focus to the current trigger", async () => {
  let finish; const rotate = jest.fn(() => new Promise(resolve => { finish = resolve; }));
  act(() => root.render(<WebhookSigningControls webhook={{ ...hook, signingConfigured: false }} onRotate={rotate} />));
  await act(async () => button("Set up signing").click());
  expect(button("Creating secret…").disabled).toBe(true); expect(rotate).toHaveBeenCalledTimes(1);
  const getTrigger = rotate.mock.calls[0][1]; expect(getTrigger()).toBe(button("Creating secret…"));
  await act(async () => finish());
  act(() => root.render(<WebhookSigningControls webhook={hook} onRotate={rotate} />)); expect(getTrigger()).toBe(container.querySelector("summary"));
});
test("a conflict is visible next to the action; an unsaved secret blocks replacement", async () => {
  const rotate = jest.fn().mockRejectedValue(new Error("Refresh shared settings before retrying."));
  act(() => root.render(<WebhookSigningControls webhook={hook} onRotate={rotate} />));
  await act(async () => button("Create new secret").click()); expect(container.querySelector('[role="alert"]').textContent).toContain("Refresh shared settings");
  act(() => root.render(<WebhookSigningControls webhook={hook} onRotate={rotate} pendingSecret />));
  expect(button("Create new secret").disabled).toBe(true); expect(container.textContent).toContain("Save the new secret above");
});
test("shared demo controls do not expose signing actions", () => {
  act(() => root.render(<Webhooks projectId="p" events={[]} webhooks={[hook]} onCreate={() => {}} onDelete={() => {}} onToggle={() => {}} />));
  expect(container.querySelector("details")).toBe(null); expect(container.textContent).not.toContain("Signing required");
});
test("a confirmed secret advances past rotation even when shared-settings verification fails", async () => {
  const failure = Object.assign(new Error('Verification failed'), { signingSecretReceived: true });
  act(() => root.render(<WebhookSigningControls webhook={hook} onRotate={() => Promise.reject(failure)} />));
  container.querySelector('details').open = true;
  await act(async () => button('Create new secret').click());
  expect(container.querySelector('details').open).toBe(false);
  expect(container.querySelector('[role="alert"]')).toBe(null);
});
