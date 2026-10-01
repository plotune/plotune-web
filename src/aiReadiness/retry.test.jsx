import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { posthog } from '../posthog';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
jest.mock('../assets/logo.png', () => 'logo.png');
jest.mock('./submission', () => {
  const actual = jest.requireActual('./submission');
  return { ...actual, submitAssessment: jest.fn() };
});
// eslint-disable-next-line import/first
import AiReadinessPage from './AiReadinessPage';
// eslint-disable-next-line import/first
import { submitAssessment } from './submission';

global.IS_REACT_ACT_ENVIRONMENT = true;

test('a retry after a failed/slow send re-uses the same submission id; a new address gets a new one', async () => {
  jest.useFakeTimers();
  window.scrollTo = jest.fn();
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(
    <HelmetProvider><MemoryRouter initialEntries={['/ai-readiness']}><AiReadinessPage /></MemoryRouter></HelmetProvider>,
  ));
  const btn = (t) => [...container.querySelectorAll('button')].find((b) => b.textContent.includes(t));
  const card = (t) => [...container.querySelectorAll('[role]')].find((b) => b.textContent.includes(t) && b.getAttribute('aria-checked') !== null);
  const click = (el) => act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  const type = (v) => act(() => {
    const input = container.querySelector('#ai-readiness-email');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, v);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const submit = () => act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });

  expect(container.textContent).toContain('Plotune'); // wordmark on the intro
  click(btn('Start assessment'));
  click(card('PEAK / PCAN')); click(btn('Continue'));
  click(card('Python')); click(btn('Continue'));
  click(card('Setting up')); click(btn('Continue'));
  click(card('Partially automated'));
  act(() => { jest.advanceTimersByTime(300); });

  submitAssessment.mockResolvedValueOnce({ status: 'error' }).mockResolvedValueOnce({ status: 'error' }).mockResolvedValueOnce({ status: 'sent' });
  type('eng@example.com'); await submit();
  type('ENG@example.com '); await submit(); // same address, retried
  type('other@example.com'); await submit(); // different address
  const ids = submitAssessment.mock.calls.map(([p]) => p.submissionId);
  expect(ids[0]).toBeTruthy();
  expect(ids[1]).toBe(ids[0]);
  expect(ids[2]).not.toBe(ids[0]);
  expect(container.textContent).toContain('Request received');
  expect(posthog.capture.mock.calls.filter(([e]) => e === 'ai_readiness_email_submitted').map(([, p]) => p.delivery)).toEqual(['error', 'error', 'sent']);

  act(() => root.unmount());
  container.remove();
  window.sessionStorage.clear();
  jest.useRealTimers();
});
