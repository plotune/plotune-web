import { deleteDashboard, removeDashboardWidget, saveDashboardWidget, updateDashboard, upsertDashboard } from "./dashboardResourceModel";

test("dashboard collection supports create, rename, edit, and delete without changing another project", () => {
  const firstProject = [];
  const secondProject = [{ id: "other", name: "Other project", widgets: [] }];
  const dashboard = { id: "dash-1", name: "Robot validation", description: "", widgets: [] };
  const created = upsertDashboard(firstProject, dashboard);
  const renamed = updateDashboard(created, dashboard.id, { name: "Validation" });
  expect(renamed[0].name).toBe("Validation");
  expect(secondProject[0].name).toBe("Other project");
  expect(deleteDashboard(renamed, dashboard.id)).toEqual([]);
});

test("widget create, edit, and remove stays scoped to its Dashboard", () => {
  const dashboards = [
    { id: "a", widgets: [] },
    { id: "b", widgets: [{ id: "other-widget", title: "Keep" }] },
  ];
  const created = saveDashboardWidget(dashboards, "a", { id: "widget", title: "RPM" });
  const edited = saveDashboardWidget(created, "a", { id: "widget", title: "Motor RPM" });
  expect(edited[0].widgets[0].title).toBe("Motor RPM");
  expect(edited[1]).toEqual(dashboards[1]);
  expect(removeDashboardWidget(edited, "a", "widget")[0].widgets).toEqual([]);
});
