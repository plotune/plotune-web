import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

jest.mock('react-toastify/dist/ReactToastify.css', () => ({}));

import App from './App';

// Jakob regression guard: any unknown URL (e.g. /contact/asd) must render the
// real 404 page with a way forward — never a silent blank middle.
describe('App routing — catch-all 404', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      container?.root?.unmount?.();
    });
    document.body.removeChild(container);
    container = null;
  });

  // Most pages are route-split with React.lazy (see App.js), so mounting App
  // suspends until that chunk resolves -- an async act() flushes it, same as
  // a real browser resolving the dynamic import.
  const renderAt = async (path) => {
    window.history.replaceState({}, '', path);
    await act(async () => {
      createRoot(container).render(<App />);
    });
  };

  test('renders the 404 page for an unknown path like /contact/asd', async () => {
    await renderAt('/contact/asd');
    expect(container.textContent).toContain("We couldn't find that page.");
    expect(container.textContent).toContain('Go to the homepage');
    expect(container.textContent).toContain('Read the docs');
    // Header/Footer still wrap the 404 page
    expect(container.querySelector('header')).not.toBeNull();
    expect(container.querySelector('footer')).not.toBeNull();
  });

  test('a known route still renders its own page', async () => {
    await renderAt('/nexus');
    expect(container.textContent).toContain('Plotune Nexus');
  });
});
