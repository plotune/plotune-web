import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiHelpCircle } from "react-icons/fi";
import { Badge, Dialog, Empty, Panel } from "../../StreamWorkspace/WorkspaceUI";
import { Failure } from "./LiveExplorer";

const PAGE = 50;
const ACTIVE_MINUTES = 60;
const SEVERITY = { critical: "Critical", warning: "Warning", info: "Info" };
const ISSUE_TITLE = {
  control_stale: "Project settings out of date",
  quota_daily: "Daily credit limit",
  quota_monthly: "Monthly credits",
  buffer_pressure: "Capture buffer filling up",
  history_lagging: "Long-term history delayed",
  catalog_truncated: "Discovery list full",
  no_events: "No events yet",
  device_silent: "Quiet device",
  webhook_failing: "Webhook deliveries failing",
};
const CHECK_ICON = { pass: FiCheckCircle, warn: FiAlertTriangle, fail: FiXCircle, unknown: FiHelpCircle };
const CHECK_LABEL = {
  project_settings: "Project settings",
  allowance: "Credits",
  buffer: "Capture buffer",
  recent_capture: "Recent events",
  device: "This device",
  history: "Long-term history",
};
const VERDICT = {
  healthy: ["Healthy", "good", "Events from this path should arrive."],
  degraded: ["Needs attention", "warn", "Events may be delayed or partly refused."],
  blocked: ["Blocked", "bad", "Events are being refused or not arriving."],
  unknown: ["Not enough data", "neutral", "Some checks have no observation yet."],
};
// Evidence keys shown in issue details, in plain words.
const EVIDENCE = {
  lastSeenAt: "Last event",
  silentAfterMinutes: "Quiet after (minutes)",
  used: "Credits used",
  limit: "Daily limit",
  allowance: "Monthly credits",
  addedBalance: "Added credits left",
  resetsAt: "Resets",
  bufferedBytes: "Waiting to be stored (bytes)",
  capacityBytes: "Buffer size (bytes)",
  oldestBufferedAt: "Oldest waiting event",
  flushAgeMinutes: "Normally stored within (minutes)",
  failed: "Failed deliveries",
  retrying: "Retrying deliveries",
  lastSyncAt: "Last settings sync",
};

export function relative(iso, now = Date.now()) {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 48 * 60) return `${Math.round(minutes / 60)} h ago`;
  return `${Math.round(minutes / 1440)} days ago`;
}
const absolute = (iso) => new Date(iso).toLocaleString();
const isTime = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value);
const ISO_IN_TEXT = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/g;
/** Sentences from the server carry exact UTC times; people read local time and age. */
export const readable = (text) => text.replace(ISO_IN_TEXT, (iso) => `${absolute(iso)} (${relative(iso)})`);

/** Active, quiet or inactive from the last-seen stamp; day-only stamps say only the day. */
export function deviceState(device, now = Date.now()) {
  if (device.precision !== "minute" || !device.lastSeenAt) return { label: `Seen ${device.lastSeenDay}`, tone: "neutral" };
  const minutes = (now - Date.parse(device.lastSeenAt)) / 60000;
  if (minutes <= ACTIVE_MINUTES) return { label: "Active", tone: "good" };
  if (minutes <= 7 * 24 * 60) return { label: "Quiet", tone: "warn" };
  return { label: "Inactive", tone: "neutral" };
}

export default function DevicesHealth({ client, project }) {
  const [health, setHealth] = useState(null);
  const [devices, setDevices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [error, setError] = useState(null);
  const [issue, setIssue] = useState(null);
  const [check, setCheck] = useState(null);
  // Only the dialog that is open now may receive a response: closing or opening
  // another detail aborts the earlier request, and late answers are dropped.
  const detailRequest = useRef(null);
  const startDetail = () => {
    detailRequest.current?.abort();
    detailRequest.current = new AbortController();
    return detailRequest.current;
  };
  const current = (request) => detailRequest.current === request && !request.signal.aborted;
  const closeDetail = () => {
    detailRequest.current?.abort();
    detailRequest.current = null;
    setIssue(null);
    setCheck(null);
  };
  useEffect(() => () => detailRequest.current?.abort(), []);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const [h, d] = await Promise.all([
        client.health(project.id, {}, signal),
        client.devices(project.id, { limit: PAGE }, signal),
      ]);
      setHealth(h);
      setDevices(d);
    } catch (cause) {
      if (!signal?.aborted) setError(cause);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [client, project.id]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const loadMore = async () => {
    setMore(true);
    try {
      const page = await client.devices(project.id, { limit: PAGE, after: devices.nextAfter });
      setDevices({ ...page, items: [...devices.items, ...page.items] });
    } catch (cause) {
      setError(cause);
    } finally {
      setMore(false);
    }
  };
  const openIssue = async (summary) => {
    const request = startDetail();
    setCheck(null);
    setIssue({ summary, detail: null, error: null });
    try {
      const detail = await client.health(project.id, { issueId: summary.id }, request.signal);
      if (current(request)) setIssue({ summary, detail: detail.issue, error: null });
    } catch (cause) {
      if (current(request)) setIssue({ summary, detail: null, error: cause });
    }
  };
  const openCheck = async (deviceId) => {
    const request = startDetail();
    setIssue(null);
    setCheck({ deviceId, result: null, error: null });
    try {
      const result = await client.diagnose(project.id, deviceId, request.signal);
      if (current(request)) setCheck({ deviceId, result, error: null });
    } catch (cause) {
      if (current(request)) setCheck({ deviceId, result: null, error: cause });
    }
  };

  if (loading && !health) return <p role="status">Checking devices and health…</p>;
  const issues = health?.issues || [];
  return (
    <>
      <Failure error={error} retry={() => load()} />
      {health && (
        <Panel
          title="Health"
          meta={`Checked ${relative(health.asOf)}`}
          action={<button className="sw-link" disabled={loading} onClick={() => load()}>{loading ? "Checking…" : "Check again"}</button>}
        >
          {issues.length === 0 ? (
            <div className="dh-clear">
              <Badge tone="good">No active issues</Badge>
              <p>Events are being accepted and stored normally.</p>
            </div>
          ) : (
            <ul className="dh-issues">
              {issues.map((i) => (
                <li key={i.id}>
                  <Badge tone={{ critical: "bad", warning: "warn", info: "neutral" }[i.severity]}>{SEVERITY[i.severity]}</Badge>
                  <span className="dh-issue-text">{i.summary}</span>
                  <button className="sw-button" onClick={() => openIssue(i)}>Details</button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}
      {devices && (
        <Panel title="Devices" meta={devices.total === 1 ? "1 device" : `${devices.total} devices`}>
          {devices.items.length === 0 ? (
            <Empty
              title="No devices yet"
              description="Devices appear here after they send an event with a device_id."
            />
          ) : (
            <div className="dh-table-wrap">
              <table className="dh-devices">
                <thead>
                  <tr><th scope="col">Device</th><th scope="col">Last event</th><th scope="col">Status</th><th scope="col"><span className="sw-sr-only">Action</span></th></tr>
                </thead>
                <tbody>
                  {devices.items.map((d) => {
                    const state = deviceState(d);
                    return (
                      <tr key={d.deviceId}>
                        <th scope="row"><code>{d.deviceId}</code></th>
                        <td>{d.lastSeenAt ? <time dateTime={d.lastSeenAt} title={absolute(d.lastSeenAt)}>{relative(d.lastSeenAt)}</time> : d.lastSeenDay}</td>
                        <td><Badge tone={state.tone}>{state.label}</Badge></td>
                        <td><button className="sw-button" aria-label={`Check device ${d.deviceId}`} onClick={() => openCheck(d.deviceId)}>Check</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {devices.nextAfter && (
            <button className="sw-button dh-more" disabled={more} onClick={loadMore}>{more ? "Loading…" : "Show more devices"}</button>
          )}
          {devices.truncated && <p className="dh-note">The device list reached its size limit; some devices may not be listed.</p>}
          <p className="dh-note">Events sent with a wrong or replaced project key are refused before they reach the project, so those devices are not listed.</p>
        </Panel>
      )}
      {issue && (
        <Dialog title={ISSUE_TITLE[issue.summary.kind] || SEVERITY[issue.summary.severity]} subtitle={issue.summary.summary} onClose={closeDetail}>
          <Failure error={issue.error?.status === 404 ? null : issue.error} />
          {!issue.detail && !issue.error && <p role="status">Loading details…</p>}
          {issue.detail && (
            <div className="sw-detail-body dh-detail">
              {issue.detail.evidence && (
                <dl>
                  {Object.entries(issue.detail.evidence).filter(([k]) => EVIDENCE[k]).map(([k, v]) => (
                    <React.Fragment key={k}><dt>{EVIDENCE[k]}</dt><dd>{isTime(v) ? `${absolute(v)} (${relative(v)})` : String(v)}</dd></React.Fragment>
                  ))}
                </dl>
              )}
              <h3>What to do</h3>
              <ul>{issue.detail.nextSteps.map((step) => <li key={step}>{step}</li>)}</ul>
            </div>
          )}
          {issue.error?.status === 404 && <p>This issue has cleared since the list was loaded.</p>}
        </Dialog>
      )}
      {check && (
        <Dialog title={`Device ${check.deviceId}`} subtitle="Capture path check" onClose={closeDetail}>
          <Failure error={check.error} />
          {!check.result && !check.error && <p role="status">Checking…</p>}
          {check.result && (() => {
            const [label, tone, meaning] = VERDICT[check.result.verdict];
            return (
              <div className="sw-detail-body dh-detail">
                <p className="dh-verdict"><Badge tone={tone}>{label}</Badge> {meaning}</p>
                <ul className="dh-checks">
                  {check.result.checks.map((c) => {
                    const Icon = CHECK_ICON[c.status];
                    return (
                      <li key={c.id} className={`dh-check-${c.status}`}>
                        <Icon aria-hidden="true" />
                        <div><strong>{CHECK_LABEL[c.id] || c.id}</strong><span>{readable(c.summary)}</span></div>
                      </li>
                    );
                  })}
                </ul>
                {check.result.nextSteps.length > 0 && (<><h3>What to do</h3><ul>{check.result.nextSteps.map((s) => <li key={s}>{s}</li>)}</ul></>)}
              </div>
            );
          })()}
        </Dialog>
      )}
    </>
  );
}
