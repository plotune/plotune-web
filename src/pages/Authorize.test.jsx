import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Authorize from './Authorize';
import client from '../workspaces/client';

jest.mock('react-helmet-async', () => ({ Helmet: () => null }));
jest.mock('../workspaces/client', () => ({ __esModule: true, default: { getConsentContext: jest.fn(), submitConsent: jest.fn() } }));

const context = (role = 'Owner') => ({
  csrf: 'csrf-1', client: { name: 'Claude Desktop', redirectHost: 'app.example' }, resource: { service: 'stream', url: 'https://stream.plotune.net/mcp' },
  expiresAt: '2099-01-01T00:00:00Z',
  workspaces: [{ id: 'w1', name: 'Rig team', role, projects: [{ id: 'p1', name: 'Bench', services: ['stream'] }, { id: 'p2', name: 'Lab', services: ['stream'] }, { id: 'p3', name: 'Docs', services: ['rms'] }] }],
  services: [{ service: 'stream', scopes: [{ scope: 'events:read', class: 'read', description: 'Read event history' }, { scope: 'dashboards:write', class: 'write', description: 'Change dashboards' }] }],
});

let container; let root; let assign; let originalLocation;
const Where = () => { const l = useLocation(); return <p data-testid="where">{l.pathname + l.search}</p>; };
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });
const render = async (entry = '/authorize?request=blob.sig') => {
  await act(async () => root.render(null));
  await act(async () => root.render(<MemoryRouter initialEntries={[entry]}><Routes><Route path="/authorize" element={<Authorize />} /><Route path="*" element={<Where />} /></Routes></MemoryRouter>));
  await flush();
};
const button = (text) => [...container.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(text));
const click = (el) => act(async () => { el.click(); });

beforeEach(() => {
  Object.values(client).forEach((fn) => fn.mockReset());
  Cookies.set('auth_token', 'Bearer t');
  originalLocation = window.location; assign = jest.fn();
  delete window.location; window.location = { ...originalLocation, assign };
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); window.location = originalLocation; Cookies.remove('auth_token'); });

test('signed out, the request is kept and the person is sent to sign in', async () => {
  Cookies.remove('auth_token');
  await render();
  expect(container.querySelector('[data-testid="where"]').textContent).toBe(`/login?next=${encodeURIComponent('/authorize?request=blob.sig')}`);
  expect(client.getConsentContext).not.toHaveBeenCalled();
});

test('a 401 from the context sends the person to sign in with the same request', async () => {
  client.getConsentContext.mockRejectedValue(Object.assign(new Error('x'), { status: 401 }));
  await render();
  expect(container.querySelector('[data-testid="where"]').textContent).toContain('/login?next=');
});

test('shows app, workspace, projects, products and read-only before Approve, which waits for a project', async () => {
  client.getConsentContext.mockResolvedValue(context());
  await render();
  expect(client.getConsentContext).toHaveBeenCalledWith('blob.sig', expect.anything());
  const text = container.textContent;
  ['Claude Desktop', 'app.example', 'Rig team', 'Bench', 'Lab', 'Read event history'].forEach((s) => expect(text).toContain(s));
  expect(container.querySelector('input[role="switch"]').checked).toBe(true);
  expect(button('Approve and continue').disabled).toBe(true);
  // A project without the requested product cannot be chosen, and says why.
  const docs = [...container.querySelectorAll('label')].find((l) => l.textContent.includes('Docs')).querySelector('input');
  expect(docs.disabled).toBe(true);
  expect(container.textContent).toContain('Stream is not turned on here.');
  const bench = [...container.querySelectorAll('label')].find((l) => l.textContent.includes('Bench')).querySelector('input');
  await click(bench);
  expect(button('Approve and continue').disabled).toBe(false);
  expect(container.querySelector('.consent__summary').textContent).toContain('Read-only. It cannot change anything.');
});

test('approving sends the CSRF header value, the choices and navigates to the returned address', async () => {
  client.getConsentContext.mockResolvedValue(context());
  client.submitConsent.mockResolvedValue({ redirectTo: 'https://app.example/cb?code=1&state=s' });
  await render();
  await click([...container.querySelectorAll('label')].find((l) => l.textContent.includes('Bench')).querySelector('input'));
  await click(container.querySelector('input[role="switch"]'));
  await click([...container.querySelectorAll('label')].find((l) => l.textContent.includes('Change dashboards')).querySelector('input'));
  await click(button('Approve and continue'));
  expect(client.submitConsent).toHaveBeenCalledWith('csrf-1', {
    request: 'blob.sig', decision: 'approve', workspaceId: 'w1', projectIds: ['p1'], services: ['stream'], readOnly: false, scopes: ['events:read', 'dashboards:write'],
  });
  expect(assign).toHaveBeenCalledWith('https://app.example/cb?code=1&state=s');
});

test('read-only drops the write choices from the request', async () => {
  client.getConsentContext.mockResolvedValue(context());
  client.submitConsent.mockResolvedValue({ redirectTo: 'https://app.example/cb' });
  await render();
  await click([...container.querySelectorAll('label')].find((l) => l.textContent.includes('Lab')).querySelector('input'));
  await click(button('Approve and continue'));
  expect(client.submitConsent.mock.calls[0][1]).toMatchObject({ readOnly: true, scopes: ['events:read'], projectIds: ['p2'] });
});

test('a viewer is always read-only and is offered no changes', async () => {
  client.getConsentContext.mockResolvedValue(context('Viewer'));
  await render();
  const toggle = container.querySelector('input[role="switch"]');
  expect(toggle.checked).toBe(true);
  expect(toggle.disabled).toBe(true);
  expect(container.textContent).not.toContain('Change dashboards');
});

test('deny sends only the decision', async () => {
  client.getConsentContext.mockResolvedValue(context());
  client.submitConsent.mockResolvedValue({ redirectTo: 'http://127.0.0.1:9000/cb?error=access_denied' });
  await render();
  await click(button('Deny'));
  expect(client.submitConsent).toHaveBeenCalledWith('csrf-1', { request: 'blob.sig', decision: 'deny' });
  expect(assign).toHaveBeenCalled();
});

test('an unsafe return address is never followed', async () => {
  client.getConsentContext.mockResolvedValue(context());
  client.submitConsent.mockResolvedValue({ redirectTo: 'javascript:alert(1)' });
  await render();
  await click(button('Deny'));
  expect(assign).not.toHaveBeenCalled();
  expect(container.querySelector('[role="alert"]')).not.toBeNull();
});

test('a wrong CSRF token fetches a fresh one and keeps the choices', async () => {
  client.getConsentContext.mockResolvedValueOnce(context()).mockResolvedValueOnce({ ...context(), csrf: 'csrf-2' });
  client.submitConsent.mockRejectedValueOnce(Object.assign(new Error('x'), { status: 403, code: 'csrf' })).mockResolvedValueOnce({ redirectTo: 'https://app.example/cb' });
  await render();
  await click([...container.querySelectorAll('label')].find((l) => l.textContent.includes('Bench')).querySelector('input'));
  await click(button('Approve and continue'));
  expect(container.textContent).toContain('We refreshed the page');
  await click(button('Approve and continue'));
  expect(client.submitConsent.mock.calls[1][0]).toBe('csrf-2');
  expect(client.submitConsent.mock.calls[1][1].projectIds).toEqual(['p1']);
});

test('no request, an expired request, no projects and a network failure each explain themselves', async () => {
  await render('/authorize');
  expect(container.textContent).toContain('This link is incomplete');
  client.getConsentContext.mockResolvedValue({ ...context(), expiresAt: '2000-01-01T00:00:00Z' });
  await render();
  expect(container.textContent).toContain('has expired');
  client.getConsentContext.mockResolvedValue({ ...context(), workspaces: [] });
  await render();
  expect(container.querySelector('[data-state="empty"]')).not.toBeNull();
  client.getConsentContext.mockRejectedValue(Object.assign(new Error('x'), { status: 0 }));
  await render();
  expect(button('Try again')).toBeTruthy();
});
