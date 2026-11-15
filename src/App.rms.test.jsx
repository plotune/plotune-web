import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

jest.mock('react-toastify/dist/ReactToastify.css', () => ({}));
jest.mock('./rms/RmsWorkspace', () => ({ __esModule: true, default: () => <main data-testid="rms-page">RMS page</main> }));

import App from './App';

// The RMS route is an app under the site header: the footer is left out, and a '#/...' hash (the RMS
// app's own route) must not be read as a CSS selector by the scroll handling.
describe('App routing: /rms', () => {
  let container;
  let root;
  beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); window.scrollTo = jest.fn(); });
  afterEach(() => { act(() => root?.unmount()); document.body.removeChild(container); });
  const renderAt = async (path) => {
    window.history.replaceState({}, '', path);
    root = createRoot(container);
    await act(async () => { root.render(<App />); });
  };

  test.each(['/rms', '/rms/w1/p1', '/rms/w1/p1/'])('%s renders the RMS page under the site header, without the site footer', async (path) => {
    await renderAt(path);
    expect(container.querySelector('[data-testid="rms-page"]')).not.toBeNull();
    expect(container.querySelector('header')).not.toBeNull();
    expect(container.querySelector('footer')).toBeNull();
    expect(container.querySelector('.app.site-app')).not.toBeNull();
  });

  test('another page keeps its footer', async () => {
    await renderAt('/nexus');
    expect(container.querySelector('footer')).not.toBeNull();
  });

  test('an in-app hash route does not break the page or move it', async () => {
    await renderAt('/rms/w1/p1#/PRD-S/flow');
    expect(container.querySelector('[data-testid="rms-page"]')).not.toBeNull();
    window.scrollTo.mockClear();
    await act(async () => {
      window.history.pushState({}, '', '/rms/w1/p1#/PRD-S/requirements');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(container.querySelector('[data-testid="rms-page"]')).not.toBeNull();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
