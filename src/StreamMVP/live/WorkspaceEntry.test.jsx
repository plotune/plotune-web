import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthContext } from '../../context/AuthContext';
import StreamWorkspace from './StreamWorkspace';

jest.mock('./client', () => ({ ...jest.requireActual('./client'), WORKSPACE_ENABLED: true }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const render = (auth, route = '/stream/workspace') => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(<MemoryRouter initialEntries={[route]}><HelmetProvider><AuthContext.Provider value={auth}><StreamWorkspace /></AuthContext.Provider></HelmetProvider></MemoryRouter>));
  return { container, cleanup: () => { act(() => root.unmount()); container.remove(); } };
};

test('signed-out entry preserves the requested shared workspace through sign-in without fetching private data', () => {
  const fetcher = jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(new Error('Unexpected request')));
  const { container, cleanup } = render({ token: null, isLoading: false }, '/stream/workspace?project=shared-project&view=dashboards&dashboard=overview');
  const login = container.querySelector('.stream-entry-primary');
  const next = new URL(login.href).searchParams.get('next');
  expect(next).toBe('/stream/workspace?project=shared-project&view=dashboards&dashboard=overview');
  expect(container.querySelector('.stream-entry-shared').textContent).toContain('workspace link is saved');
  expect(container.querySelector('a[href="/stream/demo"]')).not.toBeNull();
  expect(container.querySelector('a[href="/register"]')).not.toBeNull();
  expect(fetcher).not.toHaveBeenCalled();
  cleanup();
  fetcher.mockRestore();
});

test('session checking uses the same entry layout without flashing sign-in actions', () => {
  const { container, cleanup } = render({ token: null, isLoading: true });
  expect(container.querySelector('[role="status"]').textContent).toContain('Checking your session');
  expect(container.querySelector('.stream-entry-header')).not.toBeNull();
  expect(container.querySelector('.stream-entry-primary')).toBeNull();
  expect(container.querySelector('a[href="/register"]')).toBeNull();
  cleanup();
});
