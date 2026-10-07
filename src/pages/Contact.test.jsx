import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { posthog } from '../posthog';
import { trackGoogleAdsContactConversion } from '../utils/googleAds';
import ContactPage from './Contact';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
jest.mock('../utils/googleAds', () => ({ trackGoogleAdsContactConversion: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
const render = (url = '/contact') => {
  window.history.replaceState({}, '', url);
  act(() => root.render(<HelmetProvider><MemoryRouter initialEntries={[url]}><ContactPage /></MemoryRouter></HelmetProvider>));
};
beforeEach(() => {
  posthog.capture.mockClear(); trackGoogleAdsContactConversion.mockReset();
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); window.sessionStorage.clear(); });

const findLink = (text) => [...container.querySelectorAll('a')].find((a) => a.textContent.includes(text));

test('the email button stays the primary action and still counts as a Google Ads contact', () => {
  render();
  const email = container.querySelector('a[href^="mailto:contact@plotune.net"]');
  expect(email).toBeTruthy();
  act(() => { email.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); });
  expect(trackGoogleAdsContactConversion).toHaveBeenCalledTimes(1);
});

test('"Not ready to talk yet?" links to the assessment with funnel context and is tracked, without a Google conversion', () => {
  render('/contact?utm_source=google');
  const notReady = findLink('Check your test bench');
  expect(notReady.getAttribute('href')).toMatch(/^\/ai-readiness\?.*entry_source=google/);
  act(() => { notReady.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(posthog.capture.mock.calls.map(([e]) => e)).toContain('contact_assessment_clicked');
  expect(trackGoogleAdsContactConversion).not.toHaveBeenCalled();
});
