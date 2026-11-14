import Cookies from 'js-cookie';
import { createWorkspaceClient, normalizeWorkspace, sessionAuthorization, WorkspaceFailure } from './client';
import api from '../services/api';

const response = (status, data, headers = {}) => ({ status, data, headers });
const failing = (status, error, headers = {}) => Object.assign(new Error('failed'), { response: { status, data: { error }, headers } });
const make = (request) => createWorkspaceClient({ http: { request }, authorization: () => 'Bearer session' });

afterEach(() => Cookies.remove('auth_token'));

test('uses its own axios instance, not the one that redirects to login on every 401', () => {
  const source = createWorkspaceClient.toString();
  expect(api.interceptors.response.handlers.length).toBeGreaterThan(0);
  expect(source).not.toContain('services/api');
});

test('the cookie value is normalized to one Bearer prefix', () => {
  expect(sessionAuthorization()).toBe('');
  Cookies.set('auth_token', 'Bearer abc.def');
  expect(sessionAuthorization()).toBe('Bearer abc.def');
  Cookies.set('auth_token', 'abc.def');
  expect(sessionAuthorization()).toBe('Bearer abc.def');
});

test('without a session no request is made and the failure is a 401', async () => {
  const request = jest.fn();
  const client = createWorkspaceClient({ http: { request }, authorization: () => '' });
  await expect(client.listWorkspaces()).rejects.toMatchObject({ status: 401, code: 'no_session' });
  expect(request).not.toHaveBeenCalled();
});

test('lists workspaces with the session as Bearer and keeps only the documented fields', async () => {
  const request = jest.fn().mockResolvedValue(response(200, { items: [{ id: 'w1', name: 'Rig', role: 'Owner', revision: 3, extra: 1 }] }));
  const items = await make(request).listWorkspaces();
  expect(items).toEqual([{ id: 'w1', name: 'Rig', role: 'Owner', revision: 3, projectCount: 0, services: [] }]);
  expect(request.mock.calls[0][0]).toMatchObject({ method: 'get', url: '/v1/workspaces', headers: { Authorization: 'Bearer session' } });
});

test('writes carry the workspace revision and encode path segments', async () => {
  const request = jest.fn().mockResolvedValue(response(200, {}));
  const client = make(request);
  await client.putMember('w 1', 'a+b@x.io', 'Viewer', 7);
  await client.removeMember('w1', 'me', 8);
  await client.disableService('w1', 'p1', 'stream', 9);
  await client.createProject('w1', 'Bench', ['stream'], 10);
  await client.createProject('w1', 'Empty', [], 11);
  await client.transferOwnership('w1', 'new@x.io', 12);
  await client.deleteWorkspace('w1', 13);
  const calls = request.mock.calls.map(([config]) => [config.method, config.url, config.data]);
  expect(calls).toEqual([
    ['put', '/v1/workspaces/w%201/members/a%2Bb%40x.io', { role: 'Viewer', revision: 7 }],
    ['delete', '/v1/workspaces/w1/members/me', { revision: 8 }],
    ['delete', '/v1/workspaces/w1/projects/p1/services/stream', { revision: 9 }],
    ['post', '/v1/workspaces/w1/projects', { name: 'Bench', services: ['stream'], revision: 10 }],
    ['post', '/v1/workspaces/w1/projects', { name: 'Empty', revision: 11 }],
    ['post', '/v1/workspaces/w1/owner', { email: 'new@x.io', revision: 12 }],
    ['delete', '/v1/workspaces/w1', { revision: 13 }],
  ]);
});

test('claims are requested for exactly one service', async () => {
  const request = jest.fn().mockResolvedValue(response(200, { service: 'rms', token: 't', expiresAt: 'x', role: 'Member', projectRevision: 1 }));
  await make(request).requestClaim('w1', 'p1', 'rms');
  expect(request.mock.calls[0][0]).toMatchObject({ method: 'post', url: '/v1/workspaces/w1/projects/p1/claims', data: { service: 'rms' } });
});

test('consent sends the CSRF token in X-Plotune-CSRF and the request blob as a query parameter', async () => {
  const request = jest.fn().mockResolvedValue(response(200, { redirectTo: 'https://app.example/cb' }));
  const client = make(request);
  await client.getConsentContext('blob.sig');
  await client.submitConsent('csrf-1', { request: 'blob.sig', decision: 'deny' });
  expect(request.mock.calls[0][0]).toMatchObject({ method: 'get', url: '/oauth/authorize/context', params: { request: 'blob.sig' } });
  expect(request.mock.calls[1][0]).toMatchObject({ method: 'post', url: '/oauth/authorize/consent', headers: { 'X-Plotune-CSRF': 'csrf-1', Authorization: 'Bearer session' } });
});

test('failures keep status, code, the server message and Retry-After', async () => {
  const request = jest.fn()
    .mockRejectedValueOnce(failing(409, { code: 'revision_conflict', message: 'stale' }))
    .mockRejectedValueOnce(failing(429, { code: 'rate_limited', message: 'slow down' }, { 'retry-after': '12' }))
    .mockRejectedValueOnce(failing(401, { code: 'invalid_token', message: 'no' }))
    .mockRejectedValueOnce(new Error('Network Error'));
  const client = make(request);
  await expect(client.renameWorkspace('w1', 'x', 1)).rejects.toMatchObject({ status: 409, code: 'revision_conflict', serverMessage: 'stale' });
  await expect(client.listWorkspaces()).rejects.toMatchObject({ status: 429, retryAfter: 12 });
  const unauthorized = await client.listWorkspaces().catch((error) => error);
  expect(unauthorized).toBeInstanceOf(WorkspaceFailure);
  expect(unauthorized.status).toBe(401);
  await expect(client.listWorkspaces()).rejects.toMatchObject({ status: 0, code: 'network' });
});

test('a 401 does not touch the cookie or the location (the page decides)', async () => {
  Cookies.set('auth_token', 'Bearer keep');
  const request = jest.fn().mockRejectedValue(failing(401, { code: 'invalid_token', message: '' }));
  await expect(make(request).listWorkspaces()).rejects.toMatchObject({ status: 401 });
  expect(Cookies.get('auth_token')).toBe('Bearer keep');
});

test('the workspace detail is revalidated with If-None-Match and a 304 answers from the snapshot', async () => {
  const body = { workspace: { id: 'w1', name: 'Rig', revision: 4 }, role: 'Admin', members: [{ accountId: '1', displayName: 'Ada', role: 'Owner', email: 'ada@x.io' }], invites: [{ email: 'b@x.io', role: 'Viewer' }], projects: [{ id: 'p1', name: 'Bench', revision: 1, services: ['stream'] }] };
  const request = jest.fn()
    .mockResolvedValueOnce(response(200, body, { etag: '"4-Admin"' }))
    .mockResolvedValueOnce(response(304, '', {}));
  const client = make(request);
  const first = await client.getWorkspace('w1');
  const second = await client.getWorkspace('w1');
  expect(second).toBe(first);
  expect(first).toMatchObject({ id: 'w1', role: 'Admin', revision: 4, projects: [{ id: 'p1', services: ['stream'] }], invites: [{ email: 'b@x.io' }] });
  expect(request.mock.calls[0][0].headers['If-None-Match']).toBeUndefined();
  expect(request.mock.calls[1][0].headers['If-None-Match']).toBe('"4-Admin"');
  client.forgetWorkspace('w1');
  request.mockResolvedValueOnce(response(200, body, { etag: '"5-Admin"' }));
  await client.getWorkspace('w1');
  expect(request.mock.calls[2][0].headers['If-None-Match']).toBeUndefined();
});

test('normalizing tolerates missing fields and object-style services', () => {
  expect(normalizeWorkspace({ workspace: { id: 'w' }, role: 'Viewer', projects: [{ id: 'p', name: 'P', services: [{ service: 'rms' }, 'stream'] }] }))
    .toMatchObject({ members: [], invites: [], projects: [{ services: ['rms', 'stream'] }] });
});
