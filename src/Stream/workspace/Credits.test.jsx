import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { AddCreditsDialog, CreditsSummary, monthlyLeft } from "./Credits";
import { StreamFailure } from "./client";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function close() { this.removeAttribute("open"); };
});

function mount(element) {
  const container = document.createElement("div"), root = createRoot(container);
  document.body.appendChild(container);
  return { container, render: (el = element) => act(async () => root.render(el)),
    unmount: () => { act(() => root.unmount()); container.remove(); } };
}
const flush = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });
const usage = (overrides = {}) => ({
  unit: "credits", month: "2026-10", day: "2026-10-19",
  monthly: { used: 24000, allowance: 30000, resetsAt: "2026-11-01T00:00:00.000Z" },
  daily: { used: 120.2, limit: 3000, resetsAt: "2026-10-20T00:00:00.000Z" },
  added: { balance: 0, granted: 0, spent: 0 }, available: 2879.8,
  prices: { event: 0.2, webhookDelivery: 15, analysisJobPerDay: 20, toolCall: 1 }, scope: "project-owner-account", ...overrides,
});

test("summary shows monthly credits left, today's spend and one action; added credits only when there are some", async () => {
  const onAdd = jest.fn();
  const view = mount(<CreditsSummary usage={usage()} onAdd={onAdd} />);
  await view.render();
  const text = view.container.textContent;
  expect(text).toContain("Monthly credits");
  expect(text).toContain("6,000 left");
  expect(text).toContain("121 / 3,000");
  expect(text).not.toContain("Added credits");
  expect(view.container.querySelector(".cr-meter i").className).toBe("cr-near");
  expect(view.container.querySelectorAll("button")).toHaveLength(1);
  await act(async () => view.container.querySelector("button").click());
  expect(onAdd).toHaveBeenCalled();
  await view.render(<CreditsSummary usage={usage({ monthly: { used: 30000, allowance: 30000 }, added: { balance: 50000, granted: 50000, spent: 0 } })} onAdd={onAdd} />);
  expect(view.container.textContent).toContain("0 left");
  expect(view.container.textContent).toContain("Added credits50,000");
  expect(view.container.querySelector(".cr-meter i").className).toBe("cr-full");
  expect(monthlyLeft(usage({ monthly: { used: 31000, allowance: 30000 } }))).toBe(0);
  view.unmount();
});

test("redeeming a code adds credits and lists the grant; refusals read in plain words", async () => {
  let grants = [];
  const client = {
    credits: jest.fn(async () => ({ unit: "credits", granted: 0, grants })),
    redeem: jest.fn(async (code) => {
      if (code === "USED") throw new StreamFailure(409, "promo_already_redeemed", "You have already used this code");
      if (code === "GONE") throw new StreamFailure(410, "promo_expired", "This code has expired");
      const grant = { id: "g1", credits: 50000, source: "promo", createdAt: "2026-10-19T10:00:00.000Z" };
      grants = [grant];
      return { grant };
    }),
  };
  const onRedeemed = jest.fn();
  const view = mount(<AddCreditsDialog client={client} initialCode="LAUNCH50" onClose={() => {}} onRedeemed={onRedeemed} />);
  await view.render(); await flush();
  const input = view.container.querySelector("#cr-code");
  expect(input.value).toBe("LAUNCH50");
  expect(document.activeElement).toBe(input);
  const submit = () => act(async () => view.container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  await submit(); await flush();
  expect(client.redeem).toHaveBeenCalledWith("LAUNCH50");
  expect(onRedeemed).toHaveBeenCalled();
  expect(view.container.querySelector('[role="status"]').textContent).toBe("Added 50,000 credits to your account.");
  expect(view.container.querySelector(".cr-ledger").textContent).toContain("Promo code");
  expect(view.container.querySelector(".cr-ledger").textContent).toContain("+50,000");
  for (const [code, message] of [["USED", "You've already used this code on your account."], ["GONE", "This code has expired."]]) {
    const field = view.container.querySelector("#cr-code");
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(field, code);
      field.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await submit(); await flush();
    expect(view.container.querySelector('[role="alert"]').textContent).toBe(message);
  }
  view.unmount();
});

test("redeem is disabled until a code is long enough", async () => {
  const client = { credits: jest.fn(async () => ({ granted: 0, grants: [] })), redeem: jest.fn() };
  const view = mount(<AddCreditsDialog client={client} onClose={() => {}} />);
  await view.render(); await flush();
  expect(view.container.querySelector('button[type="submit"]').disabled).toBe(true);
  view.unmount();
});
