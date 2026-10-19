import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "../Dashboard";
import { StreamFailure } from "./client";

test("widget conflict refresh retains its draft and merges into the latest dashboard without losing a colleague's widget", async () => {
  const widget = {
    id: "w",
    title: "Original count",
    eventName: "motor.sample",
    visualization: "count",
    chartType: "bar",
    filterId: null,
    range: "1h",
    breakdownProperty: "",
    measureProperty: "",
  };
  const initial = {
    id: "d",
    name: "Shared dashboard",
    revision: 1,
    widgets: [widget],
  };
  let server = {
    ...initial,
    revision: 3,
    widgets: [widget, { ...widget, id: "other", title: "Colleague's count" }],
  };
  const revisions = [];
  function SharedDashboard() {
    const [dashboard, setDashboard] = useState(initial);
    return (
      <Dashboard
        projectId="p"
        events={[]}
        now="2026-10-13T12:00:00.000Z"
        dashboards={[dashboard]}
        filters={[]}
        selectedDashboardId="d"
        onOpen={() => {}}
        onBack={() => {}}
        onRefresh={async () => setDashboard(server)}
        onSaveWidget={async (id, draft, base) => {
          revisions.push(base.revision);
          if (base.revision !== server.revision)
            throw new StreamFailure(
              409,
              "revision_conflict",
              "Resource changed; reload before saving",
            );
          server = {
            ...base,
            revision: base.revision + 1,
            widgets: base.widgets.map((w) => (w.id === draft.id ? draft : w)),
          };
          setDashboard(server);
        }}
        renderGraph={(w, edit) => (
          <button key={w.id} onClick={edit}>
            Edit {w.id}
          </button>
        )}
      />
    );
  }
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container),
    mount = root.render.bind(root);
  const click = async (text) =>
    act(async () =>
      [...container.querySelectorAll("button")]
        .find((b) => b.textContent.trim() === text)
        .dispatchEvent(new MouseEvent("click", { bubbles: true })),
    );
  await act(async () => mount(<SharedDashboard />));
  await click("Edit w");
  const title = container.querySelector('dialog input[maxlength="64"]');
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(title, "My edited count");
    title.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await click("Save widget");
  expect(revisions).toEqual([1]);
  expect(container.textContent).toContain("Your draft is kept");
  await click("Refresh shared dashboard");
  expect(title.value).toBe("My edited count");
  await click("Save widget");
  expect(revisions).toEqual([1, 3]);
  expect(server.widgets.map((w) => w.title)).toEqual([
    "My edited count",
    "Colleague's count",
  ]);
  expect(container.querySelector("dialog")).toBeNull();
  act(() => root.unmount());
  container.remove();
});

test("opening a remotely refreshed chart edits its authoritative definition rather than stale dashboard metadata", async () => {
  const stale = { id: "w", title: "Old title", eventName: "motor.sample", visualization: "count", chartType: "bar", range: "1h", filterId: null, breakdownProperty: "", measureProperty: "" };
  const current = { ...stale, title: "Current title", eventName: "drone.error", filterId: "failed", range: "24h", breakdownProperty: "code" };
  const save = jest.fn();
  const container = document.createElement("div"), root = createRoot(container);
  document.body.appendChild(container);
  const mount = root.render.bind(root);
  await act(async () => mount(<Dashboard
    projectId="p" events={[]} now="2026-10-13T12:00:00.000Z"
    dashboards={[{ id: "d", name: "Shared", revision: 1, widgets: [stale] }]}
    filters={[{ id: "failed", name: "Failed", conditions: [] }]} selectedDashboardId="d"
    onSaveWidget={save}
    renderGraph={(widget, edit) => <button key={widget.id} onClick={() => edit(current)}>Edit refreshed chart</button>}
  />));
  await act(async () => container.querySelector(".st-dashboard-grid button").click());
  expect(container.querySelector('dialog input[maxlength="64"]').value).toBe("Current title");
  await act(async () => [...container.querySelectorAll("button")].find((button) => button.textContent === "Save widget").click());
  expect(save.mock.calls[0][1]).toMatchObject(current);
  act(() => root.unmount());
  container.remove();
});
