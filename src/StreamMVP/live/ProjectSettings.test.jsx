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

test("explicit refresh after a successful rename with failed verification adopts the saved revision for the next edit", async () => {
  const initial = { id: "p", name: "Original", revision: 1 };
  let server = initial;
  const client = { renameProject: jest.fn(async (id, name, revision) => {
    expect(revision).toBe(server.revision);
    server = { ...server, name, revision: revision + 1 };
    return server;
  }) };
  function Probe() {
    const [project, setProject] = useState(initial);
    return <ProjectSettings client={client} metadata={{ project, members: [], role: "Owner", busy: false,
      mutate: async (operation) => { await operation(); throw new StreamFailure(503, "unavailable", "Verification unavailable"); },
      reload: async () => { setProject(server); return server; },
    }} />;
  }
  const container = document.createElement("div"), root = createRoot(container), mount = root.render.bind(root);
  document.body.appendChild(container);
  await act(async () => mount(<Probe />));
  const input = container.querySelector('input[maxlength="64"]');
  const type = (name) => act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, name);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const submit = () => container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  type("Saved name");
  await act(async () => submit());
  await act(async () => [...container.querySelectorAll("button")].find((button) => button.textContent.includes("Retry / refresh")).click());
  expect(input.value).toBe("Saved name");
  type("Next name");
  await act(async () => submit());
  expect(client.renameProject).toHaveBeenLastCalledWith("p", "Next name", 2);
  act(() => root.unmount());
  container.remove();
});

test.each(["add", "role", "remove"])("successful member %s keeps a pending name draft and advances its rename revision", async (change) => {
  let server = { id: "p", name: "Original", revision: 1 };
  const client = {
    member: jest.fn(async () => { server = { ...server, revision: server.revision + 1 }; }),
    renameProject: jest.fn(async (id, name, revision) => { expect(revision).toBe(server.revision); server = { ...server, name, revision: revision + 1 }; }),
  };
  function Probe() {
    const [project, setProject] = useState(server);
    return <ProjectSettings client={client} metadata={{ project, members: [{ email: "colleague@example.com", role: "Member" }], role: "Owner", busy: false,
      mutate: async (operation) => { await operation(); setProject(server); },
      reload: async () => { setProject(server); return server; },
    }} />;
  }
  const container = document.createElement("div"), root = createRoot(container), mount = root.render.bind(root);
  document.body.appendChild(container);
  const confirm = jest.spyOn(window, "confirm").mockReturnValue(true);
  const type = (input, value) => act(() => {
    const prototype = input.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value").set.call(input, value);
    input.dispatchEvent(new Event(input.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
  });
  try {
    await act(async () => mount(<Probe />));
    const name = container.querySelector('input[maxlength="64"]');
    type(name, "My pending name");
    if (change === "add") {
      type(container.querySelector('input[type="email"]'), "new@example.com");
      await act(async () => container.querySelector(".mvp-invite-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    } else if (change === "role") {
      await act(async () => type(container.querySelector('[aria-label="Role for colleague@example.com"]'), "Admin"));
    } else {
      await act(async () => [...container.querySelectorAll("button")].find((button) => button.textContent === "Remove").click());
    }
    expect(client.member).toHaveBeenCalledTimes(1);
    expect(name.value).toBe("My pending name");
    await act(async () => container.querySelector(".mvp-settings-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(client.renameProject).toHaveBeenLastCalledWith("p", "My pending name", 2);
  } finally {
    act(() => root.unmount()); container.remove(); confirm.mockRestore();
  }
});
