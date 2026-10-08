import React, { useMemo, useState } from "react";
import { Dialog, Trend } from "../StreamWorkspace/WorkspaceUI";
import { DASHBOARD_RANGES } from "./dashboardModel";
import { buildWidgetSeries, getWidgetChoices } from "./widgetModel";

const DEFAULT_WIDGET = { title: "", visualization: "line", filterId: "", eventName: "", measureProperty: "", breakdownProperty: "", range: "1h" };

export default function WidgetEditor({ widget, events, savedFilters, now, onSave, onClose }) {
  const [draft, setDraft] = useState(() => ({ ...DEFAULT_WIDGET, ...widget, filterId: widget?.filterId || "" }));
  const choices = useMemo(() => getWidgetChoices(events, draft, savedFilters, now), [events, draft, savedFilters, now]);
  const measureProperty = choices.numericProperties.includes(draft.measureProperty)
    ? draft.measureProperty
    : choices.numericProperties[0] || "";
  const previewWidget = { ...draft, id: draft.id || "preview", measureProperty };
  const preview = buildWidgetSeries(events, previewWidget, savedFilters, now);
  const canSave = !!draft.eventName && (draft.visualization === "count" || !!measureProperty) && choices.status !== "missing-filter";
  const set = (change) => setDraft((current) => ({ ...current, ...change }));

  const submit = (event) => {
    event.preventDefault();
    if (!canSave) return;
    onSave({
      ...draft,
      id: draft.id || `widget-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      title: draft.title.trim() || `${draft.eventName}${draft.visualization === "count" ? " count" : ` · ${measureProperty}`}`,
      filterId: draft.filterId || null,
      measureProperty: draft.visualization === "line" ? measureProperty : "",
      breakdownProperty: draft.breakdownProperty || "",
    });
  };

  return (
    <Dialog
      title={widget ? "Edit widget" : "Add widget"}
      subtitle="Choose what this project dashboard should keep an eye on."
      onClose={onClose}
      className="mvp-widget-editor-dialog"
    >
      <form className="sw-detail-body mvp-widget-editor" onSubmit={submit}>
        <label>Widget title
          <input maxLength={64} placeholder="e.g. Real-system RPM" value={draft.title} onChange={(event) => set({ title: event.target.value })} />
        </label>
        <label>Visualization
          <select value={draft.visualization} onChange={(event) => set({ visualization: event.target.value })}>
            <option value="line">Numeric property · line</option>
            <option value="count">Event count</option>
          </select>
        </label>
        <label>Saved Filter
          <select value={draft.filterId} onChange={(event) => set({ filterId: event.target.value, eventName: "", measureProperty: "", breakdownProperty: "" })}>
            <option value="">No Saved Filter</option>
            {draft.filterId && !savedFilters.some((filter) => filter.id === draft.filterId) && <option value={draft.filterId}>Deleted Saved Filter</option>}
            {savedFilters.map((filter) => <option key={filter.id} value={filter.id}>{filter.name}</option>)}
          </select>
          {choices.status === "missing-filter" && <span className="mvp-widget-warning">The saved filter used by this widget was deleted. Select another filter to restore its data.</span>}
        </label>
        <label>Event
          <select value={draft.eventName} onChange={(event) => set({ eventName: event.target.value, measureProperty: "", breakdownProperty: "" })} required>
            <option value="">Choose an event</option>
            {choices.eventNames.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          {choices.status === "empty" && <span className="mvp-widget-help">No events match this Saved Filter and time range.</span>}
        </label>
        {draft.visualization === "line" && (
          <label>Numeric property
            <select value={measureProperty} onChange={(event) => set({ measureProperty: event.target.value })} required>
              <option value="">Choose a numeric property</option>
              {choices.numericProperties.map((property) => <option key={property} value={property}>{property}</option>)}
            </select>
          </label>
        )}
        <label><span>Breakdown by <em className="mvp-widget-optional">Optional</em></span>
          <select value={draft.breakdownProperty} onChange={(event) => set({ breakdownProperty: event.target.value })}>
            <option value="">No breakdown</option>
            {choices.breakdownProperties.map((property) => <option key={property} value={property}>{property}</option>)}
          </select>
        </label>
        <label>Time range
          <select value={draft.range} onChange={(event) => set({ range: event.target.value })}>
            {DASHBOARD_RANGES.map((range) => <option key={range.id} value={range.id}>{range.label}</option>)}
          </select>
        </label>
        <section className="mvp-widget-preview" aria-label="Widget preview">
          <div><strong>Preview</strong><span>{preview.events.length} matching events</span></div>
          {preview.status === "missing-filter" ? <p className="mvp-widget-warning">Select a Saved Filter to preview this widget.</p>
            : preview.series.some((series) => series.points.some((point) => Number.isFinite(point.value)))
              ? <Trend series={preview.series} label={draft.title || "Widget preview"} />
              : <p>No matching values for this preview.</p>}
          {preview.series.length > 0 && <div className="mvp-widget-preview-legend">{preview.series.map((series) => <span key={series.key}>{series.label}</span>)}</div>}
        </section>
        <div className="sw-dialog-actions">
          <button className="sw-button" type="button" onClick={onClose}>Cancel</button>
          <button className="sw-button sw-primary" type="submit" disabled={!canSave}>{widget ? "Save widget" : "Add widget"}</button>
        </div>
      </form>
    </Dialog>
  );
}
