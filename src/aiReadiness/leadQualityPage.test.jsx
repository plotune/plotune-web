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
jest.mock('../utils/googleAds', () => ({ trackGoogleAdsAiReadinessConversion: jest.fn(() => true) }));
// eslint-disable-next-line import/first
import AiReadinessPage from './AiReadinessPage';
// eslint-disable-next-line import/first
import { submitAssessment } from './submission';
// eslint-disable-next-line import/first
import { trackGoogleAdsAiReadinessConversion } from '../utils/googleAds';

global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
beforeEach(() => {
  jest.useFakeTimers();
  window.scrollTo = jest.fn();
  posthog.capture.mockClear();
  trackGoogleAdsAiReadinessConversion.mockReset().mockReturnValue(true);
  submitAssessment.mockReset().mockResolvedValue({ status: 'sent' });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(
    <HelmetProvider><MemoryRouter initialEntries={['/ai-readiness']}><AiReadinessPage /></MemoryRouter></HelmetProvider>,
  ));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.sessionStorage.clear();
  jest.useRealTimers();
});

const btn = (t) => [...container.querySelectorAll('button')].find((b) => b.textContent.includes(t));
const card = (t) => [...container.querySelectorAll('[role="checkbox"],[role="radio"]')].find((b) => b.textContent.includes(t));
const click = (el) => act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
const wait = (ms) => act(() => { jest.advanceTimersByTime(ms); });
const propsOf = (name) => posthog.capture.mock.calls.find(([n]) => n === name)[1];

const run = (picks, ms) => {
  click(btn('Start assessment'));
  picks.slice(0, 3).forEach((label) => { click(card(label)); wait(ms); click(btn('Continue')); });
  click(card(picks[3]));
  wait(300);
};
const submitEmail = async (email) => {
  const input = container.querySelector('#ai-readiness-email');
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, email);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
};

test('a careless tap-through still sees the score, but no email form', () => {
  run(['Serial / UART', 'CANoe / CANalyzer', 'Setting up', 'Mostly manual'], 600);
  expect(container.querySelector('[data-score]')).toBeTruthy();
  expect(container.querySelector('#ai-readiness-email')).toBeNull();
  expect(container.textContent).toContain('Explore Plotune Nexus');
  expect(propsOf('ai_readiness_score_shown')).toMatchObject({ email_capture_shown: false, lead_quality_flags: expect.arrayContaining(['first_options', 'too_fast']) });
  click([...container.querySelectorAll('a')].find((a) => a.textContent.includes('Explore Plotune Nexus')));
  expect(propsOf('ai_readiness_nexus_clicked')).toMatchObject({ from: 'result_no_email' });
});

test('a considered run with a work email is sent with its quality and counts as an ad conversion', async () => {
  run(['PEAK / PCAN', 'Python / custom scripts', 'Investigating failed tests', 'Partially automated'], 4000);
  await submitEmail('eng@bosch.com');
  expect(submitAssessment.mock.calls[0][0].quality).toMatchObject({ score: 100, flags: [], countsAsAdConversion: true });
  expect(trackGoogleAdsAiReadinessConversion).toHaveBeenCalledTimes(1);
  expect(propsOf('ai_readiness_email_submitted')).toMatchObject({ google_ads_conversion: true, lead_quality_score: 100 });
});

test('a placeholder address is saved as a lead, but not reported to Google Ads', async () => {
  run(['PEAK / PCAN', 'Python / custom scripts', 'Investigating failed tests', 'Partially automated'], 4000);
  await submitEmail('name@company.com');
  expect(container.textContent).toContain('Request received');
  expect(submitAssessment.mock.calls[0][0].quality).toMatchObject({ countsAsAdConversion: false, flags: ['placeholder_email'] });
  expect(trackGoogleAdsAiReadinessConversion).not.toHaveBeenCalled();
  expect(propsOf('ai_readiness_email_submitted')).toMatchObject({ google_ads_conversion: false });
});
