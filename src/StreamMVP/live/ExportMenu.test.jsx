import React, { act } from "react";
import { createRoot } from "react-dom/client";
import ExportMenu from "../ExportMenu";

test("export progress does not claim success before completion, and cancellation never downloads a partial file", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container),
    mount = root.render.bind(root);
  const original = URL.createObjectURL;
  URL.createObjectURL = jest.fn();
  let complete, progress, signal;
  const createExport = jest.fn((format, notify, abortSignal) => {
    progress = notify;
    signal = abortSignal;
    notify(10, null);
    return new Promise((resolve) => {
      complete = resolve;
    });
  });
  act(() =>
    mount(
      <ExportMenu
        events={[]}
        query={{}}
        projectName="Synthetic"
        createExport={createExport}
      />,
    ),
  );
  const button = (text) =>
    [...container.querySelectorAll("button")].find(
      (b) => b.textContent.trim() === text,
    );
  const click = async (el) =>
    act(async () =>
      el.dispatchEvent(new MouseEvent("click", { bubbles: true })),
    );
  await click(button("Export"));
  await click(button("JSON"));
  expect(container.textContent).toContain("Retrieved 10 matching events");
  act(() => progress(5, 10));
  expect(container.textContent).toContain("Preparing 5 / 10 events");
  expect(container.textContent).not.toContain("Exported");
  await click(button("Cancel"));
  expect(signal.aborted).toBe(true);
  await act(async () => complete({ count: 10, blob: new Blob(["[]"]) }));
  expect(URL.createObjectURL).not.toHaveBeenCalled();
  expect(container.textContent).not.toContain("Exported");
  act(() => root.unmount());
  container.remove();
  URL.createObjectURL = original;
});

test("export menu supports keyboard navigation and returns focus on Escape", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(<ExportMenu events={[]} query={{}} projectName="Synthetic" />));
  const trigger = container.querySelector('button[aria-haspopup="menu"]');
  act(() => trigger.click());
  const items = [...container.querySelectorAll('[role="menuitem"]')];
  expect(items.map((item) => item.textContent)).toEqual(["JSON", "CSV", "TSV"]);
  expect(document.activeElement).toBe(items[0]);
  act(() => items[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
  expect(document.activeElement).toBe(items[1]);
  act(() => items[1].dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
  expect(document.activeElement).toBe(items[2]);
  act(() => items[2].dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
  expect(container.querySelector('[role="menu"]')).toBeNull();
  expect(document.activeElement).toBe(trigger);
  act(() => root.unmount());
  container.remove();
});
