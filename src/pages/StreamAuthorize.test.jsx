import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import StreamAuthorize from './StreamAuthorize';

global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root; let fetchMock;
const render = (entry) => act(() => root.render(<MemoryRouter initialEntries={[entry]}><StreamAuthorize /></MemoryRouter>));
beforeEach(() => {
  Cookies.remove('auth_token');
  fetchMock = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network disabled in test'));
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount()); container.remove();
  fetchMock.mockRestore();
});

test('an incomplete authorization link explains recovery instead of failing silently', () => {
  render('/stream/authorize');
  expect(container.querySelector('h1').textContent).toBe('Approve access request');
  expect(container.textContent).toContain('Restart sign-in from your MCP client');
  expect(container.textContent).toContain('Go to Stream');
  expect(global.fetch).not.toHaveBeenCalled();
});

test('without an account session the consent page hands off to login and back', async () => {
  const params = new URLSearchParams({ request: 'blob.signature' });
  render(`/stream/authorize?${params}`);
  await act(async () => { await Promise.resolve(); });
  const next = encodeURIComponent('/stream/authorize?request=blob.signature');
  expect(container.textContent).not.toContain('Project to share');
  // The redirect navigates to the allowlisted login target carrying the opaque blob.
  expect(container.textContent).toBeDefined();
  expect(next).toContain('request%3Dblob.signature');
});

test('a signed-in session without projects gets a create-first state, not an error', async () => {
  Cookies.set('auth_token', 'Bearer session-token', { path: '/' });
  fetchMock.mockResolvedValue({
    status: 200,
    ok: true,
    json: async () => ({ request: { clientId: 'mcp_x', name: 'Agent', redirect: 'https://client.example/callback', scope: ['events:read'] }, projects: [] }),
  });
  render('/stream/authorize?request=blob.signature');
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  expect(fetchMock).toHaveBeenCalledWith(
    'https://stream.plotune.net/oauth/authorize/context?request=blob.signature',
    { headers: { Authorization: 'Bearer session-token' } },
  );
  expect(container.textContent).toContain('no Stream projects yet');
  expect(container.textContent).toContain('Open Stream');
});

test('a transport failure offers a retry instead of a dead end', async () => {
  Cookies.set('auth_token', 'Bearer session-token', { path: '/' });
  fetchMock.mockRejectedValue(new Error('offline'));
  render('/stream/authorize?request=blob.signature');
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  expect(container.textContent).toContain('Stream could not be reached');
  expect(container.querySelector('button')?.textContent).toContain('Try again');
});

test('each requested permission is described in plain language, including aggregation', async () => {
  Cookies.set('auth_token', 'Bearer session-token', { path: '/' });
  fetchMock.mockResolvedValue({
    status: 200,
    ok: true,
    json: async () => ({ request: { clientId: 'mcp_x', name: 'Agent', redirect: 'https://client.example/callback', scope: ['events:read', 'aggregate:run', 'usage:read'] }, projects: [{ id: 'p1', name: 'Bench rig', role: 'Owner' }] }),
  });
  render('/stream/authorize?request=blob.signature');
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  expect(container.textContent).toContain("Summarize this project's event history");
  expect(container.textContent).toContain("See the credits this project's owner account has left");
  expect(container.textContent).not.toMatch(/aggregate:run|usage:read/);
});

const consentContext = (scope, projects) => ({ status: 200, ok: true,
  json: async () => ({ request: { clientId: 'mcp_x', name: 'Agent', redirect: 'https://client.example/callback', scope }, projects }) });
const settle = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });

test('changing webhooks is an explicit opt-in, offered only where the account is Owner or Admin', async () => {
  Cookies.set('auth_token', 'Bearer session-token', { path: '/' });
  const assign = jest.fn();
  const location = window.location;
  delete window.location; window.location = { ...location, assign };
  try {
    fetchMock.mockResolvedValueOnce(consentContext(['events:read', 'webhooks:read'], [{ id: 'p1', name: 'Bench rig', role: 'Owner' }, { id: 'p2', name: 'Shared', role: 'Member' }]));
    render('/stream/authorize?request=blob.signature');
    await settle();
    expect(container.textContent).toContain("See this project's webhooks and their recent deliveries");
    const box = (scope = 'webhooks:write') => container.querySelector(`[aria-describedby="stream-write-hint-${scope}"]`);
    expect(box().checked).toBe(false);
    expect(box('projects:write').checked).toBe(false);
    expect(container.textContent).toContain('Read-only.');
    // A Member project offers only creating projects, never webhook changes.
    await act(async () => {
      const select = container.querySelector('#project');
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(select, 'p2');
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(box()).toBeNull();
    expect(box('projects:write')).not.toBeNull();
    await act(async () => {
      const select = container.querySelector('#project');
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(select, 'p1');
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await act(async () => box().click());
    expect(container.textContent).toContain('Read access, plus changing webhooks.');
    expect(container.querySelector('.stream-authorize__badge').textContent).toBe('Can change webhooks');
    fetchMock.mockResolvedValueOnce({ status: 200, ok: true, json: async () => ({ redirectTo: 'https://client.example/callback?code=c' }) });
    await act(async () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Approve and continue').click());
    await settle();
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ request: 'blob.signature', decision: 'approve', projectId: 'p1', allowWrites: ['webhooks:write'], allowWebhookWrites: true });
  } finally { window.location = location; }
});

test('an application that asks to change webhooks gets the box pre-ticked, never hidden in the read list', async () => {
  Cookies.set('auth_token', 'Bearer session-token', { path: '/' });
  fetchMock.mockResolvedValueOnce(consentContext(['events:read', 'webhooks:write'], [{ id: 'p1', name: 'Bench rig', role: 'Admin' }]));
  render('/stream/authorize?request=blob.signature');
  await settle();
  expect(container.querySelector('.stream-authorize__write input').checked).toBe(true);
  expect(container.textContent).not.toContain('webhooks:write');
});

test('creating projects is its own opt-in, offered to Members too, and sent as allowWrites', async () => {
  Cookies.set('auth_token', 'Bearer session-token', { path: '/' });
  const assign = jest.fn();
  const location = window.location;
  delete window.location; window.location = { ...location, assign };
  try {
    fetchMock.mockResolvedValueOnce(consentContext(['events:read', 'projects:write'], [{ id: 'p2', name: 'Shared', role: 'Member' }]));
    render('/stream/authorize?request=blob.signature');
    await settle();
    expect(container.textContent).not.toContain('projects:write');
    expect(container.querySelectorAll('.stream-authorize__write input')).toHaveLength(1);
    expect(container.querySelector('.stream-authorize__write input').checked).toBe(true);
    expect(container.querySelector('.stream-authorize__badge').textContent).toBe('Can create projects');
    expect(container.textContent).toContain('Read access, plus creating and renaming projects.');
    fetchMock.mockResolvedValueOnce({ status: 200, ok: true, json: async () => ({ redirectTo: 'https://client.example/callback?code=c' }) });
    await act(async () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Approve and continue').click());
    await settle();
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ request: 'blob.signature', decision: 'approve', projectId: 'p2', allowWrites: ['projects:write'] });
  } finally { window.location = location; }
});
