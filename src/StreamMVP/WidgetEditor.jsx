import React, { useMemo, useState } from "react";
import { Dialog } from "../StreamWorkspace/WorkspaceUI";
import { DASHBOARD_RANGES } from "./dashboardModel";
import { buildWidgetSeries, getWidgetChoices } from "./widgetModel";
import WidgetChart from "./WidgetChart";

const EMPTY = { title: "", eventName: "", visualization: "line", measureProperty: "", filterId: "", breakdownProperty: "", range: "1h" };

export default function WidgetEditor({ widget, events, filters, now, onSave, onClose }) {
  const [draft, setDraft] = useState(() => ({ ...EMPTY, ...widget, filterId: widget?.filterId || "" }));
  const [more, setMore] = useState(!!(widget?.filterId || widget?.breakdownProperty || widget?.title || widget?.range !== "1h"));
  const choices = useMemo(() => getWidgetChoices(events, draft, filters, now), [events, draft, filters, now]);
  const numeric = choices.numericProperties.includes(draft.measureProperty) ? draft.measureProperty : choices.numericProperties[0] || "";
  const previewWidget = { ...draft, id: draft.id || "preview", measureProperty: numeric };
  const preview = buildWidgetSeries(events, previewWidget, filters, now);
  const canSave = !!draft.eventName && (draft.visualization === "count" || !!numeric) && choices.status !== "missing-filter";
  const update = (change) => setDraft((current) => ({ ...current, ...change }));

  const submit = (event) => {
    event.preventDefault();
    if (!canSave) return;
    onSave({ ...draft,
      id: draft.id || `widget-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      title: draft.title.trim() || (draft.visualization === "count" ? `${draft.eventName} count` : `${draft.eventName}.${numeric}`),
      filterId: draft.filterId || null,
      measureProperty: draft.visualization === "count" ? "" : numeric,
      breakdownProperty: draft.breakdownProperty || "",
    });
  };

  return <Dialog title={widget ? "Edit widget" : "Add widget"} subtitle="Choose an event and what to observe." onClose={onClose} className="mvp-widget-editor-dialog">
    <form className="sw-detail-body mvp-widget-editor" onSubmit={submit}>
      <label>Event
        <select required value={draft.eventName} onChange={(event) => update({ eventName: event.target.value, measureProperty: "", breakdownProperty: "" })}>
          <option value="">Choose an event</option>{choices.eventNames.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      {choices.status === "empty" && <p className="mvp-widget-help">No events match the current settings. Choose a different filter or time range.</p>}
      {draft.eventName && <>
        <label>Measure
          <select value={draft.visualization} onChange={(event) => update({ visualization: event.target.value })}>
            <option value="line">Numeric property</option><option value="count">Event count</option>
          </select>
        </label>
        {draft.visualization === "line" && <label>Property
          <select required value={numeric} onChange={(event) => update({ measureProperty: event.target.value })}>
            <option value="">Choose a numeric property</option>{choices.numericProperties.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          {!choices.numericProperties.length && <small>This event has no numeric properties in the selected range.</small>}
        </label>}
        <label>Visualization
          <select value={draft.chartType || "line"} onChange={(event) => update({ chartType: event.target.value })}>
            <option value="line">Line</option><option value="bar">Bar</option>
          </select>
        </label>
      </>}
      <details className="mvp-widget-more" open={more} onToggle={(event) => setMore(event.currentTarget.open)}>
        <summary>More options</summary>
        <div>
          <label>Saved Filter <span>Optional</span>
            <select value={draft.filterId} onChange={(event) => update({ filterId: event.target.value, eventName: "", measureProperty: "", breakdownProperty: "" })}>
              <option value="">No Saved Filter</option>
              {draft.filterId && !filters.some((filter) => filter.id === draft.filterId) && <option value={draft.filterId}>Deleted Saved Filter</option>}
              {filters.map((filter) => <option key={filter.id} value={filter.id}>{filter.name}</option>)}
            </select>
            {choices.status === "missing-filter" && <small className="mvp-widget-warning">This Saved Filter was deleted. Select another filter.</small>}
          </label>
          {draft.eventName && <label>Breakdown by <span>Optional</span>
            <select value={draft.breakdownProperty} onChange={(event) => update({ breakdownProperty: event.target.value })}>
              <option value="">No breakdown</option>{choices.breakdownProperties.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>}
          <label>Time range<select value={draft.range} onChange={(event) => update({ range: event.target.value })}>{DASHBOARD_RANGES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label>Widget title <span>Optional</span><input maxLength={64} value={draft.title} onChange={(event) => update({ title: event.target.value })} placeholder="Use the event and property name" /></label>
        </div>
      </details>
      <section className="mvp-widget-preview" aria-label="Widget preview">
        <div><strong>Preview</strong><span>{preview.events.length} matching events</span></div>
        {preview.series.some((series) => series.points.some((point) => Number.isFinite(point.value)))
          ? <WidgetChart series={preview.series} visualization={draft.chartType || "line"} label={draft.title || draft.eventName || "Widget preview"} />
          : <p>{preview.status === "missing-filter" ? "Choose a replacement Saved Filter." : "No values to preview yet."}</p>}
        {preview.series.length > 0 && <div className="mvp-widget-preview-legend">{preview.series.map((item) => <span key={item.key}>{item.label}</span>)}</div>}
      </section>
      <div className="sw-dialog-actions"><button className="sw-button" type="button" onClick={onClose}>Cancel</button><button className="sw-button sw-primary" type="submit" disabled={!canSave}>{widget ? "Save widget" : "Add widget"}</button></div>
    </form>
  </Dialog>;
}
