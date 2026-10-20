import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Empty } from "../../StreamWorkspace/WorkspaceUI";
import { streamWorkspaceLogin } from "../../utils/streamWorkspaceNavigation";
import FilterPopover from "../FilterPopover";
import EventRow from "./EventRow";
import CaptureGuide from "./CaptureGuide";
import { FiSearch, FiTerminal } from "react-icons/fi";
import ExportMenu from "../ExportMenu";
import { DASHBOARD_RANGES } from "../dashboardModel";
import { createEventExport } from "../exportModel";
import { collectEvents, wireConditions } from "./client";
import { useExplorer, useRealtime } from "./hooks";

export function Failure({ error, retry }) {
  if (!error) return null;
  return (
    <div className="live-notice" role="alert">
      <strong>
        {error.status === 401
          ? "Your session expired. Sign in again."
          : error.status === 403
            ? "You do not have access to this project or action."
            : error.code === "daily_credit_limit_reached"
              ? "The account reached today's credit limit. It resets at 00:00 UTC."
              : error.code === "credits_exhausted"
                ? "The account is out of credits. Add credits or wait for the monthly reset."
                : error.message}
      </strong>
      {error.status === 401 && (
        <a href={streamWorkspaceLogin(window.location.search)}>Sign in</a>
      )}
      {error.status === 403 && (
        <p>
          If you just created this project or changed access, wait a moment for
          permissions to synchronize and retry.
        </p>
      )}
      {error.status === 409 && (
        <p>Refresh before continuing. Changes were not overwritten.</p>
      )}
      {retry && (
        <button className="sw-link" onClick={retry}>
          Retry / refresh
        </button>
      )}
    </div>
  );
}

export default function LiveExplorer({
  client,
  project,
  discovery,
  discoveryError,
  retryDiscovery,
  filters,
  dashboards,
  activeFilterId,
  onSelectFilter,
  saveFilter,
  renameFilter,
  deleteFilter,
  projectKey,
  onOpenSetup,
}) {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("All events");
  // A catalog action replaces the event name: it matches any of its steps.
  const [actionId, setActionId] = useState("");
  const actions = discovery?.catalog?.actions || [];
  const definitions = useMemo(() => new Map((discovery?.catalog?.properties || []).map((p) => [p.path, p])), [discovery]);
  const [range, setRange] = useState("24h");
  const [deviceId, setDeviceId] = useState("all");
  const [sessionId, setSessionId] = useState("all");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [conditions, setConditions] = useState([]);
  const [temporary, setTemporary] = useState(false);
  const [saveConflict, setSaveConflict] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [fullDetail, setFullDetail] = useState(null);
  const [copied, setCopied] = useState(false);
  const selected = filters.find((f) => f.id === activeFilterId);
  const filterDraft = useRef({ id: activeFilterId, base: selected });
  const conditionSignature = JSON.stringify(wireConditions(conditions));
  useEffect(() => {
    if (filterDraft.current.id !== activeFilterId || !temporary) {
      filterDraft.current = { id: activeFilterId, base: selected };
      setConditions(selected?.conditions || []);
      setTemporary(false);
      setSaveConflict(null);
    } else if (
      selected &&
      selected.revision !== filterDraft.current.base?.revision &&
      conditionSignature === JSON.stringify(wireConditions(selected.conditions))
    ) {
      // An authoritative refresh confirms this exact draft was saved, even if
      // the write response was followed by a failed metadata verification.
      filterDraft.current = { id: activeFilterId, base: selected };
      setConditions(selected.conditions);
      setTemporary(false);
      setSaveConflict(null);
    } else if (
      filterDraft.current.pendingRebase &&
      selected &&
      selected.revision !== filterDraft.current.base?.revision
    ) {
      // Rebase once after a rejected write and a fresh shared definition, without
      // discarding the investigation draft. Background refreshes before a conflict
      // must not silently give a stale draft permission to overwrite another edit.
      filterDraft.current = {
        id: activeFilterId,
        base: selected,
        pendingRebase: false,
      };
    }
  }, [activeFilterId, selected, temporary, saveConflict, conditionSignature]);
  const invalidTime =
    range === "custom" &&
    (!startAt ||
      !endAt ||
      Date.parse(startAt + "Z") >= Date.parse(endAt + "Z"));
  const query = useMemo(
    () => ({
      search,
      ...(actionId ? { actionId } : { name }),
      deviceId,
      sessionId,
      range: range === "custom" ? "all" : range,
      ...(range === "custom" && !invalidTime
        ? {
            startAt: new Date(startAt + "Z").toISOString(),
            endAt: new Date(endAt + "Z").toISOString(),
          }
        : {}),
      ...(activeFilterId && !temporary
        ? { filterId: activeFilterId, conditions: [] }
        : { conditions }),
    }),
    [
      search,
      name,
      actionId,
      deviceId,
      sessionId,
      range,
      startAt,
      endAt,
      invalidTime,
      activeFilterId,
      temporary,
      conditions,
    ],
  );
  const signature = JSON.stringify(query);
  const explorer = useExplorer(
    client,
    invalidTime ? null : project.id,
    query,
    selected?.revision,
  );
  const realtime = useRealtime(
    client,
    project.id,
    `${signature}:${selected?.revision}`,
  );
  const clear = () => {
    setSearch("");
    setName("All events");
    setActionId("");
    setRange("24h");
    setStartAt("");
    setEndAt("");
    setDeviceId("all");
    setSessionId("all");
    setConditions([]);
    setTemporary(false);
    onSelectFilter(null);
  };
  const refresh = () => {
    realtime.clear();
    explorer.refresh();
    retryDiscovery();
  };
  useEffect(() => {
    if (!detail?.id) return undefined;
    const controller = new AbortController();
    setDetailError(null);
    setFullDetail(null);
    setCopied(false);
    client
      .event(project.id, detail.id, controller.signal)
      .then((event) => {
        if (!controller.signal.aborted) setFullDetail(event);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setDetailError(error);
      });
    return () => controller.abort();
  }, [client, project.id, detail?.id]);
  const properties = (discovery?.properties || []).map((p) => ({
    ...p,
    type: p.types.length === 1 ? p.types[0] : "mixed",
  }));
  const exportMatchingEvents = async (format, onProgress, signal) => {
    // Only a completely retrieved snapshot can become a downloadable file.
    const result = await collectEvents(
      client.pages(
        project.id,
        { ...query, now: explorer.page.now || undefined },
        { signal },
      ),
      { signal, onProgress },
    );
    return createEventExport(result.events, format, { signal, onProgress });
  };
  const showSetup = projectKey && !explorer.loading && !explorer.error && !explorer.page.items.length && !search && name === "All events" && !actionId && !activeFilterId && !conditions.length && deviceId === "all" && sessionId === "all" && range === "24h" && !explorer.page.nextCursor && !explorer.index;
  if (showSetup) return <>
    <Failure error={discoveryError} retry={retryDiscovery} />
    <Failure error={realtime.error} retry={refresh} />
    {(realtime.ids.length > 0 || realtime.reset) && <div className="live-notice" role="status">New project events are available.<button className="sw-button" onClick={refresh}>Load latest events</button></div>}
    <section className="st-first-event live-first-event">
                <span className="st-first-icon"><FiTerminal /></span>
                <p className="sw-eyebrow">CONNECT YOUR SYSTEM</p>
                <h2>Send an event from your system</h2>
                <p>Run an example below, then load the new events when they arrive.</p>
                <p className="live-key-reminder"><strong>Save your project key now.</strong> It will not be shown again after a refresh. The example below includes it.</p>
                <CaptureGuide apiKey={projectKey} origin={client.origin} compact />
                <button className="sw-link" onClick={onOpenSetup}>Open API setup and save key</button>
              </section>
    <button className="sw-link live-pad" onClick={refresh}>Check for events</button>
  </>;
  return (
    <>
      <div className="sw-toolbar st-filters live-explorer-toolbar live-toolbar">
        <label className="sw-search">
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            aria-label="Search events and properties"
            placeholder="Search event names and properties…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="live-event-select">
          <span className="live-sr-only">Event</span>
          <input
            list="live-event-names-explorer"
            value={name === "All events" ? "" : name}
            placeholder={actionId ? "Set by the action" : "All events"}
            disabled={!!actionId}
            onChange={(e) => setName(e.target.value || "All events")}
          />
          <datalist id="live-event-names-explorer">
            {(discovery?.eventNames || []).map((event) => (
              <option key={event} value={event} />
            ))}
          </datalist>
        </label>
        {(actions.length > 0 || actionId) && (
          <label className="live-action-select">
            <span className="live-sr-only">Action</span>
            <select value={actionId} onChange={(e) => { setActionId(e.target.value); if (e.target.value) setName("All events"); }}>
              <option value="">No action</option>
              {actions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
        )}
        <label className="live-time-select">
          <span className="live-sr-only">Time range</span>
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            {DASHBOARD_RANGES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
            <option value="all">Retained history</option>
            <option value="custom">Custom range · UTC</option>
          </select>
        </label>
        {range === "custom" && (
          <>
            <label>
              From · UTC
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </label>
            <label>
              Until · UTC
              <input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
              />
            </label>
          </>
        )}
          <label className="live-context-select">
            <span className="live-sr-only">Device ID</span>
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
            >
              <option value="all">All devices</option>
              <option value="unspecified">Not supplied</option>
              {deviceId !== "all" && deviceId !== "unspecified" && !discovery?.deviceIds?.includes(deviceId) && <option value={deviceId}>{deviceId}</option>}
              {(discovery?.deviceIds || []).map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
          <label className="live-context-select">
            <span className="live-sr-only">Session ID</span>
            <select
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            >
              <option value="all">All sessions</option>
              <option value="unspecified">Not supplied</option>
              {sessionId !== "all" && sessionId !== "unspecified" && !discovery?.sessionIds?.includes(sessionId) && <option value={sessionId}>{sessionId}</option>}
              {(discovery?.sessionIds || []).map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
        <button
          className="sw-button"
          onClick={refresh}
          disabled={explorer.loading || invalidTime}
        >
          Refresh
        </button>
        <button className="sw-link" onClick={clear}>
          Clear all
        </button>
      {invalidTime && (
        <p role="alert">
          Choose a start and an end, with the end after the start.
        </p>
      )}
      <div className="live-filter-bar">
        <FilterPopover
          events={[]}
          discoveredProperties={properties}
          filters={filters}
          activeFilterId={activeFilterId}
          conditions={conditions}
          onApply={(next, id) => {
            const saved = filters.find((f) => f.id === id);
            if (
              saved &&
              JSON.stringify(saved.conditions) === JSON.stringify(next)
            )
              filterDraft.current = { id, base: saved };
            onSelectFilter(id);
            setConditions(next);
            setTemporary(
              !saved ||
                JSON.stringify(saved.conditions) !== JSON.stringify(next),
            );
          }}
          onSave={async (filterName, next, id, creationId) => {
            try {
              await saveFilter(
                filterName,
                next,
                id,
                id === activeFilterId ? filterDraft.current.base : undefined,
                creationId,
              );
              // The reload has returned the saved revision. Resume selection by ID
              // and let the draft effect adopt it as the next edit's CAS baseline.
              setTemporary(false);
            } catch (error) {
              if (error.status === 409 && id === activeFilterId) {
                filterDraft.current.pendingRebase = true;
                setSaveConflict({
                  id,
                  revision: filterDraft.current.base?.revision,
                });
              }
              throw error;
            }
          }}
          onRename={renameFilter}
          onDelete={deleteFilter}
          referenceCount={(id) =>
            dashboards
              .flatMap((d) => d.widgets)
              .filter((w) => w.filterId === id).length
          }
        />
        {!invalidTime && (
          <ExportMenu
            key={signature}
            events={[]}
            query={query}
            projectName={project.name}
            createExport={exportMatchingEvents}
          />
        )}
      </div>
      </div>
      {activeFilterId && (
        <p className="st-muted">
          {temporary ? "Temporary changes to " : "Shared Saved Filter: "}
          {selected?.name ||
            "Deleted filter — choose a replacement or clear filters"}
        </p>
      )}
      {saveConflict && (
        <p className="live-notice" role="status">
          Your draft is preserved. Refresh the shared Filter before retrying;
          saving your draft will replace its current conditions.
        </p>
      )}
      <Failure error={discoveryError} retry={retryDiscovery} />
      {discovery?.truncated && (
        <p className="st-muted">
          Property suggestions are sampled. You can always enter another
          property path.
        </p>
      )}
      <Failure error={explorer.error} retry={refresh} />
      <Failure error={realtime.error} />
      {(realtime.ids.length > 0 || realtime.reset) && (
        <div className="live-notice" role="status">
          {realtime.reset
            ? "Event history has advanced. Refresh to start a new snapshot."
            : "New project events are available."}
          <button className="sw-button" onClick={refresh}>
            Load latest events
          </button>
        </div>
      )}
      <div className="sw-panel st-events-panel" aria-busy={explorer.loading}>
        {explorer.loading && (
          <p className="live-pad" role="status">
            Loading events…
          </p>
        )}
        {!explorer.loading &&
          !explorer.error &&
          !explorer.page.items.length && (
            <Empty
              title={explorer.page.nextCursor ? "Continue searching this snapshot" : "No events match this view"}
              description={explorer.page.nextCursor ? "No matches in this section. Continue to search the remaining history." : "Try another event name, clear your filters, or widen the time range."}
              action={!explorer.page.nextCursor && <div className="live-empty-actions"><button className="sw-button" onClick={clear}>Clear filters</button>{onOpenSetup && <button className="sw-link" onClick={onOpenSetup}>Send an event</button>}</div>}
            />
          )}
        {explorer.page.items.length > 0 && (
          <div className="sw-table-wrap">
            <table className="sw-table st-table">
              <thead>
                <tr>
                  <th>Timestamp · UTC</th>
                  <th>Event</th>
                  <th>Properties</th>
                  <th aria-label="Open event" />
                </tr>
              </thead>
              <tbody>
                {explorer.page.items.map((event) => (
                  <EventRow key={event.id} event={event} definitions={definitions} onInspect={() => {
                    setCopied(false);
                    setFullDetail(null);
                    setDetail(event);
                  }} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="live-pagination">
          <button
            className="sw-button"
            disabled={!explorer.index || explorer.loading}
            onClick={explorer.previous}
          >
            Previous
          </button>
          <span>
            Page {explorer.index + 1} · {explorer.page.items.length} {explorer.page.items.length === 1 ? "event" : "events"}
          </span>
          <button
            className="sw-button"
            disabled={!explorer.page.nextCursor || explorer.loading}
            onClick={explorer.next}
          >
            Next
          </button>
        </div>
      </div>
      {detail && (
        <Dialog
          title={detail.event}
          subtitle="Event detail"
          onClose={() => setDetail(null)}
        >
          <div className="sw-detail-body st-event-detail">
            <Failure error={detailError} />
            {fullDetail ? <>
              <div className="st-detail-field"><span>Exact timestamp · UTC</span><code>{fullDetail.timestamp}</code></div>
              <div className="st-detail-field"><span>Event name</span><code>{fullDetail.event}</code></div>
              {[['Device ID', 'device_id', 'deviceId', 'device'], ['Session ID', 'session_id', 'sessionId', 'session']].map(([label, field, queryField, kind]) => (
                <div className="st-detail-field st-context-detail" key={field}>
                  <span>{label}</span>
                  <div><code>{fullDetail[field] || "Unspecified"}</code>
                    {fullDetail[field] && <button className="sw-button" onClick={() => {
                      setSearch("");
                      setName("All events");
                      setActionId("");
                      setConditions([]);
                      setTemporary(false);
                      onSelectFilter(null);
                      setDeviceId(queryField === 'deviceId' ? fullDetail[field] : 'all');
                      setSessionId(queryField === 'sessionId' ? fullDetail[field] : 'all');
                      setDetail(null);
                    }}>View {kind} events</button>}
                  </div>
                </div>
              ))}
              <h3>Complete event JSON</h3>
              <pre className="sw-code" tabIndex={0} aria-label="Complete event JSON">{JSON.stringify(fullDetail, null, 2)}</pre>
            </> : !detailError && <p role="status">Loading complete event JSON…</p>}
            <button
              className="sw-button"
              disabled={!fullDetail}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    JSON.stringify(fullDetail, null, 2),
                  );
                  setCopied(true);
                } catch {
                  setDetailError(
                    new Error(
                      "Copy failed. Select the JSON to copy it manually.",
                    ),
                  );
                }
              }}
            >
              {copied ? "Copied" : "Copy JSON"}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
