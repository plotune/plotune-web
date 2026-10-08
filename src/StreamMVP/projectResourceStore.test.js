import { loadProjectResources, resourceReferencesFilter, saveProjectResources } from "./projectResourceStore";

test("counts Saved Filter references by identifier across project widgets", () => {
  const dashboards = {
    robot: [{ filterId: "real" }, { filterId: "simulation" }],
    battery: [{ filterId: "real" }, { filterId: null }],
  };
  expect(resourceReferencesFilter(dashboards, "real")).toBe(2);
  expect(resourceReferencesFilter(dashboards, "missing")).toBe(0);
});

test("project Saved Filters and widget references persist in browser storage", () => {
  window.localStorage.clear();
  const resources = {
    filters: { project: [{ id: "shared", name: "Real system", conditions: [{ path: "environment", operator: "equals", value: "real" }] }] },
    dashboards: { project: [{ id: "widget", filterId: "shared", measureProperty: "rpm" }] },
  };
  saveProjectResources(resources);
  expect(loadProjectResources()).toEqual(resources);
  window.localStorage.clear();
});
