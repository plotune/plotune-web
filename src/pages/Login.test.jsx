import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Login from './Login';

jest.mock('../services/api', () => ({ __esModule: true, default: { post: jest.fn(), get: jest.fn() } }));

global.IS_REACT_ACT_ENVIRONMENT = true;

const BRIDGE_NEXT = `/bridge/authorize?code_challenge=${'A'.repeat(43)}&state=state-0123456789abcdef`;
const KEY = 'bridge_login_return';
const realLocation = window.location;
let container; let root; let login;

function Destination() {
  const location = useLocation();
  return <div data-testid="destination" data-path={location.pathname + location.search} />;
}

const renderAt = (entry) => {
  act(() => {
    root.render(
      <AuthContext.Provider value={{ login, token: null, user: null, isLoading: false }}>
        <MemoryRouter initialEntries={[entry]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Destination />} />
            <Route path="/bridge/authorize" element={<Destination />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
  });
};
const destination = () => container.querySelector('[data-testid="destination"]')?.getAttribute('data-path');
const settle = () => act(async () => { for (let i = 0; i < 10; i += 1) await Promise.resolve(); });
const typeInto = (id, text) => {
  const input = container.querySelector(`#${id}`);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text);
  act(() => { input.dispatchEvent(new Event('input', { bubbles: true })); });
};

beforeEach(() => {
  api.post.mockReset();
  api.get.mockReset();
  login = jest.fn();
  sessionStorage.clear();
  delete window.location;
  window.location = { ...realLocation, href: 'https://www.plotune.net/login', search: '', hash: '', origin: 'https://www.plotune.net', pathname: '/login' };
  jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.location = realLocation;
  jest.restoreAllMocks();
});

test('password login with a Bridge next goes straight back to the authorize request', async () => {
  api.post.mockImplementation((url) => (url === '/login'
    ? Promise.resolve({ data: { access_token: 'a', token_type: 'Bearer' } })
    : Promise.resolve({ data: { username: 'ada' } })));
  renderAt(`/login?next=${encodeURIComponent(BRIDGE_NEXT)}`);
  typeInto('login-username', 'ada');
  typeInto('login-password', 'pw');
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await settle();
  expect(destination()).toBe(BRIDGE_NEXT);
});

test.each([
  ['protocol-relative', '//evil.com'],
  ['absolute', 'https://evil.com'],
  ['encoded protocol-relative', '%2F%2Fevil.com'],
  ['dot segments', '/bridge/authorize/../..'],
  ['backslash', '/bridge/authorize\\..'],
])('password login ignores an unsafe next (%s) and uses the default destination', async (_name, next) => {
  api.post.mockImplementation((url) => (url === '/login'
    ? Promise.resolve({ data: { access_token: 'a', token_type: 'Bearer' } })
    : Promise.resolve({ data: { username: 'ada' } })));
  renderAt(`/login?next=${encodeURIComponent(next)}`);
  typeInto('login-username', 'ada');
  typeInto('login-password', 'pw');
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await settle();
  expect(destination()).toBe('/dashboard');
});

test('GitHub leaves the site with the validated next stored, and the return consumes it once', async () => {
  api.get.mockResolvedValue({ data: { auth_url: 'https://github.com/login/oauth/authorize' } });
  renderAt(`/login?next=${encodeURIComponent(BRIDGE_NEXT)}`);
  const github = [...container.querySelectorAll('button')].find((b) => b.textContent.trim() === 'GitHub');
  await act(async () => github.click());
  await settle();
  expect(sessionStorage.getItem(KEY)).toBe(BRIDGE_NEXT);
  expect(window.location.href).toBe('https://github.com/login/oauth/authorize');
});

test('after GitHub returns with a token, the stored Bridge next is used and removed', async () => {
  sessionStorage.setItem(KEY, BRIDGE_NEXT);
  window.location.search = '?token=gh-token';
  api.post.mockResolvedValue({ data: { username: 'ada' } });
  renderAt('/login?token=gh-token');
  await settle();
  expect(api.post).toHaveBeenCalledWith('/auth/validate', {}, { headers: { Authorization: 'Bearer gh-token' } });
  expect(login).toHaveBeenCalled();
  expect(destination()).toBe(BRIDGE_NEXT);
  expect(sessionStorage.getItem(KEY)).toBeNull();
});

test('a tampered stored value is never used after GitHub returns', async () => {
  sessionStorage.setItem(KEY, 'https://evil.com');
  window.location.search = '?token=gh-token';
  api.post.mockResolvedValue({ data: { username: 'ada' } });
  renderAt('/login?token=gh-token');
  await settle();
  expect(destination()).toBe('/dashboard');
});

test('without a next, GitHub login leaves no Bridge value behind and returns to the default destination', async () => {
  sessionStorage.setItem(KEY, BRIDGE_NEXT);
  api.get.mockResolvedValue({ data: { auth_url: 'https://github.com/login/oauth/authorize' } });
  renderAt('/login');
  const github = [...container.querySelectorAll('button')].find((b) => b.textContent.trim() === 'GitHub');
  await act(async () => github.click());
  await settle();
  expect(sessionStorage.getItem(KEY)).toBeNull();
});
