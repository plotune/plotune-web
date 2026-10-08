import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiChevronRight,
  FiCode,
  FiCopy,
  FiEye,
  FiEyeOff,
  FiKey,
  FiMenu,
  FiPlus,
  FiSearch,
  FiSend,
  FiSettings,
  FiTerminal,
  FiX,
} from "react-icons/fi";
import { Dialog, Panel } from "../StreamWorkspace/WorkspaceUI";
import Dashboard from "./Dashboard";
import FilterControls from "./FilterControls";
import ExportEvents from "./ExportEvents";
import Webhooks from "./Webhooks";
import { loadProjectResources, saveProjectResources } from "./projectResourceStore";
import plotuneLogo from "../assets/logo.png";
import "../StreamWorkspace/workspace.css";
import "./mvp.css";
import {
  initialProjects,
  CAPTURE_ENDPOINT,
  MCP_ENDPOINT,
  SNAPSHOT,
  EVENTS_PER_PAGE,
  cursorPage,
  createSimulatedFirstEvent,
  previewValue,
  filterEvents,
  ingestionSnippet,
  mcpSnippet,
} from "./eventModel";

const navigation = [
  ["events", "Events", FiActivity],
  ["dashboards", "Dashboards", FiBarChart2],
  ["api", "API setup", FiCode],
  ["mcp", "MCP setup", FiTerminal],
  ["webhooks", "Webhooks", FiSend],
  ["settings", "Project Settings", FiSettings],
];
const eventTime = (value) => new Date(value).toISOString().slice(11, 23);
const eventDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
const mockKey = (id) =>
  `plt_demo_${id}_${Math.random().toString(16).slice(2, 10)}`;

export default function StreamMVP() {
  const [params, setParams] = useSearchParams();
  const view = navigation.some(([id]) => id === params.get("view"))
    ? params.get("view")
    : "events";
  const [projects, setProjects] = useState(initialProjects);
  const projectId = projects.some((p) => p.id === params.get("project"))
    ? params.get("project")
    : "first";
  const project = projects.find((p) => p.id === projectId);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("All events");
  const [range, setRange] = useState("24h");
  const [cursorStack, setCursorStack] = useState([null]);
  const [resources, setResources] = useState(loadProjectResources);
  const [activeFilterId, setActiveFilterId] = useState(null);
  const [eventConditions, setEventConditions] = useState([]);
  const [webhooks, setWebhooks] = useState({});
  const [language, setLanguage] = useState("curl");
  const [revealed, setRevealed] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [projectName, setProjectName] = useState("");
  const [creatingName, setCreatingName] = useState("");
  const [pending, setPending] = useState({});
  const [accepting, setAccepting] = useState(false);
  const [clock, setClock] = useState(Date.parse(SNAPSHOT));
  const [monthlyAccepted, setMonthlyAccepted] = useState(15320);
  const [members, setMembers] = useState(() => Object.fromEntries(initialProjects.map((p, i) => [p.id, [
    { id: `${p.id}-owner`, name: i === 0 ? "Vera K. (you)" : "You", email: "engineer@example.test", role: "Owner" },
  ]])));
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [invitePrompt, setInvitePrompt] = useState({});
  const [mcpStates, setMcpStates] = useState({});
  const [accountOpen, setAccountOpen] = useState(false);
  const projectFilters = resources.filters[projectId] || [];
  const projectWidgets = resources.dashboards[projectId] || [];
  const mcpState = mcpStates[projectId] || "Not checked";
  const hasEvents = project.events.length > 0;
  const filtered = useMemo(
    () =>
      filterEvents(project.events, {
        search,
        name,
        range,
        now: new Date(clock).toISOString(),
        conditions: eventConditions,
      }),
    [project.events, search, name, range, clock, eventConditions],
  );
  const page = useMemo(
    () => cursorPage(filtered, cursorStack[cursorStack.length - 1], EVENTS_PER_PAGE),
    [filtered, cursorStack],
  );
  const eventNames = [...new Set(project.events.map((e) => e.event))].sort();
  const pendingEvents = pending[projectId] || [];
  const latest = [...project.events].sort(
    (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
  )[0];
  const notify = (text) => setToast(text);
  const setLocation = (nextView, nextProject = projectId) => {
    setParams({
      ...(nextView !== "events" ? { view: nextView } : {}),
      ...(nextProject !== "first" ? { project: nextProject } : {}),
    });
    setNavOpen(false);
    setAccountOpen(false);
    setDialog(null);
    setSearch("");
    setName("All events");
    setRange("24h");
    setActiveFilterId(null);
    setEventConditions([]);
    setCursorStack([null]);
    setRevealed(false);
    window.scrollTo({ top: 0 });
  };
  const updateProject = (change) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, ...change } : p)),
    );
  const copy = async (text, what) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(`${what} copied.`);
    } catch {
      notify("Clipboard unavailable. Select the text and copy it manually.");
    }
  };
  const sendPreview = () => {
    if (accepting) return;
    setAccepting(true);
  };
  useEffect(() => {
    setRevealed(false);
    setSearch("");
    setName("All events");
    setRange("24h");
    setActiveFilterId(null);
    setEventConditions([]);
    setCursorStack([null]);
    setAccepting(false);
    setProjectName(project.name);
  }, [projectId, project.name]);
  useEffect(() => {
    saveProjectResources(resources);
  }, [resources]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!accepting) return;
    const t = setTimeout(() => {
      const stamp = clock + 1000;
      const event = createSimulatedFirstEvent(
        `local-${stamp}-${projectId}`,
        new Date(stamp).toISOString(),
      );
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, events: [event, ...p.events] } : p,
        ),
      );
      setClock(stamp);
      setMonthlyAccepted((n) => n + 1);
      setAccepting(false);
      setSearch("");
      setName("All events");
      setRange("24h");
      setCursorStack([null]);
      setParams(projectId === "first" ? {} : { project: projectId });
      if (project.events.length === 0) setInvitePrompt((prev) => ({ ...prev, [projectId]: true }));
      notify(`First event received · ${event.event}`);
    }, 700);
    return () => clearTimeout(t);
  }, [accepting, clock, projectId, setParams]);
  useEffect(() => {
    if (mcpState !== "Checking") return;
    const t = setTimeout(
      () =>
        setMcpStates((prev) => ({
          ...prev,
          [projectId]: "Demo connection ready",
        })),
      900,
    );
    return () => clearTimeout(t);
  }, [mcpState, projectId]);
  const resetFilters = () => {
    setSearch("");
    setName("All events");
    setRange("24h");
    setActiveFilterId(null);
    setEventConditions([]);
    setCursorStack([null]);
  };
  const selectSavedFilter = (filterId) => {
    const filter = projectFilters.find((item) => item.id === filterId);
    setActiveFilterId(filterId);
    setEventConditions(filter ? filter.conditions : []);
    setCursorStack([null]);
  };
  const setConditions = (conditions) => {
    setEventConditions(conditions);
    setCursorStack([null]);
  };
  const saveNewFilter = (filterName, conditions) => {
    const filter = { id: `${projectId}-filter-${Date.now()}`, name: filterName, conditions: conditions.map((item) => ({ ...item })) };
    setResources((current) => ({ ...current, filters: { ...current.filters, [projectId]: [...(current.filters[projectId] || []), filter] } }));
    setActiveFilterId(filter.id);
  };
  const saveFilterChanges = () => {
    setResources((current) => ({
      ...current,
      filters: { ...current.filters, [projectId]: (current.filters[projectId] || []).map((filter) => filter.id === activeFilterId ? { ...filter, conditions: eventConditions.map((item) => ({ ...item })) } : filter) },
    }));
  };
  const renameFilter = (filterId, filterName) => {
    setResources((current) => ({ ...current, filters: { ...current.filters, [projectId]: (current.filters[projectId] || []).map((filter) => filter.id === filterId ? { ...filter, name: filterName } : filter) } }));
  };
  const deleteFilter = (filterId) => {
    setResources((current) => ({ ...current, filters: { ...current.filters, [projectId]: (current.filters[projectId] || []).filter((filter) => filter.id !== filterId) } }));
    if (activeFilterId === filterId) {
      setActiveFilterId(null);
      setEventConditions([]);
    }
  };
  const saveWidget = (widget) => {
    setResources((current) => {
      const previous = current.dashboards[projectId] || [];
      const next = previous.some((item) => item.id === widget.id)
        ? previous.map((item) => item.id === widget.id ? widget : item)
        : [...previous, widget];
      return { ...current, dashboards: { ...current.dashboards, [projectId]: next } };
    });
  };
  const removeWidget = (widgetId) => {
    setResources((current) => ({ ...current, dashboards: { ...current.dashboards, [projectId]: (current.dashboards[projectId] || []).filter((widget) => widget.id !== widgetId) } }));
  };
  const queuePreviewEvent = () => {
    const count = pendingEvents.length;
    const stamp = clock + (count + 1) * 1000;
    const candidates = [
      {
        event: "sensor.reading",
        properties: { range_m: 2.6 + count * 0.1, confidence: 0.91 + count * 0.01, state: "valid" },
      },
      {
        event: "test.failed",
        properties: { suite: "sensor_check", result: "failed", attempt: count + 1 },
      },
      {
        event: "environment",
        properties: { temperature: 21.8 + count * 0.1, humidity: 40.2, state: "stable" },
      },
    ];
    const e = {
      ...candidates[count % candidates.length],
      id: `pending-${projectId}-${stamp}`,
      timestamp: new Date(stamp).toISOString(),
    };
    setPending((prev) => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), e],
    }));
  };
  const acceptPending = () => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, events: [...pendingEvents, ...p.events] }
          : p,
      ),
    );
    setClock((c) =>
      Math.max(c, ...pendingEvents.map((e) => Date.parse(e.timestamp))),
    );
    setMonthlyAccepted((n) => n + pendingEvents.length);
    setPending((prev) => ({ ...prev, [projectId]: [] }));
    resetFilters();
    notify("New demo events added. Filters reset so you can inspect them.");
  };
  const apiKey = (
    <div className="mvp-key">
      <FiKey />
      <code aria-label="Project API key">
        {revealed ? project.key : "plt_demo_••••••••••••••••"}
      </code>
      <button
        className="sw-icon-button"
        aria-label={revealed ? "Hide API key" : "Reveal API key"}
        onClick={() => setRevealed((v) => !v)}
      >
        {revealed ? <FiEyeOff /> : <FiEye />}
      </button>
      <button
        className="sw-icon-button"
        aria-label="Copy API key"
        onClick={() => copy(project.key, "Demo API key")}
      >
        <FiCopy />
      </button>
    </div>
  );
  const example = (compact = false) => (
    <div className={`mvp-integration ${compact ? "compact" : ""}`}>
      <div className="mvp-example-heading">
        <strong>Send an event over HTTP</strong>
        <span>Any language. Any JSON properties.</span>
      </div>
      <div className="sw-tabs" role="group" aria-label="Integration language">
        {["curl", "Python", "C/C++", "Arduino / ESP32", "MATLAB", "ROS 2", "CAPL"].map((l) => (
          <button
            key={l}
            className={language === l ? "active" : ""}
            aria-pressed={language === l}
            onClick={() => setLanguage(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="mvp-snippet">
        <button
          className="sw-button mvp-copy-code"
          aria-label="Copy integration snippet"
          onClick={() =>
            copy(
              ingestionSnippet(language, project.key),
              "Illustrative integration snippet",
            )
          }
        >
          <FiCopy />
          Copy
        </button>
        <pre
          className="sw-code"
          tabIndex={0}
          aria-label={`${language} integration snippet`}
        >
          {ingestionSnippet(language, project.key)}
        </pre>
      </div>
      <p className="mvp-contract-note">
        Illustrative API contract · demo key · no requests are sent by this
        preview.
        {language === "CAPL" ? " CAPL uses adapter pseudocode for your test environment." : ""}
        {language === "Arduino / ESP32" ? " Configure TLS with the server CA certificate." : ""}
        {language === "ROS 2" ? " Example code belongs inside an rclpy subscription callback." : ""}
      </p>
    </div>
  );
  const firstEvent = (
    <div className="mvp-first-event">
      <span className="mvp-first-icon">
        <FiTerminal />
      </span>
      <p className="sw-eyebrow">PROJECT CREATED</p>
      <h2>Waiting for your first event</h2>
      <p>
        Stream is listening. Send an HTTP event from any system to see it arrive here.
      </p>
      <div className={`mvp-listening ${accepting ? "receiving" : ""}`} role="status">
        <span className="mvp-listening-dot" />
        {accepting ? "Receiving motor.sample…" : "Listening for events"}
      </div>
      {example(true)}
      <div className="mvp-activation-preview">
        <button
          className="sw-button sw-primary"
          disabled={accepting}
          onClick={sendPreview}
        >
          {accepting ? "Receiving event…" : "Simulate event received"}
          <FiArrowRight />
        </button>
      </div>
      <p className="mvp-first-foot">Use the example above to send your first event. The simulation demonstrates the experience in this browser.</p>
    </div>
  );

  function explorer() {
    if (!hasEvents) return firstEvent;
    return (
      <>
        {invitePrompt[projectId] && (
          <div className="mvp-invite-prompt">
            <div><strong>First event received</strong><span>motor.sample · just now</span></div>
            <button className="sw-button sw-primary" onClick={() => { setInvitePrompt((prev) => ({ ...prev, [projectId]: false })); setLocation("settings"); }}>Invite your colleagues</button>
            <button className="sw-link" onClick={() => setInvitePrompt((prev) => ({ ...prev, [projectId]: false }))}>Skip</button>
          </div>
        )}
        <div className="mvp-event-summary">
          <span>
            <strong>{project.events.length}</strong> demo events in this project
          </span>
          <span>
            Last received{" "}
            <strong>{latest ? eventTime(latest.timestamp) : "—"}</strong> UTC
          </span>
        </div>
        <div className="sw-toolbar mvp-filters">
          <label className="sw-search">
            <FiSearch />
            <input
              aria-label="Search events and properties"
              placeholder="Search event names and properties…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCursorStack([null]);
              }}
            />
          </label>
          <select
            aria-label="Filter event name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setCursorStack([null]);
            }}
          >
            <option>All events</option>
            {eventNames.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <select
            aria-label="Event time range"
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              setCursorStack([null]);
            }}
          >
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="all">All time</option>
          </select>
          {(search || name !== "All events" || range !== "24h") && (
            <button className="sw-link" onClick={resetFilters}>
              Clear filters
            </button>
          )}
        </div>
        <FilterControls
          events={project.events}
          savedFilters={projectFilters}
          activeFilterId={activeFilterId}
          conditions={eventConditions}
          onSelectFilter={selectSavedFilter}
          onConditionsChange={setConditions}
          onSaveNew={saveNewFilter}
          onSaveChanges={saveFilterChanges}
          onRename={renameFilter}
          onDelete={deleteFilter}
          referenceCount={projectWidgets.filter((widget) => widget.filterId === activeFilterId).length}
        />
        <ExportEvents
          events={project.events}
          query={{ search, name, range, now: new Date(clock).toISOString(), conditions: eventConditions }}
          projectName={project.name}
        />
        <div className="mvp-list-status">
          <span>{page.items.length} events on this page · {EVENTS_PER_PAGE} per page · newest first · UTC</span>
          <button className="sw-link" onClick={queuePreviewEvent}>
            <FiPlus />
            Simulate incoming event
          </button>
        </div>
        {pendingEvents.length > 0 && (
          <button className="mvp-new-events" onClick={acceptPending}>
            <FiActivity />
            {pendingEvents.length} new demo{" "}
            {pendingEvents.length === 1 ? "event" : "events"} · Show newest
            <FiArrowRight />
          </button>
        )}
        <div className="sw-panel mvp-events-panel">
          {filtered.length ? (
            <div className="sw-table-wrap">
              <table className="sw-table mvp-table">
                <thead>
                  <tr>
                    <th>Timestamp · UTC</th>
                    <th>Event</th>
                    <th>Properties</th>
                    <th aria-label="Open event" />
                  </tr>
                </thead>
                <tbody>
                  {page.items.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <button
                          className="mvp-time-button"
                          onClick={() => setDialog({ kind: "event", event: e })}
                          title={e.timestamp}
                        >
                          <time dateTime={e.timestamp}>
                            {eventTime(e.timestamp)}
                          </time>
                          <small>{eventDate(e.timestamp)}</small>
                        </button>
                      </td>
                      <td>
                        <button
                          className="sw-link sw-mono"
                          onClick={() => setDialog({ kind: "event", event: e })}
                        >
                          {e.event}
                        </button>
                      </td>
                      <td>
                        <div className="mvp-property-preview">
                          {Object.entries(e.properties)
                            .slice(0, 3)
                            .map(([k, v]) => (
                              <span
                                key={k}
                                title={`${k}: ${JSON.stringify(v)}`}
                              >
                                <em>{k}</em>
                                <b>{previewValue(v)}</b>
                              </span>
                            ))}
                          {Object.keys(e.properties).length > 3 && (
                            <button
                              className="mvp-more-properties"
                              aria-label={`Show all properties for ${e.event} at ${eventTime(e.timestamp)}`}
                              onClick={() =>
                                setDialog({ kind: "event", event: e })
                              }
                            >
                              +{Object.keys(e.properties).length - 3}
                            </button>
                          )}
                          {Object.keys(e.properties).length === 0 && (
                            <span className="mvp-no-properties">
                              No properties
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          className="sw-icon-button"
                          aria-label={`Inspect ${e.event} at ${eventTime(e.timestamp)}`}
                          onClick={() => setDialog({ kind: "event", event: e })}
                        >
                          <FiChevronRight />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mvp-filter-empty">
              <FiSearch />
              <h2>No events match these filters</h2>
              <p>
                Search another event name or property, or widen the time range.
              </p>
              <button className="sw-button" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
        {(page.nextCursor || cursorStack.length > 1) && (
          <nav className="mvp-pagination" aria-label="Event pages">
            <button
              className="sw-button"
              disabled={cursorStack.length === 1}
              onClick={() => setCursorStack((current) => current.slice(0, -1))}
            >
              Previous
            </button>
            <span>{EVENTS_PER_PAGE} events per page</span>
            <button
              className="sw-button"
              disabled={!page.nextCursor}
              onClick={() => page.nextCursor && setCursorStack((current) => [...current, page.nextCursor])}
            >
              Next
            </button>
          </nav>
        )}
        <p className="mvp-explorer-foot">
          Event names and properties are defined by your systems. No schema
          configuration is required.
        </p>
      </>
    );
  }
  function apiSetup() {
    return (
      <>
        <Panel
          title="Project connection"
          meta={project.name}
          action={<button className="sw-link" onClick={() => setDialog({ kind: "regenerate" })}>Regenerate key</button>}
        >
          <div className="mvp-connection mvp-api-credentials">
            <label>
              Project ID
              <div className="mvp-endpoint">
                <code>{project.id}</code>
                <button
                  className="sw-icon-button"
                  aria-label="Copy project ID"
                  onClick={() => copy(project.id, "Project ID")}
                >
                  <FiCopy />
                </button>
              </div>
            </label>
            <label>Tracker key{apiKey}</label>
            <label>
              Ingestion endpoint
              <div className="mvp-endpoint">
                <code>{CAPTURE_ENDPOINT}</code>
                <button
                  className="sw-icon-button"
                  aria-label="Copy ingestion endpoint"
                  onClick={() => copy(CAPTURE_ENDPOINT, "Ingestion endpoint")}
                >
                  <FiCopy />
                </button>
              </div>
            </label>
            <p>
              The key selects the project. Choose any event name and send
              arbitrary JSON properties.
            </p>
          </div>
        </Panel>
        <Panel title="Capture an event">
          {example()}
          <div className="mvp-api-bottom">
            <p>
              Use HTTP from CAPL, C/C++, Python, ROS, MATLAB, Nexus, or any
              other system. No source registration is needed.
            </p>
          </div>
        </Panel>
      </>
    );
  }
  function mcpSetup() {
    return (
      <>
        <Panel title="Query events from your AI agent">
          <div className="mvp-mcp-intro">
            <span className="mvp-first-icon">
              <FiTerminal />
            </span>
            <div>
              <h3>Your event history, available through MCP.</h3>
              <p>
                Connect an MCP-capable client to query this project's event
                names, timestamps, and properties.
              </p>
              <p className="mvp-muted">
                This connection provides event-history access. It does not
                control hardware.
              </p>
            </div>
          </div>
          <div className="mvp-mcp-example">
            <span>Try asking</span>
            <q>
              Find recent test.failed events and summarize their properties.
            </q>
          </div>
        </Panel>
        <Panel title="MCP connection" meta={project.name}>
          <div className="mvp-connection">
            <label>
              MCP endpoint
              <div className="mvp-endpoint">
                <code>{MCP_ENDPOINT}</code>
                <button
                  className="sw-icon-button"
                  aria-label="Copy MCP endpoint"
                  onClick={() => copy(MCP_ENDPOINT, "MCP endpoint")}
                >
                  <FiCopy />
                </button>
              </div>
            </label>
            <p>
              Add the illustrative configuration to your client. The mock
              project key below selects <strong>{project.name}</strong>.
            </p>
          </div>
          <div className="mvp-mcp-config">
            <div className="sw-code-head">
              <span>Illustrative client configuration</span>
              <button
                className="sw-link"
                onClick={() =>
                  copy(
                    mcpSnippet(project.key),
                    "Illustrative MCP configuration",
                  )
                }
              >
                <FiCopy />
                Copy configuration
              </button>
            </div>
            <pre
              className="sw-code"
              tabIndex={0}
              aria-label="MCP configuration"
            >
              {mcpSnippet(project.key)}
            </pre>
            <p className="mvp-contract-note">
              Configuration format varies by client. Endpoint, key, and
              connection check are mocked.
            </p>
          </div>
          <div className="mvp-mcp-status">
            <span
              className={`mvp-connection-dot ${mcpState === "Demo connection ready" ? "ready" : ""}`}
            />
            <span role="status">
              {mcpState === "Checking" ? "Checking demo connection…" : mcpState}
            </span>
            <button
              className="sw-button"
              disabled={mcpState === "Checking"}
              onClick={() =>
                setMcpStates((prev) => ({ ...prev, [projectId]: "Checking" }))
              }
            >
              {mcpState === "Demo connection ready"
                ? "Check again"
                : "Check demo connection"}
            </button>
          </div>
        </Panel>
      </>
    );
  }
  function settings() {
    return (
      <>
        <Panel title="Project">
          <form
            className="mvp-settings-form"
            onSubmit={(e) => {
              e.preventDefault();
              updateProject({ name: projectName.trim() });
              notify("Project name updated for this session.");
            }}
          >
            <label>
              Project name
              <input
                required
                maxLength={64}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>
            <p>
              This project keeps its event history together. Event properties
              remain unrestricted.
            </p>
            <button
              className="sw-button sw-primary"
              disabled={
                !projectName.trim() || projectName.trim() === project.name
              }
              type="submit"
            >
              Save name
            </button>
          </form>
        </Panel>
        <Panel title="Project members" meta={`${(members[projectId] || []).length} people`}>
          <form className="mvp-invite-form" onSubmit={(e) => {
            e.preventDefault();
            const email = inviteEmail.trim().toLowerCase();
            if (!email) return;
            setMembers((prev) => ({ ...prev, [projectId]: [...(prev[projectId] || []), { id: `${projectId}-${Date.now()}`, name: email.split("@")[0], email, role: inviteRole }] }));
            setInviteEmail("");
            notify("Colleague added to this preview.");
          }}>
            <label>Email<input type="email" required placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} /></label>
            <label>Role<select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}><option>Admin</option><option>Member</option></select></label>
            <button className="sw-button sw-primary" type="submit">Invite colleague</button>
          </form>
          <div className="mvp-member-list">{(members[projectId] || []).map((member) => <div key={member.id}>
            <div><strong>{member.name}</strong><span>{member.email}</span></div>
            {member.role === "Owner" ? <span className="mvp-role owner">Owner</span> : <>
              <select aria-label={`Role for ${member.email}`} value={member.role} onChange={(e) => setMembers((prev) => ({ ...prev, [projectId]: prev[projectId].map((m) => m.id === member.id ? { ...m, role: e.target.value } : m) }))}><option>Admin</option><option>Member</option></select>
              <button className="sw-link" onClick={() => setMembers((prev) => ({ ...prev, [projectId]: prev[projectId].filter((m) => m.id !== member.id) }))}>Remove</button>
            </>}
          </div>)}</div>
          <p className="mvp-members-note">Owners control project and membership settings. Admins manage the project and members. Members can inspect and query events.</p>
        </Panel>
      </>
    );
  }
  function details() {
    if (!dialog) return null;
    const close = () => setDialog(null);
    if (dialog.kind === "event") {
      const e = dialog.event;
      return (
        <Dialog title={e.event} subtitle="Event detail" onClose={close}>
          <div className="sw-detail-body mvp-event-detail">
            <div className="mvp-detail-field">
              <span>Exact timestamp · UTC</span>
              <div>
                <code>{e.timestamp}</code>
                <button
                  className="sw-icon-button"
                  aria-label="Copy event timestamp"
                  onClick={() => copy(e.timestamp, "Timestamp")}
                >
                  <FiCopy />
                </button>
              </div>
            </div>
            <div className="mvp-detail-field">
              <span>Event name</span>
              <div>
                <code>{e.event}</code>
                <button
                  className="sw-icon-button"
                  aria-label="Copy event name"
                  onClick={() => copy(e.event, "Event name")}
                >
                  <FiCopy />
                </button>
              </div>
            </div>
            <div className="sw-code-head">
              <h3>Properties</h3>
              <button
                className="sw-link"
                onClick={() =>
                  copy(JSON.stringify(e.properties, null, 2), "Properties JSON")
                }
              >
                <FiCopy />
                Copy JSON
              </button>
            </div>
            <pre
              className="sw-code mvp-properties-json"
              tabIndex={0}
              aria-label="Complete event properties"
            >
              {JSON.stringify(e.properties, null, 2)}
            </pre>
            <button
              className="sw-button"
              onClick={() =>
                copy(
                  JSON.stringify(
                    {
                      event: e.event,
                      timestamp: e.timestamp,
                      properties: e.properties,
                    },
                    null,
                    2,
                  ),
                  "Event payload",
                )
              }
            >
              <FiCopy />
              Copy complete event
            </button>
            <p className="mvp-contract-note">
              Properties are supplied by the sender. Stream does not assign
              built-in meaning to these fields.
            </p>
          </div>
        </Dialog>
      );
    }
    if (dialog.kind === "create")
      return (
        <Dialog
          title="Create a project"
          subtitle="Give your event history a place to live."
          onClose={close}
        >
          <form
            className="sw-detail-body mvp-create-form"
            onSubmit={(e) => {
              e.preventDefault();
              const id = `project-${Date.now()}`;
              setProjects((prev) => [
                ...prev,
                { id, name: creatingName.trim(), key: mockKey(id), events: [] },
              ]);
              setMembers((prev) => ({ ...prev, [id]: [{ id: `${id}-owner`, name: "You", email: "engineer@example.test", role: "Owner" }] }));
              setLocation("events", id);
              notify(
                "Demo project created. Send your first event to explore the flow.",
              );
            }}
          >
            <label>
              Project name
              <input
                autoFocus
                required
                maxLength={64}
                placeholder="e.g. Sensor validation"
                value={creatingName}
                onChange={(e) => setCreatingName(e.target.value)}
              />
            </label>
            <p>
              A demo API key is generated automatically. You can send any event
              name and arbitrary properties.
            </p>
            <button
              className="sw-button sw-primary"
              type="submit"
              disabled={!creatingName.trim()}
            >
              Create project <FiArrowRight />
            </button>
          </form>
        </Dialog>
      );
    return (
      <Dialog
        title="Regenerate the demo key?"
        subtitle={project.name}
        onClose={close}
      >
        <div className="sw-detail-body">
          <p>
            In a real project, the old key would stop accepting requests. This
            preview only replaces the mock key in your setup examples.
          </p>
          <div className="sw-dialog-actions">
            <button className="sw-button" onClick={close}>
              Cancel
            </button>
            <button
              className="sw-button sw-primary"
              onClick={() => {
                updateProject({ key: mockKey(projectId) });
                setRevealed(false);
                setMcpStates((prev) => ({
                  ...prev,
                  [projectId]: "Not checked",
                }));
                close();
                notify("Demo key regenerated. Setup examples are updated.");
              }}
            >
              Regenerate demo key
            </button>
          </div>
        </div>
      </Dialog>
    );
  }
  const title = navigation.find(([id]) => id === view)[1];
  return (
    <div className="sw-app mvp-app">
      <Helmet>
        <title>{project.name} · Plotune Stream</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <header className="sw-topbar">
        <button
          className="sw-icon-button sw-menu"
          aria-label="Open workspace navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <FiMenu />
        </button>
        <a className="sw-brand" href="/stream/workspace/">
          <img className="mvp-brand-logo" src={plotuneLogo} alt="" />
          <strong>
            Plotune <span>Stream</span>
          </strong>
        </a>
        <span className="sw-top-divider" />
        <span className="mvp-top-project">{project.name}</span>
        <div className="sw-top-end">
          <button
            className="sw-avatar mvp-account"
            aria-label="Demo account"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen((v) => !v)}
          >
            VK
          </button>
        </div>
        {accountOpen && (
          <div className="mvp-account-menu">
            <strong>Demo engineer</strong>
            <span>engineer@example.test</span>
            <p>Usage · {monthlyAccepted.toLocaleString("en-US")} / 100,000 events this month</p>
            <small>Preview data · changes reset on reload</small>
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
      <aside className={`sw-sidebar ${navOpen ? "is-open" : ""}`}>
        <div className="sw-project-select">
          <span>PROJECT</span>
          <select
            aria-label="Project"
            value={projectId}
            onChange={(e) => setLocation(view, e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            className="sw-link mvp-create-link"
            onClick={() => {
              setCreatingName("");
              setDialog({ kind: "create" });
              setNavOpen(false);
            }}
          >
            <FiPlus />
            Create project
          </button>
        </div>
        <nav aria-label="Workspace navigation">
          <div className="sw-nav-group">
            {navigation.slice(0, 2).map(([id, label, Icon]) => (
              <button
                key={id}
                className={view === id ? "active" : ""}
                aria-current={view === id ? "page" : undefined}
                onClick={() => setLocation(id)}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
          <div className="sw-nav-group">
            <p>SETUP</p>
            {navigation.slice(2, 5).map(([id, name, Icon]) => (
              <button
                key={id}
                className={view === id ? "active" : ""}
                aria-current={view === id ? "page" : undefined}
                onClick={() => setLocation(id)}
              >
                <Icon />
                {name}
              </button>
            ))}
          </div>
          <button
            className={`sw-settings-link ${view === "settings" ? "active" : ""}`}
            aria-current={view === "settings" ? "page" : undefined}
            onClick={() => setLocation("settings")}
          >
            <FiSettings />
            Project Settings
          </button>
        </nav>
      </aside>
      <main className="sw-main">
        <div className="sw-breadcrumb">
          Projects
          <FiChevronRight />
          <span>{project.name}</span>
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
                  ? "Graph numeric event properties and event counts over a bounded time range."
                : view === "api"
                  ? "Send the first event from any system that can make an HTTP request."
                  : view === "mcp"
                    ? "Query this project’s events from your AI agent."
                    : view === "webhooks"
                      ? "Forward selected events to any HTTPS endpoint."
                      : "Manage the project and the people who can access it."}
            </p>
          </div>
          <div className="sw-page-actions" />
        </div>
        <div className="sw-content">
          {view === "events"
            ? explorer()
            : view === "dashboards"
              ? <Dashboard
                  projectName={project.name}
                  events={project.events}
                  now={new Date(clock).toISOString()}
                  widgets={projectWidgets}
                  savedFilters={projectFilters}
                  onSaveWidget={saveWidget}
                  onRemoveWidget={removeWidget}
                />
            : view === "api"
              ? apiSetup()
              : view === "mcp"
                ? mcpSetup()
                : view === "webhooks"
                  ? <Webhooks
                      projectId={projectId}
                      events={project.events}
                      webhooks={webhooks[projectId] || []}
                      onCreate={(webhook) => setWebhooks((prev) => ({
                        ...prev,
                        [projectId]: [...(prev[projectId] || []), webhook],
                      }))}
                      onToggle={(webhookId) => setWebhooks((prev) => ({
                        ...prev,
                        [projectId]: (prev[projectId] || []).map((webhook) =>
                          webhook.id === webhookId
                            ? { ...webhook, enabled: !webhook.enabled }
                            : webhook,
                        ),
                      }))}
                      onDelete={(webhookId) => setWebhooks((prev) => ({
                        ...prev,
                        [projectId]: (prev[projectId] || []).filter((webhook) => webhook.id !== webhookId),
                      }))}
                    />
                : settings()}
        </div>
        <footer className="sw-main-footer">
          <span>DEMO DATA · UTC</span>
          <span>Events from physical systems. Properties defined by you.</span>
        </footer>
      </main>
      {details()}
      {toast && (
        <div role="status" className="sw-toast">
          <FiCheck />
          <span>{toast}</span>
          <button
            className="sw-icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
}
