import React, { act } from "react";
import { createRoot } from "react-dom/client";
import RemoteGraph from "./RemoteGraph";

test("charts aggregate and render the returned widget definition while dashboard metadata is stale", async () => {
  jest.useFakeTimers();
  const now = "2026-10-13T12:00:00.000Z";
  const current = {
    id: "w",
    title: "Drone failures",
    eventName: "drone.error",
    visualization: "count",
    chartType: "bar",
    measureProperty: "",
    filterId: "failed",
    breakdownProperty: "code",
    range: "24h",
  };
  const stale = {
    ...current,
    title: "Old RPM",
    eventName: "motor.sample",
    visualization: "line",
    measureProperty: "motor.rpm",
    breakdownProperty: "sw_version",
    range: "1h",
  };
  const onEdit = jest.fn();
  const client = {
    pages: jest.fn(async function* () {
      yield {
        items: [
          {
            id: "e",
            event: "drone.error",
            timestamp: "2026-10-12T18:00:00.000Z",
            properties: { code: "E-1" },
          },
        ],
        now,
        snapshot: 1,
        nextCursor: null,
        widget: current,
      };
    }),
  };
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container),
    mount = root.render.bind(root);
  await act(async () =>
    mount(
      <RemoteGraph
        client={client}
        projectId="p"
        dashboard={{ id: "d", revision: 1 }}
        widget={stale}
        filters={[]}
        onEdit={onEdit}
        onRemove={() => {}}
      />,
    ),
  );
  expect(container.querySelector("h2").textContent).toBe("Drone failures");
  expect(container.textContent).toContain("Last 24 hours");
  expect(container.textContent).toContain("Saved Filter");
  expect(container.textContent).not.toContain("No Saved Filter");
  expect(container.textContent).not.toContain("No matching events");
  expect(container.querySelector('[role="img"]')).toBeTruthy();
  expect(client.pages).toHaveBeenCalledWith(
    "p",
    {},
    expect.objectContaining({ widget: { dashboardId: "d", id: "w" } }),
  );
  await act(async () => [...container.querySelectorAll("button")].find((button) => button.textContent === "Edit widget").click());
  expect(onEdit).toHaveBeenCalledWith(current);
  client.pages.mockImplementationOnce(async function* () { yield Promise.reject(new Error("Refresh unavailable")); });
  await act(async () => jest.advanceTimersByTime(15000));
  expect(container.textContent).toContain("Refresh unavailable");
  expect(container.querySelector("h2").textContent).toBe("Drone failures");
  await act(async () => [...container.querySelectorAll("button")].find((button) => button.textContent === "Edit widget").click());
  expect(onEdit).toHaveBeenLastCalledWith(current);
  act(() => root.unmount());
  jest.useRealTimers();
  container.remove();
});
