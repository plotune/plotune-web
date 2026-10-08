import React, { useMemo, useState } from "react";
import { FiEdit2, FiX } from "react-icons/fi";
import { Panel, Trend } from "../StreamWorkspace/WorkspaceUI";
import { DASHBOARD_RANGES } from "./dashboardModel";
import { buildWidgetSeries } from "./widgetModel";

export default function DashboardGraph({ widget, events, savedFilters, now, onEdit, onRemove }) {
  const [inspectionIndex, setInspectionIndex] = useState(null);
  const result = useMemo(() => buildWidgetSeries(events, widget, savedFilters, now), [events, widget, savedFilters, now]);
  const range = DASHBOARD_RANGES.find((item) => item.id === widget.range) || DASHBOARD_RANGES[1];
  const savedFilter = savedFilters.find((filter) => filter.id === widget.filterId);
  const inspectedPoint = inspectionIndex === null ? null : result.series[0]?.points[inspectionIndex];
  const inspectedTime = inspectedPoint?.timestamp
    ? new Date(inspectedPoint.timestamp).toLocaleString("en-GB", {
        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC",
      })
    : "";

  return (
    <Panel
      title={widget.title || widget.eventName}
      meta={`${savedFilter?.name || "No Saved Filter"} · ${range.label}`}
      className="mvp-dashboard-graph"
      action={(
        <div className="mvp-widget-actions">
          <button className="sw-link" type="button" onClick={() => onEdit(widget)}><FiEdit2 /> Edit</button>
          <button className="sw-icon-button" type="button" aria-label={`Remove ${widget.title || widget.eventName}`} onClick={onRemove}><FiX /></button>
        </div>
      )}
    >
      {result.status === "missing-filter" ? (
        <div className="mvp-widget-warning-block">
          <strong>Saved Filter unavailable</strong>
          <p>This widget’s referenced filter was deleted. Edit the widget to select a replacement filter.</p>
          <button className="sw-button" type="button" onClick={() => onEdit(widget)}>Choose a filter</button>
        </div>
      ) : result.status === "empty" || !result.series.some((series) => series.points.some((point) => Number.isFinite(point.value))) ? (
        <div className="mvp-graph-empty">{result.status === "empty" ? "No matching events in this time range. The widget keeps its Saved Filter and will update when events match." : "Matching events have no numeric values for this property."}</div>
      ) : (
        <>
          <div className="mvp-graph-chart">
            <div className="mvp-graph-stage">
              <Trend series={result.series} label={widget.title || widget.eventName} activeIndex={inspectionIndex} onInspectPoint={setInspectionIndex} />
              {inspectedPoint && (
                <div className="mvp-chart-inspection" role="status" aria-live="polite">
                  <time dateTime={inspectedPoint.timestamp}>{inspectedTime} UTC</time>
                  <div>{result.series.map((series, index) => {
                    const point = series.points[inspectionIndex];
                    return point && Number.isFinite(point.value) ? (
                      <span key={series.key}><i className={`mvp-graph-color color-${index % 6}`} /><b>{series.label}</b><strong>{String(point.value)}</strong></span>
                    ) : null;
                  })}</div>
                </div>
              )}
            </div>
          </div>
          <div className="mvp-graph-legend" aria-label="Widget series">
            {result.series.map((series, index) => <span key={series.key}><i className={`mvp-graph-color color-${index % 6}`} />{series.label}</span>)}
          </div>
        </>
      )}
    </Panel>
  );
}
