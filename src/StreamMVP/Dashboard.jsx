import React, { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Dialog } from "../StreamWorkspace/WorkspaceUI";
import DashboardGraph from "./DashboardGraph";
import { DASHBOARD_RANGES, discoverNumericSeries } from "./dashboardModel";

export default function Dashboard({ projectId, events, now, graphs, onAddGraph, onRemoveGraph }) {
  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState("numeric");
  const [seriesKeys, setSeriesKeys] = useState([]);
  const [eventName, setEventName] = useState("");
  const [range, setRange] = useState("1h");
  const numericSeries = useMemo(() => discoverNumericSeries(events), [events]);
  const eventNames = useMemo(() => [...new Set(events.map((event) => event.event))].sort(), [events]);

  const openAddGraph = () => {
    setKind(numericSeries.length ? "numeric" : "count");
    setSeriesKeys(numericSeries.slice(0, 1).map((series) => series.key));
    setEventName(eventNames[0] || "");
    setRange("1h");
    setAdding(true);
  };

  const toggleSeries = (key) => {
    setSeriesKeys((current) => current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key]);
  };

  const addGraph = (event) => {
    event.preventDefault();
    if (kind === "numeric" && !seriesKeys.length) return;
    if (kind === "count" && !eventName) return;
    onAddGraph({
      id: `${projectId}-graph-${Date.now()}`,
      kind,
      seriesKeys: kind === "numeric" ? seriesKeys : [],
      eventName: kind === "count" ? eventName : "",
      range,
    });
    setAdding(false);
  };

  return (
    <div className="mvp-dashboard">
      <div className="mvp-dashboard-toolbar">
        <p>Graphs use numeric properties and event counts from this project.</p>
        <button className="sw-button sw-primary" onClick={openAddGraph}>
          <FiPlus /> Add graph
        </button>
      </div>
      {graphs.length ? (
        <div className="mvp-dashboard-grid">
          {graphs.map((graph) => (
            <DashboardGraph
              key={graph.id}
              graph={graph}
              events={events}
              now={now}
              onRemove={() => onRemoveGraph(graph.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mvp-dashboard-empty">
          <span className="mvp-first-icon"><FiPlus /></span>
          <h2>No graphs yet</h2>
          <p>Add a graph from this project’s numeric event properties or count a specific event over time.</p>
          <button className="sw-button sw-primary" onClick={openAddGraph}><FiPlus /> Add graph</button>
        </div>
      )}

      {adding && (
        <Dialog title="Add graph" subtitle="Choose what to plot over time." onClose={() => setAdding(false)}>
          <form className="sw-detail-body mvp-add-graph" onSubmit={addGraph}>
            <fieldset>
              <legend>Measure</legend>
              <div className="mvp-graph-kind">
                <button type="button" className={kind === "numeric" ? "active" : ""} aria-pressed={kind === "numeric"} disabled={!numericSeries.length} onClick={() => setKind("numeric")}>Numeric property</button>
                <button type="button" className={kind === "count" ? "active" : ""} aria-pressed={kind === "count"} disabled={!eventNames.length} onClick={() => setKind("count")}>Event count</button>
              </div>
            </fieldset>

            {kind === "numeric" ? (
              <fieldset className="mvp-series-options">
                <legend>Series</legend>
                {numericSeries.length ? numericSeries.map((series) => (
                  <label className="sw-check" key={series.key}>
                    <input type="checkbox" checked={seriesKeys.includes(series.key)} onChange={() => toggleSeries(series.key)} />
                    <code>{series.label}</code>
                  </label>
                )) : <p className="sw-muted">Numeric properties appear here when events include numbers.</p>}
              </fieldset>
            ) : (
              <label className="mvp-graph-select">Event
                <select value={eventName} onChange={(e) => setEventName(e.target.value)}>
                  {eventNames.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
            )}

            <label className="mvp-graph-select">Time range
              <select value={range} onChange={(e) => setRange(e.target.value)}>
                {DASHBOARD_RANGES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <div className="sw-dialog-actions">
              <button className="sw-button" type="button" onClick={() => setAdding(false)}>Cancel</button>
              <button className="sw-button sw-primary" type="submit" disabled={kind === "numeric" ? !seriesKeys.length : !eventName}>Add graph</button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
