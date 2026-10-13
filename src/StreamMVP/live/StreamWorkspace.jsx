import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  FiActivity,
  FiBarChart2,
  FiCode,
  FiTerminal,
  FiSend,
  FiSettings,
  FiMenu,
  FiPlus,
  FiChevronRight,
} from "react-icons/fi";
import { streamWorkspaceLogin } from "../../utils/streamWorkspaceNavigation";
import { AuthContext } from "../../context/AuthContext";
import { Dialog, Empty, Panel } from "../../StreamWorkspace/WorkspaceUI";
import Dashboard from "../Dashboard";
import Webhooks from "../Webhooks";
import { buildWidgetSeries } from "../widgetModel";
import {
  createStreamClient,
  collectEvents,
  WORKSPACE_ENABLED,
  wireConditions,
} from "./client";
import { useWorkspaceMetadata } from "./hooks";
import LiveExplorer, { Failure } from "./LiveExplorer";
import RemoteGraph from "./RemoteGraph";
import ProjectSettings from "./ProjectSettings";
import ConnectionSetup from "./ConnectionSetup";
import logo from "../../assets/logo.png";
import "../../StreamWorkspace/workspace.css";
import "../mvp.css";
import "./live.css";

const NAV = [
  ["events", "Events", FiActivity],
  ["dashboards", "Dashboards", FiBarChart2],
  ["api", "API setup", FiCode],
  ["mcp", "MCP setup", FiTerminal],
  ["webhooks", "Webhooks", FiSend],
  ["settings", "Project Settings", FiSettings],
];
const newId = () => crypto.randomUUID();
const cleanResource = ({ revision, updatedAt, createdAt, ...record }) => ({
  ...record,
  ...(record.conditions
    ? { conditions: wireConditions(record.conditions) }
    : {}),
});

export default function StreamWorkspace() {
  const auth = useContext(AuthContext);
  const loginLocation = useLocation();
  return (
    <>
      <Helmet>
        <title>Workspace · Plotune Stream</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      {!WORKSPACE_ENABLED ? (
        <div className="live-entry">
          <h1>Plotune Stream workspace</h1>
          <p>The authenticated workspace is awaiting backend activation.</p>
          <Link className="sw-button sw-primary" to="/stream/demo">
            Explore the interactive demo
          </Link>
        </div>
      ) : auth.isLoading ? (
        <div className="live-entry" role="status">
          Checking your session…
        </div>
      ) : !auth.token ? (
        <div className="live-entry">
          <h1>Open your Stream workspace</h1>
          <p>
            Sign in with your Plotune account to access your shared projects.
          </p>
          <Link
            className="sw-button sw-primary"
            to={streamWorkspaceLogin(loginLocation.search)}
          >
            Sign in
          </Link>
        </div>
      ) : (
        <Workspace
          key={auth.token}
          token={auth.token}
          user={auth.user}
          logout={auth.logout}
          onUnauthorized={auth.invalidateSession}
        />
      )}
    </>
  );
}

export function Workspace({ token, user, logout, onUnauthorized }) {
  const client = useMemo(
    () =>
      createStreamClient(token, {
        onUnauthorized: () => onUnauthorized?.(token),
      }),
    [token, onUnauthorized],
  );
  const [params, setParams] = useSearchParams();
  const requestedProject = params.get("project") || "";
  const [navOpen, setNavOpen] = useState(false);
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 800px)").matches,
  );
  const menuRef = useRef(null),
    sidebarRef = useRef(null);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 800px)");
    const changed = () => {
      setMobile(media.matches);
      setNavOpen(false);
    };
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    if (
      mobile &&
      !navOpen &&
      sidebarRef.current?.contains(document.activeElement)
    )
      menuRef.current?.focus();
  }, [mobile, navOpen]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState(null);
  const metadata = useWorkspaceMetadata(client, requestedProject);
  const view = NAV.some(([id]) => id === params.get("view"))
    ? params.get("view")
    : "events";
  const dashboardId = params.get("dashboard");
  const filterId = params.get("filter");
  const location = useCallback(
    (changes, replace = false) => {
      setParams(
        (old) => {
          const next = new URLSearchParams(old);
          Object.entries(changes).forEach(([key, value]) =>
            value ? next.set(key, value) : next.delete(key),
          );
          return next;
        },
        { replace },
      );
      setNavOpen(false);
    },
    [setParams],
  );
  useEffect(() => {
    if (!requestedProject && metadata.projects.length)
      location({ project: metadata.projects[0].id }, true);
  }, [requestedProject, metadata.projects, location]);
  const project = metadata.project;
  const [discoveryState, setDiscoveryState] = useState({});
  const [usage, setUsage] = useState(null);
  const [usageError, setUsageError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [deliveryError, setDeliveryError] = useState(null);
  const [discoveryRefresh, setDiscoveryRefresh] = useState(0);
  useEffect(() => {
    setDiscoveryState({});
    setUsage(null);
    setUsageError(null);
    setDeliveries([]);
    setDeliveryError(null);
    if (!project?.id) return undefined;
    const controller = new AbortController();
    client
      .discovery(project.id, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setDiscoveryState({ data: result });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setDiscoveryState({ error });
      });
    const loadUsage = () =>
      client
        .usage(project.id, controller.signal)
        .then((result) => {
          if (!controller.signal.aborted) {
            setUsage(result);
            setUsageError(null);
          }
        })
        .catch((error) => {
          if (!controller.signal.aborted) setUsageError(error);
        });
    loadUsage();
    const timer = setInterval(loadUsage, 30000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [client, project?.id, discoveryRefresh]);
  useEffect(() => {
    if (!project?.id || view !== "webhooks" || metadata.role === "Member")
      return undefined;
    const controller = new AbortController();
    const load = () =>
      client
        .deliveries(project.id, controller.signal)
        .then((r) => {
          if (!controller.signal.aborted) {
            setDeliveries(r.items);
            setDeliveryError(null);
          }
        })
        .catch((error) => {
          if (!controller.signal.aborted) setDeliveryError(error);
        });
    load();
    const timer = setInterval(load, 10000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [client, project?.id, view, metadata.role]);
  const retryDiscovery = () => setDiscoveryRefresh((r) => r + 1);
  const save = (kind, record, base) =>
    metadata.mutate(() =>
      client.saveResource(project.id, kind, cleanResource(record), base),
    );
  const remove = (kind, record, confirmReferenced) =>
    metadata.mutate(() =>
      client.deleteResource(project.id, kind, record, confirmReferenced),
    );
  const safeAction = async (action) => {
    try {
      await action();
    } catch {
      /* The shared mutation notice contains the server error. */
    }
  };
  const dashboard = metadata.dashboards.find((d) => d.id === dashboardId);
  const preview = useCallback(
    async (widget, signal) => {
      const query = {
        name: widget.eventName,
        range: widget.range,
        ...(widget.filterId ? { filterId: widget.filterId } : {}),
      };
      const result = await collectEvents(
        client.pages(requestedProject, query, { signal }),
        { signal },
      );
      const series = buildWidgetSeries(
        result.events,
        { ...widget, filterId: null },
        [],
        result.now,
      );
      return { ...series, events: [], eventCount: series.events.length };
    },
    [client, requestedProject],
  );
  const title =
    dashboard && view === "dashboards"
      ? dashboard.name
      : NAV.find(([id]) => id === view)[1];
  return (
    <div className="sw-app mvp-app live-workspace ph-no-capture rr-block">
      <header className="sw-topbar">
        <button
          ref={menuRef}
          className="sw-icon-button sw-menu"
          aria-label="Open workspace navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(!navOpen)}
        >
          <FiMenu />
        </button>
        <a className="sw-brand" href="/" aria-label="Plotune home">
          <img className="mvp-brand-logo" src={logo} alt="" />
          <strong>
            Plotune <span>Stream</span>
          </strong>
        </a>
        <span className="sw-top-divider" />
        <span className="mvp-top-project">{project?.name || "Workspace"}</span>
        <div className="sw-top-end">
          <button
            className="sw-avatar"
            aria-label="Account"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen(!accountOpen)}
          >
            {(user?.full_name || user?.username || "You")
              .slice(0, 2)
              .toUpperCase()}
          </button>
        </div>
        {accountOpen && (
          <div className="mvp-account-menu">
            <strong>
              {user?.full_name || user?.username || "Your Plotune account"}
            </strong>
            {user?.email && <span>{user.email}</span>}
            {usage && (
              <p>
                {usage.accepted.toLocaleString()} /{" "}
                {usage.allowance.toLocaleString()} events this month
                <br />
                {usage.acceptedToday.toLocaleString()} /{" "}
                {usage.dailyAllowance.toLocaleString()} today
                <br />
                <small>Project owner's account allowance</small>
              </p>
            )}
            <Failure error={usageError} retry={retryDiscovery} />
            <button className="sw-link" onClick={logout}>
              Sign out
            </button>
            <button className="sw-link" onClick={() => setAccountOpen(false)}>
              Close
            </button>
          </div>
        )}
      </header>
      {navOpen && (
        <button
          className="sw-nav-backdrop"
          aria-label="Close workspace navigation"
          onClick={() => setNavOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        inert={mobile && !navOpen ? "" : undefined}
        onKeyDown={(event) => {
          if (event.key === "Escape") setNavOpen(false);
        }}
        className={`sw-sidebar ${navOpen ? "is-open" : ""}`}
      >
        <div className="sw-project-select">
          <span>PROJECT</span>
          <select
            aria-label="Project"
            value={requestedProject}
            onChange={(e) =>
              location({
                project: e.target.value,
                dashboard: null,
                filter: null,
              })
            }
          >
            <option value="" disabled>
              Select a project
            </option>
            {metadata.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            className="sw-link mvp-create-link"
            onClick={() => {
              setName("");
              setCreateError(null);
              setCreateOpen(true);
              setNavOpen(false);
            }}
          >
            <FiPlus />
            Create project
          </button>
        </div>
        <nav aria-label="Workspace navigation">
          {NAV.map(([id, label, Icon]) => (
            <div className="sw-nav-group" key={id}>
              <button
                className={view === id ? "active" : ""}
                aria-current={view === id ? "page" : undefined}
                onClick={() => location({ view: id, dashboard: null })}
              >
                <Icon />
                {label}
              </button>
            </div>
          ))}
        </nav>
      </aside>
      <main className="sw-main">
        <div className="sw-breadcrumb">
          Projects
          <FiChevronRight />
          <span>{project?.name || "Workspace"}</span>
          <FiChevronRight />
          {title}
        </div>
        <div className="sw-page-head">
          <div>
            <h1>{title}</h1>
            <p>
              {view === "events"
                ? "Inspect event names, timestamps, and your own JSON properties."
                : view === "dashboards"
                  ? "Shared views for persistent observation."
                  : "Configure your project once and use it repeatedly."}
            </p>
          </div>
        </div>
        <div className="sw-content">
          <Failure
            error={metadata.error}
            retry={() => {
              metadata.loadProjects();
              metadata.reload();
            }}
          />
          {metadata.projectsLoading || metadata.loading ? (
            <p role="status">Loading your workspace…</p>
          ) : !project ? (
            <Empty
              title={
                requestedProject
                  ? "Project unavailable"
                  : "Create your first project"
              }
              description={
                requestedProject
                  ? "Choose an accessible project, or retry when the service is available."
                  : "Send arbitrary JSON events from your systems and share their context with your team."
              }
              action={
                <button
                  className="sw-button sw-primary"
                  onClick={() => setCreateOpen(true)}
                >
                  Create project
                </button>
              }
            />
          ) : (
            <React.Fragment key={project.id}>
              {view === "events" && (
                <LiveExplorer
                  client={client}
                  project={project}
                  discovery={discoveryState.data}
                  discoveryError={discoveryState.error}
                  retryDiscovery={retryDiscovery}
                  filters={metadata.filters}
                  dashboards={metadata.dashboards}
                  activeFilterId={filterId}
                  onSelectFilter={(filter) => location({ filter })}
                  saveFilter={async (filterName, conditions, id, baseline) => {
                    const base =
                      baseline || metadata.filters.find((f) => f.id === id);
                    const saved = await save(
                      "filters",
                      { id: id || newId(), name: filterName, conditions },
                      base,
                    );
                    location({ filter: saved.id });
                  }}
                  renameFilter={(id, filterName) => {
                    const base = metadata.filters.find((f) => f.id === id);
                    return save("filters", { ...base, name: filterName }, base);
                  }}
                  deleteFilter={async (id, confirmed) => {
                    const base = metadata.filters.find((f) => f.id === id);
                    try {
                      await remove("filters", base, confirmed);
                    } catch (error) {
                      if (
                        error.code !== "filter_referenced" ||
                        !window.confirm(
                          `${error.message}\nDelete this shared Filter anyway?`,
                        )
                      )
                        throw error;
                      await remove("filters", base, true);
                    }
                    location({ filter: null });
                  }}
                />
              )}
              {view === "dashboards" && (
                <Dashboard
                  key={project.id}
                  projectId={project.id}
                  events={[]}
                  now={Date.now()}
                  discovery={discoveryState.data}
                  loadPreview={preview}
                  dashboards={metadata.dashboards}
                  filters={metadata.filters}
                  selectedDashboardId={dashboardId}
                  onOpen={(id) => location({ dashboard: id })}
                  onBack={() => location({ dashboard: null })}
                  onCreate={(record) => save("dashboards", record)}
                  onRename={(id, dashboardName, description) => {
                    const base = metadata.dashboards.find((d) => d.id === id);
                    return save(
                      "dashboards",
                      { ...base, name: dashboardName, description },
                      base,
                    );
                  }}
                  onDelete={(id) =>
                    remove(
                      "dashboards",
                      metadata.dashboards.find((d) => d.id === id),
                    )
                  }
                  onSaveWidget={(id, widget, base) =>
                    save(
                      "dashboards",
                      {
                        ...base,
                        widgets: base.widgets.some((w) => w.id === widget.id)
                          ? base.widgets.map((w) =>
                              w.id === widget.id ? widget : w,
                            )
                          : [...base.widgets, widget],
                      },
                      base,
                    )
                  }
                  onRemoveWidget={(id, widgetId) => {
                    const base = metadata.dashboards.find((d) => d.id === id);
                    return save(
                      "dashboards",
                      {
                        ...base,
                        widgets: base.widgets.filter((w) => w.id !== widgetId),
                      },
                      base,
                    );
                  }}
                  renderGraph={(widget, edit, removeWidget) => (
                    <RemoteGraph
                      key={widget.id}
                      client={client}
                      projectId={project.id}
                      dashboard={dashboard}
                      widget={widget}
                      filters={metadata.filters}
                      onEdit={edit}
                      onRemove={removeWidget}
                    />
                  )}
                />
              )}
              {(view === "api" || view === "mcp") && (
                <ConnectionSetup
                  key={view}
                  client={client}
                  metadata={metadata}
                  mcp={view === "mcp"}
                />
              )}
              {view === "settings" && (
                <ProjectSettings client={client} metadata={metadata} />
              )}
              {view === "webhooks" &&
                (metadata.role === "Member" ? (
                  <Empty
                    title="Owner or admin access required"
                    description="Project owners and admins configure webhooks and inspect delivery status."
                  />
                ) : (
                  <>
                    <Webhooks
                      busy={metadata.busy}
                      projectId={project.id}
                      events={[]}
                      discoveredEventNames={discoveryState.data?.eventNames}
                      webhooks={metadata.webhooks}
                      onCreate={(record) => save("webhooks", record)}
                      onToggle={(id) =>
                        safeAction(() => {
                          const base = metadata.webhooks.find(
                            (w) => w.id === id,
                          );
                          return save(
                            "webhooks",
                            { ...base, enabled: !base.enabled },
                            base,
                          );
                        })
                      }
                      onDelete={(id) => {
                        if (window.confirm("Delete this webhook?"))
                          safeAction(() =>
                            remove(
                              "webhooks",
                              metadata.webhooks.find((w) => w.id === id),
                            ),
                          );
                      }}
                    />
                    <Panel title="Delivery status">
                      <Failure error={deliveryError} />
                      {deliveries.length ? (
                        <div className="sw-table-wrap">
                          <table className="sw-table">
                            <thead>
                              <tr>
                                <th>Event</th>
                                <th>Status</th>
                                <th>Attempts</th>
                                <th>Next attempt</th>
                              </tr>
                            </thead>
                            <tbody>
                              {deliveries.map((d) => (
                                <tr key={d.id}>
                                  <td>{d.eventId}</td>
                                  <td>{d.status}</td>
                                  <td>{d.attempts}</td>
                                  <td>{d.nextAt || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="live-pad">
                          No queued deliveries reported.
                        </p>
                      )}
                    </Panel>
                  </>
                ))}
            </React.Fragment>
          )}
        </div>
      </main>
      {createOpen && (
        <Dialog
          title="Create a project"
          subtitle="A shared home for your events, filters and dashboards."
          onClose={() => setCreateOpen(false)}
        >
          <form
            className="sw-detail-body mvp-create-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setCreateError(null);
              try {
                const created = await metadata.create(name.trim());
                location({
                  project: created.id,
                  view: "api",
                  dashboard: null,
                  filter: null,
                });
                setCreateOpen(false);
              } catch (error) {
                setCreateError(error);
              }
            }}
          >
            <label>
              Project name
              <input
                autoFocus
                required
                maxLength={64}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <p>
              Your new API key will be shown once. Save it before leaving this
              session.
            </p>
            <Failure error={createError} />
            <button
              className="sw-button sw-primary"
              disabled={!name.trim() || metadata.busy}
            >
              Create project
            </button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
