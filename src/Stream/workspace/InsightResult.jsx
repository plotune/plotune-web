import React from "react";
import { coverageNote, duration, percent } from "../insightModel";

// Result renderers for saved insights. Plain HTML bars and tables: readable at a glance,
// accessible to screen readers, and the same in every browser.
const day = (iso, hourly) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : hourly
    ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
};
const share = (n, max) => `${max > 0 ? Math.max(2, (n / max) * 100) : 0}%`;
const who = (summary) => (summary?.actor === "session" ? "sessions" : "devices");

function Bars({ rows, label, value, detail, caption }) {
  const max = Math.max(0, ...rows.map(value));
  return <table className="st-insight-bars"><caption className="sw-sr-only">{caption}</caption>
    <tbody>{rows.map((row, i) => <tr key={i}>
      <th scope="row">{label(row)}</th>
      <td><span className="st-insight-bar"><span style={{ width: share(value(row), max) }} /></span></td>
      <td className="st-insight-num">{value(row).toLocaleString()}{detail && <small>{detail(row)}</small>}</td>
    </tr>)}</tbody></table>;
}

function Funnel({ rows, summary }) {
  return <Bars rows={rows} caption={`Funnel by ${who(summary)}`} label={(r) => `${r.step}. ${r.name}`} value={(r) => r.actors}
    detail={(r) => (r.step === 1 ? `${who(summary)}` : `${percent(r.conversionFromPrevious)} of previous · ${duration(r.medianSecondsFromPrevious)} median`)} />;
}

function Retention({ rows, summary }) {
  const width = Math.max(1, ...rows.map((r) => r.periods.length));
  const hourly = summary?.interval === "hour";
  return <div className="st-insight-scroll"><table className="st-insight-grid">
    <caption className="sw-sr-only">Retention of {who(summary)} by first {summary?.interval || "day"}</caption>
    <thead><tr><th scope="col">Cohort</th><th scope="col">Size</th>{Array.from({ length: width }, (_, j) => <th key={j} scope="col">{j === 0 ? "Start" : `+${j}`}</th>)}</tr></thead>
    <tbody>{rows.filter((r) => r.cohortSize > 0).map((r) => <tr key={r.cohort}>
      <th scope="row">{day(r.cohortStart, hourly)}</th><td>{r.cohortSize}</td>
      {Array.from({ length: width }, (_, j) => {
        if (j >= r.periods.length) return <td key={j} />;
        const rate = r.cohortSize ? r.periods[j] / r.cohortSize : 0;
        return <td key={j} className="st-insight-cell" style={{ "--rate": rate }} title={`${r.periods[j]} of ${r.cohortSize}`}>{percent(rate)}</td>;
      })}
    </tr>)}</tbody></table></div>;
}

const LIFECYCLE = [["new", "New"], ["returning", "Returning"], ["resurrecting", "Back after a gap"], ["dormant", "Went quiet"]];
function Lifecycle({ rows, summary }) {
  const hourly = summary?.interval === "hour";
  const max = Math.max(1, ...rows.map((r) => r.new + r.returning + r.resurrecting), ...rows.map((r) => r.dormant));
  return <div className="st-insight-scroll">
    <ul className="st-insight-legend" aria-hidden="true">{LIFECYCLE.map(([k, label]) => <li key={k} className={`st-lc-${k}`}>{label}</li>)}</ul>
    <table className="st-insight-lifecycle"><caption className="sw-sr-only">Lifecycle of {who(summary)}</caption>
      <thead><tr><th scope="col">{hourly ? "Hour" : "Day"}</th>{LIFECYCLE.map(([k, label]) => <th key={k} scope="col">{label}</th>)}<th scope="col"><span className="sw-sr-only">Chart</span></th></tr></thead>
      <tbody>{rows.map((r) => <tr key={r.period}>
        <th scope="row">{day(r.periodStart, hourly)}</th>
        {LIFECYCLE.map(([k]) => <td key={k}>{r[k]}</td>)}
        <td className="st-lc-chart" aria-hidden="true"><span className="st-lc-stack">
          {["new", "returning", "resurrecting"].map((k) => <span key={k} className={`st-lc-${k}`} style={{ width: `${(r[k] / max) * 50}%` }} />)}
        </span><span className="st-lc-stack st-lc-down"><span className="st-lc-dormant" style={{ width: `${(r.dormant / max) * 50}%` }} /></span></td>
      </tr>)}</tbody></table></div>;
}

function Stickiness({ rows, summary }) {
  const shown = rows.filter((r, i) => r.actors > 0 || i < 7);
  return <Bars rows={shown} caption={`${who(summary)} by active ${summary?.interval || "day"}s`}
    label={(r) => `${r.intervals} ${summary?.interval || "day"}${r.intervals === 1 ? "" : "s"}`} value={(r) => r.actors} />;
}

function Paths({ rows, summary }) {
  return <Bars rows={rows.slice(0, 15)} caption={`Most common transitions of ${who(summary)}`}
    label={(r) => `${r.step}. ${r.source} → ${r.target}`} value={(r) => r.actors} />;
}

function Trends({ rows }) {
  const hourly = rows.length > 1 && Date.parse(rows[1].bucketStart) - Date.parse(rows[0].bucketStart) < 86400000;
  return <Bars rows={rows.filter((r) => r.bucketStart)} caption="Events per interval" label={(r) => day(r.bucketStart, hourly)} value={(r) => r.matched} />;
}

const RENDERERS = { funnel: Funnel, retention: Retention, lifecycle: Lifecycle, stickiness: Stickiness, paths: Paths, trends: Trends };

export default function InsightResult({ kind, result }) {
  const Render = RENDERERS[kind];
  const rows = result?.rows || [];
  const note = coverageNote(result);
  const summary = result?.summary;
  const empty = kind === "trends" ? !rows.some((r) => r.matched) : !summary?.actors;
  return <div className="st-insight-result">
    {empty ? <p className="st-insight-empty">No matching events in this range{summary?.unattributedEvents ? `; ${summary.unattributedEvents} events had no ${summary.actor === "session" ? "session" : "device"} id` : ""}.</p>
      : <Render rows={rows} summary={summary} />}
    {note && <p className="st-insight-note" role="note">{note}</p>}
  </div>;
}
