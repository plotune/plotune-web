export function upsertDashboard(dashboards, dashboard) {
  return dashboards.some((item) => item.id === dashboard.id)
    ? dashboards.map((item) => item.id === dashboard.id ? dashboard : item)
    : [...dashboards, dashboard];
}

export function updateDashboard(dashboards, id, change) {
  return dashboards.map((item) => item.id === id ? { ...item, ...change, updatedAt: new Date().toISOString() } : item);
}

export function deleteDashboard(dashboards, id) {
  return dashboards.filter((item) => item.id !== id);
}

export function saveDashboardWidget(dashboards, dashboardId, widget) {
  return updateDashboard(dashboards, dashboardId, {
    widgets: (dashboards.find((item) => item.id === dashboardId)?.widgets || []).some((item) => item.id === widget.id)
      ? dashboards.find((item) => item.id === dashboardId).widgets.map((item) => item.id === widget.id ? widget : item)
      : [...(dashboards.find((item) => item.id === dashboardId)?.widgets || []), widget],
  });
}

export function removeDashboardWidget(dashboards, dashboardId, widgetId) {
  return updateDashboard(dashboards, dashboardId, {
    widgets: (dashboards.find((item) => item.id === dashboardId)?.widgets || []).filter((item) => item.id !== widgetId),
  });
}
