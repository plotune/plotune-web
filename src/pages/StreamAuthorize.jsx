import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { streamWorkspaceReturn } from "../utils/streamWorkspaceNavigation";
import "./StreamAuthorize.css";

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
  "usage:read": "See the event usage and allowance this project counts against",
};
const describeScope = (scope) => SCOPE_DESCRIPTIONS[scope] || scope;

// The auth_token cookie stores the credential including its "Bearer " prefix
// (see services/api.js and Stream/workspace/client.js); normalize before use.
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

  return (
    <main className="stream-authorize" aria-labelledby="stream-authorize-title">
      <div className="stream-authorize__shell">
        <div className="stream-authorize__eyebrow technical-label">Stream / Authorization</div>
        <header className="stream-authorize__header">
          <span className="stream-authorize__icon">
            {status === "returning" ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </span>
          <div>
            <h1 id="stream-authorize-title">Approve access request</h1>
            <p>An application is asking for read-only access to one of your Stream projects.</p>
          </div>
        </header>

        <div className="stream-authorize__panel">
          {status === "loading" && (
            <p className="stream-authorize__status" role="status">
              Checking the authorization request…
            </p>
          )}

          {status === "error" && (
            <div className="stream-authorize__state">
              <div className="stream-authorize__error" role="alert" aria-live="assertive">{error}</div>
              <div className="stream-authorize__actions">
                {recoverable && (
                  <button type="button" onClick={() => window.location.reload()} className="design-button">
                    Try again
                  </button>
                )}
                <Link to="/stream/workspace" className="design-button secondary">Go to Stream</Link>
              </div>
            </div>
          )}

          {status === "empty" && (
            <div className="stream-authorize__state">
              <p className="stream-authorize__status" role="status">
                Your account has no Stream projects yet. Create one in the Stream workspace, then restart sign-in from your MCP client.
              </p>
              <Link to="/stream/workspace" className="design-button">Open Stream</Link>
            </div>
          )}

          {status === "consent" && context && (
            <>
              <section className="stream-authorize__application" aria-labelledby="stream-application-title">
                <div className="stream-authorize__application-heading">
                  <div>
                    <h2 id="stream-application-title" className="technical-label">Application</h2>
                    <p className="stream-authorize__application-name">{context.request.name || context.request.clientId}</p>
                  </div>
                  <span className="stream-authorize__badge">Read-only access</span>
                </div>
                <p className="stream-authorize__destination">
                  Authorization results will be sent to <strong>{redirectHost(context.request.redirect)}</strong>
                </p>
                <details className="stream-authorize__details">
                  <summary>Where exactly is this sent?</summary>
                  <div>
                    <p>{context.request.redirect}</p>
                    <p>Application ID: {context.request.clientId}</p>
                  </div>
                </details>
              </section>

              <div className="stream-authorize__review">
                <section aria-labelledby="stream-permissions-title">
                  <h2 id="stream-permissions-title" className="stream-authorize__section-title">Requested access</h2>
                  <ul className="stream-authorize__permissions">
                    {context.request.scope.map((scope) => (
                      <li key={scope}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        <span>{describeScope(scope)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="stream-authorize__hint">Read-only. Role changes or removal in Stream apply to this access immediately.</p>
                </section>

                <section className="stream-authorize__project" aria-labelledby="stream-project-title">
                  <h2 id="stream-project-title" className="stream-authorize__section-title">
                    <label htmlFor="project">Project to share</label>
                  </h2>
                  <select
                    id="project"
                    value={projectId}
                    onChange={(event) => setProjectId(event.target.value)}
                    disabled={Boolean(pending)}
                    aria-describedby="stream-project-hint"
                  >
                    {context.projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name} ({project.role})</option>
                    ))}
                  </select>
                  <p id="stream-project-hint" className="stream-authorize__hint">
                    Only this one project is shared. Applications that need another project must ask separately.
                  </p>
                </section>
              </div>

              <div className="stream-authorize__decision">
                <div className="stream-authorize__actions">
                  <button
                    type="button"
                    onClick={() => decide("approve")}
                    disabled={Boolean(pending)}
                    aria-busy={pending === "approve"}
                    className="design-button"
                  >
                    {pending === "approve" ? "Approving…" : "Approve and continue"}
                  </button>
                  <button
                    type="button"
                    onClick={() => decide("deny")}
                    disabled={Boolean(pending)}
                    aria-busy={pending === "deny"}
                    className="design-button secondary"
                  >
                    {pending === "deny" ? "Denying…" : "Deny request"}
                  </button>
                </div>
                <p className="stream-authorize__hint">
                  You can revoke this access at any time by removing the application's authorization in Stream or letting it expire.
                </p>
              </div>
            </>
          )}

          {status === "returning" && (
            <p className="stream-authorize__status" role="status">Returning you to the application…</p>
          )}
        </div>
      </div>
    </main>
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

