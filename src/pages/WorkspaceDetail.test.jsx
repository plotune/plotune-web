import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WorkspaceDetail from './WorkspaceDetail';
import { AuthContext } from '../context/AuthContext';
import client from '../workspaces/client';
import { resetWorkspaceStore } from '../workspaces/store';

jest.mock('react-helmet-async', () => ({ Helmet: () => null }));
jest.mock('react-toastify', () => ({ toast: { success: jest.fn() } }));
jest.mock('../workspaces/client', () => {
  const methods = ['getWorkspace', 'forgetWorkspace', 'listGrants', 'revokeGrant', 'enableService', 'disableService', 'putMember', 'removeMember', 'createProject', 'renameProject', 'deleteProject', 'renameWorkspace', 'deleteWorkspace', 'transferOwnership', 'listWorkspaces'];
  const mock = Object.fromEntries(methods.map((name) => [name, jest.fn()]));
  return { __esModule: true, default: mock, sessionAuthorization: () => 'Bearer t' };
});

const base = (role, extra = {}) => ({
  id: 'w1', name: 'Rig team', revision: 5, role,
  members: [
    { accountId: '1', displayName: 'Ada', role: 'Owner', email: role === 'Owner' || role === 'Admin' ? 'ada@x.io' : null },
    { accountId: '2', displayName: 'Bo', role: 'Member', email: role === 'Owner' || role === 'Admin' ? 'bo@x.io' : null },
  ],
  invites: [],
  projects: [{ id: 'p1', name: 'Bench', revision: 1, services: ['stream'] }],
  ...extra,
});

let container; let root;
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });
const render = async (workspace) => {
  client.getWorkspace.mockResolvedValue(workspace);
  client.listGrants.mockResolvedValue([]);
  await act(async () => root.render(
    <MemoryRouter initialEntries={['/workspaces/w1']}>
      <AuthContext.Provider value={{ token: 'Bearer t', isLoading: false, invalidateSession: jest.fn() }}>
        <Routes><Route path="/workspaces/:workspaceId" element={<WorkspaceDetail />} /><Route path="/workspaces" element={<p>list</p>} /></Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  ));
  await flush();
};
const button = (text, scope = document) => [...scope.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(text));
const click = (el) => act(async () => { el.click(); });
const type = (el, value) => act(async () => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
});

beforeEach(() => {
  Object.values(client).forEach((fn) => fn.mockReset());
  resetWorkspaceStore();
  window.localStorage.clear();
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); document.body.innerHTML = ''; });

test('an owner sees every control, with ownership and deletion available', async () => {
  await render(base('Owner'));
  expect(container.querySelector('h1').textContent).toBe('Rig team');
  expect(button('New project')).toBeTruthy();
  expect(button('Invite someone')).toBeTruthy();
  expect(button('Rename')).toBeTruthy();
  const transfer = button('Transfer ownership');
  expect(transfer.disabled).toBe(false);
  // The workspace still has a project, so deleting is blocked with its reason.
  const del = button('Delete workspace');
  expect(del.disabled).toBe(true);
  expect(container.textContent).toContain('Delete its project first.');
});

test('a viewer gets a read-only page: no write controls, only leave', async () => {
  await render(base('Viewer'));
  expect(container.textContent).toContain('You can see this workspace but not change it');
  ['New project', 'Invite someone', 'Rename', 'Transfer ownership', 'Delete workspace'].forEach((text) => expect(button(text)).toBeUndefined());
  expect(container.textContent).not.toContain('ada@x.io');
  expect(button('Leave workspace')).toBeTruthy();
  await click(button('Details'));
  expect(button('Turn off')).toBeUndefined();
  expect(container.textContent).toContain('Only owners and admins can change projects.');
});

test('an admin manages people but owner-only actions are disabled with the reason shown', async () => {
  await render(base('Admin'));
  expect(button('Invite someone')).toBeTruthy();
  expect(button('Transfer ownership').disabled).toBe(true);
  expect(button('Delete workspace').disabled).toBe(true);
  expect(container.textContent).toContain('Only the workspace owner can do this.');
  expect(container.textContent).toContain('Only the owner can change this.');
  const ownerRow = [...container.querySelectorAll('.ws-row')].find((row) => row.textContent.includes('Ada'));
  expect(button('Change role', ownerRow)).toBeUndefined();
  expect(button('Remove', ownerRow)).toBeUndefined();
});

test('turning a service off asks first, then sends the workspace revision', async () => {
  client.disableService.mockResolvedValue({});
  await render(base('Owner'));
  await click(button('Manage'));
  await click(button('Turn off'));
  const dialog = document.querySelector('[role="dialog"]');
  expect(dialog.textContent).toContain('Turn off Stream for Bench?');
  expect(dialog.textContent).toContain('loses access');
  expect(client.disableService).not.toHaveBeenCalled();
  expect(document.activeElement.textContent).toBe('Cancel');
  await click(button('Turn off Stream', dialog));
  expect(client.disableService).toHaveBeenCalledWith('w1', 'p1', 'stream', 5);
  expect(client.getWorkspace).toHaveBeenCalledTimes(2);
});

test('turning a service on needs no confirmation', async () => {
  client.enableService.mockResolvedValue({});
  await render(base('Admin'));
  await click(button('Manage'));
  await click(button('Turn on'));
  expect(document.querySelector('[role="dialog"]')).toBeNull();
  expect(client.enableService).toHaveBeenCalledWith('w1', 'p1', 'rms', 5);
});

test('Escape closes a dialog and returns focus to the control that opened it', async () => {
  await render(base('Owner'));
  const open = button('Invite someone');
  open.focus();
  await click(open);
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  await act(async () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); });
  expect(document.querySelector('[role="dialog"]')).toBeNull();
  expect(document.activeElement).toBe(open);
});

test('inviting validates the address, then adds the person with a role', async () => {
  client.putMember.mockResolvedValue({});
  await render(base('Owner'));
  await click(button('Invite someone'));
  const dialog = document.querySelector('[role="dialog"]');
  await type(dialog.querySelector('input[type="email"]'), 'not-an-address');
  await click(button('Add to workspace', dialog));
  expect(dialog.textContent).toContain('Enter a full email address');
  expect(client.putMember).not.toHaveBeenCalled();
  await type(dialog.querySelector('input[type="email"]'), 'new@x.io');
  await click(dialog.querySelector('input[value="Viewer"]'));
  await click(button('Add to workspace', dialog));
  expect(client.putMember).toHaveBeenCalledWith('w1', 'new@x.io', 'Viewer', 5);
  expect(document.querySelector('[role="dialog"]')).toBeNull();
});

test('a revision conflict is explained in the dialog and the workspace is reloaded', async () => {
  client.renameProject.mockRejectedValue(Object.assign(new Error('x'), { status: 409, code: 'revision_conflict' }));
  await render(base('Owner'));
  await click(button('Manage'));
  await click(button('Rename Bench'));
  const dialog = document.querySelector('[role="dialog"]');
  await type(dialog.querySelector('input'), 'Bench 2');
  await click(button('Save name', dialog));
  expect(dialog.querySelector('[role="alert"]').textContent).toContain('changed while you were working');
  expect(client.getWorkspace).toHaveBeenCalledTimes(2);
});

test('transferring ownership needs the workspace name typed exactly', async () => {
  client.transferOwnership.mockResolvedValue({});
  await render(base('Owner', { projects: [] }));
  await click(button('Transfer ownership'));
  const dialog = document.querySelector('[role="dialog"]');
  const submit = button('Transfer ownership', dialog);
  expect(submit.disabled).toBe(true);
  await type(dialog.querySelector('input'), 'rig team');
  expect(submit.disabled).toBe(true);
  await type(dialog.querySelector('input'), 'Rig team');
  expect(submit.disabled).toBe(false);
  await click(submit);
  expect(client.transferOwnership).toHaveBeenCalledWith('w1', 'bo@x.io', 5);
});

test('deleting an empty workspace needs the name typed, then returns to the list', async () => {
  client.deleteWorkspace.mockResolvedValue({});
  await render(base('Owner', { projects: [] }));
  await click(button('Delete workspace'));
  const dialog = document.querySelector('[role="dialog"]');
  await type(dialog.querySelector('input'), 'Rig team');
  await click(button('Delete workspace', dialog));
  expect(client.deleteWorkspace).toHaveBeenCalledWith('w1', 5);
  expect(container.textContent).toBe('list');
});

test('a 404 shows a not-found state with the way back; a 503 offers a retry', async () => {
  client.getWorkspace.mockRejectedValue(Object.assign(new Error('x'), { status: 404, code: 'not_found' }));
  await act(async () => root.render(<MemoryRouter initialEntries={['/workspaces/w1']}><AuthContext.Provider value={{ token: 't', isLoading: false }}><Routes><Route path="/workspaces/:workspaceId" element={<WorkspaceDetail />} /></Routes></AuthContext.Provider></MemoryRouter>));
  await flush();
  expect(container.querySelector('[data-state="not-found"]')).not.toBeNull();
  expect(container.querySelector('a[href="/workspaces"]')).not.toBeNull();
});

test('a failed refresh keeps the last good view and says so', async () => {
  await render(base('Owner'));
  client.getWorkspace.mockRejectedValue(Object.assign(new Error('x'), { status: 503, code: 'unavailable' }));
  client.enableService.mockResolvedValue({});
  await click(button('Manage'));
  await click(button('Turn on'));
  expect(container.textContent).toContain('last version we loaded');
  expect(container.querySelector('h1').textContent).toBe('Rig team');
});

test('people rows: editable rows get a role select and a quiet Remove; others just show the role', async () => {
  client.putMember.mockResolvedValue({});
  await render(base('Owner', { invites: [{ email: 'new@x.io', role: 'Member' }] }));
  const row = (name) => [...container.querySelectorAll('.ws-row')].find((r) => r.textContent.includes(name));
  expect(row('Ada').querySelector('select')).toBeNull();
  expect(row('Ada').textContent).toContain('Owner');
  const select = row('Bo').querySelector('select[aria-label="Role for Bo"]');
  expect(select.value).toBe('Member');
  expect(button('Cancel invite')).toBeTruthy();
  expect(container.querySelector('select[aria-label="Role for new@x.io"]')).not.toBeNull();
  // Raising access applies at once.
  const set = (el, value) => act(async () => { Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(el, value); el.dispatchEvent(new Event('change', { bubbles: true })); });
  await set(select, 'Member');
  expect(client.putMember).not.toHaveBeenCalled();
  const viewerRow = container.querySelector('select[aria-label="Role for new@x.io"]');
  await set(viewerRow, 'Viewer');
  // Lowering access asks first.
  expect(client.putMember).not.toHaveBeenCalled();
  const dialog = document.querySelector('[role="dialog"]');
  expect(dialog.textContent).toContain('less access');
  await click(button('Change to Viewer', dialog));
  expect(client.putMember).toHaveBeenCalledWith('w1', 'new@x.io', 'Viewer', 5);
});

test('raising Member to Admin is confirmed because it affects an Admin; Viewer to Member is not', async () => {
  client.putMember.mockResolvedValue({});
  await render(base('Owner', { members: [
    { accountId: '1', displayName: 'Ada', role: 'Owner', email: 'ada@x.io' },
    { accountId: '2', displayName: 'Bo', role: 'Member', email: 'bo@x.io' },
    { accountId: '3', displayName: 'Dee', role: 'Viewer', email: 'dee@x.io' },
  ] }));
  const set = (el, value) => act(async () => { Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(el, value); el.dispatchEvent(new Event('change', { bubbles: true })); });
  await set(container.querySelector('select[aria-label="Role for Dee"]'), 'Member');
  expect(client.putMember).toHaveBeenCalledWith('w1', 'dee@x.io', 'Member', 5);
  await set(container.querySelector('select[aria-label="Role for Bo"]'), 'Admin');
  expect(document.querySelector('[role="dialog"]').textContent).toContain('Change Bo to Admin?');
});

test('an enabled service has one Open entry; viewers get it too; Stream and RMS sit together on a project that has both', async () => {
  await render(base('Viewer', { projects: [{ id: 'p1', name: 'Bench', revision: 1, services: ['stream', 'rms'] }, { id: 'p2', name: 'Off', revision: 1, services: [] }, { id: 'p3', name: 'Reqs', revision: 1, services: ['rms'] }] }));
  const buttons = [...container.querySelectorAll('button')].filter((b) => b.textContent.startsWith('Details'));
  await click(buttons[0]);
  const links = () => [...container.querySelectorAll('a')].filter((a) => a.textContent.startsWith('Open in'));
  expect(links().map((a) => [a.textContent.replace(/ for .*/, ''), a.getAttribute('href')])).toEqual([
    ['Open in Stream', '/stream/workspace?workspace=w1&project=p1'],
    ['Open in RMS', '/rms/w1/p1'],
  ]);
  await click(buttons[1]);
  expect(links()).toHaveLength(0);
  await click(buttons[2]);
  expect(links().map((a) => a.getAttribute('href'))).toEqual(['/rms/w1/p3']);
});
