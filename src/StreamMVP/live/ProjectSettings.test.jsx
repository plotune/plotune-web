import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import ProjectSettings from "./ProjectSettings";
import { StreamFailure } from "./client";

test("rename conflict refresh retains the attempted name and retries with the returned revision", async () => {
  const initial = { id: "p", name: "Original", revision: 1 };
  const fresh = { ...initial, name: "Colleague's name", revision: 3 };
  const client = { renameProject: jest.fn(async (id, name, revision) => {
    if (revision !== 3) throw new StreamFailure(409, "revision_conflict", "Project changed");
    return { ...fresh, name, revision: 4 };
  }) };
  function Probe() {
    const [project, setProject] = useState(initial);
    return <ProjectSettings client={client} metadata={{ project, members: [], role: "Owner", busy: false,
      mutate: async (operation) => operation(),
      reload: async () => { setProject(fresh); return fresh; },
    }} />;
  }
  const container = document.createElement("div"), root = createRoot(container), mount = root.render.bind(root);
  document.body.appendChild(container);
  await act(async () => mount(<Probe />));
  const input = container.querySelector('input[maxlength="64"]');
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "My intended name");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const submit = () => container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  await act(async () => submit());
  expect(client.renameProject).toHaveBeenLastCalledWith("p", "My intended name", 1);
  await act(async () => [...container.querySelectorAll("button")].find((button) => button.textContent.includes("Retry / refresh")).click());
  expect(input.value).toBe("My intended name");
  await act(async () => submit());
  expect(client.renameProject).toHaveBeenLastCalledWith("p", "My intended name", 3);
  expect(container.textContent).toContain("Project name saved.");
  act(() => root.unmount());
  container.remove();
});
