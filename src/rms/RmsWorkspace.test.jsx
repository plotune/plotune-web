import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import RmsPage, { rmsProblem } from './RmsWorkspace';
import { AuthContext } from '../context/AuthContext';
import client from '../workspaces/client';
import { resetWorkspaceStore } from '../workspaces/store';
import { EmbedLoadError, loadRmsEmbed, attachRmsStyle } from './embed';

jest.mock('react-helmet-async', () => ({ Helmet: () => null }));
jest.mock('../workspaces/client', () => {
  const methods = ['listWorkspaces', 'getWorkspace', 'requestClaim'];
  return { __esModule: true, default: Object.fromEntries(methods.map((name) => [name, jest.fn()])), sessionAuthorization: () => 'Bearer t' };
});
jest.mock('./embed', () => ({
  RMS_API_BASE: 'https://rms.plotune.net',
  EmbedLoadError: class EmbedLoadError extends Error { constructor(message) { super(message); this.name = 'EmbedLoadError'; } },
  loadRmsEmbed: jest.fn(),
  attachRmsStyle: jest.fn(),
}));

const W1 = { id: 'w1', name: 'Rig team', role: 'Owner', revision: 1, projectCount: 3, services: ['stream', 'rms'] };
const W2 = { id: 'w2', name: 'Lab', role: 'Member', revision: 1, projectCount: 1, services: ['rms'] };
const detail = (id, name, projects) => ({ id, name, revision: 1, role: 'Owner', members: [], invites: [], projects });
const P = (id, name, services) => ({ id, name, revision: 1, services });
const claimFor = (token, ageMs = 0) => ({ service: 'rms', token, expiresAt: new Date(Date.now() + 900_000 - ageMs).toISOString(), role: 'Owner', projectRevision: 1 });

let container; let root; let mounts; let styleHandle; let invalidate;
const Where = () => { const location = useLocation(); return <p data-testid="where">{location.pathname}{location.search}</p>; };
const flush = () => act(async () => { for (let i = 0; i < 8; i += 1) await Promise.resolve(); });
const render = async (entry, auth = { token: 't', isLoading: false }) => {
  await act(async () => root.render(
    <MemoryRouter initialEntries={[entry]}>
      <AuthContext.Provider value={{ invalidateSession: invalidate, ...auth }}>
        <Routes>
          <Route path="/rms/:workspaceId?/:projectId?" element={<RmsPage />} />
          <Route path="/login" element={<p>login</p>} />
          <Route path="/workspaces/:id" element={<p>workspace page</p>} />
          <Route path="/workspaces" element={<p>workspaces page</p>} />
          <Route path="*" element={<p>elsewhere</p>} />
        </Routes>
        <Where />
      </AuthContext.Provider>
    </MemoryRouter>,
  ));
  await flush();
};
const where = () => container.querySelector('[data-testid="where"]').textContent;
const select = (label) => [...container.querySelectorAll('.rms-bar label')].find((l) => l.textContent.startsWith(label))?.querySelector('select');
const choose = (el, value) => act(async () => { Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(el, value); el.dispatchEvent(new Event('change', { bubbles: true })); });

beforeEach(() => {
  jest.useRealTimers();
  Object.values(client).forEach((fn) => fn.mockReset());
  resetWorkspaceStore(); window.localStorage.clear();
  mounts = [];
  styleHandle = { ready: Promise.resolve(), detach: jest.fn() };
  attachRmsStyle.mockReset().mockReturnValue(styleHandle);
  loadRmsEmbed.mockReset().mockResolvedValue({
    styleHref: '/rms-app/assets/rms.css',
    mount: jest.fn((element, options) => {
      const handle = { element, options, unmount: jest.fn() };
      element.textContent = 'RMS app';
      mounts.push(handle);
      return handle;
    }),
  });
  invalidate = jest.fn();
  client.listWorkspaces.mockResolvedValue([W1, W2]);
  client.getWorkspace.mockImplementation(async (id) => (id === 'w1'
    ? detail('w1', 'Rig team', [P('p1', 'Brake ECU', ['stream', 'rms']), P('p2', 'Telemetry', ['stream']), P('p3', 'Parking brake', ['rms'])])
    : detail('w2', 'Lab', [P('p9', 'Bench', ['rms'])])));
  client.requestClaim.mockImplementation(async () => claimFor('claim-1'));
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); document.body.innerHTML = ''; });
const mountedOptions = () => mounts[mounts.length - 1].options;

test('a project link mounts the RMS module with the API base, the project and a claim for RMS only', async () => {
  await render('/rms/w1/p1');
  expect(mounts).toHaveLength(1);
  const { apiBase, projectId, getClaim } = mountedOptions();
  expect(apiBase).toBe('https://rms.plotune.net');
  expect(projectId).toBe('p1');
  expect(await getClaim()).toBe('claim-1');
  expect(client.requestClaim).toHaveBeenCalledWith('w1', 'p1', 'rms');
  expect(client.requestClaim).toHaveBeenCalledTimes(1);
  expect(container.querySelector('.rms-host').hidden).toBe(false);
  expect(container.querySelector('.rms-mount').textContent).toBe('RMS app');
  expect(styleHandle.detach).not.toHaveBeenCalled();
});

test('the picker offers only the RMS-enabled projects and workspaces, and switching changes the route', async () => {
  await render('/rms/w1/p1');
  expect([...select('Project').options].map((o) => o.textContent)).toEqual(['Brake ECU', 'Parking brake']);
  expect([...select('Workspace').options].map((o) => o.textContent)).toEqual(['Rig team', 'Lab']);
  expect(select('Project').value).toBe('p1');
  await choose(select('Project'), 'p3');
  expect(where()).toBe('/rms/w1/p3');
  await flush();
  expect(mountedOptions().projectId).toBe('p3');
  await choose(select('Workspace'), 'w2');
  await flush();
  expect(where()).toBe('/rms/w2/p9');
  expect(mountedOptions().projectId).toBe('p9');
});

test('the module is unmounted and its stylesheet released when the project changes and when the route is left', async () => {
  jest.useFakeTimers();
  await render('/rms/w1/p1');
  const first = mounts[0];
  await choose(select('Project'), 'p3');
  await flush();
  act(() => jest.runOnlyPendingTimers());
  expect(first.unmount).toHaveBeenCalledTimes(1);
  expect(first.element.isConnected).toBe(false);
  expect(mounts).toHaveLength(2);
  expect(mounts[1].unmount).not.toHaveBeenCalled();
  await act(async () => root.render(<MemoryRouter><p>elsewhere</p></MemoryRouter>));
  act(() => jest.runOnlyPendingTimers());
  expect(mounts[1].unmount).toHaveBeenCalledTimes(1);
  expect(styleHandle.detach).toHaveBeenCalledTimes(2);
  jest.useRealTimers();
});

test('/rms opens the first RMS project; a remembered one wins', async () => {
  await render('/rms');
  expect(where()).toBe('/rms/w1/p1');
  expect(mountedOptions().projectId).toBe('p1');
  act(() => root.unmount()); container.remove();
  resetWorkspaceStore();
  window.localStorage.setItem('plotune-workspace-selection:v1', JSON.stringify({ workspaceId: 'w1', workspaceName: 'Rig team', projectId: 'p3' }));
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  await render('/rms');
  expect(where()).toBe('/rms/w1/p3');
});

test('the claim is asked for again, once, when the module passes refresh', async () => {
  await render('/rms/w1/p1');
  const { getClaim } = mountedOptions();
  client.requestClaim.mockResolvedValueOnce(claimFor('claim-2'));
  expect(await getClaim(true)).toBe('claim-2');
  expect(client.requestClaim).toHaveBeenCalledTimes(2);
});

test('signed out: the person is sent to sign in and the sign-in keeps this project as the way back', async () => {
  await render('/rms/w1/p1', { token: null, isLoading: false });
  expect(where()).toBe('/login?next=%2Frms%2Fw1%2Fp1');
  expect(client.listWorkspaces).not.toHaveBeenCalled();
  expect(loadRmsEmbed).not.toHaveBeenCalled();
});

test('while the session is being checked nothing is requested', async () => {
  await render('/rms/w1/p1', { token: null, isLoading: true });
  expect(container.textContent).toContain('Checking your session');
  expect(client.listWorkspaces).not.toHaveBeenCalled();
});

test('no RMS project anywhere: one explanation and one link, nothing mounted', async () => {
  client.listWorkspaces.mockResolvedValue([{ ...W1, services: ['stream'] }]);
  await render('/rms');
  expect(container.querySelector('h1').textContent).toBe('No project has RMS enabled');
  expect(container.textContent).toContain('Enable it in workspace settings.');
  const links = container.querySelectorAll('main a');
  expect(links).toHaveLength(1);
  expect(links[0].getAttribute('href')).toBe('/workspaces');
  expect(container.querySelector('.rms-bar')).toBeNull();
  expect(loadRmsEmbed).not.toHaveBeenCalled();
});

test('a workspace whose list entry says RMS but whose projects have none shows the same empty state, linking to that workspace', async () => {
  client.getWorkspace.mockResolvedValue(detail('w1', 'Rig team', [P('p2', 'Telemetry', ['stream'])]));
  client.listWorkspaces.mockResolvedValue([W1]);
  await render('/rms');
  expect(container.querySelector('h1').textContent).toBe('No project has RMS enabled');
  expect(container.querySelector('main a').getAttribute('href')).toBe('/workspaces/w1');
});

test('a project without RMS in the link is explained and nothing is mounted', async () => {
  await render('/rms/w1/p2');
  expect(container.querySelector('h1').textContent).toBe('Project unavailable');
  expect(loadRmsEmbed).not.toHaveBeenCalled();
  expect(client.requestClaim).not.toHaveBeenCalled();
  expect(select('Project').value).toBe('');
});

describe('failures', () => {
  const fail = (status, code) => Object.assign(new Error(code), { status, code });

  test('403 from the claim: a role explanation, no retry, link to the workspace; the module is never mounted', async () => {
    client.requestClaim.mockRejectedValue(fail(403, 'forbidden'));
    await render('/rms/w1/p1');
    expect(container.querySelector('h1').textContent).toBe('RMS is not available for this project');
    expect(container.querySelector('[role="alert"]').textContent).toContain('Your role in this workspace');
    expect([...container.querySelectorAll('button')].some((b) => b.textContent === 'Try again')).toBe(false);
    expect(container.querySelector('main a').getAttribute('href')).toBe('/workspaces/w1');
    expect(mounts).toHaveLength(0);
    expect(container.textContent).not.toContain('forbidden');
  });

  test('503 auth_unavailable: plain wording and a retry that works', async () => {
    client.requestClaim.mockRejectedValueOnce(fail(503, 'auth_unavailable'));
    await render('/rms/w1/p1');
    expect(container.querySelector('h1').textContent).toBe('RMS is temporarily unavailable');
    expect(container.textContent).not.toContain('auth_unavailable');
    expect(mounts).toHaveLength(0);
    await act(async () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Try again').click());
    await flush();
    expect(mounts).toHaveLength(1);
    expect(container.querySelector('h1')).toBeNull();
  });

  test('401 from the claim request means the account session ended: sign in again, coming back here', async () => {
    client.requestClaim.mockRejectedValue(fail(401, 'invalid_session'));
    await render('/rms/w1/p1');
    expect(invalidate).toHaveBeenCalled();
    expect(where()).toBe('/login?expired=1&next=%2Frms%2Fw1%2Fp1');
  });

  test('a claim that cannot be renewed after the app is running ends the view the same way', async () => {
    await render('/rms/w1/p1');
    client.requestClaim.mockRejectedValue(fail(401, 'invalid_session'));
    await act(async () => { await expect(mountedOptions().getClaim(true)).rejects.toMatchObject({ status: 401 }); });
    await flush();
    expect(where()).toBe('/login?expired=1&next=%2Frms%2Fw1%2Fp1');
  });

  test('the module fails to load: say so, then retry loads it', async () => {
    loadRmsEmbed.mockRejectedValueOnce(new EmbedLoadError('RMS module: boom'));
    await render('/rms/w1/p1');
    expect(container.querySelector('h1').textContent).toBe('RMS could not be loaded');
    expect(container.textContent).not.toContain('boom');
    await act(async () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Try again').click());
    await flush();
    expect(mounts).toHaveLength(1);
  });

  test('the stylesheet failing to load counts as the module failing to load', async () => {
    attachRmsStyle.mockImplementation(() => ({ ready: Promise.reject(new EmbedLoadError('css')), detach: jest.fn() }));
    await render('/rms/w1/p1');
    expect(container.querySelector('h1').textContent).toBe('RMS could not be loaded');
    expect(mounts).toHaveLength(0);
  });

  test('the project list failing offers a retry', async () => {
    client.listWorkspaces.mockRejectedValueOnce(fail(503, 'unavailable'));
    await render('/rms');
    expect(container.querySelector('h1').textContent).toBe('We could not load your projects');
    client.listWorkspaces.mockResolvedValue([W1]);
    await act(async () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Try again').click());
    await flush();
    expect(mounts).toHaveLength(1);
  });

  test('a 401 on the project list goes to sign-in', async () => {
    client.listWorkspaces.mockRejectedValue(fail(401, 'no_session'));
    await render('/rms');
    expect(where()).toBe('/login?expired=1&next=%2Frms');
  });

  test('rmsProblem never passes server codes through', () => {
    for (const status of [0, 401, 403, 404, 429, 500, 503]) {
      const { title, text } = rmsProblem(Object.assign(new Error('secret_code'), { status, code: 'secret_code' }));
      expect(`${title} ${text}`).not.toContain('secret_code');
    }
  });
});
