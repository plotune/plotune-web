import React, { useCallback, useContext, useEffect, useId, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import client from '../workspaces/client';
import { failureMessage } from '../workspaces/errors';
import { MAX_GRANT_PROJECTS, eligibleProjects, normalizeContext, offeredScopes, projectHasServices, safeRedirect } from '../workspaces/consent';
import { serviceName } from '../workspaces/services';
import { Loading } from '../workspaces/ui';
import { consentLogin } from '../utils/workspaceNavigation';
import '../workspaces/workspaces.css';

// Shared MCP consent (contract 8.3 and 12). The signed `request` is opaque: this page only shows
// what the API validated and sends back the person's choice with the CSRF token it was given.
const framed = () => { try { return window.top !== window.self; } catch { return true; } };

export default function Authorize() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { invalidateSession } = useContext(AuthContext) || {};
  const request = params.get('request') || '';
  const [phase, setPhase] = useState(framed() ? 'framed' : 'loading'); // loading | ready | empty | error | returning | framed
  const [failure, setFailure] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [ctx, setCtx] = useState(null);
  const [form, setForm] = useState({ workspaceId: '', services: [], projectIds: [], readOnly: true, writes: [] });
  const [pending, setPending] = useState('');
  const [submitError, setSubmitError] = useState('');

  const toLogin = useCallback((dropSession) => {
    if (dropSession) invalidateSession?.();
    navigate(consentLogin(request), { replace: true });
  }, [navigate, request, invalidateSession]);

  const load = useCallback(async (signal) => {
    setPhase('loading'); setFailure(null);
    try {
      const body = normalizeContext(await client.getConsentContext(request, { signal }));
      if (!body) throw Object.assign(new Error('invalid'), { status: 502, code: 'invalid_response' });
      if (body.expiresAt && Date.parse(body.expiresAt) <= Date.now()) {
        setErrorText('This request has expired. Go back to the app and start the connection again.');
        setFailure(null); setPhase('error');
        return;
      }
      const services = [body.resource.service];
      const first = body.workspaces.find((workspace) => eligibleProjects(workspace, services).length) || body.workspaces[0];
      const only = first ? eligibleProjects(first, services) : [];
      setCtx(body);
      setForm({ workspaceId: first?.id || '', services, projectIds: only.length === 1 ? [only[0].id] : [], readOnly: true, writes: [] });
      setPhase(body.workspaces.some((workspace) => workspace.projects.length) ? 'ready' : 'empty');
    } catch (error) {
      if (error?.code === 'ERR_CANCELED') return;
      if (error?.status === 401) { toLogin(true); return; }
      setFailure(error); setErrorText(''); setPhase('error');
    }
  }, [request, toLogin]);

  useEffect(() => {
    if (phase === 'framed') return undefined;
    if (!request) {
      setErrorText('This link is incomplete. Go back to the app and start the connection again.');
      setPhase('error');
      return undefined;
    }
    if (!Cookies.get('auth_token')) { toLogin(false); return undefined; }
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();

  }, [request]);

  const workspace = ctx?.workspaces.find((candidate) => candidate.id === form.workspaceId);
  const role = workspace?.role;
  const viewer = role === 'Viewer';
  const readOnly = viewer || form.readOnly;
  const eligible = useMemo(() => eligibleProjects(workspace, form.services), [workspace, form.services]);
  const chosenProjects = eligible.filter((project) => form.projectIds.includes(project.id));
  const offeredByService = (ctx?.services || []).filter((entry) => form.services.includes(entry.service)).map((entry) => ({ entry, ...offeredScopes(entry, role) }));
  const writeScopes = offeredByService.flatMap((item) => item.write.map((scope) => scope.scope));
  const chosenWrites = readOnly ? [] : form.writes.filter((scope) => writeScopes.includes(scope));
  const canApprove = Boolean(workspace) && chosenProjects.length > 0 && form.services.length > 0 && form.services.includes(ctx?.resource.service) && !pending;

  const update = (patch) => setForm((current) => ({ ...current, ...patch }));
  const pickWorkspace = (id) => {
    const next = ctx.workspaces.find((candidate) => candidate.id === id);
    const only = eligibleProjects(next, form.services);
    update({ workspaceId: id, projectIds: only.length === 1 ? [only[0].id] : [], writes: [] });
  };
  const toggleService = (service, on) => {
    const services = on ? [...form.services, service] : form.services.filter((id) => id !== service);
    const stillEligible = form.projectIds.filter((id) => workspace.projects.find((project) => project.id === id && projectHasServices(project, services)));
    update({ services, projectIds: stillEligible });
  };
  const toggleProject = (id, on) => update({ projectIds: on ? [...form.projectIds, id] : form.projectIds.filter((current) => current !== id) });
  const toggleWrite = (scope, on) => update({ writes: on ? [...form.writes, scope] : form.writes.filter((current) => current !== scope) });

  const decide = async (decision) => {
    if (decision === 'approve' && !canApprove) return;
    setPending(decision); setSubmitError('');
    const body = decision === 'approve'
      ? {
        request,
        decision,
        workspaceId: workspace.id,
        projectIds: chosenProjects.map((project) => project.id),
        services: form.services,
        readOnly,
        scopes: [...offeredByService.flatMap((item) => item.read.map((scope) => scope.scope)), ...chosenWrites],
      }
      : { request, decision };
    try {
      const result = await client.submitConsent(ctx.csrf, body);
      const target = safeRedirect(result?.redirectTo);
      if (!target) throw Object.assign(new Error('redirect'), { status: 502, code: 'invalid_response' });
      setPhase('returning');
      window.location.assign(target);
    } catch (error) {
      setPending('');
      if (error?.status === 401) { toLogin(true); return; }
      if (error?.status === 403 && error.code === 'csrf') {
        // The security check belongs to one session and one request; fetch a new one and keep the choices.
        try {
          const fresh = normalizeContext(await client.getConsentContext(request));
          if (fresh) setCtx((current) => ({ ...current, csrf: fresh.csrf }));
          setSubmitError('That took too long. We refreshed the page; check your choices and try again.');
        } catch (refreshFailure) {
          setSubmitError(failureMessage(refreshFailure));
        }
        return;
      }
      if (error?.status === 400 || error?.status === 404 || error?.status === 410) {
        setErrorText('This request is no longer valid. Go back to the app and start the connection again.');
        setPhase('error'); setFailure(null);
        return;
      }
      setSubmitError(failureMessage(error, { fallback: 'We could not finish that. Try again.' }));
    }
  };

  return (
    <main className="ws-page consent" aria-labelledby="consent-title">
      <Helmet>
        <title>Approve access · Plotune</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="ws-shell ws-shell--narrow">
        <header className="consent__head">
          <h1 id="consent-title">Approve access request</h1>
          <p className="ws-muted ws-lead">Choose what this app can reach in your Plotune workspace.</p>
        </header>
        <div className="consent__panel">
          {phase === 'loading' && <Loading label="Checking the request…" />}
          {phase === 'framed' && (
            <div className="ws-state" data-state="framed">
              <h2>This page cannot be shown here</h2>
              <p role="alert">For your security, approvals only work in their own browser window. Open Plotune directly and start the connection again.</p>
            </div>
          )}
          {phase === 'error' && (
            <div className="ws-state" data-state="error">
              <h2>We could not open this request</h2>
              <p role="alert">{errorText || failureMessage(failure, { fallback: 'This request could not be verified. Go back to the app and start again.' })}</p>
              <div className="ws-state__actions">
                {!errorText && failure && [0, 429, 502, 503, 504].includes(failure.status) && <button type="button" className="design-button" onClick={() => load()}>Try again</button>}
                <Link to="/dashboard" className="design-button secondary">Go to dashboard</Link>
              </div>
            </div>
          )}
          {phase === 'empty' && (
            <div className="ws-state" data-state="empty">
              <h2>Nothing to share yet</h2>
              <p role="status">{ctx?.client.name} wants access, but none of your workspaces has a project with a service turned on. Create a project and turn on {serviceName(ctx?.resource.service)}, then start the connection again from the app.</p>
              <div className="ws-state__actions"><Link to="/workspaces" className="design-button">Open workspaces</Link></div>
            </div>
          )}
          {phase === 'returning' && <p className="ws-status" role="status">Returning you to {ctx?.client.name}…</p>}

          {phase === 'ready' && ctx && workspace && (
            <form onSubmit={(event) => { event.preventDefault(); decide('approve'); }} noValidate>
              <section className="consent__app" aria-labelledby="consent-app">
                <h2 id="consent-app" className="ws-eyebrow">App</h2>
                <p className="consent__name">{ctx.client.name}</p>
                <p className="ws-muted">
                  wants to use <strong>{serviceName(ctx.resource.service)}</strong>
                  {ctx.client.redirectHost && <> and will send you back to <strong>{ctx.client.redirectHost}</strong> afterwards</>}.
                </p>
              </section>

              <WorkspaceChoice workspaces={ctx.workspaces} value={workspace.id} disabled={Boolean(pending)} onChange={pickWorkspace} />

              {ctx.services.length > 1 && (
                <fieldset className="ws-fieldset" disabled={Boolean(pending)}>
                  <legend>Products</legend>
                  {ctx.services.map((entry) => {
                    const required = entry.service === ctx.resource.service;
                    return (
                      <label key={entry.service} className="ws-check">
                        <input type="checkbox" checked={form.services.includes(entry.service)} disabled={required} onChange={(event) => toggleService(entry.service, event.target.checked)} />
                        <span><strong>{serviceName(entry.service)}</strong><span>{required ? 'Needed for this request.' : 'Optional. Share this product too.'}</span></span>
                      </label>
                    );
                  })}
                </fieldset>
              )}

              <fieldset className="ws-fieldset" disabled={Boolean(pending)}>
                <legend>Projects to share</legend>
                {workspace.projects.length === 0 && <p className="ws-hint">This workspace has no projects with a service turned on.</p>}
                {workspace.projects.map((project) => {
                  const has = projectHasServices(project, form.services);
                  const checked = has && form.projectIds.includes(project.id);
                  const full = !checked && chosenProjects.length >= MAX_GRANT_PROJECTS;
                  const missing = form.services.filter((service) => !project.services.includes(service)).map(serviceName);
                  return (
                    <label key={project.id} className="ws-check">
                      <input type="checkbox" checked={checked} disabled={!has || full} onChange={(event) => toggleProject(project.id, event.target.checked)} />
                      <span>
                        <strong>{project.name}</strong>
                        <span>{has ? project.services.map(serviceName).join(', ') : `${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} not turned on here.`}</span>
                      </span>
                    </label>
                  );
                })}
                {eligible.length > 0 && <p className="ws-hint">Only the projects you tick are shared. You can share up to {MAX_GRANT_PROJECTS}.</p>}
              </fieldset>

              <fieldset className="ws-fieldset" disabled={Boolean(pending)}>
                <legend>What it can do</legend>
                <label className="ws-check ws-check--switch">
                  <input type="checkbox" role="switch" checked={readOnly} disabled={viewer} onChange={(event) => update({ readOnly: event.target.checked })} aria-describedby="consent-readonly-hint" />
                  <span><strong>Read-only</strong><span id="consent-readonly-hint">{viewer ? 'You are a viewer in this workspace, so access is always read-only.' : 'The app can look at things but not change anything.'}</span></span>
                </label>
                {offeredByService.map(({ entry, read, write }) => (
                  <div key={entry.service} className="consent__scopes">
                    <h3>{serviceName(entry.service)}</h3>
                    <ul className="consent__list">
                      {read.map((scope) => <li key={scope.scope}><span aria-hidden="true" className="consent__tick">✓</span>{scope.description}<span className="sr-only"> (read)</span></li>)}
                    </ul>
                    {write.length > 0 && (
                      <>
                        <p className="ws-hint">{readOnly ? 'Turn off Read-only to let it make changes.' : 'It can only make the changes you tick.'}</p>
                        {write.map((scope) => (
                          <label key={scope.scope} className="ws-check ws-check--warn">
                            <input type="checkbox" checked={chosenWrites.includes(scope.scope)} disabled={readOnly} onChange={(event) => toggleWrite(scope.scope, event.target.checked)} />
                            <span><strong>{scope.description}</strong><span>Changes data</span></span>
                          </label>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </fieldset>

              <Summary client={ctx.client.name} workspace={workspace} projects={chosenProjects} services={form.services} readOnly={readOnly} writes={chosenWrites} />

              {submitError && <p className="ws-error" role="alert">{submitError}</p>}
              <div className="consent__actions">
                <button type="submit" className="design-button" disabled={!canApprove} aria-busy={pending === 'approve'}>{pending === 'approve' ? 'Approving…' : 'Approve and continue'}</button>
                <button type="button" className="design-button secondary" disabled={Boolean(pending)} aria-busy={pending === 'deny'} onClick={() => decide('deny')}>{pending === 'deny' ? 'Denying…' : 'Deny'}</button>
              </div>
              {!canApprove && !pending && <p className="ws-hint" id="consent-need">Pick a workspace, at least one project and at least one product to approve.</p>}
              <p className="ws-hint">This connection lasts up to 90 days. You can disconnect it any time under Connected apps in the workspace.</p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function WorkspaceChoice({ workspaces, value, disabled, onChange }) {
  const id = useId();
  if (workspaces.length === 1) {
    return (
      <div className="ws-field">
        <span className="ws-label">Workspace</span>
        <p className="consent__single"><strong>{workspaces[0].name}</strong> <span className="ws-muted">({workspaces[0].role})</span></p>
      </div>
    );
  }
  return (
    <div className="ws-field">
      <label htmlFor={id}>Workspace</label>
      <select id={id} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
        {workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name} ({workspace.role})</option>)}
      </select>
    </div>
  );
}

// The sentence the person agrees to: the workspace, every project, every product and whether it is read-only.
function Summary({ client: name, workspace, projects, services, readOnly, writes }) {
  return (
    <section className="consent__summary" aria-labelledby="consent-summary">
      <h2 id="consent-summary" className="ws-eyebrow">You are approving</h2>
      <dl>
        <div><dt>App</dt><dd>{name}</dd></div>
        <div><dt>Workspace</dt><dd>{workspace.name}</dd></div>
        <div><dt>Projects</dt><dd>{projects.length ? projects.map((project) => project.name).join(', ') : 'None selected yet'}</dd></div>
        <div><dt>Products</dt><dd>{services.map(serviceName).join(', ')}</dd></div>
        <div><dt>Access</dt><dd>{readOnly ? 'Read-only. It cannot change anything.' : writes.length ? 'Can read and make the changes you ticked.' : 'Can read. It cannot make changes.'}</dd></div>
      </dl>
    </section>
  );
}
