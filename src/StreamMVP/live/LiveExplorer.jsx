import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Empty } from "../../StreamWorkspace/WorkspaceUI";
import { streamWorkspaceLogin } from "../../utils/streamWorkspaceNavigation";
import FilterPopover from "../FilterPopover";
import ExportMenu from "../ExportMenu";
import { DASHBOARD_RANGES } from "../dashboardModel";
import { createEventExport } from "../exportModel";
import { collectEvents } from "./client";
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
            : error.status === 429
              ? "Your account's event allowance has been reached."
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
}) {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("All events");
  const [range, setRange] = useState("1h");
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
  useEffect(() => {
    if (filterDraft.current.id !== activeFilterId || !temporary) {
      filterDraft.current = { id: activeFilterId, base: selected };
      setConditions(selected?.conditions || []);
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
  }, [activeFilterId, selected, temporary, saveConflict]);
  const invalidTime =
    range === "custom" &&
    (!startAt ||
      !endAt ||
      Date.parse(startAt + "Z") >= Date.parse(endAt + "Z"));
  const query = useMemo(
    () => ({
      search,
      name,
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
    setRange("1h");
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
  const exportAll = async (format, onProgress, signal) => {
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
  return (
    <>
      <div className="live-toolbar">
        <label>
          Search
          <input
            type="search"
            placeholder="Search recent events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Event
          <input
            list="live-event-names-explorer"
            value={name === "All events" ? "" : name}
            placeholder="All events"
            onChange={(e) => setName(e.target.value || "All events")}
          />
          <datalist id="live-event-names-explorer">
            {(discovery?.eventNames || []).map((event) => (
              <option key={event} value={event} />
            ))}
          </datalist>
        </label>
        <label>
          Time range
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
      </div>
      <details className="live-envelope">
        <summary>
          Envelope IDs <span>Optional</span>
        </summary>
        <div className="live-toolbar">
          <label>
            Device ID
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
            >
              <option value="all">All IDs</option>
              <option value="unspecified">Not supplied</option>
              {(discovery?.deviceIds || []).map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
          <label>
            Session ID
            <select
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            >
              <option value="all">All IDs</option>
              <option value="unspecified">Not supplied</option>
              {(discovery?.sessionIds || []).map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
        </div>
      </details>
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
          onSave={async (filterName, next, id) => {
            try {
              await saveFilter(
                filterName,
                next,
                id,
                id === activeFilterId ? filterDraft.current.base : undefined,
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
            createExport={exportAll}
          />
        )}
      </div>
      {activeFilterId && (
        <p className="mvp-muted">
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
        <p className="mvp-muted">
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
      <div className="sw-panel mvp-events-panel" aria-busy={explorer.loading}>
        {explorer.loading && (
          <p className="live-pad" role="status">
            Loading events…
          </p>
        )}
        {!explorer.loading &&
          !explorer.error &&
          !explorer.page.items.length && (
            <Empty
              title={
                explorer.page.nextCursor
                  ? "Continue searching this snapshot"
                  : "No matching events"
              }
              description={
                explorer.page.nextCursor
                  ? "No matches in this section. Continue to search the remaining history."
                  : "Change your filters or send an event using API setup."
              }
            />
          )}
        {explorer.page.items.length > 0 && (
          <div className="sw-table-wrap">
            <table className="sw-table mvp-table">
              <thead>
                <tr>
                  <th>Time · UTC</th>
                  <th>Event</th>
                  <th>Properties</th>
                </tr>
              </thead>
              <tbody>
                {explorer.page.items.map((event) => (
                  <tr key={event.id}>
                    <td className="sw-mono sw-muted">{event.timestamp}</td>
                    <td>
                      <button
                        className="sw-link sw-mono"
                        onClick={() => {
                          setCopied(false);
                          setFullDetail(null);
                          setDetail(event);
                        }}
                      >
                        {event.event}
                      </button>
                    </td>
                    <td>
                      <button
                        className="sw-link live-properties"
                        onClick={() => {
                          setCopied(false);
                          setFullDetail(null);
                          setDetail(event);
                        }}
                      >
                        {JSON.stringify(event.properties)}
                      </button>
                    </td>
                  </tr>
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
            Page {explorer.index + 1} · {explorer.page.items.length} events
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
      <p className="mvp-muted">
        History follows the project retention policy. Browser exports retrieve
        all matches in a stable snapshot, up to 10,000 events or 32 MB. No
        partial export is downloaded.
      </p>
      {detail && (
        <Dialog
          title={detail.event}
          subtitle="Complete event JSON"
          onClose={() => setDetail(null)}
        >
          <div className="sw-detail-body">
            <Failure error={detailError} />
            {fullDetail ? <pre className="sw-code" tabIndex={0}>
              {JSON.stringify(fullDetail, null, 2)}
            </pre> : !detailError && <p role="status">Loading complete event JSON…</p>}
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
