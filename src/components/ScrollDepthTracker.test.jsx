import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

// Not { virtual: true }: ../posthog is a real module, and a virtual mock of a real module is
// intermittently not applied (the real client then loads and capture() is never the mock).
jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));

const { posthog } = require('../posthog');
const ScrollDepthTracker = require('./ScrollDepthTracker').default;

const SETTLE_MS = 700;

const setLayout = ({ scrollY, clientHeight, scrollHeight }) => {
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true });
  Object.defineProperty(document.documentElement, 'clientHeight', { value: clientHeight, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: scrollHeight, configurable: true });
};

describe('ScrollDepthTracker', () => {
  let container;
  let root;

  beforeEach(() => {
    posthog.capture.mockClear();
    jest.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Unmounting is what actually runs the effect cleanup (removeEventListener,
    // clearTimeout) — removing the container node from the DOM does not. Without this,
    // each test's scroll listener and pending timer leak into every later test in the file.
    act(() => { root.unmount(); });
    document.body.removeChild(container);
    container = null;
    root = null;
    jest.useRealTimers();
  });

  const renderAt = (path) => {
    act(() => {
      root = createRoot(container);
      root.render(
        <MemoryRouter initialEntries={[path]}><ScrollDepthTracker /></MemoryRouter>
      );
    });
  };

  test('fires every crossed threshold once settled, for a short page, tagged with seconds_since_page_load', () => {
    setLayout({ scrollY: 0, clientHeight: 900, scrollHeight: 900 });
    renderAt('/nexus');

    act(() => { jest.advanceTimersByTime(SETTLE_MS); });

    expect(posthog.capture).toHaveBeenCalledTimes(4);
    expect(posthog.capture).toHaveBeenCalledWith('scroll_depth', { percent: 25, path: '/nexus', seconds_since_page_load: 0.7 });
    expect(posthog.capture).toHaveBeenCalledWith('scroll_depth', { percent: 90, path: '/nexus', seconds_since_page_load: 0.7 });
  });

  test('does not re-fire a threshold already crossed on the same page view', () => {
    setLayout({ scrollY: 0, clientHeight: 900, scrollHeight: 900 });
    renderAt('/nexus');

    act(() => { jest.advanceTimersByTime(SETTLE_MS); });
    expect(posthog.capture).toHaveBeenCalledTimes(4);

    posthog.capture.mockClear();
    act(() => { window.dispatchEvent(new Event('scroll')); });
    act(() => { jest.advanceTimersByTime(SETTLE_MS); });

    expect(posthog.capture).not.toHaveBeenCalled();
  });

  test('only fires thresholds actually reached on a tall, unscrolled page', () => {
    // 900px viewport in a 9000px document, scrolled to the top: 900/9000 = 10%, below every threshold.
    setLayout({ scrollY: 0, clientHeight: 900, scrollHeight: 9000 });
    renderAt('/research');

    act(() => { jest.advanceTimersByTime(SETTLE_MS); });

    expect(posthog.capture).not.toHaveBeenCalled();
  });

  test('fires thresholds incrementally as a reader actually scrolls and pauses, not all at once', () => {
    // 900px viewport, 9000px document.
    setLayout({ scrollY: 0, clientHeight: 900, scrollHeight: 9000 });
    renderAt('/research');
    act(() => { jest.advanceTimersByTime(SETTLE_MS); });
    expect(posthog.capture).not.toHaveBeenCalled(); // 10%, below every threshold

    // Scrolls down to 30% and pauses to read.
    setLayout({ scrollY: 1800, clientHeight: 900, scrollHeight: 9000 });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    act(() => { jest.advanceTimersByTime(SETTLE_MS); });
    expect(posthog.capture).toHaveBeenCalledTimes(1);
    expect(posthog.capture).toHaveBeenCalledWith('scroll_depth', expect.objectContaining({ percent: 25 }));

    // Later, scrolls further to 80% and pauses again.
    posthog.capture.mockClear();
    setLayout({ scrollY: 6300, clientHeight: 900, scrollHeight: 9000 });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    act(() => { jest.advanceTimersByTime(SETTLE_MS); });
    expect(posthog.capture).toHaveBeenCalledTimes(2);
    expect(posthog.capture).toHaveBeenCalledWith('scroll_depth', expect.objectContaining({ percent: 50 }));
    expect(posthog.capture).toHaveBeenCalledWith('scroll_depth', expect.objectContaining({ percent: 75 }));
  });

  test('ignores transient positions during ScrollToTop\'s reset animation on a route change, measuring only once it actually settles', () => {
    // Mid-animation: a large scrollY left over from the previous, taller page, against the
    // new short page's DOM — the exact reading that used to fire a false 100% instantly.
    setLayout({ scrollY: 2000, clientHeight: 900, scrollHeight: 1200 });
    renderAt('/nexus');

    // The animation keeps moving and firing scroll events, each one pushing the settle
    // point later, so it never actually gets a chance to evaluate.
    act(() => { jest.advanceTimersByTime(200); });
    setLayout({ scrollY: 1200, clientHeight: 900, scrollHeight: 1200 });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    act(() => { jest.advanceTimersByTime(200); });
    setLayout({ scrollY: 400, clientHeight: 900, scrollHeight: 1200 });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    act(() => { jest.advanceTimersByTime(200); });
    expect(posthog.capture).not.toHaveBeenCalled();

    // The animation actually finishes at scrollY 0 and stays there.
    setLayout({ scrollY: 0, clientHeight: 900, scrollHeight: 1200 });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    act(() => { jest.advanceTimersByTime(SETTLE_MS); });

    // Resting at the top of this short page already shows 75% of its content (900/1200) —
    // a real reading of the final state, not the false 100% the mid-animation value implied.
    expect(posthog.capture).toHaveBeenCalledTimes(3);
    expect(posthog.capture).toHaveBeenCalledWith('scroll_depth', expect.objectContaining({ percent: 75 }));
    expect(posthog.capture).not.toHaveBeenCalledWith('scroll_depth', expect.objectContaining({ percent: 90 }));
  });
});
