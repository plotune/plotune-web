import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ResearchLayout from './ResearchLayout';
import { AuthContext } from '../context/AuthContext';

const mockLocation = { pathname: '/research' };

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
    useLocation: () => mockLocation,
  };
}, { virtual: true });

jest.mock('../context/AuthContext', () => {
  const React = require('react');
  return { AuthContext: React.createContext() };
});

global.IS_REACT_ACT_ENVIRONMENT = true;

const renderLayout = (auth) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <AuthContext.Provider value={auth}>
        <ResearchLayout><p>content</p></ResearchLayout>
      </AuthContext.Provider>
    );
  });
  return { container, root };
};

afterEach(() => {
  document.body.innerHTML = '';
});

test('guests see Log in and Register', () => {
  const { container, root } = renderLayout({ user: null, isLoading: false, logout: jest.fn() });

  expect(container.querySelector('a[href="/login"]')).not.toBeNull();
  expect(container.querySelector('a[href="/register"]')).not.toBeNull();
  expect(container.querySelector('button.research-logout')).toBeNull();

  act(() => root.unmount());
});

test('logged-in users see Dashboard and Log out instead of Log in and Register', () => {
  const logout = jest.fn();
  const { container, root } = renderLayout({ user: { username: 'Ada' }, isLoading: false, logout });

  expect(container.querySelector('a[href="/login"]')).toBeNull();
  expect(container.querySelector('a[href="/register"]')).toBeNull();
  expect(container.querySelector('a[href="/dashboard"]')).not.toBeNull();

  act(() => {
    container.querySelector('button.research-logout').dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(logout).toHaveBeenCalledTimes(1);

  act(() => root.unmount());
});

test('no Log in or Register flash while the session is still being validated', () => {
  const { container, root } = renderLayout({ user: null, isLoading: true, logout: jest.fn() });

  expect(container.querySelector('a[href="/login"]')).toBeNull();
  expect(container.querySelector('a[href="/register"]')).toBeNull();
  expect(container.querySelector('button.research-logout')).toBeNull();

  act(() => root.unmount());
});
