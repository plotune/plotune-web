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

const blur = (sel) => act(() => { container.querySelector(sel).dispatchEvent(new FocusEvent('focusout', { bubbles: true })); });
const buttonByText = (text) => [...container.querySelectorAll('button')].find((b) => b.textContent.trim() === text);

test('starter chips fill an editable opening, disappear once the visitor writes their own text, and are reported by id only', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  render('/contact?product=nexus');
  act(() => { buttonByText('Book a demo').dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  const box = container.querySelector('#contact-message');
  expect(box.value).toMatch(/^We'd like a short demo of Plotune Nexus/);
  expect(buttonByText('Book a demo').getAttribute('aria-pressed')).toBe('true');
  expect(events()).toContain('contact_starter_selected');
  type('#contact-message', `${box.value}Tuesday afternoon`);
  expect(buttonByText('Pricing')).toBeUndefined();
  type('#contact-email', 'eng@corp.com');
  await submit();
  const submitted = posthog.capture.mock.calls.find(([e]) => e === 'contact_form_submitted')[1];
  expect(submitted.starter).toBe('demo');
  expect(JSON.stringify(posthog.capture.mock.calls)).not.toContain('Tuesday afternoon');
});

test('the email is checked on leaving the field, and a provider typo gets a one-tap fix', () => {
  render();
  type('#contact-email', 'nope');
  blur('#contact-email');
  expect(container.textContent).toContain('Enter a valid email');
  type('#contact-email', 'Ayse@gmial.com');
  blur('#contact-email');
  const fix = buttonByText('Ayse@gmail.com');
  expect(fix).toBeTruthy();
  act(() => { fix.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(container.querySelector('#contact-email').value).toBe('Ayse@gmail.com');
  expect(events()).toContain('contact_email_fix_accepted');
  expect(JSON.stringify(posthog.capture.mock.calls)).not.toContain('Ayse@');
  type('#contact-email', 'eng@bosch.com');
  blur('#contact-email');
  expect(container.textContent).not.toContain('Did you mean');
});

test('the reply time is stated, and the confirmation ends on a next step', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  render('/contact?utm_source=google');
  expect(container.textContent).toContain('We reply within 1 business day');
  type('#contact-email', 'eng@corp.com');
  type('#contact-message', 'Hello');
  await submit();
  expect(container.textContent).toContain('within 1 business day.');
  expect(container.textContent).toContain('While you wait');
  const next = [...container.querySelectorAll('[role="status"] a')].find((a) => a.textContent.includes('Check your test bench'));
  expect(next.getAttribute('href')).toMatch(/^\/ai-readiness\?.*entry_source=google/);
  act(() => { next.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(posthog.capture.mock.calls.find(([e]) => e === 'contact_sent_next_clicked')[1]).toMatchObject({ target: 'ai_readiness' });
});

// ---- the page follows the product the visitor is asking about ------------------------------------------
const remember = (ctx) => window.sessionStorage.setItem('plotune_funnel', JSON.stringify(ctx));
const h1 = () => container.querySelector('h1').textContent;
const chips = () => [...container.querySelectorAll('button[aria-pressed]')].map((b) => b.textContent);
const hasAssessment = () => [...container.querySelectorAll('a')].some((a) => a.textContent.includes('Check your test bench'));
const mailtoSubject = () => decodeURIComponent((container.querySelector('a[href^="mailto:contact@plotune.net"]').getAttribute('href').match(/subject=([^&]*)/) || [])[1] || '');
const placeholder = () => container.querySelector('#contact-message').getAttribute('placeholder');
const shown = () => posthog.capture.mock.calls.find(([e]) => e === 'contact_context_shown')[1];

test('with nothing known the page is neutral: it asks about their setup, and the assessment stays available', () => {
  render('/contact');
  expect(h1()).toBe('Tell us about your setup.');
  expect(chips()).toEqual(['Tell us about my setup', 'Book a demo', 'Pricing']);
  expect(hasAssessment()).toBe(true);
  expect(mailtoSubject()).toBe('Inquiry: Plotune');
  expect(placeholder()).toBe('What do you work on, and what would you like to talk about?');
  expect(shown()).toMatchObject({ context: 'neutral', context_source: 'default' });
});

test('Bridge context (from a link): Bridge copy, no Nexus assessment card, topic and closing link follow', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  render('/contact?product=bridge');
  expect(h1()).toBe('Tell us what you need to connect.');
  expect(container.textContent).toContain('We recommend the right Bridge');
  expect(chips()).toEqual(['Which Bridge fits us?', 'Price and availability', 'Use it with Nexus']);
  expect(hasAssessment()).toBe(false);
  expect(mailtoSubject()).toBe('Inquiry: Plotune Bridge');
  expect(placeholder()).toBe('What do you need to connect, and how do you work with it today?');
  type('#contact-email', 'eng@corp.com'); type('#contact-message', 'Two CAN buses and a serial console.');
  await submit();
  expect(postLead.mock.calls[0][0].topic).toBe('Bridge');
  expect(container.textContent).toContain('Message sent');
  expect(hasAssessment()).toBe(false);
  const next = [...container.querySelectorAll('a')].find((a) => a.textContent === 'Or see the Bridge family');
  expect(next.getAttribute('href')).toBe('/bridge');
  expect(shown()).toMatchObject({ context: 'bridge', context_source: 'link' });
});

test('a Bridge model the visitor looked at is named in the chips, the subject and the topic stored in the sheet', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  remember({ product: 'bridge', item: 'Bridge DAQ', entry_source: 'direct' });
  render('/contact');
  expect(h1()).toBe('Tell us what you need to connect.');
  expect(chips()).toContain('Price for Bridge DAQ');
  expect(mailtoSubject()).toBe('Inquiry: Bridge DAQ');
  expect(placeholder()).toContain("We'd like Bridge DAQ for our bench");
  expect(placeholder()).not.toMatch(/automate/);
  act(() => { buttonByText('Price for Bridge DAQ').dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(container.querySelector('#contact-message').value).toMatch(/^We'd like the price and availability for Bridge DAQ\./);
  type('#contact-email', 'eng@corp.com'); await submit();
  expect(postLead.mock.calls[0][0].topic).toBe('Bridge · Bridge DAQ');
  expect(shown()).toMatchObject({ context: 'bridge', context_source: 'session' });
});

test('Stream context: Stream copy, Stream chips, Stream topic, no assessment card', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  remember({ product: 'stream' });
  render('/contact');
  expect(h1()).toBe('Tell us what you need to understand.');
  expect(placeholder()).toBe('Which tools or benches produce your events, and what do you need to find out?');
  expect(chips()).toEqual(['Evaluate Stream for our team', 'Book a demo', 'Pricing']);
  expect(hasAssessment()).toBe(false);
  type('#contact-email', 'eng@corp.com'); type('#contact-message', 'Events from three benches.'); await submit();
  expect(postLead.mock.calls[0][0].topic).toBe('Stream');
  expect([...container.querySelectorAll('a')].find((a) => a.textContent === 'Or see how Plotune Stream works').getAttribute('href')).toBe('/stream');
});

test('Nexus keeps its original copy and the assessment; a solution page still sets the topic', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  render('/contact?solution=can-ecu-testing');
  expect(h1()).toBe('Tell us about your test environment.');
  expect(container.textContent).toContain('We map it to Plotune Nexus');
  expect(placeholder()).toMatch(/^e\.g\. We'd like to automate .+ on our bench…$/); // the original wording, with the solution
  expect(hasAssessment()).toBe(true);
  expect(shown()).toMatchObject({ context: 'nexus', context_source: 'solution' });
  type('#contact-email', 'eng@corp.com'); type('#contact-message', 'CAN bench.'); await submit();
  expect(postLead.mock.calls[0][0].topic).toMatch(/\S/);
  expect(postLead.mock.calls[0][0].topic).not.toBe('Plotune Nexus');
});

test('a link that names the product beats the session memory; an unknown product is ignored', () => {
  remember({ product: 'stream' });
  render('/contact?product=bridge');
  expect(h1()).toBe('Tell us what you need to connect.');
  act(() => root.unmount()); root = createRoot(container);
  render('/contact?product=toasters');
  expect(h1()).toBe('Tell us what you need to understand.'); // falls back to the session product
  window.sessionStorage.clear();
  act(() => root.unmount()); root = createRoot(container);
  render('/contact?product=toasters');
  expect(h1()).toBe('Tell us about your setup.');
});

test('"Asking about" lets a visitor correct a wrong guess in one tap, and the switch is measured', () => {
  remember({ product: 'bridge' });
  render('/contact');
  const links = [...container.querySelectorAll('nav[aria-label="What are you asking about?"] a')];
  expect(links.map((a) => a.textContent)).toEqual(['Nexus', 'Bridge', 'Stream']);
  expect(links.map((a) => a.getAttribute('aria-current'))).toEqual([null, 'true', null]);
  expect(links.map((a) => /[?&]product=(nexus|bridge|stream)/.exec(a.getAttribute('href'))[1])).toEqual(['nexus', 'bridge', 'stream']);
  act(() => { links[2].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); });
  expect(posthog.capture).toHaveBeenCalledWith('contact_context_switched', expect.objectContaining({ from: 'bridge', to: 'stream' }));
});
