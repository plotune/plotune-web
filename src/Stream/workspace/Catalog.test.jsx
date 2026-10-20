import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Catalog from "./Catalog";
import EventRow from "./EventRow";
import { StreamFailure } from "./client";

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
const flush = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });
const click = (text) => act(async () => [...container.querySelectorAll("button")].find((b) => b.textContent.trim() === text).click());
const type = (el, value) => act(() => {
  const proto = el.tagName === "SELECT" ? HTMLSelectElement.prototype : el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
  el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
});
const submit = () => act(async () => container.querySelector("dialog form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));

const discovery = { eventNames: ["drone.error", "motor.sample"], properties: [{ path: "temp", types: ["number"], values: [71.5, 95] }, { path: "device", types: ["string"], values: ["m-3"] }] };
function client(state) {
  return {
    catalog: jest.fn(async () => JSON.parse(JSON.stringify(state.catalog))),
    saveEventDefinition: jest.fn(async (_id, name, body) => {
      if (state.conflict) { state.conflict = false; throw new StreamFailure(409, "revision_conflict", "Definition changed"); }
      state.catalog.events = [{ name, ...body, revision: (body.revision ?? -1) + 1, updatedBy: "alice@example.test", updatedVia: "workspace", updatedAt: "2026-10-20T10:00:00.000Z" }];
      return state.catalog.events[0];
    }),
    savePropertyDefinition: jest.fn(async (_id, path, body) => { state.catalog.properties = [{ path, ...body, revision: 0 }]; return state.catalog.properties[0]; }),
    createAction: jest.fn(async (_id, body) => { state.catalog.actions = [{ id: "action-1", ...body, revision: 0 }]; return state.catalog.actions[0]; }),
    updateAction: jest.fn(), deleteAction: jest.fn(), savePathRules: jest.fn(),
    pathPreview: jest.fn(async () => ({ changed: [{ name: "/robot/7/arm", cleaned: "/robot/:id/arm" }], distinctBefore: 3, distinctAfter: 2, invalidPatterns: [] })),
  };
}
const empty = () => ({ catalog: { events: [], properties: [], actions: [], pathRules: { rules: [], revision: null } } });
const render = async (api, role = "Member", initialTab = "events") => {
  await act(async () => root.render(<Catalog client={api} project={{ id: "p" }} role={role} discovery={discovery} filters={[{ id: "hot", name: "Hot" }]} initialTab={initialTab} />));
  await flush();
};

test("events merge what was observed with what the team described; a save records the revision", async () => {
  const state = empty(), api = client(state);
  await render(api);
  const rows = [...container.querySelectorAll("tbody tr")].map((r) => r.textContent);
  expect(rows).toEqual(["drone.errorNot described—", "motor.sampleNot described—"]);
  await click("motor.sample");
  await type(container.querySelector("dialog textarea"), "One reading per second from a drive");
  await act(async () => container.querySelector("dialog input[type=checkbox]").click());
  await submit(); await flush();
  expect(api.saveEventDefinition).toHaveBeenCalledWith("p", "motor.sample", { description: "One reading per second from a drive", owner: "", verified: true, tags: [] });
  expect(container.textContent).toContain("One reading per second from a drive");
  expect(container.textContent).toContain("Verified");
  // Editing sends the current revision; a conflict reloads and explains.
  state.conflict = true;
  await click("motor.sample");
  await submit(); await flush();
  expect(api.saveEventDefinition.mock.calls[1][2].revision).toBe(0);
  expect(container.querySelector("[role=alert]").textContent).toContain("Someone else changed this");
  expect(api.catalog).toHaveBeenCalledTimes(3);
});

test("properties take a unit label and a kind; the unit then shows next to stored values", async () => {
  const state = empty(), api = client(state);
  await render(api, "Member", "properties");
  await click("temp");
  expect(container.textContent).toContain("Recent values: 71.5, 95");
  await type(container.querySelector("dialog input[maxlength='16']"), "°C");
  await type(container.querySelector("dialog select"), "measurement");
  await submit(); await flush();
  expect(api.savePropertyDefinition).toHaveBeenCalledWith("p", "temp", { description: "", unit: "°C", kind: "measurement", owner: "" });
  expect(container.querySelector("tbody").textContent).toContain("°C");
  await act(async () => root.render(<table><tbody><EventRow event={{ id: "e", event: "motor.sample", timestamp: "2026-10-20T10:00:00.000Z", properties: { temp: 71.5, device: "m-3" } }}
    definitions={new Map([["temp", { unit: "°C", description: "Winding temperature" }]])} onInspect={() => {}} /></tbody></table>));
  expect(container.textContent).toContain("71.5 °C");
  expect(container.querySelector("[title^='temp']").title).toBe("temp: 71.5 — Winding temperature");
  expect(container.textContent).toContain("m-3");
});

test("actions are any-of steps over event names and Saved Filters", async () => {
  const state = empty(), api = client(state);
  await render(api, "Member", "actions");
  expect(container.textContent).toContain("Name what you look for");
  await click("New action");
  await type(container.querySelector("dialog input[required]"), "Overheat");
  await type(container.querySelector("[aria-label='Step 1 event']"), "motor.sample");
  await type(container.querySelector("[aria-label='Step 1 Saved Filter']"), "hot");
  await click("Add a step");
  await type(container.querySelector("[aria-label='Step 2 event']"), "drone.error");
  await submit(); await flush();
  expect(api.createAction).toHaveBeenCalledWith("p", { name: "Overheat", description: "", steps: [{ name: "motor.sample", filterId: "hot", conditions: [] }, { name: "drone.error", filterId: null, conditions: [] }] });
  expect(container.querySelector("tbody").textContent).toContain("motor.sample where Hot or drone.error");
});

test("path rules: Members read and preview, Owners and Admins edit", async () => {
  const state = empty(), api = client(state);
  state.catalog.pathRules = { rules: [{ pattern: "/robot/[0-9]+/", replacement: "/robot/:id/" }], revision: 0 };
  await render(api, "Member", "paths");
  expect(container.querySelector("[aria-label='Rule 1 pattern']").readOnly).toBe(true);
  expect([...container.querySelectorAll("button")].map((b) => b.textContent)).not.toContain("Save rules");
  await click("Preview");
  expect(container.querySelector("[aria-label='Path rule preview']").textContent).toContain("3 observed names become 2");
  await render(api, "Admin", "paths");
  await click("Save rules"); await flush();
  expect(api.savePathRules).toHaveBeenCalledWith("p", { rules: [{ pattern: "/robot/[0-9]+/", replacement: "/robot/:id/" }], revision: 0 });
});
