import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import VerifyEmail from './VerifyEmail';

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('../services/api', () => ({ __esModule: true, default: { get: jest.fn() } }));

global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
const render = (entry) => act(() => root.render(<MemoryRouter initialEntries={[entry]}><VerifyEmail /></MemoryRouter>));
beforeEach(() => {
  toast.error.mockClear(); api.get.mockReset();
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

test('arriving from registration without a token asks the user to check their email instead of failing', () => {
  render({ pathname: '/verify-email', state: { email: 'engineer@example.test' } });
  expect(container.querySelector('h1').textContent).toBe('Check your email');
  expect(container.textContent).toContain('engineer@example.test');
  expect(toast.error).not.toHaveBeenCalled();
  expect(api.get).not.toHaveBeenCalled();
});

test('a link with neither token nor email is still reported as invalid', () => {
  render('/verify-email');
  expect(container.querySelector('h1').textContent).toBe('Verification Failed');
  expect(toast.error).toHaveBeenCalledWith('Invalid verification link');
});
