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
  // For guests the workspace sits inside the single Bridge menu (next to the product pages), not as a second "Bridge".
  const guestBridge = guest.container.querySelector('a[href="https://bridge.plotune.net"]');

  expect(guestBridge).not.toBeNull();
  expect(guestBridge.textContent).toContain('Bridge workspace');
  expect(guestBridge.getAttribute('target')).toBe('_blank');
  expect(guestBridge.getAttribute('rel')).toContain('noopener');
  expect(guest.container.querySelector('a[href="/stream"] [translate="no"]').textContent).toBe('Stream');

  act(() => guest.root.unmount());
  document.body.innerHTML = '';

  const user = renderHeader({ user: { username: 'Ada' } });
  const userBridge = user.container.querySelector('a[href="https://bridge.plotune.net"]');
  expect(userBridge).not.toBeNull();
  // The account menu shows an icon for every product entry, Bridge included.
  expect(userBridge.querySelector('svg')).not.toBeNull();
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

test('guests see exactly one "Bridge" in the header and one in the footer, each going to a different place', () => {
  const { container, root } = renderHeader();
  const named = (scope) => [...scope.querySelectorAll('a')].filter((a) => a.textContent.trim() === 'Bridge');
  const headerBridge = named(container);
  expect(headerBridge).toHaveLength(1);
  expect(headerBridge[0].getAttribute('href')).toBe('/bridge');
  // the product pages and the workspace are reachable from that one menu
  ['/bridge/can', '/bridge/serial', '/bridge/daq', '/bridge/io'].forEach((href) => expect(container.querySelector(`a[href="${href}"]`)).not.toBeNull());
  expect(container.querySelector('a[href="https://bridge.plotune.net"]')).not.toBeNull();
  act(() => root.unmount());
});

test('the footer has one "Bridge" (the product pages) and the workspace link is labelled as the workspace', () => {
  const { container, root } = renderFooter();
  const bridge = [...container.querySelectorAll('a')].filter((a) => a.textContent.trim() === 'Bridge');
  expect(bridge).toHaveLength(1);
  expect(bridge[0].getAttribute('href')).toBe('/bridge');
  const workspace = container.querySelector('a[href="https://bridge.plotune.net"]');
  expect(workspace.textContent).toContain('Bridge workspace');
  expect(workspace.getAttribute('target')).toBe('_blank');
  expect(workspace.getAttribute('rel')).toContain('noopener');
  act(() => root.unmount());
});
