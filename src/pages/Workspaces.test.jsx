import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Workspaces from './Workspaces';
import WorkspaceSwitcher from '../workspaces/WorkspaceSwitcher';
import { AuthContext } from '../context/AuthContext';
import client from '../workspaces/client';
import { resetWorkspaceStore } from '../workspaces/store';

jest.mock('react-helmet-async', () => ({ Helmet: () => null }));
jest.mock('../workspaces/client', () => ({ __esModule: true, default: { listWorkspaces: jest.fn(), createWorkspace: jest.fn(), getWorkspace: jest.fn() }, sessionAuthorization: () => 'Bearer t' }));

let container; let root;
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });
const render = async (ui, entry = '/workspaces') => {
  await act(async () => root.render(
    <MemoryRouter initialEntries={[entry]}><AuthContext.Provider value={{ token: 't', isLoading: false, invalidateSession: jest.fn() }}>
      <Routes><Route path="/workspaces" element={ui} /><Route path="/workspaces/:id" element={<p>detail</p>} /></Routes>
    </AuthContext.Provider></MemoryRouter>,
  ));
  await flush();
};
const button = (text) => [...container.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(text));

beforeEach(() => { Object.values(client).forEach((fn) => fn.mockReset()); resetWorkspaceStore(); window.localStorage.clear(); container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); document.body.innerHTML = ''; });

test('with no workspace the page offers one clear way to create the first', async () => {
  client.listWorkspaces.mockResolvedValue([]);
  await render(<Workspaces />);
  expect(container.querySelector('[data-state="empty"]')).not.toBeNull();
  expect([...container.querySelectorAll('button')].filter((b) => b.textContent === 'New workspace')).toHaveLength(1);
});

test('each workspace is one link card with its role and a one-line state from the list', async () => {
  client.listWorkspaces.mockResolvedValue([
    { id: 'w1', name: 'Rig team', role: 'Owner', revision: 1, projectCount: 3, services: ['stream', 'rms'] },
    { id: 'w2', name: 'Lab', role: 'Viewer', revision: 1, projectCount: 0, services: [] },
    { id: 'w3', name: 'One', role: 'Admin', revision: 1, projectCount: 1, services: [] },
  ]);
  await render(<Workspaces />);
  const cards = container.querySelectorAll('a.ws-card');
  expect(cards).toHaveLength(3);
  expect(cards[0].getAttribute('href')).toBe('/workspaces/w1');
  expect(cards[1].textContent).toContain('Viewer');
  expect(cards[0].textContent).toContain('3 projects · Stream, RMS');
  expect(cards[1].textContent).toContain('No projects yet');
  expect(cards[2].textContent).toContain('1 project');
  expect(client.getWorkspace).not.toHaveBeenCalled();
  expect(container.textContent).not.toContain('Open');
});

test('creating a workspace opens its page; a limit error stays in the dialog', async () => {
  client.listWorkspaces.mockResolvedValue([]);
  client.createWorkspace.mockRejectedValueOnce(Object.assign(new Error('x'), { status: 409, code: 'workspace_limit' })).mockResolvedValueOnce({ id: 'w9', name: 'New', role: 'Owner' });
  await render(<Workspaces />);
  await act(async () => button('New workspace').click());
  const dialog = document.querySelector('[role="dialog"]');
  await act(async () => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(dialog.querySelector('input'), 'New'); dialog.querySelector('input').dispatchEvent(new Event('input', { bubbles: true })); });
  await act(async () => [...dialog.querySelectorAll('button')].find((b) => b.textContent === 'Create workspace').click());
  expect(dialog.querySelector('[role="alert"]').textContent).toContain('limit');
  await act(async () => [...dialog.querySelectorAll('button')].find((b) => b.textContent === 'Create workspace').click());
  expect(container.textContent).toBe('detail');
  expect(client.createWorkspace).toHaveBeenCalledWith('New');
});

test('rate limiting and an outage are explained and retryable', async () => {
  client.listWorkspaces.mockRejectedValue(Object.assign(new Error('x'), { status: 429, retryAfter: 7 }));
  await render(<Workspaces />);
  expect(container.textContent).toContain('Try again in 7 seconds');
  client.listWorkspaces.mockResolvedValue([{ id: 'w1', name: 'Rig', role: 'Admin', revision: 1 }]);
  await act(async () => button('Try again').click());
  await flush();
  expect(container.textContent).toContain('Rig');
});

test('the header switcher loads the list only when opened and lists workspaces with a link to all', async () => {
  client.listWorkspaces.mockResolvedValue([{ id: 'w1', name: 'Rig team', role: 'Owner', revision: 1 }]);
  await render(<WorkspaceSwitcher />);
  expect(client.listWorkspaces).not.toHaveBeenCalled();
  const toggle = button('Workspaces');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  await act(async () => toggle.click());
  await flush();
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(container.querySelector('a[href="/workspaces/w1"]')).not.toBeNull();
  expect(container.querySelector('a[href="/workspaces"]').textContent).toBe('All workspaces');
  await act(async () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); });
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(toggle);
});
