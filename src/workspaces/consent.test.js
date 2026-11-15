import { eligibleProjects, normalizeContext, offeredScopes, safeRedirect } from './consent';
import { canEditPerson, canManage } from './roles';
import { failureMessage } from './errors';
import { safeWorkspaceNext, consentLogin, workspaceLogin } from '../utils/workspaceNavigation';

const context = {
  csrf: 'c1',
  client: { name: 'Agent', redirectHost: 'agent.example' },
  resource: { service: 'stream', url: 'https://stream.plotune.net/mcp' },
  expiresAt: '2099-01-01T00:00:00Z',
  workspaces: [{ id: 'w1', name: 'Rig', role: 'Member', projects: [{ id: 'p1', name: 'A', services: ['stream', 'rms'] }, { id: 'p2', name: 'B', services: ['stream'] }] }],
  services: [{ service: 'stream', scopes: [
    { scope: 'events:read', class: 'read', description: 'Read events' },
    { scope: 'dashboards:write', class: 'write', description: 'Change dashboards' },
    { scope: 'webhooks:write', class: 'write', description: 'Change webhooks' },
  ] }],
};

test('the consent context is reduced to the fields the page shows and rejects a malformed one', () => {
  const normalized = normalizeContext(context);
  expect(normalized.services[0].scopes.map((scope) => [scope.scope, scope.write])).toEqual([['events:read', false], ['dashboards:write', true], ['webhooks:write', true]]);
  expect(normalizeContext({ ...context, csrf: '' })).toBeNull();
  expect(normalizeContext(null)).toBeNull();
});

test('only projects with every chosen service are eligible', () => {
  const { workspaces } = normalizeContext(context);
  expect(eligibleProjects(workspaces[0], ['stream']).map((project) => project.id)).toEqual(['p1', 'p2']);
  expect(eligibleProjects(workspaces[0], ['stream', 'rms']).map((project) => project.id)).toEqual(['p1']);
});

test('write scopes are not offered to viewers, and webhook changes not to members', () => {
  const { services } = normalizeContext(context);
  expect(offeredScopes(services[0], 'Viewer').write).toEqual([]);
  expect(offeredScopes(services[0], 'Member').write.map((scope) => scope.scope)).toEqual(['dashboards:write']);
  expect(offeredScopes(services[0], 'Admin').write.map((scope) => scope.scope)).toEqual(['dashboards:write', 'webhooks:write']);
  expect(offeredScopes(services[0], 'Admin').read.map((scope) => scope.scope)).toEqual(['events:read']);
});

test('the return address is https, or http on the loopback address, and nothing else', () => {
  expect(safeRedirect('https://app.example/cb?code=1')).toBe('https://app.example/cb?code=1');
  expect(safeRedirect('http://127.0.0.1:8080/cb')).toBe('http://127.0.0.1:8080/cb');
  expect(safeRedirect('http://localhost:3000/cb')).toBe('http://localhost:3000/cb');
  expect(safeRedirect('http://evil.example/cb')).toBeNull();
  expect(safeRedirect('javascript:alert(1)')).toBeNull();
  expect(safeRedirect('myapp://cb')).toBeNull();
  expect(safeRedirect(undefined)).toBeNull();
});

test('roles: admins manage everything but the owner row', () => {
  expect(canManage('Owner')).toBe(true);
  expect(canManage('Admin')).toBe(true);
  expect(canManage('Member')).toBe(false);
  expect(canManage('Viewer')).toBe(false);
  expect(canEditPerson('Admin', 'Owner')).toBe(false);
  expect(canEditPerson('Admin', 'Admin')).toBe(true);
  expect(canEditPerson('Owner', 'Viewer')).toBe(true);
  expect(canEditPerson('Member', 'Viewer')).toBe(false);
  expect(canEditPerson('Owner', 'Owner')).toBe(false);
});

test('failure messages are plain language for network, 403, 404, 409, 429 and 503', () => {
  expect(failureMessage({ status: 0 })).toMatch(/could not be reached/);
  expect(failureMessage({ status: 403, code: 'forbidden' })).toMatch(/permission/);
  expect(failureMessage({ status: 404, code: 'not_found' })).toMatch(/could not find/);
  expect(failureMessage({ status: 409, code: 'revision_conflict' })).toMatch(/changed while you were working/);
  expect(failureMessage({ status: 409, code: 'project_limit' })).toMatch(/limit of projects/);
  expect(failureMessage({ status: 429, retryAfter: 9 })).toMatch(/9 seconds/);
  expect(failureMessage({ status: 503 })).toMatch(/temporarily unavailable/);
  expect(failureMessage({ status: 422, serverMessage: 'name too long' })).toBe('name too long');
  expect(failureMessage({ status: 503, code: 'x' })).not.toMatch(/503|x/);
});

test('sign-in return paths accept only workspace pages and the consent request', () => {
  expect(safeWorkspaceNext('/workspaces')).toBe('/workspaces');
  expect(safeWorkspaceNext('/workspaces/3f2a-1b')).toBe('/workspaces/3f2a-1b');
  expect(safeWorkspaceNext('/authorize?request=abc.def_ghi')).toBe('/authorize?request=abc.def_ghi');
  expect(safeWorkspaceNext('/authorize?request=a%2Fb.c')).toBe('/authorize?request=a%2Fb.c');
  expect(safeWorkspaceNext('//evil.example')).toBeNull();
  expect(safeWorkspaceNext('/workspaces/../profile')).toBeNull();
  expect(safeWorkspaceNext('/workspaces/x?next=https://evil')).toBeNull();
  expect(safeWorkspaceNext('/authorize?request=a&redirect=https://evil')).toBeNull();
  expect(safeWorkspaceNext('/authorize')).toBeNull();
  expect(safeWorkspaceNext('https://evil.example/workspaces')).toBeNull();
  expect(safeWorkspaceNext(null)).toBeNull();
});

test('sign-in return paths accept the RMS page and one project of it, nothing else under /rms', () => {
  expect(safeWorkspaceNext('/rms')).toBe('/rms');
  expect(safeWorkspaceNext('/rms/')).toBe('/rms');
  expect(safeWorkspaceNext('/rms/3f2a-1b')).toBe('/rms/3f2a-1b');
  expect(safeWorkspaceNext('/rms/3f2a-1b/9c-77')).toBe('/rms/3f2a-1b/9c-77');
  expect(safeWorkspaceNext('/rms/a/b/c')).toBeNull();
  expect(safeWorkspaceNext('/rms/a/b?next=https://evil')).toBeNull();
  expect(safeWorkspaceNext('/rms/a/../b')).toBeNull();
  expect(safeWorkspaceNext('/rmsx')).toBeNull();
  expect(workspaceLogin('/rms/w1/p1', { expired: true })).toBe('/login?expired=1&next=%2Frms%2Fw1%2Fp1');
});

test('login links keep the consent request and mark an expired session', () => {
  expect(consentLogin('abc.def')).toBe(`/login?next=${encodeURIComponent('/authorize?request=abc.def')}`);
  expect(workspaceLogin('/workspaces/w1', { expired: true })).toBe(`/login?expired=1&next=${encodeURIComponent('/workspaces/w1')}`);
  expect(workspaceLogin('/somewhere-else')).toBe('/login');
});
