import React, { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Dialog } from "../StreamWorkspace/WorkspaceUI";
import DashboardGraph from "./DashboardGraph";
import {
  DASHBOARD_RANGES,
  getEventNames,
  getNumericProperties,
  searchEventNames,
} from "./dashboardModel";

const MAX_EVENT_RESULTS = 6;

export default function Dashboard({ projectId, events, now, graphs, onAddGraph, onRemoveGraph }) {
  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState("numeric");
  const [eventName, setEventName] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [propertyNames, setPropertyNames] = useState([]);
  const [range, setRange] = useState("1h");
  const eventNames = useMemo(() => getEventNames(events), [events]);
  const matchingEvents = useMemo(
    () => searchEventNames(eventNames, eventSearch),
    [eventNames, eventSearch],
  );
  const numericProperties = useMemo(
    () => (eventName ? getNumericProperties(events, eventName) : []),
    [events, eventName],
  );

  const openAddGraph = () => {
    setKind("numeric");
    setEventName("");
    setEventSearch("");
    setPropertyNames([]);
    setRange("1h");
    setAdding(true);
  };

  const selectEvent = (name) => {
    setEventName(name);
    setPropertyNames([]);
    setKind(getNumericProperties(events, name).length ? "numeric" : "count");
  };

  const toggleProperty = (property) => {
    setPropertyNames((current) => current.includes(property)
      ? current.filter((item) => item !== property)
      : [...current, property]);
  };

  const addGraph = (event) => {
    event.preventDefault();
    if (!eventName) return;
    if (kind === "numeric" && !propertyNames.length) return;
    onAddGraph({
      id: `${projectId}-graph-${Date.now()}`,
      kind,
      eventName,
      propertyNames: kind === "numeric" ? propertyNames : [],
      range,
    });
    setAdding(false);
  };

  return (
    <div className="mvp-dashboard">
      <div className="mvp-dashboard-toolbar">
        <p>{graphs.length
          ? "Hover or tap graph points to inspect values."
          : "Choose one event to graph its numeric values or event count."}</p>
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
          <p>Select an event, then graph its numeric values or count its occurrences over time.</p>
          <button className="sw-button sw-primary" onClick={openAddGraph}><FiPlus /> Add graph</button>
        </div>
      )}

      {adding && (
        <Dialog
          title="Add graph"
          subtitle="Choose an event, then what to graph."
          onClose={() => setAdding(false)}
          className="mvp-add-graph-dialog"
        >
          <form className="sw-detail-body mvp-add-graph" onSubmit={addGraph}>
            <section className="mvp-event-picker" aria-labelledby="mvp-event-picker-label">
              <label id="mvp-event-picker-label" htmlFor="mvp-event-search">Event</label>
              <input
                id="mvp-event-search"
                type="search"
                aria-label="Search events"
                placeholder="Search events…"
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                disabled={!eventNames.length}
              />
              {matchingEvents.length ? (
                <div className="mvp-event-results" role="listbox" aria-label="Matching event names">
                  {matchingEvents.slice(0, MAX_EVENT_RESULTS).map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="option"
                      aria-selected={eventName === name}
                      className={eventName === name ? "selected" : ""}
                      onClick={() => selectEvent(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mvp-event-picker-empty">
                  {eventNames.length ? "No events match. Try another search." : "Send an event to this project before adding a graph."}
                </p>
              )}
              {matchingEvents.length > MAX_EVENT_RESULTS && (
                <p className="mvp-event-picker-hint">
                  Showing {MAX_EVENT_RESULTS} of {matchingEvents.length}. Search to narrow the list.
                </p>
              )}
            </section>

            {eventName && (
              <>
                <fieldset className="mvp-graph-measure">
                  <legend>Measure</legend>
                  <div className="mvp-graph-kind">
                    <label className={kind === "numeric" ? "active" : ""}>
                      <input
                        type="radio"
                        name="graph-measure"
                        value="numeric"
                        checked={kind === "numeric"}
                        disabled={!numericProperties.length}
                        onChange={() => setKind("numeric")}
                      />
                      Numeric properties
                    </label>
                    <label className={kind === "count" ? "active" : ""}>
                      <input
                        type="radio"
                        name="graph-measure"
                        value="count"
                        checked={kind === "count"}
                        onChange={() => setKind("count")}
                      />
                      Event count
                    </label>
                  </div>
                </fieldset>

                {kind === "numeric" && (
                  <fieldset className="mvp-series-options mvp-event-properties">
                    <legend>Values</legend>
                    {numericProperties.length ? numericProperties.map((property) => (
                      <label className="sw-check" key={property}>
                        <input
                          type="checkbox"
                          checked={propertyNames.includes(property)}
                          onChange={() => toggleProperty(property)}
                        />
                        <code>{property}</code>
                      </label>
                    )) : <p className="sw-muted">This event has no numeric properties. Choose Event count instead.</p>}
                  </fieldset>
                )}

                <label className="mvp-graph-select">Time range
                  <select value={range} onChange={(e) => setRange(e.target.value)}>
                    {DASHBOARD_RANGES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </label>
              </>
            )}

            <div className="sw-dialog-actions">
              <button className="sw-button" type="button" onClick={() => setAdding(false)}>Cancel</button>
              <button
                className="sw-button sw-primary"
                type="submit"
                disabled={!eventName || (kind === "numeric" && !propertyNames.length)}
              >
                Add graph
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
