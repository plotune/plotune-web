const STORAGE_KEY = "plotune-stream-project-resources-v1";

export const DEFAULT_PROJECT_RESOURCES = {
  filters: {},
  dashboards: {},
};

function copyDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_PROJECT_RESOURCES));
}

export function loadProjectResources() {
  if (typeof window === "undefined") return copyDefaults();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return copyDefaults();
    const parsed = JSON.parse(stored);
    const dashboards = parsed.dashboards && typeof parsed.dashboards === "object" ? parsed.dashboards : {};
    return {
      filters: parsed.filters && typeof parsed.filters === "object" ? parsed.filters : {},
      dashboards: Object.fromEntries(Object.entries(dashboards).map(([projectId, items]) => [projectId, normalizeDashboards(items, projectId)])),
    };
  } catch {
    return copyDefaults();
  }
}

export function saveProjectResources(resources) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  } catch {
    // Private browsing/quota restrictions leave this prototype session-only.
  }
}

export function resourceReferencesFilter(dashboards, filterId) {
  return Object.values(dashboards).flat().flatMap((dashboard) => dashboard.widgets || []).filter((widget) => widget.filterId === filterId).length;
}

function normalizeDashboards(items, projectId) {
  if (!Array.isArray(items) || !items.length) return [];
  if (items.every((item) => item && Array.isArray(item.widgets))) return items;
  return [{ id: `${projectId}-dashboard-restored`, name: "Dashboard", description: "", widgets: items, updatedAt: new Date().toISOString() }];
}
