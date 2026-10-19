import React, { act } from "react";
import { createRoot } from "react-dom/client";
import AccountUsage from "./AccountUsage";

const usage = { month: "2026-10", accepted: 1200, allowance: 30000, day: "2026-10-19", acceptedToday: 40, dailyAllowance: 2000, scope: "project-owner-account" };

async function render(role) {
  const client = { usage: jest.fn(async () => usage) };
  const container = document.createElement("div"), root = createRoot(container);
  document.body.appendChild(container);
  await act(async () => root.render(<AccountUsage client={client} projectId="p" role={role} />));
  return { client, container, done: () => { act(() => root.unmount()); container.remove(); } };
}

test("the project owner sees account usage and can refresh it", async () => {
  const { client, container, done } = await render("Owner");
  expect(client.usage).toHaveBeenCalledWith("p", expect.any(AbortSignal));
  expect(container.textContent).toContain("1,200 / 30,000 events this month");
  expect(container.textContent).toContain("40 / 2,000 today");
  await act(async () => [...container.querySelectorAll("button")].find((b) => b.textContent === "Refresh usage").click());
  expect(client.usage).toHaveBeenCalledTimes(2);
  done();
});

test.each(["Admin", "Member"])("%s never requests owner-wide usage and sees why", async (role) => {
  const { client, container, done } = await render(role);
  expect(client.usage).not.toHaveBeenCalled();
  expect(container.textContent).toBe("Event usage is visible to the project owner.");
  expect(container.querySelector("button")).toBeNull();
  done();
});

test("nothing renders until the caller's role is known", async () => {
  const { client, container, done } = await render(undefined);
  expect(client.usage).not.toHaveBeenCalled();
  expect(container.textContent).toBe("");
  done();
});
