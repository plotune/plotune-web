import React, { useMemo, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Panel } from "../StreamWorkspace/WorkspaceUI";
import { DASHBOARD_RANGES } from "./dashboardModel";
import { buildWidgetSeries } from "./widgetModel";
import WidgetChart from "./WidgetChart";

export default function DashboardGraph({ widget, events, filters, now, onEdit, onRemove }) {
  const [inspectionIndex, setInspectionIndex] = useState(null);
  const result = useMemo(() => buildWidgetSeries(events, widget, filters, now), [events, widget, filters, now]);
  const range = DASHBOARD_RANGES.find((item) => item.id === widget.range) || DASHBOARD_RANGES[1];
  const filter = filters.find((item) => item.id === widget.filterId);
  const title = widget.title || widget.eventName;
  const ready = result.status === "ready" && result.series.some((item) => item.points.some((point) => Number.isFinite(point.value)));
  const inspectedPoint = inspectionIndex === null ? null : result.series[0]?.points[inspectionIndex];
  const inspectedTime = inspectedPoint?.timestamp
    ? new Date(inspectedPoint.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" })
    : "";

  return <Panel title={title} meta={`${filter?.name || "No Saved Filter"} · ${range.label}`} className="mvp-dashboard-graph" action={(
    <details className="mvp-dashboard-menu"><summary aria-label={`Options for ${title}`}><FiMoreHorizontal /></summary><div><button type="button" onClick={onEdit}>Edit widget</button><button type="button" className="danger" onClick={onRemove}>Remove widget</button></div></details>
  )}>
    {result.status === "missing-filter" ? <div className="mvp-widget-no-data"><p>The Saved Filter used here was deleted.</p><button className="sw-link" type="button" onClick={onEdit}>Choose a replacement</button></div>
      : ready ? <><div className="mvp-graph-chart"><div className="mvp-graph-stage"><WidgetChart series={result.series} visualization={widget.chartType || "line"} label={title} activeIndex={inspectionIndex} onInspectPoint={setInspectionIndex} />{inspectedPoint && <div className="mvp-chart-inspection" role="status" aria-live="polite"><time dateTime={inspectedPoint.timestamp}>{inspectedTime} UTC</time><div>{result.series.map((item, index) => { const point = item.points[inspectionIndex]; return point && Number.isFinite(point.value) ? <span key={item.key}><i className={`mvp-graph-color color-${index % 6}`} /><b>{item.label}</b><strong>{String(point.value)}</strong></span> : null; })}</div></div>}</div></div><div className="mvp-graph-legend" aria-label="Chart series">{result.series.map((item, index) => <span key={item.key}><i className={`mvp-graph-color color-${index % 6}`} />{item.label}</span>)}</div></>
        : <div className="mvp-graph-empty">{result.events.length ? "No values for this property in the selected range." : "No matching events in this time range."}</div>}
  </Panel>;
}
