import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { posthog } from '../posthog';
import { postLead } from '../utils/leadSubmission';
import { trackGoogleAdsContactConversion } from '../utils/googleAds';
import ContactPage from './Contact';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
jest.mock('../utils/googleAds', () => ({ trackGoogleAdsContactConversion: jest.fn(() => true) }));
jest.mock('../utils/leadSubmission', () => ({ ...jest.requireActual('../utils/leadSubmission'), postLead: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
const render = (url = '/contact') => {
  window.history.replaceState({}, '', url);
  act(() => root.render(<HelmetProvider><MemoryRouter initialEntries={[url]}><ContactPage /></MemoryRouter></HelmetProvider>));
};
beforeEach(() => {
  posthog.capture.mockClear(); postLead.mockReset(); trackGoogleAdsContactConversion.mockReset(); trackGoogleAdsContactConversion.mockReturnValue(true);
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); window.sessionStorage.clear(); });

const type = (sel, value) => act(() => {
  const el = container.querySelector(sel);
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
});
const submit = () => act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
const events = () => posthog.capture.mock.calls.map(([e]) => e);

test('the form is the primary action; email stays as a fallback; not-ready links to the assessment with funnel context', () => {
  render('/contact?utm_source=google');
  expect(container.querySelector('#contact-email')).toBeTruthy();
  expect(container.querySelector('#contact-message')).toBeTruthy();
  expect([...container.querySelectorAll('button[type="submit"]')].map((b) => b.textContent)).toEqual(['Send message']);
  expect(container.querySelector('a[href^="mailto:contact@plotune.net"]')).toBeTruthy();
  const notReady = [...container.querySelectorAll('a')].find((a) => a.textContent.includes('Check your test bench'));
  expect(notReady.getAttribute('href')).toMatch(/^\/ai-readiness\?.*entry_source=google/);
  act(() => { notReady.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(events()).toContain('contact_assessment_clicked');
});

test('validates without sending: bad email, empty message', async () => {
  render();
  type('#contact-email', 'nope');
  await submit();
  expect(container.textContent).toContain('Enter a valid email');
  type('#contact-email', 'eng@corp.com');
  await submit();
  expect(container.textContent).toContain('Tell us briefly');
  expect(postLead).not.toHaveBeenCalled();
});

test('a sent message: contact payload with topic, Kişi conversion, confirmation; no email or text in analytics', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  render('/contact?solution=can-ecu-testing');
  type('#contact-email', 'Eng@Corp.com');
  type('#contact-message', 'We run CANoe benches and want to automate regression.');
  await submit();
  const [payload] = postLead.mock.calls[0];
  expect(payload).toMatchObject({ kind: 'contact', email: 'Eng@Corp.com', message: 'We run CANoe benches and want to automate regression.', page: '/contact', website: '' });
  expect(payload.topic).toBeTruthy();
  expect(payload.submissionId).toBeTruthy();
  expect(trackGoogleAdsContactConversion).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain('Message sent');
  expect(events()).toEqual(expect.arrayContaining(['contact_form_started', 'contact_form_submitted']));
  const submitted = posthog.capture.mock.calls.find(([e]) => e === 'contact_form_submitted')[1];
  expect(submitted).toMatchObject({ delivery: 'sent', google_ads_conversion: true });
  const analytics = JSON.stringify(posthog.capture.mock.calls);
  expect(analytics).not.toContain('Eng@Corp.com');
  expect(analytics).not.toContain('CANoe benches');
});

test('a failed send keeps the text, offers retry and the email fallback, fires no conversion; the retry reuses the id', async () => {
  postLead.mockResolvedValueOnce({ status: 'error' }).mockResolvedValueOnce({ status: 'sent' });
  render();
  type('#contact-email', 'eng@corp.com');
  type('#contact-message', 'Hello');
  await submit();
  expect(container.textContent).toContain('couldn’t send that'.replace('’', "'"));
  expect(container.querySelector('#contact-message').value).toBe('Hello');
  expect(trackGoogleAdsContactConversion).not.toHaveBeenCalled();
  await submit();
  expect(postLead.mock.calls[1][0].submissionId).toBe(postLead.mock.calls[0][0].submissionId);
  expect(trackGoogleAdsContactConversion).toHaveBeenCalledTimes(1);
});
