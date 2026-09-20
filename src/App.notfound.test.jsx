import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
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

  const renderAt = (path) => {
    window.history.replaceState({}, '', path);
    act(() => {
      createRoot(container).render(<App />);
    });
  };

  test('renders the 404 page for an unknown path like /contact/asd', () => {
    renderAt('/contact/asd');
    expect(container.textContent).toContain("We couldn't find that page.");
    expect(container.textContent).toContain('Go to the homepage');
    expect(container.textContent).toContain('Read the docs');
    // Header/Footer still wrap the 404 page
    expect(container.querySelector('header')).not.toBeNull();
    expect(container.querySelector('footer')).not.toBeNull();
  });

  test('a known route still renders its own page', () => {
    renderAt('/nexus');
    expect(container.textContent).toContain('Plotune Nexus');
  });
});
