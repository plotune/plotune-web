import React, { act, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import Cookies from 'js-cookie';
import api from '../services/api';
import { AuthContext, AuthProvider } from './AuthContext';
jest.mock('../services/api', () => ({ post: jest.fn(), get: jest.fn() }));
jest.mock('js-cookie', () => ({ get: jest.fn(), set: jest.fn(), remove: jest.fn() }));
let container, root, state, errorLog;
function Probe() { state = useContext(AuthContext); return <output>{state.token || 'signed-out'}</output>; }
beforeEach(() => {
  jest.useFakeTimers(); jest.clearAllMocks(); Cookies.get.mockReturnValue('Bearer fixture-token');
  errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.useRealTimers(); errorLog.mockRestore(); });
const mount = async () => { const draw = root.render.bind(root); await act(async () => draw(<AuthProvider><Probe /></AuthProvider>)); };
test('an auth service outage retains the stored token; only a verified 401 clears it', async () => {
  api.post.mockRejectedValue({ response: { status: 503 } }); await mount();
  expect(state.isLoading).toBe(false); expect(state.token).toBe('Bearer fixture-token'); expect(Cookies.remove).not.toHaveBeenCalled();
  act(() => state.invalidateSession('Bearer fixture-token')); expect(state.token).toBeNull(); expect(Cookies.remove).toHaveBeenCalledWith('auth_token');
});
test('invalid account validation clears auth', async () => {
  api.post.mockRejectedValue({ response: { status: 401 } }); await mount(); expect(state.token).toBeNull(); expect(Cookies.remove).toHaveBeenCalled();
});
test('a stale request cannot invalidate a newer signed-in account', async () => {
  api.post.mockRejectedValue({ response: { status: 503 } }); await mount();
  await act(async () => state.login('Bearer new-account-token', { username: 'new account' }));
  act(() => state.invalidateSession('Bearer fixture-token')); expect(state.token).toBe('Bearer new-account-token'); expect(Cookies.remove).not.toHaveBeenCalled();
});
