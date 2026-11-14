// Products a project can switch on. The API validates names against its own list
// (ENABLED_SERVICES); this is only how the site names and describes them.
// `open` is where a project's service page lives; null until that page exists (the /rms route comes later).
export const SERVICES = [
  { id: 'stream', name: 'Stream', description: 'Capture engineering events and explore their history.',
    open: (workspaceId, projectId) => `/stream/workspace?workspace=${encodeURIComponent(workspaceId)}&project=${encodeURIComponent(projectId)}` },
  { id: 'rms', name: 'RMS', description: 'Manage requirements, links and evidence.', open: null },
];

export const serviceName = (id) => SERVICES.find((service) => service.id === id)?.name
  || (id ? id.charAt(0).toUpperCase() + id.slice(1) : '');

// A project's services may arrive as names or as objects; the site only needs the names.
export const serviceIds = (services) => (Array.isArray(services) ? services : [])
  .map((entry) => (typeof entry === 'string' ? entry : entry?.service))
  .filter(Boolean);
