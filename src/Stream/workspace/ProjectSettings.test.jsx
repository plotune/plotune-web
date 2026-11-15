import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import ProjectSettings from "./ProjectSettings";

const render = async (role) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => root.render(
    <MemoryRouter><ProjectSettings workspaceId="w 1" metadata={{ project: { id: "p", name: "Bench rig" }, role }} /></MemoryRouter>,
  ));
  return { container, unmount: () => { act(() => root.unmount()); container.remove(); } };
};

test("project settings point to the workspace instead of renaming or managing members here", async () => {
  const { container, unmount } = await render("Owner");
  expect(container.textContent).toContain("Bench rig");
  expect(container.querySelector("input")).toBeNull();
  expect(container.querySelector("form")).toBeNull();
  expect(container.querySelector("a").getAttribute("href")).toBe("/workspaces/w%201");
  expect(container.querySelector("a").textContent).toBe("Manage in workspace");
  unmount();
});

test("the role guide names all four roles and marks the signed-in one", async () => {
  const { container, unmount } = await render("Viewer");
  const terms = [...container.querySelectorAll("dt")].map((dt) => dt.textContent);
  expect(terms).toEqual(["Owner", "Admin", "Member", "Viewer (you)"]);
  expect(container.textContent).toContain("No webhooks");
  unmount();
});
