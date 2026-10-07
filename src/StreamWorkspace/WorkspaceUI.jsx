import React, { useEffect, useRef } from "react";
import { FiX, FiArrowUpRight } from "react-icons/fi";
import { getTrendGeometry } from "./trendModel";

export function Badge({ children, tone }) {
  const kind =
    tone ||
    {
      Passed: "good",
      Connected: "good",
      Active: "good",
      Info: "neutral",
      Failed: "bad",
      Critical: "bad",
      Warning: "warn",
      Delayed: "warn",
      Draft: "neutral",
      Pending: "neutral",
    }[children] ||
    "neutral";
  return (
    <span className={`sw-badge sw-${kind}`}>
      <span className="sw-status-dot" />
      {children}
    </span>
  );
}
export function Panel({ title, meta, action, children, className = "" }) {
  return (
    <section className={`sw-panel ${className}`}>
      <header className="sw-panel-head">
        <h2>{title}</h2>
        {meta && <span className="sw-muted">{meta}</span>}
        {action}
      </header>
      {children}
    </section>
  );
}
export function Empty({
  title = "No matching results",
  description = "Try a different filter or clear your search.",
  action,
}) {
  return (
    <div className="sw-empty">
      <span className="sw-empty-icon">⌁</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Dialog({ title, subtitle, onClose, children, wide = false, className = "" }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    const priorFocus = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (priorFocus?.isConnected) priorFocus.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`sw-dialog ${wide ? "sw-dialog-wide" : ""} ${className}`}
      aria-labelledby="sw-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        closeRef.current();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
    >
      <div className="sw-dialog-inner">
        <header className="sw-dialog-head">
          <div>
            <span className="sw-eyebrow">PLOTUNE STREAM</span>
            <h2 id="sw-dialog-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            className="sw-icon-button"
            aria-label="Close detail"
            onClick={onClose}
          >
            <FiX />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
export function Trend({
  values,
  series,
  unit = "",
  color = "#00796b",
  label,
  compact = false,
  threshold,
  activeIndex = null,
  onInspectPoint,
}) {
  const palette = ["#00796b", "#b17a2c", "#6266ad", "#b34540", "#3d8295", "#73864b"];
  const plotted = series?.length
    ? series.map((item, index) => ({
        ...item,
        color: item.color || palette[index % palette.length],
        values: item.points ? item.points.map((point) => point.value) : item.values,
      }))
    : [{ label, color, values }];
  const allValues = plotted.flatMap((item) => item.values || []).filter(Number.isFinite);
  const floor = Math.min(...allValues, threshold ?? Infinity);
  const ceiling = Math.max(...allValues, threshold ?? -Infinity);
  const span = ceiling - floor || 1;
  const y = (v) => 112 - ((v - floor) / span) * 80;
  const pointCount = Math.max(1, ...plotted.map((item) => item.values?.length || 0));
  const formatTime = (point) => point?.timestamp
    ? new Date(point.timestamp).toISOString().slice(11, 16)
    : "";
  const firstPoint = plotted[0]?.points?.[0];
  const lastPoint = plotted[0]?.points?.[plotted[0].points.length - 1];
  const inspectPointer = (event) => {
    if (!onInspectPoint) return;
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    let x = ((event.clientX - rect.left) / rect.width) * 480;
    try {
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      x = point.matrixTransform(svg.getScreenCTM().inverse()).x;
    } catch {
      // Bounding-rect mapping above covers browsers without SVG point transforms.
    }
    const fraction = Math.max(0, Math.min(1, (x - 40) / 420));
    onInspectPoint(Math.round(fraction * (pointCount - 1)));
  };
  return (
    <svg
      className={`sw-trend ${compact ? "sw-trend-compact" : ""}`}
      viewBox="0 0 480 150"
      role="img"
      onPointerMove={onInspectPoint ? inspectPointer : undefined}
      onPointerDown={onInspectPoint ? (event) => {
        if (event.pointerType === "touch") inspectPointer(event);
      } : undefined}
      onPointerLeave={onInspectPoint ? (event) => {
        if (event.pointerType !== "touch") onInspectPoint(null);
      } : undefined}
      style={onInspectPoint ? { touchAction: "pan-y" } : undefined}
      aria-label={series?.length
        ? `Time series: ${series.map((item) => item.label).join(", ")}`
        : `${label}: ${values.join(", ")} ${unit}`}
    >
      <title>{series?.length ? series.map((item) => item.label).join(", ") : label}</title>
      {!compact && (
        <>
          {[32, 72, 112].map((v) => (
            <line key={v} x1="40" y1={v} x2="460" y2={v} stroke="#e5e9eb" />
          ))}
          {allValues.length > 0 && <>
            <text x="0" y="35">{ceiling.toFixed(1)}</text>
            <text x="0" y="115">{floor.toFixed(1)}</text>
          </>}
          <text x="40" y="140">{series?.length ? formatTime(firstPoint) : "10:00"}</text>
          <text x="423" y="140">{series?.length ? formatTime(lastPoint) : "10:50"}</text>
        </>
      )}
      {threshold !== undefined && (
        <>
          <line
            x1="40"
            x2="460"
            y1={y(threshold)}
            y2={y(threshold)}
            stroke="#b34540"
            strokeDasharray="5 4"
          />
          <text x="300" y={y(threshold) - 6} style={{ fill: "#b34540" }}>
            Limit {threshold} {unit}
          </text>
        </>
      )}
      {plotted.map((item, index) => {
        const seriesValues = item.values || [];
        const geometry = getTrendGeometry(seriesValues, pointCount, y);
        return <g key={item.key || item.label || index}>
          <path d={geometry.path} fill="none" stroke={item.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {geometry.points.map((point) => (
            <circle key={point.index} cx={point.x} cy={point.y} r="3.5" fill={item.color} />
          ))}
        </g>;
      })}
      {onInspectPoint && Number.isInteger(activeIndex) && activeIndex < pointCount && (
        <g className="sw-trend-inspection" pointerEvents="none">
          <line
            x1={40 + (activeIndex / Math.max(1, pointCount - 1)) * 420}
            x2={40 + (activeIndex / Math.max(1, pointCount - 1)) * 420}
            y1="25"
            y2="118"
          />
          {plotted.map((item, index) => {
            const value = item.values?.[activeIndex];
            if (!Number.isFinite(value)) return null;
            return (
              <circle
                key={item.key || item.label || index}
                cx={40 + (activeIndex / Math.max(1, pointCount - 1)) * 420}
                cy={y(value)}
                r="5"
                fill={item.color}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}
export function RunTable({ runs, onRun }) {
  return (
    <div className="sw-table-wrap">
      <table className="sw-table">
        <thead>
          <tr>
            <th>Run</th>
            <th>Test suite</th>
            <th>Result</th>
            <th>Duration</th>
            <th>Started · UTC</th>
            <th>
              <span className="sw-sr-only">Inspect</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td>
                <button
                  className="sw-link sw-mono"
                  onClick={() => onRun(run.id)}
                >
                  #{run.id}
                </button>
              </td>
              <td>{run.suite}</td>
              <td>
                <Badge>{run.result}</Badge>
              </td>
              <td className="sw-mono">{run.duration} s</td>
              <td className="sw-muted sw-mono">{run.time}</td>
              <td>
                <button
                  className="sw-icon-button"
                  aria-label={`Inspect run ${run.id}`}
                  onClick={() => onRun(run.id)}
                >
                  <FiArrowUpRight />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function EventTable({ events, onEvent, onRun }) {
  return (
    <div className="sw-table-wrap">
      <table className="sw-table">
        <thead>
          <tr>
            <th>Time · UTC</th>
            <th>Event</th>
            <th>Severity</th>
            <th>Source</th>
            <th>Run</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="sw-mono sw-muted">{event.time}</td>
              <td>
                <button
                  className="sw-link sw-mono"
                  onClick={() => onEvent(event)}
                >
                  {event.name}
                </button>
              </td>
              <td>
                <Badge>{event.severity}</Badge>
              </td>
              <td>{event.source}</td>
              <td>
                <button
                  className="sw-link sw-mono"
                  onClick={() => onRun(event.run)}
                >
                  #{event.run}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
