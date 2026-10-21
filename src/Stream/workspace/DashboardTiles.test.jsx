import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "../Dashboard";
import { InsightTile } from "./DashboardTiles";

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
const flush = (ms = 0) => act(async () => { await new Promise((resolve) => setTimeout(resolve, ms)); });
const button = (pattern) => [...container.querySelectorAll("button")].find((b) => pattern.test(b.textContent.trim()));
const click = (pattern) => act(async () => button(pattern).click());
const type = (el, value) => act(() => {
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
});

const insight = { id: "insight-1", name: "Boot to ready", kind: "funnel", revision: 0, query: { kind: "funnel", actor: "device", query: { range: "7d" }, steps: [{ name: "boot" }, { name: "ready" }] } };
const funnelResult = {
  rows: [{ step: 1, name: "boot", actors: 4, conversionFromStart: 1, conversionFromPrevious: null, dropped: 0, medianSecondsFromPrevious: null },
    { step: 2, name: "ready", actors: 3, conversionFromStart: 0.75, conversionFromPrevious: 0.75, dropped: 1, medianSecondsFromPrevious: 5400 }],
  summary: { kind: "funnel", actor: "device", actors: 4, unattributedEvents: 0, truncatedActors: 0 },
  coverage: { complete: true, reason: null, scope: "retained-snapshot" },
};
const tile = (id, insightId = insight.id) => ({ id, type: "insight", insightId, title: "" });

test("an insight runs only when asked, shows its cost and renders the funnel", async () => {
  const client = {
    runInsight: jest.fn(async () => ({ job: { id: "j1", state: "queued" } })),
    analysisJob: jest.fn(async () => ({ job: { id: "j1", state: "complete", result: funnelResult } })),
  };
  await act(async () => root.render(<InsightTile client={client} projectId="p" tile={tile("t1")} insight={insight} onRemove={() => {}} />));
  expect(client.runInsight).not.toHaveBeenCalled();
  expect(container.textContent).toContain("280 credits");
  expect(container.textContent).toContain("Funnel · Devices · Last 7 days");
  await click(/^Run$/);
  await flush(1700);
  expect(client.analysisJob).toHaveBeenCalledWith("p", "j1");
  expect(container.textContent).toContain("75% of previous · 1.5 h median");
  expect(button(/Run again/)).toBeTruthy();
});

test("a deleted insight offers removal; a failed run explains itself", async () => {
  await act(async () => root.render(<InsightTile client={{}} projectId="p" tile={tile("t", "gone")} insight={null} onRemove={() => {}} />));
  expect(container.textContent).toContain("This insight was deleted.");
  const client = { runInsight: jest.fn(async () => { throw Object.assign(new Error("x"), { code: "credits_exhausted" }); }) };
  await act(async () => root.render(<InsightTile client={client} projectId="p" tile={tile("t2")} insight={{ ...insight, revision: 9 }} onRemove={() => {}} />));
  await click(/^Run$/);
  await flush();
  expect(container.querySelector("[role=alert]").textContent).toMatch(/no credits left/);
});

test("tiles render in order; a note is added and moved through the tile menu", async () => {
  const onSaveTiles = jest.fn(async () => ({}));
  const dashboard = { id: "d", name: "Rig", description: "", revision: 2, widgets: [{ id: "w1", title: "Samples", eventName: "sample" }],
    tiles: [{ id: "n1", type: "text", text: "First line\nSecond line" }, { id: "w1", type: "widget" }, tile("i1")] };
  await act(async () => root.render(<Dashboard projectId="p" events={[]} now={0} dashboards={[dashboard]} filters={[]} selectedDashboardId="d"
    onOpen={() => {}} onBack={() => {}} onSaveTiles={onSaveTiles} insights={[insight]}
    renderGraph={(widget) => <div>chart {widget.title}</div>}
    renderInsight={(t, found) => <div>insight {found.name}</div>} />));
  const order = [...container.querySelectorAll(".st-dashboard-grid > *")].map((n) => n.textContent);
  expect(order[0]).toMatch(/First line/);
  expect(order.slice(1)).toEqual(["chart Samples", "insight Boot to ready"]);

  await click(/Add tile/);
  await click(/^Note/);
  await type(container.querySelector("dialog textarea"), "Rig B uses firmware 2.4");
  await click(/^Save note$/);
  await flush();
  const [, next] = onSaveTiles.mock.calls[0];
  expect(next.tiles.map((t) => t.type)).toEqual(["text", "widget", "insight", "text"]);
  expect(next.tiles.at(-1).text).toBe("Rig B uses firmware 2.4");

  // One menu per tile: moving the note later swaps it with the chart.
  await act(async () => [...container.querySelector(".st-text-tile").querySelectorAll("button")].find((b) => b.textContent === "Move later").click());
  await flush();
  expect(onSaveTiles.mock.calls[1][1].tiles.map((t) => t.id)).toEqual(["w1", "n1", "i1"]);
});
