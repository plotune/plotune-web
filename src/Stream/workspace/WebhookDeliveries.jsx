import React from "react";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";
import { Failure } from "./LiveExplorer";

export function deliverySummary(delivery) {
  if (delivery.status === "pending" && delivery.reason === "relay_daily_budget") return "Waiting for daily limit reset";
  if (delivery.status === "pending" && delivery.reason === "relay_unavailable") return "Waiting for delivery service";
  return { delivered: "Delivered", pending: delivery.attempts ? "Retry scheduled" : "Queued", failed: "Failed", cancelled: "Cancelled", expired: "Expired" }[delivery.status] || "Status unavailable";
}
export default function WebhookDeliveries({ deliveries, loading, error, onRetry }) {
  return <Panel title="Delivery status" className="live-hook-deliveries">
    <div className="live-hook-report-meta">
      <p>Most recent 100 deliveries. Accepted events may still be waiting for delivery.</p>
      {error && deliveries.length > 0 && <p>Showing the last received reports.</p>}
    </div>
    <Failure error={error} retry={onRetry} />
    {loading && <p className="live-hook-report-meta" role="status">Updating delivery status…</p>}
    {deliveries.length > 0 ? (
      <div className="sw-table-wrap" tabIndex={0} role="region" aria-label="Recent webhook deliveries">
        <table className="sw-table">
          <caption className="live-sr-only">Recent delivery outcomes. Only queued deliveries show a next attempt.</caption>
          <thead><tr><th scope="col">Status</th><th scope="col">Event</th><th scope="col">Attempts</th><th scope="col">Next attempt · UTC</th></tr></thead>
          <tbody>{deliveries.map(delivery => <tr key={delivery.id}>
            <td><strong>{deliverySummary(delivery)}</strong>{delivery.statusCode > 0 && <small>Receiver HTTP {delivery.statusCode}</small>}{delivery.egress === "direct" && <small>Sent directly from server</small>}</td>
            <td className="sw-mono">{delivery.eventId}</td>
            <td>{delivery.attempts}</td>
            <td>{delivery.status === "pending" && delivery.nextAt ? <time dateTime={delivery.nextAt}>{new Date(delivery.nextAt).toLocaleString("en-GB", { timeZone: "UTC" })}</time> : "—"}</td>
          </tr>)}</tbody>
        </table>
      </div>
    ) : !loading && !error && <p className="live-hook-report-meta">No deliveries reported yet.</p>}
  </Panel>;
}
