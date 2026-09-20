import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header';
import { AuthContext } from '../context/AuthContext';

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
    useLocation: () => ({ pathname: '/nexus' }),
  };
}, { virtual: true });

jest.mock('../context/AuthContext', () => {
  const React = require('react');
  return { AuthContext: React.createContext() };
});

const renderHeader = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <AuthContext.Provider value={{ user: null, logout: jest.fn() }}>
        <Header />
      </AuthContext.Provider>
    );
  });

  return { container, root };
};

global.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  document.body.innerHTML = '';
});

test('header exposes named controls for account and navigation disclosure', () => {
  const { container, root } = renderHeader();

  expect(container.querySelector('a[aria-label="Log in"]')).not.toBeNull();
  expect(container.querySelector('button[aria-label="Open main navigation"]')).not.toBeNull();
  expect(container.querySelector('button[aria-label="Show Nexus navigation"]')).not.toBeNull();

  act(() => root.unmount());
});
