import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AiReadinessPage from './AiReadinessPage';
import { posthog } from '../posthog';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
jest.mock('../assets/logo.png', () => 'logo.png');

global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

beforeEach(() => {
  jest.useFakeTimers();
  window.scrollTo = jest.fn();
  posthog.capture.mockClear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/ai-readiness?utm_source=linkedin']}>
        <AiReadinessPage />
      </MemoryRouter>
    </HelmetProvider>,
  ));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
  window.sessionStorage.clear();
});

const text = () => container.textContent;
const button = (label) => [...container.querySelectorAll('button')].find((b) => b.textContent.includes(label));
const card = (label) => [...container.querySelectorAll('[role="checkbox"],[role="radio"]')].find((b) => b.textContent.includes(label));
const click = (el) => act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
const events = () => posthog.capture.mock.calls.map(([name]) => name);
const propsOf = (name) => posthog.capture.mock.calls.find(([n]) => n === name)[1];

const completeAll = () => {
  click(button('Start assessment'));
  click(card('PEAK / PCAN')); click(button('Continue'));
  click(card('Python / custom scripts')); click(button('Continue'));
  click(card('Investigating failed tests')); click(button('Continue'));
  click(card('Partially automated'));
  act(() => { jest.advanceTimersByTime(300); });
};

test('entry screen shows one dominant action and no assessment questions yet', () => {
  expect(text()).toContain('How AI-ready is your test bench?');
  expect(text()).toContain('4 questions. ~30 seconds.');
  expect(button('Start assessment')).toBeTruthy();
  expect(container.querySelectorAll('[role="checkbox"]').length).toBe(0);
  expect(events()).toEqual(['ai_readiness_viewed']);
});

test('multi-select needs an explicit Continue, and Continue is disabled until something is selected', () => {
  click(button('Start assessment'));
  expect(text()).toContain('1 / 4');
  const cont = button('Continue');
  expect(cont.disabled).toBe(true);

  click(card('PEAK / PCAN'));
  click(card('Ethernet / DoIP'));
  expect(card('PEAK / PCAN').getAttribute('aria-checked')).toBe('true');
  expect(text()).toContain('1 / 4'); // no accidental advance
  expect(text()).toContain('2 selected');

  click(button('Continue'));
  expect(text()).toContain('2 / 4');
});

test('Other reveals an optional text input; deselecting Other clears it', () => {
  click(button('Start assessment'));
  expect(container.querySelector('input[type="text"]')).toBeNull();
  click(card('Other / Custom hardware'));
  const input = container.querySelector('input[type="text"]');
  expect(input).toBeTruthy();
  expect(button('Continue').disabled).toBe(false); // free text is optional
  click(card('Other / Custom hardware'));
  expect(container.querySelector('input[type="text"]')).toBeNull();
});

test('question 3 caps at two selections without an error and lets the user swap', () => {
  click(button('Start assessment'));
  click(card('PEAK / PCAN')); click(button('Continue'));
  click(card('Python / custom scripts')); click(button('Continue'));

  click(card('Setting up and configuring tests'));
  click(card('Running repetitive test sequences'));
  expect(text()).toContain('2 of 2 selected');

  const third = card('Preparing reports');
  expect(third.getAttribute('aria-disabled')).toBe('true');
  click(third);
  expect(third.getAttribute('aria-checked')).toBe('false');
  expect(container.querySelector('[role="alert"]')).toBeNull();

  click(card('Running repetitive test sequences')); // deselect one
  expect(third.getAttribute('aria-disabled')).toBeNull();
  click(third);
  expect(third.getAttribute('aria-checked')).toBe('true');
});

test('back preserves earlier selections and the progress indicator follows the step', () => {
  click(button('Start assessment'));
  click(card('Kvaser / IXXAT')); click(button('Continue'));
  expect(container.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('2');
  click(button('Back'));
  expect(text()).toContain('1 / 4');
  expect(card('Kvaser / IXXAT').getAttribute('aria-checked')).toBe('true');
  expect(events()).toContain('ai_readiness_back_clicked');
});

test('single-select question auto-advances to the score, which appears before the email gate', () => {
  completeAll();
  const score = container.querySelector('[data-score]');
  expect(score).toBeTruthy();
  expect(text()).toContain('AI-ready');
  expect(text()).toContain('Want to know what’s holding your setup back?');
  // Score precedes the email request in document order.
  expect(container.innerHTML.indexOf('data-score')).toBeLessThan(container.innerHTML.indexOf('Work email'));
});

test('funnel events fire in order with structured, PII-free properties', () => {
  completeAll();
  expect(events()).toEqual([
    'ai_readiness_viewed',
    'ai_readiness_started',
    'ai_readiness_q1_completed',
    'ai_readiness_q2_completed',
    'ai_readiness_q3_completed',
    'ai_readiness_q4_completed',
    'ai_readiness_score_shown',
  ]);
  expect(propsOf('ai_readiness_q1_completed')).toMatchObject({ interfaces: ['peak_pcan'], interfaces_other_provided: false });
  expect(propsOf('ai_readiness_q4_completed')).toMatchObject({ automation_level: 'partial' });
  const shown = propsOf('ai_readiness_score_shown');
  expect(shown).toMatchObject({ assessment_coverage: '4/4', automation_level: 'partial' });
  expect(Number.isInteger(shown.readiness_score)).toBe(true);
});

test('custom "Other" text is never sent to PostHog, only that it was provided', () => {
  click(button('Start assessment'));
  click(card('Other / Custom hardware'));
  const input = container.querySelector('input[type="text"]');
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'secret proprietary rig');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  click(button('Continue'));
  expect(propsOf('ai_readiness_q1_completed')).toMatchObject({ interfaces: ['other'], interfaces_other_provided: true });
  expect(JSON.stringify(posthog.capture.mock.calls)).not.toContain('secret proprietary rig');
});

test('email: validates, never reaches PostHog, and is honest that nothing was sent without an endpoint', async () => {
  completeAll();
  const input = container.querySelector('#ai-readiness-email');
  const setValue = (v) => act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, v);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  setValue('not-an-email');
  await act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/valid email/);
  expect(events()).not.toContain('ai_readiness_email_submitted');
  expect(events()).toContain('ai_readiness_email_started');

  setValue('eng@example.com');
  await act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
  expect(text()).toContain('nothing was sent');
  expect(propsOf('ai_readiness_email_submitted')).toMatchObject({ delivery: 'not_configured' });
  expect(JSON.stringify(posthog.capture.mock.calls)).not.toContain('eng@example.com');
});
