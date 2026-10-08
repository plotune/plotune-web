const STORAGE_KEY = "plotune-stream-project-resources-v1";

export const DEFAULT_PROJECT_RESOURCES = {
  filters: {
    battery: [
      { id: "filter-battery-real", name: "Real System", conditions: [{ id: "cond-real", path: "environment", operator: "equals", value: "real", valueType: "string" }] },
      { id: "filter-battery-simulation", name: "Simulation", conditions: [{ id: "cond-sim", path: "environment", operator: "equals", value: "simulation", valueType: "string" }] },
      { id: "filter-battery-failed", name: "Failed Events", conditions: [{ id: "cond-failed", path: "result", operator: "equals", value: "failed", valueType: "string" }] },
    ],
    robot: [
      { id: "filter-robot-real", name: "Real System", conditions: [{ id: "cond-robot-real", path: "environment", operator: "equals", value: "real", valueType: "string" }] },
      { id: "filter-robot-sim", name: "Simulation", conditions: [{ id: "cond-robot-sim", path: "environment", operator: "equals", value: "simulation", valueType: "string" }] },
    ],
  },
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
    return {
      filters: parsed.filters && typeof parsed.filters === "object" ? parsed.filters : {},
      dashboards: parsed.dashboards && typeof parsed.dashboards === "object" ? parsed.dashboards : {},
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
  return Object.values(dashboards).flat().filter((widget) => widget.filterId === filterId).length;
}
