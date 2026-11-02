import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { posthog } from '../../posthog';
import BridgeVideo from './BridgeVideo';

jest.mock('../../posthog', () => ({ posthog: { capture: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root; let observerCallback; let queries;
const PHONE = '(max-width: 700px)';
const REDUCED = '(prefers-reduced-motion: reduce)';

beforeEach(() => {
  posthog.capture.mockClear();
  queries = {};
  window.matchMedia = jest.fn((q) => ({ matches: Boolean(queries[q]), media: q, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  global.IntersectionObserver = class { constructor(cb) { observerCallback = cb; } observe() {} disconnect() {} };
  // jsdom doesn't implement media playback: emulate play/pause and their events
  window.HTMLMediaElement.prototype.play = jest.fn(function play() { this.dispatchEvent(new Event('play')); return Promise.resolve(); });
  window.HTMLMediaElement.prototype.pause = jest.fn(function pause() { this.dispatchEvent(new Event('pause')); });
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

const render = () => act(() => root.render(<BridgeVideo />));
const video = () => container.querySelector('video');
const sources = () => [...container.querySelectorAll('video source')].map((s) => s.getAttribute('src'));
const see = (visible) => act(() => observerCallback([{ isIntersecting: visible }]));
const button = () => container.querySelector('.bridge-film-toggle');
const click = (el) => act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true })); });

test('wide cut by default: WebM first, MP4 fallback, muted, looping, inline, fetched only when needed', () => {
  render();
  expect(sources()).toEqual(['/assets/bridge/video/bridge-family.webm', '/assets/bridge/video/bridge-family.mp4']);
  const v = video();
  expect(v.muted).toBe(true); expect(v.loop).toBe(true);
  expect(v.hasAttribute('playsinline')).toBe(true);
  expect(v.hasAttribute('autoplay')).toBe(false);
  expect(v.getAttribute('preload')).toBe('none');
  expect(v.getAttribute('aria-label')).toMatch(/Plotune Bridge/);
});

test('the poster is chosen by CSS media query, so the right crop shows before any script runs', () => {
  render();
  const picture = container.querySelector('picture');
  expect(picture.querySelector('source').getAttribute('media')).toBe(PHONE);
  expect(picture.querySelector('source').getAttribute('srcset')).toBe('/assets/bridge/video/bridge-family-mobile-poster.jpg');
  expect(picture.querySelector('img').getAttribute('src')).toBe('/assets/bridge/video/bridge-family-poster.jpg');
});

test('phones get the separate vertical cut', () => {
  queries[PHONE] = true;
  render();
  expect(sources()).toEqual(['/assets/bridge/video/bridge-family-mobile.webm', '/assets/bridge/video/bridge-family-mobile.mp4']);
});

test('plays when it scrolls into view, pauses when it leaves, and counts one start', () => {
  render();
  expect(window.HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  see(true);
  expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
  expect(button().getAttribute('aria-label')).toBe('Pause the film');
  see(false);
  expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  see(true);
  expect(posthog.capture.mock.calls.filter(([e]) => e === 'bridge_video_started')).toHaveLength(1);
});

test("a visitor's pause is respected, even after scrolling away and back", () => {
  render(); see(true);
  click(button());
  expect(button().getAttribute('aria-label')).toBe('Play the film');
  expect(posthog.capture).toHaveBeenCalledWith('bridge_video_paused', expect.objectContaining({ cut: 'wide' }));
  window.HTMLMediaElement.prototype.play.mockClear();
  see(false); see(true);
  expect(window.HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  click(button()); // and the visitor can start it again
  expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
});

test('with reduced motion it never autoplays, but the button still plays it', () => {
  queries[REDUCED] = true;
  render(); see(true);
  expect(window.HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  click(button());
  expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
});

test('a blocked autoplay (rejected play promise) leaves the poster and does not throw', async () => {
  window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.reject(new Error('NotAllowedError')));
  render();
  await act(async () => { observerCallback([{ isIntersecting: true }]); });
  expect(button().getAttribute('aria-label')).toBe('Play the film');
});
