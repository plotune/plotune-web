import React, { useEffect, useState } from "react";
import DashboardGraph from "../DashboardGraph";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";
import { buildWidgetSeries } from "../widgetModel";
import { collectEvents } from "./client";
import { Failure } from "./LiveExplorer";
import { pollWhileVisible } from "./visiblePolling";

export default function RemoteGraph({
  client,
  projectId,
  dashboard,
  widget,
  filters,
  onEdit,
  onRemove,
}) {
  const [state, setState] = useState({ loading: true });
  const [retry, setRetry] = useState(0);
  const definition = JSON.stringify({
    projectId,
    dashboardId: dashboard.id,
    widget,
    revision: dashboard.revision,
    filters,
  });
  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    setState((old) => old.definition === definition
      ? { ...old, loading: true, error: null }
      : { loading: true, definition });
    const load = async () => {
      setState((old) => ({ ...old, loading: true, error: null }));
      try {
        const result = await collectEvents(
          client.pages(
            projectId,
            {},
            {
              signal: controller.signal,
              widget: { dashboardId: dashboard.id, id: widget.id },
            },
          ),
          { signal: controller.signal },
        );
        if (!disposed) {
          const authoritativeWidget = result.widget;
          const series = buildWidgetSeries(
            result.events,
            { ...authoritativeWidget, filterId: null },
            [],
            result.now,
          );
          setState({
            definition,
            loading: false,
            widget: authoritativeWidget,
            result: { ...series, events: [], eventCount: series.events.length },
          });
        }
      } catch (error) {
        if (!disposed && error.name !== "AbortError")
          setState((old) => ({ ...old, loading: false, error, ...(error.widget ? { widget: error.widget, result: null } : {}) }));
      }
    };
    const stop = pollWhileVisible(load, 60000);
    return () => {
      disposed = true;
      controller.abort();
      stop();
    };
  }, [client, projectId, dashboard.id, definition, retry, widget]);
  if (!state.result)
    return (
      <Panel title={(state.widget || widget).title} meta="Shared project widget">
        <Failure error={state.error} retry={() => setRetry((r) => r + 1)} />
        {state.loading && (
          <p className="live-pad" role="status">
            Loading matching events…
          </p>
        )}
        <button className="sw-link live-pad" onClick={() => onEdit(state.widget || widget)}>
          Edit widget
        </button>
      </Panel>
    );
  return (
    <div aria-busy={state.loading}>
      {state.error && <><Failure error={state.error} retry={() => setRetry((r) => r + 1)} /><p className="mvp-muted">Showing the last successfully loaded chart.</p></>}
      {state.loading && (
        <span className="mvp-muted" role="status">
          Refreshing chart…
        </span>
      )}
      <DashboardGraph
        widget={state.widget}
        events={[]}
        filters={filters}
        now={Date.now()}
        data={state.result}
        onEdit={() => onEdit(state.widget)}
        onRemove={onRemove}
      />
    </div>
  );
}
