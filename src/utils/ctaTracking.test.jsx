import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useCtaTracking } from './ctaTracking';
import { posthog } from '../posthog';

jest.mock('react-router-dom', () => ({ useLocation: () => ({ pathname: '/nexus' }) }));
jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));

global.IS_REACT_ACT_ENVIRONMENT = true;

let observers;
beforeEach(() => {
  observers = [];
  posthog.capture.mockClear();
  global.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; this.disconnected = false; observers.push(this); }
    observe(node) { this.node = node; }
    disconnect() { this.disconnected = true; }
    show() { this.cb([{ isIntersecting: true }]); }
  };
});
afterEach(() => { document.body.innerHTML = ''; });

const Probe = ({ late = false, ctaId = 'x_cta', props }) => {
  const { ref } = useCtaTracking(ctaId, props);
  const [ready, setReady] = useState(!late);
  Probe.ready = () => setReady(true);
  return ready ? <a ref={ref} href="/contact">go</a> : <p>loading</p>;
};

const mount = (el) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(el));
  return { container, root };
};

test('fires nothing until the CTA is scrolled into view, then exactly once', () => {
  const { root } = mount(<Probe />);
  expect(posthog.capture).not.toHaveBeenCalled();

  act(() => observers[0].show());
  expect(posthog.capture).toHaveBeenCalledTimes(1);
  expect(posthog.capture).toHaveBeenCalledWith('cta_impression', expect.objectContaining({ cta_id: 'x_cta', path: '/nexus' }));
  expect(observers[0].disconnected).toBe(true);

  act(() => root.unmount());
});

test('observes a CTA that mounts after the first render (article CTA behind async content)', () => {
  const { root } = mount(<Probe late props={{ article: 'a1', destination: '/solutions/s' }} />);
  expect(observers).toHaveLength(0);

  act(() => Probe.ready());
  expect(observers).toHaveLength(1);

  act(() => observers[0].show());
  expect(posthog.capture).toHaveBeenCalledWith('cta_impression', expect.objectContaining({ cta_id: 'x_cta', article: 'a1', destination: '/solutions/s' }));

  act(() => root.unmount());
});

test('disconnects the observer when the CTA unmounts without being seen', () => {
  const { root } = mount(<Probe />);
  act(() => root.unmount());
  expect(observers[0].disconnected).toBe(true);
  expect(posthog.capture).not.toHaveBeenCalled();
});
