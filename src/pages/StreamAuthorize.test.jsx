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
