import React, { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { Panel, Trend } from "../StreamWorkspace/WorkspaceUI";
import { DASHBOARD_RANGES, buildGraphSeries, graphIsWide } from "./dashboardModel";

export default function DashboardGraph({ graph, events, now, onRemove }) {
  const [inspectionIndex, setInspectionIndex] = useState(null);
  const series = useMemo(() => buildGraphSeries(events, graph, now), [events, graph, now]);
  const range = DASHBOARD_RANGES.find((item) => item.id === graph.range) || DASHBOARD_RANGES[1];
  const seriesNames = graph.propertyNames
    ? graph.propertyNames.map((property) => `${graph.eventName}.${property}`)
    : graph.seriesKeys || [];
  const title = graph.kind === "count"
    ? `${graph.eventName} · event count`
    : seriesNames.length === 1
      ? seriesNames[0]
      : `${graph.eventName} · ${seriesNames.length} series`;
  const inspectedPoint = inspectionIndex === null
    ? null
    : series[0]?.points[inspectionIndex];
  const inspectedTime = inspectedPoint?.timestamp
    ? new Date(inspectedPoint.timestamp).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      })
    : "";

  return (
    <Panel
      title={title}
      meta={range.label}
      className={`mvp-dashboard-graph ${graphIsWide(graph) ? "mvp-dashboard-graph-wide" : ""}`}
      action={(
        <button className="sw-icon-button" aria-label={`Remove ${title}`} onClick={onRemove}>
          <FiX />
        </button>
      )}
    >
      {series.some((item) => item.points.some((point) => point.value !== null)) ? (
        <>
          <div className="mvp-graph-chart">
            <div className="mvp-graph-stage">
              <Trend
                series={series}
                label={title}
                activeIndex={inspectionIndex}
                onInspectPoint={setInspectionIndex}
              />
              {inspectedPoint && (
                <div className="mvp-chart-inspection" role="status" aria-live="polite">
                  <time dateTime={inspectedPoint.timestamp}>{inspectedTime} UTC</time>
                  <div>
                    {series.map((item, index) => {
                      const point = item.points[inspectionIndex];
                      return point && Number.isFinite(point.value) ? (
                        <span key={item.key}>
                          <i className={`mvp-graph-color color-${index % 6}`} />
                          <b>{item.label}</b>
                          <strong>{String(point.value)}</strong>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mvp-graph-legend" aria-label="Graph series">
            {series.map((item, index) => (
              <span key={item.key}>
                <i className={`mvp-graph-color color-${index % 6}`} />
                {item.label}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="mvp-graph-empty">No matching values in this time range.</div>
      )}
    </Panel>
  );
}
