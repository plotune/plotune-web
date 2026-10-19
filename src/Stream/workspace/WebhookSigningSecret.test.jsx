import React, { act } from "react";
import { createRoot } from "react-dom/client";
import WebhookSigningSecret from "./WebhookSigningSecret";
import Webhooks from "../Webhooks";

let container, root;
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
test("signing secret is a read-only password field, can be copied and dismissed, and never enters browser storage", async () => {
  const writeText = jest.fn().mockResolvedValue();
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  const dismiss = jest.fn(), value = "a1".repeat(32);
  act(() => root.render(<WebhookSigningSecret secret={{ value, previousExpiresAt: "2026-10-20T00:00:00Z" }} onDismiss={dismiss} />));
  const field = container.querySelector("input"); expect(field.type).toBe("password"); expect(field.readOnly).toBe(true);
  expect(container.textContent).toContain("shown once"); expect(container.textContent).toContain("previous secret");
  await act(async () => [...container.querySelectorAll("button")].find(b => b.textContent === "Copy signing secret").click());
  expect(writeText).toHaveBeenCalledWith(value); expect(container.querySelector('[role="status"]').textContent).toBe("Secret copied.");
  expect(JSON.stringify({ localStorage, sessionStorage })).not.toContain(value);
  act(() => [...container.querySelectorAll("button")].find(b => b.textContent === "I saved the secret").click()); expect(dismiss).toHaveBeenCalled();
});
test("clipboard failure stays visible and permits manual copying", async () => {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: jest.fn().mockRejectedValue(new Error("denied")) } });
  act(() => root.render(<WebhookSigningSecret secret={{ value: "b2".repeat(32) }} onDismiss={() => {}} />));
  await act(async () => [...container.querySelectorAll("button")].find(b => b.textContent === "Copy signing secret").click()); expect(container.textContent).toContain("copy it manually");
  act(() => [...container.querySelectorAll("button")].find(b => b.textContent === "Show signing secret").click());expect(container.querySelector("input").type).toBe("text");
});
test("live webhooks expose setup/rotation actions while the demo keeps its existing controls", () => {
  const hook = { id: "h", eventName: "motor.sample", url: "https://hooks.example.com/x", enabled: true, auth: { type: "none" } }, rotate = jest.fn();
  const props = { projectId: "p", events: [], webhooks: [hook], onCreate: jest.fn(), onDelete: jest.fn(), onToggle: jest.fn() };
  act(() => root.render(<Webhooks {...props} onRotateSigning={rotate} />));
  act(() => [...container.querySelectorAll("button")].find(b => b.textContent === "Set up signing").click()); expect(rotate).toHaveBeenCalledWith(hook);
  act(() => root.render(<Webhooks {...props} />)); expect(container.textContent).not.toContain("Set up signing");
});
