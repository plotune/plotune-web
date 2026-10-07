import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiBarChart2,
  FiBox,
  FiCheck,
  FiChevronRight,
  FiClock,
  FiCode,
  FiCpu,
  FiDatabase,
  FiFileText,
  FiGrid,
  FiLayers,
  FiMenu,
  FiPause,
  FiPlay,
  FiPlus,
  FiRadio,
  FiSearch,
  FiSettings,
  FiSliders,
  FiX,
  FiZap,
} from "react-icons/fi";
import { projects, makeData, sourceTypes, initialProcessors } from "./mockData";
import {
  Badge,
  Panel,
  Empty,
  Dialog,
  Trend,
  RunTable,
  EventTable,
} from "./WorkspaceUI";
import "./workspace.css";

const sections = [
  { label: "", items: [["Overview", FiGrid]] },
  {
    label: "TRACK",
    items: [
      ["Events", FiActivity],
      ["Runs", FiLayers],
      ["Measurements", FiSliders],
      ["Records", FiDatabase],
      ["Alarms", FiAlertTriangle],
    ],
  },
  { label: "ANALYZE", items: [["Dashboards", FiBarChart2]] },
  {
    label: "CONNECT",
    items: [
      ["Sources", FiRadio],
      ["Live", FiZap],
    ],
  },
  {
    label: "AUTOMATE",
    items: [
      ["Processors", FiCpu],
      ["Agents", FiBox],
    ],
  },
];
const descriptions = {
  Overview: "Your bench, its health, and the evidence behind each test.",
  Events: "Meaningful occurrences from your hardware and test applications.",
  Runs: "A complete test execution, with its measurements and evidence.",
  Measurements:
    "Numeric signals with units and limits. Samples stay separate from events.",
  Records: "Recorded signal captures and artifacts, linked to their test runs.",
  Alarms: "Threshold violations and communication issues that need attention.",
  Dashboards: "Validation performance and hardware behavior at a glance.",
  Sources:
    "Connect test applications directly, or bring a bench through Nexus.",
  Live: "Inspect incoming measurements and bridge a selection to another application.",
  Processors: "Turn run evidence into calculations, simulations, and actions.",
  Agents: "Managed investigations grounded in your test evidence.",
  "Project Settings":
    "Project context used to organize and interpret incoming data.",
};
const slug = (s) => s.toLowerCase().replaceAll(" ", "-");
export default function StreamWorkspace() {
  const [params, setParams] = useSearchParams();
  const allSections = [
    ...sections.flatMap((g) => g.items.map((i) => i[0])),
    "Project Settings",
  ];
  const section =
    allSections.find((s) => slug(s) === params.get("view")) || "Overview";
  const [projectId, setProjectId] = useState("battery");
  const [workspace, setWorkspace] = useState("Validation Lab");
  const contextKey = `${workspace}:${projectId}`;
  const project = projects.find((p) => p.id === projectId);
  const data = useMemo(() => makeData(project), [project]);
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All severities");
  const [result, setResult] = useState("All results");
  const [range, setRange] = useState("Today");
  const [detail, setDetail] = useState(null);
  const [runTab, setRunTab] = useState("Timeline");
  const [setupType, setSetupType] = useState(null);
  const [setupState, setSetupState] = useState("ready");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [addedSources, setAddedSources] = useState({});
  const [acknowledged, setAcknowledged] = useState({});
  const [processorTab, setProcessorTab] = useState("All");
  const [processorState, setProcessorState] = useState({});
  const [draftType, setDraftType] = useState("Calculation");
  const [draftName, setDraftName] = useState("");
  const [draftTrigger, setDraftTrigger] = useState("test.completed");
  const [draftStep, setDraftStep] = useState(1);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const [bridge, setBridge] = useState(false);
  const [bridgeDestination, setBridgeDestination] = useState("Python analysis");
  const [selectedSignals, setSelectedSignals] = useState([
    "Pack Voltage",
    "Cell Temperature Max",
  ]);
  const [toast, setToast] = useState("");
  const [agentStatus, setAgentStatus] = useState("Ready");
  const [retention, setRetention] = useState("30 days");
  const processors =
    processorState[contextKey] || (project.total ? initialProcessors : []);
  const sources = [...data.sources, ...(addedSources[contextKey] || [])];
  const alarms = data.alarms.filter(
    (a) => !acknowledged[`${contextKey}-${a.id}`],
  );
  const showToast = (message) => setToast(message);
  const navigate = (view) => {
    setParams(view === "Overview" ? {} : { view: slug(view) });
    setNavOpen(false);
    window.scrollTo({ top: 0 });
    setSearch("");
    setSeverity("All severities");
    setResult("All results");
  };
  const openRun = (id) => {
    setRunTab("Timeline");
    setDetail({ kind: "run", run: data.runs.find((r) => r.id === id) });
  };
  const openSource = () => {
    setSetupType(null);
    setSetupState("ready");
    setSimulateFailure(false);
    setDetail({ kind: "source" });
  };
  const changeProject = (id) => {
    setProjectId(id);
    setDetail(null);
    setSearch("");
    setSeverity("All severities");
    setResult("All results");
    setAgentStatus("Ready");
    setBridge(false);
    setPaused(false);
    setTick(0);
  };
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (section !== "Live" || paused || !project.total) return;
    const timer = setInterval(() => setTick((t) => t + 1), 1600);
    return () => clearInterval(timer);
  }, [section, paused, project.total]);
  useEffect(() => {
    if (setupState !== "checking" || detail?.kind !== "source") return;
    const timer = setTimeout(() => {
      if (simulateFailure) {
        setSetupState("error");
        return;
      }
      setAddedSources((prev) => ({
        ...prev,
        [contextKey]: [
          ...(prev[contextKey] || []),
          {
            id: `demo-${Date.now()}`,
            name: `${setupType.name} Demo Source`,
            type: setupType.name,
            status: "Connected",
            rate: "Demo",
            last: "Just now",
          },
        ],
      }));
      setSetupState("done");
      showToast("Demo source added to this project.");
    }, 900);
    return () => clearTimeout(timer);
  }, [setupState, simulateFailure, contextKey, setupType, detail?.kind]);
  useEffect(() => {
    if (agentStatus !== "Investigating") return;
    const timer = setTimeout(() => setAgentStatus("Report ready"), 1600);
    return () => clearTimeout(timer);
  }, [agentStatus]);
  const filteredEvents = data.events.filter(
    (e) =>
      (severity === "All severities" || e.severity === severity) &&
      `${e.name} ${e.source} ${e.run}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const filteredRuns = data.runs.filter(
    (r) =>
      (result === "All results" || r.result === result) &&
      `${r.id} ${r.suite} ${r.ecu}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const filteredAlarms = data.alarms.filter(
    (a) =>
      (severity === "All severities" || a.severity === severity) &&
      `${a.title} ${a.source}`.toLowerCase().includes(search.toLowerCase()),
  );
  const timeSelector = (
    <label className="sw-field-inline">
      <FiClock />
      <select
        aria-label="Dashboard time range"
        value={range}
        onChange={(e) => setRange(e.target.value)}
      >
        <option>Today</option>
        <option>Last 7 days</option>
        <option>Last 30 days</option>
      </select>
    </label>
  );
  const addButton = (
    <button className="sw-button sw-primary" onClick={openSource}>
      <FiPlus />
      Add source
    </button>
  );
  const passRate = project.total
    ? ((project.passed / project.total) * 100).toFixed(1)
    : "—";
  const periodFactor = range === "Today" ? 1 : range === "Last 7 days" ? 7 : 30;
  const stats = (
    <div className="sw-stats">
      {[
        [
          "Test pass rate",
          `${passRate}${project.total ? "%" : ""}`,
          `${project.passed * periodFactor} of ${project.total * periodFactor} runs passed`,
          "good",
        ],
        [
          "Runs",
          project.total * periodFactor,
          range === "Today" ? "Since 00:00 UTC" : range,
          "",
        ],
        [
          "Failed runs",
          (project.total - project.passed) * periodFactor,
          "Inspect the evidence below",
          "bad",
        ],
        [
          "Average duration",
          `${project.duration}${project.total ? " s" : ""}`,
          "Completed runs",
          "",
        ],
      ].map(([title, value, caption, tone]) => (
        <div className="sw-stat" key={title}>
          <span>{title}</span>
          <strong className={tone ? `sw-text-${tone}` : ""}>{value}</strong>
          <small>{caption}</small>
        </div>
      ))}
    </div>
  );
  const noData = !project.total;
  const emptyProject = (
    <Empty
      title="Your first run starts here"
      description="Connect a source to see how events, measurements, and records become run evidence."
      action={addButton}
    />
  );
  const filterBar = (kind = "events") => (
    <div className="sw-toolbar">
      <label className="sw-search">
        <FiSearch />
        <input
          aria-label={`Search ${kind}`}
          placeholder={`Search ${kind === "runs" ? "run ID, suite, ECU" : kind === "alarms" ? "alarms or source" : "events, source, run ID"}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {kind === "runs" ? (
        <select
          aria-label="Run result"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        >
          {["All results", "Passed", "Failed"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      ) : (
        <select
          aria-label="Severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          {["All severities", "Critical", "Warning", "Info"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      )}
      <button
        className="sw-button"
        onClick={() => {
          setSearch("");
          setSeverity("All severities");
          setResult("All results");
        }}
      >
        Clear filters
      </button>
      <span className="sw-muted">7 Oct 2026 · UTC</span>
    </div>
  );
  const alarmList = (items) => (
    <div className="sw-alarm-list">
      {items.map((a) => (
        <div className="sw-alarm" key={a.id}>
          <FiAlertTriangle
            className={
              a.severity === "Critical" ? "sw-text-bad" : "sw-text-warn"
            }
          />
          <div>
            <button
              className="sw-link sw-alarm-title"
              onClick={() => setDetail({ kind: "alarm", alarm: a })}
            >
              {a.title}
            </button>
            <p>{a.detail}</p>
            <small>
              {a.time} · {a.source}
            </small>
          </div>
          <div className="sw-alarm-end">
            <Badge>{a.severity}</Badge>
            <button className="sw-link sw-mono" onClick={() => openRun(a.run)}>
              Run #{a.run} <FiChevronRight />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  function overview() {
    return (
      <>
        {stats}
        <div className="sw-overview-grid">
          <Panel
            title="Recent runs"
            meta="Latest 5"
            action={
              <button className="sw-link" onClick={() => navigate("Runs")}>
                All runs <FiArrowRight />
              </button>
            }
          >
            {noData ? (
              emptyProject
            ) : (
              <RunTable runs={data.runs.slice(0, 5)} onRun={openRun} />
            )}
          </Panel>
          <Panel
            title="Open alarms"
            meta={`${alarms.length} need attention`}
            action={
              <button className="sw-link" onClick={() => navigate("Alarms")}>
                View all <FiArrowRight />
              </button>
            }
          >
            {alarms.length ? (
              alarmList(alarms.slice(0, 2))
            ) : (
              <Empty
                title="No open alarms"
                description="Threshold and communication issues will appear here."
              />
            )}
            <div className="sw-panel-foot">
              <span className="sw-muted">
                Acknowledge alarms after reviewing run evidence.
              </span>
            </div>
          </Panel>
        </div>
        <div className="sw-overview-grid">
          <Panel
            title="Cell temperature"
            meta="°C · last 50 minutes"
            action={
              <button
                className="sw-link"
                onClick={() => navigate("Measurements")}
              >
                Signals <FiArrowRight />
              </button>
            }
          >
            {noData ? (
              <Empty title="Waiting for measurements" />
            ) : (
              <div className="sw-chart-pad">
                <Trend
                  values={data.measurements[2].values}
                  unit="°C"
                  threshold={55}
                  label="Maximum cell temperature"
                />
              </div>
            )}
          </Panel>
          <Panel
            title="Source health"
            action={
              <button className="sw-link" onClick={() => navigate("Sources")}>
                Manage <FiArrowRight />
              </button>
            }
          >
            {sources.length ? (
              <div className="sw-source-health">
                {sources.map((s) => (
                  <div key={s.id}>
                    <FiRadio />
                    <div>
                      <strong>{s.name}</strong>
                      <small>
                        {s.type} · last received {s.last}
                      </small>
                    </div>
                    <Badge>{s.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <Empty title="No sources connected" action={addButton} />
            )}
          </Panel>
        </div>
        <Panel
          title="Recent events"
          meta="State changes, not signal samples"
          action={
            <button className="sw-link" onClick={() => navigate("Events")}>
              Explore events <FiArrowRight />
            </button>
          }
        >
          {noData ? (
            <Empty title="Waiting for your first event" />
          ) : (
            <EventTable
              events={data.events.slice(0, 4)}
              onEvent={(event) => setDetail({ kind: "event", event })}
              onRun={openRun}
            />
          )}
        </Panel>
        <div className="sw-automation-callout">
          <FiCpu />
          <div>
            <strong>Make the next run more useful.</strong>
            <p>
              Calculate thermal drift after a test, or investigate a critical
              alarm with an agent.
            </p>
          </div>
          <button className="sw-button" onClick={() => navigate("Processors")}>
            Explore processors <FiArrowRight />
          </button>
        </div>
      </>
    );
  }
  function dashboards() {
    return (
      <>
        {stats}
        {noData ? (
          emptyProject
        ) : (
          <div className="sw-dashboard-grid">
            <Panel title="Test outcomes" meta={range}>
              <div
                className="sw-bars"
                role="img"
                aria-label="Passed and failed test runs by time bucket"
              >
                {[8, 10, 7, 9, 8].map((n, i) => (
                  <div key={i}>
                    <strong>{(n + (i % 2 ? 2 : 0)) * periodFactor}</strong>
                    <div className="sw-bar">
                      <span style={{ height: `${n * 7}%` }} />
                      <i style={{ height: `${i % 2 ? 14 : 0}%` }} />
                    </div>
                    <small>
                      {range === "Today"
                        ? ["00–02", "02–04", "04–06", "06–08", "08–11"][i]
                        : `Group ${i + 1}`}{" "}
                    </small>
                  </div>
                ))}
              </div>
              <div className="sw-legend">
                <span>
                  <i style={{ background: "#00796b" }} />
                  Passed
                </span>
                <span>
                  <i style={{ background: "#b34540" }} />
                  Failed
                </span>
                <span>Illustrative distribution</span>
              </div>
            </Panel>
            <Panel title="Failures by ECU" meta={range}>
              <div className="sw-horizontal-bars">
                {[
                  [project.ecu, 3],
                  ["Gateway", 1],
                  ["Inverter", 0],
                ].map(([ecu, n]) => (
                  <div key={ecu}>
                    <span>{ecu}</span>
                    <div>
                      <i style={{ width: `${(n / 4) * 100}%` }} />
                    </div>
                    <strong>{n * periodFactor}</strong>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Temperature trend" meta="Latest capture · °C">
              <div className="sw-chart-pad">
                <Trend
                  values={data.measurements[2].values}
                  threshold={55}
                  unit="°C"
                  label="Cell temperature trend"
                />
              </div>
            </Panel>
            <Panel title="Diagnostics" meta={range}>
              <div className="sw-diagnostics">
                <div>
                  <span>DTC detections</span>
                  <strong>{6 * periodFactor}</strong>
                  <small>
                    P0A7E most frequent · {4 * periodFactor} occurrences
                  </small>
                </div>
                <div>
                  <span>CAN timeouts</span>
                  <strong>{3 * periodFactor}</strong>
                  <small>CAN 1 · frame 0x180</small>
                </div>
              </div>
            </Panel>
            <Panel title="Recent alarms" className="sw-span-two">
              {alarmList(data.alarms)}
            </Panel>
          </div>
        )}
      </>
    );
  }
  function measurements(live = false) {
    return (
      <>
        {live && (
          <div className="sw-live-toolbar">
            <Badge tone={paused || noData ? "neutral" : "good"}>
              {paused ? "Paused" : noData ? "No data" : "Receiving demo data"}
            </Badge>
            <span className="sw-muted">
              {paused
                ? "Values frozen for inspection"
                : `Sample sequence ${tick} · simulated at 0.6 Hz`}
            </span>
            <button
              className="sw-button"
              onClick={() => setPaused((p) => !p)}
              disabled={noData}
            >
              {paused ? <FiPlay /> : <FiPause />}
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              className="sw-button sw-primary"
              disabled={noData}
              onClick={() => setDetail({ kind: "bridge" })}
            >
              <FiZap />
              {bridge ? "Manage demo bridge" : "Bridge live data"}
            </button>
          </div>
        )}
        {noData ? (
          emptyProject
        ) : (
          <div className="sw-measurement-grid">
            {data.measurements.map((m, i) => (
              <Panel key={m.name} title={m.name} meta={m.unit}>
                <div className="sw-measure-value">
                  <strong>
                    {live
                      ? (
                          m.value +
                          Math.sin(tick + i) * (m.unit === "rpm" ? 12 : 0.3)
                        ).toFixed(m.unit === "rpm" ? 0 : 1)
                      : m.value}
                  </strong>
                  <span>{m.unit}</span>
                  <small>Operating range {m.range}</small>
                </div>
                <Trend
                  values={m.values}
                  compact
                  label={m.name}
                  unit={m.unit}
                  color={i === 2 ? "#b17a2c" : "#00796b"}
                />
                <div className="sw-panel-foot">
                  <span>Nexus Bench-03</span>
                  <button
                    className="sw-link"
                    onClick={() => openRun(data.runs[0].id)}
                  >
                    Run #{data.runs[0].id} <FiChevronRight />
                  </button>
                </div>
              </Panel>
            ))}
          </div>
        )}
        {live && bridge && (
          <div className="sw-info-banner">
            <FiCheck />
            Demo bridge active · {selectedSignals.length} measurements →{" "}
            {bridgeDestination} · no external connection
          </div>
        )}
      </>
    );
  }
  function sourcePage() {
    return (
      <>
        {sources.length ? (
          <div className="sw-source-grid">
            {sources.map((s) => (
              <Panel key={s.id} title={s.name} meta={s.type}>
                <div className="sw-source-card">
                  <Badge>{s.status}</Badge>
                  <dl>
                    <dt>Incoming data</dt>
                    <dd>{s.rate}</dd>
                    <dt>Last received</dt>
                    <dd>{s.last}</dd>
                    <dt>Project</dt>
                    <dd>{project.name}</dd>
                  </dl>
                  {s.status === "Delayed" && (
                    <p className="sw-warning-note">
                      Last update is older than 30 seconds. Inspect the source
                      before relying on live values.
                    </p>
                  )}
                  <button
                    className="sw-button"
                    onClick={() => {
                      setSetupType(sourceTypes.find((t) => t.name === s.type));
                      setSetupState("ready");
                      setSimulateFailure(false);
                      setDetail({ kind: "sourceGuide", source: s });
                    }}
                  >
                    Setup guide <FiCode />
                  </button>
                </div>
              </Panel>
            ))}
          </div>
        ) : (
          emptyProject
        )}
        <Panel
          title="Choose how your data reaches Stream"
          meta="Nexus is optional"
        >
          <div className="sw-paths">
            {[
              "CAPL → Stream",
              "ROS 2 → Stream",
              "Python → Stream",
              "MQTT → Stream",
              "Hardware application → Stream",
              "Hardware → Nexus → Stream",
            ].map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </Panel>
      </>
    );
  }
  function processorsPage() {
    const shown = processors.filter(
      (p) => processorTab === "All" || p.type === processorTab,
    );
    return (
      <>
        <div className="sw-tabs" role="group" aria-label="Processor type">
          {["All", "Calculation", "Simulation", "Action"].map((t) => (
            <button
              key={t}
              aria-pressed={processorTab === t}
              className={processorTab === t ? "active" : ""}
              onClick={() => setProcessorTab(t)}
            >
              {t === "All" ? "All processors" : `${t}s`}
            </button>
          ))}
        </div>
        <div className="sw-info-banner">
          <FiCpu />
          <span>
            Processors use your run evidence. Explore a rule, or build one with
            a trigger, input, and output.{" "}
            <strong>Compute preview · executions are simulated.</strong>
          </span>
        </div>
        {shown.length ? (
          <div className="sw-processor-list">
            {shown.map((p) => (
              <button
                className="sw-processor-row"
                key={p.id}
                onClick={() => setDetail({ kind: "processor", processor: p })}
              >
                <span className="sw-tile-icon">
                  <FiCpu />
                </span>
                <div>
                  <strong>{p.name}</strong>
                  <p>
                    <span className="sw-mono">{p.trigger}</span>{" "}
                    <FiArrowRight /> {p.output}
                  </p>
                </div>
                <span className="sw-muted">
                  {p.type} · {p.count} executions
                </span>
                <Badge>{p.status}</Badge>
                <FiChevronRight />
              </button>
            ))}
          </div>
        ) : (
          <Empty
            title="No processors here yet"
            description="Choose another type, or create a rule for your project."
          />
        )}
        <Panel title="A useful first workflow">
          <div className="sw-rule-strip">
            <div>
              <small>WHEN</small>
              <strong>test.completed</strong>
            </div>
            <FiArrowRight />
            <div>
              <small>INPUT</small>
              <strong>Current run</strong>
            </div>
            <FiArrowRight />
            <div>
              <small>PROCESS</small>
              <strong>Calculate thermal drift</strong>
            </div>
            <FiArrowRight />
            <div>
              <small>OUTPUT</small>
              <strong>thermal_drift · °C</strong>
            </div>
          </div>
        </Panel>
      </>
    );
  }
  function agentsPage() {
    return (
      <>
        <div className="sw-info-banner">
          <FiBox />
          Managed agents investigate run evidence and produce reviewable
          reports. This preview does not send data to a model.
        </div>
        <Panel title="Validation investigator" meta="Managed agent · preview">
          <div className="sw-agent-content">
            <span className="sw-agent-symbol">
              <FiBox />
            </span>
            <div>
              <h3>From an alarm to a traceable explanation.</h3>
              <p>
                Review the event timeline, compare measurements to limits, and
                identify the evidence worth checking next.
              </p>
              <div className="sw-agent-scope">
                <span>Reads run evidence</span>
                <span>Creates a report</span>
                <span>Engineer reviews findings</span>
              </div>
              <button
                className="sw-button sw-primary"
                disabled={noData || agentStatus === "Investigating"}
                onClick={() => {
                  setAgentStatus("Investigating");
                  showToast("Mock investigation started.");
                }}
              >
                {agentStatus === "Investigating"
                  ? "Investigating demo run…"
                  : "Investigate latest failed run"}
                <FiArrowRight />
              </button>
            </div>
            <Badge tone={agentStatus === "Report ready" ? "good" : "neutral"}>
              {agentStatus}
            </Badge>
          </div>
        </Panel>
        {agentStatus === "Report ready" && (
          <Panel
            title="Investigation report"
            meta={`Run #${data.runs[1].id} · simulated`}
          >
            <div className="sw-report">
              <h3>
                {project.id === "battery"
                  ? "Temperature excursion preceded the test failure."
                  : "Motor speed exceeded the configured limit."}
              </h3>
              <p>
                {project.id === "battery"
                  ? "Cell 12 reached 58.4 °C against a 55 °C limit for 438 ms. The temperature event and P0A7E diagnostic were recorded before the failed verdict."
                  : "A peak of 6820 rpm exceeded the 6500 rpm threshold for 438 ms before the failed verdict."}
              </p>
              <p>
                <strong>Next check:</strong> Compare the recorded trace with the
                commanded profile and inspect sensor calibration. This evidence
                shows a threshold violation; it does not establish root cause.
              </p>
              <button
                className="sw-button"
                onClick={() => openRun(data.runs[1].id)}
              >
                Review run evidence <FiArrowRight />
              </button>
            </div>
          </Panel>
        )}
      </>
    );
  }
  const renderSection = () => {
    switch (section) {
      case "Overview":
        return overview();
      case "Dashboards":
        return dashboards();
      case "Events":
        return (
          <>
            {filterBar()}
            <Panel
              title="Event explorer"
              meta={`${filteredEvents.length} events`}
            >
              {filteredEvents.length ? (
                <EventTable
                  events={filteredEvents}
                  onEvent={(event) => setDetail({ kind: "event", event })}
                  onRun={openRun}
                />
              ) : noData ? (
                emptyProject
              ) : (
                <Empty />
              )}
            </Panel>
            <div className="sw-info-banner">
              <FiActivity />
              Events describe what happened. For continuous values like voltage
              and RPM, open Measurements.
            </div>
          </>
        );
      case "Runs":
        return (
          <>
            {filterBar("runs")}
            <Panel
              title="Test runs"
              meta={`${filteredRuns.length} displayed · ${project.total} today`}
            >
              {filteredRuns.length ? (
                <RunTable runs={filteredRuns} onRun={openRun} />
              ) : noData ? (
                emptyProject
              ) : (
                <Empty />
              )}
            </Panel>
          </>
        );
      case "Measurements":
        return measurements();
      case "Live":
        return measurements(true);
      case "Sources":
        return sourcePage();
      case "Alarms":
        return (
          <>
            {filterBar("alarms")}
            <Panel title="Alarm history" meta={`${alarms.length} open`}>
              {filteredAlarms.length ? (
                <div>
                  {filteredAlarms.map((a) => (
                    <div key={a.id} className="sw-alarm-history">
                      {alarmList([a])}
                      <div className="sw-alarm-actions">
                        <Badge
                          tone={
                            acknowledged[`${contextKey}-${a.id}`]
                              ? "good"
                              : "neutral"
                          }
                        >
                          {acknowledged[`${contextKey}-${a.id}`]
                            ? "Acknowledged"
                            : "Open"}
                        </Badge>
                        <button
                          className="sw-button"
                          disabled={!!acknowledged[`${contextKey}-${a.id}`]}
                          onClick={() => setDetail({ kind: "alarm", alarm: a })}
                        >
                          Review alarm <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  title={noData ? "No alarms yet" : "No matching alarms"}
                />
              )}
            </Panel>
          </>
        );
      case "Records":
        return (
          <Panel
            title="Signal records"
            meta={`${data.records.length} captures`}
          >
            {noData ? (
              emptyProject
            ) : (
              <div className="sw-table-wrap">
                <table className="sw-table">
                  <thead>
                    <tr>
                      <th>Record</th>
                      <th>Run</th>
                      <th>Duration</th>
                      <th>Size</th>
                      <th>Signals</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.records.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <button
                            className="sw-link sw-mono"
                            onClick={() =>
                              setDetail({ kind: "record", record: r })
                            }
                          >
                            <FiFileText />
                            {r.name}
                          </button>
                        </td>
                        <td>
                          <button
                            className="sw-link"
                            onClick={() => openRun(r.run)}
                          >
                            #{r.run}
                          </button>
                        </td>
                        <td>{r.duration}</td>
                        <td>{r.size}</td>
                        <td>{r.signals}</td>
                        <td>{r.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        );
      case "Processors":
        return processorsPage();
      case "Agents":
        return agentsPage();
      default:
        return (
          <Panel title="Project context">
            <div className="sw-settings">
              <dl>
                <dt>Workspace</dt>
                <dd>{workspace}</dd>
                <dt>Project</dt>
                <dd>{project.name}</dd>
                <dt>Bench</dt>
                <dd>{project.bench}</dd>
                <dt>ECU</dt>
                <dd>{project.ecu}</dd>
                <dt>Software</dt>
                <dd className="sw-mono">{project.software}</dd>
              </dl>
              <label>
                Preview retention
                <select
                  value={retention}
                  onChange={(e) => {
                    setRetention(e.target.value);
                    showToast("Preview preference updated for this session.");
                  }}
                >
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>90 days</option>
                </select>
              </label>
              <p className="sw-muted">
                Project metadata and retention are illustrative. No data is
                deleted or stored remotely.
              </p>
            </div>
          </Panel>
        );
    }
  };
  function renderDetail() {
    if (!detail) return null;
    const close = () => setDetail(null);
    if (detail.kind === "event") {
      const e = detail.event;
      return (
        <Dialog
          title={e.name}
          subtitle={`7 Oct 2026 · ${e.time} UTC`}
          onClose={close}
        >
          <div className="sw-detail-body">
            <div className="sw-detail-meta">
              <Badge>{e.severity}</Badge>
              <span>{e.source}</span>
              <button className="sw-link" onClick={() => openRun(e.run)}>
                Run #{e.run} <FiArrowRight />
              </button>
            </div>
            <h3>Event properties</h3>
            <dl className="sw-properties">
              {Object.entries(e.properties).map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt>{k}</dt>
                  <dd>{String(v)}</dd>
                </React.Fragment>
              ))}
            </dl>
            <p className="sw-muted">
              A meaningful occurrence, linked to its run. Continuous signal
              samples are shown in Measurements.
            </p>
          </div>
        </Dialog>
      );
    }
    if (detail.kind === "run") {
      const r = detail.run;
      const events = data.events
        .filter((e) => e.run === r.id)
        .sort((a, b) => a.time.localeCompare(b.time));
      return (
        <Dialog
          wide
          title={`Run #${r.id}`}
          subtitle={`${r.suite} · 7 Oct 2026 · ${r.time} UTC`}
          onClose={close}
        >
          <div className="sw-detail-body">
            <div className="sw-detail-meta">
              <Badge>{r.result}</Badge>
              <span>
                <FiClock />
                {r.duration} s
              </span>
              <span>{r.source}</span>
            </div>
            <div className="sw-run-context">
              {[
                ["Bench / vehicle", r.bench],
                ["ECU", r.ecu],
                ["Software", r.software],
                ["Test suite", r.suite],
              ].map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
            {r.result === "Failed" && (
              <div className="sw-failure-banner">
                <FiAlertTriangle />
                <div>
                  <strong>
                    {project.id === "battery"
                      ? "REQ-BMS-042 · Cell temperature exceeded limit"
                      : "REQ-VCU-018 · Motor speed exceeded limit"}
                  </strong>
                  <p>
                    {project.id === "battery"
                      ? "58.4 °C measured · 55 °C threshold · 438 ms excursion"
                      : "6820 rpm measured · 6500 rpm threshold · 438 ms excursion"}
                  </p>
                </div>
              </div>
            )}
            <div className="sw-tabs" role="group" aria-label="Run details">
              {["Timeline", "Measurements", "Artifacts"].map((t) => (
                <button
                  key={t}
                  className={runTab === t ? "active" : ""}
                  aria-pressed={runTab === t}
                  onClick={() => setRunTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {runTab === "Timeline" && (
              <div className="sw-timeline">
                {events.length ? (
                  events.map((e) => (
                    <div key={e.id}>
                      <span
                        className={`sw-timeline-dot ${e.severity === "Critical" ? "critical" : ""}`}
                      />
                      <time>{e.time}</time>
                      <div>
                        <button
                          className="sw-link sw-mono"
                          onClick={() => setDetail({ kind: "event", event: e })}
                        >
                          {e.name}
                        </button>
                        <p>
                          {Object.entries(e.properties)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" · ")}
                        </p>
                      </div>
                      <Badge>{e.severity}</Badge>
                    </div>
                  ))
                ) : (
                  <Empty
                    title="Timeline sample not included"
                    description="This preview includes full events for the two most recent runs."
                  />
                )}
                <div>
                  <span className="sw-timeline-dot" />
                  <time>
                    {r.time.slice(0, 6)}
                    {String(
                      Number(r.time.slice(-2)) +
                        Math.ceil(Number(r.duration)) +
                        1,
                    ).padStart(2, "0")}
                  </time>
                  <div>
                    <span className="sw-mono">artifact.attached</span>
                    <p>Signal capture and verdict report available below.</p>
                  </div>
                  <Badge>Info</Badge>
                </div>
              </div>
            )}
            {runTab === "Measurements" && (
              <>
                <p className="sw-muted">
                  {r.result === "Failed"
                    ? "Capture around the failed verdict"
                    : "Capture from the completed test"}{" "}
                  · illustrative run trace
                </p>
                <Trend
                  values={
                    r.result === "Failed"
                      ? [32, 36, 42, 48, 51, 58.4, 56, 53, 49]
                      : [32, 34, 37, 40, 43, 46, 48, 47, 46]
                  }
                  label="Run cell temperature"
                  threshold={55}
                  unit="°C"
                />
                <dl className="sw-properties">
                  <dt>Peak cell temperature</dt>
                  <dd>{r.result === "Failed" ? "58.4" : "48.0"} °C</dd>
                  <dt>Peak pack voltage</dt>
                  <dd>402.8 V</dd>
                  <dt>Mean pack current</dt>
                  <dd>−42.6 A</dd>
                </dl>
              </>
            )}
            {runTab === "Artifacts" && (
              <div className="sw-artifacts">
                {[
                  [
                    "Signal capture",
                    `capture_${r.id}.mf4`,
                    "64 signals · 4.1 MB",
                  ],
                  [
                    "Test verdict report",
                    `verdict_${r.id}.json`,
                    `${r.result.toLowerCase()} · 24 checks`,
                  ],
                ].map(([title, file, meta]) => (
                  <button
                    key={file}
                    className="sw-artifact"
                    onClick={() =>
                      setDetail({ kind: "artifact", run: r, title, file })
                    }
                  >
                    <FiFileText />
                    <div>
                      <strong>{title}</strong>
                      <p>
                        {file} · {meta}
                      </p>
                    </div>
                    <FiChevronRight />
                  </button>
                ))}
              </div>
            )}
          </div>
        </Dialog>
      );
    }
    if (detail.kind === "alarm") {
      const a = detail.alarm;
      const isAck = acknowledged[`${contextKey}-${a.id}`];
      return (
        <Dialog
          title={a.title}
          subtitle={`${a.time} UTC · ${a.source}`}
          onClose={close}
        >
          <div className="sw-detail-body">
            <Badge>{a.severity}</Badge>
            <p className="sw-alarm-reading">{a.detail}</p>
            <p>
              Review the linked run and trace before acknowledging this alarm.
            </p>
            <div className="sw-dialog-actions">
              <button className="sw-button" onClick={() => openRun(a.run)}>
                Inspect run #{a.run} <FiArrowRight />
              </button>
              <button
                className="sw-button sw-primary"
                disabled={isAck}
                onClick={() => {
                  setAcknowledged((prev) => ({
                    ...prev,
                    [`${contextKey}-${a.id}`]: true,
                  }));
                  showToast("Alarm acknowledged in this preview.");
                  close();
                }}
              >
                {isAck ? "Acknowledged" : "Acknowledge alarm"}
              </button>
            </div>
          </div>
        </Dialog>
      );
    }
    if (detail.kind === "source" || detail.kind === "sourceGuide")
      return (
        <Dialog
          title={
            detail.kind === "sourceGuide" ? detail.source.name : "Add a source"
          }
          subtitle={`Send hardware and test data to ${project.name}`}
          onClose={close}
        >
          <div className="sw-detail-body">
            {!setupType ? (
              <div className="sw-source-choices">
                {sourceTypes.map((t) => (
                  <button key={t.name} onClick={() => setSetupType(t)}>
                    <FiRadio />
                    <div>
                      <strong>{t.name}</strong>
                      <p>{t.hint}</p>
                    </div>
                    <FiChevronRight />
                  </button>
                ))}
              </div>
            ) : (
              <>
                <button
                  className="sw-link"
                  onClick={() => {
                    setSetupType(null);
                    setSetupState("ready");
                  }}
                >
                  ← Choose another source
                </button>
                <h3 className="sw-setup-title">{setupType.name}</h3>
                <ol className="sw-setup-steps">
                  <li>
                    Select <strong>{project.name}</strong> as the destination.
                  </li>
                  <li>{setupType.guide}</li>
                  <li>
                    Send a test event and confirm its run appears in Stream.
                  </li>
                </ol>
                <div className="sw-code-head">
                  <span>Illustrative setup · not a working integration</span>
                  <button
                    className="sw-link"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          setupType.code
                            .replaceAll("PROJECT_ID", projectId)
                            .replaceAll("PROJECT_NAME", project.name),
                        );
                        showToast("Illustrative setup copied.");
                      } catch {
                        showToast(
                          "Copy unavailable. Select and copy the snippet manually.",
                        );
                      }
                    }}
                  >
                    Copy
                  </button>
                </div>
                <pre className="sw-code">
                  {setupType.code
                    .replaceAll("PROJECT_ID", projectId)
                    .replaceAll("PROJECT_NAME", project.name)}
                </pre>
                {setupState === "error" && (
                  <div role="alert" className="sw-failure-banner">
                    <FiAlertTriangle />
                    <div>
                      <strong>Demo connection could not be verified.</strong>
                      <p>Turn off “Simulate connection failure” and retry.</p>
                    </div>
                  </div>
                )}
                {setupState === "done" ? (
                  <div className="sw-info-banner">
                    <FiCheck />
                    Demo source connected. It is visible in Sources; no hardware
                    was contacted.
                  </div>
                ) : (
                  detail.kind === "source" && (
                    <>
                      <label className="sw-check">
                        <input
                          type="checkbox"
                          checked={simulateFailure}
                          disabled={setupState === "checking"}
                          onChange={(e) => setSimulateFailure(e.target.checked)}
                        />
                        Simulate connection failure
                      </label>
                      <button
                        className="sw-button sw-primary"
                        disabled={setupState === "checking"}
                        onClick={() => setSetupState("checking")}
                      >
                        {setupState === "checking"
                          ? "Checking demo connection…"
                          : setupState === "error"
                            ? "Retry demo connection"
                            : "Simulate connection"}
                        <FiArrowRight />
                      </button>
                    </>
                  )
                )}
              </>
            )}
          </div>
        </Dialog>
      );
    if (detail.kind === "processor") {
      const p = detail.processor;
      return (
        <Dialog
          title={p.name}
          subtitle={`${p.type} · ${p.count} simulated executions`}
          onClose={close}
        >
          <div className="sw-detail-body">
            <Badge>{p.status}</Badge>
            <div className="sw-rule-detail">
              {[
                ["WHEN", p.trigger],
                ["IF", p.condition],
                ["INPUT", p.input],
                ["PROCESS", p.process],
                ["OUTPUT", p.output],
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <button
              className="sw-button sw-primary"
              disabled={noData}
              onClick={() =>
                showToast(
                  `Demo output: ${p.type === "Calculation" ? "thermal_drift = 16.4 °C" : p.type === "Simulation" ? "temperature_residual = 3.2 °C" : "Investigation report attached"}. No compute was executed.`,
                )
              }
            >
              <FiPlay />
              Preview execution
            </button>
            <p className="sw-muted">
              A managed workflow preview. No external compute or hardware
              control.
            </p>
          </div>
        </Dialog>
      );
    }
    if (detail.kind === "createProcessor")
      return (
        <Dialog
          title="Create a processor"
          subtitle={`Step ${draftStep} of 2 · ${project.name}`}
          onClose={close}
        >
          <form
            className="sw-detail-body sw-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (draftStep === 1) {
                setDraftStep(2);
                return;
              }
              const p = {
                id: `local-${Date.now()}`,
                name: draftName.trim(),
                type: draftType,
                trigger: draftTrigger,
                condition:
                  draftTrigger === "alarm.created"
                    ? "severity == critical"
                    : "Every completed run",
                input: "Current run evidence",
                process:
                  draftType === "Calculation"
                    ? "Calculate thermal drift"
                    : draftType === "Simulation"
                      ? "Compare measured temperature with model prediction"
                      : "Ask managed agent to investigate run",
                output:
                  draftType === "Calculation"
                    ? "thermal_drift · °C"
                    : draftType === "Simulation"
                      ? "temperature_residual · °C"
                      : "Investigation report · run artifact",
                status: "Draft",
                count: 0,
              };
              setProcessorState((prev) => ({
                ...prev,
                [contextKey]: [...processors, p],
              }));
              setProcessorTab("All");
              close();
              showToast("Processor draft added for this session.");
            }}
          >
            {draftStep === 1 ? (
              <>
                <label>
                  Name
                  <input
                    autoFocus
                    required
                    maxLength={80}
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="e.g. Calculate pack thermal drift"
                  />
                </label>
                <label>
                  Processor type
                  <select
                    value={draftType}
                    onChange={(e) => setDraftType(e.target.value)}
                  >
                    {["Calculation", "Simulation", "Action"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  When should it run?
                  <select
                    value={draftTrigger}
                    onChange={(e) => setDraftTrigger(e.target.value)}
                  >
                    <option>test.completed</option>
                    <option>alarm.created</option>
                    <option>Manual</option>
                  </select>
                </label>
                <button
                  className="sw-button sw-primary"
                  disabled={!draftName.trim()}
                  type="submit"
                >
                  Review workflow <FiArrowRight />
                </button>
              </>
            ) : (
              <>
                <div className="sw-rule-detail">
                  {[
                    ["WHEN", draftTrigger],
                    ["INPUT", "Current run evidence"],
                    ["PROCESS", draftName],
                    [
                      "OUTPUT",
                      draftType === "Calculation"
                        ? "thermal_drift · °C"
                        : draftType === "Simulation"
                          ? "temperature_residual · °C"
                          : "Investigation report",
                    ],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <small>{k}</small>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
                <p className="sw-muted">
                  This preview uses a preset {draftType.toLowerCase()} template.
                  Save a draft to explore it; executions remain simulated.
                </p>
                <div className="sw-dialog-actions">
                  <button
                    type="button"
                    className="sw-button"
                    onClick={() => setDraftStep(1)}
                  >
                    Back
                  </button>
                  <button type="submit" className="sw-button sw-primary">
                    Save draft <FiCheck />
                  </button>
                </div>
              </>
            )}
          </form>
        </Dialog>
      );
    if (detail.kind === "bridge")
      return (
        <Dialog
          title="Bridge live measurements"
          subtitle="Preview a live data handoff to an analysis application."
          onClose={close}
        >
          <div className="sw-detail-body">
            <h3>Select measurements</h3>
            {data.measurements.map((m) => (
              <label className="sw-check" key={m.name}>
                <input
                  type="checkbox"
                  checked={selectedSignals.includes(m.name)}
                  onChange={(e) =>
                    setSelectedSignals((prev) =>
                      e.target.checked
                        ? [...prev, m.name]
                        : prev.filter((n) => n !== m.name),
                    )
                  }
                />
                {m.name}
                <span className="sw-muted">{m.unit}</span>
              </label>
            ))}
            <label className="sw-form">
              Destination
              <select
                value={bridgeDestination}
                onChange={(e) => setBridgeDestination(e.target.value)}
              >
                <option>Python analysis</option>
                <option>Local dashboard</option>
              </select>
            </label>
            <p className="sw-muted">
              Demo handoff only. Stream will not open a connection or transmit
              samples.
            </p>
            <div className="sw-dialog-actions">
              {bridge && (
                <button
                  className="sw-button"
                  onClick={() => {
                    setBridge(false);
                    close();
                    showToast("Demo bridge stopped.");
                  }}
                >
                  Stop bridge
                </button>
              )}
              <button
                className="sw-button sw-primary"
                disabled={!selectedSignals.length}
                onClick={() => {
                  setBridge(true);
                  close();
                  showToast(
                    `Demo bridge configured for ${selectedSignals.length} measurements.`,
                  );
                }}
              >
                {bridge ? "Update demo bridge" : "Start demo bridge"}
              </button>
            </div>
          </div>
        </Dialog>
      );
    if (detail.kind === "record")
      return (
        <Dialog
          title={detail.record.name}
          subtitle="Recorded signal capture · demo artifact"
          onClose={close}
        >
          <div className="sw-detail-body">
            <dl className="sw-properties">
              {Object.entries(detail.record)
                .filter(([k]) => k !== "id")
                .map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </React.Fragment>
                ))}
            </dl>
            <Trend
              values={data.measurements[2].values}
              label="Record temperature preview"
              threshold={55}
              unit="°C"
            />
            <button
              className="sw-button"
              onClick={() => openRun(detail.record.run)}
            >
              Inspect linked run <FiArrowRight />
            </button>
          </div>
        </Dialog>
      );
    return (
      <Dialog title={detail.title} subtitle={detail.file} onClose={close}>
        <div className="sw-detail-body">
          {detail.title === "Signal capture" ? (
            <>
              <Trend
                values={data.measurements[2].values}
                label="Artifact temperature preview"
                threshold={55}
                unit="°C"
              />
              <p>Illustrative capture · 64 signals · Nexus Bench-03</p>
            </>
          ) : (
            <pre className="sw-code">
              {JSON.stringify(
                {
                  run_id: detail.run.id,
                  result: detail.run.result.toLowerCase(),
                  checks: 24,
                  software: detail.run.software,
                },
                null,
                2,
              )}
            </pre>
          )}
          <button className="sw-button" onClick={() => openRun(detail.run.id)}>
            Back to run #{detail.run.id}
          </button>
        </div>
      </Dialog>
    );
  }
  return (
    <div className="sw-app">
      <Helmet>
        <title>{project.name} · Plotune Stream Workspace</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <header className="sw-topbar">
        <button
          className="sw-icon-button sw-menu"
          aria-label="Open workspace navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((o) => !o)}
        >
          <FiMenu />
        </button>
        <a className="sw-brand" href="/stream/workspace">
          <span className="sw-brand-symbol">
            <FiActivity />
          </span>
          <strong>
            Plotune <span>Stream</span>
          </strong>
        </a>
        <span className="sw-top-divider" />
        <label className="sw-workspace-select">
          <span className="sw-sr-only">Workspace</span>
          <select
            aria-label="Workspace"
            value={workspace}
            onChange={(e) => {
              setWorkspace(e.target.value);
              changeProject(
                e.target.value === "Validation Lab" ? "battery" : "sandbox",
              );
            }}
          >
            <option>Validation Lab</option>
            <option>Personal Lab</option>
          </select>
        </label>
        <span className="sw-prototype-tag">PRODUCT PREVIEW</span>
        <div className="sw-top-end">
          <span className="sw-muted">Mock data</span>
          <span className="sw-avatar" aria-label="Demo engineer">
            VK
          </span>
        </div>
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
          <label>
            <span className="sw-sr-only">Project</span>
            <select
              aria-label="Project"
              value={projectId}
              onChange={(e) => changeProject(e.target.value)}
            >
              {projects
                .filter(
                  (p) => workspace === "Validation Lab" || p.id === "sandbox",
                )
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </label>
          <small>
            <span style={{ background: project.color }} />
            {project.bench} · {project.ecu}
          </small>
        </div>
        <nav aria-label="Workspace navigation">
          {sections.map((group) => (
            <div className="sw-nav-group" key={group.label}>
              {group.label && <p>{group.label}</p>}
              {group.items.map(([name, Icon]) => (
                <button
                  key={name}
                  aria-label={name}
                  className={section === name ? "active" : ""}
                  aria-current={section === name ? "page" : undefined}
                  onClick={() => navigate(name)}
                >
                  <Icon />
                  <span>{name}</span>
                  {name === "Alarms" && alarms.length > 0 && (
                    <em>{alarms.length}</em>
                  )}
                </button>
              ))}
            </div>
          ))}
          <button
            className={`sw-settings-link ${section === "Project Settings" ? "active" : ""}`}
            onClick={() => navigate("Project Settings")}
          >
            <FiSettings />
            Project Settings
          </button>
        </nav>
        <div className="sw-sidebar-footer">
          <span className="sw-small-label">FRONTEND PROTOTYPE</span>
          <p>
            Explore freely.
            <br />
            Changes stay in this session.
          </p>
          <a href="/streams">
            Existing Streams <FiArrowRight />
          </a>
        </div>
      </aside>
      <main className="sw-main">
        <div className="sw-breadcrumb">
          {workspace}
          <FiChevronRight />
          {project.name}
          <FiChevronRight />
          <span>{section}</span>
        </div>
        <div className="sw-page-head">
          <div>
            <h1>{section}</h1>
            <p>{descriptions[section]}</p>
          </div>
          <div className="sw-page-actions">
            {["Overview", "Dashboards"].includes(section) && timeSelector}
            {section === "Sources" ? (
              addButton
            ) : section === "Processors" ? (
              <button
                className="sw-button sw-primary"
                onClick={() => {
                  setDraftStep(1);
                  setDraftName("");
                  setDraftType("Calculation");
                  setDraftTrigger("test.completed");
                  setDetail({ kind: "createProcessor" });
                }}
              >
                <FiPlus />
                Create processor
              </button>
            ) : null}
          </div>
        </div>
        <div className="sw-project-context">
          <span>
            <strong>{project.name}</strong>
          </span>
          <span>
            Bench <strong>{project.bench}</strong>
          </span>
          <span>
            ECU <strong>{project.ecu}</strong>
          </span>
          <span>
            SW <strong className="sw-mono">{project.software}</strong>
          </span>
          <button
            className="sw-context-status"
            onClick={() => navigate("Sources")}
          >
            <Badge tone={sources.length ? "good" : "neutral"}>
              {sources.length
                ? `${sources.filter((s) => s.status === "Connected").length} sources connected`
                : "No sources"}
            </Badge>
            {sources.some((s) => s.status === "Delayed") && (
              <span className="sw-text-warn">1 delayed</span>
            )}
            <FiChevronRight />
          </button>
        </div>
        <div className="sw-content">{renderSection()}</div>
        <footer className="sw-main-footer">
          <span>DEMO SNAPSHOT · 7 OCT 2026 · UTC</span>
          <span>Hardware evidence. Connected workflows.</span>
        </footer>
      </main>
      {renderDetail()}
      {toast && (
        <div role="status" className="sw-toast">
          <FiCheck />
          <span>{toast}</span>
          <button
            aria-label="Dismiss notification"
            className="sw-icon-button"
            onClick={() => setToast("")}
          >
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
}
