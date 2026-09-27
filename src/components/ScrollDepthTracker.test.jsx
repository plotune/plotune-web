import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }), { virtual: true });

const { posthog } = require('../posthog');
const ScrollDepthTracker = require('./ScrollDepthTracker').default;

const ARM_DELAY_MS = 900;

const setLayout = ({ scrollY, clientHeight, scrollHeight }) => {
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true });
  Object.defineProperty(document.documentElement, 'clientHeight', { value: clientHeight, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: scrollHeight, configurable: true });
};

describe('ScrollDepthTracker', () => {
  let container;

  beforeEach(() => {
    posthog.capture.mockClear();
    jest.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => { container?.root?.unmount?.(); });
    document.body.removeChild(container);
    container = null;
    jest.useRealTimers();
  });

  const renderAt = (path) => {
    act(() => {
      createRoot(container).render(
        <MemoryRouter initialEntries={[path]}><ScrollDepthTracker /></MemoryRouter>
      );
    });
  };

  test('fires every crossed threshold once armed, for a short page, tagged with seconds_since_page_load', () => {
    setLayout({ scrollY: 0, clientHeight: 900, scrollHeight: 900 });
    renderAt('/nexus');

    act(() => { jest.advanceTimersByTime(ARM_DELAY_MS); });

    expect(posthog.capture).toHaveBeenCalledTimes(4);
    expect(posthog.capture).toHaveBeenCalledWith('scroll_depth', { percent: 25, path: '/nexus', seconds_since_page_load: 0.9 });
    expect(posthog.capture).toHaveBeenCalledWith('scroll_depth', { percent: 90, path: '/nexus', seconds_since_page_load: 0.9 });
  });

  test('does not re-fire a threshold already crossed on the same page view', () => {
    setLayout({ scrollY: 0, clientHeight: 900, scrollHeight: 900 });
    renderAt('/nexus');

    act(() => { jest.advanceTimersByTime(ARM_DELAY_MS); });
    expect(posthog.capture).toHaveBeenCalledTimes(4);

    posthog.capture.mockClear();
    act(() => { window.dispatchEvent(new Event('scroll')); });
    act(() => { jest.runOnlyPendingTimers(); });

    expect(posthog.capture).not.toHaveBeenCalled();
  });

  test('only fires thresholds actually reached on a tall, unscrolled page', () => {
    // 900px viewport in a 9000px document, scrolled to the top: 900/9000 = 10%, below every threshold.
    setLayout({ scrollY: 0, clientHeight: 900, scrollHeight: 9000 });
    renderAt('/research');

    act(() => { jest.advanceTimersByTime(ARM_DELAY_MS); });

    expect(posthog.capture).not.toHaveBeenCalled();
  });

  test('ignores a scroll reading before arming, so ScrollToTop\'s scroll-to-zero animation on a route change can\'t misfire a false depth on the new, shorter page', () => {
    // Simulates landing on a short page still carrying a large scrollY left over from the
    // previous, taller page, mid-way through ScrollToTop's smooth scroll back to 0 — exactly
    // the reading that used to fire all four thresholds within milliseconds of the pageview.
    setLayout({ scrollY: 2000, clientHeight: 900, scrollHeight: 1200 });
    renderAt('/nexus');

    act(() => { jest.advanceTimersByTime(ARM_DELAY_MS - 100); });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
