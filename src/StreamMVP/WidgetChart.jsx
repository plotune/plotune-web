import React from "react";
import { Trend } from "../StreamWorkspace/WorkspaceUI";

const COLORS = ["#00796b", "#b17a2c", "#6266ad", "#b34540", "#3d8295", "#73864b"];

export function WidgetBars({ series, label }) {
  const points = series.flatMap((item) => item.points).map((point) => point.value).filter(Number.isFinite);
  if (!points.length) return null;
  const low = Math.min(0, ...points);
  const high = Math.max(0, ...points);
  const span = high - low || 1;
  const y = (value) => 126 - ((value - low) / span) * 98;
  const count = Math.max(1, ...series.map((item) => item.points.length));
  const group = 420 / count;
  const width = Math.max(1, group * 0.74 / Math.max(1, series.length));
  const zero = y(0);
  return <svg className="mvp-widget-bars" viewBox="0 0 480 154" role="img" aria-label={`${label} bar chart`}>
    {[28, 77, 126].map((line) => <line key={line} x1="40" x2="460" y1={line} y2={line} stroke="#e5e9eb" />)}
    {series.flatMap((item, seriesIndex) => item.points.map((point, pointIndex) => {
      if (!Number.isFinite(point.value)) return null;
      const x = 40 + pointIndex * group + (group - width * series.length) / 2 + seriesIndex * width;
      const pointY = y(point.value);
      return <rect key={`${item.key}-${pointIndex}`} x={x} y={Math.min(zero, pointY)} width={Math.max(1, width - 1)} height={Math.max(1, Math.abs(zero - pointY))} fill={COLORS[seriesIndex % COLORS.length]}>
        <title>{`${item.label} · ${new Date(point.timestamp).toISOString()} · ${point.value}`}</title>
      </rect>;
    }))}
  </svg>;
}

export default function WidgetChart({ series, visualization, label, activeIndex, onInspectPoint }) {
  return visualization === "bar"
    ? <WidgetBars series={series} label={label} />
    : <Trend series={series} label={label} activeIndex={activeIndex} onInspectPoint={onInspectPoint} />;
}
