import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "../../StreamWorkspace/WorkspaceUI";

const number = (value) =>
  Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 1 });
// The glance shows whole credits: what is left rounds down, what was spent rounds up.
const whole = (value, round) => round(Number(value || 0)).toLocaleString();

/** Monthly credits left on the plan, never below zero. */
export function monthlyLeft(usage) {
  return Math.max(0, usage.monthly.allowance - usage.monthly.used);
}

// Redeem refusals in plain words; anything else shows the server's message.
const REDEEM_ERRORS = {
  promo_not_found: "We couldn't find that code. Check the spelling and try again.",
  promo_expired: "This code has expired.",
  promo_used_up: "This code has been fully used.",
  promo_already_redeemed: "You've already used this code on your account.",
  invalid_request: "Enter a code of 4 to 32 letters, digits or dashes.",
};

/** Glance view for the account menu: one state line per pot and one action. */
export function CreditsSummary({ usage, onAdd }) {
  const left = monthlyLeft(usage);
  const share = usage.monthly.allowance ? usage.monthly.used / usage.monthly.allowance : 0;
  const added = usage.added.balance;
  return (
    <div className="cr-summary" aria-label="Credits">
      <div className="cr-row">
        <span>Monthly credits</span>
        <b>{whole(left, Math.floor)} left</b>
      </div>
      <div className="cr-meter" role="img" aria-label={`${Math.round(share * 100)}% of monthly credits used`}>
        <i style={{ width: `${Math.min(100, share * 100)}%` }} className={share >= 1 ? "cr-full" : share >= 0.8 ? "cr-near" : ""} />
      </div>
      {added > 0 && (
        <div className="cr-row">
          <span>Added credits</span>
          <b>{whole(added, Math.floor)}</b>
        </div>
      )}
      <div className="cr-row">
        <span>Today</span>
        <b>
          {whole(usage.daily.used, Math.ceil)} / {whole(usage.daily.limit, Math.floor)}
        </b>
      </div>
      <small>Shared by every project of the project owner's account.</small>
      <button type="button" className="sw-button cr-add" onClick={onAdd}>
        Add credits
      </button>
    </div>
  );
}

/** Redeem a promo code for the signed-in account; shows recent grants underneath. */
export function AddCreditsDialog({ client, initialCode = "", onClose, onRedeemed }) {
  const [code, setCode] = useState(initialCode);
  const [state, setState] = useState({ busy: false, error: null, done: null });
  const [ledger, setLedger] = useState(null);
  const input = useRef(null);
  useEffect(() => {
    input.current?.focus();
    const controller = new AbortController();
    client
      .credits(controller.signal)
      .then((result) => !controller.signal.aborted && setLedger(result))
      .catch(() => {});
    return () => controller.abort();
  }, [client, state.done]);

  const submit = async (event) => {
    event.preventDefault();
    setState({ busy: true, error: null, done: null });
    try {
      const result = await client.redeem(code.trim());
      setState({ busy: false, error: null, done: result.grant });
      setCode("");
      onRedeemed?.(result.grant);
    } catch (error) {
      setState({ busy: false, error: REDEEM_ERRORS[error.code] || error.message, done: null });
    }
  };

  return (
    <Dialog title="Add credits" subtitle="Credits from a code are added to your own Plotune account." onClose={onClose}>
      <form className="sw-detail-body cr-form" onSubmit={submit}>
        <label htmlFor="cr-code">Promo code</label>
        <div className="cr-input-row">
          <input
            id="cr-code"
            ref={input}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={32}
            placeholder="Enter your code"
            aria-describedby="cr-code-help"
          />
          <button type="submit" className="sw-button sw-primary" disabled={state.busy || code.trim().length < 4}>
            {state.busy ? "Adding…" : "Redeem"}
          </button>
        </div>
        <p id="cr-code-help" className="cr-help">
          Added credits are used after your monthly credits run out. They don't expire and stay through
          monthly resets.
        </p>
        {state.error && (
          <p className="cr-error" role="alert">
            {state.error}
          </p>
        )}
        {state.done && (
          <p className="cr-done" role="status">
            Added {number(state.done.credits)} credits to your account.
          </p>
        )}
        {ledger && ledger.grants.length > 0 && (
          <div className="cr-ledger">
            <h3>Credits added</h3>
            <ul>
              {ledger.grants.slice(0, 5).map((g) => (
                <li key={g.id}>
                  <span>{new Date(g.createdAt).toLocaleDateString()}</span>
                  <span>{g.source === "promo" ? "Promo code" : g.source === "referral" ? "Referral" : g.source === "purchase" ? "Purchase" : "Adjustment"}</span>
                  <b>{g.credits > 0 ? "+" : ""}{number(g.credits)}</b>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Dialog>
  );
}
