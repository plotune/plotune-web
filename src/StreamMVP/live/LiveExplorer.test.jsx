import React, { act } from "react";
import { createRoot } from "react-dom/client";
import LiveExplorer from "./LiveExplorer";
import WidgetEditor from "../WidgetEditor";
import { StreamFailure } from "./client";
let root, mountRoot, container;
const now = "2026-10-13T12:00:00.000Z";
const page = (items = [], nextCursor = null) => ({
  items,
  nextCursor,
  now,
  snapshot: 1,
});
const event = {
  id: "one",
  event: "motor.sample",
  timestamp: now,
  properties: { motor: { rpm: 1680 } },
};
const click = async (element) =>
  act(async () =>
    element.dispatchEvent(new MouseEvent("click", { bubbles: true })),
  );
const button = (text) =>
  [...container.querySelectorAll("button")].find(
    (el) => el.textContent === text,
  );
const type = (input, value) =>
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
const flush = async (ms = 250) =>
  act(async () => {
    jest.advanceTimersByTime(ms);
    await Promise.resolve();
  });
beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  mountRoot = root.render.bind(root);
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});
function fixture(client, extra = {}) {
  return (
    <LiveExplorer
      client={client}
      project={{ id: "p", name: "Test" }}
      discovery={{ properties: [], eventNames: [] }}
      filters={[]}
      dashboards={[]}
      onSelectFilter={() => {}}
      saveFilter={() => {}}
      renameFilter={() => {}}
      deleteFilter={() => {}}
      retryDiscovery={() => {}}
      {...extra}
    />
  );
}
test("Explorer uses backend cursor pagination, preserves sparse continuation and search", async () => {
  const client = {
    query: jest
      .fn()
      .mockResolvedValueOnce(page([], "continuation"))
      .mockResolvedValueOnce(page([event])),
    realtime: jest
      .fn()
      .mockResolvedValue({ ids: [], cursor: "1", reset: false }),
  };
  act(() => mountRoot(fixture(client)));
  await flush();
  expect(container.textContent).toContain("Continue searching this snapshot");
  expect(button("Next").disabled).toBe(false);
  await click(button("Next"));
  expect(client.query.mock.calls[1][1]).toMatchObject({
    cursor: "continuation",
    now,
  });
  expect(container.textContent).toContain("motor.sample");
  type(container.querySelector('input[type="search"]'), "new search");
  client.query.mockResolvedValue(page());
  await flush();
  expect(client.query.mock.calls[2][1]).toMatchObject({ search: "new search" });
  expect(client.query.mock.calls[2][1].cursor).toBeUndefined();
});
test("changing query cancels old requests and staged realtime events cannot leak into the new scope", async () => {
  let resolveOld;
  const client = {
    query: jest
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOld = resolve;
          }),
      )
      .mockResolvedValue(page()),
    realtime: jest
      .fn()
      .mockResolvedValueOnce({ ids: [], cursor: "1", reset: false })
      .mockResolvedValueOnce({ ids: ["new"], cursor: "2", reset: false })
      .mockResolvedValue({ ids: [], cursor: "2", reset: false }),
  };
  act(() => mountRoot(fixture(client)));
  await flush();
  await flush(5000);
  expect(container.textContent).toContain("New project events are available");
  const oldSignal = client.query.mock.calls[0][2].signal;
  type(container.querySelector('input[type="search"]'), "other");
  await flush();
  expect(oldSignal.aborted).toBe(true);
  expect(container.textContent).not.toContain(
    "New project events are available",
  );
  await act(async () => resolveOld(page([event])));
  expect(container.textContent).not.toContain("motor.sample");
});
test("Saved Filter revisions refresh the query without duplicating shared conditions", async () => {
  const client = {
    query: jest.fn().mockResolvedValue(page()),
    realtime: jest
      .fn()
      .mockResolvedValue({ ids: [], cursor: "1", reset: false }),
  };
  const filter = {
    id: "f",
    name: "Shared",
    revision: 1,
    conditions: [
      {
        id: "c",
        path: "motor.rpm",
        operator: "equals",
        value: 1680,
        valueType: "number",
      },
    ],
  };
  act(() =>
    mountRoot(fixture(client, { filters: [filter], activeFilterId: "f" })),
  );
  await flush();
  expect(client.query.mock.calls[0][1]).toMatchObject({
    filterId: "f",
    conditions: [],
  });
  act(() =>
    mountRoot(
      fixture(client, {
        filters: [{ ...filter, revision: 2 }],
        activeFilterId: "f",
      }),
    ),
  );
  await flush();
  expect(client.query).toHaveBeenCalledTimes(2);
});
test("widget save errors keep the draft open and custom property paths remain configurable", async () => {
  const save = jest
    .fn()
    .mockRejectedValue(
      new StreamFailure(
        409,
        "revision_conflict",
        "Resource changed; reload before saving",
      ),
    );
  act(() =>
    mountRoot(
      <WidgetEditor
        widget={{
          id: "w",
          eventName: "motor.sample",
          measureProperty: "unseen.rpm",
          visualization: "line",
          range: "1h",
          title: "Real RPM",
        }}
        events={[]}
        filters={[]}
        now={now}
        discovery={{ properties: [], eventNames: [] }}
        onSave={save}
        onClose={() => {}}
      />,
    ),
  );
  await act(async () =>
    container
      .querySelector("form")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  expect(save.mock.calls[0][0]).toMatchObject({
    measureProperty: "unseen.rpm",
    filterId: null,
  });
  expect(container.querySelector("dialog")).toBeTruthy();
  expect(container.textContent).toContain("Resource changed");
});
