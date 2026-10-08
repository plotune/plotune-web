import React, { useMemo, useState } from "react";
import { FiArrowLeft, FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { Dialog, Panel } from "../StreamWorkspace/WorkspaceUI";
import DashboardGraph from "./DashboardGraph";
import WidgetEditor from "./WidgetEditor";

function stamp(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Dashboard({
  projectId, events, now, dashboards, filters, selectedDashboardId,
  onOpen, onBack, onCreate, onRename, onDelete, onSaveWidget, onRemoveWidget,
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingWidget, setEditingWidget] = useState(null);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const dashboard = dashboards.find((item) => item.id === selectedDashboardId);
  const ordered = useMemo(() => [...dashboards].sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0)), [dashboards]);

  const create = (event) => {
    event.preventDefault();
    const newDashboard = {
      id: `${projectId}-dashboard-${Date.now()}`,
      name: name.trim(), description: description.trim(), widgets: [], updatedAt: new Date().toISOString(),
    };
    onCreate(newDashboard);
    setName(""); setDescription(""); setCreateOpen(false); onOpen(newDashboard.id);
  };
  const editWidget = (widget = null) => { setEditingWidget(widget); setWidgetOpen(true); };
  const saveWidget = (widget) => { onSaveWidget(dashboard.id, widget); setWidgetOpen(false); };

  if (!dashboard) {
    return <section className="mvp-dashboard-collection" aria-label="Project dashboards">
      <div className="mvp-dashboard-collection-head">
        <span>{dashboards.length} project dashboard{dashboards.length === 1 ? "" : "s"}</span>
        <button className="sw-button sw-primary" type="button" onClick={() => setCreateOpen(true)}><FiPlus /> New dashboard</button>
      </div>
      {dashboards.length ? <div className="mvp-dashboard-list">
        {ordered.map((item) => <Panel key={item.id} title={item.name} meta={`${item.widgets?.length || 0} widgets · Updated ${stamp(item.updatedAt)}`} className="mvp-dashboard-list-item" action={(
          <details className="mvp-dashboard-menu"><summary aria-label={`Options for ${item.name}`}><FiMoreHorizontal /></summary><div>
            <button type="button" onClick={() => onOpen(item.id)}>Open dashboard</button>
            <button type="button" onClick={() => { const next = window.prompt("Rename dashboard", item.name); if (next?.trim()) onRename(item.id, next.trim(), item.description); }}>Rename</button>
            <button type="button" className="danger" onClick={() => { if (window.confirm(`Delete “${item.name}” and its widgets?`)) onDelete(item.id); }}>Delete</button>
          </div></details>
        )}>
          <button className="mvp-dashboard-open" type="button" onClick={() => onOpen(item.id)}>
            {item.description && <span>{item.description}</span>}<strong>Open dashboard <span aria-hidden="true">→</span></strong>
          </button>
        </Panel>)}
      </div> : <div className="mvp-dashboard-empty mvp-dashboard-collection-empty"><h2>No dashboards yet</h2><p>Create a project dashboard to keep useful event views together.</p></div>}
      {createOpen && <Dialog title="New dashboard" subtitle="Create a shared dashboard for this project." onClose={() => setCreateOpen(false)}>
        <form className="sw-detail-body mvp-dashboard-create" onSubmit={create}>
          <label>Name<input autoFocus required maxLength={64} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Robot validation" /></label>
          <label>Description <span>Optional</span><textarea maxLength={180} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What should this dashboard help you observe?" /></label>
          <div className="sw-dialog-actions"><button className="sw-button" type="button" onClick={() => setCreateOpen(false)}>Cancel</button><button className="sw-button sw-primary" type="submit" disabled={!name.trim()}>Create dashboard</button></div>
        </form>
      </Dialog>}
    </section>;
  }

  return <section className="mvp-dashboard-detail" aria-label={dashboard.name}>
    <div className="mvp-dashboard-detail-head">
      <button className="sw-link" type="button" onClick={onBack}><FiArrowLeft /> Dashboards</button>
      <div className="mvp-dashboard-detail-actions"><button className="sw-button" type="button" onClick={() => { const next = window.prompt("Rename dashboard", dashboard.name); if (next?.trim()) onRename(dashboard.id, next.trim(), dashboard.description); }}>Edit dashboard</button><button className="sw-button sw-primary" type="button" onClick={() => editWidget()}><FiPlus /> Add widget</button></div>
    </div>
    {dashboard.description && <p className="mvp-dashboard-description">{dashboard.description}</p>}
    {dashboard.widgets?.length ? <div className="mvp-dashboard-grid">
      {dashboard.widgets.map((widget) => <DashboardGraph key={widget.id} widget={widget} events={events} filters={filters} now={now}
        onEdit={() => editWidget(widget)} onRemove={() => { if (window.confirm(`Remove “${widget.title || widget.eventName}” from this dashboard?`)) onRemoveWidget(dashboard.id, widget.id); }} />)}
    </div> : <div className="mvp-dashboard-empty"><h2>Your dashboard is empty.</h2><p>Add a chart to monitor selected engineering events.</p></div>}
    {widgetOpen && <WidgetEditor widget={editingWidget} events={events} filters={filters} now={now} onSave={saveWidget} onClose={() => setWidgetOpen(false)} />}
  </section>;
}
