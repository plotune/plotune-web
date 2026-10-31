import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  BRIDGE_CODE_CHALLENGE,
  BRIDGE_ONE_TIME_CODE,
  BRIDGE_RETURN_URL,
  BRIDGE_STATE,
} from "../utils/bridgeAuthorize";
import "./BridgeAuthorize.css";

// Plotune Bridge sign-in hand-off. The page never gives Bridge the account token or a cookie:
// it asks the account API for a one-time code bound to the caller's PKCE challenge and returns
// that code to Bridge in the URL fragment (Bridge redeems it with its own verifier).
// The return origin is the constant BRIDGE_RETURN_URL; no request parameter can change it.
// Nothing on this page is logged, stored or sent to analytics (see posthog.js).

const PROMPTS = ["none", "login"];

// Reads the request once. A request whose challenge or state is malformed cannot be answered
// safely (there is nothing valid to echo back), so it gets a plain error page, not a redirect.
// An unknown prompt with a valid challenge and state is answered with invalid_request.
function parseBridgeRequest(searchParams) {
  const single = (name) => {
    const values = searchParams.getAll(name);
    return values.length === 1 ? values[0] : null;
  };
  const codeChallenge = single("code_challenge");
  const state = single("state");
  if (!codeChallenge || !BRIDGE_CODE_CHALLENGE.test(codeChallenge) || !state || !BRIDGE_STATE.test(state)) {
    return { status: "invalid" };
  }
  const promptValues = searchParams.getAll("prompt");
  let prompt = null;
  if (promptValues.length) {
    if (promptValues.length !== 1 || !PROMPTS.includes(promptValues[0])) {
      return { status: "invalid_prompt", codeChallenge, state };
    }
    prompt = promptValues[0];
  }
  return { status: "ok", codeChallenge, state, prompt };
}

// The authorize URL this page is served from, rebuilt from validated values only. It is used
// as the post-login `next`, so it is the same request the browser was sent here with.
const authorizeUrl = ({ codeChallenge, state, prompt }) => {
  const params = new URLSearchParams({ code_challenge: codeChallenge, state });
  if (prompt) params.set("prompt", prompt);
  return `/bridge/authorize?${params.toString()}`;
};

// Only a same-origin, relative login target is ever used for navigation.
const loginUrl = (next) => `/login?next=${encodeURIComponent(next)}`;

export function BridgeAuthorize() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user, isLoading, logout, invalidateSession } = useContext(AuthContext) || {};
  const request = parseBridgeRequest(searchParams);
  const [view, setView] = useState("checking"); // checking | choose | minting | signing-out | returning
  const startedRef = useRef(false);

  // Sends the browser back to Bridge. window.location.replace keeps the authorize page out of
  // the history. The fragment carries either the code or an error, plus the echoed state.
  const finish = (fields) => {
    setView("returning");
    const fragment = new URLSearchParams(fields).toString();
    window.location.replace(`${BRIDGE_RETURN_URL}#${fragment}`);
  };

  const signedOut = () => {
    if (request.prompt === "none") {
      finish({ error: "login_required", state: request.state });
      return;
    }
    navigate(loginUrl(authorizeUrl(request)), { replace: true });
  };

  const mintAndReturn = async () => {
    setView("minting");
    try {
      const response = await api.post(
        "/auth/bridge-code",
        { code_challenge: request.codeChallenge, code_challenge_method: "S256" },
        { headers: { Authorization: token } },
      );
      const code = response?.data?.code;
      if (typeof code !== "string" || !BRIDGE_ONE_TIME_CODE.test(code)) {
        finish({ error: "server_error", state: request.state });
        return;
      }
      finish({ code, state: request.state });
    } catch (error) {
      if (error?.response?.status === 401) {
        // The account token is no longer valid: clear the session, then follow the signed-out rules.
        if (invalidateSession) invalidateSession(token);
        signedOut();
        return;
      }
      finish({ error: "server_error", state: request.state });
    }
  };

  useEffect(() => {
    if (request.status === "invalid_prompt") {
      if (!startedRef.current) {
        startedRef.current = true;
        finish({ error: "invalid_request", state: request.state });
      }
      return;
    }
    if (request.status !== "ok" || isLoading || startedRef.current) return;
    startedRef.current = true;
    if (!token) {
      signedOut();
      return;
    }
    if (request.prompt === "login") {
      setView("choose");
      return;
    }
    mintAndReturn();
    // The decision is made once per visit; token changes caused by invalidation must not re-run it.
  }, [isLoading, token, request.status]);

  const useDifferentAccount = () => {
    setView("signing-out");
    // Sign out through the existing logout; the login page then returns here without prompt=login.
    const next = authorizeUrl({ codeChallenge: request.codeChallenge, state: request.state, prompt: null });
    logout(loginUrl(next));
  };

  if (request.status === "invalid") {
    return (
      <main className="bridge-authorize" aria-labelledby="bridge-authorize-title">
        <div className="bridge-authorize__shell">
          <div className="bridge-authorize__eyebrow technical-label">Bridge / Sign-in</div>
          <h1 id="bridge-authorize-title">This sign-in link is incomplete</h1>
          <div className="bridge-authorize__panel">
            <p role="alert" className="bridge-authorize__error">
              Restart sign-in from Plotune Bridge. If the problem continues, go to your dashboard and try again.
            </p>
            <Link to="/dashboard" className="design-button secondary">Go to dashboard</Link>
          </div>
        </div>
      </main>
    );
  }

  const username = user?.username;

  return (
    <main className="bridge-authorize" aria-labelledby="bridge-authorize-title">
      <div className="bridge-authorize__shell">
        <div className="bridge-authorize__eyebrow technical-label">Bridge / Sign-in</div>
        <h1 id="bridge-authorize-title">Plotune Bridge sign-in</h1>

        <div className="bridge-authorize__panel">
          {view === "checking" && (
            <p className="bridge-authorize__status" role="status">Checking your Plotune session…</p>
          )}

          {view === "minting" && (
            <p className="bridge-authorize__status" role="status">Signing you in to Plotune Bridge…</p>
          )}

          {view === "signing-out" && (
            <p className="bridge-authorize__status" role="status">Signing out of Plotune…</p>
          )}

          {view === "returning" && (
            <p className="bridge-authorize__status" role="status">Returning you to Plotune Bridge…</p>
          )}

          {view === "choose" && (
            <section aria-labelledby="bridge-choose-title">
              <h2 id="bridge-choose-title" className="bridge-authorize__section-title">Continue to Plotune Bridge</h2>
              <p className="bridge-authorize__hint">
                {username
                  ? `You are signed in to Plotune as ${username}. Continue to Plotune Bridge as ${username}.`
                  : "You are signed in to Plotune. Continue to Plotune Bridge with this account."}
              </p>
              <div className="bridge-authorize__actions">
                <button type="button" className="design-button" onClick={mintAndReturn}>
                  Continue
                </button>
                <button type="button" className="design-button secondary" onClick={useDifferentAccount}>
                  Use a different account
                </button>
                <button type="button" className="design-button secondary" onClick={() => finish({ error: "access_denied", state: request.state })}>
                  Cancel
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default BridgeAuthorize;
