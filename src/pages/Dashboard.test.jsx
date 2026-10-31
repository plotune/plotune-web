import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Dashboard';
import { AuthContext } from '../context/AuthContext';

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
    Navigate: ({ to }) => React.createElement('div', { 'data-redirect': to }),
  };
});
jest.mock('react-helmet-async', () => ({ Helmet: () => null }));
jest.mock('../context/AuthContext', () => {
  const React = require('react');
  return { AuthContext: React.createContext() };
});

const render = (value) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(<AuthContext.Provider value={value}><Dashboard /></AuthContext.Provider>));
  return { container, root };
};

afterEach(() => { document.body.innerHTML = ''; });

test('dashboard shows Nexus, Stream, Bridge and Desktop as a balanced set, with Bridge as an external link', () => {
  const { container, root } = render({ user: { username: 'Ada' }, token: 't', isLoading: false });
  const titles = [...container.querySelectorAll('h2')].map((h) => h.textContent);
  expect(titles).toEqual(['Plotune Nexus', 'Plotune Stream', 'Plotune Bridge', 'Plotune Desktop']);
  const bridge = container.querySelector('a[href="https://bridge.plotune.net"]');
  expect(bridge).not.toBeNull();
  expect(bridge.getAttribute('target')).toBe('_blank');
  expect(bridge.getAttribute('rel')).toContain('noopener');
  expect(bridge.querySelector('svg')).not.toBeNull();
  expect(bridge.textContent).toContain('Open Bridge');
  // Internal cards stay router links, and the grid keeps two columns.
  expect(container.querySelector('a[href="/stream/workspace"]').getAttribute('target')).toBeNull();
  expect(container.querySelector('section').className).toContain('md:grid-cols-2');
  act(() => root.unmount());
});

test('dashboard still sends signed-out visitors to log in', () => {
  const { container, root } = render({ user: null, token: null, isLoading: false });
  expect(container.querySelector('[data-redirect="/login"]')).not.toBeNull();
  act(() => root.unmount());
});
