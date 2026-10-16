import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "../Dashboard";
import WidgetEditor from "../WidgetEditor";
import FilterPopover from "../FilterPopover";
import { AddWebhookDialog } from "../Webhooks";

let container, root, mount;
beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement("div"); document.body.appendChild(container);
  root = createRoot(container); mount = root.render.bind(root);
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.useRealTimers(); });
const failingCreate = () => jest.fn().mockRejectedValueOnce(new Error("Metadata verification failed")).mockResolvedValue(undefined);
const click = async (text) => act(async () => [...container.querySelectorAll("button")].find((button) => button.textContent.trim() === text).click());
const type = (input, value) => act(() => {
  const prototype = input.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, "value").set.call(input, value);
  input.dispatchEvent(new Event(input.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
});
const submit = async (form) => act(async () => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
const later = () => act(() => jest.advanceTimersByTime(1500));

test("dashboard creation keeps its identity after verification failure and allocates another only for a new dialog", async () => {
  const create = failingCreate();
  act(() => mount(<Dashboard projectId="p" events={[]} dashboards={[]} filters={[]} onCreate={create} onOpen={() => {}} />));
  await click("New dashboard");
  type(container.querySelector("dialog input"), "Shared dashboard");
  await submit(container.querySelector("dialog form"));
  expect(container.textContent).toContain("Metadata verification failed");
  later();
  await submit(container.querySelector("dialog form"));
  expect(create.mock.calls[1][0].id).toBe(create.mock.calls[0][0].id);
  await click("New dashboard");
  type(container.querySelector("dialog input"), "Another dashboard");
  await submit(container.querySelector("dialog form"));
  expect(create.mock.calls[2][0].id).not.toBe(create.mock.calls[0][0].id);
});

test("new widget retries reuse one widget ID", async () => {
  const save = failingCreate();
  act(() => mount(<WidgetEditor events={[]} filters={[]} now={Date.now()} discovery={{ properties: [], eventNames: [] }} onSave={save} onClose={() => {}} />));
  type(container.querySelector('[aria-label="Event"]'), "drone.error");
  type(container.querySelector("select"), "count");
  await submit(container.querySelector("form"));
  later();
  await submit(container.querySelector("form"));
  expect(save).toHaveBeenCalledTimes(2);
  expect(save.mock.calls[1][0].id).toBe(save.mock.calls[0][0].id);
});

test("new webhook retries reuse one resource ID", async () => {
  const create = failingCreate();
  act(() => mount(<AddWebhookDialog events={[]} discoveredEventNames={["drone.error"]} onCreate={create} onClose={() => {}} />));
  type(container.querySelector('input[type="url"]'), "https://example.com/receive");
  await submit(container.querySelector("form"));
  later();
  await submit(container.querySelector("form"));
  expect(create).toHaveBeenCalledTimes(2);
  expect(create.mock.calls[1][0].id).toBe(create.mock.calls[0][0].id);
});

test("new Saved Filter retries retain a creation ID without treating it as an existing Filter", async () => {
  const save = failingCreate();
  act(() => mount(<FilterPopover events={[]} filters={[]} conditions={[{ id: "c", path: "rpm", operator: "greater_than", value: 100 }]} onSave={save} />));
  await click("Filter");
  await click("Save filter");
  const name = container.querySelector('[aria-label="Saved filter name"]');
  type(name, "High RPM");
  await submit(name.closest("form"));
  later();
  await submit(name.closest("form"));
  expect(save).toHaveBeenCalledTimes(2);
  expect(save.mock.calls[0][2]).toBeUndefined();
  expect(save.mock.calls[0][3]).toEqual(expect.any(String));
  expect(save.mock.calls[1][3]).toBe(save.mock.calls[0][3]);
});
