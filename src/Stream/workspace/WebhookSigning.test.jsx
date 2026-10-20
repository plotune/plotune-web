import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Webhooks from "../Webhooks";
import { WebhookSigningDialog, signingLabel } from "./WebhookSigning";

let container, root;
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function close() { this.removeAttribute("open"); };
});
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });
const render = (element) => act(async () => root.render(element));
const buttons = () => [...container.querySelectorAll("button")].map((b) => b.textContent.trim());
const click = (text) => act(async () => [...container.querySelectorAll("button")].find((b) => b.textContent.trim() === text).click());

const signed = { id: "ci", eventName: "alarm", url: "https://ci.example.com/in?token=t", enabled: true, auth: { type: "header", name: "X-Api-Key", value: "" }, signing: { configured: true, previousUntil: null } };
const legacy = { id: "old", eventName: "motor", url: "https://old.example.com/in", enabled: false, auth: { type: "none" }, signing: { configured: false, previousUntil: null } };

test("members see webhooks with their full URL and signing state, and nothing to change", async () => {
  const onSigning = jest.fn();
  await render(<Webhooks projectId="p" events={[]} webhooks={[signed, legacy]} readOnly onSigning={onSigning} />);
  expect(container.textContent).toContain("https://ci.example.com/in?token=t");
  expect(container.textContent).toContain("Header auth · X-Api-Key");
  expect(buttons()).toEqual(["Signed", "Not signed"]);
  expect(container.querySelector('input[type="checkbox"]')).toBeNull();
  expect(container.textContent).toContain("Disabled");
  await click("Not signed");
  expect(onSigning).toHaveBeenCalledWith("old");
  await render(<Webhooks projectId="p" events={[]} webhooks={[]} readOnly />);
  expect(container.textContent).toContain("Project owners and admins add webhooks");
  expect(buttons()).toEqual([]);
});

test("Owners and Admins keep add, toggle and delete next to the signing state", async () => {
  await render(<Webhooks projectId="p" events={[]} webhooks={[signed]} onSigning={() => {}} onToggle={() => {}} onDelete={() => {}} onCreate={() => {}} />);
  expect(buttons()).toEqual(["Add webhook", "Signed", ""]);
  expect(container.querySelector('input[type="checkbox"]')).not.toBeNull();
  expect(signingLabel({ signing: { configured: true, previousUntil: "2026-10-20T10:00:00.000Z" } })).toBe("Signed · rotating");
  expect(signingLabel({})).toBe("Not signed");
});

test("a new secret is shown once, selected, with copy feedback and the rotation deadline", async () => {
  const writeText = jest.fn(async () => {});
  Object.assign(navigator, { clipboard: { writeText } });
  const onClose = jest.fn();
  const rotating = { ...signed, signing: { configured: true, previousUntil: "2026-10-20T10:00:00.000Z" } };
  await render(<WebhookSigningDialog webhook={rotating} secret="whsec_abc" rotated canManage onClose={onClose} />);
  const field = container.querySelector('input[aria-label="Signing secret"]');
  expect(field.value).toBe("whsec_abc");
  expect(container.textContent).toContain("Copy this secret now. It won't be shown again.");
  expect(container.textContent).toContain("The previous secret also signs until 20 Oct 2026, 10:00 UTC");
  expect(container.textContent).not.toContain("Rotate secret");
  await click("Copy");
  expect(writeText).toHaveBeenCalledWith("whsec_abc");
  expect(buttons()).toContain("Copied");
  await click("Done");
  expect(onClose).toHaveBeenCalled();
});

test("rotation asks for confirmation; setting up a first secret does not", async () => {
  const onRotate = jest.fn();
  await render(<WebhookSigningDialog webhook={signed} canManage onRotate={onRotate} onClose={() => {}} />);
  await click("Rotate secret…");
  expect(onRotate).not.toHaveBeenCalled();
  expect(container.querySelector('[aria-label="Confirm rotation"]').textContent).toContain("keeps working for 24 hours");
  await click("Cancel");
  expect(buttons()).toContain("Rotate secret…");
  await click("Rotate secret…");
  await click("Rotate secret");
  expect(onRotate).toHaveBeenCalledTimes(1);

  await render(<WebhookSigningDialog webhook={legacy} canManage onRotate={onRotate} onClose={() => {}} />);
  expect(container.textContent).toContain("Deliveries to this webhook are not signed.");
  await click("Set up signing");
  expect(onRotate).toHaveBeenCalledTimes(2);

  await render(<WebhookSigningDialog webhook={legacy} canManage error={{ code: "revision_conflict", message: "x" }} onRotate={onRotate} onClose={() => {}} />);
  expect(container.querySelector('[role="alert"]').textContent).toBe("This webhook changed. Close this window and try again.");
});

test("members read the signing state and how to verify, without actions", async () => {
  await render(<WebhookSigningDialog webhook={signed} onClose={() => {}} />);
  expect(container.textContent).toContain("X-Plotune-Signature");
  expect(container.querySelector("details summary").textContent).toBe("How your receiver checks the signature");
  expect(buttons().filter((b) => b !== "")).toEqual([]);
});

test("Owners and Admins see who changed the webhook; a switched-off webhook says why", async () => {
  const audit = [
    { at: "2026-10-20T09:00:00.000Z", by: "Plotune", via: "auto", action: "auto_disabled" },
    { at: "2026-10-19T10:00:00.000Z", by: "carol@example.test", via: "mcp", client: "Claude", action: "updated" },
    { at: "2026-10-18T10:00:00.000Z", by: "alice@example.test", via: "workspace", action: "created" },
  ];
  const off = { ...signed, enabled: false, autoDisabled: true, audit };
  await render(<WebhookSigningDialog webhook={off} canManage onRotate={() => {}} onClose={() => {}} />);
  expect(container.querySelector("#sw-dialog-title").textContent).toBe("Webhook");
  expect(container.querySelector(".wh-off").textContent).toContain("Switched off after 20 failed deliveries in a row");
  const items = [...container.querySelectorAll(".wh-history li")].map((li) => li.textContent);
  expect(items[0]).toContain("Switched off after 20 failed deliveries in a row");
  expect(items[0]).toContain("Plotune automatically");
  expect(items[1]).toContain("Changedcarol@example.test via Claude");
  expect(items[2]).toContain("alice@example.test in the workspace");
  // Members receive no history and see only the switch-off.
  await render(<Webhooks projectId="p" events={[]} webhooks={[{ ...off, audit: undefined }]} readOnly onSigning={() => {}} />);
  expect(container.textContent).toContain("Switched off · failing");
});
