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
  FiCpu,
  FiBookOpen,
} from "react-icons/fi";
import { streamWorkspaceLogin } from "../../utils/streamWorkspaceNavigation";
import { AuthContext } from "../../context/AuthContext";
import { Dialog, Empty, Panel } from "../../StreamWorkspace/WorkspaceUI";
import { AddCreditsDialog, CreditsSummary } from "./Credits";
import Dashboard from "../Dashboard";
import Webhooks from "../Webhooks";
import { WebhookSigningDialog } from "./WebhookSigning";
import Catalog from "./Catalog";
import { buildWidgetSeries } from "../widgetModel";
import {
  createStreamClient,
  collectEvents,
  WORKSPACE_ENABLED,
  resourceData,
  wireConditions,
} from "./client";
import { useWorkspaceMetadata } from "./hooks";
import LiveExplorer, { Failure } from "./LiveExplorer";
import RemoteGraph from "./RemoteGraph";
import ProjectSettings from "./ProjectSettings";
import ConnectionSetup from "./ConnectionSetup";
import DevicesHealth from "./DevicesHealth";
import WorkspaceEntry from "./WorkspaceEntry";
import { pollWhileVisible } from "./visiblePolling";
import logo from "../../assets/logo.png";
import "../../StreamWorkspace/workspace.css";
import "../stream.css";
import "./live.css";

const NAV = [
  ["events", "Events", FiActivity],
  ["dashboards", "Dashboards", FiBarChart2],
  ["devices", "Devices", FiCpu],
  ["catalog", "Catalog", FiBookOpen],
  ["api", "API setup", FiCode],
  ["mcp", "MCP setup", FiTerminal],
  ["webhooks", "Webhooks", FiSend],
  ["settings", "Project Settings", FiSettings],
];
const newId = () => crypto.randomUUID();
const DELIVERY_STATUS = { pending: "Retrying", delivered: "Delivered", failed: "Failed", cancelled: "Cancelled", expired: "Expired" };
const deliveryStatus = (status) => DELIVERY_STATUS[status] ?? status;
// The receiver's last answer: its HTTP status, "No answer" for a timeout or refused
// connection, or a dash before the first attempt.
const responseLabel = (d) => (!d.attemptedAt ? "—" : d.responseStatus ? `HTTP ${d.responseStatus}` : "No answer");
// signing is shown, never sent: the server keeps the secret on edits.
const cleanResource = ({ revision, updatedAt, createdAt, signing, ...record }) => ({
  ...record,
  ...(record.conditions
    ? { conditions: wireConditions(record.conditions) }
    : {}),
});

const PLAN_NAMES = { free: "Free", premium: "Premium", business: "Business" };
const planName = (plan) => PLAN_NAMES[plan] || plan;

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
        <WorkspaceEntry unavailable />
      ) : auth.isLoading ? (
        <WorkspaceEntry loading />
      ) : !auth.token ? (
        <WorkspaceEntry loginTo={streamWorkspaceLogin(loginLocation.search)} sharedLink={!!loginLocation.search} />
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
  const accountTrigger = useRef(null);
  const accountMenu = useRef(null);
  useEffect(() => {
    if (!accountOpen) return undefined;
    const dismiss = (event) => {
      if (event.type === "keydown") {
        if (event.key !== "Escape") return;
        event.preventDefault();
        accountTrigger.current?.focus();
      } else if (accountMenu.current?.contains(event.target) || accountTrigger.current?.contains(event.target)) return;
      setAccountOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", dismiss);
    return () => { document.removeEventListener("keydown", dismiss); document.removeEventListener("pointerdown", dismiss); };
  }, [accountOpen]);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState(null);
  const view = NAV.some(([id]) => id === params.get("view"))
    ? params.get("view")
    : "events";
  const metadata = useWorkspaceMetadata(client, requestedProject, ["settings", "webhooks"].includes(view) ? view : null);
  const atProjectLimit = Boolean(metadata.plan) && metadata.plan.ownedProjects >= metadata.plan.projectLimit;
  const [refreshingShared, setRefreshingShared] = useState(false);
  const refreshShared = async () => {
    setRefreshingShared(true);
    // Check the selected project first; a denied scope must not cancel the fresh
    // project list that lets a member choose another accessible project.
    try { await metadata.reload(); await metadata.loadProjects(); }
    finally { setRefreshingShared(false); }
  };
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
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [deliveryRefresh, setDeliveryRefresh] = useState(0);
  // Signing dialog: which webhook, and a secret that is shown once after create or rotation.
  const [signing, setSigning] = useState(null);
  const [discoveryRefresh, setDiscoveryRefresh] = useState(0);
  const [usageRefresh, setUsageRefresh] = useState(0);
  // A shared promo link (?redeem=CODE) opens Add credits once, prefilled.
  const [redeem, setRedeem] = useState(() => {
    const code = params.get("redeem");
    return code ? { code: code.slice(0, 32) } : null;
  });
  useEffect(() => {
    if (!params.has("redeem")) return;
    const next = new URLSearchParams(params);
    next.delete("redeem");
    setParams(next, { replace: true });
  }, [params, setParams]);
  // Webhooks use discovered event names so Add webhook offers a choice, not a blank field.
  const needsDiscovery = view === "events" || view === "dashboards" || view === "webhooks" || view === "catalog";
  // A refresh keeps the current project's discovery on screen until the new one arrives.
  useEffect(() => {
    setDiscoveryState((current) => (current.projectId === project?.id ? current : {}));
    if (!project?.id || !needsDiscovery) return undefined;
    const controller = new AbortController();
    client
      .discovery(project.id, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setDiscoveryState({ projectId: project.id, data: result });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setDiscoveryState({ projectId: project.id, error });
      });
    return () => controller.abort();
  }, [client, project?.id, needsDiscovery, discoveryRefresh]);
  useEffect(() => {
    setUsage(null); setUsageError(null);
    if (!project?.id || !accountOpen) return undefined;
    const controller = new AbortController();
    client.usage(project.id, controller.signal).then((result) => {
      if (!controller.signal.aborted) setUsage(result);
    }).catch((error) => { if (!controller.signal.aborted) setUsageError(error); });
    return () => controller.abort();
  }, [client, project?.id, accountOpen, usageRefresh]);
  useEffect(() => {
    setDeliveries([]); setDeliveryError(null); setDeliveryLoading(false);
    if (!project?.id || view !== "webhooks") return undefined;
    const controller = new AbortController();
    const load = () => {
      setDeliveryLoading(true);
      return client
        .deliveries(project.id, controller.signal)
        .then((r) => {
          if (!controller.signal.aborted) {
            setDeliveries(r.items);
            setDeliveryError(null);
          }
        })
        .catch((error) => {
          if (!controller.signal.aborted) setDeliveryError(error);
        }).finally(() => { if (!controller.signal.aborted) setDeliveryLoading(false); });
    };
    const stop = pollWhileVisible(load, 30000);
    return () => {
      controller.abort();
      stop();
    };
  }, [client, project?.id, view, deliveryRefresh]);
  useEffect(() => setSigning(null), [project?.id, view]);
  const retryDiscovery = () => setDiscoveryRefresh((r) => r + 1);
  const save = (kind, record, base) =>
    metadata.mutate(() =>
      client.saveResource(project.id, kind, cleanResource(record), base),
    );
  // The secret is kept as soon as the write succeeds, so a failed refresh afterwards
  // cannot lose it; the refresh failure still shows on the workspace.
  // A response that arrives after the user moved to another project or view is not shown
  // there; the secret can be rotated again from its own project.
  const place = useRef("");
  place.current = `${project?.id}|${view}`;
  const withSecret = async (write, rotated) => {
    let shown = false;
    const origin = place.current;
    try {
      await metadata.mutate(async () => {
        const result = await write();
        if (result?.signingSecret && place.current === origin) {
          shown = true;
          // Keep the written webhook too: a failed refresh leaves it out of the list.
          setSigning({ id: result.id, project: origin, secret: result.signingSecret, rotated, error: null, webhook: resourceData(result) });
        }
        return result;
      });
    } catch (error) {
      if (!shown) throw error;
    }
  };
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
    <div className="sw-app st-app live-workspace ph-no-capture rr-block">
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
          <img className="st-brand-logo" src={logo} alt="" />
          <strong>
            Plotune <span>Stream</span>
          </strong>
        </a>
        <span className="sw-top-divider" />
        <span className="st-top-project">{project?.name || "Workspace"}</span>
        <div className="sw-top-end">
          <button
            className="sw-avatar"
            ref={accountTrigger}
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
          <div ref={accountMenu} className="st-account-menu" aria-label="Your Plotune account">
            <strong>
              {user?.full_name || user?.username || "Your Plotune account"}
            </strong>
            {user?.email && <span>{user.email}</span>}
            {project && !usage && !usageError && <p role="status">Loading credits…</p>}
            {usage?.monthly && (
              <CreditsSummary usage={usage} onAdd={() => { setAccountOpen(false); setRedeem({ code: "" }); }} />
            )}
            <Failure error={usageError} retry={() => setUsageRefresh((value) => value + 1)} />
            <Link className="sw-link" to="/dashboard">Dashboard</Link>
            <Link className="sw-link" to="/profile">Manage account</Link>
            <button className="sw-link" onClick={() => setUsageRefresh((value) => value + 1)}>Refresh credits</button>
            <button className="sw-link" onClick={logout}>
              Sign out
            </button>
            <button className="sw-link" onClick={() => { setAccountOpen(false); accountTrigger.current?.focus(); }}>
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
            className="sw-link st-create-link"
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
          {/* Data views, then setup; Project Settings is its own link below. */}
          {[NAV.slice(0, 4), NAV.slice(4, -1)].map((items, index) => (
            <div className="sw-nav-group" key={index}>
              {index === 1 && <p>SETUP</p>}
              {items.map(([id, label, Icon]) => (
                <button key={id} className={view === id ? "active" : ""}
                  aria-current={view === id ? "page" : undefined}
                  onClick={() => location({ view: id, dashboard: null })}>
                  <Icon />{label}
                </button>
              ))}
            </div>
          ))}
          <button className={`sw-settings-link ${view === "settings" ? "active" : ""}`}
            aria-current={view === "settings" ? "page" : undefined}
            onClick={() => location({ view: "settings", dashboard: null })}>
            <FiSettings />Project Settings
          </button>
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
                ? "Inspect what your systems send. Event names, timestamps, and properties."
                : view === "dashboards"
                  ? "Project dashboards for recurring event views."
                  : view === "devices"
                  ? "Which devices are sending, and anything that needs attention."
                  : view === "catalog"
                  ? "What your events and properties mean, named actions and path rules."
                  : view === "api"
                    ? "Send an event from your device, test bench, or simulation."
                    : view === "mcp"
                      ? "Query this project's events from your AI agent."
                      : view === "webhooks"
                        ? "Forward selected events to an HTTPS endpoint."
                        : "Manage your project and team access."}
            </p>
          </div>
          <button className="sw-link live-shared-refresh" disabled={refreshingShared || metadata.busy || metadata.loading} onClick={refreshShared}>
            {refreshingShared ? "Refreshing…" : "Refresh shared settings"}
          </button>
        </div>
        <div className="sw-content">
          <Failure
            error={metadata.error}
            retry={refreshShared}
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
                  projectKey={metadata.keys[project.id]}
                  onOpenSetup={() => location({ view: "api", dashboard: null })}
                  discovery={discoveryState.data}
                  discoveryError={discoveryState.error}
                  retryDiscovery={retryDiscovery}
                  filters={metadata.filters}
                  dashboards={metadata.dashboards}
                  activeFilterId={filterId}
                  onSelectFilter={(filter) => location({ filter })}
                  saveFilter={async (filterName, conditions, id, baseline, creationId) => {
                    const base =
                      baseline || metadata.filters.find((f) => f.id === id);
                    const saved = await save(
                      "filters",
                      { id: id || creationId || newId(), name: filterName, conditions },
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
              onRefresh={() => metadata.reload()}
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
              {view === "devices" && <DevicesHealth client={client} project={project} />}
              {view === "catalog" && (
                <Catalog key={project.id} client={client} project={project} role={metadata.role} discovery={discoveryState.data}
                  discoveryError={discoveryState.error} retryDiscovery={retryDiscovery} filters={metadata.filters} />
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
              {view === "webhooks" && (
                <>
                  <Webhooks
                    busy={metadata.busy}
                    projectId={project.id}
                    events={[]}
                    discoveredEventNames={discoveryState.data?.eventNames}
                    webhooks={metadata.webhooks}
                    readOnly={metadata.role === "Member"}
                    onSigning={(id) => setSigning({ id, secret: null, rotated: false, error: null, webhook: null })}
                    onCreate={(record) =>
                      withSecret(() => client.saveResource(project.id, "webhooks", cleanResource(record)), false)
                    }
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
                  {signing && (metadata.webhooks.some((w) => w.id === signing.id) || (signing.webhook && signing.project === place.current)) && (
                    <WebhookSigningDialog
                      webhook={signing.webhook ?? metadata.webhooks.find((w) => w.id === signing.id)}
                      secret={signing.secret}
                      rotated={signing.rotated}
                      canManage={metadata.role !== "Member"}
                      busy={metadata.busy}
                      error={signing.error}
                      onClose={() => setSigning(null)}
                      onRotate={() =>
                        withSecret(
                          () => client.rotateWebhookSigning(project.id, metadata.webhooks.find((w) => w.id === signing.id)),
                          true,
                        ).catch((error) => {
                          setSigning((current) => current && { ...current, error });
                          // Someone else changed the webhook: load its current revision so a retry can succeed.
                          if (error.code === "revision_conflict") metadata.reload(undefined, false).catch(() => {});
                        })
                      }
                    />
                  )}
                  <Panel title="Delivery status" meta="Last 100 deliveries">
                    <Failure error={deliveryError} retry={() => setDeliveryRefresh((value) => value + 1)} />
                    {deliveryLoading && !deliveries.length && <p className="live-pad" role="status">Loading delivery status…</p>}
                    {deliveries.length ? (
                      <div className="sw-table-wrap" tabIndex={0} role="region" aria-label="Webhook deliveries">
                        <table className="sw-table">
                          <thead>
                            <tr>
                              <th>Webhook</th>
                              <th>Status</th>
                              <th>Attempts</th>
                              <th>Last response</th>
                              <th>Next attempt · UTC</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deliveries.map((d) => (
                              <tr key={d.id}>
                                <td>
                                  {metadata.webhooks.find((w) => w.id === d.webhookId)?.eventName ?? d.webhookId}
                                  <small className="wh-event-id">{d.eventId}</small>
                                </td>
                                <td><span className={`wh-status wh-${d.status}`}>{deliveryStatus(d.status)}</span></td>
                                <td>{d.attempts}</td>
                                <td>{responseLabel(d)}</td>
                                <td>{d.status === "pending" && d.nextAt ? <time dateTime={d.nextAt}>{new Date(d.nextAt).toLocaleString("en-GB", { timeZone: "UTC" })}</time> : "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : !deliveryLoading && !deliveryError && (
                      <p className="live-pad">
                        No deliveries yet. They appear here when a matching event is captured.
                      </p>
                    )}
                  </Panel>
                </>
              )}
            </React.Fragment>
          )}
        </div>
      </main>
      {redeem && (
        <AddCreditsDialog
          client={client}
          initialCode={redeem.code}
          onClose={() => setRedeem(null)}
          onRedeemed={() => setUsageRefresh((value) => value + 1)}
        />
      )}
      {createOpen && (
        <Dialog
          title="Create a project"
          subtitle="A shared home for your events, filters and dashboards."
          onClose={() => setCreateOpen(false)}
        >
          {atProjectLimit ? (
            <div className="sw-detail-body st-create-form" role="status">
              <p>
                Your {planName(metadata.plan.plan)} plan includes {metadata.plan.projectLimit} project{metadata.plan.projectLimit === 1 ? "" : "s"}, and you own{" "}
                {metadata.plan.ownedProjects}. Projects other people share with you don't count.
              </p>
              <button autoFocus className="sw-button sw-primary" type="button" onClick={() => setCreateOpen(false)}>
                Close
              </button>
            </div>
          ) : (
          <form
            className="sw-detail-body st-create-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setCreateError(null);
              try {
                const created = await metadata.create(name.trim());
                location({
                  project: created.id,
                  view: "events",
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
            {metadata.plan && (
              <p className="st-plan-note">
                This will be project {metadata.plan.ownedProjects + 1} of {metadata.plan.projectLimit} on your {planName(metadata.plan.plan)} plan.
              </p>
            )}
            <Failure error={createError} />
            <button
              className="sw-button sw-primary"
              disabled={!name.trim() || metadata.busy}
            >
              Create project
            </button>
          </form>
          )}
        </Dialog>
      )}
    </div>
  );
}
