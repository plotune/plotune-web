import React, { act } from "react";
import { createRoot } from "react-dom/client";
import WebhookSigningSecret from "./WebhookSigningSecret";

let container, root;
const secret = { id: "hook", eventName: "motor.sample", url: "https://motor.example.com/receiver", value: "a1".repeat(32), previousExpiresAt: "2026-10-20T00:00:00Z" };
const button = name => [...container.querySelectorAll("button")].find(b => b.textContent === name || b.getAttribute("aria-label") === name);
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
test("one-time secret identifies its webhook, focuses the next task and distinguishes the copy action", async () => {
  const writeText = jest.fn().mockResolvedValue();
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  const dismiss = jest.fn();
  act(() => root.render(<WebhookSigningSecret secret={secret} onDismiss={dismiss} />));
  expect(container.textContent).toContain(secret.eventName); expect(container.textContent).toContain(secret.url);
  expect(document.activeElement).toBe(container.querySelector("h2 span"));
  const field = container.querySelector("input"); expect(field.type).toBe("password"); expect(field.readOnly).toBe(true);
  expect(button("Copy signing secret").classList.contains("sw-primary")).toBe(true);
  await act(async () => button("Copy signing secret").click());
  expect(writeText).toHaveBeenCalledWith(secret.value); expect(button("Copied")).toBeTruthy(); expect(container.querySelector('[role="status"]').textContent).toContain("Secret copied");
  expect(JSON.stringify({ localStorage, sessionStorage })).not.toContain(secret.value);
  act(() => button("I saved the secret").click()); expect(dismiss).toHaveBeenCalled();
});
test("clipboard failure explains manual recovery and reveal is a labeled, pressed control", async () => {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: jest.fn().mockRejectedValue(new Error("denied")) } });
  act(() => root.render(<WebhookSigningSecret secret={secret} onDismiss={() => {}} />));
  await act(async () => button("Copy signing secret").click()); expect(container.querySelector('[role="alert"]').textContent).toContain("select and copy");
  act(() => button("Show signing secret").click()); expect(container.querySelector("input").type).toBe("text"); expect(button("Hide signing secret").getAttribute("aria-pressed")).toBe("true");
  act(() => button("Hide signing secret").click()); expect(container.querySelector("input").type).toBe("password");
});
test("focus waits for an open editor and resumes after editor close; busy verification cannot dismiss the secret", () => {
  const dialog = document.createElement("dialog"); dialog.setAttribute("open", ""); document.body.appendChild(dialog);
  act(() => root.render(<WebhookSigningSecret secret={secret} onDismiss={() => {}} busy />));
  expect(button("I saved the secret").disabled).toBe(true);
  dialog.remove();
  act(() => root.render(<WebhookSigningSecret secret={secret} onDismiss={() => {}} focusVersion={1} />));
  expect(document.activeElement).toBe(container.querySelector("h2 span")); expect(button("I saved the secret").disabled).toBe(false);
});
test("long destinations stay inspectable without pushing the save action below their full path", () => {
  const url = "https://automation.example.com/" + "long-destination-".repeat(18);
  act(() => root.render(<WebhookSigningSecret secret={{ ...secret, url }} onDismiss={() => {}} />));
  const destination = container.querySelector('.live-hook-destination');
  expect(destination.open).toBe(false); expect(destination.querySelector('code').textContent).toBe(url);
  expect(button('Copy signing secret')).toBeTruthy();
});
