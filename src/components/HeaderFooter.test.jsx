import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header';
import Footer from './Footer';
import { AuthContext } from '../context/AuthContext';

const mockLocation = { pathname: '/nexus' };

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
    useLocation: () => mockLocation,
  };
});

jest.mock('../context/AuthContext', () => {
  const React = require('react');
  return { AuthContext: React.createContext() };
});

const renderHeader = ({ user = null, logout = jest.fn() } = {}) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <AuthContext.Provider value={{ user, logout }}>
        <Header />
      </AuthContext.Provider>
    );
  });

  return { container, root };
};

const renderFooter = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<Footer />);
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
  expect(container.querySelector('.site-wordmark[translate="no"]')).not.toBeNull();
  expect(container.querySelector('a[href="/stream"] [translate="no"]').textContent).toBe('Stream');
  expect(container.querySelector('a[href="/research"] [translate="no"]').textContent).toBe('Research');
  expect(container.querySelector('button[aria-label="Open main navigation"]')).not.toBeNull();
  expect(container.querySelector('button[aria-label="Show Nexus navigation"]')).not.toBeNull();

  act(() => root.unmount());
});

test('header links Bridge externally next to an unchanged Stream link for guests and users', () => {
  const guest = renderHeader();
  // Mobile menu items are always in the DOM (shown via CSS), so this covers desktop and mobile.
  const guestBridge = guest.container.querySelector('a[href="https://bridge.plotune.net"]');

  expect(guestBridge).not.toBeNull();
  expect(guestBridge.textContent).toBe('Bridge');
  expect(guestBridge.getAttribute('rel')).toContain('noopener');
  expect(guest.container.querySelector('a[href="/stream"] [translate="no"]').textContent).toBe('Stream');

  act(() => guest.root.unmount());
  document.body.innerHTML = '';

  const user = renderHeader({ user: { username: 'Ada' } });
  expect(user.container.querySelector('a[href="https://bridge.plotune.net"]')).not.toBeNull();
  expect(user.container.querySelector('a[href="/stream/workspace"]').textContent).toBe('Stream workspace');

  act(() => user.root.unmount());
});

test('authenticated logout delegates to AuthContext without throwing', () => {
  const logout = jest.fn();
  const { container, root } = renderHeader({ user: { username: 'Ada' }, logout });

  act(() => {
    container.querySelector('button[aria-label="Log out"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(logout).toHaveBeenCalledTimes(1);

  act(() => root.unmount());
});

test('Nexus disclosure exposes its controlled navigation links without hover', () => {
  const { container, root } = renderHeader();
  const disclosure = container.querySelector('button[aria-label="Show Nexus navigation"]');
  const menu = container.querySelector('#nexus-submenu');

  expect(disclosure.getAttribute('aria-expanded')).toBe('false');
  expect(menu.className).toContain('hidden');

  act(() => {
    disclosure.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(disclosure.getAttribute('aria-expanded')).toBe('true');
  expect(disclosure.getAttribute('aria-controls')).toBe('nexus-submenu');
  expect(menu.className).toContain('block');
  expect(container.querySelector('a[href="/nexus/connectivity"]')).not.toBeNull();

  act(() => root.unmount());
});

test('footer preserves labelled navigation groups and its Features destination', () => {
  const { container, root } = renderFooter();

  expect(container.querySelector('nav[aria-labelledby="footer-product"]')).not.toBeNull();
  expect(container.querySelector('a[href="/#features"]')).not.toBeNull();
  expect(container.querySelector('a[href="/nexus"][aria-current="page"]')).not.toBeNull();
  expect(container.querySelector('a[href="https://bridge.plotune.net"]')).not.toBeNull();

  act(() => root.unmount());
});
