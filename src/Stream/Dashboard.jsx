import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { Dialog, Panel } from "../StreamWorkspace/WorkspaceUI";
import DashboardGraph from "./DashboardGraph";
import WidgetEditor from "./WidgetEditor";
import { dashboardTiles, moveTile, tileId, withoutTile, withTile } from "./insightModel";
import { TileChooser, NoteEditor, InsightPicker } from "./workspace/AddTile";
import { TextTile } from "./workspace/DashboardTiles";

function stamp(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Dashboard({
  projectId, events, now, dashboards, filters, selectedDashboardId,
  onOpen, onBack, onCreate, onRename, onDelete, onSaveWidget, onRemoveWidget, renderGraph, discovery, loadPreview, onRefresh,
  // C05 tiles (workspace only): saved insights, notes and reordering.
  insights = [], onSaveTiles, onCreateInsight, renderInsight,
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [baseDashboard, setBaseDashboard] = useState(null);
  const [widgetConflict, setWidgetConflict] = useState(false);
  const action = async (operation) => { setError(""); try { await operation(); } catch (cause) { setError(cause.message); } };
  const [createOpen, setCreateOpen] = useState(false);
  const creationId = useRef(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingWidget, setEditingWidget] = useState(null);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [adding, setAdding] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const tilesEnabled = Boolean(onSaveTiles);
  const dashboard = dashboards.find((item) => item.id === selectedDashboardId);
  useEffect(() => {
    if (widgetConflict && dashboard && baseDashboard && dashboard.id === baseDashboard.id && dashboard.revision !== baseDashboard.revision) {
      setBaseDashboard(dashboard); setWidgetConflict(false);
    }
  }, [widgetConflict, dashboard, baseDashboard]);
  const ordered = useMemo(() => [...dashboards].sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0)), [dashboards]);

  const create = async (event) => {
    event.preventDefault();
    creationId.current ||= `${projectId}-dashboard-${Date.now()}`;
    const newDashboard = {
      id: creationId.current,
      name: name.trim(), description: description.trim(), widgets: [], updatedAt: new Date().toISOString(),
    };
    setBusy(true); setError("");
    try { await onCreate(newDashboard); } catch (cause) { setError(cause.message); setBusy(false); return; }
    setBusy(false);
    creationId.current = null;
    setName(""); setDescription(""); setCreateOpen(false); onOpen(newDashboard.id);
  };
  const editWidget = (widget = null) => { setEditingWidget(widget); setBaseDashboard(dashboard); setWidgetConflict(false); setWidgetOpen(true); };
  const saveWidget = async (widget) => {
    try { await onSaveWidget(baseDashboard.id, widget, baseDashboard); setWidgetOpen(false); }
    catch (cause) { if (cause.status === 409) setWidgetConflict(true); throw cause; }
  };

  if (!dashboard) {
    return <section className="st-dashboard-collection" aria-label="Project dashboards">
      {error && <p role="alert">{error}</p>}
      <div className="st-dashboard-collection-head">
        <span>{dashboards.length} project dashboard{dashboards.length === 1 ? "" : "s"}</span>
        <button className="sw-button sw-primary" type="button" onClick={() => setCreateOpen(true)}><FiPlus /> New dashboard</button>
      </div>
      {dashboards.length ? <div className="st-dashboard-list">
        {ordered.map((item) => <Panel key={item.id} title={item.name} meta={tilesEnabled ? `${dashboardTiles(item).length} tile${dashboardTiles(item).length === 1 ? "" : "s"} · Updated ${stamp(item.updatedAt)}` : `${item.widgets?.length || 0} widgets · Updated ${stamp(item.updatedAt)}`} className="st-dashboard-list-item" action={(
          <details className="st-dashboard-menu"><summary aria-label={`Options for ${item.name}`}><FiMoreHorizontal /></summary><div>
            <button type="button" onClick={() => onOpen(item.id)}>Open dashboard</button>
            <button type="button" onClick={() => { const next = window.prompt("Rename dashboard", item.name); if (next?.trim()) action(() => onRename(item.id, next.trim(), item.description)); }}>Rename</button>
            <button type="button" className="danger" onClick={() => { if (window.confirm(`Delete “${item.name}” and its ${tilesEnabled ? "tiles" : "widgets"}? Saved insights stay.`)) action(() => onDelete(item.id)); }}>Delete</button>
          </div></details>
        )}>
          <button className="st-dashboard-open" type="button" onClick={() => onOpen(item.id)}>
            {item.description && <span>{item.description}</span>}<strong>Open dashboard <span aria-hidden="true">→</span></strong>
          </button>
        </Panel>)}
      </div> : <div className="st-dashboard-empty st-dashboard-collection-empty"><h2>No dashboards yet</h2><p>Create a project dashboard to keep useful event views together.</p></div>}
      {createOpen && <Dialog title="New dashboard" subtitle="Create a shared dashboard for this project." onClose={() => { creationId.current = null; setCreateOpen(false); }}>
        <form className="sw-detail-body st-dashboard-create" onSubmit={create}>
          {error && <p role="alert">{error}</p>}
          <label>Name<input autoFocus required maxLength={64} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Robot validation" /></label>
          <label>Description <span>Optional</span><textarea maxLength={180} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What should this dashboard help you observe?" /></label>
          <div className="sw-dialog-actions"><button className="sw-button" type="button" onClick={() => { creationId.current = null; setCreateOpen(false); }}>Cancel</button><button className="sw-button sw-primary" type="submit" disabled={!name.trim() || busy}>Create dashboard</button></div>
        </form>
      </Dialog>}
    </section>;
  }

  const tiles = tilesEnabled ? dashboardTiles(dashboard) : (dashboard.widgets || []).map((w) => ({ id: w.id, type: "widget" }));
  const saveTiles = (next) => action(() => onSaveTiles(dashboard.id, next, dashboard));
  const movesFor = (index) => tilesEnabled ? {
    ...(index > 0 ? { up: () => saveTiles({ ...dashboard, tiles: moveTile(tiles, tiles[index].id, -1) }) } : {}),
    ...(index < tiles.length - 1 ? { down: () => saveTiles({ ...dashboard, tiles: moveTile(tiles, tiles[index].id, 1) }) } : {}),
  } : undefined;
  const removeTile = (tile, label) => { if (window.confirm(`Remove “${label}” from this dashboard?`)) saveTiles(withoutTile(dashboard, tile.id)); };
  const addTile = async (tile) => { await onSaveTiles(dashboard.id, withTile(dashboard, tile), dashboard); setAdding(null); };
  const choose = (kind) => { setAdding(kind === "chart" ? null : kind); if (kind === "chart") editWidget(); };

  return <section className="st-dashboard-detail" aria-label={dashboard.name}>
    {error && <p role="alert">{error}</p>}
    <div className="st-dashboard-detail-head">
      <button className="sw-link" type="button" onClick={onBack}><FiArrowLeft /> Dashboards</button>
      <div className="st-dashboard-detail-actions"><button className="sw-button" type="button" onClick={() => { const next = window.prompt("Rename dashboard", dashboard.name); if (next?.trim()) action(() => onRename(dashboard.id, next.trim(), dashboard.description)); }}>Edit dashboard</button>{tilesEnabled
        ? <button className="sw-button sw-primary" type="button" onClick={() => setAdding("choose")}><FiPlus /> Add tile</button>
        : <button className="sw-button sw-primary" type="button" onClick={() => editWidget()}><FiPlus /> Add widget</button>}</div>
    </div>
    {dashboard.description && <p className="st-dashboard-description">{dashboard.description}</p>}
    {tiles.length ? <div className="st-dashboard-grid">
      {tiles.map((tile, index) => {
        const moves = movesFor(index);
        if (tile.type === "text") return <TextTile key={tile.id} tile={tile} moves={moves} onEdit={() => setEditingNote(tile)} onRemove={() => removeTile(tile, "this note")} />;
        if (tile.type === "insight") {
          const insight = insights.find((i) => i.id === tile.insightId);
          return <React.Fragment key={tile.id}>{renderInsight(tile, insight, moves, () => removeTile(tile, tile.title || insight?.name || "this insight"))}</React.Fragment>;
        }
        const widget = dashboard.widgets.find((w) => w.id === tile.id);
        if (!widget) return null;
        const edit = (current) => editWidget(current?.id ? current : widget);
        const remove = () => { if (window.confirm(`Remove “${widget.title || widget.eventName}” from this dashboard?`)) action(() => onRemoveWidget(dashboard.id, widget.id)); };
        return <React.Fragment key={tile.id}>{renderGraph ? renderGraph(widget, edit, remove, moves) : <DashboardGraph widget={widget} events={events} filters={filters} now={now} onEdit={edit} onRemove={remove} moves={moves} />}</React.Fragment>;
      })}
    </div> : <div className="st-dashboard-empty"><h2>Your dashboard is empty.</h2><p>{tilesEnabled ? "Add a chart, an insight or a note." : "Add a chart to monitor selected engineering events."}</p></div>}
    {widgetOpen && <WidgetEditor widget={editingWidget} discovery={discovery} loadPreview={loadPreview} onReload={onRefresh} events={events} filters={filters} now={now} onSave={saveWidget} onClose={() => setWidgetOpen(false)} />}
    {adding === "choose" && <TileChooser onChoose={choose} onClose={() => setAdding(null)} />}
    {adding === "note" && <NoteEditor onSave={(text) => addTile({ id: tileId(), type: "text", text })} onClose={() => setAdding(null)} />}
    {adding === "insight" && <InsightPicker insights={insights} discovery={discovery} onClose={() => setAdding(null)}
      onPick={(insightId) => addTile({ id: tileId(), type: "insight", insightId, title: "" })}
      onCreate={async (body) => { const made = await onCreateInsight(body); await addTile({ id: tileId(), type: "insight", insightId: made.id, title: "" }); }} />}
    {editingNote && <NoteEditor text={editingNote.text} onClose={() => setEditingNote(null)}
      onSave={async (text) => { await onSaveTiles(dashboard.id, { ...dashboard, tiles: tiles.map((t) => (t.id === editingNote.id ? { ...t, text } : t)) }, dashboard); setEditingNote(null); }} />}
  </section>;
}
