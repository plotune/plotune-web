import React, { useEffect, useState } from "react";
import DashboardGraph from "../DashboardGraph";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";
import { buildWidgetSeries } from "../widgetModel";
import { collectEvents } from "./client";
import { Failure } from "./LiveExplorer";

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
    widget,
    revision: dashboard.revision,
    filters,
  });
  useEffect(() => {
    let disposed = false,
      timer;
    const controller = new AbortController();
    setState({ loading: true });
    const load = async () => {
      if (document.visibilityState === "hidden") {
        timer = setTimeout(load, 15000);
        return;
      }
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
            loading: false,
            widget: authoritativeWidget,
            result: { ...series, events: [], eventCount: series.events.length },
          });
        }
      } catch (error) {
        if (!disposed && error.name !== "AbortError")
          setState({ loading: false, error });
      }
      if (!disposed) timer = setTimeout(load, 15000);
    };
    load();
    return () => {
      disposed = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [client, projectId, dashboard.id, definition, retry, widget]);
  if (state.error || !state.result)
    return (
      <Panel title={widget.title} meta="Shared project widget">
        <Failure error={state.error} retry={() => setRetry((r) => r + 1)} />
        {state.loading && (
          <p className="live-pad" role="status">
            Loading matching events…
          </p>
        )}
        <button className="sw-link live-pad" onClick={onEdit}>
          Edit widget
        </button>
      </Panel>
    );
  return (
    <div aria-busy={state.loading}>
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
        onEdit={onEdit}
        onRemove={onRemove}
      />
    </div>
  );
}
