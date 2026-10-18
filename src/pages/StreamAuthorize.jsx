import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { streamWorkspaceReturn } from "../utils/streamWorkspaceNavigation";

// Stream MCP OAuth consent (works with workers/stream /oauth/*).
// The page never sees or stores credentials: the signed request blob is opaque,
// and the Worker builds both the approval and denial redirects.
const STREAM_ORIGIN =
  process.env.REACT_APP_STREAM_API_ORIGIN || "https://stream.plotune.net";

// Plain-language permissions (Jakob's/Miller's laws: familiar wording, few chunks).
const SCOPE_DESCRIPTIONS = {
  "events:read": "Read this project's event history, discovery catalog and Saved Filters",
  "dashboards:read": "Read this project's shared Dashboards and their widgets",
  "context:read": "Read this project's context, health observations and operator documentation",
  "aggregate:run": "Summarize this project's event history (counts, totals, averages); results are visible only to you",
};
const describeScope = (scope) => SCOPE_DESCRIPTIONS[scope] || scope;

// The auth_token cookie stores the credential including its "Bearer " prefix
// (see services/api.js and StreamMVP/live/client.js); normalize before use.
const authorizationHeader = () => {
  const token = Cookies.get("auth_token");
  return token ? `Bearer ${String(token).replace(/^Bearer\s+/i, "")}` : "";
};
const loginTarget = (request) => {
  const next = streamWorkspaceReturn(`/stream/authorize?request=${encodeURIComponent(request)}`);
  return `/login?next=${encodeURIComponent(next || "/stream/authorize")}`;
};

export function StreamAuthorize() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const request = searchParams.get("request") || "";
  const [status, setStatus] = useState("loading"); // loading | consent | empty | error | returning
  const [error, setError] = useState("");
  const [recoverable, setRecoverable] = useState(false);
  const [context, setContext] = useState(null);
  const [projectId, setProjectId] = useState("");
  const [pending, setPending] = useState(""); // approve | deny

  useEffect(() => {
    if (!request) {
      setError("This authorization link is incomplete. Restart sign-in from your MCP client.");
      setStatus("error");
      return undefined;
    }
    if (!authorizationHeader()) {
      navigate(loginTarget(request), { replace: true });
      return undefined;
    }
    let cancelled = false;
    setStatus("loading");
    (async () => {
      try {
        const response = await fetch(
          `${STREAM_ORIGIN}/oauth/authorize/context?request=${encodeURIComponent(request)}`,
          { headers: { Authorization: authorizationHeader() } },
        );
        if (cancelled) return;
        if (response.status === 401) {
          navigate(loginTarget(request), { replace: true });
          return;
        }
        const body = await response.json();
        if (!response.ok) {
          setError(body?.error?.message || "This authorization request could not be verified.");
          setRecoverable(false);
          setStatus("error");
          return;
        }
        setContext(body);
        setProjectId(body.projects?.[0]?.id || "");
        if (body.projects?.length) {
          setStatus("consent");
        } else {
          setStatus("empty");
        }
      } catch {
        if (!cancelled) {
          setError("Stream could not be reached. Try again in a moment.");
          setRecoverable(true);
          setStatus("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [request, navigate]);

  const decide = async (decision) => {
    if (!context || (decision === "approve" && !projectId)) return;
    setPending(decision);
    try {
      const response = await fetch(`${STREAM_ORIGIN}/oauth/authorize/consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authorizationHeader() },
        body: JSON.stringify({ request, decision, ...(decision === "approve" ? { projectId } : {}) }),
      });
      const body = await response.json();
      if (!response.ok || !body.redirectTo) {
        setError(body?.error?.message || "The authorization could not be completed.");
        setRecoverable(true);
        setStatus("error");
        setPending("");
        return;
      }
      // Peak-end rule: a clearly named, calm handoff closes the flow.
      setStatus("returning");
      window.location.assign(body.redirectTo);
    } catch {
      setError("Stream could not be reached. Try again in a moment.");
      setRecoverable(true);
      setStatus("error");
      setPending("");
    }
  };

  const buttonBase =
    "flex-1 min-h-[44px] rounded-sm px-5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-card disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="min-h-screen bg-dark-surface flex items-center justify-center py-8 px-4">
      <div className="bg-dark-card rounded-sm p-8 border border-ink/15 w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10">
            {status === "returning" ? (
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-white">Approve access request</h1>
          <p className="mt-2 text-sm text-ink/70">
            An application is asking for read-only access to one of your Stream projects.
          </p>
        </div>

        {status === "loading" && (
          <p className="text-center text-sm text-ink/60" aria-live="polite">
            Checking the authorization request…
          </p>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="rounded-sm border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert" aria-live="assertive">
              {error}
            </div>
            <div className="flex flex-wrap gap-3">
              {recoverable && (
                <button type="button" onClick={() => window.location.reload()} className={`${buttonBase} bg-primary text-white hover:opacity-90`}>
                  Try again
                </button>
              )}
              <Link to="/stream/workspace" className={`${buttonBase} text-center border border-ink/30 text-ink/80 hover:bg-ink/5`}>
                Go to Stream
              </Link>
            </div>
          </div>
        )}

        {status === "empty" && (
          <div className="space-y-4">
            <div className="rounded-sm border border-ink/15 bg-dark-surface p-4 text-sm text-ink/80" aria-live="polite">
              Your account has no Stream projects yet. Create one in the Stream workspace, then restart sign-in from your MCP client.
            </div>
            <Link to="/stream/workspace" className={`${buttonBase} text-center bg-primary text-white hover:opacity-90`}>
              Open Stream
            </Link>
          </div>
        )}

        {status === "consent" && context && (
          <div className="space-y-6">
            {/* Common region: everything identifying the requester lives in one bordered block. */}
            <div className="rounded-sm border border-ink/15 bg-dark-surface p-4">
              <p className="text-xs uppercase tracking-wider text-ink/50">Application</p>
              <p className="mt-1 text-lg font-medium text-white break-all">{context.request.name || context.request.clientId}</p>
              <p className="mt-2 text-xs text-ink/60 break-all">
                Authorization results will be sent to{" "}
                <span className="text-ink/80">{redirectHost(context.request.redirect)}</span>
              </p>
              {/* Progressive disclosure: transparency without clutter. */}
              <details className="mt-3 group">
                <summary className="cursor-pointer list-none text-xs text-ink/50 underline underline-offset-2 hover:text-ink/70">
                  Where exactly is this sent?
                </summary>
                <p className="mt-2 break-all text-xs text-ink/60">{context.request.redirect}</p>
                <p className="mt-1 break-all text-xs text-ink/60">Application ID: {context.request.clientId}</p>
              </details>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-ink/50 mb-2">Requested access</p>
              <ul className="space-y-2">
                {context.request.scope.map((scope) => (
                  <li key={scope} className="flex items-start gap-2 text-sm text-ink/80">
                    <svg className="w-4 h-4 mt-0.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    {describeScope(scope)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink/50">Read-only. Role changes or removal in Stream apply to this access immediately.</p>
            </div>

            <div>
              <label htmlFor="project" className="text-xs uppercase tracking-wider text-ink/50">
                Project to share
              </label>
              <select
                id="project"
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                className="mt-2 w-full min-h-[44px] rounded-sm border border-ink/15 bg-dark-surface px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {context.projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.role})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-ink/50">Only this one project is shared. Applications that need another project must ask separately.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => decide("approve")}
                disabled={Boolean(pending)}
                aria-busy={pending === "approve"}
                className={`${buttonBase} bg-primary text-white hover:opacity-90`}
              >
                {pending === "approve" ? "Approving…" : "Approve and continue"}
              </button>
              <button
                type="button"
                onClick={() => decide("deny")}
                disabled={Boolean(pending)}
                aria-busy={pending === "deny"}
                className={`${buttonBase} border border-ink/30 text-ink/80 hover:bg-ink/5`}
              >
                {pending === "deny" ? "Denying…" : "Deny request"}
              </button>
            </div>

            <p className="text-xs text-ink/50">
              You can revoke this access at any time by removing the application's authorization in Stream or letting it expire.
            </p>
          </div>
        )}

        {status === "returning" && (
          <p className="text-center text-sm text-ink/60" aria-live="polite">
            Returning you to the application…
          </p>
        )}
      </div>
    </div>
  );
}

function redirectHost(redirectUri) {
  try {
    return new URL(redirectUri).host;
  } catch {
    return redirectUri;
  }
}

export default StreamAuthorize;
