import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Dialog, Empty, Panel } from "../../StreamWorkspace/WorkspaceUI";
import { Failure } from "./LiveExplorer";

// C03 catalog: what events and properties mean, named actions and path rules. The
// definitions sit beside the events; nothing here changes captured data.

export const PROPERTY_KINDS = [
  ["", "Not set"],
  ["measurement", "Measurement"],
  ["identifier", "Identifier"],
  ["category", "Category"],
  ["flag", "Flag"],
  ["timestamp", "Timestamp"],
  ["text", "Text"],
];
const TABS = [
  ["events", "Events"],
  ["properties", "Properties"],
  ["actions", "Actions"],
  ["paths", "Path rules"],
];
const conflict = (error) =>
  error?.code === "revision_conflict" ? "Someone else changed this. It has been reloaded; review and save again." : error?.message;

function Changed({ entry }) {
  if (!entry?.updatedAt) return null;
  return (
    <p className="ct-changed">
      Last changed by {entry.updatedBy} {entry.updatedVia === "mcp" ? `via ${entry.updatedClient || "MCP"}` : "in the workspace"} ·{" "}
      <time dateTime={entry.updatedAt}>{new Date(entry.updatedAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC</time>
    </p>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="ct-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function EventDialog({ name, entry, onSave, onClose }) {
  const [draft, setDraft] = useState({ description: entry?.description || "", owner: entry?.owner || "", tags: (entry?.tags || []).join(", "), verified: !!entry?.verified });
  const [state, setState] = useState({ busy: false, error: null });
  const save = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: null });
    try {
      await onSave({ description: draft.description, owner: draft.owner, verified: draft.verified,
        tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean), ...(entry ? { revision: entry.revision } : {}) });
      onClose();
    } catch (error) {
      setState({ busy: false, error });
    }
  };
  return (
    <Dialog title={name} subtitle="Event definition" onClose={onClose}>
      <form className="sw-detail-body ct-form" onSubmit={save}>
        <Field label="Description" hint="What one occurrence of this event means.">
          <textarea rows={3} maxLength={500} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        </Field>
        <Field label="Owner" hint="Person or team responsible.">
          <input maxLength={120} value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} />
        </Field>
        <Field label="Tags" hint="Comma-separated, up to 10.">
          <input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} />
        </Field>
        <label className="ct-check">
          <input type="checkbox" checked={draft.verified} onChange={(e) => setDraft({ ...draft, verified: e.target.checked })} />
          Verified: the team confirmed this event and its meaning
        </label>
        {state.error && <p className="ct-error" role="alert">{conflict(state.error)}</p>}
        <Changed entry={entry} />
        <div className="ct-actions">
          <button type="button" className="sw-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="sw-button sw-primary" disabled={state.busy}>{state.busy ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </Dialog>
  );
}

function PropertyDialog({ property, entry, onSave, onClose }) {
  const [draft, setDraft] = useState({ description: entry?.description || "", unit: entry?.unit || "", kind: entry?.kind || "", owner: entry?.owner || "" });
  const [state, setState] = useState({ busy: false, error: null });
  const save = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: null });
    try {
      await onSave({ description: draft.description, unit: draft.unit, kind: draft.kind || null, owner: draft.owner, ...(entry ? { revision: entry.revision } : {}) });
      onClose();
    } catch (error) {
      setState({ busy: false, error });
    }
  };
  return (
    <Dialog title={property.path} subtitle={property.types?.length ? `Seen as ${property.types.join(", ")}` : "Property definition"} onClose={onClose}>
      <form className="sw-detail-body ct-form" onSubmit={save}>
        {property.values?.length > 0 && <p className="ct-sample">Recent values: {property.values.slice(0, 5).map(String).join(", ")}</p>}
        <Field label="Description">
          <textarea rows={3} maxLength={500} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        </Field>
        <div className="ct-row">
          <Field label="Unit" hint="A label such as °C or rpm. Values are never converted.">
            <input maxLength={16} value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} />
          </Field>
          <Field label="Kind">
            <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value })}>
              {PROPERTY_KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Owner">
          <input maxLength={120} value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} />
        </Field>
        {state.error && <p className="ct-error" role="alert">{conflict(state.error)}</p>}
        <Changed entry={entry} />
        <div className="ct-actions">
          <button type="button" className="sw-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="sw-button sw-primary" disabled={state.busy}>{state.busy ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </Dialog>
  );
}

function ActionDialog({ action, eventNames, filters, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState({
    name: action?.name || "",
    description: action?.description || "",
    steps: action?.steps?.map((s) => ({ ...s })) || [{ name: eventNames[0] || "", filterId: null, conditions: [] }],
  });
  const [state, setState] = useState({ busy: false, error: null });
  const step = (index, change) => setDraft({ ...draft, steps: draft.steps.map((s, i) => (i === index ? { ...s, ...change } : s)) });
  // A refused delete stays in the dialog with its reason, like a refused save.
  const remove = async () => {
    setState({ busy: true, error: null });
    try { await onDelete(action); setState({ busy: false, error: null }); } catch (error) { setState({ busy: false, error }); }
  };
  const save = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: null });
    try {
      await onSave({ name: draft.name, description: draft.description, steps: draft.steps.map((s) => ({ name: s.name, filterId: s.filterId || null, conditions: s.conditions || [] })),
        ...(action ? { revision: action.revision } : {}) });
      onClose();
    } catch (error) {
      setState({ busy: false, error });
    }
  };
  return (
    <Dialog title={action ? action.name : "New action"} subtitle="Matches an event that satisfies any step. It triggers nothing." onClose={onClose}>
      <form className="sw-detail-body ct-form" onSubmit={save}>
        <Field label="Name"><input required maxLength={64} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
        <Field label="Description"><input maxLength={500} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
        <fieldset className="ct-steps">
          <legend>Steps (any of)</legend>
          {draft.steps.map((s, index) => (
            <div className="ct-step" key={index}>
              <span className="ct-or">{index === 0 ? "Match" : "or"}</span>
              <input aria-label={`Step ${index + 1} event`} list="ct-event-names" required value={s.name} onChange={(e) => step(index, { name: e.target.value })} />
              <select aria-label={`Step ${index + 1} Saved Filter`} value={s.filterId || ""} onChange={(e) => step(index, { filterId: e.target.value || null })}>
                <option value="">All of these events</option>
                {filters.map((f) => <option key={f.id} value={f.id}>where {f.name}</option>)}
              </select>
              {draft.steps.length > 1 ? (
                <button type="button" className="sw-icon-button" aria-label={`Remove step ${index + 1}`} onClick={() => setDraft({ ...draft, steps: draft.steps.filter((_, i) => i !== index) })}>
                  <FiTrash2 />
                </button>
              ) : <span />}
              {s.conditions?.length > 0 && <small className="ct-step-note">Also requires {s.conditions.length} {s.conditions.length === 1 ? "condition" : "conditions"} set from MCP</small>}
            </div>
          ))}
          <datalist id="ct-event-names">{eventNames.map((n) => <option key={n} value={n} />)}</datalist>
          {draft.steps.length < 5 && (
            <button type="button" className="sw-link" onClick={() => setDraft({ ...draft, steps: [...draft.steps, { name: "", filterId: null, conditions: [] }] })}>
              <FiPlus /> Add a step
            </button>
          )}
        </fieldset>
        {state.error && <p className="ct-error" role="alert">{conflict(state.error)}</p>}
        <Changed entry={action} />
        <div className="ct-actions">
          {action && <button type="button" className="sw-button ct-delete" onClick={remove} disabled={state.busy}>Delete</button>}
          <button type="button" className="sw-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="sw-button sw-primary" disabled={state.busy}>{state.busy ? "Saving…" : action ? "Save" : "Create action"}</button>
        </div>
      </form>
    </Dialog>
  );
}

function PathRules({ client, projectId, saved, canManage, onSave }) {
  const [rules, setRules] = useState(saved.rules.map((r) => ({ ...r })));
  const [preview, setPreview] = useState(null);
  const [state, setState] = useState({ busy: false, error: null, done: false });
  useEffect(() => setRules(saved.rules.map((r) => ({ ...r }))), [saved]);
  const runPreview = async () => {
    setState({ busy: true, error: null, done: false });
    try {
      setPreview(await client.pathPreview(projectId, rules));
      setState({ busy: false, error: null, done: false });
    } catch (error) {
      setState({ busy: false, error, done: false });
    }
  };
  const save = async () => {
    setState({ busy: true, error: null, done: false });
    try {
      await onSave({ rules, ...(saved.revision !== null ? { revision: saved.revision } : {}) });
      setState({ busy: false, error: null, done: true });
    } catch (error) {
      setState({ busy: false, error, done: false });
    }
  };
  const change = (index, key, value) => setRules(rules.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  return (
    <Panel title="Path rules" meta={canManage ? "Owner or Admin" : "Read-only"}>
      <div className="sw-detail-body ct-form">
        <p className="ct-help">
          Group dynamic parts of names for display, for example <code>/robot/[0-9]+/</code> → <code>/robot/:id/</code>. Rules apply in order; stored events keep
          their original names. Regular expressions use RE2: no lookaround or back-references.
        </p>
        {rules.length === 0 && <p className="ct-sample">No rules yet.</p>}
        {rules.map((r, index) => (
          <div className="ct-rule" key={index}>
            <input aria-label={`Rule ${index + 1} pattern`} placeholder="Pattern" readOnly={!canManage} value={r.pattern} onChange={(e) => change(index, "pattern", e.target.value)} />
            <span aria-hidden="true">→</span>
            <input aria-label={`Rule ${index + 1} replacement`} placeholder="Replacement" readOnly={!canManage} value={r.replacement} onChange={(e) => change(index, "replacement", e.target.value)} />
            {canManage && (
              <button type="button" className="sw-icon-button" aria-label={`Remove rule ${index + 1}`} onClick={() => setRules(rules.filter((_, i) => i !== index))}><FiTrash2 /></button>
            )}
          </div>
        ))}
        {canManage && rules.length < 20 && (
          <button type="button" className="sw-link" onClick={() => setRules([...rules, { pattern: "", replacement: "" }])}><FiPlus /> Add a rule</button>
        )}
        {state.error && <p className="ct-error" role="alert">{conflict(state.error)}</p>}
        {state.done && <p className="ct-done" role="status">Path rules saved.</p>}
        {preview && (
          <div className="ct-preview" role="region" aria-label="Path rule preview">
            <p>
              {preview.distinctBefore} observed names become {preview.distinctAfter}.{preview.invalidPatterns.length > 0 && ` Not applied (invalid): ${preview.invalidPatterns.join(", ")}`}
            </p>
            <ul>
              {preview.changed.slice(0, 20).map((c) => (
                <li key={c.name}><code>{c.name}</code> → <code>{c.cleaned}</code></li>
              ))}
            </ul>
          </div>
        )}
        <div className="ct-actions">
          <button type="button" className="sw-button" onClick={runPreview} disabled={state.busy || rules.some((r) => !r.pattern)}>Preview</button>
          {canManage && <button type="button" className="sw-button sw-primary" onClick={save} disabled={state.busy || rules.some((r) => !r.pattern)}>Save rules</button>}
        </div>
      </div>
    </Panel>
  );
}

/** Catalog view: observed events and properties next to what the team says they mean. */
export default function Catalog({ client, project, role, discovery, discoveryError, retryDiscovery, filters, initialTab = "events" }) {
  const [tab, setTab] = useState(initialTab);
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const load = useCallback(async (signal) => {
    try {
      const result = await client.catalog(project.id, signal);
      if (!signal?.aborted) { setCatalog(result); setError(null); }
    } catch (cause) {
      if (!signal?.aborted && cause.name !== "AbortError") setError(cause);
    }
  }, [client, project.id]);
  useEffect(() => {
    const controller = new AbortController();
    setCatalog(null);
    load(controller.signal);
    return () => controller.abort();
  }, [load]);
  // A refused save reloads, so a retry uses the current revision. A saved one also refreshes
  // discovery, which Explorer reads actions and units from.
  const write = async (operation) => {
    try { await operation(); } catch (cause) { await load(); throw cause; }
    await load();
    retryDiscovery?.();
  };
  const canManage = role === "Owner" || role === "Admin";
  const byName = useMemo(() => new Map((catalog?.events || []).map((e) => [e.name, e])), [catalog]);
  const byPath = useMemo(() => new Map((catalog?.properties || []).map((p) => [p.path, p])), [catalog]);
  const eventNames = useMemo(() => [...new Set([...(discovery?.eventNames || []), ...byName.keys()])].sort(), [discovery, byName]);
  const properties = useMemo(() => {
    const observed = new Map((discovery?.properties || []).map((p) => [p.path, p]));
    for (const path of byPath.keys()) if (!observed.has(path)) observed.set(path, { path, types: [], values: [] });
    return [...observed.values()].sort((a, b) => a.path.localeCompare(b.path));
  }, [discovery, byPath]);
  const match = (text) => text.toLowerCase().includes(search.trim().toLowerCase());
  const described = (entry) => entry?.description || entry?.unit || entry?.kind;

  return (
    <>
      <Failure error={error || discoveryError} retry={() => { load(); retryDiscovery?.(); }} />
      <div className="ct-tabs" role="tablist" aria-label="Catalog">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "is-active" : ""} onClick={() => { setTab(id); setSearch(""); }}>{label}</button>
        ))}
      </div>
      {!catalog && !error && <p className="live-pad" role="status">Loading the catalog…</p>}
      {catalog && tab === "events" && (
        <Panel title="Events" meta={`${eventNames.length} · ${catalog.events.length} described`}
          action={<input className="ct-search" aria-label="Search events" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />}>
          {eventNames.length === 0 ? <Empty title="No events yet" description="Events appear here once a device sends one. You can also describe an event before it is captured, from MCP." /> : (
            <div className="sw-table-wrap" tabIndex={0} role="region" aria-label="Event definitions">
              <table className="sw-table ct-table">
                <thead><tr><th>Event</th><th>Description</th><th>Owner</th><th aria-label="Status" /></tr></thead>
                <tbody>
                  {eventNames.filter(match).map((name) => {
                    const entry = byName.get(name);
                    return (
                      <tr key={name}>
                        <td><button className="sw-link sw-mono" onClick={() => setEditing({ kind: "event", name })}>{name}</button></td>
                        <td className={entry?.description ? "" : "ct-missing"}>{entry?.description || "Not described"}</td>
                        <td>{entry?.owner || "—"}</td>
                        <td>{entry?.verified && <span className="ct-badge">Verified</span>}{!discovery?.eventNames?.includes(name) && <span className="ct-badge ct-muted">Not seen</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}
      {catalog && tab === "properties" && (
        <Panel title="Properties" meta={`${properties.length} · ${catalog.properties.length} described`}
          action={<input className="ct-search" aria-label="Search properties" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />}>
          {properties.length === 0 ? <Empty title="No properties yet" description="Properties appear here once events carry them." /> : (
            <div className="sw-table-wrap" tabIndex={0} role="region" aria-label="Property definitions">
              <table className="sw-table ct-table">
                <thead><tr><th>Property</th><th>Seen as</th><th>Unit</th><th>Kind</th><th>Description</th></tr></thead>
                <tbody>
                  {properties.filter((p) => match(p.path)).map((p) => {
                    const entry = byPath.get(p.path);
                    return (
                      <tr key={p.path}>
                        <td><button className="sw-link sw-mono" onClick={() => setEditing({ kind: "property", property: p })}>{p.path}</button></td>
                        <td>{p.types.join(", ") || "—"}</td>
                        <td>{entry?.unit || "—"}</td>
                        <td>{PROPERTY_KINDS.find(([v]) => v === (entry?.kind || ""))?.[1]}</td>
                        <td className={described(entry) ? "" : "ct-missing"}>{entry?.description || "Not described"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}
      {catalog && tab === "actions" && (
        <Panel title="Actions" meta={`${catalog.actions.length} defined`}
          action={<button className="sw-button sw-primary" onClick={() => setEditing({ kind: "action" })}><FiPlus /> New action</button>}>
          {catalog.actions.length === 0 ? (
            <Empty title="Name what you look for" description='An action is a reusable match, such as "Overheat" = motor.sample where temp > 90 or drone.error where code = THERMAL. Pick it in Explorer or use it from MCP.' />
          ) : (
            <div className="sw-table-wrap" tabIndex={0} role="region" aria-label="Actions">
              <table className="sw-table ct-table">
                <thead><tr><th>Action</th><th>Matches any of</th><th>Description</th></tr></thead>
                <tbody>
                  {catalog.actions.map((a) => (
                    <tr key={a.id}>
                      <td><button className="sw-link" onClick={() => setEditing({ kind: "action", action: a })}>{a.name}</button></td>
                      <td>{a.steps.map((s) => s.name + (s.filterId ? ` where ${filters.find((f) => f.id === s.filterId)?.name || "deleted filter"}` : "") + (s.conditions?.length ? ` (+${s.conditions.length})` : "")).join(" or ")}</td>
                      <td>{a.description || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}
      {catalog && tab === "paths" && (
        <PathRules client={client} projectId={project.id} saved={catalog.pathRules} canManage={canManage}
          onSave={(body) => write(() => client.savePathRules(project.id, body))} />
      )}
      {editing?.kind === "event" && (
        <EventDialog name={editing.name} entry={byName.get(editing.name)} onClose={() => setEditing(null)}
          onSave={(body) => write(() => client.saveEventDefinition(project.id, editing.name, body))} />
      )}
      {editing?.kind === "property" && (
        <PropertyDialog property={editing.property} entry={byPath.get(editing.property.path)} onClose={() => setEditing(null)}
          onSave={(body) => write(() => client.savePropertyDefinition(project.id, editing.property.path, body))} />
      )}
      {editing?.kind === "action" && (
        <ActionDialog action={editing.action && ((catalog?.actions || []).find((a) => a.id === editing.action.id) || editing.action)} eventNames={eventNames} filters={filters} onClose={() => setEditing(null)}
          onSave={(body) => write(() => (editing.action ? client.updateAction(project.id, editing.action.id, body) : client.createAction(project.id, body)))}
          onDelete={async (a) => {
            if (!window.confirm(`Delete the action "${a.name}"? Explorer selections and agents using it will stop matching.`)) return;
            await write(() => client.deleteAction(project.id, a.id, a.revision));
            setEditing(null);
          }} />
      )}
    </>
  );
}
