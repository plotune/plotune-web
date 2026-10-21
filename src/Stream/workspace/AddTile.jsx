import React, { useState } from "react";
import { FiBarChart2, FiFileText, FiTrendingUp } from "react-icons/fi";
import { Dialog } from "../../StreamWorkspace/WorkspaceUI";
import { buildQuery, INSIGHT_KINDS, kindLabel, missingField, PRICE_NOTE, RANGES } from "../insightModel";

// Three choices, one step each (Hick's law): a chart, an insight or a note.
export function TileChooser({ onChoose, onClose }) {
  const choices = [
    ["chart", FiBarChart2, "Chart", "Live count or measurement of one event; updates as events arrive."],
    ["insight", FiTrendingUp, "Insight", "Funnel, retention, lifecycle, stickiness, paths or trend; runs when you ask."],
    ["note", FiFileText, "Note", "Text for context, such as what the dashboard is for."],
  ];
  return <Dialog title="Add to dashboard" subtitle="What should this tile show?" onClose={onClose}>
    <div className="sw-detail-body st-tile-choices">
      {choices.map(([id, Icon, label, hint]) => <button key={id} type="button" className="st-tile-choice" onClick={() => onChoose(id)}>
        <Icon aria-hidden="true" /><strong>{label}</strong><span>{hint}</span>
      </button>)}
    </div>
  </Dialog>;
}

export function NoteEditor({ text: initial = "", onSave, onClose }) {
  const [text, setText] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try { await onSave(text.trim()); } catch (cause) { setError(cause.message); setBusy(false); }
  };
  return <Dialog title={initial ? "Edit note" : "Add a note"} onClose={onClose}>
    <form className="sw-detail-body st-dashboard-create" onSubmit={submit}>
      {error && <p role="alert">{error}</p>}
      <label>Text<textarea autoFocus required rows={6} maxLength={4000} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Runs on rig B use firmware 2.4; ignore failures before 10:00." /></label>
      <div className="sw-dialog-actions"><button className="sw-button" type="button" onClick={onClose}>Cancel</button><button className="sw-button sw-primary" type="submit" disabled={!text.trim() || busy}>Save note</button></div>
    </form>
  </Dialog>;
}

function EventField({ label, value, onChange, names, optional, id }) {
  return <label>{label}{optional && <span> Optional</span>}
    <input list={`${id}-names`} value={value} maxLength={128} onChange={(e) => onChange(e.target.value)} placeholder="Event name" />
    <datalist id={`${id}-names`}>{names.map((n) => <option key={n} value={n} />)}</datalist>
  </label>;
}

export function InsightPicker({ insights, discovery, onPick, onCreate, onClose }) {
  const [mode, setMode] = useState(insights.length ? "saved" : "new");
  const [picked, setPicked] = useState(insights[0]?.id || "");
  const [form, setForm] = useState({ name: "", kind: "funnel", range: "7d", actor: "device", event: "", returnEvent: "", steps: ["", ""], windowHours: 24, depth: 4 });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const names = discovery?.eventNames || [];
  const set = (change) => setForm((f) => ({ ...f, ...change }));
  const missing = missingField(form);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (mode === "saved") await onPick(picked);
      else await onCreate({ name: form.name.trim() || `${kindLabel(form.kind)}: ${form.kind === "funnel" ? form.steps.filter(Boolean).join(" → ") : form.event || "all events"}`.slice(0, 64), query: buildQuery(form) });
    } catch (cause) { setError(cause.message); setBusy(false); }
  };
  const kind = INSIGHT_KINDS.find((k) => k.id === form.kind);
  return <Dialog title="Add an insight" subtitle="Insights are saved for the whole project and can appear on several dashboards." onClose={onClose} wide>
    <form className="sw-detail-body st-insight-form" onSubmit={submit}>
      {error && <p role="alert">{error}</p>}
      {insights.length > 0 && <div className="st-segmented" role="radiogroup" aria-label="Insight source">
        {[["saved", "Use a saved insight"], ["new", "Create a new insight"]].map(([id, label]) => <label key={id}><input type="radio" name="source" checked={mode === id} onChange={() => setMode(id)} />{label}</label>)}
      </div>}
      {mode === "saved" ? <label>Saved insight<select value={picked} onChange={(e) => setPicked(e.target.value)}>
        {insights.map((i) => <option key={i.id} value={i.id}>{i.name} · {kindLabel(i.kind)}</option>)}
      </select></label> : <>
        <fieldset className="st-insight-kinds"><legend>Kind</legend>
          {INSIGHT_KINDS.map((k) => <label key={k.id} className={form.kind === k.id ? "active" : ""}><input type="radio" name="kind" value={k.id} checked={form.kind === k.id} onChange={() => set({ kind: k.id })} />{k.label}</label>)}
          <small>{kind.hint}</small>
        </fieldset>
        {form.kind === "funnel" ? <fieldset className="st-insight-steps"><legend>Steps, in order</legend>
          {form.steps.map((step, i) => <EventField key={i} id={`step-${i}`} label={`Step ${i + 1}`} value={step} names={names} onChange={(v) => set({ steps: form.steps.map((s, j) => (j === i ? v : s)) })} />)}
          {form.steps.length < 8 && <button className="sw-link" type="button" onClick={() => set({ steps: [...form.steps, ""] })}>Add a step</button>}
          <label>Finish within (hours)<input type="number" min={1} max={720} value={form.windowHours} onChange={(e) => set({ windowHours: e.target.value })} /></label>
        </fieldset>
          : <EventField id="event" label={form.kind === "retention" ? "First event" : form.kind === "paths" ? "Start at" : "Event"} optional={form.kind === "paths"} value={form.event} names={names} onChange={(v) => set({ event: v })} />}
        {form.kind === "retention" && <EventField id="return" label="Coming back means" optional value={form.returnEvent} names={names} onChange={(v) => set({ returnEvent: v })} />}
        {form.kind === "paths" && <label>Events per path<input type="number" min={2} max={8} value={form.depth} onChange={(e) => set({ depth: e.target.value })} /></label>}
        <div className="st-insight-row">
          <label>Range<select value={form.range} onChange={(e) => set({ range: e.target.value })}>{RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
          {form.kind !== "trends" && <label>Count<select value={form.actor} onChange={(e) => set({ actor: e.target.value })}><option value="device">Devices</option><option value="session">Sessions</option></select></label>}
        </div>
        <label>Name <span>Optional</span><input maxLength={64} value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Boot to ready" /></label>
        <p className="st-muted">{PRICE_NOTE(form.kind)} Credits come from the project owner's account.</p>
      </>}
      <div className="sw-dialog-actions"><button className="sw-button" type="button" onClick={onClose}>Cancel</button>
        <button className="sw-button sw-primary" type="submit" disabled={busy || (mode === "new" && Boolean(missing)) || (mode === "saved" && !picked)} title={mode === "new" ? missing || undefined : undefined}>Add insight</button></div>
    </form>
  </Dialog>;
}
