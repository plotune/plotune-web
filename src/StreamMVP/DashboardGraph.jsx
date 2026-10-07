import React, { useMemo } from "react";
import { FiX } from "react-icons/fi";
import { Panel, Trend } from "../StreamWorkspace/WorkspaceUI";
import { DASHBOARD_RANGES, buildGraphSeries, graphIsWide } from "./dashboardModel";

export default function DashboardGraph({ graph, events, now, onRemove }) {
  const series = useMemo(() => buildGraphSeries(events, graph, now), [events, graph, now]);
  const range = DASHBOARD_RANGES.find((item) => item.id === graph.range) || DASHBOARD_RANGES[1];
  const title = graph.kind === "count"
    ? `${graph.eventName} · event count`
    : graph.seriesKeys.length === 1
      ? graph.seriesKeys[0]
      : graph.seriesKeys.length > 2
        ? `${graph.seriesKeys[0].split(".")[0]} · ${graph.seriesKeys.length} series`
        : `Numeric properties · ${graph.seriesKeys.length} series`;

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
            <Trend series={series} label={title} />
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
