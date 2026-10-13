import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import LiveExplorer from "./LiveExplorer";
import WidgetEditor from "../WidgetEditor";
import FilterPopover from "../FilterPopover";
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

test("consecutive Saved Filter updates adopt each saved revision and resume queries by ID", async () => {
  const client = {
    query: jest.fn().mockResolvedValue(page()),
    realtime: jest
      .fn()
      .mockResolvedValue({ ids: [], cursor: "1", reset: false }),
  };
  const initial = {
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
  const savedRevisions = [];
  function SharedFilter() {
    const [filter, setFilter] = useState(initial);
    return fixture(client, {
      filters: [filter],
      activeFilterId: "f",
      saveFilter: async (name, conditions, id, baseline) => {
        savedRevisions.push(baseline.revision);
        setFilter({
          ...filter,
          name,
          conditions,
          revision: filter.revision + 1,
        });
      },
    });
  }
  act(() => mountRoot(<SharedFilter />));
  await flush();
  for (const value of [1700, 1800]) {
    await click(container.querySelector('[aria-label^="Edit motor.rpm"]'));
    type(container.querySelector('input[type="number"]'), String(value));
    await click(button("Apply"));
    await flush();
    await click(
      [...container.querySelectorAll("button")].find((b) =>
        b.classList.contains("mvp-filter-trigger"),
      ),
    );
    const management = container.querySelector(".mvp-filter-manage");
    act(() => {
      management.open = true;
    });
    await click(button("Update conditions"));
    await flush();
    expect(container.textContent).toContain("Shared Saved Filter: Shared");
    expect(container.textContent).not.toContain("Temporary changes to");
    expect(client.query.mock.calls.at(-1)[1]).toMatchObject({
      filterId: "f",
      conditions: [],
    });
    await click(
      container.querySelector(
        '.mvp-filter-popover-head [aria-label="Close filter menu"]',
      ),
    );
  }
  expect(savedRevisions).toEqual([1, 2]);
});

test.each([false, true])(
  "conflict refresh preserves the draft and advances only its rejected CAS baseline (already fresh: %s)",
  async (alreadyFresh) => {
    const client = {
      query: jest.fn().mockResolvedValue(page()),
      realtime: jest
        .fn()
        .mockResolvedValue({ ids: [], cursor: "1", reset: false }),
    };
    const initial = {
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
    let server = {
      ...initial,
      revision: 2,
      conditions: [{ ...initial.conditions[0], value: 1800 }],
    };
    const attempted = [];
    function SharedFilter() {
      const [filter, setFilter] = useState(initial);
      return (
        <>
          <button onClick={() => setFilter({ ...server })}>
            Refresh shared metadata
          </button>
          {fixture(client, {
            filters: [filter],
            activeFilterId: "f",
            saveFilter: async (name, conditions, id, baseline) => {
              attempted.push(baseline.revision);
              if (baseline.revision !== server.revision)
                throw new StreamFailure(
                  409,
                  "revision_conflict",
                  "Resource changed; reload before saving",
                );
              server = { ...server, conditions, revision: server.revision + 1 };
              setFilter(server);
            },
          })}
        </>
      );
    }
    act(() => mountRoot(<SharedFilter />));
    await flush();
    await click(container.querySelector('[aria-label^="Edit motor.rpm"]'));
    type(container.querySelector('input[type="number"]'), "1700");
    await click(button("Apply"));
    await flush();
    const refreshButton = button("Refresh shared metadata");
    if (alreadyFresh) await click(refreshButton);
    const updateShared = async () => {
      await click(container.querySelector(".mvp-filter-trigger"));
      const manage = container.querySelector(".mvp-filter-manage");
      act(() => {
        manage.open = true;
      });
      await click(button("Update conditions"));
      await flush();
    };
    await updateShared();
    expect(attempted).toEqual([1]);
    expect(container.textContent).toContain("Your draft is preserved");
    await click(
      container.querySelector(
        '.mvp-filter-popover-head [aria-label="Close filter menu"]',
      ),
    );
    await click(refreshButton);
    await flush();
    expect(
      container.querySelector('[aria-label^="Edit motor.rpm"]').textContent,
    ).toContain("1700");
    expect(container.textContent).toContain("Temporary changes to");
    await updateShared();
    expect(attempted).toEqual([1, 2]);
    expect(server.conditions[0].value).toBe(1700);
    expect(container.textContent).toContain("Shared Saved Filter: Shared");
  },
);

test("live widget configuration permits undiscovered paths when suggestions are unavailable", () => {
  act(() =>
    mountRoot(
      <WidgetEditor
        widget={{
          id: "w",
          eventName: "unseen.sample",
          measureProperty: "unseen.rpm",
          visualization: "line",
          range: "1h",
          title: "Unseen metric",
        }}
        events={[]}
        filters={[]}
        now={now}
        loadPreview={async () => {
          throw new StreamFailure(503, "service_unavailable", "Unavailable");
        }}
        onSave={() => {}}
        onClose={() => {}}
      />,
    ),
  );
  expect(container.querySelector('input[aria-label="Event"]').value).toBe(
    "unseen.sample",
  );
  expect(container.querySelector('input[aria-label="Property"]').value).toBe(
    "unseen.rpm",
  );
  expect(button("Save widget").disabled).toBe(false);
});

test("an undiscovered Boolean condition retains its type and operator when edited", async () => {
  const onApply = jest.fn();
  act(() =>
    mountRoot(
      <FilterPopover
        events={[]}
        filters={[]}
        activeFilterId={null}
        conditions={[
          { id: "bool", path: "unseen.enabled", operator: "is_false" },
        ]}
        onApply={onApply}
      />,
    ),
  );
  await click(container.querySelector('[aria-label^="Edit unseen.enabled"]'));
  expect(container.querySelector('[aria-label="Value type"]').value).toBe(
    "boolean",
  );
  expect(container.querySelector('[aria-label="Operator"]').value).toBe(
    "is_false",
  );
  await click(button("Apply"));
  expect(onApply.mock.calls[0][0][0]).toMatchObject({
    path: "unseen.enabled",
    operator: "is_false",
  });
});

test("Clear all removes custom UTC bounds instead of reusing a hidden cleared window", async () => {
  const client = {
    query: jest.fn().mockResolvedValue(page()),
    realtime: jest
      .fn()
      .mockResolvedValue({ ids: [], cursor: "1", reset: false }),
  };
  act(() => mountRoot(fixture(client)));
  await flush();
  const selectRange = (value) =>
    act(() => {
      const select = container.querySelector(".live-toolbar select");
      select.value = value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  selectRange("custom");
  const inputs = container.querySelectorAll('input[type="datetime-local"]');
  type(inputs[0], "2026-10-01T12:00");
  type(inputs[1], "2026-10-02T12:00");
  await flush();
  expect(client.query.mock.calls.at(-1)[1]).toMatchObject({
    startAt: "2026-10-01T12:00:00.000Z",
    endAt: "2026-10-02T12:00:00.000Z",
  });
  await click(button("Clear all"));
  await flush();
  const count = client.query.mock.calls.length;
  selectRange("custom");
  await flush();
  expect(
    [...container.querySelectorAll('input[type="datetime-local"]')].map(
      (input) => input.value,
    ),
  ).toEqual(["", ""]);
  expect(client.query).toHaveBeenCalledTimes(count);
  expect(container.textContent).toContain("Choose a start and an end");
});
