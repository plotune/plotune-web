import React, { useEffect, useRef } from "react";
import { FiX, FiArrowUpRight } from "react-icons/fi";

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
export function Dialog({ title, subtitle, onClose, children, wide = false }) {
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
      className={`sw-dialog ${wide ? "sw-dialog-wide" : ""}`}
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
  unit = "",
  color = "#00796b",
  label,
  compact = false,
  threshold,
}) {
  const floor = Math.min(...values, threshold ?? Infinity);
  const ceiling = Math.max(...values, threshold ?? -Infinity);
  const span = ceiling - floor || 1;
  const y = (v) => 112 - ((v - floor) / span) * 80;
  const points = values
    .map((v, i) => `${40 + (i / (values.length - 1)) * 420},${y(v)}`)
    .join(" ");
  return (
    <svg
      className={`sw-trend ${compact ? "sw-trend-compact" : ""}`}
      viewBox="0 0 480 150"
      role="img"
      aria-label={`${label}: ${values.join(", ")} ${unit}`}
    >
      <title>{label}</title>
      {!compact && (
        <>
          {[32, 72, 112].map((v) => (
            <line key={v} x1="40" y1={v} x2="460" y2={v} stroke="#e5e9eb" />
          ))}
          <text x="0" y="35">
            {ceiling.toFixed(0)}
          </text>
          <text x="0" y="115">
            {floor.toFixed(0)}
          </text>
          <text x="40" y="140">
            10:00
          </text>
          <text x="220" y="140">
            10:25
          </text>
          <text x="423" y="140">
            10:50
          </text>
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
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="460" cy={y(values[values.length - 1])} r="3.5" fill={color} />
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
