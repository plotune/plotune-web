import React, { useEffect, useState } from "react";
import { Failure } from "./LiveExplorer";

// Event usage covers every project the owner's account owns, so only the
// project Owner may read it; other roles get one plain line instead of a
// request that would be refused and a refresh control that does nothing.
export default function AccountUsage({ client, projectId, role }) {
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const owner = role === "Owner";
  useEffect(() => {
    setUsage(null); setError(null);
    if (!projectId || !owner) return undefined;
    const controller = new AbortController();
    client.usage(projectId, controller.signal).then((result) => {
      if (!controller.signal.aborted) setUsage(result);
    }).catch((failure) => { if (!controller.signal.aborted) setError(failure); });
    return () => controller.abort();
  }, [client, projectId, owner, refresh]);
  if (!projectId || !role) return null;
  if (!owner) return <p>Event usage is visible to the project owner.</p>;
  return (
    <>
      {!usage && !error && <p role="status">Loading usage…</p>}
      {usage && (
        <p>
          {usage.accepted.toLocaleString()} /{" "}
          {usage.allowance.toLocaleString()} events this month
          <br />
          {usage.acceptedToday.toLocaleString()} /{" "}
          {usage.dailyAllowance.toLocaleString()} today
          <br />
          <small>Your account allowance across your projects</small>
        </p>
      )}
      <Failure error={error} retry={() => setRefresh((value) => value + 1)} />
      <button className="sw-link" onClick={() => setRefresh((value) => value + 1)}>Refresh usage</button>
    </>
  );
}
