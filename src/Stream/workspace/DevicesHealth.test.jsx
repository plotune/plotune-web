import React, { act } from "react";
import { createRoot } from "react-dom/client";
import DevicesHealth, { deviceState, relative } from "./DevicesHealth";
import { StreamFailure } from "./client";

const now = Date.parse("2026-10-19T12:00:00.000Z");
const ago = (minutes) => new Date(now - minutes * 60000).toISOString();
const project = { id: "p", name: "Line B" };

// jsdom has no <dialog> modal API; the workspace Dialog only needs these two calls.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function close() { this.removeAttribute("open"); };
});
beforeEach(() => jest.spyOn(Date, "now").mockReturnValue(now));
afterEach(() => jest.restoreAllMocks());

function mount(client) {
  const container = document.createElement("div"), root = createRoot(container);
  document.body.appendChild(container);
  return { container, render: () => act(async () => root.render(<DevicesHealth client={client} project={project} />)),
    unmount: () => { act(() => root.unmount()); container.remove(); } };
}
const flush = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });
const button = (container, text) => [...container.querySelectorAll("button")].find((b) => b.textContent === text || b.getAttribute("aria-label") === text);

const issue = { id: "device_silent:m-2", kind: "device_silent", severity: "warning", subject: "m-2", summary: "Device m-2 has sent no events for 3 hours.", observedAt: ago(180) };
const quota = { id: "quota_daily", kind: "quota_daily", severity: "critical", subject: null, summary: "The account's daily event allowance is used up; new captures are refused until it resets.", observedAt: ago(0) };
const devices = (items, nextAfter = null, total = items.length) => ({ projectId: "p", asOf: ago(0), items, nextAfter, total, truncated: false, lastCaptureAt: ago(5) });
const minute = (id, minutes) => ({ deviceId: id, lastSeenAt: ago(minutes), lastSeenDay: ago(minutes).slice(0, 10), precision: "minute" });

test("device state: active, quiet, inactive and day-only stamps", () => {
  expect(deviceState(minute("a", 5), now)).toEqual({ label: "Active", tone: "good" });
  expect(deviceState(minute("b", 180), now)).toEqual({ label: "Quiet", tone: "warn" });
  expect(deviceState(minute("c", 9 * 24 * 60), now)).toEqual({ label: "Inactive", tone: "neutral" });
  expect(deviceState({ deviceId: "d", lastSeenAt: null, lastSeenDay: "2026-10-17", precision: "day" }, now)).toEqual({ label: "Seen 2026-10-17", tone: "neutral" });
  expect([relative(ago(0), now), relative(ago(3), now), relative(ago(180), now), relative(ago(3 * 1440), now)]).toEqual(["just now", "3 min ago", "3 h ago", "3 days ago"]);
});

test("shows issues most severe first with details on request, and devices with their state", async () => {
  const client = {
    health: jest.fn(async (_id, { issueId } = {}) => issueId
      ? { projectId: "p", asOf: ago(0), issue: { ...issue, evidence: { lastSeenAt: ago(180), silentAfterMinutes: 60 }, nextSteps: ["Check the device's power, network and capture client logs."] } }
      : { projectId: "p", asOf: ago(0), issues: [quota, issue], counts: { critical: 1, warning: 1, info: 0 } }),
    devices: jest.fn(async () => devices([minute("m-1", 3), minute("m-2", 180)])),
    diagnose: jest.fn(),
  };
  const view = mount(client);
  await view.render(); await flush();
  const rows = [...view.container.querySelectorAll(".dh-issues li")].map((li) => li.textContent);
  expect(rows[0]).toMatch(/^Critical.*allowance is used up/);
  expect(rows[1]).toMatch(/^Warning.*m-2/);
  // Glance level holds no raw identifiers or backend codes.
  expect(view.container.textContent).not.toMatch(/quota_daily|device_silent|webhook_failing/);
  const states = [...view.container.querySelectorAll(".dh-devices tbody tr")].map((tr) => [tr.querySelector("code").textContent, tr.querySelector(".sw-badge").textContent]);
  expect(states).toEqual([["m-1", "Active"], ["m-2", "Quiet"]]);
  await act(async () => [...view.container.querySelectorAll(".dh-issues button")][1].click());
  await flush();
  expect(client.health).toHaveBeenLastCalledWith("p", { issueId: "device_silent:m-2" });
  const dialog = view.container.querySelector("dialog");
  expect(dialog.querySelector("h2").textContent).toBe("Quiet device");
  expect(dialog.textContent).toContain("Last event");
  expect(dialog.textContent).toContain("Quiet after (minutes)60");
  expect(dialog.textContent).toContain("What to do");
  view.unmount();
});

test("no issues reads as all clear; empty projects explain how devices appear", async () => {
  const client = { health: jest.fn(async () => ({ projectId: "p", asOf: ago(0), issues: [] })), devices: jest.fn(async () => devices([])), diagnose: jest.fn() };
  const view = mount(client);
  await view.render(); await flush();
  expect(view.container.textContent).toContain("No active issues");
  expect(view.container.textContent).toContain("No devices yet");
  expect(view.container.textContent).toContain("after they send an event with a device_id");
  view.unmount();
});

test("device check shows the verdict and each step in plain words", async () => {
  const client = {
    health: jest.fn(async () => ({ projectId: "p", asOf: ago(0), issues: [] })),
    devices: jest.fn(async () => devices([minute("m-2", 180)])),
    diagnose: jest.fn(async () => ({ projectId: "p", asOf: ago(0), deviceId: "m-2", verdict: "degraded",
      checks: [{ id: "project_settings", status: "pass", summary: "The runtime has current project settings, so the project key resolves." },
        { id: "device", status: "warn", summary: "Device last seen at 2026-10-19T09:00:00.000Z." }],
      nextSteps: ["Check the device's power, network and capture client logs."], limits: [] })),
  };
  const view = mount(client);
  await view.render(); await flush();
  await act(async () => button(view.container, "Check device m-2").click());
  await flush();
  expect(client.diagnose).toHaveBeenCalledWith("p", "m-2");
  const dialog = view.container.querySelector("dialog");
  expect(dialog.textContent).toContain("Needs attention");
  expect([...dialog.querySelectorAll(".dh-checks li")].map((li) => li.className)).toEqual(["dh-check-pass", "dh-check-warn"]);
  expect(dialog.textContent).toContain("Project settings");
  // Exact UTC times from the server read as local time and age.
  expect(dialog.textContent).not.toMatch(/\d{4}-\d{2}-\d{2}T/);
  expect(dialog.textContent).toContain("(3 h ago)");
  expect(dialog.textContent).toContain("This device");
  view.unmount();
});

test("pages through devices and reports a cleared issue kindly", async () => {
  const client = {
    health: jest.fn(async (_id, { issueId } = {}) => {
      if (issueId) throw new StreamFailure(404, "not_found", "Health issue is not active");
      return { projectId: "p", asOf: ago(0), issues: [issue] };
    }),
    devices: jest.fn(async (_id, { after }) => after ? devices([minute("m-3", 30)], null, 3) : devices([minute("m-1", 3), minute("m-2", 180)], "cursor-1", 3)),
    diagnose: jest.fn(),
  };
  const view = mount(client);
  await view.render(); await flush();
  expect(view.container.textContent).toContain("3 devices");
  await act(async () => button(view.container, "Show more devices").click());
  await flush();
  expect(client.devices).toHaveBeenLastCalledWith("p", { limit: 50, after: "cursor-1" });
  expect(view.container.querySelectorAll(".dh-devices tbody tr")).toHaveLength(3);
  expect(button(view.container, "Show more devices")).toBeUndefined();
  await act(async () => button(view.container, "Details").click());
  await flush();
  const dialog = view.container.querySelector("dialog");
  expect(dialog.textContent).toContain("This issue has cleared");
  expect(dialog.querySelector('[role="alert"]')).toBeNull();
  view.unmount();
});

test("a failed load shows the error with a retry", async () => {
  let fail = true;
  const client = {
    health: jest.fn(async () => { if (fail) throw new StreamFailure(503, "service_unavailable", "Stream is temporarily unavailable."); return { projectId: "p", asOf: ago(0), issues: [] }; }),
    devices: jest.fn(async () => devices([])),
    diagnose: jest.fn(),
  };
  const view = mount(client);
  await view.render(); await flush();
  expect(view.container.querySelector('[role="alert"]').textContent).toContain("temporarily unavailable");
  fail = false;
  const retry = [...view.container.querySelectorAll('[role="alert"] button')][0];
  await act(async () => retry.click());
  await flush();
  expect(view.container.textContent).toContain("No active issues");
  view.unmount();
});
