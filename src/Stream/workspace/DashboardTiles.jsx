import React, { useEffect, useRef, useState } from "react";
import { FiMoreHorizontal, FiPlay } from "react-icons/fi";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";
import { kindLabel, queryRange, RANGES, runCost, TERMINAL } from "../insightModel";
import InsightResult from "./InsightResult";

// Results stay for this browser session, so moving between dashboards does not
// spend credits again. Keyed by insight and revision: an edit needs a new run.
const results = new Map();
const resultKey = (insight) => `${insight.id}@${insight.revision}`;

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
  const cached = insight ? results.get(resultKey(insight)) : null;
  const [state, setState] = useState(cached ? { status: "done", ...cached } : { status: "idle" });
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const title = tile.title || insight?.name || "Insight";
  if (!insight) {
    return <Panel title={title} meta="Saved insight" className="st-dashboard-graph" action={<TileMenu label={title} moves={moves} onRemove={onRemove} />}>
      <div className="st-widget-no-data"><p>This insight was deleted.</p><button className="sw-link" type="button" onClick={onRemove}>Remove the tile</button></div>
    </Panel>;
  }
  const range = queryRange(insight.query), cost = runCost(insight.kind, range);
  const rangeLabel = RANGES.find((r) => r.id === range)?.label || range;
  const actor = insight.kind === "trends" ? "Events" : insight.query.actor === "session" ? "Sessions" : "Devices";
  const run = async () => {
    setState({ status: "running", progress: null });
    try {
      let { job } = await client.runInsight(projectId, insight.id, `web-${insight.id}-${Date.now().toString(36)}`);
      while (alive.current && !TERMINAL.includes(job.state)) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (!alive.current) return;
        ({ job } = await client.analysisJob(projectId, job.id));
        if (alive.current) setState({ status: "running", progress: job.progress });
      }
      if (!alive.current) return;
      if (job.state === "failed" || job.state === "cancelled") { setState({ status: "error", message: jobError(job.error) }); return; }
      const done = { result: job.result, at: new Date() };
      results.set(resultKey(insight), done);
      setState({ status: "done", ...done });
    } catch (error) {
      if (alive.current) setState({ status: "error", message: jobError(error) });
    }
  };
  const running = state.status === "running";
  return <Panel title={title} meta={`${kindLabel(insight.kind)} · ${actor} · ${rangeLabel}`} className="st-dashboard-graph st-insight-tile"
    action={<TileMenu label={title} moves={moves} onRemove={onRemove} />}>
    <div className="st-insight-body" aria-busy={running}>
      {state.status === "done" && <InsightResult kind={insight.kind} result={state.result} />}
      {state.status === "error" && <p role="alert" className="st-insight-error">{state.message}</p>}
      {state.status === "idle" && <p className="st-muted">{insight.description || "Run this insight to see its result."}</p>}
      {running && <p className="st-muted" role="status">Analyzing{state.progress?.candidates ? ` · ${state.progress.candidates.toLocaleString()} events read` : ""}…</p>}
      <div className="st-insight-run">
        <button className="sw-button" type="button" onClick={run} disabled={running}><FiPlay aria-hidden="true" /> {state.status === "done" ? "Run again" : "Run"}</button>
        <small>{cost} credits{state.at ? ` · last run ${state.at.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : ""}</small>
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
