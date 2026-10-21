import React, { useMemo, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Panel } from "../StreamWorkspace/WorkspaceUI";
import { DASHBOARD_RANGES } from "./dashboardModel";
import { buildWidgetSeries } from "./widgetModel";
import WidgetChart from "./WidgetChart";

export default function DashboardGraph({ widget, events, filters, now, onEdit, onRemove, data, moves }) {
  const [inspectionIndex, setInspectionIndex] = useState(null);
  const localResult = useMemo(() => buildWidgetSeries(events, widget, filters, now), [events, widget, filters, now]);
  const result = data || localResult;
  const range = DASHBOARD_RANGES.find((item) => item.id === widget.range) || DASHBOARD_RANGES[1];
  const filter = filters.find((item) => item.id === widget.filterId);
  const title = widget.title || widget.eventName;
  const ready = result.status === "ready" && result.series.some((item) => item.points.some((point) => Number.isFinite(point.value)));
  const inspectedPoint = inspectionIndex === null ? null : result.series[0]?.points[inspectionIndex];
  const inspectedTime = inspectedPoint?.timestamp
    ? new Date(inspectedPoint.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" })
    : "";

  return <Panel title={title} meta={`${filter?.name || (widget.filterId ? "Saved Filter" : "No Saved Filter")} · ${range.label}`} className="st-dashboard-graph" action={(
    <details className="st-dashboard-menu"><summary aria-label={`Options for ${title}`}><FiMoreHorizontal /></summary><div><button type="button" onClick={onEdit}>Edit widget</button>{moves?.up && <button type="button" onClick={moves.up}>Move earlier</button>}{moves?.down && <button type="button" onClick={moves.down}>Move later</button>}<button type="button" className="danger" onClick={onRemove}>Remove widget</button></div></details>
  )}>
    {result.status === "missing-filter" ? <div className="st-widget-no-data"><p>The Saved Filter used here was deleted.</p><button className="sw-link" type="button" onClick={onEdit}>Choose a replacement</button></div>
      : ready ? <><div className="st-graph-chart"><div className="st-graph-stage"><WidgetChart series={result.series} visualization={widget.chartType || "line"} label={title} activeIndex={inspectionIndex} onInspectPoint={setInspectionIndex} />{inspectedPoint && <div className="st-chart-inspection" role="status" aria-live="polite"><time dateTime={inspectedPoint.timestamp}>{inspectedTime} UTC</time><div>{result.series.map((item, index) => { const point = item.points[inspectionIndex]; return point && Number.isFinite(point.value) ? <span key={item.key}><i className={`st-graph-color color-${index % 6}`} /><b>{item.label}</b><strong>{String(point.value)}</strong></span> : null; })}</div></div>}</div></div><div className="st-graph-legend" aria-label="Chart series">{result.series.map((item, index) => <span key={item.key}><i className={`st-graph-color color-${index % 6}`} />{item.label}</span>)}</div></>
        : <div className="st-graph-empty">{(result.eventCount ?? result.events.length) ? "No values for this property in the selected range." : "No matching events in this time range."}</div>}
  </Panel>;
}
