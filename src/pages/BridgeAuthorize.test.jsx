import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import BridgeAuthorize from './BridgeAuthorize';

jest.mock('../services/api', () => ({ __esModule: true, default: { post: jest.fn() } }));

global.IS_REACT_ACT_ENVIRONMENT = true;

const CHALLENGE = 'A'.repeat(43);
const STATE = 'state-0123456789abcdef';
const CODE = 'x'.repeat(43);
const BRIDGE = 'https://bridge.plotune.net/';
const authorize = (extra = '') => `/bridge/authorize?code_challenge=${CHALLENGE}&state=${STATE}${extra}`;

const realLocation = window.location;
let container; let root; let replace; let value;

function LoginProbe() {
  const location = useLocation();
  return <div data-testid="login" data-search={location.search} />;
}

const renderAt = (entry, context = {}) => {
  value = { token: null, user: null, isLoading: false, logout: jest.fn(), invalidateSession: jest.fn(), ...context };
  act(() => {
    root.render(
      <AuthContext.Provider value={value}>
        <MemoryRouter initialEntries={[entry]}>
          <Routes>
            <Route path="/bridge/authorize" element={<BridgeAuthorize />} />
            <Route path="/login" element={<LoginProbe />} />
            <Route path="/dashboard" element={<p>dashboard</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
  });
};
const settle = () => act(async () => { for (let i = 0; i < 10; i += 1) await Promise.resolve(); });
const loginSearch = () => container.querySelector('[data-testid="login"]')?.getAttribute('data-search');

beforeEach(() => {
  api.post.mockReset();
  replace = jest.fn();
  delete window.location;
  window.location = { ...realLocation, replace, assign: jest.fn() };
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

describe('invalid requests get a plain error page and no redirect', () => {
  test.each([
    ['no code_challenge', `/bridge/authorize?state=${STATE}`],
    ['a short code_challenge', `/bridge/authorize?code_challenge=abc&state=${STATE}`],
    ['a code_challenge with padding', `/bridge/authorize?code_challenge=${'A'.repeat(42)}=&state=${STATE}`],
    ['no state', `/bridge/authorize?code_challenge=${CHALLENGE}`],
    ['a state shorter than 16 characters', `/bridge/authorize?code_challenge=${CHALLENGE}&state=short`],
    ['a state with a disallowed character', `/bridge/authorize?code_challenge=${CHALLENGE}&state=${STATE}%2Fx`],
    ['a duplicated state', `/bridge/authorize?code_challenge=${CHALLENGE}&state=${STATE}&state=${STATE}`],
  ])('%s shows the error page, with a link to the dashboard', async (_name, entry) => {
    renderAt(entry, { token: 'Bearer t', user: { username: 'ada' } });
    await settle();
    expect(container.querySelector('h1').textContent).toBe('This sign-in link is incomplete');
    expect(container.querySelector('a[href="/dashboard"]')).not.toBeNull();
    expect(replace).not.toHaveBeenCalled();
    expect(api.post).not.toHaveBeenCalled();
  });

  test('an unknown prompt with a valid challenge and state returns invalid_request to Bridge', async () => {
    renderAt(authorize('&prompt=select_account'), { token: 'Bearer t' });
    await settle();
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#error=invalid_request&state=${STATE}`);
    expect(api.post).not.toHaveBeenCalled();
  });

  test('a duplicated prompt is invalid too', async () => {
    renderAt(authorize('&prompt=login&prompt=none'));
    await settle();
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#error=invalid_request&state=${STATE}`);
  });
});

describe('signed out', () => {
  test('prompt=none returns login_required immediately, with no login page', async () => {
    renderAt(authorize('&prompt=none'));
    await settle();
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#error=login_required&state=${STATE}`);
    expect(loginSearch()).toBeUndefined();
  });

  test('otherwise the user goes to login, and login returns to this same authorize URL', async () => {
    renderAt(authorize());
    await settle();
    expect(replace).not.toHaveBeenCalled();
    const next = new URLSearchParams(loginSearch()).get('next');
    expect(next).toBe(`/bridge/authorize?code_challenge=${CHALLENGE}&state=${STATE}`);
    expect(api.post).not.toHaveBeenCalled();
  });

  test('prompt=login is dropped on the way to login: the user just signed in, so no second chooser follows', async () => {
    renderAt(authorize('&prompt=login'));
    await settle();
    expect(new URLSearchParams(loginSearch()).get('next')).toBe(`/bridge/authorize?code_challenge=${CHALLENGE}&state=${STATE}`);
  });

  test('waits for the session check before deciding, so a stored session is not mistaken for signed out', async () => {
    renderAt(authorize(), { isLoading: true });
    await settle();
    expect(loginSearch()).toBeUndefined();
    expect(replace).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Checking your Plotune session');
  });
});

describe('signed in', () => {
  test('mints the code with the exact JSON and returns it in the fragment with the state', async () => {
    api.post.mockResolvedValue({ data: { code: CODE, expires_in: 60 } });
    const storage = jest.spyOn(Storage.prototype, 'setItem');
    const log = jest.spyOn(console, 'log');
    const err = jest.spyOn(console, 'error');
    renderAt(authorize(), { token: 'Bearer account-token', user: { username: 'ada' } });
    await settle();
    expect(api.post).toHaveBeenCalledWith(
      '/auth/bridge-code',
      { code_challenge: CHALLENGE, code_challenge_method: 'S256' },
      { headers: { Authorization: 'Bearer account-token' } },
    );
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#code=${CODE}&state=${STATE}`);
    expect(window.location.assign).not.toHaveBeenCalled();
    // The code is never logged or stored.
    expect(storage).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
    expect(err).not.toHaveBeenCalled();
  });

  test('shows the signing-in status while the code is minted', async () => {
    let resolve;
    api.post.mockReturnValue(new Promise((r) => { resolve = r; }));
    renderAt(authorize('&prompt=none'), { token: 'Bearer t' });
    await settle();
    const status = container.querySelector('[role="status"]');
    expect(status.textContent).toBe('Signing you in to Plotune Bridge…');
    await act(async () => resolve({ data: { code: CODE, expires_in: 60 } }));
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#code=${CODE}&state=${STATE}`);
  });

  test('a 401 clears the session and follows the signed-out rules (login with next)', async () => {
    api.post.mockRejectedValue({ response: { status: 401 } });
    renderAt(authorize(), { token: 'Bearer stale' });
    await settle();
    expect(value.invalidateSession).toHaveBeenCalledWith('Bearer stale');
    expect(replace).not.toHaveBeenCalled();
    expect(new URLSearchParams(loginSearch()).get('next')).toBe(`/bridge/authorize?code_challenge=${CHALLENGE}&state=${STATE}`);
  });

  test('a 401 with prompt=none returns login_required', async () => {
    api.post.mockRejectedValue({ response: { status: 401 } });
    renderAt(authorize('&prompt=none'), { token: 'Bearer stale' });
    await settle();
    expect(value.invalidateSession).toHaveBeenCalledWith('Bearer stale');
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#error=login_required&state=${STATE}`);
  });

  test.each([
    ['a 422', { response: { status: 422 } }],
    ['a 5xx', { response: { status: 503 } }],
    ['a network failure', new Error('offline')],
  ])('%s returns server_error and keeps the session', async (_name, failure) => {
    api.post.mockRejectedValue(failure);
    renderAt(authorize(), { token: 'Bearer t' });
    await settle();
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#error=server_error&state=${STATE}`);
    expect(value.invalidateSession).not.toHaveBeenCalled();
  });

  test('a malformed code from the API is not passed to Bridge', async () => {
    api.post.mockResolvedValue({ data: { code: 'not a code', expires_in: 60 } });
    renderAt(authorize(), { token: 'Bearer t' });
    await settle();
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#error=server_error&state=${STATE}`);
  });

  test('the return origin is always the Bridge constant, whatever parameters are passed', async () => {
    api.post.mockResolvedValue({ data: { code: CODE, expires_in: 60 } });
    renderAt(authorize('&redirect_uri=https%3A%2F%2Fevil.example%2F&return=https%3A%2F%2Fevil.example&next=%2F%2Fevil.com&bridge=https://evil.example'), { token: 'Bearer t' });
    await settle();
    expect(replace).toHaveBeenCalledTimes(1);
    const target = replace.mock.calls[0][0];
    expect(target.startsWith(`${BRIDGE}#`)).toBe(true);
    expect(target).toBe(`${BRIDGE}#code=${CODE}&state=${STATE}`);
  });
});

describe('prompt=login chooser', () => {
  const chooserContext = { token: 'Bearer t', user: { username: 'ada' } };

  test('shows the signed-in account and asks before continuing', async () => {
    renderAt(authorize('&prompt=login'), chooserContext);
    await settle();
    expect(container.textContent).toContain('You are signed in to Plotune as ada. Continue to Plotune Bridge as ada.');
    expect(api.post).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  test('Continue mints the code and returns it', async () => {
    api.post.mockResolvedValue({ data: { code: CODE, expires_in: 60 } });
    renderAt(authorize('&prompt=login'), chooserContext);
    await settle();
    await act(async () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Continue').click());
    await settle();
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#code=${CODE}&state=${STATE}`);
  });

  test('Use a different account signs out through logout and returns to login without prompt=login', async () => {
    renderAt(authorize('&prompt=login'), chooserContext);
    await settle();
    await act(async () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Use a different account').click());
    expect(value.logout).toHaveBeenCalledTimes(1);
    const target = value.logout.mock.calls[0][0];
    expect(target.startsWith('/login?next=')).toBe(true);
    expect(new URLSearchParams(target.slice('/login?'.length)).get('next')).toBe(`/bridge/authorize?code_challenge=${CHALLENGE}&state=${STATE}`);
    expect(api.post).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  test('Cancel returns access_denied and does not mint', async () => {
    renderAt(authorize('&prompt=login'), chooserContext);
    await settle();
    await act(async () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Cancel').click());
    expect(replace).toHaveBeenCalledWith(`${BRIDGE}#error=access_denied&state=${STATE}`);
    expect(api.post).not.toHaveBeenCalled();
  });
});
