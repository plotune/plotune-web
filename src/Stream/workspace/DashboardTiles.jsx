import React, { useEffect, useRef, useState } from "react";
import { FiMoreHorizontal, FiPlay } from "react-icons/fi";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";
import { estimateText, kindLabel, queryRange, RANGES, TERMINAL } from "../insightModel";
import InsightResult from "./InsightResult";

const timeOf = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const today = new Date().toDateString() === d.toDateString();
  return today ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};
const who = (email) => (email || "").split("@")[0];

export function TileMenu({ label, moves, children, onRemove, removeLabel = "Remove from dashboard" }) {
  return <details className="st-dashboard-menu"><summary aria-label={`Options for ${label}`}><FiMoreHorizontal /></summary><div>
    {children}
    {moves?.up && <button type="button" onClick={moves.up}>Move earlier</button>}
    {moves?.down && <button type="button" onClick={moves.down}>Move later</button>}
    <button type="button" className="danger" onClick={onRemove}>{removeLabel}</button>
  </div></details>;
}

const JOB_ERRORS = {
  credits_exhausted: "The project owner's account has no credits left.",
  daily_credit_limit_reached: "Today's credit limit is reached; it resets at 00:00 UTC.",
  analysis_busy: "Analysis is busy right now. Try again in a minute.",
  deadline_exceeded: "The analysis took too long. Try a shorter range.",
};
const jobError = (error) => JOB_ERRORS[error?.code] || error?.message || "The analysis could not be completed.";

export function InsightTile({ client, projectId, tile, insight, moves, onRemove }) {
  // The last finished run is saved with the insight, so a reload shows it for free.
  const [state, setState] = useState({ status: insight?.lastRun ? "loading" : "idle" });
  const [estimate, setEstimate] = useState(null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const insightId = insight?.id, revision = insight?.revision, hasRun = Boolean(insight?.lastRun);
  useEffect(() => {
    if (!insightId) return undefined;
    const controller = new AbortController();
    if (hasRun) {
      client.insightResult(projectId, insightId, controller.signal)
        .then(({ lastResult }) => { if (!controller.signal.aborted) setState(lastResult ? { status: "done", result: lastResult.result, ranAt: lastResult.ranAt, ranBy: lastResult.ranBy, stale: lastResult.stale } : { status: "idle" }); })
        .catch(() => { if (!controller.signal.aborted) setState({ status: "idle" }); });
    }
    // The estimate is free; without it the price note still explains the cost.
    client.estimateInsight(projectId, insightId, controller.signal)
      .then((r) => { if (!controller.signal.aborted) setEstimate(r.estimate || null); })
      .catch(() => {});
    return () => controller.abort();
  }, [client, projectId, insightId, revision, hasRun]);
  const title = tile.title || insight?.name || "Insight";
  if (!insight) {
    return <Panel title={title} meta="Saved insight" className="st-dashboard-graph" action={<TileMenu label={title} moves={moves} onRemove={onRemove} />}>
      <div className="st-widget-no-data"><p>This insight was deleted.</p><button className="sw-link" type="button" onClick={onRemove}>Remove the tile</button></div>
    </Panel>;
  }
  const range = queryRange(insight.query);
  const rangeLabel = RANGES.find((r) => r.id === range)?.label || range;
  const actor = insight.kind === "trends" ? "Events" : insight.query.actor === "session" ? "Sessions" : "Devices";
  const run = async () => {
    setState((old) => ({ ...old, status: "running", progress: null, previous: old.result ? old : old.previous }));
    try {
      let { job } = await client.runInsight(projectId, insight.id, `web-${insight.id}-${Date.now().toString(36)}`);
      while (alive.current && !TERMINAL.includes(job.state)) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (!alive.current) return;
        ({ job } = await client.analysisJob(projectId, job.id));
        if (alive.current) setState((old) => ({ ...old, status: "running", progress: job.progress }));
      }
      if (!alive.current) return;
      if (job.state === "failed" || job.state === "cancelled") { setState((old) => ({ ...(old.previous || {}), status: "error", message: jobError(job.error) })); return; }
      setState({ status: "done", result: job.result, ranAt: job.createdAt || new Date().toISOString(), ranBy: "", stale: false, credits: job.progress?.credits });
    } catch (error) {
      if (alive.current) setState((old) => ({ ...(old.previous || {}), status: "error", message: jobError(error) }));
    }
  };
  const running = state.status === "running";
  const shown = state.result ? state : state.previous;
  const lastRun = shown?.ranAt ? `Last run ${timeOf(shown.ranAt)}${shown.ranBy ? ` by ${who(shown.ranBy)}` : ""}${shown.credits !== undefined ? ` · ${Math.ceil(shown.credits)} credits` : ""}` : "";
  return <Panel title={title} meta={`${kindLabel(insight.kind)} · ${actor} · ${rangeLabel}`} className="st-dashboard-graph st-insight-tile"
    action={<TileMenu label={title} moves={moves} onRemove={onRemove} />}>
    <div className="st-insight-body" aria-busy={running || state.status === "loading"}>
      {shown?.result && <InsightResult kind={insight.kind} result={shown.result} />}
      {shown?.stale && <p className="st-insight-note" role="note">The insight changed after this run. Run it again to update the result.</p>}
      {state.status === "error" && <p role="alert" className="st-insight-error">{state.message}</p>}
      {state.status === "loading" && <p className="st-muted" role="status">Loading the last result…</p>}
      {state.status === "idle" && <p className="st-muted">{insight.description || "Not run yet. Run it to see the result."}</p>}
      {running && <p className="st-muted" role="status">Analyzing{state.progress?.candidates ? ` · ${state.progress.candidates.toLocaleString()} events read · ${Math.ceil(state.progress.credits || 0)} credits so far` : ""}…</p>}
      <div className="st-insight-run">
        <button className="sw-button" type="button" onClick={run} disabled={running}><FiPlay aria-hidden="true" /> {shown?.result ? "Run again" : "Run"}</button>
        <small>{[estimate ? `Next run: ${estimateText(estimate)}` : "", lastRun].filter(Boolean).join(" · ")}</small>
      </div>
    </div>
  </Panel>;
}

export function TextTile({ tile, moves, onEdit, onRemove }) {
  return <Panel title="Note" className="st-dashboard-graph st-text-tile" action={<TileMenu label="note" moves={moves} onRemove={onRemove}>
    <button type="button" onClick={onEdit}>Edit text</button>
  </TileMenu>}>
    <div className="st-text-tile-body">{tile.text}</div>
  </Panel>;
}
