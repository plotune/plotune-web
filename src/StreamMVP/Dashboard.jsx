import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import DashboardGraph from "./DashboardGraph";
import WidgetEditor from "./WidgetEditor";

export default function Dashboard({ projectName, events, now, widgets, savedFilters, onSaveWidget, onRemoveWidget }) {
  const [editingWidget, setEditingWidget] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const openEditor = (widget = null) => { setEditingWidget(widget); setEditorOpen(true); };
  const save = (widget) => { onSaveWidget(widget); setEditorOpen(false); };

  return (
    <div className="mvp-dashboard">
      <div className="mvp-dashboard-toolbar">
        <p>{widgets.length ? "Project widgets use shared Saved Filters and refresh as matching events arrive." : "Create a widget to keep an event or numeric property in view."}</p>
        <button className="sw-button sw-primary" type="button" onClick={() => openEditor()}><FiPlus /> Add widget</button>
      </div>
      {widgets.length ? (
        <div className="mvp-dashboard-grid">
          {widgets.map((widget) => (
            <DashboardGraph
              key={widget.id}
              widget={widget}
              events={events}
              savedFilters={savedFilters}
              now={now}
              onEdit={openEditor}
              onRemove={() => onRemoveWidget(widget.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mvp-dashboard-empty">
          <span className="mvp-first-icon"><FiPlus /></span>
          <h2>No widgets yet</h2>
          <p>Add a numeric-property chart or event-count widget. Assign a shared Saved Filter to make it reflect a project-specific view.</p>
          <button className="sw-button sw-primary" type="button" onClick={() => openEditor()}><FiPlus /> Add widget</button>
        </div>
      )}
      {editorOpen && (
        <WidgetEditor
          key={editingWidget?.id || "new-widget"}
          widget={editingWidget}
          events={events}
          savedFilters={savedFilters}
          now={now}
          onSave={save}
          onClose={() => setEditorOpen(false)}
        />
      )}
      <span className="mvp-dashboard-project-scope">Saved to this browser preview for {projectName}; server sync is not connected.</span>
    </div>
  );
}
