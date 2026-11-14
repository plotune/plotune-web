// Products a project can switch on. The API validates names against its own list
// (ENABLED_SERVICES); this is only how the site names and describes them.
export const SERVICES = [
  { id: 'stream', name: 'Stream', description: 'Capture engineering events and explore their history.' },
  { id: 'rms', name: 'RMS', description: 'Manage requirements, links and evidence.' },
];

export const serviceName = (id) => SERVICES.find((service) => service.id === id)?.name
  || (id ? id.charAt(0).toUpperCase() + id.slice(1) : '');

// A project's services may arrive as names or as objects; the site only needs the names.
export const serviceIds = (services) => (Array.isArray(services) ? services : [])
  .map((entry) => (typeof entry === 'string' ? entry : entry?.service))
  .filter(Boolean);
